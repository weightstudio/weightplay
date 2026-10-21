/* Frost Maze's I9 Stage data; shared Play UI owns all Stage markup and input. */
(() => {
  'use strict';
  const POSTER = '/assets/interface7-redrawn/animal-frost-maze.webp';
  const BACKGROUND = '/assets/lobby-block-atmosphere.svg';
  const STAGES = 30;

  function create({getLocale,getBestGrades,getRules,getStageCopy,getMasteryCopy,getChapterName,getStageLabel,getRoomLabel}) {
    for (const [name,callback] of Object.entries({getLocale,getBestGrades,getRules,getStageCopy,getMasteryCopy,getChapterName,getStageLabel,getRoomLabel})) {
      if (typeof callback !== 'function') throw new TypeError(`FROST_STAGE_CONFIG_${name.toUpperCase()}_REQUIRED`);
    }
    return Object.freeze({
      gameId: 'animal-frost-maze',
      count: STAGES,
      poster: POSTER,
      background: BACKGROUND,
      stage(index) {
        if (!Number.isInteger(index) || index < 0 || index >= STAGES) throw new RangeError(`FROST_STAGE_INDEX:${index}`);
        const id = index + 1;
        const chapter = Math.floor(index / 5) + 1;
        const room = index % 5 + 1;
        const grades = getBestGrades() || {};
        const rules = getRules(id);
        const stageCopy = getStageCopy();
        const masteryCopy = getMasteryCopy();
        const stars = '★'.repeat(grades[id] || 0) + '☆'.repeat(3 - (grades[id] || 0));
        const chapterTitle = getChapterName(chapter, stageCopy);
        const chapterLabel = `${stageCopy.chapter} ${chapter}${stageCopy.chapterSuffix || ''}`;
        const roomLabel = `${getRoomLabel()} ${room}`;
        const specialRules = [rules.echo ? masteryCopy[4] : '', rules.home ? masteryCopy[5] : ''].filter(Boolean);
        return {
          id,
          kicker: `${getStageLabel()} ${id}`,
          title: chapterTitle,
          subtitle: `${chapterLabel} · ${roomLabel}`,
          status: `${masteryCopy[6]} ${stars}`,
          summary: `${masteryCopy[2]}: ${rules.edits} · ${masteryCopy[3]}: ${rules.steps}`,
          details: specialRules,
          locked: false,
          cleared: Boolean(grades[id]),
          poster: POSTER,
        };
      },
    });
  }

  window.FrostMazeStageConfig = Object.freeze({create});
})();
