/* Yukon-specific concise instructions. No stock, no adjacent-rank waste chain. */
(() => {
 const keys=["summary","how","rule1","rule2","rule3","recovery","compareTitle","compareBody","compareDisclaimer","compareProduct","compareRules"];
 const packs={
  "en": [
    "Reveal hidden cards and build all four suit foundations from Ace to King.",
    "How to play",
    "Choose any face-up card and move it with every card below it, even if that group is not ordered.",
    "Place the selected card on a card one rank higher and of the opposite color. Only a King-led group may fill an empty column.",
    "Send exposed end cards to the matching suit foundation in Ace-to-King order. There is no stock; uncovering hidden cards creates new choices.",
    "Hint shows a move; Undo reverses it. Restart repeats the deal; New Game deals another.",
    "Similar Yukon reference",
    "MobilityWare’s Yukon Russian Solitaire and WeightPlay Yukon Solitaire share the classic Yukon core: all 52 cards begin on seven tableau columns with no Stock, tableau builds downward in alternating colors, exposed groups can move even when the cards inside the group are not ordered, and four foundations build by suit from Ace to King. MobilityWare’s app pairs Yukon with Russian Solitaire and offers app-level options such as difficulty settings, animations, and unlimited hints and undos. WeightPlay keeps this page focused on one Yukon browser ruleset with Hint, Undo, Restart for the same deal, and New Game for another deal. Choose this version when you want a focused Yukon browser game rather than a bundled Yukon/Russian app.",
    "These are separate products. This comparison does not indicate an official MobilityWare edition, endorsement, or partnership.",
    "MobilityWare Yukon Russian app listing",
    "MobilityWare Yukon rules"
  ],
  "zh-tw": [
    "翻開暗牌，將四種花色各自從 A 收到 K。",
    "玩法說明",
    "選一張明牌，連同它下方的所有牌一起移動；這一疊不必先排好順序。",
    "選取的牌須接到大一點且顏色相反的牌下方。空欄只能放以 K 開頭的一疊。",
    "各欄最下方的明牌可依同花色 A 到 K 收入完成區。沒有牌庫可翻，露出暗牌才能增加選擇。",
    "提示指出走法，還原撤回一步。重新開始重玩同一牌局，新遊戲另發一局。",
    "相似 Yukon 玩法參考",
    "MobilityWare 的 Yukon Russian Solitaire 與 WeightPlay Yukon Solitaire 都保留經典 Yukon 核心：52 張牌一開始全部發到 7 個主牌欄、沒有牌庫可翻，主牌欄以紅黑交錯向下排列；只要起始牌能合法接上，就能連同下方所有明牌一起移動，即使那一疊本身沒有排好順序，最後再把四種花色由 A 到 K 收進基礎牌堆。MobilityWare 的 App 把 Yukon 與 Russian Solitaire 放在同一產品中，並提供難度設定、動畫以及不限次數的提示與還原等 App 功能；WeightPlay 這一頁則專注單一 Yukon 瀏覽器規則，提供提示、還原、重新開始同一牌局與另開新牌局。想直接玩 Yukon，而不需要 Yukon／Russian 合集層時，可選這一版。",
    "兩者是彼此獨立的產品。此比較不表示本站是 MobilityWare 的官方版本，也不代表獲得背書或合作。",
    "MobilityWare Yukon Russian App 頁面",
    "MobilityWare Yukon 規則"
  ],
  "zh-cn": [
    "翻开暗牌，将四种花色各自从 A 收到 K。",
    "玩法说明",
    "选一张明牌，连同它下方的所有牌一起移动；这一叠不必先排好顺序。",
    "选取的牌须接到大一点且颜色相反的牌下方。空列只能放以 K 开头的一叠。",
    "各列最下方的明牌可依同花色 A 到 K 收入完成区。没有牌库可翻，露出暗牌才能增加选择。",
    "提示指出走法，撤销退回一步。重新开始重玩同一牌局，新游戏另发一局。",
    "相似 Yukon 玩法参考",
    "MobilityWare 的 Yukon Russian Solitaire 与 WeightPlay Yukon Solitaire 都保留经典 Yukon 核心：52 张牌一开始全部发到 7 个主牌列、没有牌库可翻，主牌列按红黑交替向下排列；只要起始牌可以合法接上，就能连同下方所有明牌一起移动，即使那一叠本身没有排好顺序，最后再把四种花色从 A 到 K 收入基础牌堆。MobilityWare 的 App 把 Yukon 与 Russian Solitaire 放在同一产品中，并提供难度设置、动画以及不限次数的提示与撤销等 App 功能；WeightPlay 这一页则专注单一 Yukon 浏览器规则，提供提示、撤销、重新开始同一牌局与另开新牌局。想直接玩 Yukon，而不需要 Yukon／Russian 合集层时，可选择这一版。",
    "两者是彼此独立的产品。此比较不表示本站是 MobilityWare 的官方版本，也不代表获得背书或合作。",
    "MobilityWare Yukon Russian App 页面",
    "MobilityWare Yukon 规则"
  ],
  "ja": [
    "裏向きのカードを開き、4つの組札をAからKまで完成させます。",
    "遊び方",
    "表向きのカードを選び、その下のカードをすべて一緒に移動します。そのまとまりは順番通りでなくても構いません。",
    "選んだカードを、数字が1つ大きく色が反対のカードに重ねます。空の列にはKから始まるまとまりだけを置けます。",
    "列の末尾のカードを同じスートの組札へAからKの順で送ります。山札はなく、裏向きカードを開くことが大切です。",
    "ヒントで手を確認し、元に戻すで取り消せます。リスタートは同じ配札、新しいゲームは別の配札です。",
    "似たYukon作品との比較",
    "MobilityWare の Yukon Russian Solitaire と WeightPlay Yukon Solitaire は、52枚すべてを7列の場札に配って山札を使わず、赤黒交互の降順で場札を組み、移動元の表向きカードが合法につながれば、その下にある表向きカードが整列していなくてもまとめて動かし、最終的に4つの組札をスート別にAからKまで完成させるというクラシックYukonの核を共有しています。MobilityWare版はYukonとRussian Solitaireを1つのアプリにまとめ、難易度設定、アニメーション、回数制限のないヒントと元に戻すなどのアプリ機能を備えます。WeightPlay版はブラウザ上のYukonルール1種類に集中し、ヒント、元に戻す、同じ配札をやり直すリスタート、新しい配札を作る新しいゲームを用意しています。Yukon／Russianの複合アプリではなく、Yukonだけをブラウザで遊びたい場合に向く構成です。",
    "これらは別々の製品です。この比較はMobilityWareの公式版、推奨、提携を示すものではありません。",
    "MobilityWare Yukon Russian アプリページ",
    "MobilityWare Yukon ルール"
  ],
  "ko": [
    "뒤집힌 카드를 열고 네 무늬를 각각 A부터 K까지 완성하세요.",
    "게임 방법",
    "앞면 카드 하나를 고르면 그 아래 카드도 모두 함께 이동합니다. 묶음 안의 순서는 맞지 않아도 됩니다.",
    "선택한 카드는 숫자가 하나 크고 색이 반대인 카드에 놓으세요. 빈 열에는 K로 시작하는 묶음만 놓을 수 있습니다.",
    "열 끝의 카드를 같은 무늬 완성 칸에 A부터 K 순서로 보내세요. 뽑기 덱은 없으므로 뒤집힌 카드를 열어야 선택지가 늘어납니다.",
    "힌트는 수를 보여 주고 실행 취소는 되돌립니다. 다시 시작은 같은 배치, 새 게임은 다른 배치입니다.",
    "비슷한 Yukon 작품 비교",
    "MobilityWare의 Yukon Russian Solitaire과 WeightPlay Yukon Solitaire는 고전 Yukon의 핵심을 공유합니다. 52장의 카드를 처음부터 7개 테이블 열에 모두 배치하고 스톡을 사용하지 않으며, 테이블은 빨강과 검정을 번갈아 내림차순으로 쌓습니다. 이동을 시작하는 앞면 카드가 목적지에 합법적으로 연결되면 그 아래의 앞면 카드가 정렬되어 있지 않아도 함께 옮길 수 있고, 마지막에는 네 무늬의 파운데이션을 A부터 K까지 완성합니다. MobilityWare 앱은 Yukon과 Russian Solitaire를 한 제품에 묶고 난이도 설정, 애니메이션, 횟수 제한 없는 힌트와 실행 취소 같은 앱 기능을 제공합니다. WeightPlay는 브라우저의 한 가지 Yukon 규칙에 집중하며 힌트, 실행 취소, 같은 배치를 다시 하는 다시 시작, 새 배치를 만드는 새 게임을 제공합니다. Yukon/Russian 묶음 앱보다 Yukon 자체에 집중하고 싶을 때 맞는 구성입니다.",
    "서로 독립된 제품입니다. 이 비교는 MobilityWare의 공식판, 추천 또는 제휴를 뜻하지 않습니다.",
    "MobilityWare Yukon Russian 앱 페이지",
    "MobilityWare Yukon 규칙"
  ],
  "es": [
    "Descubre cartas y completa las cuatro bases por palo, del As al Rey.",
    "Cómo jugar",
    "Elige cualquier carta boca arriba y mueve con ella todas las que tenga debajo, aunque el grupo no esté ordenado.",
    "Colócala sobre una carta un valor mayor y de color opuesto. Solo un grupo encabezado por Rey ocupa una columna vacía.",
    "Envía las cartas libres del extremo a su base por palo, del As al Rey. No hay mazo: descubrir cartas abre opciones.",
    "Pista muestra una jugada; Deshacer la revierte. Reiniciar repite el reparto; Nueva partida crea otro.",
    "Referencia de Yukon similar",
    "Yukon Russian Solitaire de MobilityWare y Yukon Solitaire de WeightPlay comparten el núcleo clásico de Yukon: las 52 cartas se reparten desde el inicio en siete columnas sin mazo, el tablero se construye en orden descendente alternando colores, y una carta boca arriba puede mover consigo todas las cartas visibles que tenga debajo aunque ese grupo no esté ordenado, siempre que la carta inicial encaje legalmente. La meta es completar cuatro bases por palo del As al Rey. La app de MobilityWare reúne Yukon y Russian Solitaire y añade opciones propias de app como dificultad, animaciones y pistas y deshacer sin límite. WeightPlay se concentra en una sola modalidad Yukon en el navegador, con Pista, Deshacer, Reiniciar el mismo reparto y Nueva partida. Es una opción para jugar Yukon directamente sin la capa de una app combinada Yukon/Russian.",
    "Son productos independientes. Esta comparación no indica una edición oficial, recomendación ni colaboración de MobilityWare.",
    "Ficha de la app Yukon Russian de MobilityWare",
    "Reglas de Yukon de MobilityWare"
  ],
  "pt-br": [
    "Revele cartas e complete as quatro bases por naipe, do Ás ao Rei.",
    "Como jogar",
    "Escolha qualquer carta virada para cima e mova junto todas as cartas abaixo dela, mesmo sem sequência ordenada.",
    "Coloque-a sobre uma carta um valor maior e de cor oposta. Só um grupo iniciado por Rei ocupa uma coluna vazia.",
    "Envie cartas livres da ponta à base do mesmo naipe, do Ás ao Rei. Não há monte: revelar cartas abre opções.",
    "Dica mostra uma jogada; Desfazer a reverte. Reiniciar repete a distribuição; Novo jogo cria outra.",
    "Referência de Yukon semelhante",
    "Yukon Russian Solitaire da MobilityWare e Yukon Solitaire do WeightPlay compartilham o núcleo clássico do Yukon: as 52 cartas são distribuídas desde o início em sete colunas sem monte de compra, o tableau desce alternando cores, e uma carta virada para cima pode levar todas as cartas visíveis abaixo dela mesmo que o grupo não esteja ordenado, desde que a carta inicial encaixe legalmente. O objetivo é completar quatro fundações por naipe, do Ás ao Rei. O app da MobilityWare reúne Yukon e Russian Solitaire e acrescenta opções de app como dificuldade, animações e dicas e desfazer sem limite. O WeightPlay se concentra em uma única modalidade Yukon no navegador, com Dica, Desfazer, Reiniciar a mesma distribuição e Novo jogo. É uma opção para jogar Yukon diretamente sem a camada de um app combinado Yukon/Russian.",
    "São produtos independentes. Esta comparação não indica edição oficial, endosso ou parceria da MobilityWare.",
    "Página do app Yukon Russian da MobilityWare",
    "Regras de Yukon da MobilityWare"
  ],
  "fr": [
    "Retournez les cartes cachées et terminez les quatre fondations de l’As au Roi.",
    "Comment jouer",
    "Choisissez une carte visible et déplacez toutes celles qui sont dessous avec elle, même si ce groupe est désordonné.",
    "Posez-la sur une carte de rang supérieur d’une unité et de couleur opposée. Seul un groupe commençant par un Roi remplit une colonne vide.",
    "Envoyez les cartes libres du bout vers la fondation de même symbole, de l’As au Roi. Pas de pioche : révélez les cartes cachées.",
    "Indice montre un coup ; Annuler le retire. Recommencer reprend cette donne ; Nouvelle partie en crée une autre.",
    "Référence Yukon similaire",
    "Yukon Russian Solitaire de MobilityWare et Yukon Solitaire de WeightPlay partagent le cœur classique du Yukon : les 52 cartes sont distribuées dès le départ dans sept colonnes sans pioche, le tableau descend en alternant les couleurs, et une carte visible peut emporter toutes les cartes visibles placées sous elle même si ce groupe n’est pas ordonné, à condition que la carte de départ se pose légalement. Le but reste de compléter quatre fondations par couleur, de l’As au Roi. L’application MobilityWare réunit Yukon et Russian Solitaire et ajoute des options d’application comme le réglage de difficulté, des animations ainsi que des indices et annulations sans limite. WeightPlay se concentre sur une seule règle Yukon dans le navigateur, avec Indice, Annuler, Recommencer la même donne et Nouvelle partie. Cette version convient si vous voulez jouer directement au Yukon sans la couche d’une application combinée Yukon/Russian.",
    "Il s’agit de produits distincts. Cette comparaison n’indique aucune édition officielle, recommandation ou collaboration de MobilityWare.",
    "Page de l’app Yukon Russian de MobilityWare",
    "Règles Yukon de MobilityWare"
  ],
  "de": [
    "Decke Karten auf und baue vier Ablagen nach Symbol vom Ass bis zum König.",
    "Spielanleitung",
    "Wähle eine offene Karte und verschiebe alle Karten darunter mit, auch wenn die Gruppe unsortiert ist.",
    "Lege sie auf eine um einen Rang höhere Karte der anderen Farbe. Eine leere Spalte darf nur eine Gruppe mit König beginnen.",
    "Lege freie Endkarten nach Symbol vom Ass bis zum König ab. Es gibt keinen Nachziehstapel; aufgedeckte Karten öffnen neue Möglichkeiten.",
    "Tipp zeigt einen Zug; Rückgängig nimmt ihn zurück. Neustart wiederholt die Verteilung; Neues Spiel mischt neu.",
    "Ähnliche Yukon-Referenz",
    "MobilityWares Yukon Russian Solitaire und WeightPlay Yukon Solitaire teilen den klassischen Yukon-Kern: Alle 52 Karten werden zu Beginn auf sieben Tableau-Spalten verteilt, es gibt keinen Nachziehstapel, das Tableau wird absteigend in wechselnden Farben gebaut, und eine offene Karte darf alle offenen Karten darunter mitnehmen, auch wenn diese Gruppe nicht geordnet ist, solange die Startkarte regelgerecht angelegt wird. Ziel sind vier Ablagestapel nach Farbe vom Ass bis zum König. Die MobilityWare-App kombiniert Yukon und Russian Solitaire und bietet App-Optionen wie Schwierigkeitsstufen, Animationen sowie unbegrenzte Hinweise und Rückgängig-Züge. WeightPlay konzentriert sich auf eine einzelne Yukon-Regelvariante im Browser mit Hinweis, Rückgängig, Neustart derselben Verteilung und Neuem Spiel. Diese Version passt, wenn du Yukon direkt spielen möchtest, ohne die Ebene einer kombinierten Yukon/Russian-App.",
    "Es handelt sich um getrennte Produkte. Dieser Vergleich bedeutet keine offizielle MobilityWare-Ausgabe, Empfehlung oder Partnerschaft.",
    "MobilityWare Yukon Russian App-Seite",
    "MobilityWare Yukon-Regeln"
  ],
  "it": [
    "Scopri le carte e completa le quattro basi per seme, dall’Asso al Re.",
    "Come giocare",
    "Scegli una carta scoperta e sposta insieme tutte quelle sotto di essa, anche se il gruppo non è ordinato.",
    "Posala su una carta di un valore superiore e colore opposto. Solo un gruppo che inizia con Re può riempire una colonna vuota.",
    "Invia le carte libere in fondo alla base dello stesso seme, dall’Asso al Re. Non c’è un mazzo da pescare: scopri le carte nascoste.",
    "Suggerimento mostra una mossa; Annulla la cancella. Ricomincia ripete la distribuzione; Nuova partita ne crea un’altra.",
    "Riferimento Yukon simile",
    "Yukon Russian Solitaire di MobilityWare e Yukon Solitaire di WeightPlay condividono il nucleo classico di Yukon: tutte le 52 carte vengono distribuite fin dall’inizio in sette colonne senza mazzo di pesca, il tableau si costruisce in ordine decrescente alternando i colori e una carta scoperta può portare con sé tutte le carte scoperte sottostanti anche se il gruppo non è ordinato, purché la carta iniziale possa essere collocata legalmente. L’obiettivo è completare quattro basi per seme dall’Asso al Re. L’app MobilityWare riunisce Yukon e Russian Solitaire e aggiunge opzioni da app come difficoltà, animazioni, suggerimenti e annullamenti senza limite. WeightPlay si concentra su una sola modalità Yukon nel browser, con Suggerimento, Annulla, Ricomincia la stessa distribuzione e Nuova partita. È una scelta per giocare direttamente a Yukon senza lo strato di un’app combinata Yukon/Russian.",
    "Sono prodotti separati. Questo confronto non indica un’edizione ufficiale, un’approvazione o una collaborazione di MobilityWare.",
    "Pagina dell’app Yukon Russian di MobilityWare",
    "Regole Yukon di MobilityWare"
  ],
  "ru": [
    "Открывайте скрытые карты и соберите четыре основания по мастям от туза до короля.",
    "Как играть",
    "Выберите любую открытую карту и перенесите с ней все карты ниже, даже если группа не упорядочена.",
    "Кладите её на карту на один ранг выше и противоположного цвета. Пустую колонку занимает только группа с королём во главе.",
    "Свободные крайние карты отправляйте в основание той же масти от туза до короля. Колоды для добора нет; открывайте скрытые карты.",
    "Подсказка показывает ход, отмена возвращает его. Перезапуск повторяет расклад, новая игра создаёт другой.",
    "Сравнение с похожей версией Yukon",
    "Yukon Russian Solitaire от MobilityWare и Yukon Solitaire от WeightPlay используют классическую основу Yukon: все 52 карты сразу раскладываются по семи столбцам без колоды для добора, столбцы строятся по убыванию с чередованием цветов, а открытую карту можно перенести вместе со всеми открытыми картами ниже неё, даже если эта группа не упорядочена, если начальная карта правильно ложится на место назначения. Цель — собрать четыре основания по мастям от туза до короля. Приложение MobilityWare объединяет Yukon и Russian Solitaire и добавляет настройки сложности, анимации, а также неограниченные подсказки и отмены. WeightPlay сосредоточен на одном варианте Yukon в браузере с Подсказкой, Отменой, Перезапуском той же раздачи и Новой игрой. Этот вариант подходит, если нужен именно Yukon без слоя объединённого приложения Yukon/Russian.",
    "Это отдельные продукты. Сравнение не означает официальную версию MobilityWare, одобрение или партнёрство.",
    "Страница приложения Yukon Russian от MobilityWare",
    "Правила Yukon от MobilityWare"
  ],
  "hi": [
    "छिपे पत्ते खोलें और चारों सूट इक्के से बादशाह तक पूरे करें।",
    "कैसे खेलें",
    "कोई खुला पत्ता चुनें और उसके नीचे के सभी पत्ते साथ ले जाएँ, भले ही समूह क्रम में न हो।",
    "उसे एक रैंक बड़े और विपरीत रंग के पत्ते पर रखें। खाली कॉलम में केवल बादशाह से शुरू समूह रखा जा सकता है।",
    "कॉलम के अंतिम खुले पत्ते उसी सूट के आधार में इक्के से बादशाह के क्रम में रखें। नया पत्ता लेने का डेक नहीं है; छिपे पत्ते खोलें।",
    "संकेत चाल दिखाता है; वापस करें उसे पलटता है। फिर शुरू करें वही बाँट दोहराता है; नया खेल दूसरा बाँट देता है।",
    "मिलते-जुलते Yukon खेल का संदर्भ",
    "MobilityWare का Yukon Russian Solitaire और WeightPlay Yukon Solitaire क्लासिक Yukon का मुख्य ढाँचा साझा करते हैं: सभी 52 पत्ते शुरुआत में सात टेबलो कॉलम में बँटते हैं, कोई स्टॉक नहीं होता, टेबलो में रंग बदलते हुए घटते क्रम में पत्ते लगाए जाते हैं, और कोई खुला पत्ता अपने नीचे के सभी खुले पत्तों को साथ ले जा सकता है, भले समूह अंदर से क्रमबद्ध न हो, यदि शुरुआती पत्ता गंतव्य पर वैध रूप से रखा जा सके। लक्ष्य चारों सूट के फाउंडेशन को इक्के से बादशाह तक पूरा करना है। MobilityWare ऐप Yukon और Russian Solitaire को एक ही उत्पाद में रखता है और कठिनाई सेटिंग, एनीमेशन तथा बिना सीमा के संकेत और वापस करने जैसी ऐप सुविधाएँ देता है। WeightPlay ब्राउज़र में एक Yukon नियम-रूप पर केंद्रित है, जिसमें संकेत, वापस करें, उसी बाँट को फिर शुरू करना और नया बाँट लेने के लिए नया खेल है। यदि आप संयुक्त Yukon/Russian ऐप की परत के बिना सीधे Yukon खेलना चाहते हैं, तो यह रूप उसी पर केंद्रित है।",
    "ये अलग-अलग उत्पाद हैं। यह तुलना MobilityWare का आधिकारिक संस्करण, समर्थन या साझेदारी नहीं दर्शाती।",
    "MobilityWare Yukon Russian ऐप पेज",
    "MobilityWare Yukon नियम"
  ],
  "ar": [
    "اكشف البطاقات المخفية وأكمل الأساسات الأربعة حسب النوع من الآس إلى الملك.",
    "طريقة اللعب",
    "اختر أي بطاقة مكشوفة وانقل معها كل البطاقات التي تحتها، حتى لو لم تكن المجموعة مرتبة.",
    "ضع البطاقة المختارة على بطاقة أعلى بدرجة ومن اللون المقابل. العمود الفارغ يقبل مجموعة تبدأ بالملك فقط.",
    "انقل البطاقة المكشوفة في نهاية العمود إلى أساس النوع نفسه من الآس إلى الملك. لا توجد رزمة للسحب؛ اكشف المخفي لفتح خيارات جديدة.",
    "التلميح يعرض نقلة والتراجع يلغيها. إعادة البدء تكرر التوزيع نفسه، واللعبة الجديدة تنشئ توزيعًا آخر.",
    "مرجع مشابه للعبة Yukon",
    "تشترك Yukon Russian Solitaire من MobilityWare وYukon Solitaire من WeightPlay في جوهر Yukon الكلاسيكي: تُوزع البطاقات الـ52 منذ البداية على سبعة أعمدة من دون رزمة سحب، ويُبنى الجدول تنازليًا مع التناوب بين الأحمر والأسود، ويمكن لبطاقة مكشوفة أن تنقل معها كل البطاقات المكشوفة تحتها حتى لو لم تكن المجموعة مرتبة، ما دامت البطاقة الأولى توضع بصورة قانونية. والهدف هو إكمال أربعة أساسات حسب النوع من الآس إلى الملك. يجمع تطبيق MobilityWare بين Yukon وRussian Solitaire ويضيف خيارات على مستوى التطبيق مثل إعدادات الصعوبة والرسوم المتحركة والتلميحات والتراجع غير المحدودين. يركز WeightPlay على قواعد Yukon واحدة داخل المتصفح، مع التلميح والتراجع وإعادة التوزيع نفسه عبر إعادة البدء وبدء توزيع جديد عبر لعبة جديدة. يناسب هذا الإصدار من يريد Yukon مباشرة من دون طبقة تطبيق تجمع Yukon وRussian.",
    "هذان منتجان منفصلان. لا تعني هذه المقارنة وجود إصدار رسمي من MobilityWare أو تأييد أو شراكة.",
    "صفحة تطبيق Yukon Russian من MobilityWare",
    "قواعد Yukon من MobilityWare"
  ]
};
 const faq={
  "en":{
   faqTitle:"FAQ",faqStockQuestion:"Is there a Stock?",faqStockAnswer:"No. All 52 cards begin on the tableau.",
   faqGroupQuestion:"Can any face-up group move?",faqGroupAnswer:"Yes. Any face-up card may carry every face-up card below it.",
   faqKingQuestion:"What can fill an empty column?",faqKingAnswer:"A King or a group whose first card is a King.",
   faqAlternatingQuestion:"Do tableau suits alternate?",faqAlternatingAnswer:"Yes. Tableau builds descend by rank in alternating colors.",
   faqUndoQuestion:"Can I undo?",faqUndoAnswer:"Yes. Undo restores the full prior tableau and foundations."
  },
  "zh-tw":{
   faqTitle:"常見問題",faqStockQuestion:"有牌庫嗎？",faqStockAnswer:"沒有。52 張牌一開始都在主牌欄上。",
   faqGroupQuestion:"任何明牌組都能移動嗎？",faqGroupAnswer:"可以。只要起始牌能合法接上，它下方的所有明牌都能一起移動。",
   faqKingQuestion:"空欄可以放什麼？",faqKingAnswer:"只有 K 或以 K 開頭的組牌。",
   faqAlternatingQuestion:"主牌欄的花色會交替嗎？",faqAlternatingAnswer:"會。主牌欄按點數遞減並交替紅黑。",
   faqUndoQuestion:"可以撤銷嗎？",faqUndoAnswer:"可以。撤銷會還原上一個完整的主牌欄與基礎牌堆狀態。"
  },
  "zh-cn":{
   faqTitle:"常见问题",faqStockQuestion:"有牌库吗？",faqStockAnswer:"没有。52 张牌一开始都在主牌列上。",
   faqGroupQuestion:"任何明牌组都能移动吗？",faqGroupAnswer:"可以。只要起始牌能合法接上，它下方的所有明牌都能一起移动。",
   faqKingQuestion:"空列可以放什么？",faqKingAnswer:"只有 K 或以 K 开头的牌组。",
   faqAlternatingQuestion:"主牌列的花色会交替吗？",faqAlternatingAnswer:"会。主牌列按点数递减并交替红黑。",
   faqUndoQuestion:"可以撤销吗？",faqUndoAnswer:"可以。撤销会还原上一个完整的主牌列和基础牌堆状态。"
  },
  "ja":{
   faqTitle:"よくある質問",faqStockQuestion:"山札はありますか？",faqStockAnswer:"いいえ。52枚すべてが最初から場札にあります。",
   faqGroupQuestion:"表向きのまとまりはどれでも動かせますか？",faqGroupAnswer:"はい。先頭の表向きカードを合法的に置ければ、その下の表向きカードをすべて一緒に動かせます。",
   faqKingQuestion:"空の列には何を置けますか？",faqKingAnswer:"K、またはKから始まるまとまりだけです。",
   faqAlternatingQuestion:"場札では色を交互にしますか？",faqAlternatingAnswer:"はい。場札は色を交互にしながら数字を下げて重ねます。",
   faqUndoQuestion:"元に戻せますか？",faqUndoAnswer:"はい。元に戻すと、直前の場札と組札の状態が完全に復元されます。"
  },
  "ko":{
   faqTitle:"자주 묻는 질문",faqStockQuestion:"스톡(뽑기 더미)이 있나요?",faqStockAnswer:"아니요. 52장 모두 처음부터 테이블에 놓입니다.",
   faqGroupQuestion:"앞면 카드 그룹은 모두 이동할 수 있나요?",faqGroupAnswer:"네. 첫 카드가 합법적으로 놓이면 그 아래 앞면 카드를 모두 함께 옮길 수 있습니다.",
   faqKingQuestion:"빈 열에는 무엇을 놓을 수 있나요?",faqKingAnswer:"K 또는 K로 시작하는 그룹만 놓을 수 있습니다.",
   faqAlternatingQuestion:"테이블에서 무늬 색이 번갈아 바뀌나요?",faqAlternatingAnswer:"네. 테이블은 색을 번갈아 가며 숫자가 내려가도록 쌓습니다.",
   faqUndoQuestion:"실행 취소할 수 있나요?",faqUndoAnswer:"네. 실행 취소는 이전 테이블과 파운데이션 상태를 완전히 복원합니다."
  },
  "es":{
   faqTitle:"Preguntas frecuentes",faqStockQuestion:"¿Hay mazo?",faqStockAnswer:"No. Las 52 cartas empiezan en el tablero.",
   faqGroupQuestion:"¿Se puede mover cualquier grupo boca arriba?",faqGroupAnswer:"Sí. Si la primera carta encaja legalmente, puede llevarse todas las cartas boca arriba que tenga debajo.",
   faqKingQuestion:"¿Qué puede ocupar una columna vacía?",faqKingAnswer:"Solo un Rey o un grupo que empiece por Rey.",
   faqAlternatingQuestion:"¿Se alternan los colores en el tablero?",faqAlternatingAnswer:"Sí. El tablero baja de rango alternando los colores.",
   faqUndoQuestion:"¿Puedo deshacer?",faqUndoAnswer:"Sí. Deshacer restaura el estado anterior completo del tablero y las bases."
  },
  "pt-br":{
   faqTitle:"Perguntas frequentes",faqStockQuestion:"Há um monte de compra?",faqStockAnswer:"Não. As 52 cartas começam no tableau.",
   faqGroupQuestion:"Qualquer grupo virado para cima pode ser movido?",faqGroupAnswer:"Sim. Se a primeira carta puder ser colocada legalmente, ela leva todas as cartas viradas para cima abaixo dela.",
   faqKingQuestion:"O que pode preencher uma coluna vazia?",faqKingAnswer:"Apenas um Rei ou um grupo iniciado por Rei.",
   faqAlternatingQuestion:"As cores alternam no tableau?",faqAlternatingAnswer:"Sim. O tableau desce em valor alternando as cores.",
   faqUndoQuestion:"Posso desfazer?",faqUndoAnswer:"Sim. Desfazer restaura o estado anterior completo do tableau e das fundações."
  },
  "fr":{
   faqTitle:"Questions fréquentes",faqStockQuestion:"Y a-t-il une pioche ?",faqStockAnswer:"Non. Les 52 cartes sont placées dès le début sur le tableau.",
   faqGroupQuestion:"Peut-on déplacer n’importe quel groupe visible ?",faqGroupAnswer:"Oui. Si la première carte peut être posée légalement, elle peut emporter toutes les cartes visibles placées dessous.",
   faqKingQuestion:"Que peut-on placer dans une colonne vide ?",faqKingAnswer:"Seulement un Roi ou un groupe qui commence par un Roi.",
   faqAlternatingQuestion:"Les couleurs alternent-elles dans le tableau ?",faqAlternatingAnswer:"Oui. Le tableau descend en alternant les couleurs.",
   faqUndoQuestion:"Puis-je annuler un coup ?",faqUndoAnswer:"Oui. Annuler restaure entièrement l’état précédent du tableau et des fondations."
  },
  "de":{
   faqTitle:"Häufige Fragen",faqStockQuestion:"Gibt es einen Nachziehstapel?",faqStockAnswer:"Nein. Alle 52 Karten liegen von Anfang an im Tableau.",
   faqGroupQuestion:"Kann jede offene Gruppe bewegt werden?",faqGroupAnswer:"Ja. Wenn die erste Karte regelgerecht passt, nimmt sie alle offenen Karten darunter mit.",
   faqKingQuestion:"Was darf eine leere Spalte füllen?",faqKingAnswer:"Nur ein König oder eine Gruppe, die mit einem König beginnt.",
   faqAlternatingQuestion:"Wechseln sich die Farben im Tableau ab?",faqAlternatingAnswer:"Ja. Das Tableau wird absteigend mit wechselnden Farben aufgebaut.",
   faqUndoQuestion:"Kann ich einen Zug rückgängig machen?",faqUndoAnswer:"Ja. Rückgängig stellt den vorherigen Zustand von Tableau und Ablagen vollständig wieder her."
  },
  "it":{
   faqTitle:"Domande frequenti",faqStockQuestion:"C’è un mazzo da pescare?",faqStockAnswer:"No. Tutte le 52 carte iniziano nel tableau.",
   faqGroupQuestion:"Si può spostare qualsiasi gruppo scoperto?",faqGroupAnswer:"Sì. Se la prima carta può essere collocata legalmente, porta con sé tutte le carte scoperte sotto di essa.",
   faqKingQuestion:"Cosa può riempire una colonna vuota?",faqKingAnswer:"Solo un Re o un gruppo che inizia con un Re.",
   faqAlternatingQuestion:"I colori si alternano nel tableau?",faqAlternatingAnswer:"Sì. Il tableau scende di valore alternando i colori.",
   faqUndoQuestion:"Posso annullare?",faqUndoAnswer:"Sì. Annulla ripristina completamente lo stato precedente del tableau e delle basi."
  },
  "ru":{
   faqTitle:"Частые вопросы",faqStockQuestion:"Есть ли колода для добора?",faqStockAnswer:"Нет. Все 52 карты с самого начала находятся на игровом столе.",
   faqGroupQuestion:"Можно ли перемещать любую открытую группу?",faqGroupAnswer:"Да. Если первая карта подходит по правилам, вместе с ней можно перенести все открытые карты ниже.",
   faqKingQuestion:"Что можно поместить в пустую колонку?",faqKingAnswer:"Только короля или группу, начинающуюся с короля.",
   faqAlternatingQuestion:"Чередуются ли цвета в таблице?",faqAlternatingAnswer:"Да. Карты в таблице идут по убыванию с чередованием цветов.",
   faqUndoQuestion:"Можно ли отменить ход?",faqUndoAnswer:"Да. Отмена полностью восстанавливает предыдущее состояние таблицы и оснований."
  },
  "hi":{
   faqTitle:"अक्सर पूछे जाने वाले प्रश्न",faqStockQuestion:"क्या कोई स्टॉक डेक है?",faqStockAnswer:"नहीं। सभी 52 पत्ते शुरुआत से ही टेबलो पर होते हैं।",
   faqGroupQuestion:"क्या कोई भी खुला समूह चलाया जा सकता है?",faqGroupAnswer:"हाँ। यदि पहला पत्ता नियम के अनुसार बैठता है, तो उसके नीचे के सभी खुले पत्ते साथ ले जाए जा सकते हैं।",
   faqKingQuestion:"खाली कॉलम में क्या रखा जा सकता है?",faqKingAnswer:"केवल बादशाह या बादशाह से शुरू होने वाला समूह।",
   faqAlternatingQuestion:"क्या टेबलो में रंग बारी-बारी आते हैं?",faqAlternatingAnswer:"हाँ। टेबलो में पत्ते घटते क्रम में और बारी-बारी से रंग बदलकर रखे जाते हैं।",
   faqUndoQuestion:"क्या चाल वापस ली जा सकती है?",faqUndoAnswer:"हाँ। वापस करें टेबलो और फाउंडेशन की पिछली पूरी स्थिति बहाल करता है।"
  },
  "ar":{
   faqTitle:"الأسئلة الشائعة",faqStockQuestion:"هل توجد رزمة سحب؟",faqStockAnswer:"لا. تبدأ البطاقات الـ52 كلها على الجدول.",
   faqGroupQuestion:"هل يمكن نقل أي مجموعة مكشوفة؟",faqGroupAnswer:"نعم. إذا أمكن وضع البطاقة الأولى بصورة قانونية، فيمكنها نقل كل البطاقات المكشوفة تحتها.",
   faqKingQuestion:"ما الذي يمكن أن يملأ عمودًا فارغًا؟",faqKingAnswer:"ملك فقط أو مجموعة تبدأ بملك.",
   faqAlternatingQuestion:"هل تتناوب الألوان في الجدول؟",faqAlternatingAnswer:"نعم. يُبنى الجدول تنازليًا مع تناوب الألوان.",
   faqUndoQuestion:"هل يمكن التراجع؟",faqUndoAnswer:"نعم. يعيد التراجع الحالة السابقة كاملة للجدول والأساسات."
  }
 };
 window.YUKON_GUIDE_LOCALES=Object.fromEntries(Object.entries(packs).map(([code,values])=>[code,{...Object.fromEntries(keys.map((key,i)=>[key,values[i]])),...(faq[code]||faq.en)}]));
})();
