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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">{page?.title ?? fallbackTitle}</h1>
      {page === undefined ? (
        <p className="text-neutral-500 text-sm">Yükleniyor...</p>
      ) : page?.content ? (
        <div className="prose prose-neutral whitespace-pre-line text-neutral-700">{page.content}</div>
      ) : (
        <p className="text-neutral-500 text-sm">Bu içerik henüz eklenmedi.</p>
      )}
    </div>
  );
}
