# `/market` — variety, dedup, flow (2026-03-24)

## Goal

Improve scanability and contrast between modules without removing useful copy, adding bulky sections, or charts.

## What changed (`app/market/page.js`)

### New in-file module types

- **CalloutModule** — 1–2 bold takeaway lines, slightly heavier card (`sm:col-span-2`).
- **OneLineModule** — kicker + single line (e.g. inventory pulse).
- **QuickScenarioModule** — same rounded median price, **10% / 20% / 30%** down → estimated monthly principal and interest (mono list).
- **SectionLabel** — full-width row labels for five groups.

### Redundancy merged (ideas kept, duplicate tiles removed)

- **Pace / speed / where it is moving** — consolidated into **Heat map (names)** (`hotBalancedFlexible`) plus **Speed** on `MarketPulseBar`.
- **Negotiation / buyer window / rate-only tiles** — folded into **Offers by price band** (`offerBands`, includes under-$1M and $1.5M+ lines), **Price cuts and leverage**, and the **callout** second line by buyer-advantage score.
- **Value** — **Value pockets** merges best-value / emerging-value style signals.

### Recent shift wording

- **`recentShiftLines`** uses `activeListingsDelta` / `medianPriceDelta` with **prior reading** language (no fake last-week precision if data is snapshot-based).
- Rendered as a single **MicroModule** titled **Recent shift vs prior reading** (avoids a second one-line tile with an empty kicker).

### Flow (section order)

1. **Core signals** — callout, inventory one-liner, shift vs last check (if any), rate and financing pulse
2. **Financial reality** — `MarketMiniMortgage`, quick scenario, income check, rent vs own
3. **Market interpretation** — Right now, what moved since last check, price cuts, condo vs detached
4. **Geographic insights** — heat map names, value pockets, coastal, South Bay
5. **Action layer** — If you’re buying right now, what working buyers do, offers by price band

### Follow-up (same day)

- Section labels aligned to the five requested bands; shift module title **Shift vs last check** (still no fake weekly precision).
- Tone pass: varied “prior reading / snapshot” phrasing; inventory one-liner and lead callout nudged toward clearer, less templated rhythm.

## Related doc

- Earlier mini-module list: `docs/Market-Page-Mini-Modules-2026-03-24.md` (still describes `MarketMiniMortgage` and data hooks).

## Next steps (optional)

- Visual QA at `sm` / `lg` breakpoints (callout `col-span-2`).
- `npm run build` when `.next` is not locked (Windows).
