# Neighborhoods filter bar: single-line hint — 2026-03-19

## Goal

Keep the neighborhoods filter bar compact by putting:

- hint text on the **far left**
- “X areas” count on the **far right**

…on the **same line** (no second line).

## Change

- `components/neighborhoods/NeighborhoodList.js`: moved the hint + count into a single `justify-between` row under the vibe chips (hint uses `truncate` so it won’t wrap).

