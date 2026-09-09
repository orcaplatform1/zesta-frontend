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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Siparişlerim</h1>
      {!orders ? (
        <p className="text-neutral-500 text-sm">Yükleniyor...</p>
      ) : orders.length === 0 ? (
        <p className="text-neutral-500 text-sm">Henüz siparişiniz yok.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-neutral-200 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{order.orderNumber}</span>
                <span>{STATUS_LABELS[order.status] ?? order.status}</span>
              </div>
              <div className="text-sm text-neutral-500 mt-1">{formatPrice(order.total)}</div>
              {order.shipment?.trackingNumber && (
                <div className="text-xs text-neutral-500 mt-1">
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
