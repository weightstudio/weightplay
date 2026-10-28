import { CAMPAIGN_STAGES } from './campaign.mjs';

const POSTER = '/assets/interface7-redrawn/minefield-logic.webp';
const fill = (value, data) => value.replace(/\{(\w+)\}/g, (_, key) => String(data[key] ?? ''));

/** Minefield owns the authored campaign facts; shared Play UI owns their presentation. */
export function createMinefieldStageConfig({ copy, records, isPractice = () => false }) {
  if (!copy?.campaign || !records?.campaign) throw new TypeError('MINEFIELD_STAGE_CONFIG_REQUIRED');
  return Object.freeze({
    gameId: 'minefield-logic',
    count: CAMPAIGN_STAGES.length,
    poster: POSTER,
    background: POSTER,
    stage(index) {
      const stage = CAMPAIGN_STAGES[index];
      if (!stage) throw new RangeError(`MINEFIELD_STAGE_INDEX:${index}`);
      const campaign = copy.campaign;
      const cleared = records.campaign.completedStages.includes(stage.id);
      const locked = !isPractice() && stage.id > records.campaign.unlockedStage;
      const state = cleared ? campaign.cleared : locked ? campaign.locked : campaign.unlocked;
      const stageTitle = fill(campaign.stage, { n: stage.id });
      const arc = fill(campaign.arc, { n: stage.arc });
      const board = fill(campaign.battle, { n: stage.id, mines: stage.mines.length });
      return {
        id: stage.id,
        kicker: arc,
        title: stageTitle,
        subtitle: `${stage.mines.length} ${copy.mines}`,
        status: [state, stage.checkpoint ? campaign.checkpoint : ''].filter(Boolean).join(' · '),
        summary: campaign.mapIntro,
        details: [board, campaign.mapIntro],
        locked,
        cleared,
        poster: POSTER,
      };
    },
  });
}
