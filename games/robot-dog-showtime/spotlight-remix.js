export const spotlightStageIds = Object.freeze([2, 3, 6]);

export function spotlightGoals(goals) {
  if (!Array.isArray(goals) || goals.length !== 2) throw new TypeError("TWO_PERFORMER_GOALS_REQUIRED");
  return [goals[1], goals[0]];
}

export function spotlightAvailable(stageId, cleared) {
  return spotlightStageIds.includes(stageId) && Array.isArray(cleared) && cleared.includes(stageId);
}
