"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Category } from "@/lib/types";

const LINKS = [{ href: "/magaza", label: "Ürünler" }];
const AFTER_ACCOUNT_LINKS = [{ href: "/sepet", label: "Sepet" }];

export function MobileNav({ categories = [] }: { categories?: Category[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Menüyü aç"
        className="flex flex-col gap-[5px] p-2 -mr-2"
      >
        <span className="block h-[1.25px] w-5 bg-[var(--text-secondary)]" />
        <span className="block h-[1.25px] w-5 bg-[var(--text-secondary)]" />
      </button>

      {mounted &&
        open &&
        createPortal(
          // document.body'ye portal ile taşınıyor — header'daki backdrop-blur
          // (backdrop-filter) aksi halde bu fixed elemanın containing block'unu
          // header'ın kendisine (64px) indirger, tam ekran kaplamasını bozar.
          // Panel ekranın sadece sağ yarısını kaplar (tam ekran değil); sol
          // yarıda kalan boşluk arka planı karartıp tıklanınca menüyü kapatır.
          <div className="fixed inset-0 z-50 flex">
            <button
              onClick={() => setOpen(false)}
              aria-label="Menüyü kapat"
              className="flex-1 bg-black/30"
            />
            <div className="flex w-1/2 min-w-[240px] flex-col bg-onyx-900 shadow-[var(--shadow-xl)]">
              <div className="w-full h-16 flex items-center justify-end px-5 flex-shrink-0">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Menüyü kapat"
                  className="p-2 -mr-2 text-ink text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <nav className="flex flex-1 flex-col items-start justify-start gap-6 overflow-y-auto px-8 py-10">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-[24px] text-ink hover:text-champagne-300 transition-colors duration-[180ms]"
                  >
                    {link.label}
                  </Link>
                ))}
                <span className="-mb-2 font-display text-[24px] text-ink">Hesabım</span>
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/hesap"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--border-default)] px-5 text-[11px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink hover:border-[var(--border-hover)]"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    GİRİŞ YAP
                  </Link>
                  <Link
                    href="/hesap?islem=kayit"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-charcoal-700 px-5 text-[11px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    KAYIT OL
                  </Link>
                </div>
                {AFTER_ACCOUNT_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-[24px] text-ink hover:text-champagne-300 transition-colors duration-[180ms]"
                  >
                    {link.label}
                  </Link>
                ))}
                <span className="-mb-2 font-display text-[24px] text-ink">Tasarımcı Ol</span>
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/tasarimci-basvuru"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-charcoal-700 px-5 text-[11px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    TASARIMCI BAŞVURU
                  </Link>
                  <Link
                    href="/tasarimci-giris"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--border-default)] px-5 text-[11px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink hover:border-[var(--border-hover)]"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    TASARIMCI GİRİŞİ
                  </Link>
                </div>

                {categories.length > 0 && (
                  <div className="mt-4 flex flex-col items-start gap-4 border-t border-[var(--border-subtle)] pt-8">
                    <span className="label-uppercase">Kategoriler</span>
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/kategori/${c.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-[15px] text-smoke hover:text-ink transition-colors duration-[180ms]"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
