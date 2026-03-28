ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS source TEXT;
CREATE INDEX IF NOT EXISTS idx_contact_submissions_source ON contact_submissions (source);
