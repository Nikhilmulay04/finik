import { PrismaClient } from "./client/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let db = null;

export async function initDb() {
  if (db) return db;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  db = new PrismaClient({ adapter });
  return db;
}