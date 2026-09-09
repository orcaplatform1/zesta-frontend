import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Zesta ile iletişime geçin.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactLayout({ children }: LayoutProps<"/iletisim">) {
  return children;
}
