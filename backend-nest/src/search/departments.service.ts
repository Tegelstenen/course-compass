import { Client as ESClient } from "@elastic/elasticsearch";
import { Inject, Injectable } from "@nestjs/common";
import { ES } from "./search.constants.js";

interface DepartmentsAgg {
  departments: {
    buckets: Array<{ key: string; count: number }>;
  };
}

@Injectable()
export class DepartmentsService {
  constructor(@Inject(ES) private readonly es: ESClient) {}

  async getDepartments(): Promise<string[]> {
    const res = await this.es.search<unknown, DepartmentsAgg>({
      index: "courses",
      size: 0,
      aggs: {
        departments: { terms: { field: "department", size: 100 } },
      },
    });

    return (res.aggregations?.departments?.buckets ?? []).map(
      // This is used for retrieving all unique departments from the courses index
      (b: DepartmentsAgg["departments"]["buckets"][0]) => b.key,
    );
  }
}
