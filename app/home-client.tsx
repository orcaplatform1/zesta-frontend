"use client";

import Image from "next/image";
import Link from "next/link";
import type { HomeData, ProductListResponse } from "@/lib/types";
import { ProductCarousel } from "@/components/ProductCarousel";
import { HomeProductCarousel } from "@/components/HomeProductCarousel";
import type { HomepageEditorialSplit } from "@/lib/homepage-content";
import { useInView } from "@/lib/use-in-view";

export function HomeClient({ data }: { data: HomeData }) {
  const { content, rows, rowRatings, splitProducts, hero, vitrin } = data;

  const heroProduct = hero?.items[0];
  const rowCount = Math.max(content.categoryRows.length, content.editorialSplits.length);

  return (
    <div>
      {/* ── HERO — dark teal, editorial split ── */}
      <section
        className="relative overflow-hidden grain"
        style={{ background: "var(--zesta-primary-dark)" }}
      >
        <div className="mx-auto max-w-[1280px] px-5 md:px-12 pt-14 md:pt-0 grid md:grid-cols-2 md:min-h-[680px] items-center gap-10 md:gap-14">
          {/* LEFT — editorial copy */}
          <div className="hero-copy-in pb-6 md:pb-0">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1
              className="mt-5 font-display font-normal"
              style={{
                color: "var(--text-on-dark)",
                fontSize: "clamp(46px, 5.5vw, 76px)",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
              }}
            >
              {content.hero.headingLine1}
              <br />
              <span style={{ color: "var(--text-on-dark)", opacity: 0.78 }}>
                {content.hero.headingLine2}
              </span>
            </h1>
            <p
              className="mt-6 max-w-md leading-relaxed"
              style={{ color: "var(--text-on-dark-muted)", fontSize: "16px" }}
            >
              {content.hero.body}
            </p>
            <div className="mt-10 flex items-center gap-6 flex-wrap">
              <Link
                href="/magaza"
                className="inline-flex items-center justify-center font-semibold text-white transition-all duration-[240ms] hover:-translate-y-[2px]"
                style={{
                  height: "52px",
                  padding: "0 28px",
                  background: "var(--zesta-accent)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                }}
              >
                {content.hero.ctaLabel}
              </Link>
              <Link
                href="/hikayemiz"
                className="transition-colors duration-[200ms] hover:opacity-100"
                style={{
                  fontSize: "13px",
                  color: "var(--text-on-dark-muted)",
                  letterSpacing: "0.08em",
                  opacity: 0.75,
                }}
              >
                {content.hero.secondaryCtaLabel} →
              </Link>
            </div>

            {/* Trust badges — inside hero left column */}
            <div
              className="mt-12 flex flex-col sm:flex-row gap-5 pt-8"
              style={{ borderTop: "1px solid rgba(244,241,233,0.11)" }}
            >
              {content.trustStrip.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0"
                    style={{ background: "rgba(196,134,90,0.28)", border: "1px solid rgba(196,134,90,0.5)" }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.13em",
                        textTransform: "uppercase",
                        color: "var(--text-on-dark)",
                      }}
                    >
                      {item.title}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-on-dark-muted)", marginTop: "2px" }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — hero product image */}
          <div
            className="hero-image-in relative aspect-[4/5] md:aspect-auto md:h-[620px] overflow-hidden"
            style={{ borderRadius: "var(--radius-xl)" }}
          >
            {heroProduct?.images[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroProduct.images[0].url}
                alt={heroProduct.name}
                className="hero-kenburns h-full w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full flex items-center justify-center"
                style={{ background: "var(--primary-800)" }}
              >
                <span className="text-sm" style={{ color: "var(--text-on-dark-muted)" }}>
                  Öne çıkan ürün
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {heroProduct && (
              <Link
                href={`/urun/${heroProduct.slug}`}
                className="absolute bottom-5 right-5 inline-flex items-center justify-center font-medium transition-all duration-[220ms] hover:-translate-y-[1px]"
                style={{
                  height: "44px",
                  padding: "0 20px",
                  background: "rgba(250,248,243,0.92)",
                  color: "var(--zesta-text)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  backdropFilter: "blur(8px)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                ÜRÜNÜ İNCELE →
              </Link>
            )}
          </div>
        </div>

        {/* Organic curved bottom — transitions into page bg */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden" style={{ lineHeight: 0 }}>
          <svg
            viewBox="0 0 1440 52"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "40px", display: "block" }}
          >
            <path d="M0,52 C400,4 1040,52 1440,18 L1440,52 Z" fill="var(--zesta-bg)" />
          </svg>
        </div>
      </section>

      {/* ── ARTISAN SECTION — dark teal ── */}
      <section style={{ background: "var(--zesta-primary-dark)" }} className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-5 md:px-12 grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-center">
          <div>
            <p className="eyebrow">Zesta&apos;da Satış Yap</p>
            <h2
              className="mt-4 font-display font-normal"
              style={{ lineHeight: 1.06, color: "var(--text-on-dark)", fontSize: "clamp(26px, 3.2vw, 42px)", letterSpacing: "-0.015em" }}
            >
              Elinizin Emeğini Binlerce Kişiyle Buluşturun.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed max-w-lg" style={{ color: "var(--text-on-dark-muted)" }}>
              Seramikten cam sanatına, ahşap oymacılıktan tekstile — ürettiğiniz her parça için bir vitrin arıyorsanız
              doğru yerdesiniz. Zesta Tasarımcı Paneli üzerinden ürünlerinizi ekleyin, satışlarınızı tek ekrandan
              takip edin, kazancınızı düzenli olarak çekin.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <Link
              href="/tasarimci-basvuru"
              className="inline-flex items-center justify-center font-semibold text-white transition-all duration-[240ms] hover:-translate-y-[2px]"
              style={{
                height: "48px",
                width: "220px",
                background: "var(--zesta-accent)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                letterSpacing: "0.1em",
              }}
            >
              BAŞVURU YAP
            </Link>
            <Link
              href="/tasarimci-giris"
              className="inline-flex items-center justify-center font-medium transition-all duration-[240ms] hover:-translate-y-[1px]"
              style={{
                height: "48px",
                width: "220px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(244,241,233,0.20)",
                color: "var(--text-on-dark)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                letterSpacing: "0.1em",
              }}
            >
              PANELE GİRİŞ YAP
            </Link>
          </div>
        </div>
      </section>

      <HomeProductCarousel vitrin={vitrin} />

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

      {/* Güvenli kargo banner */}
      <div className="relative -mb-32 w-full aspect-[3/1] md:aspect-[2172/724]">
        <Image
          src="/guvenlikargo.png"
          alt="Güvenli Kargo"
          fill
          sizes="100vw"
          className="object-cover"
        />
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
    <section
      className="py-16 md:py-24"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <div className="mx-auto max-w-[1280px] px-5 md:px-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow-muted">Koleksiyon</p>
            <h2
              className="mt-3 font-display font-normal text-ink"
              style={{ fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.05, letterSpacing: "-0.015em" }}
            >
              {label}
            </h2>
          </div>
          <Link
            href={`/kategori/${slug}`}
            className="hidden sm:inline-flex items-center gap-1 text-[12px] font-medium transition-colors duration-[200ms] hover:text-ink whitespace-nowrap"
            style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
          >
            TÜMÜNÜ GÖR →
          </Link>
        </div>

        {!data || data.items.length === 0 ? (
          <p className="text-sm text-ash">Bu kategoride henüz ürün yok.</p>
        ) : (
          <ProductCarousel items={data.items} ratings={ratings} />
        )}

        <Link
          href={`/kategori/${slug}`}
          className="sm:hidden mt-6 inline-block text-[12px] font-medium transition-colors duration-[200ms]"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
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
    <section
      className="py-16 md:py-24"
      style={{ background: "var(--zesta-surface-muted)" }}
    >
      <div className="mx-auto max-w-[1280px] px-5 md:px-12 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className={reverse ? "md:order-2" : ""}>
          <p className="eyebrow-muted">{split.eyebrow}</p>
          <h2
            className="mt-4 font-display font-normal text-ink"
            style={{ fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.06, letterSpacing: "-0.015em" }}
          >
            {split.heading}
          </h2>
          <p
            className="mt-5 text-[15px] leading-relaxed max-w-md"
            style={{ color: "var(--text-secondary)" }}
          >
            {split.body}
          </p>
          <Link
            href={`/kategori/${split.categorySlug}`}
            className="mt-8 inline-flex items-center gap-1 text-[12px] font-semibold transition-colors duration-[200ms] hover:text-ink"
            style={{ color: "var(--zesta-primary)", letterSpacing: "0.1em" }}
          >
            KOLEKSİYONU KEŞFET →
          </Link>
        </div>

        <div
          ref={ref}
          className={`relative aspect-[4/5] md:aspect-auto md:h-[500px] overflow-hidden transition-all duration-700 ease-[var(--ease-luxury)] ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } ${reverse ? "md:order-1" : ""}`}
          style={{ borderRadius: "var(--radius-xl)", background: "var(--stone-100)" }}
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
              className="absolute bottom-5 right-5 inline-flex items-center justify-center font-medium transition-all duration-[220ms] hover:-translate-y-[1px]"
              style={{
                height: "44px",
                padding: "0 20px",
                background: "rgba(250,248,243,0.92)",
                color: "var(--zesta-text)",
                borderRadius: "var(--radius-full)",
                fontSize: "11px",
                letterSpacing: "0.1em",
                backdropFilter: "blur(8px)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              ÜRÜNÜ İNCELE →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
