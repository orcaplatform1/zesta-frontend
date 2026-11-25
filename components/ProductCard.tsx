"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/api";
import type { Product } from "@/lib/types";
import { Stars } from "@/components/Stars";
import { useBestsellerRank } from "@/lib/bestsellers";
import { discountPercent } from "@/lib/use-ratings";
import { FavoriteButton } from "@/components/FavoriteButton";

// Tüm sayfalarda kullanılan tek ürün kartı.
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
  const discountPct = discountPercent(product.price, product.salePrice);

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
      className="group flex h-full flex-col overflow-hidden transition-shadow duration-[240ms] hover:shadow-[var(--shadow-md)]"
      style={{
        background: "var(--zesta-surface)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--zesta-border-light)",
      }}
    >
      {/* Görsel */}
      <div className="relative aspect-square overflow-hidden" style={{ background: "var(--stone-100)" }}>
        {discountPct !== null && (
          <span className="badge-sale absolute left-2 top-2 z-10">-%{discountPct}</span>
        )}

        <FavoriteButton
          productId={product.id}
          size={16}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-[var(--shadow-sm)]"
          style={{ background: "var(--zesta-surface)" }}
        />

        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            loading="lazy"
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
            style={{ background: "linear-gradient(90deg, #f59e0b, #ef4444)", letterSpacing: "0.02em" }}
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

      {/* İndirim şeridi */}
      {discountPct !== null && (
        <div className="px-3 py-1 text-[11px] font-semibold" style={{ background: "var(--primary-50)", color: "var(--zesta-primary)" }}>
          %{discountPct} İndirim
        </div>
      )}

      {/* Gövde */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <h3 className="line-clamp-2 text-[13px] leading-snug md:text-[14px]" style={{ color: "var(--zesta-text)", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
          {product.name}
        </h3>
        {product.category && <div className="label-uppercase mt-1 truncate">{product.category.name}</div>}

        {rating && rating.count > 0 && (
          <div className="mt-1.5 flex items-center gap-1">
            <span className="text-[12px] font-semibold text-ink">{rating.average.toFixed(1)}</span>
            <Stars rating={rating.average} size={11} />
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>({rating.count})</span>
          </div>
        )}

        <div className="mt-auto pt-2">
          {product.salePrice && (
            <div className="text-[12px] line-through" style={{ color: "var(--text-muted)" }}>
              {formatPrice(product.price)}
            </div>
          )}
          <div className="text-[15px] font-bold md:text-[16px]" style={{ color: "var(--zesta-primary)", fontFamily: "var(--font-sans)" }}>
            {formatPrice(price)}
          </div>
          {product.stock <= 0 && (
            <span className="mt-0.5 block text-xs" style={{ color: "var(--text-muted)" }}>
              Tükendi
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
