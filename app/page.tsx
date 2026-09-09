import type { Metadata } from "next";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  title: { absolute: "Zesta Art&Design" },
  description: "Zesta Art&Design — el emeği, özenle ve sipariş üzerine hazırlanmış ürünler.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeClient />;
}
