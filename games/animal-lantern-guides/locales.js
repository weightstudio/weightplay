window.ANIMAL_LANTERN_GUIDES_LOCALES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
window.ANIMAL_LANTERN_GUIDES_LABELS = {
  en: "English", "zh-Hant": "繁體中文", "zh-Hans": "简体中文", ja: "日本語", ko: "한국어",
  es: "Español", "pt-BR": "Português (Brasil)", fr: "Français", de: "Deutsch", it: "Italiano",
  ru: "Русский", hi: "हिन्दी", ar: "العربية"
};

const en = {
  back: "Back", eyebrow: "WeightPlay original", title: "Animal Lantern Guides", language: "Language",
  guideBadge: "A calm co-op puzzle", mainHeading: "One friend reads the lantern. One friend places the trail.",
  mainBody: "Share one screen for a short night-forest rescue. Scout reveals a safe symbol, then Guide chooses the matching marker.",
  start: "Start the rescue", soloNote: "One player can hand the device between roles. No account or network is needed.",
  scout: "Scout", guide: "Guide", together: "Together", scoutPromise: "Reveal the safe lantern symbol.",
  guidePromise: "Place the matching trail marker.", togetherPromise: "Protect three lanterns before the meter fades.",
  howTo: "How to play", howToBody: "Scout taps one lantern symbol and tells Guide what appeared. Guide taps the matching marker. A wrong choice dims the shared rescue meter; a correct handoff opens the next scene.",
  sceneBadge: "Night rescue", round: "Scene {n} / {total}", meter: "Rescue light {n} / 3",
  scoutRole: "Scout's side", scoutHeading: "Reveal a lantern", scoutTask: "Choose one symbol, then tell Guide what you saw.",
  guideRole: "Guide's side", guideHeading: "Place the marker", guideTask: "Wait for the clue, then choose the matching trail marker.",
  scoutChoicesLabel: "Scout lantern choices", guideChoicesLabel: "Guide trail-marker choices",
  chooseSymbol: "Choose a lantern", clueReady: "Clue ready: {name}", waiting: "Waiting for Scout's clue", phaseScout: "Scout's turn — reveal a lantern, then tell Guide.", phaseGuide: "Guide's turn — choose the {name} marker.",
  tellGuide: "Tell Guide: {name}", scoutSuccess: "The lantern glows. Pass the clue to Guide.",
  scoutWrong: "That lantern stayed dark. Scout can try again.", guideSuccess: "The trail opens! Ready for the next lantern.",
  guideWrong: "The marker missed. The clue is gone; start this scene again.", leave: "Leave rescue",
  footer: "Free to play · no account or network needed",
  scene1Title: "The mossy bridge", scene1Hint: "Find the quiet light beside the stream.",
  scene2Title: "The fern hollow", scene2Hint: "A soft trail is hidden under the leaves.",
  scene3Title: "The owl lookout", scene3Hint: "Open the last lantern above the trail.",
  resultBadge: "Rescue report", completeTitle: "The lantern path is safe!",
  completeBody: "You and your partner opened all three night scenes with {n} clear handoffs.",
  failTitle: "The forest needs another try.", failBody: "The shared light faded before all three scenes were open. Read the clue together and try again.",
  score: "Clear handoffs: {n}", best: "Best rescue: {n}", replay: "Guide again", home: "Back to menu",
  bestMenu: "Best rescue: {n} clear handoffs",
  symbols: { moon: "Moon", leaf: "Leaf", star: "Star" }
};

