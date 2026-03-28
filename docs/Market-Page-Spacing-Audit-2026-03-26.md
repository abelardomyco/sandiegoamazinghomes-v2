# Market page — spacing audit & fixes (2026-03-26)

## Problem (root causes)

Prior tweaks only reduced padding classes. The **main** visual issues came from:

### 1. CSS Grid default `align-items: stretch` (largest offender)

- **Where:** `app/market/page.js` — module grid (`grid grid-cols-* gap-*`).
- **Effect:** Every grid item in a row **stretches to the height of the tallest cell** in that row. Short modules (e.g. **OneLineModule**, 2-line **MicroModule**) sat in **tall boxes** with empty space below the text, so tiles looked “disconnected” and floating.
- **Fix:** `items-start` + `content-start` + `[grid-auto-rows:min-content]` so rows size to content; each module also uses `self-start h-auto min-h-0 w-full` so cards stay content-height.

### 2. Site-wide main padding (`py-10`)

- **Where:** `app/layout.js` — wrapper around all pages: `max-w-6xl … py-10`.
- **Effect:** **40px** top + bottom padding before any page content — heavy for a dense dashboard.
- **Fix:** `py-6 sm:py-8` (24px / 32px) — still readable, less vertical waste on `/market` and elsewhere.

### 3. Redundant / stack-inducing wrappers

- **MicroModule:** Extra `<div>` around the `h2` added a flex box with no layout benefit — removed; `h2` is direct child with `m-0`.

### 4. Unnormalized typography margins

- **`p` / `h2` / `h1`:** User-agent / inheritance can leave implicit margins; market modules now use explicit **`m-0`** on headings and helper lines where needed so spacing comes only from intentional `mt-*` / `gap-*`.

### 5. List modules

- **Where:** `MicroModule` / `QuickScenarioModule` `<ul>` / `<li>`.
- **Fix:** `list-none m-0 p-0`, tight `space-y-px` or `space-y-px` between lines, `leading-tight`, slightly unified body size (`text-[13px]` where it improved alignment with pulse density).

### 6. Vertical rhythm between page sections

- **Where:** Root of market page used `space-y-1.5` between header, pulse, grid, footer.
- **Fix:** `flex flex-col gap-1` for a single, compact stack (no stacked `space-y` + grid `gap` confusion).

### 7. Grid gap asymmetry

- **Where:** Uniform `gap-1.5` applied to rows and columns.
- **Fix:** `gap-x-1.5 gap-y-1` — **tighter row spacing** than column spacing so horizontal bands read as denser.

### 8. Section labels

- **Where:** `SectionLabel` full-width rows.
- **Fix:** Explicit `m-0` on label text; `pb-0.5` for a thin rule; `pt-1.5 first:pt-0` so first group doesn’t double-up top space.

### 9. Pulse bar vs tiles

- **Where:** `MarketPulseBar.js`.
- **Fix:** `w-full min-w-0`, slightly reduced vertical padding (`py-1`) so visual weight matches compact cards.

### 10. Mortgage mini

- **Where:** `MarketMiniMortgage.js`.
- **Fix:** Same card contract as other modules: `self-start`, `min-h-0`, `m-0` on title/helper line; input grid `gap-1`, `mt-0.5` on field block.

---

## Files changed

| File | What changed |
|------|----------------|
| `app/layout.js` | `py-10` → `py-6 sm:py-8` on main content wrapper |
| `app/market/page.js` | Grid: `items-start`, row/column gaps, `grid-auto-rows`, module `m-0` / `self-start`; Micro/Callout/OneLine/QuickScenario tightened; page shell `flex flex-col gap-1` |
| `components/market/MarketPulseBar.js` | `w-full min-w-0`, `py-1` |
| `components/market/MarketMiniMortgage.js` | Card alignment classes, `m-0` headings, tighter input grid gap |

---

## What we did *not* change

- Copy / data strings, module order, or feature set (per request).

---

## Main offenders (summary)

1. **Grid stretch** — made short modules look like tall empty cards.  
2. **Root `py-10`** — added large vertical margin before the market UI.  
3. **Implicit margins** on headings/paragraphs inside cards — fixed with `m-0` + explicit rhythm.

---

## Related

- Earlier padding-only pass: `docs/Market-Page-Tight-Layout-2026-03-26.md` (superseded for diagnosis; this audit doc is authoritative for *why* spacing was wrong).
