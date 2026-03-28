# Instagram homepage module — newest posts & live API (2026-03-24)

**Update (2026-03-26):** Authoritative **source matrix**, stale local behavior, and **`revalidate` 120s** are documented in **`docs/Instagram-Home-Feed-Source-2026-03-26.md`**. The notes below remain as historical setup context.

## What you see on the site

The **Follow on Instagram** carousel on `/`:

1. **If `INSTAGRAM_ACCESS_TOKEN` is set** in `.env.local`, it loads the **latest posts** from the Instagram Graph API (Meta). The homepage is revalidated about every **hour** (`revalidate = 3600`), so new posts show up without redeploying and without running Instaloader.
2. **Otherwise** it uses images in `public/images/sdah photos to use/` that look like **Instaloader** post filenames (`YYYY-MM-DD_...`), **newest first**, up to **24** images. Profile-picture downloads are excluded from this strip.

Previously, files were sorted **A→Z**, which put **oldest** dates first; that is fixed.

## Automatic reflection after you post (recommended)

1. In [Meta for Developers](https://developers.facebook.com/), create or use an app with **Instagram** / **Instagram Graph API** enabled.
2. Connect **@sandiegoamazinghomes** as an Instagram **Professional** account (Business or Creator) and complete the Facebook Page + token steps described in Meta’s docs for **user media**.
3. Create a **long-lived access token** that can read `/{ig-user-id}/media` (or `me/media` where supported).
4. Add to **`.env.local`** (never commit secrets):

   ```bash
   INSTAGRAM_ACCESS_TOKEN=your-long-lived-token
   ```

   If `graph.instagram.com/me/media` returns an error for your token, also set:

   ```bash
   INSTAGRAM_USER_ID=your_instagram_business_account_id
   ```

   The code tries, in order: `graph.instagram.com/{id}/media`, `graph.instagram.com/me/media`, and `graph.facebook.com/v19.0/{id}/media`.

5. Restart `npm run dev` / redeploy. Within about an hour of posting, the module should show new content (or sooner on the next request after cache expiry).

## File-based sync (no Meta app)

- Run **`npm run sync:instagram`** from the project root (requires Python and `pip install instaloader`).
- The script now uses **`--fast-update`** so repeat runs stop at posts you already have.
- Instagram may respond with **HTTP 429** if Instaloader runs too often or while the mobile app is hitting the API—wait and retry later, or use the **Graph API** path above for production.
- Commit the new files under `public/images/sdah photos to use/` if you want them on production without the API.

## Code touched

- `lib/instagram-graph.js` — API fetch + carousel-shaped payload.
- `app/page.js` — async home, `getInstagramImagesForHome()`, sort/limit for folder mode, `revalidate`.
- `components/ui/ImageCarousel.js` — per-slide `href`, `unoptimized` for `https://` image URLs.
- `scripts/sync-instagram.js` — `--fast-update`.
- `.env.example` — Instagram variables documented.
