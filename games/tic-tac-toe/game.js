window.WPPopularArcade?.mount("tic-tac-toe");

(() => {
  "use strict";

  document.body.dataset.gameVersion = "v18";

  const labels = {
    en: { lobby: "Back to WeightPlay", battle: "Back to main", settings: "Settings" },
    "zh-Hant": { lobby: "返回 WeightPlay", battle: "返回主頁", settings: "設定" },
    "zh-Hans": { lobby: "返回 WeightPlay", battle: "返回主页", settings: "设置" },
    ja: { lobby: "WeightPlayへ戻る", battle: "メインへ戻る", settings: "設定" },
    ko: { lobby: "WeightPlay로 돌아가기", battle: "메인으로", settings: "설정" },
    es: { lobby: "Volver a WeightPlay", battle: "Volver al inicio", settings: "Configuración" },
    "pt-BR": { lobby: "Voltar ao WeightPlay", battle: "Voltar ao início", settings: "Configurações" },
    fr: { lobby: "Retour à WeightPlay", battle: "Retour à l’accueil", settings: "Paramètres" },
    de: { lobby: "Zurück zu WeightPlay", battle: "Zur Startseite", settings: "Einstellungen" },
    it: { lobby: "Torna a WeightPlay", battle: "Torna alla home", settings: "Impostazioni" },
    ru: { lobby: "Вернуться в WeightPlay", battle: "На главную", settings: "Настройки" },
    hi: { lobby: "WeightPlay पर वापस जाएँ", battle: "मुख्य पृष्ठ", settings: "सेटिंग्स" },
    ar: { lobby: "العودة إلى WeightPlay", battle: "العودة إلى الرئيسية", settings: "الإعدادات" },
  };

  const shell = document.querySelector("#popularArcade");
  const header = document.querySelector(".arcade-header");
  const mainScreen = document.querySelector("#mainScreen");
  if (header && mainScreen && !mainScreen.contains(header)) mainScreen.prepend(header);
  const battleTop = document.querySelector("#battleScreen .battle-top");
  const boardWrap = document.querySelector("#battleScreen .board-wrap");
  boardWrap?.setAttribute("role", "region");
  boardWrap?.setAttribute("tabindex", "0");
  boardWrap?.setAttribute("aria-labelledby", "gameTitle");
  const mainReturn = document.createElement("a");
  mainReturn.className = "tic-main-return";
  mainReturn.href = "/";
  mainReturn.dataset.wpReturn = "main";
  mainReturn.innerHTML = '<span aria-hidden="true">←</span><img src="../../assets/weightplay-logo.png" alt="" width="32" height="32">';
  header?.prepend(mainReturn);

  const battleReturn = document.createElement("button");
  battleReturn.className = "tic-battle-return";
  battleReturn.type = "button";
  battleReturn.dataset.wpReturn = "battle";
  battleReturn.textContent = "←";
  battleTop?.prepend(battleReturn);
  battleReturn.addEventListener("click", () => document.querySelector("#homeBtn")?.click());

  const battleSettings = document.createElement("button");
  battleSettings.className = "tic-battle-settings";
  battleSettings.type = "button";
  battleSettings.dataset.wpBattleUtility = "true";
  battleSettings.textContent = "⚙";
  battleSettings.title = "Settings";
  battleTop?.append(battleSettings);
  battleSettings.addEventListener("click", () => {
    document.querySelector(".wp-shell-settings-button")?.focus({ preventScroll: true });
  });

  const reserve = document.createElement("div");
  reserve.className = "arcade-ad-reserve battle-ad-reserve tic-ad-reserve";
  reserve.setAttribute("aria-hidden", "true");
  shell?.append(reserve);

  const applyLabels = () => {
    const copy = labels[document.documentElement.lang] || labels.en;
    mainReturn.setAttribute("aria-label", copy.lobby);
    battleReturn.setAttribute("aria-label", copy.battle);
    battleSettings.setAttribute("aria-label", copy.settings);
    battleSettings.title = copy.settings;
  };
  applyLabels();
  document.querySelector("#localeSelect")?.addEventListener("change", applyLabels);

  const style = document.createElement("style");
  style.dataset.ticTacToeV18 = "true";
  style.textContent = `
    .tic-main-return,
    .tic-battle-return,
    .tic-battle-settings {
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
    .tic-battle-settings {
      position: static;
      width: 48px;
      min-width: 48px;
      color: #f7d77b;
      background: #12334d;
      font-size: 20px;
      cursor: pointer;
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
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
      padding: clamp(12px, 3vw, 24px);
      display: grid;
      grid-template-rows: 52px minmax(0, 1fr) 48px;
      gap: 10px;
      align-content: stretch;
    }
    html.popular-tic-tac-toe-active #battleScreen .battle-top {
      position: relative;
      min-width: 0;
      max-width: 100%;
      display: grid;
      direction: ltr;
      grid-template-columns: 48px minmax(0, 1fr) minmax(124px, auto) 48px;
      gap: 8px;
      align-items: center;
    }
    html.popular-tic-tac-toe-active #battleScreen .tic-battle-return {
      grid-column: 1;
      grid-row: 1;
    }
    html.popular-tic-tac-toe-active #battleScreen .round-label {
      grid-column: 2;
      grid-row: 1;
      min-width: 0;
      max-height: 48px;
      overflow: visible;
      line-height: 1.35;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      white-space: normal;
      overflow-wrap: anywhere;
    }
    html.popular-tic-tac-toe-active #battleScreen .battle-top .control-row {
      grid-column: 3;
      grid-row: 1;
      min-width: 124px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    html.popular-tic-tac-toe-active #battleScreen .tic-battle-settings {
      grid-column: 4;
      grid-row: 1;
    }
    html.popular-tic-tac-toe-active #battleScreen .battle-top .secondary {
      width: 100%;
      min-width: 0;
      min-height: 48px;
      padding: 6px 8px;
      white-space: nowrap;
    }
    /* Interface V6 scales the desktop Battle section to the 920px logical
       shell. Give the physical header controls a 57px logical box so the
       transformed result remains at least the governed 48px target. */
    @media (min-width: 1000px) {
      html.popular-tic-tac-toe-active #battleScreen .battle-top {
        grid-template-columns: 57px minmax(0, 1fr) minmax(147px, auto) 57px;
        gap: 10px;
      }
      html.popular-tic-tac-toe-active #battleScreen .tic-battle-return,
      html.popular-tic-tac-toe-active #battleScreen .tic-battle-settings {
        width: 57px;
        min-width: 57px;
        min-height: 57px;
      }
      html.popular-tic-tac-toe-active #battleScreen .wp-generated-battle-header .tic-battle-return {
        width: 57px !important;
        min-width: 57px !important;
        max-width: 57px !important;
        height: 57px !important;
        min-height: 57px !important;
      }
      html.popular-tic-tac-toe-active #battleScreen .battle-top .control-row {
        min-width: 147px;
        gap: 10px;
      }
      html.popular-tic-tac-toe-active #battleScreen .battle-top .secondary {
        min-height: 57px;
      }
    }
    html.popular-tic-tac-toe-active #battleScreen .board-wrap {
      min-width: 0;
      max-width: 100%;
      min-height: 0;
      height: 100%;
      padding: clamp(8px, 2vw, 14px);
      overflow: hidden;
    }
    html.popular-tic-tac-toe-active #battleScreen .board-wrap:focus-visible {
      outline: 3px solid var(--arcade-accent-2);
      outline-offset: -3px;
    }
    @media (min-width: 700px) and (max-height: 560px) {
      body[data-game-id='tic-tac-toe'] .wp-standard-main-composition {
        --wp-main-landscape-poster-size: 300px;
      }
    }
    html.popular-tic-tac-toe-active #battleScreen .board {
      min-width: 0;
      max-width: 100%;
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
      max-width: 100%;
    }
    html.popular-tic-tac-toe-active #battleScreen .tic-cell {
      min-width: 0;
      min-height: 0;
      aspect-ratio: auto;
      touch-action: manipulation;
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
    @media (max-width: 540px) and (orientation: portrait) {
      html.popular-tic-tac-toe-active #battleScreen .battle-panel {
        padding: 10px;
        grid-template-rows: auto minmax(0, 1fr) 48px;
        gap: 8px;
      }
      html.popular-tic-tac-toe-active #battleScreen .battle-top {
        grid-template-columns: 48px minmax(0, 1fr) 48px;
        grid-template-rows: 48px 48px;
        gap: 7px 10px;
      }
      html.popular-tic-tac-toe-active #battleScreen .tic-battle-return {
        grid-column: 1;
        grid-row: 1;
      }
      html.popular-tic-tac-toe-active #battleScreen .round-label {
        grid-column: 2;
        grid-row: 1;
        font-size: clamp(.78rem, 3.7vw, .95rem);
      }
      html.popular-tic-tac-toe-active #battleScreen .tic-battle-settings {
        grid-column: 3;
        grid-row: 1;
      }
      html.popular-tic-tac-toe-active #battleScreen .battle-top .control-row {
        grid-column: 1 / -1;
        grid-row: 2;
        width: 100%;
        min-width: 0;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      html.popular-tic-tac-toe-active #battleScreen .board-wrap {
        padding: 6px;
      }
      html.popular-tic-tac-toe-active #battleScreen .tic-board {
        width: min(100%, 360px);
      }
    }
    @media (min-width: 541px) and (max-width: 699px) and (orientation: portrait) {
      html.popular-tic-tac-toe-active #battleScreen .battle-panel {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: 52px minmax(0, 1fr) 48px;
      }
      html.popular-tic-tac-toe-active #battleScreen .board-wrap {
        overflow: auto;
        align-items: start;
        justify-items: center;
        overscroll-behavior: contain;
        scrollbar-gutter: stable both-edges;
        touch-action: pan-y;
      }
      html.popular-tic-tac-toe-active #battleScreen .board {
        width: min(100%, 440px);
        height: auto;
        min-height: 0;
      }
      html.popular-tic-tac-toe-active #battleScreen .tic-board {
        width: min(100%, 440px);
        min-width: 0;
      }
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
        overflow: auto;
        align-items: start;
        justify-items: center;
        overscroll-behavior: contain;
        scrollbar-gutter: stable both-edges;
        touch-action: pan-y;
      }
      html.popular-tic-tac-toe-active #battleScreen .board {
        width: min(100%, 350px);
        height: auto;
        min-height: 0;
      }
      html.popular-tic-tac-toe-active #battleScreen .tic-board {
        width: min(100%, 350px);
        min-width: 300px;
        min-height: 300px;
        height: auto;
        aspect-ratio: 1;
      }
      html.popular-tic-tac-toe-active #battleScreen .battle-top {
        grid-column: 2;
        grid-row: 1;
        padding-inline-end: 0;
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
