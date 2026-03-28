# Lifestyle Dashboard, Matchmaker & Newsletter (2025-02-15)

## What changed

Added a **Neighborhood Liveability Dashboard**, **Matchmaker** quiz, and **Monthly Newsletter** engine to the San Diego Amazing Homes Next.js 14 app. All content is file-based in `content/`; no MLS scraping, no mock listings.

---

### Phase 0 — Repo sanity

- Confirmed SDAH repo (port 3001), `app/`, `content/`, `public/images/` exist.
- Created: `content/neighborhoods/`, `content/newsletter/`, `content/events/`, `lib/`, `components/neighborhoods/`, `components/newsletter/`, `scripts/` (scripts already existed).

### Phase 1 — Content model

- **content/neighborhoods/_index.json** — Array of 3 neighborhoods: `la-jolla`, `north-park`, `encinitas` (slug, name, region, vibeTags, heroImage, shortIntro, featured).
- **content/neighborhoods/{slug}.md** — Markdown with frontmatter and sections: The vibe, Who it's best for, Getting around, Local favorites, Rosamelia notes.
- **content/newsletter/_index.json** — Array of issues (slug, title, date).
- **content/newsletter/2026-03.md** — Template issue with Market Pulse, Neighborhood of the Month, Best Sellers, Best Bargain, Events, CTA.
- **content/events/2026-03.json** — `lifestyleEvents`, `openHousesOrWorkshops`, `landAndEscapes` (title, dateRange, area, url).

### Phase 2 — Library helpers

- **lib/content.js** (Node/fs, server-only): `getNeighborhoodIndex()`, `getNeighborhoodBySlug(slug)`, `getNewsletterIndex()`, `getNewsletterBySlug(slug)`, `getEventsByMonth(slugOrYYYYMM)`.
- **lib/markdown.js** — `parseMarkdownSections(body)`, `firstSentence(content)` for scorecard blurbs.
- **package.json** — Added `gray-matter`, `react-markdown`, `@tailwindcss/typography`. Script: `newsletter:generate`.

### Phase 3 — UI components

- **components/neighborhoods/LiveabilityScorecard.js** — Vibe tags + 5 descriptive cards (Commute feel, Walkability feel, Family/schools feel, Quiet vs lively, Value right now). Uses section blurbs from markdown or fallback.
- **components/neighborhoods/NeighborhoodMap.js** — Placeholder only: “Map coming next” + link to /neighborhoods. **No Mapbox integration.**

### Phase 4 — Pages

- **app/neighborhoods/page.js** — Lists neighborhoods from index; **NeighborhoodList** (client) for region dropdown + vibe chips filter; cards with heroImage, shortIntro, tags, “View dashboard” → `/neighborhoods/[slug]`.
- **app/neighborhoods/[slug]/page.js** — Hero (image + title), markdown body (ReactMarkdown), LiveabilityScorecard, NeighborhoodMap placeholder, CTA (Contact + Take the Matchmaker). Images fall back to `/images/cropped-SDAH-web-banner.png` if missing.
- **app/matchmaker/page.js** — Server component passes `getNeighborhoodIndex()` to **MatchmakerForm** (client).
- **components/matchmaker/MatchmakerForm.js** — 5-step form: budget, commute, vibe (chips), schools priority, beach proximity. On submit: `matchNeighborhoods(neighborhoods, answers)` → top 3 slugs; store in sessionStorage; navigate to `/matches?slugs=...`.
- **app/matches/page.js** — Reads `searchParams.slugs`, resolves to neighborhood list from index, shows cards with links to dashboards + “Contact Rosamelia” CTA.

### Phase 5 — Newsletter

- **app/newsletter/page.js** — Lists issues from _index.json; subscribe CTA (mailto placeholder).
- **app/newsletter/[slug]/page.js** — Renders issue markdown + **NewsletterEventsBlock** (events from `content/events/{slug}.json`: Lifestyle, Open houses & workshops, Land & escapes). CTA + subscribe mailto.
- **scripts/generate-newsletter.js** — `node scripts/generate-newsletter.js [YYYY-MM]`. Reads neighborhoods index + events for month; writes new issue markdown and appends to newsletter _index.json. Template: market pulse placeholder, neighborhood-of-month = first featured, best sellers/bargain placeholders, events note.

### Phase 6 — Navigation

- **components/Header.js** — Added: Neighborhoods, Matchmaker, Newsletter.
- **components/Footer.js** — Added same links.

### Phase 7 — Validation

- `npm install` and `npm run build` were run; build may hit EPERM on `.next` on Windows (file lock). Code is structured for static generation where possible.
- No fake stats; only curated descriptive copy.
- Hero images use fallback path when missing.

---

## Checklist: next additions

- [ ] **Mapbox / react-map-gl** — Integration point is **NeighborhoodMap.js**; replace placeholder with map when ready.
- [ ] **Supabase (or similar)** — Persist matchmaker quiz results and newsletter subscriptions when needed.
- [ ] **Admin workflow** — Add/edit neighborhoods and newsletter issues (CMS or file-based tooling).

---

## Files touched / added

| Area | Paths |
|------|------|
| Content | `content/neighborhoods/_index.json`, `content/neighborhoods/la-jolla.md`, `north-park.md`, `encinitas.md`, `content/newsletter/_index.json`, `content/newsletter/2026-03.md`, `content/events/2026-03.json` |
| Lib | `lib/content.js`, `lib/markdown.js` |
| Components | `components/neighborhoods/LiveabilityScorecard.js`, `NeighborhoodMap.js`, `NeighborhoodList.js`, `components/matchmaker/MatchmakerForm.js`, `components/newsletter/NewsletterEventsBlock.js` |
| App | `app/neighborhoods/page.js`, `app/neighborhoods/[slug]/page.js`, `app/matchmaker/page.js`, `app/matches/page.js`, `app/newsletter/page.js`, `app/newsletter/[slug]/page.js` |
| Scripts | `scripts/generate-newsletter.js` |
| Config | `package.json` (deps + `newsletter:generate`), `tailwind.config.js` (typography plugin) |
| Nav | `components/Header.js`, `components/Footer.js` |
