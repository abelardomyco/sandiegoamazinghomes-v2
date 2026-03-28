/**
 * Lead Agent
 * Tracks neighborhood clicks, saved homes/searches, stores lead events, prepares personalized recommendations (stub).
 * Does not send email. Call from API routes or server actions.
 */

function getSupabase() {
  try {
    const mod = require("../supabase");
    return (mod.createServerClient && mod.createServerClient()) || (mod.default && mod.default.createServerClient && mod.default.createServerClient()) || null;
  } catch (_) {
    return null;
  }
}

const EVENT_TYPES = {
  neighborhood_click: "neighborhood_click",
  saved_home: "saved_home",
  saved_search: "saved_search",
  contact: "contact",
  matchmaker_complete: "matchmaker_complete",
  home_click: "home_click",
};

/**
 * Store a lead event. Requires email OR anonymous_id.
 * @param {object} p - { event_type, email?, anonymous_id?, payload_json?, source_page? }
 * @returns {Promise<{ id?: string } | null>}
 */
async function recordLeadEvent(p) {
  const supabase = getSupabase();
  if (!supabase || !p || !p.event_type) return null;
  if (!p.email && !p.anonymous_id) return null;
  const row = {
    event_type: p.event_type,
    email: p.email ?? null,
    anonymous_id: p.anonymous_id ?? null,
    payload_json: p.payload_json ?? null,
    source_page: p.source_page ?? null,
  };
  const { data, error } = await supabase.from("lead_events").insert(row).select("id").single();
  if (error) {
    console.error("[lead-agent] recordLeadEvent error:", error);
    return null;
  }
  return { id: data.id };
}

/**
 * Track neighborhood click (convenience wrapper).
 */
async function recordNeighborhoodClick(p) {
  return recordLeadEvent({
    event_type: EVENT_TYPES.neighborhood_click,
    email: p.email ?? null,
    anonymous_id: p.anonymous_id ?? null,
    payload_json: { neighborhood_slug: p.neighborhood_slug },
    source_page: p.source_page ?? null,
  });
}

/**
 * Save a search. Requires user_id OR anonymous_id.
 */
async function saveSavedSearch(p) {
  const supabase = getSupabase();
  if (!supabase || (!p.user_id && !p.anonymous_id)) return null;
  const row = {
    user_id: p.user_id ?? null,
    anonymous_id: p.anonymous_id ?? null,
    name: p.name ?? null,
    filters_json: p.filters_json ?? {},
    notify: p.notify === true,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("saved_searches").insert(row).select("id").single();
  if (error) {
    console.error("[lead-agent] saveSavedSearch error:", error);
    return null;
  }
  return { id: data.id };
}

/**
 * Save a home. Requires user_id OR anonymous_id. listing_id (UUID) or external_id+source.
 */
async function saveSavedHome(p) {
  const supabase = getSupabase();
  if (!supabase || (!p.user_id && !p.anonymous_id)) return null;
  const row = {
    user_id: p.user_id ?? null,
    anonymous_id: p.anonymous_id ?? null,
    listing_id: p.listing_id ?? null,
    external_id: p.external_id ?? null,
    source: p.source ?? "cache",
    notes: p.notes ?? null,
  };
  const { data, error } = await supabase.from("saved_homes").insert(row).select("id").single();
  if (error) {
    console.error("[lead-agent] saveSavedHome error:", error);
    return null;
  }
  return { id: data.id };
}

/**
 * Prepare personalized recommendations (stub). Based on lead_events + saved_homes/saved_searches.
 * TODO: Production — query events by email/anonymous_id, infer preferences, return neighborhoods and listing ids.
 * @param {object} p - { email?, anonymous_id? }
 * @returns {Promise<{ neighborhoods: Array<{ slug, name }>, homes: Array<{ id, title }>, message: string }>}
 */
async function getPersonalizedRecommendations(p) {
  if (!p || (!p.email && !p.anonymous_id)) {
    return { neighborhoods: [], homes: [], message: "Sign in or provide a session to get recommendations." };
  }
  const supabase = getSupabase();
  if (!supabase) {
    return { neighborhoods: [], homes: [], message: "Recommendations service is not configured." };
  }
  let neighborhoods = [];
  let homes = [];
  let query = supabase.from("lead_events").select("event_type, payload_json").order("created_at", { ascending: false }).limit(20);
  if (p.email) query = query.eq("email", p.email);
  else if (p.anonymous_id) query = query.eq("anonymous_id", p.anonymous_id);
  const { data: events } = await query;
  if (events && events.length > 0) {
    const slugs = new Set();
    for (const e of events) {
      if (e.event_type === EVENT_TYPES.neighborhood_click && e.payload_json && e.payload_json.neighborhood_slug) {
        slugs.add(e.payload_json.neighborhood_slug);
      }
    }
    neighborhoods = Array.from(slugs).slice(0, 5).map((slug) => ({ slug, name: slug.replace(/-/g, " ") }));
  }
  const message = neighborhoods.length > 0 ? "Based on your recent activity we recommend these areas." : "Browse neighborhoods and save homes to get personalized recommendations.";
  return { neighborhoods, homes, message };
}

module.exports = {
  recordLeadEvent,
  recordNeighborhoodClick,
  saveSavedSearch,
  saveSavedHome,
  getPersonalizedRecommendations,
  EVENT_TYPES,
};
