(() => {
  "use strict";
  const SVG = "http://www.w3.org/2000/svg";
  const palettes = {
    fox: ["#f59a55", "#773d44"], owl: ["#ae9ce6", "#514478"],
    rabbit: ["#eee5ff", "#8970b0"], deer: ["#e7ba7c", "#795443"],
    otter: ["#81cbd0", "#366d88"], hare: ["#e3bd8c", "#7b5b55"],
    bear: ["#d29983", "#704c57"], mole: ["#a0acc8", "#505f7d"],
  };
  const svgNode = (tag, attributes) => {
    const node = document.createElementNS(SVG, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };
  // Original geometric animals: distinct silhouettes and details, no reused atlas aliases.
  const animal = (name) => {
    const [fur, dark] = palettes[name] || palettes.owl;
    const svg = svgNode("svg", { viewBox: "0 0 40 40", "aria-hidden": "true", class: "ck-animal" });
    const rect = (x, y, width, height, fill) => svg.append(svgNode("rect", { x, y, width, height, fill }));
    if (["rabbit", "hare"].includes(name)) {
      rect(8, 0, 7, 17, fur); rect(25, name === "hare" ? 4 : 0, 7, 17, fur);
      rect(10, 3, 3, 10, "#d995b9"); rect(27, 6, 3, 7, "#d995b9");
    } else if (name === "deer") {
      rect(6, 0, 3, 14, dark); rect(3, 4, 9, 3, dark); rect(31, 0, 3, 14, dark); rect(28, 4, 9, 3, dark);
    } else {
      rect(5, 5, 9, 10, dark); rect(26, 5, 9, 10, dark);
      if (name === "fox") { rect(5, 1, 5, 8, fur); rect(30, 1, 5, 8, fur); }
    }
    rect(8, 13, 29, 23, dark); rect(4, 10, 29, 23, fur); rect(8, 30, 21, 7, dark);
    if (name === "owl") { rect(7, 15, 11, 12, "#e7ddff"); rect(20, 15, 11, 12, "#e7ddff"); }
    else { rect(9, 23, 19, 9, name === "mole" ? "#dbb2bc" : "#fff0d3"); }
    rect(10, 18, 4, 5, "#192336"); rect(24, 18, 4, 5, "#192336");
    rect(10, 18, 2, 2, "#fff"); rect(24, 18, 2, 2, "#fff");
    rect(17, 25, 5, name === "owl" ? 7 : 3, name === "owl" ? "#ffc86a" : "#563d55");
    if (name === "otter") { rect(4, 27, 10, 1, dark); rect(26, 27, 10, 1, dark); }
    if (name === "mole") { rect(7, 16, 11, 9, "#6885a8"); rect(21, 16, 11, 9, "#6885a8"); rect(15, 19, 9, 3, "#ced6e5"); }
    return svg;
  };
  const animations = new Set();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const animate = (node, frames, options) => {
    node.getAnimations().forEach(animation => animation.cancel());
    const animation = node.animate(frames, { ...options, duration: reduced.matches ? 100 : options.duration });
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    return animation;
  };
  const settle = () => { animations.forEach(animation => animation.cancel()); animations.clear(); document.querySelectorAll(".ck-particle").forEach(node => node.remove()); };
  document.addEventListener("visibilitychange", () => { if (document.hidden) settle(); });
  window.addEventListener("pagehide", settle);
  reduced.addEventListener("change", settle);

  const board = (option, map, t, clueIndex = -1, evaluation = null) => {
    const root = document.createElement("div");
    root.className = "star-board";
    root.dir = "ltr"; // Spatial left/right are world coordinates, including in RTL.
    const paths = svgNode("svg", { viewBox: "0 0 300 300", class: "ck-links", "aria-hidden": "true" });
    map.clues.forEach(([a, , b], index) => {
      const from = option.stars.find(star => star.animal === a);
      const to = option.stars.find(star => star.animal === b);
      const path = svgNode("path", { d: `M ${from.col * 100 + 50} ${from.row * 100 + 43} L ${to.col * 100 + 50} ${to.row * 100 + 43}`, "data-clue": index, class: "ck-link", pathLength: "1" });
      if (clueIndex === index) path.classList.add("is-traced");
      if (evaluation) path.dataset.pass = String(evaluation[index]);
      paths.append(path);
    });
    root.append(paths);
    for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
      const cell = document.createElement("span");
      cell.className = "star-cell";
      const star = option.stars.find(item => item.row === row && item.col === col);
      if (star) {
        cell.classList.add("is-star"); cell.dataset.animal = star.animal;
        cell.style.setProperty("--star-color", palettes[star.animal][0]);
        cell.append(animal(star.animal));
        const name = document.createElement("span"); name.className = "ck-animal-name"; name.textContent = t(star.animal); cell.append(name);
        if (clueIndex >= 0 && [map.clues[clueIndex][0], map.clues[clueIndex][2]].includes(star.animal)) cell.classList.add("is-traced");
      }
      root.append(cell);
    }
    return root;
  };
  const burst = (target, strong = false) => {
    if (!target || document.hidden) return;
    // A bounded, local particle pool; the hit target never moves.
    document.querySelectorAll(".ck-particle").forEach(node => node.remove());
    const count = reduced.matches ? 0 : strong ? 28 : 10;
    for (let index = 0; index < count; index++) {
      const particle = document.createElement("i"); particle.className = "ck-particle";
      particle.style.setProperty("--spark", index % 3 === 0 ? "#ffd893" : index % 3 === 1 ? "#95edda" : "#cbb3ff");
      target.append(particle);
      const angle = (index / count) * Math.PI * 2;
      const radius = strong ? 90 + index % 5 * 17 : 30 + index % 4 * 10;
      const animation = animate(particle, [{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(angle) * radius}px),calc(-50% + ${Math.sin(angle) * radius}px)) rotate(130deg) scale(.2)`, opacity: 0 }], { duration: strong ? 1000 : 520, easing: "cubic-bezier(.12,.64,.3,1)" });
      animation.finished.catch(() => {}).finally(() => particle.remove());
    }
  };
  const enter = node => { if (node && !document.hidden) animate(node, reduced.matches ? [{ opacity: .65 }, { opacity: 1 }] : [{ opacity: .2, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 330, easing: "cubic-bezier(.2,.7,.2,1)" }); };
  const trace = node => {
    if (!node || document.hidden) return;
    node.querySelectorAll(".ck-link.is-traced").forEach(path => {
      path.style.strokeDasharray = "1";
      animate(path, reduced.matches ? [{ opacity: .4 }, { opacity: 1 }] : [{ strokeDashoffset: 1, opacity: .3 }, { strokeDashoffset: 0, opacity: 1 }], { duration: 450, easing: "ease-out" });
    });
    node.querySelectorAll(".is-star .ck-animal").forEach((star, index) => {
      animate(star, reduced.matches ? [{ opacity: .65 }, { opacity: 1 }] : [{ opacity: .2, transform: "translateY(6px) scale(.8)" }, { opacity: 1, transform: "translateY(0) scale(1)" }], { duration: 260 + index * 65, easing: "ease-out" });
    });
  };
  window.ConstellationStellar = { board, burst, enter, trace, settle };
})();
