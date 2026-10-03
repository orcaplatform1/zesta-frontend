import Image from "next/image";
import type { BookPage } from "@/data/ebook/zarafetin-izinde";
import { TABLE_OF_CONTENTS, BOOK_TITLE, BOOK_SUBTITLE, BOOK_AUTHOR, BOOK_BRAND } from "@/data/ebook/zarafetin-izinde";
import { MASTER_BOOK_WIDTH, MASTER_BOOK_HEIGHT } from "@/lib/ebook.config";

interface Props {
  page: BookPage;
  onGoToPage?: (n: number) => void;
}

const bg = {
  dark: "#0E1010",
  darker: "#090B0B",
  surface: "#141818",
  text: "#E9DDC9",
  muted: "rgba(233,221,201,0.55)",
  dim: "rgba(233,221,201,0.3)",
  gold: "#B98A55",
  teal: "#145F61",
};

export function EbookPage({ page, onGoToPage }: Props) {
  const w = MASTER_BOOK_WIDTH;
  const h = MASTER_BOOK_HEIGHT;

  if (page.type === "cover") {
    return (
      <div style={{ width: w, height: h, position: "relative", background: "#000" }}>
        {page.image && (
          <Image
            src={page.image}
            alt={page.title ?? "Kapak"}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="1024px"
          />
        )}
      </div>
    );
  }

  if (page.type === "inside-cover") {
    return (
      <div
        style={{
          width: w, height: h,
          background: `radial-gradient(ellipse at 50% 40%, #1D3535 0%, ${bg.darker} 70%)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "80px 60px",
        }}
      >
        <div style={{ width: 2, height: 60, background: bg.gold, marginBottom: 32, opacity: 0.6 }} />
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 13, letterSpacing: "0.25em", color: bg.gold, textTransform: "uppercase", marginBottom: 28, textAlign: "center" }}>
          {BOOK_BRAND}
        </p>
        <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 52, fontWeight: 400, color: bg.text, textAlign: "center", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
          {BOOK_TITLE}
        </h1>
        <p style={{ marginTop: 20, fontFamily: "var(--font-cormorant), serif", fontSize: 18, fontStyle: "italic", color: bg.muted, textAlign: "center", lineHeight: 1.5 }}>
          {BOOK_SUBTITLE}
        </p>
        <div style={{ width: 2, height: 60, background: bg.gold, marginTop: 36, opacity: 0.6 }} />
        <p style={{ marginTop: 28, fontFamily: "var(--font-manrope), sans-serif", fontSize: 12, letterSpacing: "0.12em", color: bg.dim, textTransform: "uppercase" }}>
          {BOOK_AUTHOR}
        </p>
      </div>
    );
  }

  if (page.type === "colophon") {
    return (
      <div
        style={{
          width: w, height: h,
          background: bg.darker,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "80px 70px",
        }}
      >
        <div style={{ maxWidth: 400, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 28, fontWeight: 400, color: bg.text, marginBottom: 32 }}>
            {BOOK_TITLE}
          </p>
          <div style={{ width: 40, height: 1, background: bg.gold, opacity: 0.5, margin: "0 auto 32px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Yazar", BOOK_AUTHOR],
              ["Marka", BOOK_BRAND],
              ["Yayın Yılı", "2026"],
              ["Tüm Hakları Saklıdır", `© 2026 ${BOOK_BRAND}`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 10, letterSpacing: "0.16em", color: bg.gold, textTransform: "uppercase" }}>{label}</p>
                <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 16, color: bg.muted }}>{value}</p>
              </div>
            ))}
          </div>
          <div style={{ width: 40, height: 1, background: bg.gold, opacity: 0.5, margin: "32px auto 0" }} />
          <p style={{ marginTop: 24, fontFamily: "var(--font-manrope), sans-serif", fontSize: 11, color: bg.dim, lineHeight: 1.6 }}>
            Bu kitabın tamamı veya bir bölümü, Zesta&apos;nın yazılı izni olmaksızın herhangi bir biçimde yeniden basılamaz.
          </p>
        </div>
      </div>
    );
  }

  if (page.type === "toc") {
    return (
      <div
        style={{
          width: w, height: h,
          background: bg.dark,
          display: "flex", flexDirection: "column",
          padding: "80px 70px",
        }}
      >
        <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 10, letterSpacing: "0.2em", color: bg.gold, textTransform: "uppercase", marginBottom: 12 }}>
          İçindekiler
        </p>
        <div style={{ width: 40, height: 1, background: bg.gold, opacity: 0.4, marginBottom: 40 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {TABLE_OF_CONTENTS.map((entry, i) => (
            <button
              key={entry.title}
              onClick={() => onGoToPage?.(entry.pageNumber)}
              style={{
                display: "flex", alignItems: "baseline", justifyContent: "space-between",
                padding: "14px 0",
                borderBottom: i < TABLE_OF_CONTENTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                cursor: "pointer", background: "none", border: "none",
                textAlign: "left",
              }}
            >
              <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 20, color: bg.text, fontWeight: 400 }}>
                {entry.title}
              </span>
              <span style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 11, color: bg.gold, letterSpacing: "0.08em", flexShrink: 0, marginLeft: 16 }}>
                {String(entry.pageNumber).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (page.type === "chapter") {
    return (
      <div
        style={{
          width: w, height: h,
          background: `linear-gradient(160deg, #0E1818 0%, ${bg.darker} 100%)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "80px 70px",
        }}
      >
        <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 11, letterSpacing: "0.22em", color: bg.gold, textTransform: "uppercase", marginBottom: 24 }}>
          Bölüm {String(page.chapterNumber ?? 1).padStart(2, "0")}
        </p>
        <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 56, fontWeight: 400, color: bg.text, textAlign: "center", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          {page.title}
        </h2>
        {page.subtitle && (
          <p style={{ marginTop: 16, fontFamily: "var(--font-cormorant), serif", fontSize: 18, fontStyle: "italic", color: bg.muted, textAlign: "center" }}>
            {page.subtitle}
          </p>
        )}
        <div style={{ marginTop: 48, display: "flex", gap: 6, alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: i === 1 ? 24 : 6, height: 1, background: bg.gold, opacity: i === 1 ? 0.8 : 0.3 }} />
          ))}
        </div>
      </div>
    );
  }

  if (page.type === "artwork") {
    const art = page.artwork;
    if (!art) return null;
    return (
      <div
        style={{
          width: w, height: h,
          background: bg.darker,
          display: "flex", flexDirection: "column",
          padding: "60px",
        }}
      >
        {/* Artwork area */}
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.03)",
            borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {art.image ? (
            <Image src={art.image} alt={art.name} fill style={{ objectFit: "contain" }} />
          ) : (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 14, color: bg.dim, fontStyle: "italic" }}>
                {art.name}
              </p>
            </div>
          )}
        </div>

        {/* Meta */}
        <div>
          <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 10, letterSpacing: "0.18em", color: bg.gold, textTransform: "uppercase", marginBottom: 8 }}>
            {art.category}
          </p>
          <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 28, fontWeight: 400, color: bg.text, lineHeight: 1.1, marginBottom: 6 }}>
            {art.name}
          </h3>
          <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 11, color: bg.dim, marginBottom: 16 }}>
            {art.artist}
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 15, color: bg.muted, lineHeight: 1.65, marginBottom: 16 }}>
            {art.story}
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            <div>
              <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 9, letterSpacing: "0.16em", color: bg.gold, textTransform: "uppercase", marginBottom: 3 }}>Malzeme</p>
              <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 11, color: bg.dim }}>{art.material}</p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 9, letterSpacing: "0.16em", color: bg.gold, textTransform: "uppercase", marginBottom: 3 }}>Üretim</p>
              <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 11, color: bg.dim }}>{art.production}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === "text") {
    return (
      <div
        style={{
          width: w, height: h,
          background: bg.dark,
          display: "flex", flexDirection: "column",
          padding: "80px 70px",
        }}
      >
        {page.title && (
          <>
            <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 10, letterSpacing: "0.2em", color: bg.gold, textTransform: "uppercase", marginBottom: 12 }}>
              Metin
            </p>
            <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 36, fontWeight: 400, color: bg.text, lineHeight: 1.1, marginBottom: 32 }}>
              {page.title}
            </h3>
            <div style={{ width: 40, height: 1, background: bg.gold, opacity: 0.4, marginBottom: 40 }} />
          </>
        )}
        <div style={{ flex: 1, overflowY: "hidden" }}>
          {page.content?.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 18,
                color: bg.muted,
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (page.type === "closing") {
    return (
      <div
        style={{
          width: w, height: h,
          background: `radial-gradient(ellipse at 50% 60%, #0D2E2E 0%, ${bg.darker} 70%)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "80px 60px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Image
            src="/ebook/logo/zesta-logo.png"
            alt="Zesta"
            width={180}
            height={60}
            style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.6, marginBottom: 40 }}
          />
          <div style={{ width: 1, height: 60, background: bg.gold, opacity: 0.4, margin: "0 auto 40px" }} />
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 26, fontWeight: 400, fontStyle: "italic", color: bg.text, lineHeight: 1.5, maxWidth: 440 }}>
            &ldquo;Eserlerin ardındaki hikâyelere birlikte yolculuk ettik.&rdquo;
          </p>
          <div style={{ width: 1, height: 60, background: bg.gold, opacity: 0.4, margin: "40px auto" }} />
          <p style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 10, letterSpacing: "0.22em", color: bg.gold, textTransform: "uppercase" }}>
            {BOOK_BRAND}
          </p>
          <p style={{ marginTop: 8, fontFamily: "var(--font-manrope), sans-serif", fontSize: 11, color: bg.dim }}>
            © 2026 Zesta
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: w, height: h, background: bg.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: bg.dim, fontFamily: "var(--font-manrope), sans-serif", fontSize: 12 }}>Sayfa {page.pageNumber}</p>
    </div>
  );
}
