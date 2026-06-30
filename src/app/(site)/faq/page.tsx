import type { Metadata } from "next";
import { Button, Container, SectionHeading } from "@/components/ui";
import { getFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Q&A",
  description:
    "Answers to common questions about Merveilleux Beauty products, skincare routines and becoming a 经销商.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <>
      <section className="border-b border-line bg-white/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Q&A · FAQ"
            title="Questions, answered"
            description="Everything you might want to know about our products, skincare routines and the 经销商 opportunity. Still stuck? Ask Margaux, our AI advisor."
          />
        </Container>
      </section>

      <Container className="py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {categories.map((cat) => (
            <div key={cat}>
              <h2 className="mb-4 font-serif text-2xl text-charcoal">{cat}</h2>
              <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
                {faqs
                  .filter((f) => f.category === cat)
                  .map((f) => (
                    <details key={f.question} className="group px-6 py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-charcoal marker:hidden">
                        {f.question}
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          className="shrink-0 text-rose-deep transition-transform duration-300 group-open:rotate-45"
                        >
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-mid">
                        {f.answer}
                      </p>
                    </details>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-3xl bg-gradient-to-br from-charcoal to-plum p-10 text-center text-cream sm:p-12">
          <h2 className="font-serif text-2xl font-light sm:text-3xl">
            Still have a question?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-cream/70">
            Ask Margaux any time, or reach our team directly — we&apos;re happy
            to help.
          </p>
          <div className="mt-7 flex justify-center">
            <Button href="/contact" variant="gold">
              Contact us
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
