# Homepage Instagram module — data source and freshness (2026-03-26)

## Which source is used

| Condition | Source | Notes |
|-----------|--------|--------|
| `INSTAGRAM_ACCESS_TOKEN` is set **and** the Graph API returns at least one media item | **Instagram Graph API** (`lib/instagram-graph.js`) | CDN image URLs; each slide links to the post `permalink`. |
| Token missing, or every Graph endpoint fails / returns no usable media | **Local folder** `public/images/sdah photos to use/` | Instaloader-style filenames; order = **newest file `mtime` first**, then filename date. |
| Local folder has images but the **newest `mtime`** is older than **45 days** | **No carousel** | Visitors see a short CTA to Instagram instead of old thumbnails (see `lib/instagram-home.js`). |
| No API images and no files in the folder | **Empty state** | Friendly copy + link to Instagram. |

Implementation: `getInstagramFeedForHome()` in `lib/instagram-home.js`. Comments at the top of that file describe the full decision tree.

## Live API mode

1. Create a long-lived Instagram Graph access token in Meta (Instagram professional account + Facebook Page as required by Meta).
2. Add to `.env.local` (and production env):

   ```bash
   INSTAGRAM_ACCESS_TOKEN=your-token
   # Optional if /me/media is wrong for your token type:
   # INSTAGRAM_USER_ID=your-instagram-user-id
   ```

3. Restart the dev server or redeploy. The homepage **prefers** API results whenever the token is present and the fetch succeeds.

If the token is invalid or rate-limited, check server logs for `[instagram-graph]` warnings; the site falls back to the local folder when the API returns nothing usable.

## Refreshing local sync (no API)

```bash
npm run sync:instagram
```

(Uses Instaloader; running too often can trigger HTTP 429 — see existing project docs.)

After sync, filesystem `mtime` updates so folder ordering and “staleness” reflect the latest download time.

## Caching

- **Route ISR:** `export const revalidate = 120` in `app/page.js` (seconds).
- **Graph `fetch`:** `next.revalidate: 120` in `lib/instagram-graph.js`.

Adjust these together if you change freshness expectations.

## What operators should *not* put in the UI

Technical details (token names, sync commands, “fallback mode”) belong in this doc and logs only. The public homepage uses neutral copy (“Recent Instagram highlights”, or a CTA when the carousel is hidden).
