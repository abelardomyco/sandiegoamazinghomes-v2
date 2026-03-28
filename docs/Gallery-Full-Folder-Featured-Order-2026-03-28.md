# Homepage gallery: full folder, featured order, lightbox — 2026-03-28

## Behavior

1. **All images** in `public/images/sdah photos to use/gallery/` (image extensions only) load into the **same** carousel and **same** lightbox — not only five files.

2. **Featured order (left to right first):**
   - Open house  
   - sold 1  
   - sold coronado (`sold coronado.png` / `.jpg`)  
   - sold 4  
   - sold 3 (`sold 3.jpg`, `sold 3.png`, or `sold 3.2.png`)  

   Any **other** files in the folder follow, **A–Z** by filename, excluding duplicates already used in the featured list.

3. **UI**
   - Section shows **photo count** next to the Gallery heading.
   - **View all photos** opens the lightbox at the first image (full set; prev/next, keyboard, open in new tab).
   - **Dots** list every slide in a **horizontally scrollable** row (many photos).
   - **Slide X of N** helper text under the strip.
   - Lightbox uses **`z-[9999]`**, mounts portal after **`portalReady`** (client hydration).
   - Carousel track uses **`touch-pan-x`** so horizontal swipe works on touch devices.

4. **`ImageCarousel`**
   - **`viewAllLabel`** optional prop (used with **`enableLightbox`**).
   - **`reInit`** only when the gallery **`imagesPathKey`** changes after mount (avoids double-init glitches).
   - Slide **`key={img.path}`** for stable reconciliation.

## Files

- `app/page.js` — `getHomeGalleryImages()`, `HOME_GALLERY_FEATURED_SLOTS`, section header + count, `viewAllLabel`.
- `components/ui/ImageCarousel.js` — portal readiness, reInit ref guard, dots strip, `viewAllLabel` button, `touch-pan-x`.
