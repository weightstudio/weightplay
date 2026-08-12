(function () {
  "use strict";

  const gameId = "zhao-yun-a-dou";
  const data = window.ZHAO_YUN_ADOU_LEVELS;
  const dictionaries = window.ZHAO_YUN_ADOU_LOCALES;
  const localeCodes = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const routeToLocale = { "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", "pt-br": "pt-BR" };
  const saveKey = "weightplay-zhao-yun-a-dou-v1";
  const unitTypes = Object.keys(data.unitTypes);
  let locale = getInitialLocale();
  let progress = loadProgress();
  let stageIndex = 0;
  let selectedSlot = null;
  let battle = null;
  let loopTimer = null;
  let statusTimer = null;
  let dragSlot = null;

  const el = {
    main: document.getElementById("main"),
    stage: document.getElementById("stage"),
    battle: document.getElementById("battle"),
    start: document.getElementById("start"),
    stageGrid: document.getElementById("stageGrid"),
    progress: document.getElementById("progress"),
    battleBack: document.getElementById("battleBack"),
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
    hint: document.getElementById("hint"),
    status: document.getElementById("status"),
    tutorial: document.getElementById("tutorial"),
    tutorialClose: document.getElementById("tutorialClose"),
    leaveBattle: document.getElementById("leaveBattle"),
    continueBattle: document.getElementById("continueBattle"),
    returnToStage: document.getElementById("returnToStage"),
    result: document.getElementById("result"),
    resultEyebrow: document.getElementById("resultEyebrow"),
    resultTitle: document.getElementById("resultTitle"),
    resultBody: document.getElementById("resultBody"),
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
    return routeToLocale[pathLocale]
      || (localeCodes.indexOf(documentLocale) >= 0 ? documentLocale : null)
      || (localeCodes.indexOf(saved) >= 0 ? saved : "en");
  }

  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (_) { return null; }
  }

  function safeSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (_) {}
  }

  function loadProgress() {
    const fallback = { unlocked: 1, stars: Array(30).fill(0), tutorialSeen: false };
    try {
      const parsed = JSON.parse(safeGet(saveKey) || "null");
      if (!parsed) return fallback;
      return {
        unlocked: Math.max(1, Math.min(30, Number(parsed.unlocked) || 1)),
        stars: Array.from({ length: 30 }, function (_, index) { return Math.max(0, Math.min(3, Number(parsed.stars && parsed.stars[index]) || 0)); }),
        tutorialSeen: Boolean(parsed.tutorialSeen),
      };
    } catch (_) {
      return fallback;
    }
  }

  function saveProgress() {
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
      stageList: t("stageTitle"),
      stageTabs: t("stages"),
    };
    document.querySelectorAll("[data-t-aria]").forEach(function (node) {
      const key = node.getAttribute("data-t-aria");
      if (ariaMap[key]) node.setAttribute("aria-label", ariaMap[key]);
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
    [el.main, el.stage, el.battle].forEach(function (node) {
      node.hidden = node.id !== name;
    });
    document.body.setAttribute("data-screen", name);
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function showMain() {
    stopLoop();
    closeDialogs();
    battle = null;
    selectedSlot = null;
    showScreen("main");
  }

  function showStage() {
    stopLoop();
    closeDialogs();
    battle = null;
    selectedSlot = null;
    showScreen("stage");
    renderStages();
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
      card.disabled = !unlocked;
      card.setAttribute("aria-label", (locale === "en" ? level.nameEnglish : level.name) + (unlocked ? ", " + t("ready") : ", " + t("locked")));
      card.innerHTML = "<strong>" + (index + 1) + "</strong><small>" + escapeHtml(locale === "en" ? level.chapterEnglish : level.chapterName) + "</small><span>" + escapeHtml(locale === "en" ? level.objectiveEnglish : level.objective) + "</span><i class=\"stage-stars\" aria-label=\"" + t("stars") + ": " + stars + "\">" + stars + "</i>";
      card.addEventListener("click", function () {
        stageIndex = index;
        startBattle(index);
      });
      el.stageGrid.appendChild(card);
    });
  }

  function startBattle(index, options) {
    stageIndex = Math.max(0, Math.min(data.levels.length - 1, index));
    const level = data.levels[stageIndex];
    battle = createBattle(level, options || {});
    selectedSlot = null;
    showScreen("battle");
    renderBattle();
    if (!progress.tutorialSeen && !options?.skipTutorial) {
      progress.tutorialSeen = true;
      saveProgress();
      window.setTimeout(function () { if (battle && el.tutorial && !el.tutorial.open) el.tutorial.showModal(); }, 80);
    }
    startLoop();
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
        units[item.slot] = makeUnit(item.type, item.level);
      });
    }
    return {
      level: level,
      units: units,
      enemies: [],
      spawned: 0,
      ticks: 0,
      buns: fixture === "merge" ? 8 : level.startingBuns,
      commandHp: fixture === "loss" ? 999 : level.commandHp,
      maxCommandHp: fixture === "loss" ? 999 : level.commandHp,
      adouHp: fixture === "loss" ? 1 : level.adouHp,
      maxAdouHp: fixture === "loss" ? 1 : level.adouHp,
      result: null,
      status: "",
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
    };
  }

  function startLoop() {
    stopLoop();
    loopTimer = window.setInterval(function () {
      if (!battle || battle.result || (el.tutorial && el.tutorial.open) || (el.leaveBattle && el.leaveBattle.open)) return;
      advanceBattle(1);
    }, 100);
  }

  function stopLoop() {
    if (loopTimer) window.clearInterval(loopTimer);
    loopTimer = null;
  }

  function advanceBattle(steps) {
    if (!battle || battle.result) return;
    for (let step = 0; step < steps; step += 1) tickBattle();
    renderBattle();
  }

  function tickBattle() {
    battle.ticks += 1;
    if (battle.ticks % 10 === 0 && battle.buns < 15) battle.buns += 1;
    const level = battle.level;
    if (battle.spawned < level.enemyCount && battle.ticks % level.spawnGap === 0) {
      spawnEnemy();
    }
    battle.enemies.slice().forEach(function (enemy) {
      if (enemy.stun > 0) {
        enemy.stun -= 1;
        return;
      }
      enemy.position += enemy.speed;
      if (enemy.position >= 0.94) {
        battle.adouHp = Math.max(0, battle.adouHp - enemy.damage);
        battle.enemies = battle.enemies.filter(function (candidate) { return candidate.id !== enemy.id; });
        setStatus(t("statusBoss") + " " + t("hp") + " " + battle.adouHp + "/" + battle.maxAdouHp);
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
      const target = battle.enemies.filter(function (enemy) { return enemy.lane === lane; }).sort(function (a, b) { return b.position - a.position; })[0];
      const damage = unitDamage(unit);
      if (target) {
        target.hp -= damage;
        if (target.hp <= 0) {
          battle.enemies = battle.enemies.filter(function (enemy) { return enemy.id !== target.id; });
        }
      } else if (battle.spawned >= level.enemyCount && battle.enemies.length === 0 && battle.commandHp > 0) {
        battle.commandHp = Math.max(0, battle.commandHp - damage);
      }
    });
    Object.keys(battle.skillsUsed).forEach(function (key) {
      if (battle.skillsUsed[key] > 0) battle.skillsUsed[key] -= 1;
    });
    if (battle.adouHp <= 0) finishBattle("loss");
    if (battle.commandHp <= 0) finishBattle("win");
  }

  function spawnEnemy() {
    const level = battle.level;
    const lane = level.lanePattern[battle.spawned % level.lanePattern.length];
    const boss = level.boss && battle.spawned === level.enemyCount - 1;
    const maxHp = level.enemyHp + (boss ? 9 : 0);
    battle.enemies.push({
      id: battle.spawned + 1,
      lane: lane,
      position: 0.04,
      hp: maxHp,
      maxHp: maxHp,
      speed: level.enemySpeed * (boss ? .75 : 1),
      damage: level.enemyDamage + (boss ? 1 : 0),
      boss: boss,
      stun: 0,
    });
    battle.spawned += 1;
    if (boss) setStatus(t("statusBoss"));
  }

  function unitDamage(unit) {
    if (unit.general) return data.generals[unit.type].damage + unit.level;
    return data.unitTypes[unit.type].damage * unit.level;
  }

  function recruit() {
    if (!battle || battle.result) return;
    const slot = battle.units.findIndex(function (unit) { return !unit; });
    if (slot < 0) {
      setStatus(t("noSpace"));
      return;
    }
    if (battle.buns < 3) {
      setStatus(t("notEnough"));
      return;
    }
    battle.buns -= 3;
    const type = unitTypes[battle.recruitIndex % unitTypes.length];
    battle.recruitIndex += 1;
    battle.units[slot] = makeUnit(type, 1);
    setStatus(t("statusRecruit"));
    renderBattle();
  }

  function handleSlot(slot) {
    if (!battle || battle.result) return;
    const unit = battle.units[slot];
    if (selectedSlot === null) {
      if (!unit) return;
      selectedSlot = slot;
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
      battle.units[slot] = source.level >= 3
        ? makeUnit(source.type, 4, true)
        : makeUnit(source.type, source.level + 1);
      battle.units[selectedSlot] = null;
      selectedSlot = null;
      setStatus(source.level >= 3 ? t("general") + ": " + generalName(battle.units[slot]) : t("statusMerge"));
      renderBattle();
      return;
    }
    selectedSlot = slot;
    setStatus(t("cannotMerge"));
    renderFormation();
  }

  function canMerge(first, second) {
    return first && second && first.type === second.type && first.level === second.level && first.general === second.general && !first.general;
  }

  function useSkill(type) {
    if (!battle || battle.result) return;
    const unit = battle.units.find(function (candidate) { return candidate && candidate.general && candidate.type === type; });
    if (!unit) return;
    const cooldown = battle.skillsUsed[type] || 0;
    if (cooldown > 0) {
      setStatus(t("cooldown"));
      return;
    }
    const victims = battle.enemies.slice().sort(function (a, b) { return b.position - a.position; });
    if (type === "blade") {
      victims.slice(0, 3).forEach(function (enemy) { enemy.hp -= 9; });
    } else if (type === "spear") {
      victims.forEach(function (enemy) { enemy.stun = 35; enemy.hp -= 5; });
    } else if (type === "horse") {
      const target = victims[0];
      if (target) { target.hp -= 18; target.position = Math.max(0, target.position - .25); }
    } else {
      victims.forEach(function (enemy) { enemy.hp -= 8; });
    }
    battle.enemies = battle.enemies.filter(function (enemy) { return enemy.hp > 0; });
    battle.skillsUsed[type] = 80;
    setStatus(t("statusSkill"));
    renderBattle();
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
      saveProgress();
    }
    renderBattle();
    el.resultEyebrow.textContent = result === "win" ? t("win") : t("lose");
    el.resultTitle.textContent = result === "win" ? t("win") : t("lose");
    el.resultBody.textContent = result === "win" ? t("winBody") : t("loseBody");
    el.resultStars.textContent = stars + " / 3";
    el.resultTime.textContent = seconds + "s";
    el.next.disabled = result !== "win" || stageIndex >= data.levels.length - 1 || stageIndex + 1 >= progress.unlocked;
    el.result.showModal();
  }

  function renderBattle() {
    if (!battle) return;
    const level = battle.level;
    el.chapter.textContent = (locale === "en" ? level.chapterEnglish : level.chapterName) + " · " + t("mission") + " " + level.id;
    el.stageName.textContent = locale === "en" ? level.nameEnglish : level.name;
    el.remaining.textContent = t("wave") + " " + Math.min(level.waveCount, battle.spawned + 1) + " / " + level.waveCount;
    el.enemyHp.textContent = battle.commandHp + " / " + battle.maxCommandHp;
    el.commandPostHp.textContent = battle.commandHp + " / " + battle.maxCommandHp;
    el.buns.textContent = String(battle.buns);
    el.adouHp.textContent = battle.adouHp + " / " + battle.maxAdouHp;
    el.baseHp.textContent = battle.adouHp + " / " + battle.maxAdouHp;
    el.recruit.disabled = Boolean(battle.result);
    el.status.textContent = battle.status || t("mergeHint");
    renderLanes();
    renderFormation();
    renderSkills();
  }

  function renderLanes() {
    el.enemyLanes.innerHTML = "";
    el.playerLanes.innerHTML = "";
    for (let lane = 0; lane < 3; lane += 1) {
      const enemyRow = document.createElement("div");
      enemyRow.className = "lane-row";
      enemyRow.setAttribute("data-lane", t("lane") + " " + (lane + 1));
      battle.enemies.filter(function (enemy) { return enemy.lane === lane; }).forEach(function (enemy) {
        const token = document.createElement("span");
        token.className = "enemy-token enemy-kind-" + (enemy.id % 3) + (enemy.boss ? " boss" : "");
        token.textContent = enemy.boss ? "將" : "卒";
        token.style.left = (enemy.position * 100) + "%";
        token.title = enemy.hp + " / " + enemy.maxHp;
        enemyRow.appendChild(token);
      });
      el.enemyLanes.appendChild(enemyRow);
      const playerRow = document.createElement("div");
      playerRow.className = "lane-row";
      playerRow.setAttribute("data-lane", t("lane") + " " + (lane + 1));
      battle.units.forEach(function (unit, slot) {
        if (!unit || slot % 3 !== lane) return;
        const token = document.createElement("span");
        token.className = "lane-unit" + (unit.general ? " general-unit" : "");
        token.textContent = unit.general ? data.generals[unit.type].glyph : data.unitTypes[unit.type].glyph;
        token.style.color = unit.general ? data.generals[unit.type].color : data.unitTypes[unit.type].color;
        token.title = unitName(unit);
        playerRow.appendChild(token);
      });
      el.playerLanes.appendChild(playerRow);
    }
  }

  function renderFormation() {
    el.formation.innerHTML = "";
    battle.units.forEach(function (unit, slot) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "unit-slot" + (unit ? " unit-type-" + unit.type : "") + (unit ? "" : " empty") + (selectedSlot === slot ? " selected" : "") + (unit && unit.general ? " general-unit" : "");
      button.setAttribute("role", "gridcell");
      button.setAttribute("data-slot", String(slot));
      button.setAttribute("aria-label", unit ? unitName(unit) + ", " + t("lane") + " " + ((slot % 3) + 1) : t("empty") + ", " + t("lane") + " " + ((slot % 3) + 1));
      button.innerHTML = unit
        ? "<span class=\"unit-lane\">" + t("lane") + " " + ((slot % 3) + 1) + "</span><span class=\"unit-glyph\" style=\"--unit-color:" + (unit.general ? data.generals[unit.type].color : data.unitTypes[unit.type].color) + "\">" + (unit.general ? data.generals[unit.type].glyph : data.unitTypes[unit.type].glyph) + "</span><span class=\"unit-level\">" + t("level") + " " + (unit.general ? "★" : unit.level) + "</span>"
        : "<span aria-hidden=\"true\">＋</span>";
      button.addEventListener("click", function () { handleSlot(slot); });
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
    el.skills.innerHTML = "";
    battle.units.forEach(function (unit) {
      if (!unit || !unit.general || el.skills.querySelector("[data-skill=\"" + unit.type + "\"]")) return;
      const general = data.generals[unit.type];
      const button = document.createElement("button");
      const cooldown = battle.skillsUsed[unit.type] || 0;
      button.type = "button";
      button.className = "skill-button skill-" + unit.type + (!cooldown ? " ready" : "");
      button.setAttribute("data-skill", unit.type);
      button.disabled = Boolean(cooldown) || Boolean(battle.result);
      button.setAttribute("aria-label", generalName(unit) + " " + (locale === "en" ? general.skillEnglish : general.skill));
      button.innerHTML = "<span class=\"skill-glyph\">" + general.glyph + "</span><span class=\"skill-cooldown\">" + (cooldown ? Math.ceil(cooldown / 10) + "s" : t("readySkill")) + "</span>";
      button.addEventListener("click", function () { useSkill(unit.type); });
      el.skills.appendChild(button);
    });
  }

  function unitName(unit) {
    if (unit.general) return generalName(unit);
    const definition = data.unitTypes[unit.type];
    return (locale === "en" ? definition.english : definition.name) + " · " + t("level") + " " + unit.level;
  }

  function generalName(unit) {
    const definition = data.generals[unit.type];
    return locale === "en" ? definition.english : definition.name;
  }

  function setStatus(message) {
    if (!battle) return;
    battle.status = message;
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () {
      if (battle && !battle.result) battle.status = "";
    }, 2200);
  }

  function closeDialogs() {
    [el.tutorial, el.leaveBattle, el.result].forEach(function (dialog) {
      if (dialog && dialog.open) dialog.close();
    });
  }

  function showLeaveDialog() {
    if (battle && !battle.result) el.leaveBattle.showModal();
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
    locale = el.locale.value;
    safeSet("weightPlayLocale", locale);
    updateStaticLocale();
  });
  el.recruit.addEventListener("click", recruit);
  el.hint.addEventListener("click", showHint);
  el.battleBack.addEventListener("click", showLeaveDialog);
  document.querySelector("#stage [data-back]").addEventListener("click", showMain);
  el.tutorialClose.addEventListener("click", function () { el.tutorial.close(); });
  el.continueBattle.addEventListener("click", function () { el.leaveBattle.close(); });
  el.returnToStage.addEventListener("click", showStage);
  el.resultStages.addEventListener("click", showStage);
  el.retry.addEventListener("click", function () { el.result.close(); startBattle(stageIndex, { skipTutorial: true }); });
  el.next.addEventListener("click", function () {
    if (el.next.disabled) return;
    el.result.close();
    startBattle(stageIndex + 1, { skipTutorial: true });
  });
  document.addEventListener("keydown", function (event) {
    if (document.activeElement && ["INPUT", "SELECT", "TEXTAREA"].indexOf(document.activeElement.tagName) >= 0) return;
    if (event.key.toLowerCase() === "r" && battle && !battle.result) recruit();
    if (event.key.toLowerCase() === "h" && battle && !battle.result) showHint();
    if (event.key >= "1" && event.key <= "9" && battle && !battle.result) handleSlot(Number(event.key) - 1);
    if (event.key === "Escape" && el.leaveBattle.open) el.leaveBattle.close();
  });

  updateStaticLocale();
  showScreen("main");
  window.setTimeout(updateStaticLocale, 900);

  window.__zhaoYunADouSmoke = {
    snapshot: function () {
      return {
        screen: document.body.getAttribute("data-screen"),
        stageIndex: stageIndex + 1,
        unlocked: progress.unlocked,
        result: battle && battle.result,
        commandHp: battle && battle.commandHp,
        adouHp: battle && battle.adouHp,
        buns: battle && battle.buns,
        enemies: battle ? battle.enemies.length : 0,
        units: battle ? battle.units.map(function (unit) { return unit && { type: unit.type, level: unit.level, general: unit.general }; }) : [],
      };
    },
    enterStage: showStage,
    enterBattle: function (index, options) { startBattle(Number(index) || 0, Object.assign({ skipTutorial: true }, options || {})); },
    recruit: recruit,
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
