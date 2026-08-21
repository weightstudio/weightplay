(function () {
  "use strict";

  window.WPCardGamesNext?.mount({ id: "speed" });

  const shellCopy = {
    en: { start: "Start Game", restart: "Restart", newGame: "New Game", close: "Close", howTo: "How to play" },
    "zh-Hant": { start: "開始遊戲", restart: "重新開始", newGame: "新遊戲", close: "關閉", howTo: "玩法說明" },
    "zh-Hans": { start: "开始游戏", restart: "重新开始", newGame: "新游戏", close: "关闭", howTo: "玩法说明" },
    ja: { start: "ゲーム開始", restart: "再スタート", newGame: "新しいゲーム", close: "閉じる", howTo: "遊び方" },
    ko: { start: "게임 시작", restart: "다시 시작", newGame: "새 게임", close: "닫기", howTo: "플레이 방법" },
    es: { start: "Empezar", restart: "Reiniciar", newGame: "Nueva partida", close: "Cerrar", howTo: "Cómo jugar" },
    "pt-BR": { start: "Começar jogo", restart: "Reiniciar", newGame: "Novo jogo", close: "Fechar", howTo: "Como jogar" },
    fr: { start: "Commencer", restart: "Recommencer", newGame: "Nouvelle partie", close: "Fermer", howTo: "Comment jouer" },
    de: { start: "Spiel starten", restart: "Neu starten", newGame: "Neues Spiel", close: "Schließen", howTo: "Spielanleitung" },
    it: { start: "Inizia", restart: "Ricomincia", newGame: "Nuova partita", close: "Chiudi", howTo: "Come giocare" },
    ru: { start: "Начать игру", restart: "Заново", newGame: "Новая игра", close: "Закрыть", howTo: "Как играть" },
    hi: { start: "खेल शुरू करें", restart: "फिर शुरू करें", newGame: "नया खेल", close: "बंद करें", howTo: "कैसे खेलें" },
    ar: { start: "ابدأ اللعبة", restart: "إعادة البدء", newGame: "لعبة جديدة", close: "إغلاق", howTo: "طريقة اللعب" },
  };

  const applyShellCopy = () => {
    const locale = document.documentElement.lang || "en";
    const copy = shellCopy[locale] || shellCopy.en;
    const controls = document.querySelectorAll("#startBtn, #restartBtn, #newGameBtn, #resultNewGame, #resultRestart, #resultClose, [data-card-main-controls] button");
    controls.forEach((control) => control.setAttribute("data-runtime-localize", "off"));
    const start = document.querySelector("#startBtn");
    const restart = document.querySelector("#restartBtn");
    const newGame = document.querySelector("#newGameBtn");
    if (start) start.textContent = copy.start;
    if (restart) restart.textContent = copy.restart;
    if (newGame) newGame.textContent = copy.newGame;
    const resultNewGame = document.querySelector("#resultNewGame");
    const resultRestart = document.querySelector("#resultRestart");
    const resultClose = document.querySelector("#resultClose");
    if (resultNewGame) resultNewGame.textContent = copy.newGame;
    if (resultRestart) resultRestart.textContent = copy.restart;
    if (resultClose) {
      resultClose.textContent = copy.close;
      resultClose.setAttribute("aria-label", copy.close);
    }
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
