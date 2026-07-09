// Server-only upload helpers. Uploads go to Vercel Blob when
// BLOB_READ_WRITE_TOKEN is set; otherwise they're written to public/products
// so local dev works without any cloud config. Callers must enforce auth.
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

// contentType → file extension for the allowed image formats.
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export type UploadResult = {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
};

export type UploadError = { error: string; status: number };

export function validateImage(file: File): UploadError | null {
  if (!ALLOWED_IMAGE_TYPES[file.type]) {
    return { error: "Unsupported image type (use JPEG, PNG, WebP or AVIF).", status: 415 };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "Image is too large (max 5 MB).", status: 413 };
  }
  return null;
}

/** Store an already-validated image and return its public URL + metadata. */
export async function storeImage(file: File): Promise<UploadResult> {
  const ext = ALLOWED_IMAGE_TYPES[file.type] ?? "bin";
  const name = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Prod: Vercel Blob (persistent, works on the read-only serverless FS).
    const { put } = await import("@vercel/blob");
    const blob = await put(`products/${name}`, buffer, {
      access: "public",
      contentType: file.type,
    });
    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type,
      size: buffer.length,
    };
  }

  // Dev fallback: write into public/products and serve it as a local path.
  const dir = path.join(process.cwd(), "public", "products");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buffer);
  return {
    url: `/products/${name}`,
    pathname: `products/${name}`,
    contentType: file.type,
    size: buffer.length,
  };
}
