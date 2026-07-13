(() => {
  const MENU_LOGICAL_WIDTH = 390;
  const MENU_LOGICAL_HEIGHT = MENU_LOGICAL_WIDTH * 16 / 9;
  const BATTLE_LOGICAL_WIDTH = 390;
  const BATTLE_LOGICAL_HEIGHT = 788;
  const AD_RESERVE_HEIGHT = 56;

  function updateViewport() {
    const viewport = window.visualViewport;
    const width = viewport?.width >= window.innerWidth * 0.75 ? viewport.width : window.innerWidth;
    const height = viewport?.height >= window.innerHeight * 0.75 ? viewport.height : window.innerHeight;
    document.documentElement.style.setProperty("--wonder-vw", `${width}px`);
    document.documentElement.style.setProperty("--wonder-vh", `${height}px`);
    const stageActive = document.body.classList.contains("wonder-stage-select");
    const playing = document.body.classList.contains("wonder-playing");
    const menuHeight = Math.max(1, height - (stageActive ? AD_RESERVE_HEIGHT : 0));
    const menuScale = Math.min(width / MENU_LOGICAL_WIDTH, menuHeight / MENU_LOGICAL_HEIGHT);
    const battleScale = Math.min(
      Math.max(0, width - 8) / BATTLE_LOGICAL_WIDTH,
      Math.max(0, height - AD_RESERVE_HEIGHT - 8) / BATTLE_LOGICAL_HEIGHT
    );
    document.documentElement.style.setProperty("--wonder-shell-scale", String(menuScale));
    document.documentElement.style.setProperty("--wonder-menu-rendered-width", `${MENU_LOGICAL_WIDTH * menuScale}px`);
    document.documentElement.style.setProperty("--wonder-menu-rendered-height", `${MENU_LOGICAL_HEIGHT * menuScale}px`);
    if (playing) document.documentElement.style.setProperty("--wonder-battle-scale", String(battleScale));
  }

  updateViewport();
  window.addEventListener("resize", updateViewport, { passive: true });
  window.visualViewport?.addEventListener("resize", updateViewport, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateViewport, { passive: true });
  new MutationObserver(updateViewport).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  const stageRail = document.querySelector("#levelGrid");
  if (stageRail) {
    stageRail.addEventListener("dragstart", (event) => event.preventDefault());
    let pointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let dragged = false;
    let suppressClickUntil = 0;
    let wheelSnapTimer = 0;

    const snapToNearestCard = (behavior = "smooth") => {
      const cards = [...stageRail.querySelectorAll("button[data-level]")];
      if (!cards.length) return;
      const railCenter = stageRail.scrollLeft + stageRail.clientWidth / 2;
      const nearest = cards.reduce((best, card) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        return Math.abs(center - railCenter) < Math.abs(best.center - railCenter) ? { card, center } : best;
      }, { card: cards[0], center: cards[0].offsetLeft + cards[0].offsetWidth / 2 }).card;
      const targetLeft = Math.max(0, Math.min(
        nearest.offsetLeft + nearest.offsetWidth / 2 - stageRail.clientWidth / 2,
        stageRail.scrollWidth - stageRail.clientWidth
      ));
      stageRail.scrollTo({ left: targetLeft, behavior });
    };

    stageRail.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = stageRail.scrollLeft;
      dragged = false;
      suppressClickUntil = 0;
      stageRail.classList.add("is-mouse-dragging");
    });

    stageRail.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 5 && !dragged) {
        dragged = true;
        stageRail.setPointerCapture(pointerId);
      }
      if (!dragged) return;
      event.preventDefault();
      stageRail.scrollLeft = startScrollLeft - delta;
    });

    const finishMouseDrag = (event) => {
      if (event.pointerId !== pointerId) return;
      if (stageRail.hasPointerCapture(pointerId)) stageRail.releasePointerCapture(pointerId);
      pointerId = null;
      stageRail.classList.remove("is-mouse-dragging");
      suppressClickUntil = dragged ? performance.now() + 90 : 0;
      if (dragged) requestAnimationFrame(() => snapToNearestCard());
    };
    stageRail.addEventListener("pointerup", finishMouseDrag);
    stageRail.addEventListener("pointercancel", finishMouseDrag);
    stageRail.addEventListener("click", (event) => {
      if (performance.now() > suppressClickUntil) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClickUntil = 0;
      dragged = false;
    }, true);

    stageRail.addEventListener("wheel", (event) => {
      if (stageRail.scrollWidth <= stageRail.clientWidth) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      stageRail.scrollLeft += delta;
      window.clearTimeout(wheelSnapTimer);
      wheelSnapTimer = window.setTimeout(() => snapToNearestCard(), 90);
    }, { passive: false });
  }
})();
