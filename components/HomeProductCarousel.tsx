"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ProductCarousel } from "@/components/ProductCarousel";
import type { Category, Product, ProductListResponse } from "@/lib/types";

const MAX_ITEMS = 15;

type RatingMap = Record<string, { average: number; count: number }>;

// Sırayla rastgele kategoriler dener, ilk ürünü olan kategoride durur
// (ana sayfa her yenilemede farklı kategori göstersin diye stabil tutulmuyor).
async function pickRandomCategoryProducts(): Promise<{ category: Category; data: ProductListResponse } | null> {
  const categories = await api.get<Category[]>("/categories").catch(() => []);
  const shuffled = [...categories].sort(() => Math.random() - 0.5);
  for (const category of shuffled) {
    const data = await api
      .get<ProductListResponse>(`/products?category=${category.slug}&pageSize=${MAX_ITEMS}`)
      .catch(() => null);
    if (data && data.items.length > 0) return { category, data };
  }
  return null;
}

export function HomeProductCarousel() {
  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Product[] | null>(null);
  const [ratings, setRatings] = useState<RatingMap>({});

  useEffect(() => {
    pickRandomCategoryProducts().then((result) => {
      if (!result) {
        setItems([]);
        return;
      }
      setCategory(result.category);
      setItems(result.data.items);
      const ids = result.data.items.map((p) => p.id).join(",");
      if (ids) {
        api
          .get<RatingMap>(`/reviews/summary?productIds=${ids}`)
          .then(setRatings)
          .catch(() => {});
      }
    });
  }, []);

  if (items && items.length === 0) return null;

  return (
    <section className="py-14 md:py-20 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow-on-light">Vitrin</p>
            <h2 className="mt-2 font-display text-[28px] md:text-[36px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
              {category?.name ?? "Yükleniyor..."}
            </h2>
          </div>
          {category && (
            <Link
              href={`/kategori/${category.slug}`}
              className="hidden sm:inline text-[12px] text-smoke hover:text-ink transition-colors duration-[180ms] whitespace-nowrap"
              style={{ letterSpacing: "0.1em" }}
            >
              TÜMÜNÜ GÖR →
            </Link>
          )}
        </div>

        {!items ? <p className="text-sm text-ash">Yükleniyor...</p> : <ProductCarousel items={items} ratings={ratings} />}
      </div>
    </section>
  );
}
