import type { Metadata } from "next";
import { EbookReader } from "@/components/ebook/EbookReader";

export const metadata: Metadata = {
  title: "Zarafetin İzinde | Zesta Art&Design",
  description: "Zarafetin İzinde — eserlerin ardındaki hikâyelere bir yolculuk.",
  openGraph: {
    images: [{ url: "/ebook/cover/cover.png" }],
  },
};

interface Props {
  searchParams: Promise<{ sayfa?: string }>;
}

export default async function EkitapPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialPage = parseInt(params.sayfa ?? "0", 10) || 0;
  return <EbookReader initialPage={initialPage} />;
}
