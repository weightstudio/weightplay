(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const locales = window.POCKET_POST_LOCALES || {};
  const routes = [
    { id: 1, name: "route1", cards: [{ sender: "sender1", habitat: "meadow" }, { sender: "sender2", habitat: "reef" }] },
    { id: 2, name: "route2", cards: [{ sender: "sender2", habitat: "reef" }, { sender: "sender3", habitat: "snow" }] },
    { id: 3, name: "route3", cards: [{ sender: "sender3", habitat: "snow" }, { sender: "sender1", habitat: "meadow" }] },
  ];

  let locale = localStorage.getItem("weightplay-pocket-post-locale") || "en";
  if (!locales[locale]) locale = "en";

  let sound = localStorage.getItem("weightplay-pocket-post-sound") !== "off";
  let routeIndex = 0;
  let browsedRouteIndex = routes.length - 1;
  let cardIndex = 0;
  let selected = null;
  let delivered = 0;
  let solved = new Set();
  let checks = 0;
  let battleDirty = false;
  let leaveOpen = false;

  let settlementPending = false;
  let settlementTimer = 0;
  let settlementDueAt = 0;
  let settlementRemaining = 0;
  let settlementResolver = null;

  const copy = (key, vars = {}) => Object.entries(vars).reduce(
    (out, [name, value]) => out.replaceAll(`{${name}}`, String(value)),
    (locales[locale] || locales.en)[key] || locales.en[key] || key,
  );

  const announce = (name, data = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: `pocket_post_${name}`,
      route: routeIndex + 1,
      card: cardIndex + 1,
      ...data,
    });
  };

  function bestText() {
    const best = Number(localStorage.getItem("weightplay-pocket-post-best-v2") || 0);
    return best || "—";
  }

  function highestUnlockedRouteIndex() {
    // Pocket Post v5 exposes all three authored routes; no lock system exists.
    return Math.max(0, routes.length - 1);
  }

  function closeLegacySettings() {
    const panel = $("settingsPanel");
    if (panel) panel.hidden = true;
  }

  function setResultState(active) {
    const play = $("battlePlay");
    const result = $("resultScreen");
    if (play) {
      play.hidden = active;
      play.inert = active;
    }
    if (result) {
      result.hidden = !active;
      result.inert = !active;
    }
    const canvas = document.querySelector(".battle-canvas");
    if (canvas) canvas.dataset.wpBattleSubstate = active ? "result" : "play";
  }

  function show(screen) {
    const nextScreen = screen === "result" ? "battle" : screen;
    document.body.dataset.screen = nextScreen;

    document.querySelectorAll("[data-screen]").forEach((node) => {
      const enabled = node.dataset.screen === nextScreen;
      node.hidden = !enabled;
      node.inert = !enabled;
      node.setAttribute("aria-hidden", String(!enabled));
    });

    closeLegacySettings();
    closeLeave(false, false);

    const mainBack = $("backBtn");
    if (mainBack) mainBack.hidden = nextScreen !== "main";

    setResultState(screen === "result");

    window.dispatchEvent(new CustomEvent("weightplay:screen-change-request", {
      detail: { screen: nextScreen, source: "animal-pocket-post" },
    }));
  }

  function stageCards() {
    return [...($("stageList")?.querySelectorAll(".stage-card") || [])];
  }

  function updateStageHighlight(index) {
    const bounded = Math.max(0, Math.min(routes.length - 1, Number(index) || 0));
    browsedRouteIndex = bounded;
    stageCards().forEach((card) => {
      const active = Number(card.dataset.stageIndex) === bounded;
      card.setAttribute("aria-current", String(active));
      card.setAttribute("aria-selected", String(active));
    });
  }

  function renderStages() {
    const root = $("stageList");
    if (!root) return;

    const byIndex = new Map(stageCards().map((card) => [Number(card.dataset.stageIndex), card]));
    routes.forEach((route, index) => {
      let button = byIndex.get(index);
      if (!button) {
        button = document.createElement("button");
        button.className = "stage-card";
        button.type = "button";
        button.setAttribute("role", "tab");
        button.setAttribute("data-wp-stage-card", "");
        button.setAttribute("data-wp-enter-battle", "");
        button.dataset.index = String(index);
        button.dataset.stageIndex = String(index);
        button.addEventListener("click", () => startRoute(index));
        root.appendChild(button);
      }

      const cleared = solved.has(index);
      button.innerHTML = `<span><strong>${copy("stageLabel", { number: index + 1 })} · ${copy(route.name)}</strong><small>${copy(`hint${index + 1}`)}</small><small class="stage-state">${cleared ? copy("stageCleared") : copy("stageOpen")}</small></span><span class="arrow" aria-hidden="true">${cleared ? "✓" : "→"}</span>`;
      button.setAttribute("aria-label", `${copy("stageLabel", { number: index + 1 })}: ${copy(route.name)}. ${cleared ? copy("stageCleared") : copy("stageOpen")}`);
      byIndex.delete(index);
    });

    byIndex.forEach((card) => card.remove());
    updateStageHighlight(browsedRouteIndex);
  }

  function openStage({ focusBack = false } = {}) {
    browsedRouteIndex = highestUnlockedRouteIndex();
    show("stage");
    renderStages();
    window.dispatchEvent(new Event("weightplay:stage-sync"));
    if (focusBack) $("stageBackBtn")?.focus({ preventScroll: true });
  }

  function resetBattleScroll() {
    const play = $("battlePlay");
    if (play) play.scrollTop = 0;
  }

  function resetSettlementState() {
    settlementPending = false;
    settlementTimer = 0;
    settlementDueAt = 0;
    settlementRemaining = 0;
    settlementResolver = null;
  }

  function clearSettlement() {
    if (settlementTimer) window.clearTimeout(settlementTimer);
    resetSettlementState();
  }

  function runSettlement() {
    const resolver = settlementResolver;
    resetSettlementState();
    resolver?.();
  }

  function scheduleSettlement(resolver, delay) {
    clearSettlement();
    settlementPending = true;
    settlementResolver = resolver;
    settlementRemaining = delay;
    settlementDueAt = performance.now() + delay;
    settlementTimer = window.setTimeout(runSettlement, delay);
  }

  function pauseSettlement() {
    if (!settlementPending || !settlementResolver || !settlementTimer) return;
    settlementRemaining = Math.max(0, settlementDueAt - performance.now());
    window.clearTimeout(settlementTimer);
    settlementTimer = 0;
    settlementDueAt = 0;
  }

  function resumeSettlement() {
    if (!settlementPending || !settlementResolver || settlementTimer) return;
    const delay = Math.max(0, settlementRemaining);
    settlementDueAt = performance.now() + delay;
    settlementTimer = window.setTimeout(runSettlement, delay);
  }

  function startRoute(index) {
    clearSettlement();
    routeIndex = index;
    browsedRouteIndex = index;
    cardIndex = 0;
    delivered = 0;
    selected = null;
    checks = 0;
    battleDirty = false;
    show("battle");
    resetBattleScroll();
    renderBattle();
    announce("start");
  }

  function mailbox(habitat) {
    const span = document.createElement("span");
    span.className = `mailbox ${habitat}`;
    span.setAttribute("aria-hidden", "true");
    return span;
  }

  function renderBattle() {
    const route = routes[routeIndex];
    const card = route && route.cards[cardIndex];
    if (!route || !card || !$("mailGrid")) return;

    $("routeTitle").textContent = copy(route.name);
    $("progressPill").textContent = `${routeIndex + 1} / ${routes.length}`;
    $("prompt").textContent = `${copy(`hint${routeIndex + 1}`)} ${copy("prompt")}`;
    $("sender").textContent = copy(card.sender);
    $("stamp").textContent = copy(card.habitat);
    $("selection").textContent = selected
      ? copy("selected", { name: copy(`box${selected[0].toUpperCase() + selected.slice(1)}`) })
      : "";

    const root = $("mailGrid");
    root.replaceChildren();
    ["meadow", "reef", "snow"].forEach((habitat) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mail-card";
      button.setAttribute("role", "listitem");
      button.setAttribute("aria-selected", String(selected === habitat));
      button.append(mailbox(habitat));

      const label = document.createElement("span");
      label.textContent = copy(`box${habitat[0].toUpperCase() + habitat.slice(1)}`);
      button.append(label);
      button.addEventListener("click", () => {
        selected = habitat;
        battleDirty = true;
        renderBattle();
        announce("select", { habitat });
      });
      root.appendChild(button);
    });

    $("status").textContent = "";
    $("status").className = "status";
  }

  function check() {
    checks += 1;
    battleDirty = true;

    const route = routes[routeIndex];
    const card = route.cards[cardIndex];
    if (selected === card.habitat) {
      delivered += 1;
      $("status").textContent = copy("correct");
      $("status").className = "status good";
      announce("correct", { checks });

      const generationRoute = routeIndex;
      const generationCard = cardIndex;
      scheduleSettlement(() => {
        if (document.body.dataset.screen !== "battle" || routeIndex !== generationRoute || cardIndex !== generationCard) return;

        if (cardIndex + 1 < route.cards.length) {
          cardIndex += 1;
          selected = null;
          resetBattleScroll();
          renderBattle();
          return;
        }

        solved.add(routeIndex);
        battleDirty = false;
        show("result");
        renderResult();
      }, 380);
      return;
    }

    $("status").textContent = copy("wrong");
    $("status").className = "status try";
    announce("wrong", { checks });
  }

  function renderResult() {
    if (!$("resultText")) return;

    const allRoutesComplete = solved.size === routes.length;
    $("resultTitle").textContent = allRoutesComplete ? copy("resultTitle") : copy("finished");
    $("resultText").textContent = copy("resultText", { count: solved.size * 2 });

    const nextButton = $("nextBtn");
    if (nextButton) {
      nextButton.hidden = false;
      nextButton.disabled = routeIndex + 1 >= routes.length;
      nextButton.setAttribute("aria-disabled", String(nextButton.disabled));
    }
    if ($("resultMapBtn")) $("resultMapBtn").hidden = false;
    if ($("replayBtn")) $("replayBtn").hidden = false;

    if (allRoutesComplete) {
      const old = Number(localStorage.getItem("weightplay-pocket-post-best-v2") || 0);
      if (!old || checks < old) localStorage.setItem("weightplay-pocket-post-best-v2", String(checks));
    }
  }

  function next() {
    const nextIndex = routeIndex + 1;
    if (nextIndex < routes.length) startRoute(nextIndex);
  }

  function replay() {
    startRoute(routeIndex);
  }

  function battleHeader() {
    return document.getElementById("wp-shared-battle-header")
      || document.querySelector('#battleScreen [data-wp-shell-header="battle"], #battleScreen .panel-head');
  }

  function updateLeaveCopy() {
    const route = routes[routeIndex];
    if (!route || !$("leaveBody")) return;
    $("leaveBody").textContent = copy("leaveBody", {
      route: copy(route.name),
      delivered,
      total: route.cards.length,
    });
  }

  function closeLeave(restoreFocus = true, resumePending = true) {
    const dialog = $("leaveDialog");
    if (!dialog || dialog.hidden) {
      if (resumePending) resumeSettlement();
      return;
    }

    dialog.hidden = true;
    leaveOpen = false;
    const play = $("battlePlay");
    if (play && !$("resultScreen")?.matches(":not([hidden])")) play.inert = false;
    const header = battleHeader();
    if (header) header.inert = false;
    if (resumePending) resumeSettlement();
    if (restoreFocus) $("battleBackBtn")?.focus({ preventScroll: true });
  }

  function openLeave() {
    const dialog = $("leaveDialog");
    if (!dialog || leaveOpen) return;

    pauseSettlement();
    updateLeaveCopy();
    leaveOpen = true;
    dialog.hidden = false;
    const play = $("battlePlay");
    if (play) play.inert = true;
    const header = battleHeader();
    if (header) header.inert = true;
    $("leaveContinueBtn")?.focus({ preventScroll: true });
  }

  function leaveBattle() {
    clearSettlement();
    battleDirty = false;
    closeLeave(false, false);
    openStage({ focusBack: true });
  }

  function trapLeaveFocus(event) {
    if (!leaveOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeLeave(true, true);
      return;
    }
    if (event.key !== "Tab") return;

    const controls = [$("leaveContinueBtn"), $("leaveStagesBtn")]
      .filter((node) => node && !node.disabled && !node.hidden);
    if (!controls.length) return;

    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function applyLocale() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.documentElement.dir = "ltr";

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = copy(node.dataset.i18n);
    });

    $("backBtn")?.setAttribute("aria-label", copy("back"));
    $("stageBackBtn")?.setAttribute("aria-label", copy("back"));
    $("battleBackBtn")?.setAttribute("aria-label", copy("back"));
    $("closeSettings")?.setAttribute("aria-label", copy("close"));
    $("localeSelect")?.setAttribute("aria-label", copy("language"));
    $("settingsPanel")?.setAttribute("aria-label", copy("settings"));
    $("stageList")?.setAttribute("aria-label", copy("chapter"));
    $("mailGrid")?.setAttribute("aria-label", copy("mailboxes"));

    const soundButton = $("soundBtn");
    if (soundButton) {
      soundButton.textContent = sound ? copy("on") : copy("off");
      soundButton.setAttribute("aria-pressed", String(sound));
    }

    if ($("best")) $("best").textContent = copy("best", { count: bestText() });
    renderStages();
    renderBattle();
    renderResult();
    if (leaveOpen) updateLeaveCopy();
  }

  function bind() {
    $("startBtn")?.addEventListener("click", () => openStage());

    // Compatibility node only. Interface 7 exposes Start Game as the sole visible Main play action.
    $("mapBtn")?.addEventListener("click", () => openStage());

    $("resultMapBtn")?.addEventListener("click", () => openStage());
    $("nextBtn")?.addEventListener("click", next);
    $("replayBtn")?.addEventListener("click", replay);
    $("sendBtn")?.addEventListener("click", check);

    $("clearBtn")?.addEventListener("click", () => {
      if (selected !== null) battleDirty = true;
      selected = null;
      renderBattle();
    });

    $("stageBackBtn")?.addEventListener("click", () => show("main"));
    $("battleBackBtn")?.addEventListener("click", () => {
      if (battleDirty || settlementPending) openLeave();
      else openStage();
    });

    $("stageList")?.addEventListener("wonder:stage-snap", (event) => {
      const index = Number(event.detail?.index);
      if (Number.isInteger(index) && index >= 0 && index < routes.length) updateStageHighlight(index);
    });

    $("leaveContinueBtn")?.addEventListener("click", () => closeLeave(true, true));
    $("leaveStagesBtn")?.addEventListener("click", leaveBattle);
    document.addEventListener("keydown", trapLeaveFocus);

    $("closeSettings")?.addEventListener("click", closeLegacySettings);
    $("soundBtn")?.addEventListener("click", () => {
      sound = !sound;
      localStorage.setItem("weightplay-pocket-post-sound", sound ? "on" : "off");
      window.WeightPlayAudio?.setMuted?.(!sound);
      applyLocale();
    });

    $("localeSelect")?.addEventListener("change", (event) => {
      locale = event.target.value;
      if (!locales[locale]) locale = "en";
      localStorage.setItem("weightplay-pocket-post-locale", locale);
      applyLocale();
      window.dispatchEvent(new Event("wonder:locale-change"));
    });
  }

  function boot() {
    bind();
    if ($("localeSelect")) $("localeSelect").value = locale;
    $("loading").hidden = true;
    $("app").hidden = false;
    renderStages();
    show("main");
    applyLocale();
    announce("loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}());
