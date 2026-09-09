"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category, ProductListResponse } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

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
  const [data, setData] = useState<ProductListResponse | null>(initialProducts);

  useEffect(() => {
    if (initialCategory && initialProducts) return; // sunucuda zaten alındı
    api.get<Category>(`/categories/${slug}`).then(setCategory).catch(() => setCategory(null));
    api
      .get<ProductListResponse>(`/products?category=${slug}&pageSize=48`)
      .then(setData)
      .catch(() => setData(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-5">
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
