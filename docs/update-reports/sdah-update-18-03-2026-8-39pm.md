# SDAH Update 18-03-2026 8:39pm

**Date:** 2026-03-18, 8:39pm (local)  
**Site:** San Diego Amazing Homes (SDAH)  
**Project path:** `Websites/sandiegoamazinghomes/`

---

## Summary

This update removed map + homes pages for now, rebuilt the neighborhood content system to feel human/local, tightened the market page into micro-modules, and cleaned up a handful of UX/trust issues (filters, blog, contact email, hero banner).

---

## 1) Routes removed/disabled (for now)

- **Map routes disabled**
  - `/map` → redirects to `/`
  - `/neighborhoods/map` → redirects to `/neighborhoods`
  - `/market/heat-map` → redirects to `/market`
  - Nav links removed from header/footer and sitemap entries removed.

- **Homes routes disabled**
  - `/homes` → redirects to `/`
  - `/homes/[id]` → redirects to `/`
  - “Homes” removed from header/footer and sitemap entries removed.

---

## 2) /market rebuilt into a signal board

- Replaced bulky sections with compact **micro modules** (1–4 lines, no charts, no fake precision).
- Removed the larger neighborhood grid and restructured the page into a tight, scan-fast layout.

Doc: `docs/Market-Page-Micro-Modules-Upgrade-2026-03-19.md`

---

## 3) Neighborhood system rebuilt (content + index)

- Rewrote/created neighborhood pages under `content/neighborhoods/` to follow the new mandatory structure:
  - Opening (no header) → The Feel → Housing Reality → Who It’s For → Tradeoffs → Local Insight → Internal Links
- Added `heroImageQuery` + `heroAlt` frontmatter fields so hero images can be sourced intentionally (no listing photos).
- Updated `content/neighborhoods/_index.json` to match the rebuilt set.
- Added `/contact` route as redirect to `/#contact` so the required internal link works.

Doc: `docs/Neighborhood-System-Rebuild-2026-03-19.md`

---

## 4) Neighborhood filters fixed (trust)

- Reclassified neighborhoods with **multi-category** tags (Village / Artsy / Coastal / Urban / Suburban / Value / Luxury).
- Added a small UX line above the list:  
  “Click any neighborhood to see what it’s actually like to live there.”

Doc: `docs/Neighborhood-Categories-And-UX-2026-03-19.md`

---

## 5) Blog cleanup

- Removed the featured “Latest” module from `/blog` (list-only).

Doc: `docs/Blog-Remove-Latest-Module-2026-03-19.md`

---

## 6) Contact + about tweaks

- Updated Rosamelia email everywhere to: **`amazinghsd@gmail.com`**
- About page: Abelardo bio wording updated to “He built and manages the website, …”

Docs:
- `docs/Rosamelia-Email-Update-2026-03-19.md`
- `docs/Abelardo-Bio-Wording-2026-03-19.md`

---

## 7) Homepage hero + layout width

- Homepage hero banner now shows the **full image** (no crop).
- Site container widened slightly (`max-w-4xl` → `max-w-6xl`) to feel less cramped.

Docs:
- `docs/Homepage-Hero-Show-Full-Image-2026-03-19.md`
- `docs/Layout-Width-Increase-2026-03-19.md`

---

## Dev server

- SDAH runs at `http://localhost:3001` via `npm run dev`.

