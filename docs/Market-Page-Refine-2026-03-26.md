# `/market` — redundancy + variety refine (2026-03-26)

## Goal

Improve scanability and visual variety **without removing useful information**, adding bulky sections, charts, or long copy.

## What changed

- **Redundancy removed**
  - Dropped the overlapping **“What moved since last check”** tile (kept the stronger, cleaner version: **Shift vs last check** + **Price cuts & leverage**).
- **Variety retained**
  - Kept the mixed module types already in place: **CalloutModule**, **OneLineModule**, **QuickScenarioModule**, compact `MicroModule`s, and grouped flow labels.

## Current flow (grid)

1. **Core signals** — callout, inventory pulse (one-liner), shift vs last check, rate/financing pulse  
2. **Financial reality** — mortgage mini + quick scenario + income check + rent vs own  
3. **Market interpretation** — right now, price cuts/leverage, condo vs detached  
4. **Geographic insights** — heat map names, value pockets, coastal strip, South Bay  
5. **Action layer** — if you’re buying right now, what working buyers do, offers by price band

## Files touched

- `app/market/page.js` — removed the extra overlap tile, kept grouped structure.

