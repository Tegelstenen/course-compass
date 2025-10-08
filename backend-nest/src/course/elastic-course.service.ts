import type { Client as ESClient } from "@elastic/elasticsearch";
import { Inject, Injectable } from "@nestjs/common";
import type { CourseMapping } from "../../../types/search/elastic.mappings";
import { ES } from "../search/search.constants.js";

const INDEX = "courses";

@Injectable()
export class ElasticCourseService {
  constructor(@Inject(ES) private readonly es: ESClient) {}

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

    console.log(res.hits);
    const hits = res.hits?.hits ?? []; // fallback on [] which triggers a return of "undefined"
    if (hits.length > 0) {
      return hits[0]._source;
    }
    return undefined;
  }
}
