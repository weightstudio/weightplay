(() => {
  "use strict";
  const practiceRequested=location.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('practice')==='1';
  let practiceActive=false,practiceAdapter=null,practicePending=false;
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(run?.paused || run?.suspended || leaveOpen), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { if(practiceRequested)return;try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const $ = id => document.getElementById(id);
  const CODES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const LOCALE_ROUTES = { en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const ROUTE_LOCALES = Object.fromEntries(Object.entries(LOCALE_ROUTES).map(([code, route]) => [route, code]));
  const GAME_VERSION = "v29";
  const INTERFACE_VERSION = "9";
  const BASE = window.BAMBOO_LOCALES.en;
  // The aqueduct needs its save, reward, art and accessibility gates before
  // it can become visible in the normal campaign.
  const AQUEDUCT_READY = false;
  const AQUEDUCT = window.BambooAqueductCandidate;
  const LEVELS = window.BAMBOO_LEVELS.levels.slice();
  function installAqueduct() {
    if (!AQUEDUCT || AQUEDUCT.CHAPTER2.length !== 30) throw Error('BAMBOO_AQUEDUCT_REQUIRED');
    if(LEVELS.length===30)AQUEDUCT.CHAPTER2.forEach(cfg => LEVELS.push({aqueductId:cfg.id,checkpoint:cfg.checkpoint,sluices:Array(cfg.sluices),beacons:[]}));
  }
  if (AQUEDUCT_READY) installAqueduct();
  const routeSegment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = ROUTE_LOCALES[routeSegment];
  let locale = routeLocale || localRead("weightPlayLocale") || localRead("wp-locale") || "en", selected = 0, run = null, resultActionClaimed = false, leaveOpen = false, completionTimer = 0, boardFocusIndex = 0, hintedPipeIndex = -1;
  if (!CODES.includes(locale)) locale = "en";
  if (routeLocale && !practiceRequested) {
    try {
      localStorage.setItem("weightPlayLocale", locale);
      localStorage.setItem("wp-locale", locale);
    } catch {}
  }
  let save = { unlocked: 1, done: {}, best: {} };
  if(!practiceRequested)try { save = { ...save, ...JSON.parse(localStorage.getItem("wp:bamboo") || "{}") }; } catch {}
  if (!save.best || typeof save.best !== "object" || Array.isArray(save.best)) save.best = {};
  selected = Math.max(0, Math.min(29, Number(save.unlocked || 1) - 1));
  // Mark the authored game summary before the shared shell normalizes Main.
  // Without this semantic hook, the normalizer falls back to the first Guide
  // paragraph and leaves that stale locale-owned copy visible after a shell
  // language switch.
  document.querySelector('main#main [data-bamboo-t="summary"]')?.classList.add("main-summary");
  const text = (key, data = {}) => String((window.BAMBOO_LOCALES[locale] || BASE)[key] || BASE[key] || key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "");
  const aqueductCopy = {
    en:['Pin partner ({n})','Unpin partner ({n})','Linked pair {n}: {mode}','same direction','opposite direction','Required receiver','Closed embankment','Pin the partner, then turn pipe {n}.','Turn pipe {n}.','Undo or restart to recover the authored route.','Select a linked pipe.'],
    'zh-Hant':['固定另一端（{n}）','取消固定（{n}）','連動組 {n}：{mode}','同向','反向','必要集水池','封閉堤岸','先固定另一端，再轉動第 {n} 管。','轉動第 {n} 管。','請復原或重新開始以找回設計路線。','請選擇連動管。'],
    'zh-Hans':['固定另一端（{n}）','取消固定（{n}）','联动组 {n}：{mode}','同向','反向','必要集水池','封闭堤岸','先固定另一端，再转动第 {n} 管。','转动第 {n} 管。','请撤销或重新开始以找回设计路线。','请选择联动管。'],
    ja:['相手を固定（{n}）','固定を解除（{n}）','連動 {n}：{mode}','同方向','逆方向','必須の水受け','閉じた堤','相手を固定し、管 {n} を回します。','管 {n} を回します。','元に戻すか再開して経路を復元します。','連動した管を選びます。'],
    ko:['상대 고정 ({n})','고정 해제 ({n})','연결 {n}: {mode}','같은 방향','반대 방향','필수 물받이','막힌 둑','상대를 고정한 뒤 관 {n}을 돌리세요.','관 {n}을 돌리세요.','실행 취소하거나 다시 시작해 경로를 복구하세요.','연결된 관을 선택하세요.'],
    es:['Fijar pareja ({n})','Soltar pareja ({n})','Pareja {n}: {mode}','misma dirección','dirección opuesta','Receptor obligatorio','Terraplén cerrado','Fija la pareja y gira el tubo {n}.','Gira el tubo {n}.','Deshaz o reinicia para recuperar la ruta.','Elige un tubo enlazado.'],
    'pt-BR':['Fixar par ({n})','Soltar par ({n})','Par {n}: {mode}','mesma direção','direção oposta','Receptor obrigatório','Margem fechada','Fixe o par e gire o tubo {n}.','Gire o tubo {n}.','Desfaça ou reinicie para recuperar a rota.','Escolha um tubo ligado.'],
    fr:['Bloquer le partenaire ({n})','Libérer le partenaire ({n})','Paire {n} : {mode}','même sens','sens opposé','Bassin obligatoire','Digue fermée','Bloquez le partenaire puis tournez le tuyau {n}.','Tournez le tuyau {n}.','Annulez ou recommencez pour retrouver le trajet.','Choisissez un tuyau lié.'],
    de:['Partner fixieren ({n})','Partner lösen ({n})','Paar {n}: {mode}','gleiche Richtung','Gegenrichtung','Pflichtbecken','Geschlossener Damm','Fixiere den Partner und drehe Rohr {n}.','Drehe Rohr {n}.','Mache rückgängig oder beginne neu, um den Weg wiederherzustellen.','Wähle ein verbundenes Rohr.'],
    it:['Blocca il partner ({n})','Libera il partner ({n})','Coppia {n}: {mode}','stessa direzione','direzione opposta','Bacino obbligatorio','Argine chiuso','Blocca il partner e ruota il tubo {n}.','Ruota il tubo {n}.','Annulla o ricomincia per ripristinare il percorso.','Scegli un tubo collegato.'],
    ru:['Закрепить пару ({n})','Освободить пару ({n})','Пара {n}: {mode}','одно направление','противоположные направления','Обязательный приёмник','Закрытая насыпь','Закрепите пару и поверните трубу {n}.','Поверните трубу {n}.','Отмените ход или начните заново, чтобы восстановить путь.','Выберите связанную трубу.'],
    hi:['साथी रोकें ({n})','साथी छोड़ें ({n})','जोड़ी {n}: {mode}','एक ही दिशा','विपरीत दिशा','ज़रूरी जलाशय','बंद बाँध','साथी रोककर पाइप {n} घुमाएँ।','पाइप {n} घुमाएँ।','रास्ता वापस पाने के लिए पूर्ववत करें या फिर शुरू करें।','जुड़ा पाइप चुनें।'],
    ar:['ثبّت الشريك ({n})','ألغ تثبيت الشريك ({n})','الزوج {n}: {mode}','الاتجاه نفسه','اتجاه معاكس','حوض مطلوب','حاجز مغلق','ثبّت الشريك ثم أدر الأنبوب {n}.','أدر الأنبوب {n}.','تراجع أو أعد البدء لاستعادة المسار.','اختر أنبوبًا مرتبطًا.']
  };
  const aqText=(key,vars={})=>String((aqueductCopy[locale]||aqueductCopy.en)[key]).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??'');
  const aqueductIntro={en:'Linked pipes turn together. Pin the partner when needed; fill every marked receiver.', 'zh-Hant':'連動管會一起轉動；需要時固定另一端，並注滿所有標記的集水池。','zh-Hans':'联动管会一起转动；需要时固定另一端，并注满所有标记的集水池。',ja:'連動管は一緒に回ります。必要なら相手を固定し、印の水受けをすべて満たします。',ko:'연결된 관은 함께 돌아갑니다. 필요하면 상대를 고정하고 표시된 물받이를 모두 채우세요.',es:'Los tubos enlazados giran juntos. Fija su pareja cuando haga falta y llena todos los receptores.', 'pt-BR':'Tubos ligados giram juntos. Fixe o par quando precisar e encha todos os receptores.',fr:'Les tuyaux liés tournent ensemble. Bloquez le partenaire si besoin et remplissez tous les bassins.',de:'Verbundene Rohre drehen sich gemeinsam. Fixiere bei Bedarf den Partner und fülle alle markierten Becken.',it:'I tubi collegati ruotano insieme. Blocca il partner quando serve e riempi tutti i bacini.',ru:'Связанные трубы вращаются вместе. При необходимости закрепите пару и наполните все приёмники.',hi:'जुड़े पाइप साथ घूमते हैं। ज़रूरत पर साथी रोकें और सभी चिह्नित जलाशय भरें।',ar:'تدور الأنابيب المرتبطة معًا. ثبّت الشريك عند الحاجة واملأ كل الأحواض المحددة.'};
  const aqueductTerminal={en:'A side receiver stops water; it does not pass it onward.','zh-Hant':'側集水池是終點，水不會從中流出。','zh-Hans':'侧集水池是终点，水不会从中流出。',ja:'水受けは終点で、水は先へ流れません。',ko:'물받이는 종점이며 물을 다시 내보내지 않습니다.',es:'Un receptor lateral detiene el agua; no la deja pasar.', 'pt-BR':'O receptor lateral encerra o fluxo; a água não passa adiante.',fr:'Un bassin latéral arrête l’eau ; elle ne ressort pas.',de:'Ein Seitenbecken beendet den Wasserfluss.',it:'Un bacino laterale ferma l’acqua; non la lascia passare.',ru:'Боковой приёмник останавливает воду и не пропускает её дальше.',hi:'किनारे का जलाशय पानी रोकता है; पानी आगे नहीं जाता।',ar:'الحوض الجانبي يوقف الماء ولا يمرره إلى الخارج.'};
  const practiceCopy={en:'Practice only: progress and rewards are not saved.','zh-Hant':'僅供練習：不會保存進度或獎勵。','zh-Hans':'仅供练习：不会保存进度或奖励。',ja:'練習専用：進行や報酬は保存されません。',ko:'연습 전용: 진행과 보상은 저장되지 않습니다.',es:'Solo práctica: no se guardan el progreso ni las recompensas.','pt-BR':'Somente treino: progresso e recompensas não são salvos.',fr:'Entraînement : progression et récompenses ne sont pas enregistrées.',de:'Nur Übung: Fortschritt und Belohnungen werden nicht gespeichert.',it:'Solo allenamento: progressi e ricompense non vengono salvati.',ru:'Тренировка: прогресс и награды не сохраняются.',hi:'केवल अभ्यास: प्रगति और पुरस्कार सहेजे नहीं जाते।',ar:'للتدريب فقط: لا يُحفظ التقدم أو المكافآت.'};
  const resultCopy=()=>`${text('resultText',{moves:run.moves,n:selected+1})}${practiceRequested?' '+(practiceCopy[locale]||practiceCopy.en):''}`;
  function beaconProgress(tiles, wet) {
    let got = 0, total = 0;
    tiles.forEach((tile, index) => {
      if (!tile.beacon) return;
      total++;
      if (wet.has(index)) got++;
    });
    return { got, total };
  }
  // The inline arrow is authored facing south; convert north/east/south/west
  // direction IDs into the quarter turns needed by that visual baseline.
  function sluiceArrowRotation(exit) { return (exit + 2) % 4; }
  const screens = { main: $("main"), stage: $("stage"), battle: $("battle") };
  let sharedFrame = null, stageUI = null;
  const pinButton=document.createElement('button');pinButton.type='button';pinButton.id='aqueductPin';pinButton.hidden=true;pinButton.setAttribute('aria-pressed','false');
  $('hint').insertAdjacentElement('beforebegin',pinButton);
  pinButton.addEventListener('click',()=>{if(!run?.aqueduct||run.completed||run.aqueduct.pins<1)return;run.pinArmed=!run.pinArmed;run.hintMessage='';renderBoard();});
  $("battle").append($("leaveDialogTemplate").content.cloneNode(true));
  const battleBack = () => [...$("battle").querySelectorAll('[data-wp-return="battle"]')]
    .find(node => !node.closest("[inert]") && node.getClientRects().length);
  const DIRS = [[-1, 0, 0, 2], [0, 1, 1, 3], [1, 0, 2, 0], [0, -1, 3, 1]];
  function localRead(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function track(name, data = {}) {
    if(practiceRequested)return;
    window.WonderAnalytics?.track?.(name, {
      game_id: "animal-bamboo-pipes",
      game_version: GAME_VERSION,
      interface_version: INTERFACE_VERSION,
      locale,
      viewport: `${Math.round(window.innerWidth)}x${Math.round(window.innerHeight)}`,
      waterway: selected + 1,
      ...data,
    });
  }
  function show(name) {
    if (name !== "battle") cancelCompletionReveal();
    document.body.dataset.screen = name;
    $("mainGroup").hidden = name !== "main";
    Object.entries(screens).forEach(([key, node]) => { node.hidden = key !== name; });
    if (name !== "battle") {
      setResultOpen(false, false);
      setLeaveOpen(false, false, false);
    }
    if (name === "stage") renderStages();
    sharedFrame?.activate(name, {covered: name === "battle" && (!$('result').hidden || leaveOpen)});

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  function persist() { if(practiceRequested)return;try { localStorage.setItem("wp:bamboo", JSON.stringify(save)); } catch {} }
  function stageData(index) {
    const level = LEVELS[index], target = targetIndex(level);
    return window.BAMBOO_LEVELS.createStageTiles(level, index, target);
  }
  function ports(tile) {
    if (tile.shape === 'blocked') return [];
    if (tile.receiver) return [0,1,2,3];
    const raw = tile.shape === "x" || tile.target ? [0,1,2,3] : tile.shape === "s" ? [0,2] : tile.shape === "e" ? [0,1] : tile.shape === "t" ? [0,1,3] : tile.shape === "source" ? [2] : [0];
    return raw.map(port => (port + tile.rot) % 4);
  }
  function pipeShapeKey(tile) {
    if (tile.target) return "pipeShapeBasin";
    return ({ source: "pipeShapeSource", s: "pipeShapeStraight", e: "pipeShapeElbow", t: "pipeShapeTee", x: "pipeShapeCross" })[tile.shape] || "pipeShapeStraight";
  }
  function pipeAccessibleLabel(tile, index, isWet) {
    if (tile.shape === 'blocked') return aqText(6);
    if (tile.receiver) return `${aqText(5)}, ${text(isWet ? 'pipeFlowing' : 'pipeDry')}. ${aqueductTerminal[locale]||aqueductTerminal.en}`;
    const name = tile.target ? text("basinLabel") : text("pipeLabel", { n: index + 1 });
    const shape = text(pipeShapeKey(tile));
    const flow = text(isWet ? "pipeFlowing" : "pipeDry");
    const base = tile.target
      ? text("pipeTargetState", { name, shape, flow })
      : text("pipeState", { name, shape, orientation: text("pipeOrientation", { n: tile.rot + 1 }), flow });
    const sluice = tile.sluice
      ? text("sluiceState", { direction: text(["directionNorth", "directionEast", "directionSouth", "directionWest"][(tile.sluiceBaseExit + tile.rot) % 4]) })
      : "";
    const beacon = tile.beacon
      ? text("beaconState", { state: text(isWet ? "beaconWet" : "beaconDry") })
      : "";
    const pair=run?.aqueduct?.pairs.find(p=>p.a===index||p.b===index);
    const link=pair?aqText(2,{n:run.aqueduct.pairs.indexOf(pair)+1,mode:aqText(pair.mode==='S'?3:4)}):'';
    return [base, sluice, beacon, link].filter(Boolean).join(", ");
  }
  function targetIndex(level) {
    return level.target;
  }
  function basePorts(tile) {
    return tile.shape === "x" ? [0,1,2,3] : tile.shape === "s" ? [0,2] : tile.shape === "e" ? [0,1] : tile.shape === "t" ? [0,1,3] : tile.shape === "source" ? [2] : [0];
  }
  function solvedPorts(tile) {
    return tile.target ? [0,1,2,3] : ports({ ...tile, rot: tile.solved });
  }
  function hintNeedsCorrection(tile) {
    if (tile.sluice) return (tile.sluiceBaseExit + tile.rot) % 4 !== (tile.sluiceBaseExit + tile.solved) % 4;
    return ports(tile).slice().sort().join(",") !== solvedPorts(tile).slice().sort().join(",");
  }
  function hintTargetIndex(tiles) {
    return tiles.findIndex(tile => tile.required && hintNeedsCorrection(tile));
  }
  function hintRouteNeighbor(index) {
    if (!run || index < 0 || !run.tiles[index]) return -1;
    const tile = run.tiles[index], row = Math.floor(index / 5), col = index % 5;
    const routePorts = tile.sluice ? [(tile.sluiceBaseExit + tile.solved) % 4] : solvedPorts(tile), candidates = [];
    DIRS.forEach(([dr, dc, direction, reverse]) => {
      const nextRow = row + dr, nextCol = col + dc;
      if (nextRow < 0 || nextRow > 4 || nextCol < 0 || nextCol > 4) return;
      const nextIndex = nextRow * 5 + nextCol, next = run.tiles[nextIndex];
      if ((!next.required && !next.target) || !routePorts.includes(direction) || !solvedPorts(next).includes(reverse)) return;
      candidates.push(nextIndex);
    });
    return candidates.find(nextIndex => run.tiles[nextIndex].target) ?? candidates[0] ?? -1;
  }
  function hintLabel(index) {
    return index >= 0 && run.tiles[index]?.target
      ? text("basinLabel")
      : index >= 0
        ? text("hintPipeLabel", { n: index + 1 })
        : text("basinLabel");
  }
  function flowSvg(tile, index, wet) {
    if (!wet || tile.target) return null;
    const paths = basePorts(tile).map(port => {
      const end = [[50,0],[100,50],[50,100],[0,50]][port];
      return `<path d="M50 50 L${end[0]} ${end[1]}" pathLength="1"/>`;
    }).join("");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("flow"); svg.setAttribute("viewBox", "0 0 100 100"); svg.setAttribute("aria-hidden", "true");
    const depth = run.flowDistance?.[index] ?? 0;
    svg.style.setProperty("--flow-delay", `${Math.min(depth, 14) * 0.055}s`);
    svg.innerHTML = `<g class="flow-channel">${paths}</g><g class="flow-current">${paths}</g>`;
    if (tile.shape === "source") svg.classList.add("flow-source");
    if (tile.shape === "goal") svg.classList.add("flow-goal");
    return svg;
  }
  function water() {
    const source = run.tiles.findIndex(tile => tile.shape === "source");
    const queue = [[Math.floor(source / 5), source % 5]], wet = new Set([source]);
    run.flowDistance = Array(run.tiles.length).fill(-1);
    run.flowDistance[source] = 0;
    while (queue.length) {
      const [row, col] = queue.shift(), current = run.tiles[row * 5 + col];
      const openings = ports(current);
      const exits = run.aqueduct && (current.receiver || current.target) ? [] : current.sluice
        ? [((current.sluiceBaseExit + current.rot) % 4 + 4) % 4]
        : openings;
      DIRS.forEach(([dr, dc, direction, reverse]) => {
        if (!exits.includes(direction) || !openings.includes(direction)) return;
        const nextRow = row + dr, nextCol = col + dc, nextIndex = nextRow * 5 + nextCol;
        if (nextRow < 0 || nextRow > 4 || nextCol < 0 || nextCol > 4 || wet.has(nextIndex)) return;
        const next = run.tiles[nextIndex];
        if (ports(next).includes(reverse)) {
          wet.add(nextIndex);
          run.flowDistance[nextIndex] = run.flowDistance[row * 5 + col] + 1;
          queue.push([nextRow, nextCol]);
        }
      });
    }
    return wet;
  }
  function winReady() {
    const wet=water();
    return wet.has(run.tiles.findIndex(tile => tile.target)) && (!run.aqueduct || run.aqueduct.receivers.every(index=>wet.has(index)));
  }
  function renderStages() {
    if (stageUI) stageUI.refresh(selected);
    sharedFrame?.syncStageInfo();
  }
  function renderBoard(focusIndex = -1) {
    const wet = water(), board = $("board"), stageKey = String(selected);
    const canReuse = board.dataset.stageIndex === stageKey && board.children.length === run.tiles.length;
    if (!canReuse) {
      board.replaceChildren(...run.tiles.map(() => {
        const pipe = document.createElement("button");
        pipe.type = "button";
        return pipe;
      }));
      board.dataset.stageIndex = stageKey;
    }
    const hintNeighborIndex = run.aqueduct ? -1 : hintRouteNeighbor(hintedPipeIndex);
    const enabledIndexes = run.tiles.map((tile, index) => tile.target || tile.anchored || run.completed ? -1 : index).filter(index => index >= 0);
    if (!enabledIndexes.includes(boardFocusIndex)) boardFocusIndex = enabledIndexes[0] ?? 0;
    run.tiles.forEach((tile, index) => {
      const pipe = board.children[index], isWet = wet.has(index);
      pipe.className = `pipe${isWet ? " wet" : ""}${tile.beacon ? " beacon" : ""}${tile.sluice ? " sluice" : ""}${tile.anchored ? " anchored" : ""}${index === hintedPipeIndex ? " hint-target" : ""}${index === hintNeighborIndex ? " hint-neighbor" : ""}`;
      const pair=run.aqueduct?.pairs.find(p=>p.a===index||p.b===index);
      if (pair) { pipe.dataset.aqueductPair=String(run.aqueduct.pairs.indexOf(pair)+1); pipe.dataset.aqueductMode=pair.mode; } else { delete pipe.dataset.aqueductPair; delete pipe.dataset.aqueductMode; }
      pipe.classList.toggle('aqueduct-receiver',Boolean(tile.receiver));pipe.classList.toggle('aqueduct-blocked',tile.shape==='blocked');
      let linkBadge=pipe.querySelector('.aqueduct-link-badge');if(pair&&!linkBadge){linkBadge=document.createElement('span');linkBadge.className='aqueduct-link-badge';linkBadge.setAttribute('aria-hidden','true');pipe.append(linkBadge);}if(pair)linkBadge.textContent=`${run.aqueduct.pairs.indexOf(pair)+1}${pair.mode==='S'?'↻':'↔'}`;else linkBadge?.remove();
      if (tile.target) pipe.classList.add("target");
      pipe.dataset.shape = tile.shape;
      pipe.style.setProperty("--pipe-rotation", `${tile.rot * 90}deg`);
      if (tile.sluice) {
        const exit = (tile.sluiceBaseExit + tile.rot) % 4;
        pipe.style.setProperty("--sluice-rotation", `${sluiceArrowRotation(exit) * 90}deg`);
      } else pipe.style.removeProperty("--sluice-rotation");
      pipe.style.setProperty("--flow-delay", `${Math.min(run.flowDistance?.[index] ?? 0, 14) * 0.055}s`);
      pipe.dataset.rotation = String(tile.rot);
      pipe.setAttribute("aria-label", pipeAccessibleLabel(tile, index, isWet));
      pipe.disabled = tile.target || tile.anchored || run.completed;
      let sluiceMark = pipe.querySelector(".sluice-mark");
      if (tile.sluice && !sluiceMark) {
        sluiceMark = document.createElement("span");
        sluiceMark.className = "sluice-mark";
        sluiceMark.setAttribute("aria-hidden", "true");
        sluiceMark.innerHTML = '<svg viewBox="0 0 100 100" focusable="false"><path d="M50 12v65M30 57l20 21 20-21"/></svg>';
        pipe.append(sluiceMark);
      } else if (!tile.sluice) sluiceMark?.remove();
      let beaconMark = pipe.querySelector(".beacon-mark");
      if (tile.beacon && !beaconMark) {
        beaconMark = document.createElement("span");
        beaconMark.className = "beacon-mark";
        beaconMark.setAttribute("aria-hidden", "true");
        beaconMark.innerHTML = '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 2.5c-3.7 4.2-6 7.1-6 10.4a6 6 0 0 0 12 0c0-3.3-2.3-6.2-6-10.4Z"/><path d="M9.2 13.5a2.8 2.8 0 0 0 2.8 2.8"/></svg>';
        pipe.append(beaconMark);
      } else if (!tile.beacon) beaconMark?.remove();
      if (!pipe.disabled && index === boardFocusIndex) pipe.dataset.wpPrimaryAction = "true";
      else pipe.removeAttribute("data-wp-primary-action");
      pipe.tabIndex = !pipe.disabled && index === boardFocusIndex ? 0 : -1;
      let flow = pipe.querySelector(".flow");
      if (isWet && !tile.target && !tile.receiver && !flow) pipe.append(flowSvg(tile, index, true));
      else if ((!isWet || tile.target || tile.receiver) && flow) flow.remove();
      pipe.onclick = tile.target || tile.anchored ? null : event => {
        if (run.completed) return;
        hintedPipeIndex = -1;
        boardFocusIndex = index;
        if(run.aqueduct){const prior={rotations:run.tiles.map(item=>item.rot),pins:run.aqueduct.pins};try{AQUEDUCT.turn(run.aqueduct,index,run.pinArmed);}catch{run.hintMessage=aqText(10);renderBoard();return;}run.history.push(prior);run.pinArmed=false;run.hintMessage='';}
        else { run.history.push(run.tiles.map(item => item.rot)); tile.rot = (tile.rot + 1) % 4; }
        run.moves++;
        renderBoard(event.detail === 0 ? index : -1);
        if (winReady()) complete();
      };
    });
    $("moves").textContent = text("moves", { n: run.moves });
    const bloom = beaconProgress(run.tiles, wet);
    const hasSluice = run.tiles.some(tile => tile.sluice);
    $("cue").textContent = run.aqueduct ? (run.hintMessage || `${aqueductIntro[locale]||aqueductIntro.en}${run.aqueduct.receivers.length?' '+(aqueductTerminal[locale]||aqueductTerminal.en):''}`) : hintedPipeIndex >= 0
      ? text("hintRoute", { pipe: hintLabel(hintedPipeIndex), next: hintLabel(hintNeighborIndex) })
      : hasSluice && bloom.total ? text("mixedCue", bloom)
        : hasSluice ? text("sluiceCue")
          : bloom.total ? text("bloomCue", bloom)
            : text("cue");
    if (run.aqueduct && pinButton){pinButton.hidden=false;pinButton.disabled=run.completed||run.aqueduct.pins<1;pinButton.setAttribute('aria-pressed',String(run.pinArmed));pinButton.textContent=aqText(run.pinArmed?1:0,{n:run.aqueduct.pins});}
    if (focusIndex >= 0 && !board.children[focusIndex]?.disabled) board.children[focusIndex].focus();
  }
  function startStage(entry = "stage") {
    if(!practiceRequested)return startStageInternal(entry);
    if(!practiceActive||!practiceAdapter||practicePending)return;
    practicePending=true;void practiceAdapter.challenge('animal-bamboo-pipes',String(selected+1)).catch(()=>{}).finally(()=>{practicePending=false;});
  }
  function startStageInternal(entry = "stage") {
    cancelCompletionReveal();
    setResultOpen(false, false);
    const aqueduct=selected>=30&&(AQUEDUCT_READY||practiceActive)?AQUEDUCT.createAqueduct(window.BAMBOO_LEVELS,selected+1):null;
    run = { tiles: aqueduct?.tiles || stageData(selected), aqueduct, pinArmed:false, hintMessage:'', history: [], moves: 0, completed: false, hintUsed: false, undoUsed: false, flowDistance: [] };
    $('battle').dataset.bambooAqueduct=String(Boolean(aqueduct));if(pinButton)pinButton.hidden=!aqueduct;
    hintedPipeIndex = -1;
    boardFocusIndex = run.tiles.findIndex(tile => !tile.target);
    $("chapter").textContent = text("chapter", { n: Math.floor(selected / 5) + 1 });
    $("stageName").textContent = text("waterway", { n: selected + 1 });
    show("battle"); renderBoard(boardFocusIndex);
    window.WeightPlayAudio?.play?.("game.start");
    track("game_start", { stage: selected + 1, entry });
    track("waterway_started", { entry });
    requestAnimationFrame(() => $("board").children[boardFocusIndex]?.focus({ preventScroll: true }));

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function complete() {
    if(run.completed)return;
    run.completed = true;
    save.done[selected] = true;
    const previousBest = Number(save.best[selected]);
    save.best[selected] = Number.isFinite(previousBest) && previousBest >= 0
      ? Math.min(previousBest, run.moves)
      : run.moves;
    save.unlocked = Math.max(save.unlocked, Math.min(LEVELS.length, selected + 2)); persist();
    track("game_complete", { stage: selected + 1, turns: run.moves });
    track("waterway_restored", { turns: run.moves, hint_used: Boolean(run.hintUsed), undo_used: Boolean(run.undoUsed) });
    updateMainProgress();
    $("resultText").textContent = resultCopy();
    $("resultMastery").textContent = masteryText();
    $("resultPreview").textContent = selected < LEVELS.length - 1
      ? text("nextPreview", { n: selected + 2, chapter: text("chapter", { n: Math.floor((selected + 1) / 5) + 1 }) })
      : "";
    $("retry").disabled = false;
    $("resultStages").disabled = false;
    $("next").disabled = selected >= LEVELS.length-1;
    [$("resultStages"), $("next"), $("retry")].forEach(button => button.classList.remove("primary"));
    const primaryAction = $("next").disabled ? $("resultStages") : $("next");
    primaryAction.classList.add("primary");
    $("board").classList.add("celebrating");
    $("battle").classList.add("celebrating");
    scheduleCompletionReveal(primaryAction,900);
  }
  function masteryText() {
    const bloom = beaconProgress(run.tiles, water());
    return `${text("replayGoal", { moves: save.best[selected] ?? run.moves })}${bloom.total ? text("bloomResult", bloom) : ""}`;
  }
  function cancelCompletionReveal() {
    clearTimeout(completionTimer);
    completionTimer=0;
    $("board")?.classList.remove("celebrating");
    $("battle")?.classList.remove("celebrating");
  }
  function scheduleCompletionReveal(primaryAction,delay=150) {
    clearTimeout(completionTimer);
    completionTimer=setTimeout(()=>{
      completionTimer=0;
      if(!run?.completed||document.body.dataset.screen!=="battle"||leaveOpen)return;
      setResultOpen(true);
      primaryAction.focus();
    },delay);
  }
  function claimResultAction() {
    if ($("result").hidden || resultActionClaimed) return false;
    resultActionClaimed = true;
    [$("resultStages"), $("next"), $("retry")].forEach(button => { button.disabled = true; });
    return true;
  }
  function setResultOpen(open, syncFrame = true) {
    const result = $("result"), battle = $("battle"), owned = [...battle.querySelectorAll(":scope > header"), battle.querySelector(".battle-panel")];
    battle.classList.toggle("result-open", open);
    owned.forEach(node => {
      if (!node) return;
      node.inert = open;
      if (open) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    });
    (__wpNotifyMeasurement(), result.hidden = !open);
    if (open) {
      resultActionClaimed = false;
      battle.scrollTop = 0;
      result.scrollTop = 0;
    }
    if (syncFrame) sharedFrame?.activate("battle", {covered: open || leaveOpen});

    if (open) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement(); }
}
  function setLeaveOpen(open, restoreFocus = true, syncFrame = true) {
    if (!$("result").hidden && open) return;
    const battle = $("battle"), dialog = $("leaveDialog");
    const owned = [...battle.querySelectorAll(":scope > header"), battle.querySelector(".battle-panel")];
    (__wpNotifyMeasurement(), leaveOpen = open);
    battle.classList.toggle("leave-open", open);
    owned.forEach(node => {
      if (!node) return;
      node.inert = open;
      if (open) node.setAttribute("aria-hidden", "true");
      else if ($("result").hidden) node.removeAttribute("aria-hidden");
    });
    if (open) {
      (__wpNotifyMeasurement(), dialog.hidden = false);
      $("continueBattle").focus();
    } else {
      if (restoreFocus && !battle.hidden) battleBack()?.focus();
      (__wpNotifyMeasurement(), dialog.hidden = true);
      if (run?.completed && $("result").hidden) scheduleCompletionReveal($("next").disabled ? $("resultStages") : $("next"));
    }
    if (syncFrame) sharedFrame?.activate("battle", {covered: open || !$('result').hidden});
  }
  function updateMainProgress() {
    $("mainProgress").textContent = `${text("waterway", { n: Math.min(save.unlocked, LEVELS.length) })} / ${LEVELS.length}`;
  }
  function createFrameBridge() {
    const poster = "/assets/interface7-redrawn/animal-bamboo-pipes.webp";
    const stageConfig = {
      gameId: "animal-bamboo-pipes",
      poster,
      background: "/assets/lobby-block-atmosphere.svg",
      count: LEVELS.length,
      stage(index) {
        const level = LEVELS[index];
        const sluices = level.sluices?.length || 0;
        const beacons = level.beacons?.length || 0;
        const feature = sluices && beacons ? text("featureMixed")
          : sluices ? text("featureSluice")
            : beacons ? text("featureBloom", {n: beacons})
              : text("summary");
        const locked = index >= save.unlocked;
        const cleared = Boolean(save.done[index]);
        return {
          id: index + 1,
          kicker: text("chapter", {n: Math.floor(index / 5) + 1}),
          title: text("waterway", {n: index + 1}),
          subtitle: feature,
          status: locked ? text("locked") : cleared ? text("restored") : "",
          summary: text("summary"),
          details: [text("summary"), feature],
          locked,
          cleared,
          poster,
          posterPosition: "center",
        };
      },
    };
    return {
      stageConfig,
      getSelectedStage: () => selected,
      setSelectedStage(index) {
        selected = Math.max(0, Math.min(LEVELS.length - 1, Number(index) || 0));
        sharedFrame?.syncStageInfo();
      },
      getStageInfo() {
        return {
          label: text("choose"),
          progress: `${text("waterway", {n: selected + 1})} / ${LEVELS.length}`,
        };
      },
      startStage(index) {
        selected = Math.max(0, Math.min(LEVELS.length - 1, Number(index) || 0));
        startStage("stage");
      },
    };
  }
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${text("title")} | WeightPlay`;
    document.querySelectorAll("[data-bamboo-t]").forEach(node => { node.textContent = text(node.dataset.bambooT); });
    // The FAQ is game-owned. Apply it after the generic data-bamboo pass so a
    // stale route shell or later shared-localizer transaction cannot leave raw
    // faqTitle/faqQuestion/faqAnswer keys visible.
    window.BAMBOO_GUIDE?.apply?.(locale);
    document.querySelector(".locale").firstChild.textContent = `${text("language")} `;
    const mainReturn = screens.main.querySelector('[data-wp-return="main"]');
    if (mainReturn) {
      mainReturn.setAttribute("aria-label", text("returnLobby"));
      mainReturn.href = `/${LOCALE_ROUTES[locale] || "en"}/`;
    }
    document.querySelectorAll("[data-back]").forEach(node => node.setAttribute("aria-label", text("back")));
    $("rail").setAttribute("aria-label", text("stageSelector"));
    $("stage").querySelector("[data-wp-frame-nav]")?.setAttribute("aria-label", text("stageSelector"));
    $("board").setAttribute("aria-label", text("boardLabel"));
    screens.main.querySelector('[data-wp-frame-poster],.hero img')?.setAttribute("alt", text("coverAlt"));
    $("publicGuide")?.setAttribute("aria-label", text("guideTitle"));
    updateMainProgress();
    if (run) {
      $("chapter").textContent = text("chapter", { n: Math.floor(selected / 5) + 1 });
      $("stageName").textContent = text("waterway", { n: selected + 1 });
      $("resultText").textContent = resultCopy();
      $("resultMastery").textContent = run.completed ? masteryText() : "";
      $("resultPreview").textContent = run?.completed && selected < LEVELS.length - 1
        ? text("nextPreview", { n: selected + 2, chapter: text("chapter", { n: Math.floor((selected + 1) / 5) + 1 }) })
        : "";
      if (!screens.battle.hidden && $("result").hidden && !leaveOpen) renderBoard();
    }
    renderStages();
  }
  CODES.forEach(code => { const option = document.createElement("option"); option.value = code; option.textContent = window.BAMBOO_LOCALES[code].label; $("locale").append(option); });
  $("locale").value = locale;
  function changeLocale(nextLocale) {
    if (!CODES.includes(nextLocale)) return;
    locale = nextLocale;
    if(!practiceRequested)try {
      localStorage.setItem("weightPlayLocale", locale);
      localStorage.setItem("wp-locale", locale);
    } catch {}
    if(!practiceRequested)window.WonderI18n?.setLocale?.(locale);
    applyLocale();
  }
  $("locale").onchange = event => changeLocale(event.target.value);
  window.addEventListener("wonder:locale-change", event => {
    const nextLocale = event.detail?.locale;
    if (!CODES.includes(nextLocale)) return;
    locale = nextLocale;
    $("locale").value = locale;
    applyLocale();
    setTimeout(() => {
      if (locale === nextLocale) applyLocale();
    }, 0);
  });
  document.addEventListener("keydown", event => {
    if (!event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    if (![battleBack(), $("continueBattle"), $("leaveBattle")].includes(event.target)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  $("start").onclick = () => show("stage");
  document.querySelector("#stage [data-back]").onclick = () => show("main");
  document.addEventListener("click", event => {
    const control = event.target.closest?.('#battle [data-wp-return="battle"]');
    if (!control || $("battle").hidden || !$("result").hidden) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setLeaveOpen(true);
  }, true);
  $("continueBattle").onclick = () => setLeaveOpen(false);
  $("leaveBattle").onclick = () => {
    setLeaveOpen(false, false, false);
    show("stage");
  };
  document.addEventListener("keydown", event => {
    if (!leaveOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setLeaveOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const actions = [$("continueBattle"), $("leaveBattle")];
    const index = actions.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      actions[actions.length - 1].focus();
    } else if (!event.shiftKey && index === actions.length - 1) {
      event.preventDefault();
      actions[0].focus();
    }
  });
  $("board").addEventListener("focusin", event => {
    const pipe = event.target.closest?.(".pipe:not(:disabled)");
    if (!pipe) return;
    boardFocusIndex = [...$("board").children].indexOf(pipe);
    [...$("board").children].forEach((child, index) => { child.tabIndex = index === boardFocusIndex && !child.disabled ? 0 : -1; });
  });
  $("board").addEventListener("keydown", event => {
    const pipe = event.target.closest?.(".pipe:not(:disabled)");
    if (!pipe) return;
    const current = [...$("board").children].indexOf(pipe);
    const delta = event.key === "ArrowLeft" ? -1
      : event.key === "ArrowRight" ? 1
        : event.key === "ArrowUp" ? -5
          : event.key === "ArrowDown" ? 5
            : 0;
    let next = event.key === "Home" ? 0 : event.key === "End" ? 24 : current;
    if (delta) {
      next += delta;
      while (next >= 0 && next < 25 && $("board").children[next]?.disabled) next += delta;
      if ((delta === -1 || delta === 1) && Math.floor(next / 5) !== Math.floor(current / 5)) next = current;
    } else if (event.key !== "Home" && event.key !== "End") {
      return;
    }
    while (next >= 0 && next < 25 && $("board").children[next]?.disabled) next += event.key === "End" ? -1 : 1;
    if (next < 0 || next >= 25 || next === current) return;
    event.preventDefault();
    boardFocusIndex = next;
    [...$("board").children].forEach((child, index) => { child.tabIndex = index === next && !child.disabled ? 0 : -1; });
    $("board").children[next].focus({ preventScroll: true });
  });
  $("undo").onclick = () => { if(run?.completed)return;const prior = run?.history.pop(); if (prior) { run.undoUsed = true; track("undo_used", { turns_before: run.moves }); const rotations=run.aqueduct?prior.rotations:prior;run.tiles.forEach((tile, i) => { tile.rot = rotations[i]; });if(run.aqueduct){run.aqueduct.pins=prior.pins;run.pinArmed=false;run.hintMessage='';}run.moves--; renderBoard(); } };
  $("restart").onclick = () => { if (run && !run.completed) track("restart_used", { turns_before: run.moves }); __wpReplayStart(() => startStage("restart")); };
  $("hint").onclick = () => {
    if (run?.completed) return;
    if(run?.aqueduct){const advice=AQUEDUCT.hint(window.BAMBOO_LEVELS,run.aqueduct);run.hintUsed=true;run.hintMessage=advice.kind==='turn'?aqText(advice.pin?7:8,{n:advice.index+1}):aqText(9);hintedPipeIndex=advice.kind==='turn'?advice.index:-1;if(hintedPipeIndex>=0)boardFocusIndex=hintedPipeIndex;renderBoard(hintedPipeIndex);return;}
    hintedPipeIndex = hintTargetIndex(run.tiles);
    if (hintedPipeIndex < 0) return;
    run.hintUsed = true;
    track("hint_used", { pipe: hintedPipeIndex + 1, turns: run.moves });
    boardFocusIndex = hintedPipeIndex;
    renderBoard(hintedPipeIndex);
  };
  $("retry").onclick = () => { if (!claimResultAction()) return; track("result_replay", { from: "result" }); setResultOpen(false); __wpReplayStart(() => startStage("replay")); };
  $("next").onclick = () => { if (selected >= LEVELS.length-1 || !claimResultAction()) return; track("next_waterway_clicked", { from_waterway: selected + 1, to_waterway: selected + 2 }); setResultOpen(false); selected += 1; startStage("next"); };
  $("resultStages").onclick = () => { if (!claimResultAction()) return; track("return_to_waterways", { from: "result" }); setResultOpen(false); show("stage"); };
  applyLocale();
  function mountFrame(){if (!sharedFrame && $("gameFrame") && window.mountBambooFrame) {
    sharedFrame = window.mountBambooFrame(createFrameBridge());
    stageUI = sharedFrame.stageUI;
    renderStages();
  }}
  if(practiceRequested){
    $('start').disabled=true;
    import('/src/game-local-practice.mjs').then(({LocalPractice})=>{
      practiceAdapter=LocalPractice;
      return LocalPractice.register({gameId:'animal-bamboo-pipes',stageIds:Array.from({length:60},(_,i)=>i+1),
        enable(enabled){practiceActive=enabled;if(enabled){installAqueduct();save.unlocked=60;$('start').disabled=false;mountFrame();}else{selected=0;$('start').disabled=true;show('main');}},
        startStage(id){if(practiceActive){selected=Number(id)-1;startStageInternal('practice');}}
      });
    }).then(ok=>{if(!ok)mountFrame();}).catch(()=>{practiceActive=false;mountFrame();});
  }else mountFrame();
})();
