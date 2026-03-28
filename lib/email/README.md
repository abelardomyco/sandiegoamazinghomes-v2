# Email / newsletter (Phase 1)

- **newsletter.js** — `upsertNewsletterIssue()`, `getNewsletterIssueBySlug()`. Tracks issues in `newsletter_issues` table.
- Sending remains via existing flow or future provider (Resend, SendGrid). TODO: Production — set sent_at and recipient_count when sending; add provider API key.
