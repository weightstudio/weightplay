(() => {
  "use strict";

  const GAME_VERSION = "v21";
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
  const REPLAY_GOAL_KEY = "weightplay:go-fish:replay-goal:v20";
  const REPLAY_GOAL_COPY = {
    en: { label: "Replay goal", next: "Complete the {rank} book in a fresh deal.", full: "Complete every book in a fresh deal.", complete: "Replay goal complete: {rank} book.", fullComplete: "Replay goal complete: every book.", pending: "Start a fresh deal to begin this goal." },
    "zh-Hant": { label: "重玩目標", next: "在新牌局完成 {rank} 組牌。", full: "在新牌局完成全部組牌。", complete: "重玩目標完成：{rank} 組牌。", fullComplete: "重玩目標完成：全部組牌。", pending: "開始新牌局以啟動這個目標。" },
    "zh-Hans": { label: "重玩目标", next: "在新牌局完成 {rank} 组牌。", full: "在新牌局完成全部组牌。", complete: "重玩目标完成：{rank} 组牌。", fullComplete: "重玩目标完成：全部组牌。", pending: "开始新牌局以启动这个目标。" },
    ja: { label: "リプレイ目標", next: "新しいディールで {rank} の組を完成させる。", full: "新しいディールですべての組を完成させる。", complete: "リプレイ目標達成：{rank} の組。", fullComplete: "リプレイ目標達成：すべての組。", pending: "新しいディールを始めてこの目標に挑戦。" },
    ko: { label: "다시 하기 목표", next: "새 딜에서 {rank} 세트를 완성하세요.", full: "새 딜에서 모든 세트를 완성하세요.", complete: "다시 하기 목표 완료: {rank} 세트.", fullComplete: "다시 하기 목표 완료: 모든 세트.", pending: "새 딜을 시작해 이 목표를 시작하세요." },
    es: { label: "Meta de repetición", next: "Completa el grupo de {rank} en una partida nueva.", full: "Completa todos los grupos en una partida nueva.", complete: "Meta de repetición cumplida: grupo de {rank}.", fullComplete: "Meta de repetición cumplida: todos los grupos.", pending: "Inicia una partida nueva para comenzar esta meta." },
    "pt-BR": { label: "Meta de replay", next: "Complete o grupo de {rank} em uma nova rodada.", full: "Complete todos os grupos em uma nova rodada.", complete: "Meta de replay concluída: grupo de {rank}.", fullComplete: "Meta de replay concluída: todos os grupos.", pending: "Comece uma nova rodada para iniciar esta meta." },
    fr: { label: "Objectif de revanche", next: "Complétez la famille de {rank} dans une nouvelle manche.", full: "Complétez toutes les familles dans une nouvelle manche.", complete: "Objectif de revanche atteint : famille de {rank}.", fullComplete: "Objectif de revanche atteint : toutes les familles.", pending: "Commencez une nouvelle manche pour lancer cet objectif." },
    de: { label: "Wiederholungsziel", next: "Vervollständige den Vierling {rank} in einer neuen Runde.", full: "Vervollständige alle Vierlinge in einer neuen Runde.", complete: "Wiederholungsziel geschafft: Vierling {rank}.", fullComplete: "Wiederholungsziel geschafft: alle Vierlinge.", pending: "Starte eine neue Runde, um dieses Ziel zu beginnen." },
    it: { label: "Obiettivo replay", next: "Completa la combinazione di {rank} in una nuova partita.", full: "Completa tutte le combinazioni in una nuova partita.", complete: "Obiettivo replay completato: combinazione di {rank}.", fullComplete: "Obiettivo replay completato: tutte le combinazioni.", pending: "Avvia una nuova partita per iniziare questo obiettivo." },
    ru: { label: "Цель повтора", next: "Соберите четвёрку {rank} в новой партии.", full: "Соберите все четвёрки в новой партии.", complete: "Цель повтора выполнена: четвёрка {rank}.", fullComplete: "Цель повтора выполнена: все четвёрки.", pending: "Начните новую партию, чтобы запустить эту цель." },
    hi: { label: "दोबारा खेलने का लक्ष्य", next: "नए खेल में {rank} का सेट पूरा करें।", full: "नए खेल में सभी सेट पूरे करें।", complete: "दोबारा खेलने का लक्ष्य पूरा: {rank} सेट।", fullComplete: "दोबारा खेलने का लक्ष्य पूरा: सभी सेट।", pending: "इस लक्ष्य को शुरू करने के लिए नया खेल शुरू करें।" },
    ar: { label: "هدف الإعادة", next: "أكمل مجموعة {rank} في جولة جديدة.", full: "أكمل كل المجموعات في جولة جديدة.", complete: "اكتمل هدف الإعادة: مجموعة {rank}.", fullComplete: "اكتمل هدف الإعادة: كل المجموعات.", pending: "ابدأ جولة جديدة لبدء هذا الهدف." },
  };
  const locale = document.documentElement.lang || "en";
  const copy = COPY[locale] || COPY.en;
  const recentAskCopy = RECENT_ASK_COPY[locale] || RECENT_ASK_COPY.en;
  const recentAsks = [];
  let selectedOpponentName = "";
  let lastReplayResultSignature = "";

  function readReplayGoal() {
    try {
      const parsed = JSON.parse(localStorage.getItem(REPLAY_GOAL_KEY) || "null");
      if (!parsed || typeof parsed !== "object") return null;
      const rank = Number(parsed.rank);
      const full = parsed.full === true;
      if (!full && (!Number.isInteger(rank) || rank < 1 || rank > 13)) return null;
      return {
        rank: full ? null : rank,
        rankLabel: typeof parsed.rankLabel === "string" ? parsed.rankLabel : "",
        full,
        active: parsed.active === true,
        completed: parsed.completed === true,
      };
    } catch (_error) {
      return null;
    }
  }

  function writeReplayGoal(goal) {
    try { localStorage.setItem(REPLAY_GOAL_KEY, JSON.stringify(goal)); } catch (_error) {}
  }

  function readReplayTarget() {
    const progress = document.querySelector(".card-book-progress");
    const target = progress?.querySelector("[data-go-fish-target-rank], [data-go-fish-target-full]");
    if (!progress || !target) return null;
    const full = target.hasAttribute("data-go-fish-target-full");
    const rank = Number(target.dataset.goFishTargetRank);
    if (!full && (!Number.isInteger(rank) || rank < 1 || rank > 13)) return null;
    return { rank: full ? null : rank, rankLabel: target.dataset.goFishTargetLabel || "", full };
  }

  function captureReplayGoalFromResult() {
    const overlay = document.querySelector("#resultOverlay");
    if (!overlay || overlay.hidden) return;
    const target = readReplayTarget();
    if (!target) return;
    const signature = `${target.full ? "full" : target.rank}|${target.rankLabel}|${document.querySelector("#resultText")?.textContent || ""}`;
    if (signature === lastReplayResultSignature) return;
    lastReplayResultSignature = signature;
    writeReplayGoal({ ...target, active: false, completed: false, createdAt: new Date().toISOString() });
  }

  function activateReplayGoal() {
    const goal = readReplayGoal();
    if (!goal) return;
    goal.active = true;
    goal.completed = false;
    writeReplayGoal(goal);
  }

  function markReplayGoalComplete() {
    const goal = readReplayGoal();
    if (!goal || !goal.active || goal.completed) return;
    const progress = document.querySelector(".card-book-progress");
    const ranks = String(progress?.dataset.goFishBookRanks || "").split(",").filter(Boolean).map(Number);
    if (goal.full ? ranks.length >= 13 : ranks.includes(goal.rank)) {
      goal.completed = true;
      writeReplayGoal(goal);
    }
  }

  function replayGoalText(goal) {
    const copy = REPLAY_GOAL_COPY[locale] || REPLAY_GOAL_COPY.en;
    let template;
    if (goal.completed) template = goal.full ? copy.fullComplete : copy.complete;
    else if (!goal.active) template = copy.pending;
    else template = goal.full ? copy.full : copy.next;
    return `${copy.label}: ${template.replace("{rank}", goal.rankLabel || "?")}`;
  }

  function renderReplayGoal(host, resultSurface = false) {
    if (!host) return;
    let node = host.querySelector("[data-go-fish-replay-goal]");
    const goal = readReplayGoal();
    if (!goal) {
      node?.remove();
      return;
    }
    if (!node) {
      node = document.createElement("p");
      node.className = "card-choice-summary card-go-fish-replay-goal";
      node.dataset.goFishReplayGoal = "true";
      node.dataset.runtimeLocalize = "off";
      node.setAttribute("role", "status");
      node.setAttribute("aria-live", "polite");
      if (resultSurface) {
        const actions = host.querySelector(".result-actions");
        if (actions) host.insertBefore(node, actions);
        else host.append(node);
      } else host.prepend(node);
    }
    const text = replayGoalText(goal);
    if (node.textContent !== text) node.textContent = text;
  }

  function syncReplayGoalSurface() {
    markReplayGoalComplete();
    captureReplayGoalFromResult();
    renderReplayGoal(document.querySelector(".result-card"), true);
    renderReplayGoal(document.querySelector("#cardGameCenter"));
  }

  function observeReplayGoal() {
    const center = document.querySelector("#cardGameCenter");
    if (center) new MutationObserver(syncReplayGoalSurface).observe(center, { childList: true, subtree: true });
    const overlay = document.querySelector("#resultOverlay");
    if (overlay) new MutationObserver(syncReplayGoalSurface).observe(overlay, { attributes: true, attributeFilter: ["hidden"], childList: true, subtree: true });
    syncReplayGoalSurface();
  }

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
      activateReplayGoal();
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
      activateReplayGoal();
    }
  }, true);

  window.WPCardGamesNext?.mount({ id: "go-fish" });
  observeBattleRecord();
  observeReplayGoal();
  applyLocaleOwnedEntryCopy();
  [40, 120, 300, 600].forEach((delay) => window.setTimeout(() => { applyLocaleOwnedEntryCopy(); syncReplayGoalSurface(); }, delay));
})();
