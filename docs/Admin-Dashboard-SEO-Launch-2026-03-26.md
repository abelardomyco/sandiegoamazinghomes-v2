# Admin dashboard + SEO launch pass (2026-03-26)

## Admin dashboard

### URLs

- **Login:** `/admin/login`
- **Dashboard:** `/admin` → redirects to `/admin/dashboard`

### Access control

1. Set in **`.env.local`** (production: host env vars):
   - **`ADMIN_DASHBOARD_PASSWORD`** — shared internal password.
   - **`ADMIN_SESSION_SECRET`** — long random string (used to sign the session cookie; not the password).
2. Sign in at `/admin/login`. Session cookie is **httpOnly**, **SameSite=Lax**, **Secure** in production, ~7 days.
3. **`middleware.js`** protects all `/admin/*` except `/admin/login`. Unauthenticated users are redirected to login.
4. **`robots.txt`** disallows `/admin/` and `/api/`. Admin layouts set **`robots: noindex`**.

**Security notes:** Do not commit secrets. Rotate `ADMIN_SESSION_SECRET` if a laptop is compromised. Use HTTPS in production.

### What the dashboard shows

| Module | Data source | Notes |
|--------|-------------|--------|
| Analytics | Placeholder | No first-party IP logging. See below. |
| Contact submissions | Supabase `contact_submissions` | Filter `site = sandiegoamazinghomes`. If empty/error, add **`SUPABASE_SERVICE_ROLE_KEY`** if RLS blocks reads with the anon key. |
| Blog inventory | `content/blog/_list.json` + `.md` files | Flags missing markdown for a slug. |
| Neighborhoods | `_index.json` + `.md` + `getNeighborhoodHeroPath` | Counts placeholder heroes. |
| Assets | `public/images/sdah photos to use` | Rough image file count. |
| Market notes | `content/admin/market-notes.md` | Edit in repo; shown on dashboard only. |
| SEO note | Links to this doc + readiness report | — |

### Analytics (recommended path)

**Not installed by default.** The dashboard reserves space for metrics until you connect a provider.

**Recommended (privacy-conscious):**

- **[Plausible Analytics](https://plausible.io/)** or **Cloudflare Web Analytics** — aggregate counts, no personal data sales, GDPR-friendly positioning (verify with your counsel).
- **Vercel Analytics** — if deployed on Vercel; session-based without raw IP exposure as the primary UI.

**Setup (Plausible):**

1. Add your domain at Plausible.
2. Set **`NEXT_PUBLIC_PLAUSIBLE_DOMAIN=sandiegoamazinghomes.com`** (or your hostname) in production env.
3. The root **`app/layout.js`** injects `https://plausible.io/js/script.js` when that var is set.

**This app does not** implement raw IP logging for the admin dashboard. If you add server-side logging later, document retention and privacy policy implications.

---

## SEO implemented (this pass)

### Global (`app/layout.js`)

- **`metadataBase`** from `NEXT_PUBLIC_SITE_URL` (fallback production domain).
- **Title template:** `%s | San Diego Amazing Homes`.
- **Default Open Graph + Twitter** for the site.
- **JSON-LD:** `RealEstateAgent` (Rosamelia) + `WebSite` via `components/seo/SiteJsonLd.js`.

### Per-route

- **Home (`/`):** canonical + OG URL/title/description.
- **About, Blog index, Neighborhoods index, Market:** canonical, OG.
- **Blog posts:** unique title/description (excerpt or trimmed body), canonical, OG article, Twitter, **`BlogPosting`** JSON-LD.
- **Neighborhood detail:** unique title/description, canonical, OG/Twitter; hero **alt** text when using single hero image.
- **Thin / redirect routes:** **`robots: noindex`** on `/matches`, `/homes`, `/homes/[id]`, `/map`, `/market/heat-map`, **`/matchmaker`** (already had noindex).

### Robots & sitemap

- **`app/robots.js`:** `allow: /`, **`disallow: /admin/`, `/api/`**.
- **`app/sitemap.js`:** Unchanged set of indexable marketing routes (no `/admin`, no `/matches`, no `/matchmaker`).

### Internal linking (light touch)

- Blog post footer: links to **Market**, **Neighborhoods**, **Contact**.
- Blog index intro: links to **Market** and **Neighborhoods**.
- Market page bottom: links to **Neighborhoods**, **Blog**, **Contact**.
- Footer: **Contact** quick link (`/contact` → `/#contact`).

---

## What to improve later

- Newsletter issue pages: richer `generateMetadata` (description, canonical, OG).
- Breadcrumb JSON-LD on blog + neighborhoods (optional).
- OG **images** per page (currently inherits defaults where not set).
- Fill **`NEXT_PUBLIC_SITE_URL`** in production for exact canonicals/OG URLs.
- Optional: **Google Search Console** + **Bing Webmaster** verification meta keys in `layout.js` when ready.

---

## Related

- Full QA checklist and build notes: **`docs/Publishing-Readiness-sandiegoamazinghomes-2026-03-26.md`**.
