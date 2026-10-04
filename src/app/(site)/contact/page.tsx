import { localizedPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui";
import EnquiryForm from "@/components/EnquiryForm";
import MapEmbed from "@/components/MapEmbed";
import { site, whatsappLink, mapsLink } from "@/lib/data";
import { getCopy } from "@/lib/settings";
import { getDict, getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata("contact");
}

export default async function ContactPage() {
  const [dict, copy, locale] = await Promise.all([getDict(), getCopy(), getLocale()]);
  const d = dict.contact;

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow mb-3">{copy("contact.eyebrow", d.eyebrow)}</p>
          <h1 className="font-serif text-4xl font-medium leading-tight text-charcoal sm:text-5xl">
            {copy("contact.titleBefore", d.titleBefore)}
            <span className="italic text-bronze">
              {copy("contact.titleHighlight", d.titleHighlight)}
            </span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mid">
            {copy("contact.body", d.body)}
          </p>

          <div className="mt-10 space-y-4">
            <a
              href={whatsappLink("Hi Merveilleux Beauty, I'd like to know more.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-[2px] border border-line bg-porcelain p-5 transition-colors hover:border-champagne"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-light text-green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-charcoal">{d.whatsapp}</p>
                <p className="text-sm text-mid">{d.whatsappSub}</p>
              </div>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-4 rounded-[2px] border border-line bg-porcelain p-5 transition-colors hover:border-champagne"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-champagne text-bronze">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-charcoal">{d.email}</p>
                <p className="text-sm text-mid">{site.email}</p>
              </div>
            </a>
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={`tel:${site.phone.replace(/\s|-/g, "")}`}
                className="flex items-center gap-4 rounded-[2px] border border-line bg-porcelain p-5 transition-colors hover:border-champagne"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-light text-blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-charcoal">{d.phone}</p>
                  <p className="text-sm text-mid">{site.phone}</p>
                </div>
              </a>
              <div className="flex items-center gap-4 rounded-[2px] border border-line bg-porcelain p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-light text-green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 3C4.6 3 1 6 1 9.7c0 2.1 1.2 4 3 5.2l-.7 2.4 2.7-1.4c.9.2 1.8.4 2.7.4h.5a6 6 0 0 1-.2-1.6c0-3.4 3.3-6.1 7.3-6.1h.6C16.3 5.2 13 3 9 3Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-charcoal">WeChat</p>
                  <p className="text-sm text-mid">{site.wechat}</p>
                </div>
              </div>
            </div>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-[2px] border border-line bg-porcelain p-5 transition-colors hover:border-champagne"
            >
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-light text-amber">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-charcoal">
                  {dict.footer.visitUs}
                </p>
                <p className="text-sm leading-relaxed text-mid">
                  {site.address.full}
                </p>
              </div>
            </a>
          </div>

          <div className="mt-6 grid grid-cols-[1fr_1.6fr] gap-4">
            <div className="arch-frame-tight relative overflow-hidden border border-line">
              <Image
                src="/renders/marble-sign.jpg"
                alt="Mérvéilléux Premium marble entry"
                fill
                sizes="200px"
                className="ken-burns object-cover"
              />
            </div>
            <div className="h-56 overflow-hidden rounded-[2px] border border-line">
              <MapEmbed title={site.name} />
            </div>
          </div>

          <div className="mt-6 rounded-[2px] border border-gold/30 bg-gold-light/40 p-5">
            <p className="text-sm text-charcoal">{d.newDistributorNote}</p>
          </div>
        </div>

        <div className="rounded-[2px] border border-line bg-porcelain/70 p-7 sm:p-9">
          <h2 className="font-serif text-2xl text-charcoal">{d.sendEnquiry}</h2>
          <p className="mt-1 mb-6 text-sm text-mid">{d.sendEnquirySub}</p>
          <EnquiryForm locale={locale} dict={d} />
        </div>
      </Container>
    </section>
  );
}
