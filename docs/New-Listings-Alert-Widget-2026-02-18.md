# New Listings Alert subscription widget (2026-02-18)

## Overview

A compact subscription widget that collects email and writes to the existing `newsletter_subscribers` Supabase table, with a `signup_source` value to distinguish where the signup came from.

## Features

- Email input + "Notify me" CTA button
- Short bullet list describing what subscribers receive:
  - New listings in San Diego County as they hit the market
  - Weekly digest so you don't miss a fit
  - Unsubscribe anytime
- Uses `POST /api/subscribe` with `signup_source` set to `"market_page"` or `"homes_page"`

## Placement

- **Market page (`/market`):** Mid-page, after the Featured Listings + Neighborhood Market Leaders row, before Rosamelia Insight. Uses `signupSource="market_page"`.
- **Homes page (`/homes`):** Near the bottom, after the listings discovery section and before the "Questions or want to schedule a showing?" CTA block. Uses `signupSource="homes_page"`.

## Backend

- **API:** `app/api/subscribe/route.js` — accepts optional `signup_source` in the JSON body and stores it in `newsletter_subscribers.signup_source`.
- **Migration:** `supabase/migrations/20260218000001_newsletter_subscribers_signup_source.sql` adds the `signup_source` column (TEXT, nullable) and an index. Run migrations so the column exists before deploying.

## Component

- **`components/lead/NewListingsAlert.js`** — Client component; prop `signupSource` (default `"market_page"`). Compact card layout consistent with market dashboard; success state shows a short confirmation message.

## Table

Subscriptions are stored in **`newsletter_subscribers`** with:

- `email`, `name` (optional), `source_site` (e.g. sandiegoamazinghomes), `status` (active)
- **`signup_source`** — e.g. `"market_page"`, `"homes_page"`, or null (e.g. newsletter page signups)

Duplicate emails still trigger the existing "already subscribed" handling (unique constraint on email or similar).
