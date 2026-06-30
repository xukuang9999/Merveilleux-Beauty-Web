import { asc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { saveProduct, deleteProduct } from "@/lib/admin-actions";
import { DashHeading } from "@/components/dash";

const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-rose-deep";
const label = "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-mid";

export default async function AdminProductsPage() {
  await requireRole(["admin"]);
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder));

  return (
    <>
      <DashHeading
        eyebrow="Admin · Catalogue"
        title="Products"
        subtitle="Edit the catalogue shown on the public site. Changes publish instantly."
      />

      <details className="mb-6 rounded-2xl border border-rose-light bg-rose-light/20 p-5">
        <summary className="cursor-pointer text-sm font-semibold text-rose-deep">
          + Add a new product
        </summary>
        <div className="mt-4">
          <ProductForm />
        </div>
      </details>

      <div className="space-y-3">
        {rows.map((p) => (
          <details key={p.id} className="rounded-2xl border border-line bg-white p-5">
            <summary className="flex cursor-pointer items-center justify-between gap-3">
              <span className="font-medium text-charcoal">{p.name}</span>
              <span className="flex items-center gap-2 text-xs">
                <span className="text-mid">{p.priceRM}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-semibold ${
                    p.published
                      ? "bg-green-light text-green"
                      : "bg-cream text-mid"
                  }`}
                >
                  {p.published ? "Published" : "Hidden"}
                </span>
              </span>
            </summary>
            <div className="mt-4">
              <ProductForm product={p} />
              <form action={deleteProduct} className="mt-3">
                <input type="hidden" name="id" value={p.id} />
                <button className="text-xs font-medium text-rose-deep hover:underline">
                  Delete product
                </button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}

function ProductForm({ product }: { product?: Product }) {
  return (
    <form action={saveProduct} className="space-y-3">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Name</label>
          <input name="name" defaultValue={product?.name} required className={input} />
        </div>
        <div>
          <label className={label}>Slug</label>
          <input name="slug" defaultValue={product?.slug} required className={input} />
        </div>
        <div>
          <label className={label}>Type</label>
          <input name="type" defaultValue={product?.type} className={input} />
        </div>
        <div>
          <label className={label}>Price (RM)</label>
          <input name="priceRM" defaultValue={product?.priceRM} className={input} />
        </div>
        <div>
          <label className={label}>Tagline</label>
          <input name="tagline" defaultValue={product?.tagline} className={input} />
        </div>
        <div>
          <label className={label}>Graphic path</label>
          <input
            name="graphic"
            defaultValue={product?.graphic ?? "/graphics/product-radiance-serum.svg"}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={product?.sortOrder ?? 0}
            className={input}
          />
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm text-charcoal">
          <input
            type="checkbox"
            name="published"
            defaultChecked={product?.published ?? true}
            className="accent-rose-deep"
          />
          Published
        </label>
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea
          name="description"
          defaultValue={product?.description}
          rows={3}
          className={input}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Key ingredients (one per line)</label>
          <textarea
            name="keyIngredients"
            defaultValue={product?.keyIngredients.join("\n")}
            rows={3}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Benefits (one per line)</label>
          <textarea
            name="benefits"
            defaultValue={product?.benefits.join("\n")}
            rows={3}
            className={input}
          />
        </div>
      </div>
      <button className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-cream hover:bg-plum">
        {product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
