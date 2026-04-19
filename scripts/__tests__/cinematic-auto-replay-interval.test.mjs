import assert from "node:assert/strict";
import test from "node:test";
import { parseCinematicAutoReplayIntervalSec } from "../lib/cinematic-auto-replay-interval.mjs";

test("parseCinematicAutoReplayIntervalSec défaut 60 si absent ou vide", () => {
  assert.equal(parseCinematicAutoReplayIntervalSec(undefined), 60);
  assert.equal(parseCinematicAutoReplayIntervalSec(""), 60);
  assert.equal(parseCinematicAutoReplayIntervalSec("   "), 60);
});

test("parseCinematicAutoReplayIntervalSec désactive sur flags négatifs", () => {
  assert.equal(parseCinematicAutoReplayIntervalSec("0"), null);
  assert.equal(parseCinematicAutoReplayIntervalSec("false"), null);
  assert.equal(parseCinematicAutoReplayIntervalSec("off"), null);
  assert.equal(parseCinematicAutoReplayIntervalSec("no"), null);
  assert.equal(parseCinematicAutoReplayIntervalSec(" FALSE "), null);
});

test("parseCinematicAutoReplayIntervalSec borne 30–600", () => {
  assert.equal(parseCinematicAutoReplayIntervalSec("15"), 30);
  assert.equal(parseCinematicAutoReplayIntervalSec("30"), 30);
  assert.equal(parseCinematicAutoReplayIntervalSec("90"), 90);
  assert.equal(parseCinematicAutoReplayIntervalSec("9999"), 600);
});

test("parseCinematicAutoReplayIntervalSec rejette non numériques ou ≤0", () => {
  assert.equal(parseCinematicAutoReplayIntervalSec("abc"), null);
  assert.equal(parseCinematicAutoReplayIntervalSec("-1"), null);
});
