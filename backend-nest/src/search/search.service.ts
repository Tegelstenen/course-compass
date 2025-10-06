import type { Client as ESClient } from "@elastic/elasticsearch";
import { Inject, Injectable } from "@nestjs/common";
import type { CourseMapping } from "../../../types/search/elastic.mappings";
import { ES } from "./search.constants.js";

const INDEX = "courses";

export type SearchResult = CourseMapping & {
  _id: string;
  _score: number | null;
};

@Injectable()
export class SearchService {
  constructor(@Inject(ES) private readonly es: ESClient) {}

  async searchCourses(query: string, size = 10): Promise<SearchResult[]> {
    if (!query || !query.trim()) return [];
    const res = await this.es.search<unknown, CourseMapping>({
      index: INDEX,
      size,
      query: {
        multi_match: {
          query,
          fields: ["course_name^2", "course_code^2", "goals", "content"],
          fuzziness: "AUTO",
          type: "best_fields",
        },
      },
      _source: ["course_name", "course_code", "department", "goals", "content"],
    });

    const hits = (res.hits?.hits ?? []) as Array<{
      _id: string;
      _score: number | null;
      _source?: CourseMapping;
    }>;

    return hits
      .filter((h) => Boolean(h._source))
      .map((h) => {
        const src = h._source ?? ({} as CourseMapping);
        return { ...src, _id: h._id, _score: h._score };
      });
  }
}
