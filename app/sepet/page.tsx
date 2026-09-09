"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, formatPrice } from "@/lib/api";
import type { CartSummary } from "@/lib/types";

export default function CartPage() {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    api.get<CartSummary>("/cart").then(setCart).catch(() => setCart(null));
  }

  useEffect(load, []);

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

  if (!cart) return <div className="mx-auto max-w-3xl px-5 py-24 text-sm text-ash">Yükleniyor...</div>;

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-ash">Sepetiniz boş.</p>
        <Link href="/magaza" className="mt-5 inline-block text-sm text-champagne-300 underline">
          Alışverişe devam et
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-12 py-16 md:py-24">
      <h1 className="font-display text-[32px] md:text-[40px] font-normal text-ink mb-10">Sepet</h1>

      <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
        {cart.items.map((item) => (
          <div key={item.id} className="py-5 flex items-center gap-5">
            <div className="h-20 w-20 bg-stone-100 rounded-xs overflow-hidden flex-shrink-0">
              {item.product.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-medium text-ink">{item.product.name}</div>
              {item.variant && (
                <div className="mt-0.5 text-xs text-ash">
                  {item.variant.name}: {item.variant.value}
                </div>
              )}
              <div className="mt-1 text-sm text-smoke">{formatPrice(item.unitPrice)}</div>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              disabled={busyId === item.id}
              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
              className="w-16 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-2 py-2 text-sm text-ink focus:outline-none focus:border-[var(--border-accent)]"
            />
            <div className="w-24 text-right text-[15px] font-medium text-ink">{formatPrice(item.lineTotal)}</div>
            <button
              onClick={() => removeItem(item.id)}
              disabled={busyId === item.id}
              className="text-sm text-dim hover:text-[var(--status-error)] transition-colors duration-[180ms]"
            >
              Kaldır
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-smoke">Ara Toplam</span>
        <span className="text-[18px] font-medium text-ink">{formatPrice(cart.subtotal)}</span>
      </div>

      <Link
        href="/odeme"
        className="mt-8 flex h-12 items-center justify-center rounded-xs bg-charcoal-700 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
        style={{ letterSpacing: "0.1em" }}
      >
        ÖDEMEYE GEÇ
      </Link>
    </div>
  );
}
