(function () {
  "use strict";

  // Old Maid uses the shared card-game shell, but owns two small shell
  // surfaces that the generic Stage progress heuristic cannot infer: the
  // blind-draw progress cue on Main and the Battle utility slot. Create them
  // before mounting so the Shell and card runtime adopt the same stable DOM
  // nodes on every localized route.
  // The shared shell is the sole visible Settings owner. Keep the legacy
  // audio nodes available for the card runtime to adopt its locale controls,
  // but remove their button and popover from the active accessibility tree so
  // the Main header cannot expose two Settings affordances.
  const legacySettingsButton = document.querySelector("#audioMenuBtn");
  if (legacySettingsButton) {
    legacySettingsButton.hidden = true;
    legacySettingsButton.setAttribute("aria-hidden", "true");
    legacySettingsButton.tabIndex = -1;
  }
  const legacySettingsPopover = document.querySelector("#audioPopover");
  if (legacySettingsPopover) legacySettingsPopover.hidden = true;

  const handLabels = {
    en: "Your hand",
    "zh-Hant": "你的手牌",
    "zh-Hans": "你的手牌",
    ja: "手札",
    ko: "내 패",
    es: "Tu mano",
    "pt-BR": "Sua mão",
    fr: "Votre main",
    de: "Deine Hand",
    it: "La tua mano",
    ru: "Ваша рука",
    hi: "आपके पत्ते",
    ar: "يدك",
  };
  const mainProgressCopy = {
    en: ["Blind-draw pairs", "Clear pairs and avoid the Old Maid."],
    "zh-Hant": ["盲抽配對", "消除配對，別讓鬼牌留在手上。"],
    "zh-Hans": ["盲抽配对", "消除配对，别让鬼牌留在手上。"],
    ja: ["裏引きのペア", "ペアを消し、ババを残さない。"],
    ko: ["맹목적 뽑기 짝", "짝을 없애고 버바를 남기지 마세요."],
    es: ["Parejas a ciegas", "Elimina parejas y evita la vieja solterona."],
    "pt-BR": ["Pares às cegas", "Elimine os pares e evite ficar com o Mico."],
    fr: ["Paires à l’aveugle", "Éliminez les paires et évitez le Pouilleux."],
    de: ["Verdeckte Paare", "Entferne Paare und vermeide den Schwarzen Peter."],
    it: ["Coppie alla cieca", "Elimina le coppie ed evita di restare con l’Asino."],
    ru: ["Пары вслепую", "Убирайте пары и не оставляйте Старую деву."],
    hi: ["छिपी जोड़ियाँ", "जोड़ियाँ हटाएँ और ओल्ड मेड से बचें।"],
    ar: ["أزواج السحب الأعمى", "أزل الأزواج وتجنب الاحتفاظ بالعانس."],
  };
  const syncHandLabel = () => {
    const label = document.querySelector(".card-game-player-header strong");
    if (!label) return;
    const locale = document.documentElement.lang || "en";
    label.textContent = handLabels[locale] || handLabels.en;
    label.setAttribute("data-runtime-localize", "off");
  };
  window.addEventListener("wonder:locale-change", syncHandLabel);
  window.addEventListener("weightplay:shell-sync", syncHandLabel);

  const mainCopy = document.querySelector("#mainScreen .main-copy");
  if (mainCopy && !mainCopy.querySelector("[data-wp-main-progress]")) {
    const progress = document.createElement("div");
    progress.className = "main-progress";
    progress.dataset.wpMainProgress = "true";
    progress.setAttribute("role", "status");
    progress.setAttribute("aria-live", "polite");
    const [progressLabel, progressText] = mainProgressCopy[document.documentElement.lang] || mainProgressCopy.en;
    const label = document.createElement("strong");
    label.textContent = progressLabel;
    label.setAttribute("data-runtime-localize", "off");
    const copy = document.createElement("span");
    copy.textContent = progressText;
    copy.setAttribute("data-runtime-localize", "off");
    progress.append(label, copy);
    mainCopy.insertBefore(progress, mainCopy.querySelector(".main-actions") || null);
  }

  const topbar = document.querySelector("#battleScreen .card-game-topbar");
  // Localized static routes may still contain a translated back label. Establish
  // the same single shared arrow node before shell or runtime localization runs.
  const battleReturn = document.querySelector("#battleBackBtn");
  if (battleReturn) {
    const arrow = document.createElement("span");
    arrow.className = "wp-shell-return-arrow";
    arrow.textContent = "←";
    arrow.setAttribute("aria-hidden", "true");
    arrow.setAttribute("data-runtime-localize", "off");
    battleReturn.replaceChildren(arrow);
  }
  if (topbar && !topbar.querySelector("[data-wp-battle-utility]")) {
    const utility = document.createElement("button");
    utility.id = "battleUtilityBtn";
    utility.className = "battle-utility header-icon-btn";
    utility.type = "button";
    utility.dataset.wpBattleUtility = "true";
    utility.setAttribute("aria-label", "Settings");
    utility.title = "Settings";
    utility.textContent = "⚙";
    topbar.append(utility);
  }

  // Old Maid pairs automatically: only face-down opponent cards are inputs.
  // The shared card renderer also serves games where the player's hand is
  // selectable, so keep this rule local instead of changing those games.
  const hand = document.querySelector("#cardGameHand");
  const makeHandReadOnly = () => {
    hand?.querySelectorAll("button[data-card-index]").forEach((button) => {
      const card = document.createElement("span");
      card.className = button.className;
      card.setAttribute("role", "img");
      card.setAttribute("aria-label", button.getAttribute("aria-label") || button.textContent);
      card.setAttribute("data-runtime-localize", "off");
      card.textContent = button.textContent;
      button.replaceWith(card);
    });
  };
  if (hand) {
    // Guard the interval before MutationObserver runs after each render too.
    hand.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    }, true);
    new MutationObserver(makeHandReadOnly).observe(hand, { childList: true });
  }
  const leaveCopy = {
    en: ["Leave this round?", "This round's cards and pairs will be discarded. Saved win/loss totals stay unchanged.", "Continue playing", "Return to Main"],
    "zh-Hant": ["離開這局？", "本局手牌與配對進度將捨棄，已儲存的勝負紀錄不變。", "繼續遊戲", "返回主畫面"],
    "zh-Hans": ["离开这局？", "本局手牌与配对进度将舍弃，已保存的胜负记录不变。", "继续游戏", "返回主画面"],
    ja: ["この対局を終了しますか？", "今回の手札とペアの進行状況は失われます。保存済みの勝敗記録は変わりません。", "対局を続ける", "メインに戻る"],
    ko: ["이번 판을 나갈까요?", "이번 판의 손패와 짝 맞추기 진행은 사라집니다. 저장된 승패 기록은 유지됩니다.", "계속 플레이", "메인으로 돌아가기"],
    es: ["¿Salir de esta ronda?", "Se descartarán las cartas y parejas de esta ronda. El historial guardado de victorias y derrotas no cambiará.", "Seguir jugando", "Volver al inicio"],
    "pt-BR": ["Sair desta rodada?", "As cartas e os pares desta rodada serão descartados. O histórico salvo de vitórias e derrotas não mudará.", "Continuar jogando", "Voltar ao início"],
    fr: ["Quitter cette manche ?", "Les cartes et les paires de cette manche seront perdues. Le bilan enregistré des victoires et défaites restera inchangé.", "Continuer à jouer", "Revenir à l’accueil"],
    de: ["Diese Runde verlassen?", "Die Karten und Paare dieser Runde gehen verloren. Gespeicherte Siege und Niederlagen bleiben unverändert.", "Weiterspielen", "Zur Startseite"],
    it: ["Uscire da questa mano?", "Le carte e le coppie di questa mano andranno perse. Le vittorie e le sconfitte salvate resteranno invariate.", "Continua a giocare", "Torna all’inizio"],
    ru: ["Выйти из раунда?", "Карты и пары текущего раунда будут потеряны. Сохранённые победы и поражения не изменятся.", "Продолжить игру", "На главный экран"],
    hi: ["इस राउंड से बाहर जाएँ?", "इस राउंड के पत्ते और जोड़े हटा दिए जाएँगे। सहेजे गए जीत और हार के रिकॉर्ड नहीं बदलेंगे।", "खेलते रहें", "मुख्य स्क्रीन पर लौटें"],
    ar: ["مغادرة هذه الجولة؟", "ستُحذف بطاقات هذه الجولة وأزواجها. سيبقى سجل الفوز والخسارة المحفوظ دون تغيير.", "متابعة اللعب", "العودة إلى الرئيسية"],
  };
  const canvas = document.querySelector("#battleScreen .battle-canvas");
  const table = canvas.querySelector(".card-table-ui");
  const panel = document.createElement("section");
  panel.id = "oldMaidLeavePanel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "oldMaidLeaveTitle");
  panel.setAttribute("aria-describedby", "oldMaidLeaveMessage");
  panel.setAttribute("data-runtime-localize", "off");
  panel.innerHTML = '<h2 id="oldMaidLeaveTitle"></h2><p id="oldMaidLeaveMessage"></p><div><button id="oldMaidContinue" class="primary-btn" type="button"></button><button id="oldMaidLeave" class="secondary-btn" type="button"></button></div>';
  canvas.append(panel);
  const continueButton = panel.querySelector("#oldMaidContinue");
  const leaveButton = panel.querySelector("#oldMaidLeave");
  let pendingReturn = null;
  const settleReturn = (leave) => {
    if (!pendingReturn) return;
    const pending = pendingReturn;
    pendingReturn = null;
    panel.hidden = true;
    table.inert = false;
    if (leave) pending.leave();
    else {
      pending.resume();
      document.querySelector("#battleBackBtn").focus({ preventScroll: true });
    }
  };
  continueButton.addEventListener("click", () => settleReturn(false));
  leaveButton.addEventListener("click", () => settleReturn(true));
  panel.addEventListener("keydown", (event) => {
    if (event.repeat && ["Enter", " "].includes(event.key)) event.preventDefault();
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); settleReturn(false); }
    if (event.key === "Tab") {
      event.preventDefault();
      (document.activeElement === continueButton ? leaveButton : continueButton).focus({ preventScroll: true });
    }
  });
  window.WPCardGamesNext?.mount({ id: "old-maid", requestReturn(callbacks) {
    if (pendingReturn) return;
    pendingReturn = callbacks;
    const copy = leaveCopy[document.documentElement.lang] || leaveCopy.en;
    panel.querySelector("h2").textContent = copy[0];
    panel.querySelector("p").textContent = copy[1];
    continueButton.textContent = copy[2];
    leaveButton.textContent = copy[3];
    table.inert = true;
    panel.hidden = false;
    continueButton.focus({ preventScroll: true });
  } });
  makeHandReadOnly();
  syncHandLabel();
  window.setTimeout(syncHandLabel, 0);
  window.setTimeout(syncHandLabel, 400);
})();
