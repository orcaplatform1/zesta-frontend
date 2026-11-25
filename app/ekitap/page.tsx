import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { EbookReader } from "@/components/ebook/EbookReader";

export const metadata: Metadata = pageMetadata({
  title: "Zarafetin İzinde | Zesta Art&Design",
  description: "Zarafetin İzinde — eserlerin ardındaki hikâyelere bir yolculuk.",
  path: "/ekitap",
});

interface Props {
  searchParams: Promise<{ sayfa?: string }>;
}

export default async function EkitapPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialPage = parseInt(params.sayfa ?? "0", 10) || 0;
  return <EbookReader initialPage={initialPage} />;
}
