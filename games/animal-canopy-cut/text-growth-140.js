(() => {
  "use strict";

  const locales = window.WEIGHTPLAY_CANOPY_CUT_TEXT_140 || {};

  function applyTextGrowthCopy() {
    if (document.querySelector('meta[name="weightplay-game-id"][content="animal-canopy-cut"]') === null) return;
    const guide = document.querySelector("section.game-page-info[data-wp-canopy-cut-guide]")
      || document.querySelector(".game-page-info-static[data-wp-canopy-cut-guide]")
      || document.querySelector("section.game-page-info")
      || document.querySelector(".game-page-info-static");
    if (!guide) return;
    guide.dataset.wpCanopyCutGuide = "";
    const activeLocale = document.documentElement.lang || "en";
    const copy = locales[activeLocale] || locales.en;
    if (!copy) return;

    const intro = guide.querySelector(".game-info-title > p");
    if (intro && intro.textContent !== copy.intro) intro.textContent = copy.intro;

    const missionSection = guide.querySelector("[data-wp-canopy-cut-story]")
      || guide.querySelector(".game-info-sections .game-info-section");
    if (missionSection) missionSection.dataset.wpCanopyCutStory = "";
    const mission = missionSection?.querySelector("p");
    if (mission && mission.textContent !== copy.story) mission.textContent = copy.story;

    const campaign = guide.querySelector(".game-info-campaign");
    if (campaign && copy.progression) {
      const paragraphs = campaign.querySelectorAll("p");
      if (paragraphs[0] && paragraphs[0].textContent !== copy.progression) paragraphs[0].textContent = copy.progression;
      paragraphs.forEach((paragraph, index) => { if (index > 0) paragraph.remove(); });
    }

    const tips = guide.querySelectorAll(".game-info-strategy li");
    if (tips.length && tips[tips.length - 1].textContent !== copy.strategy) tips[tips.length - 1].textContent = copy.strategy;

    const faq = guide.querySelectorAll(".game-info-sections .game-info-section dl");
    const faqList = faq[faq.length - 1];
    if (faqList && faqList.children.length < 6) {
      const entry = document.createElement("div");
      const question = document.createElement("dt");
      const answer = document.createElement("dd");
      question.textContent = copy.faq[0];
      answer.textContent = copy.faq[1];
      entry.append(question, answer);
      faqList.append(entry);
    }
    const lastFaq = faqList?.lastElementChild;
    if (lastFaq) {
      const question = lastFaq.querySelector("dt");
      const answer = lastFaq.querySelector("dd");
      if (question && question.textContent !== copy.faq[0]) question.textContent = copy.faq[0];
      if (answer && answer.textContent !== copy.faq[1]) answer.textContent = copy.faq[1];
    }

    const tags = guide.querySelector(".game-info-tags[data-wp-gameplay-tags]")
      || guide.querySelector(".game-info-tags");
    if (tags && Array.isArray(copy.tags)) {
      tags.dataset.wpGameplayTags = "1.4.0";
      if ([...tags.querySelectorAll("span")].map((span) => span.textContent).join("\n") !== copy.tags.join("\n")) {
        tags.replaceChildren(...copy.tags.map((tag) => {
          const span = document.createElement("span");
          span.textContent = tag;
          return span;
        }));
      }
    }

    document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach((meta) => {
      if (meta.getAttribute("content") !== copy.description) meta.setAttribute("content", copy.description);
    });

    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      try {
        const parsed = JSON.parse(script.textContent || "null");
        const entries = Array.isArray(parsed) ? parsed : [parsed];
        let changed = false;
        const visit = (item) => {
          if (!item || typeof item !== "object") return;
          const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
          if (types.includes("VideoGame")) {
            item.description = copy.description;
            item.genre = copy.tags;
            changed = true;
          }
          Object.values(item).forEach(visit);
        };
        entries.forEach(visit);
        const serialized = JSON.stringify(Array.isArray(parsed) ? entries : entries[0]);
        if (changed && script.textContent !== serialized) script.textContent = serialized;
      } catch {
        // Leave unrelated structured data untouched if it is malformed.
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyTextGrowthCopy, { once: true });
  } else {
    applyTextGrowthCopy();
  }
  if (document.body && window.MutationObserver) {
    const guideObserver = new MutationObserver((records) => {
      const guideChanged = records.some((record) => {
        const targetGuide = record.target.nodeType === Node.ELEMENT_NODE
          ? record.target.closest(".game-page-info, .game-page-info-static")
          : record.target.parentElement?.closest(".game-page-info, .game-page-info-static");
        if (targetGuide) return true;
        return [...record.addedNodes].some((node) => node.nodeType === Node.ELEMENT_NODE
          && (node.matches?.(".game-page-info, .game-page-info-static") || node.querySelector?.(".game-page-info, .game-page-info-static")));
      });
      const headChanged = records.some((record) => document.head?.contains(record.target)
        || [...record.addedNodes].some((node) => node.nodeType === Node.ELEMENT_NODE && /^(META|SCRIPT)$/.test(node.tagName)));
      if (guideChanged || headChanged) requestAnimationFrame(applyTextGrowthCopy);
    });
    guideObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
    if (document.head) guideObserver.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["content"] });
  }
  window.addEventListener("wonder:locale-change", applyTextGrowthCopy);
})();
