let db = null;

export async function initDb() {
  if (db) return db;

  // Use template literal to hide path from Turbopack static analysis
  const { PrismaClient } = await import(
    `./${'prisma'}/client.js`
  );
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const { Pool } = await import("pg");

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