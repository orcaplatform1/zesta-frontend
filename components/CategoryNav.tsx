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
        className="navbar-link"
        aria-expanded={open}
      >
        Ürünler
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-3 w-[280px] p-3"
          style={{
            background: "var(--zesta-surface)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div className="grid grid-cols-1 gap-0.5">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/kategori/${c.slug}`}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-[13px] transition-colors duration-[200ms] hover:bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-primary)", borderRadius: "var(--radius-sm)", display: "block" }}
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
