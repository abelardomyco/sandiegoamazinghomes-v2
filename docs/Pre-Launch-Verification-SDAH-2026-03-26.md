# Pre-launch verification — San Diego Amazing Homes (2026-03-26)

Scope: verification, tightening, and **small** code fixes only — no redesign, no new features.

---

## Part 1 — Build + env

| Item | Status |
|------|--------|
| `npm run build` | **Not completed in this environment** (Next.js compile ran &gt;8m with minimal log output; known Windows `.next`/I/O issues). **Run `npm run build` locally or in CI before deploy.** |
| `localhost` in app/components | **None** in `app/` or `components/` (only docs/README/scripts mention localhost for dev). |
| `NEXT_PUBLIC_SITE_URL` | Used in root `layout.js`, page metadata, blog, neighborhoods, about, `SiteJsonLd.js`. |
| Sitemap + robots base URL | **Tightened:** new `lib/public-site-url.js` — strips trailing slashes, prepends `https://` to `VERCEL_URL` (host-only on Vercel). Used by `app/sitemap.js` and `app/robots.js`. |
| `.env.example` | **Updated** with commented `NEXT_PUBLIC_SITE_URL` and purpose. |

---

## Part 2 — Admin

| Item | Status |
|------|--------|
| Login | `POST /api/admin/session` — password vs `ADMIN_DASHBOARD_PASSWORD`, signed cookie via `ADMIN_SESSION_SECRET`; 503 if unset. |
| Session | httpOnly cookie, `secure` in production, `sameSite: lax`, 7-day maxAge; HMAC verification in `middleware.js`. |
| Indexing | `app/admin/layout.js` — `robots: { index: false, follow: false, nocache: true }`. |
| Sitemap | `/admin` **not** listed (only public routes in `sitemap.js`). |
| Navigation | **No** admin link in `Header` / `Footer` (grep). |
| Dashboard | Server snapshot via `loadAdminDashboardSnapshot()`; shows explicit errors if Supabase read fails (e.g. RLS → service role note). |

---

## Part 3 — Analytics

| Item | Status |
|------|--------|
| Plausible | `app/layout.js` — `Script` only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set; otherwise **renders nothing** (no errors). |
| Production | `strategy="afterInteractive"`, `https://plausible.io/js/script.js`. |

---

## Part 4 — Contact + data flow

| Item | Status |
|------|--------|
| `POST /api/contact` | Validates email + message; inserts `contact_submissions` with `site: sandiegoamazinghomes`. |
| Supabase missing | **503** + JSON error: direct email fallback message (no silent failure). |
| Supabase insert error | **500** + user-facing error + `console.error`. |
| Newsletter `POST /api/subscribe` | Same pattern: 503 if no client; duplicate email handled (200 + message); other errors 500 + log. |
| UI | `AskRosameliaWidget` — on network error, message now includes **amazinghsd@gmail.com** (small clarity pass). |

**Note:** There is **no** server-side email send; “fallback” is **messaging** to contact Rosamelia by email when the API is unavailable.

---

## Part 5 — SEO (final check)

| Item | Status |
|------|--------|
| Main pages | Home, about, blog index, neighborhoods index, market — title, description, canonical (or metadataBase-relative where applicable). |
| Blog posts | `generateMetadata` + **BlogPosting** JSON-LD in `app/blog/[slug]/page.js`. |
| Global schema | `SiteJsonLd` — **RealEstateAgent** + **WebSite**. |
| Sitemap | Public marketing routes + blog/neighborhood/newsletter slugs only — **no** `/admin`, `/api`, thin utility routes. |
| Robots | Allow `/`; disallow `/admin/`, `/api/`; sitemap URL uses `getPublicSiteUrl()`. |
| Newsletter | **Canonicals added** on `/newsletter` and `/newsletter/[slug]` via `getPublicSiteUrl()`. |

---

## Part 6 — Market page trust pass

| Item | Status |
|------|--------|
| Numbers | Signals driven by `data/market-placeholder.json` + `lib/market-data.js` — framed as estimates where appropriate; tagline “no fake precision” kept. |
| Modules | No empty `MicroModule`s (empty line arrays return `null`). |
| Freshness | **Badge:** “**Updated this week**” when `snapshot.updatedAt` is within the last 7 days or is dated in the future (stale data shows `Updated YYYY-MM-DD`). |
| Metadata | Market **Open Graph `url`** set to canonical market URL via `getPublicSiteUrl()`. |

---

## Minor improvements made (this pass)

1. `lib/public-site-url.js` + `robots.js` / `sitemap.js` URL normalization and Vercel-safe `https://` prefix.  
2. Market: freshness chip + OG `url`.  
3. Newsletter index + issue pages: **canonical** URLs.  
4. `.env.example`: `NEXT_PUBLIC_SITE_URL` documented.  
5. Ask Rosamelia: network error text includes support email.

---

## Confirmed ready (when env is set)

- Production domain via `NEXT_PUBLIC_SITE_URL`.  
- Supabase keys for forms/subscribe.  
- Admin secrets for internal dashboard.  
- Optional Plausible domain.  
- Successful **production build** on your runner.

---

## Last warnings before deployment

1. **Build** must pass on CI or a clean machine; do not rely on this session’s long-running Windows build.  
2. Set **`NEXT_PUBLIC_SITE_URL`** to the live origin (no trailing slash) so canonicals, sitemap, and OG match production.  
3. **Admin:** use a strong `ADMIN_SESSION_SECRET`; cookie is `secure` only when `NODE_ENV === "production"`.  
4. **Dashboard contacts:** if rows don’t load, use **`SUPABASE_SERVICE_ROLE_KEY`** server-side or relax RLS for reads.  
5. **Market data:** placeholder JSON is intentional until live feeds; refresh `snapshot.updatedAt` when you update content for the new badge logic.

---

## Suggested launch smoke test

- [ ] `/`, `/about`, `/market`, `/blog`, `/neighborhoods`, `/contact` (redirect to `/#contact`)  
- [ ] Submit contact + newsletter on staging  
- [ ] `/admin/login` → dashboard → logout  
- [ ] View `/robots.txt` and `/sitemap.xml` on production host  
- [ ] Optional: Plausible realtime after setting `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
