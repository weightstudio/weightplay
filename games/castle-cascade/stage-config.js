/* Castle Cascade content for the shared Interface 9 Stage selector. */
export function createCastleCascadeStageConfig({ levels, sieges, unlocked, text, number, objective, arcNames }) {
  return {
    count: levels.length,
    poster: "/assets/castle-cascade-poster.webp",
    background: "/games/castle-cascade/assets/castle-cascade-daylight-v2.webp",
    stage(index) {
      const level = levels[index];
      const siege = sieges[index];
      const chapter = Math.floor(index / 5);
      const locked = index >= unlocked();
      const moves = text("movesLeft", { count: number(level.moves) });
      const target = objective(level, index);
      return {
        id: index + 1,
        kicker: siege ? text("siegeTitle") : `${text("arc")} ${number(chapter + 1)}`,
        title: `${text("stage")} ${number(index + 1)}`,
        subtitle: siege ? target : arcNames()[chapter] || "",
        status: locked ? text("locked") : moves,
        summary: target,
        details: [moves, target],
        locked,
        cleared: index < unlocked() - 1,
        poster: siege
          ? "/games/castle-cascade/assets/siege-castle-v2.png"
          : "/assets/castle-cascade-poster.webp",
        posterPosition: siege ? "center" : "50% 32%",
      };
    },
  };
}
