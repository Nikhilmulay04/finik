let db = null;

export async function initDb() {
  if (db) return db;

  // Import from generated lib/prisma to avoid bundler issues
  // Using require to ensure runtime resolution
  const { PrismaClient } = require("./prisma/client.js");
  const { PrismaPg } = require("@prisma/adapter-pg");
  const { Pool } = require("pg");

  const connectionString = process.env.DATABASE_URL;

  // Create a connection pool with proper configuration
  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Create the Prisma Client with the adapter
  const adapter = new PrismaPg(pool);

  db = globalThis.prisma || new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
  }

  return db;
}