/**
 * Sync Instagram @sandiegoamazinghomes into public/images/sdah photos to use.
 * Optional backup / asset folder sync only — the live site does not embed an Instagram feed.
 *
 * Requires: Python + Instaloader (pip install instaloader)
 * Usage: npm run sync:instagram
 *
 * Optional: run on a schedule (e.g. daily cron or GitHub Action).
 * --fast-update stops once it hits posts already on disk (faster incremental runs).
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const sdahDir = path.join(projectRoot, "public", "images", "sdah photos to use");
const profile = "sandiegoamazinghomes";

if (!fs.existsSync(sdahDir)) {
  fs.mkdirSync(sdahDir, { recursive: true });
}

console.log("Syncing Instagram @%s into sdah photos to use...", profile);

try {
  execSync(
    `instaloader --fast-update --no-videos --no-video-thumbnails --no-compress-json --no-profile-pic "${profile}"`,
    {
      cwd: sdahDir,
      stdio: "inherit",
      shell: true,
    }
  );
} catch (e) {
  console.error("Instaloader failed (install with: pip install instaloader).", e.message);
  process.exit(1);
}

const subdir = path.join(sdahDir, profile);
if (fs.existsSync(subdir)) {
  const files = fs.readdirSync(subdir);
  for (const f of files) {
    const src = path.join(subdir, f);
    if (fs.statSync(src).isFile()) {
      fs.renameSync(src, path.join(sdahDir, f));
    }
  }
  fs.rmdirSync(subdir, { recursive: true });
}

// Remove metadata files so only images remain
const all = fs.readdirSync(sdahDir);
for (const f of all) {
  if (f.endsWith(".json.xz") || f.endsWith(".txt") || f === "id") {
    try {
      fs.unlinkSync(path.join(sdahDir, f));
    } catch (_) {}
  }
}

console.log("Done. Files are in sdah photos to use/ (optional use for gallery or archives).");
