/**
 * San Diego County Housing Intelligence Report builder.
 * Used by Content Agent and scripts. Produces:
 * - Full newsletter (content_md, sections_json) with 6 fixed sections
 * - Email-ready summary
 * Sections: Market Pulse, What Changed This Month, Hottest Neighborhoods,
 * Opportunity Areas, Featured Homes, Rosamelia Insight.
 * Concise, data-driven language; report format, not blog.
 */

const {
  getLeaderboards,
  getHotNeighborhoods,
  getPriceChangeWatch,
  getBuyerAdvantage,
  getRosameliaInsight,
} = require("./market-data");

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
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
}

function formatPercent(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return `${Number(n).toFixed(2)}%`;
}

// --- Section 1: Market Pulse ---
/** One short paragraph: median, inventory, DOM, buyer-advantage label, rate. Data-only; no filler. */
function sectionMarketPulse(input) {
  const median = formatCurrency(input.median_price);
  const inv = input.inventory != null ? Number(input.inventory) : null;
  const dom = input.days_on_market != null ? Number(input.days_on_market) : null;
  const rate = input.mortgage_rates != null ? Number(input.mortgage_rates) : null;
  const advantage = getBuyerAdvantage();

  const parts = [];
  parts.push(`County median sold price **${median}**.`);
  if (inv != null) parts.push(`**${inv.toLocaleString()}** active listings.`);
  if (dom != null) parts.push(`**${dom}** days on market (avg).`);
  if (rate != null) parts.push(`Mortgage rate **${formatPercent(rate)}**.`);
  parts.push(`Market tilt: **${advantage.label}** (${advantage.score}/10).`);

  return parts.join(" ");
}

// --- Section 2: What Changed This Month ---
/** Bullet list of concrete changes; numbers only. */
function sectionWhatChangedThisMonth(input) {
  const median = input.median_price != null ? Number(input.median_price) : null;
  const inv = input.inventory != null ? Number(input.inventory) : null;
  const dom = input.days_on_market != null ? Number(input.days_on_market) : null;
  const rates = input.mortgage_rates != null ? Number(input.mortgage_rates) : null;
  const bullets = [];
  if (median != null) bullets.push(`**Median price** — ${formatCurrency(median)} (county).`);
  if (inv != null) bullets.push(`**Inventory** — ${inv.toLocaleString()} active listings.`);
  if (dom != null) bullets.push(`**Days on market** — ${dom} days (avg).`);
  if (rates != null) bullets.push(`**Rates** — ${formatPercent(rates)}.`);
  if (bullets.length === 0) return "Data refresh pending. [Matchmaker](/matchmaker) · [Neighborhoods](/neighborhoods).";
  return bullets.join("\n\n");
}

// --- Section 3: Hottest Neighborhoods ---
/** Top 4–5 by demand; from leaderboards + hotNeighborhoods. One line each + links. */
function sectionHottestNeighborhoods(input, neighborhoods) {
  const leaderboards = getLeaderboards();
  const hot = getHotNeighborhoods();
  const hottest = (leaderboards.hottest && leaderboards.hottest.length) ? leaderboards.hottest : hot;
  const list = (hottest.slice(0, 5) || []).map((h) => {
    const name = h.name || (neighborhoods && neighborhoods.find((n) => n.slug === h.slug)?.name) || h.slug;
    const blurb = (h.blurb || "").trim() ? ` — ${h.blurb}` : "";
    return `- **${name}**${blurb} [Guide](/neighborhoods/${h.slug}) · [Matchmaker](/matchmaker)`;
  });
  if (list.length === 0) {
    return "La Jolla, Del Mar, Coronado, Carmel Valley lead demand. [Matchmaker](/matchmaker) · [Neighborhoods](/neighborhoods).";
  }
  return list.join("\n");
}

// --- Section 4: Opportunity Areas ---
/** Best value + price-reduction areas; data-driven one-liners. */
function sectionOpportunityAreas(input, neighborhoods) {
  const leaderboards = getLeaderboards();
  const priceWatch = getPriceChangeWatch();
  const bestValue = (leaderboards.bestValue || []).slice(0, 3);
  const reductions = (priceWatch || []).filter((p) => p.priceChangePct < 0).slice(0, 3);

  const lines = [];
  if (bestValue.length) {
    const names = bestValue.map((b) => b.name || b.slug).join(", ");
    lines.push(`**Best value (price vs. location):** ${names}. More inventory and room to negotiate.`);
  }
  if (reductions.length) {
    const items = reductions.map((r) => `${r.name} (${r.priceChangePct}%)`).join("; ");
    lines.push(`**Price reductions:** ${items}. [Matchmaker](/matchmaker).`);
  }
  if (lines.length === 0) {
    return "Mission Valley, Bonita, Little Italy often show more supply and softer pricing. [Neighborhoods](/neighborhoods) · [Matchmaker](/matchmaker).";
  }
  return lines.join("\n\n");
}

