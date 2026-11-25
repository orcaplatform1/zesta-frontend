"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { RatingMap } from "@/lib/types";

// Mevcut /reviews/summary ucundan ürünlerin ortalama puan + yorum sayısını
// tek istekte alır (yeni backend yok).
export function useRatings(productIds: string[]): RatingMap {
  const [ratings, setRatings] = useState<RatingMap>({});
  const key = productIds.join(",");

  useEffect(() => {
    if (!key) return;
    let alive = true;
    api
      .get<RatingMap>(`/reviews/summary?productIds=${encodeURIComponent(key)}`)
      .then((r) => alive && setRatings(r ?? {}))
      .catch(() => alive && setRatings({}));
    return () => {
      alive = false;
    };
  }, [key]);

  return ratings;
}

export function discountPercent(price: string, salePrice: string | null): number | null {
  if (!salePrice || Number(price) <= 0) return null;
  const pct = Math.round((1 - Number(salePrice) / Number(price)) * 100);
  return pct > 0 ? pct : null;
}
