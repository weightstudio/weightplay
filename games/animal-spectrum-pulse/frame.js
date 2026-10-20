/* Spectrum Pulse binds its existing scenes to the shared I9 frame and Play UI. */
(() => {
  "use strict";

  let mounted = null;

  window.mountSpectrumPulseFrame = ({ stageConfig, selected = 0, onSelect, onStart, isActive } = {}) => {
    if (mounted) return mounted;
    if (!window.WeightPlayScreenFrame || !window.WeightPlayPlayUI || !stageConfig) {
      throw new Error("SPECTRUM_PULSE_I9_FRAME_REQUIRED");
    }

    const byId = (id) => document.getElementById(id);
    const root = byId("gameRoot");
    const main = byId("mainGroup");
    const stage = byId("stageScreen");
    const battle = byId("battleScreen");
    const localeSelect = byId("localeSelect");
    const stageHeader = byId("stageHeader");
    const stageContent = byId("stageContent");
    const stageInfo = byId("stageInfo");
    const stageRail = byId("stageRail");
    const battleHeader = byId("battleHeader");
    const battleLive = byId("battleLive");
    const battleFrameInfo = byId("battleFrameInfo");
    const required = [root, main, stage, battle, localeSelect, stageHeader, stageContent, stageInfo, stageRail, battleHeader, battleLive, battleFrameInfo];
    if (required.some((node) => !node)) throw new Error("SPECTRUM_PULSE_I9_SCENES_REQUIRED");

    document.body.dataset.wpInterfaceVersion = "9";
    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: byId("mainHeader"), content: byId("mainScreen") },
        stage: { root: stage, header: stageHeader, content: stageContent, headerInfo: stageInfo },
        battle: { root: battle, header: battleHeader, content: battleLive, headerInfo: battleFrameInfo },
      },
    });

    const selector = window.WeightPlayPlayUI.mountStage({
      page: byId("towerPanel"),
      rail: stageRail,
      config: stageConfig,
      selected,
      isActive: isActive || (() => document.body.dataset.screen === "stage"),
      onSelect,
      onStart,
    });
    frame.activate("main");

    mounted = Object.freeze({
      frame,
      selector,
      activate(name, options) { frame.activate(name, options); },
      refreshStage(index) { selector.refresh(index); },
      selectStage(index, options) { selector.select(index, options); },
      get active() { return frame.active; },
      destroy() { selector.destroy(); frame.destroy(); mounted = null; },
    });
    return mounted;
  };
})();
