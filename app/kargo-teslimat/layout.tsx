import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kargo & Teslimat",
  description: "Zesta kargo ve teslimat bilgileri.",
  alternates: { canonical: "/kargo-teslimat" },
};

export default function ShippingLayout({ children }: LayoutProps<"/kargo-teslimat">) {
  return children;
}
