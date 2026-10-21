/* Stage records only. The shared Play UI owns posters, sizing, pooling,
   gesture, snapping, and the common Block Arcade atmosphere. */
window.AnimalHabitatBuilderStageConfig = ({ profiles, best, copy, common, words }) => {
  const poster = "/games/animal-habitat-builder/assets/animal-habitat-builder-cover.png";
  return {
    gameId: "animal-habitat-builder",
    count: profiles.length,
    poster,
    background: "/assets/lobby-block-atmosphere.svg",
    stage(index) {
      const profile = profiles[index];
      const clearedThrough = Number(best()) || 0;
      const locked = index > clearedThrough;
      const title = `${common(9)} ${index + 1}`;
      const tileTargets = profile.need
        .map((count, tile) => `${words().tiles[tile]} ${count}`)
        .join(" · ");
      return {
        id: index + 1,
        kicker: `${words().title} · ${Math.floor(index / 5) + 1}/6`,
        title,
        subtitle: profile.badge,
        status: locked ? "🔒" : index < clearedThrough ? "✓" : "",
        summary: `${copy().quantity} · ${profile.limit} ${copy().moves}`,
        details: [tileTargets, `${copy().moves}: ${profile.limit}`],
        poster,
        posterPosition: "50% 50%",
        locked,
        cleared: index < clearedThrough,
      };
    },
  };
};
