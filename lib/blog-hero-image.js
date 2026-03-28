const { existsSync, readdirSync, statSync } = require("fs");
const { join, relative } = require("path");

const SDAH_DIR = join(process.cwd(), "public", "images", "sdah photos to use");
const PUBLIC_DIR = join(process.cwd(), "public");
const IMG_EXT = /\.(jpe?g|png|webp|gif)$/i;

function collectSunsetFiles(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) collectSunsetFiles(p, acc);
    else if (IMG_EXT.test(e.name) && /sunset/i.test(e.name)) acc.push(p);
  }
  return acc;
}

function fileToPublicUrl(absPath) {
  const rel = relative(PUBLIC_DIR, absPath);
  return `/${rel.split(/[/\\]/).map(encodeURIComponent).join("/")}`;
}

/**
 * Blog hero: image under sdah photos to use (any subfolder) whose filename contains "sunset" (case-insensitive).
 * If several match, the most recently modified wins.
 * @returns {string | null} public path or null if missing / no match
 */
function getBlogSunsetHeroPath() {
  try {
    if (!existsSync(SDAH_DIR)) return null;
    const files = collectSunsetFiles(SDAH_DIR);
    if (!files.length) return null;
    files.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
    return fileToPublicUrl(files[0]);
  } catch {
    return null;
  }
}

module.exports = { getBlogSunsetHeroPath };
