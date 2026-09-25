(function(){
  "use strict";
  const COPY = window.WPTwinLocales.locales;
  const ORDER = window.WPTwinLocales.order;
  const $ = (selector) => document.querySelector(selector);
  const canvas = $("#gameCanvas");
  const stageGrid = $("#stageGrid");
  const ctx = canvas.getContext("2d");
  const W = canvas.width; const H = canvas.height;
  // The authored routes place a direct step as high as 220 logical pixels
  // above a lane floor. Keep a generous margin so a shared Jump can reach it
  // even with 30fps phone updates instead of leaving the stage unwinnable.
  // Give the shared jump enough vertical clearance for the tallest authored
  // platform. The old impulse only barely cleared Stage 2 and left later
  // upper-lane shards unreachable after the Canvas was scaled on phones.
  const JUMP_VELOCITY = -660;
  const battleBackground = new Image();
  battleBackground.decoding = "async";
  battleBackground.src = "battle-bg-v2.webp";
  const twinSprites = new Image();
  twinSprites.decoding = "async";
  twinSprites.src = "twin-sprites-v2.webp";
  const twinProps = new Image();
  twinProps.decoding = "async";
  twinProps.src = "twin-props-v2.webp";
  const stages = [
    // Stage 1 keeps both lanes and the same three-shard/two-gate rules, but
    // brings the upper platforms into a readable synchronized jump window.
    { floors:[430,330], platforms:[[{x:245,y:360,w:145,h:16},{x:470,y:330,w:220,h:16}],[{x:200,y:260,w:135,h:16},{x:390,y:235,w:235,h:16}]], shards:[{lane:0,x:305,y:325},{lane:1,x:265,y:225},{lane:0,x:735,y:400}], switches:[], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[],[]] },
    { floors:[430,330], platforms:[[{x:230,y:350,w:120,h:16},{x:455,y:300,w:135,h:16},{x:700,y:360,w:120,h:16}],[{x:260,y:255,w:110,h:16},{x:540,y:195,w:140,h:16}]], shards:[{lane:0,x:270,y:315},{lane:1,x:315,y:220},{lane:0,x:520,y:265}], switches:[{lane:1,x:620,y:160}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[{x:620,y:404,w:64,h:26}],[]] },
    { floors:[430,330], platforms:[[{x:260,y:335,w:110,h:16},{x:500,y:255,w:130,h:16},{x:720,y:350,w:110,h:16}],[{x:210,y:245,w:120,h:16},{x:430,y:180,w:130,h:16},{x:675,y:235,w:125,h:16}]], shards:[{lane:0,x:295,y:300},{lane:1,x:475,y:145},{lane:0,x:755,y:315}], switches:[{lane:0,x:585,y:205}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ ],[{x:600,y:300,w:60,h:24}]] },
    { floors:[430,330], platforms:[[{x:215,y:360,w:110,h:16},{x:420,y:300,w:115,h:16},{x:635,y:235,w:115,h:16},{x:785,y:350,w:90,h:16}],[{x:270,y:245,w:120,h:16},{x:500,y:150,w:130,h:16},{x:730,y:245,w:115,h:16}]], shards:[{lane:0,x:250,y:325},{lane:1,x:560,y:115},{lane:0,x:680,y:200}], switches:[{lane:1,x:765,y:210}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[{x:350,y:405,w:48,h:25}], [{x:385,y:305,w:48,h:25}]] },
    { floors:[430,330], platforms:[[{x:230,y:350,w:120,h:16},{x:465,y:270,w:120,h:16},{x:660,y:345,w:110,h:16}],[{x:185,y:255,w:120,h:16},{x:380,y:175,w:125,h:16},{x:610,y:235,w:125,h:16},{x:790,y:170,w:80,h:16}]], shards:[{lane:0,x:280,y:315},{lane:1,x:425,y:140},{lane:1,x:650,y:200}], switches:[{lane:0,x:715,y:300},{lane:1,x:815,y:125}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:360,y:405,w:64,h:25}], [{x:540,y:305,w:58,h:25}]] },
    { floors:[430,330], platforms:[[{x:200,y:360,w:115,h:16},{x:395,y:285,w:115,h:16},{x:590,y:210,w:115,h:16},{x:785,y:335,w:90,h:16}],[{x:230,y:245,w:110,h:16},{x:420,y:155,w:125,h:16},{x:625,y:245,w:110,h:16},{x:785,y:135,w:90,h:16}]], shards:[{lane:0,x:250,y:325},{lane:1,x:465,y:120},{lane:0,x:650,y:165}], switches:[{lane:0,x:645,y:175},{lane:1,x:820,y:90}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:330,y:405,w:62,h:25},{x:705,y:405,w:60,h:25}], [{x:350,y:305,w:62,h:25},{x:570,y:305,w:60,h:25}]] },
    // Arc 2: authored zigzags and offset shelves. Each map changes both the
    // shared jump/landing decision and the relative shard or hazard route.
    { floors:[430,330], platforms:[[{x:190,y:365,w:110,h:16},{x:390,y:300,w:125,h:16},{x:620,y:355,w:125,h:16}],[{x:230,y:260,w:125,h:16},{x:485,y:205,w:130,h:16},{x:710,y:255,w:110,h:16}]], shards:[{lane:0,x:245,y:330},{lane:1,x:290,y:225},{lane:0,x:785,y:400}], switches:[], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:530,y:405,w:52,h:25}],[]] },
    { floors:[430,330], platforms:[[{x:210,y:350,w:130,h:16},{x:445,y:285,w:120,h:16},{x:695,y:350,w:125,h:16}],[{x:190,y:250,w:115,h:16},{x:415,y:195,w:135,h:16},{x:665,y:235,w:135,h:16}]], shards:[{lane:1,x:255,y:215},{lane:0,x:500,y:250},{lane:0,x:770,y:315}], switches:[{lane:1,x:735,y:200}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[],[{x:565,y:305,w:54,h:25}]] },
    { floors:[430,330], platforms:[[{x:235,y:355,w:120,h:16},{x:470,y:305,w:130,h:16},{x:725,y:350,w:105,h:16}],[{x:205,y:255,w:125,h:16},{x:445,y:210,w:120,h:16},{x:685,y:255,w:125,h:16}]], shards:[{lane:0,x:290,y:325},{lane:1,x:500,y:175},{lane:1,x:760,y:220}], switches:[], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:610,y:405,w:58,h:25}],[]] },
    // Offset Relay checkpoint: the high pickup and low switch demand separate
    // safe landings before the paired exit can be completed.
    { floors:[430,330], platforms:[[{x:205,y:355,w:125,h:16},{x:440,y:285,w:130,h:16},{x:700,y:345,w:120,h:16}],[{x:190,y:250,w:120,h:16},{x:425,y:190,w:130,h:16},{x:675,y:235,w:140,h:16}]], shards:[{lane:0,x:265,y:325},{lane:1,x:490,y:155},{lane:0,x:755,y:310}], switches:[{lane:1,x:760,y:200},{lane:0,x:650,y:315}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:355,y:405,w:52,h:25}],[{x:575,y:305,w:52,h:25}]] },
    // Arc 3: hazards and switches shift between lanes while both couriers
    // continue to obey one shared movement command.
    { floors:[430,330], platforms:[[{x:205,y:355,w:120,h:16},{x:430,y:300,w:125,h:16},{x:675,y:355,w:140,h:16}],[{x:250,y:250,w:125,h:16},{x:500,y:200,w:125,h:16},{x:735,y:245,w:100,h:16}]], shards:[{lane:1,x:300,y:215},{lane:0,x:475,y:265},{lane:1,x:770,y:210}], switches:[], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:570,y:405,w:58,h:25}],[]] },
    { floors:[430,330], platforms:[[{x:190,y:355,w:125,h:16},{x:425,y:290,w:135,h:16},{x:690,y:350,w:130,h:16}],[{x:215,y:245,w:130,h:16},{x:465,y:185,w:135,h:16},{x:715,y:235,w:110,h:16}]], shards:[{lane:0,x:255,y:325},{lane:1,x:515,y:150},{lane:0,x:755,y:400}], switches:[{lane:1,x:745,y:205}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:600,y:405,w:55,h:25}],[]] },
    { floors:[430,330], platforms:[[{x:220,y:355,w:125,h:16},{x:455,y:280,w:125,h:16},{x:690,y:350,w:130,h:16}],[{x:180,y:255,w:120,h:16},{x:405,y:195,w:135,h:16},{x:655,y:250,w:145,h:16}]], shards:[{lane:1,x:235,y:225},{lane:0,x:505,y:245},{lane:1,x:725,y:215}], switches:[], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[],[{x:555,y:305,w:56,h:25}]] },
    { floors:[430,330], platforms:[[{x:190,y:360,w:125,h:16},{x:425,y:295,w:130,h:16},{x:675,y:350,w:140,h:16}],[{x:230,y:245,w:125,h:16},{x:470,y:185,w:130,h:16},{x:710,y:235,w:120,h:16}]], shards:[{lane:0,x:250,y:330},{lane:1,x:515,y:150},{lane:1,x:750,y:200}], switches:[{lane:0,x:725,y:315},{lane:1,x:300,y:210}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:350,y:405,w:52,h:25}],[{x:610,y:305,w:52,h:25}]] },
    // Redline Pair checkpoint: both red hazard rows have a visible, reachable
    // shelf route; the counterplay is spacing the same jump between lanes.
    { floors:[430,330], platforms:[[{x:190,y:360,w:125,h:16},{x:430,y:290,w:130,h:16},{x:685,y:350,w:130,h:16}],[{x:220,y:245,w:130,h:16},{x:470,y:185,w:130,h:16},{x:715,y:235,w:120,h:16}]], shards:[{lane:0,x:255,y:330},{lane:1,x:520,y:150},{lane:0,x:750,y:315}], switches:[{lane:1,x:755,y:200}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:345,y:405,w:56,h:25}],[{x:600,y:305,w:56,h:25}]] },
    // Arc 4: paired fixed switches are placed at different points in the
    // shared route; all switches must be reached before the gates open.
    { floors:[430,330], platforms:[[{x:200,y:360,w:120,h:16},{x:435,y:290,w:125,h:16},{x:680,y:350,w:135,h:16}],[{x:240,y:245,w:125,h:16},{x:485,y:190,w:130,h:16},{x:720,y:235,w:115,h:16}]], shards:[{lane:0,x:260,y:330},{lane:1,x:520,y:155},{lane:0,x:755,y:315}], switches:[{lane:0,x:380,y:400},{lane:1,x:680,y:205}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[],[{x:575,y:305,w:52,h:25}]] },
    { floors:[430,330], platforms:[[{x:195,y:355,w:130,h:16},{x:445,y:285,w:125,h:16},{x:700,y:345,w:130,h:16}],[{x:190,y:245,w:125,h:16},{x:430,y:185,w:135,h:16},{x:690,y:230,w:135,h:16}]], shards:[{lane:1,x:245,y:215},{lane:0,x:500,y:250},{lane:0,x:755,y:400}], switches:[{lane:1,x:350,y:210}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:605,y:405,w:54,h:25}],[]] },
    { floors:[430,330], platforms:[[{x:220,y:355,w:120,h:16},{x:455,y:295,w:130,h:16},{x:705,y:350,w:125,h:16}],[{x:200,y:250,w:125,h:16},{x:445,y:190,w:130,h:16},{x:700,y:240,w:130,h:16}]], shards:[{lane:0,x:270,y:325},{lane:1,x:500,y:155},{lane:1,x:750,y:205}], switches:[{lane:0,x:380,y:400},{lane:1,x:760,y:210}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[{x:565,y:405,w:54,h:25}],[]] },
    { floors:[430,330], platforms:[[{x:190,y:365,w:125,h:16},{x:430,y:295,w:130,h:16},{x:690,y:350,w:130,h:16}],[{x:225,y:250,w:130,h:16},{x:475,y:185,w:130,h:16},{x:720,y:235,w:115,h:16}]], shards:[{lane:0,x:250,y:335},{lane:1,x:525,y:150},{lane:0,x:755,y:315}], switches:[{lane:0,x:360,y:400},{lane:1,x:690,y:205}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:600,y:405,w:54,h:25}],[{x:370,y:305,w:52,h:25}]] },
    // Signal Reunion checkpoint: switches are lane-specific pickups, but no
    // hidden ordering rule is applied; reach both, collect all shards, reunite.
    { floors:[430,330], platforms:[[{x:205,y:355,w:125,h:16},{x:445,y:285,w:130,h:16},{x:700,y:345,w:130,h:16}],[{x:215,y:245,w:130,h:16},{x:465,y:185,w:135,h:16},{x:710,y:230,w:125,h:16}]], shards:[{lane:0,x:265,y:325},{lane:1,x:515,y:150},{lane:0,x:755,y:310}], switches:[{lane:0,x:380,y:400},{lane:1,x:675,y:200}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:585,y:405,w:54,h:25}],[{x:370,y:305,w:54,h:25}]] },
    // Arc 5: high/low route synthesis combines shelf order with fixed hazards.
    { floors:[430,330], platforms:[[{x:185,y:365,w:120,h:16},{x:420,y:290,w:135,h:16},{x:680,y:350,w:135,h:16}],[{x:230,y:245,w:125,h:16},{x:480,y:180,w:135,h:16},{x:720,y:235,w:115,h:16}]], shards:[{lane:1,x:280,y:210},{lane:0,x:490,y:255},{lane:1,x:760,y:200}], switches:[], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:340,y:405,w:52,h:25}],[]] },
    { floors:[430,330], platforms:[[{x:205,y:355,w:125,h:16},{x:445,y:285,w:135,h:16},{x:700,y:345,w:130,h:16}],[{x:185,y:250,w:125,h:16},{x:430,y:185,w:135,h:16},{x:680,y:235,w:145,h:16}]], shards:[{lane:0,x:260,y:325},{lane:1,x:480,y:155},{lane:0,x:755,y:310}], switches:[{lane:1,x:745,y:205}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[],[{x:565,y:305,w:56,h:25}]] },
    { floors:[430,330], platforms:[[{x:195,y:360,w:125,h:16},{x:435,y:285,w:135,h:16},{x:690,y:350,w:135,h:16}],[{x:225,y:250,w:125,h:16},{x:470,y:185,w:135,h:16},{x:710,y:230,w:125,h:16}]], shards:[{lane:0,x:250,y:330},{lane:1,x:520,y:155},{lane:1,x:755,y:200}], switches:[], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:590,y:405,w:52,h:25}],[]] },
    { floors:[430,330], platforms:[[{x:185,y:360,w:125,h:16},{x:425,y:290,w:135,h:16},{x:680,y:350,w:140,h:16}],[{x:215,y:245,w:130,h:16},{x:460,y:180,w:135,h:16},{x:705,y:230,w:130,h:16}]], shards:[{lane:1,x:265,y:210},{lane:0,x:485,y:260},{lane:0,x:755,y:315}], switches:[{lane:0,x:360,y:400}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:335,y:405,w:52,h:25}],[{x:605,y:305,w:52,h:25}]] },
    // High/Low Crossing checkpoint: all three pickup heights, two lanes, and
    // both fixed danger cues must be read before the final paired approach.
    { floors:[430,330], platforms:[[{x:195,y:360,w:125,h:16},{x:435,y:285,w:135,h:16},{x:690,y:345,w:135,h:16}],[{x:215,y:245,w:130,h:16},{x:470,y:180,w:135,h:16},{x:710,y:230,w:125,h:16}]], shards:[{lane:0,x:255,y:330},{lane:1,x:520,y:150},{lane:0,x:755,y:310}], switches:[{lane:0,x:360,y:400},{lane:1,x:665,y:195}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:585,y:405,w:54,h:25}],[{x:365,y:305,w:54,h:25}]] },
    // Arc 6: authored terminal routes revisit safe ground and synthesize the
    // full shard / switch / landing / paired-exit contract.
    { floors:[430,330], platforms:[[{x:205,y:355,w:125,h:16},{x:445,y:290,w:130,h:16},{x:700,y:350,w:130,h:16}],[{x:185,y:250,w:125,h:16},{x:430,y:190,w:135,h:16},{x:690,y:240,w:140,h:16}]], shards:[{lane:0,x:260,y:325},{lane:1,x:480,y:160},{lane:0,x:755,y:315}], switches:[], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:365,y:405,w:52,h:25}],[]] },
    { floors:[430,330], platforms:[[{x:190,y:360,w:130,h:16},{x:435,y:285,w:135,h:16},{x:690,y:345,w:140,h:16}],[{x:220,y:245,w:130,h:16},{x:470,y:180,w:135,h:16},{x:715,y:235,w:120,h:16}]], shards:[{lane:1,x:275,y:210},{lane:0,x:500,y:255},{lane:1,x:760,y:200}], switches:[{lane:1,x:350,y:205}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:600,y:405,w:56,h:25}],[]] },
    { floors:[430,330], platforms:[[{x:205,y:355,w:125,h:16},{x:445,y:290,w:130,h:16},{x:700,y:345,w:130,h:16}],[{x:190,y:250,w:125,h:16},{x:435,y:185,w:135,h:16},{x:690,y:235,w:140,h:16}]], shards:[{lane:0,x:255,y:325},{lane:1,x:485,y:155},{lane:0,x:755,y:310}], switches:[{lane:0,x:365,y:400},{lane:1,x:750,y:205}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[],[{x:575,y:305,w:56,h:25}]] },
    { floors:[430,330], platforms:[[{x:185,y:365,w:125,h:16},{x:430,y:290,w:135,h:16},{x:690,y:350,w:135,h:16}],[{x:220,y:245,w:125,h:16},{x:465,y:180,w:135,h:16},{x:710,y:230,w:130,h:16}]], shards:[{lane:0,x:250,y:335},{lane:1,x:510,y:150},{lane:0,x:755,y:315}], switches:[{lane:0,x:365,y:400},{lane:1,x:680,y:200}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:590,y:405,w:54,h:25}],[{x:365,y:305,w:54,h:25}]] },
    // Last Light checkpoint: terminal paired-switch route with a deliberate
    // clean final shelf; Stage 30 is the last unlockable card.
    { floors:[430,330], platforms:[[{x:195,y:360,w:125,h:16},{x:435,y:285,w:135,h:16},{x:690,y:345,w:135,h:16}],[{x:215,y:245,w:130,h:16},{x:470,y:180,w:135,h:16},{x:710,y:230,w:130,h:16}]], shards:[{lane:0,x:255,y:330},{lane:1,x:520,y:150},{lane:0,x:755,y:310}], switches:[{lane:0,x:360,y:400},{lane:1,x:665,y:195}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:585,y:405,w:54,h:25}],[{x:365,y:305,w:54,h:25}]] },
  ];
  let locale = "en"; let soundEnabled = !window.WeightPlayAudio.isMuted();
  window.addEventListener("weightplay:audio-volume-change", () => { soundEnabled = !window.WeightPlayAudio.isMuted(); }); let current = 0; let state = null; let axis = 0; let hidden = false; let last = 0; let raf = 0;

  const text = (key) => (COPY[locale] && COPY[locale][key]) || COPY.en[key] || key;
  const STATIC_SHELL_COPY = {
    en: { mainBack: "Back to WeightPlay", stageSections: "Stage sections" },
    "zh-Hant": { mainBack: "返回 WeightPlay", stageSections: "階段區段" },
    "zh-Hans": { mainBack: "返回 WeightPlay", stageSections: "阶段区段" },
    ja: { mainBack: "WeightPlayへ戻る", stageSections: "ステージのセクション" },
    ko: { mainBack: "WeightPlay로 돌아가기", stageSections: "스테이지 섹션" },
    es: { mainBack: "Volver a WeightPlay", stageSections: "Secciones de fases" },
    "pt-BR": { mainBack: "Voltar ao WeightPlay", stageSections: "Seções das fases" },
    fr: { mainBack: "Retour à WeightPlay", stageSections: "Sections des niveaux" },
    de: { mainBack: "Zurück zu WeightPlay", stageSections: "Stufenbereiche" },
    it: { mainBack: "Torna a WeightPlay", stageSections: "Sezioni delle fasi" },
    ru: { mainBack: "Вернуться в WeightPlay", stageSections: "Разделы этапа" },
    hi: { mainBack: "WeightPlay पर वापस जाएँ", stageSections: "स्टेज सेक्शन" },
    ar: { mainBack: "العودة إلى WeightPlay", stageSections: "أقسام المرحلة" },
  };
  const shellText = (key) => (STATIC_SHELL_COPY[locale] || STATIC_SHELL_COPY.en)[key];
  const landscapeControls = document.createElement("div");
  landscapeControls.className = "twin-landscape-controls";
  landscapeControls.hidden = true;
  landscapeControls.setAttribute("role", "group");
  landscapeControls.innerHTML = '<button type="button" data-twin-control="left">◀</button><button type="button" data-twin-control="jump" data-wp-primary-action="true"></button><button type="button" data-twin-control="right">▶</button>';
  document.body.appendChild(landscapeControls);
  const shortLandscape = window.matchMedia("(max-height: 520px) and (orientation: landscape)");
  const syncLandscapeControls = () => {
    landscapeControls.hidden = !(shortLandscape.matches && document.body.dataset.screen === "battle");
  };
  const storage = (key, fallback="") => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, String(value)); } catch {} };
  const unlockKey = "weightplay_twinswitch_unlocked";
  const bestKey = (index) => `weightplay_twinswitch_best_${index}`;
  const unlocked = () => Math.min(stages.length, Math.max(1, Number(storage(unlockKey, 1)) || 1));
  const setScreen = (screen) => { ["main","stage","battle","result"].forEach((name) => { $(`#${name}Screen`).hidden = name !== screen; }); document.body.dataset.screen = screen; syncLandscapeControls(); };
  const beep = (cue = "ui.click") => { return window.WeightPlayAudio?.play(cue); };
  // Bodies spawn with their feet exactly on the lane floor. Marking that
  // contact immediately keeps the first Jump input deterministic instead of
  // dropping the request during the handful of frames before physics settles.
  const makeBody = (lane) => ({ lane, x:92, y:stages[current].floors[lane]-30, vx:0, vy:0, w:28, h:30, ground:true, color:lane===0?"#c98169":"#e3e0d5" });
  const reset = () => { state={time:0,moves:0,score:0,done:false,success:false,shards:new Set(),switches:new Set(),jumpQueued:false,routeHintShown:false,messageKey:"ready",lastAction:"ready",actionFlash:0,landed:[0,0],bodies:[makeBody(0),makeBody(1)]}; axis=0; };
  const rect = (body) => ({x:body.x-body.w/2,y:body.y-body.h,w:body.w,h:body.h});
  const overlaps = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  // The art is intentionally larger than the collision body for phone
  // readability. Use a matching pickup radius so a visibly touching courier
  // cannot pass through a shard between two animation frames.
  const bodyNear = (body, point) => Math.hypot(body.x-point.x, (body.y-body.h/2)-point.y)<78;
  const stageData = () => stages[current];
  const announce = (key) => { state.messageKey=key; $("#battleStatus").textContent=text(key); };
  const allShards = () => state.shards.size >= stageData().shards.length;
  const gatesOpen = () => state.switches.size >= stageData().switches.length;
  const exitCount = () => stageData().gates.reduce((count,gate,index)=>count+(state.bodies[index].x>gate.x&&Math.abs((state.bodies[index].y-state.bodies[index].h/2)-gate.y)<70?1:0),0);
  const physicsBody = (body, dt) => {
    const data=stageData(); const previousX=body.x; const previousBottom=body.y;
    body.vx=axis*185; body.x+=body.vx*dt; body.x=Math.max(25,Math.min(W-25,body.x));
    const wallList=(data.walls?.[body.lane])||[]; if(wallList.some((wall)=>overlaps(rect(body),wall))) { body.x=previousX; body.vx=0; }
    const wasGrounded=body.ground; body.vy+=850*dt; body.y+=body.vy*dt; body.ground=false;
    const floor=data.floors[body.lane]; if(body.y>=floor){body.y=floor;body.vy=0;body.ground=true;}
    data.platforms[body.lane].forEach((platform)=>{const r=rect(body);const crossed=previousBottom<=platform.y && body.y>=platform.y;const horizontal=body.x+body.w/2>platform.x&&body.x-body.w/2<platform.x+platform.w;if(body.vy>=0&&crossed&&horizontal){body.y=platform.y;body.vy=0;body.ground=true;}});
    if(!wasGrounded&&body.ground){state.landed[body.lane]=.22;state.actionFlash=Math.max(state.actionFlash,.12);}
    if(body.y>H+80) state.failed=true;
    if((data.hazards[body.lane]||[]).some((hazard)=>overlaps(rect(body),hazard))) state.failed=true;
  };
  const update = (dt) => {
    if(!state||state.done||hidden)return; state.time+=dt; physicsBody(state.bodies[0],dt); physicsBody(state.bodies[1],dt);
    const data=stageData(); data.shards.forEach((shard,index)=>{if(!state.shards.has(index)&&state.bodies.some((body)=>body.lane===shard.lane&&bodyNear(body,shard))){state.shards.add(index);state.score+=100;state.moves+=1;state.messageKey="shardCollect";announce("shardCollect");beep("board.rotate");if(current===0&&state.shards.size===2&&!state.routeHintShown){state.routeHintShown=true;announce("routeHint");}}});
    data.switches.forEach((sw,index)=>{if(!state.switches.has(index)&&state.bodies.some((body)=>body.lane===sw.lane&&bodyNear(body,sw))){state.switches.add(index);state.moves+=1;announce("switchOpen");beep("board.rotate");}});
    if(state.failed){finish(false);return;}
    const exitsReady=allShards()&&gatesOpen(); const atExit=data.gates.every((gate,index)=>state.bodies[index].x>gate.x&&Math.abs((state.bodies[index].y-state.bodies[index].h/2)-gate.y)<70); if(exitsReady&&atExit){state.score+=Math.max(0,500-Math.floor(state.time*8));finish(true);return;}
    state.actionFlash=Math.max(0,state.actionFlash-dt);
    state.landed=state.landed.map((value)=>Math.max(0,value-dt));
  };
  const finish=(success)=>{if(!state||state.done)return;state.done=true;state.success=success;const best=Number(storage(bestKey(current),0))||0;if(success&&(!best||state.moves<best))save(bestKey(current),state.moves);if(success&&current+1<stages.length)save(unlockKey,Math.max(unlocked(),current+2));beep(success ? "result.win" : "result.lose",.16);renderResult();setScreen("result");};
  const draw = () => {
    const data=stageData();
    if (battleBackground.complete && battleBackground.naturalWidth > 0) {
      ctx.drawImage(battleBackground, 0, 0, W, H);
      ctx.fillStyle="#07152240";ctx.fillRect(0,0,W,H);
    } else {
      const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,"#274459");bg.addColorStop(1,"#071522");ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    }
    ctx.fillStyle="#ffd27712";ctx.fillRect(0,0,W,74);ctx.fillStyle="#78e2dc18";ctx.fillRect(0,74,W,6);
    // A stable, icon-led objective strip keeps Stage 1 understandable without
    // moving the controls or covering either lane. It also exposes the shared
    // input result at the moment it happens instead of explaining it later.
    const actionGlyph=state?.lastAction==="left"?"◀  ◀":state?.lastAction==="right"?"▶  ▶":state?.lastAction==="jump"?"↥  ↥":"↔  ↔";
    ctx.save();ctx.font="700 22px system-ui,sans-serif";ctx.textBaseline="middle";
    ctx.fillStyle=state?.actionFlash>0?"#fff1b8":"#d9e9f4";ctx.fillText(actionGlyph,24,37);
    ctx.fillStyle="#ffd277";ctx.fillText(`✦ ${state?.shards.size||0}/${data.shards.length}`,190,37);
    ctx.fillStyle=exitCount()===2?"#78e2dc":"#a8bcc8";ctx.fillText(`◎ ${exitCount()}/2`,340,37);
    ctx.fillStyle="#78e2dc";ctx.fillText("1",888,24);ctx.fillStyle="#ffd277";ctx.fillText("2",888,52);ctx.restore();
    const drawProp=(image,sx,sy,sw,sh,dx,dy,dw,dh)=>{if(!(image.complete&&image.naturalWidth>0))return false;ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);return true;};
    // Paint the upper lane first. Both floors share the lower canvas region,
    // so drawing lane 0 first let the upper fill cover lane 0's floor line and
    // made the lower characters look detached on a narrow screen.
    for(let lane=1;lane>=0;lane-=1){const floor=data.floors[lane];ctx.fillStyle=lane===0?"#19445b":"#3d3f4e";ctx.fillRect(0,floor,W,H-floor);if(state?.actionFlash>0){ctx.fillStyle=lane===0?"#78e2dc12":"#ffd27712";ctx.fillRect(0,floor-100,W,100);}ctx.strokeStyle=lane===0?"#78e2dc":"#ffd277";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,floor);ctx.lineTo(W,floor);ctx.stroke();ctx.fillStyle=lane===0?"#78e2dc":"#ffd277";ctx.font="800 20px system-ui,sans-serif";ctx.fillText(lane===0?"1":"2",16,floor-16);data.platforms[lane].forEach((platform)=>{ctx.fillStyle=lane===0?"#4d8991":"#a07962";ctx.fillRect(platform.x,platform.y,platform.w,platform.h);ctx.fillStyle="#ffffff55";ctx.fillRect(platform.x,platform.y,platform.w,4);});(data.hazards[lane]||[]).forEach((hazard)=>{const spriteWidth=Math.max(hazard.w+34,Math.round((hazard.h+50)*1.5));const spriteHeight=Math.round(spriteWidth/1.5);const spriteX=hazard.x+hazard.w/2-spriteWidth/2;const spriteY=hazard.y+hazard.h-spriteHeight+3;const hazardDrawn=drawProp(twinProps,768,512,768,512,spriteX,spriteY,spriteWidth,spriteHeight);if(!hazardDrawn){ctx.save();ctx.shadowColor="#ff536d";ctx.shadowBlur=12;ctx.fillStyle="#df4055";ctx.beginPath();for(let x=hazard.x;x<=hazard.x+hazard.w;x+=13){ctx.lineTo(x,hazard.y+hazard.h);ctx.lineTo(x+6,hazard.y);}ctx.lineTo(hazard.x+hazard.w,hazard.y+hazard.h);ctx.closePath();ctx.fill();ctx.restore();}ctx.fillStyle="#ff536d99";ctx.fillRect(hazard.x-3,hazard.y+hazard.h-4,hazard.w+6,4);});}
    data.shards.forEach((shard,index)=>{if(state?.shards.has(index))return;if(!drawProp(twinProps,512,0,512,512,shard.x-28,shard.y-38,56,76)){ctx.fillStyle=shard.lane===0?"#ffd277":"#78e2dc";ctx.save();ctx.translate(shard.x,shard.y);ctx.rotate(Math.PI/4);ctx.fillRect(-9,-9,18,18);ctx.restore();}});
    data.switches.forEach((sw,index)=>{if(!drawProp(twinProps,0,0,512,512,sw.x-35,sw.y-38,70,70)){ctx.fillStyle=state?.switches.has(index)?"#78e2dc":"#ffd277";ctx.fillRect(sw.x-12,sw.y-25,24,25);ctx.fillStyle="#071627";ctx.fillRect(sw.x-3,sw.y-19,6,13);}});
    data.gates.forEach((gate,index)=>{const open=gatesOpen();if(!drawProp(twinProps,0,512,768,512,gate.x-54,gate.y-48,108,96)){ctx.strokeStyle=open?"#78e2dc":"#a36d78";ctx.lineWidth=7;ctx.beginPath();ctx.arc(gate.x,gate.y,27,Math.PI,0);ctx.lineTo(gate.x+27,gate.y+34);ctx.moveTo(gate.x-27,gate.y);ctx.lineTo(gate.x-27,gate.y+34);ctx.stroke();}});
    if(state)state.bodies.forEach((body,index)=>{
      // Keep a visible foot/shadow anchor on the actual collision floor. The
      // old draw transform placed the source crop 28 logical pixels below the
      // body, which made the characters look flattened and detached on phones.
      ctx.save();
      ctx.fillStyle="#07152299";
      ctx.beginPath();
      ctx.ellipse(body.x,body.y+2,state.landed[index]>0?30:22,state.landed[index]>0?9:6,0,0,Math.PI*2);
      ctx.fill();
      ctx.translate(body.x,body.y);
      const actor = index===0
        // Crop the transparent portrait margins instead of scaling the whole
        // two-character sheet into a tiny, flattened thumbnail. Both crops
        // finish at the visible feet so the art and the floor share one anchor.
        ? { sx:20, sy:120, sw:730, sh:860, dw:130, dh:154 }
        : { sx:780, sy:0, sw:756, sh:1000, dw:128, dh:169 };
      if(!drawProp(twinSprites,actor.sx,actor.sy,actor.sw,actor.sh,-actor.dw/2,-actor.dh,actor.dw,actor.dh)){
        ctx.fillStyle=body.color;
        ctx.beginPath();
        ctx.ellipse(0,-body.h/2,body.w/2,body.h/2,0,0,Math.PI*2);
        ctx.fill();
        ctx.fillStyle=index===0?"#ffd39b":"#65778c";
        ctx.beginPath();
        ctx.arc(index===0?9:7,-body.h-8,9,0,Math.PI*2);
        ctx.fill();
        ctx.fillStyle="#071627";
        ctx.beginPath();
        ctx.arc(index===0?12:10,-body.h-10,2.5,0,Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    });
  };
  const updateHud=()=>{if(!state)return;$("#scoreLabel").textContent=`${text("score")}: ${state.score}`;$("#shardLabel").textContent=`${text("shards")}: ${state.shards.size}/${stageData().shards.length}`;$("#controlHint").textContent=text("controlHint");canvas.dataset.gameVersion="17";canvas.dataset.currentStage=String(current+1);canvas.dataset.totalStages=String(stages.length);canvas.dataset.moves=String(state.moves);canvas.dataset.shards=String(state.shards.size);canvas.dataset.action=state.lastAction;canvas.dataset.exits=String(exitCount());canvas.dataset.time=String(state.time);canvas.dataset.player0x=String(state.bodies[0].x);canvas.dataset.player0y=String(state.bodies[0].y-state.bodies[0].h/2);canvas.dataset.player1x=String(state.bodies[1].x);canvas.dataset.player1y=String(state.bodies[1].y-state.bodies[1].h/2);};
  const renderResult=()=>{const best=Number(storage(bestKey(current),0))||0;$("#resultEyebrow").textContent=`${text("stage")} ${current+1}`;$("#resultTitle").textContent=text(state.success?"success":"failure");$("#resultCopy").textContent=text(state.success?(current===stages.length-1?"final":"successCopy"):"failureCopy");$("#resultScore").innerHTML=`<span>${text("scoreStat")}</span><strong>${state.score}</strong>`;$("#resultMoves").innerHTML=`<span>${text("movesStat")}</span><strong>${state.moves}</strong>`;$("#resultBest").innerHTML=`<span>${text("bestStat")}</span><strong>${best||"—"}</strong>`;$("#nextBtn").textContent=text("next");$("#nextBtn").disabled=!state.success||current>=stages.length-1;$("#retryBtn").textContent=text("retry");$("#resultStagesBtn").textContent=text("stageMap");};
  const stageTitle=(index)=>`${text("stage")} ${index+1}`;
  const syncStageSelection=(index)=>{if(!Number.isInteger(index)||index<0||index>=unlocked())return;current=index;stageGrid?.querySelectorAll("[data-stage]").forEach((button)=>{const selected=Number(button.dataset.stage)===current&&!button.disabled;button.classList.toggle("selected",selected);if(selected)button.setAttribute("aria-current","true");else button.removeAttribute("aria-current");});};
  const renderStages=()=>{const count=unlocked();stageGrid.innerHTML=stages.map((_,index)=>{const open=index<count;const selected=open&&index===current;const checkpoint=(index+1)%5===0;const best=Number(storage(bestKey(index),0))||0;return `<button class="stage-card${open?"":" locked"}${selected?" selected":""}" type="button" data-stage="${index}" data-index="${index}" data-stage-index="${index}" data-stage-arc="${Math.floor(index/5)+1}"${checkpoint?' data-stage-checkpoint="true"':''} aria-label="${stageTitle(index)}" ${open?"":"disabled"}${selected?' aria-current="true"':''}><strong>${stageTitle(index)}</strong><small>${open?(best?`${text("bestStat")}: ${best}`:text("objective")):text("stageHelp")}</small><span aria-hidden="true">${checkpoint?"◆":open?"✦":"◌"}</span></button>`;}).join("");stageGrid.querySelectorAll("[data-stage]").forEach((button)=>button.addEventListener("click",()=>startStage(Number(button.dataset.stage))));$("#stageTitle").textContent=text("stages");$("#stageEyebrow").textContent=text("eyebrow");$("#stageHelp").textContent=text("stageHelp");};
  const startStage=(index)=>{current=Math.max(0,Math.min(stages.length-1,index));reset();$("#battleEyebrow").textContent=text("battle");$("#battleTitle").textContent=stageTitle(current);$("#battleStatus").textContent=text("ready");canvas.setAttribute("aria-label",text("ariaCanvas"));$("#leftBtn").setAttribute("aria-label",text("ariaLeft"));$("#rightBtn").setAttribute("aria-label",text("ariaRight"));setScreen("battle");beep("game.start");};
  const refresh=()=>{document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";$("#eyebrow").textContent=text("eyebrow");$("#coming").textContent=text("coming");$("#languageLabel").textContent=text("language");$("#tagline").textContent=text("objective");$("#objective").textContent=text("objective");$("#guideTitle").textContent=text("guideTitle");$("#guideBody").textContent=text("guideBody");$("#guideControls").textContent=text("guideControls");$("#startBtn").textContent=text("start");$("#soundBtn").textContent=soundEnabled?text("soundOn"):text("soundOff");$("#soundBtn").setAttribute("aria-pressed",String(soundEnabled));$("#stageSoundBtn").textContent=soundEnabled?text("soundOn"):text("soundOff");$("#stageSoundBtn").setAttribute("aria-pressed",String(soundEnabled));$("#mainScreen .brand-back").setAttribute("aria-label",shellText("mainBack"));$("#stageScreen .stage-tabs").setAttribute("aria-label",shellText("stageSections"));$("#stageBack").setAttribute("aria-label",text("backMain"));$("#battleBack").setAttribute("aria-label",text("backStages"));$("#stageTab").textContent=text("stageMap");$("#jumpBtn").textContent=text("jump");$("#restartBtn").setAttribute("aria-label",text("restart"));$("#restartBtn").setAttribute("title",text("restart"));const landscapeJump=landscapeControls.querySelector('[data-twin-control="jump"]');if(landscapeJump){landscapeJump.textContent=text("jump");landscapeJump.setAttribute("aria-label",text("jump"));}landscapeControls.querySelector('[data-twin-control="left"]')?.setAttribute("aria-label",text("ariaLeft"));landscapeControls.querySelector('[data-twin-control="right"]')?.setAttribute("aria-label",text("ariaRight"));landscapeControls.setAttribute("aria-label",text("controlHint"));renderStages();if(state&&document.body.dataset.screen==="battle"){$("#battleStatus").textContent=text(state.messageKey||"ready");$("#battleTitle").textContent=stageTitle(current);updateHud();}if(state&&document.body.dataset.screen==="result")renderResult();};
  const toggleSound=()=>{soundEnabled=window.WeightPlayAudio.setEnabled(!soundEnabled);save("weightplay_sound",soundEnabled?"on":"off");refresh();if(soundEnabled)beep("ui.click");};const stageScreen=()=>{if(document.body.dataset.screen==="main")current=Math.max(0,Math.min(stages.length-1,unlocked()-1));renderStages();setScreen("stage");};
  stageGrid?.addEventListener("wonder:stage-snap",(event)=>{const index=Number(event.detail?.index);if(Number.isInteger(index)&&index>=0)syncStageSelection(index);});
  $("#startBtn").addEventListener("click",stageScreen);$("#stageBack").addEventListener("click",()=>setScreen("main"));$("#battleBack").addEventListener("click",stageScreen);$("#soundBtn").addEventListener("click",toggleSound);$("#stageSoundBtn").addEventListener("click",toggleSound);$("#restartBtn").addEventListener("click",()=>startStage(current));$("#retryBtn").addEventListener("click",()=>startStage(current));$("#nextBtn").addEventListener("click",()=>{if(!$("#nextBtn").disabled)startStage(current+1);});$("#resultStagesBtn").addEventListener("click",stageScreen);
  const markAction=(action)=>{if(!state||state.done)return;state.lastAction=action;state.actionFlash=.22;};
  const pressAxis=(direction)=>{if(!state||state.done)return;axis=direction;state.moves+=1;markAction(direction<0?"left":"right");};
  const releaseAxis=(direction)=>{if(axis===direction)axis=0;};
  const queueJump=()=>{if(state&&!state.done){state.jumpQueued=true;state.moves+=1;markAction("jump");}};
  const hold=(button,down,up)=>{button.addEventListener("pointerdown",(event)=>{event.preventDefault();button.setPointerCapture?.(event.pointerId);down();});["pointerup","pointercancel","lostpointercapture"].forEach((name)=>button.addEventListener(name,(event)=>{event.preventDefault();up();}));};
  hold($("#leftBtn"),()=>pressAxis(-1),()=>releaseAxis(-1));
  hold($("#rightBtn"),()=>pressAxis(1),()=>releaseAxis(1));
  hold(landscapeControls.querySelector('[data-twin-control="left"]'),()=>pressAxis(-1),()=>releaseAxis(-1));
  hold(landscapeControls.querySelector('[data-twin-control="right"]'),()=>pressAxis(1),()=>releaseAxis(1));
  $("#jumpBtn").addEventListener("pointerdown",(event)=>{event.preventDefault();queueJump();});
  landscapeControls.querySelector('[data-twin-control="jump"]').addEventListener("pointerdown",(event)=>{event.preventDefault();queueJump();});
  document.addEventListener("keydown",(event)=>{if(document.body.dataset.screen!=="battle")return;const left=event.key==="ArrowLeft"||event.key.toLowerCase()==="a";const right=event.key==="ArrowRight"||event.key.toLowerCase()==="d";if(left||right||event.key===" "||event.key==="ArrowUp"||event.key.toLowerCase()==="r")event.preventDefault();if(left){axis=-1;if(!event.repeat&&state){state.moves+=1;markAction("left");}}if(right){axis=1;if(!event.repeat&&state){state.moves+=1;markAction("right");}}if((event.key===" "||event.key==="ArrowUp")&&!event.repeat&&state&&!state.done){state.jumpQueued=true;state.moves+=1;markAction("jump");}if(event.key.toLowerCase()==="r")startStage(current);});document.addEventListener("keyup",(event)=>{if((event.key==="ArrowLeft"||event.key.toLowerCase()==="a")&&axis<0)axis=0;if((event.key==="ArrowRight"||event.key.toLowerCase()==="d")&&axis>0)axis=0;});document.addEventListener("visibilitychange",()=>{hidden=document.hidden;last=performance.now();});
  const tick=(now)=>{const dt=Math.min(.032,Math.max(0,(now-last)/1000||0));last=now;if(!hidden){if(state&&!state.done){state.bodies.forEach((body)=>{if(state.jumpQueued&&body.ground){body.vy=JUMP_VELOCITY;body.ground=false;beep("board.move",.04);} });state.jumpQueued=false;update(dt);}draw();updateHud();}raf=requestAnimationFrame(tick);};
   const routeLocale=document.documentElement.lang;locale=COPY[routeLocale]?routeLocale:storage("weightPlayLocale","en");if(!COPY[locale])locale="en";$("#localeSelect").innerHTML=ORDER.map((code)=>`<option value="${code}">${code}</option>`).join("");$("#localeSelect").value=locale;$("#localeSelect").addEventListener("change",(event)=>{locale=event.target.value;save("weightPlayLocale",locale);refresh();});soundEnabled=window.WeightPlayAudio.setEnabled(storage("weightplay_sound","on")!=="off");shortLandscape.addEventListener?.("change",syncLandscapeControls);window.addEventListener("resize",syncLandscapeControls);reset();refresh();setScreen("main");last=performance.now();raf=requestAnimationFrame(tick);
  $("#stageScreen").setAttribute("data-wp-standard-stage-screen", "");
  $("#stageGrid").setAttribute("data-wp-stage-rail", "");
  $("#battleScreen").setAttribute("data-wp-logical-battle-canvas", "");
  $("#stageScreen .section-head")?.classList.add("stage-header");
  $("#battleScreen .section-head")?.classList.add("battle-header");
  const inlineGuide = document.querySelector("#mainScreen .guide");
  inlineGuide?.classList.remove("guide");
  inlineGuide?.classList.add("main-howto");
  const cleanGeneralGuide = () => document.querySelectorAll(".game-page-info .game-info-fact").forEach((fact) => {
    if (/skills trained/i.test(fact.textContent || "")) fact.remove();
  });
  cleanGeneralGuide();
  window.addEventListener("load", cleanGeneralGuide, { once: true });
})();
