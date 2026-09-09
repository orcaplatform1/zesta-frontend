import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Zesta Gizlilik Politikası — kişisel bilgilerinizin toplanması, kullanımı ve korunması.",
  alternates: { canonical: "/legal/gizlilik-politikasi" },
};

export default function PrivacyPolicyPage() {
  return <StaticPage slug="gizlilik-politikasi" fallbackTitle="Gizlilik Politikası" />;
}
