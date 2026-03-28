/**
 * Agent run logging and execution stub.
 * TODO: Production — wire to Vercel Cron, Supabase Edge Functions, or external scheduler.
 * Live API keys and production integrations go in the adapter calls invoked by startRun/finishRun.
 */

function getSupabase() {
  try {
    const mod = require("../supabase");
    return (mod.createServerClient && mod.createServerClient()) || (mod.default && mod.default.createServerClient && mod.default.createServerClient()) || null;
  } catch (_) {
    return null;
  }
}

/**
 * Start an agent run and return run id.
 * @param {string} agentType - e.g. "market_report", "listing_sync", "stats_ingest"
 * @param {object} config - optional config_json
 * @returns {Promise<{ id: string } | null>}
 */
async function startRun(agentType, config = {}) {
  const supabase = getSupabase();
  if (!supabase || !agentType) return null;
  const { data, error } = await supabase
    .from("agent_runs")
    .insert({ agent_type: agentType, status: "running", config_json: config })
    .select("id")
    .single();
  if (error) {
    console.error("[agents/runner] startRun error:", error);
    return null;
  }
  return { id: data.id };
}

/**
 * Mark a run as completed or failed.
 * @param {string} runId - UUID from startRun
 * @param {object} result - { success: boolean, result_summary?: string, error_message?: string }
 */
async function finishRun(runId, result = {}) {
  const supabase = getSupabase();
  if (!supabase || !runId) return;
  await supabase
    .from("agent_runs")
    .update({
      status: result.success ? "completed" : "failed",
      finished_at: new Date().toISOString(),
      result_summary: result.result_summary ?? null,
      error_message: result.error_message ?? null,
    })
    .eq("id", runId);
}

module.exports = {
  startRun,
  finishRun,
};
