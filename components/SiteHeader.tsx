"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/types";
import { MobileNav } from "@/components/MobileNav";
import { AccountNavMenu } from "@/components/AccountNavMenu";
import { HeaderSearch } from "@/components/HeaderSearch";
import { CategoryTabs } from "@/components/CategoryTabs";
import { BagIcon, HeartIcon } from "@/components/HeaderIcons";

// Tüm sayfalarda ortak header. Sepet ve ürün detay sayfalarında mobilde
// sayfanın kendi üst çubuğu kullanıldığı için ana header mobilde gizlenir.
export function SiteHeader({ categories }: { categories: Category[] }) {
  const pathname = usePathname() ?? "";
  const ownMobileBar = pathname === "/sepet" || pathname.startsWith("/urun/");

  return (
    <header
      className={`sticky top-9 z-40 ${ownMobileBar ? "hidden md:block" : ""}`}
      style={{ background: "var(--zesta-surface)", borderBottom: "1px solid var(--zesta-border)" }}
    >
      <div className="mx-auto max-w-[1200px] px-4 lg:px-5">
        {/* Üst satır */}
        <div className="flex h-14 items-center gap-3 md:h-[72px] md:gap-6">
          <MobileNav categories={categories} />
          <Link href="/" className="flex flex-shrink-0 items-center" aria-label="Zesta ana sayfa">
            <Image
              src="/logo.png"
              alt="Zesta"
              width={2172}
              height={724}
              priority
              unoptimized
              className="h-8 w-auto object-contain md:h-10"
              style={{ maxWidth: "150px" }}
            />
          </Link>

          <div className="hidden flex-1 md:block">
            <HeaderSearch />
          </div>

          <div className="ml-auto flex items-center gap-0.5 md:ml-0 md:gap-2">
            <Link href="/hesap/favorilerim" aria-label="Favorilerim" className="header-action">
              <HeartIcon size={20} />
              <span className="header-action-label">Favorilerim</span>
            </Link>
            <AccountNavMenu />
            <Link href="/sepet" aria-label="Sepet" className="header-action">
              <BagIcon size={20} />
              <span className="header-action-label">Sepetim</span>
            </Link>
          </div>
        </div>

        {/* Mobil: tam genişlik arama */}
        <div className="pb-3 md:hidden">
          <HeaderSearch />
        </div>

        {/* Desktop/tablet: kategori sekmeleri */}
        <div className="hidden md:block">
          <CategoryTabs categories={categories} />
        </div>
      </div>
    </header>
  );
}
