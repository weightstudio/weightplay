(() => {
  "use strict";

  const GAME_VERSION = "v13";
  const COPY = {
    en: { start: "Start Game", back: "Back", resultNewGame: "New Game", resultRestart: "Restart", resultClose: "Close", heading: "How to play", paragraph: "Complete four-of-a-kind books. Choose two, three, or four players in the preview build." },
    "zh-Hant": { start: "開始遊戲", back: "返回", resultNewGame: "新遊戲", resultRestart: "重新開始", resultClose: "關閉", heading: "遊戲玩法", paragraph: "完成四張同點數牌的組牌。預覽版可選擇兩人、三人或四人。" },
    "zh-Hans": { start: "开始游戏", back: "返回", resultNewGame: "新游戏", resultRestart: "重新开始", resultClose: "关闭", heading: "游戏玩法", paragraph: "完成四张同点数牌的组牌。预览版可选择两人、三人或四人。" },
    ja: { start: "ゲーム開始", back: "戻る", resultNewGame: "新しいゲーム", resultRestart: "リスタート", resultClose: "閉じる", heading: "遊び方", paragraph: "同じランク4枚の組を完成させます。プレビュー版では2〜4人を選べます。" },
    ko: { start: "게임 시작", back: "돌아가기", resultNewGame: "새 게임", resultRestart: "다시 시작", resultClose: "닫기", heading: "게임 방법", paragraph: "같은 랭크 네 장 세트를 완성하세요. 프리뷰에서는 2·3·4인 게임을 선택할 수 있습니다." },
    es: { start: "Empezar", back: "Volver", resultNewGame: "Nuevo juego", resultRestart: "Reiniciar", resultClose: "Cerrar", heading: "Cómo jugar", paragraph: "Completa grupos de cuatro cartas del mismo rango. En la vista previa puedes elegir 2, 3 o 4 jugadores." },
    "pt-BR": { start: "Começar jogo", back: "Voltar", resultNewGame: "Novo jogo", resultRestart: "Reiniciar", resultClose: "Fechar", heading: "Como jogar", paragraph: "Complete grupos de quatro cartas do mesmo valor. A prévia permite escolher 2, 3 ou 4 jogadores." },
    fr: { start: "Commencer", back: "Retour", resultNewGame: "Nouvelle partie", resultRestart: "Recommencer", resultClose: "Fermer", heading: "Comment jouer", paragraph: "Complétez des familles de quatre cartes du même rang. L’aperçu permet de choisir 2, 3 ou 4 joueurs." },
    de: { start: "Spiel starten", back: "Zurück", resultNewGame: "Neues Spiel", resultRestart: "Neustart", resultClose: "Schließen", heading: "Spielanleitung", paragraph: "Bilde Vierlinge aus vier Karten desselben Rangs. In der Vorschau kannst du 2, 3 oder 4 Spieler wählen." },
    it: { start: "Inizia partita", back: "Indietro", resultNewGame: "Nuova partita", resultRestart: "Riavvia", resultClose: "Chiudi", heading: "Come si gioca", paragraph: "Completa combinazioni di quattro carte dello stesso valore. Nell’anteprima puoi scegliere 2, 3 o 4 giocatori." },
    ru: { start: "Начать игру", back: "Назад", resultNewGame: "Новая игра", resultRestart: "Заново", resultClose: "Закрыть", heading: "Как играть", paragraph: "Соберите четвёрки из четырёх карт одного ранга. В предпросмотре можно выбрать 2, 3 или 4 игроков." },
    hi: { start: "खेल शुरू करें", back: "वापस", resultNewGame: "नया खेल", resultRestart: "फिर शुरू करें", resultClose: "बंद करें", heading: "कैसे खेलें", paragraph: "एक ही रैंक के चार पत्तों का सेट पूरा करें। प्रीव्यू में 2, 3 या 4 खिलाड़ी चुनें।" },
    ar: { start: "بدء اللعبة", back: "رجوع", resultNewGame: "لعبة جديدة", resultRestart: "إعادة التشغيل", resultClose: "إغلاق", heading: "طريقة اللعب", paragraph: "أكمل مجموعات من أربع بطاقات من الرتبة نفسها. يمكنك اختيار لاعبين أو ثلاثة أو أربعة في المعاينة." },
  };
  const RECENT_ASK_COPY = {
    en: "Recent asks: {items}",
    "zh-Hant": "最近提問：{items}",
    "zh-Hans": "最近提问：{items}",
    ja: "最近の質問：{items}",
    ko: "최근 질문: {items}",
    es: "Preguntas recientes: {items}",
    "pt-BR": "Perguntas recentes: {items}",
    fr: "Questions récentes : {items}",
    de: "Letzte Fragen: {items}",
    it: "Domande recenti: {items}",
    ru: "Последние вопросы: {items}",
    hi: "हाल के सवाल: {items}",
    ar: "أحدث الأسئلة: {items}",
  };
  const locale = document.documentElement.lang || "en";
  const copy = COPY[locale] || COPY.en;
  const recentAskCopy = RECENT_ASK_COPY[locale] || RECENT_ASK_COPY.en;
  const recentAsks = [];
  let selectedOpponentName = "";

  function resetRecentAsks() {
    recentAsks.length = 0;
    selectedOpponentName = "";
    window.setTimeout(syncRecentAskRecord, 0);
  }

  function syncRecentAskRecord() {
    const center = document.querySelector("#cardGameCenter");
    if (!center) return;
    if (!selectedOpponentName) {
      selectedOpponentName = center.closest(".card-game-battle")?.querySelector('[data-action="opponent"] strong')?.textContent?.trim() || "";
    }
    const existing = center.querySelector("[data-go-fish-recent-asks]");
    if (!recentAsks.length) {
      existing?.remove();
      return;
    }
    const text = recentAskCopy.replace("{items}", recentAsks.map((entry, index) => `${index + 1}. ${entry.rank} → ${entry.opponent}`).join(" · "));
    const record = existing || document.createElement("p");
    record.className = "card-choice-summary card-go-fish-recent-asks";
    record.dataset.goFishRecentAsks = "";
    record.dataset.runtimeLocalize = "off";
    record.setAttribute("role", "status");
    record.setAttribute("aria-live", "polite");
    if (record.textContent !== text) record.textContent = text;
    if (!existing) center.append(record);
  }

  function observeBattleRecord() {
    const center = document.querySelector("#cardGameCenter");
    if (!center) return;
    new MutationObserver(syncRecentAskRecord).observe(center, { childList: true, subtree: true });
    syncRecentAskRecord();
  }

  function applyLocaleOwnedResultActions() {
    [
      ["#resultNewGame", copy.resultNewGame],
      ["#resultRestart", copy.resultRestart],
      ["#resultClose", copy.resultClose],
    ].forEach(([selector, label]) => {
      const button = document.querySelector(selector);
      if (!button) return;
      button.textContent = label;
      button.setAttribute("aria-label", label);
      button.dataset.runtimeLocalize = "off";
    });
  }

  function applyLocaleOwnedEntryCopy() {
    const start = document.querySelector("#startBtn");
    if (start) {
      start.textContent = copy.start;
      start.dataset.runtimeLocalize = "off";
    }
    const battleBack = document.querySelector("#battleBackBtn");
    if (battleBack) {
      battleBack.setAttribute("aria-label", copy.back);
      battleBack.dataset.runtimeLocalize = "off";
    }
    const guide = document.querySelector("[data-card-quick-guide]");
    const heading = guide?.querySelector("strong");
    if (guide && heading) {
      heading.textContent = copy.heading;
      guide.replaceChildren(heading, document.createTextNode(`: ${copy.paragraph}`));
      guide.dataset.runtimeLocalize = "off";
    }
    applyLocaleOwnedResultActions();
  }

  document.body.dataset.gameVersion = GAME_VERSION;
  document.body.dataset.interfaceVersion = "6";
  document.addEventListener("click", (event) => {
    const opponent = event.target?.closest?.('[data-action="opponent"]');
    if (opponent) {
      selectedOpponentName = opponent.querySelector("strong")?.textContent?.trim() || selectedOpponentName;
      return;
    }
    const players = event.target?.closest?.('[data-action="players"]');
    if (players) {
      resetRecentAsks();
      return;
    }
    const ask = event.target?.closest?.('[data-action="ask"]');
    if (ask && !ask.disabled) {
      const rank = document.querySelector('[data-action="rank"].is-selected')?.textContent?.trim();
      const opponentName = selectedOpponentName || document.querySelector('[data-action="opponent"] strong')?.textContent?.trim();
      if (rank && opponentName) {
        recentAsks.unshift({ rank, opponent: opponentName });
        recentAsks.splice(3);
        window.setTimeout(syncRecentAskRecord, 0);
      }
      return;
    }
    if (event.target?.closest?.("#startBtn, #restartBtn, #newGameBtn, #resultNewGame, #resultRestart, #battleRestartBtn, #battleNewBtn")) {
      resetRecentAsks();
    }
  }, true);

  window.WPCardGamesNext?.mount({ id: "go-fish" });
  observeBattleRecord();
  applyLocaleOwnedEntryCopy();
  [40, 120, 300, 600].forEach((delay) => window.setTimeout(applyLocaleOwnedEntryCopy, delay));
})();
