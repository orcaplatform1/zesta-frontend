import Link from "next/link";

const SECTIONS = [
  {
    heading: "Hikâyemiz",
    body: "Zesta, iki farklı dünyayı — zanaatin sabrını ve gençliğin cesaretini — aynı çatı altında buluşturmak fikriyle doğdu. Türkiye'nin çeşitli güzel sanatlar fakülteleriyle kurduğumuz iş birlikleri sayesinde, seramikten cam sanatına, ahşap oymacılıktan tekstile kadar birçok disiplinde eğitim gören genç sanatçı adaylarının ürettiği eserleri sizlerle buluşturuyoruz. Atölyemizde yer alan her parça, alanında akademik eğitim almış, el işçiliğini yıllarca disiplinli bir şekilde geliştirmiş genç sanatçıların imzasını taşır.",
    tone: "light" as const,
  },
  {
    heading: "Neden Varız",
    body: "Sanat eğitimi sabır ve emek ister — ama çoğu zaman genç sanatçıların önündeki en büyük engel, yeteneklerini sürdürülebilir bir gelire dönüştürebilecekleri bir zemin bulamamaktır. Zesta'da sattığımız her ürünün gelirinin bir kısmıyla, güzel sanatlar fakültelerinde eğitim gören burslu öğrencilerimize maddi destek sağlıyor; yetenekli isimleri bünyemizde istihdam ederek onlara eğitimleri süresince gerçek bir atölye deneyimi ve düzenli bir gelir kapısı sunuyoruz.",
    tone: "dark" as const,
  },
  {
    heading: "Misyonumuz",
    body: "Hedefimiz net: sanata gönül vermiş genç yetenekleri, kendi ayakları üzerinde durabilen girişimcilere dönüştürmek. Zesta'dan bir ürün aldığınızda yalnızca elde üretilmiş, özgün bir parçaya değil; bir gencin eğitimine, atölye deneyimine ve geleceğine de küçük ama anlamlı bir katkıda bulunmuş olursunuz.",
    tone: "light" as const,
  },
  {
    heading: "Nasıl Çalışıyoruz",
    body: "Ortak olduğumuz fakültelerden gelen öğrenci başvuruları kendi iç değerlendirme sürecimizden geçer; seçilen öğrenciler Zesta atölyesinde hem üretim yapar hem de mentorluk desteği alır. Onaylanan tasarımlar sınırlı sayıda üretilir, sipariş üzerine el emeğiyle tamamlanır ve özenle paketlenerek size ulaştırılır. Aldığınız her parçanın arkasında, o eseri hayata geçiren gerçek bir isim ve hikâye vardır.",
    tone: "dark" as const,
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="grain relative py-20 md:py-28 text-center overflow-hidden bg-warm-ivory">
        <div className="mx-auto max-w-2xl px-5">
          <p className="eyebrow-on-light">Zesta</p>
          <h1
            className="mt-6 font-display font-normal text-ink text-[36px] md:text-[52px]"
            style={{ lineHeight: 1.02, letterSpacing: "-0.02em" }}
          >
            Sanatı Emekle,
            <br />
            <span className="text-[color:var(--text-secondary)]">Geleceği Gençlerle Örüyoruz.</span>
          </h1>
        </div>
      </section>

      {SECTIONS.map((s) =>
        s.tone === "light" ? (
          <section key={s.heading} className="bg-warm-ivory py-16 md:py-24">
            <div className="mx-auto max-w-2xl px-5 md:px-12">
              <h2 className="font-display text-[26px] md:text-[32px] font-normal text-ink mb-5" style={{ lineHeight: 1.1 }}>
                {s.heading}
              </h2>
              <p className="text-[15px] md:text-[16px] leading-relaxed text-[color:var(--text-on-light-secondary)]">
                {s.body}
              </p>
            </div>
          </section>
        ) : (
          <section key={s.heading} className="bg-onyx-950 py-16 md:py-24">
            <div className="mx-auto max-w-2xl px-5 md:px-12">
              <h2
                className="font-display text-[26px] md:text-[32px] font-normal mb-5"
                style={{ lineHeight: 1.1, color: "var(--text-on-dark)" }}
              >
                {s.heading}
              </h2>
              <p className="text-[15px] md:text-[16px] leading-relaxed text-mist-200">{s.body}</p>
            </div>
          </section>
        ),
      )}

      <section className="bg-warm-ivory py-20 md:py-28 text-center">
        <div className="mx-auto max-w-xl px-5">
          <p className="eyebrow-on-light">Katkınız Büyüyor</p>
          <h2 className="mt-4 font-display text-[26px] md:text-[34px] font-normal text-ink" style={{ lineHeight: 1.1 }}>
            Bir Parçayı Keşfedin, Bir Hikâyeye Ortak Olun.
          </h2>
          <Link
            href="/magaza"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xs bg-charcoal-700 px-7 text-[12px] font-medium text-ivory-50 transition-colors duration-[180ms] hover:bg-mist-800"
            style={{ letterSpacing: "0.1em" }}
          >
            KOLEKSİYONLARI KEŞFET
          </Link>
        </div>
      </section>
    </div>
  );
}
