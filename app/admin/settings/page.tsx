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

  if (!config) return <p className="text-sm text-neutral-500">Yükleniyor...</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-1">Ödeme Ayarları — iyzico</h1>
      <p className="text-sm text-neutral-500 mb-6">
        API bilgilerinizi iyzico Merchant panelinden (Ayarlar → API Anahtarları) alabilirsiniz. Test ederken sandbox
        adresini, canlıya geçince production adresini kullanın.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium mb-1">API Key</span>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">
            Secret Key {config.hasSecretKey && <span className="text-neutral-400">(kayıtlı — değiştirmek için doldurun)</span>}
          </span>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder={config.hasSecretKey ? "••••••••" : ""}
            className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">API Adresi</span>
          <select
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="https://sandbox-api.iyzipay.com">Sandbox (test)</option>
            <option value="https://api.iyzipay.com">Production (canlı)</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          Ödeme adımında iyzico'yu aktif et
        </label>

        {message && <p className="text-sm">{message}</p>}

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-neutral-900 text-white px-6 py-2 text-sm font-medium disabled:opacity-50"
        >
          {busy ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
