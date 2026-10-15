(() => {
  "use strict";
  if (document.documentElement.dataset.honeyStageI9 !== "true") return;
  const rail = document.getElementById("stageRail");
  const page = document.getElementById("stageWorkspace");
  const chapter = page?.querySelector(".chapter-panel");
  if (!rail || !page || !chapter || !window.WeightPlayStageRailI9) return;
  let visual = null;
  let pending = 0;
  let closed = false;
  let briefing = null;
  let title = null;
  let summary = null;

  const text = (node, value) => {
    if (node.textContent !== value) node.textContent = value;
  };

  function prepareCards() {
    for (const card of rail.querySelectorAll(":scope > .stage-card")) {
      if (card.querySelector(":scope > [data-wp-item-content]")) continue;
      const content = document.createElement("div");
      content.dataset.wpItemContent = "true";
      // Move the existing authored nodes intact. The game's selectors and
      // listeners retain their original nodes, text and stage identities.
      for (const node of [...card.childNodes]) {
        if (node.nodeType === 1 && node.matches(".wp-stage-i9-card-art,[data-wp-get-icon]")) continue;
        content.append(node);
      }
      card.append(content);
    }
  }

  function makeBriefing() {
    briefing = document.createElement("section");
    briefing.className = "wp-stage-i9-briefing";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "wp-stage-i9-briefing-toggle";
    toggle.textContent = "i";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "honeyI9StageDetails");
    const copy = document.createElement("div");
    copy.className = "wp-stage-i9-briefing-copy";
    title = document.createElement("strong");
    title.className = "wp-stage-i9-briefing-title";
    summary = document.createElement("span");
    summary.className = "wp-stage-i9-briefing-summary";
    copy.append(title, summary);
    const details = document.createElement("div");
    details.id = "honeyI9StageDetails";
    details.className = "wp-stage-i9-briefing-details";
    details.setAttribute("role", "region");
    details.hidden = true;
    details.append(chapter);
    const progress = document.getElementById("stageSummary");
    if (progress) details.append(progress);
    briefing.append(toggle, copy, details);
    page.append(briefing);
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      details.hidden = !open;
      briefing.dataset.expanded = String(open);
    });
  }

  function update() {
    pending = 0;
    if (closed || document.body.dataset.screen !== "stage") return;
    prepareCards();
    if (!briefing) makeBriefing();
    if (!visual) {
      visual = window.WeightPlayStageRailI9.mountVisual(rail, {
        artUrl: "/assets/interface7-redrawn/animal-honey-shield.webp",
        artTagName: "i",
        artPositionForStage(stage, card) {
          const index = Number(card.dataset.stageIndex) || 0;
          return `50% ${[52, 65, 41, 57, 69, 47][Math.floor(index / 5) % 6]}%`;
        },
      });
    } else visual.refresh();
    const selected = rail.querySelector('.stage-card[aria-current="true"]');
    const label = selected?.querySelector("[data-wp-item-content] > span")?.textContent?.trim() || "";
    const number = selected?.querySelector("strong")?.textContent?.trim() || "";
    const stageLabel = number && !label.includes(number) ? [number, label].filter(Boolean).join(" · ") : label;
    const chapterTitle = document.getElementById("chapterTitle")?.textContent?.trim() || "";
    text(title, [stageLabel, chapterTitle].filter(Boolean).join(" · "));
    text(summary, document.getElementById("chapterRule")?.textContent?.trim() || "");
    const toggle = briefing.querySelector("button");
    if (toggle.getAttribute("aria-label") !== title.textContent) toggle.setAttribute("aria-label", title.textContent);
    if (briefing.getAttribute("aria-label") !== chapterTitle) briefing.setAttribute("aria-label", chapterTitle);
  }

  function schedule() {
    if (closed || pending || document.body.dataset.screen !== "stage") return;
    pending = requestAnimationFrame(update);
  }
  const observer = new MutationObserver(schedule);
  observer.observe(rail, {
    childList: true, subtree: true, characterData: true, attributes: true,
    attributeFilter: ["class", "aria-current", "aria-disabled", "data-stage-index"],
  });
  observer.observe(chapter, { childList: true, subtree: true, characterData: true });
  observer.observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });
  window.addEventListener("weightplay:stage-sync", schedule);
  window.addEventListener("resize", schedule);
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    closed = true;
    observer.disconnect();
    if (pending) cancelAnimationFrame(pending);
    visual?.disconnect();
    window.removeEventListener("weightplay:stage-sync", schedule);
    window.removeEventListener("resize", schedule);
  });
  schedule();
})();
