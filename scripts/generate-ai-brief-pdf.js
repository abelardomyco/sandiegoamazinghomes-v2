/**
 * Generate docs/AI-Project-Brief-San-Diego-Amazing-Homes.html for printing to PDF.
 * Open the HTML file in a browser → Print → Save as PDF.
 */
const fs = require("fs");
const path = require("path");

const mdPath = path.join(__dirname, "..", "docs", "AI-Project-Brief-San-Diego-Amazing-Homes.md");
const htmlPath = path.join(__dirname, "..", "docs", "AI-Project-Brief-San-Diego-Amazing-Homes.html");

const md = fs.readFileSync(mdPath, "utf8");
const escaped = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>San Diego Amazing Homes — AI Project Brief</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 820px; margin: 2rem auto; padding: 0 1.5rem; color: #1e293b; line-height: 1.6; font-size: 14px; }
    pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; margin: 0; }
    @media print { body { max-width: none; padding: 1rem; } }
  </style>
</head>
<body>
<pre>${escaped}</pre>
<p style="margin-top:2rem;font-size:0.85rem;color:#64748b">To save as PDF: File → Print → Save as PDF (or choose "Microsoft Print to PDF").</p>
</body>
</html>`;

fs.writeFileSync(htmlPath, html, "utf8");
console.log("Wrote", htmlPath);
console.log("Open in a browser, then File → Print → Save as PDF.");
