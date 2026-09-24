(() => {
  "use strict";

  const copy = window.ANIMAL_LANTERN_LATTICE_LOCALES || {};
  const lanterns = [
    { id: "owl", key: "owl" },
    { id: "fox", key: "fox" },
    { id: "otter", key: "otter" },
    { id: "rabbit", key: "rabbit" },
    { id: "turtle", key: "turtle" },
    { id: "panda", key: "panda" },
  ];

  // Every stage changes the route plus a visible rule or checkpoint purpose.
  // The six arcs are intentionally authored rather than generated from one
  // encounter with only a larger number.
  const paths = [
    { titleKey: "stage1Title", arcKey: "arc1", target: ["owl", "fox", "otter"], ruleKey: "straightRule", rewardKey: "stageReward" },
    { titleKey: "stage2Title", arcKey: "arc1", target: ["rabbit", "turtle", "panda"], ruleKey: "straightRule", rewardKey: "stageReward" },
    { titleKey: "stage3Title", arcKey: "arc1", target: ["fox", "otter", "panda"], ruleKey: "straightRule", rewardKey: "stageReward" },
    { titleKey: "stage4Title", arcKey: "arc1", target: ["owl", "rabbit", "turtle", "panda"], ruleKey: "straightRule", rewardKey: "stageReward" },
    { titleKey: "stage5Title", arcKey: "arc1", target: ["owl", "fox", "otter", "panda"], reverse: true, checkpoint: true, ruleKey: "reverseRule", rewardKey: "checkpointReward1" },

    { titleKey: "stage6Title", arcKey: "arc2", target: ["rabbit", "owl", "turtle"], decoy: "fox", ruleKey: "decoyRule", rewardKey: "stageReward" },
    { titleKey: "stage7Title", arcKey: "arc2", target: ["fox", "panda", "otter", "rabbit"], decoy: "turtle", ruleKey: "decoyRule", rewardKey: "stageReward" },
    { titleKey: "stage8Title", arcKey: "arc2", target: ["turtle", "owl", "panda"], decoy: "fox", ruleKey: "decoyRule", rewardKey: "stageReward" },
    { titleKey: "stage9Title", arcKey: "arc2", target: ["otter", "rabbit", "fox", "turtle"], decoy: "panda", ruleKey: "decoyRule", rewardKey: "stageReward" },
    { titleKey: "stage10Title", arcKey: "arc2", target: ["owl", "panda", "rabbit", "otter"], decoy: "turtle", checkpoint: true, ruleKey: "decoyRule", rewardKey: "checkpointReward2" },

    { titleKey: "stage11Title", arcKey: "arc3", target: ["owl", "fox", "owl", "otter"], echoId: "owl", ruleKey: "echoRule", rewardKey: "stageReward" },
    { titleKey: "stage12Title", arcKey: "arc3", target: ["rabbit", "turtle", "panda", "turtle"], echoId: "turtle", ruleKey: "echoRule", rewardKey: "stageReward" },
    { titleKey: "stage13Title", arcKey: "arc3", target: ["fox", "otter", "panda", "otter"], echoId: "otter", ruleKey: "echoRule", rewardKey: "stageReward" },
    { titleKey: "stage14Title", arcKey: "arc3", target: ["panda", "rabbit", "panda", "turtle"], echoId: "panda", ruleKey: "echoRule", rewardKey: "stageReward" },
    { titleKey: "stage15Title", arcKey: "arc3", target: ["owl", "rabbit", "turtle", "owl", "panda"], echoId: "owl", checkpoint: true, ruleKey: "echoRule", rewardKey: "checkpointReward3" },

    { titleKey: "stage16Title", arcKey: "arc4", target: ["fox", "rabbit", "otter", "panda"], reverse: true, ruleKey: "reverseRule", rewardKey: "stageReward" },
    { titleKey: "stage17Title", arcKey: "arc4", target: ["turtle", "panda", "owl"], reverse: true, ruleKey: "reverseRule", rewardKey: "stageReward" },
    { titleKey: "stage18Title", arcKey: "arc4", target: ["otter", "fox", "rabbit", "turtle"], reverse: true, ruleKey: "reverseRule", rewardKey: "stageReward" },
    { titleKey: "stage19Title", arcKey: "arc4", target: ["panda", "owl", "otter", "rabbit"], reverse: true, ruleKey: "reverseRule", rewardKey: "stageReward" },
    { titleKey: "stage20Title", arcKey: "arc4", target: ["rabbit", "fox", "turtle", "panda", "owl"], reverse: true, checkpoint: true, ruleKey: "reverseRule", rewardKey: "checkpointReward4" },

    { titleKey: "stage21Title", arcKey: "arc5", target: ["owl", "fox", "owl", "turtle"], echoId: "owl", decoy: "panda", ruleKey: "decoyEchoRule", rewardKey: "stageReward" },
    { titleKey: "stage22Title", arcKey: "arc5", target: ["rabbit", "otter", "panda", "otter", "fox"], echoId: "otter", decoy: "turtle", ruleKey: "decoyEchoRule", rewardKey: "stageReward" },
    { titleKey: "stage23Title", arcKey: "arc5", target: ["turtle", "owl", "turtle", "panda"], echoId: "turtle", decoy: "fox", ruleKey: "decoyEchoRule", rewardKey: "stageReward" },
    { titleKey: "stage24Title", arcKey: "arc5", target: ["panda", "fox", "rabbit", "fox", "otter"], echoId: "fox", decoy: "owl", ruleKey: "decoyEchoRule", rewardKey: "stageReward" },
    { titleKey: "stage25Title", arcKey: "arc5", target: ["otter", "rabbit", "otter", "turtle", "panda"], echoId: "otter", decoy: "fox", checkpoint: true, ruleKey: "decoyEchoRule", rewardKey: "checkpointReward5" },

    { titleKey: "stage26Title", arcKey: "arc6", target: ["owl", "panda", "owl", "rabbit"], reverse: true, echoId: "owl", decoy: "fox", ruleKey: "masteryRule", rewardKey: "stageReward" },
    { titleKey: "stage27Title", arcKey: "arc6", target: ["fox", "turtle", "panda", "turtle", "otter"], reverse: true, echoId: "turtle", decoy: "rabbit", ruleKey: "masteryRule", rewardKey: "stageReward" },
    { titleKey: "stage28Title", arcKey: "arc6", target: ["rabbit", "otter", "rabbit", "owl", "panda"], reverse: true, echoId: "rabbit", decoy: "turtle", ruleKey: "masteryRule", rewardKey: "stageReward" },
    { titleKey: "stage29Title", arcKey: "arc6", target: ["panda", "fox", "panda", "turtle", "owl"], reverse: true, echoId: "panda", decoy: "otter", ruleKey: "masteryRule", rewardKey: "stageReward" },
    { titleKey: "stage30Title", arcKey: "arc6", target: ["turtle", "rabbit", "turtle", "fox", "panda", "owl"], reverse: true, echoId: "turtle", decoy: "otter", checkpoint: true, ruleKey: "masteryRule", rewardKey: "checkpointReward6" },
  ];

  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = routeLocaleMap[routeSegment] || null;
  const progressKey = "weightplay-animal-lantern-lattice-progress-v2";
  const campaignBestKey = "weightplay-animal-lantern-lattice-best-v2";
  const legacyCampaignBestKey = "weightplay-animal-lantern-lattice-best-v1";
  const stageBestKey = "weightplay-animal-lantern-lattice-stage-best-v1";
  const state = {
    locale: routeLocale || "en", path: 0, chain: [], sessionChecks: 0, checks: 0,
    screen: "main", campaignRun: false, lastResultCampaign: false,
  };
  const $ = (id) => document.getElementById(id);
  const setBattleStatus = (message, feedback = "neutral") => {
    const status = $("battleStatus");
    status.textContent = message;
    status.dataset.feedback = feedback;
  };
  const app = $("app");
  let sharedFrame = null;
  let stageRailController = null;
  let stageBrowseIndex = 0;
  let stageRailResizeObserver = null;
  let stageProgressSnapshot = null;
  const centerStageAfterViewportChange = () => {
    if (state.screen === "stage") requestAnimationFrame(() => stageRailController?.center(stageBrowseIndex));
  };
  const t = (key, vars = {}) => {
    const table = copy[state.locale] || copy.en || {};
    let value = table[key] || copy.en?.[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const icon = (lantern, className) => {
    const node = document.createElement("span");
    node.className = className;
    node.dataset.lantern = lantern.id;
    node.setAttribute("aria-hidden", "true");
    return node;
  };
  const track = (name, detail = {}) => {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: `animal_lantern_lattice_${name}`, ...detail });
      document.dispatchEvent(new CustomEvent("weightplay:animal-lantern-lattice", { detail: { name, ...detail } }));
    } catch (_) {}
  };
  const readBest = () => {
    try {
      const value = Number(localStorage.getItem(campaignBestKey) || localStorage.getItem(legacyCampaignBestKey));
      return Number.isFinite(value) && value > 0 ? value : null;
    } catch (_) { return null; }
  };
  const writeBest = (value) => {
    try {
      const old = readBest();
      if (!old || value < old) localStorage.setItem(campaignBestKey, String(value));
    } catch (_) {}
  };
  const readStageBests = () => {
    let parsed = {};
    try { parsed = JSON.parse(localStorage.getItem(stageBestKey) || "{}"); } catch (_) {}
    return Object.fromEntries(Object.entries(parsed).filter(([key, value]) => {
      const stage = Number(key);
      return Number.isInteger(stage) && stage >= 1 && stage <= paths.length && Number.isFinite(Number(value)) && Number(value) > 0;
    }).map(([key, value]) => [key, Number(value)]));
  };
  const readStageBest = (stageNumber) => readStageBests()[String(stageNumber)] || null;
  const writeStageBest = (stageNumber, value) => {
    try {
      const scores = readStageBests();
      const old = scores[String(stageNumber)];
      if (!old || value < old) {
        scores[String(stageNumber)] = value;
        localStorage.setItem(stageBestKey, JSON.stringify(scores));
      }
    } catch (_) {}
  };
  const readProgress = () => {
    let parsed = {};
    try { parsed = JSON.parse(localStorage.getItem(progressKey) || "{}"); } catch (_) {}
    const cleared = [...new Set((Array.isArray(parsed.cleared) ? parsed.cleared : [])
      .map(Number).filter((value) => Number.isInteger(value) && value >= 1 && value <= paths.length))].sort((a, b) => a - b);
    const highestFromClear = cleared.length ? Math.max(...cleared) + 1 : 1;
    const requested = Number(parsed.highestUnlocked);
    const highestUnlocked = Math.min(paths.length, Math.max(1, Number.isInteger(requested) ? requested : 1, highestFromClear));
    return { highestUnlocked, cleared };
  };
  const writeProgress = (progress) => {
    try { localStorage.setItem(progressKey, JSON.stringify(progress)); } catch (_) {}
  };
  const clearStage = (index) => {
    const progress = readProgress();
    const stageNumber = index + 1;
    if (!progress.cleared.includes(stageNumber)) progress.cleared.push(stageNumber);
    progress.cleared.sort((a, b) => a - b);
    progress.highestUnlocked = Math.min(paths.length, Math.max(progress.highestUnlocked, stageNumber + 1));
    writeProgress(progress);
  };
  const expectedTarget = (item) => item.reverse ? [...item.target].reverse() : item.target;
  const renderProgress = () => {
    const progress = readProgress();
    const node = document.querySelector('[data-copy="progressBody"]');
    if (node) node.textContent = t("progressBody", { unlocked: progress.highestUnlocked, total: paths.length });
    const best = $("bestValue");
    if (best) best.textContent = readBest() || t("noBest");
  };
  const show = (screen) => {
    state.screen = screen;
    app.hidden = false;
    $("mainScreen").hidden = screen !== "main";
    $("stageScreen").hidden = screen !== "stage";
    $("battleScreen").hidden = screen !== "battle" && screen !== "result";
    $("battleContent").hidden = screen === "result";
    $("resultScreen").hidden = screen !== "result";
    const guide = $("gameGuide");
    guide.hidden = screen !== "main";
    guide.setAttribute("aria-hidden", String(screen !== "main"));
    document.body.dataset.screen = screen;
    if (sharedFrame) sharedFrame.activate(screen === "result" ? "battle" : screen, { covered: screen === "result" });
  };
  const renderStages = ({ entry = false } = {}) => {
    const rail = $("stageList");
    const progress = stageProgressSnapshot = readProgress();
    if (entry) stageBrowseIndex = progress.highestUnlocked - 1;
    rail.setAttribute("aria-label", `${t("stageAll")} · ${t("progressBody", { unlocked: progress.highestUnlocked, total: paths.length })}`);
    // The shared rail skin enables smooth scrolling for legacy CSS snap rails.
    // This data-backed controller owns frame-by-frame movement and must not
    // have the browser animate each scrollLeft assignment behind its state.
    rail.style.setProperty("scroll-behavior", "auto", "important");
    const bindCard = (button, index) => {
      const item = paths[index];
      const unlocked = index + 1 <= stageProgressSnapshot.highestUnlocked;
      button.type = "button";
      button.className = `stage-card${unlocked ? "" : " locked"}`;
      button.dataset.index = String(index);
      button.dataset.stageIndex = String(index);
      button.setAttribute("aria-disabled", String(!unlocked));
      const title = document.createElement("strong");
      title.textContent = t("stageRound", { n: index + 1, total: paths.length });
      const name = document.createElement("span");
      name.textContent = t(item.titleKey);
      const meta = document.createElement("em");
      meta.className = "stage-card-meta";
      meta.textContent = `${t(item.arcKey)}${item.checkpoint ? ` · ${t("checkpoint")}` : ""}`;
      const preview = document.createElement("small");
      expectedTarget(item).forEach((id, targetIndex) => {
        if (targetIndex) preview.append(document.createTextNode(" → "));
        preview.append(icon(lanterns.find((lantern) => lantern.id === id), "stage-lantern-icon"));
      });
      button.setAttribute("aria-label", `${title.textContent}: ${name.textContent}${unlocked ? "" : `, ${t("locked")}`}`);
      button.disabled = false;
      button.replaceChildren(title, name, meta, preview);
    };
    if (!stageRailController) {
      if (!window.WeightPlayStageV6?.install) throw new Error("Lantern Lattice requires the shared Stage V6 controller.");
      stageRailController = window.WeightPlayStageV6.install(rail, {
        total: paths.length,
        poolSize: 9,
        initialIndex: () => stageBrowseIndex,
        bind: bindCard,
        activate: (index) => {
          if (index + 1 <= readProgress().highestUnlocked) startPath(index);
        },
        onChange: (index) => { stageBrowseIndex = index; },
      });
      if (!stageRailController) throw new Error("The shared Stage V6 controller could not initialize the Lantern Lattice rail.");
      if (typeof ResizeObserver === "function") {
        stageRailResizeObserver = new ResizeObserver(() => {
          if (state.screen === "stage") stageRailController?.center(stageBrowseIndex);
        });
        stageRailResizeObserver.observe(rail);
      }
    } else stageRailController.refresh();
    stageRailController.center(stageBrowseIndex);
  };
  const ruleVars = (item) => ({
    name: t(item.echoId || item.decoy || "owl"),
    echo: t(item.echoId || "owl"),
    decoy: t(item.decoy || "owl"),
  });
  const renderBattle = () => {
    const item = paths[state.path];
    const target = expectedTarget(item);
    $("roundLabel").textContent = t("stageRound", { n: state.path + 1, total: paths.length });
    $("battleRule").textContent = t(item.ruleKey, ruleVars(item));
    $("battleHint").textContent = t("campaignBattleHint", { count: target.length });
    $("sessionChecks").textContent = String(state.sessionChecks);
    $("clueList").replaceChildren(...target.map((id, index) => {
      const li = document.createElement("li");
      const name = t(lanterns.find((lantern) => lantern.id === id).key);
      li.textContent = index === 0
        ? t(item.reverse ? "reverseClueStart" : "clueStart", { name })
        : t("clueFollow", { name, previous: t(lanterns.find((lantern) => lantern.id === target[index - 1]).key) });
      return li;
    }));
    $("chainList").replaceChildren(...(state.chain.length ? state.chain.map((id, index) => {
      const lantern = lanterns.find((entry) => entry.id === id);
      const span = document.createElement("span");
      span.className = "chain-light";
      span.append(icon(lantern, "chain-icon"), document.createTextNode(`${index + 1}. ${t(lantern.key)}`));
      return span;
    }) : [Object.assign(document.createElement("span"), { className: "chain-empty", textContent: t("empty") })]));
    $("lanternGrid").replaceChildren(...lanterns.map((lantern) => {
      const button = document.createElement("button");
      const used = state.chain.filter((id) => id === lantern.id).length;
      const canEcho = Boolean(item.echoId === lantern.id && used === 1);
      button.type = "button";
      button.className = "lantern-choice";
      button.disabled = used > 0 && !canEcho;
      button.setAttribute("aria-label", t("lantern", { name: t(lantern.key) }));
      button.append(icon(lantern, "lantern-icon"), Object.assign(document.createElement("b"), { textContent: t(lantern.key) }));
      button.addEventListener("click", () => chooseLantern(lantern.id));
      return button;
    }));
  };
  const renderResult = () => {
    const finalStage = state.path >= paths.length - 1;
    $("resultHeading").textContent = finalStage ? t("finishTitle") : t("correct");
    const item = paths[state.path];
    const resultVars = { stage: state.path + 1, next: state.path + 2, reward: t(item.rewardKey) };
    $("resultText").textContent = finalStage && state.lastResultCampaign
      ? t("campaignFinishText", { n: state.sessionChecks, best: readBest() || state.sessionChecks, reward: t(item.rewardKey) })
      : finalStage
        ? t("stageFinishText", { stage: state.path + 1, checks: state.checks, best: readStageBest(state.path + 1) || state.checks })
        : t(item.checkpoint ? "checkpointClear" : "stageClear", resultVars);
    $("skillReport").textContent = t("skillReportText");
    const nextButton = $("resultPrimaryBtn");
    nextButton.textContent = t("nextStage");
    nextButton.disabled = finalStage;
    $("resultMapBtn").hidden = false;
    $("resultHomeBtn").textContent = t("replay");
    nextButton.onclick = () => startPath(state.path + 1);
  };
  const guideCopy = window.ANIMAL_LANTERN_LATTICE_GUIDE_COPY || {};
  const buildGuide = () => guideCopy[state.locale] || guideCopy.en;
  const renderGuide = () => {
    const guide=buildGuide(), hero=$("guideHero"), sections=$("guideSections");
    if(!hero||!sections)return;
    hero.replaceChildren();
    const title=document.createElement("div");title.className="game-info-title";
    const kicker=document.createElement("span");kicker.className="game-info-kicker";kicker.textContent=t("guideTitle");
    const h2=document.createElement("h2");h2.textContent=t("title");
    const summary=document.createElement("p");summary.textContent=t("intro");title.append(kicker,h2,summary);
    const facts=document.createElement("div");facts.className="game-info-facts";
    guide.facts.forEach((label,index)=>{const fact=document.createElement("div");fact.className="game-info-fact";fact.append(Object.assign(document.createElement("span"),{textContent:label}),Object.assign(document.createElement("strong"),{textContent:guide.values[index]}));facts.append(fact);});
    hero.append(title,facts);
    const bodies=[guide.overview,"",guide.rules,guide.progression,guide.tips,guide.design,guide.saved,""];
    sections.replaceChildren(...guide.headings.map((heading,index)=>{
      const article=document.createElement("article");article.className="game-info-section";
      article.append(Object.assign(document.createElement("h3"),{textContent:heading}));
      if(index===1){article.append(Object.assign(document.createElement("p"),{textContent:guide.stepIntro}));const steps=document.createElement("ol");guide.steps.forEach(step=>steps.append(Object.assign(document.createElement("li"),{textContent:step})));article.append(steps);}
      else if(index===7){const dl=document.createElement("dl");guide.faq.forEach(([q,a])=>{const row=document.createElement("div");row.append(Object.assign(document.createElement("dt"),{textContent:q}),Object.assign(document.createElement("dd"),{textContent:a}));dl.append(row);});article.append(dl);}
      else article.append(Object.assign(document.createElement("p"),{textContent:bodies[index]}));
      return article;
    }));
  };
  const applyLocale = () => {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("localeSelect").value = state.locale;
    $("localeSelect").setAttribute("aria-label", t("language"));
    $("stageBackBtn").setAttribute("aria-label", t("backShort"));
    $("battleBackBtn").setAttribute("aria-label", t("backShort"));
    renderProgress();
    renderGuide();
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
    if (state.screen === "result") renderResult();
    sharedFrame?.refresh();
  };
  const startSession = () => {
    state.sessionChecks = 0;
    state.path = 0;
    state.chain = [];
    state.campaignRun = true;
    state.lastResultCampaign = false;
    show("stage");
    renderStages({ entry: true });
    track("session_start");
  };
  const startPath = (index) => {
    if (index < 0 || index >= paths.length || index + 1 > readProgress().highestUnlocked) return;
    state.path = index;
    state.chain = [];
    state.checks = 0;
    state.lastResultCampaign = false;
    show("battle");
    renderBattle();
    track("path_start", { path: state.path + 1, arc: paths[state.path].arcKey });
  };
  const chooseLantern = (id) => {
    const item = paths[state.path];
    const used = state.chain.filter((entry) => entry === id).length;
    const canEcho = item.echoId === id && used === 1;
    if (state.chain.length >= expectedTarget(item).length || (used > 0 && !canEcho)) return;
    state.chain.push(id);
    setBattleStatus("", "neutral");
    renderBattle();
    track("lantern_choose", { path: state.path + 1, position: state.chain.length, lantern: id });
  };
  const resetChain = () => {
    state.chain = [];
    renderBattle();
    setBattleStatus(t("ready"));
    track("reset", { path: state.path + 1 });
  };
  const checkPath = () => {
    const item = paths[state.path];
    const target = expectedTarget(item);
    state.checks += 1;
    state.sessionChecks += 1;
    if (state.chain.length < target.length) {
      setBattleStatus(t("campaignNeedMore", { count: target.length }), "error");
      track("check", { path: state.path + 1, checks: state.sessionChecks, correct: false, reason: "incomplete" });
      return;
    }
    const firstMismatch = target.findIndex((id, index) => id !== state.chain[index]);
    const decoyChosen = item.decoy && state.chain.includes(item.decoy);
    track("check", { path: state.path + 1, checks: state.sessionChecks, correct: firstMismatch < 0 && !decoyChosen });
    if (decoyChosen) {
      setBattleStatus(t("decoyWrong", { name: t(item.decoy) }), "error");
      return;
    }
    if (firstMismatch >= 0) {
      setBattleStatus(t("wrong", { n: firstMismatch + 1 }), "error");
      return;
    }
    setBattleStatus(t("correct"), "success");
    clearStage(state.path);
    writeStageBest(state.path + 1, state.checks);
    const progress = readProgress();
    const campaignCompleted = state.campaignRun && state.path >= paths.length - 1 && progress.cleared.length === paths.length;
    if (campaignCompleted) {
      writeBest(state.sessionChecks);
      state.lastResultCampaign = true;
      state.campaignRun = false;
      track("session_complete", { checks: state.sessionChecks });
    }
    show("result");
    renderResult();
  };
  $("startBtn").addEventListener("click", startSession);
  $("mapBtn").addEventListener("click", () => { state.campaignRun = false; show("stage"); renderStages({ entry: true }); track("path_map"); });
  $("stageBackBtn").addEventListener("click", () => show("main"));
  $("battleBackBtn").addEventListener("click", () => { show("stage"); renderStages({ entry: true }); });
  $("resultMapBtn").addEventListener("click", () => { state.campaignRun = false; show("stage"); renderStages({ entry: true }); });
  $("resultHomeBtn").addEventListener("click", () => {
    state.campaignRun = false;
    startPath(state.path);
  });
  $("checkBtn").addEventListener("click", checkPath);
  $("resetBtn").addEventListener("click", resetChain);
  $("localeSelect").addEventListener("change", (event) => {
    state.locale = copy[event.target.value] ? event.target.value : "en";
    try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {}
    applyLocale();
    track("locale", { locale: state.locale });
  });
  try {
    const saved = localStorage.getItem("weightplayLocale");
    if (!routeLocale && saved && copy[saved]) state.locale = saved;
  } catch (_) {}
  $("localeSelect").value = state.locale;
  sharedFrame = window.WeightPlayScreenFrame.mount({
    root: app,
    localeSelect: $("localeSelect"),
    scenes: {
      main: { root: $("mainScreen"), header: $("mainHeader"), content: $("mainContent") },
      stage: { root: $("stageScreen"), header: $("stageHeader"), content: $("stageContent") },
      battle: { root: $("battleScreen"), header: $("battleHeader"), content: $("battleContent"), headerInfo: $("battleHeaderInfo") },
    },
  });
  window.addEventListener("resize", centerStageAfterViewportChange);
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    window.removeEventListener("resize", centerStageAfterViewportChange);
    stageRailResizeObserver?.disconnect();
    stageRailController?.destroy();
    stageRailController = null;
  });
  window.setTimeout(() => { $("loadingPanel").hidden = true; show("main"); applyLocale(); track("main_ready"); }, 260);
  window.__ANIMAL_LANTERN_LATTICE_TEST__ = {
    paths,
    lanterns,
    expectedTarget,
    startSession,
    startPath,
    chooseLantern,
    checkPath,
    getProgress: readProgress,
    getBest: readBest,
    getStageBests: readStageBests,
    getState: () => ({ ...state, chain: [...state.chain] }),
  };
})();
