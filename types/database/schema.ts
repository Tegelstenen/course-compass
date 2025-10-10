import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

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

export const users = pgTable("users", {
  id: text("id").primaryKey(), // This will be the SuperTokens user ID
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  profilePicture: text("profile_picture"), // URL to profile picture
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// junction table for mapping users to favorite courses
export const user_favorites = pgTable(
  "user_favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // references a user in the user table as foreign key
    favoriteCourse: text("fav_course_code")
      .notNull()
      .references(() => courses.code, { onDelete: "cascade" }), // references a course code as foreign key
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    primaryKey: primaryKey({ columns: [table.userId, table.favoriteCourse] }),
  }),
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertUserFavorite = typeof user_favorites.$inferInsert;
export type SelectUserFavorites = typeof user_favorites.$inferSelect;
