import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { promotions, type Promotion } from "@/db/schema";
import { savePromotion, deletePromotion } from "@/lib/admin-actions";
import { DashHeading } from "@/components/dash";
import { getDict } from "@/i18n/server";
import { locales, localeNames } from "@/i18n/config";

const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-bronze";
const label =
  "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-mid";

export default async function AdminPromotionsPage() {
  await requireAdmin();
  const [rows, dict] = await Promise.all([
    db.select().from(promotions).orderBy(asc(promotions.sortOrder)),
    getDict(),
  ]);
  const d = dict.admin;

  return (
    <>
      <DashHeading
        eyebrow={d.promotionsEyebrow}
        title={d.promotionsTitle}
        subtitle={d.promotionsSub}
      />

      <details className="mb-6 rounded-2xl border border-champagne bg-champagne/20 p-5">
        <summary className="cursor-pointer text-sm font-semibold text-bronze">
          {d.addPromotion}
        </summary>
        <div className="mt-4">
          <PromotionForm saveLabel={d.createPromotion} />
        </div>
      </details>

      <div className="space-y-3">
        {rows.map((p) => (
          <details
            key={p.id}
            className="rounded-2xl border border-line bg-white p-5"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-3">
              <span className="font-medium text-charcoal">{p.title.en}</span>
              <span className="flex items-center gap-2 text-xs">
                <span className="text-mid">{p.priceRM}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-semibold ${
                    p.published
                      ? "bg-green-light text-green"
                      : "bg-cream text-mid"
                  }`}
                >
                  {p.published ? d.published : d.hidden}
                </span>
              </span>
            </summary>
            <div className="mt-4">
              <PromotionForm promotion={p} saveLabel={d.saveChanges} />
              <form action={deletePromotion} className="mt-3">
                <input type="hidden" name="id" value={p.id} />
                <button className="text-xs font-medium text-bronze hover:underline">
                  {d.deletePromotion}
                </button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}

function LocalizedField({
  prefix,
  values,
  multiline,
  labelText,
}: {
  prefix: string;
  values?: Record<string, string> | null;
  multiline?: boolean;
  labelText: string;
}) {
  return (
    <div>
      <label className={label}>{labelText}</label>
      <div className="grid gap-2 sm:grid-cols-3">
        {locales.map((l) => {
          const name = `${prefix}_${l}`;
          const val = values?.[l] ?? "";
          return (
            <div key={l}>
              <span className="mb-1 block text-[10px] uppercase tracking-wide text-mid">
                {localeNames[l]}
              </span>
              {multiline ? (
                <textarea
                  name={name}
                  defaultValue={val}
                  rows={3}
                  lang={l}
                  className={input}
                />
              ) : (
                <input name={name} defaultValue={val} lang={l} className={input} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PromotionForm({
  promotion,
  saveLabel,
}: {
  promotion?: Promotion;
  saveLabel: string;
}) {
  return (
    <form action={savePromotion} className="space-y-4">
      {promotion && <input type="hidden" name="id" value={promotion.id} />}

      <LocalizedField
        prefix="title"
        values={promotion?.title}
        labelText="Title"
      />
      <LocalizedField
        prefix="desc"
        values={promotion?.description}
        multiline
        labelText="Description"
      />
      <LocalizedField prefix="tag" values={promotion?.tag} labelText="Tag" />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Slug</label>
          <input
            name="slug"
            defaultValue={promotion?.slug}
            required
            className={input}
          />
        </div>
        <div>
          <label className={label}>Graphic path</label>
          <input
            name="graphic"
            defaultValue={promotion?.graphic ?? "/products/oxy-bright-serum.jpg"}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Price (RM)</label>
          <input name="priceRM" defaultValue={promotion?.priceRM} className={input} />
        </div>
        <div>
          <label className={label}>Was (RM)</label>
          <input name="wasRM" defaultValue={promotion?.wasRM} className={input} />
        </div>
        <div>
          <label className={label}>Save (RM)</label>
          <input name="saveRM" defaultValue={promotion?.saveRM} className={input} />
        </div>
        <div>
          <label className={label}>Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={promotion?.sortOrder ?? 0}
            className={input}
          />
        </div>
      </div>

      <div>
        <label className={label}>Product slugs (one per line)</label>
        <textarea
          name="productSlugs"
          defaultValue={promotion?.productSlugs.join("\n")}
          rows={3}
          className={input}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          name="published"
          defaultChecked={promotion?.published ?? true}
          className="accent-bronze"
        />
        Published
      </label>

      <button className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-cream hover:bg-umber">
        {saveLabel}
      </button>
    </form>
  );
}
