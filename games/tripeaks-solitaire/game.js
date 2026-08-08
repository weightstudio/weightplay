(function () {
  "use strict";
  const mount = () => {
    const mainReturn = document.querySelector(".main-return");
    if (mainReturn && !mainReturn.querySelector("img")) {
      const logo = document.createElement("img");
      logo.src = "../../assets/weightplay-logo.png";
      logo.alt = "";
      mainReturn.append(logo);
    }
    document.getElementById("battleBackBtn")?.setAttribute("data-wp-return", "battle");
    window.WPClassicSolitaire?.mount({ variant: "tripeaks", id: "tripeaks-solitaire" });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
