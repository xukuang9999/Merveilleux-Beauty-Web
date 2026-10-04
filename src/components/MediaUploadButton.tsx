"use client";

import { uiCopy, uploadErrorCopy } from "@/i18n/ui-copy";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Uploads an image to the media library via /api/admin/media, then refreshes
// the server-rendered grid. Admin-tier (the route enforces it).
export default function MediaUploadButton({ label, locale }: { label: string; locale: string }) {
  const copy = uiCopy(locale);
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploaded(false);
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body });
      if (!res.ok) {
        setError(uploadErrorCopy(res.status, locale));
      } else {
        setUploaded(true);
        router.refresh();
      }
    } catch {
      setError(copy.uploadFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <p role="status" className="sr-only">{busy ? copy.uploading : uploaded ? copy.uploaded : ""}</p>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-umber disabled:opacity-60"
      >
        {busy ? copy.uploading : label}
      </button>
      <span className="text-[11px] text-mid">
        {copy.imageHint}
      </span>
      {error && <span role="alert" className="text-[11px] text-bronze">{error}</span>}
      <input
        ref={fileRef}
        type="file"
          aria-label={label}
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
