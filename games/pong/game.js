const GAME_VERSION = "v7";
window.WPPopularArcade?.mount("pong");
document.body.dataset.gameVersion = GAME_VERSION;
(() => {
  "use strict";
  const HINTS = {
    en: "Move Left or Right to place the paddle under the highlighted ball before Serve; each Serve settles one rally.",
    "zh-Hant": "發球前用左移或右移，讓球拍對準高亮球；每次發球結算一回合。",
    "zh-Hans": "发球前用左移或右移，让球拍对准高亮球；每次发球结算一回合。",
    ja: "サーブ前に左か右でラケットを光るボールの下に合わせましょう。1回のサーブで1ラリーが決まります。",
    ko: "서브 전에 왼쪽이나 오른쪽으로 패들을 강조된 공 아래에 맞추세요. 서브 한 번마다 랠리 하나가 결정됩니다.",
    es: "Mueve la pala a izquierda o derecha para ponerla bajo la pelota resaltada antes del saque; cada saque resuelve un rally.",
    "pt-BR": "Mova a raquete para a esquerda ou direita até ficar sob a bola destacada antes do saque; cada saque resolve um rali.",
    fr: "Déplacez la raquette à gauche ou à droite pour la placer sous la balle en surbrillance avant le service ; chaque service règle un échange.",
    de: "Bewege den Schläger vor dem Aufschlag nach links oder rechts unter den hervorgehobenen Ball; jeder Aufschlag entscheidet einen Ballwechsel.",
    it: "Sposta la racchetta a sinistra o destra sotto la pallina evidenziata prima del servizio; ogni servizio decide uno scambio.",
    ru: "Перед подачей двигайте ракетку влево или вправо под подсвеченный мяч; каждая подача завершает один розыгрыш.",
    hi: "सर्व से पहले पैडल को बाएँ या दाएँ चलाकर हाइलाइट की गई गेंद के नीचे लाएँ; हर सर्व एक रैली तय करता है।",
    ar: "حرّك المضرب يمينًا أو يسارًا ليضعه أسفل الكرة المميزة قبل الإرسال؛ كل إرسال يحسم تبادلًا واحدًا."
  };
  const PONG_TARGET_CUE = {
    en: (rally) => `Rally ${rally}: place the paddle under the highlighted ball, then Serve.`,
    "zh-Hant": (rally) => `第 ${rally} 回合：將球拍對準高亮球，再發球。`,
    "zh-Hans": (rally) => `第 ${rally} 回合：将球拍对准高亮球，再发球。`,
    ja: (rally) => `ラリー${rally}：ラケットを光るボールの下に合わせてからサーブします。`,
    ko: (rally) => `랠리 ${rally}: 강조된 공 아래에 패들을 맞춘 뒤 서브하세요.`,
    es: (rally) => `Rally ${rally}: coloca la pala bajo la pelota resaltada y saca.`,
    "pt-BR": (rally) => `Rali ${rally}: coloque a raquete sob a bola destacada e saque.`,
    fr: (rally) => `Échange ${rally} : placez la raquette sous la balle en surbrillance, puis servez.`,
    de: (rally) => `Ballwechsel ${rally}: Stelle den Schläger unter den hervorgehobenen Ball und schlage auf.`,
    it: (rally) => `Scambio ${rally}: porta la racchetta sotto la pallina evidenziata, poi servi.`,
    ru: (rally) => `Розыгрыш ${rally}: поставьте ракетку под подсвеченный мяч и подайте.`,
    hi: (rally) => `रैली ${rally}: पैडल को हाइलाइट की गई गेंद के नीचे लाएँ, फिर सर्व करें।`,
    ar: (rally) => `التبادل ${rally}: ضع المضرب أسفل الكرة المميزة ثم أرسل.`
  };
  const PONG_HIT_COPY = {
    en: (rally, score) => `Rally ${rally} won — the paddle met the ball. Score: ${score}.`,
    "zh-Hant": (rally, score) => `第 ${rally} 回合獲勝——球拍接到球了。分數：${score}。`,
    "zh-Hans": (rally, score) => `第 ${rally} 回合获胜——球拍接到球了。分数：${score}。`,
    ja: (rally, score) => `ラリー${rally}勝利——ラケットがボールを捉えました。スコア：${score}。`,
    ko: (rally, score) => `랠리 ${rally} 승리 — 패들이 공을 맞췄습니다. 점수: ${score}.`,
    es: (rally, score) => `Rally ${rally} ganado: la pala golpeó la pelota. Puntuación: ${score}.`,
    "pt-BR": (rally, score) => `Rali ${rally} vencido — a raquete encontrou a bola. Pontuação: ${score}.`,
    fr: (rally, score) => `Échange ${rally} gagné : la raquette a touché la balle. Score : ${score}.`,
    de: (rally, score) => `Ballwechsel ${rally} gewonnen – der Schläger traf den Ball. Punktestand: ${score}.`,
    it: (rally, score) => `Scambio ${rally} vinto: la racchetta ha colpito la pallina. Punteggio: ${score}.`,
    ru: (rally, score) => `Розыгрыш ${rally} выигран — ракетка попала по мячу. Счёт: ${score}.`,
    hi: (rally, score) => `रैली ${rally} जीती — पैडल ने गेंद को मारा। स्कोर: ${score}।`,
    ar: (rally, score) => `فزت بالتبادل ${rally} — لامس المضرب الكرة. النتيجة: ${score}.`,
  };
  const PONG_MISS_COPY = {
    en: (rally, score) => `Rally ${rally} missed — the paddle was not under the ball. Score: ${score}. Align for the next Serve.`,
    "zh-Hant": (rally, score) => `第 ${rally} 回合失誤——球拍沒有對準球。分數：${score}。對準下一次發球。`,
    "zh-Hans": (rally, score) => `第 ${rally} 回合失误——球拍没有对准球。分数：${score}。对准下一次发球。`,
    ja: (rally, score) => `ラリー${rally}失敗——ラケットがボールの下にありませんでした。スコア：${score}。次のサーブに合わせましょう。`,
    ko: (rally, score) => `랠리 ${rally} 실패 — 패들이 공 아래에 있지 않았습니다. 점수: ${score}. 다음 서브에 맞추세요.`,
    es: (rally, score) => `Rally ${rally} fallido: la pala no estaba bajo la pelota. Puntuación: ${score}. Alinéala para el próximo saque.`,
    "pt-BR": (rally, score) => `Rali ${rally} perdido — a raquete não estava sob a bola. Pontuação: ${score}. Alinhe para o próximo saque.`,
    fr: (rally, score) => `Échange ${rally} manqué : la raquette n’était pas sous la balle. Score : ${score}. Alignez-vous pour le prochain service.`,
    de: (rally, score) => `Ballwechsel ${rally} verfehlt – der Schläger war nicht unter dem Ball. Punktestand: ${score}. Richte dich für den nächsten Aufschlag aus.`,
    it: (rally, score) => `Scambio ${rally} perso: la racchetta non era sotto la pallina. Punteggio: ${score}. Allineati per il prossimo servizio.`,
    ru: (rally, score) => `Розыгрыш ${rally} проигран — ракетка была не под мячом. Счёт: ${score}. Прицельтесь для следующей подачи.`,
    hi: (rally, score) => `रैली ${rally} चूक गई — पैडल गेंद के नीचे नहीं था। स्कोर: ${score}। अगले सर्व के लिए मिलाएँ।`,
    ar: (rally, score) => `خسرت التبادل ${rally} — لم يكن المضرب أسفل الكرة. النتيجة: ${score}. حاذِه للإرسال التالي.`,
  };
  const PONG_REMATCH_GOAL_COPY = {
    en: ({ won, score, moves }) => won ? (moves > 5 ? `Next round goal: win all five rallies in fewer than ${moves} moves.` : "Next round goal: keep all five rallies aligned with no extra moves.") : (score > 0 ? `Next round goal: beat ${score} points by aligning one more rally.` : "Next round goal: win one rally and start your score."),
    "zh-Hant": ({ won, score, moves }) => won ? (moves > 5 ? `下一回合目標：五個回合全勝，並把步數降到 ${moves} 步以下。` : "下一回合目標：維持五回合全勝，不增加多餘步數。") : (score > 0 ? `下一回合目標：多贏一回合，超過 ${score} 分。` : "下一回合目標：先贏下一回合，開始累積分數。"),
    "zh-Hans": ({ won, score, moves }) => won ? (moves > 5 ? `下一回合目标：五个回合全胜，并把步数降到 ${moves} 步以下。` : "下一回合目标：保持五回合全胜，不增加多余步数。") : (score > 0 ? `下一回合目标：多赢一回合，超过 ${score} 分。` : "下一回合目标：先赢下一回合，开始累积分数。"),
    ja: ({ won, score, moves }) => won ? (moves > 5 ? `次の目標：5ラリー全勝を、${moves}手未満で達成しましょう。` : "次の目標：余分な手を使わず、5ラリー全勝を目指しましょう。") : (score > 0 ? `次の目標：もう1ラリー勝って、${score}点を超えましょう。` : "次の目標：まず1ラリー勝って、スコアを作りましょう。"),
    ko: ({ won, score, moves }) => won ? (moves > 5 ? `다음 목표: 다섯 랠리 모두 이기고 ${moves}번보다 적게 움직이세요.` : "다음 목표: 불필요한 이동 없이 다섯 랠리 모두 이기세요.") : (score > 0 ? `다음 목표: 랠리 하나를 더 맞혀 ${score}점을 넘으세요.` : "다음 목표: 먼저 랠리 하나를 이겨 점수를 시작하세요."),
    es: ({ won, score, moves }) => won ? (moves > 5 ? `Objetivo siguiente: gana los cinco rallies con menos de ${moves} movimientos.` : "Objetivo siguiente: gana los cinco rallies sin movimientos extra.") : (score > 0 ? `Objetivo siguiente: supera ${score} puntos ganando un rally más.` : "Objetivo siguiente: gana un rally para empezar tu puntuación."),
    "pt-BR": ({ won, score, moves }) => won ? (moves > 5 ? `Próximo objetivo: vença os cinco ralis com menos de ${moves} movimentos.` : "Próximo objetivo: vença os cinco ralis sem movimentos extras.") : (score > 0 ? `Próximo objetivo: passe de ${score} pontos vencendo mais um rali.` : "Próximo objetivo: vença um rali para começar sua pontuação."),
    fr: ({ won, score, moves }) => won ? (moves > 5 ? `Objectif suivant : gagnez les cinq échanges en moins de ${moves} coups.` : "Objectif suivant : gagnez les cinq échanges sans coups superflus.") : (score > 0 ? `Objectif suivant : dépassez ${score} points en gagnant un échange de plus.` : "Objectif suivant : gagnez un échange pour commencer votre score."),
    de: ({ won, score, moves }) => won ? (moves > 5 ? `Nächstes Ziel: Gewinne alle fünf Ballwechsel mit weniger als ${moves} Zügen.` : "Nächstes Ziel: Gewinne alle fünf Ballwechsel ohne zusätzliche Züge.") : (score > 0 ? `Nächstes Ziel: Überspringe ${score} Punkte mit einem weiteren gewonnenen Ballwechsel.` : "Nächstes Ziel: Gewinne einen Ballwechsel und starte deine Punktejagd."),
    it: ({ won, score, moves }) => won ? (moves > 5 ? `Obiettivo successivo: vinci tutti e cinque gli scambi con meno di ${moves} mosse.` : "Obiettivo successivo: vinci tutti e cinque gli scambi senza mosse extra.") : (score > 0 ? `Obiettivo successivo: supera ${score} punti vincendo un altro scambio.` : "Obiettivo successivo: vinci uno scambio per iniziare il punteggio."),
    ru: ({ won, score, moves }) => won ? (moves > 5 ? `Следующая цель: выиграйте все пять розыгрышей менее чем за ${moves} ходов.` : "Следующая цель: выиграйте все пять розыгрышей без лишних ходов.") : (score > 0 ? `Следующая цель: наберите больше ${score} очков, выиграв ещё один розыгрыш.` : "Следующая цель: выиграйте один розыгрыш и начните набор очков."),
    hi: ({ won, score, moves }) => won ? (moves > 5 ? `अगला लक्ष्य: सभी पाँच रैलियाँ ${moves} से कम चालों में जीतें।` : "अगला लक्ष्य: बिना अतिरिक्त चालों के सभी पाँच रैलियाँ जीतें।") : (score > 0 ? `अगला लक्ष्य: एक और रैली जीतकर ${score} अंक पार करें।` : "अगला लक्ष्य: एक रैली जीतकर अपना स्कोर शुरू करें।"),
    ar: ({ won, score, moves }) => won ? (moves > 5 ? `الهدف التالي: اربح التبادلات الخمسة كلها بأقل من ${moves} حركة.` : "الهدف التالي: اربح التبادلات الخمسة كلها من دون حركات إضافية.") : (score > 0 ? `الهدف التالي: تجاوز ${score} نقطة بالفوز بتبادل إضافي.` : "الهدف التالي: اربح تبادلاً واحداً وابدأ تسجيل النقاط.")
  };
  let hintVisible = false;
  const locale = () => document.querySelector("#localeSelect")?.value || document.documentElement.lang || "en";
  const pongBoard = () => document.querySelector(".pong-board");
  const applyPongCue = () => {
    const message = document.querySelector("#gameMessage");
    if (!message || document.body.dataset.screen !== "battle") return;
    const board = pongBoard();
    const rally = Number(board?.dataset.pongRally || 1);
    const score = Number((document.querySelector("#roundLabel")?.textContent || "").match(/\d+/)?.[0] || 0);
    const key = message.dataset.messageKey;
    if (hintVisible) return;
    if (key === "pongHit" || key === "pongMiss") {
      const copy = key === "pongHit" ? PONG_HIT_COPY : PONG_MISS_COPY;
      const text = (copy[locale()] || copy.en)(Math.max(1, rally), score);
      if (message.textContent !== text) message.textContent = text;
      message.dataset.tone = key === "pongHit" ? "good" : "warn";
      return;
    }
    const targetText = (PONG_TARGET_CUE[locale()] || PONG_TARGET_CUE.en)(rally);
    if (message.textContent !== targetText) message.textContent = targetText;
    message.dataset.tone = "";
    message.dataset.messageKey = "pongTarget";
  };
  const applyHint = () => {
    if (!hintVisible) return;
    const message = document.querySelector("#gameMessage");
    const text = HINTS[locale()] || HINTS.en;
    if (message) {
      if (message.textContent !== text) message.textContent = text;
      message.dataset.tone = "warn";
      message.dataset.messageKey = "hint";
    }
  };
  const applyPongRematchGoal = () => {
    if (document.body.dataset.gameId !== "pong" || document.body.dataset.screen !== "result") return;
    const stats = [...document.querySelectorAll("#resultStats .stat strong")].map((node) => Number(node.textContent));
    if (stats.length < 2 || stats.some((value) => !Number.isFinite(value))) return;
    let goal = document.querySelector("#pongRematchGoal");
    if (!goal) {
      goal = document.createElement("p");
      goal.id = "pongRematchGoal";
      goal.className = "tagline pong-rematch-goal";
      goal.setAttribute("role", "note");
      document.querySelector("#resultCopy")?.after(goal);
    }
    const copy = PONG_REMATCH_GOAL_COPY[locale()] || PONG_REMATCH_GOAL_COPY.en;
    const text = copy({ won: document.querySelector("#resultScreen")?.dataset.outcome === "win", score: stats[0], moves: stats[1] });
    if (goal.textContent !== text) goal.textContent = text;
  };
  const syncMessage = () => {
    applyHint();
    applyPongCue();
    applyPongRematchGoal();
  };
  const observer = new MutationObserver(syncMessage);
  observer.observe(document.body, { childList: true, subtree: true });
  document.querySelector("#hintBtn")?.addEventListener("click", () => { hintVisible = true; queueMicrotask(applyHint); });
  document.querySelector("#localeSelect")?.addEventListener("change", () => queueMicrotask(syncMessage));
  document.addEventListener("click", (event) => {
    const action = event.target.closest?.("[data-action]");
    if (action && action.dataset.action !== "hint") hintVisible = false;
  }, true);
  document.querySelector("#restartBtn")?.addEventListener("click", () => { hintVisible = false; });
  document.querySelector("#retryBtn")?.addEventListener("click", () => { hintVisible = false; });
  document.querySelector("#homeBtn")?.addEventListener("click", () => { hintVisible = false; });
})();
