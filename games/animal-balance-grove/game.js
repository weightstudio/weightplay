(function () {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(state?.paused || state?.suspended), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const copy = window.BALANCE_LOCALES || {};
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const guideInfoCopy = {
    en: { kicker: "WeightPlay Original Game Guide", gameplay: "Gameplay", gameplayValue: "Balance Subset Puzzle", genre: "Genre", genreValue: "Puzzle · Balance · Logic · Family · Animal", faq: "FAQ", faqQuestion: "Is progress saved?", faqAnswer: "Yes, only in this browser.", stageHelp: "Grove help", stageSections: "Grove sections", guideAria: "Balance Grove game information" },
    "zh-Hant": { kicker: "WeightPlay 原創遊戲指南", gameplay: "玩法", gameplayValue: "平衡子集合益智", genre: "類型", genreValue: "益智 · 平衡 · 邏輯 · 家庭 · 動物", faq: "常見問題", faqQuestion: "進度會保存嗎？", faqAnswer: "會，只保存在這個瀏覽器中。", stageHelp: "林地說明", stageSections: "林地區段", guideAria: "平衡林地遊戲資訊" },
    "zh-Hans": { kicker: "WeightPlay 原创游戏指南", gameplay: "玩法", gameplayValue: "平衡子集益智", genre: "类型", genreValue: "益智 · 平衡 · 逻辑 · 家庭 · 动物", faq: "常见问题", faqQuestion: "进度会保存吗？", faqAnswer: "是，仅保存在此浏览器中。", stageHelp: "林地说明", stageSections: "林地区段", guideAria: "平衡林地游戏信息" },
    ja: { kicker: "WeightPlay オリジナルゲームガイド", gameplay: "ゲーム内容", gameplayValue: "バランス部分集合パズル", genre: "ジャンル", genreValue: "パズル · バランス · ロジック · ファミリー · 動物", faq: "よくある質問", faqQuestion: "進行状況は保存されますか？", faqAnswer: "はい、このブラウザにのみ保存されます。", stageHelp: "森のヘルプ", stageSections: "森のセクション", guideAria: "バランス・グローブのゲーム情報" },
    ko: { kicker: "WeightPlay 오리지널 게임 가이드", gameplay: "게임플레이", gameplayValue: "균형 부분집합 퍼즐", genre: "장르", genreValue: "퍼즐 · 균형 · 논리 · 가족 · 동물", faq: "자주 묻는 질문", faqQuestion: "진행 상황이 저장되나요?", faqAnswer: "예, 이 브라우저에만 저장됩니다.", stageHelp: "숲 도움말", stageSections: "숲 섹션", guideAria: "밸런스 그로브 게임 정보" },
    es: { kicker: "Guía de juegos originales de WeightPlay", gameplay: "Jugabilidad", gameplayValue: "Puzle de equilibrio por subconjuntos", genre: "Género", genreValue: "Puzle · Equilibrio · Lógica · Familiar · Animales", faq: "Preguntas frecuentes", faqQuestion: "¿Se guarda el progreso?", faqAnswer: "Sí, solo en este navegador.", stageHelp: "Ayuda del bosque", stageSections: "Secciones del bosque", guideAria: "Información del juego Arboleda del Equilibrio" },
    "pt-BR": { kicker: "Guia de jogos originais WeightPlay", gameplay: "Jogabilidade", gameplayValue: "Quebra-cabeça de equilíbrio por subconjuntos", genre: "Gênero", genreValue: "Quebra-cabeça · Equilíbrio · Lógica · Família · Animais", faq: "Perguntas frequentes", faqQuestion: "O progresso é salvo?", faqAnswer: "Sim, somente neste navegador.", stageHelp: "Ajuda do bosque", stageSections: "Seções do bosque", guideAria: "Informações do jogo Bosque do Equilíbrio" },
    fr: { kicker: "Guide des jeux originaux WeightPlay", gameplay: "Jeu", gameplayValue: "Puzzle d’équilibre par sous-ensembles", genre: "Genre", genreValue: "Puzzle · Équilibre · Logique · Famille · Animaux", faq: "Questions fréquentes", faqQuestion: "La progression est-elle sauvegardée ?", faqAnswer: "Oui, uniquement dans ce navigateur.", stageHelp: "Aide du bosquet", stageSections: "Sections du bosquet", guideAria: "Informations sur le jeu Bosquet d’Équilibre" },
    de: { kicker: "WeightPlay-Leitfaden für Originalspiele", gameplay: "Spielweise", gameplayValue: "Teilmenge-Balance-Rätsel", genre: "Genre", genreValue: "Rätsel · Balance · Logik · Familie · Tiere", faq: "Häufige Fragen", faqQuestion: "Wird der Fortschritt gespeichert?", faqAnswer: "Ja, nur in diesem Browser.", stageHelp: "Hilfe zum Hain", stageSections: "Hainbereiche", guideAria: "Informationen zum Spiel Balance-Hain" },
    it: { kicker: "Guida ai giochi originali WeightPlay", gameplay: "Gioco", gameplayValue: "Puzzle di equilibrio per sottoinsiemi", genre: "Genere", genreValue: "Puzzle · Equilibrio · Logica · Famiglia · Animali", faq: "Domande frequenti", faqQuestion: "I progressi vengono salvati?", faqAnswer: "Sì, solo in questo browser.", stageHelp: "Aiuto del bosco", stageSections: "Sezioni del bosco", guideAria: "Informazioni sul gioco Bosco dell’Equilibrio" },
    ru: { kicker: "Руководство по оригинальным играм WeightPlay", gameplay: "Геймплей", gameplayValue: "Головоломка на баланс подмножеств", genre: "Жанр", genreValue: "Головоломка · Баланс · Логика · Семейная · Животные", faq: "Частые вопросы", faqQuestion: "Сохраняется ли прогресс?", faqAnswer: "Да, только в этом браузере.", stageHelp: "Справка о лесе", stageSections: "Разделы леса", guideAria: "Информация об игре «Роща равновесия»" },
    hi: { kicker: "WeightPlay मौलिक गेम गाइड", gameplay: "गेमप्ले", gameplayValue: "उपसमुच्चय संतुलन पहेली", genre: "शैली", genreValue: "पहेली · संतुलन · तर्क · परिवार · जानवर", faq: "अक्सर पूछे जाने वाले प्रश्न", faqQuestion: "क्या प्रगति सहेजी जाती है?", faqAnswer: "हाँ, केवल इसी ब्राउज़र में।", stageHelp: "वन सहायता", stageSections: "वन अनुभाग", guideAria: "संतुलन उपवन गेम की जानकारी" },
    ar: {
      kicker: "دليل ألعاب WeightPlay الأصلية", gameplay: "طريقة اللعب", gameplayValue: "لغز توازن المجموعات الجزئية", genre: "النوع", genreValue: "لغز · توازن · منطق · عائلية · حيوانات", difficulty: "من السهل إلى التحدي", time: "2–6 دقائق لكل غابة", faq: "الأسئلة الشائعة", faqQuestion: "هل يُحفظ التقدم؟", faqAnswer: "نعم، في هذا المتصفح فقط.", stageHelp: "مساعدة الغابة", stageSections: "أقسام الغابة", guideAria: "معلومات لعبة بستان التوازن",
      storyTitle: "العالم والرسالة", systemsTitle: "كيف تعمل الأنظمة", howTitle: "طريقة اللعب", strategyTitle: "نصائح استراتيجية", progressionTitle: "تطور المراحل والصعوبة", designTitle: "ملاحظة تصميم المطوّر", parentTitle: "معلومات اللاعب والحفظ",
      story: ["يُصلح تارو ذو الدرع الطحلبي ثلاثة جسور هادئة في بستان الغابة. تعرض كل غابة مجموعة أحجار مصممة بعناية، بأسماء واضحة وهدف محدد. ليست السرعة هي الهدف؛ بل ملاحظة العلاقات ووضع خطة واختيار مجموعة مستقرة تُبقي الجسر متوازنًا.", "تحافظ الحملة القصيرة على القواعد الودودة نفسها مع تغيير الهدف ومجموعة الأحجار والتركيبات المفيدة. تطلب الغابات اللاحقة مقارنة أكثر تعمدًا وتجعل الأحجار الخادعة أكثر إغراءً، ليتعلم اللاعب فحص الصينية كاملة بدل اختيار أول إجابة تبدو مناسبة."],
      systems: ["اختر الأحجار من الصينية لوضعها على الكفة اليمنى، ثم اختر فحص التوازن. تعرض الكفة اليسرى وزن الجسر الثابت، بينما تعرض الكفة اليمنى المجموعة المختارة. يمكن مسح التركيبة الخاطئة بأمان والمحاولة من جديد.", "لا يوجد مؤقت أو حساب أو شراء أو طلب إعلانات. يبقى التقدم وأفضل عدد من الفحوص في هذا المتصفح. يعمل مسار الشاشة الرئيسي والمرحلة والمعركة والنتيجة باللمس والماوس ولوحة المفاتيح."],
      how: ["ابدأ جولة واقرأ الهدف المعروض للغابة الحالية.", "افحص أسماء كل حجر وأوزانه قبل اختيار أي حجر.", "اختر مجموعة يساوي مجموعها هدف الجسر، ثم افحص التوازن.", "امسح الكفة وحاول تركيبة أخرى عندما لا تكون النتيجة مستقرة."],
      strategyTips: ["ابحث عن أزواج يساوي مجموعها الهدف قبل تجربة تركيبات أكبر.", "استخدم الأوزان الظاهرة لاستبعاد الأحجار الأثقل أو الأخف من اللازم.", "أبقِ الصينية المتبقية أمامك؛ فقد يساعد حجر خادع في مجموع جزئي لكنه يمنع المجموعة النهائية.", "اعتبر كل غابة درسًا قصيرًا في تخطيط المجموعات، لا سباقًا مع الساعة."],
      progression: ["تعرّف الغابة الأولى بالميزان والأحجار المسماة ومطابقة الهدف المباشرة. تضيف الغابة الثانية بدائل أكثر إغراءً وتطلب خطة مقارنة أوضح.", "تجمع الغابة الثالثة الاختيارات السابقة في فحص إتقان موجز. كل غابة قابلة لإعادة اللعب، وتساعد المحاولة الهادئة على فهم سبب نجاح المجموعة أو فشلها."],
      designNote: "تستخدم بستان التوازن أهدافًا مصممة وحسابًا ظاهرًا وشاشات رئيسية ومرحلة ومعركة ونتيجة متجاوبة، مع عناصر تحكم مترجمة وتعليقات إعادة محاولة لطيفة. ملاحظات اللغز للعب والتقدم المحلي وليست تقييمًا رسميًا للقدرة.",
      parent: "قد تساعد هذه اللعبة العائلية العامة على ممارسة العد والمقارنة والتخطيط وشرح الاختيار. إنها ملاحظات لعب وليست تقييمًا مدرسيًا أو طبيًا أو للذكاء. يُخزّن التقدم وأفضل الفحوص في هذا المتصفح فقط، ولا يلزم حساب أو شراء.",
      faqItems: [["كيف أثبّت الجسر؟", "اختر أحجارًا يساوي مجموع أوزانها الهدف المعروض، ثم اختر فحص التوازن."], ["هل يمكنني إعادة محاولة إجابة خاطئة؟", "نعم. يمكن مسح التركيبة الخاطئة بأمان، وإعادة تجربة الغابة الحالية دون فقدان التقدم."], ["هل يوجد مؤقت؟", "لا. صُممت الغابات الثلاث للمقارنة الهادئة وتخطيط المجموعات."], ["هل يُحفظ التقدم؟", "يُحفظ التقدم المفتوح وأفضل عدد من الفحوص في هذا المتصفح فقط."]]
    },
  };
  let textGrowthGuide = null;
  let routeTextGrowthCopy = null;
  const applyTextGrowthGuide = async () => {
    const guide = document.querySelector(".game-page-info[data-wp-balance-grove-guide]");
    if (!guide) return;
    try {
      const routeLocale = guide.getAttribute("data-wp-balance-grove-locale");
      if (!routeTextGrowthCopy) {
        const source = guide.querySelector("script[data-wp-balance-grove-copy]")?.textContent;
        if (source) routeTextGrowthCopy = JSON.parse(source);
      }
      if (state.locale !== routeLocale) {
        textGrowthGuide ||= await fetch("/games/animal-balance-grove/text-growth-140.json?v=20261003-balance-grove-text140-v7").then((response) => response.ok ? response.json() : null);
      }
      const sourceCopy = state.locale === routeLocale ? routeTextGrowthCopy?.locale : textGrowthGuide?.locales?.[state.locale];
      if (!sourceCopy) return;
      const copy = { ...sourceCopy, runtimeLabels: routeTextGrowthCopy?.runtimeLabels?.[state.locale] };
      const set = (node, value) => { if (node && typeof value === "string" && node.textContent !== value) node.textContent = value; };
      if (guideInfoCopy[state.locale]?.guideAria) guide.setAttribute("aria-label", guideInfoCopy[state.locale].guideAria);
      set(guide.querySelector(".game-info-kicker"), guideInfoCopy[state.locale]?.kicker || guideInfoCopy.en.kicker);
      set(guide.querySelector(".game-info-title h2"), copy.title);
      set(guide.querySelector(".game-info-title p"), copy.intro);
      const sections = [...guide.querySelectorAll(":scope .game-info-sections > .game-info-section")];
      copy.guide.forEach((item, index) => { set(sections[index]?.querySelector("h3"), item.heading); set(sections[index]?.querySelector("p"), item.body); });
      const faq = sections[copy.guide.length];
      set(faq?.querySelector("h3"), guideInfoCopy[state.locale]?.faq || copy.runtimeLabels?.faq || "FAQ");
      faq?.querySelectorAll("dl > div").forEach((item, index) => { set(item.querySelector("dt"), copy.faq[index]?.[0]); set(item.querySelector("dd"), copy.faq[index]?.[1]); });
      guide.querySelectorAll(".game-info-tags span").forEach((node, index) => set(node, copy.tags[index] || ""));
      set(sections[copy.guide.length + 1]?.querySelector("h3"), copy.runtimeLabels?.related || "Related Games");
    } catch { /* Static localized HTML remains available when the optional runtime copy fetch fails. */ }
  };
  const marketComparisonCopy = {
    "en": {
      "heading": "Similar gameplay reference:",
      "tagLabel": "Gameplay tags:",
      "tags": [
        "Subset-sum logic",
        "Balance puzzle",
        "Visible-weight planning",
        "Three-grove campaign"
      ],
      "summary": "Ravensburger's official ThinkFun page describes Balance Beans as placing colorful beans in the correct spaces on a balance board until it sits level, with 40 increasingly challenging puzzles. Balance Grove shares the observe-plan-balance loop, but uses visible stone weights and subset sums instead of lever positions: choose any non-empty set whose total matches the grove target, then check the balance. Its three authored groves use targets 5, 7, and 9, expand the tray from four to six named stones, allow calm clearing and retrying, and keep best-check progress only in this browser.",
      "independence": "Balance Grove is an independent WeightPlay game and is not affiliated with, endorsed by, or licensed by Balance Beans, ThinkFun, or Ravensburger.",
      "sourceLabel": "Official Balance Beans page"
    },
    "zh-Hant": {
      "heading": "相似玩法參考：",
      "tagLabel": "玩法標籤：",
      "tags": [
        "子集合加總",
        "平衡益智",
        "可見重量推理",
        "三林地關卡"
      ],
      "summary": "Ravensburger 的 ThinkFun 官方頁面介紹 Balance Beans：把彩色豆豆放到平衡板的正確位置，直到板面保持水平，並提供 40 道逐步變難的挑戰。Balance Grove 同樣要求先觀察、規劃再取得平衡，但改用清楚顯示的石頭重量與子集合加總：選出總和等於林地目標的非空石頭組合，再檢查平衡。三個手工設計的林地目標依序為 5、7、9，石頭由四顆增加到六顆，可隨時清空重試，最佳檢查次數只保存在目前瀏覽器。",
      "independence": "Balance Grove 是 WeightPlay 的獨立遊戲，與 Balance Beans、ThinkFun 或 Ravensburger 沒有官方隸屬、授權或推薦關係。",
      "sourceLabel": "Balance Beans 官方頁面"
    },
    "zh-Hans": {
      "heading": "相似玩法参考：",
      "tagLabel": "玩法标签：",
      "tags": [
        "子集求和",
        "平衡益智",
        "可见重量推理",
        "三林地关卡"
      ],
      "summary": "Ravensburger 的 ThinkFun 官方页面介绍 Balance Beans：把彩色豆豆放到平衡板的正确位置，直到板面保持水平，并提供 40 道逐步变难的挑战。Balance Grove 同样要求先观察、规划再取得平衡，但改用清楚显示的石头重量与子集求和：选出总和等于林地目标的非空石头组合，再检查平衡。三个手工设计的林地目标依次为 5、7、9，石头从四颗增加到六颗，可随时清空重试，最佳检查次数只保存在当前浏览器。",
      "independence": "Balance Grove 是 WeightPlay 的独立游戏，与 Balance Beans、ThinkFun 或 Ravensburger 没有官方隶属、授权或推荐关系。",
      "sourceLabel": "Balance Beans 官方页面"
    },
    "ja": {
      "heading": "似た遊び方の参考：",
      "tagLabel": "ゲームプレイタグ：",
      "tags": [
        "部分和ロジック",
        "バランスパズル",
        "重さ比較",
        "3つの森チャレンジ"
      ],
      "summary": "Ravensburger の ThinkFun 公式ページでは、Balance Beans はカラフルな豆をバランスボードの正しい位置に置いて水平にし、40問の段階的に難しくなるチャレンジに挑むゲームと説明されています。Balance Grove も観察して計画し、つり合いを作る流れは共通しますが、てこの位置ではなく見えている石の重さと部分和を使います。表示された森の目標と合計が一致する空でない石の組み合わせを選び、バランスを確認します。3つの手作りステージは目標が5、7、9と変化し、石は4個から6個へ増え、いつでもクリアして落ち着いて再挑戦できます。",
      "independence": "Balance Grove は WeightPlay の独立作品で、Balance Beans、ThinkFun、Ravensburger との公式な提携・推奨・ライセンス関係はありません。",
      "sourceLabel": "Balance Beans 公式ページ"
    },
    "ko": {
      "heading": "비슷한 플레이 참고:",
      "tagLabel": "게임플레이 태그:",
      "tags": [
        "부분합 논리",
        "균형 퍼즐",
        "무게 비교 추론",
        "3개 숲 캠페인"
      ],
      "summary": "Ravensburger의 ThinkFun 공식 페이지는 Balance Beans를 색색의 콩을 균형판의 알맞은 자리에 놓아 판을 수평으로 만들고, 점점 어려워지는 40개 퍼즐에 도전하는 게임으로 설명합니다. Balance Grove도 관찰하고 계획해 균형을 맞추는 흐름은 비슷하지만, 지렛대 위치 대신 화면에 보이는 돌의 무게와 부분합을 사용합니다. 숲의 목표값과 합이 같은 비어 있지 않은 돌 조합을 고른 뒤 균형을 확인합니다. 세 개의 설계된 숲은 목표가 5, 7, 9로 바뀌고 돌은 4개에서 6개까지 늘어나며 언제든 비우고 다시 시도할 수 있습니다.",
      "independence": "Balance Grove는 WeightPlay의 독립 게임이며 Balance Beans, ThinkFun 또는 Ravensburger와 공식 제휴·추천·라이선스 관계가 없습니다.",
      "sourceLabel": "Balance Beans 공식 페이지"
    },
    "es": {
      "heading": "Referencia de jugabilidad similar:",
      "tagLabel": "Etiquetas de jugabilidad:",
      "tags": [
        "Lógica de suma de subconjuntos",
        "Puzle de equilibrio",
        "Comparación de pesos",
        "Campaña de tres bosques"
      ],
      "summary": "La página oficial de ThinkFun en Ravensburger describe Balance Beans como un juego en el que colocas judías de colores en los espacios correctos de una balanza hasta dejarla nivelada, con 40 retos de dificultad creciente. Balance Grove comparte el ciclo de observar, planear y equilibrar, pero usa pesos visibles y sumas de subconjuntos: elige un conjunto no vacío cuyo total coincida con el objetivo del bosque y después comprueba el equilibrio. Sus tres bosques tienen objetivos 5, 7 y 9 y amplían la bandeja de cuatro a seis piedras con nombre.",
      "independence": "Balance Grove es un juego independiente de WeightPlay y no está afiliado, respaldado ni licenciado por Balance Beans, ThinkFun o Ravensburger.",
      "sourceLabel": "Página oficial de Balance Beans"
    },
    "pt-BR": {
      "heading": "Referência de jogabilidade semelhante:",
      "tagLabel": "Tags de jogabilidade:",
      "tags": [
        "Lógica de soma de subconjuntos",
        "Quebra-cabeça de equilíbrio",
        "Comparação de pesos",
        "Campanha de três bosques"
      ],
      "summary": "A página oficial da ThinkFun na Ravensburger descreve Balance Beans como um jogo em que você coloca feijões coloridos nos espaços corretos de uma prancha de equilíbrio até deixá-la nivelada, com 40 desafios de dificuldade crescente. Balance Grove compartilha o ciclo de observar, planejar e equilibrar, mas usa pesos visíveis e somas de subconjuntos: escolha um conjunto não vazio cuja soma corresponda ao alvo do bosque e depois verifique o equilíbrio. Os três bosques usam alvos 5, 7 e 9 e ampliam a bandeja de quatro para seis pedras nomeadas.",
      "independence": "Balance Grove é um jogo independente da WeightPlay e não possui afiliação, endosso ou licença oficial de Balance Beans, ThinkFun ou Ravensburger.",
      "sourceLabel": "Página oficial de Balance Beans"
    },
    "fr": {
      "heading": "Référence de gameplay similaire :",
      "tagLabel": "Tags de gameplay :",
      "tags": [
        "Logique de somme de sous-ensembles",
        "Puzzle d’équilibre",
        "Comparaison des poids",
        "Campagne de trois bosquets"
      ],
      "summary": "La page officielle ThinkFun de Ravensburger décrit Balance Beans comme un jeu où l’on place des haricots colorés aux bons endroits sur une planche d’équilibre jusqu’à la mettre à niveau, avec 40 défis de difficulté croissante. Balance Grove partage la boucle observer-planifier-équilibrer, mais utilise des poids de pierres visibles et des sommes de sous-ensembles : choisissez un ensemble non vide dont le total correspond à l’objectif du bosquet, puis vérifiez l’équilibre. Les trois bosquets ont pour objectifs 5, 7 et 9 et font passer le plateau de quatre à six pierres nommées.",
      "independence": "Balance Grove est un jeu WeightPlay indépendant, sans affiliation, approbation ni licence officielle de Balance Beans, ThinkFun ou Ravensburger.",
      "sourceLabel": "Page officielle de Balance Beans"
    },
    "de": {
      "heading": "Ähnliche Gameplay-Referenz:",
      "tagLabel": "Gameplay-Tags:",
      "tags": [
        "Teilmengen-Summenlogik",
        "Balance-Rätsel",
        "Gewichtsvergleich",
        "Drei-Haine-Kampagne"
      ],
      "summary": "Die offizielle ThinkFun-Seite von Ravensburger beschreibt Balance Beans als Spiel, bei dem bunte Bohnen an die richtigen Stellen eines Balancebretts gesetzt werden, bis es waagerecht steht; enthalten sind 40 zunehmend schwierigere Aufgaben. Balance Grove teilt den Ablauf aus Beobachten, Planen und Ausbalancieren, nutzt aber sichtbare Steingewichte und Teilmengensummen: Wähle eine nicht leere Steingruppe, deren Summe dem Hain-Ziel entspricht, und prüfe dann die Balance. Die drei gestalteten Haine haben die Ziele 5, 7 und 9 und erweitern das Angebot von vier auf sechs benannte Steine.",
      "independence": "Balance Grove ist ein unabhängiges WeightPlay-Spiel und steht in keiner offiziellen Verbindung, Empfehlung oder Lizenzbeziehung zu Balance Beans, ThinkFun oder Ravensburger.",
      "sourceLabel": "Offizielle Balance-Beans-Seite"
    },
    "it": {
      "heading": "Riferimento di gioco simile:",
      "tagLabel": "Tag di gioco:",
      "tags": [
        "Logica di somma dei sottoinsiemi",
        "Puzzle di equilibrio",
        "Confronto dei pesi",
        "Campagna di tre boschi"
      ],
      "summary": "La pagina ufficiale ThinkFun di Ravensburger descrive Balance Beans come un gioco in cui si posizionano fagioli colorati negli spazi corretti di una tavola basculante finché resta in equilibrio, con 40 sfide di difficoltà crescente. Balance Grove condivide il ciclo osserva-pianifica-bilancia, ma usa pesi delle pietre visibili e somme di sottoinsiemi: scegli un insieme non vuoto il cui totale corrisponda all’obiettivo del bosco, poi controlla l’equilibrio. I tre boschi hanno obiettivi 5, 7 e 9 e ampliano il vassoio da quattro a sei pietre con nome.",
      "independence": "Balance Grove è un gioco indipendente di WeightPlay e non è affiliato, approvato o concesso in licenza da Balance Beans, ThinkFun o Ravensburger.",
      "sourceLabel": "Pagina ufficiale di Balance Beans"
    },
    "ru": {
      "heading": "Похожий игровой ориентир:",
      "tagLabel": "Теги геймплея:",
      "tags": [
        "Логика суммы подмножеств",
        "Головоломка на баланс",
        "Сравнение весов",
        "Кампания из трёх рощ"
      ],
      "summary": "На официальной странице ThinkFun у Ravensburger Balance Beans описывается как игра, где цветные бобы нужно поставить в правильные места на балансировочной доске, чтобы выровнять её; в наборе 40 задач с растущей сложностью. Balance Grove тоже строится на наблюдении, планировании и достижении равновесия, но использует видимые веса камней и суммы подмножеств: выберите непустой набор, сумма которого равна цели рощи, затем проверьте баланс. Три созданные вручную рощи имеют цели 5, 7 и 9 и увеличивают набор с четырёх до шести именованных камней.",
      "independence": "Balance Grove — независимая игра WeightPlay и не имеет официальной связи, одобрения или лицензии от Balance Beans, ThinkFun или Ravensburger.",
      "sourceLabel": "Официальная страница Balance Beans"
    },
    "hi": {
      "heading": "समान खेल संदर्भ:",
      "tagLabel": "खेल टैग:",
      "tags": [
        "योग तर्क",
        "संतुलन पहेली",
        "भार तुलना",
        "तीन वन"
      ],
      "summary": "Ravensburger की ThinkFun जानकारी के अनुसार Balance Beans में रंगीन बीन्स को बैलेंस बोर्ड पर रखकर उसे समतल किया जाता है और 40 बढ़ती कठिनाई वाली पहेलियाँ हैं। Balance Grove में पत्थरों के दिखने वाले भार जोड़कर वन के लक्ष्य 5, 7 या 9 से मिलाए जाते हैं। तीन वनों में पत्थरों की संख्या चार से छह तक बढ़ती है और गलत चयन को साफ़ करके फिर कोशिश की जा सकती है।",
      "independence": "Balance Grove, WeightPlay का स्वतंत्र खेल है और इन कंपनियों से आधिकारिक संबंध नहीं रखता।",
      "sourceLabel": "Balance Beans की आधिकारिक जानकारी"
    },
    "ar": {
      "heading": "مرجع لعب مشابه:",
      "tagLabel": "وسوم أسلوب اللعب:",
      "tags": [
        "منطق مجموع المجموعات الجزئية",
        "لغز توازن",
        "مقارنة الأوزان الظاهرة",
        "حملة من ثلاث غابات"
      ],
      "summary": "تصف صفحة ThinkFun الرسمية لدى Ravensburger لعبة Balance Beans بأنها لعبة تضع فيها حبوبًا ملوّنة في المواضع الصحيحة على لوح توازن حتى يصبح مستويًا، مع 40 تحديًا تزداد صعوبتها تدريجيًا. تشترك Balance Grove في الملاحظة والتخطيط وتحقيق التوازن، لكنها تستخدم أوزان أحجار ظاهرة ومجاميع مجموعات جزئية بدل مواضع الرافعة. اختر مجموعة غير فارغة يساوي مجموعها هدف الغابة ثم افحص التوازن. تستخدم الغابات الثلاث أهداف 5 و7 و9، وتزيد صينية الأحجار من أربعة إلى ستة أحجار مسمّاة.",
      "independence": "Balance Grove لعبة مستقلة من WeightPlay ولا تربطها علاقة رسمية أو اعتماد أو ترخيص مع Balance Beans أو ThinkFun أو Ravensburger.",
      "sourceLabel": "الصفحة الرسمية لـ Balance Beans"
    }
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
    { title: "stageTitle1", hint: "stageHint1", target: 5, pieces: [["stoneAcorn", 1, "●"], ["stonePebble", 2, "◆"], ["stoneTwig", 3, "▲"], ["stoneBerry", 4, "✦"]] },
    { title: "stageTitle2", hint: "stageHint2", target: 7, pieces: [["stoneAcorn", 1, "●"], ["stonePebble", 2, "◆"], ["stoneTwig", 3, "▲"], ["stoneBerry", 4, "✦"], ["stoneShell", 5, "⬟"]] },
    { title: "stageTitle3", hint: "stageHint3", target: 9, pieces: [["stoneAcorn", 1, "●"], ["stonePebble", 2, "◆"], ["stoneTwig", 3, "▲"], ["stoneBerry", 4, "✦"], ["stoneShell", 5, "⬟"], ["stoneFirefly", 6, "✿"]] }
  ];
  const routedLocale = window.WonderI18n?.localeFromPath?.();
  const savedLocale = (() => { try { return localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale"); } catch (error) { return null; } })();
  const state = { locale: normalizeLocale(routedLocale || window.WonderI18n?.actualLocale?.() || document.documentElement.lang || savedLocale), stage: 0, selected: [], checks: 0, sessionChecks: 0, sound: !Boolean(window.WeightPlayAudio?.isMuted?.()), storage: true };
  const syncSoundState = () => {
    if (typeof window.WeightPlayAudio?.isMuted === "function") state.sound = !window.WeightPlayAudio.isMuted();
  };
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
  const show = (name) => {
    Object.keys(screens).forEach((key) => { screens[key].hidden = key !== name; });
    const scene = name === "stages" ? "stage" : name;
    const activePlay = scene === "stage" || scene === "battle";
    document.body.dataset.screen = scene;
    document.documentElement.classList.toggle("wp-active-play", activePlay);
    document.body.classList.toggle("wp-active-play", activePlay);
    if (activePlay) window.scrollTo(0, 0);

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle","stages":"stage"})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
};
  const applyLocale = () => {
    const guideCopy = guideInfoCopy[state.locale] || guideInfoCopy.en;
    syncSoundState();
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { const text = t(node.dataset.copy); if (node.hasAttribute("data-wp-return")) node.setAttribute("aria-label", text); else node.textContent = text; });
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
    if (document.querySelector(".game-page-info[data-wp-balance-grove-guide]")) applyTextGrowthGuide();
    else applyGuideLocale(guideCopy);
    if (!screens.stages.hidden) renderStages();
    if (!screens.battle.hidden) renderBattle();
    if (!screens.result.hidden) renderResult();
  };
  const applyGuideLocale = (guideCopy) => {
    const guide = document.querySelector(".game-page-info[data-runtime-localize='off'], .game-page-info[data-wp-balance-grove-guide]");
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
    setText(facts[2]?.querySelector("span"), guideCopy.difficultyLabel || (state.locale === "ar" ? "الصعوبة" : facts[2]?.querySelector("span")?.textContent));
    setText(facts[2]?.querySelector("strong"), guideCopy.difficulty || facts[2]?.querySelector("strong")?.textContent);
    setText(facts[3]?.querySelector("span"), guideCopy.timeLabel || (state.locale === "ar" ? "وقت اللعب المقدر" : facts[3]?.querySelector("span")?.textContent));
    setText(facts[3]?.querySelector("strong"), guideCopy.time || facts[3]?.querySelector("strong")?.textContent);
    const sections = [...guide.querySelectorAll(".game-info-section")];
    const storySection = guide.querySelector(".game-info-story") || sections.find((section) => section.querySelector("h3")?.textContent.includes("العالم") || section.querySelector("h3")?.textContent.includes("Story"));
    const systemsSection = guide.querySelector(".game-info-systems") || sections.find((section) => section.querySelector("h3")?.textContent.includes("الأنظمة") || section.querySelector("h3")?.textContent.includes("Systems"));
    const howSection = sections.find((section) => section.querySelector("ol"));
    const strategySection = guide.querySelector(".game-info-strategy") || sections.find((section) => section.querySelector("ul"));
    const progressionSection = guide.querySelector(".game-info-campaign") || sections.find((section) => section.querySelector("h3")?.textContent.includes("تطور") || section.querySelector("h3")?.textContent.includes("Progress"));
    const designSection = guide.querySelector(".game-info-design") || sections.find((section) => section.querySelector("h3")?.textContent.includes("تصميم") || section.querySelector("h3")?.textContent.includes("Design"));
    const parentSection = sections.find((section) => section.classList.contains("game-info-parent"));
    [[storySection, guideCopy.storyTitle], [systemsSection, guideCopy.systemsTitle], [howSection, guideCopy.howTitle], [strategySection, guideCopy.strategyTitle], [progressionSection, guideCopy.progressionTitle], [designSection, guideCopy.designTitle], [parentSection, guideCopy.parentTitle]].forEach(([section, title]) => { if (title) setText(section?.querySelector("h3"), title); });
    const setParagraphs = (section, values) => { if (!section || !Array.isArray(values)) return; section.querySelectorAll(":scope > p").forEach((node, index) => setText(node, values[index] ?? "")); };
    setParagraphs(storySection, guideCopy.story);
    setParagraphs(systemsSection, guideCopy.systems);
    if (systemsSection && Array.isArray(guideCopy.systems)) systemsSection.querySelectorAll("ul > li").forEach((node, index) => setText(node, guideCopy.systems[index] ?? ""));
    setParagraphs(progressionSection, guideCopy.progression);
    setParagraphs(designSection, guideCopy.designNote ? [guideCopy.designNote] : null);
    setParagraphs(parentSection, guideCopy.parent ? [guideCopy.parent] : null);
    if (howSection && Array.isArray(guideCopy.how)) howSection.querySelectorAll("ol > li").forEach((node, index) => setText(node, guideCopy.how[index] ?? ""));
    if (strategySection && Array.isArray(guideCopy.strategyTips)) strategySection.querySelectorAll("ul > li").forEach((node, index) => setText(node, guideCopy.strategyTips[index] ?? ""));
    const faqSection = sections.find((section) => section.querySelector("dl"));
    setText(faqSection?.querySelector("h3"), guideCopy.faq);
    const faqItems = guideCopy.faqItems || [[guideCopy.faqQuestion, guideCopy.faqAnswer]];
    faqSection?.querySelectorAll("dl > div").forEach((item, index) => { const pair = faqItems[index]; if (!pair) return; setText(item.querySelector("dt"), pair[0]); setText(item.querySelector("dd"), pair[1]); });
    const comparisonSection = guide.querySelector('[data-wp-market-comparison="1.3.0"]');
    const comparisonCopy = marketComparisonCopy[state.locale] || marketComparisonCopy.en;
    if (comparisonSection && comparisonCopy) {
      comparisonSection.setAttribute("data-comparison-locale", state.locale);
      setText(comparisonSection.querySelector("[data-wp-comparison-heading]"), comparisonCopy.heading);
      setText(comparisonSection.querySelector("[data-wp-tags-label]"), comparisonCopy.tagLabel);
      comparisonSection.querySelectorAll("[data-wp-tag]").forEach((node, index) => setText(node, comparisonCopy.tags[index] || ""));
      setText(comparisonSection.querySelector("[data-wp-comparison-summary]"), comparisonCopy.summary);
      setText(comparisonSection.querySelector("[data-wp-comparison-independence]"), comparisonCopy.independence);
      setText(comparisonSection.querySelector("[data-wp-comparison-source]"), comparisonCopy.sourceLabel);
    }
  };
  const setLocale = (locale) => { state.locale = normalizeLocale(locale); try { localStorage.setItem("weightPlayLocale", state.locale); localStorage.setItem("weightplayLocale", state.locale); } catch (error) { state.storage = false; } applyLocale(); track("locale", { locale: state.locale }); };
  const beep = (cue = "ui.click") => { return window.WeightPlayAudio?.play(cue); };
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
  const renderResult = () => { const final = state.stage >= stages.length - 1 && state.selected.length === 0; $("resultHeading").textContent = final ? t("finishTitle") : t("balanced"); $("resultText").textContent = final ? t("finishText", { n: state.sessionChecks }) : t("balanced"); $("resultPrimaryBtn").textContent = final ? t("stageMap") : t("next"); (__wpNotifyMeasurement(), $("resultMapBtn").hidden = final); $("resultPrimaryBtn").onclick = final ? () => { show("stages"); renderStages(); } : () => startStage(state.stage + 1); };
  const startSession = () => { state.sessionChecks = 0; track("session_start"); show("stages"); renderStages(); track("stage_map", { source: "start" }); };
  const startStage = (index) => { state.stage = Math.max(0, Math.min(stages.length - 1, index)); state.selected = []; state.checks = 0; $("battleStatus").textContent = ""; show("battle"); renderBattle(); track("stage_start", { stage: state.stage + 1 });
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
};
  const toggleToken = (index) => { state.selected = state.selected.includes(index) ? state.selected.filter((item) => item !== index) : state.selected.concat(index); beep("board.move"); renderBattle(); track("stone_select", { stage: state.stage + 1, value: stages[state.stage].pieces[index][1] }); };
  const clearTokens = () => { state.selected = []; $("battleStatus").textContent = ""; renderBattle(); track("stone_clear", { stage: state.stage + 1 }); };
  const checkBalance = () => { const stage = stages[state.stage]; const total = state.selected.reduce((sum, index) => sum + stage.pieces[index][1], 0); const correct = state.selected.length > 0 && total === stage.target; state.checks += 1; state.sessionChecks += 1; track("balance_check", { stage: state.stage + 1, checks: state.checks, correct }); if (correct) { $("battleStatus").textContent = t("balanced"); beep("feedback.success"); state.selected = []; if (state.stage >= stages.length - 1) { writeBest(state.sessionChecks); track("session_complete", { checks: state.sessionChecks }); show("result"); renderResult(); } else { show("result"); renderResult(); } } else { $("battleStatus").textContent = t("notBalanced"); beep("feedback.error"); state.selected = []; renderBattle(); } };
  $("startBtn").addEventListener("click", startSession); $("mapBtn").addEventListener("click", () => { show("stages"); renderStages(); track("stage_map"); }); $("stageBackBtn").addEventListener("click", () => { show("main"); applyLocale(); }); $("battleBackBtn").addEventListener("click", () => { show("stages"); renderStages(); }); $("resultMapBtn").addEventListener("click", () => { show("stages"); renderStages(); }); $("resultHomeBtn").addEventListener("click", () => { show("main"); applyLocale(); }); $("checkBtn").addEventListener("click", checkBalance); $("clearBtn").addEventListener("click", clearTokens); $("settingsBtn").addEventListener("click", () => { const panel = $("settingsPanel"); panel.hidden = !panel.hidden; $("settingsBtn").setAttribute("aria-expanded", String(!panel.hidden)); }); $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; applyLocale(); track("sound", { enabled: state.sound }); }); $("localeSelect").addEventListener("change", (event) => { const next = normalizeLocale(event.target.value); if (window.WonderI18n?.setLocale) { window.WonderI18n.setLocale(next); return; } setLocale(next); });
  window.addEventListener?.("wonder:locale-change", (event) => setLocale(event.detail?.locale || window.WonderI18n?.actualLocale?.() || document.documentElement.lang));
  window.addEventListener?.("weightplay:audio-volume-change", () => { syncSoundState(); applyLocale(); });
  let guideRefreshPending = false;
  new MutationObserver((records) => {
    const guide = document.querySelector(".game-page-info[data-wp-balance-grove-guide]");
    if (!guide) { applyGuideLocale(guideInfoCopy[state.locale] || guideInfoCopy.en); return; }
    const guideChanged = records.some((record) => guide.contains(record.target) || [...record.addedNodes].some((node) => node === guide || node.contains?.(guide)));
    if (!guideChanged || guideRefreshPending) return;
    guideRefreshPending = true;
    window.requestAnimationFrame(() => { guideRefreshPending = false; applyTextGrowthGuide(); });
  }).observe(document.body, { childList: true, characterData: true, subtree: true });
  try { const saved = localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale"); if (!routedLocale && saved) state.locale = normalizeLocale(saved); } catch (error) { state.storage = false; }
  window.setTimeout(() => { $("loadingPanel").hidden = true; screens.main.hidden = false; applyLocale(); track("main_ready"); }, 420);
}());
