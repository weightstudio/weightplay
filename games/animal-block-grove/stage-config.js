(() => {
  "use strict";

  const poster = "/assets/animal-block-grove-cover.webp";

  window.AnimalBlockGroveStageConfig = Object.freeze({
    create({ mode, missions, save, copy }) {
      const challenge = mode === "challenge";
      return {
        gameId: "animal-block-grove",
        count: challenge ? 1 : missions.length,
        poster,
        background: "/assets/lobby-block-atmosphere.svg",
        stage(index) {
          if (challenge) {
            const best = Number(save.infiniteBest || 0);
            const rule = copy("infiniteRule");
            return {
              id: "infinite",
              kicker: copy("challengeMode"),
              title: copy("infinite"),
              subtitle: rule,
              status: copy("best", { score: best }),
              summary: rule,
              details: [copy("infiniteText", { moves: 0, score: best })],
              locked: false,
              cleared: best > 0,
              poster,
            };
          }

          const mission = missions[index];
          const chapter = mission.chapter;
          const cleared = Boolean(save.cleared?.[index]);
          const locked = index >= Number(save.unlocked || 1);
          const stars = Number(save.stars?.[index] || 0);
          const best = Number(save.best?.[index] || 0);
          const chapterTitle = copy("chapterTitles")[chapter];
          const chapterRule = copy("chapterRules")[chapter];
          const goals = mission.goals;
          const requirements = [];
          if (goals.lines) requirements.push(copy("goalLines", { now: 0, goal: goals.lines }));
          if (goals.score) requirements.push(copy("goalScore", { now: 0, goal: goals.score }));
          if (goals.marks) requirements.push(copy("goalMarks", { now: 0, goal: goals.marks }));
          if (goals.acorns) requirements.push(copy("goalAcorns", { now: 0, goal: goals.acorns }));
          if (goals.stones) requirements.push(copy("goalStones", { now: 0, goal: goals.stones }));
          if (goals.cross) requirements.push(copy("goalCross", { now: 0, goal: goals.cross }));
          const record = {
            id: index + 1,
            kicker: copy("chapter", { chapter: chapter + 1 }),
            title: copy("mission", { stage: index + 1 }),
            subtitle: chapterTitle,
            status: locked ? copy("locked") : `${copy("best", { score: best })} · ${"★".repeat(stars)}${"☆".repeat(3 - stars)}`,
            summary: copy("placements", { used: 0, limit: mission.limit }),
            details: [chapterRule, ...requirements],
            locked,
            cleared,
            poster,
          };
          return record;
        },
      };
    },
  });
})();
