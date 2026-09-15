"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "@/lib/api";
import type { Page } from "@/lib/types";

/**
 * Gizlilik Politikası + Kullanım Şartları'nı açılır pencerede gösterir;
 * kullanıcı en alta kadar kaydırmadan "Okudum, Kabul Ediyorum" pasif kalır.
 * Kutucuk yalnızca bu akıştan geçilince işaretlenir — doğrudan tıklayarak
 * (okumadan) kendiliğinden işaretlenmez.
 */
export function TermsAcceptField({ accepted, onChange }: { accepted: boolean; onChange: (v: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [privacy, setPrivacy] = useState<string | null>(null);
  const [terms, setTerms] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || privacy !== null) return;
    Promise.all([
      api.get<Page>("/pages/gizlilik-politikasi").catch(() => null),
      api.get<Page>("/pages/kullanim-kosullari").catch(() => null),
    ]).then(([p, t]) => {
      setPrivacy(p?.content ?? "İçerik yüklenemedi.");
      setTerms(t?.content ?? "İçerik yüklenemedi.");
    });
  }, [open, privacy]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el || reachedBottom) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setReachedBottom(true);
  }

  function confirm() {
    onChange(true);
    setOpen(false);
  }

  return (
    <>
      <label className="flex items-start gap-2.5 text-[13px] text-smoke">
        <input
          type="checkbox"
          checked={accepted}
          required
          onClick={(e) => {
            if (!accepted) {
              e.preventDefault();
              setOpen(true);
            }
          }}
          onChange={() => {
            // okuma akışı tamamlanmadan işaretlenemez; zaten işaretliyken
            // tekrar tıklanırsa geri kaldırılabilir.
            if (accepted) onChange(false);
          }}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[var(--zesta-green)]"
        />
        <span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-ink underline decoration-[var(--border-hover)] underline-offset-2 hover:text-[var(--zesta-green)]"
          >
            Gizlilik Politikası ve Kullanım Şartları&apos;nı
          </button>{" "}
          okudum, kabul ediyorum.
        </span>
      </label>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <button onClick={() => setOpen(false)} aria-label="Kapat" className="absolute inset-0 bg-black/50" />
            <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-sm bg-[var(--ivory-50)] shadow-[var(--shadow-xl)]">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] p-5 flex-shrink-0">
                <h2 className="font-display text-[19px] font-normal text-ink">Gizlilik Politikası & Kullanım Şartları</h2>
                <button onClick={() => setOpen(false)} aria-label="Kapat" className="text-2xl leading-none text-dim hover:text-ink">
                  ×
                </button>
              </div>

              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-5 text-[13px] leading-relaxed text-[color:var(--text-on-light-secondary)]"
              >
                {privacy === null ? (
                  <p className="text-sm text-ash">Yükleniyor...</p>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h3 className="mb-2 text-[14px] font-medium text-ink">Gizlilik Politikası</h3>
                      <p className="whitespace-pre-line">{privacy}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-[14px] font-medium text-ink">Kullanım Şartları</h3>
                      <p className="whitespace-pre-line">{terms}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--border-subtle)] p-5 flex-shrink-0">
                <button
                  type="button"
                  disabled={!reachedBottom}
                  onClick={confirm}
                  className="w-full h-11 rounded-full bg-charcoal-700 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
                  style={{ letterSpacing: "0.06em" }}
                >
                  {reachedBottom ? "OKUDUM, KABUL EDİYORUM" : "DEVAM ETMEK İÇİN SONUNA KADAR OKUYUN"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
