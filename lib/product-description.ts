import type { Product } from "./types";

export interface ParsedProductDescription {
  about: string;
  details: string[];
  care: string;
}

const GENERIC_CARE =
  "Kuru veya hafif nemli bir bezle silinmesi, aşındırıcı kimyasal temizlik ürünlerinden kaçınılması önerilir.";

// Ürün açıklamaları iki farklı biçimde geliyor: bir kısmı (seramik/cam-sanati/
// ahsap-objeler/mumlar-kokular/dekoratif-aynalar/el-yapimi-tekstil) "Ürün
// Özellikleri:"/"Bakım:"/"Not:" etiketleriyle yapılandırılmış; diğerleri
// (biblo/heykel/tablo) tek akan paragraf, hiç etiket yok. İkisini de aynı
// Hakkında/Detaylar/Bakım üçlüsüne ayırıyoruz.
export function parseProductDescription(product: Product): ParsedProductDescription {
  const text = (product.description ?? "").trim();
  const hasStructured = text.includes("Ürün Özellikleri:") && text.includes("Bakım:");

  if (hasStructured) {
    const [aboutPart, afterFeatures] = text.split("Ürün Özellikleri:");
    const [featuresPart, afterCare] = afterFeatures.split("Bakım:");

    const details = featuresPart
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("•"));

    let care = (afterCare ?? "").trim();
    if (care.includes("Not:")) {
      const [carePart, notPart] = care.split("Not:");
      care = carePart.trim();
      const note = notPart.trim();
      if (note) details.push(`• ${note}`);
    }

    if (product.productionTime) details.push(`• Üretim Süresi: ${product.productionTime}`);

    return {
      about: aboutPart.trim(),
      details,
      care: care || GENERIC_CARE,
    };
  }

  const details: string[] = [];
  if (product.productionTime) details.push(`• Üretim Süresi: ${product.productionTime}`);
  if (product.category?.name) details.push(`• Kategori: ${product.category.name}`);
  details.push(`• Ürün Kodu: ${product.sku}`);

  return {
    about: text,
    details,
    care: GENERIC_CARE,
  };
}
