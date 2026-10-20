/* Orchard data slots supplied to the shared Interface 9 frame. */
(() => {
  "use strict";

  let mountedFrame = null;

  function mount() {
    if (mountedFrame) return mountedFrame;
    const $ = (id) => document.getElementById(id);
    const root = $("gameFrame");
    const main = $("mainView");
    const battle = $("battleView");
    const mainHeader = main?.querySelector("header");
    const battleHeader = battle?.querySelector("header");
    const mainContent = $("mainContent");
    const battleContent = $("battleContent");

    if (!root || !mainHeader || !battleHeader || !mainContent || !battleContent || !window.WeightPlayScreenFrame?.mount) {
      throw new Error("Orchard Steward shared-frame slots are incomplete");
    }

    mountedFrame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect: $("localeSelect"),
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        battle: { root: battle, header: battleHeader, content: battleContent },
      },
    });

    const battleInfo = window.WeightPlayScreenFrame.createGroup()
      .add($("dayLabel"))
      .add($("leafCount"));
    mountedFrame.battleTopUI.add(battleInfo);
    mountedFrame.activate("main");

    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) {
        mountedFrame?.destroy();
        mountedFrame = null;
      }
    }, { once: true });

    return mountedFrame;
  }

  window.OrchardStewardFrame = Object.freeze({ mount });
})();
