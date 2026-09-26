(() => {
  "use strict";

  const TOTAL = 30;
  const POOL = 9;
  const clampIndex = (value) => Math.max(0, Math.min(TOTAL - 1, Number(value) || 0));
  let api = null;
  let controller = null;
  let rail = null;

  const bind = (button, index) => {
    const stage = api.stages[index];
    const locked = stage.n > api.save.unlocked;
    const stars = Number(api.save.stars[stage.n]) || 0;
    const selected = index === clampIndex(api.getSelected() - 1);

    button.type = "button";
    button.className = `stage-card${locked ? " locked" : ""}${selected ? " centered wp-stage-centered" : ""}`;
    button.dataset.stage = String(stage.n);
    button.dataset.index = String(index);
    button.dataset.stageIndex = String(index);
    button.setAttribute("aria-posinset", String(stage.n));
    button.setAttribute("aria-setsize", String(TOTAL));
    button.setAttribute("aria-disabled", String(locked));
    button.tabIndex = selected ? 0 : -1;
    if (selected) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");

    button.replaceChildren();
    const chapter = document.createElement("span");
    const number = document.createElement("strong");
    const wave = document.createElement("b");
    const rating = document.createElement("small");
    chapter.textContent = locked ? api.t("lockedBadge") : api.chapterName(stage);
    number.textContent = String(stage.n);
    wave.textContent = `${stage.boss ? "◆ " : ""}${api.t("waveLabel", { wave: 0, total: stage.waves })}`;
    rating.textContent = `${"★".repeat(stars)}${"☆".repeat(3 - stars)}`;
    button.append(chapter, number, wave, rating);
  };

  const install = () => {
    if (!window.WeightPlayStageV6?.install) {
      throw new Error("STAGE_V6_REQUIRED");
    }
    controller = window.WeightPlayStageV6.install(api.rail, {
      total: TOTAL,
      poolSize: POOL,
      bind,
      initialIndex: () => clampIndex(api.getSelected() - 1),
      onFocus: (index) => api.setSelected(index + 1),
      onSettle: (index) => api.setSelected(index + 1),
      activate: (index, event) => {
        const stage = api.stages[index];
        api.setSelected(index + 1);
        if (!stage || stage.n > api.save.unlocked) {
          api.announce();
          return false;
        }
        api.enter(stage.n, event);
        return true;
      },
    });
    if (!controller) throw new Error("STAGE_V6_INSTALL_FAILED");
    rail = api.rail;
    rail.dataset.wpStageVirtualized = "shared-v6-bounded";
    rail.dataset.wpStagePoolSize = String(POOL);
    rail.dataset.wpStageTotal = String(TOTAL);
  };

  const renderer = {
    render(nextApi) {
      api = nextApi;
      if (!controller || rail !== api.rail) install();
      else controller.refresh();
      controller.center(clampIndex(api.getSelected() - 1));
      return true;
    },
    select(stageNumber, focus = false) {
      if (!api || !controller) return;
      const index = clampIndex(Number(stageNumber) - 1);
      api.setSelected(index + 1);
      controller.refresh();
      controller.center(index);
      if (focus) {
        requestAnimationFrame(() => api.rail.querySelector(`[data-stage-index="${index}"]`)?.focus({ preventScroll: true }));
      }
    },
    cancel() {
      controller?.cancel?.();
    },
    dispose() {
      controller?.destroy?.();
      controller = null;
      rail = null;
    },
  };

  window.PrismBattalionStageRenderer = renderer;
  window.addEventListener("pagehide", renderer.dispose, { once: true });
})();

/* Game-owned content motion only. The shared Interface 7 frame still owns
   navigation, geometry, focus, preferences and every scene root. Bundling here
   keeps the same optional presentation behavior on all existing locale routes. */
