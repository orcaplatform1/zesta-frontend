export type BookPage = {
  id: string;
  pageNumber: number;
  type: "cover" | "inside-cover" | "colophon" | "toc" | "chapter" | "artwork" | "text" | "closing";
  image?: string;
  background?: string;
  title?: string;
  subtitle?: string;
  chapterNumber?: number;
  content?: string;
  artwork?: {
    image?: string;
    name: string;
    artist: string;
    category: string;
    story: string;
    material: string;
    production: string;
  };
};

export type TableOfContentsEntry = {
  title: string;
  pageNumber: number;
};

export const BOOK_TITLE = "Zarafetin İzinde";
export const BOOK_SUBTITLE = "Eserlerin ardındaki hikâyelere bir yolculuk..";
export const BOOK_AUTHOR = "Mert Dağdeviren";
export const BOOK_BRAND = "zesta Art&Design";

export const TABLE_OF_CONTENTS: TableOfContentsEntry[] = [
  { title: "Başlangıç", pageNumber: 4 },
  { title: "Ahşabın Hikâyesi", pageNumber: 5 },
  { title: "Camın Işığı", pageNumber: 8 },
  { title: "Seramiğin Dokusu", pageNumber: 11 },
  { title: "Tekstilin İzleri", pageNumber: 14 },
  { title: "Heykelin Sessizliği", pageNumber: 17 },
  { title: "Renk ve Form", pageNumber: 20 },
  { title: "Sanatçının Hikâyesi", pageNumber: 22 },
  { title: "Son Söz", pageNumber: 24 },
];

export const BOOK_PAGES: BookPage[] = [
  {
    id: "cover",
    pageNumber: 0,
    type: "cover",
    image: "/ebook/cover/cover.png",
    title: BOOK_TITLE,
    subtitle: BOOK_SUBTITLE,
  },
  {
    id: "inside-cover",
    pageNumber: 1,
    type: "inside-cover",
    title: BOOK_TITLE,
    subtitle: BOOK_SUBTITLE,
  },
  {
    id: "colophon",
    pageNumber: 2,
    type: "colophon",
    title: BOOK_TITLE,
  },
  {
    id: "toc",
    pageNumber: 3,
    type: "toc",
    title: "İçindekiler",
  },
  {
    id: "intro",
    pageNumber: 4,
    type: "text",
    title: "Başlangıç",
    content: `Her eser bir anın dondurulmuş hâlidir.\n\nZesta olarak, zanaat ve sanatın kesiştiği noktada yer alıyoruz. Ahşabın sıcaklığı, camın şeffaflığı, seramiğin kalıcılığı — bunların hepsi ustalıklı ellerin yorulmaz çabası ve hayallerin somutlaşmasıyla bir araya geliyor.\n\n"Zarafetin İzinde" yalnızca bir ürün kataloğu değil; her ustanın, her tasarımcının, her eserin ardındaki derin ve kişisel hikâyenin bir yansımasıdır.\n\nSayfaları çevirirken, bir sinemanın perdesi gibi açılan o dünyaya davet edildiğinizi hissedeceksiniz.`,
  },
  {
    id: "chapter-1",
    pageNumber: 5,
    type: "chapter",
    chapterNumber: 1,
    title: "Ahşabın Hikâyesi",
    subtitle: "Doğadan gelen zarafet",
  },
  {
    id: "artwork-1",
    pageNumber: 6,
    type: "artwork",
    artwork: {
      name: "Meşe Oyma Kase",
      artist: "Elif Kaya",
      category: "Ahşap Objeler",
      story: "Meşe ağacının yüzyıllık damarlarından doğan bu kase, her çizgisiyle bir ömrü anlatıyor. Tokmaklarla şekillendirilmiş, zımparalanmış ve doğal yağlarla işlenmiş bu eser, hem işlevsel hem de sanatsal bir kimliğe sahip.",
      material: "Meşe ağacı, doğal zeytinyağı, balmumu",
      production: "El oyma tekniği, 40 saat emek",
    },
  },
  {
    id: "artwork-1-story",
    pageNumber: 7,
    type: "text",
    title: "Ağacın Sesi",
    content: `Elif, atölyesindeki meşe kütüğünü ilk gördüğünde onun içinde ne sakladığını hissetti. Oyma bıçakları eline aldığında, ağacın ne olmak istediğini anlamaya çalıştı.\n\n"Ben ağaca şekil vermiyorum," diyor Elif. "Ağaç zaten biliyor ne olmak istediğini. Ben sadece gereksiz olanı kaldırıyorum."\n\nBu kase, onun bu felsefesinin bir yansıması; doğanın kendi içindeki zarafetin ortaya çıkarılmış hâli.`,
  },
  {
    id: "chapter-2",
    pageNumber: 8,
    type: "chapter",
    chapterNumber: 2,
    title: "Camın Işığı",
    subtitle: "Şeffaflığın ötesinde bir derinlik",
  },
  {
    id: "artwork-2",
    pageNumber: 9,
    type: "artwork",
    artwork: {
      name: "Üflemeli Cam Vazo",
      artist: "Kerem Sarıoğlu",
      category: "Cam Sanatı",
      story: "1200 derece ateşin içinden şekillenen bu vazo, ustalığın sınırlarını zorluyor. Her üfleme, cam ustasının nefesiyle şekilleniyor; hiçbir ikisi birbirinin aynısı olamaz.",
      material: "El yapımı borosilikat cam, metal oksit boyalar",
      production: "Serbest üfleme tekniği, 8 saat ısıl işlem",
    },
  },
  {
    id: "artwork-2-story",
    pageNumber: 10,
    type: "text",
    title: "Işığı Şekillendirmek",
    content: `Cam, doğanın en paradoksal malzemelerinden biridir. Hem rijit hem kırılgan, hem şeffaf hem de içinden geçen ışığı renklendirebilen bu madde, Kerem'in ellerinde adeta bir dansçıya dönüşüyor.\n\nAtölyesinde saatler boyu yanan fırının karşısında Kerem, cam ustalarının nesilden nesile aktardığı teknikleri kendi yorumuyla buluşturuyor.\n\n"Her vazo bir şarkı gibi," diyor Kerem. "Başlar, gelişir, biter. Ama o son nota, yani soğuma anı, tüm eserin ruhunu belirler."`,
  },
  {
    id: "closing",
    pageNumber: 11,
    type: "closing",
    title: "Son Söz",
  },
];

export const TOTAL_PAGES = BOOK_PAGES.length;
