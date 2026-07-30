(function () {
  "use strict";
  const en = {
    title:"Animal Dice Bastion",loading:"Awakening the guardian runes…",language:"Language",
    backLobby:"Back to WeightPlay",backMain:"Back to Main",backStages:"Back to Stages",
    posterAlt:"Taro commands guardian dice against a shadow wave",eyebrow:"Mosslight merge defense",
    pitch:"Summon random animal guardians, merge matching ranks, and command the right power before each wave reaches the crystal.",
    start:"Start Game",guideLabel:"Game guide",guideKicker:"WeightPlay Original Game Guide",
    guideTitle:"Build a stronger board from every surprise",
    guideIntro:"Moss Shell Taro guards the crystal bastion with living rune dice. Every summon changes the board, but careful merges and timely orders keep luck under your control.",
    howTitle:"How to play",how1:"Spend charge to summon a random rank-one guardian into an empty rune slot.",
    how2:"Drag two guardians of the same affinity and rank together to create one stronger guardian.",
    how3:"Use {rally}, {reroll}, and {burst} while guardians automatically stop each wave.",
    rulesTitle:"Rules and results",rulesText:"A creature that reaches the bastion removes core integrity. Clear every wave and Boss to win. Keep at least half the core and avoid Reroll to earn all three stars.",
    progressTitle:"Thirty authored defenses",progressText:"Six chapters add armor, swarms, healers, haste, slot locks, champion escorts, and six distinct Boss defenses.",
    tipsTitle:"Practical tips",tipsText:"Do not merge every pair immediately. Keep a useful low-rank pair until an empty slot or a charged order gives you a safer next move.",
    saveTitle:"Save and privacy",saveText:"Unlocked Stages, stars, rune dust, and Workshop upgrades stay only in this browser. No account, upload, or personal information is required.",
    faqTitle:"FAQ",faq1q:"Is this a gambling game?",faq1a:"No. Dice only show guardian rank. There is no betting, paid random draw, cash prize, or real-money chance mechanic.",
    faq2q:"Can a bad draw end the run?",faq2a:"A drought breaker guarantees a useful matching affinity after seven summons without a merge candidate.",
    faq3q:"What should I play next?",faq3a:"Try Beast Guardian for route-building defense or Animal Rune Tactics for squad preparation.",
    stages:"Stages",team:"Team",equipment:"Equipment",teamKicker:"Bastion keeper",taroName:"Moss Shell Taro",
    teamText:"Taro steadies every guardian. Merge timing and active orders decide the defense.",
    workshopKicker:"Permanent upgrades",workshop:"Bastion Workshop",dust:"Rune dust",
    upgradeFocus:"Guardian Focus",upgradeFocusText:"+4% guardian attack per level.",
    upgradeHeart:"Bastion Heart",upgradeHeartText:"+1 core integrity per level.",
    upgradeCharge:"Opening Charge",upgradeChargeText:"+8 starting charge per level.",
    level:"Level",max:"Maximum",buy:"Upgrade · {cost}",needDust:"Need {cost} rune dust.",
    upgraded:"{name} reached level {level}.",stageRailLabel:"Bastion Stage selection",
    threat:"Threat",plan:"Plan",reward:"Reward",locked:"Locked",boss:"Boss",
    chapter1:"Mosslight Gate",chapter2:"Moonroot Pass",chapter3:"Torrent Terrace",
    chapter4:"Ember Workshop",chapter5:"Starfall Rampart",chapter6:"Eclipse Bastion",
    rule1:"Learn the summon and merge rhythm.",rule2:"Break armor before fast packs overlap.",
    rule3:"Splash through swarms and stop healers.",rule4:"Recover from locked slots and hasted threats.",
    rule5:"Hold orders for champion escorts.",rule6:"Master every rule before the Rift Stag arrives.",
    threatBasic:"Steady shadow walkers",threatArmor:"Armored beetles",threatSwarm:"Dense wisp swarm",
    threatHeal:"Healing wisps",threatHaste:"Hasted runners",threatLock:"Slot-lock pulses",
    threatChampion:"Champion escorts",threatBoss:"Boss wave",
    planPairs:"Keep one matching pair ready.",planForge:"Forge guardians strip armor fastest.",
    planTide:"Tide guardians control crowded waves.",planBurst:"Save Rune Burst for the strongest overlap.",
    rewardDust:"+{dust} rune dust",stageSummary:"{unlocked}/30 unlocked · {stars} stars",
    core:"Core",wave:"Wave",charge:"Charge",summon:"Summon",rally:"Battle Rally",burst:"Rune Burst",reroll:"Rune Reforge",
    rallyHint:"All attack speed ×1.72 · 6s",burstHint:"Hit and slow the front 5",rerollHint:"Keep rank · change affinity",
    ready:"Ready",cooldown:"{seconds}s",activeSeconds:"Boost {seconds}s",selectGuardian:"Select a guardian",cost:"Cost {cost}",
    boardLabel:"Guardian merge board",objective:"Stop every creature before it reaches the crystal.",
    summoned:"{guardian} guardian summoned.",droughtGift:"Taro steadied fate: a matching {guardian} appeared.",
    boardFull:"The board is full. Merge a matching pair or Reroll one guardian.",
    notEnoughCharge:"Need {cost} charge.",mergeSelect:"{guardian} rank {rank} selected.",
    mergeNeedMatch:"Merge requires the same affinity and rank.",merged:"Merged into rank {rank} {guardian}.",
    maxRank:"This guardian is already at maximum rank.",rerolled:"Rank {rank} reforged into {guardian}.",
    rerollNeed:"Select a guardian and keep {cost} charge.",rallyUsed:"Rally accelerates every guardian!",
    rallyNotReady:"Rally is still recovering.",burstUsed:"Rune Burst struck the lead threats!",
    burstNotReady:"Rune Burst charges through guardian attacks.",burstNoTargets:"Wait for an enemy to enter the road.",waveStarts:"Wave {wave} begins.",
    bossWarning:"BOSS APPROACHING",coreHit:"Core hit! {core} integrity remains.",
    grove:"Grove",spark:"Spark",moon:"Moon",forge:"Forge",tide:"Tide",
    guardianGuideTitle:"Five guardian roles · six ranks",rankGuide:"Diamonds show rank 1–6, not a sixth dice type.",
    groveRole:"Strong steady hits",sparkRole:"Fast charge builder",moonRole:"Slows the lead enemy",forgeRole:"Breaks enemy armor",tideRole:"Splash damage to groups",
    selectedGuardian:"{guardian} · rank {rank}/6 · {role}",
    pause:"Pause",pauseTitle:"Defense paused",pauseText:"The wave and every guardian are frozen while you take a break.",
    resume:"Resume",tutorialTitle:"Summon, match, and defend",
    tutorial1:"Summon fills one empty rune slot with a random guardian.",
    tutorial2:"Merge matching affinity and rank. The stronger result rerolls its affinity.",
    tutorial3:"Save {rally} and {burst} for dense waves or a Boss.",tutorialStart:"Guard the bastion",
    leaveTitle:"Leave this defense?",leaveText:"Continue keeps this exact Battle frozen. Returning to Stages ends only this attempt.",
    continue:"Continue",returnStages:"Return to Stages",resultKicker:"Bastion report",
    victory:"Bastion secured!",defeat:"The shadows reached the crystal",
    victoryText:"Your guardian board held through every wave.",defeatText:"Keep one merge pair ready and try a different order timing.",
    next:"Next Stage",retry:"Replay",coreLeft:"Core left",merges:"Merges",dustEarned:"Dust",
    noNext:"Final Stage complete",stage:"Stage {stage}",starsWord:"stars"
  };
  const core = {
    "zh-Hant":{title:"動物骰靈堡壘",loading:"正在喚醒守護符文…",language:"語言",start:"開始遊戲",stages:"關卡",team:"隊伍",equipment:"裝備",summon:"召喚",rally:"集結",burst:"符文爆發",reroll:"重擲",core:"核心",wave:"波次",charge:"能量",victory:"堡壘守住了！",defeat:"暗影抵達了水晶",next:"下一關",retry:"重玩",continue:"繼續",returnStages:"返回關卡",locked:"未解鎖",boss:"首領"},
    "zh-Hans":{title:"动物骰灵堡垒",loading:"正在唤醒守护符文…",language:"语言",start:"开始游戏",stages:"关卡",team:"队伍",equipment:"装备",summon:"召唤",rally:"集结",burst:"符文爆发",reroll:"重掷",core:"核心",wave:"波次",charge:"能量",victory:"堡垒守住了！",defeat:"暗影抵达了水晶",next:"下一关",retry:"重玩",continue:"继续",returnStages:"返回关卡",locked:"未解锁",boss:"首领"},
    ja:{title:"アニマルダイス砦",loading:"守護ルーンを起こしています…",language:"言語",start:"ゲーム開始",stages:"ステージ",team:"チーム",equipment:"装備",summon:"召喚",rally:"結集",burst:"ルーンバースト",reroll:"振り直す",core:"コア",wave:"ウェーブ",charge:"チャージ",victory:"砦を守った！",defeat:"影がクリスタルに到達した",next:"次のステージ",retry:"リプレイ",continue:"続ける",returnStages:"ステージへ戻る",locked:"ロック",boss:"ボス"},
    ko:{title:"애니멀 다이스 요새",loading:"수호 룬을 깨우는 중…",language:"언어",start:"게임 시작",stages:"스테이지",team:"팀",equipment:"장비",summon:"소환",rally:"집결",burst:"룬 폭발",reroll:"다시 굴리기",core:"코어",wave:"웨이브",charge:"충전",victory:"요새를 지켰습니다!",defeat:"그림자가 수정에 도달했습니다",next:"다음 스테이지",retry:"다시 플레이",continue:"계속",returnStages:"스테이지로",locked:"잠김",boss:"보스"},
    es:{title:"Bastión de Dados Animal",loading:"Despertando las runas guardianas…",language:"Idioma",start:"Iniciar juego",stages:"Fases",team:"Equipo",equipment:"Equipo",summon:"Invocar",rally:"Reagrupar",burst:"Estallido rúnico",reroll:"Relanzar",core:"Núcleo",wave:"Oleada",charge:"Carga",victory:"¡Bastión asegurado!",defeat:"Las sombras alcanzaron el cristal",next:"Siguiente fase",retry:"Repetir",continue:"Continuar",returnStages:"Volver a fases",locked:"Bloqueado",boss:"Jefe"},
    "pt-BR":{title:"Bastião dos Dados Animais",loading:"Despertando as runas guardiãs…",language:"Idioma",start:"Iniciar jogo",stages:"Fases",team:"Equipe",equipment:"Equipamento",summon:"Invocar",rally:"Reunir",burst:"Explosão rúnica",reroll:"Rolar de novo",core:"Núcleo",wave:"Onda",charge:"Carga",victory:"Bastião protegido!",defeat:"As sombras chegaram ao cristal",next:"Próxima fase",retry:"Jogar novamente",continue:"Continuar",returnStages:"Voltar às fases",locked:"Bloqueado",boss:"Chefe"},
    fr:{title:"Bastion des Dés Animaux",loading:"Éveil des runes gardiennes…",language:"Langue",start:"Commencer",stages:"Niveaux",team:"Équipe",equipment:"Équipement",summon:"Invoquer",rally:"Ralliement",burst:"Explosion runique",reroll:"Relancer",core:"Cœur",wave:"Vague",charge:"Charge",victory:"Bastion sécurisé !",defeat:"Les ombres ont atteint le cristal",next:"Niveau suivant",retry:"Rejouer",continue:"Continuer",returnStages:"Retour aux niveaux",locked:"Verrouillé",boss:"Boss"},
    de:{title:"Tierwürfel-Bastion",loading:"Wächterrunen erwachen…",language:"Sprache",start:"Spiel starten",stages:"Stufen",team:"Team",equipment:"Ausrüstung",summon:"Beschwören",rally:"Sammeln",burst:"Runenstoß",reroll:"Neu würfeln",core:"Kern",wave:"Welle",charge:"Energie",victory:"Bastion gesichert!",defeat:"Die Schatten erreichten den Kristall",next:"Nächste Stufe",retry:"Wiederholen",continue:"Fortsetzen",returnStages:"Zu den Stufen",locked:"Gesperrt",boss:"Boss"},
    it:{title:"Bastione dei Dadi Animali",loading:"Risveglio delle rune guardiane…",language:"Lingua",start:"Inizia",stages:"Livelli",team:"Squadra",equipment:"Equipaggiamento",summon:"Evoca",rally:"Adunata",burst:"Esplosione runica",reroll:"Rilancia",core:"Nucleo",wave:"Ondata",charge:"Carica",victory:"Bastione al sicuro!",defeat:"Le ombre hanno raggiunto il cristallo",next:"Livello successivo",retry:"Rigioca",continue:"Continua",returnStages:"Torna ai livelli",locked:"Bloccato",boss:"Boss"},
    ru:{title:"Бастион Звериных Кубов",loading:"Пробуждаем руны стражей…",language:"Язык",start:"Начать игру",stages:"Этапы",team:"Команда",equipment:"Снаряжение",summon:"Призвать",rally:"Сбор",burst:"Взрыв рун",reroll:"Перебросить",core:"Ядро",wave:"Волна",charge:"Заряд",victory:"Бастион защищён!",defeat:"Тени добрались до кристалла",next:"Следующий этап",retry:"Повторить",continue:"Продолжить",returnStages:"К этапам",locked:"Закрыто",boss:"Босс"},
    hi:{title:"पशु पासा दुर्ग",loading:"रक्षक रून्स जाग रहे हैं…",language:"भाषा",start:"खेल शुरू करें",stages:"चरण",team:"दल",equipment:"उपकरण",summon:"बुलाएँ",rally:"एकत्र करें",burst:"रून विस्फोट",reroll:"फिर घुमाएँ",core:"केंद्र",wave:"लहर",charge:"ऊर्जा",victory:"दुर्ग सुरक्षित!",defeat:"छायाएँ क्रिस्टल तक पहुँच गईं",next:"अगला चरण",retry:"फिर खेलें",continue:"जारी रखें",returnStages:"चरणों पर लौटें",locked:"बंद",boss:"बॉस"},
    ar:{title:"حصن نرد الحيوانات",loading:"إيقاظ رُقى الحراس…",language:"اللغة",start:"ابدأ اللعب",stages:"المراحل",team:"الفريق",equipment:"المعدات",summon:"استدعاء",rally:"حشد",burst:"انفجار الرون",reroll:"إعادة الرمي",core:"النواة",wave:"الموجة",charge:"الشحنة",victory:"تم تأمين الحصن!",defeat:"وصلت الظلال إلى البلورة",next:"المرحلة التالية",retry:"إعادة اللعب",continue:"متابعة",returnStages:"العودة للمراحل",locked:"مغلق",boss:"زعيم"}
  };
  Object.assign(core["zh-Hant"],{rally:"全軍集結",reroll:"符文重塑",rallyHint:"全體攻速 ×1.72 · 6秒",burstHint:"攻擊並緩速最前5名",rerollHint:"保留等級 · 更換屬性",activeSeconds:"強化 {seconds}秒",rerolled:"{rank}級重塑為{guardian}。",burstNoTargets:"等待敵人進入道路再施放。",guardianGuideTitle:"五種守護定位 · 六個等級",rankGuide:"菱形代表1–6級，不是第六種骰子。",groveRole:"穩定強力單擊",sparkRole:"高速累積能量",moonRole:"緩速最前方敵人",forgeRole:"破解敵人護甲",tideRole:"對怪群造成濺射",selectedGuardian:"{guardian} · {rank}/6級 · {role}"});
  Object.assign(core["zh-Hans"],{rally:"全军集结",reroll:"符文重塑",rallyHint:"全体攻速 ×1.72 · 6秒",burstHint:"攻击并减速最前5名",rerollHint:"保留等级 · 更换属性",activeSeconds:"强化 {seconds}秒",rerolled:"{rank}级重塑为{guardian}。",burstNoTargets:"等待敌人进入道路后再施放。",guardianGuideTitle:"五种守护定位 · 六个等级",rankGuide:"菱形代表1–6级，不是第六种骰子。",groveRole:"稳定强力单击",sparkRole:"高速积累能量",moonRole:"减速最前方敌人",forgeRole:"破解敌人护甲",tideRole:"对怪群造成溅射",selectedGuardian:"{guardian} · {rank}/6级 · {role}"});
  Object.assign(core.ja,{rally:"全軍ラリー",reroll:"ルーン再鍛造",rallyHint:"全員の攻速 ×1.72・6秒",burstHint:"先頭5体を攻撃・減速",rerollHint:"ランク維持・属性変更",activeSeconds:"強化 {seconds}秒",burstNoTargets:"敵が道に入るまで待ってください。",guardianGuideTitle:"5つの役割・6ランク",rankGuide:"ひし形はランク1～6。6種目ではありません。",groveRole:"安定した強打",sparkRole:"高速チャージ",moonRole:"先頭を減速",forgeRole:"敵の装甲を破壊",tideRole:"群れへ範囲攻撃",selectedGuardian:"{guardian}・ランク{rank}/6・{role}"});
  Object.assign(core.ko,{rally:"전군 집결",reroll:"룬 재련",rallyHint:"전체 공속 ×1.72 · 6초",burstHint:"선두 5명 공격·감속",rerollHint:"등급 유지 · 속성 변경",activeSeconds:"강화 {seconds}초",burstNoTargets:"적이 길에 들어올 때까지 기다리세요.",guardianGuideTitle:"수호자 5종 · 6등급",rankGuide:"마름모는 1~6등급이며 여섯째 주사위가 아닙니다.",groveRole:"안정적인 강타",sparkRole:"빠른 충전",moonRole:"선두 적 감속",forgeRole:"적 방어력 파괴",tideRole:"무리 범위 피해",selectedGuardian:"{guardian} · {rank}/6등급 · {role}"});
  Object.assign(core.es,{rally:"Orden de batalla",reroll:"Reforjar runa",rallyHint:"Velocidad de todos ×1,72 · 6 s",burstHint:"Golpea y frena a los 5 primeros",rerollHint:"Conserva rango · cambia afinidad",activeSeconds:"Impulso {seconds} s",burstNoTargets:"Espera a que un enemigo entre en el camino.",guardianGuideTitle:"Cinco roles · seis rangos",rankGuide:"Los diamantes indican rango 1–6, no un sexto dado.",groveRole:"Golpes fuertes y estables",sparkRole:"Carga rápida",moonRole:"Ralentiza al primero",forgeRole:"Rompe armadura",tideRole:"Daño de área",selectedGuardian:"{guardian} · rango {rank}/6 · {role}"});
  Object.assign(core["pt-BR"],{rally:"Ordem de batalha",reroll:"Reforjar runa",rallyHint:"Velocidade de todos ×1,72 · 6 s",burstHint:"Atinge e atrasa os 5 primeiros",rerollHint:"Mantém nível · muda afinidade",activeSeconds:"Impulso {seconds} s",burstNoTargets:"Espere um inimigo entrar na rota.",guardianGuideTitle:"Cinco funções · seis níveis",rankGuide:"Diamantes indicam níveis 1–6, não um sexto dado.",groveRole:"Golpes fortes e estáveis",sparkRole:"Carga rápida",moonRole:"Atrasa o primeiro",forgeRole:"Quebra armadura",tideRole:"Dano em área",selectedGuardian:"{guardian} · nível {rank}/6 · {role}"});
  Object.assign(core.fr,{rally:"Ordre de bataille",reroll:"Reforger la rune",rallyHint:"Vitesse de tous ×1,72 · 6 s",burstHint:"Frappe et ralentit les 5 premiers",rerollHint:"Garde le rang · change l’affinité",activeSeconds:"Bonus {seconds} s",burstNoTargets:"Attendez qu’un ennemi entre sur la route.",guardianGuideTitle:"Cinq rôles · six rangs",rankGuide:"Les losanges indiquent les rangs 1–6, pas un sixième dé.",groveRole:"Frappes fortes et stables",sparkRole:"Charge rapide",moonRole:"Ralentit le premier",forgeRole:"Brise l’armure",tideRole:"Dégâts de zone",selectedGuardian:"{guardian} · rang {rank}/6 · {role}"});
  Object.assign(core.de,{rally:"Kampfbefehl",reroll:"Rune neu schmieden",rallyHint:"Tempo aller ×1,72 · 6 s",burstHint:"Trifft und bremst die ersten 5",rerollHint:"Rang bleibt · Affinität wechselt",activeSeconds:"Bonus {seconds} s",burstNoTargets:"Warte, bis ein Gegner den Weg betritt.",guardianGuideTitle:"Fünf Rollen · sechs Ränge",rankGuide:"Rauten zeigen Rang 1–6, keinen sechsten Würfel.",groveRole:"Starke stetige Treffer",sparkRole:"Schnelles Aufladen",moonRole:"Bremst den vordersten Feind",forgeRole:"Bricht Panzerung",tideRole:"Flächenschaden",selectedGuardian:"{guardian} · Rang {rank}/6 · {role}"});
  Object.assign(core.it,{rally:"Ordine di battaglia",reroll:"Riforgia runa",rallyHint:"Velocità di tutti ×1,72 · 6 s",burstHint:"Colpisce e rallenta i primi 5",rerollHint:"Mantiene rango · cambia affinità",activeSeconds:"Potenziamento {seconds} s",burstNoTargets:"Attendi che un nemico entri nel percorso.",guardianGuideTitle:"Cinque ruoli · sei ranghi",rankGuide:"I rombi indicano i ranghi 1–6, non un sesto dado.",groveRole:"Colpi forti e costanti",sparkRole:"Carica rapida",moonRole:"Rallenta il primo",forgeRole:"Rompe l’armatura",tideRole:"Danno ad area",selectedGuardian:"{guardian} · rango {rank}/6 · {role}"});
  Object.assign(core.ru,{rally:"Боевой сбор",reroll:"Перековка руны",rallyHint:"Скорость всех ×1,72 · 6 с",burstHint:"Удар и замедление первых 5",rerollHint:"Ранг сохранён · стихия меняется",activeSeconds:"Усиление {seconds} с",burstNoTargets:"Дождитесь врага на дороге.",guardianGuideTitle:"Пять ролей · шесть рангов",rankGuide:"Ромбы — ранги 1–6, а не шестой куб.",groveRole:"Сильные ровные удары",sparkRole:"Быстрый заряд",moonRole:"Замедляет лидера",forgeRole:"Ломает броню",tideRole:"Урон по группе",selectedGuardian:"{guardian} · ранг {rank}/6 · {role}"});
  Object.assign(core.hi,{rally:"युद्ध आह्वान",reroll:"रून पुनर्गठन",rallyHint:"सभी की गति ×1.72 · 6 सेकंड",burstHint:"आगे के 5 पर वार व धीमा",rerollHint:"रैंक वही · तत्व बदले",activeSeconds:"शक्ति {seconds} सेकंड",burstNoTargets:"शत्रु के मार्ग में आने की प्रतीक्षा करें।",guardianGuideTitle:"पाँच भूमिकाएँ · छह रैंक",rankGuide:"हीरे रैंक 1–6 दिखाते हैं, छठा पासा नहीं।",groveRole:"स्थिर शक्तिशाली वार",sparkRole:"तेज़ चार्ज",moonRole:"सबसे आगे को धीमा",forgeRole:"कवच तोड़ता है",tideRole:"समूह पर क्षेत्रीय क्षति",selectedGuardian:"{guardian} · रैंक {rank}/6 · {role}"});
  Object.assign(core.ar,{rally:"نداء المعركة",reroll:"إعادة صوغ الرون",rallyHint:"سرعة الجميع ×1.72 · 6 ث",burstHint:"يضرب ويبطئ أول 5",rerollHint:"يحفظ الرتبة · يبدل النوع",activeSeconds:"تعزيز {seconds} ث",burstNoTargets:"انتظر دخول عدو إلى المسار.",guardianGuideTitle:"خمسة أدوار · ست رتب",rankGuide:"المعينات تعني الرتب 1–6 وليست نرداً سادساً.",groveRole:"ضربات قوية ثابتة",sparkRole:"شحن سريع",moonRole:"يبطئ العدو الأول",forgeRole:"يكسر الدرع",tideRole:"ضرر جماعي",selectedGuardian:"{guardian} · الرتبة {rank}/6 · {role}"});
  Object.assign(core.ja,{rerolled:"ランク{rank}を{guardian}に再鍛造。"});
  Object.assign(core.ko,{rerolled:"{rank}등급을 {guardian}(으)로 재련했습니다."});
  Object.assign(core.es,{rerolled:"Rango {rank} reforjado como {guardian}."});
  Object.assign(core["pt-BR"],{rerolled:"Nível {rank} reforjado como {guardian}."});
  Object.assign(core.fr,{rerolled:"Rang {rank} reforgé en {guardian}."});
  Object.assign(core.de,{rerolled:"Rang {rank} zu {guardian} neu geschmiedet."});
  Object.assign(core.it,{rerolled:"Rango {rank} riforgiato in {guardian}."});
  Object.assign(core.ru,{rerolled:"Ранг {rank} перекован в {guardian}."});
  Object.assign(core.hi,{rerolled:"रैंक {rank} को {guardian} में पुनर्गठित किया।"});
  Object.assign(core.ar,{rerolled:"أعيد صوغ الرتبة {rank} إلى {guardian}."});
  const dictionaries = { en };
  Object.entries(core).forEach(([code, values]) => {
    dictionaries[code] = window.AnimalDiceBastionLocaleData?.[code] || {...en, ...values};
  });
  window.AnimalDiceBastionLocales = {
    codes:["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"],
    segments:{en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"},
    dictionaries
  };
})();
