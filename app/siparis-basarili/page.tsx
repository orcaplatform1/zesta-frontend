"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, formatPrice } from "@/lib/api";
import type { Order } from "@/lib/types";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-5 py-24 text-sm text-ash">Yükleniyor...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("orderNumber");
  const email = params.get("email");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!orderNumber || !email) {
      setOrder(null);
      return;
    }
    api
      .get<Order>(`/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [orderNumber, email]);

  if (order === undefined) return <div className="mx-auto max-w-xl px-5 py-24 text-sm text-ash">Yükleniyor...</div>;

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="text-smoke">Sipariş bulunamadı.</p>
        <Link href="/magaza" className="mt-5 inline-block text-sm text-champagne-300 underline">
          Alışverişe devam et
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="label-uppercase text-champagne-300">Teşekkürler</p>
      <h1 className="mt-3 font-display text-[32px] md:text-[40px] font-normal text-ink">Siparişiniz Alındı</h1>
      <p className="mt-3 text-smoke">Sipariş No: {order.orderNumber}</p>

      <div className="mt-10 text-left border border-[var(--border-subtle)] rounded-sm bg-onyx-700 divide-y divide-[var(--border-subtle)]">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between px-5 py-3.5 text-sm text-smoke">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span className="text-ink">{formatPrice(item.totalPrice)}</span>
          </div>
        ))}
        <div className="flex justify-between px-5 py-4 text-[15px] font-medium">
          <span className="text-ink">Toplam</span>
          <span className="text-ink">{formatPrice(order.total)}</span>
        </div>
      </div>

      <Link href="/magaza" className="mt-10 inline-block text-sm text-champagne-300 underline">
        Alışverişe devam et
      </Link>
    </div>
  );
}
