/* Game content binding only. Header, preferences and skin belong to the shared core. */
(() => {
  "use strict";
  let frame;
  window.mountTripleMatchFrame = () => {
    if (frame) return frame;
    const root = document.getElementById("gameFrame");
    const main = document.getElementById("mainScreen");
    const stage = document.getElementById("stageScreen");
    const battle = document.querySelector(".logical-canvas.battle-canvas");
    const mainHeader = main.querySelector(".main-header");
    const stageHeader = stage.querySelector(".stage-header");
    const battleHeader = battle.querySelector(".battle-header");
    const mainContent = main.querySelector(".main-hero");
    const battleContent = document.getElementById("battleLive");
    const localeSelect = document.getElementById("localeSelect");
    if (!window.WeightPlayScreenFrame || !mainHeader || !stageHeader || !battleHeader) {
      throw new Error("TRIPLE_MATCH_SHARED_FRAME_REQUIRED");
    }
    root.setAttribute("data-wp-frame-root", "");
    mainHeader.querySelector("[data-wp-game-title]").setAttribute("data-wp-frame-title", "");
    stageHeader.querySelector("strong").setAttribute("data-wp-frame-title", "");
    const battleTitle = document.createElement("strong");
    battleTitle.setAttribute("data-wp-frame-title", "");
    battleHeader.append(battleTitle);
    const retainedLocale = document.createElement("div");
    retainedLocale.hidden = true;
    retainedLocale.append(localeSelect);
    root.append(retainedLocale);
    mainHeader.querySelector(".locale-control")?.remove();
    mainContent.querySelector(".poster").setAttribute("data-wp-frame-poster", "");
    const copy = mainContent.querySelector(".main-copy");
    copy.setAttribute("data-wp-frame-copy", "");
    copy.querySelector("h1").hidden = true;
    copy.querySelector('[data-t="pitch"]').setAttribute("data-wp-frame-summary", "");
    document.getElementById("mainProgress").setAttribute("data-wp-frame-progress", "");
    document.getElementById("startBtn").setAttribute("data-wp-frame-action", "primary");
    const stageContent = document.createElement("div");
    stageContent.className = "triple-stage-content";
    const nav = stage.querySelector(".stage-tabs");
    [...stage.children].filter(node => node !== stageHeader && node !== nav)
      .forEach(node => stageContent.append(node));
    stageHeader.after(stageContent);
    nav.setAttribute("data-wp-frame-nav", "");
    nav.querySelectorAll("button").forEach(node => node.setAttribute("data-wp-frame-action", "tab"));
    // Preserve game-owned values and listeners; move them, never clone them.
    const hud = battleHeader.querySelector(".hud");
    battleContent.prepend(hud);
    const context = battleHeader.querySelector(".battle-title");
    context.setAttribute("data-wp-frame-info-context", "");
    context.className = "triple-battle-context";
    context.append(document.getElementById("helpBtn"));
    battleContent.prepend(context);
    retainedLocale.append(document.getElementById("soundBtn"));
    battle.prepend(battleHeader);
    frame = window.WeightPlayScreenFrame.mount({root, localeSelect, scenes: {
      main: {root: main, header: mainHeader, content: mainContent},
      stage: {root: stage, header: stageHeader, content: stageContent},
      battle: {root: battle, header: battleHeader, content: battleContent, headerInfo: hud},
    }});
    frame.activate("main");
    return frame;
  };
})();
