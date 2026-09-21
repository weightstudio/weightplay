(function () {
  "use strict";
  const sudokuArtLink = document.createElement("link");
  sudokuArtLink.rel = "stylesheet";
  sudokuArtLink.href = "art.css?v=20260921-sudoku-block-scene-v1";
  document.head.appendChild(sudokuArtLink);
  window.WPClassicLogic?.mount("sudoku");
  const poster = document.querySelector(".logic-poster img");
  if (poster) poster.src = "../../assets/sudoku-cover-v1.webp";
})();
