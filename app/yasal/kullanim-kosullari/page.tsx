import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = pageMetadata({
  title: "Kullanım Koşulları",
  description: "Zesta Kullanım Koşulları — Site'nin kullanımına, üyeliğe ve fikri mülkiyete ilişkin kurallar.",
  path: "/yasal/kullanim-kosullari",
});

export default function KullanimKosullariPage() {
  return <StaticPage slug="kullanim-kosullari" fallbackTitle="Kullanım Koşulları" />;
}
