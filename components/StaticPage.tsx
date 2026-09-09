"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Page } from "@/lib/types";
import { parseLegalContent } from "@/lib/legal-content";

export function StaticPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const [page, setPage] = useState<Page | null | undefined>(undefined);

  useEffect(() => {
    api.get<Page>(`/pages/${slug}`).then(setPage).catch(() => setPage(null));
  }, [slug]);

  const sections = page?.content ? parseLegalContent(page.content) : [];
  const hasToc = sections.filter((s) => s.heading).length > 3;

  return (
    <div className="mx-auto max-w-[1100px] px-5 md:px-12 py-16 md:py-24">
      <p className="eyebrow">Zesta</p>
      <h1 className="mt-3 font-display text-[32px] md:text-[44px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
        {page?.title ?? fallbackTitle}
      </h1>

      {page === undefined ? (
        <p className="mt-8 text-sm text-ash">Yükleniyor...</p>
      ) : sections.length === 0 ? (
        <p className="mt-8 text-sm text-ash">Bu içerik henüz eklenmedi.</p>
      ) : (
        <div className={hasToc ? "mt-14 grid md:grid-cols-[220px_1fr] gap-12 md:gap-16" : "mt-14"}>
          {hasToc && (
            <nav className="hidden md:block">
              <div className="sticky top-28">
                <p className="label-uppercase mb-4">İçindekiler</p>
                <ul className="space-y-2.5 border-l border-[var(--border-subtle)]">
                  {sections.map((s, i) =>
                    s.heading ? (
                      <li key={i}>
                        <a
                          href={`#legal-section-${i}`}
                          className="block pl-4 -ml-px border-l border-transparent text-[13px] leading-snug text-ash hover:text-ink hover:border-[var(--border-accent)] transition-colors duration-[180ms]"
                        >
                          {s.heading}
                        </a>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            </nav>
          )}

          <div className="max-w-[680px] space-y-10">
            {sections.map((s, i) => (
              <div key={i} id={`legal-section-${i}`} className="scroll-mt-28">
                {s.heading && (
                  <h2 className="font-display text-[19px] md:text-[21px] font-normal text-ink mb-3" style={{ lineHeight: 1.2 }}>
                    {s.heading}
                  </h2>
                )}
                <div className="whitespace-pre-line text-[15px] leading-relaxed text-smoke">{s.body}</div>
                {i < sections.length - 1 && <div className="mt-10 border-b border-[var(--border-subtle)]" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
