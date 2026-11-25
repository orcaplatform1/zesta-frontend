import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Tasarımcı Başvurusu",
  description: "Zesta tasarımcısı olun: %15 komisyon, 15 günde bakiyeye geçen ödemeler ve tek ekrandan ürün, sipariş ve ödeme yönetimi.",
  path: "/tasarimci-basvuru",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
