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
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-sm border border-[var(--border-subtle)] bg-[var(--ivory-50)] p-5 shadow-[var(--shadow-xl)]">
        {!showPreferences ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="text-sm text-smoke">
              <p>
                Elektronik ticaret deneyiminizi kişiselleştirmek, Türkiye&apos;nin dört bir yanındaki ustalarımızın
                sipariş üzerine hazırladığı el yapımı sanat ürünlerini size en doğru şekilde sunabilmek ve
                alışveriş sepetinizi güvende tutmak amacıyla yasalara uygun çerezler kullanıyoruz.
              </p>
              <p className="mt-2">
                Sitemizdeki çerezleri dilediğiniz gibi yönetebilir, onayınızı serbestçe geri çekebilirsiniz.
                Detaylı bilgi için{" "}
                <Link href="/yasal/cerez-politikasi" className="font-medium text-ink underline">
                  Çerez Politikası
                </Link>{" "}
                ve{" "}
                <Link href="/yasal/gizlilik-politikasi" className="font-medium text-ink underline">
                  Gizlilik Aydınlatma Metni
                </Link>{" "}
                sayfalarımızı inceleyebilirsiniz.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:ml-auto">
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-default)] px-4 text-[12px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink hover:border-[var(--border-hover)]"
              >
                ⚙️ Tercihleri Yönet
              </button>
              <button
                type="button"
                onClick={() => save({ necessary: true, analytics: false, marketing: false })}
                className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-default)] px-4 text-[12px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink hover:border-[var(--border-hover)]"
              >
                🟥 Reddet
              </button>
              <button
                type="button"
                onClick={() => save({ necessary: true, analytics: true, marketing: true })}
                className="inline-flex h-9 items-center justify-center rounded-full bg-charcoal-700 px-4 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
              >
                🟩 Tüm Çerezleri Kabul Et
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

            <div className="flex flex-col gap-3 rounded-sm border border-[var(--border-subtle)] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-ink">🌐 Zorunlu Çerezler (Her Zaman Aktif)</p>
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
                  <p className="text-[13px] font-medium text-ink">📊 Performans ve Analiz Çerezleri</p>
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
                  <p className="text-[13px] font-medium text-ink">📢 Pazarlama ve Reklam Çerezleri</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-smoke">
                    İlgi duyduğunuz tasarım tarzlarına uygun yeni sanat ürünleri koleksiyonlarından, özel
                    indirimlerden ve Zesta kampanyalarından haberdar olmanızı sağlar.
                  </p>
                </div>
                <Toggle checked={marketing} onChange={setMarketing} label="Pazarlama ve reklam çerezlerini aç/kapat" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="inline-flex h-9 items-center justify-center rounded-full px-4 text-[12px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink"
              >
                Geri
              </button>
              <button
                type="button"
                onClick={() => save({ necessary: true, analytics, marketing })}
                className="inline-flex h-9 items-center justify-center rounded-full bg-charcoal-700 px-4 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
              >
                Tercihleri Kaydet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
