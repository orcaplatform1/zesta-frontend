"use client";

import { useState, type FormEvent } from "react";
import { api, formatPrice, ApiError } from "@/lib/api";
import type { Order } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekliyor",
  PAID: "Ödendi",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoya Verildi",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal",
  REFUNDED: "İade",
};

const STEPS = ["PAID", "PREPARING", "SHIPPED", "DELIVERED"];

const inputClass =
  "w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOrder(null);
    try {
      const result = await api.get<Order>(
        `/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`,
      );
      setOrder(result);
    } catch (err) {
      setError(err instanceof ApiError ? "Sipariş numarası veya e-posta hatalı. Lütfen kontrol edip tekrar deneyin." : "Bir hata oluştu");
    } finally {
      setBusy(false);
    }
  }

  const stepIndex = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div>
      <section className="grain relative py-20 md:py-24 text-center overflow-hidden bg-warm-ivory">
        <div className="mx-auto max-w-xl px-5">
          <p className="eyebrow-on-light">Zesta</p>
          <h1
            className="mt-6 font-display font-normal text-ink text-[34px] md:text-[48px]"
            style={{ lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            Sipariş Takip
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-[color:var(--text-on-light-secondary)]">
            Sipariş numaranız ve siparişte kullandığınız e-posta adresinizle, siparişinizin hazırlık ve kargo
            durumunu buradan takip edebilirsiniz.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-md px-5">
          <form onSubmit={submit} className="space-y-3">
            <input
              required
              placeholder="Sipariş Numarası"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className={inputClass}
            />
            <input
              type="email"
              required
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full h-12 rounded-full bg-charcoal-700 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
              style={{ letterSpacing: "0.1em" }}
            >
              {busy ? "ARANIYOR..." : "SİPARİŞİ SORGULA"}
            </button>
          </form>

          {order && (
            <div className="mt-10 border border-[var(--border-subtle)] rounded-sm bg-onyx-700 p-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">{order.orderNumber}</span>
                <span className="text-[13px] text-champagne-300">{STATUS_LABELS[order.status] ?? order.status}</span>
              </div>

              {stepIndex >= 0 && (
                <div className="mt-6 flex items-center">
                  {STEPS.map((step, i) => (
                    <div key={step} className="flex flex-1 items-center last:flex-none">
                      <div
                        className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-[10px] font-medium"
                        style={{
                          background: i <= stepIndex ? "var(--champagne-300)" : "var(--border-subtle)",
                          color: i <= stepIndex ? "var(--text-on-dark)" : "var(--text-secondary)",
                        }}
                      >
                        {i + 1}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className="mx-1.5 h-[1.5px] flex-1"
                          style={{ background: i < stepIndex ? "var(--champagne-300)" : "var(--border-subtle)" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 space-y-1.5 text-sm text-smoke">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-[var(--border-subtle)] pt-4 flex justify-between text-sm font-medium text-ink">
                <span>Toplam</span>
                <span>{formatPrice(order.total)}</span>
              </div>

              {order.shipment?.trackingNumber && (
                <div className="mt-4 text-xs text-ash">
                  Kargo: {order.shipment.carrier} — {order.shipment.trackingNumber}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
