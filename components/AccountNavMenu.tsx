"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { UserIcon } from "@/components/HeaderIcons";

export function AccountNavMenu() {
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
        className="header-action"
        aria-expanded={open}
        aria-label="Hesabım"
      >
        <UserIcon size={20} />
        <span className="header-action-label">Hesabım</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-48 p-4 md:left-1/2 md:right-auto md:-translate-x-1/2"
          style={{
            background: "var(--zesta-surface)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div className="flex flex-col items-center gap-2.5">
            <Link
              href="/hesap"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-default)] px-4 text-[11px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink hover:border-[var(--border-hover)]"
              style={{ letterSpacing: "0.02em" }}
            >
              Giriş Yap
            </Link>
            <Link
              href="/hesap?islem=kayit"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 items-center justify-center px-4 text-[11px] font-semibold text-white transition-all duration-[200ms] hover:-translate-y-[1px]"
              style={{ background: "var(--zesta-accent)", borderRadius: "var(--radius-md)", letterSpacing: "0.02em" }}
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
