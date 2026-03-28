# Update reports — PDFs optional (2026-03-25)

## Policy

**Do not** generate PDF companions for update reports unless the user **explicitly asks** for a PDF.

## Rules updated (workspace)

- `Websites/.cursor/rules/document-and-backup.mdc` — replaced mandatory MycoDAO PDF block with “only when requested.”
- `Websites/.cursor/rules/update-report-titles.mdc` — PDF section is now “only if the user asks.”
- `Websites/.cursor/rules/update-report-location.mdc` — full three-site report: Markdown required; PDF on request only.
- `Websites/.cursor/rules/full-update-pdf.mdc` — same for `Full-Update-All-Three-Sites-*.md`.

## Scripts

- `sandiegoamazinghomes/scripts/generate-update-report-pdf.js` — comment updated to match policy.

## Report wording

- `docs/update-reports/sdah-update-3-24-26-6-37pm.md` — PDF section notes optional generation command.
