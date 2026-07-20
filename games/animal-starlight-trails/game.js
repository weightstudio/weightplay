(() => {
  "use strict";

  const GAME_ID = "animal-starlight-trails";
  const SAVE_KEY = "weightplay_animal_starlight_trails_v1";
  const LOCALE_KEY = "weightPlayLocale";
  function readStorage(key){try{return localStorage.getItem(key);}catch{return null;}}
  function writeStorage(key,value){try{localStorage.setItem(key,value);return true;}catch{return false;}}
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const EN = {
    title:"Animal Starlight Trails",language:"Language",eyebrow:"Moon Cap Orla's constellation workshop",pitch:"Trace every trail exactly once and relight the Animal Star Map.",start:"Start Game",chooseStage:"Choose Constellation",stage:"Stage",trails:"Trails",stars:"Stars",undo:"Undo",restart:"Restart",hint:"Hint",retry:"Retry",stages:"Stages",next:"Next Stage",skillReport:"Skill Report",loading:"Loading star map…",progress:"{cleared} / 30 constellations restored",bestStars:"{stars} stars collected",ready:"Choose a star to begin.",continue:"Continue from the glowing star.",deadEnd:"That route cannot reach every remaining trail. Undo or restart.",wrongStart:"Begin on the glowing start seal.",usedTrail:"That trail has already been used.",notConnected:"Choose a star connected to the glowing star.",wrongWay:"That comet trail only flows in the arrow direction.",checkpoint:"Reach numbered star {number} next.",gateLocked:"Find the golden key star before crossing this gate.",keyFound:"The golden star gate is open!",complete:"Constellation restored!",hintStart:"Try beginning on the highlighted star.",hintNext:"A route-safe next star is highlighted.",assist:"{hints} hints · {mistakes} corrections",resultTitle:"Trail Restored",resultText:"You lit all {edges} trails in {time}.",newBest:"New best time for this constellation!",previousBest:"Best time: {time}",logic:"Logic",focus:"Focus",problem:"Problem Solving",logicValue:"{edges} trails planned",focusValue:"{mistakes} corrections",problemValue:"{hints} hints used",chapter1:"Open Star Paths",chapter2:"Starting Seals",chapter3:"Comet Arrows",chapter4:"Numbered Stars",chapter5:"Keys and Gates",chapter6:"Grand Constellations",rule1:"Use every trail exactly once. Stars may be revisited.",rule2:"Begin at the marked star, then use every trail once.",rule3:"Follow every violet comet trail in its arrow direction.",rule4:"Reach the numbered star seals in order.",rule5:"Touch the golden key star before crossing the rose gate.",rule6:"Combine start seals, arrows, star order, keys, and gates.",locked:"Locked",cleared:"Cleared",available:"Available",chapter:"Observatory {number}",stageSummary:"{cleared} cleared · {stars} stars",ruleClassic:"Classic",ruleStart:"Start seal",ruleArrow:"Comet arrows",ruleOrder:"Star order",ruleGate:"Star gate",ruleMaster:"Mastery",node:"Star {number}",startNode:"Start star {number}",keyNode:"Key star {number}",checkpointNode:"Numbered star {order}",edgeLabel:"Trail from star {from} to star {to}",backToMain:"Back to main",backToStage:"Back to stages",stageRailLabel:"Constellations",puzzleLabel:"Constellation puzzle",graphLabel:"One-stroke constellation"
  };

  const STRINGS = {
    en: EN,
    "zh-Hant": {...EN,title:"動物星光一筆畫",language:"語言",eyebrow:"月帽奧拉的星座工坊",pitch:"每條星路只能走一次，一筆修復完整動物星圖。",start:"開始遊戲",chooseStage:"選擇星座",stage:"關卡",trails:"星路",stars:"星星",undo:"上一步",restart:"重新開始",hint:"提示",retry:"再試一次",stages:"關卡",next:"下一關",skillReport:"技能報告",loading:"載入星圖中…",progress:"已修復 {cleared} / 30 個星座",bestStars:"已收集 {stars} 顆星",ready:"選一顆星開始。",continue:"從發亮的星星繼續。",deadEnd:"這條路無法走完剩餘星路，請上一步或重新開始。",wrongStart:"請從發亮的起點星印開始。",usedTrail:"這條星路已經走過了。",notConnected:"請選擇與目前星星相連的星星。",wrongWay:"這條彗星路只能依箭頭方向通過。",checkpoint:"下一個要抵達編號 {number} 星印。",gateLocked:"先找到金色鑰匙星，才能通過星門。",keyFound:"金色星門已開啟！",complete:"星座修復完成！",hintStart:"可以嘗試從發亮的星星開始。",hintNext:"已標示一個能繼續完成的下一步。",assist:"{hints} 次提示 · {mistakes} 次修正",resultTitle:"星路修復完成",resultText:"你用 {time} 點亮了全部 {edges} 條星路。",newBest:"這個星座的新最佳時間！",previousBest:"最佳時間：{time}",logic:"邏輯",focus:"專注",problem:"問題解決",logicValue:"規劃 {edges} 條星路",focusValue:"{mistakes} 次修正",problemValue:"使用 {hints} 次提示",chapter1:"開放星路",chapter2:"起點星印",chapter3:"彗星箭路",chapter4:"編號星印",chapter5:"鑰匙與星門",chapter6:"大星座考驗",rule1:"每條星路只能走一次，星星可以重複經過。",rule2:"從指定星印開始，再把全部星路走完。",rule3:"紫色彗星路必須依箭頭方向通過。",rule4:"依照數字順序抵達星印。",rule5:"先碰到金色鑰匙星，再通過玫紅色星門。",rule6:"綜合起點、箭頭、順序、鑰匙與星門。",locked:"未解鎖",cleared:"已完成",available:"可挑戰",chapter:"第 {number} 觀測台",stageSummary:"完成 {cleared} 關 · {stars} 顆星",ruleClassic:"經典星路",ruleStart:"起點星印",ruleArrow:"彗星箭路",ruleOrder:"星印順序",ruleGate:"鑰匙星門",ruleMaster:"綜合考驗",node:"第 {number} 顆星",startNode:"起點星 {number}",keyNode:"鑰匙星 {number}",checkpointNode:"編號 {order} 星印",edgeLabel:"第 {from} 顆星至第 {to} 顆星的星路"},
    "zh-Hans": {...EN,title:"动物星光一笔画",language:"语言",eyebrow:"月帽奥拉的星座工坊",pitch:"每条星路只能走一次，一笔修复完整动物星图。",start:"开始游戏",chooseStage:"选择星座",stage:"关卡",trails:"星路",stars:"星星",undo:"上一步",restart:"重新开始",hint:"提示",retry:"再试一次",stages:"关卡",next:"下一关",skillReport:"技能报告",loading:"加载星图中…",progress:"已修复 {cleared} / 30 个星座",bestStars:"已收集 {stars} 颗星",ready:"选择一颗星开始。",continue:"从发亮的星星继续。",deadEnd:"这条路无法走完剩余星路，请上一步或重新开始。",wrongStart:"请从发亮的起点星印开始。",usedTrail:"这条星路已经走过了。",notConnected:"请选择与当前星星相连的星星。",wrongWay:"这条彗星路只能按箭头方向通过。",checkpoint:"下一个要到达编号 {number} 星印。",gateLocked:"先找到金色钥匙星，才能通过星门。",keyFound:"金色星门已开启！",complete:"星座修复完成！",hintStart:"可以尝试从发亮的星星开始。",hintNext:"已标出一个能继续完成的下一步。",assist:"{hints} 次提示 · {mistakes} 次修正",resultTitle:"星路修复完成",resultText:"你用 {time} 点亮了全部 {edges} 条星路。",newBest:"这个星座的新最佳时间！",previousBest:"最佳时间：{time}",logic:"逻辑",focus:"专注",problem:"问题解决",chapter1:"开放星路",chapter2:"起点星印",chapter3:"彗星箭路",chapter4:"编号星印",chapter5:"钥匙与星门",chapter6:"大星座考验",rule1:"每条星路只能走一次，星星可以重复经过。",rule2:"从指定星印开始，再把全部星路走完。",rule3:"紫色彗星路必须按箭头方向通过。",rule4:"按照数字顺序到达星印。",rule5:"先碰到金色钥匙星，再通过玫红色星门。",rule6:"综合起点、箭头、顺序、钥匙与星门。"},
    ja: {...EN,title:"アニマル星空ひと筆",language:"言語",pitch:"すべての星の道を一度ずつ通って、動物星図を直そう。",start:"ゲーム開始",chooseStage:"星座を選ぶ",stage:"ステージ",trails:"道",stars:"スター",undo:"一手戻す",restart:"やり直す",hint:"ヒント",retry:"もう一度",stages:"ステージ",next:"次のステージ",skillReport:"スキルレポート",ready:"星を選んで始めよう。",deadEnd:"残りの道を全部通れません。一手戻すか、やり直してください。",wrongStart:"光るスタートの星から始めよう。",complete:"星座を修復しました！",chapter1:"ひらかれた星の道",chapter2:"スタートの印",chapter3:"彗星の矢印",chapter4:"番号の星",chapter5:"鍵とゲート",chapter6:"大星座チャレンジ",rule1:"すべての道を一度だけ通ります。星は何度通ってもかまいません。"},
    ko: {...EN,title:"동물 별빛 한붓그리기",language:"언어",pitch:"모든 별길을 한 번씩 지나 동물 별지도를 밝혀 주세요.",start:"게임 시작",chooseStage:"별자리 선택",stage:"스테이지",trails:"별길",stars:"별",undo:"되돌리기",restart:"다시 시작",hint:"힌트",retry:"다시 도전",stages:"스테이지",next:"다음 스테이지",skillReport:"플레이 리포트",ready:"시작할 별을 선택하세요.",deadEnd:"남은 별길을 모두 지날 수 없습니다. 되돌리거나 다시 시작하세요.",wrongStart:"빛나는 시작 별에서 출발하세요.",complete:"별자리를 복원했습니다!",chapter1:"열린 별길",chapter2:"시작 봉인",chapter3:"혜성 화살표",chapter4:"번호 별",chapter5:"열쇠와 문",chapter6:"대별자리 도전"},
    es: {...EN,title:"Senderos Estelares Animales",language:"Idioma",pitch:"Recorre cada sendero una sola vez y restaura el mapa estelar animal.",start:"Iniciar juego",chooseStage:"Elegir constelación",stage:"Nivel",trails:"Senderos",stars:"Estrellas",undo:"Deshacer",restart:"Reiniciar",hint:"Pista",retry:"Reintentar",stages:"Niveles",next:"Siguiente nivel",skillReport:"Informe de habilidades",ready:"Elige una estrella para empezar.",deadEnd:"Esta ruta no puede completar los senderos restantes. Deshaz o reinicia.",wrongStart:"Empieza en el sello brillante.",complete:"¡Constelación restaurada!",chapter1:"Rutas abiertas",chapter2:"Sellos de inicio",chapter3:"Flechas cometa",chapter4:"Estrellas numeradas",chapter5:"Llaves y puertas",chapter6:"Grandes constelaciones"},
    "pt-BR": {...EN,title:"Trilhas Estelares Animais",language:"Idioma",pitch:"Passe por cada trilha uma vez e restaure o mapa estelar animal.",start:"Iniciar jogo",chooseStage:"Escolher constelação",stage:"Fase",trails:"Trilhas",stars:"Estrelas",undo:"Desfazer",restart:"Reiniciar",hint:"Dica",retry:"Tentar de novo",stages:"Fases",next:"Próxima fase",skillReport:"Relatório de habilidades",ready:"Escolha uma estrela para começar.",deadEnd:"Esta rota não alcança todas as trilhas restantes. Desfaça ou reinicie.",wrongStart:"Comece no selo brilhante.",complete:"Constelação restaurada!",chapter1:"Trilhas abertas",chapter2:"Selos iniciais",chapter3:"Setas de cometa",chapter4:"Estrelas numeradas",chapter5:"Chaves e portões",chapter6:"Grandes constelações"},
    fr: {...EN,title:"Sentiers Animaliers Étoilés",language:"Langue",pitch:"Parcourez chaque sentier une seule fois et restaurez la carte des animaux.",start:"Commencer",chooseStage:"Choisir une constellation",stage:"Niveau",trails:"Sentiers",stars:"Étoiles",undo:"Annuler",restart:"Recommencer",hint:"Indice",retry:"Réessayer",stages:"Niveaux",next:"Niveau suivant",skillReport:"Rapport de compétences",ready:"Choisissez une étoile pour commencer.",deadEnd:"Cette route ne peut pas couvrir les sentiers restants. Annulez ou recommencez.",wrongStart:"Commencez sur le sceau lumineux.",complete:"Constellation restaurée !",chapter1:"Sentiers ouverts",chapter2:"Sceaux de départ",chapter3:"Flèches comètes",chapter4:"Étoiles numérotées",chapter5:"Clés et portes",chapter6:"Grandes constellations"},
    de: {...EN,title:"Tierische Sternenpfade",language:"Sprache",pitch:"Nutze jeden Pfad genau einmal und stelle die Tiersternkarte wieder her.",start:"Spiel starten",chooseStage:"Sternbild wählen",stage:"Stufe",trails:"Pfade",stars:"Sterne",undo:"Zurück",restart:"Neu starten",hint:"Hinweis",retry:"Erneut",stages:"Stufen",next:"Nächste Stufe",skillReport:"Fähigkeitenbericht",ready:"Wähle einen Startstern.",deadEnd:"Dieser Weg erreicht nicht alle übrigen Pfade. Gehe zurück oder starte neu.",wrongStart:"Beginne am leuchtenden Startsiegel.",complete:"Sternbild wiederhergestellt!",chapter1:"Offene Sternpfade",chapter2:"Startsiegel",chapter3:"Kometenpfeile",chapter4:"Nummerierte Sterne",chapter5:"Schlüssel und Tore",chapter6:"Große Sternbilder"},
    it: {...EN,title:"Sentieri Stellari Animali",language:"Lingua",pitch:"Percorri ogni sentiero una sola volta e ripristina la mappa animale.",start:"Inizia",chooseStage:"Scegli costellazione",stage:"Livello",trails:"Sentieri",stars:"Stelle",undo:"Annulla",restart:"Ricomincia",hint:"Suggerimento",retry:"Riprova",stages:"Livelli",next:"Livello successivo",skillReport:"Rapporto abilità",ready:"Scegli una stella per iniziare.",deadEnd:"Questo percorso non può coprire i sentieri rimasti. Annulla o ricomincia.",wrongStart:"Inizia dal sigillo luminoso.",complete:"Costellazione ripristinata!",chapter1:"Sentieri aperti",chapter2:"Sigilli iniziali",chapter3:"Frecce cometa",chapter4:"Stelle numerate",chapter5:"Chiavi e cancelli",chapter6:"Grandi costellazioni"},
    ru: {...EN,title:"Звёздные тропы животных",language:"Язык",pitch:"Пройдите каждую звёздную тропу один раз и восстановите карту животных.",start:"Начать игру",chooseStage:"Выбрать созвездие",stage:"Уровень",trails:"Тропы",stars:"Звёзды",undo:"Назад",restart:"Заново",hint:"Подсказка",retry:"Повторить",stages:"Уровни",next:"Следующий уровень",skillReport:"Отчёт навыков",ready:"Выберите начальную звезду.",deadEnd:"Этот маршрут не охватывает все оставшиеся тропы. Вернитесь или начните заново.",wrongStart:"Начните со светящейся звезды.",complete:"Созвездие восстановлено!",chapter1:"Открытые тропы",chapter2:"Стартовые печати",chapter3:"Стрелы комет",chapter4:"Нумерованные звёзды",chapter5:"Ключи и ворота",chapter6:"Большие созвездия"}
  };

  // Keep every always-visible Stage, Battle, and Result label native in all supported locales.
  // Longer situational coaching may intentionally fall back to English when a locale has no override.
  Object.assign(STRINGS["zh-Hans"], {logicValue:"规划 {edges} 条星路",focusValue:"{mistakes} 次修正",problemValue:"使用 {hints} 次提示",locked:"未解锁",cleared:"已完成",available:"可挑战",chapter:"第 {number} 观测台",stageSummary:"完成 {cleared} 关 · {stars} 颗星",ruleClassic:"经典星路",ruleStart:"起点星印",ruleArrow:"彗星箭路",ruleOrder:"星印顺序",ruleGate:"钥匙星门",ruleMaster:"综合考验",node:"第 {number} 颗星",startNode:"起点星 {number}",keyNode:"钥匙星 {number}",checkpointNode:"编号 {order} 星印",edgeLabel:"第 {from} 颗星到第 {to} 颗星的星路",backToMain:"返回主菜单",backToStage:"返回关卡",stageRailLabel:"星座关卡",puzzleLabel:"星座谜题",graphLabel:"一笔画星座"});
  Object.assign(STRINGS.ja, {logicValue:"{edges} 本の道を計画",focusValue:"修正 {mistakes} 回",problemValue:"ヒント {hints} 回",locked:"未解放",cleared:"クリア",available:"挑戦可能",chapter:"観測所 {number}",stageSummary:"{cleared} クリア・星 {stars}",ruleClassic:"クラシック",ruleStart:"開始の印",ruleArrow:"彗星の矢印",ruleOrder:"星の順番",ruleGate:"星の門",ruleMaster:"総合試練",node:"星 {number}",startNode:"開始星 {number}",keyNode:"鍵の星 {number}",checkpointNode:"番号 {order} の星",edgeLabel:"星 {from} から星 {to} への道"});
  Object.assign(STRINGS.ko, {logicValue:"별길 {edges}개 계획",focusValue:"수정 {mistakes}회",problemValue:"힌트 {hints}회 사용",locked:"잠김",cleared:"완료",available:"도전 가능",chapter:"관측소 {number}",stageSummary:"{cleared}개 완료 · 별 {stars}개",ruleClassic:"기본 별길",ruleStart:"시작 봉인",ruleArrow:"혜성 화살표",ruleOrder:"별 순서",ruleGate:"별의 문",ruleMaster:"종합 도전",node:"별 {number}",startNode:"시작 별 {number}",keyNode:"열쇠 별 {number}",checkpointNode:"번호 {order} 별",edgeLabel:"별 {from}에서 별 {to}로 가는 길"});
  Object.assign(STRINGS.es, {logicValue:"{edges} senderos planeados",focusValue:"{mistakes} correcciones",problemValue:"{hints} pistas usadas",locked:"Bloqueado",cleared:"Completado",available:"Disponible",chapter:"Observatorio {number}",stageSummary:"{cleared} completados · {stars} estrellas",ruleClassic:"Clásico",ruleStart:"Sello inicial",ruleArrow:"Flechas cometa",ruleOrder:"Orden estelar",ruleGate:"Puerta estelar",ruleMaster:"Maestría",node:"Estrella {number}",startNode:"Estrella inicial {number}",keyNode:"Estrella llave {number}",checkpointNode:"Estrella numerada {order}",edgeLabel:"Sendero de la estrella {from} a la {to}"});
  Object.assign(STRINGS["pt-BR"], {logicValue:"{edges} trilhas planejadas",focusValue:"{mistakes} correções",problemValue:"{hints} dicas usadas",locked:"Bloqueada",cleared:"Concluída",available:"Disponível",chapter:"Observatório {number}",stageSummary:"{cleared} concluídas · {stars} estrelas",ruleClassic:"Clássico",ruleStart:"Selo inicial",ruleArrow:"Setas de cometa",ruleOrder:"Ordem estelar",ruleGate:"Portal estelar",ruleMaster:"Mestria",node:"Estrela {number}",startNode:"Estrela inicial {number}",keyNode:"Estrela-chave {number}",checkpointNode:"Estrela numerada {order}",edgeLabel:"Trilha da estrela {from} à {to}"});
  Object.assign(STRINGS.fr, {logicValue:"{edges} sentiers planifiés",focusValue:"{mistakes} corrections",problemValue:"{hints} indices utilisés",locked:"Verrouillé",cleared:"Terminé",available:"Disponible",chapter:"Observatoire {number}",stageSummary:"{cleared} terminés · {stars} étoiles",ruleClassic:"Classique",ruleStart:"Sceau de départ",ruleArrow:"Flèches comètes",ruleOrder:"Ordre stellaire",ruleGate:"Porte stellaire",ruleMaster:"Maîtrise",node:"Étoile {number}",startNode:"Étoile de départ {number}",keyNode:"Étoile-clé {number}",checkpointNode:"Étoile numérotée {order}",edgeLabel:"Sentier de l’étoile {from} à {to}"});
  Object.assign(STRINGS.de, {logicValue:"{edges} Pfade geplant",focusValue:"{mistakes} Korrekturen",problemValue:"{hints} Hinweise genutzt",locked:"Gesperrt",cleared:"Geschafft",available:"Verfügbar",chapter:"Observatorium {number}",stageSummary:"{cleared} geschafft · {stars} Sterne",ruleClassic:"Klassisch",ruleStart:"Startsiegel",ruleArrow:"Kometenpfeile",ruleOrder:"Sternreihenfolge",ruleGate:"Sternentor",ruleMaster:"Meisterprüfung",node:"Stern {number}",startNode:"Startstern {number}",keyNode:"Schlüsselstern {number}",checkpointNode:"Nummerierter Stern {order}",edgeLabel:"Pfad von Stern {from} zu {to}"});
  Object.assign(STRINGS.it, {logicValue:"{edges} sentieri pianificati",focusValue:"{mistakes} correzioni",problemValue:"{hints} suggerimenti usati",locked:"Bloccato",cleared:"Completato",available:"Disponibile",chapter:"Osservatorio {number}",stageSummary:"{cleared} completati · {stars} stelle",ruleClassic:"Classico",ruleStart:"Sigillo iniziale",ruleArrow:"Frecce cometa",ruleOrder:"Ordine stellare",ruleGate:"Porta stellare",ruleMaster:"Maestria",node:"Stella {number}",startNode:"Stella iniziale {number}",keyNode:"Stella-chiave {number}",checkpointNode:"Stella numerata {order}",edgeLabel:"Sentiero dalla stella {from} alla {to}"});
  Object.assign(STRINGS.ru, {logicValue:"Спланировано троп: {edges}",focusValue:"Исправлений: {mistakes}",problemValue:"Подсказок: {hints}",locked:"Закрыто",cleared:"Пройдено",available:"Доступно",chapter:"Обсерватория {number}",stageSummary:"Пройдено: {cleared} · звёзд: {stars}",ruleClassic:"Классика",ruleStart:"Стартовая печать",ruleArrow:"Стрелы комет",ruleOrder:"Порядок звёзд",ruleGate:"Звёздные ворота",ruleMaster:"Мастерство",node:"Звезда {number}",startNode:"Стартовая звезда {number}",keyNode:"Звезда-ключ {number}",checkpointNode:"Звезда с номером {order}",edgeLabel:"Тропа от звезды {from} к {to}"});
  Object.assign(STRINGS.en, {leaveTitle:"Pause this constellation?",leaveText:"Continue this exact route, or return to Stages and lose the current attempt. Saved unlocks and best results stay safe.",continueBattle:"Continue Route",returnStages:"Return to Stages"});
  Object.assign(STRINGS["zh-Hant"], {leaveTitle:"暫停這個星座？",leaveText:"繼續目前路徑，或返回關卡並放棄本次嘗試。已儲存的解鎖與最佳成績不受影響。",continueBattle:"繼續路徑",returnStages:"返回關卡"});
  Object.assign(STRINGS["zh-Hans"], {leaveTitle:"暂停这个星座？",leaveText:"继续当前路径，或返回关卡并放弃本次尝试。已保存的解锁与最佳成绩不受影响。",continueBattle:"继续路径",returnStages:"返回关卡"});
  Object.assign(STRINGS.ja, {leaveTitle:"この星座を一時停止しますか？",leaveText:"現在のルートを続けるか、ステージに戻って今回の挑戦を中止します。保存済みの解放状況とベスト記録は失われません。",continueBattle:"ルートを続ける",returnStages:"ステージに戻る"});
  Object.assign(STRINGS.ko, {leaveTitle:"이 별자리를 일시정지할까요\u003f",leaveText:"현재 경로를 계속하거나 스테이지로 돌아가 이번 시도를 포기합니다. 저장된 잠금 해제와 최고 기록은 유지됩니다.",continueBattle:"경로 계속하기",returnStages:"스테이지로 돌아가기"});
  Object.assign(STRINGS.es, {leaveTitle:"¿Pausar esta constelación?",leaveText:"Continúa la ruta actual o vuelve a los niveles y abandona este intento. Los desbloqueos y mejores resultados guardados se conservan.",continueBattle:"Continuar ruta",returnStages:"Volver a niveles"});
  Object.assign(STRINGS["pt-BR"], {leaveTitle:"Pausar esta constelação?",leaveText:"Continue a rota atual ou volte às fases e abandone esta tentativa. Desbloqueios e melhores resultados salvos permanecem seguros.",continueBattle:"Continuar rota",returnStages:"Voltar às fases"});
  Object.assign(STRINGS.fr, {leaveTitle:"Mettre cette constellation en pause ?",leaveText:"Continuez le tracé actuel ou revenez aux niveaux et abandonnez cette tentative. Les déblocages et meilleurs résultats enregistrés restent conservés.",continueBattle:"Continuer le tracé",returnStages:"Revenir aux niveaux"});
  Object.assign(STRINGS.de, {leaveTitle:"Dieses Sternbild pausieren?",leaveText:"Setze den aktuellen Pfad fort oder kehre zu den Stufen zurück und brich diesen Versuch ab. Gespeicherte Freischaltungen und Bestwerte bleiben erhalten.",continueBattle:"Pfad fortsetzen",returnStages:"Zu den Stufen"});
  Object.assign(STRINGS.it, {leaveTitle:"Mettere in pausa questa costellazione?",leaveText:"Continua il percorso attuale oppure torna ai livelli e abbandona questo tentativo. Sblocchi e record salvati restano al sicuro.",continueBattle:"Continua percorso",returnStages:"Torna ai livelli"});
  Object.assign(STRINGS.ru, {leaveTitle:"Приостановить это созвездие\u003f",leaveText:"Продолжите текущий маршрут или вернитесь к уровням и отмените эту попытку. Сохранённые открытия и лучшие результаты останутся без изменений.",continueBattle:"Продолжить маршрут",returnStages:"Вернуться к уровням"});
  Object.entries(STRINGS).forEach(([key, strings]) => {
    strings.title = key === "zh-Hant" ? "Starlink 星鏈" : key === "zh-Hans" ? "Starlink 星链" : "Starlink";
  });

  const routeLocale = ({ en:"en", "zh-tw":"zh-Hant", "zh-cn":"zh-Hans", es:"es", ja:"ja" })[location.pathname.split("/").filter(Boolean)[0]];
  let locale = routeLocale || readStorage(LOCALE_KEY) || "en";
  if (!STRINGS[locale]) locale = "en";
  const format = (text, vars={}) => String(text).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
  const t = (key, vars) => format(STRINGS[locale]?.[key] ?? EN[key] ?? key, vars);

  const TEMPLATES = [
    {p:[[14,58],[38,30],[63,58],[86,27]],r:[0,1,2,3]},
    {p:[[22,26],[76,26],[76,74],[22,74]],r:[0,1,2,3,0]},
    {p:[[20,68],[80,68],[76,30],[24,30],[50,10]],r:[0,1,2,3,0,4,1]},
    {p:[[15,50],[50,16],[85,50],[50,84],[50,50]],r:[0,1,2,3,0,4,2]},
    {p:[[13,26],[44,14],[77,28],[68,72],[34,82],[50,50]],r:[0,1,2,3,4,1,3,5]},
    {p:[[14,24],[50,10],[84,25],[78,70],[24,74],[50,48]],r:[0,1,2,3,0,4,2,5,0]},
    {p:[[12,54],[28,18],[63,12],[87,42],[70,82],[26,84],[50,50]],r:[0,1,2,3,4,0,5,2,6,4]},
    {p:[[18,20],[52,10],[84,24],[82,70],[48,88],[16,68],[50,48]],r:[0,1,2,3,0,4,1,5,2,6,3]},
    {p:[[12,36],[35,10],[68,12],[88,40],[73,79],[38,88],[48,48],[18,70]],r:[0,1,2,3,4,0,5,2,6,4,7,1]},
    {p:[[15,22],[50,8],[84,24],[88,66],[54,88],[18,78],[48,44],[70,58]],r:[0,1,2,3,0,4,1,5,2,6,3,7,0]}
  ];

  function transformPoints(points, id) {
    const mirror = id % 2 === 0;
    const rotate = id % 3 === 0;
    return points.map(([x,y]) => {
      let nx = mirror ? 100 - x : x;
      let ny = y;
      if (rotate) [nx,ny] = [ny,100-nx];
      return [nx,ny];
    });
  }

  function checkpointNodes(route, count) {
    const unique = route.filter((node, index) => index > 0 && route.indexOf(node) === index);
    if (!unique.length) return [];
    const picks = [];
    for (let i=1;i<=count;i+=1) {
      const at = Math.min(unique.length-1, Math.max(0, Math.floor((unique.length*i)/(count+1))));
      if (!picks.includes(unique[at])) picks.push(unique[at]);
    }
    return picks;
  }

  function makeStage(id) {
    const chapter = Math.ceil(id/5);
    const templateIndex = chapter === 1 ? id-1 : Math.min(9, chapter + ((id-1)%5) - 1);
    const base = TEMPLATES[templateIndex];
    const route = [...base.r];
    const directedIndices = chapter >= 3 ? [...new Set([1, chapter >= 6 ? Math.max(2, route.length-4) : Math.max(2, Math.floor(route.length/2))])].filter(i => i < route.length-1) : [];
    const checkpoints = chapter >= 4 ? checkpointNodes(route, id%5===0 || chapter===6 ? 3 : 2) : [];
    const keyNode = chapter >= 5 ? route[Math.min(2,route.length-1)] : null;
    const gateIndex = chapter >= 5 ? Math.max(3,route.length-3) : null;
    const ruleKey = chapter===1?"ruleClassic":chapter===2?"ruleStart":chapter===3?"ruleArrow":chapter===4?"ruleOrder":chapter===5?"ruleGate":"ruleMaster";
    const edges = route.slice(0,-1).map((from,index) => ({
      id:index,from,to:route[index+1],key:[from,route[index+1]].sort((a,b)=>a-b).join("-"),
      directed:directedIndices.includes(index),gate:gateIndex===index
    }));
    if (new Set(edges.map(edge=>edge.key)).size !== edges.length) throw new Error(`Stage ${id} repeats an edge.`);
    return {id,chapter,points:transformPoints(base.p,id),route,edges,forcedStart:chapter>=2?route[0]:null,directedIndices,checkpoints,keyNode,gateIndex,ruleKey};
  }

  const stages = Array.from({length:30},(_,index)=>makeStage(index+1));
  const defaultSave = () => ({unlocked:1,stars:Array(30).fill(0),bestTimes:Array(30).fill(null),cleared:Array(30).fill(false)});
  function normalizeSave(raw){
    const clean=defaultSave();
    if(!raw||typeof raw!=="object"||Array.isArray(raw))return clean;
    if(Number.isFinite(raw.unlocked))clean.unlocked=Math.max(1,Math.min(30,Math.trunc(raw.unlocked)));
    if(Array.isArray(raw.stars))clean.stars=clean.stars.map((_,index)=>Number.isFinite(raw.stars[index])?Math.max(0,Math.min(3,Math.trunc(raw.stars[index]))):0);
    if(Array.isArray(raw.bestTimes))clean.bestTimes=clean.bestTimes.map((_,index)=>Number.isFinite(raw.bestTimes[index])&&raw.bestTimes[index]>=0?Math.round(raw.bestTimes[index]):null);
    if(Array.isArray(raw.cleared))clean.cleared=clean.cleared.map((_,index)=>raw.cleared[index]===true);
    return clean;
  }
  function loadSave(){let raw=null;try{raw=JSON.parse(readStorage(SAVE_KEY)||"null");}catch{}const clean=normalizeSave(raw);writeStorage(SAVE_KEY,JSON.stringify(clean));return clean;}
  let save = loadSave();
  const persist = () => writeStorage(SAVE_KEY,JSON.stringify(save));

  $(".trail-battle-canvas")?.insertAdjacentHTML("beforeend",`<section id="battleLeavePanel" class="battle-leave-overlay" role="dialog" aria-modal="true" aria-labelledby="battleLeaveTitle" aria-describedby="battleLeaveText" hidden><div class="battle-leave-card"><h2 id="battleLeaveTitle"></h2><p id="battleLeaveText"></p><div class="battle-leave-actions"><button id="battleContinueBtn" type="button"></button><button id="battleLeaveBtn" type="button"></button></div></div></section>`);

  const dom = {
    loading:$("#loadingPanel"),loadingText:$("#loadingText"),loadingFill:$("#loadingFill"),main:$("#mainScreen"),guide:$(".game-page-info"),stage:$("#stageScreen"),battle:$("#battleScreen"),locale:$("#localeSelect"),mainProgress:$("#mainProgress"),start:$("#startBtn"),stageBack:$("#stageBackBtn"),stageRail:$("#stageRail"),stageSummary:$("#stageSummary"),chapterKicker:$("#chapterKicker"),chapterTitle:$("#chapterTitle"),chapterRule:$("#chapterRule"),battleBack:$("#battleBackBtn"),stageLabel:$("#stageLabel"),edgeProgress:$("#edgeProgress"),trailCount:$("#trailCount"),starTotal:$("#starTotal"),objective:$("#objectiveRow"),scene:$("#puzzleScene"),svg:$("#graphSvg"),feedback:$("#feedbackText"),feedbackRow:$(".battle-feedback"),assist:$("#assistText"),undo:$("#undoBtn"),restart:$("#restartBtn"),hint:$("#hintBtn"),result:$("#resultPanel"),resultTitle:$("#resultTitle"),resultStars:$("#resultStars"),resultText:$("#resultText"),skillGrid:$("#skillGrid"),comparison:$("#comparisonText"),retry:$("#retryBtn"),resultStages:$("#resultStagesBtn"),next:$("#nextBtn"),leave:$("#battleLeavePanel"),leaveTitle:$("#battleLeaveTitle"),leaveText:$("#battleLeaveText"),continueBattle:$("#battleContinueBtn"),leaveBattle:$("#battleLeaveBtn")
  };
  // Stage and Battle fill the complete General safe physical width. Keep the
  // shared controllers' one-scale logical envelope, but supersede every
  // route shell's historical numeric 920px desktop cap at runtime.
  dom.stage.dataset.wpCanvasMaxWidth = "920";
  dom.stage.querySelector(".stage-canvas")?.setAttribute("data-wp-canvas-max-width", "920");
  dom.battle.querySelector(".trail-battle-canvas")?.setAttribute("data-wp-canvas-max-width", "920");

  let stageIndex = Math.max(0,Math.min(29,save.unlocked-1));
  let path = [];
  let hints = 0;
  let mistakes = 0;
  let restarts = 0;
  let runElapsed = 0;
  let runClockStartedAt = 0;
  let activePointer = null;
  let hintNode = null;
  let completing = false;
  let completionTimer = 0;
  let completionDeadline = 0;
  let completionRemaining = 0;
  let pendingCompletion = null;

  function sound(name){try{window.WonderSound?.play?.(name);}catch{}}
  function analytics(name,data={}){try{window.WonderAnalytics?.track?.(name,{game_id:GAME_ID,...data});}catch{}}
  function elapsedPlayTime(){return runElapsed+(runClockStartedAt?Date.now()-runClockStartedAt:0);}
  function pauseRunClock(){if(!runClockStartedAt)return;runElapsed+=Date.now()-runClockStartedAt;runClockStartedAt=0;}
  function resumeRunClock(){if(runClockStartedAt||document.hidden||document.body.dataset.screen!=="battle"||!dom.result.hidden||!dom.leave.hidden||completing)return;runClockStartedAt=Date.now();}
  function clearCompletionTransition(){if(completionTimer)clearTimeout(completionTimer);completionTimer=0;completionDeadline=0;completionRemaining=0;pendingCompletion=null;}
  function armCompletionTransition(){if(completionTimer||!pendingCompletion||document.hidden||document.body.dataset.screen!=="battle"||!completing)return;const delay=Math.max(0,completionRemaining);completionDeadline=performance.now()+delay;completionTimer=setTimeout(()=>{completionTimer=0;completionDeadline=0;completionRemaining=0;if(document.hidden)return;const completion=pendingCompletion;if(!completion||document.body.dataset.screen!=="battle"||!completing||stageIndex!==completion.stageIndex){clearCompletionTransition();return;}pendingCompletion=null;showResult(completion.earned,completion.elapsed,completion.previous);},delay);}
  function scheduleCompletionTransition(completion,delay=420){clearCompletionTransition();pendingCompletion=completion;completionRemaining=delay;armCompletionTransition();}
  function suspendCompletionTransition(){if(!completionTimer)return;completionRemaining=Math.max(0,completionDeadline-performance.now());clearTimeout(completionTimer);completionTimer=0;completionDeadline=0;}
  function resumeCompletionTransition(){armCompletionTransition();}
  function totalStars(){return save.stars.reduce((sum,value)=>sum+Number(value||0),0);}
  function clearedCount(){return save.cleared.filter(Boolean).length;}
  function formatTime(ms){const seconds=Math.max(0,Math.round(ms/1000));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`;}

  function applyLocale() {
    document.documentElement.lang = locale;
    dom.locale.value = locale;
    writeStorage(LOCALE_KEY,locale);
    $$('[data-i18n]').forEach(node => {node.textContent=t(node.dataset.i18n);});
    dom.stageBack.setAttribute("aria-label",t("backToMain"));
    dom.battleBack.setAttribute("aria-label",t("backToStage"));
    dom.stageRail.setAttribute("aria-label",t("stageRailLabel"));
    dom.scene.setAttribute("aria-label",t("puzzleLabel"));
    dom.svg.setAttribute("aria-label",t("graphLabel"));
    renderBattleLeave();
    dom.loadingText.textContent=t("loading");
    localizeGuide();
    updateMainProgress();
    if (!dom.stage.hidden) renderStages();
    if (!dom.battle.hidden) {renderBattleLabels();updateGraph();}
  }

  let localizingGuide = false;
  function localizeGuide() {
    const liveGuide = $(".game-page-info");
    if (liveGuide && liveGuide !== dom.guide) {
      dom.guide = liveGuide;
      dom.guide.hidden = document.body.dataset.screen !== "main";
    }
    if (locale !== "zh-Hans" || localizingGuide || !dom.guide) return;
    localizingGuide = true;
    const simplify = window.WonderI18n?.simplifyChineseText;
    dom.guide.querySelectorAll(".game-info-kicker, h2, h3, p, li, dt, dd, span, strong").forEach(node => {
      let value = typeof simplify === "function" ? simplify(node.textContent) : node.textContent;
      if (node.classList.contains("game-info-kicker")) value = "WeightPlay 一般游戏指南";
      if (value === "Player and Save Information") value = "玩家与存档说明";
      if (node.textContent !== value) node.textContent = value;
    });
    localizingGuide = false;
  }
  new MutationObserver(localizeGuide).observe(document.body,{childList:true,subtree:true});

  function updateMainProgress(){dom.mainProgress.innerHTML=`<strong>${t("progress",{cleared:clearedCount()})}</strong><span>${t("bestStars",{stars:totalStars()})}</span>`;}
  function setScreen(screen){document.body.dataset.screen=screen;dom.main.hidden=screen!=="main";dom.guide.hidden=screen!=="main";dom.stage.hidden=screen!=="stage";dom.battle.hidden=screen!=="battle";window.scrollTo({top:0,left:0,behavior:"auto"});}

  const battleLeaveCovered = () => [$(".battle-header"),dom.objective,dom.scene,dom.feedbackRow,$(".battle-actions")].filter(Boolean);
  function renderBattleLeave(){dom.leaveTitle.textContent=t("leaveTitle");dom.leaveText.textContent=t("leaveText");dom.continueBattle.textContent=t("continueBattle");dom.leaveBattle.textContent=t("returnStages");}
  function setBattleLeaveCoverage(covered){battleLeaveCovered().forEach(node=>{node.inert=covered;if(covered)node.setAttribute("aria-hidden","true");else node.removeAttribute("aria-hidden");});}
  function cancelActivePointer(pointerId=null){if(activePointer===null||(pointerId!==null&&activePointer!==pointerId))return false;const owner=activePointer;activePointer=null;try{if(dom.svg.hasPointerCapture?.(owner))dom.svg.releasePointerCapture(owner);}catch{}return true;}
  function openBattleLeave(){if(document.body.dataset.screen!=="battle"||!dom.result.hidden||completing)return;cancelActivePointer();pauseRunClock();renderBattleLeave();setBattleLeaveCoverage(true);dom.leave.hidden=false;requestAnimationFrame(()=>dom.continueBattle.focus({preventScroll:true}));}
  function closeBattleLeave(resume=true){if(dom.leave.hidden)return;dom.leave.hidden=true;setBattleLeaveCoverage(false);if(resume)resumeRunClock();requestAnimationFrame(()=>dom.battleBack.focus({preventScroll:true}));}
  function leaveBattle(){dom.leave.hidden=true;setBattleLeaveCoverage(false);pauseRunClock();sound("click");showStage(stageIndex);}

  function showMain(){clearCompletionTransition();completing=false;dom.result.hidden=true;dom.leave.hidden=true;setBattleLeaveCoverage(false);setScreen("main");updateMainProgress();requestAnimationFrame(()=>dom.start.focus({preventScroll:true}));}
  function showStage(focusIndex=stageIndex){clearCompletionTransition();completing=false;dom.result.hidden=true;dom.leave.hidden=true;setBattleLeaveCoverage(false);setScreen("stage");stageIndex=Math.max(0,Math.min(29,focusIndex));renderStages();requestAnimationFrame(()=>{const card=dom.stageRail.querySelector(`[data-index="${Math.min(save.unlocked-1,stageIndex)}"]`);card?.scrollIntoView({inline:"center",block:"nearest",behavior:"auto"});card?.focus({preventScroll:true});});}

  function stageStatus(stage){if(save.cleared[stage.id-1])return t("cleared");if(stage.id<=save.unlocked)return t("available");return t("locked");}
  function renderStages(){
    dom.stageRail.replaceChildren(...stages.map((stage,index)=>{
      const button=document.createElement("button");
      const locked=stage.id>save.unlocked;
      button.type="button";button.className=`stage-card ${locked?"locked":"unlocked"} ${save.cleared[index]?"cleared":""} ${index===stageIndex?"selected":""}`;button.disabled=locked;button.dataset.index=index;button.dataset.stageId=stage.id;
      button.innerHTML=`<small>${t("stage",{})} ${stage.id} · ${t(stage.ruleKey)}</small><strong>${t(`chapter${stage.chapter}`)}</strong><p>${t(`rule${stage.chapter}`)}</p><footer><span>${stageStatus(stage)}</span><span class="card-stars">${"★".repeat(save.stars[index])}${"☆".repeat(3-save.stars[index])}</span></footer>`;
      return button;
    }));
    dom.stageSummary.textContent=t("stageSummary",{cleared:clearedCount(),stars:totalStars()});
    updateChapterPanel(stageIndex);
  }

  function updateChapterPanel(index){stageIndex=Math.max(0,Math.min(29,index));const stage=stages[stageIndex];dom.chapterKicker.textContent=t("chapter",{number:stage.chapter});dom.chapterTitle.textContent=t(`chapter${stage.chapter}`);dom.chapterRule.textContent=t(`rule${stage.chapter}`);$$('.stage-card.selected').forEach(card=>card.classList.remove("selected"));dom.stageRail.querySelector(`[data-index="${stageIndex}"]`)?.classList.add("selected");}

  function startStage(index){
    clearCompletionTransition();stageIndex=index;path=[];hints=0;mistakes=0;restarts=0;hintNode=null;completing=false;runElapsed=0;runClockStartedAt=0;dom.result.hidden=true;dom.leave.hidden=true;setBattleLeaveCoverage(false);setScreen("battle");resumeRunClock();buildGraph();renderBattleLabels();updateGraph();setFeedback(t("ready"));analytics("game_start",{stage:index+1});window.dispatchEvent(new CustomEvent("weightplay:battle-open"));
  }

  function currentStage(){return stages[stageIndex];}
  function edgeBetween(a,b){return currentStage().edges.find(edge=>edge.key===[a,b].sort((x,y)=>x-y).join("-"));}
  function deriveState(candidatePath=path){
    const stage=currentStage();const used=new Set();let checkpointProgress=0;let keyFound=candidatePath[0]===stage.keyNode;
    for(let i=0;i<candidatePath.length-1;i+=1){const edge=edgeBetween(candidatePath[i],candidatePath[i+1]);if(edge)used.add(edge.key);const node=candidatePath[i+1];const checkpointAt=stage.checkpoints.indexOf(node);if(checkpointAt===checkpointProgress)checkpointProgress+=1;if(node===stage.keyNode)keyFound=true;}
    return {used,checkpointProgress,keyFound,current:candidatePath.at(-1)??null};
  }

  function transitionAllowed(edge,from,state){
    const stage=currentStage();if(state.used.has(edge.key))return {ok:false,reason:"usedTrail"};
    const to=edge.from===from?edge.to:edge.from;
    if(edge.directed&&edge.from!==from)return {ok:false,reason:"wrongWay"};
    if(edge.gate&&!state.keyFound)return {ok:false,reason:"gateLocked"};
    const cpAt=stage.checkpoints.indexOf(to);if(cpAt>state.checkpointProgress)return {ok:false,reason:"checkpoint",number:state.checkpointProgress+1};
    return {ok:true,to,checkpointProgress:cpAt===state.checkpointProgress?state.checkpointProgress+1:state.checkpointProgress,keyFound:state.keyFound||to===stage.keyNode};
  }

  function solveFrom(current,used,checkpointProgress,keyFound){
    const stage=currentStage();if(used.size===stage.edges.length)return [];
    const candidates=stage.edges.filter(edge=>!used.has(edge.key)&&(edge.from===current||edge.to===current));
    for(const edge of candidates){const allowed=transitionAllowed(edge,current,{used,checkpointProgress,keyFound});if(!allowed.ok)continue;const nextUsed=new Set(used);nextUsed.add(edge.key);const rest=solveFrom(allowed.to,nextUsed,allowed.checkpointProgress,allowed.keyFound);if(rest)return [allowed.to,...rest];}
    return null;
  }

  function validStart(node){const stage=currentStage();if(stage.forcedStart!==null&&node!==stage.forcedStart)return false;let cp=stage.checkpoints[0]===node?1:0;return Boolean(solveFrom(node,new Set(),cp,node===stage.keyNode));}
  function setFeedback(message,type=""){dom.feedback.textContent=message;dom.feedbackRow.classList.remove("error","success");if(type)dom.feedbackRow.classList.add(type);}
  function reject(reason,vars={}){mistakes+=1;sound("error");setFeedback(t(reason,vars),"error");dom.scene.classList.remove("shake");void dom.scene.offsetWidth;dom.scene.classList.add("shake");updateAssist();}

  function chooseNode(node){
    if(completing||!dom.result.hidden)return;
    const stage=currentStage();hintNode=null;
    if(path.length===0){if(stage.forcedStart!==null&&node!==stage.forcedStart){reject("wrongStart");return;}if(!validStart(node)){reject("deadEnd");return;}path=[node];sound("click");setFeedback(t("continue"));updateGraph();return;}
    const state=deriveState();const edge=edgeBetween(state.current,node);if(!edge){reject("notConnected");return;}const allowed=transitionAllowed(edge,state.current,state);if(!allowed.ok){reject(allowed.reason,{number:allowed.number});return;}
    const hadKey=state.keyFound;path.push(node);sound("click");updateGraph();const nextState=deriveState();
    if(!hadKey&&nextState.keyFound)setFeedback(t("keyFound"),"success");else if(nextState.checkpointProgress<stage.checkpoints.length)setFeedback(t("checkpoint",{number:nextState.checkpointProgress+1}));else setFeedback(t("continue"));
    if(nextState.used.size===stage.edges.length){completeStage();return;}
    if(!solveFrom(nextState.current,nextState.used,nextState.checkpointProgress,nextState.keyFound))setFeedback(t("deadEnd"),"error");
  }

  function undo(){if(completing||path.length===0)return;path.pop();hintNode=null;sound("click");setFeedback(path.length?t("continue"):t("ready"));updateGraph();}
  function restartAttempt(count=true){if(completing)return;if(count&&path.length)restarts+=1;path=[];hintNode=null;sound("click");setFeedback(t("ready"));updateGraph();if(count)analytics("game_restart",{stage:stageIndex+1});}
  function showHint(){if(completing)return;const stage=currentStage();let node=null;if(path.length===0){node=stage.forcedStart??stage.points.map((_,index)=>index).find(validStart);setFeedback(t("hintStart"));}else{const state=deriveState();node=solveFrom(state.current,state.used,state.checkpointProgress,state.keyFound)?.[0]??null;setFeedback(node===null?t("deadEnd"):t("hintNext"));}if(node!==null){hints+=1;hintNode=node;sound("click");updateGraph();updateAssist();}}

  function buildGraph(){
    const stage=currentStage();const ns="http://www.w3.org/2000/svg";dom.svg.replaceChildren();
    const edgeLayer=document.createElementNS(ns,"g");edgeLayer.setAttribute("class","edge-layer");stage.edges.forEach(edge=>{const line=document.createElementNS(ns,"line");const [x1,y1]=stage.points[edge.from],[x2,y2]=stage.points[edge.to];line.setAttribute("x1",x1);line.setAttribute("y1",y1);line.setAttribute("x2",x2);line.setAttribute("y2",y2);line.dataset.edge=edge.key;line.classList.add("graph-edge");if(edge.directed)line.classList.add("directed");if(edge.gate)line.classList.add("gate");line.setAttribute("aria-label",t("edgeLabel",{from:edge.from+1,to:edge.to+1}));edgeLayer.append(line);if(edge.directed){const arrow=document.createElementNS(ns,"path");const midpointX=(x1+x2)/2,midpointY=(y1+y2)/2,angle=Math.atan2(y2-y1,x2-x1)*180/Math.PI;arrow.classList.add("direction-arrow");arrow.dataset.edge=edge.key;arrow.setAttribute("d","M -3.6 -2.7 L 3.8 0 L -3.6 2.7 Z");arrow.setAttribute("transform",`translate(${midpointX} ${midpointY}) rotate(${angle})`);arrow.setAttribute("aria-hidden","true");edgeLayer.append(arrow);}});dom.svg.append(edgeLayer);
    const nodeLayer=document.createElementNS(ns,"g");nodeLayer.setAttribute("class","node-layer");stage.points.forEach(([x,y],index)=>{const group=document.createElementNS(ns,"g");group.classList.add("graph-node");group.dataset.node=index;group.setAttribute("role","button");group.setAttribute("tabindex","0");group.setAttribute("transform",`translate(${x} ${y})`);const halo=document.createElementNS(ns,"circle");halo.setAttribute("r","6.7");halo.classList.add("node-halo");const core=document.createElementNS(ns,"circle");core.setAttribute("r","4.5");core.classList.add("node-core");const label=document.createElementNS(ns,"text");label.classList.add("node-label");label.setAttribute("y",".4");group.append(halo,core,label);group.addEventListener("pointerdown",event=>{if(activePointer!==null||event.isPrimary===false||(event.pointerType==="mouse"&&event.button!==0))return;event.preventDefault();activePointer=event.pointerId;try{dom.svg.setPointerCapture?.(event.pointerId);}catch{}chooseNode(index);});group.addEventListener("keydown",event=>{if(event.repeat)return;if(event.key==="Enter"||event.key===" "){event.preventDefault();chooseNode(index);}});nodeLayer.append(group);});dom.svg.append(nodeLayer);
  }

  function updateGraph(){
    const stage=currentStage();const state=deriveState();$$('.graph-edge').forEach(line=>{line.classList.toggle("used",state.used.has(line.dataset.edge));const edge=stage.edges.find(item=>item.key===line.dataset.edge);line.classList.toggle("open",Boolean(edge?.gate&&state.keyFound));});
    $$('.graph-node').forEach(group=>{const node=Number(group.dataset.node);const cpAt=stage.checkpoints.indexOf(node);group.classList.toggle("current",node===state.current);group.classList.toggle("start",node===stage.forcedStart);group.classList.toggle("key",node===stage.keyNode);group.classList.toggle("checkpoint",cpAt>=0);group.classList.toggle("hinted",node===hintNode);const label=group.querySelector(".node-label");label.textContent=cpAt>=0?String(cpAt+1):node===stage.keyNode?"K":node===stage.forcedStart?"S":"";let aria=t("node",{number:node+1});if(node===stage.forcedStart)aria=t("startNode",{number:node+1});if(node===stage.keyNode)aria=t("keyNode",{number:node+1});if(cpAt>=0)aria=t("checkpointNode",{order:cpAt+1});group.setAttribute("aria-label",aria);group.setAttribute("aria-pressed",String(node===state.current));});
    const used=state.used.size,total=stage.edges.length;dom.edgeProgress.style.width=`${used/total*100}%`;dom.trailCount.textContent=`${used} / ${total}`;dom.starTotal.textContent=String(totalStars());dom.undo.disabled=path.length===0;updateAssist();
  }

  function renderBattleLabels(){const stage=currentStage();dom.stageLabel.textContent=`${t("stage")} ${stage.id} · ${t(`chapter${stage.chapter}`)}`;dom.objective.textContent=t(`rule${stage.chapter}`);}
  function updateAssist(){dom.assist.textContent=t("assist",{hints,mistakes:mistakes+restarts});}

  function completeStage(){
    if(completing)return;const elapsed=elapsedPlayTime();completing=true;pauseRunClock();const stage=currentStage();const assists=mistakes+restarts+hints*2;const earned=assists===0?3:assists<=3?2:1;const previous=save.bestTimes[stageIndex];save.cleared[stageIndex]=true;save.stars[stageIndex]=Math.max(save.stars[stageIndex]||0,earned);save.bestTimes[stageIndex]=previous===null?elapsed:Math.min(previous,elapsed);save.unlocked=Math.max(save.unlocked,Math.min(30,stage.id+1));persist();sound("success");setFeedback(t("complete"),"success");dom.scene.classList.add("sparkle");analytics("game_complete",{stage:stage.id,stars:earned,hints,mistakes:mistakes+restarts,time_ms:elapsed});scheduleCompletionTransition({stageIndex,earned,elapsed,previous});
  }

  function showResult(earned,elapsed,previous){const stage=currentStage();dom.resultTitle.textContent=t("resultTitle");dom.resultStars.textContent="★".repeat(earned)+"☆".repeat(3-earned);dom.resultText.textContent=t("resultText",{edges:stage.edges.length,time:formatTime(elapsed)});dom.skillGrid.innerHTML=`<div><small>${t("logic")}</small><strong>${t("logicValue",{edges:stage.edges.length})}</strong></div><div><small>${t("focus")}</small><strong>${t("focusValue",{mistakes:mistakes+restarts})}</strong></div><div><small>${t("problem")}</small><strong>${t("problemValue",{hints})}</strong></div>`;dom.comparison.textContent=previous===null||elapsed<previous?t("newBest"):t("previousBest",{time:formatTime(previous)});dom.next.hidden=stage.id>=30;dom.result.hidden=false;requestAnimationFrame(()=>{(dom.next.hidden?dom.retry:dom.next).focus({preventScroll:true});window.dispatchEvent(new CustomEvent("weightplay:battle-open"));});}

  dom.svg.addEventListener("pointermove",event=>{if(activePointer!==event.pointerId||path.length===0||completing)return;const rect=dom.svg.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width*100;const y=(event.clientY-rect.top)/rect.height*100;let nearest=-1,best=8.5;currentStage().points.forEach(([nx,ny],index)=>{const distance=Math.hypot(nx-x,ny-y);if(distance<best){best=distance;nearest=index;}});if(nearest>=0&&nearest!==path.at(-1))chooseNode(nearest);});
  const endPointer=event=>cancelActivePointer(event.pointerId);dom.svg.addEventListener("pointerup",endPointer);dom.svg.addEventListener("pointercancel",endPointer);dom.svg.addEventListener("lostpointercapture",endPointer);window.addEventListener("blur",()=>cancelActivePointer());
  [dom.undo,dom.restart,dom.hint].forEach(control=>control.addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault();}));
  dom.stageRail.addEventListener("click",event=>{const card=event.target.closest(".stage-card.unlocked");if(!card)return;startStage(Number(card.dataset.index));});
  dom.stageRail.addEventListener("wonder:stage-snap",event=>{const card=event.detail?.card||document.elementFromPoint(innerWidth/2,Math.min(innerHeight-120,innerHeight*.78))?.closest?.(".stage-card");if(card)updateChapterPanel(Number(card.dataset.index));});
  dom.leave.addEventListener("keydown",event=>{if(event.key==="Escape"){event.preventDefault();closeBattleLeave();return;}if(event.key!=="Tab")return;const first=dom.continueBattle,last=dom.leaveBattle;if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
  document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelActivePointer();pauseRunClock();suspendCompletionTransition();}else{resumeRunClock();resumeCompletionTransition();}});window.addEventListener("pagehide",()=>{cancelActivePointer();pauseRunClock();suspendCompletionTransition();});window.addEventListener("pageshow",()=>{resumeRunClock();resumeCompletionTransition();});
  dom.start.addEventListener("click",()=>{sound("click");showStage();});dom.stageBack.addEventListener("click",()=>{sound("click");showMain();});dom.battleBack.addEventListener("click",()=>{sound("click");openBattleLeave();});dom.continueBattle.addEventListener("click",()=>{sound("click");closeBattleLeave();});dom.leaveBattle.addEventListener("click",leaveBattle);dom.undo.addEventListener("click",undo);dom.restart.addEventListener("click",()=>restartAttempt(true));dom.hint.addEventListener("click",showHint);dom.retry.addEventListener("click",()=>startStage(stageIndex));dom.resultStages.addEventListener("click",()=>showStage(stageIndex));dom.next.addEventListener("click",()=>startStage(Math.min(29,stageIndex+1)));dom.locale.addEventListener("change",()=>{locale=dom.locale.value;applyLocale();});

  async function boot(){applyLocale();analytics("game_view");const assets=["../../assets/animal-starlight-trails-cover.webp","../../assets/animal-starlight-trails-bg.webp","../../assets/weightplay-character-moon-cap-owl-cutout.webp"];let loaded=0;await Promise.allSettled(assets.map(src=>new Promise(resolve=>{const image=new Image();const done=()=>{loaded+=1;dom.loadingFill.style.width=`${loaded/assets.length*100}%`;resolve();};image.onload=done;image.onerror=done;image.src=src;})));setTimeout(()=>{dom.loading.hidden=true;showMain();},180);}
  if (new URLSearchParams(location.search).get("trial") === "1") {
    window.__animalStarlightTrailsSmoke = {
      stages: stages.map(stage => ({id:stage.id,route:[...stage.route],edges:stage.edges.length,chapter:stage.chapter})),
      leaveCopy: () => Object.fromEntries(Object.entries(STRINGS).map(([key,strings])=>[key,[strings.leaveTitle,strings.leaveText,strings.continueBattle,strings.returnStages]])),
      startStage,
      snapshot: () => ({stage:stageIndex+1,path:[...path],hints,mistakes,restarts,elapsed:elapsedPlayTime(),screen:document.body.dataset.screen,resultVisible:!dom.result.hidden,pointerOwner:activePointer,save:JSON.parse(JSON.stringify(save))}),
    };
  }
  boot();
})();
