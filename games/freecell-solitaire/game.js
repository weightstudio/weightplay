(function () {
  "use strict";
  const SEQUENCE_CUE = {
    en: "Sequence opened: {count} cards moved together.",
    "zh-Hant": "順序打開了：{count} 張牌一起移動。",
    "zh-Hans": "顺序展开了：{count} 张牌一起移动。",
    ja: "連続が開きました：{count}枚のカードをまとめて移動。",
    ko: "연속 카드가 열렸습니다: {count}장을 함께 이동했어요.",
    es: "Secuencia abierta: {count} cartas movidas juntas.",
    "pt-BR": "Sequência aberta: {count} cartas movidas juntas.",
    fr: "Suite ouverte : {count} cartes déplacées ensemble.",
    de: "Folge geöffnet: {count} Karten gemeinsam bewegt.",
    it: "Sequenza aperta: {count} carte mosse insieme.",
    ru: "Цепочка открыта: {count} карт перемещено вместе.",
    hi: "क्रम खुला: {count} कार्ड साथ ले जाए गए।",
    ar: "تم فتح التسلسل: نُقلت {count} بطاقات معًا.",
  };
  const FREECELL_PROGRESS_LABEL = {
    en: "Goal",
    "zh-Hant": "目標",
    "zh-Hans": "目标",
    ja: "目標",
    ko: "목표",
    es: "Objetivo",
    "pt-BR": "Objetivo",
    fr: "Objectif",
    de: "Ziel",
    it: "Obiettivo",
    ru: "Цель",
    hi: "लक्ष्य",
    ar: "الهدف",
  };
  const FREECELL_FOUNDATION_PROGRESS_LABEL = {
    en: "Foundations",
    "zh-Hant": "牌堆進度",
    "zh-Hans": "基础牌堆",
    ja: "ファンデーション進捗",
    ko: "파운데이션 진행",
    es: "Progreso de bases",
    "pt-BR": "Progresso das fundações",
    fr: "Progression des fondations",
    de: "Foundation-Fortschritt",
    it: "Progresso delle fondazioni",
    ru: "Прогресс оснований",
    hi: "फाउंडेशन प्रगति",
    ar: "تقدم الأساسات",
  };
  const FREECELL_FOUNDATION_PROGRESS_COPY = {
    en: "{label}: {foundation}/52 · {remaining} cards left",
    "zh-Hant": "{label}：{foundation}/52・剩餘 {remaining} 張",
    "zh-Hans": "{label}：{foundation}/52・剩余 {remaining} 张",
    ja: "{label}：{foundation}/52・残り{remaining}枚",
    ko: "{label}: {foundation}/52 · 남은 카드 {remaining}장",
    es: "{label}: {foundation}/52 · quedan {remaining} cartas",
    "pt-BR": "{label}: {foundation}/52 · {remaining} cartas restantes",
    fr: "{label} : {foundation}/52 · {remaining} cartes restantes",
    de: "{label}: {foundation}/52 · {remaining} Karten übrig",
    it: "{label}: {foundation}/52 · {remaining} carte",
    ru: "{label}: {foundation}/52 · осталось карт: {remaining}",
    hi: "{label}: {foundation}/52 · {remaining} कार्ड शेष",
    ar: "{label}: {foundation}/52 · تبقى {remaining} بطاقة",
  };
  const FREECELL_RESULT_NEXT_STEP_COPY = {
    en: "Next: choose Restart to replay this deal or New Game for a fresh deal.",
    "zh-Hant": "下一步：選「重新開始」重玩這個牌局，或選「新遊戲」開始新牌局。",
    "zh-Hans": "下一步：选择“重新开始”重玩这副牌，或选择“新游戏”开始新牌局。",
    ja: "次へ：「Restart」でこのディールを再挑戦するか、「新しいゲーム」で新しいディールを始めます。",
    ko: "다음: 다시 시작으로 이 딜을 다시 플레이하거나 새 게임으로 새 딜을 시작하세요.",
    es: "Siguiente: elige Reiniciar para repetir este reparto o Nueva partida para uno nuevo.",
    "pt-BR": "Próximo passo: escolha Reiniciar para repetir esta distribuição ou Novo jogo para uma nova.",
    fr: "Ensuite : choisissez Recommencer pour rejouer cette donne ou Nouvelle partie pour en commencer une autre.",
    de: "Nächster Schritt: Mit Neustart diese Runde wiederholen oder ein neues Spiel beginnen.",
    it: "Poi: scegli Riavvia per ripetere questa mano o Nuova partita per iniziarne una nuova.",
    ru: "Дальше: нажмите «Начать заново», чтобы повторить сдачу, или «Новая игра» для новой.",
    hi: "अगला कदम: इस डील को फिर खेलने के लिए फिर शुरू करें या नया खेल शुरू करें।",
    ar: "الخطوة التالية: اختر إعادة البدء لإعادة هذه التوزيعة أو لعبة جديدة لبدء توزيعة جديدة.",
  };
  const FREECELL_BATTLE_SOUND_COPY = {
    en: { on: "Sound: On", off: "Sound: Off" },
    "zh-Hant": { on: "音效：開", off: "音效：關" },
    "zh-Hans": { on: "音效：开", off: "音效：关" },
    ja: { on: "効果音：オン", off: "効果音：オフ" },
    ko: { on: "효과음: 켬", off: "효과음: 끔" },
    es: { on: "Sonido: activado", off: "Sonido: desactivado" },
    "pt-BR": { on: "Som: ligado", off: "Som: desligado" },
    fr: { on: "Son : activé", off: "Son : désactivé" },
    de: { on: "Ton: an", off: "Ton: aus" },
    it: { on: "Suono: attivo", off: "Suono: disattivo" },
    ru: { on: "Звук: вкл.", off: "Звук: выкл." },
    hi: { on: "ध्वनि: चालू", off: "ध्वनि: बंद" },
    ar: { on: "الصوت: مفعّل", off: "الصوت: متوقف" },
  };
  const FREECELL_HINT_CUE = {
    en: "Hint: the highlighted card is selected; tap a numbered destination.",
    "zh-Hant": "提示：反白牌已選取；請點編號目的地。",
    "zh-Hans": "提示：高亮牌已选取；请点击编号目的地。",
    ja: "ヒント：ハイライトされたカードが選択されています。番号付きの移動先をタップします。",
    ko: "힌트: 강조된 카드가 선택되었습니다. 번호가 표시된 목적지를 누르세요.",
    es: "Pista: la carta resaltada ya está seleccionada; toca un destino numerado.",
    "pt-BR": "Dica: a carta destacada já está selecionada; toque em um destino numerado.",
    fr: "Indice : la carte en surbrillance est sélectionnée ; touchez une destination numérotée.",
    de: "Tipp: Die hervorgehobene Karte ist ausgewählt; wähle ein nummeriertes Ziel.",
    it: "Suggerimento: la carta evidenziata è selezionata; tocca una destinazione numerata.",
    ru: "Подсказка: выделенная карта уже выбрана; нажмите пронумерованную цель.",
    hi: "संकेत: हाइलाइट किया गया कार्ड चुना गया है; क्रमांकित लक्ष्य पर टैप करें।",
    ar: "تلميح: البطاقة المميزة محددة؛ اضغط وجهة مرقمة.",
  };
  const FREECELL_HINT_DESTINATION = {
    en: "Hint destination {index}",
    "zh-Hant": "提示目的地 {index}",
    "zh-Hans": "提示目的地 {index}",
    ja: "ヒントの移動先 {index}",
    ko: "힌트 목적지 {index}",
    es: "Destino de la pista {index}",
    "pt-BR": "Destino da dica {index}",
    fr: "Destination de l’indice {index}",
    de: "Tippziel {index}",
    it: "Destinazione del suggerimento {index}",
    ru: "Цель подсказки {index}",
    hi: "संकेत लक्ष्य {index}",
    ar: "وجهة التلميح {index}",
  };
  const FREECELL_CAPACITY_COPY = {
    en: {
      closedCapacityOne: "Move capacity: {capacity} card · 0 Free Cells open. Open a column to multiply it.",
      closedOne: "Move capacity: {capacity} cards · 1 Free Cell open. Open a column to multiply it.",
      closedMany: "Move capacity: {capacity} cards · {cells} Free Cells open. Open a column to multiply it.",
      open: "Move capacity: {built} to an occupied column · {empty} to an empty column ({cells} cells / {columns} columns open).",
    },
    "zh-Hant": {
      closedCapacityOne: "搬牌容量：{capacity} 張・可用暫存格 0 個。打通空欄可倍增容量。",
      closedOne: "搬牌容量：{capacity} 張・可用暫存格 1 個。打通空欄可倍增容量。",
      closedMany: "搬牌容量：{capacity} 張・可用暫存格 {cells} 個。打通空欄可倍增容量。",
      open: "搬牌容量：一般目的地 {built} 張・空欄目的地 {empty} 張（暫存格 {cells}／空欄 {columns}）。",
    },
    "zh-Hans": {
      closedCapacityOne: "移牌容量：{capacity} 张・可用暂存格 0 个。打通空列可倍增容量。",
      closedOne: "移牌容量：{capacity} 张・可用暂存格 1 个。打通空列可倍增容量。",
      closedMany: "移牌容量：{capacity} 张・可用暂存格 {cells} 个。打通空列可倍增容量。",
      open: "移牌容量：一般目标 {built} 张・空列目标 {empty} 张（暂存格 {cells}／空列 {columns}）。",
    },
    ja: {
      closedCapacityOne: "移動容量：{capacity}枚・空きフリーセル 0個。空列を作ると容量が倍増します。",
      closedOne: "移動容量：{capacity}枚・空きフリーセル 1個。空列を作ると容量が倍増します。",
      closedMany: "移動容量：{capacity}枚・空きフリーセル {cells}個。空列を作ると容量が倍増します。",
      open: "移動容量：通常列へ {built}枚・空列へ {empty}枚（空きセル {cells}／空列 {columns}）。",
    },
    ko: {
      closedCapacityOne: "이동 용량: {capacity}장 · 빈 프리 셀 0개. 빈 열을 만들면 용량이 늘어납니다.",
      closedOne: "이동 용량: {capacity}장 · 빈 프리 셀 1개. 빈 열을 만들면 용량이 늘어납니다.",
      closedMany: "이동 용량: {capacity}장 · 빈 프리 셀 {cells}개. 빈 열을 만들면 용량이 늘어납니다.",
      open: "이동 용량: 일반 열 {built}장 · 빈 열 {empty}장 (빈 셀 {cells} / 빈 열 {columns}).",
    },
    es: {
      closedCapacityOne: "Capacidad: {capacity} carta · 0 celdas libres. Abre una columna para multiplicarla.",
      closedOne: "Capacidad: {capacity} cartas · 1 celda libre. Abre una columna para multiplicarla.",
      closedMany: "Capacidad: {capacity} cartas · {cells} celdas libres. Abre una columna para multiplicarla.",
      open: "Capacidad: {built} a una columna ocupada · {empty} a una vacía ({cells} celdas / {columns} columnas libres).",
    },
    "pt-BR": {
      closedCapacityOne: "Capacidade: {capacity} carta · 0 células livres. Abra uma coluna para multiplicá-la.",
      closedOne: "Capacidade: {capacity} cartas · 1 célula livre. Abra uma coluna para multiplicá-la.",
      closedMany: "Capacidade: {capacity} cartas · {cells} células livres. Abra uma coluna para multiplicá-la.",
      open: "Capacidade: {built} para coluna ocupada · {empty} para vazia ({cells} células / {columns} colunas livres).",
    },
    fr: {
      closedCapacityOne: "Capacité : {capacity} carte · 0 cellules libres. Libérez une colonne pour la multiplier.",
      closedOne: "Capacité : {capacity} cartes · 1 cellule libre. Libérez une colonne pour la multiplier.",
      closedMany: "Capacité : {capacity} cartes · {cells} cellules libres. Libérez une colonne pour la multiplier.",
      open: "Capacité : {built} vers une colonne occupée · {empty} vers une vide ({cells} cellules / {columns} colonnes libres).",
    },
    de: {
      closedCapacityOne: "Zugkapazität: {capacity} Karte · 0 freie Felder. Eine leere Spalte vervielfacht sie.",
      closedOne: "Zugkapazität: {capacity} Karten · 1 freies Feld. Eine leere Spalte vervielfacht sie.",
      closedMany: "Zugkapazität: {capacity} Karten · {cells} freie Felder. Eine leere Spalte vervielfacht sie.",
      open: "Zugkapazität: {built} auf belegte · {empty} auf leere Spalte ({cells} Felder / {columns} Spalten frei).",
    },
    it: {
      closedCapacityOne: "Capacità: {capacity} carta · 0 celle libere. Libera una colonna per moltiplicarla.",
      closedOne: "Capacità: {capacity} carte · 1 cella libera. Libera una colonna per moltiplicarla.",
      closedMany: "Capacità: {capacity} carte · {cells} celle libere. Libera una colonna per moltiplicarla.",
      open: "Capacità: {built} su colonna occupata · {empty} su vuota ({cells} celle / {columns} colonne libere).",
    },
    ru: {
      closedCapacityOne: "Вместимость хода: {capacity} карта · свободных ячеек: 0. Пустой столбец увеличит её.",
      closedOne: "Вместимость хода: {capacity} карт · свободная ячейка: 1. Пустой столбец увеличит её.",
      closedMany: "Вместимость хода: {capacity} карт · свободных ячеек: {cells}. Пустой столбец увеличит её.",
      open: "Вместимость: {built} в занятый · {empty} в пустой столбец (ячеек {cells} / столбцов {columns}).",
    },
    hi: {
      closedCapacityOne: "चाल क्षमता: {capacity} कार्ड · 0 खाली सेल। खाली कॉलम इसे बढ़ाता है।",
      closedOne: "चाल क्षमता: {capacity} कार्ड · 1 खाली सेल। खाली कॉलम इसे बढ़ाता है।",
      closedMany: "चाल क्षमता: {capacity} कार्ड · {cells} खाली सेल। खाली कॉलम इसे बढ़ाता है।",
      open: "चाल क्षमता: भरे कॉलम पर {built} · खाली कॉलम पर {empty} ({cells} सेल / {columns} कॉलम खाली)।",
    },
    ar: {
      closedCapacityOne: "سعة النقل: {capacity} بطاقة · 0 خلايا حرة. افتح عمودًا لمضاعفتها.",
      closedOne: "سعة النقل: {capacity} بطاقات · خلية حرة واحدة. افتح عمودًا لمضاعفتها.",
      closedMany: "سعة النقل: {capacity} بطاقات · {cells} خلايا حرة. افتح عمودًا لمضاعفتها.",
      open: "سعة النقل: {built} إلى عمود مشغول · {empty} إلى عمود فارغ ({cells} خلايا / {columns} أعمدة حرة).",
    },
  };
  const FREECELL_OPEN_COLUMN_CUE = {
    en: "Open Column {source} by moving its full stack to Column {destination}; the extra space multiplies capacity.",
    "zh-Hant": "將第 {source} 欄的整疊牌移到第 {destination} 欄，打開空欄就能倍增容量。",
    "zh-Hans": "将第 {source} 列的整叠牌移到第 {destination} 列，打开空列就能增加容量。",
    ja: "第{source}列の一連の山を第{destination}列へ移すと、空き列ができて容量が増えます。",
    ko: "전체 묶음을 {source}번 열에서 {destination}번 열로 옮기면 빈 열이 생겨 이동 용량이 늘어납니다.",
    es: "Mueve toda la columna {source} a la columna {destination} para abrir un espacio y multiplicar la capacidad.",
    "pt-BR": "Mova toda a coluna {source} para a coluna {destination} para abrir um espaço e multiplicar a capacidade.",
    fr: "Déplacez toute la colonne {source} vers la colonne {destination} pour libérer un espace et multiplier la capacité.",
    de: "Verschiebe die ganze Spalte {source} auf Spalte {destination}, um Platz zu öffnen und die Kapazität zu vervielfachen.",
    it: "Sposta l'intera colonna {source} sulla colonna {destination} per aprire uno spazio e moltiplicare la capacità.",
    ru: "Переместите весь столбец {source} в столбец {destination}, чтобы открыть место и увеличить вместимость.",
    hi: "पूरे कॉलम {source} को कॉलम {destination} पर ले जाएँ, ताकि जगह खुले और चाल क्षमता बढ़े।",
    ar: "انقل العمود {source} كاملًا إلى العمود {destination} لفتح مساحة وزيادة سعة النقل.",
  };
  const view = window.WPClassicSolitaire?.mount({ variant: "freecell", id: "freecell-solitaire", sequenceCue: SEQUENCE_CUE });
  const battleSoundToggle = document.getElementById("soundToggleBattle");
  const refreshFreecellHeaderCopy = () => {
    const locale = view?.locale || "en";
    const progressLabel = document.getElementById("mainProgressLabel");
    const progressText = document.querySelector("#mainProgress [data-copy=target]");
    if (progressLabel) progressLabel.textContent = FREECELL_PROGRESS_LABEL[locale] || FREECELL_PROGRESS_LABEL.en;
    if (progressText) progressText.textContent = view?.variantCopy?.().target || "Build four suit foundations from Ace to King using eight open columns and four temporary cells.";
    if (!battleSoundToggle) return;
    const copy = FREECELL_BATTLE_SOUND_COPY[locale] || FREECELL_BATTLE_SOUND_COPY.en;
    const label = view?.audio?.enabled ? copy.on : copy.off;
    battleSoundToggle.textContent = label;
    battleSoundToggle.setAttribute("aria-label", label);
    battleSoundToggle.setAttribute("aria-pressed", String(Boolean(view?.audio?.enabled)));
  };
  battleSoundToggle?.addEventListener("click", () => {
    if (!view?.audio) return;
    view.audio.setEnabled(!view.audio.enabled);
    view.refreshSound?.();
    refreshFreecellHeaderCopy();
  });
  view?.nodes?.localeSelect?.addEventListener("change", () => window.requestAnimationFrame(() => {
    refreshFreecellHeaderCopy();
    refreshFreecellOutcomeCopy();
  }));
  window.addEventListener("wonder:locale-change", () => {
    refreshFreecellHeaderCopy();
    refreshFreecellOutcomeCopy();
  });
  refreshFreecellHeaderCopy();
  const hintCueState = { active: false, moves: 0, timer: 0 };
  const ANALYTICS_EVENT = "wp-freecell-analytics";
  const INPUT_TYPES = new Set(["mouse", "touch", "pen", "keyboard", "unknown"]);
  const inputTypeFromEvent = (event) => {
    if (event?.type === "keydown") return "keyboard";
    if (event?.pointerType === "touch") return "touch";
    if (event?.pointerType === "pen") return "pen";
    if (event?.pointerType === "mouse") return "mouse";
    return "unknown";
  };
  const emitAnalytics = (event, detail = {}) => {
    try {
      window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT, { detail: { event, ...detail } }));
    } catch {
      // Measurement must never interrupt a player action or alter game state.
    }
  };
  const bounded = (value, max) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.min(max, Math.floor(number))) : 0;
  };
  const safeInputType = (value) => INPUT_TYPES.has(value) ? value : "unknown";
  let lastInputType = "unknown";
  const snapshot = () => {
    const game = view?.game;
    if (!game) return null;
    const foundationCards = game.foundations.reduce((total, foundation) => total + foundation.cards.length, 0);
    const tableauCards = game.tableau.reduce((total, pile) => total + pile.length, 0);
    const freeCellCards = game.freeCells.filter(Boolean).length;
    return {
      seed: game.seed,
      moves: game.moves,
      won: Boolean(game.won),
      lost: Boolean(game.lost),
      foundationCards,
      foundationCompleteCount: game.foundations.filter((foundation) => foundation.cards.length >= 13).length,
      tableauCards,
      tableauPileLengths: game.tableau.map((pile) => pile.length),
      freeCellCards,
      remainingCards: bounded(tableauCards + freeCellCards, 52),
    };
  };
  const copyWithValues = (template, values) => Object.entries(values)
    .reduce((output, [key, value]) => output.replaceAll(`{${key}}`, String(value)), template);
  const ensureFreecellProgressStyles = () => {
    if (document.getElementById("freecell-progress-cue-style")) return;
    const style = document.createElement("style");
    style.id = "freecell-progress-cue-style";
    style.textContent = `
      body[data-wp-game-id="freecell-solitaire"] .freecell-foundation-progress {
        min-height: 13px; margin-top: 3px; color: var(--classic-muted); font-size: 10px;
        font-weight: 700; line-height: 1.25; text-align: center; overflow-wrap: anywhere;
      }
      body[data-wp-game-id="freecell-solitaire"] .freecell-foundation-progress[hidden],
      body[data-wp-game-id="freecell-solitaire"] .freecell-result-next-step[hidden] { display: none; }
      body[data-wp-game-id="freecell-solitaire"] .freecell-result-next-step {
        margin: 8px 0 0; color: var(--classic-muted); font-size: 12px;
        line-height: 1.35; overflow-wrap: anywhere;
      }
      @media (max-width: 699px) {
        body[data-wp-game-id="freecell-solitaire"] .freecell-foundation-progress { margin-top: 2px; font-size: 9px; }
        body[data-wp-game-id="freecell-solitaire"] .freecell-result-next-step { font-size: 11px; }
      }
    `;
    document.head.append(style);
  };
  const renderFoundationProgress = () => {
    const node = document.getElementById("foundationProgress");
    const state = snapshot();
    if (!node) return;
    const visible = Boolean(state && view?.active && !view.nodes?.battleScreen?.hidden);
    node.hidden = !visible;
    if (!visible || !state) {
      node.textContent = "";
      return;
    }
    const locale = view?.locale || "en";
    const template = FREECELL_FOUNDATION_PROGRESS_COPY[locale] || FREECELL_FOUNDATION_PROGRESS_COPY.en;
    const label = FREECELL_FOUNDATION_PROGRESS_LABEL[locale] || FREECELL_FOUNDATION_PROGRESS_LABEL.en;
    node.dataset.foundationCards = String(state.foundationCards);
    node.dataset.remainingCards = String(state.remainingCards);
    node.dataset.foundationComplete = String(state.foundationCompleteCount);
    node.textContent = copyWithValues(template, {
      label,
      foundation: state.foundationCards,
      remaining: state.remainingCards,
    });
  };
  const renderResultNextStep = () => {
    const node = document.getElementById("freecellResultNextStep");
    const state = snapshot();
    if (!node) return;
    const visible = Boolean(state && (state.won || state.lost));
    node.hidden = !visible;
    if (!visible) {
      node.textContent = "";
      return;
    }
    const locale = view?.locale || "en";
    node.textContent = FREECELL_RESULT_NEXT_STEP_COPY[locale] || FREECELL_RESULT_NEXT_STEP_COPY.en;
  };
  const refreshFreecellOutcomeCopy = () => {
    ensureFreecellProgressStyles();
    renderFoundationProgress();
    renderResultNextStep();
  };
  const capacitySnapshot = () => {
    const game = view?.game;
    if (!game) return null;
    const cells = game.freeCells.filter((cell) => !cell).length;
    const columns = game.tableau.filter((pile) => pile.length === 0).length;
    return {
      cells,
      columns,
      built: Math.max(1, cells + 1) * (2 ** Math.max(0, columns)),
      empty: Math.max(1, cells + 1) * (2 ** Math.max(0, columns - 1)),
    };
  };
  const openColumnMove = () => {
    const game = view?.game;
    if (!game || game.tableau.some((pile) => pile.length === 0)) return null;
    return game.legalMoves().find((move) => move.kind === "tableau"
      && move.source?.zone === "tableau"
      && move.destination?.zone === "tableau"
      && Number(move.source.row) === 0
      && move.source.pile !== move.destination.pile) || null;
  };
  const capacityText = (capacity, openMove = null) => {
    const copy = FREECELL_CAPACITY_COPY[view?.locale] || FREECELL_CAPACITY_COPY.en;
    const openColumnCopy = FREECELL_OPEN_COLUMN_CUE[view?.locale] || FREECELL_OPEN_COLUMN_CUE.en;
    const template = openMove && capacity.columns === 0
      ? openColumnCopy
      : capacity.columns > 0 ? copy.open : capacity.built === 1 ? copy.closedCapacityOne : (capacity.cells === 1 ? copy.closedOne : copy.closedMany);
    const values = { capacity: capacity.built, ...capacity };
    if (openMove) {
      values.source = Number(openMove.source.pile) + 1;
      values.destination = Number(openMove.destination.pile) + 1;
    }
    return Object.entries(values)
      .reduce((output, [key, value]) => output.replaceAll(`{${key}}`, String(value)), template);
  };
  const renderCapacityStatus = (force = false) => {
    const status = view?.nodes?.boardStatus;
    const capacity = capacitySnapshot();
    if (!status || !capacity || !view.active || view.game.won || view.game.lost || hintCueState.active) return;
    const openMove = capacity.columns === 0 ? openColumnMove() : null;
    const copy = capacityText(capacity, openMove);
    const stateName = status.dataset.state || "";
    if (stateName && stateName !== "freecell-capacity") return;
    if (status.textContent.trim() && stateName !== "freecell-capacity") return;
    if (!force && status.textContent.trim() && status.textContent !== copy) return;
    const openSource = openMove ? String(Number(openMove.source.pile) + 1) : "";
    const openDestination = openMove ? String(Number(openMove.destination.pile) + 1) : "";
    if (status.dataset.state === "freecell-capacity"
      && status.textContent === copy
      && status.dataset.openColumnSource === openSource
      && status.dataset.openColumnDestination === openDestination) return;
    status.dataset.state = "freecell-capacity";
    status.dataset.freecellCapacity = "true";
    status.dataset.capacityBuilt = String(capacity.built);
    status.dataset.capacityEmpty = String(capacity.empty);
    status.dataset.openCells = String(capacity.cells);
    status.dataset.emptyColumns = String(capacity.columns);
    if (openMove) {
      status.dataset.openColumnSource = openSource;
      status.dataset.openColumnDestination = openDestination;
    } else {
      delete status.dataset.openColumnSource;
      delete status.dataset.openColumnDestination;
    }
    status.textContent = copy;
  };
  const analyticsDetails = (state, extra = {}) => ({
    from: "unknown",
    outcome: "unknown",
    inputType: safeInputType(lastInputType),
    moveType: "unknown",
    moveCount: bounded(state?.moves, 200),
    cardCount: 0,
    foundationCards: bounded(state?.foundationCards, 52),
    foundationCompleteCount: bounded(state?.foundationCompleteCount, 4),
    tableauCards: bounded(state?.tableauCards, 52),
    freeCellCards: bounded(state?.freeCellCards, 4),
    remainingCards: bounded(state?.remainingCards, 52),
    ...extra,
  });
  const moveType = (move) => {
    const source = move?.source?.zone;
    const destination = move?.destination?.zone;
    if (source === "tableau" && destination === "foundation") return "tableauToFoundation";
    if (source === "free" && destination === "foundation") return "freeCellToFoundation";
    if (source === "tableau" && destination === "tableau") return "tableauToTableau";
    if (source === "tableau" && destination === "free") return "tableauToFreeCell";
    if (source === "free" && destination === "tableau") return "freeCellToTableau";
    return "unknown";
  };
  let previousState = snapshot();
  if (view?.render) {
    const originalRender = view.render.bind(view);
    view.render = (...args) => {
      const before = previousState || snapshot();
      const result = originalRender(...args);
      const after = snapshot();
      if (before && after && before.seed === after.seed && after.moves > before.moves) {
        const move = view.game.lastFreeCellMove;
        const movingCards = move?.source?.zone === "tableau"
          ? Math.max(1, (before.tableauPileLengths?.[move.source.pile] || 0) - Number(move.source.row || 0))
          : move ? 1 : 0;
        emitAnalytics("card_move", analyticsDetails(after, {
          from: "battle",
          outcome: "moved",
          moveType: moveType(move),
          cardCount: bounded(movingCards, 52),
        }));
        if (after.freeCellCards > before.freeCellCards) {
          emitAnalytics("free_cell_occupy", analyticsDetails(after, {
            from: "battle",
            outcome: "occupied",
            cardCount: 1,
          }));
        }
        for (let index = before.foundationCompleteCount; index < after.foundationCompleteCount; index += 1) {
          emitAnalytics("foundation_complete", analyticsDetails(after, {
            from: "battle",
            outcome: "complete",
            cardCount: 13,
          }));
        }
      }
      if (before && after && !before.won && !before.lost && (after.won || after.lost)) {
        emitAnalytics("result", analyticsDetails(after, {
          from: "battle",
          outcome: after.won ? "complete" : "failed",
        }));
      }
      previousState = after;
      refreshFreecellOutcomeCopy();
      renderCapacityStatus();
      return result;
    };
  }
  const trackButton = (id, event, from, outcome) => {
    view?.nodes?.[id]?.addEventListener("click", () => {
      emitAnalytics(event, analyticsDetails(snapshot(), { from, outcome }));
    });
  };
  document.addEventListener("pointerdown", (event) => { lastInputType = inputTypeFromEvent(event); }, true);
  document.addEventListener("keydown", (event) => { lastInputType = inputTypeFromEvent(event); }, true);
  trackButton("startBtn", "game_start", "main", "started");
  trackButton("restartBtn", "restart", "main", "restart");
  trackButton("newGameBtn", "new_game", "main", "new_game");
  trackButton("battleRestartBtn", "restart", "battle", "restart");
  trackButton("battleNewBtn", "new_game", "battle", "new_game");
  trackButton("resultRestart", "restart", "result", "restart");
  trackButton("resultNewGame", "new_game", "result", "new_game");
  view?.nodes?.battleBackBtn?.addEventListener("click", () => {
    emitAnalytics("main_return", analyticsDetails(snapshot(), { from: "battle", outcome: "returned" }));
  });
  view?.nodes?.resultClose?.addEventListener("click", () => {
    emitAnalytics("close", analyticsDetails(snapshot(), { from: "result", outcome: "closed" }));
    emitAnalytics("main_return", analyticsDetails(snapshot(), { from: "result", outcome: "returned" }));
  });
  const focusHintSource = () => {
    window.requestAnimationFrame(() => {
      if (!view?.active || view.nodes.battleScreen?.hidden) return;
      const source = view.nodes.board?.querySelector("button.classic-card.selected");
      if (source && source.isConnected && !source.closest("[hidden]")) source.focus({ preventScroll: true });
    });
  };
  const ensureHintCueStyles = () => {
    if (document.getElementById("freecell-hint-cue-style")) return;
    const style = document.createElement("style");
    style.id = "freecell-hint-cue-style";
    style.textContent = `
      body[data-wp-game-id="freecell-solitaire"] .freecell-hint-target { position: relative; }
      body[data-wp-game-id="freecell-solitaire"] .freecell-hint-badge {
        position: absolute; top: 4px; right: 4px; z-index: 20; display: grid;
        width: 22px; height: 22px; place-items: center; border: 2px solid #071a2d;
        border-radius: 50%; color: #071a2d; background: #ffd166; box-shadow: 0 2px 8px rgba(0,0,0,.35);
        font: 900 12px/1 "Poppins", "Manrope", "Inter", sans-serif; pointer-events: none;
      }
      body[data-wp-game-id="freecell-solitaire"] .board-status[data-state="freecell-capacity"] {
        color: var(--classic-muted); font-weight: 700;
      }
    `;
    document.head.append(style);
  };
  const clearHintCue = () => {
    hintCueState.active = false;
    window.clearTimeout(hintCueState.timer);
    const board = view?.nodes?.board;
    board?.querySelectorAll(".freecell-hint-target").forEach((node) => {
      node.classList.remove("freecell-hint-target");
      node.querySelectorAll(".freecell-hint-badge").forEach((badge) => badge.remove());
      if (node.dataset.freecellHintAria !== undefined) {
        node.setAttribute("aria-label", node.dataset.freecellHintAria);
        delete node.dataset.freecellHintAria;
      }
    });
    const status = view?.nodes?.boardStatus;
    if (status?.dataset.freecellHint === "true") {
      delete status.dataset.freecellHint;
      delete status.dataset.state;
      if (!view.game.won && !view.game.lost) status.textContent = "";
      window.requestAnimationFrame(() => renderCapacityStatus());
    }
  };
  const renderHintCue = () => {
    if (!hintCueState.active || !view?.active || view.nodes.battleScreen?.hidden) return;
    const board = view.nodes.board;
    const source = view.game?.selected;
    const destinations = [...(board?.querySelectorAll("[data-dest].valid-target") || [])];
    if (!source || !destinations.length) return clearHintCue();
    ensureHintCueStyles();
    destinations.forEach((node, index) => {
      node.classList.add("freecell-hint-target");
      node.querySelectorAll(".freecell-hint-badge").forEach((badge) => badge.remove());
      const badge = document.createElement("span");
      badge.className = "freecell-hint-badge";
      badge.textContent = String(index + 1);
      badge.setAttribute("aria-hidden", "true");
      node.append(badge);
      if (node.dataset.freecellHintAria === undefined) node.dataset.freecellHintAria = node.getAttribute("aria-label") || "";
      const destinationLabel = (FREECELL_HINT_DESTINATION[view.locale] || FREECELL_HINT_DESTINATION.en).replace("{index}", String(index + 1));
      node.setAttribute("aria-label", `${node.dataset.freecellHintAria} · ${destinationLabel}`);
    });
    const status = view.nodes.boardStatus;
    if (status) {
      status.dataset.freecellHint = "true";
      status.dataset.state = "freecell-hint";
      status.textContent = FREECELL_HINT_CUE[view.locale] || FREECELL_HINT_CUE.en;
    }
    window.clearTimeout(hintCueState.timer);
    hintCueState.timer = window.setTimeout(clearHintCue, 2400);
  };
  const refreshHintCueAfterAction = () => {
    window.requestAnimationFrame(() => {
      if (!hintCueState.active) return;
      if (view.game.moves !== hintCueState.moves || !view.game.selected) return clearHintCue();
      renderHintCue();
    });
  };
  view?.nodes.hintBtn?.addEventListener("click", () => {
    focusHintSource();
    window.requestAnimationFrame(() => {
      if (!view?.game?.selected || !view.game.legalMoves().some((move) => JSON.stringify(move.source) === JSON.stringify(view.game.selected))) return clearHintCue();
      hintCueState.active = true;
      hintCueState.moves = view.game.moves;
      renderHintCue();
    });
  });
  view?.nodes.board?.addEventListener("click", refreshHintCueAfterAction);
  view?.nodes.board?.addEventListener("pointerup", refreshHintCueAfterAction);
  ["battleRestartBtn", "battleNewBtn", "resultRestart", "resultNewGame", "resultClose", "battleBackBtn"].forEach((id) => {
    view?.nodes?.[id]?.addEventListener("click", clearHintCue);
  });
  view?.nodes.localeSelect?.addEventListener("change", () => {
    window.requestAnimationFrame(() => {
      if (hintCueState.active) renderHintCue();
      else renderCapacityStatus(true);
      refreshFreecellOutcomeCopy();
    });
  });
  refreshFreecellOutcomeCopy();
  if (view?.nodes?.boardStatus) {
    let capacityRefreshQueued = false;
    new MutationObserver(() => {
      if (capacityRefreshQueued) return;
      capacityRefreshQueued = true;
      window.requestAnimationFrame(() => {
        capacityRefreshQueued = false;
        renderCapacityStatus();
      });
    }).observe(view.nodes.boardStatus, {
      attributes: true,
      attributeFilter: ["data-state"],
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
})();