// --- Section 5: Featured Homes ---
/** Inventory count + CTA; no generic “updated regularly.” */
function sectionFeaturedHomes(input) {
  const inv = input.inventory != null ? Number(input.inventory) : null;
  if (inv != null) {
    return `**${inv.toLocaleString()}** active listings county-wide. Want a tailored list by area or price? [Contact](/#contact) · [Matchmaker](/matchmaker).`;
  }
  return "[Matchmaker](/matchmaker) · [Neighborhoods](/neighborhoods) · [Contact](/#contact).";
}

// --- Section 6: Rosamelia Insight ---
/** One short paragraph; use data feed when available, else data-aware fallback. */
function sectionRosameliaInsight(input) {
  const insight = getRosameliaInsight();
  if (insight && insight.trim()) {
    return insight.trim() + " — *Rosamelia* [Contact](/#contact)";
  }
  const median = formatCurrency(input.median_price);
  const inv = input.inventory != null ? Number(input.inventory) : null;
  const parts = [];
  parts.push(`This month’s numbers put the county median at ${median}.`);
  if (inv != null && inv < 1100) parts.push("Inventory is still tight in the best zip codes—well-priced listings move fast.");
  if (inv != null && inv >= 1100) parts.push("Buyers have a bit more choice than a year ago; sellers should still price to comps and show well.");
  parts.push("If you’re weighing a move, I’m happy to talk through what I’m seeing on the ground. — *Rosamelia* [Get in touch](/#contact)");
  return parts.join(" ");
}

/**
 * Build email-ready summary: 2–4 sentences + one CTA. Data-driven.
 */
function buildEmailSummary(input, neighborhoods) {
  const monthName = getMonthName(input.month);
  const median = formatCurrency(input.median_price);
  const inv = input.inventory != null ? Number(input.inventory).toLocaleString() : "—";
  const advantage = getBuyerAdvantage();
  const hot = getHotNeighborhoods().slice(0, 2).map((h) => h.name).join(" and ") || "Coastal and North County";

  const opening = `${monthName} San Diego County: median ${median}, ${inv} active listings. Market: ${advantage.label}.`;
  const second = `Hottest demand: ${hot}.`;
  const cta = "Full report and neighborhood notes on the site; reply for a tailored list.";
  return [opening, second, cta].join(" ");
}

/**
 * Build full Housing Intelligence Report and email summary.
 * @param {object} input - { month, year, median_price, inventory, days_on_market, mortgage_rates }
 * @param {Array} neighborhoods - from getNeighborhoodIndex()
 * @returns {{ slug, title, date, body, sections_json, email_summary_md }}
 */
function buildReport(input, neighborhoods) {
  const month = input.month != null ? String(input.month).padStart(2, "0") : String(new Date().getMonth() + 1).padStart(2, "0");
  const year = input.year != null ? String(input.year) : String(new Date().getFullYear());
  const slug = `${year}-${month}`;
  const monthName = getMonthName(month);
  const title = `San Diego County Housing Intelligence Report — ${monthName} ${year}`;
  const date = `${year}-${month}-01`;

  const sections = [
    { heading: "Market Pulse", content: sectionMarketPulse(input) },
    { heading: "What Changed This Month", content: sectionWhatChangedThisMonth(input) },
    { heading: "Hottest Neighborhoods", content: sectionHottestNeighborhoods(input, neighborhoods || []) },
    { heading: "Opportunity Areas", content: sectionOpportunityAreas(input, neighborhoods || []) },
    { heading: "Featured Homes", content: sectionFeaturedHomes(input) },
    { heading: "Rosamelia Insight", content: sectionRosameliaInsight(input) },
  ];

  const sectionsJson = sections.map((s) => ({ title: s.heading, body: s.content }));
  const body = [
    `# ${title}`,
    "",
    "Data-driven snapshot for San Diego County. From Rosamelia Lopez-Platt and San Diego Amazing Homes.",
    "",
    ...sections.flatMap((s) => [`## ${s.heading}`, "", s.content, ""]),
    "---",
    "",
    "[Matchmaker](/matchmaker) · [Neighborhoods](/neighborhoods) · [Contact](/#contact)",
  ].join("\n");

  const email_summary_md = buildEmailSummary(input, neighborhoods);

  return {
    slug,
    title,
    date,
    body,
    sections_json: sectionsJson,
    email_summary_md,
  };
}

module.exports = {
  buildReport,
  buildEmailSummary,
  getMonthName,
  formatCurrency,
  formatPercent,
};
