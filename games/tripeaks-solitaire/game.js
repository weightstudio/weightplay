(function () {
  "use strict";
  const PEAK_PROGRESS_COPY = Object.freeze({
    en: { label: "Peaks", aria: "Peaks cleared: {cleared} of 3" },
    "zh-Hant": { label: "峰頂", aria: "已清除峰頂：{cleared}/3" },
    "zh-Hans": { label: "峰顶", aria: "已清除峰顶：{cleared}/3" },
    ja: { label: "ピーク", aria: "クリアしたピーク：{cleared}/3" },
    ko: { label: "피크", aria: "클리어한 피크: {cleared}/3" },
    es: { label: "Cimas", aria: "Cimas despejadas: {cleared} de 3" },
    "pt-BR": { label: "Picos", aria: "Picos limpos: {cleared} de 3" },
    fr: { label: "Pics", aria: "Pics dégagés : {cleared} sur 3" },
    de: { label: "Gipfel", aria: "Geräumte Gipfel: {cleared} von 3" },
    it: { label: "Cime", aria: "Cime liberate: {cleared} su 3" },
    ru: { label: "Вершины", aria: "Очищено вершин: {cleared} из 3" },
    hi: { label: "चोटियाँ", aria: "साफ़ की गई चोटियाँ: {cleared} में से 3" },
    ar: { label: "القمم", aria: "القمم المُنظّفة: {cleared} من 3" },
  });

  const ensurePeakProgress = () => {
    const header = document.querySelector("#battleScreen .battle-header");
    if (!header) return null;
    const existing = document.getElementById("tripeaksPeakProgress");
    if (existing) return existing;
    const stat = document.createElement("div");
    stat.id = "tripeaksPeakProgress";
    stat.className = "header-stat tripeaks-progress-stat";
    stat.setAttribute("aria-live", "polite");
    stat.innerHTML = '<small id="tripeaksPeakProgressLabel">Peaks</small><strong id="tripeaksPeakProgressValue" aria-label="Peaks cleared: 0 of 3">0/3</strong>';
    header.append(stat);
    return stat;
  };

  const updatePeakProgress = (view) => {
    const stat = ensurePeakProgress();
    const label = document.getElementById("tripeaksPeakProgressLabel");
    const value = document.getElementById("tripeaksPeakProgressValue");
    if (!view?.game || !stat || !label || !value) return;
    const copy = PEAK_PROGRESS_COPY[view.locale] || PEAK_PROGRESS_COPY.en;
    const cleared = view.game.cards.filter((entry) => entry.row === 0 && entry.removed).length;
    label.textContent = copy.label;
    value.textContent = `${cleared}/3`;
    value.setAttribute("aria-label", copy.aria.replace("{cleared}", String(cleared)));
    stat.dataset.cleared = String(cleared);
    stat.dataset.complete = String(cleared === 3);
  };

  const mount = () => {
    const mainReturn = document.querySelector(".main-return");
    if (mainReturn && !mainReturn.querySelector("img")) {
      const logo = document.createElement("img");
      logo.src = "../../assets/weightplay-logo.png";
      logo.alt = "";
      mainReturn.append(logo);
    }
    document.getElementById("battleBackBtn")?.setAttribute("data-wp-return", "battle");
    const view = window.WPClassicSolitaire?.mount({ variant: "tripeaks", id: "tripeaks-solitaire" });
    if (!view) return;
    const render = view.render.bind(view);
    view.render = (...args) => {
      const result = render(...args);
      updatePeakProgress(view);
      return result;
    };
    updatePeakProgress(view);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
