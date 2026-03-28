# Market page — compact mini-modules (2026-03-24)

**Update:** Layout, deduplication, and new module types (callout, quick scenario, section groups) are documented in **`docs/Market-Page-Variety-Restructure-2026-03-24.md`**.

## What changed

Added a **second layer** of small, decision-oriented modules on `/market` without removing existing `MicroModule` tiles or the `MarketPulseBar`. Visual language matches existing cards (`rounded-lg border`, tight typography).

## New pieces

| Module | Implementation |
|--------|----------------|
| Payment sketch (P&I) | `MarketMiniMortgage.js`: **uncontrolled** `type="number"` inputs + **refs** so **Calculate** reads live DOM values (avoids React controlled-number bugs). Stable `key` on `/market` when defaults change. |
| Interest rate pulse | `data/market-placeholder.json` → `mortgage.rate`, `mortgage.rateDirection` (`up` / `down` / `stable`) drives arrow + short label. |
| What this means right now | Two lines derived from `buyerAdvantage.score` (placeholder or live). |
| Market pace | Fast / Moderate / Slowing from `snapshot.daysOnMarket` bands. |
| Hot · balanced · flexible | Names from `getNeighborhoodHeatMetricsForMatrix()` strength buckets. |
| Income reality check | Median from snapshot/stat; rough income uses a simple ratio (~`median/5200` in $K)—**non-binding**, user must verify with a lender. |
| Negotiation signal | Tied to buyer-advantage score + short leverage line. |
| Rent vs buy (rough) | `rental.medianRent` + nearest `mortgage.paymentExamples` row; one-line fallback if data missing. |

## Files touched

- `app/market/page.js` — imports `getMortgageWidget`, `getRentalMarket`; prepends new grid cells.
- `components/market/MarketMiniMortgage.js` — new.

## Live data later

- Wire `mortgage.rate`, `rateDirection`, and optional copy from your rate feed or newsletter pipeline.
- Payment sketch stays client-side; no server round-trip required.