const translations = {
  "zh-Hant": {
    back: "返回", eyebrow: "WeightPlay 原創", title: "動物提燈引路隊", language: "語言", guideBadge: "安靜的合作益智",
    mainHeading: "一個朋友讀提燈，一個朋友放下路標。", mainBody: "共用一個畫面，完成短短的夜林救援。偵察員找出安全符號，引路員選出相同的路標。",
    start: "開始救援", soloNote: "一個人也能在兩個角色之間交接裝置。不需要帳號或網路。", scout: "偵察員", guide: "引路員", together: "一起完成",
    scoutPromise: "找出安全的提燈符號。", guidePromise: "放下相同的森林路標。", togetherPromise: "在光線消失前守住三盞提燈。",
    howTo: "玩法", howToBody: "偵察員點一個提燈符號，再告訴引路員看到了什麼。引路員點相同的路標。選錯會消耗共同救援光，交接正確就能打開下一幕。",
    sceneBadge: "夜林救援", round: "場景 {n} / {total}", meter: "救援光 {n} / 3", scoutRole: "偵察員這一側", scoutHeading: "找出提燈",
    scoutTask: "選一個符號，再告訴引路員你看到了什麼。", guideRole: "引路員這一側", guideHeading: "放下路標", guideTask: "等提示出現，再選相同的森林路標。",
    scoutChoicesLabel: "偵察員提燈選擇", guideChoicesLabel: "引路員森林路標選擇", chooseSymbol: "選一個提燈", clueReady: "提示準備好了：{name}", waiting: "等待偵察員的提示", phaseScout: "偵察員回合：找出提燈，再告訴引路員。", phaseGuide: "引路員回合：選出相同的 {name} 路標。",
    tellGuide: "告訴引路員：{name}", scoutSuccess: "提燈亮了。把提示告訴引路員。", scoutWrong: "這盞提燈沒有亮。偵察員可以再試一次。",
    guideSuccess: "路徑打開了！準備下一盞提燈。", guideWrong: "路標沒有對上。提示消失了，重新找這一幕。", leave: "離開救援",
    footer: "免費遊玩 · 不需帳號或網路", scene1Title: "長滿青苔的橋", scene1Hint: "找出溪流旁安靜的光。",
    scene2Title: "蕨葉小窪地", scene2Hint: "柔軟的路徑藏在葉子下。", scene3Title: "貓頭鷹瞭望台", scene3Hint: "打開路徑上方最後一盞提燈。",
    resultBadge: "救援報告", completeTitle: "提燈路徑安全了！", completeBody: "你和夥伴用 {n} 次清楚交接，打開了三個夜林場景。",
    failTitle: "森林需要再試一次。", failBody: "共同的光在三幕全開前消失了。一起讀提示，再試一次。", score: "清楚交接：{n}", best: "最佳救援：{n}", replay: "再引路一次", home: "返回選單", bestMenu: "最佳救援：{n} 次清楚交接",
    symbols: { moon: "月亮", leaf: "葉子", star: "星星" }
  },
  "zh-Hans": {
    back: "返回", eyebrow: "WeightPlay 原创", title: "动物提灯引路队", language: "语言", guideBadge: "安静的合作益智",
    mainHeading: "一个朋友读提灯，一个朋友放下路标。", mainBody: "共用一个画面，完成短短的夜林救援。侦察员找出安全符号，引路员选出相同的路标。",
    start: "开始救援", soloNote: "一个人也能在两个角色之间交接设备。不需要账号或网络。", scout: "侦察员", guide: "引路员", together: "一起完成",
    scoutPromise: "找出安全的提灯符号。", guidePromise: "放下相同的森林路标。", togetherPromise: "在光线消失前守住三盏提灯。",
    howTo: "玩法", howToBody: "侦察员点击一个提灯符号，再告诉引路员看到了什么。引路员点击相同的路标。选错会消耗共同救援光，交接正确就能打开下一幕。",
    sceneBadge: "夜林救援", round: "场景 {n} / {total}", meter: "救援光 {n} / 3", scoutRole: "侦察员这一侧", scoutHeading: "找出提灯",
    scoutTask: "选一个符号，再告诉引路员你看到了什么。", guideRole: "引路员这一侧", guideHeading: "放下路标", guideTask: "等提示出现，再选相同的森林路标。",
    scoutChoicesLabel: "侦察员提灯选择", guideChoicesLabel: "引路员森林路标选择", chooseSymbol: "选一个提灯", clueReady: "提示准备好了：{name}", waiting: "等待侦察员的提示", phaseScout: "侦察员回合：找出提灯，再告诉引路员。", phaseGuide: "引路员回合：选出相同的 {name} 路标。",
    tellGuide: "告诉引路员：{name}", scoutSuccess: "提灯亮了。把提示告诉引路员。", scoutWrong: "这盏提灯没有亮。侦察员可以再试一次。",
    guideSuccess: "路径打开了！准备下一盏提灯。", guideWrong: "路标没有对上。提示消失了，重新找这一幕。", leave: "离开救援",
    footer: "免费游玩 · 不需账号或网络", scene1Title: "长满青苔的桥", scene1Hint: "找出溪流旁安静的光。",
    scene2Title: "蕨叶小洼地", scene2Hint: "柔软的路径藏在叶子下。", scene3Title: "猫头鹰瞭望台", scene3Hint: "打开路径上方最后一盏提灯。",
    resultBadge: "救援报告", completeTitle: "提灯路径安全了！", completeBody: "你和伙伴用 {n} 次清楚交接，打开了三个夜林场景。",
    failTitle: "森林需要再试一次。", failBody: "共同的光在三幕全开前消失了。一起读提示，再试一次。", score: "清楚交接：{n}", best: "最佳救援：{n}", replay: "再引路一次", home: "返回菜单", bestMenu: "最佳救援：{n} 次清楚交接",
    symbols: { moon: "月亮", leaf: "叶子", star: "星星" }
  },
  ja: {
    back: "戻る", eyebrow: "WeightPlay オリジナル", title: "どうぶつランタンガイド", language: "言語", guideBadge: "静かな協力パズル",
    mainHeading: "ひとりはランタンを読み、ひとりは道しるべを置く。", mainBody: "ひとつの画面で短い夜の森の救出へ。スカウトが安全な印を見つけ、ガイドが同じ道しるべを選びます。",
    start: "救出を始める", soloNote: "ひとりでも役割ごとに端末を渡して遊べます。アカウントも通信も不要です。", scout: "スカウト", guide: "ガイド", together: "ふたりで",
    scoutPromise: "安全なランタンの印を見つける。", guidePromise: "同じ森の道しるべを置く。", togetherPromise: "光が消える前に3つのランタンを守る。",
    howTo: "遊び方", howToBody: "スカウトがランタンの印をひとつ押して、見えたものをガイドに伝えます。ガイドは同じ道しるべを押します。間違えると共有の救出ライトが減り、正しい引き継ぎで次の場面へ進みます。",
    sceneBadge: "夜の森の救出", round: "場面 {n} / {total}", meter: "救出ライト {n} / 3", scoutRole: "スカウト側", scoutHeading: "ランタンを見つける",
    scoutTask: "印をひとつ選び、見えたものをガイドに伝えてね。", guideRole: "ガイド側", guideHeading: "道しるべを置く", guideTask: "手がかりを待って、同じ道しるべを選んでね。",
    scoutChoicesLabel: "スカウトのランタン選択", guideChoicesLabel: "ガイドの道しるべ選択", chooseSymbol: "ランタンを選ぶ", clueReady: "手がかり：{name}", waiting: "スカウトの手がかりを待っています", phaseScout: "スカウトの番：ランタンを選び、ガイドに伝えます。", phaseGuide: "ガイドの番：{name}の道しるべを選びます。",
    tellGuide: "ガイドに伝える：{name}", scoutSuccess: "ランタンが光った。手がかりをガイドへ。", scoutWrong: "そのランタンは暗いまま。もう一度選べます。",
    guideSuccess: "道が開いた！次のランタンへ。", guideWrong: "道しるべが違います。手がかりが消えたので、この場面をやり直します。", leave: "救出をやめる",
    footer: "無料で遊べます · アカウントも通信も不要", scene1Title: "苔むした橋", scene1Hint: "小川のそばの静かな光を探そう。",
    scene2Title: "シダのくぼ地", scene2Hint: "葉の下にやわらかな道が隠れています。", scene3Title: "フクロウの見張り台", scene3Hint: "道の上にある最後のランタンを開こう。",
    resultBadge: "救出レポート", completeTitle: "ランタンの道は安全！", completeBody: "3つの夜の場面を、{n}回の明確な引き継ぎで開きました。",
    failTitle: "森にはもう一度挑戦が必要です。", failBody: "3つの場面を開く前に共有の光が消えました。手がかりを一緒に読んで、再挑戦しましょう。", score: "明確な引き継ぎ：{n}", best: "ベスト救出：{n}", replay: "もう一度案内", home: "メニューへ戻る", bestMenu: "ベスト救出：明確な引き継ぎ {n}回",
    symbols: { moon: "月", leaf: "葉", star: "星" }
  },
  ko: {
    back: "뒤로", eyebrow: "WeightPlay 오리지널", title: "동물 랜턴 길잡이", language: "언어", guideBadge: "차분한 협동 퍼즐",
    mainHeading: "한 친구는 랜턴을 읽고, 한 친구는 길표를 놓아요.", mainBody: "한 화면을 함께 보며 짧은 밤숲 구조를 시작하세요. 정찰자가 안전한 기호를 찾고 안내자가 같은 표식을 고릅니다.",
    start: "구조 시작", soloNote: "한 사람이 역할 사이에서 기기를 건네며 플레이할 수 있어요. 계정이나 네트워크가 필요하지 않습니다.", scout: "정찰자", guide: "안내자", together: "함께",
    scoutPromise: "안전한 랜턴 기호를 찾아요.", guidePromise: "같은 숲 길표를 놓아요.", togetherPromise: "빛이 사라지기 전에 랜턴 세 개를 지켜요.",
    howTo: "플레이 방법", howToBody: "정찰자가 랜턴 기호 하나를 누르고 본 것을 안내자에게 말합니다. 안내자는 같은 길표를 누릅니다. 틀리면 공동 구조 불빛이 줄고, 올바른 인계로 다음 장면이 열립니다.",
    sceneBadge: "밤숲 구조", round: "장면 {n} / {total}", meter: "구조 불빛 {n} / 3", scoutRole: "정찰자 쪽", scoutHeading: "랜턴 찾기",
    scoutTask: "기호 하나를 고르고 본 것을 안내자에게 말하세요.", guideRole: "안내자 쪽", guideHeading: "길표 놓기", guideTask: "단서를 기다린 뒤 같은 숲 길표를 고르세요.",
    scoutChoicesLabel: "정찰자 랜턴 선택", guideChoicesLabel: "안내자 길표 선택", chooseSymbol: "랜턴을 고르세요", clueReady: "단서 준비됨: {name}", waiting: "정찰자의 단서를 기다리는 중", phaseScout: "정찰자 차례: 랜턴을 고르고 안내자에게 알려 주세요.", phaseGuide: "안내자 차례: {name} 길표를 골라 주세요.",
    tellGuide: "안내자에게 말하기: {name}", scoutSuccess: "랜턴이 빛났어요. 단서를 안내자에게 전하세요.", scoutWrong: "그 랜턴은 어두워요. 정찰자가 다시 고를 수 있어요.",
    guideSuccess: "길이 열렸어요! 다음 랜턴을 준비하세요.", guideWrong: "길표가 맞지 않아요. 단서가 사라졌으니 이 장면을 다시 시작하세요.", leave: "구조 나가기",
    footer: "무료 플레이 · 계정이나 네트워크 불필요", scene1Title: "이끼 낀 다리", scene1Hint: "시냇가 옆 조용한 빛을 찾으세요.",
    scene2Title: "고사리 숲의 웅덩이", scene2Hint: "잎 아래에 부드러운 길이 숨어 있어요.", scene3Title: "부엉이 전망대", scene3Hint: "길 위 마지막 랜턴을 열어요.",
    resultBadge: "구조 보고서", completeTitle: "랜턴 길이 안전해졌어요!", completeBody: "세 밤 장면을 {n}번의 분명한 인계로 모두 열었습니다.",
    failTitle: "숲에 한 번 더 도전이 필요해요.", failBody: "세 장면을 열기 전에 공동 불빛이 사라졌어요. 단서를 함께 읽고 다시 해 보세요.", score: "분명한 인계: {n}", best: "최고 구조: {n}", replay: "다시 안내하기", home: "메뉴로 돌아가기", bestMenu: "최고 구조: 분명한 인계 {n}회",
    symbols: { moon: "달", leaf: "잎", star: "별" }
  },
  es: {
    back: "Volver", eyebrow: "Original de WeightPlay", title: "Guías de linternas animales", language: "Idioma", guideBadge: "Un puzle cooperativo tranquilo",
    mainHeading: "Una persona lee la linterna. La otra coloca el sendero.", mainBody: "Compartid una pantalla para un rescate breve en el bosque nocturno. Explorador revela un símbolo seguro y Guía elige la señal correspondiente.",
    start: "Empezar el rescate", soloNote: "Una persona puede pasar el dispositivo entre roles. No hace falta cuenta ni conexión.", scout: "Explorador", guide: "Guía", together: "Juntos",
    scoutPromise: "Revela el símbolo seguro de la linterna.", guidePromise: "Coloca la señal de sendero correspondiente.", togetherPromise: "Proteged tres linternas antes de que se apague el medidor.",
    howTo: "Cómo jugar", howToBody: "Explorador toca un símbolo de linterna y cuenta qué apareció. Guía toca la señal correspondiente. Un error atenúa la luz compartida; un relevo correcto abre la siguiente escena.",
    sceneBadge: "Rescate nocturno", round: "Escena {n} / {total}", meter: "Luz de rescate {n} / 3", scoutRole: "Lado del explorador", scoutHeading: "Revela una linterna",
    scoutTask: "Elige un símbolo y cuenta a Guía qué has visto.", guideRole: "Lado de Guía", guideHeading: "Coloca la señal", guideTask: "Espera la pista y elige la señal de sendero correspondiente.",
    scoutChoicesLabel: "Opciones de linterna del explorador", guideChoicesLabel: "Opciones de señales de Guía", chooseSymbol: "Elige una linterna", clueReady: "Pista lista: {name}", waiting: "Esperando la pista del explorador", phaseScout: "Turno del explorador: revela una linterna y cuéntaselo a Guía.", phaseGuide: "Turno de Guía: elige la señal de {name}.",
    tellGuide: "Dile a Guía: {name}", scoutSuccess: "La linterna brilla. Pasa la pista a Guía.", scoutWrong: "Esa linterna quedó oscura. El explorador puede probar otra vez.",
    guideSuccess: "¡El sendero se abre! Prepara la siguiente linterna.", guideWrong: "La señal no coincide. La pista desapareció; repite esta escena.", leave: "Salir del rescate",
    footer: "Gratis · sin cuenta ni conexión", scene1Title: "El puente cubierto de musgo", scene1Hint: "Encuentra la luz tranquila junto al arroyo.",
    scene2Title: "El hueco de helechos", scene2Hint: "Un sendero suave se esconde bajo las hojas.", scene3Title: "El mirador de la lechuza", scene3Hint: "Abre la última linterna sobre el sendero.",
    resultBadge: "Informe del rescate", completeTitle: "¡El sendero de linternas está a salvo!", completeBody: "Tú y tu compañero abristeis las tres escenas nocturnas con {n} relevos claros.",
    failTitle: "El bosque necesita otro intento.", failBody: "La luz compartida se apagó antes de abrir las tres escenas. Leed la pista juntos e intentadlo de nuevo.", score: "Relevos claros: {n}", best: "Mejor rescate: {n}", replay: "Guiar otra vez", home: "Volver al menú", bestMenu: "Mejor rescate: {n} relevos claros",
    symbols: { moon: "Luna", leaf: "Hoja", star: "Estrella" }
  },
  "pt-BR": {
    back: "Voltar", eyebrow: "Original WeightPlay", title: "Guias das Lanternas Animais", language: "Idioma", guideBadge: "Um quebra-cabeça cooperativo tranquilo",
    mainHeading: "Uma pessoa lê a lanterna. A outra coloca o sinal do caminho.", mainBody: "Compartilhe uma tela para um resgate curto na floresta noturna. Batedor revela um símbolo seguro e Guia escolhe o marcador correspondente.",
    start: "Começar o resgate", soloNote: "Uma pessoa pode passar o dispositivo entre os papéis. Não é preciso conta ou rede.", scout: "Batedor", guide: "Guia", together: "Juntos",
    scoutPromise: "Revele o símbolo seguro da lanterna.", guidePromise: "Coloque o marcador correspondente.", togetherPromise: "Protejam três lanternas antes que o medidor se apague.",
    howTo: "Como jogar", howToBody: "Batedor toca um símbolo de lanterna e conta o que apareceu. Guia toca o marcador correspondente. Um erro reduz a luz compartilhada; uma passagem correta abre a próxima cena.",
    sceneBadge: "Resgate noturno", round: "Cena {n} / {total}", meter: "Luz de resgate {n} / 3", scoutRole: "Lado do batedor", scoutHeading: "Revelar uma lanterna",
    scoutTask: "Escolha um símbolo e conte ao Guia o que viu.", guideRole: "Lado do Guia", guideHeading: "Colocar o marcador", guideTask: "Espere a pista e escolha o marcador correspondente.",
    scoutChoicesLabel: "Escolhas de lanterna do batedor", guideChoicesLabel: "Escolhas de marcador do Guia", chooseSymbol: "Escolha uma lanterna", clueReady: "Pista pronta: {name}", waiting: "Esperando a pista do batedor", phaseScout: "Vez do batedor: revele uma lanterna e conte ao Guia.", phaseGuide: "Vez do Guia: escolha o marcador de {name}.",
    tellGuide: "Conte ao Guia: {name}", scoutSuccess: "A lanterna brilhou. Passe a pista ao Guia.", scoutWrong: "Essa lanterna ficou escura. O batedor pode tentar de novo.",
    guideSuccess: "O caminho se abriu! Prepare a próxima lanterna.", guideWrong: "O marcador não combinou. A pista sumiu; recomece esta cena.", leave: "Sair do resgate",
    footer: "Grátis · sem conta ou rede", scene1Title: "A ponte coberta de musgo", scene1Hint: "Encontre a luz tranquila ao lado do riacho.",
    scene2Title: "O recanto das samambaias", scene2Hint: "Uma trilha suave está escondida sob as folhas.", scene3Title: "O mirante da coruja", scene3Hint: "Abra a última lanterna acima da trilha.",
    resultBadge: "Relatório do resgate", completeTitle: "O caminho das lanternas está seguro!", completeBody: "Você e seu parceiro abriram as três cenas noturnas com {n} passagens claras.",
    failTitle: "A floresta precisa de outra tentativa.", failBody: "A luz compartilhada apagou antes de abrir as três cenas. Leiam a pista juntos e tentem novamente.", score: "Passagens claras: {n}", best: "Melhor resgate: {n}", replay: "Guiar novamente", home: "Voltar ao menu", bestMenu: "Melhor resgate: {n} passagens claras",
    symbols: { moon: "Lua", leaf: "Folha", star: "Estrela" }
  },
  fr: {
    back: "Retour", eyebrow: "Création WeightPlay", title: "Guides des lanternes animales", language: "Langue", guideBadge: "Un puzzle coopératif apaisé",
    mainHeading: "Une personne lit la lanterne. L’autre pose le repère.", mainBody: "Partagez un écran pour un court sauvetage dans la forêt nocturne. L’Éclaireur révèle un symbole sûr, puis le Guide choisit le repère correspondant.",
    start: "Commencer le sauvetage", soloNote: "Une seule personne peut passer l’appareil entre les rôles. Aucun compte ni réseau n’est nécessaire.", scout: "Éclaireur", guide: "Guide", together: "Ensemble",
    scoutPromise: "Révéler le symbole sûr de la lanterne.", guidePromise: "Poser le repère correspondant.", togetherPromise: "Protéger trois lanternes avant que la jauge ne s’éteigne.",
    howTo: "Comment jouer", howToBody: "L’Éclaireur touche un symbole de lanterne et dit ce qui est apparu. Le Guide touche le repère correspondant. Une erreur atténue la lumière partagée ; un bon relais ouvre la scène suivante.",
    sceneBadge: "Sauvetage nocturne", round: "Scène {n} / {total}", meter: "Lumière de sauvetage {n} / 3", scoutRole: "Côté Éclaireur", scoutHeading: "Révéler une lanterne",
    scoutTask: "Choisis un symbole, puis dis au Guide ce que tu as vu.", guideRole: "Côté Guide", guideHeading: "Poser le repère", guideTask: "Attends l’indice, puis choisis le repère correspondant.",
    scoutChoicesLabel: "Choix de lanternes de l’Éclaireur", guideChoicesLabel: "Choix de repères du Guide", chooseSymbol: "Choisir une lanterne", clueReady: "Indice prêt : {name}", waiting: "En attente de l’indice de l’Éclaireur", phaseScout: "Tour de l’Éclaireur : révèle une lanterne et dis-le au Guide.", phaseGuide: "Tour du Guide : choisis le repère {name}.",
    tellGuide: "Dire au Guide : {name}", scoutSuccess: "La lanterne brille. Passe l’indice au Guide.", scoutWrong: "Cette lanterne reste sombre. L’Éclaireur peut réessayer.",
    guideSuccess: "Le sentier s’ouvre ! Prépare la lanterne suivante.", guideWrong: "Le repère ne correspond pas. L’indice a disparu ; recommence cette scène.", leave: "Quitter le sauvetage",
    footer: "Gratuit · sans compte ni connexion", scene1Title: "Le pont moussu", scene1Hint: "Trouve la lumière calme près du ruisseau.",
    scene2Title: "Le creux des fougères", scene2Hint: "Un sentier doux se cache sous les feuilles.", scene3Title: "Le belvédère du hibou", scene3Hint: "Ouvre la dernière lanterne au-dessus du sentier.",
    resultBadge: "Rapport de sauvetage", completeTitle: "Le chemin des lanternes est sûr !", completeBody: "Ton partenaire et toi avez ouvert les trois scènes nocturnes avec {n} relais clairs.",
    failTitle: "La forêt demande un nouvel essai.", failBody: "La lumière partagée s’est éteinte avant l’ouverture des trois scènes. Lisez l’indice ensemble et réessayez.", score: "Relais clairs : {n}", best: "Meilleur sauvetage : {n}", replay: "Guider encore", home: "Retour au menu", bestMenu: "Meilleur sauvetage : {n} relais clairs",
    symbols: { moon: "Lune", leaf: "Feuille", star: "Étoile" }
  },
  de: {
    back: "Zurück", eyebrow: "WeightPlay Original", title: "Tierische Laternenlotsen", language: "Sprache", guideBadge: "Ruhiges Koop-Puzzle",
    mainHeading: "Eine Person liest die Laterne. Die andere setzt das Wegzeichen.", mainBody: "Teilt einen Bildschirm für eine kurze Rettung im Nachtwald. Der Späher zeigt ein sicheres Symbol, dann wählt der Lotse das passende Zeichen.",
    start: "Rettung starten", soloNote: "Eine Person kann das Gerät zwischen den Rollen weitergeben. Kein Konto und kein Netzwerk nötig.", scout: "Späher", guide: "Lotse", together: "Gemeinsam",
    scoutPromise: "Das sichere Laternensymbol zeigen.", guidePromise: "Das passende Wegzeichen setzen.", togetherPromise: "Drei Laternen schützen, bevor die Anzeige erlischt.",
    howTo: "So wird gespielt", howToBody: "Der Späher tippt ein Laternensymbol und sagt dem Lotsen, was erschienen ist. Der Lotse tippt das passende Zeichen. Ein Fehler dimmt das gemeinsame Rettungslicht; eine richtige Übergabe öffnet die nächste Szene.",
    sceneBadge: "Nachtwald-Rettung", round: "Szene {n} / {total}", meter: "Rettungslicht {n} / 3", scoutRole: "Späher-Seite", scoutHeading: "Laterne zeigen",
    scoutTask: "Wähle ein Symbol und sage dem Lotsen, was du gesehen hast.", guideRole: "Lotse-Seite", guideHeading: "Wegzeichen setzen", guideTask: "Warte auf den Hinweis und wähle das passende Zeichen.",
    scoutChoicesLabel: "Laternensymbole des Spähers", guideChoicesLabel: "Wegzeichen des Lotsen", chooseSymbol: "Laterne wählen", clueReady: "Hinweis bereit: {name}", waiting: "Warte auf den Hinweis des Spähers", phaseScout: "Späher ist dran: Laterne zeigen und dem Lotsen sagen.", phaseGuide: "Lotse ist dran: das Wegzeichen {name} wählen.",
    tellGuide: "Dem Lotsen sagen: {name}", scoutSuccess: "Die Laterne leuchtet. Gib den Hinweis weiter.", scoutWrong: "Diese Laterne blieb dunkel. Der Späher kann es erneut versuchen.",
    guideSuccess: "Der Weg öffnet sich! Bereit für die nächste Laterne.", guideWrong: "Das Zeichen passt nicht. Der Hinweis ist weg; starte diese Szene neu.", leave: "Rettung verlassen",
    footer: "Kostenlos · ohne Konto oder Netzwerk", scene1Title: "Die moosige Brücke", scene1Hint: "Finde das ruhige Licht am Bach.",
    scene2Title: "Die Farnmulde", scene2Hint: "Unter den Blättern versteckt sich ein sanfter Pfad.", scene3Title: "Der Eulen-Aussichtspunkt", scene3Hint: "Öffne die letzte Laterne über dem Pfad.",
    resultBadge: "Rettungsbericht", completeTitle: "Der Laternenpfad ist sicher!", completeBody: "Du und dein Partner habt alle drei Nachtszenen mit {n} klaren Übergaben geöffnet.",
    failTitle: "Der Wald braucht einen neuen Versuch.", failBody: "Das gemeinsame Licht erlosch, bevor alle drei Szenen offen waren. Lest den Hinweis zusammen und versucht es erneut.", score: "Klare Übergaben: {n}", best: "Beste Rettung: {n}", replay: "Noch einmal lotsen", home: "Zurück zum Menü", bestMenu: "Beste Rettung: {n} klare Übergaben",
    symbols: { moon: "Mond", leaf: "Blatt", star: "Stern" }
  },
  it: {
    back: "Indietro", eyebrow: "Originale WeightPlay", title: "Guide delle lanterne animali", language: "Lingua", guideBadge: "Un puzzle cooperativo tranquillo",
    mainHeading: "Una persona legge la lanterna. L’altra posa il segnavia.", mainBody: "Condividete uno schermo per un breve salvataggio nella foresta notturna. L’Esploratore rivela un simbolo sicuro, poi la Guida sceglie il segnavia corrispondente.",
    start: "Inizia il salvataggio", soloNote: "Una persona può passare il dispositivo tra i ruoli. Non servono account o rete.", scout: "Esploratore", guide: "Guida", together: "Insieme",
    scoutPromise: "Rivela il simbolo sicuro della lanterna.", guidePromise: "Posa il segnavia corrispondente.", togetherPromise: "Proteggete tre lanterne prima che la luce si spenga.",
    howTo: "Come si gioca", howToBody: "L’Esploratore tocca un simbolo della lanterna e dice alla Guida cosa è apparso. La Guida tocca il segnavia corrispondente. Un errore attenua la luce condivisa; un passaggio corretto apre la scena successiva.",
    sceneBadge: "Salvataggio notturno", round: "Scena {n} / {total}", meter: "Luce di salvataggio {n} / 3", scoutRole: "Lato dell’Esploratore", scoutHeading: "Rivela una lanterna",
    scoutTask: "Scegli un simbolo e racconta alla Guida cosa hai visto.", guideRole: "Lato della Guida", guideHeading: "Posa il segnavia", guideTask: "Aspetta l’indizio, poi scegli il segnavia corrispondente.",
    scoutChoicesLabel: "Scelte di lanterna dell’Esploratore", guideChoicesLabel: "Scelte di segnavia della Guida", chooseSymbol: "Scegli una lanterna", clueReady: "Indizio pronto: {name}", waiting: "In attesa dell’indizio dell’Esploratore", phaseScout: "Turno dell’Esploratore: rivela una lanterna e dillo alla Guida.", phaseGuide: "Turno della Guida: scegli il segnavia {name}.",
    tellGuide: "Dì alla Guida: {name}", scoutSuccess: "La lanterna brilla. Passa l’indizio alla Guida.", scoutWrong: "Quella lanterna è rimasta buia. L’Esploratore può riprovare.",
    guideSuccess: "Il sentiero si apre! Prepara la prossima lanterna.", guideWrong: "Il segnavia non corrisponde. L’indizio è sparito; ripeti questa scena.", leave: "Esci dal salvataggio",
    footer: "Gratis · nessun account o rete", scene1Title: "Il ponte coperto di muschio", scene1Hint: "Trova la luce tranquilla accanto al ruscello.",
    scene2Title: "La conca delle felci", scene2Hint: "Un sentiero morbido è nascosto sotto le foglie.", scene3Title: "Il belvedere del gufo", scene3Hint: "Apri l’ultima lanterna sopra il sentiero.",
    resultBadge: "Rapporto del salvataggio", completeTitle: "Il sentiero delle lanterne è sicuro!", completeBody: "Tu e il tuo compagno avete aperto le tre scene notturne con {n} passaggi chiari.",
    failTitle: "La foresta ha bisogno di un altro tentativo.", failBody: "La luce condivisa si è spenta prima di aprire tutte le scene. Leggete l’indizio insieme e riprovate.", score: "Passaggi chiari: {n}", best: "Miglior salvataggio: {n}", replay: "Guida ancora", home: "Torna al menu", bestMenu: "Miglior salvataggio: {n} passaggi chiari",
    symbols: { moon: "Luna", leaf: "Foglia", star: "Stella" }
  },
  ru: {
    back: "Назад", eyebrow: "Оригинал WeightPlay", title: "Звериные фонарики-проводники", language: "Язык", guideBadge: "Спокойная кооперативная головоломка",
    mainHeading: "Один читает фонарь. Другой ставит дорожный знак.", mainBody: "Смотрите на один экран и спасите лес ночью. Разведчик открывает безопасный символ, а Проводник выбирает такой же знак.",
    start: "Начать спасение", soloNote: "Один игрок может передавать устройство между ролями. Аккаунт и сеть не нужны.", scout: "Разведчик", guide: "Проводник", together: "Вместе",
    scoutPromise: "Открой безопасный символ фонаря.", guidePromise: "Поставь подходящий дорожный знак.", togetherPromise: "Защитите три фонаря, пока свет не погас.",
    howTo: "Как играть", howToBody: "Разведчик нажимает на символ фонаря и говорит Проводнику, что увидел. Проводник нажимает на такой же знак. Ошибка приглушает общий спасательный свет, а правильная передача открывает следующую сцену.",
    sceneBadge: "Ночное спасение", round: "Сцена {n} / {total}", meter: "Спасательный свет {n} / 3", scoutRole: "Сторона Разведчика", scoutHeading: "Открыть фонарь",
    scoutTask: "Выберите символ и скажите Проводнику, что увидели.", guideRole: "Сторона Проводника", guideHeading: "Поставить знак", guideTask: "Дождитесь подсказки и выберите такой же знак.",
    scoutChoicesLabel: "Выбор фонаря Разведчика", guideChoicesLabel: "Выбор знака Проводника", chooseSymbol: "Выберите фонарь", clueReady: "Подсказка готова: {name}", waiting: "Ждём подсказку Разведчика", phaseScout: "Ход Разведчика: откройте фонарь и скажите Проводнику.", phaseGuide: "Ход Проводника: выберите знак {name}.",
    tellGuide: "Скажите Проводнику: {name}", scoutSuccess: "Фонарь светится. Передайте подсказку Проводнику.", scoutWrong: "Этот фонарь не загорелся. Разведчик может попробовать ещё раз.",
    guideSuccess: "Тропа открыта! Готовьте следующий фонарь.", guideWrong: "Знак не подошёл. Подсказка исчезла; начните эту сцену заново.", leave: "Выйти из спасения",
    footer: "Бесплатно · аккаунт и сеть не нужны", scene1Title: "Мшистый мост", scene1Hint: "Найдите тихий свет у ручья.",
    scene2Title: "Папоротниковая низина", scene2Hint: "Под листьями спрятана мягкая тропа.", scene3Title: "Совкина смотровая площадка", scene3Hint: "Откройте последний фонарь над тропой.",
    resultBadge: "Отчёт о спасении", completeTitle: "Фонарная тропа в безопасности!", completeBody: "Вы с напарником открыли все три ночные сцены за {n} ясных передач.",
    failTitle: "Лесу нужна ещё одна попытка.", failBody: "Общий свет погас до открытия всех трёх сцен. Прочитайте подсказку вместе и попробуйте снова.", score: "Ясных передач: {n}", best: "Лучшее спасение: {n}", replay: "Провести снова", home: "В меню", bestMenu: "Лучшее спасение: {n} ясных передач",
    symbols: { moon: "Луна", leaf: "Лист", star: "Звезда" }
  },
  hi: {
    back: "वापस", eyebrow: "WeightPlay मूल", title: "पशु लालटेन मार्गदर्शक", language: "भाषा", guideBadge: "शांत सहयोगी पहेली",
    mainHeading: "एक दोस्त लालटेन पढ़ता है। दूसरा रास्ते का संकेत रखता है।", mainBody: "रात के जंगल में छोटे बचाव के लिए एक स्क्रीन साझा करें। खोजी सुरक्षित चिन्ह दिखाता है, फिर मार्गदर्शक वही संकेत चुनता है।",
    start: "बचाव शुरू करें", soloNote: "एक व्यक्ति दोनों भूमिकाओं के बीच डिवाइस दे सकता है। खाते या नेटवर्क की जरूरत नहीं है।", scout: "खोजी", guide: "मार्गदर्शक", together: "साथ में",
    scoutPromise: "लालटेन का सुरक्षित चिन्ह दिखाएँ।", guidePromise: "मिलता हुआ रास्ते का संकेत रखें।", togetherPromise: "रोशनी बुझने से पहले तीन लालटेन बचाएँ।",
    howTo: "कैसे खेलें", howToBody: "खोजी एक लालटेन चिन्ह दबाकर बताता है कि क्या दिखा। मार्गदर्शक मिलता हुआ संकेत दबाता है। गलत चुनाव साझा बचाव रोशनी घटाता है; सही अदला-बदली अगला दृश्य खोलती है।",
    sceneBadge: "रात का बचाव", round: "दृश्य {n} / {total}", meter: "बचाव रोशनी {n} / 3", scoutRole: "खोजी की ओर", scoutHeading: "लालटेन दिखाएँ",
    scoutTask: "एक चिन्ह चुनें और मार्गदर्शक को बताएँ कि आपने क्या देखा।", guideRole: "मार्गदर्शक की ओर", guideHeading: "संकेत रखें", guideTask: "संकेत की प्रतीक्षा करें, फिर मिलता हुआ रास्ते का संकेत चुनें।",
    scoutChoicesLabel: "खोजी की लालटेन पसंद", guideChoicesLabel: "मार्गदर्शक के रास्ते संकेत", chooseSymbol: "एक लालटेन चुनें", clueReady: "संकेत तैयार: {name}", waiting: "खोजी के संकेत की प्रतीक्षा", phaseScout: "खोजी की बारी: लालटेन चुनें और मार्गदर्शक को बताएँ।", phaseGuide: "मार्गदर्शक की बारी: {name} का संकेत चुनें।",
    tellGuide: "मार्गदर्शक को बताएँ: {name}", scoutSuccess: "लालटेन चमक उठी। संकेत मार्गदर्शक को दें।", scoutWrong: "वह लालटेन अंधेरी रही। खोजी फिर कोशिश कर सकता है।",
    guideSuccess: "रास्ता खुल गया! अगली लालटेन के लिए तैयार रहें।", guideWrong: "संकेत मेल नहीं खाता। संकेत मिट गया; यह दृश्य फिर शुरू करें।", leave: "बचाव छोड़ें",
    footer: "मुफ़्त खेल · खाते या नेटवर्क की ज़रूरत नहीं", scene1Title: "काई वाला पुल", scene1Hint: "धारा के पास शांत रोशनी खोजें।",
    scene2Title: "फर्न की छोटी घाटी", scene2Hint: "पत्तों के नीचे एक नरम रास्ता छिपा है।", scene3Title: "उल्लू का निगरानी स्थान", scene3Hint: "रास्ते के ऊपर आखिरी लालटेन खोलें।",
    resultBadge: "बचाव रिपोर्ट", completeTitle: "लालटेन का रास्ता सुरक्षित है!", completeBody: "आप और आपके साथी ने {n} साफ अदला-बदली से रात के तीनों दृश्य खोले।",
    failTitle: "जंगल को एक और कोशिश चाहिए।", failBody: "तीनों दृश्य खुलने से पहले साझा रोशनी बुझ गई। संकेत साथ पढ़ें और फिर कोशिश करें।", score: "साफ अदला-बदली: {n}", best: "सर्वश्रेष्ठ बचाव: {n}", replay: "फिर मार्गदर्शन करें", home: "मेनू पर लौटें", bestMenu: "सर्वश्रेष्ठ बचाव: {n} साफ अदला-बदली",
    symbols: { moon: "चाँद", leaf: "पत्ता", star: "तारा" }
  },
  ar: {
    back: "رجوع", eyebrow: "لعبة أصلية من WeightPlay", title: "أدلة فوانيس الحيوانات", language: "اللغة", guideBadge: "لغز تعاوني هادئ",
    mainHeading: "صديق يقرأ الفانوس، وصديق يضع علامة الطريق.", mainBody: "شاركا شاشة واحدة لإنقاذ قصير في غابة الليل. يكشف الكشّاف رمزاً آمناً، ثم يختار المرشد العلامة المطابقة.",
    start: "ابدأ الإنقاذ", soloNote: "يمكن لشخص واحد تمرير الجهاز بين الدورين. لا حاجة إلى حساب أو شبكة.", scout: "الكشّاف", guide: "المرشد", together: "معاً",
    scoutPromise: "اكشف رمز الفانوس الآمن.", guidePromise: "ضع علامة الطريق المطابقة.", togetherPromise: "احميا ثلاثة فوانيس قبل أن يخفت العداد.",
    howTo: "طريقة اللعب", howToBody: "يضغط الكشّاف رمز فانوس واحداً ويخبر المرشد بما ظهر. يضغط المرشد العلامة المطابقة. الاختيار الخاطئ يخفت ضوء الإنقاذ المشترك، أما التسليم الصحيح فيفتح المشهد التالي.",
    sceneBadge: "إنقاذ ليلي", round: "المشهد {n} / {total}", meter: "ضوء الإنقاذ {n} / 3", scoutRole: "جهة الكشّاف", scoutHeading: "اكشف فانوساً",
    scoutTask: "اختر رمزاً واحداً وأخبر المرشد بما رأيت.", guideRole: "جهة المرشد", guideHeading: "ضع العلامة", guideTask: "انتظر الدليل ثم اختر علامة الطريق المطابقة.",
    scoutChoicesLabel: "اختيارات فوانيس الكشّاف", guideChoicesLabel: "اختيارات علامات المرشد", chooseSymbol: "اختر فانوساً", clueReady: "الدليل جاهز: {name}", waiting: "بانتظار دليل الكشّاف", phaseScout: "دور الكشّاف: اختر فانوساً وأخبر المرشد.", phaseGuide: "دور المرشد: اختر علامة {name}.",
    tellGuide: "أخبر المرشد: {name}", scoutSuccess: "أضاء الفانوس. مرّر الدليل إلى المرشد.", scoutWrong: "بقي ذلك الفانوس مظلماً. يمكن للكشّاف المحاولة مجدداً.",
    guideSuccess: "انفتح الطريق! استعدا للفانوس التالي.", guideWrong: "العلامة غير مطابقة. اختفى الدليل؛ ابدآ هذا المشهد من جديد.", leave: "مغادرة الإنقاذ",
    footer: "لعب مجاني · لا حساب أو شبكة مطلوبة", scene1Title: "الجسر المغطى بالطحلب", scene1Hint: "اعثر على الضوء الهادئ بجانب الجدول.",
    scene2Title: "منخفض السرخس", scene2Hint: "يختبئ طريق ناعم تحت الأوراق.", scene3Title: "مطل البومة", scene3Hint: "افتحا الفانوس الأخير فوق الطريق.",
    resultBadge: "تقرير الإنقاذ", completeTitle: "أصبح طريق الفوانيس آمناً!", completeBody: "فتحتما المشاهد الليلية الثلاثة عبر {n} عمليات تسليم واضحة.",
    failTitle: "تحتاج الغابة إلى محاولة أخرى.", failBody: "خفت الضوء المشترك قبل فتح المشاهد الثلاثة. اقرآ الدليل معاً وحاولا من جديد.", score: "عمليات تسليم واضحة: {n}", best: "أفضل إنقاذ: {n}", replay: "الإرشاد مجدداً", home: "العودة إلى القائمة", bestMenu: "أفضل إنقاذ: {n} عمليات تسليم واضحة",
    symbols: { moon: "قمر", leaf: "ورقة", star: "نجمة" }
  }
};

