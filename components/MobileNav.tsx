"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Category } from "@/lib/types";


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
            <div className="flex w-1/2 min-w-[240px] flex-col shadow-[var(--shadow-xl)]" style={{ background: "var(--zesta-primary-mid)" }}>
              <div className="w-full h-16 flex items-center justify-start px-5 flex-shrink-0">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Menüyü kapat"
                  className="p-2 -ml-2 text-ink text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <nav className="flex flex-1 flex-col items-start justify-start gap-6 overflow-y-auto px-8 py-10">
                {/* Hesabım */}
                <span className="-mb-2 font-display text-[24px]" style={{ color: "var(--text-on-dark)" }}>Hesabım</span>
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/hesap"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--border-default)] px-5 text-[11px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink hover:border-[var(--border-hover)]"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/hesap?islem=kayit"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 items-center justify-center px-5 text-[11px] font-semibold text-white transition-all duration-[200ms]"
                    style={{ background: "var(--zesta-accent)", borderRadius: "var(--radius-md)", letterSpacing: "0.02em" }}
                  >
                    Kayıt Ol
                  </Link>
                </div>

                {/* Tasarımcı Ol */}
                <span className="-mb-2 font-display text-[24px]" style={{ color: "var(--text-on-dark)" }}>Tasarımcı Ol</span>
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/tasarimci-giris"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--border-default)] px-5 text-[11px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink hover:border-[var(--border-hover)]"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    Panele Giriş
                  </Link>
                  <Link
                    href="/tasarimci-basvuru"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 items-center justify-center px-5 text-[11px] font-semibold text-white transition-all duration-[200ms]"
                    style={{ background: "var(--zesta-accent)", borderRadius: "var(--radius-md)", letterSpacing: "0.02em" }}
                  >
                    Başvuru Yap
                  </Link>
                </div>

                {/* Ürünler + Sepet */}
                <Link
                  href="/magaza"
                  onClick={() => setOpen(false)}
                  className="font-display text-[24px] transition-colors duration-[200ms]"
                  style={{ color: "var(--text-on-dark)" }}
                >
                  Ürünler
                </Link>
                <Link
                  href="/sepet"
                  onClick={() => setOpen(false)}
                  className="font-display text-[24px] transition-colors duration-[200ms]"
                  style={{ color: "var(--text-on-dark)" }}
                >
                  Sepet
                </Link>

                {/* Kategoriler */}
                {categories.length > 0 && (
                  <div className="mt-2 flex flex-col items-start gap-4 border-t border-[var(--border-subtle)] pt-8 w-full">
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

                {/* Alt sayfalar */}
                <div className="mt-2 flex flex-col items-start gap-4 border-t border-[var(--border-subtle)] pt-8 w-full">
                  <Link
                    href="/hikayemiz"
                    onClick={() => setOpen(false)}
                    className="text-[15px] text-smoke hover:text-ink transition-colors duration-[180ms]"
                  >
                    Hikayemiz
                  </Link>
                  <Link
                    href="/iletisim"
                    onClick={() => setOpen(false)}
                    className="text-[15px] text-smoke hover:text-ink transition-colors duration-[180ms]"
                  >
                    İletişim
                  </Link>
                </div>
              </nav>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Menüyü kapat"
              className="flex-1 bg-black/30"
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
