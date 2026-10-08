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
import { BOOK_PAGES, TOTAL_PAGES } from "@/data/ebook/zarafetin-izinde";
import {
  MASTER_BOOK_WIDTH, MASTER_BOOK_HEIGHT,
  PAGE_FLIP_DURATION, SWIPE_THRESHOLD,
  EBOOK_STORAGE_KEY, EBOOK_SESSION_KEY,
} from "@/lib/ebook.config";

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

// Ölçeklenmiş sayfa wrapper
function ScaledPage({
  page,
  scale,
  onGoToPage,
}: {
  page: (typeof BOOK_PAGES)[number] | null;
  scale: number;
  onGoToPage?: (n: number) => void;
}) {
  if (!page) return null;
  return (
    <div
      style={{
        width: MASTER_BOOK_WIDTH,
        height: MASTER_BOOK_HEIGHT,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        flexShrink: 0,
      }}
    >
      <EbookPage page={page} onGoToPage={onGoToPage} />
    </div>
  );
}

export function EbookReader({ initialPage = 0 }: { initialPage?: number }) {
  const router = useRouter();

  const [phase, setPhase] = useState<"cover" | "password" | "reading">("cover");
  const [mounted, setMounted] = useState(false);

  // Sayfa state: displayPage = gözüken, flip state ayrı
  const [displayPage, setDisplayPage] = useState(initialPage);
  const [fromPage, setFromPage] = useState(initialPage);
  const [toPage, setToPage] = useState(initialPage);
  const [flipDir, setFlipDir] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const [flipReady, setFlipReady] = useState(false); // requestAnimationFrame sonrası true → transition başlar

  const [showContents, setShowContents] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resumeCandidate, setResumeCandidate] = useState<number | null>(null);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const animLock = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (isUnlocked()) { /* unlocked session */ }
    const stored = getStoredPage();
    if (stored && stored > 0 && stored < TOTAL_PAGES) setResumeCandidate(stored);
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const goTo = useCallback((n: number) => {
    if (n < 0 || n >= TOTAL_PAGES || animLock.current) return;
    animLock.current = true;

    const dir: "next" | "prev" = n > displayPage ? "next" : "prev";
    setFromPage(displayPage);
    setToPage(n);
    setFlipDir(dir);
    setAnimating(true);
    setFlipReady(false);

    // rAF: sayfa DOM'a mount olduktan sonra transition başlasın (0→180 jump olmaz)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlipReady(true);
      });
    });

    setTimeout(() => {
      setDisplayPage(n);
      setAnimating(false);
      setFlipReady(false);
      animLock.current = false;
      try { localStorage.setItem(EBOOK_STORAGE_KEY, String(n)); } catch {}
      router.replace(`?sayfa=${n}`, { scroll: false });
    }, PAGE_FLIP_DURATION + 40);
  }, [displayPage, router]);

  const goNext = useCallback(() => goTo(displayPage + 1), [goTo, displayPage]);
  const goPrev = useCallback(() => goTo(displayPage - 1), [goTo, displayPage]);

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
        window.innerWidth * 0.92 / MASTER_BOOK_WIDTH,
        window.innerHeight * 0.92 / MASTER_BOOK_HEIGHT,
        1,
      )
    : 0.5;

  const bookW = MASTER_BOOK_WIDTH * scale;
  const bookH = MASTER_BOOK_HEIGHT * scale;

  // Flip açısı — flipReady olunca transition başlar
  const leafRotate = flipReady
    ? (flipDir === "next" ? -180 : 180)
    : 0;

  const leafOrigin = flipDir === "next" ? "left center" : "right center";

  if (!mounted) {
    return (
      <div style={{ background: "#080A0A", position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "serif", fontSize: 13, letterSpacing: "0.2em", color: "#B98A55" }}>ZESTA</p>
          <p style={{ fontFamily: "serif", fontSize: 20, color: "rgba(233,221,201,0.4)", marginTop: 8 }}>Zarafetin İzinde</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "#080A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── KAPAK ── */}
      {phase === "cover" && (
        <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setPhase("password")}>
          <div style={{
            width: bookW, height: bookH,
            transform: `perspective(${bookW * 3}px) rotateY(-8deg) rotateX(1deg)`,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "24px 24px 90px rgba(0,0,0,0.95), -6px 0 24px rgba(0,0,0,0.5), inset -4px 0 12px rgba(0,0,0,0.4)",
          }}>
            <ScaledPage page={BOOK_PAGES[0]} scale={scale} />
          </div>
          <p style={{
            position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)",
            fontFamily: "var(--font-manrope), sans-serif",
            fontSize: 13, letterSpacing: "0.12em", color: "rgba(185,138,85,0.85)",
            textTransform: "uppercase", whiteSpace: "nowrap", fontWeight: 600,
          }}>
            Kitabı Okumak için Tıklayın
          </p>
        </div>
      )}

      {/* ── ŞİFRE ── */}
      {phase === "password" && (
        <>
          <div style={{ width: bookW, height: bookH, opacity: 0.15, filter: "blur(6px)", borderRadius: 3, overflow: "hidden" }}>
            <ScaledPage page={BOOK_PAGES[0]} scale={scale} />
          </div>
          <EbookPassword onUnlock={() => {
            setPhase("reading");
            setDisplayPage(1);
            setFromPage(1);
            setToPage(1);
          }} />
        </>
      )}

      {/* ── OKUMA ── */}
      {phase === "reading" && (
        <>
          {/* Devam et prompt */}
          {resumeCandidate && resumeCandidate > displayPage && (
            <div style={{
              position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)",
              zIndex: 80, background: "rgba(12,16,16,0.95)", border: "1px solid rgba(185,138,85,0.22)",
              borderRadius: 40, padding: "9px 18px", display: "flex", alignItems: "center", gap: 12,
              backdropFilter: "blur(10px)", whiteSpace: "nowrap",
            }}>
              <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 11, color: "rgba(233,221,201,0.65)" }}>
                Sayfa {resumeCandidate}&apos;den devam et?
              </p>
              <button onClick={() => { goTo(resumeCandidate); setResumeCandidate(null); }}
                style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 10, letterSpacing: "0.1em", color: "#B98A55", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                DEVAM ET
              </button>
              <button onClick={() => setResumeCandidate(null)}
                style={{ color: "rgba(233,221,201,0.35)", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
                ✕
              </button>
            </div>
          )}

          {/* Kitap */}
          <div style={{ position: "relative", width: bookW, height: bookH }}>

            {/* Click zones — görünmez */}
            <button aria-label="Önceki sayfa" onClick={goPrev} disabled={displayPage <= 1 || animating}
              style={{ position: "absolute", left: 0, top: 0, width: "28%", height: "100%", zIndex: 20, background: "none", border: "none", cursor: displayPage <= 1 ? "default" : "w-resize", opacity: 0 }} />
            <button aria-label="Sonraki sayfa" onClick={goNext} disabled={displayPage >= TOTAL_PAGES - 1 || animating}
              style={{ position: "absolute", right: 0, top: 0, width: "28%", height: "100%", zIndex: 20, background: "none", border: "none", cursor: displayPage >= TOTAL_PAGES - 1 ? "default" : "e-resize", opacity: 0 }} />

            {/* 3D kitap container */}
            <div style={{
              width: bookW, height: bookH,
              perspective: `${bookW * 5}px`,
              perspectiveOrigin: "50% 50%",
              position: "relative",
              borderRadius: 3,
              boxShadow: "0 24px 90px rgba(0,0,0,0.85), 5px 0 18px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}>

              {/* ALTTA: hedef sayfa (animasyon boyunca görünür) */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                <ScaledPage
                  page={animating ? BOOK_PAGES[toPage] : BOOK_PAGES[displayPage]}
                  scale={scale}
                  onGoToPage={goTo}
                />
              </div>

              {/* ÜSTTE: flip yaprağı — sadece animasyon sırasında */}
              {animating && (
                <div style={{
                  position: "absolute", inset: 0,
                  transformStyle: "preserve-3d",
                  transformOrigin: leafOrigin,
                  transform: `rotateY(${leafRotate}deg)`,
                  transition: flipReady
                    ? `transform ${PAGE_FLIP_DURATION}ms cubic-bezier(0.645, 0.045, 0.355, 1.000)`
                    : "none",
                  zIndex: 5,
                }}>
                  {/* Ön yüz: kaynak sayfa */}
                  <div style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    overflow: "hidden",
                  }}>
                    <ScaledPage page={BOOK_PAGES[fromPage]} scale={scale} />
                    {/* Kaldırma gölgesi — yaprak dönerken koyulaşır */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: flipDir === "next"
                        ? "linear-gradient(to left, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.35) 100%)"
                        : "linear-gradient(to right, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.35) 100%)",
                      pointerEvents: "none",
                    }} />
                  </div>

                  {/* Arka yüz: hedef sayfa (rotateY 180deg → döndüğünde düzgün görünür) */}
                  <div style={{
                    position: "absolute", inset: 0,
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    overflow: "hidden",
                  }}>
                    {/* scaleX(-1) → arka yüzde ayna etkisini düzelt */}
                    <div style={{
                      width: "100%", height: "100%",
                      transform: "scaleX(-1)",
                    }}>
                      <ScaledPage page={BOOK_PAGES[toPage]} scale={scale} />
                    </div>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: flipDir === "next"
                        ? "linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.0) 50%)"
                        : "linear-gradient(to left, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.0) 50%)",
                      pointerEvents: "none",
                    }} />
                  </div>
                </div>
              )}

              {/* Sayfa numarası */}
              <div style={{
                position: "absolute", bottom: 13, left: "50%", transform: "translateX(-50%)",
                fontFamily: "var(--font-manrope), sans-serif", fontSize: 10, letterSpacing: "0.14em",
                color: "rgba(185,138,85,0.4)", zIndex: 10, pointerEvents: "none",
              }}>
                {String(displayPage).padStart(2, "0")}
              </div>
            </div>
          </div>

          <EbookControls
            currentPage={displayPage}
            totalPages={TOTAL_PAGES}
            onPrev={goPrev}
            onNext={goNext}
            onShowContents={() => setShowContents(true)}
            onFullscreen={toggleFullscreen}
            onClose={() => router.push("/")}
            isFullscreen={isFullscreen}
          />

          {showContents && (
            <EbookContents onGoToPage={goTo} onClose={() => setShowContents(false)} />
          )}
        </>
      )}
    </div>
  );
}
