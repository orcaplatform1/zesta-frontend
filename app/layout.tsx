import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bodoni_Moda, Inter } from "next/font/google";
import { MobileNav } from "@/components/MobileNav";
import { safeJsonLd } from "@/lib/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
  themeColor: "#FAF9F6",
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
  { href: "/about", label: "Hakkımızda" },
  { href: "/contact", label: "İletişim" },
  { href: "/shipping", label: "Kargo & Teslimat" },
  { href: "/returns", label: "İade & Değişim" },
];

const LEGAL_LINKS = [
  { href: "/legal/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/legal/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/legal/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/legal/cerez-politikasi", label: "Çerez Politikası" },
];

// "Traders.TR" gecen kismi ozel stille (kirmizi/beyaz + bayrak) vurguluyoruz —
// ORCA (traders.tr) ve KriptoBeyan footer'larindaki AYNI desen/marka kimligi.
function renderCopyrightWithBrandHighlight(text: string) {
  const marker = "Traders.TR";
  const parts = text.split(marker);
  if (parts.length === 1) return text;
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <span key={i} className="whitespace-nowrap">
            <span className="text-traders-red">Traders</span>
            <span className="text-traders-white">.TR</span>{" "}
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  const copyrightText = `© ${new Date().getFullYear()} Zesta. Tüm hakları saklıdır. Zesta bir Traders.TR ticari markasıdır. Bu platformda yer alan tüm içerikler, tasarımlar, marka unsurları ve fikrî mülkiyet hakları ilgili yasal mevzuat kapsamında korunmaktadır.`;

  return (
    <html
      lang="tr"
      className={`${bodoniModa.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-onyx-900 text-ink font-sans">
        <header className="sticky top-0 z-40 bg-onyx-900/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
          <div className="mx-auto max-w-[1440px] h-16 md:h-[76px] flex items-center justify-between px-5 md:px-12">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Zesta"
                width={2172}
                height={724}
                priority
                unoptimized
                className="h-10 md:h-14 w-auto"
              />
            </Link>
            <nav
              className="hidden md:flex items-center gap-6 md:gap-8 text-[13px]"
              style={{ letterSpacing: "0.08em" }}
            >
              <Link href="/shop" className="text-smoke hover:text-ink transition-colors duration-[180ms]">
                ÜRÜNLER
              </Link>
              <Link href="/account" className="text-smoke hover:text-ink transition-colors duration-[180ms]">
                HESABIM
              </Link>
              <Link href="/cart" className="text-smoke hover:text-ink transition-colors duration-[180ms]">
                SEPET
              </Link>
            </nav>

            <MobileNav />
          </div>
        </header>

        <main className="flex-1 bg-onyx-900">{children}</main>

        <footer className="bg-onyx-950 border-t border-[var(--border-light)] mt-32">
          <div className="mx-auto max-w-[1440px] px-5 md:px-12 py-16 grid gap-10 md:grid-cols-[1.2fr_2fr]">
            <div>
              <Image src="/logo.png" alt="Zesta" width={2172} height={724} unoptimized className="h-12 md:h-16 w-auto" />
              <p className="mt-4 text-sm text-stone-300 max-w-xs leading-relaxed">
                El emeği, özenle hazırlanmış ürünler. Her parça elde, sipariş üzerine üretilir.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <div className="label-uppercase-on-dark mb-4">Mağaza</div>
                <div className="flex flex-col gap-3 text-sm">
                  {FOOTER_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-mist-200 hover:text-[var(--text-on-dark)] transition-colors duration-[180ms]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="label-uppercase-on-dark mb-4">Yasal</div>
                <div className="flex flex-col gap-3 text-sm">
                  {LEGAL_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-mist-200 hover:text-[var(--text-on-dark)] transition-colors duration-[180ms]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border-light)]">
            <div className="mx-auto max-w-[1440px] px-5 md:px-12 py-6 flex flex-col items-center gap-3 text-xs leading-relaxed text-charcoal-200 sm:flex-row sm:justify-between">
              <p>{renderCopyrightWithBrandHighlight(copyrightText)}</p>
              <a href="/sitemap.xml" className="hover:text-[var(--text-on-dark)] transition-colors duration-[180ms]">
                Site Haritası
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
