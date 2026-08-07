// Retail price, shown per region. East Malaysia (Sabah / Sarawak / Labuan) is
// priced separately for freight; until a product has an East price the West
// figure stands alone and the region labels are dropped, so a single-price
// product reads exactly as it did before.
type Props = {
  priceRM: string;
  priceRMEast?: string | null;
  labels: { priceLabel: string; west: string; east: string };
  className?: string;
};

export default function PriceBlock({
  priceRM,
  priceRMEast,
  labels,
  className = "",
}: Props) {
  const rows = priceRMEast
    ? [
        { price: priceRM, region: labels.west },
        { price: priceRMEast, region: labels.east },
      ]
    : [{ price: priceRM, region: null }];

  return (
    <div className={className}>
      <p className="eyebrow mb-1">{labels.priceLabel}</p>
      <div className="space-y-0.5">
        {rows.map((r) => (
          <p key={r.region ?? "single"} className="flex items-baseline gap-2">
            <span className="font-serif text-2xl text-charcoal">{r.price}</span>
            {r.region && (
              <span className="text-xs text-mid">({r.region})</span>
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
