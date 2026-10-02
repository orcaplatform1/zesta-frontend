import type { Metadata } from "next";
import { HomeClient } from "./home-client";
import { serverApiGet } from "@/lib/server-api";
import { DEFAULT_HOMEPAGE_CONTENT } from "@/lib/homepage-content";
import type { HomeData, Category } from "@/lib/types";

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

export default async function HomePage() {
  const [data, categories] = await Promise.all([
    serverApiGet<HomeData>("/home", 60).then((d) => d ?? FALLBACK_HOME_DATA),
    serverApiGet<Category[]>("/categories", 300).then((c) => c ?? []),
  ]);
  return <HomeClient data={data} categories={categories} />;
}
