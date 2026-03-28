# Agent Handoff — San Diego Amazing Homes

**Last updated:** 2026-03-28

Brief log for new agents. See dated docs in `docs/` for details.

## 2026-03-28 (Git: origin → sandiegoamazinghomes-v2)

- **`git remote remove origin`** then **`git remote add origin https://github.com/abelardomyco/sandiegoamazinghomes-v2.git`**. Replaces previous **`sandiegoamazinghomes.git`** remote. **Push / upstream:** create the GitHub repo if needed, then e.g. **`git push -u origin main`** (branch was **`main`** in this clone).

## 2026-03-28 (Git: status + remote)

- **`git status`:** branch **`main`**, **up to date with `origin/main`**. Many **modified** tracked files (e.g. `app/page.js`, `Footer.js`, `layout.js`, `package.json`) and large **untracked** set (routes, `lib/`, `docs/*`, images, scripts, `.cursor/`, etc.) — working tree not committed as a whole in this clone.
- **Note (superseded):** remote was **`sandiegoamazinghomes.git`**; see entry above for **`sandiegoamazinghomes-v2.git`**.

## 2026-03-28 (Newsletter removed from public site)

- **Footer:** no Newsletter link. **`/newsletter`** + **`/newsletter/[slug]`** → redirect **`/`** with **noindex**. **Sitemap:** no newsletter URLs. **Removed:** **`app/api/subscribe`**, **`components/newsletter/*`**, **`NewListingsAlert`**. **`LeadCaptureMarket`:** blog + contact only. Doc: `docs/Newsletter-Removed-From-Site-2026-03-28.md`; pre-launch audit amended.

## 2026-03-28 (Dev: `npm run dev`)

- **`npm run dev`** → **`scripts/dev-3001.js`** → **http://localhost:3001** (3000 = Baja Land Company). Earlier same day: stopped PID **25816** on 3001 before restart.

## 2026-03-28 (Pre-launch audit: Instagram link-only, SEO, cleanup)

- **Removed** embedded Instagram feed: deleted **`lib/instagram-graph.js`**, **`lib/instagram-home.js`**; added **`lib/sdah-photos-paths.js`** for gallery paths only. Homepage **Instagram** = external link (new tab). **`revalidate` 3600** on home. **`SiteJsonLd`** + **`layout`** use **`getPublicSiteUrl()`**. **`/contact`** noindex + canonical `/`; **`/homes`** canonical `/`; **`matchmaker`** robots object; **newsletter** OG; **footer** Newsletter + www Instagram; **sitemap** omits **`/contact`**. Docs: **`docs/Pre-Launch-Audit-SDAH-2026-03-28.md`**, **`docs/Instagram-Feed-Removed-PreLaunch-2026-03-28.md`**. Older Instagram API docs are **archival** only.

## 2026-03-28 (Homepage gallery: full folder + featured order)

- Gallery loads **every** image under `gallery/`; **featured** order first (open house, sold 1, sold coronado, sold 4, sold 3), then **A–Z**. **View all photos** + lightbox **`z-[9999]`**, **`portalReady`**, scrollable dot rail, **`touch-pan-x`**, **`reInit`** only when paths change after mount. Doc: `docs/Gallery-Full-Folder-Featured-Order-2026-03-28.md`.

## 2026-03-28 (Homepage gallery: lightbox + carousel arrows)

- **`ImageCarousel`:** optional **`enableLightbox`** (full-screen viewer, keyboard + open in new tab). **Prev/next** show when **2+ images** (not only when `length > slidesToShow`); arrows no longer gated on `canScrollPrev`/`canScrollNext` when `loop` is on. Homepage gallery passes **`enableLightbox`**. Doc: `docs/Gallery-Lightbox-Carousel-Nav-2026-03-28.md`.

## 2026-03-27 (Dev: stop process on port 3001)

- Terminated PID **15776** (`taskkill /PID 15776 /F`) that was **LISTENING** on **TCP 3001** (local dev or secondary Next server). Port should be free after sockets clear **TIME_WAIT**.

## 2026-03-27 (Homepage: gallery subfolder, 5-up, Instagram below)

