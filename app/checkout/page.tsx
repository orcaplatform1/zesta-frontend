"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface CheckoutResponse {
  order: { orderNumber: string };
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
      const payload = { ...form, couponCode: form.couponCode || undefined };
      const res = await api.post<CheckoutResponse>("/checkout", payload);
      router.push(`/order-success?orderNumber=${res.order.orderNumber}&email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sipariş oluşturulamadı");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Ödeme</h1>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Ad Soyad" value={form.fullName} onChange={(v) => set("fullName", v)} required />
        <Field label="E-posta" type="email" value={form.email} onChange={(v) => set("email", v)} required />
        <Field label="Telefon" value={form.phone} onChange={(v) => set("phone", v)} required />
        <Field label="Adres" value={form.addressLine} onChange={(v) => set("addressLine", v)} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="İl" value={form.city} onChange={(v) => set("city", v)} required />
          <Field label="İlçe" value={form.district} onChange={(v) => set("district", v)} required />
        </div>
        <Field label="Posta Kodu" value={form.postalCode} onChange={(v) => set("postalCode", v)} />
        <Field label="Kupon Kodu (opsiyonel)" value={form.couponCode} onChange={(v) => set("couponCode", v)} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-neutral-900 text-white px-6 py-3 text-sm font-medium disabled:opacity-50"
        >
          {busy ? "Gönderiliyor..." : "Siparişi Tamamla"}
        </button>
        <p className="text-xs text-neutral-500">
          Kart bilgileriniz sistemimizde saklanmaz. Ödeme sağlayıcısı entegrasyonu yakında devreye alınacak.
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
      <span className="block text-sm font-medium mb-1">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
      />
    </label>
  );
}
