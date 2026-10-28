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
