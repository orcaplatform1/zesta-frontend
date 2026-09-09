"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Page } from "@/lib/types";

export function StaticPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const [page, setPage] = useState<Page | null | undefined>(undefined);

  useEffect(() => {
    api.get<Page>(`/pages/${slug}`).then(setPage).catch(() => setPage(null));
  }, [slug]);

  return (
    <div className="mx-auto max-w-2xl px-5 md:px-12 py-16 md:py-24">
      <p className="eyebrow">Zesta</p>
      <h1 className="mt-3 font-display text-[32px] md:text-[44px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
        {page?.title ?? fallbackTitle}
      </h1>
      {page === undefined ? (
        <p className="mt-8 text-sm text-ash">Yükleniyor...</p>
      ) : page?.content ? (
        <div className="mt-8 whitespace-pre-line text-[15px] leading-relaxed text-smoke">{page.content}</div>
      ) : (
        <p className="mt-8 text-sm text-ash">Bu içerik henüz eklenmedi.</p>
      )}
    </div>
  );
}
