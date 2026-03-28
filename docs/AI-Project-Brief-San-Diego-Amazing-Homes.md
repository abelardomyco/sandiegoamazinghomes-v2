# San Diego Amazing Homes — AI / ChatGPT Project Brief

**Purpose:** Use this document with ChatGPT or other AI to continue developing the project. It describes the site, structure, images, and build state as of the last update.

---

## 1. Project overview

- **Site name:** San Diego Amazing Homes
- **Purpose:** Real estate site for San Diego County (USA) with Rosamelia Lopez-Platt, REALTOR®, Royal California Real Estate (DRE #02026714).
- **Live reference:** http://sandiegoamazinghomes.com/
- **Repo:** https://github.com/abelardomyco/sandiegoamazinghomes
- **Local dev:** http://localhost:3001 (port 3001; Baja Land uses 3000.)

---

## 2. Tech stack and structure

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** lucide-react
- **Content:** Markdown in `content/`; no mock data.

**Key folders:**

| Path | Purpose |
|------|--------|
| `app/` | Layout, `page.js` (home), `about/page.js`, `globals.css` |
| `components/` | `Header.js`, `Footer.js` |
| `content/` | `homepage.md`, `about.md`, `_meta.json` |
| `public/images/` | Hero banner, Rosamelia contact photo (Rosa-010.jpg), etc. |
| `public/images/sdah photos to use/` | All other images: Instagram + gallery (see Images section) |
| `scripts/` | `sync-to-main.js` (git push), `sync-instagram.js` (Instaloader) |
| `docs/` | Project and sync documentation |

---

## 3. Homepage sections (in order)

1. **Hero** — Banner image (`cropped-SDAH-web-banner.png`), H1 “San Diego Amazing Homes”, welcome paragraph from `content/homepage.md`, tagline “Houses are my passion!”
2. **CTAs** — Two compact cards: “Looking for a house?” and “Want to list your home?” (both link to `#contact`).
3. **Contact** — Two columns on large screens: left = Rosamelia photo (portrait, `Rosa-010.jpg`) + Royal California Real Estate logo under it (only place that logo is used); right = contact info (name, REALTOR®, email, phone, address) and “Rosamelia knows San Diego” bio. Logo image: `public/images/sdah photos to use/royal california real estate.png`.
4. **Follow on Instagram** — Grid of images from `sdah photos to use` that are **date-stamped** (Instaloader-style names, e.g. `2019-08-11_20-49-59_UTC_1.jpg`). Each links to Instagram. If none, shows note to run `npm run sync:instagram`.
5. **Gallery** — Grid of all images in `sdah photos to use` **except:** Rosamelia (rosa/rosamelia), Abelardo photo, Royal California logo, Baja Land Company logo. No captions/titles on gallery images.
6. **Baja California section** — Dedicated callout box: “Interested in Baja California land or property?” with short copy and button “Visit The Baja Land Company” (links to https://thebajalandcompany.com/).

---

## 4. About page

- **Route:** `/about`
- **Content:** From `content/about.md`; agent photo (`Rosa-010.jpg`) beside bio; contact block at bottom; “Back to Home” link.

---

## 5. Images — locations and usage

**Fixed paths (not from sdah folder):**

| Path | Description / usage |
|------|----------------------|
| `/images/cropped-SDAH-web-banner.png` | Home hero banner |
| `/images/Rosa-010.jpg` | Contact (home) and About page — main Rosamelia photo |
| `/images/Rosa-010-150x150.jpg` | No longer used in UI; was contact thumbnail |

**Folder: `public/images/sdah photos to use/`**

- **Instagram section:** Only files whose name **starts with a date** (e.g. `2022-07-02_19-51-12_UTC.jpg`) or contains `_profile_pic` (and not “rosamelia”). These are from Instaloader (@sandiegoamazinghomes).
- **Gallery section:** All image files in this folder **except** filenames containing: rosa, rosamelia, abelardo, royal california, baja land company. No captions shown.
- **Contact (logo only):** `royal california real estate.png` in this folder is used **only once** — under Rosamelia’s photo in the Contact block. Not used in gallery or elsewhere.

**Excluded from gallery only:** Abelardo-photo*, royal california real estate.png, the baja land company logo.png, and any Rosamelia/rosa-named files.

---

## 6. Content files

- **`content/homepage.md`** — Sections: Welcome, Tagline, CTAs, Footer. Parsed by home page for welcome text and tagline.
- **`content/about.md`** — About Us body copy.
- **`content/_meta.json`** — Pages list, contact info, partner; optional instagram.images / siteGallery (home page now reads Instagram and gallery from the **folder** above, not from _meta).

---

## 7. Scripts and sync

- **`npm run dev`** — Next.js dev server on port 3001.
- **`npm run sync`** / **`npm run push`** — Git add, commit (“chore: sync to main”), push to `origin main`.
- **`npm run sync:instagram`** — Runs Instaloader to download @sandiegoamazinghomes into `public/images/sdah photos to use/`, then moves files up and removes metadata. Requires Python and `pip install instaloader`. Run after new Instagram posts so the Instagram section (and gallery) update.

---

## 8. Build state summary

- Home and About pages implemented; contact, Instagram grid, gallery, and Baja callout working.
- Instagram and gallery images are **file-based**: read from `sdah photos to use` at request time; no hardcoded list in code for those.
- Royal California logo used only under Rosamelia’s photo; Rosamelia images only in contact (and About).
- No mock data; copy and links are real.

---

## 9. How to extend (for AI)

- **Add a page:** Create `app/route-name/page.js` and add a link in `Header.js` and `Footer.js` if needed.
- **Change copy:** Edit `content/homepage.md` or `content/about.md`; keep long text in content, not in components.
- **Add images to Instagram section:** Add date-stamped files to `sdah photos to use` (or run `npm run sync:instagram`).
- **Add images to gallery:** Add image files to `sdah photos to use`; exclude rosa/rosamelia/abelardo/royal california/baja land company from gallery logic if they should not appear there.
- **Change Baja section:** Edit the “Interested in Baja California land or property?” section and `PARTNER_SITE` in `app/page.js`.

---

*Document generated for use with ChatGPT or other AI when developing the San Diego Amazing Homes project. Update this file (and regenerate the PDF) when the project changes significantly.*
