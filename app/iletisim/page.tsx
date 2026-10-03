"use client";

import { useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";

const inputClass =
  "w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-white px-4 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--zesta-primary)] transition-colors duration-[180ms]";
const textareaClass =
  "w-full rounded-xs border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--zesta-primary)] transition-colors duration-[180ms]";

const SUBJECTS = [
  "Sipariş Hakkında",
  "Ürün Hakkında",
  "İade & Değişim",
  "Teknik Destek",
  "Diğer",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.subject) { setError("Lütfen konu seçin"); return; }
    setBusy(true);
    try {
      await api.post("/contact", form);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Mesaj gönderilemedi, lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="grain py-20 md:py-28 text-center" style={{ background: "var(--zesta-primary-dark)" }}>
        <div className="mx-auto max-w-xl px-5">
          <p className="eyebrow">Zesta</p>
          <h1 className="mt-5 font-display font-normal text-[36px] md:text-[52px]" style={{ color: "var(--text-on-dark)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            İletişime Geçin
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed" style={{ color: "var(--text-on-dark-muted)" }}>
            Sorularınız, önerileriniz veya sipariş ile ilgili konular için bize ulaşın. En kısa sürede dönüş yapacağız.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ background: "var(--zesta-bg)" }}>
        <div className="mx-auto max-w-[960px] px-5 md:px-12 grid md:grid-cols-[1fr_1.6fr] gap-14 md:gap-20 items-start">
          {/* Sol — iletişim bilgileri */}
          <div>
            <h2 className="font-display text-[26px] font-normal text-ink" style={{ letterSpacing: "-0.015em" }}>
              Bize Ulaşın
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Hafta içi 09:00–18:00 saatleri arasında yanıt veriyoruz.
            </p>
            <div className="mt-8 flex flex-col gap-5">
              {[
                { icon: "✉️", label: "E-posta", value: "destek@zesta.tr" },
                { icon: "📞", label: "Telefon", value: "+90 (850) 000 00 00" },
                { icon: "📍", label: "Adres", value: "İstanbul, Türkiye" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase" style={{ color: "var(--zesta-primary)" }}>{item.label}</p>
                    <p className="mt-0.5 text-sm text-ink">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ — form */}
          <div>
            {done ? (
              <div className="rounded-sm border border-[var(--border-subtle)] p-8 text-center" style={{ background: "var(--zesta-surface-muted)" }}>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(23,60,60,0.1)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--zesta-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-display text-[22px] font-normal text-ink">Mesajınız Alındı</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  En kısa sürede <strong>{form.email}</strong> adresinize dönüş yapacağız.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink">Adınız *</label>
                    <input required className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink">E-posta *</label>
                    <input required type="email" className={inputClass} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink">Telefon</label>
                  <input type="tel" className={inputClass} placeholder="İsteğe bağlı" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink">Konu *</label>
                  <select
                    required
                    className={inputClass}
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    style={{ appearance: "none" }}
                  >
                    <option value="">Seçiniz</option>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink">Mesajınız *</label>
                  <textarea required rows={5} className={textareaClass} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
                </div>

                {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full h-12 rounded-full font-semibold text-white text-[12px] tracking-[0.1em] transition-all duration-[200ms] hover:-translate-y-[1px] disabled:opacity-50"
                  style={{ background: "var(--zesta-primary)" }}
                >
                  {busy ? "GÖNDERİLİYOR..." : "MESAJ GÖNDER"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
