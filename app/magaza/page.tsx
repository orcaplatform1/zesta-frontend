"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category, ProductListResponse } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

const PAGE_SIZE = 24;

export default function ShopPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ProductListResponse | null>(null);

  useEffect(() => {
    api.get<Category[]>("/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setData(null);
    const categoryParam = activeCategory ? `&category=${activeCategory}` : "";
    api
      .get<ProductListResponse>(`/products?page=${page}&pageSize=${PAGE_SIZE}${categoryParam}`)
      .then(setData)
      .catch(() => setData(null));
  }, [activeCategory, page]);

  const pageCount = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="mx-auto max-w-[1440px] px-5 md:px-12 py-16 md:py-24">
      <div className="mb-10">
        <p className="eyebrow">Mağaza</p>
        <h1 className="mt-3 font-display text-[32px] md:text-[44px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
          Tüm Ürünler
        </h1>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <FilterChip active={activeCategory === null} onClick={() => (setActiveCategory(null), setPage(1))}>
          Tümü
        </FilterChip>
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            active={activeCategory === c.slug}
            onClick={() => (setActiveCategory(c.slug), setPage(1))}
          >
            {c.name}
          </FilterChip>
        ))}
      </div>

      {!data ? (
        <p className="text-sm text-ash">Yükleniyor...</p>
      ) : data.items.length === 0 ? (
        <p className="text-sm text-ash">Bu filtrede ürün bulunamadı.</p>
      ) : (
        <>
          <p className="mb-6 text-[13px] text-ash">{data.total} ürün</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-5">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="mt-14 flex items-center justify-center gap-8 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="text-smoke hover:text-ink transition-colors duration-[180ms] disabled:opacity-30 disabled:pointer-events-none"
                style={{ letterSpacing: "0.08em" }}
              >
                ← ÖNCEKİ
              </button>
              <span className="text-ash">
                Sayfa {page} / {pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page >= pageCount}
                className="text-smoke hover:text-ink transition-colors duration-[180ms] disabled:opacity-30 disabled:pointer-events-none"
                style={{ letterSpacing: "0.08em" }}
              >
                SONRAKİ →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="h-9 rounded-xs border px-4 text-[12px] transition-colors duration-[180ms]"
      style={{
        letterSpacing: "0.05em",
        borderColor: active ? "var(--border-accent)" : "var(--border-subtle)",
        color: active ? "var(--text-on-dark)" : "var(--text-secondary)",
        background: active ? "var(--champagne-300)" : "transparent",
      }}
    >
      {children}
    </button>
  );
}
