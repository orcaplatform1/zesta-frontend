import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "İade & Değişim",
  description: "Zesta iade ve değişim koşulları.",
  path: "/iade-degisim",
});

export default function ReturnsLayout({ children }: LayoutProps<"/iade-degisim">) {
  return children;
}
