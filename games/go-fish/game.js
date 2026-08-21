(() => {
  "use strict";

  const COPY = {
    en: { start: "Start Game", heading: "How to play", paragraph: "Complete four-of-a-kind books. Choose two, three, or four players in the preview build." },
    "zh-Hant": { start: "開始遊戲", heading: "遊戲玩法", paragraph: "完成四張同點數牌的組牌。預覽版可選擇兩人、三人或四人。" },
    "zh-Hans": { start: "开始游戏", heading: "游戏玩法", paragraph: "完成四张同点数牌的组牌。预览版可选择两人、三人或四人。" },
    ja: { start: "ゲーム開始", heading: "遊び方", paragraph: "同じランク4枚の組を完成させます。プレビュー版では2〜4人を選べます。" },
    ko: { start: "게임 시작", heading: "게임 방법", paragraph: "같은 랭크 네 장 세트를 완성하세요. 프리뷰에서는 2·3·4인 게임을 선택할 수 있습니다." },
    es: { start: "Empezar", heading: "Cómo jugar", paragraph: "Completa grupos de cuatro cartas del mismo rango. En la vista previa puedes elegir 2, 3 o 4 jugadores." },
    "pt-BR": { start: "Começar jogo", heading: "Como jogar", paragraph: "Complete grupos de quatro cartas do mesmo valor. A prévia permite escolher 2, 3 ou 4 jogadores." },
    fr: { start: "Commencer", heading: "Comment jouer", paragraph: "Complétez des familles de quatre cartes du même rang. L’aperçu permet de choisir 2, 3 ou 4 joueurs." },
    de: { start: "Spiel starten", heading: "Spielanleitung", paragraph: "Bilde Vierlinge aus vier Karten desselben Rangs. In der Vorschau kannst du 2, 3 oder 4 Spieler wählen." },
    it: { start: "Inizia partita", heading: "Come si gioca", paragraph: "Completa combinazioni di quattro carte dello stesso valore. Nell’anteprima puoi scegliere 2, 3 o 4 giocatori." },
    ru: { start: "Начать игру", heading: "Как играть", paragraph: "Соберите четвёрки из четырёх карт одного ранга. В предпросмотре можно выбрать 2, 3 или 4 игроков." },
    hi: { start: "खेल शुरू करें", heading: "कैसे खेलें", paragraph: "एक ही रैंक के चार पत्तों का सेट पूरा करें। प्रीव्यू में 2, 3 या 4 खिलाड़ी चुनें।" },
    ar: { start: "بدء اللعبة", heading: "طريقة اللعب", paragraph: "أكمل مجموعات من أربع بطاقات من الرتبة نفسها. يمكنك اختيار لاعبين أو ثلاثة أو أربعة في المعاينة." },
  };
  const locale = document.documentElement.lang || "en";
  const copy = COPY[locale] || COPY.en;

  function applyLocaleOwnedEntryCopy() {
    const start = document.querySelector("#startBtn");
    if (start) {
      start.textContent = copy.start;
      start.dataset.runtimeLocalize = "off";
    }
    const guide = document.querySelector("[data-card-quick-guide]");
    const heading = guide?.querySelector("strong");
    if (guide && heading) {
      heading.textContent = copy.heading;
      guide.replaceChildren(heading, document.createTextNode(`: ${copy.paragraph}`));
      guide.dataset.runtimeLocalize = "off";
    }
  }

  window.WPCardGamesNext?.mount({ id: "go-fish" });
  applyLocaleOwnedEntryCopy();
  [40, 120, 300, 600].forEach((delay) => window.setTimeout(applyLocaleOwnedEntryCopy, delay));
})();
