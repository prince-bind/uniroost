import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Used by uptime monitors, load balancers, and container orchestrators
 * to verify the app is up AND can reach its database — a 200 from the
 * app process alone doesn't guarantee Postgres is reachable.
 */
export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      database: "connected",
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[health_check_failed]", error);
    return NextResponse.json(
      {
        status: "error",
        database: "unreachable",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
