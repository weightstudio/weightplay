(function () {
  "use strict";
  const en = {
    loading: "Waking the garden breeze…", title: "Gust Garden", kicker: "A tiny wind puzzle", world: "Mosslight meadow",
    coverAlt: "Moss Shell Taro guiding seeds through a bright meadow garden", taroAlt: "Moss Shell Taro holding a seed beside a garden wind vane", intro: "Choose a seed, point the vane, and guide every seed to a flower without brushing a thorn.",
    fact1: "3 breezes", fact2: "Plan each gust", fact3: "Calm retry", start: "Open the garden", choose: "Choose a breeze", best: "Best: {count} gusts", noBest: "Best: —",
    chapter: "Breeze plots", stageHint: "Select a plot, then guide each seed one square at a time.", round: "Breeze plot", chooseDirection: "Choose a gust", gust: "Send gust", reset: "Reset plot", back: "Back to Main", settings: "Settings", close: "Close", sound: "Sound", on: "On", off: "Off", language: "Language",
    seed: "seed", flower: "flower", thorn: "thorn", empty: "open meadow", stage: "Plot {number}", progress: "{done} / {total} plots in bloom", prompt: "Select a seed, choose a direction, then send one gust.", selected: "Seed selected. Which way should the breeze push it?", moved: "The seed moved one square.", bloomed: "A flower opened! Guide the remaining seeds.", blocked: "That gust is blocked. Try another direction.", outside: "The meadow ends there. Try another direction.", occupied: "Another seed is resting there. Try another direction.", noSeed: "Choose a seed first.", noDirection: "Choose a gust direction first.", finished: "Plot in bloom", resultTitle: "The garden is breathing again!", resultText: "{name} opened in {checks} gusts. The seeds found their flowers.", next: "Next plot", directions: { up: "North", right: "East", down: "South", left: "West" }, status: "{locked} / {total} seeds blooming"
  };
  const zh = {
    loading: "喚醒花園微風……", title: "微風花園", kicker: "小小風向益智", world: "苔光草甸",
    coverAlt: "苔殼塔羅引導種子穿過明亮草甸花園", taroAlt: "苔殼塔羅拿著種子站在花園風向標旁", intro: "選一顆種子、指向風向，讓每顆種子抵達花朵並避開荊棘。",
    fact1: "3 座花圃", fact2: "規劃每陣風", fact3: "安心重試", start: "進入花園", choose: "選擇花圃", best: "最佳：{count} 陣風", noBest: "最佳：—",
    chapter: "微風花圃", stageHint: "選擇花圃，再一次引導一顆種子移動一格。", round: "微風花圃", chooseDirection: "選擇風向", gust: "送出微風", reset: "重設花圃", back: "返回主頁", settings: "設定", close: "關閉", sound: "音效", on: "開", off: "關", language: "語言",
    seed: "種子", flower: "花朵", thorn: "荊棘", empty: "草甸空地", stage: "第 {number} 座花圃", progress: "{done} / {total} 座花圃已開花", prompt: "選擇種子、選擇風向，再送出一陣微風。", selected: "已選擇種子。讓微風往哪裡吹？", moved: "種子移動了一格。", bloomed: "花朵開了！繼續引導其他種子。", blocked: "那個方向被擋住了，換個風向試試。", outside: "草甸到邊界了，換個風向試試。", occupied: "那裡有另一顆種子，換個風向試試。", noSeed: "請先選擇一顆種子。", noDirection: "請先選擇風向。", finished: "花圃開花", resultTitle: "花園重新呼吸了！", resultText: "{name} 用了 {checks} 陣風開花，種子都找到了花朵。", next: "下一座花圃", directions: { up: "北", right: "東", down: "南", left: "西" }, status: "{locked} / {total} 顆種子已開花"
  };
  window.GUST_GARDEN_LOCALES = { en, "zh-Hant": zh };
}());
