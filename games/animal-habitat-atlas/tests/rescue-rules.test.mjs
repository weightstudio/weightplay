import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const scope = {};
scope.globalThis = scope;
vm.runInNewContext(
  fs.readFileSync(new URL("../game.js", import.meta.url), "utf8"),
  scope,
);
const R = scope.HabitatRescueRules;
const paths = [
  ["r6", "r5", "v5", "r1", "v1", "r11", "r7", "v7"],
  ["r6", "r7", "v7", "r5", "r4", "v4", "s10", "r0", "v0"],
  ["r6", "r9", "r8", "v8", "r2", "r1", "r3", "s10", "v1", "v3"],
  ["r6", "r5", "v5", "r2", "r4", "r0", "v0", "r8", "s10", "r3", "v3", "v8"],
  ["r11", "r7", "v7", "r3", "r2", "r1", "v2", "r0", "s10", "r4", "v0", "v4"],
  [
    "r9",
    "r5",
    "r4",
    "v4",
    "r1",
    "r2",
    "r0",
    "v0",
    "s10",
    "r3",
    "v3",
    "r7",
    "s10",
    "v7",
  ],
];
for (let i = 0; i < paths.length; i++) {
  let state = R.create(i + 1);
  assert.equal(R.act(state, "restore", 0).error, "needRoute");
  for (const step of paths[i]) {
    const before = JSON.stringify(state);
    const outcome = R.act(
      state,
      { r: "restore", v: "rescue", s: "supply" }[step[0]],
      Number(step.slice(1)),
    );
    assert.equal(outcome.error, null);
    assert.equal(
      JSON.stringify(state),
      before,
      "An action cannot mutate its undo snapshot",
    );
    state = outcome.state;
    assert.ok(state.kits >= 0 && state.kits <= 9);
  }
  assert.equal(R.stars(state), 3, `Expedition ${i + 1} mastery is reachable`);
  assert.equal(state.ended, true);
  assert.equal(R.act(state, "supply", 10).error, "done");
}
let storm = R.create(2);
for (const [action, id] of [
  ["restore", 6],
  ["shelter", 7],
  ["supply", 10],
  ["supply", 10],
  ["restore", 5],
]) {
  const next = R.act(storm, action, id);
  assert.equal(next.error, null);
  storm = next.state;
}
assert.equal(storm.turn, 5);
assert.equal(storm.cells[7].health, 2, "Shelter protects before restoration");
assert.equal(
  storm.cells[0].health,
  1,
  "Exposed wildlife suffers the actual storm",
);
assert.equal(R.act(storm, "shelter", 7).error, "done");
assert.equal(R.stars(storm), 0, "Restoration alone cannot replace rescue");
assert.throws(() => R.create(0));
assert.throws(() => R.create(7));
assert.equal(R.act(R.create(1), "restore", -1).error, "needRoute");
assert.equal(R.act(R.create(1), "not-an-action", 6).error, "invalid");

// Water provides an actual cost interaction instead of a terrain reskin.
let water = R.create(2);
assert.equal(R.cost(water, 4), 2);
for (const id of [9, 5]) water = R.act(water, "restore", id).state;
assert.equal(R.cost(water, 4), 1);

// An action-budget loss is reachable through legal player actions.
let loss = R.create(2);
for (const [action, id] of [
  ["restore", 6],
  ["shelter", 7],
  ["supply", 10],
  ["supply", 10],
  ["restore", 5],
  ["restore", 1],
  ["restore", 0],
  ["restore", 4],
  ["restore", 2],
  ["restore", 3],
  ["restore", 7],
  ["restore", 11],
  ["restore", 9],
  ["restore", 8],
  ["supply", 10],
]) {
  const next = R.act(loss, action, id);
  assert.equal(next.error, null);
  loss = next.state;
}
assert.equal(loss.turn, 15);
assert.equal(loss.ended, true);
assert.equal(R.stars(loss), 0);
assert.equal(R.act(loss, "rescue", 7).error, "done");
console.log(
  "PASS: six mastery routes, immutable actions, bounded resources, storm/shelter, water, legal loss and settlement guards",
);
