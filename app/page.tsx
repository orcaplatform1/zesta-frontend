import type { Metadata } from "next";
import { HomeClient } from "./home-client";
import { serverApiGet } from "@/lib/server-api";
import { DEFAULT_HOMEPAGE_CONTENT } from "@/lib/homepage-content";
import type { HomeData } from "@/lib/types";

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
  const data = (await serverApiGet<HomeData>("/home", 60)) ?? FALLBACK_HOME_DATA;
  return <HomeClient data={data} />;
}
