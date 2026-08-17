const GAME_VERSION = "v4";
window.WPPopularArcade?.mount("pong");
document.body.dataset.gameVersion = GAME_VERSION;
(() => {
  "use strict";
  const HINTS = {
    en: "Move Left or Right to line up before Serve; each Serve settles one rally.",
    "zh-Hant": "發球前用左移或右移對準球拍；每次發球結算一回合。",
    "zh-Hans": "发球前用左移或右移对准球拍；每次发球结算一回合。",
    ja: "サーブ前に左か右でラケットを合わせましょう。1回のサーブで1ラリーが決まります。",
    ko: "서브 전에 왼쪽이나 오른쪽으로 패들을 맞추세요. 서브 한 번마다 랠리 하나가 결정됩니다.",
    es: "Muévete a la izquierda o derecha para alinear la pala antes del saque; cada saque resuelve un rally.",
    "pt-BR": "Mova para a esquerda ou direita e alinhe a raquete antes do saque; cada saque resolve um rali.",
    fr: "Déplacez la raquette à gauche ou à droite avant le service ; chaque service règle un échange.",
    de: "Bewege den Schläger vor dem Aufschlag nach links oder rechts; jeder Aufschlag entscheidet einen Ballwechsel.",
    it: "Sposta la racchetta a sinistra o destra prima del servizio; ogni servizio decide uno scambio.",
    ru: "Перед подачей двигайте ракетку влево или вправо; каждая подача завершает один розыгрыш.",
    hi: "सर्व से पहले पैडल को बाएँ या दाएँ मिलाएँ; हर सर्व एक रैली तय करता है।",
    ar: "حرّك المضرب يمينًا أو يسارًا لمحاذاته قبل الإرسال؛ كل إرسال يحسم تبادلًا واحدًا."
  };
  const PONG_RALLY_COPY = {
    en: (rally, score) => `Rally ${rally} won. Score: ${score}.`,
    "zh-Hant": (rally, score) => `第 ${rally} 回合獲勝。分數：${score}。`,
    "zh-Hans": (rally, score) => `第 ${rally} 回合获胜。分数：${score}。`,
    ja: (rally, score) => `ラリー${rally}勝利。スコア：${score}。`,
    ko: (rally, score) => `랠리 ${rally} 승리. 점수: ${score}.`,
    es: (rally, score) => `Rally ${rally} ganado. Puntuación: ${score}.`,
    "pt-BR": (rally, score) => `Rali ${rally} vencido. Pontuação: ${score}.`,
    fr: (rally, score) => `Échange ${rally} gagné. Score : ${score}.`,
    de: (rally, score) => `Ballwechsel ${rally} gewonnen. Punktestand: ${score}.`,
    it: (rally, score) => `Scambio ${rally} vinto. Punteggio: ${score}.`,
    ru: (rally, score) => `Розыгрыш ${rally} выигран. Счёт: ${score}.`,
    hi: (rally, score) => `रैली ${rally} जीती। स्कोर: ${score}।`,
    ar: (rally, score) => `فزت بالتبادل ${rally}. النتيجة: ${score}.`,
  };
  let hintVisible = false;
  let lastScore = 0;
  let lastRally = 0;
  const locale = () => document.querySelector("#localeSelect")?.value || document.documentElement.lang || "en";
  const readScore = () => {
    const values = (document.querySelector("#roundLabel")?.textContent || "").match(/\d+/g) || [];
    return Number(values[0] || 0);
  };
  const applyRallyCue = () => {
    const message = document.querySelector("#gameMessage");
    if (!message || document.body.dataset.screen !== "battle") return;
    const score = readScore();
    if (score < lastScore) {
      lastScore = score;
      lastRally = 0;
    }
    if (score > lastScore && score > 0 && score % 25 === 0) {
      lastScore = score;
      lastRally = score / 25;
      hintVisible = false;
    }
    if (hintVisible || lastRally <= 0) return;
    const text = (PONG_RALLY_COPY[locale()] || PONG_RALLY_COPY.en)(lastRally, score);
    if (message.textContent !== text) message.textContent = text;
    message.dataset.tone = "good";
    message.dataset.messageKey = "pongRally";
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
    applyRallyCue();
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
