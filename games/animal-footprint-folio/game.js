(() => {
  "use strict";
  const COPY = window.FOOTPRINT_FOLIO_LOCALES || {};
  const LOCALES = Object.keys(COPY);
  const MARKERS = {
    leaf: { label: "markerLeaf", shape: "<path d='M31 5C15 8 7 18 9 34c2 14 14 20 27 19 11-1 17-9 17-19C52 17 43 8 31 5Z' fill='none' stroke='currentColor' stroke-width='4'/><path d='M14 43 45 14' fill='none' stroke='currentColor' stroke-width='4' stroke-linecap='round'/><path d='m28 31 10 3M22 38l10 3' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round'/>" },
    ripple: { label: "markerRipple", shape: "<path d='M7 23c8-14 16 14 24 0s16 14 24 0M7 40c8-14 16 14 24 0s16 14 24 0' fill='none' stroke='currentColor' stroke-width='4' stroke-linecap='round'/>" },
    diamond: { label: "markerDiamond", shape: "<path d='m31 5 22 26-22 22L9 31 31 5Z' fill='none' stroke='currentColor' stroke-width='4' stroke-linejoin='round'/><path d='M9 31h44M31 5v48' fill='none' stroke='currentColor' stroke-width='3' opacity='.55'/>" },
    dot: { label: "markerDot", shape: "<circle cx='31' cy='31' r='21' fill='none' stroke='currentColor' stroke-width='4'/><circle cx='31' cy='31' r='7' fill='currentColor'/><path d='M31 4v8M31 50v8' stroke='currentColor' stroke-width='3' stroke-linecap='round'/>" },
    arc: { label: "markerArc", shape: "<path d='M8 43c4-25 18-36 44-36M16 53c4-20 15-29 35-30' fill='none' stroke='currentColor' stroke-width='5' stroke-linecap='round'/><circle cx='9' cy='44' r='4' fill='currentColor'/><circle cx='52' cy='8' r='4' fill='currentColor'/>" },
    star: { label: "markerStar", shape: "<path d='m31 5 7 17 18 1-14 12 5 18-16-10-16 10 5-18L6 23l18-1 7-17Z' fill='none' stroke='currentColor' stroke-width='4' stroke-linejoin='round'/>" }
  };
  const RECORDS = [
    { title: "record1", sequence: ["leaf", "ripple", null, "ripple", "leaf"], correct: "ripple", options: ["ripple", "dot", "diamond"] },
    { title: "record2", sequence: ["diamond", "dot", null, "dot", "diamond"], correct: "dot", options: ["leaf", "dot", "star"] },
    { title: "record3", sequence: ["arc", "star", null, "star", "arc"], correct: "star", options: ["ripple", "arc", "star"] }
  ];
  const $ = (selector) => document.querySelector(selector);
  const initialLocale = window.__WEIGHTPLAY_ROUTE_LOCALE__ && COPY[window.__WEIGHTPLAY_ROUTE_LOCALE__]
    ? window.__WEIGHTPLAY_ROUTE_LOCALE__
    : COPY["en"] ? "en" : LOCALES[0];
  const state = { locale: initialLocale, record: 0, solved: 0, selected: null, accepted: false, sound: true, result: false };

  function t(key, values = {}) {
    const copy = COPY[state.locale] || COPY.en || {};
    let value = copy[key] ?? COPY.en?.[key] ?? key;
    Object.entries(values).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  }
  function markerSvg(key, extra = "") {
    const marker = MARKERS[key];
    return `<span class="marker-icon marker-atlas marker-atlas-${key} ${extra}" aria-hidden="true" data-marker-art="atlas"></span>`;
  }
  function track(name, payload = {}) { window.WonderAnalytics?.track?.(name, { game_id: "animal-footprint-folio", game_version: "v6", interface_version: 6, ...payload }); }
  function syncSharedSettingsIds() {
    const host = document.querySelector(".wp-shell-settings");
    if (host) document.querySelector(".wp-shell-locale-source")?.classList.remove("wp-shell-locale-source");
    const button = host?.querySelector(".wp-shell-settings-button");
    const popover = host?.querySelector(".wp-shell-settings-popover");
    if (!button) return;
    // The shared control is the sole Settings owner in both scenes. The
    // Battle identity keeps lifecycle probes stable without a dead duplicate.
    button.id = document.body.dataset.screen === "battle" ? "battleSettingsButton" : "settingsButton";
    button.hidden = false;
    button.removeAttribute("aria-hidden");
    button.tabIndex = 0;
    if (popover) popover.id = "settingsPopover";
  }
  function syncSharedSettingsPlacement(name) {
    const host = document.querySelector(".wp-shell-settings");
    const target = name === "main"
      ? document.querySelector("#mainScreen .main-header")
      : document.querySelector("#battleScreen .battle-header");
    if (!host || !target) return;
    if (host.parentElement !== target) target.append(host);
    if (name === "main") target.classList.add("wp-shell-header", "wp-main-shell-header");
    host.hidden = false;
  }
  function setScreen(name) {
    const mainScreen = $("#mainScreen");
    const battleScreen = $("#battleScreen");
    mainScreen.classList.toggle("active", name === "main");
    battleScreen.classList.toggle("active", name === "battle");
    // Hidden is the immutable scene signal consumed by the shared shell. Set
    // it in the same task as the class toggle so lifecycle probes never see
    // both roots as visible during the handoff frame.
    mainScreen.hidden = name !== "main";
    battleScreen.hidden = name !== "battle";
    // Mirror the shell's logical state synchronously. The standard shell also
    // reconciles these classes from its observer, but keeping the body/root
    // lock in step with data-screen prevents a transient frame where both
    // scene roots are hidden (or the old Main edge remains scrollable).
    document.body.classList.toggle("wp-shell-main-active", name === "main");
    document.body.classList.toggle("wp-shell-battle-active", name === "battle");
    document.body.classList.toggle("wp-logical-battle-active", name === "battle");
    document.documentElement.classList.toggle("wp-shell-main-flow", name === "main");
    document.documentElement.classList.toggle("wp-shell-active-play", name === "battle");
    if (name === "battle") primeBattleReserve();
    syncSharedSettingsPlacement(name);
    const flowOwner = mainScreen.closest("main");
    if (name === "main") {
      flowOwner?.classList.add("wp-standard-main-flow-owner");
      mainScreen.classList.add("wp-standard-main-flow-node");
      const composition = mainScreen.querySelector(".wp-standard-main-composition");
      if (flowOwner && composition) {
        const requiredHeight = Math.ceil(composition.getBoundingClientRect().bottom - flowOwner.getBoundingClientRect().top + 8);
        flowOwner.style.setProperty("--wp-main-flow-min-height", `${requiredHeight}px`);
      }
    } else {
      flowOwner?.style.removeProperty("--wp-main-flow-min-height");
      flowOwner?.classList.remove("wp-standard-main-flow-owner");
      mainScreen.classList.remove("wp-standard-main-flow-node");
    }
    document.body.dataset.screen = name;
    const guide = document.querySelector("[data-wp-game-guide]");
    if (guide) guide.hidden = name !== "main";
    if (name === "main") {
      const mainComposition = mainScreen.querySelector(".wp-standard-main-composition");
      if (mainComposition) {
        mainComposition.scrollTop = 0;
        mainComposition.scrollLeft = 0;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    syncSharedSettingsIds();
    window.WeightPlayBattleCanvas?.sync?.();
    requestAnimationFrame(syncSharedSettingsIds);
  }
  function applyCopy() {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.title = `${t("title")} | WeightPlay`;
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("#locale")?.setAttribute("aria-label", t("language"));
    document.querySelector(".wp-shell-settings-button")?.setAttribute("aria-label", t("settings"));
    $("#battleBack")?.setAttribute("aria-label", t("back"));
    $(".poster").setAttribute("alt", t("coverAlt"));
    renderRecord();
    renderResult();
  }
  function renderRecord() {
    const record = RECORDS[state.record];
    $("#recordCount").textContent = t("record", { n: state.record + 1 });
    $("#recordEyebrow").textContent = t("eyebrow");
    $("#recordTitle").textContent = t(record.title);
    $("#recordInstruction").textContent = t("instruction");
    $("#solvedCount").textContent = String(state.solved);
    const board = $("#trailBoard");
    board.setAttribute("aria-label", t("instruction"));
    board.innerHTML = record.sequence.map((key, index) => `<div class="trail-card ${key === null ? "missing" : ""}">${key ? markerSvg(key) : markerSvg(record.correct, "missing-marker")}<small>${key ? t("clue", { n: index + 1 }) : t("gap")}</small></div>`).join("");
    const choices = $("#choices");
    choices.innerHTML = record.options.map((key) => `<button class="choice ${state.selected === key ? "selected" : ""}" type="button" data-marker="${key}" ${state.accepted ? "disabled" : ""} aria-pressed="${state.selected === key}">${markerSvg(key)}<strong>${t(MARKERS[key].label)}</strong></button>`).join("");
    choices.querySelectorAll(".choice").forEach((button) => button.addEventListener("click", () => selectMarker(button.dataset.marker)));
    $("#confirmButton").disabled = state.selected === null || state.accepted;
    $("#continueButton").hidden = !state.accepted;
    $("#confirmButton").hidden = state.accepted;
    $("#feedback").textContent = state.accepted ? t("correct") : state.selected ? t("selected") : "";
  }
  function renderResult() {
    const card = $("#resultCard");
    card.hidden = !state.result;
    if (!state.result) return;
    $("#resultTitle").textContent = t("resultTitle");
    $("#resultCopy").textContent = t("resultCopy");
  }
  function resetBattleScroll() {
    const battle = $("#battleScreen");
    if (!battle) return;
    battle.scrollTop = 0;
    battle.scrollLeft = 0;
    requestAnimationFrame(() => { battle.scrollTop = 0; battle.scrollLeft = 0; });
  }
  function primeBattleReserve() {
    const root = $("#battleScreen");
    // Keep the physical General reserve outside the transformed Battle root.
    // A fixed descendant of the scaled canvas inherits that transform and
    // becomes too small or drifts on wide viewports.
    const reserve = document.querySelector(".battle-ad-reserve");
    if (!root || !reserve) return;
    const viewportWidth = Number(document.documentElement.clientWidth || window.innerWidth || 0);
    const viewportHeight = Number(document.documentElement.clientHeight || window.innerHeight || 0);
    const availableWidth = Math.max(1, Math.min(viewportWidth, 920));
    const availableHeight = Math.max(1, viewportHeight - (window.WeightPlayLayout?.reserveHeight ?? 0));
    const landscape = availableWidth / availableHeight >= 1.5;
    const minimumWidth = landscape ? 760 : 390;
    const minimumHeight = landscape ? 334 : 788;
    const scale = Math.max(0.01, Math.min(availableWidth / minimumWidth, availableHeight / minimumHeight));
    const logicalWidth = availableWidth / scale;
    const logicalHeight = availableHeight / scale;
    const left = Math.max(0, (viewportWidth - availableWidth) / 2);
    root.dataset.wpLogicalBattleCanvas = `${logicalWidth.toFixed(3)}x${logicalHeight.toFixed(3)}`;
    const setRoot = (property, value) => root.style.setProperty(property, value, "important");
    setRoot("position", "fixed");
    setRoot("inset", `0px auto auto ${left}px`);
    setRoot("top", "0px");
    setRoot("left", `${left}px`);
    setRoot("width", `${logicalWidth}px`);
    setRoot("min-width", `${logicalWidth}px`);
    setRoot("max-width", `${logicalWidth}px`);
    setRoot("height", `${logicalHeight}px`);
    setRoot("min-height", `${logicalHeight}px`);
    setRoot("max-height", `${logicalHeight}px`);
    setRoot("margin", "0px");
    setRoot("transform", `scale(${scale})`);
    setRoot("transform-origin", "top left");
    setRoot("overflow", "hidden");
    root.scrollTop = 0;
    root.scrollLeft = 0;
    // The shared Battle runtime finalizes this physical reserve on its next
    // frame. Prime the same boundary synchronously so every activation has a
    // stable 56px edge before its first interaction.
    const setReserve = (property, value) => reserve.style.setProperty(property, value, "important");
    setReserve("position", "fixed");
    setReserve("inset", `${availableHeight}px auto auto ${left}px`);
    setReserve("top", `${availableHeight}px`);
    setReserve("bottom", "auto");
    setReserve("left", `${left}px`);
    setReserve("right", "auto");
    setReserve("width", `${availableWidth}px`);
    setReserve("height", "56px");
  }
  function selectMarker(key) {
    if (state.accepted) return;
    state.selected = key;
    renderRecord();
    track("footprint_marker_select", { record: state.record + 1, marker: key });
  }
  function confirm() {
    if (!state.selected || state.accepted) return;
    if (state.selected !== RECORDS[state.record].correct) {
      $("#feedback").textContent = t("wrong");
      track("footprint_marker_mismatch", { record: state.record + 1, marker: state.selected });
      return;
    }
    document.activeElement?.blur?.();
    state.accepted = true;
    state.solved = Math.max(state.solved, state.record + 1);
    renderRecord();
    resetBattleScroll();
    track("footprint_record_complete", { record: state.record + 1 });
  }
  function nextRecord() {
    if (!state.accepted) return;
    document.activeElement?.blur?.();
    if (state.record >= RECORDS.length - 1) {
      state.result = true;
      renderResult();
      resetBattleScroll();
      track("footprint_folio_complete", { solved: state.solved });
      return;
    }
    state.record += 1;
    state.selected = null;
    state.accepted = false;
    renderRecord();
    resetBattleScroll();
    track("footprint_record_start", { record: state.record + 1 });
  }
  function start() {
    state.record = 0; state.solved = 0; state.selected = null; state.accepted = false; state.result = false;
    setScreen("battle"); renderRecord(); renderResult(); window.WeightPlayBattleCanvas?.sync?.(); track("footprint_folio_start");
  }
  function home() { state.result = false; setScreen("main"); applyCopy(); track("footprint_folio_home"); }

  $("#startButton").addEventListener("click", start);
  $("#replayButton").addEventListener("click", start);
  $("#homeButton").addEventListener("click", home);
  $("#battleBack").addEventListener("click", home);
  $("#confirmButton").addEventListener("click", confirm);
  $("#continueButton").addEventListener("click", nextRecord);
  $("#guideButton").addEventListener("click", () => document.querySelector("[data-wp-game-guide]")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  window.addEventListener("weightplay:shell-sync", syncSharedSettingsIds);
  window.addEventListener("wonder:locale-change", (event) => { state.locale = event.detail?.locale || window.__WEIGHTPLAY_ROUTE_LOCALE__ || state.locale; applyCopy(); });
  $("#locale").value = state.locale;
  $("#locale").addEventListener("change", (event) => { state.locale = event.target.value; applyCopy(); });
  syncSharedSettingsIds();
  window.__ANIMAL_FOOTPRINT_FOLIO_TEST__ = { state, records: RECORDS, start, selectMarker, confirm, nextRecord };
  applyCopy();
})();
