"use client";

import { useEffect, useRef } from "react";
import { ProductCard } from "@/components/ProductCard";
import { subscribeCarouselTick } from "@/lib/carousel-heartbeat";
import type { Product } from "@/lib/types";

const RESUME_DELAY_MS = 2500;
const SETTLE_DELAY_MS = 150;

type RatingMap = Record<string, { average: number; count: number }>;

/**
 * Otomatik kayan (ve sonsuz döngülü) ürün şeridi. Kayma zamanlaması
 * lib/carousel-heartbeat üzerinden paylaşılıyor — sayfadaki tüm şeritler
 * aynı anda adım atar.
 */
export function ProductCarousel({ items, ratings = {} }: { items: Product[]; ratings?: RatingMap }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const interactingRef = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loop = items.length > 1;

  // Sonsuz görünüm için liste 3 kopya render edilir, başlangıçta ortadaki
  // kopyaya atlanır — hem ileri hem geri kaydırınca sınırsız devam eder.
  useEffect(() => {
    if (!loop) return;
    const el = containerRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollLeft = el.scrollWidth / 3;
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop, items.length]);

  useEffect(() => {
    if (!loop) return;
    return subscribeCarouselTick(() => {
      if (!interactingRef.current) step();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop]);

  function step() {
    const el = containerRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0");
    const cardWidth = card.getBoundingClientRect().width + gap;
    el.scrollBy({ left: cardWidth, behavior: "smooth" });
  }

  function handlePointerDown() {
    interactingRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }

  function handleScroll() {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      const el = containerRef.current;
      // Kullanıcı hâlâ sürüklüyorsa düzeltmeyi erteler — ortadaki üçte birde
      // yeterince pay var, aksi halde sürükleme sırasında görünür bir
      // "sıçrama" hissi oluşabiliyordu.
      if (el && loop && !interactingRef.current) {
        const singleSetWidth = el.scrollWidth / 3;
        if (el.scrollLeft < singleSetWidth * 0.5) {
          el.scrollLeft += singleSetWidth;
        } else if (el.scrollLeft > singleSetWidth * 1.5) {
          el.scrollLeft -= singleSetWidth;
        }
      }
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        interactingRef.current = false;
      }, RESUME_DELAY_MS);
    }, SETTLE_DELAY_MS);
  }

  const renderList = loop ? [...items, ...items, ...items] : items;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      onPointerDown={handlePointerDown}
      // scroll-smooth BİLEREK yok: CSS scroll-behavior:smooth açıkken doğrudan
      // scrollLeft ataması (sonsuz döngü kopyaları arası anlık/görünmez sıçrama
      // için kullanılıyor) bazı tarayıcılarda da animasyonlu kayıyor — kullanıcı
      // manuel kaydırdıktan sonra görünür şekilde "geri fırlıyormuş" gibi
      // algılanıyordu. Otomatik adım (step()) zaten kendi smooth'unu scrollBy
      // ile ayrıca istiyor, dokunmatik/trackpad kaydırma da doğal akıcı.
      className="carousel-scroll flex gap-4 overflow-x-auto snap-x snap-mandatory"
    >
      {renderList.map((product, i) => (
        <div key={`${product.id}-${i}`} className="flex-none w-[80%] sm:w-[48%] md:w-[32%] lg:w-1/4 snap-start">
          <ProductCard product={product} rating={ratings[product.id]} />
        </div>
      ))}
    </div>
  );
}
