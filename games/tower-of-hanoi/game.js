window.WPClassicLogic?.mount("tower-of-hanoi");
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
