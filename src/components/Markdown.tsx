import { Fragment, type ReactNode } from "react";

// Minimal markdown renderer for our KB bodies (headings, bold, lists).
function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-charcoal">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{p}</Fragment>;
  });
}

export default function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;

  const flush = () => {
    if (!list) return;
    const items = list.items;
    if (list.type === "ul") {
      blocks.push(
        <ul key={blocks.length} className="my-3 space-y-1.5 pl-1">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2 text-sm text-mid">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-bronze" />
              <span>{inline(it)}</span>
            </li>
          ))}
        </ul>,
      );
    } else {
      blocks.push(
        <ol key={blocks.length} className="my-3 space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-mid">
              <span className="font-serif text-bronze">{i + 1}.</span>
              <span>{inline(it)}</span>
            </li>
          ))}
        </ol>,
      );
    }
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      blocks.push(
        <h3
          key={blocks.length}
          className="mt-5 font-serif text-xl text-charcoal"
        >
          {inline(line.slice(4))}
        </h3>,
      );
    } else if (line.startsWith("- ")) {
      if (!list || list.type !== "ul") {
        flush();
        list = { type: "ul", items: [] };
      }
      list.items.push(line.slice(2));
    } else if (/^\d+\.\s/.test(line)) {
      if (!list || list.type !== "ol") {
        flush();
        list = { type: "ol", items: [] };
      }
      list.items.push(line.replace(/^\d+\.\s/, ""));
    } else {
      flush();
      blocks.push(
        <p key={blocks.length} className="my-2 text-sm leading-relaxed text-mid">
          {inline(line)}
        </p>,
      );
    }
  }
  flush();

  return <div>{blocks}</div>;
}
