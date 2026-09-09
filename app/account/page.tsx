"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";

interface Me {
  id: string;
  email: string;
  name: string;
  phone: string | null;
}

export default function AccountPage() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);

  function loadMe() {
    api
      .get<Me>("/auth/me")
      .then(setMe)
      .catch(() => setMe(null));
  }

  useEffect(loadMe, []);

  if (me === undefined) return <div className="mx-auto max-w-md px-5 py-24 text-sm text-ash">Yükleniyor...</div>;
  if (me) return <ProfileView me={me} onLogout={() => setMe(null)} />;
  return <AuthForms onAuthed={loadMe} />;
}

function ProfileView({ me, onLogout }: { me: Me; onLogout: () => void }) {
  async function logout() {
    await api.post("/auth/logout");
    onLogout();
  }

  return (
    <div className="mx-auto max-w-md px-5 py-24">
      <h1 className="font-display text-[32px] font-normal text-ink mb-8">Hesabım</h1>
      <p className="text-sm text-smoke">Ad Soyad: {me.name}</p>
      <p className="mt-1 text-sm text-smoke">E-posta: {me.email}</p>
      <div className="mt-8 flex flex-col gap-3">
        <Link href="/account/orders" className="text-sm text-champagne-300 underline">
          Siparişlerim
        </Link>
        <button onClick={logout} className="text-left text-sm text-dim hover:text-ink transition-colors duration-[180ms]">
          Çıkış yap
        </button>
      </div>
    </div>
  );
}

function AuthForms({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") {
        await api.post("/auth/register", form);
      } else {
        await api.post("/auth/login", { email: form.email, password: form.password });
      }
      onAuthed();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Bir hata oluştu");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

  return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <h1 className="font-display text-[32px] font-normal text-ink mb-8">
        {mode === "login" ? "Giriş Yap" : "Üye Ol"}
      </h1>
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <input
            placeholder="Ad Soyad"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        )}
        <input
          type="email"
          placeholder="E-posta"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Şifre"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className={inputClass}
        />
        {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full h-12 rounded-xs bg-charcoal-700 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
          style={{ letterSpacing: "0.1em" }}
        >
          {busy ? "..." : mode === "login" ? "GİRİŞ YAP" : "ÜYE OL"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-5 text-sm text-smoke hover:text-ink underline transition-colors duration-[180ms]"
      >
        {mode === "login" ? "Hesabın yok mu? Üye ol" : "Zaten üye misin? Giriş yap"}
      </button>
      <p className="mt-6 text-xs text-dim">Üye olmadan da misafir olarak alışveriş yapabilirsiniz.</p>
    </div>
  );
}
