import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { fixtureDatabaseUrl, FIXTURE_PASSWORDS } from "./security-fixture";
import { authBuckets } from "../../src/lib/rate-limit-core";
import { securityCopy } from "../../src/lib/security-copy";
import { DEMO_USERS } from "../../src/lib/demo-users";
import { sessionTokenToId } from "../../src/lib/auth-core";

async function main() {
  const base = process.env.SECURITY_BASE_URL || "http://127.0.0.1:3132";
  const url = new URL(base);
  if (url.protocol !== "http:" || !["127.0.0.1", "localhost"].includes(url.hostname) || !["3128", "3131", "3132"].includes(url.port)) throw new Error("Use an isolated localhost audit runtime.");
  const connection = postgres(fixtureDatabaseUrl(), { prepare: false });
  const email = `audit-rate-${randomUUID()}@example.invalid`;
  const evidence: Record<string, unknown> = { base, isolatedFixtureOnly: true };
  const sessionIds: string[] = [];
  try {
    const html = await (await fetch(`${base}/login`, { signal: AbortSignal.timeout(15_000) })).text();
    assert.equal(html.includes("admin1234"), false);
    assert.equal(html.includes("admin@merveilleux.test"), false);
    evidence.loginHasNoDemoCredentials = true;
    const form = (html.match(/<form\b[^>]*>[\s\S]*?<\/form>/g) || []).find((value) => value.includes('name="password"'));
    assert.ok(form, "Login form must render.");
    const hidden = (form.match(/<input[^>]+\$ACTION[^>]*>/g) || []).map((tag) => ({
      name: tag.match(/name="([^"]+)"/)![1],
      value: (tag.match(/value="([^"]*)"/)?.[1] || "").replaceAll("&quot;", '"').replaceAll("&amp;", "&"),
    }));
    assert.ok(hidden.length, "Server Action inputs must render.");
    const login = async (account: string, password: string, ip = "198.51.100.200") => {
      const body = new FormData();
      for (const input of hidden) body.set(input.name, input.value);
      body.set("email", account);
      body.set("password", password);
      return fetch(`${base}/login`, { method: "POST", body, redirect: "manual", headers: { Origin: base, "X-Forwarded-For": ip }, signal: AbortSignal.timeout(15_000) });
    };
    const loginAttempts = [];
    for (let attempt = 1; attempt <= 8; attempt++) {
      const response = await login(email, "Incorrect-audit-password!", `198.51.100.${attempt}`);
      const text = await response.text();
      assert.equal(response.status, 200);
      const limited = text.includes(securityCopy("en").authLimited);
      assert.equal(limited, attempt > 5);
      if (attempt <= 5) assert.equal(text.includes(securityCopy("en").credentialsInvalid), true);
      assert.equal(response.headers.has("set-cookie"), false);
      loginAttempts.push({ attempt, status: response.status, limited, forgedIpRotated: true, sessionCreated: false });
    }
    evidence.loginAttempts = loginAttempts;
    if (url.port === "3128") {
      const accounts = [];
      for (const demo of DEMO_USERS) {
        const rejected = await login(demo.email, demo.password);
        assert.equal(rejected.status, 200);
        assert.equal((await rejected.text()).includes(securityCopy("en").credentialsInvalid), true);
        assert.equal(rejected.headers.has("set-cookie"), false);
        const rotated = await login(demo.email, FIXTURE_PASSWORDS[demo.email]);
        assert.equal(rotated.status, 303);
        assert.equal(rotated.headers.has("set-cookie"), true);
        const token = rotated.headers.get("set-cookie")?.match(/mb_session=([^;]+)/)?.[1];
        assert.ok(token);
        sessionIds.push(sessionTokenToId(decodeURIComponent(token)));
        accounts.push({ role: demo.role, legacyRejected: true, rotatedPasswordAccepted: true, redirect: rotated.headers.get("location") });
      }
      evidence.productionDemoGate = accounts;
      // A temporary fixture-only rename proves missing quota storage fails closed.
      let renamed = false;
      try {
        await connection.unsafe("alter table rate_limit_buckets rename to rate_limit_buckets_security_probe");
        renamed = true;
        const unavailable = await login(DEMO_USERS[0].email, FIXTURE_PASSWORDS[DEMO_USERS[0].email]);
        assert.equal(unavailable.status, 200);
        assert.equal((await unavailable.text()).includes(securityCopy("en").accountsUnavailable), true);
        assert.equal(unavailable.headers.has("set-cookie"), false);
        evidence.missingQuotaStorageFailsClosed = true;
      } finally {
        if (renamed) await connection.unsafe("alter table rate_limit_buckets_security_probe rename to rate_limit_buckets");
      }
    }
    const chatCases = [];
    for (const [name, body, expected] of [["null", null, 400], ["array", [], 400], ["empty", { mode: "customer", messages: [] }, 400], ["oversized", { mode: "customer", messages: [{ role: "user", content: "x".repeat(4001) }] }, 413]] as const) {
      const response = await fetch(`${base}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json", Cookie: "mb_lang=zh" }, body: JSON.stringify(body), signal: AbortSignal.timeout(15_000) });
      const text = await response.text();
      assert.equal(response.status, expected);
      assert.equal(text, expected === 413 ? securityCopy("zh").tooLarge : securityCopy("zh").badRequest);
      chatCases.push({ name, status: response.status, localizedChinese: true });
    }
    const unconfigured = await fetch(`${base}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json", Cookie: "mb_lang=ms" }, body: JSON.stringify({ mode: "customer", messages: [{ role: "user", content: "Hello" }] }), signal: AbortSignal.timeout(15_000) });
    assert.equal(unconfigured.status, 503);
    assert.equal(await unconfigured.text(), securityCopy("ms").chatUnavailable);
    chatCases.push({ name: "no-provider-key", status: unconfigured.status, localizedBahasaMelayu: true });
    evidence.chatCases = chatCases;
    evidence.noExternalAiRequest = true;
    mkdirSync("output/audit-2026-10-04", { recursive: true });
    writeFileSync("output/audit-2026-10-04/security-fix-runtime.json", JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify(evidence, null, 2));
  } finally {
    for (const account of [email, ...DEMO_USERS.map((demo) => demo.email)]) {
      const accountKey = authBuckets("login", account).at(-1)!.key;
      await connection`delete from rate_limit_buckets where key=${accountKey}`;
    }
    for (const sessionId of sessionIds) await connection`delete from sessions where id=${sessionId}`;
    await connection.end();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
