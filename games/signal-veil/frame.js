/* Scene/content adapter. All frame controls and their skin come from shared core. */
(() => {
 'use strict';
 window.mountSignalVeilFrame = () => {
  const main=document.getElementById('main'),battle=document.getElementById('battleCanvas');
  const root=document.createElement('div');root.id='signalFrame';root.dataset.wpFrameRoot='';
  main.before(root);root.append(main,document.getElementById('battleShell'));
  // Locale generation places its owned static guide after the game shell.
  const guide=document.querySelector('.game-page-info');root.after(guide);
  const mainHeader=main.querySelector('header'),battleHeader=battle.querySelector('header');
  const localeCarrier=mainHeader.querySelector('.locale-picker');localeCarrier.hidden=true;root.append(localeCarrier);
  const title=mainHeader.querySelector('[data-t="title"]');title.dataset.wpFrameTitle='';mainHeader.append(title);
  mainHeader.querySelector('.title-slot').remove();
  main.querySelector('.main-poster').dataset.wpFramePoster='';
  const copy=main.querySelector('.main-copy');copy.dataset.wpFrameCopy='';
  copy.querySelectorAll('.kicker,h1').forEach(node=>node.hidden=true);
  copy.querySelector('.main-summary').dataset.wpFrameSummary='';
  document.getElementById('mainProgress').dataset.wpFrameProgress='';
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
  const frame=window.WeightPlayScreenFrame.mount({root,localeSelect:document.getElementById('localeSelect'),scenes:{
   main:{root:main,header:mainHeader,content:main.querySelector('.main-hero')},
   battle:{root:battle,header:battleHeader,content,headerInfo:info}
  }});
  window.addEventListener('pagehide',event=>{if(!event.persisted)frame.destroy()});
  return {
   activate(name,covered=false){
    guide.hidden=name!=='main';
    content.inert=covered;
    content.setAttribute('aria-hidden',String(covered));
    frame.activate(name,{covered});
   },
   isSettingsOpen(){return Boolean(battleHeader.querySelector('.wp-frame-popover:not([hidden])'));},
   refresh:frame.refresh
  };
 };
})();
