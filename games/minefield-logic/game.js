window.WPClassicLogic?.mount("minefield-logic");

(() => {
  "use strict";

  const GAME_VERSION = "v8";
  const LOCALES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const ROUTE_LOCALES = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const GUIDE_COPY = {
    en: { title: "Minefield Logic", preview: "Owner Preview · Not public", kicker: "WeightPlay Game Guide", tagline: "Reveal safe cells, read the numbers, and mark every hidden mine.", gameplay: "Gameplay", gameplayType: "Deduction Puzzle", typeLabel: "Genre", type: "Classic · Puzzle · Strategy · Family", faq: "FAQ", question: "Is progress saved?", answer: "Yes, only in this browser." },
    "zh-Hant": { title: "地雷邏輯", preview: "擁有者預覽 · 尚未公開", kicker: "WeightPlay 遊戲指南", tagline: "翻開安全格、讀懂數字，標記所有隱藏地雷。", gameplay: "玩法", gameplayType: "推理益智", typeLabel: "類型", type: "經典 · 益智 · 策略 · 親子", faq: "常見問題", question: "進度保存了嗎？", answer: "是的，僅在該瀏覽器中。" },
    "zh-Hans": { title: "地雷逻辑", preview: "所有者预览 · 尚未公开", kicker: "WeightPlay 游戏指南", tagline: "翻开安全格、读懂数字，标记所有隐藏地雷。", gameplay: "玩法", gameplayType: "推理益智", typeLabel: "类型", type: "经典 · 益智 · 策略 · 亲子", faq: "常见问题", question: "进度保存了吗？", answer: "是的，仅在该浏览器中。" },
    ja: { title: "マインフィールド・ロジック", preview: "オーナープレビュー · 未公開", kicker: "WeightPlay ゲームガイド", tagline: "安全なマスを開き、数字を読み、隠れた地雷すべてに印を付けます。", gameplay: "遊び方", gameplayType: "推理パズル", typeLabel: "ジャンル", type: "クラシック · パズル · 戦略 · ファミリー", faq: "よくある質問", question: "進行状況は保存されますか?", answer: "はい、このブラウザでのみ可能です。" },
    ko: { title: "마인필드 로직", preview: "소유자 미리보기 · 공개 전", kicker: "WeightPlay 게임 가이드", tagline: "안전한 칸을 열고 숫자를 읽어 숨은 지뢰를 모두 표시하세요.", gameplay: "게임플레이", gameplayType: "추리 퍼즐", typeLabel: "장르", type: "클래식 · 퍼즐 · 전략 · 가족", faq: "자주 묻는 질문", question: "진행 상황이 저장되나요?", answer: "예, 이 브라우저에서만 가능합니다." },
    es: { title: "Lógica del campo minado", preview: "Vista previa del propietario · No público", kicker: "Guía de juegos de WeightPlay", tagline: "Descubre casillas seguras, lee los números y marca todas las minas ocultas.", gameplay: "Cómo se juega", gameplayType: "Rompecabezas de deducción", typeLabel: "Género", type: "Clásico · Puzzle · Estrategia · Familiar", faq: "Preguntas frecuentes", question: "¿Se guarda el progreso?", answer: "Sí, sólo en este navegador." },
    "pt-BR": { title: "Lógica do Campo Minado", preview: "Prévia do proprietário · Não público", kicker: "Guia de jogos WeightPlay", tagline: "Abra casas seguras, leia os números e marque todas as minas ocultas.", gameplay: "Jogabilidade", gameplayType: "Quebra-cabeça de dedução", typeLabel: "Gênero", type: "Clássico · Quebra-cabeça · Estratégia · Família", faq: "Perguntas frequentes", question: "O progresso é salvo?", answer: "Sim, apenas neste navegador." },
    fr: { title: "Logique du champ miné", preview: "Aperçu du propriétaire · Non public", kicker: "Guide de jeu WeightPlay", tagline: "Ouvrez les cases sûres, lisez les chiffres et marquez toutes les mines cachées.", gameplay: "Jouabilité", gameplayType: "Puzzle de déduction", typeLabel: "Genre", type: "Classique · Puzzle · Stratégie · Famille", faq: "Questions fréquentes", question: "La progression est-elle enregistrée ?", answer: "Oui, uniquement dans ce navigateur." },
    de: { title: "Minenfeld-Logik", preview: "Besitzervorschau · Nicht öffentlich", kicker: "WeightPlay-Spielehilfe", tagline: "Öffne sichere Felder, lies die Zahlen und markiere alle Minen.", gameplay: "Spielweise", gameplayType: "Logikrätsel", typeLabel: "Genre", type: "Klassisch · Puzzle · Strategie · Familie", faq: "Häufige Fragen", question: "Wird der Fortschritt gespeichert?", answer: "Ja, nur in diesem Browser." },
    it: { title: "Logica del campo minato", preview: "Anteprima del proprietario · Non pubblico", kicker: "Guida ai giochi WeightPlay", tagline: "Scopri le caselle sicure, leggi i numeri e segnala tutte le mine nascoste.", gameplay: "Gameplay", gameplayType: "Puzzle deduttivo", typeLabel: "Genere", type: "Classico · Puzzle · Strategia · Famiglia", faq: "Domande frequenti", question: "I progressi vengono salvati?", answer: "Sì, solo in questo browser." },
    ru: { title: "Логика минного поля", preview: "Предпросмотр владельца · Не опубликовано", kicker: "Гид по играм WeightPlay", tagline: "Открывайте безопасные клетки, читайте числа и отмечайте все скрытые мины.", gameplay: "Геймплей", gameplayType: "Логическая головоломка", typeLabel: "Жанр", type: "Классика · Головоломка · Стратегия · Семейная", faq: "Частые вопросы", question: "Прогресс сохраняется?", answer: "Да, только в этом браузере." },
    hi: { title: "माइनफील्ड लॉजिक", preview: "स्वामी पूर्वावलोकन · सार्वजनिक नहीं", kicker: "WeightPlay गेम गाइड", tagline: "सुरक्षित खाने खोलें, संख्याएँ पढ़ें और सभी छिपी खानों को चिह्नित करें।", gameplay: "गेमप्ले", gameplayType: "तर्क पहेली", typeLabel: "शैली", type: "क्लासिक · पहेली · रणनीति · परिवार", faq: "अक्सर पूछे जाने वाले प्रश्न", question: "क्या प्रगति सहेजी गई है?", answer: "हाँ, केवल इस ब्राउज़र में।" },
    ar: { title: "منطق حقل الألغام", preview: "معاينة المالك · غير منشورة", kicker: "دليل ألعاب WeightPlay", tagline: "افتح الخلايا الآمنة واقرأ الأرقام وحدد الألغام.", gameplay: "طريقة اللعب", gameplayType: "لغز استنتاج", typeLabel: "النوع", type: "كلاسيكي · لغز · استراتيجية · عائلي", faq: "الأسئلة الشائعة", question: "هل يتم حفظ التقدم؟", answer: "نعم، فقط في هذا المتصفح." },
  };

  const locale = () => {
    const segment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const value = window.WonderI18n?.actualLocale?.() || (LOCALES.includes(document.documentElement.lang) ? document.documentElement.lang : ROUTE_LOCALES[segment] || "en");
    return LOCALES.includes(value) ? value : "en";
  };

  function own(element, value) {
    if (!element) return;
    element.textContent = value;
    element.setAttribute("data-runtime-localize", "off");
  }

  function syncGuide() {
    const copy = GUIDE_COPY[locale()] || GUIDE_COPY.en;
    document.body.dataset.gameVersion = GAME_VERSION;
    own(document.querySelector(".logic-kicker"), copy.preview);
    const guide = document.querySelector(".game-page-info-static");
    if (!guide) return;
    guide.setAttribute("aria-label", copy.kicker);
    own(guide.querySelector(".game-info-kicker"), copy.kicker);
    own(guide.querySelector(".game-info-title h2"), copy.title);
    own(guide.querySelector(".game-info-title p"), copy.tagline);
    const facts = guide.querySelectorAll(".game-info-fact");
    own(facts[0]?.querySelector("span"), copy.gameplay);
    own(facts[0]?.querySelector("strong"), copy.gameplayType);
    own(facts[1]?.querySelector("span"), copy.typeLabel);
    own(facts[1]?.querySelector("strong"), copy.type);
    const faq = guide.querySelector(".game-info-section");
    own(faq?.querySelector("h3"), copy.faq);
    own(faq?.querySelector("dt"), copy.question);
    own(faq?.querySelector("dd"), copy.answer);
  }

  syncGuide();
  document.addEventListener("DOMContentLoaded", syncGuide, { once: true });
})();
