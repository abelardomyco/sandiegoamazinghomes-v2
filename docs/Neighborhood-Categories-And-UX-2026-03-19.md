# Neighborhood categories + UX tweak — 2026-03-19

## Goal

Fix trust-breaking neighborhood filters by reclassifying neighborhoods into real lifestyle categories (multi-category per neighborhood), and add a small UX hint on `/neighborhoods`.

## Category system (vibe tags)

Updated `vibeTags` on each neighborhood to use only:

- Village
- Artsy
- Coastal
- Urban
- Suburban
- Value
- Luxury

Each neighborhood can have **multiple** categories and the filter UI supports this via multi-select.

## UX addition

Added a single clean line above the neighborhoods list:

> “Click any neighborhood to see what it’s actually like to live there.”

## Files changed

- `content/neighborhoods/_index.json`
- `app/neighborhoods/page.js`

