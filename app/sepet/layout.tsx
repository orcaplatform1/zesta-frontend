import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sepetim",
  description: "Zesta sepetinizdeki el işi ürünleri görüntüleyin ve siparişinizi tamamlayın.",
  path: "/sepet",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
