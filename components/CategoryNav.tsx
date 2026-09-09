"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function hide() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  if (categories.length === 0) return null;

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-smoke hover:text-ink transition-colors duration-[180ms]"
        aria-expanded={open}
      >
        KATEGORİLER
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full z-50 mt-3 w-[280px] -translate-x-1/2 rounded-xs border border-[var(--border-subtle)] bg-[var(--ivory-50)] p-3 shadow-[var(--shadow-lg)]"
        >
          <div className="grid grid-cols-1 gap-0.5">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/kategori/${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-xs px-3 py-2 text-[13px] text-[color:var(--text-primary)] transition-colors duration-[180ms] hover:bg-[var(--bg-secondary)]"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
