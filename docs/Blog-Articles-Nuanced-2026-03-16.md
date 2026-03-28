# SDAH — Nuanced Blog Articles (2026-03-16)

**Project:** `sandiegoamazinghomes/`  
**Local URL:** http://localhost:3001/blog

## What was added

Three new blog articles were created to go beyond generic real estate advice and feel like local, insider-style guidance:

- **Why San Diego Real Estate Stays Expensive**
  - File: `content/blog/why-san-diego-real-estate-stays-expensive.md`
  - Route: `/blog/why-san-diego-real-estate-stays-expensive`

- **How to Find Good Value in San Diego Real Estate**
  - File: `content/blog/how-to-find-good-value-in-san-diego-real-estate.md`
  - Route: `/blog/how-to-find-good-value-in-san-diego-real-estate`

- **Common Mistakes Buyers Make in San Diego**
  - File: `content/blog/common-mistakes-buyers-make-in-san-diego.md`
  - Route: `/blog/common-mistakes-buyers-make-in-san-diego`

Each article challenges a common assumption, stays grounded in San Diego behavior (coastal vs inland, neighborhood-specific realities), and includes subtle internal links to `/market`, `/neighborhoods`, and `/homes`.

## What was updated

- **Blog index:** `content/blog/_list.json` — prepended the three new posts (newest first).
- **Frontmatter (colon titles):** Quoted `title` (and excerpts where needed) in:
  - `content/blog/moving-to-san-diego-everything-you-need-to-know.md`
  - `content/blog/relocating-to-san-diego.md`
  - `content/blog/first-time-buyer-san-diego.md`
  so `gray-matter` YAML parsing does not fail on colons in titles.

## Verification

- `/blog` loads and lists the new posts.
- Each new post route returns HTTP 200 on the dev server (port 3001).
