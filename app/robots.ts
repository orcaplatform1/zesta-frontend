import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Yönetim paneli robots.txt'te BİLEREK listelenmiyor — burada
        // listelemek adresi herkese ilan etmek anlamına gelir.
        disallow: ["/hesap", "/sepet", "/odeme", "/siparis-basarili", "/siparis-basarisiz"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
