/* Opt-in v2 shell. No game IDs, visibility inference, polling or legacy repair. */
(() => {
  'use strict';
  const mounts = new WeakMap();
  const copy = {
    en: ['Settings', 'Language', 'Sound'], 'zh-Hant': ['設定', '語言', '聲音'],
    'zh-Hans': ['设置', '语言', '声音'], ja: ['設定', '言語', 'サウンド'],
    ko: ['설정', '언어', '소리'], es: ['Configuración', 'Idioma', 'Sonido'],
    'pt-BR': ['Configurações', 'Idioma', 'Som'], fr: ['Paramètres', 'Langue', 'Son'],
    de: ['Einstellungen', 'Sprache', 'Ton'], it: ['Impostazioni', 'Lingua', 'Suono'],
    ru: ['Настройки', 'Язык', 'Звук'], hi: ['सेटिंग्स', 'भाषा', 'ध्वनि'],
    ar: ['الإعدادات', 'اللغة', 'الصوت'],
  };
  function mount({ root, scenes, localeSelect }) {
    if (mounts.has(root)) return mounts.get(root);
    if (!root || !scenes.main || !scenes.battle) throw new Error('FRAME_SCENES_REQUIRED');
    const abort = new AbortController();
    const listen = (node, event, fn) => node.addEventListener(event, fn, { signal: abort.signal });
    const entries = {};
    let active = null;
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
      arrow.textContent = '';
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
      const utility = document.createElement('div');
      utility.className = 'wp-frame-utility';
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'wp-frame-settings'; button.dataset.wpSettings = 'true';
      const gear = document.createElement('span');
      gear.className = 'wp-frame-settings-icon'; gear.setAttribute('aria-hidden','true');
      button.append(gear);
      const panel = document.createElement('div');
      panel.className = 'wp-frame-popover'; panel.hidden = true; panel.setAttribute('role', 'group');
      panel.id = `wp-frame-${name}-settings`;
      button.setAttribute('aria-controls', panel.id); button.setAttribute('aria-expanded', 'false');
      const language = document.createElement('label');
      const languageText = document.createElement('span');
      const select = document.createElement('select');
      for (const option of localeSelect?.options || []) select.add(option.cloneNode(true));
      language.append(languageText, select);
      language.hidden = name !== 'main' || !localeSelect;
      const soundRow = document.createElement('div');
      const soundText = document.createElement('span');
      const sound = document.createElement('button');
      sound.type = 'button'; sound.setAttribute('role', 'switch'); sound.className = 'wp-frame-sound';
      soundRow.append(soundText, sound);
      panel.append(language, soundRow); utility.append(button, panel); header.append(utility);
      const close = (focus = false) => { panel.hidden = true; button.setAttribute('aria-expanded', 'false'); if (focus) button.focus({ preventScroll: true }); };
      listen(button, 'click', () => {
        const open = panel.hidden;
        Object.values(entries).forEach(entry => entry.close());
        panel.hidden = !open; button.setAttribute('aria-expanded', String(open));
      });
      listen(select, 'change', () => { localeSelect.value = select.value; localeSelect.dispatchEvent(new Event('change', { bubbles: true })); refresh(); });
      listen(sound, 'click', () => { window.WonderSound?.setMuted?.(!window.WonderSound?.isMuted?.()); refresh(); });
      entries[name] = { ...scene, button, panel, utility, select, languageText, soundText, sound, close };
    }
    function refresh() {
      const locale = window.WonderI18n?.locale?.() || document.documentElement.lang;
      const labels = copy[locale] || copy.en;
      for (const entry of Object.values(entries)) {
        entry.button.setAttribute('aria-label', labels[0]); entry.panel.setAttribute('aria-label', labels[0]);
        entry.languageText.textContent = labels[1]; entry.select.setAttribute('aria-label', labels[1]);
        entry.select.value = localeSelect?.value || locale;
        entry.soundText.textContent = labels[2]; entry.sound.setAttribute('aria-label', labels[2]);
        entry.sound.setAttribute('aria-checked', String(!window.WonderSound?.isMuted?.()));
      }
    }
    const close = () => Object.values(entries).forEach(entry => entry.close());
    listen(document, 'pointerdown', event => Object.values(entries).forEach(entry => { if (!entry.utility.contains(event.target)) entry.close(); }));
    listen(document, 'keydown', event => { if (event.key === 'Escape') Object.values(entries).forEach(entry => { if (!entry.panel.hidden) { event.preventDefault(); entry.close(true); } }); });
    listen(window, 'wonder:locale-change', refresh);
    listen(window, 'wonder:audio-volume-change', refresh);
    const api = Object.freeze({
      activate(name, { covered = false } = {}) {
        if (!entries[name]) throw new Error(`FRAME_UNKNOWN_SCENE:${name}`);
        close(); active = name; root.dataset.wpFrameActive = name;
        for (const [key, entry] of Object.entries(entries)) {
          const enabled = key === name;
          entry.header.hidden = !enabled || covered;
          entry.header.inert = !enabled || covered;
          entry.root.inert = !enabled;
          entry.root.setAttribute('aria-hidden', String(!enabled));
        }
        refresh();
      },
      close,
      refresh,
      get active() { return active; },
      destroy() { close(); abort.abort(); Object.values(entries).forEach(entry => entry.utility.remove()); mounts.delete(root); },
    });
    mounts.set(root, api); refresh(); return api;
  }
  window.WeightPlayScreenFrame = Object.freeze({ mount });
})();
