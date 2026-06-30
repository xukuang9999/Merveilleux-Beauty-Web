import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <Image
        src="/graphics/pattern.svg"
        alt=""
        width={400}
        height={400}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 w-[600px] -translate-x-1/2 opacity-30"
      />
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <Image src="/graphics/monogram.svg" alt="" width={40} height={40} />
        <span className="font-serif text-2xl tracking-wide text-charcoal">
          Merveilleux
          <span className="ml-1.5 align-middle text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
            Beauty
          </span>
        </span>
      </Link>
      <div className="w-full max-w-md rounded-3xl border border-line bg-white/80 p-8 shadow-[0_24px_60px_-30px_rgba(74,48,64,0.4)] backdrop-blur">
        {children}
      </div>
      <Link href="/" className="mt-6 text-sm text-mid hover:text-charcoal">
        ← Back to site
      </Link>
    </div>
  );
}
