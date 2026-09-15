"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { DEFAULT_CORPORATE_PAGE, type CorporatePageContent } from "@/lib/site-pages-content";

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
      <section className="grain relative py-20 md:py-28 text-center overflow-hidden bg-warm-ivory">
        <div className="mx-auto max-w-2xl px-5">
          <p className="eyebrow-on-light">{content.eyebrow}</p>
          <h1
            className="mt-6 font-display font-normal text-ink text-[34px] md:text-[50px]"
            style={{ lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            {content.heading}
          </h1>
          <p className="mt-6 text-[15px] md:text-[16px] leading-relaxed text-[color:var(--text-on-light-secondary)] max-w-lg mx-auto">
            {content.intro}
          </p>
        </div>
      </section>

      <div className="relative w-full aspect-[21/9] bg-stone-100 overflow-hidden">
        {content.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.heroImage} alt={content.heading} className="hero-kenburns h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-sm text-stone-500">Kurumsal görsel</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>

      <section className="bg-onyx-900 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-5 md:px-12 grid gap-6 sm:grid-cols-2">
          {content.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-sm border border-[var(--border-subtle)] bg-onyx-700 p-7 md:p-8 transition-all duration-[250ms] ease-[var(--ease-luxury)] hover:-translate-y-[3px] hover:shadow-[var(--shadow-lg)]"
            >
              <h2 className="font-display text-[20px] md:text-[22px] font-normal text-ink mb-3" style={{ lineHeight: 1.15 }}>
                {card.title}
              </h2>
              <p className="text-[14px] leading-relaxed text-[color:var(--text-on-light-secondary)]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-warm-ivory py-20 md:py-28 text-center">
        <div className="mx-auto max-w-xl px-5">
          <p className="eyebrow-on-light">Birlikte Çalışalım</p>
          <h2 className="mt-4 font-display text-[26px] md:text-[34px] font-normal text-ink" style={{ lineHeight: 1.1 }}>
            Projenizi Anlatın, Beraber Şekillendirelim.
          </h2>
          <span className="zesta-glow-ring mt-8 inline-flex">
            <Link
              href="/iletisim"
              className="inline-flex h-12 items-center justify-center rounded-full bg-charcoal-700 px-7 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
              style={{ letterSpacing: "0.1em" }}
            >
              {content.ctaLabel}
            </Link>
          </span>
        </div>
      </section>
    </div>
  );
}
