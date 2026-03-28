# Instagram & Gallery source + sync (2025-02-15)

## Where images come from

- **Instagram section (Follow on Instagram):** Only images that were downloaded from the Instagram account **@sandiegoamazinghomes**. The app reads `public/images/sdah photos to use/` and uses files whose names look like Instaloader output (date-stamped, e.g. `2019-08-11_20-49-59_UTC_1.jpg`). No other images are shown in this section.

- **Gallery section:** All images in `public/images/sdah photos to use/` **except** Rosamelia images (any filename containing "rosa" or "rosamelia"). Rosamelia photos are used only in the **Contact** block (profile photo + Royal California logo). The gallery shows everything else (website images + Instagram post images).

## Keeping the Instagram section up to date (agent / monitor)

When new images are uploaded to **@sandiegoamazinghomes**, run the sync so the site reflects them:

1. **Manual (after posting to IG):**
   ```bash
   npm run sync:instagram
   ```
   Requires Python and Instaloader: `pip install instaloader`. The script downloads new posts into `public/images/sdah photos to use/`, then the **Instagram** section (and **Gallery**, for non-Rosamelia images) will show them on the next build or refresh.

2. **Scheduled (agent monitor):**
   - **Windows Task Scheduler:** Create a task that runs `npm run sync:instagram` (or `node scripts/sync-instagram.js`) daily or weekly from the project root.
   - **GitHub Actions:** Add a workflow that runs the sync on a schedule (e.g. `cron: '0 9 * * *'` for daily 9am UTC), then commits updated images and pushes so the deployed site gets new photos.
   - **Cron (Mac/Linux):** `0 9 * * * cd /path/to/sandiegoamazinghomes && npm run sync:instagram`

After sync, rebuild or redeploy the site so the new files are included. The homepage reads the folder at build/request time, so no code change is needed when new images are added.

## File rules

| Location        | Source folder              | What’s included                                                                 |
|----------------|----------------------------|----------------------------------------------------------------------------------|
| Instagram section | `sdah photos to use`   | Only date-stamped files (e.g. `2022-07-02_19-51-12_UTC.jpg`) from Instaloader.  |
| Gallery section   | `sdah photos to use`   | All image files except those whose name contains `rosa` or `rosamelia`.         |
| Contact            | Fixed paths            | Rosamelia photo and Royal California logo only (not from gallery).              |
