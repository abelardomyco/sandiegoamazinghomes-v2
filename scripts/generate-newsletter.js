/**
 * Generate a new newsletter issue from template.
 * Usage: node scripts/generate-newsletter.js [YYYY-MM]
 * Example: node scripts/generate-newsletter.js 2026-04
 */
const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(process.cwd(), "content");
const NEIGHBORHOODS_INDEX = path.join(CONTENT_DIR, "neighborhoods", "_index.json");
const EVENTS_DIR = path.join(CONTENT_DIR, "events");
const NEWSLETTER_DIR = path.join(CONTENT_DIR, "newsletter");
const NEWSLETTER_INDEX = path.join(NEWSLETTER_DIR, "_index.json");

function getMonthArg() {
  const arg = process.argv[2];
  if (arg && /^\d{4}-\d{2}$/.test(arg)) return arg;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const slug = getMonthArg();
  const [year, month] = slug.split("-");
  const title = `${getMonthName(month)} ${year}`;

  const neighborhoods = readJson(NEIGHBORHOODS_INDEX);
  const index = Array.isArray(neighborhoods) ? neighborhoods : [];
  const featured = index.find((n) => n.featured) || index[0];
  const neighborhoodOfMonth = featured
    ? `${featured.name} — ${featured.shortIntro || "A neighborhood worth exploring."}`
    : "This month we're spotlighting a neighborhood that fits the season.";

  const eventsPath = path.join(EVENTS_DIR, `${slug}.json`);
  const eventsData = readJson(eventsPath);
  const hasEvents = eventsData && (
    (eventsData.lifestyleEvents?.length || 0) +
    (eventsData.openHousesOrWorkshops?.length || 0) +
    (eventsData.landAndEscapes?.length || 0)
  ) > 0;

  const body = `# ${title} — San Diego Amazing Homes

## Market Pulse

A brief note on what's moving the market this month—inventory, rates, and seasonal trends. *Placeholder: add curated copy when ready.*

## Neighborhood of the Month

${neighborhoodOfMonth}

## Best Sellers Area

Where homes are moving quickly and what's driving demand. *Placeholder: curated area highlight (e.g. Coastal).*

## Best Bargain Pick (curated)

One hand-picked area or pocket that offers relative value right now. *Placeholder: add when curated.*

## Events (Lifestyle + Homes + Land)

${hasEvents ? "See the events block below for this month's listings." : "*Events are injected from content/events when available.*"}

- **Lifestyle** — Local happenings, markets, festivals.
- **Homes** — Open houses, workshops, buyer/seller events.
- **Land** — Land and escape-style events if applicable.

## Call to action

Ready to explore neighborhoods or find your match? [Take the Matchmaker](/matchmaker) or [browse neighborhoods](/neighborhoods). Questions? [Contact Rosamelia](/#contact).
`;

  ensureDir(NEWSLETTER_DIR);
  const mdPath = path.join(NEWSLETTER_DIR, `${slug}.md`);
  fs.writeFileSync(mdPath, body, "utf-8");
  console.log("Wrote", mdPath);

  let issueIndex = readJson(NEWSLETTER_INDEX);
  if (!Array.isArray(issueIndex)) issueIndex = [];
  if (!issueIndex.some((i) => i.slug === slug)) {
    issueIndex.push({
      slug,
      title,
      date: `${year}-${month}-01`,
    });
    issueIndex.sort((a, b) => (a.date < b.date ? 1 : -1));
    fs.writeFileSync(NEWSLETTER_INDEX, JSON.stringify(issueIndex, null, 2), "utf-8");
    console.log("Updated", NEWSLETTER_INDEX);
  }

  console.log("Done. Issue:", slug);
}

function getMonthName(m) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const i = parseInt(m, 10) - 1;
  return months[i] || m;
}

main();
