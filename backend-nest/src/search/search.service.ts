import type { Client as ESClient } from "@elastic/elasticsearch";
import { Inject, Injectable } from "@nestjs/common";
import { inArray, sql } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "../../../types/database/schema";
import type { CourseMapping } from "../../../types/search/elastic.mappings";
import { DRIZZLE } from "../database/drizzle.module";
import { ES } from "./search.constants";

const INDEX = "courses";

export type SearchResult = CourseMapping & {
  _id: string;
  _score: number | null;
  rating?: number;
};

@Injectable()
export class SearchService {
  constructor(
    @Inject(ES) private readonly es: ESClient,
    @Inject(DRIZZLE) private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  async searchCourses(
    query: string,
    size = 10,
    filters?: { department?: string; minRating?: number },
  ): Promise<SearchResult[]> {
    if (!query?.trim()) return [];
    const searchFilters: Array<{
      wildcard?: { department: string };
      term?: { department: string };
      range?: { averageRating: { gte: number } };
    }> = [];
    if (filters?.department) {
      const dept = filters.department;
      console.log("Filtering by department:", JSON.stringify(dept));
      const departments = ["EECS", "ABE", "CBH", "ITM", "SCI"];
      const matchingDepts = departments.find((abbr) => dept.includes(abbr));
      if (matchingDepts) {
        const wildcardFilter = {
          wildcard: {
            department: `*${matchingDepts}*`,
          },
        };
        searchFilters.push(wildcardFilter);
      } else {
        const termFilter = {
          term: { department: dept },
        };
        searchFilters.push(termFilter);
      }
    }
    if (filters?.minRating)
      searchFilters.push({
        range: { averageRating: { gte: filters.minRating } },
      });

    const res = await this.es.search<unknown, CourseMapping>({
      index: INDEX,
      size,
      query: {
        bool: {
          must: {
            multi_match: {
              query,
              fields: ["course_name^2", "course_code^2", "goals", "content"],
              fuzziness: "AUTO",
              type: "best_fields",
            },
          },
          filter: searchFilters,
        },
      },
      _source: ["course_name", "course_code", "department", "goals", "content"],
    });

    const hits = (res.hits?.hits ?? []) as Array<{
      _id: string;
      _score: number | null;
      _source?: CourseMapping;
    }>;

    const base = hits
      .filter((h) => Boolean(h._source))
      .map((h) => {
        const src = h._source ?? ({} as CourseMapping);
        return { ...src, _id: h._id, _score: h._score } as SearchResult;
      });

    // Add average rating from reviews
    const codes = base.map((c) => c.course_code);
    if (codes.length === 0) return base;

    const result = await this.db.execute(
      sql`SELECT course_code,
             ROUND((AVG(easy_score) + AVG(useful_score) + AVG(interesting_score))/3) AS rating
           FROM ${schema.reviews}
           WHERE ${inArray(schema.reviews.courseCode, codes)}
           GROUP BY course_code`,
    );

    const rows = result.rows as Array<{ course_code: string; rating: number }>;
    const codeToRating = new Map<string, number>();
    for (const r of rows) {
      codeToRating.set(r.course_code, Number(r.rating) || 0);
    }

    return base.map((c) => ({
      ...c,
      rating: codeToRating.get(c.course_code) ?? 0,
    }));
  }

  async getCourseByCode(
    courseCode: string,
  ): Promise<CourseMapping | undefined> {
    const res = await this.es.search<CourseMapping>({
      index: INDEX,
      size: 1,
      query: {
        term: {
          course_code: courseCode,
        },
      },
    });
    const hits = res.hits?.hits ?? []; // fallback on [] which triggers a return of "undefined"
    if (hits.length > 0) {
      return hits[0]._source;
    }
    return undefined;
  }
}
