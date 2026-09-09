export interface LegalSection {
  heading: string;
  body: string;
}

const NUMBERED_RE = /^\d+\.\s+.+$/;
const MADDE_RE = /^MADDE\s+\d+\s*[—-].+$/i;

// KVKK/Gizlilik/Cerez metinleri "1. BASLIK" formatinda, Mesafeli Satis
// Sozlesmesi "MADDE 1 — BASLIK" formatinda geliyor — ikisini de aciklamali
// bolumlere ayirip StaticPage'in premium (sadece duz metin degil) render
// etmesini sagliyoruz.
export function parseLegalContent(raw: string): LegalSection[] {
  const text = (raw ?? "").trim();
  if (!text) return [];

  const lines = text.split("\n");
  const sections: LegalSection[] = [];
  let current: LegalSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (NUMBERED_RE.test(trimmed) || MADDE_RE.test(trimmed)) {
      if (current) sections.push(current);
      current = { heading: trimmed, body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      // Baslik oncesi metin (ornegin "Son guncelleme: ..." satiri) — ayri,
      // basliksiz bir on-blok olarak tutulur.
      current = { heading: "", body: line };
    }
  }
  if (current) sections.push(current);

  return sections.map((s) => ({ heading: s.heading, body: s.body.trim() }));
}
