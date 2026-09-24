(function () {
  "use strict";

  const copy = window.CUSHION_LOCALES || {};
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const localeLabels = { en: "English", "zh-Hant": "繁體中文", "zh-Hans": "简体中文", ja: "日本語", ko: "한국어", es: "Español", "pt-BR": "Português", fr: "Français", de: "Deutsch", it: "Italiano", ru: "Русский", hi: "हिन्दी", ar: "العربية" };
  const openingStages = [
    {
      title: "stageTitle1", hint: "stageHint1",
      placements: [
        { support: 96, role: "floor", correct: "snug", options: [{ key: "wide", name: "wide", size: 116, tone: "rose" }, { key: "snug", name: "snug", size: 82, tone: "blue" }, { key: "tiny", name: "tiny", size: 42, tone: "gold" }] },
        { support: 82, role: "middle", correct: "cloud", options: [{ key: "wide", name: "wide", size: 103, tone: "gold" }, { key: "cloud", name: "cloud", size: 70, tone: "rose" }, { key: "tiny", name: "tiny", size: 38, tone: "blue" }] },
        { support: 70, role: "top", correct: "flag", options: [{ key: "wide", name: "wide", size: 82, tone: "blue" }, { key: "flag", name: "flag", size: 56, tone: "gold" }, { key: "tiny", name: "tiny", size: 30, tone: "rose" }] }
      ]
    },
    {
      title: "stageTitle2", hint: "stageHint2",
      placements: [
        { support: 100, role: "floor", correct: "leaf", options: [{ key: "wide", name: "wide", size: 121, tone: "rose" }, { key: "leaf", name: "leaf", size: 88, tone: "green" }, { key: "tiny", name: "tiny", size: 44, tone: "gold" }] },
        { support: 88, role: "middle", correct: "cloud", options: [{ key: "wide", name: "wide", size: 104, tone: "blue" }, { key: "cloud", name: "cloud", size: 76, tone: "rose" }, { key: "tiny", name: "tiny", size: 41, tone: "gold" }] },
        { support: 76, role: "top", correct: "moon", options: [{ key: "wide", name: "wide", size: 88, tone: "gold" }, { key: "moon", name: "moon", size: 61, tone: "blue" }, { key: "tiny", name: "tiny", size: 32, tone: "rose" }] }
      ]
    },
    {
      title: "stageTitle3", hint: "stageHint3",
      placements: [
        { support: 106, role: "floor", correct: "snug", options: [{ key: "wide", name: "wide", size: 128, tone: "blue" }, { key: "snug", name: "snug", size: 94, tone: "rose" }, { key: "tiny", name: "tiny", size: 48, tone: "gold" }] },
        { support: 94, role: "middle", correct: "leaf", options: [{ key: "wide", name: "wide", size: 111, tone: "gold" }, { key: "leaf", name: "leaf", size: 81, tone: "green" }, { key: "tiny", name: "tiny", size: 43, tone: "blue" }] },
        { support: 81, role: "top", correct: "flag", options: [{ key: "wide", name: "wide", size: 92, tone: "rose" }, { key: "flag", name: "flag", size: 66, tone: "gold" }, { key: "tiny", name: "tiny", size: 34, tone: "blue" }] }
      ]
    }
  ];
  const blockKeys = ["wide", "snug", "tiny", "cloud", "leaf", "moon", "flag"];
  const blockTones = { wide: "green", snug: "blue", tiny: "gold", cloud: "rose", leaf: "green", moon: "blue", flag: "gold" };
  const atlasFrames = {
    wide: { x: 18, y: 24, w: 796, h: 392 }, snug: { x: 842, y: 28, w: 390, h: 386 },
    tiny: { x: 18, y: 438, w: 492, h: 372 }, cloud: { x: 344, y: 430, w: 516, h: 382 },
    leaf: { x: 884, y: 426, w: 352, h: 390 }, moon: { x: 16, y: 820, w: 598, h: 418 },
    flag: { x: 680, y: 818, w: 554, h: 420 },
  };
  const campaignPlans = [
    { base: 118, shapes: ["wide", "leaf", "cloud", "flag"], shrink: [13, 12, 11, 10], braceAt: [1], braceShape: "moon" },
    { base: 122, shapes: ["wide", "moon", "cloud", "leaf", "flag"], shrink: [13, 12, 11, 10, 9], braceAt: [2], braceShape: "tiny" },
    { base: 126, shapes: ["wide", "snug", "tiny", "moon", "flag"], shrink: [14, 12, 11, 10, 9], braceAt: [2], braceShape: "cloud" },
    { base: 120, shapes: ["wide", "cloud", "flag", "moon"], shrink: [12, 10, 12, 9] },
    { base: 124, shapes: ["wide", "leaf", "moon", "cloud", "flag"], shrink: [13, 12, 10, 10, 9] },
    { base: 128, shapes: ["wide", "moon", "snug", "leaf"], shrink: [13, 11, 12, 9], braceAt: [2], braceShape: "tiny" },
    { base: 130, shapes: ["wide", "cloud", "moon", "snug", "flag"], shrink: [14, 12, 11, 10, 9], braceAt: [3], braceShape: "wide" },
    { base: 132, shapes: ["wide", "leaf", "cloud", "moon"], shrink: [14, 12, 11, 9], braceAt: [1], braceShape: "tiny" },
    { base: 134, shapes: ["wide", "tiny", "moon", "cloud", "flag"], shrink: [14, 12, 11, 10, 9], braceAt: [3], braceShape: "leaf" },
    { base: 136, shapes: ["wide", "snug", "leaf", "cloud", "moon", "flag"], shrink: [14, 12, 11, 10, 9, 8], braceAt: [2, 4], braceShape: "tiny" },
    { base: 130, shapes: ["wide", "moon", "wide", "leaf"], shrink: [13, 11, 12, 9], braceAt: [2], braceShape: "tiny" },
    { base: 134, shapes: ["wide", "cloud", "wide", "snug", "flag"], shrink: [14, 12, 11, 10, 9], braceAt: [3], braceShape: "moon" },
    { base: 138, shapes: ["wide", "leaf", "snug", "leaf", "flag"], shrink: [14, 12, 11, 10, 9], braceAt: [2], braceShape: "cloud" },
    { base: 140, shapes: ["wide", "moon", "cloud", "moon", "flag"], shrink: [14, 12, 11, 10, 9], braceAt: [3], braceShape: "tiny" },
    { base: 142, shapes: ["wide", "tiny", "snug", "tiny", "cloud", "flag"], shrink: [15, 13, 12, 11, 10, 9], braceAt: [3, 4], braceShape: "leaf" },
    { base: 134, shapes: ["wide", "leaf", "moon", "snug"], shrink: [13, 11, 12, 9], braceAt: [2], braceShape: "tiny" },
    { base: 138, shapes: ["wide", "cloud", "leaf", "moon", "flag"], shrink: [14, 12, 11, 10, 9], braceAt: [3], braceShape: "tiny" },
    { base: 142, shapes: ["wide", "moon", "cloud", "leaf"], shrink: [14, 12, 11, 9], braceAt: [2], braceShape: "snug" },
    { base: 146, shapes: ["wide", "snug", "moon", "cloud", "leaf", "flag"], shrink: [15, 13, 12, 11, 10, 9], braceAt: [3, 4], braceShape: "tiny" },
    { base: 148, shapes: ["wide", "leaf", "cloud", "snug", "moon", "flag"], shrink: [15, 13, 12, 11, 10, 9], braceAt: [2, 4], braceShape: "tiny" },
    { base: 140, shapes: ["wide", "moon", "cloud", "leaf", "moon"], shrink: [14, 12, 11, 10, 9], braceAt: [2], braceShape: "tiny" },
    { base: 144, shapes: ["wide", "leaf", "snug", "cloud", "snug", "flag"], shrink: [14, 12, 11, 10, 9, 8], braceAt: [3, 4], braceShape: "moon" },
    { base: 148, shapes: ["wide", "cloud", "moon", "cloud", "leaf"], shrink: [15, 13, 12, 11, 9], braceAt: [2, 4], braceShape: "tiny" },
    { base: 152, shapes: ["wide", "tiny", "moon", "tiny", "cloud", "flag"], shrink: [15, 13, 12, 11, 10, 9], braceAt: [3, 4], braceShape: "leaf" },
    { base: 156, shapes: ["wide", "leaf", "cloud", "moon", "snug", "flag"], shrink: [16, 14, 12, 11, 10, 9], braceAt: [2, 4], braceShape: "tiny" },
    { base: 160, shapes: ["wide", "moon", "snug", "leaf", "cloud", "tiny"], shrink: [16, 14, 13, 12, 11, 10], braceAt: [3, 4], braceShape: "flag" },
    { base: 164, shapes: ["wide", "cloud", "leaf", "moon", "snug", "tiny", "flag"], shrink: [16, 14, 13, 12, 11, 10, 9], braceAt: [3, 4], braceShape: "flag" },
  ];
  const opening = openingStages.map((stage, index) => ({ ...stage, id: index + 1, lookout: index % 3, checkpoint: false }));
  const authoredStages = campaignPlans.map((plan, index) => {
    const stageId = index + 4;
    let support = plan.base;
    const placements = plan.shapes.map((key, step) => {
      const correctSize = Math.max(28, support - plan.shrink[step]);
      const assisted = plan.braceAt?.includes(step) ? plan.braceShape : null;
      const decoys = blockKeys.filter((candidate) => candidate !== key && candidate !== assisted);
      const selected = [
        { key, name: key, size: correctSize, tone: blockTones[key] },
        ...(assisted ? [{ key: assisted, name: assisted, size: support + 12, tone: blockTones[assisted] }] : []),
        { key: decoys[(stageId + step) % decoys.length], name: decoys[(stageId + step) % decoys.length], size: Math.max(28, correctSize - 20), tone: blockTones[decoys[(stageId + step) % decoys.length]] },
      ];
      while (selected.length < 3) {
        const candidate = decoys.find((shape) => !selected.some((option) => option.key === shape));
        selected.push({ key: candidate, name: candidate, size: support + 34, tone: blockTones[candidate] });
      }
      const options = selected.map((option) => ({ ...option }));
      const offset = (stageId + step) % options.length;
      options.push(...options.splice(0, offset));
      const placement = {
        support,
        role: ["floor", "middle", "top"][step % 3],
        correct: key,
        assistedCorrect: assisted,
        options,
      };
      support = correctSize;
      return placement;
    });
    return {
      id: stageId,
      lookout: (stageId - 1) % 3,
      checkpoint: stageId % 5 === 0,
      arc: Math.ceil(stageId / 5),
      title: `stageTitle${((stageId - 1) % 3) + 1}`,
      hint: `stageHint${((stageId - 1) % 3) + 1}`,
      placements,
    };
  });
  const stages = [...opening, ...authoredStages];
  const spriteStyle = (key, width = 42, height = 42) => {
    const frame = atlasFrames[key] || atlasFrames.snug;
    const scale = Math.min(width / frame.w, height / frame.h);
    return `--block-atlas-scale:${scale.toFixed(4)};--block-atlas-left:${(-frame.x * scale).toFixed(2)}px;--block-atlas-top:${(-frame.y * scale).toFixed(2)}px`;
  };
  const routedLocale = window.WonderI18n?.localeFromPath?.();
  const savedLocale = (() => { try { return localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale"); } catch (error) { return null; } })();
  const normalizeLocale = (value) => value === "zh-TW" ? "zh-Hant" : supportedLocales.includes(value) ? value : "en";
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeLocale = routeLocaleMap[window.location.pathname.match(/^\/(en|zh-tw|zh-cn|ja|ko|es|pt-br|fr|de|it|ru|hi|ar)(?:\/|$)/i)?.[1]?.toLowerCase()];
  const state = { locale: normalizeLocale(routeLocale || routedLocale || savedLocale || window.WonderI18n?.actualLocale?.() || document.documentElement.lang), stage: 0, step: 0, placed: [], selected: null, totalPicks: 0, stagePicks: 0, finished: false, sound: !window.WeightPlayAudio.isMuted(), storage: true, status: "", campaign: null, stageBrowseIndex: 0, runStartStage: 0, braceActive: false, stageSelector: null };
  window.addEventListener("weightplay:audio-volume-change", () => { state.sound = !window.WeightPlayAudio.isMuted(); });
  const $ = (id) => document.getElementById(id);
  const screens = { main: $("mainScreen"), stages: $("stageScreen"), battle: $("battleScreen"), result: $("resultScreen") };
  const t = (key, vars) => { const table = copy[state.locale] || copy.en || {}; let value = table[key] || (copy.en && copy.en[key]) || key; Object.keys(vars || {}).forEach((name) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(vars[name])); }); return value; };
  const campaignSaveKey = "weightplay-animal-cushion-stack-campaign-v1";
  const readCampaign = () => {
    const blank = { unlocked: 1, cleared: Array(stages.length).fill(false), cloudCharges: 0 };
    try {
      const saved = JSON.parse(localStorage.getItem(campaignSaveKey) || "null");
      if (!saved) {
        const legacyBest = Number(localStorage.getItem("weightplay-animal-cushion-stack-best-v2"));
        if (Number.isFinite(legacyBest) && legacyBest > 0) {
          const cleared = Array(stages.length).fill(false);
          cleared.fill(true, 0, 3);
          localStorage.setItem(campaignSaveKey, JSON.stringify({ version: 1, unlocked: 4, cleared, cloudCharges: 1, cloudGrantVersion: 1 }));
          return { unlocked: 4, cleared, cloudCharges: 1 };
        }
        return blank;
      }
      if (saved.version !== 1 || !Array.isArray(saved.cleared)) return blank;
      const cleared = Array.from({ length: stages.length }, (_, index) => saved.cleared[index] === true);
      const clearedPrefix = cleared.findIndex((value) => !value);
      const sequentialUnlock = clearedPrefix < 0 ? stages.length : Math.min(stages.length, clearedPrefix + 1);
      const unlocked = Math.max(1, Math.min(sequentialUnlock, Math.trunc(Number(saved.unlocked) || 1)));
      const cloudCharges = Number(saved.cloudCharges) > 0 ? 1 : 0;
      const chapterChargeMigration = saved.cloudGrantVersion !== 1 && cleared[2] && unlocked >= 4 && cloudCharges === 0;
      if (chapterChargeMigration) localStorage.setItem(campaignSaveKey, JSON.stringify({ ...saved, unlocked, cleared, cloudCharges: 1, cloudGrantVersion: 1 }));
      return { unlocked, cleared, cloudCharges: cloudCharges || Number(chapterChargeMigration) };
    } catch (error) {
      if (error instanceof SyntaxError) return blank;
      state.storage = false;
      return blank;
    }
  };
  state.campaign = readCampaign();
  const saveCampaign = () => {
    try {
      localStorage.setItem(campaignSaveKey, JSON.stringify({ version: 1, unlocked: state.campaign.unlocked, cleared: state.campaign.cleared, cloudCharges: state.campaign.cloudCharges, cloudGrantVersion: 1 }));
    } catch (error) { state.storage = false; }
  };
  const staticGuideCopy = {
    en: { aria: "Cushion Stack game information", kicker: "WeightPlay Original Game Guide", title: "Cushion Stack", intro: "Choose the next soft block and build a safe little lookout for Taro.", gameplayLabel: "Gameplay", gameplay: "Balance Stacking Puzzle", genreLabel: "Genre", genre: "Puzzle · Construction · Spatial Planning · Family · Animal", faqTitle: "FAQ", faqQuestion: "Is progress saved?", faqAnswer: "Yes, only in this browser.", atlasAlt: "Seven soft block shapes: wide, snug, tiny, cloud, leaf, moon, and flag", atlasCaption: "Seven soft shapes to build with." },
    ar: { aria: "معلومات لعبة رصّ الوسائد", kicker: "دليل ألعاب WeightPlay الأصلية", title: "رصّ الوسائد", intro: "اختر الوسادة اللينة التالية وابنِ برج مراقبة آمنًا لتارو.", gameplayLabel: "طريقة اللعب", gameplay: "لغز التكديس المتوازن", genreLabel: "النوع", genre: "لغز · بناء · تخطيط مكاني · عائلي · حيوانات", faqTitle: "الأسئلة الشائعة", faqQuestion: "هل يُحفظ التقدم؟", faqAnswer: "نعم، في هذا المتصفح فقط.", atlasAlt: "سبعة أشكال من الوسائد اللينة: عريضة، ملائمة، صغيرة، سحابية، ورقية، قمرية، وذات راية", atlasCaption: "سبعة أشكال لينة للبناء." }
  };
  const applyStaticGuideLocale = () => {
    const guide = document.querySelector("section.game-page-info-static");
    const guideCopy = staticGuideCopy[state.locale] || staticGuideCopy.en;
    if (guide) {
      guide.setAttribute("aria-label", guideCopy.aria);
      const kicker = guide.querySelector(".game-info-kicker"); const title = guide.querySelector(".game-info-title h2"); const intro = guide.querySelector(".game-info-title p");
      if (kicker) kicker.textContent = guideCopy.kicker; if (title) title.textContent = guideCopy.title; if (intro) intro.textContent = guideCopy.intro;
      const facts = guide.querySelectorAll(".game-info-fact");
      if (facts[0]) { const label = facts[0].querySelector("span"); const value = facts[0].querySelector("strong"); if (label) label.textContent = guideCopy.gameplayLabel; if (value) value.textContent = guideCopy.gameplay; }
      if (facts[1]) { const label = facts[1].querySelector("span"); const value = facts[1].querySelector("strong"); if (label) label.textContent = guideCopy.genreLabel; if (value) value.textContent = guideCopy.genre; }
      const faq = guide.querySelector(".game-info-faq"); if (faq) { const heading = faq.querySelector("h3"); const question = faq.querySelector("dt"); const answer = faq.querySelector("dd"); if (heading) heading.textContent = guideCopy.faqTitle; if (question) question.textContent = guideCopy.faqQuestion; if (answer) answer.textContent = guideCopy.faqAnswer; }
    }
    const atlas = document.querySelector(".block-atlas"); const caption = document.querySelector(".block-atlas-figure figcaption");
    if (atlas) atlas.alt = guideCopy.atlasAlt; if (caption) caption.textContent = guideCopy.atlasCaption;
  };
  const track = (name, detail) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: "animal_cushion_stack_" + name }, detail || {})); document.dispatchEvent(new CustomEvent("weightplay:cushion-stack", { detail: Object.assign({ name }, detail || {}) })); };
  const beep = (cue = "ui.click") => { return window.WeightPlayAudio?.play(cue); };
  const readBest = () => { try { const value = Number(localStorage.getItem("weightplay-animal-cushion-stack-best-v3")); return Number.isFinite(value) && value > 0 ? value : null; } catch (error) { state.storage = false; return null; } };
  const writeBest = (value) => { try { const current = readBest(); if (!current || value < current) localStorage.setItem("weightplay-animal-cushion-stack-best-v3", String(value)); } catch (error) { state.storage = false; } };
  const show = (name) => { Object.keys(screens).forEach((key) => { screens[key].hidden = key !== name; }); document.body.dataset.screen = name === "stages" ? "stage" : name; };
  const setLocale = (locale) => { state.locale = normalizeLocale(locale); try { localStorage.setItem("weightPlayLocale", state.locale); localStorage.setItem("weightplayLocale", state.locale); } catch (error) { state.storage = false; } applyLocale(); track("locale", { locale: state.locale }); };
  const applyLocale = () => {
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("localeSelect").value = state.locale; $("cushionDialect") && ($("cushionDialect").value = state.locale); $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff"); $("settingsBtn").setAttribute("aria-label", t("settings")); $("settingsPanel").setAttribute("aria-label", t("settings")); $("localeSelect").setAttribute("aria-label", t("language")); $("cushionDialect")?.setAttribute("aria-label", t("language")); $("choiceTray").setAttribute("aria-label", t("chooseBlock")); $("tower").setAttribute("aria-label", t("title")); $("stageInfoBtn").setAttribute("aria-label", t("stageReady")); $("stageInfoBtn").setAttribute("title", t("stageReady")); $("battleInfoBtn").setAttribute("aria-label", t("guideTwo")); $("battleInfoBtn").setAttribute("title", t("guideTwo")); $("stageScreen").querySelector(".stage-tabs")?.setAttribute("aria-label", t("stages")); $("battleHeading").textContent = t("title"); document.querySelector(".main-return")?.setAttribute("aria-label", t("lobbyReturn")); document.querySelector(".return-link")?.setAttribute("aria-label", t("lobbyReturn")); $("bestValue").textContent = readBest() || t("noBest"); $("mainProgress").textContent = t("round", { n: state.campaign.unlocked, total: stages.length }); applyStaticGuideLocale();
    if (!screens.stages.hidden) renderStages(); if (!screens.battle.hidden) renderBattle(); if (!screens.result.hidden) renderResult();
  };
  const bindStageCard = (card, index) => {
    const stage = stages[index]; const locked = index >= state.campaign.unlocked; const cleared = state.campaign.cleared[index];
    card.className = `stage-card${locked ? " is-locked" : ""}${cleared ? " is-cleared" : ""}`;
    card.dataset.stage = String(index); card.setAttribute("aria-disabled", String(locked)); card.setAttribute("aria-label", `${t("round", { n: index + 1, total: stages.length })}: ${t(stage.title)}`);
    card.innerHTML = `<span class="stage-number">${t("round", { n: index + 1, total: stages.length })}</span><h3>${t(stage.title)}</h3><p>${t(stage.hint)}</p><span class="stage-preview" aria-hidden="true">${stage.placements.slice(0, 3).map((placement) => `<i class="block-atlas-crop" style="${spriteStyle(placement.correct, 34, 34)}"></i>`).join("")}</span><span class="stage-chip">${locked ? "🔒" : cleared ? t("lookoutReady") : t("stageReady")}</span>`;
  };
  const renderStages = () => {
    const rail = $("stageList");
    if (!state.stageSelector) state.stageSelector = window.WeightPlayStageV6.install(rail, { total: stages.length, poolSize: 9, initialIndex: () => state.stageBrowseIndex, bind: bindStageCard, onChange: (index) => { state.stageBrowseIndex = index; }, activate: (index) => { if (index < state.campaign.unlocked) startStage(index, false); } });
    else state.stageSelector.refresh();
    state.stageSelector?.center(state.stageBrowseIndex);
  };
  const renderTower = () => { const stage = stages[state.stage]; const blocks = state.placed.map((block) => `<div class="tower-block" data-tone="${block.tone}" style="width:${Math.max(28, Math.min(88, block.size))}%" aria-label="${t(block.name)}"><span class="block-atlas-crop tower-block-art" style="${spriteStyle(block.key, 62, 34)}" aria-hidden="true"></span><span class="tower-block-role">${t(block.role)}</span></div>`).join(""); const current = stage.placements[state.step]; const baseWidth = current ? current.support : 90; $("tower").innerHTML = `${blocks}<div class="tower-ground" style="width:${Math.min(88, baseWidth)}%" aria-hidden="true"></div>`; };
  const renderBattle = () => {
    const stage = stages[state.stage]; const placement = stage.placements[state.step]; $("roundLabel").textContent = t("round", { n: state.stage + 1, total: stages.length }); $("battleHint").textContent = placement ? `${t(stage.hint)} · ${t("support", { n: placement.support })}` : t("lookoutReady"); $("sessionPicks").textContent = String(state.totalPicks); renderTower();
    if (placement) { $("choiceTray").innerHTML = placement.options.map((option) => { const braceOption = option.key === placement.assistedCorrect; return `<button class="choice-btn" type="button" data-choice="${option.key}" data-brace-option="${braceOption}" data-cloud-ready="${braceOption && state.braceActive}" aria-pressed="${state.selected === option.key}"><span class="block-atlas-crop choice-icon" data-tone="${option.tone}" style="${spriteStyle(option.key)}" aria-hidden="true"></span><span><span class="choice-name">${t(option.name)}</span><span class="choice-size">${t("blockSize", { n: option.size })}</span></span>${braceOption ? `<i class="block-atlas-crop cloud-option-mark" style="${spriteStyle("cloud", 20, 20)}" aria-hidden="true"></i>` : ""}</button>`; }).join(""); $("choiceTray").querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => selectChoice(button.dataset.choice))); } else { $("choiceTray").innerHTML = `<p class="battle-status">${t("lookoutReady")}</p>`; }
    const selected = placement?.options.find((option) => option.key === state.selected); $("selectionLabel").textContent = selected ? t("selected", { name: t(selected.name) }) : ""; $("battleStatus").textContent = state.status || (placement ? t("ready") : t("lookoutReady")); $("checkBtn").hidden = state.finished; $("clearBtn").hidden = state.finished; $("advanceBtn").hidden = !state.finished; $("advanceBtn").textContent = state.stage === stages.length - 1 ? t("finishTitle") : t("nextLookout");
    const brace = $("cloudBraceBtn"); brace.hidden = state.campaign.cloudCharges < 1 || state.finished; brace.setAttribute("aria-pressed", String(state.braceActive)); brace.setAttribute("aria-label", `${t("cloud")} ${state.campaign.cloudCharges}`); brace.innerHTML = `<span class="block-atlas-crop" style="${spriteStyle("cloud", 28, 28)}" aria-hidden="true"></span><span>${t("cloud")}</span><b>${state.campaign.cloudCharges}</b>`;
  };
  const renderResult = () => { $("resultHeading").textContent = t("lookoutReady"); $("resultText").textContent = `${t("round", { n: stages.length, total: stages.length })} · ${t("picks")}: ${state.totalPicks}`; $("resultPrimaryBtn").textContent = t("replayLookout"); $("bestValue").textContent = readBest() || t("noBest"); };
  const startStage = (index, continuing = false) => { if (index < 0 || index >= state.campaign.unlocked) return; if (!continuing) { state.totalPicks = 0; state.runStartStage = index; } state.stage = index; state.stageBrowseIndex = index; state.step = 0; state.placed = []; state.selected = null; state.stagePicks = 0; state.finished = false; state.braceActive = false; state.status = ""; show("battle"); applyLocale(); track("start", { stage: index + 1 }); };
  const selectChoice = (key) => { state.selected = key; const choice = stages[state.stage].placements[state.step].options.find((option) => option.key === key); state.status = t("selected", { name: t(choice?.name || key) }); beep("board.move"); renderBattle(); };
  const checkChoice = () => { const placement = stages[state.stage].placements[state.step]; if (!state.selected) { state.status = t("ready"); renderBattle(); return; } state.totalPicks += 1; state.stagePicks += 1; const option = placement.options.find((item) => item.key === state.selected); const assisted = state.braceActive && state.campaign.cloudCharges > 0 && state.selected === placement.assistedCorrect; if (state.selected !== placement.correct && !assisted) { state.status = t("wobbly"); state.selected = null; state.braceActive = false; beep("feedback.error"); track("wobbly", { stage: state.stage + 1, step: state.step + 1 }); renderBattle(); return; } if (assisted) { state.campaign.cloudCharges = 0; saveCampaign(); } state.braceActive = false; state.placed.push({ ...option, key: option.key, role: placement.role }); state.step += 1; state.selected = null; state.status = t("steady"); beep("feedback.success"); track("steady", { stage: state.stage + 1, step: state.step }); if (state.step >= stages[state.stage].placements.length) { state.finished = true; state.status = t("lookoutReady"); const completed = state.stage + 1; state.campaign.cleared[state.stage] = true; state.campaign.unlocked = Math.max(state.campaign.unlocked, Math.min(stages.length, completed + 1)); if (completed === 3 || stages[state.stage].checkpoint) state.campaign.cloudCharges = 1; saveCampaign(); } renderBattle(); };
  const advance = () => { if (!state.finished) return; if (state.stage < stages.length - 1) { startStage(state.stage + 1, true); return; } if (state.runStartStage === 0 && state.campaign.cleared.every(Boolean)) writeBest(state.totalPicks); show("result"); applyLocale(); track("complete", { picks: state.totalPicks, fullCampaign: state.runStartStage === 0 }); };
  const clearChoice = () => { state.selected = null; state.status = t("ready"); renderBattle(); };
  const toggleCloudBrace = () => { if (state.campaign.cloudCharges < 1 || state.finished) return; state.braceActive = !state.braceActive; state.status = state.braceActive ? t("selected", { name: t("cloud") }) : t("ready"); beep("ui.click"); renderBattle(); };
  const goHome = () => { show("main"); applyLocale(); track("home"); };
  const toggleSettings = () => {
    const panel = $("settingsPanel");
    // This authored trigger is retained for the maintained Cushion Stack
    // smoke/keyboard path, while the shared shell owns the actual language and
    // sound controls. Delegate to the shared button so pointer, keyboard, and
    // audit activation all use its single open/close state machine. Keep the
    // legacy panel as a collapsed compatibility proxy so RTL never paints two
    // overlapping settings surfaces.
    const generatedHost = document.querySelector(".wp-shell-settings");
    const generatedButton = generatedHost?.querySelector(".wp-shell-settings-button");
    if (generatedButton && generatedButton !== $("settingsBtn")) {
      panel.classList.add("cushion-settings-proxy");
      panel.hidden = true;
      generatedButton.click();
      $("settingsBtn").setAttribute("aria-expanded", generatedButton.getAttribute("aria-expanded") || "false");
      return;
    }
    const hidden = panel.hidden;
    panel.hidden = !hidden;
    $("settingsBtn").setAttribute("aria-expanded", String(hidden));
  };

  const ensureLocaleOptions = () => { const options = supportedLocales.map((locale) => { const option = document.createElement("option"); option.value = locale; option.textContent = localeLabels[locale]; return option; }); $("localeSelect").replaceChildren(...options); const legacy = $("cushionDialect"); if (legacy) legacy.replaceChildren(...options.map((option) => option.cloneNode(true))); };
  const openStageMap = () => { state.stageBrowseIndex = Math.max(0, state.campaign.unlocked - 1); show("stages"); applyLocale(); renderStages(); };
  const recenterStageSelector = () => { if (!screens.stages.hidden) requestAnimationFrame(() => state.stageSelector?.center(state.stageBrowseIndex)); };
  window.addEventListener("resize", recenterStageSelector);
  window.addEventListener("pagehide", () => { state.stageSelector?.destroy(); window.removeEventListener("resize", recenterStageSelector); }, { once: true });
  $("startBtn").addEventListener("click", openStageMap); $("mapBtn").addEventListener("click", openStageMap); $("stageBackBtn").addEventListener("click", goHome); $("battleBackBtn").addEventListener("click", openStageMap); $("battleMapBtn").addEventListener("click", openStageMap); $("checkBtn").addEventListener("click", checkChoice); $("clearBtn").addEventListener("click", clearChoice); $("advanceBtn").addEventListener("click", advance); $("cloudBraceBtn").addEventListener("click", toggleCloudBrace); $("resultPrimaryBtn").addEventListener("click", () => startStage(state.runStartStage, false)); $("resultMapBtn").addEventListener("click", openStageMap); $("resultHomeBtn").addEventListener("click", goHome); $("settingsBtn").addEventListener("click", toggleSettings); $("soundBtn").addEventListener("click", () => { state.sound = window.WeightPlayAudio.setEnabled(!state.sound); applyLocale(); track("sound", { enabled: state.sound }); }); $("localeSelect").addEventListener("change", (event) => setLocale(event.target.value)); $("cushionDialect")?.addEventListener("change", (event) => setLocale(event.target.value)); $("stageInfoBtn").addEventListener("click", () => window.alert(t("stageReady"))); $("battleInfoBtn").addEventListener("click", () => window.alert(t("guideTwo")));
  ensureLocaleOptions();
  window.setTimeout(() => { $("loadingPanel").hidden = true; show("main"); applyLocale(); }, 40);
})();
