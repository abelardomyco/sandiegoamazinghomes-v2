# Homepage gallery: lightbox + carousel controls — 2026-03-28

## Problem

- Gallery slides had **no links**, so clicks did nothing.
- Prev/next arrows only rendered when `images.length > slidesToShow`, so with **5 images** and **`slidesToShow={5}`** the arrows **never appeared**.
- Arrows used **`disabled={!canScrollPrev}`** / **`canScrollNext`**, which could block clicks even with **`loop: true`** in some cases.

## Changes

### `components/ui/ImageCarousel.js`

- **`enableLightbox` prop** (default `false`): when set and a slide has no outbound URL, the slide is a **button** that opens a **full-screen viewer** (`createPortal` to `document.body`) with **prev/next**, **close**, **Esc**, **arrow keys**, and **“Open image in new tab”**.
- **Arrows** show when **`images.length > 1`** (not tied to `slidesToShow`).
- **Arrow `disabled`** only when **`n <= 1`** (loop remains enabled for Embla).
- **`z-20`** and **`ring`** on arrow buttons for visibility/clickability.
- **`reInit`** listener so Embla syncs after resize.

### `app/page.js`

- Homepage **Gallery** `ImageCarousel` passes **`enableLightbox`**.

## Notes

- On very wide viewports where **all slides fit**, Embla may not visibly scroll the strip; users still get **lightbox**, **dots**, and **touch/drag** where applicable.
