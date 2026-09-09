"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { ProductListResponse } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

interface EditorialSplit {
  eyebrow: string;
  heading: string;
  body: string;
  categorySlug: string;
  categoryLabel: string;
}

const ROW_CATEGORIES = [
  { slug: "seramik", label: "Seramik" },
  { slug: "cam-sanati", label: "Cam Sanatı" },
  { slug: "biblolar", label: "Biblolar" },
];

const SPLITS: EditorialSplit[] = [
  {
    eyebrow: "Zanaat",
    heading: "Ahşabın Sıcaklığı, Elin İzi",
    body: "Zeytin, ceviz ve meşe ağacından doğan her obje, ustaların yıllara dayanan tecrübesiyle tek tek şekillendirilir. Seri üretim değil; sabırla, elle işlenmiş bir zanaat.",
    categorySlug: "ahsap-objeler",
    categoryLabel: "Ahşap Objeler",
  },
  {
    eyebrow: "Doku",
    heading: "İplikten Doğan Hikâyeler",
    body: "Makrome düğümlerinden dokuma yüzeylere, her tekstil parçası elde, sabırla işlenir. Doğal lifler ve toprak tonlarıyla evinize sıcak bir doku katar.",
    categorySlug: "el-yapimi-tekstil",
    categoryLabel: "El Yapımı Tekstil",
  },
];

