(() => {
  const base = document.currentScript.src;
  import(new URL('campaign-entry.mjs?v=20260909-mahjong-campaign-v14',base).href).then(({mountMahjongEntry}) => {
    const container=document.querySelector('#mahjongCampaign'),placeholder=container?.querySelector('[data-mjc-static]');
    if(!container||!placeholder)throw new Error('Campaign locale shell missing');
    let storage;try{storage=window.localStorage}catch{storage={getItem(){throw Error('Unavailable')},setItem(){throw Error('Unavailable')}}}
    const fragment=document.createDocumentFragment();fragment.append(placeholder);
    try{mountMahjongEntry({container,locale:document.documentElement.lang,storage,titles:window.WEIGHTPLAY_GAME_TITLES['mahjong-solitaire']});document.body.dataset.campaignReady='true';}
    catch(error){container.replaceChildren(fragment);throw error;}
  }).catch(error => {
    document.body.dataset.campaignReady='failed';console.error('Mahjong campaign initialization failed',error);
  });
})();
