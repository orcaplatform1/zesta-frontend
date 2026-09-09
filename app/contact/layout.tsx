import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Zesta ile iletişime geçin.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: LayoutProps<"/contact">) {
  return children;
}
