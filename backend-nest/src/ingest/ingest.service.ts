import type { Client as ESClient } from "@elastic/elasticsearch";
import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { firstValueFrom } from "rxjs";
import type { z } from "zod";
import {
  courses as coursesTable,
  type InsertCourse,
} from "../../../types/database/schema";
import {
  CoursePlanSchema,
  CourseSchema,
  CoursesSchema,
  type Document,
} from "../../../types/ingest/schemas";
import { DRIZZLE } from "../database/drizzle.module";
import { ES } from "../search/elastic-search.module";

const INDEX = "courses";

@Injectable()
export class IngestService {
  private readonly logger = new Logger(IngestService.name);
  private fxp = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: true,
    parseTagValue: true,
  });

  constructor(
    private readonly http: HttpService,
    @Inject(DRIZZLE) private readonly db: NeonHttpDatabase,
    @Inject(ES) private readonly es: ESClient,
  ) {}

  async runFullIngest() {
    this.logger.log("Starting full ingest process");
    try {
      this.logger.log("Fetching courses from KTH API...");
      const courses = await this.getCourses();
      this.logger.log(`Fetched ${courses.length} courses`);

      this.logger.log("Converting courses...");
      const converted = this.convertCourses(courses as InsertCourse[]);

      this.logger.log("Upserting courses to database...");
      await this.upsertCourses(converted);
      this.logger.log("Courses upserted successfully");

      this.logger.log("Getting bulk documents for Elasticsearch...");
      const docs = await this.getBulkDocs(converted);
      this.logger.log(`Prepared ${docs.length} documents for indexing`);

      this.logger.log("Indexing documents to Elasticsearch...");
      await this.indexBulk(docs);
      this.logger.log("Full ingest process completed successfully");
    } catch (error) {
      this.logger.error("Ingest process failed:", error);
      throw error;
    }
  }

  async runElasticTest() {
    this.logger.log("Starting elastic test process");
    try {
      this.logger.log("Fetching courses from KTH API...");
      const courses = await this.getCourses();
      this.logger.log(`Fetched ${courses.length} courses`);

      this.logger.log("Converting courses...");
      const converted = this.convertCourses(courses as InsertCourse[]);

      this.logger.log("Getting a single document for Elasticsearch...");
      const firstEstablished = converted.find((c) => c.state === "ESTABLISHED");
      const candidate = firstEstablished ?? converted[0];
      const docs = await this.getBulkDocs(candidate ? [candidate] : []);
      this.logger.log(`Prepared ${docs.length} document for indexing`);

      this.logger.log("Indexing documents to Elasticsearch...");
      await this.indexBulk(docs);
      this.logger.log("Elastic test process completed successfully");
    } catch (error) {
      this.logger.error("Elastic test process failed:", error);
      throw error;
    }
  }

  private async getCourses() {
    const endpoint = "https://api.kth.se/api/kopps/v2/courses?l=en";
    const { data } = await firstValueFrom(this.http.get(endpoint));
    return CoursesSchema.parse(data);
  }

  private convertCourses(
    courses: z.infer<typeof CoursesSchema>,
  ): InsertCourse[] {
    return courses.map((course) => ({
      code: course.code,
      department: course.department,
      name: course.name,
      state: course.state,
      lastExaminationSemester: course.last_examination_semester,
    })) as InsertCourse[];
  }

  private async upsertCourses(courses: InsertCourse[]) {
    const chunkSize = 1000;
    for (let i = 0; i < courses.length; i += chunkSize) {
      const chunk = courses.slice(i, i + chunkSize);
      await this.db
        .insert(coursesTable)
        .values(chunk)
        .onConflictDoUpdate({
          target: coursesTable.code,
          set: {
            department: sql`excluded.department`,
            name: sql`excluded.name`,
            state: sql`excluded.state`,
            lastExaminationSemester: sql`excluded.last_examination_semester`,
            updatedAt: sql`now()`,
          },
        });
    }
  }

  private async getCourseDescription(course: z.infer<typeof CourseSchema>) {
    const endpoint = `https://api.kth.se/api/kopps/v1/course/${course.code}/plan`;
    await new Promise((r) => setTimeout(r, 200));
    const res = await firstValueFrom(
      this.http.get(endpoint, { responseType: "text" }),
    );
    const xml = res.data as string;

    const valid = XMLValidator.validate(xml);
    if (valid !== true) {
      const preview = xml.slice(0, 400).replace(/\s+/g, " ");
      throw new Error(
        `Invalid XML. Validator: ${JSON.stringify(valid)}. Preview: ${preview}`,
      );
    }

    const jsonObj = this.fxp.parse(xml);
    const parsed = CoursePlanSchema.parse(jsonObj);
    return parsed;
  }

  private jsonToDocument(
    coursePlan: z.infer<typeof CoursePlanSchema>,
    course: z.infer<typeof CourseSchema>,
  ): Document {
    const goals = coursePlan.coursePlan.goals.find(
      (g) => g["@_xml:lang"] === "en",
    )?.["#text"];
    const content = coursePlan.coursePlan.content.find(
      (c) => c["@_xml:lang"] === "en",
    )?.["#text"];
    return {
      course_name: course.name,
      course_code: course.code,
      department: course.department,
      state: course.state,
      goals: goals || "",
      content: content || "",
    };
  }

  private async ensureIndex() {
    try {
      await this.es.indices.create({
        index: INDEX,
        settings: { number_of_shards: 1, number_of_replicas: 1 },
        mappings: {
          dynamic: "strict",
          properties: {
            course_name: {
              type: "text",
              fields: { keyword: { type: "keyword", ignore_above: 256 } },
            },
            course_code: { type: "keyword" },
            department: { type: "keyword" },
            state: { type: "keyword" },
            goals: { type: "text" },
            content: { type: "text" },
          },
        },
      });
    } catch (e: any) {
      const status = e?.meta?.statusCode;
      const type = e?.meta?.body?.error?.type;
      if (status === 400 && type === "resource_already_exists_exception")
        return;
      if (status === 403) {
        this.logger.error(`403 creating index "${INDEX}". Check privileges.`);
      }
      throw e;
    }
  }

  private docsToBulkOperations(docs: Document[]) {
    const ops: any[] = [];
    for (const d of docs) {
      ops.push({ index: { _index: INDEX, _id: d.course_code } });
      ops.push(d);
    }
    return ops;
  }

  private async indexBulk(docs: Document[]) {
    if (!docs.length) {
      this.logger.warn("No documents to index; skipping bulk request");
      return;
    }
    await this.ensureIndex();
    const operations = this.docsToBulkOperations(docs);
    const res = await this.es.bulk({ refresh: "true", operations });

    if (!res.errors) {
      this.logger.log(`Bulk OK: ${res.items.length} indexed`);
      return;
    }
    const failures = (res.items as any[])
      .map((item, i) => {
        const action = Object.keys(item)[0];
        const r = (item as any)[action];
        if (!r?.error) return null;
        return {
          pos: i,
          id: r._id,
          status: r.status,
          type: r.error.type,
          reason: r.error.reason,
          caused_by: r.error.caused_by,
        };
      })
      .filter(Boolean) as any[];

    this.logger.error(`Bulk had ${failures.length} failures`);
    const summary = failures
      .slice(0, 5)
      .map((f) => `[${f.status}] ${f.type}: ${f.reason} (id=${f.id})`)
      .join("; ");
    throw new Error(
      `Bulk indexing failed for ${failures.length}/${res.items.length} items: ${summary}`,
    );
  }

  private async getBulkDocs(courses: InsertCourse[]) {
    let count = 0;
    const docs: Document[] = [];
    for (const course of courses) {
      if (course.state !== "ESTABLISHED") continue;
      count++;
      if (count % 10 === 0) {
        this.logger.log(`Processed ${count} courses so far`);
      }
      const plan = await this.getCourseDescription(course).catch((e) => {
        return null;
      });
      const doc = plan
        ? this.jsonToDocument(plan, course)
        : {
            course_name: course.name,
            course_code: course.code,
            department: course.department,
            state: course.state,
            goals: "",
            content: "",
          };
      docs.push(doc);
    }
    return docs;
  }
}
