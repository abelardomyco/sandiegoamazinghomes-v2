# SDAH debug report — `/market` dead space + Instagram freshness (2026-03-26)

## Issue 1 — Market page dead space

### Root causes (specific)

1. **Three-module rows inside a 4-column grid (`lg:grid-cols-4`)**  
   **Sections:** “Market interpretation” and “Action layer” each render **three** `MicroModule` siblings as direct grid children.  
   **Math:** 3 columns used + **1 empty column** on the same row → visible dead space to the right of the third tile.

2. **Two-module rows on `sm` (`sm:grid-cols-2`)**  
   The same three modules produced **two** modules on row 1 and **one** on row 2 occupying a **single** column → **one empty column** beside the third tile on `sm`.

3. **Previously fixed (Core signals):** “Rate & financing pulse” alone on a row when “Shift vs last check” is shown — addressed earlier with `col-span-full` on that tile.

### Fixes applied

- Added **`ModuleRow3`**: a **`col-span-full`** inner grid with  
  `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`  
  and **`[&>*:nth-child(3)]:sm:col-span-2`** so on `sm` the third module **spans the full second row** (no orphan column). On `lg`, three **equal** columns fill the row with **no fourth empty track**.
- Wrapped **only** the three modules under “Market interpretation” and “Action layer” in `<ModuleRow3>…</ModuleRow3>`.

### Files

- `app/market/page.js` — `ModuleRow3` + JSX wraps.

### Not changed

- Copy, module order (same three modules in the same order), and other sections’ structure.

---

## Issue 2 — Instagram feed not showing recent posts

### Data flow (actual)

1. **`getInstagramImagesForHome()`** (`app/page.js`)  
   - Calls **`fetchInstagramMediaForHome()`** in `lib/instagram-graph.js`.  
   - If that returns a **non-empty** array → **Instagram Graph API** (CDN `media_url` URLs, permalinks).  
   - If token missing or all API endpoints fail → **`getInstagramImagesFromFolder()`** (local files under `public/images/sdah photos to use/`).

2. **Caching / staleness**
   - **Homepage:** `export const revalidate = 300` (ISR, **5 minutes**). Previously **3600** (1 hour), so static generation could serve **stale** homepage HTML for up to an hour even after new files or API data.
   - **Graph `fetch`:** `next: { revalidate: 300 }` on the Instagram API request (was **3600**), aligning with the page.

3. **Folder fallback ordering (bug)**  
   - Sort was **filename-only** (`YYYY-MM-DD_…` + string compare).  
   - **Newly synced** files can have **older embedded dates** in the filename than older files, or **nonstandard names**, so **new files were not guaranteed first** in the carousel.

### Fixes applied

- **Folder sort:** Primary sort by **`statSync(…).mtimeMs`** (newest file on disk first), then existing **`compareInstagramFilenamesNewestFirst`** as tiebreaker.  
- **API sort:** Sort `body.data` by **`timestamp`** descending before mapping (defensive; API order can vary).  
- **Revalidate:** Homepage and Graph fetch **300s** instead of **3600s**.

### Why a sync “two hours ago” might still look old (before fix)

- **ISR 3600** delayed regeneration up to **1 hour** after deploy/sync.  
- **Filename-only sort** could rank a **new** file after an **older-named** file.  
- **No token:** API never runs; folder path only — mtime sort fixes ordering once the file exists.

### How to force a fresh view (safe)

- **Local dev:** Restart `npm run dev` or hard-refresh; dev mode does not use the same ISR as production.  
- **Production / preview:** Wait up to **5 minutes** after deploy for ISR, or redeploy / revalidate path if you use on-demand revalidation.  
- **API path:** Ensure **`INSTAGRAM_ACCESS_TOKEN`** (and if needed **`INSTAGRAM_USER_ID`**) in `.env.local` / hosting env; check server logs for `[instagram-graph]` warnings.  
- **Folder path:** Run `npm run sync:instagram` (respect Instagram rate limits / 429).

### Caveats

- **Stale amber banner** on the homepage still derives **“newest saved post”** from **filename date** (`dateKey`) when in folder fallback. If a new image has **no** `YYYY-MM-DD_` prefix, the banner may not reflect “newness” even though **mtime order** in the carousel is correct.  
- **Graph API** rate limits and token expiry still require valid Meta app + permissions.

---

## Files touched (summary)

| Area | File | Change |
|------|------|--------|
| Market layout | `app/market/page.js` | `ModuleRow3` wrapper for 3-tile rows |
| Instagram folder | `app/page.js` | `statSync` + mtime sort; `revalidate` 300 |
| Instagram API | `lib/instagram-graph.js` | timestamp sort; `revalidate` 120 (aligned with homepage ISR) |

---

## Remaining caveats

- Global homepage **`revalidate = 300`** increases regeneration frequency vs 3600 (acceptable tradeoff for fresher Instagram; adjust upward if needed).  
- **Market page** “Financial reality” uses **four** modules in the parent 4-col grid → no empty column on `lg`; no change required there.
