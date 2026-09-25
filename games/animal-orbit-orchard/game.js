(function () {
  "use strict";
  if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  const resetInitialScroll = () => {
    if (document.body?.dataset.screen !== "main") return;
    window.scrollTo({ left: 0, top: 0, behavior: "instant" });
  };
  window.addEventListener("pageshow", resetInitialScroll, { once: true });
  window.addEventListener("load", () => window.setTimeout(resetInitialScroll, 320), { once: true });
  const locales = window.ORBIT_ORCHARD_LOCALES;
  const START_LABELS = {
    en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲーム開始", ko: "게임 시작",
    es: "Iniciar juego", "pt-BR": "Iniciar jogo", fr: "Démarrer le jeu", de: "Spiel starten", it: "Inizia gioco",
    ru: "Начать игру", hi: "गेम शुरू करें", ar: "ابدأ اللعبة",
  };
  const LEAVE_COPY = {
    en: ["Leave this orbit?", "Your current orbit attempt and release count will be discarded.", "Continue playing", "Return to Stages"],
    "zh-Hant": ["要離開目前軌道嗎？", "目前這一關的操作與放手次數將不會保留。", "繼續遊戲", "返回關卡"],
    "zh-Hans": ["要离开当前轨道吗？", "当前这一关的操作与释放次数将不会保留。", "继续游戏", "返回关卡"],
    ja: ["この軌道を離れますか？", "現在の操作とリリース回数は保存されません。", "プレイを続ける", "ステージへ戻る"],
    ko: ["현재 궤도를 나갈까요?", "현재 시도와 발사 횟수는 저장되지 않습니다.", "계속 플레이", "스테이지로 돌아가기"],
    es: ["¿Salir de esta órbita?", "Se descartarán el intento actual y el número de lanzamientos.", "Seguir jugando", "Volver a niveles"],
    "pt-BR": ["Sair desta órbita?", "A tentativa atual e a contagem de lançamentos serão descartadas.", "Continuar jogando", "Voltar às fases"],
    fr: ["Quitter cette orbite ?", "La tentative en cours et le nombre de lâchers seront perdus.", "Continuer", "Retour aux niveaux"],
    de: ["Diese Umlaufbahn verlassen?", "Der aktuelle Versuch und die Anzahl der Freigaben werden verworfen.", "Weiterspielen", "Zurück zu den Stufen"],
    it: ["Lasciare questa orbita?", "Il tentativo corrente e il conteggio dei rilasci verranno scartati.", "Continua a giocare", "Torna ai livelli"],
    ru: ["Покинуть эту орбиту?", "Текущая попытка и число запусков будут сброшены.", "Продолжить игру", "Вернуться к этапам"],
    hi: ["इस कक्षा से बाहर जाएँ?", "मौजूदा प्रयास और रिलीज़ की गिनती हटा दी जाएगी।", "खेल जारी रखें", "स्टेज पर लौटें"],
    ar: ["مغادرة هذا المدار؟", "سيتم تجاهل المحاولة الحالية وعدد مرات الإطلاق.", "متابعة اللعب", "العودة إلى المراحل"],
  };
  Object.entries(START_LABELS).forEach(([locale, label]) => {
    if (locales?.[locale]) locales[locale].start = label;
  });
  const ensureStylesheet = () => {
    if (document.querySelector('link[href*="interface-7-cleanup.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "interface-7-cleanup.css?v=20260922-orbit-interface7-cleanup-v2";
    document.head.append(link);
  };
  ensureStylesheet();
  const motionStyle = document.createElement("style");
  motionStyle.textContent = `
    .orbit-card{transition:transform .22s ease,box-shadow .22s ease}
    .orbit-card:hover,.orbit-card:focus-visible{transform:translateY(-5px);box-shadow:0 12px 24px rgba(20,70,85,.18)}
    .beacon{transition:filter .18s ease;will-change:transform}.seed{will-change:transform}
    .battle-status{transition:transform .2s ease,opacity .2s ease}
    .primary-btn,.secondary-btn{transition:transform .14s ease,filter .14s ease}
    .primary-btn:active,.secondary-btn:active{transform:scale(.97)}
    @media (prefers-reduced-motion:reduce){.orbit-card,.battle-status,.primary-btn,.secondary-btn{transition:none!important}}
  `;
  document.head.append(motionStyle);
  const rounds = [
    { angle: 42, tolerance: 18, wind: 0, motion: 0 },
    { angle: 188, tolerance: 14, wind: 0, motion: 12 },
    { angle: 306, tolerance: 11, wind: 28, motion: 18 },
  ];
  const roundNames = {
    en: ["Dew Beacon", "Moon Apple", "Star Pear"],
    "zh-Hant": ["露珠信標", "月光蘋果", "星星梨"],
    "zh-Hans": ["露珠信标", "月光苹果", "星星梨"],
    ja: ["露のビーコン", "月のリンゴ", "星のナシ"],
    ko: ["이슬 신호기", "달빛 사과", "별 배"],
    es: ["Faro de rocío", "Manzana lunar", "Pera estelar"],
    "pt-BR": ["Farol de orvalho", "Maçã lunar", "Pera estelar"],
    fr: ["Phare de rosée", "Pomme lunaire", "Poire étoilée"],
    de: ["Tautropfen-Leuchtfeuer", "Mondapfel", "Sternbirne"],
    it: ["Faro di rugiada", "Mela lunare", "Pera stellare"],
    ru: ["Роса-маяк", "Лунное яблоко", "Звёздная груша"],
    hi: ["ओस संकेतक", "चाँद सेब", "तारा नाशपाती"],
    ar: ["منارة الندى", "تفاحة القمر", "كمثرى النجمة"],
  };
  const routeMap = { en: "en", "zh-tw": "zh-Hant", "zh-hant": "zh-Hant", "zh-cn": "zh-Hans", "zh-hans": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const state = { locale: "en", sound: !window.WeightPlayAudio.isMuted(), round: 0, angle: 0, releases: 0, selected: 0, locked: false, targetOffset: 0 };
  let motionFrame = 0;
  let motionStart = 0;
  window.addEventListener("weightplay:audio-volume-change", () => {
    state.sound = !window.WeightPlayAudio.isMuted();
    if (document.readyState !== "loading") applyLocale();
  });
  const $ = (id) => document.getElementById(id);
  let pendingAdvanceTimer = 0;
  let pendingAdvance = false;
  const storage = { get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }, set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} } };
  const t = (key, vars = {}) => { const copy = locales[state.locale] || locales.en; return String(copy[key] || locales.en[key] || key).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? "")); };
  function queryLocale() { const q = new URLSearchParams(location.search).get("lang"); if (q && locales[q]) return q; const segment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase(); return routeMap[segment] || storage.get("weightplay-orbit-locale") || "en"; }
  function tone(kind) { return window.WeightPlayAudio?.play(kind === "good" ? "feedback.success" : "feedback.error"); }
  function applyLeaveCopy() {
    const dialog = $("orbitLeaveDialog");
    if (!dialog) return;
    const copy = LEAVE_COPY[state.locale] || LEAVE_COPY.en;
    $("orbitLeaveTitle").textContent = copy[0];
    $("orbitLeaveText").textContent = copy[1];
    $("orbitLeaveContinue").textContent = copy[2];
    $("orbitLeaveStages").textContent = copy[3];
  }
  function applyLocale() { const copy = locales[state.locale] || locales.en; document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale; document.documentElement.dir = copy.direction || "ltr"; document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); }); document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.copyAriaLabel)); }); $("settingsBtn").setAttribute("aria-label", t("settings")); $("settingsPanel").setAttribute("aria-label", t("settings")); $("soundBtn").textContent = t(state.sound ? "soundOn" : "soundOff"); $("angleInput").setAttribute("aria-label", t("dial")); $("orbitDial").setAttribute("aria-label", t("dial")); applyLeaveCopy(); renderStage(); if (!$('battleScreen').hidden) renderBattle(); }
  function populateLocales() { const select = $("localeSelect"); locales.__localeKeys.forEach((key) => { const option = document.createElement("option"); option.value = key; option.textContent = locales.en.languageNames[key] || key; select.append(option); }); select.value = state.locale; select.addEventListener("change", () => { state.locale = select.value; storage.set("weightplay-orbit-locale", state.locale); applyLocale(); }); }
  function installBattleSubstates() {
    const battle = $("battleScreen");
    const shell = battle?.querySelector(".logical-shell");
    const result = $("resultScreen");
    if (shell && result && result.parentElement !== shell) {
      result.classList.add("battle-result-substate");
      result.hidden = true;
      shell.append(result);
    }
    const mapButton = $("mapBtn");
    if (mapButton) {
      mapButton.hidden = true;
      mapButton.setAttribute("aria-hidden", "true");
      mapButton.tabIndex = -1;
    }
    if (!shell || $("orbitLeaveDialog")) return;
    const dialog = document.createElement("div");
    dialog.id = "orbitLeaveDialog";
    dialog.className = "orbit-leave-dialog";
    dialog.hidden = true;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "orbitLeaveTitle");
    dialog.setAttribute("aria-describedby", "orbitLeaveText");
    dialog.innerHTML = '<div class="orbit-leave-card"><h2 id="orbitLeaveTitle"></h2><p id="orbitLeaveText"></p><div class="orbit-leave-actions"><button id="orbitLeaveContinue" class="primary-btn" type="button"></button><button id="orbitLeaveStages" class="secondary-btn" type="button"></button></div></div>';
    shell.append(dialog);
    $("orbitLeaveContinue").addEventListener("click", () => closeLeave());
    $("orbitLeaveStages").addEventListener("click", confirmLeave);
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeLeave();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = [$("orbitLeaveContinue"), $("orbitLeaveStages")].filter(Boolean);
      if (controls.length < 2) return;
      const index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        controls[controls.length - 1].focus();
      } else if (!event.shiftKey && index === controls.length - 1) {
        event.preventDefault();
        controls[0].focus();
      }
    });
    applyLeaveCopy();
  }
  function show(screen) {
    const resultState = screen === "resultScreen";
    const scene = resultState ? "battleScreen" : screen;
    ["mainScreen", "stageScreen", "battleScreen"].forEach((id) => { $(id).hidden = id !== scene; });
    const result = $("resultScreen");
    if (result) result.hidden = !resultState;
    const battleContent = $("battleScreen")?.querySelector(".battle-content");
    if (battleContent) {
      battleContent.hidden = resultState;
      battleContent.inert = resultState;
    }
    $("mainScreen").parentElement.querySelector(".guide-card")?.toggleAttribute("hidden", scene !== "mainScreen");
    document.body.dataset.screen = resultState ? "battle" : scene.replace("Screen", "");
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    window.scrollTo(0, 0);
  }
  function renderStage() { if (!$('stageScreen') || $('stageScreen').hidden) return; const list = $("orbitList"); const names = roundNames[state.locale] || roundNames.en; list.replaceChildren(...rounds.map((item, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "orbit-card"; button.innerHTML = `<strong>${t("orbit", { current: index + 1, total: rounds.length })}</strong><span>${names[index]}</span><em>${t("target", { angle: item.angle })}</em>`; button.addEventListener("click", () => { state.round = index; startRound(); }); return button; })); window.dispatchEvent(new Event("weightplay:stage-sync")); }
  function resetBattleStatus() { $("battleStatus").textContent = t("ready"); $("battleStatus").className = "battle-status"; }
  function cancelPendingAdvance() { if (pendingAdvanceTimer) window.clearTimeout(pendingAdvanceTimer); pendingAdvanceTimer = 0; pendingAdvance = false; state.locked = false; }
  function effectiveTarget() { return (rounds[state.round].angle + state.targetOffset + 360) % 360; }
  function stopMotion() { if (motionFrame) cancelAnimationFrame(motionFrame); motionFrame = 0; motionStart = 0; state.targetOffset = 0; }
  function startMotion() {
    stopMotion();
    const span = rounds[state.round].motion || 0;
    if (!span || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    const tick = (now) => {
      if (!motionStart) motionStart = now;
      state.targetOffset = Math.sin((now - motionStart) / 850) * span;
      const beacon = $("beacon");
      if (beacon && !$("battleScreen").hidden && $("resultScreen")?.hidden) {
        beacon.style.transform = `rotate(${effectiveTarget()}deg) translateX(105px)`;
        motionFrame = requestAnimationFrame(tick);
      } else stopMotion();
    };
    motionFrame = requestAnimationFrame(tick);
  }
  function burst(kind) {
    const dial = $("orbitDial");
    if (!dial?.animate) return;
    const frames = kind === "good"
      ? [{ transform:"scale(1)" }, { transform:"scale(1.045)" }, { transform:"scale(1)" }]
      : [{ transform:"translateX(0)" }, { transform:"translateX(-7px)" }, { transform:"translateX(7px)" }, { transform:"translateX(0)" }];
    dial.animate(frames, { duration: kind === "good" ? 360 : 260, easing:"cubic-bezier(.2,.8,.2,1)" });
  }
  function start() { cancelPendingAdvance(); state.round = 0; state.releases = 0; resetBattleStatus(); openMap(); }
  function startRound() { cancelPendingAdvance(); stopMotion(); closeLeave({ resume: false, focus: false }); state.angle = 0; state.targetOffset = 0; resetBattleStatus(); show("battleScreen"); renderBattle(); startMotion(); $("angleInput").focus(); }
  function renderBattle() { const item = rounds[state.round]; const target = effectiveTarget(); $("roundLabel").textContent = t("orbit", { current: state.round + 1, total: rounds.length }); $("targetLabel").textContent = `${t("target", { angle: Math.round(target) })}${item.wind ? ` · ↻ +${item.wind}°` : ""}`; $("releaseCount").textContent = String(state.releases); $("angleInput").value = String(state.angle); $("angleReadout").textContent = item.wind ? `${state.angle}° → ${(state.angle + item.wind) % 360}°` : `${state.angle}°`; $("beacon").style.transform = `rotate(${target}deg) translateX(105px)`; $("seed").style.transform = `rotate(${state.angle}deg) translateX(78px)`; $("releaseBtn").disabled = state.locked; $("clearBtn").disabled = state.locked; $("angleInput").disabled = state.locked; if (!$("battleStatus").textContent) $("battleStatus").textContent = t("ready"); }
  function shortestDelta(a, b) { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); }
  function completeSuccessfulRelease() {
    pendingAdvanceTimer = 0;
    pendingAdvance = false;
    if (state.round < rounds.length - 1) {
      state.round += 1;
      state.angle = 0;
      $("battleStatus").textContent = t("ready");
      $("battleStatus").className = "battle-status";
      renderBattle();
      startMotion();
      $("angleInput").focus();
    } else finish();
  }
  function scheduleSuccessfulRelease() {
    if (pendingAdvanceTimer) window.clearTimeout(pendingAdvanceTimer);
    pendingAdvance = true;
    pendingAdvanceTimer = window.setTimeout(completeSuccessfulRelease, 360);
  }
  function release() {
    if (state.locked) return;
    state.locked = true;
    const target = effectiveTarget();
    stopMotion();
    state.releases += 1;
    $("releaseCount").textContent = String(state.releases);
    const item = rounds[state.round];
    const landing = (state.angle + (item.wind || 0)) % 360;
    const delta = shortestDelta(landing, target);
    $("seed")?.animate?.(
      [{ transform:`rotate(${state.angle}deg) translateX(78px) scale(1)` }, { transform:`rotate(${landing}deg) translateX(105px) scale(.82)` }],
      { duration:320, easing:"cubic-bezier(.2,.75,.25,1)" }
    );
    if (delta <= item.tolerance) {
      $("battleStatus").textContent = t("close");
      $("battleStatus").className = "battle-status is-good";
      burst("good"); tone("good"); scheduleSuccessfulRelease(); return;
    }
    const side = ((landing - target + 360) % 360) < 180 ? "ahead" : "behind";
    $("battleStatus").textContent = `${t("miss", { delta: Math.round(delta) })} ${t(side)}`;
    $("battleStatus").className = "battle-status is-miss";
    burst("miss"); tone("miss");
    window.setTimeout(() => { state.locked = false; renderBattle(); startMotion(); }, 340);
  }
  function finish() { cancelPendingAdvance(); const key = "weightplay-orbit-orchard-best-releases"; const prior = Number(storage.get(key)); if (!prior || state.releases < prior) storage.set(key, String(state.releases)); $("resultText").textContent = t("finishText", { releases: state.releases }); $("bestValue").textContent = storage.get(key) || String(state.releases); $("resultNextBtn").disabled = state.round >= rounds.length - 1; show("resultScreen"); }
  function closeLeave({ resume = true, focus = true } = {}) {
    const dialog = $("orbitLeaveDialog");
    if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    const battleContent = $("battleScreen")?.querySelector(".battle-content");
    if (battleContent && !$("resultScreen")?.hidden) battleContent.inert = true;
    else if (battleContent) battleContent.inert = false;
    if (resume && pendingAdvance && !pendingAdvanceTimer) scheduleSuccessfulRelease();
    if (focus) $("battleBackBtn")?.focus();
  }
  function openLeave() {
    if ($("battleScreen")?.hidden || !$("resultScreen")?.hidden) return;
    const dialog = $("orbitLeaveDialog");
    if (!dialog) return;
    if (pendingAdvanceTimer) {
      window.clearTimeout(pendingAdvanceTimer);
      pendingAdvanceTimer = 0;
    }
    applyLeaveCopy();
    dialog.hidden = false;
    const battleContent = $("battleScreen")?.querySelector(".battle-content");
    if (battleContent) battleContent.inert = true;
    $("orbitLeaveContinue")?.focus();
  }
  function confirmLeave() {
    cancelPendingAdvance();
    closeLeave({ resume: false, focus: false });
    openMap();
  }
  function goHome() { cancelPendingAdvance(); stopMotion(); closeLeave({ resume: false, focus: false }); show("mainScreen"); applyLocale(); }
  function openMap() { cancelPendingAdvance(); stopMotion(); closeLeave({ resume: false, focus: false }); show("stageScreen"); renderStage(); }
  function toggleSettings() { const panel = $("settingsPanel"); const open = panel.hidden; panel.hidden = !open; $("settingsBtn").setAttribute("aria-expanded", String(open)); }
  state.locale = queryLocale();
  document.addEventListener("DOMContentLoaded", () => {
    installBattleSubstates();
    populateLocales();
    applyLocale();
    window.setTimeout(() => { $("loadingPanel").hidden = true; $("app").hidden = false; }, 260);
    $("startBtn").addEventListener("click", start);
    $("resultMapBtn").addEventListener("click", openMap);
    $("resultNextBtn").addEventListener("click", () => { if (!$("resultNextBtn").disabled && state.round < rounds.length - 1) startRound(); });
    $("resultReplayBtn").addEventListener("click", start);
    $("homeBtn")?.addEventListener("click", goHome);
    $("stageBackBtn").addEventListener("click", goHome);
    $("battleBackBtn").addEventListener("click", openLeave);
    $("releaseBtn").addEventListener("click", release);
    $("clearBtn").addEventListener("click", () => { if (state.locked) return; state.angle = 0; resetBattleStatus(); renderBattle(); });
    $("angleInput").addEventListener("input", (event) => { if (state.locked) return; state.angle = Number(event.target.value); renderBattle(); });
    $("settingsBtn").addEventListener("click", toggleSettings);
    $("closeSettingsBtn").addEventListener("click", () => { $("settingsPanel").hidden = true; $("settingsBtn").setAttribute("aria-expanded", "false"); });
    $("soundBtn").addEventListener("click", () => { state.sound = window.WeightPlayAudio.setEnabled(!state.sound); applyLocale(); });
  });
  window.ORBIT_ORCHARD_TEST = { rounds, start, release, renderBattle };
})();
