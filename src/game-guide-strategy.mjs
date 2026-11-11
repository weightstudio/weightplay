const sectionClass = "game-info-section";
const strategyAttribute = "data-wp-guide-strategy";

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

export function gameGuideStrategyMarkup(copy, locale) {
  const [heading, ...paragraphs] = copy;
  return `<section class="${sectionClass}" ${strategyAttribute}="${locale}" lang="${locale}" data-runtime-localize="off"><h3>${escapeHtml(heading)}</h3>${paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}</section>`;
}

export function syncGameGuideStrategy(guide, copy, locale) {
  if (!guide || !copy) return;
  const current = guide.querySelector(`[${strategyAttribute}]`);
  if (current?.getAttribute(strategyAttribute) === locale) return;
  const markup = gameGuideStrategyMarkup(copy, locale);
  if (current) current.outerHTML = markup;
  else guide.insertAdjacentHTML("beforeend", markup);
}
