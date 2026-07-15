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
      title: "動物泡泡探險", tagline: "瞄準、反彈，救出泡泡裡的動物！", progressLabel: "探險進度",
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
    },
    en: {
      title: "Animal Bubble Safari", tagline: "Aim, bank shots, and rescue bubble animals!", progressLabel: "Safari progress",
      startGame: "Start Game", guide: "Guide", chooseStage: "Choose Stage", album: "Rescue Album", bestStars: "Best Stars",
      startLevel: "Start Level", level: "Level", shots: "Shots", rescued: "Goal", score: "Score",
      currentBubble: "Current", nextBubble: "Next", shotsLeft: "Shots Left", rescuedAnimals: "Animals Rescued",
      skillReport: "Skill Report", retry: "Retry", nextLevel: "Next Level", backToMap: "Back to Map",
      howToPlay: "How to Play", guideAim: "Drag to aim at matching bubbles, then release to shoot.", guideBank: "Bounce shots off a wall to get around rocks.",
      guideRescue: "Connect three or more. Rescue the target before shots run out.", gotIt: "Got It",
      aim: "Drag to aim, release to shoot", directGoal: "Make 1 matching group", bankGoal: "Make 1 group with a bank shot", rescueGoal: "Rescue the zebra bubble",
      directSkill: "Focus", bankSkill: "Judgment", rescueSkill: "Planning", directHint: "Aim at the two blue bubbles", bankHint: "Aim at the left wall to bank the shot", rescueHint: "Clear the bubbles around the zebra",
      success: "Rescue Complete!", failed: "Out of bubbles", bounceNeeded: "This level needs a wall bounce!", noMatch: "Look for matching animal bubbles", match: "Match complete!", rescuedNow: "Animal rescued!",
      focusReport: "Focus · Hand-Eye Coordination", logicReport: "Spatial Judgment · Coordination", rescueReport: "Planning · Logic", locked: "Locked", completed: "Complete"
    }
  };

  const stageDefs = [
    { id: 1, title: { "zh-Hant": "草原初遇", en: "Grassland Hello" }, goalKey: "directGoal", skillKey: "directSkill", hintKey: "directHint", shots: 6, target: "match", colors: [0,2,1,3,0,2], stars: [4,2], report: "focusReport" },
    { id: 2, title: { "zh-Hant": "峽谷反彈", en: "Canyon Bank" }, goalKey: "bankGoal", skillKey: "bankSkill", hintKey: "bankHint", shots: 7, target: "bank", colors: [3,1,0,2,3,1], stars: [5,2], report: "logicReport" },
    { id: 3, title: { "zh-Hant": "斑馬救援", en: "Zebra Rescue" }, goalKey: "rescueGoal", skillKey: "rescueSkill", hintKey: "rescueHint", shots: 8, target: "rescue", colors: [2,0,3,1,2,0], stars: [6,3], report: "rescueReport" }
  ];

  const dom = Object.fromEntries([
    "viewport","gameCanvas","adReserve","mainScreen","stageScreen","battleScreen","resultScreen","guideModal","stageRail","playCanvas",
    "mainProgress","albumCount","starCount","stageSkill","stageGoal","playStage","battleStageName","shotsLeft","rescueProgress","scoreValue","battleMessage","battleGoal",
    "currentPreview","nextPreview","resultTitle","resultStars","resultScore","resultShots","resultRescued","rewardStars","rewardCoins","rewardAlbum","skillText","nextStage"
  ].map(id => [id, document.getElementById(id)]));

  const ctx = dom.playCanvas.getContext("2d");
  const currentCtx = dom.currentPreview.getContext("2d");
  const nextCtx = dom.nextPreview.getContext("2d");
  const images = {};
  let locale = localStorage.getItem("weightplay:locale") === "en" ? "en" : "zh-Hant";
  let save = loadSave();
  let selectedStage = Math.min(save.unlocked, 3);
  let currentScreen = "main";
  let audioEnabled = save.audio !== false;
  let audioContext = null;
  let game = null;
  let animationFrame = 0;

  function loadSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
      return { unlocked: Math.max(1, Math.min(3, parsed.unlocked || 1)), bestStars: parsed.bestStars || {}, bestScore: parsed.bestScore || {}, rescued: parsed.rescued || {}, audio: parsed.audio !== false };
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
    const reserve = currentScreen === "main" ? 0 : AD_RESERVE;
    const scale = Math.min(width / LOGICAL_WIDTH, Math.max(1, height - reserve) / LOGICAL_HEIGHT);
    dom.gameCanvas.style.setProperty("--scale", String(scale));
    dom.gameCanvas.style.top = currentScreen === "main" ? "0" : "auto";
    dom.gameCanvas.style.bottom = currentScreen === "main" ? "auto" : "0";
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
    dom.mainProgress.textContent = `${Math.max(1, complete)} / 3`;
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
      card.addEventListener("click", () => selectStage(stage.id, true));
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
    dom.albumCount.textContent = `${rescued} / 3`;
    dom.starCount.textContent = `${totalStars} / 9`;
    dom.stageSkill.textContent = t(stage.skillKey);
    dom.stageGoal.textContent = t(stage.goalKey);
  }

  function preload() {
    const sources = {
      bubbles: "animal-bubble-safari-bubbles.webp", rescue: "animal-bubble-safari-rescue-animals.webp",
      blockers: "animal-bubble-safari-blockers.webp", launcher: "animal-bubble-safari-launcher.webp", effects: "animal-bubble-safari-shot-effects.webp"
    };
    return Promise.all(Object.entries(sources).map(([key, src]) => new Promise(resolve => {
      const image = new Image(); image.onload = () => { images[key] = image; resolve(); }; image.onerror = resolve; image.src = ASSET_ROOT + src;
    })));
  }

  function makeBubble(x, y, type, extras = {}) { return { x, y, type, radius: 21, alive: true, blocker: false, rescue: false, ...extras }; }

  function stageLayout(id) {
    if (id === 1) return [
      makeBubble(116,70,2), makeBubble(160,70,0), makeBubble(204,70,0), makeBubble(248,70,3),
      makeBubble(138,108,1), makeBubble(182,108,0), makeBubble(226,108,2)
    ];
    if (id === 2) return [
      makeBubble(92,70,3), makeBubble(136,70,3), makeBubble(224,70,1), makeBubble(268,70,2),
      makeBubble(114,108,2), makeBubble(158,108,1), makeBubble(246,108,0),
      makeBubble(180,170,0,{ blocker:true }), makeBubble(224,170,0,{ blocker:true })
    ];
    return [
      makeBubble(94,64,1), makeBubble(138,64,0), makeBubble(182,64,3), makeBubble(226,64,1), makeBubble(270,64,0),
      makeBubble(116,102,3), makeBubble(160,102,1), makeBubble(204,102,0), makeBubble(248,102,1),
      makeBubble(116,140,0,{ blocker:true }), makeBubble(158,140,2), makeBubble(202,140,2,{ rescue:true,rescueIndex:2 }), makeBubble(246,140,2), makeBubble(290,140,0,{ blocker:true })
    ];
  }

  function startStage(id) {
    selectedStage = id;
    const def = stageDefs[id - 1];
    game = {
      def, bubbles: stageLayout(id), shots: def.shots, score: 0, rescued: 0, matches: 0,
      queue: [...def.colors], currentType: def.colors[0], nextType: def.colors[1],
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
    game.projectile = { x: origin.x, y: origin.y - 28, vx: dx / length * 420, vy: dy / length * 420, type: game.currentType, bounced: false };
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

  function advanceQueue() {
    game.queue.shift();
    if (game.queue.length < 2) game.queue.push((game.currentType + game.shots + 2) % 4);
    game.currentType = game.queue[0];
    game.nextType = game.queue[1];
  }

  function checkEnd() {
    const won = game.def.target === "rescue" ? game.rescued >= 1 : game.matches >= 1 && (game.def.target !== "bank" || game.score >= 540);
    if (won) return finishStage(true);
    if (game.shots <= 0) finishStage(false);
  }

  function finishStage(won) {
    game.state = "finished";
    setTimeout(() => showResult(won), 520);
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
    dom.nextStage.hidden = !won || game.def.id >= 3;
    document.querySelector(".result-actions").classList.toggle("single-primary", dom.nextStage.hidden);
    if (won) {
      save.bestStars[game.def.id] = Math.max(save.bestStars[game.def.id] || 0, stars);
      save.bestScore[game.def.id] = Math.max(save.bestScore[game.def.id] || 0, game.score);
      if (game.rescued) save.rescued[game.def.id] = true;
      save.unlocked = Math.max(save.unlocked, Math.min(3, game.def.id + 1));
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
    dom.rescueProgress.textContent = `${progress} / 1`;
    dom.scoreValue.textContent = game.score;
    dom.battleGoal.textContent = t(game.def.goalKey);
    drawPreview(currentCtx, game.currentType);
    drawPreview(nextCtx, game.nextType);
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

  function atlasEffect(context, index, x, y, size, alpha) {
    if (!images.effects?.complete) return;
    const cellW = images.effects.width / 4;
    context.save(); context.globalAlpha = alpha;
    context.drawImage(images.effects,index*cellW,0,cellW,images.effects.height,x-size/2,y-size/2,size,size);
    context.restore();
  }

  function drawPreview(context, type) { context.clearRect(0,0,48,48); atlasBubble(context,type,24,24,46); }

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
    if (game.projectile) atlasBubble(ctx,game.projectile.type,game.projectile.x,game.projectile.y,44);
    const launcher = launcherPoint();
    if (images.launcher?.complete) ctx.drawImage(images.launcher,launcher.x-53,launcher.y-39,106,106);
    if (!game.projectile) atlasBubble(ctx,game.currentType,launcher.x,launcher.y-30,42);
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

  document.getElementById("startGame").addEventListener("click", () => { renderStageRail(); showScreen("stage"); });
  document.getElementById("stageBack").addEventListener("click", () => { showScreen("main"); updateMainProgress(); });
  document.getElementById("battleBack").addEventListener("click", () => { game=null; cancelAnimationFrame(animationFrame); renderStageRail(); showScreen("stage"); });
  document.getElementById("playStage").addEventListener("click", () => startStage(selectedStage));
  document.getElementById("retryStage").addEventListener("click", () => startStage(game.def.id));
  document.getElementById("nextStage").addEventListener("click", () => startStage(Math.min(3,game.def.id+1)));
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

  preload().then(() => {
    applyLocale(); fitCanvas();
    if (!localStorage.getItem(FIRST_PLAY_KEY)) openGuide();
  });
})();
