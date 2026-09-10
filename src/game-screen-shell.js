/*
 * WeightPlay Game Screen Shell
 *
 * A deliberately small, framework-free screen contract for games that opt in
 * to the catalog shell.  The shell owns scene identity and stable content
 * slots; the game continues to own its own content, simulation and lifecycle.
 */
(() => {
  "use strict";

  const SCREEN_TYPES = ["main", "stage", "battle"];

  function visible(node) {
    if (!node || node.hidden) return false;
    const style = getComputedStyle(node);
    return style.display !== "none" && style.visibility !== "hidden" && Boolean(node.getClientRects().length);
  }

  function screenTypeFor(screens, node) {
    return SCREEN_TYPES.find((type) => screens[type] === node) || null;
  }

  function mount(options = {}) {
    const root = options.root || document.querySelector("[data-wp-game-shell-root]");
    const screens = Object.fromEntries(SCREEN_TYPES.map((type) => [type, options[type] || null]));
    if (!root || !screens.main || !screens.battle) return null;

    root.classList.add("wp-game-shell", "wp-game-shell--lobby");
    root.dataset.wpGameShell = "v1";
    if (options.gameId) root.dataset.wpGameShellGame = options.gameId;
    document.body.dataset.wpGameShell = "v1";

    SCREEN_TYPES.forEach((type) => {
      const screen = screens[type];
      if (!screen) return;
      screen.classList.add("wp-game-shell-screen", `wp-game-shell-screen--${type}`);
      screen.dataset.wpShellSlot = type;
      screen.dataset.wpShellScreen = type;
    });

    const headers = {
      main: options.headers?.main || root.querySelector("[data-wp-shell-header='main']"),
      stage: options.headers?.stage || screens.stage?.querySelector("[data-wp-shell-header='stage']"),
      battle: options.headers?.battle || screens.battle?.querySelector("[data-wp-shell-header='battle']"),
    };
    Object.entries(headers).forEach(([type, header]) => {
      if (!header) return;
      header.classList.add("wp-game-shell-header", `wp-game-shell-header--${type}`);
      header.dataset.wpShellHeader = type;
    });

    let active = null;
    const apply = (type, source = "game") => {
      if (!SCREEN_TYPES.includes(type) || !screens[type]) return active;
      active = type;
      root.dataset.wpGameShellActive = type;
      document.body.dataset.wpGameShellActive = type;
      SCREEN_TYPES.forEach((name) => document.body.classList.toggle(`wp-game-shell-${name}-active`, name === type));
      window.dispatchEvent(new CustomEvent("weightplay:game-shell-change", {
        detail: { gameId: options.gameId || "", screen: type, source },
      }));
      return active;
    };

    const sync = () => {
      const next = SCREEN_TYPES.find((type) => visible(screens[type]));
      if (next) apply(next, "visibility-sync");
    };
    window.addEventListener("weightplay:shell-sync", sync);
    sync();

    return Object.freeze({
      activate: (target) => apply(typeof target === "string" ? target : screenTypeFor(screens, target), "game"),
      sync,
      get active() { return active; },
      screens: Object.freeze(screens),
    });
  }

  window.WeightPlayGameShell = Object.freeze({ mount });
})();
