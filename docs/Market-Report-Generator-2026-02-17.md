# AI Market Intelligence Generator

**Date:** 2026-02-17

## Summary

A script generates a **monthly newsletter** from market inputs and writes it to `content/newsletter/{month}-{year}.md`, with the issue added to `content/newsletter/_index.json`.

## Script

- **Path:** `scripts/generate-market-report.js`
- **npm script:** `npm run market-report:generate`

## Inputs

| Input | Description |
|-------|-------------|
| `median_price` | Median sold price (number) |
| `inventory` | Active listing count |
| `days_on_market` | Average days on market |
| `mortgage_rates` | Current rate (e.g. 6.75) |
| `migration_trends` | Short narrative (e.g. in/out migration) |
| `month` | Optional; e.g. `"04"` |
| `year` | Optional; e.g. `"2026"` |

## Usage

```bash
# Use custom input file (month/year can be in the file)
node scripts/generate-market-report.js path/to/input.json

# Use default path data/market-report-input.json
npm run market-report:generate

# No input file: uses defaults for current month
node scripts/generate-market-report.js
```

## Input file shape

Save as JSON (e.g. `data/market-report-input.json`):

```json
{
  "month": "04",
  "year": "2026",
  "median_price": 950000,
  "inventory": 1200,
  "days_on_market": 28,
  "mortgage_rates": 6.75,
  "migration_trends": "Net in-migration from LA and Bay Area; outflows to Arizona and Nevada for affordability."
}
```

## Output

**File:** `content/newsletter/{year}-{month}.md` (e.g. `2026-04.md`)

**Sections:**

1. **Market Snapshot** — Median price, inventory, days on market, rates, migration narrative.
2. **Hot Neighborhoods** — Top 3 from `content/neighborhoods/_index.json` (featured first).
3. **Price Trends** — Narrative from median and rates (tier and season).
4. **Luxury Market** — High-end segment and days-on-market note.
5. **First-Time Buyer Insights** — Rates, inventory, and practical advice with links to Matchmaker and /homes.

Plus a **Call to action** with Matchmaker, neighborhoods, and contact links.

The script updates `content/newsletter/_index.json` with the new slug/title/date if the issue is not already listed.

## Sample

A sample input file is at `data/market-report-input.json`. Run:

```bash
node scripts/generate-market-report.js data/market-report-input.json
```

to generate `content/newsletter/2026-04.md`.
