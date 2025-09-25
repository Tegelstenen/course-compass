Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
exports.default = (0, drizzle_kit_1.defineConfig)({
  schema: "./backend-nest/types/database/schema.ts",
  out: "./backend-nest/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
//# sourceMappingURL=drizzle.config.js.map
