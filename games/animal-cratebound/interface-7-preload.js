/* CRATEBOUND_AUTHORED_MAPS_START — explicit deck topology, no runtime randomization. */
(()=>{
  const plans = [
  {"chapter":0,"featureTier":0,"name":"first-turn","width":7,"height":7,"size":7,"walls":[],"player":{"x":1,"y":1},"boxes":[{"x":2,"y":2,"linked":false}],"goals":[{"x":5,"y":2}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":4,"variant":0,"rows":["       "," ..... "," ..... "," ..... ","   ... ","   ... ","       "]},
  {"chapter":0,"featureTier":0,"name":"side-bay","width":9,"height":8,"size":9,"walls":[],"player":{"x":2,"y":6},"boxes":[{"x":2,"y":5,"linked":false}],"goals":[{"x":6,"y":2}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":7,"variant":0,"rows":["         "," ....... "," ....... "," ....... "," ...     "," ...     "," ...     ","         "]},
  {"chapter":0,"featureTier":0,"name":"offset-rooms","width":10,"height":8,"size":10,"walls":[],"player":{"x":2,"y":2},"boxes":[{"x":2,"y":3,"linked":false}],"goals":[{"x":7,"y":5}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":7,"variant":0,"rows":["          "," ....     "," ....     "," ........ "," ........ ","    ..... ","    ..... ","          "]},
  {"chapter":0,"featureTier":0,"name":"cross-dock","width":9,"height":9,"size":9,"walls":[],"player":{"x":3,"y":7},"boxes":[{"x":3,"y":6,"linked":false}],"goals":[{"x":6,"y":4}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":5,"variant":0,"rows":["         ","   ...   ","   ...   "," ....... "," ....... "," ....... ","   ...   ","   ...   ","         "]},
  {"chapter":0,"featureTier":0,"name":"return-loop","width":10,"height":10,"size":10,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":2,"y":2,"linked":false}],"goals":[{"x":7,"y":7}],"ice":[],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":10,"variant":0,"rows":["          "," ........ "," ........ "," ...  ... "," ...  ... "," ...  ... "," ...  ... "," ........ "," ........ ","          "]},
  {"chapter":1,"featureTier":1,"name":"ice-wing","width":10,"height":9,"size":10,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":2,"y":2,"linked":false}],"goals":[{"x":7,"y":6}],"ice":[{"x":1,"y":1},{"x":1,"y":3},{"x":2,"y":1}],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":9,"variant":2,"rows":["          "," ........ "," ........ "," ........ ","      ... ","      ... ","      ... ","      ... ","          "]},
  {"chapter":1,"featureTier":1,"name":"staggered-bays","width":12,"height":10,"size":12,"walls":[],"player":{"x":1,"y":2},"boxes":[{"x":2,"y":2,"linked":false}],"goals":[{"x":9,"y":7}],"ice":[{"x":1,"y":1},{"x":1,"y":3},{"x":1,"y":4}],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":12,"variant":1,"rows":["            "," .....      "," .....      "," .....      "," ........   ","    .....   ","    ....... ","       .... ","       .... ","            "]},
  {"chapter":1,"featureTier":1,"name":"twin-ice-halls","width":13,"height":7,"size":13,"walls":[],"player":{"x":1,"y":3},"boxes":[{"x":2,"y":3,"linked":false}],"goals":[{"x":10,"y":4}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":4}],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":9,"variant":4,"rows":["             "," ....   .... "," ....   .... "," ........... "," ........... "," ....   .... ","             "]},
  {"chapter":1,"featureTier":1,"name":"long-slipway","width":14,"height":8,"size":14,"walls":[],"player":{"x":1,"y":3},"boxes":[{"x":2,"y":3,"linked":false}],"goals":[{"x":11,"y":4}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":4}],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":10,"variant":0,"rows":["              "," ............ "," ............ "," ............ "," ....    .... "," ....    .... "," ....         ","              "]},
  {"chapter":1,"featureTier":1,"name":"ice-courtyard","width":11,"height":12,"size":12,"walls":[],"player":{"x":2,"y":6},"boxes":[{"x":2,"y":7,"linked":false}],"goals":[{"x":8,"y":9}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[],"gate":null,"belts":[],"pulls":0,"distance":8,"variant":0,"rows":["           "," ......... "," ......... "," ......... "," ...   ... "," ...   ... "," ...   ... "," ...   ... "," ......... "," ......... "," ......... ","           "]},
  {"chapter":2,"featureTier":2,"name":"signal-neck","width":15,"height":7,"size":15,"walls":[],"player":{"x":9,"y":2},"boxes":[{"x":10,"y":2,"linked":false},{"x":6,"y":3,"linked":false}],"goals":[{"x":12,"y":4},{"x":2,"y":2}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":10,"y":2}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":0,"distance":9,"variant":3,"rows":["               "," .....   ..... "," .....   ..... "," ............. "," .....   ..... "," .....   ..... ","               "]},
  {"chapter":2,"featureTier":2,"name":"signal-return","width":11,"height":11,"size":11,"walls":[],"player":{"x":1,"y":8},"boxes":[{"x":2,"y":5,"linked":false},{"x":2,"y":8,"linked":false}],"goals":[{"x":8,"y":8},{"x":2,"y":2}],"ice":[{"x":1,"y":9},{"x":3,"y":1},{"x":3,"y":2}],"switches":[{"x":2,"y":8}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":0,"distance":9,"variant":0,"rows":["           "," ......    "," ......    "," ......... "," ...   ... "," ...   ... "," ...   ... "," ......... "," ......... "," ......... ","           "]},
  {"chapter":2,"featureTier":2,"name":"three-landings","width":15,"height":11,"size":15,"walls":[],"player":{"x":8,"y":5},"boxes":[{"x":10,"y":3,"linked":false},{"x":8,"y":4,"linked":false}],"goals":[{"x":12,"y":8},{"x":2,"y":2}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":8,"y":4}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":0,"distance":15,"variant":0,"rows":["               "," ....          "," ....   ....   "," ...........   "," ...........   ","        ....   ","        ...... ","          .... ","          .... ","          .... ","               "]},
  {"chapter":2,"featureTier":2,"name":"switch-courtyard","width":12,"height":13,"size":13,"walls":[],"player":{"x":9,"y":2},"boxes":[{"x":9,"y":3,"linked":false},{"x":9,"y":7,"linked":false}],"goals":[{"x":9,"y":10},{"x":2,"y":2}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":9,"y":3}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":0,"distance":10,"variant":0,"rows":["            "," .......... "," .......... "," .......... "," ...    ... "," ...    ... "," .......... "," .......... "," ...    ... "," .......... "," .......... "," .......... ","            "]},
  {"chapter":2,"featureTier":2,"name":"signal-crossroads","width":16,"height":12,"size":16,"walls":[],"player":{"x":5,"y":5},"boxes":[{"x":6,"y":5,"linked":false},{"x":5,"y":4,"linked":false}],"goals":[{"x":13,"y":5},{"x":2,"y":2}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":6,"y":5}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":0,"distance":12,"variant":1,"rows":["                "," .....    ..... "," .....    ..... "," .............. "," .............. "," .............. ","      ......... ","      ....      ","    ......      ","    ......      ","      ....      ","                "]},
  {"chapter":3,"featureTier":3,"name":"magnet-elbow","width":14,"height":13,"size":14,"walls":[],"player":{"x":4,"y":10},"boxes":[{"x":5,"y":10,"linked":false},{"x":5,"y":8,"linked":false}],"goals":[{"x":11,"y":10},{"x":2,"y":2}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":5,"y":10}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":1,"distance":14,"variant":0,"rows":["              "," ......       "," ......       "," ......       "," ......       ","    ...       ","    ...       ","    ...       ","    ...       ","    ......... ","    ......... ","    ......... ","              "]},
  {"chapter":3,"featureTier":3,"name":"freight-spine","width":19,"height":11,"size":19,"walls":[],"player":{"x":9,"y":8},"boxes":[{"x":8,"y":8,"linked":false},{"x":3,"y":2,"linked":false}],"goals":[{"x":16,"y":4},{"x":2,"y":2}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":5,"y":1}],"switches":[{"x":8,"y":8}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":1,"distance":13,"variant":1,"rows":["                   "," .....       ..... "," .....       ..... "," ................. "," ................. "," ................. ","       .....       ","       .....       ","       .....       ","       .....       ","                   "]},
  {"chapter":3,"featureTier":3,"name":"upper-lower-docks","width":14,"height":13,"size":14,"walls":[],"player":{"x":9,"y":3},"boxes":[{"x":10,"y":4,"linked":false},{"x":10,"y":3,"linked":false}],"goals":[{"x":11,"y":10},{"x":2,"y":2}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":10,"y":3}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":1,"distance":15,"variant":4,"rows":["              "," .....        "," .....        "," ............ "," ............ "," .....   .... ","         .... ","         .... ","         .... ","   .......... ","   .......... ","   .......... ","              "]},
  {"chapter":3,"featureTier":3,"name":"double-return","width":15,"height":14,"size":15,"walls":[],"player":{"x":7,"y":11},"boxes":[{"x":12,"y":3,"linked":false},{"x":8,"y":11,"linked":false}],"goals":[{"x":12,"y":11},{"x":2,"y":2}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":8,"y":11}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":1,"distance":12,"variant":0,"rows":["               "," ............. "," ............. "," ............. "," ...  ...  ... "," ...  ...  ... "," ...  ...  ... "," ...  ...  ... "," ...  ...  ... "," ...  ...  ... "," ............. "," ............. "," ............. ","               "]},
  {"chapter":3,"featureTier":3,"name":"magnet-terminal","width":18,"height":13,"size":18,"walls":[],"player":{"x":15,"y":1},"boxes":[{"x":15,"y":2,"linked":false},{"x":6,"y":10,"linked":false}],"goals":[{"x":15,"y":5},{"x":2,"y":2}],"ice":[{"x":3,"y":3},{"x":3,"y":4},{"x":3,"y":5}],"switches":[{"x":15,"y":2}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":1,"distance":15,"variant":0,"rows":["                  "," ......    ...... "," ......    ...... "," ................ "," ................ "," ......    ...... ","    ...    ...... ","    ...      ..   ","    ...      ..   ","    ...........   ","    ...........   ","       ........   ","                  "]},
  {"chapter":4,"featureTier":4,"name":"paired-gangway","width":15,"height":14,"size":15,"walls":[],"player":{"x":6,"y":9},"boxes":[{"x":5,"y":8,"linked":true},{"x":6,"y":8,"linked":true},{"x":6,"y":11,"linked":false}],"goals":[{"x":2,"y":2},{"x":3,"y":2},{"x":12,"y":11}],"ice":[{"x":1,"y":1},{"x":3,"y":4},{"x":5,"y":1}],"switches":[{"x":6,"y":8}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":1,"distance":23,"variant":0,"rows":["               "," .......       "," .......       "," .......       "," .......       ","     ...       ","     ...       ","     ...       ","     ...       ","     ......... ","     ......... ","     ......... ","     ......... ","               "]},
  {"chapter":4,"featureTier":4,"name":"split-loading-bays","width":19,"height":15,"size":19,"walls":[],"player":{"x":12,"y":4},"boxes":[{"x":4,"y":6,"linked":true},{"x":5,"y":6,"linked":true},{"x":12,"y":5,"linked":false}],"goals":[{"x":2,"y":2},{"x":3,"y":2},{"x":12,"y":12}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":12,"y":5}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":1,"distance":18,"variant":1,"rows":["                   "," ......     ...... "," ......     ...... "," ................. "," ................. "," ......     ...... "," ......     ...... ","     ...   ...     ","     ...   ...     ","     ...   ...     ","     ...   ...     ","     .........     ","     .........     ","     .........     ","                   "]},
  {"chapter":4,"featureTier":4,"name":"linked-courtyard","width":16,"height":15,"size":16,"walls":[],"player":{"x":13,"y":1},"boxes":[{"x":11,"y":11,"linked":true},{"x":12,"y":11,"linked":true},{"x":13,"y":2,"linked":false}],"goals":[{"x":2,"y":2},{"x":3,"y":2},{"x":13,"y":12}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":13,"y":2}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":1,"distance":15,"variant":0,"rows":["                "," .............. "," .............. "," .............. "," ....      .... "," ....      .... "," ....      .... "," .............. "," .............. "," ....      .... "," ....      .... "," .............. "," .............. "," .............. ","                "]},
  {"chapter":4,"featureTier":4,"name":"cargo-fork","width":18,"height":15,"size":18,"walls":[],"player":{"x":15,"y":3},"boxes":[{"x":14,"y":4,"linked":true},{"x":15,"y":4,"linked":true},{"x":9,"y":6,"linked":false}],"goals":[{"x":2,"y":2},{"x":3,"y":2},{"x":9,"y":12}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":15,"y":4}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":1,"distance":33,"variant":2,"rows":["                  "," ......    ...... "," ......    ...... "," ......    ...... "," ................ "," ................ "," ................ "," ................ ","       ....       ","       ....       ","       ....       ","       ....       ","       ....       ","       ....       ","                  "]},
  {"chapter":4,"featureTier":4,"name":"paired-terminal","width":21,"height":13,"size":21,"walls":[],"player":{"x":5,"y":10},"boxes":[{"x":5,"y":9,"linked":true},{"x":6,"y":9,"linked":true},{"x":7,"y":10,"linked":false}],"goals":[{"x":2,"y":2},{"x":3,"y":2},{"x":14,"y":10}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":5,"y":9}],"gate":{"x":2,"y":3,"open":false},"belts":[],"pulls":1,"distance":25,"variant":2,"rows":["                     "," .......     ....... "," .......     ....... "," ................... "," ................... "," .......     ....... ","   ....         ..   ","   ....         ..   ","   ....         ..   ","   .............     ","   .............     ","       .........     ","                     "]},
  {"chapter":5,"featureTier":5,"name":"storm-stair","width":18,"height":16,"size":18,"walls":[],"player":{"x":12,"y":9},"boxes":[{"x":12,"y":10,"linked":false},{"x":6,"y":4,"linked":false},{"x":13,"y":12,"linked":false}],"goals":[{"x":15,"y":13},{"x":2,"y":2},{"x":8,"y":8}],"ice":[{"x":1,"y":1},{"x":4,"y":1},{"x":5,"y":6}],"switches":[{"x":12,"y":10}],"gate":{"x":2,"y":3,"open":false},"belts":[{"x":8,"y":9,"dx":1,"dy":0},{"x":8,"y":10,"dx":1,"dy":0}],"pulls":2,"distance":15,"variant":9,"rows":["                  "," .......          "," .......          "," .......          "," .......          ","     ....         ","     ....         ","     .........    ","     .........    ","        ......    ","        ......    ","           ...... ","           ...... ","           ...... ","           ...... ","                  "]},
  {"chapter":5,"featureTier":5,"name":"storm-ring","width":19,"height":17,"size":19,"walls":[],"player":{"x":14,"y":2},"boxes":[{"x":15,"y":2,"linked":false},{"x":12,"y":13,"linked":false},{"x":2,"y":14,"linked":false}],"goals":[{"x":16,"y":14},{"x":2,"y":2},{"x":3,"y":14}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":15,"y":2}],"gate":{"x":2,"y":3,"open":false},"belts":[{"x":1,"y":4,"dx":1,"dy":0},{"x":1,"y":5,"dx":1,"dy":0}],"pulls":2,"distance":19,"variant":4,"rows":["                   "," ................. "," ................. "," ................. "," ....         .... "," ....         .... "," ....         .... "," ................. "," ................. "," ....         .... "," ....         .... "," ....         .... "," ................. "," ................. "," ................. "," ................. ","                   "]},
  {"chapter":5,"featureTier":5,"name":"storm-islands","width":19,"height":14,"size":19,"walls":[],"player":{"x":16,"y":1},"boxes":[{"x":16,"y":2,"linked":false},{"x":11,"y":11,"linked":false},{"x":13,"y":2,"linked":false}],"goals":[{"x":16,"y":11},{"x":2,"y":2},{"x":5,"y":10}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":16,"y":2}],"gate":{"x":2,"y":3,"open":false},"belts":[{"x":1,"y":4,"dx":1,"dy":0},{"x":1,"y":5,"dx":1,"dy":0}],"pulls":2,"distance":25,"variant":0,"rows":["                   "," ......     ...... "," ......     ...... "," ................. "," ................. "," ......     ...... ","    ...        ... ","    ...        ... ","    ...        ... ","    ...        ... ","    .............. ","    .............. ","    .............. ","                   "]},
  {"chapter":5,"featureTier":5,"name":"storm-junction","width":22,"height":16,"size":22,"walls":[],"player":{"x":15,"y":3},"boxes":[{"x":16,"y":3,"linked":false},{"x":8,"y":7,"linked":false},{"x":16,"y":13,"linked":false}],"goals":[{"x":19,"y":7},{"x":2,"y":2},{"x":8,"y":13}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":16,"y":3}],"gate":{"x":2,"y":3,"open":false},"belts":[{"x":1,"y":4,"dx":1,"dy":0},{"x":1,"y":5,"dx":1,"dy":0}],"pulls":2,"distance":21,"variant":1,"rows":["                      "," ......  ....  ...... "," ......  ....  ...... "," ......  ....  ...... "," ......  ....  ...... "," .................... "," .................... "," .................... "," .................... ","    ....      ....    ","    ....      ....    ","    ....      ....    ","    ..............    ","    ..............    ","    ..............    ","                      "]},
  {"chapter":5,"featureTier":5,"name":"ark-network","width":22,"height":15,"size":22,"walls":[],"player":{"x":9,"y":4},"boxes":[{"x":10,"y":4,"linked":false},{"x":8,"y":3,"linked":false},{"x":17,"y":6,"linked":false}],"goals":[{"x":19,"y":4},{"x":4,"y":12},{"x":2,"y":2}],"ice":[{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3}],"switches":[{"x":10,"y":4}],"gate":{"x":2,"y":3,"open":false},"belts":[{"x":2,"y":1,"dx":1,"dy":0},{"x":3,"y":1,"dx":1,"dy":0}],"pulls":2,"distance":20,"variant":1,"rows":["                      "," .......      ....... "," .......      ....... "," .................... "," .................... "," .......      ....... ","   ...   ....   ...   ","   ...   ....   ...   ","   ...   ....   ...   ","   ...   ....   ...   ","   ...   ....   ...   ","   ................   ","   ................   ","   ................   ","                      "]}
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
