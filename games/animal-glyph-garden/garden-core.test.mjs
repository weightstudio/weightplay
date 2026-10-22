import test from "node:test";
import assert from "node:assert/strict";
import {
  STAGES,
  matches,
  normalizeSave,
  settle,
  loadSave,
  persistSave,
  buyMoon,
  recoverPurchase,
  SAVE_KEY,
  PURCHASE_KEY,
} from "./garden-core.mjs";
const memory = () => {
  const data = new Map();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    data,
  };
};
const wallet = (balance) => ({
  balance,
  charges: 0,
  read() {
    return { diamonds: this.balance };
  },
  spendDiamonds(n) {
    if (this.balance < n) return false;
    this.balance -= n;
    this.charges++;
    return true;
  },
});
test("all 110 authored decisions have exactly one legal answer and meaningful ignored-attribute distractors", () => {
  assert.equal(STAGES.length, 30);
  let count = 0;
  for (const s of STAGES)
    for (const [i, t] of s.targets.entries()) {
      count++;
      const choices = s.options[i];
      assert.equal(new Set(choices.map((o) => o.shape + o.color)).size, 6);
      assert.equal(choices.filter((o) => matches(o, t)).length, 1);
      if (t.mode === "shape") {
        assert.ok(
          choices.some((o) => o.color === t.color && o.shape !== t.shape),
        );
        assert.ok(choices.find((o) => matches(o, t)).color !== t.color);
      }
      if (t.mode === "color") {
        assert.ok(
          choices.some((o) => o.shape === t.shape && o.color !== t.color),
        );
        assert.ok(choices.find((o) => matches(o, t)).shape !== t.shape);
      }
    }
  assert.equal(count, 110);
});
test("30 natural clears preserve monotonic unlocks and exactly six specimen milestones", () => {
  let s = normalizeSave(),
    specimens = 0;
  for (let i = 0; i < 30; i++) {
    assert.ok(i < s.unlocked);
    const r = settle(s, i, 0);
    s = r.save;
    specimens += Number(r.specimen);
    assert.equal(s.solved.length, i + 1);
    assert.equal(s.unlocked, Math.min(30, i + 2));
  }
  assert.equal(specimens, 6);
  assert.equal(s.unlocked, 30);
});
test("replay cannot duplicate specimens or lower best score", () => {
  let r = settle(normalizeSave(), 4, 0);
  r = settle(r.save, 4, 9);
  assert.equal(r.first, false);
  assert.equal(r.specimen, false);
  assert.equal(r.best, 3);
  assert.equal(r.earned, 1);
  assert.deepEqual(r.save.solved, [4]);
});
test("malformed and old saves migrate without clearing old keys", () => {
  const store = memory();
  store.setItem(SAVE_KEY, "null");
  store.setItem("weightplay-glyph-garden-solved-v4", '[0,4,29,30,-1,"3"]');
  store.setItem("weightplay-glyph-garden-unlocked-v4", "16");
  const s = loadSave(store);
  assert.deepEqual(s.solved, [0, 4, 29]);
  assert.equal(s.unlocked, 30);
  persistSave(store, s);
  assert.ok(store.getItem("weightplay-glyph-garden-solved-v4"));
  assert.equal(normalizeSave({ style: "moon", moon: false }).style, "dawn");
});
test("unavailable storage is reported instead of fake success", () => {
  assert.throws(
    () =>
      persistSave(
        {
          setItem() {},
          getItem() {
            return null;
          },
        },
        normalizeSave(),
      ),
    /UNCONFIRMED/,
  );
});
test("moon purchase uses shared wallet once and survives reload", () => {
  const s = memory(),
    w = wallet(13);
  const r = buyMoon(s, w);
  assert.equal(r.status, "bought");
  assert.equal(r.save.moon, true);
  assert.equal(w.balance, 5);
  assert.equal(loadSave(s).style, "moon");
  assert.equal(buyMoon(s, w).status, "owned");
  assert.equal(w.charges, 1);
});
test("insufficient purchase leaves both progress and shared balance unchanged", () => {
  const s = memory(),
    w = wallet(7);
  const before = JSON.stringify([...s.data]);
  assert.equal(buyMoon(s, w).status, "insufficient");
  assert.equal(w.balance, 7);
  assert.equal(JSON.stringify([...s.data]), before);
});
test("storage preflight failure prevents wallet charge", () => {
  const s = memory(),
    w = wallet(8);
  s.setItem = () => {
    throw Error("quota");
  };
  assert.throws(() => buyMoon(s, w));
  assert.equal(w.charges, 0);
});
test("failure after charge recovers entitlement without double charge", () => {
  const s = memory(),
    w = wallet(8),
    set = s.setItem;
  let writes = 0;
  s.setItem = (k, v) => {
    if (k === SAVE_KEY && ++writes === 2) throw Error("quota");
    set(k, v);
  };
  assert.throws(() => buyMoon(s, w));
  assert.equal(w.balance, 0);
  assert.ok(s.getItem(PURCHASE_KEY));
  s.setItem = set;
  assert.equal(recoverPurchase(s, w).moon, true);
  assert.equal(buyMoon(s, w).status, "owned");
  assert.equal(w.charges, 1);
});
test("unexecuted journal is safe; ambiguous external wallet change never grants or charges again", () => {
  const s = memory(),
    w = wallet(12);
  s.setItem(
    PURCHASE_KEY,
    JSON.stringify({ item: "moon", before: 12, after: 4 }),
  );
  assert.equal(recoverPurchase(s, w).moon, false);
  s.setItem(
    PURCHASE_KEY,
    JSON.stringify({ item: "moon", before: 12, after: 4 }),
  );
  w.balance = 9;
  assert.throws(() => recoverPurchase(s, w), /REVIEW/);
  assert.equal(w.charges, 0);
});
