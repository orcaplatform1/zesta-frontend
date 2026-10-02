import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import type { HomeVitrin } from "@/lib/types";

// Vitrin verisi /home endpoint'inden geliyor. İlk 4 ürünü "Öne Çıkan" grid
// olarak gösterir — masaüstünde 4 kolon, tablete 2-3, mobilde 2.
export function HomeProductCarousel({ vitrin }: { vitrin: HomeVitrin }) {
  const { category, items, ratings } = vitrin;

  if (items.length === 0) return null;

  const featured = items.slice(0, 4);

  return (
    <section className="py-16 md:py-24" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <div className="mx-auto max-w-[1280px] px-5 md:px-12">
        {/* Heading */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow-muted">Öne Çıkan Ürünler</p>
            <h2
              className="mt-3 font-display font-normal text-ink"
              style={{ fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.05, letterSpacing: "-0.015em" }}
            >
              Ustaların Emeği,
              <br />
              Sizin İçin
            </h2>
            <p className="mt-3 text-[14px] max-w-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Her biri özenle seçilmiş, el emeğiyle üretilmiş özel parçalar.
            </p>
          </div>
          {category && (
            <Link
              href={`/kategori/${category.slug}`}
              className="hidden sm:inline-flex items-center gap-1 text-[12px] font-medium transition-colors duration-[200ms] hover:text-ink whitespace-nowrap"
              style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
            >
              Tüm Ürünleri Gör →
            </Link>
          )}
        </div>

        {/* 4-kolon ürün grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              rating={ratings[product.id]}
            />
          ))}
        </div>

        {category && (
          <div className="mt-8 sm:hidden text-center">
            <Link
              href={`/kategori/${category.slug}`}
              className="inline-flex h-[46px] items-center justify-center px-6 font-medium text-[12px] transition-all duration-[240ms] hover:-translate-y-[1px]"
              style={{
                color: "var(--zesta-primary)",
                border: "1px solid var(--primary-200)",
                borderRadius: "var(--radius-md)",
                letterSpacing: "0.08em",
              }}
            >
              Tüm Ürünleri Gör →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
