/* Canonical development entry forwards to a real static locale page. */
(() => {
 'use strict';
 const routes={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
 if(!/^https?:$/.test(location.protocol))return;
 const root=new URL('../../',document.currentScript.src);
 const relative=location.pathname.slice(root.pathname.length);
 if(!/^games\/fusekeep\/(?:index\.html)?$/.test(relative))return;
 let locale=new URL(location.href).searchParams.get('lang');
 if(!locale)try{locale=localStorage.getItem('weightPlayLocale');}catch{/* Default route still works. */}
 if(!Object.hasOwn(routes,locale))locale='en';
 const destination=new URL(`${routes[locale]}/games/fusekeep/`,root);destination.search=location.search;destination.searchParams.delete('lang');destination.hash=location.hash;location.replace(destination.href);
})();
