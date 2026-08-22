const GAME_VERSION = "v8";

const NAVAL_SHIP_LENGTHS = [3, 2, 2];
const NAVAL_PLACEMENT_COPY = {
  en: { fleet: "Fleet: 3 · 2 · 2", next: "Next ship: length {length}", placed: "Placed {placed} of 3", remaining: "Remaining: {fleet}", ready: "Fleet ready" },
  "zh-Hant": { fleet: "艦隊：3 · 2 · 2", next: "下一艘：長度 {length}", placed: "已配置 {placed}/3", remaining: "尚餘：{fleet}", ready: "艦隊就位" },
  "zh-Hans": { fleet: "舰队：3 · 2 · 2", next: "下一艘：长度 {length}", placed: "已放置 {placed}/3", remaining: "剩余：{fleet}", ready: "舰队就绪" },
  ja: { fleet: "艦隊：3 · 2 · 2", next: "次の艦：長さ {length}", placed: "配置済み {placed}/3", remaining: "残り：{fleet}", ready: "艦隊の準備完了" },
  ko: { fleet: "함대: 3 · 2 · 2", next: "다음 함선: 길이 {length}", placed: "배치 완료 {placed}/3", remaining: "남은 함선: {fleet}", ready: "함대 준비 완료" },
  es: { fleet: "Flota: 3 · 2 · 2", next: "Siguiente barco: longitud {length}", placed: "Colocados: {placed} de 3", remaining: "Restantes: {fleet}", ready: "Flota lista" },
  "pt-BR": { fleet: "Frota: 3 · 2 · 2", next: "Próximo navio: tamanho {length}", placed: "Posicionados: {placed} de 3", remaining: "Restantes: {fleet}", ready: "Frota pronta" },
  fr: { fleet: "Flotte : 3 · 2 · 2", next: "Navire suivant : longueur {length}", placed: "Placés : {placed} sur 3", remaining: "Restants : {fleet}", ready: "Flotte prête" },
  de: { fleet: "Flotte: 3 · 2 · 2", next: "Nächstes Schiff: Länge {length}", placed: "Platziert: {placed} von 3", remaining: "Übrig: {fleet}", ready: "Flotte bereit" },
  it: { fleet: "Flotta: 3 · 2 · 2", next: "Prossima nave: lunghezza {length}", placed: "Posizionate: {placed} di 3", remaining: "Restanti: {fleet}", ready: "Flotta pronta" },
  ru: { fleet: "Флот: 3 · 2 · 2", next: "Следующий корабль: длина {length}", placed: "Расставлено: {placed} из 3", remaining: "Осталось: {fleet}", ready: "Флот готов" },
  hi: { fleet: "बेड़ा: 3 · 2 · 2", next: "अगला जहाज़: लंबाई {length}", placed: "रखे गए: {placed} में से 3", remaining: "बाकी: {fleet}", ready: "बेड़ा तैयार" },
  ar: { fleet: "الأسطول: 3 · 2 · 2", next: "السفينة التالية: الطول {length}", placed: "تم وضع {placed} من 3", remaining: "المتبقي: {fleet}", ready: "الأسطول جاهز" },
};

window.WPClassicLogic?.mount("naval-battle");
document.body.dataset.gameVersion = GAME_VERSION;

const syncBattleChip = () => {
  const status = document.querySelector("#logicStatus");
  const chip = document.querySelector("#battleChip");
  const result = document.querySelector("#logicResult");
  const resultTitle = document.querySelector("#logicResultTitle");
  if (status && chip && result && !result.hidden && resultTitle?.textContent?.trim()) {
    const terminalStatus = resultTitle.textContent.trim();
    if (status.textContent !== terminalStatus) status.textContent = terminalStatus;
    if (chip.textContent !== terminalStatus) chip.textContent = terminalStatus;
    return;
  }
  if (status && chip && (!result || result.hidden) && chip.textContent !== status.textContent) chip.textContent = status.textContent;
};

