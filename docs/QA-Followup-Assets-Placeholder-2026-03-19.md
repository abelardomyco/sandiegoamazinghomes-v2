# QA follow-up: remove remaining missing image requests — 2026-03-19

## Goal

Prevent runtime 404s for missing brand/partner images in `public/images/` during the pre-migration QA pass.

## Change

- `app/page.js`: reconnected real hero + profile + Baja images from `public/images/`:
  - `/images/cropped-SDAH-web-banner.png`
  - `/images/Rosa-010.jpg`
  - `/images/la-escondida-vista.jpg`
  - `/images/baja-land-logo.png`
- `app/about/page.js`: reconnected real profile images from `public/images/`:
  - `/images/Rosa-010.jpg`
  - `/images/Abelardo-photo.jpg`

## Note

The previous placeholder swaps were a temporary stabilization measure while assets were missing. These assets are now present in `public/images/`, so the UI is reconnected to the real files.

