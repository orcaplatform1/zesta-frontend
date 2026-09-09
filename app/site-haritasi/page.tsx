import type { Metadata } from "next";
import Link from "next/link";
import { serverApiGet } from "@/lib/server-api";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Site Haritası",
  description: "Zesta'daki tüm kategoriler ve sayfalar.",
  alternates: { canonical: "/site-haritasi" },
};

const GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Mağaza",
    links: [
      { href: "/shop", label: "Tüm Ürünler" },
      { href: "/cart", label: "Sepet" },
      { href: "/account", label: "Hesabım" },
      { href: "/account/orders", label: "Siparişlerim" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { href: "/about", label: "Hakkımızda" },
      { href: "/contact", label: "İletişim" },
      { href: "/faq", label: "Sıkça Sorulan Sorular" },
      { href: "/shipping", label: "Kargo & Teslimat" },
      { href: "/returns", label: "İade & Değişim" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { href: "/legal/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
      { href: "/legal/gizlilik-politikasi", label: "Gizlilik Politikası" },
      { href: "/legal/kvkk", label: "KVKK Aydınlatma Metni" },
      { href: "/legal/cerez-politikasi", label: "Çerez Politikası" },
      { href: "/legal/kullanim-kosullari", label: "Kullanım Koşulları" },
    ],
  },
];

export default async function SiteHaritasiPage() {
  const categories = (await serverApiGet<Category[]>("/categories", 300)) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-12 py-16 md:py-24">
      <p className="eyebrow">Zesta</p>
      <h1 className="mt-3 font-display text-[32px] md:text-[44px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
        Site Haritası
      </h1>

      <div className="mt-14 grid gap-12 sm:grid-cols-2">
        <div>
          <p className="label-uppercase mb-4">Kategoriler</p>
          <ul className="space-y-2.5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="text-[15px] text-smoke hover:text-ink transition-colors duration-[180ms]"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="label-uppercase mb-4">{group.title}</p>
            <ul className="space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-smoke hover:text-ink transition-colors duration-[180ms]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
