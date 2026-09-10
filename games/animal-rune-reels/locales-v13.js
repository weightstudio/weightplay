(() => {
  const shieldRules = {
    en: "This turn only · Max {value}",
    "zh-Hant": "僅限本回合 · 上限 {value}",
    "zh-Hans": "仅限本回合 · 上限 {value}",
    ja: "このターンのみ · 上限 {value}",
    ko: "이번 턴만 · 최대 {value}",
    es: "Solo este turno · Máx. {value}",
    "pt-BR": "Apenas neste turno · Máx. {value}",
    fr: "Ce tour uniquement · Max. {value}",
    de: "Nur diese Runde · Max. {value}",
    it: "Solo questo turno · Max {value}",
    ru: "Только на этот ход · Макс. {value}",
    hi: "केवल इस चाल तक · अधिकतम {value}",
    ar: "لهذا الدور فقط · الحد {value}"
  };
  Object.entries(shieldRules).forEach(([locale, shieldRule]) => {
    const target = window.RUNE_REELS_LOCALES?.[locale];
    if (target) target.shieldRule = shieldRule;
  });
})();
