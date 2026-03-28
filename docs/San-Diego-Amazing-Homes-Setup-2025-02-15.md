# San Diego Amazing Homes — Project Setup (2025-02-15)

## What was done

Created a new Next.js website for **San Diego Amazing Homes** within the same workspace (`Websites`), as a sibling project to The Baja Land Company.

## Reference

- **Live site:** http://sandiegoamazinghomes.com/
- **GitHub repo:** https://github.com/abelardomyco/sandiegoamazinghomes

## Files and folders created

### Project root: `sandiegoamazinghomes/`

| Path | Purpose |
|------|--------|
| `package.json` | Next.js 14, React, Tailwind, lucide-react; dev on port **3001** |
| `next.config.mjs` | Next config (no remote images yet) |
| `tailwind.config.js` | Tailwind with `sd` color palette (San Diego blue/teal) |
| `postcss.config.js` | PostCSS for Tailwind |
| `jsconfig.json` | Path alias `@/*` |
| `README.md` | How to run and project structure |

### App

| Path | Purpose |
|------|--------|
| `app/layout.js` | Root layout, Source Serif 4 font, Header/Footer, metadata |
| `app/globals.css` | Tailwind + header mobile/desktop breakpoints |
| `app/page.js` | Home: welcome (from content), CTAs, contact, about blurb, Instagram, partner link |
| `app/about/page.js` | About Us: body from content/about.md, contact block |

### Components

| Path | Purpose |
|------|--------|
| `components/Header.js` | Sticky header, nav (Home, About Us), mobile menu |
| `components/Footer.js` | Links (Home, About Us, The Baja Land Company), Instagram, copyright |

### Content

| Path | Purpose |
|------|--------|
| `content/_meta.json` | Pages list, contact, Instagram, partner (no mock data) |
| `content/homepage.md` | Welcome, tagline, CTAs (sectioned for parser) |
| `content/about.md` | About Us body copy |

### Public

| Path | Purpose |
|------|--------|
| `public/images/.gitkeep` | Keep images dir in git |
| `public/images/Images-README.md` | Where to add logo, hero, agent photos |

### Docs

| Path | Purpose |
|------|--------|
| `docs/San-Diego-Amazing-Homes-Setup-2025-02-15.md` | This file |

## Decisions

- **Port 3001** (Baja Land uses 3000; see `.cursor/rules/dev-server.mdc`).
- **Content-driven:** Copy from `content/`; no hardcoded long text in components.
- **Partner link** to The Baja Land Company (and Baja site already links to SDAH).
- **No mock data:** Contact info, Instagram, and partner URL are real.
- **No blog or listings** in this initial scaffold; can be added later (e.g. Estatik-style features).

## Next steps

1. From workspace root: `cd sandiegoamazinghomes && npm install && npm run dev` → http://localhost:3001
2. Add logo or hero images to `public/images/` if desired (see `public/images/Images-README.md`).
3. Optionally connect Instagram feed (token/API) or listing/MLS when ready; document in `content/_meta.json` or env.
