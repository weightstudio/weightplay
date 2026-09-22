/* Locale-owned Main/guide are static HTML. Only hidden play scenes need JS. */
(() => {
 'use strict';
 const src=document.currentScript.src;
 let abandoned=false;
 const fail=()=>{if(abandoned||document.documentElement.dataset.fusekeepReady==='true')return;document.getElementById('bootError').hidden=false;};
 const timer=setTimeout(fail,15000);
 window.addEventListener('pagehide',event=>{if(!event.persisted){abandoned=true;clearTimeout(timer);}},{once:true});
 import(new URL('./screens.mjs?v=5',src).href).then(module=>{
  if(abandoned)return;module.mountPlayScreens();return import(new URL('./app.mjs?v=5',src).href);
 }).then(()=>{clearTimeout(timer);if(abandoned)return;document.getElementById('start').disabled=false;document.getElementById('bootError').hidden=true;})
 .catch(error=>{clearTimeout(timer);console.warn('Fusekeep startup:',error?.message);fail();});
})();
