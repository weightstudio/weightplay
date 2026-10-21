/* Game-owned content binding; shared frame and Play UI own screen chrome. */
(() => {
  "use strict";

  window.mountBusJamFrame = () => {
    const $ = (id) => document.getElementById(id);
    const root = $("gameFrame");
    const main = $("main");
    const stage = $("stage");
    const battle = $("battle");
    const game = window.BUS_JAM_I9;
    const core = window.WeightPlayScreenFrame;
    const playUI = window.WeightPlayPlayUI;
    if (!root || root.dataset.wpFrame || !game || !core || !playUI) return null;

    const mainHeader = main.querySelector("header");
    const mainContent = main.querySelector(".main-content");
    const mainCopy = mainContent.querySelector(".main-copy");
    mainContent.querySelector(".main-poster").dataset.wpFramePoster = "";
    mainCopy.dataset.wpFrameCopy = "";
    mainCopy.querySelector(".main-summary").dataset.wpFrameSummary = "";
    mainHeader.querySelector("h1").dataset.wpFrameTitle = "";
    mainHeader.querySelector("label").hidden = true;

    const guide = main.querySelector(".public-guide");
    root.after(guide);

    const stageHeader = stage.querySelector("header");
    const stageTitle = stageHeader.querySelector("[data-wp-frame-title]");
    const stageContent = $("stageContent");
    stageContent.dataset.wpFramePlayFill = "";
    stage.querySelector("nav").dataset.wpFrameNav = "";
    const stageAction = stage.querySelector("nav button");
    stageAction.dataset.wpFrameAction = "tab";
    stageAction.setAttribute("aria-pressed", "true");
    stageAction.setAttribute("aria-current", "page");

    const battleHeader = battle.querySelector("header");
    const battleContent = battle.querySelector(".battle-content");
    const battleInfo = $("battleInfo");
    const chapter = $("chapter");
    const stageName = $("stageName");
    const remaining = $("remaining");

    const frame = core.mount({
      root,
      localeSelect: $("locale"),
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        stage: { root: stage, header: stageHeader, content: stageContent },
        battle: { root: battle, header: battleHeader, content: battleContent, headerInfo: battleInfo },
      },
    });

    const stageGroup = core.createGroup();
    stageGroup.add($("progress"));
    frame.stageTopUI.add(stageGroup);

    const battleGroup = core.createGroup();
    battleGroup.add(chapter).add(stageName).add(remaining);
    battleInfo.replaceChildren();
    frame.battleTopUI.add(battleGroup);
    frame.commonDownButton.add(stageAction);

    const selector = playUI.mountStage({
      page: stageContent,
      rail: $("stageGrid"),
      config: game.stageConfig,
      selected: game.selected(),
      onSelect: game.select,
      onStart: game.start,
      isActive: () => frame.active === "stage",
    });
    game.attach(selector);

    const dialogs = ["result", "deadlock", "leaveBattle"].map($);
    const sync = () => {
      const scene = document.body.dataset.screen || "main";
      const covered = scene === "battle" && dialogs.some((dialog) => dialog.open);
      guide.hidden = scene !== "main";
      if (scene === "stage") selector.refresh(game.selected());
      else selector.cancel();
      frame.activate(scene, { covered });
    };
    const abort = new AbortController();
    window.addEventListener("weightplay:shell-sync", sync, { signal: abort.signal });
    window.addEventListener("wonder:locale-change", sync, { signal: abort.signal });
    dialogs.forEach((dialog) => {
      for (const event of ["toggle", "close"]) dialog.addEventListener(event, sync, { signal: abort.signal });
    });
    window.addEventListener("pagehide", (event) => {
      if (event.persisted) return;
      abort.abort();
      selector.destroy();
      frame.destroy();
    }, { signal: abort.signal });
    window.syncBusJamFrame = sync;
    sync();
    return frame;
  };
})();
