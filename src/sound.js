(function () {
  const muteKey = "wonderSoundMuted";
  const positionKey = "wonderSoundTogglePosition";
  const localeKey = "weightPlayLocale";
  let audioContext = null;
  let unlocked = false;
  let muted = false;
  let dragState = null;

  const labels = {
    en: {
      sound: "Sound",
      enable: "Enable sound",
      disable: "Disable sound",
    },
    "zh-Hant": {
      sound: "音效",
      enable: "開啟音效",
      disable: "關閉音效",
    },
    "zh-Hans": {
      sound: "音效",
      enable: "开启音效",
      disable: "关闭音效",
    },
  };

  try {
    muted = localStorage.getItem(muteKey) === "1";
  } catch {
    muted = false;
  }

  const sounds = {
    click: [
      [520, 0.05, 0.035],
      [680, 0.07, 0.025],
    ],
    success: [
      [520, 0.08, 0.04],
      [720, 0.1, 0.045],
      [920, 0.13, 0.05],
    ],
    wrong: [
      [260, 0.08, 0.05],
      [180, 0.1, 0.045],
    ],
    win: [
      [520, 0.09, 0.04],
      [680, 0.11, 0.045],
      [860, 0.13, 0.05],
      [1080, 0.18, 0.055],
    ],
    start: [
      [420, 0.03, 0.035],
      [640, 0.08, 0.045],
      [840, 0.14, 0.04],
    ],
    shoot: [
      [760, 0.01, 0.025],
      [520, 0.04, 0.018],
    ],
    hit: [
      [180, 0.01, 0.035],
      [320, 0.035, 0.02],
    ],
    enemyDown: [
      [420, 0.02, 0.028],
      [680, 0.06, 0.036],
      [980, 0.11, 0.026],
    ],
    wallHit: [
      [120, 0.01, 0.05],
      [90, 0.05, 0.035],
    ],
    boss: [
      [140, 0.01, 0.045],
      [180, 0.08, 0.04],
      [110, 0.15, 0.04],
    ],
    upgrade: [
      [560, 0.02, 0.035],
      [760, 0.07, 0.04],
      [1120, 0.13, 0.035],
    ],
    coin: [
      [880, 0.02, 0.024],
      [1180, 0.06, 0.024],
    ],
  };

  function ensureContext() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioContext = new AudioContextClass();
    }
    return audioContext;
  }

  function unlock() {
    const context = ensureContext();
    if (!context) return;

    if (context.state === "suspended") {
      context.resume();
    }

    unlocked = true;
    updateToggle();
  }

  function play(name) {
    if (muted) return;
    const context = ensureContext();
    const notes = sounds[name];
    if (!context || !notes) return;

    if (context.state === "suspended") {
      context.resume();
    }

    const start = context.currentTime;
    notes.forEach(([frequency, offset, gainValue]) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start + offset);
      gain.gain.exponentialRampToValueAtTime(gainValue, start + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.16);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start + offset);
      oscillator.stop(start + offset + 0.18);
    });
  }

  function setMuted(value) {
    muted = value;
    try {
      localStorage.setItem(muteKey, muted ? "1" : "0");
    } catch {
      // Sound preferences are optional.
    }
    updateToggle();
    window.WonderAnalytics?.track("sound_toggle", { muted });
  }

  function currentLocale() {
    const config = window.WONDER_SITE?.localization || {};
    const supported = config.phaseOneLocales || Object.keys(labels);
    const fallback = config.fallbackLocale || config.defaultLocale || "en";

    try {
      const saved = localStorage.getItem(localeKey);
      if (saved && supported.includes(saved)) return saved;
    } catch {
      // Locale storage is optional.
    }

    return window.WonderI18n?.locale?.() || document.documentElement.lang || fallback;
  }

  function soundLabels() {
    const locale = currentLocale();
    return labels[locale] || labels.en;
  }

  function updateToggle() {
    const toggle = document.querySelector("[data-sound-toggle]");
    if (!toggle) return;

    const text = soundLabels();
    toggle.textContent = muted ? "🔇" : "🔊";
    toggle.title = text.sound;
    toggle.setAttribute("aria-label", muted ? text.enable : text.disable);
    toggle.classList.toggle("muted", muted);
    toggle.classList.toggle("locked", !unlocked);
  }

  function installStyles() {
    if (document.querySelector("[data-sound-style]")) return;
    const style = document.createElement("style");
    style.dataset.soundStyle = "true";
    style.textContent = `
      .sound-toggle {
        position: fixed !important;
        z-index: 80 !important;
        left: auto !important;
        top: auto !important;
        right: max(12px, env(safe-area-inset-right)) !important;
        bottom: max(12px, env(safe-area-inset-bottom)) !important;
        display: grid !important;
        place-items: center !important;
        width: 42px !important;
        height: 42px !important;
        margin: 0 !important;
        border: 1px solid rgba(255, 255, 255, 0.28) !important;
        border-radius: 50% !important;
        background: rgba(14, 18, 26, 0.66) !important;
        color: #fff !important;
        font: 900 18px/1 system-ui, sans-serif !important;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.26) !important;
        opacity: 0.72 !important;
        backdrop-filter: blur(10px) !important;
        cursor: grab !important;
        touch-action: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        transition: opacity 0.15s ease, transform 0.15s ease !important;
      }
      .sound-toggle:hover,
      .sound-toggle:focus-visible {
        opacity: 1 !important;
        transform: scale(1.06) !important;
      }
      .sound-toggle.dragging {
        opacity: 1 !important;
        cursor: grabbing !important;
        transition: none !important;
      }
      .sound-toggle.muted {
        opacity: 0.54 !important;
      }
    `;
    document.head.append(style);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readPosition() {
    try {
      const saved = JSON.parse(localStorage.getItem(positionKey) || "null");
      if (!saved || !Number.isFinite(saved.x) || !Number.isFinite(saved.y)) return null;
      return saved;
    } catch {
      return null;
    }
  }

  function savePosition(x, y) {
    try {
      localStorage.setItem(positionKey, JSON.stringify({ x: Math.round(x), y: Math.round(y) }));
    } catch {
      // Sound button position is optional.
    }
  }

  function placeToggle(button, x, y, persist = false) {
    const rect = button.getBoundingClientRect();
    const width = rect.width || 42;
    const height = rect.height || 42;
    const margin = 8;
    const nextX = clamp(x, margin, window.innerWidth - width - margin);
    const nextY = clamp(y, margin, window.innerHeight - height - margin);
    button.style.left = `${nextX}px`;
    button.style.top = `${nextY}px`;
    button.style.right = "auto";
    button.style.bottom = "auto";
    if (persist) savePosition(nextX, nextY);
  }

  function applySavedPosition(button) {
    const saved = readPosition();
    if (!saved) return;
    requestAnimationFrame(() => placeToggle(button, saved.x, saved.y, false));
  }

  function installDrag(button) {
    button.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      const rect = button.getBoundingClientRect();
      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        moved: false,
      };
      button.setPointerCapture?.(event.pointerId);
    });

    button.addEventListener("pointermove", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
      if (distance > 4) {
        dragState.moved = true;
        button.classList.add("dragging");
      }
      if (!dragState.moved) return;
      event.preventDefault();
      placeToggle(button, event.clientX - dragState.offsetX, event.clientY - dragState.offsetY, false);
    });

    button.addEventListener("pointerup", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      if (dragState.moved) {
        event.preventDefault();
        const rect = button.getBoundingClientRect();
        savePosition(rect.left, rect.top);
      }
      button.releasePointerCapture?.(event.pointerId);
      button.classList.remove("dragging");
      window.setTimeout(() => {
        dragState = null;
      }, 0);
    });

    button.addEventListener("pointercancel", () => {
      button.classList.remove("dragging");
      dragState = null;
    });

    window.addEventListener("resize", () => {
      const rect = button.getBoundingClientRect();
      placeToggle(button, rect.left, rect.top, true);
    });
  }

  function installToggle() {
    if (document.querySelector("[data-sound-toggle]")) return;

    installStyles();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sound-toggle";
    button.dataset.soundToggle = "true";
    installDrag(button);
    button.addEventListener("click", (event) => {
      if (dragState?.moved) {
        event.preventDefault();
        return;
      }
      unlock();
      setMuted(!muted);
      if (!muted) play("click");
    });
    document.body.append(button);
    applySavedPosition(button);
    updateToggle();
  }

  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
  window.addEventListener("wonder:locale-change", updateToggle);

  window.WonderSound = {
    play,
    unlock,
    isMuted: () => muted,
    setMuted,
  };

  if (document.body.dataset.soundToggle !== "off") {
    installToggle();
  }
})();
