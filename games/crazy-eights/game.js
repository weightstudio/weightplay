(function () {
  "use strict";

  const ARABIC_SHELL = {
    title: "الثمانيات المجنونة",
    back: "رجوع",
    settings: "الإعدادات",
    sound: "الصوت",
    language: "اللغة",
    start: "بدء اللعبة",
    restart: "إعادة البدء",
    newGame: "لعبة جديدة",
    hand: "يدك",
    guideKicker: "دليل ألعاب WeightPlay الأصلية",
    guideSummary: "العب بطاقة تطابق النوع أو الرتبة النشطة. الثمانيات بطاقات جامحة تتيح لك اختيار النوع التالي.",
    gameplayLabel: "طريقة اللعب",
    gameplay: "لعبة بطاقات سفك كلاسيكية",
    genreLabel: "النوع",
    genre: "بطاقات · عائلية · استراتيجية",
    difficultyLabel: "الصعوبة",
    difficulty: "من السهل إلى التحدي",
    timeLabel: "وقت اللعب المقدر",
    time: "3–10 دقائق",
    skillsLabel: "المهارات المتدرَّبة",
    skills: "التخطيط · التركيز · التعرّف على الأنماط",
    progressLabel: "تقدّم اللعب",
    progressCopy: "طابق النوع أو الرتبة، ثم استخدم الثمانية لتغيير النوع النشط.",
    howTo: "طريقة اللعب",
    howToCopy: "عندما لا تكون هناك بطاقة قانونية، اسحب بطاقة. أول لاعب يفرغ يده يفوز.",
    preview: "حالة المعاينة",
    previewCopy: "معاينة المالك هذه غير موجودة في الكتالوج العام الرسمي.",
    faq: "الأسئلة الشائعة",
    faqQuestion: "هل يُحفظ التقدم؟",
    faqAnswer: "نعم، في هذا المتصفح فقط.",
    quickGuide: "طريقة اللعب",
    quickGuideCopy: "عندما لا تكون هناك بطاقة قانونية، اسحب بطاقة. أول لاعب يفرغ يده يفوز.",
    opponents: ["أنت", "الذكاء الاصطناعي شمالاً", "الذكاء الاصطناعي شرقاً", "الذكاء الاصطناعي غرباً"],
  };

  const isArabic = () => document.documentElement.lang === "ar" || /\/ar\/games\/crazy-eights\//.test(location.pathname);
  let syncing = false;
  const setText = (node, value) => {
    if (!node || node.textContent === value) return;
    node.textContent = value;
  };
  const setFactValue = (fact, value) => {
    if (!fact) return;
    const scalar = fact.querySelector("strong");
    if (scalar) {
      setText(scalar, value);
      return;
    }
    const list = fact.querySelector(".game-info-tags, .game-info-skills");
    if (!list) return;
    const values = String(value).split(" · ").map((item) => item.trim()).filter(Boolean);
    list.replaceChildren(...values.map((item) => Object.assign(document.createElement("span"), { textContent: item })));
  };
  const syncArabicShell = () => {
    if (!isArabic() || syncing) return;
    syncing = true;
    try {
      document.documentElement.dir = "rtl";
      document.title = `${ARABIC_SHELL.title} | WeightPlay`;
      const mainReturn = document.querySelector(".main-return");
      if (mainReturn) mainReturn.setAttribute("aria-label", ARABIC_SHELL.back);
      const settings = document.querySelector("#audioMenuBtn");
      if (settings) settings.setAttribute("aria-label", ARABIC_SHELL.settings);
      const language = document.querySelector("#localeSelect");
      if (language) language.setAttribute("aria-label", ARABIC_SHELL.language);
      setText(document.querySelector(".settings-title"), ARABIC_SHELL.settings);
      setText(document.querySelector("#soundBtn"), `${ARABIC_SHELL.sound}: تشغيل`);
      setText(document.querySelector("#startBtn"), ARABIC_SHELL.start);
      setText(document.querySelector("#restartBtn"), ARABIC_SHELL.restart);
      setText(document.querySelector("#newGameBtn"), ARABIC_SHELL.newGame);
      setText(document.querySelector("[data-wp-main-progress] strong"), ARABIC_SHELL.progressLabel);
      setText(document.querySelector("[data-wp-main-progress] span"), ARABIC_SHELL.progressCopy);
      const battleUtility = document.querySelector("[data-wp-battle-utility]");
      if (battleUtility) {
        battleUtility.setAttribute("aria-label", ARABIC_SHELL.settings);
        battleUtility.title = ARABIC_SHELL.settings;
      }

      const info = document.querySelector(".game-page-info");
      if (info) {
        info.setAttribute("aria-label", `معلومات لعبة ${ARABIC_SHELL.title}`);
        info.setAttribute("data-runtime-localize", "off");
        setText(info.querySelector(".game-info-kicker"), ARABIC_SHELL.guideKicker);
        setText(info.querySelector(".game-info-title h2"), ARABIC_SHELL.title);
        setText(info.querySelector(".game-info-title p"), ARABIC_SHELL.guideSummary);
        const facts = [...info.querySelectorAll(".game-info-fact")];
        [[ARABIC_SHELL.gameplayLabel, ARABIC_SHELL.gameplay], [ARABIC_SHELL.genreLabel, ARABIC_SHELL.genre], [ARABIC_SHELL.difficultyLabel, ARABIC_SHELL.difficulty], [ARABIC_SHELL.timeLabel, ARABIC_SHELL.time], [ARABIC_SHELL.skillsLabel, ARABIC_SHELL.skills]].forEach(([label, value], index) => {
          const fact = facts[index];
          if (!fact) return;
          setText(fact.querySelector("span"), label);
          setFactValue(fact, value);
        });
        const sections = [...info.querySelectorAll(".game-info-section")];
        const guide = sections.find((section) => section.querySelector("ol"));
        setText(guide?.querySelector("h3"), ARABIC_SHELL.howTo);
        setText(guide?.querySelector("li"), ARABIC_SHELL.howToCopy);
        const preview = sections.find((section) => section.classList.contains("game-info-parent"));
        setText(preview?.querySelector("h3"), ARABIC_SHELL.preview);
        setText(preview?.querySelector("p"), ARABIC_SHELL.previewCopy);
        const faq = sections.find((section) => section.querySelector("dl"));
        setText(faq?.querySelector("h3"), ARABIC_SHELL.faq);
        setText(faq?.querySelector("dt"), ARABIC_SHELL.faqQuestion);
        setText(faq?.querySelector("dd"), ARABIC_SHELL.faqAnswer);
      }

      const battleBack = document.querySelector("#battleBackBtn");
      if (battleBack) {
        setText(battleBack, `← ${ARABIC_SHELL.back}`);
        battleBack.setAttribute("aria-label", ARABIC_SHELL.back);
        battleBack.setAttribute("data-runtime-localize", "off");
      }
      setText(document.querySelector("#cardGamePhase"), ARABIC_SHELL.title);
      setText(document.querySelector(".card-game-player-header strong"), ARABIC_SHELL.hand);
      document.querySelectorAll("#cardGameOpponents .opponent-card strong").forEach((node, index) => setText(node, ARABIC_SHELL.opponents[index + 1] || ARABIC_SHELL.opponents[1]));
      const quickGuide = document.querySelector(".card-game-quick-guide");
      if (quickGuide) {
        quickGuide.setAttribute("data-runtime-localize", "off");
        const quickGuideText = `${ARABIC_SHELL.quickGuide}: ${ARABIC_SHELL.quickGuideCopy}`;
        if (quickGuide.textContent !== quickGuideText) {
          quickGuide.replaceChildren(Object.assign(document.createElement("strong"), { textContent: `${ARABIC_SHELL.quickGuide}:` }), document.createTextNode(` ${ARABIC_SHELL.quickGuideCopy}`));
        }
      }
      const result = document.querySelector("#resultText");
      if (result) {
        result.setAttribute("data-runtime-localize", "off");
        const resultCopy = result.textContent.replaceAll("AI North", ARABIC_SHELL.opponents[1]).replaceAll("AI East", ARABIC_SHELL.opponents[2]).replaceAll("AI West", ARABIC_SHELL.opponents[3]).replaceAll("Your hand", ARABIC_SHELL.hand);
        if (resultCopy !== result.textContent) result.textContent = resultCopy;
      }
      setText(document.querySelector("#resultTitle"), "انتهت الجولة");
      setText(document.querySelector("#resultNewGame"), ARABIC_SHELL.newGame);
      setText(document.querySelector("#resultRestart"), ARABIC_SHELL.restart);
      setText(document.querySelector("#resultClose"), "إغلاق");
    } finally {
      syncing = false;
    }
  };

  const mainCopy = document.querySelector("#mainScreen .main-copy");
  if (mainCopy && !mainCopy.querySelector("[data-wp-main-progress]")) {
    const progress = document.createElement("div");
    progress.className = "main-progress";
    progress.dataset.wpMainProgress = "true";
    progress.setAttribute("role", "status");
    progress.setAttribute("aria-live", "polite");
    const label = document.createElement("strong");
    label.textContent = "Play progress";
    const copy = document.createElement("span");
    copy.textContent = "Match suit or rank, then use an Eight to change the active suit.";
    progress.append(label, copy);
    mainCopy.insertBefore(progress, mainCopy.querySelector(".main-actions") || null);
  }
  const topbar = document.querySelector("#battleScreen .card-game-topbar");
  if (topbar && !topbar.querySelector("[data-wp-battle-utility]")) {
    const utility = document.createElement("button");
    utility.id = "battleUtilityBtn";
    utility.className = "battle-utility header-icon-btn";
    utility.type = "button";
    utility.dataset.wpBattleUtility = "true";
    utility.setAttribute("aria-label", "Settings");
    utility.title = "Settings";
    utility.textContent = "⚙";
    topbar.append(utility);
  }

  window.WPCardGamesNext?.mount({ id: "crazy-eights" });
  syncArabicShell();
  window.addEventListener("weightplay:shell-sync", syncArabicShell);
  window.addEventListener("weightplay:battle-open", syncArabicShell);
  window.addEventListener("weightplay:battle-sync", syncArabicShell);
  new MutationObserver(syncArabicShell).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
