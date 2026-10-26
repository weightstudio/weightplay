// Optional records never participate in stage-clear or medal rules.
export function tacticalChallenge(number,result=null,save=null){
  if(number!==6&&number!==15)return null;
  const passGoal=number===6,id=`meadow-${String(number).padStart(2,'0')}`;
  const value=result?.[passGoal?'forwardPasses':'receiversCaught'];
  const current=Number.isSafeInteger(value)&&value>=1&&value<=(passGoal?512:3)?value:null;
  const best=save?.[passGoal?'bestForwardPassesByStage':'bestReceiversByStage']?.[id]??null;
  return {goal:passGoal?'challenge6':'challenge15',currentKey:passGoal?'runPasses':'runReceivers',bestKey:passGoal?'bestPasses':'bestReceivers',current,best,
    reached:result?.won===true&&current!==null&&(passGoal?current===1:current===3),
    completed:save?.completedStageIds?.includes(id)===true&&best!==null&&(passGoal?best===1:best===3)};
}
