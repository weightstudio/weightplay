window.WPClassicLogic?.mount("lights-out");

(() => {
  const GUIDE_COPY = {
    en: { guideLabel: "Lights Out game information", kicker: "WeightPlay Original Game Guide", title: "Lights Out", intro: "Switch a tile and its neighbors to turn every light off.", gameplayLabel: "Gameplay", gameplay: "Switch Puzzle", genreLabel: "Genre", genre: "Classic · Puzzle · Strategy · Family", faq: "FAQ", question: "What happens after a solve?", answer: "The result shows the move count and offers Replay, Menu, and Close." },
    "zh-Hant": { guideLabel: "熄燈遊戲 遊戲資訊", kicker: "WeightPlay 原創遊戲指南", title: "熄燈遊戲", intro: "點擊一格與鄰近格，關掉全部燈並挑戰最少步數。", gameplayLabel: "玩法", gameplay: "開關益智", genreLabel: "類型", genre: "Classic · Puzzle · 策略 · 家庭", faq: "常見問題", question: "解開棋盤後會怎樣？", answer: "結果畫面會顯示步數，並提供重玩、主頁與關閉。" },
    "zh-Hans": { guideLabel: "熄灯游戏 游戏资讯", kicker: "WeightPlay 原创游戏指南", title: "熄灯游戏", intro: "点击一格及相邻格，关掉所有灯并挑战最少步数。", gameplayLabel: "玩法", gameplay: "开关益智", genreLabel: "类型", genre: "Classic · Puzzle · 策略 · 家庭", faq: "常见问题", question: "解开棋盘后会怎样？", answer: "结果页面会显示步数，并提供重玩、菜单和关闭。" },
    ja: { guideLabel: "ライツアウト のゲーム情報", kicker: "WeightPlay オリジナルゲームガイド", title: "ライツアウト", intro: "マスと上下左右を切り替え、すべての灯りを消します。", gameplayLabel: "ゲーム内容", gameplay: "スイッチパズル", genreLabel: "ジャンル", genre: "Classic · Puzzle · 戦略 · 家族", faq: "よくある質問", question: "解けた後はどうなりますか?", answer: "結果には手数が表示され、リプレイ、メニュー、閉じるを選べます。" },
    ko: { guideLabel: "라이트 아웃 게임 정보", kicker: "WeightPlay 오리지널 게임 가이드", title: "라이트 아웃", intro: "칸과 상하좌우를 바꿔 모든 불을 끄세요.", gameplayLabel: "Gameplay", gameplay: "스위치 퍼즐", genreLabel: "Genre", genre: "Classic · Puzzle · 전략 · 가족", faq: "FAQ", question: "퍼즐을 풀면 어떻게 되나요?", answer: "결과에서 이동 횟수를 보여 주고 다시 하기, 메뉴, 닫기를 제공합니다." },
    es: { guideLabel: "Guía de Apaga las luces", kicker: "Guía de juego original de WeightPlay", title: "Apaga las luces", intro: "Cambia una casilla y sus vecinas para apagar todas las luces.", gameplayLabel: "Cómo se juega", gameplay: "Puzzle de interruptores", genreLabel: "Género", genre: "Classic · Puzzle · Estrategia · familia", faq: "Preguntas frecuentes", question: "¿Qué ocurre al resolverlo?", answer: "El resultado muestra los movimientos y ofrece Repetir, Menú y Cerrar." },
    "pt-BR": { guideLabel: "Apague as Luzes informações do jogo", kicker: "Guia de jogo original do WeightPlay", title: "Apague as Luzes", intro: "Alterne uma casa e suas vizinhas para apagar todas as luzes.", gameplayLabel: "Gameplay", gameplay: "Puzzle de interruptores", genreLabel: "Genre", genre: "Classic · Puzzle · Estratégia · Família", faq: "FAQ", question: "O que acontece ao resolver o tabuleiro?", answer: "O Resultado mostra o número de movimentos e oferece Rejogar, Menu e Fechar." },
    fr: { guideLabel: "Informations sur le jeu Extinction des lumières", kicker: "Guide de jeu original WeightPlay", title: "Extinction des lumières", intro: "Basculez une case et ses voisines pour tout éteindre.", gameplayLabel: "Type de jeu", gameplay: "Puzzle de boutons", genreLabel: "Genre", genre: "Classic · Puzzle · Stratégie · Famille", faq: "Questions fréquentes", question: "Que se passe-t-il après la résolution ?", answer: "Le résultat affiche le nombre de coups et propose Rejouer, Menu et Fermer." },
    de: { guideLabel: "Spielanleitung für Licht aus", kicker: "WeightPlay Original-Spielanleitung", title: "Licht aus", intro: "Schalte ein Feld samt Nachbarn und lösche alle Lichter.", gameplayLabel: "Spielweise", gameplay: "Schalterrätsel", genreLabel: "Genre", genre: "Classic · Puzzle · Strategie · Familie", faq: "Häufige Fragen", question: "Was passiert nach dem Lösen?", answer: "Das Ergebnis zeigt die Zugzahl und bietet Erneut spielen, Menü und Schließen." },
    it: { guideLabel: "Spegni le luci informazioni sul gioco", kicker: "Guida al gioco originale WeightPlay", title: "Spegni le luci", intro: "Inverti una casella e le vicine per spegnerle tutte.", gameplayLabel: "Gameplay", gameplay: "Puzzle di interruttori", genreLabel: "Genre", genre: "Classic · Puzzle · Strategia · Famiglia", faq: "FAQ", question: "Cosa succede dopo la soluzione?", answer: "Il risultato mostra il numero di mosse e offre Rigioca, Menu e Chiudi." },
    ru: { guideLabel: "Погаси свет информация об игре", kicker: "Руководство по оригинальной игре WeightPlay", title: "Погаси свет", intro: "Переключайте клетку и соседей, чтобы погасить все огни.", gameplayLabel: "Gameplay", gameplay: "Головоломка с переключателями", genreLabel: "Genre", genre: "Classic · Puzzle · Стратегия · Семья", faq: "FAQ", question: "Что происходит после решения?", answer: "Результат показывает число ходов и предлагает повторить игру, открыть меню или закрыть его." },
    hi: { guideLabel: "लाइट्स आउट खेल की जानकारी", kicker: "WeightPlay मूल गेम गाइड", title: "लाइट्स आउट", intro: "खाने और उसके पड़ोसियों को बदलकर सभी लाइट बंद करें।", gameplayLabel: "Gameplay", gameplay: "स्विच पहेली", genreLabel: "Genre", genre: "Classic · Puzzle · रणनीति · परिवार", faq: "FAQ", question: "हल करने के बाद क्या होता है?", answer: "परिणाम में चालों की संख्या दिखती है और फिर से खेलें, मेन्यू या बंद करने के विकल्प मिलते हैं।" },
    ar: { guideLabel: "دليل لعبة إطفاء الأنوار", kicker: "دليل ألعاب WeightPlay الأصلية", title: "إطفاء الأنوار", intro: "بدّل الخلية وجيرانها لإطفاء كل الأضواء.", gameplayLabel: "طريقة اللعب", gameplay: "لغز المفاتيح", genreLabel: "النوع", genre: "Classic · Puzzle · الإستراتيجية · العائلة", faq: "الأسئلة الشائعة", question: "ماذا يحدث بعد حل اللغز؟", answer: "تعرض النتيجة عدد النقلات وتوفر خيارات إعادة اللعب والقائمة والإغلاق." },
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
