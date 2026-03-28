# Neighborhood area photos — `sdah photos to use/Areas`

**Date:** 2026-03-24

## What changed

- **`lib/neighborhood-images.js`**
  - After per-slug folders under `public/images/neighborhoods/{slug}/`, the resolver now uses curated PNGs in **`public/images/sdah photos to use/Areas/`** (or lowercase **`areas/`** if that is the folder on disk).
  - Slug → filename map matches client-provided titles (e.g. `la-jolla` → `la jolla.PNG`, `la jolla 2.PNG`, `la jolla house.PNG`).
  - `.png` / `.PNG` are allowed in neighborhood slug folders alongside jpg/webp.
  - Public URLs encode spaces in the path segment (`sdah%20photos%20to%20use`, encoded filenames).
- **`app/matches/page.js`**
  - Match cards use **`getNeighborhoodHeroPath(slug, region)`** so they stay in sync with `/neighborhoods` and area photos (not raw `heroImage` from `_index.json`).

## Adding a new area image

1. Drop the file in `public/images/sdah photos to use/Areas/` (name should match the area title, e.g. `my area.PNG`).
2. Add an entry to **`AREAS_FILES_BY_SLUG`** in `lib/neighborhood-images.js` for that neighborhood slug (array order = carousel order; first file = hero).

## Optional next step

- Update `content/neighborhoods/_index.json` `heroImage` fields to the resolved paths if you want the JSON to match runtime (not required for the UI; pages resolve dynamically).

## Build note

On Windows, `next build` can hit `EPERM` on `.next/trace`; that is an environment lock issue, not caused by this change. Lint passed on the touched files.
