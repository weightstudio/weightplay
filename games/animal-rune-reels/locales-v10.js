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
(() => {
  const copy = {
    en: ["First turn · Start with SPIN.", "Choose one reel after it stops. Corrections are now available.", "Resolve the three runes when your choice is ready."],
    "zh-Hant": ["第一回合 · 先按「轉動」。", "停止後選擇一軸，現在可以使用修正。", "選擇完成後，結算三個符文。"],
    "zh-Hans": ["第一回合 · 先按“转动”。", "停止后选择一轴，现在可以使用修正。", "选择完成后，结算三个符文。"],
    ja: ["最初のターン · まずスピン。", "停止したらリールを1つ選択。修正が使えます。", "選択が決まったら3つのルーンを解決。"],
    ko: ["첫 턴 · 먼저 스핀하세요.", "멈춘 뒤 릴 하나를 선택하세요. 보정을 사용할 수 있습니다.", "선택이 끝나면 룬 3개를 해결하세요."],
    es: ["Primer turno · Empieza con GIRAR.", "Cuando se detenga, elige un rodillo. Ya puedes corregirlo.", "Cuando decidas, resuelve las tres runas."],
    "pt-BR": ["Primeiro turno · Comece com GIRAR.", "Quando parar, escolha um carretel. As correções estão disponíveis.", "Quando decidir, resolva as três runas."],
    fr: ["Premier tour · Commencez par TOURNER.", "À l'arrêt, choisissez un rouleau. Les corrections sont disponibles.", "Quand votre choix est prêt, résolvez les trois runes."],
    de: ["Erster Zug · Beginne mit DREHEN.", "Wähle nach dem Stopp eine Walze. Korrekturen sind jetzt möglich.", "Wenn deine Wahl feststeht, löse die drei Runen auf."],
    it: ["Primo turno · Inizia con GIRA.", "Dopo l'arresto, scegli un rullo. Ora puoi correggere.", "Quando hai scelto, risolvi le tre rune."],
    ru: ["Первый ход · Начните с вращения.", "После остановки выберите барабан. Теперь доступны исправления.", "Когда выбор готов, разберите три руны."],
    hi: ["पहली चाल · घुमाएँ से शुरू करें।", "रुकने के बाद एक रील चुनें। अब सुधार उपलब्ध हैं।", "चुनाव तय होने पर तीनों रून का निपटारा करें।"],
    ar: ["الدور الأول · ابدأ بالتدوير.", "بعد التوقف اختر بكرة واحدة. أصبحت التصحيحات متاحة.", "بعد اختيارك نفّذ الرموز الثلاثة."]
  };
  Object.entries(copy).forEach(([locale, values]) => {
    const target = window.RUNE_REELS_LOCALES?.[locale];
    if (!target) return;
    [target.coachSpin, target.coachChoose, target.coachResolve] = values;
  });
})();
