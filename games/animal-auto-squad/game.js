(function () {
  document.body.dataset.wpCombinedSound = "true";
  ["stagePanel", "gamePanel"].forEach((id) => {
    document.getElementById(id)?.setAttribute("data-wp-canvas-max-width", "920");
  });

  const GAME_ID = "animal-auto-squad";
  const localeKey = "weightPlayLocale";
  const saveKey = "animal_auto_squad_save";

  // Localization Dictionary
  const text = {
    en: {
      title: "Animal Auto Squad",
      backToLobby: "Back to WeightPlay lobby",
      back: "Back",
      languageSelection: "Language selection",
      stageSelection: "Stage selection",
      stageTab: "Stages",
      trainingTab: "Training",
      stageSwipe: "↔ Swipe stages",
      stageDeploy: "Tap an unlocked stage to deploy",
      activeSquadSlots: "Active squad slots",
      shopShelfItems: "Character backpack items",
      emptyFormationSlot: "Empty formation slot",
      emptySlot: "Empty slot",
      activeSquad: "active squad",
      expeditionBackpack: "expedition backpack",
      formationFrontRow: "front row",
      formationBackRow: "back row",
      formationLeftPosition: "left position",
      formationCenterPosition: "center position",
      formationRightPosition: "right position",
      slotPosition: "slot {index}",
      deployedTo: "deployed to",
      selectedSkillTitle: "Selected animal",
      selectCharacterHint: "Tap an animal to see its role and skill.",
      battleArena: "Animal Auto Squad Arena",
      menuTitle: "Train and position your animal squad!",
      menuHint: "Train your animals and conquer 30 five-wave stages across six regions, each ending in a unique boss battle.",
      bestExpedition: "Stages Unlocked",
      expeditionsCleared: "Cleared Runs",
      teamLevel: "Team Level",
      diamonds: "Diamonds",
      trainingTitle: "Squad Training",
      trainingGold: "Training Gold",
      owned: "Owned",
      deployed: "Deployed",
      locked: "Locked",
      premium: "Premium",
      unlockGold: "Unlock {cost} Gold",
      unlockDiamond: "Unlock {cost} Diamonds",
      upgradeGold: "Upgrade {cost} Gold",
      currencyUpgrade: "Upgrade",
      currencyUnlock: "Unlock",
      trainingStatsCurrent: "ATK {atk} · HP {hp}",
      trainingStatsNext: "ATK {atk} → {nextAtk} · HP {hp} → {nextHp}",
      trainingUpgradeLabel: "Upgrade {name} to Lv.{level}: ATK {nextAtk}, HP {nextHp} for {cost} Gold",
      maxLevel: "Max Level",
      freeUnit: "Starter",
      rosterHint: "Unlocked animals appear in your expedition backpack. Permanent levels are saved locally.",
      startExpedition: "Start Expedition",
      chooseExpedition: "Start Game",
      stageSetup: "Swipe through six regions, choose an unlocked stage, then prepare your formation.",
      yourSquadLabel: "Active Squad (Top: Front Row | Bottom: Back Row)",
      benchLabel: "Storage Bench",
      shopLabel: "Character Backpack",
      startBattle: "Start Battle",
      round: "Wave",
      stage: "Stage",
      chooseStage: "Choose Stage",
      stageReady: "Ready",
      stageCleared: "Cleared",
      stageLocked: "Clear the previous stage",
      stageProgress: "Unlocked {unlocked}/{total}",
      stageWaveCount: "{count} waves",
      stageEnemyRange: "Enemies: {first} to {last}",
      stageBoss: "Boss",
      nextStage: "Next Stage",
      stageClearText: "Stage {stage} cleared! Stage {next} is now unlocked.",
      allStagesClearText: "All 30 stages and six region bosses cleared! Replay any stage to refine your squad.",
      gold: "Gold",
      supplies: "Supplies",
      hearts: "Hearts",
      activeRelic: "Relic",
      chooseRelic: "Choose an Expedition Relic",
      relicDesc: "Select one relic to buff your squad for the entire expedition run.",
      defeatTitle: "Expedition Failed!",
      reviveHint: "Your Hearts reached 0. Spend 5 Diamonds to revive with 2 Hearts and continue your expedition?",
      giveUp: "Give Up",
      retry: "Try Again",
      backToMenu: "Main Menu",
      backToStages: "Back to Stages",
      quitRun: "Quit Run",
      combatIntro: "Prepare for Battle!",
      nextWaveCombat: "Wave {round}/{total}: new enemies incoming!",
      bossIncoming: "BOSS: {boss}",
      combatSummary: "Squad HP {playerHp}/{playerMax} | Enemy HP {enemyHp}/{enemyMax}",
      combatFront: "Front: {player} vs {enemy}",
      foodGuideTitle: "Food effects",
      guideHint: "Tap an owned animal, then tap a squad slot. Scroll the backpack vertically to browse every character.",
      level: "Lv.",
      buy: "Buy",
      sell: "Sell",
      upgradeRun: "Run Upgrade ({cost} Supplies)",
      backpackHint: "Owned animals only. Move them into the active squad, then spend Supplies for temporary expedition upgrades.",
      reroll: "Reroll",
      freeze: "Freeze",
      unfreeze: "Unfreeze",
      buySkin: "Unlock Golden Skin (15 💎)",
      skinPurchaseDecision: "Permanently unlock and equip Golden Skin. Tap again to confirm: {before} → {after} Diamonds.",
      skinPurchaseNeed: "Permanently unlock and equip Golden Skin. Requires 15 Diamonds. Current balance {balance}.",
      equipSkin: "Equip Golden Skin",
      unequipSkin: "Equip Normal Skin",
      relicReroll: "Reroll Relics (3 💎)",
      relicRerollDecision: "Reroll both relic choices. Spend 3 Diamonds. Balance {before} to {after}.",
      relicRerollNeed: "Reroll both relic choices. Requires 3 Diamonds. Current balance {balance}.",
      reviveAction: "Revive (5 💎)",
      winText: "Victory! You defeated the shadow beasts.",
      failText: "Defeat! Your squad fainted.",
      drawText: "Draw! Both squads fainted simultaneously.",
      expeditionClear: "Expedition Cleared!",
      expeditionFail: "Expedition Failed!",
      skillReport: "Logical deduction, planning, and tactical positioning improved!",
      skillsLearned: "Skills Trained: Logic, Problem Solving, Strategic Planning.",
      appleDesc: "Apple: +1/+1 stats",
      honeyDesc: "Honey: +2 HP. Buy: +1 Gold",
      melonDesc: "Melon: Gives Melon Shield",
      chocolateDesc: "Chocolate: +2 Exp",
      noDiamonds: "Not enough diamonds!",
      noGold: "Not enough gold!",
      noSupplies: "Not enough supplies!",
      needSquad: "Position at least one animal in your squad before entering battle!",
      quitConfirm: "Stage {stage}, Wave {round}/5, Hearts {hearts}/4, Supplies {supplies}. Leaving loses this run's temporary squad, relic, and unsettled progress; permanent training and unlocked stages stay safe.",
      quitRunTitle: "Leave Expedition?",
      keepPlaying: "Keep Playing",
      confirmQuit: "Leave Expedition",
      teamBonusTitle: "Permanent team bonus",
      teamBonusValue: "All owned animals enter expeditions with +{atk} ATK and +{hp} HP from Team Level.",
      teamBonusNext: "Next team level in {remaining} XP.",
      savedProgress: "Saved Progress",
      resultXpEarned: "Team XP +{earned} · Lv.{level} · XP {xp}/{goal}",
      resultGoldEarned: "Training Gold +{earned} · Total {total}",
      resultStageSaved: "Stages unlocked {unlocked}/{total}",
      resultGrowthNext: "Permanent bonus ATK +{atk} / HP +{hp} · {remaining} XP to next Team Level",
      relicMaple: "Maple Shield: Front unit starts with Melon Shield.",
      relicOak: "Oak Seed: All units gain +1 Health in battle.",
      relicShadow: "Shadow Claw: All units gain +1 Attack in battle.",
      relicClover: "Clover Leaf: First shop reroll each round is free.",
      roundNum: "Stage {stage} - Wave {round}/5",
      teamLevelValue: "Lv.{level}  XP {xp}/{goal}"
    },
    "zh-Hant": {
      title: "動物自走小隊",
      backToLobby: "\u8fd4\u56de WeightPlay \u5927\u5ef3",
      back: "\u8fd4\u56de",
      languageSelection: "\u9078\u64c7\u8a9e\u8a00",
      stageSelection: "\u95dc\u5361\u9078\u64c7",
      activeSquadSlots: "\u4e0a\u5834\u5c0f\u968a\u69fd\u4f4d",
      shopShelfItems: "\u89d2\u8272\u80cc\u5305\u7269\u54c1",
      battleArena: "\u52d5\u7269\u81ea\u8d70\u5c0f\u968a\u7af6\u6280\u5834",
      menuTitle: "挑選並擺放你的動物小隊！",
      menuHint: "訓練已擁有角色、配置六人小隊，挑戰六個區域共 30 個五波關卡。",
      bestExpedition: "最佳遠征",
      expeditionsCleared: "通關次數",
      diamonds: "鑽石",
      startExpedition: "開始遠征",
      yourSquadLabel: "作戰小隊 (左：前線 | 右：後方)",
      benchLabel: "備戰區",
      shopLabel: "遠征商店",
      startBattle: "開始戰鬥",
      round: "回合",
      gold: "金幣",
      hearts: "生命值",
      activeRelic: "聖物",
      chooseRelic: "選擇一個遠征聖物",
      relicDesc: "選擇一個聖物，為你的小隊在整場遠征中提供加成。",
      defeatTitle: "遠征失敗！",
      reviveHint: "你的生命值歸零了。花費 5 顆鑽石復活並以 2 生命值繼續遠征？",
      giveUp: "放棄",
      retry: "再試一次",
      backToMenu: "主選單",
      quitRun: "放棄遠征",
      combatIntro: "準備戰鬥！",
      guideHint: "點選背包角色，再點選上方出場格。背包可上下滑動查看所有角色。",
      level: "等級",
      buy: "購買",
      sell: "出售",
      reroll: "重置",
      freeze: "鎖定",
      unfreeze: "解鎖",
      buySkin: "解鎖黃金外觀 (15 💎)",
      skinPurchaseDecision: "永久解鎖並裝備黃金外觀。再次點選確認：{before} → {after} 鑽石。",
      skinPurchaseNeed: "永久解鎖並裝備黃金外觀需要 15 鑽石。目前餘額 {balance}。",
      equipSkin: "使用黃金外觀",
      unequipSkin: "使用普通外觀",
      relicReroll: "重置聖物 (3 💎)",
      reviveAction: "復活 (5 💎)",
      winText: "勝利！你擊退了暗影野獸。",
      failText: "戰敗！你的小隊全數昏厥。",
      drawText: "平手！兩方小隊同時昏厥。",
      expeditionClear: "遠征成功通關！",
      expeditionFail: "遠征失敗！",
      skillReport: "邏輯推理、規劃及戰術擺位能力提升！",
      skillsLearned: "訓練技能：邏輯、問題解決、策略規劃。",
      appleDesc: "蘋果：獲得 +1/+1 屬性",
      honeyDesc: "蜂蜜：獲得 +2 生命，且購買時獲得 1 金幣",
      melonDesc: "甜瓜：獲得甜瓜護盾",
      chocolateDesc: "巧克力：獲得 +2 經驗值",
      noDiamonds: "鑽石不足！",
      noGold: "金幣不足！",
      needSquad: "請先把至少一名動物放進作戰小隊，再開始戰鬥！",
      quitConfirm: "第 {stage} 關，第 {round}/5 波，生命 {hearts}/4，補給 {supplies}。離開會失去本輪臨時小隊、聖物與未結算進度；永久訓練與已解鎖關卡不受影響。",
      quitRunTitle: "要離開遠征嗎？",
      keepPlaying: "繼續遠征",
      confirmQuit: "離開遠征",
      relicMaple: "楓葉護盾：前線單位戰鬥開始時獲得甜瓜護盾。",
      relicOak: "橡樹種子：全體單位在戰鬥中獲得 +1 生命。",
      relicShadow: "暗影爪痕：全體單位在戰鬥中獲得 +1 攻擊力。",
      relicClover: "幸運草：每回合第一次商店重置免費。",
      roundNum: "第 {stage} 關 - 第 {round}/5 波"
    }
  };
  text.es = {
    title: "Escuadrón Animal Automático",
    backToLobby: "Volver al vestíbulo de WeightPlay",
    back: "Volver",
    languageSelection: "Selección de idioma",
    stageSelection: "Selección de nivel",
    stageTab: "Niveles",
    trainingTab: "Entrenamiento",
    stageSwipe: "↔ Desliza los niveles",
    stageDeploy: "Toca un nivel desbloqueado para desplegar",
    activeSquadSlots: "Espacios del escuadrón activo",
    shopShelfItems: "Personajes de la mochila",
    emptyFormationSlot: "Espacio de formación vacío",
    emptySlot: "Espacio vacío",
    activeSquad: "escuadrón activo",
    expeditionBackpack: "mochila de expedición",
    formationFrontRow: "fila delantera",
    formationBackRow: "fila trasera",
    formationLeftPosition: "posición izquierda",
    formationCenterPosition: "posición central",
    formationRightPosition: "posición derecha",
    slotPosition: "espacio {index}",
    deployedTo: "desplegado en",
    selectedSkillTitle: "Animal elegido",
    selectCharacterHint: "Toca un animal para ver su función y habilidad.",
    battleArena: "Arena del Escuadrón Animal Automático",
    menuTitle: "¡Entrena y coloca a tu escuadrón animal!",
    menuHint: "Entrena animales y supera 30 niveles de cinco oleadas en seis regiones, cada una con un jefe único.",
    bestExpedition: "Niveles desbloqueados",
    expeditionsCleared: "Partidas completadas",
    teamLevel: "Nivel del equipo",
    diamonds: "Diamantes",
    trainingTitle: "Entrenamiento del escuadrón",
    trainingGold: "Oro de entrenamiento",
    owned: "Obtenido",
    deployed: "Desplegado",
    locked: "Bloqueado",
    premium: "Prémium",
    unlockGold: "Desbloquear por {cost} de oro",
    unlockDiamond: "Desbloquear por {cost} diamantes",
    upgradeGold: "Mejorar por {cost} de oro",
    currencyUpgrade: "Mejorar",
    currencyUnlock: "Desbloquear",
    trainingStatsCurrent: "ATQ {atk} · PV {hp}",
    trainingStatsNext: "ATQ {atk} → {nextAtk} · PV {hp} → {nextHp}",
    trainingUpgradeLabel: "Mejorar {name} al Nv.{level}: ATQ {nextAtk}, PV {nextHp} por {cost} de oro",
    maxLevel: "Nivel máximo",
    freeUnit: "Inicial",
    rosterHint: "Los animales desbloqueados aparecen en la mochila. Los niveles permanentes se guardan localmente.",
    startExpedition: "Empezar expedición",
    chooseExpedition: "Iniciar juego",
    stageSetup: "Desliza por seis regiones, elige un nivel desbloqueado y prepara la formación.",
    yourSquadLabel: "Escuadrón activo (arriba: frente | abajo: retaguardia)",
    benchLabel: "Reserva",
    shopLabel: "Mochila de personajes",
    startBattle: "Empezar batalla",
    round: "Oleada",
    stage: "Nivel",
    chooseStage: "Elegir nivel",
    stageReady: "Disponible",
    stageCleared: "Completado",
    stageLocked: "Completa el nivel anterior",
    stageProgress: "Desbloqueados {unlocked}/{total}",
    stageWaveCount: "{count} oleadas",
    stageEnemyRange: "Enemigos: de {first} a {last}",
    stageBoss: "Jefe",
    nextStage: "Siguiente nivel",
    stageClearText: "¡Nivel {stage} completado! Se desbloqueó el nivel {next}.",
    allStagesClearText: "¡Completaste los 30 niveles y los seis jefes regionales! Repite cualquier nivel para perfeccionar el escuadrón.",
    gold: "Oro",
    supplies: "Suministros",
    hearts: "Corazones",
    activeRelic: "Reliquia",
    chooseRelic: "Elige una reliquia de expedición",
    relicDesc: "Elige una reliquia que potencie al escuadrón durante toda la expedición.",
    defeatTitle: "¡Expedición fallida!",
    reviveHint: "Tus corazones llegaron a 0. ¿Gastar 5 diamantes para revivir con 2 corazones y continuar?",
    giveUp: "Rendirse",
    retry: "Intentar de nuevo",
    backToMenu: "Menú principal",
    backToStages: "Volver a niveles",
    quitRun: "Abandonar partida",
    combatIntro: "¡Prepárate para la batalla!",
    nextWaveCombat: "Oleada {round}/{total}: ¡llegan nuevos enemigos!",
    bossIncoming: "JEFE: {boss}",
    combatSummary: "PV del equipo {playerHp}/{playerMax} | PV enemigo {enemyHp}/{enemyMax}",
    combatFront: "Frente: {player} contra {enemy}",
    foodGuideTitle: "Efectos de alimentos",
    guideHint: "Toca un animal obtenido y después un espacio. Desplaza la mochila verticalmente para verlos todos.",
    level: "Nv.",
    buy: "Comprar",
    sell: "Vender",
    upgradeRun: "Mejora temporal ({cost} suministros)",
    backpackHint: "Solo animales obtenidos. Ponlos en el escuadrón y gasta suministros en mejoras temporales.",
    reroll: "Cambiar",
    freeze: "Congelar",
    unfreeze: "Descongelar",
    buySkin: "Desbloquear aspecto dorado (15 💎)",
    skinPurchaseDecision: "Desbloquea y equipa permanentemente el aspecto dorado. Toca otra vez para confirmar: {before} → {after} diamantes.",
    skinPurchaseNeed: "Desbloquear y equipar permanentemente el aspecto dorado requiere 15 diamantes. Saldo actual {balance}.",
    equipSkin: "Equipar aspecto dorado",
    unequipSkin: "Equipar aspecto normal",
    relicReroll: "Cambiar reliquias (3 💎)",
    relicRerollDecision: "Cambiar las dos reliquias. Gasta 3 diamantes. Saldo de {before} a {after}.",
    relicRerollNeed: "Cambiar las dos reliquias requiere 3 diamantes. Saldo actual {balance}.",
    reviveAction: "Revivir (5 💎)",
    winText: "¡Victoria! Derrotaste a las bestias sombrías.",
    failText: "¡Derrota! Tu escuadrón cayó.",
    drawText: "¡Empate! Ambos equipos cayeron a la vez.",
    expeditionClear: "¡Expedición completada!",
    expeditionFail: "¡Expedición fallida!",
    skillReport: "¡Mejoraron la deducción lógica, la planificación y la posición táctica!",
    skillsLearned: "Habilidades practicadas: lógica, resolución de problemas y planificación estratégica.",
    appleDesc: "Manzana: +1/+1 a atributos",
    honeyDesc: "Miel: +2 PV. Compra: +1 oro",
    melonDesc: "Melón: otorga Escudo de Melón",
    chocolateDesc: "Chocolate: +2 EXP",
    noDiamonds: "¡No hay suficientes diamantes!",
    noGold: "¡No hay suficiente oro!",
    noSupplies: "¡No hay suficientes suministros!",
    needSquad: "¡Coloca al menos un animal antes de entrar en batalla!",
    quitConfirm: "Nivel {stage}, oleada {round}/5, corazones {hearts}/4, suministros {supplies}. Al salir se pierde el escuadrón temporal, la reliquia y el progreso sin resolver; el entrenamiento permanente y los niveles desbloqueados quedan a salvo.",
    quitRunTitle: "¿Salir de la expedición?",
    keepPlaying: "Seguir jugando",
    confirmQuit: "Salir de la expedición",
    teamBonusTitle: "Bonificación permanente del equipo",
    teamBonusValue: "Todos los animales obtenidos empiezan con +{atk} ATQ y +{hp} PV por el nivel del equipo.",
    teamBonusNext: "Siguiente nivel del equipo en {remaining} XP.",
    savedProgress: "Progreso guardado",
    resultXpEarned: "XP del equipo +{earned} · Nv.{level} · XP {xp}/{goal}",
    resultGoldEarned: "Oro de entrenamiento +{earned} · Total {total}",
    resultStageSaved: "Niveles desbloqueados {unlocked}/{total}",
    resultGrowthNext: "Bonificación permanente ATQ +{atk} / PV +{hp} · faltan {remaining} XP para subir",
    relicMaple: "Escudo de Arce: la unidad frontal empieza con Escudo de Melón.",
    relicOak: "Semilla de Roble: todas las unidades ganan +1 PV en batalla.",
    relicShadow: "Garra Sombría: todas las unidades ganan +1 ATQ en batalla.",
    relicClover: "Hoja de Trébol: el primer cambio de tienda de cada ronda es gratis.",
    roundNum: "Nivel {stage} - Oleada {round}/5",
    teamLevelValue: "Nv.{level}  XP {xp}/{goal}"
  };
  text.ja = {
    title: "アニマル・オート・スクワッド",
    backToLobby: "WeightPlay ロビーに戻る", back: "戻る", language: "言語", languageSelection: "言語を選択",
    stageSelection: "ステージ選択", stageTab: "ステージ", trainingTab: "トレーニング", stageSwipe: "↔ ステージをスワイプ",
    stageDeploy: "解放済みステージを選んで出発", activeSquadSlots: "出撃スクワッド枠", shopShelfItems: "キャラクターバックパック",
    emptyFormationSlot: "空き編成枠", emptySlot: "空き枠", activeSquad: "出撃スクワッド", expeditionBackpack: "遠征バックパック",
    formationFrontRow: "前列", formationBackRow: "後列", formationLeftPosition: "左", formationCenterPosition: "中央",
    formationRightPosition: "右", slotPosition: "枠 {index}", deployedTo: "配置先", selectedSkillTitle: "選択中の動物",
    selectCharacterHint: "動物を選ぶと役割とスキルを確認できます。", battleArena: "アニマル・オート・スクワッド戦場",
    menuTitle: "動物チームを鍛えて配置しよう！", menuHint: "動物を育てて編成し、6地域・30ステージの5連戦と固有ボスに挑みます。",
    bestExpedition: "解放済みステージ", expeditionsCleared: "クリア回数", teamLevel: "チームレベル", diamonds: "ダイヤ",
    trainingTitle: "スクワッドトレーニング", trainingGold: "トレーニングゴールド", owned: "所持済み", deployed: "配置中",
    locked: "未解放", premium: "プレミアム", unlockGold: "{cost} ゴールドで解放", unlockDiamond: "{cost} ダイヤで解放",
    upgradeGold: "{cost} ゴールドで強化", currencyUpgrade: "強化", currencyUnlock: "解放", trainingStatsCurrent: "攻撃 {atk}・HP {hp}",
    trainingStatsNext: "攻撃 {atk} → {nextAtk}・HP {hp} → {nextHp}",
    trainingUpgradeLabel: "{name}をLv.{level}へ強化：攻撃 {nextAtk}、HP {nextHp}、費用 {cost} ゴールド",
    maxLevel: "最大レベル", freeUnit: "初期メンバー", rosterHint: "解放した動物は遠征バックパックに追加され、恒久レベルはこのブラウザーに保存されます。",
    startExpedition: "遠征を開始", chooseExpedition: "ゲーム開始", stageSetup: "6地域をスワイプし、解放済みステージを選んで編成を準備します。",
    yourSquadLabel: "出撃スクワッド（上：前列｜下：後列）", benchLabel: "控え", shopLabel: "キャラクターバックパック",
    startBattle: "バトル開始", round: "ウェーブ", stage: "ステージ", chooseStage: "ステージ選択", stageReady: "挑戦可能",
    stageCleared: "クリア済み", stageLocked: "前のステージをクリア", stageProgress: "解放 {unlocked}/{total}", stageWaveCount: "全{count}ウェーブ",
    stageEnemyRange: "敵：{first}～{last}体", stageBoss: "ボス", nextStage: "次のステージ",
    stageClearText: "ステージ{stage}クリア！ ステージ{next}を解放しました。", allStagesClearText: "全30ステージと6地域のボスを制覇！ 好きなステージを再挑戦できます。",
    gold: "ゴールド", supplies: "物資", hearts: "ハート", activeRelic: "レリック", none: "なし",
    chooseRelic: "遠征レリックを選択", relicDesc: "遠征中ずっとスクワッドを強化するレリックを1つ選びます。",
    defeatTitle: "遠征失敗", reviveHint: "ハートが0になりました。ダイヤ5個でハート2つを回復し、遠征を続けますか？",
    giveUp: "あきらめる", retry: "もう一度", backToMenu: "メインメニュー", backToStages: "ステージへ戻る", quitRun: "遠征を中断",
    combatIntro: "バトル準備！", nextWaveCombat: "ウェーブ {round}/{total}：新たな敵が接近！", bossIncoming: "ボス：{boss}",
    combatSummary: "味方HP {playerHp}/{playerMax}｜敵HP {enemyHp}/{enemyMax}", combatFront: "前線：{player} 対 {enemy}",
    foodGuideTitle: "フード効果", guideHint: "所持動物を選び、スクワッド枠を選んで配置します。バックパックは横にスクロールできます。",
    level: "Lv.", buy: "購入", sell: "売却", upgradeRun: "遠征強化（物資{cost}）",
    backpackHint: "所持動物だけを表示します。編成後、物資で今回の遠征中だけ強化できます。", reroll: "更新", freeze: "固定", unfreeze: "固定解除",
    buySkin: "ゴールデンスキン解放（ダイヤ15）", skinPurchaseDecision: "ゴールデンスキンを恒久解放して装備します。もう一度選んで確定：{before} → {after} ダイヤ。",
    skinPurchaseNeed: "ゴールデンスキンの恒久解放にはダイヤ15個が必要です。現在 {balance} 個。", equipSkin: "ゴールデンスキンを装備",
    unequipSkin: "通常スキンを装備", relicReroll: "レリック再抽選（ダイヤ3）", relicRerollDecision: "2つの候補を再抽選します。ダイヤ3個を使用：{before} → {after}。",
    relicRerollNeed: "再抽選にはダイヤ3個が必要です。現在 {balance} 個。", reviveAction: "復活（ダイヤ5）",
    winText: "勝利！ 影の獣を倒しました。", failText: "敗北。スクワッドが力尽きました。", drawText: "引き分け。両スクワッドが同時に力尽きました。",
    expeditionClear: "遠征クリア！", expeditionFail: "遠征失敗", skillReport: "論理的な判断、計画、戦術配置を練習できました！",
    skillsLearned: "練習したスキル：論理、問題解決、戦略的計画。", appleDesc: "リンゴ：攻撃/HP +1/+1", honeyDesc: "ハチミツ：HP +2。購入時ゴールド +1",
    melonDesc: "メロン：メロンシールドを付与", chocolateDesc: "チョコレート：経験値 +2", noDiamonds: "ダイヤが足りません。",
    noGold: "ゴールドが足りません。", noSupplies: "物資が足りません。", needSquad: "バトル前に動物を1体以上配置してください。",
    quitConfirm: "ステージ{stage}、ウェーブ{round}/5、ハート{hearts}/4、物資{supplies}。離脱すると今回の一時編成、レリック、未確定進行は失われます。恒久トレーニングと解放済みステージは保持されます。",
    quitRunTitle: "遠征を離れますか？", keepPlaying: "続ける", confirmQuit: "遠征を離れる", teamBonusTitle: "恒久チームボーナス",
    teamBonusValue: "所持動物はチームレベルにより攻撃 +{atk}、HP +{hp} を得て遠征を開始します。", teamBonusNext: "次のチームレベルまで {remaining} XP。",
    savedProgress: "保存済み進行", resultXpEarned: "チームXP +{earned}・Lv.{level}・XP {xp}/{goal}",
    resultGoldEarned: "トレーニングゴールド +{earned}・合計 {total}", resultStageSaved: "解放済みステージ {unlocked}/{total}",
    resultGrowthNext: "恒久ボーナス 攻撃 +{atk} / HP +{hp}・次のチームレベルまで {remaining} XP",
    relicMaple: "メイプルシールド：前線ユニットがメロンシールドを得て開始。", relicOak: "オークの種：全ユニットのHP +1。",
    relicShadow: "シャドークロー：全ユニットの攻撃 +1。", relicClover: "クローバー：各ウェーブ最初のショップ更新が無料。",
    roundNum: "ステージ{stage} - ウェーブ{round}/5", teamLevelValue: "Lv.{level}  XP {xp}/{goal}", attackShort: "攻", healthShort: "HP"
  };

  const pageMeta = {
    en: {
      title: "Animal Auto Squad - Play Free Auto-Battler Game",
      description: "Animal Auto Squad is a free formation auto-battler. Train ten animal heroes, build a two-row squad, and clear 30 stages with six unique bosses.",
      ogDescription: "Train and position a six-animal squad across 30 five-wave stages, six regions, varied enemy formations, and six unique bosses.",
      twitterDescription: "Build a two-row animal formation, train ten heroes, and defeat six regional bosses across a 30-stage auto-battler campaign."
    },
    "zh-Hant": {
      title: "動物自走小隊 - 免費策略自走棋網頁遊戲",
      description: "《動物自走小隊》是免費的編成策略遊戲。訓練十名動物英雄、配置前後兩排，挑戰 30 關與六名區域 Boss。",
      ogDescription: "訓練並配置六人動物小隊，穿越六個區域、30 個五波關卡與六場專屬 Boss 戰。",
      twitterDescription: "配置前後兩排、訓練十名動物英雄，在 30 關自走戰役中擊敗六名區域 Boss。"
    }
  };
  pageMeta.es = {
    title: "Escuadrón Animal Automático - Juego gratuito",
    description: "Entrena diez héroes animales, crea una formación de dos filas y supera 30 niveles con seis jefes únicos.",
    ogDescription: "Coloca un escuadrón de seis animales en 30 niveles de cinco oleadas, seis regiones y seis jefes distintos.",
    twitterDescription: "Crea una formación animal, entrena diez héroes y derrota seis jefes regionales en una campaña de 30 niveles."
  };
  pageMeta.ja = {
    title: "アニマル・オート・スクワッド - 無料オートバトラー",
    description: "10体の動物ヒーローを育成し、2列のスクワッドを編成して、6体の固有ボスが待つ30ステージを攻略する無料オートバトラーです。",
    ogDescription: "動物スクワッドを配置し、6地域・30ステージの5連戦と固有ボスに挑もう。",
    twitterDescription: "動物ヒーローを育成して2列に編成し、30ステージの戦略オートバトルを攻略しよう。"
  };

  // Sound Synth settings
  let audioCtx = null;

  function isSoundMuted() {
    return Boolean(window.WonderSound?.isMuted?.());
  }

  function initAudio() {
    if (isSoundMuted()) return;
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playSynth(type) {
    if (!audioCtx || isSoundMuted()) return;
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "buy") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "sell") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "combine") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(440, now + 0.06);
        osc.frequency.setValueAtTime(880, now + 0.12);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "hit") {
        // Low triangle sweep + noise-like click
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "faint") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "shield") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "buff") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "win") {
        // Major arpeggio
        const notes = [261.6, 329.6, 392.0, 523.3];
        notes.forEach((f, idx) => {
          const oscNode = audioCtx.createOscillator();
          const gainNode2 = audioCtx.createGain();
          oscNode.connect(gainNode2);
          gainNode2.connect(audioCtx.destination);
          oscNode.type = "sine";
          oscNode.frequency.setValueAtTime(f, now + idx * 0.08);
          gainNode2.gain.setValueAtTime(0.08, now + idx * 0.08);
          gainNode2.gain.linearRampToValueAtTime(0, now + idx * 0.08 + 0.25);
          oscNode.start(now + idx * 0.08);
          oscNode.stop(now + idx * 0.08 + 0.25);
        });
      } else if (type === "fail") {
        // Sad slide
        osc.type = "sine";
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.4);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "revive") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      console.warn("Audio failed to play:", e);
    }
  }

  // Helper selectors
  const $ = (id) => document.getElementById(id);

  // Asset configuration
  const ANIMAL_METADATA = [
    { id: 0, nameEn: "Spark Paw Fox", nameZht: "\u661f\u722a\u72d0", imageKey: "sparkFox", tier: 1, atk: 2, hp: 2, targetMode: "front", roleEn: "Front Pounce", roleZht: "\u524d\u6392\u8df3\u64ca", descEn: "Targets the front row and strikes twice: a Lv pounce followed by its normal attack.", descZht: "\u5c08\u9580\u653b\u64ca\u524d\u6392\uff1a\u5148\u9020\u6210\u7b49\u7d1a\u50b7\u5bb3\uff0c\u518d\u9032\u884c\u666e\u901a\u653b\u64ca\u3002" },
    { id: 1, nameEn: "Bubble Fin Otter", nameZht: "\u6ce1\u6ce1\u9c2d\u6c34\u737a", imageKey: "bubbleOtter", tier: 1, atk: 1, hp: 3, roleEn: "Tide Care", roleZht: "\u6f6e\u6c50\u6cbb\u7652", descEn: "Before each clash, heals the weakest ally by Lv. On its turn, heals the weakest ally for half ATK (at least 1).", descZht: "\u6bcf\u6b21\u4ea4\u92d2\u524d\u6cbb\u7652\u751f\u547d\u6700\u4f4e\u7684\u968a\u53cb\u7b49\u7d1a\u9ede\uff1b\u884c\u52d5\u6642\u518d\u6cbb\u7652\u653b\u64ca\u529b\u4e00\u534a\uff08\u81f3\u5c11 1\uff09\u3002" },
    { id: 2, nameEn: "Drum Belly Panda", nameZht: "\u9f13\u809a\u718a\u8c93", imageKey: "drumPanda", tier: 2, atk: 3, hp: 2, roleEn: "Rhythm Guard", roleZht: "\u7bc0\u594f\u5b88\u8b77", descEn: "Battle start: all allies gain Lv max HP and HP. On its turn, all allies gain a Lv shield.", descZht: "\u958b\u6230\u6642\u5168\u968a\u7372\u5f97\u7b49\u7d1a\u9ede\u751f\u547d\u4e0a\u9650\u8207\u751f\u547d\uff1b\u884c\u52d5\u6642\u5168\u968a\u7372\u5f97\u7b49\u7d1a\u9ede\u8b77\u76fe\u3002" },
    { id: 3, nameEn: "Moon Cap Owl", nameZht: "\u6708\u5e3d\u8c93\u982d\u9df9", imageKey: "moonOwl", tier: 2, atk: 2, hp: 3, targetMode: "back", roleEn: "Backline Starfall", roleZht: "\u5f8c\u6392\u661f\u843d", descEn: "Targets the back row with Starfall, then strikes a second enemy in that row. Falls back to the front row if needed.", descZht: "\u5c08\u9580\u653b\u64ca\u5f8c\u6392\uff1a\u661f\u843d\u9023\u64ca\u5f8c\u6392\u5169\u540d\u6575\u4eba\uff1b\u5f8c\u6392\u7121\u4eba\u6642\u6539\u6253\u524d\u6392\u3002" },
    { id: 4, nameEn: "Moss Shell Turtle", nameZht: "\u82d4\u6bbc\u70cf\u9f9c", imageKey: "mossTurtle", tier: 3, atk: 2, hp: 4, roleEn: "Shell Wall", roleZht: "\u5805\u6bbc\u9632\u7dda", descEn: "Battle start: gains a Lv shield. On its turn, all allies gain a Lv shield. Faint: shields the next ally.", descZht: "\u958b\u6230\u6642\u81ea\u8eab\u7372\u5f97\u7b49\u7d1a\u9ede\u8b77\u76fe\uff1b\u884c\u52d5\u6642\u5168\u968a\u7372\u5f97\u7b49\u7d1a\u9ede\u8b77\u76fe\uff1b\u5012\u4e0b\u6642\u8b77\u4f4f\u4e0b\u4e00\u540d\u968a\u53cb\u3002" },
    { id: 5, nameEn: "Rainbow Hop Rabbit", nameZht: "\u5f69\u8679\u8df3\u5154", imageKey: "rainbowRabbit", tier: 3, atk: 4, hp: 2, roleEn: "Field Medic", roleZht: "\u5feb\u901f\u6cbb\u7652", descEn: "On its turn, heals the weakest ally for half ATK (at least 1) instead of attacking.", descZht: "\u884c\u52d5\u6642\u4e0d\u653b\u64ca\uff0c\u6539\u70ba\u6cbb\u7652\u751f\u547d\u6700\u4f4e\u7684\u968a\u53cb\u653b\u64ca\u529b\u4e00\u534a\uff08\u81f3\u5c11 1\uff09\u3002" },
    { id: 6, nameEn: "Gear Horn Rhino", nameZht: "\u9f52\u8f2a\u89d2\u7280\u725b", imageKey: "gearRhino", tier: 4, atk: 3, hp: 4, roleEn: "Shield Wall", roleZht: "\u8b77\u76fe\u9632\u7dda", descEn: "On its turn, gains a shield equal to half ATK (at least 1) instead of attacking.", descZht: "\u884c\u52d5\u6642\u4e0d\u653b\u64ca\uff0c\u6539\u70ba\u81ea\u8eab\u7372\u5f97\u653b\u64ca\u529b\u4e00\u534a\u7684\u8b77\u76fe\uff08\u81f3\u5c11 1\uff09\u3002" },
    { id: 7, nameEn: "Boom Mane Lion", nameZht: "\u7206\u9b03\u7345", imageKey: "boomLion", tier: 4, atk: 4, hp: 4, targetMode: "row", roleEn: "Row Roar", roleZht: "\u6574\u6392\u5486\u54ee", descEn: "Sweeps every enemy in the front row for 70% ATK, falling back to the back row. When it faints, remaining allies gain Lv ATK and HP.", descZht: "\u4ee5 70% \u653b\u64ca\u529b\u6a6b\u6383\u6575\u65b9\u6574\u500b\u524d\u6392\uff0c\u7121\u4eba\u6642\u6539\u6383\u5f8c\u6392\uff1b\u5012\u4e0b\u6642\u5176\u9918\u968a\u53cb\u7372\u5f97\u7b49\u7d1a\u9ede\u653b\u64ca\u8207\u751f\u547d\u3002" },
    { id: 8, nameEn: "Spark Paw Captain", nameZht: "\u661f\u722a\u968a\u9577", imageKey: "sparkCaptain", tier: 5, atk: 5, hp: 5, roleEn: "Command", roleZht: "\u968a\u9577\u6307\u63ee", descEn: "Battle start: all allies gain Lv ATK. On its turn, all allies gain Lv ATK and 1 HP.", descZht: "\u958b\u6230\u6642\u5168\u968a +\u7b49\u7d1a \u653b\u64ca\uff1b\u884c\u52d5\u6642\u5168\u968a +\u7b49\u7d1a \u653b\u64ca\u8207 +1 \u751f\u547d\u3002" },
    { id: 9, nameEn: "Rhino Guardian", nameZht: "\u7280\u725b\u5b88\u885b", imageKey: "rhinoGuardian", tier: 5, atk: 6, hp: 6, roleEn: "Last Stand", roleZht: "\u6700\u5f8c\u9632\u7dda", descEn: "Attacks normally. Faint: deals 4 x Lv damage to the lead enemy.", descZht: "\u9032\u884c\u666e\u901a\u653b\u64ca\uff1b\u5012\u4e0b\u6642\u5c0d\u6700\u524d\u65b9\u6575\u4eba\u9020\u6210 4 x \u7b49\u7d1a\u50b7\u5bb3\u3002" }
  ];

  const ITEM_METADATA = [
    { id: 0, nameEn: "Apple", nameZht: "\u860b\u679c", imageKey: "foodApple", descEn: "+1/+1 stats.", descZht: "+1/+1 \u5c6c\u6027\u3002" },
    { id: 1, nameEn: "Honey", nameZht: "\u8702\u871c", imageKey: "foodHoney", descEn: "+2 HP. Buy: +1 Gold.", descZht: "+2 \u751f\u547d\uff0c\u8cfc\u8cb7\u5f8c\u56de 1 \u91d1\u5e63\u3002" },
    { id: 2, nameEn: "Melon", nameZht: "\u751c\u74dc", imageKey: "foodMelon", descEn: "Gives Melon Shield.", descZht: "\u7372\u5f97\u751c\u74dc\u8b77\u76fe\u3002" },
    { id: 3, nameEn: "Chocolate", nameZht: "\u5de7\u514b\u529b", imageKey: "foodChocolate", descEn: "+2 Exp points.", descZht: "+2 \u7d93\u9a57\u3002" }
  ];

  const RELIC_METADATA = [
    { id: 0, nameEn: "Maple Shield", nameZht: "楓葉護盾", sx: 0, descEn: "Front unit starts with Melon Shield.", descZht: "前線單位戰鬥開始時獲得甜瓜護盾。" },
    { id: 1, nameEn: "Oak Seed", nameZht: "橡樹種子", sx: 384, descEn: "All units gain +1 Health in battle.", descZht: "全體單位在戰鬥中獲得 +1 生命。" },
    { id: 2, nameEn: "Shadow Claw", nameZht: "暗影爪痕", sx: 768, descEn: "All units gain +1 Attack in battle.", descZht: "全體單位在戰鬥中獲得 +1 攻擊力。" },
    { id: 3, nameEn: "Clover Leaf", nameZht: "幸運草", sx: 1152, descEn: "First shop reroll each round is free.", descZht: "每回合第一次商店重置免費。" }
  ];

  const ENEMY_METADATA = [
    { id: 0, nameEn: "Shadow Squirrel", nameZht: "\u5f71\u4e4b\u677e\u9f20", targetMode: "back", ability: "backstrike", roleEn: "Backline Ambush", roleZht: "\u5f8c\u6392\u5947\u8972", sx: 105, sy: 155, sw: 480, sh: 545, atkMod: 1.05, hpMod: .85 },
    { id: 1, nameEn: "Shadow Wolf", nameZht: "\u5f71\u4e4b\u7070\u72fc", targetMode: "front", ability: "pack", roleEn: "Pack Bite", roleZht: "\u7fa4\u72fc\u54ac\u64ca", sx: 690, sy: 170, sw: 630, sh: 535 },
    { id: 2, nameEn: "Shadow Boar", nameZht: "\u5f71\u4e4b\u91ce\u8c6c", targetMode: "front", ability: "charge", roleEn: "First Charge", roleZht: "\u9996\u64ca\u885d\u92d2", sx: 1350, sy: 155, sw: 630, sh: 540, atkMod: 1.15, hpMod: 1.15 },
    { id: 3, nameEn: "Shadow Badger", nameZht: "\u5f71\u4e4b\u737e", targetMode: "back", ability: "guard", roleEn: "Burrow Guard", roleZht: "\u6398\u5730\u5b88\u8b77", sx: 300, sy: 870, sw: 670, sh: 500, atkMod: .8, hpMod: 1.2 },
    { id: 4, nameEn: "Shadow Golem", nameZht: "\u5f71\u4e4b\u9b54\u50cf", targetMode: "row", ability: "row", roleEn: "Stone Sweep", roleZht: "\u5ca9\u77f3\u6a6b\u6383", sx: 1015, sy: 730, sw: 745, sh: 670, atkMod: .9, hpMod: 1.35 },
    { id: 5, nameEn: "Thorn Fox Scout", nameZht: "\u834a\u68d8\u72d0\u5075\u5bdf", targetMode: "back", ability: "double", roleEn: "Twin Daggers", roleZht: "\u96d9\u5203\u5947\u8972", imageKey: "enemyFoxScout", atkMod: 1.1, hpMod: .8 },
    { id: 6, nameEn: "Prism Crow", nameZht: "\u68f1\u6676\u70cf\u9d09", targetMode: "back", ability: "backstrike", roleEn: "Shard Dive", roleZht: "\u6676\u7fbd\u4fef\u885d", imageKey: "enemyCrystalCrow", atkMod: 1.15, hpMod: .8 },
    { id: 7, nameEn: "Ironhide Boar", nameZht: "\u9435\u7532\u91ce\u8c6c", targetMode: "front", ability: "charge", roleEn: "Armor Charge", roleZht: "\u91cd\u7532\u885d\u92d2", imageKey: "enemyArmoredBoar", atkMod: 1.05, hpMod: 1.35 },
    { id: 8, nameEn: "Root Guardian", nameZht: "\u6839\u7cfb\u5b88\u885b", targetMode: "front", ability: "guard", roleEn: "Living Bulwark", roleZht: "\u6d3b\u9ad4\u58c1\u58d8", imageKey: "enemyRootGuardian", atkMod: .75, hpMod: 1.5 },
    { id: 9, nameEn: "Crystal Shade", nameZht: "\u6676\u5f71\u5e7d\u9b42", targetMode: "back", ability: "drain", roleEn: "Life Drain", roleZht: "\u751f\u547d\u6c72\u53d6", imageKey: "enemyShadowBasic", atkMod: 1.05, hpMod: .9 },
    { id: 10, nameEn: "Rift Runner", nameZht: "\u88c2\u9699\u8fc5\u7378", targetMode: "back", ability: "double", roleEn: "Rift Flurry", roleZht: "\u88c2\u9699\u9023\u64ca", imageKey: "enemyShadowRunner", atkMod: 1.15, hpMod: .8 },
    { id: 11, nameEn: "Obsidian Tank", nameZht: "\u9ed1\u66dc\u91cd\u7378", targetMode: "front", ability: "guard", roleEn: "Obsidian Wall", roleZht: "\u9ed1\u66dc\u9632\u58c1", imageKey: "enemyShadowTank", atkMod: .8, hpMod: 1.6 },
    { id: 12, nameEn: "Night Panther", nameZht: "\u591c\u5f71\u9ed1\u8c79", targetMode: "back", ability: "backstrike", roleEn: "Silent Hunt", roleZht: "\u7121\u8072\u7375\u6bba", imageKey: "enemyShadowPanther", atkMod: 1.3, hpMod: .9 },
    { id: 13, nameEn: "Rune Wolf", nameZht: "\u7b26\u6587\u72fc", targetMode: "front", ability: "pack", roleEn: "Rune Pack", roleZht: "\u7b26\u6587\u72fc\u7fa4", imageKey: "enemyRuneWolf", atkMod: 1.15 },
    { id: 14, nameEn: "Rune Raven", nameZht: "\u7b26\u6587\u70cf\u9d09", targetMode: "row", ability: "row", roleEn: "Rune Tempest", roleZht: "\u7b26\u6587\u98a8\u66b4", imageKey: "enemyRuneRaven", atkMod: .9, hpMod: .85 },
    { id: 15, nameEn: "Eclipse Bat", nameZht: "\u6708\u8755\u8760\u8760", targetMode: "back", ability: "drain", roleEn: "Moon Drain", roleZht: "\u6708\u5f71\u6c72\u53d6", imageKey: "enemyEclipseBat", atkMod: 1.05, hpMod: .75 },
    { id: 16, nameEn: "Shadow Jaguar", nameZht: "\u6697\u5f71\u7f8e\u6d32\u8c79", targetMode: "back", ability: "double", roleEn: "Dusk Flurry", roleZht: "\u9ec3\u660f\u9023\u64ca", imageKey: "enemyShadowJaguar", atkMod: 1.25, hpMod: .9 }
  ];

  const BOSS_METADATA = [
    { id: 100, nameEn: "Thornwood Alpha", nameZht: "\u834a\u68d8\u72fc\u738b", targetMode: "row", ability: "thornBoss", roleEn: "Crown of Thorns", roleZht: "\u834a\u68d8\u738b\u51a0", imageKey: "bossThornwood", isBoss: true, atkMod: 1.25, hpMod: 3 },
    { id: 101, nameEn: "Prism Basilisk", nameZht: "\u68f1\u6676\u86c7\u7687", targetMode: "back", ability: "crystalBoss", roleEn: "Prism Storm", roleZht: "\u68f1\u93e1\u98a8\u66b4", imageKey: "bossPrism", isBoss: true, atkMod: 1.3, hpMod: 2.8 },
    { id: 102, nameEn: "Abyss Shell Leviathan", nameZht: "\u6df1\u6df5\u6bbc\u6d77\u7687", targetMode: "front", ability: "abyssBoss", roleEn: "Sunken Fortress", roleZht: "\u6c89\u57ce\u8981\u585e", imageKey: "bossAbyss", isBoss: true, atkMod: 1, hpMod: 3.6 },
    { id: 103, nameEn: "Magma Tusk Colossus", nameZht: "\u7194\u5ca9\u7360\u7259\u738b", targetMode: "row", ability: "magmaBoss", roleEn: "Caldera Crash", roleZht: "\u706b\u5c71\u53e3\u885d\u64ca", imageKey: "bossMagma", isBoss: true, atkMod: 1.55, hpMod: 3 },
    { id: 104, nameEn: "Eclipse Archowl", nameZht: "\u6708\u8755\u689f\u7687", targetMode: "back", ability: "eclipseBoss", roleEn: "Twin Moonfall", roleZht: "\u96d9\u6708\u661f\u843d", imageKey: "bossEclipse", isBoss: true, atkMod: 1.4, hpMod: 2.8 },
    { id: 105, nameEn: "Void Crown Emperor", nameZht: "\u865b\u7a7a\u738b\u51a0\u7345\u7687", targetMode: "row", ability: "voidBoss", roleEn: "End of Night", roleZht: "\u7d42\u591c\u964d\u81e8", imageKey: "bossVoid", isBoss: true, atkMod: 1.65, hpMod: 4.2 }
  ];

  const REGION_METADATA = [
    { id: 1, nameEn: "Thornwood", nameZht: "\u834a\u68d8\u6797", overlay: "rgba(31,94,54,.62)" },
    { id: 2, nameEn: "Crystal Caverns", nameZht: "\u6c34\u6676\u6d1e\u7a9f", overlay: "rgba(45,75,150,.62)" },
    { id: 3, nameEn: "Sunken Ruins", nameZht: "\u6c89\u6c92\u907a\u8de1", overlay: "rgba(18,112,123,.62)" },
    { id: 4, nameEn: "Ember Peak", nameZht: "\u71fc\u706b\u5cf0", overlay: "rgba(143,54,25,.64)" },
    { id: 5, nameEn: "Moonlit Citadel", nameZht: "\u6708\u5149\u57ce\u585e", overlay: "rgba(52,46,123,.66)" },
    { id: 6, nameEn: "Void Crown", nameZht: "\u865b\u7a7a\u738b\u51a0", overlay: "rgba(65,27,86,.72)" }
  ];

  const stage = (id, region, nameEn, nameZht, waves, bossId = null) => ({ id, region, nameEn, nameZht, waves, bossId });
  const STAGE_DEFINITIONS = [
    stage(1,1,"Mossy Trail","\u82d4\u861a\u5c0f\u5f91",[[0],[0],[0,1],[1,0],[0,1]]),
    stage(2,1,"Fox Ambush","\u72d0\u5f71\u57cb\u4f0f",[[5],[0,5],[5,1],[0,1,5],[5,5,1]]),
    stage(3,1,"Wolf Den","\u72fc\u7a74",[[1],[1,0],[1,1],[2,1,0],[1,1,2]]),
    stage(4,1,"Root Gate","\u6839\u7cfb\u4e4b\u9580",[[8],[3,8],[8,0,5],[8,3,1],[8,8,3,1]]),
    stage(5,1,"Thornwood Throne","\u834a\u68d8\u738b\u5ea7",[[0,1],[5,8],[1,2,8],[3,5,8,2],[5,100,8]],100),
    stage(6,2,"Glitter Passage","\u9583\u8000\u901a\u9053",[[6],[6,9],[9,0],[6,9,3],[6,6,9]]),
    stage(7,2,"Prism Nest","\u68f1\u6676\u5de2\u7a74",[[9],[9,10],[6,10],[9,10,3],[6,9,10,10]]),
    stage(8,2,"Shard Bridge","\u6676\u788e\u4e4b\u6a4b",[[14],[6,14],[14,9,3],[6,14,10,9],[14,14,6,10]]),
    stage(9,2,"Azure Vault","\u84bc\u85cd\u5bf6\u5eab",[[4],[4,9],[4,6,10],[4,4,14,9],[4,6,14,10,9]]),
    stage(10,2,"Prism Heart","\u68f1\u6676\u4e4b\u5fc3",[[6,9],[10,14],[4,6,9],[4,10,14,6],[6,101,14]],101),
    stage(11,3,"Tide Stair","\u6f6e\u6c50\u968e\u68af",[[7],[7,0],[7,14],[0,7,14],[7,7,8]]),
    stage(12,3,"Coral Archive","\u73ca\u745a\u66f8\u5eab",[[14],[14,3],[0,14,8],[3,14,7,8],[14,14,3,7]]),
    stage(13,3,"Drowned Plaza","\u6df9\u6c92\u5ee3\u5834",[[8],[8,7],[8,4,14],[8,8,7,14],[4,8,7,14,3]]),
    stage(14,3,"Leviathan Gate","\u6d77\u7687\u4e4b\u9580",[[3,14],[7,8],[3,7,14],[4,8,14,7],[3,4,7,8,14]]),
    stage(15,3,"Sunken Crown","\u6c89\u6c92\u738b\u51a0",[[7,14],[8,3],[4,7,14],[8,3,7,14,4],[14,102,7]],102),
    stage(16,4,"Ashen Path","\u7070\u71fc\u5c0f\u5f91",[[2],[7,2],[10,2],[7,10,2],[7,7,2]]),
    stage(17,4,"Cinder Forge","\u71fc\u706b\u935b\u9020\u5ee0",[[10],[10,11],[7,11],[10,7,11],[10,10,7,11]]),
    stage(18,4,"Lava Causeway","\u7194\u5ca9\u5824\u9053",[[11],[11,2],[11,7,10],[11,11,2,7],[11,10,7,2,2]]),
    stage(19,4,"Obsidian Ring","\u9ed1\u66dc\u7af6\u6280\u74b0",[[13],[13,7],[13,11,10],[13,13,7,11],[13,11,10,7,2]]),
    stage(20,4,"Caldera King","\u706b\u5c71\u53e3\u4e4b\u738b",[[7,11],[10,13],[11,7,13],[10,11,13,7,2],[7,103,11]],103),
    stage(21,5,"Silver Garden","\u9280\u6708\u82b1\u5712",[[3],[6,3],[14,3],[6,14,3],[3,3,14]]),
    stage(22,5,"Eclipse Hall","\u6708\u8755\u5927\u5ef3",[[15],[15,6],[15,14],[15,15,6,14],[15,12,14,3]]),
    stage(23,5,"Star Library","\u661f\u8fb0\u66f8\u5eab",[[12],[12,3],[12,14,15],[12,12,3,14],[12,15,14,3,6]]),
    stage(24,5,"Lunar Spire","\u6708\u8f2a\u9ad8\u5854",[[16],[16,12],[16,14,15],[16,12,14,3],[16,16,12,15,14]]),
    stage(25,5,"Midnight Court","\u5b50\u591c\u738b\u5ead",[[12,15],[14,16],[3,12,15],[6,14,16,12,15],[15,104,14]],104),
    stage(26,6,"Broken Skyway","\u7834\u788e\u5929\u8def",[[9],[9,10],[11,9],[9,10,11],[9,12,10,11]]),
    stage(27,6,"Gravity Well","\u91cd\u529b\u6df1\u4e95",[[12],[12,15],[12,16,15],[12,12,15,16],[12,15,16,9,10]]),
    stage(28,6,"Null Gallery","\u865b\u7121\u56de\u5eca",[[13],[13,14],[13,12,14],[13,13,12,14],[13,12,14,15,16]]),
    stage(29,6,"Crown Approach","\u738b\u51a0\u4e4b\u8def",[[11,12],[9,16],[10,13,15],[11,12,14,16],[9,10,11,12,14,16]]),
    stage(30,6,"End of Night","\u7d42\u591c\u4e4b\u6230",[[9,12],[10,15,16],[11,13,14,16],[9,10,11,12,15,16],[13,105,14,15,16]],105)
  ];
  const animalCopyEs = [
    ["Zorro Pata Chispeante", "Salto Frontal", "Ataca la fila delantera dos veces: un salto que inflige su nivel y después su ataque normal."],
    ["Nutria Aleta de Burbujas", "Cuidados de Marea", "Antes de cada choque cura al aliado más débil por su nivel. En su turno lo cura por la mitad de su ATQ, mínimo 1."],
    ["Panda Tambor", "Guardia Rítmica", "Al comenzar, todos ganan su nivel en PV máximos y actuales. En su turno, todos ganan un escudo igual a su nivel."],
    ["Búho Sombrero Lunar", "Lluvia Estelar Trasera", "Ataca dos enemigos de la fila trasera. Si está vacía, cambia a la delantera."],
    ["Tortuga Caparazón Musgoso", "Muro de Caparazón", "Empieza con un escudo de su nivel, protege a todos en su turno y al caer protege al siguiente aliado."],
    ["Conejo Salto Arcoíris", "Médico de Campo", "En vez de atacar, cura al aliado más débil por la mitad de su ATQ, mínimo 1."],
    ["Rinoceronte Cuerno de Engranaje", "Muro de Escudo", "En vez de atacar, obtiene un escudo igual a la mitad de su ATQ, mínimo 1."],
    ["León Melena Explosiva", "Rugido de Fila", "Barre una fila por el 70 % de su ATQ. Al caer, los aliados restantes ganan su nivel en ATQ y PV."],
    ["Capitán Pata Chispeante", "Mando", "Al comenzar, todos ganan su nivel en ATQ. En su turno, todos ganan su nivel en ATQ y 1 PV."],
    ["Guardián Rinoceronte", "Última Defensa", "Ataca normalmente. Al caer, inflige cuatro veces su nivel al enemigo principal."]
  ];
  ANIMAL_METADATA.forEach((animal, index) => {
    [animal.nameEs, animal.roleEs, animal.descEs] = animalCopyEs[index];
  });
  const itemCopyEs = [
    ["Manzana", "+1/+1 a atributos."], ["Miel", "+2 PV. Al comprar: +1 oro."],
    ["Melón", "Otorga Escudo de Melón."], ["Chocolate", "+2 puntos de EXP."]
  ];
  ITEM_METADATA.forEach((item, index) => [item.nameEs, item.descEs] = itemCopyEs[index]);
  const relicCopyEs = [
    ["Escudo de Arce", "La unidad frontal empieza con Escudo de Melón."],
    ["Semilla de Roble", "Todas las unidades ganan +1 PV en batalla."],
    ["Garra Sombría", "Todas las unidades ganan +1 ATQ en batalla."],
    ["Hoja de Trébol", "El primer cambio de tienda de cada ronda es gratis."]
  ];
  RELIC_METADATA.forEach((relic, index) => [relic.nameEs, relic.descEs] = relicCopyEs[index]);
  const enemyCopyEs = [
    ["Ardilla Sombría", "Emboscada Trasera"], ["Lobo Sombrío", "Mordisco de Manada"],
    ["Jabalí Sombrío", "Primera Carga"], ["Tejón Sombrío", "Guardia Excavadora"],
    ["Gólem Sombrío", "Barrido de Piedra"], ["Explorador Zorro Espinoso", "Dagas Gemelas"],
    ["Cuervo Prismático", "Picado de Fragmentos"], ["Jabalí Coraza de Hierro", "Carga Acorazada"],
    ["Guardián de Raíces", "Baluarte Viviente"], ["Sombra de Cristal", "Drenaje Vital"],
    ["Corredor de la Grieta", "Ráfaga de la Grieta"], ["Tanque de Obsidiana", "Muro de Obsidiana"],
    ["Pantera Nocturna", "Caza Silenciosa"], ["Lobo Rúnico", "Manada Rúnica"],
    ["Cuervo Rúnico", "Tempestad Rúnica"], ["Murciélago del Eclipse", "Drenaje Lunar"],
    ["Jaguar Sombrío", "Ráfaga del Ocaso"]
  ];
  ENEMY_METADATA.forEach((enemy, index) => [enemy.nameEs, enemy.roleEs] = enemyCopyEs[index]);
  const bossCopyEs = [
    ["Alfa del Bosque Espinoso", "Corona de Espinas"], ["Basilisco Prismático", "Tormenta Prismática"],
    ["Leviatán del Caparazón Abisal", "Fortaleza Sumergida"], ["Coloso Colmillo de Magma", "Choque de la Caldera"],
    ["Archibúho del Eclipse", "Doble Caída Lunar"], ["Emperador de la Corona Vacía", "Fin de la Noche"]
  ];
  BOSS_METADATA.forEach((boss, index) => [boss.nameEs, boss.roleEs] = bossCopyEs[index]);
  const regionNamesEs = ["Bosque Espinoso", "Cavernas de Cristal", "Ruinas Sumergidas", "Pico de Brasas", "Ciudadela Lunar", "Corona Vacía"];
  REGION_METADATA.forEach((region, index) => region.nameEs = regionNamesEs[index]);
  const stageNamesEs = [
    "Sendero Musgoso", "Emboscada del Zorro", "Guarida del Lobo", "Puerta de Raíces", "Trono del Bosque Espinoso",
    "Pasaje Brillante", "Nido Prismático", "Puente de Fragmentos", "Bóveda Azul", "Corazón Prismático",
    "Escalera de Marea", "Archivo de Coral", "Plaza Ahogada", "Puerta del Leviatán", "Corona Sumergida",
    "Camino de Ceniza", "Forja de Brasas", "Calzada de Lava", "Anillo de Obsidiana", "Rey de la Caldera",
    "Jardín Plateado", "Salón del Eclipse", "Biblioteca Estelar", "Aguja Lunar", "Corte de Medianoche",
    "Camino Celeste Roto", "Pozo Gravitatorio", "Galería Nula", "Camino a la Corona", "Fin de la Noche"
  ];
  STAGE_DEFINITIONS.forEach((definition, index) => definition.nameEs = stageNamesEs[index]);
  const animalCopyJa = [
    ["スパークポー・フォックス", "前列ジャンプ", "前列を狙い、レベル分の跳撃のあと通常攻撃を行います。"],
    ["バブルフィン・オッター", "潮の手当て", "交戦前に最も弱い味方をレベル分回復し、行動時にも攻撃力の半分（最低1）回復します。"],
    ["ドラムベリー・パンダ", "リズムガード", "開戦時に全員の最大HPとHPをレベル分増やし、行動時に全員へレベル分のシールドを与えます。"],
    ["ムーンキャップ・オウル", "後列スターフォール", "後列の敵2体を攻撃し、後列が空なら前列を狙います。"],
    ["モスシェル・タートル", "甲羅の防壁", "開戦時と行動時にシールドを与え、倒れた時は次の味方を守ります。"],
    ["レインボーホップ・ラビット", "フィールドメディック", "攻撃せず、最も弱い味方を攻撃力の半分（最低1）回復します。"],
    ["ギアホーン・ライノ", "シールドウォール", "攻撃せず、自分に攻撃力の半分（最低1）のシールドを付与します。"],
    ["ブームメイン・ライオン", "列咆哮", "前列全体を攻撃し、倒れると残った味方の攻撃とHPをレベル分増やします。"],
    ["スパークポー隊長", "指揮", "開戦時に全員の攻撃をレベル分増やし、行動時に攻撃とHPを強化します。"],
    ["ライノ・ガーディアン", "最後の砦", "通常攻撃を行い、倒れた時は先頭の敵へレベルの4倍ダメージを与えます。"]
  ];
  ANIMAL_METADATA.forEach((animal, index) => [animal.nameJa, animal.roleJa, animal.descJa] = animalCopyJa[index]);
  const itemCopyJa = [["リンゴ", "攻撃とHPを+1。"], ["ハチミツ", "HPを+2。購入時にゴールド+1。"], ["メロン", "メロンシールドを付与。"], ["チョコレート", "経験値を+2。"]];
  ITEM_METADATA.forEach((item, index) => [item.nameJa, item.descJa] = itemCopyJa[index]);
  const relicCopyJa = [["メイプルシールド", "前線ユニットがメロンシールドを得て開始。"], ["オークの種", "戦闘中、全ユニットのHP+1。"], ["シャドークロー", "戦闘中、全ユニットの攻撃+1。"], ["クローバー", "各ウェーブ最初のショップ更新が無料。"]];
  RELIC_METADATA.forEach((relic, index) => [relic.nameJa, relic.descJa] = relicCopyJa[index]);
  const enemyCopyJa = [
    ["シャドーリス", "後列奇襲"], ["シャドーウルフ", "群れの牙"], ["シャドーボア", "初撃突進"], ["シャドーバジャー", "地中ガード"],
    ["シャドーゴーレム", "岩石薙ぎ"], ["ソーンフォックス偵察兵", "双剣奇襲"], ["プリズムクロウ", "結晶急降下"], ["アイアンハイド・ボア", "装甲突進"],
    ["ルートガーディアン", "生ける防壁"], ["クリスタルシェイド", "生命吸収"], ["リフトランナー", "裂け目連撃"], ["オブシディアンタンク", "黒曜の壁"],
    ["ナイトパンサー", "静かな狩り"], ["ルーンウルフ", "ルーンの群れ"], ["ルーンレイヴン", "ルーンの嵐"], ["エクリプスバット", "月影吸収"],
    ["シャドージャガー", "黄昏連撃"]
  ];
  ENEMY_METADATA.forEach((enemy, index) => [enemy.nameJa, enemy.roleJa] = enemyCopyJa[index]);
  const bossCopyJa = [["ソーンウッド・アルファ", "茨の王冠"], ["プリズム・バジリスク", "プリズムストーム"], ["アビスシェル・リヴァイアサン", "海底要塞"], ["マグマタスク・コロッサス", "カルデラ衝撃"], ["エクリプス・アークオウル", "双月落下"], ["ヴォイドクラウン皇帝", "終夜降臨"]];
  BOSS_METADATA.forEach((boss, index) => [boss.nameJa, boss.roleJa] = bossCopyJa[index]);
  const regionNamesJa = ["ソーンウッド", "クリスタル洞窟", "海底遺跡", "エンバーピーク", "月光城塞", "ヴォイドクラウン"];
  REGION_METADATA.forEach((region, index) => region.nameJa = regionNamesJa[index]);
  const stageNamesJa = [
    "苔むす小道", "狐の待ち伏せ", "狼の巣", "根の門", "茨森の玉座", "きらめく通路", "プリズムの巣", "欠片の橋", "蒼の宝物庫", "プリズムの心臓",
    "潮の階段", "珊瑚の書庫", "水没広場", "海皇の門", "沈んだ王冠", "灰の小道", "残り火の鍛冶場", "溶岩の堤道", "黒曜の闘技環", "カルデラの王",
    "銀月庭園", "月蝕の大広間", "星の書庫", "月輪の尖塔", "真夜中の宮廷", "崩れた空路", "重力の井戸", "虚無の回廊", "王冠への道", "終夜の戦い"
  ];
  STAGE_DEFINITIONS.forEach((definition, index) => definition.nameJa = stageNamesJa[index]);

  function ensureQuitRunPanel() {
    if ($("quitRunPanel")) return;
    const panel = document.createElement("section");
    panel.id = "quitRunPanel";
    panel.className = "panel modal-panel is-hidden";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "quitRunTitle");
    panel.setAttribute("aria-describedby", "quitRunText");
    panel.innerHTML = `
      <h2 id="quitRunTitle" data-ui="quitRunTitle">Leave Expedition?</h2>
      <p id="quitRunText" data-ui="quitConfirm" class="status-line">All temporary squad progress from this expedition will be lost.</p>
      <div class="revive-actions">
        <button id="keepPlayingBtn" class="primary-btn" type="button" data-ui="keepPlaying">Keep Playing</button>
        <button id="confirmQuitBtn" class="secondary-btn" type="button" data-ui="confirmQuit">Leave Expedition</button>
      </div>`;
    const gamePanel = $("gamePanel");
    const resultPanel = $("resultPanel");
    if (gamePanel) gamePanel.insertBefore(panel, resultPanel || null);
  }

  ensureQuitRunPanel();

  function ensureActionNotices() {
    const definitions = [
      { id: "stageNotice", parent: $("trainingPane"), before: $("trainingPane")?.querySelector(".cosmetic-store") },
      { id: "prepNotice", parent: $("prepPhaseArea")?.querySelector(".shop-section"), before: $("shopRow") },
      { id: "relicDraftNotice", parent: $("relicDraftPanel"), before: null },
      { id: "reviveNotice", parent: $("defeatRevivePanel"), before: $("defeatRevivePanel")?.querySelector(".revive-actions") },
    ];
    definitions.forEach(({ id, parent, before }) => {
      if (!parent || $(id)) return;
      const notice = document.createElement("p");
      notice.id = id;
      notice.className = "action-notice";
      notice.setAttribute("role", "status");
      notice.setAttribute("aria-live", "polite");
      parent.insertBefore(notice, before);
    });
  }

  ensureActionNotices();

  function normalizeMainAndTrainingLayout() {
    const profile = document.querySelector(".profile-grid");
    const trainingPane = $("trainingPane");
    if (!profile || !trainingPane) return;

    const clearedCell = $("clearedRunsText")?.closest("div");
    clearedCell?.remove();

    let trainingMeta = trainingPane.querySelector(".training-meta");
    if (!trainingMeta) {
      trainingMeta = document.createElement("div");
      trainingMeta.className = "training-meta";
      trainingPane.insertBefore(trainingMeta, trainingPane.querySelector(".cosmetic-store"));
    }
    [$("teamLevelText")?.closest("div"), $("diamondText")?.closest("div")].forEach((cell) => {
      if (cell) trainingMeta.appendChild(cell);
    });
    profile.classList.add("main-progress");
  }

  // Locale route shells share this runtime. Keep Main limited to campaign
  // progress while permanent growth and currency live in Stage / Training.
  normalizeMainAndTrainingLayout();

  // Game UI DOM Nodes
  const nodes = {
    backToLobbyBtn: $("backToLobbyBtn"),
    mainGameTitle: $("mainGameTitle"),
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    menuPanel: $("menuPanel"),
    stagePanel: $("stagePanel"),
    stageTabBtn: $("stageTabBtn"),
    trainingTabBtn: $("trainingTabBtn"),
    stageSelectPane: $("stageSelectPane"),
    trainingPane: $("trainingPane"),
    showStageBtn: $("showStageBtn"),
    stageBackBtn: $("stageBackBtn"),
    stageSetupText: $("stageSetupText"),
    bestRoundsText: $("bestRoundsText"),
    clearedRunsText: $("clearedRunsText"),
    teamLevelText: $("teamLevelText"),
    teamBonusText: $("teamBonusText"),
    stageNotice: $("stageNotice"),
    diamondText: $("diamondText"),
    trainingTitleText: $("trainingTitleText"),
    trainingGoldText: $("trainingGoldText"),
    trainingRoster: $("trainingRoster"),
    buySkinBtn: $("buySkinBtn"),
    equipSkinBtn: $("equipSkinBtn"),
    stageSelectTitle: $("stageSelectTitle"),
    stageProgressText: $("stageProgressText"),
    stageRail: $("stageRail"),
    gamePanel: $("gamePanel"),
    stageHudLabel: $("stageHudLabel"),
    stageText: $("stageText"),
    roundText: $("roundText"),
    goldText: $("goldText"),
    heartText: $("heartText"),
    relicText: $("relicText"),
    prepPhaseArea: $("prepPhaseArea"),
    squadGrid: $("squadGrid"),
    benchGrid: $("benchGrid"),
    shopRow: $("shopRow"),
    selectedAbilityPanel: $("selectedAbilityPanel"),
    rerollShopBtn: $("rerollShopBtn"),
    sellCardBtn: $("sellCardBtn"),
    startBattleBtn: $("startBattleBtn"),
    combatArea: $("combatArea"),
    gameCanvas: $("gameCanvas"),
    combatStatusText: $("combatStatusText"),
    combatSummary: $("combatSummary"),
    foodGuide: $("foodGuide"),
    prepNotice: $("prepNotice"),
    relicDraftPanel: $("relicDraftPanel"),
    relicChoices: $("relicChoices"),
    rerollRelicsBtn: $("rerollRelicsBtn"),
    relicDraftNotice: $("relicDraftNotice"),
    defeatRevivePanel: $("defeatRevivePanel"),
    reviveBtn: $("reviveBtn"),
    reviveNotice: $("reviveNotice"),
    giveUpBtn: $("giveUpBtn"),
    quitRunPanel: $("quitRunPanel"),
    keepPlayingBtn: $("keepPlayingBtn"),
    confirmQuitBtn: $("confirmQuitBtn"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    resultXpText: $("resultXpText"),
    resultGoldText: $("resultGoldText"),
    resultStageText: $("resultStageText"),
    resultGrowthText: $("resultGrowthText"),
    skillReportText: $("skillReportText"),
    retryBtn: $("retryBtn"),
    nextStageBtn: $("nextStageBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    quitRunBtn: $("quitRunBtn"),
    hintText: $("hintText")
  };

  const STARTER_ANIMAL_IDS = [0, 1];
  const PREMIUM_ANIMAL_IDS = [8, 9];
  const COMBAT_HEALTH_BAR_HEIGHT = 28;
  const COMBAT_HEALTH_FONT_SIZE = 20;
  const ANIMAL_UNLOCK_COSTS = {
    2: 25,
    3: 30,
    4: 40,
    5: 45,
    6: 55,
    7: 65
  };
  const PREMIUM_UNLOCK_COSTS = {
    8: 25,
    9: 30
  };
  const STAGE_COUNT = STAGE_DEFINITIONS.length;
  const WAVES_PER_STAGE = 5;
  const readStorage = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const writeStorage = (key, value) => {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  };

  // State Management
  let locale = window.WonderI18n?.locale?.() || readStorage(localeKey) || "en";
  let save = loadSave();
  let state = makeState();
  let resultDecisionCommitted = false;
  let selectedSlot = null; // for tap-to-select mobile fallback
  let imageCache = {};
  let canvasCtx = null;
  let animationId = null;
  let combatRunSequence = 0;
  let combatEndTimer = null;
  let combatEndPending = null;
  let combatEndDueAt = 0;
  let combatEndRemaining = 0;
  const combatStepTimers = new Set();
  let combatProgressTimer = null;
  let combatLastProgressAt = 0;
  let combatSuspendedForBackground = false;
  let windowFocused = true;
  let quitDecisionOpen = false;
  let skinPurchasePending = false;
  let skinPurchaseNoticePending = false;
  let skinPurchaseTimer = 0;
  let skinPurchaseDueAt = 0;
  let skinPurchaseRemaining = 0;
  let stageRenderVersion = 0;
  let stageBrowseFrame = 0;

  const zhRuntimeText = {
    combatSummary: "小隊生命 {playerHp}/{playerMax}｜敵方生命 {enemyHp}/{enemyMax}",
    combatFront: "前排：{player} 對 {enemy}",
    foodGuideTitle: "食物效果"
  };

  Object.assign(zhRuntimeText, {
    menuTitle: "訓練並配置你的動物小隊！",
    language: "\u8a9e\u8a00",
    stageTab: "\u95dc\u5361",
    trainingTab: "\u8a13\u7df4",
    stageSwipe: "\u2194 \u6ed1\u52d5\u95dc\u5361",
    stageDeploy: "\u9ede\u9078\u5df2\u89e3\u9396\u95dc\u5361\u51fa\u767c",
    selectedSkillTitle: "\u76ee\u524d\u89d2\u8272",
    selectCharacterHint: "\u9ede\u9078\u89d2\u8272\u5373\u53ef\u67e5\u770b\u5b9a\u4f4d\u8207\u6280\u80fd\u3002",
    emptyFormationSlot: "\u7a7a\u767d\u9663\u4f4d",
    emptySlot: "\u7a7a\u767d\u4f4d\u7f6e",
    activeSquad: "\u4e0a\u5834\u5c0f\u968a",
    expeditionBackpack: "\u9060\u5f81\u80cc\u5305",
    formationFrontRow: "\u524d\u6392",
    formationBackRow: "\u5f8c\u6392",
    formationLeftPosition: "\u5de6\u5074\u4f4d\u7f6e",
    formationCenterPosition: "\u4e2d\u592e\u4f4d\u7f6e",
    formationRightPosition: "\u53f3\u5074\u4f4d\u7f6e",
    slotPosition: "\u4f4d\u7f6e {index}",
    deployedTo: "\u5df2\u4e0a\u9663\u81f3",
    yourSquadLabel: "\u4f5c\u6230\u5c0f\u968a\uff08\u4e0a\uff1a\u524d\u6392\uff5c\u4e0b\uff1a\u5f8c\u6392\uff09",
    nextWaveCombat: "\u7b2c {round}/{total} \u6ce2\uff1a\u65b0\u7684\u6575\u4eba\u51fa\u73fe\uff01",
    backToStages: "\u8fd4\u56de\u95dc\u5361",
    stageBoss: "\u9996\u9818",
    bossIncoming: "\u9996\u9818\uff1a{boss}",
    chooseExpedition: "\u958b\u59cb\u904a\u6232",
    bestExpedition: "\u5df2\u89e3\u9396\u95dc\u5361",
    expeditionsCleared: "\u5df2\u901a\u904e\u95dc\u5361",
    teamLevel: "\u5718\u968a\u7b49\u7d1a",
    teamLevelValue: "\u7b49\u7d1a {level}  \u7d93\u9a57\u503c {xp}/{goal}",
    stageSetup: "\u6ed1\u52d5\u700f\u89bd\u516d\u5927\u5340\u57df\uff0c\u9078\u64c7\u5df2\u89e3\u9396\u95dc\u5361\u5f8c\u914d\u7f6e\u9663\u5bb9\u3002",
    none: "\u7121",
    attackShort: "\u653b",
    healthShort: "\u751f",
    trainingTitle: "\u5c0f\u968a\u8a13\u7df4",
    trainingGold: "\u8a13\u7df4\u91d1\u5e63",
    owned: "\u5df2\u64c1\u6709",
    deployed: "\u5df2\u4e0a\u9663",
    locked: "\u672a\u89e3\u9396",
    premium: "\u83c1\u82f1",
    unlockGold: "\u7528 {cost} \u91d1\u5e63\u89e3\u9396",
    unlockDiamond: "\u7528 {cost} \u947d\u77f3\u89e3\u9396",
    upgradeGold: "\u7528 {cost} \u91d1\u5e63\u5347\u7d1a",
    currencyUpgrade: "\u5347\u7d1a",
    currencyUnlock: "\u89e3\u9396",
    trainingStatsCurrent: "\u653b {atk} \u00b7 \u751f {hp}",
    trainingStatsNext: "\u653b {atk} \u2192 {nextAtk} \u00b7 \u751f {hp} \u2192 {nextHp}",
    trainingUpgradeLabel: "\u5c07 {name} \u5347\u5230 Lv.{level}\uff1a\u653b {nextAtk}\u3001\u751f {nextHp}\uff0c\u82b1\u8cbb {cost} \u91d1\u5e63",
    maxLevel: "\u5df2\u6eff\u7d1a",
    freeUnit: "\u521d\u59cb\u89d2\u8272",
      rosterHint: "\u5df2\u89e3\u9396\u89d2\u8272\u6703\u51fa\u73fe\u5728\u9060\u5f81\u80cc\u5305\uff0c\u6c38\u4e45\u7b49\u7d1a\u6703\u5b58\u5728\u672c\u6a5f\u3002",
      shopLabel: "\u89d2\u8272\u80cc\u5305",
      supplies: "\u9060\u5f81\u7d20\u6750",
      guideHint: "\u5f9e\u80cc\u5305\u62d6\u66f3\u6216\u9ede\u9078\u5df2\u64c1\u6709\u89d2\u8272\u5230\u968a\u4f0d\u3002\u9060\u5f81\u5347\u7d1a\u4f7f\u7528\u81e8\u6642\u7d20\u6750\uff0c\u96e2\u958b\u9060\u5f81\u5f8c\u4e0d\u6703\u4fdd\u7559\u3002",
      upgradeRun: "\u9060\u5f81\u5347\u7d1a\uff08{cost} \u7d20\u6750\uff09",
      backpackHint: "\u53ea\u986f\u793a\u5df2\u64c1\u6709\u89d2\u8272\u3002\u653e\u5165\u4e0a\u9663\u5f8c\uff0c\u53ef\u7528\u81e8\u6642\u7d20\u6750\u5347\u7d1a\u3002",
      noSupplies: "\u9060\u5f81\u7d20\u6750\u4e0d\u8db3\uff01",
      teamBonusTitle: "\u6c38\u4e45\u5718\u968a\u52a0\u6210",
      teamBonusValue: "\u6240\u6709\u5df2\u64c1\u6709\u89d2\u8272\u9032\u5165\u9060\u5f81\u6642\uff0c\u6703\u56e0\u5718\u968a\u7b49\u7d1a\u7372\u5f97 +{atk} \u653b\u64ca\u548c +{hp} \u751f\u547d\u3002",
    teamBonusNext: "\u8ddd\u96e2\u4e0b\u4e00\u500b\u5718\u968a\u7b49\u7d1a\u9084\u9700 {remaining} XP\u3002",
    savedProgress: "\u5df2\u5132\u5b58\u9032\u5ea6",
    resultXpEarned: "\u5718\u968a XP +{earned} \u00b7 Lv.{level} \u00b7 XP {xp}/{goal}",
    resultGoldEarned: "\u8a13\u7df4\u91d1\u5e63 +{earned} \u00b7 \u7e3d\u8a08 {total}",
    resultStageSaved: "\u5df2\u89e3\u9396\u95dc\u5361 {unlocked}/{total}",
    resultGrowthNext: "\u6c38\u4e45\u52a0\u6210 \u653b +{atk} / \u751f +{hp} \u00b7 \u8ddd\u4e0b\u4e00\u5718\u968a\u7b49\u7d1a {remaining} XP",
      relicRerollDecision: "\u91cd\u62bd\u5169\u500b\u8056\u7269\u9078\u64c7\u3002\u82b1\u8cbb 3 \u947d\u77f3\u3002\u9918\u984d {before} \u5230 {after}\u3002",
      relicRerollNeed: "\u91cd\u62bd\u5169\u500b\u8056\u7269\u9078\u64c7\u9700\u8981 3 \u947d\u77f3\u3002\u76ee\u524d\u9918\u984d {balance}\u3002",
      skinPurchaseDecision: "\u6c38\u4e45\u89e3\u9396\u4e26\u88dd\u5099\u9ec3\u91d1\u5916\u89c0\u3002\u518d\u6b21\u9ede\u9078\u78ba\u8a8d\uff1a{before} \u2192 {after} \u947d\u77f3\u3002",
      skinPurchaseNeed: "\u6c38\u4e45\u89e3\u9396\u4e26\u88dd\u5099\u9ec3\u91d1\u5916\u89c0\u9700\u8981 15 \u947d\u77f3\u3002\u76ee\u524d\u9918\u984d {balance}\u3002",
      stage: "\u95dc\u5361",
      round: "\u6ce2\u6b21",
      chooseStage: "\u9078\u64c7\u95dc\u5361",
      stageReady: "\u53ef\u6311\u6230",
      stageCleared: "\u5df2\u901a\u95dc",
      stageLocked: "\u5148\u901a\u904e\u524d\u4e00\u95dc",
      stageProgress: "\u5df2\u89e3\u9396 {unlocked}/{total}",
      stageWaveCount: "{count} \u6ce2",
      stageEnemyRange: "\u6575\u4eba\uff1a{first} \u81f3 {last} \u96bb",
      nextStage: "\u4e0b\u4e00\u95dc",
      stageClearText: "\u7b2c {stage} \u95dc\u901a\u904e\uff01\u5df2\u89e3\u9396\u7b2c {next} \u95dc\u3002",
      allStagesClearText: "30 \u95dc\u8207\u516d\u5927\u5340\u57df\u9996\u9818\u5168\u90e8\u901a\u95dc\uff01\u53ef\u91cd\u65b0\u6311\u6230\u4efb\u4f55\u95dc\u5361\u7cbe\u9032\u968a\u4f0d\u3002",
      menuHint: "\u8a13\u7df4\u5df2\u64c1\u6709\u89d2\u8272\uff0c\u7d44\u6210\u5c0f\u968a\uff0c\u6311\u6230\u6575\u4eba\u6578\u91cf\u5e73\u7a69\u6210\u9577\u7684 5 \u6ce2\u95dc\u5361\u3002\u901a\u95dc\u5f8c\u6703\u6c38\u4e45\u89e3\u9396\u4e0b\u4e00\u95dc\u3002"
  });

  function wholeNumber(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(min, Math.min(max, Math.floor(numeric))) : fallback;
  }

  function normalizeSave(data) {
    const source = data && typeof data === "object" ? data : {};
    const animalLevels = {};
    const incomingLevels = source.animalLevels && typeof source.animalLevels === "object" ? source.animalLevels : {};
    ANIMAL_METADATA.forEach((animal) => {
      animalLevels[animal.id] = wholeNumber(incomingLevels[animal.id], 1, 1, 20);
    });
    const unlockedAnimals = new Set(STARTER_ANIMAL_IDS);
    if (Array.isArray(source.unlockedAnimals)) {
      source.unlockedAnimals.forEach((id) => {
        const normalizedId = Number(id);
        if (Number.isInteger(normalizedId) && ANIMAL_METADATA.some((animal) => animal.id === normalizedId)) unlockedAnimals.add(normalizedId);
      });
    }
    // Older run saves could retain a deployed character after the backpack list
    // had been compacted. A valid saved formation is proof that the character is
    // owned, so recover it before rebuilding the complete roster.
    if (Array.isArray(source.savedSquad)) {
      source.savedSquad.forEach((id) => {
        const normalizedId = Number(id);
        if (id !== null && id !== undefined && id !== "" && Number.isInteger(normalizedId) && ANIMAL_METADATA.some((animal) => animal.id === normalizedId)) {
          unlockedAnimals.add(normalizedId);
        }
      });
    }
    const unlockedStage = wholeNumber(source.unlockedStage, 1, 1, STAGE_COUNT);
    const selectedStage = wholeNumber(source.selectedStage, unlockedStage, 1, unlockedStage);
    const savedSquad = Array(6).fill(null);
    const savedAnimalIds = new Set();
    if (Array.isArray(source.savedSquad)) {
      source.savedSquad.slice(0, 6).forEach((id, slot) => {
        if (id === null || id === undefined || id === "") return;
        const normalizedId = Number(id);
        if (!Number.isInteger(normalizedId) || !unlockedAnimals.has(normalizedId) || savedAnimalIds.has(normalizedId)) return;
        savedSquad[slot] = normalizedId;
        savedAnimalIds.add(normalizedId);
      });
    }
    const unlockedSkin = source.unlockedSkin === true;
    return {
      bestRound: wholeNumber(source.bestRound, 0),
      clearedRuns: wholeNumber(source.clearedRuns, 0),
      unlockedSkin,
      selectedSkin: unlockedSkin && source.selectedSkin === "golden" ? "golden" : "normal",
      teamLevel: wholeNumber(source.teamLevel, 1, 1),
      teamXp: wholeNumber(source.teamXp, 0),
      coins: wholeNumber(source.coins, source.coins === undefined ? 18 : 0),
      unlockedStage,
      selectedStage,
      completedStages: Array.isArray(source.completedStages)
        ? [...new Set(source.completedStages.map(Number).filter((stage) => Number.isInteger(stage) && stage >= 1 && stage <= STAGE_COUNT))].sort((a, b) => a - b)
        : [],
      unlockedAnimals: [...unlockedAnimals].sort((a, b) => a - b),
      animalLevels,
      savedSquad
    };
  }

  function isPremiumAnimal(id) {
    return PREMIUM_ANIMAL_IDS.includes(Number(id));
  }

  function isAnimalUnlocked(id) {
    save = normalizeSave(save);
    return save.unlockedAnimals.includes(Number(id));
  }

  function animalPermanentLevel(id) {
    save = normalizeSave(save);
    return Math.max(1, Number(save.animalLevels?.[id]) || 1);
  }

  function animalUnlockCost(id) {
    return ANIMAL_UNLOCK_COSTS[id] || 0;
  }

  function premiumUnlockCost(id) {
    return PREMIUM_UNLOCK_COSTS[id] || 25;
  }

  function animalUpgradeCost(id) {
    const level = animalPermanentLevel(id);
    const animal = ANIMAL_METADATA.find((item) => item.id === Number(id));
    const tier = Math.max(1, Number(animal?.tier) || 1);
    return 12 + level * 6 + tier * 4;
  }

  function saveAnimalLevel(id, level) {
    save = normalizeSave(save);
    save.animalLevels[id] = Math.max(save.animalLevels[id] || 1, Math.min(20, Math.floor(Number(level) || 1)));
    saveSave();
  }

  function teamXpGoal(level = save.teamLevel) {
    return 18 + Math.max(1, Number(level) || 1) * 7;
  }

  function teamBonus() {
    const level = Math.max(1, Number(save.teamLevel) || 1);
    return {
      atk: Math.floor((level - 1) / 3),
      hp: Math.floor((level - 1) / 2)
    };
  }

  function addTeamXp(amount) {
    save = normalizeSave(save);
    save.teamXp += Math.max(0, Number(amount) || 0);
    while (save.teamXp >= teamXpGoal(save.teamLevel)) {
      save.teamXp -= teamXpGoal(save.teamLevel);
      save.teamLevel += 1;
    }
    saveSave();
  }

  function addTrainingCoins(amount) {
    save = normalizeSave(save);
    save.coins += Math.max(0, Math.floor(Number(amount) || 0));
    saveSave();
  }

  function awardTeamXp(amount) {
    const value = Math.max(0, Number(amount) || 0);
    state.earnedTeamXp = (state.earnedTeamXp || 0) + value;
    addTeamXp(value);
  }

  function awardTrainingCoins(amount) {
    const value = Math.max(0, Math.floor(Number(amount) || 0));
    state.earnedTrainingCoins = (state.earnedTrainingCoins || 0) + value;
    addTrainingCoins(value);
  }

  function formatTeamLevel() {
    const normalized = normalizeSave(save);
    const value = t("teamLevelValue")
      .replace("{level}", normalized.teamLevel)
      .replace("{xp}", normalized.teamXp)
      .replace("{goal}", teamXpGoal(normalized.teamLevel));
    return value;
  }

  function formatTeamBonusNote() {
    const normalized = normalizeSave(save);
    const bonus = teamBonus();
    const remaining = Math.max(0, teamXpGoal(normalized.teamLevel) - normalized.teamXp);
    const title = t("teamBonusTitle");
    const value = t("teamBonusValue", { atk: bonus.atk, hp: bonus.hp });
    const next = t("teamBonusNext", { remaining });
    return `<strong>${title}</strong><span>${value} ${next}</span>`;
  }

  function showActionNotice(node, message, trigger = null) {
    if (!node) return;
    node.textContent = message;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  }

  function clearActionNotice(node) {
    if (!node) return;
    node.textContent = "";
    if (node === nodes.prepNotice) {
      node.classList.remove("loss-recap");
      nodes.selectedAbilityPanel?.classList.remove("is-hidden");
    }
  }

  function clearAllActionNotices() {
    [nodes.stageNotice, nodes.prepNotice, nodes.relicDraftNotice, nodes.reviveNotice].forEach(clearActionNotice);
  }

  function installTestApi() {
    window.__ANIMAL_AUTO_SQUAD_TEST__ = {
      setLocaleForTest: (requested) => {
        locale = window.WonderI18n?.legacyLocale?.(requested) || requested || "en";
        document.documentElement.lang = requested || "en";
        translateUI();
        updatePageMeta();
        return locale;
      },
      readSave: () => normalizeSave(save),
      restoreSave: (snapshot) => {
        save = normalizeSave(snapshot);
        saveSave();
        return normalizeSave(save);
      },
      teamBonus: () => teamBonus(),
      stagePreview: () => ({
        unlockedStage: normalizeSave(save).unlockedStage,
        selectedStage: normalizeSave(save).selectedStage,
        completedStages: normalizeSave(save).completedStages,
        stageCount: STAGE_COUNT,
        enemyCounts: STAGE_DEFINITIONS.map((definition) => definition.waves.map((wave) => wave.length)),
        bossStages: STAGE_DEFINITIONS.filter((definition) => definition.bossId).map((definition) => ({ stage: definition.id, bossId: definition.bossId })),
        regularEnemyTypes: ENEMY_METADATA.map((enemy) => enemy.id),
        bossTypes: BOSS_METADATA.map((boss) => ({ id: boss.id, imageKey: boss.imageKey, ability: boss.ability })),
        regions: REGION_METADATA.map((region) => ({ id: region.id, nameEn: region.nameEn })),
        stages: STAGE_DEFINITIONS.map((definition) => ({ id: definition.id, region: definition.region, nameEn: definition.nameEn, bossId: definition.bossId, waves: definition.waves.map((wave) => [...wave]) })),
        firstWave: summarizeEnemyWave(1, 1),
        firstBossWave: summarizeEnemyWave(5, WAVES_PER_STAGE),
        finalBossWave: summarizeEnemyWave(30, WAVES_PER_STAGE)
      }),
      trainingPreview: () => ({
        unlockedAnimals: normalizeSave(save).unlockedAnimals,
        foxLevel: animalPermanentLevel(0),
        premiumCosts: PREMIUM_ANIMAL_IDS.map((id) => ({ id, cost: premiumUnlockCost(id) })),
        normalUnlockCosts: Object.entries(ANIMAL_UNLOCK_COSTS).map(([id, cost]) => ({ id: Number(id), cost }))
      }),
      setTrainingLevel: (id, level) => {
        save = normalizeSave(save);
        save.animalLevels[id] = Math.max(1, Math.min(20, Math.floor(Number(level) || 1)));
        saveSave();
        renderMenu();
        return animalPermanentLevel(id);
      },
      forceStageSettlement: (stage = normalizeSave(save).selectedStage) => {
        const clearedStage = Math.max(1, Math.min(STAGE_COUNT, Number(stage) || 1));
        state = makeState();
        state.stage = clearedStage;
        state.round = WAVES_PER_STAGE;
        document.body.classList.add("squad-active");
        document.body.classList.remove("squad-stage-select");
        nodes.menuPanel.classList.add("is-hidden");
        nodes.stagePanel.classList.add("is-hidden");
        nodes.gamePanel.classList.remove("is-hidden");
        for (let round = 1; round <= WAVES_PER_STAGE; round += 1) {
          awardTeamXp(4 + clearedStage * 2 + round);
          awardTrainingCoins(6 + clearedStage * 2 + round);
        }
        completeStageClear(clearedStage);
        openResultScreen(true);
        return { save: normalizeSave(save), earnedTeamXp: state.earnedTeamXp, earnedTrainingCoins: state.earnedTrainingCoins };
      },
      openReviveDecision: () => {
        state.hearts = 0;
        openRevivePopup();
        return true;
      },
      runPreview: () => {
        const previewState = makeState();
        previewState.backpack = createBackpackCards();
        return {
          supplies: previewState.gold,
          backpackIds: previewState.backpack.map((card) => card.id),
          firstUpgradeCost: runUpgradeCost(previewState.backpack[0]),
          firstAbility: previewState.backpack[0]
            ? [previewState.backpack[0].roleEn, previewState.backpack[0].descEn].filter(Boolean).join(": ")
            : ""
        };
      },
      backpackSlotRegression: () => {
        const ownedCards = createBackpackCards();
        const compactCards = ownedCards.slice(-2);
        const normalizedCards = rebuildOwnedBackpack(compactCards);
        return {
          ownedCount: normalizeSave(save).unlockedAnimals.length,
          compactCount: compactCards.length,
          slotCount: normalizedCards.length,
          occupiedCount: normalizedCards.filter(Boolean).length
        };
      },
      deployedRosterRecovery: () => {
        const recoveredSave = normalizeSave({
          ...save,
          unlockedAnimals: [0, 4],
          savedSquad: [0, 1, 2, null, null, null]
        });
        return {
          unlockedIds: recoveredSave.unlockedAnimals,
          squadIds: recoveredSave.savedSquad.filter((id) => id !== null)
        };
      },
      deployedBackpackRecovery: () => {
        const ownedCards = createBackpackCards();
        const deployedCards = ownedCards.slice(0, Math.min(3, ownedCards.length));
        const compactBackpack = ownedCards.slice(deployedCards.length);
        const recoveredCards = rebuildOwnedBackpack(compactBackpack, deployedCards);
        return {
          ownedIds: ownedCards.map((card) => card.id),
          deployedIds: deployedCards.map((card) => card.id),
          compactIds: compactBackpack.map((card) => card.id),
          recoveredIds: recoveredCards.map((card) => card.id)
        };
      },
      combinePreview: () => {
        const base = createAnimalCard(0);
        const copy = createAnimalCard(0);
        combineCards(base, copy);
        combineCards(base, createAnimalCard(0));
        return { level: base.level, exp: base.exp, atk: base.currentAtk, hp: base.currentHp };
      },
      abilityPreview: () => {
        const toCombat = (card) => ({
          ...card,
          hp: card.currentHp,
          maxHp: card.maxHp,
          atk: card.currentAtk,
          shield: Boolean(card.hasShield),
          shieldHp: 0
        });
        const enemy = (id, hp = 10) => ({
          id,
          nameEn: `Test Enemy ${id}`,
          nameZht: `測試敵人 ${id}`,
          atk: 2,
          hp,
          maxHp: hp,
          shield: false,
          shieldHp: 0,
          level: 1
        });
        state.combat = {
          ...state.combat,
          playerSquad: [toCombat(createAnimalCard(0)), toCombat(createAnimalCard(3)), toCombat(createAnimalCard(6)), toCombat(createAnimalCard(5))],
          enemySquad: [enemy(0, 12), enemy(1, 8), enemy(2, 8), enemy(3, 8)],
          step: 0,
          effects: [],
          status: "",
          animating: true
        };
        resolveOrderedCombatStep(state.combat.playerSquad, state.combat.enemySquad);
        resolveOrderedCombatStep(state.combat.playerSquad, state.combat.enemySquad);
        resolveOrderedCombatStep(state.combat.playerSquad, state.combat.enemySquad);
        resolveOrderedCombatStep(state.combat.playerSquad, state.combat.enemySquad);
        const orderedPreview = {
          firstEnemyHp: state.combat.enemySquad[0]?.hp,
          randomEnemyDamageCount: state.combat.enemySquad.filter((unit, index) => index > 0 && unit.hp < unit.maxHp).length,
          rhinoShield: state.combat.playerSquad[2]?.shieldHp || 0,
          rabbitHp: state.combat.playerSquad[3]?.hp || 0,
          rabbitMax: state.combat.playerSquad[3]?.maxHp || 0,
          status: state.combat.status,
          effects: state.combat.effects.map((fx) => ({ type: fx.type, text: fx.text || "" }))
        };
        const enemyBackline = enemy(1, 8);
        state.combat.playerSquad = [toCombat(createAnimalCard(0)), toCombat(createAnimalCard(1))];
        state.combat.enemySquad = [enemy(0, 12), enemyBackline];
        resolveEnemySlotAction(enemyBackline, 1);
        return {
          ...orderedPreview,
          playerFrontHpAfterBackline: state.combat.playerSquad[0]?.hp,
          playerBackHpAfterBackline: state.combat.playerSquad[1]?.hp,
          activeActor: state.combat.activeActor,
          activeActors: state.combat.activeActors
        };
      },
      enemyAbilityPreview: () => {
        const player = (hp = 12) => ({ id: 99, nameEn: "Test Guard", nameZht: "Test Guard", atk: 2, hp, maxHp: hp, shield: false, shieldHp: 0, level: 1 });
        const enemy = (id) => {
          const data = ENEMY_METADATA[id];
          return { ...data, atk: 2, hp: 8, maxHp: 8, shield: false, shieldHp: 0, level: 1, abilityUsed: false };
        };

        state.combat.playerSquad = [player()];
        state.combat.enemySquad = [enemy(1), enemy(1)];
        const wolfText = resolveEnemySlotAction(state.combat.enemySquad[1], 1);
        const wolfDamage = 12 - state.combat.playerSquad[0].hp;

        state.combat.playerSquad = [player()];
        state.combat.enemySquad = [enemy(2)];
        const boar = state.combat.enemySquad[0];
        resolveDirectClash(state.combat.playerSquad[0], boar);
        const firstBoarDamage = 12 - state.combat.playerSquad[0].hp;
        resolveDirectClash(state.combat.playerSquad[0], boar);
        const secondBoarDamage = 12 - firstBoarDamage - state.combat.playerSquad[0].hp;

        state.combat.playerSquad = [player()];
        state.combat.enemySquad = [enemy(0), enemy(3)];
        const badgerText = resolveEnemySlotAction(state.combat.enemySquad[1], 1);
        const badgerShield = state.combat.enemySquad[0].shieldHp;

        state.combat.playerSquad = [player()];
        state.combat.enemySquad = [enemy(0), enemy(4)];
        const golemText = resolveEnemySlotAction(state.combat.enemySquad[1], 1);
        const golemShields = state.combat.enemySquad.map((unit) => unit.shieldHp);

        return { wolfText, wolfDamage, firstBoarDamage, secondBoarDamage, badgerText, badgerShield, golemText, golemShields };
      },
      extendedEnemyPreview: () => {
        const player = (formationSlot) => ({ id: 90 + formationSlot, nameEn: `Target ${formationSlot}`, nameZht: `Target ${formationSlot}`, formationSlot, atk: 1, hp: 20, maxHp: 20, shield: false, shieldHp: 0, level: 1 });
        state.combat.playerSquad = [player(0), player(3)];
        const doubleEnemy = { ...ENEMY_METADATA[5], formationSlot: 1, atk: 4, hp: 8, maxHp: 8, shield: false, shieldHp: 0, level: 1, abilityUsed: false };
        state.combat.enemySquad = [doubleEnemy];
        const doubleText = resolveEnemySlotAction(doubleEnemy, 0);
        const doubleFrontHp = state.combat.playerSquad[0].hp;
        const doubleBackHp = state.combat.playerSquad[1].hp;

        state.combat.playerSquad = [player(0), player(3)];
        const drainEnemy = { ...ENEMY_METADATA[9], formationSlot: 1, atk: 4, hp: 5, maxHp: 10, shield: false, shieldHp: 0, level: 1, abilityUsed: false };
        state.combat.enemySquad = [drainEnemy];
        const drainText = resolveEnemySlotAction(drainEnemy, 0);
        return { doubleText, doubleFrontHp, doubleBackHp, drainText, drainHp: drainEnemy.hp, drainFrontHp: state.combat.playerSquad[0].hp, drainBackHp: state.combat.playerSquad[1].hp };
      },
      bossAbilityPreview: () => BOSS_METADATA.map((boss) => {
        const players = [0, 1, 2, 3, 4, 5].map((formationSlot) => ({ id: 80 + formationSlot, nameEn: `Hero ${formationSlot}`, nameZht: `Hero ${formationSlot}`, formationSlot, atk: 2, hp: 30, maxHp: 30, shield: false, shieldHp: 0, level: 1 }));
        const bossUnit = { ...boss, formationSlot: 1, atk: 6, hp: 18, maxHp: 20, shield: false, shieldHp: 0, level: 5, abilityUsed: false };
        state.combat.playerSquad = players;
        state.combat.enemySquad = [bossUnit];
        state.combat.effects = [];
        state.combat.activeActors = [];
        const text = resolveBossAction(bossUnit, 0);
        return { id: boss.id, text, playerHp: players.map((unit) => unit.hp), bossHp: bossUnit.hp, bossShield: bossUnit.shieldHp, allyShields: state.combat.enemySquad.map((unit) => unit.shieldHp) };
      }),
      combatUiPreview: () => ({
        healthBarHeight: COMBAT_HEALTH_BAR_HEIGHT,
        healthFontSize: COMBAT_HEALTH_FONT_SIZE,
        showsLevelBadge: false,
        formationSlots: 6,
        playerCard: combatLayoutMetrics("player"),
        enemyCard: combatLayoutMetrics("enemy"),
        enemyCrops: ENEMY_METADATA.filter((enemy) => Number.isFinite(enemy.sx)).map(({ id, sx, sy, sw, sh }) => ({ id, sx, sy, sw, sh }))
      }),
      assetState: () => ({
        ready: assetsReady,
        bossKeys: BOSS_METADATA.map((boss) => boss.imageKey),
        loadedBossKeys: BOSS_METADATA.map((boss) => boss.imageKey).filter((key) => Boolean(imageCache[key])),
        enemyKeys: [...new Set(ENEMY_METADATA.map((enemy) => enemy.imageKey).filter(Boolean))],
        loadedEnemyKeys: [...new Set(ENEMY_METADATA.map((enemy) => enemy.imageKey).filter((key) => key && imageCache[key]))]
      }),
      combatPhraseCoverage: () => {
        const phraseKeys = Object.keys(japanesePhrases);
        const inlineLocales = ["zh-Hant", "ja", "es"];
        const catalogLocales = ["zh-Hans", "ko", "pt-BR", "fr", "de", "it", "ru"];
        return {
          requiredLocales: [...inlineLocales, ...catalogLocales],
          phraseCount: phraseKeys.length,
          missingByLocale: Object.fromEntries([
            ...inlineLocales.map((entry) => [entry, []]),
            ...catalogLocales.map((entry) => [entry, phraseKeys.filter((key) => !combatPhraseCatalog[entry]?.[key])])
          ])
        };
      },
      formationPreview: () => {
        const combatCard = (id, formationSlot) => {
          const card = createAnimalCard(id);
          return { ...card, formationSlot, atk: card.currentAtk, hp: 20, maxHp: 20, shield: false, shieldHp: 0 };
        };
        const enemy = (formationSlot) => ({
          ...ENEMY_METADATA[0],
          formationSlot,
          atk: 1,
          hp: 20,
          maxHp: 20,
          shield: false,
          shieldHp: 0,
          level: 1,
          abilityUsed: false
        });
        state.combat.playerSquad = [combatCard(3, 3), combatCard(7, 4)];
        state.combat.enemySquad = [0, 1, 2, 3, 4, 5].map(enemy);
        state.combat.effects = [];
        resolveUnitAbility(state.combat.playerSquad[0], "player", 0);
        const owlHp = state.combat.enemySquad.map((unit) => unit.hp);
        state.combat.enemySquad.forEach((unit) => { unit.hp = 20; });
        resolveUnitAbility(state.combat.playerSquad[1], "player", 1);
        const lionHp = state.combat.enemySquad.map((unit) => unit.hp);
        state.combat.playerSquad = [combatCard(3, 3)];
        state.combat.enemySquad = [enemy(3)];
        state.combat.effects = [];
        resolveUnitAbility(state.combat.playerSquad[0], "player", 0);
        const loneOwlTargetHp = state.combat.enemySquad[0].hp;
        return { owlHp, lionHp, loneOwlTargetHp };
      },
      forceQuickOutcome: (result = "win", delay = 40) => {
        if (!state.combat.animating || state.combat.ending) return false;
        if (result === "win") state.combat.enemySquad = [];
        if (result === "lose") {
          const fallen = state.combat.playerSquad[0];
          const enemy = state.combat.enemySquad[0];
          if (fallen) {
            state.combat.lastFallen = {
              name: combatUnitName(fallen),
              slot: unitFormationSlot(fallen, 0)
            };
          }
          if (!state.combat.lastAction && enemy) {
            state.combat.lastAction = `${combatUnitName(enemy)} ${localizedPhrase("attacks the front row", "\u653b\u64ca\u524d\u6392", "ataca la fila delantera")}`;
          }
          state.combat.playerSquad = [];
        }
        scheduleCombatEnd(result, Math.max(0, Number(delay) || 0));
        scheduleCombatEnd(result, Math.max(0, Number(delay) || 0));
        return true;
      },
      combatState: () => ({
        runId: state.combat.runId,
        round: state.round,
        playerCount: state.combat.playerSquad.length,
        enemyCount: state.combat.enemySquad.length,
        playerHp: state.combat.playerSquad.reduce((total, unit) => total + Math.max(0, unit.hp || 0), 0),
        timer: state.combat.timer,
        animating: state.combat.animating,
        ending: state.combat.ending,
        resolved: state.combat.resolved,
        windowFocused,
        suspended: combatSuspendedForBackground,
        prepVisible: !nodes.prepPhaseArea.classList.contains("is-hidden"),
        combatVisible: !nodes.combatArea.classList.contains("is-hidden"),
        lossRecap: nodes.prepNotice?.textContent?.trim() || ""
      }),
      pauseCombatPreview: () => {
        state.combat.animating = false;
        cancelAnimationFrame(animationId);
        return state.combat.layout || [];
      },
      prepareSixUnitBattle: () => {
        clearScheduledCombatTimers();
        state.combat.animating = false;
        state.combat.resolved = true;
        cancelAnimationFrame(animationId);
        state.stage = 29;
        state.round = 5;
        state.squad = [0, 1, 2, 3, 7, 8].map((id) => createAnimalCard(id));
        nodes.prepPhaseArea.classList.remove("is-hidden");
        nodes.combatArea.classList.add("is-hidden");
        nodes.combatSummary?.classList.add("is-hidden");
        renderPrepScreen();
        updateHUD();
        nodes.startBattleBtn.disabled = false;
        return state.squad.length;
      },
      prepareBossBattle: (stageValue = 30) => {
        clearScheduledCombatTimers();
        state.combat.animating = false;
        state.combat.resolved = true;
        cancelAnimationFrame(animationId);
        state.stage = Math.max(1, Math.min(STAGE_COUNT, Number(stageValue) || 30));
        state.round = WAVES_PER_STAGE;
        state.squad = [0, 1, 2, 3, 7, 8].map((id) => createAnimalCard(id));
        nodes.prepPhaseArea.classList.remove("is-hidden");
        nodes.combatArea.classList.add("is-hidden");
        nodes.combatSummary?.classList.add("is-hidden");
        renderPrepScreen();
        updateHUD();
        nodes.startBattleBtn.disabled = false;
        return stageDefinition(state.stage).bossId;
      },
      returnToMenu(stage = normalizeSave(save).selectedStage) {
        save = normalizeSave({ ...save, selectedStage: stage });
        saveSave();
        state.activeRun = false;
        renderMenu();
        return { selectedStage: normalizeSave(save).selectedStage };
      }
    };
  }

  function loadSave() {
    let normalized;
    try {
      const data = readStorage(saveKey);
      normalized = normalizeSave(data ? JSON.parse(data) : null);
    } catch (e) {
      normalized = normalizeSave(null);
    }
    writeStorage(saveKey, JSON.stringify(normalized));
    return normalized;
  }

  function saveSave() {
    writeStorage(saveKey, JSON.stringify(save));
  }

  function makeState() {
    return {
      activeRun: false,
      stage: Math.max(1, Math.min(STAGE_COUNT, Number(save?.selectedStage) || 1)),
      round: 1,
      gold: 12,
      hearts: 4,
      relic: null,
      freeRerollThisRound: false,
      rerollsUsedThisRound: 0,
      squad: [null, null, null, null, null, null],
      bench: [null, null, null, null, null],
      backpack: [],
      shop: {
        animals: [null, null, null],
        items: [null, null],
        frozenAnimals: [false, false, false],
        frozenItems: [false, false]
      },
      combat: {
        playerSquad: [],
        enemySquad: [],
        step: 0,
        log: [],
        status: "",
        animating: false,
        ending: false,
        resolved: false,
        runId: 0,
        timer: 0,
        playerActiveIndex: 0,
        enemyActiveIndex: 0,
        shakeFrames: 0,
        shakeTarget: "",
        activeActor: null,
        activeActors: [],
        lastAction: "",
        lastFallen: null,
        effects: [] // visual particle FX
      },
      earnedTeamXp: 0,
      earnedTrainingCoins: 0
    };
  }

  function t(key, data = {}) {
    const active = actualGameLocale();
    const source = (active === "fr" && frenchRuntimeText[key]) || (locale === "zh-Hant" && zhRuntimeText[key]) || text[locale]?.[key] || text.en[key] || key;
    const value = Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), source);
    if (active === "es" && key === "battleArena") return value;
    return runtimeTranslate(value);
  }

  function localizedField(record, field) {
    if (!record) return "";
    if (locale === "zh-Hant") return record[`${field}Zht`] || record[`${field}En`] || "";
    if (locale === "es") return record[`${field}Es`] || record[`${field}En`] || "";
    if (locale === "ja") return record[`${field}Ja`] || record[`${field}En`] || "";
    return runtimeTranslate(record[`${field}En`] || "");
  }

  const japanesePhrases = {
    "Shield": "シールド", "YOUR SQUAD": "味方スクワッド", "Slot": "枠", "clashes with": "と激突",
    "guards the front": "前列を守る", "uses Pack Bite": "群れの牙を発動", "uses First Charge": "初撃突進を発動",
    "unleashes Thornstorm": "ソーンストームを放つ", "casts Prism Storm": "プリズムストームを放つ",
    "raises the Sunken Fortress": "海底要塞を展開", "uses Caldera Crash": "カルデラ衝撃を発動",
    "casts Twin Moonfall": "双月落下を放つ", "invokes End of Night": "終夜降臨を呼び起こす",
    "sweeps the front row": "前列全体を薙ぐ", "heals an ally": "味方を回復", "strikes twice": "2回攻撃",
    "strikes the back row": "後列を攻撃", "strikes the front row": "前列を攻撃", "raises a shield": "シールドを展開",
    "casts Starfall": "スターフォールを放つ", "guards the squad": "スクワッドを守る", "rallies allies": "味方を鼓舞",
    "double-pounces the front row": "前列へ連続跳撃", "attacks the back row": "後列を攻撃", "attacks the front row": "前列を攻撃"
  };

  const combatPhraseCatalog = {
    "zh-Hans": {
      Shield:"护盾", "YOUR SQUAD":"你的队伍", Slot:"槽位", "clashes with":"与之交锋", "guards the front":"守卫前排", "uses Pack Bite":"发动群体撕咬", "uses First Charge":"发动首次冲锋", "unleashes Thornstorm":"释放荆棘风暴", "casts Prism Storm":"施放棱镜风暴", "raises the Sunken Fortress":"升起沉没要塞", "uses Caldera Crash":"发动火山口冲击", "casts Twin Moonfall":"施放双月坠落", "invokes End of Night":"召唤终夜", "sweeps the front row":"横扫前排", "heals an ally":"治疗一名队友", "strikes twice":"连续攻击两次", "strikes the back row":"攻击后排", "strikes the front row":"攻击前排", "raises a shield":"举起护盾", "casts Starfall":"施放星落", "guards the squad":"守护队伍", "rallies allies":"鼓舞队友", "double-pounces the front row":"连续扑击前排", "attacks the back row":"攻击后排", "attacks the front row":"攻击前排"
    },
    ko: {
      Shield:"보호막", "YOUR SQUAD":"내 분대", Slot:"슬롯", "clashes with":"와 맞붙습니다", "guards the front":"전열을 지킵니다", "uses Pack Bite":"무리 물기를 사용합니다", "uses First Charge":"선제 돌진을 사용합니다", "unleashes Thornstorm":"가시 폭풍을 방출합니다", "casts Prism Storm":"프리즘 폭풍을 시전합니다", "raises the Sunken Fortress":"가라앉은 요새를 세웁니다", "uses Caldera Crash":"칼데라 충돌을 사용합니다", "casts Twin Moonfall":"쌍월 낙하를 시전합니다", "invokes End of Night":"밤의 종말을 부릅니다", "sweeps the front row":"전열 전체를 휩씁니다", "heals an ally":"아군을 치료합니다", "strikes twice":"두 번 공격합니다", "strikes the back row":"후열을 공격합니다", "strikes the front row":"전열을 공격합니다", "raises a shield":"보호막을 펼칩니다", "casts Starfall":"별빛 낙하를 시전합니다", "guards the squad":"분대를 지킵니다", "rallies allies":"아군을 고무합니다", "double-pounces the front row":"전열을 두 번 덮칩니다", "attacks the back row":"후열을 공격합니다", "attacks the front row":"전열을 공격합니다"
    },
    "pt-BR": {
      Shield:"Escudo", "YOUR SQUAD":"SEU ESQUADRÃO", Slot:"Espaço", "clashes with":"entra em confronto com", "guards the front":"protege a linha de frente", "uses Pack Bite":"usa Mordida da Matilha", "uses First Charge":"usa Investida Inicial", "unleashes Thornstorm":"libera Tempestade de Espinhos", "casts Prism Storm":"lança Tempestade Prismática", "raises the Sunken Fortress":"ergue a Fortaleza Submersa", "uses Caldera Crash":"usa Impacto da Caldeira", "casts Twin Moonfall":"lança Queda das Luas Gêmeas", "invokes End of Night":"invoca o Fim da Noite", "sweeps the front row":"varre a linha de frente", "heals an ally":"cura um aliado", "strikes twice":"ataca duas vezes", "strikes the back row":"ataca a retaguarda", "strikes the front row":"ataca a linha de frente", "raises a shield":"ergue um escudo", "casts Starfall":"lança Chuva Estelar", "guards the squad":"protege o esquadrão", "rallies allies":"incentiva os aliados", "double-pounces the front row":"salta duas vezes sobre a linha de frente", "attacks the back row":"ataca a retaguarda", "attacks the front row":"ataca a linha de frente"
    },
    fr: {
      Shield:"Bouclier", "YOUR SQUAD":"VOTRE ÉQUIPE", Slot:"Emplacement", "clashes with":"affronte", "guards the front":"protège la première ligne", "uses Pack Bite":"utilise Morsure de meute", "uses First Charge":"utilise Charge initiale", "unleashes Thornstorm":"déchaîne Tempête d'épines", "casts Prism Storm":"lance Tempête prismatique", "raises the Sunken Fortress":"érige la Forteresse engloutie", "uses Caldera Crash":"utilise Choc de caldeira", "casts Twin Moonfall":"lance Double chute lunaire", "invokes End of Night":"invoque la Fin de la nuit", "sweeps the front row":"balaye la première ligne", "heals an ally":"soigne un allié", "strikes twice":"frappe deux fois", "strikes the back row":"frappe la ligne arrière", "strikes the front row":"frappe la première ligne", "raises a shield":"érige un bouclier", "casts Starfall":"lance Pluie d'étoiles", "guards the squad":"protège l'équipe", "rallies allies":"encourage ses alliés", "double-pounces the front row":"bondit deux fois sur la première ligne", "attacks the back row":"attaque la ligne arrière", "attacks the front row":"attaque la première ligne"
    },
    de: {
      Shield:"Schild", "YOUR SQUAD":"DEIN TRUPP", Slot:"Platz", "clashes with":"kämpft gegen", "guards the front":"schützt die Frontreihe", "uses Pack Bite":"setzt Rudelbiss ein", "uses First Charge":"setzt Erstangriff ein", "unleashes Thornstorm":"entfesselt Dornensturm", "casts Prism Storm":"wirkt Prismensturm", "raises the Sunken Fortress":"errichtet die Versunkene Festung", "uses Caldera Crash":"setzt Kratersturz ein", "casts Twin Moonfall":"wirkt Doppelmondfall", "invokes End of Night":"beschwört das Ende der Nacht", "sweeps the front row":"fegt durch die Frontreihe", "heals an ally":"heilt einen Verbündeten", "strikes twice":"greift zweimal an", "strikes the back row":"greift die hintere Reihe an", "strikes the front row":"greift die Frontreihe an", "raises a shield":"errichtet einen Schild", "casts Starfall":"wirkt Sternenfall", "guards the squad":"schützt den Trupp", "rallies allies":"ermutigt die Verbündeten", "double-pounces the front row":"springt zweimal auf die Frontreihe", "attacks the back row":"greift die hintere Reihe an", "attacks the front row":"greift die Frontreihe an"
    },
    it: {
      Shield:"Scudo", "YOUR SQUAD":"LA TUA SQUADRA", Slot:"Posizione", "clashes with":"si scontra con", "guards the front":"protegge la prima linea", "uses Pack Bite":"usa Morso del branco", "uses First Charge":"usa Carica iniziale", "unleashes Thornstorm":"scatena Tempesta di spine", "casts Prism Storm":"lancia Tempesta prismatica", "raises the Sunken Fortress":"innalza la Fortezza sommersa", "uses Caldera Crash":"usa Impatto della caldera", "casts Twin Moonfall":"lancia Doppia caduta lunare", "invokes End of Night":"invoca la Fine della notte", "sweeps the front row":"spazza la prima linea", "heals an ally":"cura un alleato", "strikes twice":"colpisce due volte", "strikes the back row":"colpisce la retroguardia", "strikes the front row":"colpisce la prima linea", "raises a shield":"innalza uno scudo", "casts Starfall":"lancia Pioggia stellare", "guards the squad":"protegge la squadra", "rallies allies":"incoraggia gli alleati", "double-pounces the front row":"balza due volte sulla prima linea", "attacks the back row":"attacca la retroguardia", "attacks the front row":"attacca la prima linea"
    },
    ru: {
      Shield:"Щит", "YOUR SQUAD":"ВАШ ОТРЯД", Slot:"Ячейка", "clashes with":"сражается с", "guards the front":"защищает передний ряд", "uses Pack Bite":"использует «Укус стаи»", "uses First Charge":"использует «Первый натиск»", "unleashes Thornstorm":"выпускает «Шторм шипов»", "casts Prism Storm":"создаёт «Призматический шторм»", "raises the Sunken Fortress":"воздвигает «Затонувшую крепость»", "uses Caldera Crash":"использует «Удар кальдеры»", "casts Twin Moonfall":"создаёт «Падение двух лун»", "invokes End of Night":"призывает «Конец ночи»", "sweeps the front row":"сметает передний ряд", "heals an ally":"лечит союзника", "strikes twice":"атакует дважды", "strikes the back row":"атакует задний ряд", "strikes the front row":"атакует передний ряд", "raises a shield":"поднимает щит", "casts Starfall":"создаёт «Звездопад»", "guards the squad":"защищает отряд", "rallies allies":"воодушевляет союзников", "double-pounces the front row":"дважды прыгает на передний ряд", "attacks the back row":"атакует задний ряд", "attacks the front row":"атакует передний ряд"
    }
  };

  const frenchRuntimeText = {
    activeSquadSlots:"Emplacements de l'équipe active", shopShelfItems:"Personnages du sac d'expédition", emptyFormationSlot:"Emplacement de formation vide", emptySlot:"Emplacement vide", activeSquad:"équipe active", expeditionBackpack:"sac d'expédition", formationFrontRow:"première ligne", formationBackRow:"ligne arrière", formationLeftPosition:"position gauche", formationCenterPosition:"position centrale", formationRightPosition:"position droite", slotPosition:"emplacement {index}", deployedTo:"déployé à", battleArena:"Arène d'Animal Auto Squad", quitRun:"Quitter l'expédition"
  };

  function actualGameLocale() {
    return window.WonderI18n?.actualLocale?.() || locale || "en";
  }

  function runtimeTranslate(value) {
    const localizer = window.WeightPlayGameRuntimeLocalizer;
    return localizer?.locale === actualGameLocale() ? localizer.translate(String(value)) : value;
  }

  function localizedPhrase(en, zht, es) {
    const active = actualGameLocale();
    if (active === "zh-Hant") return zht;
    if (active === "es") return es;
    if (active === "ja") return japanesePhrases[en] || en;
    return combatPhraseCatalog[active]?.[en] || runtimeTranslate(en);
  }

  const lossRecapCatalog = {
    en: {
      recap: "Loss recap: {unit} fell in the {row}. Decisive action: {action}. Counterplay: {counter}",
      front: "Put a tougher or shielded animal in front, or spend Supplies on Health.",
      back: "Protect the back row with healing or shields, or move the exposed animal."
    },
    "zh-Hant": {
      recap: "敗因回顧：{unit} 在{row}倒下。關鍵行動：{action}。反制方向：{counter}",
      front: "把更耐打或有護盾的動物放到前排，或用補給提升生命。",
      back: "用治療或護盾保護後排，或移動暴露的動物。"
    },
    "zh-Hans": {
      recap: "败因回顾：{unit} 在{row}倒下。关键行动：{action}。反制方向：{counter}",
      front: "把更耐打或有护盾的动物放到前排，或用补给提升生命。",
      back: "用治疗或护盾保护后排，或移动暴露的动物。"
    },
    ja: {
      recap: "敗因：{unit}が{row}で倒れました。決定打：{action}。対策：{counter}",
      front: "耐久力かシールドの高い動物を前列に置くか、物資で体力を上げましょう。",
      back: "回復やシールドで後列を守るか、無防備な動物を移動しましょう。"
    },
    ko: {
      recap: "패배 요약: {unit}이(가) {row}에서 쓰러졌습니다. 결정적 행동: {action}. 대응: {counter}",
      front: "더 튼튼하거나 보호막이 있는 동물을 앞줄에 두거나 보급품으로 체력을 올리세요.",
      back: "회복이나 보호막으로 뒷줄을 지키거나 노출된 동물을 옮기세요."
    },
    es: {
      recap: "Resumen de derrota: {unit} cayó en la {row}. Acción decisiva: {action}. Respuesta: {counter}",
      front: "Pon delante un animal más resistente o con escudo, o invierte Suministros en Salud.",
      back: "Protege la fila trasera con curación o escudos, o mueve al animal expuesto."
    },
    "pt-BR": {
      recap: "Resumo da derrota: {unit} caiu na {row}. Ação decisiva: {action}. Resposta: {counter}",
      front: "Coloque um animal mais resistente ou com escudo na frente, ou invista Suprimentos em Vida.",
      back: "Proteja a retaguarda com cura ou escudos, ou mova o animal exposto."
    },
    fr: {
      recap: "Bilan de la défaite : {unit} est tombé sur la {row}. Action décisive : {action}. Riposte : {counter}",
      front: "Placez devant un animal plus robuste ou protégé, ou dépensez des provisions en Santé.",
      back: "Protégez l'arrière avec des soins ou des boucliers, ou déplacez l'animal exposé."
    },
    de: {
      recap: "Niederlage: {unit} fiel in der {row}. Entscheidende Aktion: {action}. Gegenmaßnahme: {counter}",
      front: "Stelle ein robusteres oder geschütztes Tier nach vorn oder investiere Vorräte in Gesundheit.",
      back: "Schütze die hintere Reihe mit Heilung oder Schilden oder versetze das gefährdete Tier."
    },
    it: {
      recap: "Riepilogo sconfitta: {unit} è caduto nella {row}. Azione decisiva: {action}. Contromossa: {counter}",
      front: "Metti davanti un animale più resistente o protetto, oppure investi Scorte in Salute.",
      back: "Proteggi la retroguardia con cure o scudi, oppure sposta l'animale esposto."
    },
    ru: {
      recap: "Итог поражения: {unit} пал в зоне «{row}». Решающее действие: {action}. Ответ: {counter}",
      front: "Поставьте вперед более стойкого или защищенного щитом зверя либо вложите припасы в здоровье.",
      back: "Защитите задний ряд лечением или щитами либо переместите уязвимого зверя."
    },
    hi: {
      recap: "हार का सार: {unit} {row} में गिरा। निर्णायक चाल: {action}। जवाबी रणनीति: {counter}",
      front: "अधिक मजबूत या ढाल वाले जानवर को आगे रखें, या आपूर्ति से स्वास्थ्य बढ़ाएँ।",
      back: "पीछे की पंक्ति को उपचार या ढाल से बचाएँ, या खुले जानवर को दूसरी जगह रखें।"
    },
    ar: {
      recap: "ملخص الخسارة: سقط {unit} في {row}. الحركة الحاسمة: {action}. المواجهة: {counter}",
      front: "ضع حيوانًا أقوى أو محميًا بدرع في الأمام، أو أنفق المؤن على الصحة.",
      back: "احمِ الصف الخلفي بالعلاج أو الدروع، أو انقل الحيوان المكشوف."
    }
  };

  function buildLossRecap() {
    const copy = lossRecapCatalog[actualGameLocale()] || lossRecapCatalog.en;
    const fallen = state.combat.lastFallen;
    const slot = fallen?.slot ?? 0;
    const values = {
      unit: fallen?.name || t("activeSquad"),
      row: t(slot < 3 ? "formationFrontRow" : "formationBackRow"),
      action: state.combat.lastAction || t("failText"),
      counter: copy[slot < 3 ? "front" : "back"]
    };
    return Object.entries(values).reduce(
      (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
      copy.recap
    );
  }

  function updatePageMeta() {
    const meta = pageMeta[locale] || pageMeta.en;
    document.title = meta.title;
    const setMeta = (selector, val) => document.querySelector(selector)?.setAttribute("content", val);
    setMeta("meta[name='description']", meta.description);
    setMeta("meta[property='og:title']", meta.title);
    setMeta("meta[property='og:description']", meta.ogDescription);
    setMeta("meta[name='twitter:title']", meta.title);
    setMeta("meta[name='twitter:description']", meta.twitterDescription);
  }

  function getWalletDiamonds() {
    return window.WeightPlayWallet?.read?.().diamonds || 0;
  }

  function spendWalletDiamonds(amount) {
    if (window.WeightPlayWallet?.spendDiamonds) {
      const ok = window.WeightPlayWallet.spendDiamonds(amount);
      if (ok) {
        updateWalletUI();
        return true;
      }
    }
    return false;
  }

  function updateWalletUI() {
    nodes.diamondText.innerHTML = currencyMarkup("diamond", getWalletDiamonds());
    nodes.diamondText.setAttribute("aria-label", `${getWalletDiamonds()} ${t("diamonds")}`);
    renderCosmeticSection();
    renderTrainingRoster();
  }

  function currencyMarkup(type, amount, action = "") {
    const src = type === "diamond" ? "../../assets/weightplay-diamond.svg" : "../../assets/coin.png";
    return `<span class="currency-line"><img src="${src}" alt="" aria-hidden="true"><b>${amount}</b>${action ? `<span>${action}</span>` : ""}</span>`;
  }

  // Preloading required sheets
  const assetsToLoad = {
    cover: "../../assets/animal-auto-squad-cover.webp",
    bg: "../../assets/animal-auto-squad-bg.webp",
    enemies: "../../assets/animal-auto-squad-enemies.webp",
    items: "../../assets/animal-auto-squad-items.webp",
    fxV2: "../../assets/animal-auto-squad-fx-v2.webp",
    sparkFox: "../../assets/weightplay-character-spark-paw-fox-cutout.webp",
    bubbleOtter: "../../assets/weightplay-character-bubble-fin-otter-cutout.webp",
    drumPanda: "../../assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp",
    moonOwl: "../../assets/weightplay-character-moon-cap-owl-cutout.webp",
    mossTurtle: "../../assets/weightplay-character-moss-shell-turtle-cutout.webp",
    rainbowRabbit: "../../assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp",
    gearRhino: "../../assets/weightplay-character-gear-horn-rhino-cutout.webp",
    boomLion: "../../assets/weightplay-character-boom-mane-lion-cutout.webp",
    sparkCaptain: "../../assets/weightplay-character-spark-paw-captain-cutout.webp",
    rhinoGuardian: "../../assets/weightplay-character-rhino-guardian-cutout.webp",
    enemyFoxScout: "../../assets/animal-gearpack-expedition-enemy-fox-scout.webp",
    enemyCrystalCrow: "../../assets/animal-gearpack-expedition-enemy-crystal-crow.webp",
    enemyArmoredBoar: "../../assets/animal-gearpack-expedition-enemy-armored-boar.webp",
    enemyRootGuardian: "../../assets/animal-gearpack-expedition-enemy-root-guardian.webp",
    enemyShadowBasic: "../../assets/animal-crystal-survivor-shadow-basic.webp",
    enemyShadowRunner: "../../assets/animal-crystal-survivor-shadow-runner.webp",
    enemyShadowTank: "../../assets/animal-crystal-survivor-shadow-tank.webp",
    enemyShadowPanther: "../../assets/animal-crystal-survivor-shadow-panther-v2.webp",
    enemyRuneWolf: "../../assets/animal-rune-tactics-enemy-wolf.webp",
    enemyRuneRaven: "../../assets/animal-rune-tactics-enemy-raven.webp",
    enemyEclipseBat: "../../assets/shadow-wolf-enemy-bat-cutout.webp",
    enemyShadowJaguar: "../../assets/animal-relic-hunters-shadow-jaguar.webp",
    bossThornwood: "../../assets/animal-auto-squad-boss-thornwood-alpha.webp",
    bossPrism: "../../assets/animal-auto-squad-boss-prism-basilisk.webp",
    bossAbyss: "../../assets/animal-auto-squad-boss-abyss-shell-leviathan.webp",
    bossMagma: "../../assets/animal-auto-squad-boss-magma-tusk-colossus.webp",
    bossEclipse: "../../assets/animal-auto-squad-boss-eclipse-archowl.webp",
    bossVoid: "../../assets/animal-auto-squad-boss-void-crown-emperor.webp",
    foodApple: "assets/food-apple.svg",
    foodHoney: "assets/food-honey.svg",
    foodMelon: "assets/food-melon.svg",
    foodChocolate: "assets/food-chocolate.svg"
  };

  let loadedCount = 0;
  let assetsReady = false;
  let appStarted = false;
  let preloadStarted = false;
  const totalAssets = Object.keys(assetsToLoad).length;

  function updateLoadingProgress() {
    const pct = Math.floor((loadedCount / totalAssets) * 100);
    nodes.loadingFill.style.width = pct + "%";
    nodes.loadingText.textContent = pct + "%";
  }

  function preloadAssets(onDone = () => {}) {
    if (assetsReady) {
      onDone();
      return;
    }
    loadedCount = 0;
    updateLoadingProgress();
    for (const [key, src] of Object.entries(assetsToLoad)) {
      const img = new Image();
      img.decoding = "async";
      const completeAsset = () => {
        loadedCount++;
        updateLoadingProgress();
        if (loadedCount === totalAssets) {
          assetsReady = true;
          nodes.loadingPanel.classList.add("is-hidden");
          window.__ANIMAL_AUTO_SQUAD_READY__ = true;
          onDone();
        }
      };
      img.onload = () => {
        imageCache[key] = img;
        completeAsset();
      };
      img.onerror = () => {
        console.error("Failed to load asset:", src);
        completeAsset();
      };
      img.src = src;
    }
  }

  function scheduleAssetPreload() {
    if (preloadStarted) return;
    preloadStarted = true;

    const startPreload = () => preloadAssets();
    if (window.location.search.includes("smoke=first-screen")) {
      window.setTimeout(startPreload, 1200);
      return;
    }
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(startPreload, { timeout: 1800 });
      return;
    }
    window.setTimeout(startPreload, 800);
  }

  function startApp() {
    if (appStarted) return;
    appStarted = true;
    setupEvents();
    setLocale(locale);
    renderMenu();
    nodes.loadingPanel.classList.add("is-hidden");
    installTestApi();
    window.__ANIMAL_AUTO_SQUAD_BOOTED__ = true;
    window.__ANIMAL_AUTO_SQUAD_FIRST_SCREEN__ = {
      booted: true,
      title: document.title,
      language: locale,
      startText: nodes.showStageBtn.textContent.trim(),
      loadingHidden: nodes.loadingPanel.classList.contains("is-hidden"),
      menuHidden: nodes.menuPanel.classList.contains("is-hidden")
    };
    scheduleAssetPreload();
  }

  // Render Functions
  function pinMainSoundToggle() {
    if (document.body.classList.contains("squad-stage-select") || document.body.classList.contains("squad-active")) return;
    const soundToggle = document.querySelector(".sound-toggle");
    if (soundToggle) {
      const viewportWidth = window.visualViewport?.width || window.innerWidth;
      const mainLeft = Math.max(28, (viewportWidth - 920) / 2 + 32);
      soundToggle.style.setProperty("inset", `108px auto auto ${mainLeft}px`, "important");
    }
  }

  function renderMenu() {
    closeQuitDecision(false);
    stopCombatSession();
    setResultOwnership(false);
    selectedSlot = null;
    state.activeRun = false;
    document.body.classList.remove("squad-active");
    document.body.classList.remove("squad-stage-select");
    save = loadSave();
    nodes.menuPanel.classList.remove("is-hidden");
    nodes.stagePanel.classList.add("is-hidden");
    nodes.gamePanel.classList.add("is-hidden");
    nodes.gamePanel.classList.remove("is-result");
    nodes.resultPanel.classList.add("is-hidden");
    nodes.combatSummary?.classList.add("is-hidden");
    setStageTab("stages");
    nodes.bestRoundsText.textContent = `${save.unlockedStage}/${STAGE_COUNT}`;
    if (nodes.clearedRunsText) nodes.clearedRunsText.textContent = String(save.completedStages.length);
    if (nodes.teamLevelText) {
      nodes.teamLevelText.textContent = formatTeamLevel();
    }
    if (nodes.teamBonusText) {
      nodes.teamBonusText.innerHTML = formatTeamBonusNote();
    }
    pinMainSoundToggle();
    window.setTimeout(pinMainSoundToggle, 120);
    updateWalletUI();
    renderStageSelector();
    renderTrainingRoster();
    updatePageMeta();
  }

  function showStageSelection() {
    closeQuitDecision(false);
    stopCombatSession();
    setResultOwnership(false);
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("squad-active");
    document.body.classList.add("squad-stage-select");
    nodes.menuPanel.classList.add("is-hidden");
    nodes.stagePanel.classList.remove("is-hidden");
    nodes.gamePanel.classList.add("is-hidden");
    nodes.gamePanel.classList.remove("is-result");
    nodes.resultPanel.classList.add("is-hidden");
    save = loadSave();
    setStageTab("stages");
    renderStageSelector();
    requestAnimationFrame(() => {
      nodes.stageRail.querySelector(".stage-card.is-selected:not([aria-disabled='true'])")?.focus({ preventScroll: true });
    });
  }

  const TRAINING_STAGE_STYLE_PROPERTIES = [
    "position", "inset", "top", "right", "bottom", "left", "box-sizing",
    "width", "min-width", "max-width", "height", "min-height", "max-height",
    "margin", "overflow", "transform", "transform-origin",
  ];
  const TRAINING_RESERVE_STYLE_PROPERTIES = [
    "position", "inset", "top", "right", "bottom", "left", "width",
    "min-width", "max-width", "height", "min-height", "transform",
  ];

  function trainingStageReserve() {
    let reserve = document.querySelector(".wp-stage-physical-reserve");
    if (!reserve) {
      reserve = document.createElement("div");
      reserve.className = "wp-stage-physical-reserve";
      reserve.setAttribute("aria-hidden", "true");
      document.body.appendChild(reserve);
    }
    return reserve;
  }

  function clearTrainingStageCanvas() {
    if (nodes.stagePanel?.getAttribute("data-auto-squad-training-canvas") === "true") {
      TRAINING_STAGE_STYLE_PROPERTIES.forEach((property) => nodes.stagePanel.style.removeProperty(property));
      nodes.stagePanel.removeAttribute("data-auto-squad-training-canvas");
      nodes.stagePanel.removeAttribute("data-wp-logical-stage-canvas");
    }
    const reserve = document.querySelector(".wp-stage-physical-reserve[data-auto-squad-training-reserve]");
    if (reserve) {
      TRAINING_RESERVE_STYLE_PROPERTIES.forEach((property) => reserve.style.removeProperty(property));
      reserve.removeAttribute("data-auto-squad-training-reserve");
    }
  }

  function updateTrainingStageCanvas() {
    const active = document.body.classList.contains("squad-stage-select")
      && nodes.trainingPane?.classList.contains("is-active")
      && !nodes.stagePanel?.classList.contains("is-hidden");
    if (!active) return;

    const viewport = window.visualViewport;
    const width = Math.max(1, viewport?.width || window.innerWidth);
    const height = Math.max(1, viewport?.height || window.innerHeight);
    const physicalWidth = Math.min(width, 920);
    const availableHeight = Math.max(1, height - 56);
    const scale = Math.max(0.01, Math.min(physicalWidth / 390, availableHeight / 788));
    const logicalWidth = physicalWidth / scale;
    const logicalHeight = availableHeight / scale;
    const canvasLeft = Math.max(0, (width - physicalWidth) / 2);
    const panelDeclarations = {
      position: "fixed", inset: "auto", top: "0px", right: "auto", bottom: "auto", left: `${canvasLeft}px`,
      "box-sizing": "border-box", width: `${logicalWidth}px`, "min-width": `${logicalWidth}px`, "max-width": `${logicalWidth}px`,
      height: `${logicalHeight}px`, "min-height": `${logicalHeight}px`, "max-height": `${logicalHeight}px`, margin: "0", overflow: "hidden",
      transform: `scale(${scale})`, "transform-origin": "top left",
    };
    Object.entries(panelDeclarations).forEach(([property, value]) => nodes.stagePanel.style.setProperty(property, value, "important"));
    nodes.stagePanel.setAttribute("data-auto-squad-training-canvas", "true");
    nodes.stagePanel.setAttribute("data-wp-logical-stage-canvas", `${logicalWidth.toFixed(3)}x${logicalHeight.toFixed(3)}`);

    const reserve = trainingStageReserve();
    const reserveDeclarations = {
      position: "fixed", inset: "auto", top: `${availableHeight}px`, right: "auto", bottom: "auto", left: "0px",
      width: `${width}px`, "min-width": "0", "max-width": "none", height: "56px", "min-height": "56px", transform: "none",
    };
    Object.entries(reserveDeclarations).forEach(([property, value]) => reserve.style.setProperty(property, value, "important"));
    reserve.setAttribute("data-auto-squad-training-reserve", "true");
  }

  function setStageTab(tab) {
    const training = tab === "training";
    if (!training) {
      clearSkinPurchaseDecision();
      clearTrainingStageCanvas();
    }
    nodes.stageTabBtn?.classList.toggle("is-active", !training);
    nodes.trainingTabBtn?.classList.toggle("is-active", training);
    nodes.stageTabBtn?.setAttribute("aria-selected", String(!training));
    nodes.trainingTabBtn?.setAttribute("aria-selected", String(training));
    nodes.stageTabBtn?.setAttribute("tabindex", training ? "-1" : "0");
    nodes.trainingTabBtn?.setAttribute("tabindex", training ? "0" : "-1");
    nodes.stageSelectPane?.classList.toggle("is-active", !training);
    nodes.trainingPane?.classList.toggle("is-active", training);
    if (nodes.stageSelectPane) nodes.stageSelectPane.hidden = training;
    if (nodes.trainingPane) nodes.trainingPane.hidden = !training;
    if (training) {
      renderTrainingRoster();
      requestAnimationFrame(() => requestAnimationFrame(updateTrainingStageCanvas));
    } else {
      requestAnimationFrame(() => renderStageSelector(true));
    }
  }

  function handleStageTabKeydown(event) {
    const tabs = [nodes.stageTabBtn, nodes.trainingTabBtn].filter(Boolean);
    const currentIndex = tabs.indexOf(event.currentTarget);
    if (currentIndex < 0 || tabs.length < 2) return;

    let targetIndex = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      targetIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = tabs.length - 1;
    }
    if (targetIndex === null) return;

    event.preventDefault();
    const target = tabs[targetIndex];
    setStageTab(target === nodes.trainingTabBtn ? "training" : "stages");
    target.focus({ preventScroll: true });
  }

  function stageLabel(stage) {
    return locale === "zh-Hant" ? `\u7b2c ${stage} \u95dc` : locale === "es" ? `Nivel ${stage}` : locale === "ja" ? `ステージ ${stage}` : `Stage ${stage}`;
  }

  function stageDefinition(stageValue) {
    const safeStage = Math.max(1, Math.min(STAGE_COUNT, Number(stageValue) || 1));
    return STAGE_DEFINITIONS[safeStage - 1];
  }

  function regionDefinition(regionValue) {
    return REGION_METADATA.find((region) => region.id === Number(regionValue)) || REGION_METADATA[0];
  }

  function selectStage(stage, shouldScroll = true) {
    save = normalizeSave(save);
    save.selectedStage = Math.max(1, Math.min(save.unlockedStage, Number(stage) || 1));
    saveSave();
    renderStageSelector(shouldScroll);
  }

  function renderStageSelector(shouldScroll = true) {
    if (!nodes.stageRail) return;
    const renderVersion = ++stageRenderVersion;
    save = normalizeSave(save);
    nodes.stageSelectTitle.textContent = t("chooseStage");
    nodes.stageProgressText.textContent = t("stageProgress", { unlocked: save.unlockedStage, total: STAGE_COUNT });
    nodes.stageSetupText.textContent = t("stageSetup");
    nodes.stageRail.innerHTML = "";

    for (let stage = 1; stage <= STAGE_COUNT; stage++) {
      const definition = stageDefinition(stage);
      const region = regionDefinition(definition.region);
      const locked = stage > save.unlockedStage;
      const cleared = save.completedStages.includes(stage);
      const card = document.createElement("button");
      card.type = "button";
      card.className = `stage-card${stage === save.selectedStage ? " is-selected is-browsed" : ""}${cleared ? " is-cleared" : ""}${definition.bossId ? " is-boss-stage" : ""}`;
      card.dataset.stage = String(stage);
      card.dataset.region = String(definition.region);
      card.dataset.boss = definition.bossId ? "true" : "false";
      card.style.setProperty("--stage-overlay", region.overlay);
      // Keep locked cards draggable as part of the horizontal rail.
      card.setAttribute("aria-disabled", String(locked));
      card.tabIndex = stage === save.selectedStage ? 0 : -1;
      const firstWave = enemyWaveStats(stage, 1);
      const finalWave = enemyWaveStats(stage, WAVES_PER_STAGE);
      const enemyRange = t("stageEnemyRange", { first: firstWave.count, last: finalWave.count });
      const stageName = localizedField(definition, "name");
      const regionName = localizedField(region, "name");
      const bossText = definition.bossId ? ` \u00b7 ${t("stageBoss")}` : "";
      card.innerHTML = `<em>${regionName}</em><strong>${stageLabel(stage)}</strong><span>${stageName}</span><small>${t("stageWaveCount", { count: WAVES_PER_STAGE })}${bossText}</small><small>${enemyRange}</small><small>${locked ? t("stageLocked") : cleared ? t("stageCleared") : t("stageReady")}</small>`;
      card.setAttribute("aria-label", `${regionName}. ${stageLabel(stage)}. ${stageName}. ${t("stageWaveCount", { count: WAVES_PER_STAGE })}${bossText}. ${enemyRange}. ${locked ? t("stageLocked") : cleared ? t("stageCleared") : t("stageReady")}`);
      card.addEventListener("click", () => {
        if (locked) {
          setBrowsedStageOwner(card);
          card.scrollIntoView({ block: "nearest", inline: "center" });
          return;
        }
        selectStage(stage, false);
        startExpedition();
      });
      nodes.stageRail.appendChild(card);
    }

    if (shouldScroll) {
      requestAnimationFrame(() => {
        if (renderVersion !== stageRenderVersion) return;
        nodes.stageRail.querySelector(".stage-card.is-selected")?.scrollIntoView({ block: "nearest", inline: "center" });
        requestAnimationFrame(updateBrowsedStageCard);
      });
    }
  }

  function updateBrowsedStageCard() {
    const rail = nodes.stageRail;
    if (!rail || !rail.getClientRects().length) return;
    const cards = [...rail.querySelectorAll(".stage-card")];
    if (!cards.length) return;
    const railRect = rail.getBoundingClientRect();
    const railCenter = railRect.left + railRect.width / 2;
    let nearest = cards[0];
    let nearestDistance = Infinity;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
      if (distance < nearestDistance) {
        nearest = card;
        nearestDistance = distance;
      }
    });
    const focusedCard = document.activeElement?.closest?.(".stage-card");
    setBrowsedStageOwner(nearest);
    if (focusedCard && focusedCard !== nearest && rail.contains(focusedCard)) {
      nearest.focus({ preventScroll: true });
    }
  }

  function setBrowsedStageOwner(owner) {
    if (!nodes.stageRail || !owner) return;
    [...nodes.stageRail.querySelectorAll(".stage-card")].forEach((card) => {
      const browsed = card === owner;
      card.classList.toggle("is-browsed", browsed);
      card.tabIndex = browsed ? 0 : -1;
      if (browsed) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
  }

  function centerStageCard(owner) {
    const rail = nodes.stageRail;
    if (!rail || !owner || !rail.contains(owner)) return;
    const previousSnapType = rail.style.scrollSnapType;
    const previousScrollBehavior = rail.style.scrollBehavior;
    rail.style.scrollSnapType = "none";
    rail.style.scrollBehavior = "auto";
    const reconcile = () => {
      if (!rail.contains(owner)) return;
      const railRect = rail.getBoundingClientRect();
      const ownerRect = owner.getBoundingClientRect();
      const centerDelta = ownerRect.left + ownerRect.width / 2
        - (railRect.left + railRect.width / 2);
      const canvasScale = owner.offsetWidth ? ownerRect.width / owner.offsetWidth : 1;
      if (Math.abs(centerDelta) > 0.5) rail.scrollLeft += centerDelta / Math.max(canvasScale, 0.01);
    };
    reconcile();
    requestAnimationFrame(() => {
      reconcile();
      rail.style.scrollSnapType = previousSnapType;
      rail.style.scrollBehavior = previousScrollBehavior;
    });
  }

  function handleStageCardKeydown(event) {
    const card = event.target.closest(".stage-card");
    if (!card || !nodes.stageRail?.contains(card)) return;
    const cards = [...nodes.stageRail.querySelectorAll(".stage-card")];
    const currentIndex = cards.indexOf(card);
    if (currentIndex < 0) return;

    const rtl = getComputedStyle(nodes.stageRail).direction === "rtl"
      || document.documentElement.dir === "rtl";
    let targetIndex = null;
    if (event.key === "ArrowRight") targetIndex = currentIndex + (rtl ? -1 : 1);
    else if (event.key === "ArrowLeft") targetIndex = currentIndex + (rtl ? 1 : -1);
    else if (event.key === "Home") targetIndex = 0;
    else if (event.key === "End") targetIndex = cards.length - 1;
    if (targetIndex === null) return;

    event.preventDefault();
    const target = cards[Math.max(0, Math.min(cards.length - 1, targetIndex))];
    setBrowsedStageOwner(target);
    centerStageCard(target);
    target.focus({ preventScroll: true });
  }

  function scheduleStageBrowseUpdate() {
    if (stageBrowseFrame) return;
    stageBrowseFrame = requestAnimationFrame(() => {
      stageBrowseFrame = 0;
      updateBrowsedStageCard();
    });
  }

  function renderCosmeticSection() {
    if (save.unlockedSkin) {
      nodes.buySkinBtn.classList.add("is-hidden");
      nodes.equipSkinBtn.classList.remove("is-hidden");
      if (save.selectedSkin === "golden") {
        nodes.equipSkinBtn.textContent = t("unequipSkin");
        nodes.equipSkinBtn.className = "secondary-btn skin-equipped";
      } else {
        nodes.equipSkinBtn.textContent = t("equipSkin");
        nodes.equipSkinBtn.className = "primary-btn";
      }
    } else {
      nodes.buySkinBtn.classList.remove("is-hidden");
      const balance = getWalletDiamonds();
      if (skinPurchasePending) {
        const decision = t("skinPurchaseDecision", { before: balance, after: Math.max(0, balance - 15) });
        nodes.buySkinBtn.textContent = decision;
        nodes.buySkinBtn.setAttribute("aria-label", decision);
      } else if (skinPurchaseNoticePending) {
        const message = t("skinPurchaseNeed", { balance });
        nodes.buySkinBtn.textContent = message;
        nodes.buySkinBtn.setAttribute("aria-label", message);
      } else {
        nodes.buySkinBtn.innerHTML = currencyMarkup("diamond", 15, t("currencyUnlock"));
        nodes.buySkinBtn.setAttribute("aria-label", t("buySkin"));
      }
      nodes.equipSkinBtn.classList.add("is-hidden");
    }
  }

  function clearSkinPurchaseDecision() {
    skinPurchasePending = false;
    skinPurchaseNoticePending = false;
    clearTimeout(skinPurchaseTimer);
    skinPurchaseTimer = 0;
    skinPurchaseDueAt = 0;
    skinPurchaseRemaining = 0;
  }

  function expireSkinPurchaseDecision() {
    clearSkinPurchaseDecision();
    renderCosmeticSection();
  }

  function armSkinPurchaseDecision(delay = 5000) {
    clearTimeout(skinPurchaseTimer);
    skinPurchaseRemaining = Math.max(0, delay);
    skinPurchaseDueAt = Date.now() + skinPurchaseRemaining;
    if (document.hidden || !windowFocused) return;
    skinPurchaseTimer = window.setTimeout(expireSkinPurchaseDecision, skinPurchaseRemaining);
  }

  function suspendSkinPurchaseDecision() {
    if ((!skinPurchasePending && !skinPurchaseNoticePending) || !skinPurchaseTimer) return;
    skinPurchaseRemaining = Math.max(0, skinPurchaseDueAt - Date.now());
    clearTimeout(skinPurchaseTimer);
    skinPurchaseTimer = 0;
    skinPurchaseDueAt = 0;
  }

  function resumeSkinPurchaseDecision() {
    if ((!skinPurchasePending && !skinPurchaseNoticePending) || skinPurchaseTimer || document.hidden || !windowFocused) return;
    if (skinPurchaseRemaining <= 0) {
      expireSkinPurchaseDecision();
      return;
    }
    armSkinPurchaseDecision(skinPurchaseRemaining);
  }

  function handleBuySkin() {
    initAudio();
    const balance = getWalletDiamonds();
    if (!skinPurchasePending) {
      if (balance < 15) {
        clearSkinPurchaseDecision();
        skinPurchaseNoticePending = true;
        armSkinPurchaseDecision();
        renderCosmeticSection();
        playSynth("click");
        return;
      }
      clearSkinPurchaseDecision();
      skinPurchasePending = true;
      armSkinPurchaseDecision();
      renderCosmeticSection();
      nodes.buySkinBtn.focus({ preventScroll: true });
      playSynth("click");
      return;
    }
    clearSkinPurchaseDecision();
    if (balance < 15) {
      renderCosmeticSection();
      return;
    }
    if (spendWalletDiamonds(15)) {
      save.unlockedSkin = true;
      save.selectedSkin = "golden";
      saveSave();
      playSynth("win");
      renderCosmeticSection();
      window.WonderAnalytics?.track("cosmetic_skin_purchase", { game_id: GAME_ID, cost: 15 });
    }
  }

  function handleEquipSkin() {
    initAudio();
    save.selectedSkin = save.selectedSkin === "golden" ? "normal" : "golden";
    saveSave();
    playSynth("click");
    renderCosmeticSection();
  }

  function renderTrainingRoster(focusAnimalId = null) {
    if (!nodes.trainingRoster || !nodes.trainingGoldText) return;
    save = normalizeSave(save);
    nodes.trainingGoldText.innerHTML = currencyMarkup("gold", save.coins);
    nodes.trainingGoldText.setAttribute("aria-label", `${save.coins} ${t("gold")}`);
    nodes.trainingRoster.innerHTML = "";

    const hint = document.createElement("p");
    hint.className = "training-hint";
    hint.textContent = t("rosterHint");
    nodes.trainingRoster.appendChild(hint);

    ANIMAL_METADATA.forEach((animal) => {
      const unlocked = isAnimalUnlocked(animal.id);
      const level = animalPermanentLevel(animal.id);
      const premium = isPremiumAnimal(animal.id);
      const card = document.createElement("article");
      card.className = `training-card${unlocked ? " is-owned" : " is-locked"}${premium ? " is-premium" : ""}`;
      const name = localizedField(animal, "name");
      const status = STARTER_ANIMAL_IDS.includes(animal.id)
        ? t("freeUnit")
        : premium
          ? t("premium")
          : unlocked
            ? t("owned")
            : t("locked");
      const statBoost = Math.max(0, level - 1) * (premium ? 2 : 1);
      const statStep = premium ? 2 : 1;
      const currentAtk = animal.atk + statBoost;
      const currentHp = animal.hp + statBoost;
      const statText = unlocked && level < 20
        ? t("trainingStatsNext", { atk: currentAtk, hp: currentHp, nextAtk: currentAtk + statStep, nextHp: currentHp + statStep })
        : t("trainingStatsCurrent", { atk: currentAtk, hp: currentHp });
      card.innerHTML = `
        <div class="training-art" style="background-image:url('${assetsToLoad[animal.imageKey] || assetsToLoad.boomLion}')"></div>
        <div class="training-copy">
          <strong>${name}</strong>
          <span>${status} · ${t("level")}${level}</span>
          <small>${statText}</small>
        </div>
      `;

      const action = document.createElement("button");
      action.type = "button";
      action.dataset.animalId = String(animal.id);
      action.className = unlocked ? "training-action upgrade-action" : "training-action unlock-action";
      action.addEventListener("keydown", (event) => {
        if (event.repeat && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
      if (unlocked) {
        if (level >= 20) {
          action.textContent = t("maxLevel");
          action.disabled = true;
          action.setAttribute("aria-label", `${name}: ${t("maxLevel")}`);
        } else {
          const cost = animalUpgradeCost(animal.id);
          action.innerHTML = currencyMarkup("gold", cost, t("currencyUpgrade"));
          action.disabled = save.coins < cost;
          action.setAttribute("aria-label", t("trainingUpgradeLabel", {
            name,
            level: level + 1,
            nextAtk: currentAtk + statStep,
            nextHp: currentHp + statStep,
            cost,
          }));
          action.addEventListener("click", () => handleUpgradeAnimal(animal.id));
        }
      } else if (premium) {
        const cost = premiumUnlockCost(animal.id);
        action.innerHTML = currencyMarkup("diamond", cost, t("currencyUnlock"));
        action.setAttribute("aria-label", `${name}: ${t("unlockDiamond", { cost })}`);
        action.disabled = getWalletDiamonds() < cost;
        action.addEventListener("click", () => handleUnlockAnimal(animal.id));
      } else {
        const cost = animalUnlockCost(animal.id);
        action.innerHTML = currencyMarkup("gold", cost, t("currencyUnlock"));
        action.setAttribute("aria-label", `${name}: ${t("unlockGold", { cost })}`);
        action.disabled = save.coins < cost;
        action.addEventListener("click", () => handleUnlockAnimal(animal.id));
      }
      if (!action.hasAttribute("aria-label")) action.setAttribute("aria-label", `${name}: ${action.textContent}`);
      card.appendChild(action);
      nodes.trainingRoster.appendChild(card);
    });

    if (focusAnimalId !== null) {
      const preferred = nodes.trainingRoster.querySelector(`button[data-animal-id="${focusAnimalId}"]:not(:disabled)`);
      const fallback = nodes.trainingRoster.querySelector("button:not(:disabled)") || nodes.trainingTabBtn;
      (preferred || fallback)?.focus({ preventScroll: true });
    }
  }

  function handleUnlockAnimal(id) {
    initAudio();
    clearActionNotice(nodes.stageNotice);
    save = normalizeSave(save);
    if (isAnimalUnlocked(id)) return;
    if (isPremiumAnimal(id)) {
      const cost = premiumUnlockCost(id);
      if (!spendWalletDiamonds(cost)) {
        showActionNotice(nodes.stageNotice, t("noDiamonds"), document.activeElement);
        playSynth("click");
        return;
      }
    } else {
      const cost = animalUnlockCost(id);
      if (save.coins < cost) {
        showActionNotice(nodes.stageNotice, t("noGold"), document.activeElement);
        playSynth("click");
        return;
      }
      save.coins -= cost;
    }
    save.unlockedAnimals = [...new Set([...save.unlockedAnimals, Number(id)])].sort((a, b) => a - b);
    saveSave();
    playSynth("buy");
    renderTrainingRoster(id);
  }

  function handleUpgradeAnimal(id) {
    initAudio();
    clearActionNotice(nodes.stageNotice);
    save = normalizeSave(save);
    if (!isAnimalUnlocked(id)) return;
    const currentLevel = animalPermanentLevel(id);
    if (currentLevel >= 20) return;
    const cost = animalUpgradeCost(id);
    if (save.coins < cost) {
      showActionNotice(nodes.stageNotice, t("noGold"), document.activeElement);
      playSynth("click");
      return;
    }
    save.coins -= cost;
    save.animalLevels[id] = currentLevel + 1;
    saveSave();
    playSynth("combine");
    renderTrainingRoster(id);
  }

  // Language Setup
  function setLocale(next) {
    const current = window.WonderI18n?.actualLocale?.();
    const requested = next === "zh-Hant" && current === "zh-Hans" ? current : next || "en";
    if (current !== requested) window.WonderI18n?.setLocale?.(requested);
    locale = window.WonderI18n?.legacyLocale?.(requested) || requested;
    writeStorage(localeKey, requested);
    document.documentElement.lang = requested;
    translateUI();
    updatePageMeta();
  }

  function translateUI() {
    clearAllActionNotices();
    // Top headings
    nodes.mainGameTitle.textContent = t("title");
    const actualLocale = window.WonderI18n?.actualLocale?.() || locale;
    nodes.localeSelect.value = [...nodes.localeSelect.options].some((option) => option.value === actualLocale)
      ? actualLocale
      : locale;
    const languageLabel = document.querySelector(".locale > span");
    if (languageLabel) languageLabel.textContent = t("language");
    nodes.backToLobbyBtn.setAttribute("aria-label", t("backToLobby"));
    nodes.localeSelect.setAttribute("aria-label", t("languageSelection"));
    nodes.stageBackBtn.setAttribute("aria-label", t("back"));
    if (nodes.stageTabBtn) nodes.stageTabBtn.querySelector("span").textContent = t("stageTab");
    if (nodes.trainingTabBtn) nodes.trainingTabBtn.querySelector("span").textContent = t("trainingTab");
    document.querySelector(".stage-tabs")?.setAttribute("aria-label", `${t("stageTab")} / ${t("trainingTab")}`);
    if ($("stageSwipeText")) $("stageSwipeText").textContent = t("stageSwipe");
    if ($("stageDeployText")) $("stageDeployText").textContent = t("stageDeploy");
    nodes.stageRail.setAttribute("aria-label", t("stageSelection"));
    nodes.squadGrid.setAttribute("aria-label", t("activeSquadSlots"));
    nodes.shopRow.setAttribute("aria-label", t("shopShelfItems"));
    nodes.gameCanvas.dataset.runtimeLocalize = "off";
    nodes.gameCanvas.setAttribute("aria-label", t("battleArena"));
    nodes.quitRunBtn.textContent = "\u2190";
    nodes.quitRunBtn.setAttribute("aria-label", t("quitRun"));
    $("quitRunTitle").textContent = t("quitRunTitle");
    $("quitRunText").textContent = t("quitConfirm", { stage: state.stage, round: state.round, hearts: state.hearts, supplies: state.gold });
    nodes.keepPlayingBtn.textContent = t("keepPlaying");
    nodes.confirmQuitBtn.textContent = t("confirmQuit");
    
    // Menu elements
    $("menuHeadingText").textContent = t("menuTitle");
    $("menuSubText").textContent = t("menuHint");
    nodes.showStageBtn.textContent = t("chooseExpedition");
    $("bestRoundsText").previousElementSibling.textContent = t("bestExpedition");
    if ($("clearedRunsText")?.previousElementSibling) $("clearedRunsText").previousElementSibling.textContent = t("expeditionsCleared");
    nodes.bestRoundsText.textContent = `${save.unlockedStage}/${STAGE_COUNT}`;
    if (nodes.teamLevelText?.previousElementSibling) {
      nodes.teamLevelText.previousElementSibling.textContent = locale === "zh-Hant" ? "\u5718\u968a\u7b49\u7d1a" : t("teamLevel");
    }
    if (nodes.teamLevelText) nodes.teamLevelText.textContent = formatTeamLevel();
    $("diamondText").previousElementSibling.textContent = t("diamonds");
    document.querySelector(".cosmetic-store .store-label").textContent = t("buySkin");
    if (nodes.trainingTitleText) nodes.trainingTitleText.textContent = t("trainingTitle");

    // HUD labels
    nodes.stageHudLabel.textContent = t("stage");
    nodes.roundText.previousElementSibling.textContent = t("round");
    nodes.goldText.previousElementSibling.textContent = t("supplies");
    nodes.heartText.previousElementSibling.textContent = t("hearts");
    nodes.relicText.previousElementSibling.textContent = t("activeRelic");
    if (!state.relic) nodes.relicText.textContent = t("none");

    // Prep labels
    document.querySelector(".squad-section h3").textContent = t("yourSquadLabel");
    const benchHeading = document.querySelector(".bench-section h3");
    if (benchHeading) benchHeading.textContent = t("benchLabel");
    document.querySelector(".shop-section h3").textContent = t("shopLabel");
    nodes.startBattleBtn.textContent = t("startBattle");
    nodes.hintText.textContent = t("guideHint");
    renderFoodGuide();
    if (state.activeRun && !nodes.prepPhaseArea.classList.contains("is-hidden")) {
      const focusedCard = document.activeElement?.closest?.(".card-item");
      const focusTarget = focusedCard?.dataset?.area !== undefined && focusedCard?.dataset?.slot !== undefined
        ? { area: focusedCard.dataset.area, index: Number(focusedCard.dataset.slot) }
        : null;
      renderPrepScreen(focusTarget);
    }

    nodes.rerollShopBtn.classList.add("is-hidden");

    // Relic Modal labels
    document.querySelector("#relicDraftPanel h2").textContent = t("chooseRelic");
    document.querySelector("#relicDraftPanel .status-line").textContent = t("relicDesc");
    updateRelicRerollDecision();

    // Defeat Modal labels
    document.querySelector("#defeatRevivePanel h2").textContent = t("defeatTitle");
    document.querySelector("#defeatRevivePanel .status-line").textContent = t("reviveHint");
    nodes.reviveBtn.textContent = t("reviveAction");
    nodes.giveUpBtn.textContent = t("giveUp");

    // Result labels
    nodes.resultTitle.textContent = state.hearts > 0 ? t("expeditionClear") : t("expeditionFail");
    nodes.retryBtn.textContent = t("retry");
    nodes.nextStageBtn.textContent = t("nextStage");
    nodes.resultMenuBtn.textContent = t("backToStages");

    renderCosmeticSection();
    if (!nodes.stagePanel.classList.contains("is-hidden")) renderStageSelector(false);
    renderTrainingRoster();
  }

  // Start Expedition Run
  function startExpedition() {
    initAudio();
    playSynth("click");
    setResultOwnership(false);
    state = makeState();
    state.stage = normalizeSave(save).selectedStage;
    state.backpack = createBackpackCards();
    restoreSavedFormation();
    state.activeRun = true;
    document.body.classList.add("squad-active");
    document.body.classList.remove("squad-stage-select");
    nodes.menuPanel.classList.add("is-hidden");
    nodes.stagePanel.classList.add("is-hidden");
    nodes.gamePanel.classList.remove("is-hidden");
    nodes.gamePanel.classList.remove("is-result");
    nodes.prepPhaseArea.classList.remove("is-hidden");
    nodes.combatArea.classList.add("is-hidden");
    nodes.defeatRevivePanel.classList.add("is-hidden");

    // Initial Relic draft
    openRelicDraft();
    window.WonderAnalytics?.track("expedition_start", { game_id: GAME_ID, stage: state.stage });
  }

  function openRelicDraft() {
    nodes.relicDraftPanel.classList.remove("is-hidden");
    renderRelicChoices();
    setBattleDecisionOwnership(nodes.relicDraftPanel, true);
    requestAnimationFrame(() => nodes.relicChoices.querySelector(".relic-card")?.focus({ preventScroll: true }));
  }

  function updateRelicRerollDecision() {
    const before = getWalletDiamonds();
    nodes.rerollRelicsBtn.setAttribute("aria-label", before >= 3
      ? t("relicRerollDecision", { before, after: before - 3 })
      : t("relicRerollNeed", { balance: before }));
  }

  function relicChoiceSignature() {
    return [...nodes.relicChoices.querySelectorAll(".relic-card")]
      .map((card) => Number(card.dataset.relicId))
      .sort((a, b) => a - b)
      .join(",");
  }

  function renderRelicChoices(avoidSignature = "") {
    clearActionNotice(nodes.relicDraftNotice);
    nodes.relicChoices.innerHTML = "";
    const pairs = [];
    for (let first = 0; first < RELIC_METADATA.length; first += 1) {
      for (let second = first + 1; second < RELIC_METADATA.length; second += 1) {
        pairs.push([RELIC_METADATA[first], RELIC_METADATA[second]]);
      }
    }
    const eligible = pairs.filter((pair) => pair.map((relic) => relic.id).sort((a, b) => a - b).join(",") !== avoidSignature);
    const choices = eligible[Math.floor(Math.random() * eligible.length)] || pairs[0];

    choices.forEach((relic) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "relic-card";
      card.dataset.relicId = String(relic.id);
      card.innerHTML = `
        <div class="relic-icon-art relic-icon-${relic.id}" aria-hidden="true"><span></span></div>
        <h4>${localizedField(relic, "name")}</h4>
        <p>${localizedField(relic, "desc")}</p>
      `;
      card.addEventListener("click", () => {
        selectRelic(relic);
      });
      nodes.relicChoices.appendChild(card);
    });

    nodes.rerollRelicsBtn.textContent = t("relicReroll");
    updateRelicRerollDecision();
    nodes.rerollRelicsBtn.onclick = rerollRelics;
  }

  function selectRelic(relic) {
    state.relic = relic;
    nodes.relicText.textContent = localizedField(relic, "name");
    setBattleDecisionOwnership(nodes.relicDraftPanel, false);
    nodes.relicDraftPanel.classList.add("is-hidden");
    playSynth("buy");

    // First round preparation
    startRoundPrep();
    requestAnimationFrame(focusPreparationOwner);
  }

  function rerollRelics() {
    clearActionNotice(nodes.relicDraftNotice);
    if (getWalletDiamonds() < 3) {
      showActionNotice(nodes.relicDraftNotice, t("noDiamonds"), nodes.rerollRelicsBtn);
      playSynth("click");
      return;
    }
    if (spendWalletDiamonds(3)) {
      playSynth("revive");
      renderRelicChoices(relicChoiceSignature());
      window.WonderAnalytics?.track("relic_reroll", { game_id: GAME_ID, cost: 3 });
    }
  }

  // Round Setup and Shop Drafting
  function startRoundPrep() {
    clearActionNotice(nodes.prepNotice);
    nodes.startBattleBtn.disabled = false;
    nodes.prepPhaseArea.classList.remove("is-hidden");
    nodes.combatArea.classList.add("is-hidden");
    nodes.combatSummary?.classList.add("is-hidden");
    selectedSlot = null;
    state.freeRerollThisRound = state.relic?.id === 3; // Clover leaf gives free first reroll
    state.rerollsUsedThisRound = 0;
    translateUI();
    updateHUD();
    renderPrepScreen();
    resetBackpackScroll();
  }

  let backpackScrollResetFrame = 0;
  function resetBackpackScroll() {
    cancelAnimationFrame(backpackScrollResetFrame);
    nodes.shopRow.scrollTop = 0;
    // Mobile browsers can restore the old scroll anchor after a hidden grid is
    // shown and rebuilt. Reset again after layout so row one cannot remain
    // above the clipped backpack viewport and masquerade as missing cards.
    backpackScrollResetFrame = requestAnimationFrame(() => {
      nodes.shopRow.scrollTop = 0;
      backpackScrollResetFrame = requestAnimationFrame(() => {
        nodes.shopRow.scrollTop = 0;
      });
    });
  }

  function updateHUD() {
    nodes.stageText.textContent = `${state.stage}/${STAGE_COUNT}`;
    nodes.roundText.textContent = `${state.round}/${WAVES_PER_STAGE}`;
    nodes.goldText.textContent = String(state.gold);
    nodes.heartText.textContent = `${state.hearts}/4`;
  }

  function createAnimalCard(id) {
    const source = ANIMAL_METADATA.find((animal) => animal.id === id) || ANIMAL_METADATA[0];
    const permanentLevel = animalPermanentLevel(source.id);
    const statBoost = Math.max(0, permanentLevel - 1) * (isPremiumAnimal(source.id) ? 2 : 1);
    return {
      ...source,
      exp: permanentLevel,
      level: permanentLevel,
      permanentLevel,
      currentAtk: source.atk + statBoost,
      currentHp: source.hp + statBoost,
      maxHp: source.hp + statBoost,
      hasShield: false
    };
  }

  function createBackpackCards() {
    save = normalizeSave(save);
    return save.unlockedAnimals
      .map((id) => createAnimalCard(Number(id)))
      .filter(Boolean);
  }

  function rebuildOwnedBackpack(cards = [], placedCards = []) {
    save = normalizeSave(save);
    const liveCards = [...(Array.isArray(cards) ? cards : []), ...(Array.isArray(placedCards) ? placedCards : [])]
      .filter((card) => card && ANIMAL_METADATA.some((animal) => animal.id === Number(card.id)));
    const cardsById = new Map(liveCards.map((card) => [Number(card.id), card]));

    // The live formation is also ownership evidence. This covers a stale save
    // written by older builds where deployed animals were removed from the
    // backpack array before the owned roster was persisted.
    const ownedIds = [...new Set([
      ...save.unlockedAnimals.map(Number),
      ...liveCards.map((card) => Number(card.id))
    ])].sort((a, b) => a - b);
    if (ownedIds.join(",") !== save.unlockedAnimals.join(",")) {
      save.unlockedAnimals = ownedIds;
      saveSave();
    }
    return ownedIds.map((id) => cardsById.get(id) || createAnimalCard(id));
  }

  function restoreSavedFormation() {
    save = normalizeSave(save);
    const backpackById = new Map(state.backpack.map((card) => [Number(card.id), card]));
    state.squad = save.savedSquad.map((id) => {
      if (id === null) return null;
      return backpackById.get(Number(id)) || null;
    });
    state.backpack = rebuildOwnedBackpack(state.backpack, state.squad.concat(state.bench));
  }

  function findPlacedCard(id) {
    const normalizedId = Number(id);
    for (const area of ["squad", "bench"]) {
      const cards = area === "squad" ? state.squad : state.bench;
      const index = cards.findIndex((card) => Number(card?.id) === normalizedId);
      if (index >= 0) return { area, index };
    }
    return null;
  }

  function saveActiveFormation() {
    if (!state.activeRun) return;
    save = normalizeSave(save);
    save.savedSquad = state.squad.map((card) => (card ? Number(card.id) : null));
    saveSave();
  }

  // Legacy shop generator kept for old saves/tests that still call it directly.
  function generateShop() {
    // Reroll normal items if not frozen
    const tierLimit = Math.min(5, Math.ceil(state.round / 2)); // Tiers 1-5 unlocked as rounds progress
    let animalPool = ANIMAL_METADATA.filter((a) => a.tier <= tierLimit && isAnimalUnlocked(a.id));
    if (!animalPool.length) {
      animalPool = ANIMAL_METADATA.filter((a) => STARTER_ANIMAL_IDS.includes(a.id));
    }

    for (let i = 0; i < 3; i++) {
      if (!state.shop.frozenAnimals[i]) {
        const rand = animalPool[Math.floor(Math.random() * animalPool.length)];
        state.shop.animals[i] = createAnimalCard(rand.id);
      }
    }

    for (let i = 0; i < 2; i++) {
      if (!state.shop.frozenItems[i]) {
        const rand = ITEM_METADATA[Math.floor(Math.random() * ITEM_METADATA.length)];
        state.shop.items[i] = { ...rand };
      }
    }
  }

  function renderPrepScreen(focusTarget = null) {
    renderFoodGuide();
    renderSquad();
    renderBench();
    renderShop();
    highlightSelectedCard(Boolean(selectedSlot));
    if (focusTarget) {
      document.querySelector(`.card-item[data-area="${focusTarget.area}"][data-slot="${focusTarget.index}"]`)?.focus();
    }
  }

  function renderFoodGuide() {
    if (!nodes.foodGuide) return;
    nodes.foodGuide.innerHTML = `<strong>${t("shopLabel")}</strong><span>${t("backpackHint")}</span>`;
  }

  function getItemEffectText(card) {
    if (!card || card.atk !== undefined) return "";
    return localizedField(card, "desc");
  }

  function formationActionPosition(index) {
    const safeIndex = Math.max(0, Math.min(5, Number(index) || 0));
    const row = t(safeIndex < 3 ? "formationFrontRow" : "formationBackRow");
    const columns = [t("formationLeftPosition"), t("formationCenterPosition"), t("formationRightPosition")];
    return `${row}, ${columns[safeIndex % 3]}`;
  }

  // Cards UI helpers
  function makeCardElement(card, sourceArea, index) {
    const el = document.createElement("div");
    const activate = (event) => {
      if (event.type === "keydown") {
        if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
      }
      event.stopPropagation();
      handleSlotTap(sourceArea, index);
    };
    el.setAttribute("role", "button");
    el.tabIndex = 0;
    if (!card) {
      el.className = "card-item empty-slot";
      el.dataset.slot = String(index);
      el.dataset.area = sourceArea;
      const emptyArea = sourceArea === "squad"
        ? `${t("emptyFormationSlot")}, ${formationActionPosition(index)}`
        : `${t("emptySlot")} ${index + 1}`;
      el.setAttribute("aria-label", emptyArea);
      el.addEventListener("click", activate);
      el.addEventListener("keydown", activate);
      return el;
    }

    el.className = "card-item";
    if (save.selectedSkin === "golden" && card.id === 8) {
      el.classList.add("mascot-golden");
    }
    el.draggable = false;
    el.dataset.slot = String(index);
    el.dataset.area = sourceArea;
    el.dataset.cardId = String(card.id);
    const cardName = localizedField(card, "name");
    const placement = sourceArea === "backpack" ? findPlacedCard(card.id) : null;
    let actionPosition = t("slotPosition", { index: index + 1 });
    let areaLabel = sourceArea;
    if (sourceArea === "squad") {
      areaLabel = t("activeSquad");
      actionPosition = formationActionPosition(index);
    } else if (sourceArea === "backpack") {
      areaLabel = t("expeditionBackpack");
      if (placement?.area === "squad") {
        actionPosition += `, ${t("deployedTo")} ${formationActionPosition(placement.index)}`;
      }
    }
    el.setAttribute("aria-label", `${cardName}, ${areaLabel}, ${actionPosition}`);

    if (sourceArea === "backpack" && findPlacedCard(card.id)) {
      el.classList.add("is-deployed");
      const deployedTag = document.createElement("div");
      deployedTag.className = "card-deployed-tag";
      deployedTag.textContent = t("deployed");
      el.appendChild(deployedTag);
    }

    // Inside details
    const isAnimal = card.atk !== undefined;
    
    // Thumbnail graphic
    const graphic = document.createElement("div");
    graphic.className = "card-graphic";
    if (isAnimal) {
      graphic.classList.add("character-icon");
      graphic.style.backgroundImage = `url('${assetsToLoad[card.imageKey] || assetsToLoad.boomLion}')`;
      graphic.style.aspectRatio = "1 / 1";
      graphic.style.backgroundPosition = "center";
      graphic.style.backgroundSize = "contain";
    } else {
      // Food uses independent icons so no sheet crop can show the wrong item.
      graphic.classList.add("food-icon");
      graphic.style.backgroundImage = `url('${assetsToLoad[card.imageKey] || assetsToLoad.foodApple}')`;
      graphic.style.aspectRatio = "1 / 1";
      graphic.style.backgroundPosition = "center";
      graphic.style.backgroundSize = "contain";
    }
    el.appendChild(graphic);

    // Title / Name
    const nameEl = document.createElement("div");
    nameEl.className = "card-name";
    nameEl.textContent = localizedField(card, "name");
    el.appendChild(nameEl);

    if (isAnimal) {
      const abilityEl = document.createElement("div");
      abilityEl.className = "card-ability";
      const role = localizedField(card, "role");
      const desc = localizedField(card, "desc");
      abilityEl.textContent = [role, desc].filter(Boolean).join(": ");
      el.appendChild(abilityEl);
    }

    if (!isAnimal) {
      const effectEl = document.createElement("div");
      effectEl.className = "card-effect";
      effectEl.textContent = getItemEffectText(card);
      el.appendChild(effectEl);
      el.title = `${localizedField(card, "name")}: ${effectEl.textContent}`;
    }

    // Level tag
    if (isAnimal) {
      const levelEl = document.createElement("div");
      levelEl.className = "card-level-tag";
      levelEl.textContent = `${t("level")}${card.level || 1}`;
      el.appendChild(levelEl);
    }

    // Shield Badge
    if (card.hasShield) {
      const shieldEl = document.createElement("div");
      shieldEl.className = "card-shield-tag";
      shieldEl.textContent = localizedPhrase("Shield", "\u8b77\u76fe", "Escudo");
      el.appendChild(shieldEl);
    }

    // Stats
    if (isAnimal) {
      const statsEl = document.createElement("div");
      statsEl.className = "card-stats";
      const attackLabel = locale === "zh-Hant" || locale === "ja" ? t("attackShort") : "ATK";
      const healthLabel = locale === "zh-Hant" || locale === "ja" ? t("healthShort") : "HP";
      statsEl.innerHTML = `<span class="card-atk">${attackLabel} ${card.currentAtk}</span><span class="card-hp">${healthLabel} ${card.currentHp}</span>`;
      el.appendChild(statsEl);
      el.title = `${localizedField(card, "name")}: ${attackLabel} ${card.currentAtk}, ${healthLabel} ${card.currentHp}. ${localizedField(card, "desc")}`;
      if (sourceArea === "shop-animal") {
        const costEl = document.createElement("div");
        costEl.className = "card-cost animal-cost";
        costEl.textContent = "3";
        el.appendChild(costEl);
      }
    } else {
      // Cost
      const costEl = document.createElement("div");
      costEl.className = "card-cost";
      costEl.textContent = "3";
      el.appendChild(costEl);
    }

    // Selection highlight for Tap-to-select mobile UI
    el.addEventListener("click", activate);
    el.addEventListener("keydown", activate);

    return el;
  }

  // Mobile/Tap Fallback
  function handleSlotTap(area, index) {
    initAudio();
    if (!state.activeRun) return;

    if (selectedSlot === null) {
      // If tapping an empty slot as first action, ignore
      const card = getCardAt(area, index);
      if (!card) return;
      selectedSlot = { area, index };
      highlightSelectedCard(true);
      playSynth("click");
      renderPrepScreen({ area, index });
    } else {
      const source = selectedSlot;
      
      // If tapping the exact same slot, deselect it
      if (source.area === area && source.index === index) {
        selectedSlot = null;
        highlightSelectedCard(false);
        playSynth("click");
        renderPrepScreen({ area, index });
        return;
      }

      const sourceCard = getCardAt(source.area, source.index);
      const targetCard = getCardAt(area, index);

      if (targetCard) {
        // If they are both animal cards and have matching IDs, merge them
        const isSrcAnimal = sourceCard.atk !== undefined;
        const isTgtAnimal = targetCard.atk !== undefined;
        if (isSrcAnimal && isTgtAnimal && sourceCard.id === targetCard.id) {
          selectedSlot = null;
          highlightSelectedCard(false);
          executeAction(source.area, source.index, area, index);
        }
        // If source is food/item and target is animal, feed them
        else if (source.area === "shop-item" && isTgtAnimal) {
          selectedSlot = null;
          highlightSelectedCard(false);
          executeAction(source.area, source.index, area, index);
        }
        // Otherwise, switch active selection to the tapped card!
        else {
          selectedSlot = { area, index };
          highlightSelectedCard(true);
          playSynth("click");
          renderPrepScreen({ area, index });
        }
      } else {
        // Tapped empty slot: execute move/buy action
        selectedSlot = null;
        highlightSelectedCard(false);
        executeAction(source.area, source.index, area, index);
      }
    }
  }

  function getCardAt(area, index) {
    if (area === "squad") return state.squad[index];
    if (area === "bench") return state.bench[index];
    if (area === "backpack") return state.backpack[index];
    if (area === "shop-animal") return state.shop.animals[index];
    if (area === "shop-item") return state.shop.items[index];
    return null;
  }

  function setCardAt(area, index, card) {
    if (area === "squad") state.squad[index] = card;
    if (area === "bench") state.bench[index] = card;
    if (area === "backpack") state.backpack[index] = card;
    if (area === "shop-animal") state.shop.animals[index] = card;
    if (area === "shop-item") state.shop.items[index] = card;
  }

  function highlightSelectedCard(highlight) {
    document.querySelectorAll(".card-item").forEach((el) => {
      el.classList.remove("is-selected-card");
      el.setAttribute("aria-pressed", "false");
    });

    if (highlight && selectedSlot) {
      const parent = $(`${selectedSlot.area}Grid`) || $("shopRow");
      if (parent) {
        const item = parent.querySelector(`[data-slot="${selectedSlot.index}"][data-area="${selectedSlot.area}"]`);
        if (item) {
          item.classList.add("is-selected-card");
          item.setAttribute("aria-pressed", "true");
        }
      }
    }
  }

  // Central game economy and positioning handler
  function executeAction(srcArea, srcIndex, destArea, destIndex) {
    clearActionNotice(nodes.prepNotice);
    const card = getCardAt(srcArea, srcIndex);
    if (!card) return;
    const activeAreas = ["squad", "bench"];

    if (srcArea === "backpack" && activeAreas.includes(destArea)) {
      const currentPlacement = findPlacedCard(card.id);
      const targetCard = getCardAt(destArea, destIndex);
      if (currentPlacement?.area === destArea && currentPlacement.index === destIndex) return;
      if (currentPlacement) setCardAt(currentPlacement.area, currentPlacement.index, targetCard || null);
      setCardAt(destArea, destIndex, card);
      selectedSlot = null;
      highlightSelectedCard(false);
      saveActiveFormation();
      playSynth("click");
      updateHUD();
      renderPrepScreen({ area: destArea, index: destIndex });
      return;
    }

    if (activeAreas.includes(srcArea) && destArea === "backpack") {
      setCardAt(srcArea, srcIndex, null);
      selectedSlot = null;
      highlightSelectedCard(false);
      saveActiveFormation();
      playSynth("click");
      updateHUD();
      renderPrepScreen({ area: destArea, index: destIndex });
      return;
    }

    if (activeAreas.includes(srcArea) && activeAreas.includes(destArea)) {
      if (srcArea === destArea && srcIndex === destIndex) return;
      const targetCard = getCardAt(destArea, destIndex);
      setCardAt(srcArea, srcIndex, targetCard || null);
      setCardAt(destArea, destIndex, card);
      selectedSlot = null;
      highlightSelectedCard(false);
      saveActiveFormation();
      playSynth("click");
      updateHUD();
      renderPrepScreen({ area: destArea, index: destIndex });
      return;
    }

    // 1. Legacy buy animal from shop
    if (srcArea === "shop-animal" && (destArea === "squad" || destArea === "bench")) {
      if (state.gold < 3) {
        showActionNotice(nodes.prepNotice, t("noSupplies"), document.activeElement);
        return;
      }
      const targetCard = getCardAt(destArea, destIndex);
      if (!targetCard) {
        // Empty slot: buy
        state.gold -= 3;
        setCardAt(srcArea, srcIndex, null);
        setCardAt(destArea, destIndex, card);
        triggerBuyAbility(card);
        playSynth("buy");
      } else if (targetCard.id === card.id) {
        // Combine shop with existing
        state.gold -= 3;
        setCardAt(srcArea, srcIndex, null);
        combineCards(targetCard, card);
        playSynth("combine");
      }
    }

    // 2. Buy Food / Relic from Shop
    else if (srcArea === "shop-item" && (destArea === "squad" || destArea === "bench")) {
      const targetCard = getCardAt(destArea, destIndex);
      if (!targetCard) return; // food must be fed to animal
      if (state.gold < 3) {
        showActionNotice(nodes.prepNotice, t("noSupplies"), document.activeElement);
        return;
      }
      state.gold -= 3;
      setCardAt(srcArea, srcIndex, null);
      feedAnimal(targetCard, card);
      playSynth("buy");
    }

    // 3. Move/Combine inside active zones
    else if ((srcArea === "squad" || srcArea === "bench") && (destArea === "squad" || destArea === "bench")) {
      if (srcArea === destArea && srcIndex === destIndex) return;

      const targetCard = getCardAt(destArea, destIndex);
      if (!targetCard) {
        // Move to empty
        setCardAt(srcArea, srcIndex, null);
        setCardAt(destArea, destIndex, card);
        playSynth("click");
      } else if (targetCard.id === card.id) {
        // Combine
        setCardAt(srcArea, srcIndex, null);
        combineCards(targetCard, card);
        playSynth("combine");
      } else {
        // Swap slots
        setCardAt(srcArea, srcIndex, targetCard);
        setCardAt(destArea, destIndex, card);
        playSynth("click");
      }
    }

    updateHUD();
    renderPrepScreen({ area: destArea, index: destIndex });
  }

  // Each duplicate directly advances the animal level so merges always feel readable.
  function combineCards(mainCard, secondaryCard) {
    const previousLevel = Math.max(1, Number(mainCard.level) || 1);
    const expGain = Math.max(1, Number(secondaryCard.exp) || 1);
    mainCard.exp = Math.max(1, Number(mainCard.exp) || 1) + expGain;
    mainCard.level = Math.min(9, Math.max(previousLevel + 1, mainCard.exp));

    const levelGain = Math.max(1, mainCard.level - previousLevel);
    mainCard.currentAtk = Math.round(mainCard.currentAtk + levelGain);
    mainCard.currentHp = Math.round(mainCard.currentHp + levelGain);
    mainCard.maxHp = Math.round(mainCard.maxHp + levelGain);
  }

  // Food / Relic feeding mechanic
  function feedAnimal(animal, food) {
    if (food.id === 0) {
      // Apple: +1/+1
      animal.currentAtk += 1;
      animal.currentHp += 1;
      animal.maxHp += 1;
      playSynth("buff");
    } else if (food.id === 1) {
      // Honey: +2 HP, gain 1 gold back immediately
      animal.currentHp += 2;
      animal.maxHp += 2;
      state.gold = Math.min(10, state.gold + 1);
      playSynth("buff");
    } else if (food.id === 2) {
      // Melon: gives Melon Shield
      animal.hasShield = true;
      playSynth("shield");
    } else if (food.id === 3) {
      // Chocolate: +2 Exp
      combineCards(animal, { exp: 2, level: 1, atk: 0, hp: 0 });
      playSynth("combine");
    }
    window.WonderAnalytics?.track("feed_food", { game_id: GAME_ID, food_id: food.id });
  }

  // Skill Card Triggers
  function triggerBuyAbility(card) {
    const level = card.level;
    if (card.id === 0) {
      // Squirrel: gain +1/+1 (+2/+2 at Lv2, +3/+3 at Lv3)
      card.currentAtk += level;
      card.currentHp += level;
      card.maxHp += level;
      playSynth("buff");
    } else if (card.id === 2) {
      // Beaver: give 2 random allies +1 HP
      buffRandomAllies(2, 0, level);
    } else if (card.id === 5) {
      // Raccoon: free reroll this round
      state.freeRerollThisRound = true;
      translateUI();
    } else if (card.id === 8) {
      // Lion: give all allies +2 HP
      state.squad.concat(state.bench).forEach((c) => {
        if (c && c !== card) {
          c.currentHp += 2 * level;
          c.maxHp += 2 * level;
        }
      });
      playSynth("buff");
    }
  }

  function triggerSellAbility(card) {
    const level = card.level;
    if (card.id === 1) {
      // Otter: +1 HP to random ally
      buffRandomAllies(1, 0, level);
    } else if (card.id === 3) {
      // Owl: +1 Gold on sell
      state.gold = Math.min(10, state.gold + level);
    } else if (card.id === 6) {
      // Fox: +2/+2 to random shop card
      const shopAnimals = state.shop.animals.filter(Boolean);
      if (shopAnimals.length) {
        const rand = shopAnimals[Math.floor(Math.random() * shopAnimals.length)];
        rand.currentAtk += 2 * level;
        rand.currentHp += 2 * level;
        rand.maxHp += 2 * level;
        playSynth("buff");
      }
    }
  }

  function buffRandomAllies(count, atkVal, hpVal) {
    const allies = state.squad.concat(state.bench).filter((c) => c !== null);
    if (!allies.length) return;
    for (let i = 0; i < count; i++) {
      const rand = allies[Math.floor(Math.random() * allies.length)];
      rand.currentAtk += atkVal;
      rand.currentHp += hpVal;
      rand.maxHp += hpVal;
    }
    playSynth("buff");
  }

  function runUpgradeCost(card) {
    return 4 + Math.max(1, Number(card?.level) || 1) * 2;
  }

  function handleRunUpgradeSelected() {
    clearActionNotice(nodes.prepNotice);
    if (!selectedSlot) return;
    const card = getCardAt(selectedSlot.area, selectedSlot.index);
    if (!card || card.atk === undefined) return;
    const cost = runUpgradeCost(card);
    if (state.gold < cost) {
      showActionNotice(nodes.prepNotice, t("noSupplies"), document.activeElement);
      return;
    }
    state.gold -= cost;
    card.level = Math.min(20, Math.max(1, Number(card.level) || 1) + 1);
    card.exp = Math.max(Number(card.exp) || 1, card.level);
    card.currentAtk += 1;
    card.currentHp += 2;
    card.maxHp += 2;
    selectedSlot = null;
    playSynth("combine");
    updateHUD();
    renderPrepScreen();
  }

  // Reroll Shop items
  function rerollShop() {
    initAudio();
    clearActionNotice(nodes.prepNotice);
    const rerollCost = state.freeRerollThisRound ? 0 : 1;
    if (state.gold < rerollCost) {
      showActionNotice(nodes.prepNotice, t("noSupplies"), nodes.rerollShopBtn);
      return;
    }

    state.gold -= rerollCost;
    state.freeRerollThisRound = false;
    state.rerollsUsedThisRound++;
    
    playSynth("sell");
    generateShop();
    updateHUD();
    renderPrepScreen();
  }

  // Toggle freeze item status
  function toggleFreeze(area, idx) {
    initAudio();
    if (area === "animal") {
      state.shop.frozenAnimals[idx] = !state.shop.frozenAnimals[idx];
    } else {
      state.shop.frozenItems[idx] = !state.shop.frozenItems[idx];
    }
    playSynth("click");
    renderPrepScreen();
  }

  // Rendering Shop grids
  function renderSquad() {
    nodes.squadGrid.innerHTML = "";
    state.squad.forEach((card, idx) => {
      const el = makeCardElement(card, "squad", idx);
      nodes.squadGrid.appendChild(el);
    });
  }

  function renderBench() {
    if (!nodes.benchGrid) return;
    nodes.benchGrid.innerHTML = "";
    state.bench.forEach((card, idx) => {
      const el = makeCardElement(card, "bench", idx);
      nodes.benchGrid.appendChild(el);
    });
  }

  function renderShop() {
    nodes.shopRow.innerHTML = "";
    // The backpack is the permanent owned roster, not a list of animals that
    // happen to be off the field. Rebuild it with deployed cards included so
    // old/compacted run state cannot make formation members disappear here.
    state.backpack = rebuildOwnedBackpack(state.backpack, state.squad.concat(state.bench));

    const visibleSlots = state.backpack.length;
    for (let idx = 0; idx < visibleSlots; idx++) {
      const cell = document.createElement("div");
      cell.className = "shop-cell";
      cell.style.position = "relative";
      cell.appendChild(makeCardElement(state.backpack[idx] || null, "backpack", idx));
      nodes.shopRow.appendChild(cell);
    }

    const selectedCard = selectedSlot ? getCardAt(selectedSlot.area, selectedSlot.index) : null;
    if (selectedCard && selectedCard.atk !== undefined) {
      nodes.sellCardBtn.classList.remove("is-hidden");
      nodes.sellCardBtn.textContent = t("upgradeRun", { cost: runUpgradeCost(selectedCard) });
    } else {
      nodes.sellCardBtn.classList.add("is-hidden");
    }
    renderSelectedAbility(selectedCard);
  }

  function renderSelectedAbility(card) {
    if (!nodes.selectedAbilityPanel) return;
    if (!card || card.atk === undefined) {
      nodes.selectedAbilityPanel.classList.remove("has-selection");
      nodes.selectedAbilityPanel.innerHTML = `<span>${t("selectCharacterHint")}</span>`;
      return;
    }
    const name = localizedField(card, "name");
    const role = localizedField(card, "role");
    const desc = localizedField(card, "desc");
    nodes.selectedAbilityPanel.classList.add("has-selection");
    nodes.selectedAbilityPanel.innerHTML = `<strong>${t("selectedSkillTitle")} · ${name}</strong><small>${role}</small><span>${desc}</span>`;
  }

  function unitLevel(unit) {
    return Math.max(1, Number(unit?.level) || 1);
  }

  function combatLayoutMetrics(team = "player") {
    return team === "player"
      ? { width: 174, height: 214 }
      : { width: 160, height: 198 };
  }

  function syncCombatCanvasSize() {
    const rect = nodes.gameCanvas.getBoundingClientRect();
    const ratio = rect.width > 0 && rect.height > 0 ? rect.width / rect.height : 720 / 1280;
    const width = Math.max(720, Math.min(1600, Math.round(1280 * ratio)));
    if (nodes.gameCanvas.width !== width) nodes.gameCanvas.width = width;
    if (nodes.gameCanvas.height !== 1280) nodes.gameCanvas.height = 1280;
    return width;
  }

  function formationPosition(team, formationSlot = 0) {
    const safeSlot = Math.max(0, Math.min(5, Number(formationSlot) || 0));
    const column = safeSlot % 3;
    const row = Math.floor(safeSlot / 3);
    const canvasCenter = (nodes.gameCanvas?.width || 720) / 2;
    const x = [145, 360, 575][column] + canvasCenter - 360;
    const y = team === "player"
      ? [800, 1040][row]
      : [440, 200][row];
    return { x, y, row, column, slot: safeSlot };
  }

  function addCombatEffect(type, x, y, text = "", textColor = "white") {
    const maxLife = type === "starfall" ? 28 : type === "buff" ? 24 : 18;
    state.combat.effects.push({ type, x, y, life: maxLife, maxLife, text, textColor });
  }

  function markActing(team, index, style = "attack") {
    const actor = { team, index, style, life: 26, maxLife: 26 };
    state.combat.activeActor = actor;
    state.combat.activeActors = (state.combat.activeActors || []).filter((item) => !(item.team === team && item.index === index));
    state.combat.activeActors.push(actor);
  }

  function removeDefeatedUnits(squad, team) {
    for (let i = squad.length - 1; i >= 0; i--) {
      if (squad[i].hp <= 0) {
        const fallen = squad.splice(i, 1)[0];
        if (team === "player") {
          state.combat.lastFallen = {
            name: combatUnitName(fallen),
            slot: unitFormationSlot(fallen, i)
          };
        }
        triggerFaintAbility(fallen, team);
      }
    }
  }

  function combatPoint(team, index = 0) {
    const squad = team === "player" ? state.combat.playerSquad : state.combat.enemySquad;
    const slot = squad[index]?.formationSlot ?? index;
    return formationPosition(team, slot);
  }

  function combatUnitName(unit) {
    return unit ? localizedField(unit, "name") : "-";
  }

  function unitFormationSlot(unit, fallbackIndex = 0) {
    return Math.max(0, Math.min(5, Number.isFinite(Number(unit?.formationSlot)) ? Number(unit.formationSlot) : fallbackIndex));
  }

  function unitAtFormationSlot(squad, slot) {
    const exact = squad.find((unit) => unitFormationSlot(unit, -1) === slot);
    return exact || (!squad.some((unit) => Number.isFinite(Number(unit?.formationSlot))) ? squad[slot] : null);
  }

  function livingFormationRow(squad, row) {
    return squad
      .filter((unit, index) => unit.hp > 0 && Math.floor(unitFormationSlot(unit, index) / 3) === row)
      .sort((a, b) => unitFormationSlot(a) - unitFormationSlot(b));
  }

  function formationTargets(squad, mode = "front") {
    const preferredRow = mode === "back" ? 1 : 0;
    const preferred = livingFormationRow(squad, preferredRow);
    return preferred.length ? preferred : livingFormationRow(squad, preferredRow === 0 ? 1 : 0);
  }

  function formationTarget(squad, mode = "front") {
    return formationTargets(squad, mode)[0] || null;
  }

  function formationTargetPoint(team, squad, unit) {
    return combatPoint(team, Math.max(0, squad.indexOf(unit)));
  }

  function healWeakestAlly(squad, amount, team = "player") {
    const target = squad.filter((unit) => unit.hp > 0).sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
    if (!target) return;
    target.hp = Math.min(target.maxHp, target.hp + amount);
    const idx = Math.max(0, squad.indexOf(target));
    const point = combatPoint(team, idx);
    addCombatEffect("heal", point.x, point.y, `+${amount}`, "#82ffd1");
  }

  function addUnitShield(unit, amount, team = "player", index = 0) {
    if (!unit || amount <= 0) return;
    unit.shieldHp = Math.max(0, Math.round(unit.shieldHp || 0)) + Math.max(1, Math.round(amount));
    unit.shield = unit.shieldHp > 0;
    const point = combatPoint(team, index);
    addCombatEffect("shield", point.x, point.y, `+${Math.max(1, Math.round(amount))}`, "#8fb7ff");
  }

  function damageTarget(unit, amount, x, y) {
    if (!unit || amount <= 0) return;
    let damage = Math.max(0, Math.round(amount));
    const shieldHp = Math.max(0, Math.round(unit.shieldHp || 0));
    if (shieldHp > 0) {
      const absorbed = Math.min(shieldHp, damage);
      unit.shieldHp = shieldHp - absorbed;
      unit.shield = unit.shieldHp > 0;
      damage -= absorbed;
      addCombatEffect("shield", x, y, `-${absorbed}`, "#8fb7ff");
    } else if (unit.shield) {
      unit.shield = false;
      damage = 0;
      addCombatEffect("shield", x, y, "Block", "#8fb7ff");
    }
    if (damage > 0) {
      unit.hp -= damage;
      addCombatEffect("hit", x, y, `-${damage}`, "yellow");
    }
  }

  function triggerBattleStartAbilities() {
    state.combat.playerSquad.forEach((unit) => {
      const level = unitLevel(unit);
      if (unit.id === 2) {
        state.combat.playerSquad.forEach((ally) => {
          ally.hp += level;
          ally.maxHp += level;
        });
        addCombatEffect("buff", 360, 950, `+${level} HP`, "#82ffd1");
      } else if (unit.id === 4) {
        addUnitShield(unit, Math.max(1, level), "player", state.combat.playerSquad.indexOf(unit));
      } else if (unit.id === 8) {
        state.combat.playerSquad.forEach((ally) => {
          ally.atk += level;
        });
        addCombatEffect("buff", 360, 950, `+${level} ATK`, "#ffd666");
      }
    });
  }

  function triggerBeforeClashAbilities() {
    const playerSquad = state.combat.playerSquad;
    const enemySquad = state.combat.enemySquad;
    playerSquad.forEach((unit) => {
      if (!enemySquad.length || unit.hp <= 0) return;
      const level = unitLevel(unit);
      if (unit.id === 0) {
        const point = combatPoint("enemy", 0);
        damageTarget(enemySquad[0], level, point.x, point.y);
      } else if (unit.id === 1) {
        healWeakestAlly(playerSquad, level);
      }
    });
    removeDefeatedUnits(enemySquad, "enemy");
  }

  // Combat Execution
  function startBattle(event) {
    reclaimVisibleForeground(event);
    initAudio();
    playSynth("click");
    clearActionNotice(nodes.prepNotice);

    // Gather active players (non-null in squad)
    const activeSquad = state.squad
      .map((card, formationSlot) => card ? { card, formationSlot } : null)
      .filter(Boolean);
    if (!activeSquad.length) {
      showActionNotice(nodes.prepNotice, t("needSquad"), nodes.startBattleBtn);
      return;
    }

    clearScheduledCombatTimers();
    const runId = ++combatRunSequence;
    nodes.startBattleBtn.disabled = true;

    // Prepare combatants (deep clone to not alter permanent state)
    const bonus = teamBonus();
    state.combat.playerSquad = activeSquad.map(({ card, formationSlot }) => ({
      ...card,
      formationSlot,
      hp: card.currentHp + bonus.hp,
      maxHp: card.maxHp + bonus.hp,
      atk: card.currentAtk + bonus.atk,
      shield: card.hasShield,
      shieldHp: card.hasShield ? Math.max(1, Math.ceil(card.currentHp * 0.35)) : 0
    }));

    // Trigger Maple Shield relic (first unit gets shield)
    if (state.relic?.id === 0 && state.combat.playerSquad.length) {
      addUnitShield(state.combat.playerSquad[0], 2, "player", 0);
    }
    // Trigger Oak Seed relic (+1 HP in combat)
    if (state.relic?.id === 1) {
      state.combat.playerSquad.forEach((c) => {
        c.hp += 1;
        c.maxHp += 1;
      });
    }
    // Trigger Shadow Claw relic (+1 Atk in combat)
    if (state.relic?.id === 2) {
      state.combat.playerSquad.forEach((c) => c.atk += 1);
    }
    triggerBattleStartAbilities();

    // Generate a stage-specific wave instead of adding another enemy every round.
    state.combat.enemySquad = generateEnemySquad(state.stage, state.round);

    // Swap views
    nodes.prepPhaseArea.classList.add("is-hidden");
    nodes.combatArea.classList.remove("is-hidden");
    nodes.combatSummary?.classList.remove("is-hidden");
    nodes.hintText.textContent = "";

    // Reset combat state
    state.combat.step = 0;
    state.combat.log = [];
    state.combat.animating = true;
    state.combat.ending = false;
    state.combat.resolved = false;
    state.combat.runId = runId;
    state.combat.timer = 0;
    combatLastProgressAt = performance.now();
    state.combat.activeActor = null;
    state.combat.activeActors = [];
    state.combat.lastAction = "";
    state.combat.lastFallen = null;
    state.combat.effects = [];
    
    canvasCtx = nodes.gameCanvas.getContext("2d");
    const openingBoss = state.combat.enemySquad.find((unit) => unit.isBoss);
    combatLog(openingBoss ? t("bossIncoming", { boss: combatUnitName(openingBoss) }) : t("combatIntro"));
    updateCombatSummary();
    
    // Start animation loop
    ensureCombatProgressTimer();
    runCombatAnimation();
    window.WonderAnalytics?.track("battle_start", { game_id: GAME_ID, stage: state.stage, wave: state.round });
  }

  function enemyWaveStats(stage, wave) {
    const safeStage = Math.max(1, Math.min(STAGE_COUNT, Number(stage) || 1));
    const safeWave = Math.max(1, Math.min(WAVES_PER_STAGE, Number(wave) || 1));
    const definition = stageDefinition(safeStage);
    const enemyIds = [...definition.waves[safeWave - 1]];
    const attack = 1 + Math.floor((safeStage - 1) / 6) + Math.floor((safeWave - 1) / 3);
    const health = 2 + Math.floor((safeStage - 1) / 3) + Math.floor((safeWave - 1) / 2);
    return {
      stage: safeStage,
      wave: safeWave,
      count: enemyIds.length,
      enemyIds,
      atk: attack,
      hp: health,
      level: Math.max(1, Math.ceil((safeStage + safeWave - 1) / 5)),
      isBossWave: enemyIds.some((id) => id >= 100)
    };
  }

  function summarizeEnemyWave(stage, wave) {
    const stats = enemyWaveStats(stage, wave);
    return { count: stats.count, atk: stats.atk, hp: stats.hp, level: stats.level, enemyIds: [...stats.enemyIds], bossIds: stats.enemyIds.filter((id) => id >= 100), isBossWave: stats.isBossWave };
  }

  function generateEnemySquad(stage, wave) {
    const stats = enemyWaveStats(stage, wave);
    const formationSlots = formationSlotsForCount(stats.count);
    return stats.enemyIds.map((enemyId, i) => {
      const enemy = ENEMY_METADATA.find((item) => item.id === enemyId) || BOSS_METADATA.find((item) => item.id === enemyId) || ENEMY_METADATA[0];
      const hp = Math.max(1, Math.round(stats.hp * (enemy.hpMod || 1)));
      const atk = Math.max(1, Math.round(stats.atk * (enemy.atkMod || 1)));
      return {
        ...enemy,
        formationSlot: formationSlots[i],
        atk,
        hp,
        maxHp: hp,
        shield: false,
        shieldHp: 0,
        level: stats.level,
        abilityUsed: false
      };
    });
  }

  function formationSlotsForCount(countValue) {
    const layouts = {
      1: [1],
      2: [0, 2],
      3: [0, 1, 2],
      4: [0, 1, 2, 4],
      5: [0, 1, 2, 3, 5],
      6: [0, 1, 2, 3, 4, 5]
    };
    const count = Math.max(1, Math.min(6, Number(countValue) || 1));
    return layouts[count];
  }

  function combatLog(message) {
    state.combat.status = message;
    nodes.combatStatusText.textContent = message;
  }

  function clearScheduledCombatTimers() {
    if (combatEndTimer !== null) {
      clearTimeout(combatEndTimer);
      combatEndTimer = null;
    }
    combatEndPending = null;
    combatEndDueAt = 0;
    combatEndRemaining = 0;
    combatStepTimers.forEach((timerId) => clearTimeout(timerId));
    combatStepTimers.clear();
  }

  function stopCombatSession() {
    clearScheduledCombatTimers();
    if (combatProgressTimer !== null) {
      clearInterval(combatProgressTimer);
      combatProgressTimer = null;
    }
    combatLastProgressAt = 0;
    cancelAnimationFrame(animationId);
    combatSuspendedForBackground = false;
    quitDecisionOpen = false;
    combatRunSequence++;
    if (!state?.combat) return;
    state.combat.runId = combatRunSequence;
    state.combat.animating = false;
    state.combat.ending = false;
    state.combat.resolved = true;
  }

  function scheduleCombatStepCleanup(callback, delay = 220) {
    const runId = state.combat.runId;
    const timerId = setTimeout(() => {
      combatStepTimers.delete(timerId);
      if (runId !== state.combat.runId || state.combat.resolved) return;
      if (document.hidden || quitDecisionOpen) {
        scheduleCombatStepCleanup(callback, 80);
        return;
      }
      callback();
    }, delay);
    combatStepTimers.add(timerId);
  }

  function armCombatEndTimer() {
    if (!combatEndPending || combatEndTimer !== null || document.hidden || quitDecisionOpen) return;
    const delay = Math.max(0, combatEndRemaining);
    combatEndDueAt = performance.now() + delay;
    combatEndTimer = setTimeout(() => {
      combatEndTimer = null;
      combatEndDueAt = 0;
      const pending = combatEndPending;
      combatEndPending = null;
      combatEndRemaining = 0;
      if (!pending || pending.runId !== state.combat.runId || state.combat.resolved) return;
      endBattleRun(pending.result, pending.runId);
    }, delay);
  }

  function suspendCombatEndTimer() {
    if (combatEndTimer === null) return;
    clearTimeout(combatEndTimer);
    combatEndTimer = null;
    combatEndRemaining = Math.max(0, combatEndDueAt - performance.now());
    combatEndDueAt = 0;
  }

  function resumeCombatEndTimer() {
    if (!combatEndPending || document.hidden || quitDecisionOpen) return;
    armCombatEndTimer();
  }

  function scheduleCombatEnd(result, delay = 1500) {
    if (state.combat.ending || state.combat.resolved) return;
    state.combat.ending = true;
    combatEndPending = { result, runId: state.combat.runId };
    combatEndRemaining = Math.max(0, Number(delay) || 0);
    armCombatEndTimer();
  }

  function advanceCombatClock() {
    if (!state.combat.animating || state.combat.ending || state.combat.resolved || quitDecisionOpen || document.hidden) {
      combatLastProgressAt = 0;
      return;
    }
    const now = performance.now();
    if (!combatLastProgressAt) {
      combatLastProgressAt = now;
      return;
    }
    const elapsed = Math.min(1000, Math.max(0, now - combatLastProgressAt));
    combatLastProgressAt = now;
    state.combat.timer += elapsed / (1000 / 60);
    if (state.combat.timer >= 90) {
      state.combat.timer %= 90;
      resolveCombatStep();
    }
  }

  function ensureCombatProgressTimer() {
    if (combatProgressTimer !== null) return;
    combatLastProgressAt = performance.now();
    combatProgressTimer = setInterval(advanceCombatClock, 250);
  }

  // Rendering Loop for Auto-Battle Canvas
  function runCombatAnimation() {
    if (!state.combat.animating) return;
    if (quitDecisionOpen) return;
    if (document.hidden) {
      combatSuspendedForBackground = true;
      return;
    }
    combatSuspendedForBackground = false;
    animationId = requestAnimationFrame(runCombatAnimation);
    advanceCombatClock();

    const canvasWidth = syncCombatCanvasSize();

    // Clear Canvas
    canvasCtx.clearRect(0, 0, canvasWidth, 1280);

    // Draw battlefield background
    if (imageCache.bg) {
      const image = imageCache.bg;
      const sourceRatio = image.naturalWidth / image.naturalHeight;
      const targetRatio = canvasWidth / 1280;
      let sx = 0;
      let sy = 0;
      let sw = image.naturalWidth;
      let sh = image.naturalHeight;
      if (sourceRatio > targetRatio) {
        sw = image.naturalHeight * targetRatio;
        sx = (image.naturalWidth - sw) / 2;
      } else {
        sh = image.naturalWidth / targetRatio;
        sy = (image.naturalHeight - sh) / 2;
      }
      canvasCtx.drawImage(image, sx, sy, sw, sh, 0, 0, canvasWidth, 1280);
      const shade = canvasCtx.createLinearGradient(0, 0, 0, 1280);
      shade.addColorStop(0, "rgba(9,20,16,.3)");
      shade.addColorStop(.48, "rgba(9,20,16,.08)");
      shade.addColorStop(1, "rgba(3,10,8,.46)");
      canvasCtx.fillStyle = shade;
      canvasCtx.fillRect(0, 0, canvasWidth, 1280);
    } else {
      canvasCtx.fillStyle = "#0c1f17";
      canvasCtx.fillRect(0, 0, canvasWidth, 1280);
    }

    canvasCtx.save();
    canvasCtx.textAlign = "center";
    canvasCtx.font = "900 24px Outfit, system-ui";
    canvasCtx.fillStyle = "rgba(255,255,255,.92)";
    canvasCtx.strokeStyle = "rgba(0,0,0,.75)";
    canvasCtx.lineWidth = 5;
    const playerLabel = localizedPhrase("YOUR SQUAD", "\u4f60\u7684\u5c0f\u968a", "TU ESCUADRÓN");
    canvasCtx.strokeText(playerLabel, canvasWidth / 2, 1210);
    canvasCtx.fillText(playerLabel, canvasWidth / 2, 1210);
    canvasCtx.font = "900 28px Outfit, system-ui";
    canvasCtx.fillStyle = "#ffd666";
    canvasCtx.strokeText("VS", canvasWidth / 2, 640);
    canvasCtx.fillText("VS", canvasWidth / 2, 640);
    canvasCtx.restore();

    updateCombatSummary();

    // Draw Squad lines
    state.combat.layout = [];
    drawSquadLine(state.combat.playerSquad, "player");
    drawSquadLine(state.combat.enemySquad, "enemy");
    window.__ANIMAL_AUTO_SQUAD_COMBAT_LAYOUT__ = state.combat.layout;

    // Draw active particle effects
    drawEffects();
  }

  function drawContainImage(image, x, y, w, h) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return;
    const sourceRatio = image.naturalWidth / image.naturalHeight;
    const targetRatio = w / h;
    let drawW = w;
    let drawH = h;
    if (sourceRatio > targetRatio) {
      drawH = w / sourceRatio;
    } else {
      drawW = h * sourceRatio;
    }
    canvasCtx.drawImage(image, x + (w - drawW) / 2, y + (h - drawH) / 2, drawW, drawH);
  }

  function drawStatPill(textValue, x, y, color) {
    canvasCtx.save();
    canvasCtx.fillStyle = "rgba(6, 12, 18, 0.78)";
    canvasCtx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    canvasCtx.lineWidth = 1;
    canvasCtx.beginPath();
    canvasCtx.roundRect(x, y, 46, 26, 9);
    canvasCtx.fill();
    canvasCtx.stroke();
    canvasCtx.font = "bold 16px Outfit, system-ui";
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "middle";
    canvasCtx.fillStyle = color;
    canvasCtx.fillText(textValue, x + 23, y + 13);
    canvasCtx.restore();
  }

  function drawSquadLine(squad, team) {
    const isPlayer = team === "player";
    const metrics = combatLayoutMetrics(team);
    
    squad.forEach((unit, idx) => {
      const formation = formationPosition(team, unit.formationSlot ?? idx);
      
      // Draw card frame
      canvasCtx.save();
      canvasCtx.shadowColor = "black";
      canvasCtx.shadowBlur = 10;
      
      // Apply shake frame offsets if shaking
      let shakeX = 0;
      if (state.combat.shakeFrames > 0 && state.combat.shakeTarget === team && idx === 0) {
        shakeX = Math.sin(state.combat.shakeFrames) * 8;
        state.combat.shakeFrames--;
      }
      
      const w = metrics.width;
      const h = metrics.height;
      const actor = (state.combat.activeActors || []).find((item) => item.team === team && item.index === idx && item.life > 0);
      const isActing = actor?.team === team && actor.index === idx && actor.life > 0;
      const actorProgress = isActing ? 1 - actor.life / Math.max(1, actor.maxLife || 26) : 0;
      const bounce = isActing ? Math.sin(actorProgress * Math.PI) : 0;
      const actorOffset = bounce * (isActing && actor.style === "cast" ? 18 : 12);
      const scale = isActing ? 1 + bounce * 0.08 : 1;
      const centerY = formation.y + (isPlayer ? -actorOffset : actorOffset);
      const x = formation.x + shakeX - (w * scale) / 2;
      const y = centerY - (h * scale) / 2;
      const drawW = w * scale;
      const drawH = h * scale;
      const imageBox = { x: x + 10, y: y + 44, w: w - 20, h: h - 78 };
      state.combat.layout?.push({ team, index: idx, formationSlot: formation.slot, formationRow: formation.row, enemyId: isPlayer ? null : unit.id, imageKey: unit.imageKey || "", isBoss: Boolean(unit.isBoss), x, y, w: drawW, h: drawH, imageBox });

      // Draw backdrop
      canvasCtx.fillStyle = isPlayer ? "rgba(10, 30, 24, 0.9)" : unit.isBoss ? "rgba(45, 25, 8, 0.96)" : "rgba(35, 12, 12, 0.9)";
      canvasCtx.strokeStyle = isPlayer ? "var(--mint)" : unit.isBoss ? "#ffd666" : "var(--danger)";
      canvasCtx.lineWidth = unit.isBoss ? 4 : 2;
      
      // Draw rounded rectangle
      canvasCtx.beginPath();
      canvasCtx.roundRect(x, y, drawW, drawH, 10);
      canvasCtx.fill();
      canvasCtx.stroke();
      if (isActing) {
        canvasCtx.strokeStyle = actor.style === "cast" ? "#8ff7ff" : "#ffd666";
        canvasCtx.lineWidth = 4;
        canvasCtx.globalAlpha = 0.82;
        canvasCtx.beginPath();
        canvasCtx.roundRect(x - 3, y - 3, drawW + 6, drawH + 6, 12);
        canvasCtx.stroke();
        canvasCtx.globalAlpha = 1;
      }
      
      // Draw character sprite
      if (isPlayer) {
        const portrait = imageCache[unit.imageKey] || imageCache.boomLion;
        drawContainImage(portrait, imageBox.x, imageBox.y, imageBox.w, imageBox.h);
      } else if (unit.imageKey && imageCache[unit.imageKey]) {
        drawContainImage(imageCache[unit.imageKey], imageBox.x, imageBox.y, imageBox.w, imageBox.h);
      } else {
        const sheet = imageCache.enemies;
        if (sheet) {
          const sw = unit.sw || 682;
          const sh = unit.sh || 768;
          const cropRatio = sw / sh;
          const targetRatio = imageBox.w / imageBox.h;
          let drawW = imageBox.w;
          let drawH = imageBox.h;
          if (cropRatio > targetRatio) {
            drawH = imageBox.w / cropRatio;
          } else {
            drawW = imageBox.h * cropRatio;
          }
          canvasCtx.drawImage(sheet, unit.sx, unit.sy, sw, sh, imageBox.x + (imageBox.w - drawW) / 2, imageBox.y + (imageBox.h - drawH) / 2, drawW, drawH);
        }
      }

      drawUnitHealthBar(unit, x + 8, y + 8, w - 16, isPlayer);

      // Draw Melon shield overlay
      if (unit.shield || unit.shieldHp > 0) {
        canvasCtx.strokeStyle = "#5e8cf2";
        canvasCtx.lineWidth = 3;
        canvasCtx.beginPath();
        canvasCtx.arc(x + drawW/2, y + drawH/2 - 10, drawW/2 - 2, 0, Math.PI * 2);
        canvasCtx.stroke();
        if (unit.shieldHp > 0) {
          drawStatPill(`S${Math.round(unit.shieldHp)}`, x + drawW / 2 - 23, y + drawH - 52, "#9cc8ff");
        }
      }

      drawStatPill(`A${unit.atk}`, x + 5, y + drawH - 31, "#ffd666");
      drawStatPill(`H${Math.max(0, Math.round(unit.hp))}`, x + drawW - 51, y + drawH - 31, "#ff7081");

      // Level star indicator for player units
      if (false && isPlayer && unit.level > 1) {
        canvasCtx.fillStyle = "var(--gold)";
        canvasCtx.fillText(`★${unit.level}`, x + w/2 - 8, y + 16);
      }

      canvasCtx.restore();
    });
    state.combat.activeActors = (state.combat.activeActors || []).filter((actor) => {
      actor.life--;
      return actor.life > 0;
    });
    state.combat.activeActor = state.combat.activeActors[state.combat.activeActors.length - 1] || null;
  }

  function drawUnitHealthBar(unit, x, y, width, isPlayer) {
    const hp = Math.max(0, Math.round(unit.hp || 0));
    const maxHp = Math.max(1, Math.round(unit.maxHp || hp || 1));
    const pct = Math.max(0, Math.min(1, hp / maxHp));
    const barHeight = COMBAT_HEALTH_BAR_HEIGHT;

    canvasCtx.save();
    canvasCtx.fillStyle = "rgba(0, 0, 0, 0.82)";
    canvasCtx.strokeStyle = "rgba(255, 255, 255, 0.72)";
    canvasCtx.lineWidth = 2;
    canvasCtx.beginPath();
    canvasCtx.roundRect(x, y, width, barHeight, 7);
    canvasCtx.fill();
    canvasCtx.stroke();

    canvasCtx.fillStyle = pct > 0.45 ? "#53f29d" : pct > 0.22 ? "#ffd666" : "#ff5266";
    canvasCtx.beginPath();
    canvasCtx.roundRect(x + 2, y + 2, Math.max(4, (width - 4) * pct), barHeight - 4, 5);
    canvasCtx.fill();

    canvasCtx.font = `900 ${COMBAT_HEALTH_FONT_SIZE}px Outfit, system-ui`;
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "middle";
    canvasCtx.lineWidth = 3;
    canvasCtx.strokeStyle = "rgba(0, 0, 0, 0.9)";
    canvasCtx.fillStyle = isPlayer ? "#ffffff" : "#ffe1e6";
    canvasCtx.strokeText(`${hp}/${maxHp}`, x + width / 2, y + barHeight / 2 + 0.5);
    canvasCtx.fillText(`${hp}/${maxHp}`, x + width / 2, y + barHeight / 2 + 0.5);
    canvasCtx.restore();
  }

  function updateCombatSummary() {
    if (!nodes.combatSummary || !state.combat.animating) return;
    const sumHp = (squad) => squad.reduce((total, unit) => total + Math.max(0, Math.round(unit.hp || 0)), 0);
    const sumMax = (squad) => squad.reduce((total, unit) => total + Math.max(1, Math.round(unit.maxHp || unit.hp || 1)), 0);
    const playerHp = sumHp(state.combat.playerSquad);
    const playerMax = sumMax(state.combat.playerSquad);
    const enemyHp = sumHp(state.combat.enemySquad);
    const enemyMax = sumMax(state.combat.enemySquad);
    const playerFront = formationTarget(state.combat.playerSquad, "front");
    const enemyFront = formationTarget(state.combat.enemySquad, "front");
    const playerName = playerFront ? localizedField(playerFront, "name") : "-";
    const enemyName = enemyFront ? localizedField(enemyFront, "name") : "-";
    const enemyRole = enemyFront ? localizedField(enemyFront, "role") : "";
    const summary = t("combatSummary", { playerHp, playerMax, enemyHp, enemyMax });
    const front = t("combatFront", { player: playerName, enemy: enemyRole ? `${enemyName} - ${enemyRole}` : enemyName });
    nodes.combatSummary.innerHTML = `<strong>${summary}</strong><span>${front}</span>`;
  }

  function drawEffectSprite(fx, progress, radius) {
    const sheet = imageCache.fxV2;
    if (!sheet?.naturalWidth || !sheet?.naturalHeight) return;
    const spriteIndex = { hit: 0, shield: 1, heal: 2, buff: 3, smoke: 4, starfall: 5 }[fx.type] ?? 0;
    const columns = 3;
    const sourceWidth = sheet.naturalWidth / columns;
    const sourceHeight = sheet.naturalHeight / 2;
    const sourceX = (spriteIndex % columns) * sourceWidth;
    const sourceY = Math.floor(spriteIndex / columns) * sourceHeight;
    const size = radius * (fx.type === "smoke" ? 2.15 : 2.45) * (0.82 + progress * 0.18);

    canvasCtx.globalCompositeOperation = "screen";
    canvasCtx.drawImage(sheet, sourceX, sourceY, sourceWidth, sourceHeight, fx.x - size / 2, fx.y - size / 2, size, size);
    canvasCtx.globalCompositeOperation = "source-over";
  }

  function drawEffects() {
    state.combat.effects = state.combat.effects.filter((fx) => {
      fx.life--;
      const maxLife = Math.max(1, fx.maxLife || 18);
      const progress = 1 - fx.life / maxLife;
      const alpha = Math.max(0, fx.life / maxLife);
      const radius = 18 + progress * 42;

      canvasCtx.save();
      canvasCtx.globalAlpha = alpha;
      drawEffectSprite(fx, progress, radius);
      
      // Floating text overlays (e.g. Damage numbers)
      if (fx.text) {
        canvasCtx.globalAlpha = 1;
        canvasCtx.font = "bold 20px Outfit, system-ui";
        canvasCtx.fillStyle = fx.textColor || "white";
        canvasCtx.strokeStyle = "black";
        canvasCtx.lineWidth = 3;
        canvasCtx.strokeText(fx.text, fx.x - 10, fx.y - 20 - progress * 18);
        canvasCtx.fillText(fx.text, fx.x - 10, fx.y - 20 - progress * 18);
      }

      canvasCtx.restore();
      return fx.life > 0;
    });
  }

  // Sequential Combat Turn Steps logic
  function resolveCombatStep() {
    if (state.combat.ending || state.combat.resolved) return;
    const playerSquad = state.combat.playerSquad;
    const enemySquad = state.combat.enemySquad;

    // Check end condition
    if (!playerSquad.length && !enemySquad.length) {
      combatLog(t("drawText"));
      playSynth("fail");
      scheduleCombatEnd("draw");
      return;
    }
    if (!playerSquad.length) {
      combatLog(t("failText"));
      playSynth("fail");
      scheduleCombatEnd("lose");
      return;
    }
    if (!enemySquad.length) {
      combatLog(t("winText"));
      playSynth("win");
      scheduleCombatEnd("win");
      return;
    }

    resolveOrderedCombatStep(playerSquad, enemySquad);
    return;

    triggerBeforeClashAbilities();
    if (!enemySquad.length) {
      combatLog(t("winText"));
      playSynth("win");
      scheduleCombatEnd("win", 900);
      return;
    }

    // Clash frontmost units
    const pUnit = playerSquad[0];
    const eUnit = enemySquad[0];

    // Trigger visual shake/bump animation
    state.combat.shakeFrames = 10;
    state.combat.shakeTarget = "player";
    playSynth("hit");

    // Apply shield logic
    let pDmg = eUnit.atk;
    let eDmg = pUnit.atk;
    if (pUnit.id === 6) {
      pDmg = Math.max(0, pDmg - unitLevel(pUnit));
    }

    if (pUnit.shield) {
      pDmg = 0;
      pUnit.shield = false;
      state.combat.effects.push({ type: "shield", x: 400, y: 250, life: 15 });
    }
    if (eUnit.shield) {
      eDmg = 0;
      eUnit.shield = false;
      state.combat.effects.push({ type: "shield", x: 560, y: 250, life: 15 });
    }

    pUnit.hp -= pDmg;
    eUnit.hp -= eDmg;

    // Hit visual overlays
    state.combat.effects.push({ type: "hit", x: 480, y: 250, life: 12 });
    if (pDmg > 0) {
      state.combat.effects.push({ type: "smoke", x: 400, y: 250, life: 15, text: `-${pDmg}`, textColor: "var(--danger)" });
    }
    if (eDmg > 0) {
      state.combat.effects.push({ type: "smoke", x: 560, y: 250, life: 15, text: `-${eDmg}`, textColor: "var(--danger)" });
    }

    combatLog(`${localizedField(pUnit, "name")} ⚔️ ${localizedField(eUnit, "name")}`);

    // Check faints
    scheduleCombatStepCleanup(() => {
      let fainted = false;
      if (pUnit.hp <= 0) {
        playerSquad.shift();
        state.combat.effects.push({ type: "smoke", x: 400, y: 250, life: 20 });
        triggerFaintAbility(pUnit, "player");
        fainted = true;
      }
      if (eUnit.hp <= 0) {
        enemySquad.shift();
        state.combat.effects.push({ type: "smoke", x: 560, y: 250, life: 20 });
        triggerFaintAbility(eUnit, "enemy");
        fainted = true;
      }
      if (fainted) {
        playSynth("faint");
      }
    }, 400);
  }

  function resolveOrderedCombatStep(playerSquad, enemySquad) {
    const slot = state.combat.step % 6;
    state.combat.step++;
    playSynth("hit");

    const actions = [];
    const playerUnit = unitAtFormationSlot(playerSquad, slot);
    const enemyUnit = unitAtFormationSlot(enemySquad, slot);
    if (playerUnit) actions.push(resolveUnitAbility(playerUnit, "player", Math.max(0, playerSquad.indexOf(playerUnit))));
    if (enemyUnit) actions.push(resolveEnemySlotAction(enemyUnit, Math.max(0, enemySquad.indexOf(enemyUnit))));
    const actionText = actions.filter(Boolean).join("  |  ") || `${localizedPhrase("Slot", "\u7b2c", "Espacio")} ${slot + 1}`;
    state.combat.lastAction = actionText;
    combatLog(actionText);

    scheduleCombatStepCleanup(() => {
      const before = playerSquad.length + enemySquad.length;
      removeDefeatedUnits(playerSquad, "player");
      removeDefeatedUnits(enemySquad, "enemy");
      if (before !== playerSquad.length + enemySquad.length) playSynth("faint");
    }, 0);
  }

  function resolveDirectClash(pUnit, eUnit) {
    if (!pUnit || !eUnit) return;
    state.combat.shakeFrames = 10;
    state.combat.shakeTarget = "player";
    markActing("player", 0, "attack");
    const guardText = triggerEnemyGuardAction(eUnit, 0);
    markActing("enemy", 0, guardText ? "cast" : "attack");
    const pPoint = combatPoint("player", 0);
    const ePoint = combatPoint("enemy", 0);
    if (!guardText) damageTarget(pUnit, enemyAttackDamage(eUnit), pPoint.x, pPoint.y);
    damageTarget(eUnit, pUnit.atk, ePoint.x, ePoint.y);
    combatLog(guardText || enemyAttackText(eUnit, `${combatUnitName(pUnit)} ${localizedPhrase("clashes with", "\u8207", "choca con")} ${combatUnitName(eUnit)}`));
  }

  function triggerEnemyGuardAction(unit, slot) {
    if (unit.abilityUsed || unit.ability !== "guard") return "";
    unit.abilityUsed = true;
    const protectedUnit = formationTarget(state.combat.enemySquad, "front") || unit;
    addUnitShield(protectedUnit, 1, "enemy", Math.max(0, state.combat.enemySquad.indexOf(protectedUnit)));
    return `${combatUnitName(unit)} ${localizedPhrase("guards the front", "\u5b88\u8b77\u524d\u6392", "protege la fila delantera")}`;
  }

  function enemyAttackDamage(unit) {
    const packBonus = unit.ability === "pack" && state.combat.enemySquad.some((ally) => ally !== unit && ally.ability === "pack") ? 1 : 0;
    const chargeBonus = unit.ability === "charge" && !unit.abilityUsed ? 1 : 0;
    unit.lastAttackTrait = packBonus ? "pack" : chargeBonus ? "charge" : "";
    unit.abilityUsed = true;
    return unit.atk + packBonus + chargeBonus;
  }

  function enemyAttackText(unit, fallback) {
    if (unit.lastAttackTrait === "pack") return `${combatUnitName(unit)} ${localizedPhrase("uses Pack Bite", "\u767c\u52d5\u7fa4\u9ad4\u54ac\u64ca", "usa Mordisco de Manada")}`;
    if (unit.lastAttackTrait === "charge") return `${combatUnitName(unit)} ${localizedPhrase("uses First Charge", "\u767c\u52d5\u9996\u64ca\u885d\u92d2", "usa Primera Carga")}`;
    return fallback;
  }

  function resolveBossAction(unit, slot) {
    const players = state.combat.playerSquad;
    const enemies = state.combat.enemySquad;
    const damageRow = (mode, multiplier) => {
      const targets = formationTargets(players, mode);
      const damage = Math.max(1, Math.ceil(unit.atk * multiplier));
      targets.forEach((target) => {
        const point = formationTargetPoint("player", players, target);
        damageTarget(target, damage, point.x, point.y);
      });
      return targets.length;
    };

    markActing("enemy", slot, "cast");
    if (unit.ability === "thornBoss") {
      damageRow("front", .8);
      addUnitShield(unit, 1 + Math.floor(unit.level / 3), "enemy", slot);
      return `${combatUnitName(unit)} ${localizedPhrase("unleashes Thornstorm", "\u91cb\u653e\u834a\u68d8\u98a8\u66b4", "desata Tormenta de Espinas")}`;
    }
    if (unit.ability === "crystalBoss") {
      damageRow("back", .85);
      return `${combatUnitName(unit)} ${localizedPhrase("casts Prism Storm", "\u964d\u4e0b\u68f1\u93e1\u98a8\u66b4", "lanza Tormenta Prismática")}`;
    }
    if (unit.ability === "abyssBoss") {
      enemies.forEach((ally, index) => addUnitShield(ally, 1 + Math.floor(unit.level / 4), "enemy", index));
      unit.hp = Math.min(unit.maxHp, unit.hp + 2);
      return `${combatUnitName(unit)} ${localizedPhrase("raises the Sunken Fortress", "\u5c55\u958b\u6c89\u57ce\u8981\u585e", "alza la Fortaleza Sumergida")}`;
    }
    if (unit.ability === "magmaBoss") {
      damageRow("front", 1.05);
      return `${combatUnitName(unit)} ${localizedPhrase("uses Caldera Crash", "\u767c\u52d5\u706b\u5c71\u53e3\u885d\u64ca", "usa Choque de la Caldera")}`;
    }
    if (unit.ability === "eclipseBoss") {
      damageRow("back", .8);
      const front = formationTarget(players, "front");
      if (front) {
        const point = formationTargetPoint("player", players, front);
        damageTarget(front, Math.max(1, Math.ceil(unit.atk * .5)), point.x, point.y);
      }
      return `${combatUnitName(unit)} ${localizedPhrase("casts Twin Moonfall", "\u964d\u4e0b\u96d9\u6708\u661f\u843d", "lanza Doble Caída Lunar")}`;
    }
    players.forEach((target) => {
      const point = formationTargetPoint("player", players, target);
      damageTarget(target, Math.max(1, Math.ceil(unit.atk * .7)), point.x, point.y);
    });
    unit.hp = Math.min(unit.maxHp, unit.hp + 2);
    return `${combatUnitName(unit)} ${localizedPhrase("invokes End of Night", "\u4f7f\u7d42\u591c\u964d\u81e8", "invoca Fin de la Noche")}`;
  }

  function resolveEnemySlotAction(unit, slot) {
    if (unit.isBoss) return resolveBossAction(unit, slot);
    const isGuardAction = !unit.abilityUsed && unit.ability === "guard";
    const isCastAction = isGuardAction || unit.ability === "row" || unit.ability === "heal";
    markActing("enemy", slot, isCastAction ? "cast" : "attack");
    const guardText = triggerEnemyGuardAction(unit, slot);
    if (guardText) return guardText;

    if (unit.ability === "row") {
      const targets = formationTargets(state.combat.playerSquad, "front");
      const damage = Math.max(1, Math.ceil(enemyAttackDamage(unit) * 0.7));
      targets.forEach((target) => {
        const point = formationTargetPoint("player", state.combat.playerSquad, target);
        damageTarget(target, damage, point.x, point.y);
      });
      return `${combatUnitName(unit)} ${localizedPhrase("sweeps the front row", "\u6a6b\u6383\u6574\u6392", "barre la fila delantera")}`;
    }

    if (unit.ability === "heal") {
      healWeakestAlly(state.combat.enemySquad, Math.max(1, Math.ceil(unit.atk * .7)), "enemy");
      return `${combatUnitName(unit)} ${localizedPhrase("heals an ally", "\u6cbb\u7652\u968a\u53cb", "cura a un aliado")}`;
    }

    const target = formationTarget(state.combat.playerSquad, unit.targetMode || "front");
    if (!target) return "";
    const targetIndex = Math.max(0, state.combat.playerSquad.indexOf(target));
    const point = combatPoint("player", targetIndex);
    if (unit.ability === "double") {
      const hit = Math.max(1, Math.ceil(unit.atk * .6));
      damageTarget(target, hit, point.x, point.y);
      damageTarget(target, hit, point.x, point.y);
      return `${combatUnitName(unit)} ${localizedPhrase("strikes twice", "\u767c\u52d5\u96d9\u91cd\u9023\u64ca", "golpea dos veces")}`;
    }
    const damage = enemyAttackDamage(unit);
    damageTarget(target, damage, point.x, point.y);
    if (unit.ability === "drain") unit.hp = Math.min(unit.maxHp, unit.hp + Math.max(1, Math.ceil(damage * .5)));
    const targetLabel = unit.targetMode === "back"
      ? localizedPhrase("strikes the back row", "\u653b\u64ca\u5f8c\u6392", "ataca la fila trasera")
      : localizedPhrase("strikes the front row", "\u653b\u64ca\u524d\u6392", "ataca la fila delantera");
    return enemyAttackText(unit, `${combatUnitName(unit)} ${targetLabel}`);
  }

  function resolveUnitAbility(unit, team, slot) {
    const isPlayer = team === "player";
    const allies = isPlayer ? state.combat.playerSquad : state.combat.enemySquad;
    const enemies = isPlayer ? state.combat.enemySquad : state.combat.playerSquad;
    const enemyTeam = isPlayer ? "enemy" : "player";
    const level = unitLevel(unit);
    const halfAttack = Math.max(1, Math.ceil((unit.atk || 1) * 0.5));

    if (!enemies.length) return "";
    markActing(team, slot, unit.id === 3 || unit.id === 6 || unit.id === 7 || unit.id === 8 ? "cast" : "attack");
    if (unit.id === 1 || unit.id === 5) {
      healWeakestAlly(allies, halfAttack, team);
      return `${combatUnitName(unit)} ${localizedPhrase("heals an ally", "\u6cbb\u7652\u968a\u53cb", "cura a un aliado")}`;
    }
    if (unit.id === 6) {
      addUnitShield(unit, halfAttack, team, slot);
      return `${combatUnitName(unit)} ${localizedPhrase("raises a shield", "\u6490\u8d77\u8b77\u76fe", "alza un escudo")}`;
    }
    if (unit.id === 3) {
      const backlineTargets = formationTargets(enemies, "back");
      const primaryTarget = backlineTargets[0];
      const secondTarget = backlineTargets[1] || null;
      const primaryPoint = formationTargetPoint(enemyTeam, enemies, primaryTarget);
      addCombatEffect("starfall", primaryPoint.x, primaryPoint.y, "", "#b9f7ff");
      damageTarget(primaryTarget, Math.max(1, unit.atk + level - 1), primaryPoint.x, primaryPoint.y);
      if (secondTarget) {
        const secondPoint = formationTargetPoint(enemyTeam, enemies, secondTarget);
        addCombatEffect("starfall", secondPoint.x, secondPoint.y, "", "#b9f7ff");
        damageTarget(secondTarget, Math.max(1, Math.ceil(unit.atk * 0.75)), secondPoint.x, secondPoint.y);
      }
      return `${combatUnitName(unit)} ${localizedPhrase("casts Starfall", "\u964d\u4e0b\u661f\u843d", "lanza Lluvia Estelar")}`;
    }
    if (unit.id === 2 || unit.id === 4) {
      allies.forEach((ally, idx) => addUnitShield(ally, Math.max(1, level), team, idx));
      return `${combatUnitName(unit)} ${localizedPhrase("guards the squad", "\u5b88\u8b77\u5168\u968a", "protege al escuadrón")}`;
    }
    if (unit.id === 7) {
      const targets = formationTargets(enemies, "front");
      const damage = Math.max(1, Math.ceil(unit.atk * 0.7));
      targets.forEach((target) => {
        const point = formationTargetPoint(enemyTeam, enemies, target);
        addCombatEffect("hit", point.x, point.y, "", "#ffd666");
        damageTarget(target, damage, point.x, point.y);
      });
      return `${combatUnitName(unit)} ${localizedPhrase("sweeps the front row", "\u6a6b\u6383\u6574\u6392", "barre la fila delantera")}`;
    }
    if (unit.id === 8) {
      allies.forEach((ally) => {
        ally.atk += Math.max(1, level);
        ally.maxHp += 1;
        ally.hp += 1;
      });
      const point = combatPoint(team, slot);
      addCombatEffect("buff", point.x, point.y, `+${level}`, "#ffd666");
      return `${combatUnitName(unit)} ${localizedPhrase("rallies allies", "\u5f37\u5316\u968a\u53cb", "anima a los aliados")}`;
    }

    const target = formationTarget(enemies, unit.targetMode || "front");
    const point = formationTargetPoint(enemyTeam, enemies, target);
    if (unit.id === 0) {
      damageTarget(target, level, point.x, point.y);
      damageTarget(target, unit.atk, point.x, point.y);
      return `${combatUnitName(unit)} ${localizedPhrase("double-pounces the front row", "\u9023\u7e8c\u8df3\u64ca\u524d\u6392", "salta dos veces sobre la fila delantera")}`;
    }
    damageTarget(target, unit.atk, point.x, point.y);
    return `${combatUnitName(unit)} ${unit.targetMode === "back"
      ? localizedPhrase("attacks the back row", "\u653b\u64ca\u5f8c\u6392", "ataca la fila trasera")
      : localizedPhrase("attacks the front row", "\u653b\u64ca\u524d\u6392", "ataca la fila delantera")}`;
  }

  // Combat Faint triggers
  function triggerFaintAbility(unit, team) {
    const isPlayer = team === "player";
    const squad = isPlayer ? state.combat.playerSquad : state.combat.enemySquad;
    const level = unit.level || 1;

    if (isPlayer) {
      if (unit.id === 4) {
        // Turtle: Melon shield to behind ally
        if (squad.length) {
          squad[0].shield = true;
          state.combat.effects.push({ type: "shield", x: 400 - 100, y: 250, life: 15 });
        }
      } else if (unit.id === 7) {
        // Wolf: give all allies +1/+1
        squad.forEach((c) => {
          c.atk += level;
          c.hp += level;
        });
        state.combat.effects.push({ type: "buff", x: 250, y: 250, life: 20 });
      } else if (unit.id === 9) {
        // Bear: deals 4 dmg to lead enemy
        const enemySquad = state.combat.enemySquad;
        if (enemySquad.length) {
          enemySquad[0].hp -= 4 * level;
          state.combat.effects.push({ type: "hit", x: 560, y: 250, life: 15, text: `-${4 * level}`, textColor: "yellow" });
        }
      }
    }
  }

  // End Battle results
  function completeStageClear(clearedStage) {
    state.activeRun = false;
    save = normalizeSave(save);
    save.clearedRuns++;
    save.bestRound = Math.max(save.bestRound, clearedStage * WAVES_PER_STAGE);
    save.completedStages = [...new Set([...save.completedStages, clearedStage])].sort((a, b) => a - b);
    save.unlockedStage = Math.max(save.unlockedStage, Math.min(STAGE_COUNT, clearedStage + 1));
    save.selectedStage = save.unlockedStage;
    awardTeamXp(12 + clearedStage * 3);
    saveSave();
  }

  function startNextWaveBattle() {
    clearScheduledCombatTimers();
    combatSuspendedForBackground = false;
    const runId = ++combatRunSequence;
    state.combat.enemySquad = generateEnemySquad(state.stage, state.round);
    state.combat.step = 0;
    state.combat.log = [];
    state.combat.status = "";
    state.combat.animating = true;
    state.combat.ending = false;
    state.combat.resolved = false;
    state.combat.runId = runId;
    state.combat.timer = 0;
    combatLastProgressAt = performance.now();
    state.combat.activeActor = null;
    state.combat.activeActors = [];
    state.combat.lastAction = "";
    state.combat.lastFallen = null;
    state.combat.effects = [];
    nodes.prepPhaseArea.classList.add("is-hidden");
    nodes.combatArea.classList.remove("is-hidden");
    nodes.combatSummary?.classList.remove("is-hidden");
    updateHUD();
    const nextBoss = state.combat.enemySquad.find((unit) => unit.isBoss);
    combatLog(nextBoss ? t("bossIncoming", { boss: combatUnitName(nextBoss) }) : t("nextWaveCombat", { round: state.round, total: WAVES_PER_STAGE }));
    updateCombatSummary();
    ensureCombatProgressTimer();
    runCombatAnimation();
    window.WonderAnalytics?.track("battle_wave_start", { game_id: GAME_ID, stage: state.stage, wave: state.round });
  }

  function endBattleRun(result, runId = state.combat.runId) {
    if (runId !== state.combat.runId || state.combat.resolved) return;
    const settledRound = state.round;
    state.combat.resolved = true;
    state.combat.ending = false;
    state.combat.animating = false;
    cancelAnimationFrame(animationId);
    clearScheduledCombatTimers();

    if (result === "win") {
      awardTeamXp(4 + state.stage * 2 + state.round);
      awardTrainingCoins(6 + state.stage * 2 + state.round);
      state.gold += 4 + Math.floor((state.stage + state.round) / 2);
      if (state.round >= WAVES_PER_STAGE) {
        const clearedStage = state.stage;
        completeStageClear(clearedStage);
        openResultScreen(true);
      } else {
        state.round++;
        if (state.round > save.bestRound) {
          save.bestRound = state.round;
          saveSave();
        }
        startNextWaveBattle();
      }
    } else if (result === "lose") {
      awardTeamXp(Math.max(1, state.round));
      awardTrainingCoins(Math.max(2, state.round));
      // Defeat: lose 1 Heart
      state.hearts--;
      updateHUD();
      if (state.hearts <= 0) {
        // Run fail, open Revive draft
        openRevivePopup();
      } else {
        // Return to shop prep
        nodes.prepPhaseArea.classList.remove("is-hidden");
        nodes.combatArea.classList.add("is-hidden");
        nodes.combatSummary?.classList.add("is-hidden");
        startRoundPrep();
        nodes.prepNotice?.classList.add("loss-recap");
        nodes.selectedAbilityPanel?.classList.add("is-hidden");
        showActionNotice(nodes.prepNotice, buildLossRecap(), nodes.startBattleBtn);
      }
    } else {
      awardTrainingCoins(Math.max(2, Math.ceil(state.round / 2)));
      state.gold += 2;
      // Draw: no heart lost, return to shop
      nodes.prepPhaseArea.classList.remove("is-hidden");
      nodes.combatArea.classList.add("is-hidden");
      nodes.combatSummary?.classList.add("is-hidden");
      startRoundPrep();
    }
    window.WonderAnalytics?.track("battle_end", { game_id: GAME_ID, stage: state.stage, wave: settledRound, result });
  }

  // Revival Popup (spend 5 diamonds)
  function openRevivePopup() {
    clearActionNotice(nodes.reviveNotice);
    nodes.defeatRevivePanel.classList.remove("is-hidden");
    nodes.reviveBtn.textContent = t("reviveAction");
    setBattleDecisionOwnership(nodes.defeatRevivePanel, true);
    requestAnimationFrame(() => nodes.reviveBtn.focus({ preventScroll: true }));
  }

  function handleRevive() {
    initAudio();
    clearActionNotice(nodes.reviveNotice);
    if (getWalletDiamonds() < 5) {
      showActionNotice(nodes.reviveNotice, t("noDiamonds"), nodes.reviveBtn);
      playSynth("click");
      return;
    }
    if (spendWalletDiamonds(5)) {
      setBattleDecisionOwnership(nodes.defeatRevivePanel, false);
      nodes.defeatRevivePanel.classList.add("is-hidden");
      state.hearts = 2;
      playSynth("revive");
      
      // Return to shop prep
      nodes.prepPhaseArea.classList.remove("is-hidden");
      nodes.combatArea.classList.add("is-hidden");
      startRoundPrep();
      requestAnimationFrame(focusPreparationOwner);
      window.WonderAnalytics?.track("expedition_revive", { game_id: GAME_ID, cost: 5 });
    }
  }

  function handleGiveUp() {
    initAudio();
    playSynth("click");
    setBattleDecisionOwnership(nodes.defeatRevivePanel, false);
    nodes.defeatRevivePanel.classList.add("is-hidden");
    state.activeRun = false;
    openResultScreen(false);
  }

  // Result Board View
  function battleDecisionActions(panel) {
    return [...panel.querySelectorAll("button:not(:disabled)")]
      .filter((button) => !button.classList.contains("is-hidden"));
  }

  let battleDecisionObserver = null;

  function setCoveredBattleChild(child, panel, active) {
    if (!(child instanceof HTMLElement) || child === panel) return;
    child.inert = active;
    if (active) child.setAttribute("aria-hidden", "true");
    else child.removeAttribute("aria-hidden");
  }

  function setBattleDecisionOwnership(panel, active) {
    battleDecisionObserver?.disconnect();
    battleDecisionObserver = null;
    [...nodes.gamePanel.children].forEach((child) => {
      setCoveredBattleChild(child, panel, active);
    });
    if (!active) return;

    battleDecisionObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((child) => setCoveredBattleChild(child, panel, true));
      });
    });
    battleDecisionObserver.observe(nodes.gamePanel, { childList: true });
  }

  function trapBattleDecisionFocus(panel, event) {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key !== "Tab") return;
    const actions = battleDecisionActions(panel);
    if (!actions.length) return;
    const first = actions[0];
    const last = actions[actions.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function focusPreparationOwner() {
    const owner = nodes.shopRow.querySelector(".card-item:not(.empty-slot)") || nodes.startBattleBtn;
    owner?.focus({ preventScroll: true });
  }

  let resultOwnershipObserver = null;

  function setResultOwnership(active) {
    resultOwnershipObserver?.disconnect();
    resultOwnershipObserver = null;
    [...nodes.gamePanel.children].forEach((child) => {
      if (child === nodes.resultPanel) return;
      child.inert = active;
      if (active) child.setAttribute("aria-hidden", "true");
      else child.removeAttribute("aria-hidden");
    });
    if (!active) return;

    resultOwnershipObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((child) => setCoveredBattleChild(child, nodes.resultPanel, true));
      });
    });
    resultOwnershipObserver.observe(nodes.gamePanel, { childList: true });
  }

  function visibleResultActions() {
    return [...nodes.resultPanel.querySelectorAll("button:not(:disabled)")]
      .filter((button) => !button.classList.contains("is-hidden"));
  }

  function ensureResultActions() {
    const wrapper = nodes.resultPanel.querySelector(".result-actions");
    if (!wrapper) return;
    [nodes.resultMenuBtn, nodes.nextStageBtn, nodes.retryBtn].forEach((button) => wrapper.append(button));
  }

  function commitResultDecision(action) {
    if (resultDecisionCommitted || nodes.resultPanel.classList.contains("is-hidden")) return false;
    resultDecisionCommitted = true;
    action();
    return true;
  }

  function openResultScreen(isWin) {
    resultDecisionCommitted = false;
    const isFinalVictory = isWin && state.stage >= STAGE_COUNT;
    const canAdvance = isWin && state.stage < STAGE_COUNT;
    const primaryAction = canAdvance ? nodes.nextStageBtn : isFinalVictory ? nodes.resultMenuBtn : nodes.retryBtn;
    ensureResultActions();
    nodes.gamePanel.classList.remove("is-hidden");
    nodes.gamePanel.classList.add("is-result");
    nodes.resultPanel.classList.remove("is-hidden");

    nodes.resultTitle.textContent = isWin ? t("expeditionClear") : t("expeditionFail");
    nodes.resultText.textContent = isWin
      ? state.stage < STAGE_COUNT
        ? t("stageClearText", { stage: state.stage, next: state.stage + 1 })
        : t("allStagesClearText")
      : `${t("failText")} (${stageLabel(state.stage)} - ${t("round")} ${state.round}/${WAVES_PER_STAGE})`;
    save = normalizeSave(save);
    const bonus = teamBonus();
    const goal = teamXpGoal(save.teamLevel);
    const remaining = Math.max(0, goal - save.teamXp);
    nodes.resultXpText.textContent = t("resultXpEarned", { earned: state.earnedTeamXp || 0, level: save.teamLevel, xp: save.teamXp, goal });
    nodes.resultGoldText.textContent = t("resultGoldEarned", { earned: state.earnedTrainingCoins || 0, total: save.coins });
    nodes.resultStageText.textContent = t("resultStageSaved", { unlocked: save.unlockedStage, total: STAGE_COUNT });
    nodes.resultGrowthText.textContent = t("resultGrowthNext", { atk: bonus.atk, hp: bonus.hp, remaining });
    [nodes.resultMenuBtn, nodes.nextStageBtn, nodes.retryBtn].forEach((button) => {
      button.classList.remove("is-hidden");
      button.disabled = button === nodes.nextStageBtn && !canAdvance;
      button.classList.toggle("primary-btn", button === primaryAction);
      button.classList.toggle("secondary-btn", button !== primaryAction);
    });
    nodes.skillReportText.innerHTML = `<strong>${t("skillReport")}</strong><br/>${t("skillsLearned")}`;
    nodes.resultPanel.scrollTop = 0;
    const resultCopy = nodes.resultPanel.querySelector(".result-copy");
    if (resultCopy) resultCopy.scrollTop = 0;
    setResultOwnership(true);
    requestAnimationFrame(() => primaryAction.focus({ preventScroll: true }));
    
    playSynth(isWin ? "win" : "fail");
    window.WonderAnalytics?.track("expedition_end", { game_id: GAME_ID, stage: state.stage, wave: state.round, cleared: isWin });
  }

  function openQuitDecision() {
    if (quitDecisionOpen || nodes.gamePanel.classList.contains("is-result")) return;
    quitDecisionOpen = true;
    cancelAnimationFrame(animationId);
    suspendCombatEndTimer();
    $("quitRunText").textContent = t("quitConfirm", { stage: state.stage, round: state.round, hearts: state.hearts, supplies: state.gold });
    nodes.quitRunPanel.classList.remove("is-hidden");
    setBattleDecisionOwnership(nodes.quitRunPanel, true);
    nodes.keepPlayingBtn.focus({ preventScroll: true });
  }

  function closeQuitDecision(resume = true) {
    if (!quitDecisionOpen) return;
    quitDecisionOpen = false;
    setBattleDecisionOwnership(nodes.quitRunPanel, false);
    nodes.quitRunPanel.classList.add("is-hidden");
    if (resume) resumeCombatEndTimer();
    if (resume && state.combat.animating && !document.hidden) {
      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(runCombatAnimation);
    }
    if (resume) nodes.quitRunBtn.focus({ preventScroll: true });
  }

  function confirmQuitRun() {
    closeQuitDecision(false);
    initAudio();
    playSynth("sell");
    state.activeRun = false;
    showStageSelection();
  }

  function suspendBackgroundCombat() {
    suspendSkinPurchaseDecision();
    suspendCombatEndTimer();
    if (!state.combat.animating) return;
    combatSuspendedForBackground = true;
    combatLastProgressAt = 0;
    cancelAnimationFrame(animationId);
  }

  function resumeBackgroundCombat() {
    if (document.hidden) return;
    resumeSkinPurchaseDecision();
    resumeCombatEndTimer();
    if (!combatSuspendedForBackground || !state.combat.animating || quitDecisionOpen) return;
    combatSuspendedForBackground = false;
    combatLastProgressAt = performance.now();
    ensureCombatProgressTimer();
    animationId = requestAnimationFrame(runCombatAnimation);
  }

  function reclaimVisibleForeground(event) {
    if (!event?.isTrusted || document.hidden) return false;
    if (windowFocused) return true;
    windowFocused = true;
    resumeBackgroundCombat();
    return true;
  }

  // Event Listeners Registration
  function setupEvents() {
    nodes.showStageBtn.addEventListener("click", showStageSelection);
    nodes.showStageBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.stageBackBtn.addEventListener("click", renderMenu);
    nodes.stageTabBtn?.addEventListener("click", () => setStageTab("stages"));
    nodes.trainingTabBtn?.addEventListener("click", () => setStageTab("training"));
    nodes.stageTabBtn?.addEventListener("keydown", handleStageTabKeydown);
    nodes.trainingTabBtn?.addEventListener("keydown", handleStageTabKeydown);
    nodes.stageRail.addEventListener("scroll", scheduleStageBrowseUpdate, { passive: true });
    nodes.stageRail.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ") && event.target.closest(".stage-card")) event.preventDefault();
      handleStageCardKeydown(event);
    });
    nodes.rerollShopBtn.addEventListener("click", rerollShop);
    nodes.rerollRelicsBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
    nodes.rerollRelicsBtn.addEventListener("focus", updateRelicRerollDecision);
    nodes.relicDraftPanel.addEventListener("keydown", (event) => trapBattleDecisionFocus(nodes.relicDraftPanel, event));
    nodes.defeatRevivePanel.addEventListener("keydown", (event) => trapBattleDecisionFocus(nodes.defeatRevivePanel, event));
    nodes.quitRunPanel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeQuitDecision(true);
        return;
      }
      trapBattleDecisionFocus(nodes.quitRunPanel, event);
    });
    nodes.startBattleBtn.addEventListener("click", startBattle);
    nodes.gamePanel.addEventListener("pointerdown", reclaimVisibleForeground, true);
    nodes.gamePanel.addEventListener("keydown", reclaimVisibleForeground, true);
    nodes.quitRunBtn.addEventListener("click", openQuitDecision);
    nodes.keepPlayingBtn.addEventListener("click", () => closeQuitDecision(true));
    nodes.confirmQuitBtn.addEventListener("click", confirmQuitRun);
    
    nodes.buySkinBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    nodes.buySkinBtn.addEventListener("click", handleBuySkin);
    nodes.equipSkinBtn.addEventListener("click", handleEquipSkin);
    
    nodes.reviveBtn.addEventListener("click", handleRevive);
    nodes.giveUpBtn.addEventListener("click", handleGiveUp);
    
    nodes.retryBtn.addEventListener("click", () => commitResultDecision(() => {
      nodes.resultPanel.classList.add("is-hidden");
      save = normalizeSave(save);
      save.selectedStage = state.stage;
      saveSave();
      startExpedition();
    }));
    nodes.nextStageBtn.addEventListener("click", () => commitResultDecision(() => {
      save = normalizeSave(save);
      save.selectedStage = Math.min(save.unlockedStage, state.stage + 1);
      saveSave();
      nodes.resultPanel.classList.add("is-hidden");
      startExpedition();
    }));
    nodes.resultMenuBtn.addEventListener("click", () => commitResultDecision(showStageSelection));
    nodes.resultPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (event.key !== "Tab") return;
      const actions = visibleResultActions();
      if (!actions.length) return;
      const first = actions[0];
      const last = actions.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("blur", () => {
      windowFocused = false;
    });
    window.addEventListener("focus", () => {
      windowFocused = true;
      resumeBackgroundCombat();
    });
    window.addEventListener("pagehide", suspendBackgroundCombat);
    window.addEventListener("pageshow", resumeBackgroundCombat);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) suspendBackgroundCombat();
      else resumeBackgroundCombat();
    });

    nodes.localeSelect.addEventListener("change", (e) => {
      setLocale(e.target.value);
    });

    nodes.sellCardBtn.addEventListener("click", handleRunUpgradeSelected);

    window.addEventListener("wonder:locale-change", (e) => {
      const next = e.detail?.locale || window.WonderI18n?.locale?.();
      if (next && next !== locale) {
        setLocale(next);
      }
    });

    // Close overlays on document tap to reset selections
    document.addEventListener("click", () => {
      if (selectedSlot !== null) {
        selectedSlot = null;
        highlightSelectedCard(false);
        renderPrepScreen();
      }
    });
  }

  function updateBattleViewport() {
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width >= window.innerWidth * 0.75 ? viewport.width : window.innerWidth;
    const viewportHeight = viewport?.height >= window.innerHeight * 0.75 ? viewport.height : window.innerHeight;
    document.documentElement.style.setProperty("--squad-vw", `${viewportWidth}px`);
    document.documentElement.style.setProperty("--squad-vh", `${viewportHeight}px`);
    const availableWidth = Math.max(1, Math.min(viewportWidth, 920));
    const availableHeight = Math.max(1, viewportHeight - 56);
    const canvasLeft = Math.max(0, (viewportWidth - availableWidth) / 2);
    const stageScale = Math.max(0.01, Math.min(availableWidth / 390, availableHeight / 788));
    const stageLogicalWidth = availableWidth / stageScale;
    const stageLogicalHeight = availableHeight / stageScale;
    const battleScale = Math.max(0.01, Math.min(availableWidth / 382, availableHeight / 780));
    const battleLogicalWidth = availableWidth / battleScale;
    const battleLogicalHeight = availableHeight / battleScale;
    document.documentElement.style.setProperty("--squad-stage-scale", String(stageScale));
    document.documentElement.style.setProperty("--squad-stage-width", `${stageLogicalWidth}px`);
    document.documentElement.style.setProperty("--squad-stage-height", `${stageLogicalHeight}px`);
    document.documentElement.style.setProperty("--squad-stage-rendered-width", `${availableWidth}px`);
    document.documentElement.style.setProperty("--squad-canvas-left", `${canvasLeft}px`);
    document.documentElement.style.setProperty("--squad-battle-width", `${battleLogicalWidth}px`);
    document.documentElement.style.setProperty("--squad-battle-height", `${battleLogicalHeight}px`);
    document.documentElement.style.setProperty("--squad-battle-scale", String(battleScale));
    updateTrainingStageCanvas();
    pinMainSoundToggle();
  }

  updateBattleViewport();
  window.addEventListener("resize", updateBattleViewport, { passive: true });
  window.visualViewport?.addEventListener("resize", updateBattleViewport, { passive: true });

  // Initialization
  startApp();

})();
