(() => {
  const GAME_ID = "animal-zoo-idle";
  const localeKey = "weightPlayLocale";
  const saveKey = "weightplay_animal_zoo_idle_save_v3";
  const oldSaveKeys = ["weightplay_animal_zoo_idle_save_v2", "weightplay_animal_zoo_idle_save_v1"];

  const ASSETS = {
    cover: "../../assets/animal-zoo-idle-cover.webp",
    stage: "../../assets/animal-zoo-idle-stage-bg.webp",
    lion: "../../assets/animal-zoo-idle-lion.webp",
    giraffe: "../../assets/animal-zoo-idle-giraffe.png",
    elephant: "../../assets/animal-zoo-elephant.png",
    panda: "../../assets/animal-zoo-panda.png",
    penguin: "../../assets/animal-zoo-penguin.png",
    rabbit: "../../assets/tiny-weather-animal-rabbit.png",
    fox: "../../assets/tiny-weather-animal-fox.png",
    koala: "../../assets/tiny-weather-animal-koala.png",
    tiger: "../../assets/wonder-beast-tiger.png",
    rhino: "../../assets/wonder-beast-rhino.png",
    crocodile: "../../assets/wonder-beast-crocodile.png",
    bear: "../../assets/wonder-beast-bear.png",
    keeper: "../../assets/animal-zoo-keeper.png",
    gate1: "../../assets/animal-zoo-gate-lv1.png",
    gate2: "../../assets/animal-zoo-gate-lv2.png",
    gate3: "../../assets/animal-zoo-gate-lv3.png",
    visitorChild: "../../assets/animal-zoo-visitor-child.png",
    visitorElder: "../../assets/animal-zoo-visitor-elder.png",
    visitorFamily: "../../assets/animal-zoo-visitor-family.png",
  };

  const animals = [
    { id: "lion", asset: ASSETS.lion, baseIncome: 3, cost: 0, care: 5, x: 18, y: 44, size: 22 },
    { id: "giraffe", asset: ASSETS.giraffe, baseIncome: 6, cost: 650, care: 7, x: 76, y: 45, size: 26 },
    { id: "elephant", asset: ASSETS.elephant, baseIncome: 11, cost: 2400, care: 9, x: 43, y: 37, size: 22 },
    { id: "panda", asset: ASSETS.panda, baseIncome: 16, cost: 8200, care: 10, x: 86, y: 32, size: 16 },
    { id: "penguin", asset: ASSETS.penguin, baseIncome: 23, cost: 24000, care: 11, x: 61, y: 25, size: 14 },
    { id: "rabbit", asset: ASSETS.rabbit, baseIncome: 7, cost: 1400, care: 8, x: 58, y: 43, size: 13 },
    { id: "fox", asset: ASSETS.fox, baseIncome: 14, cost: 5200, care: 10, x: 31, y: 29, size: 15 },
    { id: "koala", asset: ASSETS.koala, baseIncome: 20, cost: 15000, care: 11, x: 71, y: 28, size: 14 },
    { id: "tiger", asset: ASSETS.tiger, baseIncome: 34, cost: 46000, care: 12, x: 48, y: 48, size: 16 },
    { id: "rhino", asset: ASSETS.rhino, baseIncome: 46, cost: 98000, care: 13, x: 83, y: 20, size: 21 },
    { id: "crocodile", asset: ASSETS.crocodile, baseIncome: 58, cost: 210000, care: 14, x: 39, y: 22, size: 20 },
    { id: "bear", asset: ASSETS.bear, baseIncome: 74, cost: 460000, care: 16, x: 16, y: 25, size: 19 },
  ];

  const maxGateLevel = 8;
  const careCooldownMs = 30000;
  const layoutVersion = 2;

  const visitorAssets = [ASSETS.visitorChild, ASSETS.visitorElder, ASSETS.visitorFamily];

  const text = {
    en: {
      title: "Animal Zoo Idle",
      language: "Language",
      menuTitle: "Build a growing animal park.",
      menuHint: "Welcome visitors, collect tickets, upgrade the zoo gate, and recruit more animals to grow your park.",
      start: "Open Park",
      coins: "Coins",
      tickets: "Ticket Box",
      visitors: "Visitors",
      report: "Report",
      reportTitle: "Zoo Growth Report",
      continue: "Continue",
      loading: "Loading",
      collect: "Collect",
      careAll: "Care",
      upgradeGate: "Upgrade Gate",
      recruit: "Recruit",
      gate: "Gate Lv.{n}",
      income: "{n}/10s",
      happiness: "Happiness",
      animals: "Animals",
      offline: "Welcome back! Visitors left {coins} coins in the ticket box.",
      notEnough: "Need {coins} more coins.",
      collected: "Collected {coins} coins.",
      cared: "Animals are happier. More visitors are coming.",
      careWait: "Care is resting for {n}s.",
      upgraded: "The gate looks better. Ticket income increased!",
      recruited: "{name} joined the zoo!",
      maxGate: "Max Gate",
      buyAnimal: "Buy",
      owned: "Owned",
      incomeShort: "+{n}/10s",
      careShort: "Care +{n}",
      dragHint: "Drag animals in the meadow to arrange your zoo.",
      reportGood: "Great care! Your zoo is growing and the animals looked happy.",
      reportTry: "Good effort. Recruit animals and upgrade the gate to grow faster.",
      lion: "Lion",
      giraffe: "Giraffe",
      elephant: "Elephant",
      panda: "Panda",
      penguin: "Penguin",
      rabbit: "Rabbit",
      fox: "Fox",
      koala: "Koala",
      tiger: "Tiger",
      rhino: "Rhino",
      crocodile: "Crocodile",
      bear: "Bear",
    },
    "zh-Hant": {},
  };

  text["zh-Hant"] = {
    title: "\u52d5\u7269\u5c0f\u5c0f\u6a02\u5712",
    language: "\u8a9e\u8a00",
    menuTitle: "\u5efa\u8a2d\u4e00\u5ea7\u6703\u6210\u9577\u7684\u52d5\u7269\u6a02\u5712\u3002",
    menuHint: "\u6b61\u8fce\u53c3\u89c0\u8005\u3001\u6536\u96c6\u9580\u7968\u6536\u5165\u3001\u5347\u7d1a\u5927\u9580\uff0c\u4e26\u62db\u52df\u66f4\u591a\u52d5\u7269\u4f86\u64f4\u5efa\u6a02\u5712\u3002",
    start: "\u958b\u5712",
    coins: "\u91d1\u5e63",
    tickets: "\u7968\u7bb1",
    visitors: "\u53c3\u89c0\u8005",
    report: "\u5831\u544a",
    reportTitle: "\u6a02\u5712\u6210\u9577\u5831\u544a",
    continue: "\u7e7c\u7e8c",
    loading: "\u8f09\u5165\u4e2d",
    collect: "\u6536\u7968",
    careAll: "\u7167\u9867",
    upgradeGate: "\u5347\u7d1a\u5927\u9580",
    recruit: "\u62db\u52df",
    gate: "\u5927\u9580 Lv.{n}",
    income: "{n}/10\u79d2",
    happiness: "\u5feb\u6a02\u5ea6",
    animals: "\u52d5\u7269",
    offline: "\u6b61\u8fce\u56de\u4f86\uff01\u53c3\u89c0\u8005\u5728\u7968\u7bb1\u7559\u4e0b {coins} \u91d1\u5e63\u3002",
    notEnough: "\u9084\u5dee {coins} \u91d1\u5e63\u3002",
    collected: "\u6536\u5230 {coins} \u91d1\u5e63\u3002",
    cared: "\u52d5\u7269\u5011\u66f4\u958b\u5fc3\u4e86\uff01",
    careWait: "\u7167\u9867\u9700\u8981\u4f11\u606f {n} \u79d2\u3002",
    upgraded: "\u5927\u9580\u8b8a\u66f4\u6f02\u4eae\uff0c\u9580\u7968\u6536\u5165\u63d0\u5347\u4e86\uff01",
    recruited: "{name} \u52a0\u5165\u6a02\u5712\uff01",
    maxGate: "\u5927\u9580\u5df2\u6eff\u7d1a",
    buyAnimal: "\u8cfc\u8cb7",
    owned: "\u5df2\u64c1\u6709",
    incomeShort: "+{n}/10\u79d2",
    careShort: "\u7167\u9867 +{n}",
    dragHint: "\u53ef\u4ee5\u62d6\u66f3\u8349\u539f\u4e0a\u7684\u52d5\u7269\uff0c\u64fa\u6210\u81ea\u5df1\u559c\u6b61\u7684\u6a02\u5712\u3002",
    reportGood: "\u7167\u9867\u5f97\u5f88\u597d\uff01\u4f60\u7684\u52d5\u7269\u5712\u6b63\u5728\u7a69\u5b9a\u6210\u9577\u3002",
    reportTry: "\u8868\u73fe\u4e0d\u932f\uff01\u62db\u52df\u52d5\u7269\u548c\u5347\u7d1a\u5927\u9580\u53ef\u4ee5\u8b93\u6a02\u5712\u6210\u9577\u66f4\u5feb\u3002",
    lion: "\u7345\u5b50",
    giraffe: "\u9577\u9838\u9e7f",
    elephant: "\u5927\u8c61",
    panda: "\u718a\u8c93",
    penguin: "\u4f01\u9d5d",
    rabbit: "\u5154\u5b50",
    fox: "\u72d0\u72f8",
    koala: "\u7121\u5c3e\u718a",
    tiger: "\u8001\u864e",
    rhino: "\u7280\u725b",
    crocodile: "\u9c77\u9b5a",
    bear: "\u718a",
  };

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    gamePanel: $("gamePanel"),
    startBtn: $("startBtn"),
    coinText: $("coinText"),
    incomeText: $("incomeText"),
    reportBtn: $("reportBtn"),
    offlineNotice: $("offlineNotice"),
    habitatGrid: $("habitatGrid"),
    resultPanel: $("resultPanel"),
    reportScore: $("reportScore"),
    reportText: $("reportText"),
    focusStars: $("focusStars"),
    logicStars: $("logicStars"),
    animalStars: $("animalStars"),
    closeReportBtn: $("closeReportBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };

  let locale = window.WonderI18n?.locale?.() || localStorage.getItem(localeKey) || "en";
  let save = loadSave();
  let tickCount = 0;

  function t(key, data = {}) {
    const value = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function loadSave() {
    const fallback = {
      coins: 180,
      ticketBox: 0,
      gateLevel: 1,
      happiness: 76,
      playCount: 0,
      careCount: 0,
      careReadyAt: 0,
      layoutVersion,
      bestScore: 0,
      lastScore: 0,
      lastPlayedAt: Date.now(),
      unlocked: { lion: true },
      positions: {},
    };
    try {
      const current = JSON.parse(localStorage.getItem(saveKey) || "null");
      if (current) return normalizeSave({ ...fallback, ...current });
      for (const key of oldSaveKeys) {
        const old = JSON.parse(localStorage.getItem(key) || "null");
        if (old) {
          return normalizeSave({
            ...fallback,
            coins: Math.max(180, Number(old.coins || 0)),
            ticketBox: Number(old.ticketBox || 0),
            gateLevel: Number(old.meadowLevel || old.gateLevel || 1),
            happiness: Number(old.happiness || 76),
            unlocked: { lion: true, giraffe: Boolean(old.animals?.giraffe) },
          });
        }
      }
      return fallback;
    } catch {
      return fallback;
    }
  }

  function normalizeSave(data) {
    data.unlocked = { lion: true, ...(data.unlocked || {}) };
    data.positions = { ...(data.positions || {}) };
    const shouldRefreshLayout = Number(data.layoutVersion || 0) < layoutVersion;
    for (const animal of animals) {
      const position = data.positions[animal.id] || {};
      if (shouldRefreshLayout) {
        data.positions[animal.id] = { x: animal.x, y: animal.y };
        continue;
      }
      data.positions[animal.id] = {
        x: clamp(Number(position.x ?? animal.x), 7, 90),
        y: clamp(Number(position.y ?? animal.y), 18, 62),
      };
    }
    data.layoutVersion = layoutVersion;
    data.coins = Math.max(0, Number(data.coins || 0));
    data.ticketBox = Math.max(0, Number(data.ticketBox || 0));
    data.gateLevel = clamp(Math.floor(Number(data.gateLevel || 1)), 1, maxGateLevel);
    data.happiness = clamp(Number(data.happiness || 76), 18, 100);
    data.careReadyAt = Math.max(0, Number(data.careReadyAt || 0));
    return data;
  }

  function saveGame() {
    save.lastPlayedAt = Date.now();
    localStorage.setItem(saveKey, JSON.stringify(save));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function unlockedAnimals() {
    return animals.filter((animal) => save.unlocked[animal.id]);
  }

  function nextRecruit() {
    return animals.find((animal) => !save.unlocked[animal.id]);
  }

  function animalPosition(animal) {
    return save.positions?.[animal.id] || { x: animal.x, y: animal.y };
  }

  function gateUpgradeCost() {
    return save.gateLevel >= maxGateLevel ? 0 : Math.round(620 * save.gateLevel * save.gateLevel * 1.22);
  }

  function incomePerTick() {
    const animalIncome = unlockedAnimals().reduce((sum, animal) => sum + animal.baseIncome, 0);
    const gateBonus = 1 + (save.gateLevel - 1) * 0.16;
    const happyBonus = 0.35 + save.happiness / 240;
    return Math.max(2, Math.round(animalIncome * gateBonus * happyBonus));
  }

  function visitorCount() {
    return clamp(Math.ceil(incomePerTick() / 18), 2, 6);
  }

  function formatNumber(value) {
    const number = Math.floor(Number(value || 0));
    if (number >= 1000000) return `${Math.round((number / 1000000) * 10) / 10}M`;
    if (number >= 10000) return `${Math.round((number / 1000) * 10) / 10}K`;
    return String(number);
  }

  function formatCost(value) {
    return Math.floor(Number(value || 0)).toLocaleString(locale === "zh-Hant" ? "zh-TW" : "en-US");
  }

  function careWaitSeconds() {
    return Math.max(0, Math.ceil((Number(save.careReadyAt || 0) - Date.now()) / 1000));
  }

  function applyOffline() {
    const elapsedSeconds = Math.min(7200, Math.max(0, (Date.now() - Number(save.lastPlayedAt || Date.now())) / 1000));
    const earned = Math.floor((elapsedSeconds / 10) * incomePerTick() * 0.55);
    if (earned > 0) {
      save.ticketBox += earned;
      nodes.offlineNotice.textContent = t("offline", { coins: formatNumber(earned) });
      nodes.offlineNotice.classList.remove("hidden");
      window.setTimeout(() => nodes.offlineNotice.classList.add("hidden"), 3200);
    }
    saveGame();
  }

  function localizeStatic() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.localeSelect.value = locale;
  }

  function render() {
    if (nodes.gamePanel.classList.contains("hidden")) return;
    nodes.coinText.textContent = formatNumber(save.coins);
    nodes.incomeText.textContent = formatNumber(save.ticketBox);
    const card = nodes.habitatGrid.querySelector(".zoo-stage-card");
    if (!card) {
      nodes.habitatGrid.appendChild(renderPark());
      return;
    }
    updatePark(card);
  }

  function renderPark() {
    const card = document.createElement("article");
    card.className = "zoo-stage-card";
    card.innerHTML = `
      <div class="park-hud">
        <strong>${t("gate", { n: save.gateLevel })}</strong>
        <span>${t("income", { n: formatNumber(incomePerTick()) })}</span>
        <span>${t("animals")}: ${unlockedAnimals().length}/${animals.length}</span>
      </div>
      <div class="savanna-stage stage-lv-${save.gateLevel}" aria-label="Safari park">
        <div class="gate image-asset"><img src="${gateAsset()}" alt="" draggable="false" /></div>
        <div class="visitor-line"></div>
        <img class="keeper image-asset" src="${ASSETS.keeper}" alt="" draggable="false" />
        <div class="animal-layer"></div>
        <div class="heart-field"></div>
      </div>
      <div class="care-panel">
        <div class="happy-meter"><span>${t("happiness")}</span><b>${Math.round(save.happiness)}%</b><i style="width:${save.happiness}%"></i></div>
        <div class="zoo-actions">
          <button type="button" data-action="collect">${t("collect")}</button>
          <button type="button" data-action="care">${t("careAll")}</button>
          <button type="button" data-action="upgrade" ${save.gateLevel >= maxGateLevel ? "disabled" : ""}>${save.gateLevel >= maxGateLevel ? t("maxGate") : `${t("upgradeGate")} ${formatCost(gateUpgradeCost())}`}</button>
          <button type="button" data-action="report">${t("report")}</button>
        </div>
        <div class="animal-shop-head"><strong>${t("animals")}</strong><span>${t("dragHint")}</span></div>
        <div class="animal-shop" aria-label="Animal shop"></div>
      </div>
    `;
    renderVisitors(card.querySelector(".visitor-line"));
    const animalLayer = card.querySelector(".animal-layer");
    renderAnimals(animalLayer);
    animalLayer.dataset.animalIds = unlockedAnimals().map((animal) => animal.id).join(",");
    card.querySelector('[data-action="collect"]').addEventListener("click", collectTickets);
    card.querySelector('[data-action="care"]').addEventListener("click", careAnimals);
    card.querySelector('[data-action="upgrade"]').addEventListener("click", upgradeGate);
    card.querySelector('[data-action="report"]').addEventListener("click", showReport);
    renderAnimalShop(card.querySelector(".animal-shop"));
    return card;
  }

  function updatePark(card) {
    const hud = card.querySelector(".park-hud");
    if (hud) {
      hud.children[0].textContent = t("gate", { n: save.gateLevel });
      hud.children[1].textContent = t("income", { n: formatNumber(incomePerTick()) });
      hud.children[2].textContent = `${t("animals")}: ${unlockedAnimals().length}/${animals.length}`;
    }
    const stage = card.querySelector(".savanna-stage");
    if (stage) {
      stage.classList.remove("stage-lv-1", "stage-lv-2", "stage-lv-3", "stage-lv-4", "stage-lv-5", "stage-lv-6", "stage-lv-7", "stage-lv-8");
      stage.classList.add(`stage-lv-${save.gateLevel}`);
    }
    const gate = card.querySelector(".gate img");
    if (gate && !gate.src.endsWith(gateAsset())) gate.src = gateAsset();
    const happyText = card.querySelector(".happy-meter b");
    const happyFill = card.querySelector(".happy-meter i");
    if (happyText) happyText.textContent = `${Math.round(save.happiness)}%`;
    if (happyFill) happyFill.style.width = `${save.happiness}%`;
    const upgrade = card.querySelector('[data-action="upgrade"]');
    if (upgrade) {
      upgrade.disabled = save.gateLevel >= maxGateLevel;
      upgrade.textContent = save.gateLevel >= maxGateLevel ? t("maxGate") : `${t("upgradeGate")} ${formatCost(gateUpgradeCost())}`;
    }
    renderAnimalShop(card.querySelector(".animal-shop"));
    const care = card.querySelector('[data-action="care"]');
    if (care) {
      const waitSeconds = careWaitSeconds();
      care.disabled = waitSeconds > 0;
      care.textContent = waitSeconds > 0 ? `${t("careAll")} ${waitSeconds}s` : t("careAll");
    }
    const animalLayer = card.querySelector(".animal-layer");
    const animalIds = unlockedAnimals().map((animal) => animal.id).join(",");
    if (animalLayer && animalLayer.dataset.animalIds !== animalIds) {
      animalLayer.innerHTML = "";
      renderAnimals(animalLayer);
      animalLayer.dataset.animalIds = animalIds;
    }
  }

  function gateAsset() {
    if (save.gateLevel >= 6) return ASSETS.gate3;
    if (save.gateLevel >= 3) return ASSETS.gate2;
    return ASSETS.gate1;
  }

  function renderVisitors(container) {
    const count = visitorCount();
    for (let i = 0; i < count; i += 1) {
      const img = document.createElement("img");
      img.src = visitorAssets[i % visitorAssets.length];
      img.alt = "";
      img.draggable = false;
      img.style.setProperty("--delay", `${i * -0.72}s`);
      img.style.setProperty("--lane", `${i % 3}`);
      container.appendChild(img);
    }
  }

  function renderAnimals(container) {
    for (const animal of unlockedAnimals()) {
      const position = animalPosition(animal);
      const wrap = document.createElement("div");
      wrap.className = `animal animal-${animal.id}`;
      wrap.dataset.name = t(animal.id);
      wrap.dataset.animalId = animal.id;
      wrap.style.left = `${position.x}%`;
      wrap.style.bottom = `${position.y}%`;
      wrap.style.width = `${animal.size}%`;
      wrap.innerHTML = `<img src="${animal.asset}" alt="" draggable="false" />`;
      attachAnimalDrag(wrap, animal);
      container.appendChild(wrap);
    }
  }

  function renderAnimalShop(container) {
    if (!container) return;
    container.innerHTML = "";
    for (const animal of animals) {
      const owned = Boolean(save.unlocked[animal.id]);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `animal-shop-card ${owned ? "owned" : ""}`;
      button.dataset.shopAnimal = animal.id;
      button.disabled = !owned && save.coins < animal.cost;
      button.innerHTML = `
        <img src="${animal.asset}" alt="" draggable="false" />
        <strong>${t(animal.id)}</strong>
        <span>${owned ? t("owned") : `${t("buyAnimal")} ${formatCost(animal.cost)}`}</span>
        <small>${t("incomeShort", { n: formatNumber(animal.baseIncome) })} / ${t("careShort", { n: animal.care })}</small>
      `;
      button.addEventListener("click", () => buyAnimal(animal.id));
      container.appendChild(button);
    }
  }

  function attachAnimalDrag(element, animal) {
    element.addEventListener("pointerdown", (event) => {
      if (!save.unlocked[animal.id]) return;
      const stage = element.closest(".savanna-stage");
      if (!stage) return;
      event.preventDefault();
      element.setPointerCapture?.(event.pointerId);
      element.classList.add("dragging");
      const move = (moveEvent) => {
        const rect = stage.getBoundingClientRect();
        const x = clamp(((moveEvent.clientX - rect.left) / rect.width) * 100, 7, 90);
        const y = clamp(((rect.bottom - moveEvent.clientY) / rect.height) * 100, 18, 62);
        element.style.left = `${x}%`;
        element.style.bottom = `${y}%`;
        save.positions[animal.id] = { x, y };
      };
      const end = () => {
        element.classList.remove("dragging");
        element.releasePointerCapture?.(event.pointerId);
        saveGame();
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", end);
        document.removeEventListener("pointercancel", end);
      };
      move(event);
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", end, { once: true });
      document.addEventListener("pointercancel", end, { once: true });
    });
  }

  function collectTickets() {
    const amount = Math.floor(save.ticketBox);
    if (amount <= 0) {
      popToast(t("notEnough"));
      playSound("error");
      return;
    }
    save.coins += amount;
    save.ticketBox = 0;
    popToast(t("collected", { coins: formatNumber(amount) }));
    playSound("coin");
    saveGame();
    render();
  }

  function careAnimals() {
    const waitSeconds = careWaitSeconds();
    if (waitSeconds > 0) {
      popToast(t("careWait", { n: waitSeconds }));
      playSound("error");
      render();
      return;
    }
    save.careCount += 1;
    const gain = unlockedAnimals().reduce((sum, animal) => sum + animal.care, 0);
    save.happiness = clamp(save.happiness + gain, 18, 100);
    save.careReadyAt = Date.now() + careCooldownMs;
    popHearts();
    popToast(t("cared"));
    playSound("success");
    saveGame();
    render();
  }

  function upgradeGate() {
    if (save.gateLevel >= maxGateLevel) return;
    const cost = gateUpgradeCost();
    if (save.coins < cost) return notEnough(cost);
    save.coins -= cost;
    save.gateLevel += 1;
    save.happiness = clamp(save.happiness + 7, 18, 100);
    popToast(t("upgraded"));
    playSound("upgrade");
    saveGame();
    render();
  }

  function recruitAnimal() {
    const animal = nextRecruit();
    if (!animal) return;
    buyAnimal(animal.id);
  }

  function buyAnimal(animalId) {
    const animal = animals.find((item) => item.id === animalId);
    if (!animal || save.unlocked[animal.id]) return;
    if (save.coins < animal.cost) return notEnough(animal.cost);
    save.coins -= animal.cost;
    save.unlocked[animal.id] = true;
    save.positions[animal.id] = animalPosition(animal);
    save.happiness = clamp(save.happiness + 12, 18, 100);
    popToast(t("recruited", { name: t(animal.id) }));
    playSound("upgrade");
    window.WonderAnalytics?.track("animal_unlock", { game_id: GAME_ID, animal_id: animal.id });
    saveGame();
    render();
  }

  function notEnough(cost = 0) {
    const missing = Math.max(1, Math.ceil(Number(cost || 0) - save.coins));
    popToast(t("notEnough", { coins: formatCost(missing) }));
    playSound("error");
  }

  function popHearts() {
    const stage = document.querySelector(".heart-field");
    if (!stage) return;
    for (let i = 0; i < 6; i += 1) {
      const heart = document.createElement("i");
      heart.textContent = "\u2665";
      heart.style.left = `${24 + i * 9}%`;
      heart.style.animationDelay = `${i * 70}ms`;
      stage.appendChild(heart);
      window.setTimeout(() => heart.remove(), 900);
    }
  }

  function showReport() {
    const score = Math.round(save.coins / 12 + save.ticketBox / 10 + save.careCount * 16 + save.gateLevel * 55 + unlockedAnimals().length * 80);
    const previous = Number(save.bestScore || 0);
    save.playCount += 1;
    save.lastScore = score;
    save.bestScore = Math.max(previous, score);
    saveGame();
    nodes.reportScore.textContent = score;
    nodes.reportText.textContent = score >= previous ? t("reportGood") : t("reportTry");
    nodes.focusStars.textContent = starText(save.careCount * 32 + save.happiness);
    nodes.logicStars.textContent = starText(save.gateLevel * 90 + unlockedAnimals().length * 34);
    nodes.animalStars.textContent = starText(unlockedAnimals().length * 95);
    nodes.resultPanel.classList.remove("hidden");
    window.WonderAnalytics?.track("game_complete", { game_id: GAME_ID, score, animals: unlockedAnimals().length });
  }

  function starText(score) {
    const count = clamp(Math.ceil(score / 95), 1, 5);
    return "\u2605".repeat(count) + "\u2606".repeat(5 - count);
  }

  function popToast(message) {
    const toast = document.createElement("div");
    toast.className = "zoo-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1300);
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function startGame() {
    if (!nodes.gamePanel.classList.contains("hidden")) return;
    document.body.classList.add("zoo-playing");
    nodes.menuPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");
    applyOffline();
    render();
    requestAnimationFrame(render);
    window.WonderAnalytics?.track("game_start", { game_id: GAME_ID });
  }

  function tickPark() {
    if (nodes.gamePanel.classList.contains("hidden")) return;
    tickCount += 1;
    save.ticketBox += incomePerTick();
    save.happiness = clamp(save.happiness - 0.28, 18, 100);
    if (tickCount % 3 === 0) saveGame();
    render();
  }

  function tickUi() {
    if (!nodes.gamePanel.classList.contains("hidden")) render();
  }

  function loadAssets() {
    const assets = [
      ASSETS.cover,
      ASSETS.stage,
      ASSETS.lion,
      ASSETS.keeper,
      ASSETS.gate1,
      visitorAssets[0],
    ];
    let done = 0;
    const finish = () => {
      done += 1;
      const pct = Math.round((done / assets.length) * 100);
      nodes.loadingText.textContent = `${pct}%`;
      nodes.loadingFill.style.width = `${pct}%`;
      if (done >= assets.length) {
        window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
        window.setTimeout(() => nodes.loadingPanel.classList.add("hidden"), 180);
      }
    };
    assets.forEach((src) => {
      const img = new Image();
      img.onload = finish;
      img.onerror = finish;
      img.src = src;
    });
    window.setTimeout(() => {
      if (!nodes.loadingPanel.classList.contains("hidden")) {
        nodes.loadingText.textContent = "100%";
        nodes.loadingFill.style.width = "100%";
        nodes.loadingPanel.classList.add("hidden");
      }
    }, 1400);
  }

  nodes.localeSelect.addEventListener("change", () => {
    locale = nodes.localeSelect.value;
    window.WonderI18n?.setLocale?.(locale);
    localStorage.setItem(localeKey, locale);
    localizeStatic();
    render();
  });
  nodes.startBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    startGame();
  });
  window.addEventListener("weightplay:tutorial-start", (event) => {
    if (event.detail?.gameId === GAME_ID) startGame();
  });
  nodes.reportBtn.addEventListener("click", showReport);
  nodes.closeReportBtn.addEventListener("click", () => nodes.resultPanel.classList.add("hidden"));
  window.addEventListener("beforeunload", saveGame);

  localizeStatic();
  loadAssets();
  window.setInterval(tickUi, 1000);
  window.setInterval(tickPark, 10000);
})();
