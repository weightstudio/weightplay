/* Spectrum Pulse Stage records; the shared Play UI owns card geometry and input. */
(() => {
  "use strict";

  const POSTER = "/assets/interface7-redrawn/animal-spectrum-pulse.webp?v=20261013-spectrum-v22";
  const BACKGROUND = "/assets/lobby-block-atmosphere.svg";

  window.AnimalSpectrumPulseStageConfig = Object.freeze({
    create({ towers, getSave, text }) {
      if (!Array.isArray(towers) || towers.length !== 30 || typeof getSave !== "function" || typeof text !== "function") {
        throw new TypeError("SPECTRUM_PULSE_STAGE_CONFIG_REQUIRED");
      }
      return Object.freeze({
        count: towers.length,
        poster: POSTER,
        background: BACKGROUND,
        stage(index) {
          const tower = towers[index];
          if (!tower) throw new RangeError(`SPECTRUM_PULSE_STAGE_INDEX:${index}`);
          const save = getSave();
          const number = index + 1;
          const locked = number > Math.max(1, Math.min(30, Number(save.unlocked) || 1));
          const medal = Math.max(0, Math.min(3, Number(save.medals?.[index]) || 0));
          const best = Math.max(0, Number(save.best?.[index]) || 0);
          const status = locked
            ? text("locked")
            : medal
              ? `★ ${medal}`
              : text("target", { n: tower.gates.length });
          const details = [
            text(index % 5 === 4 ? "bossWarning" : "missionRule"),
            best ? text("best", { n: best.toFixed(1) }) : "",
          ].filter(Boolean);
          return {
            id: index,
            kicker: text("chapter", { n: tower.chapter + 1 }),
            title: text("tower", { n: number }),
            subtitle: text("chapters")[tower.chapter],
            status,
            summary: tower.rule,
            details,
            locked,
            cleared: medal > 0,
            poster: POSTER,
            posterPosition: "center",
          };
        },
      });
    },
  });
})();
