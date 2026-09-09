"use client";

import { useEffect, useState } from "react";
import { api, formatPrice } from "@/lib/api";

interface Dashboard {
  todaySales: number;
  todayOrders: number;
  totalSales: number;
  totalOrders: number;
  lowStockProducts: { id: string; name: string; stock: number }[];
  recentOrders: { id: string; orderNumber: string; fullName: string; total: string; status: string }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    api.get<Dashboard>("/admin/dashboard").then(setData).catch(() => setData(null));
  }, []);

  if (!data) return <p className="text-sm text-ash">Yükleniyor...</p>;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Stat label="Bugünkü Satış" value={formatPrice(data.todaySales)} />
        <Stat label="Bugünkü Sipariş" value={String(data.todayOrders)} />
        <Stat label="Toplam Satış" value={formatPrice(data.totalSales)} />
        <Stat label="Toplam Sipariş" value={String(data.totalOrders)} />
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="label-uppercase mb-4">Düşük Stoklu Ürünler</h2>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-sm text-ash">Yok</p>
          ) : (
            <ul className="text-sm space-y-2">
              {data.lowStockProducts.map((p) => (
                <li key={p.id} className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-smoke">{p.name}</span>
                  <span className="text-champagne-300">{p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="label-uppercase mb-4">Son Siparişler</h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-ash">Yok</p>
          ) : (
            <ul className="text-sm space-y-2">
              {data.recentOrders.map((o) => (
                <li key={o.id} className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-smoke">
                    {o.orderNumber} — {o.fullName}
                  </span>
                  <span className="text-ink">{formatPrice(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--border-subtle)] rounded-sm bg-onyx-700 p-5">
      <div className="label-uppercase">{label}</div>
      <div className="mt-2 font-display text-2xl font-normal text-ink">{value}</div>
    </div>
  );
}
