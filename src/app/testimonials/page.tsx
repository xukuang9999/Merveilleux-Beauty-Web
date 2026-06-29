import type { Metadata } from "next";
import { Button, Container, SectionHeading, Stars } from "@/components/ui";
import { testimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Real stories from Merveilleux Beauty customers and 经销商 across Malaysia.",
};

export default function TestimonialsPage() {
  return (
    <>
      <section className="border-b border-line bg-white/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Loved & trusted"
            title="Stories from our community"
            description="From glowing skin to growing businesses — here's what customers and distributors say about Merveilleux Beauty."
          />
        </Container>
      </section>

      <Container className="py-16">
        <div className="columns-1 gap-5 md:columns-2 [&>*]:mb-5">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="break-inside-avoid rounded-2xl border border-line bg-white p-7"
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
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-rose-light bg-gradient-to-br from-rose-light/40 to-gold-light/40 p-10 text-center sm:p-14">
          <h2 className="font-serif text-3xl font-medium text-charcoal sm:text-4xl">
            Have a Merveilleux story?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-mid">
            We love hearing how our products and partnership have made a
            difference. Share yours with us.
          </p>
          <div className="mt-7 flex justify-center">
            <Button href="/contact">Share your story</Button>
          </div>
        </div>
      </Container>
    </>
  );
}
