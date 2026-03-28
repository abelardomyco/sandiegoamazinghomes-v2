# Market Page Polish — Realism, Density, Signals (2026-02-17)

Focused pass on the San Diego Amazing Homes market page and related areas: no broad architecture changes. Goals were a more compact, useful, destination-worthy market page; cleaner market signals; better scoreboard; homes and neighborhood realism; and tighter spacing.

## Priority 1 — Market signals (replace charts)

- **Removed:** `MarketDashboardCharts` (three line charts: price per sq ft, days on market, monthly sales volume).
- **Added:** `MarketSignalCards` — five compact cards:
  1. **Price per sq ft** — value, direction (up/down), % change, green/red.
  2. **Days on market** — value, % change; green when improving (fewer days), red when worsening.
  3. **Monthly sales volume** — value, direction, % change.
  4. **Interest rate watch** — rate, optional direction, short note (structure ready for Fed/mortgage data).
  5. **Inventory pressure** — label (Seller’s market / Balanced / Cooling) + supporting metric (e.g. 2.8 mo supply).

- **Data:** `lib/market-data.js`: `getMarketSignals()`, `getInventoryPressure()`. `data/market-placeholder.json`: `mortgage.rateDirection`, `mortgage.rateNote`, `inventoryPressure`, `marketTakeaway`.

## Priority 2 — Compact intelligence sections

- **Market takeaway:** New `MarketTakeaway` component; 2–3 sentence summary from `marketTakeaway` or derived from Rosamelia insight.
- **Interest rate / Fed watch:** New `InterestRateFedWatch` — compact panel with rate, direction, short note, pre-approval CTA; structured for future official/structured rate data.
- **Hottest / Cooling / Best value:** Existing `CompactRankingPanels` kept; no change.
- **Buyer / Seller signal:** New `BuyerSellerSignal` — two small cards (buyer strength, seller strength, current market label); replaces `BuyerAdvantageMeter` on the page.
- **Featured homes:** Unchanged; compact row from `/homes`.
- **Rosamelia insight:** Tightened padding and button size; remains a high-trust block.

## Priority 3 — Neighborhood scoreboard

- Stronger badges (border, font-weight, tracking).
- Clearer row spacing (`py-2`), header border, hover state.
- Table remains: neighborhood (link), median price, price trend %, days on market, market strength (Hot / Balanced / Cooling).

## Priority 4 — Homes realism

- **Data:** Listings already use unified shape (address, city, neighborhood, beds, baths, sqft, property type, status, description, images). RentCast when `RENTCAST_API_KEY` is set; otherwise placeholder from `data/listings.json` with `dataSource` so UI can show “Live listings” vs “Sample data”.
- **ListingCard / detail page:** Already surface address, city, neighborhood, specs, type, status, description, images. Placeholder image when missing: `/images/placeholder-listing.svg` (no SDAH banner).
- No new routes or large modules.

## Priority 5 — Neighborhood image realism

- **Detail page:** When a neighborhood has no images in `public/images/neighborhoods/{slug}/`, the hero uses `getNeighborhoodHeroPath(slug, region)` so **region fallback** is used before the global banner.
- **List and map:** Already pass `heroImage` from `getNeighborhoodHeroPath(slug, region)`.
- **Docs:** `public/images/neighborhoods/README.md` updated with a note on finding missing assets (compare `content/neighborhoods/_index.json` slugs to existing folders).

## Priority 6 — Spacing and density

- Market page: already `space-y-1`; CTAs use `pt-1`.
- Rosamelia insight: reduced padding and CTA size.
- Homes page: `space-y-4` → `space-y-3`.

## Files touched

- **New:** `components/market/MarketSignalCards.js`, `MarketTakeaway.js`, `BuyerSellerSignal.js`, `InterestRateFedWatch.js`.
- **Removed from page:** `MarketDashboardCharts`, `BuyerAdvantageMeter`, `MortgageRateWidget` (rate folded into signal cards + Fed Watch).
- **Updated:** `app/market/page.js`, `lib/market-data.js`, `data/market-placeholder.json`, `components/market/MarketScoreboard.js`, `components/market/RosameliaInsight.js`, `app/homes/page.js`, `app/neighborhoods/[slug]/page.js`, `public/images/neighborhoods/README.md`.

## What was not done

- No newsletter-first logic on the market page.
- No new routes or large new modules.
- Charts component file `MarketDashboardCharts.js` remains in repo but is no longer imported; can be deleted in a later cleanup.
