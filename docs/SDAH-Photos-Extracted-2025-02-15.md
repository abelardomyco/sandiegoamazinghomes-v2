# All images extracted — website + Instagram (2025-02-15)

## Location

**Folder:** `public/images/sdah photos to use/`

### 1. Website (sandiegoamazinghomes.com)

All images from the homepage and About Us page were downloaded (excluding plugin placeholders).

### 2. Instagram @sandiegoamazinghomes

Images from the public profile were downloaded using **Instaloader** (Python). Filenames are date-based (e.g. `2022-07-02_19-51-12_UTC.jpg`, `2019-11-10_22-00-55_UTC_1.jpg`). Instaloader metadata (`.json.xz`, `.txt`) was removed; only image files remain. Total ~74 image files in the folder (14 from site + ~60 from Instagram).

## Files (14)

- **cropped-SDAH-web-banner.png** — Site banner
- **Rosa-010.jpg** — Rosamelia (full size)
- **Rosa-010-150x150.jpg** — Rosamelia thumbnail
- **Rosa-010-767x1024.jpg** — Rosamelia portrait
- **DSC_0625_2-1024x536.jpg** — Property/listing
- **DSC_0634-1024x695.jpg** — Property/listing
- **Screen-Shot-2021-10-01-at-1.48.59-PM-1024x681.png**
- **Screen-Shot-2021-10-01-at-1.49.14-PM-1024x640.png**
- **Screen-Shot-2025-01-03-at-6.29.39-PM-1024x542.png**
- **Screen-Shot-2025-01-03-at-7.10.57-PM-1024x142.png**
- **39fde8e6-1641-4b70-8ccf-2e29c0d240c1.jpg**
- **f584dfa5-e594-4944-beb8-c554385bbded.jpg**
- **Abelardo-photo-686x1024-1.jpeg** — About page

## Usage in the app

Reference as `/images/sdah photos to use/<filename>` (e.g. in `next/image` or `content/_meta.json`). Spaces in the path are valid; Next.js serves them. If you need a URL-encoded path, use `%20` for the space.

## Not included

- `instagram-feed-pro/img/placeholder.png` — generic placeholder from the Instagram plugin; not actual site content.