const interfaceCopy = {
  en: { settings: "Settings", soundOn: "Sound: On", soundOff: "Sound: Off", progressTitle: "Three lanterns, one clear handoff", progressBody: "Reveal, tell, and match each scene with no timer." },
  "zh-Hant": { settings: "設定", soundOn: "音效：開啟", soundOff: "音效：關閉", progressTitle: "三盞提燈，一次清楚交接", progressBody: "找出、告訴夥伴，再配對每一幕；沒有計時壓力。" },
  "zh-Hans": { settings: "设置", soundOn: "音效：开启", soundOff: "音效：关闭", progressTitle: "三盏提灯，一次清楚交接", progressBody: "找出、告诉伙伴，再配对每一幕；没有计时压力。" },
  ja: { settings: "設定", soundOn: "サウンド：オン", soundOff: "サウンド：オフ", progressTitle: "3つのランタン、明確な引き継ぎ", progressBody: "見つけて伝え、各場面で同じ印を選びます。時間制限はありません。" },
  ko: { settings: "설정", soundOn: "소리: 켜기", soundOff: "소리: 끄기", progressTitle: "랜턴 세 개, 분명한 인계 한 번씩", progressBody: "찾고, 말하고, 각 장면에서 짝을 맞춰요. 시간 제한은 없습니다." },
  es: { settings: "Ajustes", soundOn: "Sonido: Activado", soundOff: "Sonido: Desactivado", progressTitle: "Tres linternas, un relevo claro", progressBody: "Revela, cuenta y empareja cada escena sin límite de tiempo." },
  "pt-BR": { settings: "Configurações", soundOn: "Som: Ativado", soundOff: "Som: Desativado", progressTitle: "Três lanternas, uma passagem clara", progressBody: "Revele, conte e combine cada cena sem limite de tempo." },
  fr: { settings: "Paramètres", soundOn: "Son : activé", soundOff: "Son : désactivé", progressTitle: "Trois lanternes, un relais clair", progressBody: "Révèle, raconte et associe chaque scène sans chronomètre." },
  de: { settings: "Einstellungen", soundOn: "Ton: An", soundOff: "Ton: Aus", progressTitle: "Drei Laternen, klare Übergaben", progressBody: "Zeige, erzähle und ordne jede Szene ohne Zeitdruck zu." },
  it: { settings: "Impostazioni", soundOn: "Audio: attivo", soundOff: "Audio: disattivato", progressTitle: "Tre lanterne, un passaggio chiaro", progressBody: "Rivela, racconta e abbina ogni scena senza timer." },
  ru: { settings: "Настройки", soundOn: "Звук: вкл.", soundOff: "Звук: выкл.", progressTitle: "Три фонаря — ясная передача", progressBody: "Откройте, расскажите и сопоставьте каждую сцену без таймера." },
  hi: { settings: "सेटिंग", soundOn: "ध्वनि: चालू", soundOff: "ध्वनि: बंद", progressTitle: "तीन लालटेन, एक स्पष्ट अदला-बदली", progressBody: "हर दृश्य को बिना टाइमर के दिखाएँ, बताएँ और मिलाएँ।" },
  ar: { settings: "الإعدادات", soundOn: "الصوت: مفعّل", soundOff: "الصوت: متوقف", progressTitle: "ثلاثة فوانيس، تسليم واضح", progressBody: "اكشفا وأخبرا وطابقا كل مشهد بلا مؤقت." }
};

