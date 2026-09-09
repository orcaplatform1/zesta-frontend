import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "Zesta Çerez (Cookie) Politikası — hangi çerezleri neden kullandığımız.",
  alternates: { canonical: "/legal/cerez-politikasi" },
};

export default function CookiePolicyPage() {
  return <StaticPage slug="cerez-politikasi" fallbackTitle="Çerez Politikası" />;
}
