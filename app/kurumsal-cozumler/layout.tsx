import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Kurumsal Çözümler",
  description: "Kurumlara özel el işi hediye ve ürün seçkileri: ihtiyaç analizi, özel seçki, üretim ve teslimat süreçleriyle Zesta kurumsal çözümleri.",
  path: "/kurumsal-cozumler",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
