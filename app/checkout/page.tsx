"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface CheckoutResponse {
  order: { orderNumber: string };
  payment: { configured: boolean; checkoutUrl: string | null };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    phone: "",
    fullName: "",
    city: "",
    district: "",
    postalCode: "",
    addressLine: "",
    couponCode: "",
    identityNumber: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload = {
        ...form,
        couponCode: form.couponCode || undefined,
        identityNumber: form.identityNumber || undefined,
      };
      const res = await api.post<CheckoutResponse>("/checkout", payload);
      if (res.payment.configured && res.payment.checkoutUrl) {
        window.location.href = res.payment.checkoutUrl;
        return;
      }
      router.push(`/order-success?orderNumber=${res.order.orderNumber}&email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sipariş oluşturulamadı");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 md:px-12 py-16 md:py-24">
      <h1 className="font-display text-[32px] md:text-[40px] font-normal text-ink mb-10">Ödeme</h1>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Ad Soyad" value={form.fullName} onChange={(v) => set("fullName", v)} required />
        <Field label="E-posta" type="email" value={form.email} onChange={(v) => set("email", v)} required />
        <Field label="Telefon" value={form.phone} onChange={(v) => set("phone", v)} required />
        <Field
          label="TC Kimlik No"
          value={form.identityNumber}
          onChange={(v) => set("identityNumber", v)}
        />
        <Field label="Adres" value={form.addressLine} onChange={(v) => set("addressLine", v)} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="İl" value={form.city} onChange={(v) => set("city", v)} required />
          <Field label="İlçe" value={form.district} onChange={(v) => set("district", v)} required />
        </div>
        <Field label="Posta Kodu" value={form.postalCode} onChange={(v) => set("postalCode", v)} />
        <Field label="Kupon Kodu (opsiyonel)" value={form.couponCode} onChange={(v) => set("couponCode", v)} />

        {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full h-12 rounded-xs bg-ivory text-[12px] font-medium text-onyx-800 transition-colors duration-[180ms] hover:bg-smoke disabled:opacity-40"
          style={{ letterSpacing: "0.1em" }}
        >
          {busy ? "GÖNDERİLİYOR..." : "SİPARİŞİ TAMAMLA"}
        </button>
        <p className="text-xs text-dim">
          Kart bilgileriniz sistemimizde saklanmaz — ödeme iyzico&apos;nun güvenli sayfasında tamamlanır.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="label-uppercase block mb-1.5">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]"
      />
    </label>
  );
}
