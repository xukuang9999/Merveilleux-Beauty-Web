export default function ConceptImageNotice({
  graphic, label, note, className = "",
}: { graphic: string; label: string; note?: string; className?: string }) {
  if (!graphic.includes("-CONCEPT.")) return null;
  return (
    <div className={`rounded-[2px] border border-gold/40 bg-cream/95 p-2.5 text-xs text-charcoal ${className}`}>
      <p className="font-semibold">{label}</p>
      {note && <p className="mt-1 leading-relaxed text-mid">{note}</p>}
    </div>
  );
}
