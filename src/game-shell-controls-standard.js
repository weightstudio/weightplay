(function () {
  "use strict";

  const sharedAssetBase = new URL(".", document.currentScript?.src || location.href);
  const ownedSettingsButton = document.querySelector("#audioMenuBtn[aria-controls='audioPopover']");
  const ownedSettingsGroup = ownedSettingsButton?.closest(".settings-control");
  if (ownedSettingsButton && ownedSettingsGroup?.querySelector("#audioPopover #localeSelect")) {
    ownedSettingsButton.dataset.wpSettings = "true";
    ownedSettingsGroup.dataset.wpSettingsControl = "true";
    ownedSettingsGroup.classList.add("wp-shell-legacy-control");
  }
  if (document.documentElement.dataset.wpShellControlsInstalled === "true") return;
  document.documentElement.dataset.wpShellControlsInstalled = "true";
  window.__weightPlayShellControlsInstalled = true;
  window.__weightPlayShellControlsOrigin = document.querySelector("base")?.getAttribute("href") || "no-base";

  const COPY = {
    en: ["Settings", "Language", "Sound Effects"],
    "zh-Hant": ["設定", "語言", "音效"],
    "zh-Hans": ["设置", "语言", "音效"],
    ja: ["設定", "言語", "効果音"],
    ko: ["설정", "언어", "효과음"],
    es: ["Configuración", "Idioma", "Sonido"],
    "pt-BR": ["Configurações", "Idioma", "Som"],
    fr: ["Paramètres", "Langue", "Son"],
    de: ["Einstellungen", "Sprache", "Ton"],
    it: ["Impostazioni", "Lingua", "Audio"],
    ru: ["Настройки", "Язык", "Звук"],
    hi: ["सेटिंग्स", "भाषा", "ध्वनि"],
    ar: ["الإعدادات", "اللغة", "الصوت"],
  };

  const MAIN_SELECTORS = [
    "#main", "#mainScreen", "[data-screen='main']", ".main-screen",
    ".main-canvas", "main.main",
  ];
  const STAGE_SELECTORS = [
    "#stage", "#stageScreen", "[data-screen='stage']", ".stage-screen",
    ".stage-panel", "[data-wp-standard-stage-screen]",
  ];
  const HEADER_SELECTORS = [
    ".main-header", ".topbar", ".stage-header", ".stage-panel-head", ".stage-shell-head",
    "header",
  ];
  const RETURN_SELECTORS = [
    "[data-wp-return]", ".lobby-return", ".return", ".back", "[data-back]",
    "a[href='/']", "a[href='/kids/']",
  ];
  const MAIN_START_SELECTORS = [
    "[data-wp-main-start]", ".standard-main-start", "#startGameBtn", "#startGame",
    "#startBtn", "#start", "#playBtn", "#beginBtn", "#showStageBtn",
    "button[data-start-game]",
  ];
  const MAIN_POSTER_SELECTORS = [
    ".wonder-main-cover", "img.cover", "img.main-cover", "img.main-poster",
    "img.menu-poster", "img.poster", ".poster img", ".main-cover img", ".hero img", ".menu-hero img",
    ".poster-wrap > img", "picture img",
  ];
  const MAIN_SUMMARY_SELECTORS = [
    ".wp-standard-main-summary", ".main-summary", ".main-description", ".summary", ".tagline",
    "[data-ui='menuHint']", "#menuHint", ".menu-copy p", ".hero-copy p",
    ".poster-copy p", ".poster-copy strong", ".main-copy p", "#intro",
  ];
  const MAIN_PROGRESS_SELECTORS = [
    ".main-progress", "#mainProgress", ".campaign-progress", ".stage-progress",
    "#progress", "[data-wp-main-progress]",
  ];
  const STAGE_CARD_SELECTORS = [
    ".stage-card", ".mission-card", ".route-card", ".region-card", ".day-card",
    ".raid-card", ".zone-card", ".expedition-card", ".merge-stage-card",
    ".page-card", ".challenge", ".zone-node",
  ];
  const STAGE_RAIL_SELECTORS = [
    "[data-wp-stage-rail]", "#stageRail", "#levelGrid", "#missionGrid", "#routeRail",
    "#regionRail", "#dayRail", "#stageGrid", "#zoneRow", "#expeditionRail",
    ".stage-rail", ".world-map-grid",
  ];

  function ensureStageSelectorRuntime() {
    if (!STAGE_RAIL_SELECTORS.some((selector) => document.querySelector(selector))) return;
    if (!document.querySelector('link[href*="stage-selector-standard.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = new URL("stage-selector-standard.css", sharedAssetBase).href;
      link.dataset.wpStageStandard = "true";
      document.head.append(link);
    }
    if (!document.querySelector('script[src*="stage-selector-standard.js"]')) {
      const script = document.createElement("script");
      script.src = new URL("stage-selector-standard.js", sharedAssetBase).href;
      script.dataset.wpStageStandard = "true";
      document.body.append(script);
    }
  }
  const PROGRESS_LABEL = {
    en: "Stage", "zh-Hant": "關卡", "zh-Hans": "关卡", ja: "ステージ",
    ko: "스테이지", es: "Nivel", "pt-BR": "Fase", fr: "Niveau",
    de: "Level", it: "Livello", ru: "Уровень", hi: "स्तर", ar: "المرحلة",
  };

  let host;
  let button;
  let popover;
  let title;
  let languageRow;
  let soundRow;
  let localeOwner;
  let soundToggle;
  let currentHeader;
  let generatedTitle;

  function visible(element) {
    if (!element || element.hidden) return false;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return false;
    return Boolean(element.getClientRects().length);
  }

  function first(selectors, root = document) {
    for (const selector of selectors) {
      const match = root.querySelector(selector);
      if (match) return match;
    }
    return null;
  }

  function firstVisible(selectors, root = document) {
    for (const selector of selectors) {
      const match = [...root.querySelectorAll(selector)].find(visible);
      if (match) return match;
    }
    return null;
  }

  function localeCode() {
    const raw = window.WonderI18n?.actualLocale?.()
      || window.WonderI18n?.locale?.()
      || document.documentElement.lang
      || "en";
    if (/^zh-(tw|hant)/i.test(raw)) return "zh-Hant";
    if (/^zh/i.test(raw)) return "zh-Hans";
    if (/^pt/i.test(raw)) return "pt-BR";
    return COPY[raw] ? raw : raw.split("-")[0];
  }

  function updateCopy() {
    const copy = COPY[localeCode()] || COPY.en;
    title.textContent = copy[0];
    button.setAttribute("aria-label", copy[0]);
    popover.setAttribute("aria-label", copy[0]);
    languageRow.querySelector("span").textContent = copy[1];
    soundRow.querySelector("span").textContent = copy[2];
  }

  function build() {
    window.__weightPlayShellControlsPhase = "build";
    host = document.createElement("div");
    host.className = "wp-shell-settings";
    host.dataset.wpSettings = "true";
    host.dataset.wpSettingsControl = "true";

    button = document.createElement("button");
    button.type = "button";
    button.className = "wp-shell-settings-button";
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.25A3.75 3.75 0 1 0 12 15.75 3.75 3.75 0 0 0 12 8.25Z"/><path d="M19.1 13.4a7.4 7.4 0 0 0 .05-2.8l2-1.55-2-3.45-2.5 1a7.8 7.8 0 0 0-2.4-1.4L13.9 2.5h-4l-.4 2.7a7.8 7.8 0 0 0-2.4 1.4l-2.5-1-2 3.45 2 1.55a7.4 7.4 0 0 0 .05 2.8l-2.05 1.55 2 3.45 2.55-1a7.5 7.5 0 0 0 2.35 1.35l.4 2.75h4l.4-2.75a7.5 7.5 0 0 0 2.35-1.35l2.55 1 2-3.45-2.1-1.55Z"/></svg>';

    popover = document.createElement("div");
    popover.className = "wp-shell-settings-popover";
    popover.hidden = true;
    popover.setAttribute("role", "group");

    title = document.createElement("strong");
    title.className = "wp-shell-settings-title";

    languageRow = document.createElement("label");
    languageRow.className = "wp-shell-settings-row wp-shell-language-row";
    languageRow.innerHTML = "<span></span>";

    soundRow = document.createElement("div");
    soundRow.className = "wp-shell-settings-row wp-shell-sound-row";
    soundRow.innerHTML = "<span></span>";

    popover.append(title, languageRow, soundRow);
    host.append(button, popover);

    button.addEventListener("click", () => setOpen(popover.hidden));
    document.addEventListener("pointerdown", (event) => {
      if (!popover.hidden && !host.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !popover.hidden) setOpen(false, true);
    });
    window.addEventListener("wonder:locale-change", updateCopy);
    updateCopy();
  }

  function setOpen(open, restoreFocus) {
    popover.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    if (!open && restoreFocus) button.focus({ preventScroll: true });
  }

  function findLocaleOwner() {
    const select = document.querySelector(
      "#locale,#localeSelect,#languageSelect,#langSelect,select[id*='locale' i],select[id*='language' i],select[data-locale],select[data-language]"
    );
    if (!select) return null;
    return select.closest("label,.language-picker,.locale-picker,.locale-control,.locale,.lang-switch") || select;
  }

  function adoptControls() {
    if (!localeOwner || !localeOwner.isConnected) localeOwner = findLocaleOwner();
    if (localeOwner && !languageRow.contains(localeOwner)) {
      localeOwner.classList.remove("wp-shell-legacy-control");
      languageRow.append(localeOwner);
    }

    const candidate = document.querySelector("button[data-sound-toggle]");
    if (candidate && candidate !== soundToggle) soundToggle = candidate;
    if (soundToggle && !soundRow.contains(soundToggle)) soundRow.append(soundToggle);

    languageRow.hidden = !localeOwner;
    soundRow.hidden = !soundToggle;
  }

  function activeScreen() {
    const stages = STAGE_SELECTORS.map((selector) => document.querySelector(selector)).filter(Boolean);
    const stage = stages.find(visible);
    if (stage) return { type: "stage", screen: stage };
    const mains = MAIN_SELECTORS.map((selector) => document.querySelector(selector)).filter(Boolean);
    return { type: "main", screen: mains.find(visible) || mains[0] || document.body };
  }

  function normalizeReturn(header) {
    const control = first(RETURN_SELECTORS, header);
    if (!control) return;
    control.classList.add("wp-shell-return");
    if (!control.dataset.wpReturn) {
      control.dataset.wpReturn = header.classList.contains("wp-stage-shell-header") ? "stage" : "main";
    }
    [...control.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && /^[\s←‹⟵]+$/.test(node.textContent || "")) {
        node.remove();
      }
    });
    let arrow = control.querySelector(".wp-shell-return-arrow");
    if (!arrow) {
      const existing = [...control.querySelectorAll("span")].find((node) => /[←‹⟵]/.test(node.textContent || ""));
      if (existing) {
        arrow = existing;
        arrow.classList.add("wp-shell-return-arrow");
      }
    }
    if (!arrow) {
      arrow = document.createElement("span");
      arrow.className = "wp-shell-return-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "←";
      control.prepend(arrow);
    }
    if (!control.querySelector("img")) {
      const logo = document.createElement("img");
      logo.src = "../../assets/weightplay-logo.png";
      logo.alt = "";
      control.append(logo);
    }
  }

  function normalizeBattleReturns() {
    document.querySelectorAll(
      "#battle,#battleScreen,#battleView,[data-screen='battle'],.battle-screen",
    ).forEach((screen) => {
      const header = first(HEADER_SELECTORS, screen);
      if (!header) return;
      normalizeReturn(header);
      const control = first(RETURN_SELECTORS, header);
      if (control) control.dataset.wpReturn = "battle";
    });
  }

  function conciseCopy(text) {
    const normalized = (text || "").replace(/\s+/g, " ").trim();
    if (!normalized) return "";
    const cjk = (normalized.match(/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/g) || []).length;
    if (cjk) return normalized.length <= 48 ? normalized : `${normalized.slice(0, 47).trim()}…`;
    const words = normalized.split(/\s+/);
    const wordLimited = words.length <= 24 ? normalized : `${words.slice(0, 24).join(" ").replace(/[,:;.!?]+$/, "")}…`;
    if (wordLimited.length <= 150) return wordLimited;
    const clipped = wordLimited.slice(0, 149).replace(/\s+\S*$/, "").replace(/[,:;.!?]+$/, "");
    return `${clipped}…`;
  }

  function directBranch(root, node) {
    let branch = node;
    while (branch?.parentElement && branch.parentElement !== root) branch = branch.parentElement;
    return branch?.parentElement === root ? branch : null;
  }

  function normalizeMainLayout(screen) {
    if (!screen) return;
    let start = firstVisible(MAIN_START_SELECTORS, screen);
    let poster = firstVisible(MAIN_POSTER_SELECTORS, screen);
    const existingStandardScreen = start?.closest(".wp-standard-main-screen");
    if (existingStandardScreen?.contains(poster)) {
      const existingSummary = first(MAIN_SUMMARY_SELECTORS, existingStandardScreen);
      if (existingSummary) existingSummary.textContent = conciseCopy(existingSummary.textContent);
      ensureMainProgress(existingStandardScreen);
      return;
    }
    if ((screen === document.body || screen === document.documentElement) && start && poster) {
      const ancestors = new Set();
      for (let node = poster.parentElement; node && node !== document.body; node = node.parentElement) ancestors.add(node);
      for (let node = start.parentElement; node && node !== document.body; node = node.parentElement) {
        if (ancestors.has(node)) {
          screen = node;
          break;
        }
      }
    }
    if (screen.classList.contains("wp-standard-main-screen")) return;
    start = firstVisible(MAIN_START_SELECTORS, screen);
    poster = firstVisible(MAIN_POSTER_SELECTORS, screen);
    if (!start || !poster) return;

    const guide = firstVisible([".public-guide", ".game-page-info", ".guide"], screen);
    let summary = firstVisible(MAIN_SUMMARY_SELECTORS, screen);
    const progress = firstVisible(MAIN_PROGRESS_SELECTORS, screen);
    const originalBranches = new Set([
      directBranch(screen, poster),
      directBranch(screen, start),
      summary ? directBranch(screen, summary) : null,
      progress ? directBranch(screen, progress) : null,
    ].filter(Boolean));

    const composition = document.createElement("section");
    composition.className = "wp-standard-main-composition";
    const posterPane = document.createElement("div");
    posterPane.className = "wp-standard-main-poster";
    const copyPane = document.createElement("div");
    copyPane.className = "wp-standard-main-copy";

    const posterNode = poster.closest("picture") || poster;
    posterNode.classList.add("wp-standard-main-poster-media");
    posterPane.append(posterNode);

    if (!summary || guide?.contains(summary)) {
      const guideCopy = firstVisible([".game-page-info p", ".public-guide p", ".guide p"], document);
      summary = document.createElement("p");
      summary.textContent = conciseCopy(guideCopy?.textContent || poster.getAttribute("alt") || document.title);
    }
    summary.classList.add("wp-standard-main-summary");
    summary.textContent = conciseCopy(summary.textContent);
    copyPane.append(summary);
    if (progress && !guide?.contains(progress)) {
      progress.classList.add("wp-standard-main-progress");
      copyPane.append(progress);
    }
    start.classList.add("wp-standard-main-start");
    start.style.setProperty("width", "100%", "important");
    start.style.setProperty("height", "52px", "important");
    start.style.setProperty("min-height", "52px", "important");
    start.style.setProperty("max-height", "52px", "important");
    copyPane.append(start);
    composition.append(posterPane, copyPane);

    const header = firstVisible(HEADER_SELECTORS, screen);
    if (header?.nextSibling) header.after(composition);
    else screen.prepend(composition);

    originalBranches.forEach((branch) => {
      const movedDirectly = branch === posterNode || branch === start || branch === summary || branch === progress;
      if (!movedDirectly && branch !== header && branch !== guide && branch !== composition && !branch.contains(composition)) {
        branch.classList.add("wp-main-legacy-layout");
      }
    });
    [...screen.children].forEach((child) => {
      if (/^H[1-3]$/.test(child.tagName) && child !== header && !composition.contains(child)) {
        child.classList.add("wp-main-legacy-layout");
      }
    });
    screen.classList.add("wp-standard-main-screen");
    ensureMainProgress(screen);
  }

  function ensureMainProgress(screen) {
    const copy = screen?.querySelector(".wp-standard-main-copy");
    const start = copy && first(MAIN_START_SELECTORS, copy);
    if (!copy || !start) return;
    const existingProgress = first(MAIN_PROGRESS_SELECTORS, copy);
    if (existingProgress && existingProgress.dataset.wpMainProgress !== "generated") return;
    const cards = STAGE_CARD_SELECTORS.flatMap((selector) => [...document.querySelectorAll(selector)])
      .filter((card, index, all) => all.indexOf(card) === index);
    const ownsStage = STAGE_RAIL_SELECTORS.some((selector) => document.querySelector(selector));
    if (cards.length < 2 && !ownsStage) return;
    const total = cards.length >= 2 ? cards.length : 30;
    const unlocked = cards.filter((card) => (
      !card.disabled
      && card.getAttribute("aria-disabled") !== "true"
      && !card.classList.contains("locked")
      && !card.classList.contains("is-locked")
    )).length;
    const progress = existingProgress || document.createElement("div");
    progress.classList.add("wp-standard-main-progress");
    progress.dataset.wpMainProgress = "generated";
    progress.textContent = `${PROGRESS_LABEL[localeCode()] || PROGRESS_LABEL.en} ${Math.max(1, unlocked)} / ${total}`;
    if (!existingProgress) copy.insertBefore(progress, start);
  }

  function place() {
    adoptControls();
    normalizeBattleReturns();
    const { type, screen } = activeScreen();
    if (type === "main") normalizeMainLayout(screen);
    let header = firstVisible(HEADER_SELECTORS, screen) || firstVisible(HEADER_SELECTORS, document);
    if (!header && type === "main") {
      header = document.createElement("header");
      header.className = "wp-generated-main-header";
      screen.prepend(header);
    }
    if (!header) return;
    const externalReturn = firstVisible(RETURN_SELECTORS, screen);
    if (externalReturn && !header.contains(externalReturn)) header.prepend(externalReturn);
    if (!header.classList.contains("wp-generated-main-header")) {
      screen.querySelectorAll(".wp-generated-main-header").forEach((generatedHeader) => {
        if (generatedHeader !== header) generatedHeader.remove();
      });
      if (generatedTitle && !generatedTitle.isConnected) generatedTitle = null;
    }
    if (header.classList.contains("wp-generated-main-header")) {
      const sourceTitle = [...screen.querySelectorAll("h1")].find(visible);
      if (!generatedTitle) {
        generatedTitle = document.createElement("strong");
        generatedTitle.className = "wp-generated-main-title";
      }
      generatedTitle.textContent = sourceTitle?.textContent?.trim() || document.title.split(/[|\-]/)[0].trim();
      generatedTitle.setAttribute("aria-label", generatedTitle.textContent);
      if (generatedTitle.parentElement !== header) header.append(generatedTitle);
    }
    if (!firstVisible(["h1", "h2", "strong"], header)) {
      const sourceTitle = [...screen.querySelectorAll("h1,h2")].find((node) => visible(node) && !header.contains(node));
      if (!generatedTitle) {
        generatedTitle = document.createElement("strong");
        generatedTitle.className = "wp-generated-main-title";
      }
      generatedTitle.textContent = sourceTitle?.textContent?.trim() || document.title.split(/[|\-]/)[0].trim();
      generatedTitle.setAttribute("aria-label", generatedTitle.textContent);
      header.append(generatedTitle);
    }
    const canonicalTitle = firstVisible([".wp-generated-main-title", "h1", "h2", "strong"], header);
    if (canonicalTitle && !canonicalTitle.closest(".wp-shell-settings,.wp-shell-return")) {
      canonicalTitle.classList.add("wp-shell-main-title");
      if (canonicalTitle.parentElement !== header) header.append(canonicalTitle);
    }
    if (header !== currentHeader || host.parentElement !== header) {
      currentHeader?.classList.remove("wp-shell-header", "wp-main-shell-header", "wp-stage-shell-header");
      currentHeader = header;
      header.classList.add("wp-shell-header", type === "stage" ? "wp-stage-shell-header" : "wp-main-shell-header");
      normalizeReturn(header);
      header.append(host);
      setOpen(false);
    }
    host.dataset.screenOwner = type;
    host.hidden = type === "stage" && !soundToggle;
  }

  function init() {
    window.__weightPlayShellControlsPhase = "init";
    ensureStageSelectorRuntime();
    build();
    place();
    const observer = new MutationObserver(() => requestAnimationFrame(place));
    observer.observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["hidden", "class", "data-screen", "style"],
    });
    window.addEventListener("resize", place);
    window.addEventListener("load", place, { once: true });
    setTimeout(place, 0);
    setTimeout(place, 300);
    setTimeout(place, 1000);
    setTimeout(place, 1800);
    setTimeout(place, 3200);
    setTimeout(place, 4800);
    let recoveryAttempts = 0;
    const recoveryTimer = setInterval(() => {
      place();
      recoveryAttempts += 1;
      if (recoveryAttempts >= 20) clearInterval(recoveryTimer);
    }, 250);
  }

  let initialized = false;
  let beginAttempts = 0;
  function begin() {
    window.__weightPlayShellControlsPhase = "begin";
    if (initialized) return;
    if (!document.body) {
      beginAttempts += 1;
      if (beginAttempts < 100) setTimeout(begin, 50);
      return;
    }
    initialized = true;
    init();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", begin, { once: true });
  }
  setTimeout(begin, 0);
  if (document.readyState !== "loading") begin();
})();
