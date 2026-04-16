import { NextResponse } from "next/server";

/**
 * Health check for Vercel / load balancers / monitoring.
 * No secrets. Safe to cache-bust with ?t= if needed.
 */
export function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "paye-ta-graille",
      time: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
