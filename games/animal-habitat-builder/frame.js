/* Game content adapter. Shared Frame and Play UI own scene chrome, settings,
   Stage card geometry, the rail gesture, and the optional Stage action lane. */
(() => {
  "use strict";

  window.mountAnimalHabitatBuilderFrame = ({ localeSelect, profiles, best, copy, common, words, onStart }) => {
    const byId = (id) => document.getElementById(id);
    const root = byId("app");
    const main = byId("main-screen");
    const stage = byId("stage-screen");
    const battle = byId("battle-screen");
    const stageContent = byId("stageContent");
    const battleContent = byId("battleContent");
    const stageProgress = byId("stage-progress");
    const stageStart = byId("stage-start");

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: main.querySelector("header"), content: byId("mainContent") },
        stage: {
          root: stage,
          header: stage.querySelector("header"),
          content: stageContent,
          headerInfo: byId("stageHeaderInfo"),
        },
        battle: {
          root: battle,
          header: battle.querySelector("header"),
          content: battleContent,
          headerInfo: byId("battleHeaderInfo"),
        },
      },
    });

    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageProgress));
    const battleInfo = window.WeightPlayScreenFrame.createGroup();
    battleInfo.add(byId("stage-label")).add(byId("score-label"));
    frame.battleTopUI.add(battleInfo);

    let selected = Math.min(Math.max(0, Number(best()) || 0), profiles.length - 1);
    const syncStageState = (index) => {
      selected = index;
      stageProgress.textContent = `${common(9)} ${index + 1} / ${profiles.length}`;
      const locked = index > (Number(best()) || 0);
      stageStart.disabled = locked;
      stageStart.setAttribute("aria-disabled", String(locked));
    };
    const stageSelector = window.WeightPlayPlayUI.mountStage({
      page: stageContent,
      rail: byId("stage-list"),
      config: window.AnimalHabitatBuilderStageConfig({ profiles, best, copy, common, words }),
      selected,
      onSelect: syncStageState,
      onStart(index) { onStart(index); },
      isActive: () => frame.active === "stage",
    });

    stageStart.textContent = common(1);
    stageStart.addEventListener("click", () => {
      if (!stageStart.disabled) onStart(stageSelector.selected);
    });
    frame.commonDownButton.clear().add(stageStart);
    stageSelector.refresh(selected);
    syncStageState(selected);

    const api = Object.freeze({
      activate: (name) => frame.activate(name),
      get selectedStage() { return stageSelector.selected; },
      selectStage(index) { stageSelector.select(index); },
      refreshStage(index = stageSelector.selected) {
        stageSelector.refresh(index);
        syncStageState(stageSelector.selected);
      },
      refreshLocale() {
        stageStart.textContent = common(1);
        stageSelector.refresh(stageSelector.selected);
        syncStageState(stageSelector.selected);
      },
      destroy() {
        stageSelector.destroy();
        frame.destroy();
      },
    });
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) api.destroy();
    }, { once: true });
    return api;
  };
})();
