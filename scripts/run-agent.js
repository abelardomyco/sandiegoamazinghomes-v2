/**
 * Run an agent from CLI (scaffold). Usage:
 *   node scripts/run-agent.js market_data
 *   node scripts/run-agent.js content [--month=04] [--year=2026]
 *   node scripts/run-agent.js content --write-neighborhood-summaries
 *
 * TODO: Production — wire to Vercel Cron or Supabase Edge Functions instead of manual run.
 */

const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

const { marketDataAgent, contentAgent } = require("../lib/agents");

async function main() {
  const agent = process.argv[2];
  const args = process.argv.slice(3);
  const config = {};
  for (const a of args) {
    if (a.startsWith("--month=")) config.month = a.slice(8);
    if (a.startsWith("--year=")) config.year = a.slice(7);
    if (a === "--write-neighborhood-summaries") config.writeNeighborhoodSummaries = true;
  }

  if (agent === "market_data") {
    console.log("Running Market Data Agent...");
    const result = await marketDataAgent.run(config);
    console.log(result.success ? result.result_summary : result.error_message);
    process.exit(result.success ? 0 : 1);
  }

  if (agent === "content") {
    console.log("Running Content Agent...");
    const result = await contentAgent.run(config);
    console.log(result.success ? result.result_summary : result.error_message);
    process.exit(result.success ? 0 : 1);
  }

  console.error("Usage: node scripts/run-agent.js market_data | content [--month=MM] [--year=YYYY] [--write-neighborhood-summaries]");
  process.exit(1);
}

main();
