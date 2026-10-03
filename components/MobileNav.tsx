"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Category } from "@/lib/types";

function ChevronDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function AccordionItem({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-1"
        style={{ color: "var(--text-on-dark)" }}
      >
        <span className="font-display text-[22px] tracking-[-0.01em]">{label}</span>
        <span
          className="transition-transform duration-200 opacity-50"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown />
        </span>
      </button>

      {open && (
        <div className="mt-3 ml-1 flex flex-col gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

function GhostBtn({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex h-9 items-center justify-center rounded-full px-5 text-[11px] font-semibold transition-all duration-[180ms] hover:-translate-y-[1px]"
      style={{
        background: "rgba(255,255,255,0.95)",
        color: "var(--zesta-primary-dark)",
        letterSpacing: "0.07em",
        boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
      }}
    >
      {label}
    </Link>
  );
}

function AccentBtn({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex h-9 items-center justify-center rounded-full px-5 text-[11px] font-semibold text-white transition-all duration-[180ms] hover:-translate-y-[1px]"
      style={{
        background: "var(--zesta-accent)",
        letterSpacing: "0.07em",
        boxShadow: "0 1px 8px rgba(196,134,90,0.35)",
      }}
    >
      {label}
    </Link>
  );
}

export function MobileNav({ categories = [] }: { categories?: Category[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} aria-label="Menüyü aç" className="flex flex-col gap-[5px] p-2 -mr-2">
        <span className="block h-[1.5px] w-[18px] rounded-full bg-[var(--zesta-primary)]" />
        <span className="block h-[1.5px] w-[14px] rounded-full bg-[var(--zesta-primary)] opacity-60" />
      </button>

      {mounted && open && createPortal(
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* backdrop */}
          <button onClick={close} aria-label="Kapat" className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

          {/* panel */}
          <div
            className="relative flex w-[260px] flex-col"
            style={{
              background: "linear-gradient(160deg, #1D4B4B 0%, #173C3C 100%)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.3)",
            }}
          >
            {/* header */}
            <div className="flex h-14 items-center justify-between px-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="font-display text-[13px] tracking-[0.12em] uppercase opacity-40" style={{ color: "var(--text-on-dark)" }}>
                Menü
              </span>
              <button onClick={close} aria-label="Kapat" className="flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-[180ms]" style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-on-dark)" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
              {/* Hesabım */}
              <AccordionItem label="Hesabım">
                <GhostBtn href="/hesap" label="GİRİŞ YAP" onClick={close} />
                <AccentBtn href="/hesap?islem=kayit" label="KAYIT OL" onClick={close} />
              </AccordionItem>

              <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

              {/* Tasarımcı Ol */}
              <AccordionItem label="Tasarımcı Ol">
                <GhostBtn href="/tasarimci-giris" label="PANELE GİRİŞ" onClick={close} />
                <AccentBtn href="/tasarimci-basvuru" label="BAŞVURU YAP" onClick={close} />
              </AccordionItem>

              <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

              {/* Ürünler */}
              <AccordionItem label="Ürünler">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/kategori/${c.slug}`}
                    onClick={close}
                    className="text-[13px] font-medium transition-colors duration-[180ms]"
                    style={{ color: "rgba(244,241,233,0.75)" }}
                  >
                    {c.name}
                  </Link>
                ))}
                <Link href="/magaza" onClick={close} className="text-[12px] font-semibold mt-1 transition-colors duration-[180ms]" style={{ color: "var(--zesta-accent)", letterSpacing: "0.06em" }}>
                  Tüm Ürünler →
                </Link>
              </AccordionItem>

              <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

              {/* Alt linkler */}
              <div className="flex flex-col gap-4 pt-1">
                <Link href="/kurumsal-cozumler" onClick={close} className="font-display text-[22px] tracking-[-0.01em] transition-opacity duration-[180ms] hover:opacity-70" style={{ color: "var(--text-on-dark)" }}>
                  Kurumsal Çözümler
                </Link>
                <Link href="/ekitap" onClick={close} className="font-display text-[22px] tracking-[-0.01em] transition-opacity duration-[180ms] hover:opacity-70" style={{ color: "var(--text-on-dark)" }}>
                  E-Kitap
                </Link>
                <Link href="/hikayemiz" onClick={close} className="font-display text-[22px] tracking-[-0.01em] transition-opacity duration-[180ms] hover:opacity-70" style={{ color: "var(--text-on-dark)" }}>
                  Hikayemiz
                </Link>
                <Link href="/iletisim" onClick={close} className="font-display text-[22px] tracking-[-0.01em] transition-opacity duration-[180ms] hover:opacity-70" style={{ color: "var(--text-on-dark)" }}>
                  İletişim
                </Link>
              </div>
            </nav>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
