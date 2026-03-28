# Update Report — San Diego Amazing Homes

**Date:** 2026-03-14  
**Site:** San Diego Amazing Homes (SDAH)  
**Local URL:** http://localhost:3001  
**Project path:** `Websites/sandiegoamazinghomes/`

This report summarizes the current state of the San Diego Amazing Homes Next.js site. A PDF copy is provided alongside this file in `docs/update-reports/`.

---

## 1. Overview

San Diego Amazing Homes is a lifestyle and neighborhood discovery site for San Diego–area home buyers and relocators. It offers neighborhood profiles with liveability scores, a matchmaker quiz, newsletter with Supabase-backed subscriptions, and integration with The Baja Land Company for Baja California property interest.

---

## 2. Tech stack

| Item | Value |
|------|--------|
| **Framework** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS, `@tailwindcss/typography` |
| **Content** | Markdown in `content/`; JSON indices (`_index.json`) for neighborhoods, newsletter, events |
| **Images** | `public/images/` (neighborhoods, gallery, Instagram, Baja) |
| **Backend / CMS** | Supabase (`newsletter_subscribers`, `contact_submissions`) |
| **Scripts** | `sync-to-main.js`, `sync-instagram.js`, `generate-newsletter.js`, `generate-ai-brief-pdf.js` |

---

## 3. Routes and pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.js` | Homepage: hero, carousels (Instagram + Gallery), neighborhoods teaser, matchmaker CTA, Baja section, contact |
| `/about` | `app/about/page.js` | About Us (Rosamelia, Royal California logo) |
| `/neighborhoods` | `app/neighborhoods/page.js` | Neighborhood list with filter (region, vibe tags), score summaries (Strong / Less) |
| `/neighborhoods/[slug]` | `app/neighborhoods/[slug]/page.js` | Neighborhood detail: hero, prose, LiveabilityScorecard, next steps |
| `/matchmaker` | `app/matchmaker/page.js` | Lifestyle matchmaker quiz |
| `/matches` | `app/matches/page.js` | Match results (top 3 neighborhoods with fit %, hero images) |
| `/newsletter` | `app/newsletter/page.js` | Newsletter index, latest issue, subscribe form |
| `/newsletter/[slug]` | `app/newsletter/[slug]/page.js` | Newsletter issue (prose, sidebar, subscribe) |

**API:** `POST /api/subscribe` — newsletter signup (email, optional name, `source_site`); writes to Supabase `newsletter_subscribers`.

---

## 4. Neighborhoods (16)

Content and order are driven by `content/neighborhoods/_index.json`. Each neighborhood has:

- **Slug, name, region, vibeTags, heroImage, shortIntro, featured**
- **scores** — dimensions (e.g. Upscale, Walkable, Cost-friendly, Family-friendly, Coastal, Foodie, Artsy, Urban, Chill) with values 1–10

**Current order (4 per row):**  
Row 1: La Jolla, Del Mar, Rancho Santa Fe, Coronado.  
Row 2: Carlsbad, Solana Beach, Encinitas, Pacific Beach.  
Row 3: Carmel Valley, Little Italy, Mission Valley, Bonita.  
Row 4: Poway, Rancho del Rey, Otay, Eastlake.

Detail pages use `content/neighborhoods/{slug}.md` (frontmatter + sections: The vibe, Who it's best for, Getting around, Local favorites, Rosamelia notes). List cards show **Strong:** (top 3 scores) and **Less:** (bottom 2). LiveabilityScorecard on detail shows Strong/Less with numbers and compact layout.

---

## 5. Key features

- **Header / footer:** Dark gradient theme, nav with active state, mobile menu, newsletter link, Instagram.
- **Image carousels:** Embla-based carousels on homepage for Instagram and Gallery (responsive 1–2–3–4 columns).
- **Neighborhood filter:** Region dropdown + vibe tags; count and summary.
- **Matchmaker:** Multi-step quiz; results with fit % and hero images; sessionStorage + query params for matches.
- **Newsletter:** List/detail pages; inline SubscribeForm posting to Supabase; duplicate-email handling.
- **Baja section:** La Escondida image, Baja Land Company logo, CTA button (compact style).
- **Royal California logo:** Shown under Rosamelia’s photo on Homepage Contact and About Us (200px, centered).

---

## 6. Supabase

- **Env:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`; `.env.example` documents both.
- **Tables:**  
  - `newsletter_subscribers` — id, email, name, source_site, status, subscribed_at; unique on (email, source_site).  
  - `contact_submissions` — id, site, name, email, message, created_at (for future contact forms).
- **lib/supabase.js** — server client; **app/api/subscribe/route.js** — validates, inserts, handles 23505, returns 503 if Supabase not configured.

---

## 7. Quality and tooling

- **ESLint + Prettier:** `npm run lint`, `npm run format`.
- **Security headers:** X-Frame-Options, X-Content-Type-Options, Referrer-Policy (next.config).
- **Sitemap / robots:** `app/sitemap.js`, `app/robots.js`.

---

## 8. Docs (in `docs/`)

| Doc | Description |
|-----|-------------|
| `Agent-Handoff.md` | Brief log for agents; last updated 2026-02-19. |
| `Visual-Redesign-2026-02-16.md` | Design system, header/footer, carousels, Supabase CMS. |
| `Neighborhood-Scores-Streamline-2026-02-16.md` | Scores object, Strong/Less, compact list and detail. |
| `Neighborhoods-Order-Images-Streamline-2026-02-16.md` | 16 neighborhoods, order, grid, new .md files. |
| `Newsletter-Subscriptions-And-Furthering-2026-02-16.md` | Supabase table, view/export, CTAs, ideas. |
| `Baja-Logo-Button-Fix-2026-02-16.md` | Baja button size, logo size. |
| `Lifestyle-Dashboard-Matchmaker-Newsletter-2025-02-15.md` | Neighborhoods index/detail, matchmaker, newsletter. |
| `AI-Project-Brief-San-Diego-Amazing-Homes.md` | Project brief (PDF via `npm run docs:pdf`). |

---

## 9. How to run

```bash
cd sandiegoamazinghomes
npm install
npm run dev
```

Dev server: **http://localhost:3001** (port 3001).

---

## 10. Summary

San Diego Amazing Homes is a content-driven Next.js site with 16 neighborhoods (scores, filters, detail pages), matchmaker quiz, newsletter with Supabase subscriptions, dark-theme UI, Embla carousels, and Baja/contact integration. Content lives in `content/`; images in `public/images/`. Update reports and PDFs are stored in `docs/update-reports/`.
