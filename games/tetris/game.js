window.WPPopularArcade?.mount("tetris");

const syncTetrisResultStats = () => {
  document.querySelectorAll("#resultStats .stat").forEach((stat) => {
    if (stat.dataset.tetrisSeparated === "true") return;
    const value = stat.querySelector("strong");
    const labelNode = [...stat.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (!value || !labelNode) return;
    const labelText = labelNode.textContent.trim();
    labelNode.remove();
    const label = document.createElement("span");
    label.className = "stat-label";
    label.textContent = labelText;
    stat.classList.add("tetris-result-stat");
    stat.dataset.tetrisSeparated = "true";
    stat.setAttribute("role", "group");
    stat.setAttribute("aria-label", `${labelText}: ${value.textContent.trim()}`);
    stat.prepend(label);
  });
};

const resultStats = document.querySelector("#resultStats");
if (resultStats) {
  new MutationObserver(syncTetrisResultStats).observe(resultStats, { childList: true, subtree: true });
  [0, 120, 300, 600].forEach((delay) => window.setTimeout(syncTetrisResultStats, delay));
}
