(function () {
  "use strict";

  const common = {
    title: "Zhao Yun & A Dou: Inkline Defense",
    shortTitle: "Inkline Defense",
    kicker: "A short merge-defense campaign",
    summary: "Recruit Chinese-character soldiers, merge matching units, and keep three lanes safe while Zhao Yun protects A Dou.",
    start: "Start Campaign",
    guideTitle: "How to play",
    guideBody: "Recruit a unit, place it in an open lane, then select two matching characters to merge. Keep a reserve unit before merging so a lane never goes empty.",
    guideRule1: "Recruit with the buns resource.",
    guideRule2: "Merge equal characters before a lane is overwhelmed.",
    guideRule3: "Tap a general skill when the pressure rises.",
    posterAlt: "Ink wash battlefield with Zhao Yun and A Dou",
    stageTitle: "Choose a mission",
    stageProgress: "Campaign progress",
    chapter: "Chapter",
    mission: "Mission",
    locked: "Locked",
    cleared: "Cleared",
    ready: "Ready",
    startMission: "Enter battle",
    returnMain: "Back to game",
    battleTitle: "Inkline Defense",
    enemyCamp: "Enemy command",
    allyCamp: "A Dou's camp",
    commandPost: "Command post",
    adou: "A Dou",
    hp: "Health",
    wave: "Wave",
    buns: "Buns",
    recruit: "Recruit",
    recruitHint: "Spend 3 buns to call a new soldier.",
    mergeHint: "Select a unit, then tap an empty slot to change lanes; select a matching unit to merge.",
    selected: "Selected",
    empty: "Empty lane",
    lane: "Lane",
    pause: "Pause",
    hint: "Hint",
    leave: "Leave battle",
    continueBattle: "Continue",
    leaveConfirmTitle: "Leave this battle?",
    leaveConfirmBody: "Your current battle will be lost if you return to the mission map.",
    cancel: "Cancel",
    leaveNow: "Leave",
    tutorialTitle: "Your first command",
    tutorialRecruit: "Tap Recruit to place a new character.",
    tutorialMerge: "Select two equal characters. The second tap merges them.",
    tutorialDefend: "Cover all three lanes and use a general skill when pressure rises.",
    gotIt: "Got it",
    win: "Victory",
    lose: "The line broke",
    winBody: "A Dou is safe and the enemy command post has fallen.",
    loseBody: "The enemy reached A Dou. Adjust your merges and try again.",
    stars: "Stars",
    stages: "Stages",
    nextStage: "Next stage",
    replay: "Replay",
    time: "Time",
    skill: "Skill",
    readySkill: "Ready",
    cooldown: "Cooling",
    noSpace: "Every formation slot is full.",
    notEnough: "You need 3 buns.",
    cannotMerge: "Only matching characters at the same level can merge.",
    statusRecruit: "A new unit joined the formation.",
    statusMerge: "The formation grew stronger.",
    statusMergePayoff: "Merge complete: Level {level} is ready to hit harder.",
    statusGeneralPayoff: "Promotion complete: a General skill is ready.",
    statusMove: "The unit moved to a new lane.",
    statusSkill: "Skill activated.",
    statusBoss: "The enemy commander has entered the line.",
    general: "General",
    level: "Level",
    tutorialAria: "Battle tutorial",
    close: "Close",
    settings: "Settings",
    sound: "Sound",
    on: "On",
    off: "Off",
    language: "Language",
    tip: "Tip",
    tipText: "A high-level unit is powerful, but an empty lane can still lose the battle.",
    battleGuideTitle: "Battle plan",
    battleGuideBody: "Your units attack automatically. Recruit and merge to cover all three lanes; enemies move toward A Dou.",
    pressureClear: "Pressure watch: all three lanes are covered.",
    pressureOpen: "Pressure watch: Lane {lane} has no defender.",
    pressureEnemy: "Pressure watch: Lane {lane} has an enemy approaching.",
    pressureOpenEnemy: "Pressure watch: Lane {lane} is open with an enemy approaching.",
    attackCue: "Attack",
    enemySoldier: "Enemy soldier",
    boss: "Enemy commander",
    defeated: "Defeated",
    prototype: "Internal prototype",
  };

  const dictionaries = {
    en: common,
    "zh-Hant": {
      title: "趙雲與阿斗：墨線守衛", shortTitle: "墨線守衛", kicker: "短局合成防守戰",
      summary: "徵召漢字小兵、合成相同部隊，守住三條戰線，讓趙雲保護阿斗。",
      start: "開始戰役", guideTitle: "玩法", guideBody: "先徵召部隊，放到空出的戰線，再選取兩個相同文字合成。合成前保留一名備兵，避免某一路失守。",
      stageTitle: "選擇關卡", stageProgress: "戰役進度", chapter: "章節", mission: "關卡", locked: "尚未解鎖", cleared: "已通關", ready: "可挑戰", startMission: "進入戰場", returnMain: "返回遊戲",
      battleTitle: "墨線守衛", enemyCamp: "敵軍陣地", allyCamp: "阿斗營地", commandPost: "敵軍指揮所", adou: "阿斗", hp: "生命", wave: "波次", buns: "饅頭", recruit: "徵召", recruitHint: "消耗 3 個饅頭召集新部隊。", mergeHint: "先選取部隊，再點擊空位即可切換戰線；點擊相同部隊則可合成。", selected: "已選取", empty: "空戰線", lane: "戰線", pause: "暫停", hint: "提示",
      leave: "離開戰鬥", continueBattle: "繼續戰鬥", leaveConfirmTitle: "要離開戰鬥嗎？", leaveConfirmBody: "返回關卡地圖會失去目前的戰鬥進度。", cancel: "取消", leaveNow: "離開",
      tutorialTitle: "第一次指揮", tutorialRecruit: "點擊「徵召」放入新的文字部隊。", tutorialMerge: "先後選取兩個相同文字，第二次點擊會完成合成。", tutorialDefend: "守住三條戰線，壓力升高時使用武將技能。", gotIt: "知道了",
      win: "勝利", lose: "戰線失守", winBody: "阿斗平安，敵軍指揮所已被擊破。", loseBody: "敵軍突破並接近阿斗，調整合成順序後再試一次。", stars: "星數", stages: "關卡", nextStage: "下一關", replay: "再玩一次", time: "時間", skill: "技能", readySkill: "就緒", cooldown: "冷卻中", noSpace: "所有編制位置都已滿。", notEnough: "還需要 3 個饅頭。", cannotMerge: "只有相同文字、相同等級的部隊可以合成。", statusRecruit: "新部隊加入編制。", statusMerge: "編制變得更強了。", statusMergePayoff: "合成完成：等級 {level} 的部隊準備以更強攻勢出擊。", statusGeneralPayoff: "升格完成：武將技能已就緒。", statusMove: "部隊移動到新的戰線。", statusSkill: "技能已發動。", statusBoss: "敵方武將進入戰線。", general: "武將", level: "等級", tutorialAria: "戰鬥教學", close: "關閉", settings: "設定", sound: "音效", on: "開", off: "關", language: "語言", tip: "提示", tipText: "高等級部隊很強，但空掉的戰線仍然會輸掉戰鬥。", prototype: "內部原型",
    },
    "zh-Hans": { ...common, title: "赵云与阿斗：墨线守卫", shortTitle: "墨线守卫", start: "开始战役", stageTitle: "选择关卡", stageProgress: "战役进度", chapter: "章节", mission: "关卡", locked: "尚未解锁", cleared: "已通关", ready: "可挑战", startMission: "进入战场", returnMain: "返回游戏", enemyCamp: "敌军阵地", allyCamp: "阿斗营地", commandPost: "敌军指挥所", adou: "阿斗", hp: "生命", wave: "波次", buns: "馒头", recruit: "征召", recruitHint: "消耗 3 个馒头召集新部队。", mergeHint: "先选择部队，再点击空位即可切换战线；点击相同部队即可合成。", selected: "已选择", empty: "空战线", lane: "战线", hint: "提示", continueBattle: "继续战斗", leaveConfirmTitle: "要离开战斗吗？", leaveConfirmBody: "返回关卡地图会失去当前的战斗进度。", cancel: "取消", leaveNow: "离开", tutorialTitle: "第一次指挥", tutorialRecruit: "点击“征召”放入新的文字部队。", tutorialMerge: "依次选择两个相同文字，第二次点击会完成合成。", tutorialDefend: "守住三条战线，压力升高时使用武将技能。", gotIt: "知道了", win: "胜利", lose: "战线失守", winBody: "阿斗平安，敌军指挥所已经击破。", loseBody: "敌军突破并接近阿斗，调整合成顺序后再试一次。", stars: "星数", stages: "关卡", nextStage: "下一关", replay: "再玩一次", time: "时间", readySkill: "就绪", cooldown: "冷却中", noSpace: "所有编制位置都已满。", notEnough: "还需要 3 个馒头。", cannotMerge: "只有相同文字、相同等级的部队可以合成。", statusRecruit: "新部队加入编制。", statusMerge: "编制变得更强了。", statusMove: "部队移动到新的战线。", statusSkill: "技能已经发动。", statusBoss: "敌方武将进入战线。", general: "武将", level: "等级", settings: "设置", sound: "音效", on: "开", off: "关", language: "语言", tip: "提示", tipText: "高等级部队很强，但空掉的战线仍然会输掉战斗。", prototype: "内部原型" },
    ja: { ...common, title: "趙雲と阿斗：墨線ディフェンス", shortTitle: "墨線ディフェンス", start: "キャンペーン開始", stageTitle: "任務を選ぶ", stageProgress: "進行状況", chapter: "章", mission: "任務", locked: "ロック中", cleared: "クリア", ready: "挑戦可能", startMission: "戦場へ", returnMain: "ゲームに戻る", enemyCamp: "敵陣", allyCamp: "阿斗の陣", commandPost: "敵司令所", adou: "阿斗", hp: "体力", wave: "ウェーブ", buns: "饅頭", recruit: "招集", mergeHint: "部隊を選び、空きスロットをタップするとレーンを変更できます。同じ部隊を選ぶと合成します。", selected: "選択中", empty: "空きレーン", lane: "レーン", hint: "ヒント", continueBattle: "続ける", leaveConfirmTitle: "戦闘を離れますか？", leaveConfirmBody: "任務マップに戻ると現在の戦闘を失います。", cancel: "キャンセル", leaveNow: "離れる", tutorialTitle: "最初の指揮", tutorialRecruit: "招集を押して新しい兵を配置します。", tutorialMerge: "同じ文字を2つ選び、2回目のタップで合成します。", tutorialDefend: "3レーンを守り、危険な時は武将技を使います。", gotIt: "了解", win: "勝利", lose: "防衛失敗", winBody: "阿斗を守り、敵司令所を破壊しました。", loseBody: "敵が阿斗に到達しました。合成を変えて再挑戦しましょう。", stars: "星", stages: "任務", nextStage: "次の任務", replay: "もう一度", time: "時間", skill: "技", readySkill: "使用可能", cooldown: "準備中", noSpace: "編成スロットが一杯です。", notEnough: "饅頭が3個必要です。", cannotMerge: "同じ文字とレベルだけ合成できます。", statusRecruit: "新しい兵が加わりました。", statusMerge: "部隊が強くなりました。", statusMove: "兵を別のレーンへ移動しました。", statusSkill: "技を発動しました。", statusBoss: "敵将が戦線に入りました。", general: "武将", level: "レベル", settings: "設定", sound: "サウンド", on: "オン", off: "オフ", language: "言語", tip: "ヒント", tipText: "強い部隊だけでなく、3レーンを空けないことが大切です。", prototype: "内部プロトタイプ" },
    ko: { ...common, title: "조운과 아두: 먹선 방어전", shortTitle: "먹선 방어전", start: "캠페인 시작", stageTitle: "임무 선택", stageProgress: "진행도", chapter: "장", mission: "임무", locked: "잠김", cleared: "완료", ready: "도전 가능", startMission: "전투 시작", returnMain: "게임으로 돌아가기", enemyCamp: "적 진영", allyCamp: "아두의 진영", commandPost: "적 지휘소", adou: "아두", hp: "체력", wave: "웨이브", buns: "만두", recruit: "모집", mergeHint: "부대를 선택한 뒤 빈 칸을 누르면 전선을 바꿀 수 있습니다. 같은 부대를 누르면 합쳐집니다.", selected: "선택됨", empty: "빈 전선", lane: "전선", hint: "힌트", continueBattle: "계속", leaveConfirmTitle: "전투를 나갈까요?", leaveConfirmBody: "임무 지도로 돌아가면 현재 전투를 잃습니다.", cancel: "취소", leaveNow: "나가기", tutorialTitle: "첫 지휘", tutorialRecruit: "모집을 눌러 새 병사를 배치하세요.", tutorialMerge: "같은 문자를 두 개 선택하면 두 번째 선택에서 합쳐집니다.", tutorialDefend: "세 전선을 지키고 위험할 때 장수 기술을 사용하세요.", gotIt: "알겠습니다", win: "승리", lose: "전선 붕괴", winBody: "아두를 지키고 적 지휘소를 무너뜨렸습니다.", loseBody: "적이 아두에게 닿았습니다. 합성 순서를 바꿔 다시 도전하세요.", stars: "별", stages: "임무", nextStage: "다음 임무", replay: "다시", time: "시간", skill: "기술", readySkill: "사용 가능", cooldown: "준비 중", noSpace: "편성 칸이 가득 찼습니다.", notEnough: "만두 3개가 필요합니다.", cannotMerge: "같은 문자와 레벨만 합칠 수 있습니다.", statusRecruit: "새 병사가 합류했습니다.", statusMerge: "편성이 강해졌습니다.", statusMove: "병사가 새 전선으로 이동했습니다.", statusSkill: "기술을 사용했습니다.", statusBoss: "적 장수가 전선에 나타났습니다.", general: "장수", level: "레벨", settings: "설정", sound: "소리", on: "켜기", off: "끄기", language: "언어", tip: "힌트", tipText: "강한 부대도 중요하지만 세 전선을 비우지 않는 것이 더 중요합니다.", prototype: "내부 프로토타입" },
    es: { ...common, title: "Zhao Yun y A Dou: Defensa de tinta", shortTitle: "Defensa de tinta", start: "Iniciar campaña", stageTitle: "Elige una misión", stageProgress: "Progreso", chapter: "Capítulo", mission: "Misión", locked: "Bloqueada", cleared: "Superada", ready: "Lista", startMission: "Entrar en batalla", returnMain: "Volver al juego", enemyCamp: "Campamento enemigo", allyCamp: "Campamento de A Dou", commandPost: "Puesto enemigo", adou: "A Dou", hp: "Salud", wave: "Oleada", buns: "Bollos", recruit: "Reclutar", mergeHint: "Selecciona una unidad y toca un espacio vacío para cambiarla de línea; toca una igual para fusionarla.", selected: "Seleccionado", empty: "Línea vacía", lane: "Línea", hint: "Pista", continueBattle: "Continuar", leaveConfirmTitle: "¿Salir de la batalla?", leaveConfirmBody: "Volver al mapa perderá la batalla actual.", cancel: "Cancelar", leaveNow: "Salir", tutorialTitle: "Tu primer mando", tutorialRecruit: "Pulsa Reclutar para colocar una unidad.", tutorialMerge: "Selecciona dos caracteres iguales; el segundo toque los fusiona.", tutorialDefend: "Cubre las tres líneas y usa una habilidad cuando suba la presión.", gotIt: "Entendido", win: "Victoria", lose: "La línea cayó", winBody: "A Dou está a salvo y el puesto enemigo ha caído.", loseBody: "El enemigo llegó a A Dou. Cambia tus fusiones y vuelve a intentarlo.", stars: "Estrellas", stages: "Misiones", nextStage: "Siguiente", replay: "Repetir", time: "Tiempo", skill: "Habilidad", readySkill: "Lista", cooldown: "Recargando", noSpace: "No quedan espacios.", notEnough: "Necesitas 3 bollos.", cannotMerge: "Solo se fusionan caracteres iguales del mismo nivel.", statusRecruit: "Una unidad se unió.", statusMerge: "La formación es más fuerte.", statusMove: "La unidad cambió de línea.", statusSkill: "Habilidad activada.", statusBoss: "El comandante enemigo entra en la línea.", general: "General", level: "Nivel", settings: "Ajustes", sound: "Sonido", on: "Sí", off: "No", language: "Idioma", tip: "Pista", tipText: "Una unidad fuerte ayuda, pero una línea vacía aún puede perder la batalla.", prototype: "Prototipo interno" },
    "pt-BR": { ...common, title: "Zhao Yun e A Dou: Defesa de Tinta", shortTitle: "Defesa de Tinta", start: "Iniciar campanha", stageTitle: "Escolha uma missão", stageProgress: "Progresso", chapter: "Capítulo", mission: "Missão", locked: "Bloqueada", cleared: "Concluída", ready: "Pronta", startMission: "Entrar na batalha", returnMain: "Voltar ao jogo", enemyCamp: "Acampamento inimigo", allyCamp: "Acampamento de A Dou", commandPost: "Posto inimigo", adou: "A Dou", hp: "Vida", wave: "Onda", buns: "Pães", recruit: "Recrutar", mergeHint: "Selecione uma unidade e toque em um espaço vazio para mudar de linha; toque em outra igual para fundi-las.", selected: "Selecionado", empty: "Linha vazia", lane: "Linha", hint: "Dica", continueBattle: "Continuar", leaveConfirmTitle: "Sair da batalha?", leaveConfirmBody: "Voltar ao mapa fará você perder a batalha atual.", cancel: "Cancelar", leaveNow: "Sair", tutorialTitle: "Seu primeiro comando", tutorialRecruit: "Toque em Recrutar para colocar uma unidade.", tutorialMerge: "Selecione dois caracteres iguais; o segundo toque faz a fusão.", tutorialDefend: "Cubra as três linhas e use uma habilidade quando a pressão aumentar.", gotIt: "Entendi", win: "Vitória", lose: "A linha caiu", winBody: "A Dou está seguro e o posto inimigo caiu.", loseBody: "O inimigo alcançou A Dou. Mude suas fusões e tente novamente.", stars: "Estrelas", stages: "Missões", nextStage: "Próxima", replay: "Repetir", time: "Tempo", skill: "Habilidade", readySkill: "Pronta", cooldown: "Recarregando", noSpace: "Não há espaços.", notEnough: "Você precisa de 3 pães.", cannotMerge: "Apenas caracteres iguais do mesmo nível podem ser fundidos.", statusRecruit: "Uma unidade entrou na formação.", statusMerge: "A formação ficou mais forte.", statusMove: "A unidade mudou de linha.", statusSkill: "Habilidade ativada.", statusBoss: "O comandante inimigo entrou na linha.", general: "General", level: "Nível", settings: "Configurações", sound: "Som", on: "Ligado", off: "Desligado", language: "Idioma", tip: "Dica", tipText: "Uma unidade forte ajuda, mas uma linha vazia ainda pode perder a batalha.", prototype: "Protótipo interno" },
    fr: { ...common, title: "Zhao Yun et A Dou : Défense d'encre", shortTitle: "Défense d'encre", start: "Lancer la campagne", stageTitle: "Choisissez une mission", stageProgress: "Progression", chapter: "Chapitre", mission: "Mission", locked: "Verrouillée", cleared: "Réussie", ready: "Prête", startMission: "Entrer en bataille", returnMain: "Retour au jeu", enemyCamp: "Camp ennemi", allyCamp: "Camp d'A Dou", commandPost: "Poste ennemi", adou: "A Dou", hp: "Vie", wave: "Vague", buns: "Pains", recruit: "Recruter", mergeHint: "Sélectionnez une unité puis touchez un emplacement vide pour changer de ligne ; touchez une unité identique pour fusionner.", selected: "Sélectionné", empty: "Ligne vide", lane: "Ligne", hint: "Indice", continueBattle: "Continuer", leaveConfirmTitle: "Quitter la bataille ?", leaveConfirmBody: "Le retour à la carte fera perdre la bataille en cours.", cancel: "Annuler", leaveNow: "Quitter", tutorialTitle: "Votre premier commandement", tutorialRecruit: "Touchez Recruter pour placer une unité.", tutorialMerge: "Sélectionnez deux caractères identiques ; le second toucher les fusionne.", tutorialDefend: "Couvrez les trois lignes et utilisez une compétence sous pression.", gotIt: "Compris", win: "Victoire", lose: "La ligne a cédé", winBody: "A Dou est sain et sauf, le poste ennemi est tombé.", loseBody: "L'ennemi a atteint A Dou. Changez vos fusions et réessayez.", stars: "Étoiles", stages: "Missions", nextStage: "Suivante", replay: "Rejouer", time: "Temps", skill: "Compétence", readySkill: "Prête", cooldown: "Recharge", noSpace: "Tous les emplacements sont occupés.", notEnough: "Il faut 3 pains.", cannotMerge: "Seuls deux caractères identiques du même niveau fusionnent.", statusRecruit: "Une unité rejoint la formation.", statusMerge: "La formation devient plus forte.", statusMove: "L'unité change de ligne.", statusSkill: "Compétence activée.", statusBoss: "Le commandant ennemi entre dans la ligne.", general: "Général", level: "Niveau", settings: "Réglages", sound: "Son", on: "Activé", off: "Désactivé", language: "Langue", tip: "Indice", tipText: "Une unité forte aide, mais une ligne vide peut encore faire perdre la bataille.", prototype: "Prototype interne" },
    de: { ...common, title: "Zhao Yun und A Dou: Tuschewache", shortTitle: "Tuschewache", start: "Kampagne starten", stageTitle: "Mission wählen", stageProgress: "Fortschritt", chapter: "Kapitel", mission: "Mission", locked: "Gesperrt", cleared: "Geschafft", ready: "Bereit", startMission: "In die Schlacht", returnMain: "Zum Spiel", enemyCamp: "Feindlager", allyCamp: "A Dous Lager", commandPost: "Feindposten", adou: "A Dou", hp: "Leben", wave: "Welle", buns: "Fladen", recruit: "Rekrutieren", mergeHint: "Wähle eine Einheit und tippe auf einen freien Platz, um die Linie zu wechseln; tippe auf eine gleiche Einheit zum Verschmelzen.", selected: "Ausgewählt", empty: "Leere Linie", lane: "Linie", hint: "Tipp", continueBattle: "Weiter", leaveConfirmTitle: "Schlacht verlassen?", leaveConfirmBody: "Die Rückkehr zur Karte beendet die aktuelle Schlacht.", cancel: "Abbrechen", leaveNow: "Verlassen", tutorialTitle: "Dein erstes Kommando", tutorialRecruit: "Tippe auf Rekrutieren, um eine Einheit zu platzieren.", tutorialMerge: "Wähle zwei gleiche Zeichen; die zweite Auswahl verschmilzt sie.", tutorialDefend: "Halte alle drei Linien und nutze bei Druck eine Fähigkeit.", gotIt: "Verstanden", win: "Sieg", lose: "Linie gefallen", winBody: "A Dou ist sicher und der Feindposten ist gefallen.", loseBody: "Der Feind erreichte A Dou. Ändere deine Fusionen und versuche es erneut.", stars: "Sterne", stages: "Missionen", nextStage: "Nächste", replay: "Nochmal", time: "Zeit", skill: "Fähigkeit", readySkill: "Bereit", cooldown: "Abkühlung", noSpace: "Alle Plätze sind belegt.", notEnough: "Du brauchst 3 Fladen.", cannotMerge: "Nur gleiche Zeichen derselben Stufe können verschmelzen.", statusRecruit: "Eine Einheit schließt sich an.", statusMerge: "Die Formation wird stärker.", statusMove: "Die Einheit wechselt die Linie.", statusSkill: "Fähigkeit aktiviert.", statusBoss: "Der feindliche Kommandant betritt die Linie.", general: "General", level: "Stufe", settings: "Einstellungen", sound: "Ton", on: "An", off: "Aus", language: "Sprache", tip: "Tipp", tipText: "Eine starke Einheit hilft, aber eine leere Linie kann die Schlacht trotzdem verlieren.", prototype: "Interner Prototyp" },
    it: { ...common, title: "Zhao Yun e A Dou: Difesa d'inchiostro", shortTitle: "Difesa d'inchiostro", start: "Inizia campagna", stageTitle: "Scegli una missione", stageProgress: "Progressi", chapter: "Capitolo", mission: "Missione", locked: "Bloccata", cleared: "Completata", ready: "Pronta", startMission: "Entra in battaglia", returnMain: "Torna al gioco", enemyCamp: "Campo nemico", allyCamp: "Campo di A Dou", commandPost: "Posto nemico", adou: "A Dou", hp: "Salute", wave: "Ondata", buns: "Panini", recruit: "Recluta", mergeHint: "Seleziona un'unità e tocca uno spazio vuoto per cambiare linea; tocca un'unità uguale per unirle.", selected: "Selezionato", empty: "Linea vuota", lane: "Linea", hint: "Suggerimento", continueBattle: "Continua", leaveConfirmTitle: "Lasciare la battaglia?", leaveConfirmBody: "Tornare alla mappa farà perdere la battaglia attuale.", cancel: "Annulla", leaveNow: "Lascia", tutorialTitle: "Il tuo primo comando", tutorialRecruit: "Tocca Recluta per mettere un'unità.", tutorialMerge: "Seleziona due caratteri uguali; il secondo tocco li unisce.", tutorialDefend: "Copri tutte e tre le linee e usa un'abilità sotto pressione.", gotIt: "Capito", win: "Vittoria", lose: "Linea perduta", winBody: "A Dou è al sicuro e il posto nemico è caduto.", loseBody: "Il nemico ha raggiunto A Dou. Cambia le fusioni e riprova.", stars: "Stelle", stages: "Missioni", nextStage: "Successiva", replay: "Rigioca", time: "Tempo", skill: "Abilità", readySkill: "Pronta", cooldown: "Ricarica", noSpace: "Tutti gli spazi sono pieni.", notEnough: "Servono 3 panini.", cannotMerge: "Si fondono solo caratteri uguali dello stesso livello.", statusRecruit: "Una nuova unità è entrata.", statusMerge: "La formazione è più forte.", statusMove: "L'unità ha cambiato linea.", statusSkill: "Abilità attivata.", statusBoss: "Il comandante nemico entra nella linea.", general: "Generale", level: "Livello", settings: "Impostazioni", sound: "Suono", on: "Attivo", off: "Disattivo", language: "Lingua", tip: "Suggerimento", tipText: "Un'unità forte aiuta, ma una linea vuota può ancora perdere la battaglia.", prototype: "Prototipo interno" },
    ru: { ...common, title: "Чжао Юнь и А-Доу: Чернильная оборона", shortTitle: "Чернильная оборона", start: "Начать кампанию", stageTitle: "Выберите миссию", stageProgress: "Прогресс", chapter: "Глава", mission: "Миссия", locked: "Закрыта", cleared: "Пройдена", ready: "Готова", startMission: "В бой", returnMain: "Назад в игру", enemyCamp: "Лагерь врага", allyCamp: "Лагерь А-Доу", commandPost: "Пост врага", adou: "А-Доу", hp: "Здоровье", wave: "Волна", buns: "Булочки", recruit: "Призыв", mergeHint: "Выберите бойца и нажмите пустое место, чтобы сменить линию; нажмите одинакового бойца для слияния.", selected: "Выбрано", empty: "Пустая линия", lane: "Линия", hint: "Подсказка", continueBattle: "Продолжить", leaveConfirmTitle: "Выйти из боя?", leaveConfirmBody: "Возврат на карту завершит текущий бой.", cancel: "Отмена", leaveNow: "Выйти", tutorialTitle: "Ваш первый приказ", tutorialRecruit: "Нажмите Призыв, чтобы поставить бойца.", tutorialMerge: "Выберите два одинаковых знака; второе нажатие объединит их.", tutorialDefend: "Держите три линии и применяйте умение при угрозе.", gotIt: "Понятно", win: "Победа", lose: "Линия прорвана", winBody: "А-Доу спасён, а вражеский пост пал.", loseBody: "Враг достиг А-Доу. Измените слияния и попробуйте снова.", stars: "Звёзды", stages: "Миссии", nextStage: "Следующая", replay: "Повторить", time: "Время", skill: "Умение", readySkill: "Готово", cooldown: "Перезарядка", noSpace: "Все места заняты.", notEnough: "Нужно 3 булочки.", cannotMerge: "Сливать можно только одинаковые знаки одного уровня.", statusRecruit: "Новый боец в строю.", statusMerge: "Строй стал сильнее.", statusMove: "Боец сменил линию.", statusSkill: "Умение активировано.", statusBoss: "Вражеский командир вступил в бой.", general: "Генерал", level: "Уровень", settings: "Настройки", sound: "Звук", on: "Вкл.", off: "Выкл.", language: "Язык", tip: "Подсказка", tipText: "Сильный боец важен, но пустая линия всё равно может проиграть бой.", prototype: "Внутренний прототип" },
    hi: { ...common, title: "झाओ युन और आ-दो: स्याही रक्षा", shortTitle: "स्याही रक्षा", start: "अभियान शुरू करें", stageTitle: "मिशन चुनें", stageProgress: "प्रगति", chapter: "अध्याय", mission: "मिशन", locked: "बंद", cleared: "पूरा", ready: "तैयार", startMission: "युद्ध में जाएँ", returnMain: "खेल पर लौटें", enemyCamp: "शत्रु शिविर", allyCamp: "आ-दो का शिविर", commandPost: "शत्रु चौकी", adou: "आ-दो", hp: "स्वास्थ्य", wave: "लहर", buns: "बन्स", recruit: "भर्ती", mergeHint: "इकाई चुनें और पंक्ति बदलने के लिए खाली स्थान दबाएँ; मिलाने के लिए समान इकाई दबाएँ।", selected: "चयनित", empty: "खाली पंक्ति", lane: "पंक्ति", hint: "संकेत", continueBattle: "जारी रखें", leaveConfirmTitle: "युद्ध छोड़ें?", leaveConfirmBody: "मानचित्र पर लौटने से वर्तमान युद्ध खो जाएगा।", cancel: "रद्द", leaveNow: "छोड़ें", tutorialTitle: "आपका पहला आदेश", tutorialRecruit: "नई इकाई रखने के लिए भर्ती दबाएँ।", tutorialMerge: "दो समान अक्षर चुनें; दूसरा स्पर्श उन्हें मिलाता है।", tutorialDefend: "तीनों पंक्तियाँ बचाएँ और दबाव बढ़ने पर कौशल चलाएँ।", gotIt: "समझ गया", win: "विजय", lose: "पंक्ति टूट गई", winBody: "आ-दो सुरक्षित है और शत्रु चौकी गिर गई।", loseBody: "शत्रु आ-दो तक पहुँच गया। विलय बदलकर फिर कोशिश करें।", stars: "सितारे", stages: "मिशन", nextStage: "अगला", replay: "फिर खेलें", time: "समय", skill: "कौशल", readySkill: "तैयार", cooldown: "तैयारी", noSpace: "सभी स्थान भरे हैं।", notEnough: "3 बन्स चाहिए।", cannotMerge: "केवल समान स्तर के समान अक्षर मिल सकते हैं।", statusRecruit: "नई इकाई जुड़ गई।", statusMerge: "दल मजबूत हुआ।", statusMove: "इकाई नई पंक्ति में गई।", statusSkill: "कौशल सक्रिय।", statusBoss: "शत्रु सेनापति पंक्ति में आया।", general: "सेनापति", level: "स्तर", settings: "सेटिंग", sound: "ध्वनि", on: "चालू", off: "बंद", language: "भाषा", tip: "संकेत", tipText: "मजबूत इकाई उपयोगी है, लेकिन खाली पंक्ति से युद्ध फिर भी हार सकते हैं।", prototype: "आंतरिक प्रोटोटाइप" },
    ar: { ...common, title: "تشاو يون وآ دو: دفاع الحبر", shortTitle: "دفاع الحبر", start: "ابدأ الحملة", stageTitle: "اختر مهمة", stageProgress: "التقدم", chapter: "الفصل", mission: "المهمة", locked: "مغلقة", cleared: "مكتملة", ready: "جاهزة", startMission: "إلى المعركة", returnMain: "العودة إلى اللعبة", enemyCamp: "معسكر العدو", allyCamp: "معسكر آ دو", commandPost: "مركز العدو", adou: "آ دو", hp: "الصحة", wave: "الموجة", buns: "الخبز", recruit: "تجنيد", mergeHint: "اختر وحدة ثم اضغط خانة فارغة لتغيير المسار؛ اضغط وحدة مطابقة لدمجهما.", selected: "محدد", empty: "مسار فارغ", lane: "المسار", hint: "تلميح", continueBattle: "متابعة", leaveConfirmTitle: "مغادرة المعركة؟", leaveConfirmBody: "العودة إلى الخريطة ستفقد المعركة الحالية.", cancel: "إلغاء", leaveNow: "مغادرة", tutorialTitle: "أول قيادة لك", tutorialRecruit: "اضغط تجنيد لوضع وحدة جديدة.", tutorialMerge: "اختر حرفين متطابقين؛ الاختيار الثاني يدمجهما.", tutorialDefend: "احمِ المسارات الثلاثة واستخدم مهارة عند ارتفاع الضغط.", gotIt: "فهمت", win: "انتصار", lose: "انهار المسار", winBody: "آ دو آمن وسقط مركز العدو.", loseBody: "وصل العدو إلى آ دو. غيّر الدمج وحاول مجدداً.", stars: "النجوم", stages: "المهام", nextStage: "المهمة التالية", replay: "إعادة", time: "الوقت", skill: "المهارة", readySkill: "جاهزة", cooldown: "تجهيز", noSpace: "كل الخانات ممتلئة.", notEnough: "تحتاج إلى 3 قطع خبز.", cannotMerge: "يمكن دمج الحروف المتطابقة من المستوى نفسه فقط.", statusRecruit: "انضمت وحدة جديدة.", statusMerge: "أصبح التشكيل أقوى.", statusMove: "انتقلت الوحدة إلى مسار جديد.", statusSkill: "تم تفعيل المهارة.", statusBoss: "دخل قائد العدو إلى المسار.", general: "القائد", level: "المستوى", settings: "الإعدادات", sound: "الصوت", on: "تشغيل", off: "إيقاف", language: "اللغة", tip: "تلميح", tipText: "الوحدة القوية مهمة، لكن المسار الفارغ قد يخسر المعركة.", prototype: "نموذج داخلي" },
  };

  const localeExtras = {
    "zh-Hant": { guideRule1: "用饅頭徵召部隊。", guideRule2: "在戰線被壓垮前合成相同文字。", guideRule3: "壓力升高時點擊武將技能。", posterAlt: "趙雲與阿斗所在的水墨戰場", battleGuideTitle: "戰鬥重點", battleGuideBody: "部隊會自動攻擊。請徵召、合成並守住三條戰線；敵人會向阿斗前進。", enemySoldier: "敵方小兵", boss: "敵方武將", defeated: "已擊破" },
    "zh-Hans": { guideRule1: "用馒头征召部队。", guideRule2: "在战线被压垮前合成相同文字。", guideRule3: "压力升高时点击武将技能。", posterAlt: "赵云与阿斗所在的水墨战场" },
    ja: { guideRule1: "饅頭で兵を招集します。", guideRule2: "レーンが押される前に同じ文字を合成します。", guideRule3: "危険な時は武将技を使います。", posterAlt: "趙雲と阿斗の墨絵の戦場" },
    ko: { guideRule1: "만두로 병사를 모집하세요.", guideRule2: "전선이 무너지기 전에 같은 문자를 합치세요.", guideRule3: "압력이 높아지면 장수 기술을 사용하세요.", posterAlt: "조운과 아두가 있는 먹선 전장" },
    es: { guideRule1: "Recluta con el recurso de bollos.", guideRule2: "Fusiona caracteres iguales antes de que caiga una línea.", guideRule3: "Pulsa una habilidad cuando suba la presión.", posterAlt: "Campo de batalla de tinta con Zhao Yun y A Dou" },
    "pt-BR": { guideRule1: "Recrute usando o recurso de pães.", guideRule2: "Faça fusões antes que uma linha seja vencida.", guideRule3: "Toque uma habilidade quando a pressão aumentar.", posterAlt: "Campo de batalha de tinta com Zhao Yun e A Dou" },
    fr: { guideRule1: "Recrutez avec la ressource de pains.", guideRule2: "Fusionnez les caractères avant qu'une ligne ne cède.", guideRule3: "Touchez une compétence quand la pression monte.", posterAlt: "Champ de bataille à l'encre avec Zhao Yun et A Dou" },
    de: { guideRule1: "Rekrutiere mit der Fladen-Ressource.", guideRule2: "Verschmilz gleiche Zeichen, bevor eine Linie fällt.", guideRule3: "Tippe bei steigendem Druck auf eine Fähigkeit.", posterAlt: "Tusche-Schlachtfeld mit Zhao Yun und A Dou" },
    it: { guideRule1: "Recluta usando la risorsa dei panini.", guideRule2: "Fondi i caratteri uguali prima che cada una linea.", guideRule3: "Tocca un'abilità quando aumenta la pressione.", posterAlt: "Campo di battaglia a inchiostro con Zhao Yun e A Dou" },
    ru: { guideRule1: "Призывайте бойцов за булочки.", guideRule2: "Объединяйте знаки до прорыва линии.", guideRule3: "Используйте умение при росте давления.", posterAlt: "Чернильное поле боя с Чжао Юнем и А-Доу" },
    hi: { guideRule1: "बन्स से सैनिकों की भर्ती करें।", guideRule2: "पंक्ति टूटने से पहले समान अक्षर मिलाएँ।", guideRule3: "दबाव बढ़ने पर सेनापति कौशल चलाएँ।", posterAlt: "झाओ युन और आ-दो का स्याही युद्धक्षेत्र" },
    ar: { guideRule1: "جنّد باستخدام مورد الخبز.", guideRule2: "ادمج الحروف المتطابقة قبل انهيار المسار.", guideRule3: "استخدم المهارة عند ارتفاع الضغط.", posterAlt: "ساحة معركة حبرية لتشاو يون وآ دو" },
  };
  Object.keys(localeExtras).forEach(function (code) {
    Object.assign(dictionaries[code], localeExtras[code]);
  });

  const pressureCopy = {
    "zh-Hant": { pressureClear: "壓力提示：三條戰線都有部隊。", pressureOpen: "壓力提示：第 {lane} 路沒有防守部隊。", pressureEnemy: "壓力提示：第 {lane} 路有敵人逼近。", pressureOpenEnemy: "壓力提示：第 {lane} 路沒有部隊，且有敵人逼近。" },
    "zh-Hans": { pressureClear: "压力提示：三条战线都有部队。", pressureOpen: "压力提示：第 {lane} 路没有防守部队。", pressureEnemy: "压力提示：第 {lane} 路有敌人逼近。", pressureOpenEnemy: "压力提示：第 {lane} 路没有部队，且有敌人逼近。" },
    ja: { pressureClear: "圧力確認：3レーンすべてを守っています。", pressureOpen: "圧力確認：レーン {lane} に守備兵がいません。", pressureEnemy: "圧力確認：レーン {lane} に敵が接近中です。", pressureOpenEnemy: "圧力確認：レーン {lane} は空いており、敵が接近中です。" },
    ko: { pressureClear: "압박 확인: 세 전선을 모두 지키고 있습니다.", pressureOpen: "압박 확인: 전선 {lane}에 수비 병사가 없습니다.", pressureEnemy: "압박 확인: 전선 {lane}에 적이 접근 중입니다.", pressureOpenEnemy: "압박 확인: 전선 {lane}이 비어 있고 적이 접근 중입니다." },
    es: { pressureClear: "Vigila la presión: las tres líneas están cubiertas.", pressureOpen: "Vigila la presión: la línea {lane} no tiene defensor.", pressureEnemy: "Vigila la presión: un enemigo se acerca por la línea {lane}.", pressureOpenEnemy: "Vigila la presión: la línea {lane} está vacía y se acerca un enemigo." },
    "pt-BR": { pressureClear: "Vigie a pressão: as três linhas estão cobertas.", pressureOpen: "Vigie a pressão: a linha {lane} não tem defensor.", pressureEnemy: "Vigie a pressão: há um inimigo se aproximando pela linha {lane}.", pressureOpenEnemy: "Vigie a pressão: a linha {lane} está vazia e há um inimigo se aproximando." },
    fr: { pressureClear: "Surveillez la pression : les trois lignes sont couvertes.", pressureOpen: "Surveillez la pression : la ligne {lane} n'a aucun défenseur.", pressureEnemy: "Surveillez la pression : un ennemi approche sur la ligne {lane}.", pressureOpenEnemy: "Surveillez la pression : la ligne {lane} est vide et un ennemi approche." },
    de: { pressureClear: "Druckanzeige: Alle drei Linien sind gedeckt.", pressureOpen: "Druckanzeige: Linie {lane} hat keinen Verteidiger.", pressureEnemy: "Druckanzeige: Ein Feind nähert sich auf Linie {lane}.", pressureOpenEnemy: "Druckanzeige: Linie {lane} ist offen, und ein Feind nähert sich." },
    it: { pressureClear: "Controllo pressione: tutte e tre le linee sono coperte.", pressureOpen: "Controllo pressione: la linea {lane} non ha difensori.", pressureEnemy: "Controllo pressione: un nemico si avvicina sulla linea {lane}.", pressureOpenEnemy: "Controllo pressione: la linea {lane} è scoperta e un nemico si avvicina." },
    ru: { pressureClear: "Контроль угрозы: все три линии защищены.", pressureOpen: "Контроль угрозы: на линии {lane} нет защитника.", pressureEnemy: "Контроль угрозы: к линии {lane} приближается враг.", pressureOpenEnemy: "Контроль угрозы: линия {lane} пуста, и приближается враг." },
    hi: { pressureClear: "दबाव संकेत: तीनों पंक्तियाँ सुरक्षित हैं।", pressureOpen: "दबाव संकेत: पंक्ति {lane} पर कोई रक्षक नहीं है।", pressureEnemy: "दबाव संकेत: पंक्ति {lane} पर दुश्मन आ रहा है।", pressureOpenEnemy: "दबाव संकेत: पंक्ति {lane} खाली है और दुश्मन आ रहा है।" },
    ar: { pressureClear: "مراقبة الضغط: المسارات الثلاثة محمية.", pressureOpen: "مراقبة الضغط: لا يوجد مدافع في المسار {lane}.", pressureEnemy: "مراقبة الضغط: يقترب عدو من المسار {lane}.", pressureOpenEnemy: "مراقبة الضغط: المسار {lane} فارغ ويقترب عدو." },
  };
  Object.keys(pressureCopy).forEach(function (code) {
    Object.assign(dictionaries[code], pressureCopy[code]);
  });

  const payoffCopy = {
    "zh-Hans": { statusMergePayoff: "合成完成：{level} 级部队准备以更强攻势出击。", statusGeneralPayoff: "晋升完成：武将技能已就绪。" },
    ja: { statusMergePayoff: "合成完了：レベル{level}の部隊が、より強く攻撃できます。", statusGeneralPayoff: "昇格完了：武将技が使用可能です。" },
    ko: { statusMergePayoff: "합성 완료: 레벨 {level} 부대가 더 강하게 공격합니다.", statusGeneralPayoff: "승급 완료: 장수 기술을 사용할 수 있습니다." },
    es: { statusMergePayoff: "Fusión completa: la unidad de nivel {level} golpeará con más fuerza.", statusGeneralPayoff: "Ascenso completo: la habilidad del general está lista." },
    "pt-BR": { statusMergePayoff: "Fusão concluída: a unidade de nível {level} atacará com mais força.", statusGeneralPayoff: "Promoção concluída: a habilidade do general está pronta." },
    fr: { statusMergePayoff: "Fusion réussie : l'unité de niveau {level} frappera plus fort.", statusGeneralPayoff: "Promotion réussie : la compétence du général est prête." },
    de: { statusMergePayoff: "Fusion abgeschlossen: Die Einheit auf Stufe {level} greift stärker an.", statusGeneralPayoff: "Beförderung abgeschlossen: Die Generalfähigkeit ist bereit." },
    it: { statusMergePayoff: "Fusione completata: l'unità di livello {level} attacca più forte.", statusGeneralPayoff: "Promozione completata: l'abilità del generale è pronta." },
    ru: { statusMergePayoff: "Слияние завершено: отряд {level}-го уровня атакует сильнее.", statusGeneralPayoff: "Повышение завершено: навык генерала готов." },
    hi: { statusMergePayoff: "विलय पूरा: स्तर {level} की इकाई अब अधिक ताकत से हमला करेगी।", statusGeneralPayoff: "पदोन्नति पूरी: सेनापति की क्षमता तैयार है।" },
    ar: { statusMergePayoff: "اكتمل الدمج: ستهاجم وحدة المستوى {level} بقوة أكبر.", statusGeneralPayoff: "اكتملت الترقية: مهارة القائد جاهزة." },
  };
  Object.keys(payoffCopy).forEach(function (code) {
    Object.assign(dictionaries[code], payoffCopy[code]);
  });

  const publicMainCopy = {
    "zh-Hans": { kicker: "短局合成防守战", summary: "征召汉字小兵、合成相同部队，守住三条战线，让赵云保护阿斗。" },
    ja: { kicker: "短時間の合成防衛キャンペーン", summary: "漢字の兵を招集し、同じ部隊を合成して三つのレーンを守り、趙雲とともに阿斗を守ろう。" },
    ko: { kicker: "짧게 즐기는 합성 방어 캠페인", summary: "한자 병사를 모집하고 같은 부대를 합쳐 세 전선을 지키며 조운과 함께 아두를 보호하세요." },
    es: { kicker: "Campaña breve de defensa y fusión", summary: "Recluta soldados de caracteres, fusiona unidades iguales y protege tres líneas junto a Zhao Yun para mantener a salvo a A Dou." },
    "pt-BR": { kicker: "Campanha curta de defesa e fusão", summary: "Recrute soldados de caracteres, funda unidades iguais e defenda três linhas com Zhao Yun para proteger A Dou." },
    fr: { kicker: "Courte campagne de défense et de fusion", summary: "Recrutez des soldats-caractères, fusionnez les unités identiques et défendez trois voies avec Zhao Yun pour protéger A Dou." },
    de: { kicker: "Kurze Verschmelzungs-Verteidigungskampagne", summary: "Rekrutiere Zeichen-Soldaten, verschmelze gleiche Einheiten und halte mit Zhao Yun drei Linien, um A Dou zu schützen." },
    it: { kicker: "Breve campagna di difesa e fusione", summary: "Recluta soldati-carattere, fondi le unità uguali e difendi tre linee con Zhao Yun per proteggere A Dou." },
    ru: { kicker: "Короткая кампания слияния и обороны", summary: "Призывайте бойцов-знаки, объединяйте одинаковые отряды и вместе с Чжао Юнем удерживайте три линии, защищая А-Доу." },
    hi: { kicker: "छोटा विलय-रक्षा अभियान", summary: "अक्षर सैनिकों की भर्ती करें, समान इकाइयों को मिलाएँ और झाओ युन के साथ तीन पंक्तियों पर आ-दो की रक्षा करें।" },
    ar: { kicker: "حملة دفاع ودمج قصيرة", summary: "جنّد جنود الحروف وادمج الوحدات المتطابقة ودافع مع تشاو يون عن ثلاثة مسارات لحماية آ دو." },
  };
  Object.keys(publicMainCopy).forEach(function (code) {
    Object.assign(dictionaries[code], publicMainCopy[code]);
  });

  const attackCueLabels = {
    en: "Attack", "zh-Hant": "攻擊", "zh-Hans": "攻击", ja: "攻撃", ko: "공격",
    es: "Ataque", "pt-BR": "Ataque", fr: "Attaque", de: "Angriff", it: "Attacco",
    ru: "Атака", hi: "हमला", ar: "هجوم",
  };
  Object.keys(attackCueLabels).forEach(function (code) {
    dictionaries[code].attackCue = attackCueLabels[code];
  });

  window.ZHAO_YUN_ADOU_LOCALES = dictionaries;
}());
