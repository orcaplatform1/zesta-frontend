import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "Zesta'da sipariş, üretim süresi, kargo, iade ve üyelik hakkında merak edilenler.",
  alternates: { canonical: "/faq" },
};

export default function FaqLayout({ children }: LayoutProps<"/faq">) {
  return children;
}
