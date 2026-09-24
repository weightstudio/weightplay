(() => {
  "use strict";

  const rail = document.getElementById("stageRail");
  const runtime = window.__animalPenaltyCupTest;
  const levels = runtime?.LEVELS;

  if (rail && runtime && Array.isArray(levels) && window.WeightPlayStageV6?.install) {
    const nativeLevelForEach = Array.prototype.forEach;
    const innerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    let suppressLegacyStageBuild = false;
    let stageEntryTarget = null;
    let previousScreen = document.body.dataset.screen || "main";
    let virtualizer = null;

    const state = () => runtime.getState();
    const locale = () => state().lang || "en";
    const dictionary = () => window.ANIMAL_PENALTY_LOCALES?.[locale()] || window.ANIMAL_PENALTY_LOCALES?.en || {};
    const text = (key, vars = {}) => {
      const english = window.ANIMAL_PENALTY_LOCALES?.en || {};
      let value = dictionary()[key] ?? english[key] ?? key;
      for (const [name, item] of Object.entries(vars)) value = String(value).replaceAll(`{${name}}`, String(item));
      return value;
    };
    const campaignText = (key, index) => dictionary()[key]?.[index]
      ?? window.ANIMAL_PENALTY_LOCALES?.en?.[key]?.[index]
      ?? "";
    const opponentName = (index) => locale() === "en" ? levels[index].opponent : text("teamName", { n: index + 1 });

    const updateStageContext = (index) => {
      const level = levels[index];
      if (!level) return;
      const kicker = document.getElementById("chapterKicker");
      const title = document.getElementById("chapterTitle");
      const rule = document.getElementById("chapterRule");
      if (kicker) kicker.textContent = text("chapter", { n: level.chapter + 1 });
      if (title) title.textContent = campaignText("chapterNames", level.chapter);
      if (rule) rule.textContent = campaignText("chapterRules", level.chapter);
    };

    const bindStageCard = (card, index) => {
      const snapshot = state();
      const save = snapshot.save;
      const item = levels[index];
      const locked = index >= save.unlocked;
      const name = opponentName(index);
      const current = Number(snapshot.selectedStage) === index;
      card.type = "button";
      card.className = `stage-card${locked ? " locked" : ""}${current ? " selected" : ""}`;
      card.dataset.stage = String(index);
      card.dataset.stageIndex = String(index);
      card.dataset.wpStageRecommended = current && !locked ? "true" : "false";
      card.setAttribute("aria-disabled", String(locked));
      if (save.tutorialSeen && !locked) card.dataset.wpEnterBattle = "";
      else delete card.dataset.wpEnterBattle;
      const status = locked ? text("locked") : save.completed[index] ? text("cleared") : text("opponent", { name });
      const stars = locked ? "" : "★".repeat(save.stars[index]) + "☆".repeat(3 - save.stars[index]);
      card.innerHTML = `<small>${text("chapter", { n: item.chapter + 1 })}</small><strong>${text("match", { n: index + 1 })}</strong><span>${status}</span><span>${name}</span><b class="stars">${stars}</b>`;
    };

    virtualizer = window.WeightPlayStageV6.install(rail, {
      total: () => levels.length,
      poolSize: 9,
      initialIndex: () => Math.max(0, Math.min(levels.length - 1, Number(state().selectedStage) || 0)),
      bind: bindStageCard,
      activate(index) {
        const snapshot = state();
        if (!Number.isInteger(index) || index < 0 || index >= snapshot.save.unlocked) return;
        runtime.startMatch(index, "stage");
      },
      onChange(index, detail) {
        if (!Number.isInteger(index) || !levels[index]) return;
        detail.pool.forEach((card) => {
          const active = Number(card.dataset.wpStageVirtualIndex) === index;
          card.classList.toggle("selected", active);
          card.dataset.wpStageRecommended = active && index < state().save.unlocked ? "true" : "false";
        });
        updateStageContext(index);
      },
    });

    if (virtualizer && innerHTMLDescriptor?.get && innerHTMLDescriptor?.set) {
      Object.defineProperty(levels, "forEach", {
        configurable: true,
        writable: true,
        value(callback, thisArg) {
          if (suppressLegacyStageBuild) return undefined;
          return nativeLevelForEach.call(this, callback, thisArg);
        },
      });

      Object.defineProperty(rail, "innerHTML", {
        configurable: true,
        get() { return innerHTMLDescriptor.get.call(this); },
        set(value) {
          if (value === "" && this.dataset.wpStageVirtualizationInstalled === "true") {
            suppressLegacyStageBuild = true;
            queueMicrotask(() => {
              suppressLegacyStageBuild = false;
              if (document.body.dataset.screen !== "stage") return;
              const snapshot = state();
              const target = Number.isInteger(stageEntryTarget)
                ? stageEntryTarget
                : Math.max(0, Math.min(levels.length - 1, Number(snapshot.selectedStage) || 0));
              stageEntryTarget = null;
              virtualizer.refresh();
              virtualizer.center(target);
              updateStageContext(target);
              rail.dispatchEvent(new CustomEvent("wonder:stage-snap", { detail: { index: target, card: null } }));
              const completed = snapshot.save.completed.filter(Boolean).length;
              document.getElementById("stageScreen")?.setAttribute("data-completed", String(completed));
            });
            return;
          }
          innerHTMLDescriptor.set.call(this, value);
        },
      });
    }

    window.addEventListener("weightplay:stage-sync", () => {
      const next = document.body.dataset.screen || "main";
      if (next === "stage" && previousScreen !== "stage") {
        const snapshot = state();
        stageEntryTarget = Math.max(0, Math.min(levels.length - 1, Number(snapshot.save.unlocked || 1) - 1));
      }
      previousScreen = next;
    });
  }

  const battleCanvas = document.getElementById("battleCanvas");
  const resultPanel = document.getElementById("resultPanel");
  if (battleCanvas && resultPanel) {
    resultPanel.dataset.wpBattleSubstate = "result";
    const syncResultSubstate = () => {
      battleCanvas.dataset.wpBattleSubstate = resultPanel.hidden ? "play" : "result";
    };
    syncResultSubstate();
    new MutationObserver(syncResultSubstate).observe(resultPanel, { attributes: true, attributeFilter: ["hidden"] });
  }

  if (battleCanvas) {
    let context = battleCanvas.querySelector(".interface7-battle-context");
    if (!context) {
      context = document.createElement("div");
      context.className = "interface7-battle-context";
      context.dataset.wpBattleGameplayContext = "true";
      const header = battleCanvas.querySelector(".battle-header");
      if (header?.parentElement === battleCanvas) header.after(context);
      else battleCanvas.prepend(context);
    }

    const heading = battleCanvas.querySelector(".battle-heading");
    const score = battleCanvas.querySelector(".score-box");
    const pause = document.getElementById("pauseBtn");
    [heading, score, pause].filter(Boolean).forEach((node) => context.append(node));
  }
})();
