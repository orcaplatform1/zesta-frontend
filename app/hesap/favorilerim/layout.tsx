import type { Metadata } from "next";

export const metadata: Metadata = { title: "Favorilerim", robots: { index: false } };

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
