import { mapsEmbedUrl } from "@/lib/data";

// Keyless Google Maps embed driven by the company address in data.ts.
export default function MapEmbed({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  return (
    <iframe
      title={title}
      src={mapsEmbedUrl}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={`h-full w-full border-0 ${className}`}
    />
  );
}
