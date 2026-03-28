/**
 * Parse markdown body into sections by ## headers. Returns object of section title -> content.
 * Used to pull first sentence for LiveabilityScorecard blurbs.
 */
export function parseMarkdownSections(body) {
  if (!body || typeof body !== "string") return {};
  const sections = {};
  const blocks = body.split(/\n## /);
  blocks.forEach((block) => {
    const trimmed = block.trim();
    if (!trimmed) return;
    const firstLineEnd = trimmed.indexOf("\n");
    const title = firstLineEnd === -1 ? trimmed : trimmed.slice(0, firstLineEnd).trim();
    const content = firstLineEnd === -1 ? "" : trimmed.slice(firstLineEnd + 1).trim();
    if (title) sections[title] = content;
  });
  return sections;
}

/** Get first sentence (or first ~120 chars) from markdown content for use as a blurb. */
export function firstSentence(content) {
  if (!content || typeof content !== "string") return "";
  const stripped = content.replace(/#+\s*|\n/g, " ").trim();
  const match = stripped.match(/^[^.!?]+[.!?]?/);
  const sentence = match ? match[0].trim() : stripped.slice(0, 120).trim();
  return sentence || "";
}
