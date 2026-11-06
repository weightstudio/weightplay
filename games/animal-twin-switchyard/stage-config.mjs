export function createStageConfig({stages,text,title,best,unlocked,checkpoint}) {
  return {count:stages.length,poster:'/assets/interface7-redrawn/animal-twin-switchyard.webp?wp-media=11c5087d8fd3a80f',background:'/assets/lobby-block-atmosphere.svg',stage(index){
    const open=index<unlocked(),record=best(index);
    return{id:index+1,title:title(index),kicker:(index+1)%5===0?checkpoint(index):'',subtitle:record?`${text('bestStat')}: ${record}`:'',summary:open?text('objective'):text('stageHelp'),details:[text('objective')],poster:'/assets/interface7-redrawn/animal-twin-switchyard.webp?wp-media=11c5087d8fd3a80f',locked:!open,cleared:record>0};
  }};
}
