import { fixtureDatabaseUrl } from "./security-fixture";
import { consumeRateLimits } from "../../src/lib/rate-limit";

async function main() {
  fixtureDatabaseUrl();
  const key = process.env.TEST_LIMITER_KEY;
  if (!key?.startsWith("test:")) throw new Error("A regression-only quota key is required.");
  const results = await Promise.all(Array.from({ length: 10 }, () => consumeRateLimits([{ key, limit: 5, windowMs: 60_000 }])));
  console.log(JSON.stringify(results));
  process.exit(0);
}
main().catch((error) => { console.error(error.message); process.exit(1); });
