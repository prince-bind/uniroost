import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

/**
 * Next.js dev mode hot-reloads modules on every file save, which used to
 * mean `new PrismaClient()` ran again each time -- quickly exhausting
 * Postgres's connection limit. Caching the instance on `globalThis`
 * (which survives HMR, unlike a module-scoped variable) fixes it.
 * In production each serverless/container instance still gets exactly
 * one client, which is what we want.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; pgPool?: Pool };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Check your .env file.");
  }

  // Passing a bare `{ connectionString }` config lets @prisma/adapter-pg
  // funnel every query through a single shared client. Two concurrent
  // queries on that one client (e.g. React Server Components rendering
  // twice in dev, or a $transaction firing alongside another request)
  // then collide -- surfacing as pg's "client.query() already executing"
  // deprecation warning. Creating our own `pg.Pool` and handing it to
  // PrismaPg means each concurrent query checks out its own connection.
  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      max: 10, // keep comfortably under Neon's free-tier connection cap
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}