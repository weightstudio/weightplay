/* CRATEBOUND_AUTHORED_MAPS_START — explicit deck topology, no runtime randomization. */
(()=>{
  const plans = [
    {"chapter":0,"featureTier":0,"name":"first-turn","decision":"Walk below the crate before the first push","width":7,"height":5,"size":7,"walls":[],"player":{"x":1,"y":1},"boxes":[{"x":2,"y":2,"linked":false}],"goals":[{"x":5,"y":2}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":3,"variant":0,"rows":["       "," ..... "," ..... "," ..... ","       "]},
    {"chapter":0,"featureTier":0,"name":"corner-approach","decision":"Change sides to turn the crate around a short corner","width":7,"height":6,"size":7,"walls":[{"x":3,"y":3}],"player":{"x":2,"y":2},"boxes":[{"x":3,"y":2,"linked":false}],"goals":[{"x":5,"y":3}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":3,"variant":1,"rows":["       "," ..... "," ..... "," ..... "," ..... ","       "]},
    {"chapter":0,"featureTier":0,"name":"shared-bay","decision":"Dock the upper crate without blocking the lower approach","width":7,"height":6,"size":7,"walls":[],"player":{"x":2,"y":3},"boxes":[{"x":3,"y":2,"linked":false},{"x":3,"y":3,"linked":false}],"goals":[{"x":2,"y":1},{"x":4,"y":3}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":3,"variant":2,"rows":["       "," ..... "," ..... "," ..... "," ..... ","       "]},
    {"chapter":0,"featureTier":0,"name":"side-pocket","decision":"Use the side pocket to get behind the crate","width":7,"height":6,"size":7,"walls":[{"x":3,"y":3}],"player":{"x":2,"y":3},"boxes":[{"x":3,"y":2,"linked":false}],"goals":[{"x":4,"y":4}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":3,"variant":3,"rows":["       ","  ...  "," ..... "," ..... "," ..... ","       "]},
    {"chapter":0,"featureTier":0,"name":"dock-order","decision":"Keep the central approach open for the second crate","width":7,"height":7,"size":7,"walls":[{"x":3,"y":3}],"player":{"x":2,"y":3},"boxes":[{"x":3,"y":2,"linked":false},{"x":2,"y":4,"linked":false}],"goals":[{"x":3,"y":1},{"x":4,"y":4}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":3,"variant":4,"rows":["       "," ..... "," ..... "," ..... "," ..... "," ..... ","       "]},
    {"chapter":1,"featureTier":1,"name":"ice-stop","decision":"Use a short ice rail to deliver in one push","width":7,"height":5,"size":7,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":2,"y":2,"linked":false}],"goals":[{"x":5,"y":2}],"ice":[{"x":3,"y":2},{"x":4,"y":2}],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":3,"variant":0,"rows":["       "," ..... "," ..... "," ..... ","       "]},
    {"chapter":1,"featureTier":1,"name":"ice-turn","decision":"Slide to the turning bay, then approach from above","width":7,"height":6,"size":7,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":2,"y":2,"linked":false}],"goals":[{"x":5,"y":4}],"ice":[{"x":3,"y":2},{"x":4,"y":2}],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":5,"variant":1,"rows":["       "," ..... "," ..... "," ..... ","   ... ","       "]},
    {"chapter":1,"featureTier":1,"name":"ice-brake","decision":"A rubble stop prevents the crate from overshooting","width":8,"height":6,"size":8,"walls":[{"x":6,"y":2}],"player":{"x":1,"y":2},"boxes":[{"x":2,"y":2,"linked":false}],"goals":[{"x":5,"y":4}],"ice":[{"x":3,"y":2},{"x":4,"y":2}],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":5,"variant":2,"rows":["        "," ...... "," ...... "," ...... "," ...... ","        "]},
    {"chapter":1,"featureTier":1,"name":"two-ice-docks","decision":"Clear the near cargo before routing the ice cargo","width":8,"height":7,"size":8,"walls":[{"x":3,"y":3}],"player":{"x":1,"y":2},"boxes":[{"x":2,"y":2,"linked":false},{"x":2,"y":4,"linked":false}],"goals":[{"x":5,"y":2},{"x":3,"y":4}],"ice":[{"x":3,"y":2},{"x":4,"y":2}],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":4,"variant":3,"rows":["        "," ...... "," ...... "," ...... "," ...... "," ....   ","        "]},
    {"chapter":1,"featureTier":1,"name":"ice-crossing","decision":"Route two crates across the shared turning square","width":7,"height":7,"size":7,"walls":[],"player":{"x":1,"y":3},"boxes":[{"x":3,"y":2,"linked":false},{"x":2,"y":3,"linked":false}],"goals":[{"x":3,"y":1},{"x":5,"y":5}],"ice":[{"x":3,"y":3},{"x":4,"y":3}],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":6,"variant":4,"rows":["       ","  ...  "," ..... "," ..... "," ..... ","   ... ","       "]},
    {"chapter":2,"featureTier":2,"name":"first-signal","decision":"Step on the signal before delivering through its gate","width":7,"height":5,"size":7,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":2,"y":2,"linked":false}],"goals":[{"x":5,"y":2}],"ice":[],"switches":[{"x":3,"y":1}],"gate":{"x":3,"y":2,"open":false},"belts":[],"pulls":0,"distance":3,"variant":0,"rows":["       "," ..... "," ..... "," ..... ","       "]},
    {"chapter":2,"featureTier":2,"name":"signal-pocket","decision":"Enter the side bay to open the blocked dock","width":7,"height":6,"size":7,"walls":[{"x":3,"y":2}],"player":{"x":1,"y":3},"boxes":[{"x":2,"y":3,"linked":false}],"goals":[{"x":4,"y":3}],"ice":[],"switches":[{"x":2,"y":1}],"gate":{"x":3,"y":3,"open":false},"belts":[],"pulls":0,"distance":2,"variant":1,"rows":["       ","  .... "," ..... "," ..... "," ..... ","       "]},
    {"chapter":2,"featureTier":2,"name":"signal-cargo","decision":"Move the crate off the switch before using the gate","width":7,"height":5,"size":7,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":2,"y":2,"linked":false}],"goals":[{"x":5,"y":2}],"ice":[],"switches":[{"x":2,"y":2,"linked":false}],"gate":{"x":4,"y":2,"open":false},"belts":[],"pulls":0,"distance":3,"variant":2,"rows":["       "," ..... "," ..... "," ..... ","       "]},
    {"chapter":2,"featureTier":2,"name":"signal-two-docks","decision":"Keep the signal approach clear until both crates can pass","width":7,"height":7,"size":7,"walls":[{"x":3,"y":3}],"player":{"x":1,"y":4},"boxes":[{"x":2,"y":2,"linked":false},{"x":2,"y":4,"linked":false}],"goals":[{"x":5,"y":2},{"x":4,"y":4}],"ice":[],"switches":[{"x":3,"y":1}],"gate":{"x":3,"y":2,"open":false},"belts":[],"pulls":0,"distance":5,"variant":3,"rows":["       "," ..... "," ..... "," ..... "," ..... "," ..... ","       "]},
    {"chapter":2,"featureTier":2,"name":"signal-ice","decision":"Open the gate before sending cargo across the ice","width":8,"height":5,"size":8,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":2,"y":2,"linked":false}],"goals":[{"x":6,"y":2}],"ice":[{"x":4,"y":2}],"switches":[{"x":4,"y":1}],"gate":{"x":3,"y":2,"open":false},"belts":[],"pulls":0,"distance":4,"variant":4,"rows":["        "," ...... "," ...... "," ...... ","        "]},
    {"chapter":3,"featureTier":3,"name":"first-pull","decision":"Pull the wall-bound crate into space, then walk behind it","width":7,"height":5,"size":7,"walls":[],"player":{"x":2,"y":2},"boxes":[{"x":1,"y":2,"linked":false}],"goals":[{"x":4,"y":2}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":1,"distance":3,"variant":0,"rows":["       "," ..... "," ..... "," ..... ","       "]},
    {"chapter":3,"featureTier":3,"name":"pull-turn","decision":"Free the crate, then change its delivery direction","width":7,"height":6,"size":7,"walls":[{"x":3,"y":3}],"player":{"x":2,"y":2},"boxes":[{"x":1,"y":2,"linked":false}],"goals":[{"x":4,"y":4}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":1,"distance":5,"variant":1,"rows":["       "," ..... "," ..... "," ..... "," ..... ","       "]},
    {"chapter":3,"featureTier":3,"name":"pull-two-docks","decision":"Recover the wall crate without trapping the second cargo","width":7,"height":7,"size":7,"walls":[{"x":3,"y":3}],"player":{"x":2,"y":2},"boxes":[{"x":1,"y":2,"linked":false},{"x":2,"y":4,"linked":false}],"goals":[{"x":4,"y":2},{"x":3,"y":4}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":1,"distance":4,"variant":2,"rows":["       "," ..... "," ..... "," ..... "," ..... "," ..... ","       "]},
    {"chapter":3,"featureTier":3,"name":"pull-signal","decision":"Free the crate and open its short delivery lane","width":7,"height":5,"size":7,"walls":[],"player":{"x":2,"y":2},"boxes":[{"x":1,"y":2,"linked":false}],"goals":[{"x":5,"y":2}],"ice":[],"switches":[{"x":3,"y":1}],"gate":{"x":3,"y":2,"open":false},"belts":[],"pulls":1,"distance":4,"variant":3,"rows":["       "," ..... "," ..... "," ..... ","       "]},
    {"chapter":3,"featureTier":3,"name":"pull-ice","decision":"Spend one pull to enter the ice-delivery lane","width":8,"height":5,"size":8,"walls":[],"player":{"x":2,"y":2},"boxes":[{"x":1,"y":2,"linked":false}],"goals":[{"x":5,"y":2}],"ice":[{"x":3,"y":2},{"x":4,"y":2}],"switches":[],"gate":null,"belts":[],"pulls":1,"distance":4,"variant":4,"rows":["        "," ...... "," ...... "," ...... ","        "]},
    {"chapter":4,"featureTier":4,"name":"first-pair","decision":"Find the side of the linked pair that moves both crates","width":7,"height":7,"size":7,"walls":[],"player":{"x":2,"y":3},"boxes":[{"x":2,"y":2,"linked":true},{"x":3,"y":2,"linked":true}],"goals":[{"x":2,"y":4},{"x":3,"y":4}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":1,"distance":4,"variant":0,"rows":["       "," ..... "," ..... "," ..... "," ..... "," ..... ","       "]},
    {"chapter":4,"featureTier":4,"name":"pair-turn","decision":"Shift the pair sideways before the final downward approach","width":8,"height":7,"size":8,"walls":[],"player":{"x":3,"y":3},"boxes":[{"x":2,"y":2,"linked":true},{"x":3,"y":2,"linked":true}],"goals":[{"x":4,"y":4},{"x":5,"y":4}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":1,"distance":8,"variant":1,"rows":["        "," ...... "," ...... "," ...... "," ...... ","   .... ","        "]},
    {"chapter":4,"featureTier":4,"name":"pair-clearance","decision":"Both destinations need space around the rubble","width":8,"height":7,"size":8,"walls":[{"x":3,"y":3}],"player":{"x":2,"y":3},"boxes":[{"x":2,"y":2,"linked":true},{"x":3,"y":2,"linked":true}],"goals":[{"x":4,"y":4},{"x":5,"y":4}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":1,"distance":8,"variant":2,"rows":["        "," ...... "," ...... "," ...... "," ...... "," ...... ","        "]},
    {"chapter":4,"featureTier":4,"name":"pair-signal","decision":"Open a gate in the linked pair lane","width":8,"height":7,"size":8,"walls":[],"player":{"x":2,"y":3},"boxes":[{"x":2,"y":2,"linked":true},{"x":3,"y":2,"linked":true}],"goals":[{"x":2,"y":4},{"x":3,"y":4}],"ice":[],"switches":[{"x":3,"y":1}],"gate":{"x":3,"y":3,"open":false},"belts":[],"pulls":1,"distance":4,"variant":3,"rows":["        "," ...... "," ...... "," ...... "," ...... "," ...... ","        "]},
    {"chapter":4,"featureTier":4,"name":"pair-and-single","decision":"Dock the single crate before it blocks the linked pair","width":8,"height":8,"size":8,"walls":[{"x":4,"y":3}],"player":{"x":2,"y":3},"boxes":[{"x":2,"y":2,"linked":true},{"x":3,"y":2,"linked":true},{"x":3,"y":4,"linked":false}],"goals":[{"x":4,"y":4},{"x":5,"y":5},{"x":6,"y":5}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":1,"distance":13,"variant":4,"rows":["        "," ...... "," ...... "," ...... "," ...... "," ...... "," ...... ","        "]},
    {"chapter":5,"featureTier":5,"name":"first-belt","decision":"Read the short belt landing before the first delivery","width":8,"height":5,"size":8,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":4,"y":2,"linked":false}],"goals":[{"x":5,"y":2}],"ice":[],"switches":[],"gate":null,"belts":[{"x":2,"y":2,"dx":1,"dy":0}],"pulls":1,"distance":1,"variant":0,"rows":["        ","    ... "," ...... ","    ... ","        "]},
    {"chapter":5,"featureTier":5,"name":"belt-turn","decision":"Use the belt landing to approach a different side of the crate","width":8,"height":6,"size":8,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":4,"y":2,"linked":false}],"goals":[{"x":5,"y":4}],"ice":[],"switches":[],"gate":null,"belts":[{"x":2,"y":2,"dx":1,"dy":0}],"pulls":1,"distance":3,"variant":1,"rows":["        ","   .... "," ...... ","   .... ","     .. ","        "]},
    {"chapter":5,"featureTier":5,"name":"belt-signal","decision":"Open the gate and account for the belt after the push","width":8,"height":5,"size":8,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":5,"y":2,"linked":false}],"goals":[{"x":6,"y":2}],"ice":[],"switches":[{"x":3,"y":1}],"gate":{"x":4,"y":2,"open":false},"belts":[{"x":2,"y":2,"dx":1,"dy":0}],"pulls":1,"distance":1,"variant":2,"rows":["        ","   .... "," ...... ","    ... ","        "]},
    {"chapter":5,"featureTier":5,"name":"belt-and-pair","decision":"Use the belt entrance, then turn the linked pair toward the dock","width":9,"height":7,"size":9,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":4,"y":2,"linked":true},{"x":5,"y":2,"linked":true}],"goals":[{"x":6,"y":4},{"x":7,"y":4}],"ice":[],"switches":[],"gate":null,"belts":[{"x":2,"y":2,"dx":1,"dy":0}],"pulls":1,"distance":8,"variant":3,"rows":["         ","    .... "," ....... ","    .... ","    .... ","    .... ","         "]},
    {"chapter":5,"featureTier":5,"name":"compact-finale","decision":"Recover one crate and coordinate the shared dock approaches","width":9,"height":8,"size":9,"walls":[{"x":3,"y":3},{"x":5,"y":3}],"player":{"x":2,"y":2},"boxes":[{"x":1,"y":2,"linked":false},{"x":3,"y":4,"linked":false},{"x":3,"y":5,"linked":false}],"goals":[{"x":6,"y":2},{"x":5,"y":4},{"x":6,"y":5}],"ice":[],"switches":[{"x":4,"y":1}],"gate":{"x":3,"y":2,"open":false},"belts":[{"x":4,"y":1,"dx":-1,"dy":0}],"pulls":1,"distance":10,"variant":4,"rows":["         "," ....... "," ....... "," ....... "," ....... "," ....... "," ....... ","         "]}
  ];
  window.WeightPlayCrateboundMaps = Object.freeze({
    createPlan(stage) {
      const source=plans[stage-1]; if(!source)throw new RangeError('Unknown warehouse');
      const plan=JSON.parse(JSON.stringify(source));
      plan.floor=[];
      plan.rows.forEach((row,y)=>[...row].forEach((cell,x)=>{if(cell==='.')plan.floor.push({x,y})}));
      return plan;
    }
  });
})();
/* CRATEBOUND_AUTHORED_MAPS_END */
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
    cleanup.href = new URL("interface-7-cleanup.css?v=20261018-cratebound-dark-follow-v18", preloadScript?.src || document.baseURI).href;
    cleanup.dataset.wpCrateboundInterface7 = "true";
    document.head.append(cleanup);
  }
  if (!document.querySelector('link[data-wp-cratebound-interface7-corrections]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("interface-7-corrections.css?v=20261018-cratebound-dark-follow-v18", preloadScript?.src || document.baseURI).href;
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
