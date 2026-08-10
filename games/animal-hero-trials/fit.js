(() => {
  const canvas = document.querySelector("#game");
  const wrap = document.querySelector(".canvas-wrap");
  const LOGICAL_WIDTH = 460;
  const LOGICAL_HEIGHT = 560;
  function fit() {
    if (!canvas || !wrap) return;
    const box = wrap.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const owner = wrap.closest("[data-wp-logical-battle-canvas]");
    const ownerBox = owner?.getBoundingClientRect();
    const ownerLayoutWidth = owner?.offsetWidth || ownerBox?.width || 0;
    const ownerScale = ownerBox?.width && ownerLayoutWidth ? ownerBox.width / ownerLayoutWidth : 1;
    const safeScale = Number.isFinite(ownerScale) && ownerScale > 0 ? ownerScale : 1;
    const scale = Math.min(box.width / (LOGICAL_WIDTH * safeScale), box.height / (LOGICAL_HEIGHT * safeScale));
    canvas.style.width = `${LOGICAL_WIDTH * scale}px`;
    canvas.style.height = `${LOGICAL_HEIGHT * scale}px`;
  }
  new ResizeObserver(fit).observe(wrap);
  window.addEventListener("resize", fit);
  requestAnimationFrame(fit);
})();
