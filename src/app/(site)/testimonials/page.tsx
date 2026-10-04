import { localizedPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/settings";
import { Button, Container, SectionHeading, Stars } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { getTestimonials } from "@/lib/content";
import { getDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata("testimonials");
}

export default async function TestimonialsPage() {
  if (!(await isFeatureEnabled("testimonials"))) notFound();
  const [testimonials, dict] = await Promise.all([getTestimonials(), getDict()]);
  const d = dict.testimonials;

  return (
    <>
      <section className="border-b border-line bg-porcelain/60 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={d.eyebrow} title={d.title} description={d.desc} />
        </Container>
      </section>

      <Container className="py-16">
        <div className="columns-1 gap-5 md:columns-2 [&>*]:mb-5">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.name}
              delay={(i % 2) * 100}
              className="mb-5 break-inside-avoid"
            >
            <figure
              className="rounded-[2px] border border-line bg-porcelain p-7 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(69,61,49,0.4)]"
            >
              <Stars count={t.rating} />
              <blockquote className="mt-4 font-serif text-xl leading-snug text-charcoal">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-champagne font-serif text-lg text-bronze">
                  {t.name.charAt(0)}
                </span>
                <span className="text-sm">
                  <span className="block font-medium text-charcoal">
                    {t.name}
                  </span>
                  <span className="text-mid">{t.role}</span>
                </span>
              </figcaption>
            </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 rounded-[2px] border border-champagne bg-gradient-to-br from-champagne/40 to-gold-light/40 p-10 text-center sm:p-14">
          <h2 className="font-serif text-3xl font-medium text-charcoal sm:text-4xl">
            {d.haveStoryTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-mid">{d.haveStoryBody}</p>
          <div className="mt-7 flex justify-center">
            <Button href="/contact">{d.shareStory}</Button>
          </div>
        </div>
      </Container>
    </>
  );
}
