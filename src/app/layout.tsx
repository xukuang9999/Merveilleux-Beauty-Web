import { localizedPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/data";
import Analytics from "@/components/Analytics";
import { getAppearance, appearanceVars } from "@/lib/settings";
import { getDict, getLocale } from "@/i18n/server";
import { localeHtmlLang } from "@/i18n/config";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [home, dict] = await Promise.all([localizedPageMetadata("home"), getDict()]);
  return {
    ...home,
    metadataBase: new URL("https://merveilleuxbeauty.com"),
    title: { default: `${site.name} — ${dict.home.heroEyebrow}`, template: `%s · ${site.name}` },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, appearance] = await Promise.all([
    getLocale(),
    getAppearance(),
  ]);
  // Master-admin brand overrides as inline custom properties — these win over
  // the compiled @theme :root defaults; empty when appearance is untouched.
  const themeVars = appearanceVars(appearance);
  return (
    <html
      lang={localeHtmlLang[locale]}
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
      style={themeVars}
    >
      <body className="flex min-h-full flex-col bg-cream">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
