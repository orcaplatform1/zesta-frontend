"use client";

import { TABLE_OF_CONTENTS, BOOK_TITLE } from "@/data/ebook/zarafetin-izinde";

interface Props {
  onGoToPage: (n: number) => void;
  onClose: () => void;
}

export function EbookContents({ onGoToPage, onClose }: Props) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 70,
        background: "rgba(6,8,8,0.94)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%", maxWidth: 480,
          padding: "48px 40px",
          background: "rgba(18,22,22,0.98)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8,
          margin: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 10, letterSpacing: "0.2em", color: "#B98A55", textTransform: "uppercase", marginBottom: 8 }}>
              İçindekiler
            </p>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 28, fontWeight: 400, color: "#E9DDC9" }}>
              {BOOK_TITLE}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(233,221,201,0.6)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {TABLE_OF_CONTENTS.map((entry, i) => (
            <button
              key={entry.title}
              onClick={() => { onGoToPage(entry.pageNumber); onClose(); }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "13px 0",
                borderBottom: i < TABLE_OF_CONTENTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                background: "none", border: "none",
                cursor: "pointer", textAlign: "left",
                gap: 12,
              }}
            >
              <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 18, color: "#E9DDC9", fontWeight: 400 }}>
                {entry.title}
              </span>
              <span style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 11, color: "#B98A55", letterSpacing: "0.1em", flexShrink: 0 }}>
                {String(entry.pageNumber).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
