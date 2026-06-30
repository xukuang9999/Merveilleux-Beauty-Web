"use client";

import { useState } from "react";
import { site, whatsappLink } from "@/lib/data";
import { submitEnquiry } from "@/lib/enquiry-actions";
import type { Dictionary } from "@/i18n/dictionaries/en";

const field =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-mid/60 focus:border-rose-deep";
const labelCls =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-mid";

export default function EnquiryForm({ dict }: { dict: Dictionary["contact"] }) {
  // value stays canonical (English, matches server allowlist); label localized
  const interests = [
    { value: "Become a Distributor", label: dict.interests.distributor },
    { value: "Product enquiry", label: dict.interests.product },
    { value: "Wholesale / B2B", label: dict.interests.wholesale },
    { value: "Other", label: dict.interests.other },
  ];
  const [interest, setInterest] = useState(interests[0].value);
  const [sent, setSent] = useState(false);

  function compose(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = (data.get("name") as string) || "";
    const email = (data.get("email") as string) || "";
    const phone = (data.get("phone") as string) || "";
    const message = (data.get("message") as string) || "";
    return (
      `Hi Merveilleux Beauty! 👋\n\n` +
      `*Interest:* ${interest}\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Phone:* ${phone}\n\n` +
      `*Message:*\n${message}`
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    void submitEnquiry({
      name: (data.get("name") as string) || "",
      email: (data.get("email") as string) || "",
      phone: (data.get("phone") as string) || "",
      interest,
      message: (data.get("message") as string) || "",
    });
    window.open(whatsappLink(compose(form)), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-green/30 bg-green-light/60 p-8 text-center">
        <span className="text-3xl">✓</span>
        <h3 className="mt-3 font-serif text-2xl text-charcoal">
          {dict.sentTitle}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-mid">
          {dict.sentBody}{" "}
          <a className="text-rose-deep underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-5 text-sm font-medium text-rose-deep underline"
        >
          {dict.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelCls}>{dict.interestedIn}</label>
        <div className="flex flex-wrap gap-2">
          {interests.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setInterest(opt.value)}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                interest === opt.value
                  ? "border-rose-deep bg-rose-light/60 text-rose-deep"
                  : "border-line bg-white text-mid hover:border-rose-light"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            {dict.fullName}
          </label>
          <input id="name" name="name" required placeholder={dict.yourName} className={field} />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>
            {dict.phone}
          </label>
          <input id="phone" name="phone" placeholder="+60 12-345 6789" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>
          {dict.email2}
        </label>
        <input id="email" name="email" type="email" required placeholder="you@email.com" className={field} />
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          {dict.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder={dict.messagePlaceholder}
          className={field}
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-medium text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-plum sm:w-auto"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.25.69-1.45 1.32-1.99 1.36-.53.04-.53.42-3.34-.7-2.82-1.11-4.6-3.97-4.74-4.16-.14-.19-1.13-1.5-1.13-2.86 0-1.36.71-2.03.97-2.31.25-.28.55-.35.73-.35.18 0 .37 0 .53.01.17.01.4-.06.62.48.25.6.83 2.06.9 2.21.07.14.12.31.02.5-.09.18-.14.3-.28.46-.14.16-.29.36-.42.49-.14.14-.28.28-.12.55.16.28.71 1.18 1.53 1.91 1.06.95 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.18-.21.69-.8.87-1.08.18-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.32.07.12.07.65-.18 1.34Z" />
        </svg>
        {dict.sendViaWhatsApp}
      </button>
      <p className="text-xs text-mid">
        {dict.preferEmail}{" "}
        <a className="text-rose-deep underline" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </p>
    </form>
  );
}
