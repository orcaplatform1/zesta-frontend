"use client";

import { useEffect, useMemo, useState, type ReactNode, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, formatPrice } from "@/lib/api";
import type { Product, ProductListResponse, Review } from "@/lib/types";
import { getSalesStats } from "@/lib/sales-stats";
import { getViewCount } from "@/lib/view-stats";
import { parseProductDescription } from "@/lib/product-description";
import { ProductCard } from "@/components/ProductCard";

const TRUST_ITEMS = [
  {
    label: "Ücretsiz Kargo",
    body: "2.500₺ üzeri siparişlerde",
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

type AccordionKey = "about" | "details" | "care";

function AccordionSection({
  title,
  open,
  onOpen,
  children,
}: {
  title: string;
  open: boolean;
  onOpen: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-[var(--border-subtle)]">
      <button onClick={onOpen} className="w-full flex items-center justify-between py-4 text-left">
        <span className="label-uppercase">{title}</span>
        <span
          className="text-ash text-[16px] leading-none transition-transform duration-[180ms]"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div className="accordion-panel" data-open={open}>
        <div>
          <div className="pb-5 text-[15px] leading-relaxed text-smoke">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" width={size} height={size} fill={i < rounded ? "var(--champagne-300)" : "none"} stroke="var(--champagne-300)" strokeWidth={1.2}>
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        return (
          <button key={v} type="button" onClick={() => onChange(v)} aria-label={`${v} yıldız`}>
            <svg viewBox="0 0 20 20" width={24} height={24} fill={v <= value ? "var(--champagne-300)" : "none"} stroke="var(--champagne-300)" strokeWidth={1.2}>
              <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
            </svg>
          </button>
        );
      })}
    </span>
  );
}

