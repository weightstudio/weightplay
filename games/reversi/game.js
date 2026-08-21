window.WPClassicLogic?.mount("reversi");

(() => {
  "use strict";

  const GAME_VERSION = "v7";
  const LOCALES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const ROUTE_LOCALES = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const SCENARIOS = [
    {
      key: "corner-watch",
      copy: {
        en: "Replay focus · corner watch: if a corner becomes legal, consider it before chasing a bigger flip. The choice stays yours.",
        "zh-Hant": "重玩焦點・留意角落：角落變成合法步時，先考慮它，再追求翻更多棋子。選擇仍由你決定。",
        "zh-Hans": "重玩焦点・留意角落：角落变成合法步时，先考虑它，再追求翻更多棋子。选择仍由你决定。",
        ja: "リプレイの焦点・角を観察：角が合法手になったら、多く返す手より先に検討しましょう。選ぶのはあなたです。",
        ko: "다시 하기 초점 · 모서리 관찰: 모서리가 둘 수 있는 칸이 되면 더 많이 뒤집는 수보다 먼저 살펴보세요. 선택은 직접 합니다.",
        es: "Enfoque de repetición · vigila las esquinas: si una esquina es legal, considérala antes de buscar más fichas. Tú decides.",
        "pt-BR": "Foco da revanche · observe os cantos: se um canto ficar legal, considere-o antes de buscar mais capturas. Você decide.",
        fr: "Objectif de replay · surveillez les coins : si un coin devient jouable, examinez-le avant de chercher plus de pions. Vous décidez.",
        de: "Replay-Fokus · Ecken im Blick: Wird eine Ecke legal, prüfe sie vor einem Zug mit mehr Steinen. Du entscheidest.",
        it: "Obiettivo replay · osserva gli angoli: se un angolo diventa legale, consideralo prima di cercare più pedine. Decidi tu.",
        ru: "Фокус повтора · следите за углами: если угол станет доступен, рассмотрите его раньше хода с большим захватом. Решаете вы.",
        hi: "दोबारा खेलने का फोकस · कोनों पर नज़र रखें: कोना चाल के लिए खुले तो अधिक मोहरे पलटने से पहले उसे देखें। चुनाव आपका है।",
        ar: "تركيز الإعادة · راقب الزوايا: إذا أصبحت الزاوية حركة قانونية، ففكّر فيها قبل مطاردة قلب أقراص أكثر. القرار لك."
      }
    },
    {
      key: "mobility-balance",
      copy: {
        en: "Replay focus · mobility balance: compare your legal-move count before and after a move, then keep options open when you can.",
        "zh-Hant": "重玩焦點・平衡機動：比較落子前後的合法步數，能保留選項時就保留它們。",
        "zh-Hans": "重玩焦点・平衡机动：比较落子前后的合法步数，能保留选项时就保留它们。",
        ja: "リプレイの焦点・手数の余裕：置く前後の合法手数を比べ、可能なら選択肢を残しましょう。",
        ko: "다시 하기 초점 · 선택지 균형: 수를 두기 전후의 합법적인 수를 비교하고, 가능하면 선택지를 남겨 두세요.",
        es: "Enfoque de repetición · equilibrio de movilidad: compara tus jugadas legales antes y después y conserva opciones cuando puedas.",
        "pt-BR": "Foco da revanche · equilíbrio de mobilidade: compare suas jogadas legais antes e depois e preserve opções quando puder.",
        fr: "Objectif de replay · mobilité : comparez vos coups légaux avant et après, puis gardez des choix ouverts quand c’est possible.",
        de: "Replay-Fokus · Beweglichkeit: Vergleiche deine legalen Züge vor und nach dem Zug und halte Optionen offen, wenn du kannst.",
        it: "Obiettivo replay · equilibrio della mobilità: confronta le mosse legali prima e dopo e conserva le opzioni quando puoi.",
        ru: "Фокус повтора · мобильность: сравнивайте число доступных ходов до и после и сохраняйте варианты, когда это возможно.",
        hi: "दोबारा खेलने का फोकस · चालों का संतुलन: चाल से पहले और बाद की कानूनी चालें गिनें और हो सके तो विकल्प खुले रखें।",
        ar: "تركيز الإعادة · توازن الحركة: قارن عدد حركاتك القانونية قبل الحركة وبعدها، وحافظ على الخيارات إن أمكن."
      }
    },
    {
      key: "edge-discipline",
      copy: {
        en: "Replay focus · edge discipline: use an edge when it supports the next position; do not chase the boundary for a bigger flip.",
        "zh-Hant": "重玩焦點・邊線紀律：邊線能支援下一個局面時再使用，不要只為多翻棋子追逐邊界。",
        "zh-Hans": "重玩焦点・边线纪律：边线能支撑下一局面时再使用，不要只为多翻棋子追逐边界。",
        ja: "リプレイの焦点・辺の規律：次の局面を支えるときに辺を使い、返す数だけを求めて辺を追わないように。",
        ko: "다시 하기 초점 · 가장자리 원칙: 다음 포지션에 도움이 될 때 가장자리를 쓰고, 더 많이 뒤집으려고 경계만 쫓지 마세요.",
        es: "Enfoque de repetición · disciplina de borde: usa un borde si ayuda a la siguiente posición; no lo persigas solo por voltear más.",
        "pt-BR": "Foco da revanche · disciplina de borda: use a borda quando ela apoiar a próxima posição; não a persiga só por capturar mais.",
        fr: "Objectif de replay · discipline des bords : utilisez un bord s’il aide la position suivante ; ne le cherchez pas seulement pour retourner plus de pions.",
        de: "Replay-Fokus · Kanten mit Maß: Nutze eine Kante, wenn sie die nächste Stellung stützt; jage ihr nicht nur für mehr Steine nach.",
        it: "Obiettivo replay · disciplina dei bordi: usa un bordo quando sostiene la posizione successiva; non inseguirlo solo per catturare di più.",
        ru: "Фокус повтора · дисциплина края: используйте край, если он помогает следующей позиции; не гонитесь за ним только ради захвата.",
        hi: "दोबारा खेलने का फोकस · किनारे का अनुशासन: अगली स्थिति में मदद मिले तो किनारा चुनें; अधिक मोहरे पलटने के लिए ही किनारे के पीछे न जाएँ।",
        ar: "تركيز الإعادة · انضباط الحواف: استخدم الحافة عندما تدعم الوضع التالي، ولا تطاردها لمجرد قلب أقراص أكثر."
      }
    }
  ];

  let scenarioIndex = 0;

  const locale = () => {
    const route = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const value = window.WonderI18n?.actualLocale?.() || ROUTE_LOCALES[route] || document.documentElement.lang || "en";
    return LOCALES.includes(value) ? value : "en";
  };

  const syncScenario = () => {
    const battle = document.querySelector("#logicBattle");
    const tutorial = document.querySelector("#logicTutorial");
    if (!battle || !tutorial || battle.hidden) return;
    const scenario = SCENARIOS[scenarioIndex % SCENARIOS.length];
    const copy = scenario.copy[locale()] || scenario.copy.en;
    if (tutorial.dataset.reversiScenario === scenario.key && tutorial.textContent === copy) return;
    tutorial.textContent = copy;
    tutorial.dataset.reversiScenario = scenario.key;
    tutorial.setAttribute("role", "note");
  };

  document.body.dataset.gameVersion = GAME_VERSION;
  document.body.dataset.interfaceVersion = "6";
  const start = document.querySelector("#startButton");
  const replay = document.querySelector("#resultReplay");
  if (start) start.addEventListener("click", () => {
    scenarioIndex = 0;
    setTimeout(syncScenario, 0);
  });
  if (replay) replay.addEventListener("click", () => {
    scenarioIndex = (scenarioIndex + 1) % SCENARIOS.length;
    setTimeout(syncScenario, 0);
  });
  const battle = document.querySelector("#logicBattle");
  if (battle) new MutationObserver(syncScenario).observe(battle, { attributes: true, attributeFilter: ["hidden"] });
})();

// Reversi has no turn-history owner in the shared Logic Lab runtime. Remove
// the generic Undo affordance instead of presenting a recovery action that
// announces success while leaving the board unchanged.
const reversiUndo = document.querySelector("#logicUndo");
if (reversiUndo) {
  reversiUndo.hidden = true;
  reversiUndo.disabled = true;
  reversiUndo.setAttribute("aria-hidden", "true");
  reversiUndo.dataset.logicAction = "unsupported";
}