const syncNavalPlacementProgress = () => {
  const boardRoot = document.querySelector("#logicBoard");
  const ownSide = boardRoot?.querySelector(".logic-naval-layout > div:first-child");
  const enemySide = boardRoot?.querySelector(".logic-naval-layout > div:nth-child(2)");
  const toolbar = boardRoot?.querySelector(".logic-board-toolbar");
  const result = document.querySelector("#logicResult");
  if (!ownSide || !enemySide || !toolbar || !enemySide.hidden || result && !result.hidden) {
    toolbar?.querySelector("[data-naval-placement-progress]")?.remove();
    return;
  }
  const locale = document.querySelector("#localePicker")?.value || document.documentElement.lang;
  const copy = NAVAL_PLACEMENT_COPY[locale] || NAVAL_PLACEMENT_COPY.en;
  const placedCells = ownSide.querySelectorAll(".logic-cell.ship").length;
  const placed = placedCells >= 7 ? 3 : placedCells >= 5 ? 2 : placedCells >= 3 ? 1 : 0;
  const remainingFleet = NAVAL_SHIP_LENGTHS.slice(placed).join(" · ");
  const nextText = placed < NAVAL_SHIP_LENGTHS.length
    ? [copy.fleet, copy.next.replace("{length}", String(NAVAL_SHIP_LENGTHS[placed])), copy.placed.replace("{placed}", String(placed)), copy.remaining.replace("{fleet}", remainingFleet)].join(" · ")
    : [copy.fleet, copy.ready, copy.placed.replace("{placed}", String(placed))].join(" · ");
  const progress = toolbar.querySelector("[data-naval-placement-progress]");
  if (!progress) {
    const nextProgress = document.createElement("p");
    nextProgress.dataset.navalPlacementProgress = "true";
    nextProgress.className = "logic-live naval-placement-progress";
    nextProgress.setAttribute("aria-live", "polite");
    nextProgress.textContent = nextText;
    toolbar.append(nextProgress);
  } else if (progress.textContent !== nextText) {
    progress.textContent = nextText;
  }
};

for (const selector of ["#resultReplay", "#resultClose", "#resultMenu", "#logicReset"]) {
  document.querySelector(selector)?.addEventListener("click", () => setTimeout(() => {
    syncBattleChip();
    syncNavalPlacementProgress();
  }, 0));
}
const statusObserver = new MutationObserver(syncBattleChip);
statusObserver.observe(document.querySelector("#logicStatus") || document.body, { childList: true, characterData: true, subtree: true });
const boardObserver = new MutationObserver(() => {
  syncBattleChip();
  syncNavalPlacementProgress();
});
boardObserver.observe(document.querySelector("#logicBoard") || document.body, { attributes: true, childList: true, characterData: true, subtree: true });
const resultObserver = new MutationObserver(() => {
  syncBattleChip();
  syncNavalPlacementProgress();
});
if (document.querySelector("#logicResult")) resultObserver.observe(document.querySelector("#logicResult"), { attributes: true, childList: true, characterData: true, subtree: true });
syncBattleChip();
syncNavalPlacementProgress();

