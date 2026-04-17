export function withPublicBetaEnv(baseEnv = process.env) {
  return {
    ...baseEnv,
    NEXT_PUBLIC_PTG_PUBLIC_BETA: "1",
  };
}

export function withBetaE2EEnv(baseEnv = process.env) {
  return {
    ...withPublicBetaEnv(baseEnv),
    PTG_RUN_BETA_E2E: "1",
    PTG_PLAYWRIGHT_NO_WEBSERVER: "0",
  };
}

export function shouldSkipBetaBuild(baseEnv = process.env) {
  return String(baseEnv.PTG_SKIP_BETA_BUILD ?? "").trim() === "1";
}

export function hasValidBetaBuildArtifacts(exists = () => false) {
  return exists(".next/BUILD_ID") && exists(".next/PTG_PUBLIC_BETA_BUILD");
}
