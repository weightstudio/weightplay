(function () {
  "use strict";
  const pack = window.AnimalDiceBastionLocales;
  const $ = (id) => document.getElementById(id);
  const routeLocale = location.pathname.split("/").filter(Boolean)[0] || "";
  const canonicalLocale = (value) => {
    const raw = String(value || "").toLowerCase();
    if (raw === "zh-tw" || raw.includes("hant")) return "zh-Hant";
    if (raw === "zh-cn" || raw.includes("hans")) return "zh-Hans";
    if (raw.startsWith("pt")) return "pt-BR";
    return pack.codes.find((code) => code.toLowerCase() === raw) || "en";
  };
  const memory = {};
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return memory[key] ?? null; } },
    set(key, value) { memory[key] = String(value); try { localStorage.setItem(key, String(value)); } catch {} }
  };
  let locale = canonicalLocale(routeLocale || window.WonderI18n?.actualLocale?.() || storage.get("wonderLocale") || navigator.language);
  const t = (key, vars = {}) => String(pack.dictionaries[locale]?.[key] ?? pack.dictionaries.en[key] ?? key)
    .replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`);

  const SAVE_KEY = "weightplay-animal-dice-bastion-v1";
  const normalizeSave = (source = {}) => {
    const stars = {};
    if (source.stars && typeof source.stars === "object") {
      for (const [key, value] of Object.entries(source.stars)) {
        const stage = Math.trunc(Number(key)), score = Math.max(0, Math.min(3, Math.trunc(Number(value))));
        if (stage >= 1 && stage <= 30 && score) stars[stage] = score;
      }
    }
    return {
      unlocked: Math.max(1, Math.min(30, Math.trunc(Number(source.unlocked)) || 1)),
      stars,
      dust: Math.max(0, Math.min(99999, Math.trunc(Number(source.dust)) || 0)),
      upgrades: {
        focus: Math.max(0, Math.min(5, Math.trunc(Number(source.upgrades?.focus)) || 0)),
        heart: Math.max(0, Math.min(5, Math.trunc(Number(source.upgrades?.heart)) || 0)),
        charge: Math.max(0, Math.min(5, Math.trunc(Number(source.upgrades?.charge)) || 0))
      },
      tutorialSeen: Boolean(source.tutorialSeen)
    };
  };
  let save;
  try { save = normalizeSave(JSON.parse(storage.get(SAVE_KEY) || "{}")); } catch { save = normalizeSave(); }
  const persist = () => storage.set(SAVE_KEY, JSON.stringify(save));

  const chapters = ["chapter1","chapter2","chapter3","chapter4","chapter5","chapter6"];
  const chapterRules = ["rule1","rule2","rule3","rule4","rule5","rule6"];
  const stages = Array.from({length:30}, (_, index) => {
    const n = index + 1, chapter = Math.floor(index / 5), step = index % 5, boss = step === 4;
    const waves = 5 + chapter + Math.floor(step / 2);
    const threat = boss ? "threatBoss" : chapter === 0 ? "threatBasic" : chapter === 1 ? (step % 2 ? "threatHaste" : "threatArmor") :
      chapter === 2 ? (step % 2 ? "threatHeal" : "threatSwarm") : chapter === 3 ? (step % 2 ? "threatLock" : "threatHaste") : "threatChampion";
    const plan = threat === "threatArmor" ? "planForge" : threat === "threatSwarm" || threat === "threatHeal" ? "planTide" : boss || chapter >= 4 ? "planBurst" : "planPairs";
    return {n, chapter, step, boss, waves, threat, plan, reward:5 + chapter * 2 + step, enemyHp:16 + n * 2.6, speed:.033 + chapter * .0024 + step * .0008};
  });

  const guardianTypes = [
    {id:"grove", image:"../../assets/animal-dice-bastion/guardian-grove.webp", power:1.12, rate:1.0, color:"#65e3a5"},
    {id:"spark", image:"../../assets/animal-dice-bastion/guardian-spark.webp", power:.62, rate:1.75, color:"#c084fc"},
    {id:"moon", image:"../../assets/animal-dice-bastion/guardian-moon.webp", power:.86, rate:.78, slow:.28, color:"#67e8f9"},
    {id:"forge", image:"../../assets/animal-dice-bastion/guardian-forge.webp", power:1.02, rate:.86, armorBreak:.45, color:"#f59e0b"},
    {id:"tide", image:"../../assets/animal-dice-bastion/guardian-tide.webp", power:.74, rate:1.02, splash:.45, color:"#60a5fa"}
  ];
  const guardianMap = Object.fromEntries(guardianTypes.map((item) => [item.id, item]));
  const enemyImages = {
    normal:"../../assets/animal-dice-bastion/enemy-wisp.webp",
    fast:"../../assets/animal-dice-bastion/enemy-wisp.webp",
    armor:"../../assets/animal-dice-bastion/enemy-beetle.webp",
    healer:"../../assets/animal-dice-bastion/enemy-healer.webp",
    boss0:"../../assets/animal-dice-bastion/boss-briarhorn-ram.webp",
    boss1:"../../assets/animal-dice-bastion/boss-moonwing-owl.webp",
    boss2:"../../assets/animal-dice-bastion/boss-deeptide-crocodile.webp",
    boss3:"../../assets/animal-dice-bastion/boss-forge-colossus.webp",
    boss4:"../../assets/animal-dice-bastion/boss-astral-lion.webp",
    boss5:"../../assets/animal-dice-bastion/boss-rift-stag.webp"
  };
  const loadedImages = {};
  Object.entries(enemyImages).forEach(([key, src]) => { const image = new Image(); image.src = src; loadedImages[key] = image; });

  let screen = "loading", run = null, raf = 0, lastTime = 0, currentStageIndex = 0;
  let windowFocused = document.hasFocus(), lifecyclePaused = false, resultCommitted = false, modalReturnFocus = null;
  let stagePanel = "stages";

  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    $("localeSelect").value = locale;
    $("mainReturn").href = `/${pack.segments[locale]}/`;
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.i18nAria)));
    document.querySelectorAll("[data-i18n-alt]").forEach((node) => node.setAttribute("alt", t(node.dataset.i18nAlt)));
    document.title = `${t("title")} | WeightPlay Internal Trial`;
    renderMainProgress();
    if (screen === "stage") renderStage();
    if (run) updateBattleHud(true);
  }
  function renderMainProgress() {
    const total = Object.values(save.stars).reduce((sum, value) => sum + value, 0);
    $("mainProgress").textContent = t("stageSummary", {unlocked:save.unlocked, stars:total});
  }
  function showScreen(name) {
    screen = name;
    document.body.dataset.screen = name;
    $("mainGroup").hidden = name !== "main";
    $("stageScreen").hidden = name !== "stage";
    $("battleScreen").hidden = name !== "battle";
    if (name !== "battle") stopLoop();
    if (name === "main") requestAnimationFrame(() => $("startBtn").focus({preventScroll:true}));
    if (name === "stage") {
      renderStage();
      setStagePanel("stages", false);
      requestAnimationFrame(() => centerStage(Math.min(save.unlocked - 1, 29)));
    }
  }

  function stageThreat(stage) { return t(stage.threat); }
  function renderStage() {
    const total = Object.values(save.stars).reduce((sum, value) => sum + value, 0);
    $("stageSummary").textContent = t("stageSummary", {unlocked:save.unlocked, stars:total});
    $("chapterKicker").textContent = `${t("stage", {stage:Math.min(save.unlocked, 30)})} · ${Math.floor((Math.min(save.unlocked, 30)-1)/5)+1}/6`;
    $("chapterTitle").textContent = t(chapters[Math.floor((Math.min(save.unlocked, 30)-1)/5)]);
    $("chapterRule").textContent = t(chapterRules[Math.floor((Math.min(save.unlocked, 30)-1)/5)]);
    $("stageRail").replaceChildren(...stages.map((stage, index) => {
      const button = document.createElement("button"), locked = stage.n > save.unlocked;
      button.type = "button";
      button.className = `stage-card${locked ? " locked" : ""}`;
      button.dataset.index = String(index);
      button.setAttribute("aria-disabled", String(locked));
      button.innerHTML = `<span>${stage.boss ? `${t("boss")} · ` : ""}${t(chapters[stage.chapter])}</span><strong>${stage.n}</strong><dl><div><dt>${t("threat")}</dt><dd>${stageThreat(stage)}</dd></div><div><dt>${t("plan")}</dt><dd>${t(stage.plan)}</dd></div><div><dt>${t("reward")}</dt><dd>${t("rewardDust",{dust:stage.reward})}</dd></div></dl><small>${locked ? t("locked") : `${"★".repeat(save.stars[stage.n]||0)}${"☆".repeat(3-(save.stars[stage.n]||0))}`}</small>`;
      button.addEventListener("click", () => locked ? announce(t("locked")) : startBattle(index));
      return button;
    }));
    renderWorkshop();
  }
  function markCentered(index) {
    [...$("stageRail").children].forEach((card, i) => card.setAttribute("aria-current", String(i === index)));
    currentStageIndex = index;
  }
  function centerStage(index) {
    const card = $("stageRail").querySelector(`[data-index="${index}"]`);
    card?.scrollIntoView({behavior:"auto", inline:"center", block:"nearest"});
    markCentered(index);
  }
  $("stageRail").addEventListener("wonder:stage-snap", (event) => markCentered(Number(event.detail?.index) || 0));

  function setStagePanel(panel, focus = true) {
    stagePanel = panel;
    $("stageRail").hidden = panel !== "stages";
    $("teamPanel").hidden = panel !== "team";
    $("equipmentPanel").hidden = panel !== "equipment";
    [["team",$("teamTab")],["stages",$("stagesTab")],["equipment",$("equipmentTab")]].forEach(([name, button]) => {
      const active = name === panel;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    if (focus) $(`${panel}Tab`).focus();
  }
  const tabs = [$("teamTab"),$("stagesTab"),$("equipmentTab")];
  tabs.forEach((button, index) => {
    button.addEventListener("click", () => setStagePanel(button.dataset.panel, false));
    button.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      setStagePanel(tabs[next].dataset.panel);
    });
  });

  const upgrades = [
    {id:"focus", name:"upgradeFocus", text:"upgradeFocusText"},
    {id:"heart", name:"upgradeHeart", text:"upgradeHeartText"},
    {id:"charge", name:"upgradeCharge", text:"upgradeChargeText"}
  ];
  function renderWorkshop() {
    $("dustValue").textContent = `${t("dust")} · ${save.dust}`;
    $("upgradeList").replaceChildren(...upgrades.map((upgrade) => {
      const level = save.upgrades[upgrade.id], cost = 8 + level * 7, card = document.createElement("article");
      card.className = "upgrade-card";
      card.innerHTML = `<strong>${t(upgrade.name)} · ${t("level")} ${level}/5</strong><p>${t(upgrade.text)}</p><button type="button" ${level >= 5 ? "disabled" : ""}>${level >= 5 ? t("max") : t("buy",{cost})}</button>`;
      card.querySelector("button").addEventListener("click", () => buyUpgrade(upgrade, cost));
      return card;
    }));
  }
  function buyUpgrade(upgrade, cost) {
    if (save.dust < cost) { $("upgradeFeedback").textContent = t("needDust",{cost}); return; }
    if (save.upgrades[upgrade.id] >= 5) return;
    save.dust -= cost; save.upgrades[upgrade.id] += 1; persist();
    $("upgradeFeedback").textContent = t("upgraded",{name:t(upgrade.name),level:save.upgrades[upgrade.id]});
    renderWorkshop(); window.WonderSound?.play?.("collect");
  }

  function seeded(seed) {
    let value = seed >>> 0;
    return () => { value += 0x6D2B79F5; let n = value; n = Math.imul(n ^ n >>> 15, n | 1); n ^= n + Math.imul(n ^ n >>> 7, n | 61); return ((n ^ n >>> 14) >>> 0) / 4294967296; };
  }
  function createWavePlan(stage) {
    const random = seeded(stage.n * 9137), plan = [];
    for (let wave = 1; wave <= stage.waves; wave += 1) {
      const count = 4 + stage.chapter + Math.floor(wave * .72) + (stage.threat === "threatSwarm" ? 3 : 0);
      const enemies = [];
      for (let i = 0; i < count; i += 1) {
        const roll = random();
        let kind = stage.chapter >= 2 && roll < .12 ? "healer" : stage.chapter >= 1 && roll < .3 ? "armor" : stage.chapter >= 1 && roll < .48 ? "fast" : "normal";
        const hp = stage.enemyHp * (1 + wave * .11) * (kind === "armor" ? 1.65 : kind === "fast" ? .72 : kind === "healer" ? .9 : 1);
        enemies.push({
          kind, hp, maxHp:hp, armor:kind === "armor" ? .42 : 0,
          speed:stage.speed * (kind === "fast" ? 1.65 : kind === "armor" ? .72 : kind === "healer" ? .82 : 1),
          x:-.08-i*.09, hit:false, slow:0, healClock:kind === "healer" ? 2.4 : 0
        });
      }
      if (stage.boss && wave === stage.waves) {
        const hp = stage.enemyHp * (9 + stage.chapter * 2.2);
        enemies.push({kind:`boss${stage.chapter}`, hp, maxHp:hp, armor:.22 + stage.chapter*.02, speed:stage.speed*.45, x:-.32, hit:false, slow:0, boss:true});
      }
      plan.push(enemies);
    }
    return plan;
  }
  function startBattle(index) {
    const stageIndex = Math.max(0, Math.min(29, Math.trunc(index))), stage = stages[stageIndex];
    currentStageIndex = stageIndex;
    const maxCore = 6 + save.upgrades.heart, random = seeded(Date.now() ^ stage.n * 1999);
    run = {
      stage, stageIndex, random, board:Array(15).fill(null), selected:-1, cursor:0, charge:42 + save.upgrades.charge * 8,
      summonCost:10, drought:0, core:maxCore, maxCore, wave:0, plan:createWavePlan(stage), enemies:[], spawnQueue:[],
      spawnClock:0, between:1.3, attackClock:0, burst:0, rally:0, rallyCooldown:0, rerolls:0, merges:0,
      damage:0, finished:false, paused:false, time:0
    };
    resultCommitted = false;
    $("tutorialPanel").hidden = true; $("leavePanel").hidden = true; $("pausePanel").hidden = true; $("resultPanel").hidden = true;
    $("battleLive").hidden = false; $("battleLive").inert = false;
    showScreen("battle"); renderBoard(); updateBattleHud(true); announce(t("objective"));
    lifecyclePaused = !windowFocused || document.hidden; run.paused = lifecyclePaused;
    lastTime = performance.now(); stopLoop(); if (!run.paused) raf = requestAnimationFrame(frame);
    window.WonderSound?.play?.("start");
    if (!save.tutorialSeen) requestAnimationFrame(() => openModal($("tutorialPanel"), $("tutorialStartBtn")));
    else $("board").focus({preventScroll:true});
  }

  function hasMergePair(board = run.board) {
    const seen = new Set();
    for (const unit of board) if (unit && unit.rank < 6) {
      const key = `${unit.type}:${unit.rank}`; if (seen.has(key)) return true; seen.add(key);
    }
    return false;
  }
  function matchingType() {
    const counts = {};
    for (const unit of run.board) if (unit && unit.rank < 6) counts[unit.type] = (counts[unit.type] || 0) + 1;
    return Object.entries(counts).sort((a,b) => b[1]-a[1])[0]?.[0] || guardianTypes[Math.floor(run.random()*guardianTypes.length)].id;
  }
  function randomType(forceMatch = false) {
    return forceMatch ? matchingType() : guardianTypes[Math.floor(run.random() * guardianTypes.length)].id;
  }
  function summon() {
    if (!run || run.finished || activeModal()) return;
    const slot = run.board.findIndex((unit) => !unit);
    if (slot < 0) { announce(t("boardFull")); return; }
    if (run.charge < run.summonCost) { announce(t("notEnoughCharge",{cost:run.summonCost})); return; }
    run.charge -= run.summonCost; run.summonCost = Math.min(38, run.summonCost + 2);
    const forceMatch = run.drought >= 6 && !hasMergePair(), type = randomType(forceMatch);
    run.board[slot] = {type, rank:1, cooldown:run.random()*.4}; run.drought = hasMergePair() ? 0 : run.drought + 1;
    run.cursor = slot; renderBoard(); updateBattleHud(true);
    announce(forceMatch ? t("droughtGift",{guardian:t(type)}) : t("summoned",{guardian:t(type)}));
    window.WonderSound?.play?.("collect");
  }
  function selectOrMerge(index) {
    if (!run || !run.board[index]) { run.selected = -1; renderBoard(); return; }
    if (run.selected < 0) { run.selected = index; announce(t("mergeSelect",{guardian:t(run.board[index].type),rank:run.board[index].rank})); renderBoard(); return; }
    if (run.selected === index) { run.selected = -1; renderBoard(); return; }
    const from = run.board[run.selected], to = run.board[index];
    if (!from || !to || from.type !== to.type || from.rank !== to.rank) { run.selected = index; announce(t("mergeNeedMatch")); renderBoard(); return; }
    if (to.rank >= 6) { announce(t("maxRank")); return; }
    const rank = to.rank + 1, type = randomType(false);
    run.board[run.selected] = null; run.board[index] = {type, rank, cooldown:.1}; run.selected = -1; run.cursor = index; run.merges += 1; run.drought = 0;
    renderBoard(); announce(t("merged",{rank,guardian:t(type)})); window.WonderSound?.play?.("correct");
  }
  function reroll() {
    if (!run || activeModal()) return;
    const cost = 12, index = run.selected >= 0 ? run.selected : run.cursor;
    if (!run.board[index] || run.charge < cost) { announce(t("rerollNeed",{cost})); return; }
    run.charge -= cost; run.rerolls += 1; run.board[index].type = randomType(false); run.board[index].cooldown = .1;
    run.selected = -1; renderBoard(); updateBattleHud(true); announce(t("rerolled",{guardian:t(run.board[index].type)}));
  }
  function rally() {
    if (!run || activeModal()) return;
    if (run.rallyCooldown > 0) { announce(t("rallyNotReady")); return; }
    run.rally = 6; run.rallyCooldown = 18; announce(t("rallyUsed")); window.WonderSound?.play?.("power");
  }
  function burst() {
    if (!run || activeModal()) return;
    if (run.burst < 100) { announce(t("burstNotReady")); return; }
    run.burst = 0;
    const targets = run.enemies.filter((enemy) => !enemy.hit).sort((a,b) => b.x-a.x).slice(0,5);
    targets.forEach((enemy) => { const damage = 28 + run.stage.n * 2.2; enemy.hp -= damage; enemy.slow = Math.max(enemy.slow, 2.5); run.damage += damage; });
    announce(t("burstUsed")); window.WonderSound?.play?.("power");
  }
  function renderBoard() {
    if (!run) return;
    $("board").replaceChildren(...run.board.map((unit, index) => {
      const slot = document.createElement("button");
      slot.type = "button"; slot.className = `rune-slot${run.selected === index ? " selected" : ""}`;
      slot.dataset.index = String(index); slot.setAttribute("role","gridcell"); slot.tabIndex = -1;
      slot.setAttribute("aria-label", unit ? `${t(unit.type)} · ${t("level")} ${unit.rank}` : `${t("summon")} ${index+1}`);
      if (unit) {
        const type = guardianMap[unit.type];
        slot.innerHTML = `<span class="guardian ${unit.type}"><img src="${type.image}" alt=""><b>${"◆".repeat(unit.rank)}</b></span>`;
      }
      slot.addEventListener("click", () => { run.cursor = index; selectOrMerge(index); $("board").focus({preventScroll:true}); });
      return slot;
    }));
  }

  function startNextWave() {
    if (!run || run.wave >= run.plan.length) return;
    run.wave += 1; run.spawnQueue = run.plan[run.wave - 1].map((enemy) => ({...enemy})); run.spawnClock = 0; run.between = 0;
    announce(t("waveStarts",{wave:run.wave}));
    if (run.stage.boss && run.wave === run.stage.waves) {
      $("bossWarning").hidden = false; $("bossWarning").textContent = t("bossWarning");
      setTimeout(() => { if ($("bossWarning")) $("bossWarning").hidden = true; }, 1800);
    }
  }
  function updateSimulation(dt) {
    if (!run || run.paused || run.finished) return;
    const hadEnemies = run.enemies.length > 0;
    run.time += dt; run.rally = Math.max(0, run.rally-dt); run.rallyCooldown = Math.max(0, run.rallyCooldown-dt);
    if (!run.spawnQueue.length && !run.enemies.length) {
      run.between -= dt;
      if (run.between <= 0) {
        if (run.wave >= run.plan.length) return finish(true);
        startNextWave();
      }
    }
    if (run.spawnQueue.length) {
      run.spawnClock -= dt;
      if (run.spawnClock <= 0) { run.enemies.push(run.spawnQueue.shift()); run.spawnClock = .62; }
    }
    for (const enemy of run.enemies) {
      enemy.slow = Math.max(0, enemy.slow-dt);
      enemy.x += enemy.speed * dt * (enemy.slow > 0 ? .62 : 1);
      if (enemy.kind === "healer") {
        enemy.healClock -= dt;
        if (enemy.healClock <= 0) {
          run.enemies.filter((ally) => ally !== enemy && Math.abs(ally.x-enemy.x) < .14).forEach((ally) => {
            ally.hp = Math.min(ally.maxHp, ally.hp + ally.maxHp * .08);
          });
          enemy.healClock = 2.4;
        }
      }
      if (enemy.x >= 1.02) { enemy.hit = true; run.core -= enemy.boss ? 3 : 1; announce(t("coreHit",{core:Math.max(0,run.core)})); window.WonderSound?.play?.("wrong"); }
    }
    run.enemies = run.enemies.filter((enemy) => !enemy.hit && enemy.hp > 0);
    if (hadEnemies && !run.enemies.length && !run.spawnQueue.length) run.between = 1.6;
    if (run.core <= 0) return finish(false);
    const attackSpeed = run.rally > 0 ? 1.72 : 1;
    for (const unit of run.board) if (unit) {
      const type = guardianMap[unit.type];
      unit.cooldown -= dt * attackSpeed;
      if (unit.cooldown > 0 || !run.enemies.length) continue;
      const target = [...run.enemies].sort((a,b) => b.x-a.x)[0];
      const rankPower = Math.pow(1.82, unit.rank-1), base = (3.2 + save.upgrades.focus*.13) * type.power * rankPower;
      const armor = Math.max(0, target.armor - (type.armorBreak || 0));
      const damage = base * (1-armor); target.hp -= damage; run.damage += damage;
      if (type.slow) target.slow = Math.max(target.slow, 1.1 + unit.rank*.12);
      if (type.splash) run.enemies.filter((enemy) => enemy !== target && Math.abs(enemy.x-target.x)<.08).forEach((enemy) => { enemy.hp -= damage*type.splash; });
      run.charge = Math.min(100, run.charge + .48 + unit.rank*.08); run.burst = Math.min(100, run.burst + .72 + unit.rank*.12);
      unit.cooldown = 1 / type.rate;
    }
    updateBattleHud();
  }
  function updateBattleHud(force = false) {
    if (!run) return;
    $("stageLabel").textContent = `${t("stage",{stage:run.stage.n})} · ${t(chapters[run.stage.chapter])}`;
    $("objectiveText").textContent = t("objective");
    $("coreValue").textContent = `${Math.max(0,run.core)}/${run.maxCore}`;
    $("waveValue").textContent = `${Math.max(1,run.wave)}/${run.stage.waves}`;
    $("chargeValue").textContent = Math.floor(run.charge);
    $("chargeFill").style.width = `${Math.min(100,run.charge)}%`;
    $("summonCost").textContent = String(run.summonCost);
    $("rallyState").textContent = run.rally > 0 ? t("cooldown",{seconds:run.rally.toFixed(1)}) : run.rallyCooldown > 0 ? t("cooldown",{seconds:Math.ceil(run.rallyCooldown)}) : t("ready");
    $("burstState").textContent = `${Math.floor(run.burst)}%`;
    $("rerollState").textContent = t("cost",{cost:12});
    $("summonBtn").disabled = run.charge < run.summonCost || !run.board.some((unit) => !unit);
    $("rallyBtn").disabled = run.rallyCooldown > 0;
    $("burstBtn").disabled = run.burst < 100;
    if (force) drawRoad();
  }
  function drawRoad() {
    const canvas = $("roadCanvas"), ctx = canvas.getContext("2d"), rect = canvas.getBoundingClientRect();
    const width = Math.max(1,Math.round(rect.width*devicePixelRatio)), height = Math.max(1,Math.round(rect.height*devicePixelRatio));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    const w=canvas.width,h=canvas.height,d=devicePixelRatio;
    ctx.clearRect(0,0,w,h);
    if (!run) return;
    for (const enemy of run.enemies) {
      const progress=Math.max(0,Math.min(1,enemy.x));
      const x=progress*w,y=h*(.72-.12*Math.sin(progress*Math.PI));
      const image=loadedImages[enemy.kind],size=(enemy.boss?72:42)*d;
      if(image?.complete)ctx.drawImage(image,x-size/2,y-size*.8,size,size);
      else{ctx.fillStyle=enemy.boss?"#8b5cf6":"#3b1b55";ctx.beginPath();ctx.arc(x,y,size*.35,0,Math.PI*2);ctx.fill()}
      ctx.fillStyle="#210d1a";ctx.fillRect(x-size*.42,y+size*.1,size*.84,5*d);ctx.fillStyle=enemy.boss?"#ff718d":"#65e3a5";ctx.fillRect(x-size*.42,y+size*.1,size*.84*Math.max(0,enemy.hp/enemy.maxHp),5*d);
    }
  }
  function frame(now) {
    raf = 0;
    if (!run || run.paused || run.finished || screen !== "battle") return;
    const dt = Math.min(.05, Math.max(0,(now-lastTime)/1000)); lastTime=now;
    updateSimulation(dt); drawRoad(); raf=requestAnimationFrame(frame);
  }
  function stopLoop() { if (raf) cancelAnimationFrame(raf); raf=0; }
  function resumeLoop() { if (!run || run.finished || run.paused || raf || document.hidden || !windowFocused) return; lastTime=performance.now(); raf=requestAnimationFrame(frame); }

  function finish(won) {
    if (!run || run.finished) return;
    run.finished=true;run.paused=true;stopLoop();
    const stars = won ? 1 + (run.core >= Math.ceil(run.maxCore/2) ? 1 : 0) + (run.rerolls===0 ? 1 : 0) : 0;
    const earned = won ? run.stage.reward + stars : 0;
    if (won) {
      save.stars[run.stage.n] = Math.max(save.stars[run.stage.n]||0,stars);
      save.unlocked = Math.max(save.unlocked,Math.min(30,run.stage.n+1));
      save.dust = Math.min(99999,save.dust+earned);persist();
    }
    $("resultTitle").textContent=t(won?"victory":"defeat");$("resultText").textContent=t(won?"victoryText":"defeatText");
    $("resultStars").textContent=`${"★".repeat(stars)}${"☆".repeat(3-stars)}`;
    $("resultStats").innerHTML=`<span><small>${t("coreLeft")}</small><strong>${Math.max(0,run.core)}/${run.maxCore}</strong></span><span><small>${t("merges")}</small><strong>${run.merges}</strong></span><span><small>${t("dustEarned")}</small><strong>+${earned}</strong></span>`;
    const canNext=won&&run.stage.n<30;[$("resultStagesBtn"),$("nextBtn"),$("retryBtn")].forEach((button)=>{button.disabled=false;button.classList.remove("primary-action")});
    $("nextBtn").disabled=!canNext;const primary=canNext?$("nextBtn"):$("resultStagesBtn");primary.classList.add("primary-action");
    $("battleLive").hidden=true;$("battleLive").inert=true;$("resultPanel").hidden=false;
    const focusPrimary=()=>{if(!$("resultPanel").hidden&&primary.isConnected)primary.focus({preventScroll:true})};
    requestAnimationFrame(focusPrimary);setTimeout(focusPrimary,80);window.WonderSound?.play?.(won?"win":"wrong");
  }
  function commitResult(action) {
    if (resultCommitted || $("resultPanel").hidden) return;
    resultCommitted=true;[$("resultStagesBtn"),$("nextBtn"),$("retryBtn")].forEach((button)=>button.disabled=true);action();
  }

  function activeModal() { return [$("tutorialPanel"),$("leavePanel"),$("pausePanel"),$("resultPanel")].find((modal)=>!modal.hidden) || null; }
  function openModal(modal, focusTarget) {
    modalReturnFocus=document.activeElement;if(run)run.paused=true;stopLoop();modal.hidden=false;$("battleLive").inert=true;
    requestAnimationFrame(()=>focusTarget?.focus());
  }
  function closeModal(modal, restore=true) {
    modal.hidden=true;$("battleLive").inert=false;
    if(run&&!run.finished&&!lifecyclePaused&&!document.hidden&&windowFocused){run.paused=false;resumeLoop()}
    if(restore)(modalReturnFocus?.isConnected?modalReturnFocus:$("board"))?.focus({preventScroll:true});modalReturnFocus=null;
  }
  function announce(message) { $("battleFeedback").textContent=message; }
  function openLeave() { if(run&&!run.finished&&!activeModal())openModal($("leavePanel"),$("leaveContinueBtn")); }

  $("startBtn").addEventListener("click",()=>showScreen("stage"));
  $("stageBackBtn").addEventListener("click",()=>showScreen("main"));
  $("localeSelect").addEventListener("change",(event)=>{locale=canonicalLocale(event.target.value);storage.set("wonderLocale",locale);window.WonderI18n?.setLocale?.(locale);applyLocale()});
  $("summonBtn").addEventListener("click",summon);$("rerollBtn").addEventListener("click",reroll);$("rallyBtn").addEventListener("click",rally);$("burstBtn").addEventListener("click",burst);
  $("battleBackBtn").addEventListener("click",openLeave);$("pauseBtn").addEventListener("click",()=>openModal($("pausePanel"),$("resumeBtn")));
  $("leaveContinueBtn").addEventListener("click",()=>closeModal($("leavePanel")));$("resumeBtn").addEventListener("click",()=>closeModal($("pausePanel")));
  $("pauseHelpBtn").addEventListener("click",()=>{$("pausePanel").hidden=true;openModal($("tutorialPanel"),$("tutorialStartBtn"))});
  $("tutorialStartBtn").addEventListener("click",()=>{save.tutorialSeen=true;persist();closeModal($("tutorialPanel"))});
  $("leaveStagesBtn").addEventListener("click",()=>{$("leavePanel").hidden=true;$("battleLive").inert=false;run=null;showScreen("stage")});
  $("resultStagesBtn").addEventListener("click",()=>commitResult(()=>{run=null;$("resultPanel").hidden=true;$("battleLive").inert=false;showScreen("stage")}));
  $("retryBtn").addEventListener("click",()=>commitResult(()=>startBattle(currentStageIndex)));
  $("nextBtn").addEventListener("click",()=>commitResult(()=>startBattle(Math.min(29,currentStageIndex+1))));

  $("board").addEventListener("keydown",(event)=>{
    if(!run||activeModal())return;let next=run.cursor;
    if(event.key==="ArrowLeft")next=Math.max(0,next-1);else if(event.key==="ArrowRight")next=Math.min(14,next+1);
    else if(event.key==="ArrowUp")next=Math.max(0,next-5);else if(event.key==="ArrowDown")next=Math.min(14,next+5);
    else if(event.key==="Enter"||event.key===" "){event.preventDefault();selectOrMerge(run.cursor);return}
    else if(event.key.toLowerCase()==="s"){event.preventDefault();summon();return}
    else if(event.key.toLowerCase()==="r"){event.preventDefault();reroll();return}
    else if(event.key==="1"){event.preventDefault();rally();return}
    else if(event.key==="2"){event.preventDefault();burst();return}
    else if(event.key==="Escape"){event.preventDefault();openLeave();return}else return;
    event.preventDefault();run.cursor=next;const slots=[...$("board").children];slots[next]?.scrollIntoView({block:"nearest",inline:"nearest"});slots.forEach((slot,index)=>slot.classList.toggle("cursor",index===next));
  });
  window.addEventListener("keydown",(event)=>{if(event.key==="Escape"&&screen==="battle"&&!activeModal())openLeave()});
  window.addEventListener("blur",()=>{windowFocused=false;if(run&&!run.finished&&screen==="battle"){lifecyclePaused=true;run.paused=true;stopLoop()}});
  window.addEventListener("focus",()=>{windowFocused=true;if(lifecyclePaused&&!document.hidden){lifecyclePaused=false;if(run&&!run.finished&&screen==="battle"&&!activeModal()){run.paused=false;resumeLoop()}}});
  document.addEventListener("visibilitychange",()=>{if(document.hidden){if(run&&!run.finished&&screen==="battle"){lifecyclePaused=true;run.paused=true;stopLoop()}}else if(windowFocused&&lifecyclePaused){lifecyclePaused=false;if(run&&!run.finished&&screen==="battle"&&!activeModal()){run.paused=false;resumeLoop()}}});
  window.addEventListener("resize",()=>{if(run)drawRoad()});

  window.__animalDiceBastionSmoke = {
    stages, startBattle, summon, selectOrMerge, reroll, rally, burst,
    setLocale(code){locale=canonicalLocale(code);applyLocale()},
    forceWin(){if(run)finish(true)}, forceLose(){if(run){run.core=0;finish(false)}},
    snapshot(){return{locale,screen,save:JSON.parse(JSON.stringify(save)),stagePanel,run:run&&{stage:run.stage.n,board:run.board.map((unit)=>unit&&{...unit}),selected:run.selected,cursor:run.cursor,charge:run.charge,summonCost:run.summonCost,drought:run.drought,core:run.core,maxCore:run.maxCore,wave:run.wave,enemies:run.enemies.map((enemy)=>({...enemy})),burst:run.burst,rally:run.rally,rallyCooldown:run.rallyCooldown,rerolls:run.rerolls,merges:run.merges,finished:run.finished,paused:run.paused}}},
    setCharge(value){if(run){run.charge=Math.max(0,Math.min(100,Number(value)||0));updateBattleHud(true)}},
    setBoard(board){if(run){run.board=Array.from({length:15},(_,i)=>board[i]?{...board[i],cooldown:0}:null);renderBoard()}},
    setRandomSeed(seed){if(run)run.random=seeded(Number(seed)||1)},
    randomSample(seed,count=5000){
      const random=seeded(Number(seed)||1),counts=Object.fromEntries(guardianTypes.map((type)=>[type.id,0]));
      for(let i=0;i<count;i+=1)counts[guardianTypes[Math.floor(random()*guardianTypes.length)].id]+=1;
      return counts;
    },
    advance(seconds){
      if(!run)return null;
      const wasPaused=run.paused;run.paused=false;
      for(let elapsed=0;elapsed<seconds&&!run.finished;elapsed+=.05)updateSimulation(.05);
      if(!run.finished)run.paused=wasPaused;
      drawRoad();return this.snapshot();
    },
    finish
  };

  applyLocale(); showScreen("main");
  let progress=0;const loadingTimer=setInterval(()=>{progress=Math.min(100,progress+25);$("loadingFill").style.width=`${progress}%`;if(progress>=100){clearInterval(loadingTimer);$("loadingPanel").hidden=true}},55);
})();
