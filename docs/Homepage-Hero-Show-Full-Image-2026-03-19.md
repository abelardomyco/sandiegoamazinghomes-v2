# Homepage hero image: show full image — 2026-03-19

## Goal

Ensure the homepage hero banner shows the **full image** (no cropping).

## Change

- `app/page.js`: changed hero image from `object-cover` to `object-contain` and added a subtle `bg-slate-100` so letterboxing looks intentional while keeping rounded corners.

