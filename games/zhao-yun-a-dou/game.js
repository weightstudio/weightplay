(function () {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(battle && paused()), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();


  document.body.setAttribute("data-runtime-localize", "off");

  const gameId = "zhao-yun-a-dou";
  const data = window.ZHAO_YUN_ADOU_LEVELS;
  const dictionaries = window.ZHAO_YUN_ADOU_LOCALES;
  const localeCodes = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const routeToLocale = { "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", "pt-br": "pt-BR" };
  const saveKey = "weightplay-zhao-yun-a-dou-v1";
  const interfaceValidatorRun = new URLSearchParams(location.search).get("qa") === "interface-validator";
  const unitTypes = Object.keys(data.unitTypes);
  let locale = getInitialLocale();
  let progress = loadProgress();
  // Local-only acceptance entry: normal Stage controls, real rules, no save writes.
  const qaStage = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)
    && new URLSearchParams(location.search).get('qa')==='zhao-v27'
    ? Number(new URLSearchParams(location.search).get('stage')) : 0;
  if(Number.isInteger(qaStage)&&qaStage>=1&&qaStage<=30)progress.unlocked=Math.max(progress.unlocked,qaStage);
  let stageIndex = 0;
  let selectedSlot = null;
  let battle = null;
  let loopTimer = null;
  let motionFrame = null;
  let statusTimer = null;
  let dragSlot = null;
  let formationRenderKey = null;
  let frame = null;
  let world = null, worldGeneration = 0, worldPending = false, worldFailed = false;
  const talents = window.ZhaoTalents;
  const hasTalent = id => (battle?.talents || progress.talents || []).includes(id);
  const recruitCost = () => hasTalent("supply3") && (battle.recruitIndex+1)%4===0 ? 0 : 3;
  let audioContext = null, lastSound = 0;
  const worldModuleUrl = new URL("battle-3d.js?v=20260920-zhao-v29", document.currentScript.src).href;
  let worldModule = null, worldImportAttempts = 0;
  function loadWorldModule() {
    return worldModule ||= import(worldModuleUrl + (worldImportAttempts++ ? '&retry='+worldImportAttempts : '')).catch(() => {worldModule=null;return null;});
  }
  function paused() { return document.hidden || document.getElementById('talentDialog')?.open || worldPending || worldFailed || Boolean(el.tutorial?.open || el.leaveBattle?.open || document.querySelector('#battle .wp-frame-popover:not([hidden])') || document.querySelector('#formationToggle[aria-expanded="true"]')); }
  function stopWorld() { worldGeneration++; world?.dispose(); world=null; worldPending=false; worldFailed=false; document.querySelector('.zhao-render-error')?.remove(); }
  function startWorld() {
    stopWorld(); const generation=worldGeneration; worldPending=true;
    loadWorldModule().then(module => {
      if (generation!==worldGeneration || !battle) return;
      const fail=()=>{worldPending=false;worldFailed=true;const host=document.querySelector('.battle-field');
        let panel=host.querySelector('.zhao-render-error');if(panel)return;
        panel=document.createElement('div');panel.className='zhao-render-error';
        const message=document.createElement('p');message.textContent=t('renderError');
        const retry=document.createElement('button');retry.textContent=t('replay');retry.addEventListener('click',startWorld);panel.append(message,retry);host.append(panel);
      };
      try { if(!module)throw Error('Renderer unavailable');world=new module.ZhaoBattle3D(document.querySelector('.battle-field'),fail);worldPending=false;world.render(battle,performance.now(),paused()||Boolean(battle.result)); }
      catch (_) {fail();}
    });
  }
  function sound(kind) {
    if(window.WonderSound?.isMuted?.() || document.hidden)return;
    const now=performance.now();if(kind==='hit'&&now-lastSound<90)return;lastSound=now;
    try {audioContext ||= new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state!=='running')return;
      const osc=audioContext.createOscillator(), gain=audioContext.createGain();
      const frequency={hit:260,block:140,defeat:520,charge:90,merge:650,hurt:100}[kind]||300;
      osc.type=kind==='charge'?'sawtooth':'triangle';osc.frequency.setValueAtTime(frequency,audioContext.currentTime);osc.frequency.exponentialRampToValueAtTime(frequency*.45,audioContext.currentTime+.13);
      gain.gain.setValueAtTime(Math.max(.0001,.025*(window.WonderSound?.getEffectsVolume?.()??70)/100),audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.16);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.17);osc.onended=()=>{osc.disconnect();gain.disconnect();};
    } catch (_) {}
  }
  document.addEventListener('pointerdown',()=>{try{audioContext ||= new (window.AudioContext||window.webkitAudioContext)();audioContext.resume().catch(()=>{});}catch(_){}});

  const el = {
    main: document.getElementById("main"),
    stage: document.getElementById("stage"),
    battle: document.getElementById("battle"),
    start: document.getElementById("start"),
    stageGrid: document.getElementById("stageGrid"),
    progress: document.getElementById("progress"),
    battleBack: document.getElementById("battleBack"),
    battleUtility: document.getElementById("battleUtilityBtn"),
    chapter: document.getElementById("chapter"),
    stageName: document.getElementById("stageName"),
    remaining: document.getElementById("remaining"),
    enemyHp: document.getElementById("enemyHp"),
    commandPostHp: document.getElementById("commandPostHp"),
    buns: document.getElementById("buns"),
    adouHp: document.getElementById("adouHp"),
    baseHp: document.getElementById("baseHp"),
    enemyLanes: document.getElementById("enemyLanes"),
    playerLanes: document.getElementById("playerLanes"),
    formation: document.getElementById("formation"),
    formationHint: document.getElementById("formationHint"),
    recruit: document.getElementById("recruit"),
    recruitHint: document.getElementById("recruitHint"),
    skills: document.getElementById("skills"),
    battleActions: document.querySelector("#battle .battle-actions"),
    hint: document.getElementById("hint"),
    status: document.getElementById("status"),
    pressureCue: document.getElementById("pressureCue"),
    tutorial: document.getElementById("tutorial"),
    tutorialClose: document.getElementById("tutorialClose"),
    leaveBattle: document.getElementById("leaveBattle"),
    continueBattle: document.getElementById("continueBattle"),
    returnToStage: document.getElementById("returnToStage"),
    result: document.getElementById("result"),
    resultEyebrow: document.getElementById("resultEyebrow"),
    resultTitle: document.getElementById("resultTitle"),
    resultBody: document.getElementById("resultBody"),
    resultReplayGoal: document.getElementById("resultReplayGoal"),
    resultStars: document.getElementById("resultStars"),
    resultTime: document.getElementById("resultTime"),
    resultStages: document.getElementById("resultStages"),
    next: document.getElementById("next"),
    retry: document.getElementById("retry"),
    locale: document.getElementById("locale"),
  };

  function getInitialLocale() {
    const pathLocale = location.pathname.split("/").find(function (segment) {
      return ["en", "zh-tw", "zh-cn", "ja", "ko", "es", "pt-br", "fr", "de", "it", "ru", "hi", "ar"].indexOf(segment) >= 0;
    });
    const saved = safeGet("weightPlayLocale") || safeGet("weightplayLocale") || safeGet("wp-locale");
    const documentLocale = document.documentElement.lang;
    const sharedLocale = window.WonderI18n?.actualLocale?.();
    return routeToLocale[pathLocale]
      || (localeCodes.indexOf(documentLocale) >= 0 ? documentLocale : null)
      || (localeCodes.indexOf(sharedLocale) >= 0 ? sharedLocale : null)
      || (localeCodes.indexOf(saved) >= 0 ? saved : "en");
  }

  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (_) { return null; }
  }

  function safeSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (_) {}
  }

  function emitMeasurementEvent(name, detail) {
    try { window.dispatchEvent(new CustomEvent("weightplay:zhao-" + name, { detail: detail || {} })); } catch (_) {}
  }

  function loadProgress() {
    const fallback = { unlocked: 1, stars: Array(30).fill(0), bestTimes: Array(30).fill(null), tutorialSeen: false, talents: [] };
    try {
      const parsed = JSON.parse(safeGet(saveKey) || "null");
      if (!parsed) return fallback;
      return {
        unlocked: Math.max(1, Math.min(30, Math.floor(Number(parsed.unlocked)) || 1)),
        stars: Array.from({ length: 30 }, function (_, index) { return Math.max(0, Math.min(3, Math.floor(Number(parsed.stars && parsed.stars[index])) || 0)); }),
        bestTimes: Array.from({length:30},(_,i)=>Number.isFinite(parsed.bestTimes?.[i]) && parsed.bestTimes[i]>0 ? parsed.bestTimes[i] : null),
        tutorialSeen: Boolean(parsed.tutorialSeen),
        talents: window.ZhaoTalents.normalize(parsed.talents, parsed.stars),
      };
    } catch (_) {
      return fallback;
    }
  }

  function saveProgress() {
    if(qaStage>=1&&qaStage<=30)return;
    safeSet(saveKey, JSON.stringify(progress));
  }

  function t(key, values) {
    const dictionary = dictionaries[locale] || dictionaries.en;
    let value = dictionary[key] || dictionaries.en[key] || key;
    Object.keys(values || {}).forEach(function (name) {
      value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(values[name]));
    });
    return value;
  }

  function updateStaticLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-t]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-t"));
    });
    const ariaMap = {
      posterAlt: t("posterAlt"),
      stageList: t("stageList"),
      stageTabs: t("stageNavigation"),
      tutorialAria: t("tutorialAria"),
    };
    document.querySelectorAll("[data-t-aria]").forEach(function (node) {
      const key = node.getAttribute("data-t-aria");
      if (ariaMap[key]) {
        node.setAttribute("aria-label", ariaMap[key]);
        if (node.tagName === "IMG") node.alt = ariaMap[key];
      }
    });
    [
      [".return", "returnToWeightPlay"],
      ["#stage [data-back]", "back"],
      ["#battleBack", "back"],
      [".public-guide", "gameGuide"],
      [".battle-field", "battleField"],
      ["#enemyLanes", "enemyLanes"],
      ["#playerLanes", "playerLanes"],
      ["#formation", "formationSlots"],
      ["#skills", "generalSkills"],
      [".game-page-info", "gameInfo"],
    ].forEach(function (entry) {
      const node = document.querySelector(entry[0]);
      if (node) node.setAttribute("aria-label", t(entry[1]));
    });
    if (el.locale) {
      el.locale.innerHTML = "";
      localeCodes.forEach(function (code) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = localeLabel(code);
        option.selected = code === locale;
        el.locale.appendChild(option);
      });
    }
    if (el.battleUtility) {
      const label = t("tutorialAria");
      el.battleUtility.setAttribute("aria-label", label);
      el.battleUtility.title = label;
    }
    renderMainProgress();
    document.title = (dictionaries[locale] || dictionaries.en).title + " | WeightPlay";
    if (battle) {
      formationRenderKey = null;
      renderBattle();
    } else if (document.body.getAttribute("data-screen") === "stage") {
      renderStages();
    }
  }

  function localeLabel(code) {
    return {
      en: "English", "zh-Hant": "繁體中文", "zh-Hans": "简体中文", ja: "日本語", ko: "한국어",
      es: "Español", "pt-BR": "Português", fr: "Français", de: "Deutsch", it: "Italiano",
      ru: "Русский", hi: "हिन्दी", ar: "العربية",
    }[code] || code;
  }

  function showScreen(name) {
    if (name === "main") renderMainProgress();
    [el.main, el.stage, el.battle].forEach(function (node) {
      node.hidden = node.id !== name;
    });
    document.body.setAttribute("data-screen", name);
    if (frame) frame.activate(name);
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}

  function renderMainProgress() {
    const node = document.getElementById("mainProgress");
    if (node) node.textContent = t("stageProgress") + ": " + progress.stars.filter(Boolean).length + " / " + data.levels.length;
  }

  function showMain() {
    stopLoop();
    stopWorld();
    closeDialogs();
    battle = null;
    selectedSlot = null;
    formationRenderKey = null;
    showScreen("main");
  }

  function showStage() {
    stopLoop();
    stopWorld();
    closeDialogs();
    battle = null;
    selectedSlot = null;
    formationRenderKey = null;
    showScreen("stage");
    renderStages();
    window.dispatchEvent(new CustomEvent("weightplay:stage-sync"));
  }

  function stageName(level) {
    return t("stageName", { id: level.id });
  }

  function stageChapterName(level) {
    const chapters = (dictionaries[locale] || dictionaries.en).stageChapterNames || [];
    return chapters[level.chapter - 1] || (locale === "en" ? level.chapterEnglish : level.chapterName);
  }

  function stageObjective(level) {
    return t("rule_" + level.rule);
  }

  function renderStages() {
    const cleared = progress.stars.filter(Boolean).length;
    el.progress.textContent = t("stageProgress") + ": " + cleared + " / " + data.levels.length;
    el.stageGrid.innerHTML = "";
    data.levels.forEach(function (level, index) {
      const unlocked = index < progress.unlocked;
       const card = document.createElement("button");
      const stars = progress.stars[index] ? "★".repeat(progress.stars[index]) + "☆".repeat(3 - progress.stars[index]) : "☆☆☆";
      card.type = "button";
      card.className = "stage-card" + (index === stageIndex ? " is-selected" : "");
      card.setAttribute("data-wp-stage-card", String(index + 1));
      card.setAttribute("aria-current", index === stageIndex ? "true" : "false");
      card.setAttribute("data-wp-stage-selected", index === stageIndex ? "true" : "false");
      card.disabled = !unlocked;
      const localizedName = stageName(level);
      const localizedChapter = stageChapterName(level);
      const localizedObjective = stageObjective(level);
      card.setAttribute("aria-label", localizedName + ", " + localizedChapter + ", " + localizedObjective + ", " + (unlocked ? t("ready") : t("locked")));
      card.innerHTML = "<strong>" + (index + 1) + "</strong><small>" + escapeHtml(localizedChapter) + "</small><span>" + escapeHtml(localizedObjective) + "</span><i class=\"stage-stars\" aria-label=\"" + t("stars") + ": " + stars + "\">" + stars + "</i>";
      card.addEventListener("click", function () {
        stageIndex = index;
        startBattle(index);
      });
      el.stageGrid.appendChild(card);
    });
  }

  function startBattle(index, options) {
    closeDialogs();
    stageIndex = Math.max(0, Math.min(data.levels.length - 1, index));
    const level = data.levels[stageIndex];
    battle = createBattle(level, options || {});
    selectedSlot = null;
    formationRenderKey = null;
    showScreen("battle");
    startWorld();
    renderBattle();
    emitMeasurementEvent("battle-start", {
      stage: stageIndex + 1,
      entry: options?.entry === "retry" || options?.entry === "next" ? options.entry : "stage",
    });
    window.WeightPlayBattleCanvas?.sync?.();
    if (!progress.tutorialSeen && !options?.skipTutorial) {
      progress.tutorialSeen = true;
      saveProgress();
      if (!interfaceValidatorRun) {
        const tutorialBattle=battle;
        window.setTimeout(function () { if (battle === tutorialBattle && el.tutorial && !el.tutorial.open) (__wpNotifyMeasurement(), el.tutorial.show()); }, 80);
      }
    }
    startLoop();

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}

  function createBattle(level, options) {
    const fixture = options.fixture || null;
    const units = Array(9).fill(null);
    if (fixture === "merge") {
      units[0] = makeUnit("blade", 3);
      units[1] = makeUnit("blade", 3);
      units[3] = makeUnit("spear", 2);
    } else if (fixture === "skill") {
      units[0] = makeUnit("blade", 4, true);
      units[1] = makeUnit("spear", 4, true);
      units[2] = makeUnit("horse", 4, true);
      units[3] = makeUnit("bow", 4, true);
    } else if (fixture === "loss") {
      units.fill(null);
    } else {
      level.startingUnits.forEach(function (item) {
        units[item.slot] = makeUnit(item.type, item.level, item.level>=4);
      });
    }
    return {
      talents: [...(progress.talents||[])], pity:0, rescued:false,
      level: level,
      units: units,
      enemies: [],
      spawned: 0,
      ticks: 0,
      buns: fixture === "merge" ? 8 : level.startingBuns + ((progress.talents||[]).includes("supply1")?3:0),
      commandHp: fixture === "loss" ? 999 : level.commandHp,
      maxCommandHp: fixture === "loss" ? 999 : level.commandHp,
      adouHp: fixture === "loss" ? 1 : level.adouHp + ((progress.talents||[]).includes("guard1")?4:0),
      maxAdouHp: fixture === "loss" ? 1 : level.adouHp + ((progress.talents||[]).includes("guard1")?4:0),
       result: null,
       wave: 1, waveRest: 35, waveKills: 0, commandLane: 1, chargeTicks: 0, campFlash: 0, nextEnemyId: 1, strikes: [],
       status: "",
       effects: [],
       nextEffectId: 1,
       recruitIndex: 0,
      lastAttack: 0,
      skillsUsed: {},
      fixture: fixture,
    };
  }

  function makeUnit(type, level, isGeneral) {
    return {
      type: type,
      level: level,
      general: Boolean(isGeneral),
      cooldown: 0,
      attackCooldown: 0,
      attackFlash: 0,
    };
  }

  function startLoop() {
    stopLoop();
    loopTimer = window.setInterval(function () {
      if (!battle || battle.result || paused()) return;
      advanceBattle(1);
    }, 100);
    motionFrame = window.requestAnimationFrame(renderEnemyMotion);
  }

  function stopLoop() {
    if (loopTimer) window.clearInterval(loopTimer);
    loopTimer = null;
    if (motionFrame !== null) window.cancelAnimationFrame(motionFrame);
    motionFrame = null;
  }

  function enemyTokenPosition(progress) {
    // Keep the painted token inside its lane; simulation progress is untouched.
    return "clamp(var(--zhao-enemy-half-width, 32px), " + (progress * 100) + "%, calc(100% - var(--zhao-enemy-half-width, 32px)))";
  }

  function renderEnemyMotion(timestamp) {
    motionFrame = null;
    if (!battle) return;
    if(battle.result){world?.render(battle,timestamp,true);return;}
    world?.render(battle, timestamp, paused());
    battle.enemies.forEach(function (enemy) {
      const token = el.enemyLanes.querySelector(".enemy-token[data-enemy-id=\"" + enemy.id + "\"]");
      if (!token) return;
      token.style.left = enemyTokenPosition(getEnemyVisualPosition(enemy, timestamp));
    });
    motionFrame = window.requestAnimationFrame(renderEnemyMotion);
  }

  function getEnemyVisualPosition(enemy, timestamp) {
    const from = Number.isFinite(enemy.motionStartPosition) ? enemy.motionStartPosition : enemy.position;
    const motionTimestamp = Number.isFinite(battle.motionTimestamp) ? battle.motionTimestamp : timestamp;
    const progress = Math.max(0, Math.min(1, (timestamp - motionTimestamp) / 100));
    return from + (enemy.position - from) * progress;
  }

  function advanceBattle(steps) {
    if (!battle || battle.result) return;
    for (let step = 0; step < steps; step += 1) tickBattle();
    renderBattle();
  }

  function tickBattle() {
    if(battle.result)return;
    battle.ticks += 1;
    if(battle.chargeTicks>0)battle.chargeTicks--;
    if(battle.campFlash>0)battle.campFlash--;
    battle.strikes = battle.strikes.filter(strike => {
      strike.delay--; if(strike.delay>0)return true;
      const target=battle.enemies.find(e=>e.id===strike.target);
      if(target && target.hp>0){damageEnemy(target,strike.damage,strike.type);
        if(strike.type==='blade')battle.enemies.filter(e=>e.id!==target.id&&e.lane===target.lane&&Math.abs(e.position-target.position)<.14).forEach(e=>damageEnemy(e,Math.ceil(strike.damage*.55),'blade'));
        if(strike.type==='spear')target.stun=Math.max(target.stun,hasTalent('guard2')?4:2);
      } return false;
    });
    battle.enemies.forEach(function (enemy) {
      enemy.motionStartPosition = enemy.position;
    });
    battle.effects = battle.effects.map(function (effect) {
      return Object.assign({}, effect, { ttl: effect.ttl - 1 });
    }).filter(function (effect) { return effect.ttl > 0; });
    battle.enemies = battle.enemies.filter(function (enemy) { return enemy.hp > 0 || enemy.defeatedTicks > 0; });
    battle.units.forEach(function (unit) {
      if (unit && unit.attackFlash > 0) unit.attackFlash -= 1;
    });
    if (battle.ticks % (battle.level.rule === "reserve" ? 22 : 16) === 0 && battle.buns < 24) battle.buns += 1;
    const level = battle.level;
    const waveEnd=Math.ceil(level.enemyCount*battle.wave/level.waveCount);
    if(battle.waveRest>0)battle.waveRest--;
    else if (battle.spawned < waveEnd && battle.ticks % level.spawnGap === 0) spawnEnemy();
    if(battle.spawned>=waveEnd && battle.wave<level.waveCount && !battle.enemies.some(e=>e.hp>0)){
      battle.wave++;battle.waveRest=35;battle.buns=Math.min(24,battle.buns+4);
      setStatus(t('waveReward'));sound('merge');
    }
    battle.enemies.slice().forEach(function (enemy) {
      if (enemy.hitFlash > 0) enemy.hitFlash -= 1;
      if (enemy.defeatedTicks > 0) {
        enemy.defeatedTicks -= 1;
        return;
      }
      if (enemy.stun > 0) {
        enemy.stun -= 1;
        return;
      }
      enemy.age++;
      if(enemy.telegraph>0)enemy.telegraph--;
      if((enemy.kind==='raider'||enemy.bossKind==='charger'||enemy.bossKind==='warlord')&&enemy.age%65===35)enemy.telegraph=12;
      let movement=enemy.speed;
      if((enemy.kind==='raider'||enemy.bossKind==='charger'||enemy.bossKind==='warlord')&&enemy.age%65>=47)movement*=2.7;
      if(level.rule==='mud' && enemy.lane===level.terrainLane)movement*=.55;
      if((enemy.kind==='flanker'||enemy.bossKind==='weaver')&&!enemy.switched&&enemy.position>.4){
        if(!enemy.switchAt){enemy.switchAt=enemy.age+12;enemy.telegraph=12;}
        if(enemy.age>=enemy.switchAt){enemy.lane=(enemy.lane+1)%3;enemy.switched=true;}
      }
      if((enemy.kind==='medic'||enemy.bossKind==='healer')&&enemy.age%40===30)enemy.telegraph=10;
      if((enemy.bossKind==='summoner'||enemy.bossKind==='warlord')&&enemy.age%75===63)enemy.telegraph=12;
      if(enemy.bossKind==='bulwark'&&enemy.age%35===25)enemy.telegraph=10;
      if((enemy.kind==='medic'||enemy.bossKind==='healer')&&enemy.age%40===0){battle.enemies.filter(e=>e.lane===enemy.lane&&e.hp>0).forEach(e=>{const healed=Math.min(4,e.maxHp-e.hp);e.hp+=healed;if(healed)battle.effects.push({id:battle.nextEffectId++,kind:'heal',lane:e.lane,position:e.position,text:'+'+healed,ttl:6});});}
      if((enemy.bossKind==='summoner'||enemy.bossKind==='warlord')&&enemy.age%75===0&&battle.enemies.length<36)spawnReinforcement(enemy);
      if(enemy.bossKind==='bulwark')enemy.shield=Math.floor(enemy.age/35)%2===0;
      enemy.position += movement;
      if (enemy.position >= 0.94) {
        battle.adouHp = Math.max(0, battle.adouHp - enemy.damage);battle.campFlash=5;sound("hurt");
        if(enemy.boss){enemy.position=.78;enemy.motionStartPosition=.78;enemy.stun=12;enemy.telegraph=12;}
        else battle.enemies = battle.enemies.filter(function (candidate) { return candidate.id !== enemy.id; });
        setStatus(t("adou") + " " + t("hp") + " " + battle.adouHp + "/" + battle.maxAdouHp);
      }
    });
    battle.units.forEach(function (unit, slot) {
      if (!unit) return;
      if (unit.cooldown > 0) unit.cooldown -= 1;
      if (unit.attackCooldown > 0) {
        unit.attackCooldown -= 1;
        return;
      }
      unit.attackCooldown = unit.general ? 5 : Math.max(4, Math.round(8 / (data.unitTypes[unit.type].speed || 1)));
      const lane = slot % 3;
       const target = battle.enemies.filter(function (enemy) { return enemy.lane === lane && enemy.hp > 0 && !enemy.defeatedTicks && enemy.position >= (battle.level.rule==="fog" ? .48 : 1-(unit.general?.95:data.unitTypes[unit.type].range)); }).sort(function (a, b) { return (unit.type==="bow"?Number(b.kind==="medic")-Number(a.kind==="medic"):0) || b.position - a.position; })[0];
       const damage = unitDamage(unit) + (level.rule==="rally" && lane===level.terrainLane ? 2 : 0);
       if (target) {
         unit.attackFlash = 4;
         battle.effects.push({
           id: battle.nextEffectId++,
           kind: "attack",
           lane: lane,
           position: Math.min(.82, Math.max(.18, target.position)),
           text: t("attackCue") + ": " + unitLabel(unit) + " → " + (target.boss ? t("boss") : t("enemySoldier")),
           ttl: 5,
         });
         battle.strikes.push({target:target.id,damage:damage,type:unit.type,delay:2});
       } else if (battle.spawned >= level.enemyCount && !battle.enemies.some(function (enemy) { return enemy.hp > 0 && !enemy.defeatedTicks; }) && battle.commandHp > 0) {
        unit.attackFlash = 4;
        battle.effects.push({
          id: battle.nextEffectId++,
          kind: "attack",
          lane: lane,
          position: .82,
          text: t("attackCue") + ": " + unitLabel(unit) + " → " + t("commandPost"),
          ttl: 5,
        });
        battle.commandHp = Math.max(0, battle.commandHp - damage);
      }
    });
    Object.keys(battle.skillsUsed).forEach(function (key) {
      if (battle.skillsUsed[key] > 0) battle.skillsUsed[key] -= 1;
    });
    for(const type of ["blade","spear","bow"]) if(battle.units.some(u=>u?.general&&u.type===type)&&!battle.skillsUsed[type]&&battle.enemies.some(e=>e.hp>0&&e.position>.35)) useSkill(type);
    battle.motionTimestamp = window.performance?.now?.() || Date.now();
    if (battle.adouHp <= 0 && hasTalent("guard3") && !battle.rescued) { battle.adouHp=3; battle.rescued=true; battle.campFlash=8; sound("merge"); setStatus(t("talent_guard3")); }
    if (battle.adouHp <= 0) finishBattle("loss");
    if (battle.commandHp <= 0) finishBattle("win");
  }

  function spawnReinforcement(parent) {
    battle.enemies.push({id:battle.nextEnemyId++,lane:(parent.lane+1)%3,position:.05,motionStartPosition:.05,hp:10,maxHp:10,speed:battle.level.enemySpeed,damage:1,kind:'soldier',boss:false,bossKind:null,shield:false,age:0,stun:0,hitFlash:0,defeatedTicks:0,telegraph:0});
  }
  function spawnEnemy() {
    const level=battle.level, boss=Boolean(level.bossKind)&&battle.spawned===level.enemyCount-1;
    const kind=boss?'boss':level.roster[battle.spawned%level.roster.length];
    const maxHp=boss?level.enemyHp*4:level.enemyHp*(kind==='shield'?1.5:kind==='raider'?.8:1);
    battle.enemies.push({id:battle.nextEnemyId++,lane:level.lanePattern[battle.spawned%level.lanePattern.length],
      position:.04,motionStartPosition:.04,hp:Math.round(maxHp),maxHp:Math.round(maxHp),
      speed:level.enemySpeed*(boss?.65:kind==='raider'?1.1:1),damage:boss?4:level.enemyDamage,
      kind,boss,label:boss?t("boss_"+level.bossKind):t("enemy_"+kind),bossKind:boss?level.bossKind:null,shield:kind==='shield',age:0,stun:0,hitFlash:0,defeatedTicks:0,telegraph:0});
    battle.spawned++;if(boss)setStatus(t('boss_'+level.bossKind));
  }

  function unitDamage(unit) {
    if (unit.general) return data.generals[unit.type].damage * 2;
    return data.unitTypes[unit.type].damage * Math.pow(2,unit.level-1);
  }

  function damageEnemy(enemy, amount, type) {
    if (!enemy || enemy.hp <= 0) return;
    const blocked=enemy.shield && type!=='blade' && type!=='charge';
    amount=Math.min(enemy.hp,Math.max(1,Math.round(amount*(blocked?.35:1))));
    enemy.hp = Math.max(0, enemy.hp - amount);sound(blocked?'block':'hit');
    enemy.hitFlash = 3;
    battle.effects.push({
      id: battle.nextEffectId++,
      kind: blocked ? "block" : "hit",
      lane: enemy.lane,
      position: enemy.position,
      text: "-" + amount,
      ttl: 5,
    });
    if (enemy.hp <= 0) {
      enemy.defeatedTicks = 5;
      battle.waveKills++; if(battle.waveKills%3===0)battle.buns=Math.min(24,battle.buns+1);sound("defeat");
      battle.effects.push({
        id: battle.nextEffectId++,
        kind: "defeat",
        lane: enemy.lane,
        position: enemy.position,
        text: t("defeated"),
        ttl: 9,
      });
    }
  }

  function recruit() {
    if (!battle || battle.result || document.hidden || el.leaveBattle?.open || el.tutorial?.open) return;
    const slot = battle.units.findIndex(function (unit) { return !unit; });
    if (slot < 0) {
      setStatus(t("noSpace"));
      return;
    }
    if (battle.buns < recruitCost()) {
      setStatus(t("notEnough"));
      return;
    }
    battle.buns -= recruitCost();
    const rolled = talents.roll(Math.random,battle.pity);
    battle.pity = rolled.level===1 ? battle.pity+1 : 0;
    const type = rolled.type;
    battle.recruitIndex += 1;
    battle.units[slot] = makeUnit(type, rolled.level, rolled.general);
    setStatus(t("statusRecruit")+" "+unitName(battle.units[slot]), rolled.level>1?"promotion":undefined);
    sound(rolled.level>1?"merge":"hit");
    renderBattle();
    emitMeasurementEvent("recruit", { stage: stageIndex + 1 });
  }

  function handleSlot(slot) {
    if (!battle || battle.result) return;
    const unit = battle.units[slot];
    if (selectedSlot === null) {
      if (!unit) return;
      selectedSlot = slot;
      battle.commandLane=slot%3;
      setStatus(t("selected") + ": " + unitName(unit));
      renderFormation();
      return;
    }
    if (selectedSlot === slot) {
      selectedSlot = null;
      setStatus(t("mergeHint"));
      renderFormation();
      return;
    }
    const source = battle.units[selectedSlot];
    if (!source) {
      selectedSlot = null;
      renderFormation();
      return;
    }
    if (!unit) {
      battle.units[slot] = source;
      battle.units[selectedSlot] = null;
      selectedSlot = null;
      setStatus(t("statusMove"));
      renderBattle();
      return;
    }
    if (canMerge(source, unit)) {
      const mergedUnit = source.level >= 3
        ? makeUnit(source.type, 4, true)
        : makeUnit(source.type, source.level + 1);
      if(hasTalent("supply2"))battle.buns=Math.min(24,battle.buns+1);
      battle.units[slot] = mergedUnit;
      battle.units[selectedSlot] = null;
      selectedSlot = null;
      const payoffKind = mergedUnit.general ? "promotion" : "merge-payoff";
      setStatus(mergedUnit.general
        ? t("statusGeneralPayoff")
        : t("statusMergePayoff", { level: mergedUnit.level }), payoffKind);
      sound("merge");
      renderBattle();
      emitMeasurementEvent("merge", { result: mergedUnit.general ? "promotion" : "level_up", stage: stageIndex + 1 });
      return;
    }
    // Unlike units swap: redistribution is always possible on a full board.
    battle.units[slot]=source;battle.units[selectedSlot]=unit;selectedSlot=null;
    battle.commandLane=slot%3;setStatus(t("statusMove"));
    renderFormation();
  }

  function canMerge(first, second) {
    return first && second && first.type === second.type && first.level === second.level && first.general === second.general && !first.general;
  }

  function useSkill(type) {
    if (!battle || battle.result || el.leaveBattle?.open || el.tutorial?.open) return;
    const unit = battle.units.find(function (candidate) { return candidate && candidate.general && candidate.type === type; });
    if (!unit && type!=="horse") return;
    const cooldown = battle.skillsUsed[type] || 0;
    if (cooldown > 0) {
      setStatus(t("cooldown"));
      return;
    }
    const victims = battle.enemies.filter(e=>e.hp>0).sort(function (a, b) { return b.position - a.position; });
    if(!victims.length){setStatus(t('noTarget'));return;}
    if(type==="horse")battle.commandLane=victims[0].lane;
    if (type === "blade") {
       victims.slice(0, 3).forEach(function (enemy) { damageEnemy(enemy, 9, 'blade'); });
    } else if (type === "spear") {
       victims.forEach(function (enemy) { enemy.stun = 35; damageEnemy(enemy, 5); });
    } else if (type === "horse") {
       victims.filter(e=>hasTalent("charge2")||e.lane===battle.commandLane).forEach(target=>{
         damageEnemy(target,16,'charge');battle.effects.push({id:battle.nextEffectId++,kind:'charge',lane:target.lane,position:target.position,text:'',ttl:5});target.motionStartPosition=target.position;target.position=Math.max(.02,target.position-.2);target.stun=8;
       });
       battle.chargeTicks=10;sound('charge');
       if(hasTalent("charge3"))battle.units.forEach(u=>{if(u)u.attackCooldown=0;});
       battle.effects.push({id:battle.nextEffectId++,kind:'charge',lane:battle.commandLane,position:.55,text:skillName(makeUnit("horse",4,true)),ttl:9});
    } else {
       victims.forEach(function (enemy) { damageEnemy(enemy, 8); });
    }
    battle.skillsUsed[type] = type==="horse"?(hasTalent("charge1")?70:100):80;
    setStatus(t("statusSkill"));
    renderBattle();
    emitMeasurementEvent("skill", { skill: type, stage: stageIndex + 1 });
  }

  function ensureResultReplayGoal() {
    const resultDialog = document.getElementById("result") || el.result;
    if (!resultDialog) return null;
    if (el.result !== resultDialog) el.result = resultDialog;
    let target = resultDialog.querySelector("#resultReplayGoal");
    if (!target) {
      target = document.createElement("p");
      target.id = "resultReplayGoal";
      target.className = "result-replay-goal";
      const stats = resultDialog.querySelector(".result-stats");
      if (stats && stats.parentNode === resultDialog) resultDialog.insertBefore(target, stats);
      else resultDialog.appendChild(target);
    }
    el.resultReplayGoal = target;
    return target;
  }

  function finishBattle(result) {
    if (!battle || battle.result) return;
    battle.result = result;
    stopLoop();
    const seconds = Math.max(1, Math.round(battle.ticks / 10));
    const stars = result === "win" ? (battle.adouHp >= Math.ceil(battle.maxAdouHp * .8) && seconds <= battle.level.starTime ? 3 : battle.adouHp >= Math.ceil(battle.maxAdouHp * .5) ? 2 : 1) : 0;
    battle.stars = stars;
    battle.seconds = seconds;
    if (result === "win") {
      progress.stars[stageIndex] = Math.max(progress.stars[stageIndex], stars);
      progress.unlocked = Math.max(progress.unlocked, Math.min(data.levels.length, stageIndex + 2));
      progress.bestTimes[stageIndex]=Math.min(progress.bestTimes[stageIndex]||Infinity,seconds);
      saveProgress();
    }
    renderBattle();
    el.resultEyebrow.textContent = result === "win" ? t("win") : t("lose");
    el.resultTitle.textContent = result === "win" ? t("win") : t("lose");
    el.resultBody.textContent = result === "win" ? t("winBody") : t("loseBody");
    const replayGoalKey = result === "win"
      ? (stars >= 3 ? "resultReplayGoalThree" : "resultReplayGoalStandard")
      : "resultReplayGoalLoss";
    const replayGoal = ensureResultReplayGoal();
    if (replayGoal) replayGoal.textContent = t(replayGoalKey, { seconds: seconds });
    el.resultStars.textContent = stars + " / 3";
    el.resultTime.textContent = seconds + "s" + (progress.bestTimes[stageIndex] ? " · " + t("best") + " " + progress.bestTimes[stageIndex]+"s" : "");
    el.next.disabled = result !== "win" || stageIndex >= data.levels.length - 1 || stageIndex + 1 >= progress.unlocked;
    (__wpNotifyMeasurement(), el.result.showModal());
    emitMeasurementEvent("result", {
      stage: stageIndex + 1,
      outcome: result === "win" ? "win" : "loss",
      target: replayGoalKey === "resultReplayGoalThree"
        ? "faster_clear"
        : replayGoalKey === "resultReplayGoalStandard"
          ? "faster_three_star"
          : "cover_all_lanes",
    });

    __wpMeasurement.ended = true; __wpMeasurement.outcome = (typeof result === "boolean" ? (result ? "win" : "lose") : typeof result === "string" ? result : "complete"); if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}

  function renderBattle() {
    if (!battle) return;
    const level = battle.level;
    el.chapter.textContent = stageChapterName(level) + " · " + stageName(level);
    el.stageName.textContent = stageName(level);
    el.remaining.textContent = t("wave") + " " + battle.wave + " / " + level.waveCount;
    el.enemyHp.textContent = battle.commandHp + " / " + battle.maxCommandHp;
    el.commandPostHp.textContent = battle.commandHp + " / " + battle.maxCommandHp;
    el.buns.textContent = String(battle.buns);
    el.adouHp.textContent = battle.adouHp + " / " + battle.maxAdouHp;
    el.baseHp.textContent = battle.adouHp + " / " + battle.maxAdouHp;
    el.recruit.disabled = Boolean(battle.result) || battle.buns<recruitCost() || battle.units.every(Boolean);
    el.recruit.textContent=t("recruit")+" · "+recruitCost();
    el.hint.textContent=t("talents");
    el.hint.title=t("commandHelp");
    el.status.textContent = battle.status || t("mergeHint");
    renderPressureCue();
    renderLanes();
    renderFormation();
    renderSkills();
    el.battle.scrollTop = 0;

  }

  function renderPressureCue() {
    if (!el.pressureCue || !battle) return;
    const laneStates = [0, 1, 2].map(function (lane) {
      const hasDefender = battle.units.some(function (unit, slot) {
        return Boolean(unit) && slot % 3 === lane;
      });
      const enemies = battle.enemies.filter(function (enemy) {
        return enemy.lane === lane && enemy.hp > 0 && !enemy.defeatedTicks;
      });
      const furthest = enemies.reduce(function (max, enemy) {
        return Math.max(max, enemy.position || 0);
      }, 0);
      const bossBonus = enemies.some(function (enemy) { return enemy.boss; }) ? .18 : 0;
      return {
        lane: lane,
        hasDefender: hasDefender,
        enemies: enemies,
        pressure: (hasDefender ? 0 : .6) + (enemies.length ? .2 : 0) + furthest + bossBonus,
      };
    });
    const attention = laneStates.filter(function (state) {
      return !state.hasDefender || state.enemies.length > 0;
    });
    let message;
    if (!attention.length) {
      message = t("pressureClear");
    } else {
      attention.sort(function (first, second) {
        return second.pressure - first.pressure || first.lane - second.lane;
      });
      const focus = attention[0];
      const key = !focus.hasDefender && focus.enemies.length
        ? "pressureOpenEnemy"
        : !focus.hasDefender ? "pressureOpen" : "pressureEnemy";
      message = t(key, { lane: focus.lane + 1 });
    }
    const boss=battle.enemies.find(e=>e.boss&&e.hp>0);
    message=(boss?t("boss_"+boss.bossKind)+" · ":"")+t("rule_"+battle.level.rule)+" · "+message;
    if (el.pressureCue.textContent !== message) el.pressureCue.textContent = message;
  }

  function renderLanes() {
    const enemyRows = ensureLaneRows(el.enemyLanes);
    const playerRows = ensureLaneRows(el.playerLanes);
    for (let lane = 0; lane < 3; lane += 1) {
      const enemyRow = enemyRows[lane];
      enemyRow.setAttribute("data-lane", t("lane") + " " + (lane + 1));
      const tokenById = new Map(Array.from(enemyRow.children).filter(function (node) {
        return node.classList.contains("enemy-token");
      }).map(function (node) { return [node.getAttribute("data-enemy-id"), node]; }));
      const activeEnemyIds = new Set();
      battle.enemies.filter(function (enemy) { return enemy.lane === lane; }).forEach(function (enemy) {
        const enemyId = String(enemy.id);
        const token = tokenById.get(enemyId) || document.createElement("span");
        updateEnemyToken(token, enemy);
        activeEnemyIds.add(enemyId);
        enemyRow.appendChild(token);
      });
      tokenById.forEach(function (token, enemyId) {
        if (!activeEnemyIds.has(enemyId)) token.remove();
      });
      enemyRow.querySelectorAll(".combat-effect").forEach(function (node) { node.remove(); });
      battle.effects.filter(function (effect) { return effect.lane === lane; }).forEach(function (effect) {
         const effectNode = document.createElement("span");
         effectNode.className = "combat-effect " + effect.kind;
         effectNode.style.left = (effect.position * 100) + "%";
         effectNode.textContent = effect.text;
         enemyRow.appendChild(effectNode);
       });
      const playerRow = playerRows[lane];
      playerRow.setAttribute("data-lane", t("lane") + " " + (lane + 1));
      playerRow.innerHTML = "";
      battle.units.forEach(function (unit, slot) {
        if (!unit || slot % 3 !== lane) return;
        const token = document.createElement("span");
        token.className = "lane-unit unit-type-" + unit.type + (unit.general ? " general-unit" : "") + (unit.attackFlash > 0 ? " is-attacking" : "");
        const unitLabelText = unitLabel(unit);
        const glyph = unit.general ? data.generals[unit.type].glyph : data.unitTypes[unit.type].glyph;
        token.innerHTML = "<span class=\"lane-unit-glyph\" aria-hidden=\"true\">" + glyph + "</span><span class=\"lane-unit-name\">" + escapeHtml(unitLabelText) + "</span><span class=\"lane-unit-arrow\" aria-hidden=\"true\">" + (unit.attackFlash > 0 ? "→" : "") + "</span>";
        token.style.color = unit.general ? data.generals[unit.type].color : data.unitTypes[unit.type].color;
        token.title = unitName(unit);
        token.setAttribute("aria-label", unitName(unit) + ", " + t("lane") + " " + (lane + 1) + (unit.attackFlash > 0 ? ", " + t("attackCue") : ""));
        playerRow.appendChild(token);
      });
    }
  }

  function ensureLaneRows(container) {
    const rows = Array.from(container.children);
    if (rows.length !== 3 || rows.some(function (row) { return !row.classList.contains("lane-row"); })) {
      container.innerHTML = "";
      for (let lane = 0; lane < 3; lane += 1) {
        const row = document.createElement("div");
        row.className = "lane-row";
        container.appendChild(row);
      }
      return Array.from(container.children);
    }
    return rows;
  }

  function updateEnemyToken(token, enemy) {
    const enemyLabel = enemy.boss ? t("boss_"+enemy.bossKind) : t("enemy_"+enemy.kind);
    const hpPercent = Math.max(0, Math.round((enemy.hp / enemy.maxHp) * 100));
      token.className = "enemy-token enemy-kind-" + (enemy.id % 3) + (enemy.boss ? " boss" : "") + (enemy.hitFlash > 0 ? " is-hit" : "") + (enemy.defeatedTicks > 0 ? " is-defeated" : "");
      token.setAttribute("data-enemy-id", String(enemy.id));
    token.style.left = enemyTokenPosition(getEnemyVisualPosition(enemy, window.performance?.now?.() || Date.now()));
    token.setAttribute("aria-label", enemyLabel + ", " + t("hp") + " " + enemy.hp + "/" + enemy.maxHp);
    token.title = enemyLabel + " / " + enemy.hp + " / " + enemy.maxHp;
    token.innerHTML = "<span class=\"enemy-glyph\">" + (enemy.boss ? "將" : "卒") + "</span><span class=\"enemy-name\">" + escapeHtml(enemyLabel) + "</span><span class=\"enemy-health\"><span style=\"width:" + hpPercent + "%\"></span></span>";
  }

  function renderFormation() {
    const renderKey = locale + "|" + selectedSlot + "|" + battle.units.map(function (unit) {
      return unit ? [unit.type, unit.level, unit.general ? "g" : "u"].join(":") : "-";
    }).join(",");
    if (renderKey === formationRenderKey && el.formation.children.length === battle.units.length) return;
    formationRenderKey = renderKey;
    el.formation.innerHTML = "";
    el.formationHint.textContent = selectedSlot === null ? t("mergeHint") : t("selected") + ": " + unitName(battle.units[selectedSlot]) + ". " + t("mergeHint");
    battle.units.forEach(function (unit, slot) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "unit-slot" + (unit ? " unit-type-" + unit.type : "") + (unit ? "" : " empty") + (selectedSlot === slot ? " selected" : "") + (unit && unit.general ? " general-unit" : "");
      button.setAttribute("role", "gridcell");
       button.setAttribute("data-slot", String(slot));
       button.setAttribute("aria-pressed", selectedSlot === slot ? "true" : "false");
      button.setAttribute("aria-label", unit ? unitName(unit) + ", " + t("lane") + " " + ((slot % 3) + 1) : t("empty") + ", " + t("lane") + " " + ((slot % 3) + 1));
      const laneLabel = "L" + ((slot % 3) + 1);
      const levelLabel = unit && unit.general ? "★" : t("level") + " " + (unit ? unit.level : "");
      button.innerHTML = unit
        ? "<span class=\"unit-lane\" aria-hidden=\"true\">" + laneLabel + "</span><span class=\"unit-glyph\" style=\"--unit-color:" + (unit.general ? data.generals[unit.type].color : data.unitTypes[unit.type].color) + "\">" + (unit.general ? data.generals[unit.type].glyph : data.unitTypes[unit.type].glyph) + "</span><span class=\"unit-level\" aria-hidden=\"true\">" + levelLabel + "</span>"
        : "<span aria-hidden=\"true\">＋</span>";
      button.addEventListener("dragstart", function (event) {
        if (!unit) { event.preventDefault(); return; }
        dragSlot = slot;
        event.dataTransfer.effectAllowed = "move";
      });
      button.addEventListener("dragover", function (event) { event.preventDefault(); });
      button.addEventListener("drop", function (event) {
        event.preventDefault();
        if (dragSlot !== null) {
          const source = dragSlot;
          dragSlot = null;
          selectedSlot = source;
          handleSlot(slot);
        }
      });
      if (unit) button.draggable = true;
      el.formation.appendChild(button);
    });
  }

  function renderSkills() {
    const key=locale+':v29';
    if(el.skills.dataset.renderKey!==key){
      el.skills.dataset.renderKey=key;el.skills.innerHTML='';
      const button=document.createElement('button');button.type='button';button.className='skill-button skill-horse';button.dataset.skill='horse';
      button.innerHTML='<strong></strong><span class="skill-cooldown"></span>';
      button.addEventListener('click',()=>useSkill('horse'));el.skills.append(button);
    }
    const button=el.skills.firstElementChild,cooldown=battle.skillsUsed.horse||0;
    button.disabled=cooldown>0||Boolean(battle.result);button.classList.toggle('ready',!cooldown);
    button.querySelector('strong').textContent=t('chargeAction');
    button.querySelector('span').textContent=cooldown?Math.ceil(cooldown/10)+'s':t('chargeAuto');
    button.setAttribute('aria-label',t('chargeAction')+': '+(cooldown?Math.ceil(cooldown/10)+'s':t('chargeAuto')));
  }

  function unitLabel(unit) {
    if (unit.general) return generalName(unit);
    const definition = data.unitTypes[unit.type];
    const localized = (dictionaries[locale] || dictionaries.en).unitLabels?.[unit.type];
    return localized || (locale === "en" ? definition.english : definition.name);
  }

  function unitName(unit) {
    return t("unitAtLevel", { unit: unitLabel(unit), level: unit.level });
  }

  function generalName(unit) {
    const definition = data.generals[unit.type];
    const localized = (dictionaries[locale] || dictionaries.en).generalLabels?.[unit.type];
    return localized || (locale === "en" ? definition.english : definition.name);
  }

  function skillName(unit) {
    const definition = data.generals[unit.type];
    const localized = (dictionaries[locale] || dictionaries.en).skillLabels?.[unit.type];
    return localized || (locale === "en" ? definition.skillEnglish : definition.skill);
  }

  function applyLocale(nextLocale) {
    if (localeCodes.indexOf(nextLocale) < 0) return;
    locale = nextLocale;
    safeSet("weightPlayLocale", locale);
    updateStaticLocale();
    emitMeasurementEvent("locale-change", { locale: locale });
  }

  function setStatus(message, kind) {
    if (!battle) return;
    battle.status = message;
    if (el.status) {
      el.status.dataset.statusKind = kind || "";
      el.status.classList.remove("status-line--payoff", "status-line--promotion");
      if (kind) {
        void el.status.offsetWidth;
        el.status.classList.add(kind === "promotion" ? "status-line--promotion" : "status-line--payoff");
      }
    }
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () {
      if (battle && !battle.result) {
        battle.status = "";
        el.status?.classList.remove("status-line--payoff", "status-line--promotion");
        if (el.status) el.status.dataset.statusKind = "";
      }
    }, 2200);
  }

  function closeDialogs() {
    setFormationOpen(false);
    document.getElementById("talentDialog").close();
    [el.tutorial, el.leaveBattle, el.result].forEach(function (dialog) {
      if (dialog && dialog.open) (__wpNotifyMeasurement(), dialog.close());
    });
  }

  function showLeaveDialog() {
    if (battle && !battle.result) (__wpNotifyMeasurement(), el.leaveBattle.showModal());
  }

  function showHint() {
    if (!battle || battle.result) return;
    const pair = findMergePair();
    if (pair) {
      selectedSlot = pair[0];
      setStatus(t("tip") + ": " + unitName(battle.units[pair[0]]) + " + " + unitName(battle.units[pair[1]]));
      renderFormation();
    } else {
      setStatus(t("tipText"));
    }
  }

  function findMergePair() {
    for (let i = 0; i < battle.units.length; i += 1) {
      for (let j = i + 1; j < battle.units.length; j += 1) {
        if (canMerge(battle.units[i], battle.units[j])) return [i, j];
      }
    }
    return null;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[character];
    });
  }

  el.start.addEventListener("click", showStage);
  el.locale.addEventListener("change", function () {
    const nextLocale = el.locale.value;
    if (window.WonderI18n?.actualLocale?.() !== nextLocale) {
      window.WonderI18n?.setLocale?.(nextLocale, { navigate: false });
    } else {
      applyLocale(nextLocale);
    }
  });
  window.addEventListener("wonder:locale-change", function (event) {
    const nextLocale = event.detail?.locale || window.WonderI18n?.actualLocale?.();
    if (nextLocale && nextLocale !== locale) applyLocale(nextLocale);
  });
  el.recruit.addEventListener("click", recruit);
  function renderTalents() {
    const locked=document.body.dataset.screen==='battle';
    const total=talents.points(progress.stars),picked=progress.talents||[];
    document.getElementById('talentSummary').textContent=locked?t('talentLocked'):t('talentPoints',{left:total-picked.length,total});
    document.getElementById('recruitOdds').textContent=t('recruitOdds')+' '+t('typeOdds');
    const tree=document.getElementById('talentTree');tree.replaceChildren();
    for(const branch of talents.branches){
      const column=document.createElement('section');column.className='talent-branch';
      const heading=document.createElement('h3');heading.textContent=t('branch_'+branch);column.append(heading);
      for(const node of talents.nodes.filter(n=>n.branch===branch)){
        const button=document.createElement('button');button.type='button';button.dataset.talent=node.id;
        const selected=picked.includes(node.id);button.className='talent-node unit-type-'+node.art+(node.tier===3?' general-unit':'');
        button.setAttribute('aria-pressed',String(selected));
        button.disabled=locked||selected||picked.length>=total||Boolean(node.parent&&!picked.includes(node.parent));
        const art=document.createElement('span');art.className='talent-art';art.setAttribute('aria-hidden','true');
        const label=document.createElement('span');label.textContent=t('talent_'+node.id);
        const badge=document.createElement('small');badge.textContent=(selected?'✓ ':'')+node.tier+'/3';
        button.append(art,label,badge);button.addEventListener('click',()=>{
          if(document.body.dataset.screen==='battle')return;
          progress.talents=talents.normalize([...picked,node.id],progress.stars);saveProgress();renderTalents();
          document.querySelector('[data-talent="'+node.id+'"]').focus();
        });column.append(button);
      }tree.append(column);
    }
    document.getElementById('talentReset').disabled=locked||!picked.length;
  }
  function openTalents(){renderTalents();document.getElementById('talentDialog').showModal();}
  document.getElementById('talentsOpen').addEventListener('click',openTalents);
  document.getElementById('talentClose').addEventListener('click',()=>document.getElementById('talentDialog').close());
  document.getElementById('talentReset').addEventListener('click',()=>{
    if(document.body.dataset.screen==='battle')return;
    progress.talents=[];saveProgress();renderTalents();
  });
  function setFormationOpen(open) {
    const panel = document.getElementById('formationPanel');
    const toggle = document.getElementById('formationToggle');
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.lastElementChild.textContent = open ? '▾' : '▴';
  }
  document.getElementById('formationToggle').addEventListener('click', () => {
    setFormationOpen(document.getElementById('formationPanel').hidden);
  });
  el.battleUtility?.addEventListener("click", function () {
    if (!battle || battle.result || !el.tutorial) return;
    if (el.tutorial.open) (__wpNotifyMeasurement(), el.tutorial.close());
    else (__wpNotifyMeasurement(), el.tutorial.show());
  });
  el.formation.addEventListener("click", function (event) {
    const target = event.target;
    const button = target && typeof target.closest === "function" ? target.closest(".unit-slot") : null;
    if (!button || !el.formation.contains(button)) return;
    handleSlot(Number(button.getAttribute("data-slot")));
  });
  el.hint.addEventListener("click", openTalents);
  el.battleBack.addEventListener("click", showLeaveDialog);
  document.querySelector("#stage [data-back]").addEventListener("click", showMain);
  el.tutorialClose.addEventListener("click", function () { (__wpNotifyMeasurement(), el.tutorial.close()); });
  el.continueBattle.addEventListener("click", function () { (__wpNotifyMeasurement(), el.leaveBattle.close()); });
  el.returnToStage.addEventListener("click", showStage);
  el.resultStages.addEventListener("click", showStage);
  el.retry.addEventListener("click", function () { (__wpNotifyMeasurement(), el.result.close()); __wpReplayStart(() => startBattle(stageIndex, { skipTutorial: true, entry: "retry" })); });
  el.next.addEventListener("click", function () {
    if (el.next.disabled) return;
    (__wpNotifyMeasurement(), el.result.close());
    startBattle(stageIndex + 1, { skipTutorial: true, entry: "next" });
  });
  el.battle.addEventListener("scroll", function () {
    if (el.battle.scrollTop) el.battle.scrollTop = 0;
  }, { passive: true });
  document.addEventListener("keydown", function (event) {
    if ([document.getElementById("talentDialog"), el.tutorial, el.leaveBattle, el.result].some(function (dialog) { return dialog.open; })) {
      if (event.key === "Escape" && el.tutorial.open) (__wpNotifyMeasurement(), el.tutorial.close());
      return;
    }
    if (event.key === 'Escape' && !document.getElementById('formationPanel').hidden) {
      setFormationOpen(false);
      document.getElementById('formationToggle').focus();
      return;
    }
    if (document.activeElement && ["INPUT", "SELECT", "TEXTAREA"].indexOf(document.activeElement.tagName) >= 0) return;
    if (event.key.toLowerCase() === "r" && battle && !battle.result) recruit();
    if (event.key.toLowerCase() === "h" && battle && !battle.result) showHint();
    if (event.key >= "1" && event.key <= "9" && battle && !battle.result) handleSlot(Number(event.key) - 1);
    if (event.key === "Escape" && el.leaveBattle.open) (__wpNotifyMeasurement(), el.leaveBattle.close());
  });

  updateStaticLocale();
  frame = window.mountZhaoFrame();
  showScreen("main");
  window.setTimeout(updateStaticLocale, 900);

  window.addEventListener("pagehide",()=>{stopLoop();stopWorld();audioContext?.close().catch(()=>{});audioContext=null;});
  window.addEventListener('pageshow',event=>{if(event.persisted&&battle&&document.body.dataset.screen==='battle'){startWorld();if(!battle.result)startLoop();}});
  window.__zhaoYunADouSmoke = {
    renderer:()=>world?{...world.info,pending:worldPending,failed:worldFailed}:null,
    snapshot: function () {
      return {
        screen: document.body.getAttribute("data-screen"),
        stageIndex: stageIndex + 1,
        unlocked: progress.unlocked,
        result: battle && battle.result,
        commandHp: battle && battle.commandHp,
        adouHp: battle && battle.adouHp,
        buns: battle && battle.buns, pity:battle?.pity, talents:battle?.talents, rescued:battle?.rescued, recruitIndex:battle?.recruitIndex,
        wave:battle?.wave, rule:battle?.level.rule, commandLane:battle?.commandLane, cooldown:battle?.skillsUsed.horse||0, ticks:battle?.ticks, bestTimes:progress.bestTimes,
        enemyStates:battle?.enemies.map(e=>({id:e.id,kind:e.kind,bossKind:e.bossKind,hp:e.hp,lane:e.lane,position:e.position,age:e.age,shield:e.shield,telegraph:e.telegraph})),
        enemies: battle ? battle.enemies.length : 0,
        units: battle ? battle.units.map(function (unit) { return unit && { type: unit.type, level: unit.level, general: unit.general }; }) : [],
      };
    },
    enterStage: showStage,
    enterBattle: function (index, options) { startBattle(Number(index) || 0, Object.assign({ skipTutorial: true }, options || {})); },
    recruit: recruit,
    chooseRecruit:()=>{},
    talents:()=>({picked:progress.talents,points:talents.points(progress.stars)}),
    skill:useSkill,
    aim:lane=>{if(battle&&[0,1,2].includes(lane))battle.commandLane=lane;},
    selectSlot: handleSlot,
    mergePair: function (first, second) { selectedSlot = Number(first); handleSlot(Number(second)); },
    advance: advanceBattle,
    finish: finishBattle,
    setLocale: function (nextLocale) {
      if (localeCodes.indexOf(nextLocale) < 0) return;
      locale = nextLocale;
      updateStaticLocale();
    },
  };
}());
