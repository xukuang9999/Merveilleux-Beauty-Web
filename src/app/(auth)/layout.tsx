import Link from "next/link";
import Image from "next/image";
import { getDict } from "@/i18n/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDict();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12">
      {/* flagship corridor render as a soft backdrop */}
      <Image
        src="/renders/corridor.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-cream/88" />
      <Link href="/" className="mb-8 flex items-center gap-3">
        <Image src="/graphics/monogram.svg" alt="" width={40} height={40} />
        <span className="flex flex-col leading-none">
          <span className="wordmark text-lg text-charcoal">Mérvéilléux</span>
          <span className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.5em] text-gold">
            Premium
          </span>
        </span>
      </Link>
      <div className="w-full max-w-md rounded-[2px] border border-line bg-porcelain/85 p-8 shadow-[0_24px_60px_-30px_rgba(69,61,49,0.4)] backdrop-blur">
        {children}
      </div>
      <Link href="/" className="mt-6 text-sm text-mid hover:text-charcoal">
        {dict.auth.backToSite}
      </Link>
    </div>
  );
}
