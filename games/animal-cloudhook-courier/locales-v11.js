(() => {
  "use strict";

  const retryCue = {
    en: "On Retry, watch the next ring: hold Tether when it is in range, build your swing, then release toward the next ring.",
    "zh-Hant": "再試一次時先看下一個光環：進入範圍後按住繫繩，累積擺盪，再朝下一個光環放手。",
    "zh-Hans": "再试一次时先看下一个光环：进入范围后按住系绳，积累摆荡，再朝下一个光环放手。",
    ja: "再挑戦では次のリングを見ましょう。近づいたらテザーを長押しし、揺れを作ってから次のリングへ放します。",
    ko: "다시 할 때는 다음 링을 보세요. 범위에 들어오면 테더를 누르고 흔들림을 만든 뒤 다음 링을 향해 놓으세요.",
    es: "Al reintentar, mira el siguiente anillo: mantén el lazo cuando esté al alcance, gana impulso y suéltalo hacia el siguiente.",
    "pt-BR": "Ao tentar de novo, observe o próximo anel: segure a corda quando ele estiver ao alcance, ganhe impulso e solte rumo ao seguinte.",
    fr: "À la prochaine tentative, regardez l’anneau suivant : maintenez le lien à portée, prenez de l’élan, puis lâchez vers le suivant.",
    de: "Beim nächsten Versuch auf den nächsten Ring achten: Halte das Seil in Reichweite, baue Schwung auf und löse zum nächsten Ring.",
    it: "Al prossimo tentativo guarda l’anello successivo: tieni il laccio quando è a portata, accumula slancio e lascia verso il prossimo.",
    ru: "В следующей попытке смотрите на следующее кольцо: удерживайте трос в зоне захвата, наберите раскачку и отпустите к следующему.",
    hi: "फिर प्रयास में अगले रिंग को देखें: पास आने पर टेथर दबाएँ, झूले की गति बनाएँ और अगले रिंग की ओर छोड़ें।",
    ar: "عند المحاولة مجددًا راقب الحلقة التالية: اضغط الحبل عندما تصبح في المدى، واجمع التأرجح، ثم اتركه نحو الحلقة التالية."
  };
  for (const [locale, value] of Object.entries(retryCue)) {
    const target = window.WPCloudhookLocales?.locales?.[locale];
    if (target) target.retryCue = value;
  }

  const GAME_ID = "animal-cloudhook-courier";
  const shared = window.WPCloudhookInterface7 ||= {};

  // Every public locale page already loads this file before game.js. Attach the
  // scoped Interface 7 stylesheet here so canonical and all 13 locale routes
  // share the same cleanup instead of fixing only /games/....
  if (!document.querySelector('link[href*="interface-7-cleanup.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "interface-7-cleanup.css?v=20260924-cloudhook-compact-controls-v21";
    document.head.append(link);
  }

  const stageScreen = document.getElementById("stageScreen");
  const stageHelp = document.getElementById("stageHelp");
  const rail = document.getElementById("stageGrid");
  const stageBack = document.getElementById("stageBack");

  // Establish the permanent Stage identity before game.js and the shared frame
  // mount. Runtime scene changes never need to retag this control afterward.
  if (stageBack) stageBack.dataset.wpReturn = "stage";

  // Give the shared frame one explicit Stage workspace so the 48 / flexible /
  // 56 track contract has a real middle owner and the rail can use the 38%
  // upper-middle anchor rather than the old vertically-centered flow.
  if (stageScreen && rail && !rail.closest(".stage-workspace")) {
    const workspace = document.createElement("div");
    workspace.className = "stage-workspace";
    workspace.dataset.wpStageWorkspace = "";
    workspace.dataset.wpShellContent = "stage";
    stageScreen.insertBefore(workspace, stageHelp || rail);
    if (stageHelp) workspace.append(stageHelp);
    workspace.append(rail);
  }

  // game.js historically assigns a 30-button HTML string on every Stage
  // render. Intercept that assignment before game.js runs, preserve the
  // authored copy as plain data, and materialize exactly one listener proxy.
  // The post-game adapter below hands those records to the shared data-backed
  // nine-node virtualizer, so DOM construction and retained card memory remain
  // bounded as campaign length grows.
  if (rail && !shared.stageMarkupIntercepted) {
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    if (descriptor?.get && descriptor?.set) {
      shared.stageMarkupIntercepted = true;
      const decodeNode = document.createElement("textarea");
      const decode = (value = "") => {
        decodeNode.innerHTML = value;
        return decodeNode.value;
      };
      const readAttribute = (raw, name) => {
        const match = raw.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
        return match ? decode(match[1]) : "";
      };
      const parseStages = (markup) => {
        const rows = [];
        const pattern = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
        let match;
        while ((match = pattern.exec(markup))) {
          const attributes = match[1] || "";
          const stage = Number(readAttribute(attributes, "data-stage"));
          if (!Number.isInteger(stage) || stage < 0) continue;
          rows.push({
            stage,
            className: readAttribute(attributes, "class") || "stage-card",
            arc: readAttribute(attributes, "data-arc"),
            ariaLabel: readAttribute(attributes, "aria-label"),
            disabled: /(?:^|\s)disabled(?:\s|$)/i.test(attributes),
            innerHTML: match[2],
            proxyMarkup: match[0],
          });
        }
        rows.sort((a, b) => a.stage - b.stage);
        return rows;
      };

      Object.defineProperty(rail, "innerHTML", {
        configurable: true,
        get() {
          return descriptor.get.call(this);
        },
        set(value) {
          const markup = String(value ?? "");
          const rows = parseStages(markup);
          if (!rows.length) {
            shared.stageSnapshots = [];
            shared.activationProxy = null;
            descriptor.set.call(this, markup);
            return;
          }
          shared.stageSnapshots = rows;
          this.dataset.wpStageTotal = String(rows.length);
          descriptor.set.call(this, rows[0].proxyMarkup);
          shared.activationProxy = this.firstElementChild;
          queueMicrotask(() => {
            window.dispatchEvent(new CustomEvent("weightplay:cloudhook-stage-data", {
              detail: { total: rows.length },
            }));
          });
        },
      });
    }
  }

  if (shared.compatRegistered) return;
  shared.compatRegistered = true;

  let stageController = null;
  let repairQueued = false;
  const snapshots = () => Array.isArray(shared.stageSnapshots) ? shared.stageSnapshots : [];
  const highestUnlocked = () => {
    let current = 0;
    snapshots().forEach((row, index) => {
      if (!row.disabled && !/(?:^|\s)locked(?:\s|$)/.test(row.className || "")) current = index;
    });
    return current;
  };

  const bindStageCard = (card, index) => {
    const row = snapshots()[index];
    if (!row) return;
    const poolNode = card.dataset.wpStagePoolNode || "";
    [...card.attributes].forEach((attribute) => card.removeAttribute(attribute.name));
    if (poolNode) card.dataset.wpStagePoolNode = poolNode;
    card.type = "button";
    card.className = row.className || "stage-card";
    card.dataset.stage = String(row.stage);
    if (row.arc) card.dataset.arc = row.arc;
    if (row.ariaLabel) card.setAttribute("aria-label", row.ariaLabel);
    card.setAttribute("aria-disabled", String(Boolean(row.disabled)));
    card.innerHTML = row.innerHTML;
  };

  const installBoundedStageRail = () => {
    const rows = snapshots();
    if (!rail || rows.length < 2 || !window.WeightPlayStageV6?.install) return false;
    delete rail.dataset.wpStageV6Auto;
    delete rail.dataset.wpStageV6Total;
    delete rail.dataset.wpStageVirtualizationDestroyed;
    rail.dataset.wpStageTotal = String(rows.length);
    stageController?.destroy?.();
    stageController = null;
    rail.replaceChildren();
    stageController = window.WeightPlayStageV6.install(rail, {
      total: () => snapshots().length,
      poolSize: 9,
      initialIndex: highestUnlocked,
      bind: bindStageCard,
      activate(index) {
        const row = snapshots()[index];
        const proxy = shared.activationProxy;
        if (!row || row.disabled || !proxy) return;
        proxy.dataset.stage = String(row.stage);
        proxy.disabled = false;
        proxy.click();
      },
    });
    return Boolean(stageController);
  };

  const progressLabel = {
    en: "Stage", "zh-Hant": "關卡", "zh-Hans": "关卡", ja: "ステージ",
    ko: "스테이지", es: "Nivel", "pt-BR": "Fase", fr: "Niveau",
    de: "Level", it: "Livello", ru: "Уровень", hi: "स्तर", ar: "المرحلة",
  };
  const localeCode = () => {
    const raw = document.documentElement.lang || "en";
    if (/^zh-(tw|hant)/i.test(raw)) return "zh-Hant";
    if (/^zh/i.test(raw)) return "zh-Hans";
    if (/^pt/i.test(raw)) return "pt-BR";
    return raw.split("-")[0];
  };
  const syncMainProgress = () => {
    const progress = document.querySelector("[data-wp-main-progress],.wp-standard-main-progress");
    const total = snapshots().length;
    if (!progress || !total) return;
    const code = localeCode();
    progress.textContent = `${progressLabel[code] || progressLabel.en} ${highestUnlocked() + 1} / ${total}`;
  };

  const queueStageRepair = () => {
    if (repairQueued) return;
    repairQueued = true;
    queueMicrotask(() => {
      repairQueued = false;
      installBoundedStageRail();
      syncMainProgress();
    });
  };

  const ensureVirtualizer = () => {
    if (window.WeightPlayStageV6?.install) {
      installBoundedStageRail();
      return;
    }
    const existing = document.querySelector('script[src*="stage-virtualization-standard.js"]');
    if (existing) {
      existing.addEventListener("load", queueStageRepair, { once: true });
      queueMicrotask(queueStageRepair);
      return;
    }
    const script = document.createElement("script");
    script.src = "../../src/stage-virtualization-standard.js?v=20260809-stage-v6-source-demotion-v8";
    script.dataset.wpStageVirtualizationStandard = "true";
    script.addEventListener("load", queueStageRepair, { once: true });
    document.body.append(script);
  };

  const syncResultActions = () => {
    const actions = document.querySelector("#resultScreen .result-actions");
    const stages = document.getElementById("resultStagesBtn");
    const next = document.getElementById("nextBtn");
    const replay = document.getElementById("retryBtn");
    if (!actions || !stages || !next || !replay) return;
    const expected = [stages, next, replay];
    if (!expected.every((node, index) => actions.children[index] === node)) actions.append(...expected);
    const stagesLabel = document.getElementById("stageTab")?.textContent?.trim();
    if (stagesLabel && stages.textContent !== stagesLabel) stages.textContent = stagesLabel;
  };

  const bootCompat = () => {
    if (document.body?.dataset.wpGameId !== GAME_ID) return;
    for (const id of ["soundBtn", "stageSoundBtn"]) {
      const control = document.getElementById(id);
      if (!control) continue;
      control.hidden = true;
      control.setAttribute("aria-hidden", "true");
      control.tabIndex = -1;
    }

    const stageNav = document.querySelector("#stageScreen .stage-tabs");
    const stageTab = document.getElementById("stageTab");
    if (stageNav) stageNav.setAttribute("data-wp-frame-stage-nav", "");
    if (stageTab) stageTab.setAttribute("data-wp-frame-stage-slot", "stages");

    ensureVirtualizer();
    syncMainProgress();
    window.addEventListener("weightplay:cloudhook-stage-data", queueStageRepair);
    if (rail) {
      new MutationObserver(() => {
        if ([...rail.children].some((node) => !node.dataset.wpStagePoolNode)) queueStageRepair();
      }).observe(rail, { childList: true });
    }

    syncResultActions();
    const result = document.getElementById("resultScreen");
    if (result) {
      new MutationObserver(syncResultActions).observe(result, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["hidden"],
      });
    }
  };
  shared.bootCompat = bootCompat;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootCompat, { once: true });
  else bootCompat();
})();
