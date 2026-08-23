(() => {
  const copy = {
    en: "Choose one reel after it stops. Reroll replaces that reel; compare its new effect before Resolve.",
    "zh-Hant": "停止後選擇一軸。重新轉動會替換該軸；結算前比較新的效果。",
    "zh-Hans": "停止后选择一轴。重新转动会替换该轴；结算前比较新的效果。",
    ja: "停止後にリールを1つ選択。再回転でその効果を入れ替え、解決前に新しい効果を比べます。",
    ko: "멈춘 뒤 릴 하나를 선택하세요. 다시 돌리면 그 효과가 바뀌니 해결 전에 비교하세요.",
    es: "Cuando se detenga, elige un carrete. Repetirlo cambia su efecto; compáralo antes de resolver.",
    "pt-BR": "Quando parar, escolha um rolo. Girá-lo de novo troca o efeito; compare antes de resolver.",
    fr: "À l'arrêt, choisissez un rouleau. Relancer change son effet ; comparez-le avant de résoudre.",
    de: "Wähle nach dem Stopp eine Walze. Neu drehen ersetzt ihren Effekt; vergleiche ihn vor der Auswertung.",
    it: "Dopo l'arresto, scegli un rullo. Rilanciarlo cambia il suo effetto; confrontalo prima di risolvere.",
    ru: "После остановки выберите барабан. Переброс заменит его эффект — сравните новый до завершения хода.",
    hi: "रुकने के बाद एक रील चुनें। फिर घुमाने से उसका प्रभाव बदलेगा; निपटारे से पहले तुलना करें।",
    ar: "بعد التوقف اختر بكرة واحدة. إعادة اللف تستبدل تأثيرها؛ قارن التأثير الجديد قبل التنفيذ."
  };
  Object.entries(copy).forEach(([locale, value]) => {
    const target = window.RUNE_REELS_LOCALES?.[locale];
    if (target) target.coachChoose = value;
  });
})();
