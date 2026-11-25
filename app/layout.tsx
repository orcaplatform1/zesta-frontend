import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { PaymentBadges } from "@/components/PaymentBadges";
import { CookieConsent } from "@/components/CookieConsent";
import { safeJsonLd } from "@/lib/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { OG_IMAGE, OG_SITE_NAME } from "@/lib/seo";
import { DEFAULT_HOMEPAGE_CONTENT, type HomepageContent } from "@/lib/homepage-content";
import { DEFAULT_FOOTER_CONTACT, type FooterContactContent } from "@/lib/site-pages-content";
import { serverApiGet } from "@/lib/server-api";
import type { Category } from "@/lib/types";
import "./globals.css";
import { NoInstallPrompt } from "@/components/NoInstallPrompt";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const DEFAULT_DESCRIPTION =
  "Zesta — el emeği, özenle ve sipariş üzerine hazırlanmış ürünler. Her parça elde üretilir.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | El İşi Ürünler`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: OG_SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} | El İşi Ürünler`,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | El İşi Ürünler`,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export const viewport = {
  themeColor: "#F4F1E9",
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: DEFAULT_DESCRIPTION,
  sameAs: [],
};

const FOOTER_LINKS = [
  { href: "/hikayemiz", label: "Hikâyemiz" },
  { href: "/sss", label: "Sıkça Sorulan Sorular" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/kargo-teslimat", label: "Kargo & Teslimat" },
  { href: "/iade-degisim", label: "İade & Değişim" },
];

const CORPORATE_LINKS = [
  { href: "/kurumsal-cozumler", label: "Kurumsal Çözümler" },
  { href: "/magazalarimiz", label: "Mağazalarımız" },
  { href: "/siparis-takip", label: "Sipariş Takibi" },
];

const LEGAL_LINKS = [
  { href: "/yasal/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/yasal/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/yasal/kvkk", label: "KVKK" },
  { href: "/yasal/cerez-politikasi", label: "Çerez Politikası" },
  { href: "/yasal/kullanim-kosullari", label: "Kullanım Koşulları" },
];

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const copyrightLine1 = `© ${new Date().getFullYear()} Zesta. Tüm hakları saklıdır.`;
  const copyrightLine2 = `Bu platformda yer alan tüm içerikler, tasarımlar, marka unsurları ve fikrî mülkiyet hakları ilgili yasal mevzuat kapsamında korunmaktadır.`;

  const settings = await serverApiGet<Record<string, unknown>>("/settings", 60);
  const homepageContent = settings?.homepage_content as HomepageContent | undefined;
  const promoBarText = homepageContent?.promoBarText ?? DEFAULT_HOMEPAGE_CONTENT.promoBarText;
  const footerContact = (settings?.footer_contact_content as FooterContactContent | undefined) ?? DEFAULT_FOOTER_CONTACT;

  const categories = (await serverApiGet<Category[]>("/categories", 300)) ?? [];

  return (
    <html
      lang="tr"
      className={`${cormorantGaramond.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-ink font-sans" style={{ background: "var(--zesta-bg)" }}>
        <NoInstallPrompt />
        {/* Promo bar */}
        <div className="sticky top-0 z-50 h-9 flex items-center justify-center overflow-hidden px-4" style={{ background: "var(--zesta-primary)", borderBottom: "1px solid var(--border-accent-soft)" }}>
          <span className="promo-bar-shimmer" aria-hidden />
          <p className="relative max-w-full truncate text-[8px] tracking-[0.03em] md:text-[11px] md:tracking-[0.14em] font-semibold uppercase" style={{ color: "var(--text-on-dark)" }}>
            {promoBarText}
          </p>
        </div>

        {/* Header */}
        <SiteHeader categories={categories} />

        <main className="flex-1">{children}</main>

        <footer className="mt-32" style={{ background: "var(--zesta-primary-dark)", borderTop: "1px solid var(--border-light)" }}>
          <div className="mx-auto max-w-[1200px] px-4 lg:px-5 py-12 md:py-16 grid gap-8 md:gap-10 md:grid-cols-4">
            <div>
              <Image src="/logo.png" alt="Zesta" width={2172} height={724} unoptimized className="h-11 md:h-14 w-auto max-w-[210px] object-contain" style={{ filter: "brightness(0) invert(1)", opacity: 0.88 }} />
              <div className="mt-6 flex flex-col gap-3 text-sm" style={{ color: "var(--primary-200)" }}>
                <a href={`mailto:${footerContact.email}`} className="flex items-center gap-2 transition-colors duration-[200ms] hover:text-[var(--text-on-dark)]">
                  <span aria-hidden>✉️</span>
                  {footerContact.email}
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(footerContact.addressNote)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 leading-relaxed transition-colors duration-[200ms] hover:text-[var(--text-on-dark)]"
                >
                  <span aria-hidden>📍</span>
                  {footerContact.addressNote}
                </a>
              </div>
            </div>

            <div>
              <div className="label-uppercase-on-dark mb-5">Mağaza</div>
              <div className="flex flex-col gap-3 text-sm">
              {FOOTER_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
              </div>
            </div>

            <div>
              <div className="label-uppercase-on-dark mb-5">Kurumsal</div>
              <div className="flex flex-col gap-3 text-sm">
              {CORPORATE_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
              </div>
            </div>

            <div>
              <div className="label-uppercase-on-dark mb-5">Yasal</div>
              <div className="flex flex-col gap-3 text-sm">
              {LEGAL_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
              </div>
            </div>
          </div>

          <div className="py-6" style={{ borderTop: "1px solid var(--border-light)" }}>
            <div className="mx-auto max-w-[1200px] px-4 lg:px-5">
              <PaymentBadges />
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)" }}>
            <div className="mx-auto max-w-[1200px] px-4 lg:px-5 py-6 flex flex-col items-center text-center gap-3 text-xs leading-relaxed" style={{ color: "var(--primary-300)" }}>
              <div>
                <p>{copyrightLine1}</p>
                <p>{copyrightLine2}</p>
              </div>
              <Link href="/site-haritasi" className="mt-2">
                Site Haritası
              </Link>
            </div>
          </div>
        </footer>
        <CookieConsent />
      </body>
    </html>
  );
}
