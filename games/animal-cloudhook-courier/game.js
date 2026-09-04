(function(){
  "use strict";

  const COPY = window.WPCloudhookLocales.locales;
  const LOCALE_ORDER = window.WPCloudhookLocales.order;
  const GAME_ID = "animal-cloudhook-courier";
  const GAME_VERSION = "v14";
  const INTERFACE_VERSION = 6;
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
  const courierSprites = new Image();
  courierSprites.decoding = "async";
  courierSprites.src = "courier-sprites-v2.webp";
  const cloudhookProps = new Image();
  cloudhookProps.decoding = "async";
  cloudhookProps.src = "cloudhook-props-v2.webp";
  const stageConfigs = [
    { wind: 0, anchors: [{x:210,y:300},{x:370,y:230},{x:530,y:330},{x:690,y:210}], parcels: [{x:300,y:410},{x:600,y:360}], spikes: [] },
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
  let lastInputType = "system";

  const text = (key) => (COPY[locale] && COPY[locale][key]) || COPY.en[key] || key;
  const parcelObjectiveCopy = { en: "Parcels {collected}/{total} · Reach the lantern", "zh-Hant": "包裹 {collected}/{total} · 抵達燈籠", "zh-Hans": "包裹 {collected}/{total} · 抵达灯笼", ja: "荷物 {collected}/{total} · ランタンへ", ko: "소포 {collected}/{total} · 랜턴에 도착", es: "Paquetes {collected}/{total} · Llega al farol", "pt-BR": "Pacotes {collected}/{total} · Chegue à lanterna", fr: "Colis {collected}/{total} · Atteignez la lanterne", de: "Pakete {collected}/{total} · Erreiche die Laterne", it: "Pacchi {collected}/{total} · Raggiungi la lanterna", ru: "Посылки {collected}/{total} · Долетите до фонаря", hi: "पैकेट {collected}/{total} · लालटेन तक पहुँचें", ar: "الطرود {collected}/{total} · أصل إلى الفانوس" };
  const parcelObjectiveText = () => (parcelObjectiveCopy[locale] || parcelObjectiveCopy.en).replace("{collected}", String(state?.parcels || 0)).replace("{total}", String(config().parcels.length));
  const stageKey = (index) => `weightplay_cloudhook_stage_${index}`;
  const bestKey = (index) => `weightplay_cloudhook_best_${index}`;
  const safeGet = (key, fallback = "") => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, String(value)); } catch {} };
  const unlocked = () => Math.min(stageConfigs.length, Math.max(1, Number(safeGet(stageKey("unlocked"), 1)) || 1));
  const viewportBucket = () => {
    const width = Math.max(1, Number(window.innerWidth) || 1);
    const height = Math.max(1, Number(window.innerHeight) || 1);
    if (height <= 430) return "short-landscape";
    if (width <= 480) return "phone-portrait";
    if (width <= 900) return height > width ? "tablet-portrait" : "tablet-landscape";
    return "desktop";
  };
  const noteInput = (event) => {
    if (event?.detail === 0 || event?.type === "keydown" || event?.type === "keyup") lastInputType = "keyboard";
    else if (event?.pointerType === "touch") lastInputType = "touch";
    else if (event?.pointerType === "mouse") lastInputType = "mouse";
    else if (event?.pointerType) lastInputType = "pointer";
  };
  const track = (eventName, details = {}) => {
    try {
      if (!window.WonderAnalytics?.track) return;
      const stage = Math.max(1, Math.min(stageConfigs.length, Math.trunc(Number(details.stage) || currentStage + 1)));
      const payload = { game_id: GAME_ID, game_version: GAME_VERSION, interface_version: INTERFACE_VERSION, locale, viewport_bucket: viewportBucket(), input_class: lastInputType, stage };
      const bounded = (value, allowed) => allowed.includes(value) ? value : undefined;
      const source = bounded(details.source, ["main_start", "stage_card", "retry", "next", "result"]);
      const outcome = bounded(details.outcome, ["success", "failure"]);
      const holdBucket = bounded(details.hold_bucket, ["under_1s", "1_to_3s", "over_3s"]);
      const direction = bounded(details.direction, ["left", "right"]);
      const action = bounded(details.action, ["retry", "next", "stages"]);
      if (source) payload.source = source;
      if (outcome) payload.outcome = outcome;
      if (holdBucket) payload.hold_bucket = holdBucket;
      if (direction) payload.direction = direction;
      if (action) payload.action = action;
      if (details.parcels !== undefined) payload.parcels = Math.max(0, Math.min(8, Math.trunc(Number(details.parcels) || 0)));
      window.WonderAnalytics.track(eventName, payload);
    } catch {
      // Anonymous funnel measurement must never interrupt play.
    }
  };
  const holdBucket = (seconds) => seconds < 1 ? "under_1s" : seconds < 3 ? "1_to_3s" : "over_3s";
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
    state = { x:105, y:410, vx:180, vy:-20, attached:false, anchor:-1, lastAnchor:-1, targetAnchor:-1, rope:0, time:0, score:0, parcels:0, collected:[], messageKey:"ready", done:false, success:false, flash:0, firstAttach:false, swingReady:false, attachedAt:0 };
    inputAxis = 0;
  };
  const nearestAnchor = () => {
    if (!state) return -1;
    if (currentStage === 0 && state.targetAnchor >= 0) {
      const target = anchorPosition(config().anchors[state.targetAnchor], state.time);
      if (distance(state, target) < 238) return state.targetAnchor;
    }
    let best = -1; let bestDistance = 204;
    config().anchors.forEach((anchor, index) => {
      if (currentStage === 0 && index === state.lastAnchor) return;
      const d = distance(state, anchorPosition(anchor, state.time));
      if (d < bestDistance) { best = index; bestDistance = d; }
    });
    return best;
  };
  const refreshStaticA11y = () => { [[".brand-back","backLobby"],[".wonder-main-cover","cover"],[".locale select","language"],[".touch-controls","ariaControls"]].forEach(([selector,key]) => { const node = $(selector); const value = text(key); if (node && node.getAttribute("aria-label") !== value) node.setAttribute("aria-label", value); }); };
  const updateTetherLabel = () => { $("#tetherBtn").textContent = state?.attached ? text("release") : text("hold"); $("#tetherBtn").setAttribute("aria-pressed", String(Boolean(state?.attached))); $("#tetherState").textContent = state?.attached ? (state.swingReady ? text("swinging") : text("attached")) : text(state?.messageKey || "ready"); $("#tetherState").dataset.attached = String(Boolean(state?.attached)); refreshStaticA11y(); };
  const announce = (key) => { if (!state) return; state.messageKey = key; $("#battleStatus").textContent = text(key); };
  const attach = () => {
    if (!state || state.done || hidden || state.attached) return;
    const index = nearestAnchor();
    if (index < 0) { announce("noAnchor"); beep(180); return; }
    const anchor = anchorPosition(config().anchors[index], state.time);
    state.attached = true; state.anchor = index; state.lastAnchor = -1; state.targetAnchor = -1; state.rope = Math.max(72, Math.min(190, distance(state, anchor))); state.attachedAt = state.time; state.swingReady = false;
    if (!state.firstAttach) { state.firstAttach = true; track("attach"); }
    announce("attached"); beep(620, 0.08); updateTetherLabel();
  };
  const release = () => {
    if (!state || state.done || !state.attached) return;
    const heldFor = Math.max(0, state.time - state.attachedAt);
    const releasedAnchor = state.anchor;
    const routeAssistEnabled = currentStage === 0;
    const nextAnchor = routeAssistEnabled && releasedAnchor + 1 < config().anchors.length ? releasedAnchor + 1 : -1;
    const target = routeAssistEnabled ? (nextAnchor >= 0 ? anchorPosition(config().anchors[nextAnchor], state.time + 0.15) : { x:875, y:255 }) : state;
    const targetDistance = Math.max(1, distance(state, target));
    const releaseBoost = routeAssistEnabled ? (nextAnchor >= 0 ? (state.swingReady ? 240 : 360) : (state.swingReady ? 420 : 360)) : 0;
    state.attached = false; state.lastAnchor = routeAssistEnabled ? releasedAnchor : -1; state.targetAnchor = routeAssistEnabled ? nextAnchor : -1; state.anchor = -1; state.vx += inputAxis * 42 + (target.x - state.x) / targetDistance * releaseBoost; state.vy += (target.y - state.y) / targetDistance * releaseBoost - 16;
    state.attachedAt = 0; track("release", { hold_bucket: holdBucket(heldFor) });
    announce("released"); beep(840, 0.08); updateTetherLabel();
  };
  const setTether = (pressed) => { if (pressed) attach(); else release(); };
  const setInputAxis = (next) => {
    if (next !== 0 && next !== inputAxis && isBattleActive()) track("nudge", { direction: next < 0 ? "left" : "right" });
    inputAxis = next;
  };
  const rectHit = (x, y, rect) => x > rect.x - 16 && x < rect.x + rect.w + 16 && y > rect.y - 16 && y < rect.y + rect.h + 16;
  const finish = (success) => {
    if (!state || state.done || !isBattleActive()) return;
    state.done = true; state.success = success; state.attached = false; updateTetherLabel();
    track(success ? "stage_success" : "flight_failure", { outcome: success ? "success" : "failure", parcels: state.parcels });
    const best = Number(safeGet(bestKey(currentStage), 0)) || 0;
    if (success && (!best || state.time < best)) safeSet(bestKey(currentStage), state.time.toFixed(2));
    if (success && currentStage + 1 < stageConfigs.length) safeSet(stageKey("unlocked"), Math.max(unlocked(), currentStage + 2));
    beep(success ? 980 : 140, 0.16); renderResult(); setScreen("battle"); setResultOpen(true);
  };
  const update = (dt) => {
    if (!state || state.done || hidden || !isBattleActive()) return;
    state.time += dt;
    if (state.attached && !state.swingReady && state.time - state.attachedAt >= 0.45) { state.swingReady = true; announce("swinging"); beep(700, 0.05); }
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
    config().parcels.forEach((parcel, index) => { if (!state.collected.includes(index) && distance(state, parcel) < 30) { state.collected.push(index); state.parcels += 1; state.score += 100; state.flash = 0.25; track("parcel_collect", { parcels: state.parcels }); announce("parcel"); beep(720); } });
    if (config().spikes.some((spike) => rectHit(state.x, state.y, spike))) { finish(false); return; }
    const target = { x:875, y:255 };
    if (state.x > target.x - 30 && state.y > 170 && state.y < 370) {
      if (state.parcels < cfg.parcels.length) { state.x = target.x - 32; state.vx = -100; state.vy -= 60; state.flash = 0.18; $("#battleStatus").textContent = parcelObjectiveText(); return; }
      state.score += Math.max(0, 600 - Math.floor(state.time * 22)); finish(true); return;
    }
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
  const drawSheetProp = (image, sx, sy, sw, sh, dx, dy, dw, dh) => {
    if (!(image.complete && image.naturalWidth > 0)) return false;
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    return true;
  };
  const draw = () => {
    drawBackground(); const cfg = config();
    cfg.spikes.forEach((spike) => { if (!drawSheetProp(cloudhookProps, 512, 512, 512, 512, spike.x - 8, spike.y - 24, spike.w + 16, 64)) { ctx.fillStyle = "#ff788e"; ctx.beginPath(); for (let x = spike.x; x <= spike.x + spike.w; x += 14) { ctx.lineTo(x, spike.y + spike.h); ctx.lineTo(x + 7, spike.y); } ctx.lineTo(spike.x + spike.w, spike.y + spike.h); ctx.closePath(); ctx.fill(); } });
    cfg.anchors.forEach((anchor, index) => { const p = anchorPosition(anchor, state?.time || 0); if (!drawSheetProp(cloudhookProps, 0, 0, 512, 512, p.x - 31, p.y - 31, 62, 62)) { ctx.strokeStyle = index === state?.anchor ? "#fff0a6" : "#78e2dc"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(p.x, p.y, 19, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = "#ffffff55"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 29, 0, Math.PI * 2); ctx.stroke(); } });
    if (state?.attached && currentStage === 0 && state.anchor >= 0) {
      const next = state.anchor + 1 < cfg.anchors.length ? anchorPosition(cfg.anchors[state.anchor + 1], state.time) : { x:875, y:255 };
      const dx = next.x - state.x; const dy = next.y - state.y; const length = Math.max(1, Math.hypot(dx, dy));
      ctx.save(); ctx.strokeStyle = "#fff0a699"; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(state.x, state.y); ctx.lineTo(next.x, next.y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = "#fff0a6"; ctx.beginPath(); ctx.moveTo(next.x, next.y); ctx.lineTo(next.x - dx / length * 18 - dy / length * 7, next.y - dy / length * 18 + dx / length * 7); ctx.lineTo(next.x - dx / length * 18 + dy / length * 7, next.y - dy / length * 18 - dx / length * 7); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    cfg.parcels.forEach((parcel, index) => { if (state?.collected.includes(index)) return; if (!drawSheetProp(cloudhookProps, 512, 0, 512, 512, parcel.x - 24, parcel.y - 24, 48, 48)) { ctx.fillStyle = "#ffd277"; ctx.beginPath(); ctx.arc(parcel.x, parcel.y, 9, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff3b6"; ctx.fillRect(parcel.x - 2, parcel.y - 16, 4, 32); ctx.fillRect(parcel.x - 16, parcel.y - 2, 32, 4); } });
    if (!drawSheetProp(cloudhookProps, 1024, 0, 512, 512, 835, 215, 80, 80)) { ctx.fillStyle = "#ffd277"; ctx.shadowColor = "#ffd277"; ctx.shadowBlur = 22; ctx.beginPath(); ctx.arc(875, 255, 25, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = "#143650"; ctx.beginPath(); ctx.arc(875, 255, 12, 0, Math.PI * 2); ctx.fill(); }
    if (state?.attached && state.anchor >= 0) { const anchor = anchorPosition(cfg.anchors[state.anchor], state.time); ctx.strokeStyle = "#ffd277"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(anchor.x, anchor.y); ctx.lineTo(state.x, state.y); ctx.stroke(); }
    if (state) { ctx.save(); ctx.translate(state.x, state.y); ctx.rotate(Math.atan2(state.vy, Math.max(1, state.vx))); const pose = state.done && state.success ? 2 : state.attached ? 1 : 0; if (!drawSheetProp(courierSprites, pose * 512, 0, 512, 1024, -34, -55, 68, 110)) { ctx.fillStyle = "#d87872"; ctx.beginPath(); ctx.ellipse(0, 0, 21, 17, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#f8b66d"; ctx.beginPath(); ctx.arc(13, -8, 11, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#071627"; ctx.beginPath(); ctx.arc(17, -10, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#ffd277"; ctx.beginPath(); ctx.moveTo(-16, -8); ctx.lineTo(-31, -19); ctx.lineTo(-22, 2); ctx.closePath(); ctx.fill(); } ctx.restore(); }
    if (state?.flash > 0) { ctx.fillStyle = `rgba(255,235,157,${Math.min(0.35, state.flash)})`; ctx.fillRect(0, 0, W, H); }
  };
  const tick = (now) => { const dt = Math.min(0.032, Math.max(0, (now - lastTime) / 1000 || 0)); lastTime = now; if (!hidden) { if (isBattleActive()) update(dt); draw(); updateHud(); } frame = window.requestAnimationFrame(tick); };
  const updateHud = () => { if (!state) return; $("#scoreLabel").textContent = `${text("score")}: ${state.score}`; $("#timeLabel").textContent = `${text("time")}: ${formatTime(state.time)}`; $("#parcelObjective").textContent = parcelObjectiveText(); $("#controlHint").textContent = text("hint"); canvas.dataset.attached = String(state.attached); canvas.dataset.swingReady = String(state.swingReady); canvas.dataset.time = String(state.time); canvas.dataset.x = String(state.x); canvas.dataset.y = String(state.y); updateTetherLabel(); };
  const renderResult = () => { const best = Number(safeGet(bestKey(currentStage), 0)) || 0; $("#resultEyebrow").textContent = `${text("stage")} ${currentStage + 1}`; $("#resultTitle").textContent = text(state.success ? "success" : "failure"); $("#resultCopy").textContent = text(state.success ? (currentStage === stageConfigs.length - 1 ? "final" : "successCopy") : "failureCopy") + (state.success ? "" : ` ${text("retryCue")}`); $("#resultScore").innerHTML = `<span>${text("scoreStat")}</span><strong>${state.score}</strong>`; $("#resultTime").innerHTML = `<span>${text("timeStat")}</span><strong>${best ? formatTime(best) : "—"}</strong>`; $("#nextBtn").textContent = text("next"); $("#nextBtn").disabled = !state.success || currentStage >= stageConfigs.length - 1; $("#retryBtn").textContent = text("retry"); $("#resultStagesBtn").textContent = text("stageMap"); };
  const liveBattleNodes = () => [...battleScreen.children].filter((node) => node !== resultScreen && node !== leaveOverlay);
  const syncBattleOverlayState = () => { liveBattleNodes().forEach((node) => { const inert = resultOpen || leaveOpen; node.inert = inert; if (inert) node.setAttribute("aria-hidden", "true"); else node.removeAttribute("aria-hidden"); }); };
  const applyLeaveCopy = () => { const copy = LEAVE_COPY[locale] || LEAVE_COPY.en; $("#leaveEyebrow").textContent = text("battle"); $("#leaveTitle").textContent = copy.title; $("#leaveCopy").textContent = copy.body; $("#continueBattle").textContent = copy.continue; $("#leaveBattle").textContent = copy.leave; };
  const setResultOpen = (open) => { resultOpen = Boolean(open); if (resultOpen) { leaveOpen = false; leaveOverlay.hidden = true; } resultScreen.hidden = !resultOpen; battleScreen.classList.toggle("result-open", resultOpen); battleScreen.classList.remove("leave-open"); syncBattleOverlayState(); if (resultOpen) { resultScreen.scrollTop = 0; const focusTarget = $("#nextBtn").disabled ? $("#retryBtn") : $("#nextBtn"); focusTarget?.focus(); } };
  const setLeaveOpen = (open, restoreFocus = true) => { if (open && resultOpen) return; leaveOpen = Boolean(open); leaveOverlay.hidden = !leaveOpen; battleScreen.classList.toggle("leave-open", leaveOpen); syncBattleOverlayState(); if (leaveOpen) $("#continueBattle").focus(); else if (restoreFocus && !battleScreen.hidden) $("#battleBack")?.focus(); };
  const renderStages = () => { const count = unlocked(); $("#stageGrid").innerHTML = stageConfigs.map((_, index) => { const open = index < count; const best = Number(safeGet(bestKey(index), 0)); return `<button type="button" class="stage-card${open ? "" : " locked"}" data-stage="${index}" ${open ? "" : "disabled"}><strong>${formatStage(index)}</strong><small>${open ? (best ? `${text("stageDone")}: ${formatTime(best)}` : text("choose")) : text("stageLocked")}</small><span aria-hidden="true">${open ? "✦" : "◌"}</span></button>`; }).join(""); $("#stageTitle").textContent = text("stages"); $("#stageTab").textContent = text("stages"); $("#stageEyebrow").textContent = text("eyebrow"); $("#stageHelp").textContent = text("stageHelp"); $("#stageGrid").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", (event) => { noteInput(event); startStage(Number(button.dataset.stage), "stage_card"); })); };
  const startStage = (index, source = "stage_card") => { setResultOpen(false); setLeaveOpen(false, false); currentStage = Math.max(0, Math.min(stageConfigs.length - 1, index)); resetState(); track("stage_start", { source, stage: currentStage + 1 }); $("#battleEyebrow").textContent = text("battle"); $("#battleTitle").textContent = formatStage(currentStage); $("#battleStatus").textContent = text("ready"); canvas.setAttribute("aria-label", text("ariaCanvas")); $("#nudgeLeft").setAttribute("aria-label", text("ariaLeft")); $("#nudgeRight").setAttribute("aria-label", text("ariaRight")); setScreen("battle"); window.dispatchEvent(new Event("weightplay:battle-open")); window.WeightPlayBattleCanvas?.sync?.(); window.setTimeout(() => window.WeightPlayBattleCanvas?.sync?.(), 0); beep(440); };
  const refreshShell = () => { document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.title = `Cloudhook Courier | WeightPlay`; $("#eyebrow").textContent = text("eyebrow"); $("#coming").textContent = text("coming"); $("#languageLabel").textContent = text("language"); $("#tagline").textContent = text("objective"); $("#objective").textContent = text("objective"); $("#guideTitle").textContent = text("guideTitle"); $("#guideBody").textContent = text("guideBody"); $("#guideControls").textContent = text("guideControls"); $("#startBtn").textContent = text("start"); $("#soundBtn").textContent = soundEnabled ? text("soundOn") : text("soundOff"); $("#soundBtn").setAttribute("aria-pressed", String(soundEnabled)); $("#stageSoundBtn").textContent = soundEnabled ? text("soundOn") : text("soundOff"); $("#stageSoundBtn").setAttribute("aria-pressed", String(soundEnabled)); $("#battleSoundBtn").textContent = soundEnabled ? text("soundOn") : text("soundOff"); $("#battleSoundBtn").setAttribute("aria-label", soundEnabled ? text("soundOn") : text("soundOff")); $("#battleSoundBtn").setAttribute("aria-pressed", String(soundEnabled)); $("#stageBack").setAttribute("aria-label", text("backMain")); $("#battleBack").setAttribute("aria-label", text("backStages")); $("#battleBack").setAttribute("data-wp-return", "battle"); $("#restartBtn").textContent = text("restart"); $("#stageTitle").textContent = text("stages"); $("#stageEyebrow").textContent = text("eyebrow"); $("#stageHelp").textContent = text("stageHelp"); applyLeaveCopy(); renderStages(); if (state && document.body.dataset.screen === "battle") { $("#battleEyebrow").textContent = text("battle"); $("#battleTitle").textContent = formatStage(currentStage); $("#battleStatus").textContent = text(state.messageKey || "ready"); updateHud(); } if (state && resultOpen) renderResult(); updateTetherLabel(); };
  const toggleSound = () => { soundEnabled = !soundEnabled; safeSet("weightplay_sound", soundEnabled ? "on" : "off"); refreshShell(); if (soundEnabled) beep(660); };
  const goStage = () => { if (document.body.dataset.screen === "main") track("game_start", { stage: 1, source: "main_start" }); setResultOpen(false); setLeaveOpen(false, false); renderStages(); setScreen("stage"); };
  $("#startBtn").addEventListener("click", (event) => { noteInput(event); goStage(); }); $("#stageBack").addEventListener("click", () => setScreen("main")); $("#soundBtn").addEventListener("click", toggleSound); $("#stageSoundBtn").addEventListener("click", toggleSound); $("#battleSoundBtn").addEventListener("click", toggleSound); $("#restartBtn").addEventListener("click", (event) => { noteInput(event); startStage(currentStage, "stage_card"); }); $("#retryBtn").addEventListener("click", (event) => { noteInput(event); track("result_retry", { action: "retry", source: "result" }); startStage(currentStage, "retry"); }); $("#nextBtn").addEventListener("click", (event) => { if (!$("#nextBtn").disabled) { noteInput(event); track("result_next", { action: "next", source: "result" }); startStage(currentStage + 1, "next"); } }); $("#resultStagesBtn").addEventListener("click", (event) => { noteInput(event); track("result_stages", { action: "stages", source: "result" }); goStage(); });
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
  const pressButton = (button, down, up) => { button.addEventListener("pointerdown", (event) => { event.preventDefault(); noteInput(event); button.setPointerCapture?.(event.pointerId); down(); }); ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => button.addEventListener(eventName, (event) => { event.preventDefault(); noteInput(event); up(); })); };
  pressButton($("#tetherBtn"), () => setTether(true), () => setTether(false)); pressButton(canvas, () => setTether(true), () => setTether(false)); pressButton($("#nudgeLeft"), () => setInputAxis(-1), () => { if (inputAxis < 0) setInputAxis(0); }); pressButton($("#nudgeRight"), () => setInputAxis(1), () => { if (inputAxis > 0) setInputAxis(0); });
  document.addEventListener("keydown", (event) => { if (document.body.dataset.screen !== "battle") return; noteInput(event); if (["ArrowLeft","ArrowRight"," ","Spacebar","r","R"].includes(event.key)) event.preventDefault(); if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") setInputAxis(-1); if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") setInputAxis(1); if (event.key === " " || event.key === "Spacebar") setTether(true); if (event.key.toLowerCase() === "r") startStage(currentStage, "stage_card"); });
  document.addEventListener("keyup", (event) => { noteInput(event); if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") { if (inputAxis < 0) setInputAxis(0); } if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") { if (inputAxis > 0) setInputAxis(0); } if (event.key === " " || event.key === "Spacebar") setTether(false); });
  document.addEventListener("visibilitychange", () => { hidden = document.hidden; lastTime = performance.now(); if (hidden && state?.attached) release(); });
  const initialLocale = (() => { const routeLocale = document.documentElement.lang; const saved = safeGet("weightPlayLocale", "en"); return COPY[routeLocale] ? routeLocale : COPY[saved] ? saved : "en"; })(); locale = initialLocale; $("#localeSelect").innerHTML = LOCALE_ORDER.map((code) => `<option value="${code}">${code}</option>`).join(""); $("#localeSelect").value = locale; $("#localeSelect").addEventListener("change", (event) => { locale = event.target.value; safeSet("weightPlayLocale", locale); refreshShell(); }); soundEnabled = safeGet("weightplay_sound", "on") !== "off"; resetState(); refreshShell(); setScreen("main"); lastTime = performance.now(); frame = window.requestAnimationFrame(tick);
  $("#stageBack").setAttribute("data-wp-return", "stage");
  $("#stageScreen").setAttribute("data-wp-standard-stage-screen", "");
  $("#stageGrid").setAttribute("data-wp-stage-rail", "");
  $("#battleScreen").setAttribute("data-wp-logical-battle-canvas", "");
  $("#stageScreen .section-head")?.classList.add("stage-header");
  $("#battleScreen .section-head")?.classList.add("battle-header");
  const inlineGuide = document.querySelector(".guide[data-wp-game-guide]");
  inlineGuide?.classList.add("main-howto");
})();
