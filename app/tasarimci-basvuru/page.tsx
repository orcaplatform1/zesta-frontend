"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { Category } from "@/lib/types";
import { DesignerTermsButton } from "@/components/DesignerTermsModal";

const inputClass =
  "w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";
const textareaClass =
  "w-full rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 py-2.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

const HIGHLIGHTS = [
  { title: "%15 Komisyon", body: "Sektördeki en adil komisyon oranlarından biri — kalan tutar tamamen sizin." },
  { title: "15 Günde Bakiyeye Geçer", body: "İade edilmeyen satışlar 15 gün sonra çekilebilir bakiyenize eklenir." },
  { title: "Tek Ekrandan Yönetim", body: "Ürün ekleme, sipariş takibi ve ödeme talebi — hepsi Tasarımcı Paneli'nde." },
];

export default function DesignerApplyPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    brandName: "",
    email: "",
    phone: "",
    password: "",
    canInvoice: "" as "" | "true" | "false",
    category: "",
    otherCategory: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.get<Category[]>("/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post("/designer-applications", { ...form, canInvoice: form.canInvoice === "true" });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Başvuru gönderilemedi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <section className="grain relative py-20 md:py-24 text-center overflow-hidden bg-warm-ivory">
        <div className="mx-auto max-w-2xl px-5">
          <p className="eyebrow-on-light">Zesta Tasarımcı Paneli</p>
          <h1
            className="mt-6 font-display font-normal text-ink text-[34px] md:text-[48px]"
            style={{ lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            Zesta&apos;da Satış Yapmaya Başlayın
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-[color:var(--text-on-light-secondary)]">
            El emeğinizi Zesta&apos;nın vitrinine taşıyın. Başvurunuz incelendikten sonra size özel Tasarımcı
            Paneli&apos;ne erişim açılır; ürün eklemekten ödeme talep etmeye kadar her şeyi buradan yönetirsiniz.
          </p>
        </div>
      </section>

      <section className="bg-onyx-900 py-14">
        <div className="mx-auto max-w-[1000px] px-5 md:px-12 grid gap-8 sm:grid-cols-3 text-center">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title}>
              <p className="font-display text-[20px] text-ink" style={{ color: "var(--zesta-green)" }}>
                {h.title}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-smoke">{h.body}</p>
            </div>
          ))}
          <div className="sm:col-span-3">
            <DesignerTermsButton />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-[var(--border-subtle)]">
        <div className="mx-auto max-w-md px-5">
          {done ? (
            <div className="text-center">
              <p className="eyebrow-on-light">Alındı</p>
              <h2 className="mt-3 font-display text-[24px] font-normal text-ink">Başvurunuz İncelemeye Alındı</h2>
              <p className="mt-4 text-sm text-ash leading-relaxed">
                Ekibimiz başvurunuzu değerlendirdikten sonra, {form.email} adresine kaydettiğiniz bilgilerle{" "}
                <Link href="/tasarimci-giris" className="text-champagne-300 underline">
                  Tasarımcı Girişi
                </Link>{" "}
                üzerinden panelinize giriş yapabilirsiniz.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-[24px] font-normal text-ink mb-6">Başvuru Formu</h2>
              <form onSubmit={submit} className="space-y-3">
                <input
                  placeholder="Ad Soyad"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                />
                <input
                  placeholder="Marka / Atölye Adı"
                  required
                  value={form.brandName}
                  onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="E-posta"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputClass}
                />
                <input
                  placeholder="Telefon"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Panel Şifresi (6-20 karakter)"
                  required
                  minLength={6}
                  maxLength={20}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className={inputClass}
                />
                <select
                  required
                  value={form.canInvoice}
                  onChange={(e) => setForm((f) => ({ ...f, canInvoice: e.target.value as "" | "true" | "false" }))}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Fatura Kesebiliyor musunuz?
                  </option>
                  <option value="true">Evet, fatura kesebiliyorum</option>
                  <option value="false">Hayır, fatura kesemiyorum</option>
                </select>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Üretim Kategorisi Seçin
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                  <option value="diger">Diğer</option>
                </select>
                {form.category === "diger" && (
                  <input
                    placeholder="Kategorinizi yazın"
                    required
                    value={form.otherCategory}
                    onChange={(e) => setForm((f) => ({ ...f, otherCategory: e.target.value }))}
                    className={inputClass}
                  />
                )}
                <textarea
                  placeholder="Kendinizden ve ürettiğiniz ürünlerden kısaca bahsedin"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className={textareaClass}
                />
                {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full h-12 rounded-full bg-charcoal-700 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {busy ? "GÖNDERİLİYOR..." : "BAŞVURUYU TAMAMLA"}
                </button>
              </form>
              <p className="mt-5 text-xs text-dim">
                Zaten onaylı tasarımcı mısınız?{" "}
                <Link href="/tasarimci-giris" className="text-champagne-300 underline">
                  Giriş yapın
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
