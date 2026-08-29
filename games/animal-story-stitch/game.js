(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const locales = window.STORY_STITCH_LOCALES || {};
  const tales = [
    { id: 1, cards: [{ key: "card1a", icon: "🌰" }, { key: "card1b", icon: "🌱" }, { key: "card1c", icon: "🌳" }], solution: [0, 1, 2] },
    { id: 2, cards: [{ key: "card2a", icon: "🌧️" }, { key: "card2b", icon: "💧" }, { key: "card2c", icon: "🌈" }], solution: [0, 1, 2] },
    { id: 3, cards: [{ key: "card3a", icon: "🌰" }, { key: "card3b", icon: "🪺" }, { key: "card3c", icon: "🤝" }], solution: [0, 1, 2] },
  ];
  let locale = localStorage.getItem("weightplay-story-stitch-locale") || "en";
  if (!locales[locale]) locale = "en";
  let sound = localStorage.getItem("weightplay-story-stitch-sound") !== "off";
  let taleIndex = 0;
  let order = [0, 1, 2];
  let selected = 0;
  let solved = new Set();
  let checks = 0;
  const copy = (key, vars = {}) => Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || (locales.en[key] || key));
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `story_stitch_${name}`, tale: taleIndex + 1, ...data }); };
  function applyLocale() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy(node.dataset.i18n); });
    $("settingsBtn").setAttribute("aria-label", copy("settings")); $("backBtn").setAttribute("aria-label", copy("back")); $("closeSettings").setAttribute("aria-label", copy("close")); $("localeSelect").setAttribute("aria-label", copy("language"));
    $("soundBtn").textContent = sound ? copy("on") : copy("off"); $("soundBtn").setAttribute("aria-pressed", String(sound));
    $("best").textContent = copy("best", { count: bestText() });
    renderStages(); renderBattle(); renderResult();
  }
  function bestText() { const best = Number(localStorage.getItem("weightplay-story-stitch-best-v1") || 0); return best ? best : "—"; }
  function show(screen) { document.querySelectorAll("[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; }); $("settingsPanel").hidden = true; $("backBtn").hidden = screen === "main"; }
  function renderStages() { const root = $("stageList"); if (!root) return; root.replaceChildren(); tales.forEach((tale, index) => { const button = document.createElement("button"); button.className = "stage-card"; button.type = "button"; button.dataset.index = index; button.innerHTML = `<span><strong>${copy(`tale${index + 1}`)}</strong><small>${copy(`hint${index + 1}`)}</small></span><span class="arrow">${solved.has(index) ? "✓" : "→"}</span>`; button.addEventListener("click", () => startTale(index)); root.appendChild(button); }); }
  function startTale(index) { taleIndex = index; order = [0, 1, 2]; selected = 0; checks = 0; show("battle"); renderBattle(); announce("start"); }
  function renderBattle() { const tale = tales[taleIndex]; if (!tale || !$("storyRail")) return; $("battleTitle").textContent = copy(`tale${taleIndex + 1}`); $("progressPill").textContent = `${taleIndex + 1} / ${tales.length}`; $("prompt").textContent = copy(`hint${taleIndex + 1}`) + " " + copy("prompt"); const rail = $("storyRail"); rail.replaceChildren(); order.forEach((cardIndex, position) => { const data = tale.cards[cardIndex]; const button = document.createElement("button"); button.type = "button"; button.className = "story-card"; button.setAttribute("role", "listitem"); button.setAttribute("aria-selected", String(position === selected)); button.innerHTML = `<span class="num">${position + 1}</span><span class="emoji" aria-hidden="true">${data.icon}</span><strong>${copy(data.key)}</strong>`; button.addEventListener("click", () => { selected = position; renderBattle(); }); rail.appendChild(button); }); $("selection").textContent = copy("selected", { name: copy(tale.cards[order[selected]].key) }); $("status").textContent = ""; $("status").className = "status"; }
  function move(delta) { const next = selected + delta; if (next < 0 || next >= order.length) return; [order[selected], order[next]] = [order[next], order[selected]]; selected = next; renderBattle(); announce("reorder"); }
  function check() { checks += 1; const tale = tales[taleIndex]; if (order.every((value, index) => value === tale.solution[index])) { solved.add(taleIndex); $("status").textContent = copy("correct"); $("status").className = "status good"; announce("correct", { checks }); setTimeout(() => { show("result"); renderResult(); }, 380); } else { $("status").textContent = copy("wrong"); $("status").className = "status try"; announce("wrong", { checks }); } }
  function renderResult() { if (!$("resultText")) return; const complete = solved.size === tales.length; $("resultTitle").textContent = complete ? copy("resultTitle") : copy("finished"); $("resultText").textContent = copy("resultText", { count: solved.size }); $("nextBtn").hidden = complete; $("resultMapBtn").hidden = !complete; if (complete) { const old = Number(localStorage.getItem("weightplay-story-stitch-best-v1") || 0); if (!old || checks < old) localStorage.setItem("weightplay-story-stitch-best-v1", String(checks)); } }
  function next() { const nextIndex = taleIndex + 1; if (nextIndex < tales.length) startTale(nextIndex); else show("stage"); renderStages(); }
  function toggleSettings(open) { $("settingsPanel").hidden = !open; }
  function bind() { $("startBtn").addEventListener("click", () => startTale(0)); $("mapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("nextBtn").addEventListener("click", next); $("checkBtn").addEventListener("click", check); $("clearBtn").addEventListener("click", () => { order = [0, 1, 2]; selected = 0; renderBattle(); }); $("upBtn").addEventListener("click", () => move(-1)); $("downBtn").addEventListener("click", () => move(1)); $("settingsBtn").addEventListener("click", () => toggleSettings(true)); $("closeSettings").addEventListener("click", () => toggleSettings(false)); $("soundBtn").addEventListener("click", () => { sound = !sound; localStorage.setItem("weightplay-story-stitch-sound", sound ? "on" : "off"); applyLocale(); }); $("localeSelect").addEventListener("change", (event) => { locale = event.target.value; localStorage.setItem("weightplay-story-stitch-locale", locale); applyLocale(); }); $("backBtn").addEventListener("click", () => show("main")); }
  function boot() { bind(); $("localeSelect").value = locale; $("loading").hidden = true; $("app").hidden = false; show("main"); applyLocale(); announce("loaded"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
