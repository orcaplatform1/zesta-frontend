"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DEFAULT_STORES_PAGE, type StoresPageContent } from "@/lib/site-pages-content";

export default function StoresPage() {
  const [content, setContent] = useState<StoresPageContent>(DEFAULT_STORES_PAGE);

  useEffect(() => {
    api
      .get<Record<string, unknown>>("/settings")
      .then((settings) => {
        const stored = settings.stores_page_content as StoresPageContent | undefined;
        if (stored) setContent(stored);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="grain relative py-20 md:py-28 text-center overflow-hidden bg-warm-ivory">
        <div className="mx-auto max-w-2xl px-5">
          <p className="eyebrow-on-light">Zesta</p>
          <h1
            className="mt-6 font-display font-normal text-ink text-[34px] md:text-[50px]"
            style={{ lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            Mağazalarımız
          </h1>
          <p className="mt-6 text-[15px] md:text-[16px] leading-relaxed text-[color:var(--text-on-light-secondary)] max-w-lg mx-auto">
            {content.intro}
          </p>
        </div>
      </section>

      <section className="bg-onyx-900 py-16 md:py-24">
        <div className="mx-auto max-w-[1000px] px-5 md:px-12 space-y-16">
          {content.stores.map((store) => (
            <div key={store.id} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="relative aspect-[4/3] bg-stone-100 rounded-sm overflow-hidden">
                {store.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={store.image} alt={store.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-sm text-stone-500">Mağaza görseli</span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-display text-[24px] md:text-[28px] font-normal text-ink" style={{ lineHeight: 1.1 }}>
                  {store.name}
                </h2>
                <div className="mt-5 space-y-3 text-[14px] leading-relaxed text-smoke">
                  <p className="flex gap-2.5">
                    <span aria-hidden>📍</span>
                    {store.address}
                  </p>
                  <p className="flex gap-2.5">
                    <span aria-hidden>📞</span>
                    <a href={`tel:${store.phone.replace(/\s+/g, "")}`} className="hover:text-ink transition-colors duration-[180ms]">
                      {store.phone}
                    </a>
                  </p>
                  <p className="flex gap-2.5">
                    <span aria-hidden>🕐</span>
                    {store.hours}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
