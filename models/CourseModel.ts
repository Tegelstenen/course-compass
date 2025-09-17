import { eq } from "drizzle-orm";
import { db } from "@/lib/db/db";
import { courses, type SelectCourse } from "@/lib/db/schema";

export class Course {
  static async getAllCourses(): Promise<SelectCourse[]> {
    return await db.select().from(courses);
  }

  static async getCourseByName(name: string): Promise<SelectCourse[]> {
    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.name, name));

    return course ?? [];
  }

  static async getByCode(code: string): Promise<SelectCourse | null> {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.code, code));

    return course ?? null;
  }

  static async getAllActiveCourses(): Promise<SelectCourse[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.state, "ESTABLISHED"));
  }
}
