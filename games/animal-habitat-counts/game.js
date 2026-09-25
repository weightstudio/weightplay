(function () {
  "use strict";
  const artStyle = document.createElement("link");
  artStyle.rel = "stylesheet";
  artStyle.href = "/games/animal-habitat-counts/art.css?v=20260921-habitat-counts-block-scene-v1";
  document.head.appendChild(artStyle);

  const locales = window.ANIMAL_HABITAT_COUNTS_LOCALES || {};
  const STANDARD_COPY = {
    en:{ start:"Start Game", continue:"Continue playing", confirmLeave:"Return to Stages" },
    "zh-Hant":{ start:"開始遊戲", continue:"繼續遊戲", confirmLeave:"返回關卡" },
    "zh-Hans":{ start:"开始游戏", continue:"继续游戏", confirmLeave:"返回关卡" },
    ja:{ start:"ゲーム開始", continue:"プレイを続ける", confirmLeave:"ステージへ戻る" },
    ko:{ start:"게임 시작", continue:"계속 플레이", confirmLeave:"스테이지로 돌아가기" },
    es:{ start:"Iniciar juego", continue:"Seguir jugando", confirmLeave:"Volver a niveles" },
    "pt-BR":{ start:"Iniciar jogo", continue:"Continuar jogando", confirmLeave:"Voltar às fases" },
    fr:{ start:"Démarrer le jeu", continue:"Continuer", confirmLeave:"Retour aux niveaux" },
    de:{ start:"Spiel starten", continue:"Weiterspielen", confirmLeave:"Zurück zu den Stufen" },
    it:{ start:"Inizia gioco", continue:"Continua a giocare", confirmLeave:"Torna ai livelli" },
    ru:{ start:"Начать игру", continue:"Продолжить игру", confirmLeave:"Вернуться к этапам" },
    hi:{ start:"गेम शुरू करें", continue:"खेल जारी रखें", confirmLeave:"स्टेज पर लौटें" },
    ar:{ start:"ابدأ اللعبة", continue:"متابعة اللعب", confirmLeave:"العودة إلى المراحل" },
  };
  Object.entries(STANDARD_COPY).forEach(([locale, values]) => { if (locales[locale]) Object.assign(locales[locale], values); });
  const campaignLocales = window.ANIMAL_HABITAT_COUNTS_CAMPAIGN_LOCALES || {};
  const campaign = window.ANIMAL_HABITAT_COUNTS_CAMPAIGN;
  const stages = campaign?.stages || [];
  const localeKeys = Object.keys(locales);
  const SAVE_KEY = "weightplay-animal-habitat-counts-campaign-v12";
  const LENS_IMAGE = "/assets/animal-gearpack-expedition-items/crystal-lens.webp";
  const STONE_IMAGE = "/assets/animal-block-grove-icon-stone.webp";
  const STORAGE = {
    get(key, fallback = "") { try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} },
  };
  const knownIds = new Set(stages.map((stage) => stage.id));
  const defaultProgress = () => ({ completed: [], unlocked: 1, lens: 0 });
  function readProgress() {
    const raw = STORAGE.get(SAVE_KEY);
    if (!raw) return defaultProgress();
    try {
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object" || !Array.isArray(saved.completed)) return defaultProgress();
      const completed = [...new Set(saved.completed.filter((id) => knownIds.has(id)))];
      const furthestComplete = completed.reduce((max, id) => Math.max(max, Number(id.slice(-2)) || 0), 0);
      const storedUnlocked = Number.isFinite(Number(saved.unlocked)) ? Number(saved.unlocked) : 1;
      const unlocked = Math.max(1, Math.min(30, Math.max(furthestComplete + (furthestComplete < 30 ? 1 : 0), Math.floor(storedUnlocked))));
      const lens = Number.isFinite(Number(saved.lens)) ? Math.max(0, Math.min(2, Math.floor(Number(saved.lens)))) : 0;
      return { completed, unlocked, lens };
    } catch (_) {
      return defaultProgress();
    }
  }
  const progress = readProgress();
  const state = {
    locale: "en", screen: "main", roundIndex: 0, board: [], checks: 0,
    completed: progress.completed, unlocked: progress.unlocked, lens: progress.lens,
    revealed: new Set(), sound: !(window.WeightPlayAudio?.isMuted?.() ?? false), resultVisible: false, checkpointGrant: 0,
  };
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const tween = (node, frames, duration = 240) => {
    if (!node?.animate || reduceMotion?.matches || document.hidden) return;
    node.animate(frames, { duration, easing: "cubic-bezier(.2,.8,.2,1)" });
  };
  const $ = (id) => document.getElementById(id);
  const dictionary = () => locales[state.locale] || locales.en || {};
  const campaignCopy = () => campaignLocales[state.locale] || campaignLocales.en || {};
  const interpolate = (value, vars = {}) => Object.entries(vars).reduce((text, [key, replacement]) => text.replace(new RegExp("\\{" + key + "\\}", "g"), String(replacement)), String(value));
  const t = (key, vars = {}) => interpolate(dictionary()[key] || locales.en?.[key] || key, vars);
  const c = (key, vars = {}) => {
    const value = campaignCopy()[key] ?? campaignLocales.en?.[key] ?? key;
    return Array.isArray(value) ? value : interpolate(value, vars);
  };
  const status = (index) => c("status")[index];
  const routeLocale = { en:"en", "zh-tw":"zh-Hant", "zh-cn":"zh-Hans", ja:"ja", ko:"ko", es:"es", "pt-br":"pt-BR", fr:"fr", de:"de", it:"it", ru:"ru", hi:"hi", ar:"ar" };
  const queryLocale = () => {
    const query = new URLSearchParams(location.search).get("lang");
    if (query && locales[query]) return query;
    const segment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const route = routeLocale[segment];
    return route && locales[route] ? route : STORAGE.get("weightplay-habitat-counts-locale", "en");
  };
  const currentStage = () => stages[state.roundIndex];
  const isComplete = (stage) => state.completed.includes(stage.id);
  const saveProgress = () => STORAGE.set(SAVE_KEY, JSON.stringify({ completed: state.completed, unlocked: state.unlocked, lens: state.lens }));
  const play = (event) => { if (state.sound && window.WeightPlayAudio?.play) window.WeightPlayAudio.play(event); };

  function setScreen(screen) {
    state.screen = screen;
    document.body.dataset.screen = screen;
    ["main", "stage", "battle"].forEach((name) => {
      const node = $(name + "Screen");
      node.hidden = name !== screen;
      node.classList.toggle("active", name === screen);
    });
    $("guideSection").hidden = screen !== "main";
    if (screen === "main") renderMain();
    if (screen === "stage") renderStages();
    if (screen === "battle") renderBattle();
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    window.scrollTo(0, 0);
  }

  function applyLocale() {
    const base = dictionary();
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale === "zh-Hans" ? "zh-CN" : state.locale;
    document.documentElement.dir = base.direction || (state.locale === "ar" ? "rtl" : "ltr");
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.copyAriaLabel)));
    document.querySelectorAll("[data-campaign-copy]").forEach((node) => { node.textContent = c(node.dataset.campaignCopy); });
    $("startBtn").textContent = state.completed.length ? t("continue") : t("start");
    $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("soundBtn").setAttribute("aria-pressed", String(state.sound));
    $("battleSoundBtn").setAttribute("aria-label", state.sound ? t("soundOn") : t("soundOff"));
    $("battleSoundBtn").setAttribute("aria-pressed", String(state.sound));
    if (state.screen === "main") renderMain();
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") {
      renderBattle();
      if (state.resultVisible) renderResult();
    }
  }

  function renderMain() {
    $("mainProgress").textContent = state.completed.length
      ? c("progress", { count: state.completed.length, total: 30 })
      : c("progressEmpty", { total: 30 });
    $("startBtn").textContent = state.completed.length ? t("continue") : t("start");
  }

  function renderStages() {
    $("stageList").replaceChildren(...stages.map((stage, index) => {
      const button = document.createElement("button");
      const complete = isComplete(stage);
      const unlocked = stage.number <= state.unlocked;
      const stateIndex = complete ? 1 : unlocked ? 0 : 2;
      button.type = "button";
      button.className = "stage-card" + (complete ? " complete" : "") + (stage.checkpoint ? " checkpoint" : "");
      button.disabled = !unlocked;
      button.dataset.stageId = stage.id;
      const number = document.createElement("strong");
      number.textContent = c("stageName", { arc: c("arcs")[index / 5 | 0], stageWord: c("stageWord"), number: stage.number });
      const details = document.createElement("span");
      details.textContent = c("stageHint", { arc: c("arcs")[index / 5 | 0], size: stage.size });
      const marker = document.createElement("b");
      marker.textContent = status(stateIndex);
      button.append(number, details, marker);
      button.addEventListener("click", () => startStage(index));
      requestAnimationFrame(() => tween(button, [{ opacity: 0 }, { opacity: 1 }], 180 + Math.min(index, 5) * 30));
      return button;
    }));
    window.dispatchEvent(new Event("weightplay:stage-sync"));
  }

  function renderClues(stage) {
    const makeClue = (label, count, type, index) => {
      const node = document.createElement("span");
      node.className = "clue";
      node.dataset.clueType = type;
      node.dataset.clueIndex = String(index);
      node.textContent = interpolate(label, { number: index + 1, count });
      return node;
    };
    [$("rowClues"), $("columnClues")].forEach((node) => node.style.setProperty("--board-size", stage.size));
    $("rowClues").replaceChildren(...stage.rows.map((count, index) => makeClue(t("rowLabel", { number: index + 1, count }), count, "row", index)));
    $("columnClues").replaceChildren(...stage.columns.map((count, index) => makeClue(t("columnLabel", { number: index + 1, count }), count, "column", index)));
  }

  function routeIndex(stage, cell) {
    if (stage.trail[0] === cell) return 0;
    if (stage.trail[stage.trail.length - 1] === cell) return 2;
    if (stage.trail.includes(cell)) return 1;
    if (stage.branch.includes(cell)) return 3;
    return -1;
  }

  function renderGrid(stage) {
    const grid = $("habitatGrid");
    const anchors = new Map();
    stage.zones.forEach((zone) => {
      const anchor = zone.cells[0];
      if (!anchors.has(anchor)) anchors.set(anchor, []);
      anchors.get(anchor).push(zone.id + 1);
    });
    grid.style.setProperty("--board-size", stage.size);
    grid.setAttribute("aria-label", c("stageHint", { arc: c("arcs")[state.roundIndex / 5 | 0], size: stage.size }));
    const cells = Array.from({ length: stage.size * stage.size }, (_, index) => {
      const button = document.createElement("button");
      const stone = stage.stones.includes(index);
      const filled = Boolean(state.board[index]);
      const [row, column] = [Math.floor(index / stage.size) + 1, index % stage.size + 1];
      button.type = "button";
      button.className = "cell" + (stone ? " is-stone" : "");
      button.dataset.cell = String(index);
      button.disabled = stone;
      button.setAttribute("aria-pressed", String(filled));
      const route = routeIndex(stage, index);
      const routeLabel = route < 0 ? "" : `, ${c("route")[route]}`;
      button.setAttribute("aria-label", c("cell")[0].replace("{row}", row).replace("{column}", column).replace("{state}", stone ? c("cell")[3] : c("cell")[filled ? 1 : 2]) + routeLabel);
      if (stone) {
        const image = document.createElement("img");
        image.src = STONE_IMAGE;
        image.alt = c("stoneAlt");
        image.width = 48;
        image.height = 48;
        button.append(image);
      } else {
        const zoneIds = anchors.get(index) || [];
        zoneIds.forEach((zoneId) => {
          const tag = document.createElement("span");
          tag.className = "zone-marker";
          tag.textContent = String(zoneId);
          tag.setAttribute("aria-hidden", "true");
          button.append(tag);
        });
        if (route >= 0) {
          button.dataset.route = String(route);
          const marker = document.createElement("span");
          marker.className = "route-marker";
          marker.textContent = ["S", "•", "E", "◇"][route];
          marker.setAttribute("aria-hidden", "true");
          button.append(marker);
        }
        button.addEventListener("click", () => {
          state.board[index] = state.board[index] ? 0 : 1;
          clearFeedback();
          renderGrid(stage);
          const updated = $("habitatGrid").querySelector(`[data-cell="${index}"]`);
          updated?.focus({ preventScroll: true });
          tween(updated, [{ transform: "scale(.9)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], 220);
        });
      }
      return button;
    });
    grid.replaceChildren(...cells);
    updateFilledCount(stage);
  }

  function updateFilledCount(stage) {
    const count = state.board.reduce((sum, cell) => sum + Number(Boolean(cell)), 0);
    $("filledCount").textContent = `${count}/${stage.size * stage.size}`;
  }

  function renderZones(stage) {
    const card = $("zoneCard");
    const hasLens = stage.zones.some((zone) => zone.hidden) || state.lens > 0;
    card.hidden = !stage.zones.length && !hasLens;
    const rows = stage.zones.map((zone) => {
      const row = document.createElement("div");
      row.className = "zone-clue";
      row.dataset.zone = String(zone.id);
      const isHidden = zone.hidden && !state.revealed.has(zone.id);
      const text = document.createElement("span");
      text.textContent = isHidden ? c("zoneHidden", { number: zone.id + 1 }) : c("zoneCount", { number: zone.id + 1, count: zone.count });
      row.append(text);
      return row;
    });
    $("zoneClues").replaceChildren(...rows);
    $("lensCount").replaceChildren();
    if (hasLens) {
      const icon = document.createElement("img");
      icon.src = LENS_IMAGE;
      icon.alt = c("itemName");
      icon.width = 26;
      icon.height = 26;
      const label = document.createElement("span");
      label.textContent = c("lensAvailable", { count: state.lens });
      $("lensCount").append(icon, label);
    }
    const controls = $("lensControls");
    controls.replaceChildren();
    stage.zones.filter((zone) => zone.hidden && !state.revealed.has(zone.id)).forEach((zone) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lens-use";
      button.disabled = state.lens < 1;
      const icon = document.createElement("img");
      icon.src = LENS_IMAGE;
      icon.alt = c("itemName");
      icon.width = 24;
      icon.height = 24;
      const label = document.createElement("span");
      label.textContent = c("revealZone", { number: zone.id + 1 });
      button.append(icon, label);
      button.addEventListener("click", () => revealZone(zone));
      controls.appendChild(button);
    });
    if (stage.zones.some((zone) => zone.hidden && !state.revealed.has(zone.id)) && state.lens < 1) {
      const note = document.createElement("p");
      note.className = "lens-note";
      note.textContent = c("lensNoCharge");
      controls.appendChild(note);
    }
  }

  function renderRules(stage) {
    const rules = [c("rules")[0]];
    if (stage.zones.length) rules.push(c("zonesTitle") + ": " + stage.zones.map((zone) => zone.id + 1).join(", "));
    if (stage.stones.length) rules.push(c("rules")[1]);
    if (stage.trail.length) rules.push(c("rules")[2]);
    if (stage.branch.length) rules.push(c("rules")[3]);
    $("ruleList").setAttribute("aria-label", c("goalHelp"));
    $("ruleList").replaceChildren(...rules.map((rule) => { const item = document.createElement("li"); item.textContent = rule; return item; }));
  }

  function renderBattle() {
    const stage = currentStage();
    if (!stage) return;
    $("battlePanel").dataset.boardSize = String(stage.size);
    $("roundHint").textContent = c("stageHint", { arc: c("arcs")[state.roundIndex / 5 | 0], size: stage.size });
    $("progressBadge").textContent = c("progressBadge", { number: stage.number, total: 30 });
    $("battleHeading").textContent = c("stageName", { arc: c("arcs")[state.roundIndex / 5 | 0], stageWord: c("stageWord"), number: stage.number });
    $("goalHelp").textContent = c("goalHelp");
    renderClues(stage);
    renderZones(stage);
    renderRules(stage);
    renderGrid(stage);
    clearFeedback();
  }

  function clearFeedback() {
    const statusNode = $("battleStatus");
    statusNode.textContent = "";
    statusNode.classList.remove("is-wrong");
    $("habitatGrid").querySelectorAll(".cell").forEach((node) => node.classList.remove("is-mismatch"));
    document.querySelectorAll("#rowClues .clue, #columnClues .clue, #zoneClues .zone-clue").forEach((node) => {
      node.classList.remove("is-mismatch");
      node.removeAttribute("aria-invalid");
    });
  }

  function revealZone(zone) {
    if (state.lens < 1 || state.revealed.has(zone.id)) return;
    state.lens -= 1;
    state.revealed.add(zone.id);
    saveProgress();
    play("feedback.hint");
    renderZones(currentStage());
    const note = document.createElement("span");
    note.className = "visually-hidden";
    note.textContent = c("revealed", { number: zone.id + 1, count: zone.count });
    $("battleStatus").replaceChildren(note);
    $("battleStatus").classList.remove("is-wrong");
  }

  function startStage(index) {
    if (index < 0 || index >= stages.length || index + 1 > state.unlocked) return;
    state.roundIndex = index;
    state.board = Array(stages[index].size * stages[index].size).fill(0);
    state.checks = 0;
    state.revealed = new Set();
    state.checkpointGrant = 0;
    state.resultVisible = false;
    $("battlePanel").hidden = false;
    $("battlePanel").inert = false;
    $("resultPanel").hidden = true;
    $("leaveDialog").hidden = true;
    play("game.start");
    setScreen("battle");
  }

  function startGame() {
    let target = stages.findIndex((stage) => stage.number <= state.unlocked && !isComplete(stage));
    if (target < 0) target = Math.min(state.unlocked, 30) - 1;
    setScreen("stage");
    if (target >= 0) {
      const card = document.querySelector(`[data-stage-id="${stages[target].id}"]`);
      if (card) card.focus({ preventScroll: true });
    }
  }

  function highlightValidation(result) {
    $("rowClues").querySelectorAll(".clue").forEach((node, index) => {
      node.classList.toggle("is-mismatch", result.rowMismatch[index]);
      node.toggleAttribute("aria-invalid", result.rowMismatch[index]);
    });
    $("columnClues").querySelectorAll(".clue").forEach((node, index) => {
      node.classList.toggle("is-mismatch", result.columnMismatch[index]);
      node.toggleAttribute("aria-invalid", result.columnMismatch[index]);
    });
    $("zoneClues").querySelectorAll(".zone-clue").forEach((node, index) => {
      node.classList.toggle("is-mismatch", result.zoneMismatch[index]);
      node.toggleAttribute("aria-invalid", result.zoneMismatch[index]);
    });
    const stage = currentStage();
    $("habitatGrid").querySelectorAll(".cell").forEach((node, index) => {
      const row = Math.floor(index / stage.size), column = index % stage.size;
      const inWrongZone = stage.zones.some((zone, zoneIndex) => result.zoneMismatch[zoneIndex] && zone.cells.includes(index));
      const blocked = stage.stones.includes(index) && result.blockedMismatch[stage.stones.indexOf(index)];
      const route = stage.trail.includes(index) || stage.branch.includes(index);
      node.classList.toggle("is-mismatch", result.rowMismatch[row] || result.columnMismatch[column] || inWrongZone || blocked || (!result.connected && route));
    });
  }

  function checkBoard() {
    const stage = currentStage();
    state.checks += 1;
    const result = campaign.evaluateBoard(stage, state.board);
    highlightValidation(result);
    const statusNode = $("battleStatus");
    if (!result.correct) {
      statusNode.textContent = c("wrong");
      statusNode.classList.add("is-wrong");
      play("feedback.error");
      return;
    }
    statusNode.textContent = c("correct");
    statusNode.classList.remove("is-wrong");
    play(stage.number === 30 ? "result.win" : stage.checkpoint ? "game.checkpoint" : "feedback.success");
    finishStage(stage);
  }

  function finishStage(stage) {
    const wasComplete = isComplete(stage);
    state.checkpointGrant = 0;
    if (!wasComplete) {
      state.completed.push(stage.id);
      state.completed.sort((a, b) => Number(a.slice(-2)) - Number(b.slice(-2)));
      state.unlocked = Math.max(state.unlocked, Math.min(30, stage.number + 1));
      if (stage.checkpoint) {
        const prior = state.lens;
        state.lens = Math.min(2, state.lens + stage.lensReward);
        state.checkpointGrant = state.lens - prior;
      }
      saveProgress();
    }
    renderMain();
    $("battlePanel").hidden = true;
    $("battlePanel").inert = true;
    $("resultPanel").hidden = false;
    state.resultVisible = true;
    renderResult();
    tween($("resultPanel"), [{ opacity: 0, transform: "translateY(12px) scale(.985)" }, { opacity: 1, transform: "translateY(0) scale(1)" }], 280);
    window.dispatchEvent(new Event("weightplay:shell-sync"));
  }

  function renderResult() {
    const stage = currentStage();
    if (!stage) return;
    $("resultTitle").textContent = stage.number === 30 ? c("finaleTitle") : c("resultTitle");
    $("resultBody").textContent = stage.number === 30 ? c("finaleBody") : c("resultBody");
    $("resultStats").textContent = c("resultStats", { number: stage.number, checks: state.checks, count: state.completed.length });
    const reward = $("checkpointReward");
    if (stage.checkpoint && state.checkpointGrant > 0) {
      reward.hidden = false;
      reward.textContent = c("checkpointReward", { count: state.checkpointGrant, total: state.lens });
    } else {
      reward.hidden = true;
      reward.textContent = "";
    }
    $("resultNextBtn").disabled = stage.number >= 30;
  }

  function resetBoard() {
    state.board.fill(0);
    clearFeedback();
    renderGrid(currentStage());
  }

  function returnToStages() {
    $("leaveDialog").hidden = true;
    $("resultPanel").hidden = true;
    $("battlePanel").hidden = false;
    $("battlePanel").inert = false;
    state.resultVisible = false;
    setScreen("stage");
  }

  function openLeave() {
    if (state.screen !== "battle") return;
    if (state.resultVisible) return returnToStages();
    $("battlePanel").inert = true;
    $("leaveDialog").hidden = false;
    $("continueBtn").focus();
  }

  function closeLeave({ focus = true } = {}) {
    if ($("leaveDialog").hidden) return;
    $("leaveDialog").hidden = true;
    $("battlePanel").inert = false;
    if (focus) $("battleBackBtn").focus();
  }

  function toggleSound() {
    state.sound = !state.sound;
    window.WeightPlayAudio?.setEnabled?.(state.sound);
    applyLocale();
  }

  function toggleSettings() {
    const panel = $("settingsPanel");
    const open = panel.hidden;
    panel.hidden = !open;
    $("mainSettingsBtn").setAttribute("aria-expanded", String(open));
  }

  function populateLocales() {
    const select = $("languageSelect");
    localeKeys.forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = locales.en.languageNames[key] || key;
      select.append(option);
    });
    select.value = state.locale;
    select.addEventListener("change", () => {
      state.locale = select.value;
      STORAGE.set("weightplay-habitat-counts-locale", state.locale);
      applyLocale();
    });
  }

  function moveGridFocus(event) {
    const origin = event.target.closest(".cell");
    if (!origin) return;
    const keyMap = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -1, ArrowRight: 1 };
    if (!(event.key in keyMap)) return;
    event.preventDefault();
    const size = currentStage().size;
    const index = Number(origin.dataset.cell);
    let next = index;
    const delta = event.key === "ArrowUp" ? -size : event.key === "ArrowDown" ? size : keyMap[event.key];
    while (true) {
      const candidate = next + delta;
      if (candidate < 0 || candidate >= size * size) return;
      if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && Math.floor(candidate / size) !== Math.floor(index / size)) return;
      next = candidate;
      const target = $("habitatGrid").querySelector(`[data-cell="${next}"]`);
      if (target && !target.disabled) { target.focus(); return; }
    }
  }

  state.locale = queryLocale();
  document.addEventListener("DOMContentLoaded", () => {
    const stageTab = document.querySelector('[data-wp-stage-tab="stages"]');
    if (stageTab) stageTab.dataset.copy = "stages";
    populateLocales();
    applyLocale();
    renderMain();
    $("habitatGrid").addEventListener("keydown", moveGridFocus);
    $("startBtn").addEventListener("click", startGame);
    $("mapBtn").addEventListener("click", () => setScreen("stage"));
    $("stageBackBtn").addEventListener("click", () => setScreen("main"));
    $("battleBackBtn").addEventListener("click", openLeave);
    $("checkBtn").addEventListener("click", checkBoard);
    $("clearBtn").addEventListener("click", resetBoard);
    $("resultMapBtn").addEventListener("click", returnToStages);
    $("resultNextBtn").addEventListener("click", () => {
      if (!$("resultNextBtn").disabled && state.roundIndex < stages.length - 1) startStage(state.roundIndex + 1);
    });
    $("resultReplayBtn").addEventListener("click", () => startStage(state.roundIndex));
    $("continueBtn").addEventListener("click", () => closeLeave());
    $("confirmLeaveBtn").addEventListener("click", returnToStages);
    $("leaveDialog").addEventListener("keydown", (event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closeLeave(); return; }
      if (event.key !== "Tab") return;
      const controls = [$("continueBtn"), $("confirmLeaveBtn")];
      const index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); controls.at(-1).focus(); }
      else if (!event.shiftKey && index === controls.length - 1) { event.preventDefault(); controls[0].focus(); }
    });
    $("mainSettingsBtn").addEventListener("click", toggleSettings);
    $("closeSettingsBtn").addEventListener("click", toggleSettings);
    $("soundBtn").addEventListener("click", toggleSound);
    $("battleSoundBtn").addEventListener("click", toggleSound);
  });

  window.ANIMAL_HABITAT_COUNTS_TEST = { stages, startGame, startStage, checkBoard, state, saveProgress, readProgress };
})();
