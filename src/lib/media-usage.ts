// Which uploaded media is still referenced by content (product / promotion
// images). Used to block deleting an in-use asset and to badge it in the UI.
import { db } from "@/db";
import { products, promotions } from "@/db/schema";

/** The set of image URLs currently referenced by products or promotions. */
export async function getInUseMediaUrls(): Promise<Set<string>> {
  const urls = new Set<string>();
  try {
    const p = await db.select({ g: products.graphic }).from(products);
    for (const r of p) urls.add(r.g);
    const pr = await db.select({ g: promotions.graphic }).from(promotions);
    for (const r of pr) urls.add(r.g);
  } catch {
    // DB unavailable — treat nothing as in-use (deletion still gated by auth).
  }
  return urls;
}

export async function isMediaInUse(url: string): Promise<boolean> {
  return (await getInUseMediaUrls()).has(url);
}
