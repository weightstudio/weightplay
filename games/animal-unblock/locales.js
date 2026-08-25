(() => {
  "use strict";

  const en = {
    label: "English",
    title: "Unblock Trail",
    shortTitle: "UNBLOCK",
    language: "Language",
    returnLobby: "Return to WeightPlay",
    back: "Back",
    coverAlt: "Panko moving trail blocks through a bamboo grove",
    heroName: "Panko",
    blockLabel: "Block {n}",
    boardLabel: "Unblock Trail game board",
    kicker: "PANKO'S SLIDE PUZZLE",
    summary:
      "Slide every block and guide the red explorer out through the gate.",
    start: "Start game",
    guideTitle: "How to play",
    guideBody:
      "Drag a block along its direction. Move the red explorer to the right exit. Thousands of deterministic trails are available.",
    choose: "CHOOSE A TRAIL",
    stageList: "Trail list",
    open: "Open trail",
    trail: "Trail {n}",
    progress: "{done}/30 cleared",
    locked: "Clear the previous trail first.",
    chapter: "CHAPTER {n}",
    moves: "{n} moves",
    exit: "Exit",
    hint: "Hint",
    hintMove: "Highlighted block: move {direction}.",
    directionLeft: "left",
    directionRight: "right",
    directionUp: "up",
    directionDown: "down",
    restart: "Restart",
    undo: "Undo",
    status:
      "Clear the right lane, then drag the red block into the glowing exit.",
    complete: "TRAIL CLEARED",
    resultTitle: "Panko escaped!",
    resultBody: "Trail {n} cleared in {moves} moves.",
    retry: "Play again",
    next: "Next trail",
    colors: ["mist", "stone", "mint", "sky", "sun"],
  };

  const zhHant = {
    label: "繁體中文",
    title: "解鎖滑塊",
    shortTitle: "解鎖滑塊",
    language: "語言",
    returnLobby: "返回 WeightPlay",
    back: "返回",
    coverAlt: "熊貓角色在竹林中移動方塊開路",
    heroName: "Panko",
    blockLabel: "方塊 {n}",
    boardLabel: "暢通小徑遊戲盤",
    kicker: "PANKO 的滑塊拼圖",
    summary: "滑動每個方塊，帶領紅色探險家穿過出口。",
    start: "開始遊戲",
    guideTitle: "遊戲玩法",
    guideBody:
      "沿著方塊可移動的方向拖曳。將紅色探險家移到右側出口。遊戲提供數千條可重現的小徑。",
    choose: "選擇一條小徑",
    stageList: "小徑列表",
    open: "開啟小徑",
    trail: "小徑 {n}",
    progress: "已通關 {done}/30",
    locked: "請先完成上一條小徑。",
    chapter: "第 {n} 章",
    moves: "{n} 步",
    exit: "出口",
    hint: "提示",
    restart: "重新開始",
    undo: "復原",
    status: "清出右側路線，再把紅色方塊拖進發光出口。",
    complete: "小徑已通關",
    resultTitle: "紅色探險家成功脫困！",
    resultBody: "小徑 {n} 以 {moves} 步通關。",
    retry: "再玩一次",
    next: "下一條小徑",
    colors: ["薄霧", "岩石", "薄荷", "天空", "陽光"],
  };

  const ar = {
    label: "العربية",
    title: "افتح المسار",
    shortTitle: "افتح المسار",
    language: "اللغة",
    returnLobby: "العودة إلى WeightPlay",
    back: "رجوع",
    coverAlt: "بانكو يحرك كتل المسار عبر بستان من الخيزران",
    heroName: "بانكو",
    blockLabel: "الكتلة {n}",
    boardLabel: "لوحة لعبة فتح المسار",
    kicker: "لغز بانكو بالكتل المنزلقة",
    summary: "حرّك كل كتلة وساعد المستكشف الأحمر على الخروج عبر البوابة.",
    start: "ابدأ اللعبة",
    guideTitle: "طريقة اللعب",
    guideBody:
      "اسحب كل كتلة على محورها. حرّك المستكشف الأحمر إلى المخرج الأيمن. تضم اللعبة مسارات محددة يمكن إعادة لعبها.",
    choose: "اختر مسارًا",
    stageList: "قائمة المسارات",
    open: "فتح المسار",
    trail: "المسار {n}",
    progress: "تم اجتياز {done}/30",
    locked: "أكمل المسار السابق أولًا.",
    chapter: "الفصل {n}",
    moves: "{n} حركات",
    exit: "المخرج",
    hint: "تلميح",
    hintMove: "الكتلة المميزة: حرّكها إلى {direction}.",
    directionLeft: "اليسار",
    directionRight: "اليمين",
    directionUp: "الأعلى",
    directionDown: "الأسفل",
    restart: "إعادة البدء",
    undo: "تراجع",
    status: "افتح المسار الأيمن، ثم حرّك الكتلة الحمراء إلى المخرج المضيء.",
    complete: "اكتمل المسار",
    resultTitle: "نجا بانكو!",
    resultBody: "اكتمل المسار {n} خلال {moves} حركات.",
    retry: "العب مرة أخرى",
    next: "المسار التالي",
    colors: ["ضباب", "حجر", "نعناع", "سماء", "شمس"],
  };

  const labels = {
    en: "English",
    "zh-Hant": "繁體中文",
    "zh-Hans": "简体中文",
    ja: "日本語",
    ko: "한국어",
    es: "Español",
    "pt-BR": "Português",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    ru: "Русский",
    hi: "हिन्दी",
    ar: "العربية",
  };

  const locales = Object.fromEntries(
    Object.entries(labels).map(([code, label]) => [code, { ...en, label }]),
  );
  locales["zh-Hant"] = { ...en, ...zhHant };
  locales.ar = { ...en, ...ar };
  const firstResponseLocalization = {
    "zh-Hant": {
      summary: "滑動每個方塊，帶領紅色探險家穿過出口。",
      progress: "已通關 {done}/30",
    },
    "zh-Hans": {
      summary: "滑动每个方块，带领红色探险家穿过出口。",
      progress: "已通关 {done}/30",
    },
    ja: {
      summary:
        "横向きと縦向きのブロックをそれぞれの軸に沿って動かし、赤い探検家が出口へ進める道を作りましょう。",
      progress: "{done}/30 クリア",
    },
    ar: {
      summary: "حرّك كل كتلة وساعد المستكشف الأحمر على الخروج عبر البوابة.",
      progress: "تم اجتياز {done}/30",
    },
    es: {
      summary:
        "Desliza los bloques horizontales y verticales a lo largo de sus propios ejes hasta que el explorador rojo tenga un camino despejado hasta la salida.",
      progress: "{done}/30 completados",
    },
    de: {
      summary:
        "Schiebe waagerechte und senkrechte Blöcke entlang ihrer eigenen Achse, bis der rote Entdecker einen freien Weg zum Ausgang hat.",
      progress: "{done}/30 geschafft",
    },
    fr: {
      summary:
        "Faites glisser les blocs horizontaux et verticaux le long de leur axe jusqu’à ce que l’explorateur rouge ait un passage libre vers la sortie.",
      progress: "{done}/30 terminés",
    },
    hi: {
      summary:
        "क्षैतिज और ऊर्ध्वाधर ब्लॉकों को उनकी अपनी दिशा में खिसकाएँ, जब तक लाल खोजकर्ता को निकास तक साफ़ रास्ता न मिल जाए।",
      progress: "{done}/30 पूरे",
    },
    it: {
      summary:
        "Sposta i blocchi orizzontali e verticali lungo il loro asse finché l'esploratore rosso non avrà una via libera verso l'uscita.",
      progress: "{done}/30 completati",
    },
    ko: {
      summary:
        "가로 및 세로 블록을 각자의 축을 따라 밀어 빨간 탐험가가 출구로 나갈 길을 만드세요.",
      progress: "{done}/30 클리어",
    },
    "pt-BR": {
      summary:
        "Deslize os blocos horizontais e verticais ao longo de seus próprios eixos até que o explorador vermelho tenha um caminho livre para a saída.",
      progress: "{done}/30 concluídas",
    },
    ru: {
      summary:
        "Передвигайте горизонтальные и вертикальные блоки вдоль их осей, пока красный исследователь не получит свободный путь к выходу.",
      progress: "Пройдено: {done}/30",
    },
  };
  Object.entries(firstResponseLocalization).forEach(([code, copy]) => {
    Object.assign(locales[code], copy);
  });
  const hintLocalization = {
    "zh-Hant": ["已標示方塊：請向{direction}移動。", "左", "右", "上", "下"],
    "zh-Hans": ["已高亮方块：请向{direction}移动。", "左", "右", "上", "下"],
    ja: ["強調されたブロックを{direction}へ動かしてください。", "左", "右", "上", "下"],
    ko: ["강조된 블록을 {direction}쪽으로 움직이세요.", "왼쪽", "오른쪽", "위", "아래"],
    es: ["Mueve el bloque resaltado hacia la {direction}.", "izquierda", "derecha", "parte superior", "parte inferior"],
    "pt-BR": ["Mova o bloco destacado para a {direction}.", "esquerda", "direita", "cima", "baixo"],
    fr: ["Déplacez le bloc en surbrillance vers la {direction}.", "gauche", "droite", "haut", "bas"],
    de: ["Bewege den markierten Block nach {direction}.", "links", "rechts", "oben", "unten"],
    it: ["Sposta il blocco evidenziato verso {direction}.", "sinistra", "destra", "l’alto", "il basso"],
    ru: ["Переместите выделенный блок {direction}.", "влево", "вправо", "вверх", "вниз"],
    hi: ["हाइलाइट किए गए ब्लॉक को {direction} ले जाएँ।", "बाएँ", "दाएँ", "ऊपर", "नीचे"],
    ar: ["حرّك القطعة المميزة إلى {direction}.", "اليسار", "اليمين", "الأعلى", "الأسفل"]
  };
  Object.entries(hintLocalization).forEach(([code, values]) => {
    Object.assign(locales[code], {
      hintMove: values[0],
      directionLeft: values[1],
      directionRight: values[2],
      directionUp: values[3],
      directionDown: values[4],
    });
  });
  const resultMasteryLocalization = {
    en: {
      resultFirstBest: "New local best: {best} moves. Try to beat it next time.",
      resultImprovedBest: "New local best: {best} moves (previously {previous}).",
      resultBest: "Local best: {best} moves. Try to beat it.",
      resultTarget: "Next replay target: repeat or beat {target} moves.",
    },
    "zh-Hant": {
      resultFirstBest: "本機新紀錄：{best} 步。下次試著用更少步數通關。",
      resultImprovedBest: "本機新紀錄：{best} 步（原本 {previous} 步）。",
      resultBest: "本機最佳：{best} 步。試著打破它吧。",
      resultTarget: "下次重玩目標：重現或突破 {target} 步。",
    },
    "zh-Hans": {
      resultFirstBest: "本地新纪录：{best} 步。下次试试更少步数。",
      resultImprovedBest: "本地新纪录：{best} 步（原来是 {previous} 步）。",
      resultBest: "本地最佳：{best} 步。试着打破它吧。",
      resultTarget: "下次重玩目标：重现或突破 {target} 步。",
    },
    ja: {
      resultFirstBest: "自己ベスト更新：{best}手。次はこれより少ない手数に挑戦しましょう。",
      resultImprovedBest: "自己ベスト更新：{best}手（以前は{previous}手）。",
      resultBest: "自己ベストは{best}手です。記録更新に挑戦しましょう。",
      resultTarget: "次のリプレイ目標：{target}手を再現するか、更新しましょう。",
    },
    ko: {
      resultFirstBest: "로컬 최고 기록: {best}회. 다음에는 더 적은 수에 도전해 보세요.",
      resultImprovedBest: "로컬 최고 기록 갱신: {best}회 (이전 {previous}회).",
      resultBest: "로컬 최고 기록은 {best}회입니다. 기록을 깨 보세요.",
      resultTarget: "다음 다시 하기 목표: {target}회를 재현하거나 기록을 깨 보세요.",
    },
    es: {
      resultFirstBest: "Nuevo mejor registro local: {best} movimientos. Intenta superarlo la próxima vez.",
      resultImprovedBest: "Nuevo mejor registro local: {best} movimientos (antes {previous}).",
      resultBest: "Mejor registro local: {best} movimientos. Intenta superarlo.",
      resultTarget: "Próximo objetivo: repite o mejora el resultado de {target} movimientos.",
    },
    "pt-BR": {
      resultFirstBest: "Novo recorde local: {best} movimentos. Tente superá-lo na próxima vez.",
      resultImprovedBest: "Novo recorde local: {best} movimentos (antes {previous}).",
      resultBest: "Recorde local: {best} movimentos. Tente superá-lo.",
      resultTarget: "Próximo objetivo: repita ou supere as {target} jogadas.",
    },
    fr: {
      resultFirstBest: "Nouveau meilleur score local : {best} coups. Essayez de faire mieux la prochaine fois.",
      resultImprovedBest: "Nouveau meilleur score local : {best} coups (contre {previous} avant).",
      resultBest: "Meilleur score local : {best} coups. Essayez de le battre.",
      resultTarget: "Prochain objectif : refaire ou améliorer les {target} coups.",
    },
    de: {
      resultFirstBest: "Neuer lokaler Bestwert: {best} Züge. Schaffst du beim nächsten Mal weniger?",
      resultImprovedBest: "Neuer lokaler Bestwert: {best} Züge (zuvor {previous}).",
      resultBest: "Lokaler Bestwert: {best} Züge. Versuch, ihn zu schlagen.",
      resultTarget: "Nächstes Ziel: {target} Züge wiederholen oder unterbieten.",
    },
    it: {
      resultFirstBest: "Nuovo record locale: {best} mosse. Prova a superarlo la prossima volta.",
      resultImprovedBest: "Nuovo record locale: {best} mosse (prima {previous}).",
      resultBest: "Record locale: {best} mosse. Prova a batterlo.",
      resultTarget: "Prossimo obiettivo: ripeti o migliora le {target} mosse.",
    },
    ru: {
      resultFirstBest: "Новый личный рекорд: {best} ходов. В следующий раз попробуйте сделать меньше.",
      resultImprovedBest: "Новый личный рекорд: {best} ходов (раньше {previous}).",
      resultBest: "Личный рекорд: {best} ходов. Попробуйте его улучшить.",
      resultTarget: "Следующая цель: повторить результат в {target} ходов или улучшить его.",
    },
    hi: {
      resultFirstBest: "नया स्थानीय सर्वश्रेष्ठ: {best} चालें। अगली बार इसे हराने की कोशिश करें।",
      resultImprovedBest: "स्थानीय सर्वश्रेष्ठ नया: {best} चालें (पहले {previous})।",
      resultBest: "स्थानीय सर्वश्रेष्ठ: {best} चालें। इसे हराने की कोशिश करें।",
      resultTarget: "अगला लक्ष्य: {target} चालों का परिणाम दोहराएँ या बेहतर करें।",
    },
    ar: {
      resultFirstBest: "أفضل نتيجة محلية جديدة: {best} حركات. حاول تحطيمها في المرة القادمة.",
      resultImprovedBest: "أفضل نتيجة محلية جديدة: {best} حركات (السابق {previous}).",
      resultBest: "أفضل نتيجة محلية: {best} حركات. حاول تحطيمها.",
      resultTarget: "الهدف التالي: كرّر نتيجة {target} حركات أو حسّنها.",
    },
  };
  Object.entries(resultMasteryLocalization).forEach(([code, copy]) => {
    Object.assign(locales[code], copy);
  });
  const challengePreviewLocalization = {
    en: {
      previewLong: "Long blocker",
      previewNarrow: "Narrow exit lane",
      previewMultiStep: "Multi-step clearance",
      previewCompact: "Compact blocker layout",
      previewLayered: "Layered clearance",
      nextPreview: "Next trail shape: {preview}. The board stays unknown until you enter it.",
    },
    "zh-Hant": {
      previewLong: "長形阻擋塊",
      previewNarrow: "狹窄出口路線",
      previewMultiStep: "多步清障",
      previewCompact: "緊湊阻擋配置",
      previewLayered: "分層清障",
      nextPreview: "下一條小徑特徵：{preview}。進入前不會揭示棋盤。",
    },
    "zh-Hans": {
      previewLong: "长形阻挡块",
      previewNarrow: "狭窄出口路线",
      previewMultiStep: "多步清障",
      previewCompact: "紧凑阻挡配置",
      previewLayered: "分层清障",
      nextPreview: "下一条小径特征：{preview}。进入前不会揭示棋盘。",
    },
    ja: {
      previewLong: "長いブロック",
      previewNarrow: "狭い出口レーン",
      previewMultiStep: "複数段階の排除",
      previewCompact: "コンパクトなブロック配置",
      previewLayered: "段階的な排除",
      nextPreview: "次の小径の特徴：{preview}。入るまで盤面は表示しません。",
    },
    ko: {
      previewLong: "긴 블록",
      previewNarrow: "좁은 탈출 레인",
      previewMultiStep: "여러 단계의 정리",
      previewCompact: "간결한 블록 배치",
      previewLayered: "단계적인 정리",
      nextPreview: "다음 트레일의 형태: {preview}. 들어가기 전에는 보드를 공개하지 않습니다.",
    },
    es: {
      previewLong: "Bloque largo",
      previewNarrow: "Carril de salida estrecho",
      previewMultiStep: "Despeje en varios pasos",
      previewCompact: "Distribución compacta de bloques",
      previewLayered: "Despeje por capas",
      nextPreview: "Forma del próximo sendero: {preview}. El tablero permanece oculto hasta entrar.",
    },
    "pt-BR": {
      previewLong: "Bloco longo",
      previewNarrow: "Faixa de saída estreita",
      previewMultiStep: "Desobstrução em várias etapas",
      previewCompact: "Formação compacta de blocos",
      previewLayered: "Desobstrução em camadas",
      nextPreview: "Formato da próxima trilha: {preview}. O tabuleiro continua oculto até você entrar.",
    },
    fr: {
      previewLong: "Bloc long",
      previewNarrow: "Voie de sortie étroite",
      previewMultiStep: "Dégagement en plusieurs étapes",
      previewCompact: "Disposition compacte des blocs",
      previewLayered: "Dégagement par couches",
      nextPreview: "Forme du prochain sentier : {preview}. Le plateau reste caché jusqu'à l'entrée.",
    },
    de: {
      previewLong: "Langer Block",
      previewNarrow: "Enge Ausfahrt",
      previewMultiStep: "Mehrstufiges Freiräumen",
      previewCompact: "Kompakte Blockanordnung",
      previewLayered: "Gestaffeltes Freiräumen",
      nextPreview: "Form des nächsten Pfads: {preview}. Das Brett bleibt verborgen, bis du ihn öffnest.",
    },
    it: {
      previewLong: "Blocco lungo",
      previewNarrow: "Corsia d'uscita stretta",
      previewMultiStep: "Sblocco in più passaggi",
      previewCompact: "Disposizione compatta dei blocchi",
      previewLayered: "Sblocco a strati",
      nextPreview: "Forma del prossimo percorso: {preview}. La tavola resta nascosta finché non entri.",
    },
    ru: {
      previewLong: "Длинный блок",
      previewNarrow: "Узкий путь к выходу",
      previewMultiStep: "Многоэтапное освобождение",
      previewCompact: "Компактная расстановка блоков",
      previewLayered: "Многоуровневое освобождение",
      nextPreview: "Форма следующей тропы: {preview}. Поле скрыто, пока вы не войдёте.",
    },
    hi: {
      previewLong: "लंबा ब्लॉक",
      previewNarrow: "संकीर्ण निकास मार्ग",
      previewMultiStep: "कई चरणों में रास्ता साफ़ करना",
      previewCompact: "सघन ब्लॉक व्यवस्था",
      previewLayered: "परतों में रास्ता साफ़ करना",
      nextPreview: "अगली पगडंडी का आकार: {preview}। प्रवेश करने तक बोर्ड छिपा रहेगा।",
    },
    ar: {
      previewLong: "كتلة طويلة",
      previewNarrow: "ممر خروج ضيق",
      previewMultiStep: "إخلاء متعدد الخطوات",
      previewCompact: "ترتيب كتل متراص",
      previewLayered: "إخلاء على مراحل",
      nextPreview: "شكل المسار التالي: {preview}. ستبقى اللوحة مخفية حتى تدخل إليه.",
    },
  };
  Object.entries(challengePreviewLocalization).forEach(([code, copy]) => {
    Object.assign(locales[code], copy);
  });
  window.UNBLOCK_LOCALES = locales;
})();
