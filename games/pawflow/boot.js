(() => {
 'use strict';if(new URLSearchParams(location.search).get('preview')!=='1')return;const base=document.currentScript.src;let abandoned=false;
 const fail=()=>{if(!abandoned&&document.documentElement.dataset.pawflowReady!=='true')document.getElementById('bootError').hidden=false;};
 // One shared entry for all locales: refresh only this game's content stylesheet.
 const sheet=document.querySelector('link[href*="/games/pawflow/style.css"]');
 if(sheet)sheet.href=new URL('./style.css?v=4',base).href;
 const version=document.querySelector('meta[name="weightplay-game-version"]');if(version)version.content='4';
 const timer=setTimeout(fail,15000);
 window.addEventListener('pagehide',event=>{if(!event.persisted){abandoned=true;clearTimeout(timer);}},{once:true});
 import(new URL('./game.js?v=4',base).href).then(()=>{clearTimeout(timer);if(abandoned)return;document.getElementById('bootError').hidden=document.documentElement.dataset.pawflowReady==='true';}).catch(error=>{clearTimeout(timer);console.warn('Pawflow startup:',error?.message);fail();});
})();
