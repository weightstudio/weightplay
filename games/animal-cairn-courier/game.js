(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const locales = window.ANIMAL_CAIRN_COURIER_LOCALES || {};
  const routeLocale = window.__WEIGHTPLAY_ROUTE_LOCALE__ && locales[window.__WEIGHTPLAY_ROUTE_LOCALE__] ? window.__WEIGHTPLAY_ROUTE_LOCALE__ : "en";
  const fallback = {
    loading: "Waking the trail…", title: "Cairn Courier", kicker: "A calm support-order puzzle", intro: "Read the trail note, then build a safe cairn from base to cap.",
    start: "Build Stage 1", choose: "Choose a trail", stagesV7: "Trail progress: {current} / {total}", roundV7: "Stage {n} / {total}",
    stackLabel: "Current cairn", chooseStone: "Choose a stone", selected: "{n} selected", check: "Check the cairn", clear: "Clear stack", reset: "Restart stage",
    wrong: "That stack breaks the visible support rule. It was cleared so you can try again.", correct: "The cairn is stable and the trail is safe.", waiting: "Keep building, then check the support rule.",
    resultTitle: "A steady trail", resultPartial: "Cairn settled", resultText: "{count} / {total} stages settled · picks this visit: {picks}", next: "Next stage", map: "Trail map", home: "Back to menu",
    settings: "Settings", soundOn: "Sound: On", soundOff: "Sound: Off", language: "Language", best: "Best picks", noBest: "Not yet", back: "Back", 
    rule: "Rule", checkpoint: "Checkpoint", locked: "Locked", open: "Open", complete: "Complete", unavailable: "Unavailable",
    supportOrder: "Place each support before the stone it carries.", pairRule: "Keep each marked support pair together.", windRule: "Alternate the trail materials; base starts and cap finishes.", weightRule: "Keep the cairn's center within the stated weight window.", relayRule: "Pass the courier marker through the relay before the cap.", finaleRule: "Meet every visible support, relay, and balance condition.",
    stoneBase: "Base", stoneMiddle: "Middle", stoneCap: "Cap", stoneAnchor: "Anchor", stoneBridge: "Bridge", stoneMarker: "Courier marker", 
    stageNote: "Read the note, choose every displayed stone once, then check.",
    detail: "{rule} · {count} stones · {status}"
  };
  const copy = (key, vars = {}) => {
    const table = locales[state?.locale || routeLocale] || locales.en || {};
    let value = table[key] || fallback[key] || key;
    Object.entries(vars).forEach(([name, val]) => { value = value.replaceAll(`{${name}}`, String(val)); });
    return value;
  };
  const stoneCatalog = {
    base: { key: "stoneBase", mark: "◒", group: "earth", weight: 1 },
    middle: { key: "stoneMiddle", mark: "◓", group: "stone", weight: 2 },
    cap: { key: "stoneCap", mark: "✦", group: "summit", weight: 3 },
    anchor: { key: "stoneAnchor", mark: "⬟", group: "earth", weight: 2 },
    bridge: { key: "stoneBridge", mark: "◇", group: "wind", weight: 1 },
    marker: { key: "stoneMarker", mark: "✧", group: "wind", weight: 1 }
  };
  const before = (...pairs) => ({ mustBefore: pairs });
  const stage = (id, title, arc, mechanic, stones, solution, rules = {}) => ({ id, title, arc, mechanic, stones, solution, checkpoint: id % 5 === 0, ...rules });

  const STAGES = [
    stage(1, "Base Camp", "Base and Cap", "support-order", ["base", "middle", "cap"], ["base", "middle", "cap"], { ...before(["base", "middle"], ["middle", "cap"]) }),
    stage(2, "Anchor Point", "Base and Cap", "support-order", ["base", "anchor", "cap"], ["base", "anchor", "cap"], { ...before(["base", "anchor"], ["anchor", "cap"]) }),
    stage(3, "Wind Shelf", "Base and Cap", "support-order", ["base", "bridge", "middle", "cap"], ["base", "bridge", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "middle"], ["middle", "cap"]) }),
    stage(4, "Courier’s Mark", "Base and Cap", "support-order", ["base", "marker", "anchor", "cap"], ["base", "marker", "anchor", "cap"], { ...before(["base", "marker"], ["marker", "anchor"], ["anchor", "cap"]) }),
    stage(5, "Ridge Checkpoint", "Base and Cap", "support-order", ["base", "bridge", "anchor", "middle", "cap"], ["base", "bridge", "anchor", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "anchor"], ["anchor", "middle"], ["middle", "cap"]), checkpointRule: "base, bridge, anchor, then the cap route" }),

    stage(6, "Twin Supports", "Paired Supports", "paired-support", ["base", "middle", "anchor", "bridge", "cap"], ["base", "middle", "anchor", "bridge", "cap"], { pairs: [["base", "middle"], ["anchor", "bridge"]] }),
    stage(7, "Split Supports", "Paired Supports", "paired-support", ["base", "anchor", "middle", "bridge", "cap"], ["base", "anchor", "middle", "bridge", "cap"], { pairs: [["base", "anchor"], ["middle", "bridge"]] }),
    stage(8, "Cross Brace", "Paired Supports", "paired-support", ["base", "bridge", "anchor", "middle", "cap"], ["base", "bridge", "anchor", "middle", "cap"], { pairs: [["base", "bridge"], ["anchor", "middle"]] }),
    stage(9, "Two Safe Shelves", "Paired Supports", "paired-support", ["base", "middle", "bridge", "anchor", "cap"], ["base", "middle", "bridge", "anchor", "cap"], { pairs: [["base", "middle"], ["bridge", "anchor"]] }),
    stage(10, "Beaver’s Pair Check", "Paired Supports", "paired-support", ["base", "anchor", "bridge", "marker", "middle", "cap"], ["base", "anchor", "bridge", "marker", "middle", "cap"], { pairs: [["base", "anchor"], ["bridge", "marker"]], checkpointRule: "both marked pairs must stay together" }),

    stage(11, "First Gust", "Wind and Material", "wind-shift", ["base", "bridge", "anchor", "marker", "cap"], ["base", "bridge", "anchor", "marker", "cap"], { noAdjacentGroup: true }),
    stage(12, "Cool Ridge", "Wind and Material", "wind-shift", ["base", "middle", "bridge", "anchor", "cap"], ["base", "middle", "bridge", "anchor", "cap"], { noAdjacentGroup: true }),
    stage(13, "Crosswind", "Wind and Material", "wind-shift", ["base", "bridge", "middle", "marker", "cap"], ["base", "bridge", "middle", "marker", "cap"], { noAdjacentGroup: true }),
    stage(14, "Quiet Shelf", "Wind and Material", "wind-shift", ["base", "anchor", "bridge", "middle", "cap"], ["base", "bridge", "anchor", "middle", "cap"], { noAdjacentGroup: true }),
    stage(15, "Heron’s Wind Check", "Wind and Material", "wind-shift", ["base", "bridge", "anchor", "marker", "middle", "cap"], ["base", "bridge", "anchor", "marker", "middle", "cap"], { noAdjacentGroup: true, checkpointRule: "no two neighbouring stones share a material" }),

    stage(16, "Light Center", "Weight Windows", "weight-balance", ["base", "middle", "bridge", "cap"], ["base", "middle", "bridge", "cap"], { targetWeight: 3, maxPrefix: 3 }),
    stage(17, "Heavy Center", "Weight Windows", "weight-balance", ["base", "anchor", "middle", "cap"], ["base", "anchor", "middle", "cap"], { targetWeight: 4, maxPrefix: 4 }),
    stage(18, "Balanced Shelf", "Weight Windows", "weight-balance", ["base", "bridge", "anchor", "middle", "cap"], ["base", "bridge", "anchor", "middle", "cap"], { targetWeight: 5, maxPrefix: 5 }),
    stage(19, "Counterweight", "Weight Windows", "weight-balance", ["base", "middle", "anchor", "bridge", "cap"], ["base", "middle", "anchor", "bridge", "cap"], { targetWeight: 5, maxPrefix: 5 }),
    stage(20, "Turtle’s Balance", "Weight Windows", "weight-balance", ["base", "bridge", "anchor", "middle", "marker", "cap"], ["base", "bridge", "anchor", "middle", "marker", "cap"], { targetWeight: 6, maxPrefix: 6, checkpointRule: "the center stays under the ridge limit" }),

    stage(21, "Relay Start", "Courier Relay", "relay", ["base", "marker", "bridge", "middle", "cap"], ["base", "marker", "bridge", "middle", "cap"], { ...before(["base", "marker"], ["marker", "bridge"], ["bridge", "middle"], ["middle", "cap"]) }),
    stage(22, "Relay Fork", "Courier Relay", "relay", ["base", "anchor", "marker", "bridge", "cap"], ["base", "anchor", "marker", "bridge", "cap"], { ...before(["base", "anchor"], ["anchor", "marker"], ["marker", "bridge"], ["bridge", "cap"]) }),
    stage(23, "Long Relay", "Courier Relay", "relay", ["base", "marker", "anchor", "middle", "bridge", "cap"], ["base", "marker", "anchor", "middle", "bridge", "cap"], { ...before(["base", "marker"], ["marker", "anchor"], ["anchor", "middle"], ["middle", "bridge"], ["bridge", "cap"]) }),
    stage(24, "Repair Relay", "Courier Relay", "relay", ["base", "bridge", "marker", "anchor", "middle", "cap"], ["base", "bridge", "marker", "anchor", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "marker"], ["marker", "anchor"], ["anchor", "middle"], ["middle", "cap"]) }),
    stage(25, "Otter’s Relay Check", "Courier Relay", "relay", ["base", "marker", "bridge", "anchor", "middle", "cap"], ["base", "marker", "bridge", "anchor", "middle", "cap"], { ...before(["base", "marker"], ["marker", "bridge"], ["bridge", "anchor"], ["anchor", "middle"], ["middle", "cap"]), checkpointRule: "the courier marker must pass every relay" }),

    stage(26, "Summit Plan", "Summit Contracts", "checkpoint-contract", ["base", "bridge", "anchor", "marker", "middle", "cap"], ["base", "bridge", "anchor", "marker", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "anchor"], ["anchor", "marker"], ["marker", "middle"], ["middle", "cap"]), noAdjacentGroup: true, targetWeight: 6, maxPrefix: 6 }),
    stage(27, "Summit Detour", "Summit Contracts", "checkpoint-contract", ["base", "anchor", "bridge", "middle", "marker", "cap"], ["base", "bridge", "anchor", "middle", "marker", "cap"], { ...before(["base", "anchor"], ["bridge", "middle"], ["middle", "marker"], ["marker", "cap"]), noAdjacentGroup: true, targetWeight: 6, maxPrefix: 6 }),
    stage(28, "Final Bridge", "Summit Contracts", "checkpoint-contract", ["base", "marker", "bridge", "anchor", "middle", "cap"], ["base", "marker", "anchor", "bridge", "middle", "cap"], { ...before(["base", "marker"], ["marker", "anchor"], ["anchor", "bridge"], ["bridge", "middle"], ["middle", "cap"]), pairs: [["marker", "anchor"]], targetWeight: 6, maxPrefix: 6 }),
    stage(29, "Lantern Ridge", "Summit Contracts", "checkpoint-contract", ["base", "bridge", "marker", "anchor", "middle", "cap"], ["base", "bridge", "anchor", "marker", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "anchor"], ["anchor", "marker"], ["marker", "middle"], ["middle", "cap"]), pairs: [["bridge", "anchor"]], noAdjacentGroup: true, targetWeight: 6, maxPrefix: 6 }),
    stage(30, "Riverkeeper’s Cairn", "Summit Contracts", "checkpoint-contract", ["base", "bridge", "anchor", "marker", "middle", "cap"], ["base", "bridge", "anchor", "marker", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "anchor"], ["anchor", "marker"], ["marker", "middle"], ["middle", "cap"]), pairs: [["bridge", "anchor"]], noAdjacentGroup: true, targetWeight: 6, maxPrefix: 6, checkpointRule: "all support, relay, material and weight checks must hold" })
  ];

  const storage = { get(key, fallbackValue = "") { try { return localStorage.getItem(key) ?? fallbackValue; } catch { return fallbackValue; } }, set(key, value) { try { localStorage.setItem(key, value); } catch {} } };
  const STORE_KEY = "weightplay-animal-cairn-courier-v7-campaign-v1";
  const BEST_KEY = "weightplay-animal-cairn-courier-best-v7";
  const state = { locale: routeLocale, round: 0, stack: [], picks: 0, sessionPicks: 0, sound: true, screen: "main", status: "", completed: false };
  let solved = new Set();
  try { const raw = JSON.parse(storage.get(STORE_KEY, "{}")); if (Array.isArray(raw.solved)) raw.solved.filter((n) => Number.isInteger(n) && n >= 1 && n <= 30).forEach((n) => solved.add(n)); } catch {}
  const track = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `animal_cairn_courier_${name}`, stage: state.round + 1, ...data }); };
  const stoneName = (id) => copy(stoneCatalog[id].key);
  const indexOf = (stack, id) => stack.indexOf(id);
  const allBefore = (stack, pairs) => (pairs || []).every(([a, b]) => indexOf(stack, a) >= 0 && indexOf(stack, b) >= 0 && indexOf(stack, a) < indexOf(stack, b));
  const adjacentPairs = (stack, pairs) => (pairs || []).every(([a, b]) => Math.abs(indexOf(stack, a) - indexOf(stack, b)) === 1);
  const alternateGroups = (stack) => stack.slice(0, -1).every((id, i) => stoneCatalog[id].group !== stoneCatalog[stack[i + 1]].group);
  const validate = (plan, stack) => {
    if (stack.length !== plan.stones.length || new Set(stack).size !== stack.length || stack.some((id) => !plan.stones.includes(id))) return false;
    if (stack[0] !== "base" || stack[stack.length - 1] !== "cap") return false;
    if (plan.mustBefore && !allBefore(stack, plan.mustBefore)) return false;
    if (plan.pairs && !adjacentPairs(stack, plan.pairs)) return false;
    if (plan.noAdjacentGroup && !alternateGroups(stack)) return false;
    if (plan.targetWeight !== undefined) {
      const weight = stack.slice(1, -1).reduce((sum, id) => sum + stoneCatalog[id].weight, 0);
      if (weight !== plan.targetWeight) return false;
      const prefix = stack.slice(1, -1).reduce((sum, id) => sum + stoneCatalog[id].weight, 0);
      if (prefix > plan.maxPrefix) return false;
    }
    return true;
  };
  const statusFor = (plan, index) => solved.has(plan.id) ? copy("complete") : index === 0 || solved.has(STAGES[index - 1].id) ? copy("open") : copy("locked");
  const renderStages = () => { const root = $("stageList"); if (!root) return; root.replaceChildren(...STAGES.map((plan, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "stage-card"; const locked = !(index === 0 || solved.has(STAGES[index - 1].id)); button.disabled = locked; button.innerHTML = `<span><strong>${plan.id}. ${plan.title}</strong><small>${plan.arc} · ${copy("detail", { rule: plan.checkpointRule || copy(`${plan.mechanic === "support-order" ? "supportOrder" : plan.mechanic === "paired-support" ? "pairRule" : plan.mechanic === "wind-shift" ? "windRule" : plan.mechanic === "weight-balance" ? "weightRule" : plan.mechanic === "relay" ? "relayRule" : "finaleRule"}`), count: plan.stones.length, status: statusFor(plan, index) })}</small></span><span class="stage-mark" aria-hidden="true">${solved.has(plan.id) ? "✓" : locked ? "🔒" : "→"}</span>`; button.addEventListener("click", () => startRound(index)); return button; })); };
  const renderBattle = () => {
    const plan = STAGES[state.round]; $("roundLabel").textContent = copy("roundV7", { n: plan.id, total: STAGES.length }); $("roundName").textContent = plan.title; $("trailNote").textContent = `${copy("stageNote")} ${plan.checkpointRule ? `${copy("checkpoint")}: ${plan.checkpointRule}` : ""}`;
    $("selectionCount").textContent = `${state.stack.length} / ${plan.stones.length}`;
    $("stack").replaceChildren(...state.stack.map((id, index) => { const stone = stoneCatalog[id]; const node = document.createElement("span"); node.className = "stack-stone"; node.innerHTML = `<b>${index + 1}</b><span aria-hidden="true">${stone.mark}</span><small>${stoneName(id)}</small>`; return node; }));
    $("stoneTray").replaceChildren(...plan.stones.map((id) => { const stone = stoneCatalog[id]; const button = document.createElement("button"); button.type = "button"; button.className = "stone-btn"; button.disabled = state.stack.includes(id); button.setAttribute("aria-label", stoneName(id)); button.innerHTML = `<span class="stone-mark" aria-hidden="true">${stone.mark}</span><span>${stoneName(id)}</span><small>${stone.group} · ${stone.weight}</small>`; button.addEventListener("click", () => pickStone(id)); return button; }));
    $("battleStatus").textContent = state.status ? copy(state.status) : copy("waiting"); $("checkBtn").disabled = state.stack.length !== plan.stones.length; if ($("undoBtn")) $("undoBtn").disabled = state.stack.length === 0;
  };
  const renderResult = () => { const done = solved.size === STAGES.length; $("resultTitle").textContent = done ? copy("resultTitle") : copy("resultPartial"); $("resultText").textContent = copy("resultText", { count: solved.size, total: STAGES.length, picks: state.sessionPicks }); $("resultPrimaryBtn").textContent = done ? copy("map") : copy("next"); $("resultPrimaryBtn").onclick = done ? () => { show("stage"); renderStages(); } : () => startRound(Math.min(STAGES.length - 1, state.round + 1)); $("resultMapBtn").hidden = done; };
  const applyLocale = () => { document.documentElement.lang = state.locale; document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr"; document.querySelectorAll("[data-copy]").forEach((node) => { if (!node.matches("[data-wp-return='main']")) node.textContent = copy(node.dataset.copy); }); if ($("localeSelect")) $("localeSelect").value = state.locale; if ($("soundBtn")) $("soundBtn").textContent = state.sound ? copy("soundOn") : copy("soundOff"); if ($("bestValue")) $("bestValue").textContent = storage.get(BEST_KEY, "") || copy("noBest"); if ($("mainProgress")) $("mainProgress").textContent = copy("stagesV7", { current: solved.size, total: STAGES.length }); if (state.screen === "stage") renderStages(); if (state.screen === "battle") renderBattle(); if (state.screen === "result") renderResult(); };
  const show = (screen) => { state.screen = screen; document.querySelectorAll("[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; }); };
  const startRound = (index) => { if (index > 0 && !solved.has(STAGES[index - 1].id)) return; state.round = Math.max(0, Math.min(STAGES.length - 1, index)); state.stack = []; state.picks = 0; state.status = ""; show("battle"); renderBattle(); track("stage_start"); };
  const pickStone = (id) => { const plan = STAGES[state.round]; if (!plan.stones.includes(id) || state.stack.includes(id) || state.stack.length >= plan.stones.length) return; state.stack.push(id); state.picks += 1; state.sessionPicks += 1; state.status = ""; renderBattle(); track("stone_pick", { stone: id }); };
  const writeProgress = () => storage.set(STORE_KEY, JSON.stringify({ solved: [...solved].sort((a, b) => a - b), updatedAt: new Date().toISOString() }));
  const checkStack = () => { const plan = STAGES[state.round]; const valid = validate(plan, state.stack); track("stack_check", { valid, picks: state.picks, mechanic: plan.mechanic }); if (valid) { solved.add(plan.id); writeProgress(); state.status = "correct"; if (solved.size === STAGES.length) { state.completed = true; const old = Number(storage.get(BEST_KEY, "0")); if (!old || state.sessionPicks < old) storage.set(BEST_KEY, String(state.sessionPicks)); track("campaign_complete", { picks: state.sessionPicks }); } show("result"); renderResult(); } else { state.status = "wrong"; state.stack = []; renderBattle(); } };
  const clearStack = () => { state.stack = []; state.status = "waiting"; renderBattle(); track("stack_clear"); };
  const showSettings = () => { if ($("settingsPanel")) $("settingsPanel").hidden = !$("settingsPanel").hidden; };
  $("startBtn")?.addEventListener("click", () => { show("stage"); renderStages(); track("map_open", { source: "primary" }); }); $("mapBtn")?.addEventListener("click", () => { show("stage"); renderStages(); track("map_open"); }); $("stageBackBtn")?.addEventListener("click", () => { show("main"); applyLocale(); }); $("battleBackBtn")?.addEventListener("click", () => { show("stage"); renderStages(); }); $("resultMapBtn")?.addEventListener("click", () => { show("stage"); renderStages(); }); $("resultHomeBtn")?.addEventListener("click", () => { show("main"); applyLocale(); }); $("checkBtn")?.addEventListener("click", checkStack); $("clearBtn")?.addEventListener("click", clearStack); $("undoBtn")?.addEventListener("click", () => { state.stack.pop(); state.status = "waiting"; renderBattle(); }); ["settingsBtn", "stageSettingsBtn", "battleSettingsBtn"].forEach((id) => $(id)?.addEventListener("click", showSettings)); $("soundBtn")?.addEventListener("click", () => { state.sound = !state.sound; applyLocale(); track("sound", { enabled: state.sound }); }); $("localeSelect")?.addEventListener("change", (event) => { state.locale = locales[event.target.value] ? event.target.value : "en"; storage.set("weightplayLocale", state.locale); applyLocale(); track("locale", { locale: state.locale }); });
  try { const saved = storage.get("weightplayLocale", ""); if (!window.__WEIGHTPLAY_ROUTE_LOCALE__ && saved && locales[saved]) state.locale = saved; } catch {}
  const boot = () => { if ($("loadingPanel")) $("loadingPanel").hidden = true; if ($("mainScreen")) $("mainScreen").hidden = false; applyLocale(); track("main_ready"); };
  window.__ANIMAL_CAIRN_COURIER_TEST__ = { stages: STAGES, validate, startRound, pickStone, checkStack, getState: () => ({ ...state, stack: [...state.stack], solved: [...solved] }) };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
