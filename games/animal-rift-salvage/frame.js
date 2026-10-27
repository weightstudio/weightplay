/* Rift Salvage game data plugs into the shared I9 screen and Stage owners. */
(() => {
  "use strict";

  window.mountAnimalRiftSalvageFrame = function mountAnimalRiftSalvageFrame(bridge) {
    const byId = (id) => document.getElementById(id);
    const root = byId("gameFrame");
    const main = byId("mainGroup");
    const stage = byId("stageScreen");
    const battle = byId("battleScreen");
    const mainHeader = main.querySelector(".main-header");
    const stageHeader = stage.querySelector(".stage-header");
    const battleHeader = battle.querySelector(".battle-header");
    const mainContent = main.querySelector(".main-hero");
    const stageWorkspace = byId("stageWorkspace");
    const zonePanel = byId("zonePanel");
    const stageRail = byId("stageRail");
    const localeSelect = byId("localeSelect");

    if (!root || !mainHeader || !stageHeader || !battleHeader || !mainContent
      || !stageWorkspace || !zonePanel || !stageRail
      || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI
      || !window.AnimalRiftSalvageStageConfig) {
      throw new Error("ANIMAL_RIFT_SALVAGE_I9_FRAME_REQUIRED");
    }

    const poster = mainContent.querySelector(".main-poster");
    const copy = mainContent.querySelector(".main-copy");
    mainHeader.querySelector("[data-wp-game-title]")?.setAttribute("data-wp-frame-title", "");
    mainContent.classList.add("wp-standard-main-composition");
    poster?.classList.add("wp-standard-main-poster");
    copy?.classList.add("wp-standard-main-copy");
    poster?.setAttribute("data-wp-frame-poster", "");
    copy?.setAttribute("data-wp-frame-copy", "");
    byId("mainSummary")?.setAttribute("data-wp-frame-summary", "");
    byId("mainProgress")?.setAttribute("data-wp-frame-progress", "");
    byId("start")?.setAttribute("data-wp-main-start", "");
    byId("start")?.setAttribute("data-wp-frame-action", "primary");

    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
    const stageFrameTitle = stageHeader.querySelector("[data-wp-frame-title]");
    const battleFrameTitle = battleHeader.querySelector("[data-wp-frame-title]");
    if (!stageBack || !battleBack || !stageFrameTitle || !battleFrameTitle) {
      throw new Error("ANIMAL_RIFT_SALVAGE_I9_HEADER_REQUIRED");
    }

    const stageTitle = document.createElement("strong");
    stageTitle.className = "wp-rift-stage-title";
    stageTitle.textContent = bridge.text("chooseZone");
    const stageSummary = byId("stageSummary");
    const stageMeta = document.createElement("div");
    stageMeta.className = "wp-rift-stage-meta";
    stageMeta.append(stageTitle, stageSummary);

    const battleDetails = document.createElement("div");
    battleDetails.className = "wp-rift-battle-details";
    for (const label of byId("battleStatus").querySelectorAll("b")) {
      const text = document.createElement("span");
      for (const attribute of label.attributes) text.setAttribute(attribute.name, attribute.value);
      text.textContent = label.textContent;
      label.replaceWith(text);
    }
    battleDetails.append(byId("zoneLabel").parentElement, ...byId("battleStatus").children);
    byId("battleLive").append(battleDetails);

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        stage: { root: stage, header: stageHeader, content: stageWorkspace },
        battle: {
          root: battle,
          header: battleHeader,
          content: byId("battleLive"),
          headerInfo: battleDetails,
        },
      },
    });

    const stageGroup = window.WeightPlayScreenFrame.createGroup().add(stageMeta);
    frame.stageTopUI.clear().add(stageGroup);

    const tabs = [byId("zonesTab"), byId("observatoryTab")];
    for (const [index, button] of tabs.entries()) {
      button.dataset.wpFrameAction = "tab";
      button.setAttribute("aria-selected", String(index === 0));
      button.setAttribute("aria-pressed", String(index === 0));
    }
    frame.commonDownButton.clear().add(tabs[0]).add(tabs[1]);

    const config = window.AnimalRiftSalvageStageConfig.create(bridge);
    const selector = window.WeightPlayPlayUI.mountStage({
      page: zonePanel,
      rail: stageRail,
      config,
      selected: bridge.selected,
      isActive: () => document.body.dataset.screen === "stage" && !zonePanel.hidden,
      onSelect: (index) => bridge.select(index),
      onStart: (index) => bridge.start(index),
    });

    function refreshLocale() {
      stageTitle.textContent = bridge.text("chooseZone");
      selector.refresh(bridge.selected);
    }
    function syncScene() {
      const name = document.body.dataset.screen;
      if (["main", "stage", "battle"].includes(name) && frame.active !== name) {
        frame.activate(name);
        if (name === "stage") selector.refresh(bridge.selected);
      }
    }
    const sceneObserver = new MutationObserver(syncScene);
    sceneObserver.observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });
    window.addEventListener("wonder:locale-change", refreshLocale);
    window.addEventListener("wonder:i18n-ready", refreshLocale);
    window.addEventListener("pagehide", (event) => {
      if (event.persisted) return;
      sceneObserver.disconnect();
      window.removeEventListener("wonder:locale-change", refreshLocale);
      window.removeEventListener("wonder:i18n-ready", refreshLocale);
      selector.destroy();
      frame.destroy();
    }, { once: true });

    frame.activate("main");
    return Object.freeze({ frame, selector });
  };
})();
