# Instagram feed — homepage not updating (2026-03-26)

## Symptom

Homepage `/` Instagram carousel was showing **very old** Instaloader images (newest date-stamped file on disk: **2022-07-02**).

`npm run sync:instagram` was attempted and hit **HTTP 429 Too Many Requests**, scheduling a retry ~30 minutes later.

## Root cause

- Instagram Graph API env vars are **not set** (`INSTAGRAM_ACCESS_TOKEN` missing), so homepage falls back to **local Instaloader images** in `public/images/sdah photos to use/`.
- Local folder contains only older date-stamped post images, so the carousel appears “not updated.”

## What we changed

- Homepage now shows a **stale local sync warning** when it detects folder-fallback + newest saved post is older than ~45 days.
  - Shows the newest saved post date.
  - Recommends either:
    - setting `INSTAGRAM_ACCESS_TOKEN` (preferred, keeps posts fresh without Instaloader), or
    - running `npm run sync:instagram` (with a note about 429 rate limits).

## Files touched

- `app/page.js`

## Next steps to actually show newer posts

1. **Preferred**: set `INSTAGRAM_ACCESS_TOKEN` in `sandiegoamazinghomes/.env.local` (optional `INSTAGRAM_USER_ID` if needed for your token type), then restart dev server.
2. **Fallback**: run `npm run sync:instagram` **after** the 429 cooldown window, and avoid running multiple times in a short period.

