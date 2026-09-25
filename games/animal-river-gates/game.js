(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const locales = window.RIVER_GATES_LOCALES || {};
  const localeMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const safeStorage = {
    get(key, fallback = "") { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };
  const STORE_KEY = "weightplay-animal-river-gates-v7-campaign-v1";
  const BEST_KEY = "weightplay-animal-river-gates-best-v7";
  const nodes = ["source", "cistern", "gardenA", "gardenB", "waste", "lowerPond"];
  const nodeLabels = { source: "Source", cistern: "Cistern", gardenA: "Garden A", gardenB: "Garden B", waste: "Waste", upperPond: "Upper pond", lowerPond: "Lower pond" };
  const phaseName = (phase) => copy(phase === "even" ? "evenTideBeats" : phase === "odd" ? "oddTideBeats" : "anyTideBeat");
  const fallback = {
    title: "River Gates",
    posterAlt: "A riverkeeper and beaver beside a gated river under lantern light at sunset.",
    loading: "Waking the river…",
    kicker: "Causal flow puzzle",
    world: "Willow river station",
    intro: "Move visible water through the network, protect the reserve, and meet each garden’s demand.",
    start: "Open Stage 1",
    choose: "Choose a stage",
    chapter: "River notebook",
    round: "Network stage",
    check: "Confirm transfer",
    reset: "Restart board",
    undo: "Undo last move",
    close: "Close",
    settings: "Settings",
    sound: "Sound",
    language: "Language",
    on: "On",
    off: "Off",
    back: "Back",
    next: "Next stage",
    nextStageAction: "Next Stage",
    finished: "River settled",
    resultTitle: "The riverkeeper’s plan holds",
    resultLevel: "Stage settled",
    progress: "Stages {current} / {total}",
    best: "Best campaign moves: {best}",
    prompt: "Select a visible channel, preview its delta, then confirm it.",
    wait: "Wait one tide beat",
    waiting: "The tide advanced to beat {beat}.",
    correct: "Every required garden is supplied and the reserve is safe.",
    wrong: "That transfer is legal, but the settlement conditions are not met yet.",
    impossible: "The current board cannot settle: {reason}. Undo or restart.",
    noUndo: "Nothing to undo.",
    selected: "{label}; {detail}",
    actionAccessible: "{label}; {detail}.",
    disabledActionAccessible: "{label}. Unavailable: {reason}.",
    actionPreview: "Preview: from {from} to {to} · {amount} unit",
    actionReady: "Ready to confirm",
    disabled: "Unavailable: {reason}",
    waitDescription: "{phase} · Tide beat {beat}",
    evenTideBeats: "even tide beats",
    oddTideBeats: "odd tide beats",
    anyTideBeat: "any tide beat",
    riverGates: "River gates",
    settlementGardens: "Garden A {a}/{aDemand}, Garden B {b}/{bDemand}",
    settlementReserve: "Cistern {current}/{required}",
    settlementWaste: "Waste {current}/{maximum}",
    settlementOrder: "The delivery order",
    settlementHabitat: "The protected habitat",
    settlementWindow: "The nursery visit window was missed",
    settlementCheckpoint: "The checkpoint condition",
    source: "Source",
    cistern: "Cistern",
    gardenA: "Garden A",
    gardenB: "Garden B",
    waste: "Waste",
    water: "Water",
    demand: "Demand",
    reserve: "Reserve",
    tide: "Tide beat",
    arc: "Arc {arc} · {name}",
    checkpoint: "Checkpoint",
    checkpointRule: "Checkpoint: {rule}",
    solved: "Solved",
    locked: "Locked",
    unlock: "Clear the previous stage naturally to unlock this one.",
    dry: "the source is dry",
    full: "the destination is full",
    phase: "the channel works only on {phase}",
    once: "the one-use channel is spent",
    prerequisite: "a required upstream delivery is missing",
    order: "the displayed delivery order is not ready",
    cutoff: "the inlet closed after the announced beat",
    bridge: "the bridge is closed",
    repair: "Repair the blocked channel (cost: 1 cistern unit)",
    repairDone: "The repair crew restored the channel.",
    noRepair: "Repair requires one stored cistern unit.",
    overflow: "the transfer would overfill the destination",
    capacity: "the route capacity is full",
    noTarget: "the channel has no open destination",
    stageDemand: "Deliver A {a} · B {b}",
    stageReserve: "Keep {label} ≥ {value} · waste ≤ {waste}",
    settlementReserve: "Reserve in {label}: {current}/{required}",
    incomplete: "Transfer accepted; the river is not settled yet.",
    upperPond: "Upper pond",
    lowerPond: "Lower pond",
    noMoves: "No legal action remains. Undo or restart.",
    action: "Transfer",
    waitAction: "Wait",
    used: "spent",
    open: "open",
    closed: "closed"
  };

  const copy = (key, vars = {}) => {
    const catalog = locales[locale] || locales.en || {};
    const value = catalog[key] || fallback[key] || key;
    return Object.entries(vars).reduce((out, [name, val]) => out.replaceAll(`{${name}}`, String(val)), value);
  };
  const stage = (id, title, arc, mechanic, config) => ({ id, title, arc, mechanic, titleKey: `stage${id}Title`, arcKey: `arc${Math.ceil(id / 5)}`, mechanicKey: `mechanic_${mechanic.replaceAll("-", "_")}`, ...config, checkpoint: id % 5 === 0 });
  const stageText = (plan, field) => {
    const key = field === "title" ? plan.titleKey : field === "arc" ? plan.arcKey : plan.mechanicKey;
    const value = copy(key);
    return value === key ? plan[field] : value;
  };

  // Each row is authored independently: the network, route constraints and terminal
  // condition change by arc. These are not copies of the old three Boolean plans.
  const STAGES = [
    stage(1, "First Fork", "First Fork", "fork", { start: 2, demands: [1, 1], reserve: 0, wasteMax: 0, beats: 5, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill cistern" },
      { id: "direct-b", from: "source", to: "gardenB", label: "Direct B" },
      { id: "cistern-a", from: "cistern", to: "gardenA", label: "Cistern to A" },
      { id: "cistern-b", from: "cistern", to: "gardenB", label: "Cistern to B" },
      { id: "spill", from: "source", to: "waste", label: "Spill to waste" }
    ], solution: ["fill", "cistern-a", "direct-b"] }),
    stage(2, "Return Bend", "First Fork", "return-bend", { start: 2, demands: [1, 1], reserve: 0, wasteMax: 0, beats: 6, capacities: { cistern: 1 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill cistern" },
      { id: "return-a", from: "cistern", to: "gardenA", label: "Return to A" },
      { id: "return-b", from: "cistern", to: "gardenB", label: "Return to B" },
      { id: "direct-a", from: "source", to: "gardenA", label: "Direct A" },
      { id: "direct-b", from: "source", to: "gardenB", label: "Direct B" }
    ], solution: ["fill", "return-a", "direct-b"] }),
    stage(3, "Dry Side Channel", "First Fork", "dry-side", { start: 2, demands: [1, 1], reserve: 0, wasteMax: 0, beats: 5, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill cistern" },
      { id: "cistern-a", from: "cistern", to: "gardenA", label: "Cistern to A" },
      { id: "direct-b", from: "source", to: "gardenB", label: "Direct B" },
      { id: "dry", from: "source", to: "waste", label: "Dry side channel" },
      { id: "detour-b", from: "cistern", to: "gardenB", label: "Detour to B" }
    ], solution: ["fill", "cistern-a", "direct-b"] }),
    stage(4, "Twin Paths", "First Fork", "twin-paths", { start: 2, demands: [1, 1], reserve: 0, wasteMax: 0, beats: 7, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill cistern" },
      { id: "short-a", from: "cistern", to: "gardenA", label: "Short A" },
      { id: "long-a", from: "source", to: "gardenA", label: "Long direct A" },
      { id: "b", from: "source", to: "gardenB", label: "B outlet" },
      { id: "waste", from: "source", to: "waste", label: "False outlet" }
    ], solution: ["fill", "short-a", "b"] }),
    stage(5, "Beaver’s Inspection", "First Fork", "protected-habitat", { start: 2, demands: [1, 1], reserve: 0, wasteMax: 0, beats: 6, protected: true, checkpointRule: "keep the marked habitat channel dry", edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill cistern" },
      { id: "a", from: "cistern", to: "gardenA", label: "A habitat-safe outlet" },
      { id: "b", from: "source", to: "gardenB", label: "B outlet" },
      { id: "habitat", from: "source", to: "waste", label: "Habitat channel", protected: true },
      { id: "detour", from: "cistern", to: "gardenB", label: "B detour" }
    ], solution: ["fill", "a", "b"] }),
    stage(6, "Holding Pond", "Holding Pond", "shared-pond", { start: 3, demands: [1, 1], reserve: 1, wasteMax: 0, beats: 7, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill holding pond" },
      { id: "a", from: "cistern", to: "gardenA", label: "Pond to A" },
      { id: "b", from: "cistern", to: "gardenB", label: "Pond to B" },
      { id: "direct", from: "source", to: "gardenB", label: "Emergency B" },
      { id: "spill", from: "source", to: "waste", label: "Overflow spill" }
    ], solution: ["fill", "fill", "a", "direct"] }),
    stage(7, "Narrow Lock", "Holding Pond", "narrow-lock", { start: 2, demands: [1, 1], reserve: 0, wasteMax: 0, beats: 6, capacities: { cistern: 1 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill lock" },
      { id: "a", from: "cistern", to: "gardenA", label: "Serve A first" },
      { id: "b", from: "cistern", to: "gardenB", label: "Locked B outlet", requires: { delivered: "a" } },
      { id: "direct-b", from: "source", to: "gardenB", label: "Direct B" },
      { id: "waste", from: "source", to: "waste", label: "Wrong branch" }
    ], solution: ["fill", "a", "direct-b"] }),
    stage(8, "Two Ponds", "Holding Pond", "two-ponds", { start: 4, demands: [2, 1], reserve: 1, wasteMax: 0, beats: 9, capacities: { cistern: 3, lowerPond: 1 }, nodeLabels: { cistern: "upperPond" }, flowNodes: ["source", "cistern", "lowerPond", "gardenA", "gardenB"], edges: [
      { id: "fill-upper", from: "source", to: "cistern", label: "Fill upper pond" },
      { id: "fill-lower", from: "source", to: "lowerPond", label: "Fill lower pond" },
      { id: "upper-a", from: "cistern", to: "gardenA", label: "Upper pond to A", phase: "even" },
      { id: "upper-b", from: "cistern", to: "gardenB", label: "Upper pond to B", phase: "odd" },
      { id: "lower-b", from: "lowerPond", to: "gardenB", label: "Lower pond to B", phase: "odd" }
    ], solution: ["fill-upper", "fill-upper", "fill-upper", "fill-lower", "upper-a", "lower-b", "upper-a"] }),
    stage(9, "Reservoir Cutoff", "Holding Pond", "cutoff", { start: 3, demands: [1, 1], reserve: 0, wasteMax: 0, beats: 6, cutoffBeat: 3, capacities: { cistern: 2 }, edges: [
      { id: "fill-1", from: "source", to: "cistern", label: "Preload pond" },
      { id: "fill-2", from: "source", to: "cistern", label: "Second preload", beforeBeat: 3 },
      { id: "a", from: "cistern", to: "gardenA", label: "A outlet" },
      { id: "b", from: "cistern", to: "gardenB", label: "B outlet" },
      { id: "spill", from: "source", to: "waste", label: "Cutoff spill" }
    ], solution: ["fill-1", "fill-2", "a", "b"] }),
    stage(10, "Otter’s Reservoir", "Holding Pond", "balanced-reserve", { start: 4, demands: [1, 1], reserve: 1, wasteMax: 0, beats: 8, checkpointRule: "both gardens filled while one pond unit remains", capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill reservoir" },
      { id: "a", from: "cistern", to: "gardenA", label: "A outlet" },
      { id: "b", from: "cistern", to: "gardenB", label: "B outlet" },
      { id: "direct", from: "source", to: "gardenA", label: "Unsafe direct A" },
      { id: "spill", from: "source", to: "waste", label: "Waste outlet" }
    ], solution: ["fill", "fill", "a", "fill", "b"] }),
    stage(11, "Nursery First", "Nursery Relay", "nursery-gate", { start: 4, demands: [1, 1], reserve: 1, wasteMax: 0, beats: 8, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill nursery pond" },
      { id: "nursery", from: "cistern", to: "gardenB", label: "Open nursery", setsFlag: "nursery" },
      { id: "orchard", from: "cistern", to: "gardenA", label: "Orchard outlet", requiresFlag: "nursery" },
      { id: "shortcut", from: "source", to: "gardenA", label: "Emergency orchard", once: true },
      { id: "spill", from: "source", to: "waste", label: "Dry marsh" }
    ], solution: ["fill", "fill", "nursery", "fill", "orchard"] }),
    stage(12, "Seedling Relay", "Nursery Relay", "relay", { start: 4, demands: [2, 1], reserve: 1, wasteMax: 0, beats: 10, capacities: { cistern: 2 }, edges: [
      { id: "fill-1", from: "source", to: "cistern", label: "First fill" },
      { id: "b", from: "cistern", to: "gardenB", label: "Wake nursery", setsFlag: "nursery" },
      { id: "fill-2", from: "source", to: "cistern", label: "Second fill", requiresFlag: "nursery" },
      { id: "a-1", from: "cistern", to: "gardenA", label: "First orchard" },
      { id: "a-2", from: "cistern", to: "gardenA", label: "Second orchard", requires: { delivered: "a-1" } }
    ], solution: ["fill-1", "fill-1", "b", "fill-2", "a-1", "fill-1", "a-2"] }),
    stage(13, "Orchard Shortcut", "Nursery Relay", "shortcut", { start: 5, demands: [2, 1], reserve: 1, wasteMax: 0, beats: 10, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill pond" },
      { id: "nursery", from: "cistern", to: "gardenB", label: "Nursery route", setsFlag: "nursery" },
      { id: "orchard", from: "cistern", to: "gardenA", label: "Main orchard", requiresFlag: "nursery" },
      { id: "shortcut", from: "source", to: "gardenA", label: "One-use shortcut", once: true },
      { id: "spill", from: "source", to: "waste", label: "Lost water" }
    ], solution: ["fill", "fill", "nursery", "fill", "shortcut", "orchard"] }),
    stage(14, "Restored Marsh", "Nursery Relay", "restored-marsh", { start: 4, demands: [2, 1], reserve: 1, wasteMax: 0, beats: 10, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill pond" },
      { id: "restore", from: "cistern", to: "gardenB", label: "Restore marsh", setsFlag: "restored" },
      { id: "orchard", from: "cistern", to: "gardenA", label: "Restored orchard", requiresFlag: "restored" },
      { id: "direct", from: "source", to: "gardenA", label: "Direct orchard", once: true },
      { id: "spill", from: "source", to: "waste", label: "Marsh leak" }
    ], solution: ["fill", "fill", "restore", "fill", "direct", "orchard"] }),
    stage(15, "Heron’s Order", "Nursery Relay", "ordered-outlets", { start: 4, demands: [1, 1], reserve: 1, wasteMax: 0, beats: 9, order: ["gardenB", "gardenA"], checkpointRule: "deliver to B before A", capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill ordered pond" },
      { id: "b", from: "cistern", to: "gardenB", label: "Heron first" },
      { id: "a", from: "cistern", to: "gardenA", label: "Orchard second", requires: { delivered: "b" } },
      { id: "direct-a", from: "source", to: "gardenA", label: "Wrong-order direct" },
      { id: "spill", from: "source", to: "waste", label: "Overflow" }
    ], solution: ["fill", "fill", "b", "fill", "a"] }),
    stage(16, "Rising Tide", "Rising Tide", "phase-intake", { start: 3, demands: [1, 1], reserve: 0, wasteMax: 0, beats: 10, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Even-beat intake", phase: "even" },
      { id: "a", from: "cistern", to: "gardenA", label: "A outlet" },
      { id: "b", from: "cistern", to: "gardenB", label: "B outlet" },
      { id: "direct", from: "source", to: "gardenB", label: "Direct B" },
      { id: "spill", from: "source", to: "waste", label: "Tide spill" }
    ], solution: ["fill", "a", "direct"] }),
    stage(17, "Ebb Outlet", "Rising Tide", "phase-outlet", { start: 3, demands: [1, 1], reserve: 0, wasteMax: 0, beats: 10, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Odd-beat intake", phase: "odd" },
      { id: "a", from: "cistern", to: "gardenA", label: "Even A outlet", phase: "even" },
      { id: "b", from: "cistern", to: "gardenB", label: "Even B outlet", phase: "even" },
      { id: "direct", from: "source", to: "gardenA", label: "Direct A" },
      { id: "spill", from: "source", to: "waste", label: "Ebb spill" }
    ], solution: ["wait", "fill", "a", "fill", "b"] }),
    stage(18, "Shelter Basin", "Rising Tide", "phase-shelter", { start: 5, demands: [2, 1], reserve: 1, wasteMax: 0, beats: 12, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Even intake", phase: "even" },
      { id: "a-1", from: "cistern", to: "gardenA", label: "A shelter outlet", phase: "odd" },
      { id: "a-2", from: "cistern", to: "gardenA", label: "A second outlet", phase: "odd", requires: { delivered: "a-1" } },
      { id: "b", from: "cistern", to: "gardenB", label: "B shelter outlet", phase: "odd" },
      { id: "spill", from: "source", to: "waste", label: "Closed tide" }
    ], solution: ["fill", "a-1", "wait", "wait", "fill", "a-2", "wait", "wait", "fill", "b", "fill"] }),
    stage(19, "Cross-current", "Rising Tide", "alternating-branches", { start: 5, demands: [2, 1], reserve: 1, wasteMax: 0, beats: 12, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Odd intake", phase: "odd" },
      { id: "a", from: "cistern", to: "gardenA", label: "A on even", phase: "even" },
      { id: "b", from: "cistern", to: "gardenB", label: "B on odd", phase: "odd" },
      { id: "a-direct", from: "source", to: "gardenA", label: "Direct A", once: true },
      { id: "spill", from: "source", to: "waste", label: "Cross-current spill" }
    ], solution: ["wait", "fill", "wait", "b", "wait", "fill", "a", "a-direct", "wait", "fill"] }),
    stage(20, "Moon Ferry", "Rising Tide", "timed-window", { start: 3, demands: [1, 1], reserve: 0, wasteMax: 0, beats: 10, order: ["gardenB", "gardenA"], window: { node: "gardenB", from: 1, to: 4 }, checkpointRule: "deliver B during the moon-ferry window", capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill ferry basin" },
      { id: "b", from: "cistern", to: "gardenB", label: "Moon ferry B", beforeBeat: 5 },
      { id: "a", from: "cistern", to: "gardenA", label: "A after ferry", requires: { delivered: "b" } },
      { id: "direct-a", from: "source", to: "gardenA", label: "Direct A" },
      { id: "spill", from: "source", to: "waste", label: "Moon spill" }
    ], solution: ["fill", "b", "direct-a"] }),
    stage(21, "Wooden Bridge", "Wooden Bridge", "one-use-bridge", { start: 3, demands: [1, 1], reserve: 1, wasteMax: 0, beats: 9, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill bridge basin" },
      { id: "bridge", from: "cistern", to: "gardenA", label: "One-use bridge to A", once: true },
      { id: "b", from: "cistern", to: "gardenB", label: "B outlet" },
      { id: "direct-a", from: "source", to: "gardenA", label: "Long direct A" },
      { id: "spill", from: "source", to: "waste", label: "Bridge spill" }
    ], solution: ["fill", "bridge", "fill", "b", "fill"] }),
    stage(22, "Shared Latch", "Wooden Bridge", "sibling-closure", { start: 4, demands: [1, 1], reserve: 1, wasteMax: 0, beats: 9, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill latch basin" },
      { id: "bridge-a", from: "cistern", to: "gardenA", label: "Bridge A", once: true, closes: ["bridge-b"] },
      { id: "bridge-b", from: "cistern", to: "gardenB", label: "Bridge B", once: true, closes: ["bridge-a"] },
      { id: "b", from: "source", to: "gardenB", label: "Direct B" },
      { id: "a", from: "source", to: "gardenA", label: "Direct A" }
    ], solution: ["fill", "bridge-a", "fill", "b", "fill"] }),
    stage(23, "Long Detour", "Wooden Bridge", "preserve-bridge", { start: 5, demands: [2, 1], reserve: 1, wasteMax: 0, beats: 12, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill detour pond" },
      { id: "bridge", from: "cistern", to: "gardenB", label: "Save bridge for B", once: true },
      { id: "a-1", from: "cistern", to: "gardenA", label: "Detour A" },
      { id: "a-2", from: "source", to: "gardenA", label: "Long direct A", once: true },
      { id: "spill", from: "source", to: "waste", label: "Unreachable spill" }
    ], solution: ["fill", "fill", "a-1", "fill", "a-2", "bridge", "fill"] }),
    stage(24, "Repair Crew", "Wooden Bridge", "repair-route", { start: 5, demands: [2, 1], reserve: 1, wasteMax: 0, beats: 12, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill repair basin" },
      { id: "repair", from: "cistern", to: "cistern", label: "Repair blocked route", repair: true, once: true, repairCost: 1, setsFlag: "repaired" },
      { id: "a", from: "cistern", to: "gardenA", label: "Repaired A", requiresFlag: "repaired" },
      { id: "b", from: "source", to: "gardenB", label: "Direct B" },
      { id: "a-direct", from: "source", to: "gardenA", label: "Emergency A", once: true }
    ], solution: ["fill", "fill", "repair", "a", "fill", "b", "a-direct"] }),
    stage(25, "Turtle’s Crossing", "Wooden Bridge", "habitat-reserve", { start: 5, demands: [2, 1], reserve: 2, wasteMax: 0, beats: 12, checkpointRule: "leave two habitat units in the basin", capacities: { cistern: 3 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill habitat basin" },
      { id: "a", from: "cistern", to: "gardenA", label: "A crossing" },
      { id: "b", from: "cistern", to: "gardenB", label: "B crossing" },
      { id: "a-direct", from: "source", to: "gardenA", label: "Save habitat water", once: true },
      { id: "spill", from: "source", to: "waste", label: "Habitat spill" }
    ], solution: ["fill", "fill", "fill", "a", "b", "fill", "a-direct"] }),
    stage(26, "Festival Tide", "Festival Tide", "festival-network", { start: 5, demands: [2, 2], reserve: 1, wasteMax: 0, beats: 14, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill festival pond", phase: "even" },
      { id: "nursery", from: "cistern", to: "gardenB", label: "Open nursery", setsFlag: "nursery" },
      { id: "bridge", from: "cistern", to: "gardenA", label: "One-use bridge", once: true, requiresFlag: "nursery" },
      { id: "orchard", from: "cistern", to: "gardenA", label: "Festival orchard", requiresFlag: "nursery" },
      { id: "direct-b", from: "source", to: "gardenB", label: "Direct B", once: true },
      { id: "spill", from: "source", to: "waste", label: "Festival spill" }
    ], solution: ["fill", "nursery", "fill", "bridge", "wait", "wait", "wait", "wait", "fill", "orchard", "fill", "direct-b"] }),
    stage(27, "Two-bank Festival", "Festival Tide", "swapped-dependency", { start: 5, demands: [2, 2], reserve: 1, wasteMax: 0, beats: 14, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill two-bank pond", phase: "even" },
      { id: "nursery", from: "cistern", to: "gardenA", label: "Open nursery A", setsFlag: "nursery" },
      { id: "bridge", from: "cistern", to: "gardenB", label: "One-use bridge B", once: true, requiresFlag: "nursery" },
      { id: "orchard", from: "cistern", to: "gardenB", label: "Festival orchard B", requiresFlag: "nursery" },
      { id: "direct-a", from: "source", to: "gardenA", label: "Direct A", once: true },
      { id: "spill", from: "source", to: "waste", label: "Two-bank spill" }
    ], solution: ["fill", "nursery", "fill", "bridge", "wait", "wait", "wait", "wait", "fill", "orchard", "fill", "direct-a"] }),
    stage(28, "Last Ferry", "Festival Tide", "departure-bridge", { start: 5, demands: [2, 2], reserve: 1, wasteMax: 0, beats: 14, capacities: { cistern: 2 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Delayed intake", phase: "even" },
      { id: "bridge", from: "cistern", to: "gardenB", label: "Last ferry bridge", once: true, beforeBeat: 7 },
      { id: "a", from: "cistern", to: "gardenA", label: "A outlet" },
      { id: "b", from: "source", to: "gardenB", label: "Direct B", once: true },
      { id: "spill", from: "source", to: "waste", label: "Ferry spill" }
    ], solution: ["fill", "bridge", "fill", "a", "fill", "a", "fill", "b"] }),
    stage(29, "Lantern Reserve", "Festival Tide", "reserve-order", { start: 6, demands: [2, 2], reserve: 2, wasteMax: 0, beats: 15, order: ["gardenB", "gardenA"], capacities: { cistern: 3 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Fill lantern reserve", phase: "even" },
      { id: "b-1", from: "cistern", to: "gardenB", label: "First lantern B" },
      { id: "b-2", from: "cistern", to: "gardenB", label: "Second lantern B", requires: { delivered: "b-1" } },
      { id: "a-1", from: "cistern", to: "gardenA", label: "First lantern A", requires: { delivered: "b-2" } },
      { id: "a-2", from: "cistern", to: "gardenA", label: "Second lantern A", requires: { delivered: "a-1" } },
      { id: "spill", from: "source", to: "waste", label: "Lantern spill" }
    ], solution: ["fill", "wait", "fill", "wait", "fill", "b-1", "b-2", "wait", "fill", "a-1", "fill", "a-2", "wait", "wait", "fill"] }),
    stage(30, "Riverkeeper’s Promise", "Festival Tide", "finale-network", { start: 6, demands: [2, 2], reserve: 2, wasteMax: 0, beats: 18, order: ["gardenB", "gardenA"], checkpointRule: "meet the timed nursery visit and leave the habitat reserve", capacities: { cistern: 3 }, window: { node: "gardenB", from: 2, to: 6 }, edges: [
      { id: "fill", from: "source", to: "cistern", label: "Festival intake", phase: "even" },
      { id: "nursery", from: "cistern", to: "gardenB", label: "Timed nursery visit", setsFlag: "nursery", beforeBeat: 7 },
      { id: "bridge", from: "cistern", to: "gardenA", label: "Final bridge", once: true, requiresFlag: "nursery" },
      { id: "orchard", from: "cistern", to: "gardenA", label: "Final orchard", requiresFlag: "nursery" },
      { id: "direct-b", from: "source", to: "gardenB", label: "One-use direct B", once: true },
      { id: "spill", from: "source", to: "waste", label: "Festival waste" }
    ], solution: ["fill", "nursery", "wait", "wait", "fill", "bridge", "fill", "orchard", "fill", "wait", "fill", "direct-b"] })
  ];

  const queryLocale = new URLSearchParams(location.search).get("route-locale");
  const pathLocale = location.pathname.split("/").filter(Boolean).map((value) => localeMap[value] || "").find(Boolean);
  let locale = queryLocale && locales[queryLocale] ? queryLocale : (pathLocale && locales[pathLocale] ? pathLocale : "");
  locale = locale || safeStorage.get("weightPlayLocale", "") || safeStorage.get("weightplay-animal-river-gates-locale", "") || "en";
  if (!locales[locale] && locale !== "en") locale = "en";
  let sound = safeStorage.get("weightplay-animal-river-gates-sound", "on") !== "off";
  let stageIndex = 0;
  let stageRailController = null;
  let sharedFrameController = null;
  let battleHeaderInfo = null;
  let state = null;
  let undoStack = [];
  let selectedAction = null;
  let feedback = "";
  let currentScreen = "main";
  let solved = new Set();
  let unlockedThrough = 1;
  let campaignMigrationPending = false;
  try {
    const raw = JSON.parse(safeStorage.get(STORE_KEY, "{}"));
    if (Array.isArray(raw.solved)) raw.solved.filter((value) => Number.isInteger(value) && value >= 1 && value <= STAGES.length).forEach((value) => solved.add(value));
    const storedFrontier = Number.isInteger(raw.unlockedThrough) ? raw.unlockedThrough : 1;
    const solvedFrontier = [...solved].reduce((highest, id) => Math.max(highest, id + 1), 1);
    unlockedThrough = Math.min(STAGES.length, Math.max(1, storedFrontier, solvedFrontier));
    if (raw.campaignRevision !== 2 && Array.isArray(raw.solved) && raw.solved.length) {
      solved.delete(8);
      campaignMigrationPending = true;
    }
  } catch {}

  try {
    window.WeightPlayGameRuntimeLocalizer = window.WeightPlayGameRuntimeLocalizer || {};
    if (Object.isExtensible(window.WeightPlayGameRuntimeLocalizer)) window.WeightPlayGameRuntimeLocalizer["animal-river-gates"] = { locales };
  } catch {}

  const currentStage = () => STAGES[stageIndex];
  const makeState = (plan) => ({ water: [plan.start, 0, 0, 0, 0, 0], beat: 0, used: [], closed: [], flags: [], delivered: [], history: [] });
  const cloneState = (value) => JSON.parse(JSON.stringify(value));
  const persist = () => safeStorage.set(STORE_KEY, JSON.stringify({ solved: [...solved].sort((a, b) => a - b), unlockedThrough, campaignRevision: 2, updatedAt: new Date().toISOString() }));
  if (campaignMigrationPending) persist();
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `animal_river_gates_${name}`, stage: currentStage().id, beat: state?.beat || 0, ...data }); };
  const nodeLabel = (key, plan = currentStage()) => {
    const labelKey = plan.nodeLabels?.[key] || key;
    const translated = copy(labelKey);
    return translated !== labelKey ? translated : nodeLabels[labelKey] || nodeLabels[key];
  };
  const copyAction = (action) => {
    const label = action.label || `${nodeLabel(action.from)} → ${nodeLabel(action.to)}`;
    return locales[locale]?.actionLabels?.[label] || label;
  };
  const checkpointRule = (rule) => locales[locale]?.checkpointRules?.[rule] || rule;
  const deliveredCount = (node) => state.delivered.filter((item) => item === node).length;
  const capacity = (node) => currentStage().capacities?.[node] ?? (node === "gardenA" || node === "gardenB" ? currentStage().demands[node === "gardenA" ? 0 : 1] : 99);
  const phaseReady = (action) => !action.phase || action.phase === (state.beat % 2 === 0 ? "even" : "odd");
  const requirementReady = (action) => {
    if (action.requiresFlag && !state.flags.includes(action.requiresFlag)) return false;
    if (action.requires?.delivered && !state.history.includes(action.requires.delivered)) return false;
    return true;
  };
  const reasonFor = (action) => {
    const plan = currentStage();
    if (state.beat >= plan.beats) return copy("cutoff");
    if (state.closed.includes(action.id)) return copy("bridge");
    if (action.once && state.used.includes(action.id)) return copy("once");
    if (!phaseReady(action)) return copy("phase", { phase: phaseName(action.phase) });
    if (action.beforeBeat !== undefined && state.beat >= action.beforeBeat) return copy("cutoff");
    if (!requirementReady(action)) return action.requiresFlag ? copy("prerequisite") : copy("order");
    if (action.repair) return state.water[1] < (action.repairCost || 1) ? copy("noRepair") : "";
    const fromIndex = nodes.indexOf(action.from);
    const toIndex = nodes.indexOf(action.to);
    if (fromIndex < 0 || toIndex < 0) return copy("noTarget");
    if (state.water[fromIndex] <= 0) return copy("dry");
    if (action.to !== "waste" && state.water[toIndex] >= capacity(action.to)) return copy("full");
    if (action.to === "waste" && currentStage().wasteMax !== undefined && state.water[toIndex] >= currentStage().wasteMax) return copy("capacity");
    return "";
  };
  const actionAvailable = (action) => !reasonFor(action);
  const availableActions = () => currentStage().edges.filter((action) => actionAvailable(action));
  const settlementReason = () => {
    const plan = currentStage();
    if (state.water[2] < plan.demands[0] || state.water[3] < plan.demands[1]) return copy("settlementGardens", { a: state.water[2], aDemand: plan.demands[0], b: state.water[3], bDemand: plan.demands[1] });
    if (state.water[1] < plan.reserve) return copy("settlementReserve", { label: nodeLabel(plan.nodeLabels?.cistern || "cistern"), current: state.water[1], required: plan.reserve });
    if (state.water[4] > (plan.wasteMax ?? 0)) return copy("settlementWaste", { current: state.water[4], maximum: plan.wasteMax ?? 0 });
    if (plan.order && plan.order.some((node, index) => state.delivered.indexOf(node) > state.delivered.indexOf(plan.order[index + 1]))) return copy("settlementOrder");
    if (plan.protected && state.water[4] > 0) return copy("settlementHabitat");
    if (plan.window && state.delivered.includes(plan.window.node) && state.beat > plan.window.to) return copy("settlementWindow");
    return copy("settlementCheckpoint");
  };
  const won = () => {
    const plan = currentStage();
    const ordered = !plan.order || plan.order.every((node, index) => state.delivered.indexOf(node) >= 0 && (index === 0 || state.delivered.indexOf(node) > state.delivered.indexOf(plan.order[index - 1])));
    const windowOk = !plan.window || (state.delivered.includes(plan.window.node) && state.delivered.indexOf(plan.window.node) >= 0);
    return state.water[2] >= plan.demands[0] && state.water[3] >= plan.demands[1] && state.water[1] >= plan.reserve && state.water[4] <= (plan.wasteMax ?? 0) && ordered && windowOk && (!plan.protected || state.water[4] === 0);
  };
  const actionState = (action) => {
    if (action.repair) return { water: [...state.water], beat: state.beat, used: [...state.used], closed: [...state.closed], flags: [...state.flags], delivered: [...state.delivered], history: [...state.history, action.id] };
    const fromIndex = nodes.indexOf(action.from); const toIndex = nodes.indexOf(action.to);
    const next = { water: [...state.water], beat: state.beat, used: [...state.used], closed: [...state.closed], flags: [...state.flags], delivered: [...state.delivered], history: [...state.history, action.id] };
    next.water[fromIndex] -= 1; next.water[toIndex] += 1; next.beat += 1;
    if (action.once) next.used.push(action.id);
    if (action.closes) next.closed.push(...action.closes);
    if (action.setsFlag && !next.flags.includes(action.setsFlag)) next.flags.push(action.setsFlag);
    if (action.to === "gardenA" || action.to === "gardenB") next.delivered.push(action.to);
    return next;
  };
  const applyAction = (action) => {
    const reason = reasonFor(action);
    if (reason) { feedback = "wrong"; renderBattle(); return false; }
    undoStack.push(cloneState(state));
    if (action.repair) {
      state.water[1] -= action.repairCost || 1; state.beat += 1; state.history.push(action.id);
      if (action.once) state.used.push(action.id);
      if (action.setsFlag && !state.flags.includes(action.setsFlag)) state.flags.push(action.setsFlag);
    } else state = actionState(action);
    selectedAction = null; feedback = ""; announce("move", { action: action.id, water: [...state.water] }); renderBattle(); return true;
  };
  const waitAction = () => {
    const plan = currentStage();
    if (state.beat >= plan.beats) { feedback = "wrong"; renderBattle(); return; }
    undoStack.push(cloneState(state)); state.beat += 1; selectedAction = null; feedback = "waiting"; announce("wait"); renderBattle();
  };
  const checkSettlement = () => {
    if (won()) {
      solved.add(currentStage().id); unlockedThrough = Math.min(STAGES.length, Math.max(unlockedThrough, currentStage().id + 1)); persist(); feedback = "correct"; announce("complete", { solved: solved.size }); renderBattle(); setTimeout(() => { show("result"); renderResult(); }, 240);
    } else {
      feedback = availableActions().length ? "incomplete" : "impossible"; announce("check", { success: false }); renderBattle();
    }
  };
  const stageUnlocked = (index) => Boolean(STAGES[index] && STAGES[index].id <= unlockedThrough);
  const highestUnlockedStage = () => Math.max(0, Math.min(STAGES.length, unlockedThrough) - 1);
  const show = (screen) => {
    currentScreen = screen; document.body.dataset.screen = screen;
    const guide = $("app")?.querySelector(".game-page-info-static");
    if (guide) guide.hidden = screen !== "main";
    document.querySelectorAll("[data-screen]:not(body)").forEach((node) => {
      node.hidden = node.id === "battleScreen" ? !["battle", "result"].includes(screen)
        : node.id === "resultScreen" ? screen !== "result" : node.dataset.screen !== screen;
    });
    if ($("battlePlayWorkspace")) $("battlePlayWorkspace").hidden = screen === "result";
    if ($("settingsPanel")) $("settingsPanel").hidden = true;
    if ($("backBtn")) $("backBtn").hidden = screen !== "main";
    if (sharedFrameController) {
      const scene = screen === "result" ? "battle" : screen;
      sharedFrameController.activate(scene, { covered: screen === "result" });
    }
  };
  const prepareStageWorkspace = () => {
    const screen = $("stageScreen"); const rail = $("stageList"); const header = screen?.querySelector(".stage-header"); const back = $("stageBack");
    if (!screen || !rail || !header || !back || screen.querySelector("#stageNavigation")) return;
    [...header.children].forEach((node) => { if (node !== back) node.remove(); });
    header.className = "stage-header";
    const workspace = document.createElement("div"); workspace.className = "stage-workspace"; workspace.dataset.wpFrameContent = "stage";
    rail.removeAttribute("role"); rail.removeAttribute("data-wp-stage-management-nav"); rail.setAttribute("role", "group");
    workspace.append(rail); screen.insertBefore(workspace, header.nextSibling);
    const navigation = document.createElement("nav"); navigation.id = "stageNavigation"; navigation.className = "stage-bottom-nav";
    navigation.dataset.wpFrameStageNav = "";
    navigation.setAttribute("role", "tablist"); navigation.setAttribute("aria-label", copy("stages"));
    const stagesTab = document.createElement("button"); stagesTab.type = "button"; stagesTab.className = "stage-nav-tab";
    stagesTab.dataset.wpFrameStageSlot = "stages"; stagesTab.dataset.riverI18n = "stages";
    stagesTab.setAttribute("role", "tab"); stagesTab.setAttribute("aria-selected", "true"); stagesTab.setAttribute("aria-current", "page");
    stagesTab.tabIndex = 0; stagesTab.textContent = copy("stages"); navigation.append(stagesTab); screen.append(navigation);
  };
  const prepareExplicitFrame = () => {
    const app = $("app"); const main = $("mainScreen"); const battle = $("battleScreen");
    if (!app || !main || !battle || !window.WeightPlayScreenFrame) return;
    app.dataset.wpFrameRoot = "";
    const stage = $("stageScreen");
    if (stage) {
      stage.dataset.wpStageLandscapeWidth = "760";
      stage.dataset.wpStageLandscapeHeight = "334";
    }
    battle.dataset.wpBattleLandscapeWidth = "760";
    battle.dataset.wpBattleLandscapeHeight = "334";
    main.querySelector(".topbar")?.setAttribute("data-wp-shell-header", "main");
    main.querySelector(".topbar [data-wp-game-title]")?.setAttribute("data-wp-frame-title", "");
    main.querySelector(".main-poster")?.setAttribute("data-wp-frame-poster", "");
    main.querySelector(".main-summary")?.setAttribute("data-wp-frame-summary", "");
    main.querySelector("#mainProgress")?.setAttribute("data-wp-frame-progress", "");
    main.querySelector("#startBtn")?.setAttribute("data-wp-frame-action", "primary");
    main.querySelector(".guide-art")?.setAttribute("hidden", "");
    main.querySelector(".eyebrow")?.setAttribute("hidden", "");
    main.querySelector("h1[data-wp-game-title]")?.setAttribute("hidden", "");
    $("stageScreen")?.querySelector(".stage-header")?.setAttribute("data-wp-shell-header", "stage");

    const battleHeader = battle.querySelector(".battle-header");
    const progress = $("progressPill");
    const result = $("resultScreen");
    if (!battleHeader || !progress || !result || battle.querySelector("#battleWorkspace")) return;
    const headerInfo = document.createElement("div"); headerInfo.className = "battle-header-info";
    const progressField = document.createElement("div"); progressField.className = "battle-info-field";
    const progressLabel = document.createElement("span"); progressLabel.dataset.riverI18n = "progressLabel";
    progressField.append(progressLabel, progress);
    progress.className = "battle-progress-value";
    headerInfo.append(progressField); battleHeaderInfo = headerInfo;
    const back = $("battleBackBtn"); battleHeader.replaceChildren(back);
    battleHeader.setAttribute("data-wp-shell-header", "battle");
    const workspace = document.createElement("div"); workspace.id = "battleWorkspace";
    workspace.className = "battle-workspace"; workspace.dataset.wpShellContent = "battle";
    const play = document.createElement("div"); play.id = "battlePlayWorkspace"; play.className = "battle-play-workspace";
    play.append(headerInfo);
    [...battle.children].forEach((node) => { if (node !== battleHeader) play.append(node); });
    workspace.append(play, result); battle.append(workspace);
  };
  const mountExplicitFrame = () => {
    if (sharedFrameController || !window.WeightPlayScreenFrame || !battleHeaderInfo) return;
    const frame = window.WeightPlayScreenFrame;
    frame.mountSlots({
      root: $("app"), main: $("mainScreen"), stage: $("stageScreen"),
      battle: { root: $("battleScreen"), headerInfo: battleHeaderInfo },
    });
    sharedFrameController = frame.mount({
      root: $("app"), localeSelect: $("localeSelect"), scenes: {
        main: { root: $("mainScreen"), header: $("mainScreen").querySelector(":scope > .wp-frame-header"), content: $("mainScreen").querySelector(":scope > [data-wp-frame-content='main']") },
        stage: { root: $("stageScreen"), header: $("stageScreen").querySelector(":scope > .wp-frame-header"), content: $("stageScreen").querySelector(":scope > [data-wp-frame-content='stage']") },
        battle: { root: $("battleScreen"), header: $("battleScreen").querySelector(":scope > .wp-frame-header"), content: $("battleScreen").querySelector(":scope > [data-wp-frame-content='battle']"), headerInfo: battleHeaderInfo },
      },
    });
  };
  const renderStatic = () => {
    document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.body.dataset.locale = locale;
    if ($("mainPoster")) $("mainPoster").alt = copy("posterAlt");
    document.querySelectorAll("[data-river-i18n]").forEach((node) => { node.textContent = copy(node.dataset.riverI18n); });
    if ($("mainProgress")) $("mainProgress").textContent = copy("progress", { current: Math.min(STAGES.length, solved.size + 1), total: STAGES.length });
    ["backBtn", "stageBack", "battleBackBtn"].forEach((id) => $(id)?.setAttribute("aria-label", copy("back")));
    ["settingsBtn", "stageUtilityBtn", "battleUtilityBtn"].forEach((id) => $(id)?.setAttribute("aria-label", copy("settings")));
    $("closeSettings")?.setAttribute("aria-label", copy("close")); $("localeSelect")?.setAttribute("aria-label", copy("language"));
    $("gateGrid")?.setAttribute("aria-label", copy("riverGates"));
    if ($("soundBtn")) { $("soundBtn").textContent = sound ? copy("on") : copy("off"); $("soundBtn").setAttribute("aria-pressed", String(sound)); }
    if ($("best")) { const best = Number(safeStorage.get(BEST_KEY, "0")); $("best").textContent = copy("best", { best: best || "—" }); }
    if ($("stageNavigation")) { $("stageNavigation").setAttribute("aria-label", copy("stages")); $("stageList")?.setAttribute("aria-label", copy("choose")); }
    renderStages(); renderBattle(); renderResult();
  };
  const renderStages = () => {
    const root = $("stageList"); if (!root) return;
    if (!stageRailController && window.WeightPlayStageV6?.install) {
      stageRailController = window.WeightPlayStageV6.install(root, {
        total: STAGES.length,
        poolSize: 9,
        initialIndex: highestUnlockedStage,
        bind: (card, index) => {
          const plan = STAGES[index];
          const locked = !stageUnlocked(index); const cleared = solved.has(plan.id);
          const status = cleared ? copy("solved") : locked ? copy("locked") : copy("open");
          const arc = copy("arc", { arc: stageText(plan, "arc"), name: stageText(plan, "mechanic") });
          const demand = copy("stageDemand", { a: plan.demands[0], b: plan.demands[1] });
          const reserve = copy("stageReserve", { label: nodeLabel(plan.nodeLabels?.cistern || "cistern", plan), value: plan.reserve, waste: plan.wasteMax ?? 0 });
          card.type = "button"; card.className = "stage-card"; card.disabled = false;
          card.setAttribute("aria-disabled", String(locked));
          card.setAttribute("aria-label", `${plan.id}. ${stageText(plan, "title")}. ${arc}. ${demand}. ${reserve}. ${status}`);
          card.innerHTML = `<span class="stage-card-content" data-wp-item-content><strong>${plan.id}. ${stageText(plan, "title")}</strong><small>${arc}</small><small>${demand} · ${reserve}</small></span><span class="arrow" aria-hidden="true">${cleared ? "✓" : locked ? "🔒" : "→"}</span>`;
        },
        activate: (index) => { if (stageUnlocked(index)) startStage(index); },
      });
    } else if (stageRailController) {
      stageRailController.refresh();
      stageRailController.center(highestUnlockedStage());
    }
  };
  const actionButton = (action) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "gate action-card"; const reason = reasonFor(action); const selected = selectedAction?.id === action.id;
    const label = copyAction(action);
    button.disabled = Boolean(reason); button.setAttribute("aria-pressed", String(selected));
    button.setAttribute("aria-label", reason ? copy("disabledActionAccessible", { label, reason }) : copy("actionAccessible", { label, detail: copy("actionReady") }));
    button.innerHTML = `<span class="gate-icon" aria-hidden="true">${action.repair ? "⚒" : action.to === "waste" ? "↘" : "≈"}</span><strong>${label}</strong><small>${reason ? copy("disabled", { reason }) : copy("actionPreview", { from: nodeLabel(action.from), to: nodeLabel(action.to), amount: 1 })}</small>`;
    if (!reason) button.addEventListener("click", () => { selectedAction = action; feedback = ""; renderBattle(); });
    return button;
  };
  const renderBattle = () => {
    if (!$('gateGrid') || currentScreen !== "battle" || !state) return; const plan = currentStage();
    const planTitle = $("planTitle"); if (planTitle) planTitle.textContent = `${plan.id}. ${stageText(plan, "title")}`;
    $("progressPill").textContent = `${plan.id} / ${STAGES.length}`;
    $("prompt").textContent = copy("prompt"); $("rule").textContent = `${copy("stageDemand", { a: plan.demands[0], b: plan.demands[1] })} · ${copy("stageReserve", { label: nodeLabel(plan.nodeLabels?.cistern || "cistern"), value: plan.reserve, waste: plan.wasteMax ?? 0 })}${plan.checkpointRule ? ` · ${copy("checkpointRule", { rule: checkpointRule(plan.checkpointRule) })}` : ""}`;
    const root = $("gateGrid"); root.replaceChildren(); currentStage().edges.forEach((action) => root.appendChild(actionButton(action)));
    const wait = document.createElement("button"); wait.type = "button"; wait.className = "gate action-card wait-card";
    const waitPhase = phaseName(state.beat % 2 === 0 ? "even" : "odd"); const waitDetail = copy("waitDescription", { phase: waitPhase, beat: state.beat });
    wait.disabled = state.beat >= plan.beats; wait.setAttribute("aria-label", wait.disabled ? copy("disabledActionAccessible", { label: copy("waitAction"), reason: copy("noMoves") }) : copy("actionAccessible", { label: copy("waitAction"), detail: waitDetail }));
    wait.innerHTML = `<span class="gate-icon" aria-hidden="true">⌛</span><strong>${copy("waitAction")}</strong><small>${waitDetail}</small>`; wait.addEventListener("click", waitAction); root.appendChild(wait);
    const flowNodes = plan.flowNodes || nodes.slice(0, 5);
    const waterText = flowNodes.map((node) => `${nodeLabel(node)} ${state.water[nodes.indexOf(node)]}`).join(" · "); $("flow").textContent = `${copy("water")}: ${waterText} · ${copy("tide")}: ${state.beat}/${plan.beats}`;
    $("checkBtn").disabled = !selectedAction || Boolean(reasonFor(selectedAction)); $("undoBtn") && ($("undoBtn").disabled = undoStack.length === 0); $("status").textContent = feedback === "impossible" ? copy("impossible", { reason: settlementReason() }) : feedback === "waiting" ? copy("waiting", { beat: state.beat }) : feedback ? copy(feedback) : (selectedAction ? `${copy("actionReady")}: ${copyAction(selectedAction)}` : ""); $("status").className = feedback === "correct" ? "status good" : feedback === "wrong" || feedback === "impossible" ? "status try" : "status";
  };
  const renderResult = () => {
    if (!$('resultText')) return; const complete = solved.size === STAGES.length; const next = stageIndex + 1; $("resultTitle").textContent = complete ? copy("resultTitle") : copy("resultLevel"); $("resultText").textContent = `${copy("progress", { current: solved.size, total: STAGES.length })} · ${complete ? copy("resultTitle") : copy("next")}`; $("nextBtn").hidden = false; $("nextBtn").disabled = next >= STAGES.length || !stageUnlocked(next); $("resultMapBtn").hidden = false; $("replayBtn").hidden = false;
  };
  const startStage = (index) => { if (!stageUnlocked(index)) return; stageIndex = index; state = makeState(currentStage()); undoStack = []; selectedAction = null; feedback = ""; show("battle"); renderBattle(); announce("start"); };
  const goBack = () => { if (currentScreen === "battle") { show("stage"); renderStages(); } else if (currentScreen === "stage" || currentScreen === "result") { show("main"); renderStatic(); } };
  const bind = () => {
    $("startBtn")?.addEventListener("click", () => { show("stage"); renderStages(); }); $("mapBtn")?.addEventListener("click", () => { show("stage"); renderStages(); }); $("resultMapBtn")?.addEventListener("click", () => { show("stage"); renderStages(); });
    $("nextBtn")?.addEventListener("click", () => { const next = stageIndex + 1; if (next < STAGES.length && stageUnlocked(next)) startStage(next); });
    $("replayBtn")?.addEventListener("click", () => startStage(stageIndex));
    $("checkBtn")?.addEventListener("click", () => { if (selectedAction) applyAction(selectedAction); checkSettlement(); });
    $("resetBtn")?.addEventListener("click", () => { state = makeState(currentStage()); undoStack = []; selectedAction = null; feedback = ""; renderBattle(); announce("reset"); });
    $("undoBtn")?.addEventListener("click", () => { if (!undoStack.length) { feedback = "noUndo"; renderBattle(); return; } state = undoStack.pop(); selectedAction = null; feedback = ""; renderBattle(); announce("undo"); });
    $("backBtn")?.addEventListener("click", goBack); $("stageBack")?.addEventListener("click", goBack); $("battleBackBtn")?.addEventListener("click", goBack);
    ["settingsBtn", "stageUtilityBtn", "battleUtilityBtn"].forEach((id) => $(id)?.addEventListener("click", () => { $("settingsPanel").hidden = false; })); $("closeSettings")?.addEventListener("click", () => { $("settingsPanel").hidden = true; });
    $("soundBtn")?.addEventListener("click", () => { sound = !sound; safeStorage.set("weightplay-animal-river-gates-sound", sound ? "on" : "off"); renderStatic(); }); $("localeSelect")?.addEventListener("change", (event) => { locale = event.target.value; safeStorage.set("weightPlayLocale", locale); safeStorage.set("weightplay-animal-river-gates-locale", locale); renderStatic(); });
  };
  const enforceRouteLocale = () => { const requested = queryLocale || pathLocale; if (requested && (requested !== locale || document.documentElement.lang !== requested || document.documentElement.dir !== (requested === "ar" ? "rtl" : "ltr"))) { locale = requested; safeStorage.set("weightPlayLocale", locale); if ($("localeSelect")) $("localeSelect").value = locale; renderStatic(); } };
  const boot = () => { document.querySelectorAll("[data-i18n]").forEach((node) => { node.dataset.riverI18n = node.dataset.i18n; node.removeAttribute("data-i18n"); }); prepareStageWorkspace(); prepareExplicitFrame(); bind(); if ($("localeSelect")) $("localeSelect").value = locale; $("loading").hidden = true; $("app").hidden = false; mountExplicitFrame(); show("main"); renderStatic(); enforceRouteLocale(); announce("loaded"); };
  window.__ANIMAL_RIVER_GATES_TEST__ = { stages: STAGES, startStage, applyAction, waitAction, getState: () => ({ stage: currentStage().id, state: cloneState(state), solved: [...solved], screen: currentScreen }), solution: (index) => STAGES[index]?.solution || [] };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
