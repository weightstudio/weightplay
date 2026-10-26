/* Game data only. Shared PlayUI owns the cards, pool, sizing and gestures. */
(() => {
  const navigation = {
    en: ['Missions','Gadgets'], 'zh-Hant': ['關卡','裝置'], 'zh-Hans': ['关卡','装置'],
    ja: ['ステージ','装置'], ko: ['스테이지','장치'], es: ['Misiones','Equipo'],
    'pt-BR': ['Missões','Itens'], fr: ['Missions','Outils'], de: ['Missionen','Geräte'],
    it: ['Missioni','Oggetti'], ru: ['Задания','Снаряжение'], hi: ['मिशन','उपकरण'], ar: ['المهام','الأدوات'],
  };
  window.WeightPlayMoonlightStageConfig = Object.freeze({
    labels(locale) { const [stages,gadgets]=navigation[locale]||navigation.en;return {stages,gadgets,...(locale==='ru'?{missions:'Задания',next:'Далее',retry:'Ещё раз'}:{})}; },
    create({campaign,getState,t,campaignText,medalProgress}) {
      return {gameId:'animal-moonlight-heist',count:campaign.length,
        poster:'/assets/interface7-redrawn/animal-moonlight-heist.webp',background:'/assets/lobby-block-atmosphere.svg',
        stage(index) {
          const mission=campaign[index],state=getState(),locked=index+1>state.unlocked;
          const tradeoff=t(mission.order==='treasure-first'?'treasureSealPlan':'treasureTradeoff');
          return {id:index+1,kicker:`${t('mission',{n:index+1})} / ${campaign.length}`,title:campaignText(mission.name),
            subtitle:mission.guardian?`${t('checkpoint')} · ${campaignText(mission.guardian.name)}`:'',
            status:locked?t('locked'):medalProgress(index).visible,summary:campaignText(mission.rule),
            details:[campaignText(mission.rule),tradeoff,locked?t('locked'):medalProgress(index).accessible],
            locked,cleared:Boolean(state.cleared[index])};
        }};
    },
  });
})();
