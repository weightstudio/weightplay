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
    en: "Next Rift: {name} · {waves} waves · Tactic: {tactic}",
    "zh-Hant": "下一個裂隙：{name} · {waves} 波 · 戰術：{tactic}",
    "zh-Hans": "下一裂隙：{name} · {waves} 波 · 战术：{tactic}",
    ja: "次の裂け目：{name} · {waves}ウェーブ · 戦術：{tactic}",
    ko: "다음 균열: {name} · {waves} 웨이브 · 전술: {tactic}",
    es: "Siguiente grieta: {name} · {waves} oleadas · Táctica: {tactic}",
    "pt-BR": "Próxima fenda: {name} · {waves} ondas · Tática: {tactic}",
    fr: "Faille suivante : {name} · {waves} vagues · Tactique : {tactic}",
    de: "Nächster Spalt: {name} · {waves} Wellen · Taktik: {tactic}",
    it: "Prossima frattura: {name} · {waves} ondate · Tattica: {tactic}",
    ru: "Следующая трещина: {name} · {waves} волн · Тактика: {tactic}",
    hi: "अगली दरार: {name} · {waves} लहरें · रणनीति: {tactic}",
    ar: "الشق التالي: {name} · {waves} موجات · التكتيك: {tactic}"
  };
  Object.entries(labels).forEach(([locale, tabEquipment]) => {
    if (window.RUNE_REELS_LOCALES?.[locale]) {
      window.RUNE_REELS_LOCALES[locale].tabEquipment = tabEquipment;
      window.RUNE_REELS_LOCALES[locale].nextRiftPreview = nextRiftPreview[locale];
    }
  });
})();
