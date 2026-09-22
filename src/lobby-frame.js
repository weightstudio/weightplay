/* Lobby-owned shell utilities. This runtime must stay independent from the game frame. */
(() => {
  'use strict';

  if (window.WeightPlayLobbyFrame?.version === 1) return;

  const copy = {
    en: ['Settings', 'Language', 'Sound', 'On', 'Muted'],
    'zh-Hant': ['設定', '語言', '聲音', '開啟', '靜音'],
    'zh-Hans': ['设置', '语言', '声音', '开启', '静音'],
    ja: ['設定', '言語', 'サウンド', 'オン', 'ミュート'],
    ko: ['설정', '언어', '소리', '켜짐', '음소거'],
    es: ['Configuración', 'Idioma', 'Sonido', 'Activado', 'Silencio'],
    'pt-BR': ['Configurações', 'Idioma', 'Som', 'Ligado', 'Mudo'],
    fr: ['Paramètres', 'Langue', 'Son', 'Activé', 'Muet'],
    de: ['Einstellungen', 'Sprache', 'Ton', 'An', 'Stumm'],
    it: ['Impostazioni', 'Lingua', 'Suono', 'Attivo', 'Muto'],
    ru: ['Настройки', 'Язык', 'Звук', 'Вкл.', 'Без звука'],
    hi: ['सेटिंग्स', 'भाषा', 'ध्वनि', 'चालू', 'म्यूट'],
    ar: ['الإعدادات', 'اللغة', 'الصوت', 'مفعّل', 'صامت'],
  };

  function currentLocale() {
    return window.WonderI18n?.actualLocale?.()
      || window.WonderI18n?.locale?.()
      || document.documentElement.lang
      || 'en';
  }

  function createPreferences({ localeSelect, id = 'lobby' }) {
    const abort = new AbortController();
    const listen = (node, event, handler) => node.addEventListener(event, handler, { signal: abort.signal });
    const utility = document.createElement('div');
    utility.className = 'lobby-preferences';
    utility.dataset.lobbyPreferences = '';
    utility.innerHTML = `
      <button type="button" class="lobby-settings-button" aria-expanded="false">
        <svg class="lobby-settings-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9.8 2h4.4l.7 2.3c.5.2 1 .5 1.5.9l2.3-.6 2.2 3.8-1.7 1.7c.1.6.1 1.2 0 1.8l1.7 1.7-2.2 3.8-2.3-.6c-.5.4-1 .7-1.5.9l-.7 2.3H9.8l-.7-2.3c-.5-.2-1-.5-1.5-.9l-2.3.6-2.2-3.8 1.7-1.7a8 8 0 0 1 0-1.8L3.1 8.4l2.2-3.8 2.3.6c.5-.4 1-.7 1.5-.9L9.8 2Zm2.2 6.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Z" />
        </svg>
      </button>
      <div class="lobby-settings-popover" role="dialog" hidden>
        <label class="lobby-settings-row lobby-language-row"><span></span><select></select></label>
        <div class="lobby-settings-row">
          <span></span>
          <button type="button" role="switch" class="lobby-sound-toggle">
            <svg class="lobby-sound-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4 9h4l5-4v14l-5-4H4V9Z" />
              <path class="lobby-sound-wave" d="M16 8.2a5 5 0 0 1 0 7.6M18.8 5.4a9 9 0 0 1 0 13.2" />
              <path class="lobby-sound-muted" d="m16 9 5 6m0-6-5 6" />
            </svg>
            <span class="lobby-sound-state"></span>
          </button>
        </div>
      </div>`;

    const button = utility.querySelector('.lobby-settings-button');
    const panel = utility.querySelector('.lobby-settings-popover');
    const select = utility.querySelector('select');
    const languageText = utility.querySelector('.lobby-language-row > span');
    const soundText = utility.querySelector('.lobby-settings-row:last-child > span');
    const sound = utility.querySelector('.lobby-sound-toggle');
    const soundState = utility.querySelector('.lobby-sound-state');

    panel.id = `lobby-${id}-settings`;
    button.setAttribute('aria-controls', panel.id);
    select.id = `lobby-${id}-locale`;
    utility.setAttribute('data-runtime-localize', 'off');
    for (const option of localeSelect?.options || []) select.add(option.cloneNode(true));

    const close = (restoreFocus = false) => {
      const wasOpen = !panel.hidden;
      panel.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      if (wasOpen && restoreFocus) button.focus({ preventScroll: true });
    };

    const refresh = () => {
      const locale = currentLocale();
      const labels = copy[locale] || copy.en;
      const selectedLocale = localeSelect?.value || locale;
      button.setAttribute('aria-label', labels[0]);
      panel.setAttribute('aria-label', labels[0]);
      languageText.textContent = labels[1];
      select.setAttribute('aria-label', labels[1]);
      if (Array.from(select.options).some((option) => option.value === selectedLocale)) select.value = selectedLocale;
      const muted = Boolean(window.WeightPlayAudio?.isMuted?.());
      soundText.textContent = labels[2];
      soundState.textContent = muted ? labels[4] : labels[3];
      sound.setAttribute('aria-label', `${labels[2]}：${muted ? labels[4] : labels[3]}`);
      sound.setAttribute('aria-checked', String(!muted));
      sound.disabled = !window.WeightPlayAudio?.setMuted;
    };

    listen(button, 'click', () => {
      refresh();
      const open = panel.hidden;
      panel.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    });
    listen(select, 'change', () => {
      if (!localeSelect) return;
      localeSelect.value = select.value;
      localeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      refresh();
    });
    if (localeSelect) listen(localeSelect, 'change', refresh);
    listen(sound, 'click', () => {
      window.WeightPlayAudio?.setMuted?.(!window.WeightPlayAudio?.isMuted?.());
      refresh();
    });
    listen(panel, 'pointerdown', (event) => event.stopPropagation());
    listen(panel, 'click', (event) => event.stopPropagation());
    listen(document, 'pointerdown', (event) => {
      if (!utility.contains(event.target)) close();
    });
    listen(document, 'keydown', (event) => {
      if (event.key !== 'Escape' || panel.hidden) return;
      event.preventDefault();
      event.stopPropagation();
      close(true);
    });
    listen(window, 'wonder:locale-change', refresh);
    listen(window, 'weightplay:audio-volume-change', refresh);
    refresh();

    return Object.freeze({
      utility,
      button,
      panel,
      select,
      sound,
      close,
      refresh,
      destroy() {
        abort.abort();
        utility.remove();
      },
    });
  }

  function mountGeneralLobby() {
    if (!document.body?.classList.contains('general-lobby-page')) return null;
    if (document.querySelector('[data-lobby-preferences]')) return null;
    const localeSelect = document.querySelector('#localeSelect');
    const sourceLabel = localeSelect?.closest('label');
    if (!localeSelect || !sourceLabel) return null;
    const preferences = createPreferences({ localeSelect, id: 'general' });
    sourceLabel.before(preferences.utility);
    sourceLabel.hidden = true;
    sourceLabel.style.setProperty('display', 'none', 'important');
    document.documentElement.dataset.lobbyFrame = '1';
    window.addEventListener('pagehide', (event) => {
      if (event.persisted) return;
      preferences.destroy();
      sourceLabel.hidden = false;
      sourceLabel.style.removeProperty('display');
      delete document.documentElement.dataset.lobbyFrame;
    }, { once: true });
    return preferences;
  }

  window.WeightPlayLobbyFrame = Object.freeze({ version: 1, createPreferences, mountGeneralLobby });
  mountGeneralLobby();
})();
