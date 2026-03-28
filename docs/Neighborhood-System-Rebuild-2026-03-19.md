# Neighborhood system rebuild (content) — 2026-03-19

## Goal

Rebuild neighborhood pages so they feel **human, local, grounded**, and **not AI-generated**, with a mandatory section structure and distinct voice per neighborhood.

## What changed

### Neighborhood markdown pages

Updated/created neighborhood pages under `content/neighborhoods/` to follow this structure:

1) Opening paragraph (no header)  
2) **The Feel** (2–3 short paragraphs)  
3) **Housing Reality** (types + general ranges, no fake precision)  
4) **Who It’s For** (good fit / not ideal)  
5) **Tradeoffs** (honest)  
6) **Local Insight** (one strong paragraph)  
7) **Internal Links** (always include `/market`, `/homes`, `/matchmaker`, `/contact`)

Also added a `heroImageQuery` + `heroAlt` in frontmatter for each neighborhood to support sourcing a relevant hero image later.

### Neighborhood index

Updated `content/neighborhoods/_index.json` to reflect the rebuilt neighborhood set and to keep the list aligned with the new pages.

### Contact route (for required internal link)

Added `app/contact/page.js` as a simple redirect to `/#contact` so the required `/contact` link is valid.

## Files touched (high level)

- `content/neighborhoods/_index.json`
- `content/neighborhoods/*.md` (updated/created)
- `app/contact/page.js`

## Notes / next steps

- The site’s hero image system prefers local images at `public/images/neighborhoods/{slug}/hero.jpg`. The new pages include **search queries** (`heroImageQuery`) so real, neighborhood-specific hero images can be sourced and added without using listing photos.
- `/homes` is referenced as required by internal links, even if the homes routes are currently disabled elsewhere in the project.

