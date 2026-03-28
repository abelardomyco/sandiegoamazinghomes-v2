# Neighborhoods: Order, Regional Images, Streamlined UI (2026-02-16)

## Display order

Neighborhoods are shown in this order (grid rows of 4, `lg:grid-cols-4`):

- **Row 1:** La Jolla, Del Mar, Rancho Santa Fe, Coronado  
- **Row 2:** Carlsbad, Solana Beach, Encinitas, Pacific Beach  
- **Row 3:** Carmel Valley, Little Italy, Mission Valley, Bonita  
- **Row 4:** Poway, Rancho del Rey, Otay, Eastlake  

La Mesa, North Park, and Chula Vista are no longer in the list. Order is fixed in `content/neighborhoods/_index.json`. Filtering (region/vibe) only hides cards; the order of the remaining cards is unchanged.

## Regional images

Cards currently use the shared SDAH banner as a fallback. To use **region-accurate** images:

1. Add images under **`public/images/neighborhoods/`** named by slug (e.g. `la-jolla.jpg`, `del-mar.jpg`, `coronado.jpg`, `north-park.jpg`, `encinitas.jpg`, `la-mesa.jpg`, `chula-vista.jpg`, `poway.jpg`).
2. In **`content/neighborhoods/_index.json`**, set each entry’s `heroImage` to the matching path, e.g. `"/images/neighborhoods/la-jolla.jpg"`.
3. See **`public/images/neighborhoods/README.md`** for naming and sizing.

The list component already uses `heroImage` from the index; if the file is missing, the app will 404 on that image, so either add the file or leave `heroImage` pointing at the banner until you have the asset.

## Streamlined UI

- **Filter bar:** Single compact row on a light background (`bg-slate-50/80`), smaller type, “Region” dropdown + “Vibe” tags + count (e.g. “8 areas”). No heavy card or heading.
- **Cards:** Thinner border (`border`), lighter hover (`hover:border-slate-300`, `hover:shadow-sm`), smaller padding (`p-3`), smaller text and vibe pills, shorter CTA (“View →”). Aspect ratio `5/3` for the image. Region badge smaller and less prominent.

Files changed: `content/neighborhoods/_index.json` (order), `components/neighborhoods/NeighborhoodList.js` (filter + cards).
