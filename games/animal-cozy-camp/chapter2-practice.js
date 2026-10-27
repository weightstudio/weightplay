(function (root) {
  'use strict';
  // This adapter is used only after the shared localhost practice challenge.
  // It never reads or writes storage and cannot enable the formal campaign.
  function create(base, chapter) {
    if (!base || !chapter || chapter.ready !== false || chapter.stages.length !== 30) throw Error('INVALID_COZY_PRACTICE_CONTENT');
    const stages=Object.freeze([...base.stages,...chapter.stages.map(stage=>Object.freeze({...stage,chapter2:true,patternIndex:0,rotation:0}))]);
    function normalizeProgress(value){
      const original=base.normalizeProgress(value), extra=new Set((Array.isArray(value?.completedIds)?value.completedIds:[]).filter(id=>chapter.stages.some(stage=>stage.id===id)));
      const completedIds=[...original.completedIds,...chapter.stages.filter(stage=>extra.has(stage.id)).map(stage=>stage.id)];
      const bestChecksByStage={...original.bestChecksByStage};
      for(const stage of chapter.stages){const valueForStage=Number(value?.bestChecksByStage?.[stage.id]);if(Number.isSafeInteger(valueForStage)&&valueForStage>0)bestChecksByStage[stage.id]=valueForStage;}
      return {schema:1,completedIds,bestChecksByStage};
    }
    function completeStage(progress,id,checks){
      const next=normalizeProgress(progress),stage=stages.find(item=>item.id===id);if(!stage)return next;
      if(!next.completedIds.includes(id))next.completedIds.push(id);
      const score=Number(checks);if(Number.isSafeInteger(score)&&score>0){const old=next.bestChecksByStage[id];if(!old||score<old)next.bestChecksByStage[id]=score;}
      return normalizeProgress(next);
    }
    return Object.freeze({...base,STAGE_COUNT:stages.length,stages,normalizeProgress,completeStage,isUnlocked:(_progress,index)=>Number.isInteger(index)&&index>=0&&index<stages.length,highestUnlockedIndex:()=>stages.length-1,saveProgress:()=>false});
  }
  root.AnimalCozyCampChapter2Practice=Object.freeze({create});
})(window);
