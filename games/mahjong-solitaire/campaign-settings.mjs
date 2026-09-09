import {CAMPAIGN_LOCALES} from './campaign-copy.mjs';
import {mahjongMainCopy} from './campaign-main-copy.mjs';
const names=['English','繁體中文','简体中文','日本語','한국어','Español','Português','Français','Deutsch','Italiano','Русский','हिन्दी','العربية'];
let sequence=0;
// Share the entry's audio owner (e.g. WonderSound). No independent preference,
// AudioContext, global observer or scene-specific locale store is created here.
export function createCampaignSettings({locale,setLocale,sound,allowLanguage=true}) {
 if(!sound?.isMuted||!sound?.setMuted||typeof locale!=='function'||(allowLanguage&&typeof setLocale!=='function'))throw new Error('Settings owner callbacks required');
 const root=document.createElement('div');root.className='mjc-settings';
 root.innerHTML='<button type="button" class="mjc-settings-toggle" aria-expanded="false"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 3 1-1h4l1 3 3 1 3 3-1 3 1 3-3 3-3 1-1 3h-4l-1-3-3-1-3-3 1-3-1-3 3-3 3-1Z"/><circle cx="12" cy="12" r="3.5"/></svg></button><div class="mjc-settings-panel" role="group" hidden><label class="mjc-settings-language"><span></span><select></select></label><div class="mjc-settings-sound"><span></span><button type="button" role="switch"><span aria-hidden="true"></span></button></div></div>';
 const toggle=root.querySelector('.mjc-settings-toggle'),panel=root.querySelector('.mjc-settings-panel'),select=root.querySelector('select'),control=root.querySelector('[role=switch]'),lifetime=new AbortController();let disposed=false;
 panel.id=`mjc-settings-${++sequence}`;toggle.setAttribute('aria-controls',panel.id);toggle.dataset.wpSettings='';
 panel.setAttribute('role','dialog');control.dataset.soundToggle='';
 if(allowLanguage)for(const [i,code] of CAMPAIGN_LOCALES.entries()){const option=document.createElement('option');option.value=code;option.textContent=names[i];select.append(option);}
 else root.querySelector('.mjc-settings-language').remove();
 function close({focus=false}={}){panel.hidden=true;toggle.setAttribute('aria-expanded','false');if(focus)toggle.focus({preventScroll:true});}
 function refresh(){
  if(disposed)return;const c=mahjongMainCopy(locale());root.dir=locale()==='ar'?'rtl':'ltr';toggle.setAttribute('aria-label',c.settings);panel.setAttribute('aria-label',c.settings);
  if(allowLanguage){root.querySelector('label span').textContent=c.language;select.value=locale();}
  root.querySelector('.mjc-settings-sound>span').textContent=c.sound;control.setAttribute('aria-label',c.sound);control.setAttribute('aria-checked',String(!sound.isMuted()));
 }
 toggle.addEventListener('click',()=>{if(panel.hidden){refresh();panel.hidden=false;toggle.setAttribute('aria-expanded','true');panel.style.transform='';const box=panel.getBoundingClientRect(),width=document.documentElement.clientWidth,scale=root.getBoundingClientRect().width/48;const shift=box.left<8?8-box.left:box.right>width-8?width-8-box.right:0;if(shift&&scale>0)panel.style.transform=`translateX(${shift/scale}px)`;}else close()},{signal:lifetime.signal});
 control.addEventListener('click',()=>{sound.setMuted(!sound.isMuted());refresh()},{signal:lifetime.signal});
 if(allowLanguage)select.addEventListener('change',()=>{setLocale(select.value);refresh();close({focus:true})},{signal:lifetime.signal});
 document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!root.contains(e.target))close()},{signal:lifetime.signal});
 root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();e.stopPropagation();close({focus:true})}},{signal:lifetime.signal});
 function dispose(){if(disposed)return;disposed=true;lifetime.abort();root.remove();}
 refresh();return {root,refresh,close,dispose};
}
