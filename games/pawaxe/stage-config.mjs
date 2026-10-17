const POSTER='/assets/interface7-redrawn/pawaxe.webp';

export function createPawaxeStageConfig({stages,getText,getSave,isPractice,getStageName}) {
  if(!Array.isArray(stages)||typeof getText!=='function'||typeof getSave!=='function'||typeof isPractice!=='function'||typeof getStageName!=='function') {
    throw new TypeError('PAWAXE_STAGE_CONFIG_REQUIRED');
  }
  return Object.freeze({
    gameId:'pawaxe',
    count:stages.length,
    poster:POSTER,
    background:POSTER,
    stage(index) {
      const stage=stages[index];
      if(!stage)throw new RangeError(`PAWAXE_STAGE_INDEX:${index}`);
      const save=getSave(),practice=isPractice();
      const locked=!practice&&stage.id>save.unlocked;
      const status=practice?getText('ready'):locked?getText('locked'):save.cleared.includes(stage.id)?getText('cleared'):getText('ready');
      const landmark=getText(stage.checkpoint?'boss':'forest');
      return {
        id:stage.id,
        kicker:`${getText('stages')} ${stage.id}`,
        title:getStageName(stage),
        subtitle:landmark,
        status,
        summary:getText('stageHint'),
        details:[landmark,status],
        locked,
        cleared:save.cleared.includes(stage.id),
        poster:POSTER,
      };
    },
  });
}
