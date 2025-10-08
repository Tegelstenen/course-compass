import type { Client as ESClient } from "@elastic/elasticsearch";
import { Injectable, Inject } from '@nestjs/common';
import { ES } from "../search/search.constants.js";
import type { CourseMapping } from "../../../types/search/elastic.mappings";

const INDEX = 'courses';

@Injectable()
export class ElasticCourseService {
    constructor(@Inject(ES) private readonly es: ESClient) {}

    async getCourseByCode(courseCode: string): Promise<CourseMapping | undefined> {
        const res = await this.es.search<CourseMapping>({
            index: INDEX,
            size: 1,
            query: {
                term: {
                    "code": courseCode,
                },
            },
        });

        const hits = (res.hits?.hits ?? []); // fallback on [] which triggers a return of "undefined" 
        if (hits.length > 0) {
            return hits[0]._source;
        }
        return undefined;
    }
}
