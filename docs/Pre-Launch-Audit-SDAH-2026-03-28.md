# Pre-launch audit — San Diego Amazing Homes — 2026-03-28

**Amendment (same day):** Public **newsletter** pages, **footer** link, **sitemap** entries, and **`/api/subscribe`** were **removed**; `/newsletter*` redirects home. See **`docs/Newsletter-Removed-From-Site-2026-03-28.md`**.

## Launch readiness (summary)

The site is **ready to go live** from a code and SEO-control perspective, provided:

1. **`NEXT_PUBLIC_SITE_URL`** is set in production to the canonical origin (no trailing slash), e.g. `https://sandiegoamazinghomes.com` — this drives **metadataBase**, **canonicals**, **sitemap**, **robots**, and **JSON-LD**.
2. **Production build** completes in your environment (Windows builds may hit `.next/trace` **EPERM** if another process locks `.next`; close dev servers / delete `.next` and retry).
3. **Smoke-test** in the browser: home, market, blog, neighborhoods, about, gallery lightbox, Instagram link (new tab), footer links.

This pass **did not** redesign the UI or add features. It **removed** the Instagram Graph/local-feed pipeline and **standardized** link-out Instagram + indexing metadata.

---

## Task 1 — Audit findings

### Issues found (pre-fix)

| Area | Finding |
|------|---------|
| **Instagram** | Homepage still called **`getInstagramFeedForHome()`**, **`lib/instagram-graph.js`**, and **`lib/instagram-home.js`** (API + local carousel). Conflicted with “link only” launch intent. |
| **Dead code** | **`INSTAGRAM_ACCESS_TOKEN`** / Graph API path unused for launch but still in codebase and `.env.example`. |
| **Home metadata** | Root page lacked explicit **`title`** / **`description`** in `metadata` (relied on layout defaults for title; OG had description). |
| **Contact** | **`/contact`** redirects to **`/#contact`** but had **no `noindex`** — thin/duplicate URL risk. |
| **Matchmaker** | **`robots`** used string `"noindex, follow"`; Next.js prefers an object. |
| **JSON-LD** | **`SiteJsonLd`** duplicated URL logic instead of **`getPublicSiteUrl()`**. |
| **Footer** | ~~Newsletter in sitemap vs footer~~ — **superseded:** newsletter removed from site (see amendment). |
| **Instagram URL** | Inconsistent **`instagram.com`** vs **`www.instagram.com`**. |
| **Gallery empty state** | Exposed internal filesystem path in UI (operator-oriented; not ideal for public polish). |
| **ISR** | Homepage **`revalidate = 120`** tied to removed Instagram fetch. |

### Not broken (verified in code)

- **Header / footer** — no links to removed **`/map`**, **`/homes`** in primary nav (per earlier cleanup).
- **Sitemap** — no **`/homes/*`**, **`/map`**, **`/matchmaker`**, **`/matches`**, **`/admin`**, **`/api`**, **`/newsletter`** (index main content + blog + neighborhoods).
- **Redirect stubs** — **`/homes`**, **`/homes/[id]`**, **`/map`**, **`/market/heat-map`**, **`/neighborhoods/map`** use **`robots: noindex`**.
- **Content grep** — no **`](/homes`** or **`](/map`** in **`content/`** markdown.

### Not executed in this pass

- Full **manual** desktop/mobile layout pass in browser (recommend 30-minute QA).
- **Lighthouse** / Core Web Vitals run.
- **Broken image** scan against production CDN (recommend spot-check hero, Rosa photo, Baja block, neighborhood heroes after deploy).

---

## Task 2 — Indexing / SEO strategy

### Index (intended)

| URL pattern | Rationale |
|-------------|-----------|
| **`/`** | Primary landing; full metadata + canonical. |
| **`/about`**, **`/market`**, **`/blog`**, **`/neighborhoods`** | Core evergreen / hub pages. |
| **`/blog/[slug]`** | Article URLs (unique titles/descriptions from content). |
| **`/neighborhoods/[slug]`** | Unique neighborhood guides. |

### Noindex (intentional)

