const POSTER = '/assets/lobby-thumbs/w480/games__animal-moonlight-workshop__assets__animal-moonlight-workshop-cover.webp';
const BACKGROUND = '/assets/lobby-block-atmosphere.svg';

export function createMoonlightWorkshopStageConfig({ profiles, getState }) {
  if (!Array.isArray(profiles) || profiles.length !== 6 || typeof getState !== 'function') {
    throw new TypeError('MOONLIGHT_WORKSHOP_STAGE_CONFIG_REQUIRED');
  }

  return Object.freeze({
    gameId: 'animal-moonlight-workshop',
    count: profiles.length,
    poster: POSTER,
    background: BACKGROUND,
    stage(index) {
      const profile = profiles[index];
      if (!profile) throw new RangeError(`MOONLIGHT_WORKSHOP_STAGE_INDEX:${index}`);
      const state = getState();
      const number = index + 1;
      const cleared = number <= state.best;
      const record = Number(state.records?.[number]);
      const summary = `${profile.switches.length} ${state.switchLabel} · ${profile.limit} ${state.moveLabel}`;
      return {
        id: number,
        kicker: `${state.stageLabel} ${number}`,
        title: state.names[index] || `${state.stageLabel} ${number}`,
        subtitle: state.mechanics[index] || '',
        status: cleared && Number.isFinite(record) && record > 0
          ? `${state.bestLabel} ${record} / ${profile.limit}`
          : '',
        summary,
        details: [state.mechanics[index], summary].filter(Boolean),
        locked: number > state.best + 1,
        cleared,
        poster: POSTER,
      };
    },
  });
}
