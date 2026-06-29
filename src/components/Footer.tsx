import Link from "next/link";
import Image from "next/image";
import { navLinks, site, whatsappLink } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="mt-24 bg-charcoal text-cream/70">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/graphics/monogram.svg"
                alt=""
                width={36}
                height={36}
                className="brightness-0 invert-[0.85] sepia saturate-150 hue-rotate-[5deg]"
              />
              <span className="font-serif text-2xl text-cream">
                Merveilleux{" "}
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                  Beauty
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/60">
              {site.description}
            </p>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-cream/70 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Connect</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-cream/70 transition-colors hover:text-gold"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Hi Merveilleux Beauty, I'd like to know more.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 transition-colors hover:text-gold"
                >
                  WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 transition-colors hover:text-gold"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name} · OEM French Beauty Products
          </p>
          <p>
            Crafted with care · <span className="text-gold">Merveilleux</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
