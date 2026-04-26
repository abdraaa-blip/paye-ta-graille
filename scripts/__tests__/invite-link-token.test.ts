import assert from "node:assert/strict";
import test from "node:test";
import {
  inviteLinkSigningConfigured,
  mintInviteLinkToken,
  verifyInviteLinkToken,
} from "../../src/lib/invite-link-token";

const SAMPLE_UUID = "a1b2c3d4-e5f6-4171-89ab-0123456789ab";
const BAD_UUID = "not-a-uuid";

test("mint / verify round-trip with secret", () => {
  const prev = process.env.PTG_INVITE_LINK_SECRET;
  process.env.PTG_INVITE_LINK_SECRET = "x".repeat(16);
  try {
    assert.ok(inviteLinkSigningConfigured());
    const tok = mintInviteLinkToken(SAMPLE_UUID, "friend_accueil");
    assert.ok(typeof tok === "string" && tok.length > 32);
    const p = verifyInviteLinkToken(tok!);
    assert.ok(p);
    assert.equal(p!.inv, SAMPLE_UUID);
    assert.equal(p!.src, "friend_accueil");
    assert.ok(p!.exp > Date.now());
  } finally {
    if (prev === undefined) delete process.env.PTG_INVITE_LINK_SECRET;
    else process.env.PTG_INVITE_LINK_SECRET = prev;
  }
});

test("without secret, mint is null and verify fails", () => {
  const prev = process.env.PTG_INVITE_LINK_SECRET;
  delete process.env.PTG_INVITE_LINK_SECRET;
  try {
    assert.equal(mintInviteLinkToken(SAMPLE_UUID, "friend_accueil"), null);
    assert.equal(verifyInviteLinkToken("any.fake.token"), null);
    assert.ok(!inviteLinkSigningConfigured());
  } finally {
    if (prev !== undefined) process.env.PTG_INVITE_LINK_SECRET = prev;
  }
});

test("verify rejects tampering, wrong sig, expiry, bad uuid", () => {
  const prev = process.env.PTG_INVITE_LINK_SECRET;
  process.env.PTG_INVITE_LINK_SECRET = "y".repeat(20);
  try {
    const tok = mintInviteLinkToken(SAMPLE_UUID, "src");
    assert.ok(tok);
    const dot = tok!.lastIndexOf(".");
    const body = tok!.slice(0, dot);
    const fake = `${body}aaaa`;
    assert.equal(verifyInviteLinkToken(fake), null);

    assert.equal(verifyInviteLinkToken(""), null);
    assert.equal(verifyInviteLinkToken("nodot"), null);

    const expired = mintInviteLinkToken(SAMPLE_UUID, "src", -1000);
    assert.ok(expired);
    assert.equal(verifyInviteLinkToken(expired!), null);

    const badInv = mintInviteLinkToken(BAD_UUID, "src");
    assert.ok(badInv);
    assert.equal(verifyInviteLinkToken(badInv!), null);
  } finally {
    if (prev === undefined) delete process.env.PTG_INVITE_LINK_SECRET;
    else process.env.PTG_INVITE_LINK_SECRET = prev;
  }
});
