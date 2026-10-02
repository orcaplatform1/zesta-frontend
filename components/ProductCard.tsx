"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/api";
import type { Product } from "@/lib/types";
import { Stars } from "@/components/Stars";
import { useBestsellerRank } from "@/lib/bestsellers";

export function ProductCard({
  product,
  rating,
}: {
  product: Product;
  rating?: { average: number; count: number };
}) {
  const bestsellerRank = useBestsellerRank(product.id);
  const [index, setIndex] = useState(0);
  const images = product.images;
  const image = images[index]?.url;
  const price = product.salePrice ?? product.price;
  const discountPct =
    product.salePrice && Number(product.price) > 0
      ? Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)
      : null;

  function goPrev(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => Math.max(0, i - 1));
  }
  function goNext(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => Math.min(images.length - 1, i + 1));
  }

  const arrowClass =
    "absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--ivory-50)]/90 text-ink shadow-[var(--shadow-sm)] opacity-100 transition-opacity duration-[180ms] md:opacity-0 md:group-hover:opacity-100";

  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group block overflow-hidden transition-all duration-[280ms] ease-[var(--ease-luxury)] hover:-translate-y-1"
      style={{
        background: "var(--zesta-surface)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--zesta-border-light)",
        boxShadow: "0 4px 20px rgba(9,43,43,0.04)",
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 18px 40px rgba(9,43,43,0.10)")}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(9,43,43,0.04)")}
    >
      {/* Image area */}
      <div
        className="relative aspect-square overflow-hidden m-2"
        style={{ borderRadius: "var(--radius-md)", background: "var(--stone-100)" }}
      >
        {discountPct !== null && discountPct > 0 && (
          <span className="badge-sale absolute left-2.5 top-2.5 z-10">
            -%{discountPct}
          </span>
        )}

        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[280ms] ease-[var(--ease-luxury)] group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-center text-xs" style={{ color: "var(--text-muted)" }}>
            Görsel yok
          </span>
        )}

        {bestsellerRank !== null && (
          <span
            className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-semibold text-white"
            style={{
              background: "linear-gradient(90deg, #f59e0b, #ef4444)",
              letterSpacing: "0.02em",
            }}
          >
            🔥 EN ÇOK SATILAN {bestsellerRank}.
          </span>
        )}

        {images.length > 1 && (
          <>
            {index > 0 && (
              <button onClick={goPrev} aria-label="Önceki görsel" className={`${arrowClass} left-1.5`}>
                ‹
              </button>
            )}
            {index < images.length - 1 && (
              <button onClick={goNext} aria-label="Sonraki görsel" className={`${arrowClass} right-1.5`}>
                ›
              </button>
            )}
          </>
        )}
      </div>

      {/* Card body */}
      <div className="px-4 pb-4 pt-2.5">
        {product.category && (
          <div className="label-uppercase mb-1.5">{product.category.name}</div>
        )}
        <h3
          className="text-[15px] leading-snug font-semibold line-clamp-2"
          style={{ color: "var(--zesta-text)", fontFamily: "var(--font-sans)" }}
        >
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span
            className="text-[15px] font-bold"
            style={{ color: "var(--zesta-primary)", fontFamily: "var(--font-sans)" }}
          >
            {formatPrice(price)}
          </span>
          {product.salePrice && (
            <span
              className="text-[13px] line-through"
              style={{ color: "var(--text-muted)" }}
            >
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {rating && rating.count > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="text-[12px] font-medium text-ink">{rating.average.toFixed(1)}</span>
            <Stars rating={rating.average} size={12} />
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>({rating.count})</span>
          </div>
        )}
        {product.stock <= 0 && (
          <span className="mt-1 block text-xs" style={{ color: "var(--text-muted)" }}>
            Tükendi
          </span>
        )}
      </div>
    </Link>
  );
}
