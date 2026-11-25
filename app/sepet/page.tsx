"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, formatPrice } from "@/lib/api";
import type { CartSummary, Product, ProductListResponse } from "@/lib/types";
import { discountPercent } from "@/lib/use-ratings";
import { ArrowLeftIcon, BagIcon, ChevronIcon, TagIcon, TrashIcon, TruckIcon, UserIcon } from "@/components/HeaderIcons";

const COUPON_SESSION_KEY = "zesta_coupon_code";
const FREE_SHIPPING_LIMIT = 2500;

interface CouponResult {
  code: string;
  discountAmount: number;
  discountType: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Yalnız görünüm tarafı durumları
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [recs, setRecs] = useState<Product[]>([]);
  const [recsOpen, setRecsOpen] = useState(true);
  const [recBusy, setRecBusy] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function load() {
    api.get<CartSummary>("/cart").then(setCart).catch(() => setCart(null));
  }

  useEffect(() => {
    load();
    api
      .get("/auth/me")
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
    // Daha önce uygulanan kuponu session'dan geri yükle
    try {
      const saved = sessionStorage.getItem(COUPON_SESSION_KEY);
      if (saved) setCouponInput(saved);
    } catch {}
  }, []);

  // Sepetteki ürünlerin fiyat / kategori / hazırlık süresi bilgisi (mevcut /products/:slug ucu)
  const slugs = useMemo(() => Array.from(new Set((cart?.items ?? []).map((i) => i.product.slug))), [cart]);
  useEffect(() => {
    const missing = slugs.filter((s) => !products[s]);
    if (missing.length === 0) return;
    Promise.all(missing.map((s) => api.get<Product>(`/products/${s}`).catch(() => null))).then((list) => {
      setProducts((prev) => {
        const next = { ...prev };
        list.forEach((p) => {
          if (p) next[p.slug] = p;
        });
        return next;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugs]);

  // "Sana Özel Ürünler": sepetteki ürünlerin kategorilerinden, sepette olmayanlar
  const categoryKey = useMemo(
    () =>
      Array.from(new Set(slugs.map((s) => products[s]?.category?.slug).filter((c): c is string => !!c)))
        .sort()
        .join(","),
    [slugs, products],
  );
  useEffect(() => {
    if (!categoryKey) {
      setRecs([]);
      return;
    }
    Promise.all(
      categoryKey.split(",").map((c) => api.get<ProductListResponse>(`/products?category=${c}&pageSize=12`).catch(() => null)),
    ).then((lists) => {
      const seen = new Set<string>();
      const all = lists.flatMap((l) => l?.items ?? []).filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
      setRecs(all);
    });
  }, [categoryKey]);

  async function applyCoupon() {
    const code = couponInput.trim();
    if (!code || !cart) return;
    setCouponError("");
    setCouponBusy(true);
    try {
      const res = await api.get<CouponResult>(`/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${cart.subtotal}`);
      setCouponApplied(res);
      try {
        sessionStorage.setItem(COUPON_SESSION_KEY, code);
      } catch {}
    } catch (err) {
      setCouponApplied(null);
      setCouponError(err instanceof Error ? err.message : "Kupon geçersiz");
      try {
        sessionStorage.removeItem(COUPON_SESSION_KEY);
      } catch {}
    } finally {
      setCouponBusy(false);
    }
  }

  function removeCoupon() {
    setCouponApplied(null);
    setCouponInput("");
    setCouponError("");
    try {
      sessionStorage.removeItem(COUPON_SESSION_KEY);
    } catch {}
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;
    setBusyId(itemId);
    try {
      const updated = await api.patch<CartSummary>(`/cart/items/${itemId}`, { quantity });
      setCart(updated);
    } finally {
      setBusyId(null);
    }
  }

  async function removeItem(itemId: string) {
    setBusyId(itemId);
    try {
      const updated = await api.delete<CartSummary>(`/cart/items/${itemId}`);
      setCart(updated);
    } finally {
      setBusyId(null);
    }
  }

  // Öneri kartındaki "Sepete Ekle": ürün sayfasındaki mevcut ekleme çağrısının aynısı
  async function addRec(p: Product) {
    setRecBusy(p.id);
    try {
      await api.post("/cart/items", { productId: p.id, variantId: p.variants[0]?.id, quantity: 1 });
      load();
    } catch {
      // sessizce geç
    } finally {
      setRecBusy(null);
    }
  }

  const items = cart?.items ?? [];
  const cartProductIds = new Set(items.map((i) => i.productId));
  const recList = recs
    .filter((p) => !cartProductIds.has(p.id))
    .sort((a, b) => (discountPercent(b.price, b.salePrice) ?? 0) - (discountPercent(a.price, a.salePrice) ?? 0))
    .slice(0, 10);

  const savingOf = (slug: string, qty: number) => {
    const p = products[slug];
    if (!p?.salePrice) return 0;
    return Math.max(0, (Number(p.price) - Number(p.salePrice)) * qty);
  };

  const lineSum = cart?.subtotal ?? 0;
  const savings = items.reduce((s, i) => s + savingOf(i.product.slug, i.quantity), 0);
  const couponDiscount = couponApplied?.discountAmount ?? 0;
  const productsTotal = lineSum + savings;
  const discountTotal = savings + couponDiscount;
  const grandTotal = Math.max(lineSum - couponDiscount, 0);
  const freeShipping = lineSum >= FREE_SHIPPING_LIMIT;
  const remaining = FREE_SHIPPING_LIMIT - lineSum;

  const title = `Sepetim (${items.length} Ürün)`;

  const mobileTopBar = (
    <div
      className="sticky top-9 z-40 flex h-12 items-center px-2 md:hidden"
      style={{ background: "var(--zesta-surface)", borderBottom: "1px solid var(--zesta-border)" }}
    >
      <button type="button" onClick={() => router.back()} aria-label="Geri" className="flex h-10 w-10 items-center justify-center text-ink">
        <ArrowLeftIcon />
      </button>
      <p className="flex-1 text-center text-[15px] font-bold text-ink">{title}</p>
      <span className="w-10" />
    </div>
  );

  if (!cart)
    return (
      <>
        {mobileTopBar}
        <div className="mx-auto max-w-[1200px] px-4 py-24 text-sm text-ash">Yükleniyor...</div>
      </>
    );

  if (items.length === 0) {
    return (
      <>
        {mobileTopBar}
        <div className="mx-auto flex max-w-[1200px] flex-col items-center px-4 py-20 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "var(--primary-50)", color: "var(--zesta-primary)" }}>
            <BagIcon size={34} />
          </span>
          <p className="mt-5 text-[18px] font-bold text-ink">Sepetin şu an boş</p>
          <Link
            href="/magaza"
            className="mt-6 inline-flex h-12 items-center justify-center px-8 text-[14px] font-bold"
            style={{ background: "var(--zesta-primary)", color: "var(--text-on-dark)", borderRadius: "var(--radius-sm)" }}
          >
            Alışverişe Başla
          </Link>
        </div>
      </>
    );
  }

  const summaryRows = (
    <div className="space-y-2.5 text-[14px]">
      <div className="flex justify-between">
        <span className="text-smoke">Ürünler Toplamı</span>
        <span className="text-ink">{formatPrice(productsTotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-smoke">Kargo</span>
        <span style={{ color: freeShipping ? "var(--status-success)" : "var(--text-secondary)" }}>
          {freeShipping ? "Bedava" : "Ödeme adımında hesaplanır"}
        </span>
      </div>
      {discountTotal > 0 && (
        <div className="flex justify-between">
          <span className="text-smoke">İndirim{couponApplied ? ` (${couponApplied.code})` : ""}</span>
          <span style={{ color: "var(--status-success)" }}>-{formatPrice(discountTotal)}</span>
        </div>
      )}
      <div className="flex justify-between pt-2.5" style={{ borderTop: "1px solid var(--zesta-border-light)" }}>
        <span className="font-semibold text-ink">Genel Toplam</span>
        <span className="text-[18px] font-bold" style={{ color: "var(--zesta-primary)" }}>
          {formatPrice(grandTotal)}
        </span>
      </div>
    </div>
  );

  const couponBox = (
    <div className="p-4" style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border-light)", borderRadius: "var(--radius-sm)" }}>
      <p className="label-uppercase mb-3 text-xs">İndirim Kodu</p>
      {couponApplied ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink">{couponApplied.code}</span>
            <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: "var(--zesta-primary)", color: "var(--text-on-dark)" }}>
              %20 İndirim
            </span>
          </div>
          <button onClick={removeCoupon} className="text-xs text-dim transition-colors duration-[180ms] hover:text-[var(--status-error)]">
            Kaldır
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={couponInput}
            onChange={(e) => {
              setCouponInput(e.target.value);
              setCouponError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
            placeholder="Kupon kodunuzu girin"
            className="h-10 min-w-0 flex-1 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3 text-sm text-ink placeholder:text-dim focus:border-[var(--border-accent)] focus:outline-none"
          />
          <button
            onClick={applyCoupon}
            disabled={couponBusy || !couponInput.trim()}
            className="h-10 rounded-xs border border-[var(--border-subtle)] px-4 text-[11px] font-medium text-smoke transition-colors duration-[180ms] hover:border-[var(--border-accent)] hover:text-ink disabled:opacity-40"
            style={{ letterSpacing: "0.08em" }}
          >
            {couponBusy ? "..." : "UYGULA"}
          </button>
        </div>
      )}
      {couponError && (
        <p className="mt-2 text-xs" style={{ color: "var(--status-error)" }}>
          {couponError}
        </p>
      )}
    </div>
  );

  const confirmButton = (cls: string) => (
    <Link
      href="/odeme"
      className={`flex h-12 items-center justify-center text-[14px] font-bold ${cls}`}
      style={{ background: "var(--zesta-primary)", color: "var(--text-on-dark)", borderRadius: "var(--radius-sm)" }}
    >
      Sepeti Onayla →
    </Link>
  );

  return (
    <>
      {mobileTopBar}

      <div className="mx-auto max-w-[1200px] px-4 pb-32 pt-4 md:pb-10 md:pt-6 lg:px-5">
        <h1 className="mb-5 hidden text-[22px] font-bold text-ink md:block">{title}</h1>

        <div className="lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
          <div className="min-w-0 space-y-3 lg:pr-6">
            {/* b) Giriş bandı */}
            {loggedIn === false && (
              <div className="flex items-center gap-3 px-4 py-3 text-[13px]" style={{ background: "var(--status-warning-bg)", borderRadius: "var(--radius-sm)", color: "var(--zesta-text)" }}>
                <span style={{ color: "var(--status-warning)" }}>
                  <UserIcon size={20} />
                </span>
                <p>
                  Alışverişini daha hızlı tamamlamak için{" "}
                  <Link href="/hesap" className="font-semibold underline">
                    Giriş Yap
                  </Link>
                </p>
              </div>
            )}

            {/* c) Sana Özel Ürünler */}
            {recList.length > 0 && (
              <div className="min-w-0 overflow-hidden p-4" style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border-light)", borderRadius: "var(--radius-sm)" }}>
                <button type="button" onClick={() => setRecsOpen((v) => !v)} aria-expanded={recsOpen} className="flex w-full items-center justify-between gap-3 text-left">
                  <div>
                    <p className="text-[15px] font-bold text-ink">Sana Özel Ürünler!</p>
                    <p className="mt-0.5 text-[12px] text-ash">İlgini çekebilecek diğer ürünleri burada görebilirsin.</p>
                  </div>
                  <span className="text-ink">
                    <ChevronIcon dir={recsOpen ? "up" : "down"} />
                  </span>
                </button>
                {recsOpen && (
                  <div className="carousel-scroll -mx-4 mt-4 flex min-w-0 gap-3 overflow-x-auto px-4 pt-3">
                    {recList.map((p, idx) => {
                      const pct = discountPercent(p.price, p.salePrice);
                      return (
                        <div
                          key={p.id}
                          className="relative flex w-[260px] flex-none gap-3 p-2.5"
                          style={{ border: "1px solid var(--zesta-border-light)", borderRadius: "var(--radius-sm)", background: "var(--zesta-surface)" }}
                        >
                          {idx === 0 && pct !== null && (
                            <span
                              className="absolute -top-2.5 left-2.5 rounded-full px-2 py-0.5 text-[10px] font-bold"
                              style={{ background: "var(--zesta-primary)", color: "var(--text-on-dark)" }}
                            >
                              En İyi Fırsat!
                            </span>
                          )}
                          <Link href={`/urun/${p.slug}`} className="h-[84px] w-[72px] flex-none overflow-hidden" style={{ background: "var(--stone-100)", borderRadius: "var(--radius-xs)" }}>
                            {p.images[0] && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
                            )}
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <Link href={`/urun/${p.slug}`} className="line-clamp-2 text-[12px] leading-snug text-ink">
                              {p.name}
                            </Link>
                            <div className="mt-1 flex items-baseline gap-1.5">
                              {p.salePrice && <span className="text-[11px] line-through text-ash">{formatPrice(p.price)}</span>}
                              <span className="text-[13px] font-bold" style={{ color: "var(--zesta-primary)" }}>
                                {formatPrice(p.salePrice ?? p.price)}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => addRec(p)}
                              disabled={recBusy === p.id}
                              className="mt-auto h-8 text-[12px] font-semibold disabled:opacity-40"
                              style={{ border: "1px solid var(--zesta-primary)", color: "var(--zesta-primary)", borderRadius: "var(--radius-xs)" }}
                            >
                              {recBusy === p.id ? "Ekleniyor..." : "Sepete Ekle"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* d) Kargo ilerleme bandı */}
            {freeShipping ? (
              <div className="flex items-center gap-3 px-4 py-3 text-[13px] font-semibold" style={{ background: "var(--status-success-bg)", color: "var(--status-success)", borderRadius: "var(--radius-sm)" }}>
                <TruckIcon size={20} />
                Kargo bedava!
              </div>
            ) : (
              <Link
                href="/magaza"
                className="flex items-center gap-3 px-4 py-3 text-[13px]"
                style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border-light)", color: "var(--zesta-text)", borderRadius: "var(--radius-sm)" }}
              >
                <span style={{ color: "var(--zesta-primary)" }}>
                  <TruckIcon size={20} />
                </span>
                <span className="flex-1">
                  Kargonun bedava olması için <strong>{formatPrice(remaining)}</strong> daha ürün ekle
                </span>
                <ChevronIcon size={14} />
              </Link>
            )}

            {/* e) Ürün satırları */}
            <div style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border-light)", borderRadius: "var(--radius-sm)" }}>
              {items.map((item) => {
                const p = products[item.product.slug];
                const saving = savingOf(item.product.slug, item.quantity);
                const maxQty = Math.max(10, item.quantity);
                return (
                  <div key={item.id} className="flex gap-3 px-4 py-4" style={{ borderBottom: "1px solid var(--zesta-border-light)" }}>
                    <Link href={`/urun/${item.product.slug}`} className="h-[88px] w-[72px] flex-none overflow-hidden" style={{ background: "var(--stone-100)", borderRadius: "var(--radius-xs)" }}>
                      {item.product.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start gap-2">
                        <Link href={`/urun/${item.product.slug}`} className="min-w-0 flex-1 truncate text-[13px] text-ink">
                          {item.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={busyId === item.id}
                          aria-label="Ürünü sil"
                          className="flex-none text-ash transition-colors duration-[180ms] hover:text-[var(--status-error)]"
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>
                      {item.variant && (
                        <p className="mt-0.5 text-[11px] text-ash">
                          {item.variant.name}: {item.variant.value}
                        </p>
                      )}
                      {p?.productionTime && (
                        <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "var(--status-success)" }}>
                          <TruckIcon size={14} />
                          Tahmini hazırlık süresi: {p.productionTime}
                        </p>
                      )}
                      <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                        <select
                          value={item.quantity}
                          disabled={busyId === item.id}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          aria-label="Adet"
                          className="h-8 px-2 text-[12px] outline-none"
                          style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border)", borderRadius: "var(--radius-xs)", color: "var(--zesta-text)" }}
                        >
                          {Array.from({ length: maxQty }, (_, n) => n + 1).map((n) => (
                            <option key={n} value={n}>
                              {n} ad.
                            </option>
                          ))}
                        </select>
                        <div className="text-right">
                          {saving > 0 && (
                            <div className="text-[11px] line-through text-ash">{formatPrice(item.lineTotal + saving)}</div>
                          )}
                          <div className="text-[15px] font-bold" style={{ color: "var(--zesta-primary)" }}>
                            {formatPrice(item.lineTotal)}
                          </div>
                        </div>
                      </div>
                      {saving > 0 && (
                        <span
                          className="mt-2 self-end rounded-[var(--radius-xs)] px-2 py-0.5 text-[11px] font-semibold"
                          style={{ background: "var(--status-success-bg)", color: "var(--status-success)" }}
                        >
                          Kazancın: {formatPrice(saving)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* f) Toplam kazanç bandı */}
            {savings > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 text-[13px] font-semibold" style={{ background: "var(--status-success-bg)", color: "var(--status-success)", borderRadius: "var(--radius-sm)" }}>
                <TagIcon size={18} />
                {formatPrice(savings)} kazancın var!
              </div>
            )}

            {/* Mevcut indirim kodu alanı (mobil) */}
            <div className="md:hidden">{couponBox}</div>
          </div>

          {/* Desktop: yapışık Sipariş Özeti */}
          <aside className="hidden min-w-0 md:mt-4 md:block lg:mt-0">
            <div className="space-y-3 lg:sticky lg:top-[170px]">
              <div className="p-5" style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border-light)", borderRadius: "var(--radius-sm)" }}>
                <p className="mb-4 text-[16px] font-bold text-ink">Sipariş Özeti</p>
                {summaryRows}
              </div>
              {confirmButton("w-full")}
              {couponBox}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobil: alttan açılan sipariş özeti */}
      {sheetOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button aria-label="Kapat" onClick={() => setSheetOpen(false)} className="absolute inset-0 bg-black/40" />
          <div
            className="absolute inset-x-0 bottom-[72px] p-5"
            style={{ background: "var(--zesta-surface)", borderTopLeftRadius: "var(--radius-lg)", borderTopRightRadius: "var(--radius-lg)" }}
          >
            <p className="mb-4 text-[16px] font-bold text-ink">Sipariş Özeti</p>
            {summaryRows}
          </div>
        </div>
      )}

      {/* g) Mobil sabit alt çubuk */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex h-[72px] items-center gap-3 px-4 md:hidden"
        style={{ background: "var(--zesta-surface)", borderTop: "1px solid var(--zesta-border)", boxShadow: "var(--shadow-md)" }}
      >
        <button type="button" onClick={() => setSheetOpen((v) => !v)} aria-expanded={sheetOpen} className="flex items-center gap-2 text-left">
          <span className="text-ink">
            <ChevronIcon dir={sheetOpen ? "up" : "down"} size={16} />
          </span>
          <span>
            <span className="block text-[11px] text-ash">Toplam</span>
            <span className="block text-[17px] font-bold" style={{ color: "var(--zesta-primary)" }}>
              {formatPrice(grandTotal)}
            </span>
          </span>
        </button>
        {confirmButton("flex-1")}
      </div>
    </>
  );
}
