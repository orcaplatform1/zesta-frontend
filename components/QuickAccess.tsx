import Link from "next/link";
import type { ReactNode } from "react";

// Çift tonlu (duotone) ikonlar: ana katman beyaz/krem, ikincil katman altın tonu.
const MAIN = "var(--text-on-dark)";
const GOLD = "var(--accent-300)";

function SaleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 12.2V4.5A1.5 1.5 0 0 1 4.5 3h7.7a1.5 1.5 0 0 1 1.06.44l7.3 7.3a1.5 1.5 0 0 1 0 2.12l-7.7 7.7a1.5 1.5 0 0 1-2.12 0l-7.3-7.3A1.5 1.5 0 0 1 3 12.2z" fill={GOLD} opacity="0.45" />
      <path d="M3 12.2V4.5A1.5 1.5 0 0 1 4.5 3h7.7a1.5 1.5 0 0 1 1.06.44l7.3 7.3a1.5 1.5 0 0 1 0 2.12l-7.7 7.7a1.5 1.5 0 0 1-2.12 0l-7.3-7.3A1.5 1.5 0 0 1 3 12.2z" fill="none" stroke={MAIN} strokeWidth="1.5" />
      <circle cx="7.5" cy="7.5" r="1.4" fill={MAIN} />
      <path d="M9.5 15.5l5-5" stroke={MAIN} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="11" r="1.1" fill={MAIN} />
      <circle cx="14" cy="15" r="1.1" fill={MAIN} />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <path d="M10 2.5l1.9 5.6 5.6 1.9-5.6 1.9L10 17.5l-1.9-5.6L2.5 10l5.6-1.9z" fill={MAIN} />
      <path d="M18 13l.95 2.55L21.5 16.5l-2.55.95L18 20l-.95-2.55L14.5 16.5l2.55-.95z" fill={GOLD} />
      <path d="M18.5 2.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill={GOLD} />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-1.8 10H4.8z" fill={GOLD} opacity="0.55" />
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-1.8 10H4.8z" fill="none" stroke={MAIN} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="4.8" y="18.5" width="14.4" height="2" rx="1" fill={MAIN} />
      <circle cx="12" cy="4.5" r="1.3" fill={MAIN} />
    </svg>
  );
}

function OpenBookIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5z" fill={GOLD} opacity="0.5" />
      <path d="M12 6.5C14 5 17 4.5 21 5v13c-4-.5-7 0-9 1.5z" fill={MAIN} opacity="0.92" />
      <path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5" fill="none" stroke={MAIN} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 6.5v13" stroke={MAIN} strokeWidth="1.4" />
    </svg>
  );
}

function BrushIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.5 3.5c-1-1-6 3-9.5 7.5l2.5 2.5c4.5-3.5 8-9 7-10z" fill={MAIN} />
      <path d="M10.2 12c-2 0-3.7 1.6-3.7 3.6 0 1.6-1 2.6-2.5 2.9 1 1.3 2.7 2 4.3 2 2.5 0 4.5-2 4.5-4.5 0-.6-.1-1.1-.3-1.6z" fill={GOLD} />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" fill={MAIN} />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" fill={GOLD} />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" fill={GOLD} />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" fill={MAIN} />
    </svg>
  );
}

// Sayfası olmayan kısayollar /magaza'ya gider.
const ITEMS: { label: string; href: string; icon: ReactNode }[] = [
  { label: "İndirimdekiler", href: "/magaza", icon: <SaleIcon /> },
  { label: "Yeni Gelenler", href: "/magaza", icon: <SparkleIcon /> },
  { label: "Çok Satanlar", href: "/magaza", icon: <CrownIcon /> },
  { label: "E-Kitap", href: "/ekitap", icon: <OpenBookIcon /> },
  { label: "Tasarımcı Ol", href: "/tasarimci-basvuru", icon: <BrushIcon /> },
  { label: "Tüm Kategoriler", href: "/magaza", icon: <GridIcon /> },
];

export function QuickAccess() {
  return (
    <section className="py-3">
      <div className="mx-auto max-w-[1200px] px-4 lg:px-5">
        <div className="carousel-scroll -mx-4 flex gap-3 overflow-x-auto px-4 py-1 md:mx-0 md:justify-center md:px-0">
          {ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex w-[72px] flex-none flex-col items-center gap-1.5 md:w-[88px]"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-[200ms] group-hover:scale-105 md:h-16 md:w-16"
                style={{
                  background: "linear-gradient(145deg, var(--primary-500) 0%, var(--zesta-primary) 55%, var(--accent-700) 135%)",
                  border: "1px solid var(--border-light)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                {item.icon}
              </span>
              <span className="line-clamp-2 text-center text-[12px] font-medium leading-tight" style={{ color: "var(--text-primary)" }}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
