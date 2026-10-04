import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { promotions, type Promotion } from "@/db/schema";
import { savePromotion, deletePromotion } from "@/lib/admin-actions";
import { DashHeading } from "@/components/dash";
import { getDict, getLocale } from "@/i18n/server";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { uiCopy } from "@/i18n/ui-copy";

const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-bronze";
const label =
  "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-mid";

const promotionLabels = {
  en: { title: "Title", tag: "Tag", graphic: "Graphic path", price: "Price (RM)", was: "Original price (RM)", save: "Savings (RM)", products: "Product slugs (one per line)" },
  zh: { title: "标题", tag: "标签", graphic: "图片路径", price: "售价（RM）", was: "原价（RM）", save: "节省（RM）", products: "产品网址标识（每行一项）" },
  ms: { title: "Tajuk", tag: "Label", graphic: "Laluan imej", price: "Harga (RM)", was: "Harga asal (RM)", save: "Penjimatan (RM)", products: "Pengenal URL produk (satu setiap baris)" },
};

export default async function AdminPromotionsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const [rows, dict, locale] = await Promise.all([
    db.select().from(promotions).orderBy(asc(promotions.sortOrder)),
    getDict(),
    getLocale(),
  ]);
  const d = dict.admin;
  const query = await searchParams;

  return (
    <>
      <DashHeading
        eyebrow={d.promotionsEyebrow}
        title={d.promotionsTitle}
        subtitle={d.promotionsSub}
      />

      {query.error === "invalid-products" && (
        <p role="alert" className="mb-5 rounded-xl border border-bronze/30 bg-champagne/40 p-4 text-sm text-bronze">
          {d.promotionProductsInvalid}
        </p>
      )}

      <details className="mb-6 rounded-2xl border border-champagne bg-champagne/20 p-5">
        <summary className="cursor-pointer text-sm font-semibold text-bronze">
          {d.addPromotion}
        </summary>
        <div className="mt-4">
          <PromotionForm saveLabel={d.createPromotion} locale={locale} />
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
              <PromotionForm promotion={p} saveLabel={d.saveChanges} locale={locale} />
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
  formId,
}: {
  prefix: string;
  values?: Record<string, string> | null;
  multiline?: boolean;
  labelText: string;
  formId: string;
}) {
  return (
    <fieldset>
      <legend className={label}>{labelText}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {locales.map((l) => {
          const name = `${prefix}_${l}`;
          const id = `${formId}-${name}`;
          const val = values?.[l] ?? "";
          return (
            <div key={l}>
              <label htmlFor={id} className="mb-1 block text-[10px] uppercase tracking-wide text-mid">
                {labelText} · {localeNames[l]}
              </label>
              {multiline ? (
                <textarea
                  name={name} id={id}
                  defaultValue={val}
                  rows={3}
                  lang={l}
                  className={input}
                />
              ) : (
                <input name={name} id={id} defaultValue={val} required={prefix === "title" && l === "en"} lang={l} className={input} />
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function PromotionForm({
  promotion,
  saveLabel,
  locale,
}: {
  promotion?: Promotion;
  saveLabel: string;
  locale: Locale;
}) {
  const copy = uiCopy(locale);
  const fields = promotionLabels[locale];
  const id = `promotion-${promotion?.id ?? "new"}`;
  return (
    <form action={savePromotion} className="space-y-4">
      {promotion && <input type="hidden" name="id" value={promotion.id} />}

      <LocalizedField
        prefix="title"
        values={promotion?.title}
        labelText={fields.title}
        formId={id}
      />
      <LocalizedField
        prefix="desc"
        values={promotion?.description}
        multiline
        labelText={copy.description}
        formId={id}
      />
      <LocalizedField prefix="tag" values={promotion?.tag} labelText={fields.tag} formId={id} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-slug`} className={label}>{copy.slug}</label>
          <input
            name="slug"
            id={`${id}-slug`}
            defaultValue={promotion?.slug}
            required
            className={input}
          />
        </div>
        <div>
          <label htmlFor={`${id}-graphic`} className={label}>{fields.graphic}</label>
          <input
            name="graphic"
            id={`${id}-graphic`}
            defaultValue={promotion?.graphic ?? "/products/oxy-bright-serum.png"}
            className={input}
          />
        </div>
        <div>
          <label htmlFor={`${id}-priceRM`} className={label}>{fields.price}</label>
          <input id={`${id}-priceRM`} name="priceRM" defaultValue={promotion?.priceRM} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-wasRM`} className={label}>{fields.was}</label>
          <input id={`${id}-wasRM`} name="wasRM" defaultValue={promotion?.wasRM} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-saveRM`} className={label}>{fields.save}</label>
          <input id={`${id}-saveRM`} name="saveRM" defaultValue={promotion?.saveRM} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-sortOrder`} className={label}>{copy.sortOrder}</label>
          <input
            name="sortOrder"
            id={`${id}-sortOrder`}
            type="number"
            defaultValue={promotion?.sortOrder ?? 0}
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-productSlugs`} className={label}>{fields.products}</label>
        <textarea
          name="productSlugs"
          id={`${id}-productSlugs`}
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
        {copy.published}
      </label>

      <button className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-cream hover:bg-umber">
        {saveLabel}
      </button>
    </form>
  );
}
