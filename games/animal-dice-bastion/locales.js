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
    guideDetail:"Every defense is a compact planning loop. At the beginning of a Battle, choose an opening guardian affinity, then spend charge to place rank-one guardians in empty rune slots. Guardians attack automatically, so your active decisions are when to summon, which matching pair to merge, and which order to save. A merge requires the same affinity and rank; it creates a stronger guardian and rerolls that guardian's affinity, which can open a new pair or leave you planning around a different role. Keep the board readable instead of filling every slot. An empty slot gives the next summon somewhere to land, while a low-rank pair can become your safest answer to the next wave. Battle Rally raises guardian attack speed for six seconds. Rune Burst strikes and slows the five threats at the front of the road. Rune Reforge keeps a guardian's rank while changing its affinity, but using it removes the chance at the third star for that defense. The five roles are deliberate: Grove gives steady hits, Spark builds charge quickly, Moon slows the lead enemy, Forge breaks armor, and Tide damages groups. Six chapters introduce armor, swarms, healers, haste, slot locks, champion escorts, and a distinct Boss defense, for thirty authored stages with a readable learning curve. A creature reaching the crystal reduces core integrity; clear every wave and Boss to win. Finish with at least half the core and no Reforge to earn three stars. Unlocked stages, stars, rune dust, and Workshop upgrades stay in this browser only. There is no account, upload, betting, paid random draw, cash prize, or real-money mechanic. The game is about making a plan from a fair surprise, learning how each role changes the board, and replaying a defense to improve the next decision.",
    howTitle:"How to play",how1:"Choose an opening guardian, then spend charge to summon rank-one guardians into empty rune slots.",
    how2:"Drag two guardians of the same affinity and rank together to create one stronger guardian.",
    how3:"Use {rally}, {reroll}, and {burst} while guardians automatically stop each wave.",
    rulesTitle:"Rules and results",rulesText:"A creature that reaches the bastion removes core integrity. Clear every wave and Boss to win. Keep at least half the core and avoid Reroll to earn all three stars.",
    progressTitle:"Thirty authored defenses",progressText:"Six chapters add armor, swarms, healers, haste, slot locks, champion escorts, and six distinct Boss defenses.",
    tipsTitle:"Practical tips",tipsText:"Do not merge every pair immediately. Keep a useful low-rank pair until an empty slot or a charged order gives you a safer next move.",
    saveTitle:"Save and privacy",saveText:"Unlocked Stages, stars, rune dust, and Workshop upgrades stay only in this browser. No account, upload, or personal information is required.",
    faqTitle:"FAQ",faq1q:"Is this a gambling game?",faq1a:"No. Dice only show guardian rank. There is no betting, paid random draw, cash prize, or real-money chance mechanic.",
    faq2q:"Can a bad draw end the run?",faq2a:"A drought breaker guarantees a useful matching affinity after seven summons without a merge candidate.",
    faq3q:"What should I play next?",faq3a:"Try Beast Guardian for route-building defense or Animal Rune Tactics for squad preparation.",
    stages:"Stages",team:"Guardians",equipment:"Equipment",teamKicker:"Bastion keeper",taroName:"Moss Shell Taro",
    teamText:"Taro steadies every guardian. Merge timing and active orders decide the defense.",
    guardianTeamKicker:"Opening blessing",guardianTeamTitle:"Choose your first guardian",
    guardianTeamText:"Your first summon in every Battle uses this affinity. Later summons remain fair and random.",
    guardianRosterLabel:"Opening guardian selection",openingPending:"Choose one guardian for your next Battle.",
    openingSelected:"Opening blessing: {guardian}",powerShort:"Power",speedShort:"Speed",
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
    threatBasic:"Steady shadow walkers",threatBasicLesson:"Steady walkers return for a first-chapter practice run.",threatArmor:"Armored beetles",threatSwarm:"Dense wisp swarm",
    threatHeal:"Healing wisps",threatHaste:"Hasted runners",threatLock:"Slot-lock pulses",
    threatChampion:"Champion escorts",threatBoss:"Boss wave",
    planPairs:"Keep one matching pair ready.",planPairsLesson:"Tutorial continuation: hold one matching pair before the next summon.",planForge:"Forge guardians strip armor fastest.",
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
  const terminology = {
    "zh-Hant":{planBurst:"保留「符文爆發」，在敵群最密集時施放。",boardLabel:"守護者合成盤"},
    "zh-Hans":{planBurst:"保留“符文爆发”，在敌群最密集时施放。",boardLabel:"守护者合成盘"},
    ja:{planBurst:"敵が最も密集した時に「ルーンバースト」を使えるよう温存します。",boardLabel:"ガーディアン合成盤"},
    ko:{planBurst:"적이 가장 밀집할 때 쓸 수 있도록 룬 폭발을 아껴 두세요.",boardLabel:"수호자 합성 보드"},
    es:{planBurst:"Guarda Estallido rúnico para la mayor concentración de enemigos.",boardLabel:"Tablero de fusión de guardianes"},
    "pt-BR":{planBurst:"Guarde Explosão rúnica para a maior concentração de inimigos.",boardLabel:"Quadro de fusão de guardiões"},
    fr:{planBurst:"Gardez Explosion runique pour le plus grand regroupement d’ennemis.",boardLabel:"Plateau de fusion des gardiens"},
    de:{planBurst:"Spare Runenstoß für die größte Gegnergruppe auf.",boardLabel:"Wächter-Fusionsfeld"},
    it:{planBurst:"Conserva Esplosione runica per il gruppo di nemici più fitto.",boardLabel:"Tabellone di fusione dei guardiani"},
    ru:{planBurst:"Берегите Взрыв рун для самого плотного скопления врагов.",boardLabel:"Доска слияния стражей"},
    hi:{planBurst:"शत्रुओं के सबसे घने समूह के लिए रून विस्फोट बचाकर रखें।",boardLabel:"रक्षक विलय बोर्ड"},
    ar:{planBurst:"احتفظ بانفجار الرون لأكبر تجمع من الأعداء.",boardLabel:"لوحة دمج الحراس"}
  };
  Object.entries(terminology).forEach(([code, values]) => Object.assign(core[code], values));
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
  Object.assign(core["zh-Hant"],{how1:"先選擇首發守護者，再消耗充能，將一階守護者召喚到空的符文格。",team:"守護者",guardianTeamKicker:"首發祝福",guardianTeamTitle:"選擇首發守護者",guardianTeamText:"每場戰鬥的第一顆召喚必定是此屬性，後續召喚仍維持公平隨機。",guardianRosterLabel:"首發守護者選擇",openingPending:"為下一場戰鬥選擇一位首發守護者。",openingSelected:"首發祝福：{guardian}",powerShort:"威力",speedShort:"攻速"});
  Object.assign(core["zh-Hans"],{how1:"先选择首发守护者，再消耗充能，将一阶守护者召唤到空的符文格。",team:"守护者",guardianTeamKicker:"首发祝福",guardianTeamTitle:"选择首发守护者",guardianTeamText:"每场战斗的第一颗召唤必定是此属性，后续召唤仍保持公平随机。",guardianRosterLabel:"首发守护者选择",openingPending:"为下一场战斗选择一位首发守护者。",openingSelected:"首发祝福：{guardian}",powerShort:"威力",speedShort:"攻速"});
  Object.assign(core.ja,{how1:"初手の守護者を選び、チャージを消費して空のルーン枠にランク1守護者を召喚します。",team:"守護者",guardianTeamKicker:"初手の祝福",guardianTeamTitle:"最初の守護者を選択",guardianTeamText:"各バトルの最初の召喚はこの属性になります。以降は公平なランダムです。",guardianRosterLabel:"初手守護者の選択",openingPending:"次のバトルの守護者を選んでください。",openingSelected:"初手の祝福：{guardian}",powerShort:"威力",speedShort:"攻速"});
  Object.assign(core.ko,{how1:"첫 수호자를 고른 뒤 충전을 소모해 빈 룬 칸에 1등급 수호자를 소환하세요.",team:"수호자",guardianTeamKicker:"선봉 축복",guardianTeamTitle:"첫 수호자 선택",guardianTeamText:"매 전투 첫 소환은 이 속성입니다. 이후 소환은 공정한 무작위입니다.",guardianRosterLabel:"첫 수호자 선택",openingPending:"다음 전투의 첫 수호자를 선택하세요.",openingSelected:"선봉 축복: {guardian}",powerShort:"위력",speedShort:"공속"});
  Object.assign(core.es,{how1:"Elige un guardián inicial y gasta carga para invocar guardianes de rango uno en runas vacías.",team:"Guardianes",guardianTeamKicker:"Bendición inicial",guardianTeamTitle:"Elige tu primer guardián",guardianTeamText:"La primera invocación de cada batalla usa esta afinidad. Las siguientes siguen siendo justas y aleatorias.",guardianRosterLabel:"Selección de guardián inicial",openingPending:"Elige un guardián para la próxima batalla.",openingSelected:"Bendición inicial: {guardian}",powerShort:"Poder",speedShort:"Velocidad"});
  Object.assign(core["pt-BR"],{how1:"Escolha um guardião inicial e gaste carga para invocar guardiões de nível um em runas vazias.",team:"Guardiões",guardianTeamKicker:"Bênção inicial",guardianTeamTitle:"Escolha o primeiro guardião",guardianTeamText:"A primeira invocação de cada batalha usa esta afinidade. As seguintes continuam justas e aleatórias.",guardianRosterLabel:"Seleção do guardião inicial",openingPending:"Escolha um guardião para a próxima batalha.",openingSelected:"Bênção inicial: {guardian}",powerShort:"Poder",speedShort:"Velocidade"});
  Object.assign(core.fr,{how1:"Choisissez un gardien initial, puis dépensez de la charge pour invoquer des gardiens de rang un dans les runes vides.",team:"Gardiens",guardianTeamKicker:"Bénédiction initiale",guardianTeamTitle:"Choisissez le premier gardien",guardianTeamText:"La première invocation de chaque bataille prend cette affinité. Les suivantes restent équitables et aléatoires.",guardianRosterLabel:"Choix du gardien initial",openingPending:"Choisissez un gardien pour la prochaine bataille.",openingSelected:"Bénédiction initiale : {guardian}",powerShort:"Puissance",speedShort:"Vitesse"});
  Object.assign(core.de,{how1:"Wähle einen Startwächter und verbrauche Ladung, um Rang-1-Wächter auf leere Runenfelder zu beschwören.",team:"Wächter",guardianTeamKicker:"Startsegen",guardianTeamTitle:"Ersten Wächter wählen",guardianTeamText:"Die erste Beschwörung jedes Kampfes nutzt diese Affinität. Danach bleibt die Auswahl fair und zufällig.",guardianRosterLabel:"Auswahl des Startwächters",openingPending:"Wähle einen Wächter für den nächsten Kampf.",openingSelected:"Startsegen: {guardian}",powerShort:"Kraft",speedShort:"Tempo"});
  Object.assign(core.it,{how1:"Scegli un guardiano iniziale e spendi carica per evocare guardiani di grado uno nelle rune vuote.",team:"Guardiani",guardianTeamKicker:"Benedizione iniziale",guardianTeamTitle:"Scegli il primo guardiano",guardianTeamText:"La prima evocazione di ogni battaglia usa questa affinità. Le successive restano eque e casuali.",guardianRosterLabel:"Scelta del guardiano iniziale",openingPending:"Scegli un guardiano per la prossima battaglia.",openingSelected:"Benedizione iniziale: {guardian}",powerShort:"Potenza",speedShort:"Velocità"});
  Object.assign(core.ru,{how1:"Выберите первого стража и тратьте заряд, чтобы призывать стражей первого ранга в пустые руны.",team:"Стражи",guardianTeamKicker:"Стартовое благословение",guardianTeamTitle:"Выберите первого стража",guardianTeamText:"Первый призыв в каждом бою получает эту стихию. Остальные остаются честно случайными.",guardianRosterLabel:"Выбор первого стража",openingPending:"Выберите стража для следующего боя.",openingSelected:"Стартовое благословение: {guardian}",powerShort:"Сила",speedShort:"Скорость"});
  Object.assign(core.hi,{how1:"पहला रक्षक चुनें, फिर चार्ज खर्च करके खाली रून खानों में प्रथम श्रेणी के रक्षक बुलाएँ।",team:"रक्षक",guardianTeamKicker:"आरंभिक आशीर्वाद",guardianTeamTitle:"पहला रक्षक चुनें",guardianTeamText:"हर युद्ध का पहला आह्वान इस तत्व का होगा। बाद के आह्वान निष्पक्ष और यादृच्छिक रहेंगे।",guardianRosterLabel:"पहले रक्षक का चयन",openingPending:"अगले युद्ध के लिए एक रक्षक चुनें।",openingSelected:"आरंभिक आशीर्वाद: {guardian}",powerShort:"शक्ति",speedShort:"गति"});
  Object.assign(core.ar,{how1:"اختر حارس البداية، ثم أنفق الشحن لاستدعاء حراس من الرتبة الأولى في خانات الرون الفارغة.",team:"الحراس",guardianTeamKicker:"بركة البداية",guardianTeamTitle:"اختر الحارس الأول",guardianTeamText:"أول استدعاء في كل معركة يستخدم هذا النوع، وتبقى الاستدعاءات التالية عادلة وعشوائية.",guardianRosterLabel:"اختيار الحارس الأول",openingPending:"اختر حارساً للمعركة التالية.",openingSelected:"بركة البداية: {guardian}",powerShort:"القوة",speedShort:"السرعة"});
  Object.assign(core["zh-Hant"],{
    title:"動物骰靈堡壘",loading:"正在喚醒守護符文…",language:"語言",backLobby:"返回 WeightPlay",backMain:"返回主頁",backStages:"返回關卡",
    posterAlt:"苔殼太郎指揮動物守護骰抵擋闇影大軍",eyebrow:"符文合成守城",pitch:"召喚隨機動物守護者，合併相同屬性與等級，並在敵人抵達水晶前下達戰術指令。",start:"開始遊戲",
    guideLabel:"遊戲指南",guideKicker:"WeightPlay 原創遊戲指南",guideTitle:"把每次隨機召喚變成更強的防線",guideIntro:"苔殼太郎以活化符文守護水晶堡壘。每次召喚都會改變陣容；掌握合併時機並正確使用指令，就能把運氣轉化為戰術。",
    howTitle:"遊戲玩法",how1:"先選擇首發守護者，再消耗能量，將一階守護者召喚到空的符文格。",how2:"選取兩個屬性與等級相同的守護者，將它們合併成更高階守護者。",how3:"守護者會自動攻擊；在適當時機使用{rally}、{reroll}與{burst}改變戰局。",
    rulesTitle:"勝負規則",rulesText:"敵人抵達堡壘時會扣除核心生命。擊退所有波次與首領即可獲勝；保留至少一半核心生命，並且不使用符文重塑，可取得三顆星。",
    progressTitle:"30 關原創防線",progressText:"六個章節會依序加入護甲、怪群、治療者、加速、符文格封鎖、菁英護衛與六種不同首領。",
    tipsTitle:"實戰技巧",tipsText:"不要看到相同守護者就立刻合併。保留一組可合併的低階守護者，等版面需要空位或戰況允許時再升階。",
    saveTitle:"存檔與隱私",saveText:"已解鎖關卡、星星、符文之塵與工坊升級只會儲存在這個瀏覽器中；不需要帳號，也不會上傳個人資料。",
    faqTitle:"常見問題",faq1q:"這是賭博遊戲嗎？",faq1a:"不是。骰子只代表守護者等級，遊戲沒有下注、付費抽獎、現金獎勵或任何真錢機率機制。",faq2q:"運氣不好就一定會輸嗎？",faq2a:"若連續七次召喚都沒有可合併組合，系統會保證出現一個能配對的屬性。",faq3q:"接下來可以玩什麼？",faq3a:"喜歡路線守城可試試《獸王守衛》；喜歡戰前編隊則可試試《動物符文戰棋》。",
    stages:"關卡",team:"守護者",equipment:"裝備",teamKicker:"堡壘守護者",taroName:"苔殼太郎",teamText:"太郎會穩定每位守護者；合併時機與主動指令將決定防線成敗。",
    guardianTeamKicker:"首發祝福",guardianTeamTitle:"選擇首發守護者",guardianTeamText:"每場戰鬥的第一次召喚必定是此屬性，之後仍採公平隨機。",guardianRosterLabel:"首發守護者選擇",openingPending:"請為下一場戰鬥選擇首發守護者。",openingSelected:"首發祝福：{guardian}",powerShort:"威力",speedShort:"攻速",
    workshopKicker:"永久升級",workshop:"堡壘工坊",dust:"符文之塵",upgradeFocus:"守護專注",upgradeFocusText:"每級提升守護者 4% 攻擊力。",upgradeHeart:"堡壘之心",upgradeHeartText:"每級增加 1 點核心生命。",upgradeCharge:"初始能量",upgradeChargeText:"每級增加 8 點起始能量。",level:"等級",max:"最高",buy:"升級 · {cost}",needDust:"需要 {cost} 個符文之塵。",upgraded:"{name}已提升至等級 {level}。",
    stageRailLabel:"堡壘關卡選擇",threat:"威脅",plan:"對策",reward:"獎勵",locked:"未解鎖",boss:"首領",
    chapter1:"苔光之門",chapter2:"月根隘口",chapter3:"激流高台",chapter4:"餘燼工坊",chapter5:"星落城牆",chapter6:"日蝕堡壘",
    rule1:"熟悉召喚與合併節奏。",rule2:"在高速敵群重疊前擊破護甲。",rule3:"以範圍攻擊清除怪群並優先阻止治療者。",rule4:"在符文格封鎖與加速敵人之間重整防線。",rule5:"保留戰術指令對付菁英護衛。",rule6:"在裂隙雄鹿來襲前活用所有規則。",
    threatBasic:"穩定前進的闇影",threatArmor:"裝甲甲蟲",threatSwarm:"密集幽光怪群",threatHeal:"治療幽光",threatHaste:"加速突進者",threatLock:"符文格封鎖脈衝",threatChampion:"菁英護衛",threatBoss:"首領波次",
    planPairs:"預留一組可合併的守護者。",planForge:"鍛造守護者最擅長破甲。",planTide:"潮汐守護者能控制密集怪群。",planBurst:"把符文爆發留給敵人最密集的時刻。",rewardDust:"+{dust} 符文之塵",stageSummary:"已解鎖 {unlocked}/30 · {stars} 顆星",
    core:"核心",wave:"波次",charge:"能量",summon:"召喚",rally:"全軍集結",burst:"符文爆發",reroll:"符文重塑",rallyHint:"全體攻速 ×1.72 · 6 秒",burstHint:"攻擊並緩速最前方 5 名敵人",rerollHint:"保留等級 · 更換屬性",ready:"可使用",cooldown:"{seconds} 秒",activeSeconds:"強化 {seconds} 秒",selectGuardian:"選擇守護者",cost:"消耗 {cost}",boardLabel:"守護者合成盤",objective:"在所有敵人抵達水晶前阻止它們。",
    summoned:"已召喚{guardian}守護者。",droughtGift:"太郎穩定了命運：出現可配對的{guardian}守護者。",boardFull:"版面已滿。請合併一組相同守護者，或重塑一名守護者。",notEnoughCharge:"需要 {cost} 點能量。",mergeSelect:"已選擇 {rank} 階{guardian}。",mergeNeedMatch:"只能合併屬性與等級都相同的守護者。",merged:"已合併成 {rank} 階{guardian}。",maxRank:"這名守護者已達最高等級。",rerolled:"已將 {rank} 階守護者重塑為{guardian}。",rerollNeed:"請先選擇守護者，並保留 {cost} 點能量。",rallyUsed:"全軍集結使所有守護者加速！",rallyNotReady:"全軍集結仍在冷卻。",burstUsed:"符文爆發擊中了最前方的敵人！",burstNotReady:"守護者攻擊時會累積符文爆發。",burstNoTargets:"請等敵人進入道路後再施放。",waveStarts:"第 {wave} 波開始。",bossWarning:"首領逼近",coreHit:"核心受損！剩餘 {core} 點生命。",
    grove:"樹林",spark:"火花",moon:"月光",forge:"鍛造",tide:"潮汐",guardianGuideTitle:"五種守護定位 · 六個等級",rankGuide:"菱形數字代表 1–6 階，不是第六種骰子。",groveRole:"穩定的強力單體攻擊",sparkRole:"高速攻擊並累積能量",moonRole:"緩速最前方敵人",forgeRole:"擊破敵人護甲",tideRole:"對怪群造成濺射傷害",selectedGuardian:"{guardian} · {rank}/6 階 · {role}",
    pause:"暫停",pauseTitle:"防線已暫停",pauseText:"暫停期間，波次與所有守護者都會停止。",resume:"繼續遊戲",tutorialTitle:"召喚、合併、守住堡壘",tutorial1:"召喚會在一個空符文格放入隨機守護者。",tutorial2:"合併屬性與等級相同的守護者；升階後會重新決定屬性。",tutorial3:"把{rally}與{burst}留給密集波次或首領。",tutorialStart:"開始守城",leaveTitle:"要離開這場防守嗎？",leaveText:"選擇繼續會保留並恢復目前戰鬥；返回關卡會結束本次挑戰。",continue:"繼續",returnStages:"返回關卡",
    resultKicker:"堡壘戰報",victory:"成功守住堡壘！",defeat:"闇影突破了水晶防線",victoryText:"你的守護者陣容成功撐過所有波次。",defeatText:"預留一組可合併守護者，並嘗試調整指令時機。",next:"下一關",retry:"再玩一次",coreLeft:"剩餘核心",merges:"合併次數",dustEarned:"符文之塵",noNext:"已完成最終關卡",stage:"第 {stage} 關",starsWord:"星"
  });
  const stageContinuationCopy = {
    en:{threatBasicLesson:"Steady walkers return for a first-chapter practice run.",planPairsLesson:"Tutorial continuation: hold one matching pair before the next summon."},
    "zh-Hant":{threatBasicLesson:"第一章教學延伸：再次練習穩住行進中的闇影。",planPairsLesson:"教學延伸：下一次召喚前，先保留一組可合併的守護者。"},
    "zh-Hans":{threatBasicLesson:"第一章教学延伸：再次练习稳住前进的暗影。",planPairsLesson:"教学延伸：下一次召唤前，先保留一组可合并的守护者。"},
    ja:{threatBasicLesson:"第1章のチュートリアル続き：歩く影への対処をもう一度練習。",planPairsLesson:"チュートリアル続き：次の召喚前に、合成できるペアを1組残そう。"},
    ko:{threatBasicLesson:"1장 튜토리얼 계속: 다가오는 그림자에 대응하는 연습입니다.",planPairsLesson:"튜토리얼 계속: 다음 소환 전에 합칠 수 있는 한 쌍을 남겨 두세요."},
    es:{threatBasicLesson:"Continuación del tutorial del capítulo 1: practica otra vez con caminantes estables.",planPairsLesson:"Continuación del tutorial: conserva una pareja que puedas fusionar antes de invocar de nuevo."},
    "pt-BR":{threatBasicLesson:"Continuação do tutorial do capítulo 1: pratique de novo contra sombras constantes.",planPairsLesson:"Continuação do tutorial: mantenha um par que possa fundir antes da próxima invocação."},
    fr:{threatBasicLesson:"Suite du tutoriel du chapitre 1 : entraînez-vous encore contre les ombres régulières.",planPairsLesson:"Suite du tutoriel : gardez une paire fusionnable avant la prochaine invocation."},
    de:{threatBasicLesson:"Fortsetzung des Kapitel-1-Tutorials: Übe erneut gegen gleichmäßige Schattenläufer.",planPairsLesson:"Tutorial-Fortsetzung: Halte vor der nächsten Beschwörung ein passendes Paar bereit."},
    it:{threatBasicLesson:"Continuazione del tutorial del capitolo 1: esercitati ancora contro le ombre regolari.",planPairsLesson:"Continuazione del tutorial: conserva una coppia da fondere prima della prossima evocazione."},
    ru:{threatBasicLesson:"Продолжение обучения главы 1: снова потренируйтесь против ровных теней.",planPairsLesson:"Продолжение обучения: оставьте готовую пару для слияния перед следующим призывом."},
    hi:{threatBasicLesson:"अध्याय 1 का ट्यूटोरियल जारी: चलती परछाइयों के विरुद्ध फिर अभ्यास करें।",planPairsLesson:"ट्यूटोरियल जारी: अगली बुलाहट से पहले मिलाने योग्य एक जोड़ी बचाकर रखें।"},
    ar:{threatBasicLesson:"متابعة تدريب الفصل الأول: تدرّب مجددًا على الظلال المتقدمة بثبات.",planPairsLesson:"متابعة التدريب: احتفظ بزوج قابل للدمج قبل الاستدعاء التالي."}
  };
  Object.assign(en,stageContinuationCopy.en);
  Object.entries(stageContinuationCopy).forEach(([code,values])=>{if(code!=="en")Object.assign(core[code],values);});
  const dictionaries = { en };
  Object.entries(core).forEach(([code, values]) => {
    const generated = window.AnimalDiceBastionLocaleData?.[code] || {};
    dictionaries[code] = code === "zh-Hant"
      ? {...en, ...generated, ...values}
      : {...en, ...values, ...generated};
  });
  if (dictionaries["zh-Hans"]?.guideDetail) {
    dictionaries["zh-Hans"].guideDetail = dictionaries["zh-Hans"].guideDetail.replaceAll("取得", "获得");
  }
  window.AnimalDiceBastionLocales = {
    codes:["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"],
    segments:{en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"},
    dictionaries
  };
})();
