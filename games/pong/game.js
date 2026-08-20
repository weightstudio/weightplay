const GAME_VERSION = "v5";
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
  const syncMessage = () => {
    applyHint();
    applyPongCue();
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
