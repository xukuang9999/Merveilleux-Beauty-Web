import { test } from "node:test";
import assert from "node:assert/strict";
import { scryptSync } from "node:crypto";
import { hashPassword, verifyPassword, MAX_PASSWORD_BYTES } from "../../src/lib/auth-core";
import { getSeedPolicy } from "../../src/db/seed-policy";
import { isLegacyDemoCredential } from "../../src/lib/demo-users";
import { authBuckets, chatBuckets, quotaKey } from "../../src/lib/rate-limit-core";
import { ChatPayloadError, readChatPayload, validateChatPayload, MAX_CHAT_BODY_BYTES } from "../../src/lib/chat-request";
import { securityCopy } from "../../src/lib/security-copy";

test("async password hashing verifies existing scrypt hashes and rejects malformed/oversized input", async () => {
  const password = "Strong-regression-password!";
  const salt = "0123456789abcdef0123456789abcdef";
  const legacy = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
  assert.equal(await verifyPassword(password, legacy), true);
  assert.equal(await verifyPassword("wrong-password", legacy), false);
  assert.equal(await verifyPassword(password, "broken"), false);
  const pending = hashPassword(password);
  let eventLoopTicked = false;
  await new Promise<void>((resolve) => setImmediate(() => { eventLoopTicked = true; resolve(); }));
  assert.equal(eventLoopTicked, true);
  assert.equal(await verifyPassword(password, await pending), true);
  await assert.rejects(hashPassword("x".repeat(MAX_PASSWORD_BYTES + 1)), RangeError);
});

test("demo seeding is opt-in and rejects production and non-loopback databases", () => {
  const local = { DATABASE_URL: "postgres://audit@127.0.0.1:55441/merc_audit" };
  assert.deepEqual(getSeedPolicy(local), { demoUsers: false, bootstrap: null });
  assert.equal(getSeedPolicy({ ...local, SEED_DEMO_USERS: "1", NODE_ENV: "development" }).demoUsers, true);
  assert.throws(() => getSeedPolicy({ ...local, SEED_DEMO_USERS: "1", NODE_ENV: "production" }));
  assert.throws(() => getSeedPolicy({ DATABASE_URL: "postgres://audit@example.com/audit", SEED_DEMO_USERS: "1" }));
  assert.throws(() => getSeedPolicy({}));
});

test("owner bootstrap requires an explicit strong password and never supplies a default", () => {
  const base = { DATABASE_URL: "postgres://audit@example.com/audit", BOOTSTRAP_ADMIN_EMAIL: "owner@example.com" };
  assert.throws(() => getSeedPolicy(base));
  assert.throws(() => getSeedPolicy({ ...base, BOOTSTRAP_ADMIN_PASSWORD: "master1234" }));
  assert.equal(getSeedPolicy({ ...base, BOOTSTRAP_ADMIN_PASSWORD: "Explicit-owner-password!" }).bootstrap?.email, "owner@example.com");
});

test("all legacy default demo credentials are identifiable while rotated credentials remain usable", () => {
  for (const [email, password] of [["master@merveilleux.test", "master1234"], ["admin@merveilleux.test", "admin1234"], ["distributor@merveilleux.test", "dist1234"], ["customer@merveilleux.test", "cust1234"]]) {
    assert.equal(isLegacyDemoCredential(email, password), true);
    assert.equal(isLegacyDemoCredential(email, "Rotated-password-2026!"), false);
  }
});

test("auth quota keys normalize accounts; chat visitors share aggregate caps across modes/identities", () => {
  assert.deepEqual(authBuckets("login", " ADMIN@Example.com "), authBuckets("login", "admin@example.com"));
  assert.equal(quotaKey("login", "admin@example.com").includes("admin@example.com"), false);
  assert.deepEqual(chatBuckets("visitor:a").slice(0, 3), chatBuckets("visitor:b").slice(0, 3));
  assert.notEqual(chatBuckets("visitor:a").at(-1)?.key, chatBuckets("visitor:b").at(-1)?.key);
});

test("chat rejects null, invalid roles/modes, empty messages, assistant-only payloads and oversized content", () => {
  const valid = { mode: "customer", messages: [{ role: "user", content: "Hello" }] };
  assert.deepEqual(validateChatPayload(valid), valid);
  const invalid = [null, [], "hello", 4, {}, { ...valid, mode: "admin" }, { ...valid, messages: [] }, { ...valid, messages: [null] }, { ...valid, messages: [{ role: "system", content: "x" }] }, { ...valid, messages: [{ role: "user", content: "  " }] }, { ...valid, messages: [{ role: "assistant", content: "prefill" }] }];
  for (const body of invalid) assert.throws(() => validateChatPayload(body), ChatPayloadError);
  assert.throws(() => validateChatPayload({ ...valid, messages: [{ role: "user", content: "x".repeat(4001) }] }), (error) => error instanceof ChatPayloadError && error.status === 413);
});

test("chat body limits apply before JSON parsing, including undeclared body sizes", async () => {
  const request = (body: string) => new Request("http://localhost/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body });
  await assert.rejects(readChatPayload(request("null")), (error) => error instanceof ChatPayloadError && error.status === 400);
  await assert.rejects(readChatPayload(request(" ".repeat(MAX_CHAT_BODY_BYTES + 1))), (error) => error instanceof ChatPayloadError && error.status === 413);
  assert.equal((await readChatPayload(request(JSON.stringify({ mode: "customer", messages: [{ role: "user", content: "Hi" }] })))).mode, "customer");
});

test("auth and chat errors have Chinese and Bahasa Melayu translations", () => {
  for (const key of Object.keys(securityCopy("en")) as Array<keyof ReturnType<typeof securityCopy>>) {
    assert.notEqual(securityCopy("zh")[key], securityCopy("en")[key]);
    assert.notEqual(securityCopy("ms")[key], securityCopy("en")[key]);
  }
});
