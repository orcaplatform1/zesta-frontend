"use client";

import type { MouseEvent } from "react";
import { HeartIcon } from "@/components/HeaderIcons";
import { toggleFavorite, useIsFavorite } from "@/lib/favorites";

export function FavoriteButton({
  productId,
  className,
  style,
  size = 18,
}: {
  productId: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
}) {
  const fav = useIsFavorite(productId);

  function onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={fav}
      className={className}
      style={{ color: "var(--text-secondary)", ...style }}
    >
      <HeartIcon size={size} filled={fav} />
    </button>
  );
}
