"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

const BANKS = ["Bonus", "Axess", "Paraf", "Maximum", "World", "Finansbank", "Bankkart"];

function CardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--champagne-300)" strokeWidth="1.4">
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 9.5h19" />
    </svg>
  );
}

export function InstallmentOptionsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border-default)] px-4 text-[11px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink hover:border-[var(--border-hover)]"
        style={{ letterSpacing: "0.06em" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
          <path d="M2.5 9.5h19" />
        </svg>
        TAKSİT SEÇENEKLERİ
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <button onClick={() => setOpen(false)} aria-label="Kapat" className="absolute inset-0 bg-black/40" />
            <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-sm bg-[var(--ivory-50)] p-6 md:p-8 shadow-[var(--shadow-xl)]">
              <button
                onClick={() => setOpen(false)}
                aria-label="Kapat"
                className="absolute right-4 top-4 text-2xl leading-none text-dim hover:text-ink"
              >
                ×
              </button>
              <p className="eyebrow-on-light">Zesta</p>
              <h2 className="mt-2 font-display text-[24px] font-normal text-ink" style={{ lineHeight: 1.1 }}>
                Taksit Seçenekleri
              </h2>

              <div className="mt-6 space-y-2">
                {BANKS.map((bank) => (
                  <div
                    key={bank}
                    className="flex items-center gap-3 rounded-xs border border-[var(--border-subtle)] px-4 py-3"
                  >
                    <CardIcon />
                    <div>
                      <p className="text-[14px] font-medium text-ink">{bank}</p>
                      <p className="text-[12px] text-ash">Vade farksız 3 taksite kadar</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
