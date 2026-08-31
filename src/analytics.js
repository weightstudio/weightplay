(function () {
  const config = window.WONDER_SITE?.analytics || {};
  const gaMeasurementId = config.gaMeasurementId || "";
  const debug = config.debug !== false;
  const sessionKey = "wonderSessionId";
  const countKey = "wonderAnalyticsCounts";
  const privacySafeKeys = new Set([
    "game_id",
    "game_version",
    "interface_version",
    "locale",
    "viewport_bucket",
    "input_type",
    "screen",
    "arena",
    "from",
    "entry",
    "action",
    "tool",
    "outcome",
    "to_locale",
    "snapshot",
  ]);
  const privacySafeToken = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

  function getSessionId() {
    let sessionId = "";
    try {
      sessionId = sessionStorage.getItem(sessionKey);
      if (!sessionId) {
        sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        sessionStorage.setItem(sessionKey, sessionId);
      }
    } catch {
      sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
    return sessionId;
  }

  function loadCounts() {
    try {
      return JSON.parse(localStorage.getItem(countKey)) || {};
    } catch {
      return {};
    }
  }

  function saveLocalCount(name) {
    const counts = loadCounts();
    counts[name] = (counts[name] || 0) + 1;
    try {
      localStorage.setItem(countKey, JSON.stringify(counts));
    } catch {
      // Analytics must never break gameplay.
    }
  }

  function emit(name, payload) {
    saveLocalCount(name);

    if (window.gtag) {
      window.gtag("event", name, payload);
    }

    if (debug) {
      console.info("[WonderAnalytics]", name, payload);
    }
  }

  function loadGoogleAnalytics() {
    if (!gaMeasurementId || document.querySelector("[data-wonder-ga]")) return;

    const script = document.createElement("script");
    script.async = true;
    script.dataset.wonderGa = "true";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.append(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaMeasurementId, {
      send_page_view: false,
      anonymize_ip: true,
    });
  }

  function track(name, params = {}) {
    const payload = {
      page_path: location.pathname,
      page_title: document.title,
      session_id: getSessionId(),
      ...params,
    };

    emit(name, payload);
  }

  function trackPrivacySafe(name, params = {}) {
    if (!/^[a-z][a-z0-9_]{0,63}$/.test(name)) return;
    const payload = {};
    for (const [key, value] of Object.entries(params || {})) {
      if (!privacySafeKeys.has(key)) continue;
      if (typeof value === "number" && Number.isFinite(value)) {
        payload[key] = Math.max(-10000, Math.min(10000, Math.floor(value)));
      } else if (typeof value === "string" && privacySafeToken.test(value)) {
        payload[key] = value;
      }
    }
    emit(name, payload);
  }

  loadGoogleAnalytics();

  window.WonderAnalytics = {
    track,
    trackPrivacySafe,
    counts: loadCounts,
    hasGoogleAnalytics: () => Boolean(gaMeasurementId),
  };

  track("page_view");
})();
