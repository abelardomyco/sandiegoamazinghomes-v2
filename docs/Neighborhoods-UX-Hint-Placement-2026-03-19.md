# Neighborhoods UX hint placement — 2026-03-19

## Goal

Keep the neighborhoods page compact by placing the helper hint under the vibe tags (within the filter bar), while keeping the “X areas” count on the right.

## Change

- Removed the hint line from `app/neighborhoods/page.js`.
- Added the hint beneath the vibe tag chips inside `components/neighborhoods/NeighborhoodList.js`, without adding a new section.

