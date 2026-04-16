import { NextResponse } from "next/server";
import { getAppVersion } from "@/lib/app-version";

/**
 * Health check for Vercel / load balancers / monitoring.
 * No secrets. Safe to cache-bust with ?t= if needed.
 */
export function GET() {
  const publicBetaRaw = String(process.env.NEXT_PUBLIC_PTG_PUBLIC_BETA ?? "").trim().toLowerCase();
  const publicBeta = publicBetaRaw === "1" || publicBetaRaw === "true" || publicBetaRaw === "yes";

  return NextResponse.json(
    {
      ok: true,
      service: "paye-ta-graille",
      version: getAppVersion(),
      time: new Date().toISOString(),
      publicBeta,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
