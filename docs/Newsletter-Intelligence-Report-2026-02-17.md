# Newsletter — San Diego Housing Intelligence Report

**Date:** 2026-02-17

## Overview

The newsletter generation system produces a **San Diego County Housing Intelligence Report** (not a blog article). Each report has six fixed sections, concise data-driven copy, and no generic filler.

**Source:** `lib/market-report-generator.js` (used by Content Agent and persisted to `market_reports` + `newsletter_issues`).

---

## 6 sections (in order)

| Section | Content |
|--------|--------|
| **1. Market Pulse** | One short paragraph: county median, active listings, days on market (avg), mortgage rate, and market tilt (buyer advantage score/label). Data only. |
| **2. What Changed This Month** | Bullet list of concrete changes: median price, inventory, DOM, rates. Numbers only. |
| **3. Hottest Neighborhoods** | Top 4–5 areas by demand. Data from `getLeaderboards().hottest` and `getHotNeighborhoods()` (`data/market-placeholder.json`: `hottestNeighborhoods`, `hotNeighborhoods`). One line per area + links to [Homes](/homes?neighborhoods=…) and [Guide](/neighborhoods/…). |
| **4. Opportunity Areas** | Best value + price-reduction areas. Data from `getLeaderboards().bestValue` and `getPriceChangeWatch()` (placeholder: `bestValueNeighborhoods`, `priceChangeWatch`). Short data-driven lines. |
| **5. Featured Homes** | Active listing count + links to [Homes](/homes) and [Map](/map). CTA for tailored list. No generic “updated regularly” text. |
| **6. Rosamelia Insight** | One short paragraph. Uses `getRosameliaInsight()` from placeholder when set; otherwise a data-aware fallback (median, inventory, tight/balanced market). Signed *Rosamelia* with contact CTA. |

---

## Title and framing

- **Title:** `San Diego County Housing Intelligence Report — [Month] [Year]`
- **Subtitle:** “Data-driven snapshot for San Diego County. From Rosamelia Lopez-Platt and San Diego Amazing Homes.”
- Report-style tone throughout; no blog-style intros or filler.

---

## Data sources

- **Snapshot:** `getMarketSnapshot()` → median, inventory, days on market, rate (from Content Agent `input`).
- **Buyer advantage:** `getBuyerAdvantage()` (score 1–10, label: Buyer's / Balanced / Seller's market).
- **Hottest / opportunity:** `getLeaderboards()`, `getHotNeighborhoods()`, `getPriceChangeWatch()` from `lib/market-data.js` (reads `data/market-placeholder.json`).

---

## Email summary

`buildEmailSummary(input, neighborhoods)` returns 2–4 sentences: month, median, inventory, market label, hottest areas, plus one CTA (“Full report on the site; reply for a tailored list”). Stored in `market_reports.source_config.email_summary_md`.

---

## Content Agent

`lib/agents/content-agent.js` → `generateNewsletterDraft({ month, year })`:

1. Gets `getMarketSnapshot()` and `getNeighborhoodIndex()`.
2. Calls `buildReport(input, neighborhoods)`.
3. Upserts `market_reports` (content_md, sections_json, source_config including email_summary_md).
4. Upserts `newsletter_issues` (slug, title, sent_at, recipient_count).

No email is sent; the report is ready for viewing on `/newsletter/[slug]` when the slug exists in the index (from `market_reports` or content).

---

## Scripts

- **Content Agent (full report):** `node lib/agents/runner.js content` or via `generateNewsletterDraft()`. Writes to Supabase.
- **Legacy static newsletter:** `scripts/generate-newsletter.js` writes to `content/newsletter/*.md` with a different template; it does **not** use the 6-section intelligence report. For the data-driven report, use the Content Agent path.
