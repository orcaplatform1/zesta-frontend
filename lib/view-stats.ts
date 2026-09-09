// Ürün sayfasındaki "görüntülenme" sayısı görsel/pazarlama amaçlı,
// DETERMİNİSTİK olarak üretilen simüle bir gösterge — gerçek analytics
// verisi DEĞİL, backend'de hiçbir karşılığı yok, hiçbir yere yazılmıyor.
// Mimari lib/sales-stats.ts ile birebir aynı, sadece taban/artış sabitleri
// farklı (bkz. o dosyadaki mulberry32/hashString açıklaması).

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

export function getViewCount(productId: string, createdAt: string): number {
  const baseSeed = hashString(`view-${productId}`);
  const baseRandom = mulberry32(baseSeed);
  const baseline = 174 + Math.floor(baseRandom() * 438); // 174–611

  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const periodsElapsed = Math.max(0, Math.floor((now - created) / (3 * 24 * 60 * 60 * 1000)));

  let total = baseline;
  for (let p = 0; p < periodsElapsed; p++) {
    const periodRandom = mulberry32(baseSeed + p * 7919 + 1);
    total += 11 + Math.floor(periodRandom() * 28); // 11–38 per elapsed 3-day period
  }

  return total;
}
