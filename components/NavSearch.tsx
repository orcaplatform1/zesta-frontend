"use client";

import { useEffect, useRef, useState } from "react";

export function NavSearch({ iconClass }: { iconClass?: string } = {}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Ara"
        aria-expanded={open}
        className={iconClass ?? "nav-dark-icon inline-flex h-10 w-10 items-center justify-center rounded-full transition-opacity duration-[200ms]"}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50"
          style={{ minWidth: "320px" }}
        >
          <form
            action="/magaza"
            method="get"
            onSubmit={() => setOpen(false)}
            className="flex items-center gap-3 px-5"
            style={{
              height: "52px",
              background: "rgba(249,246,240,0.99)",
              border: "1px solid rgba(23,60,60,0.10)",
              borderRadius: "100px",
              boxShadow: "0 8px 32px rgba(9,43,43,0.18)",
            }}
          >
            <input
              ref={inputRef}
              name="q"
              type="search"
              placeholder="Ürün, kategori veya tasarımcı ara..."
              className="flex-1 bg-transparent outline-none text-ink placeholder:text-smoke/50"
              style={{ fontSize: "13px" }}
            />
            <button
              type="submit"
              aria-label="Ara"
              className="flex-shrink-0 text-smoke hover:text-ink transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
