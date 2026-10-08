"use client";

import { useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import type { FooterContactContent } from "@/lib/site-pages-content";

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

function stripCountryCode(phone: string) {
  return phone.replace(/^\+90\s*/, "").trim();
}

function toTelHref(phone: string) {
  return "tel:+" + phone.replace(/\D/g, "").replace(/^0/, "90");
}

function toMapsHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function ContactClient({ contact }: { contact: FooterContactContent }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.subject) { setError("Lütfen konu seçin"); return; }
    if (form.phone.length !== 10) { setError("Telefon numarası 10 haneli olmalı (başında 0 olmadan)"); return; }
    setBusy(true);
    try {
      await api.post("/contact", { ...form, phone: `+90${form.phone}` });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Mesaj gönderilemedi, lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  }

  const displayPhone = stripCountryCode(contact.phone);
  const mapsUrl = toMapsHref(contact.addressNote);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(contact.addressNote)}&output=embed&z=15`;

  return (
    <div>
      {/* Hero */}
      <section className="grain py-20 md:py-28 text-center" style={{ background: "var(--zesta-primary-dark)" }}>
        <div className="mx-auto max-w-xl px-5">
          <p className="eyebrow">Zesta</p>
          <h1
            className="mt-5 font-display font-normal text-[36px] md:text-[52px]"
            style={{ color: "var(--text-on-dark)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            İletişime Geçin
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed" style={{ color: "var(--text-on-dark-muted)" }}>
            Sorularınız, önerileriniz veya sipariş ile ilgili konular için bize ulaşın. En kısa sürede dönüş yapacağız.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ background: "var(--zesta-bg)" }}>
        <div className="mx-auto max-w-[1000px] px-5 md:px-12 grid md:grid-cols-[1fr_1.6fr] gap-14 md:gap-20 items-start">

          {/* Sol — iletişim bilgileri */}
          <div>
            <h2 className="font-display text-[26px] font-normal text-ink" style={{ letterSpacing: "-0.015em" }}>
              Bize Ulaşın
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Hafta içi 09:00–18:00 saatleri arasında yanıt veriyoruz.
            </p>

            <div className="mt-8 flex flex-col gap-6">
              {/* E-posta */}
              <a
                href={`mailto:${contact.email}`}
                className="flex items-start gap-4 group"
              >
                <span
                  className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-[180ms] group-hover:opacity-80"
                  style={{ background: "rgba(23,60,60,0.08)" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--zesta-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.1em] uppercase" style={{ color: "var(--zesta-primary)" }}>E-posta</p>
                  <p className="mt-0.5 text-sm text-ink group-hover:underline">{contact.email}</p>
                </div>
              </a>

              {/* Telefon */}
              <a
                href={toTelHref(contact.phone)}
                className="flex items-start gap-4 group"
              >
                <span
                  className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-[180ms] group-hover:opacity-80"
                  style={{ background: "rgba(23,60,60,0.08)" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--zesta-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.13 1 .37 1.97.72 2.9a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.18-1.18a2 2 0 012.11-.45c.93.35 1.9.59 2.9.72A2 2 0 0122 16.92z"/>
                  </svg>
                </span>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.1em] uppercase" style={{ color: "var(--zesta-primary)" }}>Telefon</p>
                  <p className="mt-0.5 text-sm text-ink group-hover:underline">{displayPhone}</p>
                </div>
              </a>

              {/* Adres — haritaya link */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <span
                  className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-[180ms] group-hover:opacity-80"
                  style={{ background: "rgba(23,60,60,0.08)" }}
                >
                  <svg width="13" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--zesta-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.1em] uppercase" style={{ color: "var(--zesta-primary)" }}>Adres</p>
                  <p className="mt-0.5 text-sm text-ink leading-relaxed group-hover:underline">{contact.addressNote}</p>
                </div>
              </a>
            </div>

            {/* Harita */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block overflow-hidden transition-opacity duration-[200ms] hover:opacity-90"
              style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}
            >
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="380"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ display: "block", pointerEvents: "none", border: 0 }}
                title="Konum haritası"
              />
            </a>
          </div>

          {/* Sağ — form */}
          <div>
            {done ? (
              <div
                className="rounded-sm border border-[var(--border-subtle)] p-8 text-center"
                style={{ background: "var(--zesta-surface-muted)" }}
              >
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: "rgba(23,60,60,0.1)" }}
                >
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
                    <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink">
                      Ad Soyad <span style={{ color: "var(--zesta-accent)" }}>*</span>
                    </label>
                    <input
                      required
                      className={inputClass}
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink">
                      E-posta <span style={{ color: "var(--zesta-accent)" }}>*</span>
                    </label>
                    <input
                      required
                      type="email"
                      pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                      className={inputClass}
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink">
                    Telefon <span style={{ color: "var(--zesta-accent)" }}>*</span>
                  </label>
                  <div className="flex gap-2">
                    <span
                      className="flex h-12 w-14 flex-shrink-0 items-center justify-center rounded-xs border text-[13px] font-medium"
                      style={{ background: "var(--zesta-surface-muted)", borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
                    >
                      +90
                    </span>
                    <input
                      required
                      inputMode="numeric"
                      placeholder="5XX XXX XX XX"
                      maxLength={10}
                      className={inputClass}
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))
                      }
                    />
                  </div>
                  {form.phone.length > 0 && form.phone.length !== 10 && (
                    <p className="text-[11px]" style={{ color: "var(--status-error)" }}>
                      10 haneli olmalı (şu an {form.phone.length} hane)
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink">
                    Konu <span style={{ color: "var(--zesta-accent)" }}>*</span>
                  </label>
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
                  <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink">
                    Mesaj <span style={{ color: "var(--zesta-accent)" }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    className={textareaClass}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  />
                </div>

                {error && <p className="text-sm" style={{ color: "var(--status-error)" }}>{error}</p>}

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
