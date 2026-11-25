import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = pageMetadata({
  title: "Mesafeli Satış Sözleşmesi",
  description: "Zesta Mesafeli Satış Sözleşmesi — sipariş, ödeme, teslimat ve cayma hakkı koşulları.",
  path: "/yasal/mesafeli-satis-sozlesmesi",
});

export default function DistanceSalesPage() {
  return <StaticPage slug="mesafeli-satis-sozlesmesi" fallbackTitle="Mesafeli Satış Sözleşmesi" />;
}
