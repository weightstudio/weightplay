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
  const state = { locale: COPY["en"] ? "en" : LOCALES[0], record: 0, solved: 0, selected: null, accepted: false, sound: true, result: false };

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
  function track(name, payload = {}) { window.WonderAnalytics?.track?.(name, { game_id: "animal-footprint-folio", game_version: "v1", interface_version: 6, ...payload }); }
  function setScreen(name) {
    $("#mainScreen").classList.toggle("active", name === "main");
    $("#battleScreen").classList.toggle("active", name === "battle");
    const guide = document.querySelector("[data-wp-game-guide]");
    if (guide) guide.hidden = name !== "main";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
  function applyCopy() {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.title = `${t("title")} | WeightPlay`;
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("#locale").setAttribute("aria-label", t("language"));
    $("#settingsButton").setAttribute("aria-label", t("settings"));
    $("#soundButton").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("#soundButton").setAttribute("aria-pressed", String(state.sound));
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
    state.accepted = true;
    state.solved = Math.max(state.solved, state.record + 1);
    renderRecord();
    track("footprint_record_complete", { record: state.record + 1 });
  }
  function nextRecord() {
    if (!state.accepted) return;
    if (state.record >= RECORDS.length - 1) {
      state.result = true;
      renderResult();
      track("footprint_folio_complete", { solved: state.solved });
      return;
    }
    state.record += 1;
    state.selected = null;
    state.accepted = false;
    renderRecord();
    track("footprint_record_start", { record: state.record + 1 });
  }
  function start() {
    state.record = 0; state.solved = 0; state.selected = null; state.accepted = false; state.result = false;
    setScreen("battle"); renderRecord(); renderResult(); track("footprint_folio_start");
  }
  function home() { state.result = false; setScreen("main"); applyCopy(); track("footprint_folio_home"); }

  $("#startButton").addEventListener("click", start);
  $("#replayButton").addEventListener("click", start);
  $("#homeButton").addEventListener("click", home);
  $("#battleBack").addEventListener("click", home);
  $("#confirmButton").addEventListener("click", confirm);
  $("#continueButton").addEventListener("click", nextRecord);
  $("#guideButton").addEventListener("click", () => document.querySelector("[data-wp-game-guide]")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  $("#settingsButton").addEventListener("click", () => { const popover = $("#settingsPopover"); const open = popover.hidden; popover.hidden = !open; $("#settingsButton").setAttribute("aria-expanded", String(open)); });
  $("#soundButton").addEventListener("click", () => { state.sound = !state.sound; applyCopy(); });
  $("#locale").value = state.locale;
  $("#locale").addEventListener("change", (event) => { state.locale = event.target.value; applyCopy(); });
  window.__ANIMAL_FOOTPRINT_FOLIO_TEST__ = { state, records: RECORDS, start, selectMarker, confirm, nextRecord };
  applyCopy();
})();
