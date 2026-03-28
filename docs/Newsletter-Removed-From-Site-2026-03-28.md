# Newsletter removed from public site — 2026-03-28

## What changed (UX / SEO)

- **Footer:** Removed **Newsletter** quick link.
- **`/newsletter`** and **`/newsletter/[slug]`:** Redirect to **`/`** with **`noindex`** and canonical **`/`** (legacy URLs don’t 404).
- **`app/sitemap.js`:** No newsletter index or issue URLs.
- **`app/api/subscribe`:** Route removed (was only used by removed UI).
- **Components removed:** `components/newsletter/*`, `components/lead/NewListingsAlert.js` (unused).
- **`LeadCaptureMarket`:** Newsletter CTA replaced with **Read the blog** → `/blog` (component may be unused on current `/market`; kept for reuse).
- **`MonthlyHighlights`:** Removed “Read full report” link to newsletter issues.

## Unchanged (optional / internal)

- **`content/newsletter/`** — Markdown files remain for archives or scripts; not linked from the live site.
- **`lib/content.js`** — `getNewsletterIndex` / `getNewsletterBySlug` still exported for **`npm run newsletter:generate`**, agents, or future use.
- **`npm run newsletter:generate`** / **`market-report:generate`** — Still available for operators; they do not add site navigation.

## Files touched

- `app/newsletter/page.js`, `app/newsletter/[slug]/page.js`
- `app/sitemap.js`
- `components/Footer.js`
- `components/lead/LeadCaptureMarket.js`
- `components/market/MonthlyHighlights.js`
- Deleted: `app/api/subscribe/route.js`, `components/newsletter/*`, `components/lead/NewListingsAlert.js`

**Supabase `newsletter_subscribers`:** Table may still exist; nothing on the site posts to it until a new form is added.
