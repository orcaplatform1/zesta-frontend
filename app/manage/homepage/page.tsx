"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";
import { DEFAULT_HOMEPAGE_CONTENT, type HomepageContent } from "@/lib/homepage-content";

const inputClass =
  "w-full h-11 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";
const textareaClass =
  "w-full rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 py-2.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

export default function AdminHomepagePage() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Record<string, unknown>>("/settings")
      .then((settings) => {
        const stored = settings.homepage_content as HomepageContent | undefined;
        setContent(stored ?? DEFAULT_HOMEPAGE_CONTENT);
      })
      .catch(() => setContent(DEFAULT_HOMEPAGE_CONTENT));
    api.get<Category[]>("/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  async function save() {
    if (!content) return;
    setBusy(true);
    setMessage(null);
    try {
      await api.put("/settings/admin/homepage_content", { value: content });
      setMessage("Kaydedildi. Anasayfada birkaç dakika içinde görünür.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setBusy(false);
    }
  }

  if (!content) return <p className="text-sm text-ash">Yükleniyor...</p>;

  function update<K extends keyof HomepageContent>(key: K, value: HomepageContent[K]) {
    setContent((c) => (c ? { ...c, [key]: value } : c));
  }

  return (
    <div className="max-w-3xl space-y-14 pb-24">
      <div>
        <h1 className="label-uppercase text-champagne-300 mb-2">Anasayfa İçeriği</h1>
        <h2 className="font-display text-[28px] font-normal text-ink mb-3">Görünen Yüz</h2>
        <p className="text-sm text-ash leading-relaxed">
          Anasayfadaki başlıklar, metinler ve hangi kategorilerin gösterileceği buradan düzenlenir. Ürünlerin
          kendisi (fiyat, görsel, açıklama) Ürünler sekmesinden yönetilir.
        </p>
      </div>

      <section>
        <h3 className="label-uppercase mb-4">Duyuru Barı</h3>
        <input
          className={inputClass}
          value={content.promoBarText}
          onChange={(e) => update("promoBarText", e.target.value)}
        />
      </section>

      <section className="space-y-3">
        <h3 className="label-uppercase mb-1">Hero (Üst Bölüm)</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={content.hero.eyebrow}
              onChange={(e) => update("hero", { ...content.hero, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Görsel Kategorisi">
            <select
              className={inputClass}
              value={content.hero.heroCategorySlug}
              onChange={(e) => update("hero", { ...content.hero, heroCategorySlug: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Başlık 1. Satır">
            <input
              className={inputClass}
              value={content.hero.headingLine1}
              onChange={(e) => update("hero", { ...content.hero, headingLine1: e.target.value })}
            />
          </Field>
          <Field label="Başlık 2. Satır">
            <input
              className={inputClass}
              value={content.hero.headingLine2}
              onChange={(e) => update("hero", { ...content.hero, headingLine2: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Açıklama">
          <textarea
            className={textareaClass}
            rows={2}
            value={content.hero.body}
            onChange={(e) => update("hero", { ...content.hero, body: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ana Buton Metni">
            <input
              className={inputClass}
              value={content.hero.ctaLabel}
              onChange={(e) => update("hero", { ...content.hero, ctaLabel: e.target.value })}
            />
          </Field>
          <Field label="İkincil Buton Metni">
            <input
              className={inputClass}
              value={content.hero.secondaryCtaLabel}
              onChange={(e) => update("hero", { ...content.hero, secondaryCtaLabel: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <ListSection
        title="Güven Şeridi"
        description="Hero altındaki 3'lü metin bloğu."
        items={content.trustStrip}
        onChange={(items) => update("trustStrip", items)}
        empty={{ title: "", body: "" }}
        renderItem={(item, onItemChange) => (
          <>
            <Field label="Başlık">
              <input className={inputClass} value={item.title} onChange={(e) => onItemChange({ ...item, title: e.target.value })} />
            </Field>
            <Field label="Metin">
              <textarea
                className={textareaClass}
                rows={2}
                value={item.body}
                onChange={(e) => onItemChange({ ...item, body: e.target.value })}
              />
            </Field>
          </>
        )}
      />

      <ListSection
        title="Kategori Satırları"
        description="Anasayfada 4'lü ürün grid'i olarak gösterilen kategoriler."
        items={content.categoryRows}
        onChange={(items) => update("categoryRows", items)}
        empty={{ slug: categories[0]?.slug ?? "", label: categories[0]?.name ?? "" }}
        renderItem={(item, onItemChange) => (
          <>
            <Field label="Kategori">
              <select
                className={inputClass}
                value={item.slug}
                onChange={(e) => {
                  const cat = categories.find((c) => c.slug === e.target.value);
                  onItemChange({ slug: e.target.value, label: cat?.name ?? item.label });
                }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Başlık (isteğe bağlı override)">
              <input className={inputClass} value={item.label} onChange={(e) => onItemChange({ ...item, label: e.target.value })} />
            </Field>
          </>
        )}
      />

      <ListSection
        title="Editorial Bölümler"
        description="Kategori satırları arasına serpiştirilen görsel+metin blokları."
        items={content.editorialSplits}
        onChange={(items) => update("editorialSplits", items)}
        empty={{
          eyebrow: "",
          heading: "",
          body: "",
          categorySlug: categories[0]?.slug ?? "",
          categoryLabel: categories[0]?.name ?? "",
        }}
        renderItem={(item, onItemChange) => (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Eyebrow">
                <input className={inputClass} value={item.eyebrow} onChange={(e) => onItemChange({ ...item, eyebrow: e.target.value })} />
              </Field>
              <Field label="Kategori">
                <select
                  className={inputClass}
                  value={item.categorySlug}
                  onChange={(e) => {
                    const cat = categories.find((c) => c.slug === e.target.value);
                    onItemChange({ ...item, categorySlug: e.target.value, categoryLabel: cat?.name ?? item.categoryLabel });
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Başlık">
              <input className={inputClass} value={item.heading} onChange={(e) => onItemChange({ ...item, heading: e.target.value })} />
            </Field>
            <Field label="Metin">
              <textarea
                className={textareaClass}
                rows={3}
                value={item.body}
                onChange={(e) => onItemChange({ ...item, body: e.target.value })}
              />
            </Field>
          </>
        )}
      />

      <div className="sticky bottom-0 -mx-5 md:-mx-12 bg-onyx-800/95 backdrop-blur-sm border-t border-[var(--border-subtle)] px-5 md:px-12 py-4 flex items-center gap-4">
        <button
          onClick={save}
          disabled={busy}
          className="h-11 rounded-xs bg-charcoal-700 px-6 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
          style={{ letterSpacing: "0.1em" }}
        >
          {busy ? "KAYDEDİLİYOR..." : "KAYDET"}
        </button>
        {message && <p className="text-sm text-champagne-300">{message}</p>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-uppercase block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function ListSection<T>({
  title,
  description,
  items,
  onChange,
  empty,
  renderItem,
}: {
  title: string;
  description: string;
  items: T[];
  onChange: (items: T[]) => void;
  empty: T;
  renderItem: (item: T, onItemChange: (item: T) => void) => React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="label-uppercase mb-1">{title}</h3>
          <p className="text-xs text-dim">{description}</p>
        </div>
        <button
          onClick={() => onChange([...items, empty])}
          className="text-[12px] text-champagne-300 hover:text-champagne-200 transition-colors duration-[180ms]"
          style={{ letterSpacing: "0.08em" }}
        >
          + EKLE
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xs border border-[var(--border-subtle)] p-4 space-y-3 relative">
            {renderItem(item, (next) => onChange(items.map((it, idx) => (idx === i ? next : it))))}
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-xs text-dim hover:text-[var(--status-error)] transition-colors duration-[180ms]"
            >
              Sil
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-dim">Henüz eklenmedi.</p>}
      </div>
    </section>
  );
}
