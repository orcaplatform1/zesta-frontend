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
  { href: "/siparis-takip", label: "Sipariş Takibi" },
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
  const copyrightLine1 = `© ${new Date().getFullYear()} Zesta. Tüm hakları saklıdır. Zesta bir Traders.TR ticari markasıdır.`;
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
        {/* Promo bar */}
        <div className="sticky top-0 z-50 h-9 flex items-center justify-center overflow-hidden px-4" style={{ background: "var(--zesta-primary)", borderBottom: "1px solid var(--border-accent-soft)" }}>
          <span className="promo-bar-shimmer" aria-hidden />
          <p className="relative max-w-full truncate text-[8px] tracking-[0.03em] md:text-[11px] md:tracking-[0.14em] font-semibold uppercase" style={{ color: "var(--text-on-dark)" }}>
            {promoBarText}
          </p>
        </div>

        {/* Navbar */}
        <header className="sticky top-9 z-40" style={{ background: "var(--zesta-primary)" }}>
          <div className="px-3 md:px-5 py-[10px]">

            {/* ── DESKTOP ─────────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-3 mx-auto max-w-[1280px]">

              {/* SOL PİLL: Logo + Nav */}
              <div
                className="flex items-center gap-6 lg:gap-8 h-[58px] px-5 lg:px-7 flex-1 min-w-0"
                style={{
                  background: "rgba(250,248,243,0.97)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(23,60,60,0.08)",
                  borderRadius: "100px",
                  boxShadow: "0 2px 20px rgba(9,43,43,0.13)",
                }}
              >
                <Link href="/" className="flex items-center flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Zesta"
                    width={2172}
                    height={724}
                    priority
                    unoptimized
                    className="h-9 lg:h-10 w-auto max-w-[140px] lg:max-w-[170px] object-contain"
                  />
                </Link>
                <nav
                  className="flex items-center gap-5 lg:gap-7 text-[11.5px] font-medium min-w-0"
                  style={{ letterSpacing: "0.07em" }}
                >
                  <CategoryNav categories={categories} />
                  <Link href="/kurumsal-cozumler" className="text-smoke hover:text-ink transition-colors duration-[200ms] whitespace-nowrap">
                    KURUMSAL ÇÖZÜMLER
                  </Link>
                  <Link href="/hikayemiz" className="text-smoke hover:text-ink transition-colors duration-[200ms] whitespace-nowrap">
                    HİKÂYEMİZ
                  </Link>
                  <DesignerNavMenu />
                  <Link href="/ekitap" className="text-smoke hover:text-ink transition-colors duration-[200ms] whitespace-nowrap">
                    E-KİTAP
                  </Link>
                </nav>
              </div>

              {/* SAĞ GRUP: Arama pill + ikonlar */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Arama pill */}
                <form
                  action="/magaza"
                  method="get"
                  className="flex items-center gap-2 h-[42px] rounded-full px-4"
                  style={{
                    background: "rgba(250,248,243,0.97)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(23,60,60,0.08)",
                    boxShadow: "0 2px 20px rgba(9,43,43,0.13)",
                  }}
                >
                  <input
                    name="q"
                    type="search"
                    placeholder="Ürün, kategori ara..."
                    className="bg-transparent outline-none text-[11.5px] w-36 lg:w-44 placeholder:text-smoke/50"
                    style={{ color: "var(--text-primary)" }}
                  />
                  <button type="submit" aria-label="Ara" className="text-smoke hover:text-ink transition-colors flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </button>
                </form>

                {/* Kullanıcı ikonu */}
                <AccountNavMenu />

                {/* Favoriler */}
                <Link href="/magaza" aria-label="Favoriler" className="nav-dark-icon inline-flex h-9 w-9 items-center justify-center rounded-full transition-opacity duration-[200ms]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </Link>

                {/* Sepet */}
                <Link href="/sepet" aria-label="Sepet" className="nav-dark-icon inline-flex h-9 w-9 items-center justify-center rounded-full transition-opacity duration-[200ms]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* ── MOBİL ───────────────────────────────────────────── */}
            <div
              className="md:hidden flex items-center gap-2 h-[52px] px-4"
              style={{
                background: "rgba(250,248,243,0.97)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(23,60,60,0.08)",
                borderRadius: "100px",
                boxShadow: "0 2px 20px rgba(9,43,43,0.13)",
              }}
            >
              <Link href="/" className="flex items-center flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Zesta"
                  width={2172}
                  height={724}
                  priority
                  unoptimized
                  className="h-8 w-auto max-w-[120px] object-contain"
                />
              </Link>
              <div className="flex items-center gap-0.5 ml-auto">
                <Link href="/magaza" aria-label="Ara" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-smoke hover:text-ink transition-colors duration-[200ms]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </Link>
                <Link href="/sepet" aria-label="Sepet" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-smoke hover:text-ink transition-colors duration-[200ms]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                </Link>
                <MobileNav categories={categories} />
              </div>
            </div>

          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-32" style={{ background: "var(--zesta-primary-dark)", borderTop: "1px solid var(--border-light)" }}>
          <div className="mx-auto max-w-[1280px] px-5 md:px-12 py-16 grid gap-10 md:grid-cols-[1fr_2.4fr]">
            <div>
              <Image src="/logo.png" alt="Zesta" width={2172} height={724} unoptimized className="h-11 md:h-14 w-auto max-w-[210px] object-contain" style={{ filter: "brightness(0) invert(1)", opacity: 0.88 }} />
              <div className="mt-6 flex flex-col gap-3 text-sm" style={{ color: "var(--primary-200)" }}>
                <a href={`tel:${footerContact.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 transition-colors duration-[200ms] hover:text-[var(--text-on-dark)]">
                  <span aria-hidden>📞</span>
                  {footerContact.phone.replace(/^\+90\s*/, "")}
                </a>
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

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
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
          </div>

          <div className="py-6" style={{ borderTop: "1px solid var(--border-light)" }}>
            <div className="mx-auto max-w-[1280px] px-5 md:px-12">
              <PaymentBadges />
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)" }}>
            <div className="mx-auto max-w-[1280px] px-5 md:px-12 py-6 flex flex-col items-center text-center gap-3 text-xs leading-relaxed" style={{ color: "var(--primary-300)" }}>
              <div>
                <p>{renderCopyrightWithBrandHighlight(copyrightLine1)}</p>
                <p>{copyrightLine2}</p>
              </div>
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
