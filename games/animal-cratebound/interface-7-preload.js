(() => {
  "use strict";

  if (window.__wpCrateboundInterface7Preload) return;
  window.__wpCrateboundInterface7Preload = true;

  const preloadScript = document.currentScript;
  const assetBase = new URL("../../src/", preloadScript?.src || document.baseURI);
  if (!window.WeightPlayStageV6 && !document.querySelector('script[src*="stage-virtualization-standard.js"]')) {
    const source = new URL("stage-virtualization-standard.js?v=20260809-stage-v6-source-demotion-v8", assetBase).href;
    document.write(`<script src="${source}" data-wp-cratebound-stage-v6-preload><\/script>`);
  }

  if (!document.querySelector('link[data-wp-cratebound-interface7]')) {
    const cleanup = document.createElement("link");
    cleanup.rel = "stylesheet";
    cleanup.href = new URL("interface-7-cleanup.css?v=20260923-cratebound-interface7-cleanup1", preloadScript?.src || document.baseURI).href;
    cleanup.dataset.wpCrateboundInterface7 = "true";
    document.head.append(cleanup);
  }
  if (!document.querySelector('link[data-wp-cratebound-interface7-corrections]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("interface-7-corrections.css?v=20260923-cratebound-interface7-corrections1", preloadScript?.src || document.baseURI).href;
    link.dataset.wpCrateboundInterface7Corrections = "true";
    document.head.append(link);
  }

  const TOTAL_STAGES = 30;
  const POOL_SIZE = 9;
  const RESULT_COPY = {
    en: ["Stages", "Next Stage", "Replay"],
    "zh-Hant": ["關卡", "下一關", "重玩"],
    "zh-Hans": ["关卡", "下一关", "重玩"],
    ja: ["ステージ", "次のステージ", "リプレイ"],
    ko: ["스테이지", "다음 스테이지", "다시 플레이"],
    es: ["Niveles", "Siguiente nivel", "Repetir"],
    "pt-BR": ["Fases", "Próxima fase", "Jogar novamente"],
    fr: ["Niveaux", "Niveau suivant", "Rejouer"],
    de: ["Level", "Nächstes Level", "Nochmal spielen"],
    it: ["Livelli", "Livello successivo", "Rigioca"],
    ru: ["Уровни", "Следующий уровень", "Переиграть"],
    hi: ["स्तर", "अगला स्तर", "फिर से खेलें"],
    ar: ["المراحل", "المرحلة التالية", "إعادة اللعب"],
  };
  let current = null;
  let controller = null;

  const clampStageIndex = (value) => Math.max(0, Math.min(TOTAL_STAGES - 1, Number(value) || 0));
  const recommendedIndex = () => clampStageIndex((Number(current?.save?.unlocked) || 1) - 1);
  const stageNumber = (index) => clampStageIndex(index) + 1;
  const activeLocale = () => {
    const raw = window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || document.documentElement.lang || "en";
    if (/^zh-(tw|hant)/i.test(raw)) return "zh-Hant";
    if (/^zh/i.test(raw)) return "zh-Hans";
    if (/^pt/i.test(raw)) return "pt-BR";
    return raw.split("-")[0];
  };

  function syncResultCopy() {
    const labels = RESULT_COPY[activeLocale()] || RESULT_COPY.en;
    const stages = document.getElementById("resultStage");
    const next = document.getElementById("next");
    const replay = document.getElementById("retry");
    if (stages) stages.textContent = labels[0];
    if (next) next.textContent = labels[1];
    if (replay) replay.textContent = labels[2];
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", syncResultCopy, { once: true });
  else syncResultCopy();
  window.addEventListener("wonder:locale-change", () => queueMicrotask(syncResultCopy));

  function bindCard(card, index) {
    if (!current) return;
    const n = stageNumber(index);
    const unlocked = Math.max(1, Math.min(TOTAL_STAGES, Number(current.save?.unlocked) || 1));
    const locked = n > unlocked;
    const cleared = Boolean(current.save?.cleared?.[n]);
    const chapter = current.chapters?.[current.chapterFor?.(n) ?? 0] || "";

    card.type = "button";
    card.className = `stage-card${locked ? " locked" : ""}`;
    card.dataset.stage = String(n);
    card.dataset.wpStageRecommended = n === unlocked ? "true" : "false";
    card.setAttribute("aria-disabled", String(locked));
    card.setAttribute("aria-label", `Stage ${n}. ${chapter}. ${locked ? "Locked" : cleared ? "Cleared · Replay" : "Ready"}`);
    card.innerHTML = `<small>${chapter}</small><strong>Stage ${n}</strong><span>${locked ? "Locked" : cleared ? "Cleared · Replay" : "Ready"}</span>`;
  }

  function activate(index) {
    if (!current || !controller) return;
    const n = stageNumber(index);
    const unlocked = Math.max(1, Math.min(TOTAL_STAGES, Number(current.save?.unlocked) || 1));
    if (n > unlocked) {
      current.announce?.("Complete the previous stage first.");
      return;
    }
    if (Number(current.getCentered?.()) !== n) {
      current.setCentered?.(n);
      controller.center(index);
      return;
    }
    current.enter?.(n);
  }

  function ensureController() {
    if (controller || !current?.rail || !window.WeightPlayStageV6?.install) return controller;
    current.rail.dataset.wpStageV6Total = String(TOTAL_STAGES);
    current.rail.dataset.wpStageV6PoolSize = String(POOL_SIZE);
    controller = window.WeightPlayStageV6.install(current.rail, {
      total: () => TOTAL_STAGES,
      poolSize: POOL_SIZE,
      initialIndex: recommendedIndex,
      bind: bindCard,
      activate,
      onChange: (index) => current?.setCentered?.(stageNumber(index)),
    });
    return controller;
  }

  window.BlockTrilogyStageRenderer = {
    render(context) {
      current = context;
      const instance = ensureController();
      if (!instance) return false;
      instance.refresh();
      const target = recommendedIndex();
      current.setCentered?.(target + 1);
      instance.center(target);
      return true;
    },
    refresh() {
      if (!controller || !current) return false;
      const refreshed = controller.refresh();
      controller.center(recommendedIndex());
      syncResultCopy();
      return refreshed;
    },
  };
})();
