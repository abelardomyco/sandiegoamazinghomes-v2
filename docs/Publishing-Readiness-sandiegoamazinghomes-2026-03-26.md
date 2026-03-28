# Publishing readiness — San Diego Amazing Homes (2026-03-26)

Pre-launch pass: internal admin layer, SEO/metadata, robots, internal links, and documentation. **No visual redesign.**

---

## Build / lint

| Check | Result |
|--------|--------|
| `npm run lint` | **Pass** (3 pre-existing React hook warnings in map/market components; not introduced this pass). |
| `npm run build` | **Not re-verified here** — Windows environment previously hit `EPERM` on `.next/trace`. Run `npm run build` on a clean machine or CI before deploy. |

---

## Issues found → fixed (this pass)

1. **Admin visibility** — No internal ops surface → added **`/admin`** (password + signed cookie, middleware).
2. **SEO gaps** — Missing `metadataBase`, weak OG/Twitter on many routes → expanded **layout + page metadata**, **canonicals**, **BlogPosting** JSON-LD on posts, **Organization/WebSite** JSON-LD globally.
3. **Robots** — No `disallow` for admin/API → **`robots.js`** updated.
4. **Thin pages in index** — `/matches` could be indexed → **`robots: noindex`** on matches; same for **`/homes`**, **`/homes/[id]`**, **`/map`**, **`/market/heat-map`** (redirect stubs).
5. **Footer** — No explicit Contact link → added **`/contact`** to footer quick links.
6. **Internal SEO links** — Blog ↔ market ↔ neighborhoods under-linked → added **footer strips** on blog posts, blog index, and market page.
7. **Neighborhood hero alt** — Empty alt on non-carousel hero → **descriptive alt** with neighborhood name.
8. **Analytics story** — None documented → **Plausible (optional)** via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` + implementation notes in admin doc.

---

## Issues pending (non-blocking)

1. **Service role for admin contacts** — If Supabase RLS blocks `SELECT` on `contact_submissions`, set **`SUPABASE_SERVICE_ROLE_KEY`** for server-side reads (dashboard only).
2. **OG images per URL** — Default/site-level OG only unless you add `openGraph.images` per route.
3. **Newsletter detail metadata** — Still title-heavy; can add description + canonical per issue later.
4. **Hook lint warnings** — `ListingsMap`, `MarketMatrix`, `NeighborhoodsMapMapbox` (pre-existing).

---

## Blockers

- **None identified** for static marketing launch, assuming env vars (`NEXT_PUBLIC_SITE_URL`, Supabase for forms) are set in production.

---

## Route / sitemap sanity

- **Sitemap** includes: `/`, `/about`, `/contact`, `/blog`, posts, `/market`, `/neighborhoods`, neighborhood slugs, `/newsletter`, newsletter slugs.
- **Excluded from sitemap (by omission):** `/admin`, `/api/*`, `/matchmaker`, `/matches`, `/homes`, `/map`, `/market/heat-map` (redirect-only or internal).
- **Redirects:** `/homes`, `/homes/[id]`, `/map`, `/market/heat-map` → home or market; **`/contact`** → `/#contact`.

---

## Launch checklist (recommended)

- [ ] Set **`NEXT_PUBLIC_SITE_URL`** to production origin (canonicals + OG).
- [ ] Set **`ADMIN_DASHBOARD_PASSWORD`** + **`ADMIN_SESSION_SECRET`**; store secrets in host, not git.
- [ ] Confirm **`SUPABASE_*`** keys in production; test contact + newsletter subscribe.
- [ ] Optional: **`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`** for privacy-friendly analytics.
- [ ] Run **`npm run build`** in CI or locally without `.next` lock issues.
- [ ] Submit **sitemap** in Search Console after deploy.
- [ ] Smoke-test: nav, footer, blog, neighborhoods, market, `#contact`, admin login.

---

## Files touched (high level)

- **New:** `middleware.js`, `lib/admin-session.js`, `lib/admin-dashboard-data.js`, `app/admin/**`, `app/api/admin/session/route.js`, `components/admin/AdminLogoutButton.js`, `components/seo/SiteJsonLd.js`, `content/admin/market-notes.md`, this doc + `Admin-Dashboard-SEO-Launch-2026-03-26.md`.
- **Updated:** `app/layout.js`, `app/page.js`, `app/robots.js`, `app/blog/**`, `app/neighborhoods/**`, `app/market/page.js`, `app/market/heat-map/page.js`, `app/matches/page.js`, `app/homes/**`, `app/map/page.js`, `app/about/page.js`, `components/Footer.js`, `.env.example`.
