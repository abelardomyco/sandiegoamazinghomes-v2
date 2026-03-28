"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const FALLBACK_IMAGE = "/images/placeholder-listing.svg";

function scoreEntries(scores, limit = 6) {
  if (!scores || typeof scores !== "object") return [];
  return Object.entries(scores)
    .filter(([, v]) => typeof v === "number")
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

export default function NeighborhoodMapCard({ neighborhood, onClose }) {
  const [imgErr, setImgErr] = useState(false);
  if (!neighborhood) return null;
  const { slug, name, heroImage, shortIntro, scores, region } = neighborhood;
  const imgSrc = imgErr || !heroImage || String(heroImage).toLowerCase().includes("cropped")
    ? FALLBACK_IMAGE
    : heroImage;
  const entries = scoreEntries(scores);

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden w-full max-w-sm flex flex-col max-h-[85vh]">
      <div className="relative flex-shrink-0 h-36 bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgErr(true)}
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-600 hover:bg-white hover:text-slate-800 shadow"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-900">{name}</h3>
        {region && (
          <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">{region}</p>
        )}
        {shortIntro && (
          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{shortIntro}</p>
        )}
        {entries.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-700 mb-1.5">Scores</p>
            <div className="flex flex-wrap gap-1.5">
              {entries.map(({ label, value }) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                  title={`${label}: ${value}/10`}
                >
                  {label} {value}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/neighborhoods/${slug}`}
            className="inline-flex items-center justify-center rounded-lg border-2 border-sd-600 bg-white text-sd-600 px-4 py-2.5 text-sm font-semibold hover:bg-sd-50 transition-colors"
          >
            Neighborhood page
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-lg bg-sd-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-sd-700 transition-colors"
          >
            Ask for listings
          </Link>
        </div>
      </div>
    </div>
  );
}
