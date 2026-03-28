/**
 * Server-side Supabase client for API routes and CLI scripts.
 * Uses service role or anon key from env. CJS export so Node scripts (e.g. run-agent.js) can require() it.
 */
function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

function getSupabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

function createServerClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  if (!url || !key) return null;
  try {
    const { createClient } = require("@supabase/supabase-js");
    return createClient(url, key);
  } catch (_) {
    return null;
  }
}

module.exports = { createServerClient };
module.exports.default = { createServerClient };
