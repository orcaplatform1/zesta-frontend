import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "İletişim",
  description: "Zesta ile iletişime geçin.",
  path: "/iletisim",
});

export default function ContactLayout({ children }: LayoutProps<"/iletisim">) {
  return children;
}
