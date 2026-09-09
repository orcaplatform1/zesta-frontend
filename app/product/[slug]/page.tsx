"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, formatPrice } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = use(props.params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [variantId, setVariantId] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Product>(`/products/${slug}`)
      .then((p) => {
        setProduct(p);
        if (p.variants.length > 0) setVariantId(p.variants[0].id);
      })
      .catch(() => setProduct(null));
  }, [slug]);

  const selectedVariant = useMemo(
    () => product?.variants.find((v) => v.id === variantId),
    [product, variantId],
  );

  const availableStock = selectedVariant?.stock ?? product?.stock ?? 0;

  async function addToCart() {
    if (!product) return;
    setBusy(true);
    setMessage(null);
    try {
      await api.post("/cart/items", { productId: product.id, variantId, quantity });
      setMessage("Sepete eklendi.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setBusy(false);
    }
  }

  if (product === undefined)
    return <div className="mx-auto max-w-5xl px-5 py-24 text-sm text-ash">Yükleniyor...</div>;
  if (product === null)
    return <div className="mx-auto max-w-5xl px-5 py-24 text-ink">Ürün bulunamadı.</div>;

  const price = product.salePrice ?? product.price;
  const variantGroups = Array.from(new Set(product.variants.map((v) => v.name)));

  return (
    <div className="mx-auto max-w-5xl px-5 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 md:gap-16">
      <div className="aspect-square bg-stone-100 rounded-sm overflow-hidden flex items-center justify-center">
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-stone-500 text-sm">Görsel yok</span>
        )}
      </div>

      <div>
        {product.category && <div className="label-uppercase mb-2">{product.category.name}</div>}
        <h1 className="font-display text-[32px] md:text-[40px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
          {product.name}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-[18px] font-medium text-ink">{formatPrice(price)}</span>
          {product.salePrice && <span className="text-dim line-through">{formatPrice(product.price)}</span>}
        </div>

        {product.description && (
          <p className="mt-6 text-[15px] leading-relaxed text-smoke whitespace-pre-line">{product.description}</p>
        )}
        {product.productionTime && <p className="mt-3 text-sm text-ash">Üretim: {product.productionTime}</p>}

        {variantGroups.map((groupName) => (
          <div key={groupName} className="mt-6">
            <div className="label-uppercase mb-2">{groupName}</div>
            <div className="flex gap-2 flex-wrap">
              {product.variants
                .filter((v) => v.name === groupName)
                .map((v) => {
                  const selected = variantId === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      className="rounded-xs border px-4 py-2 text-sm transition-colors duration-[180ms]"
                      style={{
                        borderColor: selected ? "var(--border-accent)" : "var(--border-subtle)",
                        color: selected ? "var(--champagne-200)" : "var(--text-secondary)",
                        background: selected ? "var(--onyx-600)" : "transparent",
                      }}
                    >
                      {v.value}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}

        <div className="mt-8 flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={Math.max(availableStock, 1)}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-20 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3 py-3 text-sm text-ink focus:outline-none focus:border-[var(--border-accent)]"
          />
          <button
            onClick={addToCart}
            disabled={busy || availableStock <= 0}
            className="flex-1 h-12 rounded-xs bg-ivory text-[12px] font-medium text-onyx-800 transition-colors duration-[180ms] hover:bg-smoke disabled:opacity-40"
            style={{ letterSpacing: "0.1em" }}
          >
            {availableStock <= 0 ? "TÜKENDİ" : busy ? "EKLENİYOR..." : "SEPETE EKLE"}
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-ash">{message}</p>}
        {message === "Sepete eklendi." && (
          <button onClick={() => router.push("/cart")} className="mt-2 text-sm text-champagne-300 underline">
            Sepete git
          </button>
        )}
      </div>
    </div>
  );
}
