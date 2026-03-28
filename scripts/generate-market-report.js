/**
 * AI Market Intelligence Generator
 *
 * Generates a monthly newsletter from market inputs and saves to
 * content/newsletter/{month}-{year}.md
 *
 * Usage:
 *   node scripts/generate-market-report.js [path-to-input.json]
 *   node scripts/generate-market-report.js
 *     (reads data/market-report-input.json if present, else uses defaults for current month)
 *
 * Input JSON shape:
 *   {
 *     "month": "03",
 *     "year": "2026",
 *     "median_price": 950000,
 *     "inventory": 1200,
 *     "days_on_market": 28,
 *     "mortgage_rates": 6.75,
 *     "migration_trends": "Net in-migration from LA and Bay Area; outflows to Arizona and Nevada."
 *   }
 *
 * Output sections:
 *   1. Market Snapshot
 *   2. Hot Neighborhoods
 *   3. Price Trends
 *   4. Luxury Market
 *   5. First-Time Buyer Insights
 */

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(process.cwd(), "content");
const NEWSLETTER_DIR = path.join(CONTENT_DIR, "newsletter");
const NEWSLETTER_INDEX = path.join(NEWSLETTER_DIR, "_index.json");
const NEIGHBORHOODS_INDEX = path.join(CONTENT_DIR, "neighborhoods", "_index.json");
const DEFAULT_INPUT_PATH = path.join(process.cwd(), "data", "market-report-input.json");

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

function getMonthName(m) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const i = parseInt(String(m).replace(/^0+/, "") || "1", 10) - 1;
  return months[Math.max(0, i)] || m;
}

function formatCurrency(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  const num = Number(n);
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
}

function formatPercent(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return `${Number(n).toFixed(2)}%`;
}

// --- Section generators (template-based market intelligence) ---

function sectionMarketSnapshot(input) {
  const median = formatCurrency(input.median_price);
  const inv = input.inventory != null ? Number(input.inventory).toLocaleString() : "—";
  const dom = input.days_on_market != null ? String(input.days_on_market) : "—";
  const rates = formatPercent(input.mortgage_rates);
  const migration = input.migration_trends && input.migration_trends.trim()
    ? input.migration_trends.trim()
    : "Migration data is mixed; San Diego continues to attract coastal and lifestyle buyers while some households seek more affordable markets elsewhere.";

  return `This month the San Diego County market shows a median sold price of **${median}** with **${inv}** active listings and an average of **${dom}** days on market. Mortgage rates are at **${rates}**, influencing both buyer budgets and seller expectations.

${migration}`;
}

function sectionHotNeighborhoods(input, neighborhoods) {
  const list = Array.isArray(neighborhoods) ? neighborhoods : [];
  const featured = list.filter((n) => n.featured);
  const pick = featured.length >= 3 ? featured.slice(0, 3) : list.slice(0, 3);
  if (pick.length === 0) {
    return "Coastal and North County areas continue to see strong interest; La Jolla, Del Mar, and Coronado remain top of mind for buyers seeking walkable, high-amenity neighborhoods.";
  }
  const bullets = pick.map((n) => `- **${n.name}** — ${n.shortIntro || n.region}`).join("\n");
  return `Neighborhoods drawing the most buyer traffic and quick moves this month:\n\n${bullets}`;
}

function sectionPriceTrends(input) {
  const median = input.median_price != null ? Number(input.median_price) : null;
  const rates = input.mortgage_rates != null ? Number(input.mortgage_rates) : null;
  let trend = "Prices have held steady with seasonal norms.";
  if (median != null) {
    if (median >= 1_100_000) trend = "Median price remains in the seven-figure range for much of the county, with coastal and North County tiers leading.";
    else if (median >= 850_000) trend = "The median sits in the upper tier; competition remains strong in entry-level and move-up segments.";
    else if (median >= 700_000) trend = "Price trends reflect a balanced mix of inventory; affordability remains a focus for first-time and relocating buyers.";
    else trend = "Relative to recent peaks, the median reflects a more accessible segment and some price sensitivity.";
  }
  const rateNote = rates != null && rates >= 7
    ? " Higher mortgage rates have compressed some budgets, putting a premium on well-priced listings."
    : rates != null && rates <= 6
      ? " Current rates have given qualified buyers more purchasing power compared to last year."
      : "";
  return `${trend}${rateNote}

We expect the usual seasonal lift into spring and summer, with the rate environment and inventory levels driving the pace of sales.`;
}

function sectionLuxuryMarket(input) {
  const median = input.median_price != null ? Number(input.median_price) : null;
  const dom = input.days_on_market != null ? Number(input.days_on_market) : null;
  let intro = "The luxury segment ($2M+) continues to attract out-of-state and coastal buyers.";
  if (median != null && median >= 900_000) {
    intro = "Strong median prices reflect sustained demand in the luxury tier; La Jolla, Del Mar, Rancho Santa Fe, and Coronado remain core luxury markets.";
  }
  const domNote = dom != null && dom <= 35
    ? " Days on market have stayed relatively tight, indicating that well-positioned luxury properties are still moving."
    : dom != null && dom > 45
      ? " Luxury inventory is taking slightly longer to absorb, giving serious buyers more room to negotiate."
      : "";
  return `${intro}${domNote}

Cash and jumbo financing continue to play a large role; we recommend working with a local lender who knows the high-end market.`;
}

