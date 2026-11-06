export function stageConfig({stages,t,save,practice,practiceEnabled,collection}){
  return {gameId:'tideweave',count:stages.length,poster:'/games/tideweave/assets/thumb.webp?wp-media=bd681b90e84172d9',background:'/assets/lobby-block-atmosphere.svg',stage(i){
    const b=stages[i],locked=!(practice&&practiceEnabled())&&i>=save.unlocked;
    const rule=b.fork?'forkRule':b.pairs.length?'pairRule':b.edges.some(e=>e.tide)?'tideRule':b.edges.some(e=>e.max===0)?'reefRule':b.edges.some(e=>e.max===1)?'narrowRule':'baseRule';
    return {id:b.id,kicker:t('progress',{n:b.id}),title:t(b.fork?'checkpoint':'mechanic'),subtitle:t('chapter',{n:b.chapter}),status:locked?t('locked'):save.value.cleared[i]?t('stars',{n:save.value.stars[i]}):'',summary:t(rule),details:[t('baseRule')],locked,cleared:save.value.cleared[i],rewardState:practice?'unknown':collection(b.id)};
  }};
}
