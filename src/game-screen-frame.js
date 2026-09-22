/* One shared frame. No game IDs, polling or parallel skin implementations. */
(() => {
  'use strict';
  if (window.WeightPlayScreenFrame?.version === 7) { window.WeightPlayScreenFrame.autoMountDocument?.(); return; }
  const frameScriptUrl = document.currentScript?.src || new URL('/src/game-screen-frame.js', location.origin).href;
  const mounts = new WeakMap();
  const slotMounts = new WeakMap();
  const lobbyLogoUrl = new URL('../assets/weightplay-logo.png', document.currentScript.src).href;
  const copy = {
    en: ['Settings', 'Language', 'Sound', 'On', 'Muted'], 'zh-Hant': ['設定', '語言', '聲音', '開啟', '靜音'],
    'zh-Hans': ['设置', '语言', '声音', '开启', '静音'], ja: ['設定', '言語', 'サウンド', 'オン', 'ミュート'],
    ko: ['설정', '언어', '소리', '켜짐', '음소거'], es: ['Configuración', 'Idioma', 'Sonido', 'Activado', 'Silencio'],
    'pt-BR': ['Configurações', 'Idioma', 'Som', 'Ligado', 'Mudo'], fr: ['Paramètres', 'Langue', 'Son', 'Activé', 'Muet'],
    de: ['Einstellungen', 'Sprache', 'Ton', 'An', 'Stumm'], it: ['Impostazioni', 'Lingua', 'Suono', 'Attivo', 'Muto'],
    ru: ['Настройки', 'Язык', 'Звук', 'Вкл.', 'Без звука'], hi: ['सेटिंग्स', 'भाषा', 'ध्वनि', 'चालू', 'म्यूट'],
    ar: ['الإعدادات', 'اللغة', 'الصوت', 'مفعّل', 'صامت'],
  };
  function createSettings({localeSelect, showLanguage = true, id = 'lobby', onOpen = () => {}}) {
    const abort = new AbortController();
    const notifyInteraction = () => {
      try { window.dispatchEvent(new Event('weightplay:interaction-state')); } catch { /* Optional measurement. */ }
    };
    const listen = (node, event, fn) => node.addEventListener(event, fn, {signal:abort.signal});
    const utility = document.createElement('div'); utility.className = 'wp-frame-utility'; utility.dataset.wpPreferences = '';
    utility.innerHTML = '<button type="button" class="wp-frame-settings wp-shell-settings-button" data-wp-settings aria-expanded="false"><span class="wp-frame-settings-icon" aria-hidden="true"></span></button><div class="wp-frame-popover wp-shell-settings-popover" role="dialog" hidden><label><span></span><select></select></label><div class="wp-shell-combined-sound-row"><span></span><button type="button" role="switch" class="wp-frame-sound"><span class="wp-frame-sound-icon" aria-hidden="true"></span><span class="wp-frame-sound-state"></span></button></div></div>';
    const button=utility.querySelector('button'), panel=utility.querySelector('.wp-frame-popover'), select=utility.querySelector('select');
    const languageText=panel.querySelector('label > span'), soundText=panel.querySelector('div > span'), sound=panel.querySelector('.wp-frame-sound'), soundState=sound.querySelector('.wp-frame-sound-state');
    panel.id=`wp-frame-${id}-settings`;button.setAttribute('aria-controls',panel.id);
    // The canonical locale normalizer identifies the shared select by stable ID.
    select.id=`wp-frame-${id}-locale`;
    utility.setAttribute('data-runtime-localize','off');
    for(const option of localeSelect?.options||[])select.add(option.cloneNode(true));
    panel.querySelector('label').hidden=!showLanguage||!localeSelect;
    const close=(focus=false)=>{const wasOpen=!panel.hidden;panel.hidden=true;button.setAttribute('aria-expanded','false');if(wasOpen)notifyInteraction();if(focus)button.focus({preventScroll:true});};
    const refresh=()=>{
      const locale=window.WonderI18n?.locale?.()||document.documentElement.lang;
      const labels=copy[locale]||copy.en;
      button.setAttribute('aria-label',labels[0]);panel.setAttribute('aria-label',labels[0]);
      languageText.textContent=labels[1];select.setAttribute('aria-label',labels[1]);select.value=localeSelect?.value||locale;
      const muted=Boolean(window.WeightPlayAudio?.isMuted?.());
      soundText.textContent=labels[2];soundState.textContent=muted?labels[4]:labels[3];sound.setAttribute('aria-label',`${labels[2]}：${muted?labels[4]:labels[3]}`);sound.setAttribute('aria-checked',String(!muted));
      sound.disabled=!window.WeightPlayAudio?.setMuted;
    };
    listen(button,'click',()=>{refresh();const open=panel.hidden;if(open)onOpen();panel.hidden=!open;button.setAttribute('aria-expanded',String(open));notifyInteraction();});
    listen(select,'change',()=>{localeSelect.value=select.value;localeSelect.dispatchEvent(new Event('change',{bubbles:true}));refresh();});
    listen(sound,'click',()=>{window.WeightPlayAudio?.setMuted?.(!window.WeightPlayAudio?.isMuted?.());refresh();});
    // Inside interactions belong to this component, not legacy game dismissal handlers.
    for(const event of ['pointerdown','click'])listen(panel,event,e=>e.stopPropagation());
    listen(document,'pointerdown',e=>{if(!utility.contains(e.target))close();});
    listen(document,'keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();e.stopPropagation();close(true);}});
    listen(window,'wonder:locale-change',refresh);listen(window,'weightplay:audio-volume-change',refresh);
    refresh();
    return {utility,button,panel,select,sound,close,refresh,destroy(){const wasOpen=!panel.hidden;abort.abort();utility.remove();if(wasOpen)notifyInteraction();}};
  }
  function mount({ root, scenes, localeSelect }) {
    if (mounts.has(root)) return mounts.get(root);
    if (!root || !scenes.main || !scenes.battle) throw new Error('FRAME_SCENES_REQUIRED');
    const abort = new AbortController();
    // Explicit frame consumers are Interface 7 routes even when their HTML
    // predates the bootstrap script. Set the shared marker at mount time so
    // guide and frame contract styles apply consistently.
    document.documentElement.dataset.wpSharedInterface = '7';
    const listen = (node, event, fn) => node.addEventListener(event, fn, { signal: abort.signal });
    const entries = {};
    let active = null, activeCovered = false;
    root.dataset.wpFrame = '2';
    for (const [name, scene] of Object.entries(scenes)) {
      const header = scene.header;
      const back = header.querySelector(`[data-wp-return="${name}"]`);
      if (!back || !scene.content || !scene.root.contains(scene.content)) throw new Error(`FRAME_SLOTS_REQUIRED:${name}`);
      header.className = 'wp-frame-header';
      header.dataset.wpFrameHeader = name;
      back.className = 'wp-frame-return';
      // Keep the permanent control and its navigation listener. Artwork is
      // created once; the shared skin owns the actual replaceable image.
      let arrow = back.querySelector('span');
      if (!arrow) { back.textContent = ''; arrow = document.createElement('span'); back.append(arrow); }
      arrow.className = 'wp-frame-back-icon'; arrow.setAttribute('aria-hidden','true');
      // Keep a literal arrow in the permanent span for semantic and validator
      // compatibility; the shared mask remains the visible artwork.
      arrow.textContent = '←';
      back.querySelectorAll('img').forEach(image => image.remove());
      if (name === 'main') {
        const logo = document.createElement('img');
        logo.className = 'wp-frame-lobby-logo';
        logo.src = lobbyLogoUrl; logo.alt = ''; logo.setAttribute('aria-hidden', 'true');
        back.append(logo);
      }
      scene.root.dataset.wpFrameScene = name;
      scene.content.dataset.wpFrameContent = name;
      if (name !== 'main') {
        // Legacy Canvas CSS has ID-specific !important layout. Values remain
        // owned by shared CSS tokens, never a per-game frame override.
        scene.root.style.setProperty('grid-template-rows', 'var(--wp-frame-rows)', 'important');
        scene.root.style.setProperty('grid-template-columns', 'minmax(0,1fr)', 'important');
      }
      const title = header.querySelector('[data-wp-frame-title]');
      if (!title) throw new Error(`FRAME_TITLE_REQUIRED:${name}`);
      title.hidden = name !== 'main';
      if (scene.headerInfo) {
        if (!['stage','battle'].includes(name) || !scene.content.contains(scene.headerInfo)) throw new Error('FRAME_BATTLE_INFO_SLOT_REQUIRED');
        if (!scene.headerInfo.children.length || scene.headerInfo.children.length>4) throw new Error('FRAME_BATTLE_INFO_REQUIRES_ONE_TO_FOUR_STATS');
        title.hidden = true;
        scene.headerInfo.setAttribute('data-wp-frame-info','');
        scene.headerInfo.style.setProperty('--wp-frame-stat-count',scene.headerInfo.children.length);
        scene.headerInfo.querySelectorAll(':scope > *').forEach(node => node.setAttribute('data-wp-frame-stat',''));
        header.append(scene.headerInfo);
      }
      const settings=createSettings({localeSelect,showLanguage:name==='main',id:name,onOpen:()=>Object.values(entries).forEach(entry=>entry.close())});
      header.append(settings.utility);
      entries[name] = { ...scene, ...settings };
    }
    function refresh() {
      for (const entry of Object.values(entries)) {
        if (entry.titleFromMain) entry.header.querySelector('[data-wp-frame-title]').textContent = scenes.main.header.querySelector('[data-wp-frame-title]').textContent;
        entry.refresh();
      }
    }
    // Defer until the game's synchronous scene visibility changes finish.
    // This publishes scene identity only, never a game_start or pause decision.
    let analyticsNoticeQueued = false;
    const notifyAnalytics = () => {
      if (analyticsNoticeQueued || abort.signal.aborted) return;
      analyticsNoticeQueued = true;
      queueMicrotask(() => {
        analyticsNoticeQueued = false;
        if (abort.signal.aborted || !active) return;
        try {
          const node = entries[active].root;
          const shown = node.isConnected && !node.hidden && node.getClientRects().length > 0
            && getComputedStyle(node).visibility !== 'hidden';
          window.dispatchEvent(new CustomEvent('weightplay:screen-change', {
            detail: { screen: shown ? active : null, node, owner: root },
          }));
        } catch { /* Measurement must not affect the frame. */ }
      });
    };
    listen(window, 'weightplay:analytics-ready', notifyAnalytics);
    const close = () => Object.values(entries).forEach(entry => entry.close());
    const syncRootLifecycle = (name) => {
      const main = name === 'main';
      const play = name === 'stage' || name === 'battle';
      document.body.classList.toggle('wp-frame-main-active', main);
      document.body.classList.toggle('wp-frame-stage-active', name === 'stage');
      document.body.classList.toggle('wp-frame-battle-active', name === 'battle');
      document.documentElement.classList.toggle('wp-frame-main-flow', main);
      document.documentElement.classList.toggle('wp-frame-active-play', play);
      if (play) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };
    const releaseRootLifecycle = () => {
      document.body.classList.remove('wp-frame-main-active','wp-frame-stage-active','wp-frame-battle-active');
      document.documentElement.classList.remove('wp-frame-main-flow','wp-frame-active-play');
    };
    // Some older game styles leave a full-viewport Main child under the
    // pointer. Chromium can then consume a wheel gesture without moving the
    // document even though html/body are scrollable. The current frame owns a
    // single Main fallback so every adopted route keeps desktop-wheel access.
    listen(window, 'wheel', (event) => {
      if (active !== 'main' || event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (event.target?.closest?.('.wp-frame-popover,select,textarea,[data-wp-scroll-owner]')) return;
      const startY = window.scrollY;
      const deltaY = event.deltaY;
      window.requestAnimationFrame(() => {
        if (active !== 'main' || Math.abs(window.scrollY - startY) > 2) return;
        window.scrollBy({ top: deltaY, left: 0, behavior: 'auto' });
      });
    });
    listen(window, 'wonder:locale-change', () => queueMicrotask(refresh));
    listen(window, 'weightplay:audio-volume-change', refresh);
    const api = Object.freeze({
      activate(name, { covered = false } = {}) {
        if (!entries[name]) throw new Error(`FRAME_UNKNOWN_SCENE:${name}`);
        if(active!==name||activeCovered!==covered)close();
        active = name; activeCovered=covered; root.dataset.wpFrameActive = name;
        syncRootLifecycle(name);
        for (const [key, entry] of Object.entries(entries)) {
          const enabled = key === name;
          entry.header.hidden = !enabled || covered;
          entry.header.inert = !enabled || covered;
          entry.root.inert = !enabled;
          entry.root.setAttribute('aria-hidden', String(!enabled));
        }
        refresh();
        notifyAnalytics();
      },
      close,
      refresh,
      get active() { return active; },
      destroy() {
        try { window.dispatchEvent(new CustomEvent('weightplay:screen-change', {detail:{owner:root,release:true}})); } catch { /* Optional analytics. */ }
        releaseRootLifecycle(); close(); abort.abort(); Object.values(entries).forEach(entry => entry.destroy()); mounts.delete(root);
      },
    });
    mounts.set(root, api); refresh(); return api;
  }
  // One-time DOM binding for existing declared slots. This is not a second
  // renderer/skin: every control, title, setting and activation uses mount().
  function mountSlots(options) {
    const {root, main, stage, battle} = options;
    if (slotMounts.has(root)) return slotMounts.get(root);
    root.setAttribute('data-wp-frame-root','');
    root.dataset.wpFrameAdapted = 'true';
    const oldMain = root.querySelector('[data-wp-shell-header="main"]');
    const mainTitle = oldMain.querySelector('[data-wp-game-title],h1');
    const localeSelect = root.querySelector('#localeSelect');
    const scenes = {};
    // The adapter accepts the legacy DOM shorthand used by older games and a
    // small descriptor for games that need the shared Battle information slot.
    // Keeping the normalization here means every game still renders through
    // the same mount() contract; no game-specific header skin is introduced.
    const normalizeScene = (value) => value && value.nodeType ? {root: value} : value;
    const sceneSpecs = {
      main: normalizeScene(main),
      stage: normalizeScene(stage),
      battle: normalizeScene(battle),
    };
    for (const [name, spec] of Object.entries(sceneSpecs)) {
      if (!spec?.root) continue;
      const screen = spec.root;
      const headerInfo = spec.headerInfo || null;
      headerInfo?.querySelectorAll(':scope > .hud-return-slot').forEach((node) => node.remove());
      const oldHeader = root.querySelector(`[data-wp-shell-header="${name}"]`);
      const back = root.querySelector(`[data-wp-return="${name}"]`);
      if (!back) throw Error(`FRAME_RETURN_REQUIRED:${name}`);
      const header = document.createElement('header');
      header.id = `wp-shared-${name}-header`;
      const title = name==='main' ? mainTitle : document.createElement('strong');
      title.setAttribute('data-wp-frame-title','');
      title.textContent = mainTitle.textContent;
      header.append(back,title);
      let content;
      if (name==='main') {
        content=document.createElement('div');
        content.append(...screen.childNodes);
        screen.append(content);
        const poster=content.querySelector('.cover'), copy=content.querySelector('.menu-copy');
        if(poster?.parentElement.classList.contains('poster-frame')) {const wrapper=poster.parentElement;wrapper.replaceWith(poster);}
        poster?.setAttribute('data-wp-frame-poster','');
        copy?.setAttribute('data-wp-frame-copy','');
        copy?.querySelector('[data-ui="menuHint"],.menu-hint')?.setAttribute('data-wp-frame-summary','');
        copy?.querySelector('.main-progress')?.setAttribute('data-wp-frame-progress','');
        copy?.querySelector('button')?.setAttribute('data-wp-frame-action','primary');
        const redundant=copy?.querySelector('[data-ui="menuTitle"],#menuTitle');
        if(redundant) redundant.style.setProperty('display','none','important');
        const retained=document.createElement('div');retained.hidden=true;
        retained.style.setProperty('display','none','important');
        if(localeSelect)retained.append(localeSelect);
        root.append(retained);
        oldHeader.remove();
      } else if(name==='stage') {
        content=screen.querySelector('[data-wp-shell-content="stage"],.stage-content,.stage-workspace');
        if(!content)throw Error('FRAME_STAGE_CONTENT_REQUIRED');
        // Keep game-owned progress/section labels in its content, not title lane.
        const context=document.createElement('div');
        context.className='wp-frame-stage-context';
        if(oldHeader) { context.append(...oldHeader.childNodes);oldHeader.remove(); }
        content.prepend(context);
        const nav=screen.querySelector('.stage-tabs');
        if(nav) {
          nav.setAttribute('data-wp-frame-nav','');
          nav.querySelectorAll(':scope > [aria-hidden="true"]').forEach(n=>n.remove());
          nav.querySelectorAll('button').forEach(n=>n.setAttribute('data-wp-frame-action','tab'));
          screen.append(nav);
        }
      } else {
        content=screen.querySelector('[data-wp-shell-content="battle"]');
        if(!content) {
          content=document.createElement('div');content.className='wp-frame-play-content';
          [...screen.children].filter(n=>!n.matches('[role="dialog"],.modal-panel,.result-panel,.pause-panel')).forEach(n=>content.append(n));
          screen.prepend(content);
        }
        content.querySelectorAll('.hud-return-slot').forEach(n=>n.remove());
      }
      if (headerInfo && !content.contains(headerInfo)) throw Error('FRAME_BATTLE_INFO_SLOT_REQUIRED');
      screen.prepend(header);
      scenes[name]={root:screen,header,content,headerInfo,titleFromMain:name!=='main'};
      // The legacy slot is only a source wrapper. Once its permanent return
      // button and optional info group have been moved into the generated
      // header, remove the empty wrapper so it cannot reserve a second HUD
      // row or intercept events over the play surface.
      if (oldHeader && oldHeader !== headerInfo && !oldHeader.children.length) oldHeader.remove();
    }
    const frame=mount({root,scenes,localeSelect});
    const visible=node=>node&&!node.hidden&&!node.classList.contains('is-hidden')&&getComputedStyle(node).display!=='none';
    const activate=target=>{
      const name=typeof target==='string'?target:Object.keys(scenes).find(k=>scenes[k].root===target);
      const resolved=scenes[name]?name:visible(scenes.battle.root)?'battle':'main';
      frame.activate(resolved,{covered:!name&&resolved==='battle'});
    };
    const sync=()=>{const name=Object.keys(scenes).find(k=>visible(scenes[k].root));if(name)activate(name);};
    sync();
    const api=Object.freeze({activate,sync,refresh:frame.refresh,destroy(){frame.destroy();slotMounts.delete(root);},get active(){return frame.active;}});
    slotMounts.set(root,api);return api;
  }
  // Auto-discovery feeds older game-owned scene DOM into this same Interface 7 runtime.
  // It is an input normalizer, not another frame/controller or separately loaded version.
  function autoMountDocument() {
  // Declared slots already use mount(); auto-discovery is only for older game-owned DOM.
  if (document.querySelector('[data-wp-frame-root],[data-wp-game-shell-root]')) return;
  if (window.__weightPlayFrameAutoMountRequested) return;
  window.__weightPlayFrameAutoMountRequested = true;

  const sharedAssetBase = new URL(".", frameScriptUrl);
  const immutableSceneControls =
    document.querySelector('meta[name="weightplay-audience"]')?.content?.toLowerCase() === "kids"
    || document.querySelector('meta[name="weightplay-scene-controls"]')?.content?.toLowerCase() === "immutable";
  const ownedSettingsButton = document.querySelector("#audioMenuBtn[aria-controls='audioPopover']");
  const ownedSettingsGroup = ownedSettingsButton?.closest(".settings-control");
  if (ownedSettingsButton && ownedSettingsGroup?.querySelector("#audioPopover #localeSelect")) {
    ownedSettingsButton.dataset.wpSettings = "true";
    ownedSettingsGroup.dataset.wpSettingsControl = "true";
    ownedSettingsGroup.classList.add("wp-shell-legacy-control");
  }
  if (document.documentElement.dataset.wpFrameAutoMounted === "true") return;
  document.documentElement.dataset.wpFrameAutoMounted = "true";
  window.__weightPlayFrameAutoMounted = true;
  window.__weightPlayFrameAutoOrigin = document.querySelector("base")?.getAttribute("href") || "no-base";

  const COPY = {
    en: ["Settings", "Language", "Music", "Sound Effects"],
    "zh-Hant": ["設定", "語言", "音樂", "音效"],
    "zh-Hans": ["设置", "语言", "音乐", "音效"],
    ja: ["設定", "言語", "音楽", "効果音"],
    ko: ["설정", "언어", "음악", "효과음"],
    es: ["Configuración", "Idioma", "Música", "Efectos de sonido"],
    "pt-BR": ["Configurações", "Idioma", "Música", "Efeitos sonoros"],
    fr: ["Paramètres", "Langue", "Musique", "Effets sonores"],
    de: ["Einstellungen", "Sprache", "Musik", "Soundeffekte"],
    it: ["Impostazioni", "Lingua", "Musica", "Effetti sonori"],
    ru: ["Настройки", "Язык", "Музыка", "Звуковые эффекты"],
    hi: ["सेटिंग्स", "भाषा", "संगीत", "ध्वनि प्रभाव"],
    ar: ["الإعدادات", "اللغة", "الموسيقى", "المؤثرات الصوتية"],
  };

  const SOUND_COPY = {
    en: "Sound",
    "zh-Hant": "\u8072\u97f3",
    "zh-Hans": "\u58f0\u97f3",
    ja: "\u30b5\u30a6\u30f3\u30c9",
    ko: "\uc18c\ub9ac",
    es: "sonido",
    "pt-BR": "Som",
    fr: "Son",
    de: "Ton",
    it: "Suono",
    ru: "\u0417\u0432\u0443\u043a",
    hi: "\u0927\u094d\u0935\u0928\u093f",
    ar: "\u0627\u0644\u0635\u0648\u062a",
  };

  const MAIN_SELECTORS = [
    "#main", "#mainScreen", "[data-screen='main']", ".main-screen",
    ".main-canvas", "main.main",
  ];
  const STAGE_SELECTORS = [
    "#stage", "#stageScreen", "[data-screen='stage']", ".stage-screen",
    ".stage-panel", "[data-wp-standard-stage-screen]",
  ];
  const BATTLE_SELECTORS = [
    "[data-wp-logical-battle-canvas]", "#battle", "#battleScreen", "#battleView",
    "#battleShell", "#battlePage", "#gamePanel", "#playPanel", "#mainPanel",
    ".quiz-playing .animal-game",
    ".dash-playing .dash-game",
    "[data-screen='battle']", ".battle-screen", ".battle-shell", ".battle-page",
  ];
  const RESULT_SELECTORS = [
    "#resultScreen", "#resultPanel", "[data-wp-result-screen]",
    "[data-screen='result']", ".result-screen",
  ];
  const HEADER_SELECTORS = [
    ".main-header", ".topbar", ".stage-header", ".stage-panel-head", ".stage-shell-head",
    ".stage-screen-head", ".guardian-topbar", ".card-game-topbar", "header",
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
    ".wp-standard-main-summary", ".main-summary", ".summary-strip", ".main-description", ".summary", ".tagline",
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

  function sceneCandidates(selectors) {
    const seen = new Set();
    const candidates = [];
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        if (node === document.body || node === document.documentElement || seen.has(node)) return;
        seen.add(node);
        candidates.push(node);
      });
    });
    return candidates;
  }

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

  const stageV6Targets = new Set([
    "block-blast", "animal-2048", "animal-block-grove", "animal-bubble-safari", "animal-cafe-rush",
    "animal-coloring-studio", "animal-color-link", "animal-color-springs", "animal-cratebound",
    "animal-habitat-mahjong", "animal-hero-trials", "animal-hidden-safari", "animal-parking-patrol",
    "animal-quiz", "animal-rescue", "animal-rope-rescue", "animal-screw-workshop",
    "animal-skybridge-rivals", "animal-spectrum-pulse", "animal-tangram", "animal-unblock",
    "animal-word-trails", "bubble-bakery", "campus-dash", "color-lunchbox", "fruit-merge",
    "garden-tiles", "shape-train", "snack-blocks", "star-memory", "tiny-weather-rescue", "zoo-helper-day",
  ]);

  function ensureStageV6Runtime() {
    const gameId = document.body?.dataset.wpGameId || location.pathname.match(/\/games\/([^/]+)/)?.[1] || "";
    if (!stageV6Targets.has(gameId)) return;
    const rail = STAGE_RAIL_SELECTORS.map((selector) => document.querySelector(selector)).find(Boolean);
    if (!rail) return;
    rail.dataset.wpStageV6Auto = "true";
    if (rail.dataset.wpStageV6Total === undefined) {
      const declaredTotal = rail.querySelectorAll(STAGE_CARD_SELECTORS.join(",")).length;
      if (declaredTotal > 1) rail.dataset.wpStageV6Total = String(declaredTotal);
    }
    if (document.querySelector('script[src*="stage-virtualization-standard.js"]')) return;
    const script = document.createElement("script");
    script.src = `${new URL("stage-virtualization-standard.js", sharedAssetBase).href}?v=20260809-stage-v6-source-demotion-v8`;
    script.dataset.wpStageVirtualizationStandard = "true";
    document.body.append(script);
  }

  function ensureBattleCanvasRuntime() {
    if (document.body?.dataset.wpBattleLayout === "native") return;
    if (!document.querySelector('link[href*="battle-canvas-standard.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = new URL("battle-canvas-standard.css", sharedAssetBase).href;
      link.dataset.wpBattleStandard = "true";
      document.head.append(link);
    }
    if (!document.querySelector('script[src*="battle-canvas-standard.js"]')) {
      const script = document.createElement("script");
      script.src = `${new URL("battle-canvas-standard.js", sharedAssetBase).href}?v=20260911-folded-field-battle-envelope-v1`;
      script.dataset.wpBattleStandard = "true";
      document.body.append(script);
    }
  }

  function ensureGameInfoRuntime() {
    if (document.body?.hasAttribute("data-wp-game-owned-guide")) return;
    if (!document.querySelector('link[href*="game-page-info.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = new URL("game-page-info.css", sharedAssetBase).href;
      document.head.append(link);
    }
    if (!document.querySelector('script[src*="game-page-info.js"]')) {
      const script = document.createElement("script");
      const gameId = document.body?.dataset.wpGameId || location.pathname.match(/\/games\/([^/]+)/)?.[1] || "";
      const gameInfoCacheTag = gameId === "maze-chase"
        ? "20260826-maze-guide-v15"
        : gameId === "cribbage" ? "20260827-cribbage-arabic-opening-v1"
        : gameId === "old-maid" ? "20260829-old-maid-arabic-guide-v17"
          : gameId === "animal-trap-trail" ? "20260829-animal-trap-trail-faq-timing-v6"
          : gameId === "animal-canopy-cut" ? "20260907-canopy-v13-campaign-depth"
          : gameId === "animal-footprint-folio" ? "20260913-footprint-folio-interface7-guide-v1"
          : gameId === "casino" ? "20260901-casino-locale-v18d"
          : gameId === "freecell-solitaire" ? "20260905-freecell-es-guide-v30"
          : "20260817-bus-jam-guide-v12";
      script.src = `${new URL("game-page-info.js", sharedAssetBase).href}?v=${gameInfoCacheTag}`;
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
  let combinedSoundRow;
  let combinedSoundToggle;
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

  let activePlayRootLocked = false;
  function syncActivePlayRootLock() {
    const main = document.body?.classList.contains("wp-shell-main-active") || false;
    const active = document.body?.matches(".wp-shell-stage-active,.wp-shell-battle-active") || false;
    document.documentElement.classList.toggle("wp-shell-main-flow", main && !active);
    document.documentElement.classList.toggle("wp-shell-active-play", active);
    if (active) {
      document.documentElement.style.setProperty("touch-action", "none", "important");
      document.body?.style.setProperty("touch-action", "none", "important");
    } else {
      document.documentElement.style.removeProperty("touch-action");
      document.body?.style.removeProperty("touch-action");
    }
    if (active && !activePlayRootLocked) {
      activePlayRootLocked = true;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ left: 0, top: 0, behavior: "instant" });
      requestAnimationFrame(() => {
        if (!document.body?.matches(".wp-shell-stage-active,.wp-shell-battle-active")) return;
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo({ left: 0, top: 0, behavior: "instant" });
      });
    } else if (!active) {
      activePlayRootLocked = false;
    }
  }

  /* CSS overscroll containment is the first line of defence, but some mobile
     browsers still hand a downward gesture at document scrollTop 0 to their
     native pull-to-refresh UI. Keep Main's guide scrollable and cancel only
     that impossible downward move at the top edge. Stage/Battle already own
     the stronger full root lock above. */
  let mainTouchStart = null;
  function resetMainTouch() {
    mainTouchStart = null;
  }
  function beginMainTouch(event) {
    if (!document.body?.classList.contains("wp-shell-main-active") || event.touches.length !== 1) {
      resetMainTouch();
      return;
    }
    if (event.target?.closest?.("input,select,textarea,[contenteditable='true']")) {
      resetMainTouch();
      return;
    }
    const touch = event.touches[0];
    mainTouchStart = { x: touch.clientX, y: touch.clientY };
  }
  function guardMainPullToRefresh(event) {
    if (!mainTouchStart || !document.body?.classList.contains("wp-shell-main-active") || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - mainTouchStart.x;
    const deltaY = touch.clientY - mainTouchStart.y;
    if (deltaY <= 4 || deltaY <= Math.abs(deltaX)) return;
    const scrollTop = Math.max(
      0,
      window.scrollY || 0,
      document.documentElement.scrollTop || 0,
      document.body.scrollTop || 0,
    );
    if (scrollTop <= 1 && event.cancelable) event.preventDefault();
  }
  window.addEventListener("touchstart", beginMainTouch, { passive: false, capture: true });
  window.addEventListener("touchmove", guardMainPullToRefresh, { passive: false, capture: true });
  window.addEventListener("touchend", resetMainTouch, { passive: true, capture: true });
  window.addEventListener("touchcancel", resetMainTouch, { passive: true, capture: true });

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

  let officialTitleRegistryPromise;
  function ensureOfficialTitleRegistry() {
    if (window.WEIGHTPLAY_GAME_TITLES) return Promise.resolve(window.WEIGHTPLAY_GAME_TITLES);
    if (officialTitleRegistryPromise) return officialTitleRegistryPromise;
    officialTitleRegistryPromise = new Promise((resolve) => {
      const existing = document.querySelector('script[data-wp-game-title-registry]');
      const script = existing || document.createElement("script");
      const finish = () => resolve(window.WEIGHTPLAY_GAME_TITLES || {});
      if (!existing) {
        script.src = new URL("game-title-registry.js", sharedAssetBase).href;
        script.dataset.wpGameTitleRegistry = "true";
        document.head.append(script);
      }
      if (window.WEIGHTPLAY_GAME_TITLES) finish();
      else {
        script.addEventListener("load", finish, { once: true });
        script.addEventListener("error", finish, { once: true });
      }
    });
    return officialTitleRegistryPromise;
  }

  function officialGameTitle() {
    if (window.WeightPlayOfficialName) return window.WeightPlayOfficialName.title();
    const gameId = document.body?.dataset.wpGameId;
    // Spades owns its localized title through card-games-next.js. Do not let
    // the shared official-title registry race that owner during shell-sync;
    // the competing writes can keep the localized route in a mutation loop.
    if (gameId === "spades" && document.body?.hasAttribute("data-wp-game-owned-guide")) return "";
    return gameId
      ? window.WEIGHTPLAY_GAME_TITLES?.[gameId]?.[localeCode()]
      : "";
  }

  function applyOfficialGameTitle() {
    if (document.body?.dataset.wpFiveGame && window.WeightPlayFiveGameLocale) return;
    const localizedTitle = officialGameTitle();
    if (!localizedTitle) return;
    if (document.documentElement.hasAttribute('data-wp-official-name')) {
      const pageTitle = `${localizedTitle} | WeightPlay`;
      if (document.title !== pageTitle) document.title = pageTitle;
    }
    document.querySelectorAll(OFFICIAL_TITLE_SELECTORS).forEach((node) => {
      node.dataset.runtimeLocalize = "off";
      if (node.textContent?.trim() !== localizedTitle) node.textContent = localizedTitle;
    });
  }

  const OFFICIAL_TITLE_SELECTORS = [
      '[data-t="title"]',
      '[data-ui="title"]',
      '[data-copy="title"]',
      "[data-wp-game-title]",
      ".wp-generated-main-title",
      ".wp-shell-main-title",
    ].join(",");

  function updateCopy() {
    const copy = COPY[localeCode()] || COPY.en;
    title.textContent = copy[0];
    button.setAttribute("aria-label", copy[0]);
    popover.setAttribute("aria-label", copy[0]);
    languageRow.querySelector("span").textContent = copy[1];
    const combinedSoundCopy = SOUND_COPY[localeCode()] || SOUND_COPY.en;
    combinedSoundRow.querySelector("span").textContent = combinedSoundCopy;
    combinedSoundToggle.setAttribute("aria-label", combinedSoundCopy);
  }

  function build() {
    window.__weightPlayFrameAutoPhase = "build";
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

    combinedSoundRow = document.createElement("div");
    combinedSoundRow.className = "wp-shell-settings-row wp-shell-combined-sound-row";
    combinedSoundRow.dataset.runtimeLocalize = "off";
    combinedSoundRow.innerHTML = "<span></span>";
    combinedSoundToggle = document.createElement("button");
    combinedSoundToggle.type = "button";
    combinedSoundToggle.className = "wp-shell-combined-sound-toggle";
    combinedSoundToggle.setAttribute("role", "switch");
    combinedSoundRow.append(combinedSoundToggle);

    popover.append(title, languageRow, combinedSoundRow);
    host.append(button, popover);

    const syncCombinedSound = () => {
      const enabled = !Boolean(window.WeightPlayAudio?.isMuted?.());
      combinedSoundToggle.setAttribute("aria-checked", String(enabled));
      combinedSoundToggle.dataset.state = enabled ? "on" : "off";
    };
    combinedSoundToggle.addEventListener("click", () => {
      window.WeightPlayAudio?.setMuted?.(!Boolean(window.WeightPlayAudio?.isMuted?.()));
      syncCombinedSound();
    });
    combinedSoundToggle.addEventListener("keydown", (event) => {
      if (event.key !== " " && event.key !== "Enter") return;
      // Some game-owned document key handlers consume Space before the
      // browser synthesizes a button click. Keep the shared switch keyboard
      // equivalent to its pointer activation and prevent a second native
      // click from toggling it twice.
      event.preventDefault();
      event.stopPropagation();
      window.WeightPlayAudio?.setMuted?.(!Boolean(window.WeightPlayAudio?.isMuted?.()));
      syncCombinedSound();
    });
    window.addEventListener("weightplay:audio-volume-change", syncCombinedSound);

    button.addEventListener("click", () => setOpen(popover.hidden));
    document.addEventListener("pointerdown", (event) => {
      if (!popover.hidden && !host.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !popover.hidden) setOpen(false, true);
    });
    window.addEventListener("wonder:locale-change", updateCopy);
    updateCopy();
    syncCombinedSound();
  }

  function setOpen(open, restoreFocus) {
    if (open) {
      const bounds = host.getBoundingClientRect();
      host.dataset.wpPopoverEdge = bounds.left + bounds.width / 2 < window.innerWidth / 2
        ? "left"
        : "right";
    }
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
    // The shared Settings owner replaces legacy game-owned launch buttons.
    // Retire those buttons completely so callers that resolve the first
    // matching selector cannot activate an emptied legacy popover after its
    // language control has moved into the shared panel.
    document.querySelectorAll("button.wp-shell-settings-button,button[data-wp-settings]").forEach((candidate) => {
      if (candidate === button || host.contains(candidate) || candidate.hasAttribute("data-wp-battle-utility")) return;
      candidate.classList.remove("wp-shell-settings-button");
      candidate.classList.add("wp-shell-legacy-control");
      candidate.removeAttribute("data-wp-settings");
      candidate.hidden = true;
      candidate.setAttribute("aria-hidden", "true");
      candidate.tabIndex = -1;
    });

    if (!localeOwner || !localeOwner.isConnected) localeOwner = findLocaleOwner();
    if (localeOwner && !languageRow.contains(localeOwner)) {
      localeOwner.classList.remove("wp-shell-legacy-control");
      languageRow.append(localeOwner);
    }

    const candidate = document.querySelector("button[data-sound-toggle]:not([data-wp-battle-utility])");
    if (candidate && candidate !== soundToggle) soundToggle = candidate;
    if (soundToggle) {
      soundToggle.classList.add("wp-shell-legacy-control");
      soundToggle.hidden = true;
      soundToggle.setAttribute("aria-hidden", "true");
      soundToggle.tabIndex = -1;
    }

    languageRow.hidden = !localeOwner;
  }

  function activeScreen() {
    if (immutableSceneControls) {
      const declaredType = document.body.dataset.screen;
      if (["main", "stage", "battle"].includes(declaredType)) {
        const declaredScreen = [...document.querySelectorAll(`[data-screen='${declaredType}']`)]
          .find((node) => node !== document.body && node !== document.documentElement && visible(node));
        if (declaredScreen) return { type: declaredType, screen: declaredScreen };
      }
    }
    const stages = sceneCandidates(STAGE_SELECTORS);
    const activeRail = STAGE_RAIL_SELECTORS
      .map((selector) => document.querySelector(selector))
      .find(visible);
    const stageRouteActive = document.body.matches(
      ".wp-stage-select-active,.wp-standard-stage-page",
    );
    /* A management tab may intentionally hide the Stage rail while keeping
       the same logical Stage Canvas active. Do not fall back to Main merely
       because Stages/Levels is not the selected tab; doing so removes the
       Stage scale/header and makes every sibling workspace overflow. */
    const explicitStageCanvas = [...document.querySelectorAll(
      "[data-wp-logical-stage-canvas],[data-wp-standard-stage-screen]",
    )].find(visible);
    /* An explicit logical Stage Canvas owns the full shell. Prefer it over a
       nearer rail wrapper marked by the selector runtime; otherwise generated
       navigation can be inserted inside a scrolling/animated content panel. */
    const inferredStage = activeRail?.closest("[data-wp-logical-stage-canvas]")
      || activeRail?.closest(
        "[data-wp-standard-stage-screen],.stage-screen,.stage-panel",
      )
      || activeRail?.parentElement;
    const stage = stages.find(visible)
      || (stageRouteActive && inferredStage)
      || explicitStageCanvas;
    if (stage) return { type: "stage", screen: stage };
    const mains = sceneCandidates(MAIN_SELECTORS);
    const visibleStart = firstVisible(MAIN_START_SELECTORS, document);
    const visiblePoster = firstVisible(MAIN_POSTER_SELECTORS, document);
    let inferredMain = null;
    if (visibleStart && visiblePoster) {
      const ancestors = new Set();
      for (let node = visiblePoster; node; node = node.parentElement) ancestors.add(node);
      for (let node = visibleStart; node; node = node.parentElement) {
        if (ancestors.has(node)) {
          inferredMain = node;
          break;
        }
      }
      inferredMain = inferredMain?.closest(".wp-standard-main-screen") || inferredMain;
    }
    // A hidden Main screen can still contain visible descendants such as the
    // poster and start button. Never let that stale inferred owner win over a
    // visible Battle/Stage screen during a scene transition.
    let main = mains.find(visible) || (inferredMain && visible(inferredMain) ? inferredMain : null);
    if (immutableSceneControls && visibleStart && visiblePoster) {
      const mainReturn = firstVisible(['[data-wp-return="main"]'], document);
      const sceneOwner = mainReturn?.closest(
        "[data-screen='main'],.main-screen,.main-canvas,main",
      );
      if (
        sceneOwner
        && visible(sceneOwner)
        && sceneOwner.contains(visibleStart)
        && sceneOwner.contains(visiblePoster)
      ) {
        main = sceneOwner;
      }
    }
    if (!main && document.body.matches(".wp-shell-stage-active,.wp-shell-battle-active")) {
      const standardScreen = document.querySelector(".wp-standard-main-screen");
      const composition = standardScreen?.querySelector(".wp-standard-main-composition");
      let nativelyAvailable = Boolean(standardScreen && composition);
      for (
        let node = standardScreen;
        nativelyAvailable && node && node !== document.body;
        node = node.parentElement
      ) {
        const style = getComputedStyle(node);
        if (node.hidden || style.visibility === "hidden" || style.display === "none") {
          nativelyAvailable = false;
        }
      }
      if (nativelyAvailable) main = standardScreen;
    }
    const battles = sceneCandidates(BATTLE_SELECTORS);
    const battle = battles.find(visible);
    const result = RESULT_SELECTORS
      .map((selector) => document.querySelector(selector))
      .find(visible);
    const battleStateHint = document.body.matches(
      ".playing,.is-playing,.is-game-playing,.game-playing,[class*='-playing']",
    );
    if (battle && (!main || battleStateHint)) return { type: "battle", screen: battle };
    if (result) {
      // Result is a Battle-owned substate, even when a legacy route mounts it
      // beside (rather than inside) its hidden Battle root. Keep the shared
      // shell in the Battle envelope instead of falling back to Main.
      const battleRootSelector =
        "#battle,#battleScreen,#battleView,#battleShell,#battlePage,[data-screen='battle'],.battle-screen,.battle-shell,.battle-page";
      const closestOwner = result.closest(battleRootSelector);
      const owner = closestOwner
        && closestOwner !== document.body
        && closestOwner !== document.documentElement
        ? closestOwner
        : null;
      const fallbackOwner = [...document.querySelectorAll(battleRootSelector)].find(
        (candidate) => candidate !== result
          && candidate !== document.body
          && candidate !== document.documentElement,
      );
      const battleOwner = owner || fallbackOwner
        || result;
      return { type: "battle", screen: battleOwner };
    }
    if (main) return { type: "main", screen: main };
    if (battle) return { type: "battle", screen: battle };
    return { type: "main", screen: mains[0] || document.body };
  }

  function normalizeReturn(header) {
    const control = first(RETURN_SELECTORS, header);
    if (!control) return;
    if (immutableSceneControls && !["main", "stage", "battle"].includes(control.dataset.wpReturn)) return;
    if (immutableSceneControls && control.dataset.wpReturnNormalized === "true") return;
    control.classList.add("wp-shell-return");
    if (!immutableSceneControls && !control.dataset.wpReturn) {
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
    const ownsLobbyLogo = control.dataset.wpReturn === "main";
    if (!ownsLobbyLogo) {
      control.querySelectorAll(":scope > img").forEach((image) => image.remove());
    } else if (!control.querySelector(":scope > img")) {
      const logo = document.createElement("img");
      logo.src = "../../assets/weightplay-logo.png";
      logo.alt = "";
      control.append(logo);
    }
    if (immutableSceneControls) control.dataset.wpReturnNormalized = "true";
  }

  function normalizeBattleReturns() {
    document.querySelectorAll(
      "#battle,#battleScreen,#battleView,[data-screen='battle'],.battle-screen",
    ).forEach((screen) => {
      // body[data-screen] is the global scene-state owner, not the Battle
      // scene itself. Treating it as Battle makes the first header in the
      // document (usually Main) lose its WeightPlay return identity.
      if (screen === document.body || screen === document.documentElement) return;
      const header = first(HEADER_SELECTORS, screen);
      if (!header) return;
      const control = first(RETURN_SELECTORS, header);
      if (control && !immutableSceneControls) control.dataset.wpReturn = "battle";
      normalizeReturn(header);
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

  const mainFlowObservers = new WeakMap();

  function syncMainFlowHeight(owner, composition) {
    if (!owner || !composition) return;
    const update = () => {
      if (!owner.isConnected || !composition.isConnected) return;
      if (immutableSceneControls && !visible(composition)) return;
      const ownerRect = owner.getBoundingClientRect();
      const compositionRect = composition.getBoundingClientRect();
      const requiredHeight = Math.max(
        0,
        Math.ceil(compositionRect.bottom - ownerRect.top + 8),
      );
      owner.style.setProperty("--wp-main-flow-min-height", `${requiredHeight}px`);
    };
    update();
    if (immutableSceneControls) return;
    requestAnimationFrame(update);
    if (mainFlowObservers.has(owner) || typeof ResizeObserver !== "function") return;
    const observer = new ResizeObserver(update);
    observer.observe(composition);
    mainFlowObservers.set(owner, observer);
  }

  function restoreMainFlowLayout(standardScreen, composition) {
    if (!standardScreen || !composition) return;
    const owner = standardScreen.closest("main") || standardScreen;
    owner.classList.add("wp-standard-main-flow-owner");
    for (
      let node = composition.parentElement;
      node && node !== owner;
      node = node.parentElement
    ) {
      node.classList.add("wp-standard-main-flow-node");
    }
    syncMainFlowHeight(owner, composition);
  }

  // Market-five pages intentionally own a compact Main composition instead
  // of the standard poster/copy wrapper. Keep their player-facing structure
  // intact while exposing the shared semantic hooks used by shell and QA.
  function normalizeMarketFiveSemantics() {
    const main = document.querySelector(".m5-main[data-screen='main']");
    if (!main) return;
    const cover = main.querySelector(".m5-cover");
    const summary = main.querySelector(".m5-lede");
    const progress = main.querySelector("#main-progress,.m5-progress");
    const start = main.querySelector("#start-game");
    const guide = main.querySelector(".m5-guide");
    cover?.classList.add("main-cover");
    summary?.classList.add("main-summary");
    progress?.classList.add("main-progress");
    progress?.setAttribute("data-wp-main-progress", "");
    start?.setAttribute("data-wp-main-start", "");
    guide?.setAttribute("data-wp-game-guide", "");
    if (guide) document.body.dataset.wpGameOwnedGuide = "true";
  }

  function normalizeMainLayout(screen) {
    if (!screen) return;
    if (screen.matches?.(".m5-main")) return;
    let start = firstVisible(MAIN_START_SELECTORS, screen);
    let poster = firstVisible(MAIN_POSTER_SELECTORS, screen);
    const existingStandardScreen = start?.closest(".wp-standard-main-screen");
    if (existingStandardScreen?.contains(poster)) {
      const existingSummary = first(MAIN_SUMMARY_SELECTORS, existingStandardScreen);
      if (existingSummary) existingSummary.textContent = conciseCopy(existingSummary.textContent);
      ensureMainProgress(existingStandardScreen);
      const existingComposition = existingStandardScreen.querySelector(".wp-standard-main-composition");
      restoreMainFlowLayout(existingStandardScreen, existingComposition);
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
    const flowOwner = screen.closest("main") || screen;
    flowOwner.classList.add("wp-standard-main-flow-owner");

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
    for (
      let node = composition.parentElement;
      node && node !== flowOwner;
      node = node.parentElement
    ) {
      node.classList.add("wp-standard-main-flow-node");
    }

    originalBranches.forEach((branch) => {
      const movedDirectly = branch === posterNode || branch === start || branch === summary || branch === progress;
      if (!movedDirectly && branch !== header && branch !== guide && branch !== composition && !branch.contains(composition)) {
        branch.classList.add("wp-main-legacy-layout");
      }
    });
    const layoutRoot = composition.parentElement || screen;
    if (!immutableSceneControls) {
      [...layoutRoot.children].forEach((child) => {
        if (
          child !== header
          && child !== composition
          && child !== guide
          && !child.contains(composition)
          && !child.matches(
            "[data-screen='stage'],[data-screen='battle'],[data-wp-scene-part]",
          )
          && !child.querySelector(
            "[data-wp-return='stage'],[data-wp-return='battle'],[data-screen='stage'],[data-screen='battle'],[data-wp-scene-part]",
          )
          && !["SCRIPT", "STYLE", "TEMPLATE"].includes(child.tagName)
        ) {
          child.classList.add("wp-main-legacy-layout");
        }
      });
    }
    screen.classList.add("wp-standard-main-screen");
    ensureMainProgress(screen);
    syncMainFlowHeight(flowOwner, composition);
  }

  function ensureMainProgress(screen) {
    const copy = screen?.querySelector(".wp-standard-main-copy");
    const start = copy && first(MAIN_START_SELECTORS, copy);
    if (!copy || !start) return;
    const existingProgress = first(MAIN_PROGRESS_SELECTORS, copy);
    if (existingProgress && existingProgress.dataset.wpMainProgress !== "generated") return;
    const cards = STAGE_CARD_SELECTORS.flatMap((selector) => [...document.querySelectorAll(selector)])
      .filter((card, index, all) => all.indexOf(card) === index);
    const stageRails = STAGE_RAIL_SELECTORS.flatMap((selector) => [...document.querySelectorAll(selector)])
      .filter((rail, index, all) => all.indexOf(rail) === index);
    const ownsStage = stageRails.length > 0;
    if (cards.length < 2 && !ownsStage) return;
    const declaredStageTotal = stageRails
      .map((rail) => Number(rail.dataset.wpStageTotal))
      .find((value) => Number.isInteger(value) && value > 0);
    const total = declaredStageTotal ?? (cards.length >= 2 ? cards.length : 30);
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

  function removeGeneratedMainHeader(header, returnDestination) {
    if (!header) return;
    const returnControl = first(['[data-wp-return="main"]'], header);
    if (returnControl && returnDestination && !returnDestination.contains(returnControl)) {
      returnControl.hidden = false;
      returnControl.classList.remove("hidden", "is-hidden", "wp-shell-legacy-control");
      returnControl.removeAttribute("aria-hidden");
      returnDestination.prepend(returnControl);
    }
    header.remove();
  }

  function place() {
    applyOfficialGameTitle();
    adoptControls();
    normalizeBattleReturns();
    const { type, screen } = activeScreen();
    const hideLanguage = type !== "main" || !localeOwner;
    languageRow.hidden = hideLanguage;
    if (hideLanguage) languageRow.style.setProperty("display", "none", "important");
    else languageRow.style.removeProperty("display");
    const visibleResult = RESULT_SELECTORS
      .map((selector) => document.querySelector(selector))
      .find(visible);
    if (type !== "battle") {
      document.querySelectorAll(".wp-generated-battle-header").forEach((battleHeader) => {
        battleHeader.hidden = true;
      });
    }
    if (type !== "stage") {
      document.querySelectorAll(".wp-generated-stage-header").forEach((stageHeader) => {
        stageHeader.hidden = true;
      });
    } else {
      const stageHeader = document.querySelector('[data-wp-return="stage"]')
        ?.closest(".wp-generated-stage-header");
      if (stageHeader) stageHeader.hidden = false;
    }
    document.body.classList.toggle("wp-shell-main-active", type === "main");
    document.body.classList.toggle("wp-shell-stage-active", type === "stage");
    document.body.classList.toggle("wp-shell-battle-active", type === "battle");
    syncActivePlayRootLock();
    document.querySelectorAll(".wp-standard-main-flow-owner").forEach((owner) => {
      if (type !== "main" || (!owner.contains(screen) && !screen?.contains(owner))) {
        owner.style.removeProperty("--wp-main-flow-min-height");
        mainFlowObservers.get(owner)?.disconnect();
        mainFlowObservers.delete(owner);
        if (immutableSceneControls) return;
        owner.classList.remove("wp-standard-main-flow-owner");
        owner.querySelectorAll(".wp-standard-main-flow-node").forEach((node) => {
          node.classList.remove("wp-standard-main-flow-node");
        });
      }
    });
    if (type === "main") {
      if (immutableSceneControls) {
        const permanentMainReturn = firstVisible(
          ['[data-wp-return="main"]'],
          document,
        );
        const permanentMainHeader = permanentMainReturn?.closest(
          "header,.topbar,.main-header",
        );
        if (permanentMainHeader) {
          screen?.querySelectorAll(".wp-generated-main-header").forEach(
            (generatedHeader) => removeGeneratedMainHeader(
              generatedHeader,
              permanentMainHeader,
            ),
          );
        }
      }
      screen?.querySelectorAll(".wp-standard-main-composition .wp-generated-main-header").forEach((nestedHeader) => {
        removeGeneratedMainHeader(nestedHeader, screen);
      });
      [...(screen?.children || [])].forEach((child) => {
        if (!child.classList?.contains("wp-generated-main-header")) return;
        child.hidden = false;
        child.classList.remove("wp-shell-legacy-control");
      });
      normalizeMainLayout(screen);
    }
    let header = firstVisible(HEADER_SELECTORS, screen);
    if (immutableSceneControls) {
      const permanentReturn = firstVisible([`[data-wp-return="${type}"]`], document);
      const permanentHeader = permanentReturn?.closest(
        "header,.stage-shell-head,.hud,.hud-row,.battle-header,.topbar",
      ) || permanentReturn?.parentElement;
      if (permanentHeader) header = permanentHeader;
    }
    if (!header && type === "battle") {
      header = [...screen.querySelectorAll(".wp-generated-battle-header")]
        .find((candidate) => candidate.parentElement === screen) || null;
    }
    if (!header && type === "stage") {
      header = firstVisible(['[data-wp-return="stage"]'], document)?.closest("header") || null;
    }
    if (type === "stage" && header?.classList.contains("wp-generated-stage-header")) {
      header.hidden = false;
      const ownedStageHeader = firstVisible(['[data-wp-return="stage"]'], document)?.closest("header");
      if (ownedStageHeader && ownedStageHeader !== header) {
        header.remove();
        header = ownedStageHeader;
      }
      if (
        screen?.matches?.("[data-wp-logical-stage-canvas]")
        && header.parentElement !== screen
      ) {
        screen.prepend(header);
      }
    }
    if (type === "battle" && header?.classList.contains("wp-generated-battle-header")) {
      const ownedBattleHeader = [...screen.querySelectorAll("header")]
        .find((candidate) => (
          !candidate.classList.contains("wp-generated-battle-header")
          && visible(candidate)
          && first(['[data-wp-return="battle"]'], candidate)
        ));
      if (ownedBattleHeader) {
        header.remove();
        header = ownedBattleHeader;
      }
    }
    if (!header && type === "battle" && visibleResult) {
      // Result owns its own decisions and deliberately hides Battle settings.
      // Avoid accumulating empty temporary headers while the authored Battle
      // header is hidden; the next Battle can resume that permanent owner.
      host.hidden = true;
      return;
    }
    if (!header) {
      header = document.createElement("header");
      header.className = type === "stage"
        ? "wp-generated-stage-header"
        : type === "battle"
          ? "wp-generated-battle-header"
          : "wp-generated-main-header";
      screen.prepend(header);
    }
    if (!header) return;
    if (type === "battle") {
      header.hidden = false;
      header.classList.add("wp-battle-shell-header");
      currentHeader?.classList.remove("wp-shell-header", "wp-main-shell-header", "wp-stage-shell-header");
      currentHeader = header;
      if (header.classList.contains("wp-generated-battle-header") && !first(RETURN_SELECTORS, header)) {
        const battleRoot = screen.closest(
          "#battle,#battleScreen,#battleView,[data-screen='battle'],.battle-screen",
        ) || screen;
        const externalBattleReturn = [...battleRoot.querySelectorAll('[data-wp-return="battle"]')]
          .find((control) => !control.classList.contains("lobby-return") && control.id !== "lobbyReturn");
        // A beside-Battle Result can keep the Battle root hidden while the
        // shell still classifies Result as a Battle substate. Result can also
        // hide only the permanent header inside a still-visible Battle root.
        // In either form, do not steal the permanent return control into a
        // temporary header; it must remain owned by the real next-round header.
        if (!immutableSceneControls && !visibleResult && visible(screen) && externalBattleReturn && !header.contains(externalBattleReturn)) {
          externalBattleReturn.hidden = false;
          externalBattleReturn.classList.remove("is-hidden", "hidden", "wp-shell-legacy-control");
          header.prepend(externalBattleReturn);
        }
      }
      const battleReturn = first(RETURN_SELECTORS, header);
      if (battleReturn && !immutableSceneControls) battleReturn.dataset.wpReturn = "battle";
      normalizeReturn(header);
      /* A small set of authored shells explicitly keeps Settings available
         during Battle. The default contract remains hidden; opt in per game
         so the Battle utility stays owned by its active header and cannot
         leak through a prior Stage placement. */
      if (document.body?.dataset.wpBattleSettings === "visible") {
        if (host.parentElement !== header) header.append(host);
        host.hidden = false;
      } else {
        host.hidden = true;
      }
      return;
    }
    const untypedExternalReturn = [...screen.querySelectorAll(RETURN_SELECTORS.join(","))]
      .find((control) => visible(control) && !control.dataset.wpReturn);
    const externalReturn = firstVisible([`[data-wp-return="${type}"]`], screen)
      || untypedExternalReturn
      || (header.classList.contains(`wp-generated-${type}-header`)
        ? firstVisible([`[data-wp-return="${type}"]`], document)
        : null);
    const legacyHeader = externalReturn?.closest("header");
    if (!immutableSceneControls && externalReturn && !header.contains(externalReturn)) {
      externalReturn.hidden = false;
      externalReturn.classList.remove("is-hidden", "hidden");
      header.prepend(externalReturn);
    }
    if (legacyHeader && legacyHeader !== header && header.classList.contains("wp-generated-main-header")) {
      legacyHeader.classList.add("wp-shell-legacy-control");
    }
    if (!header.classList.contains("wp-generated-main-header")) {
      screen.querySelectorAll(".wp-generated-main-header").forEach((generatedHeader) => {
        if (generatedHeader !== header) removeGeneratedMainHeader(generatedHeader, header);
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
    if (![...header.querySelectorAll("h1,h2,strong")].some((node) => visible(node) && !node.closest("[data-wp-shell-info],.wp-shell-settings,.wp-shell-return"))) {
      const sourceTitle = [...screen.querySelectorAll("h1,h2")].find((node) => visible(node) && !header.contains(node));
      if (!generatedTitle) {
        generatedTitle = document.createElement("strong");
        generatedTitle.className = "wp-generated-main-title";
      }
      generatedTitle.textContent = sourceTitle?.textContent?.trim() || document.title.split(/[|\-]/)[0].trim();
      generatedTitle.setAttribute("aria-label", generatedTitle.textContent);
      header.append(generatedTitle);
    }
    const canonicalTitle = [...header.querySelectorAll(".wp-generated-main-title,h1,h2,strong")].find((node) => visible(node) && !node.closest("[data-wp-shell-info],.wp-shell-settings,.wp-shell-return"));
    if (canonicalTitle && !canonicalTitle.closest(".wp-shell-settings,.wp-shell-return")) {
      const legacyTitleContainer = canonicalTitle.parentElement;
      canonicalTitle.classList.toggle("wp-shell-main-title", type === "main");
      const localizedTitle = type === "main" ? officialGameTitle() : "";
      if (localizedTitle && canonicalTitle.textContent?.trim() !== localizedTitle) {
        canonicalTitle.dataset.runtimeLocalize = "off";
        canonicalTitle.textContent = localizedTitle;
      }
      if (canonicalTitle.parentElement !== header) header.append(canonicalTitle);
      if (
        type === "stage"
        && document.body.dataset.wpGameId === "animal-cratebound"
        && legacyTitleContainer
        && legacyTitleContainer !== header
      ) {
        const stageSummary = legacyTitleContainer.querySelector("#stageSummary,.stage-summary,[data-wp-stage-summary]");
        if (stageSummary) {
          stageSummary.classList.add("wp-stage-header-action");
          stageSummary.dataset.wpStageSummary = "";
          header.append(stageSummary);
        }
      }
      if (
        legacyTitleContainer
        && legacyTitleContainer !== header
        && !legacyTitleContainer.querySelector("button,a,input,select,textarea")
      ) {
        legacyTitleContainer.classList.add("wp-shell-legacy-control");
        legacyTitleContainer.setAttribute("aria-hidden", "true");
      }
    }
    if (header !== currentHeader || host.parentElement !== header) {
      currentHeader?.classList.remove("wp-shell-header", "wp-main-shell-header", "wp-stage-shell-header");
      currentHeader = header;
      header.classList.add("wp-shell-header", type === "stage" ? "wp-stage-shell-header" : "wp-main-shell-header");
      header.append(host);
      setOpen(false);
    }
    // Return controls belong permanently to their owning scene. Reassert the
    // identity synchronously on every placement so a prior scene can never
    // leak its arrow/logo contract into Main or Stage.
    const ownedReturn = first(RETURN_SELECTORS, header);
    if (ownedReturn && !immutableSceneControls) ownedReturn.dataset.wpReturn = type;
    normalizeReturn(header);
    if (type === "stage") {
      const helpAction = screen.querySelector("#helpBtn,#stageHelpBtn");
      if (helpAction && !popover.contains(helpAction)) {
        helpAction.classList.add("wp-shell-settings-extra");
        popover.append(helpAction);
      }
      const albumAction = screen.querySelector("#album");
      if (albumAction && albumAction.parentElement !== screen) {
        albumAction.classList.add("wp-stage-bottom-extra");
        screen.append(albumAction);
      }
    }
    if (type === "main") {
      const standardScreen = screen.matches?.(".wp-standard-main-screen")
        ? screen
        : screen.querySelector?.(".wp-standard-main-screen");
      const composition = standardScreen?.querySelector(
        ".wp-standard-main-composition",
      );
      restoreMainFlowLayout(standardScreen, composition);
    }
    host.dataset.screenOwner = type;
    host.hidden = false;
  }

  function init() {
    window.__weightPlayFrameAutoPhase = "init";
    normalizeMarketFiveSemantics();
    ensureStageSelectorRuntime();
    ensureStageV6Runtime();
    ensureBattleCanvasRuntime();
    ensureGameInfoRuntime();
    build();
    ensureOfficialTitleRegistry().then(() => {
      applyOfficialGameTitle();
      window.dispatchEvent(new CustomEvent("weightplay:shell-sync"));
    });
    place();
    const placementWatchSelector = [
      ...MAIN_SELECTORS,
      ...STAGE_SELECTORS,
      ...BATTLE_SELECTORS,
      ...HEADER_SELECTORS,
      ...RETURN_SELECTORS,
      ...MAIN_START_SELECTORS,
      ...MAIN_POSTER_SELECTORS,
      ".wp-shell-settings",
    ].join(",");
    const mutationAffectsPlacement = (record) => {
      if (record.target === document.body || record.target === document.documentElement) return true;
      if (record.type === "attributes") return record.target?.matches?.(placementWatchSelector) || false;
      return [...record.addedNodes, ...record.removedNodes].some((node) => node.nodeType === Node.ELEMENT_NODE
        && (node.matches?.(placementWatchSelector) || node.querySelector?.(placementWatchSelector)));
    };
    let placementFrame = 0;
    const observePlacement = () => observer.observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["hidden", "class", "data-screen"],
    });
    const schedulePlace = () => {
      if (placementFrame) return;
      placementFrame = requestAnimationFrame(() => {
        placementFrame = 0;
        observer.disconnect();
        place();
        observePlacement();
      });
    };
    const observer = new MutationObserver((records) => {
      if (records.some(mutationAffectsPlacement)) schedulePlace();
    });
    const syncPlace = () => {
      if (placementFrame) cancelAnimationFrame(placementFrame);
      placementFrame = 0;
      observer.disconnect();
      place();
      observePlacement();
    };
    observePlacement();
    let titleSyncQueued = false;
    const titleObserver = new MutationObserver((records) => {
      const titleChanged = records.some((record) => record.target === document.documentElement
        || record.target?.matches?.(OFFICIAL_TITLE_SELECTORS)
        || record.target?.parentElement?.matches?.(OFFICIAL_TITLE_SELECTORS));
      if (!titleChanged || titleSyncQueued) return;
      titleSyncQueued = true;
      queueMicrotask(() => {
        titleSyncQueued = false;
        applyOfficialGameTitle();
      });
    });
    titleObserver.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["lang"],
    });
    window.addEventListener("weightplay:shell-sync", syncPlace);
    document.addEventListener("change", (event) => {
      if (!event.target?.matches?.("select, [data-locale-select]")) return;
      setTimeout(() => {
        applyOfficialGameTitle();
        schedulePlace();
      }, 0);
    });
    window.addEventListener("resize", schedulePlace);
    window.addEventListener("load", schedulePlace, { once: true });
    setTimeout(schedulePlace, 0);
    if (!immutableSceneControls) {
      setTimeout(schedulePlace, 300);
      setTimeout(schedulePlace, 1000);
      setTimeout(schedulePlace, 1300);
      setTimeout(schedulePlace, 1800);
      setTimeout(schedulePlace, 3200);
      setTimeout(schedulePlace, 4800);
      let recoveryAttempts = 0;
      const recoveryTimer = setInterval(() => {
        schedulePlace();
        recoveryAttempts += 1;
        if (recoveryAttempts >= 20) clearInterval(recoveryTimer);
      }, 250);
    }
  }

  let initialized = false;
  let beginAttempts = 0;
  function bindOfficialDocumentTitle() {
    if (window.WeightPlayOfficialName) return;
    if (!document.documentElement.hasAttribute('data-wp-official-name')) return;
    const titleNode = document.querySelector('title');
    if (!titleNode) return;
    titleNode.dataset.runtimeLocalize = 'off';
    const sync = () => {
      const id = document.body?.dataset.wpGameId || location.pathname.match(/\/games\/([^/]+)/)?.[1];
      const name = window.WEIGHTPLAY_GAME_TITLES?.[id]?.[localeCode()];
      if (name && document.title !== `${name} | WeightPlay`) document.title = `${name} | WeightPlay`;
    };
    // Observe only the one title and locale attribute, not the full page.
    const observer = new MutationObserver(sync);
    const connect = () => {
      observer.observe(titleNode, {childList:true,characterData:true,subtree:true});
      observer.observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
      sync();
    };
    connect();
    window.addEventListener('pagehide', () => observer.disconnect());
    window.addEventListener('pageshow', connect);
  }
  function begin() {
    window.__weightPlayFrameAutoPhase = "begin";
    if (initialized) return;
    if (document.querySelector('[data-wp-frame-root],[data-wp-game-shell-root]')) return;
    if (!document.body) {
      beginAttempts += 1;
      if (beginAttempts < 100) setTimeout(begin, 50);
      return;
    }
    initialized = true;
    bindOfficialDocumentTitle();
    init();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", begin, { once: true });
  }
  setTimeout(begin, 0);
  if (document.readyState !== "loading") begin();
  }
  window.WeightPlayScreenFrame = Object.freeze({ version: 7, mount, mountSlots, autoMountDocument, createSettings });
  queueMicrotask(autoMountDocument);
})();
