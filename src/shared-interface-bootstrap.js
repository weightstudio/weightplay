/*
 * Interface 7 route bootstrap.
 *
 * Every game route gets one shared visual/control contract.  Explicit
 * WeightPlayScreenFrame consumers keep their mount() implementation; legacy
 * routes use the same theme and the standard shell adapter until their game
 * content is migrated into declared frame slots.  This file owns no game
 * state and never changes scene order or gameplay handlers.
 */
(() => {
  "use strict";

  const root = document.documentElement;
  if (root.dataset.wpSharedInterfaceBootstrapped === "7") return;

  // site-config.js is also used by the lobby and utility pages.  Restrict the
  // rollout to canonical/localized game routes so the lobby keeps its own
  // entry shell while consuming the same token source where appropriate.
  const isGameRoute = /(?:^|\/)games\/[^/]+(?:\/|$)/i.test(location.pathname);
  if (!isGameRoute) return;

  root.dataset.wpSharedInterface = "7";
  root.dataset.wpSharedInterfaceBootstrapped = "7";

  const version = "20260911-interface7-universal";
  const assetUrl = (name) => new URL(name, `${location.origin}/src/`).href;

  const addStylesheet = (name) => {
    const href = assetUrl(`${name}?v=${version}`);
    if ([...document.querySelectorAll('link[rel="stylesheet"]')]
      .some((link) => link.href === href || link.href.replace(/\?.*$/, "") === href.replace(/\?.*$/, ""))) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.wpSharedInterface = "7";
    document.head.append(link);
  };

  // Insert the token source first; the frame CSS imports it as well, and the
  // duplicate-free check makes this safe for the four explicit adopters.
  addStylesheet("game-ui-theme.css");
  addStylesheet("game-screen-frame.css");
  addStylesheet("game-shell-controls-standard.css");

  const addInterfaceMeta = () => {
    let meta = document.querySelector('meta[name="weightplay-interface-version"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "weightplay-interface-version";
      document.head.append(meta);
    }
    meta.content = "7";
    document.body?.setAttribute("data-wp-interface-version", "7");
  };
  addInterfaceMeta();

  const gameIdFromPath = () => {
    const match = location.pathname.match(/(?:^|\/)games\/([^/]+)/i);
    return match?.[1] || "";
  };

  const findMainPoster = () => {
    const explicit = document.querySelector(
      "[data-wp-frame-poster], .main-poster, .main-cover, .menu-poster, main .poster, main img.cover, .poster-frame > img.cover, .cover-wrap > img, #posterImage, #coverImage"
    );
    const image = explicit?.tagName === "IMG" ? explicit : explicit?.querySelector("img");
    if (image) return image;
    // Legacy Main content slots do not all name the image itself. Restrict
    // discovery to Main and exclude guides/related cards, never Battle art.
    const scopes = document.querySelectorAll(
      '[data-wp-frame-main], [data-screen="main"], #main, #mainScreen, #main-screen, .main-screen, .screen.main'
    );
    for (const scope of scopes) {
      for (const candidate of scope.querySelectorAll("img")) {
        if (candidate.closest('a, [data-wp-guide], .game-guide, .public-game-guide, .related-games, [data-screen="battle"], [data-screen="stage"]')) continue;
        const identity = `${candidate.id} ${candidate.className} ${candidate.getAttribute("src") || ""}`;
        if (/loading|logo|icon|avatar|portrait|badge/i.test(identity)) continue;
        if (/cover|poster/i.test(identity)) return candidate;
      }
    }
    return null;
  };

  const applyInterface7Poster = () => {
    const gameId = gameIdFromPath();
    const poster = window.WEIGHTPLAY_INTERFACE7_POSTERS?.[gameId];
    if (!poster) return;
    const posterImage = findMainPoster();
    if (posterImage) {
      if (posterImage.getAttribute("src") !== poster) posterImage.src = poster;
      if (posterImage.hasAttribute("srcset")) posterImage.removeAttribute("srcset");
      posterImage.dataset.wpInterface7Poster = "true";
    }
    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')
      .forEach((meta) => { meta.content = new URL(poster, location.origin).href; });
  };

  const ensurePosterRegistry = (done) => {
    if (window.WEIGHTPLAY_INTERFACE7_POSTERS) {
      done();
      return;
    }
    if (window.__weightPlayInterface7PosterRegistryRequested) {
      window.addEventListener("weightplay-interface7-poster-registry-ready", done, { once: true });
      return;
    }
    window.__weightPlayInterface7PosterRegistryRequested = true;
    const script = document.createElement("script");
    script.src = assetUrl("interface7-poster-registry.js?v=20260911-authored-posters");
    script.dataset.wpSharedInterface = "7";
    script.addEventListener("load", () => {
      window.dispatchEvent(new Event("weightplay-interface7-poster-registry-ready"));
      done();
    }, { once: true });
    document.head.append(script);
  };

  const ensureLegacyShell = () => {
    // Explicit frames own their lifecycle.  The standard shell is only a
    // compatibility adapter for routes without a mounted frame.
    if (document.querySelector("[data-wp-frame-root],[data-wp-frame-adapted]")) return;
    if (document.querySelector('script[src*="game-shell-controls-standard.js"]')) return;
    if (document.querySelector('script[src*="game-screen-frame.js"]')) return;
    if (window.__weightPlaySharedShellRequested) return;
    window.__weightPlaySharedShellRequested = true;
    const script = document.createElement("script");
    script.src = assetUrl(`game-shell-controls-standard.js?v=${version}`);
    script.dataset.wpSharedInterface = "7";
    document.body.append(script);
  };

  const ready = () => {
    addInterfaceMeta();
    ensureLegacyShell();
    // Dynamic Main renderers create fresh images after initial startup or
    // returning from play. Captured image events cover that lifecycle without
    // a document-wide MutationObserver, timers, or retained old DOM nodes.
    const onImageSettled = (event) => {
      if (event.target?.tagName === "IMG" && event.target === findMainPoster()) applyInterface7Poster();
    };
    document.addEventListener("load", onImageSettled, true);
    document.addEventListener("error", onImageSettled, true);
    ensurePosterRegistry(applyInterface7Poster);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready, { once: true });
  } else {
    ready();
  }
})();
