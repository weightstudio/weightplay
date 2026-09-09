(function () {
  "use strict";
  const mount = () => {
    document.body.dataset.gameVersion = 'v21';
    document.body.dataset.cardDeck = 'klondike';
    const mainReturn = document.querySelector(".main-return");
    if (mainReturn && !mainReturn.querySelector("img")) {
      const logo = document.createElement("img");
      logo.src = "../../assets/weightplay-logo.png";
      logo.alt = "";
      mainReturn.append(logo);
    }
    document.getElementById("battleBackBtn")?.setAttribute("data-wp-return", "battle");
    const view = window.WPClassicSolitaire?.mount({ variant: "yukon", id: "yukon-solitaire" });
    window.WPCardTablePresentation?.install(view);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
