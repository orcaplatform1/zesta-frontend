import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "Zesta'nın el yapımı ürün koleksiyonunu keşfedin — her parça elde, sipariş üzerine üretilir.",
  alternates: { canonical: "/magaza" },
};

export default function ShopLayout({ children }: LayoutProps<"/magaza">) {
  return children;
}
