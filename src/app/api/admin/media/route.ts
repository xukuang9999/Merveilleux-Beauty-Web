import { NextRequest } from "next/server";
import { getCurrentUser, isAdminTier } from "@/lib/auth";
import { validateImage, storeImage } from "@/lib/media";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";

export const runtime = "nodejs";
export const maxDuration = 30;

// Upload a product/marketing image. Admin-tier (admin OR master).
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !isAdminTier(user.role)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let file: FormDataEntryValue | null;
  try {
    const form = await req.formData();
    file = form.get("file");
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!(file instanceof File)) {
    return new Response("No file", { status: 400 });
  }

  const invalid = validateImage(file);
  if (invalid) return new Response(invalid.error, { status: invalid.status });

  try {
    const asset = await storeImage(file);
    await db.insert(mediaAssets).values({
      url: asset.url,
      pathname: asset.pathname,
      kind: "image",
      contentType: asset.contentType,
      size: asset.size,
      uploadedBy: user.id,
    });
    return Response.json({ url: asset.url });
  } catch {
    return new Response("Upload failed", { status: 500 });
  }
}
