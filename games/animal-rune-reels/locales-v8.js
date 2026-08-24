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
  const nextRiftPreview = {
    en: "Next Rift: {name} · {waves} waves · {tactic}",
    "zh-Hant": "下一個裂隙：{name} · {waves} 波 · {tactic}",
    "zh-Hans": "下一裂隙：{name} · {waves} 波 · {tactic}",
    ja: "次の裂け目：{name} · {waves}ウェーブ · {tactic}",
    ko: "다음 균열: {name} · {waves} 웨이브 · {tactic}",
    es: "Siguiente grieta: {name} · {waves} oleadas · {tactic}",
    "pt-BR": "Próxima fenda: {name} · {waves} ondas · {tactic}",
    fr: "Faille suivante : {name} · {waves} vagues · {tactic}",
    de: "Nächster Spalt: {name} · {waves} Wellen · {tactic}",
    it: "Prossima frattura: {name} · {waves} ondate · {tactic}",
    ru: "Следующая трещина: {name} · {waves} волн · {tactic}",
    hi: "अगली दरार: {name} · {waves} लहरें · {tactic}",
    ar: "الشق التالي: {name} · {waves} موجات · {tactic}"
  };
  Object.entries(labels).forEach(([locale, tabEquipment]) => {
    if (window.RUNE_REELS_LOCALES?.[locale]) {
      window.RUNE_REELS_LOCALES[locale].tabEquipment = tabEquipment;
      window.RUNE_REELS_LOCALES[locale].nextRiftPreview = nextRiftPreview[locale];
    }
  });
})();
