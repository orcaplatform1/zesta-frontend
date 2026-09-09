"use client";

import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category, ProductListResponse } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export default function CategoryPage(props: PageProps<"/category/[slug]">) {
  const { slug } = use(props.params);
  const [category, setCategory] = useState<Category | null>(null);
  const [data, setData] = useState<ProductListResponse | null>(null);

  useEffect(() => {
    api.get<Category>(`/categories/${slug}`).then(setCategory).catch(() => setCategory(null));
    api
      .get<ProductListResponse>(`/products?category=${slug}&pageSize=48`)
      .then(setData)
      .catch(() => setData(null));
  }, [slug]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">{category?.name ?? "Kategori"}</h1>
      {category?.description && <p className="text-neutral-500 mb-6">{category.description}</p>}

      {!data ? (
        <p className="text-neutral-500 text-sm mt-6">Yükleniyor...</p>
      ) : data.items.length === 0 ? (
        <p className="text-neutral-500 text-sm mt-6">Bu kategoride ürün yok.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