const campaignEnglish = {
  mainBody: "Share one screen across a 30-stage night-forest rescue. Scout reads a private signal; Guide applies a different trail rule.",
  progressTitle: "Thirty trails, six lantern checkpoints", progressBody: "Reveal, pass, and solve evolving clues with no timer.", start: "Choose a trail",
  togetherPromise: "Unlock 30 trails and six lantern checkpoints.", howToBody: "Scout privately reveals a signal and passes the device. Guide combines that spoken signal with a different trail rule. A wrong marker dims the shared light; a clear handoff unlocks the next trail.",
  stageBadge: "Lantern atlas", stageTitle: "Choose a trail", stageHelp: "Clear trails in order. Every fifth trail is a checkpoint.", stageProgress: "Unlocked {unlocked} / {total}",
  stageName: "Trail {n}", checkpointName: "Checkpoint {n}", sceneHint: "A signal waits in {chapter}.", checkpointHint: "Checkpoint: combine both roles carefully.", checkpoint: "Checkpoint", trail: "Trail", locked: "Locked",
  scoutHeading: "Reveal the private signal", scoutTask: "Only Scout should look. Reveal, remember, then pass the device.", guideHeading: "Apply the trail rule", guideTask: "Listen to Scout, read your rule, then choose the resulting marker.",
  phaseScout: "Scout's turn — keep the screen private.", phasePass: "Scout: say the signal aloud, then hide it.", phaseGuide: "Guide's turn — use Scout's signal and your rule.",
  reveal: "Reveal signal", privateSignal: "Private signal: {name}", passClue: "Hide clue and pass to Guide", clueHidden: "Signal hidden from Guide", clueReady: "Spoken signal ready", ruleHidden: "Guide's rule appears after the handoff.",
  guideWrong: "That marker breaks the trail. Reveal the signal again.", completeTitle: "A new trail glows!", completeBody: "Trail {n} is clear and the next route is unlocked.", failTitle: "The lantern needs another handoff.", failBody: "The shared light faded. Reopen this trail and compare signal with rule again.",
  score: "Trail cleared: {n}", best: "Farthest trail: {n} / {total}", replay: "Retry trail", bestMenu: "Farthest trail: {n} / {total}", stageMap: "Trail map", nextStage: "Next trail",
  masteryTitle: "The whole lantern forest is awake!", masteryBody: "You mastered all 30 trails, six checkpoints, and every Scout–Guide rule.",
  chapter1: "I · Same light", chapter2: "II · Next light", chapter3: "III · Previous light", chapter4: "IV · Echo light", chapter5: "V · Weather turns", chapter6: "VI · Lantern mastery",
  ruleSame: "☾→☾ · ❧→❧ · ✦→✦", ruleNext: "☾→❧ · ❧→✦ · ✦→☾", rulePrevious: "☾→✦ · ✦→❧ · ❧→☾", ruleEcho: "Follow the double-turn arrow shown in Battle.", ruleWeather: "Odd trails turn right; even trails turn left.", ruleMastery: "Read the exact arrow shown in Battle."
};
Object.assign(en, campaignEnglish);

