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

  if (admin === undefined) return <div className="mx-auto max-w-sm px-4 py-16 text-neutral-500">Yükleniyor...</div>;
  if (!admin) return <AdminLoginForm onLoggedIn={refresh} />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <nav className="flex gap-4 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "font-semibold" : "text-neutral-500"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => adminApi.logout().then(() => setAdmin(null))}
          className="text-sm text-neutral-500 underline"
        >
          Çıkış ({admin.name})
        </button>
      </div>
      {children}
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

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6">Admin Girişi</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          placeholder="E-posta"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Şifre"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-neutral-900 text-white px-6 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {busy ? "..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
