// backend-nest/drizzle.config.js
const { defineConfig } = require("drizzle-kit");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

module.exports = defineConfig({
  schema: "./backend-nest/types/database/schema.ts",
  out: "./backend-nest/migrations",
});
//# sourceMappingURL=drizzle.config.js.map
