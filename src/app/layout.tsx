import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/data";
import Analytics from "@/components/Analytics";
import { getLocale } from "@/i18n/server";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://merveilleuxbeauty.com"),
  title: {
    default: "Mérvéilléux Premium — The Art of French Beauty",
    template: "%s · Mérvéilléux Premium",
  },
  description: site.description,
  keywords: [
    "Merveilleux Premium",
    "Bellesenze",
    "French beauty",
    "premium skincare Malaysia",
    "distributor",
    "serum",
    "moisturiser",
  ],
  openGraph: {
    title: "Mérvéilléux Premium — The Art of French Beauty",
    description: site.description,
    type: "website",
    locale: "en_MY",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mérvéilléux Premium",
    description: site.description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={localeHtmlLang[locale]}
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
