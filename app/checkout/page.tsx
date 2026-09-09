"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface CheckoutResponse {
  order: { orderNumber: string };
  payment: { configured: boolean; checkoutUrl: string | null };
}

interface Me {
  email: string;
  name: string;
}

type InvoiceType = "individual" | "corporate";

export default function CheckoutPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null | undefined>(undefined);
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
    companyName: "",
    taxNumber: "",
    taxOffice: "",
    billingCity: "",
    billingDistrict: "",
    billingPostalCode: "",
    billingAddressLine: "",
  });
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("individual");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Me>("/auth/me")
      .then((m) => {
        setMe(m);
        setForm((f) => ({ ...f, email: m.email, fullName: m.name }));
      })
      .catch(() => setMe(null));
  }, []);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        email: form.email,
        phone: form.phone,
        fullName: form.fullName,
        city: form.city,
        district: form.district,
        postalCode: form.postalCode,
        addressLine: form.addressLine,
        couponCode: form.couponCode || undefined,
        invoiceType,
        billingSameAsShipping,
      };

      if (invoiceType === "individual") {
        payload.identityNumber = form.identityNumber || undefined;
      } else {
        payload.companyName = form.companyName;
        payload.taxNumber = form.taxNumber;
        payload.taxOffice = form.taxOffice;
      }

      if (!billingSameAsShipping) {
        payload.billingCity = form.billingCity;
        payload.billingDistrict = form.billingDistrict;
        payload.billingPostalCode = form.billingPostalCode || undefined;
        payload.billingAddressLine = form.billingAddressLine;
      }

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

  if (me === undefined) {
    return <div className="mx-auto max-w-xl px-5 py-24 text-sm text-ash">Yükleniyor...</div>;
  }

  if (me === null) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="label-uppercase text-champagne-300">Ödeme</p>
        <h1 className="mt-3 font-display text-[28px] font-normal text-ink">Sipariş vermek için üye olun</h1>
        <p className="mt-4 text-sm text-ash leading-relaxed">
          Siparişlerinizi takip edebilmeniz için ödemeye geçmeden önce üye olmanız veya giriş yapmanız gerekiyor.
        </p>
        <Link
          href="/account"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xs bg-charcoal-700 px-7 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
          style={{ letterSpacing: "0.1em" }}
        >
          GİRİŞ YAP / ÜYE OL
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 md:px-12 py-16 md:py-24">
      <h1 className="font-display text-[32px] md:text-[40px] font-normal text-ink mb-10">Ödeme</h1>
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

        <div className="pt-2">
          <span className="label-uppercase block mb-2">Fatura Tipi</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setInvoiceType("individual")}
              className="h-11 flex-1 rounded-xs border text-[12px] font-medium transition-colors duration-[180ms]"
              style={{
                borderColor: invoiceType === "individual" ? "var(--border-accent)" : "var(--border-subtle)",
                background: invoiceType === "individual" ? "var(--champagne-300)" : "transparent",
                color: invoiceType === "individual" ? "var(--text-on-dark)" : "var(--text-secondary)",
              }}
            >
              BİREYSEL
            </button>
            <button
              type="button"
              onClick={() => setInvoiceType("corporate")}
              className="h-11 flex-1 rounded-xs border text-[12px] font-medium transition-colors duration-[180ms]"
              style={{
                borderColor: invoiceType === "corporate" ? "var(--border-accent)" : "var(--border-subtle)",
                background: invoiceType === "corporate" ? "var(--champagne-300)" : "transparent",
                color: invoiceType === "corporate" ? "var(--text-on-dark)" : "var(--text-secondary)",
              }}
            >
              KURUMSAL
            </button>
          </div>
        </div>

        {invoiceType === "individual" ? (
          <Field
            label="TC Kimlik No (11 hane)"
            value={form.identityNumber}
            onChange={(v) => set("identityNumber", v)}
            required
          />
        ) : (
          <>
            <Field label="Şirket Unvanı" value={form.companyName} onChange={(v) => set("companyName", v)} required />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Vergi Numarası (10 hane)" value={form.taxNumber} onChange={(v) => set("taxNumber", v)} required />
              <Field label="Vergi Dairesi" value={form.taxOffice} onChange={(v) => set("taxOffice", v)} required />
            </div>
          </>
        )}

        <label className="flex items-center gap-2 text-sm text-smoke pt-2">
          <input
            type="checkbox"
            checked={billingSameAsShipping}
            onChange={(e) => setBillingSameAsShipping(e.target.checked)}
          />
          Fatura adresi teslimat adresiyle aynı
        </label>

        {!billingSameAsShipping && (
          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-4">
            <Field label="Fatura Adresi" value={form.billingAddressLine} onChange={(v) => set("billingAddressLine", v)} required />
            <div className="grid grid-cols-2 gap-4">
              <Field label="İl" value={form.billingCity} onChange={(v) => set("billingCity", v)} required />
              <Field label="İlçe" value={form.billingDistrict} onChange={(v) => set("billingDistrict", v)} required />
            </div>
            <Field label="Posta Kodu" value={form.billingPostalCode} onChange={(v) => set("billingPostalCode", v)} />
          </div>
        )}

        {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full h-12 rounded-xs bg-charcoal-700 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
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
