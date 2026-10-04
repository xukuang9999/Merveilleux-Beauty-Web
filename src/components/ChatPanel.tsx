"use client";

import { uiCopy } from "@/i18n/ui-copy";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };
type Mode = "customer" | "consult" | "training";

export default function ChatPanel({
  mode,
  locale,
  greeting,
  suggestions = [],
  heightClass = "h-[440px]",
  placeholder = "Type your message…",
}: {
  mode: Mode;
  locale: string;
  greeting: string;
  suggestions?: string[];
  heightClass?: string;
  placeholder?: string;
}) {
  const copy = uiCopy(locale);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      const history = next.filter((message) => message.content.trim()).slice(-12);
      const encoder = new TextEncoder();
      while (history.length > 1 && encoder.encode(JSON.stringify({ mode, messages: history })).length > 60 * 1024) history.shift();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, messages: history }),
      });
      if (!res.ok || !res.body) {
        const t = (await res.text()) || copy.chatFailed;
        setMessages((m) => replaceLast(m, t));
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((m) => replaceLast(m, acc));
      }
      acc += dec.decode();
      setMessages((m) => replaceLast(m, acc || copy.chatFailed));
    } catch {
      setMessages((m) =>
        replaceLast(m, copy.connectionFailed),
      );
    } finally {
      setLoading(false);
    }
  }

  const showSuggestions = messages.length === 1 && suggestions.length > 0;
  const lastAssistantEmpty =
    loading &&
    messages[messages.length - 1]?.role === "assistant" &&
    messages[messages.length - 1]?.content === "";

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-busy={loading}
        className={`flex-none space-y-3 overflow-y-auto p-4 ${heightClass}`}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-bronze text-white"
                  : "bg-cream text-charcoal"
              }`}
            >
              {m.content ||
                (lastAssistantEmpty && i === messages.length - 1 ? (
                  <TypingDots />
                ) : (
                  ""
                ))}
            </div>
          </div>
        ))}
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 pt-1">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-left text-xs text-mid transition-colors hover:border-bronze hover:text-bronze"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-line p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          maxLength={4000}
          className="min-w-0 flex-1 rounded-full border border-line bg-cream px-4 py-2.5 text-sm text-charcoal outline-none focus:border-bronze"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label={copy.send}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-cream transition-colors hover:bg-umber disabled:opacity-40"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}

function replaceLast(messages: Msg[], content: string): Msg[] {
  const copy = [...messages];
  copy[copy.length - 1] = { role: "assistant", content };
  return copy;
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bronze [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bronze [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bronze" />
    </span>
  );
}
