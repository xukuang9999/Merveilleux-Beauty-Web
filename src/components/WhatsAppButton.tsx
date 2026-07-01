import { whatsappLink } from "@/lib/data";

// Floating WhatsApp button. Sits bottom-left so it never collides with the
// Margaux AI chat FAB (bottom-right).
export default function WhatsAppButton({ label }: { label: string }) {
  return (
    <a
      href={whatsappLink("Hi Merveilleux Beauty, I'd like to know more.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-5 left-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-transform duration-200 hover:scale-105 sm:h-14 sm:w-14"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.25.69-1.45 1.32-1.99 1.36-.53.04-.53.42-3.34-.7-2.82-1.11-4.6-3.97-4.74-4.16-.14-.19-1.13-1.5-1.13-2.86 0-1.36.71-2.03.97-2.31.25-.28.55-.35.73-.35.18 0 .37 0 .53.01.17.01.4-.06.62.48.25.6.83 2.06.9 2.21.07.14.12.31.02.5-.09.18-.14.3-.28.46-.14.16-.29.36-.42.49-.14.14-.28.28-.12.55.16.28.71 1.18 1.53 1.91 1.06.95 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.18-.21.69-.8.87-1.08.18-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.32.07.12.07.65-.18 1.34Z" />
      </svg>
    </a>
  );
}
