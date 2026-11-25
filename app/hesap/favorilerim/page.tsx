"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { HeartIcon } from "@/components/HeaderIcons";
import { useRatings } from "@/lib/use-ratings";
import { useFavoriteIds } from "@/lib/favorites";

export default function FavoritesPage() {
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    api
      .get<Product[]>("/favorites")
      .then(setItems)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          window.location.assign(`/hesap?donus=${encodeURIComponent("/hesap/favorilerim")}`);
          return;
        }
        setItems([]);
      });
  }, []);

  // Kalbe basılıp favoriden çıkarılan ürün anında listeden düşer; istek
  // başarısız olursa ortak favori durumu geri alındığı için ürün geri gelir.
  const fav = useFavoriteIds();
  const visible = items === null ? null : fav.loaded ? items.filter((p) => fav.ids.has(p.id)) : items;
  const ratings = useRatings((items ?? []).map((p) => p.id));

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:py-8 lg:px-5">
      <h1 className="mb-5 text-[20px] font-bold md:text-[24px]" style={{ color: "var(--zesta-text)" }}>
        Favorilerim
      </h1>
      {visible === null ? (
        <p className="text-sm text-ash">Yükleniyor...</p>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "var(--primary-50)", color: "var(--zesta-primary)" }}>
            <HeartIcon size={34} />
          </span>
          <p className="mt-5 text-[18px] font-bold text-ink">Henüz favori ürünün yok</p>
          <Link
            href="/magaza"
            className="mt-6 inline-flex h-12 items-center justify-center px-8 text-[14px] font-bold"
            style={{ background: "var(--zesta-primary)", color: "var(--text-on-dark)", borderRadius: "var(--radius-sm)" }}
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} rating={ratings[p.id]} />
          ))}
        </div>
      )}
    </div>
  );
}
