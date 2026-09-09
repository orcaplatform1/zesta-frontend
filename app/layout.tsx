import type { Metadata } from "next";
import Link from "next/link";
import { Bodoni_Moda, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Zesta — El İşi Ürünler",
  description: "El emeği, özenle hazırlanmış ürünler.",
};

const FOOTER_LINKS = [
  { href: "/about", label: "Hakkımızda" },
  { href: "/contact", label: "İletişim" },
  { href: "/shipping", label: "Kargo & Teslimat" },
  { href: "/returns", label: "İade & Değişim" },
  { href: "/privacy", label: "Gizlilik / KVKK" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${bodoniModa.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-onyx-900 text-ink font-sans">
        <header className="sticky top-0 z-40 bg-onyx-900/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
          <div className="mx-auto max-w-[1440px] h-16 md:h-[76px] flex items-center justify-between px-5 md:px-12">
            <Link
              href="/"
              className="font-display text-[20px] md:text-[22px] text-ink"
              style={{ letterSpacing: "0.22em" }}
            >
              ZESTA
            </Link>
            <nav
              className="flex items-center gap-6 md:gap-8 text-[13px]"
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
          </div>
        </header>

        <main className="flex-1 bg-onyx-900">{children}</main>

        <footer className="bg-onyx-950 border-t border-[var(--border-subtle)] mt-32">
          <div className="mx-auto max-w-[1440px] px-5 md:px-12 py-16 grid gap-10 md:grid-cols-[1.2fr_2fr]">
            <div>
              <div className="font-display text-2xl text-ink" style={{ letterSpacing: "0.22em" }}>
                ZESTA
              </div>
              <p className="mt-4 text-sm text-stone-400 max-w-xs leading-relaxed">
                El emeği, özenle hazırlanmış ürünler. Her parça elde, sipariş üzerine üretilir.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <div className="label-uppercase mb-4">Mağaza</div>
                <div className="flex flex-col gap-3 text-sm">
                  {FOOTER_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-stone-400 hover:text-ink transition-colors duration-[180ms]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)]">
            <div className="mx-auto max-w-[1440px] px-5 md:px-12 py-6 text-xs text-stone-600">
              © {new Date().getFullYear()} Zesta. Tüm hakları saklıdır.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
