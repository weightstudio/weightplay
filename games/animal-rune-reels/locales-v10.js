(() => {
  const copy = {
    en: ["New best run · {stars} · HP {health} / {maxHealth}", "Best run · {stars} · HP {health} / {maxHealth}", "Best stars · {stars} · Replay to set a health record.", "Clear this Rift to set a best run."],
    "zh-Hant": ["新最佳紀錄 · {stars} · 生命 {health} / {maxHealth}", "最佳紀錄 · {stars} · 生命 {health} / {maxHealth}", "最佳星數 · {stars} · 再挑戰即可建立生命紀錄。", "通關這個裂隙即可建立最佳紀錄。"],
    "zh-Hans": ["新最佳记录 · {stars} · 生命 {health} / {maxHealth}", "最佳记录 · {stars} · 生命 {health} / {maxHealth}", "最佳星数 · {stars} · 再挑战即可建立生命记录。", "通关这个裂隙即可建立最佳记录。"],
    ja: ["新ベスト · {stars} · HP {health} / {maxHealth}", "ベスト記録 · {stars} · HP {health} / {maxHealth}", "最高スター · {stars} · 再挑戦でHP記録を作れます。", "この裂け目をクリアしてベストを記録しましょう。"],
    ko: ["새 최고 기록 · {stars} · HP {health} / {maxHealth}", "최고 기록 · {stars} · HP {health} / {maxHealth}", "최고 별 · {stars} · 다시 도전해 HP 기록을 남겨 보세요.", "이 균열을 클리어하면 최고 기록이 저장됩니다."],
    es: ["Nuevo récord · {stars} · PV {health} / {maxHealth}", "Mejor partida · {stars} · PV {health} / {maxHealth}", "Mejores estrellas · {stars} · Repite para fijar un récord de PV.", "Supera esta grieta para fijar una mejor partida."],
    "pt-BR": ["Novo recorde · {stars} · PV {health} / {maxHealth}", "Melhor partida · {stars} · PV {health} / {maxHealth}", "Melhores estrelas · {stars} · Repita para registrar um recorde de PV.", "Conclua esta fenda para registrar a melhor partida."],
    fr: ["Nouveau record · {stars} · PV {health} / {maxHealth}", "Meilleure partie · {stars} · PV {health} / {maxHealth}", "Meilleures étoiles · {stars} · Rejouez pour établir un record de PV.", "Terminez cette faille pour établir une meilleure partie."],
    de: ["Neuer Bestwert · {stars} · LP {health} / {maxHealth}", "Bester Lauf · {stars} · LP {health} / {maxHealth}", "Beste Sterne · {stars} · Spiele erneut für einen LP-Rekord.", "Schließe diesen Spalt ab, um einen Bestwert zu speichern."],
    it: ["Nuovo record · {stars} · PS {health} / {maxHealth}", "Miglior partita · {stars} · PS {health} / {maxHealth}", "Migliori stelle · {stars} · Rigioca per fissare un record di PS.", "Completa questa frattura per salvare il record."],
    ru: ["Новый рекорд · {stars} · ЗД {health} / {maxHealth}", "Лучший забег · {stars} · ЗД {health} / {maxHealth}", "Лучшие звёзды · {stars} · Повторите забег, чтобы записать рекорд ЗД.", "Пройдите этот разлом, чтобы записать лучший забег."],
    hi: ["नया सर्वश्रेष्ठ · {stars} · HP {health} / {maxHealth}", "सर्वश्रेष्ठ रन · {stars} · HP {health} / {maxHealth}", "सर्वश्रेष्ठ सितारे · {stars} · HP रिकॉर्ड के लिए फिर खेलें।", "सर्वश्रेष्ठ रन दर्ज करने के लिए इस रिफ्ट को पूरा करें।"],
    ar: ["أفضل نتيجة جديدة · {stars} · الصحة {health} / {maxHealth}", "أفضل جولة · {stars} · الصحة {health} / {maxHealth}", "أفضل نجوم · {stars} · أعد اللعب لتسجيل أفضل صحة.", "أكمل هذا الصدع لتسجيل أفضل جولة."]
  };
  Object.entries(copy).forEach(([locale, values]) => {
    const target = window.RUNE_REELS_LOCALES?.[locale];
    if (!target) return;
    [target.newBestRun, target.bestRun, target.bestStarsOnly, target.bestRunNoRecord] = values;
  });
})();
