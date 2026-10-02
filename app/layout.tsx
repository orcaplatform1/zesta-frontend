import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { MobileNav } from "@/components/MobileNav";
import { CategoryNav } from "@/components/CategoryNav";
import { AccountNavMenu } from "@/components/AccountNavMenu";
import { DesignerNavMenu } from "@/components/DesignerNavMenu";
import { PaymentBadges } from "@/components/PaymentBadges";
import { CookieConsent } from "@/components/CookieConsent";
import { safeJsonLd } from "@/lib/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { DEFAULT_HOMEPAGE_CONTENT, type HomepageContent } from "@/lib/homepage-content";
import { DEFAULT_FOOTER_CONTACT, type FooterContactContent } from "@/lib/site-pages-content";
import { serverApiGet } from "@/lib/server-api";
import type { Category } from "@/lib/types";
import "./globals.css";

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
    default: `${SITE_NAME} — El İşi Ürünler`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — El İşi Ürünler`,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/logo.png", width: 1200, height: 400, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — El İşi Ürünler`,
    description: DEFAULT_DESCRIPTION,
    images: ["/logo.png"],
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
  { href: "/siparis-takip", label: "Sipariş Takip" },
];

const LEGAL_LINKS = [
  { href: "/yasal/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/yasal/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/yasal/kvkk", label: "KVKK" },
  { href: "/yasal/cerez-politikasi", label: "Çerez Politikası" },
  { href: "/yasal/kullanim-kosullari", label: "Kullanım Koşulları" },
];

// "Traders.TR" gecen kismi ozel stille (beyaz/mavi + bayrak) vurguluyoruz —
// renkler traders.tr logosuyla tutarli (2026-09-15): "Traders" beyaz,
// ".TR" mavi. ORCA (traders.tr) ve KriptoBeyan footer'larindaki AYNI
// desen/marka kimligi. Bayrak ikonuna dokunulmadi.
function renderCopyrightWithBrandHighlight(text: string) {
  const marker = "Traders.TR";
  const parts = text.split(marker);
  if (parts.length === 1) return text;
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <span key={i} className="whitespace-nowrap">
            <span className="text-traders-white">Traders</span>
            <span className="text-traders-blue">.TR</span>{" "}
            <img
              src="/footerflag.png"
              alt=""
              aria-hidden
              className="inline-block h-[1em] w-[1em] translate-y-[0.1em] object-contain align-baseline"
            />
          </span>,
          part,
        ],
  );
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const copyrightText = `© ${new Date().getFullYear()} Zesta. Tüm hakları saklıdır. Zesta bir Traders.TR ticari markasıdır. Bu platformda yer alan tüm içerikler, tasarımlar, marka unsurları ve fikrî mülkiyet hakları ilgili yasal mevzuat kapsamında korunmaktadır.`;

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
        {/* Promo bar */}
        <div className="sticky top-0 z-50 h-9 flex items-center justify-center overflow-hidden px-4" style={{ background: "var(--zesta-primary)", borderBottom: "1px solid var(--border-accent-soft)" }}>
          <span className="promo-bar-shimmer" aria-hidden />
          <p className="relative max-w-full truncate text-[8px] tracking-[0.03em] md:text-[11px] md:tracking-[0.14em] font-semibold uppercase" style={{ color: "var(--text-on-dark)" }}>
            {promoBarText}
          </p>
        </div>

        {/* Floating navbar */}
        <header className="sticky top-9 z-40 px-4 md:px-6 py-2">
          <div
            className="mx-auto max-w-[1280px] h-[62px] md:h-[70px] flex items-center justify-between px-5 md:px-8"
            style={{
              background: "rgba(250,248,243,0.94)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(23,60,60,0.09)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "0 4px 24px rgba(9,43,43,0.07)",
            }}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Zesta"
                width={2172}
                height={724}
                priority
                unoptimized
                className="h-10 md:h-12 w-auto max-w-[160px] md:max-w-[200px] object-contain"
              />
            </Link>

            {/* Center nav */}
            <nav
              className="hidden md:flex items-center gap-6 lg:gap-8 text-[12px] font-medium"
              style={{ letterSpacing: "0.07em" }}
            >
              <Link href="/magaza" className="text-smoke hover:text-ink transition-colors duration-[200ms]">
                TÜM ÜRÜNLER
              </Link>
              <CategoryNav categories={categories} />
              <DesignerNavMenu />
              <Link href="/hikayemiz" className="text-smoke hover:text-ink transition-colors duration-[200ms]">
                HİKÂYEMİZ
              </Link>
            </nav>

            {/* Right: Account + Cart */}
            <div className="hidden md:flex items-center gap-1">
              <AccountNavMenu />
              <Link
                href="/sepet"
                aria-label="Sepet"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-smoke hover:text-ink transition-colors duration-[200ms]"
                style={{ background: "transparent" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </Link>
            </div>

            <MobileNav categories={categories} />
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-32" style={{ background: "var(--zesta-primary-dark)", borderTop: "1px solid var(--border-light)" }}>
          <div className="mx-auto max-w-[1280px] px-5 md:px-12 py-16 grid gap-10 md:grid-cols-[1fr_2.4fr]">
            <div>
              <Image src="/logo.png" alt="Zesta" width={2172} height={724} unoptimized className="h-11 md:h-14 w-auto max-w-[210px] object-contain" style={{ filter: "brightness(0) invert(1)", opacity: 0.88 }} />
              <p className="mt-5 text-sm max-w-xs leading-relaxed" style={{ color: "var(--primary-300)" }}>
                El emeği, özenle hazırlanmış ürünler. Her parça elde, sipariş üzerine üretilir.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
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

              <div>
                <div className="label-uppercase-on-dark mb-5">İletişim</div>
                <div className="flex flex-col gap-3 text-sm" style={{ color: "var(--primary-200)" }}>
                  <a href={`tel:${footerContact.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 transition-colors duration-[200ms] hover:text-[var(--text-on-dark)]">
                    <span aria-hidden>📞</span>
                    {footerContact.phone}
                  </a>
                  <a href={`mailto:${footerContact.email}`} className="flex items-center gap-2 transition-colors duration-[200ms] hover:text-[var(--text-on-dark)]">
                    <span aria-hidden>✉️</span>
                    {footerContact.email}
                  </a>
                  <p className="flex items-start gap-2 leading-relaxed">
                    <span aria-hidden>📍</span>
                    {footerContact.addressNote}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="py-6" style={{ borderTop: "1px solid var(--border-light)" }}>
            <div className="mx-auto max-w-[1280px] px-5 md:px-12">
              <PaymentBadges />
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)" }}>
            <div className="mx-auto max-w-[1280px] px-5 md:px-12 py-6 flex flex-col items-center text-center gap-3 text-xs leading-relaxed" style={{ color: "var(--primary-300)" }}>
              <p>{renderCopyrightWithBrandHighlight(copyrightText)}</p>
              <Link href="/site-haritasi" className="mt-2 transition-colors duration-[200ms] hover:text-[var(--text-on-dark)]">
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
