// Speed Text Growth 1.4.0 route contract. The localized guide data lives in
// src/card-games-public-guides.js and is consumed by the canonical route
// generator; this final pass removes any historical comparison and upgrades
// only the owned gameplay-tag marker.
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));

export function applySpeedTextGrowth(html, locale, copy) {
  if (!copy || copy.text140Tags?.length !== 4 || !copy.metaDescription) throw new Error(`Speed ${locale}: missing complete Text Growth 1.4.0 copy`);
  let next = html.replace(/<article\b[^>]*data-wp-market-comparison=["'][^"']+["'][^>]*>[\s\S]*?<\/article>/giu, "");
  const tags = `<div class="game-info-tags" data-wp-gameplay-tags="1.4.0">${copy.text140Tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div>`;
  const blocks = [...next.matchAll(/<div\b(?=[^>]*\bclass=["'][^"']*\bgame-info-tags\b[^"']*["'])[^>]*>[\s\S]*?<\/div\s*>/giu)];
  if (blocks.length > 1) throw new Error(`Speed ${locale}: duplicate owned gameplay-tag blocks (${blocks.length})`);
  if (blocks.length === 1) next = next.replace(blocks[0][0], tags);
  else {
    const titleEnd = /(<div class="game-info-title">[\s\S]*?<p>[^<]*(?:<[^>]+>[^<]*<\/[^>]+>[^<]*)*<\/p>)(<\/div>\s*<div class="game-info-facts">)/iu;
    if (!titleEnd.test(next)) throw new Error(`Speed ${locale}: missing Guide title/facts insertion point`);
    next = next.replace(titleEnd, `$1${tags}$2`);
  }
  const replaceMeta = (attribute, name, value) => {
    const escaped = escapeHtml(value);
    const regex = new RegExp(`(<meta\\s+${attribute}=["']${name}["'][^>]*\\bcontent=["'])[^"']*(["'][^>]*>)`, "iu");
    if (regex.test(next)) next = next.replace(regex, `$1${escaped}$2`);
    else next = next.replace(/<\/head>/i, `  <meta ${attribute}="${name}" content="${escaped}" />\n</head>`);
  };
  replaceMeta("name", "description", copy.metaDescription);
  replaceMeta("property", "og:description", copy.metaDescription);
  replaceMeta("name", "twitter:description", copy.metaDescription);
  next = next.replace(/(<script\s+type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/iu, (_whole, opening, json, closing) => {
    try {
      const data = JSON.parse(json);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) if (item && (item["@type"] === "VideoGame" || (Array.isArray(item["@type"]) && item["@type"].includes("VideoGame")))) {
        item.description = copy.metaDescription;
        item.genre = copy.text140Tags;
      }
      return `${opening}${JSON.stringify(Array.isArray(data) ? items : items[0])}${closing}`;
    } catch { return `${opening}${json}${closing}`; }
  });
  if (/data-wp-market-comparison|Speed by Tom C|apps\.apple\.com/iu.test(next)) throw new Error(`Speed ${locale}: retired comparison remains in rendered route`);
  return next;
}
