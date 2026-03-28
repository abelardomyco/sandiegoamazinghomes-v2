"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * Embla-based image carousel with arrows and dots.
 * @param {{ images: Array<{ path: string, caption?: string, href?: string, permalink?: string }>, title?: string, slidesToShow?: number, linkHref?: string, linkLabel?: string, aspectRatio?: string, enableLightbox?: boolean, viewAllLabel?: string }}
 * Per-slide link: `href` or `permalink` on an image overrides `linkHref` for that slide. Use `unoptimized` CDN URLs (e.g. Instagram API media_url).
 * `enableLightbox`: when true and a slide has no outbound link, clicking opens a full-screen viewer with prev/next (use for local gallery images).
 * `viewAllLabel`: when set with `enableLightbox`, shows a control that opens the lightbox at the first image (full gallery).
 */
function slideBasisLgClass(slidesToShow) {
  switch (slidesToShow) {
    case 1:
      return "lg:flex-[0_0_100%]";
    case 2:
      return "lg:flex-[0_0_50%]";
    case 3:
      return "lg:flex-[0_0_33.333%]";
    case 5:
      return "lg:flex-[0_0_20%]";
    case 4:
    default:
      return "lg:flex-[0_0_25%]";
  }
}

function slideSizesAttr(slidesToShow) {
  const lg = slidesToShow >= 5 ? "20vw" : slidesToShow === 4 ? "25vw" : slidesToShow === 3 ? "33vw" : "50vw";
  return `(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${lg}`;
}

export default function ImageCarousel({
  images,
  title,
  slidesToShow = 4,
  linkHref,
  linkLabel,
  aspectRatio = "aspect-square",
  className = "",
  enableLightbox = false,
  viewAllLabel = "",
}) {
  const lgSlideClass = slideBasisLgClass(slidesToShow);
  const imageSizes = slideSizesAttr(slidesToShow);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [portalReady, setPortalReady] = useState(false);
  const galleryPathKeyPrevRef = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    breakpoints: {
      "(max-width: 640px)": { slidesToScroll: 1 },
      "(min-width: 641px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: slidesToShow },
    },
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const n = images?.length ?? 0;
  const imagesPathKey = images.map((img) => img.path).join("|");
  /** With `loop: true`, do not disable arrows — Embla still allows stepping on mobile when fewer slides are visible than `slidesToShow`. */
  const navDisabled = n <= 1;

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const prev = galleryPathKeyPrevRef.current;
    if (prev === imagesPathKey) return;
    galleryPathKeyPrevRef.current = imagesPathKey;
    if (prev === null) return;
    emblaApi.reInit();
    onSelect();
  }, [emblaApi, imagesPathKey, onSelect]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i - 1 + n) % n);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % n);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, n]);

  if (!images?.length) {
    return (
      <div className={`rounded-xl border border-slate-200 bg-slate-50 p-8 text-center ${className}`}>
        {title && <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>}
        <p className="text-sm text-slate-500">No images to show.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {(title || linkHref) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {linkHref && linkLabel && (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-sd-600 hover:text-sd-700"
            >
              {linkLabel}
            </a>
          )}
        </div>
      )}

      {enableLightbox && viewAllLabel ? (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className="text-sm font-semibold text-sd-600 hover:text-sd-700 underline-offset-2 hover:underline"
            onClick={() => setLightboxIndex(0)}
          >
            {viewAllLabel}
          </button>
        </div>
      ) : null}

      <div className="relative">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100" ref={emblaRef}>
          <div className="embla__container flex touch-pan-x gap-3 p-2">
            {images.map((img, i) => {
              const slideHref = img.href || img.permalink || linkHref;
              const clickable = Boolean(slideHref);
              const openLightbox = enableLightbox && !clickable;
              const externalSrc = /^https?:\/\//i.test(img.path);
              return (
                <div
                  key={img.path}
                  className={`embla__slide min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] ${lgSlideClass}`}
                >
                  <div
                    className={`block relative w-full ${aspectRatio} rounded-lg overflow-hidden border border-slate-200 hover:border-sd-300 transition-colors ${
                      clickable || openLightbox ? "cursor-pointer" : ""
                    }`}
                  >
                    {clickable ? (
                      <a
                        href={slideHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-sd-500 focus:ring-inset rounded-lg"
                      >
                        <Image
                          src={img.path}
                          alt={img.caption || ""}
                          fill
                          className="object-cover"
                          sizes={imageSizes}
                          unoptimized={externalSrc}
                        />
                      </a>
                    ) : openLightbox ? (
                      <button
                        type="button"
                        className="absolute inset-0 z-[1] focus:outline-none focus:ring-2 focus:ring-sd-500 focus:ring-inset rounded-lg text-left"
                        onClick={() => setLightboxIndex(i)}
                        aria-label={img.caption ? `View larger: ${img.caption}` : `View image ${i + 1} larger`}
                      >
                        <Image
                          src={img.path}
                          alt={img.caption || `Gallery image ${i + 1}`}
                          fill
                          className="object-cover pointer-events-none"
                          sizes={imageSizes}
                          unoptimized={externalSrc}
                        />
                      </button>
                    ) : (
                      <Image
                        src={img.path}
                        alt={img.caption || ""}
                        fill
                        className="object-cover"
                        sizes={imageSizes}
                        unoptimized={externalSrc}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              disabled={navDisabled}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md ring-1 ring-slate-200/80 hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={navDisabled}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md ring-1 ring-slate-200/80 hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {n > 1 && (
          <div className="mt-3 space-y-2">
            <p className="text-center text-xs text-slate-500 tabular-nums">
              Slide {selectedIndex + 1} of {n} · drag or use arrows
            </p>
            <div className="flex max-w-full justify-center overflow-x-auto px-1 py-1 [scrollbar-width:thin]">
              <div className="flex min-h-6 items-center gap-1.5 px-2">
                {images.map((_, i) => (
                  <button
                    key={images[i].path}
                    type="button"
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`h-2 shrink-0 rounded-full transition-all ${
                      i === selectedIndex ? "w-6 bg-sd-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to slide ${i + 1} of ${n}`}
                    aria-current={i === selectedIndex ? "true" : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {enableLightbox &&
        portalReady &&
        lightboxIndex !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image viewer"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              aria-label="Close gallery"
              onClick={() => setLightboxIndex(null)}
            />
            <div
              className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex max-h-[min(85vh,820px)] w-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- lightbox needs native img for any static path */}
                <img
                  src={images[lightboxIndex].path}
                  alt={images[lightboxIndex].caption || `Gallery image ${lightboxIndex + 1}`}
                  className="max-h-[min(85vh,820px)] max-w-full object-contain shadow-2xl"
                />
              </div>
              <div className="flex w-full flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md ring-1 ring-slate-200 hover:bg-white"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => (i - 1 + n) % n);
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md ring-1 ring-slate-200 hover:bg-white"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => (i + 1) % n);
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <a
                  href={images[lightboxIndex].path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/95 px-3 py-2 text-sm font-medium text-sd-700 shadow-md ring-1 ring-slate-200 hover:bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open image in new tab
                </a>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md ring-1 ring-slate-200 hover:bg-white"
                  aria-label="Close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-center text-sm text-white/90">
                {lightboxIndex + 1} / {n} · Esc to close · arrow keys to browse
              </p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
