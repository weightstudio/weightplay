(() => {
  window.AnimalColoringStudioStageConfig = Object.freeze({
    create({records, background = "/assets/lobby-block-atmosphere.svg"}) {
      if (!Array.isArray(records) || records.length < 1) {
        throw new TypeError("ANIMAL_COLORING_STUDIO_STAGE_RECORDS_REQUIRED");
      }
      const stages = records.map((record) => Object.freeze({...record}));
      return Object.freeze({
        gameId: "animal-coloring-studio",
        count: stages.length,
        poster: "/assets/animal-coloring-studio-cover.webp",
        background,
        stage(index) {
          const record = stages[index];
          if (!record) throw new RangeError(`ANIMAL_COLORING_STUDIO_STAGE_INDEX:${index}`);
          return record;
        },
      });
    },
  });
})();
