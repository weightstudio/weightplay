(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const LOCALES = window.RUNE_REELS_LOCALES;
  const localeKeys = Object.keys(LOCALES);
  const storageKey = "weightplay.animalRuneReels.v2";
  const legacyStorageKey = "weightplay.animalRuneReels.v1";
  const trialMode = new URLSearchParams(location.search).get("trial") === "1";
  const ASSET_ROOT = "../../assets/";
  const memoryStorage = new Map();

  const symbols = {
    lion: {
      key: "lionSymbol",
      img: "weightplay-character-boom-mane-lion-cutout.webp",
      color: "#ffd15a",
    },
    turtle: {
      key: "turtleSymbol",
      img: "weightplay-character-moss-shell-turtle-cutout.webp",
      color: "#61e2c4",
    },
    rabbit: {
      key: "rabbitSymbol",
      img: "weightplay-character-rainbow-hop-mimi-clean-cutout.webp",
      color: "#65ef9d",
    },
    stone: {
      key: "stoneSymbol",
      img: "animal-rune-reels/dormant-rune-stone.webp",
      color: "#9aa4bf",
    },
  };
  const symbolIds = Object.keys(symbols);
  const enemyAssets = [
    "animal-gearpack-expedition-enemy-root-guardian.webp",
    "animal-gearpack-expedition-enemy-armored-boar.webp",
    "animal-gearpack-expedition-enemy-crystal-crow.webp",
    "animal-rune-tactics-enemy-wolf.webp",
    "animal-rune-tactics-enemy-raven.webp",
  ];
  const attackMultipliers = [0, 1.2, 1.4, 2];
  const defenseMultipliers = [0, 1.2, 1.4, 2];
  const healingPercents = [0, 2, 4, 10];
  const chapterNames = {
    en: ["Whispering Gate", "Moonforge Steps", "Thornveil Court", "Stormglass Ring", "Voidpaw Spire", "Astral Crown"],
    "zh-Hant": ["低語之門", "月爐階梯", "棘幕王庭", "風暴晶環", "虛爪高塔", "星界王冠"],
    "zh-Hans": ["低语之门", "月炉阶梯", "棘幕王庭", "风暴晶环", "虚爪高塔", "星界王冠"],
    ja: ["囁きの門", "月炉の階段", "茨幕の宮廷", "嵐晶の環", "虚爪の塔", "星界の冠"],
    ko: ["속삭임의 문", "달빛 대장간", "가시 장막 궁정", "폭풍 수정 고리", "공허발톱 첨탑", "별의 왕관"],
    es: ["Puerta Susurrante", "Peldaños Lunares", "Corte del Velo", "Anillo de Tormenta", "Aguja del Vacío", "Corona Astral"],
    "pt-BR": ["Portão Sussurrante", "Degraus da Lua", "Corte do Véu", "Anel da Tempestade", "Torre do Vazio", "Coroa Astral"],
    fr: ["Porte Murmurante", "Marches Lunaires", "Cour du Voile", "Anneau de Tempête", "Flèche du Vide", "Couronne Astrale"],
    de: ["Flüstertor", "Mondschmiede", "Dornenhof", "Sturmglasring", "Leerenpfotenturm", "Astralkrone"],
    it: ["Porta Sussurrante", "Gradini Lunari", "Corte del Velo", "Anello della Tempesta", "Guglia del Vuoto", "Corona Astrale"],
    ru: ["Шепчущие врата", "Лунная кузня", "Двор шипов", "Кольцо бури", "Башня пустоты", "Астральная корона"],
    hi: ["फुसफुसाता द्वार", "चंद्र भट्ठी", "काँटों का दरबार", "तूफानी वलय", "शून्य पंजा मीनार", "तारकीय मुकुट"],
    ar: ["بوابة الهمس", "درجات القمر", "بلاط الشوك", "حلقة العاصفة", "برج الفراغ", "التاج النجمي"],
  };

  let profile = loadProfile();
  let locale = pickLocale();
  let selectedStage = Math.min(profile.unlocked, 30);
  let battle = null;
  let centerTimer = 0;

  function readStorage(key) {
    try { return localStorage.getItem(key); }
    catch { return memoryStorage.get(key) ?? null; }
  }

  function writeStorage(key, value) {
    memoryStorage.set(key, value);
    try { localStorage.setItem(key, value); }
    catch { /* Memory fallback keeps this session playable. */ }
  }

  function clampInt(value, min, max, fallback) {
    const number = Number(value);
    return Number.isInteger(number) && number >= min && number <= max ? number : fallback;
  }

  function loadProfile() {
    try {
      const raw = readStorage(storageKey) || readStorage(legacyStorageKey) || "{}";
      const data = JSON.parse(raw);
      return {
        unlocked: clampInt(data.unlocked, 1, 30, 1),
        sparks: clampInt(data.sparks, 0, 99999, 0),
        upgrades: {
          attack: clampInt(data.upgrades?.attack, 1, 8, 1),
          guard: clampInt(data.upgrades?.guard, 1, 8, 1),
          heal: clampInt(data.upgrades?.heal, 1, 8, 1),
        },
        best: Array.isArray(data.best)
          ? data.best.slice(0, 30).map((value) => clampInt(value, 0, 3, 0))
          : Array(30).fill(0),
        tutorial: Boolean(data.tutorial),
      };
    } catch {
      return {
        unlocked: 1,
        sparks: 0,
        upgrades: { attack: 1, guard: 1, heal: 1 },
        best: Array(30).fill(0),
        tutorial: false,
      };
    }
  }

  function save() {
    writeStorage(storageKey, JSON.stringify(profile));
  }

  function pickLocale() {
    const queryLocale = new URLSearchParams(location.search).get("lang");
    const sharedLocale = window.WonderI18n?.actualLocale?.();
    const savedLocale = readStorage(`${storageKey}.locale`);
    const browserLocale = navigator.language;
    return localeKeys.includes(queryLocale) ? queryLocale
      : localeKeys.includes(sharedLocale) ? sharedLocale
      : localeKeys.includes(savedLocale) ? savedLocale
      : localeKeys.find((key) => browserLocale.toLowerCase().startsWith(key.toLowerCase().split("-")[0])) || "en";
  }

  function t(key) {
    return LOCALES[locale]?.[key] || LOCALES.en[key] || key;
  }

  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${t("title")} — ${t("internalTrial")}`;
    $$('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
    $$('[data-i18n-aria]').forEach((element) => element.setAttribute("aria-label", t(element.dataset.i18nAria)));
    $("#localeSelect").value = locale;
    if (battle) renderBattle();
  }

  function initLocales() {
    for (const key of localeKeys) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = LOCALES[key].name;
      $("#localeSelect").append(option);
    }
    $("#localeSelect").addEventListener("change", (event) => {
      locale = event.target.value;
      writeStorage(`${storageKey}.locale`, locale);
      window.WonderI18n?.setLocale?.(locale);
      applyLocale();
      renderStages();
    });
    window.addEventListener("wonder:locale-change", (event) => {
      const next = event.detail?.locale;
      if (!localeKeys.includes(next)) return;
      locale = next;
      setTimeout(() => { applyLocale(); renderStages(); }, 0);
    });
  }

  function syncLiveViewport() {
    const viewport = window.visualViewport;
    const width = viewport?.width || innerWidth;
    const height = viewport?.height || innerHeight;
    document.documentElement.style.setProperty("--live-width", `${Math.round(width * 100) / 100}px`);
    document.documentElement.style.setProperty("--live-height", `${Math.round(height * 100) / 100}px`);
    if (!$("#stagePage")?.hidden) requestAnimationFrame(() => centerStage(selectedStage, false));
  }

  function show(id) {
    $$(".page").forEach((page) => { page.hidden = page.id !== id; });
    scrollTo(0, 0);
  }

  function heroStats() {
    return {
      attack: 20 + profile.upgrades.attack * 4,
      defense: 12 + profile.upgrades.guard * 3,
      maxHp: 110 + profile.upgrades.heal * 10,
    };
  }

  function stageData(stage) {
    const boss = stage % 5 === 0;
    const chapter = Math.ceil(stage / 5);
    const position = (stage - 1) % 5;
    const enemyCount = boss ? 3 : Math.min(3, 1 + Math.floor(position / 2));
    const totalHp = (boss ? 130 + chapter * 34 : 62 + stage * 9) + (enemyCount - 1) * 16;
    const stats = heroStats();
    return {
      n: stage,
      boss,
      chapter,
      enemyCount,
      totalHp,
      playerHp: stats.maxHp,
      enemyPower: 6 + Math.floor(stage * 1.15) + (boss ? 5 : 0),
      reward: 8 + stage + (boss ? 12 : 0),
    };
  }

  function chapterName(stage) {
    const names = chapterNames[locale] || chapterNames.en;
    return names[Math.floor((stage - 1) / 5)];
  }

  function enemyAssetFor(stage, index) {
    return enemyAssets[(Math.floor((stage - 1) / 5) + index) % enemyAssets.length];
  }

  function renderStages() {
    const rail = $("#stageRail");
    rail.innerHTML = "";
    for (let stage = 1; stage <= 30; stage += 1) {
      const data = stageData(stage);
      const locked = stage > profile.unlocked;
      const stars = profile.best[stage - 1] ? ` · ${"★".repeat(profile.best[stage - 1])}` : "";
      const card = document.createElement("button");
      card.className = `stage-card${locked ? " locked" : ""}`;
      card.dataset.stage = String(stage);
      card.setAttribute("aria-disabled", String(locked));
      const portraits = Array.from({ length: data.enemyCount }, (_, index) => (
        `<img src="${ASSET_ROOT}${enemyAssetFor(stage, index)}" alt="">`
      )).join("");
      card.innerHTML = `
        <small>${chapterName(stage)}${locked ? ` · ${t("locked")}` : stars}</small>
        <h3>${data.boss ? t("boss") : t("stage")} ${stage}</h3>
        <div class="stage-enemy-preview" data-count="${data.enemyCount}">${portraits}</div>
        <p>${t("hp")} ${data.totalHp} · ${t("attackShort")} ${data.enemyPower}</p>
        <div class="monster-chip"><span>${data.boss ? t("guardianSquad") : t("enemySquadLabel")}</span><span class="monster-count">×${data.enemyCount}</span></div>`;
      card.addEventListener("click", () => {
        if (!locked) centerStage(stage, true);
      });
      rail.append(card);
    }
    updateStageUi();
    requestAnimationFrame(() => centerStage(selectedStage, false));
  }

  function centerStage(stage, smooth) {
    const card = $(`.stage-card[data-stage="${stage}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "center", block: "nearest" });
    selectedStage = stage;
    updateStageUi();
  }

  function updateStageUi() {
    $$(".stage-card").forEach((card) => card.classList.toggle("centered", Number(card.dataset.stage) === selectedStage));
    $("#campaignProgress").textContent = `${profile.unlocked} / 30`;
    $("#sparkCount").textContent = String(profile.sparks);
    for (const kind of ["attack", "guard", "heal"]) {
      $(`#${kind}Level`).textContent = `${t("level")} ${profile.upgrades[kind]}`;
    }
  }

  function settleRail() {
    clearTimeout(centerTimer);
    centerTimer = setTimeout(() => {
      const rail = $("#stageRail");
      const midpoint = rail.getBoundingClientRect().left + rail.clientWidth / 2;
      let closest = null;
      let distance = Infinity;
      $$(".stage-card").forEach((card) => {
        const rect = card.getBoundingClientRect();
        const current = Math.abs(rect.left + rect.width / 2 - midpoint);
        if (current < distance) { closest = card; distance = current; }
      });
      if (closest) centerStage(Number(closest.dataset.stage), true);
    }, 100);
  }

  function upgrade(kind) {
    const level = profile.upgrades[kind];
    const cost = level * 18;
    if (level >= 8) return toast(t("max"));
    if (profile.sparks < cost) return toast(t("needSparks"));
    profile.sparks -= cost;
    profile.upgrades[kind] += 1;
    save();
    updateStageUi();
    toast(t("upgradeOk"));
  }

  function seedRand(seed) {
    let value = seed >>> 0;
    return () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function buildEnemies(data) {
    let remaining = data.totalHp;
    return Array.from({ length: data.enemyCount }, (_, index) => {
      const enemiesLeft = data.enemyCount - index;
      const maxHp = index === data.enemyCount - 1 ? remaining : Math.round(remaining / enemiesLeft);
      remaining -= maxHp;
      return {
        id: index,
        name: `${data.boss ? t("guardian") : t("enemy")} ${index + 1}`,
        asset: enemyAssetFor(data.n, index),
        hp: maxHp,
        maxHp,
      };
    });
  }

  function startBattle() {
    const data = stageData(selectedStage);
    const enemies = buildEnemies(data);
    battle = {
      ...data,
      hp: data.playerHp,
      maxPlayerHp: data.playerHp,
      enemies,
      enemyHp: data.totalHp,
      maxHp: data.totalHp,
      shield: 0,
      focus: 1,
      turn: 0,
      held: null,
      reels: ["stone", "rabbit", "lion"],
      busy: false,
      ended: false,
      intent: "strike",
      rage: 0,
      currentPhase: null,
      phaseLog: [],
      spinFrames: [0, 0, 0],
      reelStopLog: [],
      forcedReels: null,
    };
    show("battlePage");
    resetResolutionSteps();
    rollIntent();
    renderBattle();
    if (!profile.tutorial) $("#tutorial").hidden = false;
  }

  function aliveEnemies() {
    return battle?.enemies.filter((enemy) => enemy.hp > 0) || [];
  }

  function syncEnemyTotals() {
    battle.enemyHp = battle.enemies.reduce((sum, enemy) => sum + Math.max(0, enemy.hp), 0);
    battle.maxHp = battle.enemies.reduce((sum, enemy) => sum + enemy.maxHp, 0);
  }

  function rollIntent() {
    const random = seedRand(selectedStage * 7919 + (battle.turn + 1) * 104729)();
    battle.intent = random < 0.38 ? "strike" : random < 0.66 ? "heavy" : random < 0.84 ? "drain" : "rage";
  }

  function intentDamage() {
    const living = Math.max(1, aliveEnemies().length);
    const base = battle.enemyPower + battle.rage + (living - 1) * 3;
    return battle.intent === "heavy" ? Math.round(base * 1.55)
      : battle.intent === "drain" ? Math.round(base * 0.78)
      : battle.intent === "rage" ? Math.round(base * 1.25)
      : base;
  }

  function renderBattle({ reels = true } = {}) {
    if (!battle) return;
    const stats = heroStats();
    $("#chapterName").textContent = chapterName(selectedStage);
    $("#battleStage").textContent = `${t("stage")} ${selectedStage}`;
    renderEnemySquad();
    $("#playerHpFill").style.width = `${Math.max(0, battle.hp / battle.maxPlayerHp * 100)}%`;
    $("#playerHpText").textContent = `${Math.max(0, battle.hp)} / ${battle.maxPlayerHp}`;
    $("#shieldText").textContent = String(battle.shield);
    $("#focusText").textContent = String(battle.focus);
    $("#lionStat").textContent = `${t("attackShort")} ${stats.attack}`;
    $("#turtleStat").textContent = `${t("defenseShort")} ${stats.defense}`;
    $("#rabbitStat").textContent = `2 / 4 / 10%`;
    $("#intentText").textContent = `${t(`intent${battle.intent[0].toUpperCase()}${battle.intent.slice(1)}`)} · ${intentDamage()}`;
    $("#spinBtn").disabled = battle.busy || battle.ended;
    if (reels) renderReels();
  }

  function renderEnemySquad() {
    const squad = $("#enemySquad");
    squad.innerHTML = "";
    battle.enemies.forEach((enemy, index) => {
      const unit = document.createElement("div");
      unit.className = `enemy-unit${enemy.hp <= 0 ? " defeated" : ""}`;
      unit.dataset.enemy = String(index);
      unit.innerHTML = `
        <img src="${ASSET_ROOT}${enemy.asset}" alt="">
        <div class="enemy-name">${enemy.name}</div>
        <div class="hpbar"><i style="width:${Math.max(0, enemy.hp / enemy.maxHp * 100)}%"></i><span>${Math.max(0, enemy.hp)} / ${enemy.maxHp}</span></div>`;
      squad.append(unit);
    });
  }

  function reelCell(symbolId) {
    const symbol = symbols[symbolId];
    return `<span class="reel-cell" data-symbol="${symbolId}"><img src="${ASSET_ROOT}${symbol.img}" alt=""><b>${t(symbol.key)}</b></span>`;
  }

  function renderReels() {
    const reels = $("#reels");
    reels.innerHTML = "";
    battle.reels.forEach((symbolId, index) => {
      const reel = document.createElement("button");
      reel.className = `reel${battle.held === index ? " held" : ""}`;
      reel.dataset.index = String(index);
      reel.innerHTML = `<span class="reel-strip">${reelCell(symbolId)}</span>`;
      reel.setAttribute("aria-label", `${t(symbols[symbolId].key)}${battle.held === index ? `, ${t("hold")}` : ""}`);
      reel.addEventListener("click", () => toggleHold(index));
      reels.append(reel);
    });
  }

  function renderSingleReel(index) {
    const reel = $(`.reel[data-index="${index}"]`);
    if (!reel) return;
    const symbolId = battle.reels[index];
    reel.className = `reel${battle.held === index ? " held" : ""}`;
    reel.innerHTML = `<span class="reel-strip">${reelCell(symbolId)}</span>`;
    reel.setAttribute("aria-label", `${t(symbols[symbolId].key)}${battle.held === index ? `, ${t("hold")}` : ""}`);
  }

  function toggleHold(index) {
    if (!battle || battle.busy || battle.ended) return;
    battle.held = battle.held === index ? null : index;
    renderReels();
  }

  function stagePool() {
    const pool = ["lion", "turtle", "rabbit", "stone", "stone"];
    if (selectedStage > 10) pool.push("stone");
    if (selectedStage > 20) pool.push("lion", "turtle", "rabbit", "stone");
    return pool;
  }

  function chooseSpinTargets() {
    const forced = trialMode && Array.isArray(battle.forcedReels) ? battle.forcedReels : null;
    const random = seedRand(selectedStage * 1000003 + battle.turn * 9176 + profile.upgrades.attack * 17);
    const pool = stagePool();
    return battle.reels.map((current, index) => {
      if (battle.held === index) return current;
      return forced?.[index] && symbols[forced[index]] ? forced[index] : pool[Math.floor(random() * pool.length)];
    });
  }

  async function animateReel(index, target, random) {
    if (battle.held === index) return;
    const reel = $(`.reel[data-index="${index}"]`);
    const strip = reel.querySelector(".reel-strip");
    const cellHeight = reel.clientHeight;
    const length = 11 + index * 3;
    const sequence = Array.from({ length: length - 1 }, () => symbolIds[Math.floor(random() * symbolIds.length)]);
    sequence.push(target);
    strip.innerHTML = sequence.map(reelCell).join("");
    strip.querySelectorAll(".reel-cell").forEach((cell) => { cell.style.height = `${cellHeight}px`; });
    reel.classList.add("spinning");
    battle.spinFrames[index] = sequence.length;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 180 + index * 70 : 1050 + index * 310;
    const animation = strip.animate(
      [{ transform: "translateY(0)" }, { transform: `translateY(-${(sequence.length - 1) * cellHeight}px)` }],
      { duration, easing: "cubic-bezier(.12,.68,.16,1)", fill: "forwards" },
    );
    await animation.finished.catch(() => {});
    battle.reelStopLog.push({ index, at: performance.now() });
    battle.reels[index] = target;
    renderSingleReel(index);
  }

  async function spin() {
    if (!battle || battle.busy || battle.ended) return;
    if (battle.held !== null && battle.focus < 1) {
      toast(t("needFocus"));
      battle.held = null;
      renderReels();
    }
    battle.busy = true;
    battle.currentPhase = "spinning";
    battle.phaseLog = [];
    battle.reelStopLog = [];
    resetResolutionSteps();
    hidePhaseBanner();
    if (battle.held !== null) battle.focus -= 1;
    battle.turn += 1;
    $("#spinBtn").disabled = true;
    $("#comboBanner").textContent = t("reelsSpinning");
    const targets = chooseSpinTargets();
    battle.forcedReels = null;
    const random = seedRand(selectedStage * 55001 + battle.turn * 31337);
    await Promise.all(targets.map((target, index) => animateReel(index, target, random)));
    battle.reels = targets;
    battle.held = null;
    renderReels();
    await resolveSpin();
    if (battle.enemyHp > 0 && battle.hp > 0) await enemyTurn();
    finishTurn();
  }

  function resetResolutionSteps() {
    $$("#resolutionSteps span").forEach((step) => step.classList.remove("active", "done"));
  }

  function activateStep(phase) {
    const order = ["attack", "defense", "healing"];
    order.forEach((name) => {
      const step = $(`#resolutionSteps [data-phase="${name}"]`);
      step.classList.toggle("active", name === phase);
      step.classList.toggle("done", order.indexOf(name) < order.indexOf(phase));
    });
  }

  function setActiveHero(hero) {
    $$(".party-hero").forEach((element) => element.classList.toggle("active", element.dataset.hero === hero));
  }

  function showPhaseBanner(label, math, color) {
    const banner = $("#phaseBanner");
    banner.hidden = false;
    banner.style.setProperty("--phase-color", color);
    $("#phaseLabel").textContent = label;
    $("#phaseMath").textContent = math;
  }

  function hidePhaseBanner() {
    $("#phaseBanner").hidden = true;
    setActiveHero(null);
  }

  function phaseEffect(phase) {
    const effect = document.createElement("span");
    effect.className = `combat-phase-fx ${phase}-phase-fx`;
    $("#fxLayer").append(effect);
    setTimeout(() => effect.remove(), 900);
  }

  async function resolveSpin() {
    const counts = { lion: 0, turtle: 0, rabbit: 0, stone: 0 };
    battle.reels.forEach((symbol) => { counts[symbol] += 1; });
    const stats = heroStats();
    const attackMultiplier = attackMultipliers[counts.lion];
    const attack = Math.round(stats.attack * attackMultiplier);
    const defenseMultiplier = defenseMultipliers[counts.turtle];
    const defense = Math.round(stats.defense * defenseMultiplier);
    const healingPercent = healingPercents[counts.rabbit];
    const healing = Math.round(battle.maxPlayerHp * healingPercent / 100);
    battle.lastResolution = { counts, attackMultiplier, attack, defenseMultiplier, defense, healingPercent, healing };

    await presentAttack(counts.lion, stats.attack, attackMultiplier, attack);
    await presentDefense(counts.turtle, stats.defense, defenseMultiplier, defense);
    await presentHealing(counts.rabbit, healingPercent, healing);

    if (counts.stone > 0) {
      $("#comboBanner").textContent = `${t("stoneSymbol")} ×${counts.stone} · ${t("noEffect")}`;
    } else {
      $("#comboBanner").textContent = "";
    }
    if ((counts.lion === 3 || counts.turtle === 3 || counts.rabbit === 3) && battle.focus < 5) {
      battle.focus += 1;
      floatFx(`${t("focus")} +1`, 50, 68, "#ffe26a");
    }
    $$("#resolutionSteps span").forEach((step) => { step.classList.remove("active"); step.classList.add("done"); });
    hidePhaseBanner();
    battle.currentPhase = null;
    renderBattle({ reels: false });
  }

  async function presentAttack(count, base, multiplier, amount) {
    battle.currentPhase = "attack";
    $("#comboBanner").textContent = t("attackPhase");
    battle.phaseLog.push({ phase: "attack", count, base, multiplier, amount });
    activateStep("attack");
    setActiveHero("lion");
    const math = count ? `${base} × ${formatMultiplier(multiplier)} = ${amount}` : `${t("noLion")} · 0`;
    showPhaseBanner(`${t("attackPhase")} · ${t("lionSymbol")} ×${count}`, math, "#ffd15a");
    if (amount > 0) {
      phaseEffect("attack");
      await wait(280);
      damageEnemies(amount);
    }
    await wait(count ? 680 : 420);
  }

  async function presentDefense(count, base, multiplier, amount) {
    battle.currentPhase = "defense";
    $("#comboBanner").textContent = t("defensePhase");
    battle.phaseLog.push({ phase: "defense", count, base, multiplier, amount });
    activateStep("defense");
    setActiveHero("turtle");
    const math = count ? `${base} × ${formatMultiplier(multiplier)} = +${amount}` : `${t("noTurtle")} · +0`;
    showPhaseBanner(`${t("defensePhase")} · ${t("turtleSymbol")} ×${count}`, math, "#61e2c4");
    if (amount > 0) {
      battle.shield += amount;
      phaseEffect("defense");
      floatFx(`+${amount} ${t("shield")}`, 26, 70, "#6fe9dd");
      renderBattle({ reels: false });
    }
    await wait(count ? 680 : 420);
  }

  async function presentHealing(count, percent, amount) {
    battle.currentPhase = "healing";
    $("#comboBanner").textContent = t("healingPhase");
    const actual = Math.min(amount, battle.maxPlayerHp - battle.hp);
    battle.phaseLog.push({ phase: "healing", count, percent, amount, actual });
    activateStep("healing");
    setActiveHero("rabbit");
    const math = count ? `${percent}% × ${battle.maxPlayerHp} = +${actual}` : `${t("noRabbit")} · +0`;
    showPhaseBanner(`${t("healingPhase")} · ${t("rabbitSymbol")} ×${count}`, math, "#65ef9d");
    if (amount > 0) {
      battle.hp += actual;
      phaseEffect("healing");
      floatFx(`+${actual} HP`, 26, 68, "#65ef9d");
      renderBattle({ reels: false });
    }
    await wait(count ? 720 : 420);
  }

  function formatMultiplier(value) {
    return value.toFixed(1);
  }

  function damageEnemies(totalDamage) {
    let remaining = totalDamage;
    const hitIndexes = [];
    for (let index = 0; index < battle.enemies.length && remaining > 0; index += 1) {
      const enemy = battle.enemies[index];
      if (enemy.hp <= 0) continue;
      const damage = Math.min(enemy.hp, remaining);
      enemy.hp -= damage;
      remaining -= damage;
      hitIndexes.push({ index, damage });
    }
    syncEnemyTotals();
    renderBattle({ reels: false });
    hitIndexes.forEach(({ index, damage }, order) => {
      setTimeout(() => {
        const unit = $(`.enemy-unit[data-enemy="${index}"]`);
        unit?.classList.add("enemy-hit");
        setTimeout(() => unit?.classList.remove("enemy-hit"), 350);
        floatFx(`-${damage}`, 43 + index * 10, 28, "#ffd15a");
      }, order * 100);
    });
  }

  async function enemyTurn() {
    await wait(300);
    battle.currentPhase = "enemy";
    let damage = intentDamage();
    showPhaseBanner(t("enemyPhase"), `${t(`intent${battle.intent[0].toUpperCase()}${battle.intent.slice(1)}`)} · ${damage}`, "#ff6787");
    if (battle.intent === "drain") {
      const healing = Math.round(damage * 0.65);
      const target = aliveEnemies()[0];
      if (target) target.hp = Math.min(target.maxHp, target.hp + healing);
      syncEnemyTotals();
    }
    await wait(360);
    const blocked = Math.min(battle.shield, damage);
    battle.shield -= blocked;
    damage -= blocked;
    battle.hp = Math.max(0, battle.hp - damage);
    stablePlayerHit(damage, blocked);
    renderBattle({ reels: false });
    await wait(620);
    hidePhaseBanner();
    battle.currentPhase = null;
  }

  function stablePlayerHit(damage, blocked) {
    const party = $("#playerParty");
    party.classList.add("party-hit");
    setTimeout(() => party.classList.remove("party-hit"), 320);
    const vignette = document.createElement("span");
    vignette.className = "damage-vignette";
    $("#fxLayer").append(vignette);
    setTimeout(() => vignette.remove(), 450);
    floatFx(damage ? `-${damage}` : t("block"), 23, 67, damage ? "#ff668a" : "#7fe9ff");
    if (blocked > 0) floatFx(`${t("shield")} -${blocked}`, 33, 72, "#6fe9dd");
  }

  function finishTurn() {
    battle.busy = false;
    if (battle.enemyHp <= 0) return endBattle(true);
    if (battle.hp <= 0) return endBattle(false);
    rollIntent();
    renderBattle();
  }

  function endBattle(win) {
    battle.ended = true;
    battle.currentPhase = "result";
    $("#result").hidden = false;
    $("#resultKicker").textContent = win ? "★★★" : "◇";
    $("#resultTitle").textContent = t(win ? "win" : "lose");
    $("#resultBody").textContent = t(win ? "winBody" : "loseBody");
    const reward = win ? battle.reward : Math.max(2, Math.floor(battle.reward * 0.25));
    $("#rewardValue").textContent = `+${reward}`;
    profile.sparks += reward;
    if (win) {
      const stars = battle.hp / battle.maxPlayerHp > 0.7 ? 3 : battle.hp / battle.maxPlayerHp > 0.35 ? 2 : 1;
      profile.best[selectedStage - 1] = Math.max(profile.best[selectedStage - 1] || 0, stars);
      if (selectedStage === profile.unlocked && profile.unlocked < 30) profile.unlocked += 1;
    }
    save();
    $("#nextBtn").hidden = !win || selectedStage >= 30;
    $("#retryBtn").hidden = win;
    renderBattle({ reels: false });
  }

  function floatFx(text, x, y, color) {
    const element = document.createElement("span");
    element.className = "float-fx";
    element.textContent = text;
    element.style.left = `${x}%`;
    element.style.top = `${y}%`;
    element.style.color = color;
    $("#fxLayer").append(element);
    setTimeout(() => element.remove(), 950);
  }

  function toast(text) {
    $("#comboBanner").textContent = text;
    setTimeout(() => {
      if ($("#comboBanner").textContent === text) $("#comboBanner").textContent = "";
    }, 1400);
  }

  function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  function leaveToStages() {
    $("#pauseModal").hidden = true;
    $("#result").hidden = true;
    battle = null;
    show("stagePage");
    renderStages();
  }

  function bind() {
    initLocales();
    syncLiveViewport();
    addEventListener("resize", syncLiveViewport, { passive: true });
    window.visualViewport?.addEventListener("resize", syncLiveViewport, { passive: true });
    $("#runeStartBtn").onclick = () => { show("stagePage"); renderStages(); };
    $("#stageBack").onclick = () => show("mainPage");
    $("#helpBtn").onclick = () => { $("#tutorial").hidden = false; };
    $("#stageRail").addEventListener("scroll", settleRail, { passive: true });
    $("#enterBattle").onclick = startBattle;
    $$(".upgrade").forEach((button) => { button.onclick = () => upgrade(button.dataset.upgrade); });
    $("#battleBack").onclick = () => { if (!battle?.busy) $("#pauseModal").hidden = false; };
    $("#pauseBtn").onclick = () => { if (!battle?.busy) $("#pauseModal").hidden = false; };
    $("#resumeBtn").onclick = () => { $("#pauseModal").hidden = true; };
    $("#leaveBtn").onclick = leaveToStages;
    $("#spinBtn").onclick = spin;
    $("#tutorialClose").onclick = () => { profile.tutorial = true; save(); $("#tutorial").hidden = true; };
    $("#resultStages").onclick = leaveToStages;
    $("#retryBtn").onclick = startBattle;
    $("#nextBtn").onclick = () => {
      selectedStage = Math.min(30, selectedStage + 1);
      $("#result").hidden = true;
      startBattle();
    };
    document.addEventListener("keydown", (event) => {
      if ($("#battlePage").hidden || battle?.busy) return;
      if (event.code === "Space") { event.preventDefault(); spin(); }
      if (["Digit1", "Digit2", "Digit3"].includes(event.code)) toggleHold(Number(event.code.slice(-1)) - 1);
    });
  }

  async function preload() {
    const urls = [
      "../../assets/animal-rune-reels/cover.webp",
      "../../assets/animal-rune-reels/arena.webp",
      "../../assets/weightplay-logo.png",
      ...Object.values(symbols).map((symbol) => ASSET_ROOT + symbol.img),
      ...enemyAssets.map((asset) => ASSET_ROOT + asset),
    ];
    let completed = 0;
    await Promise.all(urls.map((src) => new Promise((resolve) => {
      const image = new Image();
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        $("#loadFill").style.width = `${++completed / urls.length * 100}%`;
        resolve();
      };
      image.onload = finish;
      image.onerror = finish;
      image.src = src;
      setTimeout(finish, 5000);
    })));
    await wait(180);
  }

  if (trialMode) {
    window.__RUNE_REELS_TEST__ = {
      state: () => battle ? JSON.parse(JSON.stringify(battle)) : null,
      forceReels: (reels) => { if (battle) battle.forcedReels = reels; },
      setHealth: (hp) => {
        if (!battle) return;
        battle.hp = Math.max(1, Math.min(battle.maxPlayerHp, hp));
        renderBattle({ reels: false });
      },
      setEnemyHealth: (hp) => {
        if (!battle) return;
        battle.enemies.forEach((enemy, index) => { enemy.hp = index === 0 ? Math.max(1, Math.min(enemy.maxHp, hp)) : 0; });
        syncEnemyTotals();
        renderBattle({ reels: false });
      },
      setStage: (stage) => {
        selectedStage = clampInt(stage, 1, 30, 1);
        clearTimeout(centerTimer);
        if (!$("#stagePage").hidden) centerStage(selectedStage, false);
      },
      unlockAll: () => { profile.unlocked = 30; save(); renderStages(); },
    };
  }

  bind();
  applyLocale();
  preload().then(() => {
    $("#loading").remove();
    $("#app").hidden = false;
    show("mainPage");
  });
})();