function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [me, setMe] = useState<{ email: string; name: string } | null | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  function load() {
    api.get<Review[]>(`/reviews?productId=${productId}`).then(setReviews).catch(() => setReviews([]));
  }

  useEffect(() => {
    load();
    api
      .get<{ email: string; name: string }>("/auth/me")
      .then(setMe)
      .catch(() => setMe(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const average = reviews && reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await api.post("/reviews", { productId, rating, comment: comment || undefined });
      setStatus("Yorumun alındı — onaylandıktan sonra burada yayınlanacak.");
      setComment("");
      setRating(5);
      setFormOpen(false);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Yorum gönderilemedi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-[1440px] px-5 md:px-12 pb-20 md:pb-28">
      <div className="max-w-3xl border-t border-[var(--border-subtle)] pt-16 md:pt-20">
        <p className="eyebrow-on-light">Değerlendirmeler</p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {average !== null ? (
            <>
              <span className="font-display text-[32px] text-ink">{average.toFixed(1)}</span>
              <div>
                <Stars rating={average} size={16} />
                <p className="mt-0.5 text-xs text-ash">
                  {reviews!.length} değerlendirmeye göre
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-ash">Henüz değerlendirme yok — ilk yorumu siz yazın.</p>
          )}
          <button
            onClick={() => setFormOpen((v) => !v)}
            className="ml-auto h-11 rounded-xs border border-[var(--border-subtle)] px-6 text-[12px] font-medium text-ink transition-colors duration-[180ms] hover:bg-onyx-700"
            style={{ letterSpacing: "0.1em" }}
          >
            YORUM YAZ
          </button>
        </div>

        {formOpen && (
          <div className="mt-6 border border-[var(--border-subtle)] rounded-sm p-5">
            {me === undefined ? (
              <p className="text-sm text-ash">Yükleniyor...</p>
            ) : me === null ? (
              <div>
                <p className="text-sm text-ash">Yorum yazmak için giriş yapmanız gerekiyor.</p>
                <Link href="/hesap" className="mt-3 inline-block text-sm text-champagne-300 underline">
                  Giriş Yap / Üye Ol
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <div>
                  <span className="label-uppercase block mb-2">Puanınız</span>
                  <StarPicker value={rating} onChange={setRating} />
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ürün hakkındaki düşünceleriniz..."
                  rows={3}
                  className="w-full rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 py-2.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="h-11 rounded-xs bg-charcoal-700 px-6 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {busy ? "GÖNDERİLİYOR..." : "GÖNDER"}
                </button>
              </form>
            )}
          </div>
        )}
        {status && <p className="mt-4 text-sm text-champagne-300">{status}</p>}

        {reviews && reviews.length > 0 && (
          <div className="mt-10 divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
            {reviews.map((r) => (
              <div key={r.id} className="py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{r.authorName}</span>
                  <span className="text-xs text-dim">{new Date(r.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
                <div className="mt-1.5">
                  <Stars rating={r.rating} />
                </div>
                {r.comment && <p className="mt-2 text-[14px] leading-relaxed text-smoke">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RelatedProducts({
  categorySlug,
  categoryLabel,
  excludeId,
}: {
  categorySlug: string | undefined;
  categoryLabel: string | undefined;
  excludeId: string;
}) {
  const [data, setData] = useState<ProductListResponse | null>(null);

  useEffect(() => {
    if (!categorySlug) return;
    api
      .get<ProductListResponse>(`/products?category=${categorySlug}&pageSize=11`)
      .then(setData)
      .catch(() => setData(null));
  }, [categorySlug]);

  if (!categorySlug) return null;
  const items = (data?.items ?? []).filter((p) => p.id !== excludeId).slice(0, 10);
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-5 md:px-12 pb-20 md:pb-28">
      <div className="mb-8 border-t border-[var(--border-subtle)] pt-16 md:pt-20">
        <p className="eyebrow-on-light">Keşfet</p>
        <h2
          className="mt-2 font-display text-[28px] md:text-[36px] font-normal text-ink"
          style={{ lineHeight: 1.05 }}
        >
          Daha Fazla {categoryLabel}
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-5">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

export function ProductClient({ slug, initialProduct }: { slug: string; initialProduct: Product | null }) {
  const router = useRouter();

  const [product, setProduct] = useState<Product | null | undefined>(initialProduct);
  const [variantId, setVariantId] = useState<string | undefined>(initialProduct?.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [openSection, setOpenSection] = useState<AccordionKey>("about");

  useEffect(() => {
    setImageIndex(0);
  }, [product?.id]);

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
  const viewCount = getViewCount(product.id, product.createdAt);
  const parsed = parseProductDescription(product);
  const images = product.images;

  return (
    <>
    <div className="mx-auto max-w-5xl px-5 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 md:gap-16">
      <div>
        <div className="relative aspect-square bg-stone-100 rounded-sm overflow-hidden flex items-center justify-center">
          {images[imageIndex] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[imageIndex].url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-stone-500 text-sm">Görsel yok</span>
          )}
          {images.length > 1 && (
            <>
              {imageIndex > 0 && (
                <button
                  onClick={() => setImageIndex((i) => i - 1)}
                  aria-label="Önceki görsel"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ivory-50)]/90 text-ink shadow-[var(--shadow-sm)] hover:bg-[var(--ivory-50)] transition-colors duration-[180ms]"
                >
                  ‹
                </button>
              )}
              {imageIndex < images.length - 1 && (
                <button
                  onClick={() => setImageIndex((i) => i + 1)}
                  aria-label="Sonraki görsel"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ivory-50)]/90 text-ink shadow-[var(--shadow-sm)] hover:bg-[var(--ivory-50)] transition-colors duration-[180ms]"
                >
                  ›
                </button>
              )}
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setImageIndex(i)}
                aria-label={`${i + 1}. görsel`}
                className="h-1.5 rounded-full transition-all duration-[180ms]"
                style={{
                  width: i === imageIndex ? "20px" : "6px",
                  background: i === imageIndex ? "var(--champagne-300)" : "var(--border-subtle)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        {product.category && <div className="label-uppercase mb-2">{product.category.name}</div>}
        <h1 className="font-display text-[32px] md:text-[40px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
          {product.name}
        </h1>

        <p className="mt-3 text-[13px] text-ash">
          Toplam {stats.soldTotal} satıldı · {viewCount} kez görüntülendi
        </p>

        <div className="mt-4 flex items-center gap-3">
          {discountPct !== null && discountPct > 0 && <span className="badge-sale">-%{discountPct}</span>}
          <span className="text-[20px] font-medium text-ink">{formatPrice(price)}</span>
          {product.salePrice && <span className="text-dim line-through">{formatPrice(product.price)}</span>}
        </div>

        <div className="mt-8 border-t border-[var(--border-subtle)]">
          <AccordionSection title="Hakkında" open={openSection === "about"} onOpen={() => setOpenSection("about")}>
            <p className="whitespace-pre-line">{parsed.about}</p>
          </AccordionSection>
          {parsed.details.length > 0 && (
            <AccordionSection title="Detaylar" open={openSection === "details"} onOpen={() => setOpenSection("details")}>
              <ul className="space-y-1.5">
                {parsed.details.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </AccordionSection>
          )}
          <AccordionSection title="Bakım" open={openSection === "care"} onOpen={() => setOpenSection("care")}>
            <p>{parsed.care}</p>
          </AccordionSection>
        </div>

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
          <button onClick={() => router.push("/sepet")} className="mt-2 text-sm text-champagne-300 underline">
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

    <ReviewsSection productId={product.id} />

    <RelatedProducts
      categorySlug={product.category?.slug}
      categoryLabel={product.category?.name}
      excludeId={product.id}
    />
    </>
  );
}
