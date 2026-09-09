import Link from "next/link";
import { formatPrice } from "@/lib/api";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.url;
  const price = product.salePrice ?? product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-neutral-100 flex items-center justify-center overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <span className="text-neutral-400 text-sm">Görsel yok</span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold">{formatPrice(price)}</span>
          {product.salePrice && (
            <span className="text-xs text-neutral-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
        {product.stock <= 0 && <span className="text-xs text-red-600">Tükendi</span>}
      </div>
    </Link>
  );
}
