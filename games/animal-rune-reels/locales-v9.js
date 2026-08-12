(() => {
  const copy = {
    en: ["Turn {turn}", "DMG {value}", "Shield +{value}", "Heal +{value}"],
    "zh-Hant": ["第 {turn} 回合", "傷害 {value}", "護盾 +{value}", "治療 +{value}"],
    "zh-Hans": ["第 {turn} 回合", "伤害 {value}", "护盾 +{value}", "治疗 +{value}"],
    ja: ["ターン {turn}", "ダメージ {value}", "シールド +{value}", "回復 +{value}"],
    ko: ["{turn}턴", "피해 {value}", "보호막 +{value}", "회복 +{value}"],
    es: ["Turno {turn}", "Daño {value}", "Escudo +{value}", "Cura +{value}"],
    "pt-BR": ["Turno {turn}", "Dano {value}", "Escudo +{value}", "Cura +{value}"],
    fr: ["Tour {turn}", "Dégâts {value}", "Bouclier +{value}", "Soin +{value}"],
    de: ["Zug {turn}", "Schaden {value}", "Schild +{value}", "Heilung +{value}"],
    it: ["Turno {turn}", "Danni {value}", "Scudo +{value}", "Cura +{value}"],
    ru: ["Ход {turn}", "Урон {value}", "Щит +{value}", "Лечение +{value}"],
    hi: ["चाल {turn}", "क्षति {value}", "ढाल +{value}", "उपचार +{value}"],
    ar: ["الدور {turn}", "الضرر {value}", "الدرع +{value}", "الشفاء +{value}"]
  };
  Object.entries(copy).forEach(([locale, values]) => {
    const target = window.RUNE_REELS_LOCALES?.[locale];
    if (!target) return;
    [target.turnResult, target.resultDamage, target.resultShield, target.resultHealing] = values;
  });
})();
