"use client";

import { useEffect, useState } from "react";
import { api, formatPrice } from "@/lib/api";
import type { Order } from "@/lib/types";

const STATUSES = ["PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekliyor",
  PAID: "Ödendi",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoya Verildi",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal",
  REFUNDED: "İade",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [tracking, setTracking] = useState<Record<string, { carrier: string; trackingNumber: string }>>({});

  function load() {
    api.get<Order[]>("/orders/admin").then(setOrders).catch(() => setOrders([]));
  }

  useEffect(load, []);

  async function updateStatus(id: string, status: string) {
    await api.patch(`/orders/admin/${id}/status`, { status });
    load();
  }

  async function ship(id: string) {
    const t = tracking[id];
    if (!t?.carrier || !t?.trackingNumber) return;
    await api.patch(`/shipping/admin/${id}/ship`, t);
    load();
  }

  if (!orders) return <p className="text-sm text-neutral-500">Yükleniyor...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Siparişler</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="border border-neutral-200 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-medium">{order.orderNumber}</span>{" "}
                <span className="text-neutral-500 text-sm">— {order.fullName}</span>
              </div>
              <span className="text-sm font-medium">{formatPrice(order.total)}</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {order.city}/{order.district} — {order.addressLine}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="border border-neutral-300 rounded-md px-2 py-1 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>

              <input
                placeholder="Kargo firması"
                className="border border-neutral-300 rounded-md px-2 py-1 text-sm w-32"
                value={tracking[order.id]?.carrier ?? ""}
                onChange={(e) =>
                  setTracking((t) => ({ ...t, [order.id]: { carrier: e.target.value, trackingNumber: t[order.id]?.trackingNumber ?? "" } }))
                }
              />
              <input
                placeholder="Takip No"
                className="border border-neutral-300 rounded-md px-2 py-1 text-sm w-32"
                value={tracking[order.id]?.trackingNumber ?? ""}
                onChange={(e) =>
                  setTracking((t) => ({ ...t, [order.id]: { carrier: t[order.id]?.carrier ?? "", trackingNumber: e.target.value } }))
                }
              />
              <button onClick={() => ship(order.id)} className="text-sm underline">
                Kargoya Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
