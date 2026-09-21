(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const locales = window.ANIMAL_TIDE_TALLY_LOCALES || {};
  const storage = { get(key) { try { return window.localStorage?.getItem(key) || null; } catch (_) { return null; } }, set(key, value) { try { window.localStorage?.setItem(key, value); } catch (_) { /* restricted storage is non-blocking */ } } };
  // Content successor: six authored arcs × five notes.  The arithmetic is
  // deliberately data-driven so each note has a distinct fixture rather than
  // replaying the old three-note prototype.
  const notes = [
    { id: 1, arc: 1, mode: "flow", start: 2, arrivals: [3], departures: [1], target: 4, answers: [3, 4, 5] },
    { id: 2, arc: 1, mode: "flow", start: 1, arrivals: [4], departures: [2], target: 3, answers: [2, 3, 4] },
    { id: 3, arc: 1, mode: "flow", start: 3, arrivals: [2], departures: [1, 1], target: 3, answers: [2, 3, 4] },
    { id: 4, arc: 1, mode: "flow", start: 2, arrivals: [5], departures: [3], target: 4, answers: [3, 4, 5] },
    { id: 5, arc: 1, mode: "flow", start: 4, arrivals: [3], departures: [2], target: 5, answers: [4, 5, 6], checkpoint: true },
    { id: 6, arc: 2, mode: "waves", start: 1, arrivals: [2, 3], departures: [1], target: 5, answers: [4, 5, 6] },
    { id: 7, arc: 2, mode: "waves", start: 2, arrivals: [1, 4], departures: [2, 1], target: 4, answers: [3, 4, 5] },
    { id: 8, arc: 2, mode: "waves", start: 3, arrivals: [3, 2], departures: [2, 2], target: 4, answers: [3, 4, 5] },
    { id: 9, arc: 2, mode: "waves", start: 0, arrivals: [5, 1], departures: [2], target: 4, answers: [3, 4, 5] },
    { id: 10, arc: 2, mode: "waves", start: 2, arrivals: [4, 3], departures: [2, 1], target: 6, answers: [5, 6, 7], checkpoint: true },
    { id: 11, arc: 3, mode: "missing", start: 2, departures: [1], final: 5, target: 4, answers: [3, 4, 5] },
    { id: 12, arc: 3, mode: "missing", start: 3, departures: [2, 1], final: 6, target: 6, answers: [5, 6, 7] },
    { id: 13, arc: 3, mode: "missing", start: 1, departures: [1, 2], final: 5, target: 7, answers: [6, 7, 8] },
    { id: 14, arc: 3, mode: "missing", start: 4, departures: [3], final: 8, target: 7, answers: [6, 7, 8] },
    { id: 15, arc: 3, mode: "missing", start: 2, departures: [2, 2], final: 9, target: 11, answers: [10, 11, 12], checkpoint: true },
    { id: 16, arc: 4, mode: "compare", left: 7, right: 3, target: 4, answers: [3, 4, 5] },
    { id: 17, arc: 4, mode: "compare", left: 5, right: 8, target: 3, answers: [2, 3, 4] },
    { id: 18, arc: 4, mode: "compare", left: 9, right: 4, target: 5, answers: [4, 5, 6] },
    { id: 19, arc: 4, mode: "compare", left: 6, right: 11, target: 5, answers: [4, 5, 6] },
    { id: 20, arc: 4, mode: "compare", left: 12, right: 5, target: 7, answers: [6, 7, 8], checkpoint: true },
    { id: 21, arc: 5, mode: "two-step", start: 2, arrivals: [3, 2], departures: [1, 1], target: 5, answers: [4, 5, 6] },
    { id: 22, arc: 5, mode: "two-step", start: 1, arrivals: [4, 2], departures: [2, 1], target: 4, answers: [3, 4, 5] },
    { id: 23, arc: 5, mode: "two-step", start: 3, arrivals: [2, 5], departures: [1, 2], target: 7, answers: [6, 7, 8] },
    { id: 24, arc: 5, mode: "two-step", start: 2, arrivals: [5, 3], departures: [2, 1], target: 7, answers: [6, 7, 8] },
    { id: 25, arc: 5, mode: "two-step", start: 4, arrivals: [3, 4], departures: [2, 2], target: 7, answers: [6, 7, 8], checkpoint: true },
    { id: 26, arc: 6, mode: "interference", start: 3, arrivals: [4], departures: [1], interference: 1, target: 5, answers: [4, 5, 6] },
    { id: 27, arc: 6, mode: "interference", start: 2, arrivals: [5, 2], departures: [1, 2], interference: 1, target: 5, answers: [4, 5, 6] },
    { id: 28, arc: 6, mode: "interference", start: 1, arrivals: [3, 4], departures: [2, 1], interference: 2, target: 3, answers: [2, 3, 4] },
    { id: 29, arc: 6, mode: "interference", start: 4, arrivals: [6], departures: [2], interference: 3, target: 5, answers: [4, 5, 6] },
    { id: 30, arc: 6, mode: "interference", start: 5, arrivals: [4, 3], departures: [2, 2], interference: 1, target: 7, answers: [6, 7, 8], checkpoint: true }
  ];
  const equations = { en: "arrivals − departures = resting", "zh-Hant": "帶來的 − 帶走的 = 留下的", "zh-Hans": "带来的 − 带走的 = 留下的", ja: "届いた数 − 出た数 = 残った数", ko: "온 조개 − 떠난 조개 = 남은 조개", es: "llegadas − salidas = quedan", "pt-BR": "chegadas − partidas = restantes", fr: "arrivées − départs = restantes", de: "Ankünfte − Abgänge = übrig", it: "arrivi − partenze = rimaste", ru: "пришли − ушли = осталось", hi: "आईं − गईं = बचीं", ar: "الوافدة − المغادرة = الباقية" };
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeLocale = routeLocaleMap[String(window.location.pathname).split("/").filter(Boolean)[0]?.toLowerCase()] || document.documentElement.lang;
  let locale = locales[routeLocale] ? routeLocale : (storage.get("weightplay-animal-tide-tally-locale") || "en");
  if (!locales[locale]) locale = "en";
  let sound = storage.get("weightplay-animal-tide-tally-sound") !== "off";
  let noteIndex = 0; let checks = 0; let sessionChecks = 0; let solved = new Set(); let feedback = ""; let currentScreen = "main";
  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `animal_tide_tally_${name}`, note: noteIndex + 1, checks, ...data }); };
  const bestKey = "weightplay-animal-tide-tally-best-v6";
  const bestValue = () => Number(storage.get(bestKey) || 0) || "—";
  const sum = (values = []) => values.length ? values.join(" + ") : "0";
  function noteEquation(note) {
    if (note.mode === "missing") return `${note.start} + ? − ${sum(note.departures)} = ${note.final}`;
    if (note.mode === "compare") return `|${note.left} − ${note.right}| = ?`;
    if (note.mode === "two-step") return `(${note.start} + ${note.arrivals[0]} − ${note.departures[0]}) + ${note.arrivals[1]} − ${note.departures[1]} = ?`;
    if (note.mode === "interference") return `${note.start} + ${sum(note.arrivals)} − ${sum(note.departures)} − ${note.interference} = ?`;
    return `${note.start} + ${sum(note.arrivals)} − ${sum(note.departures)} = ?`;
  }
  const noteSummary = (note) => `${copy("arc")} ${note.arc} · ${copy("mode_" + note.mode)} · ${noteEquation(note)}${note.checkpoint ? ` · ${copy("checkpoint")}` : ""}`;
  function show(screen) { currentScreen = screen; document.body.dataset.screen = screen; document.querySelectorAll("[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; }); $("gameGuide").hidden = screen !== "main"; $("settingsPanel").hidden = true; $("settingsBtn")?.setAttribute("aria-expanded", "false"); window.scrollTo(0, 0); }
  function renderStatic() { document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; window.dispatchEvent(new CustomEvent("wonder:locale-change")); document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy(node.dataset.i18n); }); $("stageBackBtn").setAttribute("aria-label", copy("back")); $("battleBackBtn").setAttribute("aria-label", copy("back")); $("settingsBtn")?.setAttribute("aria-label", copy("settings")); $("stageInfoBtn")?.setAttribute("aria-label", copy("settings")); $("battleSoundBtn").setAttribute("aria-label", copy("sound")); $("closeSettings").setAttribute("aria-label", copy("close")); $("localeSelect").setAttribute("aria-label", copy("language")); $("soundBtn").textContent = sound ? copy("on") : copy("off"); $("soundBtn").setAttribute("aria-pressed", String(sound)); $("battleSoundBtn").setAttribute("aria-pressed", String(sound)); $("mainProgress").textContent = copy("progress", { count: solved.size, total: notes.length }); $("best").textContent = copy("best", { best: bestValue() }); renderStages(); renderBattle(); renderResult(); }
  function renderStages() { const root = $("stageList"); const choices = $("stageChoices"); if (!root || !choices) return; root.replaceChildren(); const current = notes[noteIndex] || notes[0]; const card = document.createElement("button"); card.type = "button"; card.className = "stage-card"; card.innerHTML = "<span><strong>" + copy("round") + " " + (noteIndex + 1) + "</strong><small>" + noteSummary(current) + "</small></span><span class=\"arrow\">→</span>"; card.addEventListener("click", () => startNote(noteIndex, true)); root.appendChild(card); choices.replaceChildren(); notes.forEach((note, index) => { const button = document.createElement("button"); button.type = "button"; button.className = `stage-choice${note.checkpoint ? " checkpoint" : ""}`; button.innerHTML = "<span><strong>" + copy("round") + " " + (index + 1) + (note.checkpoint ? " · ◆" : "") + "</strong><small>" + noteSummary(note) + "</small></span><span class=\"arrow\">" + (solved.has(index) ? "✓" : "→") + "</span>"; button.addEventListener("click", () => startNote(index, true)); choices.appendChild(button); }); }
  function renderBattle() { if (!$("answerGrid") || currentScreen !== "battle") return; const note = notes[noteIndex]; $("noteTitle").textContent = `${copy("round")} ${noteIndex + 1}`; $("progressPill").textContent = `${noteIndex + 1} / ${notes.length}`; $("prompt").textContent = copy("prompt"); $("story").textContent = noteSummary(note); $("equation").textContent = equations[locale] || equations.en; const root = $("answerGrid"); root.replaceChildren(); note.answers.forEach((value) => { const button = document.createElement("button"); button.type = "button"; button.className = `answer ${feedback === "correct" && value === note.target ? "chosen" : ""}`; button.setAttribute("aria-label", copy("answerLabel", { value })); button.textContent = String(value); button.addEventListener("click", () => choose(value)); root.appendChild(button); }); $("status").textContent = feedback ? copy(feedback) : ""; $("status").className = feedback === "correct" ? "status good" : feedback === "wrong" ? "status try" : "status"; }
  function choose(value) { if (feedback === "correct") return; checks += 1; sessionChecks += 1; const correct = value === notes[noteIndex].target; feedback = correct ? "correct" : "wrong"; announce("answer", { value, correct }); renderBattle(); if (correct) { solved.add(noteIndex); setTimeout(() => { show("result"); renderResult(); }, 280); } }
  function renderResult() { if (!$("resultText")) return; const complete = solved.size === notes.length; $("resultTitle").textContent = complete ? copy("resultTitle") : copy("resultLevel"); $("resultText").textContent = `${copy("progress", { count: solved.size, total: notes.length })} · ${copy("best", { best: bestValue() })}`; $("nextBtn").hidden = complete; $("resultMapBtn").hidden = !complete; if (complete) { const old = Number(storage.get(bestKey) || 0); if (!old || sessionChecks < old) storage.set(bestKey, String(sessionChecks)); $("resultText").textContent = `${copy("progress", { count: solved.size, total: notes.length })} · ${copy("best", { best: Math.min(old || sessionChecks, sessionChecks) })}`; } }
  function startNote(index, fromStage = false) { noteIndex = index; checks = 0; feedback = ""; if (index === 0 || fromStage) sessionChecks = 0; show("battle"); renderBattle(); announce("start"); }
  function nextNote() { const nextIndex = noteIndex + 1; if (nextIndex < notes.length) startNote(nextIndex); else { show("stage"); renderStages(); } }
  function goBack() { if (currentScreen === "battle") { show("stage"); renderStages(); } else if (currentScreen === "stage" || currentScreen === "result") show("main"); }
  function bind() { $("startBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("mapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("nextBtn").addEventListener("click", nextNote); $("resetBtn").addEventListener("click", () => { checks = 0; feedback = ""; renderBattle(); announce("reset"); }); $("stageBackBtn").addEventListener("click", () => { show("main"); renderStatic(); }); $("battleBackBtn").addEventListener("click", goBack); $("settingsBtn")?.addEventListener("click", () => { const open = $("settingsPanel").hidden; $("settingsPanel").hidden = !open; $("settingsBtn").setAttribute("aria-expanded", String(open)); }); $("stageInfoBtn")?.addEventListener("click", () => { $("settingsPanel").hidden = false; $("settingsBtn")?.setAttribute("aria-expanded", "true"); }); $("battleSoundBtn").addEventListener("click", () => { sound = !sound; storage.set("weightplay-animal-tide-tally-sound", sound ? "on" : "off"); renderStatic(); }); $("closeSettings")?.addEventListener("click", () => { $("settingsPanel").hidden = true; $("settingsBtn")?.setAttribute("aria-expanded", "false"); }); $("soundBtn")?.addEventListener("click", () => { sound = !sound; storage.set("weightplay-animal-tide-tally-sound", sound ? "on" : "off"); renderStatic(); }); $("localeSelect")?.addEventListener("change", (event) => { locale = event.target.value; storage.set("weightplay-animal-tide-tally-locale", locale); renderStatic(); }); }
  function boot() { bind(); $("localeSelect").value = locale; $("loading").hidden = true; $("app").hidden = false; show("main"); renderStatic(); announce("loaded"); }
  window.__ANIMAL_TIDE_TALLY_TEST__ = { notes, startNote, getState: () => ({ noteIndex, solved: [...solved], checks, screen: currentScreen, feedback }) };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());

undefined
