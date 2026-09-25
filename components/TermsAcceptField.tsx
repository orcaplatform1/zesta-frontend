"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "@/lib/api";
import type { Page } from "@/lib/types";

/**
 * Tek yasal metin için onay alanı. Kutucuk ELLE işaretlenemez: "Metni aç" ile açılan pencerede metnin en altına inilince
 * "Okudum, anladım, kabul ediyorum" düğmesi aktifleşir; düğmeye basınca kutucuk otomatik işaretlenir.
 */
function LegalAcceptField({
  slug,
  title,
  label,
  accepted,
  onAccept,
}: {
  slug: string;
  title: string;
  label: string;
  accepted: boolean;
  onAccept: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setReachedBottom(false);
    if (content === null) {
      api.get<Page>(`/pages/${slug}`).then((p) => setContent(p?.content ?? "İçerik yüklenemedi.")).catch(() => setContent("İçerik yüklenemedi."));
    }
  }, [open, slug, content]);

  // Metin kısaysa (kaydırma gerekmiyorsa) düğme hemen aktifleşsin
  useEffect(() => {
    if (!open || content === null) return;
    const t = setTimeout(() => {
      const el = scrollRef.current;
      if (el && el.scrollHeight - el.clientHeight <= 24) setReachedBottom(true);
    }, 100);
    return () => clearTimeout(t);
  }, [open, content]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el || reachedBottom) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setReachedBottom(true);
  }

  return (
    <>
      <div className="flex items-start gap-2.5 text-[13px] text-smoke">
        <input
          type="checkbox"
          checked={accepted}
          readOnly
          aria-readonly
          tabIndex={-1}
          onClick={(e) => e.preventDefault()}
          className="pointer-events-none mt-0.5 h-4 w-4 flex-shrink-0 accent-[var(--zesta-green)]"
        />
        <span>
          <span className="text-ink">{label}</span>
          <br />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-ink underline decoration-[var(--border-hover)] underline-offset-2 hover:text-[var(--zesta-green)]"
          >
            {accepted ? "Metni tekrar oku" : "Metni aç ve oku"}
          </button>
        </span>
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <button onClick={() => setOpen(false)} aria-label="Kapat" className="absolute inset-0 bg-black/50" />
            <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-sm bg-[var(--ivory-50)] shadow-[var(--shadow-xl)]">
              <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--border-subtle)] p-5">
                <h2 className="font-display text-[19px] font-normal text-ink">{title}</h2>
                <button onClick={() => setOpen(false)} aria-label="Kapat" className="text-2xl leading-none text-dim hover:text-ink">×</button>
              </div>
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-5 text-[13px] leading-relaxed text-[color:var(--text-on-light-secondary)]"
              >
                {content === null ? <p className="text-sm text-ash">Yükleniyor...</p> : <p className="whitespace-pre-line">{content}</p>}
                {content !== null && <p className="mt-6 text-center text-xs text-ash">— Metnin sonu —</p>}
              </div>
              <div className="flex-shrink-0 border-t border-[var(--border-subtle)] p-5">
                <button
                  type="button"
                  disabled={!reachedBottom}
                  onClick={() => {
                    onAccept();
                    setOpen(false);
                  }}
                  className="h-11 w-full rounded-full bg-charcoal-700 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800 disabled:opacity-40"
                  style={{ letterSpacing: "0.06em" }}
                >
                  {reachedBottom ? "OKUDUM, ANLADIM, KABUL EDİYORUM" : "DEVAM ETMEK İÇİN SONUNA KADAR OKUYUN"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

/** Kullanım Şartları ve KVKK Aydınlatma Metni ayrı ayrı onaylanır; ikisi de tamamlanınca `onChange(true)` çağrılır. */
export function TermsAcceptField({ accepted, onChange }: { accepted: boolean; onChange: (v: boolean) => void }) {
  const [terms, setTerms] = useState(accepted);
  const [kvkk, setKvkk] = useState(accepted);
  useEffect(() => {
    onChange(terms && kvkk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, kvkk]);
  return (
    <div className="space-y-3">
      <LegalAcceptField slug="kullanim-kosullari" title="Kullanım Şartları" label="Kullanım Şartları'nı okudum, anladım ve kabul ediyorum." accepted={terms} onAccept={() => setTerms(true)} />
      <LegalAcceptField slug="kvkk" title="KVKK Aydınlatma Metni" label="KVKK Aydınlatma Metni'ni okudum ve anladım." accepted={kvkk} onAccept={() => setKvkk(true)} />
      <p className="text-xs text-ash">
        Elle işaretlenemez. Her iki metni de açın, en alta kadar okuyup &quot;Okudum, anladım, kabul ediyorum&quot;a basın; kutucuklar otomatik işaretlenecektir.
      </p>
    </div>
  );
}
