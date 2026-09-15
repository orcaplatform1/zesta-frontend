"use client";

import { useState, type MouseEvent, type CSSProperties } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/api";
import type { Product } from "@/lib/types";

const glowRingStyle: CSSProperties = { "--zg-radius": "50%", "--zg-padding": "3px" } as CSSProperties;

export function ProductCard({ product }: { product: Product }) {
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
      className="group block border border-[var(--border-subtle)] rounded-sm bg-onyx-700 overflow-hidden transition-all duration-[250ms] ease-[var(--ease-luxury)] hover:-translate-y-[3px] hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-lg)]"
    >
      <div className="relative aspect-square flex items-center justify-center">
        {discountPct !== null && discountPct > 0 && (
          <span className="badge-sale absolute left-2.5 top-2.5 z-10">-%{discountPct}</span>
        )}
        <span className="zesta-glow-ring h-[92%] w-[92%]" style={glowRingStyle}>
          <div className="relative h-full w-full rounded-full bg-stone-100 overflow-hidden">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-[250ms] ease-[var(--ease-luxury)] group-hover:scale-[1.025]"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-center text-xs text-stone-500">
                Görsel yok
              </span>
            )}
          </div>
        </span>
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
      <div className="p-4">
        {product.category && <div className="label-uppercase mb-1.5">{product.category.name}</div>}
        <h3 className="text-[18px] leading-tight font-medium text-ink line-clamp-2">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[15px] font-medium text-ink">{formatPrice(price)}</span>
          {product.salePrice && (
            <span className="text-[13px] text-dim line-through">{formatPrice(product.price)}</span>
          )}
        </div>
        {product.stock <= 0 && <span className="mt-1 block text-xs text-dim">Tükendi</span>}
      </div>
    </Link>
  );
}
