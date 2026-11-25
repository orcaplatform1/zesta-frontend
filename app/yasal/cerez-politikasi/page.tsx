import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = pageMetadata({
  title: "Çerez Politikası",
  description: "Zesta Çerez (Cookie) Politikası — hangi çerezleri neden kullandığımız.",
  path: "/yasal/cerez-politikasi",
});

export default function CookiePolicyPage() {
  return <StaticPage slug="cerez-politikasi" fallbackTitle="Çerez Politikası" />;
}
