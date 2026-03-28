# Neighborhood images

Each neighborhood can have its own folder under `public/images/neighborhoods/` with multiple images. The **hero** image is used for list cards and detail page hero; the rest are available for galleries or inline use.

## Folder structure

Use one folder per neighborhood, named by **slug**:

```
public/images/neighborhoods/
  la-jolla/
    hero.jpg    ← used as hero (list + detail)
    coast.jpg
    village.jpg
    homes.jpg
  del-mar/
    hero.jpg
    beach.jpg
    village.jpg
    homes.jpg
  rancho-santa-fe/
    hero.jpg
  …
```

## Conventions

- **hero.jpg** — Main image; used on list cards and as the first (preloaded) slide in the detail carousel. Landscape, at least 600px wide; 16:10 or 5:3 works well.
- **lifestyle.jpg**, **homes.jpg**, **map.jpg** — Optional. When present, they appear in the detail-page Embla carousel after hero (order: hero → lifestyle → homes → map). Only `.jpg` files with these exact names are loaded; others in the folder are ignored.

## Wiring

- **Hero:** Set `heroImage` in `content/neighborhoods/_index.json` and in the neighborhood’s `.md` frontmatter to the hero path, e.g.  
  `"/images/neighborhoods/la-jolla/hero.jpg"`
- La Jolla and Del Mar are already pointed at `la-jolla/hero.jpg` and `del-mar/hero.jpg`. Add those files (and any extras) to the folders.
- Until the files exist, the app may show a fallback or 404; add the images to complete the setup.

## Image resolution order

1. **Neighborhood folder** — `public/images/neighborhoods/{slug}/` (e.g. hero.jpg).
2. **Region fallback** — `public/images/neighborhoods/_fallbacks/{region-slug}/` when the neighborhood has no folder.
3. **Global banner** — `/images/cropped-SDAH-web-banner.png` when neither exists.

## Area-specific fallbacks

Optional **`_fallbacks/`** folder for region-level images when a neighborhood has no folder:

- `_fallbacks/coastal/` — any .jpg or .webp (e.g. hero.jpg) used for Coastal neighborhoods without their own folder
- `_fallbacks/north-county/`, `_fallbacks/urban-core/`, `_fallbacks/south-bay/`, `_fallbacks/inland/` — same idea

If a neighborhood has no images and no region fallback, the app uses the global banner (`/images/cropped-SDAH-web-banner.png`).

## Current folders

- **la-jolla/** — hero.jpg, coast.jpg, village.jpg, homes.jpg (up to 5 images used in detail carousel)
- **del-mar/** — hero.jpg, beach.jpg, village.jpg, homes.jpg

Other neighborhoods use region fallback or global banner until you add a folder. Preferred filenames (in order): hero, lifestyle, homes, coast, village, map; any other .jpg/.webp in the folder are included up to 5 total.

**Finding missing assets:** Neighborhoods without a folder under `public/images/neighborhoods/{slug}/` (with at least `hero.jpg`) will show region fallback or the global banner. Compare `content/neighborhoods/_index.json` slugs to existing folders to see which still need curated images.
