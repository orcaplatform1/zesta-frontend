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
    <div className="mx-auto max-w-[1440px] px-5 md:px-12 py-16 md:py-24">
      <div className="mb-10">
        <p className="eyebrow">Mağaza</p>
        <h1 className="mt-3 font-display text-[32px] md:text-[44px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
          Tüm Ürünler
        </h1>
      </div>

      {!data ? (
        <p className="text-sm text-ash">Yükleniyor...</p>
      ) : data.items.length === 0 ? (
        <p className="text-sm text-ash">Henüz ürün eklenmedi.</p>
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
