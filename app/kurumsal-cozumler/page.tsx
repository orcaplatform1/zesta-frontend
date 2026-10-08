"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { DEFAULT_CORPORATE_PAGE, type CorporatePageContent } from "@/lib/site-pages-content";

const STEPS = [
  {
    num: "01",
    title: "İhtiyaç Analizi",
    body: "Projenizin kapsamını, mekanınızın ruhunu ve hedefinizi birlikte değerlendiriyoruz.",
  },
  {
    num: "02",
    title: "Özel Seçki",
    body: "Atölyemizden mevcut koleksiyonu veya sıfırdan tasarlanmış ürünleri sunuyoruz.",
  },
  {
    num: "03",
    title: "Üretim & Teslimat",
    body: "Onaylanan tasarımlar atölyemizde el emeğiyle tamamlanır, özenle paketlenir ve teslim edilir.",
  },
];

const CARD_ICONS = ["◈", "◉", "◆", "◇", "◎", "◐"];

export default function CorporatePage() {
  const [content, setContent] = useState<CorporatePageContent>(DEFAULT_CORPORATE_PAGE);

  useEffect(() => {
    api
      .get<Record<string, unknown>>("/settings")
      .then((settings) => {
        const stored = settings.corporate_page_content as CorporatePageContent | undefined;
        if (stored) setContent(stored);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero — koyu, editorial */}
      <section
        className="grain relative overflow-hidden"
        style={{ background: "var(--zesta-primary-dark)" }}
      >
        {/* Dekoratif yatay çizgiler */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(244,241,233,1) 59px, rgba(244,241,233,1) 60px)",
          }}
        />
        <div className="relative mx-auto max-w-[1100px] px-5 md:px-12 pt-24 pb-20 md:pt-32 md:pb-28">
          <p
            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-8"
            style={{ color: "var(--zesta-accent)" }}
          >
            Zesta — {content.eyebrow}
          </p>
          <h1
            className="font-display font-normal max-w-3xl"
            style={{
              fontSize: "clamp(38px, 5.5vw, 68px)",
              lineHeight: 1.03,
              letterSpacing: "-0.02em",
              color: "var(--text-on-dark)",
            }}
          >
            {content.heading}
          </h1>
          <p
            className="mt-8 text-[15px] md:text-[17px] leading-relaxed max-w-2xl"
            style={{ color: "var(--text-on-dark-muted)" }}
          >
            {content.intro}
          </p>
          <div className="mt-12">
            <Link
              href="/iletisim"
              className="inline-flex h-12 items-center justify-center px-8 transition-all duration-[220ms] ease-[var(--ease-luxury)] hover:opacity-80"
              style={{
                background: "var(--zesta-accent)",
                color: "#fff",
                borderRadius: "var(--radius-full)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.14em",
              }}
            >
              {content.ctaLabel}
            </Link>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "rgba(196,134,90,0.25)" }}
        />
      </section>

      {/* Hero görsel */}
      <div className="relative w-full aspect-[21/8] bg-stone-100 overflow-hidden">
        {content.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content.heroImage}
            alt={content.heading}
            className="hero-kenburns h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center"
            style={{ background: "var(--zesta-surface-muted)" }}
          >
            <span className="text-sm" style={{ color: "var(--zesta-text-muted)" }}>Kurumsal görsel</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
      </div>

      {/* Hizmetler */}
      <section className="py-20 md:py-28" style={{ background: "var(--zesta-bg)" }}>
        <div className="mx-auto max-w-[1100px] px-5 md:px-12">
          <div className="mb-14 md:mb-16">
            <p
              className="text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
              style={{ color: "var(--zesta-accent)" }}
            >
              Neler Sunuyoruz
            </p>
            <h2
              className="font-display font-normal text-ink"
              style={{ fontSize: "clamp(26px, 3.5vw, 40px)", lineHeight: 1.08, letterSpacing: "-0.015em", maxWidth: "18ch" }}
            >
              Mekanınıza Özgün Bir İmza
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.cards.map((card, i) => (
              <div
                key={card.title}
                className="group relative flex flex-col p-7 md:p-8 transition-all duration-[280ms] ease-[var(--ease-luxury)] hover:-translate-y-1"
                style={{
                  background: "var(--zesta-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Üst aksent çizgi */}
                <div
                  className="absolute top-0 left-7 right-7 h-px transition-all duration-[280ms] group-hover:left-0 group-hover:right-0"
                  style={{ background: "var(--zesta-accent)", opacity: 0.5, borderRadius: 0 }}
                />
                <span
                  className="mb-5 text-[20px] leading-none"
                  style={{ color: "var(--zesta-accent)" }}
                >
                  {CARD_ICONS[i % CARD_ICONS.length]}
                </span>
                <h3
                  className="font-display font-normal text-ink mb-3"
                  style={{ fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.15 }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed flex-1"
                  style={{ color: "var(--zesta-text-secondary)" }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Süreç adımları */}
      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{ background: "var(--zesta-primary-dark)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(244,241,233,1) 79px, rgba(244,241,233,1) 80px)",
          }}
        />
        <div className="relative mx-auto max-w-[1100px] px-5 md:px-12">
          <div className="mb-14 md:mb-16">
            <p
              className="text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
              style={{ color: "var(--zesta-accent)" }}
            >
              Süreç
            </p>
            <h2
              className="font-display font-normal"
              style={{
                fontSize: "clamp(26px, 3.5vw, 40px)",
                lineHeight: 1.08,
                letterSpacing: "-0.015em",
                color: "var(--text-on-dark)",
                maxWidth: "18ch",
              }}
            >
              Başlangıçtan Teslimata
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {STEPS.map((step) => (
              <div key={step.num} className="relative">
                <p
                  className="font-display text-[40px] md:text-[52px] font-normal leading-none mb-5"
                  style={{ color: "rgba(196,134,90,0.25)" }}
                >
                  {step.num}
                </p>
                <h3
                  className="font-display font-normal mb-3"
                  style={{ fontSize: "20px", lineHeight: 1.2, color: "var(--text-on-dark)" }}
                >
                  {step.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-on-dark-muted)" }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alıntı / vurgu */}
      <section
        className="py-20 md:py-28"
        style={{ background: "var(--zesta-surface-muted)" }}
      >
        <div className="mx-auto max-w-[900px] px-5 md:px-12 text-center">
          <div className="mx-auto mb-8 h-px w-16" style={{ background: "var(--zesta-accent)" }} />
          <blockquote
            className="font-display font-normal italic text-ink"
            style={{ fontSize: "clamp(20px, 3vw, 34px)", lineHeight: 1.25, letterSpacing: "-0.01em" }}
          >
            "Atölyemiz, markanızın sesini taşıyan her nesneyi el emeğiyle yoğurur."
          </blockquote>
          <div className="mx-auto mt-8 h-px w-16" style={{ background: "var(--zesta-accent)" }} />
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 md:py-32 text-center"
        style={{ background: "var(--zesta-primary-dark)" }}
      >
        <div className="mx-auto max-w-xl px-5">
          <p
            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-5"
            style={{ color: "var(--zesta-accent)" }}
          >
            Birlikte Çalışalım
          </p>
          <h2
            className="font-display font-normal"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
              color: "var(--text-on-dark)",
            }}
          >
            Projenizi Anlatın,
            <br />
            <em style={{ color: "var(--zesta-accent)", fontStyle: "italic" }}>Beraber Şekillendirelim.</em>
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="zesta-glow-ring">
              <Link
                href="/iletisim"
                className="inline-flex h-12 items-center justify-center px-8 transition-all duration-[220ms] ease-[var(--ease-luxury)] hover:opacity-80"
                style={{
                  background: "var(--zesta-accent)",
                  color: "#fff",
                  borderRadius: "var(--radius-full)",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                }}
              >
                {content.ctaLabel}
              </Link>
            </span>
            <Link
              href="/magaza"
              className="inline-flex h-12 items-center justify-center px-8 transition-all duration-[220ms] ease-[var(--ease-luxury)] hover:opacity-70"
              style={{
                border: "1px solid rgba(244,241,233,0.2)",
                color: "var(--text-on-dark)",
                borderRadius: "var(--radius-full)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.14em",
              }}
            >
              KOLEKSİYONLARI İNCELE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
