/* Meadow Find supplies its Main and Battle content to the shared I9 frame. */
(() => {
  "use strict";

  const install = () => {
    const $ = (id) => document.getElementById(id);
    const root = $("gameFrame");
    const main = $("mainScreen");
    const battle = $("battleView");
    if (!root || !main || !battle || !window.WeightPlayScreenFrame || root.dataset.wpFrame) return;

    const mainHeader = main.querySelector(".main-header");
    const mainContent = main.querySelector("#mainView .hero-card");
    const battleHeader = battle.querySelector(".battle-header");
    const battleContent = battle.querySelector(".battle-workspace");
    const headerInfo = $("battleHeaderInfo");

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect: $("localeSelect"),
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        battle: { root: battle, header: battleHeader, content: battleContent, headerInfo },
      },
    });

    const battleGroup = window.WeightPlayScreenFrame.createGroup();
    battleGroup.add($("roundLabel")).add($("checkCountTop").closest(".battle-checks-hud"));
    frame.battleTopUI.add(battleGroup);

    frame.activate("main");
    window.MeadowDifferenceFrame = Object.freeze({ frame, battleGroup });
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) frame.destroy();
    }, { once: true });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
})();
