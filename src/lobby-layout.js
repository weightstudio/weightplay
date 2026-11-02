/* Small, dependency-free first-paint layout. The runtime reuses this owner;
   moving the original controls preserves focus, state and breakpoint order. */
(() => {
  let instance;
  function setup(hooks = {}) {
    if (instance) { Object.assign(instance.hooks, hooks); return; }
    const shell = document.querySelector('.general-lobby-page .lobby-shell');
    if (!shell || !document.querySelector('[data-lobby-layout-anchor]')) return;
    const topbar = shell.querySelector('.lobby-topbar');
    const rail = shell.querySelector('.desktop-filter-rail');
    const selectors = ['.game-hall-switch', '.lobby-search-row', '.lobby-hero', '.demon-event-preview', '.lobby-shell > .library-tabs'];
    const nodes = selectors.map(selector => document.querySelector(selector));
    if (nodes.some(node => !node)) return;
    const [halls, search, hero, activities, library] = nodes;
    const initialStage = shell.querySelector('[data-lobby-initial-stage]');
    if (initialStage) initialStage.before(halls);
    else hero.before(halls);
    const homes = nodes.map(node => {
      const home = document.createComment('lobby layout home');
      if (initialStage && (node === hero || node === activities)) initialStage.before(home);
      else node.before(home);
      return home;
    });
    const stage = initialStage || document.createElement('div');
    stage.className = 'desktop-lobby-stage';
    const query = window.matchMedia('(min-width: 1120px)');
    instance = { hooks, desktop: undefined };
    const apply = () => {
      if (instance.desktop === query.matches) return;
      instance.hooks.beforeChange?.();
      const focused = document.activeElement;
      // The activity controller replaces the inert first-response entries.
      const currentActivities = shell.querySelector('.demon-event-preview') || activities;
      if (query.matches) {
        const preferences = topbar.querySelector('.lobby-preferences, .language-picker');
        topbar.insertBefore(halls, preferences);
        topbar.insertBefore(search, preferences);
        homes[2].before(stage);
        stage.append(hero, currentActivities);
        rail.append(library);
        library.classList.add('desktop-library');
        document.body.dataset.desktopLobby = 'true';
      } else {
        [halls, search, hero, currentActivities, library].forEach((node, index) => homes[index].after(node));
        library.classList.remove('desktop-library');
        stage.remove();
        delete document.body.dataset.desktopLobby;
      }
      instance.desktop = query.matches;
      document.documentElement.dataset.lobbyLayoutReady = 'true';
      if (focused?.isConnected && document.activeElement !== focused) focused.focus({ preventScroll: true });
      instance.hooks.afterChange?.();
    };
    query.addEventListener('change', apply);
    apply();
  }
  window.WeightPlayLobbyLayout = { setup };
  const observer = new MutationObserver(() => {
    setup();
    if (instance) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setup();
})();
