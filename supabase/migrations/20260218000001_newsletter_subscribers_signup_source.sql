-- Add signup_source to newsletter_subscribers for tracking where subscriptions came from (e.g. market_page, homes_page, newsletter).
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS signup_source TEXT;
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_signup_source ON newsletter_subscribers (signup_source);
