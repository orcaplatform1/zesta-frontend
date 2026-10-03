export type BookPage = {
  id: string;
  pageNumber: number;
  type: "cover" | "inside-cover" | "colophon" | "toc" | "chapter" | "artwork" | "text" | "closing";
  image?: string;
  title?: string;
  subtitle?: string;
  chapterNumber?: number;
  content?: string;
  continuation?: boolean;
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
  { title: "I — Zanaat mı, Sanat mı?", pageNumber: 5 },
  { title: "II — Ahşabın Dili", pageNumber: 9 },
  { title: "III — Ateş ve Toprak", pageNumber: 13 },
  { title: "IV — İpliğin Şiiri", pageNumber: 17 },
  { title: "V — Formun Ötesi", pageNumber: 21 },
  { title: "VI — Zarafetin İzinde", pageNumber: 25 },
  { title: "Son Söz", pageNumber: 29 },
];

export const BOOK_PAGES: BookPage[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // 0 · KAPAK
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "cover",
    pageNumber: 0,
    type: "cover",
    image: "/ebook/cover/cover.png",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 1 · İÇ KAPAK
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "inside-cover",
    pageNumber: 1,
    type: "inside-cover",
    title: BOOK_TITLE,
    subtitle: BOOK_SUBTITLE,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2 · KÜNYE
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "colophon",
    pageNumber: 2,
    type: "colophon",
    title: BOOK_TITLE,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3 · İÇİNDEKİLER
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "toc",
    pageNumber: 3,
    type: "toc",
    title: "İçindekiler",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4 · ÖNSÖZ
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "preface",
    pageNumber: 4,
    type: "text",
    title: "Önsöz",
    content: `Bir zanaat atölyesinde kendine özgü bir sessizlik vardır. Sesin yokluğundan değil — talaş kıymıkları fısıldar, fırınlar nefes alır, tezgahlar tıklar — ama tam bir dikkatlilik halinin yarattığı sessizlikten söz ediyorum. Her alet hareketi bir karar. Her malzeme tepkisi bir konuşma.

"Zarafetin İzinde" bir soruyla başladı: el yapımı bir nesneyi, seri üretilmiş muadilinden gerçekten farklı kılan nedir? Daha iyi değil mutlaka. Farklı. Cevabın nesnenin kendisiyle neredeyse hiçbir ilgisi olmadığını, buna karşın yapan ile malzeme arasındaki ilişkiyle, niyet ile sonuç arasındaki diyalogla her şeyin ilgisi olduğunu keşfettik.

Bu kitap altı bölümde o diyaloğu izliyor. Ahşaptan ateşe, tekstilden üç boyutlu forma; ve sonunda hepsinin altında yatan kavrama varıyor: zarafetin gerçek doğasına.

Yıllarını belirli bir dili öğrenerek geçirmiş sanatçılarla konuştuk. Tavanı alçak, ışığın tam da öyle düştüğü atölyelerde oturduk. Seri üretimin hiçbir zaman sunamadığı türden nesneleri elimizde tuttuk.

Bu kitabı okumak size bir şey yapmayı öğretmeyecek. Ama belki daha önce fark etmediğiniz şeyleri görmenizi sağlayacak — elinizde tuttuğunuz nesnelerde, onları yapan ellerde ve belki maddi dünyayla kurduğunuz kendi ilişkide.

Bu fark ediş, her şeyin başlangıcıdır.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5 · BÖLÜM I — CHAPTER SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch1",
    pageNumber: 5,
    type: "chapter",
    chapterNumber: 1,
    title: "Zanaat mı, Sanat mı?",
    subtitle: "Ya da: neden bu soruyu sormayı bırakmalıyız",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6 · BÖLÜM I — METİN 1
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch1-t1",
    pageNumber: 6,
    type: "text",
    title: "Zanaat mı, Sanat mı?",
    content: `Bu soru sık sık sorulur, genellikle cevabını önceden bilen birinin tonuyla. "Bu zanaat mı, yoksa sanat mı?" Sanki ayrımı kesinleştirmek önemliymiş gibi, sanki bunu çözmenin bize değerli bir şey söyleyeceği gibi.

Söylemiyor. Ya da daha doğrusu: bir şey söylüyor, ama sandığımız şeyi değil.

Zanaat ve sanat ayrımı, tarihsel açıdan bakıldığında oldukça yeni bir icattır. İnsanlığın büyük bölümünde, güzel ve ustalıklı nesneler yapanlar yalnızca "yapan" diye anılırdı. Hiç aynı şekilde tekrarlanmamış geometrik desenlerle halı dokuyan dokumacı, teknik ustalığını ve görsel zekasını aynı anda kullanıyordu. Fırında öngörülemez biçimlerde sırlanan seramikçi belirsizlikle çalışmayı öğrenmişti; ona rağmen değil.

Bu ayrım kademeli olarak oluştu. Batı sanayi kültürü nesneleri "yararlı" ve "güzel" diye sınıflandırmaya başladığında, bu taksonomi temiz ve mantıklı görünüyordu. Ama neredeyse hemen yanlış çıktı. Çünkü gerçek yapma eyleminde bu iki boyut birbirinden ayrılmaz. Usta hem malzemenin dilini konuşur, hem de o dilde bir şeyler söyler.

Söylediği şeyin işlevsel mi yoksa estetik mi olduğunu soran, yapma anında hiç bu soruyu sormaz. O sorular, nesne tamamlandıktan sonra, başkaları tarafından sorulur.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7 · BÖLÜM I — METİN 2
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch1-t2",
    pageNumber: 7,
    type: "text",
    continuation: true,
    title: "Zanaat mı, Sanat mı?",
    content: `Bir seramikçinin çarkta kase oluşturduğunu düşünün. Kil merkezlenir, duvarlar yükselir, form on binlerce kez tekrarlanan ellerin altında şekillenmeye başlar. Bu teknik ustalıktır: kilin nasıl davrandığına, hız ve basıncın nasıl etkileşime girdiğine, o günkü nemin her şeyi nasıl etkileyeceğine dair birikmiş bilgi.

Ama sonra bir karar anı gelir. Duvar, düz devam edebileceği ya da dışarıya doğru açılabileceği bir noktaya ulaşmıştır. Kasenin pratik gereksinimleri — kapasitesi, istiflenebilirliği, işlev göreceği bağlam — hangi seçimin doğru olduğu konusunda sessiz kalır. Usta duraksıyor. Pratikle tam ifade edilmesi güç ama daha isabetli bir adla "uygulama yoluyla birikmiş estetik zeka" diyebileceğimiz şey kararı veriyor.

Duvar açılıyor. Kase, olacağından biraz farklı bir şey oluyor. Bu anın "zanaat" mı yoksa "sanat" mı olduğu gerçekten önemsiz. Önemli olan şu: birisi oradaydı, dikkatini vermişti ve seçebiliyordu.

Zesta, bu tür seçimlerin önemli olduğu inancıyla kuruldu. El yapımı nesnelerin doğası gereği üstün olduğu için değil; böyle bir iddia sentimental olur. Ama farklı bir bilgi türü taşıdıkları için. Kararların kaydını tuttuğu için.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 8 · BÖLÜM I — METİN 3
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch1-t3",
    pageNumber: 8,
    type: "text",
    continuation: true,
    title: "Zanaat mı, Sanat mı?",
    content: `El yapımı bir kase, kararlar içerir. Bilinçli olarak okuyamıyor olabilirsiniz, ama hissediyorsunuzdur. Kenarın hafif düzensizliği. Tabanı ve kenarı farklı şekillerde biriktiren sır. Bu kilin belirli bir yerden geldiğini, belirli bir ilişkiyle çalışan ellerin oluşturduğunu söyleyen ağırlık.

Bunlar üretim sürecindeki hatalar değil. Hiçbir zaman üretim hakkında olmayan bir sürecin kayıtları. Bir insan ile maddi dünya arasındaki konuşmanın kanıtı — ve nesneyi, sonunda, indirgenemez biçimde özgün kılıyorlar.

Sonsuz yeniden üretilebilirlik çağında özgünlük yalnızca estetik değil. Sessizce, başlı başına bir tavır.

Bunu kavrayan sanatçılar işini farklı yapar. Daha yavaş, daha dikkatli. Bu yavaşlık bir kısıtlama değil, bir yatırım; dikkatin kendisine yapılan yatırım. Ve dikkat, hiçbir algoritmanın üretemeyeceği tek hammaddedir. Makine mükemmel tekrar üretir. Usta ise her seferinde o tekrarın içinde neyin farklı olduğunu bulur. Bu fark, nesneye sinmiş olandır.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 9 · BÖLÜM II — CHAPTER SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch2",
    pageNumber: 9,
    type: "chapter",
    chapterNumber: 2,
    title: "Ahşabın Dili",
    subtitle: "Yüzyılların sessizce yazdığı metin",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 10 · BÖLÜM II — METİN 1
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch2-t1",
    pageNumber: 10,
    type: "text",
    title: "Ahşabın Dili",
    content: `Ahşap, kesildiğinde bile büyümeye devam eder — sadece farklı bir biçimde.

Bir ağaç kütüğü atölyeye girdiğinde içinde zaten bir şey taşıyor demektir: yıl halkalarında yazılmış kuraklıklar, taşkınlar, güneşli mevsimler. Dar bir halka kıtlığı, geniş bir halka bolluğu anlatır. Büyümenin durduğu ve yeniden başladığı yerde görülen hafif burulma, iyileşmiş bir yarayı gösterir. Usta bu metni okur. Damarların yönünü izler, yoğunluk farklarını hisseder ve sonra — en kritik karar — ne kadarını ortaya çıkaracağını belirler.

Türk ahşap geleneği bu okumayı yüzyıllardır bilir. Anadolu'nun oyma ahşap kapılarından Osmanlı mobilyasının geometrik kakma işlerine kadar uzanan gelenek, teknik bilgi ile görsel zekayı tek bir eylemde birleştirir. Meşe, yoğun ve yavaş kurur; kalıcılık isteyen nesneler için biçilmiş kaftandır. Ceviz, renk derinliğiyle yağa ve balmumuna farklı tepkir; yüzeyi zamanla zenginleşir. Zeytin, işlemesi en güç ama en uzun ömürlü olanıdır; yüzeyi neredeyse kendi kendini parlatıyor gibi görünür.

Bu farklılıkları bilmek, ahşabın dilini konuşabilmektir.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 11 · BÖLÜM II — METİN 2
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch2-t2",
    pageNumber: 11,
    type: "text",
    continuation: true,
    title: "Ahşabın Dili",
    content: `Çağdaş ahşap ustalarının öncüllerinden farklı bir güçlükle yüzleştiği bir gerçek: her parça sağlam ahşap, artık hem daha kıt hem de kültürel açıdan daha ağır yüklü. Bu bir yük değil; en iyi ustaların bunu pratiğinin parçası haline getirdiğini görüyoruz.

Zesta'da çalışan bir ahşap ustası, kurtarılmış bir ceviz kütüğüyle ilk karşılaştığında ona üç gün hiç dokunmadığını anlatıyor. "Etrafında dolaşıyorum," diyor. "Farklı saatlerde ışığın üzerine nasıl düştüğüne bakıyorum. Dokunup dinliyorum. Ahşap, aceleniz yoksa size bir şeyler söylüyor."

Bu aceleci olmayan dikkat, sanayi üretiminin sunamayacağı bir lükstür — maliyet nedeniyle değil, yapısal olarak. Fabrika, verim için optimize eder. Atölye, dikkat için optimize eder. Her süreçten çıkan nesne, bu optimizasyonun izini taşır.

Ahşap oymacılığı eklemek değil, çıkarmak üzerine kurulur. Her kazıma bir seçimdir: bu çizginin kalmasına izin vermek mi, yoksa onun da gitmesini sağlamak mı? Bu soruyu soran kişi, hem teknik usta hem de görsel düşünür olmalıdır. İkisi birbirinden ayrılmaz; zaten hiçbir zaman ayrılmamıştır.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 12 · BÖLÜM II — METİN 3
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch2-t3",
    pageNumber: 12,
    type: "text",
    continuation: true,
    title: "Ahşabın Dili",
    content: `Japonca'da ma diye bir kavram var: şeyler arasındaki üretken boşluğu, çevresine anlam katan duraklamayı anlatır. İyi bir ahşap işçiliğinde tam olarak bu kalite bulunur. Form yalnızca orada olan değil, aynı zamanda yarattığı boşluktur, tanımladığı yokluktur.

Ahşabın taşıdığı şey yalnızca görsel değil. Bir nesne elinize geldiğinde, ağırlığı sizi bir şey hakkında bilgilendirir: bu malzeme yoğun mudur, hafif midir, ne kadar büyüktür? Ama daha da önemlisi, yüzeyin sıcaklığını hissedersiniz. Ahşabın ısıyı tutma biçimi, plastikten veya metalden farklıdır; o yüzden ahşap bir nesne dokunuşta başka türlü hissettiriyor.

Bu fiziksel gerçek sembolik bir anlam taşıyor. Ahşaba dokunan, canlı olmuş bir şeye dokuniyor demektir. Hâlâ canlı değil, evet — ama bir zamanlar canlıydı ve o yaşamın izlerini hâlâ taşıyor. Halkaları, liflerinin yönü, yüzeyinin renk değişimleri: bunların hepsi gerçek bir tarihin belgesi.

El yapımı ahşap nesne, bu tarihin bilinçli devamıdır. Usta, ağacın zamanını kendi zamanıyla buluşturur. Ve ortaya çıkan şey ne sadece ağaçtır ne de sadece ustanın eseri: ikisinin birlikte yazdığı bir şeydir.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 13 · BÖLÜM III — CHAPTER SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch3",
    pageNumber: 13,
    type: "chapter",
    chapterNumber: 3,
    title: "Ateş ve Toprak",
    subtitle: "Cam ve seramiğin ortak dönüşüm anı",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 14 · BÖLÜM III — METİN 1
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch3-t1",
    pageNumber: 14,
    type: "text",
    title: "Ateş ve Toprak",
    content: `Ateş, sanatın en eski ortağıdır.

Seramik ve cam, dönüşüm sanatlarıdır. Hammadde bir şeyken girer fırına; başka bir şey olarak çıkar. Bu dönüşüm geri alınamaz. Seramikçi, kili şekillendirirken henüz eserin yarısıyla konuşmaktadır. Asıl diyalog fırında gerçekleşir, sanatçının yokluğunda. 1200 derecede kil ve sır kendi kararlarını verir: renk sürünür, yüzey çatlar ya da pürüzsüzleşir, form hafifçe bükülür.

Bu beklenmediklikler birer hata mıdır? Japonların wabi-sabi felsefesi bize tam tersini söyler: Kusur, bütünlüğün bir parçasıdır. Çatlak, nesnenin yaşam tarihinin bir bölümüdür. Zanaat, bu anları kovalayanların değil; kabul edenlerin işidir.

Türk seramik geleneği bu kabulü yüzyıllardır bilir. Çanakkale'nin kırmızı kili ve cesur yüzey dekorasyonu. Kütahya çinilerinin bir imparatorluğun mimari dilini oluşturan mavi-beyaz kompozisyonları. Bunlar yalnızca tarihi eserler değil; yaşayan referanslar. Çağdaş seramikçiler bu referanslarla bilinçli bir diyalog içinde çalışır: bazen devam ederek, bazen ise kasıtlı bir kopuşla yeni sorular sorarak.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 15 · BÖLÜM III — METİN 2
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch3-t2",
    pageNumber: 15,
    type: "text",
    continuation: true,
    title: "Ateş ve Toprak",
    content: `Zesta'nın seramikçilerinden biriyle çark başında konuştuğumuzda, fırın açılış anından bahsetti: "Her seferinde aynı heyecanı yaşıyorum. Ne olduğunu bilmiyorum — bildiklerimi bilirim, ama fırın her zaman sürpriz bırakır. Bazen hayal kırıklığı, bazen beklediğimden çok daha iyi bir şey."

Bu beklenti anı, seramik pratiğinin özünde yatar. Öğrenilebilir, ama asla tam olarak kontrol edilemez. Ve bu kontrol edilemezlik, ustanın deneyimiyle birlikte daha derin bir kabulle karşılanır. Acemi bir seramikçi fırını bir rakip olarak görür. Deneyimli biri onu bir partner olarak görür: bazen zor, bazen cömert, ama her zaman dürüst.

Bu ortaklık, sır çalışmasında en görünür biçimiyle ortaya çıkar. Sır, pişirmeden önce genellikle sıradan, mat ve renksiz görünür. Fırında mineralleşir, erir ve kristalize olur. Sonuç; uygulama kalınlığına, fırının sıcaklık profiline, altındaki kil gövdesinin bileşimine göre değişir. Zesta'nın seramikçileri, bu değişkenleri yönetmek için yıllar harcar. Ama "yönetmek" kelimesi tam doğru değil — daha çok "dinlemek" denilebilir.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 16 · BÖLÜM III — METİN 3
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch3-t3",
    pageNumber: 16,
    type: "text",
    continuation: true,
    title: "Ateş ve Toprak",
    content: `Cam, ateşin bir diğer sanatıdır — ama farklı bir vücudu gerektirir.

Üflemeli cam, demir bir borunun ucundaki erimiş malzeme kütlesiyle başlar. Çalışma sıcaklığında cam, koyu balın fiziğiyle hareket eder ve turuncu parlar. Üfleyici, nefes, rotasyon ve alet temasının kombinasyonuyla şekillendirir; ve bu, sürekli olarak gerçekleşmek zorundadır çünkü çalışma sıcaklığındaki cam kimseyi beklemez.

Cam üfleyicinin bedeni birincil enstrümandır. Yalnızca elleri değil — gövdenin rotasyonu, nefesin kontrolü, omuzun açısı. Deneyimli bir cam ustası dışarıdan zahmetsiz görünen ama kesinlikle öyle olmayan bir ekonomi ve hassasiyetle hareket eder. Bir ustanın çalışırken izlediğiniz şey, binyıllarca birikmiş pratiğin fiziksel tezahürüdür: hafızada değil, kaslarda ve reflekslerde yaşayan bilgi.

Bu süreçten çıkan nesneler, hiçbir sanayi üretiminin başaramadığı görsel bir özellik taşır: bir canlılık, durdurulmuş bir hareket hissi, camın çok yakın zamana kadar akışkan olduğunu hatırlıyor gibi durması. Bunu gördüğünüzde tanırsınız. Ve neden tanıdığınızı açıklamak için pek çok kelime gerekmez; doğrudan hissedilir.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 17 · BÖLÜM IV — CHAPTER SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch4",
    pageNumber: 17,
    type: "chapter",
    chapterNumber: 4,
    title: "İpliğin Şiiri",
    subtitle: "Dokumacının zamanla kurduğu anlaşma",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 18 · BÖLÜM IV — METİN 1
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch4-t1",
    pageNumber: 18,
    type: "text",
    title: "İpliğin Şiiri",
    content: `Tekstil, insanlığın en eski ayakta kalan sanat biçimidir. Yirmi yedi bin yıllık dokunmuş parçalar bulunmuştur. Yazıdan önce, bugün anladığımız anlamda mimariden önce, medeniyetin büyük bölümünden önce, insanlar lifi ipe eğiriyor ve ipi birbirine geçirerek kumaş yapıyordu.

Bu kronoloji tesadüf değildir. "Text" kelimesi Latince texere'den, yani dokumaktan gelir. Argüman ipliği, anlatı dokusu, sosyal kumaş — bu metaforlar dilin içine o kadar derinden işlemiş ki neredeyse fark etmiyoruz. Bunlar süslü karşılaştırmalar değil; dokuma deneyiminin insanlığın bağlantı ve karmaşıklık hakkında düşüncesinin temel sözcüklerine dönüştüğü dönemin izleri.

Anadolu kilim geleneği bu tarihin canlı bir uzantısıdır. Belirli desenler belirli kökenleri, inançları, topluluklar arası ilişkileri kodlar. Bu desenleri okumayı öğrenmek, alfabeden önceki bir dili okumayı öğrenmektir.

Zesta'nın tekstil tasarımcıları bu geleneği yalnızca estetik bir kaynak olarak değil, düşünce biçimi olarak kullanır. Geometrik desen bir matematiksel düşüncenin sanatsal ifadesidir; organik bir akış ise doğayı taklit değil, doğayla diyalog kurma biçimidir.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 19 · BÖLÜM IV — METİN 2
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch4-t2",
    pageNumber: 19,
    type: "text",
    continuation: true,
    title: "İpliğin Şiiri",
    content: `El dokumacılığının ritmi, uygulayıcıların son derece tutarlı bir dille anlattığı meditasyona özgü bir dikkat niteliği üretir: hem yoğun odaklı hem de genişletici bir dikkat durumuna girersiniz. Beden tekrarlayan harekete alışır. Büyük kararlar vermek zorunda kalmayan zihin, başka türlü bir farkındalığa açılır.

Bu durum el sanatlarının çoğunda vardır, ama tekstil çalışmasında özellikle belirgin görünür — belki ritim o kadar metronomik, o kadar fiziksel ve o kadar kaçınılmaz biçimde hissedildiği için. Tamamlanan kumaş bu hali taşır. Bu mistisizm değil; fenomenoloji. Kumaş, belirli bir zihin durumundaki bir beden tarafından dokunulmuştur ve ortaya çıkan eser bu dikkatin kalitesini yansıtır.

El dokuma kumaş neden makine dokumasından farklı hissettiriyor? Ham madde ve desen özdeş olsa bile. Fark, fiber veya yapıda değil; yapımın kaydettiği şeyde.

Doğal boya çalışması bu tabloya ayrı bir boyut katar. Sentetik boyalar hassas, tekrarlanabilir ve kalıcıdır. Bitkilerden, minerallerden elde edilen doğal boyalar bunların hiçbiri değildir. Nisan'da indigo boyanmış bir kumaş, Ekim'de boyanandan farklı bir renge sahip olacaktır; diğer her değişken kontrol altında tutulsa bile.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 20 · BÖLÜM IV — METİN 3
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch4-t3",
    pageNumber: 20,
    type: "text",
    continuation: true,
    title: "İpliğin Şiiri",
    content: `"Her parça kendi yapımının kaydı," dedi bize bir boyacı. "Renk, ne zaman yapıldığını anlatıyor; o mevsimin suyunu, bitkileri anlatıyor. En derin anlamda, yerel."

Bu yerellik — el yapımı tekstilin bir yeri ve mevsimi ve özgün çevresel koşulları kodlama biçimi — küresel üretimin tamamen feda ettiği bir şey. Ortaya çıkan ürünler pek çok açıdan teknik olarak üstün ve diğer açılardan tamamen isimsiz. Her yerden gelmiş olabilirler. Nerede olduklarını anlatmıyorlar.

El yapımı tekstil ise en iyi halinde başka türlü bir belge: yalnızca güzel değil, özgün, konumlanmış, derinden yerel.

Bir halıya ya da dokuya baktığınızda gördüğünüz, yüzlerce saatin birikiminin sonucudur. Ama görmediğiniz şey daha fazladır: atılan yanlış ilmeler, sökülen bölümler, değiştirilen renkler, terk edilen desenler. Bunlar başarısızlıklar değil; sürecin parçaları.

El yapımı bir kumaşa dokunduğunuzda, yalnızca ipliği hissetmezsiniz. Onu yapan ellerin sıcaklığını da hissedersiniz — binlerce kilometre ve yıllar ötesinden gelen bir sıcaklık. Bu mesafeye rağmen gerçek olan, belki de bu nesnelerin en değerli özelliğidir.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 21 · BÖLÜM V — CHAPTER SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch5",
    pageNumber: 21,
    type: "chapter",
    chapterNumber: 5,
    title: "Formun Ötesi",
    subtitle: "Heykel ve üç boyutlu düşüncenin grameri",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 22 · BÖLÜM V — METİN 1
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch5-t1",
    pageNumber: 22,
    type: "text",
    title: "Formun Ötesi",
    content: `Form, şekil değildir. Bu ayrım, göründüğünden daha önemli.

Şekil geometrik bir özellikle tanımlanır: uzaydaki ölçülebilir konfigürasyon. Form ise deneyimseldir — bir şeklin algılandığı andaki niteliği, onunla etkileşime giren bedene ilettiği şey. İki nesne özdeş şekle sahip olup tamamen farklı formlara sahip olabilir. Fark yüzey kalitesinde, malzeme ağırlığında, nesnenin oranlarıyla etkileşime giren insan bedeninin oranları arasındaki ilişkide yatar.

Üç boyutlu el yapımı nesneler, heykel, dekoratif ve işlevsel formlar, öncelikle bu deneyimsel boyutla ilgilidir. En bağlı oldukları anlarda yapıcıları geometrik problemler çözmüyor; tarif etmesi daha zor bir şeyin peşinde: doğru hissettiren bir şeyi tutmanın özgün duygusu, kendi ağırlık merkezini bulmuş gibi görünen bir formu.

Anadolu'nun ritüel nesneleri — antik dönem bereket figürinleri, hayvan tasvirleri, işlevini ancak kısmen çözebildiğimiz soyut formlar — formun anlamı nasıl ilettiğine dair sofistike bir anlayışı ortaya koyar. Bu nesneler çağdaş anlamda dekoratif değildi; aktif ve amaçlı olanlar. Formları belirli etkileri üretmek için ayarlanmıştı.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 23 · BÖLÜM V — METİN 2
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch5-t2",
    pageNumber: 23,
    type: "text",
    continuation: true,
    title: "Formun Ötesi",
    content: `Bir nesneyi elle üç boyutlu olarak yapmak, onu dijital ortamda tasarlamaktan ya da üretimini yönlendirmekten köklü biçimde farklı bir bilişsel deneyimdir. Eller öncülük eder, zihin takip eder. Kil baskıya öngörülenden kısmen farklı tepkir; taş kendi iç yapısına göre direnir; metal ısı ve çekiç altında kendi mantığıyla hareket eder — ustanın yaparak öğrendiği, hafızada değil kaslarda ve reflekslerde yaşayan bir mantık.

Bu, üç boyutlu el yapımı nesnenin formunun hiçbir zaman tamamen önceki niyetin sonucu olmadığı anlamına gelir. Niyet ile maddi gerçek arasındaki müzakerenin ürünüdür; yapım süreci boyunca süren, malzemenin az önce söylediğine yanıt olarak verilen her yeni kararla devam eden bir müzakere.

Michelangelo şöyle demiş: "Heykel zaten mermerin içindedir. Ben yalnızca fazlalığı alıyorum." Bu cümle, zanaatle sanatın kesiştiği ince çizgiyi tarif eder: Zanaat, fazlalığı doğru almayı bilmektir. Sanat ise neyin fazlalık olduğuna karar verebilmektir.

Zesta'nın üç boyutlu işler yapan sanatçıları bu müzakereyi hem kısıt hem de özgürlük olarak tanımlar. Malzemenin sizi zorladığı her an, sizi kendi başınıza düşünmediğiniz bir yere götürebilir.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 24 · BÖLÜM V — METİN 3
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch5-t3",
    pageNumber: 24,
    type: "text",
    continuation: true,
    title: "Formun Ötesi",
    content: `Bu sürecin biçimsel sonuçları, tam olarak adlandırılması güç ama tanınması kolay bir kaliteye sahiptir: bir doğruluk hissi, nesnenin olmaya ihtiyaç duyduğu forma gelmiş olduğu duygusu. Soyut anlamda mükemmel bir form değil, ama bu malzemenin bu ellerde bu anda ulaşabileceği form.

İnsanlar el yapımı nesnelerin ruhu olduğunu söylerken bunu kastediyor, sanırız. Metafizik değil, fenomenoloji. Kalıcı forma basılmış gerçek bir konuşmanın kaydı.

Bir nesne üç boyutlu uzayda var olduğunda, çevresindeki boşluğu da tanımlar. Sanatçı yalnızca nesneyi değil, o nesnenin olmadığı yerleri de tasarlar. Japonca'da ma kavramı, özellikle bu üretken boşlukla ilgilidir: bir şeyin yokluğunun ona anlam kattığı o alan.

Üç boyutlu el işçiliğinin en iyi örnekleri tam da bunu yapar. Odaya girmeden önce odayı değiştirirler; elinize almadan önce sizi onlar hakkında bir şey hissettirirler. Bu sizi etkilemek için tasarlanmış bir trick değil. Bir dürüstlüktür: malzeme kendi en güçlü haliyle var olmakta, onu bu hale getiren eller kaybolmadan arkasında iz bırakmaktadır.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 25 · BÖLÜM VI — CHAPTER SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch6",
    pageNumber: 25,
    type: "chapter",
    chapterNumber: 6,
    title: "Zarafetin İzinde",
    subtitle: "Gereksizin silindiği an",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 26 · BÖLÜM VI — METİN 1
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch6-t1",
    pageNumber: 26,
    type: "text",
    title: "Zarafetin İzinde",
    content: `Başından beri dolaştığımız soruya geldik. Zarafet nedir? Ve bu kitapta konuştuğumuz her şeyle ne ilgisi var?

Kelime, Latince eligere'den gelir: seçmek, ayırt etmek, öne çıkarmak. Zarif bir çözüm, gereksizin silindiğine kadar rafine edilmiş olandır. Zarif bir ispat, bir gerçeğe giden en kısa yoldur. Zarif bir el yapımı nesne ise hiçbir şey çıkarılamayacak olandır — çıkarılan her şeyin bir kayba yol açacağı nokta.

Bu titiz bir tanım. Lüks ya da pahalı olmakla ilgisi yok. Bir mühendislik probleminin zarif çözümü ucuz olabilir. Zarif bir şiir çok kısa olabilir. Zarif bir el yapımı nesne en sade malzemelerden yapılmış olabilir.

Zarafetin gerektirdiği şey düzenleme. Gereksizi çıkarma disiplini. Özele ulaşıldığında durma özgüveni. Bu paradoks olarak eklemekten çoğu zaman daha zordur — çünkü ekleme ilerleme gibi hissettiriyor ve çıkarma kayıp gibi, tam tersi doğru olsa bile.

Bu kitapta yer alan sanatçıların hepsi, farklı yollardan gelerek bu titiz düzenleme pratiğine ulaşmış. Estetik bir gösteriş olarak değil; işlerinin temel disiplini olarak.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 27 · BÖLÜM VI — METİN 2
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch6-t2",
    pageNumber: 27,
    type: "text",
    continuation: true,
    title: "Zarafetin İzinde",
    content: `Sırını istediği derinliğe ulaşana kadar parçayı defalarca fırınlayan seramikçi bu disiplini yaşıyor. Daha erken durabilir. Parça teknik olarak yeterli olurdu. Ama yeterli değil, aranan bu değil.

"Oran bir milimetre yanlış" diye bitmiş bir parçayı reddeden ahşap ustası ise on yıllar boyunca eğitilmiş bir gözün ürünü. Bu nevrotik anlamda mükemmeliyetçilik değil. Gerçek zarafeti mümkün kılan algı kalibrasyonu.

Üç günlük çalışmayı söken tekstil ustası, çünkü bir renk ilişkisi genel kompozisyonun barındıramayacağı şekilde kaydı — bu da aynı disiplin, farklı bir malzemede.

Tüm bu pratikler ortak bir yapıyı paylaşıyor: tam olarak ifade edilemeyen ama yanlışsız hissedilen bir doğruluk standardına karşı işi ölçme isteği.

Zesta bunu anlayan sanatçılarla çalışır. Ve bu anlayış, nesnelerin içinde gizlidir — bir ürün özelliği olarak değil, bir ilişki kalitesi olarak. Nesneyi elinizde tuttuğunuzda, düşünmeden, tam da bu ağırlıkta olması gerektiğini hissedersiniz. Bu hissin kendisi, zanaatın en dürüst teslim aldığı şeydir.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 28 · BÖLÜM VI — METİN 3
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ch6-t3",
    pageNumber: 28,
    type: "text",
    continuation: true,
    title: "Zarafetin İzinde",
    content: `Bu tür zarafete ulaşmış nesnelerle birlikte olmanın özel bir niteliği var. Belirli anlamda dinlendirici. Pasif değil — dikkat çekiyor ve yakından bakıldığında ödüllendiriyor — ama dinlendirici: olduklarından fazlası olmaya çalışmıyorlar. Kendi dengelerini bulmuşlar.

Bu denge nadir. Dünya, çok çalışan nesnelerle dolu — karmaşıklık, süsleme ya da yenilikle henüz merkezine yerleşememiş bir formu telafi etmeye çalışanlarla. Bunda yanlış bir şey yok; yapılan şeylerin çoğu böyle, el yapımı olanların çoğu dahil. Zarafet kolayca elde edilmiyor.

Ama elde edildiğinde biliyorsunuz. Kaseyi kaldırıyorsunuz ve tam olması gerektiği kadar ağır hissediyorsunuz. Tekstili asıyorsunuz ve oda öngörülemeyen bir biçimde değişiyor. Oyma nesneyi rafa koyuyorsunuz ve üzerinde düşünmeden orada ait olduğunu anlıyorsunuz.

"Zarafetin İzinde" her zaman bu anları fark etmenin bir yoluydu. Bir şeyin olmaya ihtiyaç duyduğu forma geldiği anı fark etmenin. Bu farkındalığa güvenmeyi öğrenmenin.

Zarafet, nihai bir varış noktası değildir. Bir tavırdır. Ve bu tavır — sabır, özen, gereksizden kurtulma cesareti — tüm el sanatlarının özünde yatar. Aramaya devam edenin bulduğu şeydir.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 29 · SON SÖZ
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "closing",
    pageNumber: 29,
    type: "closing",
    title: "Son Söz",
  },
];

export const TOTAL_PAGES = BOOK_PAGES.length; // 30
