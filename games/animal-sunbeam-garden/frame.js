/* Sunbeam content adapter; shared Frame and Play UI own all outer geometry. */
(() => {
  "use strict";

  const body = document.body;
  const byId = (id) => document.getElementById(id);
  let frame = null;
  let stageUI = null;
  let stageApi = null;

  function mountFrame() {
    if (frame) return frame;
    const root = byId("gameFrame");
    const main = byId("main");
    const stage = byId("stage");
    const battle = byId("battle");
    const mainHeader = main.querySelector("header");
    const stageHeader = stage.querySelector("header");
    const battleHeader = battle.querySelector("header");
    const localeSelect = byId("locale");
    const localeControl = mainHeader.querySelector(".locale");
    localeControl.hidden = true;
    localeControl.style.setProperty("display", "none", "important");

    main.classList.remove("main-screen", "main");
    const mainContent = main.querySelector(".hero");
    mainContent.className = "sunbeam-main-content";
    const copy = mainContent.querySelector("div");
    mainContent.querySelector("img").dataset.wpFramePoster = "";
    copy.dataset.wpFrameCopy = "";
    copy.querySelector('[data-t="summary"]').dataset.wpFrameSummary = "";
    copy.querySelector("h1").hidden = true;
    copy.querySelector(".eyebrow").hidden = true;
    byId("mainProgress").dataset.wpFrameProgress = "";
    byId("start").dataset.wpFrameAction = "primary";
    byId("tutorialOpen").dataset.wpFrameAction = "secondary";
    const mainTitle = mainHeader.querySelector("strong");
    mainTitle.dataset.wpFrameTitle = "";
    mainTitle.textContent = copy.querySelector("h1").textContent;
    mainTitle.removeAttribute("data-t");
    mainTitle.dataset.wpGameTitle = "";

    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const stageTitle = stageHeader.querySelector("h2");
    const stageProgress = byId("progress");
    stageTitle.hidden = true;
    stageTitle.dataset.wpFrameTitle = "";
    stageHeader.replaceChildren(stageBack, stageTitle);
    const stagePage = byId("stageContent");
    const stageRail = byId("stageGrid");
    stagePage.replaceChildren(stageRail);

    const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
    const battleTitle = document.createElement("h2");
    const battleStats = ["chapter", "stageName", "beamState"].map(byId);
    battleTitle.hidden = true;
    battleTitle.dataset.wpFrameTitle = "";
    const battleHelp = byId("battleHelp");
    battleHeader.replaceChildren(battleBack, battleTitle);
    battle.querySelector(".battle-content").append(battleHelp);
    battleHelp.dataset.wpFrameAction = "secondary";

    frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        stage: { root: stage, header: stageHeader, content: stagePage },
        battle: { root: battle, header: battleHeader, content: battle.querySelector(".battle-content") },
      },
    });

    const stageGroup = window.WeightPlayScreenFrame.createGroup();
    stageProgress.dataset.wpFrameStat = "";
    stageGroup.add(stageProgress);
    frame.stageTopUI.add(stageGroup);

    const battleGroup = window.WeightPlayScreenFrame.createGroup();
    for (const node of battleStats) {
      node.dataset.wpFrameStat = "";
      battleGroup.add(node);
    }
    frame.battleTopUI.add(battleGroup);

    stageApi = window.SunbeamGardenStageAPI;
    if (!stageApi) throw new Error("SUNBEAM_STAGE_API_REQUIRED");
    const config = window.SunbeamGardenStageConfig.create(stageApi);
    stageUI = window.WeightPlayPlayUI.mountStage({
      page: stagePage,
      rail: stageRail,
      config,
      selected: stageApi.selected,
      isActive: () => frame?.active === "stage",
      onSelect(index) { stageApi.select(index); },
      onStart(index) { stageApi.start(index); },
    });

    const refreshStage = () => {
      stageApi.renderStageProgress();
      stageUI.refresh(stageApi.selected);
    };
    window.SunbeamGardenFrame = Object.freeze({ refreshStage });
    const sync = () => {
      const scene = body.dataset.screen || "main";
      if (!["main", "stage", "battle"].includes(scene)) return;
      frame.activate(scene);
      if (scene === "stage") refreshStage();
    };
    window.addEventListener("weightplay:game-view-change", sync);
    window.addEventListener("wonder:locale-change", refreshStage);
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) {
        stageUI.destroy();
        frame.destroy();
      }
    });
    frame.activate(body.dataset.screen || "main");
    return frame;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountFrame, { once: true });
  } else {
    mountFrame();
  }
})();
