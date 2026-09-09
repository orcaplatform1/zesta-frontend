import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Zesta'nın hikayesi — el emeği, özenle hazırlanmış ürünler.",
  alternates: { canonical: "/hikayemiz" },
};

export default function AboutLayout({ children }: LayoutProps<"/hikayemiz">) {
  return children;
}
