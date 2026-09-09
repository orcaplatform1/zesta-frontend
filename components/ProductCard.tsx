import Link from "next/link";
import { formatPrice } from "@/lib/api";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.url;
  const price = product.salePrice ?? product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block border border-[var(--border-subtle)] rounded-sm bg-onyx-700 overflow-hidden transition-all duration-[250ms] ease-[var(--ease-luxury)] hover:-translate-y-[3px] hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-lg)]"
    >
      <div className="aspect-square bg-stone-100 flex items-center justify-center overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[250ms] ease-[var(--ease-luxury)] group-hover:scale-[1.025]"
          />
        ) : (
          <span className="text-sm text-stone-500">Görsel yok</span>
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
