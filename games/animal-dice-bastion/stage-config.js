/* Stage records only. WeightPlay Play UI owns cards, layout, pooling and gestures. */
window.AnimalDiceBastionStageConfig = ({stages, getSave, text}) => ({
  count: stages.length,
  poster: '/assets/animal-dice-bastion/cover.webp',
  background: '/assets/lobby-block-atmosphere.svg',
  stage(index) {
    const stage = stages[index];
    const save = getSave();
    const stars = Number(save.stars[stage.n]) || 0;
    const cleared = Object.hasOwn(save.stars, stage.n);
    const locked = stage.n > save.unlocked;
    const chapter = stage.chapter + 1;
    const chapterName = text(`chapter${chapter}`);
    const rule = text(`rule${chapter}`);
    return {
      id: stage.n,
      kicker: stage.boss ? `${text('boss')} - ${chapterName}` : chapterName,
      title: text('stage', {stage: stage.n}),
      subtitle: text(stage.threat),
      status: locked ? text('locked') : '★'.repeat(stars) + '☆'.repeat(Math.max(0, 3 - stars)),
      summary: text(stage.plan),
      details: [rule, text(stage.threat), text(stage.plan), text('rewardDust', {dust: stage.reward})],
      locked,
      cleared,
    };
  },
});
