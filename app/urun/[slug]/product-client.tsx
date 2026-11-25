"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, formatPrice } from "@/lib/api";
import type { Product, ProductListResponse, Review } from "@/lib/types";
import { getSalesStats } from "@/lib/sales-stats";
import { getViewCount } from "@/lib/view-stats";
import { parseProductDescription } from "@/lib/product-description";
import { useBestsellerRank } from "@/lib/bestsellers";
import { discountPercent } from "@/lib/use-ratings";
import { Stars } from "@/components/Stars";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ProductStrip } from "@/components/ProductStrip";
import { PriceMatchButton } from "@/components/PriceMatchModal";
import { InstallmentOptionsButton } from "@/components/InstallmentModal";
import {
  ArrowLeftIcon,
  BagIcon,
  BoxIcon,
  ChevronIcon,
  ClockIcon,
  HandIcon,
  ShareIcon,
  TruckIcon,
} from "@/components/HeaderIcons";

type TabKey = "description" | "reviews" | "shipping";

const HIGHLIGHTS = [
  { label: "El Yapımı", icon: <HandIcon size={18} /> },
  { label: "Sipariş Üzerine", icon: <ClockIcon size={18} /> },
  { label: "Özenle Paketlenir", icon: <BoxIcon size={18} /> },
];

const SHIPPING_TEXT =
  "Koşulsuz 14 gün ücretsiz iade hakkınız bulunmaktadır. Siparişlerim sayfasından ücretsiz olarak iade kodunuzu oluşturabilirsiniz.";

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

function TrustBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid-cols-3 gap-3 p-4 ${className}`}
      style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border-light)", borderRadius: "var(--radius-sm)" }}
    >
      {TRUST_ITEMS.map((item) => (
        <div key={item.label} className="text-center">
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="var(--zesta-primary)" strokeWidth={1.4} className="mx-auto mb-2">
            {item.icon}
          </svg>
          <p className="text-[11px] font-semibold text-ink" style={{ letterSpacing: "0.02em" }}>
            {item.label}
          </p>
          <p className="mt-0.5 text-[10px] leading-snug text-dim">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

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
        <polyline points={points.join(" ")} fill="none" stroke="var(--champagne-300)" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
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

/* ───────── Galeri ───────── */

function Lightbox({ images, alt, start, onClose }: { images: Product["images"]; alt: string; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
      if (e.key === "ArrowRight") setI((v) => Math.min(images.length - 1, v + 1));
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  const navBtn = "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full";
  const navStyle = { background: "var(--zesta-surface)", color: "var(--zesta-text)" };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90" role="dialog" aria-modal="true" aria-label="Ürün görselleri">
      <button onClick={onClose} aria-label="Kapat" className="absolute right-4 top-4 z-10 text-[32px] leading-none" style={{ color: "var(--text-on-dark)" }}>
        ×
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[i]?.url} alt={alt} className="max-h-[88vh] max-w-[92vw] object-contain" />
      {i > 0 && (
        <button onClick={() => setI(i - 1)} aria-label="Önceki görsel" className={`${navBtn} left-3`} style={navStyle}>
          <ChevronIcon dir="left" />
        </button>
      )}
      {i < images.length - 1 && (
        <button onClick={() => setI(i + 1)} aria-label="Sonraki görsel" className={`${navBtn} right-3`} style={navStyle}>
          <ChevronIcon dir="right" />
        </button>
      )}
      {images.length > 1 && (
        <p className="absolute bottom-5 text-[13px]" style={{ color: "var(--text-on-dark-muted)" }}>
          {i + 1} / {images.length}
        </p>
      )}
    </div>
  );
}

function Gallery({ product, discountPct }: { product: Product; discountPct: number | null }) {
  const images = product.images;
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => setIndex(0), [product.id]);

  function onMobileScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  const overlays = (
    <>
      {discountPct !== null && <span className="badge-sale absolute left-3 top-3 z-10">-%{discountPct}</span>}
    </>
  );

  return (
    <>
      {/* Mobil: tam genişlik kaydırmalı */}
      <div className="relative -mx-4 md:hidden">
        <div ref={scrollRef} onScroll={onMobileScroll} className="carousel-scroll flex snap-x snap-mandatory overflow-x-auto">
          {images.length > 0 ? (
            images.map((img, i) => (
              <button key={img.id} type="button" onClick={() => setLightbox(i)} className="aspect-square w-full flex-none snap-start" style={{ background: "var(--stone-100)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={product.name} className="h-full w-full object-cover" />
              </button>
            ))
          ) : (
            <div className="flex aspect-square w-full items-center justify-center text-sm text-ash" style={{ background: "var(--stone-100)" }}>
              Görsel yok
            </div>
          )}
        </div>
        {overlays}
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {images.map((img, i) => (
              <span
                key={img.id}
                className="h-1.5 rounded-full transition-all duration-[180ms]"
                style={{ width: i === index ? "18px" : "6px", background: i === index ? "var(--zesta-primary)" : "var(--zesta-border)" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop/tablet: dikey küçük resimler + büyük görsel */}
      <div className="hidden gap-3 md:flex">
        {images.length > 1 && (
          <div className="carousel-scroll flex max-h-[560px] w-[68px] flex-none flex-col gap-2 overflow-y-auto">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setIndex(i)}
                onMouseEnter={() => setIndex(i)}
                aria-label={`${i + 1}. görsel`}
                className="aspect-square w-full flex-none overflow-hidden"
                style={{
                  borderRadius: "var(--radius-xs)",
                  border: i === index ? "2px solid var(--zesta-primary)" : "1px solid var(--zesta-border)",
                  background: "var(--stone-100)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div
          className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden"
          style={{ background: "var(--stone-100)", borderRadius: "var(--radius-sm)", border: "1px solid var(--zesta-border-light)" }}
          onClick={() => images.length > 0 && setLightbox(index)}
        >
          {images[index] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[index].url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-sm text-ash">Görsel yok</span>
          )}
          {overlays}
        </div>
      </div>

      {lightbox !== null && <Lightbox images={images} alt={product.name} start={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

/* ───────── Değerlendirmeler ───────── */

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

function ReviewsPanel({ productId, reviews }: { productId: string; reviews: Review[] | null }) {
  const [me, setMe] = useState<{ email: string; name: string } | null | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ email: string; name: string }>("/auth/me")
      .then(setMe)
      .catch(() => setMe(null));
  }, [productId]);

  const count = reviews?.length ?? 0;
  const average = count > 0 ? reviews!.reduce((s, r) => s + r.rating, 0) / count : null;
  const dist = [5, 4, 3, 2, 1].map((star) => ({ star, n: reviews?.filter((r) => Math.round(r.rating) === star).length ?? 0 }));

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
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {average !== null ? (
          <>
            <div className="flex flex-col items-center sm:w-[160px]">
              <span className="text-[44px] font-bold leading-none" style={{ color: "var(--zesta-text)" }}>
                {average.toFixed(1)}
              </span>
              <div className="mt-2">
                <Stars rating={average} size={16} />
              </div>
              <p className="mt-1 text-xs text-ash">{count} Değerlendirme</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {dist.map((d) => (
                <div key={d.star} className="flex items-center gap-2 text-[12px]">
                  <span className="w-3 text-right text-ash">{d.star}</span>
                  <svg viewBox="0 0 20 20" width={12} height={12} fill="var(--champagne-300)" aria-hidden>
                    <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
                  </svg>
                  <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "var(--zesta-border-light)" }}>
                    <div className="h-full rounded-full" style={{ width: `${count ? (d.n / count) * 100 : 0}%`, background: "var(--champagne-300)" }} />
                  </div>
                  <span className="w-6 text-ash">{d.n}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="flex-1 text-sm text-ash">Henüz değerlendirme yok — ilk yorumu siz yazın.</p>
        )}
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="h-11 self-start px-6 text-[12px] font-semibold sm:self-center"
          style={{ border: "1px solid var(--zesta-primary)", color: "var(--zesta-primary)", borderRadius: "var(--radius-sm)", letterSpacing: "0.08em" }}
        >
          YORUM YAZ
        </button>
      </div>

      {formOpen && (
        <div className="mt-6 p-5" style={{ border: "1px solid var(--zesta-border)", borderRadius: "var(--radius-sm)" }}>
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
                <span className="label-uppercase mb-2 block">Puanınız</span>
                <StarPicker value={rating} onChange={setRating} />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ürün hakkındaki düşünceleriniz..."
                rows={3}
                className="w-full rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 py-2.5 text-sm text-ink placeholder:text-dim focus:border-[var(--border-accent)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className="h-11 px-6 text-[12px] font-semibold disabled:opacity-40"
                style={{ background: "var(--zesta-primary)", color: "var(--text-on-dark)", borderRadius: "var(--radius-sm)", letterSpacing: "0.08em" }}
              >
                {busy ? "GÖNDERİLİYOR..." : "GÖNDER"}
              </button>
            </form>
          )}
        </div>
      )}
      {status && <p className="mt-4 text-sm text-champagne-300">{status}</p>}

      {reviews && reviews.length > 0 && (
        <div className="mt-8 divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
          {reviews.map((r) => (
            <div key={r.id} className="py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{r.authorName}</span>
                <span className="text-xs text-dim">{new Date(r.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="mt-1">
                <Stars rating={r.rating} size={12} />
              </div>
              {r.comment && <p className="mt-2 text-[14px] leading-relaxed text-smoke">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────── Sayfa ───────── */

function MobileAccordion({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div style={{ borderBottom: "1px solid var(--zesta-border-light)" }}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center justify-between py-4 text-left">
        <span className="text-[15px] font-bold" style={{ color: "var(--zesta-text)" }}>
          {title}
        </span>
        <ChevronIcon dir={open ? "up" : "down"} size={16} />
      </button>
      {open && <div className="pb-5">{children}</div>}
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
  const [tab, setTab] = useState<TabKey>("description");
  const [mobileOpen, setMobileOpen] = useState<TabKey | null>("description");
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [related, setRelated] = useState<ProductListResponse | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialProduct) return; // sunucuda zaten alındı
    api
      .get<Product>(`/products/${slug}`)
      .then((p) => {
        setProduct(p);
        if (p.variants.length > 0) setVariantId(p.variants[0].id);
      })
      .catch(() => setProduct(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!product?.id) return;
    api.get<Review[]>(`/reviews?productId=${product.id}`).then(setReviews).catch(() => setReviews([]));
  }, [product?.id]);

  const categorySlug = product?.category?.slug;
  useEffect(() => {
    if (!categorySlug) return;
    api
      .get<ProductListResponse>(`/products?category=${categorySlug}&pageSize=11`)
      .then(setRelated)
      .catch(() => setRelated(null));
  }, [categorySlug]);

  const selectedVariant = useMemo(() => product?.variants.find((v) => v.id === variantId), [product, variantId]);
  const availableStock = selectedVariant?.stock ?? product?.stock ?? 0;
  const bestsellerRank = useBestsellerRank(product?.id ?? "");

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

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("Bağlantı kopyalandı.");
      }
    } catch {
      // kullanıcı paylaşımı iptal etti
    }
  }

  function goReviews() {
    setTab("reviews");
    setMobileOpen("reviews");
    requestAnimationFrame(() => tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  if (product === undefined) return <div className="mx-auto max-w-[1200px] px-4 py-24 text-sm text-ash">Yükleniyor...</div>;
  if (product === null) return <div className="mx-auto max-w-[1200px] px-4 py-24 text-ink">Ürün bulunamadı.</div>;

  const price = product.salePrice ?? product.price;
  const discountPct = discountPercent(product.price, product.salePrice);
  const variantGroups = Array.from(new Set(product.variants.map((v) => v.name)));
  const stats = getSalesStats(product.id, product.createdAt);
  const viewCount = getViewCount(product.id, product.createdAt);
  const parsed = parseProductDescription(product);
  const reviewCount = reviews?.length ?? 0;
  const reviewAvg = reviewCount > 0 ? reviews!.reduce((s, r) => s + r.rating, 0) / reviewCount : 0;
  const relatedItems = (related?.items ?? []).filter((p) => p.id !== product.id).slice(0, 10);
  const soldOut = availableStock <= 0;
  const addLabel = soldOut ? "TÜKENDİ" : busy ? "EKLENİYOR..." : "SEPETE EKLE";

  const descriptionContent = (
    <div className="space-y-5 text-[14px] leading-relaxed text-smoke">
      <p className="whitespace-pre-line">{parsed.about}</p>
      {parsed.details.length > 0 && (
        <div>
          <p className="mb-2 font-bold text-ink">Detaylar</p>
          <ul className="space-y-1.5">
            {parsed.details.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="mb-2 font-bold text-ink">Bakım</p>
        <p>{parsed.care}</p>
      </div>
    </div>
  );
  const shippingContent = (
    <div className="space-y-3 text-[14px] leading-relaxed text-smoke">
      <p>2.500₺ ve üzeri siparişlerde kargo bizden.</p>
      {product.productionTime && <p>Tahmini hazırlık süresi: {product.productionTime}</p>}
      <p>{SHIPPING_TEXT}</p>
    </div>
  );
  const reviewsContent = <ReviewsPanel productId={product.id} reviews={reviews} />;

  const TABS: { key: TabKey; label: string; content: ReactNode }[] = [
    { key: "description", label: "Ürün Açıklaması", content: descriptionContent },
    { key: "reviews", label: `Değerlendirmeler${reviewCount ? ` (${reviewCount})` : ""}`, content: reviewsContent },
    { key: "shipping", label: "Kargo & İade", content: shippingContent },
  ];

  return (
    <>
      {/* Mobil üst çubuk */}
      <div
        className="sticky top-9 z-40 flex h-12 items-center gap-2 px-2 md:hidden"
        style={{ background: "var(--zesta-surface)", borderBottom: "1px solid var(--zesta-border)" }}
      >
        <button type="button" onClick={() => router.back()} aria-label="Geri" className="flex h-10 w-10 items-center justify-center text-ink">
          <ArrowLeftIcon />
        </button>
        <p className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink">{product.name}</p>
        <button type="button" onClick={share} aria-label="Paylaş" className="flex h-10 w-10 items-center justify-center text-ink">
          <ShareIcon />
        </button>
        <Link href="/sepet" aria-label="Sepet" className="flex h-10 w-10 items-center justify-center text-ink">
          <BagIcon />
        </Link>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 pb-6 md:py-6 lg:px-5">
        {/* a) Kategori yolu (desktop) */}
        <nav aria-label="Sayfa yolu" className="mb-4 hidden flex-wrap items-center gap-1.5 text-[12px] text-ash md:flex">
          <Link href="/" className="hover:text-ink">
            Ana Sayfa
          </Link>
          {product.category && (
            <>
              <ChevronIcon size={11} />
              <Link href={`/kategori/${product.category.slug}`} className="hover:text-ink">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronIcon size={11} />
          <span className="truncate text-ink">{product.name}</span>
        </nav>

        <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-6 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-0">
          <div className="lg:pr-8">
            <Gallery product={product} discountPct={discountPct} />
          </div>

          <div className="mt-4 md:mt-0">
            {bestsellerRank !== null && (
              <span
                className="mb-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                style={{ background: "linear-gradient(90deg, #f59e0b, #ef4444)", letterSpacing: "0.02em" }}
              >
                🔥 EN ÇOK SATILAN {bestsellerRank}. ÜRÜN
              </span>
            )}

            {/* b) Tasarımcı/mağaza adı (veri yok) + ürün adı */}
            <h1 className="text-[18px] leading-snug md:text-[22px]" style={{ color: "var(--zesta-text)", fontWeight: 400 }}>
              {product.name}
            </h1>

            {/* c) Puan */}
            {reviewCount > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[14px] font-bold text-ink">{reviewAvg.toFixed(1)}</span>
                <Stars rating={reviewAvg} size={14} />
                <button type="button" onClick={goReviews} className="text-[13px] underline" style={{ color: "var(--zesta-primary)" }}>
                  ({reviewCount} Değerlendirme)
                </button>
              </div>
            )}
            <p className="mt-1.5 text-[12px] text-ash">
              Toplam {stats.soldTotal} satıldı · {viewCount} kez görüntülendi
            </p>

            {/* d) Fiyat bloğu */}
            <div className="mt-4">
              {discountPct !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-[14px] line-through text-ash">{formatPrice(product.price)}</span>
                  <span className="badge-sale">%{discountPct}</span>
                </div>
              )}
              <div className="mt-1 text-[26px] font-bold md:text-[30px]" style={{ color: "var(--zesta-primary)" }}>
                {formatPrice(price)}
              </div>
            </div>

            <TrustBox className="mt-4 grid md:hidden" />

            <div className="flex flex-wrap items-center gap-x-4">
              <PriceMatchButton />
              <InstallmentOptionsButton />
            </div>

            {/* e) Kargo bilgi kutusu */}
            <div
              className="mt-4 flex items-start gap-3 p-3.5"
              style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border)", borderRadius: "var(--radius-sm)" }}
            >
              <span style={{ color: "var(--zesta-primary)" }}>
                <TruckIcon size={20} />
              </span>
              <div className="text-[13px]">
                <p className="font-semibold text-ink">2.500₺ ve üzeri siparişlerde kargo bizden</p>
                {product.productionTime && <p className="mt-0.5 text-ash">Tahmini hazırlık süresi: {product.productionTime}</p>}
              </div>
            </div>

            {/* f) Varyantlar */}
            {variantGroups.map((groupName) => (
              <div key={groupName} className="mt-5">
                <div className="mb-2 text-[13px] font-semibold text-ink">{groupName}</div>
                <div className="flex flex-wrap gap-2">
                  {product.variants
                    .filter((v) => v.name === groupName)
                    .map((v) => {
                      const selected = variantId === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setVariantId(v.id)}
                          className="min-w-[48px] px-4 py-2 text-[13px] transition-colors duration-[180ms]"
                          style={{
                            borderRadius: "var(--radius-xs)",
                            border: selected ? "2px solid var(--zesta-primary)" : "1px solid var(--zesta-border)",
                            color: selected ? "var(--zesta-primary)" : "var(--text-secondary)",
                            fontWeight: selected ? 700 : 400,
                            background: "var(--zesta-surface)",
                          }}
                        >
                          {v.value}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}

            {/* g) Adet + Sepete Ekle + favori (desktop/tablet) */}
            <div className="mt-6 hidden items-stretch gap-3 md:flex">
              <div className="flex h-12 items-center" style={{ border: "1px solid var(--zesta-border)", borderRadius: "var(--radius-sm)" }}>
                <button type="button" aria-label="Azalt" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-full w-10 text-[18px] text-ink">
                  −
                </button>
                <span className="w-8 text-center text-[15px] font-semibold text-ink">{quantity}</span>
                <button
                  type="button"
                  aria-label="Artır"
                  onClick={() => setQuantity((q) => Math.min(Math.max(availableStock, 1), q + 1))}
                  className="h-full w-10 text-[18px] text-ink"
                >
                  +
                </button>
              </div>
              <button
                onClick={addToCart}
                disabled={busy || soldOut}
                className="h-12 flex-1 text-[14px] font-bold transition-opacity duration-[180ms] disabled:opacity-40"
                style={{ background: "var(--zesta-primary)", color: "var(--text-on-dark)", borderRadius: "var(--radius-sm)", letterSpacing: "0.04em" }}
              >
                {addLabel}
              </button>
              <FavoriteButton
                productId={product.id}
                size={20}
                className="flex h-12 w-12 flex-none items-center justify-center"
                style={{ border: "1px solid var(--zesta-border)", borderRadius: "var(--radius-sm)" }}
              />
            </div>

            <TrustBox className="mt-4 hidden md:grid" />

            {message && (
              <p className="mt-3 hidden text-sm text-ash md:block">
                {message}
                {message === "Sepete eklendi." && (
                  <button onClick={() => router.push("/sepet")} className="ml-2 text-champagne-300 underline">
                    Sepete git
                  </button>
                )}
              </p>
            )}

            {/* h) Öne çıkan bilgiler */}
            <ul className="mt-6 space-y-2.5">
              {HIGHLIGHTS.map((h) => (
                <li key={h.label} className="flex items-center gap-3 text-[13px] text-ink">
                  <span style={{ color: "var(--zesta-primary)" }}>{h.icon}</span>
                  {h.label}
                </li>
              ))}
            </ul>

            {/* i) Tasarımcı/mağaza kutusu: veri yok, gösterilmez */}
          </div>
        </div>
      </div>

      {/* j) Benzer Ürünler */}
      {relatedItems.length > 0 && (
        <section className="py-6">
          <div className="mx-auto max-w-[1200px] px-4 lg:px-5">
            <ProductStrip title="Benzer Ürünler" href={categorySlug ? `/kategori/${categorySlug}` : undefined} items={relatedItems} />
          </div>
        </section>
      )}

      {/* Satış trendi (mevcut simüle veri) */}
      <section className="pb-6">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-5">
          <div className="p-5" style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border-light)", borderRadius: "var(--radius-sm)" }}>
            <p className="mb-4 text-[15px] font-bold text-ink">Bu Haftaki Satış Trendi</p>
            <WeeklyTrendChart weekly={stats.weekly} />
          </div>
        </div>
      </section>

      {/* k) Sekmeler */}
      <section ref={tabsRef} className="scroll-mt-12 pb-24 md:scroll-mt-[150px] md:pb-10">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-5">
          {/* Desktop/tablet: yapışık sekme çubuğu */}
          <div className="hidden md:block">
            <div className="sticky top-[149px] z-30 flex gap-8" style={{ background: "var(--zesta-bg)", borderBottom: "1px solid var(--zesta-border)" }}>
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className="py-3.5 text-[14px] font-semibold"
                  style={{
                    color: tab === t.key ? "var(--zesta-primary)" : "var(--text-secondary)",
                    borderBottom: tab === t.key ? "2px solid var(--zesta-primary)" : "2px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="max-w-3xl py-6">{TABS.find((t) => t.key === tab)?.content}</div>
          </div>

          {/* Mobil: açılır-kapanır başlıklar */}
          <div className="md:hidden" style={{ borderTop: "1px solid var(--zesta-border-light)" }}>
            {TABS.map((t) => (
              <MobileAccordion key={t.key} title={t.label} open={mobileOpen === t.key} onToggle={() => setMobileOpen((v) => (v === t.key ? null : t.key))}>
                {t.content}
              </MobileAccordion>
            ))}
          </div>

          {/* l) Tasarımcının Diğer Ürünleri: veri yok, gösterilmez */}
        </div>
      </section>

      {/* Mobil sabit alt çubuk */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 md:hidden"
        style={{ background: "var(--zesta-surface)", borderTop: "1px solid var(--zesta-border)", boxShadow: "var(--shadow-md)" }}
      >
        {message && (
          <div className="flex items-center justify-between px-4 py-2 text-[12px]" style={{ background: "var(--primary-50)", color: "var(--zesta-primary)" }}>
            <span>{message}</span>
            {message === "Sepete eklendi." && (
              <Link href="/sepet" className="font-semibold underline">
                Sepete git
              </Link>
            )}
          </div>
        )}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0">
            {product.salePrice && <div className="text-[12px] line-through text-ash">{formatPrice(product.price)}</div>}
            <div className="text-[17px] font-bold" style={{ color: "var(--zesta-primary)" }}>
              {formatPrice(price)}
            </div>
          </div>
          <button
            onClick={addToCart}
            disabled={busy || soldOut}
            className="h-12 flex-1 text-[14px] font-bold disabled:opacity-40"
            style={{ background: "var(--zesta-primary)", color: "var(--text-on-dark)", borderRadius: "var(--radius-sm)" }}
          >
            {addLabel}
          </button>
        </div>
      </div>
    </>
  );
}
