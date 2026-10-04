(() => {
  "use strict";

  const payload = document.querySelector("script[data-wp-habitat-mahjong-text-140]");
  if (!payload) return;

  let allCopy;
  try { allCopy = JSON.parse(payload.textContent || "{}"); }
  catch { return; }

  const applyCopy = () => {
    const lang = document.documentElement.lang || "en";
    const copy = allCopy[lang] || allCopy.en;
    if (!copy) return;
    const guide = document.querySelector(".game-page-info, .game-page-info-static");
    if (!guide) return;

    const intro = guide.querySelector(".game-info-title > p");
    if (intro && intro.textContent !== copy.intro) intro.textContent = copy.intro;

    const tagList = guide.querySelector(".game-info-tags[data-wp-gameplay-tags]");
    if (tagList) {
      tagList.dataset.wpGameplayTags = "1.4.0";
      const existing = [...tagList.querySelectorAll("span")].map(node => node.textContent);
      if (existing.join("\n") !== copy.tags.join("\n")) {
        tagList.replaceChildren(...copy.tags.map(tag => {
          const span = document.createElement("span");
          span.textContent = tag;
          return span;
        }));
      }
    }

    const lists = guide.querySelectorAll("dl");
    const faq = lists[lists.length - 1];
    if (faq) {
      faq.querySelectorAll("dt").forEach(question => {
        if (question.textContent.trim() === "Is progress saved?") question.textContent = copy.progressFaqQuestion;
      });
      const rows = [copy.faq, ...(copy.extraFaqs || [])];
      let entries = [...faq.querySelectorAll("[data-wp-habitat-text140-faq]")];
      while (entries.length < rows.length) {
        const entry = document.createElement("div");
        entry.dataset.wpHabitatText140Faq = "";
        const question = document.createElement("dt");
        const answer = document.createElement("dd");
        entry.append(question, answer);
        faq.append(entry);
        entries.push(entry);
      }
      entries.forEach((entry, index) => {
        if (!rows[index]) { entry.remove(); return; }
        entry.querySelector("dt").textContent = rows[index][0];
        entry.querySelector("dd").textContent = rows[index][1];
      });
    }

    document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach(meta => {
      if (meta.content !== copy.description) meta.content = copy.description;
    });
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      try {
        const schema = JSON.parse(script.textContent || "null");
        const visit = value => {
          if (!value || typeof value !== "object") return;
          if (value["@type"] === "VideoGame" && String(value.url || "").includes("animal-habitat-mahjong")) {
            value.description = copy.description;
            value.genre = copy.tags;
          }
          Object.values(value).forEach(visit);
        };
        visit(schema);
        const serialized = JSON.stringify(schema);
        if (script.textContent !== serialized) script.textContent = serialized;
      } catch { /* Keep unrelated or malformed structured data unchanged. */ }
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyCopy, { once: true });
  else applyCopy();
  let copyRefreshScheduled = false;
  const scheduleCopyRefresh = () => {
    if (copyRefreshScheduled) return;
    copyRefreshScheduled = true;
    requestAnimationFrame(() => {
      copyRefreshScheduled = false;
      applyCopy();
    });
  };
  window.addEventListener("wonder:locale-change", () => {
    applyCopy();
    window.setTimeout(applyCopy, 0);
    scheduleCopyRefresh();
  });

  // Some shared locale renderers rebuild the static Guide after the game has
  // dispatched its locale event. Reapply this game-owned payload once that
  // Guide subtree settles; the idempotent writes prevent an observer loop.
  const guideObserver = new MutationObserver(records => {
    const guideMutation = records.some(record => {
      const target = record.target.nodeType === Node.ELEMENT_NODE ? record.target : record.target.parentElement;
      if (target?.closest?.(".game-page-info, .game-page-info-static")) return true;
      return [...record.addedNodes, ...record.removedNodes].some(node =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches(".game-page-info, .game-page-info-static") || node.querySelector(".game-page-info, .game-page-info-static")));
    });
    if (guideMutation) scheduleCopyRefresh();
  });
  if (document.body) guideObserver.observe(document.body, { childList: true, subtree: true });
})();
