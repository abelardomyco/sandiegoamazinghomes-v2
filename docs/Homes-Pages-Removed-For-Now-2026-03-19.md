# Homes pages removed (temporary) — 2026-03-19

## Goal

Temporarily remove the homes/listings UX (`/homes` and `/homes/[id]`) so the site stays focused on market + neighborhood guidance.

## What changed

- **Primary navigation**
  - `components/Header.js`: removed `/homes`
  - `components/Footer.js`: removed `/homes`

- **Sitemap**
  - `app/sitemap.js`: removed `/homes` and all `/homes/[id]` URLs from sitemap output

- **Routes disabled via redirect**
  - `app/homes/page.js`: redirects to `/`
  - `app/homes/[id]/page.js`: redirects to `/` (and returns no static params)

- **Internal links adjusted away from `/homes`**
  - Homepage and market/neighborhood CTAs that previously linked to `/homes?...` were changed to either:
    - link to the relevant neighborhood guide (`/neighborhoods/[slug]`), or
    - link to `/#contact` (“Ask for listings / Get matched listings”)

## Notes

- The listing components and data plumbing remain in the repo, but the **routes and primary entry points are disabled**.
- On Windows, `next build` can fail with an `EPERM` lock on `.next/trace` while the dev server is running. Stop the dev server (node) before building if needed.

