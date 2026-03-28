# Instagram: feed removed (pre-launch) — 2026-03-28

## Current behavior

- **Homepage:** One **Instagram** section with copy + a **single external link** to  
  `https://www.instagram.com/sandiegoamazinghomes/` (opens in a **new tab**).
- **Footer:** Same profile link under **Follow**.

## Removed

- **`lib/instagram-graph.js`** — Instagram Graph API client.
- **`lib/instagram-home.js`** — `getInstagramFeedForHome()`, local Instaloader carousel selection, stale-folder logic.

## Still in use

- **`lib/sdah-photos-paths.js`** — `getSdahPhotosFolderConstants()` for the **homepage gallery** folder under `public/images/sdah photos to use/` (not Instagram-specific).
- **`npm run sync:instagram`** — Optional; syncs files into that folder for backup or manual gallery use. **Does not** power an embedded feed.

## Historical docs

Older documents (`Instagram-Home-Feed-Source-2026-03-26.md`, `Instagram-Module-Live-Feed-2026-03-24.md`, `SDAH-Debug-Market-Instagram-2026-03-26.md`, etc.) describe the **previous** feed architecture and are **not** authoritative for launch.

**Authoritative launch summary:** `docs/Pre-Launch-Audit-SDAH-2026-03-28.md`.
