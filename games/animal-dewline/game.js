(async () => {
  "use strict";
  // Only the verified expansion data may increase the shared Stage count.
  // The original twelve remain available when any expansion dependency fails.
  let extension = null;
  const extensionMinimums = [4,6,7,6,7,8,6,8,6,6,8,10,10,3,5,7,11,12,17,16,16,18,18,19,21,23,24,30,16,17,19,19,22,17,22,18,23,25,17,19,20,20,24,20,20,20,22,26];
  let loadTimer;
  try {
    const dependencies = Promise.all([
      import('/games/animal-dewline/stage60-model.mjs?v=20261027-dewline-v19'),
      import('/games/animal-dewline/stage60-hint-client.mjs?v=20261027-dewline-v19'),
      import('/games/animal-dewline/stage60-copy.js?v=20261027-dewline-v19'),
      import('/games/animal-dewline/stage60-guide.js?v=20261027-dewline-v19'),
    ]);
    const loaded = await Promise.race([dependencies, new Promise(resolve => { loadTimer = setTimeout(() => resolve(null),3000); })]);
    if (!loaded) throw new Error('DEWLINE_EXPANSION_TIMEOUT');
    const [rules,hints] = loaded;
    const text = globalThis.AnimalDewlineStage60Copy;
    const guide = globalThis.AnimalDewlineStage60Guide;
    const locales = ['en','zh-Hant','zh-Hans','ja','ko','es','pt-BR','fr','de','it','ru','hi','ar'];
    const requiredText = ['clip','clipPipe','removeClip','invalidPipe','diverter','divertTo','diverterAt','diverterSensorLocked','transfer','transferAction','transferBlocked','valveLocked','sensorGoal','sensorProgress','sensorLatched','bottle','capture','captureValue','slots','captureOrder','captureUnavailable','captureCondition','moveClipAfterCapture','valveLocksAfterCapture','undoMove','hintAction','noPath','goalCondition','bloomNotReady','stageLocked','storageFailed','clipEffect','captureEffect','captureSlotFull','sensorOnePerMove','toolMoveCost','hintPending','hintError'];
    const requiredGuide = ['chapterOne','chapterOneDescription','chapterTwo','chapterTwoDescription','guideIntro','guideGoal','guideValves','guideClip','guideDiverter','guideTransfer','guideSensors','guideBottle','guideLate','guideUndoHint','guideStars','guideProgress','guideStorage','faqCountQuestion','faqValvesQuestion','faqWrongQuestion','faqSelectionQuestion','faqProgressQuestion','faqTotalExampleQuestion','faqCheckCountQuestion','faqCountAnswer','faqValvesAnswer','faqWrongAnswer','faqSelectionAnswer','faqProgressAnswer','faqTotalExampleAnswer','faqCheckCountAnswer'];
    if (!Array.isArray(rules.STAGES) || rules.STAGES.length !== 48 || extensionMinimums.length !== 48 ||
        !rules.STAGES.every((stage,index) => stage.number === index + 13 && stage.targets.length === 3) ||
        !['initialAttempt','performAttempt','isGoal','actions','flow','applyAction'].every(key => typeof rules[key] === 'function') ||
        typeof hints.createHintClient !== 'function' || typeof text?.format !== 'function' ||
        !locales.every(locale => requiredText.every(key => typeof text.locales?.[locale]?.[key] === 'string' && text.locales[locale][key].trim())) ||
        !locales.every(locale => {
          const names = guide?.locales?.[locale]?.stageNames, words = guide?.locales?.[locale]?.guide;
          const values = Array.from({length:48},(_,index) => names?.[String(index+13)]);
          return values.every(value => typeof value === 'string' && value.trim()) && new Set(values).size === 48 &&
            words && requiredGuide.every(key => typeof words[key] === 'string' && words[key].trim());
        })) throw new Error('DEWLINE_EXPANSION_INCOMPLETE');
    extension = {rules, text, guide, hintClient:hints.createHintClient()};
  } catch (_) { extension = null; } finally { clearTimeout(loadTimer); }
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete", stageId:null };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null) === "battle" && (__wpMeasurement.ended)) ? null : (({main:"main",stage:"stage",battle:"battle",})[state.screen] ?? null), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    stageIdAuthoritative: true, stageId: __wpMeasurement.stageId,
    paused: Boolean(state?.paused || state?.suspended || state?.leaveOpen || state?.resultOpen), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const copy = window.ANIMAL_DEWLINE_LOCALES || {};
  const interfaceCopy = {
    en: { start: "Start Game", stages: "Stages", replay: "Replay", leaveTitle: "Leave this meadow?", leaveText: "Continue keeps your valve settings. Returning to Stages ends this attempt.", continue: "Continue", returnStage: "Return to Stages" },
    "zh-Hant": { start: "開始遊戲", stages: "關卡", replay: "重新挑戰", leaveTitle: "要離開這個關卡嗎？", leaveText: "繼續會保留目前的閥門設定；返回關卡會結束這次嘗試。", continue: "繼續遊戲", returnStage: "返回關卡" },
    "zh-Hans": { start: "开始游戏", stages: "关卡", replay: "重新挑战", leaveTitle: "要离开这个关卡吗？", leaveText: "继续会保留当前阀门设置；返回关卡会结束本次尝试。", continue: "继续游戏", returnStage: "返回关卡" },
    ja: { start: "ゲーム開始", stages: "ステージ", replay: "リプレイ", leaveTitle: "このステージを離れますか？", leaveText: "続けると現在のバルブ設定を保持します。ステージへ戻るとこの挑戦は終了します。", continue: "続ける", returnStage: "ステージへ戻る" },
    ko: { start: "게임 시작", stages: "스테이지", replay: "다시 플레이", leaveTitle: "이 스테이지를 나갈까요?", leaveText: "계속하면 현재 밸브 설정이 유지됩니다. 스테이지로 돌아가면 이번 시도가 끝납니다.", continue: "계속", returnStage: "스테이지로 돌아가기" },
    es: { start: "Iniciar juego", stages: "Niveles", replay: "Repetir", leaveTitle: "¿Salir de este nivel?", leaveText: "Continuar conserva los ajustes. Volver a Niveles termina este intento.", continue: "Continuar", returnStage: "Volver a Niveles" },
    "pt-BR": { start: "Iniciar jogo", stages: "Fases", replay: "Jogar novamente", leaveTitle: "Sair desta fase?", leaveText: "Continuar mantém os ajustes das válvulas. Voltar às Fases encerra esta tentativa.", continue: "Continuar", returnStage: "Voltar às Fases" },
    fr: { start: "Démarrer le jeu", stages: "Niveaux", replay: "Rejouer", leaveTitle: "Quitter ce niveau ?", leaveText: "Continuer conserve les réglages. Revenir aux Niveaux termine cette tentative.", continue: "Continuer", returnStage: "Retour aux Niveaux" },
    de: { start: "Spiel starten", stages: "Level", replay: "Wiederholen", leaveTitle: "Dieses Level verlassen?", leaveText: "Weiter behält die Ventileinstellungen. Zurück zu den Leveln beendet diesen Versuch.", continue: "Weiter", returnStage: "Zurück zu den Leveln" },
    it: { start: "Avvia gioco", stages: "Livelli", replay: "Rigioca", leaveTitle: "Uscire da questo livello?", leaveText: "Continua mantiene le impostazioni. Tornare ai Livelli termina questo tentativo.", continue: "Continua", returnStage: "Torna ai Livelli" },
    ru: { start: "Начать игру", stages: "Уровни", replay: "Повторить", leaveTitle: "Выйти из этого уровня?", leaveText: "Продолжение сохранит настройки клапанов. Возврат к уровням завершит попытку.", continue: "Продолжить", returnStage: "К уровням" },
    hi: { start: "गेम शुरू करें", stages: "स्तर", replay: "फिर खेलें", leaveTitle: "इस स्तर से बाहर निकलें?", leaveText: "जारी रखने पर वाल्व सेटिंग बनी रहेंगी। स्तरों पर लौटने से यह कोशिश समाप्त होगी।", continue: "जारी रखें", returnStage: "स्तरों पर लौटें" },
    ar: { start: "ابدأ اللعبة", stages: "المراحل", replay: "إعادة اللعب", leaveTitle: "هل تريد مغادرة هذه المرحلة؟", leaveText: "المتابعة تحفظ إعدادات الصمامات. العودة إلى المراحل تنهي هذه المحاولة.", continue: "متابعة", returnStage: "العودة إلى المراحل" }
  };
  Object.entries(interfaceCopy).forEach(([locale, labels]) => {
    if (!copy[locale]) return;
    copy[locale].start = labels.start;
    copy[locale].plots = labels.stages;
    copy[locale].map = labels.stages;
    copy[locale].replay = labels.replay;
  });

  // Rows are flower beds; columns are valves A/B/C. Later chapters introduce
  // real branching water lines rather than three unrelated number counters.
  const networks = [
    [[1,0,0],[0,1,0],[0,0,1]],
    [[1,0,0],[1,1,0],[0,0,1]],
    [[1,0,0],[1,1,0],[0,1,1]],
    [[1,1,0],[0,1,1],[1,0,1]],
  ];
  const solutions = [[1,1,1],[1,2,1],[2,3,1],[2,1,2],[1,3,2],[3,2,1],[2,1,3],[1,4,2],[4,2,3],[2,3,1],[4,1,3],[3,5,2]];
  const meadows = solutions.map((solution, index) => {
    const chapter = Math.floor(index / 3), network = networks[chapter];
    return { titleKey: `gardenStage${chapter}`, chapter, network,
      targets: network.map((row) => row.reduce((sum, weight, valve) => sum + weight * solution[valve], 0)) };
  });
  // Optional checkpoint decisions do not change legacy goals, stars or rewards.
  // Order: stage-5 name/goal, stage-10 name/goal, pending, earned, missed.
  const checkpointCopy = {
    en:['Branch Order','Optional: bring valve B to 3 before increasing A.','Two-Bed Relay','Optional: bring bed 2 to 4 before bed 1 reaches 5.','Challenge in progress.','Checkpoint challenge complete!','Challenge missed; the stage still counts. Undo or reset to try again.'],
    'zh-Hant':['分支順序','可選挑戰：增加 A 之前，先讓閥門 B 達到 3。','雙花圃接力','可選挑戰：花圃 1 達到 5 之前，先讓花圃 2 達到 4。','挑戰進行中。','檢查點挑戰完成！','挑戰未達成，關卡仍可通關。可復原或重設再試。'],
    'zh-Hans':['分支顺序','可选挑战：增加 A 之前，先让阀门 B 达到 3。','双花圃接力','可选挑战：花圃 1 达到 5 之前，先让花圃 2 达到 4。','挑战进行中。','检查点挑战完成！','挑战未达成，关卡仍可通关。可撤销或重设再试。'],
    ja:['枝分かれの順番','任意の挑戦：A を増やす前にバルブ B を 3 にしよう。','花だんリレー','任意の挑戦：花だん 1 が 5 になる前に花だん 2 を 4 にしよう。','挑戦中。','チェックポイントの挑戦を達成！','挑戦は未達成ですが、ステージはクリアできます。戻すかリセットして再挑戦できます。'],
    ko:['갈림길 순서','선택 도전: A를 올리기 전에 밸브 B를 3으로 만드세요.','두 화단 이어주기','선택 도전: 화단 1이 5가 되기 전에 화단 2를 4로 만드세요.','도전 진행 중.','체크포인트 도전 완료!','도전을 놓쳐도 스테이지는 완료할 수 있어요. 되돌리거나 초기화해 다시 도전하세요.'],
    es:['Orden de ramas','Reto opcional: lleva la válvula B a 3 antes de subir A.','Relevo de parterres','Reto opcional: lleva el parterre 2 a 4 antes de que el 1 llegue a 5.','Reto en curso.','¡Reto del punto de control completado!','Reto no logrado; puedes completar la fase. Deshaz o reinicia para intentarlo de nuevo.'],
    'pt-BR':['Ordem dos ramos','Desafio opcional: leve a válvula B a 3 antes de aumentar A.','Revezamento dos canteiros','Desafio opcional: leve o canteiro 2 a 4 antes de o 1 chegar a 5.','Desafio em andamento.','Desafio do ponto de controle concluído!','Desafio não concluído; a fase ainda pode ser concluída. Desfaça ou reinicie para tentar de novo.'],
    fr:['Ordre des branches','Défi facultatif : monte la vanne B à 3 avant d’augmenter A.','Relais des parterres','Défi facultatif : mène le parterre 2 à 4 avant que le 1 atteigne 5.','Défi en cours.','Défi du point de contrôle réussi !','Défi manqué ; le niveau reste réalisable. Annule ou recommence pour réessayer.'],
    de:['Reihenfolge der Zweige','Freiwillige Aufgabe: Stelle Ventil B auf 3, bevor du A erhöhst.','Beet-Staffel','Freiwillige Aufgabe: Bringe Beet 2 auf 4, bevor Beet 1 die 5 erreicht.','Aufgabe läuft.','Kontrollpunkt-Aufgabe geschafft!','Aufgabe verpasst; das Level bleibt lösbar. Mache Schritte rückgängig oder starte neu.'],
    it:['Ordine dei rami','Sfida facoltativa: porta la valvola B a 3 prima di aumentare A.','Staffetta delle aiuole','Sfida facoltativa: porta l’aiuola 2 a 4 prima che la 1 arrivi a 5.','Sfida in corso.','Sfida del punto di controllo completata!','Sfida mancata; puoi comunque completare il livello. Annulla o ricomincia per riprovare.'],
    ru:['Порядок ветвей','Необязательное задание: доведи клапан B до 3, прежде чем повышать A.','Эстафета клумб','Необязательное задание: доведи клумбу 2 до 4 раньше, чем клумба 1 достигнет 5.','Задание выполняется.','Задание контрольной точки выполнено!','Задание не выполнено, но уровень можно пройти. Отмени ход или начни заново.'],
    hi:['शाखाओं का क्रम','वैकल्पिक चुनौती: A बढ़ाने से पहले वाल्व B को 3 तक पहुँचाएँ।','दो क्यारियों की बारी','वैकल्पिक चुनौती: क्यारी 1 के 5 तक पहुँचने से पहले क्यारी 2 को 4 तक पहुँचाएँ।','चुनौती जारी है।','जाँच-बिंदु की चुनौती पूरी हुई!','चुनौती छूटी, फिर भी स्तर पूरा कर सकते हैं। चाल हटाएँ या फिर शुरू करें।'],
    ar:['ترتيب الفروع','تحدٍّ اختياري: أوصل الصمام ⁨B⁩ إلى ⁨3⁩ قبل زيادة ⁨A⁩.','تتابع الحوضين','تحدٍّ اختياري: أوصل الحوض ⁨2⁩ إلى ⁨4⁩ قبل أن يصل الحوض ⁨1⁩ إلى ⁨5⁩.','التحدي جارٍ.','اكتمل تحدي نقطة التفتيش!','لم يكتمل التحدي، لكن يمكنك إنهاء المرحلة. تراجع أو أعد المحاولة.'],
  };
  const checkpointAdvance = (stage, status, values) => {
    if (status !== 'pending') return status;
    if (stage === 5) return values[0] > 0 ? 'missed' : values[1] === 3 ? 'complete' : 'pending';
    if (stage === 10) return values[0] + values[1] === 5 ? 'missed' : values[1] + values[2] === 4 ? 'complete' : 'pending';
    return status;
  };
  const checkpointStage = stage => stage === 5 || stage === 10;
  const checkpointMissedResult = {
    en:'Stage complete; checkpoint challenge missed.', 'zh-Hant':'關卡已完成；檢查點挑戰未達成。', 'zh-Hans':'关卡已完成；检查点挑战未达成。',
    ja:'ステージクリア。チェックポイントの挑戦は未達成です。', ko:'스테이지 완료. 체크포인트 도전은 달성하지 못했어요.',
    es:'Fase completada; reto del punto de control no logrado.', 'pt-BR':'Fase concluída; desafio do ponto de controle não concluído.',
    fr:'Niveau terminé ; défi du point de contrôle manqué.', de:'Level geschafft; Kontrollpunkt-Aufgabe verpasst.',
    it:'Livello completato; sfida del punto di controllo mancata.', ru:'Уровень пройден; задание контрольной точки не выполнено.',
    hi:'स्तर पूरा हुआ; जाँच-बिंदु की चुनौती पूरी नहीं हुई।', ar:'اكتملت المرحلة؛ لم يكتمل تحدي نقطة التفتيش.'
  };
  const checkpointWords = (locale, stage) => {
    if (!checkpointStage(stage)) return null;
    const row = checkpointCopy[locale] || checkpointCopy.en, offset = stage === 5 ? 0 : 2;
    return {name:row[offset], goal:row[offset+1], pending:row[4], complete:row[5], missed:row[6], missedResult:checkpointMissedResult[locale] || checkpointMissedResult.en};
  };
  const flowFor = (values, meadow = meadows[state.meadow]) => meadow.network.map((row) => row.reduce((sum, weight, index) => sum + weight * values[index], 0));
  const state = { locale: "en", meadow: 0, values: [0, 0, 0], tries: 0, sessionTries: 0, sessionTries12:0, screen: "main", resultOpen: false, leaveOpen: false, moves: 0, history: [], checkpointStatus:null, checkpointHistory:[], hintUsed: false, hintedValve: -1, sessionCleared: new Set(), stage60Attempt:null, hintRevision:0, saveFailed:false };
  if (extension) extension.rules.STAGES.forEach((stage) => meadows.push({
    titleKey:'gardenStage3', chapter:stage.number <= 30 ? 4 : 5,
    targets:stage.targets, stage60:stage,
  }));
  document.body.dataset.dewlineStageCount = String(meadows.length);
  window.dispatchEvent(new CustomEvent('weightplay:dewline-campaign-ready',{detail:{count:meadows.length}}));
  let frame = null, stageController = null, stageTab = null;
  const progressKey = 'weightplay-animal-dewline-garden-v2';
  let progress = {}, savedProgress = {}, canWriteProgress = true;
  try { const raw = localStorage.getItem(progressKey), saved = raw === null ? {} : JSON.parse(raw); if (!saved || typeof saved !== 'object' || Array.isArray(saved)) throw new Error('INVALID_PROGRESS'); savedProgress = saved; progress = Object.fromEntries(Object.entries(saved).filter(([key, value]) => /^(?:0|[1-9]\d*)$/.test(key) && +key < 60 && Number.isInteger(value) && value >= 1 && value <= 3)); } catch (_) { canWriteProgress = false; }
  const isUnlocked = index => {
    if (!Number.isInteger(index) || index < 0 || index >= meadows.length) return false;
    if (index < 12) return true;
    for (let previous = 11; previous < index; previous++) if (!progress[previous]) return false;
    return true;
  };
  const highestUnlocked = () => { for (let index = meadows.length - 1; index >= 0; index--) if (isUnlocked(index)) return index; return 0; };
  const extText = (key, vars = {}) => extension.text.format(state.locale,key,vars);
  const cancelHint = () => { state.hintRevision++; extension?.hintClient.cancel(); };
  const sound = (event) => window.WeightPlayAudio?.play?.(event);
  window.WeightPlayAudio?.preload?.(['ui.tick', 'board.undo', 'feedback.hint', 'feedback.error', 'result.win']);
  const $ = (id) => document.getElementById(id);
  const t = (key, vars = {}) => {
    const table = copy[state.locale] || copy.en || {};
    const ui = interfaceCopy[state.locale] || interfaceCopy.en;
    let value = (key === 'title' && window.WEIGHTPLAY_GAME_TITLES?.['animal-dewline']?.[state.locale]) || ui[key] || table[key] || copy.en?.[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const track = (name, detail = {}) => {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: `animal_dewline_${name}`, ...detail });
      document.dispatchEvent(new CustomEvent("weightplay:animal-dewline", { detail: { name, ...detail } }));
    } catch (_) {}
  };
  const readBest = () => { try { const value = Number(localStorage.getItem("weightplay-animal-dewline-best-v1")); return Number.isFinite(value) && value > 0 ? value : null; } catch (_) { return null; } };
  const readBest60 = () => { try { const value = Number(localStorage.getItem('weightplay-animal-dewline-best60-v1')); return Number.isFinite(value) && value > 0 ? value : null; } catch (_) { return null; } };
  const writeBest = (value) => { try { const old = readBest(); if (!old || value < old) localStorage.setItem("weightplay-animal-dewline-best-v1", String(value)); } catch (_) { state.saveFailed = true; } };
  const writeBest60 = (value) => { try { const key = 'weightplay-animal-dewline-best60-v1', old = Number(localStorage.getItem(key)); if (!Number.isFinite(old) || old <= 0 || value < old) localStorage.setItem(key,String(value)); } catch (_) { state.saveFailed = true; } };
  const clearedCount = () => Object.keys(progress).filter(key => +key < meadows.length).length;
  const refreshMainBest = () => { const node = $("bestValue"); if (node) node.textContent = readBest() || t("noBest"); document.querySelectorAll('[data-copy="progress"]').forEach((item) => item.textContent = `★ ${clearedCount()} / ${meadows.length}`); };

  const setupSharedScreens = () => {
    [document.querySelector('.nori-guide'), document.querySelector('.hero-copy > .kicker'), document.querySelector('.hero-copy > h1[data-wp-game-title]'), document.querySelector('.best-line'), $('mapBtn')].filter(Boolean).forEach((node) => { node.hidden = true; });
    $('startBtn')?.classList.add('wp-standard-main-start');
    $('stageList')?.setAttribute('role', 'list');

    const stageInfo = $('stageInfo'), stageContent = $('stageContent');
    const battleInfo = $('battleInfo'), battleContent = $('battleContent');
    if (stageInfo && stageContent && !stageContent.contains(stageInfo)) stageContent.prepend(stageInfo);
    if (extension && !$('dewBest60')) { const best = document.createElement('span'); best.id = 'dewBest60'; stageInfo?.querySelector('[data-wp-frame-group]')?.append(best); }
    if (battleInfo && battleContent && !battleContent.contains(battleInfo)) battleContent.prepend(battleInfo);

    const result = $('resultScreen'), battle = $('battleScreen');
    if (result && battle && result.parentElement !== battle) {
      result.removeAttribute('data-screen');
      result.classList.add('battle-result-substate');
      result.setAttribute('data-wp-frame-result-screen', '');
      result.querySelector('.result-card')?.setAttribute('data-wp-frame-result-card', '');
      battle.append(result);
    }
    $('resultHomeBtn')?.setAttribute('data-copy', 'replay');

    if (!$('dewlineLeaveModal') && battle) {
      const modal = document.createElement('section');
      modal.id = 'dewlineLeaveModal';
      modal.className = 'dewline-leave-modal';
      modal.hidden = true;
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'dewlineLeaveTitle');
      modal.innerHTML = '<div class="dewline-leave-card"><h2 id="dewlineLeaveTitle"></h2><p id="dewlineLeaveText"></p><div class="dewline-leave-actions"><button id="dewlineLeaveContinue" class="primary-btn" type="button"></button><button id="dewlineLeaveStage" class="secondary-btn" type="button"></button></div></div>';
      battle.append(modal);
      $('dewlineLeaveContinue').addEventListener('click', continueBattle);
      $('dewlineLeaveStage').addEventListener('click', confirmBattleLeave);
      modal.addEventListener('keydown', (event) => {
        if (!state.leaveOpen) return;
        if (event.key === 'Escape') { event.preventDefault(); continueBattle(); return; }
        if (event.key !== 'Tab') return;
        const nodes = [$('dewlineLeaveContinue'), $('dewlineLeaveStage')].filter((node) => node && !node.disabled && !node.hidden);
        if (!nodes.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
    }
  };

  const setResultOpen = (open) => {
    state.resultOpen = Boolean(open);
    if (state.resultOpen) closeLeaveDialog(false);
    const result = $('resultScreen'), content = $('battleScreen')?.querySelector('.battle-content'), header = $('battleScreen')?.querySelector('.battle-header');
    if (result) result.hidden = !state.resultOpen;
    if (content) content.inert = state.resultOpen || state.leaveOpen;
    if (header) header.inert = state.resultOpen || state.leaveOpen;
    if (state.resultOpen) requestAnimationFrame(() => $('resultMapBtn')?.focus({ preventScroll: true }));
  };

  const show = (screen) => {
    if (screen !== 'battle') { cancelHint(); setResultOpen(false); closeLeaveDialog(false); }
    state.screen = screen;
    ["main", "stage", "battle"].forEach((name) => { $(`${name}Screen`).hidden = name !== screen; });
    document.body.dataset.screen = screen;
    window.dispatchEvent(new CustomEvent('weightplay:shell-sync'));
    frame?.activate(screen);
    if (screen === "stage") {
      state.meadow = highestUnlocked();
      renderStages();
      stageController?.refresh(state.meadow);
    }
    if (screen === "main") {
      refreshMainBest();
      requestAnimationFrame(() => { if (state.screen === "main") refreshMainBest(); });
    }

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[screen] ?? null;
      if ((__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
  };

  const applyLocale = () => {
    const hasSharedLocaleOwner = typeof window.WonderI18n?.setLocale === "function";
    window.WonderI18n?.setLocale?.(state.locale, { navigate: false });
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    if (!hasSharedLocaleOwner) {
      const legacyLocale = state.locale === "zh-Hans" ? "zh-Hant" : state.locale;
      window.dispatchEvent(new CustomEvent("wonder:locale-change", {
        detail: { locale: state.locale, legacyLocale },
      }));
    }
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.copyAria)); });
    const gameplayTags = copy[state.locale]?.gameplayTags;
    if (Array.isArray(gameplayTags)) {
      document.querySelectorAll("[data-wp-gameplay-tags]").forEach((list) => {
        list.replaceChildren(...gameplayTags.map((tag) => {
          const node = document.createElement("span");
          node.textContent = tag;
          return node;
        }));
      });
    }
    $("localeSelect").value = state.locale;
    $("localeSelect").setAttribute("aria-label", t("language"));
    $("bestValue").textContent = readBest() || t("noBest");
    if ($('stageBackBtn')) $('stageBackBtn').setAttribute('aria-label', t('back'));
    if ($('battleBackBtn')) $('battleBackBtn').setAttribute('aria-label', t('returnStage'));
    if ($('dewlineLeaveTitle')) $('dewlineLeaveTitle').textContent = t('leaveTitle');
    if ($('dewlineLeaveText')) $('dewlineLeaveText').textContent = t('leaveText');
    if ($('dewlineLeaveContinue')) $('dewlineLeaveContinue').textContent = t('continue');
    if ($('dewlineLeaveStage')) $('dewlineLeaveStage').textContent = t('returnStage');
    if (stageTab) { stageTab.textContent = t('stages'); stageTab.setAttribute('aria-label', t('stages')); }
    if (state.screen === "stage") { renderStages(); stageController?.refresh(state.meadow); }
    if (state.screen === "battle" && !state.resultOpen) renderBattle();
    if (state.resultOpen) renderResult();
    refreshMainBest();
  };

  const renderStages = () => {
    const count = clearedCount();
    const node = $('stageProgress');
    if (node) node.textContent = '★ ' + count + ' / ' + meadows.length;
    const best = $('dewBest60'); if (best) best.textContent = `60 · ${t('best')}: ${readBest60() || t('noBest')}`;
  };

  const actionDescription = action => {
    if (action.type === 'valve') return t(action.delta > 0 ? 'increase' : 'decrease',{n:'ABC'[action.index]});
    if (action.type === 'clip') return action.value === null ? extText('removeClip') : extText('clipPipe',{pipe:action.value});
    if (action.type === 'route') return extText('divertTo',{bed:action.value});
    if (action.type === 'transfer') return extText('transferAction',{from:'ABC'[action.from],to:'ABC'[action.to]});
    if (action.type === 'capture') return extText('capture',{bed:action.bed});
    return '';
  };
  const updateStage60 = (action) => {
    const stage = meadows[state.meadow]?.stage60;
    if (!stage || state.screen !== 'battle' || state.resultOpen || state.leaveOpen) return;
    const previous = state.stage60Attempt.state;
    const changed = extension.rules.performAttempt(stage,state.stage60Attempt,action);
    if (!changed) {
      if (action.type === 'route' && action.value === previous.route) { $('battleStatus').textContent = extText('diverterAt',{bed:previous.route}); return; }
      if (action.type === 'valve' && (stage.lockedValve === action.index || (previous.lockedAfterCapture && stage.lockAfterCapture === action.index))) { $('battleStatus').textContent = extText('valveLocked',{valve:'ABC'[action.index]}); return; }
      const key = action.type === 'route' ? 'diverterSensorLocked' : action.type === 'transfer' ? 'transferBlocked' : action.type === 'capture' ? 'captureUnavailable' : action.type === 'clip' ? 'invalidPipe' : null;
      $('battleStatus').textContent = key ? extText(key) : t('gardenTip');
      sound('feedback.error'); return;
    }
    cancelHint(); state.stage60Attempt = changed; state.values = [...changed.state.values]; state.moves = changed.moves;
    state.hintedValve = -1; renderBattle();
    if (action.type === 'capture') $('battleStatus').textContent = extText('captureValue',{bed:action.bed,value:changed.state.captures[action.bed-1]});
    else if (changed.state.sensor > previous.sensor) $('battleStatus').textContent = extText('sensorLatched',{number:changed.state.sensor});
    else $('battleStatus').textContent = extension.rules.isGoal(stage,changed.state) ? t('gardenAllReady') : t('gardenTip');
    sound(action.type === 'undo' ? 'board.undo' : 'ui.tick');
  };
  const renderStage60 = meadow => {
    const stage = meadow.stage60, attempt = state.stage60Attempt, puzzle = attempt.state;
    const flows = extension.rules.flow(stage,puzzle), effective = flows.map((value,i) => puzzle.captures[i] ?? value);
    const ready = effective.filter((value,index) => value === stage.targets[index]).length;
    const won = extension.rules.isGoal(stage,puzzle);
    const possible = extension.rules.actions(stage,puzzle);
    const available = action => possible.some(candidate => Object.keys(action).every(key => candidate[key] === action[key]));
    $('dewStage60Tools').hidden = false;
    $('battleHeading').textContent = extension.guide.locales[state.locale].stageNames[String(stage.number)];
    $('roundLabel').textContent = `${state.meadow + 1} / ${meadows.length}`;
    $('gardenRound').textContent = `${String(state.meadow + 1).padStart(2,'0')} / ${meadows.length}`;
    $('battleHint').textContent = t('gardenLink');
    $('targetValues').textContent = t('gardenProgress',{n:ready});
    $('sessionTries').textContent = String(state.sessionTries);
    $('gardenMoves').textContent = `${t('gardenMoves')} ${attempt.moves}`;
    $('checkBtn').textContent = won ? t('gardenCheck') : t('gardenInspect');
    $('checkBtn').classList.toggle('is-ready',won);
    $('undoBtn').textContent = extText('undoMove'); $('undoBtn').disabled = false;
    $('undoBtn').setAttribute('aria-disabled',String(!attempt.history.length));
    $('hintBtn').textContent = t('gardenHint'); $('resetBtn').textContent = t('reset');
    const rules = [];
    if (stage.allowedClips.length) rules.push(extText('clipEffect'),extText('toolMoveCost'));
    if (stage.captureSlots) rules.push(extText('captureEffect'));
    if (stage.sensors.length) rules.push(extText('sensorOnePerMove'));
    $('dew60Rules').textContent = rules.join(' ');
    const details = [];
    if (stage.minB) details.push(extText('goalCondition',{valve:'B',value:stage.minB}));
    if (stage.lockedValve !== null) details.push(extText('valveLocked',{valve:'ABC'[stage.lockedValve]}));
    if (stage.sensors.length) {
      details.push(extText('sensorProgress',{done:puzzle.sensor,total:stage.sensors.length}));
      stage.sensors.forEach(sensor => details.push(extText('sensorGoal',{bed:sensor.bed,value:sensor.value})));
    }
    if (stage.captureSlots) {
      details.push(extText('slots',{used:puzzle.capturedOrder.length,total:stage.captureSlots}));
      if (stage.captureOrder) details.push(puzzle.capturedOrder.length < stage.captureSlots ? extText('captureOrder',{bed:stage.captureOrder[puzzle.capturedOrder.length]}) : extText('captureSlotFull'));
      if (stage.captureRequirement) stage.captureBeds.forEach(bed => details.push(extText('captureCondition',{bed,requiredBed:stage.captureRequirement.bed,value:stage.captureRequirement.value})));
      if (stage.moveClipAfterCapture) details.push(extText('moveClipAfterCapture',{bed:stage.captureRequirement.bed}));
      if (stage.lockAfterCapture !== null) details.push(extText('valveLocksAfterCapture',{valve:'ABC'[stage.lockAfterCapture]}));
    }
    $('dew60Detail').textContent = details.join(' ');
    effective.forEach((value,index) => {
      const plant = $(`flower${index}`), target = stage.targets[index], difference = target - value;
      plant.dataset.condition = difference === 0 ? 'ready' : difference > 0 ? 'dry' : 'overflow';
      plant.querySelector('.flower-title').textContent = `${t('gardenBed')} ${index+1}`;
      plant.querySelector('.flower-value').textContent = `${value} / ${target}`;
      plant.querySelector('.flower-state').textContent = puzzle.captures[index] === null ? (difference === 0 ? t('gardenReady') : t(difference > 0 ? 'gardenLess' : 'gardenMore',{n:Math.abs(difference)})) : extText('captureValue',{bed:index+1,value});
      const pairs = stage.network === 'I' ? [[0],[1],[2]] : stage.network === 'P' ? [[0],[0,1],[2]] : stage.network === 'R' ? [[0,1],[1,2],[0,2]] : puzzle.route === 2 ? [[0],[0,1],[2]] : [[0],[1],[0,2]];
      plant.querySelector('.flower-formula').textContent = pairs[index].filter(valve => puzzle.clip !== `${index+1}${'ABC'[valve]}`).map(valve => 'ABC'[valve]).join(' + ') || '0';
      plant.querySelector('.flower-fill').style.width = `${Math.min(100,target ? value / target * 100 : value ? 100 : 0)}%`;
    });
    puzzle.values.forEach((value,index) => {
      const card = $(`valve${index}`);
      card.querySelector('.garden-valve-label').textContent = `${t('valve',{n:''}).trim()} ${'ABC'[index]}`;
      card.querySelector('output').textContent = value;
      card.querySelector('output').setAttribute('aria-label',`${'ABC'[index]}: ${value}`);
      card.querySelectorAll('[data-delta]').forEach(button => {
        const delta = +button.dataset.delta, action = {type:'valve',index,delta};
        button.disabled = false; button.setAttribute('aria-disabled',String(!available(action)));
        button.setAttribute('aria-label',t(delta > 0 ? 'increase' : 'decrease',{n:'ABC'[index]}));
      });
      card.dataset.hint = String(state.hintedValve === index);
    });
    const rows = stage.network === 'I' ? [[0],[1],[2]] : stage.network === 'P' ? [[0],[0,1],[2]] : stage.network === 'R' ? [[0,1],[1,2],[0,2]] : puzzle.route === 2 ? [[0],[0,1],[2]] : [[0],[1],[0,2]];
    $('gardenPipes').innerHTML = rows.flatMap((row,bed) => row.map(valve => {
      const clipped = puzzle.clip === `${bed+1}${'ABC'[valve]}`;
      return `<path class="pipe-shadow" d="M${50+valve*100} 100 C${50+valve*100} 52 ${50+bed*100} 48 ${50+bed*100} 0"/><path class="pipe-water ${!clipped && puzzle.values[valve] ? 'flowing' : ''} ${clipped ? 'is-clipped' : ''}" data-valve="${valve}" data-bed="${bed}" d="M${50+valve*100} 100 C${50+valve*100} 52 ${50+bed*100} 48 ${50+bed*100} 0"/>`;
    })).join('');
    document.querySelectorAll('#dewStage60Tools [data-dew-tool]').forEach(group => {
      const type = group.dataset.dewTool, enabled = type === 'clip' ? stage.allowedClips.length : type === 'route' ? stage.network === 'T' : type === 'transfer' ? Boolean(stage.transferPair) : stage.captureSlots;
      group.hidden = !enabled;
      group.querySelector('.dew60-label').textContent = extText(type === 'route' ? 'diverter' : type === 'capture' ? 'bottle' : type);
      group.querySelectorAll('button').forEach(button => {
        const action = button.dewAction;
        button.hidden = type === 'clip' && action.value !== null ? !stage.allowedClips.includes(action.value) : type === 'transfer' ? !stage.transferPair?.includes(action.from) || !stage.transferPair?.includes(action.to) : type === 'capture' ? !stage.captureBeds.includes(action.bed) : false;
        button.textContent = actionDescription(action);
        button.setAttribute('aria-disabled',String(!available(action)));
        if (type === 'clip' && action.value !== null) button.setAttribute('aria-pressed',String(action.value === puzzle.clip));
        if (type === 'route') button.setAttribute('aria-pressed',String(action.value === puzzle.route));
      });
    });
  };

  const renderBattle = () => {
    const meadow = meadows[state.meadow];
    $('dewCheckpoint').hidden = true;
    if (meadow.stage60) { renderStage60(meadow); return; }
    $('dewStage60Tools').hidden = true;
    $('undoBtn').removeAttribute('aria-disabled');
    const flows = flowFor(state.values), ready = flows.filter((value, index) => value === meadow.targets[index]).length;
    const checkpoint = checkpointWords(state.locale,state.meadow + 1);
    if (checkpoint) {
      $('dewCheckpoint').hidden = false;
      $('dewCheckpointName').textContent = checkpoint.name;
      $('dewCheckpointGoal').textContent = checkpoint.goal;
      $('dewCheckpointStatus').textContent = checkpoint[state.checkpointStatus] || checkpoint.pending;
    }
    $("battleHeading").textContent = checkpoint?.name || t(meadow.titleKey);
    $("roundLabel").textContent = `${state.meadow + 1} / ${meadows.length}`;
    $("gardenRound").textContent = `${String(state.meadow + 1).padStart(2, '0')} / ${meadows.length} · ${checkpoint?.name || t(meadow.titleKey)}`;
    $("battleHint").textContent = t(meadow.chapter ? 'gardenLink' : 'gardenGoal');
    $("targetValues").textContent = t('gardenProgress', { n: ready });
    $("sessionTries").textContent = String(state.sessionTries);
    $('gardenMoves').textContent = `${t('gardenMoves')} ${state.moves}`;
    $('checkBtn').textContent = ready === 3 ? t('gardenCheck') : t('gardenInspect');
    $('checkBtn').classList.toggle('is-ready', ready === 3);
    $('undoBtn').textContent = t('gardenUndo'); $('undoBtn').disabled = !state.history.length;
    $('hintBtn').textContent = t('gardenHint'); $('resetBtn').textContent = t('reset');
    flows.forEach((value, index) => {
      const plant = $(`flower${index}`), target = meadow.targets[index], difference = target - value;
      plant.dataset.condition = difference === 0 ? 'ready' : difference > 0 ? 'dry' : 'overflow';
      plant.querySelector('.flower-title').textContent = `${t('gardenBed')} ${index+1}`;
      plant.querySelector('.flower-value').textContent = `${value} / ${target}`;
      plant.querySelector('.flower-state').textContent = difference === 0 ? t('gardenReady') : t(difference > 0 ? 'gardenLess' : 'gardenMore', { n: Math.abs(difference) });
      plant.querySelector('.flower-formula').textContent = meadow.network[index].flatMap((weight, valve) => weight ? ['ABC'[valve]] : []).join(' + ');
      plant.querySelector('.flower-fill').style.width = `${Math.min(100, target ? value / target * 100 : value ? 100 : 0)}%`;
    });
    state.values.forEach((value, index) => {
      const card = $(`valve${index}`);
      card.querySelector('.garden-valve-label').textContent = `${t('valve', { n: '' }).trim()} ${'ABC'[index]}`;
      card.querySelector('output').textContent = value;
      card.querySelector('output').setAttribute('aria-label', `${'ABC'[index]}: ${value}`);
      card.querySelector('[data-delta="-1"]').disabled = value === 0;
      card.querySelector('[data-delta="1"]').disabled = value === 6;
      card.querySelectorAll('button').forEach((button) => { button.removeAttribute('aria-disabled'); button.setAttribute('aria-label', `${t(+button.dataset.delta > 0 ? 'increase' : 'decrease', { n: 'ABC'[index] })}`); });
      card.dataset.hint = String(state.hintedValve === index);
    });
    $('gardenPipes').innerHTML = meadow.network.flatMap((row, flower) => row.flatMap((weight, valve) => weight ? [`<path class="pipe-shadow" d="M${50+valve*100} 100 C${50+valve*100} 52 ${50+flower*100} 48 ${50+flower*100} 0"/><path class="pipe-water ${state.values[valve] ? 'flowing' : ''}" data-valve="${valve}" d="M${50+valve*100} 100 C${50+valve*100} 52 ${50+flower*100} 48 ${50+flower*100} 0"/>`] : [])).join('');
    if (state.hintedValve < 0) $('battleStatus').textContent = ready === 3 ? t('gardenAllReady') : t('gardenTip');
  };

  const renderResult = () => {
    const complete = state.meadow >= meadows.length - 1;
    $("resultHeading").textContent = complete ? t("finishTitle") : t("correct");
    const failureCopy = copy[state.locale]?.storageFailure ? t('storageFailure') : globalThis.AnimalDewlineStage60Copy?.locales?.[state.locale]?.storageFailed || '⚠';
    const checkpoint = checkpointWords(state.locale,state.meadow + 1);
    const checkpointResult = checkpoint ? ` ${state.checkpointStatus === 'complete' ? checkpoint.complete : checkpoint.missedResult}` : '';
    $("resultText").textContent = `${'★'.repeat(state.earnedStars || 1)}${'☆'.repeat(3-(state.earnedStars || 1))} · ${t('gardenMoves')} ${state.moves}. ${state.saveFailed ? failureCopy : t('gardenSave')}${checkpointResult}`;
    $("resultMapBtn").hidden = false; $("resultMapBtn").textContent = t('stages'); $("resultMapBtn").onclick = () => { show('stage'); renderStages(); };
    $("resultPrimaryBtn").hidden = false; $("resultPrimaryBtn").textContent = t("next"); $("resultPrimaryBtn").disabled = complete; $("resultPrimaryBtn").onclick = complete ? () => {} : () => startMeadow(state.meadow + 1);
    $("resultHomeBtn").hidden = false; $("resultHomeBtn").textContent = t('replay'); $("resultHomeBtn").onclick = () => startMeadow(state.meadow);
    __wpNotifyMeasurement();
  };

  const startSession = () => { state.sessionTries = 0; state.sessionTries12 = 0; state.sessionCleared.clear(); state.meadow = meadows.findIndex((_, index) => isUnlocked(index) && !progress[index]); if (state.meadow < 0) state.meadow = 0; show("stage"); renderStages(); track("session_start"); };
  const startMeadow = (index) => {
    if (!Number.isInteger(index) || !isUnlocked(index)) return;
    cancelHint();
    closeLeaveDialog(false); setResultOpen(false);
    state.meadow = index; state.values = [0, 0, 0]; state.tries = 0; state.moves = 0; state.history = []; state.checkpointStatus = checkpointStage(index + 1) ? 'pending' : null; state.checkpointHistory = []; state.hintUsed = false; state.hintedValve = -1; state.saveFailed = false;
    state.stage60Attempt = meadows[index].stage60 ? extension.rules.initialAttempt(meadows[index].stage60) : null;
    $("battleStatus").textContent = ""; show("battle"); renderBattle(); track("meadow_start", { meadow: state.meadow + 1 });
    __wpMeasurement.roundKey = {}; __wpMeasurement.stageId = index >= 12 ? index + 1 : null; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
  };
  const changeValve = (index, delta) => {
    if (state.screen !== 'battle' || state.resultOpen || state.leaveOpen || !Number.isInteger(index) || index < 0 || index > 2 || ![-1,1].includes(delta)) return;
    if (state.stage60Attempt) { updateStage60({type:'valve',index,delta}); return; }
    const next = Math.max(0, Math.min(6, state.values[index] + delta)); if (next === state.values[index]) return;
    state.history.push([...state.values]); if (state.checkpointStatus !== null) state.checkpointHistory.push(state.checkpointStatus); if (state.history.length > 200) { state.history.shift(); if (state.checkpointStatus !== null) state.checkpointHistory.shift(); }
    state.values[index] = next; if (state.checkpointStatus !== null) state.checkpointStatus = checkpointAdvance(state.meadow + 1,state.checkpointStatus,state.values); state.moves++; state.hintedValve = -1; renderBattle(); sound('ui.tick');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) $(`valve${index}`).animate?.([{filter:'brightness(1.3)'},{filter:'brightness(1)'}], {duration:180});
    track("valve_adjust", { meadow: state.meadow + 1, valve: index + 1, value: state.values[index] });
  };
  const undoValve = () => { if (state.stage60Attempt) { updateStage60({type:'undo'}); return; } if (state.resultOpen || state.leaveOpen || !state.history.length) return; state.values = state.history.pop(); if (state.checkpointStatus !== null) state.checkpointStatus = state.checkpointHistory.pop(); state.moves++; state.hintedValve = -1; renderBattle(); sound('board.undo'); };
  const hintValve = async () => {
    if (state.resultOpen || state.leaveOpen) return;
    if (state.stage60Attempt) {
      const meadowIndex = state.meadow, puzzle = state.stage60Attempt.state, revision = ++state.hintRevision;
      $('battleStatus').textContent = extText('hintPending');
      let result;
      try { result = await extension.hintClient.request(meadowIndex + 1,puzzle); }
      catch (_) { result = {status:'error'}; }
      if (revision !== state.hintRevision || state.meadow !== meadowIndex || state.screen !== 'battle' ||
          state.resultOpen || state.leaveOpen || state.stage60Attempt?.state !== puzzle) return;
      if (result.status === 'cancelled') { $('battleStatus').textContent = t('gardenTip'); return; }
      if (result.status === 'error') { $('battleStatus').textContent = extText('hintError'); return; }
      if (result.status === 'unreachable') { $('battleStatus').textContent = extText('noPath'); return; }
      if (result.status === 'ready') { $('battleStatus').textContent = t('gardenAllReady'); return; }
      if (result.status !== 'step' || !extension.rules.applyAction(meadows[meadowIndex].stage60,puzzle,result.action)) { $('battleStatus').textContent = extText('hintError'); return; }
      state.hintUsed = true; state.hintedValve = result.action.type === 'valve' ? result.action.index : -1;
      renderBattle(); $('battleStatus').textContent = extText('hintAction',{action:actionDescription(result.action)}); sound('feedback.hint'); return;
    }
    const meadow = meadows[state.meadow]; let nearest = null, distance = Infinity;
    for (let a=0;a<=6;a++) for (let b=0;b<=6;b++) for (let c=0;c<=6;c++) {
      const values = [a,b,c]; if (!flowFor(values).every((value,index) => value === meadow.targets[index])) continue;
      const cost = values.reduce((sum,value,index) => sum+Math.abs(value-state.values[index]),0);
      if (cost < distance) { distance = cost; nearest = values; }
    }
    if (!nearest || distance === 0) { $('battleStatus').textContent = t('gardenAllReady'); return; }
    state.hintUsed = true; state.hintedValve = nearest.findIndex((value,index) => value !== state.values[index]);
    renderBattle(); $('battleStatus').textContent = t('gardenHintMove', { valve:'ABC'[state.hintedValve], sign:nearest[state.hintedValve] > state.values[state.hintedValve] ? '+' : '−' }); sound('feedback.hint');
  };
  const resetValves = () => { if (state.resultOpen || state.leaveOpen) return; cancelHint(); state.values = [0, 0, 0]; state.moves = 0; state.history = []; state.checkpointStatus = checkpointStage(state.meadow + 1) ? 'pending' : null; state.checkpointHistory = []; state.hintUsed = false; state.hintedValve = -1; if (state.stage60Attempt) state.stage60Attempt = extension.rules.initialAttempt(meadows[state.meadow].stage60); renderBattle(); if (state.stage60Attempt) $('battleStatus').textContent = t('gardenTip'); track("reset", { meadow: state.meadow + 1 });
    if (state.screen === "battle") { __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement(); }
  };
  const checkFlow = () => {
    if (state.resultOpen || state.leaveOpen) return;
    const meadow = meadows[state.meadow]; state.tries += 1; state.sessionTries += 1; if (state.meadow < 12) state.sessionTries12++;
    const firstMismatch = meadow.stage60 ? (extension.rules.isGoal(meadow.stage60,state.stage60Attempt.state) ? -1 : 0) : meadow.targets.findIndex((target, index) => target !== flowFor(state.values)[index]);
    track("check", { meadow: state.meadow + 1, tries: state.sessionTries, correct: firstMismatch < 0 });
    if (firstMismatch >= 0) { state.hintedValve = -1; renderBattle(); $('battleStatus').textContent = meadow.stage60 ? extText('bloomNotReady') : t('gardenInspectBed', { n: firstMismatch + 1 }); sound('feedback.error'); return; }
    cancelHint();
    $("battleStatus").textContent = t("correct");
    const minimum = meadow.stage60 ? extensionMinimums[state.meadow - 12] : solutions[state.meadow].reduce((sum,value) => sum+value,0);
    state.earnedStars = state.moves <= minimum && !state.hintUsed ? 3 : state.moves <= minimum+6 ? 2 : 1;
    progress[state.meadow] = Math.max(progress[state.meadow] || 0, state.earnedStars);
    try { if (!canWriteProgress) throw new Error('PROGRESS_NOT_WRITABLE'); const merged = {...savedProgress,...progress}; localStorage.setItem(progressKey, JSON.stringify(merged)); savedProgress = merged; } catch (_) { state.saveFailed = true; }
    state.sessionCleared.add(state.meadow);
    if ([...Array(12).keys()].every(index => state.sessionCleared.has(index))) writeBest(state.sessionTries12);
    if (meadows.length === 60 && state.sessionCleared.size === 60) { writeBest60(state.sessionTries); track("session_complete", { tries: state.sessionTries }); }
    sound('result.win');
    __wpMeasurement.ended = true; __wpMeasurement.outcome = 'complete'; setResultOpen(true); renderResult(); __wpNotifyMeasurement();
  };

  const battleHasProgress = () => state.tries > 0 || state.values.some((value) => value !== 0) || Boolean(state.stage60Attempt?.moves);
  function requestBattleLeave() {
    if (state.screen !== 'battle' || state.resultOpen || state.leaveOpen) return;
    cancelHint();
    if (state.stage60Attempt) $('battleStatus').textContent = t('gardenTip');
    if (!battleHasProgress()) { show('stage'); renderStages(); return; }
    state.leaveOpen = true;
    const modal = $('dewlineLeaveModal'), content = $('battleScreen')?.querySelector('.battle-content'), header = $('battleScreen')?.querySelector('[data-wp-frame-header="battle"]');
    if (content) content.inert = true; if (header) header.inert = true;
    if (modal) modal.hidden = false;
    __wpNotifyMeasurement(); requestAnimationFrame(() => $('dewlineLeaveContinue')?.focus({ preventScroll: true }));
  }
  function closeLeaveDialog(restoreFocus = true) {
    const modal = $('dewlineLeaveModal'), content = $('battleScreen')?.querySelector('.battle-content'), header = $('battleScreen')?.querySelector('[data-wp-frame-header="battle"]');
    state.leaveOpen = false; if (modal) modal.hidden = true;
    if (content) content.inert = state.resultOpen; if (header) header.inert = state.resultOpen;
    __wpNotifyMeasurement(); if (restoreFocus && state.screen === 'battle' && !state.resultOpen) $('battleBackBtn')?.focus({ preventScroll: true });
  }
  function continueBattle() { closeLeaveDialog(true); }
  function confirmBattleLeave() { closeLeaveDialog(false); state.values = [0, 0, 0]; state.tries = 0; show('stage'); renderStages(); }

  // One stable play surface: value updates never replace focused controls.
  const garden = $('battleScreen').querySelector('.battle-content');
  garden.classList.add('dewline-garden');
  garden.innerHTML = `<div class="garden-mission"><span id="gardenRound"></span><strong id="targetValues"></strong><p id="battleHint"></p><section id="dewCheckpoint" hidden><strong id="dewCheckpointName"></strong><p id="dewCheckpointGoal"></p><p id="dewCheckpointStatus" role="status" aria-live="polite"></p></section></div>
    <div id="flowerGrid" class="garden-flowers">${[0,1,2].map((index) => `<article id="flower${index}" class="garden-flower"><strong class="flower-title"></strong><span class="flower-art" aria-hidden="true"></span><span class="flower-formula"></span><strong class="flower-value"></strong><div class="flower-meter" aria-hidden="true"><i class="flower-fill"></i></div><span class="flower-state"></span></article>`).join('')}</div>
    <svg id="gardenPipes" class="garden-pipes" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true"></svg>
    <div id="valveGrid" class="garden-valves">${[0,1,2].map((index) => `<article id="valve${index}" class="garden-valve"><strong class="garden-valve-label"></strong><div class="garden-dial" aria-hidden="true">${'ABC'[index]}</div><output>0</output><div class="garden-controls"><button type="button" data-index="${index}" data-delta="-1">−</button><button type="button" data-index="${index}" data-delta="1">+</button></div></article>`).join('')}</div>
    <section id="dewStage60Tools" class="dew60-tools" hidden><p id="dew60Rules" class="dew60-rules"></p><p id="dew60Detail"></p>${['clip','route','transfer','capture'].map(type => `<div class="dew60-group" data-dew-tool="${type}"><strong class="dew60-label"></strong><div class="dew60-buttons"></div></div>`).join('')}</section>
    <div class="garden-feedback"><span id="gardenMoves"></span><p id="battleStatus" role="status" aria-live="polite" aria-atomic="true"></p></div>
    <div class="garden-tools"><button id="undoBtn" type="button"></button><button id="hintBtn" type="button"></button><button id="resetBtn" type="button"></button></div>
    <button id="checkBtn" class="primary-btn garden-check" type="button"></button>`;
  const stage60Controls = {
    clip:[null,'1A','1B','2A','2B','2C','3A','3C'].map(value => ({type:'clip',value})),
    route:[2,3].map(value => ({type:'route',value})),
    transfer:[0,1,2].flatMap(from => [0,1,2].filter(to => from !== to).map(to => ({type:'transfer',from,to}))),
    capture:[1,2,3].map(bed => ({type:'capture',bed})),
  };
  Object.entries(stage60Controls).forEach(([type,items]) => {
    const parent = $(`dewStage60Tools`).querySelector(`[data-dew-tool="${type}"] .dew60-buttons`);
    items.forEach(action => { const button = document.createElement('button'); button.type = 'button'; button.dataset.dewAction = type; if ('value' in action) button.dataset.dewValue = String(action.value ?? ''); if ('bed' in action) button.dataset.dewBed = String(action.bed); if ('from' in action) button.dataset.dewFrom = String(action.from); if ('to' in action) button.dataset.dewTo = String(action.to); button.dewAction = action; button.addEventListener('click',() => updateStage60(action)); parent.append(button); });
  });
  garden.querySelectorAll('[data-delta]').forEach((button) => button.addEventListener('click', () => changeValve(+button.dataset.index, +button.dataset.delta)));
  $('undoBtn').addEventListener('click', undoValve); $('hintBtn').addEventListener('click', hintValve);
  $("startBtn").addEventListener("click", startSession);
  $("mapBtn").addEventListener("click", () => { show("stage"); renderStages(); track("meadow_map"); });
  $("stageBackBtn").addEventListener("click", () => show("main"));
  $("battleBackBtn").addEventListener("click", requestBattleLeave);
  $("checkBtn").addEventListener("click", checkFlow); $("resetBtn").addEventListener("click", function (...args) { return __wpReplayStart(() => resetValves.apply(this, args)); });
  window.addEventListener("weightplay:shell-sync", () => { if (state.screen === "main") refreshMainBest(); });
  $("localeSelect").addEventListener("change", (event) => { state.locale = copy[event.target.value] ? event.target.value : "en"; try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {} applyLocale(); track("locale", { locale: state.locale }); });
  try { const saved = localStorage.getItem("weightplayLocale"); if (saved && copy[saved]) state.locale = saved; } catch (_) {}
  const routeSegment = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  const routeLocale = {'zh-tw':'zh-Hant','zh-cn':'zh-Hans','pt-br':'pt-BR'}[routeSegment] || routeSegment;
  if (copy[routeLocale]) state.locale = routeLocale;
  setupSharedScreens();
  frame = window.WeightPlayScreenFrame?.mount({root:$('gameFrame'),localeSelect:$('localeSelect'),playUI:true,scenes:{
    main:{root:$('mainScreen'),header:$('mainScreen').querySelector('header'),content:$('mainScreen').querySelector('.hero-grid')},
    stage:{root:$('stageScreen'),header:$('stageScreen').querySelector('header'),content:$('stageContent'),headerInfo:$('stageInfo')},
    battle:{root:$('battleScreen'),header:$('battleScreen').querySelector('header'),content:$('battleContent'),headerInfo:$('battleInfo')},
  }});
  if (!frame) throw new Error('DEWLINE_SHARED_FRAME_REQUIRED');
  stageTab=document.createElement('button');
  stageTab.type='button';
  stageTab.dataset.wpFrameAction='tab';
  stageTab.dataset.wpFrameStageSlot='stages';
  stageTab.setAttribute('role','tab');
  stageTab.setAttribute('aria-selected','true');
  stageTab.setAttribute('aria-current','page');
  stageTab.setAttribute('aria-controls','stageContent');
  stageTab.textContent=t('stages');
  stageTab.addEventListener('click',()=>{renderStages();stageController?.refresh(state.meadow);});
  frame.commonDownButton.add(stageTab);
  const stagePoster='/games/animal-dewline/assets/animal-dewline-cover.png';
  const stageConfig=Object.freeze({
    gameId:'animal-dewline',count:meadows.length,poster:stagePoster,background:'/assets/lobby-block-atmosphere.svg',
    stage(index){
      const meadow=meadows[index];
      if(!meadow)throw new RangeError('DEWLINE_STAGE_INDEX:' + index);
      const stars=progress[index]||0;
      const checkpoint=checkpointWords(state.locale,index + 1);
      const objective=checkpoint?.goal || t(meadow.chapter?'gardenLink':'gardenGoal');
      return {
        id:index+1,kicker:t('round',{n:index+1,total:meadows.length}),title:meadow.stage60?extension.guide.locales[state.locale].stageNames[String(meadow.stage60.number)]:(checkpoint?.name || t(meadow.titleKey)),
        subtitle:objective,status:!isUnlocked(index) ? extText('stageLocked',{stage:index}) : stars?'★'.repeat(stars)+'☆'.repeat(3-stars):t('gardenGoal'),
        summary:t('gardenGoal'),details:[objective],locked:!isUnlocked(index),cleared:Boolean(stars),poster:stagePoster,
      };
    },
  });
  stageController=window.WeightPlayPlayUI?.mountStage({
    page:$('stageContent'),rail:$('stageList'),config:stageConfig,selected:state.meadow,
    onSelect(index){state.meadow=index;renderStages();},
    onStart(index){if (isUnlocked(index)) startMeadow(index);},
    isActive:()=>state.screen==='stage',
  });
  if(!stageController)throw new Error('DEWLINE_SHARED_STAGE_REQUIRED');
  frame.activate('main');
  window.setTimeout(() => { $("loadingPanel").hidden = true; show("main"); applyLocale(); track("main_ready"); }, 260);
  window.__ANIMAL_DEWLINE_TEST__ = { meadows, flowFor, startSession, startMeadow, changeValve, checkFlow, getState: () => ({ ...state, values: [...state.values], stage60Attempt: state.stage60Attempt ? JSON.parse(JSON.stringify(state.stage60Attempt)) : null }) };
})();
