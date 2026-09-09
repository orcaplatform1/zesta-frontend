import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İade & Değişim",
  description: "Zesta iade ve değişim koşulları.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsLayout({ children }: LayoutProps<"/returns">) {
  return children;
}
