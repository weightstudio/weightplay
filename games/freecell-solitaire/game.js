(function () {
  "use strict";
  const SEQUENCE_CUE = {
    en: "Sequence opened: {count} cards moved together.",
    "zh-Hant": "順序打開了：{count} 張牌一起移動。",
    "zh-Hans": "顺序展开了：{count} 张牌一起移动。",
    ja: "連続が開きました：{count}枚のカードをまとめて移動。",
    ko: "연속 카드가 열렸습니다: {count}장을 함께 이동했어요.",
    es: "Secuencia abierta: {count} cartas movidas juntas.",
    "pt-BR": "Sequência aberta: {count} cartas movidas juntas.",
    fr: "Suite ouverte : {count} cartes déplacées ensemble.",
    de: "Folge geöffnet: {count} Karten gemeinsam bewegt.",
    it: "Sequenza aperta: {count} carte mosse insieme.",
    ru: "Цепочка открыта: {count} карт перемещено вместе.",
    hi: "क्रम खुला: {count} कार्ड साथ ले जाए गए।",
    ar: "تم فتح التسلسل: نُقلت {count} بطاقات معًا.",
  };
  window.WPClassicSolitaire?.mount({ variant: "freecell", id: "freecell-solitaire", sequenceCue: SEQUENCE_CUE });
})();
