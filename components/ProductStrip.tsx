"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useRatings } from "@/lib/use-ratings";
import type { Product, RatingMap } from "@/lib/types";

// Ortak ürün şeridi: başlık solda, "Tümü >" sağda, kartlar yatay kayar.
// Görünen kart: mobil 2, tablet 3, desktop 5. Her ürün bir kez gösterilir.
export function ProductStrip({
  title,
  href,
  items,
  ratings,
  dark = false,
}: {
  title: string;
  href?: string;
  items: Product[];
  ratings?: RatingMap;
  dark?: boolean;
}) {
  const seen = new Set<string>();
  const unique = items.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
  const fetched = useRatings(ratings ? [] : unique.map((p) => p.id));
  const ratingMap = ratings ?? fetched;

  if (unique.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          className="text-[18px] font-bold md:text-[20px]"
          style={{ color: dark ? "var(--text-on-dark)" : "var(--zesta-text)", fontFamily: "var(--font-sans)" }}
        >
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="flex-shrink-0 text-[13px] font-semibold"
            style={{ color: dark ? "var(--text-on-dark)" : "var(--zesta-primary)" }}
          >
            Tümü &gt;
          </Link>
        )}
      </div>
      <div className="carousel-scroll -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
        {unique.map((product) => (
          <div
            key={product.id}
            className="flex-none snap-start w-[calc((100%-12px)/2)] md:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
          >
            <ProductCard product={product} rating={ratingMap[product.id]} />
          </div>
        ))}
      </div>
    </div>
  );
}
