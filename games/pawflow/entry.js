/* A canonical preview route forwards to a complete, locale-owned static page. */
(() => {
 'use strict';if(!/^https?:$/.test(location.protocol))return;
 const routes={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
 if(!/^\/games\/pawflow\/(?:index\.html)?$/.test(location.pathname))return;
 const url=new URL(location.href);let locale=url.searchParams.get('lang');if(!locale)try{locale=localStorage.getItem('weightPlayLocale');}catch{}
 if(!Object.hasOwn(routes,locale))locale='en';url.pathname=`/${routes[locale]}/games/pawflow/`;url.searchParams.delete('lang');location.replace(url.href);
})();
