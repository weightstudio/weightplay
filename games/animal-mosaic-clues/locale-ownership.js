(() => {
  "use strict";

  const loadingCopy = {
    en: "Opening the mosaic archive…",
    "zh-Hant": "正在開啟拼圖檔案館…",
    "zh-Hans": "正在打开拼图档案馆…",
    ja: "モザイク資料館を開いています…",
    ko: "모자이크 기록관을 여는 중…",
    es: "Abriendo el archivo de mosaicos…",
    "pt-BR": "Abrindo o arquivo de mosaicos…",
    fr: "Ouverture des archives de mosaïques…",
    de: "Mosaikarchiv wird geöffnet…",
    it: "Apertura dell’archivio dei mosaici…",
    ru: "Открываем архив мозаик…",
    hi: "मोज़ेक संग्रह खोला जा रहा है…",
    ar: "جارٍ فتح أرشيف الفسيفساء…",
  };
  const dictionaries = {
    fr: {
      "Use Paint for confirmed cells and Mark for confirmed empty cells.": "Utilisez Peindre pour les cellules confirmées et Marquer pour les cellules vides confirmées.",
      "Utilisez Paint pour les cellules confirmées et Mark pour les cellules vides confirmées.": "Utilisez Peindre pour les cellules confirmées et Marquer pour les cellules vides confirmées.",
      "Animal Mosaic Clues": "Mosaïques Animales",
      "Start Game": "Commencer",
      "Deduction mosaic puzzle": "Puzzle mosaïque de déduction",
      "Read every row and column clue to uncover a hidden animal portrait.": "Lisez chaque indice de ligne et de colonne pour révéler un portrait animal caché.",
      "Original WeightPlay logic puzzle": "Puzzle logique original de WeightPlay",
      "Every number describes a continuous run.": "Chaque nombre décrit une suite continue.",
      "Paint cells that must be filled, cross cells that must stay empty, and use intersecting clues to solve each mosaic without guessing.": "Peignez les cases à remplir, marquez celles qui restent vides et croisez les indices pour résoudre chaque mosaïque sans deviner.",
      "How to play": "Comment jouer",
      "Thirty mosaics": "Trente mosaïques",
      "Six chapters grow from guided 5×5 signs to deduction-rich 12×12 portraits.": "Six chapitres vont de grilles guidées 5×5 à des portraits 12×12 riches en déductions.",
      "Choose a Mosaic": "Choisir une mosaïque",
      "Drag the rail. The centred glowing card is selected.": "Faites glisser le rail. La carte lumineuse centrée est sélectionnée.",
      "Mosaic selector": "Sélecteur de mosaïque",
      Back: "Retour",
      "Back to WeightPlay": "Retour à WeightPlay",
      "Woodland Signs": "Signes de la forêt",
      "River Tracks": "Traces de rivière",
      "Moon Garden": "Jardin lunaire",
      "Coral Archive": "Archives de corail",
      "Sky Atlas": "Atlas céleste",
      "Grand Menagerie": "Grande ménagerie",
      Marks: "Marques",
      Errors: "Erreurs",
      Filled: "Remplies",
      "Nonogram mosaic board": "Plateau de mosaïque nonogramme",
      "Use the clues to reveal every filled cell.": "Utilisez les indices pour révéler chaque case remplie.",
      "A clue such as 3 1 means a run of three filled cells, at least one empty cell, then one filled cell.": "Un indice comme 3 1 signifie une suite de trois cases remplies, au moins une case vide, puis une case remplie.",
      Continue: "Continuer",
      "Leave this mosaic?": "Quitter cette mosaïque ?",
      "Your completed progress is safe. This attempt will restart.": "Votre progression terminée est sauvegardée. Cette tentative sera recommencée.",
      "Stage Map": "Carte des étapes",
      "Stage Complete": "Étape terminée",
      "The hidden animal mosaic is complete.": "La mosaïque animale cachée est terminée.",
      Time: "Temps",
      Mistakes: "Erreurs",
      Hints: "Indices",
      Retry: "Rejouer",
      "Next Stage": "Étape suivante",
      Ready: "Prête",
      Locked: "Verrouillée",
      "Cleared · Replay": "Terminée · Rejouer",
      "Complete the previous stage first.": "Terminez d’abord l’étape précédente.",
    },
    ar: {
      "Animal Mosaic Clues": "ألغاز فسيفساء الحيوانات",
      "Start Game": "ابدأ اللعبة",
      "Deduction mosaic puzzle": "لغز فسيفساء استنتاجي",
      "Read every row and column clue to uncover a hidden animal portrait.": "اقرأ دليل كل صف وعمود للكشف عن صورة حيوان مخفية.",
      "Original WeightPlay logic puzzle": "لغز منطقي أصلي من WeightPlay",
      "Every number describes a continuous run.": "يصف كل رقم سلسلة متصلة.",
      "Paint cells that must be filled, cross cells that must stay empty, and use intersecting clues to solve each mosaic without guessing.": "لوّن الخانات التي يجب ملؤها، وضع علامة على الخانات التي يجب أن تبقى فارغة، واستخدم الأدلة المتقاطعة لحل كل فسيفساء من دون تخمين.",
      "How to play": "طريقة اللعب",
      "Thirty mosaics": "ثلاثون فسيفساء",
      "Six chapters grow from guided 5×5 signs to deduction-rich 12×12 portraits.": "تمتد الفصول الستة من ألغاز 5×5 الموجّهة إلى صور 12×12 الغنية بالاستنتاجات.",
      "Choose a Mosaic": "اختر فسيفساء",
      "Drag the rail. The centred glowing card is selected.": "اسحب الشريط. البطاقة المضيئة في الوسط هي المحددة.",
      "Mosaic selector": "محدد الفسيفساء",
      Back: "رجوع",
      "Back to WeightPlay": "العودة إلى WeightPlay",
      "Woodland Signs": "إشارات الغابة",
      "River Tracks": "آثار النهر",
      "Moon Garden": "حديقة القمر",
      "Coral Archive": "أرشيف المرجان",
      "Sky Atlas": "أطلس السماء",
      "Grand Menagerie": "حديقة الحيوانات الكبرى",
      Marks: "العلامات",
      Errors: "الأخطاء",
      Filled: "الممتلئة",
      "Nonogram mosaic board": "لوحة فسيفساء الأرقام",
      "Use the clues to reveal every filled cell.": "استخدم الأدلة لكشف كل خانة يجب ملؤها.",
      "A clue such as 3 1 means a run of three filled cells, at least one empty cell, then one filled cell.": "دليل مثل 3 1 يعني سلسلة من ثلاث خانات ممتلئة، تليها خانة فارغة واحدة على الأقل، ثم خانة ممتلئة.",
      Continue: "متابعة",
      "Leave this mosaic?": "مغادرة هذه الفسيفساء؟",
      "Your completed progress is safe. This attempt will restart.": "تقدمك المحفوظ آمن. ستُعاد هذه المحاولة من البداية.",
      "Stage Map": "خريطة المراحل",
      "Stage Complete": "اكتملت المرحلة",
      "The hidden animal mosaic is complete.": "اكتملت فسيفساء الحيوان المخفية.",
      Time: "الوقت",
      Mistakes: "الأخطاء",
      Hints: "التلميحات",
      Retry: "إعادة المحاولة",
      Replay: "إعادة اللعب",
      "Next Stage": "المرحلة التالية",
      Ready: "جاهزة",
      Locked: "مقفلة",
      "Cleared · Replay": "مكتملة · إعادة اللعب",
      "Complete the previous stage first.": "أكمل المرحلة السابقة أولًا.",
      Paint: "تلوين",
      "Mark ×": "علامة ×",
      Undo: "تراجع",
      Hint: "تلميح",
      Restart: "إعادة البدء",
      "That cell conflicts with the clues.": "هذه الخانة تتعارض مع الأدلة.",
      "Hint: one certain cell was painted.": "تلميح: تم تلوين خانة مؤكدة.",
      "Every filled cell is already visible.": "كل الخانات الممتلئة ظاهرة بالفعل.",
      "Nothing to undo.": "لا يوجد شيء للتراجع عنه.",
    },
  };
  const chapters = {
    fr: ["Signes de la forêt", "Traces de rivière", "Jardin lunaire", "Archives de corail", "Atlas céleste", "Grande ménagerie"],
    ar: ["إشارات الغابة", "آثار النهر", "حديقة القمر", "أرشيف المرجان", "أطلس السماء", "حديقة الحيوانات الكبرى"],
  };
  const locale = () => window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
  const activeLocale = locale();
  const dictionary = dictionaries[activeLocale] || {};

  const showTransition = (target) => {
    document.body.classList.add("locale-transitioning");
    const loading = document.getElementById("loading");
    if (!loading) return;
    loading.hidden = false;
    loading.style.position = "fixed";
    loading.style.inset = "0";
    loading.style.zIndex = "9999";
    const label = loading.querySelector("strong");
    if (label) label.textContent = loadingCopy[target] || loadingCopy.en;
  };
  document.getElementById("localeSelect")?.addEventListener("change", (event) => showTransition(event.currentTarget.value), { capture: true });

  const translate = (value) => {
    if (typeof value !== "string" || !value.trim()) return value;
    const leading = value.match(/^\s*/u)?.[0] || "";
    const trailing = value.match(/\s*$/u)?.[0] || "";
    const core = value.slice(leading.length, value.length - trailing.length || undefined);
    if (dictionary[core]) return `${leading}${dictionary[core]}${trailing}`;
    let next = core;
    for (const [source, translated] of Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length)) {
      next = next.replaceAll(source, translated);
    }
    if (activeLocale === "fr") {
      next = next.replace(/\bStage\s+(\d+)\b/gu, "Étape $1");
      next = next.replace(/(\d+)\s+marks\b/gu, "$1 marques");
      next = next.replace(/(\d+)\s+errors\b/gu, "$1 erreurs");
    }
    if (activeLocale === "ar") {
      next = next.replace(/\bStage\s+(\d+)\b/gu, "المرحلة $1");
      next = next.replace(/(\d+)\s+marks\b/gu, "$1 علامة");
      next = next.replace(/(\d+)\s+errors\b/gu, "$1 خطأ");
    }
    return `${leading}${next}${trailing}`;
  };

  const translateNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!["SCRIPT", "STYLE", "NOSCRIPT", "OPTION"].includes(node.parentElement?.tagName || "")) {
        const next = translate(node.data);
        if (next !== node.data) node.data = next;
      }
      return;
    }
    if (!(node instanceof Element)) return;
    for (const name of ["aria-label", "aria-description", "title", "placeholder", "alt"]) {
      if (!node.hasAttribute(name)) continue;
      const value = node.getAttribute(name) || "";
      const next = translate(value);
      if (next !== value) node.setAttribute(name, next);
    }
  };
  const translateTree = (root) => {
    translateNode(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) translateNode(walker.currentNode);
  };

  const config = window.BlockTrilogyConfig;
  if (config && chapters[activeLocale]) {
    config.title = translate(config.title);
    config.posterAlt = translate(config.posterAlt);
    for (const key of ["pitch", "guideTitle", "guideIntro", "growth", "objective", "help", "win", "fail"]) config[key] = translate(config[key]);
    config.how = Array.isArray(config.how) ? config.how.map(translate) : config.how;
    config.chapters = [...chapters[activeLocale]];
  }

  const loading = document.querySelector("#loading strong");
  if (loading) loading.textContent = loadingCopy[activeLocale] || loadingCopy.en;
  document.body.dataset.mosaicLocaleOwnership = "ready";
  if (!Object.keys(dictionary).length) return;
  translateTree(document.body);
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "characterData") translateNode(record.target);
      else for (const node of record.addedNodes) translateTree(node);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
