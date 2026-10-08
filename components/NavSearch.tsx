"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function NavSearch({ iconClass }: { iconClass?: string } = {}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  function openPanel() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const panelW = Math.min(300, window.innerWidth - 24);
      // İkonun altına, sağ kenarına hizalı; ekrandan taşarsa sola kaydır
      let right = window.innerWidth - r.right;
      if (r.right - panelW < 12) right = window.innerWidth - panelW - 12;
      setPanelStyle({
        position: "fixed",
        top: r.bottom + 8,
        right,
        width: panelW,
        zIndex: 9999,
      });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      if (!btnRef.current?.contains(target) && !(e.target as Element)?.closest?.(".navsearch-panel")) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    setOpen(false);
    if (q) router.push(`/magaza?q=${encodeURIComponent(q)}`);
    else router.push("/magaza");
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label="Ara"
        aria-expanded={open}
        className={iconClass ?? "nav-dark-icon inline-flex h-10 w-10 items-center justify-center rounded-full transition-opacity duration-[200ms]"}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {open && (
        <div className="navsearch-panel" style={panelStyle}>
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 px-4"
            style={{
              height: "48px",
              background: "rgba(249,246,240,0.99)",
              border: "1px solid rgba(23,60,60,0.12)",
              borderRadius: "100px",
              boxShadow: "0 6px 24px rgba(9,43,43,0.18)",
            }}
          >
            <input
              ref={inputRef}
              name="q"
              type="search"
              placeholder="Ürün, kategori veya tasarımcı ara..."
              className="flex-1 bg-transparent outline-none text-ink placeholder:text-smoke/50"
              style={{ fontSize: "13px" }}
            />
            <button
              type="submit"
              aria-label="Ara"
              className="flex-shrink-0 text-smoke hover:text-ink transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
