(function(){
  "use strict";

  const COPY = window.WPCloudhookLocales.locales;
  const LOCALE_ORDER = window.WPCloudhookLocales.order;
  const LEAVE_COPY = {
    en: { title: "Keep this flight?", body: "Continue keeps the current flight. Returning to Stages ends this attempt.", continue: "Continue flight", leave: "Stages" },
    "zh-Hant": { title: "要保留這次飛行嗎？", body: "繼續會保留目前飛行；返回關卡會結束這次嘗試。", continue: "繼續飛行", leave: "返回關卡" },
    "zh-Hans": { title: "要保留这次飞行吗？", body: "继续会保留当前飞行；返回关卡会结束这次尝试。", continue: "继续飞行", leave: "返回关卡" },
    ja: { title: "このフライトを続けますか？", body: "続けると現在のフライトを保ちます。ステージへ戻ると今回の挑戦を終了します。", continue: "フライトを続ける", leave: "ステージへ" },
    ko: { title: "이 비행을 유지할까요?", body: "계속하면 현재 비행을 유지합니다. 스테이지로 돌아가면 이번 도전을 끝냅니다.", continue: "비행 계속하기", leave: "스테이지로" },
    es: { title: "¿Mantener este vuelo?", body: "Continuar conserva el vuelo actual. Volver a fases termina este intento.", continue: "Continuar vuelo", leave: "Fases" },
    "pt-BR": { title: "Manter este voo?", body: "Continuar mantém o voo atual. Voltar às fases encerra esta tentativa.", continue: "Continuar voo", leave: "Fases" },
    fr: { title: "Garder ce vol ?", body: "Continuer conserve le vol actuel. Retourner aux étapes termine cet essai.", continue: "Continuer le vol", leave: "Étapes" },
    de: { title: "Diesen Flug behalten?", body: "Weiter hält den aktuellen Flug. Zurück zu den Stufen beendet diesen Versuch.", continue: "Flug fortsetzen", leave: "Stufen" },
    it: { title: "Mantenere questo volo?", body: "Continuare conserva il volo attuale. Tornare alle fasi termina questo tentativo.", continue: "Continua il volo", leave: "Fasi" },
    ru: { title: "Сохранить этот полёт?", body: "Продолжение сохраняет текущий полёт. Возврат к этапам завершит попытку.", continue: "Продолжить полёт", leave: "Этапы" },
    hi: { title: "इस उड़ान को रखें?", body: "जारी रखने पर वर्तमान उड़ान बनी रहेगी। चरणों पर लौटने से यह प्रयास समाप्त होगा।", continue: "उड़ान जारी रखें", leave: "चरण" },
    ar: { title: "هل تحتفظ بهذه الرحلة؟", body: "المتابعة تُبقي الرحلة الحالية. العودة إلى المراحل تنهي هذه المحاولة.", continue: "متابعة الرحلة", leave: "المراحل" },
  };
  const $ = (selector) => document.querySelector(selector);
  const canvas = $("#gameCanvas");
  const battleScreen = $("#battleScreen");
  const resultScreen = $("#resultScreen");
  if (resultScreen.parentElement !== battleScreen) battleScreen.append(resultScreen);
  resultScreen.setAttribute("role", "dialog");
  resultScreen.setAttribute("aria-modal", "true");
  resultScreen.setAttribute("aria-labelledby", "resultTitle");
  resultScreen.setAttribute("aria-describedby", "resultCopy");
  const leaveOverlay = document.createElement("section");
  leaveOverlay.id = "leaveOverlay";
  leaveOverlay.className = "leave-overlay";
  leaveOverlay.setAttribute("role", "dialog");
  leaveOverlay.setAttribute("aria-modal", "true");
  leaveOverlay.setAttribute("aria-labelledby", "leaveTitle");
  leaveOverlay.setAttribute("aria-describedby", "leaveCopy");
  leaveOverlay.hidden = true;
  leaveOverlay.innerHTML = '<div class="leave-card"><p class="eyebrow" id="leaveEyebrow"></p><h2 id="leaveTitle"></h2><p class="leave-copy" id="leaveCopy"></p><div class="leave-actions"><button id="continueBattle" class="primary" type="button"></button><button id="leaveBattle" class="secondary" type="button"></button></div></div>';
  battleScreen.append(leaveOverlay);
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const battleBackground = new Image();
  battleBackground.decoding = "async";
  battleBackground.src = "battle-bg-v2.webp";
  const stageConfigs = [
    { wind: 0, anchors: [{x:210,y:300},{x:370,y:230},{x:530,y:330},{x:690,y:210}], parcels: [{x:330,y:170},{x:600,y:150}], spikes: [] },
    { wind: 8, anchors: [{x:205,y:290},{x:360,y:190},{x:500,y:315},{x:665,y:180},{x:790,y:300}], parcels: [{x:300,y:150},{x:575,y:190},{x:735,y:130}], spikes: [{x:430,y:430,w:65,h:22}] },
    { wind: -12, anchors: [{x:210,y:300},{x:360,y:170,move:1},{x:510,y:300},{x:650,y:150,move:1},{x:805,y:260}], parcels: [{x:300,y:125},{x:560,y:110},{x:745,y:175}], spikes: [{x:390,y:425,w:72,h:22}] },
    { wind: 16, anchors: [{x:210,y:300},{x:350,y:210},{x:490,y:130},{x:630,y:285},{x:770,y:150},{x:850,y:285}], parcels: [{x:300,y:155},{x:540,y:90},{x:740,y:100}], spikes: [{x:300,y:430,w:72,h:22},{x:600,y:430,w:86,h:22}] },
    { wind: -18, anchors: [{x:210,y:280},{x:355,y:165,move:1},{x:500,y:300},{x:640,y:140},{x:775,y:275,move:1},{x:865,y:180}], parcels: [{x:285,y:125},{x:545,y:105},{x:720,y:155},{x:835,y:110}], spikes: [{x:440,y:430,w:90,h:22},{x:700,y:430,w:70,h:22}] },
    { wind: 22, anchors: [{x:205,y:290},{x:345,y:155},{x:480,y:300,move:1},{x:610,y:130},{x:745,y:285,move:1},{x:865,y:170}], parcels: [{x:280,y:110},{x:520,y:90},{x:690,y:115},{x:820,y:100}], spikes: [{x:300,y:430,w:80,h:22},{x:520,y:430,w:82,h:22},{x:760,y:430,w:80,h:22}] },
  ];
  let locale = "en";
  let soundEnabled = true;
  if (!window.WonderSound) {
    let muted = false;
    window.WonderSound = {
      isMuted: () => muted,
      setMuted: (next) => { muted = Boolean(next); soundEnabled = !muted; refreshShell(); window.dispatchEvent(new CustomEvent("wonder:audio-volume-change")); },
    };
  }
  let currentStage = 0;
  let state = null;
  let frame = 0;
  let lastTime = 0;
  let inputAxis = 0;
  let hidden = false;
  let resultOpen = false;
  let leaveOpen = false;

  const text = (key) => (COPY[locale] && COPY[locale][key]) || COPY.en[key] || key;
  const stageKey = (index) => `weightplay_cloudhook_stage_${index}`;
  const bestKey = (index) => `weightplay_cloudhook_best_${index}`;
  const safeGet = (key, fallback = "") => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, String(value)); } catch {} };
  const unlocked = () => Math.min(stageConfigs.length, Math.max(1, Number(safeGet(stageKey("unlocked"), 1)) || 1));
  const setScreen = (screen) => {
    ["main", "stage", "battle"].forEach((name) => { $(`#${name}Screen`).hidden = screen !== name; });
    if (screen !== "battle") {
      resultOpen = false;
      leaveOpen = false;
      resultScreen.hidden = true;
      leaveOverlay.hidden = true;
      battleScreen.classList.remove("result-open", "leave-open");
    }
    document.body.dataset.screen = screen;
  };
  const isBattleActive = () => document.body.dataset.screen === "battle" && !resultOpen && !leaveOpen;
  const formatTime = (value) => `${Math.max(0, value).toFixed(1)}s`;
  const formatStage = (index) => `${text("stage")} ${index + 1}`;
  const beep = (frequency = 440, duration = 0.06) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audio = window.__cloudhookAudio || (window.__cloudhookAudio = new AudioContext());
      if (audio.state === "suspended") audio.resume();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      gain.gain.setValueAtTime(0.035, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(); oscillator.stop(audio.currentTime + duration);
    } catch {}
  };
  const anchorPosition = (anchor, time) => ({ x: anchor.x, y: anchor.y + (anchor.move ? Math.sin(time * 1.8 + anchor.x) * 34 : 0) });
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const config = () => stageConfigs[currentStage];
  const resetState = () => {
    state = { x:105, y:410, vx:180, vy:-20, attached:false, anchor:-1, rope:0, time:0, score:0, parcels:0, collected:[], messageKey:"ready", done:false, success:false, flash:0 };
    inputAxis = 0;
  };
  const nearestAnchor = () => {
    if (!state) return -1;
    let best = -1; let bestDistance = 204;
    config().anchors.forEach((anchor, index) => {
      const d = distance(state, anchorPosition(anchor, state.time));
      if (d < bestDistance) { best = index; bestDistance = d; }
    });
    return best;
  };
  const updateTetherLabel = () => { $("#tetherBtn").textContent = state?.attached ? text("release") : text("hold"); $("#tetherBtn").setAttribute("aria-pressed", String(Boolean(state?.attached))); };
  const announce = (key) => { if (!state) return; state.messageKey = key; $("#battleStatus").textContent = text(key); };
  const attach = () => {
    if (!state || state.done || hidden || state.attached) return;
    const index = nearestAnchor();
    if (index < 0) { announce("noAnchor"); beep(180); return; }
    const anchor = anchorPosition(config().anchors[index], state.time);
    state.attached = true; state.anchor = index; state.rope = Math.max(72, Math.min(190, distance(state, anchor)));
    announce("attached"); beep(620, 0.08); updateTetherLabel();
  };
  const release = () => {
    if (!state || state.done || !state.attached) return;
    state.attached = false; state.anchor = -1; state.vx += inputAxis * 42; state.vy -= 16;
    announce("released"); beep(840, 0.08); updateTetherLabel();
  };
  const setTether = (pressed) => { if (pressed) attach(); else release(); };
  const rectHit = (x, y, rect) => x > rect.x - 16 && x < rect.x + rect.w + 16 && y > rect.y - 16 && y < rect.y + rect.h + 16;
  const finish = (success) => {
    if (!state || state.done || !isBattleActive()) return;
    state.done = true; state.success = success; state.attached = false; updateTetherLabel();
    const best = Number(safeGet(bestKey(currentStage), 0)) || 0;
    if (success && (!best || state.time < best)) safeSet(bestKey(currentStage), state.time.toFixed(2));
    if (success && currentStage + 1 < stageConfigs.length) safeSet(stageKey("unlocked"), Math.max(unlocked(), currentStage + 2));
    beep(success ? 980 : 140, 0.16); renderResult(); setScreen("battle"); setResultOpen(true);
  };
  const update = (dt) => {
    if (!state || state.done || hidden || !isBattleActive()) return;
    state.time += dt;
    const cfg = config();
    const wind = cfg.wind * (state.attached ? 0.45 : 1);
    state.vx += (inputAxis * 170 + wind) * dt;
    state.vy += 360 * dt;
    state.x += state.vx * dt; state.y += state.vy * dt;
    if (state.attached) {
      const anchor = anchorPosition(cfg.anchors[state.anchor], state.time);
      let dx = state.x - anchor.x; let dy = state.y - anchor.y; const d = Math.max(1, Math.hypot(dx, dy));
      if (d > state.rope) { const nx = dx / d; const ny = dy / d; state.x = anchor.x + nx * state.rope; state.y = anchor.y + ny * state.rope; const tangentX = -ny; const tangentY = nx; const tangentSpeed = state.vx * tangentX + state.vy * tangentY; state.vx = tangentX * tangentSpeed; state.vy = tangentY * tangentSpeed; }
    }
    config().parcels.forEach((parcel, index) => { if (!state.collected.includes(index) && distance(state, parcel) < 30) { state.collected.push(index); state.parcels += 1; state.score += 100; state.flash = 0.25; announce("parcel"); beep(720); } });
    if (config().spikes.some((spike) => rectHit(state.x, state.y, spike))) { finish(false); return; }
    const target = { x:875, y:255 };
    if (state.x > target.x - 30 && state.y > 170 && state.y < 370) { state.score += Math.max(0, 600 - Math.floor(state.time * 22)); finish(true); return; }
    if (state.y > H + 35 || state.x < -45 || state.x > W + 45) finish(false);
  };
  const drawBackground = () => {
    if (battleBackground.complete && battleBackground.naturalWidth > 0) {
      ctx.drawImage(battleBackground, 0, 0, W, H);
      ctx.fillStyle = "#06132230";
      ctx.fillRect(0, 0, W, H);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, H); gradient.addColorStop(0, "#123f5b"); gradient.addColorStop(1, "#061322"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H);
    }
    ctx.fillStyle = "#ffffff12"; for (let i = 0; i < 34; i += 1) { const x = (i * 173) % W; const y = 26 + ((i * 71) % 255); ctx.fillRect(x, y, 2, 2); }
    ctx.fillStyle = "#9edce51a"; for (let i = 0; i < 5; i += 1) { ctx.beginPath(); ctx.ellipse(90 + i * 215, 485 - (i % 2) * 22, 150, 27, 0, 0, Math.PI * 2); ctx.fill(); }
  };
  const draw = () => {
    drawBackground(); const cfg = config();
    cfg.spikes.forEach((spike) => { ctx.fillStyle = "#ff788e"; ctx.beginPath(); for (let x = spike.x; x <= spike.x + spike.w; x += 14) { ctx.lineTo(x, spike.y + spike.h); ctx.lineTo(x + 7, spike.y); } ctx.lineTo(spike.x + spike.w, spike.y + spike.h); ctx.closePath(); ctx.fill(); });
    cfg.anchors.forEach((anchor, index) => { const p = anchorPosition(anchor, state?.time || 0); ctx.strokeStyle = index === state?.anchor ? "#fff0a6" : "#78e2dc"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(p.x, p.y, 19, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = "#ffffff55"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 29, 0, Math.PI * 2); ctx.stroke(); });
    cfg.parcels.forEach((parcel, index) => { if (state?.collected.includes(index)) return; ctx.fillStyle = "#ffd277"; ctx.beginPath(); ctx.arc(parcel.x, parcel.y, 9, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff3b6"; ctx.fillRect(parcel.x - 2, parcel.y - 16, 4, 32); ctx.fillRect(parcel.x - 16, parcel.y - 2, 32, 4); });
    ctx.fillStyle = "#ffd277"; ctx.shadowColor = "#ffd277"; ctx.shadowBlur = 22; ctx.beginPath(); ctx.arc(875, 255, 25, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = "#143650"; ctx.beginPath(); ctx.arc(875, 255, 12, 0, Math.PI * 2); ctx.fill();
    if (state?.attached && state.anchor >= 0) { const anchor = anchorPosition(cfg.anchors[state.anchor], state.time); ctx.strokeStyle = "#ffd277"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(anchor.x, anchor.y); ctx.lineTo(state.x, state.y); ctx.stroke(); }
    if (state) { ctx.save(); ctx.translate(state.x, state.y); ctx.rotate(Math.atan2(state.vy, Math.max(1, state.vx))); ctx.fillStyle = "#d87872"; ctx.beginPath(); ctx.ellipse(0, 0, 21, 17, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#f8b66d"; ctx.beginPath(); ctx.arc(13, -8, 11, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#071627"; ctx.beginPath(); ctx.arc(17, -10, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#ffd277"; ctx.beginPath(); ctx.moveTo(-16, -8); ctx.lineTo(-31, -19); ctx.lineTo(-22, 2); ctx.closePath(); ctx.fill(); ctx.restore(); }
    if (state?.flash > 0) { ctx.fillStyle = `rgba(255,235,157,${Math.min(0.35, state.flash)})`; ctx.fillRect(0, 0, W, H); }
  };
  const tick = (now) => { const dt = Math.min(0.032, Math.max(0, (now - lastTime) / 1000 || 0)); lastTime = now; if (!hidden) { if (isBattleActive()) update(dt); draw(); updateHud(); } frame = window.requestAnimationFrame(tick); };
  const updateHud = () => { if (!state) return; $("#scoreLabel").textContent = `${text("score")}: ${state.score}`; $("#timeLabel").textContent = `${text("time")}: ${formatTime(state.time)}`; $("#controlHint").textContent = text("hint"); canvas.dataset.attached = String(state.attached); canvas.dataset.time = String(state.time); canvas.dataset.x = String(state.x); canvas.dataset.y = String(state.y); updateTetherLabel(); };
  const renderResult = () => { const best = Number(safeGet(bestKey(currentStage), 0)) || 0; $("#resultEyebrow").textContent = `${text("stage")} ${currentStage + 1}`; $("#resultTitle").textContent = text(state.success ? "success" : "failure"); $("#resultCopy").textContent = text(state.success ? (currentStage === stageConfigs.length - 1 ? "final" : "successCopy") : "failureCopy"); $("#resultScore").innerHTML = `<span>${text("scoreStat")}</span><strong>${state.score}</strong>`; $("#resultTime").innerHTML = `<span>${text("timeStat")}</span><strong>${formatTime(state.time)}</strong>`; $("#resultBest").innerHTML = `<span>${text("bestStat")}</span><strong>${best ? formatTime(best) : "—"}</strong>`; $("#nextBtn").textContent = text("next"); $("#nextBtn").disabled = !state.success || currentStage >= stageConfigs.length - 1; $("#retryBtn").textContent = text("retry"); $("#resultStagesBtn").textContent = text("stageMap"); };
  const liveBattleNodes = () => [...battleScreen.children].filter((node) => node !== resultScreen && node !== leaveOverlay);
  const syncBattleOverlayState = () => { liveBattleNodes().forEach((node) => { const inert = resultOpen || leaveOpen; node.inert = inert; if (inert) node.setAttribute("aria-hidden", "true"); else node.removeAttribute("aria-hidden"); }); };
  const applyLeaveCopy = () => { const copy = LEAVE_COPY[locale] || LEAVE_COPY.en; $("#leaveEyebrow").textContent = text("battle"); $("#leaveTitle").textContent = copy.title; $("#leaveCopy").textContent = copy.body; $("#continueBattle").textContent = copy.continue; $("#leaveBattle").textContent = copy.leave; };
  const setResultOpen = (open) => { resultOpen = Boolean(open); if (resultOpen) { leaveOpen = false; leaveOverlay.hidden = true; } resultScreen.hidden = !resultOpen; battleScreen.classList.toggle("result-open", resultOpen); battleScreen.classList.remove("leave-open"); syncBattleOverlayState(); if (resultOpen) { resultScreen.scrollTop = 0; const focusTarget = $("#nextBtn").disabled ? $("#retryBtn") : $("#nextBtn"); focusTarget?.focus(); } };
  const setLeaveOpen = (open, restoreFocus = true) => { if (open && resultOpen) return; leaveOpen = Boolean(open); leaveOverlay.hidden = !leaveOpen; battleScreen.classList.toggle("leave-open", leaveOpen); syncBattleOverlayState(); if (leaveOpen) $("#continueBattle").focus(); else if (restoreFocus && !battleScreen.hidden) $("#battleBack")?.focus(); };
  const renderStages = () => { const count = unlocked(); $("#stageGrid").innerHTML = stageConfigs.map((_, index) => { const open = index < count; const best = Number(safeGet(bestKey(index), 0)); return `<button type="button" class="stage-card${open ? "" : " locked"}" data-stage="${index}" ${open ? "" : "disabled"}><strong>${formatStage(index)}</strong><small>${open ? (best ? `${text("stageDone")}: ${formatTime(best)}` : text("choose")) : text("stageLocked")}</small><span aria-hidden="true">${open ? "✦" : "◌"}</span></button>`; }).join(""); $("#stageTitle").textContent = text("stages"); $("#stageEyebrow").textContent = text("eyebrow"); $("#stageHelp").textContent = text("stageHelp"); $("#stageGrid").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startStage(Number(button.dataset.stage)))); };
  const startStage = (index) => { setResultOpen(false); setLeaveOpen(false, false); currentStage = Math.max(0, Math.min(stageConfigs.length - 1, index)); resetState(); $("#battleEyebrow").textContent = text("battle"); $("#battleTitle").textContent = formatStage(currentStage); $("#battleStatus").textContent = text("ready"); canvas.setAttribute("aria-label", text("ariaCanvas")); $("#nudgeLeft").setAttribute("aria-label", text("ariaLeft")); $("#nudgeRight").setAttribute("aria-label", text("ariaRight")); setScreen("battle"); beep(440); };
  const refreshShell = () => { document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.title = `Cloudhook Courier | WeightPlay`; $("#eyebrow").textContent = text("eyebrow"); $("#coming").textContent = text("coming"); $("#languageLabel").textContent = text("language"); $("#tagline").textContent = text("objective"); $("#objective").textContent = text("objective"); $("#guideTitle").textContent = text("guideTitle"); $("#guideBody").textContent = text("guideBody"); $("#guideControls").textContent = text("guideControls"); $("#startBtn").textContent = text("start"); $("#soundBtn").textContent = soundEnabled ? text("soundOn") : text("soundOff"); $("#soundBtn").setAttribute("aria-pressed", String(soundEnabled)); $("#stageSoundBtn").textContent = soundEnabled ? text("soundOn") : text("soundOff"); $("#stageSoundBtn").setAttribute("aria-pressed", String(soundEnabled)); $("#stageBack").setAttribute("aria-label", text("backMain")); $("#battleBack").setAttribute("aria-label", text("backStages")); $("#battleBack").setAttribute("data-wp-return", "battle"); $("#restartBtn").textContent = text("restart"); $("#stageTitle").textContent = text("stages"); $("#stageEyebrow").textContent = text("eyebrow"); $("#stageHelp").textContent = text("stageHelp"); applyLeaveCopy(); renderStages(); if (state && document.body.dataset.screen === "battle") { $("#battleEyebrow").textContent = text("battle"); $("#battleTitle").textContent = formatStage(currentStage); $("#battleStatus").textContent = text(state.messageKey || "ready"); updateHud(); } if (state && resultOpen) renderResult(); updateTetherLabel(); };
  const toggleSound = () => { soundEnabled = !soundEnabled; safeSet("weightplay_sound", soundEnabled ? "on" : "off"); refreshShell(); if (soundEnabled) beep(660); };
  const goStage = () => { setResultOpen(false); setLeaveOpen(false, false); renderStages(); setScreen("stage"); };
  $("#startBtn").addEventListener("click", goStage); $("#stageBack").addEventListener("click", () => setScreen("main")); $("#soundBtn").addEventListener("click", toggleSound); $("#stageSoundBtn").addEventListener("click", toggleSound); $("#restartBtn").addEventListener("click", () => startStage(currentStage)); $("#retryBtn").addEventListener("click", () => startStage(currentStage)); $("#nextBtn").addEventListener("click", () => { if (!$("#nextBtn").disabled) startStage(currentStage + 1); }); $("#resultStagesBtn").addEventListener("click", goStage);
  document.addEventListener("click", (event) => { const control = event.target?.closest?.('#battleScreen [data-wp-return="battle"]'); if (!control || battleScreen.hidden || resultOpen) return; event.preventDefault(); event.stopImmediatePropagation(); setLeaveOpen(true); }, true);
  $("#continueBattle").addEventListener("click", () => setLeaveOpen(false));
  $("#leaveBattle").addEventListener("click", () => goStage());
  document.addEventListener("keydown", (event) => {
    if (!leaveOpen) return;
    if (event.key === "Escape") { event.preventDefault(); setLeaveOpen(false); return; }
    if (event.key !== "Tab") return;
    const actions = [$("#continueBattle"), $("#leaveBattle")];
    const index = actions.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) { event.preventDefault(); actions[actions.length - 1].focus(); }
    else if (!event.shiftKey && index === actions.length - 1) { event.preventDefault(); actions[0].focus(); }
  });
  const pressButton = (button, down, up) => { button.addEventListener("pointerdown", (event) => { event.preventDefault(); button.setPointerCapture?.(event.pointerId); down(); }); ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => button.addEventListener(eventName, (event) => { event.preventDefault(); up(); })); };
  pressButton($("#tetherBtn"), () => setTether(true), () => setTether(false)); pressButton(canvas, () => setTether(true), () => setTether(false)); pressButton($("#nudgeLeft"), () => { inputAxis = -1; }, () => { if (inputAxis < 0) inputAxis = 0; }); pressButton($("#nudgeRight"), () => { inputAxis = 1; }, () => { if (inputAxis > 0) inputAxis = 0; });
  document.addEventListener("keydown", (event) => { if (document.body.dataset.screen !== "battle") return; if (["ArrowLeft","ArrowRight"," ","Spacebar","r","R"].includes(event.key)) event.preventDefault(); if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") inputAxis = -1; if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") inputAxis = 1; if (event.key === " " || event.key === "Spacebar") setTether(true); if (event.key.toLowerCase() === "r") startStage(currentStage); });
  document.addEventListener("keyup", (event) => { if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") { if (inputAxis < 0) inputAxis = 0; } if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") { if (inputAxis > 0) inputAxis = 0; } if (event.key === " " || event.key === "Spacebar") setTether(false); });
  document.addEventListener("visibilitychange", () => { hidden = document.hidden; lastTime = performance.now(); if (hidden && state?.attached) release(); });
  const initialLocale = (() => { const routeLocale = document.documentElement.lang; const saved = safeGet("weightPlayLocale", "en"); return COPY[routeLocale] ? routeLocale : COPY[saved] ? saved : "en"; })(); locale = initialLocale; $("#localeSelect").innerHTML = LOCALE_ORDER.map((code) => `<option value="${code}">${code}</option>`).join(""); $("#localeSelect").value = locale; $("#localeSelect").addEventListener("change", (event) => { locale = event.target.value; safeSet("weightPlayLocale", locale); refreshShell(); }); soundEnabled = safeGet("weightplay_sound", "on") !== "off"; resetState(); refreshShell(); setScreen("main"); lastTime = performance.now(); frame = window.requestAnimationFrame(tick);
  $("#stageBack").setAttribute("data-wp-return", "stage");
  $("#stageScreen").setAttribute("data-wp-standard-stage-screen", "");
  $("#stageGrid").setAttribute("data-wp-stage-rail", "");
  $("#battleScreen").setAttribute("data-wp-logical-battle-canvas", "");
  $("#stageScreen .section-head")?.classList.add("stage-header");
  $("#battleScreen .section-head")?.classList.add("battle-header");
  const inlineGuide = document.querySelector("#mainScreen .guide");
  inlineGuide?.classList.remove("guide");
  inlineGuide?.classList.add("main-howto");
})();
