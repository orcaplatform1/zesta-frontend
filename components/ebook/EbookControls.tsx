"use client";

import { useState, useEffect } from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onShowContents: () => void;
  onFullscreen: () => void;
  onClose: () => void;
  isFullscreen: boolean;
}

export function EbookControls({
  currentPage, totalPages, onPrev, onNext,
  onShowContents, onFullscreen, onClose, isFullscreen,
}: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function show() {
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 3000);
    }
    window.addEventListener("mousemove", show);
    window.addEventListener("touchstart", show);
    show();
    return () => {
      window.removeEventListener("mousemove", show);
      window.removeEventListener("touchstart", show);
      clearTimeout(timer);
    };
  }, []);

  const btnStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    height: 34, paddingInline: 14,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    color: "rgba(233,221,201,0.75)",
    cursor: "pointer",
    fontSize: 12,
    letterSpacing: "0.04em",
    transition: "background 180ms",
    gap: 6,
  };

  return (
    <div
      style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 60,
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 12px",
        background: "rgba(10,14,14,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 40,
        opacity: visible ? 1 : 0,
        transition: "opacity 400ms",
        pointerEvents: visible ? "auto" : "none",
        whiteSpace: "nowrap",
      }}
    >
      <button onClick={onPrev} disabled={currentPage <= 0} aria-label="Önceki sayfa" style={{ ...btnStyle, opacity: currentPage <= 0 ? 0.3 : 1 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <span style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 11, color: "rgba(185,138,85,0.9)", letterSpacing: "0.1em", minWidth: 56, textAlign: "center" }}>
        {String(currentPage).padStart(2, "0")} / {String(totalPages - 1).padStart(2, "0")}
      </span>

      <button onClick={onNext} disabled={currentPage >= totalPages - 1} aria-label="Sonraki sayfa" style={{ ...btnStyle, opacity: currentPage >= totalPages - 1 ? 0.3 : 1 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />

      <button onClick={onShowContents} aria-label="İçindekiler" style={btnStyle}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/></svg>
      </button>

      <button onClick={onFullscreen} aria-label={isFullscreen ? "Tam ekrandan çık" : "Tam ekran"} style={btnStyle}>
        {isFullscreen ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        )}
      </button>

      <button onClick={onClose} aria-label="Kapat" style={{ ...btnStyle, background: "rgba(180,50,50,0.15)", borderColor: "rgba(180,50,50,0.2)" }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}
