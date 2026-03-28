/**
 * Content Agent (Phase 3)
 * Generates monthly market newsletter draft, market report draft, and short neighborhood update blurbs.
 * Writes to Supabase: market_reports, newsletter_issues. Does not send email.
 * Uses getMarketSnapshot() (placeholder or live), getNeighborhoodIndex(), getNeighborhoodStats(), buildReport().
 */

const { startRun, finishRun } = require("./runner");
const { buildReport } = require("../market-report-generator");
const { getMarketSnapshot } = require("../market-data");
const { getNeighborhoodIndex } = require("../content");
const { upsertMarketReport } = require("../market/reports");
const { upsertNewsletterIssue } = require("../email/newsletter");
const { getNeighborhoodStats } = require("../market/stats");

const AGENT_TYPE = "content";

/**
 * Generate monthly newsletter draft: build report from market snapshot + neighborhoods, write to market_reports and newsletter_issues.
 * @param {object} options - { month?, year?, input? } input overrides snapshot if provided
 * @returns {{ slug, title, success }}
 */
async function generateNewsletterDraft(options = {}) {
  const now = new Date();
  const month = options.month != null ? String(options.month).padStart(2, "0") : String(now.getMonth() + 1).padStart(2, "0");
  const year = options.year != null ? String(options.year) : String(now.getFullYear());
  const snapshot = options.input || getMarketSnapshot();
  const neighborhoods = getNeighborhoodIndex();
  const input = {
    month,
    year,
    median_price: snapshot.medianPrice,
    inventory: snapshot.inventory,
    days_on_market: snapshot.daysOnMarket,
    mortgage_rates: snapshot.mortgageRate,
    migration_trends: snapshot.migration_trends || null,
  };
  const report = buildReport(input, neighborhoods);
  const slug = report.slug;

  await upsertMarketReport({
    slug: report.slug,
    title: report.title,
    content_md: report.body,
    sections_json: report.sections_json,
    source_config: {
      type: "newsletter_draft",
      month,
      year,
      email_summary_md: report.email_summary_md || null,
    },
  });
  await upsertNewsletterIssue({ slug: report.slug, title: report.title, sent_at: null, recipient_count: null });
  return { slug, title: report.title, email_summary_md: report.email_summary_md, success: true };
}

/**
 * Generate market report draft (same as newsletter draft; persists to market_reports).
 */
async function generateMarketReportDraft(options = {}) {
  return generateNewsletterDraft(options);
}

/**
 * Generate neighborhood market summaries from latest stats + content. Returns array; optionally writes to market_reports.
 * @param {object} options - { writeToSupabase?: boolean }
 * @returns {Array<{ slug, name, summary }>}
 */
async function generateNeighborhoodSummaries(options = {}) {
  const neighborhoods = getNeighborhoodIndex();
  const stats = await getNeighborhoodStats({ limit: 200 });
  const statsBySlug = {};
  for (const s of stats) {
    if (!statsBySlug[s.neighborhood_slug]) statsBySlug[s.neighborhood_slug] = [];
    statsBySlug[s.neighborhood_slug].push(s);
  }

  const out = [];
  for (const n of neighborhoods) {
    const latest = (statsBySlug[n.slug] || [])[0];
    const median = latest?.median_price != null ? `Median price $${(latest.median_price / 1e6).toFixed(2)}M. ` : "";
    const inv = latest?.inventory != null ? `${latest.inventory} active listings. ` : "";
    const dom = latest?.days_on_market != null ? `${latest.days_on_market} days on market.` : "";
    const summary = `${median}${inv}${dom}`.trim() || `${n.name} — ${n.shortIntro || n.region}. Market data pending.`;
    out.push({ slug: n.slug, name: n.name, summary });
    if (options.writeToSupabase) {
      await upsertMarketReport({
        slug: `neighborhood-${n.slug}`,
        title: `${n.name} — Market Summary`,
        content_md: summary,
        sections_json: [{ title: "Summary", body: summary }],
        source_config: { type: "neighborhood_summary", neighborhood_slug: n.slug },
      });
    }
  }
  return out;
}

/**
 * Run the content agent: newsletter draft + market report draft + neighborhood summaries (no write by default).
 * @param {object} config - { month?, year?, writeNeighborhoodSummaries?: boolean }
 */
async function run(config = {}) {
  const runResult = await startRun(AGENT_TYPE, config);
  const runId = runResult?.id;
  try {
    const draft = await generateNewsletterDraft({ month: config.month, year: config.year });
    const summaries = await generateNeighborhoodSummaries({ writeToSupabase: config.writeNeighborhoodSummaries === true });
    const summary = `Draft: ${draft.slug}. Neighborhood summaries: ${summaries.length}.`;
    if (runId) await finishRun(runId, { success: true, result_summary: summary });
    return { success: true, result_summary: summary, draft, summariesCount: summaries.length };
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    if (runId) await finishRun(runId, { success: false, error_message: msg });
    return { success: false, error_message: msg };
  }
}

module.exports = {
  run,
  generateNewsletterDraft,
  generateMarketReportDraft,
  generateNeighborhoodSummaries,
  AGENT_TYPE,
};
