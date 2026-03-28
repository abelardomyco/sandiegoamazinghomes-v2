# Neighborhood list — larger row thumbnails (2026-03-25)

## Change

- **`components/neighborhoods/NeighborhoodList.js`:** Horizontal list rows are taller/wider: hero thumb **144×96px** (mobile) → **176×112px** (`sm+`), up from 48×36px. Increased row padding (`py-4`/`py-5`), name size (`text-base` / `text-lg`), region, intro (`text-sm`, up to 3 lines on `sm+`), score chips, and “View →”. Image `sizes` updated for Next/Image. Subtle border/shadow on thumbs.

## Rationale

With real neighborhood photos available, the previous 12×9 thumbnails were too small; the row typography and score grid were scaled to match.
