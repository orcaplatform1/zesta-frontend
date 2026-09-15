"use client";

import { useState, type ReactNode } from "react";

export const manageInputClass =
  "w-full h-11 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";
export const manageTextareaClass =
  "w-full rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 py-2.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

export function ImageUploadField({
  label,
  value,
  onChange,
  endpoint = "/api/media/admin/upload",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Admin panelinde varsayılan; Tasarımcı Paneli /api/media/designer/upload geçirir. */
  endpoint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(endpoint, { method: "POST", body, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Yükleme başarısız");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-14 w-14 rounded-xs object-cover border border-[var(--border-subtle)]" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          className="text-xs text-dim"
        />
        {uploading && <span className="text-xs text-ash">Yükleniyor...</span>}
      </div>
      {error && <p className="mt-1 text-xs text-[var(--status-error)]">{error}</p>}
    </Field>
  );
}

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-uppercase block mb-1.5">
        {label}
        {required && <span style={{ color: "var(--status-error)" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

export function ListSection<T>({
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
  renderItem: (item: T, onItemChange: (item: T) => void) => ReactNode;
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
