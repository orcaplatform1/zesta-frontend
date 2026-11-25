"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "zesta-cookie-consent";

type CookiePrefs = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-[180ms] disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-charcoal-700" : "bg-stone-200"
      }`}
    >
      <span
        className={`inline-block size-4 transform rounded-full bg-ivory-50 shadow transition-transform duration-[180ms] ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

const BTN =
  "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full px-5 text-[14px] transition-colors duration-200";
const BTN_PRIMARY = `${BTN} bg-[var(--primary-700)] font-semibold text-[var(--text-on-dark)] hover:bg-[var(--primary-800)]`;
const BTN_GHOST = `${BTN} border border-[color-mix(in_srgb,var(--primary-700)_25%,transparent)] bg-transparent font-medium text-[var(--primary-700)] hover:bg-[var(--primary-50)]`;

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage engelliyse (ör. gizli sekme) sessizce geç
    }
  }, []);

  function save(prefs: CookiePrefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // no-op
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Çerez onayı"
      className="fixed inset-x-4 bottom-4 z-50 rounded-[24px] border border-[color-mix(in_srgb,var(--primary-700)_12%,transparent)] bg-[color-mix(in_srgb,var(--bg-primary)_92%,transparent)] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-full sm:max-w-[420px]"
    >
        {!showPreferences ? (
          <div className="flex flex-col gap-4">
            <p className="text-[14px] leading-[1.6] text-[var(--text-primary)]">
              Deneyiminizi iyileştirmek için çerezler kullanıyoruz. Ayrıntılar için{" "}
              <Link href="/yasal/cerez-politikasi" className="text-[var(--primary-700)] underline">
                Çerez Politikası
              </Link>{" "}
              ve{" "}
              <Link href="/yasal/gizlilik-politikasi" className="text-[var(--primary-700)] underline">
                Gizlilik Politikası
              </Link>
              &apos;nı inceleyebilirsiniz.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-nowrap">
              <button
                type="button"
                onClick={() => save({ necessary: true, analytics: true, marketing: true })}
                className={`${BTN_PRIMARY} col-span-2 sm:col-span-1`}
              >
                Tümünü Kabul Et
              </button>
              <button
                type="button"
                onClick={() => save({ necessary: true, analytics: false, marketing: false })}
                className={BTN_GHOST}
              >
                Reddet
              </button>
              <button type="button" onClick={() => setShowPreferences(true)} className={BTN_GHOST}>
                Tercihler
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Çerez Tercihleri</p>
              <p className="mt-1 text-sm text-smoke">
                Hangi çerez kategorilerine izin vereceğinizi aşağıdan seçebilirsiniz.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-[16px] border border-[color-mix(in_srgb,var(--primary-700)_12%,transparent)] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-ink">Zorunlu Çerezler (Her Zaman Aktif)</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-smoke">
                    Seçtiğiniz el yapımı ürünlerin alışveriş sepetinizde kaybolmadan kalması, üye girişi
                    yapabilmeniz, sipariş ve güvenli ödeme formlarının çalışması için zorunludur. (Kullanıcı
                    tarafından kapatılamaz)
                  </p>
                </div>
                <Toggle checked onChange={() => {}} disabled label="Zorunlu çerezler (her zaman aktif)" />
              </div>

              <div className="h-px bg-[var(--border-subtle)]" />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-ink">Performans ve Analiz Çerezleri</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-smoke">
                    Ziyaretçilerin hangi sanat kategorilerini, usta atölyelerini ve ürün hikâyelerini daha çok
                    incelediğini analiz ederek pazar yerimizin tasarımını ve alışveriş deneyimini geliştirmemize
                    yardımcı olur.
                  </p>
                </div>
                <Toggle checked={analytics} onChange={setAnalytics} label="Performans ve analiz çerezlerini aç/kapat" />
              </div>

              <div className="h-px bg-[var(--border-subtle)]" />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-ink">Pazarlama ve Reklam Çerezleri</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-smoke">
                    İlgi duyduğunuz tasarım tarzlarına uygun yeni sanat ürünleri koleksiyonlarından, özel
                    indirimlerden ve Zesta kampanyalarından haberdar olmanızı sağlar.
                  </p>
                </div>
                <Toggle checked={marketing} onChange={setMarketing} label="Pazarlama ve reklam çerezlerini aç/kapat" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button type="button" onClick={() => setShowPreferences(false)} className={BTN_GHOST}>
                Geri
              </button>
              <button
                type="button"
                onClick={() => save({ necessary: true, analytics, marketing })}
                className={BTN_PRIMARY}
              >
                Tercihleri Kaydet
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
