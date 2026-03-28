# Market page — tight layout pass (2026-03-26)

## Issue

After the market dashboard restructure (section labels + module grid), vertical rhythm felt **loose**: extra air around section headers, tiles, and the pulse bar compared to the earlier compact “signal card” feel.

## Changes

- **`app/market/page.js`**
  - Page wrapper `space-y-2` → `space-y-1.5`; header `pb-1.5` → `pb-1`.
  - Module grid `gap-2` → `gap-1.5`.
  - **`SectionLabel`:** `pt-2` → `pt-1`, `pb-0.5` → `pb-0`, label `leading-none` (less line-box padding).
  - **`MicroModule`:** `px-3 py-2` → `px-2.5 py-1.5`; list `mt-1 space-y-1` → `mt-0.5 space-y-0.5`.
  - **`CalloutModule`:** slightly smaller padding; second paragraph `mt-1.5` → `mt-1`.
  - **`OneLineModule`:** `px-2.5 py-1.5` → `px-2 py-1`; kicker `leading-none`.
  - **`QuickScenarioModule`:** padding and list spacing tightened; subtitle `leading-tight`.
  - Footer strip `pt-2` → `pt-1`, `leading-snug`.
- **`components/market/MarketPulseBar.js`**
  - Bar `py-2` → `py-1.5`; chip row `gap-2` → `gap-1.5`; chips slightly smaller (`px`/`py`).
- **`components/market/MarketMiniMortgage.js`**
  - Section `px-3 py-2` → `px-2.5 py-1.5`; input grid and P&amp;I row `mt-1.5` → `mt-1`.

## Intent

Restore a **dense, scannable** market dashboard without changing copy or module order.

## Update report

`docs/update-reports/sdah-update-3-26-26-4-45pm.md` (2026-03-26, 4:45pm local).

---

**Note:** A follow-up **spacing audit** fixed the main visual issue (grid row stretch + root padding + margin normalization). See **`docs/Market-Page-Spacing-Audit-2026-03-26.md`**.
