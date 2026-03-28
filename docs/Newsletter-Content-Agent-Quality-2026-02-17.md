# Newsletter & Content Agent — Premium Report Quality

**Date:** 2026-02-17

## Goals

- Monthly newsletters feel like a **premium local real estate intelligence report**
- **Less generic AI tone** — specific, useful, agent-branded (Rosamelia / San Diego Amazing Homes)
- **Two outputs:** full newsletter page version + email-ready summary (no sending yet)
- Store in **newsletter_issues** and **market_reports**

---

## 1. Redesigned newsletter template

**File:** `lib/market-report-generator.js`

**Current format:** 6-section **San Diego County Housing Intelligence Report** — see **docs/Newsletter-Intelligence-Report-2026-02-17.md** for full spec.

**Sections (in order):**

| Section | Purpose |
|--------|---------|
| **Opening market takeaway** | One punchy paragraph with median, inventory, and a clear “so what” for the month |
| **What changed this month** | 2–4 bullets: median price, inventory, days on market, rates |
| **3 neighborhoods to watch** | Exactly three areas with short intro + links to homes and area guide |
| **Inventory & pricing summary** | Tight combo of median, inventory, DOM; one-line takeaway when data supports it |
| **Buyer insight** | 2–3 sentences, actionable (pre-approval, Matchmaker, act quickly when needed) |
| **Seller insight** | 2–3 sentences, actionable (price to comps, presentation, pre-listing inspection when relevant) |
| **Featured listings** | Single block with links to browse/map and CTA to request a tailored list |
| **Rosamelia’s local note** | First-person, one short paragraph; local, warm, CTA to contact |

**Writing principles (built into copy):**

- **Concise** — Short sentences; no filler.
- **Data-driven** — Use real numbers (median, inventory, DOM, rates) when available.
- **Local** — Name neighborhoods (La Jolla, Del Mar, Coronado, Encinitas, Carlsbad, etc.).
- **Agent-branded** — “I” for Rosamelia, “San Diego Amazing Homes,” clear CTAs to contact and Matchmaker.

---

## 2. Email-ready summary

**Function:** `buildEmailSummary(input, neighborhoods)`

- **Output:** 2–4 sentences + one CTA line.
- **Content:** Opening line with median and inventory; one line on “areas drawing the most interest” (2 neighborhood names); one line: “Read the full report… or reply for a tailored list.”
- **Storage:** Saved in **market_reports.source_config.email_summary_md** when the Content Agent runs. No email is sent; this is ready for a future send.

---

## 3. Content Agent updates

**File:** `lib/agents/content-agent.js`

- **generateNewsletterDraft()** calls `buildReport()`, which now returns `email_summary_md`.
- **upsertMarketReport()** receives:
  - **content_md** — full newsletter page body (markdown)
  - **sections_json** — array of `{ title, body }` for the 6 sections
  - **source_config** — `{ type, month, year, email_summary_md }`
- **newsletter_issues** — still only slug, title, sent_at, recipient_count (no content; content lives in market_reports).
- Return value of generateNewsletterDraft includes **email_summary_md** for logging or future use.

---

## 4. Newsletter page version

- **Full report** is in **market_reports.content_md** (and sections_json).
- **app/newsletter/[slug]/page.js**:
  - **Fallback:** If there is no `content/newsletter/{slug}.md`, the page loads **getMarketReportBySlug(slug)** and renders **content_md** as the issue body, with **title** and optional **date** from the report (and source_config.month/year).
- **dynamicParams = true** so slugs that exist only in market_reports (e.g. after Content Agent run) are valid URLs without being in generateStaticParams.

Result: Running the Content Agent for a given month creates/updates the report in Supabase; visitors can open **/newsletter/YYYY-MM** and see the premium report even when no markdown file exists for that slug.

---

## 5. What’s not done

- **Email sending** — Not implemented. email_summary_md is stored and ready.
- **scripts/generate-market-report.js** — Still uses its own section logic and writes to **content/newsletter/*.md** and _index.json. It does not use lib/market-report-generator.js. Optional follow-up: refactor the script to use buildReport() and optionally write to both files and Supabase.

---

## 6. Files touched

| File | Change |
|------|--------|
| **lib/market-report-generator.js** | 6-section Housing Intelligence Report (Market Pulse, What Changed, Hottest Neighborhoods, Opportunity Areas, Featured Homes, Rosamelia Insight); data from market-data; buildEmailSummary(); buildReport() returns email_summary_md. See docs/Newsletter-Intelligence-Report-2026-02-17.md. |
| **lib/agents/content-agent.js** | Pass email_summary_md in source_config; return it from generateNewsletterDraft |
| **app/newsletter/[slug]/page.js** | Fallback to market_reports when content file missing; getIssueData(); dynamicParams |
| **docs/Newsletter-Content-Agent-Quality-2026-02-17.md** | This doc |
