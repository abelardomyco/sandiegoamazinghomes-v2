# Market page — “Rate & financing pulse” empty right-side space (2026-03-26)

## Symptom

The **Rate & financing pulse** tile showed a large empty area to its **right**, as if the card were only using part of the row.

## Root cause (exact)

- **Layout:** `Core signals` uses a **4-column CSS grid** on `lg` (`lg:grid-cols-4`), **2 columns** on `sm` (`sm:grid-cols-2`).
- **First row of tiles (when “Shift vs last check” is shown):**
  - **Callout** → `sm:col-span-2` (2 cols on `lg`)
  - **OneLine** (Inventory pulse) → 1 col
  - **Shift vs last check** (`MicroModule`) → 1 col  
  → **2 + 1 + 1 = 4** columns — the row is full.
- **Second row:** only **Rate & financing pulse** (`MicroModule`) was placed, with **default span of 1 column**.
- That left **3 empty grid tracks** on the same row on `lg` (and **1 empty** on `sm`), which read as **dead space to the right** of the card.

When **Shift** was **hidden** (no `recentShiftLines`), the first row was **Callout (2) + OneLine (1) + Rate (1) = 4** — no orphan column, so the bug did not appear.

**Not caused by:** padding, `max-width` on the module, or a hidden DOM sibling. The grid simply had **unused columns** on the row where Rate sat alone.

## Fix

- **`MicroModule`** accepts an optional **`className`** (merged into the `<section>`).
- For **Rate & financing pulse** only, when **`recentShiftLines.length > 0`**, add **`col-span-full`** (`grid-column: 1 / -1`) so the tile **spans the full row** and no empty columns remain beside it.

**Files:** `app/market/page.js` only.

## Content / structure

- No copy changes, no reordering of other sections, no redesign.
