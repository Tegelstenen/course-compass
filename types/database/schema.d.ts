export declare const courseState: import("drizzle-orm/pg-core").PgEnum<
  ["CANCELLED", "ESTABLISHED", "DEACTIVATED"]
>;
export declare const courses: import("drizzle-orm/pg-core").PgTableWithColumns<{
  name: "courses";
  schema: undefined;
  columns: {
    code: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "code";
        tableName: "courses";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    department: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "department";
        tableName: "courses";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    name: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "name";
        tableName: "courses";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    state: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "state";
        tableName: "courses";
        dataType: "string";
        columnType: "PgEnumColumn";
        data: "CANCELLED" | "ESTABLISHED" | "DEACTIVATED";
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: ["CANCELLED", "ESTABLISHED", "DEACTIVATED"];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    lastExaminationSemester: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "last_examination_semester";
        tableName: "courses";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    updatedAt: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "updated_at";
        tableName: "courses";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
  };
  dialect: "pg";
}>;
export type InsertCourse = typeof courses.$inferInsert;
export type SelectCourse = typeof courses.$inferSelect;
