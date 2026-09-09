import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Zesta KVKK Aydınlatma Metni — kişisel verilerinizin işlenmesine ilişkin bilgilendirme.",
  alternates: { canonical: "/legal/kvkk" },
};

export default function KvkkPage() {
  return <StaticPage slug="kvkk" fallbackTitle="KVKK Aydınlatma Metni" />;
}