const NAVAL_HINT_COPY = {
  en: {
    adjacent: "Hint: search row {row}, column {col} next to a hit; you choose whether to fire.",
    search: "Hint: start a checkerboard search at row {row}, column {col}; you choose whether to fire.",
    cell: "Hint target; still choose whether to fire.",
  },
  "zh-Hant": {
    adjacent: "提示：可從命中格旁的第 {row} 行、第 {col} 列開始搜尋；是否開火由你決定。",
    search: "提示：可從棋盤交錯搜尋的第 {row} 行、第 {col} 列開始；是否開火由你決定。",
    cell: "提示目標；是否開火仍由你決定。",
  },
  "zh-Hans": {
    adjacent: "提示：可从命中格旁的第 {row} 行、第 {col} 列开始搜索；是否开火由你决定。",
    search: "提示：可从棋盘交错搜索的第 {row} 行、第 {col} 列开始；是否开火由你决定。",
    cell: "提示目标；是否开火仍由你决定。",
  },
  ja: {
    adjacent: "ヒント：命中マスの隣、{row}行{col}列を探索してみましょう。撃つかどうかはあなたが決めます。",
    search: "ヒント：{row}行{col}列から市松模様に探索を始めましょう。撃つかどうかはあなたが決めます。",
    cell: "ヒントの目標。撃つかどうかはあなたが決めます。",
  },
  ko: {
    adjacent: "힌트: 명중 칸 옆의 {row}행 {col}열을 탐색해 보세요. 발사 여부는 직접 정합니다.",
    search: "힌트: {row}행 {col}열부터 체커보드 순서로 탐색해 보세요. 발사 여부는 직접 정합니다.",
    cell: "힌트 목표입니다. 발사 여부는 직접 정합니다.",
  },
  es: {
    adjacent: "Pista: explora la fila {row}, columna {col}, junto a un impacto; tú decides si disparar.",
    search: "Pista: empieza una búsqueda en tablero de ajedrez por la fila {row}, columna {col}; tú decides si disparar.",
    cell: "Objetivo sugerido; tú decides si disparar.",
  },
  "pt-BR": {
    adjacent: "Dica: explore a linha {row}, coluna {col}, ao lado de um acerto; você decide se dispara.",
    search: "Dica: comece uma busca em padrão de xadrez pela linha {row}, coluna {col}; você decide se dispara.",
    cell: "Alvo sugerido; você decide se dispara.",
  },
  fr: {
    adjacent: "Indice : explorez la ligne {row}, colonne {col}, près d’un tir réussi ; vous décidez de tirer.",
    search: "Indice : commencez une recherche en damier à la ligne {row}, colonne {col} ; vous décidez de tirer.",
    cell: "Cible suggérée ; c’est vous qui décidez de tirer.",
  },
  de: {
    adjacent: "Tipp: Suche in Zeile {row}, Spalte {col} neben einem Treffer weiter; du entscheidest selbst, ob du schießt.",
    search: "Tipp: Beginne die Schachbrettsuche bei Zeile {row}, Spalte {col}; du entscheidest selbst, ob du schießt.",
    cell: "Tippziel; du entscheidest selbst, ob du schießt.",
  },
  it: {
    adjacent: "Suggerimento: esplora la riga {row}, colonna {col}, accanto a un colpo a segno; decidi tu se sparare.",
    search: "Suggerimento: inizia la ricerca a scacchiera dalla riga {row}, colonna {col}; decidi tu se sparare.",
    cell: "Bersaglio suggerito; decidi tu se sparare.",
  },
  ru: {
    adjacent: "Подсказка: исследуйте строку {row}, столбец {col} рядом с попаданием; стрелять решаете вы.",
    search: "Подсказка: начните поиск по шахматному узору со строки {row}, столбца {col}; стрелять решаете вы.",
    cell: "Цель подсказки; стрелять решаете вы.",
  },
  hi: {
    adjacent: "संकेत: हिट के पास पंक्ति {row}, स्तंभ {col} खोजें; फायर करना है या नहीं, यह आप चुनते हैं।",
    search: "संकेत: पंक्ति {row}, स्तंभ {col} से चेकरबोर्ड खोज शुरू करें; फायर करना है या नहीं, यह आप चुनते हैं।",
    cell: "संकेत लक्ष्य; फायर करना है या नहीं, यह आप चुनते हैं।",
  },
  ar: {
    adjacent: "تلميح: ابحث في الصف {row}، العمود {col} بجوار إصابة؛ أنت من يقرر إطلاق النار.",
    search: "تلميح: ابدأ البحث المتناوب من الصف {row}، العمود {col}؛ أنت من يقرر إطلاق النار.",
    cell: "هدف التلميح؛ أنت من يقرر إطلاق النار.",
  },
};

const applyNavalHintCue = () => {
  const result = document.querySelector("#logicResult");
  const enemyBoard = document.querySelector(".logic-naval-layout > div:nth-child(2) .logic-naval-board");
  if (!enemyBoard || result && !result.hidden) return;
  const cells = [...enemyBoard.querySelectorAll(".logic-cell")];
  const open = cells.map((cell, index) => ({ cell, index })).filter(({ cell }) => !cell.classList.contains("hit") && !cell.classList.contains("miss"));
  if (!open.length) return;
  cells.forEach((cell) => cell.classList.remove("is-hint"));
  const openIndexes = new Set(open.map(({ index }) => index));
  const hits = cells.map((cell, index) => cell.classList.contains("hit") ? index : -1).filter((index) => index >= 0);
  const neighbours = (index) => {
    const row = Math.floor(index / 6);
    const col = index % 6;
    return [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]
      .filter(([nextRow, nextCol]) => nextRow >= 0 && nextRow < 6 && nextCol >= 0 && nextCol < 6)
      .map(([nextRow, nextCol]) => nextRow * 6 + nextCol);
  };
  const adjacent = hits.flatMap(neighbours).filter((index, position, values) => openIndexes.has(index) && values.indexOf(index) === position);
  const candidate = adjacent[0] ?? open.find(({ index }) => (Math.floor(index / 6) + index % 6) % 2 === 0)?.index ?? open[0].index;
  const target = cells[candidate];
  if (!target) return;
  const row = Math.floor(candidate / 6) + 1;
  const col = candidate % 6 + 1;
  const copy = NAVAL_HINT_COPY[document.documentElement.lang] || NAVAL_HINT_COPY.en;
  const message = (hits.length ? copy.adjacent : copy.search).replace("{row}", String(row)).replace("{col}", String(col));
  target.classList.add("is-hint");
  target.setAttribute("aria-label", `${target.getAttribute("aria-label") || ""} · ${copy.cell}`);
  const status = document.querySelector("#logicStatus");
  if (status) status.textContent = message;
};

