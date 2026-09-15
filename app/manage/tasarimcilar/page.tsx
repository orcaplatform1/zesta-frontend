"use client";

import { useEffect, useState } from "react";
import { api, formatPrice, ApiError } from "@/lib/api";
import type { Product } from "@/lib/types";

interface DesignerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  otherCategory: string | null;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface Designer {
  id: string;
  name: string;
  email: string;
  phone: string;
  commissionPct: number;
  isActive: boolean;
  shipViolationCount: number;
  createdAt: string;
  _count: { products: number };
}

interface PayoutRequest {
  id: string;
  designerId: string;
  amount: string;
  status: "PENDING" | "PAID" | "REJECTED";
  requestedAt: string;
  designer: { name: string; email: string };
}

interface ShippingViolation {
  orderId: string;
  orderNumber: string;
  orderCreatedAt: string;
  designerId: string;
  designerName?: string;
  designerEmail?: string;
  productName: string;
}

const sectionTitleClass = "label-uppercase mb-4";
const btnClass =
  "h-8 rounded-full px-4 text-[11px] font-medium transition-colors duration-[180ms]";

export default function ManageDesignersPage() {
  const [applications, setApplications] = useState<DesignerApplication[] | null>(null);
  const [pendingProducts, setPendingProducts] = useState<Product[] | null>(null);
  const [designers, setDesigners] = useState<Designer[] | null>(null);
  const [payouts, setPayouts] = useState<PayoutRequest[] | null>(null);
  const [violations, setViolations] = useState<ShippingViolation[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function loadAll() {
    api.get<DesignerApplication[]>("/designer-applications/admin").then(setApplications).catch(() => setApplications([]));
    api.get<Product[]>("/designers/admin/pending-products").then(setPendingProducts).catch(() => setPendingProducts([]));
    api.get<Designer[]>("/designers/admin").then(setDesigners).catch(() => setDesigners([]));
    api.get<PayoutRequest[]>("/designers/admin/payouts").then(setPayouts).catch(() => setPayouts([]));
    api.get<ShippingViolation[]>("/designers/admin/shipping-violations").then(setViolations).catch(() => setViolations([]));
  }

  useEffect(loadAll, []);

  async function act(fn: () => Promise<unknown>, successMsg: string) {
    setMessage(null);
    try {
      await fn();
      setMessage(successMsg);
      loadAll();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "İşlem başarısız");
    }
  }

  return (
    <div className="max-w-4xl space-y-14 pb-24">
      <div>
        <h1 className="label-uppercase text-champagne-300 mb-2">Tasarımcı Paneli</h1>
        <h2 className="font-display text-[28px] font-normal text-ink mb-3">Başvurular & Onaylar</h2>
        {message && <p className="text-sm text-champagne-300">{message}</p>}
      </div>

      <section>
        <h3 className={sectionTitleClass}>Bekleyen Başvurular</h3>
        {!applications ? (
          <p className="text-sm text-ash">Yükleniyor...</p>
        ) : applications.filter((a) => a.status === "PENDING").length === 0 ? (
          <p className="text-sm text-dim">Bekleyen başvuru yok.</p>
        ) : (
          <div className="space-y-3">
            {applications
              .filter((a) => a.status === "PENDING")
              .map((a) => (
                <div key={a.id} className="rounded-xs border border-[var(--border-subtle)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink">{a.name}</span>
                    <span className="text-xs text-dim">{new Date(a.createdAt).toLocaleDateString("tr-TR")}</span>
                  </div>
                  <p className="mt-1 text-sm text-smoke">
                    {a.email} · {a.phone}
                  </p>
                  <p className="mt-1 text-sm text-ash">
                    Kategori: {a.category === "diger" ? a.otherCategory : a.category}
                  </p>
                  <p className="mt-2 text-sm text-smoke">{a.message}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => act(() => api.patch(`/designer-applications/admin/${a.id}/approve`), "Başvuru onaylandı")}
                      className={`${btnClass} bg-charcoal-700 text-ivory-50 hover:bg-mist-800`}
                    >
                      ONAYLA
                    </button>
                    <button
                      onClick={() => act(() => api.patch(`/designer-applications/admin/${a.id}/reject`), "Başvuru reddedildi")}
                      className={`${btnClass} border border-[var(--border-subtle)] text-dim hover:text-[var(--status-error)]`}
                    >
                      REDDET
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      <section>
        <h3 className={sectionTitleClass}>Onay Bekleyen Ürünler</h3>
        {!pendingProducts ? (
          <p className="text-sm text-ash">Yükleniyor...</p>
        ) : pendingProducts.length === 0 ? (
          <p className="text-sm text-dim">Onay bekleyen ürün yok.</p>
        ) : (
          <div className="space-y-3">
            {pendingProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-xs border border-[var(--border-subtle)] p-4">
                {p.images[0]?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0].url} alt="" className="h-14 w-14 rounded-xs object-cover flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-ink">{p.name}</p>
                  <p className="text-sm text-smoke">{formatPrice(p.salePrice ?? p.price)}</p>
                </div>
                <button
                  onClick={() => act(() => api.patch(`/designers/admin/pending-products/${p.id}/approve`), "Ürün onaylandı")}
                  className={`${btnClass} bg-charcoal-700 text-ivory-50 hover:bg-mist-800`}
                >
                  ONAYLA
                </button>
                <button
                  onClick={() => act(() => api.patch(`/designers/admin/pending-products/${p.id}/reject`), "Ürün reddedildi")}
                  className={`${btnClass} border border-[var(--border-subtle)] text-dim hover:text-[var(--status-error)]`}
                >
                  REDDET
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className={sectionTitleClass}>Ödeme Talepleri</h3>
        {!payouts ? (
          <p className="text-sm text-ash">Yükleniyor...</p>
        ) : payouts.filter((p) => p.status === "PENDING").length === 0 ? (
          <p className="text-sm text-dim">Bekleyen ödeme talebi yok.</p>
        ) : (
          <div className="space-y-2">
            {payouts
              .filter((p) => p.status === "PENDING")
              .map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xs border border-[var(--border-subtle)] p-4">
                  <div>
                    <p className="font-medium text-ink">{p.designer.name}</p>
                    <p className="text-xs text-dim">{p.designer.email}</p>
                  </div>
                  <span className="text-ink">{formatPrice(p.amount)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => act(() => api.patch(`/designers/admin/payouts/${p.id}/paid`), "Ödeme yapıldı olarak işaretlendi")}
                      className={`${btnClass} bg-charcoal-700 text-ivory-50 hover:bg-mist-800`}
                    >
                      ÖDENDİ İŞARETLE
                    </button>
                    <button
                      onClick={() => act(() => api.patch(`/designers/admin/payouts/${p.id}/reject`), "Talep reddedildi")}
                      className={`${btnClass} border border-[var(--border-subtle)] text-dim hover:text-[var(--status-error)]`}
                    >
                      REDDET
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      <section>
        <h3 className={sectionTitleClass}>Kargolama İhlalleri (7+ gün gecikmiş)</h3>
        {!violations ? (
          <p className="text-sm text-ash">Yükleniyor...</p>
        ) : violations.length === 0 ? (
          <p className="text-sm text-dim">İhlal yok.</p>
        ) : (
          <div className="space-y-2">
            {violations.map((v) => (
              <div key={`${v.orderId}-${v.designerId}`} className="flex items-center justify-between rounded-xs border border-[var(--status-error)] p-4">
                <div>
                  <p className="font-medium text-ink">
                    {v.orderNumber} — {v.productName}
                  </p>
                  <p className="text-xs text-dim">
                    {v.designerName} ({v.designerEmail}) · {new Date(v.orderCreatedAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <button
                  onClick={() => act(() => api.patch(`/designers/admin/${v.designerId}/flag-violation`), "İhlal kaydedildi")}
                  className={`${btnClass} border border-[var(--status-error)] text-[var(--status-error)]`}
                >
                  İHLAL SAY
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className={sectionTitleClass}>Tasarımcılar</h3>
        {!designers ? (
          <p className="text-sm text-ash">Yükleniyor...</p>
        ) : (
          <div className="space-y-2">
            {designers.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xs border border-[var(--border-subtle)] p-4">
                <div>
                  <p className="font-medium text-ink">
                    {d.name} {!d.isActive && <span className="text-[var(--status-error)]">(askıda)</span>}
                  </p>
                  <p className="text-xs text-dim">
                    {d.email} · {d._count.products} ürün · {d.shipViolationCount} ihlal
                  </p>
                </div>
                {d.isActive ? (
                  <button
                    onClick={() => act(() => api.patch(`/designers/admin/${d.id}/suspend`), "Hesap askıya alındı")}
                    className={`${btnClass} border border-[var(--status-error)] text-[var(--status-error)]`}
                  >
                    ASKIYA AL
                  </button>
                ) : (
                  <button
                    onClick={() => act(() => api.patch(`/designers/admin/${d.id}/reactivate`), "Hesap tekrar aktif edildi")}
                    className={`${btnClass} bg-charcoal-700 text-ivory-50 hover:bg-mist-800`}
                  >
                    AKTİF ET
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
