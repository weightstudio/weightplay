import './talents.js?v=35';
// Authored gameplay guidance, shared by static routes and the live Main screen.
const copy = {
 en: ['Defend the garden','Stop the approaching enemies before they reach your home.','How to play','Choose a guard, then an empty grass tile. Place a guard before sending the wave.','Watch the incoming lanes. Use ranged guards behind blockers and collect energy to reinforce weak lanes.','Between waves, recall and reposition your guards before starting again.','Tactics','Keep energy in reserve. Use Rally on a threatened lane; stone tiles cannot hold guards.'],
 'zh-Hant':['守住庭院','攔截來襲敵人，別讓牠們抵達家園。','怎麼玩','先選守衛，再點空草地。放好守衛後按迎戰。','查看敵人來路，前排阻擋、後排遠攻，收集能量補強薄弱路線。','每波結束後，撤回並調整守衛，再開始下一波。','布防技巧','保留能量應急；危急時對一路使用集結。石塊格不能放守衛。'],
 'zh-Hans':['守住庭院','拦截来袭敌人，别让它们抵达家园。','怎么玩','先选守卫，再点空草地。放好守卫后按迎战。','查看敌人来路，前排阻挡、后排远攻，收集能量补强薄弱路线。','每波结束后，撤回并调整守卫，再开始下一波。','布防技巧','保留能量应急；危急时对一路使用集结。石块格不能放守卫。'],
 ja:['庭を守ろう','敵が家に着く前に食い止めよう。','遊び方','守衛を選び、空いた草地に配置してから迎撃を開始。','敵の進路を確認。盾役を前、遠距離役を後ろに置き、エネルギーを集めて弱い列を補強。','ウェーブの合間に守衛を撤退・再配置して次へ。','作戦のヒント','緊急用のエネルギーを残し、危険な列で号令を使用。岩には配置できません。'],
 ko:['정원을 지키세요','적이 집에 도착하기 전에 막으세요.','게임 방법','수호자를 고르고 빈 잔디 칸에 배치한 뒤 웨이브를 시작하세요.','적의 진입 경로를 보세요. 앞에는 방어형, 뒤에는 원거리 수호자를 두고 에너지로 약한 경로를 보강하세요.','웨이브 사이에 수호자를 회수하고 재배치한 뒤 다음 웨이브를 시작하세요.','방어 요령','비상 에너지를 남기고 위험한 경로에 집결을 사용하세요. 바위에는 배치할 수 없습니다.'],
 es:['Defiende el jardín','Detén a los enemigos antes de que lleguen a casa.','Cómo jugar','Elige un guardián y una casilla de césped libre. Despliega uno antes de enviar la oleada.','Observa las filas atacadas. Pon bloqueadores delante y atacantes a distancia detrás; recoge energía para reforzar la defensa.','Entre oleadas, retira y recoloca guardianes antes de continuar.','Tácticas','Reserva energía y usa Reagrupar en una fila amenazada. No puedes desplegar sobre rocas.'],
 'pt-BR':['Defenda o jardim','Impeça que os inimigos cheguem à casa.','Como jogar','Escolha um guarda e uma casa de grama vazia. Posicione um antes de iniciar a onda.','Observe as faixas atacadas. Coloque bloqueadores na frente e atiradores atrás; colete energia para reforçar a defesa.','Entre ondas, recolha e reposicione guardas antes de continuar.','Táticas','Guarde energia e use Reagrupar em uma faixa ameaçada. Pedras impedem o posicionamento.'],
 fr:['Défendez le jardin','Arrêtez les ennemis avant qu’ils atteignent la maison.','Comment jouer','Choisissez un gardien et une case d’herbe libre. Placez-en un avant de lancer la vague.','Repérez les lignes attaquées. Placez les bloqueurs devant et les tireurs derrière ; collectez de l’énergie pour renforcer la défense.','Entre les vagues, retirez et replacez les gardiens avant de continuer.','Tactiques','Gardez de l’énergie et utilisez Ralliement sur une ligne menacée. Les rochers interdisent le placement.'],
 de:['Verteidige den Garten','Halte die Gegner auf, bevor sie das Haus erreichen.','So spielst du','Wähle einen Wächter und ein freies Grasfeld. Stelle einen auf, bevor du die Welle startest.','Achte auf angegriffene Reihen. Blocker nach vorne, Fernkämpfer dahinter; sammle Energie für Verstärkung.','Rufe zwischen den Wellen Wächter zurück und stelle sie neu auf.','Taktik','Halte Energie bereit und nutze Sammeln in einer bedrohten Reihe. Auf Felsen können keine Wächter stehen.'],
 it:['Difendi il giardino','Ferma i nemici prima che raggiungano la casa.','Come giocare','Scegli una guardia e una casella erbosa libera. Schierane una prima di avviare l’ondata.','Osserva le corsie attaccate. Metti i difensori davanti e i tiratori dietro; raccogli energia per rinforzare la difesa.','Tra le ondate, ritira e riposiziona le guardie prima di continuare.','Tattiche','Conserva energia e usa Raduno su una corsia minacciata. Non puoi schierare sulle rocce.'],
 ru:['Защитите сад','Остановите врагов, пока они не добрались до дома.','Как играть','Выберите стража и свободную травяную клетку. Поставьте стража перед началом волны.','Следите за рядами атаки. Ставьте защитников впереди, стрелков позади; собирайте энергию для подкрепления.','Между волнами отзывайте и переставляйте стражей, затем продолжайте.','Тактика','Сохраняйте запас энергии и применяйте «Сбор» в опасном ряду. На камнях размещать нельзя.'],
 hi:['बगीचे की रक्षा करें','शत्रुओं को घर पहुँचने से पहले रोकें।','कैसे खेलें','रक्षक चुनें और खाली घास के खाने पर रखें। लहर शुरू करने से पहले एक रक्षक तैनात करें।','हमले की पंक्तियाँ देखें। आगे अवरोधक और पीछे दूर से वार करने वाले रखें; ऊर्जा लेकर कमजोर पंक्तियाँ मजबूत करें।','लहरों के बीच रक्षकों को वापस बुलाकर नई जगह रखें, फिर अगली लहर शुरू करें।','रणनीति','आपातकाल के लिए ऊर्जा बचाएँ और खतरे वाली पंक्ति में एकजुट का उपयोग करें। पत्थर पर रक्षक नहीं रख सकते।'],
 ar:['احمِ الحديقة','أوقف الأعداء قبل وصولهم إلى المنزل.','طريقة اللعب','اختر حارساً ثم خانة عشب فارغة. ضع حارساً قبل بدء الموجة.','راقب مسارات الهجوم. ضع المدافعين في الأمام والرماة خلفهم، واجمع الطاقة لتعزيز المسارات الضعيفة.','بين الموجات، استدعِ الحراس وأعد توزيعهم قبل المتابعة.','نصائح دفاعية','احتفظ بالطاقة للطوارئ واستخدم التجمّع في المسار المهدد. لا يمكن وضع الحراس على الصخور.']
};
const faqHeadings = {
 "en": "FAQ",
 "zh-Hant": "常見問題",
 "zh-Hans": "常见问题",
 "ja": "よくある質問",
 "ko": "자주 묻는 질문",
 "es": "Preguntas frecuentes",
 "pt-BR": "Perguntas frequentes",
 "fr": "FAQ",
 "de": "FAQ",
 "it": "FAQ",
 "ru": "Частые вопросы",
 "hi": "अक्सर पूछे जाने वाले सवाल",
 "ar": "الأسئلة الشائعة"
};
const faq = {
 "en": [
  [
   "How many stages are included?",
   "There are 30 named stages across six regions, with a mechanically different boss every five stages."
  ],
  [
   "Why did the Prism Shell Turtle take so little damage?",
   "Its shining barrier reduces damage while it is closed; focus your defense after the barrier opens."
  ],
  [
   "Can burrowers change lanes?",
   "Yes. They give a clear warning before moving into an adjacent lane."
  ],
  [
   "What does the Sun Thief do?",
   "It steals 12 units of unused sun once, but it does not remove guards that are already placed."
  ],
  [
   "Can I upgrade the animal guards?",
   "Yes. Local coins train your guards. The Fox is an optional shared-diamond unlock and is not required to play."
  ],
  [
   "Is progress saved?",
   "Stage unlocks, clears, scores, medals, coins, and training are saved in this browser."
  ],
  [
   "Does the game work on phones?",
   "Yes. The stage selector uses horizontal dragging, and battles use large tap targets."
  ]
 ],
 "zh-Hant": [
  [
   "遊戲共有多少關？",
   "共有 30 個具名關卡，分成六個區域；每五關會遇到機制不同的頭目。"
  ],
  [
   "為什麼棱鏡甲龜受到的傷害很低？",
   "牠的發亮護盾在閉合時會降低傷害；等護盾打開後再集中火力。"
  ],
  [
   "鑽地型敵人會換路線嗎？",
   "會。牠們會先給出清楚警示，再移動到相鄰路線。"
  ],
  [
   "偷陽光者會做什麼？",
   "牠會一次偷走 12 點尚未使用的陽光，但不會移除已經放置的守衛。"
  ],
  [
   "可以升級動物守衛嗎？",
   "可以。使用本機金幣訓練守衛；狐狸是可選的共用鑽石解鎖，不是遊玩必要條件。"
  ],
  [
   "進度會保存嗎？",
   "關卡解鎖、通關、分數、勳章、金幣與訓練會保存在這個瀏覽器中。"
  ],
  [
   "手機上可以玩嗎？",
   "可以。關卡選擇使用水平拖曳，戰鬥則使用較大的點按區域。"
  ]
 ],
 "zh-Hans": [
  [
   "游戏共有多少关？",
   "共有 30 个命名关卡，分成六个区域；每五关会遇到机制不同的首领。"
  ],
  [
   "为什么棱镜甲龟受到的伤害很低？",
   "它的发光护盾在闭合时会降低伤害；等护盾打开后再集中攻击。"
  ],
  [
   "钻地型敌人会换路线吗？",
   "会。它们会先给出清楚提示，再移动到相邻路线。"
  ],
  [
   "偷阳光者会做什么？",
   "它会一次偷走 12 点尚未使用的阳光，但不会移除已经放置的守卫。"
  ],
  [
   "可以升级动物守卫吗？",
   "可以。使用本地金币训练守卫；狐狸是可选的共享钻石解锁，不是游玩必需条件。"
  ],
  [
   "进度会保存吗？",
   "关卡解锁、通关、分数、勋章、金币与训练会保存在此浏览器中。"
  ],
  [
   "手机上可以玩吗？",
   "可以。关卡选择使用横向拖动，战斗则使用较大的点按区域。"
  ]
 ],
 "ja": [
  [
   "ステージはいくつありますか？",
   "6つの地域に30の名前付きステージがあり、5ステージごとに仕組みの異なるボスが登場します。"
  ],
  [
   "プリズムシェル・タートルへのダメージが少ないのはなぜですか？",
   "光るバリアが閉じている間はダメージが減ります。バリアが開いた後に集中攻撃しましょう。"
  ],
  [
   "地中を進む敵はレーンを変えますか？",
   "はい。隣のレーンへ移動する前に、はっきりした予告が表示されます。"
  ],
  [
   "サンシーフは何をしますか？",
   "未使用のサンを一度だけ12奪いますが、すでに配置した守衛を取り除くことはありません。"
  ],
  [
   "動物の守衛は強化できますか？",
   "はい。ローカルのコインで守衛を訓練できます。キツネは共有ダイヤで任意に解放する守衛で、攻略に必須ではありません。"
  ],
  [
   "進行状況は保存されますか？",
   "ステージの解放、クリア、スコア、メダル、コイン、トレーニングはこのブラウザに保存されます。"
  ],
  [
   "スマートフォンでも遊べますか？",
   "はい。ステージ選択は横ドラッグに対応し、バトルでは大きめのタップ領域を使います。"
  ]
 ],
 "ko": [
  [
   "스테이지는 몇 개인가요?",
   "6개 지역에 이름이 있는 30개 스테이지가 있으며, 5스테이지마다 다른 기믹의 보스가 등장합니다."
  ],
  [
   "프리즘 셸 터틀이 피해를 적게 받는 이유는 무엇인가요?",
   "빛나는 방벽이 닫혀 있을 때는 받는 피해가 줄어듭니다. 방벽이 열린 뒤 집중 공격하세요."
  ],
  [
   "굴을 파는 적은 레인을 바꾸나요?",
   "네. 인접한 레인으로 이동하기 전에 분명한 경고를 보여 줍니다."
  ],
  [
   "선 시프는 무엇을 하나요?",
   "사용하지 않은 태양 12를 한 번 훔치지만, 이미 배치된 수호자를 제거하지는 않습니다."
  ],
  [
   "동물 수호자를 업그레이드할 수 있나요?",
   "네. 로컬 코인으로 수호자를 훈련할 수 있습니다. 여우는 공유 다이아몬드로 선택적으로 해금하며 플레이에 필수는 아닙니다."
  ],
  [
   "진행 상황이 저장되나요?",
   "스테이지 잠금 해제, 클리어, 점수, 메달, 코인과 훈련은 이 브라우저에 저장됩니다."
  ],
  [
   "휴대폰에서도 플레이할 수 있나요?",
   "네. 스테이지 선택은 가로 드래그를 사용하고 전투에는 큰 터치 영역을 사용합니다."
  ]
 ],
 "es": [
  [
   "¿Cuántos niveles incluye el juego?",
   "Hay 30 niveles con nombre repartidos en seis regiones, con un jefe de mecánica distinta cada cinco niveles."
  ],
  [
   "¿Por qué la Tortuga de Caparazón Prisma recibe tan poco daño?",
   "Su barrera brillante reduce el daño mientras está cerrada; concentra el ataque cuando se abra."
  ],
  [
   "¿Los excavadores pueden cambiar de línea?",
   "Sí. Muestran una advertencia clara antes de pasar a una línea adyacente."
  ],
  [
   "¿Qué hace el Ladrón de Sol?",
   "Roba una vez 12 unidades de sol sin gastar, pero no retira guardianes que ya estén colocados."
  ],
  [
   "¿Puedo mejorar a los guardianes animales?",
   "Sí. Las monedas locales entrenan a tus guardianes. El Zorro es un desbloqueo opcional con diamantes compartidos y no es necesario para jugar."
  ],
  [
   "¿Se guarda el progreso?",
   "Los niveles desbloqueados, las victorias, las puntuaciones, las medallas, las monedas y el entrenamiento se guardan en este navegador."
  ],
  [
   "¿Funciona en teléfonos?",
   "Sí. La selección de niveles usa arrastre horizontal y las batallas tienen zonas de toque grandes."
  ]
 ],
 "pt-BR": [
  [
   "Quantas fases o jogo inclui?",
   "São 30 fases nomeadas em seis regiões, com um chefe de mecânica diferente a cada cinco fases."
  ],
  [
   "Por que a Tartaruga Casco Prisma recebe tão pouco dano?",
   "A barreira brilhante reduz o dano enquanto está fechada; ataque com força depois que ela se abrir."
  ],
  [
   "Os escavadores podem trocar de rota?",
   "Sim. Eles mostram um aviso claro antes de passar para uma rota vizinha."
  ],
  [
   "O que o Ladrão de Sol faz?",
   "Ele rouba uma vez 12 unidades de sol não usado, mas não remove guardas que já foram posicionados."
  ],
  [
   "Posso melhorar os guardas animais?",
   "Sim. Moedas locais treinam seus guardas. A Raposa é um desbloqueio opcional com diamantes compartilhados e não é necessária para jogar."
  ],
  [
   "O progresso é salvo?",
   "Desbloqueios de fases, vitórias, pontuações, medalhas, moedas e treinamento ficam salvos neste navegador."
  ],
  [
   "Funciona em celulares?",
   "Sim. A seleção de fases usa arraste horizontal e as batalhas usam áreas de toque grandes."
  ]
 ],
 "fr": [
  [
   "Combien de niveaux sont inclus ?",
   "Le jeu comporte 30 niveaux nommés répartis en six régions, avec un boss aux mécaniques différentes tous les cinq niveaux."
  ],
  [
   "Pourquoi la Tortue à carapace prismatique subit-elle si peu de dégâts ?",
   "Sa barrière lumineuse réduit les dégâts lorsqu’elle est fermée ; concentrez vos attaques après son ouverture."
  ],
  [
   "Les fouisseurs peuvent-ils changer de ligne ?",
   "Oui. Ils affichent un avertissement clair avant de passer sur une ligne voisine."
  ],
  [
   "Que fait le Voleur de soleil ?",
   "Il vole une fois 12 unités de soleil inutilisé, mais ne retire pas les gardiens déjà placés."
  ],
  [
   "Peut-on améliorer les gardiens animaux ?",
   "Oui. Les pièces locales servent à entraîner les gardiens. Le Renard est un déblocage facultatif avec les diamants partagés et n’est pas nécessaire pour jouer."
  ],
  [
   "La progression est-elle sauvegardée ?",
   "Les niveaux débloqués, les victoires, les scores, les médailles, les pièces et l’entraînement sont enregistrés dans ce navigateur."
  ],
  [
   "Le jeu fonctionne-t-il sur téléphone ?",
   "Oui. La sélection des niveaux utilise un glissement horizontal et les combats proposent de grandes zones tactiles."
  ]
 ],
 "de": [
  [
   "Wie viele Stufen gibt es?",
   "Es gibt 30 benannte Stufen in sechs Regionen; nach jeweils fünf Stufen wartet ein Boss mit einer anderen Mechanik."
  ],
  [
   "Warum nimmt die Prismapanzer-Schildkröte so wenig Schaden?",
   "Ihre leuchtende Barriere verringert den Schaden, solange sie geschlossen ist. Nutze das offene Zeitfenster für deine stärkste Verteidigung."
  ],
  [
   "Können Gräber die Bahn wechseln?",
   "Ja. Vor dem Wechsel auf eine benachbarte Bahn zeigen sie eine klare Warnung."
  ],
  [
   "Was macht der Sonnendieb?",
   "Er stiehlt einmal 12 Einheiten ungenutzte Sonne, entfernt aber keine bereits platzierten Wächter."
  ],
  [
   "Kann ich die Tierwächter verbessern?",
   "Ja. Mit lokalen Münzen trainierst du deine Wächter. Der Fuchs ist eine optionale Freischaltung mit geteilten Diamanten und nicht zum Spielen erforderlich."
  ],
  [
   "Wird der Fortschritt gespeichert?",
   "Freigeschaltete Stufen, Abschlüsse, Punkte, Medaillen, Münzen und Training werden in diesem Browser gespeichert."
  ],
  [
   "Funktioniert das Spiel auf Smartphones?",
   "Ja. Die Stufenauswahl nutzt horizontales Ziehen und die Kämpfe verwenden große Tippflächen."
  ]
 ],
 "it": [
  [
   "Quanti livelli include il gioco?",
   "Ci sono 30 livelli con nome divisi in sei regioni, con un boss dalla meccanica diversa ogni cinque livelli."
  ],
  [
   "Perché la Tartaruga Guscio Prisma subisce così pochi danni?",
   "La sua barriera luminosa riduce i danni mentre è chiusa; concentra la difesa quando si apre."
  ],
  [
   "Gli scavatori possono cambiare corsia?",
   "Sì. Mostrano un avviso chiaro prima di spostarsi in una corsia adiacente."
  ],
  [
   "Cosa fa il Ladro di Sole?",
   "Ruba una volta 12 unità di sole non usato, ma non rimuove le guardie già posizionate."
  ],
  [
   "Posso potenziare le guardie animali?",
   "Sì. Le monete locali servono ad allenare le guardie. La Volpe è uno sblocco opzionale con diamanti condivisi e non è necessaria per giocare."
  ],
  [
   "I progressi vengono salvati?",
   "Sblocchi, completamenti, punteggi, medaglie, monete e allenamento vengono salvati in questo browser."
  ],
  [
   "Il gioco funziona sui telefoni?",
   "Sì. La selezione dei livelli usa il trascinamento orizzontale e le battaglie hanno ampie aree di tocco."
  ]
 ],
 "ru": [
  [
   "Сколько этапов в игре?",
   "В игре 30 именных этапов в шести регионах, а каждые пять этапов встречается босс с другой механикой."
  ],
  [
   "Почему Призматическая черепаха получает так мало урона?",
   "Её сияющий барьер снижает урон, пока закрыт; усиливайте защиту после того, как он откроется."
  ],
  [
   "Могут ли роющие враги менять линию?",
   "Да. Перед переходом на соседнюю линию они показывают понятное предупреждение."
  ],
  [
   "Что делает Похититель солнца?",
   "Он один раз крадёт 12 единиц неиспользованного солнца, но не убирает уже размещённых стражей."
  ],
  [
   "Можно ли улучшать животных-стражей?",
   "Да. Локальные монеты используются для тренировки стражей. Лиса — необязательное открытие за общие алмазы и для игры не требуется."
  ],
  [
   "Сохраняется ли прогресс?",
   "Открытые этапы, прохождения, очки, медали, монеты и тренировки сохраняются в этом браузере."
  ],
  [
   "Работает ли игра на телефонах?",
   "Да. Выбор этапа поддерживает горизонтальное перетаскивание, а в бою используются крупные области касания."
  ]
 ],
 "hi": [
  [
   "खेल में कितने चरण हैं?",
   "छह क्षेत्रों में 30 नामित चरण हैं और हर पाँच चरण पर अलग यांत्रिकी वाला बॉस आता है।"
  ],
  [
   "प्रिज़्म शेल टर्टल को इतना कम नुकसान क्यों होता है?",
   "उसकी चमकती ढाल बंद रहने पर नुकसान घटाती है; ढाल खुलने के बाद अपनी रक्षा को मजबूत रखें।"
  ],
  [
   "क्या बिल खोदने वाले दुश्मन लेन बदल सकते हैं?",
   "हाँ। पास वाली लेन में जाने से पहले वे साफ़ चेतावनी देते हैं।"
  ],
  [
   "सन थीफ़ क्या करता है?",
   "वह एक बार 12 यूनिट बची हुई सन चुरा लेता है, लेकिन पहले से रखे रक्षकों को नहीं हटाता।"
  ],
  [
   "क्या पशु रक्षकों को अपग्रेड किया जा सकता है?",
   "हाँ। स्थानीय सिक्कों से रक्षकों को प्रशिक्षित किया जाता है। लोमड़ी साझा डायमंड से मिलने वाला वैकल्पिक अनलॉक है और खेलना उसके बिना भी संभव है।"
  ],
  [
   "क्या प्रगति सहेजी जाती है?",
   "स्टेज अनलॉक, क्लियर, स्कोर, पदक, सिक्के और प्रशिक्षण इसी ब्राउज़र में सहेजे जाते हैं।"
  ],
  [
   "क्या यह फ़ोन पर चलता है?",
   "हाँ। स्टेज चयन में क्षैतिज ड्रैग होता है और लड़ाई में बड़े टैप लक्ष्य दिए गए हैं।"
  ]
 ],
 "ar": [
  [
   "كم عدد المراحل المضمنة؟",
   "تتضمن اللعبة ثلاثين مرحلة مسمّاة عبر ست مناطق، مع زعيم مختلف ميكانيكيًا كل خمس مراحل."
  ],
  [
   "لماذا تعرضت سلحفاة الصدفة المنشورية لأضرار قليلة؟",
   "تقلل حاجزها اللامع الضرر أثناء انغلاقه؛ ركّز دفاعك بعد أن ينفتح."
  ],
  [
   "هل تستطيع الكائنات الحفّارة تغيير الممرات؟",
   "نعم. تطلق تحذيرًا واضحًا قبل انتقالها إلى ممر مجاور."
  ],
  [
   "ماذا يفعل سارق الشمس؟",
   "يسرق 12 وحدة من الشمس غير المستخدمة مرة واحدة، لكنه لا يزيل أي حارس موضوع مسبقًا."
  ],
  [
   "هل يمكن للاعبين ترقية الحيوانات؟",
   "نعم. تدرّب العملات المحلية الحراس، أما الثعلب فهو فتح اختياري بالماس المشترك وليس ضروريًا."
  ],
  [
   "هل يُحفظ التقدم؟",
   "تُحفظ المراحل المفتوحة وعمليات الإكمال والنتائج والميداليات والعملات والتدريب في هذا المتصفح."
  ],
  [
   "هل تعمل اللعبة على الهواتف؟",
   "نعم. يستخدم اختيار المرحلة السحب الأفقي، وتستخدم المعركة مناطق نقر كبيرة."
  ]
 ]
};
const routeSegments = {
 "en": "en",
 "zh-Hant": "zh-tw",
 "zh-Hans": "zh-cn",
 "ja": "ja",
 "ko": "ko",
 "es": "es",
 "pt-BR": "pt-br",
 "fr": "fr",
 "de": "de",
 "it": "it",
 "ru": "ru",
 "hi": "hi",
 "ar": "ar"
};
const related = {
 "en": {
  "heading": "Related games",
  "intro": "Continue with another WeightPlay defense game.",
  "cards": [
   [
    "animal-dice-bastion",
    "Dice Bastion",
    "Merge animal guardians through 30 fortress defenses."
   ],
   [
    "animal-honey-shield",
    "Honey Shield",
    "Draw and repair barriers to protect a dog from bee swarms."
   ]
  ]
 },
 "zh-Hant": {
  "heading": "相關遊戲",
  "intro": "想繼續玩防守玩法，可以試試其他 WeightPlay 遊戲。",
  "cards": [
   [
    "animal-dice-bastion",
    "骰靈堡壘",
    "合併動物守衛，守住 30 場堡壘防線。"
   ],
   [
    "animal-honey-shield",
    "蜂蜜盾",
    "畫出並修補屏障，保護小狗抵擋蜂群。"
   ]
  ]
 },
 "zh-Hans": {
  "heading": "相关游戏",
  "intro": "想继续玩防守玩法，可以试试其他 WeightPlay 游戏。",
  "cards": [
   [
    "animal-dice-bastion",
    "骰灵堡垒",
    "合并动物守卫，守住 30 场堡垒防线。"
   ],
   [
    "animal-honey-shield",
    "蜂蜜盾",
    "画出并修补屏障，保护小狗抵挡蜂群。"
   ]
  ]
 },
 "ja": {
  "heading": "関連ゲーム",
  "intro": "別の WeightPlay 防衛ゲームにも挑戦してみましょう。",
  "cards": [
   [
    "animal-dice-bastion",
    "ダイス砦",
    "動物の守護者を合成し、30の砦防衛を進めます。"
   ],
   [
    "animal-honey-shield",
    "ハニーシールド",
    "線を描いて壁を修復し、ハチの群れから犬を守ります。"
   ]
  ]
 },
 "ko": {
  "heading": "관련 게임",
  "intro": "다른 WeightPlay 방어 게임도 이어서 즐겨 보세요.",
  "cards": [
   [
    "animal-dice-bastion",
    "다이스 요새",
    "동물 수호자를 합쳐 30개의 요새 방어전을 진행하세요."
   ],
   [
    "animal-honey-shield",
    "허니 실드",
    "장벽을 그리고 보수해 벌떼로부터 강아지를 지키세요."
   ]
  ]
 },
 "es": {
  "heading": "Juegos relacionados",
  "intro": "Prueba otro juego de defensa de WeightPlay.",
  "cards": [
   [
    "animal-dice-bastion",
    "Bastión de Dados",
    "Fusiona guardianes animales a lo largo de 30 defensas de fortaleza."
   ],
   [
    "animal-honey-shield",
    "Escudo de Miel",
    "Dibuja y repara barreras para proteger a un perro de enjambres de abejas."
   ]
  ]
 },
 "pt-BR": {
  "heading": "Jogos relacionados",
  "intro": "Continue com outro jogo de defesa da WeightPlay.",
  "cards": [
   [
    "animal-dice-bastion",
    "Bastião dos Dados",
    "Combine guardiões animais em 30 defesas de fortaleza."
   ],
   [
    "animal-honey-shield",
    "Escudo de Mel",
    "Desenhe e repare barreiras para proteger um cão de enxames de abelhas."
   ]
  ]
 },
 "fr": {
  "heading": "Jeux associés",
  "intro": "Continuez avec un autre jeu de défense WeightPlay.",
  "cards": [
   [
    "animal-dice-bastion",
    "Bastion des Dés",
    "Fusionnez des gardiens animaux au fil de 30 défenses de forteresse."
   ],
   [
    "animal-honey-shield",
    "Bouclier de Miel",
    "Tracez et réparez des barrières pour protéger un chien des essaims d’abeilles."
   ]
  ]
 },
 "de": {
  "heading": "Ähnliche Spiele",
  "intro": "Probiere ein weiteres Verteidigungsspiel von WeightPlay.",
  "cards": [
   [
    "animal-dice-bastion",
    "Tierwürfel-Bastion",
    "Verbinde Tierwächter in 30 Festungsverteidigungen."
   ],
   [
    "animal-honey-shield",
    "Honigschild",
    "Zeichne und repariere Barrieren, um einen Hund vor Bienenschwärmen zu schützen."
   ]
  ]
 },
 "it": {
  "heading": "Giochi correlati",
  "intro": "Continua con un altro gioco di difesa WeightPlay.",
  "cards": [
   [
    "animal-dice-bastion",
    "Bastione dei Dadi",
    "Fondi guardiani animali in 30 difese della fortezza."
   ],
   [
    "animal-honey-shield",
    "Scudo di Miele",
    "Disegna e ripara barriere per proteggere un cane dagli sciami di api."
   ]
  ]
 },
 "ru": {
  "heading": "Похожие игры",
  "intro": "Попробуйте ещё одну защитную игру WeightPlay.",
  "cards": [
   [
    "animal-dice-bastion",
    "Бастион Звериных Кубов",
    "Объединяйте животных-стражей в 30 оборонах крепости."
   ],
   [
    "animal-honey-shield",
    "медовый щит",
    "Рисуйте и ремонтируйте барьеры, чтобы защитить собаку от роёв пчёл."
   ]
  ]
 },
 "hi": {
  "heading": "संबंधित खेल",
  "intro": "WeightPlay का एक और रक्षा खेल आज़माएँ।",
  "cards": [
   [
    "animal-dice-bastion",
    "पासा दुर्ग",
    "पशु रक्षकों को मिलाकर 30 किले रक्षा चरण खेलें।"
   ],
   [
    "animal-honey-shield",
    "हनी शील्ड",
    "दीवारें बनाकर और सुधारकर कुत्ते को मधुमक्खियों के झुंड से बचाएँ।"
   ]
  ]
 },
 "ar": {
  "heading": "ألعاب ذات صلة",
  "intro": "جرّب لعبة دفاع أخرى من WeightPlay.",
  "cards": [
   [
    "animal-dice-bastion",
    "حصن نرد",
    "ادمج حراس الحيوانات عبر 30 دفاعًا عن الحصن."
   ],
   [
    "animal-honey-shield",
    "درع العسل الحيواني",
    "ارسم الحواجز وأصلحها لحماية الكلب من أسراب النحل."
   ]
  ]
 }
};
const comparison130Source = "https://www.ea.com/games/plants-vs-zombies/plants-vs-zombies";
const comparison130 = {"en":{"heading":"Similar lane-defense strategy reference","tagsLabel":"Gameplay tags:","tags":["Lane defense","Guard placement","Wave strategy","Resource management"],"shared":"Plants vs. Zombies and Guard Yard both ask you to place defenders across lanes and stop incoming enemies before they reach the protected home. EA’s official Plants vs. Zombies page describes dozens of zombie-fighting plants and changing obstacles such as sunset, fog, and a swimming pool.","diff":"Guard Yard uses five lanes across 30 fixed garden stages with animal guards, automatic energy recovery during combat, recall and repositioning between waves, Rally for a threatened lane, stone tiles that block placement, talents and training, and browser-local progress. It is a compact single-player browser campaign rather than the five-mode plant-defense package described by EA.","disclaimer":"Guard Yard is an independent WeightPlay game. WeightPlay is not affiliated with, endorsed by, licensed by, sponsored by, or co-developing Guard Yard with Electronic Arts, PopCap, or Plants vs. Zombies.","source":"Official source: Electronic Arts — Plants vs. Zombies"},"zh-Hant":{"heading":"相似的路線防守策略玩法參考","tagsLabel":"玩法標籤：","tags":["路線防守","守衛配置","波次策略","資源管理"],"shared":"《Plants vs. Zombies》與《守衛庭院》都要在多條路線配置防守單位，在敵人抵達受保護的家園前攔下來。EA 的 Plants vs. Zombies 官方頁面介紹了數十種對抗殭屍的植物，以及夕陽、濃霧與泳池等會改變戰況的障礙。","diff":"《守衛庭院》則以五條路線與 30 關固定庭院為主，使用動物守衛；戰鬥中能量會自動恢復，每波之間可以撤回並重新配置守衛，危急路線可使用集結，石塊格會限制部署，另有天賦、訓練與瀏覽器本機進度。它是精簡的單人瀏覽器闖關，而不是 EA 所描述的五種模式植物防守內容。","disclaimer":"《守衛庭院》是 WeightPlay 的獨立遊戲。WeightPlay 與 Electronic Arts、PopCap 或 Plants vs. Zombies 沒有隸屬、背書、授權、贊助或共同開發關係。","source":"官方來源：Electronic Arts — Plants vs. Zombies"},"zh-Hans":{"heading":"相似的路线防守策略玩法参考","tagsLabel":"玩法标签：","tags":["路线防守","守卫配置","波次策略","资源管理"],"shared":"Plants vs. Zombies 与《守卫庭院》都要求玩家在多条路线配置防守单位，在敌人抵达受保护的家园前将其拦下。EA 的 Plants vs. Zombies 官方页面介绍了数十种对抗僵尸的植物，以及夕阳、浓雾和泳池等会改变战况的障碍。","diff":"《守卫庭院》则以五条路线和 30 个固定庭院关卡为主，使用动物守卫；战斗中能量自动恢复，每波之间可以撤回并重新配置守卫，危险路线可使用集结，石块格会限制部署，另有天赋、训练和浏览器本地进度。它是精简的单人浏览器闯关，而不是 EA 所描述的五种模式植物防守内容。","disclaimer":"《守卫庭院》是 WeightPlay 的独立游戏。WeightPlay 与 Electronic Arts、PopCap 或 Plants vs. Zombies 不存在隶属、背书、授权、赞助或共同开发关系。","source":"官方来源：Electronic Arts — Plants vs. Zombies"},"ja":{"heading":"似たレーン防衛ストラテジーの参考","tagsLabel":"ゲームプレイタグ：","tags":["レーン防衛","守衛配置","ウェーブ戦略","資源管理"],"shared":"Plants vs. Zombies とガードヤードは、複数のレーンに防衛ユニットを置き、敵が守るべき場所へ到達する前に止める点が共通しています。EA の Plants vs. Zombies 公式ページでは、多数の対ゾンビ植物に加え、夕暮れ、霧、プールなど戦況を変える障害が紹介されています。","diff":"ガードヤードは5レーン・固定30ステージの庭を舞台に動物の守衛を配置します。戦闘中はエネルギーが自動回復し、ウェーブ間に守衛を回収して再配置でき、危険なレーンにはラリーを使えます。岩のマスは配置不可で、才能、訓練、ブラウザ内保存もあります。EA が説明する5モード構成とは異なる、短い一人用ブラウザキャンペーンです。","disclaimer":"ガードヤードは WeightPlay の独立作品です。WeightPlay は Electronic Arts、PopCap、Plants vs. Zombies と提携、推奨、許諾、スポンサー、共同開発の関係にありません。","source":"公式情報：Electronic Arts — Plants vs. Zombies"},"ko":{"heading":"비슷한 레인 방어 전략 게임 참고","tagsLabel":"게임플레이 태그:","tags":["레인 방어","수호자 배치","웨이브 전략","자원 관리"],"shared":"Plants vs. Zombies와 Animal Guard Yard는 여러 레인에 방어 유닛을 배치하고 적이 보호 대상에 도달하기 전에 막는다는 공통점이 있습니다. EA의 Plants vs. Zombies 공식 페이지는 수십 종의 좀비 대응 식물과 해질녘, 안개, 수영장처럼 전투 조건을 바꾸는 장애물을 소개합니다.","diff":"Animal Guard Yard는 5개 레인과 고정된 30개 정원 스테이지에서 동물 수호자를 사용합니다. 전투 중 에너지가 자동 회복되고, 웨이브 사이에 수호자를 회수해 재배치할 수 있으며, 위험한 레인에는 집결을 사용할 수 있습니다. 바위 칸은 배치를 막고, 특성·훈련·브라우저 로컬 진행도도 있습니다. EA가 설명하는 5개 모드의 식물 방어 구성과는 다른 짧은 1인용 브라우저 캠페인입니다.","disclaimer":"Animal Guard Yard는 WeightPlay의 독립 게임입니다. WeightPlay는 Electronic Arts, PopCap 또는 Plants vs. Zombies와 제휴, 보증, 라이선스, 후원 또는 공동 개발 관계가 없습니다.","source":"공식 출처: Electronic Arts — Plants vs. Zombies"},"es":{"heading":"Referencia de estrategia similar de defensa por líneas","tagsLabel":"Etiquetas de jugabilidad:","tags":["Defensa por líneas","Colocación de guardianes","Estrategia por oleadas","Gestión de recursos"],"shared":"Plants vs. Zombies y Guardianes del Jardín comparten una idea clara: colocar defensores en varias líneas y detener a los enemigos antes de que alcancen la zona protegida. La página oficial de Plants vs. Zombies de EA describe decenas de plantas contra zombis y obstáculos cambiantes como el atardecer, la niebla y una piscina.","diff":"Guardianes del Jardín usa cinco líneas y 30 niveles de jardín fijos con guardianes animales. La energía se recupera automáticamente durante el combate, entre oleadas puedes retirar y recolocar guardianes, Reagrupar ayuda en una línea amenazada y las rocas bloquean casillas. También hay talentos, entrenamiento y progreso local del navegador. Es una campaña individual y compacta, no el paquete de cinco modos que describe EA.","disclaimer":"Guardianes del Jardín es un juego independiente de WeightPlay. WeightPlay no está afiliado, respaldado, licenciado, patrocinado ni desarrollado conjuntamente con Electronic Arts, PopCap o Plants vs. Zombies.","source":"Fuente oficial: Electronic Arts — Plants vs. Zombies"},"pt-BR":{"heading":"Referência de estratégia semelhante de defesa por rotas","tagsLabel":"Tags de jogabilidade:","tags":["Defesa por rotas","Posicionamento de guardas","Estratégia por ondas","Gestão de recursos"],"shared":"Plants vs. Zombies e Guard Yard compartilham uma ideia central: posicionar defensores em várias rotas e impedir que os inimigos alcancem a área protegida. A página oficial de Plants vs. Zombies da EA descreve dezenas de plantas contra zumbis e obstáculos como pôr do sol, neblina e piscina.","diff":"Guard Yard usa cinco rotas e 30 fases fixas de jardim com guardas animais. A energia se recupera automaticamente durante o combate, os guardas podem ser recolhidos e reposicionados entre ondas, Reagrupar ajuda uma rota ameaçada e pedras bloqueiam casas. Há também talentos, treinamento e progresso salvo localmente no navegador. É uma campanha curta para um jogador, não o conjunto de cinco modos descrito pela EA.","disclaimer":"Guard Yard é um jogo independente da WeightPlay. A WeightPlay não é afiliada, endossada, licenciada, patrocinada nem desenvolve Guard Yard em conjunto com Electronic Arts, PopCap ou Plants vs. Zombies.","source":"Fonte oficial: Electronic Arts — Plants vs. Zombies"},"fr":{"heading":"Référence de stratégie similaire de défense par lignes","tagsLabel":"Tags de gameplay :","tags":["Défense par lignes","Placement des gardiens","Stratégie de vagues","Gestion des ressources"],"shared":"Plants vs. Zombies et Guard Yard reposent tous deux sur le placement de défenseurs sur plusieurs lignes afin d’arrêter les ennemis avant qu’ils atteignent la zone protégée. La page officielle de Plants vs. Zombies d’EA présente des dizaines de plantes anti-zombies et des obstacles comme le coucher du soleil, le brouillard et une piscine.","diff":"Guard Yard utilise cinq lignes et 30 niveaux de jardin fixes avec des gardiens animaux. L’énergie se régénère automatiquement pendant le combat, les gardiens peuvent être retirés et replacés entre les vagues, Ralliement aide une ligne menacée et les rochers bloquent certaines cases. Talents, entraînement et progression locale au navigateur complètent la campagne. C’est une aventure solo compacte, pas l’ensemble de cinq modes décrit par EA.","disclaimer":"Guard Yard est un jeu indépendant de WeightPlay. WeightPlay n’est ni affilié, ni approuvé, ni licencié, ni sponsorisé, ni codéveloppé avec Electronic Arts, PopCap ou Plants vs. Zombies.","source":"Source officielle : Electronic Arts — Plants vs. Zombies"},"de":{"heading":"Vergleich mit ähnlicher Lane-Defense-Strategie","tagsLabel":"Gameplay-Tags:","tags":["Lane Defense","Wächter platzieren","Wellenstrategie","Ressourcenverwaltung"],"shared":"Plants vs. Zombies und Animal Guard Yard haben denselben Grundgedanken: Verteidiger auf mehreren Bahnen platzieren und Gegner stoppen, bevor sie den geschützten Bereich erreichen. Die offizielle Plants-vs.-Zombies-Seite von EA nennt Dutzende Pflanzen gegen Zombies sowie Hindernisse wie Sonnenuntergang, Nebel und ein Schwimmbecken.","diff":"Animal Guard Yard nutzt fünf Bahnen und 30 feste Gartenstufen mit tierischen Wächtern. Energie regeneriert im Kampf automatisch, Wächter können zwischen Wellen zurückgerufen und neu platziert werden, Sammeln hilft einer bedrohten Bahn und Felsen blockieren Felder. Dazu kommen Talente, Training und lokaler Browser-Fortschritt. Es ist eine kompakte Einzelspieler-Kampagne statt des von EA beschriebenen Pakets mit fünf Modi.","disclaimer":"Animal Guard Yard ist ein unabhängiges WeightPlay-Spiel. WeightPlay ist weder mit Electronic Arts, PopCap oder Plants vs. Zombies verbunden noch von ihnen unterstützt, lizenziert, gesponsert oder gemeinsam entwickelt.","source":"Offizielle Quelle: Electronic Arts — Plants vs. Zombies"},"it":{"heading":"Riferimento a una simile strategia di difesa per corsie","tagsLabel":"Tag di gioco:","tags":["Difesa per corsie","Posizionamento guardie","Strategia a ondate","Gestione risorse"],"shared":"Plants vs. Zombies e Animal Guard Yard condividono un’idea centrale: posizionare difensori su più corsie e fermare i nemici prima che raggiungano l’area protetta. La pagina ufficiale di Plants vs. Zombies di EA descrive decine di piante anti-zombi e ostacoli variabili come tramonto, nebbia e piscina.","diff":"Animal Guard Yard usa cinque corsie e 30 livelli fissi nel giardino con guardie animali. L’energia si rigenera automaticamente durante il combattimento, tra le ondate puoi ritirare e riposizionare le guardie, Raduno aiuta una corsia minacciata e le rocce bloccano alcune caselle. Sono presenti anche talenti, allenamento e progressi locali del browser. È una campagna singolo giocatore compatta, non il pacchetto di cinque modalità descritto da EA.","disclaimer":"Animal Guard Yard è un gioco indipendente di WeightPlay. WeightPlay non è affiliata, approvata, licenziata, sponsorizzata né sviluppa Animal Guard Yard con Electronic Arts, PopCap o Plants vs. Zombies.","source":"Fonte ufficiale: Electronic Arts — Plants vs. Zombies"},"ru":{"heading":"Сравнение с похожей стратегией защиты линий","tagsLabel":"Теги игрового процесса:","tags":["Защита линий","Расстановка стражей","Стратегия волн","Управление ресурсами"],"shared":"Plants vs. Zombies и Animal Guard Yard объединяет одна основа: нужно расставлять защитников на нескольких линиях и останавливать врагов до того, как они достигнут защищаемой зоны. На официальной странице Plants vs. Zombies EA описывает десятки растений против зомби и препятствия вроде заката, тумана и бассейна.","diff":"В Animal Guard Yard пять линий и 30 фиксированных садовых этапов с животными-стражами. Энергия автоматически восстанавливается в бою, между волнами стражей можно отзывать и переставлять, «Сбор» помогает опасной линии, а камни блокируют клетки. Есть таланты, тренировки и локальный прогресс браузера. Это компактная одиночная браузерная кампания, а не набор из пяти режимов, описанный EA.","disclaimer":"Animal Guard Yard — независимая игра WeightPlay. WeightPlay не аффилирована с Electronic Arts, PopCap или Plants vs. Zombies и не имеет с ними отношений одобрения, лицензирования, спонсорства или совместной разработки.","source":"Официальный источник: Electronic Arts — Plants vs. Zombies"},"hi":{"heading":"मिलती-जुलती लेन-डिफेंस रणनीति का संदर्भ","tagsLabel":"गेमप्ले टैग:","tags":["लेन रक्षा","रक्षक तैनाती","लहर रणनीति","संसाधन प्रबंधन"],"shared":"Plants vs. Zombies और Animal Guard Yard दोनों में कई लेन पर रक्षक तैनात करके आने वाले दुश्मनों को सुरक्षित क्षेत्र तक पहुँचने से पहले रोकना होता है। EA के आधिकारिक Plants vs. Zombies पेज में दर्जनों ज़ॉम्बी-विरोधी पौधों और सूर्यास्त, धुंध तथा स्विमिंग पूल जैसी बदलती बाधाओं का वर्णन है।","diff":"Animal Guard Yard में पाँच लेन और 30 तय बगीचा चरण हैं, जिनमें पशु रक्षक इस्तेमाल होते हैं। लड़ाई में ऊर्जा अपने आप लौटती है, लहरों के बीच रक्षकों को वापस बुलाकर नई जगह रखा जा सकता है, खतरे वाली लेन में Rally काम आता है और पत्थर वाले खाने तैनाती रोकते हैं। प्रतिभाएँ, प्रशिक्षण और ब्राउज़र-स्थानीय प्रगति भी है। यह EA द्वारा बताए गए पाँच मोड वाले पैकेज की जगह एक छोटा एकल-खिलाड़ी ब्राउज़र अभियान है।","disclaimer":"Animal Guard Yard, WeightPlay का स्वतंत्र गेम है। WeightPlay का Electronic Arts, PopCap या Plants vs. Zombies से कोई संबद्धता, समर्थन, लाइसेंस, प्रायोजन या संयुक्त विकास संबंध नहीं है।","source":"आधिकारिक स्रोत: Electronic Arts — Plants vs. Zombies"},"ar":{"heading":"مرجع لاستراتيجية مشابهة للدفاع عبر المسارات","tagsLabel":"وسوم أسلوب اللعب:","tags":["دفاع عبر المسارات","توزيع الحراس","استراتيجية الموجات","إدارة الموارد"],"shared":"تشترك Plants vs. Zombies و«ساحة حراس الحيوانات» في فكرة أساسية: توزيع وحدات دفاعية على عدة مسارات وإيقاف الأعداء قبل وصولهم إلى المنطقة المحمية. تصف صفحة Plants vs. Zombies الرسمية من EA عشرات النباتات المضادة للزومبي وعقبات متغيرة مثل الغروب والضباب وحوض السباحة.","diff":"تستخدم «ساحة حراس الحيوانات» خمسة مسارات و30 مرحلة حديقة ثابتة مع حراس حيوانات. تتجدد الطاقة تلقائيًا أثناء القتال، ويمكن استدعاء الحراس وإعادة توزيعهم بين الموجات، ويساعد «التجمّع» المسار المهدد، بينما تمنع الصخور وضع الحراس على بعض الخانات. توجد أيضًا مواهب وتدريب وتقدم محفوظ محليًا في المتصفح. إنها حملة فردية مدمجة وليست حزمة الأنماط الخمسة التي تصفها EA.","disclaimer":"«ساحة حراس الحيوانات» لعبة مستقلة من WeightPlay. لا توجد علاقة تبعية أو اعتماد أو ترخيص أو رعاية أو تطوير مشترك بين WeightPlay وElectronic Arts أو PopCap أو Plants vs. Zombies.","source":"المصدر الرسمي: Electronic Arts — Plants vs. Zombies"}};
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function guardYardGuide(locale) {
 const row=copy[locale];
 if (!row) throw new Error(`Missing Guard Yard guide locale: ${locale}`);
 const [title,summary,how,a,,c,tactics,tip]=row;
 const talent = key => globalThis.GuardYardTalents.text(locale,key);
 const b=talent('income');
 const entries = faq[locale] || faq.en;
 const faqSection = `<div class="game-info-section"><h3>${escape(faqHeadings[locale] || faqHeadings.en)}</h3><dl>${entries.map(([question, answer]) => `<div><dt>${escape(question)}</dt><dd>${escape(answer)}</dd></div>`).join('')}</dl></div>`;
 const rel = related[locale] || related.en;
 const segment = routeSegments[locale] || 'en';
 const relatedSection = '<div class="game-info-section game-info-related-section"><h3>' + escape(rel.heading) + '</h3><p>' + escape(rel.intro) + '</p><div class="game-info-related">' + rel.cards.map(([id, cardTitle, description]) => '<a class="game-info-related-card" href="/' + segment + '/games/' + id + '/"><span class="game-info-related-copy"><strong>' + escape(cardTitle) + '</strong><span>' + escape(description) + '</span></span></a>').join('') + '</div></div>';
 const market = comparison130[locale] || comparison130.en;
 const comparisonSection = `<article class="game-info-section" data-wp-market-comparison="1.3.0" data-comparison-locale="${escape(locale)}" data-runtime-localize="off" aria-label="${escape(market.heading)}"><h3 data-comparison-heading>${escape(market.heading)}</h3><p><strong data-comparison-tags-label>${escape(market.tagsLabel)}</strong></p><div class="game-info-tags" data-wp-gameplay-tags="1.3.0" data-comparison-tags>${market.tags.map(tag=>`<span>${escape(tag)}</span>`).join('')}</div><p data-comparison-shared>${escape(market.shared)}</p><p data-comparison-diff>${escape(market.diff)}</p><p data-comparison-disclaimer>${escape(market.disclaimer)}</p><p><a data-comparison-source href="${escape(comparison130Source)}" rel="noopener noreferrer">${escape(market.source)}</a></p></article>`;

 return `<section id="guardYardGuide" class="game-page-info game-page-info-static" data-wp-game-guide data-runtime-localize="off"><h2>${escape(title)}</h2><p>${escape(summary)}</p><div class="game-info-sections"><div class="game-info-section"><h3>${escape(how)}</h3><ol>${[a,b,c].map(s=>`<li>${escape(s)}</li>`).join('')}</ol></div><div class="game-info-section"><h3>${escape(tactics)}</h3><p>${escape(tip)}</p></div><div class="game-info-section"><h3>${escape(talent("talents"))}</h3><p>${escape(talent("hint"))}</p></div>${faqSection}${relatedSection}${comparisonSection}</div></section>`;
}
