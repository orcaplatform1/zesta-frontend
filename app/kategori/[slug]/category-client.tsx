"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category, ProductListResponse } from "@/lib/types";
import { ProductListing } from "@/components/ProductListing";

export function CategoryClient({
  slug,
  initialCategory,
  initialProducts,
}: {
  slug: string;
  initialCategory: Category | null;
  initialProducts: ProductListResponse | null;
}) {
  const [category, setCategory] = useState<Category | null>(initialCategory);

  useEffect(() => {
    if (!initialCategory) {
      api.get<Category>(`/categories/${slug}`).then(setCategory).catch(() => setCategory(null));
    }
  }, [slug, initialCategory]);

  return (
    <ProductListing
      key={slug}
      title={category?.name ?? "..."}
      description={category?.description}
      categorySlug={slug}
      initialData={initialProducts}
    />
  );
}
