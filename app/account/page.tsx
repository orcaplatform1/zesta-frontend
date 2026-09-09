"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";

interface Me {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  birthDate: string | null;
}

const inputClass =
  "w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

function toDateInputValue(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
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
  if (me) return <ProfileView me={me} onLogout={() => setMe(null)} onUpdated={setMe} />;
  return <AuthForms onAuthed={loadMe} />;
}

function ProfileView({
  me,
  onLogout,
  onUpdated,
}: {
  me: Me;
  onLogout: () => void;
  onUpdated: (me: Me) => void;
}) {
  const [email, setEmail] = useState(me.email);
  const [phone, setPhone] = useState(me.phone ?? "");
  const [birthDate, setBirthDate] = useState(toDateInputValue(me.birthDate));
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function logout() {
    await api.post("/auth/logout");
    onLogout();
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setProfileBusy(true);
    setProfileMessage(null);
    setProfileError(null);
    try {
      const updated = await api.patch<Me>("/customers/me/profile", {
        email,
        phone,
        birthDate: birthDate || undefined,
      });
      onUpdated(updated);
      setProfileMessage("Bilgileriniz güncellendi.");
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Güncellenemedi");
    } finally {
      setProfileBusy(false);
    }
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);
    if (newPassword !== newPasswordRepeat) {
      setPasswordError("Yeni şifreler eşleşmiyor");
      return;
    }
    setPasswordBusy(true);
    try {
      await api.patch("/customers/me/password", { currentPassword, newPassword });
      setPasswordMessage("Şifreniz güncellendi.");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordRepeat("");
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Şifre güncellenemedi");
    } finally {
      setPasswordBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-24">
      <h1 className="font-display text-[32px] font-normal text-ink mb-8">Hesabım</h1>

      <p className="text-sm text-smoke">Ad Soyad: {me.name}</p>
      <p className="mt-1 text-xs text-dim">Ad soyad kayıt sonrası değiştirilemez.</p>

      <form onSubmit={saveProfile} className="mt-8 space-y-3">
        <label className="block">
          <span className="label-uppercase block mb-1.5">E-posta</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="label-uppercase block mb-1.5">Telefon</span>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="label-uppercase block mb-1.5">Doğum Tarihi</span>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={inputClass} />
        </label>
        {profileMessage && <p className="text-sm text-champagne-300">{profileMessage}</p>}
        {profileError && <p className="text-sm text-[var(--status-error)]">{profileError}</p>}
        <button
          type="submit"
          disabled={profileBusy}
          className="h-11 rounded-xs bg-charcoal-700 px-6 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
          style={{ letterSpacing: "0.1em" }}
        >
          {profileBusy ? "KAYDEDİLİYOR..." : "BİLGİLERİ KAYDET"}
        </button>
      </form>

      <div className="mt-12 border-t border-[var(--border-subtle)] pt-8">
        <h2 className="label-uppercase mb-4">Şifre Değiştir</h2>
        <form onSubmit={changePassword} className="space-y-3">
          <input
            type="password"
            placeholder="Mevcut şifre"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Yeni şifre (6-20 karakter)"
            required
            minLength={6}
            maxLength={20}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Yeni şifre (tekrar)"
            required
            minLength={6}
            maxLength={20}
            value={newPasswordRepeat}
            onChange={(e) => setNewPasswordRepeat(e.target.value)}
            className={inputClass}
          />
          {passwordMessage && <p className="text-sm text-champagne-300">{passwordMessage}</p>}
          {passwordError && <p className="text-sm text-[var(--status-error)]">{passwordError}</p>}
          <button
            type="submit"
            disabled={passwordBusy}
            className="h-11 rounded-xs bg-charcoal-700 px-6 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
            style={{ letterSpacing: "0.1em" }}
          >
            {passwordBusy ? "GÜNCELLENİYOR..." : "ŞİFREYİ GÜNCELLE"}
          </button>
        </form>
      </div>

      <div className="mt-12 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-8">
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
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", birthDate: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") {
        await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          birthDate: form.birthDate || undefined,
        });
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
    <div className="mx-auto max-w-sm px-5 py-24">
      <h1 className="font-display text-[32px] font-normal text-ink mb-8">
        {mode === "login" ? "Giriş Yap" : "Üye Ol"}
      </h1>
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <>
            <input
              placeholder="Ad Soyad"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
            <input
              placeholder="Telefon"
              required
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className={inputClass}
            />
          </>
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
          placeholder="Şifre (6-20 karakter)"
          required
          minLength={6}
          maxLength={20}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className={inputClass}
        />
        {mode === "register" && (
          <label className="block">
            <span className="label-uppercase block mb-1.5">Doğum Tarihi (opsiyonel)</span>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
              className={inputClass}
            />
          </label>
        )}
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
      <p className="mt-6 text-xs text-dim">Sipariş verebilmek için üye olmanız gerekir.</p>
    </div>
  );
}
