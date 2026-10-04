"use client";

import { useFormStatus } from "react-dom";
import { uiCopy, uploadErrorCopy } from "@/i18n/ui-copy";
import { useRef, useState } from "react";

// Uploads a product image to /api/admin/media and keeps the resulting URL in a
// hidden input so it submits with the surrounding product form. Shows a
// thumbnail with Replace / Remove.
export default function ImageUploadField({
  name,
  defaultValue,
  label,
  locale,
  onBusyChange,
}: {
  name: string;
  defaultValue?: string;
  label: string;
  locale: string;
  onBusyChange?: (busy: boolean) => void;
}) {
  const copy = uiCopy(locale);
  const { pending } = useFormStatus();
  const [uploaded, setUploaded] = useState(false);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file || pending || busy) return;
    setUploaded(false);
    setBusy(true);
    onBusyChange?.(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body });
      if (!res.ok) {
        setError(uploadErrorCopy(res.status, locale));
      } else {
        const data = (await res.json()) as { url: string };
        setUrl(data.url);
        setUploaded(true);
      }
    } catch {
      setError(copy.uploadFailed);
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  }

  return (
    <div>
      <p className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-mid">
        {label}
      </p>
      <p role="status" className="sr-only">{busy ? copy.uploading : uploaded ? copy.uploaded : ""}</p>
      <input type="hidden" name={name} value={url} />

      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-cream">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-mid">{copy.noImage}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy || pending}
              className="rounded-full bg-charcoal px-4 py-1.5 text-xs font-medium text-cream transition-colors hover:bg-umber disabled:opacity-60"
            >
              {busy ? copy.uploading : url ? copy.replace : copy.upload}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => { setUrl(""); setUploaded(false); }}
                disabled={busy || pending}
                className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-mid transition-colors hover:border-bronze hover:text-charcoal disabled:opacity-60"
              >
                {copy.remove}
              </button>
            )}
          </div>
          <p className="text-[11px] text-mid">{copy.imageHint}</p>
          {error && <p role="alert" className="text-[11px] text-bronze">{error}</p>}
        </div>

        <input
          ref={fileRef}
          type="file"
          disabled={busy || pending}
          aria-label={label}
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  );
}
