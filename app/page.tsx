import type { Metadata } from "next";
import { HomeClient } from "./home-client";
import { serverApiGet } from "@/lib/server-api";
import { DEFAULT_HOMEPAGE_CONTENT } from "@/lib/homepage-content";
import type { HomeData, Category, ProductListResponse } from "@/lib/types";
import { safeJsonLd } from "@/lib/json-ld";
import { OG_SITE_NAME } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

// Arama sonuçlarındaki site adı: schema.org WebSite
const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: OG_SITE_NAME,
  alternateName: "zesta.tr",
  url: `${SITE_URL}/`,
};

export const metadata: Metadata = {
  title: { absolute: "Zesta Art&Design" },
  description: "Zesta Art&Design — el emeği, özenle ve sipariş üzerine hazırlanmış ürünler.",
  alternates: { canonical: "/" },
};

const FALLBACK_HOME_DATA: HomeData = {
  content: DEFAULT_HOMEPAGE_CONTENT,
  rows: {},
  rowRatings: {},
  splitProducts: {},
  hero: null,
  vitrin: { category: null, items: [], ratings: {} },
};

// Ana sayfa kategori şeritleri: mevcut /products ucundan kategori başına en fazla 10 ürün
// (backend /home yanıtı şerit başına 4 ürün döndürüyor; backend'e dokunulmadı).
const ROW_LIMIT = 10;

// "Öne Çıkan Ürünler" her istekte backend'de yeniden seçilir; önbelleğe alınmaz.
export const dynamic = "force-dynamic";
const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:3200";

async function getFeatured(): Promise<HomeData["vitrin"] | null> {
  try {
    const res = await fetch(`${INTERNAL_API_URL}/home/featured`, { cache: "no-store" });
    if (!res.ok) return null;
    const d = (await res.json()) as { items: HomeData["vitrin"]["items"]; ratings: HomeData["vitrin"]["ratings"] };
    return { category: null, items: d.items, ratings: d.ratings };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [data, categories, featured] = await Promise.all([
    serverApiGet<HomeData>("/home", 60).then((d) => d ?? FALLBACK_HOME_DATA),
    serverApiGet<Category[]>("/categories", 300).then((c) => c ?? []),
    getFeatured(),
  ]);
  const rowEntries = await Promise.all(
    data.content.categoryRows.map(async (r) => {
      const list = await serverApiGet<ProductListResponse>(
        `/products?category=${encodeURIComponent(r.slug)}&pageSize=${ROW_LIMIT}`,
        60,
      );
      return [r.slug, list ?? data.rows[r.slug]] as const;
    }),
  );
  const rows = { ...data.rows };
  for (const [slug, list] of rowEntries) if (list) rows[slug] = list;
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJsonLd(WEBSITE_JSON_LD) }}
      />
      <HomeClient data={{ ...data, rows, vitrin: featured ?? data.vitrin }} categories={categories} />
    </>
  );
}
