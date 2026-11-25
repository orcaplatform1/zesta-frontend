import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = pageMetadata({
  title: "Gizlilik Politikası",
  description: "Zesta Gizlilik Politikası — kişisel bilgilerinizin toplanması, kullanımı ve korunması.",
  path: "/yasal/gizlilik-politikasi",
});

export default function PrivacyPolicyPage() {
  return <StaticPage slug="gizlilik-politikasi" fallbackTitle="Gizlilik Politikası" />;
}
