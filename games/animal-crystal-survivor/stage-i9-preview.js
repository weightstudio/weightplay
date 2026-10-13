(() => {
  if (document.documentElement.dataset.crystalStageI9Preview !== "true") return;
  const rail = document.querySelector("#stageRail");
  const page = document.querySelector("#stagePage");
  if (!rail || !page || !window.WeightPlayStageRailI9) return;
  window.WeightPlayStageRailI9.mountVisual(rail, {
    artUrl: "/assets/animal-crystal-survivor-otter-cover-v26.webp",
    artPositionForStage(stage) {
      const crops = [52, 65, 41, 57, 69, 47];
      const region = Math.floor((Math.max(1, Number(stage) || 1) - 1) / 5) % crops.length;
      return "50% " + crops[region] + "%";
    },
  });

  const briefing = document.createElement("section");
  briefing.className = "wp-stage-i9-briefing";
  briefing.setAttribute("aria-label", document.documentElement.lang === "zh-Hant" ? "關卡簡報" : "Stage briefing");

  const toggle = document.createElement("button");
  toggle.className = "wp-stage-i9-briefing-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "crystalI9BriefingDetails");
  toggle.innerHTML = '<span aria-hidden="true">i</span>';

  const copy = document.createElement("div");
  copy.className = "wp-stage-i9-briefing-copy";
  const title = document.createElement("strong");
  title.className = "wp-stage-i9-briefing-title";
  const summary = document.createElement("span");
  summary.className = "wp-stage-i9-briefing-summary";
  copy.append(title, summary);

  const details = document.createElement("div");
  details.className = "wp-stage-i9-briefing-details";
  details.id = "crystalI9BriefingDetails";
  details.setAttribute("role", "region");
  details.setAttribute("aria-live", "off");
  details.hidden = true;
  briefing.append(toggle, copy, details);
  page.insertBefore(briefing, rail.nextSibling);

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    briefing.dataset.expanded = String(open);
    details.hidden = !open;
  });

  const setupText = () => document.querySelector("#stageSetupText")?.textContent?.trim() || "";
  function update() {
    const cards = [...rail.querySelectorAll(":scope > .stage-card")];
    for (const card of cards) {
      const content = card.querySelector(":scope > [data-wp-item-content]");
      if (!content) continue;
      const smalls = [...content.querySelectorAll(":scope > small")];
      smalls.forEach((line, index) => {
        const role = ["rule", "enemy", "objective", "status"][index] || "extra";
        line.dataset.wpStageI9Line = role;
      });
    }

    const card = cards.find((item) => item.getAttribute("aria-current") === "true")
      || cards.find((item) => item.classList.contains("is-selected"))
      || cards[0];
    const content = card?.querySelector(":scope > [data-wp-item-content]");
    const number = content?.querySelector(":scope > strong")?.textContent?.trim() || "";
    const name = content?.querySelector(":scope > span")?.textContent?.trim() || "";
    const lines = [...(content?.querySelectorAll(":scope > small") || [])]
      .slice(0, 2).map((line) => line.textContent.trim()).filter(Boolean);
    title.textContent = [number, name].filter(Boolean).join(" · ");
    summary.textContent = lines[0] || setupText();
    const stageTitle = [number, name].filter(Boolean).join(" ");
    toggle.setAttribute("aria-label", [stageTitle, setupText()].filter(Boolean).join(". "));
    details.replaceChildren();
    for (const text of lines) {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      details.append(paragraph);
    }
    if (!lines.length && setupText()) {
      const paragraph = document.createElement("p");
      paragraph.textContent = setupText();
      details.append(paragraph);
    }
  }

  const observer = new MutationObserver(update);
  observer.observe(rail, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["aria-current", "aria-disabled", "class", "data-stage"],
  });
  update();
})();
