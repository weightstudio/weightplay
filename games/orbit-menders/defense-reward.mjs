// The first-clear reward is eligible only after the game's own save succeeds.
export function saveDefenseVictory(save, run, operationId, analytics) {
  const persisted = save.commit(d => {
    if (!d.defense.completed.includes(operationId)) d.defense.completed.push(operationId);
    const prior = d.defense.best[operationId];
    if (!prior || run.score > prior.score) {
      d.defense.best[operationId] = {
        score: run.score,
        health: Math.max(0, run.towerHP / run.maxHP),
        time: run.time,
      };
    }
  });
  if (persisted) analytics?.completeStage?.(operationId);
  return persisted;
}

// Training is soft currency earned by this actual settled run, including losses.
// This transaction does not award shared first-clear currency on failure.
export function settleDefenseTraining(save,run){
 const result=run.result;if(!result||!['won','lost'].includes(result.state))return {awarded:0,persisted:false};
 if(save.data.defense.training.receipts.includes(result.runId))return {awarded:0,persisted:save.status.persistent};
 const persisted=save.commit(d=>{const training=d.defense.training;if(training.receipts.includes(result.runId))return;training.gears+=result.gears;training.earned+=result.gears;training.receipts.push(result.runId);training.receipts=training.receipts.slice(-128);});
 return {awarded:result.gears,persisted};
}
