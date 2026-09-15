"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// "En Çok Satılan" rozeti için elle seçilmiş 25 ürünlük sıralı liste — Settings
// tablosunda tek bir key, admin panelinden değil şimdilik doğrudan veritabanından
// girildi. Tüm ProductCard'lar aynı tek istekten (modül düzeyinde paylaşılan
// promise) faydalanır, sayfa başına birden çok /settings isteği atılmaz.
let idsPromise: Promise<string[]> | null = null;

function loadBestsellerIds(): Promise<string[]> {
  if (!idsPromise) {
    idsPromise = api
      .get<Record<string, unknown>>("/settings")
      .then((s) => (s.bestseller_product_ids as string[] | undefined) ?? [])
      .catch(() => []);
  }
  return idsPromise;
}

/** Verilen ürün en çok satılanlar listesindeyse 1 tabanlı sırasını döner, değilse null. */
export function useBestsellerRank(productId: string): number | null {
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    loadBestsellerIds().then((ids) => {
      if (!alive) return;
      const idx = ids.indexOf(productId);
      setRank(idx >= 0 ? idx + 1 : null);
    });
    return () => {
      alive = false;
    };
  }, [productId]);

  return rank;
}
