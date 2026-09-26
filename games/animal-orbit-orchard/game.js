(function () {
  "use strict";
  if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  const resetInitialScroll = () => {
    if (document.body?.dataset.screen !== "main") return;
    window.scrollTo({ left: 0, top: 0, behavior: "instant" });
  };
  window.addEventListener("pageshow", resetInitialScroll, { once: true });
  window.addEventListener("load", () => window.setTimeout(resetInitialScroll, 320), { once: true });
  const locales = window.ORBIT_ORCHARD_LOCALES;
  const START_LABELS = {
    en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲーム開始", ko: "게임 시작",
    es: "Iniciar juego", "pt-BR": "Iniciar jogo", fr: "Démarrer le jeu", de: "Spiel starten", it: "Inizia gioco",
    ru: "Начать игру", hi: "गेम शुरू करें", ar: "ابدأ اللعبة",
  };
  const LEAVE_COPY = {
    en: ["Leave this orbit?", "Your current orbit attempt and release count will be discarded.", "Continue playing", "Return to Stages"],
    "zh-Hant": ["要離開目前軌道嗎？", "目前這一關的操作與放手次數將不會保留。", "繼續遊戲", "返回關卡"],
    "zh-Hans": ["要离开当前轨道吗？", "当前这一关的操作与释放次数将不会保留。", "继续游戏", "返回关卡"],
    ja: ["この軌道を離れますか？", "現在の操作とリリース回数は保存されません。", "プレイを続ける", "ステージへ戻る"],
    ko: ["현재 궤도를 나갈까요?", "현재 시도와 발사 횟수는 저장되지 않습니다.", "계속 플레이", "스테이지로 돌아가기"],
    es: ["¿Salir de esta órbita?", "Se descartarán el intento actual y el número de lanzamientos.", "Seguir jugando", "Volver a niveles"],
    "pt-BR": ["Sair desta órbita?", "A tentativa atual e a contagem de lançamentos serão descartadas.", "Continuar jogando", "Voltar às fases"],
    fr: ["Quitter cette orbite ?", "La tentative en cours et le nombre de lâchers seront perdus.", "Continuer", "Retour aux niveaux"],
    de: ["Diese Umlaufbahn verlassen?", "Der aktuelle Versuch und die Anzahl der Freigaben werden verworfen.", "Weiterspielen", "Zurück zu den Stufen"],
    it: ["Lasciare questa orbita?", "Il tentativo corrente e il conteggio dei rilasci verranno scartati.", "Continua a giocare", "Torna ai livelli"],
    ru: ["Покинуть эту орбиту?", "Текущая попытка и число запусков будут сброшены.", "Продолжить игру", "Вернуться к этапам"],
    hi: ["इस कक्षा से बाहर जाएँ?", "मौजूदा प्रयास और रिलीज़ की गिनती हटा दी जाएगी।", "खेल जारी रखें", "स्टेज पर लौटें"],
    ar: ["مغادرة هذا المدار؟", "سيتم تجاهل المحاولة الحالية وعدد مرات الإطلاق.", "متابعة اللعب", "العودة إلى المراحل"],
  };
  Object.entries(START_LABELS).forEach(([locale, label]) => {
    if (locales?.[locale]) locales[locale].start = label;
  });
  const ensureStylesheet = () => {
    if (document.querySelector('link[href*="interface-7-cleanup.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "interface-7-cleanup.css?v=20260922-orbit-interface7-cleanup-v2";
    document.head.append(link);
  };
  ensureStylesheet();
  const motionStyle = document.createElement("style");
  motionStyle.textContent = `
    .orbit-card{transition:transform .22s ease,box-shadow .22s ease}
    .orbit-card:hover,.orbit-card:focus-visible{transform:translateY(-5px);box-shadow:0 12px 24px rgba(20,70,85,.18)}
    .beacon{transition:filter .18s ease;will-change:transform}.seed{will-change:transform}
    .battle-status{transition:transform .2s ease,opacity .2s ease}
    .primary-btn,.secondary-btn{transition:transform .14s ease,filter .14s ease}
    .primary-btn:active,.secondary-btn:active{transform:scale(.97)}
    @media (prefers-reduced-motion:reduce){.orbit-card,.battle-status,.primary-btn,.secondary-btn{transition:none!important}}
  `;
  document.head.append(motionStyle);
  const makeStage = (id, arc, angles, beacons, objective, extra = {}) => ({
    id, arc, objective, tolerance: 16, checkpoint: id % 5 === 0,
    targets: angles.map((angle, index) => ({
      angle, beacon: beacons[index], decoy: extra.decoys?.[index] || "",
    })),
    ...extra,
  });
  const rounds = [
    makeStage(1, 1, [42], ["dewBell"], "objectiveAim", { tolerance: 18 }),
    makeStage(2, 1, [188], ["moonApple"], "objectiveAim", { startAngle: 234, tolerance: 18 }),
    makeStage(3, 1, [352], ["starPear"], "objectiveDecoy", { decoys: ["moonApple"], decoyAngles: [224], tolerance: 14 }),
    makeStage(4, 1, [36, 214], ["twinDew", "moonApple"], "objectiveRelay", { tolerance: 15 }),
    makeStage(5, 1, [8, 151, 318], ["lantern", "dewBell", "starPear"], "objectiveMemory", { memory: true, awardClamp: true, tolerance: 14 }),
    makeStage(6, 2, [64], ["dewBell"], "objectiveDrift", { drift: { steps: [24], pattern: "clockwise" }, tolerance: 16 }),
    makeStage(7, 2, [204], ["moonApple"], "objectiveDrift", { drift: { steps: [18, -18], pattern: "alternate" }, tolerance: 15 }),
    makeStage(8, 2, [44, 238], ["dewBell", "starPear"], "objectiveDrift", { drift: { steps: [16, -22], pattern: "alternate" }, tolerance: 15 }),
    makeStage(9, 2, [317, 95], ["moonApple", "dewBell"], "objectiveDrift", { drift: { steps: [-20, 14], pattern: "alternate" }, tolerance: 14 }),
    makeStage(10, 2, [18, 173, 292], ["lantern", "moonApple", "starPear"], "objectiveMemory", { memory: true, drift: { steps: [16, -20, 24], pattern: "byTarget" }, tolerance: 13 }),
    makeStage(11, 3, [82], ["dewBell"], "objectiveShade", { gate: { blockedByTarget: ["clockwise"] }, tolerance: 15 }),
    makeStage(12, 3, [241], ["moonApple"], "objectiveShade", { gate: { blockedByTarget: ["counterclockwise"] }, tolerance: 15 }),
    makeStage(13, 3, [52, 196], ["twinDew", "starPear"], "objectiveShade", { gate: { blockedByTarget: ["clockwise", "counterclockwise"] }, tolerance: 14 }),
    makeStage(14, 3, [330, 104], ["starPear", "dewBell"], "objectiveShade", { gate: { blockedByTarget: ["counterclockwise", "clockwise"], rotateOnSuccess: true }, tolerance: 14 }),
    makeStage(15, 3, [68, 213, 345], ["moonApple", "dewBell", "starPear"], "objectiveShade", { gate: { blockedByTarget: [null, null, null], openBothFinal: true }, laneSetupDegrees: 42, tolerance: 14 }),
    makeStage(16, 4, [28], ["firefly"], "objectiveVeil", { veiled: true, tolerance: 14 }),
    makeStage(17, 4, [166], ["moonApple"], "objectiveDecoy", { veiled: true, decoys: ["starPear"], decoyAngles: [43], tolerance: 13 }),
    makeStage(18, 4, [48, 229], ["firefly", "starPear"], "objectiveVeil", { veiled: true, tolerance: 13 }),
    makeStage(19, 4, [302, 121], ["starPear", "firefly"], "objectiveVeil", { veiled: true, gate: { blockedByTarget: ["clockwise", "counterclockwise"] }, tolerance: 13 }),
    makeStage(20, 4, [16, 143, 276], ["lantern", "moonApple", "firefly"], "objectiveMemory", { memory: true, veiled: true, gate: { blockedByTarget: ["clockwise", "counterclockwise", "clockwise"] }, tolerance: 12 }),
    makeStage(21, 5, [75, 258], ["moonApple", "starPear"], "objectiveClamp", { drift: { steps: [20, -22], pattern: "alternate" }, gate: { blockedByTarget: ["clockwise", "counterclockwise"] }, tolerance: 13 }),
    makeStage(22, 5, [12, 190], ["dewBell", "moonApple"], "objectiveClamp", { decoys: ["starPear", ""], decoyAngles: [157], drift: { steps: [18, -18], pattern: "alternate" }, tolerance: 13 }),
    makeStage(23, 5, [88, 236], ["starPear", "moonApple"], "objectiveShade", { drift: { steps: [18, -18], pattern: "alternate" }, gate: { blockedByTarget: ["clockwise", "counterclockwise"], rotateOnAny: true }, tolerance: 12 }),
    makeStage(24, 5, [354, 118, 205], ["moonApple", "firefly", "starPear"], "objectiveClamp", { veiled: true, drift: { steps: [16, -20, 22], pattern: "byTarget" }, gate: { blockedByTarget: ["clockwise", "counterclockwise", "clockwise"], rotateOnAny: true }, tolerance: 12 }),
    makeStage(25, 5, [41, 187, 329], ["lantern", "moonApple", "starPear"], "objectiveMemory", { memory: true, drift: { steps: [18, -20, 22], pattern: "byTarget" }, gate: { blockedByTarget: ["counterclockwise", "clockwise", "counterclockwise"] }, tolerance: 12 }),
    makeStage(26, 6, [24, 160], ["moonApple", "firefly"], "objectiveVeil", { veiled: true, gate: { blockedByTarget: ["clockwise", "clockwise"] }, tolerance: 12 }),
    makeStage(27, 6, [91, 244], ["starPear", "firefly"], "objectiveDrift", { veiled: true, drift: { steps: [16, -18], pattern: "alternate" }, gate: { blockedByTarget: ["clockwise", "counterclockwise"], rotateOnAny: true }, tolerance: 11 }),
    makeStage(28, 6, [6, 132, 281], ["dewBell", "firefly", "moonApple"], "objectiveShade", { veiled: true, gate: { blockedByTarget: ["clockwise", "counterclockwise", "clockwise"] }, tolerance: 11 }),
    makeStage(29, 6, [58, 199, 342], ["moonApple", "starPear", "firefly"], "objectiveClamp", { veiled: true, decoys: ["dewBell", "", ""], decoyAngles: [234], drift: { steps: [18, -20, 22], pattern: "byTarget" }, gate: { blockedByTarget: ["clockwise", "counterclockwise", "clockwise"], rotateOnAny: true }, tolerance: 10 }),
    makeStage(30, 6, [32, 154, 287, 8], ["firefly", "dewBell", "starPear", "nightkeeper"], "objectiveFinale", { veiled: true, memory: true, drift: { steps: [18, -20, 22, -24], pattern: "byTarget" }, gate: { blockedByTarget: ["clockwise", "counterclockwise", "clockwise", null], openBothFinal: true }, openBothLanesOnFinal: true, tolerance: 10 }),
  ];
  const CAMPAIGN_KEYS = [
    "stageTitle", "locked", "cleared", "stageReady", "checkpoint",
    "objectiveAim", "objectiveDecoy", "objectiveRelay", "objectiveDrift", "objectiveShade", "objectiveVeil", "objectiveMemory", "objectiveClamp", "objectiveFinale",
    "targetChoice", "targetWrong", "targetSelected", "laneChoice", "clockwise", "counterclockwise", "laneWrong", "laneRequired", "laneOpenBoth",
    "driftClockwise", "driftCounterclockwise", "targetVeiled", "clampLabel", "clampArm", "clampArmed", "clampUsed", "clampDormant", "clampReward",
    "patternTitle", "patternIntro", "patternReady", "stageFinish", "campaignFinish",
    "dewBell", "moonApple", "starPear", "firefly", "lantern", "orchardLight", "nightkeeper", "arcNames",
  ];
  // Each row follows CAMPAIGN_KEYS (except its final arcNames slot); the route
  // generator consumes the same stable order to produce every locale shell.
  const CAMPAIGN_ROWS = {
    en: ["Stage {id} · {arc}", "Locked — clear the previous stage", "Cleared", "Ready", "Checkpoint",
      "Read the beacon and tune a clear correction.", "Find the named light among the decoys.", "Release the orchard lights in the shown order.", "A miss moves the beacon; read its new cue.", "Choose an open lane around the shade before aiming.", "Use the light and its name; the numeric angle is hidden.", "Preview the ordered lights, then follow each new cue.", "Choose when to spend the one-use Prism Clamp.", "Complete the four-light finale and choose a safe final lane.",
      "Choose the named beacon", "That is a decoy. Choose the named beacon.", "Named beacon selected.", "Choose your approach lane", "Clockwise", "Counterclockwise", "Shade blocks that lane. Choose the other lane.", "Choose a lane before releasing.", "Both lanes are open; your choice sets the next starting angle.",
      "Miss: the beacon drifted clockwise to {angle}°.", "Miss: the beacon drifted counterclockwise to {angle}°.", "Find {name} by its light; its angle is veiled.", "Prism Clamp", "Hold the beacon on the next drift", "Clamp ready for one drifting miss", "Clamp used for this stage", "The clamp holds a drifting beacon after an aim miss; it cannot open a shaded lane.", "Checkpoint reward: the Prism Clamp is available once per stage from Stage 6.",
      "Preview the light order", "Remember the shown beacons. Each next cue appears after a correct release.", "Ready to follow the cues", "Stage {id} complete in {releases} releases. Your clear is saved.", "Chapter complete in {releases} releases. All 30 stages are saved.",
      "Dew Bell", "Moon Apple", "Star Pear", "Firefly", "Lantern", "Orchard light", "Nightkeeper"],
    "zh-Hant": ["第 {id} 關・{arc}", "未解鎖，請先完成前一關", "已完成", "可遊玩", "檢查點",
      "觀察信標，調整軌道後再放出種子。", "從誘餌中找出指定光點。", "依照顯示順序依次點亮果園信標。", "失誤後信標會移動，請讀取新的提示。", "先選擇陰影之外的通道，再瞄準。", "依光點和名稱判斷；角度數字會隱藏。", "先記住光點順序，再依序跟隨新提示。", "思考何時使用每關一次的稜鏡夾。", "完成四個信標的終章，並選擇安全的最後通道。",
      "選擇指定信標", "那是誘餌，請選擇指定信標。", "已選擇指定信標。", "選擇接近通道", "順時針", "逆時針", "陰影擋住此通道，請改選另一側。", "放出種子前請先選擇通道。", "兩側都可通行；選擇會決定下一段的起始角度。",
      "失誤：信標順時針移至 {angle}°。", "失誤：信標逆時針移至 {angle}°。", "依光點尋找{name}，角度已隱藏。", "稜鏡夾", "固定信標，抵擋下一次漂移", "稜鏡夾已備妥，可抵擋一次漂移", "本關已使用稜鏡夾", "稜鏡夾可在瞄準失誤後固定漂移信標，不能打開陰影通道。", "檢查點獎勵：第 6 關起每關可使用一次稜鏡夾。",
      "先預覽信標順序", "記住顯示的信標；成功放出後才會出現下一個提示。", "準備好後依提示前進", "第 {id} 關已完成，共放出 {releases} 次；進度已儲存。", "章節完成，共放出 {releases} 次；30 關進度已儲存。",
      "露珠鐘", "月光蘋果", "星星梨", "螢火光點", "燈籠結", "果園微光", "夜園守望者"],
    "zh-Hans": ["第 {id} 关・{arc}", "未解锁，请先完成前一关", "已完成", "可游玩", "检查点",
      "观察信标，调整轨道后再放出种子。", "从诱饵中找出指定光点。", "按显示顺序依次点亮果园信标。", "失误后信标会移动，请读取新的提示。", "先选择阴影之外的通道，再瞄准。", "按光点和名称判断；角度数字会隐藏。", "先记住光点顺序，再依次跟随新提示。", "考虑何时使用每关一次的棱镜夹。", "完成四个信标的终章，并选择安全的最后通道。",
      "选择指定信标", "那是诱饵，请选择指定信标。", "已选择指定信标。", "选择接近通道", "顺时针", "逆时针", "阴影挡住此通道，请改选另一侧。", "放出种子前请先选择通道。", "两侧都可通行；选择会决定下一段的起始角度。",
      "失误：信标顺时针移至 {angle}°。", "失误：信标逆时针移至 {angle}°。", "按光点寻找{name}，角度已隐藏。", "棱镜夹", "固定信标，抵挡下一次漂移", "棱镜夹已备妥，可抵挡一次漂移", "本关已使用棱镜夹", "棱镜夹可在瞄准失误后固定漂移信标，不能打开阴影通道。", "检查点奖励：第 6 关起每关可使用一次棱镜夹。",
      "先预览信标顺序", "记住显示的信标；成功放出后才会出现下一个提示。", "准备好后依提示前进", "第 {id} 关已完成，共放出 {releases} 次；进度已保存。", "章节完成，共放出 {releases} 次；30 关进度已保存。",
      "露珠钟", "月光苹果", "星星梨", "萤火光点", "灯笼结", "果园微光", "夜园守望者"],
    ja: ["ステージ {id}・{arc}", "未解放・先に前のステージをクリア", "クリア済み", "プレイ可能", "チェックポイント",
      "灯台を見て、軌道を合わせましょう。", "おとりの中から指定された光を探しましょう。", "表示された順に果樹園の灯りを放ちましょう。", "失敗すると灯りが移動します。新しい合図を読みましょう。", "影を避ける通路を選んでから狙いましょう。", "光と名前で見分けます。角度の数字は隠れています。", "順番を覚え、次々に現れる合図を追いましょう。", "各ステージ1回のプリズムクランプを使うタイミングを選びましょう。", "4つの灯りをつなぐ最終章を終え、安全な最後の通路を選びましょう。",
      "指定された灯りを選択", "おとりです。指定された灯りを選んでください。", "灯りを選択しました。", "進む通路を選択", "時計回り", "反時計回り", "その通路は影にふさがれています。反対側を選びましょう。", "放つ前に通路を選んでください。", "両方の通路が開いています。選択で次の開始角度が変わります。",
      "失敗：灯りが時計回りに {angle}° 移動しました。", "失敗：灯りが反時計回りに {angle}° 移動しました。", "角度を隠した{name}を光で見つけましょう。", "プリズムクランプ", "次の漂流で灯りを固定", "漂流へのクランプを1回使用できます", "このステージでは使用済み", "クランプは狙いを外した漂流灯を固定します。影の通路は開けません。", "チェックポイント報酬：ステージ6以降、各ステージでクランプを1回使えます。",
      "灯りの順番を確認", "表示された灯りを覚えましょう。成功すると次の合図が現れます。", "合図を追う準備ができました", "ステージ{id}を{releases}回でクリア。進行状況を保存しました。", "章を{releases}回で完了。30ステージを保存しました。",
      "しずくの鐘", "月のリンゴ", "星のナシ", "ホタル", "ランタン", "果樹園の灯り", "夜の守り手"],
    ko: ["스테이지 {id} · {arc}", "잠김 · 이전 스테이지를 먼저 완료하세요", "완료", "도전 가능", "체크포인트",
      "신호등을 보고 궤도를 맞추세요.", "미끼 사이에서 지정된 빛을 찾으세요.", "표시된 순서대로 과수원 신호를 맞추세요.", "실패하면 신호가 이동합니다. 새 단서를 확인하세요.", "그늘을 피해 열린 경로를 먼저 고르세요.", "빛과 이름으로 찾으세요. 각도 숫자는 숨겨집니다.", "빛의 순서를 기억하고 다음 단서를 따라가세요.", "스테이지당 한 번인 프리즘 클램프의 사용 시점을 고르세요.", "네 개의 빛으로 마지막 장을 완성하고 안전한 마지막 경로를 고르세요.",
      "지정된 신호 선택", "미끼입니다. 지정된 신호를 고르세요.", "신호를 선택했습니다.", "접근 경로 선택", "시계 방향", "시계 반대 방향", "그늘이 막고 있습니다. 반대 경로를 고르세요.", "발사 전에 경로를 고르세요.", "두 경로가 모두 열려 있습니다. 선택에 따라 다음 시작 각도가 달라집니다.",
      "실패: 신호가 시계 방향으로 {angle}° 이동했습니다.", "실패: 신호가 시계 반대 방향으로 {angle}° 이동했습니다.", "각도를 숨긴 {name}을 빛으로 찾으세요.", "프리즘 클램프", "다음 표류에서 신호 고정", "표류 실패를 한 번 막을 준비 완료", "이 스테이지에서 사용 완료", "클램프는 조준 실패 뒤 표류 신호를 고정하지만 그늘 경로를 열지는 못합니다.", "체크포인트 보상: 6스테이지부터 각 스테이지에서 클램프를 한 번 사용할 수 있습니다.",
      "빛의 순서 미리 보기", "표시된 신호를 기억하세요. 성공한 뒤 다음 단서가 나타납니다.", "단서를 따라갈 준비 완료", "{id}스테이지 완료 · {releases}회 발사 · 진행 상황 저장", "{releases}회 발사로 챕터 완료 · 30개 스테이지 저장",
      "이슬 종", "달빛 사과", "별 배", "반딧불", "등불 매듭", "과수원 빛", "밤의 수호자"],
    es: ["Nivel {id} · {arc}", "Bloqueado: supera primero el nivel anterior", "Completado", "Disponible", "Punto de control",
      "Observa la baliza y ajusta la órbita.", "Encuentra la luz indicada entre los señuelos.", "Libera las luces del huerto en el orden mostrado.", "Un fallo mueve la baliza; lee la nueva señal.", "Elige un carril abierto alrededor de la sombra antes de apuntar.", "Guíate por la luz y su nombre; el ángulo queda oculto.", "Recuerda el orden y sigue cada nueva señal.", "Decide cuándo usar la Pinza Prisma, una vez por nivel.", "Completa el final de cuatro luces y elige un carril seguro.",
      "Elige la baliza indicada", "Es un señuelo. Elige la baliza indicada.", "Baliza elegida.", "Elige el carril de entrada", "Horario", "Antihorario", "La sombra bloquea ese carril. Elige el otro.", "Elige un carril antes de liberar.", "Ambos carriles están abiertos; tu elección cambia el ángulo inicial siguiente.",
      "Fallo: la baliza deriva en sentido horario a {angle}°.", "Fallo: la baliza deriva en sentido antihorario a {angle}°.", "Encuentra {name} por su luz; el ángulo está oculto.", "Pinza Prisma", "Fijar baliza en la próxima deriva", "Pinza lista para una deriva", "Pinza usada en este nivel", "La pinza fija una baliza tras un fallo de puntería; no abre carriles en sombra.", "Recompensa: desde el nivel 6, puedes usar la Pinza Prisma una vez por nivel.",
      "Vista previa del orden", "Recuerda las balizas mostradas. La siguiente señal aparece tras acertar.", "Listo para seguir las señales", "Nivel {id} completado en {releases} lanzamientos. Progreso guardado.", "Capítulo completado en {releases} lanzamientos. Los 30 niveles están guardados.",
      "Campana de rocío", "Manzana lunar", "Pera estelar", "Luciérnaga", "Farol", "Luz del huerto", "Vigía nocturno"],
    "pt-BR": ["Fase {id} · {arc}", "Bloqueada: conclua a fase anterior primeiro", "Concluída", "Disponível", "Ponto de controle",
      "Observe o farol e ajuste a órbita.", "Encontre a luz indicada entre as iscas.", "Solte as luzes do pomar na ordem exibida.", "Um erro move o farol; leia a nova pista.", "Escolha uma rota aberta ao redor da sombra antes de mirar.", "Use a luz e o nome; o ângulo numérico fica oculto.", "Memorize a ordem e acompanhe cada nova pista.", "Escolha quando usar o Grampo Prisma, uma vez por fase.", "Conclua o final de quatro luzes e escolha uma rota segura.",
      "Escolha o farol indicado", "É uma isca. Escolha o farol indicado.", "Farol escolhido.", "Escolha a rota de aproximação", "Horário", "Anti-horário", "A sombra bloqueia essa rota. Escolha a outra.", "Escolha uma rota antes de soltar.", "As duas rotas estão abertas; sua escolha define o próximo ângulo inicial.",
      "Erro: o farol derivou no sentido horário para {angle}°.", "Erro: o farol derivou no sentido anti-horário para {angle}°.", "Encontre {name} pela luz; o ângulo está oculto.", "Grampo Prisma", "Fixar o farol na próxima deriva", "Grampo pronto para uma deriva", "Grampo usado nesta fase", "O grampo fixa um farol após um erro de mira; não abre rotas sombreadas.", "Recompensa: a partir da fase 6, use o Grampo Prisma uma vez por fase.",
      "Prévia da ordem das luzes", "Memorize os faróis exibidos. A próxima pista surge após um acerto.", "Pronto para seguir as pistas", "Fase {id} concluída em {releases} lançamentos. Progresso salvo.", "Capítulo concluído em {releases} lançamentos. As 30 fases foram salvas.",
      "Sino de orvalho", "Maçã lunar", "Pera estelar", "Vaga-lume", "Lanterna", "Luz do pomar", "Guardião noturno"],
    fr: ["Niveau {id} · {arc}", "Verrouillé : terminez d’abord le niveau précédent", "Terminé", "Disponible", "Point de contrôle",
      "Observez le phare et ajustez l’orbite.", "Trouvez la lumière demandée parmi les leurres.", "Libérez les lumières du verger dans l’ordre indiqué.", "Un échec déplace le phare ; lisez le nouvel indice.", "Choisissez une voie ouverte autour de l’ombre avant de viser.", "Suivez la lumière et son nom ; l’angle est masqué.", "Mémorisez l’ordre et suivez chaque nouvel indice.", "Choisissez quand utiliser la Pince Prismatique, une fois par niveau.", "Terminez le final à quatre lumières et choisissez une voie sûre.",
      "Choisir le phare demandé", "C’est un leurre. Choisissez le phare demandé.", "Phare choisi.", "Choisir la voie d’approche", "Sens horaire", "Sens antihoraire", "L’ombre bloque cette voie. Choisissez l’autre.", "Choisissez une voie avant le lancer.", "Les deux voies sont ouvertes ; votre choix règle le prochain angle de départ.",
      "Échec : le phare dérive dans le sens horaire jusqu’à {angle}°.", "Échec : le phare dérive dans le sens antihoraire jusqu’à {angle}°.", "Trouvez {name} grâce à sa lumière ; l’angle est masqué.", "Pince Prismatique", "Stabiliser le phare à la prochaine dérive", "Pince prête pour une dérive", "Pince utilisée pour ce niveau", "La pince stabilise un phare après une erreur de visée ; elle n’ouvre pas une voie ombragée.", "Récompense : dès le niveau 6, une utilisation de la Pince Prismatique par niveau.",
      "Aperçu de l’ordre lumineux", "Mémorisez les phares affichés. Le prochain indice apparaît après une réussite.", "Prêt à suivre les indices", "Niveau {id} terminé en {releases} lancers. Progression enregistrée.", "Chapitre terminé en {releases} lancers. Les 30 niveaux sont enregistrés.",
      "Cloche de rosée", "Pomme lunaire", "Poire étoilée", "Luciole", "Lanterne", "Lumière du verger", "Gardien de la nuit"],
    de: ["Stufe {id} · {arc}", "Gesperrt: Schließe zuerst die vorherige Stufe ab", "Abgeschlossen", "Bereit", "Kontrollpunkt",
      "Lies das Leuchtfeuer und richte die Umlaufbahn aus.", "Finde das benannte Licht zwischen den Ablenkungen.", "Gib die Obstgartenlichter in der angezeigten Reihenfolge frei.", "Ein Fehlwurf bewegt das Leuchtfeuer; lies den neuen Hinweis.", "Wähle vor dem Zielen einen offenen Weg um den Schatten.", "Nutze Licht und Namen; der Zahlenwinkel bleibt verborgen.", "Merke dir die Lichtfolge und folge jedem neuen Hinweis.", "Wähle den Einsatz der Prismenklemme, einmal pro Stufe.", "Schließe das Finale mit vier Lichtern ab und wähle einen sicheren letzten Weg.",
      "Benanntes Leuchtfeuer wählen", "Das ist eine Ablenkung. Wähle das benannte Leuchtfeuer.", "Leuchtfeuer gewählt.", "Anflugweg wählen", "Im Uhrzeigersinn", "Gegen den Uhrzeigersinn", "Der Schatten blockiert diesen Weg. Wähle den anderen.", "Wähle vor dem Freigeben einen Weg.", "Beide Wege sind offen; deine Wahl bestimmt den nächsten Startwinkel.",
      "Fehlwurf: Das Leuchtfeuer driftet im Uhrzeigersinn auf {angle}°.", "Fehlwurf: Das Leuchtfeuer driftet gegen den Uhrzeigersinn auf {angle}°.", "Finde {name} am Licht; der Winkel ist verborgen.", "Prismenklemme", "Leuchtfeuer beim nächsten Drift halten", "Klemme für einen Drift bereit", "Klemme in dieser Stufe verbraucht", "Die Klemme hält ein driftendes Leuchtfeuer nach einem Zielfehler; sie öffnet keinen Schattenweg.", "Kontrollpunkt-Belohnung: Ab Stufe 6 ist die Prismenklemme einmal je Stufe verfügbar.",
      "Lichtfolge ansehen", "Merke dir die gezeigten Leuchtfeuer. Nach einem Treffer erscheint der nächste Hinweis.", "Bereit für die Hinweise", "Stufe {id} mit {releases} Freigaben abgeschlossen. Fortschritt gespeichert.", "Kapitel mit {releases} Freigaben abgeschlossen. Alle 30 Stufen sind gespeichert.",
      "Taulicht-Glocke", "Mondapfel", "Sternbirne", "Glühwürmchen", "Laterne", "Obstgartenlicht", "Nachtwächter"],
    it: ["Livello {id} · {arc}", "Bloccato: completa prima il livello precedente", "Completato", "Disponibile", "Checkpoint",
      "Osserva il faro e regola l’orbita.", "Trova la luce indicata tra i richiami.", "Rilascia le luci del frutteto nell’ordine mostrato.", "Un errore sposta il faro; leggi il nuovo indizio.", "Scegli un percorso aperto attorno all’ombra prima di mirare.", "Segui luce e nome; l’angolo numerico è nascosto.", "Memorizza l’ordine e segui ogni nuovo indizio.", "Scegli quando usare la Morsa Prismatica, una volta per livello.", "Completa il finale a quattro luci e scegli un percorso sicuro.",
      "Scegli il faro indicato", "È un’esca. Scegli il faro indicato.", "Faro scelto.", "Scegli il percorso d’avvicinamento", "Orario", "Antiorario", "L’ombra blocca il percorso. Scegli l’altro.", "Scegli un percorso prima del rilascio.", "Entrambi i percorsi sono aperti; la scelta determina il prossimo angolo iniziale.",
      "Errore: il faro si sposta in senso orario a {angle}°.", "Errore: il faro si sposta in senso antiorario a {angle}°.", "Trova {name} seguendo la luce; l’angolo è nascosto.", "Morsa Prismatica", "Fissa il faro alla prossima deriva", "Morsa pronta per una deriva", "Morsa usata in questo livello", "La morsa ferma un faro dopo un errore di mira; non apre i percorsi ombreggiati.", "Ricompensa checkpoint: dal livello 6, una morsa per livello.",
      "Anteprima dell’ordine luminoso", "Ricorda i fari mostrati. Il prossimo indizio appare dopo un rilascio corretto.", "Pronto a seguire gli indizi", "Livello {id} completato in {releases} rilasci. Progressi salvati.", "Capitolo completato in {releases} rilasci. Tutti i 30 livelli sono salvati.",
      "Campana di rugiada", "Mela lunare", "Pera stellare", "Lucciola", "Lanterna", "Luce del frutteto", "Custode notturno"],
    ru: ["Этап {id} · {arc}", "Закрыто: сначала пройдите предыдущий этап", "Пройдено", "Доступно", "Контрольный этап",
      "Найдите маяк и настройте орбиту.", "Найдите названный огонёк среди приманок.", "Запускайте огни сада в указанном порядке.", "После ошибки маяк смещается; прочитайте новую подсказку.", "Перед наведением выберите открытый путь вокруг тени.", "Ориентируйтесь по свету и названию; угол скрыт.", "Запомните порядок огней и следуйте новым подсказкам.", "Решите, когда применить Призменный зажим — один раз за этап.", "Завершите финал с четырьмя огнями и выберите безопасный путь.",
      "Выберите названный маяк", "Это приманка. Выберите названный маяк.", "Маяк выбран.", "Выберите путь подхода", "По часовой стрелке", "Против часовой стрелки", "Тень перекрывает путь. Выберите другой.", "Выберите путь до запуска.", "Оба пути открыты; выбор задаёт следующий начальный угол.",
      "Промах: маяк сместился по часовой стрелке к {angle}°.", "Промах: маяк сместился против часовой стрелки к {angle}°.", "Найдите {name} по свету; угол скрыт.", "Призменный зажим", "Удержать маяк при следующем дрейфе", "Зажим готов к одному дрейфу", "Зажим использован на этом этапе", "Зажим удерживает дрейфующий маяк после ошибки прицеливания, но не открывает путь в тени.", "Награда контрольного этапа: с этапа 6 зажим доступен один раз на этап.",
      "Запомните порядок огней", "Запомните показанные маяки. Следующая подсказка появится после точного запуска.", "Можно следовать подсказкам", "Этап {id} пройден за {releases} запусков. Прогресс сохранён.", "Глава пройдена за {releases} запусков. Все 30 этапов сохранены.",
      "Колокол росы", "Лунное яблоко", "Звёздная груша", "Светлячок", "Фонарь", "Огонёк сада", "Ночной хранитель"],
    hi: ["चरण {id} · {arc}", "बंद है · पहले पिछला चरण पूरा करें", "पूरा हुआ", "उपलब्ध", "जाँच बिंदु",
      "संकेतक देखें और कक्षा मिलाएँ।", "दिए गए नाम वाली रोशनी को भ्रमक संकेतों में खोजें।", "बगीचे की रोशनियों को दिखाए गए क्रम में छोड़ें।", "चूक पर संकेतक खिसकता है; नया संकेत पढ़ें।", "निशाना लगाने से पहले छाया के चारों ओर खुला रास्ता चुनें।", "रोशनी और नाम से पहचानें; कोण की संख्या छिपी है।", "रोशनी का क्रम याद रखें और हर नए संकेत का पालन करें।", "हर चरण में एक बार मिलने वाले प्रिज़्म क्लैम्प का समय चुनें।", "चार रोशनियों वाला अंतिम भाग पूरा करें और सुरक्षित आखिरी रास्ता चुनें।",
      "बताया गया संकेतक चुनें", "यह भ्रमक रोशनी है। बताया गया संकेतक चुनें।", "संकेतक चुना गया।", "आने का रास्ता चुनें", "घड़ी की दिशा", "घड़ी की उलटी दिशा", "छाया ने यह रास्ता रोका है। दूसरा रास्ता चुनें।", "छोड़ने से पहले रास्ता चुनें।", "दोनों रास्ते खुले हैं; आपकी पसंद अगला शुरुआती कोण तय करती है।",
      "चूक: संकेतक घड़ी की दिशा में {angle}° पर गया।", "चूक: संकेतक उलटी दिशा में {angle}° पर गया।", "कोण छिपा है; {name} को उसकी रोशनी से खोजें।", "प्रिज़्म क्लैम्प", "अगली बहाव पर संकेतक रोकें", "एक बहाव रोकने के लिए क्लैम्प तैयार", "इस चरण में क्लैम्प इस्तेमाल हो चुका है", "क्लैम्प निशाना चूकने के बाद बहते संकेतक को रोकता है; यह छाया वाला रास्ता नहीं खोलता।", "इनाम: चरण 6 से हर चरण में प्रिज़्म क्लैम्प का एक उपयोग।",
      "रोशनी का क्रम देखें", "दिखाए गए संकेतक याद रखें। सही छोड़ने पर अगला संकेत दिखेगा।", "संकेतों का पालन करने के लिए तैयार", "चरण {id} {releases} बार छोड़कर पूरा हुआ। प्रगति सहेजी गई।", "अध्याय {releases} बार छोड़कर पूरा हुआ। सभी 30 चरण सहेजे गए।",
      "ओस की घंटी", "चाँद सेब", "तारा नाशपाती", "जुगनू", "लालटेन", "बगीचे की रोशनी", "रात्रि रक्षक"],
    ar: ["المرحلة {id} · {arc}", "مغلقة · أكمل المرحلة السابقة أولاً", "مكتملة", "متاحة", "نقطة تحقق",
      "راقب المنارة واضبط المدار.", "اعثر على الضوء المحدد بين الأضواء المضللة.", "أطلق أضواء البستان بالترتيب المعروض.", "يحرّك الخطأ المنارة؛ اقرأ الإشارة الجديدة.", "اختر مساراً مفتوحاً حول الظل قبل التصويب.", "استدل بالضوء والاسم؛ زاوية الرقم مخفية.", "تذكّر ترتيب الأضواء واتبع كل إشارة جديدة.", "اختر وقت استخدام ملزمة المنشور، مرة واحدة لكل مرحلة.", "أكمل النهاية ذات الأضواء الأربعة واختر مساراً آمناً أخيراً.",
      "اختر المنارة المحددة", "هذا ضوء مضلل. اختر المنارة المحددة.", "تم اختيار المنارة.", "اختر مسار الاقتراب", "مع عقارب الساعة", "عكس عقارب الساعة", "الظل يحجب هذا المسار. اختر المسار الآخر.", "اختر مساراً قبل الإطلاق.", "المساران مفتوحان؛ اختيارك يحدد زاوية البداية التالية.",
      "خطأ: انجرفت المنارة مع عقارب الساعة إلى {angle}°.", "خطأ: انجرفت المنارة عكس عقارب الساعة إلى {angle}°.", "اعثر على {name} من ضوئه؛ الزاوية مخفية.", "ملزمة المنشور", "ثبّت المنارة عند الانجراف التالي", "الملزمة جاهزة لإيقاف انجراف واحد", "استُخدمت الملزمة في هذه المرحلة", "تثبّت الملزمة المنارة المنجرفة بعد خطأ التصويب؛ لكنها لا تفتح مسار الظل.", "مكافأة نقطة التحقق: استخدام واحد للملزمة في كل مرحلة ابتداءً من المرحلة 6.",
      "اعرض ترتيب الأضواء", "تذكّر المنارات المعروضة. تظهر الإشارة التالية بعد الإطلاق الصحيح.", "استعد لاتباع الإشارات", "اكتملت المرحلة {id} في {releases} إطلاقات. حُفظ تقدمك.", "اكتمل الفصل في {releases} إطلاقات. حُفظت المراحل الثلاثون.",
      "جرس الندى", "تفاحة القمر", "كمثرى النجمة", "يراعة", "فانوس", "ضوء البستان", "حارس الليل"],
  };
  const CAMPAIGN_GUIDE_COPY = {
    en: ["Follow a 30-stage moonlit route through six orchard arcs.", "{cleared} of {total} stages cleared · no timer · calm retries", "Tune a seed toward each named beacon. Later stages add ordered lights, drifting targets, shaded lanes, and veiled angles.", "Clears, the next unlocked stage, and your best release count for each stage stay in this browser. Older best-release data is preserved. Cleared stages remain open to replay; locked stages cannot enter Battle.", "Read the light and name before you adjust. A wrong release is safe. Drift changes the target only where the stage says so; the Prism Clamp can hold one drifting beacon, but never opens a shaded lane.", "The Moonlit Orchard Routes contain six five-stage arcs: Dewlight Ring, Moon Current, Shadow-Grove Paths, Firefly Signals, Prism Weave, and Night Orchard. Checkpoints appear at Stages 5, 10, 15, 20, 25, and 30. Stage 5 awards the Prism Clamp for one use on each later stage. Ordered lights advance only after a correct release; a miss keeps the current light available for another try. Choose an open lane when shade appears, and remember that the final lane choice can affect the next starting angle. Stage 30 is the four-light Nightkeeper finale. There is no timer, life loss, purchase, or forced wait. Your progress is local to this browser, and every cleared route can be replayed.", "Progress is stored locally by stage. Completing Stage 5 unlocks the Prism Clamp; later stages become available in order."],
    "zh-Hant": ["沿著月夜果園的六段旅程，完成 30 個關卡。", "已完成 {cleared} / {total} 關・無計時・可安心重試", "引導種子前往指定信標。後續關卡會加入依序點亮、漂移目標、陰影通道與隱藏角度。", "通關紀錄、下一個解鎖關卡和每關最佳放出次數會保存在此瀏覽器，舊的最佳次數也會保留。已完成關卡仍可重玩；未解鎖關卡不能進入戰鬥。", "調整前先觀察光點與名稱。放錯仍可安心重試。只有指定關卡會在失誤後漂移；稜鏡夾可固定一次漂移信標，但不能打開陰影通道。", "月夜果園路線包含六段、每段五關：露光環、月流、月影林徑、螢火訊號、稜鏡編織與夜果園。第 5、10、15、20、25、30 關是檢查點。第 5 關會授予稜鏡夾，往後每關可用一次。依序信標必須放出正確後才會前進；失誤後仍可瞄準目前信標。遇到陰影時請選擇開放通道，最後的通道選擇也可能影響下一段的起始角度。第 30 關是四個信標的夜園守望者終章。全程沒有計時、失去生命、購買或強制等待。進度僅保存在此瀏覽器，每個已完成路線都可重玩。", "每關進度都只儲存在本機。完成第 5 關會解鎖稜鏡夾；後續關卡依序開放。"],
    "zh-Hans": ["沿着月夜果园的六段旅程，完成 30 个关卡。", "已完成 {cleared} / {total} 关・无计时・可安心重试", "引导种子前往指定信标。后续关卡会加入依序点亮、漂移目标、阴影通道与隐藏角度。", "通关记录、下一个解锁关卡和每关最佳放出次数会保存在此浏览器，旧的最佳次数也会保留。已完成关卡仍可重玩；未解锁关卡不能进入战斗。", "调整前先观察光点与名称。放错仍可安心重试。只有指定关卡会在失误后漂移；棱镜夹可固定一次漂移信标，但不能打开阴影通道。", "月夜果园路线包含六段、每段五关：露光环、月流、月影林径、萤火信号、棱镜编织与夜果园。第 5、10、15、20、25、30 关是检查点。第 5 关会授予棱镜夹，往后每关可用一次。依序信标必须放出正确后才会前进；失误后仍可瞄准当前信标。遇到阴影时请选择开放通道，最后的通道选择也可能影响下一段的起始角度。第 30 关是四个信标的夜园守望者终章。全程没有计时、失去生命、购买或强制等待。进度仅保存在此浏览器，每个已完成路线都可重玩。", "每关进度只保存在本地。完成第 5 关会解锁棱镜夹；后续关卡依序开放。"],
    ja: ["月明かりの果樹園を巡る6つの章、全30ステージに挑戦します。", "{total}ステージ中{cleared}クリア・時間制限なし・何度でも安全に再挑戦", "名前の付いた灯りへ種を合わせます。後半では順番、漂流、影の道、隠された角度が加わります。", "クリア記録、次の解放ステージ、各ステージの最少リリース数はこのブラウザーに保存されます。以前のベスト記録も保持します。クリア済みは再挑戦でき、未解放ステージからは開始できません。", "調整する前に光と名前を確認します。失敗しても安全です。漂流が起こるステージだけで目標が動きます。プリズムクランプは漂流灯を一度固定しますが、影の道は開けません。", "月夜の果樹園ルートは5ステージずつの6章です。チェックポイントは5、10、15、20、25、30。ステージ5でプリズムクランプを獲得し、以降は各ステージで一度使えます。順番のある灯りは正しいリリース後に進み、失敗しても同じ灯りを狙い直せます。影が現れたら開いている道を選びます。最後の道の選択が次の開始角度を変えることもあります。ステージ30は4つの灯りを結ぶ夜の守り手です。制限時間、ライフ消失、購入、強制待機はありません。進行状況はこのブラウザーだけに保存され、クリア済みのルートは再挑戦できます。", "進行状況はステージごとに端末内へ保存されます。ステージ5でクランプが解放され、以降のステージが順番に開きます。"],
    ko: ["달빛 과수원의 여섯 구간을 따라 30개 스테이지를 진행하세요.", "{total}개 중 {cleared}개 완료 · 시간 제한 없음 · 안전한 재도전", "이름이 있는 신호에 씨앗을 맞추세요. 후반에는 순서, 표류, 그늘 경로, 숨겨진 각도가 추가됩니다.", "완료 기록, 다음 해금 스테이지, 스테이지별 최소 발사 횟수는 이 브라우저에 저장됩니다. 이전 최고 기록도 보존됩니다. 완료한 스테이지는 다시 할 수 있고 잠긴 스테이지는 시작할 수 없습니다.", "조정 전에 빛과 이름을 확인하세요. 실패해도 안전합니다. 표류 규칙이 있는 스테이지에서만 목표가 움직입니다. 프리즘 클램프는 표류 신호를 한 번 고정하지만 그늘 경로를 열지는 않습니다.", "달빛 과수원 경로는 다섯 스테이지씩 여섯 구간으로 구성됩니다. 체크포인트는 5, 10, 15, 20, 25, 30입니다. 5스테이지에서 프리즘 클램프를 얻고 이후 각 스테이지에서 한 번 사용할 수 있습니다. 순서가 있는 신호는 정확히 발사한 뒤 다음으로 넘어가며, 실패해도 현재 신호를 다시 조준할 수 있습니다. 그늘이 나타나면 열린 경로를 고르세요. 마지막 경로 선택은 다음 시작 각도를 바꿀 수 있습니다. 30스테이지는 네 빛을 잇는 밤의 수호자 결말입니다. 시간 제한, 생명 손실, 구매, 강제 대기는 없습니다. 진행 상황은 이 브라우저에만 저장되며 완료한 경로는 다시 플레이할 수 있습니다.", "진행 상황은 스테이지별로 이 기기에 저장됩니다. 5스테이지를 완료하면 클램프가 열리고 이후 스테이지가 순서대로 해금됩니다."],
    es: ["Recorre seis arcos nocturnos y completa 30 niveles del huerto.", "{cleared} de {total} niveles completados · sin temporizador · reintento seguro", "Alinea la semilla con cada baliza nombrada. Más adelante hay secuencias, deriva, rutas en sombra y ángulos ocultos.", "Los niveles completados, el siguiente nivel desbloqueado y tu mejor número de lanzamientos por nivel se guardan en este navegador. También se conserva el antiguo récord. Puedes repetir los niveles superados; los bloqueados no se pueden iniciar.", "Lee la luz y su nombre antes de ajustar. Un fallo es seguro. La baliza solo deriva cuando el nivel lo indica. La Pinza Prisma puede fijar una baliza una vez, pero nunca abre un carril en sombra.", "Las Rutas del Huerto Lunar tienen seis arcos de cinco niveles. Los puntos de control son 5, 10, 15, 20, 25 y 30. El nivel 5 entrega la Pinza Prisma para usarla una vez en cada nivel posterior. Las luces ordenadas avanzan tras un lanzamiento correcto; un fallo mantiene la luz actual para otro intento. Cuando aparece sombra, elige un carril abierto. La elección del último carril también puede cambiar el ángulo inicial siguiente. El nivel 30 es el final de cuatro luces del Vigía Nocturno. No hay temporizador, pérdida de vidas, compras ni espera obligatoria. El progreso es local y puedes repetir cada ruta superada.", "El progreso se guarda localmente por nivel. Al completar el nivel 5 se desbloquea la pinza y luego se abren los niveles en orden."],
    "pt-BR": ["Percorra seis arcos noturnos e conclua 30 fases do pomar.", "{cleared} de {total} fases concluídas · sem cronômetro · tentativas seguras", "Alinhe a semente a cada farol nomeado. Depois surgem sequências, deriva, rotas sombreadas e ângulos ocultos.", "As fases concluídas, a próxima fase liberada e seu melhor número de lançamentos por fase ficam neste navegador. O recorde antigo também é preservado. Fases concluídas podem ser repetidas; as bloqueadas não podem ser iniciadas.", "Leia a luz e o nome antes de ajustar. Errar é seguro. O farol só deriva quando a fase indicar. O Grampo Prisma pode fixar um farol uma vez, mas nunca abre uma rota sombreada.", "As Rotas do Pomar ao Luar têm seis arcos de cinco fases. Os pontos de controle são 5, 10, 15, 20, 25 e 30. A fase 5 entrega o Grampo Prisma, com um uso em cada fase posterior. As luzes ordenadas avançam após um lançamento correto; um erro mantém a luz atual para outra tentativa. Quando surgir sombra, escolha uma rota aberta. A escolha da última rota também pode mudar o próximo ângulo inicial. A fase 30 é o final de quatro luzes do Guardião Noturno. Não há cronômetro, perda de vidas, compras nem espera forçada. O progresso é local e toda rota concluída pode ser repetida.", "O progresso fica salvo localmente por fase. Conclua a fase 5 para liberar o grampo; as demais fases abrem em ordem."],
    fr: ["Parcourez six arcs nocturnes et terminez les 30 niveaux du verger.", "{cleared} niveau(x) sur {total} terminé(s) · sans minuteur · reprise sûre", "Alignez la graine sur chaque phare nommé. La suite ajoute des séquences, la dérive, des voies ombragées et des angles masqués.", "Les niveaux terminés, le prochain niveau débloqué et votre meilleur nombre de lancers par niveau sont enregistrés dans ce navigateur. L’ancien record est conservé. Les niveaux terminés restent rejouables ; les niveaux verrouillés ne peuvent pas démarrer.", "Lisez la lumière et son nom avant d’ajuster. Un échec est sans danger. Le phare ne dérive que si le niveau le prévoit. La Pince Prismatique peut stabiliser un phare une fois, mais n’ouvre jamais une voie ombragée.", "Les Routes du Verger au Clair de Lune comprennent six arcs de cinq niveaux. Les points de contrôle sont les niveaux 5, 10, 15, 20, 25 et 30. Le niveau 5 offre la Pince Prismatique, utilisable une fois par niveau suivant. Les lumières ordonnées avancent après un lancer réussi ; un échec laisse la lumière actuelle disponible. Si une ombre apparaît, choisissez une voie ouverte. Le dernier choix de voie peut aussi modifier l’angle de départ suivant. Le niveau 30 est le final à quatre lumières du Gardien de la Nuit. Aucun minuteur, aucune vie perdue, aucun achat ni attente forcée. La progression reste locale et chaque route terminée est rejouable.", "La progression est enregistrée localement par niveau. Terminez le niveau 5 pour débloquer la pince ; les suivants s’ouvrent dans l’ordre."],
    de: ["Durchquere sechs Nachtbögen und schließe alle 30 Obstgartenstufen ab.", "{cleared} von {total} Stufen abgeschlossen · kein Timer · sichere Wiederholung", "Richte den Samen auf jedes benannte Leuchtfeuer aus. Später kommen Folgen, Drift, Schattenwege und verborgene Winkel hinzu.", "Abgeschlossene Stufen, die nächste Freischaltung und dein bester Wert an Freigaben je Stufe werden in diesem Browser gespeichert. Der alte Bestwert bleibt erhalten. Abgeschlossene Stufen sind wiederholbar; gesperrte Stufen lassen sich nicht starten.", "Lies Licht und Namen, bevor du nachstellst. Ein Fehlwurf ist sicher. Das Leuchtfeuer driftet nur, wenn die Stufe es vorgibt. Die Prismenklemme hält ein Leuchtfeuer einmal fest, öffnet aber keinen Schattenweg.", "Die Mondschein-Obstgartenrouten haben sechs Bögen mit je fünf Stufen. Kontrollpunkte sind 5, 10, 15, 20, 25 und 30. Stufe 5 verleiht die Prismenklemme für je eine Nutzung in späteren Stufen. Geordnete Lichter rücken erst nach einem Treffer weiter; nach einem Fehlwurf bleibt das aktuelle Licht verfügbar. Wähle bei Schatten einen offenen Weg. Die letzte Wegwahl kann auch den nächsten Startwinkel ändern. Stufe 30 ist das Vier-Lichter-Finale des Nachtwächters. Es gibt keinen Timer, keinen Lebensverlust, keine Käufe und keine erzwungene Wartezeit. Dein Fortschritt bleibt lokal und abgeschlossene Routen sind wiederholbar.", "Der Fortschritt wird lokal je Stufe gespeichert. Schließe Stufe 5 ab, um die Klemme freizuschalten; danach öffnen sich die Stufen der Reihe nach."],
    it: ["Attraversa sei archi notturni e completa tutti i 30 livelli del frutteto.", "{cleared} livelli su {total} completati · nessun timer · tentativi sicuri", "Allinea il seme a ogni faro nominato. In seguito arrivano sequenze, deriva, percorsi in ombra e angoli nascosti.", "I livelli completati, il prossimo livello sbloccato e il tuo miglior numero di rilasci per livello restano in questo browser. Il vecchio record viene conservato. I livelli completati si possono ripetere; quelli bloccati non si possono avviare.", "Leggi luce e nome prima di regolare. Un errore è sicuro. Il faro deriva solo quando previsto dal livello. La Morsa Prismatica può fissare un faro una volta, ma non apre un percorso in ombra.", "Le Rotte del Frutteto al Chiaro di Luna hanno sei archi di cinque livelli. I checkpoint sono 5, 10, 15, 20, 25 e 30. Il livello 5 offre la Morsa Prismatica, utilizzabile una volta in ogni livello successivo. Le luci in sequenza avanzano dopo un rilascio corretto; un errore lascia disponibile la luce attuale. Quando compare l’ombra, scegli un percorso aperto. L’ultima scelta può anche modificare l’angolo iniziale successivo. Il livello 30 è il finale a quattro luci del Custode Notturno. Nessun timer, perdita di vite, acquisto o attesa obbligatoria. I progressi restano locali e ogni rotta completata si può ripetere.", "I progressi vengono salvati localmente per livello. Completa il livello 5 per sbloccare la morsa; poi i livelli si aprono in ordine."],
    ru: ["Пройдите шесть ночных арок и все 30 этапов сада.", "Пройдено {cleared} из {total} этапов · без таймера · безопасный повтор", "Направляйте семя к названному маяку. Позже появятся последовательности, дрейф, теневые пути и скрытые углы.", "Пройденные этапы, следующий открытый этап и лучший счёт запусков для каждого этапа хранятся в этом браузере. Старый рекорд сохраняется. Пройденные этапы можно повторять; закрытые нельзя начать.", "Сначала прочитайте свет и название. Ошибка безопасна. Маяк смещается только по правилам этапа. Призменный зажим один раз удержит дрейфующий маяк, но не откроет путь в тени.", "Маршруты Лунного сада состоят из шести арок по пять этапов. Контрольные точки: 5, 10, 15, 20, 25 и 30. На этапе 5 вы получите Призменный зажим — по одному применению на каждом следующем этапе. Последовательные огни сменяются только после точного запуска; после ошибки текущий огонь остаётся доступен. При появлении тени выберите открытый путь. Последний выбор также может изменить следующий начальный угол. Этап 30 — финал из четырёх огней с Ночным хранителем. Здесь нет таймера, потери жизней, покупок и обязательного ожидания. Прогресс хранится локально, пройденные маршруты можно повторять.", "Прогресс этапов хранится локально. Этап 5 открывает зажим, затем этапы открываются по порядку."],
    hi: ["चाँदनी बगीचे के छह भागों में सभी 30 चरण पूरे करें।", "{total} में से {cleared} चरण पूरे · कोई टाइमर नहीं · सुरक्षित पुनः प्रयास", "हर नामित संकेतक तक बीज मिलाएँ। आगे क्रम, बहाव, छाया वाले रास्ते और छिपे कोण जुड़ते हैं।", "पूरे चरण, अगला खुला चरण और हर चरण का सबसे अच्छा रिलीज़ अंक इसी ब्राउज़र में सहेजा जाता है। पुराना रिकॉर्ड भी सुरक्षित है। पूरे चरण फिर खेले जा सकते हैं; बंद चरण शुरू नहीं होते।", "समायोजन से पहले रोशनी और नाम पढ़ें। चूक सुरक्षित है। संकेतक केवल उन्हीं चरणों में खिसकता है जहाँ नियम ऐसा कहता है। प्रिज़्म क्लैम्प एक बार बहते संकेतक को रोकता है, पर छाया वाला रास्ता नहीं खोलता।", "मूनलिट ऑर्चर्ड रूट में पाँच-पाँच चरणों के छह भाग हैं। जाँच बिंदु चरण 5, 10, 15, 20, 25 और 30 हैं। चरण 5 पर प्रिज़्म क्लैम्प मिलता है, जो बाद के हर चरण में एक बार काम आता है। क्रम वाले संकेत सही रिलीज़ के बाद आगे बढ़ते हैं; चूक पर वही संकेत फिर उपलब्ध रहता है। छाया दिखे तो खुला रास्ता चुनें। आखिरी रास्ते की पसंद अगला शुरुआती कोण भी बदल सकती है। चरण 30 चार रोशनियों वाला नाइटकीपर समापन है। कोई टाइमर, जीवन हानि, खरीद या जबरन प्रतीक्षा नहीं है। प्रगति इसी ब्राउज़र में रहती है और पूरे रास्ते फिर खेले जा सकते हैं।", "चरण की प्रगति स्थानीय रूप से सहेजी जाती है। चरण 5 पूरा करने पर क्लैम्प खुलता है; फिर चरण क्रम से खुलते हैं।"],
    ar: ["اعبر ستة فصول ليلية وأكمل مراحل البستان الثلاثين.", "اكتملت {cleared} من {total} مرحلة · بلا مؤقت · إعادة آمنة", "وجّه البذرة نحو كل منارة مسماة. تضيف المراحل اللاحقة الترتيب والانجراف ومسارات الظل والزوايا المخفية.", "تُحفظ المراحل المكتملة والمرحلة التالية وأفضل عدد للإطلاقات لكل مرحلة في هذا المتصفح. ويُحفظ الرقم القياسي القديم أيضاً. يمكن إعادة المراحل المكتملة، ولا يمكن بدء المراحل المغلقة.", "اقرأ الضوء واسمه قبل التعديل. الخطأ آمن. لا تنجرف المنارة إلا وفق قاعدة المرحلة. تثبّت ملزمة المنشور منارة منجرفة مرة واحدة، لكنها لا تفتح مسار الظل.", "تتكون طرق بستان ضوء القمر من ستة فصول، في كل منها خمس مراحل. نقاط التحقق هي 5 و10 و15 و20 و25 و30. تمنح المرحلة 5 ملزمة المنشور لاستخدام واحد في كل مرحلة لاحقة. تتقدم الأضواء المرتبة بعد الإطلاق الصحيح فقط؛ وبعد الخطأ تبقى المنارة الحالية متاحة للمحاولة. عند ظهور الظل اختر مساراً مفتوحاً. وقد يغير اختيار المسار الأخير زاوية البداية التالية. المرحلة 30 هي نهاية حارس الليل ذات الأضواء الأربعة. لا يوجد مؤقت أو فقد للأرواح أو مشتريات أو انتظار إجباري. يبقى تقدمك محلياً ويمكن إعادة كل مسار مكتمل.", "يُحفظ التقدم محلياً لكل مرحلة. أكمل المرحلة 5 لفتح الملزمة؛ ثم تُفتح المراحل بالترتيب."],
  };
  const CAMPAIGN_ARC_NAMES = {
    en: ["Dewlight Ring", "Moon Current", "Shadow-Grove Paths", "Firefly Signals", "Prism Weave", "Night Orchard"],
    "zh-Hant": ["露光環", "月流", "月影林徑", "螢火訊號", "稜鏡編織", "夜果園"],
    "zh-Hans": ["露光环", "月流", "月影林径", "萤火信号", "棱镜编织", "夜果园"],
    ja: ["露の環", "月の流れ", "影の林道", "蛍の合図", "プリズム織り", "夜の果樹園"],
    ko: ["이슬빛 고리", "달의 흐름", "그늘 숲길", "반딧불 신호", "프리즘 직조", "밤의 과수원"],
    es: ["Anillo de rocío", "Corriente lunar", "Senderos del bosque sombrío", "Señales de luciérnaga", "Trama de prisma", "Huerto nocturno"],
    "pt-BR": ["Anel de orvalho", "Corrente lunar", "Trilhas do bosque sombreado", "Sinais de vagalume", "Trama de prisma", "Pomar noturno"],
    fr: ["Anneau de rosée", "Courant lunaire", "Sentiers du bosquet ombragé", "Signaux des lucioles", "Tissage prismatique", "Verger nocturne"],
    de: ["Taulichter-Ring", "Mondströmung", "Schattenhain-Pfade", "Glühwürmchen-Signale", "Prismengeflecht", "Nachtobstgarten"],
    it: ["Anello di rugiada", "Corrente lunare", "Sentieri del bosco ombroso", "Segnali delle lucciole", "Trama prismatica", "Frutteto notturno"],
    ru: ["Кольцо росы", "Лунное течение", "Тропы Тенистой рощи", "Сигналы светлячков", "Призматическое плетение", "Ночной сад"],
    hi: ["ओस का घेरा", "चाँद की धारा", "छाया वन-पथ", "जुगनू संकेत", "प्रिज़्म बुनावट", "रात्रि बगीचा"],
    ar: ["حلقة الندى", "تيار القمر", "دروب بستان الظل", "إشارات اليراعات", "نسج المنشور", "بستان الليل"],
  };
  const CAMPAIGN_COPY = Object.fromEntries(Object.entries(CAMPAIGN_ROWS).map(([locale, row]) => [locale,
    [...CAMPAIGN_KEYS.slice(0, -1).map((key) => row[CAMPAIGN_KEYS.indexOf(key)]), "", ...CAMPAIGN_ARC_NAMES[locale]].join("|") ]));
  const CAMPAIGN_GUIDE_COPY_UNUSED = Object.fromEntries(Object.entries(CAMPAIGN_ROWS).map(([locale]) => [locale, {
    en: ["Follow a 30-stage moonlit route through six orchard arcs.", "{cleared} of {total} stages cleared · no timer · calm retries", "Tune a seed toward each named beacon. Later stages add ordered lights, drifting targets, shaded lanes, and veiled angles.", "Clears, the next unlocked stage, and your best release count for each stage stay in this browser. Older best-release data is preserved. Cleared stages remain open to replay; locked stages cannot enter Battle.", "Read the light and name before you adjust. A wrong release is safe. Drift changes the target only where the stage says so; the Prism Clamp can hold one drifting beacon, but never opens a shaded lane.", "The Moonlit Orchard Routes contain six five-stage arcs: Dewlight Ring, Moon Current, Shadow-Grove Paths, Firefly Signals, Prism Weave, and Night Orchard. Checkpoints appear at Stages 5, 10, 15, 20, 25, and 30. Stage 5 awards the Prism Clamp for one use on each later stage. Ordered lights advance only after a correct release; a miss keeps the current light available for another try. Choose an open lane when shade appears, and remember that the final lane choice can affect the next starting angle. Stage 30 is the four-light Nightkeeper finale. There is no timer, life loss, purchase, or forced wait. Your progress is local to this browser, and every cleared route can be replayed.", "Progress is stored locally by stage. Completing Stage 5 unlocks the Prism Clamp; later stages become available in order."],
    "zh-Hant": ["沿著月夜果園的六段旅程，完成 30 個關卡。", "已完成 {cleared} / {total} 關・無計時・可安心重試", "引導種子前往指定信標。後續關卡加入依序點亮、漂移目標、陰影通道與隱藏角度。", "通關紀錄、下一個解鎖關卡和每關最佳放出次數會保存在此瀏覽器；舊的最佳次數也會保留。已完成關卡仍可重玩，未解鎖關卡不能進入戰鬥。", "調整前先觀察光點與名稱。放錯仍可安心重試。只有指定關卡會在失誤後漂移；稜鏡夾可固定一次漂移信標，但不能打開陰影通道。", "月夜果園路線包含六段、每段五關：露光環、月流、月影林徑、螢火訊號、稜鏡編織與夜果園。第 5、10、15、20、25、30 關是檢查點。第 5 關會授予稜鏡夾，往後每關可用一次。依序信標必須正確放出後才會前進；失誤後仍可瞄準目前信標。遇到陰影時請選擇開放通道，最後的通道選擇也可能影響下一段起始角度。第 30 關是四信標的夜園守望者終章。沒有計時、失去生命、購買或強制等待。進度僅保存在此瀏覽器，每個已完成路線都可重玩。", "每關進度儲存在本機。完成第 5 關會解鎖稜鏡夾；後續關卡依序開放。"],
    "zh-Hans": ["沿着月夜果园的六段旅程，完成 30 个关卡。", "已完成 {cleared} / {total} 关・无计时・可安心重试", "引导种子前往指定信标。后续关卡加入依序点亮、漂移目标、阴影通道与隐藏角度。", "通关记录、下一个解锁关卡和每关最佳放出次数会保存在此浏览器；旧的最佳次数也会保留。已完成关卡仍可重玩，未解锁关卡不能进入战斗。", "调整前先观察光点与名称。放错仍可安心重试。只有指定关卡会在失误后漂移；棱镜夹可固定一次漂移信标，但不能打开阴影通道。", "月夜果园路线包含六段、每段五关：露光环、月流、月影林径、萤火信号、棱镜编织与夜果园。第 5、10、15、20、25、30 关是检查点。第 5 关会授予棱镜夹，往后每关可用一次。依序信标必须正确放出后才会前进；失误后仍可瞄准当前信标。遇到阴影时请选择开放通道，最后的通道选择也可能影响下一段起始角度。第 30 关是四信标的夜园守望者终章。没有计时、失去生命、购买或强制等待。进度仅保存在此浏览器，每个已完成路线都可重玩。", "每关进度保存在本地。完成第 5 关会解锁棱镜夹；后续关卡依序开放。"],
    ja: ["月明かりの果樹園を巡る6つの章、全30ステージに挑戦します。", "{total}ステージ中{cleared}クリア・時間制限なし・安全に再挑戦", "名前の付いた灯りへ種を合わせます。後半では順番、漂流、影の道、隠された角度が加わります。", "クリア記録、次の解放ステージ、各ステージの最少リリース数はこのブラウザーに保存され、以前の記録も保持されます。クリア済みは再挑戦でき、未解放は開始できません。", "調整前に光と名前を確認します。失敗しても安全です。漂流が起こるステージだけで目標が動きます。プリズムクランプは漂流灯を一度固定しますが、影の道は開けません。", "月夜の果樹園ルートは5ステージずつの6章です。チェックポイントは5、10、15、20、25、30。ステージ5でプリズムクランプを獲得し、以降は各ステージで一度使えます。順番のある灯りは正しいリリース後に進み、失敗しても同じ灯りを狙い直せます。影が現れたら開いている道を選びます。最後の道の選択が次の開始角度を変えることもあります。ステージ30は4つの灯りを結ぶ夜の守り手です。時間制限、ライフ消失、購入、強制待機はありません。進行状況はこのブラウザーだけに保存され、クリア済みは再挑戦できます。", "進行状況はステージごとに端末内へ保存されます。ステージ5でクランプが解放され、以降のステージが順番に開きます。"],
    ko: ["달빛 과수원의 여섯 구간을 따라 30개 스테이지를 진행하세요.", "{total}개 중 {cleared}개 완료 · 시간 제한 없음 · 안전한 재도전", "이름이 있는 신호에 씨앗을 맞추세요. 후반에는 순서, 표류, 그늘 경로, 숨겨진 각도가 추가됩니다.", "완료 기록과 다음 해금 스테이지, 스테이지별 최고 기록은 이 브라우저에 저장되며 이전 기록도 보존됩니다. 완료한 스테이지는 다시 할 수 있고 잠긴 곳은 시작할 수 없습니다.", "조정 전에 빛과 이름을 확인하세요. 실패해도 안전합니다. 표류 규칙이 있는 곳에서만 목표가 움직입니다. 프리즘 클램프는 표류 신호를 한 번 고정하지만 그늘 경로를 열지는 않습니다.", "달빛 과수원 경로는 다섯 스테이지씩 여섯 구간입니다. 체크포인트는 5, 10, 15, 20, 25, 30입니다. 5스테이지에서 클램프를 얻고 이후 각 스테이지에서 한 번 사용할 수 있습니다. 순서가 있는 신호는 정확히 발사한 뒤 넘어가며, 실패해도 현재 신호를 다시 조준할 수 있습니다. 그늘이 나타나면 열린 경로를 고르세요. 마지막 경로 선택은 다음 시작 각도를 바꿀 수 있습니다. 30스테이지는 네 빛을 잇는 밤의 수호자 결말입니다. 시간 제한, 생명 손실, 구매, 강제 대기는 없습니다. 진행 상황은 이 브라우저에만 저장되며 완료한 경로는 다시 플레이할 수 있습니다.", "진행 상황은 스테이지별로 저장됩니다. 5스테이지를 완료하면 클램프가 열리고 이후 스테이지가 순서대로 해금됩니다."],
    es: ["Recorre seis arcos nocturnos y completa 30 niveles del huerto.", "{cleared} de {total} niveles completados · sin temporizador · reintento seguro", "Alinea la semilla con cada baliza nombrada. Más adelante hay secuencias, deriva, rutas en sombra y ángulos ocultos.", "Los niveles superados, el siguiente desbloqueo y tu mejor número de lanzamientos por nivel se guardan en este navegador; el récord anterior se conserva. Los niveles superados se repiten y los bloqueados no se inician.", "Lee la luz y su nombre antes de ajustar. Un fallo es seguro. La baliza solo deriva cuando el nivel lo indica. La Pinza Prisma fija una baliza una vez, pero no abre carriles en sombra.", "Las Rutas del Huerto Lunar tienen seis arcos de cinco niveles. Los puntos de control son 5, 10, 15, 20, 25 y 30. El nivel 5 entrega la pinza para usarla una vez en cada nivel posterior. Las luces ordenadas avanzan tras acertar y un fallo mantiene la luz actual. Elige una vía abierta ante la sombra. La última elección puede cambiar el siguiente ángulo inicial. El nivel 30 es el final de cuatro luces del Vigía Nocturno. Sin temporizador, pérdida de vidas, compras ni espera obligatoria. El progreso es local y cada ruta superada se repite.", "El progreso se guarda localmente por nivel. Completa el nivel 5 para desbloquear la pinza; luego los niveles se abren en orden."],
    "pt-BR": ["Percorra seis arcos noturnos e conclua 30 fases do pomar.", "{cleared} de {total} fases concluídas · sem cronômetro · tentativas seguras", "Alinhe a semente a cada farol nomeado. Depois surgem sequências, deriva, rotas sombreadas e ângulos ocultos.", "Fases concluídas, próximo desbloqueio e melhor número de lançamentos por fase ficam neste navegador; o recorde antigo também é preservado. Fases concluídas podem ser repetidas; as bloqueadas não começam.", "Leia a luz e o nome antes de ajustar. Errar é seguro. O farol deriva só quando a fase indica. O Grampo Prisma fixa um farol uma vez, mas não abre rotas sombreadas.", "As Rotas do Pomar ao Luar têm seis arcos de cinco fases. Os pontos de controle são 5, 10, 15, 20, 25 e 30. A fase 5 entrega o grampo, com um uso em cada fase posterior. As luzes ordenadas avançam após um acerto; um erro mantém a luz atual. Escolha uma rota aberta diante da sombra. A última escolha pode mudar o próximo ângulo inicial. A fase 30 é o final de quatro luzes do Guardião Noturno. Sem cronômetro, perda de vidas, compras ou espera forçada. O progresso é local e cada rota concluída pode ser repetida.", "O progresso fica salvo localmente por fase. Conclua a fase 5 para liberar o grampo; as demais abrem em ordem."],
    fr: ["Parcourez six arcs nocturnes et terminez les 30 niveaux du verger.", "{cleared} niveau(x) sur {total} terminé(s) · sans minuteur · reprise sûre", "Alignez la graine sur chaque phare nommé. La suite ajoute séquences, dérive, voies ombragées et angles masqués.", "Les niveaux terminés, le prochain déblocage et votre meilleur nombre de lancers par niveau sont enregistrés ici ; l’ancien record est conservé. Les niveaux terminés restent rejouables, les autres sont verrouillés.", "Lisez lumière et nom avant d’ajuster. Un échec est sans danger. Le phare ne dérive que si le niveau le prévoit. La pince stabilise une fois, mais n’ouvre pas une voie ombragée.", "Les Routes du Verger au Clair de Lune ont six arcs de cinq niveaux. Les points de contrôle sont 5, 10, 15, 20, 25 et 30. Le niveau 5 offre la pince, utilisable une fois par niveau suivant. Les lumières ordonnées avancent après réussite ; un échec laisse la lumière actuelle. Choisissez une voie ouverte face à l’ombre. Le dernier choix peut modifier l’angle suivant. Le niveau 30 est le final à quatre lumières du Gardien de la Nuit. Aucun minuteur, vie perdue, achat ou attente forcée. La progression reste locale et les routes terminées sont rejouables.", "La progression est enregistrée localement par niveau. Terminez le niveau 5 pour débloquer la pince ; les suivants s’ouvrent dans l’ordre."],
    de: ["Durchquere sechs Nachtbögen und schließe alle 30 Obstgartenstufen ab.", "{cleared} von {total} Stufen abgeschlossen · kein Timer · sichere Wiederholung", "Richte den Samen auf benannte Leuchtfeuer aus. Später kommen Folgen, Drift, Schattenwege und verborgene Winkel hinzu.", "Abgeschlossene Stufen, nächste Freischaltung und Bestwert je Stufe werden hier gespeichert; der alte Rekord bleibt erhalten. Abgeschlossene Stufen sind wiederholbar, gesperrte nicht startbar.", "Lies Licht und Namen vor dem Nachstellen. Ein Fehlwurf ist sicher. Drift gilt nur, wenn die Stufe es vorgibt. Die Klemme hält einmal fest, öffnet aber keinen Schattenweg.", "Die Mondschein-Obstgartenrouten haben sechs Bögen mit je fünf Stufen. Kontrollpunkte sind 5, 10, 15, 20, 25 und 30. Stufe 5 verleiht die Klemme für je eine Nutzung in späteren Stufen. Geordnete Lichter rücken nach einem Treffer weiter; nach einem Fehlwurf bleibt das aktuelle Licht. Wähle bei Schatten einen offenen Weg. Die letzte Wegwahl kann den Startwinkel ändern. Stufe 30 ist das Vier-Lichter-Finale des Nachtwächters. Kein Timer, Lebensverlust, Kauf oder erzwungene Wartezeit. Der Fortschritt bleibt lokal und abgeschlossene Routen sind wiederholbar.", "Der Fortschritt wird lokal je Stufe gespeichert. Schließe Stufe 5 ab, um die Klemme freizuschalten; danach öffnen sich Stufen der Reihe nach."],
    it: ["Attraversa sei archi notturni e completa tutti i 30 livelli del frutteto.", "{cleared} livelli su {total} completati · nessun timer · tentativi sicuri", "Allinea il seme a ogni faro nominato. In seguito arrivano sequenze, deriva, percorsi in ombra e angoli nascosti.", "Livelli completati, prossimo sblocco e miglior numero di rilasci per livello restano qui; il vecchio record è conservato. I livelli completati si ripetono, quelli bloccati non partono.", "Leggi luce e nome prima di regolare. Un errore è sicuro. Il faro deriva solo se previsto. La morsa fissa un faro una volta ma non apre percorsi ombreggiati.", "Le Rotte del Frutteto al Chiaro di Luna hanno sei archi di cinque livelli. I checkpoint sono 5, 10, 15, 20, 25 e 30. Il livello 5 offre la morsa, utilizzabile una volta in ogni livello successivo. Le luci in sequenza avanzano dopo un rilascio corretto; un errore lascia disponibile quella attuale. Scegli un percorso aperto quando compare l’ombra. L’ultima scelta può cambiare l’angolo iniziale successivo. Il livello 30 è il finale a quattro luci del Custode Notturno. Nessun timer, perdita di vite, acquisto o attesa forzata. Progressi locali e rotte completate rigiocabili.", "I progressi vengono salvati localmente per livello. Completa il livello 5 per sbloccare la morsa; poi i livelli si aprono in ordine."],
    ru: ["Пройдите шесть ночных арок и все 30 этапов сада.", "Пройдено {cleared} из {total} этапов · без таймера · безопасный повтор", "Направляйте семя к названному маяку. Позже появятся последовательности, дрейф, теневые пути и скрытые углы.", "Пройденные этапы, следующий доступный и лучший счёт запусков хранятся здесь; старый рекорд сохранён. Пройденные этапы можно повторять, закрытые нельзя начать.", "Сначала прочитайте свет и название. Ошибка безопасна. Маяк смещается только по правилам этапа. Зажим один раз удержит дрейфующий маяк, но не откроет теневой путь.", "Маршруты Лунного сада состоят из шести арок по пять этапов. Контрольные точки: 5, 10, 15, 20, 25 и 30. На этапе 5 вы получите зажим — по одному применению на каждом следующем этапе. Последовательные огни сменяются после точного запуска; после ошибки текущий огонь остаётся доступен. При тени выберите открытый путь. Последний выбор может изменить начальный угол. Этап 30 — финал из четырёх огней с Ночным хранителем. Нет таймера, потери жизней, покупок и обязательного ожидания. Прогресс локален, пройденные пути можно повторять.", "Прогресс хранится локально для каждого этапа. Этап 5 открывает зажим, затем этапы открываются по порядку."],
    hi: ["चाँदनी बगीचे के छह भागों में सभी 30 चरण पूरे करें।", "{total} में से {cleared} चरण पूरे · टाइमर नहीं · सुरक्षित पुनः प्रयास", "नामित संकेतकों तक बीज मिलाएँ। आगे क्रम, बहाव, छाया वाले रास्ते और छिपे कोण जुड़ते हैं।", "पूरे चरण, अगला खुला चरण और हर चरण का सर्वश्रेष्ठ रिलीज़ अंक यहीं सहेजा जाता है; पुराना रिकॉर्ड भी सुरक्षित रहता है। पूरे चरण फिर खेले जा सकते हैं, बंद चरण शुरू नहीं होते।", "समायोजन से पहले रोशनी और नाम पढ़ें। चूक सुरक्षित है। संकेतक नियम के अनुसार ही खिसकता है। क्लैम्प एक बार बहते संकेतक को रोकता है, पर छाया वाला रास्ता नहीं खोलता।", "मूनलिट ऑर्चर्ड रूट में पाँच-पाँच चरणों के छह भाग हैं। जाँच बिंदु 5, 10, 15, 20, 25 और 30 हैं। चरण 5 पर क्लैम्प मिलता है, जो आगे हर चरण में एक बार काम आता है। क्रम वाले संकेत सही रिलीज़ के बाद आगे बढ़ते हैं; चूक पर वही संकेत फिर उपलब्ध रहता है। छाया पर खुला रास्ता चुनें। आखिरी रास्ता अगला शुरुआती कोण बदल सकता है। चरण 30 चार रोशनियों वाला नाइटकीपर समापन है। टाइमर, जीवन हानि, खरीद या जबरन प्रतीक्षा नहीं है। प्रगति स्थानीय रहती है और पूरे रास्ते फिर खेले जा सकते हैं।", "प्रगति हर चरण के लिए स्थानीय रूप से सहेजी जाती है। चरण 5 पूरा करने पर क्लैम्प खुलता है; बाकी क्रम से खुलते हैं।"],
    ar: ["اعبر ستة فصول ليلية وأكمل مراحل البستان الثلاثين.", "اكتملت {cleared} من {total} مرحلة · بلا مؤقت · إعادة آمنة", "وجّه البذرة نحو كل منارة مسماة. تضيف المراحل اللاحقة الترتيب والانجراف ومسارات الظل والزوايا المخفية.", "تُحفظ المراحل المكتملة والمرحلة التالية وأفضل عدد للإطلاقات لكل مرحلة هنا؛ ويبقى الرقم القياسي القديم محفوظاً. يمكن إعادة المكتمل ولا يمكن بدء المغلق.", "اقرأ الضوء واسمه قبل التعديل. الخطأ آمن. لا تنجرف المنارة إلا وفق قاعدة المرحلة. تثبّت الملزمة منارة مرة واحدة لكنها لا تفتح مسار الظل.", "تتكون طرق بستان ضوء القمر من ستة فصول، في كل منها خمس مراحل. نقاط التحقق هي 5 و10 و15 و20 و25 و30. تمنح المرحلة 5 الملزمة لاستخدام واحد في كل مرحلة لاحقة. تتقدم الأضواء المرتبة بعد الإطلاق الصحيح فقط؛ وبعد الخطأ تبقى المنارة الحالية للمحاولة. عند ظهور الظل اختر مساراً مفتوحاً. وقد يغير اختيار المسار الأخير زاوية البداية التالية. المرحلة 30 نهاية حارس الليل ذات الأضواء الأربعة. لا مؤقت أو فقد أرواح أو مشتريات أو انتظار إجباري. التقدم محلي ويمكن إعادة المسارات المكتملة.", "يُحفظ التقدم محلياً لكل مرحلة. أكمل المرحلة 5 لفتح الملزمة؛ ثم تُفتح المراحل بالترتيب."],
  }]));
  const CAMPAIGN_STAGE_LABELS = Object.fromEntries(Object.keys(CAMPAIGN_ROWS).map((locale) => [locale, [
    { en: "Stage {current} / {total}", "zh-Hant": "第 {current} / {total} 關", "zh-Hans": "第 {current} / {total} 关", ja: "ステージ {current} / {total}", ko: "스테이지 {current} / {total}", es: "Nivel {current} / {total}", "pt-BR": "Fase {current} / {total}", fr: "Niveau {current} / {total}", de: "Stufe {current} / {total}", it: "Livello {current} / {total}", ru: "Этап {current} / {total}", hi: "चरण {current} / {total}", ar: "المرحلة {current} / {total}" }[locale],
    { en: "The Moonlit Orchard Routes", "zh-Hant": "月夜果園路線", "zh-Hans": "月夜果园路线", ja: "月明かりの果樹園ルート", ko: "달빛 과수원 경로", es: "Rutas del Huerto Lunar", "pt-BR": "Rotas do Pomar ao Luar", fr: "Routes du Verger au Clair de Lune", de: "Mondschein-Obstgartenrouten", it: "Rotte del Frutteto al Chiaro di Luna", ru: "Маршруты Лунного сада", hi: "मूनलिट ऑर्चर्ड रूट", ar: "طرق بستان ضوء القمر" }[locale],
  ]]));
  const CAMPAIGN_CLAMP_DORMANT = Object.fromEntries(Object.entries(CAMPAIGN_ROWS).map(([locale, row]) => [locale, row[CAMPAIGN_KEYS.indexOf("clampDormant")]]));
  Object.entries(CAMPAIGN_COPY).forEach(([locale, serialized]) => {
    const values = serialized.split("|");
    const copy = {};
    CAMPAIGN_KEYS.slice(0, -1).forEach((key, index) => { copy[key] = values[index]; });
    copy.arcNames = values.slice(CAMPAIGN_KEYS.length);
    Object.assign(locales[locale], copy);
  });
  Object.entries(CAMPAIGN_GUIDE_COPY).forEach(([locale, values]) => {
    ["intro", "facts", "guideIntro", "guideResults", "guideTips", "guideFinish", "faqProgressAnswer"].forEach((key, index) => { locales[locale][key] = values[index]; });
  });
  Object.entries(CAMPAIGN_STAGE_LABELS).forEach(([locale, values]) => { locales[locale].orbit = values[0]; locales[locale].chooseOrbit = values[1]; });
  Object.entries(CAMPAIGN_CLAMP_DORMANT).forEach(([locale, value]) => { locales[locale].clampDormant = value; });
  const routeMap = { en: "en", "zh-tw": "zh-Hant", "zh-hant": "zh-Hant", "zh-cn": "zh-Hans", "zh-hans": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const state = {
    locale: "en", sound: !window.WeightPlayAudio.isMuted(), round: 0, targetIndex: 0,
    angle: 0, targetAngle: 0, releases: 0, stageReleases: 0, selectedBeacon: "",
    lane: "", routeStep: 0, missCount: 0, clampArmed: false, clampUsed: false,
    memoryTest: false, locked: false, targetOffset: 0,
    statusKey: "ready", statusVars: {}, statusClass: "",
  };
  let motionFrame = 0;
  let motionStart = 0;
  window.addEventListener("weightplay:audio-volume-change", () => {
    state.sound = !window.WeightPlayAudio.isMuted();
    if (document.readyState !== "loading") applyLocale();
  });
  const $ = (id) => document.getElementById(id);
  let pendingAdvanceTimer = 0;
  let pendingAdvance = false;
  const storage = { get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }, set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} } };
  const CAMPAIGN_STORAGE_KEY = "weightplay-orbit-orchard-campaign-v12";
  const wrapAngle = (value) => ((Number(value) % 360) + 360) % 360;
  function normalizeCampaign(raw) {
    const record = raw && typeof raw === "object" ? raw : {};
    const supplied = new Set((Array.isArray(record.cleared) ? record.cleared : [])
      .map(Number).filter((id) => Number.isInteger(id) && id >= 1 && id <= rounds.length));
    let prefix = 0;
    while (supplied.has(prefix + 1)) prefix += 1;
    const bestByStage = {};
    const sourceBest = record.bestByStage && typeof record.bestByStage === "object" ? record.bestByStage : {};
    Object.entries(sourceBest).forEach(([key, value]) => {
      const id = Number(key);
      const best = Number(value);
      if (Number.isInteger(id) && id >= 1 && id <= rounds.length && Number.isInteger(best) && best > 0) bestByStage[id] = best;
    });
    return {
      cleared: Array.from({ length: prefix }, (_, index) => index + 1),
      highestUnlocked: Math.min(rounds.length, prefix + 1),
      bestByStage,
      clampUnlocked: prefix >= 5,
    };
  }
  function readCampaign() {
    try { return normalizeCampaign(JSON.parse(storage.get(CAMPAIGN_STORAGE_KEY) || "{}")); }
    catch (_) { return normalizeCampaign({}); }
  }
  let campaign = readCampaign();
  function saveCampaign() { campaign = normalizeCampaign(campaign); storage.set(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaign)); }
  function targetOptions(stage, targetIndex = 0, currentAngle = null) {
    const target = stage?.targets?.[targetIndex];
    if (!target) return [];
    const options = [{ beacon: target.beacon, angle: wrapAngle(currentAngle ?? target.angle), isTarget: true }];
    const decoy = stage.decoys?.[targetIndex];
    if (decoy) {
      const fallbackOffset = 113 + ((stage.id * 17 + targetIndex * 29) % 79);
      options.push({ beacon: decoy, angle: wrapAngle(stage.decoyAngles?.[targetIndex] ?? target.angle + fallbackOffset), isTarget: false });
    }
    return options;
  }
  function blockedLane(stage, targetIndex = 0, routeStep = 0) {
    const gate = stage?.gate;
    if (!gate || (gate.openBothFinal && targetIndex === stage.targets.length - 1) ||
        (stage.openBothLanesOnFinal && targetIndex === stage.targets.length - 1)) return null;
    const blocked = gate.blockedByTarget?.[targetIndex] ?? null;
    if (!blocked) return null;
    const rotations = (gate.rotateOnSuccess || gate.rotateOnAny) ? Math.max(0, Number(routeStep) || 0) : 0;
    if (rotations % 2 === 0) return blocked;
    return blocked === "clockwise" ? "counterclockwise" : "clockwise";
  }
  function needsLaneChoice(stage) { return Boolean(stage?.gate || stage?.laneSetupDegrees); }
  function resolveStageAction({ stage, targetIndex = 0, angle = 0, currentAngle = null, lane = "", beaconChoice = "", routeStep = 0, missCount = 0, clampArmed = false, clampUsed = false }) {
    const target = stage?.targets?.[targetIndex];
    if (!target) return { success: false, miss: false, reason: "invalidTarget", clampConsumed: false };
    const requiredLane = blockedLane(stage, targetIndex, routeStep);
    if (needsLaneChoice(stage) && !lane) return { success: false, miss: false, reason: "laneRequired", clampConsumed: false, nextAngle: wrapAngle(currentAngle ?? target.angle) };
    if (lane && lane !== "clockwise" && lane !== "counterclockwise") return { success: false, miss: false, reason: "laneRequired", clampConsumed: false, nextAngle: wrapAngle(currentAngle ?? target.angle) };
    if (lane && lane === requiredLane) return { success: false, miss: false, reason: "wrongLane", clampConsumed: false, nextAngle: wrapAngle(currentAngle ?? target.angle) };
    const options = targetOptions(stage, targetIndex, currentAngle);
    if (options.length > 1 && !beaconChoice) return { success: false, miss: false, reason: "targetRequired", clampConsumed: false, nextAngle: wrapAngle(currentAngle ?? target.angle) };
    if (beaconChoice && !options.some((option) => option.beacon === beaconChoice && option.isTarget)) {
      return { success: false, miss: false, reason: "wrongTarget", clampConsumed: false, nextAngle: wrapAngle(currentAngle ?? target.angle) };
    }
    const targetAngle = wrapAngle(currentAngle ?? target.angle);
    const landing = wrapAngle(angle);
    const distance = Math.min(Math.abs(landing - targetAngle), 360 - Math.abs(landing - targetAngle));
    if (distance <= (stage.tolerance ?? 16)) {
      const nextStartAngle = stage.laneSetupDegrees && lane
        ? wrapAngle(targetAngle + (lane === "clockwise" ? stage.laneSetupDegrees : -stage.laneSetupDegrees))
        : 0;
      return {
        success: true, miss: false, reason: "aligned", distance, nextAngle: targetAngle,
        nextStartAngle, gateChanged: Boolean(stage.gate?.rotateOnSuccess || stage.gate?.rotateOnAny),
        nextRouteStep: Number(routeStep) + (stage.gate?.rotateOnSuccess || stage.gate?.rotateOnAny ? 1 : 0), clampConsumed: false,
      };
    }
    const steps = stage.drift?.steps || [];
    let driftStep = 0;
    if (steps.length) {
      const stepIndex = stage.drift.pattern === "byTarget" ? targetIndex : Math.max(0, Number(missCount) || 0) % steps.length;
      driftStep = Number(steps[stepIndex]) || 0;
      if (stage.drift.pattern === "clockwise") driftStep = Math.abs(driftStep);
      if (stage.drift.pattern === "counterclockwise") driftStep = -Math.abs(driftStep);
    }
    const clampConsumed = Boolean(clampArmed && !clampUsed && driftStep !== 0);
    const nextAngle = clampConsumed ? targetAngle : wrapAngle(targetAngle + driftStep);
    const gateChanged = Boolean(stage.gate?.rotateOnAny && driftStep !== 0);
    return {
      success: false, miss: true, reason: "miss", distance,
      driftDirection: driftStep >= 0 ? "clockwise" : "counterclockwise",
      nextAngle, driftStep, clampConsumed, gateChanged,
      nextRouteStep: Number(routeStep) + (gateChanged ? 1 : 0),
    };
  }
  const t = (key, vars = {}) => { const copy = locales[state.locale] || locales.en; return String(copy[key] || locales.en[key] || key).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? "")); };
  function queryLocale() {
    const route = routeMap[location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()];
    if (route) return route;
    const query = new URLSearchParams(location.search).get("lang") || "";
    const requested = routeMap[query.toLowerCase()] || query;
    const saved = storage.get("weightplay-orbit-locale");
    return locales.__localeKeys.includes(requested) ? requested : locales.__localeKeys.includes(saved) ? saved : "en";
  }

  function tone(kind) { return window.WeightPlayAudio?.play(kind === "good" ? "feedback.success" : "feedback.error"); }
  function applyLeaveCopy() {
    const dialog = $("orbitLeaveDialog");
    if (!dialog) return;
    const copy = LEAVE_COPY[state.locale] || LEAVE_COPY.en;
    $("orbitLeaveTitle").textContent = copy[0];
    $("orbitLeaveText").textContent = copy[1];
    $("orbitLeaveContinue").textContent = copy[2];
    $("orbitLeaveStages").textContent = copy[3];
  }
  function applyLocale() {
    const copy = locales[state.locale] || locales.en;
    document.documentElement.lang = state.locale;
    document.documentElement.dir = copy.direction || "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => {
      node.textContent = t(node.dataset.copy, { cleared: campaign.cleared.length, total: rounds.length });
    });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.copyAriaLabel)));
    $("settingsBtn").setAttribute("aria-label", t("settings"));
    $("settingsPanel").setAttribute("aria-label", t("settings"));
    $("soundBtn").textContent = t(state.sound ? "soundOn" : "soundOff");
    $("angleInput").setAttribute("aria-label", t("dial"));
    $("orbitDial").setAttribute("aria-label", t("dial"));
    $("targetChoice").setAttribute("aria-label", t("targetChoice"));
    $("laneChoice").setAttribute("aria-label", t("laneChoice"));
    applyLeaveCopy(); renderStage(); refreshBattleStatus();
    if (!$("battleScreen").hidden) renderBattle();
    if (!$("resultScreen").hidden) renderResult();
    if (!$("patternDialog").hidden) openPattern();
  }

  function populateLocales() { const select = $("localeSelect"); locales.__localeKeys.forEach((key) => { const option = document.createElement("option"); option.value = key; option.textContent = locales.en.languageNames[key] || key; select.append(option); }); select.value = state.locale; select.addEventListener("change", () => { state.locale = select.value; storage.set("weightplay-orbit-locale", state.locale); applyLocale(); }); }
  function installBattleSubstates() {
    const battle = $("battleScreen");
    const shell = battle?.querySelector(".logical-shell");
    const result = $("resultScreen");
    if (shell && result && result.parentElement !== shell) {
      result.classList.add("battle-result-substate");
      result.hidden = true;
      shell.append(result);
    }
    const pattern = $("patternDialog");
    if (shell && pattern && pattern.parentElement !== shell) shell.append(pattern);
    const mapButton = $("mapBtn");
    if (mapButton) {
      mapButton.hidden = true;
      mapButton.setAttribute("aria-hidden", "true");
      mapButton.tabIndex = -1;
    }
    if (!shell || $("orbitLeaveDialog")) return;
    const dialog = document.createElement("div");
    dialog.id = "orbitLeaveDialog";
    dialog.className = "orbit-leave-dialog";
    dialog.hidden = true;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "orbitLeaveTitle");
    dialog.setAttribute("aria-describedby", "orbitLeaveText");
    dialog.innerHTML = '<div class="orbit-leave-card"><h2 id="orbitLeaveTitle"></h2><p id="orbitLeaveText"></p><div class="orbit-leave-actions"><button id="orbitLeaveContinue" class="primary-btn" type="button"></button><button id="orbitLeaveStages" class="secondary-btn" type="button"></button></div></div>';
    shell.append(dialog);
    $("orbitLeaveContinue").addEventListener("click", () => closeLeave());
    $("orbitLeaveStages").addEventListener("click", confirmLeave);
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeLeave();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = [$("orbitLeaveContinue"), $("orbitLeaveStages")].filter(Boolean);
      if (controls.length < 2) return;
      const index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        controls[controls.length - 1].focus();
      } else if (!event.shiftKey && index === controls.length - 1) {
        event.preventDefault();
        controls[0].focus();
      }
    });
    applyLeaveCopy();
  }
  function show(screen) {
    const resultState = screen === "resultScreen";
    const scene = resultState ? "battleScreen" : screen;
    ["mainScreen", "stageScreen", "battleScreen"].forEach((id) => { $(id).hidden = id !== scene; });
    const result = $("resultScreen");
    if (result) result.hidden = !resultState;
    const battleContent = $("battleScreen")?.querySelector(".battle-content");
    if (battleContent) {
      battleContent.hidden = resultState;
      battleContent.inert = resultState;
    }
    $("mainScreen").parentElement.querySelector(".guide-card")?.toggleAttribute("hidden", scene !== "mainScreen");
    document.body.dataset.screen = resultState ? "battle" : scene.replace("Screen", "");
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    window.scrollTo(0, 0);
  }
  function arcName(stage) { return (locales[state.locale] || locales.en).arcNames?.[stage.arc - 1] || (locales.en.arcNames?.[stage.arc - 1] ?? `Arc ${stage.arc}`); }
  function stageTitle(stage) { return t("stageTitle", { id: stage.id, arc: arcName(stage) }); }
  function renderStage() {
    if (!$('stageScreen') || $('stageScreen').hidden) return;
    const list = $("orbitList");
    if (!list) return;
    const unlocked = campaign.highestUnlocked;
    const progress = $("campaignProgress");
    if (progress) progress.textContent = t("facts", { cleared: campaign.cleared.length, total: rounds.length });
    list.replaceChildren(...rounds.map((stage, index) => {
      const button = document.createElement("button");
      const isCleared = campaign.cleared.includes(stage.id);
      const isLocked = stage.id > unlocked;
      button.type = "button";
      button.className = `orbit-card campaign-stage-card${isCleared ? " is-cleared" : ""}${stage.checkpoint ? " is-checkpoint" : ""}`;
      button.disabled = isLocked;
      button.dataset.stageId = String(stage.id);
      button.setAttribute("aria-label", `${stageTitle(stage)} · ${t(isLocked ? "locked" : isCleared ? "cleared" : "stageReady")}`);
      const targetNames = stage.targets.map((target) => t(target.beacon)).join(" → ");
      const targetAngle = stage.veiled ? t("targetVeiled", { name: targetNames }) : stage.targets.map((target) => `${t(target.beacon)} ${target.angle}°`).join(" → ");
      const statusKey = isLocked ? "locked" : isCleared ? "cleared" : "stageReady";
      button.innerHTML = `<span class="campaign-stage-number">${t("orbit", { current: stage.id, total: rounds.length })}</span><strong>${arcName(stage)}${stage.checkpoint ? ` · ${t("checkpoint")}` : ""}</strong><span>${t(stage.objective)}</span><em>${targetAngle}</em><small>${t(statusKey)}${campaign.bestByStage[stage.id] ? ` · ${t("best")}: ${campaign.bestByStage[stage.id]}` : ""}</small>`;
      if (!isLocked) button.addEventListener("click", () => startRound(index));
      return button;
    }));
    window.dispatchEvent(new Event("weightplay:stage-sync"));
    list.querySelector(`[data-stage-id="${unlocked}"]`)?.scrollIntoView?.({ block: "center", inline: "nearest" });
  }
  function setBattleStatus(key, vars = {}, className = "") {
    state.statusKey = key; state.statusVars = vars; state.statusClass = className;
    refreshBattleStatus();
  }
  function refreshBattleStatus() {
    $("battleStatus").textContent = t(state.statusKey, state.statusVars);
    $("battleStatus").className = `battle-status ${state.statusClass}`.trim();
  }
  function resetBattleStatus() { setBattleStatus("ready"); }
  function canPlay() {
    return !document.hidden && !$("battleScreen").hidden && $("resultScreen").hidden &&
      $("orbitLeaveDialog")?.hidden !== false && $("patternDialog")?.hidden !== false;
  }
  function syncBattleControls() {
    const blocked = state.locked || !canPlay();
    ["releaseBtn", "clearBtn", "angleInput", "targetChoice", "laneChoice", "patternBtn"].forEach((id) => { $(id).disabled = blocked; });
    $("clampBtn").disabled = blocked || state.clampUsed;
  }
  let transitionKind = null;
  let transitionRemaining = 0;
  let transitionDeadline = 0;
  function pauseTransition() {
    if (pendingAdvanceTimer) {
      transitionRemaining = Math.max(0, transitionDeadline - performance.now());
      window.clearTimeout(pendingAdvanceTimer); pendingAdvanceTimer = 0;
    }
    syncBattleControls();
  }
  function resumeTransition() {
    if (pendingAdvanceTimer || !transitionKind || !canPlay()) return;
    transitionDeadline = performance.now() + transitionRemaining;
    pendingAdvanceTimer = window.setTimeout(() => {
      pendingAdvanceTimer = 0;
      if (!canPlay()) { transitionRemaining = 0; return; }
      const kind = transitionKind; transitionKind = null; pendingAdvance = false;
      if (kind === "success") completeSuccessfulRelease();
      else { state.locked = false; renderBattle(); startMotion(); }
    }, transitionRemaining);
  }
  function scheduleTransition(kind, duration) {
    if (pendingAdvanceTimer) window.clearTimeout(pendingAdvanceTimer);
    pendingAdvanceTimer = 0; transitionKind = kind; transitionRemaining = duration; pendingAdvance = true;
    resumeTransition();
  }

  function cancelPendingAdvance() {
    if (pendingAdvanceTimer) window.clearTimeout(pendingAdvanceTimer);
    pendingAdvanceTimer = 0; pendingAdvance = false; transitionKind = null; transitionRemaining = 0;
    state.locked = false; pendingAction = null;
    [$("seed"), $("orbitDial")].forEach((node) => node?.getAnimations?.().forEach((animation) => animation.cancel()));
  }

  function effectiveTarget() { return wrapAngle(state.targetAngle + state.targetOffset); }
  function stopMotion() { if (motionFrame) cancelAnimationFrame(motionFrame); motionFrame = 0; motionStart = 0; state.targetOffset = 0; }
  function startMotion() {
    stopMotion();
    const span = rounds[state.round].motion || 0;
    if (!span || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    const tick = (now) => {
      if (!motionStart) motionStart = now;
      state.targetOffset = Math.sin((now - motionStart) / 850) * span;
      const beacon = $("beacon");
      if (beacon && !$("battleScreen").hidden && $("resultScreen")?.hidden) {
        beacon.style.transform = `rotate(${effectiveTarget()}deg) translateX(var(--orbit-beacon-radius, 105px))`;
        motionFrame = requestAnimationFrame(tick);
      } else stopMotion();
    };
    motionFrame = requestAnimationFrame(tick);
  }
  function burst(kind) {
    const dial = $("orbitDial");
    if (!dial?.animate || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    const frames = kind === "good"
      ? [{ transform:"scale(1)" }, { transform:"scale(1.045)" }, { transform:"scale(1)" }]
      : [{ transform:"translateX(0)" }, { transform:"translateX(-7px)" }, { transform:"translateX(7px)" }, { transform:"translateX(0)" }];
    dial.animate(frames, { duration: kind === "good" ? 360 : 260, easing:"cubic-bezier(.2,.8,.2,1)" });
  }
  function start() { cancelPendingAdvance(); resetBattleStatus(); openMap(); }
  function startRound(roundIndex = state.round) {
    const nextIndex = Number(roundIndex);
    if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= rounds.length) return;
    const stage = rounds[nextIndex];
    if (stage.id > campaign.highestUnlocked && !campaign.cleared.includes(stage.id)) return;
    cancelPendingAdvance(); stopMotion(); closeLeave({ resume: false, focus: false });
    if ($("patternDialog")) $("patternDialog").hidden = true;
    state.round = nextIndex; state.targetIndex = 0; state.releases = 0; state.stageReleases = 0;
    state.angle = stage.startAngle ?? 0; state.targetAngle = stage.targets[0].angle;
    state.selectedBeacon = ""; state.lane = ""; state.routeStep = 0; state.missCount = 0;
    state.clampArmed = false; state.clampUsed = false; state.targetOffset = 0;
    state.memoryTest = Boolean(stage.memory && stage.id >= 20);
    resetBattleStatus(); show("battleScreen"); renderBattle(); startMotion();
    if (stage.memory) openPattern(); else $("angleInput")?.focus();
  }
  function renderChoices(stage) {
    const targetWrap = $("targetChoiceWrap");
    const targetSelect = $("targetChoice");
    const options = targetOptions(stage, state.targetIndex, state.targetAngle);
    targetWrap.hidden = options.length < 2;
    if (targetWrap.hidden) state.selectedBeacon = "";
    $("targetChoiceLabel").textContent = t("targetChoice");
    targetSelect.replaceChildren();
    const blank = document.createElement("option"); blank.value = ""; blank.textContent = t("targetChoice"); targetSelect.append(blank);
    options.forEach((option) => {
      const node = document.createElement("option"); node.value = option.beacon;
      node.textContent = `${t(option.beacon)}${option.isTarget ? "" : ` · ${t("targetWrong")}`}`;
      targetSelect.append(node);
    });
    targetSelect.value = state.selectedBeacon;
    const laneWrap = $("laneChoiceWrap");
    laneWrap.hidden = !needsLaneChoice(stage);
    $("laneChoiceLabel").textContent = t("laneChoice");
    const laneSelect = $("laneChoice"); laneSelect.replaceChildren();
    const blocked = blockedLane(stage, state.targetIndex, state.routeStep);
    if (state.lane === blocked) state.lane = "";
    const laneBlank = document.createElement("option"); laneBlank.value = ""; laneBlank.textContent = t("lanePrompt"); laneSelect.append(laneBlank);
    [["clockwise", t("clockwise")], ["counterclockwise", t("counterclockwise")]].forEach(([value, label]) => {
      const node = document.createElement("option"); node.value = value;
      node.textContent = value === blocked ? `${label} · ${t("laneWrong")}` : label;
      node.disabled = value === blocked; laneSelect.append(node);
    });
    laneSelect.value = state.lane;
    const routeHint = $("routeHint");
    routeHint.hidden = !needsLaneChoice(stage);
    routeHint.textContent = stage.openBothLanesOnFinal && state.targetIndex === stage.targets.length - 1
      ? t("laneFinal") : stage.laneSetupDegrees ? t("laneOpenBoth") : t("laneRequired");
    const patternBtn = $("patternBtn"); patternBtn.hidden = !stage.memory; patternBtn.textContent = t("patternAction");
    const clampBtn = $("clampBtn");
    clampBtn.hidden = !(campaign.clampUnlocked && stage.id >= 6);
    clampBtn.disabled = state.clampUsed || state.locked;
    clampBtn.classList.toggle("is-armed", state.clampArmed);
    clampBtn.title = t(state.clampUsed ? "clampUsed" : state.clampArmed ? "clampArmed" : "clampArm");
    $("clampStatus").textContent = clampBtn.title;
    const decoy = options.find((option) => !option.isTarget);
    const decoyBeacon = $("decoyBeacon");
    decoyBeacon.hidden = !decoy;
    if (decoy) {
      decoyBeacon.style.transform = `rotate(${decoy.angle}deg) translateX(var(--orbit-beacon-radius, 105px))`;
      decoyBeacon.setAttribute("aria-label", t(decoy.beacon));
    }
    $("orbitDial").classList.toggle("is-memory-test", state.memoryTest);
    syncBattleControls();
  }
  function renderBattle() {
    const stage = rounds[state.round];
    const target = effectiveTarget();
    const targetData = stage.targets[state.targetIndex];
    const name = t(targetData.beacon);
    $("roundLabel").textContent = `${t("orbit", { current: stage.id, total: rounds.length })} · ${arcName(stage)}`;
    $("targetLabel").textContent = stage.veiled || state.memoryTest
      ? `${t("targetVeiled", { name })} · ${t(stage.objective)}`
      : `${t("target", { angle: Math.round(target) })} · ${name} · ${t(stage.objective)}`;
    $("releaseCount").textContent = String(state.releases);
    $("angleInput").value = String(state.angle);
    $("angleReadout").textContent = `${state.angle}°`;
    $("beacon").style.transform = `rotate(${target}deg) translateX(var(--orbit-beacon-radius, 105px))`;
    $("seed").style.transform = `rotate(${state.angle}deg) translateX(var(--orbit-seed-radius, 78px))`;
    renderChoices(stage);
    syncBattleControls();
    if (!$("battleStatus").textContent) $("battleStatus").textContent = t("ready");
  }
  function shortestDelta(a, b) { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); }
  let pendingAction = null;
  function completeSuccessfulRelease() {
    pendingAdvanceTimer = 0;
    pendingAdvance = false;
    state.locked = false;
    const stage = rounds[state.round];
    if (state.targetIndex < stage.targets.length - 1) {
      state.targetIndex += 1;
      state.targetAngle = stage.targets[state.targetIndex].angle;
      state.angle = pendingAction?.nextStartAngle || 0;
      state.selectedBeacon = ""; state.lane = ""; state.missCount = 0;
      pendingAction = null;
      resetBattleStatus();
      renderBattle();
      startMotion();
      $("angleInput").focus();
    } else finishStage();
  }
  function scheduleSuccessfulRelease() { scheduleTransition("success", 360); }

  function release() {
    if (state.locked || !canPlay()) return;
    const stage = rounds[state.round];
    const action = resolveStageAction({
      stage, targetIndex: state.targetIndex, angle: state.angle, currentAngle: effectiveTarget(),
      lane: state.lane, beaconChoice: state.selectedBeacon, routeStep: state.routeStep,
      missCount: state.missCount, clampArmed: state.clampArmed, clampUsed: state.clampUsed,
    });
    if (!action.success && !action.miss) {
      const feedback = action.reason === "wrongLane" ? "laneWrong" : action.reason === "targetRequired" || action.reason === "wrongTarget" ? "targetWrong" : "laneRequired";
      setBattleStatus(feedback, {}, "is-miss");
      return;
    }
    state.locked = true;
    const target = effectiveTarget();
    stopMotion();
    state.releases += 1;
    state.stageReleases += 1;
    $("releaseCount").textContent = String(state.releases);
    $("releaseBtn").disabled = true; $("clearBtn").disabled = true; $("angleInput").disabled = true;
    $("targetChoice").disabled = true; $("laneChoice").disabled = true; $("clampBtn").disabled = true; $("patternBtn").disabled = true;
    const landing = wrapAngle(state.angle);
    const delta = shortestDelta(landing, target);
    if (!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) $("seed")?.animate?.(
      [{ transform:`rotate(${state.angle}deg) translateX(var(--orbit-seed-radius, 78px)) scale(1)` }, { transform:`rotate(${landing}deg) translateX(var(--orbit-beacon-radius, 105px)) scale(.82)` }],
      { duration:320, easing:"cubic-bezier(.2,.75,.25,1)" }
    );
    if (action.success) {
      setBattleStatus("close", {}, "is-good");
      state.routeStep = action.nextRouteStep ?? state.routeStep;
      pendingAction = action;
      burst("good"); tone("good"); scheduleSuccessfulRelease(); return;
    }
    state.missCount += 1;
    state.targetAngle = action.nextAngle;
    state.routeStep = action.nextRouteStep ?? state.routeStep;
    if (action.clampConsumed) { state.clampUsed = true; state.clampArmed = false; }
    if (action.clampConsumed) setBattleStatus("clampUsed", {}, "is-miss");
    else if (action.driftStep) setBattleStatus(action.driftStep > 0 ? "driftClockwise" : "driftCounterclockwise", { angle: Math.round(state.targetAngle) }, "is-miss");
    else setBattleStatus("miss", { delta: Math.round(delta) }, "is-miss");
    burst("miss"); tone("miss");
    scheduleTransition("miss", 340);
  }

  function finishStage() {
    cancelPendingAdvance();
    const stage = rounds[state.round];
    const previousBest = campaign.bestByStage[stage.id];
    if (!previousBest || state.stageReleases < previousBest) campaign.bestByStage[stage.id] = state.stageReleases;
    campaign.cleared = [...campaign.cleared, stage.id];
    saveCampaign();
    show("resultScreen"); renderResult();
  }
  function renderResult() {
    const stage = rounds[state.round];
    const resultKey = stage.id === rounds.length ? "campaignFinish" : "stageFinish";
    $("resultText").textContent = `${t(resultKey, { id: stage.id, releases: state.stageReleases })}${stage.id === 5 ? ` ${t("clampReward")}` : ""}`;
    $("bestValue").textContent = String(campaign.bestByStage[stage.id] || state.stageReleases);
    $("resultNextBtn").disabled = stage.id >= rounds.length || campaign.highestUnlocked < stage.id + 1;
  }

  function closeLeave({ resume = true, focus = true } = {}) {
    const dialog = $("orbitLeaveDialog"); if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    $("battleScreen").querySelector(".battle-content").inert = !$("resultScreen").hidden || !$("patternDialog").hidden;
    syncBattleControls();
    if (resume) resumeTransition();
    if (focus) $("battleBackBtn")?.focus();
  }

  function openLeave() {
    if ($("battleScreen").hidden || !$("resultScreen").hidden || !$("patternDialog").hidden) return;
    const dialog = $("orbitLeaveDialog"); if (!dialog) return;
    applyLeaveCopy(); dialog.hidden = false;
    $("battleScreen").querySelector(".battle-content").inert = true;
    pauseTransition(); $("orbitLeaveContinue")?.focus();
  }

  function confirmLeave() {
    cancelPendingAdvance();
    closeLeave({ resume: false, focus: false });
    if ($("patternDialog")) $("patternDialog").hidden = true;
    openMap();
  }
  function goHome() { cancelPendingAdvance(); stopMotion(); closeLeave({ resume: false, focus: false }); if ($("patternDialog")) $("patternDialog").hidden = true; show("mainScreen"); applyLocale(); }
  function openMap() { cancelPendingAdvance(); stopMotion(); closeLeave({ resume: false, focus: false }); if ($("patternDialog")) $("patternDialog").hidden = true; show("stageScreen"); renderStage(); }
  function toggleSettings() { const panel = $("settingsPanel"); const open = panel.hidden; panel.hidden = !open; $("settingsBtn").setAttribute("aria-expanded", String(open)); }
  function openPattern() {
    const stage = rounds[state.round];
    if (!stage.memory || state.locked) return;
    const dialog = $("patternDialog");
    const sequence = $("patternSequence");
    $("patternTitle").textContent = `${t("patternTitle")} · ${t("orbit", { current: stage.id, total: rounds.length })}`;
    $("patternIntro").textContent = t("patternIntro");
    sequence.replaceChildren(...stage.targets.map((target, index) => {
      const row = document.createElement("li");
      row.innerHTML = `<span>${index + 1}. ${t(target.beacon)}${stage.veiled ? "" : ` · ${target.angle}°`}</span><span class="pattern-orbit-marker" role="img" aria-label="${t(target.beacon)} · ${target.angle}°" style="--pattern-angle:${target.angle}deg"></span>`;
      return row;
    }));
    $("patternContinue").textContent = t("patternReady");
    dialog.hidden = false;
    $("battleScreen").querySelector(".battle-content").inert = true;
    pauseTransition(); $("patternContinue").focus();
  }
  function closePattern() {
    const dialog = $("patternDialog"); if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    $("battleScreen").querySelector(".battle-content").inert = !$("resultScreen").hidden || !$("orbitLeaveDialog").hidden;
    syncBattleControls(); resumeTransition(); $("angleInput")?.focus();
  }

  state.locale = queryLocale();
  document.addEventListener("DOMContentLoaded", () => {
    installBattleSubstates();
    populateLocales();
    applyLocale();
    window.setTimeout(() => { $("loadingPanel").hidden = true; $("app").hidden = false; }, 260);
    $("startBtn").addEventListener("click", start);
    $("resultMapBtn").addEventListener("click", openMap);
    $("resultNextBtn").addEventListener("click", () => { if (!$("resultNextBtn").disabled && state.round < rounds.length - 1) startRound(state.round + 1); });
    $("resultReplayBtn").addEventListener("click", () => startRound(state.round));
    $("homeBtn")?.addEventListener("click", goHome);
    $("stageBackBtn").addEventListener("click", goHome);
    $("battleBackBtn").addEventListener("click", openLeave);
    $("releaseBtn").addEventListener("click", release);
    $("clearBtn").addEventListener("click", () => { if (state.locked) return; state.angle = 0; resetBattleStatus(); renderBattle(); });
    $("angleInput").addEventListener("input", (event) => { if (state.locked) return; state.angle = Number(event.target.value); renderBattle(); });
    $("targetChoice").addEventListener("change", (event) => { if (!state.locked && canPlay()) state.selectedBeacon = event.target.value; });
    $("laneChoice").addEventListener("change", (event) => { if (state.locked || !canPlay()) return; state.lane = event.target.value; renderChoices(rounds[state.round]); });
    $("clampBtn").addEventListener("click", () => {
      if (state.locked || !canPlay() || state.clampUsed || !campaign.clampUnlocked || rounds[state.round].id < 6) return;
      state.clampArmed = !state.clampArmed; renderChoices(rounds[state.round]);
      setBattleStatus(state.clampArmed ? "clampArmed" : "ready");
    });
    $("patternBtn").addEventListener("click", openPattern);
    $("patternContinue").addEventListener("click", closePattern);
    $("patternDialog").addEventListener("keydown", (event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closePattern(); }
      if (event.key === "Tab") { event.preventDefault(); $("patternContinue").focus(); }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseTransition(); else { syncBattleControls(); resumeTransition(); }
    });
    $("settingsBtn").addEventListener("click", toggleSettings);
    $("closeSettingsBtn").addEventListener("click", () => { $("settingsPanel").hidden = true; $("settingsBtn").setAttribute("aria-expanded", "false"); });
    $("soundBtn").addEventListener("click", () => { state.sound = window.WeightPlayAudio.setEnabled(!state.sound); applyLocale(); });
  });
  window.ORBIT_ORCHARD_TEST = {
    rounds, start, startRound, release, renderBattle, normalizeCampaign,
    targetOptions, resolveStageAction, blockedLane, needsLaneChoice,
    locales, campaignKeys: CAMPAIGN_KEYS,
  };
})();
