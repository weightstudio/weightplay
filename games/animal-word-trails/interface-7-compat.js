(() => {
  "use strict";

  const text = {
    en: { start: "Start Game", stages: "Stages", next: "Next Stage", progress: "Stage" },
    "zh-Hant": { start: "開始遊戲", stages: "關卡", next: "下一關", progress: "關卡" },
    "zh-Hans": { start: "开始游戏", stages: "关卡", next: "下一关", progress: "关卡" },
    ja: { start: "ゲームを開始", stages: "ステージ", next: "次のステージ", progress: "ステージ" },
    ko: { start: "게임 시작", stages: "스테이지", next: "다음 스테이지", progress: "스테이지" },
    es: { start: "Iniciar juego", stages: "Niveles", next: "Siguiente nivel", progress: "Nivel" },
    "pt-BR": { start: "Iniciar jogo", stages: "Fases", next: "Próxima fase", progress: "Fase" },
    fr: { start: "Démarrer le jeu", stages: "Niveaux", next: "Niveau suivant", progress: "Niveau" },
    de: { start: "Spiel starten", stages: "Level", next: "Nächstes Level", progress: "Level" },
    it: { start: "Avvia gioco", stages: "Livelli", next: "Livello successivo", progress: "Livello" },
    ru: { start: "Начать игру", stages: "Уровни", next: "Следующий уровень", progress: "Уровень" },
    hi: { start: "खेल शुरू करें", stages: "स्तर", next: "अगला स्तर", progress: "स्तर" },
    ar: { start: "ابدأ اللعبة", stages: "المراحل", next: "المرحلة التالية", progress: "المرحلة" },
  };

  const localeSelect = document.getElementById("locale");
  for (const [value, label] of [["hi", "हिन्दी"], ["ar", "العربية"]]) {
    if (localeSelect && !localeSelect.querySelector(`option[value="${value}"]`)) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      localeSelect.append(option);
    }
  }

  const localeCode = () => {
    const raw = window.WonderI18n?.actualLocale?.()
      || window.WonderI18n?.locale?.()
      || localeSelect?.value
      || document.documentElement.lang
      || "en";
    if (/^zh-(tw|hant)/i.test(raw)) return "zh-Hant";
    if (/^zh/i.test(raw)) return "zh-Hans";
    if (/^pt/i.test(raw)) return "pt-BR";
    const base = String(raw).split("-")[0];
    return text[raw] ? raw : (text[base] ? base : "en");
  };

  const readBest = () => {
    try {
      return JSON.parse(localStorage.getItem("wordTrailsBest") || "{}");
    } catch {
      return {};
    }
  };

  const authoredStageCount = () => 10;

  function progressionTarget(locale) {
    const best = readBest();
    const total = authoredStageCount();
    let cleared = 0;
    while (cleared < total && best[`${locale}-${cleared}`]) cleared += 1;
    return Math.min(total, cleared + 1);
  }

  const main = document.querySelector('[data-screen="main"]');
  const start = document.getElementById("start");
  let mainProgress = document.getElementById("wpWordTrailsMainProgress");
  if (main && start && !mainProgress) {
    mainProgress = document.createElement("p");
    mainProgress.id = "wpWordTrailsMainProgress";
    mainProgress.className = "wp-word-main-progress";
    mainProgress.dataset.wpMainProgress = "";
    mainProgress.setAttribute("aria-live", "polite");
    start.before(mainProgress);
  }

  const stage = document.querySelector('[data-screen="stage"]');
  const rail = document.getElementById("stageRail");
  const feedback = document.getElementById("stageFeedback");
  const album = document.getElementById("album");
  const stageHeaderTitle = stage?.querySelector('.stage-screen-head [data-copy="chooseStage"]');
  if (stageHeaderTitle) {
    stageHeaderTitle.hidden = true;
    stageHeaderTitle.setAttribute("aria-hidden", "true");
  }

  let stageWorkspace = stage?.querySelector(".wp-word-stage-workspace");
  if (stage && rail && !stageWorkspace) {
    stageWorkspace = document.createElement("div");
    stageWorkspace.className = "stage-workspace wp-word-stage-workspace";
    stageWorkspace.dataset.wpStageWorkspace = "";
    rail.before(stageWorkspace);
    stageWorkspace.append(rail);
    if (feedback) stageWorkspace.append(feedback);
    if (album) {
      album.classList.add("wp-word-stage-album");
      stageWorkspace.append(album);
    }
  }

  let stageTabs = stage?.querySelector(".wp-word-stage-tabs");
  if (stage && !stageTabs) {
    stageTabs = document.createElement("nav");
    stageTabs.className = "stage-tabs wp-word-stage-tabs";
    stageTabs.setAttribute("aria-label", "Stage navigation");
    stageTabs.innerHTML = '<span aria-hidden="true"></span><button type="button" role="tab" aria-selected="true" data-wp-word-stages></button><span aria-hidden="true"></span>';
    const playStage = document.getElementById("playStage");
    stage.insertBefore(stageTabs, playStage || stage.lastElementChild);
  }

  const result = document.getElementById("resultPanel");
  if (result) {
    result.removeAttribute("data-screen");
    result.dataset.wpBattleSubstate = "result";
  }

  const resultsBack = document.getElementById("resultsBack");
  const next = document.getElementById("next");
  if (start) start.removeAttribute("data-copy");
  if (resultsBack) resultsBack.removeAttribute("data-copy");
  if (next) next.removeAttribute("data-copy");

  function refreshSharedCopy() {
    const locale = localeCode();
    const copy = text[locale] || text.en;
    if (start) start.textContent = copy.start;
    const stageTab = stageTabs?.querySelector("[data-wp-word-stages]");
    if (stageTab) {
      stageTab.textContent = copy.stages;
      stageTab.setAttribute("aria-label", copy.stages);
    }
    if (resultsBack) resultsBack.textContent = copy.stages;
    if (next) next.textContent = copy.next;
    if (mainProgress) {
      mainProgress.textContent = `${copy.progress} ${progressionTarget(locale)} / ${authoredStageCount()}`;
    }
  }

  // Word Trails has ten authored stages. Keep the rail data-backed so the
  // shared V6 controller owns only its fixed reusable pool instead of retaining
  // one hidden source button per authored stage.
  if (rail) {
    const innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    const nativeAppend = Element.prototype.append;
    const nativeReplaceChildren = Element.prototype.replaceChildren;
    let capture = false;
    let captureQueued = false;
    let capturedNodes = [];
    let stageRecords = [];
    let virtual = null;
    let waitingFrame = 0;
    let preferHighestUnlocked = true;
    let guardInstalled = false;

    rail.dataset.wpStageVirtualizationDestroyed = "true";
    rail.dataset.wpStageV6Total = String(authoredStageCount());
    rail.dataset.wpStageV6PoolSize = "9";

    const toRecord = (node, index) => ({
      className: node.className,
      html: node.innerHTML,
      locked: node.disabled || node.getAttribute("aria-disabled") === "true" || node.classList.contains("locked"),
      describedBy: node.getAttribute("aria-describedby") || "",
      stageIndex: Number.isFinite(Number(node.dataset.stage)) ? Number(node.dataset.stage) : index,
      selected: node.classList.contains("selected") || node.getAttribute("aria-current") === "true",
      activate: typeof node.onclick === "function" ? node.onclick : null,
    });

    const highestUnlocked = () => {
      let unlocked = 0;
      stageRecords.forEach((record, index) => { if (!record.locked) unlocked = index; });
      return unlocked;
    };

    const selectedIndex = () => {
      const selected = stageRecords.findIndex((record) => record.selected);
      return selected >= 0 ? selected : highestUnlocked();
    };

    const targetIndex = () => preferHighestUnlocked ? highestUnlocked() : selectedIndex();

    const bindCard = (card, index) => {
      const record = stageRecords[index];
      if (!record) return;
      card.className = record.className;
      card.innerHTML = record.html;
      card.dataset.stage = String(record.stageIndex);
      card.setAttribute("aria-disabled", String(record.locked));
      if (record.describedBy) card.setAttribute("aria-describedby", record.describedBy);
      else card.removeAttribute("aria-describedby");
    };

    const syncVisualSelection = (index, state) => {
      state?.pool?.forEach((card) => {
        const current = Number(card.dataset.wpStageVirtualIndex) === index;
        card.classList.toggle("selected", current);
      });
    };

    const installOrRefresh = () => {
      if (!stageRecords.length) return;
      if (!window.WeightPlayStageV6?.install) {
        if (!waitingFrame) {
          let attempts = 180;
          const wait = () => {
            waitingFrame = 0;
            if (window.WeightPlayStageV6?.install) { installOrRefresh(); return; }
            if (attempts-- > 0) waitingFrame = requestAnimationFrame(wait);
          };
          waitingFrame = requestAnimationFrame(wait);
        }
        return;
      }
      if (!virtual) {
        nativeReplaceChildren.call(rail);
        delete rail.dataset.wpStageVirtualizationDestroyed;
        virtual = window.WeightPlayStageV6.install(rail, {
          total: () => stageRecords.length,
          poolSize: 9,
          initialIndex: () => targetIndex(),
          bind: bindCard,
          onChange: syncVisualSelection,
          activate: (index) => {
            const record = stageRecords[index];
            if (!record || record.locked) return;
            record.activate?.();
          },
        });
        if (virtual && !guardInstalled) {
          guardInstalled = true;
          // The virtualizer owns activation in capture phase. Stop the legacy
          // rail bubble handler from starting the same Battle a second time.
          rail.addEventListener("click", (event) => {
            if (event.target.closest?.("[data-wp-stage-pool-node]")) event.stopPropagation();
          }, true);
        }
      } else {
        virtual.refresh();
      }
      virtual?.center(targetIndex());
      preferHighestUnlocked = false;
    };

    const commitCapture = () => {
      captureQueued = false;
      capture = false;
      if (!capturedNodes.length) return;
      stageRecords = capturedNodes.map(toRecord);
      capturedNodes = [];
      installOrRefresh();
    };

    if (innerHTML?.get && innerHTML?.set) {
      Object.defineProperty(rail, "innerHTML", {
        configurable: true,
        get() { return innerHTML.get.call(this); },
        set(value) {
          if (value !== "") { innerHTML.set.call(this, value); return; }
          capture = true;
          capturedNodes = [];
          if (!virtual) innerHTML.set.call(this, "");
        },
      });

      rail.append = function (...nodes) {
        if (capture && nodes.every((node) => node instanceof Element && node.matches(".stage-card") && !node.dataset.wpStagePoolNode)) {
          capturedNodes.push(...nodes);
          if (!captureQueued) {
            captureQueued = true;
            queueMicrotask(commitCapture);
          }
          return;
        }
        return nativeAppend.apply(this, nodes);
      };
    }

    start?.addEventListener("click", () => { preferHighestUnlocked = true; }, true);
    resultsBack?.addEventListener("click", () => { preferHighestUnlocked = true; }, true);
  }

  refreshSharedCopy();
  window.addEventListener("wonder:locale-change", () => queueMicrotask(refreshSharedCopy));
  window.addEventListener("storage", (event) => {
    if (event.key === "wordTrailsBest") refreshSharedCopy();
  });
  localeSelect?.addEventListener("change", () => queueMicrotask(refreshSharedCopy));
  document.getElementById("stageBack")?.addEventListener("click", () => requestAnimationFrame(refreshSharedCopy));
  resultsBack?.addEventListener("click", () => requestAnimationFrame(refreshSharedCopy));
})();
