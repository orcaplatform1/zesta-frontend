import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sıkça Sorulan Sorular",
  description: "Zesta'da sipariş, üretim süresi, kargo, iade ve üyelik hakkında merak edilenler.",
  path: "/sss",
});

export default function FaqLayout({ children }: LayoutProps<"/sss">) {
  return children;
}
