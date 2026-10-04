"use client";
import { useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveProduct } from "@/lib/admin-actions";
import { productCategories } from "@/lib/categories";
import type { Product } from "@/db/schema";
import { uiCopy } from "@/i18n/ui-copy";
import ImageUploadField from "./ImageUploadField";
const input = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-bronze";
const label = "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-mid";
export default function ProductEditorForm({
  product,
  saveLabel,
  locale,
  categories,
}: {
  product?: Product;
  saveLabel: string;
  locale: string;
  categories: Record<string, string>;
}) {
  const copy = uiCopy(locale);
  const id = useId();
  const busyRef = useRef(false);
  const [uploading, setUploading] = useState(false);
  const setBusy = (busy: boolean) => { busyRef.current = busy; setUploading(busy); };
  return (
    <form action={saveProduct} className="space-y-3" aria-busy={uploading} onSubmit={(e) => { if (busyRef.current) e.preventDefault(); }}>
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>{copy.name}</label>
          <input id={`${id}-name`} name="name" defaultValue={product?.name} required className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-slug`} className={label}>{copy.slug}</label>
          <input id={`${id}-slug`} name="slug" defaultValue={product?.slug} required className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-type`} className={label}>{copy.type}</label>
          <input id={`${id}-type`} name="type" defaultValue={product?.type} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-category`} className={label}>{copy.category}</label>
          <select
            id={`${id}-category`} name="category"
            defaultValue={product?.category ?? ""}
            className={input}
          >
            <option value="">{copy.uncategorised}</option>
            {productCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {categories[c.slug] || c.en}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-priceRM`} className={label}>{copy.westPrice}</label>
          <input
            id={`${id}-priceRM`} name="priceRM"
            defaultValue={product?.priceRM}
            placeholder="RM168"
            className={input}
          />
        </div>
        <div>
          <label htmlFor={`${id}-priceRMEast`} className={label}>{copy.eastPrice}</label>
          <input
            id={`${id}-priceRMEast`} name="priceRMEast"
            defaultValue={product?.priceRMEast ?? ""}
            placeholder={copy.unconfirmedPrice}
            className={input}
          />
          <p className="mt-1 text-xs text-mid">
            {copy.eastPriceHint}
          </p>
        </div>
        <div>
          <label htmlFor={`${id}-tagline`} className={label}>{copy.tagline}</label>
          <input id={`${id}-tagline`} name="tagline" defaultValue={product?.tagline} className={input} />
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            name="graphic"
            defaultValue={product?.graphic ?? ""}
            label={copy.productImage}
            locale={locale}
            onBusyChange={setBusy}
          />
        </div>
        <div>
          <label htmlFor={`${id}-sortOrder`} className={label}>{copy.sortOrder}</label>
          <input
            id={`${id}-sortOrder`} name="sortOrder"
            type="number"
            defaultValue={product?.sortOrder ?? 0}
            className={input}
          />
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm text-charcoal">
          <input
            type="checkbox"
            name="published"
            defaultChecked={product?.published ?? false}
            className="accent-bronze"
          />
          {copy.published}
        </label>
      </div>
      <div>
        <label htmlFor={`${id}-description`} className={label}>{copy.description}</label>
        <textarea
          id={`${id}-description`} name="description"
          defaultValue={product?.description}
          rows={3}
          className={input}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-keyIngredients`} className={label}>{copy.ingredients}</label>
          <textarea
            id={`${id}-keyIngredients`} name="keyIngredients"
            defaultValue={product?.keyIngredients.join("\n")}
            rows={3}
            className={input}
          />
        </div>
        <div>
          <label htmlFor={`${id}-benefits`} className={label}>{copy.benefits}</label>
          <textarea
            id={`${id}-benefits`} name="benefits"
            defaultValue={product?.benefits.join("\n")}
            rows={3}
            className={input}
          />
        </div>
      </div>
      <SaveButton label={saveLabel} uploading={uploading} saving={copy.saving} />
    </form>
  );
}

function SaveButton({ label, uploading, saving }: { label: string; uploading: boolean; saving: string }) {
  const { pending } = useFormStatus();
  return <button disabled={uploading || pending} className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-cream hover:bg-umber disabled:opacity-50">{pending ? saving : label}</button>;
}
