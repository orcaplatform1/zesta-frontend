"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, formatPrice } from "@/lib/api";
import type { Product } from "@/lib/types";
import { getSalesStats } from "@/lib/sales-stats";

const TRUST_ITEMS = [
  {
    label: "Ücretsiz Kargo",
    body: "750₺ üzeri siparişlerde",
    icon: (
      <path d="M2 6h11v9H2zM13 10h4l3 3v2h-7zM6 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM16.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    ),
  },
  {
    label: "Güvenli Ödeme",
    body: "256-bit SSL şifreleme",
    icon: <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5z" />,
  },
  {
    label: "Kolay İade",
    body: "14 gün içinde ücretsiz",
    icon: <path d="M4 4v6h6M20 20v-6h-6M4.5 15A8 8 0 0 0 19 9M19.5 9A8 8 0 0 0 5 15" />,
  },
];

function WeeklyTrendChart({ weekly }: { weekly: { day: string; value: number }[] }) {
  const max = Math.max(1, ...weekly.map((w) => w.value));
  const W = 260;
  const H = 56;
  const step = W / (weekly.length - 1);
  const points = weekly.map((w, i) => {
    const x = i * step;
    const y = H - (w.value / max) * (H - 8) - 4;
    return `${x},${y}`;
  });

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="var(--champagne-300)"
          strokeWidth={1.75}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {weekly.map((w, i) => {
          const [x, y] = points[i].split(",").map(Number);
          return <circle key={i} cx={x} cy={y} r={2.25} fill="var(--champagne-300)" />;
        })}
      </svg>
      <div className="mt-1.5 flex justify-between">
        {weekly.map((w, i) => (
          <span key={i} className="text-[10px] text-dim" style={{ letterSpacing: "0.05em" }}>
            {w.day}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProductClient({ slug, initialProduct }: { slug: string; initialProduct: Product | null }) {
  const router = useRouter();

  const [product, setProduct] = useState<Product | null | undefined>(initialProduct);
  const [variantId, setVariantId] = useState<string | undefined>(initialProduct?.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialProduct) return; // sunucuda zaten alındı, tekrar çekmeye gerek yok
    api
      .get<Product>(`/products/${slug}`)
      .then((p) => {
        setProduct(p);
        if (p.variants.length > 0) setVariantId(p.variants[0].id);
      })
      .catch(() => setProduct(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const discountPct =
    product.salePrice && Number(product.price) > 0
      ? Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)
      : null;
  const variantGroups = Array.from(new Set(product.variants.map((v) => v.name)));
  const stats = getSalesStats(product.id, product.createdAt);

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

        <p className="mt-3 text-[13px] text-ash">Bu ay {stats.soldTotal} kişi bu ürünü satın aldı</p>

        <div className="mt-4 flex items-center gap-3">
          {discountPct !== null && discountPct > 0 && <span className="badge-sale">-%{discountPct}</span>}
          <span className="text-[20px] font-medium text-ink">{formatPrice(price)}</span>
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
                        color: selected ? "var(--text-on-dark)" : "var(--text-secondary)",
                        background: selected ? "var(--champagne-300)" : "transparent",
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
            className="flex-1 h-12 rounded-xs bg-charcoal-700 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
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

        <div className="mt-10 grid grid-cols-3 gap-4 border-y border-[var(--border-subtle)] py-6">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="text-center">
              <svg
                viewBox="0 0 24 24"
                width={20}
                height={20}
                fill="none"
                stroke="var(--text-secondary)"
                strokeWidth={1.4}
                className="mx-auto mb-2"
              >
                {item.icon}
              </svg>
              <p className="text-[11px] font-medium text-ink" style={{ letterSpacing: "0.04em" }}>
                {item.label}
              </p>
              <p className="mt-0.5 text-[10px] text-dim leading-snug">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p className="label-uppercase mb-3">Bu Haftaki Satış Trendi</p>
          <WeeklyTrendChart weekly={stats.weekly} />
        </div>
      </div>
    </div>
  );
}
