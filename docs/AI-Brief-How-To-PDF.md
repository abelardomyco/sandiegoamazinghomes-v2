# How to get the AI project brief as a PDF

The project includes an **AI / ChatGPT project brief** so you (or an AI) can continue developing from a single document.

## Option 1: Print HTML to PDF (recommended)

1. Run:
   ```bash
   npm run docs:pdf
   ```
   This creates **`docs/AI-Project-Brief-San-Diego-Amazing-Homes.html`**.

2. Open that HTML file in a browser (double-click or drag into Chrome/Edge).

3. Use **File → Print** (or Ctrl+P), then choose **Save as PDF** or **Microsoft Print to PDF** as the destination. Save as **`AI-Project-Brief-San-Diego-Amazing-Homes.pdf`** in the `docs/` folder (or anywhere you like).

You now have a PDF to attach when using ChatGPT or other AI for this project.

## Option 2: Automatic PDF via md-to-pdf

If you have `md-to-pdf` installed (it’s in devDependencies), you can run:

```bash
npm run docs:pdf:md2pdf
```

That converts the Markdown to PDF and writes **`docs/AI-Project-Brief-San-Diego-Amazing-Homes.pdf`**. The first run may take a while (Puppeteer/Chromium). If it fails or hangs, use Option 1.

## Source file

- **Markdown:** `docs/AI-Project-Brief-San-Diego-Amazing-Homes.md`  
  Edit this when the project changes, then regenerate the HTML (and PDF if you use Option 1 or 2).

The brief includes: project overview, tech stack, homepage and about structure, image locations and usage, content files, scripts, build state, and how to extend. It does **not** embed image binaries; it describes where images live and how they’re used so an AI can work with the codebase.
