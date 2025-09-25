import "./envConfig.ts";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/db";
import { courses as coursesTable, type InsertCourse } from "@/lib/db/schema";

const courseSchema = z.object({
  department: z.string(),
  code: z.string(),
  name: z.string(),
  state: z.enum(["CANCELLED", "ESTABLISHED", "DEACTIVATED"]),
  last_examination_semester: z.string().optional(),
});

const coursesSchema = z.array(courseSchema);

async function getCourses() {
  const endpoint = "https://api.kth.se/api/kopps/v2/courses?l=en";
  const response = await fetch(endpoint);
  const data = await response.json();
  const parsedData = coursesSchema.parse(data);
  return parsedData;
}

function convertCourses(
  courses: z.infer<typeof coursesSchema>,
): InsertCourse[] {
  return courses.map((course) => ({
    code: course.code,
    department: course.department,
    name: course.name,
    state: course.state,
    lastExaminationSemester: course.last_examination_semester,
  })) as InsertCourse[];
}

async function upsertCourses(courses: InsertCourse[]) {
  const chunkSize = 1000;
  for (let i = 0; i < courses.length; i += chunkSize) {
    const chunk = courses.slice(i, i + chunkSize);
    await db
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

async function ingestData() {
  const courses = await getCourses();
  const convertedCourses = convertCourses(courses as InsertCourse[]);
  await upsertCourses(convertedCourses);
}

ingestData();
