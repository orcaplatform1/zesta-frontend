import Link from "next/link";

const STATS = [
  { value: "8+", label: "Güzel sanatlar fakültesi" },
  { value: "120+", label: "Genç sanatçı" },
  { value: "3", label: "Yıllık atölye deneyimi" },
];

const SECTIONS = [
  {
    index: "01",
    heading: "Hikâyemiz",
    body: "Zesta, iki farklı dünyayı — zanaatin sabrını ve gençliğin cesaretini — aynı çatı altında buluşturmak fikriyle doğdu. Türkiye'nin çeşitli güzel sanatlar fakülteleriyle kurduğumuz iş birlikleri sayesinde, seramikten cam sanatına, ahşap oymacılıktan tekstile kadar birçok disiplinde eğitim gören genç sanatçı adaylarının ürettiği eserleri sizlerle buluşturuyoruz. Atölyemizde yer alan her parça, alanında akademik eğitim almış, el işçiliğini yıllarca disiplinli bir şekilde geliştirmiş genç sanatçıların imzasını taşır.",
    tone: "light" as const,
  },
  {
    index: "02",
    heading: "Neden Varız",
    body: "Sanat eğitimi sabır ve emek ister — ama çoğu zaman genç sanatçıların önündeki en büyük engel, yeteneklerini sürdürülebilir bir gelire dönüştürebilecekleri bir zemin bulamamaktır. Zesta'da sattığımız her ürünün gelirinin bir kısmıyla, güzel sanatlar fakültelerinde eğitim gören burslu öğrencilerimize maddi destek sağlıyor; yetenekli isimleri bünyemizde istihdam ederek onlara eğitimleri süresince gerçek bir atölye deneyimi ve düzenli bir gelir kapısı sunuyoruz.",
    tone: "dark" as const,
  },
  {
    index: "03",
    heading: "Misyonumuz",
    body: "Hedefimiz net: sanata gönül vermiş genç yetenekleri, kendi ayakları üzerinde durabilen girişimcilere dönüştürmek. Zesta'dan bir ürün aldığınızda yalnızca elde üretilmiş, özgün bir parçaya değil; bir gencin eğitimine, atölye deneyimine ve geleceğine de küçük ama anlamlı bir katkıda bulunmuş olursunuz.",
    tone: "light" as const,
  },
  {
    index: "04",
    heading: "Nasıl Çalışıyoruz",
    body: "Ortak olduğumuz fakültelerden gelen öğrenci başvuruları kendi iç değerlendirme sürecimizden geçer; seçilen öğrenciler Zesta atölyesinde hem üretim yapar hem de mentorluk desteği alır. Onaylanan tasarımlar sınırlı sayıda üretilir, sipariş üzerine el emeğiyle tamamlanır ve özenle paketlenerek size ulaştırılır. Aldığınız her parçanın arkasında, o eseri hayata geçiren gerçek bir isim ve hikâye vardır.",
    tone: "dark" as const,
  },
  {
    index: "05",
    heading: "Tasarımcı Paneli",
    body: "Atölyemizde istihdam ettiğimiz genç sanatçıların yanı sıra, artık bağımsız çalışan tasarımcı ve üreticilere de kapılarımızı açıyoruz. Zesta Tasarımcı Paneli'ne başvurup onaylanan tasarımcılar, kendi ürünlerini doğrudan Zesta vitrinine ekleyebilir, satışlarını tek ekrandan takip edebilir ve kazançlarını düzenli olarak çekebilir — emeğinizin karşılığını, büyüyen ailemizin bir parçası olarak alırsınız.",
    tone: "light" as const,
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero — koyu, editorial */}
      <section
        className="grain relative overflow-hidden"
        style={{ background: "var(--zesta-primary-dark)" }}
      >
        <div className="mx-auto max-w-[1100px] px-5 md:px-12 pt-24 pb-20 md:pt-32 md:pb-28">
          <p
            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-8"
            style={{ color: "var(--zesta-accent)" }}
          >
            Zesta — Hakkımızda
          </p>
          <h1
            className="font-display font-normal max-w-3xl"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              color: "var(--text-on-dark)",
            }}
          >
            Sanatı Emekle,
            <br />
            <em style={{ color: "var(--zesta-accent)", fontStyle: "italic" }}>
              Geleceği Gençlerle
            </em>{" "}
            Örüyoruz.
          </h1>
          <p
            className="mt-8 text-[15px] md:text-[16px] leading-relaxed max-w-xl"
            style={{ color: "var(--text-on-dark-muted)" }}
          >
            Türkiye'nin güzel sanatlar fakültelerinde yetişen genç yetenekler, Zesta atölyesinde zanaat pratiğini gerçek bir geçim kaynağına dönüştürüyor.
          </p>
        </div>

        {/* İnce aksent çizgi */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "rgba(196,134,90,0.25)" }}
        />
      </section>

      {/* İstatistikler */}
      <section style={{ background: "var(--zesta-primary)" }}>
        <div className="mx-auto max-w-[1100px] px-5 md:px-12">
          <div className="grid grid-cols-3 divide-x divide-white/10 py-10 md:py-12">
            {STATS.map((s) => (
              <div key={s.label} className="px-6 md:px-10 text-center first:pl-0 last:pr-0">
                <p
                  className="font-display font-normal"
                  style={{ fontSize: "clamp(28px, 4vw, 46px)", color: "var(--text-on-dark)", lineHeight: 1 }}
                >
                  {s.value}
                </p>
                <p
                  className="mt-2 text-[11px] md:text-[12px] tracking-[0.12em] uppercase"
                  style={{ color: "var(--text-on-dark-muted)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bölümler */}
      {SECTIONS.map((s) =>
        s.tone === "light" ? (
          <section key={s.heading} className="py-20 md:py-28" style={{ background: "var(--zesta-bg)" }}>
            <div className="mx-auto max-w-[1100px] px-5 md:px-12">
              <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-16 items-start">
                {/* Sol: numara */}
                <div className="flex items-center gap-3 md:block">
                  <span
                    className="font-display font-normal text-[11px] tracking-[0.18em] uppercase block"
                    style={{ color: "var(--zesta-accent)" }}
                  >
                    {s.index}
                  </span>
                  <div
                    className="hidden md:block mt-4 h-px w-12"
                    style={{ background: "var(--zesta-accent)", opacity: 0.5 }}
                  />
                </div>
                {/* Sağ: içerik */}
                <div>
                  <h2
                    className="font-display font-normal text-ink"
                    style={{ fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.08, letterSpacing: "-0.015em" }}
                  >
                    {s.heading}
                  </h2>
                  <p
                    className="mt-6 text-[15px] md:text-[16px] leading-[1.8]"
                    style={{ color: "var(--zesta-text-secondary)", maxWidth: "60ch" }}
                  >
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section
            key={s.heading}
            className="py-20 md:py-28 relative overflow-hidden"
            style={{ background: "var(--zesta-primary-dark)" }}
          >
            {/* Dekoratif arka plan desen */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(244,241,233,1) 39px, rgba(244,241,233,1) 40px)",
              }}
            />
            <div className="relative mx-auto max-w-[1100px] px-5 md:px-12">
              <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-16 items-start">
                <div className="flex items-center gap-3 md:block">
                  <span
                    className="font-display font-normal text-[11px] tracking-[0.18em] uppercase block"
                    style={{ color: "var(--zesta-accent)" }}
                  >
                    {s.index}
                  </span>
                  <div
                    className="hidden md:block mt-4 h-px w-12"
                    style={{ background: "var(--zesta-accent)", opacity: 0.5 }}
                  />
                </div>
                <div>
                  <h2
                    className="font-display font-normal"
                    style={{
                      fontSize: "clamp(24px, 3vw, 36px)",
                      lineHeight: 1.08,
                      letterSpacing: "-0.015em",
                      color: "var(--text-on-dark)",
                    }}
                  >
                    {s.heading}
                  </h2>
                  <p
                    className="mt-6 text-[15px] md:text-[16px] leading-[1.8]"
                    style={{ color: "var(--text-on-dark-muted)", maxWidth: "60ch" }}
                  >
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ),
      )}

      {/* Alıntı bölümü */}
      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{ background: "var(--zesta-surface-muted)" }}
      >
        <div className="mx-auto max-w-[900px] px-5 md:px-12 text-center">
          <div
            className="mx-auto mb-8 h-px w-16"
            style={{ background: "var(--zesta-accent)" }}
          />
          <blockquote
            className="font-display font-normal italic text-ink"
            style={{ fontSize: "clamp(22px, 3.5vw, 38px)", lineHeight: 1.2, letterSpacing: "-0.01em" }}
          >
            "Aldığınız her parçanın arkasında gerçek bir isim, gerçek bir hikâye vardır."
          </blockquote>
          <div
            className="mx-auto mt-8 h-px w-16"
            style={{ background: "var(--zesta-accent)" }}
          />
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 md:py-32 text-center"
        style={{ background: "var(--zesta-primary-dark)" }}
      >
        <div className="mx-auto max-w-xl px-5">
          <p
            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-5"
            style={{ color: "var(--zesta-accent)" }}
          >
            Katkınız Büyüyor
          </p>
          <h2
            className="font-display font-normal"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
              color: "var(--text-on-dark)",
            }}
          >
            Bir Parçayı Keşfedin,
            <br />
            <em style={{ color: "var(--zesta-accent)", fontStyle: "italic" }}>Bir Hikâyeye Ortak Olun.</em>
          </h2>
          <div className="mt-10">
            <Link
              href="/magaza"
              className="inline-flex h-12 items-center justify-center px-8 transition-all duration-[220ms] ease-[var(--ease-luxury)] hover:opacity-80"
              style={{
                background: "var(--zesta-accent)",
                color: "#fff",
                borderRadius: "var(--radius-full)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.14em",
              }}
            >
              KOLEKSİYONLARI KEŞFET
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
