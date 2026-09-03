(function () {
  "use strict";
  const copy = window.BALANCE_LOCALES || {};
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const guideInfoCopy = {
    en: { kicker: "WeightPlay Original Game Guide", gameplay: "Gameplay", gameplayValue: "Balance Subset Puzzle", genre: "Genre", genreValue: "Puzzle · Balance · Logic · Family · Animal", faq: "FAQ", faqQuestion: "Is progress saved?", faqAnswer: "Yes, only in this browser.", stageHelp: "Grove help", stageSections: "Grove sections", guideAria: "Balance Grove game information" },
    "zh-Hant": { kicker: "WeightPlay 原創遊戲指南", gameplay: "玩法", gameplayValue: "平衡子集合益智", genre: "類型", genreValue: "益智 · 平衡 · 邏輯 · 家庭 · 動物", faq: "常見問題", faqQuestion: "進度會保存嗎？", faqAnswer: "會，只保存在這個瀏覽器中。", stageHelp: "林地說明", stageSections: "林地區段", guideAria: "平衡林地遊戲資訊" },
    "zh-Hans": { kicker: "WeightPlay 原创游戏指南", gameplay: "玩法", gameplayValue: "平衡子集益智", genre: "类型", genreValue: "益智 · 平衡 · 逻辑 · 家庭 · 动物", faq: "常见问题", faqQuestion: "进度会保存吗？", faqAnswer: "是，仅保存在此浏览器中。", stageHelp: "林地说明", stageSections: "林地区段", guideAria: "平衡林地游戏信息" },
    ja: { kicker: "WeightPlay オリジナルゲームガイド", gameplay: "ゲーム内容", gameplayValue: "バランス部分集合パズル", genre: "ジャンル", genreValue: "パズル · バランス · ロジック · ファミリー · 動物", faq: "よくある質問", faqQuestion: "進行状況は保存されますか？", faqAnswer: "はい、このブラウザにのみ保存されます。", stageHelp: "森のヘルプ", stageSections: "森のセクション", guideAria: "バランスの森 ゲーム情報" },
    ko: { kicker: "WeightPlay 오리지널 게임 가이드", gameplay: "게임플레이", gameplayValue: "균형 부분집합 퍼즐", genre: "장르", genreValue: "퍼즐 · 균형 · 논리 · 가족 · 동물", faq: "자주 묻는 질문", faqQuestion: "진행 상황이 저장되나요?", faqAnswer: "예, 이 브라우저에만 저장됩니다.", stageHelp: "숲 도움말", stageSections: "숲 섹션", guideAria: "밸런스 숲 게임 정보" },
    es: { kicker: "Guía de juegos originales de WeightPlay", gameplay: "Jugabilidad", gameplayValue: "Puzle de equilibrio por subconjuntos", genre: "Género", genreValue: "Puzle · Equilibrio · Lógica · Familiar · Animales", faq: "Preguntas frecuentes", faqQuestion: "¿Se guarda el progreso?", faqAnswer: "Sí, solo en este navegador.", stageHelp: "Ayuda del bosque", stageSections: "Secciones del bosque", guideAria: "Información del juego Bosque Equilibrio" },
    "pt-BR": { kicker: "Guia de jogos originais WeightPlay", gameplay: "Jogabilidade", gameplayValue: "Quebra-cabeça de equilíbrio por subconjuntos", genre: "Gênero", genreValue: "Quebra-cabeça · Equilíbrio · Lógica · Família · Animais", faq: "Perguntas frequentes", faqQuestion: "O progresso é salvo?", faqAnswer: "Sim, somente neste navegador.", stageHelp: "Ajuda do bosque", stageSections: "Seções do bosque", guideAria: "Informações do jogo Bosque Equilíbrio" },
    fr: { kicker: "Guide des jeux originaux WeightPlay", gameplay: "Jeu", gameplayValue: "Puzzle d’équilibre par sous-ensembles", genre: "Genre", genreValue: "Puzzle · Équilibre · Logique · Famille · Animaux", faq: "Questions fréquentes", faqQuestion: "La progression est-elle sauvegardée ?", faqAnswer: "Oui, uniquement dans ce navigateur.", stageHelp: "Aide du bosquet", stageSections: "Sections du bosquet", guideAria: "Informations sur le jeu Bosquet Équilibre" },
    de: { kicker: "WeightPlay-Leitfaden für Originalspiele", gameplay: "Spielweise", gameplayValue: "Teilmenge-Balance-Rätsel", genre: "Genre", genreValue: "Rätsel · Balance · Logik · Familie · Tiere", faq: "Häufige Fragen", faqQuestion: "Wird der Fortschritt gespeichert?", faqAnswer: "Ja, nur in diesem Browser.", stageHelp: "Hilfe zum Hain", stageSections: "Hainbereiche", guideAria: "Informationen zum Spiel Balance-Hain" },
    it: { kicker: "Guida ai giochi originali WeightPlay", gameplay: "Gioco", gameplayValue: "Puzzle di equilibrio per sottoinsiemi", genre: "Genere", genreValue: "Puzzle · Equilibrio · Logica · Famiglia · Animali", faq: "Domande frequenti", faqQuestion: "I progressi vengono salvati?", faqAnswer: "Sì, solo in questo browser.", stageHelp: "Aiuto del bosco", stageSections: "Sezioni del bosco", guideAria: "Informazioni sul gioco Bosco Equilibrio" },
    ru: { kicker: "Руководство по оригинальным играм WeightPlay", gameplay: "Геймплей", gameplayValue: "Головоломка на баланс подмножеств", genre: "Жанр", genreValue: "Головоломка · Баланс · Логика · Семейная · Животные", faq: "Частые вопросы", faqQuestion: "Сохраняется ли прогресс?", faqAnswer: "Да, только в этом браузере.", stageHelp: "Справка о лесе", stageSections: "Разделы леса", guideAria: "Информация об игре «Равновесный лес»" },
    hi: { kicker: "WeightPlay मौलिक गेम गाइड", gameplay: "गेमप्ले", gameplayValue: "उपसमुच्चय संतुलन पहेली", genre: "शैली", genreValue: "पहेली · संतुलन · तर्क · परिवार · जानवर", faq: "अक्सर पूछे जाने वाले प्रश्न", faqQuestion: "क्या प्रगति सहेजी जाती है?", faqAnswer: "हाँ, केवल इसी ब्राउज़र में।", stageHelp: "वन सहायता", stageSections: "वन अनुभाग", guideAria: "संतुलन वन गेम की जानकारी" },
    ar: { kicker: "دليل ألعاب WeightPlay الأصلية", gameplay: "طريقة اللعب", gameplayValue: "لغز توازن المجموعات الجزئية", genre: "النوع", genreValue: "لغز · توازن · منطق · عائلية · حيوانات", faq: "الأسئلة الشائعة", faqQuestion: "هل يُحفظ التقدم؟", faqAnswer: "نعم، في هذا المتصفح فقط.", stageHelp: "مساعدة الغابة", stageSections: "أقسام الغابة", guideAria: "معلومات لعبة غابة التوازن" },
  };
  const normalizeLocale = (value) => {
    if (value === "zh-TW") return "zh-Hant";
    if (value === "zh-CN") return "zh-Hans";
    if (value?.toLowerCase?.().startsWith("pt")) return "pt-BR";
    if (supportedLocales.includes(value)) return value;
    const short = value?.split?.("-")?.[0];
    return supportedLocales.includes(short) ? short : "en";
  };
  const stages = [
    { title: "stageTitle1", hint: "stageHint1", target: 5, pieces: [["stoneAcorn", 1, "●"], ["stonePebble", 2, "◆"], ["stoneTwig", 3, "▲"], ["stoneBerry", 4, "✦"]], solutions: [[2, 3]] },
    { title: "stageTitle2", hint: "stageHint2", target: 7, pieces: [["stoneAcorn", 1, "●"], ["stonePebble", 2, "◆"], ["stoneTwig", 3, "▲"], ["stoneBerry", 4, "✦"], ["stoneShell", 5, "⬟"]], solutions: [[2, 5], [3, 4]] },
    { title: "stageTitle3", hint: "stageHint3", target: 9, pieces: [["stoneAcorn", 1, "●"], ["stonePebble", 2, "◆"], ["stoneTwig", 3, "▲"], ["stoneBerry", 4, "✦"], ["stoneShell", 5, "⬟"], ["stoneFirefly", 6, "✿"]], solutions: [[3, 6], [4, 5]] }
  ];
  const routedLocale = window.WonderI18n?.localeFromPath?.();
  const savedLocale = (() => { try { return localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale"); } catch (error) { return null; } })();
  const state = { locale: normalizeLocale(routedLocale || window.WonderI18n?.actualLocale?.() || document.documentElement.lang || savedLocale), stage: 0, selected: [], checks: 0, sessionChecks: 0, sound: true, storage: true };
  const $ = (id) => document.getElementById(id);
  const screens = { main: $("mainScreen"), stages: $("stageScreen"), battle: $("battleScreen"), result: $("resultScreen") };
  const t = (key, vars) => {
    const table = copy[state.locale] || copy.en || {};
    let value = table[key] || (copy.en && copy.en[key]) || key;
    Object.keys(vars || {}).forEach((name) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(vars[name])); });
    return value;
  };
  const track = (name, detail) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: "animal_balance_grove_" + name }, detail || {}));
    document.dispatchEvent(new CustomEvent("weightplay:balance-grove", { detail: Object.assign({ name }, detail || {}) }));
  };
  const readBest = () => { try { const value = Number(localStorage.getItem("weightplay-animal-balance-grove-best-v1")); return Number.isFinite(value) && value > 0 ? value : null; } catch (error) { state.storage = false; return null; } };
  const writeBest = (value) => { try { const current = readBest(); if (!current || value < current) localStorage.setItem("weightplay-animal-balance-grove-best-v1", String(value)); } catch (error) { state.storage = false; } };
  const show = (name) => Object.keys(screens).forEach((key) => { screens[key].hidden = key !== name; });
  const applyLocale = () => {
    const guideCopy = guideInfoCopy[state.locale] || guideInfoCopy.en;
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("localeSelect").value = state.locale;
    $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("settingsBtn").setAttribute("aria-label", t("settings"));
    $("settingsPanel").setAttribute("aria-label", t("settings"));
    $("localeSelect").setAttribute("aria-label", t("language"));
    document.querySelector(".wp-shell-return")?.setAttribute("aria-label", t("lobbyReturn"));
    $("stageInfoBtn").setAttribute("aria-label", guideCopy.stageHelp);
    $("stageInfoBtn").setAttribute("title", guideCopy.stageHelp);
    $("battleInfoBtn").setAttribute("aria-label", guideCopy.stageHelp);
    $("battleInfoBtn").setAttribute("title", guideCopy.stageHelp);
    document.querySelector(".stage-tabs")?.setAttribute("aria-label", guideCopy.stageSections);
    $("tokenTray").setAttribute("aria-label", t("chooseStone"));
    document.querySelector(".scale").setAttribute("aria-label", t("scaleLabel"));
    $("bestValue").textContent = readBest() || t("noBest");
    applyGuideLocale(guideCopy);
    if (!screens.stages.hidden) renderStages();
    if (!screens.battle.hidden) renderBattle();
    if (!screens.result.hidden) renderResult();
  };
  const applyGuideLocale = (guideCopy) => {
    const guide = document.querySelector(".game-page-info[data-wp-balance-grove-guide]");
    if (!guide) return;
    const setText = (node, value) => {
      if (node && node.textContent !== value) node.replaceChildren(document.createTextNode(value));
    };
    if (guide.getAttribute("aria-label") !== guideCopy.guideAria) guide.setAttribute("aria-label", guideCopy.guideAria);
    setText(guide.querySelector(".game-info-kicker"), guideCopy.kicker);
    setText(guide.querySelector(".game-info-title h2"), t("title"));
    setText(guide.querySelector(".game-info-title p"), t("summary"));
    const facts = guide.querySelectorAll(".game-info-fact");
    const gameplayFact = facts[0];
    setText(gameplayFact?.querySelector("span"), guideCopy.gameplay);
    setText(gameplayFact?.querySelector("strong"), guideCopy.gameplayValue);
    const genreFact = facts[1];
    setText(genreFact?.querySelector("span"), guideCopy.genre);
    setText(genreFact?.querySelector("strong") || genreFact?.querySelector(".game-info-tags"), guideCopy.genreValue);
    const faqSection = [...guide.querySelectorAll(".game-info-section")].find((section) => section.querySelector("dl"));
    setText(faqSection?.querySelector("h3"), guideCopy.faq);
    setText(faqSection?.querySelector("dt"), guideCopy.faqQuestion);
    setText(faqSection?.querySelector("dd"), guideCopy.faqAnswer);
  };
  const setLocale = (locale) => { state.locale = normalizeLocale(locale); try { localStorage.setItem("weightPlayLocale", state.locale); localStorage.setItem("weightplayLocale", state.locale); } catch (error) { state.storage = false; } applyLocale(); track("locale", { locale: state.locale }); };
  const beep = (frequency) => { if (!state.sound) return; try { const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return; const context = new AudioContext(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.035, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .12); oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .12); oscillator.addEventListener("ended", () => context.close()); } catch (error) { /* audio is optional */ } };
  const renderStages = () => { $("stageList").innerHTML = stages.map((stage, index) => `<button class="stage-card" type="button" data-stage="${index}"><span class="stage-number">${t("round", { n: index + 1, total: stages.length })}</span><h3>${t(stage.title)}</h3><p>${t(stage.hint)}</p><span class="stage-chip">${t("target", { n: stage.target })}</span></button>`).join(""); $("stageList").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startStage(Number(button.dataset.stage)))); };
  const renderBattle = () => {
    const stage = stages[state.stage];
    $("battleHeading").textContent = t(stage.title);
    $("roundLabel").textContent = t("round", { n: state.stage + 1, total: stages.length });
    $("battleHint").textContent = t("stageReady");
    $("leftGoal").textContent = t("leftPan", { n: 3 + state.stage });
    $("rightGoal").textContent = t("target", { n: stage.target });
    $("leftPanLabel").textContent = t("leftPan", { n: 3 + state.stage });
    $("rightPanLabel").textContent = t("rightPan", { n: state.selected.reduce((sum, index) => sum + stage.pieces[index][1], 0) });
    $("sessionChecks").textContent = String(state.sessionChecks);
    $("selectionCount").textContent = t("selected", { n: state.selected.length });
    $("selectedItems").innerHTML = state.selected.map((index) => `<span class="placed-token placed-token-${index}" aria-label="${t(stage.pieces[index][0])}"></span>`).join("");
    $("tokenTray").innerHTML = stage.pieces.map((piece, index) => `<button class="token-btn" type="button" data-token="${index}" aria-pressed="${state.selected.includes(index)}"><span class="token-icon token-icon-${index}" aria-hidden="true"></span><span><span class="token-name">${t(piece[0])}</span><br><span class="token-value">${piece[1]}</span></span></button>`).join("");
    $("tokenTray").querySelectorAll("[data-token]").forEach((button) => button.addEventListener("click", () => toggleToken(Number(button.dataset.token))));
  };
  const renderResult = () => { const final = state.stage >= stages.length - 1 && state.selected.length === 0; $("resultHeading").textContent = final ? t("finishTitle") : t("balanced"); $("resultText").textContent = final ? t("finishText", { n: state.sessionChecks }) : t("balanced"); $("resultPrimaryBtn").textContent = final ? t("stageMap") : t("next"); $("resultMapBtn").hidden = final; $("resultPrimaryBtn").onclick = final ? () => { show("stages"); renderStages(); } : () => startStage(state.stage + 1); }; 
  const startSession = () => { state.sessionChecks = 0; track("session_start"); show("stages"); renderStages(); track("stage_map", { source: "start" }); };
  const startStage = (index) => { state.stage = Math.max(0, Math.min(stages.length - 1, index)); state.selected = []; state.checks = 0; $("battleStatus").textContent = ""; show("battle"); renderBattle(); track("stage_start", { stage: state.stage + 1 }); };
  const toggleToken = (index) => { state.selected = state.selected.includes(index) ? state.selected.filter((item) => item !== index) : state.selected.concat(index); beep(420); renderBattle(); track("stone_select", { stage: state.stage + 1, value: stages[state.stage].pieces[index][1] }); };
  const clearTokens = () => { state.selected = []; $("battleStatus").textContent = ""; renderBattle(); track("stone_clear", { stage: state.stage + 1 }); };
  const checkBalance = () => { const stage = stages[state.stage]; const values = state.selected.map((index) => stage.pieces[index][1]).sort((a, b) => a - b); const correct = stage.solutions.some((solution) => solution.length === values.length && solution.every((value, index) => value === values[index])); state.checks += 1; state.sessionChecks += 1; track("balance_check", { stage: state.stage + 1, checks: state.checks, correct }); if (correct) { $("battleStatus").textContent = t("balanced"); beep(680); state.selected = []; if (state.stage >= stages.length - 1) { writeBest(state.sessionChecks); track("session_complete", { checks: state.sessionChecks }); show("result"); renderResult(); } else { show("result"); renderResult(); } } else { $("battleStatus").textContent = t("notBalanced"); beep(220); state.selected = []; renderBattle(); } };
  $("startBtn").addEventListener("click", startSession); $("mapBtn").addEventListener("click", () => { show("stages"); renderStages(); track("stage_map"); }); $("stageBackBtn").addEventListener("click", () => { show("main"); applyLocale(); }); $("battleBackBtn").addEventListener("click", () => { show("stages"); renderStages(); }); $("resultMapBtn").addEventListener("click", () => { show("stages"); renderStages(); }); $("resultHomeBtn").addEventListener("click", () => { show("main"); applyLocale(); }); $("checkBtn").addEventListener("click", checkBalance); $("clearBtn").addEventListener("click", clearTokens); $("settingsBtn").addEventListener("click", () => { const panel = $("settingsPanel"); panel.hidden = !panel.hidden; $("settingsBtn").setAttribute("aria-expanded", String(!panel.hidden)); }); $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; applyLocale(); track("sound", { enabled: state.sound }); }); $("localeSelect").addEventListener("change", (event) => { const next = normalizeLocale(event.target.value); if (window.WonderI18n?.setLocale) { window.WonderI18n.setLocale(next); return; } setLocale(next); });
  window.addEventListener?.("wonder:locale-change", (event) => setLocale(event.detail?.locale || window.WonderI18n?.actualLocale?.() || document.documentElement.lang));
  new MutationObserver(() => applyGuideLocale(guideInfoCopy[state.locale] || guideInfoCopy.en)).observe(document.body, { childList: true, subtree: true });
  try { const saved = localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale"); if (!routedLocale && saved) state.locale = normalizeLocale(saved); } catch (error) { state.storage = false; }
  window.setTimeout(() => { $("loadingPanel").hidden = true; screens.main.hidden = false; applyLocale(); track("main_ready"); }, 420);
}());
