(() => {
  "use strict";

  const LOCALES = [
    ["en", "English"], ["zh-Hant", "繁體中文"], ["zh-Hans", "简体中文"], ["ja", "日本語"],
    ["ko", "한국어"], ["es", "Español"], ["pt-BR", "Português"], ["fr", "Français"],
    ["de", "Deutsch"], ["it", "Italiano"], ["ru", "Русский"], ["hi", "हिन्दी"], ["ar", "العربية"],
  ];
  const ROUTE_LOCALE = { "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", "pt-br": "pt-BR" };
  const K = [
    "loading","title","language","posterAlt","eyebrow","pitch","start","guideLabel","guideKicker","guideTitle","guideIntro",
    "howTitle","how1","how2","how3","chaptersTitle","chaptersText","strategyTitle","strategyText","trustTitle","trustText",
    "back","chooseStage","chapter","stageRailLabel","stageHint","left","stars","sound","help","objective","boardLabel","tray","trayLabel",
    "undo","magnet","shuffle","tutorialTitle","tutorial1","tutorial2","tutorial3","continue","leaveTitle","leaveText","returnStages",
    "nextPlan","retry","next","stages","stage","locked","cleared","best","pieces","openShelf","vineGallery","crystalRoom","mysteryLoft",
    "shiftingHall","grandFinale","tangled","cracked","revealed","matched","trayDanger","noUndo","noPair","shuffled","winKicker","winTitle",
    "winText","failKicker","failTitle","failText","planWin","planRetry","complete","soundOn","soundOff"
  ];
  const L = {
    en: [
      "Opening the treasure greenhouse…","Triple Match","Language","Mimi sorting magical treasures into groups of three","Treasure sorting puzzle","Tap uncovered treasures and collect three of a kind before the seven-slot tray fills.","Start Game","Game guide","Original WeightPlay collection puzzle","Read the pile. Protect the tray. Complete every trio.","Mimi's greenhouse shelves are overflowing with enchanted keepsakes. Only uncovered objects can move into the tray. Three matching objects vanish, but seven unmatched objects end the attempt.",
      "How to play","Tap an uncovered object to move it into the tray.","Collect three matching objects to clear them automatically.","Clear the complete pile before all seven tray slots are occupied.","Six rule chapters","Thirty stages introduce tangled vines, crystal shells, mystery wrapping, shifting shelves, tight trays, and finale piles that combine the rules.","Plan before tapping","A tempting object can uncover a useful match—or bury the tray in singletons. Look for pairs, track the top layers, and keep one emergency slot open.","Progress and privacy","Cleared stages, stars, and best tray space stay in this browser. No login or personal information is needed.",
      "Back","Choose a shelf","Chapter","Stage selector","Drag the shelf and choose an unlocked stage.","Left","Stars","Sound","How to play","Match every treasure without filling the tray.","Treasure pile","Tray","Seven-slot tray","Undo","Pair Finder","Shuffle","Make room with trios","Bright treasures are uncovered and ready to tap.","Three matching treasures disappear from the seven-slot tray.","Vines and crystal shells need one tap before the treasure can move.","Continue","Leave this shelf?","Continue keeps the exact pile. Returning to stages ends only this attempt.","Return to stages","Skill Report","Retry","Next Stage","Stages","Stage {n}","Locked","Cleared","Best tray space: {n}","{n} treasures","Open Shelves","Vine Gallery","Crystal Room","Mystery Loft","Shifting Hall","Grand Finale","Vine released—tap again to collect.","Crystal shell cracked—tap again.","Mystery treasure revealed.","Trio matched!","Only one tray slot remains.","Nothing to undo.","No safe pair is exposed yet.","The remaining pile has shifted.","Shelf cleared","Every trio found!","Stage {n} cleared with {stars} stars.","Tray full","The collection needs a new plan.","Try a different order and build safe pairs earlier.","You kept {n} tray slots free. Excellent forward planning.","You completed {n} trios. Watch the tray and build pairs earlier.","Complete","Sound on","Sound off"
    ],
    "zh-Hant": [
      "正在開啟寶物溫室…","三重配對","語言","咪咪把魔法寶物整理成三個一組","寶物整理益智","點擊未被遮住的寶物，湊齊三個同款；別讓七格托盤塞滿。","開始遊戲","遊戲指南","WeightPlay 原創收藏益智","讀懂堆疊、守住托盤、完成每一組三連。","咪咪的溫室堆滿了魔法收藏。只有沒有被遮住的物件能放入托盤；三個同款會消失，但七個未配對物件會讓挑戰結束。",
      "玩法","點擊未被遮住的物件，將它放入托盤。","收集三個相同物件就會自動消除。","在七個托盤格全部占滿前清空整堆物件。","六個規則章節","30 關會依序加入藤蔓、晶殼、神秘包裝、移動層架、緊縮托盤，以及混合規則的終章。","點擊前先規劃","誘人的物件可能打開好配對，也可能讓托盤堆滿單張。先找成對機會、觀察上層，並保留一格緊急空間。","進度與隱私","過關、星星與最佳剩餘格數只保存在本瀏覽器，不需登入或個人資料。",
      "返回","選擇溫室層架","章節","關卡選擇","拖曳層架並選擇已解鎖關卡。","剩餘","星星","音效","玩法","清除所有寶物，別讓托盤塞滿。","寶物堆","托盤","七格托盤","復原","配對提示","重新排列","用三連騰出空間","發亮的寶物沒有被遮住，可以點擊。","托盤內三個同款會一起消失。","藤蔓與晶殼要先點一次解除，下一次才能收取。","繼續","離開這個層架？","繼續會保留目前堆疊；返回關卡只會結束這次挑戰。","返回關卡","技巧報告","重試","下一關","關卡","第 {n} 關","尚未解鎖","已完成","最佳剩餘格：{n}","{n} 個寶物","開放層架","藤蔓藝廊","水晶室","神秘閣樓","移動長廊","盛大終章","藤蔓已解開，再點一次即可收取。","晶殼裂開了，再點一次。","神秘寶物現身了。","三個同款已消除！","托盤只剩一格。","目前無法復原。","現在沒有安全的配對露出。","剩餘物件已重新排列。","層架清空","所有三連都找到了！","第 {n} 關完成，獲得 {stars} 顆星。","托盤已滿","收藏需要新的規劃。","換個順序再試一次。","你保留了 {n} 格空間，前瞻規劃很出色。","你完成了 {n} 組三連；下次可以更早建立成對物件。","全部完成","音效開啟","音效關閉"
    ],
    "zh-Hans": [
      "正在开启宝物温室…","三重配对","语言","咪咪把魔法宝物整理成三个一组","宝物整理益智","点击未被遮住的宝物，凑齐三个同款；别让七格托盘塞满。","开始游戏","游戏指南","WeightPlay 原创收藏益智","看懂堆叠，守住托盘，完成每组三连。","咪咪的温室堆满了魔法收藏。只有没有被遮住的物件能放入托盘；三个同款会消失，但七个未配对物件会让挑战结束。",
      "玩法","点击未被遮住的物件，将它放入托盘。","收集三个相同物件就会自动消除。","在七个托盘格全部占满前清空整堆物件。","六个规则章节","30 关会依次加入藤蔓、晶壳、神秘包装、移动层架、紧缩托盘，以及混合规则的终章。","点击前先规划","诱人的物件可能打开好配对，也可能让托盘堆满单张。先找成对机会、观察上层，并保留一个紧急空位。","进度与隐私","过关、星星与最佳剩余格数只保存在本浏览器，不需要登录或个人资料。",
      "返回","选择温室层架","章节","关卡选择","拖动层架并选择已解锁关卡。","剩余","星星","音效","玩法","清除所有宝物，别让托盘塞满。","宝物堆","托盘","七格托盘","上一步","找一对","洗牌","用三连腾出空间","发亮的宝物没有被遮住，可以点击。","托盘内三个同款会一起消失。","藤蔓与晶壳要先点一次解除，下一次才能收取。","继续","离开这个层架？","继续会保留当前堆叠；返回关卡只会结束这次挑战。","返回关卡","技巧报告","重试","下一关","关卡","第 {n} 关","尚未解锁","已完成","最佳剩余格：{n}","{n} 个宝物","开放层架","藤蔓艺廊","水晶室","神秘阁楼","移动长廊","盛大终章","藤蔓已解开，再点一次即可收取。","晶壳裂开了，再点一次。","神秘宝物出现了。","三个配对成功！","托盘只剩一格。","目前无法撤销。","现在没有安全的一对露出。","剩余物件已重新排列。","层架清空","所有三连都找到了！","第 {n} 关完成，获得 {stars} 颗星。","托盘已满","收藏需要新的规划。","换个顺序再试一次。","你保留了 {n} 格空间，前瞻规划很出色。","你完成了 {n} 组三连；下次可以更早建立成对物件。","全部完成","音效开启","音效关闭"
    ],
  };
  const compact = {
    ja:["宝物温室を開いています…","トリプルマッチ","言語","ミミが魔法の宝物を3個ずつ整理している","宝物整理パズル","覆われていない宝物を選び、トレイが埋まる前に同じ物を3個集めよう。","ゲーム開始","ゲームガイド","WeightPlayオリジナル収集パズル","山を読み、トレイを守り、すべての3個組を完成させよう。","温室には魔法の宝物が山積みです。上に物がない宝物だけを選べます。同じ物3個は消えますが、未一致の物7個で失敗です。"],
    ko:["보물 온실을 여는 중…","트리플 매치","언어","미미가 마법 보물을 세 개씩 정리하는 모습","보물 정리 퍼즐","가려지지 않은 보물을 눌러 트레이가 차기 전에 같은 보물 세 개를 모으세요.","게임 시작","게임 안내","WeightPlay 오리지널 수집 퍼즐","더미를 읽고 트레이를 지키며 모든 세트를 완성하세요.","온실에는 마법 수집품이 쌓여 있습니다. 위가 열린 물건만 옮길 수 있고 같은 세 개는 사라지지만, 일곱 칸이 차면 도전이 끝납니다."],
    es:["Abriendo el invernadero…","Triple Match","Idioma","Mimi ordena tesoros mágicos en grupos de tres","Puzle de tesoros","Toca tesoros libres y reúne tres iguales antes de llenar las siete casillas.","Empezar","Guía del juego","Puzle de colección original de WeightPlay","Lee la pila, protege la bandeja y completa cada trío.","El invernadero de Mimi está lleno de recuerdos encantados. Solo se mueven los objetos descubiertos. Tres iguales desaparecen; siete distintos terminan el intento."],
    "pt-BR":["Abrindo a estufa de tesouros…","Partida Tripla","Idioma","Mimi organiza tesouros mágicos em trios","Quebra-cabeça de tesouros","Toque tesouros livres e junte três iguais antes de lotar as sete vagas.","Começar","Guia do jogo","Puzzle de coleção original WeightPlay","Leia a pilha, proteja a bandeja e complete cada trio.","A estufa de Mimi está cheia de lembranças encantadas. Só objetos descobertos podem ir à bandeja. Três iguais somem; sete diferentes encerram a tentativa."],
    fr:["Ouverture de la serre aux trésors…","Triple Match","Langue","Mimi range les trésors magiques par trois","Puzzle de trésors","Touchez les trésors libres et réunissez trois identiques avant de remplir les sept cases.","Commencer","Guide du jeu","Puzzle de collection original WeightPlay","Lisez la pile, protégez le plateau et complétez chaque trio.","La serre de Mimi déborde de souvenirs enchantés. Seuls les objets découverts rejoignent le plateau. Trois identiques disparaissent ; sept objets sans trio arrêtent l'essai."],
    de:["Die Schatzhalle wird geöffnet…","Triple Match","Sprache","Mimi sortiert magische Schätze in Dreiergruppen","Schatz-Sortierpuzzle","Tippe freie Schätze an und sammle drei gleiche, bevor alle sieben Plätze voll sind.","Spiel starten","Spielanleitung","Originales WeightPlay-Sammelpuzzle","Lies den Stapel, schütze die Ablage und bilde jedes Trio.","Mimis Gewächshaus ist voller verzauberter Andenken. Nur freie Objekte dürfen in die Ablage. Drei gleiche verschwinden, sieben einzelne beenden den Versuch."],
    it:["Apertura della serra dei tesori…","Triple Match","Lingua","Mimi ordina tesori magici a gruppi di tre","Puzzle di tesori","Tocca i tesori liberi e raccogline tre uguali prima di riempire i sette spazi.","Inizia","Guida di gioco","Puzzle da collezione originale WeightPlay","Leggi la pila, proteggi il vassoio e completa ogni trio.","La serra di Mimi trabocca di ricordi incantati. Solo gli oggetti scoperti possono muoversi. Tre uguali spariscono; sette oggetti spaiati chiudono il tentativo."],
    ru:["Открываем оранжерею сокровищ…","Тройное совпадение","Язык","Мими собирает волшебные сокровища по три","Головоломка с сокровищами","Выбирайте свободные сокровища и собирайте тройки, пока семь ячеек не заполнились.","Начать игру","Правила игры","Оригинальная коллекционная головоломка WeightPlay","Читайте стопку, берегите лоток и собирайте все тройки.","В оранжерее Мими полно зачарованных вещей. В лоток можно брать только открытые предметы. Три одинаковых исчезают, а семь разных завершают попытку."],
    hi:["ख़ज़ानों का ग्रीनहाउस खुल रहा है…","ट्रिपल मैच","भाषा","मिमी जादुई ख़ज़ानों को तीन-तीन के समूह में सजा रही है","ख़ज़ाना छाँटने की पहेली","खुले ख़ज़ाने चुनें और सात खाने भरने से पहले तीन समान वस्तुएँ मिलाएँ।","खेल शुरू करें","खेल मार्गदर्शिका","मूल WeightPlay संग्रह पहेली","ढेर को समझें, ट्रे बचाएँ और हर तिकड़ी पूरी करें।","मिमी का ग्रीनहाउस जादुई वस्तुओं से भरा है। केवल खुली वस्तुएँ ट्रे में जा सकती हैं। तीन समान वस्तुएँ मिटती हैं; सात अलग वस्तुएँ प्रयास समाप्त करती हैं।"],
    ar:["جارٍ فتح دفيئة الكنوز…","مطابقة ثلاثية","اللغة","ميمي ترتب الكنوز السحرية في مجموعات من ثلاثة","لغز ترتيب الكنوز","المس الكنوز المكشوفة واجمع ثلاثة متطابقة قبل امتلاء الخانات السبع.","ابدأ اللعبة","دليل اللعبة","لغز جمع أصلي من WeightPlay","اقرأ الكومة، واحمِ الصينية، وأكمل كل ثلاثية.","تمتلئ دفيئة ميمي بالتذكارات المسحورة. لا ينتقل إلا العنصر المكشوف. تختفي ثلاثة عناصر متطابقة، لكن سبعة عناصر غير متطابقة تنهي المحاولة."]
  };
  const commonTail = {
    ja:["遊び方","覆われていない物をタップしてトレイへ。","同じ物3個で自動的に消えます。","7枠が埋まる前に山を空にします。","6つの章","30ステージでツタ、結晶、包み、動く棚、狭いトレイ、複合ルールが登場します。","タップ前に計画","ペアと上層を確認し、緊急用の空きを1つ残しましょう。","進行とプライバシー","進行はこのブラウザーだけに保存され、ログインは不要です。","戻る","棚を選ぶ","章","ステージ選択","ドラッグして解放済みステージを選択。","残り","星","サウンド","遊び方","トレイを満杯にせず全ての宝物を消そう。","宝物の山","トレイ","7枠トレイ","元に戻す","ペア探し","シャッフル","3個組で空きを作ろう","明るい宝物は選べます。","同じ宝物3個はトレイから消えます。","ツタと結晶は一度タップして解除します。","続ける","この棚を離れますか？","続けると山を保持します。ステージへ戻ると今回だけ終了します。","ステージへ戻る","スキルレポート","再挑戦","次のステージ","ステージ"],
    ko:["플레이 방법","가려지지 않은 물건을 눌러 트레이로 옮기세요.","같은 물건 세 개는 자동으로 사라집니다.","일곱 칸이 차기 전에 더미를 비우세요.","여섯 규칙 챕터","30개 스테이지에 덩굴, 수정 껍질, 수수께끼 포장, 이동 선반과 복합 규칙이 등장합니다.","누르기 전에 계획","짝과 위층을 살피고 비상용 한 칸을 남기세요.","진행도와 개인정보","진행도는 이 브라우저에만 저장되며 로그인이 필요 없습니다.","뒤로","온실 선반 선택","챕터","스테이지 선택","선반을 드래그해 열린 스테이지를 선택하세요.","남음","별","소리","플레이 방법","트레이를 채우지 말고 모든 보물을 맞추세요.","보물 더미","트레이","일곱 칸 트레이","되돌리기","짝 찾기","섞기","세 개로 공간 만들기","밝은 보물은 선택할 수 있습니다.","같은 보물 세 개는 트레이에서 사라집니다.","덩굴과 수정은 한 번 눌러 해제하세요.","계속","이 선반을 떠날까요?","계속하면 더미가 유지됩니다. 스테이지로 돌아가면 이번 시도만 끝납니다.","스테이지로","기술 보고서","재시도","다음 스테이지","스테이지"],
  };

  const englishTail = L.en.slice(11);
  for (const [code, head] of Object.entries(compact)) {
    const localized = commonTail[code] || [];
    L[code] = head.concat(englishTail.map((value, i) => localized[i] || value));
  }
  const eu = {
    es:["Cómo jugar","Toca un objeto libre para moverlo.","Tres objetos iguales desaparecen.","Vacía la pila antes de llenar siete casillas.","Seis capítulos","Treinta niveles añaden enredaderas, cristal, misterios y estantes móviles.","Piensa antes de tocar","Busca parejas y conserva una casilla libre.","Progreso y privacidad","El progreso queda en este navegador; no hace falta iniciar sesión.","Volver","Elige un estante","Capítulo","Selector de niveles","Arrastra y elige un nivel desbloqueado.","Restantes","Estrellas","Sonido","Cómo jugar","Combina todo sin llenar la bandeja.","Pila de tesoros","Bandeja","Bandeja de siete casillas","Deshacer","Buscar pareja","Mezclar","Haz espacio con tríos","Los tesoros brillantes están libres.","Tres iguales desaparecen de la bandeja.","Toca una vez las lianas y el cristal para abrirlos.","Continuar","¿Dejar este estante?","Continuar conserva la pila. Volver termina solo este intento.","Volver a niveles","Informe de habilidad","Reintentar","Siguiente nivel","Niveles"],
    "pt-BR":["Como jogar","Toque um objeto livre para movê-lo.","Três objetos iguais desaparecem.","Esvazie a pilha antes de ocupar sete vagas.","Seis capítulos","Trinta fases trazem cipós, cristal, mistérios e prateleiras móveis.","Planeje antes de tocar","Procure pares e preserve uma vaga livre.","Progresso e privacidade","O progresso fica neste navegador; não é preciso entrar.","Voltar","Escolha uma prateleira","Capítulo","Seletor de fases","Arraste e escolha uma fase liberada.","Restantes","Estrelas","Som","Como jogar","Combine tudo sem lotar a bandeja.","Pilha de tesouros","Bandeja","Bandeja de sete vagas","Desfazer","Encontrar par","Embaralhar","Abra espaço com trios","Tesouros brilhantes estão livres.","Três iguais desaparecem da bandeja.","Toque uma vez em cipós e cristais para abrir.","Continuar","Sair desta prateleira?","Continuar preserva a pilha. Voltar encerra só esta tentativa.","Voltar às fases","Relatório de habilidade","Tentar de novo","Próxima fase","Fases"],
    fr:["Comment jouer","Touchez un objet libre pour le déplacer.","Trois objets identiques disparaissent.","Videz la pile avant de remplir sept cases.","Six chapitres","Trente niveaux ajoutent lianes, cristal, mystères et étagères mobiles.","Planifiez avant de toucher","Cherchez les paires et gardez une case libre.","Progression et confidentialité","La progression reste dans ce navigateur, sans connexion.","Retour","Choisissez une étagère","Chapitre","Sélecteur de niveaux","Faites glisser et choisissez un niveau débloqué.","Restants","Étoiles","Son","Comment jouer","Associez tout sans remplir le plateau.","Pile de trésors","Plateau","Plateau de sept cases","Annuler","Trouver une paire","Mélanger","Libérez de la place par trois","Les trésors lumineux sont libres.","Trois identiques disparaissent du plateau.","Touchez lianes et cristal une fois pour les ouvrir.","Continuer","Quitter cette étagère ?","Continuer conserve la pile. Revenir termine seulement cet essai.","Retour aux niveaux","Rapport de compétences","Réessayer","Niveau suivant","Niveaux"],
    de:["So wird gespielt","Tippe ein freies Objekt an.","Drei gleiche Objekte verschwinden.","Leere den Stapel, bevor sieben Plätze voll sind.","Sechs Kapitel","30 Stufen bringen Ranken, Kristall, Rätsel und bewegte Regale.","Vor dem Tippen planen","Suche Paare und halte einen Notplatz frei.","Fortschritt und Datenschutz","Fortschritt bleibt in diesem Browser; keine Anmeldung nötig.","Zurück","Wähle ein Regal","Kapitel","Stufenauswahl","Ziehe und wähle eine freigeschaltete Stufe.","Übrig","Sterne","Ton","So wird gespielt","Finde alle Paare, ohne die Ablage zu füllen.","Schatzstapel","Ablage","Ablage mit sieben Plätzen","Rückgängig","Paar finden","Mischen","Mit Dreiern Platz schaffen","Leuchtende Schätze sind frei.","Drei gleiche verschwinden aus der Ablage.","Tippe Ranken und Kristall einmal zum Öffnen.","Weiter","Dieses Regal verlassen?","Weiter behält den Stapel. Zurück beendet nur diesen Versuch.","Zu den Stufen","Fähigkeitsbericht","Erneut","Nächste Stufe","Stufen"],
    it:["Come giocare","Tocca un oggetto libero per spostarlo.","Tre oggetti uguali scompaiono.","Svuota la pila prima di occupare sette spazi.","Sei capitoli","Trenta livelli aggiungono rampicanti, cristalli, misteri e scaffali mobili.","Pianifica prima di toccare","Cerca coppie e conserva uno spazio libero.","Progressi e privacy","I progressi restano nel browser; nessun accesso richiesto.","Indietro","Scegli uno scaffale","Capitolo","Selettore livelli","Trascina e scegli un livello sbloccato.","Rimasti","Stelle","Audio","Come giocare","Abbina tutto senza riempire il vassoio.","Pila di tesori","Vassoio","Vassoio a sette spazi","Annulla","Trova coppia","Mescola","Fai spazio con i trii","I tesori luminosi sono liberi.","Tre uguali scompaiono dal vassoio.","Tocca rampicanti e cristalli una volta per aprirli.","Continua","Lasciare lo scaffale?","Continua conserva la pila. Tornare termina solo questo tentativo.","Torna ai livelli","Rapporto abilità","Riprova","Livello successivo","Livelli"],
    ru:["Как играть","Нажмите свободный предмет, чтобы переместить его.","Три одинаковых предмета исчезают.","Очистите стопку до заполнения семи ячеек.","Шесть глав","30 уровней добавляют лозы, кристаллы, тайны и движущиеся полки.","Думайте перед ходом","Ищите пары и оставляйте одну ячейку свободной.","Прогресс и конфиденциальность","Прогресс хранится в браузере, вход не нужен.","Назад","Выберите полку","Глава","Выбор уровней","Проведите и выберите открытый уровень.","Осталось","Звёзды","Звук","Как играть","Соберите всё, не заполняя лоток.","Стопка сокровищ","Лоток","Лоток на семь ячеек","Отменить","Найти пару","Перемешать","Освобождайте место тройками","Яркие сокровища свободны.","Три одинаковых исчезают из лотка.","Лозы и кристалл нужно нажать один раз.","Продолжить","Покинуть полку?","Продолжить сохранит стопку. Выход завершит только эту попытку.","К уровням","Отчёт о навыке","Повторить","Следующий уровень","Уровни"],
    hi:["कैसे खेलें","खुली वस्तु को ट्रे में ले जाने के लिए छुएँ।","तीन समान वस्तुएँ अपने आप मिटती हैं।","सात खाने भरने से पहले पूरा ढेर साफ़ करें।","छह नियम अध्याय","30 चरणों में बेलें, क्रिस्टल, रहस्य और चलती अलमारियाँ आती हैं।","छूने से पहले योजना बनाएँ","जोड़े खोजें और एक आपात जगह खाली रखें।","प्रगति और निजता","प्रगति इसी ब्राउज़र में रहती है; लॉगिन नहीं चाहिए।","वापस","ग्रीनहाउस शेल्फ़ चुनें","अध्याय","चरण चयन","खींचें और खुला चरण चुनें।","शेष","सितारे","ध्वनि","कैसे खेलें","ट्रे भरे बिना सभी ख़ज़ाने मिलाएँ।","ख़ज़ानों का ढेर","ट्रे","सात खाने की ट्रे","पहले जैसा","जोड़ी खोजें","फेरबदल","तिकड़ियों से जगह बनाएँ","चमकते ख़ज़ाने खुले हैं।","तीन समान वस्तुएँ ट्रे से मिटती हैं।","बेल और क्रिस्टल खोलने के लिए एक बार छुएँ।","जारी रखें","यह शेल्फ़ छोड़ें?","जारी रखने पर ढेर बचा रहेगा। लौटने से केवल यह प्रयास समाप्त होगा।","चरणों पर लौटें","कौशल रिपोर्ट","फिर प्रयास","अगला चरण","चरण"],
    ar:["طريقة اللعب","المس عنصراً مكشوفاً لنقله.","تختفي ثلاثة عناصر متطابقة.","أفرغ الكومة قبل امتلاء الخانات السبع.","ستة فصول","تضيف 30 مرحلة الكروم والبلور والألغاز والرفوف المتحركة.","خطط قبل اللمس","ابحث عن الأزواج واترك خانة للطوارئ.","التقدم والخصوصية","يبقى التقدم في هذا المتصفح ولا يلزم تسجيل الدخول.","رجوع","اختر رفاً","الفصل","اختيار المراحل","اسحب واختر مرحلة مفتوحة.","المتبقي","النجوم","الصوت","طريقة اللعب","طابق كل الكنوز دون ملء الصينية.","كومة الكنوز","الصينية","صينية من سبع خانات","تراجع","ابحث عن زوج","خلط","وفر مساحة بالثلاثيات","الكنوز المضيئة مكشوفة.","تختفي ثلاثة متطابقة من الصينية.","المس الكروم والبلور مرة لفتحهما.","متابعة","مغادرة هذا الرف؟","المتابعة تحفظ الكومة. الرجوع ينهي هذه المحاولة فقط.","العودة للمراحل","تقرير المهارة","إعادة","المرحلة التالية","المراحل"]
  };
  for (const [code, tail] of Object.entries(eu)) L[code] = compact[code].concat(tail).concat(englishTail.slice(tail.length));
  const dynamicTail = {
    ja:["ステージ {n}","未解放","クリア","最良の空き: {n}","宝物 {n}個","オープン棚","ツタの回廊","結晶の部屋","不思議な屋根裏","動く広間","グランドフィナーレ","ツタを外しました。もう一度タップ。","結晶が割れました。もう一度タップ。","不思議な宝物が現れました。","3個そろいました！","トレイの空きはあと1つ。","戻せる手がありません。","安全なペアはまだ見えていません。","残りの山が動きました。","棚をクリア","すべての3個組を発見！","ステージ {n} を星 {stars} でクリア。","トレイ満杯","新しい順番を考えよう。","別の順番で安全なペアを早めに作りましょう。","空きを {n} 枠残しました。先読みが見事です。","{n} 組を完成。次は早めにペアを作りましょう。","コンプリート","サウンドオン","サウンドオフ"],
    ko:["스테이지 {n}","잠김","완료","최고 빈칸: {n}","보물 {n}개","열린 선반","덩굴 회랑","수정 방","수수께끼 다락","움직이는 홀","그랜드 피날레","덩굴을 풀었습니다. 다시 누르세요.","수정 껍질이 갈라졌습니다. 다시 누르세요.","수수께끼 보물이 드러났습니다.","세 개를 맞췄습니다!","트레이가 한 칸만 남았습니다.","되돌릴 수 없습니다.","안전한 짝이 아직 드러나지 않았습니다.","남은 더미가 이동했습니다.","선반 완료","모든 세트를 찾았습니다!","스테이지 {n} 완료, 별 {stars}개.","트레이 가득 참","새로운 순서가 필요합니다.","다른 순서로 안전한 짝을 더 일찍 만드세요.","빈칸 {n}개를 남겼습니다. 훌륭한 계획입니다.","{n}세트를 완성했습니다. 다음에는 짝을 더 일찍 만드세요.","전체 완료","소리 켬","소리 끔"],
    es:["Nivel {n}","Bloqueado","Completado","Mejor espacio: {n}","{n} tesoros","Estantes abiertos","Galería de lianas","Sala de cristal","Ático misterioso","Salón móvil","Gran final","Liana liberada: toca otra vez.","Cristal abierto: toca otra vez.","Tesoro misterioso revelado.","¡Trío completo!","Solo queda una casilla.","No hay nada que deshacer.","Aún no hay una pareja segura visible.","La pila restante se ha movido.","Estante despejado","¡Encontraste todos los tríos!","Nivel {n} superado con {stars} estrellas.","Bandeja llena","La colección necesita otro plan.","Prueba otro orden y forma parejas seguras antes.","Conservaste {n} casillas libres. Gran planificación.","Completaste {n} tríos. Forma parejas antes la próxima vez.","Completo","Sonido activado","Sonido desactivado"],
    "pt-BR":["Fase {n}","Bloqueada","Concluída","Melhor espaço: {n}","{n} tesouros","Prateleiras abertas","Galeria de cipós","Sala de cristal","Sótão misterioso","Salão móvel","Grande final","Cipó liberado: toque de novo.","Cristal aberto: toque de novo.","Tesouro misterioso revelado.","Trio completo!","Só resta uma vaga.","Nada para desfazer.","Ainda não há par seguro visível.","A pilha restante se moveu.","Prateleira limpa","Todos os trios encontrados!","Fase {n} concluída com {stars} estrelas.","Bandeja cheia","A coleção precisa de outro plano.","Tente outra ordem e forme pares seguros antes.","Você manteve {n} vagas livres. Ótimo planejamento.","Você concluiu {n} trios. Forme pares mais cedo na próxima.","Completo","Som ligado","Som desligado"],
    fr:["Niveau {n}","Verrouillé","Terminé","Meilleur espace : {n}","{n} trésors","Étagères ouvertes","Galerie des lianes","Salle de cristal","Grenier mystérieux","Galerie mobile","Grande finale","Liane libérée : touchez encore.","Cristal ouvert : touchez encore.","Trésor mystérieux révélé.","Trio complété !","Il ne reste qu'une case.","Rien à annuler.","Aucune paire sûre n'est encore visible.","La pile restante a bougé.","Étagère vidée","Tous les trios sont trouvés !","Niveau {n} terminé avec {stars} étoiles.","Plateau plein","La collection demande un autre plan.","Essayez un autre ordre et formez les paires plus tôt.","Vous avez gardé {n} cases libres. Excellente anticipation.","Vous avez complété {n} trios. Formez les paires plus tôt.","Terminé","Son activé","Son désactivé"],
    de:["Stufe {n}","Gesperrt","Geschafft","Bester Freiraum: {n}","{n} Schätze","Offene Regale","Rankengalerie","Kristallraum","Rätselboden","Wandelhalle","Großes Finale","Ranke gelöst – noch einmal tippen.","Kristall geöffnet – noch einmal tippen.","Rätselschatz enthüllt.","Dreiergruppe gefunden!","Nur noch ein Platz frei.","Nichts zum Rückgängigmachen.","Noch kein sicheres Paar ist frei.","Der restliche Stapel hat sich bewegt.","Regal geleert","Alle Dreiergruppen gefunden!","Stufe {n} mit {stars} Sternen geschafft.","Ablage voll","Die Sammlung braucht einen neuen Plan.","Versuche eine andere Reihenfolge und bilde Paare früher.","Du hast {n} Plätze frei gehalten. Stark vorausgedacht.","Du hast {n} Gruppen geschafft. Bilde Paare nächstes Mal früher.","Komplett","Ton an","Ton aus"],
    it:["Livello {n}","Bloccato","Completato","Spazio migliore: {n}","{n} tesori","Scaffali aperti","Galleria dei rampicanti","Sala di cristallo","Soffitta misteriosa","Sala mobile","Gran finale","Rampicante rimosso: tocca ancora.","Cristallo aperto: tocca ancora.","Tesoro misterioso rivelato.","Trio completato!","Resta un solo spazio.","Niente da annullare.","Non è ancora visibile una coppia sicura.","La pila rimasta si è spostata.","Scaffale liberato","Hai trovato tutti i trii!","Livello {n} completato con {stars} stelle.","Vassoio pieno","La collezione richiede un altro piano.","Prova un altro ordine e crea prima le coppie sicure.","Hai tenuto liberi {n} spazi. Ottima pianificazione.","Hai completato {n} trii. Crea prima le coppie la prossima volta.","Completo","Audio attivo","Audio disattivo"],
    ru:["Уровень {n}","Закрыто","Пройдено","Лучший запас: {n}","Сокровищ: {n}","Открытые полки","Галерея лоз","Кристальный зал","Таинственный чердак","Движущийся зал","Большой финал","Лоза снята — нажмите ещё раз.","Кристалл расколот — нажмите ещё раз.","Таинственное сокровище открыто.","Тройка собрана!","Осталась одна ячейка.","Нечего отменять.","Безопасной пары пока не видно.","Оставшаяся стопка сдвинулась.","Полка очищена","Все тройки найдены!","Уровень {n} пройден на {stars} звезды.","Лоток заполнен","Коллекции нужен новый план.","Попробуйте другой порядок и раньше создавайте пары.","Вы оставили {n} ячеек. Отличное планирование.","Собрано троек: {n}. В следующий раз создавайте пары раньше.","Готово","Звук включён","Звук выключен"],
    hi:["चरण {n}","बंद","पूरा","सबसे अच्छी खाली जगह: {n}","{n} ख़ज़ाने","खुली अलमारियाँ","बेल गैलरी","क्रिस्टल कक्ष","रहस्यमय अटारी","चलता हॉल","महान समापन","बेल हट गई—फिर से छुएँ।","क्रिस्टल खुला—फिर से छुएँ।","रहस्यमय ख़ज़ाना दिख गया।","तिकड़ी मिल गई!","केवल एक खाना बचा है।","वापस करने को कुछ नहीं।","अभी कोई सुरक्षित जोड़ी खुली नहीं है।","बचा हुआ ढेर खिसक गया।","शेल्फ़ साफ़","सभी तिकड़ियाँ मिल गईं!","चरण {n} में {stars} सितारे मिले।","ट्रे भर गई","संग्रह के लिए नई योजना चाहिए।","दूसरा क्रम आज़माएँ और जोड़ियाँ पहले बनाएँ।","आपने {n} खाने खाली रखे। शानदार योजना।","आपने {n} तिकड़ियाँ पूरी कीं। अगली बार जोड़ियाँ पहले बनाएँ।","पूरा","ध्वनि चालू","ध्वनि बंद"],
    ar:["المرحلة {n}","مغلقة","مكتملة","أفضل فراغ: {n}","{n} كنوز","الرفوف المفتوحة","رواق الكروم","غرفة البلور","العلية الغامضة","القاعة المتحركة","الختام الكبير","أزيلت الكرمة، المس مرة أخرى.","انفتح البلور، المس مرة أخرى.","ظهر الكنز الغامض.","اكتملت الثلاثية!","لم تبق إلا خانة واحدة.","لا توجد حركة للتراجع.","لا يظهر زوج آمن بعد.","تحركت الكومة المتبقية.","تم تنظيف الرف","وجدت كل الثلاثيات!","اكتملت المرحلة {n} مع {stars} نجوم.","الصينية ممتلئة","تحتاج المجموعة إلى خطة جديدة.","جرب ترتيباً آخر وابنِ الأزواج الآمنة مبكراً.","أبقيت {n} خانات فارغة. تخطيط ممتاز.","أكملت {n} ثلاثيات. ابنِ الأزواج مبكراً في المرة القادمة.","مكتمل","الصوت يعمل","الصوت متوقف"],
  };
  for (const [code, values] of Object.entries(dynamicTail)) values.forEach((value, index) => { L[code][49 + index] = value; });

  const resultPlanCopy = {
    en: { nextPlan:"Next shelf", planWin:"Keep one emergency slot open and convert exposed pairs before adding a new singleton.", planRetry:"Build exposed pairs earlier and avoid adding a third singleton type when the tray is tight." },
    "zh-Hant": { nextPlan:"下一局策略", planWin:"保留一格緊急空間，先把露出的成對物件完成三連，再加入新的單張。", planRetry:"更早建立露出的成對物件；托盤吃緊時，先別加入第三種單張。" },
    "zh-Hans": { nextPlan:"下一局策略", planWin:"保留一个紧急空位，先把露出的成对物件完成三连，再加入新的单张。", planRetry:"更早建立露出的成对物件；托盘吃紧时，先别加入第三种单张。" },
    ja: { nextPlan:"次の棚の作戦", planWin:"緊急用の空きを1つ残し、新しい単品を入れる前に見えているペアを3個組にしましょう。", planRetry:"見えているペアを早めに作り、トレイが詰まったら3種類目の単品を増やさないようにしましょう。" },
    ko: { nextPlan:"다음 선반 전략", planWin:"비상용 한 칸을 남기고 새 단품을 넣기 전에 드러난 짝을 세 개로 완성하세요.", planRetry:"드러난 짝을 더 일찍 만들고 트레이가 빠듯할 때 세 번째 단품 종류를 추가하지 마세요." },
    es: { nextPlan:"Plan para el próximo estante", planWin:"Conserva una casilla de emergencia y completa las parejas visibles antes de añadir otro objeto suelto.", planRetry:"Forma antes las parejas visibles y evita añadir un tercer tipo suelto cuando la bandeja esté ajustada." },
    "pt-BR": { nextPlan:"Plano para a próxima prateleira", planWin:"Guarde uma vaga de emergência e complete os pares visíveis antes de adicionar outro item isolado.", planRetry:"Forme os pares visíveis mais cedo e evite um terceiro tipo isolado quando a bandeja estiver apertada." },
    fr: { nextPlan:"Plan pour la prochaine étagère", planWin:"Gardez une case de secours et complétez les paires visibles avant d'ajouter un nouvel objet isolé.", planRetry:"Formez plus tôt les paires visibles et évitez un troisième type isolé quand le plateau est serré." },
    de: { nextPlan:"Plan fürs nächste Regal", planWin:"Halte einen Notplatz frei und vervollständige offene Paare, bevor du ein neues Einzelstück aufnimmst.", planRetry:"Bilde offene Paare früher und nimm bei knapper Ablage keine dritte Einzelart hinzu." },
    it: { nextPlan:"Piano per il prossimo scaffale", planWin:"Tieni libero uno spazio di emergenza e completa le coppie visibili prima di aggiungere un nuovo oggetto singolo.", planRetry:"Crea prima le coppie visibili ed evita un terzo tipo singolo quando il vassoio è quasi pieno." },
    ru: { nextPlan:"План для следующей полки", planWin:"Оставляйте одну аварийную ячейку и завершайте открытые пары, прежде чем брать новый одиночный предмет.", planRetry:"Создавайте открытые пары раньше и не добавляйте третий одиночный тип при тесном лотке." },
    hi: { nextPlan:"अगली शेल्फ़ की योजना", planWin:"एक आपात खाना खाली रखें और नई अकेली वस्तु लेने से पहले खुले जोड़ों को तिकड़ी बनाएँ।", planRetry:"खुले जोड़े पहले बनाएँ और ट्रे तंग होने पर तीसरी अकेली किस्म न जोड़ें।" },
    ar: { nextPlan:"خطة الرف التالي", planWin:"اترك خانة للطوارئ وأكمل الأزواج المكشوفة قبل إضافة عنصر منفرد جديد.", planRetry:"كوّن الأزواج المكشوفة مبكراً وتجنب إضافة نوع منفرد ثالث عندما تضيق الصينية." },
  };
  for (const [code, copy] of Object.entries(resultPlanCopy)) {
    for (const [key, value] of Object.entries(copy)) L[code][K.indexOf(key)] = value;
  }

  const generatedGuidePatchCopy = {
    "pt-BR": {
      design: "Objetos grandes, sombras de sobreposição estáveis, ordem visível na bandeja e animação automática dos trios tornam cada consequência fácil de entender sem piscar o tabuleiro inteiro. A interface usa um único layout lógico centralizado, com largura máxima de 920 pixels. Celular, paisagem e desktop dimensionam juntos controles, áreas de toque, arte e coordenadas. Toque, mouse e teclado atuam sobre o mesmo estado válido. O pôster e o botão Começar ficam separados da gestão de fases; seleção, Batalha, diálogos e Resultado mantêm seus próprios limites e caminhos de retorno.",
      parent: "Não é preciso criar conta, comprar itens, enfrentar contagem regressiva ou participar de ranking público. Fases concluídas, estrelas e o melhor espaço livre na bandeja ficam neste navegador. O progresso usa o armazenamento local do perfil atual; limpar os dados, usar navegação privada, trocar de navegador ou dispositivo pode criar outro progresso ou apagar o atual. Idioma, som e preferência de movimento reduzido seguem os controles do WeightPlay quando o navegador permite. O guia e o Relatório de habilidade não são avaliações médicas, escolares ou profissionais.",
      strategyFrom: ["Use o Hint", "um novo tipo de singleton"],
      strategyTo: ["Use a dica", "um novo tipo isolado"],
      relatedIntro: "Como este jogo pratica lógica, experimente também:",
    },
  };

  const els = Object.fromEntries([...document.querySelectorAll("[id]")].map(el => [el.id, el]));
  const SAVE_KEY = "weightplay_animal_triple_match_v1";
  const CHAPTERS = ["openShelf","vineGallery","crystalRoom","mysteryLoft","shiftingHall","grandFinale"];
  const ITEM_NAMES = ["Acorn Lantern","Moon Cup","Shell Compass","Berry Brooch","Cloud Jar","Prism Flower","Star Telescope","Leaf Locket","Coral Music Box","Bee Bell","Mushroom Lamp","Crystal Feather"];
  const ITEM_NAMES_ZH_HANT = ["橡果提燈","月光杯","貝殼羅盤","莓果胸針","雲朵罐","稜鏡花","星光望遠鏡","葉片墜飾","珊瑚音樂盒","蜜蜂鈴","蘑菇燈","水晶羽毛"];
  const ITEM_NAMES_PT_BR = ["Lanterna de bolota","Taça da Lua","Bússola de concha","Broche de frutas vermelhas","Pote de nuvem","Flor prismática","Telescópio estelar","Medalhão de folha","Caixa de música de coral","Sino de abelha","Luminária de cogumelo","Pena de cristal"];
  const RUNTIME_LOCALE_SEGMENTS = { "zh-Hant":"zh-tw", "zh-Hans":"zh-cn", ja:"ja", ko:"ko", es:"es", "pt-BR":"pt-br", fr:"fr", de:"de", it:"it", ru:"ru", hi:"hi", ar:"ar" };
  const SHARED_SRC_BASE = new URL("../../src/", document.currentScript?.src || location.href);
  const runtimeCatalogLoads = new Map();
  let locale = "en", screen = "main", stageIndex = 0, run = null, audio = null, centeredTimer = 0, resultDecisionCommitted = false;
  let pendingMatch = null, windowFocused = document.hasFocus();
  let save = loadSave();

  function isForeground() { return document.visibilityState === "visible" && windowFocused; }
  function hasOpenBattleModal() { return [els.tutorialModal, els.leaveModal, els.resultModal].some(modal => !modal.hidden); }
  function cancelPendingMatch() {
    if (!pendingMatch) return;
    clearTimeout(pendingMatch.timer);
    pendingMatch = null;
  }
  function suspendPendingMatch() {
    if (!pendingMatch?.timer) return;
    clearTimeout(pendingMatch.timer);
    pendingMatch.remaining = Math.max(0, pendingMatch.dueAt - performance.now());
    pendingMatch.timer = 0;
  }
  function settlePendingMatch() {
    const pending = pendingMatch;
    if (!pending || run !== pending.runRef) { cancelPendingMatch(); return; }
    pendingMatch = null;
    const groups = pending.groups || [pending.pieceIds];
    const matchedIds = new Set(groups.flat());
    pending.runRef.pieces.filter(piece => matchedIds.has(piece.id)).forEach(piece => { piece.active = false; piece.tray = false; });
    pending.runRef.tray = pending.runRef.tray.filter(piece => !matchedIds.has(piece.id));
    pending.runRef.matches += groups.length;
    pending.runRef.paused = false;
    els.feedback.textContent = t("matched"); sound("match");
    if (pending.runRef.config.shiftEvery && pending.runRef.moves % pending.runRef.config.shiftEvery === 0) shiftRemaining();
    checkEnd(); renderRun();
  }
  function armPendingMatch() {
    if (!pendingMatch || pendingMatch.timer || !isForeground() || hasOpenBattleModal()) return;
    pendingMatch.dueAt = performance.now() + pendingMatch.remaining;
    pendingMatch.timer = setTimeout(settlePendingMatch, pendingMatch.remaining);
  }
  function ownForegroundInteraction() {
    if (document.visibilityState !== "visible") return false;
    windowFocused = true;
    armPendingMatch();
    return true;
  }
  function schedulePendingMatch(pieceIds) {
    if (pendingMatch?.runRef !== run) cancelPendingMatch();
    if (!pendingMatch) pendingMatch = { runRef: run, groups: [], remaining: 260, dueAt: 0, timer: 0 };
    pendingMatch.groups.push(pieceIds);
    pendingMatch.remaining = Math.min(pendingMatch.remaining || 260, 260);
    armPendingMatch();
  }

  function loadSave() {
    try {
      const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
      return { unlocked: Math.max(1, Math.min(30, +raw.unlocked || 1)), stars: raw.stars || {}, best: raw.best || {}, tutorial: !!raw.tutorial, sound: raw.sound !== false };
    } catch { return { unlocked: 1, stars: {}, best: {}, tutorial: false, sound: true }; }
  }
  function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch {} }
  function t(key, vars = {}) {
    const index = K.indexOf(key), table = L[locale] || L.en;
    let text = index >= 0 ? table[index] : key;
    return String(text).replace(/\{(\w+)\}/g, (_, name) => Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : "");
  }
  function runtimeCatalog(code = locale) {
    return window.WeightPlayGameRuntimeLocales?.[code] || null;
  }
  function ensureRuntimeCatalog(code) {
    if (code === "en" || runtimeCatalog(code)) return Promise.resolve(runtimeCatalog(code));
    if (runtimeCatalogLoads.has(code)) return runtimeCatalogLoads.get(code);
    const segment = RUNTIME_LOCALE_SEGMENTS[code];
    if (!segment) return Promise.resolve(null);
    const pending = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = new URL(`runtime-locales/${segment}.js?v=20260726-block-trilogy-copy1`, SHARED_SRC_BASE).href;
      script.dataset.animalTripleMatchRuntimeLocale = code;
      script.addEventListener("load", () => resolve(runtimeCatalog(code)), { once: true });
      script.addEventListener("error", () => resolve(null), { once: true });
      document.head.append(script);
    });
    runtimeCatalogLoads.set(code, pending);
    return pending;
  }
  function translateGeneratedGuide(code) {
    const guide = document.querySelector(".game-page-info");
    const catalog = runtimeCatalog(code);
    if (!guide || !catalog) return;
    const fragments = ["Animal Triple Match", "Game Guide"];
    const translate = (value) => {
      const source = String(value || "");
      const leading = source.match(/^\s*/u)?.[0] || "";
      const trailing = source.match(/\s*$/u)?.[0] || "";
      const core = source.slice(leading.length, source.length - trailing.length || undefined);
      let translated = catalog[core] || core;
      if (translated === core) fragments.forEach((fragment) => {
        if (translated.includes(fragment) && catalog[fragment]) translated = translated.replaceAll(fragment, catalog[fragment]);
      });
      return `${leading}${translated}${trailing}`;
    };
    const walker = document.createTreeWalker(guide, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const next = translate(walker.currentNode.data);
      if (next !== walker.currentNode.data) walker.currentNode.data = next;
    }
    ["aria-label", "title", "alt"].forEach((name) => {
      guide.querySelectorAll(`[${name}]`).forEach((node) => {
        const next = translate(node.getAttribute(name));
        if (next !== node.getAttribute(name)) node.setAttribute(name, next);
      });
    });
    const guideLabel = `${catalog["Animal Triple Match"] || t("title")} — ${t("guideLabel")}`;
    if (guide.getAttribute("aria-label") !== guideLabel) guide.setAttribute("aria-label", guideLabel);
    if (code === "pt-BR") {
      const copy = generatedGuidePatchCopy[code];
      const design = guide.querySelector(".game-info-design p");
      const parent = guide.querySelector(".game-info-parent p");
      const strategy = guide.querySelector(".game-info-strategy");
      const related = [...guide.querySelectorAll(".game-info-section")].find((section) => section.querySelector(".game-info-related"));
      if (design) design.textContent = copy.design;
      if (parent) parent.textContent = copy.parent;
      strategy?.querySelectorAll("li").forEach((item) => {
        item.textContent = item.textContent.replace(copy.strategyFrom[0], copy.strategyTo[0]).replace(copy.strategyFrom[1], copy.strategyTo[1]);
      });
      const relatedIntro = related?.querySelector(":scope > p");
      if (relatedIntro) relatedIntro.textContent = copy.relatedIntro;
    }
    if (code === "de") {
      const sections = [...guide.querySelectorAll(".game-info-section")];
      const setText = (root, selector, value) => {
        const node = root?.querySelector(selector);
        if (node) node.textContent = value;
      };
      const setItems = (root, selector, values) => {
        const nodes = root?.querySelectorAll(selector) || [];
        values.forEach((value, index) => { if (nodes[index]) nodes[index].textContent = value; });
      };
      const hero = guide.querySelector(".game-info-hero");
      setText(hero, ".game-info-kicker", "Originale WeightPlay-Spielanleitung");
      setText(hero, "h2", "Tierisches Triple-Match – Spielanleitung");
      setText(hero, "h2 + p", "Verschiebe freiliegende Schätze aus einem geschichteten Stapel in die sieben Plätze der Ablage. Bilde Dreiergruppen, bevor sieben einzelne, nicht passende Schätze die Ablage füllen.");
      setItems(hero, ".game-info-facts span, .game-info-facts strong", [
        "Spielprinzip", "Geschichtetes Dreiergruppen-Puzzle", "Genre", "Rätsel",
        "Thema", "Tiere", "Schwierigkeit", "Leicht bis anspruchsvoll",
        "Geschätzte Spielzeit", "2–8 Minuten pro Stufe", "Trainierte Fähigkeiten",
        "Logik", "Planung", "Problemlösung",
      ]);

      const story = guide.querySelector(".game-info-story");
      setText(story, "h3", "Welt und Aufgabe");
      setItems(story, "p", [
        "In dreißig handgebauten Gewächshausstufen liegen verzauberte Schätze in überlappenden Schichten. Ein Schatz kann nur bewegt werden, wenn kein aktives Objekt seine Auswahlfläche verdeckt.",
        "Die Ablage ist Arbeitsfläche und Gefahrenanzeige zugleich: Jeder Zug legt mehr vom Stapel frei, kann aber auch den Platz verbrauchen, den du für eine spätere Dreiergruppe brauchst.",
      ]);

      const systems = guide.querySelector(".game-info-systems");
      setText(systems, "h3", "So funktionieren die Systeme");
      setItems(systems, "li", [
        "Tippe einen freiliegenden Schatz an, um ihn auf den nächsten freien Platz der Ablage zu legen.",
        "Drei gleiche Schätze verschwinden automatisch; die übrigen Stücke rücken zusammen und geben wieder Platz frei.",
        "Verdeckte Schätze bleiben sichtbar, können aber erst ausgewählt werden, nachdem die darüberliegenden Objekte entfernt wurden.",
        "Spätere Kapitel ergänzen Ranken, Kristallhüllen, geheimnisvolle Verpackungen, verschiebbare Regale, kleinere Ablagen und abschließende Kombinationsstapel.",
      ]);

      const how = sections[2];
      setText(how, "h3", "Spielablauf");
      setItems(how, "li", [
        "Wähle eine freigeschaltete Stufe.",
        "Untersuche die oberste Schicht und suche nach einem erreichbaren Paar oder einer erreichbaren Dreiergruppe.",
        "Lege Schätze in die Ablage und halte nach Möglichkeit mindestens einen Notfallplatz frei.",
        "Räume den gesamten Stapel ab, bevor alle verfügbaren Plätze mit nicht passenden Schätzen belegt sind.",
      ]);

      const strategy = guide.querySelector(".game-info-strategy");
      setText(strategy, "h3", "Strategietipps");
      setItems(strategy, "li", [
        "Bevorzuge einen Schatz, dessen Entfernung mehrere verdeckte Objekte freilegt.",
        "Behalte vorhandene Paare in der Ablage im Blick, bevor du eine neue einzelne Schatzart aufnimmst.",
        "Verschiebe geheimnisvolle Schätze, wenn bereits eine sichere Dreiergruppe erreichbar ist.",
        "Nutze „Paar finden“, um einen erlaubten Zug zu erkennen, und prüfe anschließend, ob die Ablage genug Platz dafür bietet.",
      ]);

      const campaign = guide.querySelector(".game-info-campaign");
      setText(campaign, "h3", "Kampagne und Schwierigkeitsanstieg");
      setItems(campaign, "p", [
        "Sechs Kapitel mit jeweils fünf Stufen führen nacheinander neue Regelfamilien ein; das Schlusskapitel verbindet sie miteinander.",
        "Die Schwierigkeit steigt durch Abhängigkeiten zwischen den Schichten und den knapper werdenden Platz in der Ablage – nicht durch einen versteckten Zeitdruck.",
      ]);

      const design = guide.querySelector(".game-info-design");
      setText(design, "h3", "Hinweis des Entwicklungsteams");
      setText(design, "p", "Große Objekte, beständige Überlappungsschatten, eine klar erkennbare Reihenfolge in der Ablage und das automatische Entfernen von Dreiergruppen machen jede Folge eines Zuges lesbar, ohne das ganze Brett aufblinken zu lassen. Die vollständige Oberfläche verwendet ein einziges zentriertes Layout mit höchstens 920 Pixeln Breite. Auf Telefonen, im Querformat und auf Desktop-Bildschirmen werden Bedienelemente, Trefferflächen, Grafik und Spielkoordinaten gemeinsam skaliert. Berührung, Maus und Tastatur greifen dadurch auf denselben gültigen Spielzustand zu. Poster und „Spiel starten“ gehören zum Hauptbildschirm; Stufenauswahl, Spielbrett, Dialoge und Ergebnis besitzen jeweils klar begrenzte Inhalte und eindeutige Rückwege.");

      const parent = guide.querySelector(".game-info-parent");
      setText(parent, "h3", "Hinweis für Eltern");
      setText(parent, "p", "Zum Spielen sind weder Konto noch Kauf, Countdown oder öffentliche Rangliste nötig. Abgeschlossene Stufen, Sterne und der beste freie Ablageplatz bleiben im aktuellen Browserprofil gespeichert. Das Löschen von Websitedaten, privates Surfen, ein anderer Browser oder ein Gerätewechsel kann einen neuen Spielstand anlegen oder den vorhandenen entfernen. Sprache, Ton und die Einstellung für reduzierte Bewegung folgen den gemeinsamen WeightPlay-Einstellungen, sofern der Browser die Speicherung erlaubt. Die Spielanleitung und der Fähigkeitsbericht sind keine medizinische, schulische oder berufliche Bewertung.");

      const faq = sections[7];
      setText(faq, "h3", "Häufige Fragen");
      setItems(faq, "dt, dd", [
        "Warum kann ich einen Schatz nicht auswählen?",
        "Ein anderes aktives Objekt verdeckt noch seine Auswahlfläche.",
        "Wann verschwindet eine Dreiergruppe?",
        "Sofort nachdem der dritte gleiche Schatz in die Ablage gelegt wurde.",
        "Bleiben nach einer Dreiergruppe Lücken in der Ablage?",
        "Nein. Die übrigen Schätze rücken automatisch zusammen.",
        "Sind die Stufen zufällig?",
        "Nein. Jeder Stapel und jede Regelkombination ist handgebaut.",
        "Welche Eingaben und Bildschirmgrößen werden unterstützt?",
        "Berührung, Maus und Tastatur folgen denselben Regeln. Die Oberfläche skaliert als ein gemeinsames Layout für die vorgesehenen Telefon-, Querformat- und Desktopgrößen.",
        "Wird mein Fortschritt automatisch auf ein anderes Gerät übertragen?",
        "Nein. Der Spielstand liegt nur im lokalen Browserspeicher. Ein anderes Browserprofil oder Gerät beginnt daher mit einem eigenen Spielstand.",
      ]);

      const related = sections[8];
      setText(related, "h3", "Ähnliche Spiele");
      setText(related, ":scope > p", "Wenn du weiter Logik und Vorausplanung üben möchtest, probiere als Nächstes:");
      const relatedCopy = [
        ["animal-cratebound", "Animal Cratebound", "Bewege, schiebe und ziehe Runenfracht durch dreißig handgebaute Lagerhäuser der Himmelsarche."],
        ["animal-rootvault-pins", "Animal Rootvault Pins", "Löse dreißig Stiftkammern mit Taro Moospanzer und öffne jeden Mechanismus in einer sicheren Reihenfolge."],
      ];
      relatedCopy.forEach(([slug, title, copy]) => {
        const card = related?.querySelector(`a[href*="${slug}"]`);
        setText(card, "strong", title);
        setText(card, ".game-info-related-copy > span", copy);
      });
      guide.setAttribute("aria-label", "Tierisches Triple-Match — Spielanleitung");
    }
    if (code === "fr") {
      const sections = [...guide.querySelectorAll(".game-info-section")];
      const setText = (root, selector, value) => {
        const node = root?.querySelector(selector);
        if (node) node.textContent = value;
      };
      const setItems = (root, selector, values) => {
        const nodes = root?.querySelectorAll(selector) || [];
        values.forEach((value, index) => { if (nodes[index]) nodes[index].textContent = value; });
      };
      const hero = guide.querySelector(".game-info-hero");
      setText(hero, ".game-info-kicker", "Guide de jeu original WeightPlay");
      setText(hero, "h2", "Triple Match animal – Guide de jeu");
      setText(hero, "h2 + p", "Déplacez les trésors dégagés d'une pile superposée vers les sept cases du plateau. Formez des trios avant que sept trésors isolés et différents n'occupent toutes les cases.");
      setItems(hero, ".game-info-facts span, .game-info-facts strong", [
        "Principe de jeu", "Puzzle de trios en couches", "Genre", "Puzzle",
        "Thème", "Animaux", "Difficulté", "Facile à exigeant",
        "Durée estimée", "2 à 8 minutes par niveau", "Compétences exercées",
        "Logique", "Planification", "Résolution de problèmes",
      ]);

      const story = guide.querySelector(".game-info-story");
      setText(story, "h3", "Univers et mission");
      setItems(story, "p", [
        "Trente niveaux conçus à la main empilent des trésors enchantés dans la serre. Un trésor ne peut être déplacé que si aucun objet actif ne recouvre sa zone de sélection.",
        "Le plateau sert à la fois d'espace de travail et d'indicateur de danger : chaque choix dévoile une partie de la pile, mais peut aussi utiliser la place nécessaire à un prochain trio.",
      ]);

      const systems = guide.querySelector(".game-info-systems");
      setText(systems, "h3", "Fonctionnement des systèmes");
      setItems(systems, "li", [
        "Touchez un trésor dégagé pour le placer dans la prochaine case libre du plateau.",
        "Trois trésors identiques disparaissent automatiquement ; les autres se rapprochent et libèrent de la place.",
        "Les trésors recouverts restent visibles, mais ne peuvent être sélectionnés qu'après le retrait des objets placés au-dessus.",
        "Les chapitres suivants ajoutent des lianes, des coques de cristal, des emballages mystérieux, des étagères mobiles, des plateaux plus petits et des piles finales qui combinent ces règles.",
      ]);

      const how = sections[2];
      setText(how, "h3", "Déroulement d'une partie");
      setItems(how, "li", [
        "Choisissez un niveau déverrouillé.",
        "Examinez la couche supérieure et cherchez une paire ou un trio accessible.",
        "Placez les trésors sur le plateau en conservant si possible au moins une case de secours.",
        "Videz entièrement la pile avant que toutes les cases disponibles ne soient occupées par des trésors différents.",
      ]);

      const strategy = guide.querySelector(".game-info-strategy");
      setText(strategy, "h3", "Conseils stratégiques");
      setItems(strategy, "li", [
        "Préférez un trésor dont le retrait libère plusieurs objets recouverts.",
        "Surveillez les paires déjà présentes sur le plateau avant d'ajouter un nouveau trésor isolé.",
        "Retardez les trésors mystérieux lorsqu'un trio sûr est déjà accessible.",
        "Utilisez « Trouver une paire » pour repérer un coup autorisé, puis vérifiez que le plateau dispose d'assez de place.",
      ]);

      const campaign = guide.querySelector(".game-info-campaign");
      setText(campaign, "h3", "Campagne et progression de la difficulté");
      setItems(campaign, "p", [
        "Six chapitres de cinq niveaux introduisent chacun une famille de règles ; le dernier chapitre les réunit.",
        "La difficulté augmente avec les dépendances entre les couches et le manque de place sur le plateau, jamais à cause d'un chronomètre caché.",
      ]);

      const design = guide.querySelector(".game-info-design");
      setText(design, "h3", "Note de l'équipe de développement");
      setText(design, "p", "De grands objets, des ombres de superposition stables, un ordre clairement visible sur le plateau et la disparition automatique des trios rendent chaque conséquence lisible sans faire clignoter tout le plateau. L'interface complète utilise une seule disposition logique centrée, limitée à 920 pixels de largeur. Sur téléphone, en paysage et sur ordinateur, les commandes, zones tactiles, illustrations et coordonnées de jeu sont mises à l'échelle ensemble. Le toucher, la souris et le clavier agissent donc sur le même état de jeu valide. L'affiche et « Commencer » appartiennent à l'écran principal ; la sélection des niveaux, la partie, les dialogues et le résultat possèdent chacun un contenu délimité et un chemin de retour clair.");

      const parent = guide.querySelector(".game-info-parent");
      setText(parent, "h3", "Note aux parents");
      setText(parent, "p", "Aucun compte, achat, compte à rebours ni classement public n'est nécessaire. Les niveaux terminés, les étoiles et le meilleur nombre de cases libres restent enregistrés dans le profil actuel du navigateur. Effacer les données du site, utiliser la navigation privée, changer de navigateur ou changer d'appareil peut créer une nouvelle sauvegarde ou supprimer l'ancienne. La langue, le son et la réduction des animations suivent les réglages communs de WeightPlay lorsque le navigateur autorise leur stockage. Le guide et le rapport de compétence ne constituent pas une évaluation médicale, scolaire ou professionnelle.");

      const faq = sections[7];
      setText(faq, "h3", "Questions fréquentes");
      setItems(faq, "dt, dd", [
        "Pourquoi ne puis-je pas sélectionner un trésor ?",
        "Un autre objet actif recouvre encore sa zone de sélection.",
        "Quand un trio disparaît-il ?",
        "Dès que le troisième trésor identique rejoint le plateau.",
        "Les espaces vides restent-ils après un trio ?",
        "Non. Les trésors restants se rapprochent automatiquement.",
        "Les niveaux sont-ils aléatoires ?",
        "Non. Chaque pile et chaque combinaison de règles sont conçues à la main.",
        "Quelles commandes et tailles d'écran sont prises en charge ?",
        "Le toucher, la souris et le clavier suivent les mêmes règles. L'interface forme une seule disposition mise à l'échelle pour les tailles prévues sur téléphone, en paysage et sur ordinateur.",
        "Ma progression est-elle transférée automatiquement vers un autre appareil ?",
        "Non. La sauvegarde reste dans le stockage local du navigateur. Un autre profil ou appareil commence donc avec sa propre progression.",
      ]);

      const related = sections[8];
      setText(related, "h3", "Jeux similaires");
      setText(related, ":scope > p", "Pour continuer à exercer votre logique et votre anticipation, essayez ensuite :");
      const relatedCopy = [
        ["animal-cratebound", "Animal Cratebound", "Déplacez, poussez et tirez des cargaisons runiques dans trente entrepôts de l'Arche céleste conçus à la main."],
        ["animal-rootvault-pins", "Animal Rootvault Pins", "Résolvez trente chambres à goupilles avec Taro Coque-de-Mousse et ouvrez chaque mécanisme dans un ordre sûr."],
      ];
      relatedCopy.forEach(([slug, title, copy]) => {
        const card = related?.querySelector(`a[href*="${slug}"]`);
        setText(card, "strong", title);
        setText(card, ".game-info-related-copy > span", copy);
      });
      guide.setAttribute("aria-label", "Triple Match animal — Guide du jeu");
    }
    guide.dataset.runtimeLocalize = "off";
  }
  function syncGameOwnedMainOwners() {
    if (els.startBtn.textContent !== t("start")) els.startBtn.textContent = t("start");
    document.querySelectorAll(".wp-generated-main-title").forEach((node) => {
      if (node.textContent !== t("title")) node.textContent = t("title");
      if (node.getAttribute("aria-label") !== t("title")) node.setAttribute("aria-label", t("title"));
    });
  }
  function installLocaleOwnerObservers() {
    const startObserver = new MutationObserver(() => {
      if (els.startBtn.textContent !== t("start")) queueMicrotask(syncGameOwnedMainOwners);
    });
    startObserver.observe(els.startBtn, { childList: true, characterData: true, subtree: true });
    const guideObserver = new MutationObserver(() => {
      if (locale === "en" || !runtimeCatalog(locale)) return;
      queueMicrotask(() => translateGeneratedGuide(locale));
    });
    guideObserver.observe(els.mainGroup, { childList: true });
  }
  function settleLocaleTransaction(code) {
    ensureRuntimeCatalog(code).then(() => {
      if (locale !== code) return;
      window.WeightPlayGameInfo?.render?.();
      const reconcile = () => {
        if (locale !== code) return;
        applyLocale();
        syncGameOwnedMainOwners();
        if (code !== "en") translateGeneratedGuide(code);
      };
      requestAnimationFrame(reconcile);
      [50, 200, 450].forEach((delay) => setTimeout(reconcile, delay));
    });
  }
  function initialLocale() {
    const segment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const routed = ROUTE_LOCALE[segment] || LOCALES.find(([code]) => code.toLowerCase() === segment)?.[0];
    let stored = "";
    try {
      stored = sessionStorage.getItem("weightPlayLocale")
        || localStorage.getItem("weightPlayLocale")
        || sessionStorage.getItem("weightplay-locale")
        || localStorage.getItem("weightplay-locale")
        || "";
    } catch {}
    return LOCALES.some(([code]) => code === routed) ? routed : LOCALES.some(([code]) => code === stored) ? stored : "en";
  }
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-t]").forEach(el => { el.textContent = t(el.dataset.t); });
    document.querySelectorAll("[data-t-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.tAria)));
    document.querySelectorAll("[data-t-alt]").forEach(el => el.alt = t(el.dataset.tAlt));
    document.title = `${t("title")} | WeightPlay`;
    renderMainProgress(); renderStages(); if (run) renderRun();
    syncGameOwnedMainOwners();
  }
  function setLocale(value) {
    locale = LOCALES.some(([code]) => code === value) ? value : "en";
    try {
      sessionStorage.setItem("weightPlayLocale", locale);
      localStorage.setItem("weightPlayLocale", locale);
      sessionStorage.setItem("weightplay-locale", locale);
      localStorage.setItem("weightplay-locale", locale);
      window.WonderI18n?.setLocale?.(locale);
    } catch {}
    applyLocale();
    settleLocaleTransaction(locale);
  }
  function initLocale() {
    locale = initialLocale();
    els.localeSelect.innerHTML = LOCALES.map(([code, label]) => `<option value="${code}">${label}</option>`).join("");
    els.localeSelect.value = locale;
    document.addEventListener("change", event => {
      if (event.target.id === "localeSelect") setLocale(event.target.value);
    });
  }

  function fitCanvas() {
    const active = document.querySelector(".active-screen:not([hidden])");
    if (!active) return;
    const canvasWidth = Math.min(window.innerWidth, 920), height = Math.max(320, window.innerHeight - 56);
    const scale = Math.min(canvasWidth / 390, height / 788);
    document.documentElement.style.setProperty("--canvas-w", `${canvasWidth}px`);
    document.documentElement.style.setProperty("--canvas-h", `${height}px`);
    document.documentElement.style.setProperty("--scale", String(scale));
    document.documentElement.style.setProperty("--logical-w", `${canvasWidth / scale}px`);
    document.documentElement.style.setProperty("--logical-h", `${height / scale}px`);
    if (run) layoutPieces();
  }
  function setScreen(next) {
    screen = next;
    document.body.dataset.screen = next;
    els.mainGroup.hidden = next !== "main";
    els.stageScreen.hidden = next !== "stage";
    els.battleScreen.hidden = next !== "battle";
    document.body.style.overflow = next === "main" ? "" : "hidden";
    fitCanvas();
    if (next === "stage") { renderStages(); requestAnimationFrame(centerUnlocked); }
  }
  function renderMainProgress() {
    const cleared = Object.keys(save.stars).filter(k => save.stars[k] > 0).length;
    els.mainProgress.textContent = `${cleared} / 30`;
  }

  function stageConfig(index) {
    const chapter = Math.floor(index / 5), within = index % 5;
    return {
      index, chapter, within, types: Math.min(12, 4 + chapter + Math.floor(within / 2)),
      sets: 1 + (index >= 10 ? 1 : 0) + (index >= 25 ? 1 : 0),
      vineRate: chapter === 1 ? .28 + within * .03 : chapter === 5 ? .14 : 0,
      crystalRate: chapter === 2 ? .25 + within * .03 : chapter === 5 ? .14 : 0,
      mysteryRate: chapter === 3 ? .32 + within * .03 : chapter === 5 ? .16 : 0,
      shiftEvery: chapter === 4 ? Math.max(3, 7 - within) : chapter === 5 ? 4 : 0,
      trayCap: index >= 23 ? 6 : 7,
    };
  }
  function renderStages() {
    if (!els.stageRail) return;
    const totalStars = Object.values(save.stars).reduce((a, b) => a + (+b || 0), 0);
    els.stageSummary.textContent = `${Math.min(30, save.unlocked)} / 30 · ${totalStars} ★`;
    els.stageRail.innerHTML = Array.from({ length: 30 }, (_, i) => {
      const c = stageConfig(i), locked = i + 1 > save.unlocked, stars = save.stars[i] || 0;
      return `<button class="stage-card${locked ? " locked" : ""}" data-stage="${i}" type="button" aria-disabled="${locked}">
        <b>${t("stage", { n: i + 1 })}</b><span>${t(CHAPTERS[c.chapter])}<br>${t("pieces", { n: c.types * c.sets * 3 })}</span>
        <small>${locked ? `◆ ${t("locked")}` : stars ? `${"★".repeat(stars)} · ${t("best", { n: Object.prototype.hasOwnProperty.call(save.best, i) ? save.best[i] : 0 })}` : "◇◇◇"}</small></button>`;
    }).join("");
    syncCentered();
  }
  function centerStageCard(card, behavior = "smooth") {
    if (!card || !els.stageRail) return;
    const railRect = els.stageRail.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const scale = railRect.width / Math.max(1, els.stageRail.clientWidth);
    const renderedDelta = cardRect.left + cardRect.width / 2 - (railRect.left + railRect.width / 2);
    els.stageRail.scrollBy({ left: renderedDelta / Math.max(.01, scale), behavior });
  }
  function centerUnlocked() {
    const target = els.stageRail.querySelector(`[data-stage="${Math.max(0, save.unlocked - 1)}"]`);
    centerStageCard(target, "auto");
    setTimeout(() => {
      syncCentered();
      els.stageRail.querySelector(".stage-card[aria-current='true']")?.focus({ preventScroll: true });
    }, 30);
  }
  function syncCentered() {
    if (!els.stageRail || els.stageScreen.hidden) return;
    const railRect = els.stageRail.getBoundingClientRect();
    const center = railRect.left + railRect.width / 2;
    let best = null, distance = Infinity;
    els.stageRail.querySelectorAll(".stage-card").forEach(card => {
      const r = card.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - center);
      card.classList.remove("is-centered");
      if (d < distance) { distance = d; best = card; }
    });
    els.stageRail.querySelectorAll(".stage-card").forEach(card => {
      const active = card === best;
      card.classList.toggle("is-centered", active);
      card.setAttribute("aria-current", String(active));
      card.tabIndex = active ? 0 : -1;
    });
    const chapter = Math.floor(+(best?.dataset.stage || 0) / 5);
    els.chapterName.textContent = t(CHAPTERS[chapter]);
  }
  els.stageRail.addEventListener("scroll", () => { clearTimeout(centeredTimer); centeredTimer = setTimeout(syncCentered, 80); }, { passive: true });
  els.stageRail.addEventListener("click", event => {
    const card = event.target.closest?.(".stage-card");
    if (!card || card.getAttribute("aria-disabled") === "true") return;
    startBattle(+card.dataset.stage);
  });
  els.stageRail.addEventListener("keydown", event => {
    const card = event.target.closest?.(".stage-card");
    if (!card) return;
    const cards = [...els.stageRail.querySelectorAll(".stage-card")];
    const current = cards.indexOf(card);
    const rtl = document.documentElement.dir === "rtl";
    let next = null;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = cards.length - 1;
    else if (event.key === "ArrowRight") next = current + (rtl ? -1 : 1);
    else if (event.key === "ArrowLeft") next = current + (rtl ? 1 : -1);
    if (next == null) return;
    event.preventDefault();
    const target = cards[Math.max(0, Math.min(cards.length - 1, next))];
    cards.forEach(item => {
      const active = item === target;
      item.classList.toggle("is-centered", active);
      item.setAttribute("aria-current", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    centerStageCard(target);
    target.focus({ preventScroll: true });
    els.chapterName.textContent = t(CHAPTERS[Math.floor(+target.dataset.stage / 5)]);
  });

  function rng(seed) { let value = seed >>> 0; return () => ((value = Math.imul(value ^ value >>> 15, 1 | value), value ^= value + Math.imul(value ^ value >>> 7, 61 | value), ((value ^ value >>> 14) >>> 0) / 4294967296)); }
  function shuffle(list, random) { for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; } return list; }
  function buildPieces(index) {
    const c = stageConfig(index), random = rng(9271 + index * 7919), values = [];
    for (let type = 0; type < c.types; type++) for (let set = 0; set < c.sets; set++) values.push(type, type, type);
    shuffle(values, random);
    const cols = Math.min(7, Math.max(4, Math.ceil(Math.sqrt(values.length * 1.15))));
    return values.map((type, i) => {
      const layer = i % Math.max(2, Math.min(5, Math.ceil(values.length / 12)));
      const baseCol = (i * 3 + layer * 2) % cols, row = Math.floor(i / cols);
      return {
        id: i, type, active: true, tray: false, layer,
        x: (baseCol + (random() - .5) * .28) / Math.max(1, cols - 1),
        y: Math.min(.88, (row + (layer % 2) * .34 + random() * .12) / Math.max(3, Math.ceil(values.length / cols))),
        vine: random() < c.vineRate, crystal: random() < c.crystalRate, mystery: random() < c.mysteryRate,
      };
    });
  }
  function startBattle(index, skipTutorial = false) {
    cancelPendingMatch();
    stageIndex = Math.max(0, Math.min(29, index));
    const config = stageConfig(stageIndex);
    run = { config, pieces: buildPieces(stageIndex), tray: [], history: [], matches: 0, moves: 0, lastTrayId: null, tools: { undo: 2, magnet: 2, shuffle: 2 }, ended: false, paused: false };
    [els.tutorialModal, els.leaveModal, els.resultModal].forEach(modal => modal.hidden = true);
    isolateBattle(false); setScreen("battle"); renderRun(); sound("start");
    if (!save.tutorial && !skipTutorial) { run.paused = true; openModal(els.tutorialModal, els.tutorialClose); }
    track("game_start", { stage: stageIndex + 1 });
  }
  function spriteStyle(type) {
    const x = type % 4, y = Math.floor(type / 4);
    return `background-position:${x * 100 / 3}% ${y * 50}%;`;
  }
  function itemName(type) {
    if (locale === "zh-Hant") return ITEM_NAMES_ZH_HANT[type];
    if (locale === "pt-BR") return ITEM_NAMES_PT_BR[type];
    return runtimeCatalog(locale)?.[ITEM_NAMES[type]] || ITEM_NAMES[type];
  }
  function mysteryItemName() {
    return locale === "zh-Hant" ? "神秘寶物" : "Mystery treasure";
  }
  function pendingPieceIds() {
    return pendingMatch?.runRef === run ? new Set((pendingMatch.groups || []).flat()) : new Set();
  }
  function pieceBounds(piece) {
    const w = els.board.clientWidth || 390, h = els.board.clientHeight || 788, size = 78;
    const trackX = Math.max(0, w - size - 24), trackY = Math.max(0, h - size - 24);
    const left = 12 + piece.x * trackX, top = 12 + piece.y * trackY;
    return { left, top, right: left + size, bottom: top + size };
  }
  function isBlocked(piece) {
    if (!piece.active || piece.tray) return true;
    const bounds = pieceBounds(piece);
    return run.pieces.some(other => {
      if (!other.active || other.tray || other.layer <= piece.layer) return false;
      const otherBounds = pieceBounds(other);
      return otherBounds.left < bounds.right && otherBounds.right > bounds.left
        && otherBounds.top < bounds.bottom && otherBounds.bottom > bounds.top;
    });
  }
  function layoutPieces() {
    if (!run) return;
    const w = els.board.clientWidth, h = els.board.clientHeight, size = 78;
    run.pieces.forEach(piece => {
      const el = els.board.querySelector(`[data-piece="${piece.id}"]`);
      if (!el) return;
      el.style.left = `${12 + piece.x * Math.max(0, w - size - 24)}px`;
      el.style.top = `${12 + piece.y * Math.max(0, h - size - 24)}px`;
      el.style.zIndex = String(piece.layer + 1);
    });
  }
  function renderRun() {
    if (!run) return;
    const remaining = run.pieces.filter(p => p.active && !p.tray);
    els.stageLabel.textContent = t("stage", { n: stageIndex + 1 });
    els.stageName.textContent = t(CHAPTERS[run.config.chapter]);
    els.leftValue.textContent = remaining.length;
    const riskStars = run.tray.length <= 3 ? 3 : run.tray.length <= 5 ? 2 : 1;
    els.starValue.textContent = "★".repeat(riskStars);
    els.soundBtn.textContent = save.sound ? "♪" : "×";
    els.soundBtn.setAttribute("aria-label", t(save.sound ? "soundOn" : "soundOff"));
    const remainingIds = new Set(remaining.map(piece => String(piece.id)));
    els.board.querySelectorAll(".piece").forEach(node => {
      if (!remainingIds.has(node.dataset.piece)) node.remove();
    });
    remaining.forEach(piece => {
      let node = els.board.querySelector(`[data-piece="${piece.id}"]`);
      if (!node) {
        node = document.createElement("button");
        node.type = "button";
        node.dataset.piece = String(piece.id);
        node.style.cssText = spriteStyle(piece.type);
        els.board.append(node);
      }
      const blocked = isBlocked(piece), state = piece.vine ? " vine" : piece.crystal ? " crystal" : piece.mystery ? " mystery" : "";
      node.className = `piece ${blocked ? "blocked" : "free"}${state}`;
      node.setAttribute("aria-label", piece.mystery ? mysteryItemName() : itemName(piece.type));
    });
    renderTray(); layoutPieces(); renderTools();
  }
  function renderTray() {
    const cap = run.config.trayCap;
    const pendingIds = pendingPieceIds();
    const slots = Array.from({ length: 7 }, (_, i) => {
      if (i >= cap) return `<div class="tray-slot" aria-hidden="true" style="background:#341929;border-color:#a54867">×</div>`;
      const piece = run.tray[i];
      return piece ? `<div class="tray-piece${pendingIds.has(piece.id) ? " matching" : ""}${run.lastTrayId === piece.id ? " tray-new" : ""}" data-tray="${piece.id}" style="${spriteStyle(piece.type)}" aria-label="${itemName(piece.type)}"></div>` : `<div class="tray-slot"></div>`;
    });
    els.tray.innerHTML = slots.join("");
    run.lastTrayId = null;
  }
  function renderTools() {
    const settling = pendingMatch?.runRef === run;
    for (const name of ["undo","magnet","shuffle"]) {
      els[`${name}Count`].textContent = run.tools[name];
      els[`${name}Btn`].disabled = run.ended || settling || run.tools[name] <= 0;
    }
  }
  function snapshot() { return JSON.stringify({ pieces: run.pieces, tray: run.tray, matches: run.matches, moves: run.moves }); }
  function restore(raw) { const state = JSON.parse(raw); Object.assign(run, state); renderRun(); }
  function choosePiece(id) {
    if (!run || run.paused || run.ended) return;
    const piece = run.pieces.find(p => p.id === id);
    if (!piece || isBlocked(piece)) return;
    if (piece.vine) { piece.vine = false; els.feedback.textContent = t("tangled"); sound("crack"); renderRun(); return; }
    if (piece.crystal) { piece.crystal = false; els.feedback.textContent = t("cracked"); sound("crack"); renderRun(); return; }
    if (piece.mystery) { piece.mystery = false; els.feedback.textContent = t("revealed"); sound("reveal"); renderRun(); return; }
    run.history.push(snapshot()); if (run.history.length > 12) run.history.shift();
    piece.tray = true; run.tray.push(piece); run.lastTrayId = piece.id; run.moves++;
    sound("pick"); resolveMatch(piece.type);
  }
  function resolveMatch(type) {
    const pendingIds = pendingPieceIds();
    const same = run.tray.filter(p => p.type === type && !pendingIds.has(p.id));
    if (same.length >= 3) {
      schedulePendingMatch(same.slice(0, 3).map(piece => piece.id));
      run.paused = false;
      renderRun();
      return;
    }
    if (run.tray.length - pendingIds.size >= run.config.trayCap) { finish(false); return; }
    els.feedback.textContent = run.tray.length === run.config.trayCap - 1 ? t("trayDanger") : "";
    renderRun();
  }
  function shiftRemaining() {
    const random = rng(5501 + stageIndex * 97 + run.moves);
    run.pieces.filter(p => p.active && !p.tray).forEach(p => { p.x = Math.min(.96, Math.max(.04, p.x + (random() - .5) * .2)); p.y = Math.min(.9, Math.max(.02, p.y + (random() - .5) * .13)); });
    els.feedback.textContent = t("shuffled"); sound("shuffle");
  }
  function checkEnd() { if (!run.pieces.some(p => p.active && !p.tray) && run.tray.length === 0) finish(true); }
  function commitResultDecision(action) {
    if (resultDecisionCommitted || els.resultModal.hidden) return false;
    resultDecisionCommitted = true;
    [els.retryBtn, els.nextBtn, els.resultStages].forEach(button => { button.disabled = true; });
    action();
    return true;
  }
  function finish(win) {
    if (run.ended) return;
    cancelPendingMatch();
    run.ended = true; run.paused = true;
    const free = run.config.trayCap - run.tray.length, stars = win ? (free >= 5 ? 3 : free >= 3 ? 2 : 1) : 0;
    if (win) {
      save.stars[stageIndex] = Math.max(save.stars[stageIndex] || 0, stars);
      save.best[stageIndex] = Math.max(save.best[stageIndex] || 0, free);
      save.unlocked = Math.max(save.unlocked, Math.min(30, stageIndex + 2)); persist(); renderMainProgress();
    }
    els.resultKicker.textContent = t(win ? "winKicker" : "failKicker");
    els.resultTitle.textContent = t(win ? "winTitle" : "failTitle");
    els.resultStars.textContent = win ? "★".repeat(stars) : "◇◇◇";
    els.resultText.textContent = win ? t("winText", { n: stageIndex + 1, stars }) : t("failText");
    els.planText.textContent = t(win ? "planWin" : "planRetry");
    const canAdvance = win && stageIndex < 29;
    els.nextBtn.hidden = false;
    resultDecisionCommitted = false;
    [els.retryBtn, els.nextBtn, els.resultStages].forEach(button => { button.disabled = false; });
    els.nextBtn.disabled = !canAdvance;
    els.nextBtn.classList.toggle("primary", canAdvance);
    els.resultStages.classList.toggle("primary", !canAdvance);
    openModal(els.resultModal, canAdvance ? els.nextBtn : els.resultStages);
    sound(win ? "win" : "fail"); track(win ? "game_complete" : "game_fail", { stage: stageIndex + 1, stars });
  }
  function undo() {
    if (!run.history.length || run.tools.undo <= 0 || run.paused) { els.feedback.textContent = t("noUndo"); return; }
    run.tools.undo--; restore(run.history.pop()); sound("undo");
  }
  function magnet() {
    if (run.tools.magnet <= 0 || run.paused) return;
    const targetTypes = run.tray.map(p => p.type);
    const free = run.pieces.filter(p => p.active && !p.tray && !isBlocked(p) && !p.vine && !p.crystal && !p.mystery);
    const target = free.find(p => targetTypes.includes(p.type)) || free[0];
    if (!target) { els.feedback.textContent = t("noPair"); return; }
    run.tools.magnet--; renderTools();
    els.board.querySelector(`[data-piece="${target.id}"]`)?.classList.add("hint");
    els.feedback.textContent = t("noPair");
    sound("hint");
  }
  function shuffleTool() {
    if (run.tools.shuffle <= 0 || run.paused) return;
    run.tools.shuffle--; run.history.push(snapshot());
    const random = rng(Date.now() ^ (stageIndex + 1));
    const open = run.pieces.filter(p => p.active && !p.tray);
    shuffle(open, random).forEach((p, i) => { p.layer = i % Math.max(2, Math.min(5, Math.ceil(open.length / 12))); p.x = random(); p.y = random() * .88; });
    els.feedback.textContent = t("shuffled"); sound("shuffle"); renderRun();
  }

  function isolateBattle(value) { els.battleLive.inert = value; value ? els.battleLive.setAttribute("aria-hidden", "true") : els.battleLive.removeAttribute("aria-hidden"); }
  function openModal(modal, focus) { modal.hidden = false; suspendPendingMatch(); isolateBattle(true); requestAnimationFrame(() => focus?.focus()); }
  function closeModal(modal, focus) {
    modal.hidden = true;
    isolateBattle(false);
    run.paused = false;
    armPendingMatch();
    requestAnimationFrame(() => focus?.focus());
  }
  function trap(event, onEscape) {
    if (event.key === "Escape") { event.preventDefault(); onEscape?.(); return; }
    if (event.key !== "Tab") return;
    const buttons = [...event.currentTarget.querySelectorAll("button:not([hidden]):not(:disabled)")];
    if (!buttons.length) return;
    const first = buttons[0], last = buttons.at(-1);
    if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
  }
  function sound(kind) {
    let volume = 0.8;
    try {
      volume = Math.max(0, Math.min(100, Number(localStorage.getItem("weightPlayEffectsVolume") ?? 80))) / 100;
    } catch {}
    if (!save.sound || volume <= 0) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      const tones = { start:[392,.08],pick:[520,.05],match:[784,.18],crack:[220,.08],reveal:[660,.1],shuffle:[330,.12],undo:[280,.08],hint:[880,.1],win:[988,.35],fail:[170,.28] };
      const [frequency, duration] = tones[kind] || [440,.06], osc = audio.createOscillator(), gain = audio.createGain();
      osc.type = kind === "fail" ? "sawtooth" : "sine"; osc.frequency.value = frequency; gain.gain.setValueAtTime(.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(.0001, .12 * volume), audio.currentTime + .01); gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + duration);
      osc.connect(gain).connect(audio.destination); osc.start(); osc.stop(audio.currentTime + duration + .03);
    } catch {}
  }
  window.addEventListener("wonder:audio-volume-change", event => {
    if (event.detail?.channel !== "effects") return;
    save.sound = Number(event.detail.value) > 0;
    persist();
    renderRun();
  });
  function track(name, data = {}) { try { window.WeightPlayAnalytics?.track?.(name, { game_id: "animal-triple-match", ...data }); } catch {} }

  els.board.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const piece = event.target.closest?.(".piece.free");
    if (!piece) return;
    event.preventDefault();
    if (!ownForegroundInteraction()) return;
    choosePiece(+piece.dataset.piece);
  });
  els.board.addEventListener("click", event => {
    if (event.detail !== 0) return;
    const piece = event.target.closest?.(".piece.free");
    if (piece && ownForegroundInteraction()) choosePiece(+piece.dataset.piece);
  });
  els.startBtn.addEventListener("click", () => setScreen("stage"));
  els.stageBack.addEventListener("click", () => setScreen("main"));
  els.battleBack.addEventListener("click", () => { if (!run || run.ended) return setScreen("stage"); run.paused = true; openModal(els.leaveModal, els.leaveContinue); });
  els.leaveContinue.addEventListener("click", () => closeModal(els.leaveModal, els.battleBack));
  els.leaveStage.addEventListener("click", () => { cancelPendingMatch(); els.leaveModal.hidden = true; isolateBattle(false); run = null; setScreen("stage"); });
  els.helpBtn.addEventListener("click", () => { if (!run) return; run.paused = true; openModal(els.tutorialModal, els.tutorialClose); });
  els.tutorialClose.addEventListener("click", () => { save.tutorial = true; persist(); closeModal(els.tutorialModal, els.helpBtn); });
  els.undoBtn.addEventListener("click", undo); els.magnetBtn.addEventListener("click", magnet); els.shuffleBtn.addEventListener("click", shuffleTool);
  els.retryBtn.addEventListener("click", () => commitResultDecision(() => startBattle(stageIndex, true)));
  els.nextBtn.addEventListener("click", () => commitResultDecision(() => startBattle(Math.min(29, stageIndex + 1), true)));
  els.resultStages.addEventListener("click", () => commitResultDecision(() => { cancelPendingMatch(); els.resultModal.hidden = true; isolateBattle(false); run = null; setScreen("stage"); }));
  els.soundBtn.addEventListener("click", () => { save.sound = !save.sound; persist(); renderRun(); if (save.sound) sound("pick"); });
  els.tutorialModal.addEventListener("keydown", e => trap(e, () => closeModal(els.tutorialModal, els.helpBtn)));
  els.leaveModal.addEventListener("keydown", e => trap(e, () => closeModal(els.leaveModal, els.battleBack)));
  els.resultModal.addEventListener("keydown", e => trap(e));
  window.addEventListener("resize", fitCanvas, { passive: true });
  window.addEventListener("blur", () => { windowFocused = false; suspendPendingMatch(); });
  window.addEventListener("focus", () => { windowFocused = true; armPendingMatch(); });
  window.addEventListener("pagehide", () => { windowFocused = false; suspendPendingMatch(); });
  window.addEventListener("pageshow", () => {
    windowFocused = document.hasFocus();
    if (windowFocused) armPendingMatch();
  });
  document.addEventListener("visibilitychange", () => {
    windowFocused = document.visibilityState === "visible" && document.hasFocus();
    if (windowFocused) armPendingMatch();
    else suspendPendingMatch();
  });

  window.__animalTripleMatchSmoke = {
    stages: Array.from({ length: 30 }, (_, i) => stageConfig(i)),
    startBattle: index => startBattle(index, true),
    snapshot: () => run ? JSON.parse(JSON.stringify(run)) : null,
    forceWin: () => { if (!run) return; run.pieces.forEach(p => { p.active = false; p.tray = false; }); run.tray = []; finish(true); },
    forceFail: () => { if (run) finish(false); },
    setSave: value => { save = { ...save, ...value }; persist(); renderMainProgress(); renderStages(); },
  };

  initLocale(); installLocaleOwnerObservers(); applyLocale(); renderMainProgress(); renderStages();
  Promise.all([...document.images].map(img => img.complete ? Promise.resolve() : new Promise(resolve => { img.addEventListener("load", resolve, { once: true }); img.addEventListener("error", resolve, { once: true }); }))).then(() => { els.loading.hidden = true; });
})();
