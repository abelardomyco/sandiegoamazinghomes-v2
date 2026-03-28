/**
 * Newsletter issues tracking (newsletter_issues table).
 * Links to content/newsletter/{slug}.md. Send logic and provider (e.g. Resend, SendGrid) later.
 * TODO: Production — set sent_at and recipient_count when issue is sent; integrate with email provider API key.
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
 * Record or update an issue in newsletter_issues (e.g. when generating or sending).
 */
async function upsertNewsletterIssue({ slug, title, sent_at, recipient_count }) {
  const supabase = getSupabase();
  if (!supabase || !slug) return null;
  const row = {
    slug,
    title: title ?? null,
    sent_at: sent_at ?? null,
    recipient_count: recipient_count ?? null,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("newsletter_issues").upsert(row, { onConflict: "slug" });
  if (error) {
    console.error("[email/newsletter] upsertNewsletterIssue error:", error);
    return null;
  }
  return data?.[0] ?? null;
}

/**
 * Get issue by slug.
 */
async function getNewsletterIssueBySlug(slug) {
  const supabase = getSupabase();
  if (!supabase || !slug) return null;
  const { data, error } = await supabase.from("newsletter_issues").select("*").eq("slug", slug).single();
  if (error || !data) return null;
  return data;
}

module.exports = {
  upsertNewsletterIssue,
  getNewsletterIssueBySlug,
};
