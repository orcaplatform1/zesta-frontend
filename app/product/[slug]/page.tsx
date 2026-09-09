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

  if (product === undefined) return <div className="mx-auto max-w-4xl px-4 py-10 text-neutral-500">Yükleniyor...</div>;
  if (product === null) return <div className="mx-auto max-w-4xl px-4 py-10">Ürün bulunamadı.</div>;

  const price = product.salePrice ?? product.price;
  const variantGroups = Array.from(new Set(product.variants.map((v) => v.name)));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center">
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-neutral-400">Görsel yok</span>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xl font-semibold">{formatPrice(price)}</span>
          {product.salePrice && <span className="text-neutral-400 line-through">{formatPrice(product.price)}</span>}
        </div>

        {product.description && <p className="mt-4 text-neutral-600 whitespace-pre-line">{product.description}</p>}
        {product.productionTime && <p className="mt-2 text-sm text-neutral-500">Üretim: {product.productionTime}</p>}

        {variantGroups.map((groupName) => (
          <div key={groupName} className="mt-4">
            <div className="text-sm font-medium mb-1">{groupName}</div>
            <div className="flex gap-2 flex-wrap">
              {product.variants
                .filter((v) => v.name === groupName)
                .map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    className={`px-3 py-1.5 rounded-full border text-sm ${
                      variantId === v.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
            </div>
          </div>
        ))}

        <div className="mt-6 flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={Math.max(availableStock, 1)}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-20 border border-neutral-300 rounded-md px-2 py-2 text-sm"
          />
          <button
            onClick={addToCart}
            disabled={busy || availableStock <= 0}
            className="flex-1 rounded-full bg-neutral-900 text-white px-6 py-3 text-sm font-medium disabled:opacity-50"
          >
            {availableStock <= 0 ? "Tükendi" : busy ? "Ekleniyor..." : "Sepete Ekle"}
          </button>
        </div>

        {message && <p className="mt-3 text-sm">{message}</p>}
        {message === "Sepete eklendi." && (
          <button onClick={() => router.push("/cart")} className="mt-2 text-sm underline">
            Sepete git
          </button>
        )}
      </div>
    </div>
  );
}
