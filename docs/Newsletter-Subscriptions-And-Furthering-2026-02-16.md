# Newsletter: Where Subscriptions Are Recorded & Furthering the Newsletter

**Date:** 2026-02-16

## Where subscriptions are recorded

- **Database:** Supabase (project linked via `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`).
- **Table:** `newsletter_subscribers`
  - Columns: `id`, `email`, `name`, `source_site`, `status`, `subscribed_at`
  - Unique on `(email, source_site)` so the same email can subscribe once per site (e.g. sandiegoamazinghomes, thebajalandcompany).
- **API:** `POST /api/subscribe` — accepts `email` (required), optional `name`, and `source_site` (defaults to `sandiegoamazinghomes`). Inserts into `newsletter_subscribers` with `status: "active"`. Duplicate emails get a friendly “already subscribed” response.

**How to view or export subscribers:** Use the Supabase dashboard → Table Editor → `newsletter_subscribers`. You can filter by `source_site`, export CSV, or use SQL. No in-app admin UI exists yet; all management is via Supabase.

---

## Furthering the newsletter: options

1. **In-app admin (future):** A simple protected page or route that lists subscribers (and optionally contact submissions) by reading from Supabase, with export to CSV. Requires auth (e.g. Supabase Auth or a secret token).
2. **Email delivery:** Subscribers are stored only in Supabase. To send the actual newsletter, use a separate tool:
   - **Export + Mailchimp/Constant Contact:** Periodically export `newsletter_subscribers` (e.g. CSV) and import/sync to your email provider.
   - **Supabase + Edge Function + Resend/SendGrid:** An Edge Function that runs on a schedule or trigger, reads active subscribers, and sends via an email API. Requires configuring Resend/SendGrid and keeping sending logic in one place.
3. **Promotion:** Add a clear CTA on the homepage (“Get the next issue”), link from footer and blog/newsletter list, and mention the newsletter in the matchmaker or neighborhoods CTAs.
4. **Double opt-in (optional):** Add a “confirm your email” step: store `status: "pending"` on insert, send a confirmation link (via Resend/SendGrid), then set `status: "active"` when the user clicks. Improves list quality and deliverability.

Summary: **Subscriptions are recorded in Supabase in `newsletter_subscribers`.** To further the newsletter, either wire Supabase to an email sender (export + provider or Edge Function) and/or add an in-app admin and more visible CTAs.
