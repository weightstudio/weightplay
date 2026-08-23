window.WPClassicLogic?.mount("lights-out");

(() => {
  const GUIDE_COPY = {
    en: { guideLabel: "Lights Out game information", kicker: "WeightPlay Kids Game Guide", title: "Lights Out", intro: "Switch a tile and its neighbors to turn every light off.", gameplayLabel: "Gameplay", gameplay: "Switch Puzzle", genreLabel: "Genre", genre: "Classic · Puzzle · Strategy · Family", faq: "FAQ", question: "Is progress saved?", answer: "Yes, only in this browser." },
    "zh-Hant": { guideLabel: "熄燈遊戲 遊戲資訊", kicker: "WeightPlay 兒童遊戲指南", title: "熄燈遊戲", intro: "點擊一格與鄰近格，關掉全部燈並挑戰最少步數。", gameplayLabel: "玩法", gameplay: "開關益智", genreLabel: "類型", genre: "Classic · Puzzle · 策略 · 家庭", faq: "常見問題", question: "進度保存了嗎？", answer: "是的，僅在該瀏覽器中。" },
    "zh-Hans": { guideLabel: "熄灯游戏 游戏资讯", kicker: "WeightPlay 儿童游戏指南", title: "熄灯游戏", intro: "点击一格及相邻格，关掉所有灯并挑战最少步数。", gameplayLabel: "玩法", gameplay: "开关益智", genreLabel: "类型", genre: "Classic · Puzzle · 策略 · 家庭", faq: "常见问题", question: "进度保存了吗？", answer: "是的，仅在该浏览器中。" },
    ja: { guideLabel: "ライツアウト のゲーム情報", kicker: "WeightPlay ゲームガイド", title: "ライツアウト", intro: "マスと上下左右を切り替え、すべての灯りを消します。", gameplayLabel: "ゲーム内容", gameplay: "スイッチパズル", genreLabel: "ジャンル", genre: "Classic · Puzzle · 戦略 · 家族", faq: "よくある質問", question: "進行状況は保存されますか?", answer: "はい、このブラウザでのみ可能です。" },
    ko: { guideLabel: "라이트 아웃 게임 정보", kicker: "WeightPlay 어린이 게임 가이드", title: "라이트 아웃", intro: "칸과 상하좌우를 바꿔 모든 불을 끄세요.", gameplayLabel: "Gameplay", gameplay: "스위치 퍼즐", genreLabel: "Genre", genre: "Classic · Puzzle · 전략 · 가족", faq: "FAQ", question: "진행 상황이 저장되나요?", answer: "예, 이 브라우저에서만 가능합니다." },
    es: { guideLabel: "Guía de Apaga las luces", kicker: "Guía de juegos Kids de WeightPlay", title: "Apaga las luces", intro: "Cambia una casilla y sus vecinas para apagar todas las luces.", gameplayLabel: "Cómo se juega", gameplay: "Puzzle de interruptores", genreLabel: "Género", genre: "Classic · Puzzle · Estrategia · familia", faq: "Preguntas frecuentes", question: "¿Se guarda el progreso?", answer: "Sí, sólo en este navegador." },
    "pt-BR": { guideLabel: "Apague as Luzes informações do jogo", kicker: "WeightPlay Guia do jogo infantil", title: "Apague as Luzes", intro: "Alterne uma casa e suas vizinhas para apagar todas as luzes.", gameplayLabel: "Gameplay", gameplay: "Puzzle de interruptores", genreLabel: "Genre", genre: "Classic · Puzzle · Estratégia · Família", faq: "FAQ", question: "O progresso é salvo?", answer: "Sim, apenas neste navegador." },
    fr: { guideLabel: "Informations sur le jeu Extinction des lumières", kicker: "Guide de jeu WeightPlay pour enfants", title: "Extinction des lumières", intro: "Basculez une case et ses voisines pour tout éteindre.", gameplayLabel: "Type de jeu", gameplay: "Puzzle de boutons", genreLabel: "Genre", genre: "Classic · Puzzle · Stratégie · Famille", faq: "Questions fréquentes", question: "La progression est-elle enregistrée ?", answer: "Oui, uniquement dans ce navigateur." },
    de: { guideLabel: "Spielanleitung für Licht aus", kicker: "WeightPlay Kids-Spielanleitung", title: "Licht aus", intro: "Schalte ein Feld samt Nachbarn und lösche alle Lichter.", gameplayLabel: "Spielweise", gameplay: "Schalterrätsel", genreLabel: "Genre", genre: "Classic · Puzzle · Strategie · Familie", faq: "Häufige Fragen", question: "Wird der Fortschritt gespeichert?", answer: "Ja, nur in diesem Browser." },
    it: { guideLabel: "Spegni le luci informazioni sul gioco", kicker: "WeightPlay Guida ai giochi per bambini", title: "Spegni le luci", intro: "Inverti una casella e le vicine per spegnerle tutte.", gameplayLabel: "Gameplay", gameplay: "Puzzle di interruttori", genreLabel: "Genre", genre: "Classic · Puzzle · Strategia · Famiglia", faq: "FAQ", question: "I progressi vengono salvati?", answer: "Sì, solo in questo browser." },
    ru: { guideLabel: "Погаси свет информация об игре", kicker: "WeightPlay Руководство по игре для детей", title: "Погаси свет", intro: "Переключайте клетку и соседей, чтобы погасить все огни.", gameplayLabel: "Gameplay", gameplay: "Головоломка с переключателями", genreLabel: "Genre", genre: "Classic · Puzzle · Стратегия · Семья", faq: "FAQ", question: "Прогресс сохраняется?", answer: "Да, только в этом браузере." },
    hi: { guideLabel: "लाइट्स आउट खेल की जानकारी", kicker: "WeightPlay किड्स गेम गाइड", title: "लाइट्स आउट", intro: "खाने और उसके पड़ोसियों को बदलकर सभी लाइट बंद करें।", gameplayLabel: "Gameplay", gameplay: "स्विच पहेली", genreLabel: "Genre", genre: "Classic · Puzzle · रणनीति · परिवार", faq: "FAQ", question: "क्या प्रगति सहेजी गई है?", answer: "हाँ, केवल इस ब्राउज़र में." },
    ar: { guideLabel: "دليل لعبة إطفاء الأنوار", kicker: "دليل ألعاب WeightPlay للأطفال", title: "إطفاء الأنوار", intro: "بدّل الخلية وجيرانها لإطفاء كل الأضواء.", gameplayLabel: "طريقة اللعب", gameplay: "لغز المفاتيح", genreLabel: "النوع", genre: "Classic · Puzzle · الإستراتيجية · العائلة", faq: "الأسئلة الشائعة", question: "هل يتم حفظ التقدم؟", answer: "نعم، فقط في هذا المتصفح." },
  };
  const LOCALE_ALIASES = { "zh-tw": "zh-Hant", "zh-hant": "zh-Hant", "zh-cn": "zh-Hans", "zh-hans": "zh-Hans", "pt-br": "pt-BR" };
  const locale = () => {
    const raw = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
    return GUIDE_COPY[raw] ? raw : LOCALE_ALIASES[String(raw).toLowerCase()] || "en";
  };
  const syncGuide = () => {
    const panel = document.querySelector(".game-page-info-static");
    if (!panel) return;
    const copy = GUIDE_COPY[locale()] || GUIDE_COPY.en;
    panel.setAttribute("aria-label", copy.guideLabel);
    panel.querySelector(".game-info-kicker")?.replaceChildren(document.createTextNode(copy.kicker));
    panel.querySelector(".game-info-title h2")?.replaceChildren(document.createTextNode(copy.title));
    panel.querySelector(".game-info-title p")?.replaceChildren(document.createTextNode(copy.intro));
    const facts = panel.querySelectorAll(".game-info-fact");
    if (facts[0]) { facts[0].querySelector("span")?.replaceChildren(document.createTextNode(copy.gameplayLabel)); facts[0].querySelector("strong")?.replaceChildren(document.createTextNode(copy.gameplay)); }
    if (facts[1]) { facts[1].querySelector("span")?.replaceChildren(document.createTextNode(copy.genreLabel)); facts[1].querySelector("strong")?.replaceChildren(document.createTextNode(copy.genre)); }
    panel.querySelector(".game-info-section h3")?.replaceChildren(document.createTextNode(copy.faq));
    panel.querySelector(".game-info-section dt")?.replaceChildren(document.createTextNode(copy.question));
    panel.querySelector(".game-info-section dd")?.replaceChildren(document.createTextNode(copy.answer));
    panel.dataset.lightsOutLocale = locale();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", syncGuide, { once: true });
  else syncGuide();
})();
