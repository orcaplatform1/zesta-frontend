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
        disallow: ["/account", "/cart", "/checkout", "/order-success", "/order-failed"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
