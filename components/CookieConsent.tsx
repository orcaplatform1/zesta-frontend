"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "zesta-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage engelliyse (ör. gizli sekme) sessizce geç
    }
  }, []);

  function respond(choice: "accepted" | "rejected") {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // no-op
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-sm border border-[var(--border-subtle)] bg-[var(--ivory-50)] p-5 shadow-[var(--shadow-xl)] sm:flex-row sm:items-center sm:gap-6">
        <p className="text-sm text-smoke">
          Zesta&apos;da deneyimini iyileştirmek (oturum açık tutma, sepetini hatırlama) için çerezler kullanıyoruz.
          Detaylar için{" "}
          <Link href="/yasal/cerez-politikasi" className="font-medium text-ink underline">
            Çerez Politikası&apos;nı
          </Link>{" "}
          inceleyebilirsin.
        </p>
        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={() => respond("rejected")}
            className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-default)] px-4 text-[12px] font-medium text-smoke transition-colors duration-[180ms] hover:text-ink hover:border-[var(--border-hover)]"
          >
            Reddet
          </button>
          <button
            type="button"
            onClick={() => respond("accepted")}
            className="inline-flex h-9 items-center justify-center rounded-full bg-charcoal-700 px-4 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
