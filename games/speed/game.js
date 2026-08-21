(function () {
  "use strict";

  window.WPCardGamesNext?.mount({ id: "speed" });

  const shellCopy = {
    en: { start: "Start Game", restart: "Restart", newGame: "New Game", howTo: "How to play" },
    "zh-Hant": { start: "開始遊戲", restart: "重新開始", newGame: "新遊戲", howTo: "玩法說明" },
    "zh-Hans": { start: "开始游戏", restart: "重新开始", newGame: "新游戏", howTo: "玩法说明" },
    ja: { start: "ゲーム開始", restart: "再スタート", newGame: "新しいゲーム", howTo: "遊び方" },
    ko: { start: "게임 시작", restart: "다시 시작", newGame: "새 게임", howTo: "플레이 방법" },
    es: { start: "Empezar", restart: "Reiniciar", newGame: "Nueva partida", howTo: "Cómo jugar" },
    "pt-BR": { start: "Começar jogo", restart: "Reiniciar", newGame: "Novo jogo", howTo: "Como jogar" },
    fr: { start: "Commencer", restart: "Recommencer", newGame: "Nouvelle partie", howTo: "Comment jouer" },
    de: { start: "Spiel starten", restart: "Neu starten", newGame: "Neues Spiel", howTo: "Spielanleitung" },
    it: { start: "Inizia", restart: "Ricomincia", newGame: "Nuova partita", howTo: "Come giocare" },
    ru: { start: "Начать игру", restart: "Заново", newGame: "Новая игра", howTo: "Как играть" },
    hi: { start: "खेल शुरू करें", restart: "फिर शुरू करें", newGame: "नया खेल", howTo: "कैसे खेलें" },
    ar: { start: "ابدأ اللعبة", restart: "إعادة البدء", newGame: "لعبة جديدة", howTo: "طريقة اللعب" },
  };

  const applyShellCopy = () => {
    const locale = document.documentElement.lang || "en";
    const copy = shellCopy[locale] || shellCopy.en;
    const controls = document.querySelectorAll("#startBtn, #restartBtn, #newGameBtn, [data-card-main-controls] button");
    controls.forEach((control) => control.setAttribute("data-runtime-localize", "off"));
    const start = document.querySelector("#startBtn");
    const restart = document.querySelector("#restartBtn");
    const newGame = document.querySelector("#newGameBtn");
    if (start) start.textContent = copy.start;
    if (restart) restart.textContent = copy.restart;
    if (newGame) newGame.textContent = copy.newGame;
    const guideHeading = document.querySelector(".card-game-quick-guide strong");
    if (guideHeading) {
      guideHeading.textContent = copy.howTo;
      guideHeading.setAttribute("data-runtime-localize", "off");
    }
  };

  applyShellCopy();
  window.setTimeout(applyShellCopy, 0);
  window.setTimeout(applyShellCopy, 350);
  window.setTimeout(applyShellCopy, 1000);
  window.setTimeout(applyShellCopy, 1800);
})();
