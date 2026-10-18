// Presentation only. The shared Snake simulation owns every move and reward.
const labels = {
  en: ["Score", "Food target", "Choose a direction", "Swipe or use the arrows", "Milestone", "Edges wrap"],
  "zh-Hant": ["分數", "食物目標", "選個方向，出發", "滑動棋盤或按方向鍵", "里程碑", "邊緣可穿越"],
  "zh-Hans": ["分数", "食物目标", "选个方向，出发", "滑动棋盘或按方向键", "里程碑", "边缘可穿越"],
  ja: ["スコア", "フード目標", "方向を選んで出発", "スワイプまたは矢印で操作", "マイルストーン", "端は反対側へ"],
  ko: ["점수", "먹이 목표", "방향을 선택하세요", "스와이프 또는 방향키", "이정표", "가장자리는 연결돼요"],
  es: ["Puntos", "Meta de comida", "Elige una dirección", "Desliza o usa las flechas", "Hito", "Los bordes conectan"],
  "pt-BR": ["Pontos", "Meta de comida", "Escolha uma direção", "Deslize ou use as setas", "Marco", "As bordas se conectam"],
  fr: ["Score", "Objectif repas", "Choisissez une direction", "Glissez ou utilisez les flèches", "Palier", "Les bords communiquent"],
  de: ["Punkte", "Futterziel", "Wähle eine Richtung", "Wischen oder Pfeiltasten", "Meilenstein", "Ränder sind verbunden"],
  it: ["Punti", "Obiettivo cibo", "Scegli una direzione", "Scorri o usa le frecce", "Traguardo", "I bordi sono collegati"],
  ru: ["Счёт", "Цель еды", "Выберите направление", "Свайп или стрелки", "Рубеж", "Края соединены"],
  hi: ["स्कोर", "भोजन लक्ष्य", "दिशा चुनें", "स्वाइप या तीर इस्तेमाल करें", "पड़ाव", "किनारे जुड़े हैं"],
  ar: ["النقاط", "هدف الطعام", "اختر اتجاهاً", "اسحب أو استخدم الأسهم", "إنجاز", "الحواف متصلة"],
};
const arrows = { up: "↑", left: "←", down: "↓", right: "→" };
let previous = null;
let effect = null;
let effectAnimation = null;
let hud;
let cue;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");

function stopEffect() {
  effectAnimation?.cancel();
  effectAnimation = null;
  effect?.remove();
  effect = null;
}

function collect(cell) {
  stopEffect();
  const source = window.WPSnakeVisual?.cellPoint(cell);
  const target = hud.querySelector(".snake-score-value").getBoundingClientRect();
  hud.classList.remove("is-collected");
  // Animate the existing HUD without modifying its geometry or reward state.
  hud.getBoundingClientRect();
  hud.classList.add("is-collected");
  if (!source || reduced.matches) return;
  effect = document.createElement("span");
  effect.className = "snake-food-transfer";
  effect.textContent = "✦";
  effect.setAttribute("aria-hidden", "true");
  effect.style.left = `${source.x}px`;
  effect.style.top = `${source.y}px`;
  document.body.append(effect);
  effectAnimation = effect.animate([
    { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
    { transform: `translate(${target.x + target.width / 2 - source.x}px, ${target.y + target.height / 2 - source.y}px) scale(.4)`, opacity: 0 },
  ], { duration: 420, easing: "cubic-bezier(.2,.7,.3,1)" });
  effectAnimation.onfinish = stopEffect;
}

export function updateExperience(state, locale) {
  // Shared render writes the accessible board first; read that settled surface.
  queueMicrotask(() => {
    if (document.body.dataset.screen !== "battle") { stopEffect(); previous = null; return; }
    const c = labels[locale] || labels.en;
    const top = document.querySelector("#battleScreen .battle-top");
    if (!top) return;
    if (!hud) {
      hud = document.createElement("div");
      hud.className = "snake-hud";
      hud.dataset.runtimeLocalize = "off";
      hud.innerHTML = '<div class="snake-score"><span></span><strong class="snake-score-value"></strong></div><div class="snake-goal"><span></span><strong></strong><progress max="1" value="0"></progress></div>';
      top.append(hud);
      cue = document.createElement("div");
      cue.className = "snake-control-cue";
      cue.dataset.runtimeLocalize = "off";
      document.querySelector("#controls").before(cue);
    }
    const target = state.milestoneReached ? state.goalFood + 2 : state.goalFood;
    hud.querySelector(".snake-score span").textContent = c[0];
    hud.querySelector(".snake-score-value").textContent = String(state.score);
    hud.querySelector(".snake-goal span").textContent = c[1];
    hud.querySelector(".snake-goal strong").textContent = `${state.food} / ${target}`;
    const progress = hud.querySelector("progress");
    progress.max = target;
    progress.value = state.food;
    progress.setAttribute("aria-label", c[1]);
    const grid = document.querySelector(".snake-grid");
    const round = document.querySelector("#roundLabel");
    round.textContent = grid?.dataset.modeLabel || "";
    round.title = `${c[5]} · ${state.runNumber}`;
    cue.textContent = state.started ? c[3] : c[2];
    for (const control of document.querySelectorAll("#controls [data-action]")) {
      control.dataset.arrow = arrows[control.dataset.action];
      control.dataset.heading = String(state.started && state.direction === control.dataset.action);
    }
    if (previous && previous.run === state.runNumber && state.food > previous.food) collect(state.trail[0]);
    else if (!previous || previous.run !== state.runNumber) { stopEffect(); hud.classList.remove("is-collected"); }
    previous = { run: state.runNumber, food: state.food };
  });
}

new MutationObserver(() => {
  if (document.body.dataset.screen !== "battle") { stopEffect(); previous = null; }
}).observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });
window.addEventListener("pagehide", stopEffect);
