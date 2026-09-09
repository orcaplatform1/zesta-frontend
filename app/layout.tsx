import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zesta — El İşi Ürünler",
  description: "El emeği, özenle hazırlanmış ürünler.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <header className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              Zesta
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/shop">Ürünler</Link>
              <Link href="/account">Hesabım</Link>
              <Link href="/cart">Sepet</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-neutral-200 mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-500 flex flex-wrap gap-x-6 gap-y-2 justify-between">
            <span>© {new Date().getFullYear()} Zesta</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/about">Hakkımızda</Link>
              <Link href="/contact">İletişim</Link>
              <Link href="/shipping">Kargo & Teslimat</Link>
              <Link href="/returns">İade & Değişim</Link>
              <Link href="/privacy">Gizlilik / KVKK</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
