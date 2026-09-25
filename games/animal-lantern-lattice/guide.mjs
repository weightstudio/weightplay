import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const loadWindowData = (file) => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(directory, file), "utf8"), context, { filename: file });
  return context.window;
};
const guideByLocale = loadWindowData("guide-copy.js").ANIMAL_LANTERN_LATTICE_GUIDE_COPY;
const localeCopy = loadWindowData("locales.js").ANIMAL_LANTERN_LATTICE_LOCALES;
const seoByLocale = loadWindowData("seo-comparison.js").ANIMAL_LANTERN_LATTICE_SEO_COMPARISON;
const kickerByLocale = {
  en: "WeightPlay Original Game Guide", "zh-Hant": "WeightPlay 原創遊戲指南", "zh-Hans": "WeightPlay 原创游戏指南",
  ja: "WeightPlay オリジナルゲームガイド", ko: "WeightPlay 오리지널 게임 가이드", es: "Guía de juegos originales de WeightPlay",
  "pt-BR": "Guia de jogos originais WeightPlay", fr: "Guide des jeux originaux WeightPlay", de: "WeightPlay-Leitfaden für Originalspiele",
  it: "Guida ai giochi originali WeightPlay", ru: "Руководство по оригинальным играм WeightPlay", hi: "WeightPlay मौलिक गेम गाइड", ar: "دليل ألعاب WeightPlay الأصلية",
};
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export function renderLanternGuide(locale = "en") {
  const key = guideByLocale[locale] ? locale : "en";
  const guide = guideByLocale[key];
  const title = localeCopy[key].title;
  const seo = seoByLocale[key] || seoByLocale.en;
  const section = (heading, body) => `<article class="game-info-section"><h3>${escapeHtml(heading)}</h3>${body}</article>`;
  const facts = guide.facts.map((label, index) => `<div class="game-info-fact"><span>${escapeHtml(label)}</span><strong>${escapeHtml(guide.values[index])}</strong></div>`).join("");
  const steps = `<p>${escapeHtml(guide.stepIntro)}</p><ol>${guide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`;
  const faq = `<dl>${guide.faq.map(([question, answer]) => `<div><dt>${escapeHtml(question)}</dt><dd>${escapeHtml(answer)}</dd></div>`).join("")}</dl>`;
  const tags = `<div class="game-info-tags" data-wp-gameplay-tags="1.3.0">${seo.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>`;
  const comparison = `<article class="game-info-section" data-wp-market-comparison="1.3.0" data-comparison-locale="${escapeHtml(key)}" data-runtime-localize="off"><h3>${escapeHtml(seo.heading)}</h3><div class="game-info-tags"><span><bdi>Logic Puzzles - Clue Game</bdi></span></div><p>${escapeHtml(seo.comparison)}</p><p>${escapeHtml(seo.independence)}</p><p><a href="https://apps.apple.com/us/app/logic-puzzles-clue-game/id1641732564" rel="noopener noreferrer">${escapeHtml(seo.sourceLabel)}</a></p></article>`;
  const sections = [
    section(guide.headings[0], `<p>${escapeHtml(guide.overview)}</p>`),
    section(guide.headings[1], steps),
    section(guide.headings[2], `<p>${escapeHtml(guide.rules)}</p>`),
    section(guide.headings[3], `<p>${escapeHtml(guide.progression)}</p>`),
    section(guide.headings[4], `<p>${escapeHtml(guide.tips)}</p>`),
    section(guide.headings[5], `<p>${escapeHtml(guide.design)}</p>`),
    section(guide.headings[6], `<p>${escapeHtml(guide.saved)}</p>`),
    section(guide.headings[7], faq),
  ].join("");
  return `<section id="gameGuide" class="game-page-info game-page-info-static" data-wp-game-guide data-wp-guide-complete="true" data-wp-text-growth="1.3.0" data-runtime-localize="off" aria-label="${escapeHtml(`${title} game guide`)}"><div id="guideHero" class="game-info-hero"><div class="game-info-title"><span class="game-info-kicker">${escapeHtml(kickerByLocale[key])}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(localeCopy[key].intro)}</p>${tags}</div><div class="game-info-facts">${facts}</div></div><div id="guideSections" class="game-info-sections">${sections}${comparison}</div></section>`;
}

export function replaceLanternGuide(html, locale = "en") {
  const pattern = /<section\b(?=[^>]*(?:\bid=["']gameGuide["']|\bclass=["'][^"']*\bgame-page-info\b))[^>]*>[\s\S]*?<\/section>/i;
  if (!pattern.test(html)) throw new Error("Lantern Lattice route is missing its public Guide section");
  return html.replace(pattern, renderLanternGuide(locale));
}
