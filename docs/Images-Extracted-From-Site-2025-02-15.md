# Images extracted from sandiegoamazinghomes.com (2025-02-15)

## Source

Images were taken from the live WordPress site http://sandiegoamazinghomes.com/ and saved into this project so the Next.js site uses the same visuals.

## Files in `public/images/`

| File | Source URL | Use in project |
|------|------------|----------------|
| cropped-SDAH-web-banner.png | `/wp-content/uploads/2024/04/cropped-SDAH-web-banner.png` | Home hero (top of homepage) |
| Rosa-010-150x150.jpg | `/wp-content/uploads/2023/06/Rosa-010-150x150.jpg` | Contact block on home (agent photo) |
| Rosa-010.jpg | `/wp-content/uploads/2023/06/Rosa-010.jpg` | About page (agent photo) |
| Screen-Shot-2025-01-03-hero.png | `/wp-content/uploads/2025/01/Screen-Shot-2025-01-03-at-6.29.39-PM-1024x542.png` | “About Rosamelia” section on home |

## Where they appear

- **Home (`app/page.js`):** Banner hero at top; contact section (left: Rosamelia photo + Royal California under it; right: contact info + “Rosamelia knows San Diego” bio); Follow on Instagram gallery (grid from `_meta.json` instagram.images); Gallery section (grid from `_meta.json` siteGallery).
- **About (`app/about/page.js`):** Full-size agent photo beside the bio.
- **Metadata:** Paths and usage in `content/_meta.json` under `images`; `instagram.images` and `siteGallery` drive the two galleries.

## Notes

- **Royal California logo:** Used only once on the site—under Rosamelia’s photo in the contact section. Source: `public/images/sdah photos to use/royal california real estate.png`. Not used in footer, about, or anywhere else.
- **Instagram gallery:** Uses images from `content/_meta.json` → `instagram.images` (currently the same site images; replace with real @sandiegoamazinghomes feed when available).
- **Site gallery:** Uses `content/_meta.json` → `siteGallery`.
- Header remains text-only (“San Diego Amazing Homes”); the banner is used as the hero, not as a logo.