- **Gallery** section moved **above** **Follow on Instagram**. Gallery reads a **fixed ordered set** from `public/images/sdah photos to use/gallery/` (**LTR:** open house → sold 1 → sold 2 → sold 3 → sold 4). **`ImageCarousel`** supports **five slides** on `lg` via `slideBasisLgClass` / `slideSizesAttr`. Doc: `docs/Home-Gallery-Instagram-Reorder-2026-03-27.md`.

## 2026-03-26 (Neighborhood pages: remove broken Ask Rosamelia section)

- Removed bottom `AskRosameliaWidget` from `app/neighborhoods/[slug]/page.js` (template for all neighborhood detail pages). Kept working floating/bubble CTA flow to contact/email. Doc: `docs/Neighborhood-Pages-Remove-AskRosamelia-Section-2026-03-26.md`.

## 2026-03-26 (`/market` Core signals + Rate — no `ModuleRowFull`)

- **Core signals:** One **`ModuleRow4`** always; **`CalloutModule`** uses **`wideSpan`** (2 cols only when 3 tiles, no Shift). **Rate** stays in the same row as Shift—**removed `ModuleRowFull`** so Rate isn’t a lone full-width strip with empty space. Doc: `docs/Market-Page-Core-Rate-Layout-2026-03-26.md`.

## 2026-03-26 (Instagram homepage: source, freshness, UI)

- **`lib/instagram-home.js`:** Single resolver — **Graph API** only when `INSTAGRAM_ACCESS_TOKEN` is set and returns media; else **local folder** (mtime-first). **Stale local** (>45 days since newest file `mtime`) **hides the carousel**; public copy is neutral (no dev banner). ISR + Graph fetch **`revalidate` 120s**. Doc: `docs/Instagram-Home-Feed-Source-2026-03-26.md`.

## 2026-03-26 (`/market` explicit row groups)

- Replaced **one mega-grid** with **per-section row groups**: `ModuleRow4`, `ModuleRow3`, `ModuleRowFull` + `SectionLabel` (`isFirst`). Core signals: `ModuleRow4` + optional `ModuleRowFull` for Rate when Shift shows. Doc: `docs/Market-Page-Row-Groups-Refactor-2026-03-26.md`.

## 2026-03-26 (SDAH debug: market dead space + Instagram)

- **`/market`:** Dead columns from **3 `MicroModule`s** as direct children of a **4-col grid** (“Market interpretation”, “Action layer”) — fixed with **`ModuleRow3`** inner grid (`lg:grid-cols-3`, third tile `sm:col-span-2`).  
- **Instagram:** Folder sort **mtime-first**; Graph media by **timestamp**; **`revalidate` 120s** on homepage + Graph fetch. Resolver + stale behavior: `lib/instagram-home.js`; operator doc: `docs/Instagram-Home-Feed-Source-2026-03-26.md`. Debug: `docs/SDAH-Debug-Market-Instagram-2026-03-26.md`.

## 2026-03-26 (`/market` Rate & financing grid bug)

- **Empty space right of “Rate & financing pulse”:** when **Shift vs last check** shows, the first row fills 4 cols (2+1+1); **Rate** sat alone on the next row in **1 column**, leaving **3 empty grid tracks**. Fix: **`col-span-full`** on that `MicroModule` when shift is present. Doc: `docs/Market-Page-Rate-Financing-Grid-Bug-2026-03-26.md`.

## 2026-03-26 (`/market` spacing audit — real fix)

- **Root cause:** CSS Grid default **row stretch** made short modules (e.g. one-line tile) sit in tall cells; plus site **`layout.js` `py-10`** added heavy vertical padding. **Fix:** `items-start` / `self-start` / `min-h-0` on module grid + cards; asymmetric `gap-x` / `gap-y`; `m-0` on headings/helper `p` tags; page shell `flex flex-col gap-1`; main wrapper `py-6 sm:py-8`. Docs: `docs/Market-Page-Spacing-Audit-2026-03-26.md` (authoritative), `docs/Market-Page-Tight-Layout-2026-03-26.md` (earlier padding-only pass).

## 2026-03-26 (`/market` tight layout)

- First pass: smaller gaps/padding only. Superseded by spacing audit above.

## 2026-03-26 (neighborhood micro-sections enrichment)

