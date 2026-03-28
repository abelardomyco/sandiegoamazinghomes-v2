# Neighborhood pages — remove broken Ask Rosamelia section (2026-03-26)

## Request

Remove the non-working bottom **Ask Rosamelia** section from neighborhood detail pages, and keep the working floating/bubble CTA that routes to contact/email.

## What changed

- Updated `app/neighborhoods/[slug]/page.js`.
- Removed import of `AskRosameliaWidget`.
- Removed `<AskRosameliaWidget source="market_widget" />` from the bottom stack.
- Kept `LeadCaptureArea` in place.

## Scope

This template powers all routes under `/neighborhoods/[slug]`, so the removal applies across all neighborhood pages.

## Preserved

- Existing neighborhood content and markdown sections
- Existing map + scorecard + next steps cards
- Existing floating “Ask Rosamelia about…” bubble CTA behavior

## Verification

- `npx eslint app/neighborhoods/[slug]/page.js` passed.
- No linter errors reported by workspace diagnostics.