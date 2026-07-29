(() => {
  const labels = {
    en: "Equipment",
    "zh-Hant": "裝備",
    "zh-Hans": "装备",
    ja: "装備",
    ko: "장비",
    es: "Equipo",
    "pt-BR": "Equipamento",
    fr: "Équipement",
    de: "Ausrüstung",
    it: "Equipaggiamento",
    ru: "Снаряжение",
    hi: "उपकरण",
    ar: "المعدات"
  };
  Object.entries(labels).forEach(([locale, tabEquipment]) => {
    if (window.RUNE_REELS_LOCALES?.[locale]) window.RUNE_REELS_LOCALES[locale].tabEquipment = tabEquipment;
  });
})();
