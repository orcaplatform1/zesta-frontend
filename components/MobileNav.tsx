"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Category } from "@/lib/types";

function AccordionItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between font-display text-[24px] transition-colors duration-[200ms]"
        style={{ color: "var(--text-on-dark)" }}
      >
        {label}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 transition-transform duration-[200ms]"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.6 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="mt-4 flex flex-col gap-2.5 pl-2">
          {children}
        </div>
      )}
    </div>
  );
}

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
          <div className="fixed inset-0 z-50 flex">
            <div className="flex w-[72%] min-w-[260px] flex-col shadow-[var(--shadow-xl)]" style={{ background: "var(--zesta-primary-mid)" }}>
              <div className="w-full h-16 flex items-center justify-start px-5 flex-shrink-0">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Menüyü kapat"
                  className="p-2 -ml-2 text-ink text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <nav className="flex flex-1 flex-col items-start gap-6 overflow-y-auto px-8 py-8">
                {/* Hesabım */}
                <AccordionItem label="Hesabım">
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
                </AccordionItem>

                {/* Tasarımcı Ol */}
                <AccordionItem label="Tasarımcı Ol">
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
                </AccordionItem>

                {/* Ürünler */}
                <AccordionItem label="Ürünler">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/kategori/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-[14px] text-smoke hover:text-ink transition-colors duration-[180ms]"
                    >
                      {c.name}
                    </Link>
                  ))}
                  {categories.length === 0 && (
                    <Link
                      href="/magaza"
                      onClick={() => setOpen(false)}
                      className="text-[14px] text-smoke hover:text-ink transition-colors duration-[180ms]"
                    >
                      Tüm Ürünler
                    </Link>
                  )}
                </AccordionItem>

                {/* Alt sayfalar */}
                <div className="mt-2 flex flex-col items-start gap-5 border-t border-[var(--border-subtle)] pt-7 w-full">
                  <Link
                    href="/hikayemiz"
                    onClick={() => setOpen(false)}
                    className="font-display text-[24px] transition-colors duration-[200ms]"
                    style={{ color: "var(--text-on-dark)" }}
                  >
                    Hikayemiz
                  </Link>
                  <Link
                    href="/iletisim"
                    onClick={() => setOpen(false)}
                    className="font-display text-[24px] transition-colors duration-[200ms]"
                    style={{ color: "var(--text-on-dark)" }}
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
