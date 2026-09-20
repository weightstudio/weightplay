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
  let battle = null;
  let loopTimer = null;
  let motionFrame = null;
  let statusTimer = null;
  let frame = null;
  let world = null, worldGeneration = 0, worldPending = false, worldFailed = false;
  const talents = window.ZhaoTalents;
  const hasTalent = id => (battle?.talents || progress.talents || []).includes(id);
  const push = window.ZhaoPush;
  let audioContext = null, lastSound = 0;
  const worldModuleUrl = new URL("battle-3d.js?v=20260920-zhao-v32", document.currentScript.src).href;
  let worldModule = null, worldImportAttempts = 0;
  function loadWorldModule() {
    return worldModule ||= import(worldModuleUrl + (worldImportAttempts++ ? '&retry='+worldImportAttempts : '')).catch(() => {worldModule=null;return null;});
  }
  function paused() { return document.hidden || document.getElementById('talentDialog')?.open || worldPending || worldFailed || Boolean(el.tutorial?.open || el.leaveBattle?.open || document.querySelector('#battle .wp-frame-popover:not([hidden])')); }
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
    buns: document.getElementById("buns"),
    adouHp: document.getElementById("adouHp"),
    skills: document.getElementById("skills"),
    battleActions: document.querySelector("#battle .battle-actions"),
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
    showScreen("main");
  }

  function showStage() {
    stopLoop();
    stopWorld();
    closeDialogs();
    battle = null;
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
    document.getElementById('talentsOpen').textContent=t('talents')+' · '+(talents.points(progress.stars)-(progress.talents||[]).length);
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

  function createBattle(level) { return push.create(level, progress.talents || []); }

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

  function renderEnemyMotion(timestamp) {
    motionFrame = null;
    if (!battle) return;
    world?.render(battle, timestamp, paused() || Boolean(battle.result));
    if (!battle.result) motionFrame = window.requestAnimationFrame(renderEnemyMotion);
  }

  function advanceBattle(steps) {
    if (!battle || battle.result) return;
    for (let step = 0; step < steps; step += 1) tickBattle();
    renderBattle();
  }

  function tickBattle() {
    if (battle.result) return;
    const outcome = push.step(battle);
    battle.motionTimestamp = performance.now();
    for (const event of new Set(battle.events)) {
      if (event === 'wave') setStatus(t('waveReward'));
      else if (event === 'boss') setStatus(t('boss_' + battle.level.bossKind));
      else sound(event);
    }
    if (outcome) finishBattle(outcome);
  }

  function recruit(type = 'blade') {
    if (!battle || battle.result || paused()) return;
    if (push.deploy(battle, type)) {
      sound('merge');
      setStatus(t('statusRecruit') + ' ' + unitLabel({type, general:false}));
      renderBattle();
      emitMeasurementEvent('recruit', {stage:stageIndex + 1, troop:type});
    }
  }

  function useSkill() {
    if (!battle || battle.result || paused()) return;
    if (push.charge(battle)) {
      sound('charge'); setStatus(t('chargeAuto')); renderBattle();
      emitMeasurementEvent('skill', {skill:'horse', stage:stageIndex + 1});
    } else if (!battle.enemies.some(e => e.hp > 0)) setStatus(t('noTarget'));
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
          : "protect_camp",
    });

    __wpMeasurement.ended = true; __wpMeasurement.outcome = (typeof result === "boolean" ? (result ? "win" : "lose") : typeof result === "string" ? result : "complete"); if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}

  function renderBattle() {
    if (!battle) return;
    const level = battle.level;
    battle.bossLabel = level.bossKind ? t("boss_" + level.bossKind) : "";
    el.stageName.textContent = stageName(level);
    el.remaining.textContent = t('wave') + ' ' + battle.wave + ' / 3';
    el.enemyHp.textContent = Math.ceil(battle.commandHp) + ' / ' + battle.maxCommandHp;
    el.buns.textContent = battle.buns + ' / 30';
    el.adouHp.textContent = Math.ceil(battle.adouHp) + ' / ' + battle.maxAdouHp;
    el.status.textContent = battle.status || t('pushGoal');
    el.pressureCue.textContent = battle.units.filter(u=>u.hp>0).length>=12 ? t('pushFull') : t('rule_' + level.rule);
    const dock = document.getElementById('deployDock');
    if (dock.dataset.locale !== locale) {
      dock.dataset.locale=locale; dock.replaceChildren();
      for (const type of unitTypes) {
        const button=document.createElement('button');
        button.type='button';button.dataset.deploy=type;button.className='deploy-card unit-type-'+type;
        if (type === 'blade') button.setAttribute('data-wp-primary-action','');
        button.innerHTML='<span class="deploy-art" aria-hidden="true"></span><strong></strong><small></small><span class="deploy-cost"></span>';
        button.querySelector('strong').textContent=unitLabel({type,general:false});
        button.querySelector('small').textContent=t('role_'+type);
        button.addEventListener('click',()=>recruit(type));dock.append(button);
      }
    }
    for (const button of dock.children) {
      const type=button.dataset.deploy, cooldown=battle.deployCooldown[type]||0, cost=push.cost(battle,type);
      button.disabled=Boolean(battle.result)||cooldown>0||battle.buns<cost||battle.units.filter(u=>u.hp>0).length>=12;
      button.querySelector('.deploy-cost').textContent=cooldown?Math.ceil(cooldown/10)+'s':cost+' '+t('buns');
      button.style.setProperty('--ready', (100-cooldown/push.troops[type].cooldown*100)+'%');
      button.setAttribute('aria-label',unitLabel({type,general:false})+' · '+t('role_'+type)+' · '+(cooldown?Math.ceil(cooldown/10)+'s':cost+' '+t('buns')));
    }
    renderSkills();
  }

  function renderSkills() {
    const key=locale+':v32';
    if(el.skills.dataset.renderKey!==key){
      el.skills.dataset.renderKey=key;el.skills.innerHTML='';
      const button=document.createElement('button');button.type='button';button.className='skill-button skill-horse';button.dataset.skill='horse';
      button.innerHTML='<strong></strong><span class="skill-cooldown"></span>';
      button.addEventListener('click',()=>useSkill('horse'));el.skills.append(button);
    }
    const button=el.skills.firstElementChild,cooldown=battle.skillsUsed.horse||0;
    button.disabled=cooldown>0||Boolean(battle.result);button.classList.toggle('ready',!cooldown);
    button.querySelector('strong').textContent=t('chargeAction');
    const effect=t('chargeAuto');
    button.querySelector('span').textContent=cooldown?Math.ceil(cooldown/10)+'s':effect;
    button.setAttribute('aria-label',t('chargeAction')+': '+(cooldown?Math.ceil(cooldown/10)+'s':effect));
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

    document.getElementById("talentDialog").close();
    [el.tutorial, el.leaveBattle, el.result].forEach(function (dialog) {
      if (dialog && dialog.open) (__wpNotifyMeasurement(), dialog.close());
    });
  }

  function showLeaveDialog() {
    if (battle && !battle.result) (__wpNotifyMeasurement(), el.leaveBattle.showModal());
  }

  function showHint() { if (battle && !battle.result) setStatus(t('pushGoal')); }

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

  function renderTalents() {
    const locked=document.body.dataset.screen==='battle';
    const total=talents.points(progress.stars),picked=progress.talents||[];
    document.getElementById('talentSummary').textContent=locked?t('talentLocked'):t('talentPoints',{left:total-picked.length,total});
    document.getElementById('recruitOdds').textContent=t('talentHelp');
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


  el.battleUtility?.addEventListener("click", function () {
    if (!battle || battle.result || !el.tutorial) return;
    if (el.tutorial.open) (__wpNotifyMeasurement(), el.tutorial.close());
    else (__wpNotifyMeasurement(), el.tutorial.show());
  });


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


    if (document.activeElement && ["INPUT", "SELECT", "TEXTAREA"].indexOf(document.activeElement.tagName) >= 0) return;
    if (event.key.toLowerCase() === "r" && battle && !battle.result) recruit();
    if (event.key.toLowerCase() === "h" && battle && !battle.result) showHint();
    if (event.key >= "1" && event.key <= "4" && battle && !battle.result) recruit(unitTypes[Number(event.key)-1]);
    if (event.code === "Space" && battle && !battle.result) { event.preventDefault(); useSkill(); }
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
        deployCooldown:battle?.deployCooldown, buns: battle && battle.buns, pity:battle?.pity, talents:battle?.talents, rescued:battle?.rescued, recruitIndex:battle?.recruitIndex,
        wave:battle?.wave, rule:battle?.level.rule, commandLane:battle?.commandLane, cooldown:battle?.skillsUsed.horse||0, ticks:battle?.ticks, bestTimes:progress.bestTimes,
        enemyStates:battle?.enemies.map(e=>({id:e.id,kind:e.kind,bossKind:e.bossKind,hp:e.hp,x:e.x,lane:e.lane,position:e.position,age:e.age,shield:e.shield,telegraph:e.telegraph,stun:e.stun})),
        enemies: battle ? battle.enemies.length : 0,
        units: battle ? battle.units.map(function (unit) { return unit && { type: unit.type, level: unit.level, general: unit.general, x:unit.x, hp:unit.hp, attackCooldown:unit.attackCooldown }; }) : [],
      };
    },
    enterStage: showStage,
    enterBattle: function (index, options) { startBattle(Number(index) || 0, Object.assign({ skipTutorial: true }, options || {})); },
    recruit: recruit,

    talents:()=>({picked:progress.talents,points:talents.points(progress.stars)}),
    skill:useSkill,



    advance: advanceBattle,
    finish: finishBattle,
    setLocale: function (nextLocale) {
      if (localeCodes.indexOf(nextLocale) < 0) return;
      locale = nextLocale;
      updateStaticLocale();
    },
  };
}());
