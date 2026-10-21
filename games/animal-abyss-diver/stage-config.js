/* Abyss Diver contributes route content only; shared Play UI owns Stage DOM,
   card sizing, selection, touch, pointer and keyboard behavior. */
(() => {
  "use strict";

  window.WeightPlayAbyssDiverStageConfig = Object.freeze({
    create({ routes, unlocked, t, routeText, routeMeta }) {
      if (!Array.isArray(routes) || typeof unlocked !== "function"
          || typeof t !== "function" || typeof routeText !== "function") {
        throw new TypeError("ABYSS_DIVER_STAGE_CONTENT_REQUIRED");
      }
      return {
        count: routes.length,
        gameId: "animal-abyss-diver",
        poster: "/games/animal-abyss-diver/art/cover.webp",
        background: "/assets/lobby-block-atmosphere.svg",
        stage(index) {
          const route = routes[index];
          if (!route) throw new RangeError(`ABYSS_DIVER_ROUTE_NOT_FOUND:${index}`);
          const number = index + 1;
          const locked = number > unlocked();
          return {
            id: number,
            kicker: t("route", { n: number }),
            title: routeText(route, "name"),
            subtitle: `${t("relic")}: ${routeText(route, "relic")}`,
            status: locked ? t("locked") : t("routeAction"),
            summary: routeText(route, "rule"),
            details: [routeMeta?.(route), routeText(route, "rule")],
            poster: "/games/animal-abyss-diver/art/cover.webp",
            posterPosition: "center",
            locked,
            cleared: number < unlocked(),
          };
        },
      };
    },
  });
})();
