# Gallery and Instagram: 5 Images Across (2025-02-15)

## What was done

- **Instagram** and **Gallery** sections now show **5 images across** the width of the page on large viewports.
- Grid remains responsive on smaller screens: 2 cols (default), 3 at `sm`, 4 at `md`, **5 at `lg`** (1024px+).

## Code

- **File:** `sandiegoamazinghomes/app/page.js`
- Instagram grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2`
- Gallery grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3`
