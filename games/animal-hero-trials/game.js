(() => {
  "use strict";

  const GAME_VERSION = "v15";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const ASSET_ROOT = "../../assets/";
  const WORLD_WIDTH = 460;
  const WORLD_HEIGHT = 560;
  const LEGACY_WORLD_WIDTH = 390;
  const WORLD_X_SCALE = WORLD_WIDTH / LEGACY_WORLD_WIDTH;
  const worldX = (value) => value * WORLD_X_SCALE;
  const copy = {
    en: {
      title: "Animal Hero Trials",
      pitch: "Guide Leo through three forest trials and choose a blessing after every room.",
      marks: "Trial Marks",
      mastery: "Heart Mastery",
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
    },
    "zh-Hant": {
      title: "動物英雄試煉",
      pitch: "帶領獅子里歐通過三個森林試煉，每個房間結束後選擇一項祝福。",
      marks: "試煉印記",
      mastery: "勇氣精通",
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
  });
  Object.assign(copy["zh-Hant"], {
    skillReadyLabel: "{skill}已可使用。{effect}按下即可施放。",
    skillCooldownLabel: "{skill}尚有 {seconds} 秒無法使用。{effect}",
    leoSkillEffect: "對附近敵人造成 {damage} 點傷害。",
    fiaSkillEffect: "衝向最近敵人、獲得 0.55 秒無敵，並造成 {damage} 點近距離傷害。",
    orlaSkillEffect: "對最近敵人造成 {damage} 點傷害，並使下一次自動攻擊追加 18 點傷害。",
    taroSkillEffect: "防護 3.5 秒、最多恢復 {heal} 點生命，並對大範圍敵人造成 {damage} 點傷害。",
  });
  copy.es = {
    controlHint: "Toca o arrastra para moverte · Usa {skill} o Espacio cuando esté disponible",
    rangeHint: "Acércate al enemigo resaltado · Los ataques se activan automáticamente al entrar en alcance",
    rangeHitHint: "En alcance · El ataque automático acertó",
    title: "Pruebas de Héroes Animales",
    pitch: "Elige uno de cuatro héroes y supera una campaña de 30 pruebas sombrías.",
    marks: "Marcas de prueba",
    mastery: "Maestría de vida",
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
  };

  Object.assign(copy.en, { stages: "Stages", replay: "Replay" });
  Object.assign(copy["zh-Hant"], { stages: "\u8a66\u7149", replay: "\u91cd\u65b0\u6311\u6230" });
  Object.assign(copy.es, { stages: "Pruebas", replay: "Repetir" });
  copy.ar = {
    title: "محاكمات بطل الحيوان",
    pitch: "اختر واحدًا من أربعة أبطال وأكمل حملة الظلال المكوّنة من 30 تجربة.",
    marks: "علامات التجربة",
    mastery: "إتقان القلب",
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
    next: "المحاكمة القادمة",
    replay: "إعادة اللعب",
  };

  const TRIAL_COUNT = 30;
  const trialTitles = [
    ["First Footprints","初始足跡"],["Scout Ring","斥候包圍"],["Bramble Pursuit","荊棘追逐"],["Root Ambush","樹根伏擊"],["Prowler Gate","潛影者之門"],
    ["Prism Wings","稜晶之翼"],["Raven Crosswind","渡鴉側風"],["Crystal Guard","水晶護衛"],["Refraction Pack","折光群襲"],["Basilisk Mirror","蛇王之鏡"],
    ["Ember Hooves","餘燼蹄聲"],["Boar Warning","野豬預警"],["Furnace Charge","熔爐衝鋒"],["Cinder Stampede","燼火奔襲"],["Colossus Forge","巨獸熔爐"],
    ["Moon Bow","月影獵弓"],["Hunter Distance","獵手距離"],["Twin Volley","雙重齊射"],["Eclipse Wings","蝕月之翼"],["Archowl Court","大梟王庭"],
    ["Abyss Armor","深淵護甲"],["Shell Patrol","甲殼巡行"],["Sunken Pack","沉沒獸群"],["Leviathan Call","巨獸召喚"],["Abyss Throne","深淵王座"],
    ["Crown Mixture","王冠混戰"],["Sixfold Hunt","六相狩獵"],["Sovereign Guard","君王護衛"],["Last Shadow Line","最後暗影線"],["Void Crown Trial","虛空王冠試煉"]
  ];
  const regions = [
    { name:["Rootwood","根木林"], rule:["Chasing packs","追逐獸群"], enemies:["scout"], hero:"Leo" },
    { name:["Prism Ravine","稜晶峽谷"], rule:["Flying and guarded foes","飛行與護盾敵人"], enemies:["raven","armored","scout"], hero:"Orla" },
    { name:["Ember Forge","餘燼熔爐"], rule:["Warned charges","有預警的衝鋒"], enemies:["boar","scout","armored"], hero:"Fia" },
    { name:["Moon Range","月影長廊"], rule:["Ranged volleys","遠程齊射"], enemies:["hunter","raven","scout"], hero:"Orla" },
    { name:["Abyss Shell","深淵甲殼"], rule:["Armor and reinforcements","護甲與增援"], enemies:["armored","boar","hunter"], hero:"Taro" },
    { name:["Void Crown","虛空王冠"], rule:["Combined enemy rules","敵人規則組合"], enemies:["scout","raven","boar","hunter","armored"], hero:"Any hero" }
  ];
  const bosses = [
    { id:"prowler", name:["Shadow Prowler","暗影潛行者"], asset:"animal-hero-trials-shadow-boss.webp", rule:"shockwave" },
    { id:"basilisk", name:["Prism Basilisk","稜晶蛇王"], asset:"animal-auto-squad-boss-prism-basilisk.webp", rule:"prism" },
    { id:"colossus", name:["Magma Tusk Colossus","熔岩巨牙獸"], asset:"animal-auto-squad-boss-magma-tusk-colossus.webp", rule:"charge" },
    { id:"archowl", name:["Eclipse Archowl","蝕月大梟"], asset:"animal-auto-squad-boss-eclipse-archowl.webp", rule:"volley" },
    { id:"leviathan", name:["Abyss Shell Leviathan","深淵甲殼巨獸"], asset:"animal-auto-squad-boss-abyss-shell-leviathan.webp", rule:"summon" },
    { id:"emperor", name:["Void Crown Emperor","虛空王冠帝"], asset:"animal-auto-squad-boss-void-crown-emperor.webp", rule:"crown" }
  ];
  const enemyProfiles = {
    scout:{ name:["Shadow Scouts","暗影斥候"], asset:"animal-hero-trials-shadow-scout.png", speed:32, damage:4, range:48 },
    raven:{ name:["Prism Ravens","稜晶渡鴉"], asset:"animal-rune-tactics-enemy-raven.webp", speed:42, damage:4, range:62 },
    boar:{ name:["Ember Boars","餘燼野豬"], asset:"animal-gearpack-expedition-enemy-armored-boar.webp", speed:25, damage:7, range:52 },
    hunter:{ name:["Moon Hunters","月影獵手"], asset:"shadow-wolf-enemy-hunter.webp", speed:27, damage:5, range:210 },
    armored:{ name:["Abyss Guards","深淵護衛"], asset:"animal-rune-tactics-enemy-wolf.webp", speed:23, damage:6, range:48, guard:2 }
  };
  const heroNames = {
    Leo: ["Boom Mane Leo", "爆鬃里歐"],
    Fia: ["Spark Paw Fia", "星爪菲亞"],
    Orla: ["Moon Cap Orla", "月帽奧拉"],
    Taro: ["Moss Shell Taro", "苔甲塔羅"],
    "Any hero": ["Any hero", "任一英雄"],
  };
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
  trialTitles.forEach((title, index) => title[2] = trialTitlesEs[index]);
  const regionCopyEs = [
    ["Bosque de Raíces", "Manadas perseguidoras"], ["Barranco Prismático", "Enemigos voladores y protegidos"],
    ["Forja de Brasas", "Cargas anunciadas"], ["Campo Lunar", "Descargas a distancia"],
    ["Caparazón Abisal", "Armadura y refuerzos"], ["Corona Vacía", "Reglas enemigas combinadas"],
  ];
  regions.forEach((region, index) => { region.name[2] = regionCopyEs[index][0]; region.rule[2] = regionCopyEs[index][1]; });
  const bossNamesEs = ["Acechador Sombrío", "Basilisco Prismático", "Coloso Colmillo de Magma", "Archibúho del Eclipse", "Leviatán del Caparazón Abisal", "Emperador de la Corona Vacía"];
  bosses.forEach((boss, index) => boss.name[2] = bossNamesEs[index]);
  const enemyNamesEs = ["Exploradores Sombríos", "Cuervos Prismáticos", "Jabalíes de Brasa", "Cazadores Lunares", "Guardias Abisales"];
  Object.values(enemyProfiles).forEach((profile, index) => profile.name[2] = enemyNamesEs[index]);
  const heroNamesEs = ["Leo Melena Explosiva", "Fia Pata Chispeante", "Orla Sombrero Lunar", "Taro Caparazón Musgoso", "Cualquier héroe"];
  Object.values(heroNames).forEach((name, index) => name[2] = heroNamesEs[index]);
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
      checkpoint,
      enemies,
      encounters:buildEncounterPlans(stage,enemies,checkpoint),
      recommended:regions[region].hero,
      reward:Math.min(9,3+stage),
      boss:checkpoint?bosses[region]:null
    };
  });

  function readStorage(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function writeStorage(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } }
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
  let stageSelectionFrame = 0;
  let backgroundSuspended = false;
  let windowHasFocus = document.hasFocus();
  let quitSuspended = false;
  let quitOpener = null;
  const keys = {};
  const battleControlCodes = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyW", "KeyS", "Space"]);
  let stick = { x: 0, y: 0 };

  function clearMovementInput() {
    Object.keys(keys).forEach((key) => { keys[key] = false; });
    stick = { x: 0, y: 0 };
    const ownedPointer = pointer;
    pointer = null;
    moveTarget = null;
    if (ownedPointer !== null && canvas?.hasPointerCapture?.(ownedPointer)) canvas.releasePointerCapture(ownedPointer);
  }

  function movementIntent() {
    let dx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0);
    let dy = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0);
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
    backgroundSuspended = true;
    run.active = false;
    cancelAnimationFrame(frame);
  }

  function resumeBackgroundBattle() {
    if (!backgroundSuspended || !run || document.hidden || !windowHasFocus || document.body.dataset.gameView !== "battle") return;
    if (!$("#choiceModal").classList.contains("hidden") || !$("#quitModal").classList.contains("hidden") || !$("#resultModal").classList.contains("hidden")) return;
    backgroundSuspended = false;
    run.active = true;
    run.last = performance.now();
    loop(run.last);
    sceneFrame("battle", () => $("#game").focus({ preventScroll: true }));
  }
  const images = {
    bg: load("animal-hero-trials-arena.png"),
    leo: load("animal-hero-trials-leo.png"),
    fia: load("animal-hero-trials-fia.webp"),
    orla: load("animal-hero-trials-orla.webp"),
    taro: load("animal-hero-trials-taro.webp"),
    enemy: load("animal-hero-trials-shadow-scout.png"),
    roar: load("animal-hero-trials-fx-roar.webp"),
    hit: load("animal-hero-trials-fx-hit.webp"),
    shadow: load("animal-hero-trials-fx-shadow-hit.webp"),
  };
  Object.entries(enemyProfiles).forEach(([id,profile])=>{ images[`enemy-${id}`]=load(profile.asset); });
  bosses.forEach((boss)=>{ images[`boss-${boss.id}`]=load(boss.asset); });
  const heroes = {
    leo: { image: "leo", asset: "animal-hero-trials-leo.png", hp: 100, speed: 125, attack: 10, range: 76, skill: { en: "ROAR", zh: "怒吼", es: "RUGIDO" } },
    fia: { image: "fia", asset: "animal-hero-trials-fia.webp", hp: 86, speed: 145, attack: 11, range: 72, skill: { en: "DASH", zh: "彗星衝刺", es: "CARRERA COMETA" } },
    orla: { image: "orla", asset: "animal-hero-trials-orla.webp", hp: 82, speed: 112, attack: 8, range: 165, skill: { en: "MARK", zh: "月之印記", es: "MARCA LUNAR" } },
    taro: { image: "taro", asset: "animal-hero-trials-taro.webp", hp: 126, speed: 92, attack: 8, range: 76, skill: { en: "GUARD", zh: "庭園守護", es: "GUARDIA DEL JARDÍN" } },
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
    window.WonderSound?.play?.(cue);
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
    const muted = Boolean(window.WonderSound?.isMuted?.());
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
    const trialLabel = localizedValue("Trial", "試煉", "Prueba");
    const title = localizedValue(definition.titleEn, definition.titleZh, definition.titleEs);
    const rule = localizedPair(region.rule);
    $("#battleBriefing").textContent = `${trialLabel} ${definition.stage} · ${title} · ${rule}`;
  }

  function interpolate(key, values) {
    return t(key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
  }

  function trackTrialEvent(name, details = {}) {
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
    return runtimeTranslate(pair[0]);
  }
  function localizedValue(en, zh, es) {
    if (locale === "zh-Hant") return zh;
    if (locale === "es") return es;
    return runtimeTranslate(en);
  }
  function trialDefinition(stage) { return trials[Math.max(0,Math.min(TRIAL_COUNT-1,Number(stage)-1))] || trials[0]; }

  function show(name) {
    clearRerollConfirmation();
    clearMovementInput();
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
      updateCenteredStageCard();
    }
    setChoiceModal(false, false);
    closeQuitDecision(false, false);
    setResultModal(false, false);
    if (name !== "battle") {
      backgroundSuspended = false;
      cancelAnimationFrame(frame);
      if (run) run.active = false;
    }
    dispatchEvent(new CustomEvent("weightplay:shell-sync", { detail: { screen: name, generation: sceneGeneration } }));
    dispatchEvent(new CustomEvent("weightplay:stage-sync", { detail: { screen: name, generation: sceneGeneration } }));
    dispatchEvent(new CustomEvent("weightplay:battle-sync", { detail: { screen: name, generation: sceneGeneration } }));
    if (name === "battle") dispatchEvent(new CustomEvent("weightplay:battle-open", { detail: { screen: name, generation: sceneGeneration } }));
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
    $("#quitModal").classList.remove("hidden");
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
    $("#quitModal").classList.add("hidden");
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
    $("#choiceModal").classList.toggle("hidden", !open);
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
    $("#resultModal").classList.toggle("hidden", !open);
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
    document.title = localizedValue("Animal Hero Trials - WeightPlay", "動物英雄試煉 - WeightPlay", "Pruebas de Héroes Animales - WeightPlay");
    const returnLabel = returnLabels[locale] || returnLabels.en;
    $("#stageBack").setAttribute("aria-label", returnLabel);
    $("#battleBack").setAttribute("aria-label", returnLabel);
    $("#game").setAttribute("aria-label", t("arenaLabel"));
    $("#game").setAttribute("aria-keyshortcuts", "ArrowUp ArrowDown ArrowLeft ArrowRight W A S D Space");
    $$('[data-t]').forEach((node) => {
      node.textContent = t(node.dataset.t);
    });
    $("#markCount").textContent = marks;
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
    $("#masteryBtn").disabled = !masteryReady;
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
      leo: [localizedPair(heroNames.Leo), localizedValue("Balanced · 100 HP", "均衡 · 100 生命", "Equilibrado · 100 PV"), localizedValue("Close-range stun", "近距離暈眩", "Aturdimiento cercano")],
      fia: [localizedPair(heroNames.Fia), localizedValue("Fast · 86 HP", "高速 · 86 生命", "Veloz · 86 PV"), localizedValue("Invulnerable dash", "無敵衝刺", "Carrera invulnerable")],
      orla: [localizedPair(heroNames.Orla), localizedValue("Ranged · 82 HP", "遠程 · 82 生命", "Distancia · 82 PV"), localizedValue("Mark bonus damage", "標記增傷", "Marca de daño adicional")],
      taro: [localizedPair(heroNames.Taro), localizedValue("Tank · 126 HP", "耐久 · 126 生命", "Defensor · 126 PV"), localizedValue("Damage guard", "守護減傷", "Guardia reductora")],
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
      };
      picker.append(button);
    });
    if (focusedHero) sceneFrame("stage", () => {
      picker.querySelector(`.hero-option[data-hero="${focusedHero}"]`)?.focus({ preventScroll: true });
    });
  }

  function renderStages() {
    const rail = $("#stageRail");
    rail.innerHTML = "";
    for (let stage = 1; stage <= TRIAL_COUNT; stage += 1) {
      const definition=trialDefinition(stage);
      const region=regions[definition.region];
      const locked=stage>unlocked;
      const button = document.createElement("button");
      button.className = `stage-card${locked ? " locked" : ""}${definition.checkpoint ? " checkpoint" : ""}`;
      button.dataset.stage = String(stage);
      button.setAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight Home End");
      if(locked)button.setAttribute("aria-disabled","true");
      const detail = locked ? t("locked") : interpolate("roomsAndMarks",{marks:definition.reward});
      const title=localizedValue(definition.titleEn,definition.titleZh,definition.titleEs);
      const rule=localizedPair(region.rule);
      const boss=definition.boss?` · ${localizedPair(definition.boss.name)}`:"";
      button.innerHTML = `<img src="${ASSET_ROOT}${definition.boss?.asset || "animal-hero-trials-arena.png"}" alt=""><strong>${localizedValue("Trial", "試煉", "Prueba")} ${stage} · ${title}</strong><span>${detail}<br>${rule}${boss}<br>${interpolate("recommended",{hero:localizedPair(heroNames[definition.recommended])})}</span>`;
      button.tabIndex = stage === Math.min(TRIAL_COUNT, unlocked) ? 0 : -1;
      button.onclick = () => stage <= unlocked && startTrial(stage);
      rail.append(button);
    }
    scheduleCenteredStageCard();
  }

  function updateCenteredStageCard() {
    stageSelectionFrame=0;
    const rail=$("#stageRail");
    if(!rail||!rail.getClientRects().length)return;
    const railRect=rail.getBoundingClientRect();
    const center=railRect.left+railRect.width/2;
    const cards=[...rail.querySelectorAll(".stage-card")];
    const centered=cards.reduce((best,card)=>{
      const rect=card.getBoundingClientRect();
      const distance=Math.abs(rect.left+rect.width/2-center);
      return !best||distance<best.distance?{card,distance}:best
    },null)?.card||null;
    cards.forEach((card)=>{
      const active=card===centered;
      card.classList.toggle("is-browsed",active);
      card.tabIndex=active?0:-1;
      if(active)card.setAttribute("aria-current","true");
      else card.removeAttribute("aria-current");
    });
  }

  function scheduleCenteredStageCard() {
    cancelAnimationFrame(stageSelectionFrame);
    stageSelectionFrame=sceneFrame("stage", updateCenteredStageCard);
  }

  function setStageTabStop(card, focus = false) {
    if (!card) return;
    $$("#stageRail .stage-card").forEach((item) => { item.tabIndex = item === card ? 0 : -1; });
    if (focus) {
      card.scrollIntoView({ block: "nearest", inline: "center" });
      card.focus({ preventScroll: true });
      scheduleCenteredStageCard();
    }
  }

  function focusStage(stage = Math.min(TRIAL_COUNT, unlocked)) {
    sceneFrame("stage", () => setStageTabStop($(`#stageRail .stage-card[data-stage="${stage}"]`), true));
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
    backgroundSuspended = false;
    show("battle");
    const hero = heroes[selectedHero] || heroes.leo;
    const maxHp = hero.hp + mastery * 12;
    run = {
      active: true,
      stage:Math.max(1,Math.min(unlocked,Number(stage)||1)),
      definition:trialDefinition(Math.max(1,Math.min(unlocked,Number(stage)||1))),
      room: 1,
      hp: maxHp,
      maxHp,
      leo: { x: WORLD_WIDTH / 2, y: 430 },
      heroId: selectedHero,
      enemies: [],
      cool: 0,
      attackCool: 0,
      invulnerable: 0,
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
    $("#skillBtn img").src = ASSET_ROOT + hero.asset;
    spawn();
    playSound("start");
    $("#game").focus({ preventScroll: true });
    loop(performance.now());
  }

  function spawn() {
    const definition=run.definition;
    const encounter=definition.encounters[run.room-1];
    updateBattleBriefing();
    if (run.room === 3 && definition.checkpoint) {
      const boss=definition.boss;
      const hp = 190 + definition.region * 44;
      run.enemies = [{ x:WORLD_WIDTH / 2,y:125,hp,max:hp,cd:0,boss:true,bossId:boss.id,bossRule:boss.rule,type:"boss",special:2.8,warning:0,phase:0,guard:boss.rule==="prism"||boss.rule==="crown"?3:0,summoned:false,hitFlash:0,hitOffsetX:0,hitOffsetY:0,animSeed:0 }];
      $("#roomText").textContent = roomLabel(run.room, true);
      $("#objective").textContent = interpolate("bossObjectiveNamed",{boss:localizedPair(boss.name)});
      updateHud();
      playSound("boss");
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
      return { x:worldX(point[0]), y:point[1], hp, max:hp, cd:0, type, elite, special:1.6+index*.3, warning:0, guard:(profile.guard||0)+(elite?1:0), phase:0, hitFlash:0, hitOffsetX:0, hitOffsetY:0, animSeed:index * 1.7 + run.room };
    });
    $("#roomText").textContent = roomLabel(run.room,elite);
    const enemyNames=[...new Set(run.enemies.map((enemy)=>localizedPair(enemyProfiles[enemy.type].name)))].join(" + ");
    $("#objective").textContent = elite&&count===1
      ? interpolate("eliteObjective",{enemy:enemyNames})
      : interpolate("enemyObjective",{count:run.enemies.length,enemy:enemyNames});
    updateHud();
    if(elite) playSound("boss");
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
    hint.hidden = !(showControls || showRange || showHit);
    if (showControls) {
      const skillName = locale === "zh-Hant"
        ? heroes[run.heroId].skill.zh
        : locale === "es"
          ? heroes[run.heroId].skill.es
          : runtimeTranslate(heroes[run.heroId].skill.en);
      hint.textContent = interpolate("controlHint", { skill: skillName });
    } else if (showRange) {
      hint.textContent = t("rangeHint");
    } else if (showHit) {
      hint.textContent = t("rangeHitHint");
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
    const skillName = locale === "zh-Hant"
      ? heroes[run.heroId].skill.zh
      : locale === "es"
        ? heroes[run.heroId].skill.es
        : runtimeTranslate(heroes[run.heroId].skill.en);
    updateGuidanceHint();
    $("#cooldownText").textContent = run.cool > 0 ? run.cool.toFixed(1) : skillName;
    $("#skillBtn").setAttribute("aria-label", interpolate(run.cool > 0 ? "skillCooldownLabel" : "skillReadyLabel", {
      skill: skillName,
      seconds: Math.max(0.1, run.cool).toFixed(1),
      effect: skillEffectLabel(),
    }));
  }

  function damageEnemy(enemy,amount,source="auto") {
    if(!enemy||enemy.hp<=0) return 0;
    let applied=amount;
    if(enemy.guard>0){
      applied*=source==="skill"?.65:.25;
      if(source==="skill") enemy.guard=Math.max(0,enemy.guard-1);
    }
    if(enemy.bossRule==="charge"&&!enemy.open) applied*=.35;
    if(enemy.bossRule==="crown"&&enemy.phase===1&&source!=="skill") applied*=.3;
    enemy.hp-=applied;
    const direction = Math.atan2(enemy.y - run.leo.y, enemy.x - run.leo.x);
    enemy.hitFlash = Math.max(enemy.hitFlash || 0, source === "skill" ? 0.24 : 0.16);
    enemy.hitOffsetX = Math.cos(direction) * (source === "skill" ? 9 : 5);
    enemy.hitOffsetY = Math.sin(direction) * (source === "skill" ? 9 : 5);
    run.shake = Math.max(run.shake, source === "skill" ? 0.16 : 0.055);
    run.heroKick = Math.max(run.heroKick, source === "skill" ? 0.12 : 0.06);
    run.fx.push({ type: "damage", x: enemy.x, y: enemy.y - (enemy.boss ? 72 : 44), t: 0.62, vy: -30, value: Math.max(1, Math.round(applied)), source });
    return applied;
  }

  function skill() {
    if (!run?.active || run.cool > 0) return;
    beginRangeGuidance();
    playSound("shoot");
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
      if (skillTarget) {
        dx = skillTarget.x - run.leo.x;
        dy = skillTarget.y - run.leo.y;
      }
      const length = Math.hypot(dx, dy) || 1;
      if (!dx && !dy) dy = -1;
      const from = { ...run.leo };
      run.leo.x = Math.max(35, Math.min(355, run.leo.x + (dx / length) * 125));
      run.leo.y = Math.max(80, Math.min(520, run.leo.y + (dy / length) * 125));
      run.invulnerable = 0.55;
      run.fx.push({ type: "roar", x: (from.x + run.leo.x) / 2, y: (from.y + run.leo.y) / 2, t: 0.3 });
      let dashTarget = null;
      let dashDistance = Infinity;
      for (const enemy of run.enemies) {
        const distance = Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y);
        if (distance < dashDistance) {
          dashDistance = distance;
          dashTarget = enemy;
        }
        if (distance < 105) {
          damageEnemy(enemy,30 + run.bless.power * 6,"skill");
          run.fx.push({ type: "hit", x: enemy.x, y: enemy.y, t: 0.25 });
          run.fx.push({ type: "slash", x: enemy.x, y: enemy.y, fromX: from.x, fromY: from.y, t: 0.2 });
        }
      }
      if (dashTarget && dashDistance >= 105 && dashDistance < 190) {
        damageEnemy(dashTarget,22 + run.bless.power * 5,"skill");
        run.fx.push({ type: "hit", x: dashTarget.x, y: dashTarget.y, t: 0.25 });
        run.fx.push({ type: "slash", x: dashTarget.x, y: dashTarget.y, fromX: from.x, fromY: from.y, t: 0.2 });
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

  function hurt(amount) {
    if (run.invulnerable > 0) return;
    const roleReduction = run.heroId === "taro" ? 0.76 : 1;
    const applied = run.guard > 0 ? Math.ceil(amount * 0.3) : Math.ceil(amount * roleReduction);
    run.hp -= applied;
    run.heroFlash = Math.max(run.heroFlash, 0.24);
    run.shake = Math.max(run.shake, 0.18);
    run.fx.push({ type: "damage", x: run.leo.x, y: run.leo.y - 58, t: 0.7, vy: -34, value: applied, source: "hurt" });
    run.fx.push({ type: "shadow", x: run.leo.x, y: run.leo.y, t: 0.34 });
  }

  function autoAttack() {
    if (run.attackCool > 0) return;
    let target = null;
    let distance = Infinity;
    for (const enemy of run.enemies) {
      const current = Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y);
      if (!target || (enemy.marked && !target.marked) || (Boolean(enemy.marked) === Boolean(target.marked) && current < distance)) {
        distance = current;
        target = enemy;
      }
    }
    const hero = heroes[run.heroId];
    if (!target || distance > hero.range) return;
    let damage = hero.attack + run.bless.power * 2;
    if (target.marked) {
      damage += 18;
      target.marked -= 1;
    }
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
    run.attackCool = run.heroId === "fia" ? 0.34 : run.heroId === "orla" ? 0.78 : run.heroId === "taro" ? 0.9 : 0.6;
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
    playSound("success");
    renderBlessings(false);
    setChoiceModal(true);
  }

  function blessingPool(rerolled) {
    if (rerolled) {
      return [
        { id: "power", amount: 2, img: "animal-hero-trials-icon-roaring-mane.webp", name: localizedValue("Sovereign Courage", "王者勇氣", "Valor Soberano"), copy: localizedValue("Attack power +2", "攻擊威力 +2", "Poder de ataque +2") },
        { id: "speed", amount: 2, img: "animal-hero-trials-icon-comet-dash.webp", name: localizedValue("Comet Tempo", "彗星節奏", "Tempo de Cometa"), copy: localizedValue("Cooldown -1.0s", "冷卻時間 -1.0 秒", "Recarga -1,0 s") },
        { id: "heal", amount: 2, img: "animal-hero-trials-icon-moon-mark.webp", name: localizedValue("Full Moon Recovery", "滿月復甦", "Recuperación de Luna Llena"), copy: localizedValue("Recover 48 HP", "恢復 48 生命", "Recupera 48 PV") },
      ];
    }
    return [
      { id: "power", amount: 1, img: "animal-hero-trials-icon-roaring-mane.webp", name: localizedValue("Roaring Power", "怒吼之力", "Poder del Rugido"), copy: localizedValue("Attack power +1", "攻擊威力 +1", "Poder de ataque +1") },
      { id: "speed", amount: 1, img: "animal-hero-trials-icon-comet-dash.webp", name: localizedValue("Comet Rhythm", "彗星律動", "Ritmo de Cometa"), copy: localizedValue("Cooldown -0.5s", "冷卻時間 -0.5 秒", "Recarga -0,5 s") },
      { id: "heal", amount: 1, img: "animal-hero-trials-icon-moon-mark.webp", name: localizedValue("Moon Recovery", "月光恢復", "Recuperación Lunar"), copy: localizedValue("Recover 24 HP", "恢復 24 生命", "Recupera 24 PV") },
    ];
  }

  function renderBlessings(rerolled) {
    blessingDecisionCommitted = false;
    const options = blessingPool(rerolled);
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
        playSound("upgrade");
        trackTrialEvent("blessing_pick", {
          stage: run.stage,
          room: run.room,
          hero_id: run.heroId,
          blessing_id: option.id,
          rerolled,
        });
        run.bless[option.id] += option.amount;
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
    button.disabled = run.rerollUsed;
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
    playSound("coin");
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
    backgroundSuspended = false;
    run.active = false;
    cancelAnimationFrame(frame);
    resultDecisionCommitted = false;
    $("#resultHome").hidden = false;
    $("#resultHome").disabled = false;
    $("#resultNext").hidden = false;
    $("#resultNext").disabled = !won || run.stage >= TRIAL_COUNT;
    resultReplay.hidden = false;
    resultReplay.disabled = false;
    $("#resultHome").textContent = t("stages");
    $("#resultNext").textContent = t("next");
    resultReplay.textContent = t("replay");
    $("#resultHome").setAttribute("aria-label", t("stages"));
    $("#resultNext").setAttribute("aria-label", t("next"));
    resultReplay.setAttribute("aria-label", t("replay"));
    const resultPrimary = won && run.stage < TRIAL_COUNT
      ? $("#resultNext")
      : won
        ? $("#resultHome")
        : resultReplay;
    [$("#resultHome"), $("#resultNext"), resultReplay].forEach((button) => {
      button.classList.toggle("primary", button === resultPrimary);
    });
    $("#resultHome").onclick = () => commitResultDecision(() => {
      playSound("click");
      show("stage");
      focusStage(Math.min(TRIAL_COUNT, unlocked));
    });
    resultReplay.onclick = () => commitResultDecision(() => {
      trackTrialEvent("trial_replay", { stage: run.stage, hero_id: run.heroId });
      startTrial(run.stage, "replay");
    });
    if (won) {
      const gain = run.definition.reward;
      const previousUnlocked = unlocked;
      marks += gain;
      unlocked = Math.max(unlocked, Math.min(TRIAL_COUNT, run.stage + 1));
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
    setResultModal(true, resultPrimary);
    playSound(won ? "win" : "wrong");
  }

  function loop(now) {
    if (!run?.active) return;
    const dt = Math.min(0.033, (now - run.last) / 1000);
    run.last = now;
    run.time += dt;
    const { x: dx, y: dy } = movementIntent();
    const length = Math.hypot(dx, dy) || 1;
    const moving = Boolean(dx || dy);
    const heroSpeed = heroes[run.heroId].speed;
    run.leo.x = Math.max(worldX(35), Math.min(worldX(355), run.leo.x + (dx / length) * heroSpeed * dt));
    run.leo.y = Math.max(80, Math.min(520, run.leo.y + (dy / length) * heroSpeed * dt));
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

    const reinforcements=[];
    for (const enemy of run.enemies) {
      const ex = run.leo.x - enemy.x;
      const ey = run.leo.y - enemy.y;
      const distance = Math.hypot(ex, ey) || 1;
      enemy.cd -= dt;
      enemy.special=(enemy.special||0)-dt;
      enemy.open=Math.max(0,(enemy.open||0)-dt);
      enemy.slow=Math.max(0,(enemy.slow||0)-dt);
      const profile=enemy.boss?null:enemyProfiles[enemy.type]||enemyProfiles.scout;
      let moveX=ex/distance; let moveY=ey/distance; let moveSpeed=enemy.boss?22:profile.speed;

      if(enemy.type==="raven"){
        const side=(Math.floor(enemy.x+enemy.y)%2?1:-1);
        moveX=(ex/distance)*.72-(ey/distance)*.55*side;
        moveY=(ey/distance)*.72+(ex/distance)*.55*side;
      }
      if(enemy.type==="hunter"){
        if(distance<128){ moveX=-ex/distance; moveY=-ey/distance; }
        else if(distance<188){ moveX=0; moveY=0; }
        if(distance<profile.range&&enemy.cd<=0){ hurt(profile.damage); enemy.cd=1.7; run.fx.push({type:"shadow",x:run.leo.x,y:run.leo.y,t:.3}); }
      }
      if(enemy.type==="boar"){
        if(enemy.warning>0){ enemy.warning-=dt; moveSpeed=0; if(enemy.warning<=0){ enemy.open=.9; enemy.special=3.2; moveSpeed=105; } }
        else if(enemy.special<=0){ enemy.warning=.65; run.fx.push({type:"roar",x:enemy.x,y:enemy.y,t:.65}); moveSpeed=0; }
        else if(enemy.open>0) moveSpeed=105;
      }

      if(enemy.boss){
        const rule=enemy.bossRule;
        if(rule==="prism"){
          if(enemy.special<=0){ enemy.guard=enemy.guard>0?0:3; enemy.special=enemy.guard>0?3.2:1.8; run.fx.push({type:"roar",x:enemy.x,y:enemy.y,t:.45}); }
        } else if(rule==="charge"){
          if(enemy.warning>0){ enemy.warning-=dt; moveSpeed=0; if(enemy.warning<=0){ enemy.open=1.1; enemy.special=3.4; moveSpeed=118; } }
          else if(enemy.special<=0){ enemy.warning=.8; moveSpeed=0; run.fx.push({type:"roar",x:enemy.x,y:enemy.y,t:.8}); }
          else if(enemy.open>0) moveSpeed=118;
        } else if(rule==="volley"){
          moveSpeed=18;
          if(enemy.special<=0){ if(distance<285) hurt(8); enemy.special=2.5; run.fx.push({type:"shadow",x:run.leo.x,y:run.leo.y,t:.45}); }
        } else if(rule==="summon"){
          if(!enemy.summoned&&enemy.hp/enemy.max<.55){ enemy.summoned=true; for(let i=0;i<2;i+=1) reinforcements.push({x:worldX(90+i*210),y:120,hp:54,max:54,cd:0,type:i?"boar":"scout",special:1.4,warning:0,guard:0,phase:0,hitFlash:0,hitOffsetX:0,hitOffsetY:0,animSeed:i * 2.1 + 4}); }
          if(enemy.special<=0){ if(distance<170) hurt(9); enemy.special=3.2; run.fx.push({type:"roar",x:enemy.x,y:enemy.y,t:.55}); }
        } else if(rule==="crown"){
          const ratio=enemy.hp/enemy.max;
          if(ratio<.66&&enemy.phase===0){ enemy.phase=1; enemy.guard=2; enemy.special=1.4; }
          if(ratio<.33&&enemy.phase===1){ enemy.phase=2; enemy.guard=0; reinforcements.push({x:worldX(85),y:120,hp:62,max:62,cd:0,type:"raven",special:1,warning:0,guard:0,phase:0,hitFlash:0,hitOffsetX:0,hitOffsetY:0,animSeed:5},{x:worldX(305),y:120,hp:62,max:62,cd:0,type:"armored",special:1,warning:0,guard:2,phase:0,hitFlash:0,hitOffsetX:0,hitOffsetY:0,animSeed:7}); }
          if(enemy.special<=0){ if(distance<210) hurt(enemy.phase===2?12:9); enemy.special=enemy.phase===2?2.2:3; run.fx.push({type:"shadow",x:run.leo.x,y:run.leo.y,t:.5}); }
        } else {
          if(enemy.warning>0){ enemy.warning-=dt; if(enemy.warning<=0){ if(distance<155) hurt(11); run.fx.push({type:"shadow",x:run.leo.x,y:run.leo.y,t:.38}); } }
          else if(enemy.special<=0){ enemy.warning = 0.7; enemy.special=4.2; run.fx.push({type:"roar",x:enemy.x,y:enemy.y,t:.7}); }
        }
      }

      const slowedMoveSpeed = moveSpeed * (enemy.slow > 0 ? 0.55 : 1);
      enemy.x=Math.max(worldX(32),Math.min(worldX(358),enemy.x+moveX*slowedMoveSpeed*dt));
      enemy.y=Math.max(70,Math.min(525,enemy.y+moveY*slowedMoveSpeed*dt));
      enemy.hitFlash = Math.max(0, (enemy.hitFlash || 0) - dt);
      enemy.hitOffsetX *= Math.max(0, 1 - dt * 12);
      enemy.hitOffsetY *= Math.max(0, 1 - dt * 12);
      const contactRange=enemy.boss?54:profile.range;
      if(enemy.type!=="hunter"&&distance<contactRange&&enemy.cd<=0){ hurt(enemy.boss?7:profile.damage); enemy.cd=1; run.fx.push({type:"shadow",x:run.leo.x,y:run.leo.y,t:.3}); }
    }
    if(reinforcements.length) run.enemies.push(...reinforcements);
    autoAttack();
    run.enemies = run.enemies.filter((enemy) => enemy.hp > 0);
    run.fx.forEach((effect) => {
      effect.t -= dt;
      if (effect.type === "damage") {
        effect.y += (effect.vy || -30) * dt;
        effect.vy = (effect.vy || -30) + 58 * dt;
      }
    });
    run.fx = run.fx.filter((effect) => effect.t > 0);
    if (run.hp <= 0) return finish(false);
    if (!run.enemies.length) return run.room >= 3 ? finish(true) : chooseBlessing();
    draw();
    updateHud();
    frame = requestAnimationFrame(loop);
  }

  function draw() {
    ctx.save();
    if (run.shake > 0) {
      const shake = run.shake * 34;
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    }
    ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    ctx.drawImage(images.bg, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    if (moveTarget) {
      const pulse = 1 + Math.sin(run.time * 8) * 0.12;
      ctx.strokeStyle = "#ffe88a";
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(moveTarget.x, moveTarget.y, 16 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(moveTarget.x, moveTarget.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffe88a";
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    if (run.room === 1 && run.guidanceTimer > 0 && (run.guidancePhase === "range" || run.guidancePhase === "hit")) {
      let target = null;
      let distance = Infinity;
      for (const enemy of run.enemies) {
        const current = Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y);
        if (!target || (enemy.marked && !target.marked) || (Boolean(enemy.marked) === Boolean(target.marked) && current < distance)) {
          target = enemy;
          distance = current;
        }
      }
      if (target) {
        canvas.dataset.guidanceTarget = String(run.enemies.indexOf(target));
        const pulse = 1 + Math.sin(run.time * 7) * 0.08;
        const guideColor = run.guidancePhase === "hit" ? "#7be0b1" : "#7cecff";
        ctx.save();
        ctx.globalAlpha = run.guidancePhase === "hit" ? 0.85 : 0.72;
        ctx.strokeStyle = guideColor;
        ctx.lineWidth = 3;
        ctx.setLineDash([9, 7]);
        ctx.beginPath();
        ctx.arc(run.leo.x, run.leo.y, heroes[run.heroId].range, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(target.x, target.y, 45 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.32;
        ctx.beginPath();
        ctx.moveTo(run.leo.x, run.leo.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        ctx.restore();
      }
    }

    for (const enemy of run.enemies) {
      const enemyImage = enemy.boss ? images[`boss-${enemy.bossId}`] : images[`enemy-${enemy.type}`] || images.enemy;
      const size = enemy.boss ? 126 : enemy.elite ? 82 : 68;
      const bob = Math.sin(run.time * (enemy.boss ? 2.1 : 3.5) + (enemy.animSeed || 0)) * (enemy.boss ? 2 : 3);
      const drawX = enemy.x + (enemy.hitOffsetX || 0);
      const drawY = enemy.y + (enemy.hitOffsetY || 0) + bob;
      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.rotate(Math.sin(run.time * 3 + (enemy.animSeed || 0)) * 0.025);
      ctx.drawImage(enemyImage, -size / 2, -size / 2, size, size);
      ctx.restore();
      if ((enemy.hitFlash || 0) > 0) {
        ctx.globalAlpha = Math.min(0.62, enemy.hitFlash * 4);
        ctx.fillStyle = "#fff7dc";
        ctx.beginPath();
        ctx.arc(drawX, drawY, size * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = "#17231f";
      const barWidth = enemy.boss ? 100 : 56;
      const barY = drawY - size / 2 - 9;
      ctx.fillRect(drawX - barWidth / 2, barY, barWidth, 6);
      ctx.fillStyle = "#7be0b1";
      ctx.fillRect(drawX - barWidth / 2, barY, (barWidth * enemy.hp) / enemy.max, 6);
      if(enemy.guard>0){ ctx.strokeStyle="#78e9ff"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(drawX,drawY,size*.48,0,Math.PI*2); ctx.stroke(); }
      if(enemy.warning>0){ ctx.strokeStyle="#ffd45f"; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(drawX,drawY,size*.58,0,Math.PI*2); ctx.stroke(); }
      if (enemy.marked) {
        ctx.strokeStyle = "#7cecff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(drawX, drawY - size / 2 - 18, 9, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    const hero = heroes[run.heroId];
    const heroWidth = run.heroId === "taro" ? 94 : run.heroId === "orla" ? 82 : 78;
    const heroHeight = run.heroId === "taro" ? 78 : 90;
    const moving = Boolean(moveTarget || Object.values(keys).some(Boolean));
    const heroBob = moving ? Math.sin(run.stepPhase) * 3 : Math.sin(run.time * 2.2) * 1.2;
    const heroX = run.leo.x - (run.heroKick > 0 ? run.lastMoveX * 5 : 0);
    const heroY = run.leo.y + heroBob - (run.heroKick > 0 ? run.lastMoveY * 3 : 0);
    ctx.fillStyle = "#06171299";
    ctx.beginPath();
    ctx.ellipse(run.leo.x, run.leo.y + heroHeight * 0.42, heroWidth * (moving ? 0.46 : 0.4), 8, 0, 0, Math.PI * 2);
    ctx.fill();
    if (run.heroFlash > 0) {
      ctx.globalAlpha = Math.min(0.55, run.heroFlash * 2.4);
      ctx.fillStyle = "#ff5e66";
      ctx.beginPath();
      ctx.arc(heroX, heroY, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.globalAlpha = run.invulnerable > 0 ? 0.72 : 1;
    ctx.save();
    ctx.translate(heroX, heroY);
    ctx.rotate(Math.max(-0.08, Math.min(0.08, run.lastMoveX * 0.08)));
    ctx.scale(1 + (moving ? Math.sin(run.stepPhase) * 0.025 : 0), 1 - (moving ? Math.sin(run.stepPhase) * 0.025 : 0));
    ctx.drawImage(images[hero.image], -heroWidth / 2, -heroHeight / 2, heroWidth, heroHeight);
    ctx.restore();
    ctx.globalAlpha = 1;
    if (run.guard > 0) {
      ctx.strokeStyle = "#55e0b1";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(heroX, heroY, 56, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const effect of run.fx) {
      if (effect.type === "damage") {
        ctx.globalAlpha = Math.min(1, effect.t * 3);
        ctx.fillStyle = effect.source === "hurt" ? "#ff8b8b" : effect.source === "skill" ? "#ffe88a" : "#fff7dc";
        ctx.font = "900 20px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#13211b";
        ctx.strokeText(`-${effect.value}`, effect.x, effect.y);
        ctx.fillText(`-${effect.value}`, effect.x, effect.y);
        ctx.globalAlpha = 1;
        continue;
      }
      if (effect.type === "slash") {
        const alpha = Math.min(1, effect.t * 8);
        const dx = effect.x - effect.fromX;
        const dy = effect.y - effect.fromY;
        const distance = Math.hypot(dx, dy) || 1;
        const px = -dy / distance;
        const py = dx / distance;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "#fff2ad";
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(effect.x - dx * 0.28 + px * 22, effect.y - dy * 0.28 + py * 22);
        ctx.lineTo(effect.x + px * 22, effect.y + py * 22);
        ctx.stroke();
        ctx.globalAlpha = 1;
        continue;
      }
      const image = effect.type === "roar" ? images.roar : effect.type === "hit" ? images.hit : images.shadow;
      const size = effect.type === "roar" ? 180 : 74;
      ctx.globalAlpha = Math.min(1, effect.t * 4);
      ctx.drawImage(image, effect.x - size / 2, effect.y - size / 2, size, size);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function bindTapMove() {
    const setTarget = (event) => {
      const rect = canvas.getBoundingClientRect();
      moveTarget = {
        x: Math.max(worldX(35), Math.min(worldX(355), ((event.clientX - rect.left) / rect.width) * canvas.width)),
        y: Math.max(80, Math.min(520, ((event.clientY - rect.top) / rect.height) * canvas.height)),
      };
    };
    canvas.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false) return;
      if (pointer !== null && pointer !== event.pointerId) return;
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      beginRangeGuidance();
      pointer = event.pointerId;
      canvas.setPointerCapture?.(pointer);
      setTarget(event);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (pointer === event.pointerId) setTarget(event);
    });
    const release = (event) => {
      if (pointer !== event.pointerId) return;
      pointer = null;
      if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", (event) => {
      if (pointer === event.pointerId) clearMovementInput();
    });
    canvas.addEventListener("lostpointercapture", (event) => {
      if (pointer === event.pointerId) clearMovementInput();
    });
  }

  const localeSelect = $("#locale") || $("#localeSelect");
  localeSelect.value = locale;
  localeSelect.onchange = (event) => {
    const requested = canonicalLocale(event.target.value);
    window.WonderI18n?.setLocale?.(requested);
    locale = requested;
    writeStorage("weightPlayLocale", requested);
    if (!ownedLocales.has(requested) && window.WeightPlayGameRuntimeLocalizer?.locale !== requested) {
      window.location.reload();
      return;
    }
    localize();
  };
  const soundToggle = $("#soundToggle");
  if (soundToggle) {
    soundToggle.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    soundToggle.onclick = () => {
      window.WonderSound?.unlock?.();
      window.WonderSound?.setMuted?.(!window.WonderSound?.isMuted?.());
      syncSoundToggle();
    };
  }
  $("#startBtn").addEventListener("keydown", (event) => { if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault(); });
  $("#stageRail").addEventListener("keydown", (event) => {
    const card = event.target.closest(".stage-card");
    if (!card) return;
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    const cards = $$("#stageRail .stage-card");
    const current = cards.indexOf(card);
    const targetIndex = event.key === "ArrowRight"
      ? Math.min(cards.length - 1, current + 1)
      : event.key === "ArrowLeft"
        ? Math.max(0, current - 1)
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? cards.length - 1
            : -1;
    if (targetIndex < 0) return;
    event.preventDefault();
    setStageTabStop(cards[targetIndex], true);
  });
  $("#stageRail").addEventListener("focusin", (event) => {
    const card = event.target.closest(".stage-card");
    if (card) setStageTabStop(card);
  });
  $("#startBtn").onclick = () => { playSound("click"); show("stage"); focusStage(); };
  $("#stageBack").onclick = () => { playSound("click"); show("main"); focusMain(); };
  $("#battleBack").onclick = openQuitDecision;
  $("#skillBtn").onclick = skill;
  $("#skillBtn").addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  $("#rerollBtn").addEventListener("keydown",(event)=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});
  $("#rerollBtn").onclick = rerollBlessings;
  $("#quitKeep").onclick = () => closeQuitDecision(true);
  $("#quitLeave").onclick = () => {
    const stage = run?.stage || Math.min(TRIAL_COUNT, unlocked);
    closeQuitDecision(false, false);
    playSound("click");
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
  stageRail?.addEventListener("scroll",scheduleCenteredStageCard,{passive:true});
  stageRail?.addEventListener("wonder:stage-snap",scheduleCenteredStageCard);
  addEventListener("resize",scheduleCenteredStageCard);
  if (stagePreparation && progressCard && stageRail && !stagePreparation.contains(progressCard)) {
    stagePreparation.insertBefore(progressCard, stageRail);
  }
  $("#masteryBtn").addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  $("#masteryBtn").onclick = () => {
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
      playSound("upgrade");
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
    beginRangeGuidance();
    if (event.code === "Space") skill();
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
  bindTapMove();
  if (new URLSearchParams(location.search).has("smoke")) window.__heroTrialSmoke = {
    definitions:()=>trials.map((trial)=>({stage:trial.stage,region:trial.region,titleEn:trial.titleEn,titleZh:trial.titleZh,checkpoint:trial.checkpoint,enemies:[...trial.enemies],encounters:trial.encounters.map((encounter)=>({...encounter,types:[...encounter.types]})),recommended:trial.recommended,reward:trial.reward,boss:trial.boss?{id:trial.boss.id,nameEn:trial.boss.name[0],nameZh:trial.boss.name[1],asset:trial.boss.asset,rule:trial.boss.rule}:null})),
    prepare:(stage,room=1)=>{ unlocked=TRIAL_COUNT; startTrial(stage); run.room=Math.max(1,Math.min(3,room)); spawn(); return window.__heroTrialSmoke.snapshot(); },
    damageFirst:(amount=20,source="auto")=>{ const enemy=run?.enemies[0]; return enemy?{applied:damageEnemy(enemy,amount,source),enemy:{...enemy}}:null; },
    forceRoomClear:()=>{ if(!run) return null; run.enemies=[]; if(run.room>=3) finish(true); else chooseBlessing(); return window.__heroTrialSmoke.snapshot(); },
    setCooldown:(value=0)=>{ if(!run) return null; run.cool=Math.max(0,Number(value)||0); updateHud(); return window.__heroTrialSmoke.snapshot(); },
    setHealth:(value)=>{ if(!run) return null; run.hp=Math.max(0,Math.min(run.maxHp,Number(value)||0)); updateHud(); return window.__heroTrialSmoke.snapshot(); },
    snapshot: () => ({ pointer, moveTarget: moveTarget ? { ...moveTarget } : null, stick: { ...stick }, active: Boolean(run?.active), hp: run?.hp ?? null, cooldown: run?.cool ?? null, player: run ? { ...run.leo } : null, run:run?{stage:run.stage,room:run.room,checkpoint:run.definition.checkpoint,boss:run.definition.boss?.id||null,guidancePhase:run.guidancePhase,guidanceTimer:run.guidanceTimer,firstAutoAttack:run.firstAutoAttack,attackRange:heroes[run.heroId].range}:null, visual:run?{shake:run.shake,heroFlash:run.heroFlash,heroKick:run.heroKick,effects:run.fx.map((effect)=>({type:effect.type,value:effect.value||0,t:effect.t}))}:null, unlocked,marks, enemies: run?.enemies.map((enemy) => ({ x: enemy.x, y: enemy.y, hp: enemy.hp,max:enemy.max,type:enemy.type,bossId:enemy.bossId||null,bossRule:enemy.bossRule||null,guard:enemy.guard||0,warning:enemy.warning||0,phase:enemy.phase||0,hitFlash:enemy.hitFlash||0,hitOffsetX:enemy.hitOffsetX||0,hitOffsetY:enemy.hitOffsetY||0 })) || [] })
  };
  localize();
})();
