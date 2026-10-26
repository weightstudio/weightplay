(() => {
  "use strict";
  // Required shared owners must exist before any partial game initialization.
  // Resource failures retain the shared Retry/Back dialog and cannot enable Start.
  if (!window.WeightPlayScreenFrame?.mount || !window.WeightPlayPlayUI?.mountStage
      || !window.HeroTrialsStageConfig?.create || !window.WeightPlayJoystick?.create) {
    const start=document.getElementById('startBtn');if(start)start.disabled=true;
    window.WeightPlayGameEntryLoader?.fail(undefined,()=>location.reload());
    return;
  }
  const practiceRequested = location.protocol==="http:"
    && ["localhost","127.0.0.1","[::1]"].includes(location.hostname)
    && new URLSearchParams(location.search).get("practice")==="1";
  let practiceEnabled=false,practiceIsolation=false,localPractice=null,trialStartTicket=0;
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(run?.paused || run?.suspended || backgroundSuspended), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { if(practiceRequested)return; try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();


  const GAME_VERSION = "v22";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const ASSET_ROOT = "../../assets/";
  const heroPosterUrl = new URL("/assets/interface7-redrawn/animal-hero-trials.webp", location.origin).href;
  const restoreHeroPosterMetadata = () => {
    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => {
      meta.content = heroPosterUrl;
    });
  };
  restoreHeroPosterMetadata();
  document.addEventListener("DOMContentLoaded", restoreHeroPosterMetadata, { once: true });
  window.addEventListener("weightplay-interface7-poster-registry-ready", () => {
    requestAnimationFrame(restoreHeroPosterMetadata);
  }, { once: true });
  const WORLD_WIDTH = 460;
  const WORLD_HEIGHT = 560;
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  // Gameplay timers stay identical in reduced motion; only decorative motion changes.
  const reducedMotion = () => motionPreference.matches;
  const LEGACY_WORLD_WIDTH = 390;
  const WORLD_X_SCALE = WORLD_WIDTH / LEGACY_WORLD_WIDTH;
  const worldX = (value) => value * WORLD_X_SCALE;
  const copy = {
    en: {
      title: "Animal Hero Trials",
      pitch: "Guide Leo through three forest trials and choose a blessing after every room.",
      marks: "Trial Marks",
      mastery: "Heart Mastery",
      progress: "Progress",
      start: "Start Game",
      choose: "Choose Trial",
      blessing: "Choose a Blessing",
      menu: "Main Menu",
      locked: "Clear the previous trial",
      win: "Trial Cleared!",
      fail: "Trial Failed",
      next: "Next Trial",
      retry: "Try Again",
      scoutObjective: "Defeat {count} Shadow Scouts",
      bossObjective: "Defeat the Shadow Sovereign",
      reroll: "Reroll 3",
      rerollConfirm: "Spend 3 Diamonds to reroll these blessings?",
      rerollConfirmStatus: "Replace all three blessings once · {balance} → {result} Diamonds. Tap again to confirm.",
      rerollUsed: "Reroll already used this trial.",
      rerollNeed: "Need 3 Diamonds · Have {balance}. Choose a free blessing.",
      rerollDone: "New blessings revealed.",
      room: "Room {room}/3",
      bossRoom: "Room {room}/3 · BOSS",
      failCopy: "{hero} needs another route.",
      quitTitle: "Leave this trial?",
      quitCopy: "This run's room and blessing progress will be lost.",
      keepPlaying: "Keep Playing",
      leaveTrial: "Leave Trial",
      battleHelp: "Battle help",
    },
    "zh-Hant": {
      title: "動物英雄試煉",
      pitch: "帶領獅子里歐通過三個森林試煉，每個房間結束後選擇一項祝福。",
      marks: "試煉印記",
      mastery: "勇氣精通",
      progress: "進度",
      start: "開始遊戲",
      choose: "選擇試煉",
      blessing: "選擇祝福",
      menu: "主選單",
      locked: "先完成上一個試煉",
      win: "試煉完成！",
      fail: "試煉失敗",
      next: "下一個試煉",
      retry: "再試一次",
      bossObjective: "擊敗暗影君王",
      reroll: "重抽 3",
      rerollConfirm: "確定花費 3 顆鑽石重抽祝福嗎？",
      rerollUsed: "本次試煉已使用過重抽。",
      rerollNeed: "鑽石不足，仍可免費選擇祝福。",
      rerollDone: "新的祝福已出現。",
    },
  };

  Object.assign(copy.en, {
    pitch: "Choose one of four heroes and clear a 30-trial shadow campaign.",
    arenaLabel: "Hero Trials arena. Move with Arrow keys or WASD. Press Space to use the hero skill.",
    controlHint: "Tap or drag to move · Use {skill} or Space when ready",
    rangeHint: "Move toward the highlighted enemy · Attacks fire automatically in range",
    rangeHitHint: "In range · Automatic attack landed",
    earnedMarks: "+{gain} Trial Marks · Total {total}.",
    trialUnlocked: "Trial {next} unlocked.",
    trialAvailable: "Trial {next} remains available.",
    allTrialsUnlocked: "All 30 trials are unlocked.",
    enemyObjective: "Defeat {count} {enemy}",
    eliteObjective: "Defeat the {enemy} captain",
    bossObjectiveNamed: "Defeat {boss}",
    recommended: "Recommended: {hero}",
    roomsAndMarks: "3 rooms · +{marks} marks",
    masteryReady: "Ready to upgrade",
    masteryNeed: "Heart Mastery needs {remaining} more Trial Marks.",
    masteryUpgradeReady: "All heroes Max HP +{current} → +{next} · Spend {cost} / Have {marks} marks",
    masteryUpgradeNeed: "All heroes Max HP +{current} → +{next} · Need {cost} / Have {marks} marks",
  });
  Object.assign(copy["zh-Hant"], {
    controlHint: "\u9ede\u6309\u6216\u62d6\u66f3\u79fb\u52d5 \u00b7 {skill} \u53ef\u7528\u6642\u6309\u4e0b\u6216\u6309\u7a7a\u767d\u9375",
    rangeHint: "\u9760\u8fd1\u4eae\u8d77\u7684\u6575\u4eba \u00b7 \u9032\u5165\u7bc4\u570d\u5f8c\u6703\u81ea\u52d5\u653b\u64ca",
    rangeHitHint: "\u5df2\u9032\u5165\u7bc4\u570d \u00b7 \u81ea\u52d5\u653b\u64ca\u547d\u4e2d",
    title: "動物英雄試煉",
    pitch: "選擇四位英雄之一，完成 30 個暗影試煉。",
    arenaLabel: "英雄試煉戰場。使用方向鍵或 WASD 移動，按空白鍵使用英雄技能。",
    mastery: "\u751f\u547d\u7cbe\u901a",
    earnedMarks: "\u7372\u5f97 {gain} \u679a\u8a66\u7149\u5370\u8a18 \u00b7 \u7d2f\u7a4d {total} \u679a\u3002",
    trialUnlocked: "\u5df2\u89e3\u9396\u8a66\u7149 {next}\u3002",
    trialAvailable: "\u8a66\u7149 {next} \u4ecd\u53ef\u9032\u5165\u3002",
    allTrialsUnlocked: "30 \u500b\u8a66\u7149\u5df2\u5168\u90e8\u89e3\u9396\u3002",
    enemyObjective: "擊敗 {count} 隻{enemy}",
    eliteObjective: "擊敗{enemy}隊長",
    bossObjectiveNamed: "擊敗{boss}",
    recommended: "建議英雄：{hero}",
    roomsAndMarks: "3 個房間 · +{marks} 印記",
    masteryReady: "\u53ef\u4ee5\u5347\u7d1a\u751f\u547d\u7cbe\u901a\u3002",
    masteryNeed: "\u52c7\u6c23\u7cbe\u901a\u9084\u9700\u8981 {remaining} \u679a\u8a66\u7149\u5370\u8a18\u3002",
    masteryUpgradeReady: "\u5168\u82f1\u96c4\u6700\u5927\u751f\u547d +{current} \u2192 +{next} \u00b7 \u6d88\u8017 {cost} / \u6301\u6709 {marks} \u679a",
    masteryUpgradeNeed: "\u5168\u82f1\u96c4\u6700\u5927\u751f\u547d +{current} \u2192 +{next} \u00b7 \u9700\u8981 {cost} / \u6301\u6709 {marks} \u679a",
    scoutObjective: "\u64ca\u6557 {count} \u96bb\u6697\u5f71\u65a5\u5019",
    quitTitle: "\u8981\u96e2\u958b\u9019\u6b21\u8a66\u7149\u55ce\uff1f",
    quitCopy: "\u9019\u6b21\u6311\u6230\u7684\u623f\u9593\u8207\u795d\u798f\u9032\u5ea6\u5c07\u6703\u6d88\u5931\u3002",
    keepPlaying: "\u7e7c\u7e8c\u904a\u73a9",
    leaveTrial: "\u96e2\u958b\u8a66\u7149",
    rerollConfirmStatus: "\u4e09\u500b\u795d\u798f\u5168\u90e8\u91cd\u62bd\u4e00\u6b21 \u00b7 \u947d\u77f3 {balance} \u2192 {result}\u3002\u518d\u6b21\u9ede\u64ca\u78ba\u8a8d\u3002",
    rerollNeed: "\u9700\u8981 3 \u9846\u947d\u77f3 \u00b7 \u6301\u6709 {balance}\u3002\u4ecd\u53ef\u514d\u8cbb\u9078\u64c7\u795d\u798f\u3002",
  });
  Object.assign(copy.en, {
    skillReadyLabel: "{skill} ready. {effect} Press to use.",
    skillCooldownLabel: "{skill} unavailable for {seconds} seconds. {effect}",
    leoSkillEffect: "Deal {damage} damage to nearby enemies.",
    fiaSkillEffect: "Dash toward the nearest enemy, become invulnerable for 0.55 seconds, and deal {damage} close-range damage.",
    orlaSkillEffect: "Deal {damage} damage to the nearest enemy and mark its next automatic hit for +18 damage.",
    taroSkillEffect: "Guard for 3.5 seconds, heal up to {heal} HP, and deal {damage} damage in a wide area.",
    battleHelp: "Battle help",
  });
  Object.assign(copy["zh-Hant"], {
    skillReadyLabel: "{skill}已可使用。{effect}按下即可施放。",
    skillCooldownLabel: "{skill}尚有 {seconds} 秒無法使用。{effect}",
    leoSkillEffect: "對附近敵人造成 {damage} 點傷害。",
    fiaSkillEffect: "衝向最近敵人、獲得 0.55 秒無敵，並造成 {damage} 點近距離傷害。",
    orlaSkillEffect: "對最近敵人造成 {damage} 點傷害，並使下一次自動攻擊追加 18 點傷害。",
    taroSkillEffect: "防護 3.5 秒、最多恢復 {heal} 點生命，並對大範圍敵人造成 {damage} 點傷害。",
    battleHelp: "戰鬥說明",
  });
  copy.es = {
    controlHint: "Toca o arrastra para moverte · Usa {skill} o Espacio cuando esté disponible",
    rangeHint: "Acércate al enemigo resaltado · Los ataques se activan automáticamente al entrar en alcance",
    rangeHitHint: "En alcance · El ataque automático acertó",
    title: "Pruebas de Héroes Animales",
    pitch: "Elige uno de cuatro héroes y supera una campaña de 30 pruebas sombrías.",
    marks: "Marcas de prueba",
    mastery: "Maestría de vida",
    progress: "Progreso",
    start: "Iniciar juego",
    choose: "Elegir prueba",
    blessing: "Elige una bendición",
    menu: "Menú principal",
    locked: "Completa la prueba anterior",
    win: "¡Prueba completada!",
    fail: "Prueba fallida",
    next: "Siguiente prueba",
    retry: "Intentar de nuevo",
    scoutObjective: "Derrota a {count} exploradores sombríos",
    bossObjective: "Derrota al Soberano Sombrío",
    reroll: "Cambiar 3",
    rerollConfirm: "¿Gastar 3 diamantes para cambiar estas bendiciones?",
    rerollConfirmStatus: "Cambia las tres bendiciones una vez · {balance} → {result} diamantes. Toca otra vez para confirmar.",
    rerollUsed: "Ya cambiaste las bendiciones en esta prueba.",
    rerollNeed: "Necesitas 3 diamantes · Tienes {balance}. Aún puedes elegir una bendición gratis.",
    rerollDone: "Se revelaron nuevas bendiciones.",
    room: "Sala {room}/3",
    bossRoom: "Sala {room}/3 · JEFE",
    failCopy: "{hero} necesita probar otra ruta.",
    quitTitle: "聶Salir de esta prueba?",
    quitCopy: "Se perder獺 el progreso de salas y bendiciones de esta partida.",
    keepPlaying: "Seguir jugando",
    leaveTrial: "Salir de la prueba",
    arenaLabel: "Arena de las Pruebas de Héroes. Muévete con las flechas o WASD. Pulsa Espacio para usar la habilidad.",
    earnedMarks: "+{gain} marcas de prueba · Total {total}.",
    trialUnlocked: "Se desbloqueó la prueba {next}.",
    trialAvailable: "La prueba {next} sigue disponible.",
    allTrialsUnlocked: "Las 30 pruebas están desbloqueadas.",
    enemyObjective: "Derrota a {count} {enemy}",
    eliteObjective: "Derrota al capitán de {enemy}",
    bossObjectiveNamed: "Derrota a {boss}",
    recommended: "Recomendado: {hero}",
    roomsAndMarks: "3 salas · +{marks} marcas",
    masteryReady: "La Maestría de vida está lista para mejorar.",
    masteryNeed: "Faltan {remaining} marcas de prueba para mejorar la Maestría de vida.",
    masteryUpgradeReady: "PV máximos de todos los héroes +{current} → +{next} · Gasta {cost} / Tienes {marks} marcas",
    masteryUpgradeNeed: "PV máximos de todos los héroes +{current} → +{next} · Necesitas {cost} / Tienes {marks} marcas",
    skillReadyLabel: "{skill} está lista. {effect} Pulsa para usarla.",
    skillCooldownLabel: "{skill} no estará disponible durante {seconds} segundos. {effect}",
    leoSkillEffect: "Inflige {damage} de daño a enemigos cercanos.",
    fiaSkillEffect: "Corre hacia el enemigo más cercano, se vuelve invulnerable durante 0,55 segundos e inflige {damage} de daño cercano.",
    orlaSkillEffect: "Inflige {damage} de daño al enemigo más cercano y marca su siguiente golpe automático para añadir 18 de daño.",
    taroSkillEffect: "Protege durante 3,5 segundos, recupera hasta {heal} PV e inflige {damage} de daño en un área amplia.",
    battleHelp: "Ayuda de batalla",
  };

  Object.assign(copy.en, { stages: "Stages", replay: "Replay", battleHelp: "Battle help" });
  Object.assign(copy["zh-Hant"], { stages: "\u8a66\u7149", replay: "\u91cd\u65b0\u6311\u6230", battleHelp: "\u6230\u9b25\u8aaa\u660e" });
  Object.assign(copy.es, { stages: "Pruebas", replay: "Repetir", battleHelp: "Ayuda de batalla" });
  copy.ar = {
    title: "محاكمات بطل الحيوان",
    pitch: "اختر واحدًا من أربعة أبطال وأكمل حملة الظلال المكوّنة من 30 تجربة.",
    marks: "علامات التجربة",
    mastery: "إتقان القلب",
    progress: "التقدم",
    start: "ابدأ اللعبة",
    choose: "اختر تجربة",
    blessing: "اختر نعمة",
    menu: "القائمة الرئيسية",
    locked: "أكمل التجربة السابقة",
    win: "اكتملت التجربة!",
    fail: "فشلت التجربة",
    retry: "حاول مرة أخرى",
    scoutObjective: "اهزم {count} من الكشافة الظليين",
    bossObjective: "اهزم سيد الظلال",
    reroll: "إعادة سحب 3",
    rerollConfirm: "هل تنفق 3 ماسات لإعادة سحب هذه النعم؟",
    rerollConfirmStatus: "استبدل النعم الثلاث مرة واحدة · الماسات {balance} → {result}. اضغط مرة أخرى للتأكيد.",
    rerollUsed: "استُخدمت إعادة السحب في هذه التجربة.",
    rerollNeed: "تحتاج إلى 3 ماسات · لديك {balance}. اختر نعمة مجانية.",
    rerollDone: "ظهرت نعم جديدة.",
    room: "الغرفة {room}/3",
    bossRoom: "الغرفة {room}/3 · الزعيم",
    failCopy: "{hero} يحتاج إلى مسار آخر.",
    quitTitle: "هل تريد مغادرة هذه التجربة؟",
    quitCopy: "ستفقد تقدّم الغرفة والنعمة في هذه الجولة.",
    keepPlaying: "متابعة اللعب",
    leaveTrial: "مغادرة التجربة",
    arenaLabel: "ساحة محاكمات الأبطال. تحرّك بمفاتيح الأسهم أو WASD. اضغط المسافة لاستخدام مهارة البطل.",
    controlHint: "المس أو اسحب للتحرك · استخدم {skill} أو المسافة عند الجاهزية",
    rangeHint: "تحرّك نحو العدو المميز · الهجمات تلقائية داخل المدى",
    rangeHitHint: "داخل المدى · أصابت الهجمة التلقائية",
    earnedMarks: "+{gain} من علامات التجربة · الإجمالي {total}.",
    trialUnlocked: "اكتُشفت التجربة {next}.",
    trialAvailable: "لا تزال التجربة {next} متاحة.",
    allTrialsUnlocked: "تم فتح التجارب الثلاثين كلها.",
    enemyObjective: "اهزم {count} من {enemy}",
    eliteObjective: "اهزم قائد {enemy}",
    bossObjectiveNamed: "اهزم {boss}",
    recommended: "المقترح: {hero}",
    roomsAndMarks: "3 غرف · +{marks} علامة",
    masteryReady: "إتقان القلب جاهز للترقية.",
    masteryNeed: "ينقص إتقان القلب {remaining} من علامات التجربة.",
    masteryUpgradeReady: "الحد الأقصى لصحة جميع الأبطال +{current} → +{next} · أنفق {cost} / لديك {marks} علامة",
    masteryUpgradeNeed: "الحد الأقصى لصحة جميع الأبطال +{current} → +{next} · تحتاج إلى {cost} / لديك {marks} علامة",
    skillReadyLabel: "{skill} جاهزة. {effect} اضغط للاستخدام.",
    skillCooldownLabel: "{skill} غير متاحة لمدة {seconds} ثوانٍ. {effect}",
    leoSkillEffect: "ألحق {damage} ضررًا بالأعداء القريبين.",
    fiaSkillEffect: "اندفع نحو أقرب عدو، واحصل على حصانة لمدة 0.55 ثانية، وألحق {damage} ضررًا قريب المدى.",
    orlaSkillEffect: "ألحق {damage} ضررًا بأقرب عدو وعلّمه لتضيف هجمته التلقائية التالية 18 ضررًا.",
    taroSkillEffect: "احمِ نفسك لمدة 3.5 ثوانٍ، واستعد حتى {heal} من نقاط الصحة، وألحق {damage} ضررًا في نطاق واسع.",
    stages: "المراحل",
    battleHelp: "مساعدة المعركة",
    next: "المحاكمة القادمة",
    replay: "إعادة اللعب",
  };

  copy.hi = { progress: "प्रगति" };

  const TRIAL_COUNT = 30;
  const trialTitles = [
    ["First Footprints","初始足跡"],["Scout Ring","斥候包圍"],["Bramble Pursuit","荊棘追逐"],["Root Ambush","樹根伏擊"],["Prowler Gate","潛影者之門"],
    ["Prism Wings","稜晶之翼"],["Raven Crosswind","渡鴉側風"],["Crystal Guard","水晶護衛"],["Refraction Pack","折光群襲"],["Basilisk Mirror","蛇王之鏡"],
    ["Ember Hooves","餘燼蹄聲"],["Boar Warning","野豬預警"],["Furnace Charge","熔爐衝鋒"],["Cinder Stampede","燼火奔襲"],["Colossus Forge","巨獸熔爐"],
    ["Moon Bow","月影獵弓"],["Hunter Distance","獵手距離"],["Twin Volley","雙重齊射"],["Eclipse Wings","蝕月之翼"],["Archowl Court","大梟王庭"],
    ["Abyss Armor","深淵護甲"],["Shell Patrol","甲殼巡行"],["Sunken Pack","沉沒獸群"],["Leviathan Call","巨獸召喚"],["Abyss Throne","深淵王座"],
    ["Crown Mixture","王冠混戰"],["Sixfold Hunt","六相狩獵"],["Sovereign Guard","君王護衛"],["Last Shadow Line","最後暗影線"],["Void Crown Trial","虛空王冠試煉"]
  ];
  const trialTitlesAr = [
    "آثار الخطى الأولى", "حلقة الكشافة", "مطاردة العليق", "كمين الجذور", "بوابة المتربص",
    "أجنحة المنشور", "رياح عرضية للغراب", "حرس الكريستال", "حشد الانكسار", "مرآة البازيليسق",
    "حوافر الجمر", "تحذير الخنزير", "اندفاعة الفرن", "اندفاعة الرماد", "مسبك الجبار",
    "قوس القمر", "مسافة الصياد", "وابل مزدوج", "أجنحة الكسوف", "بلاط البومة العظمى",
    "درع الهاوية", "دورية الصدف", "قطيع غارق", "نداء لوياثان", "عرش الهاوية",
    "مزيج التاج", "صيد سداسي", "حرس السيّد", "خط الظل الأخير", "محاكمة التاج الفارغ",
  ];
  const regions = [
    { name:["Rootwood","根木林"], rule:["Chasing packs","追逐獸群"], enemies:["scout"], hero:"Leo" },
    { name:["Prism Ravine","稜晶峽谷"], rule:["Flying and guarded foes","飛行與護盾敵人"], enemies:["raven","armored","scout"], hero:"Orla" },
    { name:["Ember Forge","餘燼熔爐"], rule:["Warned charges","有預警的衝鋒"], enemies:["boar","scout","armored"], hero:"Fia" },
    { name:["Moon Range","月影長廊"], rule:["Ranged volleys","遠程齊射"], enemies:["hunter","raven","scout"], hero:"Orla" },
    { name:["Abyss Shell","深淵甲殼"], rule:["Armor and reinforcements","護甲與增援"], enemies:["armored","boar","hunter"], hero:"Taro" },
    { name:["Void Crown","虛空王冠"], rule:["Combined enemy rules","敵人規則組合"], enemies:["scout","raven","boar","hunter","armored"], hero:"Any hero" }
  ];
  const regionCopyAr = [
    ["غابة الجذور", "مطاردة القطعان"], ["وادي المنشور", "أعداء طائرون ومحميون"],
    ["مسبك الجمر", "اندفاعات مُحذَّر منها"], ["مدى القمر", "وابل بعيد المدى"],
    ["صدفة الهاوية", "دروع وتعزيزات"], ["تاج الفراغ", "قواعد أعداء مجمّعة"],
  ];
  const bosses = [
    { id:"prowler", name:["Shadow Prowler","暗影潛行者"], asset:"animal-hero-trials-shadow-boss.webp", rule:"shockwave" },
    { id:"basilisk", name:["Prism Basilisk","稜晶蛇王"], asset:"animal-auto-squad-boss-prism-basilisk.webp", rule:"prism" },
    { id:"colossus", name:["Magma Tusk Colossus","熔岩巨牙獸"], asset:"animal-auto-squad-boss-magma-tusk-colossus.webp", rule:"charge" },
    { id:"archowl", name:["Eclipse Archowl","蝕月大梟"], asset:"animal-auto-squad-boss-eclipse-archowl.webp", rule:"volley" },
    { id:"leviathan", name:["Abyss Shell Leviathan","深淵甲殼巨獸"], asset:"animal-auto-squad-boss-abyss-shell-leviathan.webp", rule:"summon" },
    { id:"emperor", name:["Void Crown Emperor","虛空王冠帝"], asset:"animal-auto-squad-boss-void-crown-emperor.webp", rule:"crown" }
  ];
  const bossNamesAr = [
    "المتربص الظلي", "بازيليسق المنشور", "جبار ناب الصهارة", "بومة الكسوف العظمى",
    "لوياثان صدفة الهاوية", "إمبراطور تاج الفراغ",
  ];
  const enemyProfiles = {
    scout:{ name:["Shadow Scouts","暗影斥候"], asset:"animal-hero-trials-shadow-scout.png", speed:32, damage:4, range:48 },
    raven:{ name:["Prism Ravens","稜晶渡鴉"], asset:"animal-rune-tactics-enemy-raven.webp", speed:42, damage:4, range:62 },
    boar:{ name:["Ember Boars","餘燼野豬"], asset:"animal-gearpack-expedition-enemy-armored-boar.webp", speed:25, damage:7, range:52 },
    hunter:{ name:["Moon Hunters","月影獵手"], asset:"shadow-wolf-enemy-hunter.webp", speed:27, damage:5, range:210 },
    armored:{ name:["Abyss Guards","深淵護衛"], asset:"animal-rune-tactics-enemy-wolf.webp", speed:23, damage:6, range:48, guard:2 }
  };
  const enemyNamesAr = ["الكشافة الظليون", "غربان المنشور", "خنازير الجمر", "صيادو القمر", "حراس الهاوية"];
  const heroNames = {
    Leo: ["Boom Mane Leo", "爆鬃里歐"],
    Fia: ["Spark Paw Fia", "星爪菲亞"],
    Orla: ["Moon Cap Orla", "月帽奧拉"],
    Taro: ["Moss Shell Taro", "苔甲塔羅"],
    "Any hero": ["Any hero", "任一英雄"],
  };
  const heroNamesAr = ["ليو عرف الانفجار", "فيا الكفّ اللامع", "أورلا قبعة القمر", "تارو صدفة الطحلب", "أي بطل"];
  const trialRosters = [
    ["scout"], ["scout"], ["scout", "raven"], ["scout", "hunter"], ["scout", "raven"],
    ["raven", "scout"], ["raven", "hunter"], ["armored", "raven"], ["raven", "armored", "scout"], ["armored", "raven"],
    ["boar", "scout"], ["boar", "armored"], ["boar", "raven"], ["boar", "scout", "armored"], ["boar", "armored"],
    ["hunter", "scout"], ["hunter", "raven"], ["hunter", "scout", "raven"], ["hunter", "raven", "armored"], ["hunter", "raven"],
    ["armored", "scout"], ["armored", "boar"], ["armored", "hunter"], ["armored", "boar", "hunter"], ["armored", "hunter"],
    ["scout", "raven", "boar"], ["hunter", "armored", "raven"], ["armored", "hunter", "boar"], ["scout", "raven", "boar", "hunter"], ["scout", "raven", "boar", "hunter", "armored"],
  ];
  const formationOrder = ["line", "pincer", "arc", "corners", "column", "stagger"];
  const formationPoints = {
    line: [[55, 105], [125, 105], [195, 105], [265, 105], [335, 105]],
    pincer: [[65, 105], [325, 105], [85, 225], [305, 225], [195, 145]],
    arc: [[55, 165], [115, 100], [195, 78], [275, 100], [335, 165]],
    corners: [[62, 88], [328, 88], [72, 250], [318, 250], [195, 155]],
    column: [[195, 72], [195, 140], [195, 208], [105, 130], [285, 130]],
    stagger: [[78, 82], [286, 112], [125, 198], [320, 242], [210, 132]],
  };

  function buildEncounterPlans(stage, roster, checkpoint) {
    const region = Math.floor((stage - 1) / 5);
    const slot = (stage - 1) % 5;
    return [1, 2, 3].map((room) => {
      if (room === 3 && checkpoint) return { boss: true, formation: "column", count: 1, types: ["boss"], elite: true, hpScale: 1 };
      const count = room === 1
        ? 2 + ((stage + region) % 2)
        : room === 2
          ? 3 + ((stage + slot) % 2)
          : 1 + ((stage + region) % 2);
      const formation = formationOrder[(stage * 2 + room + region) % formationOrder.length];
      const types = Array.from({ length: count }, (_, index) => roster[(index + stage + room + slot) % roster.length]);
      return {
        boss: false,
        formation,
        count,
        types,
        elite: room === 3,
        hpScale: 1 + slot * 0.03,
      };
    });
  }
  const trialTitlesEs = [
    "Primeras Huellas", "Círculo de Exploradores", "Persecución entre Zarzas", "Emboscada de Raíces", "Puerta del Acechador",
    "Alas Prismáticas", "Viento Cruzado del Cuervo", "Guardia de Cristal", "Manada de Refracción", "Espejo del Basilisco",
    "Pezuñas de Brasa", "Aviso del Jabalí", "Carga del Horno", "Estampida de Ceniza", "Forja del Coloso",
    "Arco Lunar", "Distancia del Cazador", "Doble Descarga", "Alas del Eclipse", "Corte del Archibúho",
    "Armadura Abisal", "Patrulla de Caparazones", "Manada Sumergida", "Llamada del Leviatán", "Trono Abisal",
    "Mezcla de la Corona", "Cacería Séxtuple", "Guardia del Soberano", "Última Línea Sombría", "Prueba de la Corona Vacía",
  ];
  trialTitles.forEach((title, index) => { title[2] = trialTitlesEs[index]; title[3] = trialTitlesAr[index]; });
  const regionCopyEs = [
    ["Bosque de Raíces", "Manadas perseguidoras"], ["Barranco Prismático", "Enemigos voladores y protegidos"],
    ["Forja de Brasas", "Cargas anunciadas"], ["Campo Lunar", "Descargas a distancia"],
    ["Caparazón Abisal", "Armadura y refuerzos"], ["Corona Vacía", "Reglas enemigas combinadas"],
  ];
  regions.forEach((region, index) => {
    region.name[2] = regionCopyEs[index][0];
    region.rule[2] = regionCopyEs[index][1];
    region.name[3] = regionCopyAr[index][0];
    region.rule[3] = regionCopyAr[index][1];
  });
  const bossNamesEs = ["Acechador Sombrío", "Basilisco Prismático", "Coloso Colmillo de Magma", "Archibúho del Eclipse", "Leviatán del Caparazón Abisal", "Emperador de la Corona Vacía"];
  bosses.forEach((boss, index) => { boss.name[2] = bossNamesEs[index]; boss.name[3] = bossNamesAr[index]; });
  const enemyNamesEs = ["Exploradores Sombríos", "Cuervos Prismáticos", "Jabalíes de Brasa", "Cazadores Lunares", "Guardias Abisales"];
  Object.values(enemyProfiles).forEach((profile, index) => { profile.name[2] = enemyNamesEs[index]; profile.name[3] = enemyNamesAr[index]; });
  const heroNamesEs = ["Leo Melena Explosiva", "Fia Pata Chispeante", "Orla Sombrero Lunar", "Taro Caparazón Musgoso", "Cualquier héroe"];
  Object.values(heroNames).forEach((name, index) => { name[2] = heroNamesEs[index]; name[3] = heroNamesAr[index]; });
  const trials = Array.from({length:TRIAL_COUNT},(_,index)=>{
    const stage=index+1;
    const region=Math.floor(index/5);
    const checkpoint=stage%5===0;
    const enemies=[...trialRosters[index]];
    return {
      stage,
      region,
      titleEn:trialTitles[index][0],
      titleZh:trialTitles[index][1],
      titleEs:trialTitles[index][2],
      titleAr:trialTitles[index][3],
      checkpoint,
      enemies,
      encounters:buildEncounterPlans(stage,enemies,checkpoint),
      recommended:regions[region].hero,
      reward:Math.min(9,3+stage),
      boss:checkpoint?bosses[region]:null
    };
  });

  function readStorage(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function writeStorage(key, value) { if(practiceRequested&&key.startsWith("aht-"))return false; try { localStorage.setItem(key, value); return true; } catch { return false; } }
  const localeCodes = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const returnLabels = Object.freeze({
    en: "Back",
    "zh-Hant": "返回",
    "zh-Hans": "返回",
    ja: "戻る",
    ko: "뒤로",
    es: "Volver",
    "pt-BR": "Voltar",
    fr: "Retour",
    de: "Zurück",
    it: "Indietro",
    ru: "Назад",
    hi: "वापस",
    ar: "رجوع",
  });
  const ownedLocales = new Set(["en", "zh-Hant", "es"]);
  const runtimeSupplemental = {
    hi: { Trial: "परीक्षण" },
    ar: { Trial: "التجربة" },
  };
  function canonicalLocale(value) {
    const raw = String(value || "").toLowerCase();
    if (raw.startsWith("zh-tw") || raw.includes("hant")) return "zh-Hant";
    if (raw.startsWith("zh-cn") || raw.includes("hans")) return "zh-Hans";
    if (raw.startsWith("pt")) return "pt-BR";
    return localeCodes.find((code) => code.toLowerCase() === raw) || "en";
  }
  const localeRoutePrefixes = Object.freeze({en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"});
  const routeLocale = document.documentElement.lang;
  let locale = canonicalLocale(routeLocale || readStorage("weightPlayLocale") || window.WonderI18n?.locale?.() || "en");
  const savedHero = readStorage("aht-selected-hero");
  let selectedHero = ["leo", "fia", "orla", "taro"].includes(savedHero) ? savedHero : "leo";
  if (savedHero && savedHero !== selectedHero) writeStorage("aht-selected-hero", selectedHero);
  function readStoredInteger(key, fallback, minimum, maximum) {
    const raw = readStorage(key);
    if (raw === null) return fallback;
    const parsed = Number(raw);
    const normalized = Number.isFinite(parsed)
      ? Math.max(minimum, Math.min(maximum, Math.trunc(parsed)))
      : fallback;
    if (raw !== String(normalized)) writeStorage(key, String(normalized));
    return normalized;
  }
  let unlocked = readStoredInteger("aht-unlocked", 1, 1, TRIAL_COUNT);
  let marks = readStoredInteger("aht-marks", 0, 0, Number.MAX_SAFE_INTEGER - 9);
  let mastery = readStoredInteger("aht-mastery", 0, 0, Math.floor((Number.MAX_SAFE_INTEGER - 9) / 4));
  let run = null;
  let resultDecisionCommitted = false;
  let blessingDecisionCommitted = false;
  let frame = 0;
  let rerollConfirmTimer = 0;
  let rerollConfirmDueAt = 0;
  let rerollConfirmRemaining = 0;
  let rerollConfirmGeneration = 0;
  let pointer = null;
  let moveTarget = null;
  let backgroundSuspended = false;
  let windowHasFocus = document.hasFocus();
  let quitSuspended = false;
  let quitOpener = null;
  const keys = {};
  const battleControlCodes = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyW", "KeyS", "Space", "ShiftLeft", "ShiftRight"]);
  let stick = { x: 0, y: 0 };
  let joystick = null;
  let world3d = null;
  let rendererReady = false;
  let sharedFrame = null;
  let sharedStage = null;
  const controlCopy={
    en:['Drag the stick or use WASD · Space: skill · Shift: dodge','Dodge','Heroes & Mastery','Choose your hero','Continue'],
    'zh-Hant':['拖曳搖桿或 WASD 移動 · 空白鍵技能 · Shift 閃避','閃避','英雄與精通','選擇英雄','繼續'],
    'zh-Hans':['拖动摇杆或 WASD 移动 · 空格键技能 · Shift 闪避','闪避','英雄与精通','选择英雄','继续'],
    ja:['スティック／WASDで移動 · Space：スキル · Shift：回避','回避','ヒーローと熟練','ヒーローを選択','続ける'],
    ko:['조이스틱／WASD 이동 · Space 스킬 · Shift 회피','회피','영웅과 숙련','영웅 선택','계속'],
    es:['Palanca o WASD: mover · Espacio: habilidad · Mayús: esquivar','Esquivar','Héroes y maestría','Elige tu héroe','Continuar'],
    'pt-BR':['Joystick ou WASD: mover · Espaço: habilidade · Shift: esquiva','Esquiva','Heróis e maestria','Escolha seu herói','Continuar'],
    fr:['Joystick ou WASD : bouger · Espace : pouvoir · Maj : esquive','Esquive','Héros et maîtrise','Choisissez un héros','Continuer'],
    de:['Joystick oder WASD: bewegen · Leertaste: Fähigkeit · Umschalt: ausweichen','Ausweichen','Helden und Meisterschaft','Helden wählen','Weiter'],
    it:['Joystick o WASD: muovi · Spazio: abilità · Maiusc: schiva','Schiva','Eroi e maestria','Scegli un eroe','Continua'],
    ru:['Джойстик／WASD: движение · Пробел: навык · Shift: уклонение','Уклонение','Герои и мастерство','Выберите героя','Продолжить'],
    hi:['जॉयस्टिक／WASD: चलें · Space: कौशल · Shift: बचाव','बचाव','नायक और निपुणता','नायक चुनें','जारी रखें'],
    ar:['العصا أو WASD للحركة · Space للمهارة · Shift للتفادي','تفادَ','الأبطال والإتقان','اختر بطلك','متابعة'],
  };
  const controlText=index=>(controlCopy[locale]||controlCopy.en)[index];
  const mainPitch={
    en:'Move out of enemy warnings and time your skills to clear each three-room trial.',
    'zh-Hant':'移動避開敵人預警，把握技能時機，突破每場試煉的三個房間。',
    'zh-Hans':'移动避开敌人预警，把握技能时机，突破每场试炼的三个房间。',
    ja:'敵の予告を避け、スキルを使う時機を選んで3部屋の試練を突破しよう。',
    ko:'적의 경고를 피하고 제때 스킬을 써서 세 방의 시련을 돌파하세요.',
    es:'Evita los avisos enemigos y usa tus habilidades para superar tres salas.',
    'pt-BR':'Desvie dos alertas inimigos e use habilidades na hora certa para vencer três salas.',
    fr:'Évite les zones annoncées et utilise tes pouvoirs au bon moment pour franchir trois salles.',
    de:'Weiche Warnzonen aus und setze Fähigkeiten gezielt ein, um drei Räume zu schaffen.',
    it:'Evita gli attacchi annunciati e usa le abilità al momento giusto per superare tre stanze.',
    ru:'Уходи из зон угрозы и вовремя используй навыки, чтобы пройти три комнаты.',
    hi:'दुश्मन की चेतावनी से हटें और सही समय पर कौशल चलाकर तीन कमरे पार करें।',
    ar:'ابتعد عن تحذيرات الأعداء واستخدم مهاراتك في الوقت المناسب لاجتياز ثلاث غرف.'
  };

  function clearMovementInput() {
    Object.keys(keys).forEach((key) => { keys[key] = false; });
    stick = { x: 0, y: 0 };
    joystick?.reset();
    const ownedPointer = pointer;
    pointer = null;
    moveTarget = null;
    if (ownedPointer !== null && canvas?.hasPointerCapture?.(ownedPointer)) canvas.releasePointerCapture(ownedPointer);
  }

  function movementIntent() {
    let dx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0);
    let dy = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0);
    if (!dx && !dy && joystick) {
      const vector = joystick.getVector();
      dx = vector.x; dy = vector.y;
    }
    if (!dx && !dy && moveTarget && run) {
      dx = moveTarget.x - run.leo.x;
      dy = moveTarget.y - run.leo.y;
      if (Math.hypot(dx, dy) < 12) {
        moveTarget = null;
        return { x: 0, y: 0 };
      }
    }
    return { x: dx, y: dy };
  }

  const views = {
    main: $("#mainView"),
    stage: $("#stageView"),
    battle: $("#battleView"),
  };
  const resultActions = document.createElement("div");
  resultActions.className = "result-actions";
  const resultReplay = document.createElement("button");
  resultReplay.id = "resultReplay";
  resultReplay.type = "button";
  resultActions.append($("#resultHome"), $("#resultNext"), resultReplay);
  $("#resultModal > section").append(resultActions);
  const canvas = $("#game");
  const ctx = canvas.getContext("2d");
  let activeScene = "main";
  let sceneGeneration = 0;
  let battleHelpRestoreTimer = 0;

  function fitBattleWorld() {
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    // Viewport composition distributes the SAME fixed simulation. Resizing
    // must never move colliders, change ranges, or mutate a committed attack.
    const ratio = rect.width / rect.height;
    const width = Math.round(Math.max(460, WORLD_HEIGHT * ratio));
    const height = Math.round(Math.max(WORLD_HEIGHT, 460 / ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width; canvas.height = height;
      world3d?.resize(width, height);
      joystick?.refresh();
      if (run) draw();
    }
  }

  const battleWorldObserver = new ResizeObserver(() => {
    if (activeScene === "battle") fitBattleWorld();
  });
  battleWorldObserver.observe(canvas.parentElement);

  function sceneFrame(scene, callback) {
    const generation = sceneGeneration;
    return requestAnimationFrame(() => {
      if (activeScene !== scene || sceneGeneration !== generation) return;
      callback();
    });
  }

  function suspendBackgroundBattle() {
    clearMovementInput();
    if (!run?.active || document.body.dataset.gameView !== "battle") return;
    (__wpNotifyMeasurement(), backgroundSuspended = true);
    run.active = false;
    cancelAnimationFrame(frame);
  }

  function resumeBackgroundBattle() {
    if (!backgroundSuspended || !run || document.hidden || !windowHasFocus || document.body.dataset.gameView !== "battle") return;
    if (!$("#choiceModal").classList.contains("hidden") || !$("#quitModal").classList.contains("hidden") || !$("#resultModal").classList.contains("hidden")) return;
    (__wpNotifyMeasurement(), backgroundSuspended = false);
    run.active = true;
    run.last = performance.now();
    loop(run.last);
    sceneFrame("battle", () => $("#game").focus({ preventScroll: true }));
  }
  const images = {};
  const heroes = {
    leo: { image: "leo", asset: "weightplay-character-boom-mane-lion-block-v1.webp", hp: 100, speed: 125, attack: 10, range: 76, skill: { en: "ROAR", zh: "怒吼", es: "RUGIDO", ar: "زئير" } },
    fia: { image: "fia", asset: "weightplay-character-spark-paw-fox-block-v1.webp", hp: 86, speed: 145, attack: 11, range: 72, skill: { en: "DASH", zh: "彗星衝刺", es: "CARRERA COMETA", ar: "اندفاعة" } },
    orla: { image: "orla", asset: "weightplay-character-moon-cap-owl-block-v1.webp", hp: 82, speed: 112, attack: 8, range: 165, skill: { en: "MARK", zh: "月之印記", es: "MARCA LUNAR", ar: "وسم" } },
    taro: { image: "taro", asset: "weightplay-character-moss-shell-turtle-block-v1.webp", hp: 126, speed: 92, attack: 8, range: 76, skill: { en: "GUARD", zh: "庭園守護", es: "GUARDIA DEL JARDÍN", ar: "حراسة" } },
  };

  function load(filename) {
    const image = new Image();
    image.src = ASSET_ROOT + filename;
    return image;
  }

  function runtimeTranslate(source) {
    if (ownedLocales.has(locale)) return source;
    const supplemental = runtimeSupplemental[locale]?.[source];
    if (supplemental) return supplemental;
    return window.WeightPlayGameRuntimeLocalizer?.translate?.(String(source)) || source;
  }

  function t(key) {
    if(key==='pitch')return mainPitch[locale]||mainPitch.en;
    const owned = copy[locale]?.[key];
    return owned || runtimeTranslate(copy.en[key] || key);
  }

  const masteryLevelLabels = {
    en: "Level",
    "zh-Hant": "等級",
    "zh-Hans": "等级",
    ja: "レベル",
    ko: "레벨",
    es: "Nivel",
    "pt-BR": "Nível",
    fr: "Niveau",
    de: "Stufe",
    it: "Livello",
    ru: "Уровень",
    hi: "स्तर",
    ar: "المستوى",
  };

  function formatMasteryLevel(value) {
    const label = masteryLevelLabels[locale] || masteryLevelLabels.en;
    return `${label} ${Math.max(0, Math.floor(Number(value) || 0))}`;
  }

  function playSound(cue) {
    window.WeightPlayAudio?.play?.(cue);
  }

  const soundActionLabels = {
    hi: { mute: "ध्वनि म्यूट करें", unmute: "ध्वनि चालू करें" },
    ar: { mute: "كتم الصوت", unmute: "تشغيل الصوت" },
    en: { mute: "Mute sound", unmute: "Turn sound on" },
    "zh-Hant": { mute: "\u95dc\u9589\u97f3\u6548", unmute: "\u958b\u555f\u97f3\u6548" },
    "zh-Hans": { mute: "\u5173\u95ed\u97f3\u6548", unmute: "\u5f00\u542f\u97f3\u6548" },
    ja: { mute: "\u30b5\u30a6\u30f3\u30c9\u3092\u30df\u30e5\u30fc\u30c8", unmute: "\u30b5\u30a6\u30f3\u30c9\u3092\u30aa\u30f3" },
    ko: { mute: "\uc18c\ub9ac \ub044\uae30", unmute: "\uc18c\ub9ac \ucf1c\uae30" },
    es: { mute: "Silenciar sonido", unmute: "Activar sonido" },
    "pt-BR": { mute: "Silenciar som", unmute: "Ativar som" },
    fr: { mute: "Couper le son", unmute: "Activer le son" },
    de: { mute: "Ton ausschalten", unmute: "Ton einschalten" },
    it: { mute: "Disattiva audio", unmute: "Attiva audio" },
    ru: { mute: "\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0437\u0432\u0443\u043a", unmute: "\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0437\u0432\u0443\u043a" },
  };

  const healthLabels = Object.freeze({
    en: "Health",
    "zh-Hant": "生命",
    "zh-Hans": "生命值",
    ja: "体力",
    ko: "체력",
    es: "Salud",
    "pt-BR": "Vida",
    fr: "Santé",
    de: "Gesundheit",
    it: "Salute",
    ru: "Здоровье",
    hi: "स्वास्थ्य",
    ar: "الصحة",
  });

  function syncSoundToggle() {
    const button = $("#soundToggle");
    if (!button) return;
    const muted = Boolean(window.WeightPlayAudio?.isMuted?.());
    const labels = soundActionLabels[locale] || soundActionLabels.en;
    const sourceLabel = muted ? "Turn sound on" : "Mute sound";
    const label = labels[muted ? "unmute" : "mute"] || sourceLabel;
    button.setAttribute("aria-pressed", String(muted));
    button.setAttribute("aria-label", label);
    button.title = label;
    button.textContent = muted ? "\ud83d\udd07" : "\ud83d\udd0a";
  }

  function roomLabel(room, boss = false) {
    if (locale === "zh-Hant") return `\u623f\u9593 ${room}/3${boss ? " \u00b7 \u9996\u9818" : ""}`;
    return interpolate(boss ? "bossRoom" : "room", { room });
  }

  function updateBattleBriefing() {
    if (!run) return;
    const definition = run.definition;
    const region = regions[definition.region];
    const trialLabel = localizedValue("Trial", "試煉", "Prueba", "التجربة");
    const title = localizedValue(definition.titleEn, definition.titleZh, definition.titleEs, definition.titleAr);
    const rule = localizedPair(region.rule);
    $("#battleBriefing").textContent = `${trialLabel} ${definition.stage} · ${title} · ${rule}`;
    $("#battleBriefing").dataset.defaultText = $("#battleBriefing").textContent;
  }

  function interpolate(key, values) {
    return t(key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
  }

  function trackTrialEvent(name, details = {}) {
    if(practiceRequested)return;
    window.WonderAnalytics?.track?.(name, {
      game_id: "animal-hero-trials",
      game_version: GAME_VERSION,
      interface_version: "6",
      locale,
      ...details,
    });
  }

  function heroName(heroId) {
    const key = { leo: "Leo", fia: "Fia", orla: "Orla", taro: "Taro" }[heroId];
    return key && heroNames[key] ? localizedPair(heroNames[key]) : heroId.charAt(0).toUpperCase() + heroId.slice(1);
  }

  function localizedPair(pair) {
    if (locale === "zh-Hant") return pair[1] || pair[0];
    if (locale === "es") return pair[2] || pair[0];
    if (locale === "ar") return pair[3] || pair[0];
    return runtimeTranslate(pair[0]);
  }
  function localizedValue(en, zh, es, ar) {
    if (locale === "zh-Hant") return zh;
    if (locale === "es") return es;
    if (locale === "ar") return ar || runtimeTranslate(en);
    return runtimeTranslate(en);
  }
  function localizedSkillName(skill) {
    if (locale === "zh-Hant") return skill.zh;
    if (locale === "es") return skill.es;
    if (locale === "ar") return skill.ar;
    return runtimeTranslate(skill.en);
  }
  function trialDefinition(stage) { return trials[Math.max(0,Math.min(TRIAL_COUNT-1,Number(stage)-1))] || trials[0]; }

  function show(name) {
    clearRerollConfirmation();
    clearMovementInput();
    setHeroPanel(false, false);
    if (name !== activeScene) {
      activeScene = name;
      sceneGeneration += 1;
    }
    document.body.dataset.gameView = name;
    document.body.dataset.screen = name;
    for (const scene of ["main", "stage", "battle"]) document.body.classList.toggle(`wp-shell-${scene}-active`, scene === name);
    document.body.classList.toggle("wp-stage-select-active", name === "stage");
    document.documentElement.classList.toggle("wp-stage-select-active", name === "stage");
    Object.entries(views).forEach(([key, view]) => {
      view.hidden = key !== name;
      view.classList.toggle("hidden", key !== name);
    });
    if (name === "stage") {
      // Result → Next → Leave must repaint the progress card as well as the
      // cards from the settled unlock state; otherwise a reused Stage scene
      // can show the new unlock beside the prior Trial Marks total.
      localize();
    }
    setChoiceModal(false, false);
    closeQuitDecision(false, false);
    setResultModal(false, false);
    if (name !== "battle") {
      (__wpNotifyMeasurement(), backgroundSuspended = false);
      cancelAnimationFrame(frame);
      if (run) run.active = false;
    }
    joystick?.setEnabled(name === 'battle' && Boolean(run?.active));
    sharedFrame?.activate(name);
    dispatchEvent(new CustomEvent("weightplay:shell-sync", { detail: { screen: name, generation: sceneGeneration } }));
    dispatchEvent(new CustomEvent("weightplay:stage-sync", { detail: { screen: name, generation: sceneGeneration } }));
    dispatchEvent(new CustomEvent("weightplay:battle-sync", { detail: { screen: name, generation: sceneGeneration } }));
    if (name === "battle") dispatchEvent(new CustomEvent("weightplay:battle-open", { detail: { screen: name, generation: sceneGeneration } }));

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}

  function resultCoveredLayers() {
    return [...$("#battleView").children].filter((node) => node.id !== "resultModal");
  }

  function choiceCoveredLayers() {
    return [...$("#battleView").children].filter((node) => !["choiceModal", "resultModal", "battleAd"].includes(node.id));
  }

  function quitCoveredLayers() {
    return [...$("#battleView").children].filter((node) => !["quitModal", "battleAd"].includes(node.id));
  }

  function openQuitDecision() {
    if (!run || document.body.dataset.gameView !== "battle" || !$("#quitModal").classList.contains("hidden") || !$("#choiceModal").classList.contains("hidden") || !$("#resultModal").classList.contains("hidden")) return;
    quitOpener = document.activeElement === $("#battleBack") ? document.activeElement : $("#battleBack");
    clearMovementInput();
    quitSuspended = Boolean(run.active);
    run.active = false;
    cancelAnimationFrame(frame);
    (__wpNotifyMeasurement(), $("#quitModal").classList.remove("hidden"));
    quitCoveredLayers().forEach((layer) => {
      layer.inert = true;
      layer.setAttribute("aria-hidden", "true");
    });
    sceneFrame("battle", () => {
      if (!$("#quitModal").classList.contains("hidden")) $("#quitKeep").focus({ preventScroll: true });
    });
  }

  function closeQuitDecision(resume = false, restoreFocus = true) {
    const wasOpen = !$("#quitModal").classList.contains("hidden");
    const opener = quitOpener;
    quitOpener = null;
    (__wpNotifyMeasurement(), $("#quitModal").classList.add("hidden"));
    quitCoveredLayers().forEach((layer) => {
      layer.inert = false;
      layer.removeAttribute("aria-hidden");
    });
    const shouldResume = resume && wasOpen && quitSuspended && run && document.body.dataset.gameView === "battle" && !document.hidden;
    quitSuspended = false;
    if (!shouldResume) return;
    run.active = true;
    run.last = performance.now();
    loop(run.last);
    if (restoreFocus) sceneFrame("battle", () => (opener?.isConnected ? opener : $("#battleBack")).focus({ preventScroll: true }));
  }

  function setChoiceModal(open, focusPrimary = true) {
    if (open) clearMovementInput();
    (__wpNotifyMeasurement(), $("#choiceModal").classList.toggle("hidden", !open));
    choiceCoveredLayers().forEach((layer) => {
      layer.inert = open;
      if (open) layer.setAttribute("aria-hidden", "true");
      else layer.removeAttribute("aria-hidden");
    });
    if (open && focusPrimary) sceneFrame("battle", () => {
      if (!$("#choiceModal").classList.contains("hidden")) $("#choices .choice")?.focus({ preventScroll: true });
    });
  }

  function setResultModal(open, focusTarget = $("#resultHome")) {
    if (open) clearMovementInput();
    (__wpNotifyMeasurement(), $("#resultModal").classList.toggle("hidden", !open));
    resultCoveredLayers().forEach((layer) => {
      layer.inert = open;
      if (open) layer.setAttribute("aria-hidden", "true");
      else layer.removeAttribute("aria-hidden");
    });
    if (open && focusTarget) sceneFrame("battle", () => {
      if (!$("#resultModal").classList.contains("hidden")) focusTarget.focus({ preventScroll: true });
    });
  }

  function commitResultDecision(action) {
    if (resultDecisionCommitted || $("#resultModal").classList.contains("hidden")) return false;
    resultDecisionCommitted = true;
    [$("#resultHome"), $("#resultNext"), resultReplay].forEach((button) => { button.disabled = true; });
    action();
    return true;
  }

  function localize() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = localizedValue("Animal Hero Trials - WeightPlay", "動物英雄試煉 - WeightPlay", "Pruebas de Héroes Animales - WeightPlay", "محاكمات بطل الحيوان - WeightPlay");
    const returnLabel = returnLabels[locale] || returnLabels.en;
    $("#stageBack").setAttribute("aria-label", returnLabel);
    $("#battleBack").setAttribute("aria-label", returnLabel);
    $("#game").setAttribute("aria-label", t("arenaLabel"));
    $("#game").setAttribute("aria-keyshortcuts", "ArrowUp ArrowDown ArrowLeft ArrowRight W A S D Space");
    $$('[data-t]').forEach((node) => {
      node.textContent = t(node.dataset.t);
    });
    $("#markCount").textContent = marks;
    $("#mainProgress").textContent = `${t("progress")} ${Math.max(1, unlocked)} / ${TRIAL_COUNT}`;
    $("#battleHelp").setAttribute("aria-label", t("battleHelp"));
    $("#battleHelp").title = t("battleHelp");
    const masteryLevel = formatMasteryLevel(mastery);
    $("#masteryLevel").textContent = masteryLevel;
    const masteryCost = 5 + mastery * 4;
    const masteryCurrent = mastery * 12;
    const masteryNext = (mastery + 1) * 12;
    const masteryReady = marks >= masteryCost;
    const masterySummary = interpolate(masteryReady ? "masteryUpgradeReady" : "masteryUpgradeNeed", {
      current: masteryCurrent,
      next: masteryNext,
      cost: masteryCost,
      marks,
    });
    $("#masteryCost").textContent = masterySummary;
    $("#masteryBtn").disabled = practiceRequested || !masteryReady;
    $("#masteryBtn").setAttribute("aria-label", `${t("mastery")}, ${masteryLevel}. ${masterySummary}`);
    syncSoundToggle();
    renderHeroPicker();
    renderStages();
  }

  function renderHeroPicker() {
    const picker = $("#heroPicker");
    if (!picker) return;
    const focusedHero = document.activeElement?.closest?.(".hero-option")?.dataset.hero || "";
    const labels = {
      leo: [localizedPair(heroNames.Leo), localizedValue("Balanced · 100 HP", "均衡 · 100 生命", "Equilibrado · 100 PV", "متوازن · 100 صحة"), localizedValue("Close-range stun", "近距離暈眩", "Aturdimiento cercano", "صعق قريب")],
      fia: [localizedPair(heroNames.Fia), localizedValue("Fast · 86 HP", "高速 · 86 生命", "Veloz · 86 PV", "سريع · 86 صحة"), localizedValue("Invulnerable dash", "無敵衝刺", "Carrera invulnerable", "اندفاعة محصّنة")],
      orla: [localizedPair(heroNames.Orla), localizedValue("Ranged · 82 HP", "遠程 · 82 生命", "Distancia · 82 PV", "بعيد المدى · 82 صحة"), localizedValue("Mark bonus damage", "標記增傷", "Marca de daño adicional", "ضرر إضافي بالوسم")],
      taro: [localizedPair(heroNames.Taro), localizedValue("Tank · 126 HP", "耐久 · 126 生命", "Defensor · 126 PV", "مدافع · 126 صحة"), localizedValue("Damage guard", "守護減傷", "Guardia reductora", "حراسة تخفّف الضرر")],
    };
    picker.innerHTML = "";
    Object.entries(heroes).forEach(([id, hero]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.hero = id;
      button.setAttribute("aria-label", labels[id].join(" - "));
      button.setAttribute("aria-pressed", id === selectedHero ? "true" : "false");
      button.className = `hero-option${id === selectedHero ? " selected" : ""}`;
      button.innerHTML = `<img src="${ASSET_ROOT + hero.asset}" alt=""><b>${labels[id][0]}</b><small><span>${labels[id][1]}</span><span>${labels[id][2]}</span></small>`;
      button.onclick = () => {
        selectedHero = id;
        writeStorage("aht-selected-hero", id);
        renderHeroPicker();
        setHeroPanel(false);
      };
      picker.append(button);
    });
    if($('#stageSummary'))$('#stageSummary').textContent=`${heroName(selectedHero)} · ${marks} ${t('marks')}`;
    if (focusedHero) sceneFrame("stage", () => {
      picker.querySelector(`.hero-option[data-hero="${focusedHero}"]`)?.focus({ preventScroll: true });
    });
  }

  function renderStages() {
    if(sharedStage)sharedStage.refresh(sharedStage.selected);
  }

  function setHeroPanel(open, restoreFocus=true) {
    const panel=$('#heroPanel');if(!panel)return;
    panel.hidden=!open;
    [$('#stageContent'),views.stage.querySelector('header'),views.stage.querySelector('[data-wp-frame-nav]')].filter(Boolean).forEach(node=>{node.inert=open;});
    if(open)panel.querySelector('.hero-option')?.focus({preventScroll:true});
    else if(restoreFocus&&activeScene==='stage')$('#teamBtn')?.focus({preventScroll:true});
  }

  function focusStage(stage = null) {
    sceneFrame("stage", () => {
      const index = stage === null ? sharedStage?.selected : Math.max(0, Math.min(TRIAL_COUNT - 1, Number(stage) - 1));
      sharedStage?.select(index,{focus:true});
    });
  }

  function focusMain() {
    sceneFrame("main", () => $("#startBtn").focus({ preventScroll: true }));
  }

  function beginRangeGuidance() {
    if (!run || run.controlHintDismissed) return;
    run.controlHintDismissed = true;
    if (run.room === 1 && !run.firstAutoAttack) {
      run.guidancePhase = "range";
      run.guidanceTimer = 12;
    }
    updateGuidanceHint();
  }

  function save() {
    writeStorage("aht-unlocked", unlocked);
    writeStorage("aht-marks", marks);
    writeStorage("aht-mastery", mastery);
  }

  function startTrial(stage, startReason = "stage_select") {
    const ticket=++trialStartTicket;
    const generation=sceneGeneration;
    if(!rendererReady) return;
    if(practiceIsolation) {
      if(!practiceEnabled || !localPractice)return;
      localPractice.validate().then(valid=>{
        if(valid&&ticket===trialStartTicket&&generation===sceneGeneration) beginTrial(stage,startReason);
      });
      return;
    }
    if(practiceRequested)return; // Authentication cannot fall through to a rewarded run.
    beginTrial(stage,startReason);
  }

  function beginTrial(stage, startReason) {
    cancelAnimationFrame(frame);
    (__wpNotifyMeasurement(), backgroundSuspended = false);
    show("battle");
    fitBattleWorld();
    const hero = heroes[selectedHero] || heroes.leo;
    const maxHp = hero.hp + mastery * 12;
    run = {
      active: true,
      stage:Math.max(1,Math.min(practiceEnabled?TRIAL_COUNT:unlocked,Number(stage)||1)),
      definition:trialDefinition(Math.max(1,Math.min(practiceEnabled?TRIAL_COUNT:unlocked,Number(stage)||1))),
      room: 1,
      hp: maxHp,
      maxHp,
      leo: { x: WORLD_WIDTH / 2, y: 430 },
      heroId: selectedHero,
      enemies: [],
      cool: 0,
      attackCool: 0,
      invulnerable: 0,
      dashSafe: 0,
      dodgeCool: 0,
      dodgeMotion: null,
      guard: 0,
      rerollUsed: false,
      rerollPending: false,
      controlHintDismissed: false,
      guidancePhase: "controls",
      guidanceTimer: 0,
      firstAutoAttack: false,
      last: performance.now(),
      bless: { power: 0, speed: 0, heal: 0 },
      fx: [],
      hazards: [],
      counter: 0,
      combatMessage: "",
      combatMessageTime: 0,
      dodges: 0,
      build: { exploit: 0, echo: 0, momentum: 0, refuge: 0, siphon: 0, reach: 0 },
      buildSeed: Math.floor(Math.random()*1000000),
      time: 0,
      shake: 0,
      heroFlash: 0,
      heroKick: 0,
      stepPhase: 0,
      lastMoveX: 0,
      lastMoveY: 0,
    };
    trackTrialEvent("trial_start", {
      stage: run.stage,
      hero_id: run.heroId,
      start_reason: startReason,
      unlocked_trial: unlocked,
      mastery_level: mastery,
    });
    joystick?.setEnabled(true);
    $("#skillBtn img").src = ASSET_ROOT + hero.asset;
    spawn();
    playSound("game.start");
    $("#game").focus({ preventScroll: true });
    loop(performance.now());

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}

  function spawn() {
    run.hazards = [];
    run.fx = [];
    run.strike = null;
    run.leo = { x: WORLD_WIDTH / 2, y: 430 };
    clearMovementInput();
    const definition=run.definition;
    const encounter=definition.encounters[run.room-1];
    updateBattleBriefing();
    if (run.room === 3 && definition.checkpoint) {
      const boss=definition.boss;
      const hp = 190 + definition.region * 44;
      run.enemies = [{ x:WORLD_WIDTH / 2,y:125,hp,max:hp,cd:1.5,boss:true,bossId:boss.id,bossRule:boss.rule,type:"boss",special:2.8,warning:0,phase:0,guard:boss.rule==="prism"||boss.rule==="crown"?3:0,summoned:false,hitFlash:0,hitOffsetX:0,hitOffsetY:0,animSeed:0 }];
      $("#roomText").textContent = roomLabel(run.room, true);
      $("#objective").textContent = interpolate("bossObjectiveNamed",{boss:localizedPair(boss.name)});
      updateHud();
      playSound("alert.boss");
      return;
    }
    const elite=encounter.elite;
    const count=encounter.count;
    const points=formationPoints[encounter.formation];
    run.enemies = Array.from({ length:count }, (_, index) => {
      const type=encounter.types[index];
      const profile=enemyProfiles[type];
      const point=points[index%points.length];
      const baseHp=(elite?84:28)+definition.region*9+run.room*6+definition.stage*.45;
      const hp=Math.round(baseHp*encounter.hpScale*(elite&&count>1?.7:1));
      return { x:worldX(point[0]), y:point[1], hp, max:hp, cd:1+index*.45, type, elite, special:1.6+index*.3, warning:0, guard:(profile.guard||0)+(elite?1:0), phase:0, hitFlash:0, hitOffsetX:0, hitOffsetY:0, animSeed:index * 1.7 + run.room };
    });
    $("#roomText").textContent = roomLabel(run.room,elite);
    const enemyNames=[...new Set(run.enemies.map((enemy)=>localizedPair(enemyProfiles[enemy.type].name)))].join(" + ");
    $("#objective").textContent = elite&&count===1
      ? interpolate("eliteObjective",{enemy:enemyNames})
      : interpolate("enemyObjective",{count:run.enemies.length,enemy:enemyNames});
    updateHud();
    if(elite) playSound("alert.boss");
  }

  function skillEffectLabel() {
    if (run.heroId === "leo") return interpolate("leoSkillEffect", { damage: 24 + run.bless.power * 7 });
    if (run.heroId === "fia") return interpolate("fiaSkillEffect", { damage: 30 + run.bless.power * 6 });
    if (run.heroId === "orla") return interpolate("orlaSkillEffect", { damage: 24 + run.bless.power * 5 });
    return interpolate("taroSkillEffect", { heal: 8 + run.bless.heal * 2, damage: 20 + run.bless.power * 4 });
  }

  function updateGuidanceHint() {
    if (!run) return;
    const hint = $("#controlHint");
    const inFirstRoom = run.room === 1;
    const showControls = inFirstRoom && !run.controlHintDismissed;
    const showRange = inFirstRoom && run.guidancePhase === "range" && run.guidanceTimer > 0;
    const showHit = inFirstRoom && run.guidancePhase === "hit" && run.guidanceTimer > 0;
    hint.hidden = false;
    if (showControls) {
      const skillName = localizedSkillName(heroes[run.heroId].skill);
      hint.textContent = `${controlText(0)} · ${combatText(0)}`;
    } else if (showRange) {
      hint.textContent = t("rangeHint");
    } else if (showHit) {
      hint.textContent = t("rangeHitHint");
    } else {
      hint.textContent = run.combatMessageTime>0 ? run.combatMessage : combatText(0);
    }
    canvas.dataset.guidancePhase = showControls ? "controls" : showRange ? "range" : showHit ? "hit" : "done";
    canvas.dataset.attackRange = String(heroes[run.heroId].range);
    if (!(showRange || showHit)) delete canvas.dataset.guidanceTarget;
  }

  function updateHud() {
    $("#hpFill").style.width = `${Math.max(0, (run.hp / run.maxHp) * 100)}%`;
    const healthBar = $(".health");
    const healthLabel = healthLabels[locale] || healthLabels.en;
    healthBar.setAttribute("role", "progressbar");
    healthBar.setAttribute("aria-valuemin", "0");
    healthBar.setAttribute("aria-valuemax", String(run.maxHp));
    healthBar.setAttribute("aria-valuenow", String(run.hp));
    healthBar.setAttribute("aria-label", `${healthLabel}: ${run.hp} / ${run.maxHp}`);
    const skillName = localizedSkillName(heroes[run.heroId].skill);
    updateGuidanceHint();
    $("#cooldownText").textContent = run.cool > 0 ? run.cool.toFixed(1) : skillName;
    $("#skillBtn").setAttribute("aria-label", interpolate(run.cool > 0 ? "skillCooldownLabel" : "skillReadyLabel", {
      skill: skillName,
      seconds: Math.max(0.1, run.cool).toFixed(1),
      effect: skillEffectLabel(),
    }));
  }

  const combatWords = {
    en: ["Leave the amber zone · Strike when the enemy turns mint", "DODGED", "COUNTER", "BREAK", "OPEN", "Exploit", "Echo", "Momentum", "Refuge", "Siphon", "Reach"],
    "zh-Hant": ["離開琥珀預告區 · 敵人變綠時反擊", "閃避", "反擊", "破防", "破綻", "破綻追擊", "回響", "動能", "庇護", "汲取", "延伸"],
    "zh-Hans": ["离开琥珀预告区 · 敌人变绿时反击", "闪避", "反击", "破防", "破绽", "破绽追击", "回响", "动能", "庇护", "汲取", "延伸"],
    ja: ["琥珀色の予告から出よう · 緑の敵に反撃", "回避", "反撃", "破壊", "隙", "追撃", "反響", "勢い", "加護", "吸収", "射程"],
    ko: ["호박색 경고 구역을 벗어나세요 · 초록 적에게 반격", "회피", "반격", "방어 파괴", "빈틈", "추격", "메아리", "기세", "보호", "흡수", "사거리"],
    es: ["Sal del área ámbar · Ataca al enemigo verde", "ESQUIVA", "CONTRA", "ROTURA", "ABIERTO", "Aprovechar", "Eco", "Impulso", "Refugio", "Absorción", "Alcance"],
    "pt-BR": ["Saia da área âmbar · Ataque o inimigo verde", "ESQUIVA", "CONTRA", "QUEBRA", "ABERTO", "Explorar", "Eco", "Impulso", "Refúgio", "Absorção", "Alcance"],
    fr: ["Quittez la zone ambrée · Frappez l’ennemi vert", "ESQUIVE", "CONTRE", "BRISÉ", "OUVERT", "Exploiter", "Écho", "Élan", "Refuge", "Siphon", "Portée"],
    de: ["Bernsteinzone verlassen · Grüne Gegner angreifen", "AUSWEICHEN", "KONTER", "BRUCH", "OFFEN", "Ausnutzen", "Echo", "Schwung", "Zuflucht", "Entzug", "Reichweite"],
    it: ["Esci dall’area ambra · Colpisci il nemico verde", "SCHIVATA", "CONTRATTACCO", "ROTTURA", "APERTO", "Sfrutta", "Eco", "Slancio", "Rifugio", "Risucchio", "Portata"],
    ru: ["Уйдите из янтарной зоны · Бейте зелёного врага", "УКЛОНЕНИЕ", "КОНТРАТАКА", "ПРОБОЙ", "ОТКРЫТ", "Уязвимость", "Эхо", "Разгон", "Укрытие", "Поглощение", "Дальность"],
    hi: ["पीले क्षेत्र से बाहर निकलें · हरे शत्रु पर वार करें", "बचाव", "पलटवार", "कवच टूटा", "अवसर", "अवसर वार", "गूँज", "गति", "आश्रय", "अवशोषण", "पहुँच"],
    ar: ["غادر المنطقة الكهرمانية · اضرب العدو الأخضر", "تفادٍ", "هجوم مضاد", "كسر", "مكشوف", "استغلال", "صدى", "زخم", "ملجأ", "امتصاص", "مدى"],
  };
  const combatText = (index) => (combatWords[locale] || combatWords.en)[index];
  const dashDescriptions = {
    en:"Dash in your movement direction (toward the nearest enemy when still), gain 0.55s invulnerability, and deal {damage} damage along the path.",
    "zh-Hant":"向移動方向衝刺（靜止時朝最近敵人）、獲得 0.55 秒無敵，對路徑敵人造成 {damage} 傷害。",
    "zh-Hans":"向移动方向冲刺（静止时朝最近敌人）、获得 0.55 秒无敌，对路径敌人造成 {damage} 伤害。",
    ja:"移動方向へダッシュ（静止時は最寄りの敵へ）。0.55秒無敵になり、経路上に{damage}ダメージ。",
    ko:"이동 방향으로 돌진합니다(정지 시 가장 가까운 적). 0.55초 무적, 경로에 피해 {damage}.",
    es:"Corre en la dirección de movimiento (quieta: al enemigo más cercano), gana 0,55 s de invulnerabilidad e inflige {damage} de daño en la ruta.",
    "pt-BR":"Avance na direção do movimento (parada: inimigo mais próximo), ganhe 0,55 s de invulnerabilidade e cause {damage} de dano no caminho.",
    fr:"Foncez dans la direction du mouvement (à l’arrêt : ennemi proche), devenez invulnérable 0,55 s et infligez {damage} dégâts sur le trajet.",
    de:"In Bewegungsrichtung sprinten (im Stand zum nächsten Gegner), 0,55 s unverwundbar sein und {damage} Schaden auf dem Weg verursachen.",
    it:"Scatta nella direzione del movimento (da ferma: nemico vicino), ottieni 0,55 s di invulnerabilità e infliggi {damage} danni sul percorso.",
    ru:"Рывок по движению (стоя — к ближайшему врагу), неуязвимость 0,55 с и {damage} урона на пути.",
    hi:"चलने की दिशा में दौड़ें (रुके हों तो निकटतम शत्रु की ओर), 0.55 सेकंड अभेद्यता और रास्ते में {damage} क्षति।",
    ar:"اندفع باتجاه الحركة (عند الثبات نحو أقرب عدو)، مع حصانة 0.55 ثانية وضرر {damage} على المسار.",
  };
  for(const [language,description] of Object.entries(dashDescriptions)) {
    copy[language] ||= {};
    copy[language].fiaSkillEffect=description;
  }
  const markDescriptions = {
    en:"Deal {damage} damage to the nearest enemy; its next 3 automatic hits each deal +18 damage.",
    "zh-Hant":"對最近敵人造成 {damage} 傷害，對該敵人的接下來 3 次自動攻擊各追加 18 傷害。",
    "zh-Hans":"对最近敌人造成 {damage} 伤害，对该敌人的接下来 3 次自动攻击各追加 18 伤害。",
    ja:"最寄りの敵に{damage}ダメージ。その敵への次の自動攻撃3回に各18ダメージ追加。",
    ko:"가장 가까운 적에게 피해 {damage}. 해당 적을 향한 다음 자동 공격 3회에 각각 피해 +18.",
    es:"Inflige {damage} de daño al enemigo más cercano; los próximos 3 ataques automáticos contra él causan +18 cada uno.",
    "pt-BR":"Cause {damage} de dano ao inimigo mais próximo; os próximos 3 ataques automáticos contra ele causam +18 cada.",
    fr:"Inflige {damage} dégâts à l’ennemi proche ; les 3 prochaines attaques automatiques contre lui infligent chacune +18 dégâts.",
    de:"Dem nächsten Gegner {damage} Schaden zufügen; die nächsten 3 automatischen Treffer gegen ihn verursachen jeweils +18 Schaden.",
    it:"Infliggi {damage} danni al nemico più vicino; i prossimi 3 attacchi automatici contro di lui infliggono +18 ciascuno.",
    ru:"{damage} урона ближайшему врагу; следующие 3 автоудара по нему наносят по +18 урона.",
    hi:"निकटतम शत्रु को {damage} क्षति; उस पर अगले 3 स्वचालित वारों में प्रत्येक को +18 क्षति।",
    ar:"ألحق {damage} ضررًا بأقرب عدو؛ الضربات التلقائية الثلاث التالية عليه تسبب كل منها 18 ضررًا إضافيًا.",
  };
  for(const [language,description] of Object.entries(markDescriptions)) copy[language].orlaSkillEffect=description;
  const buildEffects = {
    en:["Open-enemy damage +35%", "Skill grants 1.4s counter damage", "After dodge: attack interval −32%", "After dodge: guard for 1.1s", "Defeat: recover 3 HP", "Attack range +24"],
    "zh-Hant":["破綻傷害 +35%", "技能給予 1.4 秒反擊增傷", "閃避後攻擊間隔 −32%", "閃避後防護 1.1 秒", "擊敗敵人恢復 3 生命", "攻擊範圍 +24"],
    "zh-Hans":["破绽伤害 +35%", "技能给予 1.4 秒反击增伤", "闪避后攻击间隔 −32%", "闪避后防护 1.1 秒", "击败敌人恢复 3 生命", "攻击范围 +24"],
    ja:["隙のある敵へのダメージ +35%", "スキル後1.4秒間反撃強化", "回避後の攻撃間隔 −32%", "回避後1.1秒間防御", "撃破時に体力3回復", "攻撃範囲 +24"],
    ko:["빈틈 피해 +35%", "스킬 후 1.4초 반격 강화", "회피 후 공격 간격 −32%", "회피 후 1.1초 보호", "처치 시 체력 3 회복", "공격 범위 +24"],
    es:["Daño a enemigos abiertos +35%", "Habilidad: contraataque durante 1,4 s", "Tras esquivar: intervalo −32%", "Tras esquivar: guardia 1,1 s", "Derrota: recupera 3 PV", "Alcance de ataque +24"],
    "pt-BR":["Dano a inimigos abertos +35%", "Habilidade: contra-ataque por 1,4 s", "Após esquiva: intervalo −32%", "Após esquiva: guarda por 1,1 s", "Derrota: recupera 3 PV", "Alcance de ataque +24"],
    fr:["Dégâts aux ennemis ouverts +35%", "Compétence : contre pendant 1,4 s", "Après esquive : intervalle −32%", "Après esquive : garde 1,1 s", "Élimination : récupère 3 PV", "Portée d’attaque +24"],
    de:["Schaden gegen offene Gegner +35%", "Fähigkeit: 1,4 s Konterbonus", "Nach Ausweichen: Intervall −32%", "Nach Ausweichen: 1,1 s Schutz", "Besiegen: 3 LP heilen", "Angriffsreichweite +24"],
    it:["Danni ai nemici aperti +35%", "Abilità: contrattacco per 1,4 s", "Dopo schivata: intervallo −32%", "Dopo schivata: guardia 1,1 s", "Sconfitta: recupera 3 PV", "Portata d’attacco +24"],
    ru:["Урон по открытым врагам +35%", "Умение: контрурон на 1,4 с", "После уклонения: интервал −32%", "После уклонения: защита на 1,1 с", "Победа над врагом: +3 ОЗ", "Дальность атаки +24"],
    hi:["खुले शत्रु पर क्षति +35%", "कौशल: 1.4 सेकंड पलटवार बोनस", "बचाव के बाद: वार अंतराल −32%", "बचाव के बाद: 1.1 सेकंड रक्षा", "शत्रु हारने पर: 3 स्वास्थ्य वापस", "वार की पहुँच +24"],
    ar:["ضرر العدو المكشوف +35%", "المهارة: ضرر مضاد لمدة 1.4 ثانية", "بعد التفادي: فاصل الهجوم −32%", "بعد التفادي: حماية 1.1 ثانية", "هزيمة عدو: استعادة 3 صحة", "مدى الهجوم +24"],
  };
  function buildDescription(trait) {
    return (buildEffects[locale] || buildEffects.en)[["exploit","echo","momentum","refuge","siphon","reach"].indexOf(trait)];
  }
  function combatNotice(index) {
    run.combatMessage = combatText(index);
    run.combatMessageTime = .85;
  }
  function interrupt(enemy) {
    run.hazards = run.hazards.filter((hazard) => hazard.owner !== enemy);
    enemy.warning = 0;
    enemy.stun = .5;
    enemy.open = Math.max(enemy.open || 0, 1.5);
    enemy.cd = Math.max(enemy.cd || 0, 1.7);
    if(enemy.bossRule==="prism")enemy.guard=0;
  }
  function hazardContains(hazard, point) {
    const distance = Math.hypot(point.x - hazard.x, point.y - hazard.y);
    if (hazard.kind === "ring") return distance >= hazard.inner && distance <= hazard.radius;
    if (hazard.kind === "line") {
      const dx = hazard.toX - hazard.x, dy = hazard.toY - hazard.y;
      const t = Math.max(0, Math.min(1, ((point.x-hazard.x)*dx + (point.y-hazard.y)*dy) / (dx*dx+dy*dy || 1)));
      return Math.hypot(point.x-hazard.x-dx*t, point.y-hazard.y-dy*t) <= hazard.radius;
    }
    return distance <= hazard.radius;
  }
  function prepareAttack(enemy) {
    const boss = enemy.boss;
    const kind = boss ? enemy.bossRule : enemy.type;
    const duration = boss ? 1.15 : enemy.type === "hunter" ? 1.05 : .9;
    const damage = boss ? (enemy.phase === 2 ? 22 : 18) : enemy.elite ? 19 : enemy.type === "boar" ? 17 : 13;
    const add = (shape) => {
      const hazard = { owner: enemy, x: enemy.x, y: enemy.y, radius: 52, kind: "circle", damage, t: duration, duration, ...shape };
      hazard.threatened = hazardContains(hazard, run.leo);
      run.hazards.push(hazard);
    };
    // Targets and trajectories are locked now. None track the hero during wind-up.
    const target = { x: run.leo.x, y: run.leo.y };
    enemy.warning = duration;
    enemy.attackFrom = { x: enemy.x, y: enemy.y };
    enemy.attackTo = null;
    if (kind === "prism" || kind === "crown" && enemy.phase === 1) {
      add({kind:"line", x:40, y:target.y, toX:420, toY:target.y, radius:29});
      add({kind:"line", x:target.x, y:76, toX:target.x, toY:520, radius:29});
    } else if (kind === "shockwave" || kind === "summon" || kind === "crown" && enemy.phase === 0) {
      if(kind==="shockwave" && (enemy.attackCount||0)%2) add({radius:112});
      else add({kind:"ring", inner:66, radius:235});
    } else if (kind === "volley" || kind === "hunter" || kind === "crown") {
      add({...target, radius:boss?60:48});
      if (boss) {
        const side = (enemy.attackCount || 0) % 2 ? 1 : -1;
        add({x:Math.max(45,Math.min(415,target.x+side*115)), y:Math.max(80,target.y-65), radius:55});
        add({x:Math.max(45,Math.min(415,target.x-side*100)), y:Math.min(510,target.y+70), radius:55});
      }
    } else if (kind === "charge" || kind === "boar" || kind === "raven") {
      const distance = Math.hypot(target.x-enemy.x,target.y-enemy.y) || 1;
      const travel = Math.min(distance+45, boss?360:190);
      const end = { x:Math.max(40,Math.min(420,enemy.x+(target.x-enemy.x)/distance*travel)), y:Math.max(80,Math.min(515,enemy.y+(target.y-enemy.y)/distance*travel)) };
      enemy.attackTo = end;
      add({kind:"line",toX:end.x,toY:end.y,radius:boss?39:28});
    } else {
      add({...target,radius:enemy.elite?65:53});
      enemy.attackTo = target;
    }
    enemy.attackCount = (enemy.attackCount || 0) + 1;
    if(kind==="prism")enemy.guard=3;
  }
  function updateEnemies(dt) {
    const liveWarnings = () => run.enemies.filter((enemy) => enemy.hp>0 && enemy.warning>0).length;
    for (const enemy of run.enemies) {
      if (enemy.hp <= 0) continue;
      enemy.cd = Math.max(0, (enemy.cd || 0)-dt);
      enemy.open = Math.max(0, (enemy.open || 0)-dt);
      enemy.stun = Math.max(0, (enemy.stun || 0)-dt);
      enemy.slow = Math.max(0, (enemy.slow || 0)-dt);
      enemy.hitFlash = Math.max(0,(enemy.hitFlash||0)-dt);
      enemy.hitOffsetX = (enemy.hitOffsetX || 0) * Math.max(0,1-dt*14);
      enemy.hitOffsetY = (enemy.hitOffsetY || 0) * Math.max(0,1-dt*14);
      if (enemy.bossRule === "crown") {
        const phase=enemy.hp/enemy.max<.33?2:enemy.hp/enemy.max<.66?1:0;
        if(phase!==enemy.phase) {
          enemy.phase=phase;enemy.guard=phase===1?2:0;
          if(phase===2)for(let i=0;i<2;i++)run.enemies.push({x:worldX(80+i*230),y:110,hp:52,max:52,type:i?"armored":"raven",cd:2+i*.5,guard:i?2:0,animSeed:i*2});
        }
      }
      if (enemy.bossRule === "summon" && !enemy.summoned && enemy.hp/enemy.max < .55) {
        enemy.summoned = true;
        for (let i=0;i<2;i++) run.enemies.push({x:worldX(80+i*230),y:110,hp:45,max:45,type:i?"boar":"scout",cd:1.8+i*.5,guard:0,animSeed:i*2});
      }
      if (enemy.warning>0) {
        enemy.warning = Math.max(0,enemy.warning-dt);
        // The last 160ms is the committed, visible approach to the locked impact.
        if (enemy.attackTo && enemy.warning < .16) {
          const p = 1-enemy.warning/.16;
          enemy.x=enemy.attackFrom.x+(enemy.attackTo.x-enemy.attackFrom.x)*p;
          enemy.y=enemy.attackFrom.y+(enemy.attackTo.y-enemy.attackFrom.y)*p;
        }
        continue;
      }
      if (enemy.stun>0 || enemy.open>0) continue;
      const ex=run.leo.x-enemy.x, ey=run.leo.y-enemy.y;
      const distance=Math.hypot(ex,ey)||1;
      const profile=enemyProfiles[enemy.type] || enemyProfiles.scout;
      const range=enemy.boss?310:enemy.type==="hunter"?270:enemy.type==="boar"?230:160;
      if (distance < range && enemy.cd<=0 && liveWarnings() < (run.stage<=2?2:3)) {
        prepareAttack(enemy);
        continue;
      }
      const speed=(enemy.boss?27:profile.speed*1.3)*(enemy.slow>0?.55:1);
      if (distance>range*.65) {
        const side=enemy.type==="raven"?Math.sin(enemy.animSeed||0)*.55:0;
        enemy.x=Math.max(38,Math.min(422,enemy.x+(ex/distance-ey/distance*side)*speed*dt));
        enemy.y=Math.max(78,Math.min(520,enemy.y+(ey/distance+ex/distance*side)*speed*dt));
      } else if(enemy.type==="hunter"&&distance<115) {
        enemy.x=Math.max(38,Math.min(422,enemy.x-ex/distance*speed*dt));
        enemy.y=Math.max(78,Math.min(520,enemy.y-ey/distance*speed*dt));
      }
    }
    const remaining=[];
    for (const hazard of run.hazards) {
      if (hazard.owner.hp<=0) continue;
      hazard.t-=dt;
      if (hazard.t>0) { remaining.push(hazard); continue; }
      const hit=hazardContains(hazard,run.leo);
      if (hit && run.dashSafe<=0) hurt(hazard.damage);
      else if (hazard.threatened && (!hit || run.dashSafe>0)) {
        run.counter=Math.max(run.counter,2.4);
        run.dodges++;
        if (run.build.refuge) run.guard=Math.max(run.guard,1.1);
        combatNotice(1);
      }
      hazard.owner.warning=0;
      hazard.owner.open=1.35;
      if(hazard.owner.bossRule==="prism")hazard.owner.guard=0;
      hazard.owner.cd=2.2;
      run.fx.push({type:"impact",x:hazard.x,y:hazard.y,t:.22,hazard:{...hazard}});
    }
    run.hazards=remaining;
  }

  function damageEnemy(enemy,amount,source="auto") {
    if(!enemy||enemy.hp<=0) return 0;
    let applied=amount;
    const hadGuard=enemy.guard>0;
    const resisted=enemy.bossRule==="charge"&&!(enemy.open>0);
    const blocked=hadGuard||resisted;
    if(enemy.guard>0){
      applied*=source==="skill"?.65:.25;
      if(source==="skill") enemy.guard=Math.max(0,enemy.guard-1);
    }
    if(resisted)applied*=.65;
    const exposed = enemy.open>0 || run.counter>0;
    if(exposed) { applied*=1.65+run.build.exploit*.35; combatNotice(2); }
    enemy.hp-=applied;
    playSound(blocked ? "combat.block" : run.heroId === "leo" || run.heroId === "fia" ? "weapon.sword.hit" : "magic.hit");
    if (enemy.hp <= 0) {
      playSound("enemy.defeat");
      run.fx.push({type:"defeat",x:enemy.x,y:enemy.y,t:.32,image:enemy.boss?images[`boss-${enemy.bossId}`]:images[`enemy-${enemy.type}`],size:enemy.boss?126:68});
      if(run.build.siphon) run.hp=Math.min(run.maxHp,run.hp+3*run.build.siphon);
    }
    if(source==="skill") {
      interrupt(enemy);
      if(enemy.guard===0 && hadGuard) { combatNotice(3); playSound("combat.shield.break"); }
    }
    const direction = Math.atan2(enemy.y - run.leo.y, enemy.x - run.leo.x);
    enemy.hitFlash = Math.max(enemy.hitFlash || 0, source === "skill" ? 0.24 : 0.16);
    enemy.hitOffsetX = Math.cos(direction) * (source === "skill" ? 9 : 5);
    enemy.hitOffsetY = Math.sin(direction) * (source === "skill" ? 9 : 5);
    run.shake = reducedMotion()?0:Math.max(run.shake, source === "skill" ? 0.12 : 0.025);
    run.heroKick = Math.max(run.heroKick, source === "skill" ? 0.12 : 0.06);
    const enemySize = enemy.boss ? 126 : enemy.elite ? 82 : 68;
    const labelY = enemy.y - enemySize / 2 - 18;
    const nearbyLabels = run.fx.filter((effect) => effect.type === "damage"
      && effect.source !== "hurt"
      && Math.abs((effect.labelY ?? effect.y) - labelY) < 25
      && Math.abs(effect.x - enemy.x) < 64).length;
    const lane = nearbyLabels === 0 ? 0 : (nearbyLabels % 2 ? 1 : -1) * 22;
    const stack = Math.floor((nearbyLabels + 1) / 3);
    run.fx.push({ type: "damage", x: enemy.x + lane, y: labelY - stack * 16, labelY, t: 0.62, vy: -24, value: Math.max(1, Math.round(applied)), source,blocked,strong:exposed });
    return applied;
  }

  function skill() {
    if (!run?.active || run.cool > 0) return;
    beginRangeGuidance();
    if(run.build.echo) run.counter=Math.max(run.counter,1.4);
    playSound(run.heroId === "leo" ? "weapon.sword.swing" : run.heroId === "fia" ? "movement.dash" : "magic.cast");
    if (run.heroId === "leo") {
      run.cool = Math.max(2.5, 5 - run.bless.speed * 0.5);
      run.fx.push({ type: "roar", x: run.leo.x, y: run.leo.y, t: 0.45 });
      for (const enemy of run.enemies) {
        if (Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y) < 145) {
          damageEnemy(enemy,24 + run.bless.power * 7,"skill");
          run.fx.push({ type: "hit", x: enemy.x, y: enemy.y, t: 0.3 });
          run.fx.push({ type: "slash", x: enemy.x, y: enemy.y, fromX: run.leo.x, fromY: run.leo.y, t: 0.2 });
        }
      }
      return;
    }
    if (run.heroId === "fia") {
      run.cool = Math.max(2.2, 4.2 - run.bless.speed * 0.45);
      const skillTarget = [...run.enemies].sort((a, b) => Math.hypot(a.x - run.leo.x, a.y - run.leo.y) - Math.hypot(b.x - run.leo.x, b.y - run.leo.y))[0];
      let { x: dx, y: dy } = movementIntent();
      if (skillTarget && !dx && !dy) {
        dx = skillTarget.x - run.leo.x;
        dy = skillTarget.y - run.leo.y;
      }
      if (!dx && !dy) dy = -1;
      const length = Math.hypot(dx, dy) || 1;
      const from = { ...run.leo };
      run.leo.x = Math.max(worldX(35), Math.min(worldX(355), run.leo.x + (dx / length) * 125));
      run.leo.y = Math.max(80, Math.min(520, run.leo.y + (dy / length) * 125));
      run.invulnerable = 0.55;
      run.dashSafe = 0.55;
      run.fx.push({ type: "roar", x: (from.x + run.leo.x) / 2, y: (from.y + run.leo.y) / 2, t: 0.3 });
      for (const enemy of run.enemies) {
        if (hazardContains({kind:"line",x:from.x,y:from.y,toX:run.leo.x,toY:run.leo.y,radius:52},enemy)) {
          damageEnemy(enemy,30 + run.bless.power * 6,"skill");
          run.fx.push({ type: "hit", x: enemy.x, y: enemy.y, t: 0.25 });
          run.fx.push({ type: "slash", x: enemy.x, y: enemy.y, fromX: from.x, fromY: from.y, t: 0.2 });
        }
      }
      return;
    }
    if (run.heroId === "orla") {
      run.cool = Math.max(2.5, 4.8 - run.bless.speed * 0.45);
      const target = [...run.enemies].sort((a, b) => Math.hypot(a.x - run.leo.x, a.y - run.leo.y) - Math.hypot(b.x - run.leo.x, b.y - run.leo.y))[0];
      if (target) {
        damageEnemy(target,24 + run.bless.power * 5,"skill");
        target.marked = 3;
        run.fx.push({ type: "roar", x: target.x, y: target.y, t: 0.4 });
        run.fx.push({ type: "slash", x: target.x, y: target.y, fromX: run.leo.x, fromY: run.leo.y, t: 0.24 });
      }
      return;
    }
    run.cool = Math.max(3.2, 6 - run.bless.speed * 0.45);
    run.guard = 3.5;
    run.hp = Math.min(run.maxHp, run.hp + 8 + run.bless.heal * 2);
    run.fx.push({ type: "roar", x: run.leo.x, y: run.leo.y, t: 0.55 });
    for (const enemy of run.enemies) {
      if (Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y) < 220) {
        damageEnemy(enemy,20 + run.bless.power * 4,"skill");
        run.fx.push({ type: "hit", x: enemy.x, y: enemy.y, t: 0.3 });
        run.fx.push({ type: "slash", x: enemy.x, y: enemy.y, fromX: run.leo.x, fromY: run.leo.y, t: 0.2 });
      }
    }
  }

  function dodge() {
    if(!run?.active || run.dodgeCool>0 || run.dodgeMotion)return;
    let {x,y}=movementIntent();
    if(!x&&!y){x=run.lastMoveX;y=run.lastMoveY||-1;}
    const length=Math.hypot(x,y)||1;
    run.dodgeMotion={fromX:run.leo.x,fromY:run.leo.y,x:x/length,y:y/length,t:0};
    run.dodgeCool=3.1;
    run.dashSafe=Math.max(run.dashSafe,.24);
    playSound('movement.dash');
    beginRangeGuidance();
  }

  function hurt(amount) {
    if (run.invulnerable > 0) return;
    const roleReduction = run.heroId === "taro" ? 0.76 : 1;
    const applied = run.guard > 0 ? Math.ceil(amount * 0.3) : Math.ceil(amount * roleReduction);
    run.hp -= applied;
    run.invulnerable = .38;
    run.counter = 0;
    playSound(run.guard>0?"combat.block":"player.hurt");
    run.heroFlash = Math.max(run.heroFlash, 0.24);
    run.shake = reducedMotion()?0:Math.max(run.shake, 0.14);
    run.fx.push({ type: "damage", x: run.leo.x, y: run.leo.y - (run.heroId === "taro" ? 39 : 45) - 20, t: 0.7, vy: -24, value: applied, source: "hurt" });
    run.fx.push({ type: "shadow", x: run.leo.x, y: run.leo.y, t: 0.34 });
  }

  function selectAttackTarget(enemies,player,range=Infinity) {
    let target = null;
    let distance = Infinity;
    for (const enemy of enemies) {
      const current = Math.hypot(enemy.x - player.x, enemy.y - player.y);
      if(enemy.hp<=0 || current>range) continue;
      if (!target || (enemy.marked && !target.marked) || (Boolean(enemy.marked) === Boolean(target.marked) && current < distance)) {
        distance = current;
        target = enemy;
      }
    }
    return target;
  }

  function autoAttack() {
    if(run.strike || run.attackCool>0) return;
    const hero = heroes[run.heroId];
    const target=selectAttackTarget(run.enemies,run.leo,hero.range+run.build.reach*24);
    if (!target) return;
    let damage = hero.attack + run.bless.power * 2;
    if (target.marked) {
      damage += 18;
      target.marked -= 1;
    }
    // A short committed strike makes preparation, travel and contact distinct.
    run.strike={target,damage,t:.13,duration:.13,fromX:run.leo.x,fromY:run.leo.y};
    playSound(run.heroId==="leo"||run.heroId==="fia"?"weapon.sword.swing":"magic.cast");
    run.attackCool=(run.heroId==="fia"?.46:run.heroId==="orla"?.78:run.heroId==="taro"?.9:.64)*(run.build.momentum&&run.counter>0?.68:1);
  }

  function resolveStrike(dt) {
    const strike=run.strike;
    if(!strike) return;
    strike.t-=dt;
    if(strike.t>0) return;
    run.strike=null;
    const target=strike.target;
    if(target.hp<=0 || Math.hypot(target.x-run.leo.x,target.y-run.leo.y)>heroes[run.heroId].range+run.build.reach*24+26) return;
    const damage=strike.damage;
    damageEnemy(target,damage,"auto");
    if (run.room === 1 && !run.firstAutoAttack) {
      run.firstAutoAttack = true;
      run.guidancePhase = "hit";
      run.guidanceTimer = 1.5;
      updateGuidanceHint();
    }
    if (run.heroId === "leo") {
      for (const enemy of run.enemies) {
        if (enemy !== target && Math.hypot(enemy.x - target.x, enemy.y - target.y) < 82) {
          damageEnemy(enemy, Math.ceil(damage * 0.55), "auto");
        }
      }
    }
    if (run.heroId === "taro") target.slow = 1.1;
    run.fx.push({ type: "hit", x: target.x, y: target.y, t: 0.22 });
    run.fx.push({ type: "slash", x: target.x, y: target.y, fromX: run.leo.x, fromY: run.leo.y, t: 0.18 });
  }

  function chooseBlessing() {
    run.active = false;
    trackTrialEvent("room_complete", {
      stage: run.stage,
      room: run.room,
      hero_id: run.heroId,
      hp: Math.max(0, Math.round(run.hp)),
      max_hp: run.maxHp,
    });
    playSound("feedback.success");
    renderBlessings(false);
    setChoiceModal(true);
  }

  function blessingPool(rerolled) {
    if (rerolled) {
      return [
        { id: "power", amount: 2, img: "animal-hero-trials-icon-roaring-mane.webp", name: localizedValue("Sovereign Courage", "王者勇氣", "Valor Soberano", "شجاعة السيّد"), copy: localizedValue("Attack power +2", "攻擊威力 +2", "Poder de ataque +2", "قوة الهجوم +2") },
        { id: "speed", amount: 2, img: "animal-hero-trials-icon-comet-dash.webp", name: localizedValue("Comet Tempo", "彗星節奏", "Tempo de Cometa", "إيقاع المذنب"), copy: localizedValue("Cooldown -1.0s", "冷卻時間 -1.0 秒", "Recarga -1,0 s", "التهدئة -1.0 ثانية") },
        { id: "heal", amount: 2, img: "animal-hero-trials-icon-moon-mark.webp", name: localizedValue("Full Moon Recovery", "滿月復甦", "Recuperación de Luna Llena", "تعافي البدر"), copy: localizedValue("Recover 48 HP", "恢復 48 生命", "Recupera 48 PV", "استعد 48 من الصحة") },
      ];
    }
    return [
      { id: "power", amount: 1, img: "animal-hero-trials-icon-roaring-mane.webp", name: localizedValue("Roaring Power", "怒吼之力", "Poder del Rugido", "قوة الزئير"), copy: localizedValue("Attack power +1", "攻擊威力 +1", "Poder de ataque +1", "قوة الهجوم +1") },
      { id: "speed", amount: 1, img: "animal-hero-trials-icon-comet-dash.webp", name: localizedValue("Comet Rhythm", "彗星律動", "Ritmo de Cometa", "إيقاع المذنب"), copy: localizedValue("Cooldown -0.5s", "冷卻時間 -0.5 秒", "Recarga -0,5 s", "التهدئة -0.5 ثانية") },
      { id: "heal", amount: 1, img: "animal-hero-trials-icon-moon-mark.webp", name: localizedValue("Moon Recovery", "月光恢復", "Recuperación Lunar", "تعافي القمر"), copy: localizedValue("Recover 24 HP", "恢復 24 生命", "Recupera 24 PV", "استعد 24 من الصحة") },
    ];
  }

  function renderBlessings(rerolled) {
    blessingDecisionCommitted = false;
    const options = blessingPool(rerolled);
    const branches=[["exploit","echo"],["momentum","reach"],["refuge","siphon"]];
    const wordIndex={exploit:5,echo:6,momentum:7,refuge:8,siphon:9,reach:10};
    options.forEach((option,index)=>{
      option.trait=branches[index][((run.buildSeed >>> ((run.room-1)*3+index)) & 1) ^ (rerolled?1:0)];
      option.name=combatText(wordIndex[option.trait]);
      option.copy += ` · ${buildDescription(option.trait)}`;
    });
    const box = $("#choices");
    box.innerHTML = "";
    for (const option of options) {
      const button = document.createElement("button");
      button.className = "choice";
      button.dataset.nativeLocalized = "true";
      button.innerHTML = `<img src="${ASSET_ROOT + option.img}" alt=""><span><b>${option.name}</b><br><small>${option.copy}</small></span>`;
      button.onclick = () => {
        if (blessingDecisionCommitted || $("#choiceModal").classList.contains("hidden")) return;
        blessingDecisionCommitted = true;
        clearRerollConfirmation();
        playSound("reward.upgrade");
        trackTrialEvent("blessing_pick", {
          stage: run.stage,
          room: run.room,
          hero_id: run.heroId,
          blessing_id: option.id,
          rerolled,
        });
        run.bless[option.id] += option.amount;
        run.build[option.trait] += 1;
        if (option.id === "heal") run.hp = Math.min(run.maxHp, run.hp + 24 * option.amount);
        setChoiceModal(false, false);
        run.room += 1;
        run.active = true;
        spawn();
        run.last = performance.now();
        loop(performance.now());
        sceneFrame("battle", () => $("#game").focus({ preventScroll: true }));
      };
      box.append(button);
    }
    updateRerollUi();
  }

  function updateRerollUi(message = "") {
    const balance = window.WeightPlayWallet?.read?.().diamonds || 0;
    const result = Math.max(0, balance - 3);
    const button = $("#rerollBtn");
    const status = message || (run.rerollUsed
      ? t("rerollUsed")
      : balance < 3
        ? interpolate("rerollNeed", { balance })
        : run.rerollPending
          ? interpolate("rerollConfirmStatus", { balance, result })
          : "");
    $("#rerollLabel").textContent = run.rerollPending ? `${t("reroll")} · ${balance} → ${result}` : `${t("reroll")} · ${balance}`;
    button.disabled = practiceIsolation || run.rerollUsed;
    button.classList.toggle("is-confirming", Boolean(run.rerollPending && !run.rerollUsed));
    button.setAttribute("aria-label", status || `${t("reroll")} · 3 Diamonds · ${balance}`);
    $("#rerollStatus").textContent = status;
  }

  function clearRerollConfirmation() {
    clearTimeout(rerollConfirmTimer);
    rerollConfirmTimer = 0;
    rerollConfirmDueAt = 0;
    rerollConfirmRemaining = 0;
    rerollConfirmGeneration = 0;
    if (run) run.rerollPending = false;
  }

  function expireRerollConfirmation() {
    if (activeScene !== "battle" || rerollConfirmGeneration !== sceneGeneration) return clearRerollConfirmation();
    rerollConfirmTimer = 0;
    rerollConfirmDueAt = 0;
    rerollConfirmRemaining = 0;
    if (!run?.rerollPending) return;
    run.rerollPending = false;
    updateRerollUi();
  }

  function armRerollConfirmation(delay = 5000) {
    clearTimeout(rerollConfirmTimer);
    rerollConfirmRemaining = Math.max(0, Number(delay) || 0);
    rerollConfirmGeneration = sceneGeneration;
    if (!rerollConfirmRemaining) return expireRerollConfirmation();
    rerollConfirmDueAt = performance.now() + rerollConfirmRemaining;
    rerollConfirmTimer = setTimeout(expireRerollConfirmation, rerollConfirmRemaining);
  }

  function suspendRerollConfirmation() {
    if (!run?.rerollPending || !rerollConfirmTimer) return;
    rerollConfirmRemaining = Math.max(0, rerollConfirmDueAt - performance.now());
    clearTimeout(rerollConfirmTimer);
    rerollConfirmTimer = 0;
    rerollConfirmDueAt = 0;
  }

  function resumeRerollConfirmation() {
    if (!run?.rerollPending || rerollConfirmTimer || document.hidden || !windowHasFocus || activeScene !== "battle") return;
    armRerollConfirmation(rerollConfirmRemaining);
  }

  function rerollBlessings() {
    if (window.WeightPlayWallet?.withTransaction && !window.WeightPlayWallet.inTransaction()) return window.WeightPlayWallet.withTransaction("animal-hero-trials:game.js:rerollBlessings", () => rerollBlessings(...arguments));

    if(practiceIsolation || practiceRequested)return;
    if (run.rerollUsed) return updateRerollUi(t("rerollUsed"));
    const balance = window.WeightPlayWallet?.read?.().diamonds || 0;
    if (balance < 3) return updateRerollUi(interpolate("rerollNeed", { balance }));
    if (!run.rerollPending) {
      run.rerollPending = true;
      armRerollConfirmation(5000);
      updateRerollUi();
      return;
    }
    clearRerollConfirmation();
    if (!window.WeightPlayWallet?.spendDiamonds?.(3)) {
      return updateRerollUi(interpolate("rerollNeed", { balance: window.WeightPlayWallet?.read?.().diamonds || 0 }));
    }
    run.rerollUsed = true;
    playSound("reward.coin");
    renderBlessings(true);
    updateRerollUi(t("rerollDone"));
    window.WonderAnalytics?.track?.("diamond_spend", {
      game_id: "animal-hero-trials",
      item: "blessing_reroll",
      cost: 3,
      balance: window.WeightPlayWallet.read().diamonds,
    });
  }

  function finish(won) {
    if(!run || run.settled)return;
    run.settled=true;
    (__wpNotifyMeasurement(), backgroundSuspended = false);
    run.active = false;
    cancelAnimationFrame(frame);
    resultDecisionCommitted = false;
    (__wpNotifyMeasurement(), $("#resultHome").hidden = false);
    $("#resultHome").disabled = false;
    (__wpNotifyMeasurement(), $("#resultNext").hidden = false);
    $("#resultNext").disabled = !won || run.stage >= TRIAL_COUNT;
    (__wpNotifyMeasurement(), resultReplay.hidden = false);
    resultReplay.disabled = false;
    $("#resultHome").textContent = t("stages");
    $("#resultNext").textContent = t("next");
    resultReplay.textContent = t("replay");
    (__wpNotifyMeasurement(), $("#resultHome").setAttribute("aria-label", t("stages")));
    (__wpNotifyMeasurement(), $("#resultNext").setAttribute("aria-label", t("next")));
    (__wpNotifyMeasurement(), resultReplay.setAttribute("aria-label", t("replay")));
    const resultPrimary = won && run.stage < TRIAL_COUNT
      ? $("#resultNext")
      : won
        ? $("#resultHome")
        : resultReplay;
    [$("#resultHome"), $("#resultNext"), resultReplay].forEach((button) => {
      button.classList.toggle("primary", button === resultPrimary);
    });
    $("#resultHome").onclick = () => commitResultDecision(() => {
      playSound("ui.click");
      show("stage");
      focusStage(Math.min(TRIAL_COUNT, unlocked));
    });
    resultReplay.onclick = () => commitResultDecision(() => {
      trackTrialEvent("trial_replay", { stage: run.stage, hero_id: run.heroId });
      __wpReplayStart(() => startTrial(run.stage, "replay"));
    });
    if (won) {
      const gain = practiceIsolation?0:run.definition.reward;
      const previousUnlocked = unlocked;
      marks += gain;
      if(!practiceIsolation) unlocked = Math.max(unlocked, Math.min(TRIAL_COUNT, run.stage + 1));
      save();
      const masteryCost = 5 + mastery * 4;
      const remaining = Math.max(0, masteryCost - marks);
      const unlockCopy = run.stage >= TRIAL_COUNT
        ? t("allTrialsUnlocked")
        : interpolate(unlocked > previousUnlocked ? "trialUnlocked" : "trialAvailable", { next: run.stage + 1 });
      const masteryCopy = remaining === 0
        ? t("masteryReady")
        : interpolate("masteryNeed", { remaining });
      trackTrialEvent("trial_success", {
        stage: run.stage,
        room: run.room,
        hero_id: run.heroId,
        marks_earned: gain,
        total_marks: marks,
      });
      if (unlocked > previousUnlocked) {
        trackTrialEvent("next_trial_unlock", {
          stage: run.stage,
          hero_id: run.heroId,
          unlocked_trial: unlocked,
        });
      }
      $("#resultTitle").textContent = t("win");
      $("#resultCopy").textContent = `${interpolate("earnedMarks", { gain, total: marks })} ${unlockCopy} ${masteryCopy}`;
      $("#resultNext").onclick = () => {
        if (run.stage < TRIAL_COUNT) commitResultDecision(() => startTrial(run.stage + 1, "next_trial"));
      };
    } else {
      $("#resultTitle").textContent = t("fail");
      $("#resultCopy").textContent = locale === "zh-Hant"
        ? `${heroName(run.heroId)}\u9700\u8981\u518d\u8a66\u4e00\u6b21\u3002`
        : interpolate("failCopy", { hero: heroName(run.heroId) });
      trackTrialEvent("trial_failure", {
        stage: run.stage,
        room: run.room,
        hero_id: run.heroId,
        marks_total: marks,
      });
      $("#resultNext").onclick = null;
    }
    $("#resultFx").src=ASSET_ROOT+heroes[run.heroId].asset;
    setResultModal(true, resultPrimary);
    playSound(won ? "result.win" : "result.lose");

    __wpMeasurement.ended = true; __wpMeasurement.outcome = (won ? "win" : "lose"); if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}

  function loop(now) {
    if (!run?.active) return;
    const dt = Math.min(0.033, (now - run.last) / 1000);
    run.last = now;
    run.time += dt;
    run.counter=Math.max(0,run.counter-dt);
    run.combatMessageTime=Math.max(0,run.combatMessageTime-dt);
    const { x: dx, y: dy } = movementIntent();
    const length = Math.hypot(dx, dy) || 1;
    const moving = Boolean(dx || dy);
    const heroSpeed = heroes[run.heroId].speed;
    const dash=run.dodgeMotion;
    const vx=dash?dash.x*620:dx/length*heroSpeed,vy=dash?dash.y*620:dy/length*heroSpeed;
    run.leo.x = Math.max(worldX(35), Math.min(worldX(355), run.leo.x + vx * dt));
    run.leo.y = Math.max(80, Math.min(520, run.leo.y + vy * dt));
    if(dash){dash.t+=dt;if(dash.t>=.18)run.dodgeMotion=null;}
    run.dodgeCool=Math.max(0,run.dodgeCool-dt);
    const dodgeButton=$('#dodgeBtn');
    if(dodgeButton){dodgeButton.disabled=run.dodgeCool>0;dodgeButton.querySelector('span').textContent=run.dodgeCool>0?`${run.dodgeCool.toFixed(1)}s`:controlText(1);}
    if (moving) {
      run.stepPhase += dt * (heroSpeed / 18);
      run.lastMoveX = dx / length;
      run.lastMoveY = dy / length;
    } else {
      run.stepPhase += dt * 1.3;
      run.lastMoveX *= 0.82;
      run.lastMoveY *= 0.82;
    }
    run.cool = Math.max(0, run.cool - dt);
    run.attackCool = Math.max(0, run.attackCool - dt);
    run.invulnerable = Math.max(0, run.invulnerable - dt);
    run.dashSafe = Math.max(0, run.dashSafe - dt);
    run.guard = Math.max(0, run.guard - dt);
    run.heroFlash = Math.max(0, run.heroFlash - dt);
    run.heroKick = Math.max(0, run.heroKick - dt);
    run.shake = Math.max(0, run.shake - dt);
    if (run.guidanceTimer > 0) {
      run.guidanceTimer = Math.max(0, run.guidanceTimer - dt);
      if (run.guidanceTimer === 0) {
        run.guidancePhase = "done";
        updateGuidanceHint();
      }
    }

    updateEnemies(dt);
    resolveStrike(dt);
    autoAttack();
    run.enemies = run.enemies.filter((enemy) => enemy.hp > 0);
    run.fx.forEach((effect) => {
      effect.t -= dt;
      if (effect.type === "damage") {
        if(!reducedMotion()) effect.y += (effect.vy || -30) * dt;
        effect.vy = (effect.vy || -30) + 58 * dt;
      }
    });
    run.fx = run.fx.filter((effect) => effect.t > 0).slice(-32);
    if (run.hp <= 0) return finish(false);
    if (!run.enemies.length) return run.room >= 3 ? finish(true) : chooseBlessing();
    draw();
    updateHud();
    frame = requestAnimationFrame(loop);
  }

  function hazardPath(hazard) {
    ctx.beginPath();
    if(hazard.kind==="line") {
      const angle=Math.atan2(hazard.toY-hazard.y,hazard.toX-hazard.x);
      const px=-Math.sin(angle)*hazard.radius,py=Math.cos(angle)*hazard.radius;
      ctx.moveTo(hazard.x+px,hazard.y+py);
      ctx.lineTo(hazard.toX+px,hazard.toY+py);
      ctx.arc(hazard.toX,hazard.toY,hazard.radius,angle+Math.PI/2,angle-Math.PI/2,true);
      ctx.lineTo(hazard.x-px,hazard.y-py);
      ctx.arc(hazard.x,hazard.y,hazard.radius,angle-Math.PI/2,angle+Math.PI/2,true);
      ctx.closePath();
    } else {
      ctx.arc(hazard.x,hazard.y,hazard.radius,0,Math.PI*2);
      if(hazard.kind==="ring") {
        ctx.moveTo(hazard.x+hazard.inner,hazard.y);
        ctx.arc(hazard.x,hazard.y,hazard.inner,0,Math.PI*2,true);
      }
    }
  }
  // Simulation owns outcomes. This renderer owns only bounded presentation.
  function createBattle3D(THREE) {
    const {Scene,Group,Color,Mesh,BoxGeometry,MeshStandardMaterial,MeshBasicMaterial,
      OrthographicCamera,WebGLRenderer,AmbientLight,DirectionalLight,HemisphereLight,
      InstancedMesh,Object3D,RingGeometry,SRGBColorSpace,ACESFilmicToneMapping}=THREE;
    const surface=document.createElement('canvas');
    surface.className='hero-world-3d'; surface.setAttribute('aria-hidden','true');
    canvas.before(surface);
    const renderer=new WebGLRenderer({canvas:surface,antialias:true,alpha:false,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    renderer.outputColorSpace=SRGBColorSpace;
    renderer.toneMapping=ACESFilmicToneMapping; renderer.toneMappingExposure=1.18;
    renderer.shadowMap.enabled=true;
    const scene=new Scene(); scene.background=new Color('#102b31');
    const camera=new OrthographicCamera(-230,230,280,-280,1,2400);
    camera.position.set(0,820,950); camera.lookAt(0,0,0);
    const elevation=820/Math.hypot(820,950);
    scene.add(new HemisphereLight('#c9e4ec','#172a42',1.65));
    scene.add(new AmbientLight('#93b9db',.35));
    const sun=new DirectionalLight('#ffe4b7',2.7);sun.position.set(-220,600,180);
    sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
    Object.assign(sun.shadow.camera,{left:-850,right:850,top:850,bottom:-850,near:1,far:1600});
    sun.shadow.bias=-.001;scene.add(sun);
    const rim=new DirectionalLight('#64e9ed',1.5);rim.position.set(200,160,-300);scene.add(rim);
    const contour=new THREE.Shape();contour.moveTo(-.47,-.47);contour.lineTo(.47,-.47);contour.lineTo(.47,.47);contour.lineTo(-.47,.47);contour.closePath();
    const unit=new THREE.ExtrudeGeometry(contour,{depth:.94,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.03,bevelThickness:.03});unit.translate(0,0,-.47);
    const ringGeometry=new RingGeometry(.87,1,48);
    const materials=new Map();
    function material(color,glow=0){
      const key=`${color}/${glow}`;
      if(!materials.has(key))materials.set(key,new MeshStandardMaterial({color,roughness:.72,metalness:glow?.25:.08,emissive:color,emissiveIntensity:glow}));
      return materials.get(key);
    }
    function box(parent,x,y,z,w,h,d,color,glow=0){
      const mesh=new Mesh(unit,material(color,glow));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);
      mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
    }
    function ring(parent,r,color){
      const mesh=new Mesh(ringGeometry,new MeshBasicMaterial({color,transparent:true,opacity:.72,depthWrite:false}));
      mesh.rotation.x=-Math.PI/2;mesh.position.y=2;mesh.scale.setScalar(r);parent.add(mesh);return mesh;
    }
    const environment=new Group();scene.add(environment);
    const palette=[['#354d50','#3e5658','#142d37'],['#32495d','#3b5368','#21334f'],['#55423f','#634d44','#382b35'],['#3b4160','#484e6d','#222a49'],['#294b59','#355764','#152e44'],['#403b58','#4f4666','#24223f']];
    let width=460,height=560,region=-1;
    function ground(){
      environment.children.slice().forEach(node=>{environment.remove(node);if(node.isInstancedMesh)node.dispose();});
      const colors=palette[Math.max(0,region)];
      const cols=Math.ceil(width/64)+2,rows=Math.ceil(height/elevation/48)+2;
      const dummy=new Object3D();
      for(let tone=0;tone<4;tone++){
        const stone=new Color(colors[tone%2]);stone.multiplyScalar(tone<2?1:.88);
        const tiles=new InstancedMesh(unit,material('#'+stone.getHexString()),Math.ceil(cols*rows/2)+1);let n=0;
        for(let x=0;x<cols;x++)for(let z=0;z<rows;z++)if((x*7+z*11)%4===tone){
          dummy.position.set((x-(cols-1)/2)*64+(z%2)*22,-8,(z-(rows-1)/2)*48);
          dummy.scale.set(62,12+((x*7+z*3)%3)*.5,46);dummy.updateMatrix();tiles.setMatrixAt(n++,dummy.matrix);
        }
        tiles.count=n;tiles.receiveShadow=true;environment.add(tiles);
      }
      // Authored gate and stepped garden architecture frame, never cover, combat.
      for(const side of [-1,1]){
        const x=side*(width/2-20);
        for(let i=0;i<5;i++){
          const z=(i/4-.5)*height/elevation;
          box(environment,x,7,z,32,24,34,'#284b48');
          box(environment,x,22,z,25,12,27,'#658579');
          box(environment,x,31,z,18,8,18,'#397e63');
          box(environment,x+side*4,40,z,7,13,8,'#84b97a');
          if(i%2===0){box(environment,x,53,z,8,20,8,'#86e9db',1);box(environment,x,40,z,14,5,14,'#c5b879');}
        }
        // Original stepped trees live beyond the reachable combat boundary.
        for(let i=0;i<3;i++){
          const tx=side*(width/2-7),tz=(i-1)*height/elevation*.34;
          box(environment,tx,23,tz,15,50,17,'#5d5544');
          box(environment,tx,48,tz,62,28,56,'#274f4c');
          box(environment,tx-side*5,69,tz-3,47,23,43,'#397365');
          box(environment,tx,86,tz-7,27,16,29,'#699e77');
          box(environment,tx-side*15,58,tz+22,20,13,17,'#4c8a6d');
        }
      }
      // Embedded brass masonry makes a readable arena rather than a blank grid.
      for(let i=-2;i<=2;i++){
        box(environment,i*35,-.2,0,28,1,4,'#a1aa80');
        box(environment,i*35,-.2,-180,28,1,4,'#718e83');
        box(environment,i*35,-.2,180,28,1,4,'#718e83');
      }
      for(let i=0;i<36;i++){
        const side=i%2?1:-1,x=side*(width/2-12-(i%3)*5),z=((i*17)%37/37-.5)*height/elevation;
        box(environment,x,3,z,7,6,10,i%3?'#588473':'#83a57f');
        if(i%4===0){box(environment,x,10,z,3,12,3,'#accb8e');box(environment,x+2,16,z,6,4,6,'#e5c789');}
      }
      const gateZ=-height/elevation/2+86;
      for(const side of [-1,1]){
        box(environment,side*83,35,gateZ,27,76,30,'#324f52');
        box(environment,side*83,77,gateZ,34,12,36,'#a4ac88');
        box(environment,side*83,95,gateZ,10,23,12,'#9aead6',.6);
      }
      box(environment,0,77,gateZ,150,16,25,'#536f69');
      box(environment,0,88,gateZ,65,8,28,'#b0b98f');
      box(environment,0,39,gateZ-7,120,74,4,'#397b85',.35);
      for(let i=0;i<7;i++)box(environment,(i-3)*16,39,gateZ-3,3,60-(i%3)*9,3,'#75c6c9',.65);
    }
    function character(kind,boss=false,variant=''){
      const root=new Group(),body=new Group();root.add(body);
      const hero=['leo','fia','orla','taro'].includes(kind);
      const skin={leo:'#e7b253',fia:'#dc773f',orla:'#b8add6',taro:'#85ac62',scout:'#657c9a',raven:'#7973b6',boar:'#a66c6f',hunter:'#8b89b1',armored:'#6e9b9b'}[kind]||'#7970a7';
      const dark={leo:'#93542e',fia:'#713c48',orla:'#514875',taro:'#3d6858'}[kind]||'#34344f';
      const cloth=hero?'#267e7b':'#343d63';
      box(body,0,20,0,25,25,19,cloth);
      box(body,0,25,10,17,13,3,hero?'#e4c47a':'#8e79ae');
      box(body,0,7,0,24,5,20,dark);
      box(body,0,12,11,23,4,3,dark);box(body,0,12,14,6,6,3,'#d5b671');
      const legs=[];
      for(const side of [-1,1]){
        legs.push(box(body,side*8,5,2,10,12,13,dark));
        box(body,side*8,1,5,12,5,16,hero?'#334e59':'#252d46');
        box(body,side*17,20,0,9,20,10,skin);
        box(body,side*17,12,3,10,7,12,dark);
        box(body,side*17,30,0,12,6,13,hero?'#b6cfc1':'#606b87');
        box(body,side*8,6,8,6,6,3,'#819ca0');
      }
      box(body,0,43,0,32,28,26,skin);
      box(body,0,35,13,22,11,10,hero?'#f1dbaf':'#a6a4bc');
      box(body,0,39,19,7,5,4,dark);
      // Deliberately faceted brow, inset expressive eyes and tiny catchlights.
      for(const side of [-1,1]){
        box(body,side*8,47,13.8,8,8,2,'#eef7e8');
        box(body,side*7,46,15.2,4,6,2,'#162635');
        box(body,side*6,48,16.4,1.6,1.6,1,'#ffffff');
        const brow=box(body,side*8,53,15,10,3,3,dark);brow.rotation.z=side*.12;
      }
      const accent=hero?'#f6d781':boss?'#f2b370':'#9cb6e4';
      if(kind==='leo'){
        for(let i=0;i<11;i++){
          const a=i/11*Math.PI*2;
          const mane=box(body,Math.cos(a)*23,44+Math.sin(a)*24,-4,12,13,18,i%2?'#d98432':'#f3be54',.08);
          mane.rotation.z=a*.16;
        }
        box(body,-7,64,0,6,10,7,'#ffe29a',.2);box(body,7,64,0,6,10,7,'#ffe29a',.2);
        box(body,0,16,-14,22,27,4,'#1f6d70');
      }else if(kind==='fia'){
        for(const side of [-1,1]){box(body,side*12,62,0,10,17,10,skin);box(body,side*12,62,5,5,9,2,'#f9d3a3');box(body,side*17,13,7,4,4,2,'#f9dc72',.6);}
        box(body,0,29,0,31,5,23,'#f7bd58');box(body,18,19,-13,8,23,5,'#eabb65');
        const tail=box(body,8,14,-22,12,14,28,skin);tail.rotation.x=-.5;box(body,8,20,-36,12,11,10,'#f3e3bc');
      }else if(kind==='orla'){
        box(body,0,60,0,40,5,33,'#444b85');box(body,-3,70,-2,25,18,25,'#5c5795');box(body,-7,82,-2,16,8,16,'#7466b0');
        box(body,5,71,12,7,10,3,'#ffe9a3',.35);box(body,0,38,20,8,8,8,'#ecb95f');
        for(const side of [-1,1])for(let i=0;i<3;i++)box(body,side*(18+i*3),21-i*4,1,8,16-i*2,13,'#7775a1');
        box(body,24,25,4,4,44,4,'#ceb477');box(body,24,50,4,9,11,9,'#a5e1fb',.5);
      }else if(kind==='taro'){
        box(body,0,24,-12,35,27,19,'#557f64');box(body,0,35,-14,28,10,22,'#9da783');
        for(let i=-1;i<=1;i++){box(body,i*11,45,-17,8,14,9,'#b7c4a0');box(body,i*11,54,-17,9,5,10,'#75a97a');}
        box(body,0,53,-8,6,13,7,'#a3ce76');box(body,0,60,-8,13,5,8,'#7db35d');
        box(body,-20,22,10,6,28,23,'#6aaca0');box(body,-20,24,23,4,9,3,'#e9dc9a');
      }else{
        for(const side of [-1,1]){
          box(body,side*11,60,-3,9,13,10,dark);
          if(kind==='raven'){const wing=box(body,side*27,27,-4,23,8,24,'#49456e');wing.rotation.z=side*.3;box(body,side*36,23,-8,10,6,20,'#a698d0');}
          if(kind==='boar')box(body,side*11,34,21,5,12,6,'#efdcb1');
          if(kind==='armored'||boss){box(body,side*18,30,0,14,12,17,'#94b8b9');box(body,side*18,39,0,5,10,6,accent,.2);}
        }
        box(body,20,18,10,5,30,6,accent,.15);
        if(kind==='boar')box(body,0,35,22,22,13,18,'#a58a89');
        if(kind==='hunter'){box(body,-24,29,14,3,35,4,'#c5a886');box(body,-22,46,14,9,4,4,'#c5a886');box(body,-22,12,14,9,4,4,'#c5a886');}
        if(boss){for(let i=-1;i<=1;i++)box(body,i*11,68,-1,7,18-Math.abs(i)*5,8,'#dabb82',.2);box(body,0,59,0,36,5,29,'#c5a471');}
        if(variant==='basilisk'){for(let i=0;i<4;i++)box(body,(i%2?1:-1)*5,17-i*3,-23-i*11,17-i*2,15-i*2,18,'#577787');box(body,0,62,-8,6,19,9,'#a6e2d9',.4);}
        if(variant==='archowl'){box(body,0,65,0,47,7,35,'#7664a1');box(body,-6,78,-2,26,21,25,'#7561a6');box(body,3,79,12,6,12,3,'#e7dc9d',.4);}
        if(variant==='leviathan'){box(body,0,30,-17,49,31,27,'#527f80');for(let i=-1;i<=1;i++)box(body,i*15,52,-17,12,16,17,'#a1b6a4');}
        if(variant==='emperor'){box(body,0,22,-17,37,46,5,'#703f66');for(let i=-2;i<=2;i++)box(body,i*9,71+Math.abs(i)*2,0,7,21,8,'#efc27c',.2);box(body,0,64,17,8,8,4,'#ee9fa0',.6);}
      }
      const aura=ring(root,hero?26:boss?42:25,hero?'#7de7cf':boss?'#e6a4dd':'#aeadd1');
      root.scale.setScalar(boss?1.85:hero?1.4:1.2);
      const hit=box(body,0,43,17,4,4,4,'#fff2ae',1);hit.visible=false;
      root.userData={body,legs,aura,hit,kind};
      return root;
    }
    const actors=new Map();let heroRoot=null,heroKind=null;
    const effectRoot=new Group();scene.add(effectRoot);
    const particles=Array.from({length:24},()=>{const mesh=new Mesh(unit,material('#ffe3a1',.5));mesh.visible=false;effectRoot.add(mesh);return mesh;});
    const floorPoint=(x,y)=>({x:(x/460-.5)*width,z:(y/560-.5)*height/elevation});
    function actorPose(model,data,time,isHero){
      const p=floorPoint(data.x,data.y),u=model.userData;
      model.position.set(p.x,0,p.z);
      const hit=isHero?run.heroFlash:data.hitFlash||0;
      const moving=isHero?Math.hypot(run.lastMoveX,run.lastMoveY)>.12:!(data.warning>0||data.open>0);
      const walk=reducedMotion()?0:Math.sin(time*10+(data.animSeed||0))*(moving?.45:.03);
      u.legs[0].rotation.x=walk;u.legs[1].rotation.x=-walk;
      u.body.rotation.z=reducedMotion()?0:isHero?run.lastMoveX*-.045:Math.sin(time*3+(data.animSeed||0))*.018;
      u.body.position.y=reducedMotion()?0:Math.abs(walk)*2;
      if(!reducedMotion()&&hit>0)u.body.position.z=-Math.sin(hit*24)*4;else u.body.position.z=0;
      if(!reducedMotion()&&!isHero&&data.warning>0)u.body.rotation.x=-.1;
      else u.body.rotation.x=isHero&&run.strike&&!reducedMotion()?-.1:0;
      u.hit.visible=hit>0;u.hit.scale.setScalar(hit>0?5:1);
      u.aura.material.color.set(isHero?(run.guard>0?'#89e7ff':run.counter>0?'#ffe28b':'#7de7cf'):data.warning>0?'#ffc874':data.open>0?'#91ffd1':data.guard>0?'#8ad7f4':'#a09cc1');
    }
    let contextLost=false;
    surface.addEventListener('webglcontextlost',event=>{
      event.preventDefault();contextLost=true;suspendBackgroundBattle();
      let panel=$('#graphicsRecoveryModal');
      if(!panel){
        panel=document.createElement('div');panel.id='graphicsRecoveryModal';panel.className='modal hidden';panel.style.position='absolute';
        panel.setAttribute('role','alertdialog');panel.setAttribute('aria-modal','true');
        panel.setAttribute('aria-labelledby','graphicsRecoveryTitle');panel.setAttribute('aria-describedby','graphicsRecoveryCopy');
        const section=document.createElement('section');
        const title=document.createElement('h2');title.id='graphicsRecoveryTitle';
        title.textContent=localizedValue('Graphics interrupted','畫面暫時中斷','Gráficos interrumpidos','توقفت الرسومات');
        const copy=document.createElement('p');copy.id='graphicsRecoveryCopy';
        copy.textContent=localizedValue('Reload to recover. Your saved progress is safe.','重新載入即可恢復；永久進度已保留。','Recarga para recuperar la arena. Tu progreso está guardado.','أعد التحميل لاستعادة الساحة. تقدمك محفوظ.');
        const actions=document.createElement('div');actions.className='modal-actions';
        const retry=document.createElement('button');retry.type='button';retry.textContent=localizedValue('Reload','重新載入','Recargar','إعادة التحميل');retry.onclick=()=>location.reload();
        const back=document.createElement('button');back.type='button';back.textContent=returnLabels[locale]||returnLabels.en;
        back.onclick=()=>location.assign(`/${localeRoutePrefixes[locale]||'en'}/`);
        actions.append(retry,back);section.append(title,copy,actions);panel.append(section);
        panel.addEventListener('keydown',keyEvent=>{
          keyEvent.stopPropagation();
          if(keyEvent.key==='Escape'){keyEvent.preventDefault();return;}
          if(keyEvent.key!=='Tab')return;
          const buttons=[...panel.querySelectorAll('button:not(:disabled)')];
          if(keyEvent.shiftKey&&document.activeElement===buttons[0]){keyEvent.preventDefault();buttons.at(-1)?.focus();}
          else if(!keyEvent.shiftKey&&document.activeElement===buttons.at(-1)){keyEvent.preventDefault();buttons[0]?.focus();}
        });
        views.battle.append(panel);
      }
      panel.classList.remove('hidden');panel.querySelector('button')?.focus({preventScroll:true});
    });
    surface.addEventListener('webglcontextrestored',()=>location.reload());
    function resize(w,h){width=w;height=h;camera.left=-w/2;camera.right=w/2;camera.top=h/2;camera.bottom=-h/2;camera.updateProjectionMatrix();renderer.setSize(w,h,false);ground();}
    function render(state){
      if(contextLost)return;
      if(region!==state.definition.region){region=state.definition.region;scene.background.set(palette[region][2]);ground();}
      if(heroKind!==state.heroId){if(heroRoot){scene.remove(heroRoot);heroRoot.userData.aura.material.dispose();}heroKind=state.heroId;heroRoot=character(heroKind);scene.add(heroRoot);}
      actorPose(heroRoot,state.leo,state.time,true);
      for(const [enemy,model] of actors)if(!state.enemies.includes(enemy)){scene.remove(model);model.userData.aura.material.dispose();actors.delete(enemy);}
      for(const enemy of state.enemies){
        if(!actors.has(enemy)){const kind=enemy.boss?({prowler:'scout',basilisk:'raven',colossus:'boar',archowl:'raven',leviathan:'armored',emperor:'hunter'}[enemy.bossId]||'scout'):enemy.type;const model=character(kind,enemy.boss,enemy.bossId);scene.add(model);actors.set(enemy,model);}
        actorPose(actors.get(enemy),enemy,state.time,false);
      }
      particles.forEach(mesh=>mesh.visible=false);
      let n=0;
      for(const effect of state.fx){
        if(!['hit','defeat','roar'].includes(effect.type))continue;
        const count=effect.type==='defeat'?6:effect.type==='roar'?4:3;
        for(let i=0;i<count&&n<particles.length;i++){
          const mesh=particles[n++],p=floorPoint(effect.x,effect.y),age=Math.max(0,1-effect.t/.35),a=i/count*Math.PI*2;
          mesh.visible=true;mesh.position.set(p.x+Math.cos(a)*(10+age*24),12+(reducedMotion()?0:Math.sin(age*Math.PI)*25),p.z+Math.sin(a)*(10+age*24));
          mesh.scale.setScalar((effect.type==='defeat'?5:3)*Math.min(1,effect.t*7));mesh.rotation.set(age*2,a,age);
        }
      }
      renderer.render(scene,camera);
      surface.dataset.calls=String(renderer.info.render.calls);surface.dataset.geometries=String(renderer.info.memory.geometries);surface.dataset.textures=String(renderer.info.memory.textures);surface.dataset.triangles=String(renderer.info.render.triangles);
    }
    function dispose(){actors.forEach(model=>model.userData.aura.material.dispose());heroRoot?.userData.aura.material.dispose();actors.clear();environment.children.forEach(node=>node.isInstancedMesh&&node.dispose());unit.dispose();ringGeometry.dispose();materials.forEach(m=>m.dispose());renderer.dispose();surface.remove();}
    resize(canvas.width,canvas.height);
    return {render,resize,dispose,revision:THREE.REVISION};
  }

  function draw() {
    if(!run)return;
    world3d?.render(run);
    const w=canvas.width,h=canvas.height,sx=w/460,sy=h/560;
    const point=(x,y)=>({x:x*sx,y:y*sy});
    ctx.clearRect(0,0,w,h);
    ctx.save();ctx.scale(sx,sy);
    for(const hazard of run.hazards){
      const progress=1-hazard.t/hazard.duration;
      hazardPath(hazard);ctx.fillStyle=`rgba(255,150,57,${.08+progress*.12})`;ctx.fill('evenodd');
      ctx.strokeStyle=progress>.78?'#fff1be':'#ffc572';ctx.lineWidth=2;ctx.setLineDash(progress>.78?[]:[6,5]);ctx.stroke();ctx.setLineDash([]);
    }
    for(const effect of run.fx)if(effect.type==='impact'){
      hazardPath(effect.hazard);ctx.strokeStyle=`rgba(255,222,159,${effect.t*3})`;ctx.lineWidth=4;ctx.stroke();
    }
    if(run.strike){const strike=run.strike,p=1-strike.t/strike.duration;ctx.beginPath();ctx.moveTo(strike.fromX,strike.fromY-14);ctx.lineTo(strike.fromX+(strike.target.x-strike.fromX)*p,strike.fromY+(strike.target.y-strike.fromY)*p-14);ctx.strokeStyle='#fff3be';ctx.lineWidth=3;ctx.stroke();}
    if(run.dodgeMotion){const d=run.dodgeMotion;ctx.beginPath();ctx.moveTo(d.fromX,d.fromY);ctx.lineTo(run.leo.x,run.leo.y);ctx.strokeStyle='#b1f3ee88';ctx.lineWidth=7;ctx.stroke();}
    ctx.restore();
    for(const enemy of run.enemies){
      const p=point(enemy.x,enemy.y),size=enemy.boss?70:42,bar=enemy.boss?100:42;
      const y=Math.max(74,p.y-size-8);
      ctx.fillStyle='#102634dd';ctx.fillRect(p.x-bar/2,y,bar,5);
      ctx.fillStyle=enemy.open>0?'#99f5cb':enemy.guard>0?'#91dce7':'#e9b780';ctx.fillRect(p.x-bar/2,y,bar*Math.max(0,enemy.hp/enemy.max),5);
      if(enemy.open>0||enemy.warning>0){ctx.font='800 10px system-ui';ctx.textAlign='center';ctx.fillStyle=enemy.open>0?'#c0ffdf':'#ffe0a2';ctx.strokeStyle='#163139';ctx.lineWidth=3;const word=enemy.open>0?combatText(4):'!';ctx.strokeText(word,p.x,y-6);ctx.fillText(word,p.x,y-6);}
    }
    for(const effect of run.fx){
      if(effect.type!=='damage')continue;
      const p=point(effect.x,effect.y);ctx.globalAlpha=Math.min(1,effect.t*4);
      ctx.fillStyle=effect.source==='hurt'?'#ffb6aa':effect.blocked?'#a6e4ff':effect.strong?'#a8ffce':'#ffefbf';
      ctx.font=`900 ${effect.strong?19:15}px system-ui`;ctx.textAlign='center';ctx.strokeStyle='#142b35';ctx.lineWidth=3;
      ctx.strokeText(`−${effect.value}`,p.x,p.y-18);ctx.fillText(`−${effect.value}`,p.x,p.y-18);
    }
    ctx.globalAlpha=1;
    const p=point(run.leo.x,run.leo.y);
    ctx.fillStyle='#142e36';ctx.fillRect(p.x-23,p.y+14,46,5);ctx.fillStyle=run.hp/run.maxHp<.3?'#ff9b86':'#9de4b3';ctx.fillRect(p.x-23,p.y+14,46*Math.max(0,run.hp/run.maxHp),5);
  }

  const localeSelect = $("#locale") || $("#localeSelect");
  localeSelect.value = locale;
  // Shared Settings owns verified same-game locale navigation. The legacy
  // select remains hidden source markup; it must not initiate a second route.
  const soundToggle = $("#soundToggle");
  if (soundToggle) {
    soundToggle.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    soundToggle.onclick = () => {
      window.WeightPlayAudio?.unlock?.();
      window.WeightPlayAudio?.setMuted?.(!window.WeightPlayAudio?.isMuted?.());
      syncSoundToggle();
    };
  }
  $("#startBtn").addEventListener("keydown", (event) => { if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault(); });
  $("#startBtn").onclick = () => { playSound("ui.click"); show("stage"); focusStage(); };
  $("#stageBack").onclick = () => { playSound("ui.click"); show("main"); focusMain(); };
  $("#battleBack").onclick = openQuitDecision;
  $("#battleHelp").onclick = () => {
    if (!run || document.body.dataset.gameView !== "battle") return;
    const briefing = $("#battleBriefing");
    const fallback = briefing.dataset.defaultText || briefing.textContent;
    window.clearTimeout(battleHelpRestoreTimer);
    briefing.textContent = t("battleHelp");
    battleHelpRestoreTimer = window.setTimeout(() => {
      if (run && document.body.dataset.gameView === "battle") briefing.textContent = fallback;
    }, 2400);
  };
  $("#skillBtn").onclick = (event) => {
    skill();
    // A pointer skill action must not strand mixed-input players on a button
    // whose native keyboard guard suppresses subsequent movement.
    if(event.detail>0 && run?.active && $("#choiceModal").classList.contains("hidden")
      && $("#resultModal").classList.contains("hidden")) canvas.focus({preventScroll:true});
  };
  $("#skillBtn").addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  $("#rerollBtn").addEventListener("keydown",(event)=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});
  $("#rerollBtn").onclick = rerollBlessings;
  $("#quitKeep").onclick = () => closeQuitDecision(true);
  $("#quitLeave").onclick = () => {
    const stage = run?.stage || Math.min(TRIAL_COUNT, unlocked);
    closeQuitDecision(false, false);
    playSound("ui.click");
    show("stage");
    focusStage(stage);
  };
  $("#quitModal").addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeQuitDecision(true);
      return;
    }
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab" || $("#quitModal").classList.contains("hidden")) return;
    const actions = [$("#quitKeep"), $("#quitLeave")];
    if (event.shiftKey && document.activeElement === actions[0]) { event.preventDefault(); actions[1].focus(); }
    else if (!event.shiftKey && document.activeElement === actions[1]) { event.preventDefault(); actions[0].focus(); }
  });
  $("#resultModal").addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab" || $("#resultModal").classList.contains("hidden")) return;
    const actions = [$("#resultHome"), $("#resultNext"), resultReplay].filter((button) => !button.disabled && !button.hidden);
    if (event.shiftKey && document.activeElement === actions[0]) { event.preventDefault(); actions.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === actions.at(-1)) { event.preventDefault(); actions[0].focus(); }
  });
  $("#choiceModal").addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab" || $("#choiceModal").classList.contains("hidden")) return;
    const actions = [...$("#choiceModal").querySelectorAll("button:not(:disabled)")];
    if (!actions.length) return;
    if (event.shiftKey && document.activeElement === actions[0]) { event.preventDefault(); actions.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === actions.at(-1)) { event.preventDefault(); actions[0].focus(); }
  });
  const stagePreparation = $("#stageView");
  const progressCard = $(".progress-card");
  const stageRail = $("#stageRail");
  if (stagePreparation && progressCard && stageRail && !stagePreparation.contains(progressCard)) {
    stagePreparation.insertBefore(progressCard, stageRail);
  }
  $("#masteryBtn").addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  $("#masteryBtn").onclick = () => {
    if(practiceRequested)return;
    const cost = 5 + mastery * 4;
    if (marks >= cost) {
      trackTrialEvent("mastery_upgrade_open", {
        mastery_level: mastery,
        marks_total: marks,
        cost,
      });
      marks -= cost;
      mastery += 1;
      save();
      localize();
      playSound("reward.upgrade");
    }
  };
  addEventListener("keydown", (event) => {
    const battleOwnsInput = document.body.dataset.gameView === "battle"
      && run?.active
      && $("#choiceModal").classList.contains("hidden")
      && $("#resultModal").classList.contains("hidden");
    const nativeControl = event.target?.closest?.("button, a, input, select, textarea");
    if (!battleOwnsInput || nativeControl || !battleControlCodes.has(event.code)) return;
    event.preventDefault();
    keys[event.code] = true;
    moveTarget=null;
    beginRangeGuidance();
    if (event.code === "Space") skill();
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') dodge();
  });
  addEventListener("keyup", (event) => { keys[event.code] = false; });
  addEventListener("blur", () => {
    windowHasFocus = false;
    clearMovementInput();
    suspendRerollConfirmation();
    suspendBackgroundBattle();
  });
  addEventListener("focus", () => {
    windowHasFocus = true;
    resumeRerollConfirmation();
    resumeBackgroundBattle();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      suspendRerollConfirmation();
      suspendBackgroundBattle();
    } else {
      resumeRerollConfirmation();
      resumeBackgroundBattle();
    }
  });
  addEventListener("pagehide", () => {
    suspendRerollConfirmation();
    suspendBackgroundBattle();
  });
  addEventListener("pageshow", () => {
    resumeRerollConfirmation();
    resumeBackgroundBattle();
  });
  // One shared input owner; do not install the former tap/drag controller.
  let gestureMoved=false,gestureActive=false;
  joystick=window.WeightPlayJoystick.create({surface:canvas,container:canvas.parentElement,
    mode:'floating',anchor:{left:76,bottom:76},enabled:true,
    isEnabled:()=>activeScene==='battle'&&Boolean(run?.active)&&!backgroundSuspended,
    onChange:vector=>{if(vector.active){if(!gestureActive)gestureMoved=false;moveTarget=null;if(vector.strength>.15)gestureMoved=true;}gestureActive=vector.active;}});
  canvas.addEventListener('click',event=>{
    if(!run?.active||gestureMoved)return;
    const rect=canvas.getBoundingClientRect();
    moveTarget={x:Math.max(worldX(35),Math.min(worldX(355),(event.clientX-rect.left)/rect.width*460)),y:Math.max(80,Math.min(520,(event.clientY-rect.top)/rect.height*560))};
    beginRangeGuidance();canvas.focus({preventScroll:true});
  });
  const dodgeButton=document.createElement('button');dodgeButton.id='dodgeBtn';dodgeButton.type='button';
  dodgeButton.dataset.wpJoystickIgnore='';dodgeButton.innerHTML='<img src="/assets/animal-hero-trials-icon-comet-dash.webp" alt=""><span></span>';
  dodgeButton.setAttribute('aria-keyshortcuts','Shift');
  dodgeButton.setAttribute('aria-label',`${controlText(1)} · Shift`);
  dodgeButton.onclick=()=>{dodge();canvas.focus({preventScroll:true});};
  const combatActions=document.createElement('div');combatActions.className='combat-actions';
  combatActions.append($('#skillBtn'),dodgeButton);canvas.parentElement.append(combatActions);
  canvas.parentElement.append($('#battleHelp'));
  const startButton=$('#startBtn');startButton.disabled=true;
  const entryLoader=window.WeightPlayGameEntryLoader,entryAbort=new AbortController();
  let entryFailed=false,entryLoaded=0;
  entryLoader.begin(2);
  const failEntry=error=>{
    if(entryAbort.signal.aborted||entryFailed)return;
    entryFailed=true;clearTimeout(entryTimeout);
    console.error('HERO_TRIALS_ENTRY_INITIALIZATION',error);
    entryLoader.fail(undefined,()=>location.reload());
  };
  const entryTimeout=setTimeout(()=>failEntry(new Error('ENTRY_TIMEOUT')),20000);
  const assetReady=()=>{if(!entryAbort.signal.aborted&&!entryFailed)entryLoader.assetProgress(++entryLoaded,2);};
  // The explicit frame creates the actual Main poster synchronously below.
  // Observe that image after mounting rather than a removed legacy placeholder.
  const posterReady=Promise.resolve().then(()=>new Promise((resolve,reject)=>{
    const poster=$('.hero-main-poster img');
    const finish=()=>{
      poster?.removeEventListener('load',finish);poster?.removeEventListener('error',finish);
      if(poster?.naturalWidth>0){assetReady();resolve();}else reject(new Error('MAIN_POSTER_FAILED'));
    };
    if(!poster||poster.complete){finish();return;}
    poster.addEventListener('load',finish,{once:true,signal:entryAbort.signal});
    poster.addEventListener('error',finish,{once:true,signal:entryAbort.signal});
  }));
  const rendererEntry=import('../animal-skyspire-drop/vendor/three/three.module.min.js').then(THREE=>{
    if(entryAbort.signal.aborted||entryFailed)return;
    world3d=createBattle3D(THREE);rendererReady=true;
    document.body.dataset.heroRenderer=`three-${THREE.REVISION}`;
    fitBattleWorld();assetReady();
  });
  Promise.all([posterReady,rendererEntry]).then(()=>{
    if(entryAbort.signal.aborted||entryFailed||!rendererReady)return;
    clearTimeout(entryTimeout);startButton.disabled=false;entryLoader.ready();
  }).catch(failEntry);
  addEventListener('pagehide',()=>{clearTimeout(entryTimeout);entryAbort.abort();},{once:true});
  addEventListener('pagehide',event=>{if(!event.persisted){joystick?.destroy();world3d?.dispose();world3d=null;}});
  // Test instrumentation is supplied by a controlled local harness, never a
  // player-facing URL mode. The normal route always uses the reconstructed UI.
  if (globalThis.__WP_HERO_TEST__ === true && ['localhost','127.0.0.1','[::1]'].includes(location.hostname)) window.__heroTrialSmoke = {
    rendererContract:()=>({revision:world3d?.revision,simulation:{width:WORLD_WIDTH,height:WORLD_HEIGHT},canvas:{width:canvas.width,height:canvas.height},dodgeCool:run?.dodgeCool||0,counters:{...document.querySelector('.hero-world-3d')?.dataset}}),
    targetContract:()=>{
      const near={x:30,y:0,hp:10},far={x:150,y:0,hp:10,marked:3};
      const marked={x:80,y:0,hp:10,marked:1},dead={x:5,y:0,hp:0,marked:1};
      const point={x:0,y:0};
      return {
        distantMarkCannotBlock:selectAttackTarget([far,near],point,100)===near,
        reachableMarkPriority:selectAttackTarget([near,marked],point,100)===marked,
        outOfRangeNoStrike:selectAttackTarget([far],point,100)===null,
        deadCannotBlock:selectAttackTarget([dead,near],point,100)===near,
      };
    },
    combatContract:()=>({
      circleCenter:hazardContains({kind:"circle",x:0,y:0,radius:40},{x:0,y:0}),
      circleOutside:hazardContains({kind:"circle",x:0,y:0,radius:40},{x:41,y:0}),
      lineCenter:hazardContains({kind:"line",x:0,y:0,toX:100,toY:0,radius:20},{x:50,y:19}),
      lineOutside:hazardContains({kind:"line",x:0,y:0,toX:100,toY:0,radius:20},{x:50,y:21}),
      ringSafeCenter:hazardContains({kind:"ring",x:0,y:0,inner:40,radius:100},{x:0,y:0}),
      ringDanger:hazardContains({kind:"ring",x:0,y:0,inner:40,radius:100},{x:60,y:0}),
      ringOutside:hazardContains({kind:"ring",x:0,y:0,inner:40,radius:100},{x:101,y:0}),
    }),
    definitions:()=>trials.map((trial)=>({stage:trial.stage,region:trial.region,titleEn:trial.titleEn,titleZh:trial.titleZh,checkpoint:trial.checkpoint,enemies:[...trial.enemies],encounters:trial.encounters.map((encounter)=>({...encounter,types:[...encounter.types]})),recommended:trial.recommended,reward:trial.reward,boss:trial.boss?{id:trial.boss.id,nameEn:trial.boss.name[0],nameZh:trial.boss.name[1],asset:trial.boss.asset,rule:trial.boss.rule}:null})),
    prepare:(stage,room=1)=>{ unlocked=TRIAL_COUNT; startTrial(stage); run.room=Math.max(1,Math.min(3,room)); spawn(); return window.__heroTrialSmoke.snapshot(); },
    damageFirst:(amount=20,source="auto")=>{ const enemy=run?.enemies[0]; return enemy?{applied:damageEnemy(enemy,amount,source),enemy:{...enemy}}:null; },
    forceRoomClear:()=>{ if(!run) return null; run.enemies=[]; if(run.room>=3) finish(true); else chooseBlessing(); return window.__heroTrialSmoke.snapshot(); },
    setCooldown:(value=0)=>{ if(!run) return null; run.cool=Math.max(0,Number(value)||0); updateHud(); return window.__heroTrialSmoke.snapshot(); },
    setHealth:(value)=>{ if(!run) return null; run.hp=Math.max(0,Math.min(run.maxHp,Number(value)||0)); updateHud(); return window.__heroTrialSmoke.snapshot(); },
    snapshot: () => ({
      pointer,moveTarget:moveTarget?{...moveTarget}:null,stick:{...stick},
      active:Boolean(run?.active),hp:run?.hp??null,maxHp:run?.maxHp??null,
      cooldown:run?.cool??null,player:run?{...run.leo}:null,
      run:run?{stage:run.stage,room:run.room,heroId:run.heroId,build:{...run.build},
        checkpoint:run.definition.checkpoint,boss:run.definition.boss?.id||null,
        guidancePhase:run.guidancePhase,guidanceTimer:run.guidanceTimer,
        firstAutoAttack:run.firstAutoAttack,attackRange:heroes[run.heroId].range,
        dodges:run.dodges,counter:run.counter,guard:run.guard,time:run.time}:null,
      hazards:run?.hazards.map(({kind,x,y,toX,toY,radius,inner,t,duration,damage})=>({kind,x,y,toX,toY,radius,inner,t,duration,damage}))||[],
      visual:run?{shake:run.shake,heroFlash:run.heroFlash,heroKick:run.heroKick,
        effects:run.fx.map(effect=>({type:effect.type,value:effect.value||0,t:effect.t}))}:null,
      unlocked,marks,
      enemies:run?.enemies.map(enemy=>({x:enemy.x,y:enemy.y,hp:enemy.hp,max:enemy.max,
        type:enemy.type,bossId:enemy.bossId||null,bossRule:enemy.bossRule||null,
        guard:enemy.guard||0,warning:enemy.warning||0,phase:enemy.phase||0,
        open:enemy.open||0,stun:enemy.stun||0,attackCount:enemy.attackCount||0,
        hitFlash:enemy.hitFlash||0,hitOffsetX:enemy.hitOffsetX||0,hitOffsetY:enemy.hitOffsetY||0}))||[],
    })
  };
  {
    const stageContent=document.createElement('div');stageContent.id='stageContent';
    stageContent.append($('#stageRail'));views.stage.append(stageContent);
    const heroPanel=document.createElement('section');heroPanel.id='heroPanel';heroPanel.className='hero-preparation';heroPanel.hidden=true;
    heroPanel.setAttribute('role','dialog');heroPanel.setAttribute('aria-modal','true');
    heroPanel.setAttribute('aria-label',controlText(3));
    const title=document.createElement('h2');title.textContent=heroPanel.getAttribute('aria-label');
    const close=document.createElement('button');close.type='button';close.textContent=controlText(4);
    close.onclick=()=>setHeroPanel(false);
    heroPanel.append(title,$('#heroPicker'),$('.progress-card'),close);views.stage.append(heroPanel);
    $('#stageTabs').hidden=true;
    const mainContent=$('.wp-standard-main-composition');
    for(const view of Object.values(views)){
      const header=view.querySelector('header');
      let title=header.querySelector('[data-wp-game-title]');
      if(!title){title=document.createElement('span');header.append(title);}
      title.dataset.wpFrameTitle='';
    }
    canvas.parentElement.append($('.health'));
    // Explicit frame slots are the sole layout owner. Keeping the legacy
    // composition/card classes adds a second padding/420px layout around it.
    const poster=$('.wp-standard-main-poster');
    poster.setAttribute('data-wp-frame-poster','');poster.className='hero-main-poster';
    const posterImage=document.createElement('img');posterImage.src='/assets/interface7-redrawn/animal-hero-trials.webp';
    posterImage.alt=t('title');posterImage.width=1254;posterImage.height=1254;poster.replaceChildren(posterImage);
    mainContent.className='hero-main-content';
    $('.main-copy').classList.remove('wp-standard-main-copy');
    $('.main-copy').setAttribute('data-wp-frame-copy','');
    $('.wp-standard-main-summary').setAttribute('data-wp-frame-summary','');
    $('#mainProgress').setAttribute('data-wp-frame-progress','');
    $('#startBtn').setAttribute('data-wp-frame-action','primary');
    $('.main-copy h1').hidden=true;
    const retained=document.createElement('div');retained.hidden=true;retained.append($('#soundToggle'),$('.locale'));$('#main').append(retained);
    sharedFrame=window.WeightPlayScreenFrame.mount({root:$('#main'),playUI:true,
      scenes:{main:{root:views.main,header:views.main.querySelector('header'),content:mainContent},
        stage:{root:views.stage,header:views.stage.querySelector('header'),content:stageContent},
        battle:{root:views.battle,header:views.battle.querySelector('header'),content:$('.canvas-wrap'),headerInfo:$('.health')}}});
    const summary=document.createElement('span');summary.id='stageSummary';sharedFrame.stageTopUI.add(summary);
    const teamButton=document.createElement('button');teamButton.id='teamBtn';teamButton.type='button';
    teamButton.textContent=controlText(2);
    teamButton.onclick=()=>setHeroPanel(true);
    sharedFrame.commonDownButton.add(teamButton);
    addEventListener('keydown',event=>{
      if(heroPanel.hidden)return;
      if(event.key==='Escape'){event.preventDefault();setHeroPanel(false);return;}
      if(event.key==='Tab'){
        const buttons=[...heroPanel.querySelectorAll('button:not(:disabled)')];
        if(!heroPanel.contains(document.activeElement)){event.preventDefault();buttons[0]?.focus();}
        else if(event.shiftKey&&document.activeElement===buttons[0]){event.preventDefault();buttons.at(-1).focus();}
        else if(!event.shiftKey&&document.activeElement===buttons.at(-1)){event.preventDefault();buttons[0].focus();}
      }
    },true);
    const config=window.HeroTrialsStageConfig.create({count:TRIAL_COUNT,
      stage(index){const d=trials[index],locked=d.stage>unlocked&&!practiceEnabled;
        return {id:d.stage,kicker:`${localizedValue('Trial','試煉','Prueba','التجربة')} ${d.stage} / ${TRIAL_COUNT}`,
          title:localizedValue(d.titleEn,d.titleZh,d.titleEs,d.titleAr),subtitle:localizedPair(regions[d.region].name),
          status:locked?t('locked'):interpolate('roomsAndMarks',{marks:d.reward}),
          summary:localizedPair(regions[d.region].rule),details:[localizedPair(regions[d.region].rule),d.boss?localizedPair(d.boss.name):interpolate('recommended',{hero:localizedPair(heroNames[d.recommended])})],
          locked,cleared:d.stage<unlocked};}});
    sharedStage=window.WeightPlayPlayUI.mountStage({page:stageContent,rail:$('#stageRail'),config,selected:Math.min(TRIAL_COUNT,unlocked)-1,
      onStart:index=>startTrial(index+1),isActive:()=>activeScene==='stage'});
    show('main');
  }
  localize();
  if(practiceRequested) import("../../src/game-local-practice.mjs").then(({LocalPractice})=>{
    localPractice=LocalPractice;
    return LocalPractice.register({gameId:"animal-hero-trials",stageIds:trials.map(trial=>trial.stage),
      enable:enabled=>{
        practiceEnabled=enabled;
        if(enabled)practiceIsolation=true;
        else if(practiceIsolation) {
          trialStartTicket++;
          if(run)run.active=false;
          cancelAnimationFrame(frame);
          clearMovementInput();
          show("stage");
        }
        renderStages();
      },
      startStage:stage=>startTrial(Number(stage),"local_practice"),
    });
  }).catch(()=>{practiceEnabled=false;});
})();
