// Authored campaign retained from v16; v17 enforces named relay/cutoff rules.
import {TARGETS} from './targets.mjs?v=20261023-river-gates-v17';
const stage = (id, title, arc, mechanic, config) => ({ id, title, arc, mechanic, par: TARGETS[id], titleKey: `stage${id}Title`, arcKey: `arc${Math.ceil(id / 5)}`, mechanicKey: `mechanic_${mechanic.replaceAll("-", "_")}`, ...config, checkpoint: id % 5 === 0 });
export const STAGES = [
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
      { id: "fill-1", from: "source", to: "cistern", label: "Preload pond", beforeBeat: 3 },
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
      { id: "a-1", from: "cistern", to: "gardenA", label: "First orchard", once: true },
      { id: "a-2", from: "cistern", to: "gardenA", label: "Second orchard", once: true, requires: { delivered: "a-1" } }
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
      { id: "a-1", from: "cistern", to: "gardenA", label: "A shelter outlet", phase: "odd", once: true },
      { id: "a-2", from: "cistern", to: "gardenA", label: "A second outlet", phase: "odd", once: true, requires: { delivered: "a-1" } },
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
      { id: "b-1", from: "cistern", to: "gardenB", label: "First lantern B", once: true },
      { id: "b-2", from: "cistern", to: "gardenB", label: "Second lantern B", once: true, requires: { delivered: "b-1" } },
      { id: "a-1", from: "cistern", to: "gardenA", label: "First lantern A", once: true, requires: { delivered: "b-2" } },
      { id: "a-2", from: "cistern", to: "gardenA", label: "Second lantern A", once: true, requires: { delivered: "a-1" } },
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
