import { SnakeBoard3D } from "./board-3d.js?v=20261018-snake-v34";
import { updateExperience } from "./experience.js?v=20261026-i9-4a19c6ecd4bb";

(() => {
  "use strict";

  // Result presentation consumes only the collision captured by the real move.
  // The shared runtime remains the sole owner of rules, settlement and saves.
  const copy = {
    en: { obstacle: "You hit an obstacle at row {r}, column {c}. Turn before the marked square.", body: "You hit your own body at row {r}, column {c}. Leave more room to turn.", marker: "Collision point" },
    "zh-Hant": { obstacle: "你在第 {r} 列、第 {c} 欄撞到障礙。下次請在標記格之前轉彎。", body: "你在第 {r} 列、第 {c} 欄撞到自己的身體。下次請多留一些轉彎空間。", marker: "碰撞位置" },
    "zh-Hans": { obstacle: "你在第 {r} 行、第 {c} 列撞到障碍。下次请在标记格之前转弯。", body: "你在第 {r} 行、第 {c} 列撞到自己的身体。下次请多留一些转弯空间。", marker: "碰撞位置" },
    ja: { obstacle: "上から {r} 行目、左から {c} 列目の障害物に衝突しました。印のマスより手前で曲がりましょう。", body: "上から {r} 行目、左から {c} 列目で自分の体に衝突しました。曲がる空間を広く取りましょう。", marker: "衝突したマス" },
    ko: { obstacle: "위에서 {r}행, 왼쪽에서 {c}열의 장애물에 부딪혔습니다. 표시된 칸 전에 방향을 바꾸세요.", body: "위에서 {r}행, 왼쪽에서 {c}열에서 자신의 몸에 부딪혔습니다. 회전할 공간을 더 남겨 두세요.", marker: "충돌 지점" },
    es: { obstacle: "Chocaste con un obstáculo en la fila {r}, columna {c}. Gira antes de la casilla marcada.", body: "Chocaste con tu cuerpo en la fila {r}, columna {c}. Deja más espacio para girar.", marker: "Punto de colisión" },
    "pt-BR": { obstacle: "Você atingiu um obstáculo na linha {r}, coluna {c}. Vire antes da casa marcada.", body: "Você atingiu o próprio corpo na linha {r}, coluna {c}. Deixe mais espaço para virar.", marker: "Ponto da colisão" },
    fr: { obstacle: "Vous avez heurté un obstacle à la ligne {r}, colonne {c}. Tournez avant la case marquée.", body: "Vous avez heurté votre corps à la ligne {r}, colonne {c}. Gardez plus de place pour tourner.", marker: "Point de collision" },
    de: { obstacle: "Du hast ein Hindernis in Zeile {r}, Spalte {c} getroffen. Biege vor dem markierten Feld ab.", body: "Du hast deinen Körper in Zeile {r}, Spalte {c} getroffen. Lass mehr Platz zum Abbiegen.", marker: "Kollisionsstelle" },
    it: { obstacle: "Hai colpito un ostacolo alla riga {r}, colonna {c}. Svolta prima della casella segnata.", body: "Hai colpito il tuo corpo alla riga {r}, colonna {c}. Lascia più spazio per svoltare.", marker: "Punto di collisione" },
    ru: { obstacle: "Вы врезались в препятствие: строка {r}, столбец {c}. Поворачивайте до отмеченной клетки.", body: "Вы врезались в своё тело: строка {r}, столбец {c}. Оставляйте больше места для поворота.", marker: "Место столкновения" },
    hi: { obstacle: "पंक्ति {r}, स्तंभ {c} पर बाधा से टक्कर हुई। चिह्नित खाने से पहले मुड़ें।", body: "पंक्ति {r}, स्तंभ {c} पर अपने शरीर से टक्कर हुई। मुड़ने के लिए अधिक जगह छोड़ें।", marker: "टक्कर की जगह" },
    ar: { obstacle: "اصطدمت بعائق في الصف {r}، العمود {c}. انعطف قبل الخانة المحددة.", body: "اصطدمت بجسمك في الصف {r}، العمود {c}. اترك مساحة أكبر للانعطاف.", marker: "موضع الاصطدام" },
  };
  let renderedSnapshot = null;
  let renderedLocale = null;

  const clear = (els) => {
    const review = els.result.querySelector(".snake-impact-review");
    if (review && !review.hidden) review.hidden = true;
    els.result.querySelector(".arcade-panel")?.classList.remove("snake-impact-visible");
    delete els.result.dataset.snakeCollisionKind;
    delete els.result.dataset.snakeCollisionCell;
    renderedSnapshot = null;
    renderedLocale = null;
  };

  const render = (els, collision, locale) => {
    if (!collision || !["obstacle", "body"].includes(collision.kind)
      || !Number.isInteger(collision.cell) || collision.cell < 0 || collision.cell >= 100) {
      clear(els);
      return;
    }
    const text = copy[locale] || copy.en;
    const message = text[collision.kind]
      .replace("{r}", String(Math.floor(collision.cell / 10) + 1))
      .replace("{c}", String(collision.cell % 10 + 1));
    els.resultCopy.textContent = message;
    const panel = els.result.querySelector(".arcade-panel");
    let review = panel.querySelector(".snake-impact-review");
    if (!review) {
      review = document.createElement("figure");
      review.className = "snake-impact-review";
      panel.insertBefore(review, panel.querySelector(".result-actions"));
    }
    if (renderedSnapshot !== collision || renderedLocale !== locale) {
      const grid = document.createElement("div");
      grid.className = "snake-impact-grid";
      grid.setAttribute("role", "img");
      grid.setAttribute("aria-label", message);
      const body = new Set(collision.trail);
      const obstacles = new Set(collision.obstacles);
      for (let cell = 0; cell < 100; cell += 1) {
        const node = document.createElement("span");
        node.className = "snake-impact-cell";
        node.dataset.cell = String(cell);
        node.setAttribute("aria-hidden", "true");
        node.classList.toggle("is-body", body.has(cell));
        node.classList.toggle("is-obstacle", obstacles.has(cell));
        node.classList.toggle("is-food", cell === collision.foodCell);
        node.classList.toggle("is-impact", cell === collision.cell);
        grid.append(node);
      }
      const caption = document.createElement("figcaption");
      caption.textContent = `× ${text.marker}`;
      review.replaceChildren(grid, caption);
      renderedSnapshot = collision;
      renderedLocale = locale;
    }
    review.hidden = false;
    panel.classList.add("snake-impact-visible");
    els.result.dataset.snakeCollisionKind = collision.kind;
    els.result.dataset.snakeCollisionCell = String(collision.cell);
  };

  window.WPSnakeFeedback = Object.freeze({ render, clear });
  let visual = null;
  window.WPSnakeVisual = Object.freeze({
    render(state, locale) {
      updateExperience(state, locale);
      if (document.body.dataset.screen !== "battle") { visual?.setActive(); return; }
      const host = document.querySelector("#battleScreen .board-wrap");
      if (!host) return;
      visual ||= new SnakeBoard3D(host);
      visual.update(state, locale);
    },
    diagnostics: () => visual?.diagnostics() || { initialized: false },
    cellPoint: (cell) => visual?.cellPoint(cell),
  });
  window.WPPopularArcade?.mount("snake", {sharedFrame:true});
  mountSnakeSharedInterface();
})();

