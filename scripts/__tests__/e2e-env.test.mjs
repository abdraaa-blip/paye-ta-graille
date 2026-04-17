import test from "node:test";
import assert from "node:assert/strict";
import {
  hasValidBetaBuildArtifacts,
  shouldSkipBetaBuild,
  withBetaE2EEnv,
  withPublicBetaEnv,
} from "../lib/e2e-env.mjs";

test("withPublicBetaEnv force NEXT_PUBLIC_PTG_PUBLIC_BETA=1", () => {
  const env = withPublicBetaEnv({ FOO: "bar", NEXT_PUBLIC_PTG_PUBLIC_BETA: "0" });
  assert.equal(env.FOO, "bar");
  assert.equal(env.NEXT_PUBLIC_PTG_PUBLIC_BETA, "1");
});

test("withBetaE2EEnv ajoute les flags E2E beta", () => {
  const env = withBetaE2EEnv({ FOO: "bar" });
  assert.equal(env.FOO, "bar");
  assert.equal(env.NEXT_PUBLIC_PTG_PUBLIC_BETA, "1");
  assert.equal(env.PTG_RUN_BETA_E2E, "1");
  assert.equal(env.PTG_PLAYWRIGHT_NO_WEBSERVER, "0");
});

test("shouldSkipBetaBuild lit strictement PTG_SKIP_BETA_BUILD", () => {
  assert.equal(shouldSkipBetaBuild({ PTG_SKIP_BETA_BUILD: "1" }), true);
  assert.equal(shouldSkipBetaBuild({ PTG_SKIP_BETA_BUILD: " 1 " }), true);
  assert.equal(shouldSkipBetaBuild({ PTG_SKIP_BETA_BUILD: "0" }), false);
  assert.equal(shouldSkipBetaBuild({}), false);
});

test("hasValidBetaBuildArtifacts exige BUILD_ID et marqueur beta", () => {
  const bothFiles = new Set([".next/BUILD_ID", ".next/PTG_PUBLIC_BETA_BUILD"]);
  const onlyBuildId = new Set([".next/BUILD_ID"]);
  const existsBoth = (path) => bothFiles.has(path);
  const existsOnlyBuildId = (path) => onlyBuildId.has(path);
  const existsNone = () => false;

  assert.equal(hasValidBetaBuildArtifacts(existsBoth), true);
  assert.equal(hasValidBetaBuildArtifacts(existsOnlyBuildId), false);
  assert.equal(hasValidBetaBuildArtifacts(existsNone), false);
});
