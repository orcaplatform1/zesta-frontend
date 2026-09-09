"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { ProductListResponse } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export default function HomePage() {
  const [data, setData] = useState<ProductListResponse | null>(null);

  useEffect(() => {
    api.get<ProductListResponse>("/products?pageSize=8").then(setData).catch(() => setData(null));
  }, []);

  return (
    <div>
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">El emeği, özenle hazırlanmış ürünler</h1>
          <p className="mt-3 text-neutral-600">Her parça elde, sipariş üzerine üretilir.</p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-neutral-900 text-white px-6 py-3 text-sm font-medium hover:bg-neutral-800"
          >
            Ürünleri Keşfet
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-lg font-semibold mb-6">Öne Çıkan Ürünler</h2>
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
      </section>
    </div>
  );
}
