/* Bind permanent game nodes to the one shared frame. No private controls. */
(function () {
  "use strict";
  window.mountCarnivalFrame = function () {
    const root = document.getElementById("gameFrame");
    const main = document.getElementById("mainScreen");
    const stage = document.querySelector("#stageScreen .stage-canvas");
    const battle = document.querySelector("#battleScreen .battle-canvas");
    const mainHeader = main.querySelector("header");
    const stageHeader = stage.querySelector("header");
    const battleHeader = battle.querySelector("header");
    const live = document.getElementById("battleLive");
    const guide = root.querySelector(".game-page-info");
    guide.id = "mainGuide";
    root.after(guide);
    const localeSelect = document.getElementById("localeSelect");
    const localeControl = mainHeader.querySelector(".locale-control");
    localeControl.hidden = true;
    root.append(localeControl);
    mainHeader.querySelector("[data-wp-game-title]").setAttribute("data-wp-frame-title", "");
    const stageTitle = stageHeader.querySelector("[data-wp-game-title]");
    stageTitle.setAttribute("data-wp-frame-title", "");
    stageTitle.hidden = true;
    stageHeader.append(stageTitle);
    document.getElementById("stageWorkspace").prepend(document.getElementById("stageSummary"));
    stageHeader.querySelectorAll(":scope > div,:scope > span").forEach(node => node.remove());
    const battleInfo = document.createElement("div");
    battleInfo.append(...battleHeader.querySelectorAll(".battle-title,.battle-stat"));
    live.prepend(battleInfo);
    const title = document.createElement("strong");
    title.setAttribute("data-wp-frame-title", "");
    battleHeader.append(title);
    battle.prepend(battleHeader);
    live.querySelector(".target-strip").append(document.getElementById("pauseBtn"));
    const slots = {
      ".main-poster": "poster", ".main-copy": "copy",
      ".main-copy > p": "summary", "#mainProgress": "progress"
    };
    for (const [selector, slot] of Object.entries(slots)) main.querySelector(selector).setAttribute(`data-wp-frame-${slot}`, "");
    main.querySelectorAll(".main-copy > small,.main-copy > h1").forEach(node => { node.hidden = true; });
    stage.querySelector(".stage-tabs").setAttribute("data-wp-frame-nav", "");
    root.querySelectorAll("button:not([data-wp-return]):not(.stage-card)").forEach(button => {
      button.setAttribute("data-wp-frame-action", button.classList.contains("primary-action") ? "primary" : "secondary");
    });
    const frame = window.WeightPlayScreenFrame.mount({root, localeSelect, scenes: {
      main: {root: main, header: mainHeader, content: main.querySelector(".main-hero")},
      stage: {root: stage, header: stageHeader, content: document.getElementById("stageWorkspace")},
      battle: {root: battle, header: battleHeader, content: live, headerInfo: battleInfo}
    }});
    frame.activate("main");
    window.addEventListener("pagehide", event => { if (!event.persisted) frame.destroy(); });
    return frame;
  };
})();
