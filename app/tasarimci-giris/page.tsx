"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import { designerApi } from "@/lib/designer-api";

const inputClass =
  "w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

export default function DesignerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await designerApi.login(email, password);
      router.push("/tasarimci-panel");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Giriş başarısız");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <p className="eyebrow-on-light">Zesta Tasarımcı Paneli</p>
      <h1 className="mt-3 font-display text-[32px] font-normal text-ink mb-8">Tasarımcı Girişi</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="email"
          placeholder="E-posta"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Şifre"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full h-12 rounded-full bg-charcoal-700 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
          style={{ letterSpacing: "0.1em" }}
        >
          {busy ? "..." : "GİRİŞ YAP"}
        </button>
      </form>
      <p className="mt-6 text-xs text-dim">
        Henüz tasarımcı değil misiniz?{" "}
        <Link href="/tasarimci-basvuru" className="text-champagne-300 underline">
          Başvuru yapın
        </Link>
      </p>
    </div>
  );
}