export function HomeClient() {
  const [rows, setRows] = useState<Record<string, ProductListResponse | null>>({});
  const [splitProducts, setSplitProducts] = useState<Record<string, ProductListResponse | null>>({});
  const [hero, setHero] = useState<ProductListResponse | null>(null);

  useEffect(() => {
    ROW_CATEGORIES.forEach((c) => {
      api
        .get<ProductListResponse>(`/products?category=${c.slug}&pageSize=4`)
        .then((data) => setRows((r) => ({ ...r, [c.slug]: data })))
        .catch(() => setRows((r) => ({ ...r, [c.slug]: null })));
    });
    SPLITS.forEach((s) => {
      api
        .get<ProductListResponse>(`/products?category=${s.categorySlug}&pageSize=1`)
        .then((data) => setSplitProducts((r) => ({ ...r, [s.categorySlug]: data })))
        .catch(() => setSplitProducts((r) => ({ ...r, [s.categorySlug]: null })));
    });
    api
      .get<ProductListResponse>("/products?category=tasarim-heykeller&pageSize=1")
      .then(setHero)
      .catch(() => setHero(null));
  }, []);

  const heroProduct = hero?.items[0];

  return (
    <div>
      {/* HERO — split: editorial copy left, a real featured product showcased right */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 py-16 md:py-0 grid md:grid-cols-2 md:min-h-[640px] items-center gap-10 md:gap-16">
          <div className="grain relative">
            <p className="eyebrow-on-light">El İşi Atölye</p>
            <h1
              className="mt-6 font-display font-normal text-ink text-[42px] md:text-[56px] lg:text-[64px]"
              style={{ lineHeight: 0.98, letterSpacing: "-0.025em" }}
            >
              KÜÇÜK DETAYLAR.
              <br />
              <span className="text-[color:var(--text-secondary)]">BÜYÜK HİKÂYELER.</span>
            </h1>
            <p className="mt-6 text-[15px] md:text-[17px] text-ash max-w-md leading-relaxed">
              Her parça elde, sipariş üzerine, özenle üretilir. Türkiye&apos;nin dört bir yanındaki ustaların
              atölyesinden evinize.
            </p>
            <div className="mt-10 flex items-center gap-6">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-xs bg-charcoal-700 px-7 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
                style={{ letterSpacing: "0.1em" }}
              >
                ÜRÜNLERİ KEŞFET
              </Link>
              <Link
                href="/about"
                className="text-[13px] text-smoke hover:text-ink transition-colors duration-[180ms]"
                style={{ letterSpacing: "0.08em" }}
              >
                HİKÂYEMİZ →
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] md:aspect-auto md:h-[520px] bg-stone-100 rounded-sm overflow-hidden">
            {heroProduct?.images[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroProduct.images[0].url}
                alt={heroProduct.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-sm text-stone-500">Öne çıkan ürün</span>
              </div>
            )}
            {heroProduct && (
              <Link
                href={`/product/${heroProduct.slug}`}
                className="absolute bottom-5 right-5 inline-flex h-11 items-center justify-center rounded-full bg-[var(--ivory-50)] px-6 text-[11px] font-medium text-ink shadow-[var(--shadow-md)] transition-colors duration-[180ms] hover:bg-mist-100"
                style={{ letterSpacing: "0.1em" }}
              >
                ŞİMDİ KEŞFET →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-warm-ivory py-14 md:py-20">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 grid gap-10 sm:grid-cols-3 text-center sm:text-left">
          {[
            {
              title: "El Yapımı",
              body: "Her parça, usta ellerde tek tek şekillendirilir. Seri üretim değil, zanaat.",
            },
            {
              title: "Sipariş Üzerine",
              body: "Ürünler stoklamak için değil, siparişinize özel, özenle hazırlanır.",
            },
            {
              title: "Özenle Paketlenir",
              body: "Her sipariş, kırılmaya karşı özenle sarılıp elinize zarar görmeden ulaşır.",
            },
          ].map((item) => (
            <div key={item.title}>
              <p className="eyebrow-on-light">{item.title}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--text-on-light-secondary)]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CategoryRow slug={ROW_CATEGORIES[0].slug} label={ROW_CATEGORIES[0].label} data={rows[ROW_CATEGORIES[0].slug]} />

      <EditorialSplitSection split={SPLITS[0]} data={splitProducts[SPLITS[0].categorySlug]} reverse={false} />

      <CategoryRow slug={ROW_CATEGORIES[1].slug} label={ROW_CATEGORIES[1].label} data={rows[ROW_CATEGORIES[1].slug]} />

      <EditorialSplitSection split={SPLITS[1]} data={splitProducts[SPLITS[1].categorySlug]} reverse={true} />

      <CategoryRow slug={ROW_CATEGORIES[2].slug} label={ROW_CATEGORIES[2].label} data={rows[ROW_CATEGORIES[2].slug]} />
    </div>
  );
}

function CategoryRow({ slug, label, data }: { slug: string; label: string; data: ProductListResponse | null | undefined }) {
  return (
    <section className="py-14 md:py-20 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow-on-light">Koleksiyon</p>
            <h2
              className="mt-2 font-display text-[28px] md:text-[36px] font-normal text-ink"
              style={{ lineHeight: 1.05 }}
            >
              {label}
            </h2>
          </div>
          <Link
            href={`/category/${slug}`}
            className="hidden sm:inline text-[12px] text-smoke hover:text-ink transition-colors duration-[180ms] whitespace-nowrap"
            style={{ letterSpacing: "0.1em" }}
          >
            TÜMÜNÜ GÖR →
          </Link>
        </div>

        {!data ? (
          <p className="text-sm text-ash">Yükleniyor...</p>
        ) : data.items.length === 0 ? (
          <p className="text-sm text-ash">Bu kategoride henüz ürün yok.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-5">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <Link
          href={`/category/${slug}`}
          className="sm:hidden mt-6 inline-block text-[12px] text-smoke hover:text-ink transition-colors duration-[180ms]"
          style={{ letterSpacing: "0.1em" }}
        >
          TÜMÜNÜ GÖR →
        </Link>
      </div>
    </section>
  );
}

function EditorialSplitSection({
  split,
  data,
  reverse,
}: {
  split: EditorialSplit;
  data: ProductListResponse | null | undefined;
  reverse: boolean;
}) {
  const product = data?.items[0];

  return (
    <section className="bg-warm-ivory py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-12 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className={reverse ? "md:order-2" : ""}>
          <p className="eyebrow-on-light">{split.eyebrow}</p>
          <h2
            className="mt-4 font-display text-[30px] md:text-[40px] font-normal text-ink"
            style={{ lineHeight: 1.08 }}
          >
            {split.heading}
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-[color:var(--text-on-light-secondary)] max-w-md">
            {split.body}
          </p>
          <Link
            href={`/category/${split.categorySlug}`}
            className="mt-8 inline-flex text-[12px] font-medium text-ink hover:text-[color:var(--text-secondary)] transition-colors duration-[180ms]"
            style={{ letterSpacing: "0.1em" }}
          >
            KOLEKSİYONU KEŞFET →
          </Link>
        </div>

        <div className={reverse ? "md:order-1" : ""}>
          {product ? (
            <div className="max-w-sm">
              <ProductCard product={product} />
            </div>
          ) : (
            <div className="aspect-square max-w-sm bg-stone-200 rounded-sm" />
          )}
        </div>
      </div>
    </section>
  );
}
