"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ProductListResponse } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export default function ShopPage() {
  const [data, setData] = useState<ProductListResponse | null>(null);

  useEffect(() => {
    api.get<ProductListResponse>("/products?pageSize=48").then(setData).catch(() => setData(null));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Ürünler</h1>
      {!data ? (
        <p className="text-neutral-500 text-sm">Yükleniyor...</p>
      ) : data.items.length === 0 ? (
        <p className="text-neutral-500 text-sm">Henüz ürün eklenmedi.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