- **Proximity / movement / convenience** micro-sections (`What you're close to` through `Trade-up / trade-down`) **enriched** across all 27 neighborhood `.md` files—more named places and block-specific detail; no rewrite of core sections (Feel, Housing, Who It's For, etc.). Doc: `docs/Neighborhood-Micro-Sections-Enhance-2026-03-26.md`.

## 2026-03-26 (neighborhood local context + Solana index)

- **Solana Beach** added to `content/neighborhoods/_index.json`; `solana-beach.md` aligned to standard neighborhood sections with local specificity (Cedros, Fletcher Cove, 101/5, buyer compare). **Pacific Beach** `.md` aligned to same pattern (had old section names). Light proximity/access/buyer-context sentences added across other indexed neighborhood markdown files. Doc: `docs/Neighborhood-Local-Context-2026-03-26.md`.

## 2026-03-26 (new neighborhood life section)

- Added **`## What life looks like here`** to all 27 neighborhood markdown files, inserted right after The Feel (or The vibe in older files). Kept existing sections intact; each neighborhood gets short, distinct routine bullets. Doc: `docs/Neighborhood-Life-Section-2026-03-26.md`.

## 2026-03-26 (`/market` refine)

- Removed redundant tile overlap on `/market` (kept shift + leverage tiles and variety module types). Doc: `docs/Market-Page-Refine-2026-03-26.md`.

## 2026-03-26 (homepage Instagram feed visibility)

- Homepage Instagram module now shows a **stale sync** warning when the local Instaloader images are old (and explains `INSTAGRAM_ACCESS_TOKEN` vs `npm run sync:instagram` / 429 limits). `app/page.js`.

## 2026-03-26 (Otay scores)

- **Neighborhood scores:** Otay — `Newer` 10, `Value` 9 in `content/neighborhoods/_index.json` (was 7 / 8).

## 2026-03-26 (pre-launch verification pass)

- **`getPublicSiteUrl()`** in `lib/public-site-url.js` — `robots.js` + `sitemap.js` use it (trailing slash strip, `https://` + `VERCEL_URL`). Market OG `url` + canonical via same helper; newsletter index + `[slug]` canonicals; market header **“Updated this week”** badge when `snapshot.updatedAt` is fresh; Ask Rosamelia network error mentions support email. `.env.example` documents `NEXT_PUBLIC_SITE_URL`. Report: `docs/Pre-Launch-Verification-SDAH-2026-03-26.md`.

## 2026-03-26 (pre-launch admin + SEO + readiness)

- **Internal admin:** `/admin` → `/admin/dashboard` (password + signed cookie, `middleware.js`). Recent contacts from Supabase; blog/neighborhood/asset snapshots; market notes at `content/admin/market-notes.md`. API: `POST /api/admin/session` (login/logout). Env: `ADMIN_DASHBOARD_PASSWORD`, `ADMIN_SESSION_SECRET`; optional `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` for analytics script.
- **SEO:** `metadataBase`, per-route metadata/OG/Twitter where expanded, `SiteJsonLd` (RealEstateAgent + WebSite), BlogPosting on posts, `robots.js` disallows `/admin/` and `/api/`; noindex on thin routes (`/matches`, `/homes`, `/map`, `/market/heat-map`, etc.). Footer Contact link to `/contact`.
- **Docs:** `docs/Admin-Dashboard-SEO-Launch-2026-03-26.md` (access, analytics, quick-edit, SEO summary); `docs/Publishing-Readiness-sandiegoamazinghomes-2026-03-26.md` (QA checklist, fixed/pending, launch list). Run `npm run build` in CI or when `.next` is not locked (Windows EPERM on trace has been seen locally).

## 2026-03-24 (`/market` mini-modules + variety pass)

- **`/market`:** `MarketMiniMortgage.js` + compact tiles; then **variety restructure** — **CalloutModule**, **QuickScenario** (10/20/30% down P&amp;I), **OneLineModule** inventory pulse, **SectionLabel** groups, deduped pace/heat/negotiation overlap into heat map + pulse + offer bands. Shift tile = **MicroModule** “Shift vs last check” (honest cadence, no fake “last week”). Labels: **Market interpretation**, **Geographic insights**, **Action layer**; tone pass on repeated phrasing. `app/market/page.js`. Docs: `docs/Market-Page-Mini-Modules-2026-03-24.md`, `docs/Market-Page-Variety-Restructure-2026-03-24.md`.

## 2026-03-25 (workspace rules)

- **PDFs for update reports:** Optional only—generate when the user explicitly asks. Updated `Websites/.cursor/rules/` (`document-and-backup`, `update-report-titles`, `update-report-location`, `full-update-pdf`). Doc: `docs/PDF-Reports-Optional-Rule-2026-03-25.md`.

## 2026-03-24 (6:37pm)

- **Consolidated update report:** `docs/update-reports/sdah-update-3-24-26-6-37pm.md` (PDF only if requested; see report footer).

## 2026-03-25

- **Blog hero:** `/blog` has a 16:9 sunset hero from `sdah photos to use` (filename contains `sunset`; newest file if several), overlay + “San Diego Real Estate Insights”; gradient fallback if none. `lib/blog-hero-image.js`, `app/blog/page.js`. See `docs/Blog-Hero-Sunset-2026-03-25.md`.
- **Neighborhood list UI:** Larger horizontal rows on `/neighborhoods` — bigger hero thumbnails, padding, and type in `components/neighborhoods/NeighborhoodList.js`. See `docs/Neighborhood-List-Row-Size-2026-03-25.md`.

## 2026-03-24

- **Instagram homepage module:** Newest-first folder sort (24 max), excludes `profile_pic` downloads; optional **`INSTAGRAM_ACCESS_TOKEN`** (`lib/instagram-graph.js`) for live posts with hourly revalidation; `ImageCarousel` supports per-slide links + external CDN URLs; `sync-instagram` adds `--fast-update`. Doc: `docs/Instagram-Module-Live-Feed-2026-03-24.md`. Instaloader can return HTTP 429 if run too often.
- **Neighborhood area photos:** Curated PNGs in `public/images/sdah photos to use/Areas/` (or `areas/`) are wired via `lib/neighborhood-images.js` (slug → filenames); `/matches` uses `getNeighborhoodHeroPath` for card images. See `docs/Neighborhood-Areas-Photos-Sdah-Folder-2026-03-24.md`.

## 2026-03-16

- **Update report:** New report at `docs/update-reports/sdah-update-16-03-2026-10-52pm.md` (16 March 2026, 10:52 pm). Summarizes current routes, ten blog articles (including three Market pieces: Will Home Prices Drop, Market Forecast 2026, How Competitive), blog stability fixes (safe date/meta/body handling in index and post pages, content.js try/catch and filtering).
- **Nuanced blog content:** Three new articles added for insider-style, non-generic advice: Why San Diego Real Estate Stays Expensive, How to Find Good Value in San Diego Real Estate, Common Mistakes Buyers Make in San Diego. Each challenges assumptions, uses real neighborhoods (North Park, Clairemont, La Mesa, Encinitas, Chula Vista, etc.), and links subtly to /market, /neighborhoods, /homes. Blog index `_list.json` prepended with these three (date 2026-03-16). Doc: `docs/Blog-Articles-Nuanced-2026-03-16.md`.
- **Blog YAML fix:** Titles containing a colon in frontmatter (moving-to-san-diego-everything-you-need-to-know, relocating-to-san-diego, first-time-buyer-san-diego) were quoted so gray-matter parses correctly; those posts now load on detail pages.
- **Blog dedupe:** Removed duplicate post `relocating-to-san-diego` (kept the longer `moving-to-san-diego-everything-you-need-to-know`). Updated `content/blog/_list.json` and deleted `content/blog/relocating-to-san-diego.md`.
- **Blog tone pass:** Light edits across all current blog posts to make the voice feel more natural and local (less templated, more conversational rhythm), without changing structure or claims.
- **Market redesign:** `/market` refocused into a quick-signals dashboard (snapshot row, market moment, neighborhood signal grid, micro-insights). Heat map remains available at `/market/heat-map`, but the preview was removed from `/market` (it was low-signal without a token). Doc: `docs/Market-Page-Quick-Signals-Redesign-2026-03-19.md`.
- **New decision-driven blog posts:** Added three practical, next-step-oriented posts (value pockets, condo vs house decision, and what budgets buy). Doc: `docs/Blog-Decision-Driven-Articles-2026-03-19.md`.
- **Map pages removed (temporary):** Removed map links from header/footer, removed map routes from sitemap, and redirected `/map`, `/neighborhoods/map`, and `/market/heat-map` to list/dashboard pages. Doc: `docs/Map-Pages-Removed-For-Now-2026-03-19.md`.
- **Homes pages removed (temporary):** Disabled `/homes` and `/homes/[id]` via redirect to `/`, removed “Homes” from header/footer + sitemap, and adjusted CTAs away from `/homes?...`. Doc: `docs/Homes-Pages-Removed-For-Now-2026-03-19.md`.

## 2026-03-19

- **Publishing readiness QA pass:** Fixed broken/missing image paths by switching to existing placeholder assets, removed `/homes` links from neighborhood/blog/newsletter content, updated sitemap to only include active routes + slugs, ran `npm audit`/lint/build and documented Windows `.next/trace` lock behavior. Report: `docs/Publishing-Readiness-sandiegoamazinghomes-2026-03-19.md`.
- **Assets reconnected:** Repointed homepage + about page images back to the real files now present in `public/images/` (banner, Rosamelia photo, Abelardo photo, Baja image + logo). Updated doc: `docs/QA-Followup-Assets-Placeholder-2026-03-19.md`.
- **Neighborhood areas reference:** Full list of all 21 neighborhood areas (name, slug, region, URLs) in `docs/Neighborhood-Areas-Full-List-2026-02-17.md`.
- **Homepage blog spotlight:** Compact “From the blog” beside the bio on `lg+`—four posts + `/blog` link; **left-aligned** in the blog column. Doc: `docs/Homepage-Blog-Spotlight-Module-2026-03-19.md`.

## 2026-02-17

- **Market page polish (realism, density, signals):** Replaced the three trend charts (price/sqft, DOM, sales volume) with a compact **MarketSignalCards** row: Price per sq ft, Days on market, Monthly sales volume, Interest rate watch, Inventory pressure (all with direction and % where applicable). Added **MarketTakeaway**, **InterestRateFedWatch**, **BuyerSellerSignal**; kept CompactRankingPanels (Hottest/Cooling/Best Value), Featured Homes, Rosamelia Insight (tightened). Scoreboard: stronger badges, clearer row spacing. Neighborhood detail hero: when slug folder has no images, uses **region fallback** via getNeighborhoodHeroPath before global banner. Homes: listing cards and detail already show full unified data; placeholder image when missing. Spacing tightened on market and homes. See docs/Market-Page-Polish-2026-02-17.md.
- **Market dashboard refactor (/market):** Tighter housing intelligence dashboard: 6-metric stat band (Median Price, Active Listings, DOM, $/Sq Ft, Sales Volume, Price Reduction Rate) with deltas; side-by-side price + inventory charts with YoY badges; unified neighborhood market matrix (scatter: price growth vs inventory pressure, color = market strength) replacing multi-toggle heat map on /market; compact ranking panels (Hottest, Cooling, Best Value). New: getMarketStatBandData(), getNeighborhoodHeatMetricsForMatrix(), MarketStatBand, MarketChartsRow, MarketMatrix, CompactRankingPanels. Removed duplicate sections and bulk; full-screen heat map remains at /market/heat-map. See docs/Market-Dashboard-Refactor-2026-02-17.md.
- **Update report + PDF:** Update report refreshed and PDF generated in `docs/update-reports/` (Update-Report-San-Diego-Amazing-Homes-2026-02-17.md and .pdf). Report includes About page intro, Abelardo section (Media, Design & Marketing) with photo from `public/images/Abelardo-photo.jpg`.
- **Live data verification & listing normalization:** RentCast adapter extended (pickPhotos, pickDescription, normalizeListing with lot_sqft, status, many field variants). Dev-only logging when key missing or API fails. homes-data: unified shape includes lotSize, status; getListingsSourceStatus() for debug. Frontend: ListingCard shows lot, property type, status; property detail shows address/city/state/zip, status badge, lot, PropertyGallery "Photo not available" when no real photos. Placeholder only when live unavailable; "Sample data" / "Live listings" badge on /homes. See docs/Live-Data-Verification-2026-02-17.md.
- **Market heat map:** New page `/market/heat-map` with Mapbox neighborhood fill layer. Toggle metrics: price growth, inventory pressure, days on market. Color scale: green (accelerating) → yellow (neutral) → red (declining). Data: `data/market-placeholder.json` → `neighborhoodHeatMetrics`; getter `getNeighborhoodHeatMetrics()` in lib/market-data.js. Component: `components/market/MarketHeatMap.js`. Link from market page; sitemap updated. See docs/Market-Heat-Map-2026-02-17.md.
- **Newsletter — Housing Intelligence Report:** 6-section report (Market Pulse, What Changed This Month, Hottest Neighborhoods, Opportunity Areas, Featured Homes, Rosamelia Insight). Data-driven copy in lib/market-report-generator.js; wired to getLeaderboards(), getHotNeighborhoods(), getPriceChangeWatch(), getBuyerAdvantage(), getRosameliaInsight(). See docs/Newsletter-Intelligence-Report-2026-02-17.md.
- **Market page conversion widgets:** Buyer Advantage Meter (1–10 score, buyer/seller bar), Homes Selling Fast (lowest DOM neighborhoods + CTAs), Price Change Watch (price reductions by neighborhood), Mortgage Payment Snapshot (one estimate + link to contact for calculator), Rosamelia Insight (expert quote + Ask Rosamelia CTA). Data in market-placeholder.json; getters in lib/market-data.js. Compact layout, card-based.
- **Market page intelligence:** Added 8 sections: Market Snapshot (median, $/sqft, DOM, active listings, new trend), Inventory Pressure (months of inventory + trend chart), Price Trends (12-mo median + $/sqft chart), Neighborhood Leaderboards (hottest, best value, fastest selling), Luxury Market ($2M+ stats), Mortgage Rate Widget (rate + payment examples), Rental Market (median rent, growth, rent vs buy), Featured Homes (3–5 from listings). Compact card layout, simple CSS bar charts. Data from data/market-placeholder.json and getListingsForPage(). See docs/Market-Intelligence-Enhancement-2026-02-17.md.
- **Phase 5 UI simplification:** Nav: Home, Neighborhoods, Homes, Market, About, More (Map, Area Map, Newsletter), Contact. Matchmaker/matches removed from header; /matchmaker noindex, minimal shell. Homepage and market page: tighter spacing, denser cards, shorter copy. Market: 2-col layout (Snapshot+Trend, Hot+Monthly), compact stat cards. Listings use neutral placeholder image (`/images/placeholder-listing.svg`) instead of SDAH banner. Mapbox: polished fallback when token missing (MapboxFallback + CTAs); token comment in map/homes/neighborhoods map pages. Neighborhood image order documented in lib/neighborhood-images.js and public/images/neighborhoods/README.md. See docs/Phase-5-UI-Simplification-2026-02-17.md.
- **Newsletter & Content Agent quality:** Redesigned newsletter template (8 sections: opening takeaway, what changed, 3 neighborhoods to watch, inventory & pricing, buyer/seller insight, featured listings, Rosamelia’s note). Premium local tone; email-ready summary in market_reports.source_config.email_summary_md. Newsletter page falls back to market_reports when content/newsletter/{slug}.md missing. See docs/Newsletter-Content-Agent-Quality-2026-02-17.md.
- **Phase 4 refinement & conversion:** Neighborhood images: 3–5 per slug from `public/images/neighborhoods/{slug}/`, region fallback (`_fallbacks/coastal` etc.), then global banner. Matchmaker: results link to “See homes” + “View on map”; short intro on /matchmaker. Market page: editorial header “San Diego County Market Intelligence”, LeadCaptureMarket. Newsletter: new sections (Market Snapshot, Hot Neighborhoods, Inventory Shifts, Buyer & Seller Takeaway, Featured Homes, Rosamelia’s Insight); polished local tone. Lead capture: LeadCaptureMarket (market), LeadCaptureArea (neighborhoods), CTAs on /homes and /market. Save home/search: SaveHomeButton on property detail, SaveSearchButton on /homes; anonymous_id in sessionStorage, POST to /api/lead/saved-home and saved-search. See docs/Phase-4-Refinement-2026-02-17.md.
- **Phase 3 Market Data & Content agents (v1):** Market Data Agent: fetch from RentCast → normalize → cache in listing_cache → extract images to listing_images → write neighborhood_market_stats (from trend adapters or derived from listings). Content Agent: generate monthly newsletter draft + market report draft (market_reports, newsletter_issues) and short neighborhood update blurbs (optionally write to market_reports). Both log runs to agent_runs. CLI: `npm run agent:run market_data` | `content [--month=MM] [--year=YYYY] [--write-neighborhood-summaries]`. No email sending. lib/supabase.js CJS export for Node; dotenv for .env.local. See docs/Phase-3-Implementation-2026-02-17.md and lib/agents/README.md.
- **Phase 2 routes:** /homes, /homes/[id], /map, /market implemented with modular components. **Unified data:** lib/homes-data.js is async: getListingsForPage / getListingByIdForPage use RentCast when RENTCAST_API_KEY is set, else placeholder (data/listings.json). Map page fixed to await getListingsForPage(). ListingCard and property detail show beds/baths/sqft only when present. Market page: Market Snapshot, Neighborhood Highlights, Monthly Trends (placeholder until live data). See docs/Phase-2-Routes-2026-02-17.md.
- **Phase 1 real estate intelligence foundation:** Upgrade plan and Phase 1 implemented: Supabase migrations for `listing_cache`, `listing_images`, `neighborhood_market_stats`, `market_reports`, `saved_searches`, `saved_homes`, `user_preferences`, `lead_events`, `newsletter_issues`, `agent_runs`. Service layer: `lib/listings/`, `lib/market/`, `lib/agents/`, `lib/email/`. Placeholder adapters: RentCast, Redfin, Zillow, Baja manual (stubs with TODOs for live API keys). No pages removed; no frontend redesign. See `docs/Upgrade-Plan-Real-Estate-Intelligence-2026-02-17.md` and `docs/Phase-1-Implementation-Notes-2026-02-17.md`.
- **Interactive neighborhood map (Mapbox):** New page `/neighborhoods/map` with polygon overlays for 16 neighborhoods. Click opens a card (image, scores, link to neighborhood page, "See Homes" button). Geo from `data/neighborhoods-geo.json`. Nav link "Area Map" and sitemap entry added. See `docs/Neighborhood-Map-Mapbox-2026-02-17.md`.
- **AI market intelligence generator:** Script `scripts/generate-market-report.js` (npm: `market-report:generate`) reads inputs (median_price, inventory, days_on_market, mortgage_rates, migration_trends) and writes a monthly newsletter to `content/newsletter/{month}-{year}.md` with sections: Market Snapshot, Hot Neighborhoods, Price Trends, Luxury Market, First-Time Buyer Insights. Sample input: `data/market-report-input.json`. See `docs/Market-Report-Generator-2026-02-17.md`.
- **Matchmaker → lightweight assistant:** Replaced full `/matchmaker` form with a 3-question flow (Budget, Lifestyle, Commute). Added floating widget (FAB bottom-right) on all pages except `/matchmaker`; `/matchmaker` shows the same flow inline. Results: top 3 neighborhoods, fit %, and “See homes in this area” → `/homes?neighborhoods=slug1,slug2,slug3`. Homes and map pages accept `?neighborhoods=slug1,slug2,slug3` and filter listings. See `docs/Matchmaker-Widget-2026-02-17.md`.

## Full update (all three sites)

- **thebajalandcompany/docs/Full-Update-All-Three-Sites-2026-02-19.md** (and .pdf) — Single reference for TBLC, SDAH, and Alchemical Vibrations (ports 3000, 3001, 3002). Update reports live in thebajalandcompany/docs/.

## 2026-02-16

- **Neighborhood scores and streamlined areas:** Each neighborhood has a `scores` object (1–10) for dimensions like Upscale, Walkable, Cost-friendly, Family-friendly, Coastal, Foodie, Artsy, Urban, Chill. List cards show “Strong: … · Less: …”; detail Liveability snapshot shows Strong/Less with numbers. List cards and detail page made smaller (compact cards, smaller hero, prose-sm, single scorecard block). See `docs/Neighborhood-Scores-Streamline-2026-02-16.md`.
- **Neighborhoods reorder (16, 4 per row):** Row 1: La Jolla, Del Mar, Rancho Santa Fe, Coronado. Row 2: Carlsbad, Solana Beach, Encinitas, Pacific Beach. Row 3: Carmel Valley, Little Italy, Mission Valley, Bonita. Row 4: Poway, Rancho del Rey, Otay, Eastlake. La Mesa (and North Park, Chula Vista) removed. Grid set to `lg:grid-cols-4`. Eleven new neighborhood .md files added (rancho-santa-fe, carlsbad, solana-beach, pacific-beach, carmel-valley, little-italy, mission-valley, bonita, rancho-del-rey, otay, eastlake). See `content/neighborhoods/_index.json` and `docs/Neighborhoods-Order-Images-Streamline-2026-02-16.md`.
- **Neighborhoods order, images, streamlined UI (earlier):** Cards and filter streamlined; regional images doc in `public/images/neighborhoods/README.md`.
- **Matchmaker, neighborhoods filter, Del Mar/Coronado, newsletter:** Matchmaker streamlined (shorter copy, lighter card, “Find your neighborhood,” smaller progress bar). Neighborhoods filter: removed “Filter neighborhoods” heading; single row with Region dropdown + Vibe tags + count. Added Del Mar (North County) and Coronado (Coastal) to `content/neighborhoods/_index.json` and created `del-mar.md`, `coronado.md`. Newsletter: subscriptions are stored in Supabase table `newsletter_subscribers`; how to view/export and ideas for furthering (email provider, in-app admin, CTAs) in `docs/Newsletter-Subscriptions-And-Furthering-2026-02-16.md`.
- **Baja section logo/button:** Button reverted to smaller size (px-4 py-2.5 text-sm); Baja Land Company logo increased ~40% (h-[3.85rem] w-40). See `docs/Baja-Logo-Button-Fix-2026-02-16.md`.
- **Royal California logo:** Shown only underneath Rosamelia's profile photo in two places: Homepage Contact and About Us. Same width (200px) and centered on both. See `.cursor/rules/royal-california-logo.mdc`.
- **Visual redesign and Supabase CMS:** Header/footer dark theme, Embla image carousels on homepage (Instagram + Gallery), alternating section backgrounds, enhanced neighborhoods filter and LiveabilityScorecard (icons, new regions: East County, South Bay, Inland), matchmaker form and matches page (hero images, fit %), newsletter list/detail with prose and sidebar, inline SubscribeForm posting to Supabase. Tables: `newsletter_subscribers`, `contact_submissions`. See `docs/Visual-Redesign-2026-02-16.md`.

## 2025-02-16

- **Three new sub-agents:** document-auto-updater (docs at end of chat), website-state-tracker (logs page edits to Website-State.json), publishing-readiness (Webflow/WordPress-style pre-publish checks). Rule session-wrap-up-and-state ties them to end-of-chat and page edits. See Websites/docs/Subagents-Document-State-Publishing-2025-02-16.md.
- **Quality tools in-project:** ESLint + Prettier, security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy), and app/sitemap.js + app/robots.js added to both Baja Land and SDAH. Scripts: `npm run lint`, `npm run format`. See `Websites/docs/Quality-Tools-Added-2025-02-16.md`.
- **Dependencies web dev suite:** New sub-agent `dependencies-web-dev-specialist` and full pip + npm suite. Pip: `requirements-web-dev.txt` at workspace root (installed). npm: `web-dev-toolkit/` with TypeScript, ESLint, Prettier, Stylelint, Tailwind, Sass, Jest, Playwright, Vitest (installed). See workspace `docs/Dependencies-Web-Dev-Suite-2025-02-16.md`.
- **Dev server 3001 fix:** Site was 500 due to missing `@tailwindcss/typography` and bad `.next` cache. Cleared `.next`, ran `npm install`, restarted dev server. All routes (/, /neighborhoods, /matchmaker, /newsletter) return 200. See `docs/Dev-Server-Fix-3001-2025-02-16.md`.

## 2025-02-15

- **Lifestyle Dashboard, Matchmaker, Newsletter:** Neighborhoods index + detail (LiveabilityScorecard, map placeholder), Matchmaker quiz → matches page, newsletter index + issue pages + events block, `newsletter:generate` script. See `docs/Lifestyle-Dashboard-Matchmaker-Newsletter-2025-02-15.md`.
- **Gallery & Instagram:** Both sections use 5 columns across on large screens (`lg:grid-cols-5`). See `docs/Gallery-Instagram-5-Columns-2025-02-15.md`.
- **Baja section image + logo:** La Escondida vista image and Baja Land Company logo added to the "Interested in Baja California land or property?" section. Image at top of card; logo to the right of the CTA button. Assets copied from `thebajalandcompany` into `public/images/`. See `docs/Baja-Section-La-Escondida-Logo-2025-02-15.md`.
