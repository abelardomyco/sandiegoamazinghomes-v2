# San Diego Amazing Homes

Next.js site for **San Diego Amazing Homes** — real estate in San Diego County with Rosamelia Lopez-Platt, REALTOR® (Royal California Real Estate).

- **Live reference:** [sandiegoamazinghomes.com](http://sandiegoamazinghomes.com/)
- **Repo:** [github.com/abelardomyco/sandiegoamazinghomes](https://github.com/abelardomyco/sandiegoamazinghomes)

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Content from `content/*.md` and `content/_meta.json`

## Run locally

```bash
cd sandiegoamazinghomes
npm install
npm run dev
```

Site runs at **http://localhost:3001** (port 3001; Baja Land uses 3000. See `.cursor/rules/dev-server.mdc`.)

## Structure

- `app/` — layout, home page, about page
- `components/` — Header, Footer
- `content/` — homepage.md, about.md, _meta.json (copy and images reference)
- `public/images/` — hero, contact photo; `public/images/sdah photos to use/` — Instagram + gallery images (see below)

## Pages

- **Home** (`/`) — welcome, CTAs (looking for a house / list your home), contact, Instagram, partner link to The Baja Land Company
- **About Us** (`/about`) — agent bio and contact

No mock data; contact and partner URLs are real.

## Instagram & Gallery (sdah photos to use)

- **Instagram section:** Shows only images pulled from **@sandiegoamazinghomes** (date-stamped files in `public/images/sdah photos to use/`).
- **Gallery section:** Shows all images in that folder except Rosamelia (used only in Contact).
- **Keep in sync:** Prefer **`INSTAGRAM_ACCESS_TOKEN`** in `.env.local` so the homepage carousel pulls the latest posts from Meta’s API (see `docs/Instagram-Module-Live-Feed-2026-03-24.md`). Or run `npm run sync:instagram` (Python + `pip install instaloader`; Instagram may rate-limit). See also `docs/Instagram-Gallery-Source-And-Sync-2025-02-15.md`.

## Sync to GitHub (continuous push to main)

- **Quick sync:** Run **Tasks: Run Task** → **Sync to main (push)** (or `npm run sync` in terminal). Stages all changes, commits, and pushes to `main`.
- **Custom message:** `npm run sync -- "your commit message"`
- See `docs/Git-Sync-GitHub-2025-02-15.md` for details.
