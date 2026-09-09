import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description: "Zesta Kullanım Koşulları — Site'nin kullanımına, üyeliğe ve fikri mülkiyete ilişkin kurallar.",
  alternates: { canonical: "/legal/kullanim-kosullari" },
};

export default function KullanimKosullariPage() {
  return <StaticPage slug="kullanim-kosullari" fallbackTitle="Kullanım Koşulları" />;
}
