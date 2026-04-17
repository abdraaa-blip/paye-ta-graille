type GrowthKpiThresholds = {
  feedbackDeltaWarn: number;
  feedbackVolumeWarn: number;
  feedbackBaselineGapWarn: number;
  profile: "strict" | "normal" | "lenient";
};

const PROFILE_THRESHOLDS: Record<"strict" | "normal" | "lenient", Omit<GrowthKpiThresholds, "profile">> = {
  strict: {
    feedbackDeltaWarn: -0.1,
    feedbackVolumeWarn: -2,
    feedbackBaselineGapWarn: -0.08,
  },
  normal: {
    feedbackDeltaWarn: -0.2,
    feedbackVolumeWarn: -3,
    feedbackBaselineGapWarn: -0.15,
  },
  lenient: {
    feedbackDeltaWarn: -0.3,
    feedbackVolumeWarn: -5,
    feedbackBaselineGapWarn: -0.25,
  },
};

const DEFAULT_THRESHOLDS: Omit<GrowthKpiThresholds, "profile"> = {
  feedbackDeltaWarn: -0.2,
  feedbackVolumeWarn: -3,
  feedbackBaselineGapWarn: -0.15,
};

function readNumberEnv(key: string, fallback: number): number {
  const raw = process.env[key]?.trim();
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function readThresholdProfile(): "strict" | "normal" | "lenient" {
  const raw = process.env.PTG_GROWTH_FEEDBACK_THRESHOLD_PROFILE?.trim().toLowerCase();
  if (raw === "strict" || raw === "lenient" || raw === "normal") return raw;
  return "normal";
}

export function getGrowthKpiThresholds(): GrowthKpiThresholds {
  const profile = readThresholdProfile();
  const profileBase = PROFILE_THRESHOLDS[profile] ?? DEFAULT_THRESHOLDS;
  return {
    profile,
    feedbackDeltaWarn: readNumberEnv("PTG_GROWTH_FEEDBACK_DELTA_WARN", profileBase.feedbackDeltaWarn),
    feedbackVolumeWarn: readNumberEnv("PTG_GROWTH_FEEDBACK_VOLUME_WARN", profileBase.feedbackVolumeWarn),
    feedbackBaselineGapWarn: readNumberEnv("PTG_GROWTH_FEEDBACK_BASELINE_GAP_WARN", profileBase.feedbackBaselineGapWarn),
  };
}
