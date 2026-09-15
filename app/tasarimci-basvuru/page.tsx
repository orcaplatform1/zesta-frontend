"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { Category } from "@/lib/types";
import { DesignerTermsButton } from "@/components/DesignerTermsModal";
import { Field } from "@/components/admin/ManageFormControls";
import { Dropdown } from "@/components/Dropdown";
import { PasswordField } from "@/components/PasswordField";

const inputClass =
  "w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";
const textareaClass =
  "w-full rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 py-2.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

const HIGHLIGHTS = [
  { title: "%15 Komisyon", body: "Sektördeki en adil komisyon oranlarından biri — kalan tutar tamamen sizin." },
  { title: "15 Günde Bakiyeye Geçer", body: "İade edilmeyen satışlar 15 gün sonra çekilebilir bakiyenize eklenir." },
  { title: "Tek Ekrandan Yönetim", body: "Ürün ekleme, sipariş takibi ve ödeme talebi — hepsi Tasarımcı Paneli'nde." },
];

const INVOICE_OPTIONS = [
  { value: "true", label: "Evet" },
  { value: "false", label: "Hayır" },
];

const COMPANY_SIZE_OPTIONS = [
  { value: "Sadece Ben", label: "Sadece Ben" },
  { value: "2-5", label: "2-5" },
  { value: "6-10", label: "6-10" },
  { value: "11-50", label: "11-50" },
  { value: "50+", label: "50+" },
];

const REFERRAL_OPTIONS = [
  { value: "Instagram", label: "Instagram" },
  { value: "Google Arama", label: "Google Arama" },
  { value: "Arkadaş / Tanıdık Tavsiyesi", label: "Arkadaş / Tanıdık Tavsiyesi" },
  { value: "Diğer", label: "Diğer" },
];

export default function DesignerApplyPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    brandName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    city: "",
    canInvoice: "",
    companySize: "",
    referralSource: "",
    website: "",
    instagram: "",
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

  const categoryOptions = [
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
    { value: "diger", label: "Diğer" },
  ];

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.passwordConfirm) {
      setError("Şifreler eşleşmiyor");
      return;
    }
    if (form.phone.length !== 10) {
      setError("Telefon numarası 10 haneli olmalı (başında 0 olmadan)");
      return;
    }
    if (!form.canInvoice) {
      setError("Lütfen fatura kesebiliyor musunuz sorusunu yanıtlayın");
      return;
    }
    if (!form.category || (form.category === "diger" && !form.otherCategory)) {
      setError("Lütfen kategori seçin");
      return;
    }
    if (!form.companySize) {
      setError("Lütfen şirket büyüklüğünü seçin");
      return;
    }
    if (!form.referralSource) {
      setError("Lütfen Zesta'yı nereden duyduğunuzu seçin");
      return;
    }

    setBusy(true);
    try {
      const { firstName, lastName, passwordConfirm, ...rest } = form;
      await api.post("/designer-applications", {
        ...rest,
        name: `${firstName} ${lastName}`.trim(),
        phone: `+90${form.phone}`,
        country: "Türkiye",
        canInvoice: form.canInvoice === "true",
      });
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
              <h2 className="font-display text-[24px] font-normal text-ink mb-2">Tasarımcı Başvuru Formu</h2>
              <p className="text-sm text-ash mb-6 leading-relaxed">
                Temel bilgilerinizi doldurun. Ekibimiz başvurunuzu inceleyerek size dönüş yapacaktır.
              </p>
              <form onSubmit={submit} className="space-y-3">
                <Field label="Markanızın Adı" required>
                  <input
                    required
                    value={form.brandName}
                    onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="İsim" required>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Soyad" required>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="E-posta" required>
                  <input
                    type="email"
                    required
                    placeholder="ornek@eposta.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Telefon Numarası" required>
                  <div className="flex gap-2">
                    <span
                      className="flex h-12 w-16 flex-shrink-0 items-center justify-center gap-1 rounded-xs border border-[var(--border-subtle)] bg-onyx-800 text-[13px] text-dim"
                      aria-hidden
                    >
                      <span>🇹🇷</span>
                      <span>+90</span>
                    </span>
                    <input
                      required
                      inputMode="numeric"
                      placeholder="5XXXXXXXXX"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))
                      }
                      className={inputClass}
                    />
                  </div>
                </Field>
                <Field label="Panel Şifresi" required>
                  <PasswordField
                    placeholder="6-20 karakter"
                    required
                    minLength={6}
                    maxLength={20}
                    value={form.password}
                    onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                  />
                </Field>
                <Field label="Panel Şifresi (Tekrar)" required>
                  <PasswordField
                    placeholder="Şifrenizi tekrar girin"
                    required
                    minLength={6}
                    maxLength={20}
                    value={form.passwordConfirm}
                    onChange={(v) => setForm((f) => ({ ...f, passwordConfirm: v }))}
                  />
                </Field>
                <Field label="Şehir" required>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Fatura kesebiliyor musun?" required>
                  <Dropdown
                    value={form.canInvoice}
                    onChange={(v) => setForm((f) => ({ ...f, canInvoice: v }))}
                    options={INVOICE_OPTIONS}
                    placeholder="Seçiniz"
                  />
                </Field>
                <Field label="Kategori" required>
                  <Dropdown
                    value={form.category}
                    onChange={(v) => setForm((f) => ({ ...f, category: v }))}
                    options={categoryOptions}
                    placeholder="Seçiniz"
                  />
                </Field>
                {form.category === "diger" && (
                  <Field label="Kategorinizi Yazın" required>
                    <input
                      required
                      value={form.otherCategory}
                      onChange={(e) => setForm((f) => ({ ...f, otherCategory: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                )}
                <Field label="Şirket Büyüklüğü" required>
                  <Dropdown
                    value={form.companySize}
                    onChange={(v) => setForm((f) => ({ ...f, companySize: v }))}
                    options={COMPANY_SIZE_OPTIONS}
                    placeholder="Seçiniz"
                  />
                </Field>
                <Field label="Zesta'yı nereden duydun?" required>
                  <Dropdown
                    value={form.referralSource}
                    onChange={(v) => setForm((f) => ({ ...f, referralSource: v }))}
                    options={REFERRAL_OPTIONS}
                    placeholder="Seçiniz"
                  />
                </Field>
                <Field label="Website URL">
                  <input
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Instagram URL">
                  <input
                    value={form.instagram}
                    onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Eklemek istediğin bir şey var mı?">
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className={textareaClass}
                  />
                </Field>
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
