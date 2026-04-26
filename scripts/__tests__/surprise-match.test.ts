import assert from "node:assert/strict";
import test from "node:test";
import {
  mealIntentsSurpriseCompatible,
  pickSurpriseProfiles,
  sanitizeSurpriseExcludeIds,
} from "../../src/lib/surprise-match";

test("mealIntentsSurpriseCompatible pairs", () => {
  assert.ok(mealIntentsSurpriseCompatible("invite", "etre_invite"));
  assert.ok(mealIntentsSurpriseCompatible("etre_invite", "invite"));
  assert.ok(mealIntentsSurpriseCompatible("partage", "partage"));
  assert.ok(!mealIntentsSurpriseCompatible("invite", "invite"));
  assert.ok(!mealIntentsSurpriseCompatible("partage", "invite"));
});

test("sanitizeSurpriseExcludeIds caps and validates UUID", () => {
  assert.deepEqual(sanitizeSurpriseExcludeIds(["not-uuid", "  "]), []);
  const a = "a0000000-0000-4000-8000-000000000001";
  const b = "b0000000-0000-4000-8000-000000000002";
  assert.deepEqual(sanitizeSurpriseExcludeIds([a, b, a]), [a, b]);
});

test("pickSurpriseProfiles returns up to 3 distinct ids (shuffle varies)", () => {
  const fixed = Array.from({ length: 10 }, (_, i) => ({
    id: `${(0x10000000 + i).toString(16).padStart(8, "0")}-0000-4000-8000-${(0x800000000000 + i).toString(16).padStart(12, "0")}`,
    meal_intent: "partage",
  }));

  const seen = new Set<string>();
  for (let n = 0; n < 50; n++) {
    const r = pickSurpriseProfiles(fixed, "partage", { maxCount: 3 });
    assert.ok(r);
    assert.ok(r!.profiles.length >= 1 && r!.profiles.length <= 3);
    const ids = r!.profiles.map((p) => p.id);
    assert.equal(new Set(ids).size, ids.length);
    seen.add(ids.sort().join(","));
  }
  assert.ok(seen.size > 1, "shuffle should vary composition across runs");
});

test("pickSurpriseProfiles excludes ids when alternatives exist", () => {
  const pool = [
    { id: "a0000000-0000-4000-8000-000000000001", meal_intent: "partage" },
    { id: "b0000000-0000-4000-8000-000000000002", meal_intent: "partage" },
    { id: "c0000000-0000-4000-8000-000000000003", meal_intent: "partage" },
  ];
  for (let i = 0; i < 30; i++) {
    const r = pickSurpriseProfiles(pool, "partage", {
      excludeIds: ["a0000000-0000-4000-8000-000000000001"],
      maxCount: 3,
    });
    assert.ok(r);
    assert.ok(!r!.profiles.some((p) => p.id === "a0000000-0000-4000-8000-000000000001"));
  }
});

test("pickSurpriseProfiles falls back when all excluded", () => {
  const pool = [{ id: "a0000000-0000-4000-8000-000000000001", meal_intent: "partage" }];
  const r = pickSurpriseProfiles(pool, "partage", {
    excludeIds: ["a0000000-0000-4000-8000-000000000001"],
    maxCount: 3,
  });
  assert.ok(r);
  assert.equal(r!.profiles.length, 1);
  assert.equal(r!.profiles[0]!.id, "a0000000-0000-4000-8000-000000000001");
});
