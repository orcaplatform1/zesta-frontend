import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Arama sonuçlarındaki site adı: og:site_name ve WebSite JSON-LD (başlıklardaki SITE_NAME değişmez)
export const OG_SITE_NAME = "Zesta Art&Design";

// Ortak sosyal paylaşım kartı değerleri (Open Graph + Twitter Card)
export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} logosu`,
};

const clip = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

type PageSeo = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "product";
  // Kaydın kendi ana görseli (veritabanından); yoksa genel og-image.png
  image?: string | null;
};

// Sayfanın mevcut başlık / açıklamasını korur, eksik kart etiketlerini tamamlar.
// Başlığın " | Zesta" eki kök layout'taki şablondan gelir.
export function pageMetadata({ title, description, path, type = "website", image }: PageSeo): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const suffix = ` | ${SITE_NAME}`;
  const shortTitle = clip(title, 60 - suffix.length);
  const fullTitle = `${shortTitle}${suffix}`;
  const desc = clip(description, 160);
  // Dinamik görselin gerçek boyutu bilinmediği için width / height yazılmaz
  const imageUrl = image ? new URL(image, SITE_URL).toString() : null;
  const ogImage = imageUrl ? { url: imageUrl, alt: fullTitle } : OG_IMAGE;
  return {
    title: shortTitle,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      ...(type === "website" ? { type: "website" as const } : {}),
      locale: "tr_TR",
      url,
      siteName: OG_SITE_NAME,
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage.url],
    },
    ...(type === "product" ? { other: { "og:type": "product" } } : {}),
  };
}
