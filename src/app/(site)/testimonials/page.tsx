import type { Metadata } from "next";
import { Button, Container, SectionHeading, Stars } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { getTestimonials } from "@/lib/content";
import { getDict } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Real stories from Merveilleux Beauty customers and distributors across Malaysia.",
};

export default async function TestimonialsPage() {
  const [testimonials, dict] = await Promise.all([getTestimonials(), getDict()]);
  const d = dict.testimonials;

  return (
    <>
      <section className="border-b border-line bg-white/60 py-16 sm:py-20">
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
              className="rounded-2xl border border-line bg-white p-7 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(74,48,64,0.4)]"
            >
              <Stars count={t.rating} />
              <blockquote className="mt-4 font-serif text-xl leading-snug text-charcoal">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-light font-serif text-lg text-rose-deep">
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

        <div className="mt-16 rounded-3xl border border-rose-light bg-gradient-to-br from-rose-light/40 to-gold-light/40 p-10 text-center sm:p-14">
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
