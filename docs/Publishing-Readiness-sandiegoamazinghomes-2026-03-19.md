## Publishing readiness — San Diego Amazing Homes

- **Project**: `sandiegoamazinghomes`
- **Date**: 2026-03-19
- **Goal**: comprehensive QA pass for publishing readiness (links/routes, content integrity, assets, SEO, forms, build readiness). No new features added.

### Executive summary

- **Ready to publish**: **Not yet** (security + dependency vulnerabilities; missing real production images; needs deploy-time env validation).
- **Build status**: **Pass** after clearing Windows `.next/trace` lock (details below).
- **Top blockers**
  - **npm audit**: **1 critical, 7 high** vulnerabilities (requires dependency upgrades; see Security section).
  - **Assets**: multiple expected “real” images are missing from `public/images/` (fixed runtime 404s by switching to the existing placeholder, but production needs real assets restored).

### Active routes (post-QA expectation)

- **Primary**: `/`, `/market`, `/neighborhoods`, `/blog`, `/newsletter`, `/about`, `/contact` (redirects to `/#contact`)
- **Neighborhood details**: `/neighborhoods/[slug]` (from `content/neighborhoods/_index.json`)
- **Blog details**: `/blog/[slug]` (from `content/blog/_list.json`)
- **Newsletter details**: `/newsletter/[slug]` (from `content/newsletter/_index.json`)
- **Noindex**: `/matchmaker` (explicit `noindex, follow`)
- **Redirected/disabled**:
  - `/homes` and `/homes/[id]` → `/`
  - `/map` → `/`
  - `/market/heat-map` → `/market`
  - `/neighborhoods/map` currently exists (was previously redirected per older docs; confirm desired behavior before launch)

### Links, navigation, and CTA audit (removed/redirected routes)

**Targeted routes audited**: `/homes`, `/map`, `/market/heat-map`, `/newsletter`, `/contact`, `/blog`, `/neighborhoods`, and neighborhood detail pages.

- **Navigation**: Header + Footer link to active routes only (no `/homes` or `/map` in main nav).
- **Neighborhood markdown internal links**:
  - **Fixed**: Removed internal link bullets pointing to `/homes` (now points to `/neighborhoods` instead) across neighborhood pages that contained the old pattern.
- **Blog + newsletter content**:
  - **Fixed**: Replaced markdown links targeting `/homes` with `/matchmaker` so the content doesn’t push users into a disabled/redirected route.

### Blog + neighborhood markdown/frontmatter integrity

- **Neighborhood frontmatter**
  - **Fixed**: Normalized `heroImage` to an existing asset (`/images/placeholder-listing.svg`) for all neighborhoods that referenced missing images.
- **Blog frontmatter**
  - **Status**: No parsing failures observed in this pass (previous YAML colon issues already documented earlier in `docs/Agent-Handoff.md` history).

### Images & missing assets

**Finding**: `public/images/` contains only `placeholder-listing.svg` plus README files; expected production assets like:
- `/images/cropped-SDAH-web-banner.png`
- `/images/Rosa-010.jpg`
- `/images/Screen-Shot-2025-01-03-hero.png`
are **not present**, causing runtime 404s.

**Fixes applied (safe, non-feature)**:
- Updated neighborhood hero images to use `/images/placeholder-listing.svg` instead of missing JPG/PNG.
- Updated homepage and about-page profile/banner references to use `/images/placeholder-listing.svg`.
- Updated neighborhood image fallbacks (`lib/` + components) to use `/images/placeholder-listing.svg`.

**Pending (recommended before go-live)**:
- Restore real brand + agent images into `public/images/` (or adjust design to an intentional no-photo layout).
- Restore neighborhood hero images into `public/images/neighborhoods/{slug}/` if desired.

### SEO & crawlability

- **Robots**: `app/robots.js` allows `/` and points to sitemap.
- **Sitemap**
  - **Fixed**: `app/sitemap.js` no longer emits `/homes/*` URLs.
  - **Now includes**: `/about`, `/contact`, `/blog` + blog slugs, `/market`, `/neighborhoods` + neighborhood slugs, `/newsletter` + newsletter slugs, `/matchmaker`.
  - **Note**: `/matchmaker` is `noindex, follow` but included in sitemap; decide if you want to exclude it from sitemap pre-launch.
