import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ürünler",
  description: "Zesta'nın el yapımı ürün koleksiyonunu keşfedin — her parça elde, sipariş üzerine üretilir.",
  path: "/magaza",
});

export default function ShopLayout({ children }: LayoutProps<"/magaza">) {
  return children;
}
