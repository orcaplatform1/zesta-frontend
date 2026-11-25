"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Category, Product, ProductListResponse } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { discountPercent, useRatings } from "@/lib/use-ratings";

const PAGE_SIZE = 24;

type SortKey = "recommended" | "newest" | "priceAsc" | "priceDesc" | "discount";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Önerilen" },
  { key: "newest", label: "En Yeniler" },
  { key: "priceAsc", label: "En Düşük Fiyat" },
  { key: "priceDesc", label: "En Yüksek Fiyat" },
  { key: "discount", label: "İndirim Oranı" },
];

const effectivePrice = (p: Product) => Number(p.salePrice ?? p.price);

// /magaza ve kategori sayfaları için ortak liste görünümü. Ürün çekme mevcut
// /products?category&search&page uçlarıyla yapılır; sıralama, fiyat aralığı
// ve indirim filtresi yalnızca görünüm tarafında, yüklenen sayfa üzerinde
// uygulanır (backend'de bu filtreler yok).
export function ProductListing({
  title,
  description,
  categorySlug,
  search,
  initialData,
}: {
  title: string;
  description?: string | null;
  categorySlug: string | null;
  search?: string;
  initialData?: ProductListResponse | null;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ProductListResponse | null>(initialData ?? null);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);

  useEffect(() => {
    api.get<Category[]>("/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [categorySlug, search]);

  useEffect(() => {
    if (page === 1 && initialData && !search) {
      setData(initialData);
      return;
    }
    setData(null);
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (categorySlug) params.set("category", categorySlug);
    if (search) params.set("search", search);
    api
      .get<ProductListResponse>(`/products?${params.toString()}`)
      .then(setData)
      .catch(() => setData(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, search, page]);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const visible = useMemo(() => {
    let items = data?.items ?? [];
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    if (min !== null) items = items.filter((p) => effectivePrice(p) >= min);
    if (max !== null) items = items.filter((p) => effectivePrice(p) <= max);
    if (onlyDiscounted) items = items.filter((p) => discountPercent(p.price, p.salePrice) !== null);
    const sorted = [...items];
    if (sort === "newest") sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sort === "priceAsc") sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    if (sort === "priceDesc") sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    if (sort === "discount")
      sorted.sort((a, b) => (discountPercent(b.price, b.salePrice) ?? 0) - (discountPercent(a.price, a.salePrice) ?? 0));
    return sorted;
  }, [data, minPrice, maxPrice, onlyDiscounted, sort]);

  const ratings = useRatings((data?.items ?? []).map((p) => p.id));
  const pageCount = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const filtered = minPrice !== "" || maxPrice !== "" || onlyDiscounted;

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-[13px] font-bold" style={{ color: "var(--zesta-text)" }}>
          Kategori
        </p>
        <div className="flex flex-col gap-1">
          <CategoryLink href="/magaza" active={categorySlug === null} onClick={() => setSheet(null)}>
            Tüm Ürünler
          </CategoryLink>
          {categories.map((c) => (
            <CategoryLink key={c.id} href={`/kategori/${c.slug}`} active={categorySlug === c.slug} onClick={() => setSheet(null)}>
              {c.name}
            </CategoryLink>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[13px] font-bold" style={{ color: "var(--zesta-text)" }}>
          Fiyat Aralığı
        </p>
        <div className="flex items-center gap-2">
          <PriceInput value={minPrice} onChange={setMinPrice} placeholder="En az" />
          <span className="text-ash">-</span>
          <PriceInput value={maxPrice} onChange={setMaxPrice} placeholder="En çok" />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-[13px]" style={{ color: "var(--zesta-text)" }}>
        <input
          type="checkbox"
          checked={onlyDiscounted}
          onChange={(e) => setOnlyDiscounted(e.target.checked)}
          className="h-4 w-4"
          style={{ accentColor: "var(--zesta-primary)" }}
        />
        İndirimli Ürünler
      </label>

      {filtered && (
        <button
          type="button"
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
            setOnlyDiscounted(false);
          }}
          className="text-[12px] font-semibold underline"
          style={{ color: "var(--zesta-primary)" }}
        >
          Filtreleri Temizle
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:py-8 lg:px-5">
      <div className="mb-5">
        <h1 className="text-[20px] font-bold md:text-[24px]" style={{ color: "var(--zesta-text)" }}>
          {search ? `"${search}" için sonuçlar` : title}
        </h1>
        {description && <p className="mt-1.5 max-w-2xl text-[14px] text-ash">{description}</p>}
      </div>

      {/* Mobil: Filtrele / Sırala */}
      <div className="mb-4 grid grid-cols-2 gap-2 md:hidden">
        <SheetButton onClick={() => setSheet("filter")}>Filtrele{filtered ? " •" : ""}</SheetButton>
        <SheetButton onClick={() => setSheet("sort")}>Sırala</SheetButton>
      </div>

      <div className="md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside
          className="hidden self-start p-4 md:sticky md:top-[165px] md:block"
          style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border-light)", borderRadius: "var(--radius-sm)" }}
        >
          {filterPanel}
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[13px] text-ash">{data ? `${filtered ? visible.length : data.total} ürün` : ""}</p>
            <label className="hidden items-center gap-2 text-[13px] md:flex" style={{ color: "var(--text-secondary)" }}>
              Sırala:
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 px-3 text-[13px] outline-none"
                style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border)", borderRadius: "var(--radius-xs)", color: "var(--zesta-text)" }}
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {!data ? (
            <p className="text-sm text-ash">Yükleniyor...</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-ash">Bu filtrede ürün bulunamadı.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} rating={ratings[product.id]} />
              ))}
            </div>
          )}

          {data && pageCount > 1 && (
            <div className="mt-10 flex items-center justify-center gap-8 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="text-smoke transition-colors duration-[180ms] hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                style={{ letterSpacing: "0.08em" }}
              >
                ← ÖNCEKİ
              </button>
              <span className="text-ash">
                Sayfa {page} / {pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page >= pageCount}
                className="text-smoke transition-colors duration-[180ms] hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                style={{ letterSpacing: "0.08em" }}
              >
                SONRAKİ →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobil alt panel */}
      {sheet && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end md:hidden">
          <button aria-label="Kapat" onClick={() => setSheet(null)} className="absolute inset-0 bg-black/40" />
          <div
            className="relative max-h-[80vh] overflow-y-auto p-5 pb-8"
            style={{ background: "var(--zesta-surface)", borderTopLeftRadius: "var(--radius-lg)", borderTopRightRadius: "var(--radius-lg)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[16px] font-bold" style={{ color: "var(--zesta-text)" }}>
                {sheet === "filter" ? "Filtrele" : "Sırala"}
              </p>
              <button onClick={() => setSheet(null)} aria-label="Kapat" className="text-[22px] leading-none text-ash">
                ×
              </button>
            </div>
            {sheet === "filter" ? (
              <>
                {filterPanel}
                <button
                  onClick={() => setSheet(null)}
                  className="mt-6 h-12 w-full text-[13px] font-semibold"
                  style={{ background: "var(--zesta-primary)", color: "var(--text-on-dark)", borderRadius: "var(--radius-sm)" }}
                >
                  Ürünleri Gör
                </button>
              </>
            ) : (
              <div className="flex flex-col">
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => {
                      setSort(s.key);
                      setSheet(null);
                    }}
                    className="flex items-center justify-between py-3 text-left text-[14px]"
                    style={{ borderBottom: "1px solid var(--zesta-border-light)", color: sort === s.key ? "var(--zesta-primary)" : "var(--zesta-text)", fontWeight: sort === s.key ? 700 : 400 }}
                  >
                    {s.label}
                    {sort === s.key && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryLink({ href, active, onClick, children }: { href: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-[var(--radius-xs)] px-2 py-1.5 text-[13px] transition-colors duration-[180ms] hover:bg-[var(--bg-secondary)]"
      style={{ color: active ? "var(--zesta-primary)" : "var(--text-secondary)", fontWeight: active ? 700 : 400 }}
    >
      {children}
    </Link>
  );
}

function PriceInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full min-w-0 px-2.5 text-[13px] outline-none"
      style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border)", borderRadius: "var(--radius-xs)", color: "var(--zesta-text)" }}
    />
  );
}

function SheetButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 text-[13px] font-semibold"
      style={{ background: "var(--zesta-surface)", border: "1px solid var(--zesta-border)", borderRadius: "var(--radius-sm)", color: "var(--zesta-text)" }}
    >
      {children}
    </button>
  );
}
