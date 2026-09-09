import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Zesta'nın hikayesi — el emeği, özenle hazırlanmış ürünler.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: LayoutProps<"/about">) {
  return children;
}
