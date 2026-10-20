/* Shared lobby navigation and I9 game entry; no per-game renderer or theme. */
(() => {
  const path = window.location.pathname.replace(/\/+$/, "");
  const GAME_ID = path.match(/\/games\/([a-z0-9-]+)(?:\/index\.html)?$/)?.[1] || "";
  const STYLE_URL = "/src/game-entry-loader.css?v=20261020-single-loading-label1";
  const ROOT_CLASS = "wp-game-entry-loader";
  const gamePath = Boolean(GAME_ID);
  let selectedGameId = GAME_ID;
  let selectedAnchor = null;

  if (document.documentElement.dataset.wpGameEntryLoaderInstalled === "true") return;
  document.documentElement.dataset.wpGameEntryLoaderInstalled = "true";

  const ensureStyle = () => {
    if (document.querySelector('link[data-wp-game-entry-loader-style="true"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL(STYLE_URL, window.location.origin).href;
    link.dataset.wpGameEntryLoaderStyle = "true";
    document.head.append(link);
  };

  const copy = () => {
    const locale = (document.documentElement.lang || "en").toLowerCase();
    const bundles = {
      "zh-hant": ["正在載入{game}…", "遊戲載入失敗", "部分遊戲資源無法載入。請重試或返回大廳。", "重試", "返回大廳", "取消", "正在開啟{game}…", "已載入 {loaded}/{total} 項資源"],
      "zh-hans": ["正在载入{game}…", "游戏载入失败", "部分游戏资源无法载入。请重试或返回大厅。", "重试", "返回大厅", "取消", "正在打开{game}…", "已载入 {loaded}/{total} 项资源"],
      ja: ["{game}を読み込み中…", "ゲームを読み込めませんでした", "一部のゲーム素材を読み込めません。再試行するかロビーに戻ってください。", "再試行", "ロビーに戻る", "キャンセル", "ゲームを開いています…", "リソース {loaded}/{total} 件を読み込みました"],
      ko: ["{game}를 불러오는 중…", "게임을 불러오지 못했습니다", "일부 게임 리소스를 불러오지 못했습니다. 다시 시도하거나 로비로 돌아가세요.", "다시 시도", "로비로 돌아가기", "취소", "게임을 여는 중…", "리소스 {loaded}/{total}개 로드됨"],
      es: ["Cargando {game}…", "No se pudo cargar el juego", "No se pudieron cargar algunos recursos. Inténtalo de nuevo o vuelve al lobby.", "Reintentar", "Volver al lobby", "Cancelar", "Abriendo el juego…", "Recursos cargados: {loaded}/{total}"],
      "pt-br": ["Carregando {game}…", "Não foi possível carregar o jogo", "Alguns recursos não carregaram. Tente novamente ou volte ao lobby.", "Tentar novamente", "Voltar ao lobby", "Cancelar", "Abrindo o jogo…", "Recursos carregados: {loaded}/{total}"],
      fr: ["Chargement de {game}…", "Impossible de charger le jeu", "Certaines ressources n’ont pas pu être chargées. Réessayez ou retournez au lobby.", "Réessayer", "Retour au lobby", "Annuler", "Ouverture du jeu…", "Ressources chargées : {loaded}/{total}"],
      de: ["{game} wird geladen…", "Spiel konnte nicht geladen werden", "Einige Spielressourcen konnten nicht geladen werden. Erneut versuchen oder zur Lobby zurückkehren.", "Erneut versuchen", "Zurück zur Lobby", "Abbrechen", "Spiel wird geöffnet…", "Geladene Ressourcen: {loaded}/{total}"],
      it: ["Caricamento di {game}…", "Impossibile caricare il gioco", "Alcune risorse non sono state caricate. Riprova o torna alla lobby.", "Riprova", "Torna alla lobby", "Annulla", "Apertura del gioco…", "Risorse caricate: {loaded}/{total}"],
      ru: ["Загрузка {game}…", "Не удалось загрузить игру", "Не удалось загрузить некоторые ресурсы. Повторите попытку или вернитесь в лобби.", "Повторить", "В лобби", "Отмена", "Открываем игру…", "Загружено ресурсов: {loaded}/{total}"],
      hi: ["{game} लोड हो रहा है…", "गेम लोड नहीं हो सका", "कुछ गेम संसाधन लोड नहीं हुए। फिर कोशिश करें या लॉबी में लौटें।", "फिर कोशिश करें", "लॉबी में लौटें", "रद्द करें", "गेम खोला जा रहा है…", "लोड किए गए संसाधन: {loaded}/{total}"],
      ar: ["جارٍ تحميل {game}…", "تعذّر تحميل اللعبة", "تعذّر تحميل بعض الموارد. أعد المحاولة أو عُد إلى الردهة.", "إعادة المحاولة", "العودة إلى الردهة", "إلغاء", "جارٍ فتح اللعبة…", "الموارد المحمّلة: {loaded}/{total}"],
    };
    const titles = window.WEIGHTPLAY_GAME_TITLES?.[selectedGameId] || {};
    const name = Object.entries(titles).find(([key]) => key.toLowerCase() === locale)?.[1]
      || (gamePath ? document.querySelector('[data-wp-game-title]')?.textContent.trim() : selectedAnchor?.querySelector('h2,h3,.game-name,.game-title')?.textContent.trim())
      || titles.en || ({'zh-hant':'遊戲','zh-hans':'游戏',ja:'ゲーム',ko:'게임',ar:'اللعبة'}[locale] || 'game');
    return (bundles[locale] || ["Loading {game}…", "Game could not be loaded", "Some game resources could not be loaded. Retry or return to the lobby.", "Retry", "Back to lobby", "Cancel", "Opening {game}…", "Loaded {loaded}/{total} resources"])
      .map(text => text.replaceAll('{game}', name));
  };

  function makeOverlay({ titleText, messageText, mode = "loading", showBack = false, retry, cancel } = {}) {
    ensureStyle();
    document.documentElement.dataset.wpGameEntryLoaderActive = "true";
    const overlay = document.createElement("section");
    overlay.className = ROOT_CLASS;
    overlay.dataset.state = mode;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "wp-game-entry-loader-title");
    overlay.setAttribute("aria-busy", String(mode === "loading"));
    const [loadingText, errorTitle, errorCopy, retryText, backText, cancelText] = copy();
    const title = document.createElement("strong");
    title.className = "wp-game-entry-loader-title";
    title.id = "wp-game-entry-loader-title";
    title.textContent = titleText || (mode === "error" ? errorTitle : loadingText);
    const status = document.createElement("span");
    status.className = "wp-game-entry-loader-status";
    status.setAttribute("aria-live", "polite");
    const setStatus = (message = "") => {
      const text = String(message).trim();
      const normalize = (value) => value.trim().replace(/\s+/g, " ");
      status.textContent = normalize(text) === normalize(title.textContent) ? "" : text;
      status.hidden = !status.textContent;
    };
    setStatus(messageText ?? (mode === "error" ? errorCopy : ""));
    const track = document.createElement("span");
    track.className = "wp-game-entry-loader-track";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", loadingText);
    track.setAttribute("aria-valuetext", loadingText);
    const actions = document.createElement("div");
    actions.className = "wp-game-entry-loader-actions";
    const button = (label, action, className = "") => {
      const element = document.createElement("button");
      element.type = "button";
      element.className = `wp-game-entry-loader-button ${className}`.trim();
      element.textContent = label;
      element.addEventListener("click", action, { once: true });
      actions.append(element);
      return element;
    };
    const card = document.createElement("div");
    card.className = "wp-game-entry-loader-card";
    card.append(title, status, track, actions);
    overlay.append(card);
    if (mode === "error") {
      button(retryText, retry || (() => window.location.reload()), "is-primary");
      button(backText, cancel || goBack);
    } else if (cancel) {
      button(cancelText, cancel);
    } else if (showBack) {
      button(backText, goBack);
    }
    const appendController = new AbortController();
    const append = () => {
      if (appendController.signal.aborted) return;
      appendController.abort();
      if (document.body && overlay.dataset.state !== "ready") {
        document.body.append(overlay);
      }
    };
    if (document.body) append();
    else document.addEventListener("DOMContentLoaded", append, { once: true, signal: appendController.signal });
    return { overlay, title, status, setStatus, track, actions, button, appendController };
  }

  const goBack = () => {
    const referrer = (() => {
      try { return new URL(document.referrer); } catch { return null; }
    })();
    const localizedLobby = path.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\/games\//i)?.[1];
    const target = referrer?.origin === window.location.origin
      && !/\/games\//.test(referrer.pathname)
      ? `${referrer.pathname}${referrer.search}${referrer.hash}`
      : `/${localizedLobby || "en"}/`;
    window.location.assign(target);
  };

  if (gamePath) {
    const state = { root: null, loaded: 0, total: null, retry: null, ready: false, failed: false, engineOwned: false, fadeTimer: 0 };
    const hideLegacyPanel = () => {
      // CSS hides the old renderer; preserve its attributes as engine-ready signals.
      document.documentElement.dataset.wpGameEntryLoaderActive = "true";
    };
    const start = () => {
      if (state.ready || state.root?.overlay) return state.root;
      hideLegacyPanel();
      state.root = makeOverlay({ showBack: true });
      return state.root;
    };
    const clearFailure = () => {
      state.retry = null;
      state.root?.appendController?.abort();
      state.root?.overlay?.remove();
      state.root = null;
      document.documentElement.removeAttribute("data-wp-game-entry-loader-active");
    };
    const begin = (total) => {
      state.engineOwned = true;
      state.failed = false;
      state.loaded = 0;
      state.total = Number.isFinite(total) && total > 0 ? Math.floor(total) : null;
      hideLegacyPanel();
      const ui = start();
      if (!ui) return;
      ui.overlay.dataset.state = "loading";
      ui.overlay.setAttribute("aria-busy", "true");
      ui.title.textContent = copy()[0];
      ui.setStatus();
      ui.track.removeAttribute("aria-valuenow");
      ui.track.setAttribute("aria-valuetext", copy()[0]);
      if (state.total) {
        ui.track.setAttribute("aria-valuemax", String(state.total));
        ui.track.setAttribute("aria-valuenow", "0");
        ui.track.style.setProperty("--wp-entry-progress", "0%");
        ui.setStatus(copy()[7].replace("{loaded}", "0").replace("{total}", String(state.total)));
      } else {
        ui.track.removeAttribute("aria-valuemax");
        ui.track.style.removeProperty("--wp-entry-progress");
      }
    };
    const assetProgress = (loaded, total) => {
      if (state.ready || state.failed) return;
      const ui = start();
      if (!ui || !Number.isFinite(loaded) || !Number.isFinite(total) || total <= 0) return;
      state.loaded = Math.max(0, Math.min(Math.floor(total), Math.floor(loaded)));
      state.total = Math.floor(total);
      ui.track.setAttribute("aria-valuemax", String(state.total));
      ui.track.setAttribute("aria-valuenow", String(state.loaded));
      ui.track.setAttribute("aria-valuetext", copy()[7].replace("{loaded}", String(state.loaded)).replace("{total}", String(state.total)));
      ui.track.style.setProperty("--wp-entry-progress", `${state.loaded / state.total * 100}%`);
      ui.setStatus(copy()[7].replace("{loaded}", String(state.loaded)).replace("{total}", String(state.total)));
    };
    const fail = (message, retry) => {
      if (state.ready || state.failed) return;
      state.failed = true;
      stopAuto();
      state.retry = typeof retry === "function" ? retry : () => window.location.reload();
      state.root?.appendController?.abort();
      state.root?.overlay?.remove();
      state.root = makeOverlay({ mode: "error", messageText: message || undefined, retry: () => {
        const retryAction = state.retry;
        clearFailure();
        begin(state.total);
        retryAction?.();
      }, cancel: () => { clearFailure(); goBack(); } });
    };
    const ready = () => {
      if (state.ready || state.failed) return;
      state.ready = true;
      stopAuto();
      window.clearTimeout(state.fadeTimer);
      window.removeEventListener("error", onResourceError, true);
      window.removeEventListener("pagehide", onGamePageHide);
      const overlay = state.root?.overlay;
      state.root?.appendController?.abort();
      document.documentElement.removeAttribute("data-wp-game-entry-loader-active");
      if (!overlay || !overlay.isConnected) { overlay?.remove(); return; }
      overlay.dataset.state = "ready";
      overlay.setAttribute("aria-busy", "false");
      overlay.classList.add("is-leaving");
      const remove = () => { overlay.remove(); window.clearTimeout(state.fadeTimer); };
      overlay.addEventListener("transitionend", remove, { once: true });
      state.fadeTimer = window.setTimeout(remove, 240);
    };
    function onResourceError(event) {
      const failed = event.target;
      if (!(failed instanceof HTMLScriptElement)) return;
      const source = failed.src || "";
      if (source.includes(`/games/${GAME_ID}/`) || source.includes("/src/game-screen-frame.js")) {
        fail(undefined, () => window.location.reload());
      }
    }
    function onGamePageHide() {
      stopAuto();
      window.clearTimeout(state.fadeTimer);
      window.removeEventListener("error", onResourceError, true);
      state.root?.appendController?.abort();
      state.root?.overlay?.remove();
    }
    const api = Object.freeze({ start, begin, assetProgress, fail, ready, isActive: true });
    window.WeightPlayGameEntryLoader = api;
    start();
    window.addEventListener("error", onResourceError, true);
    window.addEventListener("pagehide", onGamePageHide, { once: true });
    // Existing games keep their readiness logic. The shared bridge observes
    // the old panel's engine-owned completion flag, never our CSS visibility.
    let autoFrame = 0;
    const observer = new MutationObserver(scheduleAuto);
    const autoTimeout = window.setTimeout(() => {
      if (!state.ready && !state.engineOwned && !state.failed) fail();
    }, 20000);
    function stopAuto() {
      observer.disconnect();
      window.clearTimeout(autoTimeout);
      cancelAnimationFrame(autoFrame);
      window.removeEventListener('load', scheduleAuto);
      document.removeEventListener('load', onMainImageSettled, true);
      document.removeEventListener('error', onMainImageSettled, true);
    }
    function scheduleAuto() {
      if (!autoFrame && !state.ready && !state.failed && !state.engineOwned) {
        autoFrame = requestAnimationFrame(checkAuto);
      }
    }
    function legacyPanelFinished(panel) {
      for (let node = panel; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
        if (node.hidden || node.classList.contains('hidden') || node.classList.contains('is-hidden') || node.style.display === 'none' || node.getAttribute('aria-hidden') === 'true') return true;
        // A game may complete loading by hiding the containing scene. Do not
        // read our own CSS suppression of a legacy panel as an engine signal.
        if (node !== panel && !node.matches('#loadingPanel,.loading-panel') && getComputedStyle(node).display === 'none') return true;
      }
      return false;
    }
    function checkAuto() {
      autoFrame = 0;
      if (state.ready || state.failed || state.engineOwned || document.readyState !== 'complete') return;
      const panels = [...document.querySelectorAll('#loadingPanel,.loading-panel')];
      if (panels.some(panel => panel.classList.contains('has-error'))) { fail(); return; }
      if (panels.some(panel => !legacyPanelFinished(panel))) return;
      const visible = node => Boolean(node && !node.closest('[hidden]') && node.getClientRects().length
        && getComputedStyle(node).visibility !== 'hidden' && getComputedStyle(node).visibility !== 'collapse');
      // autoMountDocument supports legacy game-owned Main roots as well as
      // explicit mount() scenes. I9 metadata does not rewrite every legacy DOM
      // into data-wp-frame-scene, so readiness must accept both input forms.
      const main = [...document.querySelectorAll('[data-wp-frame-scene="main"],[data-wp-frame-main],[data-screen="main"],#main,#mainScreen,.main-screen,.main-canvas,main.main,.wp-standard-main-screen')]
        .find(node => node !== document.body && node !== document.documentElement && visible(node));
      if (!main) return;
      const start = [...main.querySelectorAll('[data-wp-main-start],[data-wp-frame-action="primary"],.standard-main-start,#startBtn,#startGameBtn,#startGame,#start,#playBtn,#beginBtn,#showStageBtn,button[data-start-game]')].find(visible);
      if (!start || start.disabled || start.getAttribute('aria-disabled') === 'true') return;
      const images = [...main.querySelectorAll('img:not([loading="lazy"])')].filter(visible);
      if (images.some(img => !img.complete)) return;
      if (images.some(img => !img.naturalWidth)) { fail(); return; }
      ready();
    }
    function onMainImageSettled(event) {
      // An image inserted/replaced after window.load can finish without any
      // attribute mutation. Recheck actual readiness on its native load/error.
      if (event.target instanceof HTMLImageElement) scheduleAuto();
    }
    observer.observe(document.documentElement, {childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','style','disabled','aria-disabled','aria-hidden','src']});
    window.addEventListener('load', scheduleAuto, {once:true});
    document.addEventListener('load', onMainImageSettled, true);
    document.addEventListener('error', onMainImageSettled, true);
    scheduleAuto();
    if (window.__weightPlayGameEntryPendingFailure === GAME_ID) {
      delete window.__weightPlayGameEntryPendingFailure;
      fail();
    }
    return;
  }

  if (gamePath || path.endsWith("/404")) return;
  let active = false;
  let overlayState = null;
  let targetUrl = "";
  let navTimer = 0;
  let navigationProbe = null;
  const reset = ({ restoreFocus = false } = {}) => {
    navigationProbe?.abort();
    navigationProbe = null;
    active = false;
    window.clearTimeout(navTimer);
    document.removeEventListener("keydown", onLobbyKeydown, true);
    navTimer = 0;
    overlayState?.overlay.remove();
    overlayState = null;
    document.documentElement.removeAttribute("data-wp-game-entry-loader-active");
    if (restoreFocus) selectedAnchor?.focus({ preventScroll: true });
  };
  const failNavigation = () => {
    if (!active || !overlayState) return;
    window.clearTimeout(navTimer);
    navTimer = 0;
    navigationProbe?.abort();
    navigationProbe = null;
    overlayState.overlay.remove();
    const [loadingText, errorTitle, errorCopy, retryText, backText] = copy();
    overlayState = makeOverlay({ mode: "error", titleText: errorTitle, messageText: errorCopy, retry: () => navigate(), cancel: () => reset({ restoreFocus: true }) });
    overlayState.status.setAttribute("aria-live", "assertive");
  };
  const navigate = () => {
    if (!active || !targetUrl) return;
    if (overlayState) {
      overlayState.overlay.dataset.state = "loading";
      overlayState.overlay.setAttribute("aria-busy", "true");
      overlayState.title.textContent = copy()[6];
      overlayState.setStatus();
      overlayState.status.setAttribute("aria-live", "polite");
      overlayState.actions.replaceChildren();
      overlayState.button(copy()[5], () => reset({ restoreFocus: true }));
    } else {
      overlayState = makeOverlay({ titleText: copy()[6], cancel: () => reset({ restoreFocus: true }) });
    }
    window.clearTimeout(navTimer);
    navigationProbe?.abort();
    navigationProbe = new AbortController();
    const currentProbe = navigationProbe;
    navTimer = window.setTimeout(failNavigation, 20000);
    document.addEventListener("keydown", onLobbyKeydown, true);
    // Probe only the same-origin response headers. A GET here would download
    // the full document and then make navigation download it again.
    fetch(targetUrl, { method: "HEAD", cache: "no-store", credentials: "same-origin", signal: currentProbe.signal })
      .then((response) => {
        if (!active || navigationProbe !== currentProbe) return;
        if (!response.ok) { failNavigation(); return; }
        window.clearTimeout(navTimer);
        navTimer = 0;
        navigationProbe = null;
        window.location.assign(targetUrl);
      })
      .catch((error) => {
        if (!active || navigationProbe !== currentProbe || error?.name === "AbortError") return;
        failNavigation();
      });
  };
  function onLobbyKeydown(event) {
    if (active && event.key === "Escape") {
      event.preventDefault();
      reset({ restoreFocus: true });
    }
  }
  const onClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!anchor || anchor.target && anchor.target !== "_self" || anchor.hasAttribute("download")) return;
    let url;
    try { url = new URL(anchor.href, window.location.href); } catch { return; }
    const match = url.pathname.match(/\/games\/([a-z0-9-]+)(?:\/(?:index\.html)?)?$/);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== window.location.origin || !match || anchor.relList.contains('external')) return;
    event.preventDefault();
    if (active) return;
    selectedGameId = match[1];
    selectedAnchor = anchor;
    active = true;
    targetUrl = url.href;
    overlayState = makeOverlay({ titleText: copy()[6], cancel: () => reset({ restoreFocus: true }) });
    navigate();
  };
  document.addEventListener("click", onClick, true);
  window.addEventListener("pagehide", () => {
    window.clearTimeout(navTimer);
    navigationProbe?.abort();
    navigationProbe = null;
    document.removeEventListener("keydown", onLobbyKeydown, true);
    if (overlayState) overlayState.overlay.remove();
    overlayState = null;
    active = false;
    document.documentElement.removeAttribute("data-wp-game-entry-loader-active");
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) reset();
  });
})();
