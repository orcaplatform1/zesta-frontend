import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = pageMetadata({
  title: "KVKK",
  description: "Zesta KVKK Aydınlatma Metni — kişisel verilerinizin işlenmesine ilişkin bilgilendirme.",
  path: "/yasal/kvkk",
});

export default function KvkkPage() {
  return <StaticPage slug="kvkk" fallbackTitle="KVKK" />;
}
