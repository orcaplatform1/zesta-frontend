// Sunucu tarafı (metadata, sitemap, RSC) için — nginx /api/ rewrite'ı yalnızca
// tarayıcı istekleri için var; sunucudan sunucuya doğrudan backend'e gidiyoruz.
const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:3200";

export async function serverApiGet<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(`${INTERNAL_API_URL}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
