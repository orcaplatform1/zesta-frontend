"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category, ProductListResponse } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

const PAGE_SIZE = 24;

export function CategoryClient({
  slug,
  initialCategory,
  initialProducts,
}: {
  slug: string;
  initialCategory: Category | null;
  initialProducts: ProductListResponse | null;
}) {
  const [category, setCategory] = useState<Category | null>(initialCategory);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ProductListResponse | null>(initialProducts);

  useEffect(() => {
    if (!initialCategory) {
      api.get<Category>(`/categories/${slug}`).then(setCategory).catch(() => setCategory(null));
    }
  }, [slug, initialCategory]);

  useEffect(() => {
    if (page === 1 && initialProducts) {
      setData(initialProducts);
      return;
    }
    setData(null);
    api
      .get<ProductListResponse>(`/products?category=${slug}&page=${page}&pageSize=${PAGE_SIZE}`)
      .then(setData)
      .catch(() => setData(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, page]);

  const pageCount = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="mx-auto max-w-[1440px] px-5 md:px-12 py-16 md:py-24">
      <div className="mb-10">
        <p className="eyebrow">Kategori</p>
        <h1 className="mt-3 font-display text-[32px] md:text-[44px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
          {category?.name ?? "..."}
        </h1>
        {category?.description && <p className="mt-3 text-ash max-w-xl">{category.description}</p>}
      </div>

      {!data ? (
        <p className="text-sm text-ash">Yükleniyor...</p>
      ) : data.items.length === 0 ? (
        <p className="text-sm text-ash">Bu kategoride ürün yok.</p>
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
