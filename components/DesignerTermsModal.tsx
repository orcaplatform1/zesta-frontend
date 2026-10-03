"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

const SECTIONS = [
  {
    heading: "1. Komisyon ve Ödemeler",
    list: [
      "Zesta, platform üzerinden gerçekleşen her satıştan %15 komisyon alır; kalan tutar sizin payınızdır.",
      "Bir ürün satıldıktan sonra 15 gün içinde iade/iptal talebi gelmezse, tutar çekilebilir bakiyenize eklenir.",
      "Çekilebilir bakiyeniz 1.000 TL'ye ulaştığında ödeme talebinde bulunabilirsiniz.",
      "Onaylanan ödeme talepleri incelenip banka hesabınıza aktarılır.",
    ],
  },
  {
    heading: "2. Kargolama Yükümlülüğü",
    list: [
      "Bir siparişi aldıktan sonra en geç 7 gün (1 hafta) içinde ürünü kargoya vermeniz gerekir.",
      "Bu süre aşılırsa: 1. ihlalde tarafınıza uyarı gönderilir.",
      "2. ihlalde hesabınız askıya alınır; yeni ürün ekleme ve satış yapma yetkiniz durdurulur.",
    ],
  },
  {
    heading: "3. Ürün Onayı",
    body: "Eklediğiniz her ürün, mağazada yayınlanmadan önce Zesta ekibi tarafından incelenir ve onaylanır. Zesta, kalite ve içerik standartlarına uymayan ürünleri reddetme hakkını saklı tutar.",
  },
  {
    heading: "4. Fikri Mülkiyet",
    list: [
      "Platforma yüklediğiniz tasarım ve görsellerin telif hakları size aittir; Zesta yalnızca satış ve pazarlama amacıyla görüntüleme hakkına sahip olur.",
      "Başkasına ait tasarım veya görsel yüklemek yasaktır ve hesabın kalıcı olarak kapatılması sonucunu doğurur.",
    ],
  },
  {
    heading: "5. Fiyatlandırma",
    body: "Ürün fiyatını ve varsa indirim oranını siz belirlersiniz; komisyon, satış anındaki fiyat üzerinden hesaplanır.",
  },
  {
    heading: "6. Hesap Askıya Alma",
    body: "Zesta; bu koşullara aykırı davranış, tekrarlanan kargo ihlali veya haklı müşteri şikayetleri nedeniyle hesabınızı askıya alma hakkını saklı tutar.",
  },
];

export function DesignerTermsButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex h-12 items-center gap-2 rounded-full px-6 text-[12px] font-semibold text-white transition-all duration-[220ms] hover:-translate-y-[1px] hover:opacity-90"
        }
        style={{
          letterSpacing: "0.08em",
          background: "var(--zesta-accent)",
          boxShadow: "0 2px 12px rgba(196,134,90,0.35)",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        TASARIMCI HAKLARI
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <button onClick={() => setOpen(false)} aria-label="Kapat" className="absolute inset-0 bg-black/40" />
            <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-sm bg-[var(--ivory-50)] p-6 md:p-8 shadow-[var(--shadow-xl)]">
              <button
                onClick={() => setOpen(false)}
                aria-label="Kapat"
                className="absolute right-4 top-4 text-2xl leading-none text-dim hover:text-ink"
              >
                ×
              </button>
              <p className="eyebrow-on-light">Zesta Tasarımcı Paneli</p>
              <h2 className="mt-2 font-display text-[24px] font-normal text-ink" style={{ lineHeight: 1.1 }}>
                Tasarımcı Hakları
              </h2>
              <div className="mt-6 space-y-6">
                {SECTIONS.map((s) => (
                  <div key={s.heading}>
                    <h3 className="text-[14px] font-medium text-ink mb-2">{s.heading}</h3>
                    {s.body && (
                      <p className="text-[13.5px] leading-relaxed text-[color:var(--text-on-light-secondary)]">{s.body}</p>
                    )}
                    {s.list && (
                      <ul className="mt-1 space-y-1.5">
                        {s.list.map((item) => (
                          <li key={item} className="flex gap-2 text-[13.5px] leading-relaxed text-[color:var(--text-on-light-secondary)]">
                            <span className="text-[color:var(--zesta-green)]">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
