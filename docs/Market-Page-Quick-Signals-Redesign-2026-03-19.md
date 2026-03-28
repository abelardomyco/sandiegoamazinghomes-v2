# /market quick-signals redesign (2026-03-19)

## Goal

Make `/market` feel **alive, fast, and glanceable** (5–10 seconds), without relying on fake-precise placeholder data:

- a compact pulse strip (inline signals)
- 3–4 micro snapshot cards (1–2 lines)
- a mini neighborhood grid (labels only)
- rotating micro-insights for “updated” energy
- no charts; no heavy tables; no fake precision

## What changed

### Market Pulse (top strip)

A horizontal strip of 4–5 compact signals (arrows + short labels):

- Rates
- Prices (direction + “est.” range)
- Inventory
- Speed
- Buyer power

Component: `components/market/MarketPulseBar.js`

### Market Snapshot cards

3–4 small cards (1–2 lines) that read like a quick “what’s true right now” layer.

Component: `components/market/MarketSnapshotCards.js`

### Mini neighborhood grid

Compact grid of neighborhoods with a single label each (no %).

Component: `components/market/MiniNeighborhoodGrid.js`

### Heat map simplification

Removed multiple metric toggles and replaced with **one unified composite** strength heat map.
Tooltip now includes a simple breakdown (price trend, inventory, speed, reductions).

Updated: `components/market/MarketHeatMap.js` and copy in `app/market/heat-map/page.js`.

**Note:** The heat map preview was removed from `/market` because without a Mapbox token it collapses into a low-signal table (many rows showing ~50%). The full-screen heat map page remains available at `/market/heat-map`.

### Micro insights (rotating)

Rotating “micro insights” (short, sharp) to give the page a dynamic feel without pretending precision.

Component: `components/market/RotatingInsights.js`

## Files changed

- `app/market/page.js`
- `app/market/heat-map/page.js`
- `components/market/MarketHeatMap.js`
- `components/market/MarketPulseBar.js` (new)
- `components/market/MarketSnapshotCards.js` (new)
- `components/market/MiniNeighborhoodGrid.js` (new)
- `components/market/RotatingInsights.js` (new)

## Notes

- No “data science dashboard” UI; this is meant to read like **real estate insight at a glance**.
- This design intentionally avoids “fake precision” (no signal percentages on `/market`).
- Removed bottom-of-page conversion modules on `/market` (new listings alert, Ask Rosamelia, and CTA button row) to keep the page purely insight-driven and high-trust.

