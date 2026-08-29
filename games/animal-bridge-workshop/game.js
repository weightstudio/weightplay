(function () {
  "use strict";

  const COPY = Object.assign({
    en: {
      eyebrow: "Forest engineering · 9+", title: "Bridge Workshop", lede: "Connect strong anchors, choose a material, then test a safe crossing for your animal crew.", fact1: "3 crossings", fact2: "Build + test", fact3: "Material medals", ready: "3 crossings ready", start: "Start workshop", guideButton: "How to play", guide: "Tap two anchors, choose a beam, rope, or pad, and place the link. Test when the path is connected. If a joint is weak, repair that joint and try again.", soundOn: "Sound: on", soundOff: "Sound: off", back: "Back to Main", place: "Place link", test: "Test crossing", undo: "Undo last", reset: "Reset crossing", beam: "Wood beam", rope: "Vine rope", pad: "Float pad", beamHint: "steady support", ropeHint: "light + flexible", padHint: "water-safe", choose: "Choose two anchors to preview a link.", chooseMaterial: "Choose two anchors and a material.", noStock: "That material is used up. Pick another.", placed: "Link placed. Add another or test the route.", crossing: "Crossing {n} / 3", clear: "Crossing clear", safe: "Safe route!", fail: "Joint needs repair", next: "Next crossing", retry: "Repair and retry", home: "Workshop home", medal: "Medal", complete: "Workshop complete!", completeCopy: "Your crew crossed all three routes. Best medal: {medal}.", successCopy: "The animal crew crossed safely using {count} links.", weakCopy: "First weak joint: {joint}. Add that link, then test again.", goal1: "Connect the three anchors for Pip's crossing.", goal2: "Build a three-link path; the middle joint needs a vine rope.", goal3: "Heavy Moss Shell Taro needs a pad on the first span.", stage1: "Triangle support", stage2: "Windy canyon", stage3: "Heavy cargo", material: "Material", route: "Route", links: "Links", settings: "Settings", language: "Language", coverAlt: "Moon Cap Orla planning a small animal bridge", canvasLabel: "Bridge workshop construction area", materials: "Materials" },
    "zh-Hant": {
      eyebrow: "森林工程 · 9+", title: "動物橋樑工坊", lede: "連起穩固錨點、選好材料，再測試動物隊伍的安全通行。", fact1: "3 段跨越", fact2: "建造＋測試", fact3: "材料獎章", ready: "準備好 3 段跨越", start: "開始工坊", guideButton: "玩法說明", guide: "點兩個錨點，選擇木樑、藤繩或浮板，再放置連結。路線接通後按下測試；若接點脆弱，修好它再試一次。", soundOn: "音效：開", soundOff: "音效：關", back: "返回主畫面", place: "放置連結", test: "測試跨越", undo: "復原上一段", reset: "重設本段", beam: "木樑", rope: "藤繩", pad: "浮板", beamHint: "穩定支撐", ropeHint: "輕巧有彈性", padHint: "安全渡水", choose: "點兩個錨點預覽連結。", chooseMaterial: "先點兩個錨點並選擇材料。", noStock: "這種材料用完了，請換一種。", placed: "連結已放置，可再加一段或測試路線。", crossing: "跨越 {n} / 3", clear: "安全跨越", safe: "路線成功！", fail: "接點需要修理", next: "下一段跨越", retry: "修理後重試", home: "返回工坊", medal: "獎章", complete: "工坊完成！", completeCopy: "隊伍已通過三條路線，最佳獎章：{medal}。", successCopy: "動物隊伍用 {count} 段連結安全通過。", weakCopy: "第一個脆弱接點：{joint}。補上該段再測試。", goal1: "連起三個錨點，讓 Pip 安全通過。", goal2: "建立三段路線；中間接點需要藤繩。", goal3: "重裝 Moss Shell Taro 需要在第一段使用浮板。", stage1: "三角支撐", stage2: "風谷通道", stage3: "重裝貨物", material: "材料", route: "路線", links: "連結", settings: "設定", language: "語言", coverAlt: "Moon Cap Orla 正在規劃小動物橋樑", canvasLabel: "橋樑工坊建造區", materials: "材料選擇" }
  }, window.BRIDGE_WORKSHOP_LOCALES || {});
  const STAGES = [
    { title: "stage1", goal: "goal1", anchors: [[90, 520], [420, 280], [810, 520]], animal: "Pip", required: [[0, 1], [1, 2]], stock: { beam: 2, rope: 1, pad: 0 } },
    { title: "stage2", goal: "goal2", anchors: [[75, 520], [300, 350], [590, 430], [825, 240]], animal: "Panko", required: [[0, 1], [1, 2], [2, 3]], stock: { beam: 2, rope: 1, pad: 1 }, must: { "1-2": "rope" } },
    { title: "stage3", goal: "goal3", anchors: [[90, 460], [420, 240], [810, 460]], animal: "Moss Shell Taro", required: [[0, 1], [1, 2]], stock: { beam: 1, rope: 1, pad: 1 }, must: { "0-1": "pad" } }
  ];
  const $ = (selector) => document.querySelector(selector);
  const requestedLocale = new URLSearchParams(location.search).get("lang");
  const state = { locale: COPY[requestedLocale] ? requestedLocale : "en", stage: 0, links: [], selectedAnchor: null, selectedMaterial: "beam", sound: true, medals: loadMedals() };
  const canvas = $("#bridgeCanvas");
  const ctx = canvas.getContext("2d");

  function loadMedals() { try { return JSON.parse(localStorage.getItem("weightplayBridgeWorkshopMedals") || "{}"); } catch (_) { return {}; } }
  function saveMedals() { try { localStorage.setItem("weightplayBridgeWorkshopMedals", JSON.stringify(state.medals)); } catch (_) {} }
  function t(key, values) { let text = COPY[state.locale][key] ?? COPY.en[key] ?? key; Object.entries(values || {}).forEach(([name, value]) => { text = text.replaceAll(`{${name}}`, String(value)); }); return text; }
  function track(name, payload) { window.WonderAnalytics?.track?.(name, { game_id: "animal-bridge-workshop", game_version: "v3", interface_version: 6, ...payload }); }
  function setScreen(name) { $("#mainScreen").classList.toggle("active", name === "main"); $("#battleScreen").classList.toggle("active", name === "battle"); const guide = document.querySelector("[data-wp-game-guide]"); if (guide) guide.hidden = name !== "main"; const reserve = document.querySelector(".battle-ad-reserve"); if (reserve) reserve.hidden = name !== "battle"; }
  function stage() { return STAGES[state.stage]; }
  function edgeKey(a, b) { return `${Math.min(a, b)}-${Math.max(a, b)}`; }
  function localizedMaterialName(material) { return t(material); }
  function applyCopy() {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.title = `${t("title")} | WeightPlay`;
    $("#settingsButton").setAttribute("aria-label", t("settings"));
    $("#locale").setAttribute("aria-label", t("language"));
    $("#mainScreen .poster img").setAttribute("alt", t("coverAlt"));
    $("#bridgeCanvas").setAttribute("aria-label", t("canvasLabel"));
    $(".materials").setAttribute("aria-label", t("materials"));
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("#soundButton").textContent = state.sound ? t("soundOn") : t("soundOff"); $("#mainProgress").textContent = t("ready");
    $("#battleBack").setAttribute("aria-label", t("back"));
    $("#placeButton").textContent = t("place"); $("#testButton").textContent = t("test"); $("#undoButton").textContent = t("undo"); $("#resetButton").textContent = t("reset");
    $("#nextButton").textContent = t("next"); $("#retryButton").textContent = t("retry"); $("#homeButton").textContent = t("home");
    document.querySelector('[data-material="beam"] strong').textContent = t("beam"); document.querySelector('[data-material="beam"] small').textContent = t("beamHint");
    document.querySelector('[data-material="rope"] strong').textContent = t("rope"); document.querySelector('[data-material="rope"] small').textContent = t("ropeHint");
    document.querySelector('[data-material="pad"] strong').textContent = t("pad"); document.querySelector('[data-material="pad"] small').textContent = t("padHint");
    renderStageText(); draw();
  }
  function renderStageText() {
    const current = stage();
    $("#chapterLabel").textContent = t("crossing", { n: state.stage + 1 });
    $("#stageTitle").textContent = t(current.title);
    $("#stageGoal").textContent = t(current.goal);
    $("#instruction").textContent = state.selectedAnchor === null ? t("choose") : t("chooseMaterial");
    $("#beamCount").textContent = current.stock.beam - state.links.filter((link) => link.material === "beam").length;
    $("#ropeCount").textContent = current.stock.rope - state.links.filter((link) => link.material === "rope").length;
    $("#padCount").textContent = current.stock.pad - state.links.filter((link) => link.material === "pad").length;
    document.querySelectorAll(".material").forEach((button) => { button.classList.toggle("selected", button.dataset.material === state.selectedMaterial); button.disabled = current.stock[button.dataset.material] <= state.links.filter((link) => link.material === button.dataset.material).length; });
    $("#placeButton").disabled = state.selectedAnchor === null || !state.previewAnchor || $("#placeButton").disabled && false;
    $("#undoButton").disabled = !state.links.length;
    $("#testButton").disabled = !state.links.length;
  }
  function pointFromEvent(event) { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height }; }
  function nearestAnchor(point) { let best = null; let distance = 52; stage().anchors.forEach((anchor, index) => { const d = Math.hypot(anchor[0] - point.x, anchor[1] - point.y); if (d < distance) { best = index; distance = d; } }); return best; }
  function onCanvasPointer(event) { event.preventDefault(); const hit = nearestAnchor(pointFromEvent(event)); if (hit === null) return; if (state.selectedAnchor === null) { state.selectedAnchor = hit; state.previewAnchor = null; } else if (state.selectedAnchor === hit) { state.selectedAnchor = null; state.previewAnchor = null; } else { state.previewAnchor = hit; } renderStageText(); draw(); }
  function placeLink() {
    if (state.selectedAnchor === null || state.previewAnchor === null || state.previewAnchor === undefined) { $("#feedback").textContent = t("chooseMaterial"); return; }
    const key = edgeKey(state.selectedAnchor, state.previewAnchor); if (state.links.some((link) => link.key === key)) { $("#feedback").textContent = t("placed"); return; }
    const stock = stage().stock[state.selectedMaterial]; const used = state.links.filter((link) => link.material === state.selectedMaterial).length; if (used >= stock) { $("#feedback").textContent = t("noStock"); return; }
    state.links.push({ key, a: state.selectedAnchor, b: state.previewAnchor, material: state.selectedMaterial }); state.selectedAnchor = null; state.previewAnchor = null; $("#feedback").textContent = t("placed"); track("bridge_link_place", { stage: state.stage + 1, material: state.selectedMaterial }); renderStageText(); draw();
  }
  function connected() { const seen = new Set([0]); let changed = true; while (changed) { changed = false; state.links.forEach((link) => { if (seen.has(link.a) && !seen.has(link.b)) { seen.add(link.b); changed = true; } if (seen.has(link.b) && !seen.has(link.a)) { seen.add(link.a); changed = true; } }); } return seen.has(stage().anchors.length - 1); }
  function testCrossing() {
    if (!state.links.length) { $("#feedback").textContent = t("chooseMaterial"); return; }
    const missing = stage().required.find(([a, b]) => !state.links.some((link) => link.key === edgeKey(a, b)));
    const wrongMaterial = Object.entries(stage().must || {}).find(([key, material]) => { const link = state.links.find((item) => item.key === key); return !link || link.material !== material; });
    const good = !missing && !wrongMaterial && connected();
    $("#resultCard").hidden = false; $("#resultCard").classList.toggle("success", good); $("#resultCard").classList.toggle("fail", !good); $("#resultEyebrow").textContent = good ? t("clear") : t("fail"); $("#resultTitle").textContent = good ? t("safe") : t("fail"); $("#medal").textContent = t("medal");
    if (good) { const medal = state.links.length <= stage().required.length ? "Gold" : "Silver"; const previous = state.medals[state.stage] || "Bronze"; state.medals[state.stage] = previous === "Gold" || (previous === "Silver" && medal === "Silver") ? previous : medal; saveMedals(); $("#resultCopy").textContent = t("successCopy", { count: state.links.length }); $("#nextButton").hidden = false; track("bridge_crossing_complete", { stage: state.stage + 1, links: state.links.length, medal: state.medals[state.stage] }); } else { const joint = missing ? edgeKey(missing[0], missing[1]) : wrongMaterial ? `${wrongMaterial[0]} (${localizedMaterialName(wrongMaterial[1])})` : "route"; $("#resultCopy").textContent = t("weakCopy", { joint }); $("#nextButton").hidden = true; track("bridge_crossing_fail", { stage: state.stage + 1, weak_joint: joint }); }
  }
  function start() { state.stage = 0; state.links = []; state.selectedAnchor = null; state.previewAnchor = null; $("#resultCard").hidden = true; $("#nextButton").hidden = false; $("#retryButton").hidden = false; $("#feedback").textContent = ""; setScreen("battle"); renderStageText(); draw(); track("bridge_start", {}); }
  function next() { if (state.stage >= STAGES.length - 1) { const medals = Object.values(state.medals); $("#resultEyebrow").textContent = t("clear"); $("#resultTitle").textContent = t("complete"); $("#resultCopy").textContent = t("completeCopy", { medal: medals.includes("Gold") ? "Gold" : medals.includes("Silver") ? "Silver" : "Bronze" }); $("#nextButton").hidden = true; $("#retryButton").hidden = true; return; } state.stage += 1; state.links = []; state.selectedAnchor = null; state.previewAnchor = null; $("#resultCard").hidden = true; $("#feedback").textContent = ""; renderStageText(); draw(); track("bridge_stage_start", { stage: state.stage + 1 }); }
  function retry() { state.links = []; state.selectedAnchor = null; state.previewAnchor = null; $("#resultCard").hidden = true; $("#feedback").textContent = ""; renderStageText(); draw(); }
  function undo() { const link = state.links.pop(); if (link) { $("#feedback").textContent = t("placed"); renderStageText(); draw(); } }
  function reset() { state.links = []; state.selectedAnchor = null; state.previewAnchor = null; $("#feedback").textContent = ""; renderStageText(); draw(); }
  function draw() {
    if (!ctx || !$("#battleScreen").classList.contains("active")) return;
    const current = stage(); const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height); gradient.addColorStop(0, "#102b4b"); gradient.addColorStop(1, "#071629"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#123956"; ctx.fillRect(0, 520, canvas.width, 180); ctx.fillStyle = "#1a6276"; ctx.fillRect(0, 575, canvas.width, 125);
    ctx.strokeStyle = "#2e8da1"; ctx.lineWidth = 3; for (let x = 0; x < canvas.width; x += 42) { ctx.beginPath(); ctx.moveTo(x, 610); ctx.quadraticCurveTo(x + 20, 590, x + 42, 610); ctx.stroke(); }
    state.links.forEach((link) => { const a = current.anchors[link.a]; const b = current.anchors[link.b]; ctx.strokeStyle = link.material === "beam" ? "#d9a86c" : link.material === "rope" ? "#78d0b0" : "#9ecbff"; ctx.lineWidth = link.material === "pad" ? 24 : 15; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); if (link.material === "rope") { ctx.setLineDash([10, 9]); ctx.strokeStyle = "#d0f0d8"; ctx.lineWidth = 3; ctx.stroke(); ctx.setLineDash([]); } });
    if (state.selectedAnchor !== null && state.previewAnchor !== null && state.previewAnchor !== undefined) { const a = current.anchors[state.selectedAnchor]; const b = current.anchors[state.previewAnchor]; ctx.setLineDash([12, 10]); ctx.strokeStyle = "#ffd27d"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]); }
    current.anchors.forEach((anchor, index) => { ctx.fillStyle = index === 0 ? "#c4a7ff" : index === current.anchors.length - 1 ? "#7de1bc" : "#ffd27d"; ctx.beginPath(); ctx.arc(anchor[0], anchor[1], 24, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#f8fbff"; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = "#071629"; ctx.font = "800 22px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(index + 1), anchor[0], anchor[1]); });
    const animal = current.anchors[0]; ctx.fillStyle = "#c4a7ff"; ctx.beginPath(); ctx.arc(animal[0] + 2, animal[1] - 42, 18, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#071629"; ctx.font = "800 13px system-ui"; ctx.fillText(current.animal, animal[0] + 2, animal[1] - 72);
    const goal = current.anchors[current.anchors.length - 1]; ctx.strokeStyle = "#f8fbff"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(goal[0], goal[1] - 30); ctx.lineTo(goal[0], goal[1] - 78); ctx.stroke(); ctx.fillStyle = "#ff9c8f"; ctx.beginPath(); ctx.moveTo(goal[0], goal[1] - 78); ctx.lineTo(goal[0] + 30, goal[1] - 68); ctx.lineTo(goal[0], goal[1] - 58); ctx.closePath(); ctx.fill();
  }

  canvas.addEventListener("pointerdown", onCanvasPointer); document.querySelectorAll(".material").forEach((button) => button.addEventListener("click", () => { state.selectedMaterial = button.dataset.material; renderStageText(); draw(); })); $("#startButton").addEventListener("click", start); $("#guideButton").addEventListener("click", () => { document.querySelector("[data-wp-game-guide]")?.scrollIntoView({ behavior: "smooth", block: "center" }); }); $("#settingsButton").addEventListener("click", () => { const popover = $("#settingsPopover"); const open = popover.hidden; popover.hidden = !open; $("#settingsButton").setAttribute("aria-expanded", String(open)); }); $("#soundButton").addEventListener("click", () => { state.sound = !state.sound; $("#soundButton").setAttribute("aria-pressed", String(state.sound)); applyCopy(); }); $("#battleBack").addEventListener("click", () => setScreen("main")); $("#placeButton").addEventListener("click", placeLink); $("#testButton").addEventListener("click", testCrossing); $("#undoButton").addEventListener("click", undo); $("#resetButton").addEventListener("click", reset); $("#nextButton").addEventListener("click", next); $("#retryButton").addEventListener("click", retry); $("#homeButton").addEventListener("click", () => setScreen("main")); $("#locale").value = state.locale; $("#locale").addEventListener("change", (event) => { state.locale = event.target.value; applyCopy(); }); applyCopy();
})();
