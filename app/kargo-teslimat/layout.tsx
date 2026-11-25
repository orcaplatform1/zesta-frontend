import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Kargo & Teslimat",
  description: "Zesta kargo ve teslimat bilgileri.",
  path: "/kargo-teslimat",
});

export default function ShippingLayout({ children }: LayoutProps<"/kargo-teslimat">) {
  return children;
}
