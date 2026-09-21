const towerOfHanoiArtLink = document.createElement("link");
towerOfHanoiArtLink.rel = "stylesheet";
towerOfHanoiArtLink.href = "art.css?v=20260921-tower-of-hanoi-block-scene-v1";
document.head.appendChild(towerOfHanoiArtLink);
window.WPClassicLogic?.mount("tower-of-hanoi");

function reconcileTowerGuide() {
  const guide = document.querySelector(".logic-guide");
  const main = document.querySelector("#logicMain");
  const staticGuide = document.querySelector(".game-page-info-static");
  if (guide && staticGuide) {
    guide.remove();
  } else if (guide && main?.parentElement) {
    guide.classList.add("game-page-info");
    guide.setAttribute("data-wp-game-guide", "");
    main.parentElement.insertBefore(guide, document.querySelector("#logicBattle"));
  }
}

// Localized route shells append their static Guide after this game script.
// Reconcile again only after parsing finishes so the visible route owns one
// framed Guide instead of retaining the temporary generated duplicate.
reconcileTowerGuide();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", reconcileTowerGuide, { once: true });
}

document.body.dataset.gameVersion = "v13";
