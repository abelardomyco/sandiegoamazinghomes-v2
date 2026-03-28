"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Embla carousel for neighborhood hero: one full-width slide at a time.
 * Preloads the first (hero) image for performance.
 *
 * @param {{ images: string[], neighborhoodName: string, slug: string, className?: string, children?: React.ReactNode }} props
 * children: overlay content (e.g. name + region) rendered over the carousel
 */
export default function NeighborhoodHeroCarousel({
  images,
  neighborhoodName,
  slug,
  className = "",
  children,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    dragFree: false,
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

  if (!images?.length) return null;

  return (
    <div className={`relative w-full aspect-[3/1] rounded-lg overflow-hidden bg-slate-200 ${className}`}>
      <div className="overflow-hidden rounded-lg w-full h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {images.map((src, i) => (
            <div
              key={src}
              className="embla__slide min-w-0 flex-[0_0_100%] relative w-full h-full"
            >
              <Image
                src={src}
                alt={i === 0 ? `${neighborhoodName} — hero` : `${neighborhoodName} — image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === selectedIndex ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {children && (
        <div className="absolute inset-0 bg-black/25 flex items-end pointer-events-none">
          <div className="p-3 sm:p-4 text-white w-full">{children}</div>
        </div>
      )}
    </div>
  );
}
