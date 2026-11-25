"use client";

import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/HeaderIcons";

export function HeaderSearch() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    router.push(q ? `/magaza?q=${encodeURIComponent(q)}` : "/magaza");
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex h-11 w-full items-center gap-2 px-4 transition-colors duration-[180ms] focus-within:border-[var(--zesta-primary)]"
      style={{
        background: "var(--zesta-surface-muted)",
        border: "1px solid var(--zesta-border)",
        borderRadius: "var(--radius-sm)",
      }}
    >
      <input
        name="q"
        type="search"
        placeholder="Ürün, kategori veya tasarımcı ara"
        aria-label="Ürün, kategori veya tasarımcı ara"
        className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ash"
      />
      <button type="submit" aria-label="Ara" className="flex-shrink-0" style={{ color: "var(--zesta-primary)" }}>
        <SearchIcon size={18} />
      </button>
    </form>
  );
}
