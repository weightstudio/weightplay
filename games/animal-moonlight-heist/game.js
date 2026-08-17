(() => {
  const $ = (s) => document.querySelector(s);
  const GAME_VERSION = 17, INTERFACE_VERSION = 6;
  const viewportBucket = () => {
    const width = window.innerWidth || 0, height = window.innerHeight || 0;
    return height <= 430 ? "short-landscape" : width <= 430 ? "phone" : width >= 1000 ? "desktop" : "tablet";
  };
  const track = (event, data = {}) => {
    try {
      window.WonderAnalytics?.track?.(event, {
        game_id: "animal-moonlight-heist",
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale,
        viewport_bucket: viewportBucket(),
        ...data,
      });
    } catch {}
  };
  // General Stage and Battle/Result fill the complete safe physical width.
  // Apply the game-local request before the directly loaded shared owners run.
  $(".stage-canvas")?.setAttribute("data-wp-canvas-max-width", "920");
  $(".stage-canvas")?.setAttribute("data-wp-stage-landscape-width", "760");
  $(".stage-canvas")?.setAttribute("data-wp-stage-landscape-height", "334");
  $(".battle-canvas")?.setAttribute("data-wp-canvas-max-width", "920");
  const KEY = "weightplay_moonlight_heist_v1";
  const localeKey = "weightPlayLocale", legacyLocaleKey = "weightplayLocale";
  const readOptionalStorage = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const writeOptionalStorage = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const copy = {
    en:{title:"Animal Moonlight Heist",internal:"Moon Archive Missions",pitch:"Read the patrols, recover the relic, and choose when to extract.",start:"Start Game",missions:"Moon Archive",chooseGadget:"Choose Gadget",alert:"Alert",holdRoute:"Hold to preview a route.",objective:"Recover the mission object",locked:"Complete the previous mission",retry:"Retry",next:"Next Mission",victory:"Mission Complete",captured:"Captured",capturedText:"The patrol raised the alarm. Retry is free.",treasure:"Bonus treasure recovered",extraction:"Reach the extraction gate",dash:"Lightning Dash",decoy:"Star Decoy",smoke:"Smoke Leaf",dashEffect:"Fast route: {ms}ms move",decoyEffect:"Patrol pause: {seconds}s",smokeEffect:"Alert reset + {seconds}s cover",coins:"Moon Coins",safehouse:"Safehouse Lv.{n}",mission:"Mission {n}",move:"Release to move",found:"Object secured!",exitReady:"Extraction ready",treasureFound:"Treasure secured",paused:"Paused",diamonds:"Diamonds",reroll:"Reroll 3",insure:"Insure 5",insured:"Insured",alreadyInsured:"Extraction insurance is already active.",notEnough:"Not enough Diamonds.",rerolled:"Gadget offers rerolled.",insuranceReady:"Extraction insurance active for the next mission.",confirmSpend:"Confirm {cost} · {before}→{after}",rerollDecision:"Reroll all three gadget strengths. Tap again to confirm: {before} → {after} Diamonds.",insuranceDecision:"Keep bonus treasure after one capture in the next mission. Tap again to confirm: {before} → {after} Diamonds.",rerollLabel:"Reroll all three gadget strengths. Costs 3 Diamonds. Current balance {balance}.",insuranceLabel:"Insure bonus treasure for one capture in the next mission. Costs 5 Diamonds. Current balance {balance}.",confirmLabel:"Confirm {action}. Spend {cost} Diamonds. Balance {before} to {after}.",rerollAction:"gadget strength reroll",insuranceAction:"treasure insurance",insuredLabel:"Treasure insurance is active for the next mission."},
    "zh-Hant":{title:"動物月影潛行隊",internal:"月光檔案任務",pitch:"觀察巡邏、找回文物，並決定何時安全撤離。",start:"開始遊戲",missions:"月光檔案館",chooseGadget:"選擇技能",alert:"警戒",holdRoute:"按住畫面預覽路線。",objective:"找回任務物件",locked:"先完成上一個任務",retry:"重試",next:"下一關",victory:"任務完成",captured:"被發現了",capturedText:"巡邏隊已拉滿警戒。免費重新挑戰。",treasure:"已取得額外寶藏",extraction:"前往撤離門",dash:"閃電衝刺",decoy:"星光誘餌",smoke:"煙霧葉片",coins:"月光金幣",safehouse:"安全屋 Lv.{n}",mission:"任務 {n}",move:"放開即可移動",found:"已取得任務物件！",exitReady:"撤離門已開啟",treasureFound:"已取得寶藏",paused:"已暫停",diamonds:"鑽石",reroll:"重抽 3",insure:"保險 5",insured:"已投保",alreadyInsured:"撤離保險已啟用。",confirmReroll:"要花費 3 顆鑽石重抽技能強度嗎？",confirmInsurance:"要花費 5 顆鑽石，在被發現後保留額外寶藏嗎？",notEnough:"鑽石不足。",rerolled:"已重抽技能方案。",insuranceReady:"下一個任務已啟用撤離保險。"}
  };
  copy["zh-Hans"]={title:"动物月影潜行队",internal:"月光档案任务",pitch:"观察巡逻、找回文物，并决定何时安全撤离。",start:"开始游戏",missions:"月光档案馆",chooseGadget:"选择装置",alert:"警报",holdRoute:"按住画面预览路线。",objective:"找回任务物品",locked:"请先完成上一项任务",retry:"重试",next:"下一任务",victory:"任务完成",captured:"被发现了",capturedText:"巡逻队已拉响警报。可免费重试。",treasure:"已取得额外宝藏",extraction:"前往撤离门",dash:"闪电冲刺",decoy:"星光诱饵",smoke:"烟雾叶片",dashEffect:"快速路线：{ms} 毫秒移动",decoyEffect:"巡逻暂停：{seconds} 秒",smokeEffect:"警报归零 + {seconds} 秒掩护",coins:"月光金币",safehouse:"安全屋等级 {n}",mission:"任务 {n}",move:"松开即可移动",found:"已取得任务物品！",exitReady:"撤离门已开启",treasureFound:"已取得宝藏",paused:"已暂停",diamonds:"钻石",reroll:"重抽 3",insure:"保险 5",insured:"已投保",alreadyInsured:"撤离保险已启用。",notEnough:"钻石不足。",rerolled:"已重抽装置方案。",insuranceReady:"下一任务已启用撤离保险。",confirmSpend:"确认 {cost} · {before}→{after}",rerollDecision:"重抽全部三个装置强度。再次点击确认：{before} → {after} 钻石。",insuranceDecision:"下一任务中被发现一次后仍保留额外宝藏。再次点击确认：{before} → {after} 钻石。",rerollLabel:"重抽全部三个装置强度。花费 3 颗钻石。当前余额 {balance}。",insuranceLabel:"为下一任务的额外宝藏投保一次。花费 5 颗钻石。当前余额 {balance}。",confirmLabel:"确认{action}。花费 {cost} 颗钻石。余额从 {before} 变为 {after}。",rerollAction:"装置强度重抽",insuranceAction:"宝藏保险",insuredLabel:"下一任务的宝藏保险已启用。",notCleared:"尚未完成",bestMedals:"最佳 {medals}/3 枚奖章",perfectMedals:"最佳 3/3 枚奖章 · 已完成",bonusMedal:"取得额外宝藏可获得最后一枚奖章。",medalCount:"已获得 {medals}/3 枚奖章",resultMedals:"{medals}/3 枚奖章",pauseAction:"暂停任务",resumeAction:"继续任务",playFieldLabel:"潜行路线区。使用 WASD 或方向键移动，按空格键使用装置。",playFieldPassiveLabel:"潜行路线区。使用 WASD 或方向键移动。{name}是被动效果：{effect}。",playFieldActiveLabel:"潜行路线区。使用 WASD 或方向键移动，按空格键使用{name}：{effect}。",passiveGadgetLabel:"{name}是被动效果：{effect}。",activeGadgetLabel:"使用{name}：{effect}。",passive:"被动",languageLabel:"语言",posterAlt:"动物月影潜行队游戏海报",orlaAlt:"月帽欧拉",missionRailLabel:"任务选择",fiaAlt:"闪爪菲亚",stageBackLabel:"返回主菜单",battleBackLabel:"返回任务选择",checkpoint:"守卫检查点",firstSeal:"请先取得宝藏封印。",mirrorWarning:"镜面即将换位！",bellWarning:"月钟即将响起，快进入阴影！",clockSlow:"蓝色阶段：巡逻较慢。",clockSurge:"琥珀阶段：巡逻加速！",guardianCleared:"已通过守卫路线"};
  copy.es={title:"Golpe Animal a la Luz de la Luna",internal:"Misiones del Archivo Lunar",pitch:"Observa las patrullas, recupera la reliquia y decide cuándo evacuar.",start:"Comenzar juego",missions:"Archivo Lunar",chooseGadget:"Elegir dispositivo",alert:"Alerta",holdRoute:"Mantén pulsado para previsualizar una ruta.",objective:"Recupera el objeto de la misión",locked:"Completa la misión anterior",retry:"Reintentar",next:"Siguiente misión",victory:"Misión completada",captured:"Descubierto",capturedText:"La patrulla dio la alarma. Reintentar es gratis.",treasure:"Tesoro adicional recuperado",extraction:"Llega a la puerta de evacuación",dash:"Impulso relámpago",decoy:"Señuelo estelar",smoke:"Hoja de humo",dashEffect:"Ruta rápida: movimiento de {ms} ms",decoyEffect:"Pausa de patrulla: {seconds} s",smokeEffect:"Alerta reiniciada + {seconds} s de cobertura",coins:"Monedas lunares",safehouse:"Refugio Nv.{n}",mission:"Misión {n}",move:"Suelta para moverte",found:"¡Objeto asegurado!",exitReady:"Evacuación preparada",treasureFound:"Tesoro asegurado",paused:"En pausa",diamonds:"Diamantes",reroll:"Cambiar 3",insure:"Asegurar 5",insured:"Asegurado",alreadyInsured:"El seguro de evacuación ya está activo.",notEnough:"No tienes suficientes diamantes.",rerolled:"Se cambiaron las opciones de dispositivo.",insuranceReady:"Seguro de evacuación activo para la próxima misión.",confirmSpend:"Confirmar {cost} · {before}→{after}",rerollDecision:"Cambia la potencia de los tres dispositivos. Toca otra vez para confirmar: {before} → {after} diamantes.",insuranceDecision:"Conserva el tesoro adicional tras ser descubierto una vez en la próxima misión. Toca otra vez para confirmar: {before} → {after} diamantes.",rerollLabel:"Cambiar la potencia de los tres dispositivos. Cuesta 3 diamantes. Saldo actual: {balance}.",insuranceLabel:"Asegura el tesoro adicional frente a una captura en la próxima misión. Cuesta 5 diamantes. Saldo actual: {balance}.",confirmLabel:"Confirma {action}. Gasta {cost} diamantes. Saldo de {before} a {after}.",rerollAction:"cambio de potencia de dispositivos",insuranceAction:"seguro del tesoro",insuredLabel:"El seguro del tesoro está activo para la próxima misión."};
  Object.assign(copy.en, {
    routeExposed: "Red route: patrol sight will raise Alert.",
    pickupCover: "Object secured — move now while patrols hesitate!",
    notCleared: "Not cleared",
    bestMedals: "Best {medals}/3 medals",
    perfectMedals: "Best 3/3 medals · Complete",
    bonusMedal: "Bonus treasure earns the final medal.",
    medalCount: "{medals} of 3 medals earned",
    resultMedals: "{medals}/3 medals",
    pauseAction: "Pause mission",
    resumeAction: "Resume mission",
    playFieldLabel: "Stealth route field. Use WASD or arrow keys to move and Space to use the gadget.",
    playFieldPassiveLabel: "Stealth route field. Use WASD or arrow keys to move. {name} is passive: {effect}.",
    playFieldActiveLabel: "Stealth route field. Use WASD or arrow keys to move and Space to use {name}: {effect}.",
    passiveGadgetLabel: "{name} is passive: {effect}.",
    activeGadgetLabel: "Use {name}: {effect}.",
    passive: "Passive",
    languageLabel: "Language",
    posterAlt: "Animal Moonlight Heist poster",
    orlaAlt: "Moon Cap Orla",
    missionRailLabel: "Missions",
    fiaAlt: "Spark Paw Fia",
    stageBackLabel: "Back to main menu",
    battleBackLabel: "Back to missions",
    checkpoint: "Guardian Checkpoint",
    firstSeal: "Recover the treasure seal first.",
    mirrorWarning: "Mirror shift incoming!",
    bellWarning: "Bell pulse incoming—reach shadow!",
    clockSlow: "Blue phase: patrols are slow.",
    clockSurge: "Amber phase: patrols surge!",
    guardianCleared: "Guardian route cleared",
  });
  Object.assign(copy["zh-Hant"], {
    routeExposed: "\u7d05\u8272\u8def\u7dda\uff1a\u9032\u5165\u5de1\u908f\u8996\u91ce\u6703\u63d0\u9ad8\u8b66\u5831\u3002",
    pickupCover: "\u5df2\u53d6\u5f97\u4efb\u52d9\u7269\u54c1\u2014\u2014\u8d81\u5de1\u908f\u9072\u7591\u6642\u7acb\u5373\u79fb\u52d5\uff01",
    notCleared: "\u5c1a\u672a\u5b8c\u6210",
    bestMedals: "\u6700\u4f73 {medals}/3 \u679a\u734e\u7ae0",
    perfectMedals: "\u6700\u4f73 3/3 \u679a\u734e\u7ae0 \u00b7 \u5df2\u5b8c\u6210",
    bonusMedal: "\u56de\u6536\u984d\u5916\u5bf6\u85cf\u53ef\u7372\u5f97\u6700\u5f8c\u4e00\u679a\u734e\u7ae0\u3002",
    medalCount: "\u5df2\u7372\u5f97 {medals}/3 \u679a\u734e\u7ae0",
    resultMedals: "{medals}/3 \u679a\u734e\u7ae0",
    pauseAction: "\u66ab\u505c\u4efb\u52d9",
    resumeAction: "\u7e7c\u7e8c\u4efb\u52d9",
    playFieldLabel: "\u6f5b\u884c\u8def\u7dda\u5340\u3002\u4f7f\u7528 WASD \u6216\u65b9\u5411\u9375\u79fb\u52d5\uff0c\u6309\u7a7a\u767d\u9375\u4f7f\u7528\u88dd\u7f6e\u3002",
    playFieldPassiveLabel: "\u6f5b\u884c\u8def\u7dda\u5340\u3002\u4f7f\u7528 WASD \u6216\u65b9\u5411\u9375\u79fb\u52d5\u3002{name}\u662f\u88ab\u52d5\u6548\u679c\uff1a{effect}\u3002",
    playFieldActiveLabel: "\u6f5b\u884c\u8def\u7dda\u5340\u3002\u4f7f\u7528 WASD \u6216\u65b9\u5411\u9375\u79fb\u52d5\uff0c\u6309\u7a7a\u767d\u9375\u4f7f\u7528{name}\uff1a{effect}\u3002",
    passiveGadgetLabel: "{name}\u662f\u88ab\u52d5\u6548\u679c\uff1a{effect}\u3002",
    activeGadgetLabel: "\u4f7f\u7528{name}\uff1a{effect}\u3002",
    passive: "\u88ab\u52d5",
    languageLabel: "\u8a9e\u8a00",
    posterAlt: "\u52d5\u7269\u6708\u5f71\u6f5b\u884c\u968a\u904a\u6232\u6d77\u5831",
    orlaAlt: "\u6708\u5e3d\u6b50\u62c9",
    missionRailLabel: "\u4efb\u52d9\u9078\u64c7",
    fiaAlt: "\u9583\u722a\u83f2\u4e9e",
    stageBackLabel: "\u8fd4\u56de\u4e3b\u9078\u55ae",
    battleBackLabel: "\u8fd4\u56de\u4efb\u52d9\u9078\u64c7",
    checkpoint: "守衛檢查點",
    firstSeal: "請先取得寶藏封印。",
    mirrorWarning: "鏡面即將換位！",
    bellWarning: "月鐘即將響起，快進入陰影！",
    clockSlow: "藍色階段：巡邏較慢。",
    clockSurge: "琥珀階段：巡邏加速！",
    guardianCleared: "已通過守衛路線",
  });
  Object.assign(copy.es, {
    notCleared:"Sin completar", bestMedals:"Mejor: {medals}/3 medallas", perfectMedals:"Mejor: 3/3 medallas · Completada", bonusMedal:"El tesoro adicional concede la última medalla.", medalCount:"{medals} de 3 medallas obtenidas", resultMedals:"{medals}/3 medallas", pauseAction:"Pausar misión", resumeAction:"Continuar misión", playFieldLabel:"Ruta de sigilo. Usa WASD o las flechas para moverte y Espacio para usar el dispositivo.", playFieldPassiveLabel:"Ruta de sigilo. Usa WASD o las flechas para moverte. {name} es pasivo: {effect}.", playFieldActiveLabel:"Ruta de sigilo. Usa WASD o las flechas para moverte y Espacio para usar {name}: {effect}.", passiveGadgetLabel:"{name} es pasivo: {effect}.", activeGadgetLabel:"Usa {name}: {effect}.", passive:"Pasivo", languageLabel:"Idioma", posterAlt:"Cartel de Golpe Animal a la Luz de la Luna", orlaAlt:"Orla Sombrero Lunar", missionRailLabel:"Misiones", fiaAlt:"Fia Garra Chispeante", stageBackLabel:"Volver al menú principal", battleBackLabel:"Volver a las misiones", checkpoint:"Puesto del guardián", firstSeal:"Recupera primero el sello del tesoro.", mirrorWarning:"¡Se acerca un cambio de espejos!", bellWarning:"¡Se acerca el pulso de la campana! ¡Busca una sombra!", clockSlow:"Fase azul: las patrullas van despacio.", clockSurge:"¡Fase ámbar: las patrullas aceleran!", guardianCleared:"Ruta del guardián completada"
  });
  copy.ru={title:"Звери: тайна Лунного архива",internal:"Задания Лунного архива",pitch:"Следите за патрулями, возвращайте реликвии и выбирайте момент для эвакуации.",start:"Начать игру",missions:"Лунный архив",chooseGadget:"Выберите устройство",alert:"Тревога",holdRoute:"Удерживайте, чтобы наметить маршрут.",objective:"Верните предмет задания",locked:"Сначала завершите предыдущее задание",retry:"Повторить",next:"Следующее задание",victory:"Задание выполнено",captured:"Обнаружены",capturedText:"Патруль поднял тревогу. Повторная попытка бесплатна.",treasure:"Дополнительное сокровище найдено",extraction:"Доберитесь до точки эвакуации",dash:"Молниеносный рывок",decoy:"Звёздная приманка",smoke:"Дымчатый лист",dashEffect:"Быстрый маршрут: перемещение за {ms} мс",decoyEffect:"Патрули остановлены на {seconds} с",smokeEffect:"Тревога сброшена, укрытие на {seconds} с",coins:"Лунные монеты",safehouse:"Убежище, ур. {n}",mission:"Задание {n}",move:"Отпустите, чтобы переместиться",found:"Предмет получен!",exitReady:"Эвакуация доступна",treasureFound:"Сокровище получено",paused:"Пауза",diamonds:"Алмазы",reroll:"Смена · 3",insure:"Защита · 5",insured:"Застраховано",alreadyInsured:"Страховка эвакуации уже действует.",notEnough:"Недостаточно алмазов.",rerolled:"Сила трёх устройств обновлена.",insuranceReady:"Страховка эвакуации действует в следующем задании.",confirmSpend:"Подтвердить за {cost} · {before}→{after}",rerollDecision:"Обновить силу всех трёх устройств. Нажмите ещё раз для подтверждения: {before} → {after} алмазов.",insuranceDecision:"Сохранить дополнительное сокровище после одного обнаружения в следующем задании. Нажмите ещё раз для подтверждения: {before} → {after} алмазов.",rerollLabel:"Обновить силу всех трёх устройств. Цена: 3 алмаза. Текущий баланс: {balance}.",insuranceLabel:"Застраховать дополнительное сокровище от одного обнаружения в следующем задании. Цена: 5 алмазов. Текущий баланс: {balance}.",confirmLabel:"Подтвердите действие «{action}». Потратить {cost} алмазов. Баланс: {before} → {after}.",rerollAction:"обновление силы устройств",insuranceAction:"страховка сокровища",insuredLabel:"Сокровище застраховано от одного обнаружения в следующем задании.",notCleared:"Не завершено",bestMedals:"Лучший результат: {medals}/3 медалей",perfectMedals:"Лучший результат: 3/3 медалей · Завершено",bonusMedal:"Дополнительное сокровище приносит третью медаль.",medalCount:"Получено медалей: {medals}/3",resultMedals:"Медали: {medals}/3",pauseAction:"Приостановить задание",resumeAction:"Продолжить задание",playFieldLabel:"Поле скрытного маршрута. Двигайтесь клавишами WASD или стрелками, устройство используется пробелом.",playFieldPassiveLabel:"Поле скрытного маршрута. Двигайтесь клавишами WASD или стрелками. {name} действует постоянно: {effect}.",playFieldActiveLabel:"Поле скрытного маршрута. Двигайтесь клавишами WASD или стрелками, используйте {name} пробелом: {effect}.",passiveGadgetLabel:"{name} действует постоянно: {effect}.",activeGadgetLabel:"Использовать {name}: {effect}.",passive:"Постоянный эффект",languageLabel:"Язык",posterAlt:"Постер игры «Звери: тайна Лунного архива»",orlaAlt:"Орла в лунной шляпе",missionRailLabel:"Выбор задания",fiaAlt:"Искролапка Фиа",stageBackLabel:"Вернуться в главное меню",battleBackLabel:"Вернуться к заданиям",checkpoint:"Испытание хранителя",firstSeal:"Сначала верните печать сокровища.",mirrorWarning:"Скоро метки поменяются местами!",bellWarning:"Скоро удар колокола — укройтесь в тени!",clockSlow:"Синяя фаза: патрули замедлены.",clockSurge:"Янтарная фаза: патрули ускорились!",guardianCleared:"Маршрут хранителя пройден"};
  const missionObjects=["moon-seal","courier-token","star-map","clockwork-lens","district-relic"];
  const patrolArt=["wolf","rabbit","badger"];
  const missions=[
    {name:["Archive Entrance","檔案館入口"],object:[50,44],treasure:[82,38],exit:[50,10],patrols:[[28,34,72,34]]},
    {name:["Lantern Hall","燈火長廊"],object:[25,30],treasure:[80,72],exit:[50,10],patrols:[[20,55,78,55],[68,25,68,78]]},
    {name:["Echo Gallery","回音畫廊"],object:[75,32],treasure:[22,28],exit:[50,10],patrols:[[18,42,82,42],[26,75,74,75]]},
    {name:["Clockwork Vault","發條密庫"],object:[24,24],treasure:[82,32],exit:[50,10],patrols:[[20,48,78,48],[34,22,34,78],[68,24,68,76]]},
    {name:["Moon Gate","月之門"],object:[50,42],treasure:[84,76],exit:[50,10],patrols:[[18,30,82,30],[22,62,78,62],[28,78,28,38]]}
  ];
  const gadgets={dash:{art:"lightning-dash"},decoy:{art:"star-decoy"},smoke:{art:"smoke-leaf"}};
  const guardianCatalog={
    spotlight:{id:"lantern-auditor",name:["Lantern Auditor","提燈審查官"],behavior:"spotlight",path:[18,24,82,24]},
    bell:{id:"bell-warden",name:["Bell Warden","月鐘守衛"],behavior:"bell",path:[18,50,82,50]},
    mirror:{id:"mirror-keeper",name:["Mirror Keeper","星鏡看守"],behavior:"mirror",path:[24,30,76,70]},
    clock:{id:"clockwork-marshal",name:["Clockwork Marshal","發條巡察長"],behavior:"clock",path:[18,42,82,42]},
    seals:{id:"vault-sealkeeper",name:["Vault Sealkeeper","寶庫封印官"],behavior:"seals",path:[26,34,74,34]},
    eclipse:{id:"eclipse-curator",name:["Eclipse Curator","日蝕館長"],behavior:"eclipse",path:[18,26,82,70]}
  };
  const gadgetUseCases = {
    en: {dashUse:"Best for crossing long patrol sightlines.",decoyUse:"Best when patrol routes converge.",smokeUse:"Best for recovering from high Alert."},
    "zh-Hant": {dashUse:"適合快速穿越長距離巡邏視線。",decoyUse:"適合兩條巡邏路線交會時。",smokeUse:"適合警報偏高時脫離危險。"},
    "zh-Hans": {dashUse:"适合快速穿越较长的巡逻视线。",decoyUse:"适合两条巡逻路线交会时。",smokeUse:"适合警报较高时脱离危险。"},
    ja: {dashUse:"長い巡回視線を素早く横切る時に最適。",decoyUse:"複数の巡回ルートが交差する時に最適。",smokeUse:"警戒度が高い時の立て直しに最適。"},
    ko: {dashUse:"긴 순찰 시야를 빠르게 통과할 때 적합합니다.",decoyUse:"순찰 경로가 겹칠 때 적합합니다.",smokeUse:"경계 수치가 높을 때 회복하기 좋습니다."},
    es: {dashUse:"Ideal para cruzar líneas de visión largas.",decoyUse:"Ideal cuando convergen rutas de patrulla.",smokeUse:"Ideal para recuperarte con la alerta alta."},
    "pt-BR": {dashUse:"Ideal para cruzar longas linhas de visão.",decoyUse:"Ideal quando rotas de patrulha convergem.",smokeUse:"Ideal para se recuperar com o Alerta alto."},
    fr: {dashUse:"Idéal pour traverser de longues lignes de vue.",decoyUse:"Idéal quand les rondes convergent.",smokeUse:"Idéal pour récupérer avec une alerte élevée."},
    de: {dashUse:"Ideal zum Überqueren langer Sichtlinien.",decoyUse:"Ideal, wenn sich Patrouillenwege kreuzen.",smokeUse:"Ideal, um sich bei hohem Alarm zu erholen."},
    it: {dashUse:"Ideale per attraversare lunghe linee di vista.",decoyUse:"Ideale quando i percorsi delle pattuglie convergono.",smokeUse:"Ideale per recuperare con Allerta alta."},
    ru: {dashUse:"Лучше всего для быстрого пересечения длинной линии обзора.",decoyUse:"Лучше всего, когда маршруты патрулей сходятся.",smokeUse:"Лучше всего для спасения при высокой тревоге."},
    hi: {dashUse:"लंबी गश्ती दृष्टि-रेखा को जल्दी पार करने के लिए श्रेष्ठ।",decoyUse:"गश्ती मार्गों के मिलने पर श्रेष्ठ।",smokeUse:"चेतावनी अधिक होने पर संभलने के लिए श्रेष्ठ।"},
    ar: {dashUse:"الأفضل لعبور خطوط رؤية الدوريات الطويلة بسرعة.",decoyUse:"الأفضل عند تقاطع مسارات الدوريات.",smokeUse:"الأفضل للتعافي عندما يكون مستوى الإنذار مرتفعًا."},
  };
  Object.entries(gadgetUseCases).forEach(([code, values]) => Object.assign(copy[code] ||= {}, values));
  const nextMissionPreviewCopy={
    en:"Next mission: {rule}","zh-Hant":"下一關：{rule}","zh-Hans":"下一任务：{rule}",ja:"次の任務：{rule}",ko:"다음 임무: {rule}",
    es:"Próxima misión: {rule}","pt-BR":"Próxima missão: {rule}",fr:"Prochaine mission : {rule}",de:"Nächste Mission: {rule}",
    it:"Prossima missione: {rule}",ru:"Следующее задание: {rule}",hi:"अगला मिशन: {rule}",ar:"المهمة التالية: {rule}"
  };
  Object.entries(nextMissionPreviewCopy).forEach(([code,value]) => Object.assign(copy[code] ||= {}, {nextMissionPreview:value}));
  const campaignMission=(en,zh,ruleEn,ruleZh,data)=>({name:[en,zh],rule:[ruleEn,ruleZh],...data});
  const campaign=[
    campaignMission("Quiet Threshold","靜謐門廊","Read one patrol, recover the seal, then extract.","觀察單一路線，取得封印後撤離。",{object:[50,42],treasure:[82,36],exit:[50,10],patrols:[[24,32,76,32]],speed:.88}),
    campaignMission("Lantern Hall","燈火大廳","Cross behind two patrol lines.","從兩條巡邏線的空檔穿過。",{object:[24,30],treasure:[80,72],exit:[50,10],patrols:[[18,52,82,52],[70,24,70,78]],speed:.82}),
    campaignMission("Split Gallery","分岔畫廊","Choose the quiet side before the routes cross.","在巡邏交會前選擇安靜的一側。",{object:[76,32],treasure:[20,26],exit:[50,10],patrols:[[16,44,84,44],[25,76,75,76]],speed:.9}),
    campaignMission("Courier Stairs","信使階梯","The bonus treasure sits beyond the direct escape route.","額外寶藏位於直接撤離路線之外。",{object:[28,24],treasure:[82,34],exit:[18,10],patrols:[[18,48,82,48],[36,20,36,78],[70,28,70,76]],speed:.84}),
    campaignMission("Lantern Audit","提燈審查","The Auditor widens its searchlight; move after the glow shrinks.","審查官會擴大探照光，等光圈縮小再移動。",{object:[52,46],treasure:[84,74],exit:[50,10],patrols:[[20,66,80,66],[28,78,28,40]],guardian:guardianCatalog.spotlight,speed:.84}),
    campaignMission("Velvet Alcove","天鵝絨暗室","Shadow circles hide Fia from patrol sight.","站進陰影圓圈可避開巡邏視線。",{object:[72,30],treasure:[18,66],exit:[50,10],patrols:[[18,48,82,48],[28,76,74,76]],safeZones:[[30,60,11]],speed:.95}),
    campaignMission("Twin Shelves","雙層書架","Move from one shadow circle to the next.","依序利用兩個陰影圈前進。",{object:[22,26],treasure:[80,70],exit:[82,10],patrols:[[18,42,82,42],[16,68,84,68],[64,22,64,78]],safeZones:[[28,56,10],[70,56,10]],speed:.9}),
    campaignMission("Broken Skylight","破損天窗","A narrow shadow lane separates crossing patrols.","狹窄陰影通道位於交叉巡邏之間。",{object:[78,22],treasure:[20,24],exit:[50,10],patrols:[[18,38,82,72],[82,38,18,72],[18,82,82,82]],safeZones:[[50,56,9]],speed:.92}),
    campaignMission("Whisper Annex","低語側廳","Take the optional treasure before leaving the final shadow.","離開最後陰影前決定是否取得寶藏。",{object:[18,32],treasure:[82,28],exit:[50,10],patrols:[[18,48,82,48],[22,72,78,72],[50,22,50,82]],safeZones:[[26,62,10],[74,62,10]],alertDecay:24,speed:.94}),
    campaignMission("Bell Warden","月鐘守衛","The bell pulse raises Alert outside shadow circles.","月鐘脈衝會提高陰影圈外的警報。",{object:[74,28],treasure:[20,72],exit:[50,10],patrols:[[18,34,82,34],[22,70,78,70]],safeZones:[[26,52,11],[74,52,11]],guardian:guardianCatalog.bell,speed:.88}),
    campaignMission("Silver Fork","銀光岔路","The relic and treasure trade places after a warning shimmer.","警示閃光後，任務物與寶藏會交換位置。",{object:[24,28],treasure:[78,30],exit:[50,10],patrols:[[18,54,82,54],[26,76,74,76]],mirrorInterval:7,speed:.95}),
    campaignMission("Reflected Ledger","倒影帳冊","Wait for the marker swap or commit to the longer route.","等待標記換位，或承擔較長路線。",{object:[80,24],treasure:[20,70],exit:[18,10],patrols:[[18,42,82,42],[62,20,62,78],[18,76,78,76]],mirrorInterval:6.5,speed:.9}),
    campaignMission("False North","偽北廳","Recover the treasure first so the mirrored relic becomes real.","先取得寶藏，鏡中的任務物才會成真。",{object:[24,22],treasure:[78,72],exit:[82,10],patrols:[[18,38,82,38],[28,58,74,58],[22,78,78,78]],order:"treasure-first",mirrorInterval:7,speed:.92}),
    campaignMission("Prism Hall","稜鏡大廳","Use shadow while the two markers prepare to swap.","在兩個標記準備交換時利用陰影。",{object:[76,26],treasure:[22,26],exit:[50,10],patrols:[[18,48,82,48],[28,78,72,78]],safeZones:[[50,64,11]],mirrorInterval:6,speed:.96}),
    campaignMission("Mirror Keeper","星鏡看守","The Keeper swaps both markers quickly; read the shimmer cue.","看守會快速交換兩個標記，注意閃光預告。",{object:[24,26],treasure:[78,72],exit:[50,10],patrols:[[18,50,82,50],[24,78,76,78]],safeZones:[[50,64,10]],mirrorInterval:5,guardian:guardianCatalog.mirror,speed:.9}),
    campaignMission("Slow Gear Walk","慢齒走廊","Patrols alternate between a slow watch and a fast sweep.","巡邏會在慢速監看與快速掃蕩間交替。",{object:[72,26],treasure:[20,70],exit:[50,10],patrols:[[18,44,82,44],[22,72,78,72]],clockCycle:7,speed:.88}),
    campaignMission("Fast Pendulum","快擺長廊","Cross during the blue slow phase, not the amber surge.","在藍色慢速階段穿越，避開琥珀加速。",{object:[20,28],treasure:[80,28],exit:[82,10],patrols:[[18,38,82,70],[82,38,18,70],[20,80,80,80]],clockCycle:6.5,speed:.9}),
    campaignMission("Split Minute","分秒暗室","Combine shadow cover with the clockwork rhythm.","把陰影掩護與發條節奏結合。",{object:[78,24],treasure:[22,72],exit:[18,10],patrols:[[18,46,82,46],[30,22,30,80],[70,22,70,80]],safeZones:[[50,62,10]],clockCycle:6,speed:.92}),
    campaignMission("Second-Hand Vault","秒針寶庫","Take treasure first while patrol speed keeps changing.","在巡邏速度持續變化時先取得寶藏。",{object:[22,24],treasure:[78,70],exit:[50,10],patrols:[[18,36,82,36],[18,58,82,58],[24,80,76,80]],order:"treasure-first",clockCycle:5.8,speed:.9}),
    campaignMission("Clockwork Marshal","發條巡察長","The Marshal telegraphs each full-speed pursuit.","巡察長會預告每次全速追蹤。",{object:[76,26],treasure:[20,72],exit:[50,10],patrols:[[18,52,82,52],[24,78,76,78]],safeZones:[[50,66,9]],clockCycle:5.5,guardian:guardianCatalog.clock,speed:.9}),
    campaignMission("First Seal","第一封印","Treasure is the first seal; the relic unlocks second.","寶藏是第一道封印，之後才能取得任務物。",{object:[76,24],treasure:[22,70],exit:[50,10],patrols:[[18,42,82,42],[24,60,76,60],[22,80,78,80]],order:"treasure-first",speed:.94}),
    campaignMission("Crossed Keys","交錯鑰匙","Open the two seals across three crossing routes.","穿過三條交錯路線依序開啟兩道封印。",{object:[20,24],treasure:[80,26],exit:[50,10],patrols:[[18,38,82,70],[82,38,18,70],[50,22,50,82]],order:"treasure-first",alertDecay:22,speed:.9}),
    campaignMission("Locked Moonwell","封鎖月井","Carry the first seal through two shadow shelters.","帶著第一道封印穿過兩處陰影掩護。",{object:[78,24],treasure:[20,72],exit:[82,10],patrols:[[18,36,82,36],[18,58,82,58],[24,80,76,80]],safeZones:[[28,50,9],[70,68,9]],order:"treasure-first",speed:.95}),
    campaignMission("Double Ward","雙重守望","Seal order and clockwork surges overlap.","封印順序與發條加速同時生效。",{object:[22,24],treasure:[78,72],exit:[18,10],patrols:[[18,42,82,42],[24,62,76,62],[28,80,72,80]],order:"treasure-first",clockCycle:5.8,speed:.92}),
    campaignMission("Vault Sealkeeper","寶庫封印官","Break both seals in order while the Sealkeeper guards the center.","依序解除兩道封印，同時避開中央封印官。",{object:[78,26],treasure:[20,72],exit:[50,10],patrols:[[18,40,82,40],[24,78,76,78]],safeZones:[[50,62,9]],order:"treasure-first",guardian:guardianCatalog.seals,speed:.9}),
    campaignMission("Dark Meridian","暗影子午線","A widening searchlight crosses a chain of shadow shelters.","擴張探照光會掃過連續陰影掩護。",{object:[76,24],treasure:[20,72],exit:[50,10],patrols:[[18,44,82,44],[24,78,76,78]],safeZones:[[28,58,9],[70,58,9]],spotlight:true,speed:.96}),
    campaignMission("Silent Chimes","寂靜月鐘","Bell pulses, shadow timing, and a risky treasure route combine.","月鐘脈衝、陰影時機與高風險寶藏路線同時出現。",{object:[22,24],treasure:[80,28],exit:[82,10],patrols:[[18,38,82,70],[82,38,18,70],[20,80,80,80]],safeZones:[[50,58,10]],bellPulse:5,speed:.94}),
    campaignMission("Shifting Orrery","位移天球儀","Marker swaps happen inside a changing clockwork rhythm.","標記會在變動的發條節奏中交換。",{object:[78,24],treasure:[20,70],exit:[18,10],patrols:[[18,40,82,40],[18,62,82,62],[28,80,72,80]],mirrorInterval:5.5,clockCycle:5.8,speed:.92}),
    campaignMission("Triple Lock","三重封鎖","Treasure first, then the relic; extraction relocates after pickup.","先取寶藏再取任務物；取得後撤離門會移位。",{object:[20,24],treasure:[80,72],exit:[50,10],phaseExit:[82,12],patrols:[[18,36,82,36],[18,56,82,56],[22,78,78,78]],safeZones:[[50,66,9]],order:"treasure-first",clockCycle:5.5,speed:.95}),
    campaignMission("Eclipse Curator","日蝕館長","Master seals, shadows, shifting markers, pulses, and a moving exit.","綜合封印、陰影、標記換位、警報脈衝與移動出口。",{object:[78,24],treasure:[20,72],exit:[50,10],phaseExit:[82,12],patrols:[[18,38,82,38],[18,58,82,58],[24,80,76,80]],safeZones:[[28,50,9],[70,66,9]],order:"treasure-first",mirrorInterval:5.5,clockCycle:5.5,bellPulse:5,guardian:guardianCatalog.eclipse,speed:.94})
  ];
  const campaignZhHans=[
    ["静谧门廊","观察单一路线，取得封印后撤离。"],
    ["灯火大厅","从两条巡逻线的空档穿过。"],
    ["分岔画廊","在巡逻交会前选择安静的一侧。"],
    ["信使阶梯","额外宝藏位于直接撤离路线之外。"],
    ["提灯审查","审查官会扩大探照光，等光圈缩小再移动。"],
    ["天鹅绒暗室","站进阴影圆圈可避开巡逻视线。"],
    ["双层书架","依序利用两个阴影圈前进。"],
    ["破损天窗","狭窄阴影通道位于交叉巡逻之间。"],
    ["低语侧厅","离开最后阴影前决定是否取得宝藏。"],
    ["月钟守卫","月钟脉冲会提高阴影圈外的警报。"],
    ["银光岔路","警示闪光后，任务物与宝藏会交换位置。"],
    ["倒影账册","等待标记换位，或承担较长路线。"],
    ["伪北厅","先取得宝藏，镜中的任务物才会成真。"],
    ["棱镜大厅","在两个标记准备交换时利用阴影。"],
    ["星镜看守","看守会快速交换两个标记，注意闪光预告。"],
    ["慢齿走廊","巡逻会在慢速监看与快速扫荡间交替。"],
    ["快摆长廊","在蓝色慢速阶段穿越，避开琥珀加速。"],
    ["分秒暗室","把阴影掩护与发条节奏结合。"],
    ["秒针宝库","在巡逻速度持续变化时先取得宝藏。"],
    ["发条巡察长","巡察长会预告每次全速追踪。"],
    ["第一封印","宝藏是第一道封印，之后才能取得任务物。"],
    ["交错钥匙","穿过三条交错路线依序开启两道封印。"],
    ["封锁月井","带着第一道封印穿过两处阴影掩护。"],
    ["双重守望","封印顺序与发条加速同时生效。"],
    ["宝库封印官","依序解除两道封印，同时避开中央封印官。"],
    ["暗影子午线","扩张探照光会扫过连续阴影掩护。"],
    ["寂静月钟","月钟脉冲、阴影时机与高风险宝藏路线同时出现。"],
    ["位移天球仪","标记会在变动的发条节奏中交换。"],
    ["三重封锁","先取宝藏再取任务物；取得后撤离门会移位。"],
    ["日蚀馆长","综合封印、阴影、标记换位、警报脉冲与移动出口。"]
  ];
  campaign.forEach((mission,index)=>{mission.name[4]=campaignZhHans[index][0];mission.rule[4]=campaignZhHans[index][1]});
  const campaignEs = [
    ["Umbral silencioso","Observa una patrulla, recupera el sello y evacúa."],
    ["Sala de faroles","Cruza por detrás de dos líneas de patrulla."],
    ["Galería dividida","Elige el lado tranquilo antes de que se crucen las rutas."],
    ["Escaleras del mensajero","El tesoro adicional está más allá de la ruta directa de escape."],
    ["Auditoría de faroles","El Auditor ensancha su foco; muévete cuando el resplandor se reduzca."],
    ["Alcoba de terciopelo","Los círculos de sombra ocultan a Fia de las patrullas."],
    ["Estantes gemelos","Pasa de un círculo de sombra al siguiente."],
    ["Claraboya rota","Un estrecho corredor de sombra separa las patrullas que se cruzan."],
    ["Anexo de susurros","Recoge el tesoro opcional antes de abandonar la última sombra."],
    ["Guardián de la campana","El pulso de la campana aumenta la alerta fuera de los círculos de sombra."],
    ["Bifurcación plateada","La reliquia y el tesoro intercambian posiciones tras un destello de aviso."],
    ["Registro reflejado","Espera al cambio de marcadores o comprométete con la ruta larga."],
    ["Falso norte","Recoge primero el tesoro para que la reliquia reflejada se vuelva real."],
    ["Sala prismática","Usa la sombra mientras los dos marcadores se preparan para cambiar."],
    ["Guardián del espejo","El Guardián cambia ambos marcadores con rapidez; fíjate en el destello."],
    ["Paseo de engranaje lento","Las patrullas alternan entre vigilancia lenta y barrido rápido."],
    ["Péndulo veloz","Cruza durante la fase azul lenta, no durante el impulso ámbar."],
    ["Minuto dividido","Combina la cobertura de las sombras con el ritmo mecánico."],
    ["Cámara del segundero","Recoge primero el tesoro mientras cambia la velocidad de las patrullas."],
    ["Mariscal mecánico","El Mariscal anuncia cada persecución a máxima velocidad."],
    ["Primer sello","El tesoro es el primer sello; la reliquia se desbloquea después."],
    ["Llaves cruzadas","Abre los dos sellos entre tres rutas que se cruzan."],
    ["Pozo lunar cerrado","Lleva el primer sello a través de dos refugios de sombra."],
    ["Doble resguardo","El orden de los sellos se combina con los impulsos mecánicos."],
    ["Guardasellos de la cámara","Rompe ambos sellos en orden mientras el Guardasellos protege el centro."],
    ["Meridiano oscuro","Un foco cada vez más ancho cruza una cadena de refugios de sombra."],
    ["Campanas silenciosas","Combina pulsos de campana, tiempos de sombra y una ruta de tesoro arriesgada."],
    ["Planetario cambiante","Los marcadores cambian dentro de un ritmo mecánico variable."],
    ["Triple cerradura","Primero el tesoro y después la reliquia; la salida cambia al recogerla."],
    ["Conservador del eclipse","Domina sellos, sombras, cambios de marcador, pulsos y una salida móvil."]
  ];
  campaign.forEach((mission, index) => { mission.name[2] = campaignEs[index][0]; mission.rule[2] = campaignEs[index][1]; });
  const campaignRu=[
    ["Тихий порог","Проследите за одним патрулём, верните печать и эвакуируйтесь."],
    ["Зал фонарей","Проберитесь позади двух линий патруля."],
    ["Разделённая галерея","Выберите спокойную сторону до пересечения маршрутов."],
    ["Лестницы курьера","Дополнительное сокровище лежит в стороне от прямого пути к выходу."],
    ["Фонарный ревизор","Прожектор ревизора расширяется; двигайтесь, когда сияние сужается."],
    ["Бархатная ниша","Теневые круги скрывают Фиа от патрулей."],
    ["Парные полки","Переходите от одного теневого круга к другому."],
    ["Разбитый фонарь","Узкая полоса тени разделяет пересекающиеся патрули."],
    ["Шепчущий флигель","Заберите необязательное сокровище до выхода из последней тени."],
    ["Колокольный страж","Удар колокола повышает тревогу за пределами теневых кругов."],
    ["Серебряная развилка","После предупредительной вспышки реликвия и сокровище меняются местами."],
    ["Зеркальный реестр","Дождитесь смены меток или выберите более длинный маршрут."],
    ["Ложный север","Сначала верните сокровище, чтобы зеркальная реликвия стала настоящей."],
    ["Призматический зал","Укройтесь в тени, пока две метки готовятся поменяться местами."],
    ["Хранитель зеркал","Хранитель быстро меняет обе метки; следите за вспышкой."],
    ["Медленный механизм","Патрули чередуют медленное наблюдение и быстрое прочёсывание."],
    ["Быстрый маятник","Переходите в медленную синюю фазу, а не во время янтарного рывка."],
    ["Разделённая минута","Сочетайте теневое укрытие с ритмом механизма."],
    ["Хранилище секундной стрелки","Сначала заберите сокровище, пока скорость патрулей меняется."],
    ["Часовой маршал","Маршал заранее показывает каждое ускоренное преследование."],
    ["Первая печать","Сокровище — первая печать; реликвия открывается второй."],
    ["Скрещённые ключи","Откройте две печати среди трёх пересекающихся маршрутов."],
    ["Запечатанный лунный колодец","Пронесите первую печать через два теневых укрытия."],
    ["Двойной оберег","Порядок печатей сочетается с ускорениями механизма."],
    ["Хранитель печатей","Сломайте обе печати по порядку, пока хранитель защищает центр."],
    ["Тёмный меридиан","Расширяющийся прожектор проходит над цепочкой теневых укрытий."],
    ["Тихие перезвоны","Сочетайте удары колокола, укрытие в тени и рискованный путь к сокровищу."],
    ["Подвижный планетарий","Метки меняются местами внутри переменного часового ритма."],
    ["Тройная печать","Сначала сокровище, затем реликвия; после находки выход перемещается."],
    ["Хранитель затмения","Примените всё: печати, тени, смену меток, импульсы и подвижный выход."]
  ];
  campaign.forEach((mission,index)=>{mission.name[3]=campaignRu[index][0];mission.rule[3]=campaignRu[index][1]});
  [
    [guardianCatalog.spotlight,"Auditor de faroles"], [guardianCatalog.bell,"Guardián de la campana"],
    [guardianCatalog.mirror,"Guardián del espejo"], [guardianCatalog.clock,"Mariscal mecánico"],
    [guardianCatalog.seals,"Guardasellos de la cámara"], [guardianCatalog.eclipse,"Conservador del eclipse"]
  ].forEach(([guardian, name]) => { guardian.name[2] = name; });
  [[guardianCatalog.spotlight,"Фонарный ревизор"],[guardianCatalog.bell,"Колокольный страж"],[guardianCatalog.mirror,"Хранитель зеркал"],[guardianCatalog.clock,"Часовой маршал"],[guardianCatalog.seals,"Хранитель печатей"],[guardianCatalog.eclipse,"Хранитель затмения"]].forEach(([guardian,name])=>{guardian.name[3]=name});
  [[guardianCatalog.spotlight,"提灯审查官"],[guardianCatalog.bell,"月钟守卫"],[guardianCatalog.mirror,"星镜看守"],[guardianCatalog.clock,"发条巡察长"],[guardianCatalog.seals,"宝库封印官"],[guardianCatalog.eclipse,"日蚀馆长"]].forEach(([guardian,name])=>{guardian.name[4]=name});
  function normalizeLocale(value){if(value==="zh-TW")return"zh-Hant";if(value==="zh-CN")return"zh-Hans";if(value?.startsWith("pt"))return"pt-BR";return value||"en"}
  const STAGE_CARD_POOL_SIZE=9;
  let state=load(),locale=normalizeLocale(document.documentElement.lang||window.WonderI18n?.locale?.()||readOptionalStorage(localeKey)||readOptionalStorage(legacyLocaleKey)||"en"),selectedMission=0,centeredMission=Math.max(0,Math.min(campaign.length-1,(state.unlocked||1)-1)),gadget="dash",gadgetOffers=createOffers(),insuranceActive=state.insuranceReady===true,preservedTreasure=false,playing=false,paused=false,alert=0,objectFound=false,treasureFound=false,caught=false,firstMoveTracked=false,patrols=[],lastTime=0,missionStartedAt=0,freezeUntil=0,smokeUntil=0,pickupCoverUntil=0,preview=null,arrivalTimer=0,animationFrame=0,routePointerId=null,lastPulseCycle=-1,lastMirrorCycle=-1,guardianPhase=1,resultActionClaimed=false;
  let stageWindowStart=0,stageCardPool=[],stageBrowseLogical=centeredMission,stageSettleFrame=0,stageFocusGeneration=0,cancelStagePointer=()=>{};
  const gameLocales=new Set(["en","zh-Hant","zh-Hans","es","ru"]);
  const localeArrayIndex=()=>locale==="zh-Hant"?1:locale==="es"?2:locale==="ru"?3:locale==="zh-Hans"?4:0;
  const runtimeLocaleSegments={"zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const runtimeCatalogLoads=new Map();
  function ensureRuntimeCatalog(code){
    if(code==="en"||window.WeightPlayGameRuntimeLocales?.[code])return Promise.resolve();
    if(runtimeCatalogLoads.has(code))return runtimeCatalogLoads.get(code);
    const segment=runtimeLocaleSegments[code];
    if(!segment)return Promise.resolve();
    const pending=new Promise((resolve,reject)=>{const script=document.createElement("script");script.src=`/src/runtime-locales/${segment}.js?v=20260817-moonlight-smoke-ko-a11y-v19`;script.onload=resolve;script.onerror=()=>reject(new Error(`Moonlight Heist locale catalog failed: ${code}`));document.head.append(script)});
    runtimeCatalogLoads.set(code,pending);
    return pending;
  }
  function sharedText(value){const text=String(value??""),exact=window.WeightPlayGameRuntimeLocales?.[locale]?.[text];if(exact)return exact;const localizer=window.WeightPlayGameRuntimeLocalizer;return localizer?.locale===locale?localizer.translate(text):text}
  function runtimeText(value){
    const text=String(value??"");
    return gameLocales.has(locale)?text:sharedText(text);
  }
  function campaignText(values){return runtimeText(values[localeArrayIndex()])}
  const levelTemplates={
    en:"Level {n}",
    "zh-Hant":"\u7b49\u7d1a {n}",
    "zh-Hans":"\u7b49\u7ea7 {n}",
    ja:"\u30ec\u30d9\u30eb {n}",
    ko:"\ub808\ubca8 {n}",
    es:"Nivel {n}",
    "pt-BR":"N\u00edvel {n}",
    fr:"Niveau {n}",
    de:"Stufe {n}",
    it:"Livello {n}",
    ru:"\u0423\u0440\u043e\u0432\u0435\u043d\u044c {n}",
    hi:"\u0938\u094d\u0924\u0930 {n}",
    ar:"\u0627\u0644\u0645\u0633\u062a\u0648\u0649 {n}",
  };
  function levelText(level){return(levelTemplates[locale]||levelTemplates.en).replace("{n}",level)}
  const nodes={main:$("#mainScreen"),stage:$("#stageScreen"),battle:$("#battleScreen"),rail:$("#missionRail"),field:$("#playField"),fia:$("#fiaActor"),objective:$("#objectiveActor"),treasure:$("#treasureActor"),exit:$("#exitActor"),patrolLayer:$("#patrolLayer"),route:$("#routeLine"),feedback:$("#feedbackText"),fx:$("#feedbackFx"),alertTrack:$(".alert-track"),alert:$("#alertFill"),modal:$("#resultModal")};
  function updateAlertMeter(){
    const value=Math.round(Math.max(0,Math.min(100,alert)));
    nodes.alertTrack.setAttribute("role","progressbar");
    nodes.alertTrack.setAttribute("aria-valuemin","0");
    nodes.alertTrack.setAttribute("aria-valuemax","100");
    nodes.alertTrack.setAttribute("aria-valuenow",String(value));
    nodes.alertTrack.setAttribute("aria-label",t("alert"));
    nodes.alertTrack.removeAttribute("aria-hidden");
    nodes.alert.style.width=`${alert}%`;
  }
  const leaveCopy={en:{title:"Leave this mission?",text:"Your current route is paused. Continue to keep playing, or return to Missions and leave this run.",continue:"Continue mission",leave:"Return to Missions"},"zh-Hant":{title:"離開這個任務？",text:"目前路線已暫停。繼續任務可保留本局，返回任務列表才會離開。",continue:"繼續任務",leave:"返回任務列表"},es:{title:"¿Salir de esta misión?",text:"La ruta actual está en pausa. Continúa para conservar la partida o vuelve a Misiones para salir.",continue:"Continuar misión",leave:"Volver a Misiones"}};
  leaveCopy.ru={title:"Покинуть задание?",text:"Текущий маршрут приостановлен. Продолжите игру или вернитесь к заданиям и завершите эту попытку.",continue:"Продолжить задание",leave:"Вернуться к заданиям"};
  let leaveWasPaused=false;
  function createLeaveModal(){const modal=document.createElement("div");modal.id="battleLeaveModal";modal.className="modal";modal.hidden=true;modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-labelledby","battleLeaveTitle");modal.setAttribute("aria-describedby","battleLeaveText");modal.innerHTML='<section class="modal-card"><h2 id="battleLeaveTitle"></h2><p id="battleLeaveText"></p><div class="modal-actions leave-actions"><button id="battleContinueBtn" class="primary" type="button"></button><button id="battleLeaveBtn" type="button"></button></div></section>';nodes.modal.after(modal);nodes.leaveModal=modal}
  createLeaveModal();
  function progressInteger(value,fallback,minimum,maximum){
    const parsed=Number(value);
    return Number.isFinite(parsed)?Math.max(minimum,Math.min(maximum,Math.floor(parsed))):fallback;
  }
  function normalizeCleared(value){
    if(!value||typeof value!=="object"||Array.isArray(value))return{};
    return Object.fromEntries(Object.entries(value).flatMap(([key,best])=>{
      const mission=Number(key),medals=progressInteger(best,0,0,3);
      return Number.isSafeInteger(mission)&&mission>=0&&mission<campaign.length&&medals>0?[[mission,medals]]:[];
    }));
  }
  function persistState(value){
    try{
      localStorage.setItem(KEY,JSON.stringify(value));
      return true;
    }catch{return false}
  }
  function load(){
    try{
      const parsed=JSON.parse(localStorage.getItem(KEY)||"{}"),source=parsed&&typeof parsed==="object"&&!Array.isArray(parsed)?parsed:{};
      const loaded={
        unlocked:progressInteger(source.unlocked,1,1,campaign.length),
        coins:progressInteger(source.coins,0,0,Number.MAX_SAFE_INTEGER-178),
        safehouse:progressInteger(source.safehouse,1,1,1+Math.floor(campaign.length/5)),
        cleared:normalizeCleared(source.cleared),
        insuranceReady:source.insuranceReady===true
      };
      persistState(loaded);
      return loaded;
    }catch{
      const fallback={unlocked:1,coins:0,safehouse:1,cleared:{},insuranceReady:false};
      persistState(fallback);
      return fallback;
    }
  }
  function save(){return persistState(state)}
  function wallet(){return window.WeightPlayWallet?.read?.()||{diamonds:0}}
  function spendDiamonds(cost){return Boolean(window.WeightPlayWallet?.spendDiamonds?.(cost))}
  function playSound(name){window.WonderSound?.play?.(name)}
  function syncSoundToggle(){const button=$("#soundToggle");if(!button)return;const muted=Boolean(window.WonderSound?.isMuted?.());button.setAttribute("aria-pressed",String(muted));window.dispatchEvent(new Event("wonder:locale-change"))}
  function createOffers(){return Object.keys(gadgets).map(id=>({id,level:1+Math.floor(Math.random()*3)}))}
  function selectedOffer(){return gadgetOffers.find(offer=>offer.id===gadget)||gadgetOffers[0]}
  let economyFeedbackTimer=0,pendingEconomy="",pendingEconomyTimer=0,pendingEconomyDeadline=0,pendingEconomyRemaining=0,windowFocused=document.hasFocus();
  function gadgetEffect(id,level){
    if(id==="dash")return t("dashEffect",{ms:Math.max(180,320-level*45)});
    if(id==="decoy")return t("decoyEffect",{seconds:(2.5+level*.65).toFixed(2).replace(/0$/,"")});
    return t("smokeEffect",{seconds:(.8+level*.5).toFixed(1)});
  }
  function gadgetSummary(id=gadget,level=selectedOffer().level){return `${t(id)} · ${levelText(level)} · ${gadgetEffect(id,level)} · ${t(`${id}Use`)}`}
  function clearPendingEconomy({render=true}={}){clearTimeout(pendingEconomyTimer);pendingEconomyTimer=0;pendingEconomyDeadline=0;pendingEconomyRemaining=0;pendingEconomy="";if(render)renderEconomy()}
  function schedulePendingEconomyExpiry(delay){
    clearTimeout(pendingEconomyTimer);pendingEconomyRemaining=Math.max(0,delay);pendingEconomyDeadline=performance.now()+pendingEconomyRemaining;
    pendingEconomyTimer=setTimeout(()=>{pendingEconomyTimer=0;pendingEconomyDeadline=0;pendingEconomyRemaining=0;pendingEconomy="";renderEconomy();renderGadgetSummary()},pendingEconomyRemaining);
  }
  function suspendPendingEconomy(){if(!pendingEconomy||!pendingEconomyTimer)return;pendingEconomyRemaining=Math.max(0,pendingEconomyDeadline-performance.now());clearTimeout(pendingEconomyTimer);pendingEconomyTimer=0;pendingEconomyDeadline=0}
  function resumePendingEconomy(){if(!document.hidden&&windowFocused&&pendingEconomy&&!pendingEconomyTimer)schedulePendingEconomyExpiry(pendingEconomyRemaining)}
  function renderGadgetSummary(){clearTimeout(economyFeedbackTimer);$("#economyFeedback").textContent=gadgetSummary()}
  function economyMessage(message=""){clearTimeout(economyFeedbackTimer);$("#economyFeedback").textContent=message||gadgetSummary();if(message)economyFeedbackTimer=setTimeout(renderGadgetSummary,1600)}
  function renderEconomy(){
    const balance=wallet().diamonds,reroll=$("#rerollBtn"),insurance=$("#insuranceBtn");
    $("#diamondLabel").textContent=`${t("diamonds")}: ${balance}`;
    reroll.textContent=pendingEconomy==="reroll"?t("confirmSpend",{cost:3,before:balance,after:Math.max(0,balance-3)}):t("reroll");
    insurance.textContent=pendingEconomy==="insurance"?t("confirmSpend",{cost:5,before:balance,after:Math.max(0,balance-5)}):t(insuranceActive?"insured":"insure");
    reroll.setAttribute("aria-label",pendingEconomy==="reroll"?t("confirmLabel",{action:t("rerollAction"),cost:3,before:balance,after:Math.max(0,balance-3)}):t("rerollLabel",{balance}));
    insurance.setAttribute("aria-label",insuranceActive?t("insuredLabel"):pendingEconomy==="insurance"?t("confirmLabel",{action:t("insuranceAction"),cost:5,before:balance,after:Math.max(0,balance-5)}):t("insuranceLabel",{balance}));
    reroll.classList.toggle("is-confirming",pendingEconomy==="reroll");
    insurance.classList.toggle("is-confirming",pendingEconomy==="insurance");
    insurance.classList.toggle("active",insuranceActive);
  }
  function armEconomy(action,cost,messageKey){
    const balance=wallet().diamonds;
    if(balance<cost){clearPendingEconomy();economyMessage(`${t("notEnough")} ${t("diamonds")}: ${balance}/${cost}.`);return false}
    clearTimeout(economyFeedbackTimer);clearTimeout(pendingEconomyTimer);pendingEconomy=action;renderEconomy();
    $("#economyFeedback").textContent=t(messageKey,{before:balance,after:balance-cost});
    schedulePendingEconomyExpiry(5000);
    return true;
  }
  function rerollOffers(){
    if(pendingEconomy!=="reroll"){armEconomy("reroll",3,"rerollDecision");return}
    clearPendingEconomy({render:false});
    if(!spendDiamonds(3)){renderEconomy();economyMessage(t("notEnough"));return}
    gadgetOffers=createOffers();gadget=gadgetOffers[0].id;economyMessage(t("rerolled"));renderGadgets();renderEconomy();updateGadget();playSound("upgrade");
  }
  function buyInsurance(){
    if(insuranceActive){clearPendingEconomy();economyMessage(t("alreadyInsured"));return}
    if(pendingEconomy!=="insurance"){armEconomy("insurance",5,"insuranceDecision");return}
    clearPendingEconomy({render:false});
    if(!spendDiamonds(5)){renderEconomy();economyMessage(t("notEnough"));return}
    insuranceActive=true;state.insuranceReady=true;save();economyMessage(t("insuranceReady"));renderEconomy();playSound("upgrade");
  }
  function t(key,vars={}){const owned=copy[locale]?.[key];let value=owned||copy.en[key]||key;value=owned?String(value):sharedText(value);Object.entries(vars).forEach(([k,v])=>value=value.replace(`{${k}}`,v));return value}
  function applyOwnedLocaleSurface(){const internal=document.querySelector('meta[name="robots"]')?.content.includes("noindex");document.title=`${t("title")} - ${internal?"Internal Trial":"WeightPlay"}`;document.querySelectorAll("[data-i18n],[data-game-i18n]").forEach(n=>{const key=n.dataset.gameI18n||n.dataset.i18n;n.dataset.gameI18n=key;n.dataset.runtimeLocalize="off";delete n.dataset.i18n;n.textContent=t(key)});const ownedNodes=[$("#localeSelect"),$(".main-poster"),$(".planner > img"),nodes.rail,nodes.fia,$("#stageBackBtn"),$("#battleBackBtn")].filter(Boolean);ownedNodes.forEach(node=>node.dataset.runtimeLocalize="off");$("#localeSelect").setAttribute("aria-label",t("languageLabel"));$(".main-poster").alt=t("posterAlt");$(".planner > img").alt=t("orlaAlt");nodes.rail.setAttribute("aria-label",t("missionRailLabel"));nodes.fia.alt=t("fiaAlt");$("#stageBackBtn").setAttribute("aria-label",t("stageBackLabel"));$("#battleBackBtn").setAttribute("aria-label",t("battleBackLabel"))}
  function localize(){if(window.WonderI18n?.locale?.()!==locale)window.WonderI18n?.setLocale?.(locale);document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";applyOwnedLocaleSurface();renderSummary();renderStage();renderGadgets();renderEconomy();updateGadget();renderGadgetSummary();updatePauseControl();updateAlertMeter();syncSoundToggle();setTimeout(applyOwnedLocaleSurface,0);requestAnimationFrame(()=>requestAnimationFrame(applyOwnedLocaleSurface))}
  function stopBattleLoop(){if(animationFrame){cancelAnimationFrame(animationFrame);animationFrame=0}}
  function startBattleLoop(){if(!playing||paused||animationFrame)return;lastTime=performance.now();animationFrame=requestAnimationFrame(loop)}
  function show(name){
    if(name!=="stage")cancelStageMotion();
    nodes.main.hidden=name!=="main";nodes.stage.hidden=name!=="stage";nodes.battle.hidden=name!=="battle";
    document.body.dataset.screen=name;
    for(const candidate of ["main","stage","battle"]){document.body.classList.toggle(`wp-shell-${candidate}-active`,candidate===name)}
    document.body.classList.toggle("wp-stage-select-active",name==="stage");document.documentElement.classList.toggle("wp-stage-select-active",name==="stage");
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync",{detail:{screen:name}}));
    window.dispatchEvent(new CustomEvent("weightplay:stage-sync",{detail:{screen:name}}));
    window.dispatchEvent(new CustomEvent("weightplay:battle-sync",{detail:{screen:name}}));
    if(name==="battle")window.dispatchEvent(new CustomEvent("weightplay:battle-open",{detail:{screen:name}}));
    if(name!=="battle"){playing=false;paused=false;stopBattleLoop();cancelPendingMovement();updatePauseControl()}
  }
  function renderSummary(){$("#safehouseSummary").textContent=`${Object.keys(state.cleared).length}/${campaign.length}`}
  function medalProgress(index){
    const medals=Math.max(0,Math.min(3,Number(state.cleared[index])||0));
    if(!medals)return{visible:`☆☆☆ · ${t("notCleared")}`,accessible:t("notCleared")};
    const stars="★".repeat(medals)+"☆".repeat(3-medals);
    const detail=medals===3?t("perfectMedals"):`${t("bestMedals",{medals})} · ${t("bonusMedal")}`;
    return{visible:`${stars} · ${detail}`,accessible:detail};
  }
  const stageWindowLimit=()=>Math.max(0,campaign.length-STAGE_CARD_POOL_SIZE);
  const desiredStageWindow=index=>Math.max(0,Math.min(stageWindowLimit(),Math.round(index)-Math.floor(STAGE_CARD_POOL_SIZE/2)));
  function createMissionCard(poolIndex){const card=document.createElement("button");card.type="button";card.dataset.wpStagePoolNode=String(poolIndex+1);return card}
  function bindMissionCard(card,index){
    const mission=campaign[index];if(!mission)return;
    const missionName=`${t("mission",{n:index+1})}: ${campaignText(mission.name)}`;
    const locked=index+1>state.unlocked,progress=medalProgress(index),guardian=mission.guardian;
    const art=guardian?`../../assets/animal-moonlight-heist-guardian-${guardian.id}.webp`:"../../assets/animal-moonlight-heist-archive-background.png";
    const checkpoint=guardian?`<span class="checkpoint-tag">${t("checkpoint")} · ${campaignText(guardian.name)}</span>`:"";
    card.className=`mission-card${locked?" locked":""}${guardian?" checkpoint":""}`;
    card.dataset.index=String(index);card.dataset.stage=String(index+1);card.dataset.stageIndex=String(index);
    card.setAttribute("aria-disabled",String(locked));card.setAttribute("aria-posinset",String(index+1));card.setAttribute("aria-setsize",String(campaign.length));card.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End Enter Space");
    card.innerHTML=`<img src="${art}" alt=""><div><strong>${missionName}</strong>${checkpoint}<span class="mission-rule">${campaignText(mission.rule)}</span><span>${locked?t("locked"):progress.visible}</span></div>`;
    card.setAttribute("aria-label",`${missionName}. ${campaignText(mission.rule)}. ${locked?t("locked"):progress.accessible}`);
  }
  function buildStagePool(){
    stageWindowStart=desiredStageWindow(centeredMission);stageCardPool=Array.from({length:Math.min(STAGE_CARD_POOL_SIZE,campaign.length)},(_,index)=>createMissionCard(index));
    nodes.rail.replaceChildren(...stageCardPool);stageCardPool.forEach((card,index)=>bindMissionCard(card,stageWindowStart+index));
    Object.assign(nodes.rail.dataset,{wpStageVirtualized:"bounded-recycle",wpStagePoolSize:String(stageCardPool.length),wpStageTotal:String(campaign.length),wpStageWindowStart:String(stageWindowStart),wpStageWindowEnd:String(stageWindowStart+stageCardPool.length-1),wpStageRecycleCount:"0",wpStageCenterObserver:"manual",wpStageVirtualDrag:"true"});
  }
  function moveStageWindow(targetStart){
    const target=Math.max(0,Math.min(stageWindowLimit(),targetStart));let recycled=0;
    while(stageWindowStart<target){const card=nodes.rail.firstElementChild;stageWindowStart+=1;nodes.rail.append(card);bindMissionCard(card,stageWindowStart+stageCardPool.length-1);recycled+=1}
    while(stageWindowStart>target){const card=nodes.rail.lastElementChild;stageWindowStart-=1;nodes.rail.prepend(card);bindMissionCard(card,stageWindowStart);recycled+=1}
    stageCardPool=[...nodes.rail.children];nodes.rail.dataset.wpStageWindowStart=String(stageWindowStart);nodes.rail.dataset.wpStageWindowEnd=String(stageWindowStart+stageCardPool.length-1);if(recycled)nodes.rail.dataset.wpStageRecycleCount=String(Number(nodes.rail.dataset.wpStageRecycleCount||0)+recycled);
  }
  function ensureStageWindow(index){if(!stageCardPool.length||stageCardPool.some(card=>!card.isConnected))buildStagePool();moveStageWindow(desiredStageWindow(index));stageCardPool.forEach(card=>bindMissionCard(card,Number(card.dataset.index)));markCenteredMission(Math.round(stageBrowseLogical))}
  function stageRailGeometry(){const cards=[...nodes.rail.children],railRect=nodes.rail.getBoundingClientRect(),first=cards[0]?.getBoundingClientRect(),second=cards[1]?.getBoundingClientRect(),delta=first&&second?(second.left+second.width/2)-(first.left+first.width/2):0,fallback=(first?.width||154)+(parseFloat(getComputedStyle(nodes.rail).columnGap)||12);return{center:railRect.left+railRect.width/2,pitch:Math.abs(delta)||fallback,orientation:Math.sign(delta)||1}}
  function stageRailPitch(){return stageRailGeometry().pitch}
  function positionStageRail(logical){const value=Math.max(0,Math.min(campaign.length-1,logical)),anchor=Math.round(value);moveStageWindow(desiredStageWindow(anchor));const rail=nodes.rail,card=rail.querySelector(`[data-index="${anchor}"]`);if(!card)return value;const baseBehavior=rail.style.getPropertyValue("scroll-behavior"),baseBehaviorPriority=rail.style.getPropertyPriority("scroll-behavior"),baseSnap=rail.style.getPropertyValue("scroll-snap-type"),baseSnapPriority=rail.style.getPropertyPriority("scroll-snap-type");rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");rail.scrollLeft=card.offsetLeft+card.offsetWidth/2-rail.clientWidth/2;const railRect=rail.getBoundingClientRect(),cardRect=card.getBoundingClientRect(),scale=railRect.width?rail.clientWidth/railRect.width:1,correction=((cardRect.left+cardRect.width/2)-(railRect.left+railRect.width/2))*scale;if(Math.abs(correction)>.01)rail.scrollLeft+=correction;const geometry=stageRailGeometry(),fraction=value-anchor;if(Math.abs(fraction)>.0001)rail.scrollLeft+=fraction*geometry.orientation*geometry.pitch;if(baseBehavior)rail.style.setProperty("scroll-behavior",baseBehavior,baseBehaviorPriority);else rail.style.removeProperty("scroll-behavior");if(baseSnap)rail.style.setProperty("scroll-snap-type",baseSnap,baseSnapPriority);else rail.style.removeProperty("scroll-snap-type");rail.dataset.wpStageDragLogical=value.toFixed(4);return value}
  function centerMission(index){ensureStageWindow(index);positionStageRail(index);markCenteredMission(index)}
  function cancelStageMotion(){if(stageSettleFrame)cancelAnimationFrame(stageSettleFrame);stageSettleFrame=0;cancelStagePointer();nodes.rail?.style.removeProperty("scroll-behavior");nodes.rail?.style.removeProperty("scroll-snap-type");nodes.rail?.classList.remove("wp-stage-dragging");if(nodes.rail)delete nodes.rail.dataset.wpStageSettling}
  function renderStage(){
    if(!nodes.rail)return;
    $("#coinLabel").textContent=`${t("coins")}: ${state.coins}`;const target=centeredMission;stageBrowseLogical=target;
    if(!stageCardPool.length||stageCardPool.some(card=>!card.isConnected))buildStagePool();ensureStageWindow(target);centerMission(target);
  }
  function markCenteredMission(index=centeredMission){
    centeredMission=Math.max(0,Math.min(campaign.length-1,Number(index)||0));
    nodes.rail.querySelectorAll(".mission-card").forEach(card=>{
      const centered=Number(card.dataset.index)===centeredMission;
      card.classList.toggle("centered",centered);
      card.setAttribute("aria-current",centered?"true":"false");
      if(centered&&!card.classList.contains("locked"))card.dataset.wpStageRecommended="true";
      else delete card.dataset.wpStageRecommended;
    });
  }
  function markGeometricMission(){
    const railBox=nodes.rail.getBoundingClientRect();
    if(!railBox.width)return;
    const midpoint=railBox.left+railBox.width/2;
    const nearest=[...nodes.rail.querySelectorAll(".mission-card")].reduce((best,card)=>{
      const box=card.getBoundingClientRect(),distance=Math.abs(box.left+box.width/2-midpoint);
      return!best||distance<best.distance?{card,distance}:best;
    },null)?.card;
    if(nearest)markCenteredMission(nearest.dataset.index);
  }
  function focusMission(index=Math.max(0,Math.min(campaign.length-1,state.unlocked-1)),force=false){
    const target=Math.max(0,Math.min(campaign.length-1,index)),generation=++stageFocusGeneration;
    centeredMission=target;stageBrowseLogical=target;
    requestAnimationFrame(()=>{
      if(generation!==stageFocusGeneration||document.body.dataset.screen!=="stage")return;
      const active=document.activeElement;
      if(!force&&active&&nodes.stage.contains(active)&&!nodes.rail.contains(active))return;
      ensureStageWindow(target);
      const card=nodes.rail.querySelector(`[data-index="${target}"]`);
      centerMission(target);
      card?.focus({preventScroll:true});
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        if(generation!==stageFocusGeneration||document.body.dataset.screen!=="stage")return;
        stageBrowseLogical=target;centerMission(target);
      }));
    });
  }
  function focusMain(){requestAnimationFrame(()=>requestAnimationFrame(()=>$("#startBtn")?.focus({preventScroll:true})))}
  function renderGadgets(focusId=null){const wrap=$("#gadgetChoices");wrap.innerHTML="";gadgetOffers.forEach(({id,level})=>{const g=gadgets[id],b=document.createElement("button"),levelLabel=levelText(level);b.className=`gadget-choice${id===gadget?" selected":""}`;b.dataset.gadgetId=id;b.innerHTML=`<img src="../../assets/animal-moonlight-heist-gadget-${g.art}.webp" alt=""><span class="gadget-name">${t(id)}</span><span class="gadget-level">${levelLabel}</span>`;b.type="button";b.title=`${t(id)} · ${levelLabel}`;b.setAttribute("aria-label",gadgetSummary(id,level));b.setAttribute("aria-pressed",id===gadget?"true":"false");b.addEventListener("click",()=>{gadget=id;renderGadgets(id);updateGadget();renderGadgetSummary()});wrap.append(b)});if(focusId)wrap.querySelector(`[data-gadget-id="${focusId}"]`)?.focus({preventScroll:true})}
  function updateGadget(){if(!$("#gadgetIcon"))return;const passive=gadget==="dash",name=t(gadget),effect=gadgetEffect(gadget,selectedOffer().level),button=$("#gadgetBtn");$("#gadgetIcon").src=`../../assets/animal-moonlight-heist-gadget-${gadgets[gadget].art}.webp`;$("#gadgetLabel").textContent=passive?`${name} · ${t("passive")}`:name;button.disabled=passive;button.setAttribute("aria-label",t(passive?"passiveGadgetLabel":"activeGadgetLabel",{name,effect}));button.title=button.getAttribute("aria-label");nodes.field.setAttribute("aria-label",t(passive?"playFieldPassiveLabel":"playFieldActiveLabel",{name,effect}))}
  function startMission(index,inputType="stage-card"){
    stopBattleLoop();
    selectedMission=Math.max(0,Math.min(campaign.length-1,index));
    objectFound=false;treasureFound=preservedTreasure;preservedTreasure=false;caught=false;firstMoveTracked=false;alert=0;paused=false;freezeUntil=0;smokeUntil=0;pickupCoverUntil=0;lastPulseCycle=-1;lastMirrorCycle=-1;guardianPhase=1;
    const m=campaign[selectedMission];
    track("mission_start",{mission:selectedMission+1,input_type:inputType,unlocked:state.unlocked});
    $("#missionLabel").textContent=`${t("mission",{n:selectedMission+1})}: ${campaignText(m.name)}`;
    $("#objectiveLabel").textContent=campaignText(m.rule);
    nodes.objective.src=`../../assets/animal-moonlight-heist-object-${missionObjects[selectedMission%missionObjects.length]}.webp`;
    place(nodes.objective,m.object);place(nodes.treasure,m.treasure);place(nodes.exit,m.exit);
    nodes.objective.hidden=false;nodes.treasure.hidden=treasureFound;nodes.exit.style.opacity=.5;place(nodes.fia,[50,88]);nodes.patrolLayer.innerHTML="";
    (m.safeZones||[]).forEach(([x,y,size])=>{const zone=document.createElement("span");zone.className="safe-zone";zone.style.left=`${x}%`;zone.style.top=`${y}%`;zone.style.setProperty("--zone-size",`${size*2}%`);zone.setAttribute("aria-hidden","true");nodes.patrolLayer.append(zone)});
    patrols=m.patrols.map((path,i)=>createPatrol(path,`../../assets/animal-moonlight-heist-patrol-${patrolArt[i%3]}.webp`,i*.23));
    if(m.guardian){const guardian=createPatrol(m.guardian.path,`../../assets/animal-moonlight-heist-guardian-${m.guardian.id}.webp`,.12,m.guardian);guardian.img.alt=campaignText(m.guardian.name);patrols.push(guardian)}
    nodes.feedback.textContent=t("holdRoute");updateAlertMeter();$("#coinBattle").textContent=`${t("coins")}: ${state.coins}`;show("battle");playing=true;missionStartedAt=performance.now();playSound("start");startBattleLoop();
    requestAnimationFrame(()=>nodes.field.focus({preventScroll:true}));
  }
  function createPatrol(path,src,progress=0,guardian=null){
    const sight=document.createElement("span");sight.className=`patrol-sight${guardian?" guardian-sight":""}`;sight.setAttribute("aria-hidden","true");
    const img=document.createElement("img");img.className=`patrol${guardian?" guardian-patrol":""}`;img.src=src;img.alt="";nodes.patrolLayer.append(sight,img);
    const patrol={img,sight,path,progress,direction:1,guardian};updatePatrol(patrol);return patrol;
  }
  function place(el,pos){el.style.left=`${pos[0]}%`;el.style.top=`${pos[1]}%`}
  function point(el){return[parseFloat(el.style.left)||0,parseFloat(el.style.top)||0]}
  function updatePauseControl(){const button=$("#pauseBtn");if(!button)return;button.textContent=paused?"\u25b6":"\u275a\u275a";button.setAttribute("aria-pressed",paused?"true":"false");button.setAttribute("aria-label",t(paused?"resumeAction":"pauseAction"));button.title=t(paused?"resumeAction":"pauseAction");nodes.field.tabIndex=0;updateGadget()}
  function freezeFia(){if(!nodes.field||nodes.field.hidden)return;const field=nodes.field.getBoundingClientRect(),fia=nodes.fia.getBoundingClientRect();if(!field.width||!field.height)return;const position=[(fia.left+fia.width/2-field.left)/field.width*100,(fia.top+fia.height/2-field.top)/field.height*100];nodes.fia.style.transitionDuration="0ms";place(nodes.fia,position)}
  function freezePatrols(){const field=nodes.field.getBoundingClientRect();if(!field.width||!field.height)return;patrols.forEach(p=>{const box=p.img.getBoundingClientRect(),position=[(box.left+box.width/2-field.left)/field.width*100,(box.top+box.height/2-field.top)/field.height*100];p.img.style.transitionDuration="0ms";place(p.img,position);place(p.sight,position)})}
  function cancelRoutePreview(){nodes.route.hidden=true;preview=null;if(routePointerId!==null&&nodes.field.hasPointerCapture?.(routePointerId))nodes.field.releasePointerCapture(routePointerId);routePointerId=null}
  function cancelPendingMovement(){if(arrivalTimer)clearTimeout(arrivalTimer);arrivalTimer=0;cancelRoutePreview()}
  function setPaused(next){if(!playing)return;paused=Boolean(next);if(paused){freezeFia();freezePatrols();cancelPendingMovement();stopBattleLoop();nodes.feedback.textContent=t("paused")}else{patrols.forEach(p=>p.img.style.transitionDuration="");nodes.feedback.textContent=t("holdRoute");startBattleLoop()}updatePauseControl();if(!paused)nodes.field.focus({preventScroll:true})}
  function scheduleArrival(delay){if(arrivalTimer)clearTimeout(arrivalTimer);arrivalTimer=setTimeout(()=>{arrivalTimer=0;if(playing&&!paused)resolveArrival()},delay)}
  function distance(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1])}
  function updatePatrol(p){const [x1,y1,x2,y2]=p.path;const q=p.direction>0?p.progress:1-p.progress;const position=[x1+(x2-x1)*q,y1+(y2-y1)*q];place(p.img,position);place(p.sight,position)}
  function activeMission(){return campaign[selectedMission]}
  function inSafeZone(position=point(nodes.fia)){return(activeMission().safeZones||[]).some(([x,y,size])=>distance(position,[x,y])<=size)}
  function guardianPatrol(){return patrols.find(p=>p.guardian)}
  function setGuardianWarning(warning){const guardian=guardianPatrol();guardian?.img.classList.toggle("is-warning",warning);guardian?.sight.classList.toggle("is-warning",warning)}
  function swapMissionMarkers(){
    if(objectFound||treasureFound)return;
    const objectPosition=point(nodes.objective),treasurePosition=point(nodes.treasure);
    place(nodes.objective,treasurePosition);place(nodes.treasure,objectPosition);
    [nodes.objective,nodes.treasure].forEach(node=>{node.classList.add("marker-shift");setTimeout(()=>node.classList.remove("marker-shift"),520)});
  }
  function updateMissionRules(now){
    const m=activeMission(),elapsed=(now-missionStartedAt)/1000;
    let speedFactor=1,warning=false;
    if(m.clockCycle){const phase=elapsed%m.clockCycle,surge=phase>=m.clockCycle*.62;speedFactor=surge?1.9:.52;warning=surge||phase>=m.clockCycle*.5;nodes.field.classList.toggle("clock-surge",surge);if(!preview)nodes.feedback.textContent=t(surge?"clockSurge":"clockSlow")}
    else nodes.field.classList.remove("clock-surge");
    if(m.mirrorInterval){const cycle=Math.floor(elapsed/m.mirrorInterval),phase=elapsed%m.mirrorInterval;warning=warning||phase>=m.mirrorInterval-1;if(cycle>0&&cycle!==lastMirrorCycle){lastMirrorCycle=cycle;swapMissionMarkers()}if(phase>=m.mirrorInterval-1&&!preview)nodes.feedback.textContent=t("mirrorWarning")}
    const bellInterval=m.bellPulse||(m.guardian?.behavior==="bell"||m.guardian?.behavior==="eclipse"?5:0);
    if(bellInterval){const cycle=Math.floor(elapsed/bellInterval),phase=elapsed%bellInterval;warning=warning||phase>=bellInterval-1;if(cycle>0&&cycle!==lastPulseCycle){lastPulseCycle=cycle;if(!inSafeZone()){alert=Math.min(100,alert+20);updateAlertMeter();showFx("warning")}}if(phase>=bellInterval-1&&!preview)nodes.feedback.textContent=t("bellWarning")}
    setGuardianWarning(warning);return speedFactor;
  }
  function patrolSightRadius(p,now){
    const m=activeMission(),elapsed=(now-missionStartedAt)/1000;
    if(p.guardian?.behavior==="spotlight"||p.guardian?.behavior==="eclipse"||m.spotlight)return 17+10*((Math.sin(elapsed*1.7)+1)/2);
    return p.guardian?20:18;
  }
  function loop(now){
    animationFrame=0;
    if(!playing||paused)return;
    const dt=Math.min(.05,(now-lastTime)/1000);lastTime=now;
    if(!paused&&now>freezeUntil){
      const m=activeMission(),speedFactor=updateMissionRules(now);
      patrols.forEach(p=>{p.progress+=dt*(.115+(m.speed||1)*.028)*speedFactor;if(p.progress>=1){p.progress=0;p.direction*=-1}updatePatrol(p);const radius=patrolSightRadius(p,now);p.sight.style.setProperty("--sight-size",`${radius*2}%`)});
      const seen=!inSafeZone()&&patrols.some(p=>distance(point(nodes.fia),point(p.img))<patrolSightRadius(p,now));
      const pickupCovered=now<pickupCoverUntil;
      alert=Math.max(0,Math.min(100,alert+(seen&&!pickupCovered?48:-(m.alertDecay||34))*dt));updateAlertMeter();if(alert>=100)fail();
    }
    if(playing&&!paused)animationFrame=requestAnimationFrame(loop);
  }
  function routeTo(clientX,clientY,commit=false){const r=nodes.field.getBoundingClientRect();const x=Math.max(6,Math.min(94,(clientX-r.left)/r.width*100));const y=Math.max(8,Math.min(92,(clientY-r.top)/r.height*100));const start=point(nodes.fia);const dx=(x-start[0])/100*r.width,dy=(y-start[1])/100*r.height;const len=Math.hypot(dx,dy);nodes.route.hidden=false;nodes.route.style.left=`${start[0]}%`;nodes.route.style.top=`${start[1]}%`;nodes.route.style.width=`${len}px`;nodes.route.style.transform=`rotate(${Math.atan2(dy,dx)}rad)`;const exposed=patrols.some(p=>distance([x,y],point(p.img))<22);nodes.route.classList.toggle("route-exposed",exposed);nodes.feedback.textContent=t(commit?"holdRoute":exposed?"routeExposed":"move");preview=[x,y];if(commit){track("input_action",{mission:selectedMission+1,action:"route_commit",input_type:"pointer",alert_level:Math.round(alert)});if(!firstMoveTracked){firstMoveTracked=true;track("first_move",{mission:selectedMission+1,input_type:"pointer"})}const level=selectedOffer().level,dashTime=gadget==="dash"?Math.max(180,320-level*45):650;nodes.route.hidden=true;nodes.fia.style.transitionDuration=`${dashTime}ms`;place(nodes.fia,preview);scheduleArrival(dashTime+20)}}
  function resolveArrival(){
    const p=point(nodes.fia),m=activeMission();
    if(!treasureFound&&distance(p,point(nodes.treasure))<12){treasureFound=true;nodes.treasure.hidden=true;track("treasure_collected",{mission:selectedMission+1});showFx("pickup");nodes.feedback.textContent=t("treasureFound");playSound("coin")}
    if(!objectFound&&distance(p,point(nodes.objective))<12){
      if(m.order==="treasure-first"&&!treasureFound){nodes.feedback.textContent=t("firstSeal");showFx("warning");return}
      objectFound=true;nodes.objective.hidden=true;nodes.exit.style.opacity=1;track("objective_pickup",{mission:selectedMission+1});if(m.phaseExit)place(nodes.exit,m.phaseExit);
      if(selectedMission<2){pickupCoverUntil=performance.now()+(selectedMission===0?1800:1000);alert=Math.max(0,alert-(selectedMission===0?18:10));updateAlertMeter()}
      if(m.guardian?.behavior==="eclipse"){guardianPhase=2;patrols.forEach(p=>p.direction*=-1);alert=Math.max(alert,28);updateAlertMeter()}
      $("#objectiveLabel").textContent=t("extraction");showFx("pickup");nodes.feedback.textContent=t(selectedMission<2?"pickupCover":"found");playSound("success");
    }
    if(objectFound&&distance(p,point(nodes.exit))<13)win();
  }
  function showFx(type){nodes.fx.src=`../../assets/animal-moonlight-heist-fx-${type}.webp`;place(nodes.fx,point(nodes.fia));nodes.fx.hidden=false;nodes.fx.classList.remove("fx-show");void nodes.fx.offsetWidth;nodes.fx.classList.add("fx-show");setTimeout(()=>nodes.fx.hidden=true,650)}
  function useGadget(){if(!playing||paused||gadget==="dash")return;const level=selectedOffer().level;if(gadget==="decoy"){freezeUntil=performance.now()+(2500+level*650);showFx("pickup")}else{alert=0;updateAlertMeter();smokeUntil=performance.now()+(800+level*500);showFx("shadow")}playSound("shoot")}
  function fail(){if(caught||performance.now()<smokeUntil)return;caught=true;playing=false;stopBattleLoop();if(insuranceActive&&treasureFound)preservedTreasure=true;insuranceActive=false;state.insuranceReady=false;save();track("alert",{mission:selectedMission+1,outcome:"capture",alert_level:100});showFx("warning");nodes.fia.classList.add("caught");playSound("wrong");openResult(false)}
  function win(){playing=false;stopBattleLoop();insuranceActive=false;state.insuranceReady=false;const m=activeMission(),medals=1+(!caught?1:0)+(treasureFound?1:0);const reward=20+selectedMission*4+(treasureFound?12:0)+(m.guardian?30:0);state.coins+=reward;state.cleared[selectedMission]=Math.max(state.cleared[selectedMission]||0,medals);state.unlocked=Math.max(state.unlocked,Math.min(campaign.length,selectedMission+2));state.safehouse=1+Math.floor(Object.keys(state.cleared).length/5);save();track("extraction",{mission:selectedMission+1,treasure_collected:treasureFound,medals,reward});playSound("win");openResult(true,medals,reward)}
  function openResult(ok,medals=0,reward=0){
    $("#resultTitle").textContent=t(ok?"victory":"captured");
    $("#resultText").textContent=ok
      ? `+${reward} ${t("coins")} · ${t("resultMedals",{medals})}${medals<3?` · ${t("bonusMedal")}`:` · ${t("treasure")}`}`
      : t("capturedText");
    const canContinue=ok&&selectedMission<campaign.length-1;
    const nextPreview=$("#nextMissionPreview")||(()=>{const node=document.createElement("p");node.id="nextMissionPreview";node.className="result-next-preview";node.setAttribute("role","status");node.setAttribute("aria-live","polite");node.setAttribute("aria-atomic","true");$("#medalRow").before(node);return node})();
    nextPreview.hidden=!canContinue;
    nextPreview.textContent=canContinue?t("nextMissionPreview",{rule:campaignText(campaign[selectedMission+1].rule)}):"";
    $("#medalRow").textContent=ok?"★".repeat(medals)+"☆".repeat(3-medals):"";
    $("#medalRow").setAttribute("aria-label",ok?t("medalCount",{medals}):"");
    const retryBtn=$("#retryBtn"),stagesBtn=$("#stagesBtn"),nextBtn=$("#nextBtn");
    resultActionClaimed=false;track("mission_result",{mission:selectedMission+1,outcome:ok?"success":"capture",medals,reward});
    retryBtn.disabled=false;
    stagesBtn.disabled=false;
    nextBtn.hidden=false;
    nextBtn.disabled=!canContinue;
    retryBtn.classList.remove("primary");
    stagesBtn.classList.toggle("primary",!canContinue);
    nextBtn.classList.toggle("primary",canContinue);
    [...nodes.modal.parentElement.children].filter(node=>node!==nodes.modal).forEach(node=>{node.inert=true;node.setAttribute("aria-hidden","true")});
    nodes.modal.hidden=false;
    (canContinue?nextBtn:stagesBtn).focus({preventScroll:true});
  }
  function claimResultAction(){
    if(nodes.modal.hidden||resultActionClaimed)return false;
    resultActionClaimed=true;
    [$("#retryBtn"),$("#stagesBtn"),$("#nextBtn")].forEach(button=>button.disabled=true);
    return true;
  }
  function closeResult(){nodes.modal.hidden=true;[...nodes.modal.parentElement.children].filter(node=>node!==nodes.modal).forEach(node=>{node.inert=false;node.removeAttribute("aria-hidden")});nodes.fia.classList.remove("caught")}
  function trapResultFocus(event){
    if(event.repeat&&(event.key==="Enter"||event.key===" ")){event.preventDefault();return}
    if(event.key!=="Tab"||nodes.modal.hidden)return;
    const actions=[...nodes.modal.querySelectorAll("button:not(:disabled)")].filter(node=>node.getClientRects().length);
    if(!actions.length){event.preventDefault();nodes.modal.focus();return}
    const first=actions[0],last=actions.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
  function setBattleModalInert(modal,open){[...modal.parentElement.children].filter(node=>node!==modal).forEach(node=>{node.inert=open;open?node.setAttribute("aria-hidden","true"):node.removeAttribute("aria-hidden")})}
  function openBattleLeave(){if(!playing||!nodes.modal.hidden||!nodes.leaveModal.hidden)return;leaveWasPaused=paused;if(!paused)setPaused(true);const source=leaveCopy[locale]||leaveCopy.en,words=Object.fromEntries(Object.entries(source).map(([key,value])=>[key,runtimeText(value)]));$("#battleLeaveTitle").textContent=words.title;$("#battleLeaveText").textContent=words.text;$("#battleContinueBtn").textContent=words.continue;$("#battleLeaveBtn").textContent=words.leave;setBattleModalInert(nodes.leaveModal,true);nodes.leaveModal.hidden=false;$("#battleContinueBtn").focus({preventScroll:true})}
  function closeBattleLeave(resume=true){if(nodes.leaveModal.hidden)return;nodes.leaveModal.hidden=true;setBattleModalInert(nodes.leaveModal,false);if(resume&&!leaveWasPaused)setPaused(false);if(resume)$("#battleBackBtn").focus({preventScroll:true})}
  function trapBattleLeaveFocus(event){if(event.repeat&&(event.key==="Enter"||event.key===" ")){event.preventDefault();return}if(event.key==="Escape"){event.preventDefault();closeBattleLeave();return}if(event.key!=="Tab"||nodes.leaveModal.hidden)return;const actions=[...nodes.leaveModal.querySelectorAll("button:not(:disabled)")],first=actions[0],last=actions.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
  $(".home-link").setAttribute("data-wp-return","main");$("#stageBackBtn").setAttribute("data-wp-return","stage");$("#battleBackBtn").setAttribute("data-wp-return","battle");
  function bind(){
    $("#localeSelect").value=locale;
    const preserveStageControlFocus=event=>{
      if(document.body.dataset.screen==="stage"&&!nodes.rail.contains(event.target))stageFocusGeneration+=1;
    };
    nodes.stage.addEventListener("focusin",preserveStageControlFocus);
    nodes.stage.addEventListener("pointerdown",preserveStageControlFocus,true);
    const soundToggle=$("#soundToggle");
    if(soundToggle){
      soundToggle.addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});
      soundToggle.addEventListener("click",()=>{window.WonderSound?.unlock?.();window.WonderSound?.setMuted?.(!window.WonderSound?.isMuted?.());syncSoundToggle()});
    }
    const handleLocaleSelect=async event=>{if(event.target?.id!=="localeSelect")return;const requested=normalizeLocale(event.target.value);if(requested===locale)return;try{await ensureRuntimeCatalog(requested)}catch(error){console.error(error);event.target.value=locale;return}locale=requested;window.WonderI18n?.setLocale?.(requested);writeOptionalStorage(localeKey,requested);localize()};
    document.addEventListener("input",handleLocaleSelect,true);
    document.addEventListener("change",handleLocaleSelect,true);
  window.addEventListener("wonder:locale-change",async event=>{if(!event.detail?.locale)return;const requested=normalizeLocale(event.detail.locale);if(requested===locale)return;try{await ensureRuntimeCatalog(requested)}catch(error){console.error(error);return}locale=requested;writeOptionalStorage(localeKey,requested);localize()});
    $("#startBtn").addEventListener("click",()=>{track("stage_open",{source:"main"});const target=Math.max(0,Math.min(campaign.length-1,state.unlocked-1));centeredMission=target;stageBrowseLogical=target;show("stage");renderStage();focusMission(target,true)});
    $("#stageBackBtn").addEventListener("click",()=>{track("map_return",{source:"stage_header"});show("main");focusMain()});
    $("#battleBackBtn").addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});
    $("#battleBackBtn").addEventListener("click",openBattleLeave);
    $("#pauseBtn").addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});
    $("#pauseBtn").addEventListener("click",()=>setPaused(!paused));
    document.addEventListener("visibilitychange",()=>{if(document.hidden){suspendPendingEconomy();if(playing&&!paused)setPaused(true)}else resumePendingEconomy()});
    window.addEventListener("blur",()=>{windowFocused=false;suspendPendingEconomy();if(playing&&!paused)setPaused(true);else cancelRoutePreview()});
    window.addEventListener("focus",()=>{windowFocused=true;resumePendingEconomy()});
    window.addEventListener("pagehide",()=>{suspendPendingEconomy();if(playing&&!paused)setPaused(true);else cancelRoutePreview()});
    window.addEventListener("pageshow",resumePendingEconomy);
    nodes.field.addEventListener("pointerdown",e=>{if(!playing||paused||e.isPrimary===false||(e.button!==undefined&&e.button!==0)||(routePointerId!==null&&routePointerId!==e.pointerId))return;routePointerId=e.pointerId;nodes.field.setPointerCapture(e.pointerId);routeTo(e.clientX,e.clientY)});
    nodes.field.addEventListener("pointermove",e=>{if(!paused&&e.pointerId===routePointerId&&nodes.field.hasPointerCapture(e.pointerId))routeTo(e.clientX,e.clientY)});
    nodes.field.addEventListener("pointerup",e=>{if(e.pointerId!==routePointerId||(e.pointerType==="mouse"&&e.button!==0))return;if(!paused&&preview)routeTo(e.clientX,e.clientY,true);cancelRoutePreview()});
    nodes.field.addEventListener("pointercancel",e=>{if(e.pointerId===routePointerId)cancelRoutePreview()});
    nodes.field.addEventListener("lostpointercapture",e=>{if(e.pointerId===routePointerId)cancelRoutePreview()});
    nodes.modal.addEventListener("keydown",trapResultFocus);nodes.leaveModal.addEventListener("keydown",trapBattleLeaveFocus);$("#gadgetBtn").addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});$("#gadgetBtn").addEventListener("click",useGadget);
    $("#battleContinueBtn").addEventListener("click",()=>closeBattleLeave());
    $("#battleLeaveBtn").addEventListener("click",()=>{track("map_return",{source:"battle_leave",mission:selectedMission+1});closeBattleLeave(false);centeredMission=selectedMission;stageBrowseLogical=selectedMission;show("stage");renderStage();focusMission(selectedMission,true)});
    $("#retryBtn").addEventListener("click",()=>{if(!claimResultAction())return;track("retry",{mission:selectedMission+1});closeResult();startMission(selectedMission,"retry")});
    $("#stagesBtn").addEventListener("click",()=>{if(!claimResultAction())return;track("map_return",{source:"result",mission:selectedMission+1});closeResult();centeredMission=selectedMission;stageBrowseLogical=selectedMission;show("stage");renderStage();focusMission(selectedMission,true)});
    $("#nextBtn").addEventListener("click",()=>{if(!claimResultAction())return;const nextMission=Math.min(campaign.length-1,selectedMission+1);track("next_mission",{from_mission:selectedMission+1,to_mission:nextMission+1});closeResult();startMission(nextMission,"next")});
  }
  function bindMissionRailDrag(){
    const rail=nodes.rail;
    rail.addEventListener("click",event=>{const card=event.target.closest(".mission-card");if(!card)return;const index=Number(card.dataset.index);if(index>=0&&index<state.unlocked){const inputType=event.detail===0?"keyboard":"pointer";track("stage_select",{mission:index+1,input_type:inputType,unlocked:state.unlocked});startMission(index,inputType)}});
    rail.addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" ")){event.preventDefault();return}const card=event.target.closest(".mission-card");if(!card||!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;const rtl=getComputedStyle(rail).direction==="rtl",index=Number(card.dataset.index);let next=index;if(event.key==="Home")next=0;else if(event.key==="End")next=campaign.length-1;else if(event.key==="ArrowLeft")next=Math.max(0,Math.min(campaign.length-1,index+(rtl?1:-1)));else next=Math.max(0,Math.min(campaign.length-1,index+(rtl?-1:1)));event.preventDefault();const baseSnap=rail.style.getPropertyValue("scroll-snap-type"),baseBehavior=rail.style.getPropertyValue("scroll-behavior");rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");stageBrowseLogical=next;ensureStageWindow(next);const target=rail.querySelector(`[data-index="${next}"]`);markCenteredMission(next);target?.focus({preventScroll:true});positionStageRail(next);requestAnimationFrame(()=>{if(baseBehavior)rail.style.setProperty("scroll-behavior",baseBehavior);else rail.style.removeProperty("scroll-behavior");if(baseSnap)rail.style.setProperty("scroll-snap-type",baseSnap);else rail.style.removeProperty("scroll-snap-type")})});
    rail.addEventListener("wonder:stage-snap",event=>{
      if(rail.dataset.wpStageVirtualized==="bounded-recycle"){markGeometricMission();return}
      const index=Number(event.detail?.index);
      if(Number.isInteger(index)&&index>=0)markCenteredMission(index);
      else markGeometricMission();
    });
  }
  function installVirtualStageDrag(){
    const rail=nodes.rail;let pointerId=null,startX=0,lastX=0,logical=0,moved=false,suppressClick=false;
    const restore=()=>{rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type");rail.classList.remove("wp-stage-dragging");delete rail.dataset.wpStageSettling};
    cancelStagePointer=()=>{pointerId=null;moved=false;restore()};
    rail.addEventListener("pointerdown",event=>{if(document.body.dataset.screen!=="stage"||event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;if(stageSettleFrame)cancelAnimationFrame(stageSettleFrame);stageSettleFrame=0;pointerId=event.pointerId;startX=lastX=event.clientX;logical=stageBrowseLogical;moved=false;rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");event.stopImmediatePropagation()},true);
    document.addEventListener("pointermove",event=>{if(event.pointerId!==pointerId)return;const delta=event.clientX-lastX;lastX=event.clientX;if(!moved&&Math.abs(event.clientX-startX)>4){moved=true;rail.classList.add("wp-stage-dragging")}if(moved){if(event.cancelable)event.preventDefault();logical=positionStageRail(logical-delta/stageRailPitch());stageBrowseLogical=logical;stageCardPool.forEach(card=>bindMissionCard(card,Number(card.dataset.index)));markCenteredMission(Math.round(logical))}event.stopImmediatePropagation()},true);
    const finish=event=>{if(pointerId===null||(event.pointerId!==undefined&&event.pointerId!==pointerId))return;pointerId=null;if(!moved){restore();return}if(event.cancelable)event.preventDefault();suppressClick=true;setTimeout(()=>{suppressClick=false},0);const from=logical,target=Math.max(0,Math.min(campaign.length-1,Math.round(from))),started=performance.now();rail.dataset.wpStageSettling="true";const settle=now=>{const progress=Math.min(1,(now-started)/340),eased=progress*progress*(3-2*progress);stageBrowseLogical=positionStageRail(from+(target-from)*eased);if(progress<1)stageSettleFrame=requestAnimationFrame(settle);else{stageSettleFrame=0;ensureStageWindow(target);centerMission(target);restore()}};stageSettleFrame=requestAnimationFrame(settle);moved=false;event.stopImmediatePropagation()};
    document.addEventListener("pointerup",finish,true);document.addEventListener("pointercancel",finish,true);rail.addEventListener("click",event=>{if(!suppressClick)return;suppressClick=false;event.preventDefault();event.stopImmediatePropagation()},true);
  }
  window.addEventListener("keydown",event=>{
    if(!playing||paused||event.target.matches("button,select,input,textarea"))return;
    const direction={arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0],arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1]}[event.key.toLowerCase()];
    if(event.key===" "){event.preventDefault();if(event.repeat)return;useGadget();return}
    if(!direction)return;
    event.preventDefault();
    const current=point(nodes.fia),next=[Math.max(6,Math.min(94,current[0]+direction[0]*6)),Math.max(8,Math.min(92,current[1]+direction[1]*6))];
    track("input_action",{mission:selectedMission+1,action:"move",input_type:"keyboard",direction:event.key.toLowerCase(),alert_level:Math.round(alert)});if(!firstMoveTracked){firstMoveTracked=true;track("first_move",{mission:selectedMission+1,input_type:"keyboard"})}nodes.route.hidden=true;nodes.fia.style.transitionDuration="120ms";place(nodes.fia,next);resolveArrival();
  });
  [$("#rerollBtn"),$("#insuranceBtn")].forEach(button=>button.addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()}));
  $("#startBtn").addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});
  $("#rerollBtn").addEventListener("click",rerollOffers);
  $("#insuranceBtn").addEventListener("click",buyInsurance);
  // Keep the public Traditional Chinese runtime dictionary ASCII-safe so it cannot be damaged by a legacy editor encoding.
  const decodeZh=value=>value.replace(/\\u([0-9a-f]{4})/gi,(_,code)=>String.fromCharCode(parseInt(code,16)));
  Object.assign(copy["zh-Hant"],{
    title:decodeZh("\\u52d5\\u7269\\u6708\\u5f71\\u6f5b\\u884c\\u968a"),internal:decodeZh("\\u6708\\u5149\\u6a94\\u6848\\u4efb\\u52d9"),pitch:decodeZh("\\u89c0\\u5bdf\\u5de1\\u908f\\uff0c\\u56de\\u6536\\u907a\\u7269\\uff0c\\u9078\\u64c7\\u4f55\\u6642\\u64a4\\u96e2\\u3002"),start:decodeZh("\\u958b\\u59cb\\u904a\\u6232"),missions:decodeZh("\\u6708\\u5149\\u6a94\\u6848\\u5eab"),chooseGadget:decodeZh("\\u9078\\u64c7\\u88dd\\u7f6e"),alert:decodeZh("\\u8b66\\u5831"),holdRoute:decodeZh("\\u6309\\u4f4f\\u4f86\\u9810\\u89bd\\u8def\\u7dda\\u3002"),objective:decodeZh("\\u56de\\u6536\\u4efb\\u52d9\\u7269\\u54c1"),locked:decodeZh("\\u5b8c\\u6210\\u524d\\u4e00\\u4efb\\u52d9\\u5f8c\\u89e3\\u9396"),retry:decodeZh("\\u91cd\\u8a66"),next:decodeZh("\\u4e0b\\u4e00\\u4efb\\u52d9"),victory:decodeZh("\\u4efb\\u52d9\\u5b8c\\u6210"),captured:decodeZh("\\u88ab\\u767c\\u73fe\\u4e86"),capturedText:decodeZh("\\u5de1\\u908f\\u54e1\\u89f8\\u767c\\u8b66\\u5831\\u3002\\u53ef\\u4ee5\\u514d\\u8cbb\\u91cd\\u8a66\\u3002"),treasure:decodeZh("\\u56de\\u6536\\u984d\\u5916\\u5bf6\\u85cf"),extraction:decodeZh("\\u524d\\u5f80\\u64a4\\u96e2\\u51fa\\u53e3"),dash:decodeZh("\\u9583\\u96fb\\u885d\\u523a"),decoy:decodeZh("\\u661f\\u5149\\u8a98\\u990c"),smoke:decodeZh("\\u7159\\u9727\\u8449"),coins:decodeZh("\\u6708\\u5149\\u5e63"),safehouse:decodeZh("\\u5b89\\u5168\\u5c4b Lv.{n}"),mission:decodeZh("\\u4efb\\u52d9 {n}"),move:decodeZh("\\u653e\\u958b\\u4f86\\u79fb\\u52d5"),found:decodeZh("\\u4efb\\u52d9\\u7269\\u54c1\\u5df2\\u53d6\\u5f97\\uff01"),exitReady:decodeZh("\\u53ef\\u4ee5\\u64a4\\u96e2"),treasureFound:decodeZh("\\u5df2\\u53d6\\u5f97\\u5bf6\\u85cf"),paused:decodeZh("\\u5df2\\u66ab\\u505c"),diamonds:decodeZh("\\u947d\\u77f3"),reroll:decodeZh("\\u91cd\\u65b0\\u64b2\\u653e 3"),insure:decodeZh("\\u6295\\u4fdd 5"),insured:decodeZh("\\u5df2\\u6295\\u4fdd"),alreadyInsured:decodeZh("\\u64a4\\u96e2\\u4fdd\\u96aa\\u5df2\\u555f\\u7528\\u3002"),confirmReroll:decodeZh("\\u78ba\\u5b9a\\u82b1\\u8cbb 3 \\u9846\\u947d\\u77f3\\u91cd\\u65b0\\u64b2\\u653e\\u88dd\\u7f6e\\u5f37\\u5ea6\\u55ce\\uff1f"),confirmInsurance:decodeZh("\\u78ba\\u5b9a\\u82b1\\u8cbb 5 \\u9846\\u947d\\u77f3\\uff0c\\u5728\\u88ab\\u767c\\u73fe\\u6642\\u4fdd\\u7559\\u984d\\u5916\\u5bf6\\u85cf\\u55ce\\uff1f"),notEnough:decodeZh("\\u947d\\u77f3\\u4e0d\\u8db3\\u3002"),rerolled:decodeZh("\\u88dd\\u7f6e\\u5f37\\u5ea6\\u5df2\\u91cd\\u65b0\\u64b2\\u653e\\u3002"),insuranceReady:decodeZh("\\u64a4\\u96e2\\u4fdd\\u96aa\\u5df2\\u555f\\u7528\\u3002")
  });
  ["\\u6a94\\u6848\\u5eab\\u5165\\u53e3","\\u71c8\\u706b\\u5927\\u5ef3","\\u56de\\u97ff\\u756b\\u5eca","\\u767c\\u689d\\u5bf6\\u5eab","\\u6708\\u4eae\\u4e4b\\u9580"].forEach((name,index)=>{missions[index].name[1]=decodeZh(name)});
  Object.assign(copy["zh-Hant"],{
    dashEffect:decodeZh("\\u5feb\\u901f\\u79fb\\u52d5\\uff1a{ms} \\u6beb\\u79d2"),
    decoyEffect:decodeZh("\\u66ab\\u505c\\u5de1\\u908f\\uff1a{seconds} \\u79d2"),
    smokeEffect:decodeZh("\\u8b66\\u5831\\u6b78\\u96f6 + {seconds} \\u79d2\\u63a9\\u8b77")
  });
  Object.assign(copy["zh-Hant"],{
    reroll:decodeZh("\\u91cd\\u62bd 3"),
    confirmReroll:decodeZh("\\u78ba\\u5b9a\\u82b1\\u8cbb 3 \\u9846\\u947d\\u77f3\\u91cd\\u62bd\\u88dd\\u7f6e\\u5f37\\u5ea6\\u55ce\\uff1f"),
    rerolled:decodeZh("\\u88dd\\u7f6e\\u5f37\\u5ea6\\u5df2\\u91cd\\u62bd\\u3002"),
    confirmSpend:decodeZh("\\u78ba\\u8a8d {cost} \\u00b7 {before}\\u2192{after}"),
    rerollDecision:decodeZh("\\u91cd\\u62bd\\u5168\\u90e8\\u4e09\\u500b\\u88dd\\u7f6e\\u5f37\\u5ea6\\u3002\\u518d\\u9ede\\u4e00\\u6b21\\u78ba\\u8a8d\\uff1a{before} \\u2192 {after} \\u9846\\u947d\\u77f3\\u3002"),
    insuranceDecision:decodeZh("\\u4e0b\\u4e00\\u500b\\u4efb\\u52d9\\u88ab\\u767c\\u73fe\\u4e00\\u6b21\\u5f8c\\uff0c\\u4fdd\\u7559\\u984d\\u5916\\u5bf6\\u85cf\\u3002\\u518d\\u9ede\\u4e00\\u6b21\\u78ba\\u8a8d\\uff1a{before} \\u2192 {after} \\u9846\\u947d\\u77f3\\u3002"),
    rerollLabel:decodeZh("\\u91cd\\u62bd\\u5168\\u90e8\\u4e09\\u500b\\u88dd\\u7f6e\\u5f37\\u5ea6\\u3002\\u82b1\\u8cbb 3 \\u9846\\u947d\\u77f3\\u3002\\u76ee\\u524d\\u9918\\u984d {balance}\\u3002"),
    insuranceLabel:decodeZh("\\u70ba\\u4e0b\\u4e00\\u500b\\u4efb\\u52d9\\u7684\\u4e00\\u6b21\\u88ab\\u767c\\u73fe\\u6295\\u4fdd\\u984d\\u5916\\u5bf6\\u85cf\\u3002\\u82b1\\u8cbb 5 \\u9846\\u947d\\u77f3\\u3002\\u76ee\\u524d\\u9918\\u984d {balance}\\u3002"),
    confirmLabel:decodeZh("\\u78ba\\u8a8d{action}\\u3002\\u82b1\\u8cbb {cost} \\u9846\\u947d\\u77f3\\u3002\\u9918\\u984d {before} \\u8b8a\\u70ba {after}\\u3002"),
    rerollAction:decodeZh("\\u88dd\\u7f6e\\u5f37\\u5ea6\\u91cd\\u62bd"),
    insuranceAction:decodeZh("\\u5bf6\\u85cf\\u4fdd\\u96aa"),
    insuredLabel:decodeZh("\\u4e0b\\u4e00\\u500b\\u4efb\\u52d9\\u7684\\u5bf6\\u85cf\\u4fdd\\u96aa\\u5df2\\u555f\\u7528\\u3002")
  });
  const openingReadabilityCopy={
    "zh-Hans":{routeExposed:"红色路线：进入巡逻视野会提高警报。",pickupCover:"已取得任务物品——趁巡逻迟疑时立即移动！"},
    ja:{routeExposed:"赤いルート：巡回の視界に入ると警戒度が上がります。",pickupCover:"任務アイテムを確保——巡回がためらっている間に移動！"},
    ko:{routeExposed:"빨간 경로: 순찰의 시야에 들어가면 경보가 올라갑니다.",pickupCover:"임무 물품 확보 — 순찰이 주춤하는 동안 이동하세요!"},
    es:{routeExposed:"Ruta roja: la visión de la patrulla aumentará la alerta.",pickupCover:"Objeto asegurado: muévete ahora mientras la patrulla vacila."},
    "pt-BR":{routeExposed:"Rota vermelha: a visão da patrulha aumentará o alerta.",pickupCover:"Objeto protegido — mova-se agora enquanto a patrulha hesita!"},
    fr:{routeExposed:"Trajet rouge : le champ de vision de la patrouille augmente l'alerte.",pickupCover:"Objet sécurisé — avancez pendant que la patrouille hésite !"},
    de:{routeExposed:"Rote Route: Das Sichtfeld der Patrouille erhöht den Alarm.",pickupCover:"Objekt gesichert — bewege dich, solange die Patrouille zögert!"},
    it:{routeExposed:"Percorso rosso: la visuale della pattuglia aumenta l'allerta.",pickupCover:"Oggetto recuperato: muoviti mentre la pattuglia esita!"},
    ru:{routeExposed:"Красный маршрут: поле зрения патруля повышает тревогу.",pickupCover:"Предмет получен — двигайтесь, пока патруль медлит!"},
    hi:{routeExposed:"लाल रास्ता: गश्ती दल की नज़र चेतावनी बढ़ाएगी।",pickupCover:"मिशन वस्तु मिल गई — गश्ती दल के झिझकते ही आगे बढ़ें!"},
    ar:{routeExposed:"المسار الأحمر: دخول مجال رؤية الدورية يرفع الإنذار.",pickupCover:"تم تأمين الغرض — تحرّك الآن بينما تتردد الدورية!"}
  };
  Object.entries(openingReadabilityCopy).forEach(([code,values])=>Object.assign(copy[code]||(copy[code]={}),values));
  const checkpointStages=campaign.map((mission,index)=>mission.guardian?index+1:null).filter(Boolean);
  if(campaign.length!==30||new Set(campaign.map(mission=>mission.name[0])).size!==30||checkpointStages.join(",")!=="5,10,15,20,25,30")throw new Error("Moonlight Heist campaign depth contract failed.");
  if(location.hostname==="localhost"||location.hostname==="127.0.0.1"||new URLSearchParams(location.search).has("wp_test")){
    window.__ANIMAL_MOONLIGHT_HEIST_TEST__={
      campaign:()=>campaign.map((mission,index)=>({stage:index+1,name:[...mission.name],rule:[...mission.rule],patrols:mission.patrols.length,safeZones:mission.safeZones?.length||0,order:mission.order||"any",mirror:Boolean(mission.mirrorInterval),clock:Boolean(mission.clockCycle),bell:Boolean(mission.bellPulse||mission.guardian?.behavior==="bell"||mission.guardian?.behavior==="eclipse"),spotlight:Boolean(mission.spotlight||mission.guardian?.behavior==="spotlight"||mission.guardian?.behavior==="eclipse"),guardian:mission.guardian?{id:mission.guardian.id,name:[...mission.guardian.name],behavior:mission.guardian.behavior}:null})),
      unlockAll:()=>{state.unlocked=campaign.length;save();renderStage();return state.unlocked},
       openMission:index=>{startMission(Math.max(0,Math.min(campaign.length-1,Number(index)||0)),"test-hook");return selectedMission+1},
      placeFia:position=>{place(nodes.fia,position);resolveArrival();return{objectFound,treasureFound,exit:point(nodes.exit)}},
      tickRules:seconds=>{missionStartedAt=performance.now()-Number(seconds)*1000;const factor=updateMissionRules(performance.now());return{factor,alert,object:point(nodes.objective),treasure:point(nodes.treasure),warning:Boolean(guardianPatrol()?.img.classList.contains("is-warning"))}},
      translate:(code,key)=>{const previous=locale;locale=normalizeLocale(code);const value=t(key);locale=previous;return value},
      showResult:(ok,medals=0,reward=0)=>{openResult(Boolean(ok),Number(medals)||0,Number(reward)||0);return{preview:document.querySelector("#nextMissionPreview")?.textContent||"",hidden:document.querySelector("#nextMissionPreview")?.hidden===true}},
      snapshot:()=>({stage:selectedMission+1,unlocked:state.unlocked,screen:document.body.dataset.screen,objectFound,treasureFound,guardianPhase,patrols:patrols.length,guardian:guardianPatrol()?.guardian?.id||null,safeZones:document.querySelectorAll(".safe-zone").length,resultOpen:!nodes.modal.hidden,freezeRemaining:Math.max(0,freezeUntil-performance.now())})
    };
  }
  $("#battleBackBtn")?.setAttribute("data-wp-return","battle");
  renderGadgets();bind();bindMissionRailDrag();installVirtualStageDrag();localize();$("#localeSelect option[value='zh-Hant']").textContent=decodeZh("\\u7e41\\u9ad4\\u4e2d\\u6587");show("main");
})();
