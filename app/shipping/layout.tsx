import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kargo & Teslimat",
  description: "Zesta kargo ve teslimat bilgileri.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingLayout({ children }: LayoutProps<"/shipping">) {
  return children;
}
