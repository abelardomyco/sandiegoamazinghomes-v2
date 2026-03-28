# SDAH Visual Redesign — 2026-02-16

Summary of the visual redesign and CMS integration completed for San Diego Amazing Homes.

## What changed

### Design system
- **tailwind.config.js:** Added `sd-950`, `boxShadow.card` / `card-hover` / `header`, `backgroundImage` gradients (`gradient-header`, `gradient-footer`, `gradient-section`, `gradient-accent`), and keyframe animations (`fadeIn`, `slideUp`, `slideDown`).
- **app/globals.css:** Custom scrollbar, `.card-hover`, `.section-light` / `.section-alt` / `.section-dark`, `.section-divider`, `.btn-primary` / `.btn-secondary`, `.input-field` / `.select-field`, `.tag` / `.tag-default` / `.tag-active`, and base Embla carousel classes.

### Header and footer
- **Header:** Dark gradient background (`bg-gradient-header`), white/light text, brand block with icon, nav with active underline, scroll shadow, mobile slide-down menu with icons. Contact button in nav.
- **Footer:** Dark gradient (`bg-gradient-footer`), multi-column layout (Brand, Quick Links, Stay in Touch, Social), newsletter signup teaser linking to `/newsletter`, Instagram link.

### Homepage
- **ImageCarousel (components/ui/ImageCarousel.js):** Embla-based carousel with prev/next arrows, dot indicators, responsive slide count (1 → 2 → 3 → 4). Used for Instagram and Gallery instead of full grids.
- **Sections:** Alternating `section-light` / `section-alt`, improved CTA cards with `shadow-card` and `card-hover`, Baja card with shadow.

### Neighborhoods
- **NeighborhoodList:** Filter panel in a card with Filter icon, styled `select-field`, vibe tags as `tag` with checkmark when active, filter summary (“X neighborhoods in Y region”). Neighborhood cards with region badge, `shadow-card`, `card-hover`.
- **Regions:** Added East County (La Mesa), South Bay (Chula Vista), Inland (Poway). Six regions total; new content files: `content/neighborhoods/la-mesa.md`, `chula-vista.md`, `poway.md`.
- **LiveabilityScorecard:** Icons per card (Car, Footprints, GraduationCap, Volume2, TrendingUp, Sparkles), 3-column grid on large screens, `shadow-card` and `card-hover`, vibe tags in `sd-100` pills.

### Matchmaker
- **Page:** Wrapper with `bg-gradient-section` and negative margin for full-bleed background.
- **MatchmakerForm:** Card with `border-t-4 border-t-sd-600`, `shadow-card`, `select-field` and `tag` classes, `btn-primary` for Next/See my matches. Progress bar with step labels.
- **Match algorithm:** Returns top 3 with a `fitPercent` (0–100). Stored in sessionStorage and passed via `?slugs=...&scores=...`.

### Matches page
- **Layout:** Larger cards with hero image on the left (or full-width on mobile), rank badge, “X% fit” badge, region, short intro, vibe tags, “View dashboard” link. CTA block with `btn-primary`.

### Newsletter
- **List page:** “Latest issue” highlighted card, “All issues” list, Subscribe block with inline form (no mailto).
- **Detail page:** Prose with `prose-lg` and custom blockquote/heading styles, sidebar with “More issues” (prev/next or link to list) and Subscribe form. “What’s next?” CTA block.
- **SubscribeForm (components/newsletter/SubscribeForm.js):** Client component with email (required), optional name, submit to `POST /api/subscribe`, success/error states. `compact` prop for sidebar.

### Supabase CMS
- **Env:** `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `.env.example` documents both.
- **Tables (Supabase migration applied):**
  - `newsletter_subscribers`: `id`, `email`, `name`, `source_site`, `status`, `subscribed_at`; unique on `(email, source_site)`; RLS allows insert.
  - `contact_submissions`: `id`, `site`, `name`, `email`, `message`, `created_at`; RLS allows insert (for future contact forms).
- **lib/supabase.js:** `createServerClient()` returns Supabase client or null if env missing.
- **app/api/subscribe/route.js:** POST body `email`, `name?`, `source_site` (default `sandiegoamazinghomes`). Validates email, inserts into `newsletter_subscribers`. Handles duplicate (23505) with friendly message. Returns 503 if Supabase not configured.

## New files
- `components/ui/ImageCarousel.js`
- `components/newsletter/SubscribeForm.js`
- `lib/supabase.js`
- `app/api/subscribe/route.js`
- `content/neighborhoods/la-mesa.md`, `chula-vista.md`, `poway.md`

## Dependencies added
- `embla-carousel-react`
- `@supabase/supabase-js`

## How to add neighborhoods
1. Add an entry to `content/neighborhoods/_index.json` (slug, name, region, vibeTags, heroImage, shortIntro, featured).
2. Create `content/neighborhoods/{slug}.md` with frontmatter and markdown sections (The vibe, Who it's best for, Getting around, Local favorites, Rosamelia notes).

## How to add newsletter issues
1. Add an entry to `content/newsletter/_index.json` (slug, title, date).
2. Create `content/newsletter/{slug}.md` with frontmatter and body.
3. Optionally add `content/events/{slug}.json` with `lifestyleEvents`, `openHousesOrWorkshops`, `landAndEscapes`.
4. Or run `npm run newsletter:generate` with a month (e.g. `YYYY-MM`) to generate from template.

## Reusing the CMS for other sites
Use the same `newsletter_subscribers` table with a different `source_site` (e.g. `thebajalandcompany`). Ensure `SOURCE_SITES` in `app/api/subscribe/route.js` includes the new site, or make it configurable via env.
