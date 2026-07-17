(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const ASSET_ROOT = "../../assets/";
  const copy = {
    en: {
      title: "Animal Hero Trials",
      pitch: "Guide Leo through three forest trials and choose a blessing after every room.",
      marks: "Trial Marks",
      mastery: "Heart Mastery",
      start: "Start Trial",
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
    },
    "zh-Hant": {
      title: "動物英雄試煉",
      pitch: "帶領獅子里歐通過三個森林試煉，每個房間結束後選擇一項祝福。",
      marks: "試煉印記",
      mastery: "勇氣精通",
      start: "開始試煉",
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
    earnedMarks: "+{gain} Trial Marks · Total {total}.",
    trialUnlocked: "Trial {next} unlocked.",
    trialAvailable: "Trial {next} remains available.",
    allTrialsUnlocked: "All 30 trials are unlocked.",
    enemyObjective: "Defeat {count} {enemy}",
    eliteObjective: "Defeat the {enemy} captain",
    bossObjectiveNamed: "Defeat {boss}",
    recommended: "Recommended: {hero}",
    roomsAndMarks: "3 rooms · +{marks} marks",
    masteryReady: "Heart Mastery is ready on Main.",
    masteryNeed: "Heart Mastery needs {remaining} more Trial Marks.",
    masteryUpgradeReady: "All heroes Max HP +{current} → +{next} · Spend {cost} / Have {marks} marks",
    masteryUpgradeNeed: "All heroes Max HP +{current} → +{next} · Need {cost} / Have {marks} marks",
  });
  Object.assign(copy["zh-Hant"], {
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
    masteryReady: "\u53ef\u56de\u4e3b\u756b\u9762\u5347\u7d1a\u52c7\u6c23\u7cbe\u901a\u3002",
    masteryNeed: "\u52c7\u6c23\u7cbe\u901a\u9084\u9700\u8981 {remaining} \u679a\u8a66\u7149\u5370\u8a18\u3002",
    masteryUpgradeReady: "\u5168\u82f1\u96c4\u6700\u5927\u751f\u547d +{current} \u2192 +{next} \u00b7 \u6d88\u8017 {cost} / \u6301\u6709 {marks} \u679a",
    masteryUpgradeNeed: "\u5168\u82f1\u96c4\u6700\u5927\u751f\u547d +{current} \u2192 +{next} \u00b7 \u9700\u8981 {cost} / \u6301\u6709 {marks} \u679a",
    scoutObjective: "\u64ca\u6557 {count} \u96bb\u6697\u5f71\u65a5\u5019",
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
  const trials = Array.from({length:TRIAL_COUNT},(_,index)=>{ const stage=index+1; const region=Math.floor(index/5); return { stage, region, titleEn:trialTitles[index][0], titleZh:trialTitles[index][1], checkpoint:stage%5===0, enemies:[...regions[region].enemies], recommended:regions[region].hero, reward:Math.min(9,3+stage), boss:stage%5===0?bosses[region]:null }; });

  let locale = window.WonderI18n?.locale?.() || localStorage.getItem("weightPlayLocale") || "en";
  let selectedHero = localStorage.getItem("aht-selected-hero") || "leo";
  let unlocked = Math.max(1, Math.min(TRIAL_COUNT, +(localStorage.getItem("aht-unlocked") || 1)));
  let marks = +(localStorage.getItem("aht-marks") || 0);
  let mastery = +(localStorage.getItem("aht-mastery") || 0);
  let run = null;
  let frame = 0;
  let rerollConfirmTimer = 0;
  let pointer = null;
  let backgroundSuspended = false;
  const keys = {};
  const battleControlCodes = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyW", "KeyS", "Space"]);
  let stick = { x: 0, y: 0 };

  function clearMovementInput() {
    Object.keys(keys).forEach((key) => { keys[key] = false; });
    stick = { x: 0, y: 0 };
    const joystick = $("#joystick");
    const nub = joystick?.querySelector("i");
    const ownedPointer = pointer;
    pointer = null;
    if (ownedPointer !== null && joystick?.hasPointerCapture?.(ownedPointer)) joystick.releasePointerCapture(ownedPointer);
    if (nub) nub.style.transform = "";
  }

  const views = {
    main: $("#mainView"),
    stage: $("#stageView"),
    battle: $("#battleView"),
  };
  const canvas = $("#game");
  const ctx = canvas.getContext("2d");

  function suspendBackgroundBattle() {
    clearMovementInput();
    if (!run?.active || document.body.dataset.gameView !== "battle") return;
    backgroundSuspended = true;
    run.active = false;
    cancelAnimationFrame(frame);
  }

  function resumeBackgroundBattle() {
    if (!backgroundSuspended || !run || document.hidden || document.body.dataset.gameView !== "battle") return;
    if (!$("#choiceModal").classList.contains("hidden") || !$("#resultModal").classList.contains("hidden")) return;
    backgroundSuspended = false;
    run.active = true;
    run.last = performance.now();
    loop(run.last);
    requestAnimationFrame(() => $("#game").focus({ preventScroll: true }));
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
    leo: { image: "leo", asset: "animal-hero-trials-leo.png", hp: 100, speed: 125, attack: 10, range: 76, skill: { en: "ROAR", zh: "怒吼" } },
    fia: { image: "fia", asset: "animal-hero-trials-fia.webp", hp: 86, speed: 145, attack: 11, range: 72, skill: { en: "DASH", zh: "彗星衝刺" } },
    orla: { image: "orla", asset: "animal-hero-trials-orla.webp", hp: 82, speed: 112, attack: 8, range: 165, skill: { en: "MARK", zh: "月之印記" } },
    taro: { image: "taro", asset: "animal-hero-trials-taro.webp", hp: 126, speed: 92, attack: 8, range: 76, skill: { en: "GUARD", zh: "庭園守護" } },
  };

  function load(filename) {
    const image = new Image();
    image.src = ASSET_ROOT + filename;
    return image;
  }

  function t(key) {
    return copy[locale]?.[key] || copy.en[key] || key;
  }

  function playSound(cue) {
    window.WonderSound?.play?.(cue);
  }

  function roomLabel(room, boss = false) {
    if (locale === "zh-Hant") return `\u623f\u9593 ${room}/3${boss ? " \u00b7 \u9996\u9818" : ""}`;
    return interpolate(boss ? "bossRoom" : "room", { room });
  }

  function interpolate(key, values) {
    return t(key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
  }

  function heroName(heroId) {
    return heroId.charAt(0).toUpperCase() + heroId.slice(1);
  }

  function localizedPair(pair) { return pair[locale === "zh-Hant" ? 1 : 0]; }
  function trialDefinition(stage) { return trials[Math.max(0,Math.min(TRIAL_COUNT-1,Number(stage)-1))] || trials[0]; }

  function show(name) {
    clearRerollConfirmation();
    clearMovementInput();
    document.body.dataset.gameView = name;
    Object.entries(views).forEach(([key, view]) => {
      view.classList.toggle("hidden", key !== name);
    });
    setChoiceModal(false, false);
    setResultModal(false, false);
    if (name !== "battle") {
      backgroundSuspended = false;
      cancelAnimationFrame(frame);
      if (run) run.active = false;
    }
  }

  function resultCoveredLayers() {
    return [...$("#battleView").children].filter((node) => node.id !== "resultModal");
  }

  function choiceCoveredLayers() {
    return [...$("#battleView").children].filter((node) => !["choiceModal", "resultModal", "battleAd"].includes(node.id));
  }

  function setChoiceModal(open, focusPrimary = true) {
    if (open) clearMovementInput();
    $("#choiceModal").classList.toggle("hidden", !open);
    choiceCoveredLayers().forEach((layer) => {
      layer.inert = open;
      if (open) layer.setAttribute("aria-hidden", "true");
      else layer.removeAttribute("aria-hidden");
    });
    if (open && focusPrimary) requestAnimationFrame(() => $("#choices .choice")?.focus({ preventScroll: true }));
  }

  function setResultModal(open, focusPrimary = true) {
    if (open) clearMovementInput();
    $("#resultModal").classList.toggle("hidden", !open);
    resultCoveredLayers().forEach((layer) => {
      layer.inert = open;
      if (open) layer.setAttribute("aria-hidden", "true");
      else layer.removeAttribute("aria-hidden");
    });
    if (open && focusPrimary) requestAnimationFrame(() => $("#resultNext").focus({ preventScroll: true }));
  }

  function localize() {
    document.documentElement.lang = locale;
    document.title = locale === "zh-Hant" ? "動物英雄試煉 - WeightPlay" : "Animal Hero Trials - WeightPlay";
    $("#game").setAttribute("aria-label", t("arenaLabel"));
    $$('[data-t]').forEach((node) => {
      node.textContent = t(node.dataset.t);
    });
    $("#markCount").textContent = marks;
    $("#masteryLevel").textContent = `Lv.${mastery}`;
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
    $("#masteryBtn").setAttribute("aria-label", `${t("mastery")}, Lv.${mastery}. ${masterySummary}`);
    renderHeroPicker();
    renderStages();
  }

  function renderHeroPicker() {
    const picker = $("#heroPicker");
    if (!picker) return;
    const focusedHero = document.activeElement?.closest?.(".hero-option")?.dataset.hero || "";
    const labels = {
      leo: [localizedPair(heroNames.Leo), locale === "zh-Hant" ? "均衡 · 100 生命" : "Balanced · 100 HP", locale === "zh-Hant" ? "近距離暈眩" : "Close-range stun"],
      fia: [localizedPair(heroNames.Fia), locale === "zh-Hant" ? "高速 · 86 生命" : "Fast · 86 HP", locale === "zh-Hant" ? "無敵衝刺" : "Invulnerable dash"],
      orla: [localizedPair(heroNames.Orla), locale === "zh-Hant" ? "遠程 · 82 生命" : "Ranged · 82 HP", locale === "zh-Hant" ? "標記增傷" : "Mark bonus damage"],
      taro: [localizedPair(heroNames.Taro), locale === "zh-Hant" ? "耐久 · 126 生命" : "Tank · 126 HP", locale === "zh-Hant" ? "守護減傷" : "Damage guard"],
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
        localStorage.setItem("aht-selected-hero", id);
        renderHeroPicker();
      };
      picker.append(button);
    });
    if (focusedHero) requestAnimationFrame(() => {
      picker.querySelector(`.hero-option[data-hero="${focusedHero}"]`)?.focus({ preventScroll: true });
    });
  }

  function renderStages() {
    const rail = $("#stageRail");
    rail.innerHTML = "";
    for (let stage = 1; stage <= TRIAL_COUNT; stage += 1) {
      const definition=trialDefinition(stage);
      const region=regions[definition.region];
      const button = document.createElement("button");
      button.className = `stage-card${stage > unlocked ? " locked" : ""}${definition.checkpoint ? " checkpoint" : ""}`;
      button.dataset.stage = String(stage);
      const detail = stage > unlocked ? t("locked") : interpolate("roomsAndMarks",{marks:definition.reward});
      const title=locale==="zh-Hant"?definition.titleZh:definition.titleEn;
      const rule=localizedPair(region.rule);
      const boss=definition.boss?` · ${localizedPair(definition.boss.name)}`:"";
      button.innerHTML = `<img src="${ASSET_ROOT}${definition.boss?.asset || "animal-hero-trials-arena.png"}" alt=""><strong>${locale==="zh-Hant"?"試煉":"Trial"} ${stage} · ${title}</strong><span>${detail}<br>${rule}${boss}<br>${interpolate("recommended",{hero:localizedPair(heroNames[definition.recommended])})}</span>`;
      button.onclick = () => stage <= unlocked && startTrial(stage);
      rail.append(button);
    }
  }

  function focusStage(stage = Math.min(TRIAL_COUNT, unlocked)) {
    requestAnimationFrame(() => $(`#stageRail .stage-card[data-stage="${stage}"]`)?.focus({ preventScroll: true }));
  }

  function focusMain() {
    requestAnimationFrame(() => $("#startBtn").focus({ preventScroll: true }));
  }

  function save() {
    localStorage.setItem("aht-unlocked", unlocked);
    localStorage.setItem("aht-marks", marks);
    localStorage.setItem("aht-mastery", mastery);
  }

  function startTrial(stage) {
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
      leo: { x: 195, y: 430 },
      heroId: selectedHero,
      enemies: [],
      cool: 0,
      attackCool: 0,
      invulnerable: 0,
      guard: 0,
      rerollUsed: false,
      rerollPending: false,
      last: performance.now(),
      bless: { power: 0, speed: 0, heal: 0 },
      fx: [],
    };
    $("#skillBtn img").src = ASSET_ROOT + hero.asset;
    spawn();
    playSound("start");
    $("#game").focus({ preventScroll: true });
    loop(performance.now());
  }

  function spawn() {
    const definition=run.definition;
    if (run.room === 3 && definition.checkpoint) {
      const boss=definition.boss;
      const hp = 190 + definition.region * 44;
      run.enemies = [{ x:195,y:125,hp,max:hp,cd:0,boss:true,bossId:boss.id,bossRule:boss.rule,type:"boss",special:2.8,warning:0,phase:0,guard:boss.rule==="prism"||boss.rule==="crown"?3:0,summoned:false }];
      $("#roomText").textContent = roomLabel(run.room, true);
      $("#objective").textContent = interpolate("bossObjectiveNamed",{boss:localizedPair(boss.name)});
      updateHud();
      playSound("boss");
      return;
    }
    const elite=run.room===3;
    const count=elite?1:2+run.room;
    run.enemies = Array.from({ length:count }, (_, index) => {
      const type=definition.enemies[(run.room+index-1)%definition.enemies.length];
      const profile=enemyProfiles[type];
      const hp=(elite?92:30)+definition.region*9+run.room*6;
      return { x:elite?195:70+index*(250/Math.max(1,count-1)), y:elite?125:105+(index%2)*90, hp, max:hp, cd:0, type, elite, special:1.6+index*.3, warning:0, guard:(profile.guard||0)+(elite?1:0), phase:0 };
    });
    $("#roomText").textContent = roomLabel(run.room,elite);
    const firstProfile=enemyProfiles[run.enemies[0].type];
    $("#objective").textContent = elite?interpolate("eliteObjective",{enemy:localizedPair(firstProfile.name)}):interpolate("enemyObjective",{count:run.enemies.length,enemy:localizedPair(firstProfile.name)});
    updateHud();
    if(elite) playSound("boss");
  }

  function skillEffectLabel() {
    if (run.heroId === "leo") return interpolate("leoSkillEffect", { damage: 24 + run.bless.power * 7 });
    if (run.heroId === "fia") return interpolate("fiaSkillEffect", { damage: 30 + run.bless.power * 6 });
    if (run.heroId === "orla") return interpolate("orlaSkillEffect", { damage: 24 + run.bless.power * 5 });
    return interpolate("taroSkillEffect", { heal: 8 + run.bless.heal * 2, damage: 20 + run.bless.power * 4 });
  }

  function updateHud() {
    $("#hpFill").style.width = `${Math.max(0, (run.hp / run.maxHp) * 100)}%`;
    const skillName = locale === "zh-Hant" ? heroes[run.heroId].skill.zh : heroes[run.heroId].skill.en;
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
    return applied;
  }

  function skill() {
    if (!run?.active || run.cool > 0) return;
    playSound("shoot");
    if (run.heroId === "leo") {
      run.cool = Math.max(2.5, 5 - run.bless.speed * 0.5);
      run.fx.push({ type: "roar", x: run.leo.x, y: run.leo.y, t: 0.45 });
      for (const enemy of run.enemies) {
        if (Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y) < 145) {
          damageEnemy(enemy,24 + run.bless.power * 7,"skill");
          run.fx.push({ type: "hit", x: enemy.x, y: enemy.y, t: 0.3 });
        }
      }
      return;
    }
    if (run.heroId === "fia") {
      run.cool = Math.max(2.2, 4.2 - run.bless.speed * 0.45);
      const skillTarget = [...run.enemies].sort((a, b) => Math.hypot(a.x - run.leo.x, a.y - run.leo.y) - Math.hypot(b.x - run.leo.x, b.y - run.leo.y))[0];
      let dx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0) + stick.x;
      let dy = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0) + stick.y;
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
        }
      }
      if (dashTarget && dashDistance >= 105 && dashDistance < 190) {
        damageEnemy(dashTarget,22 + run.bless.power * 5,"skill");
        run.fx.push({ type: "hit", x: dashTarget.x, y: dashTarget.y, t: 0.25 });
      }
      return;
    }
    if (run.heroId === "orla") {
      run.cool = Math.max(2.5, 4.8 - run.bless.speed * 0.45);
      const target = [...run.enemies].sort((a, b) => Math.hypot(a.x - run.leo.x, a.y - run.leo.y) - Math.hypot(b.x - run.leo.x, b.y - run.leo.y))[0];
      if (target) {
        damageEnemy(target,24 + run.bless.power * 5,"skill");
        target.marked = true;
        run.fx.push({ type: "roar", x: target.x, y: target.y, t: 0.4 });
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
      }
    }
  }

  function hurt(amount) {
    if (run.invulnerable > 0) return;
    run.hp -= run.guard > 0 ? Math.ceil(amount * 0.3) : amount;
  }

  function autoAttack() {
    if (run.attackCool > 0) return;
    let target = null;
    let distance = Infinity;
    for (const enemy of run.enemies) {
      const current = Math.hypot(enemy.x - run.leo.x, enemy.y - run.leo.y);
      if (current < distance) {
        distance = current;
        target = enemy;
      }
    }
    const hero = heroes[run.heroId];
    if (!target || distance > hero.range) return;
    let damage = hero.attack + run.bless.power * 2;
    if (target.marked) {
      damage += 18;
      target.marked = false;
    }
    damageEnemy(target,damage,"auto");
    run.attackCool = 0.58;
    run.fx.push({ type: "hit", x: target.x, y: target.y, t: 0.22 });
  }

  function chooseBlessing() {
    run.active = false;
    playSound("success");
    renderBlessings(false);
    setChoiceModal(true);
  }

  function blessingPool(rerolled) {
    if (rerolled) {
      return [
        { id: "power", amount: 2, img: "animal-hero-trials-icon-roaring-mane.webp", name: locale === "zh-Hant" ? "王者勇氣" : "Sovereign Courage", copy: locale === "zh-Hant" ? "攻擊威力 +2" : "Attack power +2" },
        { id: "speed", amount: 2, img: "animal-hero-trials-icon-comet-dash.webp", name: locale === "zh-Hant" ? "彗星節奏" : "Comet Tempo", copy: locale === "zh-Hant" ? "冷卻時間 -1.0 秒" : "Cooldown -1.0s" },
        { id: "heal", amount: 2, img: "animal-hero-trials-icon-moon-mark.webp", name: locale === "zh-Hant" ? "滿月復甦" : "Full Moon Recovery", copy: locale === "zh-Hant" ? "恢復 48 生命" : "Recover 48 HP" },
      ];
    }
    return [
      { id: "power", amount: 1, img: "animal-hero-trials-icon-roaring-mane.webp", name: locale === "zh-Hant" ? "怒吼之力" : "Roaring Power", copy: locale === "zh-Hant" ? "攻擊威力 +1" : "Attack power +1" },
      { id: "speed", amount: 1, img: "animal-hero-trials-icon-comet-dash.webp", name: locale === "zh-Hant" ? "彗星律動" : "Comet Rhythm", copy: locale === "zh-Hant" ? "冷卻時間 -0.5 秒" : "Cooldown -0.5s" },
      { id: "heal", amount: 1, img: "animal-hero-trials-icon-moon-mark.webp", name: locale === "zh-Hant" ? "月光恢復" : "Moon Recovery", copy: locale === "zh-Hant" ? "恢復 24 生命" : "Recover 24 HP" },
    ];
  }

  function renderBlessings(rerolled) {
    const options = blessingPool(rerolled);
    const box = $("#choices");
    box.innerHTML = "";
    for (const option of options) {
      const button = document.createElement("button");
      button.className = "choice";
      button.dataset.nativeLocalized = "true";
      button.innerHTML = `<img src="${ASSET_ROOT + option.img}" alt=""><span><b>${option.name}</b><br><small>${option.copy}</small></span>`;
      button.onclick = () => {
        clearRerollConfirmation();
        playSound("upgrade");
        run.bless[option.id] += option.amount;
        if (option.id === "heal") run.hp = Math.min(run.maxHp, run.hp + 24 * option.amount);
        setChoiceModal(false, false);
        run.room += 1;
        run.active = true;
        spawn();
        run.last = performance.now();
        loop(performance.now());
        requestAnimationFrame(() => $("#game").focus({ preventScroll: true }));
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
    if (run) run.rerollPending = false;
  }

  function rerollBlessings() {
    if (run.rerollUsed) return updateRerollUi(t("rerollUsed"));
    const balance = window.WeightPlayWallet?.read?.().diamonds || 0;
    if (balance < 3) return updateRerollUi(interpolate("rerollNeed", { balance }));
    if (!run.rerollPending) {
      run.rerollPending = true;
      clearTimeout(rerollConfirmTimer);
      rerollConfirmTimer = setTimeout(() => {
        if (!run?.rerollPending) return;
        run.rerollPending = false;
        updateRerollUi();
      }, 5000);
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
      $("#resultTitle").textContent = t("win");
      $("#resultCopy").textContent = `${interpolate("earnedMarks", { gain, total: marks })} ${unlockCopy} ${masteryCopy}`;
      $("#resultNext").textContent = run.stage < TRIAL_COUNT ? t("next") : t("menu");
      $("#resultNext").onclick = () => {
        if (run.stage < TRIAL_COUNT) startTrial(run.stage + 1);
        else { show("main"); localize(); focusMain(); }
      };
    } else {
      $("#resultTitle").textContent = t("fail");
      $("#resultCopy").textContent = locale === "zh-Hant"
        ? `${heroName(run.heroId)}\u9700\u8981\u518d\u8a66\u4e00\u6b21\u3002`
        : interpolate("failCopy", { hero: heroName(run.heroId) });
      $("#resultNext").textContent = t("retry");
      $("#resultNext").onclick = () => startTrial(run.stage);
    }
    setResultModal(true);
    playSound(won ? "win" : "wrong");
  }

  function loop(now) {
    if (!run?.active) return;
    const dt = Math.min(0.033, (now - run.last) / 1000);
    run.last = now;
    const dx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0) + stick.x;
    const dy = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0) + stick.y;
    const length = Math.hypot(dx, dy) || 1;
    const heroSpeed = heroes[run.heroId].speed;
    run.leo.x = Math.max(35, Math.min(355, run.leo.x + (dx / length) * heroSpeed * dt));
    run.leo.y = Math.max(80, Math.min(520, run.leo.y + (dy / length) * heroSpeed * dt));
    run.cool = Math.max(0, run.cool - dt);
    run.attackCool = Math.max(0, run.attackCool - dt);
    run.invulnerable = Math.max(0, run.invulnerable - dt);
    run.guard = Math.max(0, run.guard - dt);

    const reinforcements=[];
    for (const enemy of run.enemies) {
      const ex = run.leo.x - enemy.x;
      const ey = run.leo.y - enemy.y;
      const distance = Math.hypot(ex, ey) || 1;
      enemy.cd -= dt;
      enemy.special=(enemy.special||0)-dt;
      enemy.open=Math.max(0,(enemy.open||0)-dt);
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
          if(!enemy.summoned&&enemy.hp/enemy.max<.55){ enemy.summoned=true; for(let i=0;i<2;i+=1) reinforcements.push({x:90+i*210,y:120,hp:54,max:54,cd:0,type:i?"boar":"scout",special:1.4,warning:0,guard:0,phase:0}); }
          if(enemy.special<=0){ if(distance<170) hurt(9); enemy.special=3.2; run.fx.push({type:"roar",x:enemy.x,y:enemy.y,t:.55}); }
        } else if(rule==="crown"){
          const ratio=enemy.hp/enemy.max;
          if(ratio<.66&&enemy.phase===0){ enemy.phase=1; enemy.guard=2; enemy.special=1.4; }
          if(ratio<.33&&enemy.phase===1){ enemy.phase=2; enemy.guard=0; reinforcements.push({x:85,y:120,hp:62,max:62,cd:0,type:"raven",special:1,warning:0,guard:0,phase:0},{x:305,y:120,hp:62,max:62,cd:0,type:"armored",special:1,warning:0,guard:2,phase:0}); }
          if(enemy.special<=0){ if(distance<210) hurt(enemy.phase===2?12:9); enemy.special=enemy.phase===2?2.2:3; run.fx.push({type:"shadow",x:run.leo.x,y:run.leo.y,t:.5}); }
        } else {
          if(enemy.warning>0){ enemy.warning-=dt; if(enemy.warning<=0){ if(distance<155) hurt(11); run.fx.push({type:"shadow",x:run.leo.x,y:run.leo.y,t:.38}); } }
          else if(enemy.special<=0){ enemy.warning = 0.7; enemy.special=4.2; run.fx.push({type:"roar",x:enemy.x,y:enemy.y,t:.7}); }
        }
      }

      enemy.x=Math.max(32,Math.min(358,enemy.x+moveX*moveSpeed*dt));
      enemy.y=Math.max(70,Math.min(525,enemy.y+moveY*moveSpeed*dt));
      const contactRange=enemy.boss?54:profile.range;
      if(enemy.type!=="hunter"&&distance<contactRange&&enemy.cd<=0){ hurt(enemy.boss?7:profile.damage); enemy.cd=1; run.fx.push({type:"shadow",x:run.leo.x,y:run.leo.y,t:.3}); }
    }
    if(reinforcements.length) run.enemies.push(...reinforcements);
    autoAttack();
    run.enemies = run.enemies.filter((enemy) => enemy.hp > 0);
    run.fx.forEach((effect) => { effect.t -= dt; });
    run.fx = run.fx.filter((effect) => effect.t > 0);
    if (run.hp <= 0) return finish(false);
    if (!run.enemies.length) return run.room >= 3 ? finish(true) : chooseBlessing();
    draw();
    updateHud();
    frame = requestAnimationFrame(loop);
  }

  function draw() {
    ctx.clearRect(0, 0, 390, 560);
    ctx.drawImage(images.bg, 0, 0, 390, 560);
    for (const enemy of run.enemies) {
      const enemyImage = enemy.boss ? images[`boss-${enemy.bossId}`] : images[`enemy-${enemy.type}`] || images.enemy;
      const size = enemy.boss ? 126 : enemy.elite ? 82 : 68;
      ctx.drawImage(enemyImage, enemy.x - size / 2, enemy.y - size / 2, size, size);
      ctx.fillStyle = "#17231f";
      const barWidth = enemy.boss ? 100 : 56;
      const barY = enemy.y - size / 2 - 9;
      ctx.fillRect(enemy.x - barWidth / 2, barY, barWidth, 6);
      ctx.fillStyle = "#7be0b1";
      ctx.fillRect(enemy.x - barWidth / 2, barY, (barWidth * enemy.hp) / enemy.max, 6);
      if(enemy.guard>0){ ctx.strokeStyle="#78e9ff"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(enemy.x,enemy.y,size*.48,0,Math.PI*2); ctx.stroke(); }
      if(enemy.warning>0){ ctx.strokeStyle="#ffd45f"; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(enemy.x,enemy.y,size*.58,0,Math.PI*2); ctx.stroke(); }
      if (enemy.marked) {
        ctx.strokeStyle = "#7cecff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y - size / 2 - 18, 9, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    const hero = heroes[run.heroId];
    const heroWidth = run.heroId === "taro" ? 94 : run.heroId === "orla" ? 82 : 78;
    const heroHeight = run.heroId === "taro" ? 78 : 90;
    ctx.globalAlpha = run.invulnerable > 0 ? 0.72 : 1;
    ctx.drawImage(images[hero.image], run.leo.x - heroWidth / 2, run.leo.y - heroHeight / 2, heroWidth, heroHeight);
    ctx.globalAlpha = 1;
    if (run.guard > 0) {
      ctx.strokeStyle = "#55e0b1";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(run.leo.x, run.leo.y, 56, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const effect of run.fx) {
      const image = effect.type === "roar" ? images.roar : effect.type === "hit" ? images.hit : images.shadow;
      const size = effect.type === "roar" ? 180 : 74;
      ctx.globalAlpha = Math.min(1, effect.t * 4);
      ctx.drawImage(image, effect.x - size / 2, effect.y - size / 2, size, size);
      ctx.globalAlpha = 1;
    }
  }

  function bindStick() {
    const joystick = $("#joystick");
    const nub = joystick.querySelector("i");
    const move = (event) => {
      if (pointer !== event.pointerId) return;
      const rect = joystick.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      const magnitude = Math.min(30, Math.hypot(x, y));
      const angle = Math.atan2(y, x);
      stick = { x: (Math.cos(angle) * magnitude) / 30, y: (Math.sin(angle) * magnitude) / 30 };
      nub.style.transform = `translate(${stick.x * 25}px, ${stick.y * 25}px)`;
    };
    joystick.onpointerdown = (event) => {
      if (event.isPrimary === false) return;
      if (pointer !== null && pointer !== event.pointerId) return;
      if (event.button !== undefined && event.button !== 0) return;
      clearMovementInput();
      pointer = event.pointerId;
      joystick.setPointerCapture(pointer);
      move(event);
    };
    joystick.onpointermove = move;
    const end = (event) => { if (pointer === event.pointerId) clearMovementInput(); };
    joystick.onpointerup = end;
    joystick.onpointercancel = end;
    joystick.onlostpointercapture = end;
  }

  const localeSelect = $("#locale") || $("#localeSelect");
  localeSelect.value = locale;
  localeSelect.onchange = (event) => {
    const requested = event.target.value;
    window.WonderI18n?.setLocale?.(requested);
    locale = window.WonderI18n?.locale?.() || requested;
    localStorage.setItem("weightPlayLocale", requested);
    localize();
  };
  $("#startBtn").addEventListener("keydown", (event) => { if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault(); });
  $("#stageRail").addEventListener("keydown", (event) => { if (event.repeat && (event.key === "Enter" || event.key === " ") && event.target.closest(".stage-card")) event.preventDefault(); });
  $("#startBtn").onclick = () => { playSound("click"); show("stage"); focusStage(); };
  $("#stageBack").onclick = () => { playSound("click"); show("main"); focusMain(); };
  $("#battleBack").onclick = () => { const stage = run?.stage || Math.min(TRIAL_COUNT, unlocked); playSound("click"); show("stage"); focusStage(stage); };
  $("#skillBtn").onclick = skill;
  $("#rerollBtn").addEventListener("keydown",(event)=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});
  $("#rerollBtn").onclick = rerollBlessings;
  $("#resultHome").onclick = () => { playSound("click"); show("main"); localize(); focusMain(); };
  $("#resultModal").addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab" || $("#resultModal").classList.contains("hidden")) return;
    const actions = [$("#resultNext"), $("#resultHome")].filter((button) => !button.disabled);
    if (event.shiftKey && document.activeElement === actions[0]) { event.preventDefault(); actions.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === actions.at(-1)) { event.preventDefault(); actions[0].focus(); }
  });
  $("#choiceModal").addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || $("#choiceModal").classList.contains("hidden")) return;
    const actions = [...$("#choiceModal").querySelectorAll("button:not(:disabled)")];
    if (!actions.length) return;
    if (event.shiftKey && document.activeElement === actions[0]) { event.preventDefault(); actions.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === actions.at(-1)) { event.preventDefault(); actions[0].focus(); }
  });
  $("#masteryBtn").addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  $("#masteryBtn").onclick = () => {
    const cost = 5 + mastery * 4;
    if (marks >= cost) {
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
    if (event.code === "Space") skill();
  });
  addEventListener("keyup", (event) => { keys[event.code] = false; });
  addEventListener("blur", clearMovementInput);
  document.addEventListener("visibilitychange", () => { if (document.hidden) suspendBackgroundBattle(); else resumeBackgroundBattle(); });
  addEventListener("pagehide", suspendBackgroundBattle);
  addEventListener("pageshow", resumeBackgroundBattle);
  bindStick();
  if (new URLSearchParams(location.search).has("smoke")) window.__heroTrialSmoke = {
    definitions:()=>trials.map((trial)=>({stage:trial.stage,region:trial.region,titleEn:trial.titleEn,titleZh:trial.titleZh,checkpoint:trial.checkpoint,enemies:[...trial.enemies],recommended:trial.recommended,reward:trial.reward,boss:trial.boss?{id:trial.boss.id,nameEn:trial.boss.name[0],nameZh:trial.boss.name[1],asset:trial.boss.asset,rule:trial.boss.rule}:null})),
    prepare:(stage,room=1)=>{ unlocked=TRIAL_COUNT; startTrial(stage); run.room=Math.max(1,Math.min(3,room)); spawn(); return window.__heroTrialSmoke.snapshot(); },
    damageFirst:(amount=20,source="auto")=>{ const enemy=run?.enemies[0]; return enemy?{applied:damageEnemy(enemy,amount,source),enemy:{...enemy}}:null; },
    forceRoomClear:()=>{ if(!run) return null; run.enemies=[]; if(run.room>=3) finish(true); else chooseBlessing(); return window.__heroTrialSmoke.snapshot(); },
    snapshot: () => ({ pointer, stick: { ...stick }, active: Boolean(run?.active), hp: run?.hp ?? null, player: run ? { ...run.leo } : null, run:run?{stage:run.stage,room:run.room,checkpoint:run.definition.checkpoint,boss:run.definition.boss?.id||null}:null, unlocked,marks, enemies: run?.enemies.map((enemy) => ({ x: enemy.x, y: enemy.y, hp: enemy.hp,max:enemy.max,type:enemy.type,bossId:enemy.bossId||null,bossRule:enemy.bossRule||null,guard:enemy.guard||0,warning:enemy.warning||0,phase:enemy.phase||0 })) || [] })
  };
  localize();
})();
