(() => {
  "use strict";
  const copy = {
    en: {
      ui: {gateLabelClosed:"Closed Sun Gate, row {row}, column {col}",gateLabelOpen:"Open Sun Gate, row {row}, column {col}",gateInstruction:"Open every Sun Gate, then route all beams to the flower.",gateBlocked:"A closed Sun Gate is stopping this beam.",gateHint:"Try opening the Sun Gate at row {row}, column {col}.",guideBody:"Turn mirrors and tap closed Sun Gates to open them. Light moves cell by cell and stops at the flower, edge, loop, or closed gate."},
      system:"Sun Gates start closed. Tap each one to open it; open gates pass light straight through, and every gate must be open to clear the garden.",
      how:"When a garden has Sun Gates, open every gate and then check that each beam reaches the lotus.",
      progression:"Garden 5 introduces Sun Gates. The six checkpoint gardens (5, 10, 15, 20, 25, and 30) combine one to four gates with route puzzles, dual suns, and decoy mirrors; opening a gate counts as a turn.",
      faq:["Why did light stop at a Sun Gate?","That gate is closed. Tap it to open the straight path; every Sun Gate must be open before the garden clears."]
    },
    "zh-Hant": {
      ui:{gateLabelClosed:"關閉的日光閘門，第{row}列第{col}欄",gateLabelOpen:"開啟的日光閘門，第{row}列第{col}欄",gateInstruction:"開啟所有日光閘門，再調整鏡面，讓每道光束都照到花朵。",gateBlocked:"關閉的日光閘門擋住了這道光。",gateHint:"試著開啟第{row}列、第{col}欄的日光閘門。",guideBody:"轉動鏡面，並點擊關閉的日光閘門將它開啟。光束逐格前進；蓮花、邊界、循環或關閉的閘門都會使它停止。"},
      system:"日光閘門開局時關閉。點擊閘門即可開啟，光束會直行通過；花園完成前必須開啟所有閘門。",
      how:"遇到日光閘門時，先開啟每一道閘門，再確認所有光束都照到蓮花。",
      progression:"第 5 座花園首次加入日光閘門。第 5、10、15、20、25、30 關是檢查點，會逐步組合 1 至 4 道閘門、雙太陽與誘餌鏡面；開啟閘門也算一次操作。",
      faq:["光束為什麼停在日光閘門？","那道閘門仍是關閉狀態。點擊即可打開直通路徑；完成花園前必須開啟所有日光閘門。"]
    },
    "zh-Hans": {
      ui:{gateLabelClosed:"关闭的日光闸门，第{row}行第{col}列",gateLabelOpen:"开启的日光闸门，第{row}行第{col}列",gateInstruction:"开启所有日光闸门，再调整镜面，让每道光束都照到花朵。",gateBlocked:"关闭的日光闸门挡住了这道光。",gateHint:"试着开启第{row}行、第{col}列的日光闸门。",guideBody:"转动镜面，并点击关闭的日光闸门将它开启。光束逐格前进；莲花、边界、循环或关闭的闸门都会使它停止。"},
      system:"日光闸门开局时关闭。点击闸门即可开启，光束会直行通过；花园完成前必须开启所有闸门。",
      how:"遇到日光闸门时，先开启每一道闸门，再确认所有光束都照到莲花。",
      progression:"第 5 座花园首次加入日光闸门。第 5、10、15、20、25、30 关是检查点，会逐步组合 1 至 4 道闸门、双太阳与诱饵镜面；开启闸门也算一次操作。",
      faq:["光束为什么停在日光闸门？","那道闸门仍处于关闭状态。点击即可打开直通路径；完成花园前必须开启所有日光闸门。"]
    },
    ja: {
      ui:{gateLabelClosed:"閉じたサンゲート、{row}行{col}列",gateLabelOpen:"開いたサンゲート、{row}行{col}列",gateInstruction:"すべてのサンゲートを開き、鏡で全ての光を花まで導きましょう。",gateBlocked:"閉じたサンゲートが光を止めています。",gateHint:"{row}行{col}列のサンゲートを開いてみましょう。",guideBody:"鏡を回し、閉じたサンゲートをタップして開きます。光は1マスずつ進み、花、外周、ループ、閉じたゲートで止まります。"},
      system:"サンゲートは閉じた状態で始まります。タップすると開き、光は直進します。クリアにはすべてのゲートを開く必要があります。",
      how:"サンゲートがある庭では、すべてのゲートを開いてから全ての光がハスに届くか確認しましょう。",
      progression:"庭5でサンゲートが初登場します。庭5・10・15・20・25・30はチェックポイントで、1〜4個のゲートを二光源やおとり鏡と組み合わせます。ゲートを開く操作も1手です。",
      faq:["サンゲートで光が止まるのはなぜ？","そのゲートは閉じています。タップすると光が直進できるようになります。クリアするには全ゲートを開きます。"]
    },
    ko: {
      ui:{gateLabelClosed:"닫힌 햇빛 문, {row}행 {col}열",gateLabelOpen:"열린 햇빛 문, {row}행 {col}열",gateInstruction:"햇빛 문을 모두 열고 거울을 돌려 모든 빛을 꽃까지 보내세요.",gateBlocked:"닫힌 햇빛 문이 이 빛을 막고 있어요.",gateHint:"{row}행 {col}열의 햇빛 문을 열어 보세요.",guideBody:"거울을 돌리고 닫힌 햇빛 문을 눌러 여세요. 빛은 한 칸씩 이동하며 꽃, 가장자리, 반복 경로 또는 닫힌 문에서 멈춥니다."},
      system:"햇빛 문은 닫힌 상태로 시작합니다. 누르면 열려 빛이 곧게 통과하며, 정원을 완료하려면 모든 문을 열어야 합니다.",
      how:"햇빛 문이 있는 정원에서는 모든 문을 연 다음 각 빛이 연꽃에 닿는지 확인하세요.",
      progression:"5번째 정원에서 햇빛 문이 처음 등장합니다. 5·10·15·20·25·30번째 정원은 점검 정원으로, 문 1~4개를 두 태양과 미끼 거울에 조합합니다. 문을 여는 것도 한 번의 이동입니다.",
      faq:["햇빛 문에서 빛이 왜 멈추나요?","문이 닫혀 있기 때문입니다. 눌러 열면 빛이 곧게 지나갑니다. 완료하려면 모든 햇빛 문을 열어야 합니다."]
    },
    es: {
      ui:{gateLabelClosed:"Puerta solar cerrada, fila {row}, columna {col}",gateLabelOpen:"Puerta solar abierta, fila {row}, columna {col}",gateInstruction:"Abre todas las puertas solares y guía cada rayo hasta la flor.",gateBlocked:"Una puerta solar cerrada está deteniendo este rayo.",gateHint:"Prueba a abrir la puerta solar de la fila {row}, columna {col}.",guideBody:"Gira los espejos y toca las puertas solares cerradas para abrirlas. La luz avanza casilla a casilla y se detiene en la flor, el borde, un bucle o una puerta cerrada."},
      system:"Las puertas solares empiezan cerradas. Tócalas para abrirlas; la luz cruza en línea recta por una puerta abierta y todas deben estar abiertas para superar el jardín.",
      how:"Si un jardín tiene puertas solares, abre todas y comprueba después que cada rayo llegue al loto.",
      progression:"El jardín 5 introduce las puertas solares. Los jardines de control 5, 10, 15, 20, 25 y 30 combinan de una a cuatro puertas con rutas, dos soles y espejos señuelo; abrir una puerta cuenta como un movimiento.",
      faq:["¿Por qué se detuvo la luz en una puerta solar?","Esa puerta está cerrada. Tócala para abrir el paso recto; todas deben estar abiertas para completar el jardín."]
    },
    "pt-BR": {
      ui:{gateLabelClosed:"Portão solar fechado, linha {row}, coluna {col}",gateLabelOpen:"Portão solar aberto, linha {row}, coluna {col}",gateInstruction:"Abra todos os portões solares e guie cada raio até a flor.",gateBlocked:"Um portão solar fechado está parando este raio.",gateHint:"Tente abrir o portão solar da linha {row}, coluna {col}.",guideBody:"Gire os espelhos e toque nos portões solares fechados para abri-los. A luz avança casa a casa e para na flor, na borda, em um ciclo ou em um portão fechado."},
      system:"Os portões solares começam fechados. Toque para abrir; a luz segue em linha reta por um portão aberto, e todos precisam estar abertos para concluir o jardim.",
      how:"Se o jardim tiver portões solares, abra todos e depois confira se cada raio alcança o lótus.",
      progression:"O Jardim 5 apresenta os portões solares. Os desafios dos Jardins 5, 10, 15, 20, 25 e 30 combinam de um a quatro portões com rotas, dois sóis e espelhos-isca; abrir um portão conta como uma jogada.",
      faq:["Por que a luz parou em um portão solar?","Esse portão está fechado. Toque para abrir a passagem reta; todos precisam estar abertos para concluir o jardim."]
    },
    fr: {
      ui:{gateLabelClosed:"Portail solaire fermé, ligne {row}, colonne {col}",gateLabelOpen:"Portail solaire ouvert, ligne {row}, colonne {col}",gateInstruction:"Ouvrez tous les portails solaires et guidez chaque rayon jusqu’à la fleur.",gateBlocked:"Un portail solaire fermé arrête ce rayon.",gateHint:"Essayez d’ouvrir le portail solaire en ligne {row}, colonne {col}.",guideBody:"Tournez les miroirs et touchez les portails solaires fermés pour les ouvrir. La lumière avance case par case et s’arrête à la fleur, au bord, dans une boucle ou devant un portail fermé."},
      system:"Les portails solaires sont fermés au départ. Touchez-les pour les ouvrir ; la lumière les traverse en ligne droite et ils doivent tous être ouverts pour terminer le jardin.",
      how:"Si le jardin contient des portails solaires, ouvrez-les tous puis vérifiez que chaque rayon atteint le lotus.",
      progression:"Le jardin 5 introduit les portails solaires. Les jardins de contrôle 5, 10, 15, 20, 25 et 30 combinent un à quatre portails avec des parcours, deux soleils et des miroirs leurres ; ouvrir un portail compte comme un coup.",
      faq:["Pourquoi la lumière s’est-elle arrêtée au portail solaire ?","Ce portail est fermé. Touchez-le pour ouvrir le passage droit ; tous les portails doivent être ouverts pour terminer le jardin."]
    },
    de: {
      ui:{gateLabelClosed:"Geschlossenes Sonnentor, Zeile {row}, Spalte {col}",gateLabelOpen:"Offenes Sonnentor, Zeile {row}, Spalte {col}",gateInstruction:"Öffne alle Sonnentore und leite jeden Lichtstrahl zur Blume.",gateBlocked:"Ein geschlossenes Sonnentor hält diesen Lichtstrahl auf.",gateHint:"Öffne das Sonnentor in Zeile {row}, Spalte {col}.",guideBody:"Drehe Spiegel und tippe geschlossene Sonnentore an, um sie zu öffnen. Licht wandert Feld für Feld und endet an der Blume, am Rand, in einer Schleife oder vor einem geschlossenen Tor."},
      system:"Sonnentore sind anfangs geschlossen. Tippe darauf, um sie zu öffnen; Licht läuft gerade hindurch. Zum Abschluss müssen alle Tore offen sein.",
      how:"Öffne in Gärten mit Sonnentoren jedes Tor und prüfe anschließend, ob alle Strahlen die Lotusblüte erreichen.",
      progression:"Garten 5 führt Sonnentore ein. Die Checkpoint-Gärten 5, 10, 15, 20, 25 und 30 kombinieren ein bis vier Tore mit Routen, zwei Sonnen und Täuschungsspiegeln; Öffnen zählt als Zug.",
      faq:["Warum stoppt Licht an einem Sonnentor?","Das Tor ist geschlossen. Tippe darauf, um den geraden Weg zu öffnen; zum Abschluss müssen alle Sonnentore offen sein."]
    },
    it: {
      ui:{gateLabelClosed:"Portale solare chiuso, riga {row}, colonna {col}",gateLabelOpen:"Portale solare aperto, riga {row}, colonna {col}",gateInstruction:"Apri tutti i portali solari e guida ogni raggio fino al fiore.",gateBlocked:"Un portale solare chiuso sta fermando questo raggio.",gateHint:"Prova ad aprire il portale solare alla riga {row}, colonna {col}.",guideBody:"Ruota gli specchi e tocca i portali solari chiusi per aprirli. La luce avanza casella per casella e si ferma al fiore, al bordo, in un ciclo o davanti a un portale chiuso."},
      system:"I portali solari iniziano chiusi. Tocca per aprirli: la luce passa dritta in un portale aperto e per completare il giardino devono essere tutti aperti.",
      how:"Se il giardino contiene portali solari, aprili tutti e poi verifica che ogni raggio raggiunga il loto.",
      progression:"Il Giardino 5 introduce i portali solari. I checkpoint 5, 10, 15, 20, 25 e 30 combinano da uno a quattro portali con percorsi, due soli e specchi-esca; aprire un portale conta come mossa.",
      faq:["Perché la luce si è fermata a un portale solare?","Quel portale è chiuso. Toccalo per aprire il passaggio dritto; tutti i portali devono essere aperti per completare il giardino."]
    },
    ru: {
      ui:{gateLabelClosed:"Закрытые солнечные ворота, ряд {row}, столбец {col}",gateLabelOpen:"Открытые солнечные ворота, ряд {row}, столбец {col}",gateInstruction:"Откройте все солнечные ворота и направьте каждый луч к цветку.",gateBlocked:"Закрытые солнечные ворота остановили этот луч.",gateHint:"Откройте солнечные ворота в ряду {row}, столбце {col}.",guideBody:"Поворачивайте зеркала и нажимайте закрытые солнечные ворота, чтобы открыть их. Луч идёт по клеткам и останавливается у цветка, края, петли или закрытых ворот."},
      system:"Солнечные ворота изначально закрыты. Нажмите на них, чтобы открыть; через открытые ворота луч идёт прямо. Для победы нужно открыть все ворота.",
      how:"Если в саду есть солнечные ворота, откройте каждое и проверьте, что все лучи достигли лотоса.",
      progression:"В саду 5 впервые появляются солнечные ворота. Контрольные сады 5, 10, 15, 20, 25 и 30 сочетают от одних до четырёх ворот с маршрутами, двумя солнцами и ложными зеркалами; открытие ворот считается ходом.",
      faq:["Почему свет остановился у солнечных ворот?","Ворота закрыты. Нажмите на них, чтобы открыть прямой путь; для завершения сада должны быть открыты все ворота."]
    },
    hi: {
      ui:{gateLabelClosed:"बंद सूर्य-द्वार, पंक्ति {row}, स्तंभ {col}",gateLabelOpen:"खुला सूर्य-द्वार, पंक्ति {row}, स्तंभ {col}",gateInstruction:"सभी सूर्य-द्वार खोलें और हर किरण को फूल तक पहुँचाएँ।",gateBlocked:"बंद सूर्य-द्वार इस किरण को रोक रहा है।",gateHint:"पंक्ति {row}, स्तंभ {col} का सूर्य-द्वार खोलें।",guideBody:"दर्पण घुमाएँ और बंद सूर्य-द्वार को खोलने के लिए टैप करें। प्रकाश एक-एक खाने चलता है और फूल, किनारे, चक्र या बंद द्वार पर रुकता है।"},
      system:"सूर्य-द्वार बंद अवस्था में शुरू होते हैं। उन्हें खोलने के लिए टैप करें; खुला द्वार प्रकाश को सीधा जाने देता है और बगीचा पूरा करने के लिए सभी द्वार खुले होने चाहिए।",
      how:"जिस बगीचे में सूर्य-द्वार हों, उनमें हर द्वार खोलें और फिर देखें कि सभी किरणें कमल तक पहुँचती हैं।",
      progression:"बगीचा 5 सूर्य-द्वार का परिचय देता है। 5, 10, 15, 20, 25 और 30 के चेकपॉइंट बगीचे एक से चार द्वारों को रास्तों, दो सूर्यों और नकली दर्पणों के साथ जोड़ते हैं; द्वार खोलना एक चाल है।",
      faq:["सूर्य-द्वार पर रोशनी क्यों रुक गई?","वह द्वार बंद है। सीधा रास्ता खोलने के लिए टैप करें; बगीचा पूरा करने से पहले सभी द्वार खोलें।"]
    },
    ar: {
      ui:{gateLabelClosed:"بوابة شمسية مغلقة، الصف {row}، العمود {col}",gateLabelOpen:"بوابة شمسية مفتوحة، الصف {row}، العمود {col}",gateInstruction:"افتح كل البوابات الشمسية ووجّه كل شعاع إلى الزهرة.",gateBlocked:"أوقفت بوابة شمسية مغلقة هذا الشعاع.",gateHint:"جرّب فتح البوابة الشمسية في الصف {row}، العمود {col}.",guideBody:"أدر المرايا واضغط البوابات الشمسية المغلقة لفتحها. يتحرك الضوء خانةً خانة ويتوقف عند الزهرة أو الحافة أو الحلقة أو البوابة المغلقة."},
      system:"تبدأ البوابات الشمسية مغلقة. اضغط لفتحها؛ يمر الضوء مستقيمًا عبر البوابة المفتوحة، ويجب فتحها كلها لإكمال الحديقة.",
      how:"إذا احتوت الحديقة على بوابات شمسية، فافتحها كلها ثم تأكد من وصول كل شعاع إلى اللوتس.",
      progression:"تقدم الحديقة 5 البوابات الشمسية لأول مرة. تجمع حدائق التحدي 5 و10 و15 و20 و25 و30 بين بوابة وأربع بوابات مع المسارات والشمسين والمرايا المضللة؛ ويُحسب فتح البوابة حركة.",
      faq:["لماذا توقف الضوء عند بوابة شمسية؟","البوابة مغلقة. اضغط لفتح المسار المستقيم؛ يجب فتح كل البوابات لإكمال الحديقة."]
    }
  };
  const chapterNames={
    en:["First Light","Twin Dawn","Hidden Leaves","Rooted Crossings","Sunlit Weave","Last Lotus"],
    "zh-Hant":["初光庭徑","雙日晨曦","隱葉迷徑","根脈交會","日光交織","終章蓮花"],
    "zh-Hans":["初光花径","双日晨曦","隐叶迷径","根脉交汇","日光交织","终章莲花"],
    ja:["はじめの光路","ふたつの朝日","隠れ葉の庭","根の交差路","光の織り道","最後のハス"],
    ko:["첫 햇살 길","두 태양의 새벽","숨은 잎 정원","뿌리 길 교차","빛의 그물","마지막 연꽃"],
    es:["Primera luz","Doble amanecer","Hojas ocultas","Cruces de raíces","Trama solar","Último loto"],
    "pt-BR":["Primeira luz","Duplo amanhecer","Folhas ocultas","Cruzes de raízes","Trama solar","Último lótus"],
    fr:["Première lumière","Double aube","Feuilles cachées","Carrefour des racines","Réseau solaire","Dernier lotus"],
    de:["Erstes Licht","Doppelter Morgen","Verborgene Blätter","Wurzelkreuzungen","Sonnengeflecht","Letzte Lotusblüte"],
    it:["Prima luce","Doppia alba","Foglie nascoste","Incroci di radici","Intreccio solare","Ultimo loto"],
    ru:["Первый луч","Двойной рассвет","Скрытые листья","Перекрёсток корней","Солнечное сплетение","Последний лотос"],
    hi:["पहली रोशनी","दो सूर्यों की भोर","छिपी पत्तियाँ","जड़ों का संगम","सूर्य-जाल","आखिरी कमल"],
    ar:["الضوء الأول","شروق شمسين","أوراق خفية","تقاطع الجذور","نسيج الشمس","زهرة اللوتس الأخيرة"]
  };
  const chapterHeadings={en:"Chapter paths:","zh-Hant":"六章路線：","zh-Hans":"六章路线：",ja:"六つの章：",ko:"여섯 장의 이름:",es:"Nombres de los seis capítulos:","pt-BR":"Nomes dos seis capítulos:",fr:"Noms des six chapitres :",de:"Namen der sechs Kapitel:",it:"Nomi dei sei capitoli:",ru:"Названия шести глав:",hi:"छह अध्यायों के नाम:",ar:"أسماء الفصول الستة:"};
  for(const [code,names] of Object.entries(chapterNames)){names.forEach((name,index)=>copy[code].ui["chapterArc"+(index+1)]=name);copy[code].progression+=" "+chapterHeadings[code]+" "+names.map((name,index)=>(index+1)+": "+name).join(" · ")}
  const publicCopies = Object.fromEntries(Object.entries(copy).map(([code,entry])=>[code,{system:entry.system,how:entry.how,progression:entry.progression,faq:entry.faq}]));
  window.SUNBEAM_GATE_LOCALES=Object.fromEntries(Object.entries(copy).map(([code,entry])=>[code,entry.ui]));
  for(const [code,entry] of Object.entries(copy))if(window.SUNBEAM_LOCALES?.[code])Object.assign(window.SUNBEAM_LOCALES[code],entry.ui);
  for(const [code,addition] of Object.entries(publicCopies)){
    const guide=window.WeightPlayGeneralReviewedGuides?.[code]?.games?.["animal-sunbeam-garden"];
    if(!guide)continue;
    guide.systems.push(addition.system);guide.how.push(addition.how);guide.progression.push(addition.progression);guide.faq.push(addition.faq);
  }
})();
