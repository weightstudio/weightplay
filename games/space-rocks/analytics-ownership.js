(() => {
  "use strict";

  const GAME_ID = "space-rocks";
  const GAME_VERSION = "v15";
  const INTERFACE_VERSION = "7";
  let inputType = "unknown";
  let resultVisible = false;
  let previousScore = Number(document.querySelector("#scoreValue")?.textContent || 0) || 0;
  let previousWave = Number(document.querySelector("#levelValue")?.textContent || 1) || 1;
  let rapidActive = false;
  let firstControlSeen = false;

  const viewportBucket = () => {
    const width = window.innerWidth || 0;
    const height = window.innerHeight || 0;
    if (width >= 700 && width > height) return "short-landscape";
    if (width < 480 && height >= width) return "phone-portrait";
    if (width <= 900) return "tablet";
    return "desktop";
  };
  const locale = () => {
    const pathLocale = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
    return pathLocale[window.location.pathname.split("/").filter(Boolean)[0]] || document.documentElement.lang || "en";
  };
  const wave = () => Number(document.querySelector("#levelValue")?.textContent || 0) || null;
  const bounded = value => Math.max(0, Math.min(999999, Number(value) || 0));
  const track = (name, details = {}) => {
    try {
      window.WonderAnalytics?.track?.(name, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale(),
        viewport_bucket: viewportBucket(),
        input_type: details.input_type || inputType,
        wave: details.wave ?? wave(),
        score: bounded(document.querySelector("#scoreValue")?.textContent),
        ...details,
      });
    } catch {
      // Measurement must never interrupt the arcade loop.
    }
  };
  const rememberInput = event => {
    if (event?.pointerType === "touch") inputType = "touch";
    else if (event?.pointerType) inputType = "pointer";
    else inputType = "keyboard";
  };
  const actionForKey = key => {
    const value = String(key || "").toLowerCase();
    if (value === "arrowleft" || value === "a") return "left";
    if (value === "arrowright" || value === "d") return "right";
    if (value === "arrowup" || value === "w") return "thrust";
    if (value === " " || value === "space" || value === "spacebar") return "fire";
    if (value === "shift") return "shield";
    return null;
  };
  const recordControl = (action, event) => {
    if (!action) return;
    rememberInput(event);
    if (!firstControlSeen) {
      firstControlSeen = true;
      track("control_first_use", { action, input_type: inputType });
    }
    if (action === "shield") track("shield_use", { action, input_type: inputType });
  };

  document.addEventListener("pointerdown", event => {
    const control = event.target.closest?.("#touchControls [data-action]");
    if (control) recordControl(control.dataset.action, event);
  }, true);
  window.addEventListener("keydown", event => recordControl(actionForKey(event.key), event), true);
  document.addEventListener("click", event => {
    const target = event.target.closest?.("#startBtn, #retryBtn, #homeBtn, #backLeaveBtn");
    if (!target || target.disabled || target.hidden) return;
    rememberInput(event);
    if (target.id === "startBtn") {
      track("game_start", { input_type: inputType, from: "main" });
      requestAnimationFrame(() => track("drift_cue_visible", { input_type: inputType, cue_visible: Boolean(document.querySelector("#gameMessage")?.textContent.trim()) }));
    } else if (target.id === "retryBtn") track("replay", { input_type: inputType, from: "result" });
    else track("main_return", { input_type: inputType, from: target.id === "backLeaveBtn" ? "battle" : "result" });
  }, true);

  const score = document.querySelector("#scoreValue");
  if (score) new MutationObserver(() => {
    const current = bounded(score.textContent);
    if (current > previousScore) track("target_hit", { score_delta: current - previousScore });
    previousScore = current;
  }).observe(score, { childList: true, characterData: true, subtree: true });

  const level = document.querySelector("#levelValue");
  if (level) new MutationObserver(() => {
    const current = Number(level.textContent || 0) || 0;
    if (current > previousWave) track("wave_clear", { wave: previousWave, to_wave: current });
    previousWave = current;
  }).observe(level, { childList: true, characterData: true, subtree: true });

  const power = document.querySelector("#powerValue");
  if (power) new MutationObserver(() => {
    const current = power.textContent || "";
    const active = !current.includes("—");
    if (active && !rapidActive) track("rapid_fire_pickup", { power_visible: true });
    rapidActive = active;
  }).observe(power, { childList: true, characterData: true, subtree: true });

  const result = document.querySelector("#resultScreen");
  if (result) new MutationObserver(() => {
    if (!result.hidden && !resultVisible) {
      resultVisible = true;
      track("result", { outcome: "unknown" });
    } else if (result.hidden) resultVisible = false;
  }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
})();
