window.WPPopularArcade?.mount("tic-tac-toe");

(() => {
  "use strict";

  document.body.dataset.gameVersion = "v10";

  const labels = {
    en: { lobby: "Back to WeightPlay", battle: "Back to main" },
    "zh-Hant": { lobby: "返回 WeightPlay", battle: "返回主頁" },
    "zh-Hans": { lobby: "返回 WeightPlay", battle: "返回主页" },
    ja: { lobby: "WeightPlayへ戻る", battle: "メインへ戻る" },
    ko: { lobby: "WeightPlay로 돌아가기", battle: "메인으로" },
    es: { lobby: "Volver a WeightPlay", battle: "Volver al inicio" },
    "pt-BR": { lobby: "Voltar ao WeightPlay", battle: "Voltar ao início" },
    fr: { lobby: "Retour à WeightPlay", battle: "Retour à l’accueil" },
    de: { lobby: "Zurück zu WeightPlay", battle: "Zur Startseite" },
    it: { lobby: "Torna a WeightPlay", battle: "Torna alla home" },
    ru: { lobby: "Вернуться в WeightPlay", battle: "На главную" },
    hi: { lobby: "WeightPlay पर वापस जाएँ", battle: "मुख्य पृष्ठ" },
    ar: { lobby: "العودة إلى WeightPlay", battle: "العودة إلى الرئيسية" },
  };

  const shell = document.querySelector("#popularArcade");
  const header = document.querySelector(".arcade-header");
  const battleTop = document.querySelector("#battleScreen .battle-top");
  const mainReturn = document.createElement("a");
  mainReturn.className = "tic-main-return";
  mainReturn.href = "/";
  mainReturn.dataset.wpReturn = "main";
  mainReturn.textContent = "← W";
  header?.prepend(mainReturn);

  const battleReturn = document.createElement("button");
  battleReturn.className = "tic-battle-return";
  battleReturn.type = "button";
  battleReturn.dataset.wpReturn = "battle";
  battleReturn.textContent = "←";
  battleTop?.prepend(battleReturn);
  battleReturn.addEventListener("click", () => document.querySelector("#homeBtn")?.click());

  const reserve = document.createElement("div");
  reserve.className = "arcade-ad-reserve tic-ad-reserve";
  reserve.setAttribute("aria-hidden", "true");
  shell?.append(reserve);

  const applyLabels = () => {
    const copy = labels[document.documentElement.lang] || labels.en;
    mainReturn.setAttribute("aria-label", copy.lobby);
    battleReturn.setAttribute("aria-label", copy.battle);
  };
  applyLabels();
  document.querySelector("#localeSelect")?.addEventListener("change", applyLabels);

  const style = document.createElement("style");
  style.dataset.ticTacToeV10 = "true";
  style.textContent = `
    .tic-main-return,
    .tic-battle-return {
      display: inline-grid;
      place-items: center;
      min-width: 48px;
      min-height: 48px;
      border: 1px solid rgba(184, 211, 244, .28);
      border-radius: 14px;
      color: #0b3f63;
      background: #f8fafc;
      font-weight: 900;
      text-decoration: none;
      touch-action: manipulation;
    }
    .tic-main-return { flex: 0 0 auto; }
    html.popular-tic-tac-toe-active .popular-arcade {
      width: min(100%, 920px);
      height: 100dvh;
      min-height: 0;
      padding: 0;
      gap: 0;
      display: grid;
      grid-template-rows: minmax(0, 1fr) 56px;
    }
    html.popular-tic-tac-toe-active #battleScreen,
    html.popular-tic-tac-toe-active #resultScreen {
      grid-row: 1;
      width: 100%;
      height: 100%;
      min-height: 0;
    }
    html.popular-tic-tac-toe-active .tic-ad-reserve {
      display: block;
      grid-row: 2;
      width: 100%;
      height: 56px;
      min-height: 56px;
      background: #0b1728;
      pointer-events: none;
    }
    html.popular-tic-tac-toe-active #battleScreen .battle-panel,
    html.popular-tic-tac-toe-active #resultScreen .arcade-panel {
      width: 100%;
      height: 100%;
      min-height: 0;
      border-radius: 0;
      background:
        linear-gradient(rgba(8, 17, 31, .9), rgba(10, 25, 43, .94)),
        url('../../assets/tic-tac-toe-cover.webp') center / cover no-repeat;
    }
    html.popular-tic-tac-toe-active #battleScreen .battle-panel {
      padding: clamp(12px, 3vw, 24px);
      display: grid;
      grid-template-rows: 52px minmax(0, 1fr) 48px;
      gap: 10px;
      align-content: stretch;
    }
    html.popular-tic-tac-toe-active #battleScreen .battle-top {
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr) auto;
      gap: 10px;
      align-items: center;
    }
    html.popular-tic-tac-toe-active #battleScreen .round-label {
      min-width: 0;
      max-height: 48px;
      overflow: hidden;
      line-height: 1.35;
    }
    html.popular-tic-tac-toe-active #battleScreen .battle-top .control-row {
      flex-wrap: nowrap;
    }
    html.popular-tic-tac-toe-active #battleScreen .battle-top .secondary {
      min-height: 44px;
      padding: 8px 12px;
      white-space: nowrap;
    }
    html.popular-tic-tac-toe-active #battleScreen .board-wrap {
      min-height: 0;
      height: 100%;
      padding: clamp(8px, 2vw, 14px);
      overflow: hidden;
    }
    html.popular-tic-tac-toe-active #battleScreen .board {
      width: 100%;
      height: 100%;
      min-height: 0;
    }
    html.popular-tic-tac-toe-active #battleScreen .tic-board {
      width: min(100%, 440px);
      height: auto;
      max-height: 100%;
      aspect-ratio: 1;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-template-rows: repeat(3, minmax(0, 1fr));
    }
    html.popular-tic-tac-toe-active #battleScreen .tic-cell {
      min-width: 0;
      min-height: 0;
      aspect-ratio: auto;
    }
    html.popular-tic-tac-toe-active #battleScreen .game-message {
      height: 48px;
      min-height: 48px;
      margin: 0;
      display: flex;
      align-items: center;
      overflow: hidden;
      line-height: 1.35;
    }
    html.popular-tic-tac-toe-active #battleScreen #controls { display: none; }
    html.popular-tic-tac-toe-active #resultScreen .arcade-panel {
      padding: clamp(20px, 5vw, 44px);
      align-content: center;
      overflow: hidden;
    }
    @media (orientation: landscape) and (max-height: 430px) {
      html.popular-tic-tac-toe-active body[data-game-id='tic-tac-toe'][data-screen='battle'] .popular-arcade,
      html.popular-tic-tac-toe-active body[data-game-id='tic-tac-toe'][data-screen='result'] .popular-arcade {
        width: min(100%, 920px);
        height: 100dvh;
        padding: 0;
      }
      html.popular-tic-tac-toe-active #battleScreen .battle-panel {
        padding: 6px;
        grid-template-columns: minmax(0, 1fr) minmax(270px, .82fr);
        grid-template-rows: 48px minmax(0, 1fr) 44px;
        gap: 5px 10px;
      }
      html.popular-tic-tac-toe-active #battleScreen .board-wrap {
        grid-column: 1;
        grid-row: 1 / 4;
        padding: 4px;
      }
      html.popular-tic-tac-toe-active #battleScreen .tic-board {
        width: min(100%, calc(100dvh - 76px));
        height: auto;
      }
      html.popular-tic-tac-toe-active #battleScreen .battle-top {
        grid-column: 2;
        grid-row: 1;
        padding-inline-end: 80px;
      }
      html.popular-tic-tac-toe-active #battleScreen .game-message {
        grid-column: 2;
        grid-row: 2 / 4;
        height: 100%;
        min-height: 0;
        align-items: flex-start;
        padding-top: 6px;
      }
      html.popular-tic-tac-toe-active body[data-game-id='tic-tac-toe'] .arcade-header {
        display: block;
        left: auto;
        right: 6px;
      }
      html.popular-tic-tac-toe-active .tic-main-return { display: none; }
    }
  `;
  document.head.append(style);
})();