document.querySelector("#logicHint")?.addEventListener("click", () => setTimeout(applyNavalHintCue, 0));

(() => {
  "use strict";

  const RESULT_TITLE = {
    en: { win: "You won", lose: "Fleet defeated" },
    "zh-Hant": { win: "\u4f60\u8d0f\u4e86", lose: "\u6575\u65b9\u8266\u968a\u5df2\u64ca\u6557" },
    "zh-Hans": { win: "\u4f60\u8d62\u4e86", lose: "\u654c\u65b9\u8230\u961f\u5df2\u51fb\u8d25" },
    ja: { win: "\u52dd\u5229", lose: "\u6575\u8266\u968a\u3092\u6483\u7834" },
    ko: { win: "\uc2b9\ub9ac", lose: "\uc801 \ud568\ub300 \uaca9\ud30c" },
    es: { win: "Has ganado", lose: "Flota enemiga derrotada" },
    "pt-BR": { win: "Voc\u00ea venceu", lose: "Frota inimiga derrotada" },
    fr: { win: "Vous avez gagn\u00e9", lose: "Flotte ennemie vaincue" },
    de: { win: "Du hast gewonnen", lose: "Feindliche Flotte besiegt" },
    it: { win: "Hai vinto", lose: "Flotta nemica sconfitta" },
    ru: { win: "\u0412\u044b \u043f\u043e\u0431\u0435\u0434\u0438\u043b\u0438", lose: "\u0412\u0440\u0430\u0436\u0435\u0441\u043a\u0438\u0439 \u0444\u043b\u043e\u0442 \u0443\u043d\u0438\u0447\u0442\u043e\u0436\u0435\u043d" },
    hi: { win: "\u0906\u092a \u091c\u0940\u0924 \u0917\u090f", lose: "\u0926\u0941\u0936\u094d\u092e\u0928 \u0915\u093e \u092c\u0947\u0921\u093c\u093e \u0928\u0937\u094d\u091f" },
    ar: { win: "\u0644\u0642\u062f \u0641\u0632\u062a", lose: "\u0623\u064f\u0633\u0637\u0648\u0644 \u0627\u0644\u0639\u062f\u0648 \u063a\u0627\u0631\u0642" },
  };

  const RESULT_COPY = {
    en: { win: "You won \u00b7 Shots: {shots} \u00b7 Enemy ships remaining: 0", lose: "Fleet defeated \u00b7 Shots: {shots} \u00b7 Your ships remaining: 0" },
    "zh-Hant": { win: "\u4f60\u8d0f\u4e86 \u00b7 \u5c04\u64ca\u6b21\u6578\uff1a{shots} \u00b7 \u6575\u65b9\u5269\u9918\u8239\u8266\uff1a0", lose: "\u8266\u968a\u5df2\u88ab\u64ca\u6557 \u00b7 \u5c04\u64ca\u6b21\u6578\uff1a{shots} \u00b7 \u4f60\u7684\u5269\u9918\u8239\u8266\uff1a0" },
    "zh-Hans": { win: "\u4f60\u8d62\u4e86 \u00b7 \u5c04\u51fb\u6b21\u6570\uff1a{shots} \u00b7 \u654c\u65b9\u5269\u4f59\u8230\u8239\uff1a0", lose: "\u8230\u961f\u5df2\u88ab\u51fb\u8d25 \u00b7 \u5c04\u51fb\u6b21\u6570\uff1a{shots} \u00b7 \u4f60\u7684\u5269\u4f59\u8230\u8239\uff1a0" },
    ja: { win: "\u52dd\u5229 \u00b7 \u5c04\u6483\u6570\uff1a{shots} \u00b7 \u6575\u8266\u306e\u6b8b\u308a\uff1a0", lose: "\u8266\u968a\u3092\u6483\u7834 \u00b7 \u5c04\u6483\u6570\uff1a{shots} \u00b7 \u81ea\u8266\u306e\u6b8b\u308a\uff1a0" },
    ko: { win: "\uc2b9\ub9ac \u00b7 \uc0ac\uaca9 \uc218: {shots} \u00b7 \ub0a8\uc740 \uc801 \ud568\uc120: 0", lose: "\ud568\ub300 \uaca9\ud30c \u00b7 \uc0ac\uaca9 \uc218: {shots} \u00b7 \ub0a8\uc740 \uc544\uad70 \ud568\uc120: 0" },
    es: { win: "Has ganado \u00b7 Disparos: {shots} \u00b7 Barcos enemigos restantes: 0", lose: "Flota derrotada \u00b7 Disparos: {shots} \u00b7 Tus barcos restantes: 0" },
    "pt-BR": { win: "Voc\u00ea venceu \u00b7 Disparos: {shots} \u00b7 Navios inimigos restantes: 0", lose: "Frota derrotada \u00b7 Disparos: {shots} \u00b7 Seus navios restantes: 0" },
    fr: { win: "Vous avez gagn\u00e9 \u00b7 Tirs : {shots} \u00b7 Navires ennemis restants : 0", lose: "Flotte vaincue \u00b7 Tirs : {shots} \u00b7 Vos navires restants : 0" },
    de: { win: "Du hast gewonnen \u00b7 Sch\u00fcsse: {shots} \u00b7 Verbleibende Feindschiffe: 0", lose: "Flotte besiegt \u00b7 Sch\u00fcsse: {shots} \u00b7 Verbleibende eigene Schiffe: 0" },
    it: { win: "Hai vinto \u00b7 Tiri: {shots} \u00b7 Navi nemiche rimaste: 0", lose: "Flotta sconfitta \u00b7 Tiri: {shots} \u00b7 Tue navi rimaste: 0" },
    ru: { win: "\u0412\u044b \u043f\u043e\u0431\u0435\u0434\u0438\u043b\u0438 \u00b7 \u0412\u044b\u0441\u0442\u0440\u0435\u043b\u044b: {shots} \u00b7 \u041a\u043e\u0440\u0430\u0431\u043b\u0435\u0439 \u043f\u0440\u043e\u0442\u0438\u0432\u043d\u0438\u043a\u0430 \u043e\u0441\u0442\u0430\u043b\u043e\u0441\u044c: 0", lose: "\u0424\u043b\u043e\u0442 \u0443\u043d\u0438\u0447\u0442\u043e\u0436\u0435\u043d \u00b7 \u0412\u044b\u0441\u0442\u0440\u0435\u043b\u044b: {shots} \u00b7 \u0412\u0430\u0448\u0438\u0445 \u043a\u043e\u0440\u0430\u0431\u043b\u0435\u0439 \u043e\u0441\u0442\u0430\u043b\u043e\u0441\u044c: 0" },
    hi: { win: "\u0906\u092a \u091c\u0940\u0924 \u0917\u090f \u00b7 \u0936\u0949\u091f: {shots} \u00b7 \u0926\u0941\u0936\u094d\u092e\u0928 \u0915\u0947 \u092c\u091a\u0947 \u091c\u0939\u093e\u091c\u093c: 0", lose: "\u092c\u0947\u0921\u093c\u093e \u0928\u0937\u094d\u091f \u00b7 \u0936\u0949\u091f: {shots} \u00b7 \u0906\u092a\u0915\u0947 \u092c\u091a\u0947 \u091c\u0939\u093e\u091c\u093c: 0" },
    ar: { win: "\u0644\u0642\u062f \u0641\u0632\u062a \u00b7 \u0627\u0644\u0637\u0644\u0642\u0627\u062a: {shots} \u00b7 \u0633\u0641\u0646 \u0627\u0644\u0639\u062f\u0648 \u0627\u0644\u0645\u062a\u0628\u0642\u064a\u0629: 0", lose: "\u063a\u064e\u0631\u0650\u0642 \u0627\u0644\u0623\u0633\u0637\u0648\u0644 \u00b7 \u0627\u0644\u0637\u0644\u0642\u0627\u062a: {shots} \u00b7 \u0633\u0641\u0646\u0643 \u0627\u0644\u0645\u062a\u0628\u0642\u064a\u0629: 0" },
  };

  const RESULT_REPLAY_GOAL = {
    en: "Replay goal: clear the fleet in {target} shots or fewer next round.",
    "zh-Hant": "\u91cd\u73a9\u76ee\u6a19\uff1a\u4e0b\u4e00\u5c40\u7528 {target} \u767c\u6216\u66f4\u5c11\u64ca\u6c89\u6574\u652f\u8266\u968a\u3002",
    "zh-Hans": "\u91cd\u73a9\u76ee\u6807\uff1a\u4e0b\u4e00\u5c40\u7528 {target} \u53d1\u6216\u66f4\u5c11\u51fb\u6c89\u6574\u652f\u8230\u961f\u3002",
    ja: "\u30ea\u30d7\u30ec\u30a4\u76ee\u6a19\uff1a\u6b21\u306f {target} \u767a\u4ee5\u5185\u3067\u8266\u968a\u3092\u5168\u6ec5\u3055\u305b\u308b\u3002",
    ko: "\ub2e4\uc2dc \ud558\uae30 \ubaa9\ud45c: \ub2e4\uc74c \ub77c\uc6b4\ub4dc\uc5d0 {target}\ubc1c \uc774\ud558\ub85c \ud568\ub300\ub97c \uaca9\ucda8\ud558\uc138\uc694.",
    es: "Objetivo de repetici\u00f3n: hunde la flota en {target} disparos o menos.",
    "pt-BR": "Meta da revanche: afunde a frota em at\u00e9 {target} disparos.",
    fr: "Objectif de revanche : coulez la flotte en {target} tirs ou moins.",
    de: "Replay-Ziel: Versenke die Flotte in h\u00f6chstens {target} Sch\u00fcssen.",
    it: "Obiettivo rigioca: affonda la flotta in {target} colpi o meno.",
    ru: "\u0426\u0435\u043b\u044c \u043f\u043e\u0432\u0442\u043e\u0440\u0430: \u043f\u043e\u0442\u043e\u043f\u0438\u0442\u0435 \u0444\u043b\u043e\u0442 \u0437\u0430 {target} \u0432\u044b\u0441\u0442\u0440\u0435\u043b\u043e\u0432 \u0438\u043b\u0438 \u043c\u0435\u043d\u044c\u0448\u0435.",
    hi: "\u092a\u0941\u0928\u0903 \u0916\u0947\u0932\u0928\u0947 \u0915\u093e \u0932\u0915\u094d\u0937\u094d\u092f: \u0905\u0917\u0932\u0940 \u092c\u093e\u091c\u093c\u0940 \u092e\u0947\u0902 {target} \u092f\u093e \u0915\u092e \u0936\u0949\u091f \u092e\u0947\u0902 \u092c\u0947\u0921\u093c\u0947 \u0915\u094b \u0921\u0941\u092c\u093e\u090f\u0901\u0964",
    ar: "\u0647\u062f\u0641 \u0627\u0644\u0625\u0639\u0627\u062f\u0629: \u0623\u063a\u0631\u0642 \u0627\u0644\u0623\u0633\u0637\u0648\u0644 \u0641\u064a \u0627\u0644\u062c\u0648\u0644\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629 \u062e\u0644\u0627\u0644 {target} \u0637\u0644\u0642\u0629 \u0623\u0648 \u0623\u0642\u0644.",
  };

  const locale = () => document.querySelector("#localePicker")?.value || document.documentElement.lang || "en";

  const applyResultCopy = () => {
    const result = document.querySelector("#logicResult");
    if (!result || result.hidden) return;
    const currentLocale = locale();
    const title = RESULT_TITLE[currentLocale] || RESULT_TITLE.en;
    const copy = RESULT_COPY[currentLocale] || RESULT_COPY.en;
    const boards = [...document.querySelectorAll(".logic-naval-layout > div")];
    const enemyBoard = boards[1]?.querySelector(".logic-naval-board");
    const shots = enemyBoard?.querySelectorAll(".logic-cell.hit, .logic-cell.miss").length || 0;
    const won = (enemyBoard?.querySelectorAll(".logic-cell.hit").length || 0) >= 7;
    const outcome = won ? "win" : "lose";
    const nextTitle = title[outcome];
    const replayGoal = RESULT_REPLAY_GOAL[currentLocale] || RESULT_REPLAY_GOAL.en;
    const target = won ? Math.max(1, shots - 1) : shots;
    const nextCopy = `${copy[outcome].replace("{shots}", String(shots))} · ${replayGoal.replace("{target}", String(target))}`;
    const resultTitle = document.querySelector("#logicResultTitle");
    const resultText = document.querySelector("#logicResultText");
    if (resultTitle && resultTitle.textContent !== nextTitle) resultTitle.textContent = nextTitle;
    if (resultText && resultText.textContent !== nextCopy) resultText.textContent = nextCopy;
  };

  const observer = new MutationObserver(applyResultCopy);
  observer.observe(document.body, { attributes: true, attributeFilter: ["hidden"], childList: true, subtree: true, characterData: true });
  applyResultCopy();
})();
