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
  const campaignBestKey = "weightplay-animal-lantern-lattice-best-v3";
  // v1 counted incomplete prompts as checks. Keep it in storage, but start a
  // clean record for the new complete-chain-only score so star ranks are fair.
  const stageBestKey = "weightplay-animal-lantern-lattice-stage-best-v2";
  const state = {
    locale: routeLocale || "en", path: 0, chain: [], motionSlot: null, sessionChecks: 0, checks: 0,
    screen: "main", campaignRun: false, lastResultCampaign: false,
    focusedClue: null, errorSlot: -1, verifiedPrefix: 0,
  };
  const $ = (id) => document.getElementById(id);
  const setBattleStatus = (message, feedback = "neutral") => {
    const status = $("battleStatus");
    status.textContent = message;
    status.dataset.feedback = feedback;
    animate(status, [{ opacity: .5 }, { opacity: 1 }], 160);
  };
  const app = $("app");
  const GAME_AUDIO_CUES = ["board.move", "board.undo", "feedback.hint", "feedback.error", "puzzle.match", "puzzle.clear", "result.win"];
  const audio = window.WeightPlayAudio?.createScope();
  const effects = new Set();
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = (node, frames, duration = 240, delay = 0, cleanup = null) => {
    if (!node?.animate) { cleanup?.(); return; }
    const animation = node.animate(reduceMotion() ? [{ opacity: 0.65 }, { opacity: 1 }] : frames,
      { duration: reduceMotion() ? 100 : duration, delay: reduceMotion() ? 0 : delay, easing: "cubic-bezier(.2,.8,.2,1)" });
    effects.add(animation);
    animation.finished.catch(() => {}).finally(() => { effects.delete(animation); cleanup?.(); });
  };
  const cancelEffects = () => {
    effects.forEach((animation) => animation.cancel());
    effects.clear();
    document.querySelectorAll(".lantern-fx-layer").forEach((layer) => layer.replaceChildren());
    audio?.stop();
  };
  const flash = (node, strong = false) => animate(node,
    [{ filter: "brightness(1)" }, { filter: `brightness(${strong ? 1.9 : 1.45})` }, { filter: "brightness(1)" }], strong ? 420 : 220);
  const flyLight = (id, source, destination, exiting = false) => {
    const root = $("battleContent");
    const origin = source?.getBoundingClientRect();
    const arrival = destination?.getBoundingClientRect();
    const bounds = root.getBoundingClientRect();
    if (!origin || !arrival || !bounds.width || document.hidden) return;
    let layer = root.querySelector(".lantern-fx-layer");
    if (!layer) {
      layer = document.createElement("div"); layer.className = "lantern-fx-layer";
      layer.setAttribute("aria-hidden", "true"); root.append(layer);
    }
    // Use the owning content's logical coordinates, including uniform Canvas scale.
    const scale = bounds.width / root.offsetWidth;
    const center = (rect) => ({ x: (rect.left + rect.width / 2 - bounds.left) / scale + root.scrollLeft - 18,
      y: (rect.top + rect.height / 2 - bounds.top) / scale + root.scrollTop - 18 });
    const from = center(origin), to = center(arrival);
    const mote = icon(lanterns.find((lantern) => lantern.id === id), "lantern-icon lantern-fx-mote");
    mote.style.left = `${from.x}px`; mote.style.top = `${from.y}px`; layer.append(mote);
    if (layer.childElementCount > 12) layer.firstElementChild.remove();
    const frames = exiting
      ? [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.65) translateY(-12px)" }]
      : [{ opacity: 1, transform: "translate(0,0) scale(1)" },
        { opacity: 0, transform: `translate(${to.x - from.x}px,${to.y - from.y}px) scale(.8)` }];
    animate(mote, frames, exiting ? 180 : 300, 0, () => mote.remove());
  };
  const linkedClues = () => {
    const item = paths[state.path];
    const available = new Map();
    state.chain.slice(1).forEach((id, index) => {
      const key = `${state.chain[index]}:${id}`;
      available.set(key, (available.get(key) || 0) + 1);
    });
    return routeClues(item, state.path).map(({ previous, name }) => {
      const key = item.reverse ? `${name}:${previous}` : `${previous}:${name}`;
      const count = available.get(key) || 0;
      if (count) available.set(key, count - 1);
      return count > 0;
    });
  };
  const focusClue = (index) => {
    if (state.screen !== "battle") return;
    state.focusedClue = state.focusedClue === index ? null : index;
    renderBattle();
    const clue = routeClues(paths[state.path], state.path)[index];
    setBattleStatus(t("clueFollow", { previous: t(clue.previous), name: t(clue.name) }), "hint");
    audio?.play("feedback.hint");
  };
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
      const value = Number(localStorage.getItem(campaignBestKey));
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
  const routeClues = (item, seed) => {
    const clues = item.target.slice(1).map((name, index) => ({ previous: item.target[index], name }));
    let value = (seed + 1) * 2654435761 >>> 0;
    const random = () => {
      value ^= value << 13;
      value ^= value >>> 17;
      value ^= value << 5;
      return (value >>> 0) / 4294967296;
    };
    for (let index = clues.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [clues[index], clues[swap]] = [clues[swap], clues[index]];
    }
    if (clues.length > 1 && clues.every((clue, index) => clue.previous === item.target[index] && clue.name === item.target[index + 1])) {
      clues.push(clues.shift());
    }
    return clues;
  };
  const starCountForChecks = (checks) => Math.max(1, Math.min(3, 4 - Number(checks)));
  const starMarks = (count) => `${"★".repeat(count)}${"☆".repeat(3 - count)}`;
  const renderProgress = () => {
    const progress = readProgress();
    const node = document.querySelector('[data-copy="progressBody"]');
    if (node) node.textContent = t("progressBody", { unlocked: progress.highestUnlocked, total: paths.length });
    const best = $("bestValue");
    if (best) best.textContent = readBest() || t("noBest");
  };
  const show = (screen) => {
    if (state.screen !== screen) cancelEffects();
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
    if (screen === "main") renderProgress();
    if (sharedFrame) sharedFrame.activate(screen === "result" ? "battle" : screen, { covered: screen === "result" });
  };
  const renderStages = ({ entry = false } = {}) => {
    const rail = $("stageList");
    const progress = stageProgressSnapshot = readProgress();
    const stageBests = readStageBests();
    if (entry) stageBrowseIndex = state.campaignRun ? 0 : progress.highestUnlocked - 1;
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
      if (index + 1 === stageProgressSnapshot.highestUnlocked) button.dataset.wpStageRecommended = "true";
      else delete button.dataset.wpStageRecommended;
      const title = document.createElement("strong");
      title.textContent = t("stageRound", { n: index + 1, total: paths.length });
      const name = document.createElement("span");
      name.textContent = t(item.titleKey);
      const meta = document.createElement("em");
      meta.className = "stage-card-meta";
      meta.textContent = `${t(item.arcKey)}${item.checkpoint ? ` · ${t("checkpoint")}` : ""}`;
      const preview = document.createElement("small");
      preview.className = "stage-card-summary";
      const length = document.createElement("span");
      length.className = "stage-card-length";
      length.textContent = t("stageLength", { count: item.target.length });
      const pips = document.createElement("span");
      pips.className = "stage-route-pips";
      pips.setAttribute("aria-hidden", "true");
      for (let spot = 0; spot < item.target.length; spot += 1) pips.append(document.createElement("i"));
      const best = document.createElement("span");
      best.className = "stage-card-best";
      const bestChecks = stageBests[String(index + 1)];
      best.textContent = bestChecks
        ? t("stageBest", { count: bestChecks, stars: starMarks(starCountForChecks(bestChecks)) })
        : t("noBest");
      preview.append(length, pips, best);
      button.setAttribute("aria-label", `${title.textContent}: ${name.textContent}${unlocked ? `, ${length.textContent}, ${best.textContent}` : `, ${t("locked")}`}`);
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
          if (index + 1 <= readProgress().highestUnlocked) startPath(index, { campaign: state.campaignRun, resetSession: !state.campaignRun });
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
    $("battleHint").textContent = t("clueHint");
    $("sessionChecks").textContent = String(state.sessionChecks);
    const clueList = $("clueList");
    const clueDeckKey = `${state.path}:${state.locale}`;
    if (clueList.dataset.deck !== clueDeckKey) {
      clueList.replaceChildren(...routeClues(item, state.path).map(({ previous, name }, index) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button"; button.className = "clue-link"; button.dataset.clueIndex = String(index);
        const visual = document.createElement("span"); visual.className = "clue-pair"; visual.dir = "ltr";
        const arrow = Object.assign(document.createElement("span"), { className: "clue-arrow", textContent: "→" });
        arrow.setAttribute("aria-hidden", "true");
        visual.append(icon(lanterns.find((entry) => entry.id === previous), "chain-icon"), arrow,
          icon(lanterns.find((entry) => entry.id === name), "chain-icon"));
        const label = Object.assign(document.createElement("span"), { className: "clue-text",
          textContent: t("clueFollow", { name: t(name), previous: t(previous) }) });
        button.append(visual, label);
        button.addEventListener("click", () => focusClue(index)); li.append(button);
        return li;
      }));
      clueList.dataset.deck = clueDeckKey;
    }
    const joined = linkedClues();
    clueList.querySelectorAll(".clue-link").forEach((button, index) => {
      const wasJoined = button.classList.contains("is-linked");
      button.classList.toggle("is-linked", joined[index]);
      button.classList.toggle("is-focused", state.focusedClue === index);
      button.setAttribute("aria-pressed", String(state.focusedClue === index));
      button.querySelector(".clue-arrow").textContent = joined[index] ? "✓" : "→";
      if (joined[index] && !wasJoined) flash(button);
    });
    let meter = $("linkMeter");
    if (!meter) {
      meter = document.createElement("span"); meter.id = "linkMeter"; meter.className = "link-meter";
      $("chainList").parentElement.querySelector("strong").append(meter);
    }
    const linked = joined.filter(Boolean).length;
    meter.textContent = `${linked}/${joined.length}`;
    meter.setAttribute("aria-label", t("linksProgress", { count: linked, total: joined.length }));
    meter.classList.toggle("is-complete", linked === joined.length);
    $("chainList").parentElement.classList.toggle("is-ready", state.chain.length === target.length);
    const chainList = $("chainList");
    chainList.setAttribute("aria-label", t("chainProgress", { count: state.chain.length, total: target.length }));
    if (chainList.children.length !== target.length) chainList.replaceChildren(...Array.from({ length: target.length }, (_, index) => {
      const slot = document.createElement("button"); slot.type = "button";
      slot.dataset.chainSlot = String(index); slot.addEventListener("click", () => rewindChain(index));
      return slot;
    }));
    [...chainList.children].forEach((slot, index) => {
      const id = state.chain[index];
      const lantern = id && lanterns.find((entry) => entry.id === id);
      const changed = slot.dataset.lantern !== (id || "");
      slot.className = `chain-slot${lantern ? " has-light" : ""}${state.errorSlot === index ? " is-wrong" : ""}${index < state.verifiedPrefix ? " is-verified" : ""}`;
      slot.dataset.lantern = id || "";
      slot.disabled = !lantern;
      slot.setAttribute("aria-hidden", String(!lantern));
      if (lantern) {
        slot.setAttribute("aria-label", t("undoLantern", { position: index + 1, name: t(lantern.key) }));
      }
      if (changed || !slot.children.length) slot.replaceChildren(...(lantern ? [icon(lantern, "chain-icon")] : []),
        Object.assign(document.createElement("span"), { className: "chain-position", textContent: String(index + 1) }));
      if (state.motionSlot === index) flash(slot);
    });
    state.motionSlot = null;
    const grid = $("lanternGrid");
    if (grid.dataset.deck !== clueDeckKey) {
      grid.replaceChildren(...lanterns.map((lantern) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lantern-choice"; button.dataset.lantern = lantern.id;
      const count = document.createElement("span"); count.className = "lantern-used"; count.setAttribute("aria-hidden", "true");
      button.append(icon(lantern, "lantern-icon"), Object.assign(document.createElement("b"), { textContent: t(lantern.key) }), count);
      button.addEventListener("click", () => chooseLantern(lantern.id));
      return button;
      }));
      grid.dataset.deck = clueDeckKey;
    }
    const focused = state.focusedClue === null ? null : routeClues(item, state.path)[state.focusedClue];
    grid.querySelectorAll(".lantern-choice").forEach((button) => {
      const id = button.dataset.lantern;
      const used = state.chain.filter((entry) => entry === id).length;
      const canEcho = item.echoId === id && used === 1;
      button.disabled = used > 0 && !canEcho;
      button.classList.toggle("is-selected", used > 0);
      button.classList.toggle("is-clue-focus", Boolean(focused && [focused.previous, focused.name].includes(id)));
      button.querySelector(".lantern-used").textContent = used ? String(used) : "";
      button.setAttribute("aria-label", `${t("lantern", { name: t(id) })}${used ? ` · ${used}` : ""}`);
    });
    $("checkBtn").classList.toggle("is-path-ready", state.chain.length === target.length);
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
    const stars = starCountForChecks(state.checks);
    const rating = $("resultRating");
    rating.replaceChildren(...Array.from({ length: 3 }, (_, index) => {
      const star = Object.assign(document.createElement("span"), { textContent: index < stars ? "★" : "☆" });
      star.className = index < stars ? "earned-star" : "empty-star";
      star.style.setProperty("--star-delay", `${index * 110}ms`); star.setAttribute("aria-hidden", "true");
      return star;
    }));
    rating.setAttribute("aria-label", t("starRating", { stars }));
    let route = $("resultRoute");
    if (!route) {
      route = document.createElement("div"); route.id = "resultRoute"; route.className = "result-route";
      rating.insertAdjacentElement("afterend", route);
    }
    route.setAttribute("aria-label", state.chain.map((id) => t(id)).join(" → "));
    route.replaceChildren(...state.chain.map((id, index) => {
      const light = icon(lanterns.find((lantern) => lantern.id === id), "chain-icon result-light");
      light.style.setProperty("--light-delay", `${index * 65}ms`); return light;
    }));
    $("resultScreen").dataset.clearQuality = stars === 3 ? "perfect" : "clear";
    const nextButton = $("resultPrimaryBtn");
    nextButton.textContent = t("nextStage");
    nextButton.disabled = finalStage;
    $("resultMapBtn").hidden = false;
    const replayButton = $("resultReplayBtn") || $("resultHomeBtn");
    if (replayButton) replayButton.textContent = t("replay");
    nextButton.onclick = () => startPath(state.path + 1, { campaign: state.campaignRun });
  };
  const guideCopy = window.ANIMAL_LANTERN_LATTICE_GUIDE_COPY || {};
  const relatedCopy = window.ANIMAL_LANTERN_LATTICE_RELATED || {};
  const seoComparison = window.ANIMAL_LANTERN_LATTICE_SEO_COMPARISON || {};
  const buildGuide = () => {
    const guide = guideCopy[state.locale] || guideCopy.en;
    return {
      ...guide,
      stepIntro: t("guideStepIntro"),
      steps: [
        ...["guideStepRead", "guideStepBuild", "guideStepUndo", "guideStepClear"].map((key) => `${t(key)}${key === "guideStepRead" ? ` ${t("clueHint")}` : ""}`),
        guide.steps[4],
        guide.steps[5],
      ],
      rules: `${t("guideRules")} ${t("clueHint")}`,
      tips: t("guideTips"),
    };
  };
  const renderGuide = () => {
    const guide=buildGuide(), seo=seoComparison[state.locale]||seoComparison.en, hero=$("guideHero"), sections=$("guideSections");
    if(!hero||!sections)return;
    hero.replaceChildren();
    const title=document.createElement("div");title.className="game-info-title";
    const kicker=document.createElement("span");kicker.className="game-info-kicker";kicker.textContent=t("guideTitle");
    const h2=document.createElement("h2");h2.textContent=t("title");
    const summary=document.createElement("p");summary.textContent=t("intro");title.append(kicker,h2,summary);
    if(seo){const tags=document.createElement("div");tags.className="game-info-tags";tags.dataset.wpGameplayTags="1.4.0";seo.tags.forEach((value)=>tags.append(Object.assign(document.createElement("span"),{textContent:value})));title.append(tags);}
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
    const related = relatedCopy[state.locale] || relatedCopy.en;
    if (related) {
      const article = document.createElement("article");
      article.className = "game-info-section game-info-related-section";
      const heading = document.createElement("h3");
      heading.textContent = related.heading;
      const cards = document.createElement("div");
      cards.className = "game-info-related";
      for (const game of related.games) {
        const card = document.createElement("a");
        card.className = "game-info-related-card";
        card.href = `/${related.segment}/games/${game.id}/`;
        const copy = document.createElement("span");
        copy.className = "game-info-related-copy";
        const name = document.createElement("strong");
        name.textContent = game.title;
        const description = document.createElement("span");
        description.textContent = game.description;
        copy.append(name, description);
        card.append(copy);
        cards.append(card);
      }
      article.append(heading, cards);
      sections.append(article);
    }
  };
  const applyLocale = () => {
    cancelEffects();
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
    window.WeightPlayAudio?.preload(GAME_AUDIO_CUES);
    state.sessionChecks = 0;
    state.path = 0;
    state.chain = [];
    state.campaignRun = true;
    state.lastResultCampaign = false;
    show("stage");
    renderStages({ entry: true });
    track("session_start");
  };
  const startPath = (index, { campaign = false, resetSession = false } = {}) => {
    if (index < 0 || index >= paths.length || index + 1 > readProgress().highestUnlocked) return;
    cancelEffects();
    state.path = index;
    state.chain = [];
    state.motionSlot = null;
    state.focusedClue = null;
    state.errorSlot = -1;
    state.verifiedPrefix = 0;
    state.checks = 0;
    state.campaignRun = campaign;
    state.lastResultCampaign = false;
    if (resetSession) state.sessionChecks = 0;
    show("battle");
    renderBattle();
    setBattleStatus(t("chainProgress", { count: 0, total: expectedTarget(paths[state.path]).length }));
    track("path_start", { path: state.path + 1, arc: paths[state.path].arcKey });
  };
  const chooseLantern = (id) => {
    if (state.screen !== "battle" || !lanterns.some((lantern) => lantern.id === id)) return;
    const item = paths[state.path];
    const used = state.chain.filter((entry) => entry === id).length;
    const canEcho = item.echoId === id && used === 1;
    if (state.chain.length >= expectedTarget(item).length || (used > 0 && !canEcho)) {
      setBattleStatus(t("chainReady"), "error"); audio?.play("feedback.error"); flash($("checkBtn")); return;
    }
    const source = $("lanternGrid").querySelector(`[data-lantern="${id}"] .lantern-icon`);
    const before = linkedClues().filter(Boolean).length;
    state.chain.push(id);
    state.motionSlot = state.chain.length - 1;
    state.errorSlot = -1; state.verifiedPrefix = 0;
    renderBattle();
    flyLight(id, source, $("chainList").children[state.chain.length - 1]);
    setBattleStatus(t(state.chain.length === expectedTarget(item).length ? "chainReady" : "chainProgress",
      { count: state.chain.length, total: expectedTarget(item).length }), "neutral");
    audio?.play(linkedClues().filter(Boolean).length > before ? "puzzle.match" : "board.move");
    track("lantern_choose", { path: state.path + 1, position: state.chain.length, lantern: id });
  };
  const rewindChain = (index) => {
    if (state.screen !== "battle" || index < 0 || index >= state.chain.length) return;
    state.chain.slice(index).forEach((id, offset) => flyLight(id, $("chainList").children[index + offset], $("chainList").children[index + offset], true));
    const removed = state.chain.length - index;
    state.chain = state.chain.slice(0, index);
    state.motionSlot = null;
    state.errorSlot = -1; state.verifiedPrefix = 0;
    renderBattle();
    setBattleStatus(t("chainProgress", { count: state.chain.length, total: expectedTarget(paths[state.path]).length }));
    audio?.play("board.undo");
    track("rewind", { path: state.path + 1, from: index + 1, removed });
  };
  const resetChain = () => {
    if (state.screen !== "battle") return;
    const hadLights = state.chain.length > 0;
    state.chain.forEach((id, index) => flyLight(id, $("chainList").children[index], $("chainList").children[index], true));
    state.chain = [];
    state.motionSlot = null;
    state.errorSlot = -1; state.verifiedPrefix = 0;
    renderBattle();
    setBattleStatus(t("chainProgress", { count: 0, total: expectedTarget(paths[state.path]).length }));
    if (hadLights) audio?.play("board.undo");
    else flash($("resetBtn"));
    track("reset", { path: state.path + 1 });
  };
  const checkPath = () => {
    if (state.screen !== "battle") return;
    const item = paths[state.path];
    const target = expectedTarget(item);
    if (state.chain.length < target.length) {
      setBattleStatus(t("campaignNeedMore", { count: target.length - state.chain.length }), "neutral");
      flash($("chainList").children[state.chain.length]); audio?.play("feedback.hint");
      track("check", { path: state.path + 1, checks: state.sessionChecks, correct: false, reason: "incomplete" });
      return;
    }
    state.checks += 1;
    state.sessionChecks += 1;
    renderBattle();
    const firstMismatch = target.findIndex((id, index) => id !== state.chain[index]);
    const decoyChosen = item.decoy && state.chain.includes(item.decoy);
    track("check", { path: state.path + 1, checks: state.sessionChecks, correct: firstMismatch < 0 && !decoyChosen });
    if (decoyChosen) {
      state.errorSlot = state.chain.indexOf(item.decoy); state.verifiedPrefix = Math.max(0, firstMismatch);
      renderBattle(); flash($("chainList").children[state.errorSlot]); audio?.play("feedback.error");
      setBattleStatus(t("decoyWrong", { name: t(item.decoy) }), "error");
      return;
    }
    if (firstMismatch >= 0) {
      state.errorSlot = firstMismatch; state.verifiedPrefix = firstMismatch;
      renderBattle(); flash($("chainList").children[firstMismatch]); audio?.play("feedback.error");
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
    audio?.play(item.checkpoint ? "result.win" : "puzzle.clear");
  };
  $("startBtn").addEventListener("click", startSession);
  $("mapBtn").addEventListener("click", () => { state.campaignRun = false; show("stage"); renderStages({ entry: true }); track("path_map"); });
  $("stageBackBtn").addEventListener("click", () => { state.campaignRun = false; show("main"); });
  $("battleBackBtn").addEventListener("click", () => { state.campaignRun = false; show("stage"); renderStages({ entry: true }); });
  $("resultMapBtn").addEventListener("click", () => { state.campaignRun = false; show("stage"); renderStages({ entry: true }); });
  $("resultHomeBtn").addEventListener("click", () => {
    state.campaignRun = false;
    startPath(state.path, { resetSession: true });
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
  const effectPauseObserver = new MutationObserver(() => {
    const covered = $("battleContent").inert;
    effects.forEach((animation) => covered ? animation.pause() : animation.play());
    if (covered) audio?.stop();
  });
  effectPauseObserver.observe($("battleContent"), { attributes: true, attributeFilter: ["inert"] });
  window.addEventListener("pagehide", (event) => {
    cancelEffects();
    if (event.persisted) return;
    effectPauseObserver.disconnect();
    audio?.dispose();
    window.removeEventListener("resize", centerStageAfterViewportChange);
    stageRailResizeObserver?.disconnect();
    stageRailController?.destroy();
    stageRailController = null;
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) cancelEffects(); });
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

  const installInterfaceSevenRuntime = () => {
    if (document.querySelector('link[href*="interface-7-cleanup.css"]')) return;
    const stageScreen = $("stageScreen");
    const battleScreen = $("battleScreen");
    const stageCanvas = stageScreen?.querySelector(".stage-canvas");
    stageScreen?.setAttribute("data-wp-logical-stage-canvas", "");
    stageScreen?.setAttribute("data-wp-canvas-max-width", "920");
    stageCanvas?.setAttribute("data-wp-standard-stage-screen", "");
    battleScreen?.setAttribute("data-wp-logical-battle-canvas", "");
    battleScreen?.setAttribute("data-wp-canvas-max-width", "920");

    const markup = [
      '<link rel="stylesheet" href="/src/stage-selector-standard.css" data-wp-stage-standard>',
      '<link rel="stylesheet" href="/src/game-screen-frame.css?v=20260921-interface7-single-frame-v2">',
       '<link rel="stylesheet" href="/games/animal-lantern-lattice/interface-7-cleanup.css?v=20260924-lantern-i7-hit-target-fix">',
      '<script src="/src/stage-selector-standard.js" data-wp-stage-standard></script>',
      '<script src="/src/stage-virtualization-standard.js?v=20260809-stage-v6-source-demotion-v8" data-wp-stage-virtualization-standard></script>',
      '<script src="/src/battle-canvas-standard.js?v=20260911-folded-field-battle-envelope-v1" data-wp-battle-standard></script>',
       '<script src="/games/animal-lantern-lattice/interface-7-compat.js?v=20260924-lantern-i7-copy-hit-target-fix"></script>',
      '<script src="/games/animal-lantern-lattice/interface-7-followup.js?v=20260923-lantern-i7-cleanup2"></script>',
      '<script src="/src/game-screen-frame.js?v=20260921-interface7-single-frame-v2&wp-audio=1.0.0"></script>',
    ].join("");
    if (document.readyState === "loading") document.write(markup);
  };
  installInterfaceSevenRuntime();
})();
