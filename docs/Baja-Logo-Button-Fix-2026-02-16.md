# Baja Section: Logo vs Button Size Fix (2026-02-16)

## What was done

- **Reverted** the "Visit The Baja Land Company" button to its previous size: `px-4 py-2.5 text-sm`, icon `w-4 h-4`, `gap-2` (it had been enlarged by mistake).
- **Enlarged** the Baja Land Company logo (image next to the button): container from `h-[2.75rem] w-28` to `h-[5rem] w-56` (final size after user requested "bigger"), and image `sizes="224px"`.

## File

- `sandiegoamazinghomes/app/page.js` — Baja California callout section (button + logo link/image).

## Intent

User wanted the **logo** larger, not the button; this change corrects that.
