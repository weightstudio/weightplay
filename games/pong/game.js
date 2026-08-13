const GAME_VERSION = "v2";
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
  let hintVisible = false;
  const locale = () => document.querySelector("#localeSelect")?.value || document.documentElement.lang || "en";
  const applyHint = () => {
    if (!hintVisible) return;
    const message = document.querySelector("#gameMessage");
    const text = HINTS[locale()] || HINTS.en;
    if (message && message.textContent !== text) message.textContent = text;
  };
  const observer = new MutationObserver(applyHint);
  observer.observe(document.body, { childList: true, subtree: true });
  document.querySelector("#hintBtn")?.addEventListener("click", () => { hintVisible = true; queueMicrotask(applyHint); });
  document.addEventListener("click", (event) => {
    const action = event.target.closest?.("[data-action]");
    if (action && action.dataset.action !== "hint") hintVisible = false;
  }, true);
  document.querySelector("#restartBtn")?.addEventListener("click", () => { hintVisible = false; });
  document.querySelector("#retryBtn")?.addEventListener("click", () => { hintVisible = false; });
  document.querySelector("#homeBtn")?.addEventListener("click", () => { hintVisible = false; });
})();
