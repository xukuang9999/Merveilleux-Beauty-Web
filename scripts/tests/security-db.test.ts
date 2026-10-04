import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve } from "node:path";
import postgres from "postgres";
import { fixtureDatabaseUrl } from "./security-fixture";
import type { RateLimitResult } from "../../src/lib/rate-limit-core";

const run = promisify(execFile);
const integrationUrl = process.env.SECURITY_TEST_DATABASE_URL;
const skip = !integrationUrl;

test("PostgreSQL quota is atomic across separate application processes and resets expired windows", { skip }, async () => {
  const connection = postgres(fixtureDatabaseUrl(integrationUrl), { prepare: false });
  const key = `test:${randomUUID()}`;
  try {
    const workers = await Promise.all([0, 1].map(() => run(process.execPath, [resolve("node_modules/tsx/dist/cli.mjs"), resolve("scripts/tests/rate-limit-worker.ts")], {
      env: { ...process.env, DATABASE_URL: integrationUrl, TEST_LIMITER_KEY: key }, timeout: 15_000,
    })));
    const results = workers.flatMap((worker) => JSON.parse(worker.stdout.trim()) as RateLimitResult[]);
    assert.equal(results.length, 20);
    assert.equal(results.every((result) => result.available), true);
    assert.equal(results.filter((result) => result.allowed).length, 5);
    assert.equal(results.filter((result) => !result.allowed).length, 15);
    assert.equal(results.filter((result) => !result.allowed).every((result) => result.retryAfterSeconds > 0), true);
    await connection`update rate_limit_buckets set reset_at=now()-interval '1 second' where key=${key}`;
    const reset = await run(process.execPath, [resolve("node_modules/tsx/dist/cli.mjs"), resolve("scripts/tests/rate-limit-worker.ts")], { env: { ...process.env, DATABASE_URL: integrationUrl, TEST_LIMITER_KEY: key }, timeout: 15_000 });
    assert.equal((JSON.parse(reset.stdout.trim()) as RateLimitResult[]).filter((result) => result.allowed).length, 5);
  } finally {
    await connection`delete from rate_limit_buckets where key=${key}`;
    await connection.end();
  }
});
