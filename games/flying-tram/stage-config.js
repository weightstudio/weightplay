/* The shared I9 Play UI owns cards, geometry, pooling, and gestures. */
window.FlyingTramStageConfig = ({save, text}) => ({
  count: 3,
  poster: "/games/flying-tram/assets/cover-block-v1.webp",
  stage(index) {
    const data = save();
    const route = text("routes")[index];
    const best = data.best[index];
    const locked = index > data.unlocked;
    return {
      id: index + 1,
      kicker: text("routeKicker", {n: index + 1}),
      title: route.name,
      subtitle: route.subtitle,
      status: locked ? text("locked") : best ? text("bestPoints", {n: best}) : text("ready"),
      summary: route.rule,
      details: [route.rule, text("routeTime", {n: route.time})],
      locked,
      cleared: Boolean(best),
      posterPosition: ["52% 46%", "50% 50%", "50% 54%"][index],
    };
  },
});
