/**
 * Generate PDF from an update report markdown in docs/update-reports/.
 * Run from sandiegoamazinghomes/: node scripts/generate-update-report-pdf.js [report-basename]
 * Example: node scripts/generate-update-report-pdf.js Update-Report-San-Diego-Amazing-Homes-2026-03-14
 * If no argument, uses the latest: Update-Report-San-Diego-Amazing-Homes-2026-02-17.
 * Use only when the user explicitly requests a PDF for a report.
 */
const path = require("path");

const DEFAULT_REPORT = "Update-Report-San-Diego-Amazing-Homes-2026-02-17";

async function main() {
  const basename = process.argv[2] || DEFAULT_REPORT;
  const base = basename.replace(/\.md$/i, "");
  const mdPath = path.join(process.cwd(), "docs", "update-reports", `${base}.md`);
  const pdfPath = path.join(process.cwd(), "docs", "update-reports", `${base}.pdf`);

  const { mdToPdf } = require("md-to-pdf");
  console.log("Generating PDF from", mdPath);
  try {
    await mdToPdf(
      { path: mdPath },
      {
        dest: pdfPath,
        launch_options: { args: ["--no-sandbox", "--disable-setuid-sandbox"] },
      }
    );
    console.log("Wrote", pdfPath);
  } catch (err) {
    console.error("PDF generation failed:", err.message);
    process.exit(1);
  }
}

main();
