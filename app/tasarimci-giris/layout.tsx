import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Tasarımcı Girişi",
  description: "Zesta tasarımcı hesabınıza giriş yapın; ürünlerinizi, siparişlerinizi ve ödemelerinizi Tasarımcı Paneli'nden yönetin.",
  path: "/tasarimci-giris",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
