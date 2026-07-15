(() => {
  "use strict";

  const LOGICAL_WIDTH = 390;
  const LOGICAL_HEIGHT = 788;
  const AD_RESERVE = 56;
  const SAVE_KEY = "weightplay:animal-bubble-safari:v1";
  const FIRST_PLAY_KEY = "weightplay:animal-bubble-safari:tutorial:v1";
  const ASSET_ROOT = "../../assets/";

  const copy = {
    "zh-Hant": {
      title: "動物泡泡探險", internalTrial: "WeightPlay 內部測試", tagline: "瞄準、反彈，救出泡泡裡的動物！", progressLabel: "探險進度",
      loading: "準備探險", loadingError: "部分圖片未載入，將使用可用素材",
      startGame: "開始遊戲", guide: "玩法", chooseStage: "選擇關卡", album: "救援圖鑑", bestStars: "最佳星星",
      startLevel: "開始關卡", level: "關卡", shots: "剩餘", rescued: "目標", score: "分數",
      currentBubble: "目前", nextBubble: "下一顆", shotsLeft: "剩餘泡泡", rescuedAnimals: "救出動物",
      skillReport: "能力報告", retry: "再試一次", nextLevel: "下一關", backToMap: "返回關卡",
      howToPlay: "怎麼玩", guideAim: "拖曳瞄準同色泡泡，放開即可發射。", guideBank: "利用牆面反彈，繞過擋路的岩石。",
      guideRescue: "三顆以上相連會消除；在泡泡用完前救出目標。", gotIt: "知道了",
      aim: "拖曳瞄準，放開發射", directGoal: "配對 1 組同色泡泡", bankGoal: "用反彈射擊配對 1 組", rescueGoal: "救出泡泡裡的小斑馬",
      directSkill: "專注", bankSkill: "判斷", rescueSkill: "規劃", directHint: "對準上方兩顆藍色泡泡", bankHint: "瞄準左牆，讓泡泡反彈", rescueHint: "消除包住小斑馬的泡泡",
      success: "救援成功！", failed: "泡泡用完了", bounceNeeded: "這一關要先碰牆反彈！", noMatch: "再找找相同的動物泡泡", match: "配對成功！", rescuedNow: "動物得救了！",
      focusReport: "專注 · 手眼協調", logicReport: "空間判斷 · 手眼協調", rescueReport: "規劃 · 邏輯思考", locked: "尚未解鎖", completed: "已完成"
      ,rescueGoal: "救出動物泡泡", multiGoal: "完成 2 組同色配對", multiBankGoal: "利用反彈完成 2 組配對", doubleRescueGoal: "救出 2 隻動物",
      directHint: "瞄準同色泡泡完成配對", bankHint: "瞄準側牆，讓泡泡反彈", rescueHint: "消除動物周圍的同色泡泡", multiHint: "規劃射擊順序，完成兩組配對", doubleRescueHint: "先觀察路線，再救出兩隻動物",
      rainbowHint: "彩虹泡泡會變成撞到的泡泡顏色", lineHint: "橫掃泡泡會清除命中的整排泡泡", burstHint: "爆破泡泡會清除附近泡泡與障礙", swapHint: "交換泡泡會和撞到的泡泡互換顏色",
      rainbowUsed: "彩虹變色！", lineUsed: "橫掃整排！", burstUsed: "爆破清除！", swapUsed: "顏色交換！"
    },
    en: {
      title: "Animal Bubble Safari", internalTrial: "WeightPlay Internal Trial", tagline: "Aim, bank shots, and rescue bubble animals!", progressLabel: "Safari progress",
      loading: "Preparing Safari", loadingError: "Some images could not load; available art will be used",
      startGame: "Start Game", guide: "Guide", chooseStage: "Choose Stage", album: "Rescue Album", bestStars: "Best Stars",
      startLevel: "Start Level", level: "Level", shots: "Shots", rescued: "Goal", score: "Score",
      currentBubble: "Current", nextBubble: "Next", shotsLeft: "Shots Left", rescuedAnimals: "Animals Rescued",
      skillReport: "Skill Report", retry: "Retry", nextLevel: "Next Level", backToMap: "Back to Map",
      howToPlay: "How to Play", guideAim: "Drag to aim at matching bubbles, then release to shoot.", guideBank: "Bounce shots off a wall to get around rocks.",
      guideRescue: "Connect three or more. Rescue the target before shots run out.", gotIt: "Got It",
      aim: "Drag to aim, release to shoot", directGoal: "Make 1 matching group", bankGoal: "Make 1 group with a bank shot", rescueGoal: "Rescue an animal bubble",
      multiGoal: "Make 2 matching groups", multiBankGoal: "Make 2 groups with bank shots", doubleRescueGoal: "Rescue 2 animals",
      directSkill: "Focus", bankSkill: "Judgment", rescueSkill: "Planning", directHint: "Aim at matching bubbles to form a group", bankHint: "Aim at a side wall to bank the shot", rescueHint: "Clear matching bubbles around the animal", multiHint: "Plan the shot order and complete two matches", doubleRescueHint: "Study the routes, then rescue both animals",
      rainbowHint: "Rainbow matches the color of the bubble it hits", lineHint: "Line Clear removes the entire row it hits", burstHint: "Burst removes nearby bubbles and blockers", swapHint: "Swap exchanges colors with the bubble it hits",
      rainbowUsed: "Rainbow match!", lineUsed: "Row cleared!", burstUsed: "Burst cleared!", swapUsed: "Colors swapped!",
      success: "Rescue Complete!", failed: "Out of bubbles", bounceNeeded: "This level needs a wall bounce!", noMatch: "Look for matching animal bubbles", match: "Match complete!", rescuedNow: "Animal rescued!",
      focusReport: "Focus · Hand-Eye Coordination", logicReport: "Spatial Judgment · Coordination", rescueReport: "Planning · Logic", locked: "Locked", completed: "Complete"
    }
  };

  const stageDefs = [
    { id: 1, title: { "zh-Hant": "草原初遇", en: "Grassland Hello" }, goalKey: "directGoal", skillKey: "directSkill", hintKey: "directHint", shots: 6, target: "match", colors: [0,2,1,3,0,2], stars: [4,2], report: "focusReport" },
    { id: 2, title: { "zh-Hant": "峽谷反彈", en: "Canyon Bank" }, goalKey: "bankGoal", skillKey: "bankSkill", hintKey: "bankHint", shots: 7, target: "bank", colors: [3,1,0,2,3,1], stars: [5,2], report: "logicReport" },
    { id: 3, title: { "zh-Hant": "斑馬救援", en: "Zebra Rescue" }, goalKey: "rescueGoal", skillKey: "rescueSkill", hintKey: "rescueHint", shots: 8, target: "rescue", colors: [2,0,3,1,2,0], stars: [6,3], report: "rescueReport" }
    ,{ id: 4, title: { "zh-Hant": "河岸石陣", en: "River Stones" }, goalKey: "multiGoal", skillKey: "directSkill", hintKey: "multiHint", shots: 9, target: "match", requiredMatches: 2, colors: [1,3,0,2,1,3,0], stars: [6,3], report: "focusReport" }
    ,{ id: 5, title: { "zh-Hant": "樹葉岔路", en: "Leafy Fork" }, goalKey: "bankGoal", skillKey: "bankSkill", hintKey: "bankHint", shots: 9, target: "bank", requiredMatches: 1, colors: [0,2,3,1,0,2,3], stars: [6,3], report: "logicReport" }
    ,{ id: 6, title: { "zh-Hant": "長頸鹿朋友", en: "Giraffe Friend" }, goalKey: "rescueGoal", skillKey: "rescueSkill", hintKey: "rescueHint", shots: 10, target: "rescue", requiredRescues: 1, colors: [3,1,2,0,3,1,2], stars: [7,4], report: "rescueReport" }
    ,{ id: 7, title: { "zh-Hant": "蜂蜜迷陣", en: "Honey Maze" }, goalKey: "multiGoal", skillKey: "directSkill", hintKey: "multiHint", shots: 10, target: "match", requiredMatches: 2, colors: [2,0,1,3,2,0,1], stars: [7,4], report: "focusReport" }
    ,{ id: 8, title: { "zh-Hant": "雙壁反彈", en: "Twin Bank" }, goalKey: "multiBankGoal", skillKey: "bankSkill", hintKey: "multiHint", shots: 11, target: "bank", requiredMatches: 2, colors: [1,3,2,0,1,3,2,0], stars: [8,4], report: "logicReport" }
    ,{ id: 9, title: { "zh-Hant": "象群接力", en: "Elephant Relay" }, goalKey: "doubleRescueGoal", skillKey: "rescueSkill", hintKey: "rainbowHint", shots: 12, target: "rescue", requiredRescues: 2, colors: [0,2,1,3,0,2,1,3], powers: ["rainbow"], stars: [8,5], report: "rescueReport" }
    ,{ id: 10, title: { "zh-Hant": "雲端通道", en: "Cloud Passage" }, goalKey: "multiGoal", skillKey: "directSkill", hintKey: "lineHint", shots: 11, target: "match", requiredMatches: 2, colors: [3,0,2,1,3,0,2,1], powers: ["line"], stars: [8,5], report: "focusReport" }
    ,{ id: 11, title: { "zh-Hant": "河馬救援", en: "Hippo Rescue" }, goalKey: "doubleRescueGoal", skillKey: "rescueSkill", hintKey: "burstHint", shots: 13, target: "rescue", requiredRescues: 2, colors: [2,1,3,0,2,1,3,0], powers: ["burst"], stars: [9,5], report: "rescueReport" }
    ,{ id: 12, title: { "zh-Hant": "森林重聚", en: "Forest Reunion" }, goalKey: "doubleRescueGoal", skillKey: "rescueSkill", hintKey: "swapHint", shots: 14, target: "rescue", requiredRescues: 2, colors: [0,3,1,2,0,3,1,2,0], powers: ["swap"], stars: [10,6], report: "rescueReport" }
  ];

  const dom = Object.fromEntries([
    "viewport","gameCanvas","adReserve","loadingScreen","loadingCover","loadingPanel","loadingFill","loadingProgress","mainScreen","stageScreen","battleScreen","resultScreen","guideModal","stageRail","playCanvas",
    "mainProgress","albumCount","starCount","stageSkill","stageGoal","battleStageName","shotsLeft","rescueProgress","scoreValue","battleMessage","battleGoal",
    "currentPreview","nextPreview","resultTitle","resultStars","resultScore","resultShots","resultRescued","rewardStars","rewardCoins","rewardAlbum","skillText","nextStage"
  ].map(id => [id, document.getElementById(id)]));

  const ctx = dom.playCanvas.getContext("2d");
  const currentCtx = dom.currentPreview.getContext("2d");
  const nextCtx = dom.nextPreview.getContext("2d");
  const images = {};
  let locale = localStorage.getItem("weightplay:locale") === "en" ? "en" : "zh-Hant";
  let save = loadSave();
  let selectedStage = Math.min(save.unlocked, stageDefs.length);
  let currentScreen = "loading";
  let audioEnabled = save.audio !== false;
  let audioContext = null;
  let game = null;
  let animationFrame = 0;
  let resultTimer = 0;

  function loadSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
      return { unlocked: Math.max(1, Math.min(stageDefs.length, parsed.unlocked || 1)), bestStars: parsed.bestStars || {}, bestScore: parsed.bestScore || {}, rescued: parsed.rescued || {}, audio: parsed.audio !== false };
    } catch (_) {
      return { unlocked: 1, bestStars: {}, bestScore: {}, rescued: {}, audio: true };
    }
  }

  function persist() {
    save.audio = audioEnabled;
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }

  function t(key) { return copy[locale][key] || key; }

  function applyLocale() {
    document.documentElement.lang = locale;
    document.title = `${t("title")} | ${t("internalTrial")}`;
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-locale]").forEach(button => button.classList.toggle("is-selected", button.dataset.locale === locale));
    renderStageRail();
    updateMainProgress();
    if (game) updateHud();
  }

  function fitCanvas() {
    const vv = window.visualViewport;
    const width = vv ? vv.width : window.innerWidth;
    const height = vv ? vv.height : window.innerHeight;
    const reserve = currentScreen === "stage" || currentScreen === "battle" || currentScreen === "result"
      ? (window.WeightPlayAudience?.reserveHeight ?? AD_RESERVE)
      : 0;
    const scale = Math.min(width / LOGICAL_WIDTH, Math.max(1, height - reserve) / LOGICAL_HEIGHT);
    dom.gameCanvas.style.setProperty("--scale", String(scale));
    dom.gameCanvas.style.top = reserve === 0 ? "0" : "auto";
    dom.gameCanvas.style.bottom = reserve === 0 ? "auto" : "0";
    dom.viewport.classList.toggle("has-reserve", reserve > 0);
  }

  function showScreen(name) {
    currentScreen = name;
    document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("is-active"));
    document.getElementById(name + "Screen").classList.add("is-active");
    fitCanvas();
    track("screen_view", { screen: name });
  }

  function updateMainProgress() {
    const complete = Object.keys(save.bestStars).filter(id => save.bestStars[id] > 0).length;
    dom.mainProgress.textContent = `${Math.max(1, complete)} / ${stageDefs.length}`;
  }

  function renderStageRail() {
    dom.stageRail.innerHTML = "";
    stageDefs.forEach(stage => {
      const locked = stage.id > save.unlocked;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "stage-card" + (stage.id === selectedStage ? " is-selected" : "") + (locked ? " is-locked" : "");
      card.disabled = locked;
      const stars = save.bestStars[stage.id] || 0;
      card.innerHTML = `<img src="${ASSET_ROOT}animal-bubble-safari-bg.webp" alt=""><div><b>${stage.id}. ${stage.title[locale]}</b><span>${t(stage.goalKey)}</span><em>${"★".repeat(stars)}${"☆".repeat(3-stars)}</em><span>${locked ? t("locked") : stars ? t("completed") : t(stage.skillKey)}</span></div>`;
      card.addEventListener("click", () => startStage(stage.id));
      dom.stageRail.appendChild(card);
    });
    updateStageSummary();
    requestAnimationFrame(() => centerSelectedStage("auto"));
  }

  function selectStage(id, center) {
    if (id > save.unlocked) return;
    selectedStage = id;
    [...dom.stageRail.children].forEach((card, index) => card.classList.toggle("is-selected", index + 1 === id));
    updateStageSummary();
    if (center) centerSelectedStage("smooth");
  }

  function centerSelectedStage(behavior) {
    const card = dom.stageRail.children[selectedStage - 1];
    if (card) card.scrollIntoView({ behavior, inline: "center", block: "nearest" });
  }

  function updateStageSummary() {
    const stage = stageDefs[selectedStage - 1];
    const totalStars = Object.values(save.bestStars).reduce((sum, value) => sum + value, 0);
    const rescued = Object.values(save.rescued).filter(Boolean).length;
    dom.albumCount.textContent = `${rescued} / 5`;
    dom.starCount.textContent = `${totalStars} / ${stageDefs.length * 3}`;
    dom.stageSkill.textContent = t(stage.skillKey);
    dom.stageGoal.textContent = t(stage.goalKey);
  }

  function preload() {
    const sources = {
      bubbles: "animal-bubble-safari-bubbles.webp", rescue: "animal-bubble-safari-rescue-animals.webp",
      blockers: "animal-bubble-safari-blockers.webp", powers: "animal-bubble-safari-power-bubbles.png",
      launcher: "animal-bubble-safari-launcher.webp", effects: "animal-bubble-safari-shot-effects.webp"
    };
    const entries = Object.entries(sources);
    let settled = 0;
    const updateProgress = () => {
      const percent = Math.round(settled / entries.length * 100);
      dom.loadingFill.style.width = `${percent}%`;
      dom.loadingProgress.textContent = `${percent}%`;
    };
    updateProgress();
    return Promise.all(entries.map(([key, src]) => new Promise(resolve => {
      const image = new Image();
      const finish = loaded => {
        if (loaded) images[key] = image;
        settled += 1;
        updateProgress();
        resolve(loaded);
      };
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.src = ASSET_ROOT + src;
    })));
  }

  function makeBubble(x, y, type, extras = {}) { return { x, y, type, radius: 21, alive: true, blocker: false, rescue: false, ...extras }; }

  function stageLayout(id) {
    const layouts = {
      1: [[116,70,2],[160,70,0],[204,70,0],[248,70,3],[138,108,1],[182,108,0],[226,108,2]],
      2: [[92,70,3],[136,70,3],[224,70,1],[268,70,2],[114,108,2],[158,108,1],[246,108,0],[180,170,0,"blocker"],[224,170,0,"blocker"]],
      3: [[94,64,1],[138,64,0],[182,64,3],[226,64,1],[270,64,0],[116,102,3],[160,102,1],[204,102,0],[248,102,1],[116,140,0,"blocker"],[158,140,2],[202,140,2,"rescue",2],[246,140,2],[290,140,0,"blocker"]],
      4: [[72,64,1],[116,64,1],[160,64,3],[204,64,3],[248,64,0],[292,64,0],[94,102,2],[138,102,0,"blocker"],[182,102,2],[226,102,1,"blocker"],[270,102,2],[116,140,3],[160,140,1],[204,140,0],[248,140,3]],
      5: [[72,64,0],[116,64,2],[160,64,3],[204,64,1],[248,64,2],[292,64,0],[94,102,3],[138,102,1,"blocker"],[226,102,1,"blocker"],[270,102,3],[116,140,2],[160,140,0,"blocker"],[204,140,2,"blocker"],[248,140,0]],
      6: [[72,64,3],[116,64,1],[160,64,0],[204,64,2],[248,64,1],[292,64,3],[94,102,0],[138,102,3],[182,102,1],[226,102,2],[270,102,0],[116,140,0,"blocker"],[160,140,3],[204,140,3,"rescue",1],[248,140,3],[292,140,0,"blocker"]],
      7: [[72,64,2],[116,64,0],[160,64,2],[204,64,1],[248,64,3],[292,64,1],[94,102,1,"blocker"],[138,102,3],[182,102,0,"blocker"],[226,102,2],[270,102,0,"blocker"],[116,140,1],[160,140,2],[204,140,3],[248,140,0]],
      8: [[72,64,1],[116,64,3],[160,64,2],[204,64,0],[248,64,3],[292,64,1],[94,102,2],[138,102,0,"blocker"],[182,102,1,"blocker"],[226,102,2,"blocker"],[270,102,0],[72,140,3],[116,140,1],[248,140,1],[292,140,3]],
      9: [[72,64,0],[116,64,2],[160,64,1],[204,64,3],[248,64,2],[292,64,0],[94,102,1],[138,102,0],[182,102,2,"blocker"],[226,102,3],[270,102,1],[116,140,0],[160,140,0,"rescue",3],[204,140,1,"blocker"],[248,140,2,"rescue",0],[292,140,2]],
      10: [[72,64,3],[116,64,0],[160,64,2],[204,64,1],[248,64,0],[292,64,3],[94,102,2,"blocker"],[138,102,1],[182,102,3,"blocker"],[226,102,0],[270,102,2,"blocker"],[72,140,1],[116,140,3],[160,140,0],[204,140,2],[248,140,1],[292,140,3]],
      11: [[72,64,2],[116,64,1],[160,64,3],[204,64,0],[248,64,1],[292,64,2],[94,102,3],[138,102,2,"blocker"],[182,102,0],[226,102,3,"blocker"],[270,102,0],[94,140,1],[138,140,1,"rescue",4],[182,140,2,"blocker"],[226,140,3,"rescue",1],[270,140,3]],
      12: [[72,64,0],[116,64,3],[160,64,1],[204,64,2],[248,64,3],[292,64,0],[94,102,2,"blocker"],[138,102,0],[182,102,3,"blocker"],[226,102,1],[270,102,2,"blocker"],[72,140,1],[116,140,0,"rescue",0],[160,140,0],[204,140,2,"blocker"],[248,140,3,"rescue",4],[292,140,3]]
    };
    return (layouts[id] || layouts[1]).map(([x,y,type,kind,rescueIndex]) => makeBubble(x,y,type,{
      blocker: kind === "blocker", rescue: kind === "rescue", rescueIndex: rescueIndex || 0
    }));
  }

  function startStage(id) {
    clearTimeout(resultTimer);
    selectedStage = id;
    const def = stageDefs[id - 1];
    game = {
      def, bubbles: stageLayout(id), shots: def.shots, score: 0, rescued: 0, matches: 0,
      queue: [...def.colors], powerQueue: def.colors.map((_, index) => def.powers?.[index] || null),
      currentType: def.colors[0], nextType: def.colors[1], currentPower: def.powers?.[0] || null, nextPower: def.powers?.[1] || null,
      aiming: false, aimX: 180, aimY: 240, projectile: null, particles: [], state: "playing", elapsed: 0
    };
    dom.battleMessage.textContent = t(def.hintKey);
    showScreen("battle");
    updateHud();
    cancelAnimationFrame(animationFrame);
    loop(performance.now());
    track("level_start", { level: id });
  }

  function launcherPoint() { return { x: 180, y: 500 }; }

  function pointerPosition(event) {
    const rect = dom.playCanvas.getBoundingClientRect();
    const source = event.touches?.[0] || event.changedTouches?.[0] || event;
    return { x: (source.clientX - rect.left) * 360 / rect.width, y: (source.clientY - rect.top) * 548 / rect.height };
  }

  function beginAim(event) {
    if (!game || game.state !== "playing" || game.projectile) return;
    event.preventDefault();
    game.aiming = true;
    updateAim(event);
  }

  function updateAim(event) {
    if (!game?.aiming) return;
    event.preventDefault();
    const point = pointerPosition(event);
    game.aimX = Math.max(18, Math.min(342, point.x));
    game.aimY = Math.max(30, Math.min(478, point.y));
  }

  function releaseAim(event) {
    if (!game?.aiming || game.projectile) return;
    event.preventDefault();
    game.aiming = false;
    const origin = launcherPoint();
    let dx = game.aimX - origin.x;
    let dy = game.aimY - origin.y;
    if (dy > -40) dy = -40;
    const length = Math.hypot(dx, dy) || 1;
    game.projectile = { x: origin.x, y: origin.y - 28, vx: dx / length * 420, vy: dy / length * 420, type: game.currentType, power: game.currentPower, bounced: false };
    tone(420, .05);
    track("bubble_shot", { level: game.def.id });
  }

  function trajectory() {
    if (!game?.aiming) return [];
    const origin = launcherPoint();
    let dx = game.aimX - origin.x;
    let dy = Math.min(-40, game.aimY - origin.y);
    const length = Math.hypot(dx,dy) || 1;
    dx /= length; dy /= length;
    let x = origin.x, y = origin.y - 28;
    const points = [];
    for (let i=0;i<125;i++) {
      x += dx * 4.7; y += dy * 4.7;
      if (x < 19) { x = 19; dx *= -1; }
      if (x > 341) { x = 341; dx *= -1; }
      points.push({x,y});
      if (y < 20 || game.bubbles.some(b => b.alive && Math.hypot(b.x-x,b.y-y) < b.radius + 12)) break;
    }
    return points;
  }

  function updateProjectile(dt) {
    const p = game.projectile;
    if (!p) return;
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.x < 20) { p.x = 20; p.vx = Math.abs(p.vx); p.bounced = true; tone(680,.025); }
    if (p.x > 340) { p.x = 340; p.vx = -Math.abs(p.vx); p.bounced = true; tone(680,.025); }
    const hit = game.bubbles.find(b => b.alive && Math.hypot(b.x-p.x,b.y-p.y) < b.radius + 18);
    if (p.y <= 23 || hit) attachProjectile(hit);
  }

  function attachProjectile(hit) {
    const p = game.projectile;
    if (p.power === "rainbow" && hit && !hit.blocker) p.type = hit.type;
    if (p.power === "swap" && hit && !hit.blocker) [p.type, hit.type] = [hit.type, p.type];
    const spots = [];
    for (let row=0;row<11;row++) {
      const y = 30 + row * 38;
      const offset = row % 2 ? 22 : 0;
      for (let col=0;col<8;col++) spots.push({ x: 26 + offset + col*44, y });
    }
    const available = spots.filter(spot => !game.bubbles.some(b => b.alive && Math.hypot(b.x-spot.x,b.y-spot.y) < 28));
    available.sort((a,b) => Math.hypot(a.x-p.x,a.y-p.y) - Math.hypot(b.x-p.x,b.y-p.y));
    const spot = available[0] || { x: p.x, y: Math.max(24,p.y) };
    const added = makeBubble(spot.x,spot.y,p.type,{ shotBounced:p.bounced });
    game.bubbles.push(added);
    game.projectile = null;
    game.shots -= 1;
    if (p.power === "line" || p.power === "burst") {
      const effectX = hit?.x ?? added.x;
      const effectY = hit?.y ?? added.y;
      const affected = game.bubbles.filter(bubble => bubble.alive && (
        p.power === "line" ? Math.abs(bubble.y - effectY) <= 25 : Math.hypot(bubble.x - effectX, bubble.y - effectY) <= 82
      ));
      clearPower(affected, p.power);
      updateHud();
      return;
    }
    const group = connectedGroup(added);
    let matched = group.length >= 3;
    if (matched && game.def.target === "bank" && !p.bounced) {
      matched = false;
      dom.battleMessage.textContent = t("bounceNeeded");
    }
    if (matched) clearGroup(group, p.bounced);
    else {
      dom.battleMessage.textContent = t("noMatch");
      advanceQueue();
      checkEnd();
    }
    updateHud();
  }

  function neighbors(bubble) {
    return game.bubbles.filter(other => other !== bubble && other.alive && !other.blocker && Math.hypot(other.x-bubble.x,other.y-bubble.y) <= 51);
  }

  function connectedGroup(start) {
    const result = []; const queue = [start]; const seen = new Set();
    while (queue.length) {
      const bubble = queue.shift();
      if (seen.has(bubble) || !bubble.alive || bubble.blocker || bubble.type !== start.type) continue;
      seen.add(bubble); result.push(bubble); neighbors(bubble).forEach(next => queue.push(next));
    }
    return result;
  }

  function clearGroup(group, bounced) {
    group.forEach(bubble => {
      bubble.alive = false;
      game.particles.push({ x:bubble.x,y:bubble.y,life:.45,type:bubble.rescue ? 3 : 2 });
      if (bubble.rescue) game.rescued += 1;
    });
    game.matches += 1;
    game.score += group.length * 120 + (bounced ? 180 : 0) + game.rescued * 300;
    dom.battleMessage.textContent = game.rescued ? t("rescuedNow") : t("match");
    tone(game.rescued ? 920 : 760, .12);
    advanceQueue();
    checkEnd();
  }

  function clearPower(group, power) {
    let cleared = 0;
    group.forEach(bubble => {
      if (!bubble.alive) return;
      bubble.alive = false;
      cleared += 1;
      game.particles.push({ x:bubble.x,y:bubble.y,life:.55,type:power === "burst" ? 2 : 1 });
      if (bubble.rescue) game.rescued += 1;
    });
    game.matches += 1;
    game.score += cleared * 140 + 260;
    dom.battleMessage.textContent = t(`${power}Used`);
    tone(power === "burst" ? 980 : 860, .14);
    advanceQueue();
    checkEnd();
  }

  function advanceQueue() {
    game.queue.shift();
    game.powerQueue.shift();
    if (game.queue.length < 2) game.queue.push((game.currentType + game.shots + 2) % 4);
    while (game.powerQueue.length < game.queue.length) game.powerQueue.push(null);
    game.currentType = game.queue[0];
    game.nextType = game.queue[1];
    game.currentPower = game.powerQueue[0] || null;
    game.nextPower = game.powerQueue[1] || null;
  }

  function checkEnd() {
    const required = game.def.target === "rescue" ? (game.def.requiredRescues || 1) : (game.def.requiredMatches || 1);
    const won = game.def.target === "rescue" ? game.rescued >= required : game.matches >= required;
    if (won) return finishStage(true);
    if (game.shots <= 0) finishStage(false);
  }

  function finishStage(won) {
    game.state = "finished";
    const completedGame = game;
    clearTimeout(resultTimer);
    resultTimer = setTimeout(() => {
      if (game === completedGame && currentScreen === "battle") showResult(won);
    }, 520);
  }

  function showResult(won) {
    const starLimits = game.def.stars;
    const stars = won ? (game.shots >= starLimits[0] ? 3 : game.shots >= starLimits[1] ? 2 : 1) : 0;
    dom.resultTitle.textContent = won ? t("success") : t("failed");
    dom.resultStars.textContent = "★".repeat(stars) + "☆".repeat(3-stars);
    dom.resultScore.textContent = game.score;
    dom.resultShots.textContent = Math.max(0,game.shots);
    dom.resultRescued.textContent = game.rescued;
    dom.rewardStars.textContent = `+${stars}`;
    dom.rewardCoins.textContent = `+${won ? 20 + game.score/60|0 : 0}`;
    dom.rewardAlbum.textContent = `+${game.rescued}`;
    dom.skillText.textContent = t(game.def.report);
    dom.nextStage.hidden = !won || game.def.id >= stageDefs.length;
    document.querySelector(".result-actions").classList.toggle("single-primary", dom.nextStage.hidden);
    if (won) {
      save.bestStars[game.def.id] = Math.max(save.bestStars[game.def.id] || 0, stars);
      save.bestScore[game.def.id] = Math.max(save.bestScore[game.def.id] || 0, game.score);
      if (game.rescued) save.rescued[game.def.id] = true;
      save.unlocked = Math.max(save.unlocked, Math.min(stageDefs.length, game.def.id + 1));
      persist();
    }
    showScreen("result");
    track("level_complete", { level: game.def.id, won, score: game.score, stars });
  }

  function updateHud() {
    if (!game) return;
    dom.battleStageName.textContent = game.def.id;
    dom.shotsLeft.textContent = game.shots;
    const progress = game.def.target === "rescue" ? game.rescued : game.matches;
    const required = game.def.target === "rescue" ? (game.def.requiredRescues || 1) : (game.def.requiredMatches || 1);
    dom.rescueProgress.textContent = `${progress} / ${required}`;
    dom.scoreValue.textContent = game.score;
    dom.battleGoal.textContent = t(game.def.goalKey);
    drawPreview(currentCtx, game.currentType, game.currentPower);
    drawPreview(nextCtx, game.nextType, game.nextPower);
  }

  function atlasBubble(context, type, x, y, size) {
    if (!images.bubbles?.complete) return;
    const cellW = images.bubbles.width / 5, cellH = images.bubbles.height / 2;
    const index = type % 10, col = index % 5, row = Math.floor(index / 5);
    context.drawImage(images.bubbles, col*cellW,row*cellH,cellW,cellH,x-size/2,y-size/2,size,size);
  }

  function atlasRescue(context, index, x, y, size) {
    if (!images.rescue?.complete) return;
    const cellW = images.rescue.width / 5;
    context.drawImage(images.rescue,index*cellW,0,cellW,images.rescue.height,x-size/2,y-size/2,size,size);
  }

  function atlasBlocker(context, index, x, y, size) {
    if (!images.blockers?.complete) return;
    const cellW = images.blockers.width / 4;
    context.drawImage(images.blockers,index*cellW,0,cellW,images.blockers.height,x-size/2,y-size/2,size,size);
  }

  function atlasPower(context, power, x, y, size) {
    if (!images.powers?.complete) return;
    const index = { rainbow:0, line:1, burst:2, swap:3 }[power] ?? 0;
    const cellW = images.powers.width / 4;
    context.drawImage(images.powers,index*cellW,0,cellW,images.powers.height,x-size/2,y-size/2,size,size);
  }

  function atlasEffect(context, index, x, y, size, alpha) {
    if (!images.effects?.complete) return;
    const cellW = images.effects.width / 4;
    context.save(); context.globalAlpha = alpha;
    context.drawImage(images.effects,index*cellW,0,cellW,images.effects.height,x-size/2,y-size/2,size,size);
    context.restore();
  }

  function drawPreview(context, type, power) {
    context.clearRect(0,0,48,48);
    if (power) atlasPower(context,power,24,24,46);
    else atlasBubble(context,type,24,24,46);
  }

  function drawGame() {
    ctx.clearRect(0,0,360,548);
    ctx.save(); ctx.fillStyle = "rgba(7,42,58,.18)"; ctx.fillRect(0,0,360,548); ctx.restore();
    if (game.aiming && !game.projectile) {
      const points = trajectory();
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.92)";
      points.forEach((point,index) => { if (index % 3 === 0) { ctx.beginPath(); ctx.arc(point.x,point.y,2.4,0,Math.PI*2); ctx.fill(); } });
      ctx.restore();
    }
    game.bubbles.forEach(bubble => {
      if (!bubble.alive) return;
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.26)"; ctx.shadowBlur = 5; ctx.shadowOffsetY = 3;
      if (bubble.blocker) atlasBlocker(ctx,0,bubble.x,bubble.y,46);
      else atlasBubble(ctx,bubble.type,bubble.x,bubble.y,46);
      ctx.restore();
      if (bubble.rescue) {
        ctx.save(); ctx.globalAlpha=.96; atlasRescue(ctx,bubble.rescueIndex,bubble.x,bubble.y,35); ctx.restore();
        ctx.strokeStyle="#fff4a8"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(bubble.x,bubble.y,22,0,Math.PI*2); ctx.stroke();
      }
    });
    if (game.projectile) {
      if (game.projectile.power) atlasPower(ctx,game.projectile.power,game.projectile.x,game.projectile.y,44);
      else atlasBubble(ctx,game.projectile.type,game.projectile.x,game.projectile.y,44);
    }
    const launcher = launcherPoint();
    if (images.launcher?.complete) ctx.drawImage(images.launcher,launcher.x-53,launcher.y-39,106,106);
    if (!game.projectile) {
      if (game.currentPower) atlasPower(ctx,game.currentPower,launcher.x,launcher.y-30,42);
      else atlasBubble(ctx,game.currentType,launcher.x,launcher.y-30,42);
    }
    game.particles.forEach(p => atlasEffect(ctx,p.type,p.x,p.y,70,p.life/.45));
  }

  function loop(now) {
    if (!game || currentScreen !== "battle") return;
    const dt = Math.min(.025,(now-game.elapsed)/1000 || 0); game.elapsed=now;
    if (game.state === "playing") updateProjectile(dt);
    game.particles.forEach(p => p.life -= dt); game.particles = game.particles.filter(p => p.life > 0);
    drawGame();
    animationFrame = requestAnimationFrame(loop);
  }

  function tone(frequency, duration) {
    if (!audioEnabled) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
      oscillator.frequency.value=frequency; gain.gain.setValueAtTime(.06,audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);
      oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime+duration);
    } catch (_) {}
  }

  function toggleSound() { audioEnabled=!audioEnabled; persist(); document.querySelectorAll("#soundMain,#soundStage").forEach(button => button.textContent=audioEnabled?"♪":"×"); tone(520,.06); }
  function track(event, details={}) { try { window.WonderAnalytics?.track?.(event,{ game:"animal-bubble-safari",...details }); } catch (_) {} }
  function openGuide() { dom.guideModal.hidden=false; localStorage.setItem(FIRST_PLAY_KEY,"seen"); }
  function closeGuide() { dom.guideModal.hidden=true; }

  window.__animalBubbleSafariTest = {
    stageDefs,
    getState: () => ({
      screen: currentScreen, selectedStage, unlocked: save.unlocked, stageId: game?.def.id || null,
      currentPower: game?.currentPower || null, nextPower: game?.nextPower || null,
      matches: game?.matches || 0, rescued: game?.rescued || 0,
      alive: game?.bubbles.filter(bubble => bubble.alive).length || 0,
      blockers: game?.bubbles.filter(bubble => bubble.alive && bubble.blocker).length || 0,
      bubbleTypes: game?.bubbles.filter(bubble => bubble.alive && !bubble.blocker).map(bubble => ({ x:bubble.x, y:bubble.y, type:bubble.type })) || []
    }),
    getLayoutSummary: id => {
      const bubbles = stageLayout(id);
      return {
        id,
        count: bubbles.length,
        blockers: bubbles.filter(bubble => bubble.blocker).length,
        rescues: bubbles.filter(bubble => bubble.rescue).length,
        signature: bubbles.map(bubble => `${bubble.x},${bubble.y},${bubble.type},${bubble.blocker ? "b" : bubble.rescue ? `r${bubble.rescueIndex}` : "n"}`).join("|")
      };
    }
  };

  document.getElementById("startGame").addEventListener("click", () => { renderStageRail(); showScreen("stage"); });
  document.getElementById("stageBack").addEventListener("click", () => { showScreen("main"); updateMainProgress(); });
  document.getElementById("battleBack").addEventListener("click", () => { clearTimeout(resultTimer); game=null; cancelAnimationFrame(animationFrame); renderStageRail(); showScreen("stage"); });
  document.getElementById("retryStage").addEventListener("click", () => startStage(game.def.id));
  document.getElementById("nextStage").addEventListener("click", () => startStage(Math.min(stageDefs.length,game.def.id+1)));
  document.getElementById("backToMap").addEventListener("click", () => { renderStageRail(); showScreen("stage"); });
  document.getElementById("openGuide").addEventListener("click", openGuide);
  document.getElementById("closeGuide").addEventListener("click", closeGuide);
  document.getElementById("guideDone").addEventListener("click", closeGuide);
  document.getElementById("soundMain").addEventListener("click", toggleSound);
  document.getElementById("soundStage").addEventListener("click", toggleSound);
  document.querySelectorAll("[data-locale]").forEach(button => button.addEventListener("click", () => { locale=button.dataset.locale; localStorage.setItem("weightplay:locale",locale); applyLocale(); }));
  dom.playCanvas.addEventListener("pointerdown", beginAim);
  dom.playCanvas.addEventListener("pointermove", updateAim);
  window.addEventListener("pointerup", releaseAim);
  window.addEventListener("pointercancel", () => { if (game) game.aiming=false; });
  window.addEventListener("resize", fitCanvas);
  window.visualViewport?.addEventListener("resize", fitCanvas);

  applyLocale();
  fitCanvas();
  const revealLoadingCover = () => dom.loadingCover.classList.add("is-ready");
  if (dom.loadingCover.complete && dom.loadingCover.naturalWidth > 0) revealLoadingCover();
  else dom.loadingCover.addEventListener("load", revealLoadingCover, { once: true });
  preload().then(results => {
    const hasError = results.some(loaded => !loaded);
    if (hasError) {
      dom.loadingPanel.classList.add("has-error");
      dom.loadingPanel.querySelector("strong").textContent = t("loadingError");
    }
    window.setTimeout(() => {
      showScreen("main");
      if (!localStorage.getItem(FIRST_PLAY_KEY)) openGuide();
    }, hasError ? 700 : 120);
  });
})();
