const GAME_VERSION = "v6";

window.WPClassicLogic?.mount("naval-battle");
document.body.dataset.gameVersion = GAME_VERSION;

const syncBattleChip = () => {
  const status = document.querySelector("#logicStatus");
  const chip = document.querySelector("#battleChip");
  const result = document.querySelector("#logicResult");
  if (status && chip && (!result || result.hidden)) chip.textContent = status.textContent;
};

document.querySelector("#resultReplay")?.addEventListener("click", syncBattleChip);
document.querySelector("#logicReset")?.addEventListener("click", syncBattleChip);
const statusObserver = new MutationObserver(syncBattleChip);
statusObserver.observe(document.querySelector("#logicStatus") || document.body, { childList: true, characterData: true, subtree: true });
syncBattleChip();

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
