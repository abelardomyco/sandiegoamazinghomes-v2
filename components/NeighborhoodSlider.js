"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const NEIGHBORHOOD_HERO_FALLBACK = "/images/placeholder-listing.svg";
const EXCLUDED_HERO_PATTERNS = [
  "royal california real estate",
  "Screen-Shot-2025-01-03-hero",
];

function safeHeroSrc(src) {
  if (!src) return NEIGHBORHOOD_HERO_FALLBACK;
  const lower = (src || "").toLowerCase();
  if (EXCLUDED_HERO_PATTERNS.some((p) => lower.includes(p))) return NEIGHBORHOOD_HERO_FALLBACK;
  return src;
}

/**
 * Slider of neighborhood cards for the homepage. Uses Embla like ImageCarousel.
 * @param {{ neighborhoods: Array<{ slug: string, name: string, region: string, heroImage?: string, shortIntro?: string }> }}
 */
export default function NeighborhoodSlider({ neighborhoods }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    breakpoints: {
      "(max-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 641px)": { slidesToScroll: 3 },
      "(min-width: 1024px)": { slidesToScroll: 6 },
    },
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  if (!neighborhoods?.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-sm text-slate-500">No neighborhoods to show.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      <div className="relative">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100" ref={emblaRef}>
          <div className="embla__container flex touch-pan-y gap-2 p-1.5">
            {neighborhoods.map((n) => {
              const heroSrc = safeHeroSrc(n.heroImage);
              return (
                <div
                  key={n.slug}
                  className="embla__slide min-w-0 flex-[0_0_50%] sm:flex-[0_0_25%] lg:flex-[0_0_16.666%]"
                >
                  <Link
                    href={`/neighborhoods/${n.slug}`}
                    className="block rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow hover:border-sd-200 transition-all h-full"
                  >
                    <div className="relative w-full aspect-[4/3] bg-slate-200">
                      <Image
                        src={heroSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16.666vw"
                      />
                    </div>
                    <div className="px-1.5 py-1">
                      <h3 className="font-medium text-slate-900 text-xs truncate">{n.name}</h3>
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                        {n.region}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {neighborhoods.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Previous neighborhoods"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Next neighborhoods"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {neighborhoods.length > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {neighborhoods.slice(0, Math.min(10, neighborhoods.length)).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === selectedIndex ? "w-6 bg-sd-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
