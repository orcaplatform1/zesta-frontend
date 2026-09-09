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

  if (me === undefined) return <div className="mx-auto max-w-md px-4 py-16 text-neutral-500">Yükleniyor...</div>;
  if (me) return <ProfileView me={me} onLogout={() => setMe(null)} />;
  return <AuthForms onAuthed={loadMe} />;
}

function ProfileView({ me, onLogout }: { me: Me; onLogout: () => void }) {
  async function logout() {
    await api.post("/auth/logout");
    onLogout();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6">Hesabım</h1>
      <p className="text-sm text-neutral-600">Ad Soyad: {me.name}</p>
      <p className="text-sm text-neutral-600">E-posta: {me.email}</p>
      <div className="mt-6 flex flex-col gap-2">
        <Link href="/account/orders" className="underline text-sm">
          Siparişlerim
        </Link>
        <button onClick={logout} className="text-left text-sm text-red-600 underline">
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

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6">{mode === "login" ? "Giriş Yap" : "Üye Ol"}</h1>
      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && (
          <input
            placeholder="Ad Soyad"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
          />
        )}
        <input
          type="email"
          placeholder="E-posta"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Şifre"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-neutral-900 text-white px-6 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {busy ? "..." : mode === "login" ? "Giriş Yap" : "Üye Ol"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-4 text-sm underline text-neutral-600"
      >
        {mode === "login" ? "Hesabın yok mu? Üye ol" : "Zaten üye misin? Giriş yap"}
      </button>
      <p className="mt-6 text-xs text-neutral-400">Üye olmadan da misafir olarak alışveriş yapabilirsiniz.</p>
    </div>
  );
}
