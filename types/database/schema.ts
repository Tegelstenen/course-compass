import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const courseState = pgEnum("course_state", [
  "CANCELLED",
  "ESTABLISHED",
  "DEACTIVATED",
]);
export const courses = pgTable("courses", {
  code: text("code").primaryKey(),
  department: text("department").notNull(),
  name: text("name").notNull(),
  state: courseState("state").notNull(),
  lastExaminationSemester: text("last_examination_semester"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type InsertCourse = typeof courses.$inferInsert;
export type SelectCourse = typeof courses.$inferSelect;
