// Name-only adapter: no scene, gameplay, navigation, save or workflow changes.
(() => {
  if (window.WeightPlayOfficialName || !document.documentElement.hasAttribute('data-wp-official-name')) return;
  const map = {en:'en','zh-tw':'zh-Hant','zh-hant':'zh-Hant','zh-cn':'zh-Hans','zh-hans':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
  const id=location.pathname.match(/\/games\/([^/]+)/)?.[1];
  const routeLocale=map[location.pathname.split('/').filter(Boolean)[0]?.toLowerCase()];
  const queryLocale=map[(new URLSearchParams(location.search).get('lang')||'').toLowerCase()];
  let locale=queryLocale||routeLocale||map[document.documentElement.lang.toLowerCase()]||'en';
  const title=()=>window.WEIGHTPLAY_GAME_TITLES?.[id]?.[locale]||'';
  window.WeightPlayOfficialName={title};
  let observer,labels=[];
  const sync=()=>{
    if(!routeLocale&&!queryLocale)locale=map[document.documentElement.lang.toLowerCase()]||locale;
    const name=title();if(!name)return;
    const normalized=map[document.documentElement.lang.toLowerCase()];
    if(normalized===locale&&document.documentElement.lang!==normalized)document.documentElement.lang=normalized;
    const browserTitle=`${name} | WeightPlay`;
    if(document.title!==browserTitle)document.title=browserTitle;
    for(const node of labels){node.dataset.runtimeLocalize='off';if(node.textContent.trim()!==name)node.textContent=name;}
    for(const node of document.querySelectorAll('meta[property="og:title"],meta[name="twitter:title"]'))if(node.content!==browserTitle)node.content=browserTitle;
  };
  const connect=()=>{
    observer?.disconnect();
    labels=[...document.querySelectorAll('[data-wp-game-title]')];
    const node=document.querySelector('title');if(node)node.dataset.runtimeLocalize='off';
    observer ||= new MutationObserver(sync);
    for(const element of [...labels,...(node?[node]:[])])observer.observe(element,{childList:true,subtree:true,characterData:true});
    if(!routeLocale&&!queryLocale)observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    sync();
  };
  document.addEventListener('change',event=>{
    const select=event.target;
    if(select instanceof HTMLSelectElement && select.querySelector('option[value="en"]') && (select.querySelector('option[value="zh-Hant"]')||select.querySelector('option[value="zh-TW"]'))){
      const next=map[select.value.toLowerCase()];if(next){locale=next;sync();}
    }
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connect,{once:true});else connect();
  window.addEventListener('pagehide',()=>observer?.disconnect());
  window.addEventListener('pageshow',connect);
})();
