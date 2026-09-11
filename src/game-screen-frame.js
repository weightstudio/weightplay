/* One shared frame. No game IDs, polling or parallel skin implementations. */
(() => {
  'use strict';
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
    const listen = (node, event, fn) => node.addEventListener(event, fn, {signal:abort.signal});
    const utility = document.createElement('div'); utility.className = 'wp-frame-utility'; utility.dataset.wpPreferences = '';
    utility.innerHTML = '<button type="button" class="wp-frame-settings" data-wp-settings aria-expanded="false"><span class="wp-frame-settings-icon" aria-hidden="true"></span></button><div class="wp-frame-popover" role="group" hidden><label><span></span><select></select></label><div><span></span><button type="button" role="switch" class="wp-frame-sound"><span class="wp-frame-sound-icon" aria-hidden="true"></span><span class="wp-frame-sound-state"></span></button></div></div>';
    const button=utility.querySelector('button'), panel=utility.querySelector('.wp-frame-popover'), select=utility.querySelector('select');
    const languageText=panel.querySelector('label > span'), soundText=panel.querySelector('div > span'), sound=panel.querySelector('.wp-frame-sound'), soundState=sound.querySelector('.wp-frame-sound-state');
    panel.id=`wp-frame-${id}-settings`;button.setAttribute('aria-controls',panel.id);
    for(const option of localeSelect?.options||[])select.add(option.cloneNode(true));
    panel.querySelector('label').hidden=!showLanguage||!localeSelect;
    const close=(focus=false)=>{panel.hidden=true;button.setAttribute('aria-expanded','false');if(focus)button.focus({preventScroll:true});};
    const refresh=()=>{
      const locale=window.WonderI18n?.locale?.()||document.documentElement.lang;
      const labels=copy[locale]||copy.en;
      button.setAttribute('aria-label',labels[0]);panel.setAttribute('aria-label',labels[0]);
      languageText.textContent=labels[1];select.setAttribute('aria-label',labels[1]);select.value=localeSelect?.value||locale;
      const muted=Boolean(window.WonderSound?.isMuted?.());
      soundText.textContent=labels[2];soundState.textContent=muted?labels[4]:labels[3];sound.setAttribute('aria-label',`${labels[2]}：${muted?labels[4]:labels[3]}`);sound.setAttribute('aria-checked',String(!muted));
      sound.disabled=!window.WonderSound?.setMuted;
    };
    listen(button,'click',()=>{const open=panel.hidden;if(open)onOpen();panel.hidden=!open;button.setAttribute('aria-expanded',String(open));});
    listen(select,'change',()=>{localeSelect.value=select.value;localeSelect.dispatchEvent(new Event('change',{bubbles:true}));refresh();});
    listen(sound,'click',()=>{window.WonderSound?.setMuted?.(!window.WonderSound?.isMuted?.());refresh();});
    // Inside interactions belong to this component, not legacy game dismissal handlers.
    for(const event of ['pointerdown','click'])listen(panel,event,e=>e.stopPropagation());
    listen(document,'pointerdown',e=>{if(!utility.contains(e.target))close();});
    listen(document,'keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();e.stopPropagation();close(true);}});
    listen(window,'wonder:locale-change',refresh);listen(window,'wonder:audio-volume-change',refresh);
    refresh();
    return {utility,button,panel,select,sound,close,refresh,destroy(){abort.abort();utility.remove();}};
  }
  function mount({ root, scenes, localeSelect }) {
    if (mounts.has(root)) return mounts.get(root);
    if (!root || !scenes.main || !scenes.battle) throw new Error('FRAME_SCENES_REQUIRED');
    const abort = new AbortController();
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
      arrow.textContent = '';
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
      if (scene.headerInfo) {
        if (name !== 'battle' || !scene.content.contains(scene.headerInfo)) throw new Error('FRAME_BATTLE_INFO_SLOT_REQUIRED');
        if (!scene.headerInfo.children.length || scene.headerInfo.children.length>3) throw new Error('FRAME_BATTLE_INFO_REQUIRES_ONE_TO_THREE_STATS');
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
    const close = () => Object.values(entries).forEach(entry => entry.close());
    listen(window, 'wonder:locale-change', () => queueMicrotask(refresh));
    listen(window, 'wonder:audio-volume-change', refresh);
    const api = Object.freeze({
      activate(name, { covered = false } = {}) {
        if (!entries[name]) throw new Error(`FRAME_UNKNOWN_SCENE:${name}`);
        if(active!==name||activeCovered!==covered)close();
        active = name; activeCovered=covered; root.dataset.wpFrameActive = name;
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
      destroy() { close(); abort.abort(); Object.values(entries).forEach(entry => entry.destroy()); mounts.delete(root); },
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
      // row or intercept pointer events over the play surface.
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
  window.WeightPlayScreenFrame = Object.freeze({ mount, mountSlots, createSettings });
})();
