(() => {
  const canvas = document.querySelector("#game");
  const wrap = document.querySelector(".canvas-wrap");
  function fit() {
    if (!canvas || !wrap) return;
    const box = wrap.getBoundingClientRect();
    if (!box.width || !box.height) return;
    // The frame owns layout; game.js resizes the camera and actual buffer.
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }
  new ResizeObserver(fit).observe(wrap);
  window.addEventListener("resize", fit);
  requestAnimationFrame(fit);
})();
