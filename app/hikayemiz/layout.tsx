import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Hakkımızda",
  description: "Zesta'nın hikayesi — el emeği, özenle hazırlanmış ürünler.",
  path: "/hikayemiz",
});

export default function AboutLayout({ children }: LayoutProps<"/hikayemiz">) {
  return children;
}
