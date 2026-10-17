(() => {
  "use strict";

  const body = document.body;
  const localeSelect = document.getElementById("localeSelect");
  const stagePage = document.getElementById("stageWorkspace");
  const stageRail = document.getElementById("stageRail");
  let frame = null;
  let stageUI = null;
  let stageApi = null;

  function mountFrame() {
    if (frame) return frame;
    const main = document.getElementById("mainGroup");
    const stage = document.getElementById("stageScreen");
    const battle = document.getElementById("battleScreen");
    localeSelect.closest(".locale-control").hidden = true;
    document.querySelector("#mainScreen #poster")?.setAttribute("data-wp-frame-poster", "");
    document.querySelector("#mainScreen .hero-copy")?.setAttribute("data-wp-frame-copy", "");
    document.getElementById("pitch")?.setAttribute("data-wp-frame-summary", "");
    document.getElementById("mainProgress")?.setAttribute("data-wp-frame-progress", "");
    document.getElementById("start")?.setAttribute("data-wp-frame-action", "primary");
    frame = window.WeightPlayScreenFrame.mount({
      root: document.getElementById("gameFrame"),
      localeSelect,
      playUI: true,
      scenes: {
        main: {
          root: main,
          header: document.querySelector("#mainScreen .main-header"),
          content: document.querySelector("#mainScreen .hero"),
        },
        stage: {
          root: stage,
          header: stage.querySelector(".stage-header"),
          content: stagePage,
        },
        battle: {
          root: battle,
          header: battle.querySelector(".battle-header"),
          content: battle.querySelector(".battle-live"),
        },
      },
    });

    const stageGroup = window.WeightPlayScreenFrame.createGroup();
    stageGroup.add(document.getElementById("stageSummary"));
    frame.stageTopUI.add(stageGroup);

    const battleGroup = window.WeightPlayScreenFrame.createGroup();
    const battleStats = document.querySelector(".battle-stats");
    for (const stat of [...battleStats.children]) battleGroup.add(stat);
    battleStats.remove();
    frame.battleTopUI.add(battleGroup);

    document.getElementById("next")?.addEventListener("click", () => {
      const targetStage = Math.min(30, stageApi?.getCentered?.() + 1);
      if (!Number.isInteger(targetStage)) return;
      window.setTimeout(() => {
        if (body.dataset.screen === "battle") stageApi?.setCentered(targetStage);
      }, 0);
    });
    frame.activate(body.dataset.screen || "main");
    return frame;
  }

  function mountStage(api) {
    stageApi = api;
    if (!stageUI) {
      mountFrame();
      const config = window.AnimalMosaicStageConfig.create(() => stageApi);
      stageUI = window.WeightPlayPlayUI.mountStage({
        page: stagePage,
        rail: stageRail,
        config,
        selected: api.getCentered() - 1,
        isActive: () => frame?.active === "stage",
        onSelect(index) { stageApi.setCentered(index + 1); },
        onStart(index) {
          if (!config.stage(index).locked) {
            stageApi.setCentered(index + 1);
            stageApi.enter(index + 1);
          }
        },
      });
      window.AnimalMosaicSharedStage = Object.freeze({
        select(stageNumber) {
          if (!Number.isInteger(stageNumber) || stageNumber < 1 || stageNumber > 30) return;
          stageUI.select(stageNumber - 1, { center: true, focus: true });
        },
      });
    } else {
      stageUI.refresh(api.getCentered() - 1);
    }
  }

  window.BlockTrilogyStageRenderer = Object.freeze({
    render(api) {
      mountFrame();
      mountStage(api);
      return true;
    },
  });

  function syncScene() {
    if (!frame) return;
    const scene = body.dataset.screen;
    if (!['main', 'stage', 'battle'].includes(scene)) return;
    frame.activate(scene);
    if (scene === "stage" && stageUI && stageApi) stageUI.refresh(stageApi.getCentered() - 1);
  }

  new MutationObserver(syncScene).observe(body, {
    attributes: true,
    attributeFilter: ["data-screen"],
  });
  window.addEventListener("weightplay:shell-sync", syncScene);
  window.addEventListener("weightplay:stage-sync", syncScene);
})();
