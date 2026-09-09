import type { Metadata } from "next";
import { safeJsonLd } from "@/lib/json-ld";
import { serverApiGet } from "@/lib/server-api";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Product } from "@/lib/types";
import { ProductClient } from "./product-client";

async function getProduct(slug: string) {
  return serverApiGet<Product>(`/products/${slug}`, 60);
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Ürün Bulunamadı" };
  }

  const description = product.description ?? `${product.name} — Zesta el işi ürün koleksiyonu.`;
  const image = product.images[0]?.url;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description ?? undefined,
        sku: product.sku,
        image: product.images[0]?.url ? `${SITE_URL}${product.images[0].url}` : undefined,
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/product/${product.slug}`,
          priceCurrency: "TRY",
          price: product.salePrice ?? product.price,
          availability:
            product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      )}
      <ProductClient slug={slug} initialProduct={product} />
    </>
  );
}
