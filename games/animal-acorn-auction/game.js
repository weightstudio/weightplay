(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const locales = window.ACORN_AUCTION_LOCALES || {};
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const routeLocales = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const guideInfoCopy = {
    en: { kicker: "WeightPlay Original Game Guide", gameplay: "Gameplay", gameplayValue: "Quantity and budget choice puzzle", genre: "Genre", genreValue: "Puzzle · Logic · Planning · Family · Animal", faq: "FAQ", faqQuestion: "Is progress saved?", faqAnswer: "Yes, only in this browser.", guideAria: "Acorn Auction game information" },
    "zh-Hant": { kicker: "WeightPlay 原創遊戲指南", gameplay: "玩法", gameplayValue: "數量與預算選擇益智", genre: "類型", genreValue: "益智 · 邏輯 · 規劃 · 家庭 · 動物", faq: "常見問題", faqQuestion: "進度會保存嗎？", faqAnswer: "會，只保存在這個瀏覽器中。", guideAria: "橡果拍賣遊戲資訊" },
    "zh-Hans": { kicker: "WeightPlay 原创游戏指南", gameplay: "玩法", gameplayValue: "数量与预算选择益智", genre: "类型", genreValue: "益智 · 逻辑 · 规划 · 家庭 · 动物", faq: "常见问题", faqQuestion: "进度会保存吗？", faqAnswer: "是，仅保存在此浏览器中。", guideAria: "橡果拍卖游戏信息" },
    ja: { kicker: "WeightPlay オリジナルゲームガイド", gameplay: "ゲーム内容", gameplayValue: "数量と予算を選ぶパズル", genre: "ジャンル", genreValue: "パズル · ロジック · 計画 · ファミリー · 動物", faq: "よくある質問", faqQuestion: "進行状況は保存されますか？", faqAnswer: "はい、このブラウザにのみ保存されます。", guideAria: "どんぐりオークション ゲーム情報" },
    ko: { kicker: "WeightPlay 오리지널 게임 가이드", gameplay: "게임플레이", gameplayValue: "수량과 예산 선택 퍼즐", genre: "장르", genreValue: "퍼즐 · 논리 · 계획 · 가족 · 동물", faq: "자주 묻는 질문", faqQuestion: "진행 상황이 저장되나요?", faqAnswer: "예, 이 브라우저에만 저장됩니다.", guideAria: "도토리 경매 게임 정보" },
    es: { kicker: "Guía de juegos originales de WeightPlay", gameplay: "Jugabilidad", gameplayValue: "Puzle de elección de cantidad y presupuesto", genre: "Género", genreValue: "Puzle · Lógica · Planificación · Familiar · Animales", faq: "Preguntas frecuentes", faqQuestion: "¿Se guarda el progreso?", faqAnswer: "Sí, solo en este navegador.", guideAria: "Información del juego Subasta de bellotas" },
    "pt-BR": { kicker: "Guia de jogos originais WeightPlay", gameplay: "Jogabilidade", gameplayValue: "Quebra-cabeça de escolha de quantidade e orçamento", genre: "Gênero", genreValue: "Quebra-cabeça · Lógica · Planejamento · Família · Animais", faq: "Perguntas frequentes", faqQuestion: "O progresso é salvo?", faqAnswer: "Sim, apenas neste navegador.", guideAria: "Informações do jogo Leilão de bolotas" },
    fr: { kicker: "Guide des jeux originaux WeightPlay", gameplay: "Jeu", gameplayValue: "Puzzle de choix de quantité et de budget", genre: "Genre", genreValue: "Puzzle · Logique · Planification · Famille · Animaux", faq: "Questions fréquentes", faqQuestion: "La progression est-elle sauvegardée ?", faqAnswer: "Oui, uniquement dans ce navigateur.", guideAria: "Informations sur le jeu Vente aux enchères de glands" },
    de: { kicker: "WeightPlay-Leitfaden für Originalspiele", gameplay: "Spielweise", gameplayValue: "Rätsel zur Wahl von Menge und Budget", genre: "Genre", genreValue: "Rätsel · Logik · Planung · Familie · Tiere", faq: "Häufige Fragen", faqQuestion: "Wird der Fortschritt gespeichert?", faqAnswer: "Ja, nur in diesem Browser.", guideAria: "Informationen zum Spiel Eichel-Auktion" },
    it: { kicker: "Guida ai giochi originali WeightPlay", gameplay: "Gioco", gameplayValue: "Puzzle di scelta tra quantità e budget", genre: "Genere", genreValue: "Puzzle · Logica · Pianificazione · Famiglia · Animali", faq: "Domande frequenti", faqQuestion: "I progressi vengono salvati?", faqAnswer: "Sì, solo in questo browser.", guideAria: "Informazioni sul gioco Asta delle ghiande" },
    ru: { kicker: "Руководство по оригинальным играм WeightPlay", gameplay: "Геймплей", gameplayValue: "Головоломка выбора количества и бюджета", genre: "Жанр", genreValue: "Головоломка · Логика · Планирование · Семейная · Животные", faq: "Частые вопросы", faqQuestion: "Сохраняется ли прогресс?", faqAnswer: "Да, только в этом браузере.", guideAria: "Информация об игре «Аукцион желудей»" },
    hi: { kicker: "WeightPlay मौलिक गेम गाइड", gameplay: "गेमप्ले", gameplayValue: "मात्रा और बजट चुनने की पहेली", genre: "शैली", genreValue: "पहेली · तर्क · योजना · परिवार · जानवर", faq: "अक्सर पूछे जाने वाले प्रश्न", faqQuestion: "क्या प्रगति सहेजी जाती है?", faqAnswer: "हाँ, केवल इसी ब्राउज़र में।", guideAria: "बलूत नीलामी गेम की जानकारी" },
    ar: { kicker: "دليل ألعاب WeightPlay الأصلية", gameplay: "طريقة اللعب", gameplayValue: "لغز اختيار الكمية والميزانية", genre: "النوع", genreValue: "لغز · منطق · تخطيط · عائلية · حيوانات", faq: "الأسئلة الشائعة", faqQuestion: "هل يُحفظ التقدم؟", faqAnswer: "نعم، في هذا المتصفح فقط.", guideAria: "معلومات لعبة مزاد البلوط" },
  };
  const storage = (() => { try { return window.localStorage; } catch { return { getItem: () => null, setItem: () => {} }; } })();
  const rounds = [
    { id: 1, name: "round1", hint: "hint1", request: "request1", animal: "animal1", count: 3, budget: 5, answer: 1, lots: [[2, 4], [3, 5], [4, 6]] },
    { id: 2, name: "round2", hint: "hint2", request: "request2", animal: "animal2", count: 4, budget: 6, answer: 1, lots: [[3, 4], [4, 6], [5, 8]] },
    { id: 3, name: "round3", hint: "hint3", request: "request3", animal: "animal3", count: 2, budget: 7, answer: 0, lots: [[2, 7], [3, 5], [4, 8]] },
  ];
  const normalizeLocale = (value) => {
    if (value === "zh-TW") return "zh-Hant";
    if (value === "zh-CN") return "zh-Hans";
    if (value?.toLowerCase?.().startsWith("pt")) return "pt-BR";
    return supportedLocales.includes(value) ? value : "en";
  };
  const pathLocale = routeLocales[window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase?.()];
  let locale = normalizeLocale(pathLocale || window.WonderI18n?.localeFromPath?.() || window.WonderI18n?.actualLocale?.() || storage.getItem("weightplay-acorn-auction-locale") || "en");
  if (!locales[locale]) locale = "en";
  let sound = storage.getItem("weightplay-acorn-auction-sound") !== "off";
  let roundIndex = 0; let phase = "main"; let picks = 0; let sessionPicks = 0; let solved = new Set(); let feedback = ""; let timer = null;
  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const bestValue = () => Number(storage.getItem("weightplay-acorn-auction-best-v1") || 0) || "—";
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `acorn_auction_${name}`, round: roundIndex + 1, picks, ...data }); };
  const setText = (node, value) => { if (node && node.textContent !== value) node.replaceChildren(document.createTextNode(value)); };
  const guideElement = () => $("gameGuide") || document.querySelector(".game-page-info[data-wp-acorn-auction-guide]");
  function applyGuideLocale() {
    const guide = document.querySelector(".game-page-info[data-wp-acorn-auction-guide]");
    if (!guide) return;
    const guideCopy = guideInfoCopy[locale] || guideInfoCopy.en;
    if (guide.getAttribute("aria-label") !== guideCopy.guideAria) guide.setAttribute("aria-label", guideCopy.guideAria);
    setText(guide.querySelector(".game-info-kicker"), guideCopy.kicker);
    setText(guide.querySelector(".game-info-title h2"), copy("title"));
    setText(guide.querySelector(".game-info-title p"), copy("intro"));
    const facts = guide.querySelectorAll(".game-info-fact");
    setText(facts[0]?.querySelector("span"), guideCopy.gameplay);
    setText(facts[0]?.querySelector("strong"), guideCopy.gameplayValue);
    setText(facts[1]?.querySelector("span"), guideCopy.genre);
    setText(facts[1]?.querySelector("strong") || facts[1]?.querySelector(".game-info-tags"), guideCopy.genreValue);
    const faqSection = [...guide.querySelectorAll(".game-info-section")].find((section) => section.querySelector("dl"));
    setText(faqSection?.querySelector("h3"), guideCopy.faq);
    setText(faqSection?.querySelector("dt"), guideCopy.faqQuestion);
    setText(faqSection?.querySelector("dd"), guideCopy.faqAnswer);
  }
  function show(screen) { phase = screen; document.querySelectorAll("[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; }); $("settingsPanel").hidden = true; $("backBtn").hidden = false; const guide = guideElement(); if (guide) guide.hidden = screen !== "main"; $("stageReserve").hidden = screen !== "stage"; $("battleReserve").hidden = screen !== "battle"; }
  function renderStatic() {
    const guideCopy = guideInfoCopy[locale] || guideInfoCopy.en;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy(node.dataset.i18n); });
    document.querySelectorAll(".wp-shell-return").forEach((node) => node.setAttribute("aria-label", copy("close")));
    document.querySelectorAll("[data-wp-settings]").forEach((node) => node.setAttribute("aria-label", copy("settings")));
    $("closeSettings").setAttribute("aria-label", copy("close"));
    $("localeSelect").setAttribute("aria-label", copy("language"));
    $("soundBtn").textContent = sound ? copy("on") : copy("off");
    $("soundBtn").setAttribute("aria-pressed", String(sound));
    $("best").textContent = copy("best", { best: bestValue() });
    applyGuideLocale();
    renderStages(); renderBattle(); renderResult();
  }
  function renderStages() { const root = $("stageList"); if (!root) return; root.setAttribute("aria-label", copy("rounds")); root.replaceChildren(); rounds.forEach((round, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "stage-card"; button.dataset.roundIndex = String(index); button.setAttribute("role", "tab"); button.setAttribute("aria-selected", String(roundIndex === index)); button.setAttribute("aria-controls", "battleScreen"); button.innerHTML = `<span><strong>${copy(round.name)}</strong><small>${copy(round.hint)}</small></span><span class="arrow">${solved.has(index) ? "✓" : "→"}</span>`; button.addEventListener("click", () => startRound(index, true)); root.appendChild(button); }); }
  function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }
  function startRound(index, fromStage = false) { clearTimer(); roundIndex = index; picks = 0; feedback = ""; if (index === 0 || fromStage) sessionPicks = 0; show("battle"); phase = "choose"; renderBattle(); announce("start"); }
  function replayRound() { phase = "choose"; feedback = ""; renderBattle(); }
  function renderBattle() { if (!$("lotCards") || phase === "main" || phase === "stage" || phase === "result") return; const round = rounds[roundIndex]; $("roundTitle").textContent = copy(round.name); $("progressPill").textContent = `${roundIndex + 1} / ${rounds.length}`; $("requestTitle").textContent = `${copy("request")} · ${copy(round.animal)}`; $("requestText").textContent = copy(round.request); $("prompt").textContent = feedback === "wrong" ? copy("wrong") : feedback === "correct" ? copy("correct") : copy("prompt"); const feedbackArt = $("feedbackArt"); if (feedbackArt) { feedbackArt.hidden = !feedback; feedbackArt.className = `feedback-art ${feedback ? `feedback-art--${feedback}` : ""}`; } const root = $("lotCards"); root.setAttribute("aria-label", copy("lotLabel", { count: round.lots.length })); root.replaceChildren(); round.lots.forEach(([count, cost], index) => { const button = document.createElement("button"); button.type = "button"; button.className = `lot-card ${feedback === "correct" && index === round.answer ? "is-correct" : ""}`; button.disabled = phase !== "choose"; button.setAttribute("data-wp-primary-action", "true"); button.setAttribute("aria-label", copy("lotLabel", { count: index + 1 }) + ": " + copy("lot", { count, cost })); button.innerHTML = `<span class="lot-icon lot-icon--${index + 1}" aria-hidden="true"></span><strong>${copy("lotLabel", { count: index + 1 })}</strong><span>${copy("lot", { count, cost })}</span>`; button.addEventListener("click", () => chooseLot(index)); root.appendChild(button); }); $("resetBtn").disabled = phase === "complete"; $("status").textContent = copy("selected", { count: picks }); $("status").className = feedback === "correct" ? "status good" : feedback === "wrong" ? "status try" : "status"; }
  function chooseLot(index) { if (phase !== "choose") return; const round = rounds[roundIndex]; picks += 1; sessionPicks += 1; if (index !== round.answer) { feedback = "wrong"; phase = "retry"; announce("wrong", { lot: index + 1 }); renderBattle(); timer = setTimeout(replayRound, 760); return; } solved.add(roundIndex); feedback = "correct"; phase = "complete"; announce("complete", { lot: index + 1 }); renderBattle(); timer = setTimeout(() => { show("result"); renderResult(); }, 420); }
  function renderResult() { if (!$("resultText")) return; const complete = solved.size === rounds.length; $("resultTitle").textContent = complete ? copy("resultTitle") : copy("resultRound"); $("resultText").textContent = complete ? copy("resultAll", { best: bestValue() }) : copy("resultText", { count: solved.size, picks }); $("nextBtn").hidden = complete; $("resultMapBtn").hidden = !complete; if (complete) { const old = Number(storage.getItem("weightplay-acorn-auction-best-v1") || 0); if (!old || sessionPicks < old) storage.setItem("weightplay-acorn-auction-best-v1", String(sessionPicks)); $("resultText").textContent = copy("resultAll", { best: Math.min(old || sessionPicks, sessionPicks) }); } }
  function nextRound() { const next = roundIndex + 1; if (next < rounds.length) startRound(next); else { show("stage"); renderStages(); } }
  function goBack() { clearTimer(); if (["battle", "choose", "retry", "complete"].includes(phase)) { show("stage"); renderStages(); } else if (phase === "stage" || phase === "result") show("main"); }
  function bind() { $("startBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("mapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("nextBtn").addEventListener("click", nextRound); $("resetBtn").addEventListener("click", () => startRound(roundIndex)); $("backMarketBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("backBtn").addEventListener("click", goBack); $("stageBackBtn").addEventListener("click", () => { show("main"); renderStatic(); }); $("battleBackBtn").addEventListener("click", goBack); const openSettings = () => { $("settingsPanel").hidden = false; }; ["settingsBtn", "stageSettingsBtn", "battleUtilityBtn"].forEach((id) => { const button = $(id); if (button) button.addEventListener("click", openSettings); }); $("closeSettings").addEventListener("click", () => { $("settingsPanel").hidden = true; }); $("soundBtn").addEventListener("click", () => { sound = !sound; storage.setItem("weightplay-acorn-auction-sound", sound ? "on" : "off"); renderStatic(); }); $("localeSelect").addEventListener("change", (event) => { locale = normalizeLocale(event.target.value); storage.setItem("weightplay-acorn-auction-locale", locale); renderStatic(); }); }
  function boot() { bind(); $("localeSelect").value = locale; $("loading").hidden = true; $("app").hidden = false; show("main"); renderStatic(); announce("loaded"); }
  window.__ACORN_AUCTION_TEST__ = { rounds, startRound, chooseLot, getState: () => ({ roundIndex, phase, solved: [...solved], picks, screen: phase }) };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
