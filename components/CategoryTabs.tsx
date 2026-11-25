"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/types";
import { ChevronIcon } from "@/components/HeaderIcons";

// Header altındaki yatay kategori sekmeleri; taşarsa sağda kaydırma oku.
export function CategoryTabs({ categories }: { categories: Category[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [canRight, setCanRight] = useState(false);
  const [canLeft, setCanLeft] = useState(false);

  function update() {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [categories.length]);

  if (categories.length === 0) return null;

  const arrowClass =
    "absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full";
  const arrowStyle = {
    background: "var(--zesta-surface)",
    border: "1px solid var(--zesta-border)",
    color: "var(--zesta-primary)",
    boxShadow: "var(--shadow-sm)",
  };

  return (
    <div className="relative">
      {canLeft && (
        <button type="button" aria-label="Sola kaydır" onClick={() => ref.current?.scrollBy({ left: -240, behavior: "smooth" })} className={`${arrowClass} left-0`} style={arrowStyle}>
          <ChevronIcon dir="left" size={14} />
        </button>
      )}
      <div ref={ref} onScroll={update} className="carousel-scroll flex items-center gap-7 overflow-x-auto">
        {categories.map((c) => {
          const active = pathname === `/kategori/${c.slug}`;
          return (
            <Link
              key={c.id}
              href={`/kategori/${c.slug}`}
              className="flex-none whitespace-nowrap py-2.5 text-[13px] font-semibold transition-colors duration-[180ms]"
              style={{
                color: active ? "var(--zesta-primary)" : "var(--text-secondary)",
                borderBottom: active ? "2px solid var(--zesta-primary)" : "2px solid transparent",
              }}
            >
              {c.name}
            </Link>
          );
        })}
      </div>
      {canRight && (
        <button type="button" aria-label="Sağa kaydır" onClick={() => ref.current?.scrollBy({ left: 240, behavior: "smooth" })} className={`${arrowClass} right-0`} style={arrowStyle}>
          <ChevronIcon dir="right" size={14} />
        </button>
      )}
    </div>
  );
}