| Route | Rationale |
|-------|-----------|
| **`/admin/*`** | Operator UI — **`robots`** in layout + **`robots.txt`** disallow. |
| **`/api/*`** | Not HTML — disallow in **`robots.txt`**. |
| **`/matchmaker`** | Tool / duplicate of FAB flow — **`noindex, follow`**. |
| **`/matches`** | Personalized / thin — **`noindex, follow`**. |
| **`/homes`**, **`/homes/[id]`** | Redirect to home — **`noindex`**; canonical points to **`/`**. |
| **`/map`**, **`/neighborhoods/map`**, **`/market/heat-map`** | Redirect stubs — **`noindex`**. |
| **`/contact`** | Redirects to **`/#contact`** — **`noindex`**; canonical **`/`** to consolidate signals. |
| **`/newsletter`**, **`/newsletter/[slug]`** | Redirect to **`/`** — **`noindex`** (see amendment above). |

### `robots.txt` (`app/robots.js`)

- **Allow** `/`
- **Disallow** `/admin/`, `/api/`
- **Sitemap** — `${NEXT_PUBLIC_SITE_URL}/sitemap.xml` (via **`getPublicSiteUrl()`**)

### Canonicals

- **Layout** — **`metadataBase`** from **`getPublicSiteUrl()`**.
- **Key routes** set **`alternates.canonical`** (home, about, blog, market, neighborhoods, etc.).
- **Redirect / thin routes** — canonical to home (or appropriate target) where updated.

### Sitemap accuracy

- **Includes**: home, about, blog index + posts, market, neighborhoods index + slugs.
- **Omits**: **`/contact`**, **`/newsletter`**, matchmaker, matches, homes, map routes, admin, API — **correct**.

### Internal linking

- **Footer** quick links: no newsletter (removed same day as audit).

---

## Task 3 — Safe fixes applied

1. **Removed** **`lib/instagram-graph.js`** and **`lib/instagram-home.js`**.
2. **Added** **`lib/sdah-photos-paths.js`** — **`getSdahPhotosFolderConstants()`** for homepage **gallery** paths only.
3. **`app/page.js`** — Instagram section is a **single CTA** to **`https://www.instagram.com/sandiegoamazinghomes/`** (**`target="_blank"`**, **`rel="noopener noreferrer"`**). **`revalidate = 3600`**. Explicit **title/description** + **`getPublicSiteUrl()`** for canonical. Softer gallery empty copy.
4. **`app/layout.js`** — **`siteUrl`** from **`getPublicSiteUrl()`**.
5. **`components/seo/SiteJsonLd.js`** — uses **`getPublicSiteUrl()`**.
6. **`app/contact/page.js`** — **`robots: noindex`**, canonical **`/`**.
7. **`app/matchmaker/page.js`** — **`robots`** object form.
8. **`app/homes/page.js`** — **`alternates.canonical`** → **`/`**.
9. **`components/Footer.js`** — Instagram **www** URL (newsletter link later removed — see amendment).
10. **`.env.example`** — removed Instagram API vars; noted **`sync:instagram`** as optional folder sync only.
11. **`scripts/sync-instagram.js`** — comments updated to match link-only site behavior.
12. **`app/sitemap.js`** — dropped **`/contact`** (redirect + noindex).

---

## Task 4 — Remaining concerns

1. **Build environment** — Resolve **Windows EPERM** on **`.next/trace`** if it persists (permissions, antivirus, concurrent **dev** server).
2. **Historical docs** — Older files under **`docs/`** still describe the Instagram API module; they are **archival**. Current behavior: **`docs/Instagram-Feed-Removed-PreLaunch-2026-03-28.md`** (this audit + removal summary).
3. **ESLint** — Pre-existing **react-hooks/exhaustive-deps** warnings in map/market components (non-blocking for launch).
4. **Plausible** — Loads only when **`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`** is set; no change.

---

## Confirmation

- **Stable**: No Instagram fetch at request time; homepage is simpler.
- **Clean**: No embedded feed, no API tokens required for Instagram.
- **Indexing**: Clear **index vs noindex** split; **sitemap** / **robots** aligned with live routes.
- **Launch**: **Yes**, after env + build + quick browser QA.

---

## Related new/updated files

| File | Role |
|------|------|
| `lib/sdah-photos-paths.js` | Gallery disk paths |
| `docs/Instagram-Feed-Removed-PreLaunch-2026-03-28.md` | Short supersession note for old Instagram feed docs |
| `docs/Pre-Launch-Audit-SDAH-2026-03-28.md` | This report |