const campaignCopy = {
  "zh-Hant": {
    mainBody:"共用一個畫面，完成 30 關夜林救援。偵察員讀取私人訊號，引路員套用另一條路徑規則。",progressTitle:"30 條路徑，6 個提燈檢查點",progressBody:"找出、交接，再解開持續變化的線索；沒有計時。",start:"選擇路徑",togetherPromise:"解鎖 30 條路徑與 6 個提燈檢查點。",howToBody:"偵察員私下找出訊號並交接裝置。引路員把口述訊號和自己的路徑規則組合起來。選錯會消耗共同光線；清楚交接會解鎖下一條路。",
    stageBadge:"提燈地圖",stageTitle:"選擇路徑",stageHelp:"依序完成路徑；每第 5 關是檢查點。",stageProgress:"已解鎖 {unlocked} / {total}",stageName:"路徑 {n}",checkpointName:"檢查點 {n}",sceneHint:"{chapter} 裡藏著一個訊號。",checkpointHint:"檢查點：仔細組合兩個角色的資訊。",checkpoint:"檢查點",trail:"路徑",locked:"尚未解鎖",scoutHeading:"找出私人訊號",scoutTask:"只有偵察員可以看。記住訊號，再交出裝置。",guideHeading:"套用路徑規則",guideTask:"聽取偵察員的訊號，閱讀你的規則，再選出結果。",phaseScout:"偵察員回合：先遮住畫面。",phasePass:"偵察員：說出訊號，再把它藏起來。",phaseGuide:"引路員回合：組合口述訊號與你的規則。",reveal:"找出訊號",privateSignal:"私人訊號：{name}",passClue:"隱藏線索並交給引路員",clueHidden:"訊號已對引路員隱藏",clueReady:"已收到口述訊號",ruleHidden:"交接後才會顯示引路員規則。",guideWrong:"這個路標打斷了路徑。重新找出訊號。",completeTitle:"新的路徑亮起來了！",completeBody:"路徑 {n} 已完成，下一條路已解鎖。",failTitle:"提燈需要再一次交接。",failBody:"共同光線熄滅了。重新開始並再次比較訊號和規則。",score:"完成路徑：{n}",best:"最遠路徑：{n} / {total}",replay:"重試路徑",bestMenu:"最遠路徑：{n} / {total}",stageMap:"路徑地圖",nextStage:"下一條路",masteryTitle:"整座提燈森林都醒來了！",masteryBody:"你們精通了 30 條路徑、6 個檢查點與所有偵察員／引路員規則。"
  },
  "zh-Hans": {
    mainBody:"共用一个画面，完成 30 关夜林救援。侦察员读取私人信号，引路员套用另一条路径规则。",progressTitle:"30 条路径，6 个提灯检查点",progressBody:"找出、交接，再解开持续变化的线索；没有计时。",start:"选择路径",togetherPromise:"解锁 30 条路径与 6 个提灯检查点。",howToBody:"侦察员私下找出信号并交接设备。引路员把口述信号和自己的路径规则组合起来。选错会消耗共同光线；清楚交接会解锁下一条路。",
    stageBadge:"提灯地图",stageTitle:"选择路径",stageHelp:"依序完成路径；每第 5 关是检查点。",stageProgress:"已解锁 {unlocked} / {total}",stageName:"路径 {n}",checkpointName:"检查点 {n}",sceneHint:"{chapter} 里藏着一个信号。",checkpointHint:"检查点：仔细组合两个角色的信息。",checkpoint:"检查点",trail:"路径",locked:"尚未解锁",scoutHeading:"找出私人信号",scoutTask:"只有侦察员可以看。记住信号，再交出设备。",guideHeading:"套用路径规则",guideTask:"听取侦察员的信号，阅读你的规则，再选出结果。",phaseScout:"侦察员回合：先遮住画面。",phasePass:"侦察员：说出信号，再把它藏起来。",phaseGuide:"引路员回合：组合口述信号与你的规则。",reveal:"找出信号",privateSignal:"私人信号：{name}",passClue:"隐藏线索并交给引路员",clueHidden:"信号已对引路员隐藏",clueReady:"已收到口述信号",ruleHidden:"交接后才会显示引路员规则。",guideWrong:"这个路标打断了路径。重新找出信号。",completeTitle:"新的路径亮起来了！",completeBody:"路径 {n} 已完成，下一条路已解锁。",failTitle:"提灯需要再一次交接。",failBody:"共同光线熄灭了。重新开始并再次比较信号和规则。",score:"完成路径：{n}",best:"最远路径：{n} / {total}",replay:"重试路径",bestMenu:"最远路径：{n} / {total}",stageMap:"路径地图",nextStage:"下一条路",masteryTitle:"整座提灯森林都醒来了！",masteryBody:"你们精通了 30 条路径、6 个检查点与所有侦察员／引路员规则。"
  },
  ja: {
    mainBody:"1つの画面で30ステージの夜の森を救出。スカウトは秘密の信号を読み、ガイドは別の道ルールを使います。",progressTitle:"30の道、6つのランタンチェックポイント",progressBody:"見つけて、渡して、変化する手がかりを時間制限なしで解こう。",start:"道を選ぶ",togetherPromise:"30の道と6つのチェックポイントを開こう。",howToBody:"スカウトだけが信号を見て端末を渡します。ガイドは聞いた信号と自分のルールを組み合わせます。間違えると共有ライトが減り、成功すると次の道が開きます。",stageBadge:"ランタン地図",stageTitle:"道を選ぶ",stageHelp:"順番に進もう。5つ目ごとにチェックポイントです。",stageProgress:"アンロック {unlocked} / {total}",stageName:"道 {n}",checkpointName:"チェックポイント {n}",sceneHint:"{chapter}に信号が隠れています。",checkpointHint:"チェックポイント：2人の情報を慎重に合わせよう。",checkpoint:"チェック",trail:"道",locked:"ロック中",scoutHeading:"秘密の信号を見る",scoutTask:"スカウトだけが見て、覚えてから端末を渡します。",guideHeading:"道ルールを使う",guideTask:"信号を聞き、ルールを読んで結果の印を選びます。",phaseScout:"スカウトの番：画面を秘密に。",phasePass:"スカウト：信号を言ってから隠そう。",phaseGuide:"ガイドの番：信号とルールを合わせよう。",reveal:"信号を見る",privateSignal:"秘密の信号：{name}",passClue:"隠してガイドへ渡す",clueHidden:"信号はガイドから隠れています",clueReady:"口頭の信号を受け取りました",ruleHidden:"ガイドのルールは引き継ぎ後に表示。",guideWrong:"その印では道が切れます。もう一度信号を見よう。",completeTitle:"新しい道が光った！",completeBody:"道 {n} をクリア。次の道が開きました。",failTitle:"もう一度引き継ごう。",failBody:"共有ライトが消えました。信号とルールをもう一度比べよう。",score:"クリアした道：{n}",best:"最長到達：{n} / {total}",replay:"この道を再挑戦",bestMenu:"最長到達：{n} / {total}",stageMap:"道の地図",nextStage:"次の道",masteryTitle:"ランタンの森がすべて目覚めた！",masteryBody:"30の道、6つのチェックポイント、すべての役割ルールをマスターしました。"
  },
  ko: {
    mainBody:"한 화면으로 30스테이지 밤숲 구조를 떠나요. 정찰자는 비밀 신호를 읽고 안내자는 다른 길 규칙을 적용해요.",progressTitle:"길 30개, 랜턴 체크포인트 6개",progressBody:"찾고, 건네고, 변하는 단서를 시간 제한 없이 풀어요.",start:"길 선택",togetherPromise:"길 30개와 체크포인트 6개를 열어요.",howToBody:"정찰자만 신호를 보고 기기를 건넵니다. 안내자는 들은 신호와 자신의 규칙을 합칩니다. 틀리면 공동 불빛이 줄고 성공하면 다음 길이 열립니다.",stageBadge:"랜턴 지도",stageTitle:"길 선택",stageHelp:"순서대로 완료하세요. 다섯 번째 길마다 체크포인트입니다.",stageProgress:"해제 {unlocked} / {total}",stageName:"길 {n}",checkpointName:"체크포인트 {n}",sceneHint:"{chapter}에 신호가 숨어 있어요.",checkpointHint:"체크포인트: 두 역할의 정보를 조심히 합치세요.",checkpoint:"체크",trail:"길",locked:"잠김",scoutHeading:"비밀 신호 보기",scoutTask:"정찰자만 보고 기억한 뒤 기기를 건네세요.",guideHeading:"길 규칙 적용",guideTask:"신호를 듣고 규칙을 읽은 뒤 결과 표식을 고르세요.",phaseScout:"정찰자 차례: 화면을 비밀로 유지하세요.",phasePass:"정찰자: 신호를 말한 뒤 숨기세요.",phaseGuide:"안내자 차례: 신호와 규칙을 합치세요.",reveal:"신호 보기",privateSignal:"비밀 신호: {name}",passClue:"단서를 숨기고 안내자에게 건네기",clueHidden:"안내자에게 신호가 숨겨졌어요",clueReady:"말로 들은 신호 준비 완료",ruleHidden:"인계 후 안내자 규칙이 나타납니다.",guideWrong:"그 표식은 길을 끊어요. 신호를 다시 보세요.",completeTitle:"새 길이 빛나요!",completeBody:"길 {n} 완료. 다음 길이 열렸어요.",failTitle:"랜턴 인계가 한 번 더 필요해요.",failBody:"공동 불빛이 꺼졌어요. 신호와 규칙을 다시 비교하세요.",score:"완료한 길: {n}",best:"최고 도달: {n} / {total}",replay:"길 다시 시도",bestMenu:"최고 도달: {n} / {total}",stageMap:"길 지도",nextStage:"다음 길",masteryTitle:"랜턴 숲 전체가 깨어났어요!",masteryBody:"길 30개, 체크포인트 6개, 모든 역할 규칙을 익혔어요."
  },
  es: {
    mainBody:"Compartid una pantalla en un rescate nocturno de 30 etapas. Explorador lee una señal privada y Guía aplica otra regla.",progressTitle:"30 senderos y 6 controles de linterna",progressBody:"Revela, pasa y resuelve pistas cambiantes sin cronómetro.",start:"Elegir sendero",togetherPromise:"Desbloquead 30 senderos y 6 controles.",howToBody:"Explorador ve una señal en privado y pasa el dispositivo. Guía combina la señal hablada con su regla. Un error reduce la luz; un relevo claro abre el siguiente sendero.",stageBadge:"Mapa de linternas",stageTitle:"Elegir sendero",stageHelp:"Completadlos en orden. Cada quinto sendero es un control.",stageProgress:"Desbloqueados {unlocked} / {total}",stageName:"Sendero {n}",checkpointName:"Control {n}",sceneHint:"Hay una señal en {chapter}.",checkpointHint:"Control: combinad con cuidado la información de ambos roles.",checkpoint:"Control",trail:"Sendero",locked:"Bloqueado",scoutHeading:"Revelar la señal privada",scoutTask:"Solo Explorador mira, recuerda y pasa el dispositivo.",guideHeading:"Aplicar la regla",guideTask:"Escucha la señal, lee tu regla y elige el resultado.",phaseScout:"Turno de Explorador: pantalla privada.",phasePass:"Explorador: di la señal y ocúltala.",phaseGuide:"Turno de Guía: combina señal y regla.",reveal:"Revelar señal",privateSignal:"Señal privada: {name}",passClue:"Ocultar y pasar a Guía",clueHidden:"Señal oculta para Guía",clueReady:"Señal hablada lista",ruleHidden:"La regla de Guía aparece tras el relevo.",guideWrong:"Esa señal corta el sendero. Revelad de nuevo.",completeTitle:"¡Brilla un sendero nuevo!",completeBody:"Sendero {n} superado; el siguiente está abierto.",failTitle:"La linterna necesita otro relevo.",failBody:"La luz se apagó. Comparad de nuevo señal y regla.",score:"Sendero superado: {n}",best:"Máximo: {n} / {total}",replay:"Reintentar",bestMenu:"Máximo: {n} / {total}",stageMap:"Mapa",nextStage:"Siguiente",masteryTitle:"¡Todo el bosque está despierto!",masteryBody:"Dominasteis los 30 senderos, 6 controles y todas las reglas."
  },
  "pt-BR": {
    mainBody:"Compartilhe uma tela em um resgate noturno de 30 fases. Batedor lê um sinal privado e Guia aplica outra regra.",progressTitle:"30 trilhas e 6 pontos de lanterna",progressBody:"Revele, passe e resolva pistas que mudam, sem cronômetro.",start:"Escolher trilha",togetherPromise:"Desbloqueiem 30 trilhas e 6 pontos.",howToBody:"Batedor vê um sinal em segredo e passa o aparelho. Guia combina o sinal falado com sua regra. Um erro reduz a luz; um bom passe abre a próxima trilha.",stageBadge:"Mapa das lanternas",stageTitle:"Escolher trilha",stageHelp:"Conclua em ordem. Cada quinta trilha é um ponto.",stageProgress:"Desbloqueadas {unlocked} / {total}",stageName:"Trilha {n}",checkpointName:"Ponto {n}",sceneHint:"Há um sinal em {chapter}.",checkpointHint:"Ponto: combinem com cuidado as informações.",checkpoint:"Ponto",trail:"Trilha",locked:"Bloqueada",scoutHeading:"Revelar sinal privado",scoutTask:"Só o Batedor olha, memoriza e passa o aparelho.",guideHeading:"Aplicar a regra",guideTask:"Ouça o sinal, leia a regra e escolha o resultado.",phaseScout:"Vez do Batedor: tela privada.",phasePass:"Batedor: diga o sinal e esconda.",phaseGuide:"Vez do Guia: combine sinal e regra.",reveal:"Revelar sinal",privateSignal:"Sinal privado: {name}",passClue:"Esconder e passar ao Guia",clueHidden:"Sinal escondido do Guia",clueReady:"Sinal falado pronto",ruleHidden:"A regra aparece após a passagem.",guideWrong:"Esse marcador quebra a trilha. Revele novamente.",completeTitle:"Uma nova trilha brilhou!",completeBody:"Trilha {n} concluída; a próxima foi aberta.",failTitle:"A lanterna precisa de outro passe.",failBody:"A luz apagou. Comparem sinal e regra de novo.",score:"Trilha concluída: {n}",best:"Mais longe: {n} / {total}",replay:"Tentar de novo",bestMenu:"Mais longe: {n} / {total}",stageMap:"Mapa",nextStage:"Próxima",masteryTitle:"Toda a floresta despertou!",masteryBody:"Vocês dominaram 30 trilhas, 6 pontos e todas as regras."
  },
  fr: {
    mainBody:"Partagez un écran pour un sauvetage nocturne de 30 étapes. Éclaireur lit un signal privé et Guide applique une autre règle.",progressTitle:"30 sentiers et 6 balises",progressBody:"Révélez, passez et résolvez des indices évolutifs sans chrono.",start:"Choisir un sentier",togetherPromise:"Débloquez 30 sentiers et 6 balises.",howToBody:"Éclaireur voit un signal en privé puis passe l’appareil. Guide combine le signal dit avec sa règle. Une erreur réduit la lumière; un bon relais ouvre la suite.",stageBadge:"Carte des lanternes",stageTitle:"Choisir un sentier",stageHelp:"Terminez-les dans l’ordre. Chaque cinquième est une balise.",stageProgress:"Débloqués {unlocked} / {total}",stageName:"Sentier {n}",checkpointName:"Balise {n}",sceneHint:"Un signal attend dans {chapter}.",checkpointHint:"Balise : combinez soigneusement les deux rôles.",checkpoint:"Balise",trail:"Sentier",locked:"Verrouillé",scoutHeading:"Révéler le signal privé",scoutTask:"Seul Éclaireur regarde, mémorise puis passe l’appareil.",guideHeading:"Appliquer la règle",guideTask:"Écoutez le signal, lisez la règle et choisissez le résultat.",phaseScout:"Tour d’Éclaireur : écran privé.",phasePass:"Éclaireur : dites le signal puis cachez-le.",phaseGuide:"Tour de Guide : combinez signal et règle.",reveal:"Révéler",privateSignal:"Signal privé : {name}",passClue:"Cacher et passer à Guide",clueHidden:"Signal caché à Guide",clueReady:"Signal oral prêt",ruleHidden:"La règle apparaît après le relais.",guideWrong:"Ce repère coupe le sentier. Révélez encore.",completeTitle:"Un nouveau sentier brille !",completeBody:"Sentier {n} réussi ; le suivant est ouvert.",failTitle:"La lanterne demande un autre relais.",failBody:"La lumière s’est éteinte. Comparez encore signal et règle.",score:"Sentier réussi : {n}",best:"Plus loin : {n} / {total}",replay:"Réessayer",bestMenu:"Plus loin : {n} / {total}",stageMap:"Carte",nextStage:"Suivant",masteryTitle:"Toute la forêt s’éveille !",masteryBody:"Vous maîtrisez les 30 sentiers, 6 balises et toutes les règles."
  },
  de: {
    mainBody:"Teilt einen Bildschirm für eine Nachtwald-Rettung mit 30 Etappen. Scout liest ein geheimes Signal, Guide nutzt eine andere Regel.",progressTitle:"30 Pfade und 6 Laternenposten",progressBody:"Aufdecken, übergeben und wechselnde Hinweise ohne Zeitdruck lösen.",start:"Pfad wählen",togetherPromise:"Schaltet 30 Pfade und 6 Posten frei.",howToBody:"Scout sieht heimlich ein Signal und gibt das Gerät weiter. Guide verbindet das gesprochene Signal mit der eigenen Regel. Fehler kosten Licht; klare Übergaben öffnen den nächsten Pfad.",stageBadge:"Laternenkarte",stageTitle:"Pfad wählen",stageHelp:"Löst die Pfade der Reihe nach. Jeder fünfte ist ein Posten.",stageProgress:"Frei {unlocked} / {total}",stageName:"Pfad {n}",checkpointName:"Posten {n}",sceneHint:"In {chapter} wartet ein Signal.",checkpointHint:"Posten: Verbindet beide Informationen sorgfältig.",checkpoint:"Posten",trail:"Pfad",locked:"Gesperrt",scoutHeading:"Geheimes Signal zeigen",scoutTask:"Nur Scout schaut, merkt es sich und gibt das Gerät weiter.",guideHeading:"Pfadregel anwenden",guideTask:"Höre das Signal, lies die Regel und wähle das Ergebnis.",phaseScout:"Scout ist dran: Bildschirm geheim halten.",phasePass:"Scout: Signal sagen und ausblenden.",phaseGuide:"Guide ist dran: Signal und Regel verbinden.",reveal:"Signal zeigen",privateSignal:"Geheimes Signal: {name}",passClue:"Ausblenden und weitergeben",clueHidden:"Signal vor Guide verborgen",clueReady:"Gesprochenes Signal bereit",ruleHidden:"Die Guide-Regel erscheint nach der Übergabe.",guideWrong:"Dieses Zeichen unterbricht den Pfad. Noch einmal zeigen.",completeTitle:"Ein neuer Pfad leuchtet!",completeBody:"Pfad {n} geschafft; der nächste ist offen.",failTitle:"Die Laterne braucht eine neue Übergabe.",failBody:"Das Licht ist aus. Vergleicht Signal und Regel erneut.",score:"Pfad geschafft: {n}",best:"Weitester Pfad: {n} / {total}",replay:"Erneut",bestMenu:"Weitester Pfad: {n} / {total}",stageMap:"Karte",nextStage:"Nächster",masteryTitle:"Der ganze Wald ist wach!",masteryBody:"Ihr beherrscht 30 Pfade, 6 Posten und alle Regeln."
  },
  it: {
    mainBody:"Condividete uno schermo per un salvataggio notturno di 30 tappe. Esploratore legge un segnale privato e Guida applica un’altra regola.",progressTitle:"30 sentieri e 6 checkpoint",progressBody:"Rivela, passa e risolvi indizi variabili senza timer.",start:"Scegli sentiero",togetherPromise:"Sbloccate 30 sentieri e 6 checkpoint.",howToBody:"Esploratore vede il segnale in privato e passa il dispositivo. Guida combina il segnale detto con la propria regola. Un errore riduce la luce; un buon passaggio apre il sentiero seguente.",stageBadge:"Mappa delle lanterne",stageTitle:"Scegli sentiero",stageHelp:"Completali in ordine. Ogni quinto sentiero è un checkpoint.",stageProgress:"Sbloccati {unlocked} / {total}",stageName:"Sentiero {n}",checkpointName:"Checkpoint {n}",sceneHint:"Un segnale attende in {chapter}.",checkpointHint:"Checkpoint: unite con cura le informazioni dei ruoli.",checkpoint:"Checkpoint",trail:"Sentiero",locked:"Bloccato",scoutHeading:"Rivela il segnale privato",scoutTask:"Solo Esploratore guarda, ricorda e passa il dispositivo.",guideHeading:"Applica la regola",guideTask:"Ascolta il segnale, leggi la regola e scegli il risultato.",phaseScout:"Turno Esploratore: schermo privato.",phasePass:"Esploratore: dì il segnale e nascondilo.",phaseGuide:"Turno Guida: unisci segnale e regola.",reveal:"Rivela segnale",privateSignal:"Segnale privato: {name}",passClue:"Nascondi e passa alla Guida",clueHidden:"Segnale nascosto alla Guida",clueReady:"Segnale parlato pronto",ruleHidden:"La regola appare dopo il passaggio.",guideWrong:"Quel segno spezza il sentiero. Rivela di nuovo.",completeTitle:"Un nuovo sentiero brilla!",completeBody:"Sentiero {n} completato; il prossimo è aperto.",failTitle:"Serve un altro passaggio.",failBody:"La luce è svanita. Confrontate ancora segnale e regola.",score:"Sentiero completato: {n}",best:"Più lontano: {n} / {total}",replay:"Riprova",bestMenu:"Più lontano: {n} / {total}",stageMap:"Mappa",nextStage:"Prossimo",masteryTitle:"Tutta la foresta è sveglia!",masteryBody:"Avete dominato 30 sentieri, 6 checkpoint e tutte le regole."
  },
  ru: {
    mainBody:"Передавайте один экран в ночном спасении из 30 этапов. Разведчик читает тайный сигнал, Проводник применяет другое правило.",progressTitle:"30 троп и 6 контрольных фонарей",progressBody:"Открывайте, передавайте и решайте меняющиеся подсказки без таймера.",start:"Выбрать тропу",togetherPromise:"Откройте 30 троп и 6 контрольных точек.",howToBody:"Разведчик тайно видит сигнал и передаёт устройство. Проводник соединяет услышанный сигнал со своим правилом. Ошибка уменьшает свет, успех открывает следующую тропу.",stageBadge:"Карта фонарей",stageTitle:"Выбрать тропу",stageHelp:"Проходите по порядку. Каждая пятая — контрольная.",stageProgress:"Открыто {unlocked} / {total}",stageName:"Тропа {n}",checkpointName:"Контроль {n}",sceneHint:"Сигнал ждёт в {chapter}.",checkpointHint:"Контроль: аккуратно соедините сведения ролей.",checkpoint:"Контроль",trail:"Тропа",locked:"Закрыто",scoutHeading:"Открыть тайный сигнал",scoutTask:"Смотрит только Разведчик, запоминает и передаёт устройство.",guideHeading:"Применить правило",guideTask:"Услышьте сигнал, прочитайте правило и выберите результат.",phaseScout:"Ход Разведчика: экран тайный.",phasePass:"Разведчик: скажите сигнал и скройте его.",phaseGuide:"Ход Проводника: соедините сигнал и правило.",reveal:"Открыть сигнал",privateSignal:"Тайный сигнал: {name}",passClue:"Скрыть и передать",clueHidden:"Сигнал скрыт от Проводника",clueReady:"Сигнал услышан",ruleHidden:"Правило появится после передачи.",guideWrong:"Этот знак обрывает тропу. Откройте сигнал снова.",completeTitle:"Новая тропа светится!",completeBody:"Тропа {n} пройдена; следующая открыта.",failTitle:"Нужна ещё одна передача.",failBody:"Свет погас. Снова сравните сигнал и правило.",score:"Пройдена тропа: {n}",best:"Дальше всего: {n} / {total}",replay:"Повторить",bestMenu:"Дальше всего: {n} / {total}",stageMap:"Карта",nextStage:"Дальше",masteryTitle:"Весь лес проснулся!",masteryBody:"Вы освоили 30 троп, 6 точек и все правила."
  },
  hi: {
    mainBody:"एक स्क्रीन साझा कर 30 चरणों का रात का बचाव करें। खोजी निजी संकेत पढ़ता है और मार्गदर्शक अलग नियम लगाता है।",progressTitle:"30 रास्ते और 6 लालटेन पड़ाव",progressBody:"बिना टाइमर संकेत देखें, डिवाइस दें और बदलती पहेलियाँ हल करें।",start:"रास्ता चुनें",togetherPromise:"30 रास्ते और 6 पड़ाव खोलें।",howToBody:"खोजी अकेले संकेत देखकर डिवाइस देता है। मार्गदर्शक बोले संकेत को अपने नियम से मिलाता है। गलती से रोशनी घटती है; सही अदला-बदली अगला रास्ता खोलती है।",stageBadge:"लालटेन नक्शा",stageTitle:"रास्ता चुनें",stageHelp:"क्रम में पूरा करें। हर पाँचवाँ रास्ता पड़ाव है।",stageProgress:"खुले {unlocked} / {total}",stageName:"रास्ता {n}",checkpointName:"पड़ाव {n}",sceneHint:"{chapter} में संकेत छिपा है।",checkpointHint:"पड़ाव: दोनों भूमिकाओं की जानकारी मिलाएँ।",checkpoint:"पड़ाव",trail:"रास्ता",locked:"बंद",scoutHeading:"निजी संकेत देखें",scoutTask:"सिर्फ खोजी देखे, याद करे और डिवाइस दे।",guideHeading:"रास्ते का नियम लगाएँ",guideTask:"संकेत सुनें, नियम पढ़ें और नतीजा चुनें।",phaseScout:"खोजी की बारी: स्क्रीन निजी रखें।",phasePass:"खोजी: संकेत बोलें और छिपाएँ।",phaseGuide:"मार्गदर्शक की बारी: संकेत और नियम मिलाएँ।",reveal:"संकेत देखें",privateSignal:"निजी संकेत: {name}",passClue:"छिपाकर मार्गदर्शक को दें",clueHidden:"संकेत मार्गदर्शक से छिपा है",clueReady:"बोला संकेत तैयार",ruleHidden:"अदला-बदली के बाद नियम दिखेगा।",guideWrong:"यह निशान रास्ता तोड़ता है। फिर संकेत देखें।",completeTitle:"नया रास्ता चमक उठा!",completeBody:"रास्ता {n} पूरा; अगला खुल गया।",failTitle:"एक और अदला-बदली चाहिए।",failBody:"रोशनी बुझ गई। संकेत और नियम फिर मिलाएँ।",score:"पूरा रास्ता: {n}",best:"सबसे दूर: {n} / {total}",replay:"फिर कोशिश",bestMenu:"सबसे दूर: {n} / {total}",stageMap:"नक्शा",nextStage:"अगला",masteryTitle:"पूरा जंगल जाग उठा!",masteryBody:"आपने 30 रास्ते, 6 पड़ाव और सभी नियम सीख लिए।"
  },
  ar: {
    mainBody:"شاركا شاشة واحدة في إنقاذ ليلي من 30 مرحلة. يقرأ الكشّاف إشارة سرية ويطبّق المرشد قاعدة مختلفة.",progressTitle:"30 مساراً و6 نقاط فوانيس",progressBody:"اكشفا ومرّرا وحلّا أدلة متغيرة بلا مؤقت.",start:"اختيار مسار",togetherPromise:"افتحا 30 مساراً و6 نقاط.",howToBody:"يرى الكشّاف الإشارة سراً ثم يمرر الجهاز. يجمع المرشد الإشارة المنطوقة مع قاعدته. الخطأ يقلل الضوء، والتسليم الواضح يفتح المسار التالي.",stageBadge:"خريطة الفوانيس",stageTitle:"اختيار مسار",stageHelp:"أكملا المسارات بالترتيب. كل مسار خامس نقطة تحقق.",stageProgress:"مفتوح {unlocked} / {total}",stageName:"المسار {n}",checkpointName:"نقطة التحقق {n}",sceneHint:"تنتظر إشارة في {chapter}.",checkpointHint:"نقطة تحقق: اجمعا معلومات الدورين بعناية.",checkpoint:"نقطة",trail:"مسار",locked:"مغلق",scoutHeading:"اكشف الإشارة السرية",scoutTask:"ينظر الكشّاف وحده، يتذكر، ثم يمرر الجهاز.",guideHeading:"طبّق قاعدة الطريق",guideTask:"اسمع الإشارة واقرأ القاعدة ثم اختر النتيجة.",phaseScout:"دور الكشّاف: أبق الشاشة سرية.",phasePass:"الكشّاف: قل الإشارة ثم أخفها.",phaseGuide:"دور المرشد: اجمع الإشارة والقاعدة.",reveal:"كشف الإشارة",privateSignal:"الإشارة السرية: {name}",passClue:"إخفاء الدليل وتمريره",clueHidden:"الإشارة مخفية عن المرشد",clueReady:"الإشارة المنطوقة جاهزة",ruleHidden:"تظهر قاعدة المرشد بعد التسليم.",guideWrong:"هذه العلامة تقطع المسار. اكشف الإشارة مجدداً.",completeTitle:"أضاء مسار جديد!",completeBody:"اكتمل المسار {n} وانفتح التالي.",failTitle:"يحتاج الفانوس إلى تسليم آخر.",failBody:"انطفأ الضوء. قارنا الإشارة والقاعدة مجدداً.",score:"المسار المكتمل: {n}",best:"أبعد مسار: {n} / {total}",replay:"إعادة المحاولة",bestMenu:"أبعد مسار: {n} / {total}",stageMap:"الخريطة",nextStage:"المسار التالي",masteryTitle:"استيقظت غابة الفوانيس كلها!",masteryBody:"أتقنتما 30 مساراً و6 نقاط وجميع القواعد."
  }
};

