# Market page — explicit row groups (2026-03-26)

**Update:** Core signals + Rate composition revised again — **`ModuleRowFull` removed**; see **`docs/Market-Page-Core-Rate-Layout-2026-03-26.md`**.

## Goal

Stop using **one large `lg:grid-cols-4` container** for all sections. Each block is now **its own row group** with a grid that matches the **intended tile count**.

## Structure

Outer wrapper: `flex flex-col gap-1` containing, in order:

| Block | Row component | Tile count / notes |
|--------|----------------|---------------------|
| **Core signals** | `ModuleRow4` | Always one row: 3 tiles (Callout 2-col + two singles) or 4 tiles (Callout 1-col + three singles when Shift exists). No `ModuleRowFull`. |
| **Financial reality** | `ModuleRow4` | 4 tiles (mortgage, quick scenario, income, rent). |
| **Market interpretation** | `ModuleRow3` | 3 tiles. |
| **Geographic insights** | `ModuleRow4` | 4 tiles. |
| **Action layer** | `ModuleRow3` | 3 tiles. |

## Components (`app/market/page.js`)

- **`SectionLabel`** — `isFirst` optional; `w-full` (no `col-span-full` from old mega-grid).
- **`ModuleRow4`** — `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` + same gap/alignment as before.
- **`ModuleRow3`** — 3-column row; third tile `sm:col-span-2` to avoid orphan column on `sm`.
## What changed vs before

- Removed the **single parent grid** that wrapped labels + all modules.
- **Core signals:** `CalloutModule` **`wideSpan`** + single **`ModuleRow4`** (see Core-Rate layout doc); **`ModuleRowFull`** removed.

## Preserved

- Module content, order within each section, and visual direction (dense tiles, same borders/spacing tokens).
