// Ürün sayfasındaki "X satıldı" ve haftalık trend grafiği görsel/pazarlama
// amaçlı, DETERMİNİSTİK olarak üretilen simüle bir gösterge — gerçek sipariş
// verisi DEĞİL, backend'de hiçbir karşılığı yok, hiçbir yere yazılmıyor.
// Aynı ürün için her zaman aynı (günün tarihine göre kararlı) sayıları verir.

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

const DAY_LABELS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"]; // JS getDay() sırası

export interface WeeklyPoint {
  day: string;
  value: number;
}

export interface SalesStats {
  soldTotal: number;
  weekly: WeeklyPoint[];
}

export function getSalesStats(productId: string, createdAt: string): SalesStats {
  const baseSeed = hashString(productId);
  const baseRandom = mulberry32(baseSeed);
  const baseline = 8 + Math.floor(baseRandom() * 67); // 8–74

  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const weeksElapsed = Math.max(0, Math.floor((now - created) / (7 * 24 * 60 * 60 * 1000)));

  let soldTotal = baseline;
  for (let w = 0; w < weeksElapsed; w++) {
    const weekRandom = mulberry32(baseSeed + w * 7919 + 1);
    soldTotal += 2 + Math.floor(weekRandom() * 6); // 2–7 per elapsed week
  }

  // Son 7 gün, bugünle biten — her gün için "satış var/yok" bugünün tarihine
  // göre sabit (aynı gün içinde sayfa yenilense de değişmez).
  const weekly: WeeklyPoint[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayKey = d.toISOString().slice(0, 10);
    const dayRandom = mulberry32(hashString(`${productId}-${dayKey}`));
    const isActive = dayRandom() < 0.65; // ~%65 ihtimalle "satış günü"
    const value = isActive ? 1 + Math.floor(dayRandom() * 4) : Math.round(dayRandom() * 0.8);
    weekly.push({ day: DAY_LABELS[d.getDay()], value });
  }

  return { soldTotal, weekly };
}
