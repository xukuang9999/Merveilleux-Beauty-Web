"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Uploads an image to the media library via /api/admin/media, then refreshes
// the server-rendered grid. Admin-tier (the route enforces it).
export default function MediaUploadButton({ label }: { label: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body });
      if (!res.ok) {
        setError((await res.text()) || "Upload failed");
      } else {
        router.refresh();
      }
    } catch {
      setError("Upload failed — check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-umber disabled:opacity-60"
      >
        {busy ? "Uploading…" : label}
      </button>
      <span className="text-[11px] text-mid">
        JPEG, PNG, WebP or AVIF · max 5 MB
      </span>
      {error && <span className="text-[11px] text-bronze">{error}</span>}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
