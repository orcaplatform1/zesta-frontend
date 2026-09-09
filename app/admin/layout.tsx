"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminApi, type AdminMe } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Ürünler" },
  { href: "/admin/orders", label: "Siparişler" },
  { href: "/admin/reviews", label: "Yorumlar" },
  { href: "/admin/homepage", label: "Anasayfa" },
  { href: "/admin/settings", label: "Ayarlar" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminMe | null | undefined>(undefined);

  function refresh() {
    adminApi
      .me()
      .then(setAdmin)
      .catch(() => setAdmin(null));
  }

  useEffect(refresh, []);

  if (admin === undefined)
    return <div className="mx-auto max-w-sm px-5 py-24 text-sm text-ash">Yükleniyor...</div>;
  if (!admin) return <AdminLoginForm onLoggedIn={refresh} />;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-onyx-800">
      <div className="border-b border-[var(--border-subtle)] bg-onyx-900">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 flex items-center justify-between h-14">
          <nav className="flex gap-6 text-[13px]" style={{ letterSpacing: "0.06em" }}>
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors duration-[180ms]"
                  style={{ color: active ? "var(--champagne-300)" : "var(--text-secondary)" }}
                >
                  {item.label.toUpperCase()}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => adminApi.logout().then(() => setAdmin(null))}
            className="text-sm text-dim hover:text-ink transition-colors duration-[180ms]"
          >
            Çıkış ({admin.name})
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-5 md:px-12 py-10">{children}</div>
    </div>
  );
}

function AdminLoginForm({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await adminApi.login(email, password);
      onLoggedIn();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Giriş başarısız");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "w-full h-12 rounded-xs border border-[var(--border-subtle)] bg-onyx-700 px-3.5 text-sm text-ink placeholder:text-dim focus:outline-none focus:border-[var(--border-accent)]";

  return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <p className="eyebrow text-center">Zesta</p>
      <h1 className="mt-3 text-center font-display text-[28px] font-normal text-ink">Admin Girişi</h1>
      <form onSubmit={submit} className="mt-8 space-y-3">
        <input
          type="text"
          placeholder="Kullanıcı Adı"
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
          className="w-full h-12 rounded-xs bg-charcoal-700 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
          style={{ letterSpacing: "0.1em" }}
        >
          {busy ? "..." : "GİRİŞ YAP"}
        </button>
      </form>
    </div>
  );
}
