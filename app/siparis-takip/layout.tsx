import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sipariş Takibi",
  description: "Zesta siparişinizin durumunu sipariş numaranızla takip edin.",
  path: "/siparis-takip",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
