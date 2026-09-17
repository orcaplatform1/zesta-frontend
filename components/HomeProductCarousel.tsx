import Link from "next/link";
import { ProductCarousel } from "@/components/ProductCarousel";
import type { HomeVitrin } from "@/lib/types";

// Vitrin verisi (rastgele secilmis kategori + urunleri + puan ozeti) artik
// sunucuda /home endpoint'i tarafindan hazirlaniyor (bkz. backend
// src/home/home.service.ts getVitrin) — burada sadece render ediliyor.
export function HomeProductCarousel({ vitrin }: { vitrin: HomeVitrin }) {
  const { category, items, ratings } = vitrin;

  if (items.length === 0) return null;

  return (
    <section className="py-14 md:py-20 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow-on-light">Vitrin</p>
            <h2 className="mt-2 font-display text-[28px] md:text-[36px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
              {category?.name ?? ""}
            </h2>
          </div>
          {category && (
            <Link
              href={`/kategori/${category.slug}`}
              className="hidden sm:inline text-[12px] text-smoke hover:text-ink transition-colors duration-[180ms] whitespace-nowrap"
              style={{ letterSpacing: "0.1em" }}
            >
              TÜMÜNÜ GÖR →
            </Link>
          )}
        </div>

        <ProductCarousel items={items} ratings={ratings} />
      </div>
    </section>
  );
}
