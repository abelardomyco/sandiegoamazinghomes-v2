# Homepage: gallery folder, order, 5-up, Instagram below — 2026-03-27

## What changed

1. **Section order** — On `/`, **Gallery** now appears **above** **Follow on Instagram** (`app/page.js`).

2. **Gallery source** — No longer scans all of `public/images/sdah photos to use/`. The homepage gallery uses a **fixed list** of files under **`public/images/sdah photos to use/gallery/`**, in this **left-to-right** order: **Open house** → **sold 1** → **sold 2** → **sold 3** → **sold 4**.  
   - Filename resolution: `sold 4.jpg` or `sold 4.png`; `sold 3.jpg` or `sold 3.png`; `sold 2.png`; `sold 1.png`; `Open house.png`.  
   - Missing files are skipped; empty folder shows a short message pointing at the gallery path.

3. **Carousel** — Gallery `ImageCarousel` uses **`slidesToShow={5}`**. **`components/ui/ImageCarousel.js`** maps `slidesToShow` to **`lg:flex-[0_0_20%]`** and updates **`sizes`** for five-across on large viewports.

## Files touched

- `app/page.js` — `getHomepageGalleryImages()`, section swap, gallery props.  
- `components/ui/ImageCarousel.js` — `slideBasisLgClass`, `slideSizesAttr`, dynamic slide width / `sizes`.

## Next steps

- Ensure the five assets exist in `gallery/` with the expected names (or adjust `HOME_GALLERY_SLOTS` in `app/page.js`).  
- Re-run `npm run build` locally if `.next` EPERM errors occur (close processes locking `.next`).
