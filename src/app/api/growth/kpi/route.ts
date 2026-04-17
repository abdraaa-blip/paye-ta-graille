import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api/errors";
import { consumeRateLimit } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";
import {
  growthKpiAuthConfigured,
  growthKpiSecretRateLimitKey,
  isGrowthKpiAdminUser,
  isValidGrowthKpiSecret,
} from "@/lib/growth-kpi-admin";
import {
  clampKpiDays,
  loadGrowthKpiDaily,
  partnersCtrPercent,
  partnersCtaTotal,
} from "@/lib/growth-kpi-data";
import { maybeCreateGrowthFeedbackAlert } from "@/lib/growth-kpi-alerts";
import { getGrowthKpiThresholds } from "@/lib/growth-kpi-thresholds";

export async function GET(request: Request) {
  if (!growthKpiAuthConfigured()) {
    return jsonError("kpi_disabled", "Indicateurs croissance non configurés côté serveur.", 503);
  }

  const headerSecret = request.headers.get("x-ptg-growth-kpi-secret");
  const secretOk = isValidGrowthKpiSecret(headerSecret);

  let rateKey: string;
  if (secretOk) {
    rateKey = `kpi:${growthKpiSecretRateLimitKey(headerSecret!)}`;
  } else {
    const session = await requireSession();
    if (!session.ok) return session.response;
    if (!isGrowthKpiAdminUser(session.user.id)) {
      return jsonError("forbidden", "Accès refusé.", 403);
    }
    rateKey = `${session.user.id}:growth_kpi_get`;
  }

  const limited = await consumeRateLimit(rateKey, 60, 60_000);
  if (limited) return limited;

  const url = new URL(request.url);
  const days = clampKpiDays(url.searchParams.get("days"));

  const result = await loadGrowthKpiDaily(days);
  if (!result.ok) {
    if (result.reason === "no_service_role") {
      return jsonError("service_unavailable", "Service indicateurs indisponible (clé admin DB).", 503);
    }
    return jsonError("kpi_query_failed", result.detail ?? "Erreur lecture KPI.", 500);
  }

  const rows = result.rows.map((r) => ({
    ...r,
    partners_cta_total: partnersCtaTotal(r),
    partners_ctr_percent: partnersCtrPercent(r),
  }));
  const thresholds = getGrowthKpiThresholds();
  await maybeCreateGrowthFeedbackAlert(result.rows, thresholds);

  return NextResponse.json({ days, rows, thresholds }, { status: 200 });
}