- **Noindex**: `/matchmaker` is explicitly `noindex, follow` (good).
- **Canonical/OG**: Not fully audited in this pass; verify key pages set titles/descriptions appropriately in `metadata`.

### Forms / contact

- **Email consistency**: `amazinghsd@gmail.com` is used in the UI for mailto links (verified) and in `content/_meta.json`.
- **`#contact` anchor**: Homepage contains `<section id="contact">…</section>` and header/footer use `/#contact` links.
- **Contact API**: `app/api/contact/route.js` depends on Supabase; when server client is unavailable it returns a 503 instructing users to email directly (good fallback).

### Security & dependencies

#### Security headers

- **Pass**: `next.config.mjs` sets:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`

#### npm audit (run with `--audit-level=high`)

- **Fail**: 9 vulnerabilities found: **1 critical**, **7 high**, **1 moderate**.
- Notable items:
  - `basic-ftp` **critical** path traversal
  - `next` **high** advisories (requires a breaking update if using `npm audit fix --force`)
  - `glob` and `minimatch` **high** ReDoS / injection advisories

**Recommendation**:
- Prefer a controlled upgrade path (pin Next.js upgrade plan, then rerun build + smoke test).
- Do **not** use `npm audit fix --force` blindly right before launch; schedule time to validate after upgrades.

### Build & runtime readiness

#### Lint

- **Pass with warnings** (`npm run lint`):
  - `components/homes/ListingsMap.js`: missing dependency `geoJSON` in `useCallback`
  - `components/market/MarketMatrix.js`: `useMemo` dependency warning (data expression)
  - `components/neighborhoods/NeighborhoodsMapMapbox.js`: `useCallback` dependency warning

#### Build

- **Pass** (`npm run build`) after resolving Windows lock.

#### Windows `.next/trace` lock issue

- **Observed**: `EPERM: operation not permitted, open ...\.next\trace` during `next build`.
- **Fix used**: terminate running Node processes holding file handles, then delete `.next`, then build.
  - In this run, `taskkill /F /IM node.exe` was required to fully release the lock.

**Recommendation**:
- Before production builds on Windows: stop dev servers first (or run builds in a clean environment/CI).

#### Environment variables (dependencies)

- **Required for contact + lead capture storage**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Optional**:
  - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` (map UIs; some map routes are redirected/disabled but token may still be used in components)
  - `RENTCAST_API_KEY` (if homes/listings re-enabled later)

### Fixes applied (file-level)

- **Sitemap**: `app/sitemap.js` updated to only emit active routes + slugs; removed `/homes/*`.
- **Neighborhood assets + links**:
  - `content/neighborhoods/_index.json` hero images → placeholder.
  - Multiple `content/neighborhoods/*.md` hero images → placeholder; internal links updated to avoid `/homes`.
- **Global image fallbacks**:
  - `lib/neighborhood-images.js`, `components/NeighborhoodSlider.js`, `components/neighborhoods/NeighborhoodList.js`, `components/neighborhoods/NeighborhoodMapCard.js`, `app/matches/page.js` fallback paths updated.
- **Homepage/About**: `app/page.js`, `app/about/page.js` missing image references replaced with placeholder.
- **Content links**: `/homes` markdown links removed from blog + newsletter content.

### Pending issues / pre-launch checklist

- **Blockers**
  - [ ] Resolve `npm audit` high/critical vulnerabilities with a tested dependency upgrade plan.
  - [ ] Restore real images into `public/images/` (brand banner, agent photo, content hero, neighborhood hero images) or finalize an intentional placeholder-only design.
- **Recommended**
  - [ ] Decide whether `/matchmaker` should appear in sitemap (it is `noindex`).
  - [ ] Confirm desired state of `/neighborhoods/map` (currently present).
  - [ ] Run Lighthouse on a production build (Performance + Accessibility).
  - [ ] Confirm production domain in `NEXT_PUBLIC_SITE_URL` so sitemap/robots point to canonical URLs.

