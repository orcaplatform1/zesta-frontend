"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Category } from "@/lib/types";

const LINKS = [
  { href: "/magaza", label: "Ürünler" },
  { href: "/hesap", label: "Hesabım" },
  { href: "/sepet", label: "Sepet" },
];

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
          <div className="fixed inset-0 z-50 flex flex-col bg-onyx-900">
            <div className="mx-auto w-full max-w-[1440px] h-16 flex items-center justify-end px-5 flex-shrink-0">
              <button
                onClick={() => setOpen(false)}
                aria-label="Menüyü kapat"
                className="p-2 -mr-2 text-ink text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto py-10">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-[32px] text-ink hover:text-champagne-300 transition-colors duration-[180ms]"
                >
                  {link.label}
                </Link>
              ))}

              {categories.length > 0 && (
                <div className="mt-4 flex flex-col items-center gap-4 border-t border-[var(--border-subtle)] pt-8">
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
          </div>,
          document.body,
        )}
    </div>
  );
}
