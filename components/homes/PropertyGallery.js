"use client";

import { useState } from "react";
import Image from "next/image";

/** Curated placeholder when listing has no real photos. Never use site banner. */
const PLACEHOLDER_IMAGE = "/images/placeholder-listing.svg";

export default function PropertyGallery({ images = [], hasRealPhotos = true }) {
  const [index, setIndex] = useState(0);
  const list = images.length ? images : [PLACEHOLDER_IMAGE];
  const isPlaceholderOnly = !hasRealPhotos || list.every((src) => !src || src.includes("placeholder-listing"));

  return (
    <div className="space-y-2">
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-100">
        <Image
          src={list[index]}
          alt={isPlaceholderOnly ? "Photo not available" : "Property photo"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 672px"
          priority
        />
        {isPlaceholderOnly && (
          <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
            Photo not available
          </span>
        )}
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative flex-shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-colors ${
                i === index ? "border-sd-600" : "border-transparent hover:border-slate-300"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
