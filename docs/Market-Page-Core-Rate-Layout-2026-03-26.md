# Market page — Core signals + Rate layout (2026-03-26)

## Why `ModuleRowFull` + wide Core row was still wrong

When **Shift vs last check** appeared, the page used **two stacked rows**: a `ModuleRow4` with only **three** children (Callout still **`sm:col-span-2`**, plus Inventory pulse and Shift), then **`ModuleRowFull`** wrapping **only** “Rate & financing pulse.”

`ModuleRowFull` was a **`w-full`** strip. The Rate **`MicroModule`** is also **`w-full`**, so on large screens the tile **stretched to the full content width** while the bullets stayed short—creating a **wide empty band** to the right. Visually, Rate looked “alone” in an oversized row and **Core signals** felt like a **dominant** block because the callout **spanned two columns** in the row above. That was a **mathematical row split** (3+1) rather than a **balanced four-tile dashboard row**.

## Layout rule changed

1. **Single `ModuleRow4`** for Core signals in **all** cases (with or without Shift).
2. **`CalloutModule`** accepts **`wideSpan`** (default `true`):
   - **No Shift** (three tiles): `wideSpan={true}` → **`sm:col-span-2`** so the row stays **2 + 1 + 1** on `lg` and fills the grid without a dead fourth column.
   - **With Shift** (four tiles): `wideSpan={false}` → **no column span** → **four equal columns** on `lg` (`1+1+1+1`).
3. **`ModuleRowFull`** for Rate was **removed**—Rate is never alone in a full-width wrapper for this section.

## How this avoids dead space

- **Rate** always sits in a **normal grid cell** beside other tiles, so the row width is **shared** by four modules of similar footprint (when Shift exists).
- **No second row** reserved for a single short module, so nothing is pushed down into an **empty-looking** full-width band.
- **Callout** only uses **two columns** when there are **three** tiles total; with four tiles it **does not** reserve double width, so Core signals reads as a **compact signal row**, not a wide block with Rate stranded below.

## Files

- `app/market/page.js` — `CalloutModule` `wideSpan`; Core signals JSX; `ModuleRowFull` removed.
