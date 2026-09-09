import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik / KVKK",
  description: "Zesta gizlilik politikası, KVKK aydınlatma metni ve kullanım koşulları.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: LayoutProps<"/privacy">) {
  return children;
}
