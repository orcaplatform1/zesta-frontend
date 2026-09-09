"use client";

import { useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/api";

interface IyzicoConfig {
  apiKey: string;
  baseUrl: string;
  enabled: boolean;
  hasSecretKey: boolean;
}

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<IyzicoConfig | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://sandbox-api.iyzipay.com");
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function load() {
    api.get<IyzicoConfig>("/payments/admin/config").then((c) => {
      setConfig(c);
      setApiKey(c.apiKey);
      setBaseUrl(c.baseUrl);
      setEnabled(c.enabled);
    });
  }

  useEffect(load, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      await api.put("/payments/admin/config", {
        apiKey,
        secretKey: secretKey || undefined,
        baseUrl,
        enabled,
      });
      setSecretKey("");
      setMessage("Kaydedildi.");
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setBusy(false);
    }
  }

  if (!config) return <p className="text-sm text-ash">Yükleniyor...</p>;

  const inputClass =
    "w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

  return (
    <div className="max-w-lg">
      <h1 className="label-uppercase text-champagne-300 mb-2">Ödeme Ayarları</h1>
      <h2 className="font-display text-[28px] font-normal text-ink mb-3">iyzico</h2>
      <p className="text-sm text-ash mb-8 leading-relaxed">
        API bilgilerinizi iyzico Merchant panelinden (Ayarlar → API Anahtarları) alabilirsiniz. Test ederken sandbox
        adresini, canlıya geçince production adresini kullanın.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="label-uppercase block mb-1.5">API Key</span>
          <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} className={inputClass} />
        </label>

        <label className="block">
          <span className="label-uppercase block mb-1.5">
            Secret Key {config.hasSecretKey && <span className="normal-case text-dim">(kayıtlı — değiştirmek için doldurun)</span>}
          </span>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder={config.hasSecretKey ? "••••••••" : ""}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="label-uppercase block mb-1.5">API Adresi</span>
          <select value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} className={inputClass}>
            <option value="https://sandbox-api.iyzipay.com">Sandbox (test)</option>
            <option value="https://api.iyzipay.com">Production (canlı)</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-smoke">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          Ödeme adımında iyzico&apos;yu aktif et
        </label>

        {message && <p className="text-sm text-champagne-300">{message}</p>}

        <button
          type="submit"
          disabled={busy}
          className="h-11 rounded-xs bg-charcoal-700 px-6 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
          style={{ letterSpacing: "0.1em" }}
        >
          {busy ? "KAYDEDİLİYOR..." : "KAYDET"}
        </button>
      </form>
    </div>
  );
}
