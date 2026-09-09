import {mountMahjongCampaign} from './campaign-app.mjs';
import {createCampaignMainView} from './campaign-main-view.mjs';
import {createCampaignSettings} from './campaign-settings.mjs';
import {createCampaignAudio} from './campaign-audio.mjs';
import {CAMPAIGN_LOCALES} from './campaign-copy.mjs';
import {applyCampaignMetadata} from './campaign-metadata.mjs';
const segments=['en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar'];

// Sole replacement bootstrap. Call after the locale shell/styles are loaded,
// never in addition to WPPopularArcade.mount(). No test-only global is exposed.
export function mountMahjongEntry({container,locale,storage,titles}) {
 if(!container||!CAMPAIGN_LOCALES.includes(locale)||CAMPAIGN_LOCALES.some(l=>!titles?.[l]))throw new Error('Complete campaign entry contract required');
 if(container.childElementCount)throw new Error('Replacement entry requires an empty mount');
 const sound=createCampaignAudio({storage}),lifetime=new AbortController();let currentLocale=locale,app,main,disposed=false,inputType='unknown';
 document.addEventListener('pointerdown',event=>{inputType=event.pointerType==='touch'?'touch':event.pointerType==='mouse'?'mouse':'pointer'},{capture:true,signal:lifetime.signal});
 document.addEventListener('keydown',()=>{inputType='keyboard'},{capture:true,signal:lifetime.signal});
 const onEvent=(name,details)=>{
  const width=innerWidth,height=innerHeight,viewport=height<=430?'short-landscape':width<=480?'phone':width<=900?(height>width?'tablet-portrait':'tablet-landscape'):(height>width?'desktop-portrait':'desktop-landscape');
  window.WonderAnalytics?.track?.(name,{...details,game_id:'mahjong-solitaire',game_version:'v14',interface_version:'6',locale:currentLocale,viewport_bucket:viewport,input_type:inputType});
 };
 const setLocale=l=>{
  if(!CAMPAIGN_LOCALES.includes(l))throw new Error('Unsupported locale');const changed=currentLocale!==l;currentLocale=l;
  document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';
  const metadata=applyCampaignMetadata(document,l,titles[l]);
  // Keep refresh/share in the chosen language on actual game routes. Never
  // rewrite another host/path (including embedding fixtures), navigate to
  // production, reset progress, or add a new browser history entry.
  if(changed&&/^\/(?:(?:en|zh-tw|zh-cn|ja|ko|es|pt-br|fr|de|it|ru|hi|ar)\/)?games\/mahjong-solitaire\/(?:index\.html)?$/.test(location.pathname)){
   const suffix=location.pathname.endsWith('index.html')?'index.html':'';
   try{history.replaceState(history.state,'',metadata.pathname+suffix+location.search+location.hash)}catch{/* Restricted history still permits session-local language changes. */}
  }
  try{storage.setItem('weightPlayLocale',l)}catch{}main?.refresh();
 };
 const mainSettings=createCampaignSettings({locale:()=>currentLocale,setLocale,sound}),stageSettings=createCampaignSettings({locale:()=>currentLocale,sound,allowLanguage:false});
 main=createCampaignMainView({locale:()=>currentLocale,title:l=>titles[l],lobbyHref:l=>`/${segments[CAMPAIGN_LOCALES.indexOf(l)]}/`,progress:()=>app?.session.snapshot().progress||{unlocked:1},settings:mainSettings.root});
 container.append(main.root,main.guide);
 app=mountMahjongCampaign({main:main.root,guide:main.guide,startButton:main.startButton,locale:()=>currentLocale,storage,mainSettings,stageSettings,onMain:()=>main.refresh(),sound,onEvent});
 setLocale(currentLocale);main.refresh();
 document.addEventListener('visibilitychange',()=>{if(document.hidden)sound.stop()},{signal:lifetime.signal});
 async function dispose(){if(disposed)return;disposed=true;lifetime.abort();app.dispose();main.dispose();await sound.dispose();}
 // A cached document is frozen, not destroyed. Close transient audio without
 // discarding the mounted session; its next input can create a new voice.
 window.addEventListener('pagehide',event=>{if(event.persisted)sound.stop();else dispose()},{signal:lifetime.signal});
 return Object.freeze({dispose});
}
