import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import { defineConfig } from "prisma/config";

expand(dotenv.config());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["POSTGRES_URI"],
  },
});