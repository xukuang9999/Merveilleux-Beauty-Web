import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import postgres from "postgres";
import { fixtureDatabaseUrl } from "./security-fixture";
import { hashPassword } from "../../src/lib/auth-core";

const run = promisify(execFile);

async function main() {
  const fixtureUrl = fixtureDatabaseUrl();
  const target = new URL(fixtureUrl);
  const databaseName = `merc_security_seed_${randomUUID().replaceAll("-", "")}`;
  const administrator = postgres(fixtureUrl, { prepare: false });
  let isolated: ReturnType<typeof postgres> | undefined;
  let created = false;
  try {
    await administrator.unsafe(`create database "${databaseName}"`);
    created = true;
    target.pathname = `/${databaseName}`;
    isolated = postgres(target.toString(), { prepare: false });
    // Copy schema only; real audit content/accounts are never cloned or reseeded.
    const schema = await run(process.env.PG_DUMP_BIN || "pg_dump", ["--schema-only", "--no-owner", "--no-privileges", fixtureUrl], { maxBuffer: 4 * 1024 * 1024 });
    // pg_dump 17 emits psql-only \restrict/\unrestrict guards around plain SQL.
    const schemaSql = schema.stdout.split("\n").filter((line) => !/^\\(?:un)?restrict /.test(line)).join("\n");
    await isolated.unsafe(schemaSql);
    await isolated.unsafe("set search_path to public");
    const environment: NodeJS.ProcessEnv = {
      ...process.env, DATABASE_URL: target.toString(), NODE_ENV: "production", SEED_DEMO_USERS: "0",
      BOOTSTRAP_ADMIN_EMAIL: "", BOOTSTRAP_ADMIN_PASSWORD: "", BOOTSTRAP_ADMIN_NAME: "",
    };
    const seed = (extra: Record<string, string> = {}) => run(process.execPath, [resolve("node_modules/tsx/dist/cli.mjs"), "src/db/seed.ts"], { env: { ...environment, ...extra }, timeout: 15_000 });
    await seed();
    assert.equal((await isolated`select * from users`).length, 0);
    const bootstrap = { BOOTSTRAP_ADMIN_EMAIL: "bootstrap@example.invalid", BOOTSTRAP_ADMIN_PASSWORD: "Explicit-Seed-Owner!2026", BOOTSTRAP_ADMIN_NAME: "Bootstrap Test Owner" };
    await seed(bootstrap);
    const [owner] = await isolated`select * from users`;
    assert.equal(owner.role, "master_admin");
    const customerId = randomUUID();
    const customerHash = await hashPassword("Preserved-Customer!2026");
    await isolated`insert into users(id,email,name,password_hash,role,status,created_at) values(${customerId},'preserved@example.invalid','Preserved account',${customerHash},'customer','active',now())`;
    await isolated`insert into sessions(id,user_id,expires_at) values('preserved-session',${customerId},now()+interval '1 day')`;
    const [product] = await isolated`select id,slug from products order by id limit 1`;
    const [kb] = await isolated`select id from kb_articles order by id limit 1`;
    const [promotion] = await isolated`select id from promotions order by id limit 1`;
    await isolated`delete from products where id=${product.id}`;
    await isolated`delete from kb_articles where id=${kb.id}`;
    await isolated`delete from promotions where id=${promotion.id}`;
    const [edited] = await isolated`select id from products order by id limit 1`;
    await isolated`update products set name='Preserved product edit', published=false where id=${edited.id}`;
    const before = {
      users: await isolated`select * from users order by email`, sessions: await isolated`select * from sessions`,
      products: await isolated`select * from products order by id`, kb: await isolated`select * from kb_articles order by id`,
      promotions: await isolated`select * from promotions order by id`, modules: await isolated`select * from training_modules order by id`,
      questions: await isolated`select * from quiz_questions order by id`,
    };
    await seed({ ...bootstrap, BOOTSTRAP_ADMIN_PASSWORD: "Another-Explicit-Password!2026" });
    assert.deepEqual(await isolated`select * from users order by email`, before.users);
    assert.deepEqual(await isolated`select * from sessions`, before.sessions);
    assert.deepEqual(await isolated`select * from products order by id`, before.products);
    assert.deepEqual(await isolated`select * from kb_articles order by id`, before.kb);
    assert.deepEqual(await isolated`select * from promotions order by id`, before.promotions);
    assert.deepEqual(await isolated`select * from training_modules order by id`, before.modules);
    assert.deepEqual(await isolated`select * from quiz_questions order by id`, before.questions);
    await assert.rejects(seed({ SEED_DEMO_USERS: "1" }));
    assert.deepEqual(await isolated`select * from users order by email`, before.users);
    const evidence = { isolatedTemporaryDatabase: true, defaultSeedCreatesNoDemoUsers: true, explicitOwnerBootstrap: true, rerunPreservesAccountsPasswordsAndSessions: true, initializedCataloguesDoNotResurrectDeletedRows: true, adminEditsAndUnpublishedStatusPreserved: true, trainingRowsNotDuplicated: true, productionDemoSeedRejectedBeforeWrites: true };
    mkdirSync("output/audit-2026-10-04", { recursive: true });
    writeFileSync("output/audit-2026-10-04/security-fix-seed.json", JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify(evidence, null, 2));
  } finally {
    await isolated?.end();
    if (created) await administrator.unsafe(`drop database "${databaseName}"`);
    await administrator.end();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
