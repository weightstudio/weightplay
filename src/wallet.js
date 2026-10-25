(function () {
  const walletKey = "weightplayWallet", lockName = "weightplay-wallet-v2";
  const pending = new Map();
  let transactionActive = false;
  const record = value => value && typeof value === "object" && !Array.isArray(value);
  const integer = value => Number.isSafeInteger(value) && value >= 0;
  const validId = value => typeof value === "string" && /^[a-zA-Z0-9][a-zA-Z0-9:._/-]{0,191}$/.test(value);

  function load() {
    const raw = localStorage.getItem(walletKey), value = raw === null ? {} : JSON.parse(raw);
    if (!record(value) || (value.diamonds !== undefined && !integer(value.diamonds)) ||
        (value.schema !== undefined && value.schema !== 2) ||
        (value.revision !== undefined && !integer(value.revision))) throw Error("INVALID_WALLET");
    const purchases = value.purchases ?? {}, rewards = value.rewards ?? {};
    if (!record(purchases) || !record(rewards)) throw Error("INVALID_WALLET_RECEIPTS");
    for (const [sku, receipt] of Object.entries(purchases)) {
      if (!validId(sku) || !record(receipt) || receipt.sku !== sku || receipt.version !== 1 ||
          !integer(receipt.cost) || typeof receipt.id !== "string") throw Error("INVALID_WALLET_RECEIPTS");
    }
    for (const [key, receipt] of Object.entries(rewards)) {
      if (!validId(key) || !record(receipt) || receipt.key !== key || receipt.version !== 1 ||
          !integer(receipt.amount) || !receipt.amount || typeof receipt.id !== "string") throw Error("INVALID_WALLET_RECEIPTS");
    }
    return { ...value, schema: 2, revision: value.revision ?? 0, diamonds: value.diamonds ?? 0, purchases, rewards };
  }

  function read() {
    try { return { ...load(), available: true }; }
    catch { return { diamonds: 0, purchases: {}, rewards: {}, available: false }; }
  }

  // Keep synchronous purchase / compensation logic inside one Web Lock.
  // No Promise can accidentally become a successful debit.
  function withTransaction(key, action) {
    if (transactionActive) return action();
    if (pending.has(key)) return pending.get(key);
    const run = async () => {
      if (!globalThis.navigator?.locks?.request) throw Error("WEB_LOCKS_REQUIRED");
      return navigator.locks.request(lockName, () => {
        transactionActive = true;
        try {
          const result = action();
          if (result && typeof result.then === "function") throw Error("WALLET_CALLBACK_MUST_BE_SYNCHRONOUS");
          return result;
        } finally { transactionActive = false; }
      });
    };
    const promise = run().finally(() => pending.delete(key));
    pending.set(key, promise);
    return promise;
  }

  function commit(value) {
    if (!transactionActive) throw Error("WALLET_TRANSACTION_REQUIRED");
    if (!integer(value.diamonds) || !integer(value.revision + 1)) throw Error("INVALID_WALLET_AMOUNT");
    const next = { ...value, revision: value.revision + 1, mutationId: crypto.randomUUID() };
    delete next.available;
    const serialized = JSON.stringify(next);
    try { localStorage.setItem(walletKey, serialized); }
    catch (error) {
      // An acknowledgement can fail after the write. Only exact durable bytes
      // prove this mutation; otherwise preserve the error and the saved assets.
      if (localStorage.getItem(walletKey) !== serialized) throw error;
    }
    if (localStorage.getItem(walletKey) !== serialized) throw Error("WALLET_COMMIT_UNCONFIRMED");
    if (typeof CustomEvent === "function") window.dispatchEvent?.(new CustomEvent("weightplay:wallet-change"));
    return { ...next, available: true };
  }

  function save(wallet) {
    if (!integer(wallet?.diamonds)) throw Error("INVALID_WALLET_AMOUNT");
    return commit({ ...load(), diamonds: wallet.diamonds });
  }
  function addDiamonds(amount) {
    if (!integer(amount)) throw Error("INVALID_WALLET_AMOUNT");
    const wallet = load();
    return commit({ ...wallet, diamonds: wallet.diamonds + amount });
  }
  function spendDiamonds(amount) {
    if (!integer(amount)) throw Error("INVALID_WALLET_AMOUNT");
    if (!transactionActive) throw Error("WALLET_TRANSACTION_REQUIRED");
    const wallet = load();
    if (wallet.diamonds < amount) return false;
    commit({ ...wallet, diamonds: wallet.diamonds - amount });
    return true;
  }
  const owns = sku => Boolean(read().purchases[sku]);

  function creditOnce(key, amount) {
    if (!validId(key) || !integer(amount) || amount < 1) throw Error("INVALID_REWARD");
    const wallet = load(), existing = wallet.rewards[key];
    if (existing) return { ok: true, alreadyClaimed: true, receipt: existing, diamonds: wallet.diamonds };
    const receipt = { version: 1, key, amount, id: crypto.randomUUID(), creditedAt: new Date().toISOString() };
    const next = commit({ ...wallet, diamonds: wallet.diamonds + amount, rewards: { ...wallet.rewards, [key]: receipt } });
    return { ok: true, alreadyClaimed: false, receipt, diamonds: next.diamonds };
  }
  async function awardOnce(key, amount) {
    try { return await withTransaction("reward:" + key, () => creditOnce(key, amount)); }
    catch { return { ok: false, reason: "storage" }; }
  }
  async function purchasePermanent(sku, cost) {
    if (!validId(sku) || !integer(cost)) return { ok: false, reason: "invalid" };
    try {
      return await withTransaction("purchase:" + sku, () => {
        const wallet = load();
        if (wallet.purchases[sku]) return { ok: true, alreadyOwned: true, receipt: wallet.purchases[sku] };
        if (wallet.diamonds < cost) return { ok: false, reason: "insufficient" };
        const receipt = { version: 1, sku, cost, id: crypto.randomUUID(), purchasedAt: new Date().toISOString() };
        commit({ ...wallet, diamonds: wallet.diamonds - cost, purchases: { ...wallet.purchases, [sku]: receipt } });
        return { ok: true, alreadyOwned: false, receipt };
      });
    } catch { return { ok: false, reason: "storage" }; }
  }
  window.WeightPlayWallet = Object.freeze({
    key: walletKey, read, save, addDiamonds, spendDiamonds, owns, purchasePermanent,
    withTransaction, awardOnce, creditOnce, inTransaction: () => transactionActive,
  });
})();
