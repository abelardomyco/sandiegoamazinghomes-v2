# /market micro-modules upgrade — 2026-03-19

## Goal

Convert `/market` into a compact, high-density “live dashboard” made of small modules (1–4 lines, no charts, no fake precision).

## What changed

- **Removed bulky neighborhood grid**
  - Removed `MiniNeighborhoodGrid` usage from `/market`.

- **Replaced with micro modules**
  - Implemented a compact module card (`MicroModule`) and added these modules:
    - **Where it’s moving** (4–6 neighborhood lines with simple labels)
    - **What changed recently** (up to 4 short changes)
    - **Buyer window** (3 price-band labels)
    - **What smart buyers are doing** (up to 4 actions)
    - **Speed of market** (Fast / Medium / Slower, 1 line each)
    - **Where value is emerging** (3 area names)

- **Density + spacing**
  - Reduced vertical spacing and moved the module area into a tight grid layout.

## Files changed

- `app/market/page.js`