(() => {
  "use strict";
  const body = document.body;
  if (body?.dataset.gameId !== "animal-prism-battalion" || window.PrismBattalionMotion) return;
  const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const style = document.createElement("style");
  style.dataset.wpPrismMotion = "content-only";
  style.textContent = `
    @keyframes prism-content-reveal{from{opacity:.72}to{opacity:1}}
    @keyframes prism-charge-aura{0%,100%{box-shadow:0 0 12px #ffd55c66}50%{box-shadow:0 0 24px #ffd55caa}}
    body[data-game-id="animal-prism-battalion"] #mainGroup:not([hidden]) :is(.poster,.main-copy),
    body[data-game-id="animal-prism-battalion"] #stage:not([hidden]) :is(.missions-tab,.lab-tab):not([hidden]),
    body[data-game-id="animal-prism-battalion"] #battle:not([hidden]) #battleLive:not([hidden]),
    body[data-game-id="animal-prism-battalion"] .modal-layer:not([hidden])>:is(.dialog-card,.result-card){animation:prism-content-reveal 240ms ease-out}
    body[data-game-id="animal-prism-battalion"] #result:not([hidden]) .result-stats>span{animation:prism-content-reveal 280ms ease-out backwards}
    body[data-game-id="animal-prism-battalion"] #result:not([hidden]) .result-stats>span:nth-child(2){animation-delay:45ms}
    body[data-game-id="animal-prism-battalion"] #result:not([hidden]) .result-stats>span:nth-child(3){animation-delay:90ms}
    body[data-game-id="animal-prism-battalion"] :is(.stage-card,.upgrade,#overdrive){transition:border-color 160ms ease-out,box-shadow 180ms ease-out}
    body[data-game-id="animal-prism-battalion"] #overdrive.ready{animation:prism-charge-aura 1400ms ease-in-out infinite}
    body[data-game-id="animal-prism-battalion"][data-prism-motion-paused] :is(.poster,.main-copy,.missions-tab,.lab-tab,#battleLive,.dialog-card,.result-card,.result-stats>span,#overdrive.ready,.objective-row.first-switch-cue){animation-play-state:paused}
    @media(prefers-reduced-motion:reduce){
      body[data-game-id="animal-prism-battalion"] :is(.poster,.main-copy,.missions-tab,.lab-tab,#battleLive,.dialog-card,.result-card,.result-stats>span,#overdrive.ready,.objective-row.first-switch-cue){animation:none!important}
      body[data-game-id="animal-prism-battalion"] :is(.stage-card,.upgrade,#overdrive){transition:none!important}
    }
  `;
  document.head.append(style);
  const active = new Map();
  const watched = ["coreValue", "feedback", "labFeedback"].map((id) => document.getElementById(id)).filter(Boolean);
  const previous = new Map(watched.map((node) => [node, node.textContent]));
  let disposed = false;
  const visible = (node) => !document.hidden && !preference?.matches && !node.closest("[hidden],[inert]");
  function cancelActive() {
    for (const animation of active.values()) animation.cancel();
    active.clear();
  }
  function play(node, keyframes) {
    if (disposed || !node?.animate || !visible(node)) return;
    active.get(node)?.cancel();
    const animation = node.animate(keyframes, { duration: 240, easing: "ease-out" });
    active.set(node, animation);
    const release = () => { if (active.get(node) === animation) active.delete(node); };
    animation.finished.then(release, release);
  }
  // Observe only three small, locale-owned status nodes, never the game tree.
  const observer = new MutationObserver(() => {
    for (const node of watched) {
      const value = node.textContent;
      const before = previous.get(node);
      if (value === before) continue;
      previous.set(node, value);
      if (!value || !visible(node)) continue;
      if (node.id === "coreValue") {
        const health = Number(value.split("/")[0]);
        const oldHealth = Number(String(before).split("/")[0]);
        if (Number.isFinite(health) && Number.isFinite(oldHealth) && health < oldHealth) {
          play(node.parentElement, [{ boxShadow: "inset 0 0 0 2px #ff647e" }, { boxShadow: "inset 0 0 0 0px transparent" }]);
        }
      } else play(node, [{ opacity: 0.65 }, { opacity: 1 }]);
    }
  });
  for (const node of watched) observer.observe(node, { childList: true, characterData: true, subtree: true });
  function syncVisibility() {
    body.toggleAttribute("data-prism-motion-paused", document.hidden || Boolean(preference?.matches));
    if (document.hidden || preference?.matches) cancelActive();
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    observer.disconnect();
    cancelActive();
    style.remove();
    body.removeAttribute("data-prism-motion-paused");
    document.removeEventListener("visibilitychange", syncVisibility);
    window.removeEventListener("weightplay:shell-sync", cancelActive);
    window.removeEventListener("pagehide", cancelActive);
    preference?.removeEventListener?.("change", syncVisibility);
    delete window.PrismBattalionMotion;
  }
  document.addEventListener("visibilitychange", syncVisibility);
  window.addEventListener("weightplay:shell-sync", cancelActive);
  window.addEventListener("pagehide", cancelActive);
  preference?.addEventListener?.("change", syncVisibility);
  window.PrismBattalionMotion = { dispose };
  syncVisibility();
})();
