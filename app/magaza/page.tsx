"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductListing } from "@/components/ProductListing";

function ShopContent() {
  const params = useSearchParams();
  const q = params.get("q")?.trim() || undefined;
  return <ProductListing title="Tüm Ürünler" categorySlug={null} search={q} />;
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1200px] px-4 py-8 text-sm text-ash lg:px-5">Yükleniyor...</div>}>
      <ShopContent />
    </Suspense>
  );
}
