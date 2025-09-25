Object.defineProperty(exports, "__esModule", { value: true });
exports.courses = exports.courseState = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.courseState = (0, pg_core_1.pgEnum)("course_state", [
  "CANCELLED",
  "ESTABLISHED",
  "DEACTIVATED",
]);
exports.courses = (0, pg_core_1.pgTable)("courses", {
  code: (0, pg_core_1.text)("code").primaryKey(),
  department: (0, pg_core_1.text)("department").notNull(),
  name: (0, pg_core_1.text)("name").notNull(),
  state: (0, exports.courseState)("state").notNull(),
  lastExaminationSemester: (0, pg_core_1.text)("last_examination_semester"),
  updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
//# sourceMappingURL=schema.js.map
