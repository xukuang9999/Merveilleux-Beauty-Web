import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import ProductShowcase from "@/components/ProductShowcase";
import { getProduct } from "@/lib/content";
import { productDetails } from "@/lib/seed-data";
import { whatsappLink } from "@/lib/data";
import { getLocale, getDict } from "@/i18n/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product" };
  return { title: p.name, description: p.tagline };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, locale, dict] = await Promise.all([
    getProduct(slug),
    getLocale(),
    getDict(),
  ]);
  if (!product) notFound();

  const d = dict.products;
  const detail = productDetails[slug];
  const steps = detail?.howToUse[locale] ?? detail?.howToUse.en ?? [];
  const categoryLabel = product.category
    ? d.categories[product.category as keyof typeof d.categories]
    : undefined;

  const enquiryMsg = `Hi Merveilleux Beauty, I'd like to enquire about ${product.name} (${product.priceRM}).`;

  return (
    <section>
      <Container className="py-10 sm:py-14">
        <Link
          href="/products"
          className="text-sm text-mid transition-colors hover:text-charcoal"
        >
          {d.backToProducts}
        </Link>

        <div className="mt-8">
          <ProductShowcase
            name={product.name}
            tagline={product.tagline}
            type={product.type}
            categoryLabel={categoryLabel}
            priceRM={product.priceRM}
            size={detail?.size}
            graphic={product.graphic}
            description={product.description}
            keyIngredients={product.keyIngredients}
            benefits={product.benefits}
            howToUse={steps}
            whatsappHref={whatsappLink(enquiryMsg)}
            labels={{
              priceLabel: d.priceLabel,
              size: d.size,
              clickForDetails: d.clickForDetails,
              hideDetails: d.hideDetails,
              overview: d.overview,
              keyIngredients: d.keyIngredients,
              benefits: d.benefits,
              howToUse: d.howToUse,
              enquireNow: d.enquireNow,
            }}
          />
        </div>
      </Container>
    </section>
  );
}
