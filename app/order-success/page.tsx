"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, formatPrice } from "@/lib/api";
import type { Order } from "@/lib/types";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-4 py-16 text-neutral-500">Yükleniyor...</div>}>
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

  if (order === undefined) return <div className="mx-auto max-w-xl px-4 py-16 text-neutral-500">Yükleniyor...</div>;

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p>Sipariş bulunamadı.</p>
        <Link href="/shop" className="mt-4 inline-block underline text-sm">
          Alışverişe devam et
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Siparişiniz Alındı 🎉</h1>
      <p className="mt-2 text-neutral-600">Sipariş No: {order.orderNumber}</p>

      <div className="mt-8 text-left border border-neutral-200 rounded-lg divide-y divide-neutral-200">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between px-4 py-3 text-sm">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatPrice(item.totalPrice)}</span>
          </div>
        ))}
        <div className="flex justify-between px-4 py-3 font-semibold">
          <span>Toplam</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <Link href="/shop" className="mt-8 inline-block underline text-sm">
        Alışverişe devam et
      </Link>
    </div>
  );
}
