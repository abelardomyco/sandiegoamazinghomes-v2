# SDAH refinements: expanded neighborhood tags + denser /market modules — 2026-03-19

## Goal

1) Expand neighborhood tags to a broader, human-friendly set (still controlled).  
2) Increase `/market` signal density with more compact mini-modules, without reintroducing bulky sections.

## Neighborhood tags

- Updated `content/neighborhoods/_index.json` so `vibeTags` uses the approved tag set:
  - Coastal, Village, Urban, Suburban, Luxury, Value, Walkable, Family-friendly, Quiet, Foodie, Artsy, Scenic, Active, Central, Up-and-coming
- Applied multiple tags per neighborhood (examples: La Jolla includes Coastal/Luxury/Village/Scenic/Artsy, North Park includes Urban/Walkable/Foodie/Artsy/Active, etc.).

## /market mini-modules

- Kept the micro-module signal board layout and added additional compact modules (1–3 lines):
  - Rate Watch
  - Under $1M
  - Luxury Watch
  - Coastal Pressure
  - South Bay Signal
  - Condo vs House
  - Price Cuts
  - Best Value Right Now
- Updated the module grid to `lg:grid-cols-4` for tighter, more dashboard-like density.

## Files changed

- `content/neighborhoods/_index.json`
- `app/market/page.js`

