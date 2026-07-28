(() => {
  "use strict";

  const en = {
    label: "English",
    title: "Unblock Trail",
    shortTitle: "UNBLOCK",
    language: "Language",
    returnLobby: "Return to WeightPlay",
    back: "Back",
    coverAlt: "Panko moving trail blocks through a bamboo grove",
    boardLabel: "Unblock Trail game board",
    kicker: "PANKO'S SLIDE PUZZLE",
    summary:
      "Slide every block and guide the red explorer out through the gate.",
    start: "Start game",
    guideTitle: "How to play",
    guideBody:
      "Drag a block along its direction. Move the red explorer to the right exit. Thousands of deterministic trails are available.",
    choose: "CHOOSE A TRAIL",
    stageList: "Trail list",
    open: "Open trail",
    trail: "Trail {n}",
    progress: "{done}/30 cleared",
    locked: "Clear the previous trail first.",
    chapter: "CHAPTER {n}",
    moves: "{n} moves",
    exit: "Exit",
    hint: "Hint",
    restart: "Restart",
    undo: "Undo",
    status:
      "Clear the right lane, then drag the red block into the glowing exit.",
    complete: "TRAIL CLEARED",
    resultTitle: "Panko escaped!",
    resultBody: "Trail {n} cleared in {moves} moves.",
    retry: "Play again",
    next: "Next trail",
    colors: ["mist", "stone", "mint", "sky", "sun"],
  };

  const zhHant = {
    label: "繁體中文",
    title: "解鎖滑塊",
    shortTitle: "解鎖滑塊",
    language: "語言",
    returnLobby: "返回 WeightPlay",
    back: "返回",
    coverAlt: "熊貓角色在竹林中移動方塊開路",
    boardLabel: "暢通小徑遊戲盤",
    kicker: "PANKO 的滑塊拼圖",
    summary: "滑動每個方塊，帶領紅色探險家穿過出口。",
    start: "開始遊戲",
    guideTitle: "遊戲玩法",
    guideBody:
      "沿著方塊可移動的方向拖曳。將紅色探險家移到右側出口。遊戲提供數千條可重現的小徑。",
    choose: "選擇一條小徑",
    stageList: "小徑列表",
    open: "開啟小徑",
    trail: "小徑 {n}",
    progress: "已通關 {done}/30",
    locked: "請先完成上一條小徑。",
    chapter: "第 {n} 章",
    moves: "{n} 步",
    exit: "出口",
    hint: "提示",
    restart: "重新開始",
    undo: "復原",
    status: "清出右側路線，再把紅色方塊拖進發光出口。",
    complete: "小徑已通關",
    resultTitle: "紅色探險家成功脫困！",
    resultBody: "小徑 {n} 以 {moves} 步通關。",
    retry: "再玩一次",
    next: "下一條小徑",
    colors: ["薄霧", "岩石", "薄荷", "天空", "陽光"],
  };

  const labels = {
    en: "English",
    "zh-Hant": "繁體中文",
    "zh-Hans": "简体中文",
    ja: "日本語",
    ko: "한국어",
    es: "Español",
    "pt-BR": "Português",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    ru: "Русский",
    hi: "हिन्दी",
    ar: "العربية",
  };

  const locales = Object.fromEntries(
    Object.entries(labels).map(([code, label]) => [code, { ...en, label }]),
  );
  locales["zh-Hant"] = { ...en, ...zhHant };
  window.UNBLOCK_LOCALES = locales;
})();
