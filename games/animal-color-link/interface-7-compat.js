(() => {
  "use strict";

  const GAME_ID = "animal-color-link";
  const root = document.documentElement;
  if (root.dataset.wpColorLinkI7Cleanup === "true") return;
  root.dataset.wpColorLinkI7Cleanup = "true";

  const init = () => {
    if (document.body?.dataset.wpGameId !== GAME_ID) return;

    const style = document.createElement("style");
    style.dataset.wpColorLinkI7Cleanup = "";
    style.textContent = `
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] :is(#stage,#battle) :is(.scene-header,.wp-frame-header) {
        height: 48px !important;
        min-height: 48px !important;
        max-height: 48px !important;
        padding-block: 0 !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] :is(#stage,#battle) .scene-header {
        grid-template-columns: 48px minmax(0,1fr) 48px !important;
        align-items: center !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] :is(#stage,#battle) [data-back] {
        width: 48px !important;
        min-width: 48px !important;
        max-width: 48px !important;
        height: 48px !important;
        min-height: 48px !important;
        max-height: 48px !important;
        display: grid !important;
        place-items: center !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stage :is(.stage-header > h2,h2[data-t="title"]),
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #battle #stageName,
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] :is(#stage,#battle) .wp-frame-header > [data-wp-frame-title] {
        display: none !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stage {
        grid-template-rows: 48px minmax(0,1fr) 56px !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #battle {
        grid-template-rows: 48px minmax(0,1fr) !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stage .stage-workspace {
        position: relative !important;
        display: block !important;
        min-height: 0 !important;
        overflow: hidden !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stage .stage-summary {
        position: absolute !important;
        z-index: 2 !important;
        top: 8px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        min-height: 32px !important;
        max-height: 44px !important;
        display: grid !important;
        place-items: center !important;
        white-space: nowrap !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stage .stage-summary small {
        display: none !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageGrid {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        top: clamp(103px,38%,calc(100% - 103px)) !important;
        transform: translateY(-50%) !important;
        width: 100% !important;
        height: 206px !important;
        min-height: 206px !important;
        max-height: 206px !important;
        display: flex !important;
        flex-flow: row nowrap !important;
        align-items: center !important;
        gap: 12px !important;
        overflow: hidden !important;
        scroll-snap-type: none !important;
        padding: 8px max(12px, calc((100% - 264px) / 2)) !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageGrid > .stage-card {
        box-sizing: border-box !important;
        flex: 0 0 264px !important;
        width: 264px !important;
        min-width: 264px !important;
        max-width: 264px !important;
        height: 190px !important;
        min-height: 190px !important;
        max-height: 190px !important;
        scroll-snap-align: none !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stage .stage-tabs {
        height: 56px !important;
        min-height: 56px !important;
        max-height: 56px !important;
        padding: 6px !important;
        grid-template-columns: repeat(3,minmax(0,1fr)) !important;
        gap: 8px !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stage .stage-tabs button {
        height: 44px !important;
        min-height: 44px !important;
        max-height: 44px !important;
        min-width: 0 !important;
        padding-inline: 10px !important;
        white-space: nowrap !important;
        line-height: 1.2 !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stage :is(#previousGroup,#nextGroup) {
        visibility: hidden !important;
        pointer-events: none !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stage #stageTab {
        grid-column: 2 !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] .result-actions {
        display: grid !important;
        grid-template-columns: repeat(3,minmax(0,1fr)) !important;
        gap: 8px !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] .result-actions > button {
        min-width: 0 !important;
        min-height: 44px !important;
        white-space: normal !important;
      }
      body[data-wp-game-id="${GAME_ID}"] .wp-color-link-main-progress {
        min-height: 32px;
        max-height: 44px;
        width: fit-content;
        display: inline-grid;
        place-items: center;
        margin: 8px 0 10px;
        padding: 5px 12px;
        border: 1px solid #a8cdb9;
        border-radius: 999px;
        background: #f7fff6e8;
        color: var(--ink,#153e38);
        font-size: .78rem;
        font-weight: 850;
        line-height: 1.2;
        white-space: nowrap;
      }
      @media(max-width:680px){
        body[data-wp-game-id="${GAME_ID}"] .wp-color-link-main-progress { margin-inline: auto; }
      }
    `;
    document.head.append(style);

    const rail = document.getElementById("stageGrid");
    const levels = window.COLOR_LINK_LEVELS?.levels;
    const start = document.getElementById("start");
    const localeSelect = document.getElementById("locale");
    const heroCopy = document.querySelector("#main .hero-copy");
    const leavePanel = document.getElementById("leavePanel");
    const leaveText = document.getElementById("leaveText");
    const leaveContinue = document.getElementById("leaveContinue");
    const leaveStages = document.getElementById("leaveStages");
    const result = document.getElementById("result");
    const resultStages = document.getElementById("resultStages");
    const next = document.getElementById("next");
    const battle = document.getElementById("battle");
    const battleBack = document.querySelector("#battle [data-back]");
    const stageName = document.getElementById("stageName");

    const readStore = (key) => {
      try { return localStorage.getItem(key); } catch { return null; }
    };
    const readUnlocked = () => Math.max(1, Math.min(31, Number(readStore("wp-animal-color-link-v1")) || 1));
    const highestUnlockedIndex = () => Math.max(0, Math.min(29, readUnlocked() - 1));
    const readLocale = () => readStore("wp-locale") || readStore("weightPlayLocale") || "en";
    const interpolate = (template, params) => String(template || "").replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));

    let mainProgress = document.querySelector(".wp-color-link-main-progress");
    if (!mainProgress && heroCopy && start) {
      mainProgress = document.createElement("p");
      mainProgress.className = "wp-color-link-main-progress";
      mainProgress.setAttribute("aria-live", "polite");
      heroCopy.insertBefore(mainProgress, start);
    }
    const syncMainProgress = () => {
      if (!mainProgress) return;
      const copy = window.COLOR_LINK_LOCALES?.[readLocale()] || window.COLOR_LINK_LOCALES?.en;
      mainProgress.textContent = interpolate(copy?.progress || "{done}/30 cleared", { done: Math.min(30, readUnlocked() - 1) });
    };
    syncMainProgress();

    let leaveBase = leaveText?.textContent || "";
    const syncLeaveCopy = () => {
      if (!leaveText || !stageName?.textContent || !leaveBase) return;
      leaveText.textContent = `${stageName.textContent} — ${leaveBase}`;
    };
    localeSelect?.addEventListener("change", () => {
      setTimeout(() => {
        if (leaveText) leaveBase = leaveText.textContent;
        syncMainProgress();
      }, 0);
    });
    window.addEventListener("weightplay:shell-sync", () => {
      syncMainProgress();
      if (document.body.dataset.screen === "battle" && leavePanel?.hidden) syncLeaveCopy();
    });
    battleBack?.addEventListener("click", () => {
      if (leavePanel?.hidden) syncLeaveCopy();
    }, true);

    let deferredResult = false;
    const setBattleCovered = (owner) => {
      if (!battle) return;
      [...battle.children].forEach((node) => { node.inert = Boolean(owner && node !== owner); });
      if (owner) owner.inert = false;
    };
    if (result && leavePanel) {
      new MutationObserver(() => {
        if (!leavePanel.hidden && !result.hidden) {
          deferredResult = true;
          result.hidden = true;
          setBattleCovered(leavePanel);
        }
      }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
    }
    leaveContinue?.addEventListener("click", () => {
      setTimeout(() => {
        if (!deferredResult || !result) return;
        deferredResult = false;
        result.hidden = false;
        setBattleCovered(result);
        (next?.disabled ? resultStages : next)?.focus?.({ preventScroll: true });
      }, 0);
    });
    leaveStages?.addEventListener("click", () => { deferredResult = false; });

    if (!rail || !Array.isArray(levels)) {
      start?.removeAttribute("disabled");
      return;
    }

    let controller = null;
    let gameStageBinder = null;
    let currentLogicalIndex = highestUnlockedIndex();

    const bindCard = (card, index) => {
      if (!gameStageBinder || !levels[index]) return;
      const poolNode = card.dataset.wpStagePoolNode || "";
      [...card.attributes].forEach((attribute) => card.removeAttribute(attribute.name));
      card.dataset.wpStagePoolNode = poolNode;
      card.type = "button";
      card.className = "";
      card.replaceChildren();
      card.onclick = null;

      const hadOwnCreate = Object.prototype.hasOwnProperty.call(document, "createElement");
      const priorCreate = document.createElement;
      const hadOwnAppend = Object.prototype.hasOwnProperty.call(rail, "append");
      const priorAppend = rail.append;
      let supplied = false;
      document.createElement = function (name, options) {
        if (!supplied && String(name).toLowerCase() === "button") {
          supplied = true;
          return card;
        }
        return priorCreate.call(document, name, options);
      };
      rail.append = function (...nodes) {
        if (nodes.length === 1 && nodes[0] === card) return;
        return priorAppend.apply(rail, nodes);
      };
      try {
        gameStageBinder(levels[index], index, levels);
      } finally {
        if (hadOwnCreate) document.createElement = priorCreate;
        else delete document.createElement;
        if (hadOwnAppend) rail.append = priorAppend;
        else delete rail.append;
      }

      const locked = index + 1 > readUnlocked();
      card.classList.toggle("locked", locked);
      card.classList.remove("selected", "centered", "is-centered");
      card.removeAttribute("aria-current");
      card.removeAttribute("data-wp-stage-recommended");
      card.setAttribute("aria-disabled", String(locked));
      card.disabled = false;
    };

    const installController = () => {
      controller?.destroy?.();
      controller = null;
      currentLogicalIndex = highestUnlockedIndex();
      if (!window.WeightPlayStageV6) return;
      controller = window.WeightPlayStageV6.install(rail, {
        total: () => levels.length,
        poolSize: 9,
        initialIndex: () => currentLogicalIndex,
        bind: bindCard,
        onChange: (index) => { currentLogicalIndex = index; },
        activate: (index, _source, card, event) => {
          if (card?.getAttribute("aria-disabled") === "true") return;
          card?.onclick?.call(card, event);
        },
      });
      controller?.center(currentLogicalIndex);
    };

    Object.defineProperty(levels, "forEach", {
      configurable: true,
      writable: true,
      value(callback, thisArg) {
        gameStageBinder = (item, index, array) => callback.call(thisArg, item, index, array);
        installController();
      },
    });

    rail.addEventListener("wonder:stage-snap", (event) => {
      const index = Number(event.detail?.index);
      if (Number.isInteger(index)) currentLogicalIndex = index;
      event.stopImmediatePropagation();
    }, true);

    const stageTab = document.getElementById("stageTab");
    if (stageTab) stageTab.onclick = () => controller?.center(currentLogicalIndex);

    const enableStart = () => {
      start?.removeAttribute("disabled");
      start?.removeAttribute("aria-busy");
    };
    const failOpen = () => {
      enableStart();
    };
    if (window.WeightPlayStageV6) {
      enableStart();
    } else {
      start?.setAttribute("aria-busy", "true");
      let script = document.querySelector("script[data-wp-color-link-stage-virtualizer]");
      if (!script) {
        script = document.createElement("script");
        script.src = "../../src/stage-virtualization-standard.js?v=20260923-color-link-i7-cleanup2";
        script.dataset.wpColorLinkStageVirtualizer = "";
        document.head.append(script);
      }
      script.addEventListener("load", enableStart, { once: true });
      script.addEventListener("error", failOpen, { once: true });
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
