"use client";

import { uiCopy } from "@/i18n/ui-copy";
import { useState } from "react";
import { subscribeNewsletter } from "@/lib/newsletter-actions";
import type { Dictionary } from "@/i18n/dictionaries/en";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function NewsletterSignup({
  dict,
  locale,
}: {
  dict: Dictionary["footer"];
  locale: string;
}) {
  const copy = uiCopy(locale);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "pending" | "done" | "error" | "failed">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setState("error");
      return;
    }
    if (state === "pending") return;
    setState("pending");
    try {
      const result = await subscribeNewsletter({ email: email.trim(), locale });
      setState(result.ok ? "done" : "failed");
    } catch {
      setState("failed");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
        {dict.subscribed}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={state === "pending"}>
      <div className="flex overflow-hidden rounded-full border border-cream/20 bg-cream/5 focus-within:border-gold/60">
        <input
          type="email"
          disabled={state === "pending"}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error" || state === "failed") setState("idle");
          }}
          placeholder={dict.newsletterPlaceholder}
          aria-label={dict.newsletterPlaceholder}
          className="w-full bg-transparent px-4 py-2.5 text-sm text-cream outline-none placeholder:text-cream/40"
        />
        <button
          type="submit"
          disabled={state === "pending"}
          className="shrink-0 bg-gold px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:brightness-105"
        >
          {state === "pending" ? copy.saving : dict.subscribe}
        </button>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-2 text-xs text-champagne">{dict.subscribeError}</p>
      )}
      {state === "failed" && <p role="alert" className="mt-2 text-xs text-champagne">{copy.saveFailed}</p>}
    </form>
  );
}
