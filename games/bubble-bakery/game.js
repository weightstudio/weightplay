(() => {
  const GAME_ID = "bubble-bakery";
  const localeKey = "weightplayLocale";
  const unlockKey = "weightplay_bubble_bakery_unlocked";
  const starKey = "weightplay_bubble_bakery_stars";
  const progressKey = "weightplay_bubble_bakery_progress";
  const statsKey = "weightplay_bubble_bakery_stats";

  const text = {
    en: {
      gameTitle: "Animal Bubble Bakery",
      language: "Language",
      chooseStage: "Choose Stage",
      menuHint: "Tap 2 or more connected matching bubbles to fill bakery orders.",
      startGame: "Start Game",
      back: "Back",
      stages: "Stages",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      moves: "Moves",
      score: "Score",
      stage: "Stage {n}",
      theme: "Order: {theme}",
      movesCount: "{n} moves",
      orderDone: "Order complete!",
      failed: "Try this order again.",
      resultWin: "You filled every order with {moves} moves left.",
      resultLose: "Collect the needed bubbles before moves run out.",
      smallGroup: "Tap 2 or more connected matching bubbles.",
      notOrderTarget: "Nice group, but the order needs the glowing animal bubbles.",
      orderStreak: "Order streak x{streak}! +{bonus}",
      collect: "Collect {n}",
      skillReport: "Skill Report",
      previousBest: "Previous Best",
      todayScore: "Today",
      improvement: "Improvement",
      logic: "Logic",
      focus: "Focus",
      problemSolving: "Problem Solving",
      reportGreat: "Great progress! Your child planned groups well and stayed focused.",
      reportGood: "Good effort! Try again to improve focus and finish more orders.",
      reportNewBest: "Amazing progress! This is a new best score for this stage.",
      themeCozyStart: "Cozy Bunny Box",
      themeOceanCupcakes: "Ocean Cupcakes",
      themeSunnyChickTray: "Sunny Chick Tray",
      themeGardenMix: "Garden Mix",
      themeFoxBerryCake: "Fox Berry Cake",
      themeWhaleMintRolls: "Whale Mint Rolls",
      themeRainbowCookies: "Rainbow Cookies",
      themeForestPicnic: "Forest Picnic",
      themePartyTray: "Party Tray",
      themeMasterBakery: "Master Bakery",
      bakeryProgress: "Bakery Progress",
      clearedStages: "Cleared {done}/{total}",
      totalStars: "Stars {stars}/{total}",
      nextGoal: "Next: clear {stage}",
      perfectOrders: "Mastered {done}/{total}",
      nextPerfectGoal: "Replay: master {stage}",
      allOrdersDone: "All bakery orders complete!",
      stageNew: "New",
      stageImprove: "Improve",
      stageMastered: "Mastered",
      coachName: "Panko the Bakery Coach",
      coachTip: "Plan the biggest matching group first, then save moves for the glowing order bubbles.",
      recommendedTitle: "Panko's Pick",
      recommendedCopy: "{stage} · {theme}",
      recommendedNew: "Clear this order to unlock the next bakery tray.",
      recommendedImprove: "Replay this order to earn more stars.",
      recommendedMastered: "Everything is mastered. Replay your newest favorite order.",
      startRecommended: "Start Pick",
      resultNextTitle: "Next bakery order",
      resultUnlocked: "New tray unlocked: {stage}",
      resultReplay: "Replay goal: earn more stars on {stage}",
      resultNextCopy: "{stage} · {theme}",
      resultAllClear: "All trays are open. Replay any order to master every star.",
      resultTryAgainGoal: "Try again: {stage} still needs these order bubbles.",
      customerStamps: "Customer Stamps",
      stampOrders: "Orders {orders}",
      stampStickers: "Stickers {stickers}",
      nextSticker: "{n} to next sticker",
      stickerReady: "Sticker ready!",
      resultStampWin: "Stamp +1 · {next}",
      resultStampLose: "Finish the order to earn a stamp.",
    },
    "zh-Hant": {
      gameTitle: "動物泡泡烘焙坊",
      language: "語言",
      chooseStage: "選擇關卡",
      menuHint: "點擊 2 個以上相連的相同動物泡泡，完成烘焙訂單。",
      startGame: "開始遊戲",
      back: "返回",
      stages: "關卡",
      loading: "載入中",
      nextStage: "下一關",
      retry: "再玩一次",
      lobby: "大廳",
      locked: "關卡尚未解鎖",
      moves: "步數",
      score: "分數",
      stage: "第 {n} 關",
      theme: "訂單：{theme}",
      movesCount: "{n} 步",
      orderDone: "訂單完成！",
      failed: "再挑戰一次這張訂單。",
      resultWin: "你完成了所有訂單，還剩 {moves} 步。",
      resultLose: "步數用完前，要收集訂單需要的泡泡。",
      smallGroup: "請點擊 2 個以上相連的相同泡泡。",
      notOrderTarget: "這組可以消除，但訂單需要發光的動物泡泡。",
      orderStreak: "訂單連擊 x{streak}！+{bonus}",
      collect: "收集 {n}",
      skillReport: "能力小報告",
      previousBest: "之前最佳",
      todayScore: "本次分數",
      improvement: "進步幅度",
      logic: "邏輯",
      focus: "專注",
      problemSolving: "解題",
      reportGreat: "很棒的進步！孩子有好好規劃泡泡群組，也維持了專注。",
      reportGood: "努力得很好！再試一次，可以練習更專注並完成更多訂單。",
      reportNewBest: "太棒了！這一關拿到新的最佳分數。",
      themeCozyStart: "兔兔暖心盒",
      themeOceanCupcakes: "海洋杯子蛋糕",
      themeSunnyChickTray: "小雞陽光盤",
      themeGardenMix: "花園綜合盤",
      themeFoxBerryCake: "狐狸莓果蛋糕",
      themeWhaleMintRolls: "鯨魚薄荷捲",
      themeRainbowCookies: "彩虹餅乾盤",
      themeForestPicnic: "森林野餐盒",
      themePartyTray: "派對點心盤",
      themeMasterBakery: "大師烘焙訂單",
      bakeryProgress: "烘焙進度",
      clearedStages: "已完成 {done}/{total}",
      totalStars: "星星 {stars}/{total}",
      nextGoal: "下一步：完成{stage}",
      perfectOrders: "精通 {done}/{total}",
      nextPerfectGoal: "重玩：精通{stage}",
      allOrdersDone: "全部烘焙訂單完成！",
      stageNew: "新關卡",
      stageImprove: "再提升",
      stageMastered: "已精通",
      coachName: "Panko 烘焙教練",
      coachTip: "先找最大的相同泡泡群，再把步數留給發光的訂單泡泡。",
      recommendedTitle: "Panko 推薦",
      recommendedCopy: "{stage} · {theme}",
      recommendedNew: "完成這張訂單，就能解鎖下一個烘焙盤。",
      recommendedImprove: "重玩這張訂單，試著拿到更多星星。",
      recommendedMastered: "全部都精通了！可以重玩最新喜歡的訂單。",
      startRecommended: "開始推薦",
      resultNextTitle: "下一張烘焙訂單",
      resultUnlocked: "新烘焙盤解鎖：{stage}",
      resultReplay: "重玩目標：在{stage}拿更多星星",
      resultNextCopy: "{stage} · {theme}",
      resultAllClear: "全部烘焙盤都開放了，重玩任何訂單來補滿星星。",
      resultTryAgainGoal: "再挑戰：{stage}還需要這些訂單泡泡。",
      customerStamps: "常客印章",
      stampOrders: "訂單 {orders}",
      stampStickers: "貼紙 {stickers}",
      nextSticker: "再 {n} 張換貼紙",
      stickerReady: "可以換貼紙了！",
      resultStampWin: "印章 +1 · {next}",
      resultStampLose: "完成訂單就能拿印章。",
    },
  };

  const colors = [
    { id: "berry", label: "Bunny", asset: "../../assets/bubble-bakery-bunny.png" },
    { id: "sky", label: "Whale", asset: "../../assets/bubble-bakery-whale.png" },
    { id: "lemon", label: "Chick", asset: "../../assets/bubble-bakery-chick.png" },
    { id: "mint", label: "Frog", asset: "../../assets/bubble-bakery-frog.png" },
    { id: "grape", label: "Fox", asset: "../../assets/bubble-bakery-fox.png" },
  ];

  const stages = [
    { theme: "themeCozyStart", moves: 16, palette: ["berry", "sky", "lemon"], orders: { berry: 8, sky: 8 } },
    { theme: "themeOceanCupcakes", moves: 17, palette: ["berry", "sky", "lemon", "mint"], orders: { sky: 10, lemon: 8 } },
    { theme: "themeSunnyChickTray", moves: 18, palette: ["berry", "sky", "lemon", "mint"], orders: { lemon: 12, berry: 8, mint: 6 } },
    { theme: "themeGardenMix", moves: 19, palette: ["berry", "sky", "lemon", "mint", "grape"], orders: { mint: 10, sky: 8, grape: 6 } },
    { theme: "themeFoxBerryCake", moves: 20, palette: ["berry", "sky", "lemon", "mint", "grape"], orders: { grape: 10, berry: 12 } },
    { theme: "themeWhaleMintRolls", moves: 21, palette: ["sky", "lemon", "mint", "grape"], orders: { sky: 12, mint: 12, lemon: 8 } },
    { theme: "themeRainbowCookies", moves: 22, palette: ["berry", "sky", "lemon", "mint", "grape"], orders: { berry: 10, lemon: 10, grape: 10 } },
    { theme: "themeForestPicnic", moves: 23, palette: ["berry", "lemon", "mint", "grape"], orders: { mint: 14, grape: 10, berry: 8 } },
    { theme: "themePartyTray", moves: 24, palette: ["berry", "sky", "lemon", "mint", "grape"], orders: { sky: 12, lemon: 12, mint: 12 } },
    { theme: "themeMasterBakery", moves: 25, palette: ["berry", "sky", "lemon", "mint", "grape"], orders: { berry: 12, sky: 12, grape: 12, mint: 8 } },
  ];

  const rows = 7;
  const cols = 7;
  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    mainPanel: $("mainPanel"),
    stagePanel: $("stagePanel"),
    startGameBtn: $("startGameBtn"),
    stageBackBtn: $("stageBackBtn"),
    recommendedOrder: $("recommendedOrder"),
    bakeryProgress: $("bakeryProgress"),
    stageGrid: $("stageGrid"),
    playPanel: $("playPanel"),
    backToStagesBtn: $("backToStagesBtn"),
    battleAdReserve: $("battleAdReserve"),
    movesText: $("movesText"),
    orderBar: $("orderBar"),
    board: $("board"),
    hintText: $("hintText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    starText: $("starText"),
    resultText: $("resultText"),
    resultNextOrder: $("resultNextOrder"),
    skillReport: $("skillReport"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };

  let locale = localStorage.getItem(localeKey) || "en";
  let unlocked = clamp(Number(localStorage.getItem(unlockKey)) || 1, 1, stages.length);
  let stars = readStars();
  let currentStage = 0;
  let board = [];
  let orders = {};
  let initialOrders = {};
  let moves = 0;
  let score = 0;
  let orderStreak = 0;
  let busy = false;
  const popMs = 620;
  const dropMs = 920;

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function playNodeAnimation(node, keyframes, options) {
    if (!node || typeof node.animate !== "function") return wait(options.duration || 0);
    const animation = node.animate(keyframes, options);
    return Promise.race([
      animation.finished.catch(() => undefined),
      wait((options.duration || 0) + 90),
    ]);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readStars() {
    try {
      return JSON.parse(localStorage.getItem(starKey) || "{}");
    } catch {
      return {};
    }
  }

  function saveStars() {
    localStorage.setItem(starKey, JSON.stringify(stars));
  }

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(progressKey) || "{}");
    } catch {
      return {};
    }
  }

  function saveProgress(progress) {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }

  function readStats() {
    try {
      const parsed = JSON.parse(localStorage.getItem(statsKey) || "{}");
      return {
        orders: Math.max(0, Number(parsed.orders || 0)),
        plays: Math.max(0, Number(parsed.plays || 0)),
        bestStage: Math.max(0, Number(parsed.bestStage || 0)),
        lastWinAt: parsed.lastWinAt || "",
      };
    } catch {
      return { orders: 0, plays: 0, bestStage: 0, lastWinAt: "" };
    }
  }

  function saveStats(stats) {
    localStorage.setItem(statsKey, JSON.stringify(stats));
  }

  function t(key, data = {}) {
    const value = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function colorData(id) {
    return colors.find((item) => item.id === id) || colors[0];
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function track(event, payload = {}) {
    window.WonderAnalytics?.track(event, { game_id: GAME_ID, ...payload });
  }

  function localizeStatic() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    document.querySelectorAll("[data-ui-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", t(node.dataset.uiAriaLabel));
    });
    nodes.localeSelect.value = locale;
  }

  function renderStageGrid() {
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const stageNo = index + 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-card";
      if (stageNo > unlocked) button.classList.add("locked");
      if (index === recommendedStageIndex()) button.classList.add("is-selected");
      const orderIcons = Object.keys(stage.orders).map((id) => `<img src="${colorData(id).asset}" alt="" />`).join("");
      const got = stars[stageNo] || 0;
      const badgeKey = got >= 3 ? "stageMastered" : got > 0 ? "stageImprove" : "stageNew";
      button.innerHTML = `
        <b class="stage-icons">${orderIcons}</b>
        <strong>${t("stage", { n: stageNo })}</strong>
        <small>${t(stage.theme)} · ${t("movesCount", { n: stage.moves })}</small>
        <span class="stage-stars">${starIcons(got, 3)}</span>
        <span class="stage-badge">${t(badgeKey)}</span>
      `;
      button.addEventListener("click", () => {
        if (stageNo > unlocked) {
          showFloat(t("locked"));
          playSound("click");
          return;
        }
        startStage(index);
      });
      nodes.stageGrid.appendChild(button);
    });
  }

  function recommendedStageIndex() {
    const firstImprove = stages.findIndex((_, index) => {
      const stageNo = index + 1;
      return stageNo <= unlocked && (stars[stageNo] || 0) < 3;
    });
    if (firstImprove >= 0) return firstImprove;
    return clamp(unlocked - 1, 0, stages.length - 1);
  }

  function renderRecommendedOrder() {
    const index = recommendedStageIndex();
    const stageNo = index + 1;
    const stage = stages[index];
    const got = stars[stageNo] || 0;
    const reasonKey = got >= 3 ? "recommendedMastered" : got > 0 ? "recommendedImprove" : "recommendedNew";
    const orderIcons = Object.keys(stage.orders).map((id) => `<img src="${colorData(id).asset}" alt="" />`).join("");
    nodes.recommendedOrder.innerHTML = `
      <div>
        <strong>${t("recommendedTitle")}</strong>
        <span>${t("recommendedCopy", { stage: t("stage", { n: stageNo }), theme: t(stage.theme) })}</span>
        <em>${t(reasonKey)}</em>
      </div>
      <b class="recommend-icons">${orderIcons}</b>
      <button type="button" data-recommended-stage="${index}">${t("startRecommended")}</button>
    `;
  }

  function renderBakeryProgress() {
    const totalStars = stages.length * 3;
    const earnedStars = stages.reduce((sum, _, index) => sum + (stars[index + 1] || 0), 0);
    const cleared = stages.reduce((sum, _, index) => sum + ((stars[index + 1] || 0) > 0 ? 1 : 0), 0);
    const mastered = stages.reduce((sum, _, index) => sum + ((stars[index + 1] || 0) >= 3 ? 1 : 0), 0);
    const stamp = stampProgress(readStats());
    const nextClearStage = Math.min(stages.length, Math.max(1, cleared + 1));
    const nextMasterStage = stages.findIndex((_, index) => (stars[index + 1] || 0) < 3 && index + 1 <= unlocked) + 1;
    const nextLabel = nextMasterStage > 0
      ? t("nextPerfectGoal", { stage: t("stage", { n: nextMasterStage }) })
      : cleared >= stages.length
      ? t("allOrdersDone")
      : t("nextGoal", { stage: t("stage", { n: nextClearStage }) });
    nodes.bakeryProgress.innerHTML = `
      <strong>${t("bakeryProgress")}</strong>
      <span>${t("clearedStages", { done: cleared, total: stages.length })}</span>
      <span>${t("totalStars", { stars: earnedStars, total: totalStars })}</span>
      <span>${t("perfectOrders", { done: mastered, total: stages.length })}</span>
      <em>${nextLabel}</em>
      <div class="stamp-card" aria-label="${t("customerStamps")}">
        <b>${t("customerStamps")}</b>
        <span>${t("stampOrders", { orders: stamp.orders })}</span>
        <span>${t("stampStickers", { stickers: stamp.stickers })}</span>
        <i><span style="transform: scaleX(${stamp.ratio})"></span></i>
        <small>${stamp.nextText}</small>
      </div>
    `;
  }

  function stampProgress(stats) {
    const cycle = 5;
    const orders = Math.max(0, Number(stats.orders || 0));
    const filled = orders % cycle;
    const visibleFilled = orders > 0 && filled === 0 ? cycle : filled;
    const next = visibleFilled >= cycle ? cycle : cycle - visibleFilled;
    return {
      orders,
      stickers: Math.floor(orders / cycle),
      ratio: visibleFilled / cycle,
      nextText: visibleFilled >= cycle ? t("stickerReady") : t("nextSticker", { n: next }),
    };
  }

  function recordFinishStats(won, stageNo) {
    const stats = readStats();
    stats.plays += 1;
    if (won) {
      stats.orders += 1;
      stats.bestStage = Math.max(stats.bestStage || 0, stageNo);
      stats.lastWinAt = new Date().toISOString();
    }
    saveStats(stats);
    return stampProgress(stats);
  }

  function showMain() {
    document.body.classList.remove("is-bakery-playing", "is-bakery-stage-select", "is-bakery-result");
    window.WEIGHTPLAY_BUBBLE_BAKERY_ACTIVE = false;
    window.dispatchEvent(new CustomEvent("bubble-bakery:play-state", { detail: { playing: false } }));
    nodes.mainPanel.classList.remove("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.battleAdReserve.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    busy = false;
  }

  function showStageSelect() {
    document.body.classList.remove("is-bakery-playing", "is-bakery-result");
    document.body.classList.add("is-bakery-stage-select");
    window.WEIGHTPLAY_BUBBLE_BAKERY_ACTIVE = false;
    window.dispatchEvent(new CustomEvent("bubble-bakery:play-state", { detail: { playing: false } }));
    nodes.mainPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.battleAdReserve.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    busy = false;
    renderRecommendedOrder();
    renderBakeryProgress();
    renderStageGrid();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function startStage(index) {
    currentStage = index;
    const stage = stages[index];
    orders = { ...stage.orders };
    initialOrders = { ...stage.orders };
    moves = stage.moves;
    score = 0;
    orderStreak = 0;
    busy = false;
    board = makeBoard(stage.palette);
    document.body.classList.remove("is-bakery-stage-select", "is-bakery-result");
    document.body.classList.add("is-bakery-playing");
    window.WEIGHTPLAY_BUBBLE_BAKERY_ACTIVE = true;
    window.dispatchEvent(new CustomEvent("bubble-bakery:play-state", { detail: { playing: true } }));
    nodes.mainPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.playPanel.classList.remove("hidden");
    nodes.battleAdReserve.classList.remove("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.hintText.textContent = t("smallGroup");
    nodes.orderBar.dataset.theme = t("theme", { theme: t(stage.theme) });
    renderAll();
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      nodes.playPanel.scrollIntoView?.({ block: "start", inline: "nearest", behavior: "auto" });
    });
    playSound("start");
    track("game_start", { level: index + 1 });
  }

  function makeBoard(palette) {
    const next = Array.from({ length: rows }, () => Array.from({ length: cols }, () => randomFrom(palette)));
    if (!hasPlayableGroup(next)) {
      next[0][0] = palette[0];
      next[0][1] = palette[0];
    }
    return next;
  }

  function randomFrom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function hasPlayableGroup(nextBoard) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = nextBoard[r][c];
        if (nextBoard[r + 1]?.[c] === id || nextBoard[r]?.[c + 1] === id) return true;
      }
    }
    return false;
  }

  function renderAll(dropMap = new Map()) {
    renderOrders();
    renderBoard(dropMap);
    updateHud();
  }

  function renderOrders() {
    nodes.orderBar.innerHTML = "";
    const progress = orderProgress();
    nodes.orderBar.classList.toggle("is-complete", progress.total > 0 && progress.done >= progress.total);
    const title = document.createElement("strong");
    title.className = "order-title";
    title.textContent = `${nodes.orderBar.dataset.theme || ""} · ${progress.done}/${progress.total}`;
    nodes.orderBar.appendChild(title);
    Object.entries(orders).forEach(([id, need]) => {
      const data = colorData(id);
      const remaining = Math.max(0, need);
      const chip = document.createElement("div");
      chip.className = "order-chip";
      chip.setAttribute("aria-label", `${data.label}: ${remaining}/${initialOrders[id]}`);
      chip.innerHTML = `<img class="order-icon" src="${data.asset}" alt="" /><span>${remaining}/${initialOrders[id]}</span>`;
      nodes.orderBar.appendChild(chip);
    });
    const meter = document.createElement("div");
    meter.className = "order-progress";
    meter.setAttribute("aria-hidden", "true");
    meter.innerHTML = `<i style="transform: scaleX(${progress.ratio})"></i><span>${progress.done}/${progress.total}</span>`;
    nodes.orderBar.appendChild(meter);
  }

  function orderProgress() {
    const total = Object.values(initialOrders).reduce((sum, need) => sum + Math.max(0, need), 0);
    const left = Object.values(orders).reduce((sum, need) => sum + Math.max(0, need), 0);
    const done = clamp(total - left, 0, total);
    return {
      total,
      done,
      ratio: total > 0 ? done / total : 0,
    };
  }

  function boardMetrics() {
    const styles = window.getComputedStyle(nodes.board);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const padLeft = parseFloat(styles.paddingLeft || "0") || 0;
    const padRight = parseFloat(styles.paddingRight || "0") || 0;
    const usableWidth = Math.max(1, nodes.board.clientWidth - padLeft - padRight - gap * (cols - 1));
    const cell = usableWidth / cols;
    return { pitch: cell + gap };
  }

  function renderBoard(dropMap = new Map()) {
    const { pitch } = boardMetrics();
    const groupInfo = buildGroupInfo();
    nodes.board.innerHTML = "";
    board.forEach((row, r) => {
      row.forEach((id, c) => {
        const data = colorData(id);
        const key = `${r},${c}`;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "bubble";
        button.style.visibility = "visible";
        button.style.opacity = "1";
        button.style.transform = "none";
        if ((orders[id] || 0) > 0) {
          button.classList.add("order-target");
        }
        const info = groupInfo.get(key);
        if (info?.size >= 2) {
          button.classList.add("match-ready");
          button.dataset.groupSize = String(info.size);
          if ((orders[id] || 0) > 0) button.classList.add("order-ready");
        }
        if (dropMap.has(key)) {
          const rowsToFall = dropMap.get(key);
          button.dataset.dropDistance = String(Math.max(1, rowsToFall) * pitch);
        }
        button.dataset.row = String(r);
        button.dataset.col = String(c);
        button.setAttribute("aria-label", data.label);
        button.innerHTML = `<img src="${data.asset}" alt="" draggable="false" /><span class="order-target-ring" aria-hidden="true"></span>`;
        button.addEventListener("click", () => popGroup(r, c));
        nodes.board.appendChild(button);
      });
    });
  }

  function buildGroupInfo() {
    const info = new Map();
    const visited = new Set();
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const key = `${r},${c}`;
        if (visited.has(key) || !board[r]?.[c]) continue;
        const { group } = groupFrom(r, c);
        group.forEach(([gr, gc]) => visited.add(`${gr},${gc}`));
        if (group.length < 2) continue;
        group.forEach(([gr, gc]) => {
          info.set(`${gr},${gc}`, { size: group.length });
        });
      }
    }
    return info;
  }

  function groupFrom(startR, startC) {
    const id = board[startR]?.[startC];
    if (!id) return { id, group: [] };
    const seen = new Set();
    const stack = [[startR, startC]];
    const group = [];
    while (stack.length) {
      const [r, c] = stack.pop();
      const key = `${r},${c}`;
      if (seen.has(key) || board[r]?.[c] !== id) continue;
      seen.add(key);
      group.push([r, c]);
      [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]].forEach(([nr, nc]) => {
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) stack.push([nr, nc]);
      });
    }
    return { id, group };
  }

  async function popGroup(r, c) {
    if (busy || moves <= 0) return;
    const { id, group } = groupFrom(r, c);
    if (group.length < 2) {
      nodes.hintText.textContent = t("smallGroup");
      playSound("error");
      return;
    }
    busy = true;
    const wasNeeded = (orders[id] || 0) > 0;
    moves -= 1;
    const baseScore = group.length * group.length * 5;
    let bonus = 0;
    if (wasNeeded) {
      orderStreak += 1;
      bonus = Math.round(group.length * 8 * Math.min(orderStreak, 5));
    } else {
      orderStreak = 0;
    }
    score += baseScore + bonus;
    if (orders[id] > 0) orders[id] = Math.max(0, orders[id] - group.length);
    if (bonus > 0) {
      nodes.hintText.textContent = t("orderStreak", { streak: Math.min(orderStreak, 5), bonus });
      showFloat(t("orderStreak", { streak: Math.min(orderStreak, 5), bonus }), window.innerWidth / 2, window.innerHeight * 0.5);
    } else {
      nodes.hintText.textContent = wasNeeded ? t("smallGroup") : t("notOrderTarget");
      showFloat(`+${baseScore}`, window.innerWidth / 2, window.innerHeight * 0.5);
    }
    playSound("pop");

    await markPopping(group);
    group.forEach(([gr, gc]) => {
      board[gr][gc] = null;
    });
    const dropMap = collapseBoard(stages[currentStage].palette);
    renderAll(dropMap);
    await animateDroppingBubbles();
    busy = false;
    if (isComplete()) return finish(true);
    if (moves <= 0) return finish(false);
  }

  function markPopping(group) {
    nodes.board.classList.add("is-popping");
    const popKeys = new Set(group.map(([r, c]) => `${r},${c}`));
    const popNodes = Array.from(nodes.board.querySelectorAll(".bubble")).filter((node) => popKeys.has(`${node.dataset.row},${node.dataset.col}`));
    const boardRect = nodes.board.getBoundingClientRect();
    const popLayer = document.createElement("div");
    popLayer.className = "bubble-pop-layer";

    nodes.board.querySelectorAll(".bubble").forEach((node) => {
      node.disabled = true;
    });

    nodes.board.appendChild(popLayer);

    const animations = popNodes.map((node) => {
      const rect = node.getBoundingClientRect();
      const ghost = node.cloneNode(true);
      ghost.classList.add("bubble-pop-ghost");
      ghost.classList.remove("pop");
      ghost.removeAttribute("data-row");
      ghost.removeAttribute("data-col");
      ghost.style.left = `${rect.left - boardRect.left}px`;
      ghost.style.top = `${rect.top - boardRect.top}px`;
      ghost.style.width = `${rect.width}px`;
      ghost.style.height = `${rect.height}px`;
      popLayer.appendChild(ghost);
      node.classList.add("is-pop-source");
      node.getAnimations?.().forEach((animation) => animation.cancel());
      ghost.getAnimations?.().forEach((animation) => animation.cancel());
      ghost.classList.add("pop");
      return playNodeAnimation(ghost, [
        { opacity: 1, transform: "scale(1)", filter: "brightness(1) saturate(1)" },
        { opacity: 1, transform: "scale(1.16)", filter: "brightness(1.22) saturate(1.16)", offset: 0.38 },
        { opacity: 0.72, transform: "scale(0.34) rotate(10deg)", filter: "brightness(1.38) saturate(1.22)", offset: 0.72 },
        { opacity: 0, transform: "scale(0.02) rotate(18deg)", filter: "brightness(1.45) saturate(1.25)" },
      ], {
        duration: popMs,
        easing: "cubic-bezier(.14,.78,.2,1)",
        fill: "forwards",
      }).then(() => {
        ghost.classList.remove("pop");
      });
    });

    return Promise.all(animations).then(() => {
      popLayer.remove();
      nodes.board.classList.remove("is-popping");
      return wait(30);
    });
  }

  function animateDroppingBubbles() {
    const dropping = Array.from(nodes.board.querySelectorAll("[data-drop-distance]"));
    if (!dropping.length) return wait(0);
    const animations = dropping.map((node) => {
      const distance = Number(node.dataset.dropDistance) || 96;
      node.disabled = true;
      return playNodeAnimation(node, [
        { opacity: 0.98, transform: `translateY(${-distance}px) scale(.985)` },
        { opacity: 1, transform: "translateY(0) scale(1)", offset: 0.62 },
        { opacity: 1, transform: "translateY(8%) scale(1.04, .95)", offset: 0.74 },
        { opacity: 1, transform: "translateY(-3.5%) scale(.985, 1.018)", offset: 0.86 },
        { opacity: 1, transform: "translateY(1.5%) scale(1.01, .992)", offset: 0.95 },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ], {
        duration: dropMs,
        easing: "cubic-bezier(.18,.72,.15,1.02)",
        fill: "both",
      });
    });

    return Promise.all(animations).then(() => {
      nodes.board.querySelectorAll(".bubble").forEach((node) => {
        node.getAnimations?.().forEach((animation) => animation.cancel());
        delete node.dataset.dropDistance;
        node.style.transform = "none";
        node.style.opacity = "1";
        node.style.visibility = "visible";
        node.disabled = false;
      });
      return wait(40);
    });
  }

  function collapseBoard(palette) {
    const next = Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));
    const dropMap = new Map();
    for (let c = 0; c < cols; c++) {
      const kept = [];
      for (let r = rows - 1; r >= 0; r--) {
        if (board[r][c]) kept.push({ id: board[r][c], from: r });
      }
      let target = rows - 1;
      kept.forEach((item) => {
        next[target][c] = item.id;
        if (item.from !== target) dropMap.set(`${target},${c}`, Math.max(1, target - item.from));
        target -= 1;
      });
      while (target >= 0) {
        next[target][c] = randomFrom(palette);
        dropMap.set(`${target},${c}`, rows + target + 1);
        target -= 1;
      }
    }
    board = next;
    return dropMap;
  }

  function isComplete() {
    return Object.values(orders).every((need) => need <= 0);
  }

  function updateHud() {
    nodes.movesText.textContent = moves;
  }

  function finish(won) {
    busy = true;
    document.body.classList.add("is-bakery-result");
    window.WEIGHTPLAY_BUBBLE_BAKERY_ACTIVE = false;
    window.dispatchEvent(new CustomEvent("bubble-bakery:play-state", { detail: { playing: false } }));
    const stageNo = currentStage + 1;
    const previousBest = Number(readProgress()[stageNo]?.bestScore || 0);
    let earned = 0;
    let unlockedStageNo = null;
    if (won) {
      earned = moves >= 7 ? 3 : moves >= 3 ? 2 : 1;
      stars[stageNo] = Math.max(stars[stageNo] || 0, earned);
      saveStars();
      if (stageNo === unlocked && unlocked < stages.length) {
        unlocked += 1;
        unlockedStageNo = unlocked;
        localStorage.setItem(unlockKey, String(unlocked));
      }
    }
    const stamp = recordFinishStats(won, stageNo);
    nodes.resultPanel.classList.remove("hidden");
    nodes.resultTitle.textContent = won ? t("orderDone") : t("failed");
    nodes.resultText.textContent = won ? t("resultWin", { moves }) : t("resultLose");
    nodes.starText.textContent = won ? starIcons(earned, 3) : t("failed");
    renderResultNextOrder({ won, stageNo, earned, unlockedStageNo, stamp });
    renderSkillReport({ stageNo, won, earned, previousBest });
    nodes.nextStageBtn.classList.toggle("hidden", !won || currentStage >= stages.length - 1);
    playSound(won ? "success" : "error");
    track("game_complete", { level: stageNo, success: won, score, moves_left: moves });
  }

  function renderResultNextOrder({ won, stageNo, earned, unlockedStageNo, stamp }) {
    const targetIndex = won ? recommendedStageIndex() : currentStage;
    const targetStage = stages[targetIndex] || stages[currentStage];
    const targetStageNo = targetIndex + 1;
    const orderIcons = Object.keys(targetStage.orders).map((id) => `<img src="${colorData(id).asset}" alt="" />`).join("");
    const statusText = won
      ? unlockedStageNo
        ? t("resultUnlocked", { stage: t("stage", { n: unlockedStageNo }) })
        : earned >= 3 && targetStageNo >= stages.length
          ? t("resultAllClear")
          : t("resultReplay", { stage: t("stage", { n: targetStageNo }) })
      : t("resultTryAgainGoal", { stage: t("stage", { n: stageNo }) });

    nodes.resultNextOrder.innerHTML = `
      <strong>${t("resultNextTitle")}</strong>
      <span>${statusText}</span>
      <em>${t("resultNextCopy", { stage: t("stage", { n: targetStageNo }), theme: t(targetStage.theme) })}</em>
      <small class="result-stamp">${won ? t("resultStampWin", { next: stamp.nextText }) : t("resultStampLose")}</small>
      <b class="result-order-icons">${orderIcons}</b>
    `;
  }

  function renderSkillReport({ stageNo, won, earned, previousBest }) {
    const stage = stages[currentStage];
    const moveRatio = moves / Math.max(1, stage.moves);
    const orderScore = won ? 5 : Math.max(1, 3 - Object.values(orders).filter((need) => need > 0).length);
    const skillScores = {
      logic: clamp(won ? earned + 2 : orderScore, 1, 5),
      focus: clamp(Math.round(moveRatio * 4) + (won ? 1 : 0), 1, 5),
      problemSolving: clamp(won ? Math.max(3, earned + 1) : orderScore, 1, 5),
    };
    const progress = readProgress();
    const previous = progress[stageNo] || {};
    const bestScore = Math.max(previousBest, score);
    const improvementPercent = previousBest > 0 ? Math.round(((score - previousBest) / previousBest) * 100) : (score > 0 ? 100 : 0);
    progress[stageNo] = {
      lastScore: score,
      bestScore,
      playCount: Number(previous.playCount || 0) + 1,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent,
      skillScores,
    };
    saveProgress(progress);

    const message = bestScore > previousBest && previousBest > 0 ? t("reportNewBest") : (won ? t("reportGreat") : t("reportGood"));
    const improvementText = improvementPercent > 0 ? `+${improvementPercent}%` : `${improvementPercent}%`;
    nodes.skillReport.innerHTML = `
      <strong>${t("skillReport")}</strong>
      <div class="skill-score-row"><span>${t("previousBest")}</span><b>${previousBest}</b></div>
      <div class="skill-score-row"><span>${t("todayScore")}</span><b>${score}</b></div>
      <div class="skill-score-row"><span>${t("improvement")}</span><b>${improvementText}</b></div>
      <div class="skill-stars"><span>${t("logic")}</span><b>${starIcons(skillScores.logic, 5)}</b></div>
      <div class="skill-stars"><span>${t("focus")}</span><b>${starIcons(skillScores.focus, 5)}</b></div>
      <div class="skill-stars"><span>${t("problemSolving")}</span><b>${starIcons(skillScores.problemSolving, 5)}</b></div>
      <p>${message}</p>
    `;
  }

  function starIcons(count, total) {
    return `${"★".repeat(count)}${"☆".repeat(total - count)}`;
  }

  function showFloat(message, x = window.innerWidth / 2, y = window.innerHeight / 2) {
    const bubble = document.createElement("div");
    bubble.className = "board-float";
    bubble.textContent = message;
    const safeX = clamp(Number(x) || window.innerWidth / 2, 88, Math.max(88, window.innerWidth - 88));
    const safeY = clamp(Number(y) || window.innerHeight / 2, 72, Math.max(72, window.innerHeight - 72));
    bubble.style.left = `${safeX}px`;
    bubble.style.top = `${safeY}px`;
    document.body.appendChild(bubble);
    window.setTimeout(() => bubble.remove(), 850);
  }

  function initLoading() {
    const assets = [
      "../../assets/bubble-bakery-cover.webp",
      "../../assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp",
      "assets/order-target-ring.png",
      ...colors.map((item) => item.asset),
    ];
    let loaded = 0;
    let released = false;
    const update = () => {
      const pct = Math.min(100, Math.round((loaded / assets.length) * 100));
      nodes.loadingText.textContent = `${pct}%`;
      nodes.loadingFill.style.width = `${pct}%`;
      if (pct >= 100 && !released) {
        released = true;
        nodes.loadingPanel.classList.add("hidden");
        track("game_ready");
      }
    };
    assets.forEach((src) => {
      const image = new Image();
      image.onload = image.onerror = () => {
        loaded += 1;
        update();
      };
      image.src = src;
    });
    update();
    window.setTimeout(() => {
      if (released) return;
      released = true;
      nodes.loadingText.textContent = "100%";
      nodes.loadingFill.style.width = "100%";
      nodes.loadingPanel.classList.add("hidden");
      track("game_ready", { fallback: true });
    }, 1200);
  }

  nodes.localeSelect.addEventListener("change", () => {
    locale = nodes.localeSelect.value;
    localStorage.setItem(localeKey, locale);
    if (window.WonderI18n?.locale?.() !== locale) {
      window.WonderI18n?.setLocale?.(locale);
    } else {
      window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    }
    localizeStatic();
    renderRecommendedOrder();
    renderBakeryProgress();
    renderStageGrid();
    if (!nodes.playPanel.classList.contains("hidden")) {
      nodes.orderBar.dataset.theme = t("theme", { theme: t(stages[currentStage].theme) });
      renderAll();
    }
  });
  nodes.startGameBtn.addEventListener("click", showStageSelect);
  nodes.stageBackBtn.addEventListener("click", showMain);
  nodes.backToStagesBtn.addEventListener("click", showStageSelect);
  nodes.recommendedOrder.addEventListener("click", (event) => {
    const button = event.target.closest("[data-recommended-stage]");
    if (!button) return;
    startStage(Number(button.dataset.recommendedStage || 0));
  });
  nodes.resultStagesBtn.addEventListener("click", showStageSelect);
  nodes.retryBtn.addEventListener("click", () => startStage(currentStage));
  nodes.nextStageBtn.addEventListener("click", () => startStage(Math.min(currentStage + 1, stages.length - 1)));
  document.querySelectorAll("img[data-fallback-src]").forEach((image) => {
    image.addEventListener("error", () => {
      const fallback = image.dataset.fallbackSrc;
      if (fallback && image.getAttribute("src") !== fallback) image.src = fallback;
    }, { once: true });
  });

  localizeStatic();
  showMain();
  renderRecommendedOrder();
  renderBakeryProgress();
  renderStageGrid();
  initLoading();
})();
