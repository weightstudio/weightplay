(() => {
  const canvas = document.querySelector("#game");
  const wrap = document.querySelector(".canvas-wrap");
  function fit() {
    if (!canvas || !wrap) return;
    const box = wrap.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const scale = Math.min(box.width / 390, box.height / 560);
    canvas.style.width = `${390 * scale}px`;
    canvas.style.height = `${560 * scale}px`;
  }
  new ResizeObserver(fit).observe(wrap);
  window.addEventListener("resize", fit);
  requestAnimationFrame(fit);
})();