function sectionFirstTimeBuyerInsights(input) {
  const rates = input.mortgage_rates != null ? Number(input.mortgage_rates) : null;
  const inv = input.inventory != null ? Number(input.inventory) : null;
  const dom = input.days_on_market != null ? Number(input.days_on_market) : null;
  let rateAdvice = "Rates are a key factor in monthly payments; locking when you find the right home can help with budgeting.";
  if (rates != null && rates >= 7) {
    rateAdvice = "With rates still elevated, first-time buyers should focus on pre-approval, down payment assistance programs, and neighborhoods that offer relative value—South Bay, Mission Valley, and some North County pockets can stretch budgets further.";
  } else if (rates != null && rates <= 6.5) {
    rateAdvice = "Current rates have improved from recent highs; first-time buyers with solid credit can still find competitive financing.";
  }
  const invNote = inv != null && inv > 1000
    ? " Inventory has improved, so there are more options to compare and less pressure to waive contingencies."
    : inv != null && inv < 800
      ? " Inventory remains tight; being pre-approved and ready to act quickly will help."
      : "";
  const domNote = dom != null && dom > 30
    ? " With days on market a bit higher, some listings may be open to reasonable offers or seller concessions."
    : "";
  return `First-time buyers in San Diego face a competitive but navigable market. ${rateAdvice}${invNote}${domNote}

We recommend starting with the [Matchmaker](/matchmaker) to narrow down neighborhoods by budget and lifestyle, then reviewing [neighborhood guides](/neighborhoods) to choose your short list.`;
}

// --- Build full report ---

function buildReport(input, neighborhoods) {
  const month = input.month != null ? String(input.month).padStart(2, "0") : String(new Date().getMonth() + 1).padStart(2, "0");
  const year = input.year != null ? String(input.year) : String(new Date().getFullYear());
  const slug = `${year}-${month}`;
  const title = `${getMonthName(month)} ${year}`;

  const sections = [
    ["Market Snapshot", sectionMarketSnapshot(input)],
    ["Hot Neighborhoods", sectionHotNeighborhoods(input, neighborhoods)],
    ["Price Trends", sectionPriceTrends(input)],
    ["Luxury Market", sectionLuxuryMarket(input)],
    ["First-Time Buyer Insights", sectionFirstTimeBuyerInsights(input)],
  ];

  const body = [
    `# ${title} — San Diego Amazing Homes`,
    "",
    "Monthly market intelligence for San Diego County homes and neighborhoods.",
    "",
    ...sections.flatMap(([heading, content]) => [`## ${heading}`, "", content, ""]),
    "## Call to action",
    "",
    "Ready to explore neighborhoods or find your match? [Take the Matchmaker](/matchmaker) or [browse neighborhoods](/neighborhoods). Questions? [Contact Rosamelia](/#contact).",
  ].join("\n");

  return { slug, title, date: `${year}-${month}-01`, body };
}

function main() {
  const inputPath = process.argv[2] || DEFAULT_INPUT_PATH;
  let input = readJson(inputPath);
  if (!input || typeof input !== "object") {
    const now = new Date();
    input = {
      month: String(now.getMonth() + 1).padStart(2, "0"),
      year: String(now.getFullYear()),
      median_price: 925000,
      inventory: 1100,
      days_on_market: 32,
      mortgage_rates: 6.85,
      migration_trends: "Net in-migration from LA and Bay Area; some outflows to Arizona and Nevada for affordability.",
    };
    console.warn("No input file or invalid JSON at", inputPath, "— using defaults for", input.year + "-" + input.month);
  }

  const neighborhoods = readJson(NEIGHBORHOODS_INDEX);
  const { slug, title, date, body } = buildReport(input, neighborhoods);

  ensureDir(NEWSLETTER_DIR);
  const mdPath = path.join(NEWSLETTER_DIR, `${slug}.md`);
  fs.writeFileSync(mdPath, body, "utf-8");
  console.log("Wrote", mdPath);

  let index = readJson(NEWSLETTER_INDEX);
  if (!Array.isArray(index)) index = [];
  const existing = index.find((i) => i.slug === slug);
  if (!existing) {
    index.push({ slug, title, date });
    index.sort((a, b) => (a.date < b.date ? 1 : -1));
    fs.writeFileSync(NEWSLETTER_INDEX, JSON.stringify(index, null, 2), "utf-8");
    console.log("Updated", NEWSLETTER_INDEX);
  } else {
    console.log("Entry already in index:", slug);
  }

  console.log("Done. Issue:", slug, "—", title);
}

main();
