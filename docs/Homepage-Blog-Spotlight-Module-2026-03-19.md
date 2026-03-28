# Homepage: compact blog spotlight — 2026-03-19

## Goal

Add a **small** module on the homepage under the Contact / Rosamelia bio block with two blog links plus a path to the full blog index.

## Posts linked

1. [How to Find Good Value in San Diego Real Estate](/blog/how-to-find-good-value-in-san-diego-real-estate) — `how-to-find-good-value-in-san-diego-real-estate.md`
2. [San Diego Housing Market Forecast (2026)](/blog/san-diego-housing-market-forecast-2026) — `san-diego-housing-market-forecast-2026.md`
3. [Moving to San Diego: Everything You Need to Know](/blog/moving-to-san-diego-everything-you-need-to-know) — `moving-to-san-diego-everything-you-need-to-know.md`
4. [Best Neighborhoods in San Diego (2026 Guide)](/blog/best-neighborhoods-san-diego-2026) — `best-neighborhoods-san-diego-2026.md`

## Implementation

- **File:** `app/page.js`
- Constant `HOME_BLOG_SPOTLIGHT` holds slug + display title.
- UI: “From the blog” label, two `Link` rows, then “Read more posts on the blog →” to `/blog`.
- **Layout:** Beside the Rosamelia bio on `lg+` (flex row with `justify-between`); blog block is **left-aligned within its column** (`items-start`, `text-left`). Stacks below bio on smaller screens.
- **Spacing (info ↔ bio):** The large gap was mostly from a **50/50 grid**—the left column stayed half the row wide while photo+info only needed part of it, so the bio looked far away. Replaced with **`flex` on `lg+`**: left block is **content-width** (`lg:w-auto`); bio+blog uses **`flex-1`**. Horizontal gutter **`lg:gap-x-4`**. Photo to contact text: **`gap-3`**.
- **Vertical nudge:** Bio/blog column has **`lg:pt-6`** (~one line) so it sits slightly lower than the contact block on large screens.
- **Bio ↔ blog spacing:** Row uses **`lg:gap-x-10`** plus **`lg:ml-2`** on the blog block so the module sits a bit farther right from the bio text.
- Removed unused `getNeighborhoodIndex` import / variable (cleanup).

## Dev

Site runs on **http://localhost:3001** for SDAH in this workspace (`npm run dev` uses `scripts/dev-3001.js`).
