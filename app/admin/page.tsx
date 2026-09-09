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

  if (!data) return <p className="text-neutral-500 text-sm">Yükleniyor...</p>;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Bugünkü Satış" value={formatPrice(data.todaySales)} />
        <Stat label="Bugünkü Sipariş" value={String(data.todayOrders)} />
        <Stat label="Toplam Satış" value={formatPrice(data.totalSales)} />
        <Stat label="Toplam Sipariş" value={String(data.totalOrders)} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold mb-3">Düşük Stoklu Ürünler</h2>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-sm text-neutral-500">Yok</p>
          ) : (
            <ul className="text-sm space-y-1">
              {data.lowStockProducts.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>{p.name}</span>
                  <span className="text-red-600">{p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-semibold mb-3">Son Siparişler</h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-neutral-500">Yok</p>
          ) : (
            <ul className="text-sm space-y-1">
              {data.recentOrders.map((o) => (
                <li key={o.id} className="flex justify-between">
                  <span>
                    {o.orderNumber} — {o.fullName}
                  </span>
                  <span>{formatPrice(o.total)}</span>
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
    <div className="border border-neutral-200 rounded-lg p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
