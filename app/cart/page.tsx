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

  if (!cart) return <div className="mx-auto max-w-3xl px-4 py-10 text-neutral-500">Yükleniyor...</div>;

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-neutral-500">Sepetiniz boş.</p>
        <Link href="/shop" className="mt-4 inline-block underline text-sm">
          Alışverişe devam et
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Sepet</h1>

      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {cart.items.map((item) => (
          <div key={item.id} className="py-4 flex items-center gap-4">
            <div className="h-20 w-20 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
              {item.product.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{item.product.name}</div>
              {item.variant && (
                <div className="text-xs text-neutral-500">
                  {item.variant.name}: {item.variant.value}
                </div>
              )}
              <div className="text-sm mt-1">{formatPrice(item.unitPrice)}</div>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              disabled={busyId === item.id}
              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
              className="w-16 border border-neutral-300 rounded-md px-2 py-1 text-sm"
            />
            <div className="w-24 text-right text-sm font-medium">{formatPrice(item.lineTotal)}</div>
            <button
              onClick={() => removeItem(item.id)}
              disabled={busyId === item.id}
              className="text-neutral-400 hover:text-red-600 text-sm"
            >
              Kaldır
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-neutral-600">Ara Toplam</span>
        <span className="text-lg font-semibold">{formatPrice(cart.subtotal)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block text-center rounded-full bg-neutral-900 text-white px-6 py-3 text-sm font-medium hover:bg-neutral-800"
      >
        Ödemeye Geç
      </Link>
    </div>
  );
}
