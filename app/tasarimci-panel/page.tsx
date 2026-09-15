"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, formatPrice } from "@/lib/api";
import { designerApi, type DesignerMe, type DesignerStats, type PayoutRequest } from "@/lib/designer-api";
import type { Category, Product } from "@/lib/types";
import { Field, ImageUploadField, manageInputClass as inputClass, manageTextareaClass as textareaClass } from "@/components/admin/ManageFormControls";
import { DesignerTermsButton } from "@/components/DesignerTermsModal";

const APPROVAL_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Onay Bekliyor", color: "var(--champagne-300)" },
  APPROVED: { label: "Yayında", color: "var(--zesta-green)" },
  REJECTED: { label: "Reddedildi", color: "var(--status-error)" },
};

const PAYOUT_LABELS: Record<string, string> = { PENDING: "Bekliyor", PAID: "Ödendi", REJECTED: "Reddedildi" };

const emptyProductForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  salePrice: "",
  stock: "",
  categoryId: "",
  productionTime: "",
  imageUrl: "",
};

export default function DesignerPanelPage() {
  const router = useRouter();
  const [me, setMe] = useState<DesignerMe | null | undefined>(undefined);
  const [stats, setStats] = useState<DesignerStats | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [payouts, setPayouts] = useState<PayoutRequest[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [productBusy, setProductBusy] = useState(false);
  const [productMessage, setProductMessage] = useState<string | null>(null);

  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutBusy, setPayoutBusy] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState<string | null>(null);

  function loadAll() {
    designerApi.me().then(setMe).catch(() => setMe(null));
    designerApi.stats().then(setStats).catch(() => {});
    designerApi.myProducts().then(setProducts).catch(() => setProducts([]));
    designerApi.myPayouts().then(setPayouts).catch(() => setPayouts([]));
  }

  useEffect(() => {
    loadAll();
    api.get<Category[]>("/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  async function submitProduct(e: FormEvent) {
    e.preventDefault();
    setProductBusy(true);
    setProductMessage(null);
    try {
      await designerApi.submitProduct({
        name: productForm.name,
        slug: productForm.slug,
        description: productForm.description || undefined,
        price: Number(productForm.price),
        salePrice: productForm.salePrice ? Number(productForm.salePrice) : undefined,
        stock: productForm.stock ? Number(productForm.stock) : undefined,
        categoryId: productForm.categoryId || undefined,
        productionTime: productForm.productionTime || undefined,
        images: productForm.imageUrl ? [{ url: productForm.imageUrl }] : undefined,
      });
      setProductForm(emptyProductForm);
      setProductMessage("Ürününüz onay için gönderildi. Admin onayladıktan sonra mağazada yayınlanır.");
      loadAll();
    } catch (err) {
      setProductMessage(err instanceof ApiError ? err.message : "Ürün gönderilemedi");
    } finally {
      setProductBusy(false);
    }
  }

  async function submitPayout(e: FormEvent) {
    e.preventDefault();
    setPayoutBusy(true);
    setPayoutMessage(null);
    try {
      await designerApi.requestPayout(Number(payoutAmount));
      setPayoutAmount("");
      setPayoutMessage("Ödeme talebiniz alındı.");
      loadAll();
    } catch (err) {
      setPayoutMessage(err instanceof ApiError ? err.message : "Talep gönderilemedi");
    } finally {
      setPayoutBusy(false);
    }
  }

  async function logout() {
    await designerApi.logout();
    router.push("/tasarimci-giris");
  }

  if (me === undefined) return <div className="mx-auto max-w-3xl px-5 py-24 text-sm text-ash">Yükleniyor...</div>;
  if (me === null) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-sm text-ash">Bu sayfayı görüntülemek için tasarımcı hesabınızla giriş yapmalısınız.</p>
        <button
          onClick={() => router.push("/tasarimci-giris")}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-charcoal-700 px-6 text-[12px] font-medium text-ivory-50"
          style={{ letterSpacing: "0.1em" }}
        >
          GİRİŞ YAP
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 md:px-12 py-16 md:py-20 space-y-14">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow-on-light">Zesta Tasarımcı Paneli</p>
          <h1 className="mt-2 font-display text-[28px] font-normal text-ink">Merhaba, {me.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <DesignerTermsButton />
          <button onClick={logout} className="text-sm text-dim hover:text-ink transition-colors duration-[180ms]">
            Çıkış yap
          </button>
        </div>
      </div>

      {!me.isActive && (
        <div className="rounded-sm border border-[var(--status-error)] p-4 text-sm text-[var(--status-error)]">
          Hesabınız şu anda askıya alınmış durumda. Yeni ürün ekleyemez veya ödeme talep edemezsiniz. Detaylar için
          bizimle iletişime geçin.
        </div>
      )}
      {me.shipViolationCount > 0 && (
        <div className="rounded-sm border border-[var(--border-accent)] p-4 text-sm text-ash">
          Kargolama süresini {me.shipViolationCount} kez aştınız. Siparişleri en geç 7 gün içinde kargoya vermezseniz
          hesabınız askıya alınabilir.
        </div>
      )}

      {stats && (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Toplam Satış", value: formatPrice(stats.totalSalesGross) },
            { label: "Çekilebilir Bakiye", value: formatPrice(stats.availableBalance) },
            { label: "Onay Bekleyen Tutar", value: formatPrice(stats.pendingClearanceGross) },
            { label: "Komisyon Oranı", value: `%${stats.commissionPct}` },
          ].map((s) => (
            <div key={s.label} className="rounded-sm border border-[var(--border-subtle)] p-4">
              <p className="text-[11px] text-dim uppercase" style={{ letterSpacing: "0.06em" }}>
                {s.label}
              </p>
              <p className="mt-1.5 font-display text-[20px] text-ink">{s.value}</p>
            </div>
          ))}
        </section>
      )}

      <section className="border-t border-[var(--border-subtle)] pt-10">
        <h2 className="label-uppercase mb-1">Ödeme Talebi</h2>
        <p className="text-xs text-dim mb-4">
          Çekilebilir bakiyeniz 1.000 TL&apos;yi bulduğunda ödeme talep edebilirsiniz.
        </p>
        <form onSubmit={submitPayout} className="flex flex-wrap items-end gap-3">
          <Field label="Tutar (TL)">
            <input
              type="number"
              min={1000}
              max={stats?.availableBalance ?? undefined}
              required
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              className={inputClass}
              style={{ width: 180 }}
            />
          </Field>
          <button
            type="submit"
            disabled={payoutBusy || !me.isActive || !stats || stats.availableBalance < 1000}
            className="h-11 rounded-full bg-charcoal-700 px-6 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
            style={{ letterSpacing: "0.1em" }}
          >
            {payoutBusy ? "GÖNDERİLİYOR..." : "ÖDEME TALEP ET"}
          </button>
        </form>
        {payoutMessage && <p className="mt-3 text-sm text-champagne-300">{payoutMessage}</p>}

        {payouts && payouts.length > 0 && (
          <div className="mt-6 space-y-2">
            {payouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm border-b border-[var(--border-subtle)] pb-2">
                <span className="text-smoke">{formatPrice(p.amount)}</span>
                <span className="text-ash">{new Date(p.requestedAt).toLocaleDateString("tr-TR")}</span>
                <span className="text-ink">{PAYOUT_LABELS[p.status] ?? p.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-[var(--border-subtle)] pt-10">
        <h2 className="label-uppercase mb-4">Yeni Ürün Ekle</h2>
        <form onSubmit={submitProduct} className="space-y-3 max-w-xl">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ürün Adı">
              <input
                required
                value={productForm.name}
                onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                required
                placeholder="orn-el-yapimi-seramik-vazo"
                value={productForm.slug}
                onChange={(e) => setProductForm((f) => ({ ...f, slug: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Açıklama">
            <textarea
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
              className={textareaClass}
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Fiyat (TL)">
              <input
                type="number"
                min={0}
                required
                value={productForm.price}
                onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="İndirimli Fiyat (opsiyonel)">
              <input
                type="number"
                min={0}
                value={productForm.salePrice}
                onChange={(e) => setProductForm((f) => ({ ...f, salePrice: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Stok">
              <input
                type="number"
                min={0}
                value={productForm.stock}
                onChange={(e) => setProductForm((f) => ({ ...f, stock: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kategori">
              <select
                value={productForm.categoryId}
                onChange={(e) => setProductForm((f) => ({ ...f, categoryId: e.target.value }))}
                className={inputClass}
              >
                <option value="">Seçiniz</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Üretim Süresi">
              <input
                placeholder="Sipariş üzerine 3-5 iş günü"
                value={productForm.productionTime}
                onChange={(e) => setProductForm((f) => ({ ...f, productionTime: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>
          <ImageUploadField
            label="Ürün Görseli"
            value={productForm.imageUrl}
            onChange={(url) => setProductForm((f) => ({ ...f, imageUrl: url }))}
            endpoint="/api/media/designer/upload"
          />
          {productMessage && <p className="text-sm text-champagne-300">{productMessage}</p>}
          <button
            type="submit"
            disabled={productBusy || !me.isActive}
            className="h-11 rounded-full bg-charcoal-700 px-6 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
            style={{ letterSpacing: "0.1em" }}
          >
            {productBusy ? "GÖNDERİLİYOR..." : "ÜRÜNÜ ONAYA GÖNDER"}
          </button>
        </form>
      </section>

      <section className="border-t border-[var(--border-subtle)] pt-10">
        <h2 className="label-uppercase mb-4">Ürünlerim</h2>
        {!products ? (
          <p className="text-sm text-ash">Yükleniyor...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-ash">Henüz ürün eklemediniz.</p>
        ) : (
          <div className="space-y-2">
            {products.map((p) => {
              const status = APPROVAL_LABELS[p.approvalStatus ?? "PENDING"] ?? APPROVAL_LABELS.PENDING;
              return (
                <div key={p.id} className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-sm">
                  <span className="text-ink">{p.name}</span>
                  <span className="text-smoke">{formatPrice(p.salePrice ?? p.price)}</span>
                  <span style={{ color: status.color }}>{status.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
