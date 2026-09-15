"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import type { ProductListResponse } from "@/lib/types";
import { ProductCarousel } from "@/components/ProductCarousel";
import { HomeProductCarousel } from "@/components/HomeProductCarousel";
import { DEFAULT_HOMEPAGE_CONTENT, type HomepageContent, type HomepageEditorialSplit } from "@/lib/homepage-content";
import { useInView } from "@/lib/use-in-view";

export function HomeClient() {
  const [content, setContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [rows, setRows] = useState<Record<string, ProductListResponse | null>>({});
  const [rowRatings, setRowRatings] = useState<Record<string, Record<string, { average: number; count: number }>>>({});
  const [splitProducts, setSplitProducts] = useState<Record<string, ProductListResponse | null>>({});
  const [hero, setHero] = useState<ProductListResponse | null>(null);

  useEffect(() => {
    api
      .get<Record<string, unknown>>("/settings")
      .then((settings) => {
        const stored = settings.homepage_content as HomepageContent | undefined;
        if (stored) setContent(stored);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    content.categoryRows.forEach((c) => {
      api
        .get<ProductListResponse>(`/products?category=${c.slug}&pageSize=4`)
        .then((data) => {
          setRows((r) => ({ ...r, [c.slug]: data }));
          const ids = data.items.map((p) => p.id).join(",");
          if (ids) {
            api
              .get<Record<string, { average: number; count: number }>>(`/reviews/summary?productIds=${ids}`)
              .then((summary) => setRowRatings((r) => ({ ...r, [c.slug]: summary })))
              .catch(() => {});
          }
        })
        .catch(() => setRows((r) => ({ ...r, [c.slug]: null })));
    });
    content.editorialSplits.forEach((s) => {
      api
        .get<ProductListResponse>(`/products?category=${s.categorySlug}&pageSize=1`)
        .then((data) => setSplitProducts((r) => ({ ...r, [s.categorySlug]: data })))
        .catch(() => setSplitProducts((r) => ({ ...r, [s.categorySlug]: null })));
    });
    api
      .get<ProductListResponse>(`/products?category=${content.hero.heroCategorySlug}&pageSize=1`)
      .then(setHero)
      .catch(() => setHero(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const heroProduct = hero?.items[0];
  const rowCount = Math.max(content.categoryRows.length, content.editorialSplits.length);

  return (
    <div>
      {/* HERO — split: editorial copy left, a real featured product showcased right */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 py-16 md:py-0 grid md:grid-cols-2 md:min-h-[680px] items-center gap-10 md:gap-16">
          <div className="hero-copy-in grain relative">
            <p className="eyebrow-on-light">{content.hero.eyebrow}</p>
            <h1
              className="mt-6 font-display font-normal text-ink text-[42px] md:text-[56px] lg:text-[64px]"
              style={{ lineHeight: 0.98, letterSpacing: "-0.025em" }}
            >
              {content.hero.headingLine1}
              <br />
              <span className="text-[color:var(--text-secondary)]">{content.hero.headingLine2}</span>
            </h1>
            <p className="mt-6 text-[15px] md:text-[17px] text-ash max-w-md leading-relaxed">{content.hero.body}</p>
            <div className="mt-10 flex items-center gap-6">
              <span className="zesta-glow-ring">
                <Link
                  href="/magaza"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-charcoal-700 px-7 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {content.hero.ctaLabel}
                </Link>
              </span>
              <Link
                href="/hikayemiz"
                className="text-[13px] text-smoke hover:text-ink transition-colors duration-[180ms]"
                style={{ letterSpacing: "0.08em" }}
              >
                {content.hero.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="hero-image-in relative aspect-[4/5] md:aspect-auto md:h-[620px] bg-stone-100 rounded-sm overflow-hidden">
            {heroProduct?.images[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroProduct.images[0].url}
                alt={heroProduct.name}
                className="hero-kenburns h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-sm text-stone-500">Öne çıkan ürün</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            {heroProduct && (
              <Link
                href={`/urun/${heroProduct.slug}`}
                className="absolute bottom-5 right-5 inline-flex h-11 items-center justify-center rounded-full bg-[var(--ivory-50)] px-6 text-[11px] font-medium text-ink shadow-[var(--shadow-md)] transition-colors duration-[180ms] hover:bg-mist-100"
                style={{ letterSpacing: "0.1em" }}
              >
                ŞİMDİ KEŞFET →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ZESTA'DA SATIŞ YAP — tasarımcı/üretici davet bloğu */}
      <section className="bg-onyx-950 py-16 md:py-20">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-center">
          <div>
            <p className="eyebrow-on-light" style={{ color: "var(--zesta-green)" }}>
              Zesta&apos;da Satış Yap
            </p>
            <h2
              className="mt-3 font-display font-normal text-[28px] md:text-[38px]"
              style={{ lineHeight: 1.08, color: "var(--text-on-dark)" }}
            >
              Elinizin Emeğini Binlerce Kişiyle Buluşturun.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-mist-200 max-w-lg">
              Seramikten cam sanatına, ahşap oymacılıktan tekstile — ürettiğiniz her parça için bir vitrin arıyorsanız
              doğru yerdesiniz. Zesta Tasarımcı Paneli üzerinden ürünlerinizi ekleyin, satışlarınızı tek ekrandan
              takip edin, kazancınızı düzenli olarak çekin.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="zesta-glow-ring">
              <Link
                href="/tasarimci-basvuru"
                className="flex h-12 items-center justify-center rounded-full bg-[var(--zesta-green)] px-7 text-[12px] font-medium text-white transition-opacity duration-[180ms] hover:opacity-90"
                style={{ letterSpacing: "0.1em" }}
              >
                ZESTA TASARIMCI PANELİ — BAŞVURU YAP
              </Link>
            </span>
            <Link
              href="/tasarimci-giris"
              className="flex h-12 items-center justify-center rounded-full border border-[var(--border-light)] px-7 text-[12px] font-medium text-[var(--text-on-dark)] transition-colors duration-[180ms] hover:bg-onyx-700"
              style={{ letterSpacing: "0.1em" }}
            >
              ZESTA TASARIMCI PANELİ — GİRİŞ YAP
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-warm-ivory py-14 md:py-20">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 grid gap-10 sm:grid-cols-3 text-center sm:text-left">
          {content.trustStrip.map((item) => (
            <div key={item.title}>
              <p className="eyebrow-on-light">{item.title}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--text-on-light-secondary)]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <HomeProductCarousel />

      {Array.from({ length: rowCount }).map((_, i) => (
        <div key={i}>
          {content.categoryRows[i] && (
            <CategoryRow
              slug={content.categoryRows[i].slug}
              label={content.categoryRows[i].label}
              data={rows[content.categoryRows[i].slug]}
              ratings={rowRatings[content.categoryRows[i].slug] ?? {}}
            />
          )}
          {content.editorialSplits[i] && (
            <EditorialSplitSection
              split={content.editorialSplits[i]}
              data={splitProducts[content.editorialSplits[i].categorySlug]}
              reverse={i % 2 === 1}
            />
          )}
        </div>
      ))}

      {/* Güvenli kargo banner'ı — footer'ın hemen üstünde, son kategori
          satırının (Biblolar) altında, tam genişlik */}
      <div className="relative w-full aspect-[3/1] md:aspect-[2172/724]">
        <Image src="/guvenlikargo.png" alt="Güvenli Kargo" fill unoptimized className="object-cover" />
      </div>
    </div>
  );
}

function CategoryRow({
  slug,
  label,
  data,
  ratings,
}: {
  slug: string;
  label: string;
  data: ProductListResponse | null | undefined;
  ratings: Record<string, { average: number; count: number }>;
}) {
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
            href={`/kategori/${slug}`}
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
          <ProductCarousel items={data.items} ratings={ratings} />
        )}

        <Link
          href={`/kategori/${slug}`}
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
  split: HomepageEditorialSplit;
  data: ProductListResponse | null | undefined;
  reverse: boolean;
}) {
  const product = data?.items[0];
  const { ref, inView } = useInView<HTMLDivElement>();

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
            href={`/kategori/${split.categorySlug}`}
            className="mt-8 inline-flex text-[12px] font-medium text-ink hover:text-[color:var(--text-secondary)] transition-colors duration-[180ms]"
            style={{ letterSpacing: "0.1em" }}
          >
            KOLEKSİYONU KEŞFET →
          </Link>
        </div>

        <div
          ref={ref}
          className={`relative aspect-[4/5] md:aspect-auto md:h-[480px] bg-stone-100 rounded-sm overflow-hidden transition-all duration-700 ease-[var(--ease-luxury)] ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } ${reverse ? "md:order-1" : ""}`}
        >
          {product?.images[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0].url}
              alt={product.name}
              className="hero-kenburns h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-sm text-stone-500">{split.categoryLabel}</span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          {product && (
            <Link
              href={`/urun/${product.slug}`}
              className="absolute bottom-5 right-5 inline-flex h-11 items-center justify-center rounded-full bg-[var(--ivory-50)] px-6 text-[11px] font-medium text-ink shadow-[var(--shadow-md)] transition-colors duration-[180ms] hover:bg-mist-100"
              style={{ letterSpacing: "0.1em" }}
            >
              ÜRÜNÜ İNCELE →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
