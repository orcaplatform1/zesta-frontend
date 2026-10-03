"use client";

import {
  useState, useEffect, useCallback, useRef,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { useRouter } from "next/navigation";
import { EbookPassword } from "./EbookPassword";
import { EbookPage } from "./EbookPage";
import { EbookControls } from "./EbookControls";
import { EbookContents } from "./EbookContents";
import {
  BOOK_PAGES, TOTAL_PAGES,
} from "@/data/ebook/zarafetin-izinde";
import {
  MASTER_BOOK_WIDTH, MASTER_BOOK_HEIGHT,
  PAGE_FLIP_DURATION, SWIPE_THRESHOLD,
  EBOOK_STORAGE_KEY, EBOOK_SESSION_KEY,
} from "@/lib/ebook.config";

type FlipDir = "next" | "prev" | null;

function getStoredPage(): number | null {
  try {
    const v = localStorage.getItem(EBOOK_STORAGE_KEY);
    if (v) return parseInt(v, 10);
  } catch {}
  return null;
}

function isUnlocked(): boolean {
  try { return sessionStorage.getItem(EBOOK_SESSION_KEY) === "1"; } catch { return false; }
}

export function EbookReader({ initialPage = 0 }: { initialPage?: number }) {
  const router = useRouter();
  const [phase, setPhase] = useState<"cover" | "password" | "reading">("cover");
  const [unlocked, setUnlocked] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<FlipDir>(null);
  const [showContents, setShowContents] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resumeCandidate, setResumeCandidate] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    setMounted(true);
    if (isUnlocked()) setUnlocked(true);
    const stored = getStoredPage();
    if (stored && stored > 0 && stored < TOTAL_PAGES) setResumeCandidate(stored);

    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const goTo = useCallback((n: number) => {
    if (n < 0 || n >= TOTAL_PAGES || flipping) return;
    const dir: FlipDir = n > currentPage ? "next" : "prev";
    setFlipDir(dir);
    setFlipping(true);
    setTimeout(() => {
      setCurrentPage(n);
      setFlipping(false);
      setFlipDir(null);
      try { localStorage.setItem(EBOOK_STORAGE_KEY, String(n)); } catch {}
      router.replace(`?page=${n}`, { scroll: false });
    }, PAGE_FLIP_DURATION);
  }, [currentPage, flipping, router]);

  const goNext = useCallback(() => goTo(currentPage + 1), [goTo, currentPage]);
  const goPrev = useCallback(() => goTo(currentPage - 1), [goTo, currentPage]);

  useEffect(() => {
    if (phase !== "reading") return;
    function onKey(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowRight": case "ArrowDown": case " ": e.preventDefault(); goNext(); break;
        case "ArrowLeft": case "ArrowUp": case "Backspace": e.preventDefault(); goPrev(); break;
        case "Home": e.preventDefault(); goTo(1); break;
        case "End": e.preventDefault(); goTo(TOTAL_PAGES - 1); break;
        case "Escape": e.preventDefault(); setShowContents(false); break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, goNext, goPrev, goTo]);

  function onTouchStart(e: ReactTouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: ReactTouchEvent) {
    if (phase !== "reading") return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) goNext(); else goPrev();
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  const scale = mounted
    ? Math.min(
        (typeof window !== "undefined" ? window.innerWidth * 0.92 : 1024) / MASTER_BOOK_WIDTH,
        (typeof window !== "undefined" ? window.innerHeight * 0.92 : 1536) / MASTER_BOOK_HEIGHT,
        1,
      )
    : 0.5;

  const bookWidth = MASTER_BOOK_WIDTH * scale;
  const bookHeight = MASTER_BOOK_HEIGHT * scale;

  const currentPageData = BOOK_PAGES[currentPage];

  if (!mounted) {
    return (
      <div style={{ background: "#080A0A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "serif", fontSize: 13, letterSpacing: "0.2em", color: "#B98A55" }}>ZESTA</p>
          <p style={{ fontFamily: "serif", fontSize: 20, color: "rgba(233,221,201,0.5)", marginTop: 8 }}>Zarafetin İzinde</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#080A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Cover phase */}
      {phase === "cover" && (
        <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setPhase("password")}>
          <div
            style={{
              width: bookWidth, height: bookHeight,
              transform: `perspective(${bookWidth * 3}px) rotateY(-6deg)`,
              transformOrigin: "center center",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "20px 20px 80px rgba(0,0,0,0.9), -4px 0 20px rgba(0,0,0,0.4)",
              transition: "transform 600ms ease",
            }}
          >
            <div style={{ width: MASTER_BOOK_WIDTH, height: MASTER_BOOK_HEIGHT, transform: `scale(${scale})`, transformOrigin: "top left" }}>
              <EbookPage page={BOOK_PAGES[0]} />
            </div>
          </div>
          <p style={{
            position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)",
            fontFamily: "var(--font-manrope), sans-serif",
            fontSize: 10, letterSpacing: "0.22em", color: "rgba(185,138,85,0.7)",
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            Açmak için tıklayın
          </p>
        </div>
      )}

      {/* Password phase */}
      {phase === "password" && (
        <>
          <div style={{ width: bookWidth, height: bookHeight, opacity: 0.2, filter: "blur(4px)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: MASTER_BOOK_WIDTH, height: MASTER_BOOK_HEIGHT, transform: `scale(${scale})`, transformOrigin: "top left" }}>
              <EbookPage page={BOOK_PAGES[0]} />
            </div>
          </div>
          <EbookPassword onUnlock={() => {
            setUnlocked(true);
            setPhase("reading");
            setCurrentPage(1);
            if (resumeCandidate && resumeCandidate > 1) {
              // resume prompt handled below
            }
          }} />
        </>
      )}

      {/* Reading phase */}
      {phase === "reading" && (
        <>
          {/* Resume prompt */}
          {resumeCandidate && resumeCandidate > currentPage && (
            <div
              style={{
                position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
                zIndex: 80,
                background: "rgba(12,16,16,0.96)",
                border: "1px solid rgba(185,138,85,0.25)",
                borderRadius: 40,
                padding: "10px 20px",
                display: "flex", alignItems: "center", gap: 12,
                backdropFilter: "blur(10px)",
              }}
            >
              <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 11, color: "rgba(233,221,201,0.7)" }}>
                Sayfa {resumeCandidate}&apos;den devam et?
              </p>
              <button
                onClick={() => { goTo(resumeCandidate); setResumeCandidate(null); }}
                style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 10, letterSpacing: "0.1em", color: "#B98A55", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
              >
                DEVAM ET
              </button>
              <button
                onClick={() => setResumeCandidate(null)}
                style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 10, color: "rgba(233,221,201,0.4)", background: "none", border: "none", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Book */}
          <div style={{ position: "relative", width: bookWidth, height: bookHeight }}>
            {/* Click zones */}
            <button
              aria-label="Önceki sayfa"
              onClick={goPrev}
              disabled={currentPage <= 1 || flipping}
              style={{ position: "absolute", left: 0, top: 0, width: "30%", height: "100%", zIndex: 10, background: "none", border: "none", cursor: currentPage <= 1 ? "default" : "w-resize", opacity: 0 }}
            />
            <button
              aria-label="Sonraki sayfa"
              onClick={goNext}
              disabled={currentPage >= TOTAL_PAGES - 1 || flipping}
              style={{ position: "absolute", right: 0, top: 0, width: "30%", height: "100%", zIndex: 10, background: "none", border: "none", cursor: currentPage >= TOTAL_PAGES - 1 ? "default" : "e-resize", opacity: 0 }}
            />

            {/* Book container with flip animation */}
            <div
              style={{
                width: "100%", height: "100%",
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 20px 80px rgba(0,0,0,0.8), 4px 0 16px rgba(0,0,0,0.3)",
                perspective: `${MASTER_BOOK_WIDTH * 4}px`,
                position: "relative",
              }}
            >
              {/* Current page */}
              <div
                style={{
                  position: "absolute", inset: 0,
                  transformOrigin: flipDir === "next" ? "left center" : "right center",
                  transition: flipping ? `transform ${PAGE_FLIP_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` : "none",
                  transform: flipping
                    ? flipDir === "next"
                      ? "rotateY(-12deg)"
                      : "rotateY(12deg)"
                    : "rotateY(0deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div style={{ width: MASTER_BOOK_WIDTH, height: MASTER_BOOK_HEIGHT, transform: `scale(${scale})`, transformOrigin: "top left" }}>
                  {currentPageData && <EbookPage page={currentPageData} onGoToPage={(n) => goTo(n)} />}
                </div>
                {flipping && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to right, transparent 60%, rgba(0,0,0,0.3) 100%)",
                    pointerEvents: "none",
                  }} />
                )}
              </div>

              {/* Page number */}
              <div style={{
                position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: 10, letterSpacing: "0.14em",
                color: "rgba(185,138,85,0.45)",
                zIndex: 5, pointerEvents: "none",
              }}>
                {String(currentPage).padStart(2, "0")}
              </div>
            </div>
          </div>

          <EbookControls
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            onPrev={goPrev}
            onNext={goNext}
            onShowContents={() => setShowContents(true)}
            onFullscreen={toggleFullscreen}
            onClose={() => router.push("/")}
            isFullscreen={isFullscreen}
          />

          {showContents && (
            <EbookContents
              onGoToPage={goTo}
              onClose={() => setShowContents(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
