import { plans, satisfied, allowedPair as legalPair } from './puzzles.mjs';
import { createHabitatRenderer } from './habitat-3d.mjs';
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const locales = window.HABITAT_BLUEPRINT_LOCALES || {};
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const localeMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const sharedCopy = {
    en: { start: "Start Game", stages: "Stages", leaveTitle: "Leave this plan?", leaveText: "Leaving {stage} ends this blueprint attempt and discards its current tile arrangement. Cleared plans stay saved.", continuePlay: "Continue playing", returnStages: "Return to Stages" },
    "zh-Hant": { start: "開始遊戲", stages: "關卡", leaveTitle: "要離開這張藍圖嗎？", leaveText: "離開「{stage}」會結束這次藍圖嘗試並捨棄目前的方塊排列；已完成的關卡仍會保留。", continuePlay: "繼續遊戲", returnStages: "返回關卡" },
    "zh-Hans": { start: "开始游戏", stages: "关卡", leaveTitle: "要离开这张蓝图吗？", leaveText: "离开“{stage}”会结束这次蓝图尝试并丢弃当前方块排列；已完成的关卡仍会保留。", continuePlay: "继续游戏", returnStages: "返回关卡" },
    ja: { start: "ゲーム開始", stages: "ステージ", leaveTitle: "この設計図を離れますか？", leaveText: "「{stage}」を離れると現在の設計図の挑戦と配置は破棄されます。クリア済みのステージは保存されます。", continuePlay: "プレイを続ける", returnStages: "ステージへ戻る" },
    ko: { start: "게임 시작", stages: "스테이지", leaveTitle: "이 설계도를 나갈까요?", leaveText: "{stage}에서 나가면 현재 설계도 시도와 타일 배치가 사라집니다. 완료한 스테이지는 저장됩니다.", continuePlay: "계속 플레이", returnStages: "스테이지로 돌아가기" },
    es: { start: "Iniciar juego", stages: "Niveles", leaveTitle: "¿Salir de este plano?", leaveText: "Salir de {stage} termina este intento y descarta la disposición actual. Los niveles completados siguen guardados.", continuePlay: "Seguir jugando", returnStages: "Volver a Niveles" },
    "pt-BR": { start: "Iniciar jogo", stages: "Fases", leaveTitle: "Sair desta planta?", leaveText: "Sair de {stage} encerra esta tentativa e descarta a disposição atual. As fases concluídas continuam salvas.", continuePlay: "Continuar jogando", returnStages: "Voltar às Fases" },
    fr: { start: "Démarrer le jeu", stages: "Niveaux", leaveTitle: "Quitter ce plan ?", leaveText: "Quitter {stage} met fin à cette tentative et abandonne la disposition actuelle. Les niveaux terminés restent enregistrés.", continuePlay: "Continuer à jouer", returnStages: "Retour aux Niveaux" },
    de: { start: "Spiel starten", stages: "Stufen", leaveTitle: "Diesen Plan verlassen?", leaveText: "Wenn du {stage} verlässt, endet dieser Versuch und die aktuelle Anordnung wird verworfen. Abgeschlossene Stufen bleiben gespeichert.", continuePlay: "Weiterspielen", returnStages: "Zurück zu den Stufen" },
    it: { start: "Avvia gioco", stages: "Livelli", leaveTitle: "Uscire da questo progetto?", leaveText: "Uscire da {stage} termina questo tentativo e scarta la disposizione attuale. I livelli completati restano salvati.", continuePlay: "Continua a giocare", returnStages: "Torna ai Livelli" },
    ru: { start: "Начать игру", stages: "Уровни", leaveTitle: "Выйти из этого плана?", leaveText: "Выход из {stage} завершит текущую попытку и сбросит расположение плиток. Пройденные уровни останутся сохранены.", continuePlay: "Продолжить игру", returnStages: "Вернуться к уровням" },
    hi: { start: "खेल शुरू करें", stages: "स्तर", leaveTitle: "इस ब्लूप्रिंट से बाहर जाएँ?", leaveText: "{stage} छोड़ने पर यह प्रयास समाप्त होगा और मौजूदा टाइल व्यवस्था मिट जाएगी। पूरे किए गए स्तर सुरक्षित रहेंगे।", continuePlay: "खेल जारी रखें", returnStages: "स्तरों पर लौटें" },
    ar: { start: "ابدأ اللعبة", stages: "المراحل", leaveTitle: "مغادرة هذا المخطط؟", leaveText: "مغادرة {stage} تنهي هذه المحاولة وتتجاهل ترتيب البلاطات الحالي، بينما تبقى المراحل المكتملة محفوظة.", continuePlay: "متابعة اللعب", returnStages: "العودة إلى المراحل" }
  };

  const normalizeLocale = (value) => {
    if (value === "zh-TW") return "zh-Hant";
    if (value === "zh-CN") return "zh-Hans";
    if (value?.toLowerCase?.().startsWith("pt")) return "pt-BR";
    if (supportedLocales.includes(value)) return value;
    const short = value?.split?.("-")?.[0];
    return supportedLocales.includes(short) ? short : "en";
  };
  const safeStorage = {
    get(key, fallback = "") { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };
  const pathLocale = window.location.pathname.split("/").filter(Boolean).map((value) => localeMap[value] || "").find(Boolean);
  const routeLocale = pathLocale && locales[pathLocale] ? pathLocale : "";

  Object.entries(sharedCopy).forEach(([localeKey, values]) => {
    if (!locales[localeKey]) return;
    locales[localeKey].start = values.start;
    locales[localeKey].stages = values.stages;
  });

  let locale = routeLocale || safeStorage.get("weightPlayLocale", "") || safeStorage.get("weightplay-habitat-blueprint-locale", "") || "en";
  locale = normalizeLocale(locale);
  if (!locales[locale]) locale = "en";
  const savedSolved = safeStorage.get("weightplay-habitat-blueprint-solved-v8", "").split(",").map((value) => value.trim()).filter(Boolean).map(Number).filter((value) => Number.isInteger(value) && value >= 0 && value < plans.length);
  let planIndex = 0;
  let tiles = [];
  let selected = [];
  let swaps = 0;
  let history = [], boardRenderer = null, busy = false, completed = false;
  const progressKey = 'weightplay-habitat-blueprint-progress-v19';
  const themeKey = 'weightplay-habitat-blueprint-theme-v1';
  let progress = {solved:savedSolved,best:{}};
  try { const saved=JSON.parse(safeStorage.get(progressKey,'null')); if(saved&&Array.isArray(saved.solved)) progress={solved:saved.solved.filter(n=>Number.isInteger(n)&&n>=0&&n<30),best:saved.best||{}}; } catch {}
  let theme={owned:false,night:false}, purchaseBusy=false;
  try { const saved=JSON.parse(safeStorage.get(themeKey,'null')); if(saved)theme=saved; } catch {}
  // A pending receipt survives interruption between the two local writes.
  // A successful debit delivers the item; a failed debit never grants it.
  if(theme.pending) {
    theme={owned:window.WeightPlayWallet.read().diamonds===theme.after,night:window.WeightPlayWallet.read().diamonds===theme.after};
    try {localStorage.setItem(themeKey,JSON.stringify(theme));}catch{}
  }
  let solved = new Set(progress.solved);
  let feedback = "";
  let currentScreen = "main";
  let stageController = null;
  let selectedStageIndex = 0;
  let frame = null;
  let leaveModal = null;
  let leaveCovered = [];
  let settlementTimer = 0;
  let settlementDueAt = 0;
  let settlementRemaining = 0;
  let settlementCallback = null;

  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const tileName = (type) => type ? copy(`tile${type[0].toUpperCase()}${type.slice(1)}`) : "";
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `habitat_blueprint_${name}`, plan: planIndex + 1, swaps, ...data }); };
  const bestValue = () => progress.best[planIndex+1] || '—';
  const sound = event => window.WeightPlayAudio?.play?.(event);
  const solvedPlan = () => plans[planIndex].rules.every(rule=>satisfied(rule,tiles,plans[planIndex].cols));
  const highestUnlockedIndex = () => Math.min(plans.length - 1, Math.max(0, solved.size ? Math.max(...solved) + 1 : 0));
  const stageConfig = window.HabitatBlueprintStageConfig({
    plans,
    solved,
    highestUnlockedIndex,
    copy,
    tileName,
    getLocale: () => locale,
  });

  function clearSettlement() {
    if (settlementTimer) clearTimeout(settlementTimer);
    settlementTimer = 0;
    settlementDueAt = 0;
    settlementRemaining = 0;
    settlementCallback = null;
  }
  function runSettlement() {
    const callback = settlementCallback;
    settlementTimer = 0;
    settlementDueAt = 0;
    settlementRemaining = 0;
    settlementCallback = null;
    callback?.();
  }
  function scheduleSettlement(callback, delay = 320) {
    clearSettlement();
    settlementCallback = callback;
    settlementRemaining = delay;
    settlementDueAt = performance.now() + delay;
    settlementTimer = window.setTimeout(runSettlement, delay);
  }
  function pauseSettlement() {
    if (!settlementTimer) return;
    settlementRemaining = Math.max(0, settlementDueAt - performance.now());
    clearTimeout(settlementTimer);
    settlementTimer = 0;
    settlementDueAt = 0;
  }
  function resumeSettlement() {
    if (!settlementCallback || settlementTimer) return;
    const delay = Math.max(0, settlementRemaining || 0);
    settlementDueAt = performance.now() + delay;
    settlementTimer = window.setTimeout(runSettlement, delay);
  }

  function updateLeaveCopy() {
    if (!leaveModal) return;
    const values = sharedCopy[locale] || sharedCopy.en;
    const stage = `${planIndex + 1}. ${copy(plans[planIndex]?.name || "blueprint1")}`;
    leaveModal.querySelector("#habitatLeaveTitle").textContent = values.leaveTitle;
    leaveModal.querySelector("#habitatLeaveText").textContent = values.leaveText.replaceAll("{stage}", stage);
    leaveModal.querySelector("#habitatLeaveContinue").textContent = values.continuePlay;
    leaveModal.querySelector("#habitatLeaveStage").textContent = values.returnStages;
  }
  function restoreBattleCoverage() {
    leaveCovered.forEach(({ node, inert }) => { node.inert = inert; });
    leaveCovered = [];
    if (leaveModal) leaveModal.hidden = true;
  }
  function closeLeave({ resume = true, focus = true } = {}) {
    restoreBattleCoverage();
    if (resume) resumeSettlement();
    if (focus) $("battleBackBtn")?.focus({ preventScroll: true });
  }
  function openLeave() {
    const battle = $("battleScreen");
    if (!battle || !leaveModal || !leaveModal.hidden) return;
    updateLeaveCopy();
    pauseSettlement();
    leaveCovered = [...battle.children].filter((node) => node !== leaveModal).map((node) => ({ node, inert: Boolean(node.inert) }));
    leaveCovered.forEach(({ node }) => { node.inert = true; });
    leaveModal.hidden = false;
    leaveModal.querySelector("#habitatLeaveContinue")?.focus({ preventScroll: true });
  }
  function ensureLeaveDialog() {
    const battle = $("battleScreen");
    if (!battle) return;
    leaveModal = $("habitatLeaveDialog");
    if (!leaveModal) {
      leaveModal = document.createElement("section");
      leaveModal.id = "habitatLeaveDialog";
      leaveModal.className = "habitat-leave-modal";
      leaveModal.hidden = true;
      leaveModal.setAttribute("role", "dialog");
      leaveModal.setAttribute("aria-modal", "true");
      leaveModal.setAttribute("aria-labelledby", "habitatLeaveTitle");
      leaveModal.setAttribute("aria-describedby", "habitatLeaveText");
      leaveModal.innerHTML = '<div class="habitat-leave-dialog"><h2 id="habitatLeaveTitle"></h2><p id="habitatLeaveText"></p><div class="habitat-leave-actions"><button id="habitatLeaveContinue" class="primary" data-wp-frame-action="primary" type="button"></button><button id="habitatLeaveStage" class="secondary" data-wp-frame-action="secondary" type="button"></button></div></div>';
      battle.appendChild(leaveModal);
    }
    const continueButton = leaveModal.querySelector("#habitatLeaveContinue");
    const leaveButton = leaveModal.querySelector("#habitatLeaveStage");
    continueButton.addEventListener("click", () => closeLeave({ resume: true, focus: true }));
    leaveButton.addEventListener("click", () => {
      closeLeave({ resume: false, focus: false });
      clearSettlement();
      show("stage");
      renderStages();
    });
    leaveModal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLeave({ resume: true, focus: true });
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = [continueButton, leaveButton].filter((button) => !button.disabled);
      if (!focusables.length) return;
      event.preventDefault();
      const index = focusables.indexOf(document.activeElement);
      const next = event.shiftKey ? (index <= 0 ? focusables.length - 1 : index - 1) : (index + 1) % focusables.length;
      focusables[next].focus({ preventScroll: true });
    });
  }

  function syncStageAction() {
    const start = $("stageStartBtn");
    if (!start) return;
    const plan = stageConfig.stage(selectedStageIndex);
    start.disabled = plan.locked;
    start.textContent = `${copy("start")} · ${selectedStageIndex + 1}`;
    $("stageSummary").textContent = `${copy("chapter")} · ${solved.size}/${plans.length}`;
  }
  function renderStages() {
    if (!Number.isInteger(selectedStageIndex)) selectedStageIndex = highestUnlockedIndex();
    if (currentScreen === "stage" && !stageController) {
      if (!window.WeightPlayPlayUI?.mountStage) throw new Error("SHARED_PLAY_UI_MISSING");
      stageController = window.WeightPlayPlayUI.mountStage({
        page: $("stageContent"),
        rail: $("stageList"),
        config: stageConfig,
        selected: selectedStageIndex,
        onSelect: (index) => { selectedStageIndex = index; syncStageAction(); },
        onStart: (index) => startPlan(index, true),
        isActive: () => currentScreen === "stage",
      });
    } else if (stageController) {
      stageController.refresh(selectedStageIndex);
    }
    syncStageAction();
  }

  function show(screen) {
    const previous = currentScreen;
    if (screen === "stage" && previous === "main") selectedStageIndex = highestUnlockedIndex();
    currentScreen = screen;
    boardRenderer?.setActive(screen === "battle");
    const inBattle = screen === "battle" || screen === "result";
    document.querySelectorAll("[data-screen]").forEach((node) => {
      if (node === document.body || node === document.documentElement) return;
      if (node.id === "battleScreen") node.hidden = !inBattle;
      else if (node.id === "resultScreen") node.hidden = screen !== "result";
      else node.hidden = node.dataset.screen !== screen;
    });
    const battleLive = $("battleLive");
    if (battleLive) { battleLive.hidden = screen !== "battle"; battleLive.inert = screen !== "battle"; }
    if ($("resultScreen")) $("resultScreen").hidden = screen !== "result";
    if ($("battleScreen")) $("battleScreen").dataset.battleState = inBattle ? screen : "";
    document.body.dataset.screen = screen === "result" ? "battle" : screen;
    document.body.dataset.battleSubstate = screen === "result" ? "result" : "";
    frame?.activate(inBattle ? "battle" : screen, { covered: screen === "result" });
    const guide = $("gameGuide") || document.querySelector("[data-wp-game-guide],.game-page-info,.game-page-info-static");
    if (guide) guide.hidden = screen !== "main";
    if (screen === "stage") renderStages();
    if (screen === "battle") renderBattle();
    if (screen === "result") renderResult();
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync"));
  }

  function renderStatic() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.dataset.locale = locale;
    document.querySelectorAll("[data-i18n], [data-copy]").forEach((node) => { node.textContent = copy(node.dataset.i18n || node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)); });
    [$("backBtn"), $("stageBackBtn"), $("battleBackBtn")].forEach((button) => button?.setAttribute("aria-label", copy("back") || "Back"));
    $("settingsBtn")?.setAttribute("aria-label", copy("settings"));
    $("closeSettings")?.setAttribute("aria-label", copy("close"));
    $("localeSelect")?.setAttribute("aria-label", copy("language"));
    if ($("localeSelect")) $("localeSelect").value = locale;
    $('habitatGrid').setAttribute('aria-label',copy('chapter'));
    if ($("soundBtn")) {
      const soundEnabled = !Boolean(window.WeightPlayAudio?.isMuted?.());
      $("soundBtn").textContent = soundEnabled ? copy("on") : copy("off");
      $("soundBtn").setAttribute("aria-pressed", String(soundEnabled));
    }
    if ($("best")) $("best").textContent = copy("best", {count:solved.size});
    $("mainProgress").lastElementChild.textContent = ` · ${solved.size}/30`;
    renderTheme();
    renderStages();
    renderBattle();
    renderResult();
    updateLeaveCopy();
  }

  function startPlan(index, fromStage = false) {
    if (!Number.isInteger(index) || !plans[index]) return;
    clearSettlement();
    restoreBattleCoverage();
    busy=false; completed=false; history=[];
    planIndex = index;
    selectedStageIndex = index;
    syncStageAction();
    tiles = [...plans[index].tiles];
    selected = [];
    swaps = 0;
    feedback = "";

    show("battle");
    renderBattle();
    window.WeightPlayAudio?.play?.("game.start");
    announce("start");
  }
  function renderRules() {
    const root=$('rules'), plan=plans[planIndex];
    if(root.children.length!==plan.rules.length) root.replaceChildren(...plan.rules.map(()=>document.createElement('li')));
    plan.rules.forEach((rule,index)=>{
      const ok=satisfied(rule,tiles,plan.cols), item=root.children[index];
      item.classList.toggle('satisfied',ok);item.dataset.satisfied=String(ok);
      item.textContent=`${ok?'✓':'○'} ${copy(rule.key,{a:tileName(rule.a),b:tileName(rule.b)})}`;
    });
  }
  function allowedPair(a,b,plan=plans[planIndex]) {return legalPair(a,b,plan);}
  function renderBattle(animate=false) {
    if(currentScreen!=='battle')return;
    const plan=plans[planIndex], root=$('habitatGrid'), matches=plan.rules.filter(r=>satisfied(r,tiles,plan.cols)).length;
    $('planTitle').textContent=`${plan.id}. ${copy(plan.name)}`;
    $('progressPill').textContent=copy('moves',{n:swaps});
    $('prompt').textContent=copy(plan.hint);
    $('clueProgress').textContent=copy('clues',{n:matches,total:plan.rules.length})+(plan.maxSwaps?` · ${copy('budget',{n:plan.maxSwaps})}`:'');
    renderRules();
    $('selection').textContent=selected.length?copy('selection',{names:selected.map(i=>tileName(tiles[i])).join(' + ')}):copy('selectionPrompt');
    root.style.setProperty('--habitat-cols',plan.cols);
    const existing=root.querySelectorAll('.habitat-tile');
    if(existing.length!==tiles.length){
      existing.forEach(n=>n.remove());
      tiles.forEach((_,index)=>{
        const button=document.createElement('button');button.type='button';button.className='habitat-tile';button.dataset.slot=index;
        button.innerHTML='<span class="tile-number" aria-hidden="true"></span><span class="tile-caption"><strong></strong><small></small></span>';
        button.addEventListener('click',()=>{
          if(busy||completed||index===plans[planIndex].lockedSlot)return;
          if(selected.includes(index))selected=selected.filter(n=>n!==index);
          else selected=selected.length<2?[...selected,index]:[selected[1],index];
          sound('feedback.hint');renderBattle();
        });root.append(button);
      });
    }
    const exhausted=Boolean(plan.maxSwaps&&swaps>=plan.maxSwaps&&!completed);
    root.querySelectorAll('.habitat-tile').forEach((button,index)=>{
      button.dataset.tile=tiles[index];button.classList.toggle('locked',index===plan.lockedSlot);
      button.disabled=index===plan.lockedSlot||busy||completed;
      button.setAttribute('aria-pressed',String(selected.includes(index)));
      button.querySelector('.tile-number').textContent=index===plan.lockedSlot?'▣':String(index+1);
      button.querySelector('strong').textContent=tileName(tiles[index]);
      button.querySelector('small').textContent=index===plan.lockedSlot?copy('lockedTile'):'';
      button.setAttribute('aria-label',`${index+1}. ${tileName(tiles[index])}${index===plan.lockedSlot?` · ${copy('lockedTile')}`:''}`);
    });
    $('swapBtn').disabled=selected.length!==2||!allowedPair(...selected)||busy||completed||exhausted;
    $('undoBtn').disabled=!history.length||busy||completed;
    $('resetBtn').disabled=busy||completed;
    $('status').textContent=exhausted?copy('exhausted'):feedback?copy(feedback):'';
    $('status').className=`status ${exhausted?'try':completed?'good':''}`;
    root.classList.toggle('settled',completed);
    boardRenderer?.update(tiles,selected,{animate,night:theme.night});
  }
  function saveClear() {
    const next={solved:[...new Set([...solved,planIndex])].sort((a,b)=>a-b),best:{...progress.best,[planIndex+1]:Math.min(progress.best[planIndex+1]||Infinity,swaps)}};
    try {
      localStorage.setItem(progressKey,JSON.stringify(next));progress=next;solved.add(planIndex);
      window.WonderAnalytics?.completeStage?.(plans[planIndex].id);return true;
    }catch {feedback='saveError';return false;}
  }
  function swapSelected() {
    const plan=plans[planIndex];
    if(busy||completed||selected.length!==2||!allowedPair(...selected)||(plan.maxSwaps&&swaps>=plan.maxSwaps))return;
    const [a,b]=selected;history.push([...tiles]);[tiles[a],tiles[b]]=[tiles[b],tiles[a]];
    selected=[];swaps++;busy=true;completed=solvedPlan();feedback='';
    if(completed){saveClear();sound('result.win');}else sound(plan.maxSwaps&&swaps>=plan.maxSwaps?'result.lose':'board.move');
    renderBattle(true);
    scheduleSettlement(()=>{busy=false;if(completed)show('result');else renderBattle();},completed?650:290);
  }
  function undoMove(){
    if(busy||completed||!history.length)return;
    tiles=history.pop();swaps=Math.max(0,swaps-1);selected=[];feedback='';sound('board.undo');renderBattle(true);
  }
  function renderResult() {
    if(!$('resultText'))return;
    $('resultTitle').textContent=solved.size===plans.length?copy('resultTitle'):copy('resultLevel');
    $('resultText').textContent=copy('resultReport',{stage:planIndex+1,moves:swaps,best:bestValue(),count:solved.size})+(feedback==='saveError'?` ${copy('saveError')}`:'');
    $('nextBtn').disabled=planIndex>=plans.length-1;$('nextBtn').setAttribute('aria-disabled',String(planIndex>=plans.length-1));
    $('nextBtn').textContent=copy('nextStage');$('replayBtn').textContent=copy('replay');
    $('best').textContent=copy('best',{count:solved.size});
    $('mainProgress').lastElementChild.textContent=` · ${solved.size}/30`;
  }
  function renderTheme(message=''){
    $('themeBtn').textContent=copy('themeTitle');
    $('themeTitle').textContent=copy('themeTitle');$('themeDescription').textContent=copy('themeDescription');
    $('themeBalance').textContent=String(window.WeightPlayWallet.read().diamonds);
    $('themePurchaseLabel').textContent=copy(theme.owned?(theme.night?'dayTheme':'nightTheme'):'buyTheme');
    $('themePurchase').disabled=purchaseBusy||(!theme.owned&&window.WeightPlayWallet.read().diamonds<20);
    $('themeConfirm').textContent=copy('confirmPurchase');$('themeCancel').textContent=copy('cancel');
    $('themeClose').textContent=copy('close');$('themeStatus').textContent=message?copy(message):'';
    $('themeCostIcon').hidden=theme.owned;
  }
  function buyTheme(){
    if(purchaseBusy||theme.owned)return;
    // Another local tab may already have unlocked this permanent item.
    try {const saved=JSON.parse(localStorage.getItem(themeKey)||'null');if(saved?.owned){theme=saved;$('themeConfirmation').hidden=true;renderTheme('themeReady');return;}}catch{}
    const wallet=window.WeightPlayWallet,before=wallet.read();
    if(before.diamonds<20){renderTheme('insufficient');return;}
    purchaseBusy=true;renderTheme();const old={...theme};let charged=false;
    try{
      localStorage.setItem(themeKey,JSON.stringify({pending:true,before:before.diamonds,after:before.diamonds-20}));
      if(!wallet.spendDiamonds(20))throw new Error('INSUFFICIENT');charged=true;
      theme={owned:true,night:true};localStorage.setItem(themeKey,JSON.stringify(theme));
      sound('shop.purchase');
    }catch{
      theme=old;
      try {if(charged)wallet.save(before);localStorage.setItem(themeKey,JSON.stringify(old));}catch{}
      purchaseBusy=false;$('themeConfirmation').hidden=true;renderTheme('saveError');return;
    }
    purchaseBusy=false;$('themeConfirmation').hidden=true;renderTheme('themeReady');
  }
  function nextPlan() {
    const nextIndex = planIndex + 1;
    if (nextIndex < plans.length) startPlan(nextIndex);
    else { show("stage"); renderStages(); }
  }

  function bind() {
    $("startBtn")?.addEventListener("click", () => show("stage"));
    $("mapBtn")?.addEventListener("click", () => show("stage"));
    $("stageStartBtn")?.addEventListener("click", () => { if (!stageConfig.stage(selectedStageIndex).locked) startPlan(selectedStageIndex, true); });
    $("resultMapBtn")?.addEventListener("click", () => { clearSettlement(); show("stage"); });
    $("nextBtn")?.addEventListener("click", nextPlan);
    $("replayBtn")?.addEventListener("click", () => startPlan(planIndex));
    $("swapBtn")?.addEventListener("click", swapSelected);
    $('undoBtn').addEventListener('click',undoMove);
    $('themeBtn').addEventListener('click',()=>{renderTheme();$('themeDialog').showModal();});
    $('themeClose').addEventListener('click',()=>{$('themeConfirmation').hidden=true;$('themeDialog').close();});
    $('themeCancel').addEventListener('click',()=>{$('themeConfirmation').hidden=true;});
    $('themeConfirm').addEventListener('click',buyTheme);
    $('themePurchase').addEventListener('click',()=>{
      if(!theme.owned){$('themeConfirmation').hidden=false;return;}
      const next={owned:true,night:!theme.night};try{localStorage.setItem(themeKey,JSON.stringify(next));theme=next;renderTheme();}catch{renderTheme('saveError');}
    });
    $("resetBtn")?.addEventListener("click", () => {
      clearSettlement();
      tiles = [...plans[planIndex].tiles];
      selected = [];
      swaps = 0; history=[]; busy=false; completed=false;
      feedback = "";
      sound("board.undo");
      renderBattle();
      announce("reset");
    });
    $("stageBackBtn")?.addEventListener("click", () => { clearSettlement(); show("main"); });
    $("battleBackBtn")?.addEventListener("click", () => {
      if (currentScreen === "result") { clearSettlement(); show("stage"); renderStages(); return; }
      if (currentScreen !== "battle") return;
      if (swaps > 0 || selected.length || settlementCallback) openLeave();
      else { clearSettlement(); show("stage"); renderStages(); }
    });
    $("localeSelect")?.addEventListener("change", (event) => {
      locale = normalizeLocale(event.target.value);
      safeStorage.set("weightPlayLocale", locale);
      safeStorage.set("weightplay-habitat-blueprint-locale", locale);
      renderStatic();
      announce("locale", { locale });
    });
  }
  function enforceRouteLocale() {
    if (routeLocale && routeLocale !== locale) { locale = routeLocale; renderStatic(); }
  }
  function markSharedEntryReady() {
    const ready = () => window.WeightPlayGameEntryLoader?.ready?.();
    if (window.WeightPlayGameEntryLoader) {
      requestAnimationFrame(ready);
      return;
    }
    const script = document.querySelector('script[src*="/src/game-entry-loader.js"]');
    if (script) script.addEventListener("load", () => requestAnimationFrame(ready), { once: true });
  }
  function boot() {
    $("app").hidden = false;
    frame = window.mountHabitatBlueprintFrame();
    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add($('themeBtn')));
    boardRenderer=createHabitatRenderer($('habitatGrid'),(unavailable=true)=>{
      $('habitatGrid').classList.toggle('render-fallback',unavailable);$('renderNotice').hidden=!unavailable;$('renderNotice').textContent=copy('renderFallback');
    });
    document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseSettlement();else if(leaveModal?.hidden)resumeSettlement();});
    window.addEventListener('pagehide',event=>{
      if(event.persisted){pauseSettlement();boardRenderer?.setActive(false);}
      else {clearSettlement();boardRenderer?.dispose();}
    });
    window.addEventListener('pageshow',event=>{
      if(event.persisted){boardRenderer?.setActive(currentScreen==='battle');if(leaveModal?.hidden)resumeSettlement();}
    });
    ensureLeaveDialog();
    bind();
    if ($("localeSelect")) $("localeSelect").value = locale;
    $("loading").hidden = true;
    show("main");
    renderStatic();
    enforceRouteLocale();
    markSharedEntryReady();
    announce("loaded");
  }

  window.__HABITAT_BLUEPRINT_TEST__ = {
    plans,
    startPlan,
    allowedPair,
    getState: () => ({ completed,busy,history:history.length,renderer:boardRenderer?.stats(),theme:{...theme}, planIndex, tiles: [...tiles], solved: [...solved], swaps, screen: currentScreen, stagePoolSize: $("stageList")?.querySelectorAll(":scope > [data-wp-stage-pool-node]").length || 0 }),
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
}());