function mountSnakeSharedInterface() {
  document.body.dataset.gameVersion = 'v35';
  const core = window.WeightPlayScreenFrame;
  const root = document.getElementById('popularArcade');
  const main = document.getElementById('mainScreen');
  const battle = document.getElementById('battleScreen');
  const result = document.getElementById('resultScreen');
  const mainHeader = root.querySelector('.arcade-header');
  const mainContent = main.querySelector('.main-panel');
  const copy = mainContent.querySelector('.main-copy');
  const title = document.getElementById('gameTitle');
  const poster = mainContent.querySelector('.main-poster');
  const locale = document.getElementById('localeSelect');
  const battleContent = battle.querySelector('.battle-panel');
  const legacyTop = battleContent.querySelector('.battle-top');
  const utilities = legacyTop.querySelector('.control-row');
  const round = document.getElementById('roundLabel');
  const back = battle.querySelector('[data-wp-return="battle"]');
  if (!core || !poster || !locale || !back) throw new Error('SNAKE_COMMON_I9_INPUTS_REQUIRED');
  main.className = 'main-screen';
  mainContent.className = '';
  copy.className = '';
  poster.className = '';
  document.getElementById('objective').className = '';
  const legacyFooter = root.querySelector('footer');
  if (legacyFooter) { legacyFooter.hidden = true; legacyFooter.inert = true; }
  main.prepend(mainHeader);
  mainHeader.querySelector('.language-select')?.remove();
  // The existing locale handler keeps its source select, inside shared Settings.
  const carrier = document.createElement('div');
  carrier.hidden = true; carrier.inert = true; carrier.append(locale); root.append(carrier);
  mainHeader.replaceChildren(mainHeader.querySelector('[data-wp-return="main"]'),title);
  title.dataset.wpFrameTitle = '';
  poster.dataset.wpFramePoster = '';
  poster.removeAttribute('style');
  mainContent.prepend(poster);
  mainContent.querySelector('.preview-art')?.remove();
  copy.dataset.wpFrameCopy = '';
  document.getElementById('objective').dataset.wpFrameSummary = '';
  document.getElementById('mainInstruction').hidden = true;
  const progress = document.getElementById('mainProgress');
  progress.dataset.wpFrameProgress = ''; progress.classList.remove('main-progress');
  progress.removeAttribute('data-wp-main-progress');
  const recordLabels = {en:'Best score','zh-Hant':'最佳分數','zh-Hans':'最佳分数',ja:'ベストスコア',ko:'최고 점수',es:'Mejor puntuación','pt-BR':'Melhor pontuação',fr:'Meilleur score',de:'Bestpunktzahl',it:'Miglior punteggio',ru:'Лучший счёт',hi:'सर्वश्रेष्ठ स्कोर',ar:'أفضل نتيجة'};
  const syncRecord = () => {
    let best = 0; try { best = Math.max(0,Number(localStorage.getItem('weightplay_popular_snake_best')) || 0); } catch {}
    progress.querySelector('strong').textContent = recordLabels[document.documentElement.lang] || recordLabels.en;
    progress.querySelector('span').textContent = String(best);
  };
  syncRecord();
  const start = document.getElementById('startBtn'); start.dataset.wpFrameAction = 'primary';
  const battleHeader = document.createElement('header');
  const battleTitle = document.createElement('strong');
  battleTitle.dataset.wpFrameTitle = ''; battleTitle.hidden = true;
  battleTitle.textContent = title.textContent;
  battleHeader.append(back,battleTitle);
  legacyTop.remove(); battle.prepend(battleHeader);
  const actions = document.createElement('nav');
  actions.className = 'snake-content-actions'; actions.append(...utilities.children);
  battleContent.append(actions);
  const frame = core.mount({root,localeSelect:locale,playUI:true,scenes:{main:{root:main,header:mainHeader,content:mainContent},battle:{root:battle,header:battleHeader,content:battleContent}}});
  const info = core.createGroup();
  info.add(round); frame.battleTopUI.add(info);
  window.WPSnakeInterface = Object.freeze({hudGroup:frame.battleTopUI});
  const markActions = () => root.querySelectorAll('#controls button,.snake-content-actions button,#resultScreen button,.snake-leave-dialog button').forEach(button => {button.dataset.wpFrameAction = button.id === 'retryBtn' ? 'primary' : 'secondary';});
  markActions();
  const controlsObserver = new MutationObserver(markActions);
  controlsObserver.observe(document.getElementById('controls'),{childList:true,subtree:true});
  result.className = 'snake-result';
  result.setAttribute('role','dialog');
  result.setAttribute('aria-modal','true');
  result.setAttribute('aria-labelledby','resultTitle');
  battle.append(result);
  let resultWasOpen = false;
  let resultReturnFocus = null;
  const sync = () => {
    const resultOpen = !result.hidden;
    const screen = resultOpen ? 'result' : document.body.dataset.screen;
    if (screen === 'main') syncRecord();
    battleContent.hidden = resultOpen;
    frame.activate(screen === 'main' ? 'main' : 'battle');
    battleContent.inert = resultOpen;
    battleHeader.inert = resultOpen;
    if (screen === 'main') window.WeightPlayBattleCanvas?.sync?.();
    if (resultOpen && !resultWasOpen) {
      resultReturnFocus = document.activeElement;
      frame.close();
      document.getElementById('retryBtn').focus({preventScroll:true});
    } else if (!resultOpen && resultWasOpen) {
      const target = screen === 'main' ? start : resultReturnFocus?.isConnected && resultReturnFocus.getClientRects().length ? resultReturnFocus : document.querySelector('#controls button');
      target?.focus({preventScroll:true});
    }
    resultWasOpen = resultOpen;
  };
  const abort = new AbortController();
  result.addEventListener('keydown',event => {
    if (event.key !== 'Tab') return;
    const buttons = [...result.querySelectorAll('button:not(:disabled)')].filter(node => node.getClientRects().length);
    if (!buttons.length) return;
    const index = buttons.indexOf(document.activeElement);
    event.preventDefault();
    buttons[(index + (event.shiftKey ? buttons.length - 1 : 1)) % buttons.length].focus();
  },{signal:abort.signal});

  window.addEventListener('weightplay:shell-sync',sync,{signal:abort.signal});
  sync();
  window.addEventListener('pagehide',event => {if(event.persisted)return;abort.abort();controlsObserver.disconnect();frame.destroy();},{once:true});
}
