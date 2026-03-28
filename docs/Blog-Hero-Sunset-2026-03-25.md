# Blog index hero — sunset image (2026-03-25)

## Behavior

- **`/blog`** opens with a **16:9** hero (capped height ~`min(40–42vh, 22.5–26rem)`), full width within the site content column (`max-w-6xl`), rounded corners, light border.
- **Image:** Resolved at runtime from `public/images/sdah photos to use/` (**including subfolders**): any image whose name contains **`sunset`** (case-insensitive). If multiple match, the **most recently modified** file wins.
- **Overlay:** Subtle bottom-weighted dark gradient for legibility.
- **Heading on hero:** “San Diego Real Estate Insights” (small, white, no large blocks).
- **Fallback:** If no matching file exists, a **teal/slate gradient** fills the same frame (no broken image).

## Code

- `lib/blog-hero-image.js` — `getBlogSunsetHeroPath()`
- `app/blog/page.js` — hero + slightly tighter “Blog” title and one-line intro under it.

## Asset requirement

Add or rename your sunset photo so the filename includes `sunset` (e.g. `Pacific Beach sunset.webp`). See `public/images/sdah photos to use/README.md`.
