"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

const SECTIONS = [
  {
    heading: "Fiyat Eşitlemesi Nedir?",
    body: "Zesta olarak müşterilerimize en iyi alışveriş deneyimini sunmayı hedefliyoruz. Bu doğrultuda, Zesta.tr üzerinden satın aldığınız bir ürünün, aynı şartlar altında ve aynı ürün özellikleriyle (renk, beden, tasarımcı, marka vb.) başka bir internet sitesinde daha düşük bir liste fiyatıyla sunulduğunu tespit ederseniz, aradaki farkı iade etmeyi taahhüt ediyoruz.",
  },
  {
    heading: "Fiyat Eşitlemesi Nasıl Çalışır?",
    body: "Zesta.tr'den satın aldığınız bir ürünün, sipariş tarihinizden itibaren 7 gün içinde Türkiye'deki başka bir online satış noktasında daha düşük bir liste fiyatıyla satıldığını tespit ederseniz:",
    list: ["İlgili web sitesinin bağlantısını (URL)", "Zesta sipariş numaranızı", "Ürünün fiyat bilgilerini"],
    footer:
      "Yukarıdaki bilgileri info@zesta.tr adresine e-posta ile iletmeniz gerekmektedir. Destek ekibimiz, başvurunuzu aldıktan sonra 3-4 iş günü içinde inceleyerek size geri dönüş yapacaktır. Başvurunuzun uygun bulunması halinde, fiyat farkı ödemeyi yaptığınız yöntemle 3-4 iş günü içinde tarafınıza iade edilir.",
  },
  {
    heading: "Fiyat Eşitlemesi Şartları",
    list: [
      "Ürün birebir aynı olmalıdır (renk, beden, tasarımcı, marka vb.).",
      "Sadece liste veya indirimli liste fiyatları geçerlidir. Promosyonlar kapsam dışıdır.",
      "Fiziksel mağazalar kapsam dışındadır.",
      "Kargo ücretleri ve ödeme şekli indirimleri dahil edilmez.",
      "Yalnızca Türkiye içindeki online satış siteleri geçerlidir.",
    ],
  },
];

export function PriceMatchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border-default)] px-4 text-[11px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink hover:border-[var(--border-hover)]"
        style={{ letterSpacing: "0.06em" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 2v20M17 6H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6" />
        </svg>
        FİYAT EŞLEŞMESİ YAPIYORUZ
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <button
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="absolute inset-0 bg-black/40"
            />
            <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-sm bg-[var(--ivory-50)] p-6 md:p-8 shadow-[var(--shadow-xl)]">
              <button
                onClick={() => setOpen(false)}
                aria-label="Kapat"
                className="absolute right-4 top-4 text-2xl leading-none text-dim hover:text-ink"
              >
                ×
              </button>
              <p className="eyebrow-on-light">Zesta Güvencesi</p>
              <h2 className="mt-2 font-display text-[24px] font-normal text-ink" style={{ lineHeight: 1.1 }}>
                Fiyat Eşleşmesi Yapıyoruz
              </h2>
              <div className="mt-6 space-y-6">
                {SECTIONS.map((s) => (
                  <div key={s.heading}>
                    <h3 className="text-[14px] font-medium text-ink mb-2">{s.heading}</h3>
                    {s.body && (
                      <p className="text-[13.5px] leading-relaxed text-[color:var(--text-on-light-secondary)]">
                        {s.body}
                      </p>
                    )}
                    {s.list && (
                      <ul className="mt-2 space-y-1.5">
                        {s.list.map((item) => (
                          <li key={item} className="flex gap-2 text-[13.5px] leading-relaxed text-[color:var(--text-on-light-secondary)]">
                            <span className="text-[color:var(--zesta-green)]">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.footer && (
                      <p className="mt-3 text-[13.5px] leading-relaxed text-[color:var(--text-on-light-secondary)]">
                        {s.footer}
                      </p>
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
