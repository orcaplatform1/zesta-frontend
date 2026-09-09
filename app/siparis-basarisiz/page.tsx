"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderFailedPage() {
  return (
    <Suspense fallback={null}>
      <OrderFailedContent />
    </Suspense>
  );
}

function OrderFailedContent() {
  const params = useSearchParams();
  const orderNumber = params.get("orderNumber");

  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="label-uppercase" style={{ color: "var(--status-error)" }}>
        Ödeme
      </p>
      <h1 className="mt-3 font-display text-[32px] md:text-[40px] font-normal text-ink">Tamamlanamadı</h1>
      {orderNumber && <p className="mt-3 text-smoke">Sipariş No: {orderNumber}</p>}
      <p className="mt-3 text-sm text-ash">
        Ödemeniz alınamadı. Kartınızı kontrol edip tekrar deneyebilir veya sepetinize dönebilirsiniz.
      </p>
      <div className="mt-8 flex justify-center gap-6">
        <Link href="/odeme" className="text-sm text-champagne-300 underline">
          Tekrar dene
        </Link>
        <Link href="/sepet" className="text-sm text-champagne-300 underline">
          Sepete dön
        </Link>
      </div>
    </div>
  );
}
