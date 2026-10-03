"use client";

import { useState, type FormEvent } from "react";

interface Props {
  onUnlock: () => void;
}

export function EbookPassword({ onUnlock }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/ebook/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        try { sessionStorage.setItem("zesta_ebook_zarafetin_izinde_unlocked", "1"); } catch {}
        onUnlock();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Kod geçersiz. Lütfen tekrar deneyin.");
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(8,8,8,0.96)", backdropFilter: "blur(8px)" }}
    >
      <div className="w-full max-w-[340px] px-6 text-center">
        <div className="mb-8">
          <p
            className="font-display text-[11px] tracking-[0.22em] uppercase mb-4"
            style={{ color: "#B98A55" }}
          >
            Zarafetin İzinde
          </p>
          <h2
            className="font-display text-[28px] font-normal leading-tight"
            style={{ color: "#E9DDC9" }}
          >
            Erişim Kodu
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "rgba(233,221,201,0.5)" }}>
            Bu kitabı okumak için erişim kodunuzu girin.
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="password"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(""); }}
            placeholder="Erişim kodu"
            autoFocus
            autoComplete="off"
            className="w-full h-12 rounded-full text-center text-[15px] tracking-[0.2em] outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: error ? "1px solid rgba(220,80,80,0.6)" : "1px solid rgba(185,138,85,0.3)",
              color: "#E9DDC9",
            }}
          />
          {error && (
            <p className="text-[12px]" style={{ color: "rgba(220,80,80,0.9)" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="h-12 rounded-full font-semibold text-[12px] tracking-[0.14em] uppercase transition-all duration-200 disabled:opacity-40"
            style={{ background: "#B98A55", color: "#0B0B0B" }}
          >
            {busy ? "Doğrulanıyor..." : "Kitabı Aç"}
          </button>
        </form>
      </div>
    </div>
  );
}
