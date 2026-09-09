"use client";

import { useEffect, useState } from "react";
import { formatPrice, api } from "@/lib/api";
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

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    api
      .get<Order[]>("/orders/mine")
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-12 py-16 md:py-24">
      <h1 className="font-display text-[32px] font-normal text-ink mb-10">Siparişlerim</h1>
      {!orders ? (
        <p className="text-sm text-ash">Yükleniyor...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-ash">Henüz siparişiniz yok.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border border-[var(--border-subtle)] rounded-sm bg-onyx-700 p-5">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-ink">{order.orderNumber}</span>
                <span className="text-champagne-300">{STATUS_LABELS[order.status] ?? order.status}</span>
              </div>
              <div className="mt-1.5 text-sm text-smoke">{formatPrice(order.total)}</div>
              {order.shipment?.trackingNumber && (
                <div className="mt-1.5 text-xs text-ash">
                  Kargo: {order.shipment.carrier} — {order.shipment.trackingNumber}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
