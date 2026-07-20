(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const localePack = window.AnimalSanctuaryLoopLocales;
  const localeCodes = localePack.codes;
  const routeSegments = {
    en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko",
    es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru",
  };
  const routeLocales = Object.fromEntries(
    Object.entries(routeSegments).map(([key, value]) => [value, key]),
  );
  const memoryStorage = new Map();
  const storage = {
    get(key) {
      try {
        const value = window.localStorage.getItem(key);
        return value === null ? memoryStorage.get(key) ?? null : value;
      } catch {
        return memoryStorage.get(key) ?? null;
      }
    },
    set(key, value) {
      memoryStorage.set(key, String(value));
      try {
        window.localStorage.setItem(key, String(value));
      } catch {
        // Same-page memory remains authoritative when browser storage is denied.
      }
    },
  };

  function canonicalLocale(value) {
    const raw = String(value || "").toLowerCase();
    if (raw.startsWith("zh-tw") || raw.includes("hant")) return "zh-Hant";
    if (raw.startsWith("zh-cn") || raw.includes("hans")) return "zh-Hans";
    if (raw.startsWith("pt")) return "pt-BR";
    return localeCodes.find((code) => code.toLowerCase() === raw) || "en";
  }

  const routeLocale = routeLocales[location.pathname.split("/").filter(Boolean)[0]];
  let locale = canonicalLocale(routeLocale || storage.get("wonderLocale") || navigator.language);
  const t = (key, vars = {}) => String(
    localePack.dictionaries[locale]?.[key] || localePack.dictionaries.en[key] || key,
  ).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`);

  const SAVE_KEY = "animalSanctuaryLoopSaveV1";
  const STYLE_IDS = ["starter", "prism", "moon"];
  const defaultSave = () => ({
    unlocked: 1,
    stars: {},
    selectedStyle: "starter",
    ownedStyles: ["starter"],
    tutorialSeen: false,
  });

  function normalizeSave(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const stars = {};
    if (source.stars && typeof source.stars === "object") {
      for (const [key, value] of Object.entries(source.stars)) {
        const stage = Math.trunc(Number(key));
        const score = Math.max(0, Math.min(3, Math.trunc(Number(value))));
        if (Number.isFinite(stage) && stage >= 1 && stage <= 30 && score) stars[stage] = score;
      }
    }
    const ownedStyles = Array.isArray(source.ownedStyles)
      ? [...new Set(source.ownedStyles.filter((id) => STYLE_IDS.includes(id)))]
      : ["starter"];
    if (!ownedStyles.includes("starter")) ownedStyles.unshift("starter");
    const selectedStyle = ownedStyles.includes(source.selectedStyle) ? source.selectedStyle : "starter";
    return {
      unlocked: Math.max(1, Math.min(30, Math.trunc(Number(source.unlocked)) || 1)),
      stars,
      selectedStyle,
      ownedStyles,
      tutorialSeen: source.tutorialSeen === true,
    };
  }

  function readSave() {
    try {
      return normalizeSave(JSON.parse(storage.get(SAVE_KEY) || "null"));
    } catch {
      return defaultSave();
    }
  }

  let save = readSave();
  const persist = () => storage.set(SAVE_KEY, JSON.stringify(save));

  const chapters = ["chapter1", "chapter2", "chapter3", "chapter4", "chapter5", "chapter6"];
  const stages = Array.from({ length: 30 }, (_, index) => {
    const number = index + 1;
    const chapter = Math.floor(index / 5);
    const step = index % 5;
    return {
      n: number,
      chapter,
      target: chapter === 0 ? 12 + step * 2 : 18 + chapter * 4 + step * 2,
      time: 112 - chapter * 5 - step * 2,
      hunters: 1 + Math.floor(index / 6),
      rescue: chapter === 1 ? 1 + (step >= 2 ? 1 : 0) : chapter === 5 ? 1 : 0,
      storm: chapter === 2 || chapter === 5,
      rival: chapter === 3 || chapter === 5,
      seals: chapter === 4 ? 2 + (step >= 2 ? 1 : 0) : chapter === 5 ? 3 : 0,
      guardian: number % 5 === 0,
    };
  });

  const styleData = {
    starter: { name: "styleStarter", cost: 0, colors: ["#ffe36c", "#36d8ff"] },
    prism: { name: "stylePrism", cost: 15, colors: ["#ff70d4", "#65f7ff"] },
    moon: { name: "styleMoon", cost: 25, colors: ["#d8e7ff", "#8c7cff"] },
  };

  const staticText = [...document.querySelectorAll("[data-t]")];
  const assistiveText = [...document.querySelectorAll("[data-ta]")];
  let run = null;
  let currentScreen = "loading";

  function objectiveFor(stage) {
    if (stage.seals) return t("objectiveSeals", { percent: stage.target, count: stage.seals });
    if (stage.rescue) return t("objectiveRescue", { percent: stage.target, count: stage.rescue });
    return t("objectiveRestore", { percent: stage.target });
  }

  function applyLocale() {
    document.documentElement.lang = locale;
    $("locale").value = locale;
    $("lobbyReturn").href = `/${routeSegments[locale]}/`;
    staticText.forEach((element) => { element.textContent = t(element.dataset.t); });
    assistiveText.forEach((element) => element.setAttribute("aria-label", t(element.dataset.ta)));
    document.title = `${t("title")} | WeightPlay Internal Trial`;
    renderMainProgress();
    renderStage();
    renderAtelier();
    if (run) updateBattleHud(true);
  }

  function renderMainProgress() {
    $("mainProgress").textContent = `${Object.keys(save.stars).length} / 30`;
  }

  function showScreen(name) {
    currentScreen = name;
    document.body.dataset.screen = name;
    $("mainGroup").hidden = name !== "main";
    $("stage").hidden = name !== "stage";
    $("battle").hidden = name !== "battle";
    if (name !== "battle") stopLoop();
    if (name === "stage") {
      renderStage();
      requestAnimationFrame(centerCurrentStage);
    }
  }

  function markCentered(index) {
    const cards = [...$("stageRail").querySelectorAll(".stage-card")];
    let chosen = cards.find((card) => Number(card.dataset.index) === Number(index));
    if (!chosen) {
      const railRect = $("stageRail").getBoundingClientRect();
      const center = railRect.left + railRect.width / 2;
      chosen = cards.reduce((best, card) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - center);
        return !best || distance < best.distance ? { card, distance } : best;
      }, null)?.card;
    }
    cards.forEach((card) => {
      const selected = card === chosen;
      card.classList.toggle("centered", selected);
      if (selected) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
  }

  function renderStage() {
    const rail = $("stageRail");
    const previous = rail.scrollLeft;
    rail.replaceChildren(...stages.map((stage, index) => {
      const button = document.createElement("button");
      const locked = stage.n > save.unlocked;
      button.type = "button";
      button.className = `stage-card${locked ? " locked" : ""}`;
      button.dataset.stage = String(stage.n);
      button.dataset.index = String(index);
      button.dataset.stageIndex = String(index);
      button.setAttribute("aria-disabled", locked ? "true" : "false");
      const rule = objectiveFor(stage);
      const earned = Number(save.stars[stage.n]) || 0;
      button.setAttribute("aria-label", `${t(chapters[stage.chapter])}, ${stage.n}, ${rule}`);
      button.innerHTML = `<small>${t(chapters[stage.chapter])}</small><strong>${stage.n}</strong><span>${rule}</span><small>${"★".repeat(earned)}${"☆".repeat(3 - earned)}</small>`;
      button.addEventListener("click", () => {
        if (stage.n > save.unlocked) {
          $("stageHint").textContent = t("stageLocked");
          return;
        }
        startBattle(index);
      });
      return button;
    }));
    rail.scrollLeft = previous;
    $("stageProgress").textContent = `${save.unlocked} / 30`;
    requestAnimationFrame(() => markCentered(null));
  }

  function centerCurrentStage() {
    const index = Math.min(save.unlocked, 30) - 1;
    const card = $("stageRail").querySelector(`[data-index="${index}"]`);
    card?.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    requestAnimationFrame(() => markCentered(index));
  }

  $("stageRail").addEventListener("wonder:stage-snap", (event) => markCentered(event.detail?.index));

  function renderAtelier() {
    $("trailStyles").replaceChildren(...Object.entries(styleData).map(([id, style]) => {
      const owned = save.ownedStyles.includes(id);
      const selected = save.selectedStyle === id;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `trail-style${selected ? " selected" : ""}`;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.innerHTML = `<span class="trail-swatch" style="color:${style.colors[0]};background:linear-gradient(90deg,${style.colors.join(",")})"></span><strong>${t(style.name)}</strong><small>${selected ? t("styleSelected") : owned ? t("styleOwned") : t("styleCost", { cost: style.cost })}</small>`;
      button.addEventListener("click", () => chooseStyle(id));
      return button;
    }));
  }

  function chooseStyle(id) {
    if (save.ownedStyles.includes(id)) {
      save.selectedStyle = id;
      persist();
      renderAtelier();
      return;
    }
    const cost = styleData[id].cost;
    if (!window.WeightPlayWallet?.spendDiamonds?.(cost)) {
      $("atelierFeedback").textContent = t("noDiamonds");
      return;
    }
    save.ownedStyles.push(id);
    save.selectedStyle = id;
    persist();
    renderAtelier();
    $("atelierFeedback").textContent = t("styleBought");
    window.WonderSound?.play?.("success");
  }

  document.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-tab]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });
    $("missionsTab").hidden = button.dataset.tab !== "missions";
    $("atelierTab").hidden = button.dataset.tab !== "atelier";
  }));

  $("start").addEventListener("click", () => showScreen("stage"));
  $("stageBack").addEventListener("click", () => showScreen("main"));
  $("locale").addEventListener("change", (event) => {
    locale = canonicalLocale(event.target.value);
    storage.set("wonderLocale", locale);
    applyLocale();
  });
  window.addEventListener("wonder:locale-change", (event) => {
    const next = canonicalLocale(event.detail?.locale || event.detail?.actualLocale);
    if (next !== locale) {
      locale = next;
      applyLocale();
    }
  });

  const GRID = 48;
  const TOTAL = GRID * GRID;
  const canvas = $("arena");
  const ctx = canvas.getContext("2d");
  const landCanvas = document.createElement("canvas");
  const landCtx = landCanvas.getContext("2d");
  landCanvas.width = canvas.width;
  landCanvas.height = canvas.height;
  const images = {};
  const imageSources = {
    player: "../../assets/weightplay-character-spark-paw-fox-cutout.webp",
    hunter: "../../assets/animal-crystal-survivor-shadow-fox-v2.webp",
    guardian: "../../assets/animal-crystal-survivor-boss-eclipse-colossus.webp",
    beacon: "../../assets/animal-moonlight-heist-marker-objective.webp",
    seal: "../../assets/animal-crystal-survivor-xp-crystal.webp",
  };
  let raf = 0;
  let lastTime = 0;
  let lastHud = "";

  const indexFor = (x, y) => Math.max(0, Math.min(GRID - 1, Math.floor(y))) * GRID
    + Math.max(0, Math.min(GRID - 1, Math.floor(x)));
  const pointFor = (index) => ({ x: index % GRID, y: Math.floor(index / GRID) });
  const territoryCount = () => run ? run.owned.reduce((sum, value) => sum + value, 0) : 0;
  const territoryPercent = () => territoryCount() / TOTAL * 100;

  function makeOwned() {
    const owned = new Uint8Array(TOTAL);
    for (let y = 0; y < GRID; y += 1) {
      for (let x = 0; x < GRID; x += 1) {
        if ((x - 24) ** 2 + (y - 24) ** 2 <= 28) owned[y * GRID + x] = 1;
      }
    }
    return owned;
  }

  function createMarkers(count, type) {
    return Array.from({ length: count }, (_, index) => ({
      type,
      x: 8 + ((index * 13 + (type === "seal" ? 11 : 7)) % 32),
      y: 8 + ((index * 19 + (type === "seal" ? 5 : 11)) % 32),
      done: false,
    }));
  }

  function startBattle(index) {
    const stageIndex = Math.max(0, Math.min(29, Math.trunc(index)));
    const stage = stages[stageIndex];
    run = {
      stageIndex,
      stage,
      owned: makeOwned(),
      trail: new Set(),
      player: { x: 29.1, y: 24, dx: 0, dy: 0 },
      anchor: { x: 29.1, y: 24 },
      hearts: 3,
      time: stage.time,
      hunters: Array.from({ length: stage.hunters + (stage.guardian ? 1 : 0) }, (_, hunterIndex) => ({
        x: hunterIndex % 2 ? 7 : 41,
        y: 8 + (hunterIndex * 11) % 32,
        speed: stage.guardian && hunterIndex === stage.hunters ? 5 : 2.15 + stage.chapter * 0.17,
        guardian: stage.guardian && hunterIndex === stage.hunters,
        angle: 0,
      })),
      markers: [...createMarkers(stage.rescue, "beacon"), ...createMarkers(stage.seals, "seal")],
      rescued: 0,
      seals: 0,
      paused: false,
      finished: false,
      stormClock: 0,
      rivalClock: 0,
      rivalMarks: [],
    };
    $("leave").hidden = true;
    $("tutorial").hidden = true;
    $("result").hidden = true;
    $("battleLive").hidden = false;
    $("battleLive").inert = false;
    showScreen("battle");
    redrawLand();
    updateBattleHud(true);
    $("feedback").textContent = "";
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
    window.WonderSound?.play?.("start");
    if (!save.tutorialSeen) requestAnimationFrame(() => openTutorial(false));
  }

  function stopLoop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function resumeLoop() {
    if (!run || run.finished || run.paused || raf) return;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function updateBattleHud(force = false) {
    if (!run) return;
    const restored = Math.round(territoryPercent());
    const key = `${run.hearts}|${Math.ceil(run.time)}|${restored}|${locale}|${run.rescued}|${run.seals}`;
    if (!force && key === lastHud) return;
    lastHud = key;
    $("missionLabel").textContent = `${t(chapters[run.stage.chapter])} · ${run.stage.n}/30`;
    $("progressValue").textContent = `${restored}%`;
    $("heartsValue").textContent = "♥".repeat(run.hearts);
    $("timeValue").textContent = Math.max(0, Math.ceil(run.time));
    $("objective").textContent = objectiveFor(run.stage);
  }

  function redrawLand() {
    if (!run) return;
    const size = landCanvas.width / GRID;
    landCtx.clearRect(0, 0, landCanvas.width, landCanvas.height);
    landCtx.fillStyle = "#25cba6a6";
    for (let index = 0; index < TOTAL; index += 1) {
      if (!run.owned[index]) continue;
      const { x, y } = pointFor(index);
      landCtx.fillRect(x * size, y * size, size + 0.5, size + 0.5);
    }
  }

  function checkMarkers() {
    const seals = run.markers.filter((marker) => marker.type === "seal");
    for (const marker of run.markers) {
      if (marker.done || !run.owned[indexFor(marker.x, marker.y)]) continue;
      if (marker.type === "seal") {
        if (seals.find((candidate) => !candidate.done) !== marker) continue;
        marker.done = true;
        run.seals += 1;
      } else {
        marker.done = true;
        run.rescued += 1;
      }
    }
  }

  function enclosedFill() {
    const blocked = new Uint8Array(TOTAL);
    for (let index = 0; index < TOTAL; index += 1) {
      blocked[index] = run.owned[index] || run.trail.has(index) ? 1 : 0;
    }
    const seen = new Uint8Array(TOTAL);
    const components = [];
    for (let start = 0; start < TOTAL; start += 1) {
      if (blocked[start] || seen[start]) continue;
      const queue = [start];
      const items = [];
      let touchesEdge = false;
      seen[start] = 1;
      for (let cursor = 0; cursor < queue.length; cursor += 1) {
        const index = queue[cursor];
        const { x, y } = pointFor(index);
        items.push(index);
        if (x === 0 || y === 0 || x === GRID - 1 || y === GRID - 1) touchesEdge = true;
        for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
          if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID) continue;
          const next = ny * GRID + nx;
          if (!blocked[next] && !seen[next]) {
            seen[next] = 1;
            queue.push(next);
          }
        }
      }
      components.push({ items, touchesEdge });
    }
    let filled = 0;
    for (const component of components) {
      if (component.touchesEdge) continue;
      for (const index of component.items) {
        if (!run.owned[index]) {
          run.owned[index] = 1;
          filled += 1;
        }
      }
    }
    for (const index of run.trail) {
      if (!run.owned[index]) {
        run.owned[index] = 1;
        filled += 1;
      }
    }
    run.trail.clear();
    run.anchor = { x: run.player.x, y: run.player.y };
    checkMarkers();
    redrawLand();
    $("feedback").textContent = t("loopClosed");
    window.WonderSound?.play?.("success");
    return filled;
  }

  function cutTrail() {
    if (!run || !run.trail.size || run.finished) return false;
    run.hearts -= 1;
    run.trail.clear();
    run.player.x = run.anchor.x;
    run.player.y = run.anchor.y;
    run.player.dx = 0;
    run.player.dy = 0;
    $("feedback").textContent = t("trailCut");
    window.WonderSound?.play?.("fail");
    if (run.hearts <= 0) finish(false);
    return true;
  }

  function erodeRivalClaim() {
    const candidates = [];
    for (let index = 0; index < TOTAL; index += 1) {
      if (!run.owned[index]) continue;
      const { x, y } = pointFor(index);
      if ((x - 24) ** 2 + (y - 24) ** 2 > 18) candidates.push(index);
    }
    run.rivalMarks = [];
    for (let count = 0; count < Math.min(18, candidates.length); count += 1) {
      const slot = Math.floor(Math.random() * candidates.length);
      const index = candidates.splice(slot, 1)[0];
      run.owned[index] = 0;
      run.rivalMarks.push(index);
    }
    redrawLand();
  }

  function update(dt) {
    if (!run || run.paused || run.finished) return;
    run.time -= dt;
    run.stormClock += dt;
    run.rivalClock += dt;
    if (run.time <= 0) {
      run.time = 0;
      finish(false);
      return;
    }
    const player = run.player;
    const speed = 7.1 + run.stage.chapter * 0.12;
    if (player.dx || player.dy) {
      player.x = Math.max(0.6, Math.min(GRID - 0.6, player.x + player.dx * speed * dt));
      player.y = Math.max(0.6, Math.min(GRID - 0.6, player.y + player.dy * speed * dt));
      const index = indexFor(player.x, player.y);
      const inside = Boolean(run.owned[index]);
      if (!inside) run.trail.add(index);
      else if (run.trail.size > 1) enclosedFill();
    }

    if (run.stage.storm && run.stormClock > 3.4) {
      run.stormClock = 0;
      const turn = Math.sin(performance.now() / 700) >= 0 ? 0.2 : -0.2;
      const dx = player.dx + turn;
      const dy = player.dy - turn;
      const length = Math.hypot(dx, dy) || 1;
      player.dx = dx / length;
      player.dy = dy / length;
    }

    for (const hunter of run.hunters) {
      let target = player;
      if (run.trail.size) {
        let nearest = null;
        let best = Infinity;
        for (const index of run.trail) {
          const point = pointFor(index);
          const distance = (point.x - hunter.x) ** 2 + (point.y - hunter.y) ** 2;
          if (distance < best) {
            nearest = point;
            best = distance;
          }
        }
        if (nearest) target = nearest;
      }
      const dx = target.x - hunter.x;
      const dy = target.y - hunter.y;
      const length = Math.hypot(dx, dy) || 1;
      hunter.x += dx / length * hunter.speed * dt;
      hunter.y += dy / length * hunter.speed * dt;
      hunter.angle = Math.atan2(dy, dx);
      if (run.trail.size && Math.hypot(hunter.x - target.x, hunter.y - target.y) < 0.7) {
        cutTrail();
        break;
      }
    }

    if (run.stage.rival && run.rivalClock > 6.2) {
      run.rivalClock = 0;
      erodeRivalClaim();
    }

    if (
      territoryPercent() >= run.stage.target
      && run.rescued >= run.stage.rescue
      && run.seals >= run.stage.seals
    ) finish(true);
    updateBattleHud();
  }

  function drawImageCentered(image, x, y, size, rotation = 0, glow = "") {
    if (!image?.complete || !image.naturalWidth) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = Math.max(10, size * 0.42);
    }
    ctx.drawImage(image, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  function draw() {
    if (!run) return;
    const width = canvas.width;
    const height = canvas.height;
    const size = width / GRID;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(landCanvas, 0, 0);

    if (run.stage.storm) {
      ctx.fillStyle = "rgba(67,205,255,.12)";
      const offset = (performance.now() / 40) % 120;
      for (let x = -120; x < width + 120; x += 120) ctx.fillRect(x + offset, 0, 24, height);
    }
    if (run.rivalMarks.length) {
      ctx.fillStyle = "rgba(255,74,107,.32)";
      for (const index of run.rivalMarks) {
        const point = pointFor(index);
        ctx.fillRect(point.x * size, point.y * size, size, size);
      }
    }

    const colors = styleData[save.selectedStyle].colors;
    if (run.trail.size) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = colors[0];
      ctx.shadowColor = colors[1];
      ctx.shadowBlur = 18;
      ctx.lineWidth = 11;
      ctx.beginPath();
      let first = true;
      for (const index of run.trail) {
        const point = pointFor(index);
        const x = (point.x + 0.5) * size;
        const y = (point.y + 0.5) * size;
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    const seals = run.markers.filter((marker) => marker.type === "seal");
    for (const marker of run.markers) {
      if (marker.done) continue;
      const active = marker.type !== "seal" || seals.find((candidate) => !candidate.done) === marker;
      ctx.globalAlpha = active ? 1 : 0.42;
      drawImageCentered(
        marker.type === "seal" ? images.seal : images.beacon,
        marker.x * size,
        marker.y * size,
        3.1 * size,
      );
      ctx.globalAlpha = 1;
      if (marker.type === "seal") {
        ctx.fillStyle = "#fff";
        ctx.font = `900 ${Math.max(12, size)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(String(seals.indexOf(marker) + 1), marker.x * size, (marker.y + 0.4) * size);
      }
    }

    for (const hunter of run.hunters) {
      drawImageCentered(
        hunter.guardian ? images.guardian : images.hunter,
        hunter.x * size,
        hunter.y * size,
        (hunter.guardian ? 5.4 : 4.2) * size,
        hunter.angle + Math.PI / 2,
        hunter.guardian ? "#ff4b7d" : "#9d62ff",
      );
    }
    drawImageCentered(
      images.player,
      run.player.x * size,
      run.player.y * size,
      4.4 * size,
      Math.atan2(run.player.dy, run.player.dx) + Math.PI / 2,
      "#64f9df",
    );
  }

  function frame(now) {
    raf = 0;
    if (!run || run.finished || run.paused) return;
    const dt = Math.min(0.04, (now - lastTime) / 1000 || 0);
    lastTime = now;
    update(dt);
    draw();
    if (!run.finished && !run.paused) raf = requestAnimationFrame(frame);
  }

  function setDirection(dx, dy) {
    if (!run || run.paused || run.finished) return;
    const length = Math.hypot(dx, dy) || 1;
    run.player.dx = dx / length;
    run.player.dy = dy / length;
  }

  function pointDirection(event) {
    if (!run) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * GRID;
    const y = (event.clientY - rect.top) / rect.height * GRID;
    setDirection(x - run.player.x, y - run.player.y);
  }

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    canvas.setPointerCapture?.(event.pointerId);
    pointDirection(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (event.buttons || event.pointerType === "touch") pointDirection(event);
  });
  const keyDirections = {
    ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
    ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
    ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
    ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
  };
  window.addEventListener("keydown", (event) => {
    if (keyDirections[event.key] && currentScreen === "battle" && !activeModal()) {
      event.preventDefault();
      setDirection(...keyDirections[event.key]);
    }
    if (event.key === "Escape" && !event.defaultPrevented && currentScreen === "battle" && !activeModal()) openLeave();
  });
  const dirs = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  document.querySelectorAll("[data-dir]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      setDirection(...dirs[button.dataset.dir]);
    });
  });

  let modalReturnFocus = null;
  function activeModal() {
    return [$("leave"), $("tutorial"), $("result")].find((modal) => !modal.hidden) || null;
  }

  function modalButtons(modal) {
    return [...modal.querySelectorAll("button:not([hidden]):not(:disabled)")];
  }

  function openModal(modal, focusTarget) {
    modalReturnFocus = document.activeElement;
    if (run) run.paused = true;
    stopLoop();
    modal.hidden = false;
    $("battleLive").inert = true;
    requestAnimationFrame(() => (focusTarget || modalButtons(modal)[0])?.focus());
  }

  function closeModal(modal, restoreFocus = true) {
    modal.hidden = true;
    $("battleLive").inert = false;
    if (run && !run.finished) {
      run.paused = false;
      resumeLoop();
    }
    if (restoreFocus) (modalReturnFocus?.isConnected ? modalReturnFocus : $("battleBack"))?.focus();
    modalReturnFocus = null;
  }

  document.addEventListener("keydown", (event) => {
    const modal = activeModal();
    if (!modal) return;
    if (event.key === "Tab") {
      const buttons = modalButtons(modal);
      if (!buttons.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "Escape" && modal === $("leave")) {
      event.preventDefault();
      closeModal(modal);
    }
  });

  function openTutorial(markSeenOnClose = true) {
    if (!run || run.finished) return;
    $("tutorial").dataset.markSeen = markSeenOnClose ? "true" : "false";
    openModal($("tutorial"), $("tutorialDone"));
  }

  function closeTutorial() {
    save.tutorialSeen = true;
    persist();
    closeModal($("tutorial"), true);
  }

  function openLeave() {
    if (!run || run.finished || activeModal()) return;
    openModal($("leave"), $("continueBattle"));
  }

  function finish(won) {
    if (!run || run.finished) return;
    run.finished = true;
    run.paused = true;
    stopLoop();
    const restored = Math.round(territoryPercent());
    const remaining = Math.max(0, Math.ceil(run.time));
    const stars = won ? 1 + (remaining > run.stage.time * 0.25 ? 1 : 0) + (run.hearts === 3 ? 1 : 0) : 0;
    if (won) {
      save.stars[run.stage.n] = Math.max(Number(save.stars[run.stage.n]) || 0, stars);
      save.unlocked = Math.max(save.unlocked, Math.min(30, run.stage.n + 1));
      persist();
    }
    $("resultKicker").textContent = won ? `${t("restored")} ${restored}%` : t("missionFailed");
    $("resultTitle").textContent = t(won ? "missionComplete" : "missionFailed");
    $("resultText").textContent = objectiveFor(run.stage);
    $("resultStats").innerHTML = `<span><b>${t("restored")}</b><strong>${restored}%</strong></span><span><b>${t("rescued")}</b><strong>${run.rescued + run.seals}</strong></span><span><b>${t("stars")}</b><strong>${"★".repeat(stars)}${"☆".repeat(3 - stars)}</strong></span>`;
    $("nextMission").hidden = !won || run.stage.n >= 30;
    $("result").hidden = false;
    $("battleLive").hidden = true;
    $("battleLive").inert = true;
    requestAnimationFrame(() => (won && !$("nextMission").hidden ? $("nextMission") : $("retry")).focus());
    window.WonderSound?.play?.(won ? "success" : "fail");
  }

  $("battleBack").addEventListener("click", openLeave);
  $("battleHelp").addEventListener("click", () => openTutorial(true));
  $("tutorialDone").addEventListener("click", closeTutorial);
  $("continueBattle").addEventListener("click", () => closeModal($("leave")));
  $("leaveStage").addEventListener("click", () => {
    $("leave").hidden = true;
    $("battleLive").inert = false;
    run = null;
    showScreen("stage");
  });
  $("retry").addEventListener("click", () => startBattle(run.stageIndex));
  $("resultStage").addEventListener("click", () => {
    $("result").hidden = true;
    $("battleLive").inert = false;
    run = null;
    showScreen("stage");
  });
  $("nextMission").addEventListener("click", () => startBattle(Math.min(29, run.stageIndex + 1)));

  function loadImages() {
    return Promise.all(Object.entries(imageSources).map(([key, src]) => new Promise((resolve) => {
      const image = new Image();
      images[key] = image;
      image.onload = image.onerror = resolve;
      image.src = src;
    })));
  }

  Promise.all([loadImages(), new Promise((resolve) => setTimeout(resolve, 350))]).then(() => {
    $("loadingFill").style.width = "100%";
    setTimeout(() => {
      $("loading").hidden = true;
      showScreen("main");
    }, 160);
  });

  applyLocale();

  window.__animalSanctuaryLoopTest = {
    stages,
    startBattle,
    setDirection,
    advance(seconds, step = 1 / 60) {
      const iterations = Math.ceil(seconds / step);
      for (let index = 0; index < iterations && run && !run.finished; index += 1) update(step);
      draw();
    },
    cutTrail,
    finish,
    setTime(seconds) { if (run) run.time = Number(seconds); },
    setHunterOnTrail() {
      if (!run?.trail.size) return false;
      const target = pointFor([...run.trail][0]);
      Object.assign(run.hunters[0], target);
      return true;
    },
    parkHunters() {
      if (!run) return;
      run.hunters.forEach((hunter, index) => {
        hunter.x = index % 2 ? 1 : GRID - 1;
        hunter.y = index % 2 ? GRID - 1 : 1;
        hunter.speed = 0;
      });
    },
    grantProgress(unlocked = 3) {
      save.unlocked = Math.max(1, Math.min(30, unlocked));
      persist();
      renderStage();
    },
    resetSave() {
      save = defaultSave();
      persist();
      applyLocale();
    },
    snapshot() {
      return {
        locale,
        screen: currentScreen,
        save: JSON.parse(JSON.stringify(save)),
        run: run && {
          stageIndex: run.stageIndex,
          hearts: run.hearts,
          time: run.time,
          rescued: run.rescued,
          seals: run.seals,
          trail: [...run.trail],
          restored: territoryCount(),
          player: { ...run.player },
          hunters: run.hunters.map((hunter) => ({ ...hunter })),
          paused: run.paused,
          finished: run.finished,
        },
      };
    },
  };
}());
