import type { MetadataRoute } from "next";
import { serverApiGet } from "@/lib/server-api";
import { SITE_URL } from "@/lib/site";
import type { Category, ProductListResponse } from "@/lib/types";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/magaza", priority: 0.9, changeFrequency: "daily" },
  { path: "/hikayemiz", priority: 0.5, changeFrequency: "monthly" },
  { path: "/iletisim", priority: 0.5, changeFrequency: "monthly" },
  { path: "/kargo-teslimat", priority: 0.4, changeFrequency: "monthly" },
  { path: "/iade-degisim", priority: 0.4, changeFrequency: "monthly" },
  { path: "/yasal/mesafeli-satis-sozlesmesi", priority: 0.3, changeFrequency: "yearly" },
  { path: "/yasal/gizlilik-politikasi", priority: 0.3, changeFrequency: "yearly" },
  { path: "/yasal/kvkk", priority: 0.3, changeFrequency: "yearly" },
  { path: "/yasal/cerez-politikasi", priority: 0.3, changeFrequency: "yearly" },
];

// Katalog (ürün/kategori) her değiştiğinde site haritası da kendiliğinden
// güncellenir — burada canlı olarak backend'den çekiliyor (statik dosya değil).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productList, categories] = await Promise.all([
    serverApiGet<ProductListResponse>("/products?pageSize=1000"),
    serverApiGet<Category[]>("/categories"),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = (productList?.items ?? []).map((product) => ({
    url: `${SITE_URL}/urun/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = (categories ?? []).map((category) => ({
    url: `${SITE_URL}/kategori/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
