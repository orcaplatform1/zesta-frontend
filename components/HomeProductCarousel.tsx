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
    <section className="py-16 md:py-24" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <div className="mx-auto max-w-[1280px] px-5 md:px-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow-muted">Vitrin</p>
            <h2
              className="mt-3 font-display font-normal text-ink"
              style={{ fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.05, letterSpacing: "-0.015em" }}
            >
              {category?.name ?? ""}
            </h2>
          </div>
          {category && (
            <Link
              href={`/kategori/${category.slug}`}
              className="hidden sm:inline-flex items-center gap-1 text-[12px] font-medium transition-colors duration-[200ms] hover:text-ink whitespace-nowrap"
              style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
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
