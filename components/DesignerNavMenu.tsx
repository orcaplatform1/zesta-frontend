"use client";

import { useRef, useState } from "react";
import Link from "next/link";

export function DesignerNavMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function hide() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-smoke hover:text-ink transition-colors duration-[180ms]"
        aria-expanded={open}
      >
        TASARIMCI OL
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-48 -translate-x-1/2 rounded-xs border border-[var(--border-subtle)] bg-[var(--ivory-50)] p-4 shadow-[var(--shadow-lg)]">
          <div className="flex flex-col gap-2.5">
            <Link
              href="/tasarimci-basvuru"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-full bg-charcoal-700 px-4 text-[11px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
              style={{ letterSpacing: "0.08em" }}
            >
              TASARIMCI BAŞVURU
            </Link>
            <Link
              href="/tasarimci-giris"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-default)] px-4 text-[11px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink hover:border-[var(--border-hover)]"
              style={{ letterSpacing: "0.08em" }}
            >
              TASARIMCI GİRİŞİ
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
