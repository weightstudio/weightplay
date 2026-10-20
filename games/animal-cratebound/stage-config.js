/* Cratebound Stage records only; WeightPlayPlayUI owns card geometry and input. */
(() => {
  "use strict";
  const statusCopy = {
    en: ["Ready", "Locked", "Cleared · Replay"],
    "zh-Hant": ["準備出發", "未解鎖", "已完成 · 重玩"],
    "zh-Hans": ["准备出发", "未解锁", "已完成 · 重玩"],
    ja: ["挑戦可能", "ロック中", "クリア済み · 再挑戦"],
    ko: ["준비 완료", "잠김", "완료 · 다시 플레이"],
    es: ["Disponible", "Bloqueado", "Completado · Repetir"],
    "pt-BR": ["Pronto", "Bloqueado", "Concluído · Repetir"],
    fr: ["Prêt", "Verrouillé", "Terminé · Rejouer"],
    de: ["Bereit", "Gesperrt", "Geschafft · Wiederholen"],
    it: ["Pronto", "Bloccato", "Completato · Rigioca"],
    ru: ["Готово", "Закрыто", "Пройдено · Повтор"],
    hi: ["तैयार", "लॉक है", "पूरा · फिर खेलें"],
    ar: ["جاهز", "مقفل", "مكتمل · أعد اللعب"],
  };
  function localeKey() {
    const raw = window.WonderI18n?.actualLocale?.()
      || window.WonderI18n?.locale?.()
      || document.documentElement.lang
      || "en";
    if (/^zh-(tw|hant)/i.test(raw)) return "zh-Hant";
    if (/^zh/i.test(raw)) return "zh-Hans";
    if (/^pt/i.test(raw)) return "pt-BR";
    return raw.split("-")[0];
  }
  function makeStageTitle(template, index) {
    const number = new Intl.NumberFormat(localeKey()).format(index + 1);
    return String(template || "Stage {n}").replace(/\{n\}/gu, number);
  }
  window.AnimalCrateboundStageConfig = Object.freeze({
    create(bridge) {
      return {
        count: 30,
        poster: "/assets/animal-cratebound/cover.webp",
        background: "/assets/lobby-block-atmosphere.svg",
        stage(index) {
          const context = bridge.context;
          const config = window.BlockTrilogyConfig || {};
          const number = index + 1;
          const unlocked = Math.max(1, Math.min(30, Number(context?.save?.unlocked) || 1));
          const locked = number > unlocked;
          const cleared = Boolean(context?.save?.cleared?.[number]);
          const chapterIndex = context?.chapterFor?.(number) ?? Math.floor(index / 5);
          const chapter = context?.chapters?.[chapterIndex] || "";
          const [ready, lockedLabel, clearedLabel] = statusCopy[localeKey()] || statusCopy.en;
          const objective = config.objective || config.pitch || "Dock every rune crate without trapping it.";
          const details = [config.pitch, objective].filter(Boolean);
          return {
            id: number,
            kicker: chapter,
            title: makeStageTitle(config.localeCopy?.stage, index),
            subtitle: objective,
            status: locked ? lockedLabel : cleared ? clearedLabel : ready,
            summary: objective,
            details,
            locked,
            cleared,
            poster: "/assets/animal-cratebound/cover.webp",
            posterPosition: "center",
          };
        },
      };
    },
  });
})();
