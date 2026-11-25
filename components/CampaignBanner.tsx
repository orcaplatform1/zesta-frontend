import Link from "next/link";
import type { ReactNode } from "react";

// 3 parçalı kampanya banner'ı: sol başlık/koleksiyon adı, orta görsel,
// sağ kampanya metni + CTA. Mobilde parçalar alt alta.
export function CampaignBanner({
  eyebrow,
  title,
  titleSecond,
  image,
  imageAlt,
  imageHref,
  body,
  ctas,
  extra,
  dark = false,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  titleSecond?: string;
  image?: string | null;
  imageAlt: string;
  imageHref?: string;
  body: string;
  ctas: { label: string; href: string; primary?: boolean }[];
  extra?: ReactNode;
  dark?: boolean;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  const text = dark ? "var(--text-on-dark)" : "var(--zesta-text)";
  const muted = dark ? "var(--text-on-dark-muted)" : "var(--text-secondary)";

  const imageEl = (
    <div className="relative h-full min-h-[220px] w-full overflow-hidden md:min-h-[320px]" style={{ background: dark ? "var(--primary-800)" : "var(--stone-100)" }}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: muted }}>
          {imageAlt}
        </span>
      )}
    </div>
  );

  return (
    <section className="py-4 md:py-6">
      <div className="mx-auto max-w-[1200px] px-4 lg:px-5">
        <div
          className="grid grid-cols-[minmax(0,1fr)] overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)]"
          style={{
            background: dark ? "var(--zesta-primary-dark)" : "var(--zesta-surface-muted)",
            borderRadius: "var(--radius-md)",
            border: dark ? "none" : "1px solid var(--zesta-border-light)",
          }}
        >
          {/* Sol: başlık */}
          <div className="flex flex-col justify-center p-6 md:p-8">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <Heading
              className="mt-3 font-display font-normal"
              style={{ color: text, fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.02, letterSpacing: "-0.015em" }}
            >
              {title}
              {titleSecond && (
                <>
                  <br />
                  <span style={{ opacity: 0.78 }}>{titleSecond}</span>
                </>
              )}
            </Heading>
          </div>

          {/* Orta: görsel */}
          {imageHref ? (
            <Link href={imageHref} className="block" aria-label={imageAlt}>
              {imageEl}
            </Link>
          ) : (
            imageEl
          )}

          {/* Sağ: metin + CTA */}
          <div className="flex flex-col justify-center p-6 md:p-8">
            <p className="text-[14px] leading-relaxed md:text-[15px]" style={{ color: muted }}>
              {body}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {ctas.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="inline-flex h-11 items-center justify-center px-5 text-[12px] font-semibold transition-transform duration-[200ms] hover:-translate-y-[1px]"
                  style={
                    c.primary
                      ? { background: "var(--zesta-accent)", color: "#fff", borderRadius: "var(--radius-sm)", letterSpacing: "0.08em" }
                      : {
                          border: `1px solid ${dark ? "var(--border-light)" : "var(--border-default)"}`,
                          color: text,
                          borderRadius: "var(--radius-sm)",
                          letterSpacing: "0.08em",
                        }
                  }
                >
                  {c.label}
                </Link>
              ))}
            </div>
            {extra}
          </div>
        </div>
      </div>
    </section>
  );
}
