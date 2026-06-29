import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/data";

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
    default: "Merveilleux Beauty — OEM French Beauty Products",
    template: "%s · Merveilleux Beauty",
  },
  description: site.description,
  keywords: [
    "Merveilleux Beauty",
    "OEM French beauty",
    "skincare Malaysia",
    "经销商",
    "serum",
    "moisturiser",
  ],
  openGraph: {
    title: "Merveilleux Beauty — OEM French Beauty Products",
    description: site.description,
    type: "website",
    locale: "en_MY",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Merveilleux Beauty",
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
