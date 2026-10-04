import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { deleteProduct } from "@/lib/admin-actions";
import { DashHeading } from "@/components/dash";
import ProductEditorForm from "@/components/ProductEditorForm";
import { getDict, getLocale } from "@/i18n/server";

export default async function AdminProductsPage() {
  await requireAdmin();
  const [rows, dict] = await Promise.all([
    db.select().from(products).orderBy(asc(products.sortOrder)),
    getDict(),
  ]);
  const d = dict.admin;
  const locale = await getLocale();

  return (
    <>
      <DashHeading
        eyebrow={d.productsEyebrow}
        title={d.productsTitle}
        subtitle={d.productsSub}
      />

      <details className="mb-6 rounded-2xl border border-champagne bg-champagne/20 p-5">
        <summary className="cursor-pointer text-sm font-semibold text-bronze">
          {d.addProduct}
        </summary>
        <div className="mt-4">
          <ProductEditorForm locale={locale} categories={dict.products.categories} saveLabel={d.createProduct} />
        </div>
      </details>

      <div className="space-y-3">
        {rows.map((p) => (
          <details key={p.id} className="rounded-2xl border border-line bg-white p-5">
            <summary className="flex cursor-pointer items-center justify-between gap-3">
              <span className="font-medium text-charcoal">{p.name}</span>
              <span className="flex items-center gap-2 text-xs">
                <span className="text-mid">
                  {p.priceRMEast ? `${p.priceRM} / ${p.priceRMEast}` : p.priceRM}
                </span>
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
              <ProductEditorForm locale={locale} categories={dict.products.categories} product={p} saveLabel={d.saveChanges} />
              <form action={deleteProduct} className="mt-3">
                <input type="hidden" name="id" value={p.id} />
                <button className="text-xs font-medium text-bronze hover:underline">
                  {d.deleteProduct}
                </button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
