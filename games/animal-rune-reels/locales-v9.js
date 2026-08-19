(() => {
  const copy = {
    en: ["Turn {turn}", "DMG {value}", "Shield +{value}", "Heal +{value}", "Taken {value}"],
    "zh-Hant": ["第 {turn} 回合", "傷害 {value}", "護盾 +{value}", "治療 +{value}", "承受 {value}"],
    "zh-Hans": ["第 {turn} 回合", "伤害 {value}", "护盾 +{value}", "治疗 +{value}", "承受 {value}"],
    ja: ["ターン {turn}", "ダメージ {value}", "シールド +{value}", "回復 +{value}", "被ダメージ {value}"],
    ko: ["{turn}턴", "피해 {value}", "보호막 +{value}", "회복 +{value}", "받은 피해 {value}"],
    es: ["Turno {turn}", "Daño {value}", "Escudo +{value}", "Cura +{value}", "Daño recibido {value}"],
    "pt-BR": ["Turno {turn}", "Dano {value}", "Escudo +{value}", "Cura +{value}", "Dano recebido {value}"],
    fr: ["Tour {turn}", "Dégâts {value}", "Bouclier +{value}", "Soin +{value}", "Dégâts subis {value}"],
    de: ["Zug {turn}", "Schaden {value}", "Schild +{value}", "Heilung +{value}", "Erlittener Schaden {value}"],
    it: ["Turno {turn}", "Danni {value}", "Scudo +{value}", "Cura +{value}", "Danni subiti {value}"],
    ru: ["Ход {turn}", "Урон {value}", "Щит +{value}", "Лечение +{value}", "Получено урона {value}"],
    hi: ["चाल {turn}", "क्षति {value}", "ढाल +{value}", "उपचार +{value}", "प्राप्त क्षति {value}"],
    ar: ["الدور {turn}", "الضرر {value}", "الدرع +{value}", "الشفاء +{value}", "الضرر المتلقى {value}"]
  };
  Object.entries(copy).forEach(([locale, values]) => {
    const target = window.RUNE_REELS_LOCALES?.[locale];
    if (!target) return;
    [target.turnResult, target.resultDamage, target.resultShield, target.resultHealing, target.resultDamageTaken] = values;
  });
})();
