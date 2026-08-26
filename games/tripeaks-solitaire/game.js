(function () {
  "use strict";
  document.body.dataset.gameVersion = "v20";
  const TRIPEAKS_RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const TRIPEAKS_DYNAMIC_COPY = Object.freeze({
    en: { start: "Start Game", restart: "Restart", newGame: "New Game", moves: "Moves", score: "Score", combo: "Combo", back: "Back", ariaCard: "{rank} of {suit}", suits: { spades: "spades", hearts: "hearts", clubs: "clubs", diamonds: "diamonds" } },
    "zh-Hant": { start: "開始遊戲", restart: "重新開始", newGame: "新遊戲", moves: "步數", score: "分數", combo: "連鎖", back: "返回", ariaCard: "{suit}{rank}", suits: { spades: "黑桃", hearts: "紅心", clubs: "梅花", diamonds: "方塊" } },
    "zh-Hans": { start: "开始游戏", restart: "重新开始", newGame: "新游戏", moves: "步数", score: "分数", combo: "连锁", back: "返回", ariaCard: "{suit}{rank}", suits: { spades: "黑桃", hearts: "红心", clubs: "梅花", diamonds: "方块" } },
    ja: { start: "ゲーム開始", restart: "リスタート", newGame: "新しいゲーム", moves: "手数", score: "スコア", combo: "コンボ", back: "戻る", ariaCard: "{suit}の{rank}", suits: { spades: "スペード", hearts: "ハート", clubs: "クラブ", diamonds: "ダイヤ" } },
    ko: { start: "게임 시작", restart: "다시 시작", newGame: "새 게임", moves: "이동", score: "점수", combo: "콤보", back: "뒤로", ariaCard: "{suit} {rank}", suits: { spades: "스페이드", hearts: "하트", clubs: "클럽", diamonds: "다이아" } },
    es: { start: "Iniciar partida", restart: "Reiniciar", newGame: "Nueva partida", moves: "Movimientos", score: "Puntuación", combo: "Combo", back: "Atrás", ariaCard: "{rank} de {suit}", suits: { spades: "picas", hearts: "corazones", clubs: "tréboles", diamonds: "diamantes" } },
    "pt-BR": { start: "Iniciar jogo", restart: "Reiniciar", newGame: "Novo jogo", moves: "Movimentos", score: "Pontuação", combo: "Combo", back: "Voltar", ariaCard: "{rank} de {suit}", suits: { spades: "espadas", hearts: "copas", clubs: "paus", diamonds: "ouros" } },
    fr: { start: "Commencer", restart: "Recommencer", newGame: "Nouvelle partie", moves: "Coups", score: "Score", combo: "Combo", back: "Retour", ariaCard: "{rank} de {suit}", suits: { spades: "piques", hearts: "cœurs", clubs: "trèfles", diamonds: "carreaux" } },
    de: { start: "Spiel starten", restart: "Neu starten", newGame: "Neues Spiel", moves: "Züge", score: "Punkte", combo: "Combo", back: "Zurück", ariaCard: "{rank} von {suit}", suits: { spades: "Pik", hearts: "Herz", clubs: "Kreuz", diamonds: "Karo" } },
    it: { start: "Inizia partita", restart: "Ricomincia", newGame: "Nuova partita", moves: "Mosse", score: "Punteggio", combo: "Combo", back: "Indietro", ariaCard: "{rank} di {suit}", suits: { spades: "picche", hearts: "cuori", clubs: "fiori", diamonds: "quadri" } },
    ru: { start: "Начать игру", restart: "Начать заново", newGame: "Новая игра", moves: "Ходы", score: "Очки", combo: "Комбо", back: "Назад", ariaCard: "{rank} масти {suit}", suits: { spades: "пики", hearts: "черви", clubs: "трефы", diamonds: "бубны" } },
    hi: { start: "खेल शुरू करें", restart: "फिर शुरू करें", newGame: "नया खेल", moves: "चालें", score: "स्कोर", combo: "कॉम्बो", back: "वापस", ariaCard: "{suit} का {rank}", suits: { spades: "हुकुम", hearts: "पान", clubs: "चिड़ी", diamonds: "ईंट" } },
    ar: { start: "ابدأ اللعبة", restart: "إعادة البدء", newGame: "لعبة جديدة", moves: "الحركات", score: "النقاط", combo: "التتابع", back: "رجوع", ariaCard: "{rank} من {suit}", suits: { spades: "البستوني", hearts: "القلوب", clubs: "النوادي", diamonds: "الماس" } },
  });
  const fillTriPeaksCopy = (value, params) => String(value || "").replace(/\{(\w+)\}/gu, (_match, key) => params[key] ?? "");
  const PEAK_PROGRESS_COPY = Object.freeze({
    en: { label: "Peaks", aria: "Peaks cleared: {cleared} of 3" },
    "zh-Hant": { label: "峰頂", aria: "已清除峰頂：{cleared}/3" },
    "zh-Hans": { label: "峰顶", aria: "已清除峰顶：{cleared}/3" },
    ja: { label: "ピーク", aria: "クリアしたピーク：{cleared}/3" },
    ko: { label: "피크", aria: "클리어한 피크: {cleared}/3" },
    es: { label: "Cimas", aria: "Cimas despejadas: {cleared} de 3" },
    "pt-BR": { label: "Picos", aria: "Picos limpos: {cleared} de 3" },
    fr: { label: "Pics", aria: "Pics dégagés : {cleared} sur 3" },
    de: { label: "Gipfel", aria: "Geräumte Gipfel: {cleared} von 3" },
    it: { label: "Cime", aria: "Cime liberate: {cleared} su 3" },
    ru: { label: "Вершины", aria: "Очищено вершин: {cleared} из 3" },
    hi: { label: "चोटियाँ", aria: "साफ़ की गई चोटियाँ: {cleared} में से 3" },
    ar: { label: "القمم", aria: "القمم المُنظّفة: {cleared} من 3" },
  });
  const STOCK_RESERVE_COPY = Object.freeze({
    en: { half: "Stock reserve: {count} cards. Protect a useful chain before drawing.", low: "Only {count} Stock cards remain. Protect a useful chain before drawing.", last: "Last Stock card. Draw only when the chain has stopped.", empty: "Stock is empty. Only a visible chain can continue." },
    "zh-Hant": { half: "牌庫剩 {count} 張；翻牌前先保留有用的連鎖。", low: "牌庫只剩 {count} 張；翻牌前先保留有用的連鎖。", last: "牌庫只剩最後一張；連鎖停下時再翻牌。", empty: "牌庫已空；只能靠桌面上可接續的牌。" },
    "zh-Hans": { half: "牌库剩 {count} 张；翻牌前先保留有用的连锁。", low: "牌库只剩 {count} 张；翻牌前先保留有用的连锁。", last: "牌库只剩最后一张；连锁停下时再翻牌。", empty: "牌库已空；只能靠桌面上可接续的牌。" },
    ja: { half: "山札は残り{count}枚。引く前に有効な連鎖を残しましょう。", low: "山札は残り{count}枚。引く前に有効な連鎖を守りましょう。", last: "山札はあと1枚。連鎖が止まってから引きましょう。", empty: "山札は空です。場の連鎖だけが続けられます。" },
    ko: { half: "덱이 {count}장 남았습니다. 뽑기 전에 유효한 콤보를 지키세요.", low: "덱이 {count}장만 남았습니다. 뽑기 전에 유효한 콤보를 지키세요.", last: "덱이 마지막 1장입니다. 콤보가 끊겼을 때 뽑으세요.", empty: "덱이 비었습니다. 보이는 연속 수만 이어갈 수 있습니다." },
    es: { half: "Quedan {count} cartas en el mazo. Protege una cadena útil antes de robar.", low: "Solo quedan {count} cartas en el mazo. Protege una cadena útil antes de robar.", last: "Queda la última carta del mazo. Roba solo cuando se corte la cadena.", empty: "El mazo está vacío. Solo puede continuar una cadena visible." },
    "pt-BR": { half: "Restam {count} cartas no monte. Proteja uma sequência útil antes de comprar.", low: "Restam apenas {count} cartas no monte. Proteja uma sequência útil antes de comprar.", last: "Resta a última carta do monte. Compre só quando a sequência parar.", empty: "O monte está vazio. Só uma sequência visível pode continuar." },
    fr: { half: "Il reste {count} cartes dans la pioche. Préservez une chaîne utile avant de piocher.", low: "Il ne reste que {count} cartes dans la pioche. Préservez une chaîne utile avant de piocher.", last: "Dernière carte de la pioche. Piochez seulement quand la chaîne s’arrête.", empty: "La pioche est vide. Seule une chaîne visible peut continuer." },
    de: { half: "Noch {count} Karten im Stapel. Bewahre vor dem Ziehen eine gute Kette.", low: "Nur noch {count} Karten im Stapel. Bewahre vor dem Ziehen eine gute Kette.", last: "Letzte Stapelkarte. Ziehe erst, wenn die Kette endet.", empty: "Der Stapel ist leer. Nur eine sichtbare Kette kann weitergehen." },
    it: { half: "Restano {count} carte nel tallone. Prima di pescare, conserva una buona catena.", low: "Restano solo {count} carte nel tallone. Prima di pescare, conserva una buona catena.", last: "Ultima carta del tallone. Pesca solo quando la catena si ferma.", empty: "Il tallone è vuoto. Può continuare solo una catena visibile." },
    ru: { half: "В колоде осталось карт: {count}. Сохраните полезную цепочку перед добором.", low: "В колоде осталось всего карт: {count}. Сохраните полезную цепочку перед добором.", last: "Последняя карта колоды. Добирайте, только когда цепочка прервётся.", empty: "Колода пуста. Продолжить можно только видимой цепочкой." },
    hi: { half: "डेक में {count} पत्ते बचे हैं। लेने से पहले उपयोगी क्रम बचाएँ।", low: "डेक में केवल {count} पत्ते बचे हैं। लेने से पहले उपयोगी क्रम बचाएँ।", last: "डेक का आखिरी पत्ता है। क्रम रुकने पर ही लें।", empty: "डेक खाली है। केवल दिखता हुआ क्रम ही जारी रह सकता है।" },
    ar: { half: "تبقى {count} بطاقة في الرزمة. حافظ على سلسلة مفيدة قبل السحب.", low: "تبقى {count} بطاقات فقط في الرزمة. حافظ على سلسلة مفيدة قبل السحب.", last: "هذه آخر بطاقة في الرزمة. اسحب فقط بعد توقف السلسلة.", empty: "الرزمة فارغة. لا يمكن المتابعة إلا بسلسلة ظاهرة." },
  });

  const TRIPEAKS_RESULT_RECAP_COPY = Object.freeze({
    en: "Best chain: ×{chain} · Peaks cleared: {peaks}/3 · Score: {score} · Moves: {moves} · Deal: {seed}. Restart repeats this deal; New Game deals another.",
    "zh-Hant": "最佳連鎖：×{chain} · 峰頂：{peaks}/3 · 分數：{score} · 步數：{moves} · 牌局：{seed}。重新開始會重玩此牌局；新遊戲會發新牌局。",
    "zh-Hans": "最佳连锁：×{chain} · 峰顶：{peaks}/3 · 分数：{score} · 步数：{moves} · 牌局：{seed}。重新开始会重玩此牌局；新游戏会发新牌局。",
    ja: "ベストチェイン：×{chain} · クリアしたピーク：{peaks}/3 · スコア：{score} · 手数：{moves} · ディール：{seed}。リスタートは同じディール、新しいゲームは別のディールです。",
    ko: "최고 콤보: ×{chain} · 클리어한 피크: {peaks}/3 · 점수: {score} · 이동: {moves} · 딜: {seed}. 다시 시작은 같은 딜을 반복하고 새 게임은 다른 딜을 만듭니다.",
    es: "Mejor cadena: ×{chain} · Cimas despejadas: {peaks}/3 · Puntuación: {score} · Movimientos: {moves} · Reparto: {seed}. Reiniciar repite este reparto; Nueva partida crea otro.",
    "pt-BR": "Melhor sequência: ×{chain} · Picos limpos: {peaks}/3 · Pontuação: {score} · Movimentos: {moves} · Distribuição: {seed}. Reiniciar repete esta distribuição; Novo jogo cria outra.",
    fr: "Meilleure chaîne : ×{chain} · Pics dégagés : {peaks}/3 · Score : {score} · Coups : {moves} · Donne : {seed}. Recommencer rejoue cette donne ; Nouvelle partie en crée une autre.",
    de: "Beste Kette: ×{chain} · Geräumte Gipfel: {peaks}/3 · Punkte: {score} · Züge: {moves} · Deal: {seed}. Neustart spielt diesen Deal erneut; Neues Spiel gibt einen anderen.",
    it: "Miglior catena: ×{chain} · Cime liberate: {peaks}/3 · Punteggio: {score} · Mosse: {moves} · Distribuzione: {seed}. Ricomincia ripete questa distribuzione; Nuova partita ne crea un’altra.",
    ru: "Лучшая цепочка: ×{chain} · Очищено вершин: {peaks}/3 · Очки: {score} · Ходы: {moves} · Сдача: {seed}. Повторить — тот же расклад; новая игра — другой.",
    hi: "सर्वश्रेष्ठ क्रम: ×{chain} · साफ़ चोटियाँ: {peaks}/3 · स्कोर: {score} · चालें: {moves} · डील: {seed}। फिर शुरू करें इसी डील को दोहराता है; नया खेल दूसरी डील देता है।",
    ar: "أفضل سلسلة: ×{chain} · القمم المُنظّفة: {peaks}/3 · النقاط: {score} · الحركات: {moves} · التوزيع: {seed}. إعادة البدء تكرر هذا التوزيع؛ اللعبة الجديدة تعطي توزيعاً آخر.",
  });

  const TRIPEAKS_PERSONAL_TARGET_COPY = Object.freeze({
    en: "Personal chain target: reach ×{target} on the next deal.",
    "zh-Hant": "個人連鎖目標：下一局達到 ×{target}。",
    "zh-Hans": "个人连锁目标：下一局达到 ×{target}。",
    ja: "個人チェイン目標：次のディールで×{target}を目指しましょう。",
    ko: "개인 콤보 목표: 다음 딜에서 ×{target}을 달성하세요.",
    es: "Objetivo personal de cadena: alcanza ×{target} en el próximo reparto.",
    "pt-BR": "Meta pessoal de sequência: alcance ×{target} na próxima distribuição.",
    fr: "Objectif de chaîne personnel : atteignez ×{target} à la prochaine donne.",
    de: "Persönliches Kettenziel: Erreiche ×{target} beim nächsten Deal.",
    it: "Obiettivo personale di catena: raggiungi ×{target} nella prossima distribuzione.",
    ru: "Личная цель цепочки: достигните ×{target} в следующей сдаче.",
    hi: "व्यक्तिगत क्रम लक्ष्य: अगली डील में ×{target} तक पहुँचें।",
    ar: "هدف السلسلة الشخصي: حقق ×{target} في التوزيع التالي.",
  });

  const HINT_RATIONALE_COPY = Object.freeze({
    en: { peak: "Hint: this card clears a peak.", chain: "Hint: this card keeps the chain going.", reserve: "Hint: keep this chain before drawing; {count} Stock cards remain." },
    "zh-Hant": { peak: "提示：這張牌可以清除一座峰頂。", chain: "提示：這張牌可以延續連鎖。", reserve: "提示：翻牌前先保留這條連鎖；牌庫還剩 {count} 張。" },
    "zh-Hans": { peak: "提示：这张牌可以清除一座峰顶。", chain: "提示：这张牌可以延续连锁。", reserve: "提示：翻牌前先保留这条连锁；牌库还剩 {count} 张。" },
    ja: { peak: "ヒント：このカードでピークを1つ消せます。", chain: "ヒント：このカードでチェインを続けられます。", reserve: "ヒント：引く前にこのチェインを守りましょう。山札は残り{count}枚です。" },
    ko: { peak: "힌트: 이 카드로 피크 하나를 지울 수 있습니다.", chain: "힌트: 이 카드로 콤보를 이어갈 수 있습니다.", reserve: "힌트: 뽑기 전에 이 콤보를 지키세요. 덱이 {count}장 남았습니다." },
    es: { peak: "Pista: esta carta despeja una cima.", chain: "Pista: esta carta mantiene la cadena.", reserve: "Pista: conserva esta cadena antes de robar; quedan {count} cartas." },
    "pt-BR": { peak: "Dica: esta carta limpa um pico.", chain: "Dica: esta carta mantém a sequência.", reserve: "Dica: preserve esta sequência antes de comprar; restam {count} cartas." },
    fr: { peak: "Indice : cette carte dégage un pic.", chain: "Indice : cette carte prolonge la chaîne.", reserve: "Indice : préservez cette chaîne avant de piocher ; il reste {count} cartes." },
    de: { peak: "Tipp: Diese Karte räumt einen Gipfel.", chain: "Tipp: Diese Karte hält die Kette am Laufen.", reserve: "Tipp: Bewahre diese Kette vor dem Ziehen; noch {count} Karten im Stapel." },
    it: { peak: "Suggerimento: questa carta libera una cima.", chain: "Suggerimento: questa carta mantiene la catena.", reserve: "Suggerimento: conserva questa catena prima di pescare; restano {count} carte." },
    ru: { peak: "Подсказка: эта карта очищает вершину.", chain: "Подсказка: эта карта продолжает цепочку.", reserve: "Подсказка: сохраните цепочку перед добором; в колоде осталось карт: {count}." },
    hi: { peak: "संकेत: यह पत्ता एक चोटी साफ़ करता है।", chain: "संकेत: यह पत्ता क्रम जारी रखता है।", reserve: "संकेत: लेने से पहले यह क्रम बचाएँ; डेक में {count} पत्ते बचे हैं।" },
    ar: { peak: "تلميح: هذه البطاقة تزيل قمة.", chain: "تلميح: هذه البطاقة تُبقي السلسلة مستمرة.", reserve: "تلميح: حافظ على هذه السلسلة قبل السحب؛ تبقى {count} بطاقات في الرزمة." },
  });

  const hintRationale = (view, move) => {
    const copy = HINT_RATIONALE_COPY[view.locale] || HINT_RATIONALE_COPY.en;
    const entry = move?.source?.zone === "peak" ? view.game.cards[move.source.index] : null;
    const key = entry?.row === 0 ? "peak" : view.game.stock.length > 0 && view.game.stock.length <= 6 ? "reserve" : "chain";
    return copy[key].replace("{count}", String(view.game.stock.length));
  };

  const ensurePeakProgress = () => {
    const header = document.querySelector("#battleScreen .battle-header");
    if (!header) return null;
    const existing = document.getElementById("tripeaksPeakProgress");
    if (existing) return existing;
    const stat = document.createElement("div");
    stat.id = "tripeaksPeakProgress";
    stat.className = "header-stat tripeaks-progress-stat";
    stat.setAttribute("aria-live", "polite");
    stat.innerHTML = '<small id="tripeaksPeakProgressLabel">Peaks</small><strong id="tripeaksPeakProgressValue" aria-label="Peaks cleared: 0 of 3">0/3</strong>';
    header.append(stat);
    return stat;
  };

  const updatePeakProgress = (view) => {
    const stat = ensurePeakProgress();
    const label = document.getElementById("tripeaksPeakProgressLabel");
    const value = document.getElementById("tripeaksPeakProgressValue");
    if (!view?.game || !stat || !label || !value) return;
    const copy = PEAK_PROGRESS_COPY[view.locale] || PEAK_PROGRESS_COPY.en;
    const cleared = view.game.cards.filter((entry) => entry.row === 0 && entry.removed).length;
    label.textContent = copy.label;
    value.textContent = `${cleared}/3`;
    value.setAttribute("aria-label", copy.aria.replace("{cleared}", String(cleared)));
    stat.dataset.cleared = String(cleared);
    stat.dataset.complete = String(cleared === 3);
  };

  const stockReserveBand = (count) => {
    if (count <= 0) return "empty";
    if (count === 1) return "last";
    if (count <= 6) return "low";
    if (count <= 12) return "half";
    return "";
  };

  const updateStockReserveCue = (view) => {
    const status = view?.nodes?.boardStatus;
    if (!status || !view.game || view.game.won || view.game.lost) return;
    const count = view.game.stock.length;
    const band = stockReserveBand(count);
    if (!band) return;
    const copy = STOCK_RESERVE_COPY[view.locale] || STOCK_RESERVE_COPY.en;
    clearTimeout(view.statusTimer);
    view.statusTimer = null;
    status.setAttribute("data-runtime-localize", "off");
    status.dataset.state = "tripeaks-stock-reserve";
    status.textContent = copy[band].replace("{count}", String(count));
  };

  const mount = () => {
    const mainReturn = document.querySelector(".main-return");
    if (mainReturn && !mainReturn.querySelector("img")) {
      const logo = document.createElement("img");
      logo.src = "../../assets/weightplay-logo.png";
      logo.alt = "";
      mainReturn.append(logo);
    }
    document.getElementById("battleBackBtn")?.setAttribute("data-wp-return", "battle");
    const view = window.WPClassicSolitaire?.mount({ variant: "tripeaks", id: "tripeaks-solitaire" });
    if (!view) return;
    const dynamicCopy = () => TRIPEAKS_DYNAMIC_COPY[view.locale] || TRIPEAKS_DYNAMIC_COPY.en;
    const markGameOwned = (node) => node?.setAttribute("data-runtime-localize", "off");
    const updateDynamicCopy = () => {
      const copy = dynamicCopy();
      const buttonCopy = { startBtn: copy.start, restartBtn: copy.restart, newGameBtn: copy.newGame, battleNewBtn: copy.newGame, battleRestartBtn: copy.restart, resultNewGame: copy.newGame, resultRestart: copy.restart };
      Object.entries(buttonCopy).forEach(([id, text]) => { const node = document.getElementById(id); if (!node) return; node.textContent = text; markGameOwned(node); });
      const headerLabels = [...document.querySelectorAll("#battleScreen .battle-header .header-stat small")];
      [copy.moves, copy.score, copy.combo].forEach((text, index) => { if (headerLabels[index]) { headerLabels[index].textContent = text; markGameOwned(headerLabels[index]); } });
      const back = document.getElementById("battleBackBtn");
      if (back) { back.setAttribute("aria-label", copy.back); markGameOwned(back); }
      const cards = new Map();
      (view.game?.cards || []).forEach((entry) => { if (entry.card) cards.set(String(entry.card.id), entry.card); });
      (view.game?.waste || []).forEach((card) => cards.set(String(card.id), card));
      document.querySelectorAll("#battleScreen [data-card-id]").forEach((node) => {
        const card = cards.get(String(node.dataset.cardId));
        if (!card?.faceUp) return;
        const rank = TRIPEAKS_RANKS[card.rank - 1] || String(card.rank);
        const suit = copy.suits[card.suit] || card.suit;
        node.setAttribute("aria-label", fillTriPeaksCopy(copy.ariaCard, { rank, suit }));
        markGameOwned(node);
      });
    };
    updateDynamicCopy();
    const showResult = view.showResult?.bind(view);
    const updatePersonalTarget = () => {
      const current = Math.max(0, Number(view.game?.bestCombo) || 0);
      let personalBest = 0;
      try { personalBest = Math.max(0, Number(window.localStorage.getItem("weightplay-tripeaks-personal-chain-best")) || 0); } catch (_) {}
      personalBest = Math.max(personalBest, current);
      try { window.localStorage.setItem("weightplay-tripeaks-personal-chain-best", String(personalBest)); } catch (_) {}
      const copy = TRIPEAKS_PERSONAL_TARGET_COPY[view.locale] || TRIPEAKS_PERSONAL_TARGET_COPY.en;
      return copy.replace("{target}", String(Math.max(1, personalBest + 1)));
    };
    const updateResultRecap = () => {
      if (!view.nodes?.resultText || (!view.game.won && !view.game.lost)) return;
      const copy = TRIPEAKS_RESULT_RECAP_COPY[view.locale] || TRIPEAKS_RESULT_RECAP_COPY.en;
      const peaks = view.game.cards.filter((entry) => entry.row === 0 && entry.removed).length;
      const recap = copy.replace(/\{(chain|peaks|score|moves|seed)\}/gu, (_match, key) => ({
        chain: view.game.bestCombo,
        peaks,
        score: view.game.bestCombo,
        moves: view.game.moves,
        seed: view.game.seed,
      }[key]));
      view.nodes.resultText.textContent = `${recap} ${updatePersonalTarget()}`;
    };
    if (showResult) view.showResult = () => { showResult(); if (view.nodes?.resultOverlay) view.nodes.resultOverlay.dataset.outcome = view.game.won ? "success" : "failure"; updateResultRecap(); };
    let reserveRestoreTimer = null;
    const scheduleReserveRestore = () => {
      clearTimeout(reserveRestoreTimer);
      reserveRestoreTimer = setTimeout(() => updateStockReserveCue(view), 1550);
    };
    const showTriPeaksCue = view.showTriPeaksCue?.bind(view);
    if (showTriPeaksCue) {
      view.showTriPeaksCue = (...args) => {
        const result = showTriPeaksCue(...args);
        scheduleReserveRestore();
        return result;
      };
    }
    const hint = view.hint?.bind(view);
    if (hint) {
      view.hint = (...args) => {
        const result = hint(...args);
        const move = view.hintMove;
        if (move && view.nodes?.boardStatus && !view.game.won && !view.game.lost) {
          view.nodes.boardStatus.setAttribute("data-runtime-localize", "off");
          view.nodes.boardStatus.dataset.state = "tripeaks-hint-rationale";
          view.nodes.boardStatus.textContent = hintRationale(view, move);
        }
        return result;
      };
    }
    const feedback = view.feedback?.bind(view);
    if (feedback) {
      view.feedback = (...args) => {
        const result = feedback(...args);
        scheduleReserveRestore();
        return result;
      };
    }
    const render = view.render.bind(view);
    view.render = (...args) => {
      const result = render(...args);
      updateDynamicCopy();
      updatePeakProgress(view);
      updateStockReserveCue(view);
      return result;
    };
    updatePeakProgress(view);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
