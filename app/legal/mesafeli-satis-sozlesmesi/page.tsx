import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "Zesta Mesafeli Satış Sözleşmesi — sipariş, ödeme, teslimat ve cayma hakkı koşulları.",
  alternates: { canonical: "/legal/mesafeli-satis-sozlesmesi" },
};

export default function DistanceSalesPage() {
  return <StaticPage slug="mesafeli-satis-sozlesmesi" fallbackTitle="Mesafeli Satış Sözleşmesi" />;
}
