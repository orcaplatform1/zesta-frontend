// Footer iletişim bloğu, Kurumsal Çözümler ve Mağazalarımız sayfalarının
// içeriği — homepage-content.ts ile aynı desen: Settings tablosunda tek bir
// JSON key olarak saklanır, /manage/sayfalar üzerinden düzenlenir.

export interface FooterContactContent {
  phone: string;
  email: string;
  addressNote: string;
}

export const DEFAULT_FOOTER_CONTACT: FooterContactContent = {
  phone: "0530 000 00 00",
  email: "info@zesta.tr",
  addressNote: "Merkez Mağazamıza hafta içi ve Cumartesi 09:00 - 18:00 saatleri arasında ulaşabilirsiniz.",
};

export interface CorporateSolutionCard {
  title: string;
  body: string;
}

export interface CorporatePageContent {
  eyebrow: string;
  heading: string;
  intro: string;
  heroImage: string;
  cards: CorporateSolutionCard[];
  ctaLabel: string;
}

export const DEFAULT_CORPORATE_PAGE: CorporatePageContent = {
  eyebrow: "Kurumsal",
  heading: "Mekanlarınıza Zanaatin İmzasını Taşıyın",
  intro:
    "Ofisinizden otelinize, karşılama alanınızdan kurumsal hediyelerinize kadar; Zesta atölyesinin el emeği ürünleriyle markanızın hikayesine özgün bir dokunuş katıyoruz. Seçimden teslimata kadar tüm süreçte yanınızdayız.",
  heroImage: "/corporate-hero.jpg",
  cards: [
    {
      title: "Kurumsal Hediyelik",
      body: "Çalışanlarınıza ve müşterilerinize, seri üretim değil gerçek bir zanaat hikayesi taşıyan, kişiye özel el yapımı hediyeler sunun.",
    },
    {
      title: "Ofis & Karşılama Alanları",
      body: "Seramik, cam sanatı ve ahşap objelerle ofisinize sıcak, özgün bir atmosfer kazandırın — ziyaretçilerinizde iz bırakan bir ilk izlenim.",
    },
    {
      title: "Otel & Restoran Dekorasyonu",
      body: "Misafirlerinize unutulmaz bir deneyim sunmak isteyen mekanlar için, atölyemizden özel seçki ve toplu üretim seçenekleri.",
    },
    {
      title: "Özel Proje & Danışmanlık",
      body: "İhtiyacınıza özel tasarım ve üretim süreci için atölyemizle doğrudan çalışın; miktar, malzeme ve teslim takvimini birlikte planlayalım.",
    },
  ],
  ctaLabel: "TEKLİF İÇİN İLETİŞİME GEÇİN",
};

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
}

export interface StoresPageContent {
  intro: string;
  stores: Store[];
}

export const DEFAULT_STORES_PAGE: StoresPageContent = {
  intro: "Ürünlerimizi yerinde incelemek isterseniz, mağazamıza bekleriz.",
  stores: [
    {
      id: "merkez",
      name: "Zesta Merkez Mağaza",
      address: "Örnek Mahallesi, Sanat Sokak No:1, Kadıköy / İstanbul",
      phone: "0530 000 00 00",
      hours: "Hafta içi ve Cumartesi 09:00 - 18:00",
      image: "/magaza-ornek.jpg",
    },
  ],
};
