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
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Ödeme Tamamlanamadı</h1>
      {orderNumber && <p className="mt-2 text-neutral-600">Sipariş No: {orderNumber}</p>}
      <p className="mt-2 text-neutral-500 text-sm">
        Ödemeniz alınamadı. Kartınızı kontrol edip tekrar deneyebilir veya sepetinize dönebilirsiniz.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Link href="/checkout" className="underline text-sm">
          Tekrar dene
        </Link>
        <Link href="/cart" className="underline text-sm">
          Sepete dön
        </Link>
      </div>
    </div>
  );
}
