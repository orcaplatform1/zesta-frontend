import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İade & Değişim",
  description: "Zesta iade ve değişim koşulları.",
  alternates: { canonical: "/iade-degisim" },
};

export default function ReturnsLayout({ children }: LayoutProps<"/iade-degisim">) {
  return children;
}
