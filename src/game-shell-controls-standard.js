(function () {
  "use strict";

  if (window.__weightPlayShellControlsInstalled) return;
  window.__weightPlayShellControlsInstalled = true;

  const COPY = {
    en: ["Settings", "Language", "Sound"],
    "zh-Hant": ["設定", "語言", "音效"],
    "zh-Hans": ["设置", "语言", "音效"],
    ja: ["設定", "言語", "サウンド"],
    ko: ["설정", "언어", "사운드"],
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
    "[data-wp-standard-stage-screen]",
  ];
  const HEADER_SELECTORS = [
    ".main-header", ".topbar", ".stage-header", ".stage-panel-head",
    "header",
  ];
  const RETURN_SELECTORS = [
    "[data-wp-return]", ".lobby-return", ".return", ".back", "[data-back]",
  ];

  let host;
  let button;
  let popover;
  let title;
  let languageRow;
  let soundRow;
  let localeOwner;
  let soundToggle;
  let currentHeader;

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
      "#locale,#localeSelect,#languageSelect,#langSelect,select[data-locale],select[data-language]"
    );
    if (!select) return null;
    return select.closest("label,.language-picker,.locale-control,.locale,.lang-switch") || select;
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

  function place() {
    adoptControls();
    const { type, screen } = activeScreen();
    const header = first(HEADER_SELECTORS, screen);
    if (!header) return;
    if (header !== currentHeader) {
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
    build();
    place();
    const observer = new MutationObserver(() => requestAnimationFrame(place));
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["hidden", "class", "data-screen", "style"],
    });
    window.addEventListener("resize", place);
    setTimeout(place, 0);
    setTimeout(place, 300);
    setTimeout(place, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
