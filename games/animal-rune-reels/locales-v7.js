(() => {
  "use strict";
  const L = window.RUNE_REELS_LOCALES;
  const patches = {
    en: {
      tacticsTitle: "Tactical decision", tacticsHint: "Select a reel, use at most one correction, then resolve.",
      acceptRunes: "Resolve", rerollReel: "Reroll", holdReel: "Hold", leaderTactic: "Leader",
      selectReel: "Select a reel first.", correctionUsed: "One correction has already been used this turn.",
      heldNext: "This rune will be held for the next Spin.", autoLocked: "AUTO unlocks after this rift is cleared.",
      intentAttack: "Attack", intentHeavy: "Heavy strike", intentShield: "Raise shield", intentHeal: "Restore ally",
      intentCorrupt: "Corrupt reel", intentMixed: "Boss tactic", enemyIntent: "Next: {action}",
      tacticConvert: "Leader changed reel {reel} to {rune}.", rerolled: "Reel {reel} rerolled.",
      corruptedReel: "Reel {reel} was corrupted into a dormant stone.", enemyShielded: "Enemy gained {value} shield.",
      enemyHealed: "Enemy restored {value} health."
    },
    "zh-Hant": {
      tacticsTitle: "戰術決策", tacticsHint: "選擇一個轉輪，本回合最多修正一次，再確認結算。",
      acceptRunes: "確認結算", rerollReel: "重新轉動", holdReel: "保留", leaderTactic: "隊長技能",
      selectReel: "請先選擇一個轉輪。", correctionUsed: "本回合已使用一次修正。",
      heldNext: "這個符文會保留到下一次轉動。", autoLocked: "通過這個裂隙後才會開放自動戰鬥。",
      intentAttack: "普通攻擊", intentHeavy: "強力攻擊", intentShield: "建立護盾", intentHeal: "治療隊友",
      intentCorrupt: "污染轉輪", intentMixed: "Boss 戰術", enemyIntent: "下一步：{action}",
      tacticConvert: "隊長把第 {reel} 輪改成{rune}。", rerolled: "已重新轉動第 {reel} 輪。",
      corruptedReel: "第 {reel} 輪被污染成休眠石。", enemyShielded: "敵人獲得 {value} 點護盾。",
      enemyHealed: "敵人恢復 {value} 點生命。"
    },
    "zh-Hans": {
      tacticsTitle: "战术决策", tacticsHint: "选择一个转轮，本回合最多修正一次，再确认结算。",
      acceptRunes: "确认结算", rerollReel: "重新转动", holdReel: "保留", leaderTactic: "队长技能",
      selectReel: "请先选择一个转轮。", correctionUsed: "本回合已使用一次修正。",
      heldNext: "这个符文会保留到下一次转动。", autoLocked: "通过这个裂隙后才会开放自动战斗。",
      intentAttack: "普通攻击", intentHeavy: "强力攻击", intentShield: "建立护盾", intentHeal: "治疗队友",
      intentCorrupt: "污染转轮", intentMixed: "Boss 战术", enemyIntent: "下一步：{action}",
      tacticConvert: "队长把第 {reel} 轮改成{rune}。", rerolled: "已重新转动第 {reel} 轮。",
      corruptedReel: "第 {reel} 轮被污染成休眠石。", enemyShielded: "敌人获得 {value} 点护盾。",
      enemyHealed: "敌人恢复 {value} 点生命。"
    },
    ja: {
      tacticsTitle: "戦術判断", tacticsHint: "リールを選び、修正は1回だけ。最後に解決します。",
      acceptRunes: "解決", rerollReel: "再回転", holdReel: "保持", leaderTactic: "リーダー",
      selectReel: "先にリールを選んでください。", correctionUsed: "このターンの修正は使用済みです。",
      heldNext: "次のスピンまでこのルーンを保持します。", autoLocked: "このリフトのクリア後にAUTOが解放されます。",
      intentAttack: "攻撃", intentHeavy: "強打", intentShield: "シールド", intentHeal: "味方回復",
      intentCorrupt: "リール汚染", intentMixed: "ボス戦術", enemyIntent: "次：{action}",
      tacticConvert: "リーダーがリール{reel}を{rune}に変更。", rerolled: "リール{reel}を再回転しました。",
      corruptedReel: "リール{reel}が休眠石に汚染されました。", enemyShielded: "敵がシールド{value}を獲得。",
      enemyHealed: "敵がHPを{value}回復。"
    },
    ko: {
      tacticsTitle: "전술 결정", tacticsHint: "릴을 고르고 한 번만 수정한 뒤 해결하세요.",
      acceptRunes: "해결", rerollReel: "다시 돌리기", holdReel: "보관", leaderTactic: "리더",
      selectReel: "먼저 릴을 선택하세요.", correctionUsed: "이번 턴의 수정은 이미 사용했습니다.",
      heldNext: "이 룬은 다음 스핀까지 유지됩니다.", autoLocked: "이 균열을 클리어하면 AUTO가 열립니다.",
      intentAttack: "공격", intentHeavy: "강공격", intentShield: "보호막", intentHeal: "아군 회복",
      intentCorrupt: "릴 오염", intentMixed: "보스 전술", enemyIntent: "다음: {action}",
      tacticConvert: "리더가 {reel}번 릴을 {rune}(으)로 변경했습니다.", rerolled: "{reel}번 릴을 다시 돌렸습니다.",
      corruptedReel: "{reel}번 릴이 휴면석으로 오염되었습니다.", enemyShielded: "적이 보호막 {value}을 얻었습니다.",
      enemyHealed: "적이 체력 {value}을 회복했습니다."
    },
    es: {
      tacticsTitle: "Decisión táctica", tacticsHint: "Elige un carrete, corrige una vez y resuelve.",
      acceptRunes: "Resolver", rerollReel: "Repetir", holdReel: "Guardar", leaderTactic: "Líder",
      selectReel: "Elige primero un carrete.", correctionUsed: "Ya usaste una corrección este turno.",
      heldNext: "Esta runa se guardará para el próximo giro.", autoLocked: "AUTO se desbloquea al superar esta grieta.",
      intentAttack: "Ataque", intentHeavy: "Golpe fuerte", intentShield: "Crear escudo", intentHeal: "Curar aliado",
      intentCorrupt: "Corromper carrete", intentMixed: "Táctica de jefe", enemyIntent: "Siguiente: {action}",
      tacticConvert: "El líder cambió el carrete {reel} a {rune}.", rerolled: "Carrete {reel} repetido.",
      corruptedReel: "El carrete {reel} se corrompió en piedra dormida.", enemyShielded: "El enemigo obtuvo {value} de escudo.",
      enemyHealed: "El enemigo recuperó {value} de vida."
    },
    "pt-BR": {
      tacticsTitle: "Decisão tática", tacticsHint: "Escolha um rolo, corrija uma vez e resolva.",
      acceptRunes: "Resolver", rerollReel: "Girar de novo", holdReel: "Guardar", leaderTactic: "Líder",
      selectReel: "Escolha primeiro um rolo.", correctionUsed: "Uma correção já foi usada neste turno.",
      heldNext: "Esta runa ficará guardada para o próximo giro.", autoLocked: "AUTO libera após concluir esta fenda.",
      intentAttack: "Ataque", intentHeavy: "Golpe forte", intentShield: "Criar escudo", intentHeal: "Curar aliado",
      intentCorrupt: "Corromper rolo", intentMixed: "Tática do chefe", enemyIntent: "Próximo: {action}",
      tacticConvert: "O líder mudou o rolo {reel} para {rune}.", rerolled: "Rolo {reel} girado novamente.",
      corruptedReel: "O rolo {reel} virou uma pedra adormecida.", enemyShielded: "O inimigo ganhou {value} de escudo.",
      enemyHealed: "O inimigo recuperou {value} de vida."
    },
    fr: {
      tacticsTitle: "Décision tactique", tacticsHint: "Choisissez un rouleau, corrigez une fois, puis résolvez.",
      acceptRunes: "Résoudre", rerollReel: "Relancer", holdReel: "Garder", leaderTactic: "Chef",
      selectReel: "Choisissez d'abord un rouleau.", correctionUsed: "Une correction a déjà été utilisée ce tour.",
      heldNext: "Cette rune sera gardée pour le prochain tour.", autoLocked: "AUTO se débloque après cette faille.",
      intentAttack: "Attaque", intentHeavy: "Frappe lourde", intentShield: "Bouclier", intentHeal: "Soigner un allié",
      intentCorrupt: "Corrompre un rouleau", intentMixed: "Tactique du boss", enemyIntent: "Ensuite : {action}",
      tacticConvert: "Le chef change le rouleau {reel} en {rune}.", rerolled: "Rouleau {reel} relancé.",
      corruptedReel: "Le rouleau {reel} devient une pierre dormante.", enemyShielded: "L'ennemi gagne {value} de bouclier.",
      enemyHealed: "L'ennemi récupère {value} PV."
    },
    de: {
      tacticsTitle: "Taktische Entscheidung", tacticsHint: "Wähle eine Walze, korrigiere einmal und werte aus.",
      acceptRunes: "Auswerten", rerollReel: "Neu drehen", holdReel: "Halten", leaderTactic: "Anführer",
      selectReel: "Wähle zuerst eine Walze.", correctionUsed: "Eine Korrektur wurde in diesem Zug bereits benutzt.",
      heldNext: "Diese Rune bleibt für den nächsten Dreh erhalten.", autoLocked: "AUTO wird nach Abschluss dieses Risses freigeschaltet.",
      intentAttack: "Angriff", intentHeavy: "Schwerer Schlag", intentShield: "Schild", intentHeal: "Verbündeten heilen",
      intentCorrupt: "Walze verderben", intentMixed: "Boss-Taktik", enemyIntent: "Nächste Aktion: {action}",
      tacticConvert: "Der Anführer ändert Walze {reel} zu {rune}.", rerolled: "Walze {reel} neu gedreht.",
      corruptedReel: "Walze {reel} wurde zum Ruhestein.", enemyShielded: "Der Gegner erhält {value} Schild.",
      enemyHealed: "Der Gegner heilt {value} Leben."
    },
    it: {
      tacticsTitle: "Decisione tattica", tacticsHint: "Scegli un rullo, correggi una volta e risolvi.",
      acceptRunes: "Risolvi", rerollReel: "Ritira", holdReel: "Conserva", leaderTactic: "Leader",
      selectReel: "Scegli prima un rullo.", correctionUsed: "Hai già usato una correzione in questo turno.",
      heldNext: "Questa runa resta per il prossimo giro.", autoLocked: "AUTO si sblocca dopo aver superato questa frattura.",
      intentAttack: "Attacco", intentHeavy: "Colpo pesante", intentShield: "Scudo", intentHeal: "Cura alleato",
      intentCorrupt: "Corrompi rullo", intentMixed: "Tattica del boss", enemyIntent: "Prossima: {action}",
      tacticConvert: "Il leader cambia il rullo {reel} in {rune}.", rerolled: "Rullo {reel} ritirato.",
      corruptedReel: "Il rullo {reel} diventa una pietra dormiente.", enemyShielded: "Il nemico ottiene {value} scudo.",
      enemyHealed: "Il nemico recupera {value} salute."
    },
    ru: {
      tacticsTitle: "Тактическое решение", tacticsHint: "Выберите барабан, исправьте один раз и завершите ход.",
      acceptRunes: "Завершить", rerollReel: "Переброс", holdReel: "Сохранить", leaderTactic: "Лидер",
      selectReel: "Сначала выберите барабан.", correctionUsed: "В этом ходу исправление уже использовано.",
      heldNext: "Руна сохранится для следующего вращения.", autoLocked: "AUTO откроется после прохождения этого разлома.",
      intentAttack: "Атака", intentHeavy: "Тяжёлый удар", intentShield: "Щит", intentHeal: "Лечение союзника",
      intentCorrupt: "Порча барабана", intentMixed: "Тактика босса", enemyIntent: "Далее: {action}",
      tacticConvert: "Лидер заменил барабан {reel} на {rune}.", rerolled: "Барабан {reel} переброшен.",
      corruptedReel: "Барабан {reel} превращён в спящий камень.", enemyShielded: "Враг получил {value} щита.",
      enemyHealed: "Враг восстановил {value} здоровья."
    },
    hi: {
      tacticsTitle: "रणनीतिक निर्णय", tacticsHint: "एक रील चुनें, एक बार सुधारें, फिर परिणाम लागू करें।",
      acceptRunes: "लागू करें", rerollReel: "फिर घुमाएँ", holdReel: "सहेजें", leaderTactic: "नेता",
      selectReel: "पहले एक रील चुनें।", correctionUsed: "इस चाल में एक सुधार पहले ही हो चुका है।",
      heldNext: "यह रून अगली स्पिन के लिए सुरक्षित रहेगा।", autoLocked: "इस रिफ्ट को पूरा करने के बाद AUTO खुलेगा।",
      intentAttack: "हमला", intentHeavy: "भारी वार", intentShield: "ढाल", intentHeal: "साथी को ठीक करना",
      intentCorrupt: "रील दूषित करना", intentMixed: "बॉस रणनीति", enemyIntent: "अगला: {action}",
      tacticConvert: "नेता ने रील {reel} को {rune} में बदला।", rerolled: "रील {reel} फिर घुमाई गई।",
      corruptedReel: "रील {reel} सुप्त पत्थर में दूषित हुई।", enemyShielded: "शत्रु को {value} ढाल मिली।",
      enemyHealed: "शत्रु ने {value} स्वास्थ्य पाया।"
    },
    ar: {
      tacticsTitle: "قرار تكتيكي", tacticsHint: "اختر بكرة، وعدّل مرة واحدة، ثم نفّذ النتيجة.",
      acceptRunes: "تنفيذ", rerollReel: "إعادة اللف", holdReel: "احتفاظ", leaderTactic: "القائد",
      selectReel: "اختر بكرة أولاً.", correctionUsed: "استُخدم تعديل واحد بالفعل في هذا الدور.",
      heldNext: "سيُحتفظ بهذه الرونة للدورة التالية.", autoLocked: "يفتح AUTO بعد اجتياز هذا الصدع.",
      intentAttack: "هجوم", intentHeavy: "ضربة قوية", intentShield: "درع", intentHeal: "علاج حليف",
      intentCorrupt: "إفساد بكرة", intentMixed: "تكتيك الزعيم", enemyIntent: "التالي: {action}",
      tacticConvert: "حوّل القائد البكرة {reel} إلى {rune}.", rerolled: "أُعيد لف البكرة {reel}.",
      corruptedReel: "فُسدت البكرة {reel} إلى حجر خامل.", enemyShielded: "حصل العدو على درع {value}.",
      enemyHealed: "استعاد العدو {value} صحة."
    }
  };
  const readySpin = {
    en: "Choose Ready to unlock the first Spin.",
    "zh-Hant": "按下「準備好了」即可解鎖第一次轉動。",
    "zh-Hans": "选择“准备好了”即可解锁第一次转动。",
    ja: "「準備完了」を選ぶと最初のスピンが解放されます。",
    ko: "준비 완료를 선택하면 첫 스핀이 열립니다.",
    es: "Elige Listo para desbloquear el primer giro.",
    "pt-BR": "Escolha Pronto para liberar o primeiro giro.",
    fr: "Choisissez Prêt pour débloquer le premier tour.",
    de: "Wähle Bereit, um die erste Drehung freizuschalten.",
    it: "Scegli Pronto per sbloccare il primo giro.",
    ru: "Нажмите «Готово», чтобы открыть первое вращение.",
    hi: "पहली स्पिन खोलने के लिए तैयार चुनें।",
    ar: "اختر جاهزًا لفتح اللفّة الأولى."
  };
  Object.keys(L).forEach(code => {
    Object.assign(L[code], patches[code] || patches.en);
    L[code].readySpin = readySpin[code] || readySpin.en;
    L[code].tipTactics = `${L[code].tacticsHint} ${L[code].rerollReel} / ${L[code].holdReel} / ${L[code].leaderTactic}.`;
  });
})();
