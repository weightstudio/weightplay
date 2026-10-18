/* Flip Foundry: visible aim, deterministic ballistic contact, four landings per chapter. */
(() => {
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null) === "battle" && (__wpMeasurement.ended)) ? null : (({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(state?.paused || state?.suspended), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const $ = (id) => document.getElementById(id);
  const canvas = $("arena");
  $("stage-list").dataset.wpStageRecommendation = "first";
  const arenaFrame = document.querySelector(".arena-frame");
  const ctx = canvas.getContext("2d");
  const loadingPanel = $("loadingPanel");
  const canisterArt = new Image(); canisterArt.src = "assets/animal-flip-foundry-original-assets-v1.png";
  const propArt = new Image(); propArt.src = "assets/animal-flip-foundry-props.png";
  const landingArt = propArt;
  const sceneryArt = new Image(); sceneryArt.src = 'assets/animal-flip-foundry-background.png';
  const localeCopy = {
    en: { preparing: "Preparing the foundry…", stageTitle: "Foundry Chapters", chapter: "Chapter", platforms: "4 platforms", wideStarts: "wide starts", precisionFinish: "precision finish", newSpacing: "new spacing", backMain: "Back to Main", backStages: "Back to Stages", stageSections: "Stage sections", stages: "Stages", surface: "Chapter {chapter} · Platform {platform} / 4", ready: "Swipe upward from the canister.", rotation: "Watch the rotation…", miss: "Too soft or too wild…", perfect: "Perfect landing — next platform ready.", canvas: "Flip Foundry play area", hint: "Swipe up. Shorter swipes stay low; longer swipes climb farther.", bestStreak: "Best streak", streak: "STREAK", best: "BEST", routeClear: "Foundry route clear", chapterClear: "Chapter clear", failed: "Landing failed", resultCopy: "Chapter {chapter} · Platform {platform} · Streak {streak} · Best {best}", stagesAction: "Stages", nextSurface: "Next Surface", retry: "Retry", nextChapter: "Next Chapter", replayFoundry: "Replay Foundry", retryPlatform: "Retry Platform" },
    "zh-Hant": { preparing: "正在準備工坊……", stageTitle: "工坊章節", chapter: "第", platforms: "4 個平台", wideStarts: "寬闊起步", precisionFinish: "精準收尾", newSpacing: "新的間距", backMain: "返回主頁", backStages: "返回章節", stageSections: "章節區域", stages: "章節", surface: "第 {chapter} 章 · 平台 {platform} / 4", ready: "向上滑動晶體罐。", rotation: "觀察旋轉……", miss: "力道太弱或方向太偏……", perfect: "完美落地——下一個平台準備好了。", canvas: "翻轉工坊遊戲區", hint: "向上滑動。短滑動會保持低位；長滑動會飛得更遠。", bestStreak: "最佳連勝", streak: "連勝", best: "最佳", routeClear: "工坊路線完成", chapterClear: "章節完成", failed: "落地失敗", resultCopy: "第 {chapter} 章 · 平台 {platform} · 連勝 {streak} · 最佳 {best}", stagesAction: "章節", nextSurface: "下一個平台", retry: "重試", nextChapter: "下一章", replayFoundry: "重玩翻轉工坊", retryPlatform: "重試平台" },
    "zh-Hans": { preparing: "正在准备工坊……", stageTitle: "工坊章节", chapter: "第", platforms: "4 个平台", wideStarts: "宽阔起步", precisionFinish: "精准收尾", newSpacing: "新的间距", backMain: "返回主页", backStages: "返回章节", stageSections: "章节区域", stages: "章节", surface: "第 {chapter} 章 · 平台 {platform} / 4", ready: "向上滑动晶体罐。", rotation: "观察旋转……", miss: "力度太弱或方向太偏……", perfect: "完美落地——下一个平台准备好了。", canvas: "翻转工坊游戏区", hint: "向上滑动。短滑动会保持低位；长滑动会飞得更远。", bestStreak: "最佳连胜", streak: "连胜", best: "最佳", routeClear: "工坊路线完成", chapterClear: "章节完成", failed: "落地失败", resultCopy: "第 {chapter} 章 · 平台 {platform} · 连胜 {streak} · 最佳 {best}", stagesAction: "章节", nextSurface: "下一个平台", retry: "重试", nextChapter: "下一章", replayFoundry: "重玩翻转工坊", retryPlatform: "重试平台" },
    ja: { preparing: "工房を準備中…", stageTitle: "工房チャプター", chapter: "チャプター", platforms: "4つの足場", wideStarts: "広いスタート", precisionFinish: "精密なゴール", newSpacing: "新しい間隔", backMain: "メインへ戻る", backStages: "チャプターへ戻る", stageSections: "チャプターの区画", stages: "チャプター", surface: "チャプター {chapter} · 足場 {platform} / 4", ready: "クリスタル容器を上へスワイプ。", rotation: "回転を見てください…", miss: "力が弱すぎるか、方向が大きく外れました…", perfect: "完璧な着地です。次の足場の準備完了。", canvas: "フリップ工房のプレイエリア", hint: "上へスワイプ。短いスワイプは低く、長いスワイプはより遠くへ飛びます。", bestStreak: "最高連続記録", streak: "連続", best: "最高", routeClear: "工房ルートクリア", chapterClear: "チャプタークリア", failed: "着地失敗", resultCopy: "チャプター {chapter} · 足場 {platform} · 連続 {streak} · 最高 {best}", stagesAction: "チャプター", nextSurface: "次の足場", retry: "再挑戦", nextChapter: "次のチャプター", replayFoundry: "フリップ工房を再プレイ", retryPlatform: "足場を再挑戦" },
    ko: { preparing: "공방을 준비하는 중…", stageTitle: "공방 챕터", chapter: "챕터", platforms: "플랫폼 4개", wideStarts: "넓은 시작", precisionFinish: "정밀한 마무리", newSpacing: "새 간격", backMain: "메인으로 돌아가기", backStages: "챕터로 돌아가기", stageSections: "챕터 구역", stages: "챕터", surface: "챕터 {chapter} · 플랫폼 {platform} / 4", ready: "크리스털 용기를 위로 스와이프하세요.", rotation: "회전을 지켜보세요…", miss: "힘이 너무 약하거나 방향이 크게 빗나갔습니다…", perfect: "완벽한 착지입니다. 다음 플랫폼이 준비되었습니다.", canvas: "플립 공방 플레이 영역", hint: "위로 스와이프하세요. 짧게 하면 낮게, 길게 하면 더 멀리 날아갑니다.", bestStreak: "최고 연속 기록", streak: "연속", best: "최고", routeClear: "공방 경로 클리어", chapterClear: "챕터 클리어", failed: "착지 실패", resultCopy: "챕터 {chapter} · 플랫폼 {platform} · 연속 {streak} · 최고 {best}", stagesAction: "챕터", nextSurface: "다음 플랫폼", retry: "다시 시도", nextChapter: "다음 챕터", replayFoundry: "플립 공방 다시 하기", retryPlatform: "플랫폼 다시 시도" },
    es: { preparing: "Preparando el taller…", stageTitle: "Capítulos del taller", chapter: "Capítulo", platforms: "4 plataformas", wideStarts: "inicio amplio", precisionFinish: "final de precisión", newSpacing: "nuevo espacio", backMain: "Volver al inicio", backStages: "Volver a capítulos", stageSections: "Secciones de capítulos", stages: "Capítulos", surface: "Capítulo {chapter} · Plataforma {platform} / 4", ready: "Desliza hacia arriba el recipiente.", rotation: "Observa la rotación…", miss: "Demasiado suave o demasiado desviado…", perfect: "Aterrizaje perfecto: la siguiente plataforma está lista.", canvas: "Zona de juego del taller de giros", hint: "Desliza hacia arriba. Los gestos cortos se quedan bajos; los largos llegan más lejos.", bestStreak: "Mejor racha", streak: "RACHA", best: "MEJOR", routeClear: "Ruta del taller completada", chapterClear: "Capítulo completado", failed: "Aterrizaje fallido", resultCopy: "Capítulo {chapter} · Plataforma {platform} · Racha {streak} · Mejor {best}", stagesAction: "Capítulos", nextSurface: "Siguiente plataforma", retry: "Reintentar", nextChapter: "Siguiente capítulo", replayFoundry: "Repetir Taller de giros", retryPlatform: "Reintentar plataforma" },
    "pt-BR": { preparing: "Preparando a oficina…", stageTitle: "Capítulos da oficina", chapter: "Capítulo", platforms: "4 plataformas", wideStarts: "início amplo", precisionFinish: "final de precisão", newSpacing: "novo espaçamento", backMain: "Voltar ao início", backStages: "Voltar aos capítulos", stageSections: "Seções de capítulos", stages: "Capítulos", surface: "Capítulo {chapter} · Plataforma {platform} / 4", ready: "Deslize o recipiente para cima.", rotation: "Observe a rotação…", miss: "Fraco demais ou fora da direção…", perfect: "Pouso perfeito — a próxima plataforma está pronta.", canvas: "Área de jogo da Oficina do Giro", hint: "Deslize para cima. Gestos curtos ficam baixos; gestos longos alcançam mais longe.", bestStreak: "Melhor sequência", streak: "SEQUÊNCIA", best: "MELHOR", routeClear: "Rota da oficina concluída", chapterClear: "Capítulo concluído", failed: "Pouso falhou", resultCopy: "Capítulo {chapter} · Plataforma {platform} · Sequência {streak} · Melhor {best}", stagesAction: "Capítulos", nextSurface: "Próxima plataforma", retry: "Tentar de novo", nextChapter: "Próximo capítulo", replayFoundry: "Repetir Oficina do Giro", retryPlatform: "Tentar plataforma de novo" },
    fr: { preparing: "Préparation de l'atelier…", stageTitle: "Chapitres de l'atelier", chapter: "Chapitre", platforms: "4 plateformes", wideStarts: "départ large", precisionFinish: "fin précise", newSpacing: "nouvel espacement", backMain: "Retour à l'accueil", backStages: "Retour aux chapitres", stageSections: "Sections des chapitres", stages: "Chapitres", surface: "Chapitre {chapter} · Plateforme {platform} / 4", ready: "Fais glisser le réservoir vers le haut.", rotation: "Observe la rotation…", miss: "Trop faible ou trop dévié…", perfect: "Atterrissage parfait : la prochaine plateforme est prête.", canvas: "Zone de jeu de l'Atelier du flip", hint: "Glisse vers le haut. Les gestes courts restent bas ; les gestes longs vont plus loin.", bestStreak: "Meilleure série", streak: "SÉRIE", best: "MEILLEUR", routeClear: "Parcours de l'atelier terminé", chapterClear: "Chapitre terminé", failed: "Atterrissage raté", resultCopy: "Chapitre {chapter} · Plateforme {platform} · Série {streak} · Meilleur {best}", stagesAction: "Chapitres", nextSurface: "Plateforme suivante", retry: "Réessayer", nextChapter: "Chapitre suivant", replayFoundry: "Rejouer l'Atelier du flip", retryPlatform: "Réessayer la plateforme" },
    de: { preparing: "Werkstatt wird vorbereitet…", stageTitle: "Werkstatt-Kapitel", chapter: "Kapitel", platforms: "4 Plattformen", wideStarts: "breiter Start", precisionFinish: "präzises Finale", newSpacing: "neuer Abstand", backMain: "Zur Startseite", backStages: "Zu den Kapiteln", stageSections: "Kapitelbereiche", stages: "Kapitel", surface: "Kapitel {chapter} · Plattform {platform} / 4", ready: "Wische den Behälter nach oben.", rotation: "Beobachte die Drehung…", miss: "Zu schwach oder zu weit daneben…", perfect: "Perfekte Landung — die nächste Plattform ist bereit.", canvas: "Spielbereich der Flip-Werkstatt", hint: "Wische nach oben. Kurze Wischer bleiben niedrig, lange Wischer reichen weiter.", bestStreak: "Beste Serie", streak: "SERIE", best: "BESTE", routeClear: "Werkstattroute geschafft", chapterClear: "Kapitel geschafft", failed: "Landung fehlgeschlagen", resultCopy: "Kapitel {chapter} · Plattform {platform} · Serie {streak} · Beste {best}", stagesAction: "Kapitel", nextSurface: "Nächste Plattform", retry: "Erneut versuchen", nextChapter: "Nächstes Kapitel", replayFoundry: "Flip-Werkstatt erneut spielen", retryPlatform: "Plattform erneut versuchen" },
    it: { preparing: "Preparazione dell'officina…", stageTitle: "Capitoli dell'officina", chapter: "Capitolo", platforms: "4 piattaforme", wideStarts: "partenza ampia", precisionFinish: "finale di precisione", newSpacing: "nuova distanza", backMain: "Torna all'inizio", backStages: "Torna ai capitoli", stageSections: "Sezioni dei capitoli", stages: "Capitoli", surface: "Capitolo {chapter} · Piattaforma {platform} / 4", ready: "Scorri verso l'alto sul contenitore.", rotation: "Osserva la rotazione…", miss: "Troppo debole o troppo fuori direzione…", perfect: "Atterraggio perfetto: la piattaforma successiva è pronta.", canvas: "Area di gioco dell'Officina del flip", hint: "Scorri verso l'alto. I gesti brevi restano bassi; quelli lunghi arrivano più lontano.", bestStreak: "Migliore serie", streak: "SERIE", best: "MIGLIORE", routeClear: "Percorso dell'officina completato", chapterClear: "Capitolo completato", failed: "Atterraggio fallito", resultCopy: "Capitolo {chapter} · Piattaforma {platform} · Serie {streak} · Migliore {best}", stagesAction: "Capitoli", nextSurface: "Piattaforma successiva", retry: "Riprova", nextChapter: "Capitolo successivo", replayFoundry: "Rigioca l'Officina del flip", retryPlatform: "Riprova la piattaforma" },
    ru: { preparing: "Мастерская готовится…", stageTitle: "Главы мастерской", chapter: "Глава", platforms: "4 платформы", wideStarts: "широкий старт", precisionFinish: "точная концовка", newSpacing: "новый интервал", backMain: "На главную", backStages: "К главам", stageSections: "Разделы глав", stages: "Главы", surface: "Глава {chapter} · Платформа {platform} / 4", ready: "Проведите по контейнеру вверх.", rotation: "Следите за вращением…", miss: "Слишком слабый бросок или сильный уход в сторону…", perfect: "Идеальная посадка — следующая платформа готова.", canvas: "Игровая зона мастерской переворотов", hint: "Проведите вверх. Короткий жест оставит контейнер ниже, длинный отправит его дальше.", bestStreak: "Лучшая серия", streak: "СЕРИЯ", best: "ЛУЧШИЙ", routeClear: "Маршрут мастерской пройден", chapterClear: "Глава пройдена", failed: "Посадка не удалась", resultCopy: "Глава {chapter} · Платформа {platform} · Серия {streak} · Лучший {best}", stagesAction: "Главы", nextSurface: "Следующая платформа", retry: "Повторить", nextChapter: "Следующая глава", replayFoundry: "Повторить мастерскую переворотов", retryPlatform: "Повторить платформу" },
    hi: { preparing: "कार्यशाला तैयार हो रही है…", stageTitle: "कार्यशाला अध्याय", chapter: "अध्याय", platforms: "4 प्लेटफ़ॉर्म", wideStarts: "खुली शुरुआत", precisionFinish: "सटीक अंत", newSpacing: "नई दूरी", backMain: "मुख्य पृष्ठ पर लौटें", backStages: "अध्यायों पर लौटें", stageSections: "अध्याय अनुभाग", stages: "अध्याय", surface: "अध्याय {chapter} · प्लेटफ़ॉर्म {platform} / 4", ready: "कंटेनर पर ऊपर की ओर स्वाइप करें।", rotation: "घुमाव देखें…", miss: "बहुत हल्का या दिशा बहुत भटकी हुई…", perfect: "बेहतरीन लैंडिंग — अगला प्लेटफ़ॉर्म तैयार है।", canvas: "फ्लिप कार्यशाला का खेल क्षेत्र", hint: "ऊपर स्वाइप करें। छोटे स्वाइप नीचे रखते हैं; लंबे स्वाइप दूर ले जाते हैं।", bestStreak: "सर्वश्रेष्ठ सिलसिला", streak: "सिलसिला", best: "सर्वश्रेष्ठ", routeClear: "कार्यशाला मार्ग पूरा", chapterClear: "अध्याय पूरा", failed: "लैंडिंग विफल", resultCopy: "अध्याय {chapter} · प्लेटफ़ॉर्म {platform} · सिलसिला {streak} · सर्वश्रेष्ठ {best}", stagesAction: "अध्याय", nextSurface: "अगला प्लेटफ़ॉर्म", retry: "फिर कोशिश करें", nextChapter: "अगला अध्याय", replayFoundry: "फ्लिप कार्यशाला फिर खेलें", retryPlatform: "प्लेटफ़ॉर्म फिर आज़माएँ" },
    ar: { preparing: "جارٍ تجهيز الورشة…", stageTitle: "فصول الورشة", chapter: "الفصل", platforms: "4 منصات", wideStarts: "بداية واسعة", precisionFinish: "نهاية دقيقة", newSpacing: "تباعد جديد", backMain: "العودة إلى الرئيسية", backStages: "العودة إلى الفصول", stageSections: "أقسام الفصول", stages: "الفصول", surface: "الفصل {chapter} · المنصة {platform} / 4", ready: "مرّر إلى الأعلى على الحاوية البلورية.", rotation: "راقب الدوران…", miss: "القوة ضعيفة أو المسار منحرف جداً…", perfect: "هبوط مثالي — المنصة التالية جاهزة.", canvas: "منطقة لعب ورشة القلب", hint: "مرّر إلى الأعلى. التمريرات القصيرة تبقي الحاوية منخفضة؛ والطويلة تجعلها تصعد أبعد.", bestStreak: "أفضل تتابع", streak: "التتابع", best: "الأفضل", routeClear: "اكتمل مسار الورشة", chapterClear: "اكتمل الفصل", failed: "فشل الهبوط", resultCopy: "الفصل {chapter} · المنصة {platform} · التتابع {streak} · الأفضل {best}", stagesAction: "الفصول", nextSurface: "المنصة التالية", retry: "إعادة المحاولة", nextChapter: "الفصل التالي", replayFoundry: "إعادة لعب ورشة القلب", retryPlatform: "إعادة محاولة المنصة" },
  };
  const state = { screen: "main", chapter: 1, platform: 1, streak: 0, best: (()=>{try{return Math.max(0,Number(localStorage.getItem("wp-flip-best"))||0)}catch{return 0}})(), drag: null, flight: null, raf: 0, status: "ready", resultWin: null, cardsLocale: "" };
  const currentLocale = () => localeCopy[window.WeightPlayFiveGameLocale?.locale] ? window.WeightPlayFiveGameLocale.locale : (localeCopy[document.documentElement.lang] ? document.documentElement.lang : "en");
  const copy = () => localeCopy[currentLocale()] || localeCopy.en;
  const fill = (value, values) => value.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
  const label = (key, values = {}) => fill(copy()[key] || localeCopy.en[key] || key, values);
  const fitArena = () => {
    if (!arenaFrame || !canvas) return;
    const width = Math.max(1, arenaFrame.clientWidth);
    const height = Math.max(1, arenaFrame.clientHeight);
    const previousHeight = canvas.height;
    const scale = Math.min(width / 960, height / 400);
    canvas.width = Math.max(960, Math.round(width / scale));
    canvas.height = Math.max(400, Math.round(height / scale));
    if (state.flight && canvas.height !== previousHeight) {
      const shift = canvas.height - previousHeight;
      state.flight.y += shift;
      state.flight.trail.forEach(point => { point.y += shift; });
    }
    canvas.style.width = `${Math.max(1, Math.floor(canvas.width * scale))}px`;
    canvas.style.height = `${Math.max(1, Math.floor(canvas.height * scale))}px`;
    drawScene();
  };
  const scheduleArenaFit = () => requestAnimationFrame(() => requestAnimationFrame(fitArena));
  const arenaObserver = arenaFrame && typeof ResizeObserver === "function" ? new ResizeObserver(fitArena) : null;
  arenaObserver?.observe(arenaFrame);
  window.addEventListener("resize", scheduleArenaFit, { passive: true });
  if (loadingPanel) { const hideLoading = () => { loadingPanel.hidden = true; loadingPanel.classList.add("hidden"); }; if (document.readyState === "complete") hideLoading(); else window.addEventListener("load", hideLoading, { once: true }); }
  function show(name) { state.drag = null; state.charge = null; state.lastFrame = 0; audio?.stop(); state.screen = name; document.body.dataset.screen = name === "result" ? "battle" : name; cancelAnimationFrame(state.raf); const result = $("result-screen"); document.querySelectorAll(".screen").forEach((el) => { const isResult = el === result && name === "result"; const keepBattle = name === "result" && el.id === "battle-screen"; const on = isResult || keepBattle || el.dataset.screen === name; el.hidden = !on; el.classList.toggle("active", on); }); if (name === "battle") (__wpNotifyMeasurement(), result?.setAttribute("hidden", "")); if (name === "battle" || name === "result") scheduleArenaFit(); if (name === "battle") state.raf = requestAnimationFrame(frame);
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  function syncStageCardVisibility() { const rail = $("stage-list"); if (!rail || state.screen !== "stage") return; const railRect = rail.getBoundingClientRect(); rail.querySelectorAll(".stage-card").forEach((card) => { const rect = card.getBoundingClientRect(); const center = rect.left + rect.width / 2; const insideRail = rect.width > 1 && rect.height > 1 && center >= railRect.left - 1 && center <= railRect.right + 1 && rect.bottom >= railRect.top - 1 && rect.top <= railRect.bottom + 1; card.classList.toggle("wp-stage-card-clipped", !insideRail); }); }
  function cards() { const c = copy(); const rail = $("stage-list"); rail.innerHTML = [1, 2, 3, 4, 5, 6].map((n) => { const summary = n === 1 ? c.wideStarts : n === 6 ? c.precisionFinish : c.newSpacing; return `<button class="stage-card" data-wp-enter-battle data-wp-stage-card data-chapter="${n}" aria-disabled="false" aria-label="${c.chapter} ${n}">${c.chapter} ${n}<br><small>${c.platforms} · ${summary}</small></button>`; }).join(""); rail.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => start(Number(button.dataset.chapter), 1))); if (rail.dataset.wpStageVisibilityBound !== "true") { rail.addEventListener("scroll", syncStageCardVisibility, { passive: true }); window.addEventListener("resize", syncStageCardVisibility, { passive: true }); rail.dataset.wpStageVisibilityBound = "true"; } state.cardsLocale = currentLocale(); syncStageCardVisibility(); window.requestAnimationFrame(() => window.requestAnimationFrame(syncStageCardVisibility)); }
  const audio = window.WeightPlayAudio?.createScope();
  window.WeightPlayAudio?.preload(['projectile.launch','movement.land','result.lose','result.win'])?.catch(()=>{});
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const courses = [
    {gap:[300,340,320,370],rise:[0,25,0,35],width:190,wind:0,color:'#7cebc5'},
    {gap:[350,390,330,420],rise:[30,60,15,55],width:166,wind:0,color:'#ffcb78'},
    {gap:[400,350,440,390],rise:[65,90,45,100],width:148,wind:0,color:'#9bc8ff'},
    {gap:[380,440,400,460],rise:[30,55,80,40],width:140,wind:.018,color:'#c7b0ff'},
    {gap:[420,360,450,400],rise:[75,35,90,55],width:112,wind:0,color:'#ffb0b9'},
    {gap:[440,400,480,450],rise:[65,110,45,95],width:120,wind:-.018,color:'#ffe18f'}
  ];
  // Source fence limits this owner task to game-owned files; formal spec/version
  // assembly and independent acceptance follow the terminal maintenance receipt.
  const clarity = {
    en:['FLIP • LAND • BUILD','Drag UP anywhere. Follow the dotted arc, then release on the glowing platform.','START','LAND HERE','Drag up to aim','Release to flip','Too short — drag farther up.','Too far — use a shorter drag.','On target — release!','Four landings complete the chapter.','Hold Space, release to flip.','Clean landing!','Route progress','Drag farther to reach the platform.','Ease back: your arc passes the platform.'],
    'zh-Hant':['翻轉 · 落地 · 完工','按住畫面向上拖，讓虛線落在發光平台，再放手翻轉。','起點','落在這裡','向上拖曳，預覽落點','放手翻轉','差一點！下次向上拖長一些。','飛過頭了！下次縮短拖曳。','落點正確，現在放手！','落穩 4 次，完成這一章。','按住空白鍵蓄力，放開翻轉。','漂亮落地！','工坊進度','再向上拖長一些，就能到達平台。','稍微往回收，落點已超過平台。'],
    'zh-Hans':['翻转 · 落地 · 完工','按住画面向上拖，让虚线落在发光平台，再松手翻转。','起点','落在这里','向上拖动，预览落点','松手翻转','差一点！下次向上拖长一些。','飞过头了！下次缩短拖动。','落点正确，现在松手！','落稳4次，完成这一章。','按住空格键蓄力，松开翻转。','漂亮落地！','工坊进度','再向上拖长一些，就能到达平台。','稍微往回收，落点已超过平台。'],
    ja:['フリップ・着地・完成','上にドラッグし、点線を光る足場に合わせて離そう。','出発','着地点','上にドラッグして狙う','離してフリップ','届かなかった。もっと長くドラッグ。','飛びすぎ。短くドラッグ。','狙いは正確！離そう。','4回着地してチャプターを完成。','スペースを長押しして離す。','見事な着地！','進行状況'],
    ko:['뒤집고 · 착지하고 · 완성','위로 드래그해 점선을 빛나는 발판에 맞추고 놓으세요.','출발','착지 지점','위로 드래그해 조준','놓아서 뒤집기','짧아요. 더 길게 드래그하세요.','너무 멀어요. 짧게 드래그하세요.','정확해요. 놓으세요!','4번 착지하면 챕터 완성.','스페이스를 누르고 놓으세요.','멋진 착지!','진행'],
    es:['GIRA · ATERRIZA · CONSTRUYE','Arrastra arriba. Apunta el arco a la plataforma iluminada y suelta.','SALIDA','ATERRIZA AQUÍ','Arrastra arriba para apuntar','Suelta para girar','Muy corto: arrastra más.','Muy lejos: arrastra menos.','¡En el blanco! Suelta.','Cuatro aterrizajes completan el capítulo.','Mantén Espacio y suelta.','¡Buen aterrizaje!','Progreso'],
    'pt-BR':['GIRE · POUSE · CONSTRUA','Arraste para cima. Mire o arco na plataforma iluminada e solte.','INÍCIO','POUSE AQUI','Arraste para cima para mirar','Solte para girar','Curto demais: arraste mais.','Longe demais: arraste menos.','No alvo! Solte.','Quatro pousos completam o capítulo.','Segure Espaço e solte.','Belo pouso!','Progresso'],
    fr:['TOURNE · ATTERRIS · CONSTRUIS','Glisse vers le haut. Vise la plateforme lumineuse avec l’arc et relâche.','DÉPART','ATTERRIS ICI','Glisse vers le haut pour viser','Relâche pour tourner','Trop court : glisse plus loin.','Trop loin : raccourcis le geste.','Bien visé ! Relâche.','Quatre atterrissages terminent le chapitre.','Maintiens Espace et relâche.','Bel atterrissage !','Progression'],
    de:['DREHEN · LANDEN · BAUEN','Ziehe nach oben. Richte den Bogen auf die leuchtende Plattform und lasse los.','START','HIER LANDEN','Zum Zielen nach oben ziehen','Zum Drehen loslassen','Zu kurz: weiter ziehen.','Zu weit: kürzer ziehen.','Im Ziel! Loslassen.','Vier Landungen beenden das Kapitel.','Leertaste halten und loslassen.','Saubere Landung!','Fortschritt'],
    it:['GIRA · ATTERRA · COSTRUISCI','Trascina in alto. Punta l’arco sulla piattaforma luminosa e rilascia.','PARTENZA','ATTERRA QUI','Trascina in alto per mirare','Rilascia per girare','Troppo corto: trascina di più.','Troppo lontano: trascina meno.','Sul bersaglio! Rilascia.','Quattro atterraggi completano il capitolo.','Tieni Spazio e rilascia.','Ottimo atterraggio!','Progresso'],
    ru:['ПЕРЕВОРОТ · ПОСАДКА · СБОРКА','Тяните вверх. Наведите дугу на светящуюся платформу и отпустите.','СТАРТ','СЮДА','Тяните вверх для прицеливания','Отпустите для броска','Недолёт: тяните дальше.','Перелёт: тяните меньше.','Точно! Отпустите.','Четыре посадки завершают главу.','Удерживайте Пробел и отпустите.','Отличная посадка!','Прогресс'],
    hi:['पलटें · उतरें · बनाएँ','ऊपर खींचें। चाप को चमकते प्लेटफ़ॉर्म पर रखें और छोड़ें।','शुरू','यहाँ उतरें','निशाना लगाने के लिए ऊपर खींचें','पलटने के लिए छोड़ें','कम दूरी: और ऊपर खींचें।','बहुत दूर: कम खींचें।','सही निशाना! छोड़ें।','चार लैंडिंग से अध्याय पूरा होता है।','स्पेस दबाकर छोड़ें।','शानदार लैंडिंग!','प्रगति'],
    ar:['اقلب · اهبط · ابنِ','اسحب للأعلى. وجّه القوس إلى المنصة المضيئة ثم أفلت.','البداية','اهبط هنا','اسحب للأعلى للتصويب','أفلت للقلب','قصير جداً: اسحب أكثر.','بعيد جداً: اسحب أقل.','على الهدف! أفلت.','أربع هبوطات تكمل الفصل.','اضغط المسافة ثم أفلت.','هبوط رائع!','التقدم']
  };
  const tip = n => (clarity[currentLocale()] || clarity.en)[n] || (clarity[currentLocale()] || clarity.en)[n === 13 ? 6 : n === 14 ? 7 : n];
  function updateGuide() {
    const guide = document.querySelector('.game-page-info-static');
    if (!guide) return;
    const replace = (selector, value) => { const node=guide.querySelector(selector); if(node && node.textContent!==value)node.textContent=value; };
    replace('.game-info-title > p',tip(1));
    replace('.game-info-story p:nth-of-type(2)',tip(9));
    replace('.game-info-systems li:first-child',tip(1));
    replace('ol li:nth-child(2)',tip(4));
    replace('ol li:nth-child(3)',tip(1));
    replace('.game-info-strategy li:nth-child(1)',tip(1));
    replace('.game-info-strategy li:nth-child(2)',tip(13));
    replace('.game-info-strategy li:nth-child(3)',tip(14));
    replace('dl > div:nth-child(1) dd',tip(1));
    replace('dl > div:nth-child(2) dd',tip(1));
    replace('dl > div:nth-child(6) dd',tip(13)+' '+tip(14));
  }
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const save = (key,value) => { try { localStorage.setItem(key,String(value)); } catch {} };
  function config() {
    const course=courses[state.chapter-1], i=state.platform-1;
    return {...course, x:190, y:canvas.height-135, targetX:190+course.gap[i], targetY:canvas.height-135-course.rise[i]};
  }
  function shot(force) { return {vx:2.7+force*.026,vy:-3.8-force*.024}; }
  function trajectory(force) {
    const c=config(), v=shot(force), points=[];
    let x=c.x,y=c.y-36,vx=v.vx,vy=v.vy;
    for(let t=0;t<180;t++){
      const oldY=y, oldX=x; x+=vx; y+=vy; vx+=c.wind; vy+=.24;
      if(t%4===0) points.push({x,y});
      if(vy>0 && oldY<=c.targetY-36 && y>=c.targetY-36){
        const ratio=(c.targetY-36-oldY)/(y-oldY), landingX=oldX+(x-oldX)*ratio;
        return {points,x:landingX,y:c.targetY-36,t:t+ratio,hit:Math.abs(landingX-c.targetX)<=c.width/2-22};
      }
    }
    return {points,x,y,t:180,hit:false};
  }
  function setStatus(text){ const el=$('battle-status'); if(el.textContent!==text) el.textContent=text; }
  function forceNow(){ return state.charge!==null && state.charge!==undefined ? clamp((performance.now()-state.charge)*.16,0,300) : state.drag?.force || 0; }
  function renderResult() { if (state.resultWin === null) return; const c = copy(); const nextAvailable = state.resultWin && state.chapter < 6; $("result-title").textContent = state.resultWin ? (state.chapter === 6 ? c.routeClear : c.chapterClear) : c.failed; $("result-copy").textContent = (state.resultWin ? tip(9) : state.missReason || tip(6)) + " · " + label("resultCopy", { chapter: state.chapter, platform: state.platform, streak: state.streak, best: state.best }); $("to-stages").textContent = c.stagesAction; $("retry").textContent = c.retry; $("next").textContent = c.nextChapter; $("next").disabled = !nextAvailable; $("next").setAttribute("aria-disabled", String(!nextAvailable)); }
  function renderLocalized() { const c = copy(); const mainTitle = document.querySelector(".main-title")?.textContent || "Flip Foundry"; document.querySelector(".main-summary")?.removeAttribute("data-five-copy"); $("loadingPanel")?.querySelector("strong")?.replaceChildren(document.createTextNode(mainTitle)); $("loadingPanel")?.querySelector("span")?.replaceChildren(document.createTextNode(c.preparing)); document.querySelector("#stage-screen h2").textContent = c.stageTitle; document.querySelector("#stage-screen .back").setAttribute("aria-label", c.backMain); document.querySelector("#stage-screen nav").setAttribute("aria-label", c.stageSections); document.querySelector("#stage-screen nav button").textContent = c.stages; document.querySelector("#battle-screen .back").setAttribute("aria-label", c.backStages); $("reset-surface").textContent = "↻"; $("reset-surface").title = c.retry; $("reset-surface").setAttribute("aria-label", c.retry); $("arena").setAttribute("aria-label", c.canvas); document.querySelector(".touch-hint").textContent = c.hint; $("main-progress").textContent = `${c.bestStreak}: ${state.best}`; $("surface-label").textContent = label("surface", { chapter: state.chapter, platform: state.platform }); $("streak-label").textContent = String(state.streak); $("battle-status").textContent = state.status === "ready" ? tip(4) : state.status === "perfect" ? tip(11) : label(state.status); document.querySelector(".touch-hint").textContent=tip(1); document.querySelector(".main-summary").textContent=tip(1); canvas.setAttribute("aria-label", `${c.canvas}. ${tip(10)}`); if (state.cardsLocale !== currentLocale()) cards(); renderResult(); drawScene(); }
  function start(chapter = 1, platform = 1) { state.chapter = chapter; state.platform = platform; state.streak = 0; state.flight = null; state.settle = null; state.accumulator = 0; state.charge = null; state.status = "ready"; state.resultWin = null; show("battle"); renderLocalized();
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function launch(force) {
    if(state.flight || state.settle || state.screen!=='battle') return;
    if(force<16){setStatus(tip(4));return;}
    const c=config(), v=shot(force), prediction=trajectory(force);
    state.flight={x:c.x,y:c.y-36,vx:v.vx,vy:v.vy,age:0,duration:prediction.t,angle:0,trail:[]};
    state.lastFrame=0;state.status='rotation';state.missReason='';
    setStatus(copy().rotation); audio?.play('projectile.launch');
  }
  function tick(){
    if(state.settle){
      state.settle.t--;
      if(state.settle.t<=0){const win=state.settle.win;state.settle=null;state.flight=null;if(win && state.platform<4){state.platform++;state.status='perfect';renderLocalized();}else finish(win);}
      return;
    }
    const f=state.flight;if(!f)return;
    const c=config(), oldY=f.y, oldX=f.x;
    f.x+=f.vx;f.y+=f.vy;f.vx+=c.wind;f.vy+=.24;f.age++;
    f.angle=Math.min(1,f.age/f.duration)*Math.PI*2;
    f.trail.push({x:f.x,y:f.y}); if(f.trail.length>14)f.trail.shift();
    if(f.vy>0 && oldY<=c.targetY-36 && f.y>=c.targetY-36){
      const ratio=(c.targetY-36-oldY)/(f.y-oldY), x=oldX+(f.x-oldX)*ratio;
      if(Math.abs(x-c.targetX)<=c.width/2-22){f.x=x;f.y=c.targetY-36;f.angle=0;resolveLanding(true);return;}
      state.missReason=x<c.targetX?tip(6):tip(7);
    }
    if(f.y>canvas.height+60 || f.x>1100) resolveLanding(false);
  }
  function frame(now){
    if(state.screen!=='battle')return;
    if(!document.hidden){
      const elapsed=state.lastFrame?Math.min(50,now-state.lastFrame):16.667;
      state.accumulator=(state.accumulator||0)+elapsed;
      while(state.accumulator>=16.667){tick();state.accumulator-=16.667;}
      drawScene();
    }
    state.lastFrame=now;
    if(state.screen==='battle')state.raf=requestAnimationFrame(frame);
  }
  function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
  function text(value,x,y,size=24,color='#ecf6ff',align='left'){
    ctx.save();ctx.fillStyle=color;ctx.font=`700 ${size}px system-ui`;ctx.textAlign=align;ctx.direction=currentLocale()==='ar'?'rtl':'ltr';ctx.fillText(value,x,y);ctx.restore();
  }
  function drawScene(){
    const c=config(), h=canvas.height, f=state.flight;
    const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#102b42');bg.addColorStop(1,'#081925');ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,h);
    if(sceneryArt.complete && sceneryArt.naturalWidth){
      const scale=Math.max(canvas.width/sceneryArt.naturalWidth,h/sceneryArt.naturalHeight);
      ctx.globalAlpha=.22;
      ctx.drawImage(sceneryArt,(canvas.width-sceneryArt.naturalWidth*scale)/2,(h-sceneryArt.naturalHeight*scale)/2,sceneryArt.naturalWidth*scale,sceneryArt.naturalHeight*scale);
      ctx.globalAlpha=1;
    }
    ctx.save();ctx.translate((canvas.width-960)/2,0);
    // Quiet industrial architecture: the play pieces carry the highest contrast.
    for(let i=0;i<8;i++){rect(i*150-30,0,3,h,'#a6d6da0b');rect(i*150,80,85,130,'#87e5dc07');}
    rect(0,h-80,960,80,'#123c49');rect(0,h-80,960,3,'#335d68');
    text(tip(0),48,62,25,'#99c0ce');
    for(let i=0;i<4;i++){const x=690+i*58;rect(x,36,40,12,i<state.platform-1?'#7cebc5':i===state.platform-1?'#ffca78':'#365563');text(String(i+1),x+20,78,19,'#aacbd6','center');}
    if(h>850){text(tip(4),480,Math.min(290,h*.23),38,'#f2f6ee','center');text(tip(9),480,Math.min(350,h*.27),25,'#9cbcc8','center');}
    // Fixed starting pedestal and a single unmistakable collision target.
    rect(c.x-78,c.y,156,h-c.y-80,'#284e60');rect(c.x-85,c.y,170,13,'#90b9c4');
    rect(c.targetX-c.width/2,c.targetY,c.width,h-c.targetY-80,'#2f6670');
    rect(c.targetX-c.width/2,c.targetY,c.width,15,c.color);
    for(let x=c.targetX-c.width/2+10;x<c.targetX+c.width/2;x+=30)rect(x,c.targetY+32,14,6,'#8cdcc733');
    text(tip(2),c.x,c.y+52,23,'#b5d2dd','center');text(tip(3),c.targetX,c.targetY-70,25,c.color,'center');
    if(c.wind){text(c.wind>0?'→ → →':'← ← ←',810,150,26,c.color,'center');}
    const force=forceNow();
    if(!f && !state.settle){
      const aiming=!!state.drag || state.charge!=null, preview=trajectory(aiming?force:150);
      ctx.save();ctx.setLineDash(aiming?[]:[5,10]);ctx.strokeStyle=aiming?(preview.hit?'#7cebc5':'#ffca78'):'#87b8c04d';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(c.x,c.y-36);preview.points.forEach(p=>ctx.lineTo(p.x,p.y));ctx.stroke();ctx.restore();
      if(aiming){
        ctx.strokeStyle=preview.hit?'#7cebc5':'#ffca78';ctx.lineWidth=4;ctx.strokeRect(preview.x-28,preview.y-34,56,68);
        setStatus(preview.hit?tip(8):preview.x<c.targetX?tip(13):tip(14));
      }
      drawCanister(c.x,c.y-36,0,1);
      // Upward hand cue and live power track give the first gesture a visible origin.
      if(!aiming){text('↑',c.x,c.y-115,64,'#ffca78','center');}
      const meterY=h-48;rect(48,meterY,864,9,'#365462');rect(48,meterY,864*force/300,9,preview.hit?'#7cebc5':'#ffca78');
      if(aiming)text(tip(5),480,h-72,23,'#f3f8ed','center');
    }else if(f){
      if(!reducedMotion.matches)f.trail.forEach((p,i)=>{ctx.globalAlpha=i/f.trail.length*.35;rect(p.x-4,p.y-4,8,8,c.color);});ctx.globalAlpha=1;
      drawCanister(f.x,f.y,f.angle,1);
    }
    if(state.settle){
      const fx=state.settle,progress=1-fx.t/36,travel=reducedMotion.matches?0:progress;
      if(fx.win){ctx.strokeStyle=c.color;ctx.globalAlpha=1-progress;ctx.lineWidth=5;ctx.strokeRect(fx.x-45-travel*70,c.targetY-10-travel*30,90+travel*140,20+travel*60);ctx.globalAlpha=1;text(tip(11),480,c.targetY-160,36,c.color,'center');}
    }
    ctx.restore();
  }
  function drawCanister(x,y,angle,alpha){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;
    // Original crystal assembly: flat voxel faces stay readable at phone scale.
    rect(-27,-36,54,65,'#87e6dc');rect(-27,-36,12,65,'#39a8ad');rect(15,-36,12,65,'#ccfff0');
    rect(-30,-43,60,12,'#eecb85');rect(-31,25,62,12,'#eecb85');rect(-13,-19,26,29,'#206276');
    rect(-7,-13,14,17,'#b7fff0');ctx.strokeStyle='#143c4c';ctx.lineWidth=3;ctx.strokeRect(-28,-36,56,65);ctx.restore();
  }
  function resolveLanding(win){
    const f=state.flight;if(!f)return;
    if(win){state.streak++;state.best=Math.max(state.best,state.streak);save('wp-flip-best',state.best);audio?.play('movement.land');setStatus(tip(11));}
    else{audio?.play('result.lose');setStatus(state.missReason||tip(6));}
    state.settle={win,t:36,x:f.x}; if(!win)state.flight=null;
  }
  function finish(win){state.resultWin=win;state.status=win?'perfect':'miss';renderLocalized();show('result');
    if(win)audio?.play('result.win');
    __wpMeasurement.ended=true;__wpMeasurement.outcome=win?'win':'lose';__wpMeasurement.screen=null;__wpNotifyMeasurement();
  }
  function pos(event) { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height }; }
  canvas.tabIndex=0;
  canvas.setAttribute('role','application');
  canvas.addEventListener('pointerdown',event=>{
    if(state.screen!=='battle'||state.flight||state.settle||state.drag||state.charge!=null||event.button>0)return;
    canvas.focus({preventScroll:true});canvas.setPointerCapture(event.pointerId);
    state.drag={...pos(event),id:event.pointerId,force:0};setStatus(tip(4));
  });
  canvas.addEventListener('pointermove',event=>{if(state.drag?.id!==event.pointerId)return;state.drag.force=clamp(state.drag.y-pos(event).y,0,300);});
  canvas.addEventListener('pointerup',event=>{
    if(state.drag?.id!==event.pointerId)return;
    const force=clamp(state.drag.y-pos(event).y,0,300);state.drag=null;launch(force);
  });
  ['pointercancel','lostpointercapture'].forEach(name=>canvas.addEventListener(name,()=>{state.drag=null;}));
  canvas.addEventListener('keydown',event=>{if(event.code!=='Space'||state.screen!=='battle')return;event.preventDefault();if(!event.repeat&&!state.flight&&!state.settle&&!state.drag)state.charge=performance.now();});
  canvas.addEventListener('keyup',event=>{if(event.code!=='Space'||state.charge==null)return;event.preventDefault();const force=forceNow();state.charge=null;launch(force);});
  canvas.addEventListener('blur',()=>{state.charge=null;state.drag=null;});
  document.addEventListener('visibilitychange',()=>{state.drag=null;state.charge=null;state.lastFrame=0;state.accumulator=0;});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(state.raf);audio?.dispose();arenaObserver?.disconnect();});
  $("start-game").addEventListener("click", () => { show("stage"); renderLocalized(); });
  document.querySelectorAll("[data-back]").forEach((button) => button.addEventListener("click", () => { show(button.dataset.back); renderLocalized(); }));
  $("reset-surface").addEventListener("click", () => __wpReplayStart(() => start(state.chapter, state.platform)));
  $("retry").addEventListener("click", () => __wpReplayStart(() => start(state.chapter, state.platform)));
  $("next").addEventListener("click", () => { if (!state.resultWin || state.chapter >= 6) return; if (state.platform < 4) start(state.chapter, state.platform); else start(state.chapter + 1, 1); });
  $("to-stages").addEventListener("click", () => { show("stage"); renderLocalized(); });
  const bindLocale = () => { renderLocalized(); updateGuide(); $("localeSelect")?.addEventListener("change", () => setTimeout(()=>{renderLocalized();updateGuide();}, 0)); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindLocale, { once: true }); else bindLocale();
  cards();
  renderLocalized();
  window.addEventListener("load",()=>{renderLocalized();updateGuide();},{once:true});
})();
