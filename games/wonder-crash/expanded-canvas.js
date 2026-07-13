(() => {
  function updateViewport() {
    const viewport = window.visualViewport;
    const width = viewport?.width >= window.innerWidth * 0.75 ? viewport.width : window.innerWidth;
    const height = viewport?.height >= window.innerHeight * 0.75 ? viewport.height : window.innerHeight;
    document.documentElement.style.setProperty("--wonder-vw", `${width}px`);
    document.documentElement.style.setProperty("--wonder-vh", `${height}px`);
  }

  updateViewport();
  window.addEventListener("resize", updateViewport, { passive: true });
  window.visualViewport?.addEventListener("resize", updateViewport, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateViewport, { passive: true });

  const stageRail = document.querySelector("#levelGrid");
  if (stageRail) {
    stageRail.addEventListener("dragstart", (event) => event.preventDefault());
    let pointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let dragged = false;

    stageRail.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = stageRail.scrollLeft;
      dragged = false;
      stageRail.setPointerCapture(pointerId);
      stageRail.classList.add("is-mouse-dragging");
    });

    stageRail.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 5) dragged = true;
      if (!dragged) return;
      event.preventDefault();
      stageRail.scrollLeft = startScrollLeft - delta;
    });

    const finishMouseDrag = (event) => {
      if (event.pointerId !== pointerId) return;
      if (stageRail.hasPointerCapture(pointerId)) stageRail.releasePointerCapture(pointerId);
      pointerId = null;
      stageRail.classList.remove("is-mouse-dragging");
    };
    stageRail.addEventListener("pointerup", finishMouseDrag);
    stageRail.addEventListener("pointercancel", finishMouseDrag);
    stageRail.addEventListener("click", (event) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    }, true);

    let mouseActive = false;
    stageRail.addEventListener("mousedown", (event) => {
      if (event.button !== 0) return;
      mouseActive = true;
      startX = event.clientX;
      startScrollLeft = stageRail.scrollLeft;
      dragged = false;
      stageRail.classList.add("is-mouse-dragging");
    });
    window.addEventListener("mousemove", (event) => {
      if (!mouseActive) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 5) dragged = true;
      if (!dragged) return;
      event.preventDefault();
      stageRail.scrollLeft = startScrollLeft - delta;
    }, { passive: false });
    window.addEventListener("mouseup", () => {
      if (!mouseActive) return;
      mouseActive = false;
      stageRail.classList.remove("is-mouse-dragging");
    });
  }
})();
