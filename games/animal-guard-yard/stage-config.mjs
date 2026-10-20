const POSTER = "/assets/interface7-redrawn/animal-guard-yard.webp";
const BACKGROUND = "/assets/lobby-block-atmosphere.svg";

export function createGuardYardStageConfig({ stages, getUnlocked, getRecord, copy, text, threatLabels }) {
  if (!Array.isArray(stages) || !stages.length
      || typeof getUnlocked !== "function"
      || typeof getRecord !== "function"
      || typeof copy !== "function"
      || typeof text !== "function"
      || typeof threatLabels !== "function") {
    throw new TypeError("GUARD_YARD_STAGE_CONFIG_REQUIRED");
  }

  return Object.freeze({
    count: stages.length,
    poster: POSTER,
    background: BACKGROUND,
    stage(index) {
      const stage = stages[index];
      if (!stage) throw new RangeError(`GUARD_YARD_STAGE_INDEX:${index}`);
      const number = index + 1;
      const record = getRecord(number) || {};
      const bestScore = Math.max(0, Number(record.bestScore) || 0);
      const cleared = Boolean(record.cleared) || number <= Math.max(1, Number(getUnlocked()) || 1) - 1;
      const perfect = Boolean(record.perfect);
      const plan = copy(stage, "plan");
      const status = number > Math.max(1, Number(getUnlocked()) || 1)
        ? text("locked")
        : [
            cleared ? text("stageCleared") : "",
            perfect ? text("perfectBadge") : "",
            bestScore > 0 ? text("stageBest", { score: bestScore }) : "",
          ].filter(Boolean).join(" · ");
      const threats = threatLabels(stage);
      return {
        id: number,
        kicker: text("stage", { n: number }),
        title: copy(stage, "title"),
        subtitle: plan,
        status,
        summary: plan,
        details: threats,
        locked: number > Math.max(1, Number(getUnlocked()) || 1),
        cleared,
        poster: POSTER,
      };
    },
  });
}
