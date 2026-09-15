"use client";

// Sitede birden fazla kayan ürün şeridi olabilir (ana sayfa vitrini +
// Seramik/Cam Sanatı/Biblolar satırları). Her biri kendi setInterval'ini
// çalıştırırsa farklı anlarda kayarlar — tek bir paylaşılan "nabız" ile hepsi
// aynı anda adım atar.
const STEP_MS = 6000;
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;

function ensureRunning() {
  if (intervalId !== null) return;
  intervalId = setInterval(() => {
    listeners.forEach((listener) => listener());
  }, STEP_MS);
}

function stopIfIdle() {
  if (listeners.size === 0 && intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function subscribeCarouselTick(listener: () => void) {
  listeners.add(listener);
  ensureRunning();
  return () => {
    listeners.delete(listener);
    stopIfIdle();
  };
}
