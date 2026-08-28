window.WPClassicLogic?.mount("reversi");

(() => {
  "use strict";

  const GAME_VERSION = "v10";
  const LOCALES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const ROUTE_LOCALES = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const CELL_LABELS = {
    en: "Row {row}, Column {col}", "zh-Hant": "第 {row} 行，第 {col} 列", "zh-Hans": "第 {row} 行，第 {col} 列",
    ja: "{row}行 {col}列", ko: "{row}행 {col}열", es: "Fila {row}, columna {col}", "pt-BR": "Linha {row}, coluna {col}",
    fr: "Ligne {row}, colonne {col}", de: "Zeile {row}, Spalte {col}", it: "Riga {row}, colonna {col}",
    ru: "Строка {row}, столбец {col}", hi: "पंक्ति {row}, स्तंभ {col}", ar: "الصف {row}، العمود {col}"
  };
  const GUIDE_COPY = {
    en: { aria: "Reversi game information", kicker: "WeightPlay Original Game Guide", title: "Reversi", description: "Place discs to surround the opponent; the player with more discs at the end wins.", gameplayLabel: "Gameplay", gameplay: "Strategy Board Game", genreLabel: "Genre", genre: "Classic · Puzzle · Strategy · Family", faqTitle: "FAQ", faqQuestion: "Is progress saved?", faqAnswer: "Yes, only in this browser." },
    "zh-Hant": { aria: "黑白棋 遊戲資訊", kicker: "WeightPlay 原創遊戲指南", title: "黑白棋", description: "放置棋子夾住對手，結束時棋子較多者獲勝。", gameplayLabel: "玩法", gameplay: "策略棋盤遊戲", genreLabel: "類型", genre: "Classic · Puzzle · 策略 · 家庭", faqTitle: "常見問題", faqQuestion: "進度保存了嗎？", faqAnswer: "是的，僅在該瀏覽器中。" },
    "zh-Hans": { aria: "黑白棋 游戏资讯", kicker: "WeightPlay 原创游戏指南", title: "黑白棋", description: "放置棋子夹住对手，结束时棋子较多者获胜。", gameplayLabel: "玩法", gameplay: "策略棋盘游戏", genreLabel: "类型", genre: "Classic · Puzzle · 策略 · 家庭", faqTitle: "常见问题", faqQuestion: "进度保存了吗？", faqAnswer: "是的，仅在该浏览器中。" },
    ja: { aria: "リバーシ のゲーム情報", kicker: "WeightPlay オリジナルゲームガイド", title: "リバーシ", description: "相手の石を挟み、最後に石が多い方が勝ちです。", gameplayLabel: "ゲーム内容", gameplay: "戦略ボードゲーム", genreLabel: "ジャンル", genre: "Classic · Puzzle · 戦略 · 家族", faqTitle: "よくある質問", faqQuestion: "進行状況は保存されますか?", faqAnswer: "はい、このブラウザでのみ可能です。" },
    ko: { aria: "리버시 게임 정보", kicker: "WeightPlay 오리지널 게임 가이드", title: "리버시", description: "상대 돌을 둘러싸 뒤집고 마지막에 돌이 많은 쪽이 승리합니다.", gameplayLabel: "Gameplay", gameplay: "전략 보드게임", genreLabel: "Genre", genre: "Classic · Puzzle · 전략 · 가족", faqTitle: "FAQ", faqQuestion: "진행 상황이 저장되나요?", faqAnswer: "예, 이 브라우저에서만 가능합니다." },
    es: { aria: "Guía de Reversi", kicker: "Guía de juegos originales de WeightPlay", title: "Reversi", description: "Rodea y voltea fichas rivales; gana quien tenga más al final.", gameplayLabel: "Cómo se juega", gameplay: "Juego de estrategia", genreLabel: "Género", genre: "Classic · Puzzle · Estrategia · familia", faqTitle: "Preguntas frecuentes", faqQuestion: "¿Se guarda el progreso?", faqAnswer: "Sí, sólo en este navegador." },
    "pt-BR": { aria: "Reversi informações do jogo", kicker: "Guia de jogos originais WeightPlay", title: "Reversi", description: "Cerque e vire as peças rivais; vence quem tiver mais no fim.", gameplayLabel: "Gameplay", gameplay: "Jogo de estratégia", genreLabel: "Genre", genre: "Classic · Puzzle · Estratégia · Família", faqTitle: "FAQ", faqQuestion: "O progresso é salvo?", faqAnswer: "Sim, apenas neste navegador." },
    fr: { aria: "Informations sur le jeu Reversi", kicker: "Guide des jeux originaux WeightPlay", title: "Reversi", description: "Encadrez les pions adverses ; le plus grand nombre gagne.", gameplayLabel: "Type de jeu", gameplay: "Jeu de stratégie", genreLabel: "Genre", genre: "Classic · Puzzle · Stratégie · Famille", faqTitle: "Questions fréquentes", faqQuestion: "La progression est-elle enregistrée ?", faqAnswer: "Oui, uniquement dans ce navigateur." },
    de: { aria: "Spielanleitung für Reversi", kicker: "WeightPlay-Leitfaden für Originalspiele", title: "Reversi", description: "Umschließe gegnerische Steine; am Ende gewinnt die größere Zahl.", gameplayLabel: "Spielweise", gameplay: "Strategiespiel", genreLabel: "Genre", genre: "Classic · Puzzle · Strategie · Familie", faqTitle: "Häufige Fragen", faqQuestion: "Wird der Fortschritt gespeichert?", faqAnswer: "Ja, nur in diesem Browser." },
    it: { aria: "Reversi informazioni sul gioco", kicker: "Guida ai giochi originali WeightPlay", title: "Reversi", description: "Circonda e rovescia le pedine rivali; vince chi ne ha di più.", gameplayLabel: "Gameplay", gameplay: "Gioco strategico", genreLabel: "Genre", genre: "Classic · Puzzle · Strategia · Famiglia", faqTitle: "FAQ", faqQuestion: "I progressi vengono salvati?", faqAnswer: "Sì, solo in questo browser." },
    ru: { aria: "Реверси информация об игре", kicker: "Руководство по оригинальным играм WeightPlay", title: "Реверси", description: "Окружайте фишки соперника; побеждает тот, у кого их больше.", gameplayLabel: "Gameplay", gameplay: "Стратегическая игра", genreLabel: "Genre", genre: "Classic · Puzzle · Стратегия · Семья", faqTitle: "FAQ", faqQuestion: "Прогресс сохраняется?", faqAnswer: "Да, только в этом браузере." },
    hi: { aria: "रिवर्सी खेल की जानकारी", kicker: "WeightPlay मौलिक गेम गाइड", title: "रिवर्सी", description: "प्रतिद्वंद्वी की गोटियों को घेरें; अंत में अधिक गोटियाँ जीतती हैं।", gameplayLabel: "Gameplay", gameplay: "रणनीति बोर्ड गेम", genreLabel: "Genre", genre: "Classic · Puzzle · रणनीति · परिवार", faqTitle: "FAQ", faqQuestion: "क्या प्रगति सहेजी गई है?", faqAnswer: "हाँ, केवल इस ब्राउज़र में." },
    ar: { aria: "دليل لعبة ريفيرسي", kicker: "دليل ألعاب WeightPlay الأصلية", title: "ريفيرسي", description: "أحط قطع الخصم واقلبها؛ يفوز من يملك قطعًا أكثر.", gameplayLabel: "طريقة اللعب", gameplay: "لعبة لوحية استراتيجية", genreLabel: "النوع", genre: "Classic · Puzzle · الإستراتيجية · العائلة", faqTitle: "الأسئلة الشائعة", faqQuestion: "هل يتم حفظ التقدم؟", faqAnswer: "نعم، فقط في هذا المتصفح." }
  };
  const GUIDE_QUICK_START = {
    en: "Choose a difficulty, read the rule, then use Hint to inspect a safe next move. Replay or New Puzzle resets the board for a fresh round.",
    "zh-Hant": "選擇難度、閱讀規則，再用提示查看安全的下一步。使用再玩一次或新謎題即可重新設定棋盤。",
    "zh-Hans": "选择难度、阅读规则，再用提示查看安全的下一步。使用再玩一次或新谜题即可重新设置棋盘。",
    ja: "難易度を選び、ルールを読んでから、ヒントで安全な次の手を確認しましょう。リプレイまたは新しいパズルで盤面をリセットできます。",
    ko: "난이도를 고르고 규칙을 읽은 뒤 힌트로 안전한 다음 수를 확인하세요. 다시 하기 또는 새 퍼즐로 보드를 초기화할 수 있습니다.",
    es: "Elige una dificultad, lee la regla y usa Pista para ver una jugada segura. Repetir o Nuevo puzzle reinicia el tablero.",
    "pt-BR": "Escolha uma dificuldade, leia a regra e use Dica para ver uma jogada segura. Jogar de novo ou Novo quebra-cabeça reinicia o tabuleiro.",
    fr: "Choisissez une difficulté, lisez la règle, puis utilisez Indice pour voir un coup sûr. Rejouer ou Nouveau puzzle réinitialise le plateau.",
    de: "Wähle eine Schwierigkeit, lies die Regel und nutze Tipp für einen sicheren nächsten Zug. Nochmal oder Neues Rätsel setzt das Brett zurück.",
    it: "Scegli una difficoltà, leggi la regola e usa Suggerimento per vedere una mossa sicura. Rigioca o Nuovo puzzle reimposta la tavola.",
    ru: "Выберите сложность, прочитайте правило и используйте подсказку, чтобы увидеть безопасный следующий ход. Кнопка «Снова» или «Новая задача» сбрасывает поле.",
    hi: "कठिनाई चुनें, नियम पढ़ें और सुरक्षित अगली चाल देखने के लिए संकेत का उपयोग करें। फिर खेलें या नई पहेली से बोर्ड रीसेट होता है।",
    ar: "اختر مستوى الصعوبة واقرأ القاعدة، ثم استخدم التلميح لمعرفة خطوة آمنة تالية. يعيد «العب مجددًا» أو «لغز جديد» ضبط اللوحة."
  };
  const SCENARIOS = [
    {
      key: "corner-watch",
      copy: {
        en: "Replay focus · corner watch: if a corner becomes legal, consider it before chasing a bigger flip. The choice stays yours.",
        "zh-Hant": "重玩焦點・留意角落：角落變成合法步時，先考慮它，再追求翻更多棋子。選擇仍由你決定。",
        "zh-Hans": "重玩焦点・留意角落：角落变成合法步时，先考虑它，再追求翻更多棋子。选择仍由你决定。",
        ja: "リプレイの焦点・角を観察：角が合法手になったら、多く返す手より先に検討しましょう。選ぶのはあなたです。",
        ko: "다시 하기 초점 · 모서리 관찰: 모서리가 둘 수 있는 칸이 되면 더 많이 뒤집는 수보다 먼저 살펴보세요. 선택은 직접 합니다.",
        es: "Enfoque de repetición · vigila las esquinas: si una esquina es legal, considérala antes de buscar más fichas. Tú decides.",
        "pt-BR": "Foco da revanche · observe os cantos: se um canto ficar legal, considere-o antes de buscar mais capturas. Você decide.",
        fr: "Objectif de replay · surveillez les coins : si un coin devient jouable, examinez-le avant de chercher plus de pions. Vous décidez.",
        de: "Replay-Fokus · Ecken im Blick: Wird eine Ecke legal, prüfe sie vor einem Zug mit mehr Steinen. Du entscheidest.",
        it: "Obiettivo replay · osserva gli angoli: se un angolo diventa legale, consideralo prima di cercare più pedine. Decidi tu.",
        ru: "Фокус повтора · следите за углами: если угол станет доступен, рассмотрите его раньше хода с большим захватом. Решаете вы.",
        hi: "दोबारा खेलने का फोकस · कोनों पर नज़र रखें: कोना चाल के लिए खुले तो अधिक मोहरे पलटने से पहले उसे देखें। चुनाव आपका है।",
        ar: "تركيز الإعادة · راقب الزوايا: إذا أصبحت الزاوية حركة قانونية، ففكّر فيها قبل مطاردة قلب أقراص أكثر. القرار لك."
      }
    },
    {
      key: "mobility-balance",
      copy: {
        en: "Replay focus · mobility balance: compare your legal-move count before and after a move, then keep options open when you can.",
        "zh-Hant": "重玩焦點・平衡機動：比較落子前後的合法步數，能保留選項時就保留它們。",
        "zh-Hans": "重玩焦点・平衡机动：比较落子前后的合法步数，能保留选项时就保留它们。",
        ja: "リプレイの焦点・手数の余裕：置く前後の合法手数を比べ、可能なら選択肢を残しましょう。",
        ko: "다시 하기 초점 · 선택지 균형: 수를 두기 전후의 합법적인 수를 비교하고, 가능하면 선택지를 남겨 두세요.",
        es: "Enfoque de repetición · equilibrio de movilidad: compara tus jugadas legales antes y después y conserva opciones cuando puedas.",
        "pt-BR": "Foco da revanche · equilíbrio de mobilidade: compare suas jogadas legais antes e depois e preserve opções quando puder.",
        fr: "Objectif de replay · mobilité : comparez vos coups légaux avant et après, puis gardez des choix ouverts quand c’est possible.",
        de: "Replay-Fokus · Beweglichkeit: Vergleiche deine legalen Züge vor und nach dem Zug und halte Optionen offen, wenn du kannst.",
        it: "Obiettivo replay · equilibrio della mobilità: confronta le mosse legali prima e dopo e conserva le opzioni quando puoi.",
        ru: "Фокус повтора · мобильность: сравнивайте число доступных ходов до и после и сохраняйте варианты, когда это возможно.",
        hi: "दोबारा खेलने का फोकस · चालों का संतुलन: चाल से पहले और बाद की कानूनी चालें गिनें और हो सके तो विकल्प खुले रखें।",
        ar: "تركيز الإعادة · توازن الحركة: قارن عدد حركاتك القانونية قبل الحركة وبعدها، وحافظ على الخيارات إن أمكن."
      }
    },
    {
      key: "edge-discipline",
      copy: {
        en: "Replay focus · edge discipline: use an edge when it supports the next position; do not chase the boundary for a bigger flip.",
        "zh-Hant": "重玩焦點・邊線紀律：邊線能支援下一個局面時再使用，不要只為多翻棋子追逐邊界。",
        "zh-Hans": "重玩焦点・边线纪律：边线能支撑下一局面时再使用，不要只为多翻棋子追逐边界。",
        ja: "リプレイの焦点・辺の規律：次の局面を支えるときに辺を使い、返す数だけを求めて辺を追わないように。",
        ko: "다시 하기 초점 · 가장자리 원칙: 다음 포지션에 도움이 될 때 가장자리를 쓰고, 더 많이 뒤집으려고 경계만 쫓지 마세요.",
        es: "Enfoque de repetición · disciplina de borde: usa un borde si ayuda a la siguiente posición; no lo persigas solo por voltear más.",
        "pt-BR": "Foco da revanche · disciplina de borda: use a borda quando ela apoiar a próxima posição; não a persiga só por capturar mais.",
        fr: "Objectif de replay · discipline des bords : utilisez un bord s’il aide la position suivante ; ne le cherchez pas seulement pour retourner plus de pions.",
        de: "Replay-Fokus · Kanten mit Maß: Nutze eine Kante, wenn sie die nächste Stellung stützt; jage ihr nicht nur für mehr Steine nach.",
        it: "Obiettivo replay · disciplina dei bordi: usa un bordo quando sostiene la posizione successiva; non inseguirlo solo per catturare di più.",
        ru: "Фокус повтора · дисциплина края: используйте край, если он помогает следующей позиции; не гонитесь за ним только ради захвата.",
        hi: "दोबारा खेलने का फोकस · किनारे का अनुशासन: अगली स्थिति में मदद मिले तो किनारा चुनें; अधिक मोहरे पलटने के लिए ही किनारे के पीछे न जाएँ।",
        ar: "تركيز الإعادة · انضباط الحواف: استخدم الحافة عندما تدعم الوضع التالي، ولا تطاردها لمجرد قلب أقراص أكثر."
      }
    }
  ];

  let scenarioIndex = 0;

  const locale = () => {
    const route = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const documentLocale = document.documentElement.lang;
    const value = LOCALES.includes(documentLocale)
      ? documentLocale
      : window.WonderI18n?.actualLocale?.() || ROUTE_LOCALES[route] || "en";
    return LOCALES.includes(value) ? value : "en";
  };

  const syncGuide = () => {
    const quickStart = document.querySelector(".logic-guide p:last-child");
    if (quickStart) quickStart.textContent = GUIDE_QUICK_START[locale()] || GUIDE_QUICK_START.en;
    const guide = document.querySelector(".game-page-info-static");
    if (!guide) return;
    const copy = GUIDE_COPY[locale()] || GUIDE_COPY.en;
    guide.setAttribute("data-runtime-localize", "off");
    guide.setAttribute("aria-label", copy.aria);
    const title = guide.querySelector(".game-info-title");
    const facts = guide.querySelectorAll(".game-info-fact");
    const faq = guide.querySelector(".game-info-section");
    if (title) {
      title.querySelector(".game-info-kicker").textContent = copy.kicker;
      title.querySelector("h2").textContent = copy.title;
      title.querySelector("p").textContent = copy.description;
    }
    if (facts[0]) {
      facts[0].querySelector("span").textContent = copy.gameplayLabel;
      facts[0].querySelector("strong").textContent = copy.gameplay;
    }
    if (facts[1]) {
      facts[1].querySelector("span").textContent = copy.genreLabel;
      facts[1].querySelector("strong").textContent = copy.genre;
    }
    if (faq) {
      faq.querySelector("h3").textContent = copy.faqTitle;
      faq.querySelector("dt").textContent = copy.faqQuestion;
      faq.querySelector("dd").textContent = copy.faqAnswer;
    }
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${copy.title} | WeightPlay`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", copy.description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", `${copy.title} | WeightPlay`);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", copy.description);
    const structured = document.querySelector('script[type="application/ld+json"]');
    if (structured) {
      try {
        const data = JSON.parse(structured.textContent);
        data.name = copy.title;
        data.description = copy.description;
        data.inLanguage = locale();
        structured.textContent = JSON.stringify(data, null, 2);
      } catch { /* Keep static metadata if the route contains invalid JSON-LD. */ }
    }
  };

  const syncCellLabels = () => {
    const board = document.querySelector("#logicBoard .logic-reversi-board");
    if (!board) return;
    const copy = CELL_LABELS[locale()] || CELL_LABELS.en;
    board.querySelectorAll("button").forEach((button, index) => {
      const row = Math.floor(index / 8) + 1;
      const col = (index % 8) + 1;
      button.setAttribute("aria-label", copy.replace("{row}", String(row)).replace("{col}", String(col)));
    });
  };

  const syncScenario = () => {
    const battle = document.querySelector("#logicBattle");
    const tutorial = document.querySelector("#logicTutorial");
    if (!battle || !tutorial || battle.hidden) return;
    syncCellLabels();
    const scenario = SCENARIOS[scenarioIndex % SCENARIOS.length];
    const copy = scenario.copy[locale()] || scenario.copy.en;
    if (tutorial.dataset.reversiScenario === scenario.key && tutorial.textContent === copy) return;
    tutorial.textContent = copy;
    tutorial.dataset.reversiScenario = scenario.key;
    tutorial.setAttribute("role", "note");
  };

  document.body.dataset.gameVersion = GAME_VERSION;
  document.body.dataset.interfaceVersion = "6";
  const start = document.querySelector("#startButton");
  const replay = document.querySelector("#resultReplay");
  if (start) start.addEventListener("click", () => {
    scenarioIndex = 0;
    setTimeout(syncScenario, 0);
  });
  if (replay) replay.addEventListener("click", () => {
    scenarioIndex = (scenarioIndex + 1) % SCENARIOS.length;
    setTimeout(syncScenario, 0);
  });
  const battle = document.querySelector("#logicBattle");
  if (battle) new MutationObserver(() => { syncScenario(); syncCellLabels(); }).observe(battle, { attributes: true, attributeFilter: ["hidden"], childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", syncGuide, { once: true });
  else syncGuide();
})();

// Reversi has no turn-history owner in the shared Logic Lab runtime. Remove
// the generic Undo affordance instead of presenting a recovery action that
// announces success while leaving the board unchanged.
const reversiUndo = document.querySelector("#logicUndo");
if (reversiUndo) {
  reversiUndo.hidden = true;
  reversiUndo.disabled = true;
  reversiUndo.setAttribute("aria-hidden", "true");
  reversiUndo.dataset.logicAction = "unsupported";
}
