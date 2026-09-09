"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { ProductListResponse } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export function HomeClient() {
  const [data, setData] = useState<ProductListResponse | null>(null);

  useEffect(() => {
    api.get<ProductListResponse>("/products?pageSize=8").then(setData).catch(() => setData(null));
  }, []);

  return (
    <div>
      <section
        className="grain relative flex min-h-[620px] md:min-h-[680px] items-center justify-center text-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, var(--onyx-900) 0%, var(--onyx-800) 55%, var(--onyx-700) 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-5">
          <p className="eyebrow">El İşi Atölye</p>
          <h1
            className="mt-6 font-display font-normal text-ink text-[42px] md:text-[64px] lg:text-[72px]"
            style={{ lineHeight: 0.98, letterSpacing: "-0.025em" }}
          >
            KÜÇÜK DETAYLAR.
            <br />
            <span className="text-champagne-300">BÜYÜK HİKÂYELER.</span>
          </h1>
          <p className="mt-6 text-[15px] md:text-[17px] text-ash max-w-lg mx-auto leading-relaxed">
            Her parça elde, sipariş üzerine, özenle üretilir.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-xs bg-ivory px-7 text-[12px] font-medium text-onyx-800 transition-colors duration-[180ms] hover:bg-smoke"
            style={{ letterSpacing: "0.1em" }}
          >
            ÜRÜNLERİ KEŞFET
          </Link>
        </div>
      </section>

      <section className="bg-onyx-800 py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12">
          <div className="mb-10 text-center">
            <p className="label-uppercase text-champagne-300">Koleksiyon</p>
            <h2 className="mt-3 font-display text-[32px] md:text-[44px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
              Öne Çıkan Ürünler
            </h2>
          </div>

          {!data ? (
            <p className="text-center text-sm text-ash">Yükleniyor...</p>
          ) : data.items.length === 0 ? (
            <p className="text-center text-sm text-ash">Henüz ürün eklenmedi.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-5">
              {data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
