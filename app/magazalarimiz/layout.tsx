import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mağazalarımız",
  description: "Zesta ürünlerini yerinde görebileceğiniz mağazalarımız ve iletişim bilgileri.",
  path: "/magazalarimiz",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
