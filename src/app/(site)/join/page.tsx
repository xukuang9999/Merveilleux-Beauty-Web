import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";
import EnquiryForm from "@/components/EnquiryForm";
import { whatsappLink } from "@/lib/data";
import { getDict } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Join Us — Become a Distributor",
  description:
    "Partner with Merveilleux. Submit an enquiry, request the product catalogue, book a discovery call, or reach us on WhatsApp.",
};

const actionIcons = ["✉️", "📖", "📞", "💬"];

export default async function JoinPage() {
  const dict = await getDict();
  const j = dict.join;

  const links = [
    whatsappLink("Hi Merveilleux Beauty, I'm interested in becoming a distributor."),
    whatsappLink("Hi Merveilleux Beauty, please send me the full product catalogue."),
    whatsappLink("Hi Merveilleux Beauty, I'd like to book a distributor discovery call."),
    whatsappLink("Hi Merveilleux Beauty, I'm interested in becoming a distributor."),
  ];

  return (
    <>
      {/* HERO — over the training theatre render */}
      <section className="relative overflow-hidden border-b border-line py-16 sm:py-20">
        <Image
          src="/renders/theatre.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="ken-burns object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-cream/85" />
        <Container className="relative">
          <Reveal>
            <p className="eyebrow mb-3">{j.eyebrow}</p>
            <h1 className="max-w-3xl font-serif text-4xl font-medium leading-tight text-charcoal sm:text-5xl">
              {j.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mid">
              {j.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={links[1]} variant="gold" external>
                {j.downloadBrochure}
              </Button>
              <Button href={links[2]} variant="outline" external>
                {j.bookCall}
              </Button>
              <Button href={links[3]} external>
                {j.whatsappUs}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* WHAT YOU CAN DO */}
      <Container className="py-16">
        <Reveal>
          <SectionHeading eyebrow={j.eyebrow} title={j.doTitle} />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {j.actions.map((act, i) => (
            <Reveal key={i} variant="up" delay={i * 90}>
              <a
                href={links[i]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col rounded-[2px] border border-line bg-porcelain p-6 transition-all duration-300 hover:-translate-y-1 hover:border-champagne hover:shadow-[0_18px_40px_-24px_rgba(69,61,49,0.4)]"
              >
                <span className="text-2xl">{actionIcons[i]}</span>
                <h3 className="mt-3 font-serif text-xl text-charcoal">
                  {act.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mid">{act.body}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* WHY + STEPS + FORM */}
      <section className="border-y border-line bg-porcelain/60 py-16">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <Reveal>
              <h2 className="font-serif text-3xl font-medium text-charcoal sm:text-4xl">
                {j.whyTitle}
              </h2>
              <ul className="mt-6 space-y-3">
                {j.why.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-sm text-charcoal">
                    <span className="mt-0.5 text-gold">✓</span>
                    {w}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h3 className="eyebrow mb-4 mt-10">{j.stepsTitle}</h3>
              <ol className="space-y-4">
                {j.steps.map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-champagne/60 font-serif text-sm text-bronze">
                      {i + 1}
                    </span>
                    <div className="pt-0.5">
                      <p className="text-sm font-medium text-charcoal">{s.title}</p>
                      <p className="text-sm text-mid">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <Reveal variant="right">
            <div className="rounded-[2px] border border-line bg-porcelain p-7 sm:p-9">
              <h2 className="font-serif text-2xl text-charcoal">{j.formTitle}</h2>
              <p className="mb-6 mt-1 text-sm text-mid">{j.formSub}</p>
              <EnquiryForm dict={dict.contact} />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
