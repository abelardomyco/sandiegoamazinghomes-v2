# Neighborhood scores and streamlined areas (2026-02-16)

## Scores

Each neighborhood in `content/neighborhoods/_index.json` has a **`scores`** object: dimension names (e.g. Upscale, Walkable, Cost-friendly, Family-friendly, Coastal, Foodie, Artsy, Urban, Chill) with values 1–10. These reflect what the area is strong at and what it’s less strong at.

Examples (from your direction):

- **Rancho Santa Fe:** Upscale 10, Chill 10, Family-friendly 8; weak on Walkable 3, Cost-friendly 1.
- **La Jolla:** strong on Coastal, Upscale, Walkable, Foodie, Family-friendly, Artsy; weaker on Cost-friendly.
- **Coronado:** same general profile as La Jolla (coastal, upscale, walkable, family-friendly, foodie, artsy); less cost-friendly.
- **Otay:** strong Cost-friendly, Chill, Foodie; weaker Upscale, Walkable.
- **Little Italy:** strong Urban, Foodie, Walkable, Artsy; weaker Cost-friendly, Family-friendly.

The list page shows **Strong:** (top 3 dimensions) and **Less:** (bottom 2). The detail **Liveability snapshot** shows **Strong:** and **Less:** with numeric scores (top 4 and bottom 3).

## Streamlined UI

- **List cards:** Smaller cards (gap-3, aspect 4/3, p-2.5), title + one line “Strong: … · Less: …” (or shortIntro if no scores). Vibe tags removed from list card to keep it compact.
- **Detail page:** Shorter hero (aspect 3/1), smaller prose (prose-sm), compact Liveability snapshot (single box with vibe tags, Strong/Less scores, two short blurbs). Next steps box reduced (smaller heading, one line of copy, smaller buttons).
- **LiveabilityScorecard:** Replaced the previous 5-card grid with one compact block: vibe tags, Strong/Less scores with numbers, then two text blurbs (vibe + value).

## Files

- `content/neighborhoods/_index.json` — added `scores` for all 16 neighborhoods.
- `components/neighborhoods/NeighborhoodList.js` — `scoreSummary()` helper, card shows Strong/Less from scores.
- `components/neighborhoods/LiveabilityScorecard.js` — rewritten for scores + compact layout.
- `app/neighborhoods/[slug]/page.js` — smaller hero, prose, and next steps.
