export interface HomepageHero {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  body: string;
  ctaLabel: string;
  secondaryCtaLabel: string;
  heroCategorySlug: string;
}

export interface HomepageTrustItem {
  title: string;
  body: string;
}

export interface HomepageCategoryRow {
  slug: string;
  label: string;
}

export interface HomepageEditorialSplit {
  eyebrow: string;
  heading: string;
  body: string;
  categorySlug: string;
  categoryLabel: string;
}

export interface HomepageContent {
  promoBarText: string;
  hero: HomepageHero;
  trustStrip: HomepageTrustItem[];
  categoryRows: HomepageCategoryRow[];
  editorialSplits: HomepageEditorialSplit[];
}

// Sitenin ilk sürümünde koddaki sabit değerlerdi — admin panelden (Anasayfa
// İçeriği) değiştirilebilsin diye Settings tablosuna taşındı. Bu obje sadece
// hiç kayıt yokken (ilk kurulum) kullanılan varsayılan/fallback değerdir.
export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  promoBarText: "El Yapımı · Sipariş Üzerine Üretilir · Türkiye'nin Her Yerine Kargo",
  hero: {
    eyebrow: "El İşi Atölye",
    headingLine1: "KÜÇÜK DETAYLAR.",
    headingLine2: "BÜYÜK HİKÂYELER.",
    body: "Her parça elde, sipariş üzerine, özenle üretilir. Türkiye'nin dört bir yanındaki ustaların atölyesinden evinize.",
    ctaLabel: "ÜRÜNLERİ KEŞFET",
    secondaryCtaLabel: "HİKÂYEMİZ →",
    heroCategorySlug: "tasarim-heykeller",
  },
  trustStrip: [
    { title: "El Yapımı", body: "Her parça, usta ellerde tek tek şekillendirilir. Seri üretim değil, zanaat." },
    { title: "Sipariş Üzerine", body: "Ürünler stoklamak için değil, siparişinize özel, özenle hazırlanır." },
    { title: "Özenle Paketlenir", body: "Her sipariş, kırılmaya karşı özenle sarılıp elinize zarar görmeden ulaşır." },
  ],
  categoryRows: [
    { slug: "seramik", label: "Seramik" },
    { slug: "cam-sanati", label: "Cam Sanatı" },
    { slug: "biblolar", label: "Biblolar" },
  ],
  editorialSplits: [
    {
      eyebrow: "Zanaat",
      heading: "Ahşabın Sıcaklığı, Elin İzi",
      body: "Zeytin, ceviz ve meşe ağacından doğan her obje, ustaların yıllara dayanan tecrübesiyle tek tek şekillendirilir. Seri üretim değil; sabırla, elle işlenmiş bir zanaat.",
      categorySlug: "ahsap-objeler",
      categoryLabel: "Ahşap Objeler",
    },
    {
      eyebrow: "Doku",
      heading: "İplikten Doğan Hikâyeler",
      body: "Makrome düğümlerinden dokuma yüzeylere, her tekstil parçası elde, sabırla işlenir. Doğal lifler ve toprak tonlarıyla evinize sıcak bir doku katar.",
      categorySlug: "el-yapimi-tekstil",
      categoryLabel: "El Yapımı Tekstil",
    },
  ],
};
