/* Scene/content adapter. All frame controls and their skin come from shared core. */
(() => {
 'use strict';
 let mountedFrame=null;
 window.mountSignalVeilFrame = () => {
  if(mountedFrame)return mountedFrame;
  const reservedRoot=document.getElementById('signalFrame');
  if(reservedRoot&&!reservedRoot.hasAttribute('data-wp-frame-root'))throw new Error('SIGNAL_FRAME_ROOT_ALREADY_EXISTS');
  const main=document.getElementById('main'),battle=document.getElementById('battleCanvas');
  const root=reservedRoot||document.createElement('div');root.id='signalFrame';root.dataset.wpFrameRoot='';
  if(root.childElementCount)throw new Error('SIGNAL_FRAME_ROOT_NOT_EMPTY');
  const settingsGuardStyle=document.createElement('style');settingsGuardStyle.dataset.signalFrameSettingsGuard='';
  settingsGuardStyle.textContent='#signalFrame [data-wp-preferences] > button.wp-frame-settings[hidden]{display:none!important;visibility:hidden!important;pointer-events:none!important}';
  document.head.append(settingsGuardStyle);
  if(!root.isConnected)main.before(root);root.append(main,document.getElementById('battleShell'));
  // Locale generation places its owned static guide after the game shell.
  const guide=document.querySelector('.game-page-info');root.after(guide);
  const mainHeader=main.querySelector('header'),battleHeader=battle.querySelector('header');
  const localeCarrier=mainHeader.querySelector('.locale-picker');localeCarrier.hidden=true;root.append(localeCarrier);
  const title=mainHeader.querySelector('[data-t="title"]');title.dataset.wpFrameTitle='';mainHeader.append(title);
  mainHeader.querySelector('.title-slot').remove();
  main.querySelector('.main-poster').dataset.wpFramePoster='';
  const copy=main.querySelector('.main-copy');copy.dataset.wpFrameCopy='';
  copy.querySelectorAll('.kicker,h1').forEach(node=>node.hidden=true);
  let summary=copy.querySelector('.main-summary')||main.querySelector('.wp-standard-main-summary,.main-summary');
  if(!summary){
   const locale=window.WonderI18n?.locale?.()||document.documentElement.lang;
   const text=window.SIGNAL_VEIL_LOCALES?.[locale]?.summary;
   if(typeof text!=='string'||!text.trim())throw new Error('SIGNAL_FRAME_MAIN_SUMMARY_UNAVAILABLE');
   summary=document.createElement('p');summary.className='main-summary';summary.dataset.t='summary';summary.textContent=text;
  }
  if(summary.parentElement!==copy)copy.append(summary);
  summary.dataset.wpFrameSummary='';
  document.getElementById('mainProgress').dataset.wpFrameProgress='';
  document.getElementById('startGame').dataset.wpMainStart='';
  const content=document.createElement('div');content.id='signalWorkspace';
  const hud=battle.querySelector('.hud'),controls=battle.querySelector('.mobile-controls');
  const info=document.createElement('div');info.dataset.wpFrameInfo='';
  const zone=document.createElement('div');zone.append(document.getElementById('zoneLabel'));
  info.append(zone,hud.querySelector('.hud-level'),document.getElementById('visionState'));
  const tools=battleHeader.querySelector('.battle-actions');tools.className='signal-tools';
  content.append(info,hud,document.getElementById('gameViewport'),controls,tools);
  battleHeader.querySelector('.battle-title').remove();
  const hiddenTitle=document.createElement('strong');hiddenTitle.dataset.wpFrameTitle='';battleHeader.append(hiddenTitle);
  battle.append(content);
  root.querySelectorAll('button:not([data-wp-return])').forEach(button=>button.dataset.wpFrameAction=button.classList.contains('primary')?'primary':'secondary');
  // If the legacy auto-mounter won the race before this explicit scene mount,
  // retire only its generic settings host; the shared frame below supplies the
  // same language/sound control for the active Main scene.
  root.querySelectorAll('.wp-shell-settings[data-wp-settings-control]').forEach(host=>host.remove());
  const frame=window.WeightPlayScreenFrame.mount({root,localeSelect:document.getElementById('localeSelect'),scenes:{
   main:{root:main,header:mainHeader,content:main.querySelector('.main-hero')},
   battle:{root:battle,header:battleHeader,content,headerInfo:info}
  }});
  window.addEventListener('pagehide',event=>{if(!event.persisted)frame.destroy()});
  mountedFrame={
   activate(name,covered=false){
    guide.hidden=name!=='main';
    content.inert=covered;
    content.setAttribute('aria-hidden',String(covered));
    frame.activate(name,{covered});
   },
   isSettingsOpen(){return Boolean(battleHeader.querySelector('.wp-frame-popover:not([hidden])'));},
   refresh:frame.refresh
  };
  return mountedFrame;
 };
})();
