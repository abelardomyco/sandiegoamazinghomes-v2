# Matchmaker as Lightweight Assistant (Floating Widget)

**Date:** 2026-02-17

## Summary

The `/matchmaker` page was replaced with a lightweight 3-question assistant available as:

1. **Floating widget** — A FAB (compass icon) on all pages except `/matchmaker` opens a panel with the same flow.
2. **Inline on `/matchmaker`** — The full-page form was removed; the page now shows the same 3-step flow inline.

## Flow

- **Step 1:** Budget (Under $500k … $2M+).
- **Step 2:** Lifestyle — multi-select tags (Coastal, Urban, Walkable, Foodie, Upscale, Chill, Family-friendly, Surf, Artsy).
- **Step 3:** Commute tolerance (Minimal, Short, Medium, Flexible).

**Output:** Top 3 neighborhoods with fit percentage and a single CTA: **“See homes in this area”** → `/homes?neighborhoods=slug1,slug2,slug3`.

## Files Changed / Added

- **`components/matchmaker/MatchmakerWidget.js`** — New: 3-step flow, `matchNeighborhoods()` scoring, results with “See homes in this area” link. Supports `mode="floating"` (FAB + overlay) or `mode="inline"` (for `/matchmaker` page).
- **`components/matchmaker/MatchmakerFloat.js`** — New: Client wrapper that renders the floating widget only when `pathname !== "/matchmaker"`.
- **`app/matchmaker/page.js`** — Now renders `MatchmakerWidget` with `mode="inline"` and `defaultOpen`; metadata updated.
- **`app/layout.js`** — Loads `getNeighborhoodIndex()`, renders `MatchmakerFloat` with neighborhoods (floating widget site-wide except on `/matchmaker`).
- **`lib/listings.js`** — `getListings(filters)` now accepts `neighborhoods` (array of slugs); when set, listings are filtered to those neighborhoods.
- **`app/homes/page.js`** — Reads `searchParams.neighborhoods` (comma-separated slugs), passes to `getListings({ neighborhoods })`, shows “Showing homes in: …” when present.
- **`app/map/page.js`** — Same `neighborhoods` query param support so `/map?neighborhoods=...` shows filtered listings on the map.

## Backward Compatibility

- **`/matches?slugs=...&scores=...`** — Still works; no changes to `app/matches/page.js`.
- **`MatchmakerForm.js`** — Unused by the new flow but left in the codebase; can be removed later if desired.

## UX

- Floating: bottom-right FAB; clicking opens the panel over the page; close button and “Start over” on results.
- Inline: progress bar, Back/Next and “See matches” on step 3; results show top 3 + “See homes in this area” and “Start over”.