// Stage cards render chapter and rule copy after Main has handed the selected
// locale forward. Keep these dynamic campaign keys locale-owned rather than
// falling back to the English base dictionary.
const campaignStageCopy = {
  "zh-Hant": { chapter1:"I · 同光", chapter2:"II · 下一道光", chapter3:"III · 前一道光", chapter4:"IV · 回聲光", chapter5:"V · 天氣轉向", chapter6:"VI · 提燈精通", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"依照戰鬥畫面顯示的雙轉箭頭。", ruleWeather:"單數路徑向右轉；雙數路徑向左轉。", ruleMastery:"讀取戰鬥畫面顯示的確切箭頭。" },
  "zh-Hans": { chapter1:"I · 同光", chapter2:"II · 下一道光", chapter3:"III · 前一道光", chapter4:"IV · 回声光", chapter5:"V · 天气转向", chapter6:"VI · 提灯精通", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"按照战斗画面显示的双转箭头。", ruleWeather:"单数路径向右转；双数路径向左转。", ruleMastery:"读取战斗画面显示的确切箭头。" },
  ja: { chapter1:"I · 同じ光", chapter2:"II · 次の光", chapter3:"III · 前の光", chapter4:"IV · こだまの光", chapter5:"V · 天候の曲がり", chapter6:"VI · ランタンの達人", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"バトルに表示される二重回転の矢印に従おう。", ruleWeather:"奇数の道は右へ、偶数の道は左へ曲がる。", ruleMastery:"バトルに表示される正確な矢印を読もう。" },
  ko: { chapter1:"I · 같은 빛", chapter2:"II · 다음 빛", chapter3:"III · 이전 빛", chapter4:"IV · 메아리 빛", chapter5:"V · 날씨 전환", chapter6:"VI · 랜턴 숙련", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"배틀에 표시된 이중 회전 화살표를 따르세요.", ruleWeather:"홀수 길은 오른쪽, 짝수 길은 왼쪽으로 돕니다.", ruleMastery:"배틀에 표시된 정확한 화살표를 읽으세요." },
  es: { chapter1:"I · Luz igual", chapter2:"II · Luz siguiente", chapter3:"III · Luz anterior", chapter4:"IV · Luz de eco", chapter5:"V · Giros del tiempo", chapter6:"VI · Maestría de linterna", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"Sigue la flecha de doble giro que muestra la batalla.", ruleWeather:"Los senderos impares giran a la derecha; los pares, a la izquierda.", ruleMastery:"Lee la flecha exacta mostrada en la batalla." },
  "pt-BR": { chapter1:"I · Luz igual", chapter2:"II · Próxima luz", chapter3:"III · Luz anterior", chapter4:"IV · Luz de eco", chapter5:"V · Viradas do tempo", chapter6:"VI · Maestria da lanterna", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"Siga a seta de dupla virada mostrada na batalha.", ruleWeather:"Trilhas ímpares viram à direita; pares, à esquerda.", ruleMastery:"Leia a seta exata mostrada na batalha." },
  fr: { chapter1:"I · Même lumière", chapter2:"II · Lumière suivante", chapter3:"III · Lumière précédente", chapter4:"IV · Lumière d’écho", chapter5:"V · Tours de météo", chapter6:"VI · Maîtrise de lanterne", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"Suivez la flèche à double tour affichée en bataille.", ruleWeather:"Les sentiers impairs tournent à droite ; les pairs à gauche.", ruleMastery:"Lisez la flèche exacte affichée en bataille." },
  de: { chapter1:"I · Gleiches Licht", chapter2:"II · Nächstes Licht", chapter3:"III · Vorheriges Licht", chapter4:"IV · Echo-Licht", chapter5:"V · Wetterwenden", chapter6:"VI · Laternenmeisterschaft", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"Folge dem Doppeldrehpfeil, der im Kampf gezeigt wird.", ruleWeather:"Ungerade Wege drehen rechts, gerade links.", ruleMastery:"Lies den genauen Pfeil im Kampf ab." },
  it: { chapter1:"I · Luce uguale", chapter2:"II · Luce successiva", chapter3:"III · Luce precedente", chapter4:"IV · Luce d’eco", chapter5:"V · Svolte del tempo", chapter6:"VI · Maestria della lanterna", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"Segui la freccia a doppia svolta mostrata in battaglia.", ruleWeather:"I sentieri dispari girano a destra; quelli pari a sinistra.", ruleMastery:"Leggi la freccia esatta mostrata in battaglia." },
  ru: { chapter1:"I · Тот же свет", chapter2:"II · Следующий свет", chapter3:"III · Предыдущий свет", chapter4:"IV · Эхо-свет", chapter5:"V · Повороты погоды", chapter6:"VI · Мастерство фонаря", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"Следуйте двойной стрелке поворота в битве.", ruleWeather:"Нечётные тропы поворачивают направо, чётные — налево.", ruleMastery:"Прочитайте точную стрелку в битве." },
  hi: { chapter1:"I · वही रोशनी", chapter2:"II · अगली रोशनी", chapter3:"III · पिछली रोशनी", chapter4:"IV · प्रतिध्वनि रोशनी", chapter5:"V · मौसम के मोड़", chapter6:"VI · लालटेन महारत", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"बैटल में दिखे दोहरे-मोड़ वाले तीर का अनुसरण करें।", ruleWeather:"विषम रास्ते दाएँ, सम रास्ते बाएँ मुड़ते हैं।", ruleMastery:"बैटल में दिखा सटीक तीर पढ़ें।" },
  ar: { chapter1:"I · الضوء نفسه", chapter2:"II · الضوء التالي", chapter3:"III · الضوء السابق", chapter4:"IV · ضوء الصدى", chapter5:"V · انعطافات الطقس", chapter6:"VI · إتقان الفانوس", ruleSame:"☾→☾ · ❧→❧ · ✦→✦", ruleNext:"☾→❧ · ❧→✦ · ✦→☾", rulePrevious:"☾→✦ · ✦→❧ · ❧→☾", ruleEcho:"اتّبعا سهم الدوران المزدوج الظاهر في المعركة.", ruleWeather:"المسارات الفردية تنعطف يميناً، والزوجية يساراً.", ruleMastery:"اقرآ السهم الدقيق الظاهر في المعركة." }
};

window.ANIMAL_LANTERN_GUIDES_COPY = Object.fromEntries(
  window.ANIMAL_LANTERN_GUIDES_LOCALES.map((code) => [code, { ...en, ...(translations[code] || {}), ...interfaceCopy[code], ...(campaignCopy[code] || {}), ...(campaignStageCopy[code] || {}) }])
);
