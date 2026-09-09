import type { Metadata } from "next";
import { serverApiGet } from "@/lib/server-api";
import type { Category, ProductListResponse } from "@/lib/types";
import { CategoryClient } from "./category-client";

async function getCategory(slug: string) {
  return serverApiGet<Category>(`/categories/${slug}`, 300);
}

async function getProducts(slug: string) {
  return serverApiGet<ProductListResponse>(`/products?category=${slug}&pageSize=24`, 60);
}

export async function generateMetadata(props: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategory(slug);

  if (!category) return { title: "Kategori Bulunamadı" };

  return {
    title: category.name,
    description: category.description ?? `${category.name} kategorisindeki Zesta el işi ürünleri.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage(props: PageProps<"/category/[slug]">) {
  const { slug } = await props.params;
  const [category, products] = await Promise.all([getCategory(slug), getProducts(slug)]);

  return <CategoryClient slug={slug} initialCategory={category} initialProducts={products} />;
}
