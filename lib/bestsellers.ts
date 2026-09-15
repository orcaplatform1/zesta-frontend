"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// "En Çok Satılan" rozeti — backend'in /products/bestsellers uç noktası,
// ürün sayfasında zaten gösterilen simüle "X satıldı" sayısına göre sıralar
// (bkz. backend/src/products/sales-stats.util.ts), böylece rozetteki sıra
// ile ürünün kendi sayfasındaki satış sayısı hep tutarlı olur. Tüm
// ProductCard'lar aynı tek istekten (modül düzeyinde paylaşılan promise)
// faydalanır, sayfa başına birden çok istek atılmaz.
let ranksPromise: Promise<Map<string, number>> | null = null;

function loadRanks(): Promise<Map<string, number>> {
  if (!ranksPromise) {
    ranksPromise = api
      .get<{ id: string; rank: number }[]>("/products/bestsellers?limit=25")
      .then((rows) => new Map(rows.map((r) => [r.id, r.rank])))
      .catch(() => new Map());
  }
  return ranksPromise;
}

/** Verilen ürün en çok satılanlar listesindeyse 1 tabanlı sırasını döner, değilse null. */
export function useBestsellerRank(productId: string): number | null {
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    loadRanks().then((ranks) => {
      if (!alive) return;
      setRank(ranks.get(productId) ?? null);
    });
    return () => {
      alive = false;
    };
  }, [productId]);

  return rank;
}
