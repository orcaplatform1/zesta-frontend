"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Category, Product, ProductListResponse } from "@/lib/types";
import { ChevronIcon, HandIcon, HeartIcon, UserIcon } from "@/components/HeaderIcons";

const PRODUCT_LIMIT = 8;

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const ChatIcon = () => (
  <Icon>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Icon>
);
const HelpIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);
const BuildingIcon = () => (
  <Icon>
    <rect x="4" y="2" width="16" height="20" rx="1" />
    <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
  </Icon>
);
const StoryIcon = () => (
  <Icon>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
  </Icon>
);
const BookIcon = () => (
  <Icon>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
    <path d="M4 19.5V21h16" />
  </Icon>
);

// Mobil (<768px) tam ekran hamburger menü: solda kategoriler, sağda seçili
// kategorinin ürünleri (mevcut /products ucu), altta sabit bağlantılar.
export function MobileMenuPanel({ categories, onClose }: { categories: Category[]; onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(categories[0]?.slug ?? null);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, []);

  useEffect(() => {
    if (!selected || products[selected]) return;
    api
      .get<ProductListResponse>(`/products?category=${encodeURIComponent(selected)}&pageSize=${PRODUCT_LIMIT}`)
      .then((r) => setProducts((prev) => ({ ...prev, [selected]: r.items.slice(0, PRODUCT_LIMIT) })))
      .catch(() => setProducts((prev) => ({ ...prev, [selected]: [] })));
  }, [selected, products]);

  const category = categories.find((c) => c.slug === selected) ?? null;
  const items = selected ? products[selected] : undefined;

  const bottomLinks: { href: string; label: string; icon: ReactNode }[] = [
    { href: "/hesap", label: loggedIn ? "Hesabım" : "Üye Ol/Giriş Yap", icon: <UserIcon size={20} /> },
    { href: "/hesap/favorilerim", label: "Favorilerim", icon: <HeartIcon size={20} /> },
    { href: "/iletisim", label: "Bizimle İletişime Geç", icon: <ChatIcon /> },
    { href: "/sss", label: "Yardım", icon: <HelpIcon /> },
    { href: "/kurumsal-cozumler", label: "Kurumsal Çözümler", icon: <BuildingIcon /> },
    { href: "/hikayemiz", label: "Hikâyemiz", icon: <StoryIcon /> },
    { href: "/tasarimci-basvuru", label: "Tasarımcı Ol", icon: <HandIcon size={20} /> },
    { href: "/ekitap", label: "E-Kitap", icon: <BookIcon /> },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex flex-col" style={{ background: "#fff" }} role="dialog" aria-modal="true" aria-label="Menü">
      {/* Üst satır */}
      <div className="flex h-14 flex-none items-center justify-between px-4" style={{ borderBottom: "1px solid var(--zesta-border)" }}>
        <Link href="/" onClick={onClose} aria-label="Zesta ana sayfa">
          <Image src="/logo.png" alt="Zesta" width={2172} height={724} unoptimized className="h-8 w-auto object-contain" style={{ maxWidth: "130px" }} />
        </Link>
        <button type="button" onClick={onClose} aria-label="Menüyü kapat" className="-mr-2 flex h-11 w-11 items-center justify-center text-ink">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Gövde */}
      <div className="flex min-h-0 flex-1">
        <div className="w-[28%] flex-none overflow-y-auto" style={{ background: "var(--stone-50)" }}>
          {categories.map((c) => {
            const active = c.slug === selected;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.slug)}
                className="block w-full px-2.5 py-3.5 text-left text-[12px] leading-snug"
                style={{
                  background: active ? "#fff" : "transparent",
                  color: active ? "var(--zesta-primary)" : "var(--text-secondary)",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto p-3" style={{ background: "#fff" }}>
          {category && (
            <div className="grid grid-cols-3 gap-x-2.5 gap-y-4">
              {items === undefined && <p className="col-span-3 text-[12px] text-ash">Yükleniyor...</p>}
              {(items ?? []).map((p) => (
                <Link key={p.id} href={`/urun/${p.slug}`} onClick={onClose} className="flex flex-col items-center gap-1.5">
                  <span
                    className="block aspect-square w-full overflow-hidden"
                    style={{ border: "1px solid var(--zesta-border)", borderRadius: "var(--radius-sm)", background: "var(--stone-100)" }}
                  >
                    {p.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0].url} alt="" loading="lazy" className="h-full w-full object-cover" />
                    )}
                  </span>
                  <span className="line-clamp-2 text-center text-[11px] leading-tight text-ink">{p.name}</span>
                </Link>
              ))}
              {items !== undefined && (
                <Link href={`/kategori/${category.slug}`} onClick={onClose} className="flex flex-col items-center gap-1.5">
                  <span
                    className="relative flex aspect-square w-full items-center justify-center"
                    style={{ border: "1px solid var(--zesta-border)", borderRadius: "var(--radius-sm)", background: "var(--primary-50)" }}
                  >
                    <span className="grid grid-cols-2 gap-1">
                      {[0, 1, 2, 3].map((n) => (
                        <span key={n} className="block h-3.5 w-3.5 rounded-[3px]" style={{ background: "var(--primary-200)" }} />
                      ))}
                    </span>
                    <span className="absolute bottom-1.5 right-1.5" style={{ color: "var(--zesta-primary-light)" }}>
                      <ChevronIcon size={14} />
                    </span>
                  </span>
                  <span className="line-clamp-2 text-center text-[11px] font-semibold leading-tight" style={{ color: "var(--zesta-primary)" }}>
                    Tüm {category.name} Ürünleri
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Alt kısım */}
      <div className="flex-none overflow-y-auto" style={{ borderTop: "1px solid var(--zesta-border)", maxHeight: "45vh" }}>
        {bottomLinks.map((l, i) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={onClose}
            className="flex h-12 items-center gap-3 px-4 text-[14px] text-ink"
            style={{ borderTop: i === 0 ? "none" : "1px solid var(--zesta-border-light)" }}
          >
            <span style={{ color: "var(--zesta-primary)" }}>{l.icon}</span>
            <span className="flex-1">{l.label}</span>
            <span className="text-ash">
              <ChevronIcon size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
