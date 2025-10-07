import { Injectable, Inject } from '@nestjs/common';

// Drizzle imports
import { DRIZZLE } from "src/database/drizzle.module";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

// Schema imports
import * as schema from "../../../types/database/schema";
import {
  SelectCourse,
  courses,
} from "../../../types/database/schema";

@Injectable()
export class CourseService {
    constructor(
        @Inject(DRIZZLE) private readonly db: NeonHttpDatabase<typeof schema>,
    ) {}

    async getCourse(courseCode: string): Promise<SelectCourse | undefined> {
        const courseObject = await this.db 
            .select()
            .from(courses)
            .where(eq(courses.code, courseCode)) // fetches the course from the course code
            .limit(1);
        return courseObject[0]; // [0] beacuse we technically have a 1 element array from the database
    }
}
