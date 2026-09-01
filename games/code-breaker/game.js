window.WPClassicLogic?.mount("code-breaker");

(() => {
  "use strict";

  const LOCALES = new Set(["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"]);
  const LOCALE_MAP = {
    "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es",
    "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar",
  };
  const GUIDE_COPY = {
    en: { ariaLabel: "Code Breaker game information", kicker: "WeightPlay Original Game Guide", title: "Code Breaker", intro: "Guess the hidden four-color code using exact-position and color-only clues.", gameplayLabel: "Gameplay", gameplay: "Pattern Deduction", genreLabel: "Genre", genre: "Classic · Puzzle · Strategy · Family", faq: "FAQ", question: "Is progress saved?", answer: "Yes, only in this browser." },
    "zh-Hant": { ariaLabel: "密碼推理 遊戲資訊", kicker: "WeightPlay 原創遊戲指南", title: "密碼推理", intro: "利用位置正確與顏色正確的提示，推理四格隱藏色碼。", gameplayLabel: "玩法", gameplay: "圖案推理", genreLabel: "類型", genre: "Classic · Puzzle · 策略 · 家庭", faq: "常見問題", question: "進度保存了嗎？", answer: "是的，僅在該瀏覽器中。" },
    "zh-Hans": { ariaLabel: "密码推理 游戏资讯", kicker: "WeightPlay 原创游戏指南", title: "密码推理", intro: "利用位置正确和颜色正确的提示，推理四格隐藏色码。", gameplayLabel: "玩法", gameplay: "图案推理", genreLabel: "类型", genre: "Classic · Puzzle · 策略 · 家庭", faq: "常见问题", question: "进度保存了吗？", answer: "是的，仅在该浏览器中。" },
    ja: { ariaLabel: "コードブレーカー のゲーム情報", kicker: "WeightPlay オリジナルゲームガイド", title: "コードブレーカー", intro: "位置一致と色一致のヒントで4色コードを推理します。", gameplayLabel: "ゲーム内容", gameplay: "パターン推理", genreLabel: "ジャンル", genre: "Classic · Puzzle · 戦略 · 家族", faq: "よくある質問", question: "進行状況は保存されますか?", answer: "はい、このブラウザでのみ可能です。" },
    ko: { ariaLabel: "코드 브레이커 게임 정보", kicker: "WeightPlay 오리지널 게임 가이드", title: "코드 브레이커", intro: "위치와 색상 힌트로 네 칸의 비밀 색 코드를 추리하세요.", gameplayLabel: "Gameplay", gameplay: "패턴 추리", genreLabel: "Genre", genre: "Classic · Puzzle · 전략 · 가족", faq: "FAQ", question: "진행 상황이 저장되나요?", answer: "예, 이 브라우저에서만 가능합니다." },
    es: { ariaLabel: "Guía de Descifra el código", kicker: "Guía de juegos originales de WeightPlay", title: "Descifra el código", intro: "Adivina el código de cuatro colores con pistas de posición y color.", gameplayLabel: "Cómo se juega", gameplay: "Deducción de patrones", genreLabel: "Género", genre: "Classic · Puzzle · Estrategia · familia", faq: "Preguntas frecuentes", question: "¿Se guarda el progreso?", answer: "Sí, sólo en este navegador." },
    "pt-BR": { ariaLabel: "Quebra-Código informações do jogo", kicker: "Guia de jogo original do WeightPlay", title: "Quebra-Código", intro: "Adivinhe o código de quatro cores com pistas de posição e cor.", gameplayLabel: "Gameplay", gameplay: "Dedução de padrões", genreLabel: "Genre", genre: "Classic · Puzzle · Estratégia · Família", faq: "FAQ", question: "O progresso é salvo?", answer: "Sim, apenas neste navegador." },
    fr: { ariaLabel: "Informations sur le jeu Casse-code", kicker: "Guide du jeu original WeightPlay", title: "Casse-code", intro: "Trouvez le code de quatre couleurs grâce aux indices de position et de couleur.", gameplayLabel: "Type de jeu", gameplay: "Déduction de motifs", genreLabel: "Genre", genre: "Classic · Puzzle · Stratégie · Famille", faq: "Questions fréquentes", question: "La progression est-elle enregistrée ?", answer: "Oui, uniquement dans ce navigateur." },
    de: { ariaLabel: "Spielanleitung für Codeknacker", kicker: "WeightPlay-Leitfaden für Originalspiele", title: "Codeknacker", intro: "Errate den Vierfarben-Code mit Positions- und Farbhilfen.", gameplayLabel: "Spielweise", gameplay: "Musterlogik", genreLabel: "Genre", genre: "Classic · Puzzle · Strategie · Familie", faq: "Häufige Fragen", question: "Wird der Fortschritt gespeichert?", answer: "Ja, nur in diesem Browser." },
    it: { ariaLabel: "Codice segreto informazioni sul gioco", kicker: "Guida al gioco originale WeightPlay", title: "Codice segreto", intro: "Indovina il codice di quattro colori con indizi di posizione e colore.", gameplayLabel: "Gameplay", gameplay: "Deduzione di schemi", genreLabel: "Genre", genre: "Classic · Puzzle · Strategia · Famiglia", faq: "FAQ", question: "I progressi vengono salvati?", answer: "Sì, solo in questo browser." },
    ru: { ariaLabel: "Взломщик кодов информация об игре", kicker: "Оригинальное игровое руководство WeightPlay", title: "Взломщик кодов", intro: "Угадайте код из четырёх цветов по подсказкам позиции и цвета.", gameplayLabel: "Gameplay", gameplay: "Логика узора", genreLabel: "Genre", genre: "Classic · Puzzle · Стратегия · Семья", faq: "FAQ", question: "Прогресс сохраняется?", answer: "Да, только в этом браузере." },
    hi: { ariaLabel: "कोड ब्रेकर खेल की जानकारी", kicker: "WeightPlay मौलिक गेम गाइड", title: "कोड ब्रेकर", intro: "स्थान और रंग संकेतों से चार रंगों का कोड खोजें।", gameplayLabel: "Gameplay", gameplay: "पैटर्न तर्क", genreLabel: "Genre", genre: "Classic · Puzzle · रणनीति · परिवार", faq: "FAQ", question: "क्या प्रगति सहेजी गई है?", answer: "हाँ, केवल इस ब्राउज़र में." },
    ar: { ariaLabel: "دليل لعبة كاسر الشفرة", kicker: "دليل ألعاب WeightPlay الأصلية", title: "كاسر الشفرة", intro: "خمّن رمزًا من أربعة ألوان باستخدام تلميحات الموضع واللون.", gameplayLabel: "طريقة اللعب", gameplay: "استنتاج الأنماط", genreLabel: "النوع", genre: "Classic · Puzzle · الإستراتيجية · العائلة", faq: "الأسئلة الشائعة", question: "هل يتم حفظ التقدم؟", answer: "نعم، فقط في هذا المتصفح." },
  };

  const locale = () => {
    const value = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || LOCALE_MAP[window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()] || "en";
    return LOCALES.has(value) ? value : "en";
  };

  const syncGuidePanel = () => {
    const panel = document.querySelector(".game-page-info-static");
    if (!panel) return;
    const copy = GUIDE_COPY[locale()] || GUIDE_COPY.en;
    const setText = (selector, value) => {
      const node = panel.querySelector(selector);
      if (node && node.textContent !== value) node.textContent = value;
    };
    panel.setAttribute("aria-label", copy.ariaLabel);
    setText(".game-info-kicker", copy.kicker);
    setText(".game-info-title h2", copy.title);
    setText(".game-info-title p", copy.intro);
    const facts = panel.querySelectorAll(".game-info-fact");
    if (facts[0]) {
      setText(".game-info-fact:nth-child(1) span", copy.gameplayLabel);
      setText(".game-info-fact:nth-child(1) strong", copy.gameplay);
    }
    if (facts[1]) {
      setText(".game-info-fact:nth-child(2) span", copy.genreLabel);
      setText(".game-info-fact:nth-child(2) strong", copy.genre);
    }
    setText(".game-info-section h3", copy.faq);
    setText(".game-info-section dt", copy.question);
    setText(".game-info-section dd", copy.answer);
    panel.dataset.codeBreakerLocale = locale();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", syncGuidePanel, { once: true });
  else syncGuidePanel();
})();
