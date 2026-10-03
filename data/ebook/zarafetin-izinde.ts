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
  { title: "Önsöz", pageNumber: 4 },
  { title: "I — Bir Davet", pageNumber: 5 },
  { title: "II — Ahşabın Dili", pageNumber: 7 },
  { title: "III — Ateşte Doğanlar", pageNumber: 9 },
  { title: "IV — İpliğin Şiiri", pageNumber: 11 },
  { title: "V — Sessizliğin Formu", pageNumber: 13 },
  { title: "VI — Renk, Desen, Ritim", pageNumber: 15 },
  { title: "VII — Usta ile Karşılaşmak", pageNumber: 17 },
  { title: "VIII — Zarafet Nedir?", pageNumber: 19 },
  { title: "Son Söz", pageNumber: 21 },
];

export const BOOK_PAGES: BookPage[] = [
  // ── 0: KAPAK ──────────────────────────────────────────────────────────────
  {
    id: "cover",
    pageNumber: 0,
    type: "cover",
    image: "/ebook/cover/cover.png",
    title: BOOK_TITLE,
    subtitle: BOOK_SUBTITLE,
  },

  // ── 1: İÇ KAPAK ───────────────────────────────────────────────────────────
  {
    id: "inside-cover",
    pageNumber: 1,
    type: "inside-cover",
    title: BOOK_TITLE,
    subtitle: BOOK_SUBTITLE,
  },

  // ── 2: KÜNYE ──────────────────────────────────────────────────────────────
  {
    id: "colophon",
    pageNumber: 2,
    type: "colophon",
    title: BOOK_TITLE,
  },

  // ── 3: İÇİNDEKİLER ────────────────────────────────────────────────────────
  {
    id: "toc",
    pageNumber: 3,
    type: "toc",
    title: "İçindekiler",
  },

  // ── 4: ÖNSÖZ ──────────────────────────────────────────────────────────────
  {
    id: "preface",
    pageNumber: 4,
    type: "text",
    title: "Önsöz",
    content: `"Zarafetin İzinde" bir katalog değildir. Fiyat etiketleri taşımaz, envanter numaraları barındırmaz. Bu kitap, bir elin kili yoğururken hissettiği direnci, bir ustalığın tahtayı tanımasını ve camın ateşle dans ettiği o hassas anı kayıt altına almaya çalışır.

Zesta, el yapımı sanatın dijital çağdaki evidir. Ancak buradaki her eser, önce fiziksel dünyada var olmuştur: bir atölyede, bir elde, bir niyette.

Bu kitabı okuduğunuzda, eserleri değil; onların ardındaki kararları, tereddütleri ve dönüm noktalarını okuyacaksınız.

Zarafet, mükemmeliyetle aynı şey değildir. Çoğu zaman tam tersidir: bir çatlağın doğru yerde bitmesi, bir dokunun beklenmedik renklere sahip olması, bir formun geometriye meydan okuması.

Bu izde yürümek için hazır mısınız?`,
  },

  // ── 5: BÖLÜM I — CHAPTER ──────────────────────────────────────────────────
  {
    id: "ch1",
    pageNumber: 5,
    type: "chapter",
    chapterNumber: 1,
    title: "Bir Davet",
    subtitle: "El emeğinin sessiz çağrısı",
  },

  // ── 6: BÖLÜM I — METİN ────────────────────────────────────────────────────
  {
    id: "ch1-text",
    pageNumber: 6,
    type: "text",
    title: "Bir Davet",
    content: `Bir nesneyi elinize aldığınızda, önce ağırlığını hissedersiniz. Sonra yüzeyini. Ardından — eğer dikkat kesilirseniz — içindeki kararları.

Bu kasede bir kesik var: tam olarak planlanmamış, fırında pişerken malzemenin kendi tercihiyle ortaya çıkmış. Sanatçı onu silmedi. Düzelttikten sonra görmezden gelmedi. Ona baktı, kabul etti ve etrafında çalıştı.

İşte bu kitap, bu kabul anları hakkında.

El yapımı sanat, seri üretimin karşısında romantik bir direniş değildir yalnızca. O kadar basit bir anlatı bizi küçümser. El yapımı sanat, her defasında baştan başlama cesareti gerektirir. Her nesne, ustalığın daha önce öğrendiği her şeyi yeniden sorgulayan yeni bir sorudur.

Zesta'nın sanatçıları bu soruyu her gün sorar. Ve her gün, farklı bir cevap alırlar.

Bu kitapta, bu sorunun sekiz farklı yankısını duyacaksınız.`,
  },

  // ── 7: BÖLÜM II — CHAPTER ─────────────────────────────────────────────────
  {
    id: "ch2",
    pageNumber: 7,
    type: "chapter",
    chapterNumber: 2,
    title: "Ahşabın Dili",
    subtitle: "Yüzyılların sessizce yazdığı metin",
  },

  // ── 8: BÖLÜM II — METİN ───────────────────────────────────────────────────
  {
    id: "ch2-text",
    pageNumber: 8,
    type: "text",
    title: "Ahşabın Dili",
    content: `Ahşap, kesildiğinde bile büyümeye devam eder — sadece farklı bir biçimde.

Bir ağaç kütüğü atölyeye girdiğinde, içinde zaten bir şey taşıyor demektir: yıl halkalarında yazılmış kuraklıklar, taşkınlar, güneşli mevsimler. Usta bu metni okur. Damarların yönünü izler, yoğunluk farklarını hisseder ve sonra — en kritik karar — ne kadarını ortaya çıkaracağını belirler.

Ahşap oymacılığı, eklemek üzerine değil; çıkarmak üzeredir. Her kazıma bir seçimdir: bu çizginin kalmasına izin vermek mi, yoksa onun da gitmesini sağlamak mı?

Zesta'nın ahşap ustalarından biri şöyle der: "Malzemeyle savaşmıyorum. Onun ne olmak istediğini dinlemeye çalışıyorum." Bu cümle sanatın özünü taşır.

Meşenin ağırlığı, cevizin aroması, zeytinin dayanıklılığı — her ağaç farklı bir dil konuşur. Ahşap sanatçısı, bu dillerin çok dillisidir.`,
  },

  // ── 9: BÖLÜM III — CHAPTER ────────────────────────────────────────────────
  {
    id: "ch3",
    pageNumber: 9,
    type: "chapter",
    chapterNumber: 3,
    title: "Ateşte Doğanlar",
    subtitle: "Cam ve seramiğin ortak sınavı",
  },

  // ── 10: BÖLÜM III — METİN ─────────────────────────────────────────────────
  {
    id: "ch3-text",
    pageNumber: 10,
    type: "text",
    title: "Ateşte Doğanlar",
    content: `Hem cam hem de seramik, dönüşüm sanatlarıdır. Hammadde bir şeyken girer fırına; başka bir şey olarak çıkar. Bu dönüşüm geri alınamaz.

Seramikçi, kili şekillendirirken henüz eserin yarısıyla konuşmaktadır. Asıl diyalog fırında gerçekleşir, sanatçının yokluğunda. 1250 derecede kil ve sır kendi kararlarını verir: renk sürünür, yüzey çatlar ya da pürüzsüzleşir, form hafifçe çarpılır.

Bu beklenmediklikler birer hata mıdır? Japonların wabi-sabi felsefesi bize tam tersini öğretir: Kusur, bütünlüğün bir parçasıdır. Çatlak, nesnenin yaşam tarihinin bir bölümüdür.

Cam ise daha da aceleci bir malzemedir. Üflemeli cam sanatında sanatçının elleri, nefesi ve zamanlaması mükemmel bir uyum içinde çalışmak zorundadır. Cam soğuduğunda, artık konuşma biter. Ortaya çıkan şey, o anın kalıcı bir fotoğrafıdır.`,
  },

  // ── 11: BÖLÜM IV — CHAPTER ────────────────────────────────────────────────
  {
    id: "ch4",
    pageNumber: 11,
    type: "chapter",
    chapterNumber: 4,
    title: "İpliğin Şiiri",
    subtitle: "Tekstilin görünmez emekleri",
  },

  // ── 12: BÖLÜM IV — METİN ──────────────────────────────────────────────────
  {
    id: "ch4-text",
    pageNumber: 12,
    type: "text",
    title: "İpliğin Şiiri",
    content: `Bir halıya ya da dokuya baktığınızda gördüğünüz, yüzlerce saatin birikiminin sonucudur. Ama görmediğiniz şey daha fazladır: atılan hatalı ilmeler, sökülen bölümler, değiştirilen renkler, terk edilen desenler.

El yapımı tekstil, hem bir ürün hem de bir sürecin belgesidir. İplik seçimi başlı başına bir karardır: doğal mı, sentetik mi; boyalı mı, ham mı; ince mi, kaba mı? Her seçim, sonuca farklı bir ses katar.

Zesta'nın tekstil tasarımcıları sıklıkla "hata" kavramını yeniden tanımlar. Tezgahta beklenmedik şekilde gerilen bir iplik, planlanmayan bir doku yaratabilir. Boyamanın düzensiz tuttuğu bir kısım, tekdüze bir yüzeye can katar.

Tekstil, insan bedenine en yakın sanat biçimidir. El yapımı bir kumaşa dokunduğunuzda, yalnızca ipliği hissetmezsiniz. Onu yapan ellerin sıcaklığını da hissedersiniz — binlerce kilometre ve yıllar ötesinden.`,
  },

  // ── 13: BÖLÜM V — CHAPTER ─────────────────────────────────────────────────
  {
    id: "ch5",
    pageNumber: 13,
    type: "chapter",
    chapterNumber: 5,
    title: "Sessizliğin Formu",
    subtitle: "Heykel ve üç boyutlu düşüncenin grameri",
  },

  // ── 14: BÖLÜM V — METİN ───────────────────────────────────────────────────
  {
    id: "ch5-text",
    pageNumber: 14,
    type: "text",
    title: "Sessizliğin Formu",
    content: `Heykel, boşlukla kurulan bir ilişkidir.

Bir nesne üç boyutlu uzayda var olduğunda, kendi etrafındaki boşluğu da tanımlar. Sanatçı yalnızca nesneyi değil, o nesnenin olmadığı yerleri de tasarlar.

El yapımı heykel ve dekoratif objeler, bu ilişkiyi kasıtlı bilinçle kurar. Bir taş oyma ne kadar hafif hissettirirse, ustanın o ağırlığı yönetmedeki ustalığı da o kadar derindir. Bir metal form ne kadar akışkan görünürse, döküm anındaki kontrol de o kadar isabetli olmuştur.

Michelangelo şöyle demişti: "Heykel zaten mermerin içindedir. Ben yalnızca fazlalığı alıyorum."

Bu cümle, zanaatle sanatın kesiştiği ince çizgiyi tarif eder. Zanaat, fazlalığı doğru almayı bilmektir. Sanat ise neyin fazlalık olduğuna karar verebilmektir.`,
  },

  // ── 15: BÖLÜM VI — CHAPTER ────────────────────────────────────────────────
  {
    id: "ch6",
    pageNumber: 15,
    type: "chapter",
    chapterNumber: 6,
    title: "Renk, Desen, Ritim",
    subtitle: "Göz için bir müzik teorisi",
  },

  // ── 16: BÖLÜM VI — METİN ──────────────────────────────────────────────────
  {
    id: "ch6-text",
    pageNumber: 16,
    type: "text",
    title: "Renk, Desen, Ritim",
    content: `Renk, duygu değildir. Duyguyu tetikleyen bir anahtardır.

El yapımı nesnelerin renk anlayışı, seri üretiminkinden temelden farklıdır. Fabrikada renk, tutarlılık için standartlaştırılır. Atölyede renk, özgünlük için değiştirilir. Doğal boyalar, pişirme sıcaklıkları, malzeme emilimi — bunların her biri rengi canlı ve öngörülemez kılar.

Desen ise zamanın görsel yazısıdır. Geometrik bir tekrar, matematiksel bir düşüncenin sanatsal ifadesidir. Organik bir akış, doğayı taklit değil; doğayla diyalog kurmaktır.

Ritim, tüm görsel sanatların en çok göz ardı edilen boyutudur. Bir esere baktığınızda gözünüz nerede durur, nereye gider, nereye dönmek zorunda kalır? Bu yol, sanatçının izin verdiği veya kurguladığı bir ritimdir.

Renk, desen ve ritim bir arada çalıştığında ortaya estetik değil; deneyim çıkar.`,
  },

  // ── 17: BÖLÜM VII — CHAPTER ───────────────────────────────────────────────
  {
    id: "ch7",
    pageNumber: 17,
    type: "chapter",
    chapterNumber: 7,
    title: "Usta ile Karşılaşmak",
    subtitle: "Sanatçının ardındaki insan",
  },

  // ── 18: BÖLÜM VII — METİN ─────────────────────────────────────────────────
  {
    id: "ch7-text",
    pageNumber: 18,
    type: "text",
    title: "Usta ile Karşılaşmak",
    content: `Her eser, bir insanın bir kısmını taşır.

Bu romantik bir metafor değildir. Biyolojik bir gerçektir: el yapımı nesneler, yapanın karar örüntülerini, reflekslerini, o güne ait ruh halini ve birikimini içerir. Bu yüzden aynı sanatçının iki eseri hiçbir zaman özdeş değildir.

Zesta'nın tasarımcılarıyla konuştuğumuzda, hepsinin anlattığı ortak bir şey var: başarısız eserler. Atılmış parçalar, sökülen dokumalar, kırılan formlar. Sanatçının olgunluğu, bu başarısızlıkların sayısıyla değil; onlardan ne öğrenildiğiyle ölçülür.

Bir ustanın elleri, yıllar içinde şekillenir. Parmak uçlarındaki duyarlılık artar, kas hafızası derinleşir, sezgi gelişir. Ancak bu süreç asla tamamlanmaz. Her gerçek sanatçı, her yeni eserde yeniden acemiliğe döner — ve bundan korkmak yerine, bu anı arar.

Çünkü o an, gerçek yaratıcılığın kapısıdır.`,
  },

  // ── 19: BÖLÜM VIII — CHAPTER ──────────────────────────────────────────────
  {
    id: "ch8",
    pageNumber: 19,
    type: "chapter",
    chapterNumber: 8,
    title: "Zarafet Nedir?",
    subtitle: "Bir sorunun peşinde",
  },

  // ── 20: BÖLÜM VIII — METİN ────────────────────────────────────────────────
  {
    id: "ch8-text",
    pageNumber: 20,
    type: "text",
    title: "Zarafet Nedir?",
    content: `Bu kitabın başlığı bir sorudan doğdu.

Zarafet nedir? Pahalı olmak mıdır? Nadir olmak mıdır? Ünlü bir marka taşımak mıdır?

Biz farklı bir yanıt öneriyoruz: Zarafet, gereksizin silindiği andır.

Bir nesne, işe yaramayan hiçbir şeyi taşımadığında — ne fazladan bir çıkıntı, ne anlamsız bir süsleme, ne gereksiz bir ağırlık — geriye sadece özü kalır. Ve bu öz, çoğu zaman nefes kesici biçimde güzeldir.

Zesta'nın kuruluş felsefesi burada yatar: el emeğinin zarafet üretme kapasitesine olan inanç. Bir makinenin üretemeyeceği türden bir zarafet bu: hatalı, tekrarsız, canlı.

"Zarafetin İzinde" bir ürünü değil; bu arayışı tarif eder. Hem sanatçının atölyesindeki arayışı, hem de sizin elinizde tuttuğunuz nesneyle kurduğunuz sessiz diyaloğu.

Zarafet, nihai bir varış noktası değildir. Bir tavırdır.`,
  },

  // ── 21: SON SÖZ ───────────────────────────────────────────────────────────
  {
    id: "closing",
    pageNumber: 21,
    type: "closing",
    title: "Son Söz",
  },
];

export const TOTAL_PAGES = BOOK_PAGES.length; // 22
