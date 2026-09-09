"use client";

import { useState } from "react";
import Link from "next/link";

const FAQ_ITEMS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Ürünleriniz gerçekten el yapımı mı?",
    a: "Evet. Zesta'daki tüm ürünler, güzel sanatlar fakülteleriyle yürüttüğümüz iş birliği kapsamında, alanında eğitim gören genç sanatçılar tarafından elde üretilir. Seri üretim yapılmaz.",
  },
  {
    q: "Ürün fotoğraflarıyla elime geçen ürün arasında neden küçük farklar olabilir?",
    a: "El işi olmaları nedeniyle her parça birbirinden hafifçe farklılık gösterebilir; renk tonu, doku ve ölçülerde milimetrik sapmalar olağandır ve bu durum ayıp teşkil etmez.",
  },
  {
    q: "Siparişim ne kadar sürede hazırlanır?",
    a: "Çoğu ürün sipariş üzerine üretilir; üretim süresi ürün sayfasında belirtilir (genellikle 3-10 iş günü). Stoktan gönderilen ürünlerde bu süre 1-2 iş günüdür.",
  },
  {
    q: "Kargo ne kadar sürer?",
    a: "Üretim tamamlandıktan sonra ürün kargoya verilir, Türkiye'nin her yerine gönderim yapılır; toplam süre (üretim + kargo) yasal azami 30 günü geçmez.",
  },
  {
    q: "Sipariş vermek için üye olmam gerekiyor mu?",
    a: "Evet, sipariş güvenliği ve takibi için üyelik zorunludur; misafir alışveriş şu an desteklenmiyor.",
  },
  {
    q: "Ürünümü iade edebilir miyim?",
    a: (
      <>
        Stoktan gönderilen, kişiye özel üretilmeyen ürünlerde teslimattan itibaren 14 gün içinde cayma hakkınız
        vardır. Sipariş üzerine, size özel üretilen ürünlerde cayma hakkı istisnası uygulanır; bu ürünler
        sayfalarında ayrıca belirtilir. Detaylar için{" "}
        <Link href="/yasal/mesafeli-satis-sozlesmesi" className="text-champagne-300 hover:text-champagne-200 underline">
          Mesafeli Satış Sözleşmesi
        </Link>
        &apos;ni inceleyebilirsiniz.
      </>
    ),
  },
  {
    q: "Ödeme güvenli mi?",
    a: "Ödemeleriniz iyzico'nun PCI-DSS uyumlu, 256-bit SSL şifrelemeli altyapısı üzerinden alınır; kart bilgileriniz Zesta sunucularına hiçbir şekilde ulaşmaz.",
  },
  {
    q: "Yorum nasıl bırakabilirim?",
    a: "Ürün sayfasındaki \"Yorum Yaz\" butonuna tıklayıp giriş yaptıktan sonra puan ve yorumunuzu iletebilirsiniz.",
  },
  {
    q: "Yorumum neden hemen görünmüyor?",
    a: "Sahte veya istenmeyen içerik yazılmasını önlemek için tüm yorumlar yayınlanmadan önce ekibimiz tarafından incelenir; onaylandıktan kısa süre sonra yayına alınır.",
  },
  {
    q: "Neden yorum bırakmak için giriş yapmam şart?",
    a: "Güvenilir ve gerçek deneyimlere dayalı yorumlar sağlamak için yorum bırakmak üyelik gerektirir.",
  },
  {
    q: "Fiyatlar ürünler arasında neden bu kadar değişiyor?",
    a: "Her ürün malzeme, işçilik süresi ve ustalık seviyesine göre ayrı ayrı fiyatlandırılır; toplu veya standart bir fiyatlandırma uygulanmaz.",
  },
  {
    q: "Öğrenci/atölye modeliniz nasıl işliyor?",
    a: (
      <>
        Satışlardan elde edilen gelirle güzel sanatlar fakültelerindeki burslu öğrencilere destek oluyor, yetenekli
        isimleri atölyemizde istihdam ediyoruz. Detaylar için{" "}
        <Link href="/hikayemiz" className="text-champagne-300 hover:text-champagne-200 underline">
          Hakkımızda
        </Link>{" "}
        sayfamıza göz atabilirsiniz.
      </>
    ),
  },
  {
    q: "Siparişimi nasıl takip ederim?",
    a: "Hesabım > Siparişlerim bölümünden sipariş durumunuzu ve kargo takip numaranızı görebilirsiniz.",
  },
  {
    q: "Toplu veya kurumsal sipariş verebilir miyim?",
    a: (
      <>
        Toplu veya kurumsal talepleriniz için{" "}
        <Link href="/iletisim" className="text-champagne-300 hover:text-champagne-200 underline">
          İletişim
        </Link>{" "}
        sayfamızdan bize ulaşabilirsiniz.
      </>
    ),
  },
];

export function FaqClient() {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0]));

  function toggle(i: number) {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-5 md:px-12 py-16 md:py-24">
      <p className="eyebrow">Zesta</p>
      <h1 className="mt-3 font-display text-[32px] md:text-[44px] font-normal text-ink" style={{ lineHeight: 1.05 }}>
        Sıkça Sorulan Sorular
      </h1>
      <p className="mt-4 text-[15px] text-ash">
        Aradığınız yanıtı bulamadıysanız{" "}
        <Link href="/iletisim" className="text-champagne-300 hover:text-champagne-200 underline">
          bize ulaşın
        </Link>
        .
      </p>

      <div className="mt-12 border-t border-[var(--border-subtle)]">
        {FAQ_ITEMS.map((item, i) => {
          const open = openIndexes.has(i);
          return (
            <div key={i} className="border-b border-[var(--border-subtle)]">
              <button onClick={() => toggle(i)} className="w-full flex items-center justify-between gap-4 py-5 text-left">
                <span className="text-[15px] font-medium text-ink">{item.q}</span>
                <span
                  className="flex-shrink-0 text-ash text-[18px] leading-none transition-transform duration-[180ms]"
                  style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              <div className="accordion-panel" data-open={open}>
                <div>
                  <p className="pb-5 text-[15px] leading-relaxed text-smoke max-w-xl">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
