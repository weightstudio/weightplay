(() => {
  "use strict";

  const copy = window.ANIMAL_LANTERN_LATTICE_LOCALES || {};
  const lanterns = [
    { id: "owl", key: "owl" },
    { id: "fox", key: "fox" },
    { id: "otter", key: "otter" },
    { id: "rabbit", key: "rabbit" },
    { id: "turtle", key: "turtle" },
    { id: "panda", key: "panda" },
  ];

  const paths = [
    { titleKey: "stage1Title", arcKey: "arc1", target: ["owl", "fox", "otter"], ruleKey: "straightRule", rewardKey: "stageReward" },
    { titleKey: "stage2Title", arcKey: "arc1", target: ["rabbit", "turtle", "panda"], reverse: true, ruleKey: "reverseRule", rewardKey: "stageReward" },
    { titleKey: "stage3Title", arcKey: "arc1", target: ["fox", "otter", "panda"], clueSteps: [[0,2],[1,2]], ruleKey: "straightRule", rewardKey: "stageReward" },
    { titleKey: "stage4Title", arcKey: "arc1", target: ["owl", "rabbit", "turtle", "panda"], clueSteps: [[0,2],[1,2],[2,3]], ruleKey: "straightRule", rewardKey: "stageReward" },
    { titleKey: "stage5Title", arcKey: "arc1", target: ["owl", "fox", "otter", "panda"], clueSteps: [[0,1],[0,2],[1,3]], reverse: true, checkpoint: true, ruleKey: "reverseRule", rewardKey: "checkpointReward1" },
    { titleKey: "stage6Title", arcKey: "arc2", target: ["rabbit", "owl", "turtle"], decoy: "fox", ruleKey: "decoyRule", rewardKey: "stageReward" },
    { titleKey: "stage7Title", arcKey: "arc2", target: ["fox", "panda", "otter", "rabbit"], clueSteps: [[0,1],[0,2],[1,3]], decoy: "turtle", ruleKey: "decoyRule", rewardKey: "stageReward" },
    { titleKey: "stage8Title", arcKey: "arc2", target: ["turtle", "owl", "panda"], clueSteps: [[0,2],[1,2]], decoy: "fox", ruleKey: "decoyRule", rewardKey: "stageReward" },
    { titleKey: "stage9Title", arcKey: "arc2", target: ["otter", "rabbit", "fox", "turtle"], clueSteps: [[0,3],[0,1],[1,2]], decoy: "panda", ruleKey: "decoyRule", rewardKey: "stageReward" },
    { titleKey: "stage10Title", arcKey: "arc2", target: ["owl", "panda", "rabbit", "otter"], clueSteps: [[0,3],[1,3],[0,1]], decoy: "turtle", checkpoint: true, ruleKey: "decoyRule", rewardKey: "checkpointReward2" },
    { titleKey: "stage11Title", arcKey: "arc3", target: ["owl", "fox", "owl", "otter"], echoId: "owl", ruleKey: "echoRule", rewardKey: "stageReward" },
    { titleKey: "stage12Title", arcKey: "arc3", target: ["rabbit", "turtle", "panda", "turtle"], clueSteps: [[0,1],[0,2],[1,3],[2,3]], echoId: "turtle", ruleKey: "echoRule", rewardKey: "stageReward" },
    { titleKey: "stage13Title", arcKey: "arc3", target: ["fox", "otter", "panda", "otter"], clueSteps: [[0,2],[1,2],[2,3]], echoId: "otter", ruleKey: "echoRule", rewardKey: "stageReward" },
    { titleKey: "stage14Title", arcKey: "arc3", target: ["panda", "rabbit", "panda", "turtle"], clueSteps: [[0,1],[0,2],[1,3]], echoId: "panda", ruleKey: "echoRule", rewardKey: "stageReward" },
    { titleKey: "stage15Title", arcKey: "arc3", target: ["owl", "rabbit", "turtle", "owl", "panda"], clueSteps: [[0,3],[0,1],[1,2],[3,4]], echoId: "owl", checkpoint: true, ruleKey: "echoRule", rewardKey: "checkpointReward3" },
    { titleKey: "stage16Title", arcKey: "arc4", target: ["fox", "rabbit", "otter", "panda"], reverse: true, ruleKey: "reverseRule", rewardKey: "stageReward" },
    { titleKey: "stage17Title", arcKey: "arc4", target: ["turtle", "panda", "owl"], clueSteps: [[0,2],[1,2]], reverse: true, ruleKey: "reverseRule", rewardKey: "stageReward" },
    { titleKey: "stage18Title", arcKey: "arc4", target: ["otter", "fox", "rabbit", "turtle"], clueSteps: [[0,1],[0,2],[1,3]], reverse: true, ruleKey: "reverseRule", rewardKey: "stageReward" },
    { titleKey: "stage19Title", arcKey: "arc4", target: ["panda", "owl", "otter", "rabbit"], clueSteps: [[0,3],[0,1],[1,2]], reverse: true, ruleKey: "reverseRule", rewardKey: "stageReward" },
    { titleKey: "stage20Title", arcKey: "arc4", target: ["rabbit", "fox", "turtle", "panda", "owl"], clueSteps: [[0,2],[1,3],[2,4],[0,1]], reverse: true, checkpoint: true, ruleKey: "reverseRule", rewardKey: "checkpointReward4" },
    { titleKey: "stage21Title", arcKey: "arc5", target: ["owl", "fox", "owl", "turtle"], echoId: "owl", decoy: "panda", ruleKey: "decoyEchoRule", rewardKey: "stageReward" },
    { titleKey: "stage22Title", arcKey: "arc5", target: ["rabbit", "otter", "panda", "otter", "fox"], clueSteps: [[0,2],[1,3],[2,4],[0,1]], echoId: "otter", decoy: "turtle", ruleKey: "decoyEchoRule", rewardKey: "stageReward" },
    { titleKey: "stage23Title", arcKey: "arc5", target: ["turtle", "owl", "turtle", "panda"], clueSteps: [[0,2],[1,2],[2,3],[0,1]], echoId: "turtle", decoy: "fox", ruleKey: "decoyEchoRule", rewardKey: "stageReward" },
    { titleKey: "stage24Title", arcKey: "arc5", target: ["panda", "fox", "rabbit", "fox", "otter"], clueSteps: [[0,2],[1,3],[2,4],[0,1]], echoId: "fox", decoy: "owl", ruleKey: "decoyEchoRule", rewardKey: "stageReward" },
    { titleKey: "stage25Title", arcKey: "arc5", target: ["otter", "rabbit", "otter", "turtle", "panda"], clueSteps: [[0,2],[1,3],[0,1],[3,4]], echoId: "otter", decoy: "fox", checkpoint: true, ruleKey: "decoyEchoRule", rewardKey: "checkpointReward5" },
    { titleKey: "stage26Title", arcKey: "arc6", target: ["owl", "panda", "owl", "rabbit"], reverse: true, echoId: "owl", decoy: "fox", ruleKey: "masteryRule", rewardKey: "stageReward" },
    { titleKey: "stage27Title", arcKey: "arc6", target: ["fox", "turtle", "panda", "turtle", "otter"], clueSteps: [[0,2],[1,3],[2,4],[0,1]], reverse: true, echoId: "turtle", decoy: "rabbit", ruleKey: "masteryRule", rewardKey: "stageReward" },
    { titleKey: "stage28Title", arcKey: "arc6", target: ["rabbit", "otter", "rabbit", "owl", "panda"], clueSteps: [[0,3],[0,1],[1,2],[3,4]], reverse: true, echoId: "rabbit", decoy: "turtle", ruleKey: "masteryRule", rewardKey: "stageReward" },
    { titleKey: "stage29Title", arcKey: "arc6", target: ["panda", "fox", "panda", "turtle", "owl"], clueSteps: [[0,2],[1,3],[2,4],[0,1]], reverse: true, echoId: "panda", decoy: "otter", ruleKey: "masteryRule", rewardKey: "stageReward" },
    { titleKey: "stage30Title", arcKey: "arc6", target: ["turtle", "rabbit", "turtle", "fox", "panda", "owl"], clueSteps: [[0,2],[1,3],[2,4],[3,5],[0,1]], reverse: true, echoId: "turtle", decoy: "otter", checkpoint: true, ruleKey: "masteryRule", rewardKey: "checkpointReward6" },
  ];

  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = routeLocaleMap[routeSegment] || null;
  const progressKey = "weightplay-animal-lantern-lattice-progress-v2";
  const campaignBestKey = "weightplay-animal-lantern-lattice-best-v4";
  // v1 counted incomplete prompts as checks. Keep it in storage, but start a
  // clean record for the new complete-chain-only score so star ranks are fair.
  const stageBestKey = "weightplay-animal-lantern-lattice-stage-best-v3";
  // Old scores remain stored under their original keys. New clue definitions
  // use fresh scoreboards; cleared/unlocked progress is never reset.
  const spanCopy = {
    en: ["{previous} is {steps} slots before {name}.", "An arrow without a number means the next slot. +2 leaves one lantern between; +3 leaves two. Wind-turn reads every arrow backward. Swap filled slots to test a plan for free."],
    "zh-Hant": ["{previous} 在 {name} 前 {steps} 格。", "無數字箭頭表示緊鄰下一格；+2 中間隔一盞燈，+3 隔兩盞。風轉時所有箭頭反向。可免費交換已填燈位試排。"],
    "zh-Hans": ["{previous} 在 {name} 前 {steps} 格。", "无数字箭头表示紧邻下一格；+2 中间隔一盏灯，+3 隔两盏。风转时所有箭头反向。可免费交换已填灯位试排。"],
    ja: ["{previous}は{name}の{steps}マス前です。", "数字なしの矢印は隣のマス。+2は間に1つ、+3は2つの灯りを置きます。風向きが逆なら矢印も逆読み。埋まったマスは無料で交換できます。"],
    ko: ["{previous}: {name}보다 {steps}칸 앞.", "숫자 없는 화살표는 바로 다음 칸이에요. +2는 사이에 등불 하나, +3은 둘을 둡니다. 역풍에서는 화살표를 거꾸로 읽어요. 채운 칸은 무료로 교환할 수 있어요."],
    es: ["{previous} está {steps} posiciones antes de {name}.", "Sin número: casilla siguiente. +2 deja una luz entre ambas; +3 deja dos. El viento invierte todas las flechas. Intercambia casillas llenas gratis para probar tu plan."],
    "pt-BR": ["{previous} fica {steps} posições antes de {name}.", "Sem número: próxima posição. +2 deixa uma luz entre elas; +3 deixa duas. O vento inverte todas as setas. Troque posições preenchidas de graça para testar seu plano."],
    fr: ["{previous} est {steps} cases avant {name}.", "Sans nombre : case suivante. +2 laisse une lumière entre les deux ; +3 en laisse deux. Le vent inverse toutes les flèches. Échangez gratuitement les cases remplies pour tester votre idée."],
    de: ["{previous} steht {steps} Plätze vor {name}.", "Ohne Zahl: nächster Platz. Bei +2 bleibt ein Licht dazwischen, bei +3 zwei. Bei Gegenwind gelten alle Pfeile rückwärts. Tausche belegte Plätze kostenlos zum Ausprobieren."],
    it: ["{previous} è {steps} caselle prima di {name}.", "Senza numero: casella successiva. +2 lascia una luce in mezzo; +3 ne lascia due. Il vento inverte tutte le frecce. Scambia gratuitamente le caselle piene per provare un'idea."],
    ru: ["{previous} на {steps} позиции раньше {name}.", "Без числа — соседняя ячейка. +2 оставляет между ними один огонь, +3 — два. Ветер разворачивает все стрелки. Заполненные ячейки можно менять местами без проверки."],
    hi: ["{previous}, {name} से {steps} खाने पहले है।", "बिना अंक का तीर: अगला खाना। +2 में बीच में एक दीप, +3 में दो दीप रखें। उलटी हवा में सभी तीर उलटे पढ़ें। भरे खाने मुफ्त में बदलकर अपनी योजना आज़माएँ।"],
    ar: ["{previous} يسبق {name} بمقدار {steps} خانات.", "السهم بلا رقم يعني الخانة التالية. +2 يترك فانوسًا واحدًا بينهما، و+3 يترك اثنين. الرياح تعكس جميع الأسهم. بدّل الخانات الممتلئة مجانًا لاختبار خطتك."],
  };
  const state = {
    locale: routeLocale || "en", path: 0, chain: [], motionSlot: null, sessionChecks: 0, checks: 0,
    screen: "main", campaignRun: false, lastResultCampaign: false,
    focusedClue: null, errorSlot: -1, verifiedPrefix: 0,
    swapMode: false, swapSlot: null,
  };
  // Game-owned interaction UI. Keep the shared shell and every route's SEO intact.
  const editCopy = {
    en: ["Swap lights", "Choose two filled slots to exchange their lights. No check is used.", "Choose the second light.", "Lights exchanged. Compare the glowing links before checking."],
    "zh-Hant": ["交換燈位", "選兩個已填格交換燈影，不計檢查次數。", "再選一盞要交換的燈。", "燈位已交換，先比對亮起的連結再檢查。"],
    "zh-Hans": ["交换灯位", "选两个已填格交换灯影，不计检查次数。", "再选一盏要交换的灯。", "灯位已交换，先比对亮起的连结再检查。"],
    ja: ["灯りを交換", "埋まった2つのマスを選ぶと交換できます。確認回数は増えません。", "交換するもう1つの灯りを選んでください。", "交換しました。光ったつながりを比べてから確認しましょう。"],
    ko: ["등불 교환", "채워진 두 칸을 선택해 교환하세요. 확인 횟수는 늘지 않아요.", "교환할 두 번째 등불을 선택하세요.", "교환했어요. 빛나는 연결을 비교한 뒤 확인하세요."],
    es: ["Intercambiar luces", "Elige dos casillas llenas para intercambiarlas sin gastar comprobaciones.", "Elige la segunda luz.", "Luces intercambiadas. Compara los enlaces iluminados antes de comprobar."],
    "pt-BR": ["Trocar luzes", "Escolha duas posições preenchidas para trocar sem gastar verificações.", "Escolha a segunda luz.", "Luzes trocadas. Compare as ligações acesas antes de verificar."],
    fr: ["Échanger les lumières", "Choisissez deux cases remplies pour les échanger sans vérification.", "Choisissez la deuxième lumière.", "Lumières échangées. Comparez les liens allumés avant de vérifier."],
    de: ["Lichter tauschen", "Wähle zwei gefüllte Plätze zum Tauschen. Das zählt nicht als Prüfung.", "Wähle das zweite Licht.", "Lichter getauscht. Vergleiche die leuchtenden Verbindungen vor der Prüfung."],
    it: ["Scambia le luci", "Scegli due caselle piene per scambiarle senza usare verifiche.", "Scegli la seconda luce.", "Luci scambiate. Confronta i collegamenti accesi prima di verificare."],
    ru: ["Обменять огни", "Выберите две заполненные ячейки для обмена без проверки.", "Выберите второй огонь.", "Огни обменены. Сравните светящиеся связи перед проверкой."],
    hi: ["दीप बदलें", "दो भरे खाने चुनकर दीप बदलें। जाँच की गिनती नहीं बढ़ेगी।", "दूसरा दीप चुनें।", "दीप बदल गए। जाँच से पहले चमकते संबंधों की तुलना करें।"],
    ar: ["تبديل الفوانيس", "اختر خانتين ممتلئتين لتبديل الفانوسين دون احتساب فحص.", "اختر الفانوس الثاني.", "تم التبديل. قارن الروابط المضيئة قبل الفحص."],
  };
  const editText = (index) => (editCopy[state.locale] || editCopy.en)[index];
  const rosterCopy = {
    en: ["Use these lights", "Use the listed lights: {name} ×{count}."],
    "zh-Hant": ["必用燈影", "請依清單使用燈影：{name} ×{count}。"],
    "zh-Hans": ["必用灯影", "请依清单使用灯影：{name} ×{count}。"],
    ja: ["使う灯り", "一覧の灯りを使ってください：{name} ×{count}。"],
    ko: ["필요한 등불", "목록의 등불을 사용하세요: {name} ×{count}."],
    es: ["Luces necesarias", "Usa las luces indicadas: {name} ×{count}."],
    "pt-BR": ["Luzes necessárias", "Use as luzes indicadas: {name} ×{count}."],
    fr: ["Lumières requises", "Utilisez les lumières indiquées : {name} ×{count}."],
    de: ["Benötigte Lichter", "Nutze die angegebenen Lichter: {name} ×{count}."],
    it: ["Luci necessarie", "Usa le luci indicate: {name} ×{count}."],
    ru: ["Нужные огни", "Используйте указанные огни: {name} ×{count}."],
    hi: ["ज़रूरी दीप", "सूची वाले दीप लगाएँ: {name} ×{count}।"],
    ar: ["الفوانيس المطلوبة", "استخدم الفوانيس المدرجة: {name} ×{count}."],
  };
  const rosterText = (index, values = {}) => (rosterCopy[state.locale] || rosterCopy.en)[index]
    .replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
  const routeStyle = document.createElement("style");
  routeStyle.textContent = `
    #battleScreen #resultScreen[hidden]{display:none!important}
    #battleContent .clue-text{color:#edf2ed;opacity:1}
    #battleContent .clue-pair .chain-icon{width:32px;height:32px}
    #battleContent .clue-link{border-color:#607795}
    #battleContent .clue-link.is-linked{border-color:#9de7c5;background:#194b42}
    #battleContent .chain-card>strong{flex-wrap:nowrap;min-height:44px}
    .route-edit-toggle{margin-inline-start:auto;min-height:max(46px,calc(46px * var(--wp-battle-canvas-inverse-scale,1)));max-width:56%;padding:3px 7px;border:1px solid #8ba0b6;border-radius:3px;background:#213c54;color:#f6f1df;font-size:11px;line-height:1.15;transition:background-color .16s,border-color .16s}
    #battleContent .chain-slot{min-height:max(46px,calc(46px * var(--wp-battle-canvas-inverse-scale,1)))}
    .route-roster{display:flex;flex-wrap:wrap;align-items:center;gap:3px 7px;margin:6px 0 0;font-size:11px;line-height:1.2}
    .route-roster-label{color:#e6e2d4}
    .route-roster-item{display:inline-flex;align-items:center;gap:2px;border-bottom:2px solid #f4c86a;color:#f4c86a}
    .route-roster-item.is-satisfied{border-color:#8adbc5;color:#8adbc5}
    .route-roster-item .chain-icon{width:20px;height:20px}
    .route-roster-item .roster-name{font-size:10px}
    .route-edit-toggle[aria-pressed=true]{border-color:#ffe08a;background:#685326;color:#fff4ca}
    #battleContent .chain-slot.is-swap-picked{outline:2px solid #ffe08a;outline-offset:-3px;background:#685326}
    #battleContent .chain-slot.is-linked-edge:before{background:#9de7c5;box-shadow:0 0 7px #9de7c5}
    #battleContent .chain-slot.is-unlinked-edge:before{background:#6688ae;box-shadow:none}
    #battleContent .chain-slot.is-clue-focus{border-color:#ffe08a}
    #battleContent .lantern-choice{position:relative;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto;gap:2px;padding:8px;background:linear-gradient(150deg,#284866,#162b44);border-color:#7693b0}
    #battleContent .lantern-choice .lantern-icon{width:64px;height:64px;align-self:center;filter:drop-shadow(0 5px 3px #0006)}
    #battleContent .lantern-choice b{font-size:13px;line-height:1.15;align-self:end}
    #battleContent .lantern-choice.is-selected{background:#142b36;border-color:#65938d}
    #battleContent .lantern-choice:disabled{opacity:.6}
    #battleContent .lantern-choice .lantern-used{position:absolute;inset-inline-end:6px;top:5px}
    .route-star-budget{color:#ffe08a;font-size:12px;letter-spacing:2px;margin-inline-start:7px}
    .clue-compact-hint{display:none}
    @media(prefers-reduced-motion:reduce){.route-edit-toggle{transition:none}}
    @media(max-width:500px){
      #battleContent.is-dense{grid-template-rows:auto auto auto minmax(150px,1fr) auto 48px}
      #battleContent.is-dense .clue-card{padding:5px}
      #battleContent.is-dense .clue-pair .chain-icon{width:26px;height:26px}
      #battleContent.is-dense .clue-arrow{font-size:13px;white-space:nowrap}
      #battleContent.is-dense .route-roster-item .chain-icon{width:18px;height:18px}
      #battleContent.is-dense .battle-rule,#battleContent.is-dense .battle-hint{font-size:12px;line-height:1.2}
      #battleContent.is-dense .lantern-choice{grid-template-columns:auto minmax(0,1fr);grid-template-rows:minmax(0,1fr);gap:4px;padding:4px}
      #battleContent.is-dense .lantern-choice .lantern-icon{width:32px;height:32px;filter:none}
      #battleContent.is-dense .lantern-choice b{font-size:11px;align-self:center}
    }
    @media(min-width:700px) and (max-height:560px){
      #battleContent{grid-template-rows:minmax(24px,1fr) 100px 94px 44px;gap:4px;padding:4px}
      #battleContent .clue-card{grid-column:1;grid-row:1/4}
      #battleContent .battle-copy{grid-column:2;grid-row:1;font-size:11px}
      #battleContent .battle-rule,#battleContent .battle-hint{font-size:11px;line-height:1.2}
      #battleContent .chain-card{grid-column:2;grid-row:2;padding:4px}
      #battleContent .chain-list{height:44px}
      #battleContent .lantern-grid{grid-column:2;grid-row:3}
      #battleContent .battle-status{grid-column:1;grid-row:4}
      #battleContent .battle-actions{grid-column:2;grid-row:4}
      #battleContent .clue-detailed-hint{display:none}
      #battleContent .clue-compact-hint{display:none}
      #battleContent .lantern-choice{grid-template-columns:auto minmax(0,1fr);grid-template-rows:1fr;min-height:0;padding:4px}
      #battleContent .lantern-choice .lantern-icon{width:38px;height:38px}
      #battleContent .lantern-choice b{align-self:center;font-size:11px}
      #battleContent .clue-pair .chain-icon{width:25px;height:25px}
      .route-edit-toggle{font-size:10px}
    }
    @media(orientation:landscape) and (max-height:460px){
      #battleScreen #resultScreen:not([hidden]){display:grid!important;grid-template-columns:80px minmax(0,1fr);grid-template-rows:28px 28px 28px minmax(32px,1fr) 28px 44px;align-content:stretch;justify-content:stretch;align-items:center;gap:4px 10px;padding:8px!important}
      #resultScreen .result-orla{grid-column:1;grid-row:1/6;width:80px;max-height:100px;align-self:center}
      #resultScreen .result-spark{display:none}
      #resultScreen h2{grid-column:2;grid-row:1;font-size:22px;line-height:1.1}
      #resultScreen #resultRating{grid-column:2;grid-row:2;font-size:24px;line-height:1}
      #resultScreen #resultRoute{grid-column:2;grid-row:3;min-height:26px}
      #resultScreen #resultText{grid-column:2;grid-row:4;font-size:12px;line-height:1.25}
      #resultScreen .skill-report{grid-column:2;grid-row:5;display:flex;justify-content:center;align-items:center;gap:8px;width:100%;padding:3px 6px;font-size:12px;line-height:1}
      #resultScreen .skill-report strong{flex:0 0 70px;font-size:8px;line-height:1.1}
      #resultScreen .skill-report span{font-size:10px;line-height:1.1}
      #resultScreen .result-actions{grid-column:1/-1;grid-row:6;width:100%;max-width:none;align-self:end}
    }
  `;
  document.head.append(routeStyle);
  const $ = (id) => document.getElementById(id);
  // A Stage touch can finish after Battle has replaced its hit target. Require
  // a fresh pointer gesture for a lantern choice; do not charge an unseen move.
  let pointerSequence = 0;
  let battleEntryPointer = -1;
  document.addEventListener("pointerdown", () => { pointerSequence += 1; }, { capture: true });
  const setBattleStatus = (message, feedback = "neutral") => {
    const status = $("battleStatus");
    status.textContent = message;
    status.dataset.feedback = feedback;
    animate(status, [{ opacity: .5 }, { opacity: 1 }], 160);
  };
  const app = $("app");
  const GAME_AUDIO_CUES = ["board.move", "board.undo", "feedback.hint", "feedback.error", "puzzle.match", "puzzle.clear", "result.win"];
  const audio = window.WeightPlayAudio?.createScope();
  const effects = new Set();
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = (node, frames, duration = 240, delay = 0, cleanup = null) => {
    if (!node?.animate) { cleanup?.(); return; }
    const animation = node.animate(reduceMotion() ? [{ opacity: 0.65 }, { opacity: 1 }] : frames,
      { duration: reduceMotion() ? 100 : duration, delay: reduceMotion() ? 0 : delay, easing: "cubic-bezier(.2,.8,.2,1)" });
    effects.add(animation);
    animation.finished.catch(() => {}).finally(() => { effects.delete(animation); cleanup?.(); });
  };
  const cancelEffects = () => {
    effects.forEach((animation) => animation.cancel());
    effects.clear();
    document.querySelectorAll(".lantern-fx-layer").forEach((layer) => layer.replaceChildren());
    audio?.stop();
  };
  const flash = (node, strong = false) => animate(node,
    [{ filter: "brightness(1)" }, { filter: `brightness(${strong ? 1.9 : 1.45})` }, { filter: "brightness(1)" }], strong ? 420 : 220);
  const flyLight = (id, source, destination, exiting = false) => {
    const root = $("battleContent");
    const origin = source?.getBoundingClientRect();
    const arrival = destination?.getBoundingClientRect();
    const bounds = root.getBoundingClientRect();
    if (!origin || !arrival || !bounds.width || document.hidden) return;
    let layer = root.querySelector(".lantern-fx-layer");
    if (!layer) {
      layer = document.createElement("div"); layer.className = "lantern-fx-layer";
      layer.setAttribute("aria-hidden", "true"); root.append(layer);
    }
    // Use the owning content's logical coordinates, including uniform Canvas scale.
    const scale = bounds.width / root.offsetWidth;
    const center = (rect) => ({ x: (rect.left + rect.width / 2 - bounds.left) / scale + root.scrollLeft - 18,
      y: (rect.top + rect.height / 2 - bounds.top) / scale + root.scrollTop - 18 });
    const from = center(origin), to = center(arrival);
    const mote = icon(lanterns.find((lantern) => lantern.id === id), "lantern-icon lantern-fx-mote");
    mote.style.left = `${from.x}px`; mote.style.top = `${from.y}px`; layer.append(mote);
    if (layer.childElementCount > 12) layer.firstElementChild.remove();
    const frames = exiting
      ? [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.65) translateY(-12px)" }]
      : [{ opacity: 1, transform: "translate(0,0) scale(1)" },
        { opacity: 0, transform: `translate(${to.x - from.x}px,${to.y - from.y}px) scale(.8)` }];
    animate(mote, frames, exiting ? 180 : 300, 0, () => mote.remove());
  };
  const linkedClues = () => {
    const item = paths[state.path];
    const clues = routeClues(item, state.path);
    const available = new Map();
    new Set(clues.map(({ distance }) => distance)).forEach((distance) => {
      state.chain.forEach((id, index) => {
        if (index + distance >= state.chain.length) return;
        const key = `${distance}:${id}:${state.chain[index + distance]}`;
        available.set(key, (available.get(key) || 0) + 1);
      });
    });
    return clues.map(({ previous, name, distance }) => {
      const key = item.reverse ? `${distance}:${name}:${previous}` : `${distance}:${previous}:${name}`;
      const count = available.get(key) || 0;
      if (count) available.set(key, count - 1);
      return count > 0;
    });
  };
  const focusClue = (index) => {
    if (state.screen !== "battle") return;
    state.focusedClue = state.focusedClue === index ? null : index;
    renderBattle();
    const clue = routeClues(paths[state.path], state.path)[index];
    setBattleStatus(clueText(clue), "hint");
    audio?.play("feedback.hint");
  };
  let sharedFrame = null;
  let stageRailController = null;
  let stageBrowseIndex = 0;
  let stageRailResizeObserver = null;
  let stageProgressSnapshot = null;
  let stageBestsSnapshot = {};
  const centerStageAfterViewportChange = () => {
    if (state.screen === "stage") requestAnimationFrame(() => stageRailController?.center(stageBrowseIndex));
  };
  const t = (key, vars = {}) => {
    const table = copy[state.locale] || copy.en || {};
    let value = table[key] || copy.en?.[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const spanHint = () => (spanCopy[state.locale] || spanCopy.en)[1];
  const spanBrief = () => ({
    en: "+2: one light between. +3: two between. Wind-turn reverses arrows.",
    "zh-Hant": "+2：中間隔一盞；+3：隔兩盞。風轉時箭頭反向。",
    "zh-Hans": "+2：中间隔一盏；+3：隔两盏。风转时箭头反向。",
    ja: "+2は間に1つ、+3は2つ。逆風では矢印を逆読み。",
    ko: "+2는 사이에 하나, +3은 둘. 역풍은 화살표를 거꾸로 읽어요.",
    es: "+2: una luz entre ambas. +3: dos. El viento invierte las flechas.",
    "pt-BR": "+2: uma luz entre elas. +3: duas. O vento inverte as setas.",
    fr: "+2 : une lumière entre les deux. +3 : deux. Le vent inverse les flèches.",
    de: "+2: ein Licht dazwischen. +3: zwei. Gegenwind kehrt Pfeile um.",
    it: "+2: una luce in mezzo. +3: due. Il vento inverte le frecce.",
    ru: "+2: один огонь между ними. +3: два. Ветер разворачивает стрелки.",
    hi: "+2: बीच में एक दीप। +3: दो। उलटी हवा में तीर उलटे पढ़ें।",
    ar: "+2: فانوس بينهما. +3: فانوسان. الرياح تعكس الأسهم.",
  }[state.locale] || "+2: one light between. +3: two between. Wind-turn reverses arrows.");
  const clueText = ({ previous, name, distance = 1 }) => distance === 1
    ? t("clueFollow", { previous: t(previous), name: t(name) })
    : (spanCopy[state.locale] || spanCopy.en)[0].replaceAll("{previous}", t(previous)).replaceAll("{name}", t(name)).replaceAll("{steps}", String(distance));
  const icon = (lantern, className) => {
    const node = document.createElement("span");
    node.className = className;
    node.dataset.lantern = lantern.id;
    node.setAttribute("aria-hidden", "true");
    return node;
  };
  const track = (name, detail = {}) => {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: `animal_lantern_lattice_${name}`, ...detail });
      document.dispatchEvent(new CustomEvent("weightplay:animal-lantern-lattice", { detail: { name, ...detail } }));
    } catch (_) {}
  };
  const readBest = () => {
    try {
      const value = Number(localStorage.getItem(campaignBestKey));
      return Number.isFinite(value) && value > 0 ? value : null;
    } catch (_) { return null; }
  };
  const writeBest = (value) => {
    try {
      const old = readBest();
      if (!old || value < old) localStorage.setItem(campaignBestKey, String(value));
    } catch (_) {}
  };
  const readStageBests = () => {
    let parsed = {};
    try { parsed = JSON.parse(localStorage.getItem(stageBestKey) || "{}"); } catch (_) {}
    return Object.fromEntries(Object.entries(parsed).filter(([key, value]) => {
      const stage = Number(key);
      return Number.isInteger(stage) && stage >= 1 && stage <= paths.length && Number.isFinite(Number(value)) && Number(value) > 0;
    }).map(([key, value]) => [key, Number(value)]));
  };
  const readStageBest = (stageNumber) => readStageBests()[String(stageNumber)] || null;
  const writeStageBest = (stageNumber, value) => {
    try {
      const scores = readStageBests();
      const old = scores[String(stageNumber)];
      if (!old || value < old) {
        scores[String(stageNumber)] = value;
        localStorage.setItem(stageBestKey, JSON.stringify(scores));
      }
    } catch (_) {}
  };
  const readProgress = () => {
    let parsed = {};
    try { parsed = JSON.parse(localStorage.getItem(progressKey) || "{}"); } catch (_) {}
    const cleared = [...new Set((Array.isArray(parsed.cleared) ? parsed.cleared : [])
      .map(Number).filter((value) => Number.isInteger(value) && value >= 1 && value <= paths.length))].sort((a, b) => a - b);
    const highestFromClear = cleared.length ? Math.max(...cleared) + 1 : 1;
    const requested = Number(parsed.highestUnlocked);
    const highestUnlocked = Math.min(paths.length, Math.max(1, Number.isInteger(requested) ? requested : 1, highestFromClear));
    return { highestUnlocked, cleared };
  };
  const writeProgress = (progress) => {
    try { localStorage.setItem(progressKey, JSON.stringify(progress)); } catch (_) {}
  };
  const clearStage = (index) => {
    const progress = readProgress();
    const stageNumber = index + 1;
    if (!progress.cleared.includes(stageNumber)) progress.cleared.push(stageNumber);
    progress.cleared.sort((a, b) => a - b);
    progress.highestUnlocked = Math.min(paths.length, Math.max(progress.highestUnlocked, stageNumber + 1));
    writeProgress(progress);
  };
  const expectedTarget = (item) => item.reverse ? [...item.target].reverse() : item.target;
  const routeClues = (item, seed) => {
    const steps = item.clueSteps || item.target.slice(1).map((_, index) => [index, index + 1]);
    const clues = steps.map(([from, to]) => ({ previous: item.target[from], name: item.target[to], distance: to - from }));
    let value = (seed + 1) * 2654435761 >>> 0;
    const random = () => {
      value ^= value << 13;
      value ^= value >>> 17;
      value ^= value << 5;
      return (value >>> 0) / 4294967296;
    };
    for (let index = clues.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [clues[index], clues[swap]] = [clues[swap], clues[index]];
    }
    if (clues.length > 1 && clues.every((clue, index) => clue.previous === item.target[index] && clue.name === item.target[index + 1])) {
      clues.push(clues.shift());
    }
    return clues;
  };
  const starCountForChecks = (checks) => Math.max(1, Math.min(3, 4 - Number(checks)));
  const starMarks = (count) => `${"★".repeat(count)}${"☆".repeat(3 - count)}`;
  const renderProgress = () => {
    const progress = readProgress();
    const node = document.querySelector('[data-copy="progressBody"]');
    if (node) node.textContent = t("progressBody", { unlocked: progress.highestUnlocked, total: paths.length });
    const best = $("bestValue");
    if (best) best.textContent = readBest() || t("noBest");
  };
  const show = (screen) => {
    if (state.screen !== screen) cancelEffects();
    state.screen = screen;
    app.hidden = false;
    $("mainScreen").hidden = screen !== "main";
    $("stageScreen").hidden = screen !== "stage";
    $("battleScreen").hidden = screen !== "battle" && screen !== "result";
    $("battleContent").hidden = screen === "result";
    $("resultScreen").hidden = screen !== "result";
    const guide = $("gameGuide");
    guide.hidden = screen !== "main";
    guide.setAttribute("aria-hidden", String(screen !== "main"));
    document.body.dataset.screen = screen;
    if (screen === "main") renderProgress();
    if (sharedFrame) sharedFrame.activate(screen === "result" ? "battle" : screen, { covered: screen === "result" });
    if (screen === "main") {
      // Complete the scene handoff before Guide flow can introduce a scrollbar.
      window.dispatchEvent(new Event("weightplay:stage-sync"));
      window.WeightPlayBattleCanvas?.sync();
    }
  };
  const renderStages = ({ entry = false } = {}) => {
    const rail = $("stageList");
    const progress = stageProgressSnapshot = readProgress();
    stageBestsSnapshot = readStageBests();
    if (entry) stageBrowseIndex = state.campaignRun ? 0 : progress.highestUnlocked - 1;
    rail.setAttribute("aria-label", `${t("stageAll")} · ${t("progressBody", { unlocked: progress.highestUnlocked, total: paths.length })}`);
    // The shared rail skin enables smooth scrolling for legacy CSS snap rails.
    // This data-backed controller owns frame-by-frame movement and must not
    // have the browser animate each scrollLeft assignment behind its state.
    rail.style.setProperty("scroll-behavior", "auto", "important");
    const bindCard = (button, index) => {
      const item = paths[index];
      const unlocked = index + 1 <= stageProgressSnapshot.highestUnlocked;
      button.type = "button";
      button.className = `stage-card${unlocked ? "" : " locked"}`;
      button.dataset.index = String(index);
      button.dataset.stageIndex = String(index);
      button.setAttribute("aria-disabled", String(!unlocked));
      if (index + 1 === stageProgressSnapshot.highestUnlocked) button.dataset.wpStageRecommended = "true";
      else delete button.dataset.wpStageRecommended;
      const title = document.createElement("strong");
      title.textContent = t("stageRound", { n: index + 1, total: paths.length });
      const name = document.createElement("span");
      name.textContent = t(item.titleKey);
      const meta = document.createElement("em");
      meta.className = "stage-card-meta";
      meta.textContent = `${t(item.arcKey)}${item.checkpoint ? ` · ${t("checkpoint")}` : ""}`;
      const preview = document.createElement("small");
      preview.className = "stage-card-summary";
      const length = document.createElement("span");
      length.className = "stage-card-length";
      length.textContent = t("stageLength", { count: item.target.length });
      const pips = document.createElement("span");
      pips.className = "stage-route-pips";
      pips.setAttribute("aria-hidden", "true");
      for (let spot = 0; spot < item.target.length; spot += 1) pips.append(document.createElement("i"));
      const best = document.createElement("span");
      best.className = "stage-card-best";
      const bestChecks = stageBestsSnapshot[String(index + 1)];
      best.textContent = bestChecks
        ? t("stageBest", { count: bestChecks, stars: starMarks(starCountForChecks(bestChecks)) })
        : t("noBest");
      preview.append(length, pips, best);
      button.setAttribute("aria-label", `${title.textContent}: ${name.textContent}${unlocked ? `, ${length.textContent}, ${best.textContent}` : `, ${t("locked")}`}`);
      button.disabled = false;
      button.replaceChildren(title, name, meta, preview);
    };
    if (!stageRailController) {
      if (!window.WeightPlayStageV6?.install) throw new Error("Lantern Lattice requires the shared Stage V6 controller.");
      stageRailController = window.WeightPlayStageV6.install(rail, {
        total: paths.length,
        poolSize: 9,
        initialIndex: () => stageBrowseIndex,
        bind: bindCard,
        activate: (index) => {
          if (index + 1 <= readProgress().highestUnlocked) startPath(index, { campaign: state.campaignRun, resetSession: !state.campaignRun });
        },
        onChange: (index) => { stageBrowseIndex = index; },
      });
      if (!stageRailController) throw new Error("The shared Stage V6 controller could not initialize the Lantern Lattice rail.");
      if (typeof ResizeObserver === "function") {
        stageRailResizeObserver = new ResizeObserver(() => {
          if (state.screen === "stage") stageRailController?.center(stageBrowseIndex);
        });
        stageRailResizeObserver.observe(rail);
      }
    } else stageRailController.refresh();
    stageRailController.center(stageBrowseIndex);
  };

  const ruleVars = (item) => ({
    name: t(item.echoId || item.decoy || "owl"),
    echo: t(item.echoId || "owl"),
    decoy: t(item.decoy || "owl"),
  });
  const renderBattle = () => {
    const item = paths[state.path];
    const target = expectedTarget(item);
    $("battleContent").classList.toggle("is-dense", routeClues(item, state.path).length >= 3);
    $("roundLabel").textContent = t("stageRound", { n: state.path + 1, total: paths.length });
    $("battleRule").textContent = t(item.ruleKey, ruleVars(item));
    const hint = $("battleHint");
    if (item.clueSteps) {
      const detailed = Object.assign(document.createElement("span"), { className: "clue-detailed-hint", textContent: spanBrief() });
      const compact = Object.assign(document.createElement("span"), { className: "clue-compact-hint", textContent: t("clueHint") });
      compact.setAttribute("aria-hidden", "true"); hint.replaceChildren(detailed, compact);
      hint.setAttribute("aria-label", spanHint()); hint.title = spanHint();
    } else {
      hint.textContent = t("clueHint"); hint.removeAttribute("aria-label"); hint.removeAttribute("title");
    }
    $("sessionChecks").textContent = String(state.checks);
    const starBudget = document.createElement("span");
    const availableStars = starCountForChecks(state.checks + 1);
    starBudget.className = "route-star-budget";
    starBudget.textContent = "★".repeat(availableStars) + "☆".repeat(3 - availableStars);
    starBudget.setAttribute("role", "img");
    starBudget.setAttribute("aria-label", t("starRating", { stars: availableStars }));
    $("sessionChecks").append(starBudget);
    const clueList = $("clueList");
    const clueDeckKey = `${state.path}:${state.locale}`;
    if (clueList.dataset.deck !== clueDeckKey) {
      clueList.replaceChildren(...routeClues(item, state.path).map(({ previous, name, distance }, index) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button"; button.className = "clue-link"; button.dataset.clueIndex = String(index);
        button.dataset.clueDistance = String(distance);
        button.dataset.clueFrom = item.reverse ? name : previous;
        button.dataset.clueTo = item.reverse ? previous : name;
        const visual = document.createElement("span"); visual.className = "clue-pair"; visual.dir = "ltr";
        const arrow = Object.assign(document.createElement("span"), { className: "clue-arrow", textContent: "→" });
        if (distance > 1) arrow.style.width = "32px";
        arrow.setAttribute("aria-hidden", "true");
        visual.append(icon(lanterns.find((entry) => entry.id === previous), "chain-icon"), arrow,
          icon(lanterns.find((entry) => entry.id === name), "chain-icon"));
        const label = Object.assign(document.createElement("span"), { className: "clue-text",
          textContent: clueText({ previous, name, distance }) });
        button.append(visual, label);
        button.addEventListener("click", () => focusClue(index)); li.append(button);
        return li;
      }));
      clueList.dataset.deck = clueDeckKey;
    }
    let roster = $("routeRoster");
    if (!roster) {
      roster = document.createElement("div"); roster.id = "routeRoster"; roster.className = "route-roster";
      clueList.after(roster);
    }
    const rosterLabel = Object.assign(document.createElement("span"), { className: "route-roster-label", textContent: rosterText(0) });
    // Canonical animal order discloses the multiset, never the route order.
    roster.replaceChildren(rosterLabel, ...lanterns.filter(lantern => target.includes(lantern.id)).map(lantern => {
      const count = target.filter(id => id === lantern.id).length;
      const used = state.chain.filter(id => id === lantern.id).length;
      const chip = document.createElement("span"); chip.className = `route-roster-item${used === count ? " is-satisfied" : ""}`;
      chip.dataset.requiredLantern = lantern.id; chip.dataset.requiredCount = String(count);
      chip.title = `${t(lantern.key)} ×${count}`;
      chip.append(icon(lantern, "chain-icon"), Object.assign(document.createElement("span"), { className: "roster-name", textContent: t(lantern.key) }),
        Object.assign(document.createElement("span"), { textContent: `×${count}` }));
      return chip;
    }));
    const joined = linkedClues();
    clueList.querySelectorAll(".clue-link").forEach((button, index) => {
      const wasJoined = button.classList.contains("is-linked");
      button.classList.toggle("is-linked", joined[index]);
      button.classList.toggle("is-focused", state.focusedClue === index);
      button.setAttribute("aria-pressed", String(state.focusedClue === index));
      const distance = Number(button.dataset.clueDistance);
      button.querySelector(".clue-arrow").textContent = `${joined[index] ? "✓" : item.reverse ? "←" : "→"}${distance > 1 ? ` +${distance}` : ""}`;
      if (joined[index] && !wasJoined) flash(button);
    });
    let meter = $("linkMeter");
    if (!meter) {
      meter = document.createElement("span"); meter.id = "linkMeter"; meter.className = "link-meter";
      $("chainList").parentElement.querySelector("strong").append(meter);
    }
    const linked = joined.filter(Boolean).length;
    meter.textContent = `${linked}/${joined.length}`;
    meter.setAttribute("aria-label", t("linksProgress", { count: linked, total: joined.length }));
    meter.classList.toggle("is-complete", linked === joined.length);
    $("chainList").parentElement.classList.toggle("is-ready", state.chain.length === target.length);
    const chainList = $("chainList");
    let editButton = $("routeEditBtn");
    if (!editButton) {
      editButton = document.createElement("button"); editButton.id = "routeEditBtn";
      editButton.type = "button"; editButton.className = "route-edit-toggle";
      editButton.addEventListener("click", () => {
        if (state.screen !== "battle") return;
        state.swapMode = !state.swapMode; state.swapSlot = null;
        renderBattle();
        setBattleStatus(state.swapMode ? editText(1) : t("chainProgress", { count: state.chain.length, total: expectedTarget(paths[state.path]).length }), "hint");
      });
      chainList.parentElement.querySelector("strong").insertBefore(editButton, meter);
    }
    editButton.textContent = `↔ ${editText(0)}`;
    editButton.setAttribute("aria-pressed", String(state.swapMode));
    editButton.title = editText(1);
    chainList.setAttribute("aria-label", t("chainProgress", { count: state.chain.length, total: target.length }));
    if (chainList.children.length !== target.length) chainList.replaceChildren(...Array.from({ length: target.length }, (_, index) => {
      const slot = document.createElement("button"); slot.type = "button";
      slot.dataset.chainSlot = String(index); slot.addEventListener("click", () => {
        if (!state.swapMode) { rewindChain(index); return; }
        if (state.screen !== "battle" || !state.chain[index]) return;
        if (state.swapSlot === null) {
          state.swapSlot = index; renderBattle(); setBattleStatus(editText(2), "hint");
        } else {
          const first = state.swapSlot;
          state.swapSlot = null;
          [state.chain[first], state.chain[index]] = [state.chain[index], state.chain[first]];
          state.errorSlot = -1; state.verifiedPrefix = 0;
          renderBattle();
          if (first !== index) {
            flash(chainList.children[first]); flash(chainList.children[index]);
            audio?.play("board.move"); setBattleStatus(editText(3), "hint");
          } else setBattleStatus(editText(1), "hint");
        }
      });
      return slot;
    }));
    const remainingEdges = new Map();
    routeClues(item, state.path).filter(({ distance }) => distance === 1).forEach(({ previous, name }) => {
      const key = item.reverse ? `${name}:${previous}` : `${previous}:${name}`;
      remainingEdges.set(key, (remainingEdges.get(key) || 0) + 1);
    });
    [...chainList.children].forEach((slot, index) => {
      const id = state.chain[index];
      const lantern = id && lanterns.find((entry) => entry.id === id);
      const changed = slot.dataset.lantern !== (id || "");
      slot.className = `chain-slot${lantern ? " has-light" : ""}${state.errorSlot === index ? " is-wrong" : ""}${index < state.verifiedPrefix ? " is-verified" : ""}`;
      slot.classList.toggle("is-swap-picked", state.swapSlot === index);
      if (lantern && index > 0) {
        const key = `${state.chain[index - 1]}:${id}`;
        const count = remainingEdges.get(key) || 0;
        const edge = count > 0;
        if (edge) remainingEdges.set(key, count - 1);
        slot.classList.add(edge ? "is-linked-edge" : "is-unlinked-edge");
      }
      slot.dataset.lantern = id || "";
      slot.disabled = !lantern;
      slot.setAttribute("aria-hidden", String(!lantern));
      if (lantern) {
        slot.setAttribute("aria-label", state.swapMode ? `${editText(0)}: ${index + 1} · ${t(lantern.key)}` : t("undoLantern", { position: index + 1, name: t(lantern.key) }));
      } else slot.removeAttribute("aria-label");
      if (changed || !slot.children.length) slot.replaceChildren(...(lantern ? [icon(lantern, "chain-icon")] : []),
        Object.assign(document.createElement("span"), { className: "chain-position", textContent: String(index + 1) }));
      if (state.motionSlot === index) flash(slot);
    });
    state.motionSlot = null;
    const grid = $("lanternGrid");
    if (grid.dataset.deck !== clueDeckKey) {
      grid.replaceChildren(...lanterns.map((lantern) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lantern-choice"; button.dataset.lantern = lantern.id;
      const count = document.createElement("span"); count.className = "lantern-used"; count.setAttribute("aria-hidden", "true");
      button.append(icon(lantern, "lantern-icon"), Object.assign(document.createElement("b"), { textContent: t(lantern.key) }), count);
      button.addEventListener("click", (event) => chooseLantern(lantern.id, event));
      return button;
      }));
      grid.dataset.deck = clueDeckKey;
    }
    const focused = state.focusedClue === null ? null : routeClues(item, state.path)[state.focusedClue];
    [...chainList.children].forEach((slot) => slot.classList.toggle("is-clue-focus", Boolean(focused && [focused.previous, focused.name].includes(slot.dataset.lantern))));
    grid.querySelectorAll(".lantern-choice").forEach((button) => {
      const id = button.dataset.lantern;
      const used = state.chain.filter((entry) => entry === id).length;
      const canEcho = item.echoId === id && used === 1;
      button.disabled = used > 0 && !canEcho;
      button.classList.toggle("is-selected", used > 0);
      button.classList.toggle("is-clue-focus", Boolean(focused && [focused.previous, focused.name].includes(id)));
      button.querySelector(".lantern-used").textContent = used ? String(used) : "";
      button.setAttribute("aria-label", `${t("lantern", { name: t(id) })}${used ? ` · ${used}` : ""}`);
    });
    $("checkBtn").classList.toggle("is-path-ready", state.chain.length === target.length);
  };
  const renderResult = () => {
    const finalStage = state.path >= paths.length - 1;
    $("resultHeading").textContent = finalStage ? t("finishTitle") : t("correct");
    const item = paths[state.path];
    const resultVars = { stage: state.path + 1, next: state.path + 2, reward: t(item.rewardKey) };
    $("resultText").textContent = finalStage && state.lastResultCampaign
      ? t("campaignFinishText", { n: state.sessionChecks, best: readBest() || state.sessionChecks, reward: t(item.rewardKey) })
      : finalStage
        ? t("stageFinishText", { stage: state.path + 1, checks: state.checks, best: readStageBest(state.path + 1) || state.checks })
        : t(item.checkpoint ? "checkpointClear" : "stageClear", resultVars);
    $("skillReport").textContent = t("skillReportText");
    const stars = starCountForChecks(state.checks);
    const rating = $("resultRating");
    rating.replaceChildren(...Array.from({ length: 3 }, (_, index) => {
      const star = Object.assign(document.createElement("span"), { textContent: index < stars ? "★" : "☆" });
      star.className = index < stars ? "earned-star" : "empty-star";
      star.style.setProperty("--star-delay", `${index * 110}ms`); star.setAttribute("aria-hidden", "true");
      return star;
    }));
    rating.setAttribute("aria-label", t("starRating", { stars }));
    let route = $("resultRoute");
    if (!route) {
      route = document.createElement("div"); route.id = "resultRoute"; route.className = "result-route";
      rating.insertAdjacentElement("afterend", route);
    }
    route.setAttribute("aria-label", state.chain.map((id) => t(id)).join(" → "));
    route.replaceChildren(...state.chain.map((id, index) => {
      const light = icon(lanterns.find((lantern) => lantern.id === id), "chain-icon result-light");
      light.style.setProperty("--light-delay", `${index * 65}ms`); return light;
    }));
    $("resultScreen").dataset.clearQuality = stars === 3 ? "perfect" : "clear";
    const nextButton = $("resultPrimaryBtn");
    nextButton.textContent = t("nextStage");
    nextButton.disabled = finalStage;
    $("resultMapBtn").hidden = false;
    const replayButton = $("resultReplayBtn") || $("resultHomeBtn");
    if (replayButton) replayButton.textContent = t("replay");
    nextButton.onclick = () => startPath(state.path + 1, { campaign: state.campaignRun });
  };
  const guideCopy = window.ANIMAL_LANTERN_LATTICE_GUIDE_COPY || {};
  const relatedCopy = window.ANIMAL_LANTERN_LATTICE_RELATED || {};
  const seoComparison = window.ANIMAL_LANTERN_LATTICE_SEO_COMPARISON || {};
  const buildGuide = () => {
    const guide = guideCopy[state.locale] || guideCopy.en;
    return {
      ...guide,
      stepIntro: t("guideStepIntro"),
      steps: [
        ...["guideStepRead", "guideStepBuild", "guideStepUndo", "guideStepClear"].map((key) => `${t(key)}${key === "guideStepRead" ? ` ${t("clueHint")}` : ""}`),
        guide.steps[4],
        guide.steps[5],
      ],
      rules: `${t("guideRules")} ${spanHint()}`,
      tips: `${t("guideTips")} ${spanHint()}`,
    };
  };
  const renderGuide = () => {
    const guide=buildGuide(), seo=seoComparison[state.locale]||seoComparison.en, hero=$("guideHero"), sections=$("guideSections");
    if(!hero||!sections)return;
    hero.replaceChildren();
    const title=document.createElement("div");title.className="game-info-title";
    const kicker=document.createElement("span");kicker.className="game-info-kicker";kicker.textContent=t("guideTitle");
    const h2=document.createElement("h2");h2.textContent=t("title");
    const summary=document.createElement("p");summary.textContent=t("intro");title.append(kicker,h2,summary);
    if(seo){const tags=document.createElement("div");tags.className="game-info-tags";tags.dataset.wpGameplayTags="1.4.0";seo.tags.forEach((value)=>tags.append(Object.assign(document.createElement("span"),{textContent:value})));title.append(tags);}
    const facts=document.createElement("div");facts.className="game-info-facts";
    guide.facts.forEach((label,index)=>{const fact=document.createElement("div");fact.className="game-info-fact";fact.append(Object.assign(document.createElement("span"),{textContent:label}),Object.assign(document.createElement("strong"),{textContent:guide.values[index]}));facts.append(fact);});
    hero.append(title,facts);
    const bodies=[guide.overview,"",guide.rules,guide.progression,guide.tips,guide.design,guide.saved,""];
    sections.replaceChildren(...guide.headings.map((heading,index)=>{
      const article=document.createElement("article");article.className="game-info-section";
      article.append(Object.assign(document.createElement("h3"),{textContent:heading}));
      if(index===1){article.append(Object.assign(document.createElement("p"),{textContent:guide.stepIntro}));const steps=document.createElement("ol");guide.steps.forEach(step=>steps.append(Object.assign(document.createElement("li"),{textContent:step})));article.append(steps);}
      else if(index===7){const dl=document.createElement("dl");guide.faq.forEach(([q,a])=>{const row=document.createElement("div");row.append(Object.assign(document.createElement("dt"),{textContent:q}),Object.assign(document.createElement("dd"),{textContent:a}));dl.append(row);});article.append(dl);}
      else article.append(Object.assign(document.createElement("p"),{textContent:bodies[index]}));
      return article;
    }));
    const related = relatedCopy[state.locale] || relatedCopy.en;
    if (related) {
      const article = document.createElement("article");
      article.className = "game-info-section game-info-related-section";
      const heading = document.createElement("h3");
      heading.textContent = related.heading;
      const cards = document.createElement("div");
      cards.className = "game-info-related";
      for (const game of related.games) {
        const card = document.createElement("a");
        card.className = "game-info-related-card";
        card.href = `/${related.segment}/games/${game.id}/`;
        const copy = document.createElement("span");
        copy.className = "game-info-related-copy";
        const name = document.createElement("strong");
        name.textContent = game.title;
        const description = document.createElement("span");
        description.textContent = game.description;
        copy.append(name, description);
        card.append(copy);
        cards.append(card);
      }
      article.append(heading, cards);
      sections.append(article);
    }
  };
  const applyLocale = () => {
    cancelEffects();
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("localeSelect").value = state.locale;
    $("localeSelect").setAttribute("aria-label", t("language"));
    $("stageBackBtn").setAttribute("aria-label", t("backShort"));
    $("battleBackBtn").setAttribute("aria-label", t("backShort"));
    renderProgress();
    renderGuide();
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
    if (state.screen === "result") renderResult();
    sharedFrame?.refresh();
  };
  const startSession = () => {
    window.WeightPlayAudio?.preload(GAME_AUDIO_CUES);
    state.sessionChecks = 0;
    state.path = 0;
    state.chain = [];
    state.campaignRun = true;
    state.lastResultCampaign = false;
    show("stage");
    renderStages({ entry: true });
    track("session_start");
  };
  const startPath = (index, { campaign = false, resetSession = false } = {}) => {
    if (index < 0 || index >= paths.length || index + 1 > readProgress().highestUnlocked) return;
    cancelEffects();
    state.path = index;
    state.chain = [];
    state.motionSlot = null;
    state.focusedClue = null;
    state.swapMode = false; state.swapSlot = null;
    state.errorSlot = -1;
    state.verifiedPrefix = 0;
    state.checks = 0;
    state.campaignRun = campaign;
    state.lastResultCampaign = false;
    if (resetSession) state.sessionChecks = 0;
    battleEntryPointer = pointerSequence;
    show("battle");
    renderBattle();
    setBattleStatus(t("chainProgress", { count: 0, total: expectedTarget(paths[state.path]).length }));
    track("path_start", { path: state.path + 1, arc: paths[state.path].arcKey });
  };
  const chooseLantern = (id, event = null) => {
    if (event?.detail > 0 && pointerSequence === battleEntryPointer) return;
    if (state.screen !== "battle" || !lanterns.some((lantern) => lantern.id === id)) return;
    const item = paths[state.path];
    const used = state.chain.filter((entry) => entry === id).length;
    const canEcho = item.echoId === id && used === 1;
    if (state.chain.length >= expectedTarget(item).length || (used > 0 && !canEcho)) {
      setBattleStatus(t("chainReady"), "error"); audio?.play("feedback.error"); flash($("checkBtn")); return;
    }
    const source = $("lanternGrid").querySelector(`[data-lantern="${id}"] .lantern-icon`);
    const before = linkedClues().filter(Boolean).length;
    state.chain.push(id);
    state.motionSlot = state.chain.length - 1;
    state.errorSlot = -1; state.verifiedPrefix = 0;
    state.swapSlot = null;
    renderBattle();
    flyLight(id, source, $("chainList").children[state.chain.length - 1]);
    setBattleStatus(t(state.chain.length === expectedTarget(item).length ? "chainReady" : "chainProgress",
      { count: state.chain.length, total: expectedTarget(item).length }), "neutral");
    audio?.play(linkedClues().filter(Boolean).length > before ? "puzzle.match" : "board.move");
    track("lantern_choose", { path: state.path + 1, position: state.chain.length, lantern: id });
  };
  const rewindChain = (index) => {
    if (state.screen !== "battle" || index < 0 || index >= state.chain.length) return;
    state.chain.slice(index).forEach((id, offset) => flyLight(id, $("chainList").children[index + offset], $("chainList").children[index + offset], true));
    const removed = state.chain.length - index;
    state.chain = state.chain.slice(0, index);
    state.motionSlot = null;
    state.errorSlot = -1; state.verifiedPrefix = 0;
    state.swapSlot = null;
    renderBattle();
    setBattleStatus(t("chainProgress", { count: state.chain.length, total: expectedTarget(paths[state.path]).length }));
    audio?.play("board.undo");
    track("rewind", { path: state.path + 1, from: index + 1, removed });
  };
  const resetChain = () => {
    if (state.screen !== "battle") return;
    const hadLights = state.chain.length > 0;
    state.chain.forEach((id, index) => flyLight(id, $("chainList").children[index], $("chainList").children[index], true));
    state.chain = [];
    state.motionSlot = null;
    state.errorSlot = -1; state.verifiedPrefix = 0;
    state.swapSlot = null;
    renderBattle();
    setBattleStatus(t("chainProgress", { count: 0, total: expectedTarget(paths[state.path]).length }));
    if (hadLights) audio?.play("board.undo");
    else flash($("resetBtn"));
    track("reset", { path: state.path + 1 });
  };
  const checkPath = () => {
    if (state.screen !== "battle") return;
    const item = paths[state.path];
    const target = expectedTarget(item);
    if (state.chain.length < target.length) {
      setBattleStatus(t("campaignNeedMore", { count: target.length - state.chain.length }), "neutral");
      flash($("chainList").children[state.chain.length]); audio?.play("feedback.hint");
      track("check", { path: state.path + 1, checks: state.sessionChecks, correct: false, reason: "incomplete" });
      return;
    }
    state.checks += 1;
    state.sessionChecks += 1;
    renderBattle();
    const decoyChosen = item.decoy && state.chain.includes(item.decoy);
    const missing = lanterns.find(({ id }) => state.chain.filter(entry => entry === id).length < target.filter(entry => entry === id).length);
    const failedClue = linkedClues().findIndex(joined => !joined);
    track("check", { path: state.path + 1, checks: state.sessionChecks, correct: !missing && failedClue < 0 && !decoyChosen });
    if (decoyChosen) {
      state.errorSlot = state.chain.indexOf(item.decoy); state.verifiedPrefix = 0;
      renderBattle(); flash($("chainList").children[state.errorSlot]); audio?.play("feedback.error");
      setBattleStatus(t("decoyWrong", { name: t(item.decoy) }), "error");
      return;
    }
    if (missing) {
      state.errorSlot = state.chain.findIndex(id => state.chain.filter(entry => entry === id).length > target.filter(entry => entry === id).length);
      state.verifiedPrefix = 0;
      renderBattle(); audio?.play("feedback.error");
      setBattleStatus(rosterText(1, { name: t(missing.key), count: target.filter(id => id === missing.id).length }), "error");
      return;
    }
    if (failedClue >= 0) {
      state.errorSlot = -1; state.verifiedPrefix = 0; state.focusedClue = failedClue;
      renderBattle(); audio?.play("feedback.error");
      setBattleStatus(clueText(routeClues(item, state.path)[failedClue]), "error");
      return;
    }
    setBattleStatus(t("correct"), "success");
    clearStage(state.path);
    writeStageBest(state.path + 1, state.checks);
    const progress = readProgress();
    const campaignCompleted = state.campaignRun && state.path >= paths.length - 1 && progress.cleared.length === paths.length;
    if (campaignCompleted) {
      writeBest(state.sessionChecks);
      state.lastResultCampaign = true;
      state.campaignRun = false;
      track("session_complete", { checks: state.sessionChecks });
    }
    show("result");
    renderResult();
    audio?.play(item.checkpoint ? "result.win" : "puzzle.clear");
  };
  $("startBtn").addEventListener("click", startSession);
  $("mapBtn").addEventListener("click", () => { state.campaignRun = false; show("stage"); renderStages({ entry: true }); track("path_map"); });
  $("stageBackBtn").addEventListener("click", () => { state.campaignRun = false; show("main"); });
  $("battleBackBtn").addEventListener("click", () => { state.campaignRun = false; show("stage"); renderStages({ entry: true }); });
  $("resultMapBtn").addEventListener("click", () => { state.campaignRun = false; show("stage"); renderStages({ entry: true }); });
  $("resultHomeBtn").addEventListener("click", () => {
    state.campaignRun = false;
    startPath(state.path, { resetSession: true });
  });
  $("checkBtn").addEventListener("click", checkPath);
  $("resetBtn").addEventListener("click", resetChain);
  $("localeSelect").addEventListener("change", (event) => {
    state.locale = copy[event.target.value] ? event.target.value : "en";
    try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {}
    applyLocale();
    track("locale", { locale: state.locale });
  });
  try {
    const saved = localStorage.getItem("weightplayLocale");
    if (!routeLocale && saved && copy[saved]) state.locale = saved;
  } catch (_) {}
  $("localeSelect").value = state.locale;
  sharedFrame = window.WeightPlayScreenFrame.mount({
    root: app,
    localeSelect: $("localeSelect"),
    scenes: {
      main: { root: $("mainScreen"), header: $("mainHeader"), content: $("mainContent") },
      stage: { root: $("stageScreen"), header: $("stageHeader"), content: $("stageContent") },
      battle: { root: $("battleScreen"), header: $("battleHeader"), content: $("battleContent"), headerInfo: $("battleHeaderInfo") },
    },
  });
  window.addEventListener("resize", centerStageAfterViewportChange);
  const effectPauseObserver = new MutationObserver(() => {
    const covered = $("battleContent").inert;
    effects.forEach((animation) => covered ? animation.pause() : animation.play());
    if (covered) audio?.stop();
  });
  effectPauseObserver.observe($("battleContent"), { attributes: true, attributeFilter: ["inert"] });
  window.addEventListener("pagehide", (event) => {
    cancelEffects();
    if (event.persisted) return;
    effectPauseObserver.disconnect();
    audio?.dispose();
    window.removeEventListener("resize", centerStageAfterViewportChange);
    stageRailResizeObserver?.disconnect();
    stageRailController?.destroy();
    stageRailController = null;
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) cancelEffects(); });
  const revealMain = () => {
    // Install the one persistent rail owner before Main becomes interactive;
    // returning from Stage must not add a second set of document writers.
    renderStages();
    $("loadingPanel").hidden = true; show("main"); applyLocale(); track("main_ready");
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", revealMain, { once: true });
  else revealMain();
  window.__ANIMAL_LANTERN_LATTICE_TEST__ = {
    paths,
    lanterns,
    expectedTarget,
    startSession,
    startPath,
    chooseLantern,
    checkPath,
    getProgress: readProgress,
    getBest: readBest,
    getStageBests: readStageBests,
    getState: () => ({ ...state, chain: [...state.chain] }),
  };

  const installInterfaceSevenRuntime = () => {
    if (document.querySelector('link[href*="interface-7-cleanup.css"]')) return;
    const stageScreen = $("stageScreen");
    const battleScreen = $("battleScreen");
    const stageCanvas = stageScreen?.querySelector(".stage-canvas");
    stageScreen?.setAttribute("data-wp-logical-stage-canvas", "");
    stageScreen?.setAttribute("data-wp-canvas-max-width", "920");
    stageScreen?.setAttribute("data-wp-frame-play-fill", "");
    stageScreen?.setAttribute("data-wp-frame-logical-header", "stage");
    stageCanvas?.setAttribute("data-wp-standard-stage-screen", "");
    battleScreen?.setAttribute("data-wp-logical-battle-canvas", "");
    battleScreen?.setAttribute("data-wp-canvas-max-width", "920");
    battleScreen?.setAttribute("data-wp-frame-play-fill", "");
    battleScreen?.setAttribute("data-wp-frame-logical-header", "battle");
    // Use the shared scaler's compact envelope instead of shrinking a 788px
    // portrait reference into landscape and leaving unreadable controls.
    battleScreen?.setAttribute("data-wp-battle-landscape-width", "760");
    battleScreen?.setAttribute("data-wp-battle-landscape-height", "334");

    const markup = [
      '<link rel="stylesheet" href="/src/stage-selector-standard.css" data-wp-stage-standard>',
      '<link rel="stylesheet" href="/src/game-screen-frame.css?v=20260921-interface7-single-frame-v2">',
       '<link rel="stylesheet" href="/games/animal-lantern-lattice/interface-7-cleanup.css?v=20260924-lantern-i7-hit-target-fix">',
      '<script src="/src/stage-selector-standard.js" data-wp-stage-standard></script>',
      '<script src="/src/stage-virtualization-standard.js?v=20260809-stage-v6-source-demotion-v8" data-wp-stage-virtualization-standard></script>',
      '<script src="/src/battle-canvas-standard.js?v=20260911-folded-field-battle-envelope-v1" data-wp-battle-standard></script>',
       '<script src="/games/animal-lantern-lattice/interface-7-compat.js?v=20260924-lantern-i7-copy-hit-target-fix"></script>',
      '<script src="/games/animal-lantern-lattice/interface-7-followup.js?v=20260923-lantern-i7-cleanup2"></script>',
      '<script src="/src/game-screen-frame.js?v=20260921-interface7-single-frame-v2&wp-audio=1.0.0"></script>',
    ].join("");
    if (document.readyState === "loading") document.write(markup);
  };
  installInterfaceSevenRuntime();
})();
