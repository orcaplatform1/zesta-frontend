"use client";

import Image from "next/image";
import Link from "next/link";
import type { HomeData, ProductListResponse, Category } from "@/lib/types";
import { ProductStrip } from "@/components/ProductStrip";
import { CampaignBanner } from "@/components/CampaignBanner";
import { QuickAccess } from "@/components/QuickAccess";
import { BoxIcon, ClockIcon, HandIcon } from "@/components/HeaderIcons";
import type { HomepageEditorialSplit } from "@/lib/homepage-content";

// İndirim filtresi mevcut olmadığından kutular /magaza'ya gider.
const DISCOUNT_BOXES = [
  { label: "%5", sub: "İndirim" },
  { label: "%10", sub: "İndirim" },
  { label: "%30", sub: "İndirim" },
  { label: "%50 ve üzeri", sub: "İndirim" },
];

const VALUE_ICONS = [<HandIcon key="h" size={20} />, <ClockIcon key="c" size={20} />, <BoxIcon key="b" size={20} />];

export function HomeClient({ data }: { data: HomeData; categories?: Category[] }) {
  const { content, rows, rowRatings, splitProducts, hero, vitrin } = data;

  const heroProduct = hero?.items[0];
  const rowCount = Math.max(content.categoryRows.length, content.editorialSplits.length);

  return (
    <div>
      {/* Hızlı erişim ikonları */}
      <QuickAccess />

      {/* Öne Çıkan Ürünler — koyu zemin */}
      {vitrin.items.length > 0 && (
        <section className="py-8 md:py-10" style={{ background: "var(--zesta-primary-dark)" }}>
          <div className="mx-auto max-w-[1200px] px-4 lg:px-5">
            <ProductStrip
              title="Öne Çıkan Ürünler"
              href={vitrin.category ? `/kategori/${vitrin.category.slug}` : "/magaza"}
              items={vitrin.items}
              ratings={vitrin.ratings}
              dark
            />
          </div>
        </section>
      )}

      {/* İndirimleri İncele */}
      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-5">
          <h2 className="mb-4 text-[18px] font-bold md:text-[20px]" style={{ color: "var(--zesta-text)" }}>
            İndirimleri İncele
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {DISCOUNT_BOXES.map((box) => (
              <Link
                key={box.label}
                href="/magaza"
                className="flex h-[96px] flex-col items-center justify-center text-center transition-transform duration-[200ms] hover:-translate-y-0.5 md:h-[120px]"
                style={{ background: "var(--zesta-primary)", color: "var(--text-on-dark)", borderRadius: "var(--radius-md)" }}
              >
                <span className="text-[22px] font-extrabold leading-none md:text-[30px]">{box.label}</span>
                <span className="mt-1.5 text-[12px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: "var(--accent-300)" }}>
                  {box.sub}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Kampanya banner'ı — Hero */}
      <CampaignBanner
        as="h1"
        eyebrow={content.hero.eyebrow}
        title={content.hero.headingLine1}
        titleSecond={content.hero.headingLine2}
        image={heroProduct?.images[0]?.url}
        imageAlt={heroProduct?.name ?? "Öne çıkan ürün"}
        imageHref={heroProduct ? `/urun/${heroProduct.slug}` : undefined}
        body={content.hero.body}
        ctas={[
          { label: content.hero.ctaLabel, href: "/magaza", primary: true },
          { label: content.hero.secondaryCtaLabel, href: "/hikayemiz" },
        ]}
        dark
      />

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
            <EditorialBanner split={content.editorialSplits[i]} data={splitProducts[content.editorialSplits[i].categorySlug]} />
          )}
        </div>
      ))}

      {/* Tasarımcı CTA — kampanya banner yapısı */}
      <CampaignBanner
        eyebrow="Gerçek Hikâyeler, Özgün Üretimler"
        title="Elinizin Emeğini Binlerce Kişiyle Buluşturun."
        image="/designer-cta/seramik.jpg"
        imageAlt="Seramik ustası"
        body="Seramikten cam sanatına, ahşap oymacılıktan tekstile — ürettiğiniz her parça için bir vitrin arıyorsanız doğru yerdesiniz. Zesta Tasarımcı Paneli üzerinden ürünlerinizi ekleyin, satışlarınızı tek ekrandan takip edin, kazancınızı düzenli olarak çekin."
        ctas={[
          { label: "TASARIMCI BAŞVURUSU YAP →", href: "/tasarimci-basvuru", primary: true },
          { label: "PANELE GİRİŞ", href: "/tasarimci-giris" },
        ]}
        dark
      />

      {/* Güvenli Kargo banner'ı */}
      <section className="pt-6">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-5">
          <div className="relative aspect-[3/1] w-full overflow-hidden md:aspect-[2172/724]" style={{ borderRadius: "var(--radius-md)" }}>
            <Image src="/guvenlikargo.png" alt="Güvenli Kargo" fill sizes="(min-width: 1200px) 1200px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Değer önerileri — footer üstünde ince şerit */}
      <section className="relative -mb-32 mt-8" style={{ background: "var(--zesta-surface)", borderTop: "1px solid var(--zesta-border)" }}>
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-3 lg:px-5">
          {content.trustStrip.map((item, i) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="flex-shrink-0" style={{ color: "var(--zesta-primary)" }}>
                {VALUE_ICONS[i % VALUE_ICONS.length]}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold" style={{ color: "var(--zesta-text)" }}>
                  {item.title}
                </p>
                <p className="truncate text-[12px]" style={{ color: "var(--text-secondary)" }} title={item.body}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
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
    <section className="py-6 md:py-8">
      <div className="mx-auto max-w-[1200px] px-4 lg:px-5">
        {!data || data.items.length === 0 ? (
          <>
            <h2 className="mb-3 text-[18px] font-bold md:text-[20px]" style={{ color: "var(--zesta-text)" }}>
              {label}
            </h2>
            <p className="text-sm text-ash">Bu kategoride henüz ürün yok.</p>
          </>
        ) : (
          <ProductStrip
            title={label}
            href={`/kategori/${slug}`}
            items={data.items}
            ratings={data.items.every((p) => p.id in ratings) ? ratings : undefined}
          />
        )}
      </div>
    </section>
  );
}

function EditorialBanner({ split, data }: { split: HomepageEditorialSplit; data: ProductListResponse | null | undefined }) {
  const product = data?.items[0];
  return (
    <CampaignBanner
      eyebrow={split.eyebrow}
      title={split.heading}
      image={product?.images[0]?.url}
      imageAlt={product?.name ?? split.categoryLabel}
      imageHref={product ? `/urun/${product.slug}` : undefined}
      body={split.body}
      ctas={[{ label: "KOLEKSİYONU KEŞFET →", href: `/kategori/${split.categorySlug}`, primary: true }]}
    />
  );
}
