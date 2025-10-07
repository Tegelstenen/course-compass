import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  schema: "../types/database/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  migrations: {
    schema: "drizzle",
    table: "__drizzle_migrations",
  },
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
