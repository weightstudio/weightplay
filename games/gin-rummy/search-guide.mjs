// Locale-owned Text Growth 1.4.0 content for Gin Rummy's static public routes.
// Gameplay, title identity, asset paths, and runtime cache identities stay owned
// by their existing sources.

const COPY = Object.freeze({
  en: {
    name: "Gin Rummy", summary: "Draw one card and discard one each turn. Build sets and suited runs, then choose when to Knock or finish with Gin.",
    tags: ["Gin Rummy card game", "Sets and suited runs", "Draw and discard"], genre: ["Card game", "Strategy"],
    how: "You and the AI start with ten cards each. On your turn, take one card from the stock or the top of the discard pile, then discard one card. The aim is to group cards and lower the value of cards left outside those groups, called Deadwood.",
    steps: ["Make a set from at least three cards of the same rank, or a run of at least three consecutive cards in one suit.", "Aces count as 1 point and face cards as 10. Other unmatched cards count at their rank value.", "After drawing, Knock with 10 or fewer Deadwood points, or reach 0 to finish with Gin."],
    decision: "Check the top discard before drawing: it may complete a group, and the discard you take is visible while your hand stays hidden. Connected ranks or same-suit neighbors can grow into runs; isolated high cards are costly when left unmatched. Compare a safe Knock with the chance to reduce your hand further.",
    replay: "Each round is a single hand against the AI, not a campaign. The changing deal and discard order create a new set of choices. A round ends by Gin, Knock, or when the stock is exhausted; at exhaustion, the lower Deadwood total wins.",
    save: "Round score and preferences are kept in this browser. The current hand is not saved to the cloud. The public game needs no account or purchase.",
    faqTitle: "Gin Rummy questions",
    faq: [
      ["How do I draw and discard?", "Take one card from the stock or the top discard, then choose one card from your hand to discard."],
      ["What is a set or run?", "A set has at least three cards of the same rank. A run has at least three consecutive ranks in one suit."],
      ["What counts as Deadwood?", "It is the total point value of cards not included in the best non-overlapping sets and runs in your hand."],
      ["When can I Knock or declare Gin?", "After drawing, Knock is available at 10 or fewer Deadwood points. A hand with 0 Deadwood finishes as Gin."],
      ["What happens when the stock runs out?", "The round settles by comparing the two hands' Deadwood; the lower total wins. Round score and preferences stay in this browser."],
    ],
    related: "Try another card game or a compact placement puzzle after the hand ends.",
  },
  "zh-Hant": {
    name: "金拉米", summary: "每回合抽一張、棄一張，組合同點數套牌與同花色順子，再選擇何時 Knock 或以 Gin 結束牌局。",
    tags: ["金拉米紙牌遊戲", "同點數套牌與同花色順子", "抽牌與棄牌"], genre: ["紙牌遊戲", "策略"],
    how: "你和 AI 各拿十張牌。每回合從牌庫或棄牌堆頂抽一張，再棄掉一張。目標是組成牌組，並降低未組合牌張的點數；這些牌稱為死牌。",
    steps: ["三張以上同點數牌可組成套牌；三張以上同花色且連續的點數可組成順子。", "A 計 1 點，J、Q、K 各計 10 點；其他未組合牌按牌面點數計算。", "抽牌後，死牌總點數不超過 10 點可 Knock；降至 0 點則以 Gin 結束。"],
    decision: "抽牌前先看棄牌堆頂：它可能補成牌組，拿走棄牌堆頂的動作可見，但你的手牌仍是隱藏的。相連點數或同花色鄰牌有機會延伸成順子；孤立的高點數牌若未組合，代價較高。衡量現在安全 Knock，還是繼續降低死牌。",
    replay: "每回合是一手對戰 AI 的牌局，沒有戰役進度。不同的發牌與棄牌順序會帶來新的取捨。牌局以 Gin、Knock 或牌庫耗盡結束；牌庫耗盡時比較雙方死牌，點數較低者獲勝。",
    save: "回合分數與偏好只保存在目前瀏覽器；手牌不會雲端儲存。免費公開遊戲不需帳號或購買。",
    faqTitle: "金拉米常見問題",
    faq: [
      ["如何抽牌與棄牌？", "從牌庫或棄牌堆頂拿一張，再從手牌選一張棄掉。"],
      ["什麼是套牌或順子？", "至少三張同點數牌是套牌；至少三張同花色連續點數牌是順子。"],
      ["什麼是死牌？", "死牌是未納入手牌中最佳且互不重疊的套牌與順子的牌，其點數總和。"],
      ["何時可以 Knock 或完成 Gin？", "抽牌後，死牌總點數為 10 點或以下即可 Knock；死牌為 0 點時以 Gin 結束。"],
      ["牌庫耗盡時會怎樣？", "比較雙方手牌的死牌點數，較低者贏得該回合。回合分數與偏好留在目前瀏覽器。"],
    ],
    related: "牌局結束後，也可以試試另一款紙牌遊戲或輕巧的排放方塊益智遊戲。",
  },
  "zh-Hans": {
    name: "金拉米", summary: "每回合抽一张、弃一张，组合相同点数套牌与同花色顺子，再选择何时 Knock 或以 Gin 结束牌局。",
    tags: ["金拉米纸牌游戏", "相同点数套牌与同花色顺子", "抽牌与弃牌"], genre: ["纸牌游戏", "策略"],
    how: "你和 AI 各拿十张牌。每回合从牌库或弃牌堆顶抽一张，再弃掉一张。目标是组合牌组，并降低未组合牌张的点数；这些牌称为死牌。",
    steps: ["三张以上相同点数牌可组成套牌；三张以上同花色且点数连续的牌可组成顺子。", "A 计 1 点，J、Q、K 各计 10 点；其他未组合牌按牌面点数计算。", "抽牌后，死牌总点数不超过 10 点可 Knock；降至 0 点则以 Gin 结束。"],
    decision: "抽牌前先看弃牌堆顶：它可能补成牌组，拿走弃牌堆顶的动作可见，但你的手牌仍是隐藏的。相连点数或同花色邻牌有机会延伸成顺子；孤立的高点数牌若未组合，代价较高。衡量现在安全 Knock，还是继续降低死牌。",
    replay: "每回合是一手对战 AI 的牌局，没有战役进度。不同的发牌与弃牌顺序会带来新的取舍。牌局以 Gin、Knock 或牌库耗尽结束；牌库耗尽时比较双方死牌，点数较低者获胜。",
    save: "回合分数与偏好只保存在当前浏览器；手牌不会云端保存。免费公开游戏不需要账号或购买。",
    faqTitle: "金拉米常见问题",
    faq: [
      ["如何抽牌和弃牌？", "从牌库或弃牌堆顶拿一张，再从手牌选一张弃掉。"],
      ["什么是套牌或顺子？", "至少三张相同点数牌是套牌；至少三张同花色连续点数牌是顺子。"],
      ["什么是死牌？", "死牌是未纳入手牌中最佳且互不重叠的套牌与顺子的牌，其点数总和。"],
      ["何时可以 Knock 或完成 Gin？", "抽牌后，死牌总点数为 10 点或以下即可 Knock；死牌为 0 点时以 Gin 结束。"],
      ["牌库耗尽时会怎样？", "比较双方手牌的死牌点数，较低者赢得该回合。回合分数与偏好保留在当前浏览器。"],
    ],
    related: "牌局结束后，也可以试试另一款纸牌游戏或轻巧的排放方块益智游戏。",
  },
  ja: {
    name: "ジン・ラミー", summary: "毎ターン1枚引いて1枚捨て、同じランクのセットや同じスートのランを作ります。ノックやジンで終えるタイミングも選びます。",
    tags: ["ジン・ラミーのカードゲーム", "同ランクのセットと同じスートのラン", "ドローと捨て札"], genre: ["カードゲーム", "戦略"],
    how: "あなたとAIはそれぞれ10枚で始めます。毎ターン、山札か捨て札の一番上から1枚引き、手札から1枚捨てます。役を作り、役に入らないカードの点数（デッドウッド）を減らしましょう。",
    steps: ["同じランク3枚以上でセット、同じスートで3つ以上連続するランクでランを作ります。", "Aは1点、J・Q・Kは各10点です。役に入らない他のカードはランクの点数になります。", "引いた後、デッドウッドが10点以下ならノック、0点ならジンで手を終えられます。"],
    decision: "引く前に捨て札の一番上を確認しましょう。役に加えられる一方、取ったことは相手に見えますが、手札は隠れたままです。近いランクや同じスートの隣接カードはランに育つ可能性があります。高得点の孤立札を残すか、今ノックするかを比べましょう。",
    replay: "各ラウンドはAIとの一局で、キャンペーン進行はありません。配られる手札と捨て札の順が変わるため、判断も毎回変わります。ジン、ノック、山札切れで終了し、山札切れではデッドウッドの低い側が勝ちます。",
    save: "ラウンドのスコアと設定はこのブラウザーに保存されます。進行中の手札はクラウド保存されません。無料の公開ゲームで、アカウントや購入は不要です。",
    faqTitle: "ジン・ラミーのよくある質問",
    faq: [
      ["どうやって引いて捨てますか？", "山札または捨て札の一番上から1枚引き、手札から1枚選んで捨てます。"],
      ["セットとランとは何ですか？", "同じランク3枚以上がセット、同じスートで3つ以上連続するランクがランです。"],
      ["デッドウッドとは何ですか？", "手札の中で重ならない最良のセットやランに含まれないカードの点数合計です。"],
      ["いつノックやジンができますか？", "カードを引いた後、デッドウッド10点以下でノックできます。0点ならジンで終了です。"],
      ["山札がなくなるとどうなりますか？", "双方の手札のデッドウッドを比べ、低い方がそのラウンドに勝ちます。スコアと設定はこのブラウザーに残ります。"],
    ],
    related: "ラウンド後は、別のカードゲームや手軽な配置パズルも遊べます。",
  },
  ko: {
    name: "진 러미", summary: "매 턴 카드 한 장을 뽑고 한 장을 버리세요. 같은 숫자의 세트와 같은 무늬의 연속 패를 만든 뒤 노크나 진으로 끝낼 시점을 고릅니다.",
    tags: ["진 러미 카드 게임", "같은 숫자 세트와 같은 무늬 연속 패", "카드 뽑기와 버리기"], genre: ["카드 게임", "전략"],
    how: "플레이어와 AI는 각각 카드 10장으로 시작합니다. 매 턴 덱이나 버린 카드 더미 맨 위에서 한 장을 가져온 뒤 한 장을 버립니다. 조합을 만들고 조합되지 않은 카드의 점수인 데드우드를 줄이세요.",
    steps: ["같은 숫자 카드 3장 이상은 세트, 같은 무늬에서 숫자가 3개 이상 연속되면 런입니다.", "A는 1점, J·Q·K는 각각 10점입니다. 조합되지 않은 나머지 카드는 숫자만큼 계산합니다.", "뽑은 뒤 데드우드가 10점 이하면 노크할 수 있고, 0점이면 진으로 끝납니다."],
    decision: "뽑기 전에 버린 카드 더미 맨 위를 살펴보세요. 조합에 보탤 수 있지만, 그 카드를 가져간 것은 보이지만 손패는 계속 숨겨집니다. 가까운 숫자나 같은 무늬의 이웃 카드는 런으로 자랄 수 있습니다. 고립된 높은 점수 카드를 남길지, 지금 노크할지 비교하세요.",
    replay: "각 라운드는 AI와 한 판이며 캠페인 진행은 없습니다. 매번 다른 패와 버린 카드 순서가 새로운 선택을 만듭니다. 진, 노크 또는 덱 소진으로 끝나며, 덱이 비면 데드우드가 낮은 쪽이 승리합니다.",
    save: "라운드 점수와 설정은 현재 브라우저에 저장됩니다. 진행 중인 패는 클라우드에 저장되지 않습니다. 무료 공개 게임이며 계정이나 구매가 필요 없습니다.",
    faqTitle: "진 러미 자주 묻는 질문",
    faq: [
      ["어떻게 뽑고 버리나요?", "덱이나 버린 카드 더미 맨 위에서 한 장을 가져온 뒤 손에서 한 장을 골라 버립니다."],
      ["세트와 런은 무엇인가요?", "같은 숫자 3장 이상은 세트이고, 같은 무늬에서 숫자가 3개 이상 연속되면 런입니다."],
      ["데드우드는 무엇인가요?", "손의 겹치지 않는 최선의 세트와 런에 포함되지 않은 카드들의 점수 합입니다."],
      ["언제 노크하거나 진을 할 수 있나요?", "카드를 뽑은 뒤 데드우드가 10점 이하면 노크할 수 있고, 0점이면 진으로 끝납니다."],
      ["덱이 다 떨어지면 어떻게 되나요?", "양쪽 손의 데드우드를 비교해 낮은 쪽이 라운드에서 이깁니다. 점수와 설정은 현재 브라우저에 남습니다."],
    ],
    related: "라운드가 끝나면 다른 카드 게임이나 간단한 배치 퍼즐도 즐겨 보세요.",
  },
  es: {
    name: "Gin Rummy", summary: "Roba una carta y descarta otra en cada turno. Forma grupos y escaleras del mismo palo, y decide cuándo plantarte o cerrar con Gin.",
    tags: ["Juego de cartas Gin Rummy", "Grupos y escaleras del mismo palo", "Robar y descartar"], genre: ["Juego de cartas", "Estrategia"],
    how: "Tú y la IA empezáis con diez cartas cada uno. En cada turno, toma una carta del mazo o la carta superior del descarte y luego descarta una. El objetivo es formar combinaciones y reducir el valor de las cartas que quedan fuera, llamadas cartas muertas.",
    steps: ["Un grupo reúne al menos tres cartas del mismo valor; una escalera tiene al menos tres valores consecutivos del mismo palo.", "El as vale 1 y las figuras valen 10. Las demás cartas sin combinar cuentan su valor.", "Después de robar, puedes plantarte con 10 puntos o menos de cartas muertas; con 0 terminas con Gin."],
    decision: "Mira la carta superior del descarte antes de robar: puede completar una combinación, y la carta que tomas del descarte queda a la vista, aunque tu mano sigue oculta. Los valores cercanos o cartas vecinas del mismo palo pueden crecer como escalera. Compara dejar cartas altas aisladas con plantarte ahora.",
    replay: "Cada ronda es una mano contra la IA; no hay campaña. El reparto y el orden de los descartes cambian las decisiones. La ronda termina con Gin, al plantarte o al agotarse el mazo; entonces gana quien tenga menos cartas muertas.",
    save: "La puntuación de la ronda y las preferencias se guardan en este navegador. La mano actual no se guarda en la nube. El juego público es gratis y no requiere cuenta ni compra.",
    faqTitle: "Preguntas sobre Gin Rummy",
    faq: [
      ["¿Cómo robo y descarto?", "Toma una carta del mazo o la carta superior del descarte, y luego elige una de tu mano para descartarla."],
      ["¿Qué son un grupo y una escalera?", "Un grupo tiene al menos tres cartas del mismo valor; una escalera, al menos tres valores consecutivos del mismo palo."],
      ["¿Qué cuentan como cartas muertas?", "Es el valor total de las cartas que no forman parte de los mejores grupos y escaleras sin solaparse."],
      ["¿Cuándo puedo plantarme o cerrar con Gin?", "Tras robar, puedes plantarte con 10 puntos o menos de cartas muertas. Con 0, la mano termina con Gin."],
      ["¿Qué pasa si se agota el mazo?", "Se comparan las cartas muertas de ambas manos; gana la cifra más baja. La puntuación y las preferencias quedan en este navegador."],
    ],
    related: "Cuando acabe la mano, prueba otro juego de cartas o un pequeño rompecabezas de colocación.",
  },
  "pt-BR": {
    name: "Gin Rummy", summary: "Compre uma carta e descarte outra a cada turno. Forme grupos e sequências do mesmo naipe e escolha quando bater ou fazer Gin.",
    tags: ["Jogo de cartas Gin Rummy", "Grupos e sequências do mesmo naipe", "Comprar e descartar"], genre: ["Jogo de cartas", "Estratégia"],
    how: "Você e a IA começam com dez cartas cada. Em cada turno, compre uma carta do monte ou a carta do topo do descarte e depois descarte uma. O objetivo é formar combinações e reduzir o valor das cartas que ficam de fora, chamadas cartas mortas.",
    steps: ["Um grupo tem pelo menos três cartas do mesmo valor; uma sequência tem ao menos três valores consecutivos do mesmo naipe.", "O ás vale 1 ponto e as figuras valem 10. As outras cartas sem combinação contam pelo próprio valor.", "Depois de comprar, bata com 10 pontos ou menos em cartas mortas; com 0, encerre com Gin."],
    decision: "Confira o topo do descarte antes de comprar: a carta pode completar uma combinação, e a carta que você pega do descarte fica visível, mas sua mão continua oculta. Valores próximos ou cartas vizinhas do mesmo naipe podem virar uma sequência. Compare manter cartas altas isoladas com bater agora.",
    replay: "Cada rodada é uma mão contra a IA, sem campanha. A distribuição e a ordem dos descartes mudam as decisões. A rodada termina com Gin, batida ou quando o monte acaba; nesse caso, vence quem tiver menos cartas mortas.",
    save: "A pontuação da rodada e as preferências ficam neste navegador. A mão atual não é salva na nuvem. O jogo público é gratuito e não exige conta nem compra.",
    faqTitle: "Dúvidas sobre Gin Rummy",
    faq: [
      ["Como compro e descarto?", "Pegue uma carta do monte ou do topo do descarte e depois escolha uma da mão para descartar."],
      ["O que são grupo e sequência?", "Um grupo tem ao menos três cartas do mesmo valor; uma sequência, três valores consecutivos do mesmo naipe ou mais."],
      ["O que são cartas mortas?", "É a soma dos pontos das cartas que não fazem parte das melhores combinações sem sobreposição da mão."],
      ["Quando posso bater ou fazer Gin?", "Depois de comprar, bata com 10 pontos ou menos em cartas mortas. Com 0, a mão termina em Gin."],
      ["O que ocorre quando o monte acaba?", "As cartas mortas das duas mãos são comparadas; vence o menor total. Pontuação e preferências ficam neste navegador."],
    ],
    related: "Depois da mão, experimente outro jogo de cartas ou um quebra-cabeça compacto de posicionamento.",
  },
  fr: {
    name: "Rami Gin", summary: "Piochez une carte et défaussez-en une à chaque tour. Formez des groupes et des suites de même couleur, puis choisissez quand toquer ou faire Gin.",
    tags: ["Jeu de cartes Gin rami", "Groupes et suites de même couleur", "Piocher et défausser"], genre: ["Jeu de cartes", "Stratégie"],
    how: "Vous et l’IA commencez avec dix cartes chacun. À chaque tour, prenez une carte de la pioche ou la première défaussée, puis défaussez une carte. Formez des combinaisons et réduisez la valeur des cartes isolées, appelées deadwood.",
    steps: ["Un groupe contient au moins trois cartes de même rang ; une suite, au moins trois rangs consécutifs de même couleur.", "L’as vaut 1 point et les figures 10. Les autres cartes non combinées valent leur rang.", "Après avoir pioché, toquez avec 10 points de deadwood ou moins ; à 0, terminez avec Gin."],
    decision: "Regardez la première défausse avant de piocher : elle peut compléter une combinaison, et la carte prise dans la défausse est visible, tandis que votre main reste cachée. Des rangs proches ou des cartes voisines de même couleur peuvent former une suite. Comparez le risque de garder une carte isolée élevée à celui de toquer.",
    replay: "Chaque manche est une main contre l’IA, sans campagne. La donne et l’ordre des défausses renouvellent les choix. Elle se termine par Gin, un Knock ou lorsque la pioche est épuisée ; dans ce dernier cas, le deadwood le plus faible l’emporte.",
    save: "Le score de manche et les préférences restent dans ce navigateur. La main en cours n’est pas enregistrée dans le cloud. Le jeu public est gratuit, sans compte ni achat.",
    faqTitle: "Questions sur Gin rami",
    faq: [
      ["Comment piocher et défausser ?", "Prenez une carte de la pioche ou la première défaussée, puis choisissez une carte de votre main à défausser."],
      ["Qu’est-ce qu’un groupe ou une suite ?", "Un groupe réunit au moins trois cartes de même rang ; une suite, au moins trois rangs consécutifs de même couleur."],
      ["Que signifie deadwood ?", "C’est la valeur totale des cartes qui ne font pas partie des meilleurs groupes et suites sans chevauchement."],
      ["Quand puis-je toquer ou faire Gin ?", "Après avoir pioché, vous pouvez toquer avec 10 points de deadwood ou moins. À 0, vous terminez avec Gin."],
      ["Que se passe-t-il si la pioche est vide ?", "Le deadwood des deux mains est comparé ; le total le plus bas gagne. Le score et les préférences restent dans ce navigateur."],
    ],
    related: "Après la main, essayez un autre jeu de cartes ou un petit casse-tête de placement.",
  },
  de: {
    name: "Gin Rommé", summary: "Ziehe pro Zug eine Karte und wirf eine ab. Bilde Sätze und Folgen derselben Farbe und entscheide, wann du klopfst oder Gin machst.",
    tags: ["Gin-Rommé-Kartenspiel", "Sätze und Folgen derselben Farbe", "Ziehen und abwerfen"], genre: ["Kartenspiel", "Strategie"],
    how: "Du und die KI beginnen jeweils mit zehn Karten. Ziehe pro Zug eine Karte vom Stock oder vom oberen Ablagestapel und wirf anschließend eine Karte ab. Bilde Melds und senke den Wert der nicht zugeordneten Karten, des sogenannten Deadwood.",
    steps: ["Ein Satz besteht aus mindestens drei Karten gleichen Rangs; eine Folge aus mindestens drei aufeinanderfolgenden Rängen derselben Farbe.", "Das Ass zählt 1 Punkt, Bildkarten zählen jeweils 10. Andere nicht zugeordnete Karten zählen ihren Rangwert.", "Nach dem Ziehen kannst du bei höchstens 10 Deadwood-Punkten klopfen; bei 0 beendest du die Hand mit Gin."],
    decision: "Prüfe vor dem Ziehen die oberste Ablagekarte: Sie kann eine Meld ergänzen, und die genommene Ablagekarte ist sichtbar, während deine Hand verborgen bleibt. Nahe Ränge oder benachbarte Karten derselben Farbe können zu einer Folge werden. Wäge isolierte hohe Karten gegen ein frühes Klopfen ab.",
    replay: "Jede Runde ist eine einzelne Hand gegen die KI, ohne Kampagne. Neue Karten und Ablagen bringen andere Entscheidungen. Die Hand endet mit Gin, Klopfen oder einem leeren Stock; dann gewinnt das niedrigere Deadwood.",
    save: "Rundenstand und Einstellungen bleiben in diesem Browser. Die aktuelle Hand wird nicht in der Cloud gespeichert. Das öffentliche Spiel ist kostenlos und benötigt weder Konto noch Kauf.",
    faqTitle: "Fragen zu Gin Rommé",
    faq: [
      ["Wie ziehe und werfe ich ab?", "Ziehe eine Karte vom Stock oder von der obersten Ablage und wähle dann eine Karte deiner Hand zum Abwerfen."],
      ["Was sind Satz und Folge?", "Ein Satz umfasst mindestens drei Karten gleichen Rangs; eine Folge mindestens drei aufeinanderfolgende Ränge derselben Farbe."],
      ["Was zählt als Deadwood?", "Das ist die Summe der Kartenwerte, die nicht zu den besten überschneidungsfreien Sätzen und Folgen gehören."],
      ["Wann kann ich klopfen oder Gin machen?", "Nach dem Ziehen kannst du bei höchstens 10 Deadwood-Punkten klopfen. Bei 0 endet die Hand mit Gin."],
      ["Was geschieht, wenn der Stock leer ist?", "Das Deadwood beider Hände wird verglichen; der niedrigere Wert gewinnt. Rundenstand und Einstellungen bleiben in diesem Browser."],
    ],
    related: "Nach der Hand kannst du ein anderes Kartenspiel oder ein kleines Legerätsel ausprobieren.",
  },
  it: {
    name: "Gin Rummy", summary: "Pesca una carta e scartane una a ogni turno. Crea gruppi e scale dello stesso seme, poi scegli quando bussare o chiudere con Gin.",
    tags: ["Gioco di carte Gin Rummy", "Gruppi e scale dello stesso seme", "Pescare e scartare"], genre: ["Gioco di carte", "Strategia"],
    how: "Tu e l’IA iniziate con dieci carte ciascuno. A ogni turno pesca una carta dal mazzo o dalla cima degli scarti, poi scartane una. Forma combinazioni e riduci il valore delle carte fuori dalle combinazioni, chiamate carte morte.",
    steps: ["Un gruppo contiene almeno tre carte dello stesso valore; una scala almeno tre valori consecutivi dello stesso seme.", "L’asso vale 1 punto e le figure 10. Le altre carte non abbinate valgono il proprio valore.", "Dopo aver pescato puoi bussare con 10 punti o meno di carte morte; con 0 chiudi con Gin."],
    decision: "Prima di pescare, guarda la carta in cima agli scarti: può completare una combinazione, e la carta presa dagli scarti è visibile, mentre la tua mano resta nascosta. Valori vicini o carte adiacenti dello stesso seme possono formare una scala. Valuta le carte alte isolate rispetto alla possibilità di bussare subito.",
    replay: "Ogni round è una mano contro l’IA, senza campagna. Distribuzione e ordine degli scarti cambiano le decisioni. La mano finisce con Gin, con una bussata o quando il mazzo si esaurisce; in quel caso vince chi ha meno carte morte.",
    save: "Il punteggio del round e le preferenze restano in questo browser. La mano in corso non viene salvata nel cloud. Il gioco pubblico è gratuito e non richiede account o acquisti.",
    faqTitle: "Domande su Gin Rummy",
    faq: [
      ["Come si pesca e si scarta?", "Prendi una carta dal mazzo o dalla cima degli scarti, poi scegline una dalla mano da scartare."],
      ["Cosa sono un gruppo e una scala?", "Un gruppo ha almeno tre carte dello stesso valore; una scala almeno tre valori consecutivi dello stesso seme."],
      ["Cosa sono le carte morte?", "È la somma dei punti delle carte che non rientrano nelle migliori combinazioni senza sovrapposizioni."],
      ["Quando posso bussare o fare Gin?", "Dopo aver pescato puoi bussare con 10 punti o meno di carte morte; con 0 la mano termina con Gin."],
      ["Cosa succede se finisce il mazzo?", "Si confrontano le carte morte delle due mani; vince il totale più basso. Punteggio e preferenze restano in questo browser."],
    ],
    related: "Dopo la mano, prova un altro gioco di carte o un piccolo rompicapo di posizionamento.",
  },
  ru: {
    name: "Джин-рамми", summary: "В каждом ходе возьмите одну карту и сбросьте одну. Собирайте сеты и одномастные последовательности, затем решайте, когда стучать или объявлять джин.",
    tags: ["Карточный джин-рамми", "Сеты и одномастные последовательности", "Взять и сбросить карту"], genre: ["Карточная игра", "Стратегия"],
    how: "Вы и ИИ начинаете с десяти карт. В свой ход возьмите карту из колоды или верхнюю карту сброса, затем сбросьте одну карту. Собирайте комбинации и уменьшайте сумму карт вне комбинаций — дедвуд.",
    steps: ["Сет состоит минимум из трёх карт одного ранга; последовательность — минимум из трёх карт одной масти с соседними рангами.", "Туз стоит 1 очко, картинки — по 10. Остальные карты вне комбинаций дают очки по своему рангу.", "После взятия карты можно стучать при дедвуде не больше 10; при 0 рука завершается джином."],
    decision: "Перед взятием проверьте верхнюю карту сброса: она может дополнить комбинацию, а взятая из сброса карта видна, хотя ваша рука остаётся скрытой. Соседние ранги или карты одной масти могут сложиться в последовательность. Сравните риск оставить старшую одиночную карту с возможностью стучать сейчас.",
    replay: "Каждый раунд — одна раздача против ИИ, без кампании. Новая раздача и порядок сброса меняют решения. Рука заканчивается джином, стуком или пустой колодой; при пустой колоде выигрывает меньший дедвуд.",
    save: "Счёт раундов и настройки хранятся в этом браузере. Текущая рука в облако не сохраняется. Игра бесплатна и не требует аккаунта или покупки.",
    faqTitle: "Вопросы о джин-рамми",
    faq: [
      ["Как брать и сбрасывать карты?", "Возьмите карту из колоды или верхнюю карту сброса, затем выберите одну карту из руки для сброса."],
      ["Что такое сет и последовательность?", "Сет — минимум три карты одного ранга; последовательность — минимум три соседних ранга одной масти."],
      ["Что считается дедвудом?", "Это сумма очков карт, не вошедших в лучшие непересекающиеся сеты и последовательности."],
      ["Когда можно стучать или объявить джин?", "После взятия карты можно стучать при дедвуде до 10 включительно; при 0 рука завершается джином."],
      ["Что будет, если колода закончится?", "Сравнивается дедвуд обеих рук, и выигрывает меньшая сумма. Счёт и настройки остаются в этом браузере."],
    ],
    related: "После раздачи попробуйте другую карточную игру или небольшую головоломку с размещением фигур.",
  },
  hi: {
    name: "जिन रमी", summary: "हर चाल में एक पत्ता लें और एक छोड़ें। सेट और एक ही सूट की क्रमिक पत्तियाँ बनाएँ, फिर नॉक या जिन से हाथ खत्म करने का समय चुनें।",
    tags: ["जिन रमी कार्ड गेम", "समान रैंक के सेट और एक सूट की क्रमिक पत्तियाँ", "पत्ता लेना और छोड़ना"], genre: ["ताश का खेल", "रणनीति"],
    how: "आप और AI दस-दस पत्तों से शुरू करते हैं। हर चाल में डेक या फेंकी गई गड्डी के ऊपर से एक पत्ता लें, फिर एक पत्ता छोड़ें। मेल बनाते हुए मेल से बाहर के पत्तों का कुल मूल्य घटाएँ; इन्हें डेडवुड कहते हैं।",
    steps: ["एक ही रैंक के कम से कम तीन पत्ते सेट बनाते हैं; एक ही सूट में लगातार कम से कम तीन रैंक रन बनाते हैं।", "इक्का 1 अंक और चित्र वाले पत्ते 10 अंक के होते हैं। बाकी बेमेल पत्ते अपने रैंक के अंक गिने जाते हैं।", "पत्ता लेने के बाद 10 या कम डेडवुड पर नॉक करें; 0 पर जिन से हाथ पूरा होता है।"],
    decision: "पत्ता लेने से पहले फेंकी गई गड्डी का ऊपर वाला पत्ता देखें। वह मेल पूरा कर सकता है, और फेंकी गड्डी से लिया गया पत्ता दिखता है, जबकि आपके हाथ के पत्ते छिपे रहते हैं। पास के रैंक या एक सूट के पड़ोसी पत्ते रन बना सकते हैं। अलग पड़े ऊँचे पत्तों को रखने और अभी नॉक करने के बीच तुलना करें।",
    replay: "हर राउंड AI के विरुद्ध एक हाथ है, कोई अभियान नहीं। नया बाँट और फेंके गए पत्तों का क्रम अलग फैसले लाते हैं। हाथ जिन, नॉक या डेक खत्म होने पर पूरा होता है; डेक खत्म हो तो कम डेडवुड वाला जीतता है।",
    save: "राउंड का स्कोर और सेटिंग इसी ब्राउज़र में रहती हैं। मौजूदा हाथ क्लाउड में सेव नहीं होता। सार्वजनिक खेल मुफ़्त है और खाता या खरीदारी नहीं चाहिए।",
    faqTitle: "जिन रमी के सवाल",
    faq: [
      ["पत्ता कैसे लें और छोड़ें?", "डेक या फेंकी गड्डी के ऊपर से एक पत्ता लें, फिर हाथ से एक पत्ता चुनकर छोड़ें।"],
      ["सेट और रन क्या हैं?", "एक रैंक के कम से कम तीन पत्ते सेट हैं; एक ही सूट के लगातार तीन या अधिक रैंक रन हैं।"],
      ["डेडवुड क्या होता है?", "हाथ के सबसे अच्छे बिना ओवरलैप वाले सेट और रन में शामिल न हुए पत्तों के अंकों का योग।"],
      ["नॉक या जिन कब कर सकते हैं?", "पत्ता लेने के बाद 10 या कम डेडवुड पर नॉक कर सकते हैं; 0 पर हाथ जिन से खत्म होता है।"],
      ["डेक खत्म होने पर क्या होता है?", "दोनों हाथों का डेडवुड तुलना होता है; कम कुल वाला जीतता है। स्कोर और सेटिंग इसी ब्राउज़र में रहती हैं।"],
    ],
    related: "हाथ के बाद कोई दूसरा कार्ड गेम या छोटी जगह-भरने वाली पहेली आज़माएँ।",
  },
  ar: {
    name: "جِن رامي", summary: "اسحب بطاقة وارمِ أخرى في كل دور. كوّن مجموعات وتسلسلات من النوع نفسه، ثم اختر وقت الطرق أو إنهاء اليد بجِن.",
    tags: ["لعبة ورق جِن رامي", "مجموعات وتسلسلات من النوع نفسه", "سحب ورمي البطاقات"], genre: ["لعبة ورق", "استراتيجية"],
    how: "تبدأ أنت والذكاء الاصطناعي بعشر بطاقات لكل منكما. في كل دور، اسحب بطاقة من الرزمة أو من أعلى كومة الرمي، ثم ارمِ بطاقة. كوّن مجموعات وخفّض قيمة البطاقات غير الداخلة فيها، وتسمى نقاطها ديدوود.",
    steps: ["تتكون المجموعة من ثلاث بطاقات أو أكثر بالرتبة نفسها؛ وتتكون المتتالية من ثلاث رتب متتابعة أو أكثر من النوع نفسه.", "تساوي الآس نقطة واحدة، وبطاقات الصور عشر نقاط لكل منها. وتُحسب بقية البطاقات غير المجمعة بحسب رتبتها.", "بعد السحب، يمكنك الطرق عند 10 نقاط ديدوود أو أقل؛ وعند 0 تنهي اليد بجِن."],
    decision: "افحص أعلى بطاقة في كومة الرمي قبل السحب: قد تكمل مجموعة، وتظل البطاقة المأخوذة من كومة الرمي ظاهرة، بينما تبقى يدك مخفية. قد تتحول الرتب المتقاربة أو البطاقات المتجاورة من النوع نفسه إلى متتالية. قارن الاحتفاظ ببطاقات عالية منفردة بالطرق الآن.",
    replay: "كل جولة يد واحدة ضد الذكاء الاصطناعي، من دون حملة. التوزيع وترتيب الرمي يغيران القرارات. تنتهي اليد بجِن أو بالطرق أو عند نفاد الرزمة؛ وعند نفادها يفوز صاحب نقاط الديدوود الأقل.",
    save: "يبقى رصيد الجولة والتفضيلات في هذا المتصفح. لا تُحفظ اليد الحالية في السحابة. اللعبة العامة مجانية ولا تحتاج إلى حساب أو شراء.",
    faqTitle: "أسئلة عن جِن رامي",
    faq: [
      ["كيف أسحب وأرمي بطاقة؟", "اسحب بطاقة من الرزمة أو من أعلى كومة الرمي، ثم اختر بطاقة من يدك لترميها."],
      ["ما المجموعة والمتتالية؟", "المجموعة ثلاث بطاقات أو أكثر من الرتبة نفسها؛ والمتتالية ثلاث رتب متتابعة أو أكثر من النوع نفسه."],
      ["ما نقاط الديدوود؟", "هي مجموع قيم البطاقات التي لا تدخل في أفضل مجموعات ومتتاليات ممكنة من دون تداخل."],
      ["متى يمكنني الطرق أو إنهاء اليد بجِن؟", "بعد السحب يمكنك الطرق عند 10 نقاط ديدوود أو أقل؛ وعند 0 تنتهي اليد بجِن."],
      ["ماذا يحدث عند نفاد الرزمة؟", "تُقارن نقاط الديدوود في اليدين ويفوز المجموع الأقل. يبقى الرصيد والتفضيلات في هذا المتصفح."],
    ],
    related: "بعد انتهاء اليد، جرّب لعبة ورق أخرى أو لغز ترتيب قطع صغيراً.",
  },
});

const escapeHtml = (value) => String(value).replace(/[&<>\"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
}[c]));

function setMetaContent(html, selector, value) {
  const escaped = escapeHtml(value);
  const pattern = new RegExp(`(<meta\\b(?=[^>]*${selector})[^>]*\\bcontent=["'])[^"']*(["'][^>]*>)`, "iu");
  return html.replace(pattern, `$1${escaped}$2`);
}

export function applyGinRummyTextGrowth(html, locale = "en") {
  const copy = COPY[locale] || COPY.en;
  const tags = `<div class="game-info-tags" data-wp-gameplay-tags="1.4.0">${copy.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>`;
  const faq = copy.faq.map(([question, answer]) => `<div><dt>${escapeHtml(question)}</dt><dd>${escapeHtml(answer)}</dd></div>`).join("");
  const relatedMatch = html.match(/<div class="game-info-related">[\s\S]*?<\/div><\/div>/iu);
  const relatedCards = relatedMatch ? relatedMatch[0].replace(/<\/div>$/u, "") : "<div class=\"game-info-related\"></div>";
  const sections = `<div class="game-info-sections">
    <div class="game-info-section"><h3>${locale === "en" ? "How to play" : locale === "ja" ? "遊び方" : locale === "ko" ? "遊び方" : locale === "es" ? "Cómo jugar" : locale === "pt-BR" ? "Como jogar" : locale === "fr" ? "Comment jouer" : locale === "de" ? "So wird gespielt" : locale === "it" ? "Come si gioca" : locale === "ru" ? "Как играть" : locale === "hi" ? "कैसे खेलें" : locale === "ar" ? "طريقة اللعب" : "玩法"}</h3><p>${escapeHtml(copy.how)}</p><ol>${copy.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></div>
    <div class="game-info-section"><h3>${locale === "en" ? "Decisions at the table" : locale === "ja" ? "判断のポイント" : locale === "ko" ? "테이블에서의 판단" : locale === "es" ? "Decisiones en la mesa" : locale === "pt-BR" ? "Decisões na mesa" : locale === "fr" ? "Choisir à la table" : locale === "de" ? "Entscheidungen am Tisch" : locale === "it" ? "Decisioni al tavolo" : locale === "ru" ? "Решения за столом" : locale === "hi" ? "टेबल पर फैसले" : locale === "ar" ? "قرارات اللعب" : "桌上的取捨"}</h3><p>${escapeHtml(copy.decision)}</p></div>
    <div class="game-info-section"><h3>${locale === "en" ? "Round and replay" : locale === "ja" ? "ラウンドと再プレイ" : locale === "ko" ? "라운드와 다시 하기" : locale === "es" ? "Ronda y repetición" : locale === "pt-BR" ? "Rodada e replay" : locale === "fr" ? "Manche et rejouer" : locale === "de" ? "Runde und Wiederholung" : locale === "it" ? "Round e rigiocabilità" : locale === "ru" ? "Раунд и повторная игра" : locale === "hi" ? "राउंड और दोबारा खेलना" : locale === "ar" ? "الجولة وإعادة اللعب" : "回合與重玩"}</h3><p>${escapeHtml(copy.replay)}</p></div>
    <div class="game-info-section"><h3>${locale === "en" ? "Player and save facts" : locale === "ja" ? "プレイと保存について" : locale === "ko" ? "플레이와 저장 안내" : locale === "es" ? "Datos del jugador y guardado" : locale === "pt-BR" ? "Informações e salvamento" : locale === "fr" ? "Joueur et sauvegarde" : locale === "de" ? "Spiel und Speichern" : locale === "it" ? "Giocatore e salvataggio" : locale === "ru" ? "Игра и сохранение" : locale === "hi" ? "खिलाड़ी और सेव जानकारी" : locale === "ar" ? "معلومات اللعب والحفظ" : "玩家與儲存說明"}</h3><p>${escapeHtml(copy.save)}</p></div>
    <div class="game-info-section"><h3>${escapeHtml(copy.faqTitle)}</h3><dl>${faq}</dl></div>
    <div class="game-info-section"><h3>${locale === "en" ? "Related games" : locale === "ja" ? "関連ゲーム" : locale === "ko" ? "관련 게임" : locale === "es" ? "Juegos relacionados" : locale === "pt-BR" ? "Jogos relacionados" : locale === "fr" ? "Jeux associés" : locale === "de" ? "Ähnliche Spiele" : locale === "it" ? "Giochi correlati" : locale === "ru" ? "Похожие игры" : locale === "hi" ? "संबंधित खेल" : locale === "ar" ? "ألعاب ذات صلة" : "相關遊戲"}</h3><p>${escapeHtml(copy.related)}</p>${relatedCards}</div>
  </div>`;
  const guide = `<section class="game-page-info classic-guide" data-runtime-localize="off"><div class="game-info-hero"><div class="game-info-title"><span class="game-info-kicker">${escapeHtml(locale === "en" ? "WeightPlay Original Game Guide" : locale === "ja" ? "WeightPlayオリジナルゲームガイド" : locale === "ko" ? "WeightPlay 오리지널 게임 가이드" : locale === "es" ? "Guía original de WeightPlay" : locale === "pt-BR" ? "Guia original da WeightPlay" : locale === "fr" ? "Guide original WeightPlay" : locale === "de" ? "Originaler WeightPlay-Spielguide" : locale === "it" ? "Guida originale WeightPlay" : locale === "ru" ? "Оригинальный гид WeightPlay" : locale === "hi" ? "WeightPlay मूल गेम गाइड" : locale === "ar" ? "دليل لعبة WeightPlay الأصلي" : "WeightPlay 原創遊戲指南")}</span><h2>${escapeHtml(copy.name)}</h2><p>${escapeHtml(copy.summary)}</p>${tags}</div><div class="game-info-facts"><div class="game-info-fact"><span>${locale === "en" ? "Gameplay" : locale === "ja" ? "ゲーム内容" : locale === "ko" ? "게임 방식" : locale === "es" ? "Juego" : locale === "pt-BR" ? "Jogabilidade" : locale === "fr" ? "Jeu" : locale === "de" ? "Spielweise" : locale === "it" ? "Gameplay" : locale === "ru" ? "Игровой процесс" : locale === "hi" ? "गेमप्ले" : locale === "ar" ? "أسلوب اللعب" : "玩法"}</span><strong>${escapeHtml(locale === "en" ? "Classic meld card game" : locale === "ja" ? "クラシックな役作りカードゲーム" : locale === "ko" ? "클래식 조합 카드 게임" : locale === "es" ? "Juego clásico de combinaciones" : locale === "pt-BR" ? "Jogo clássico de combinações" : locale === "fr" ? "Jeu classique de combinaisons" : locale === "de" ? "Klassisches Meld-Kartenspiel" : locale === "it" ? "Classico gioco di combinazioni" : locale === "ru" ? "Классическая карточная игра с комбинациями" : locale === "hi" ? "क्लासिक मेल्ड कार्ड गेम" : locale === "ar" ? "لعبة ورق كلاسيكية بتكوين المجموعات" : "經典組牌紙牌遊戲")}</strong></div><div class="game-info-fact"><span>${locale === "en" ? "Genre" : locale === "ja" ? "ジャンル" : locale === "ko" ? "장르" : locale === "es" ? "Género" : locale === "pt-BR" ? "Gênero" : locale === "fr" ? "Genre" : locale === "de" ? "Genre" : locale === "it" ? "Genere" : locale === "ru" ? "Жанр" : locale === "hi" ? "शैली" : locale === "ar" ? "النوع" : "類型"}</span><strong>${escapeHtml(locale === "en" ? "Card · Strategy" : locale === "ja" ? "カード · 戦略" : locale === "ko" ? "카드 · 전략" : locale === "es" ? "Cartas · Estrategia" : locale === "pt-BR" ? "Cartas · Estratégia" : locale === "fr" ? "Cartes · Stratégie" : locale === "de" ? "Karten · Strategie" : locale === "it" ? "Carte · Strategia" : locale === "ru" ? "Карты · Стратегия" : locale === "hi" ? "कार्ड · रणनीति" : locale === "ar" ? "ورق · استراتيجية" : "紙牌 · 策略")}</strong></div></div></div>${sections}</section>`;
  const guidePattern = /<section class=["']game-page-info (?:classic-guide|game-page-info-static)["'][^>]*>[\s\S]*?<\/section>/iu;
  if (!guidePattern.test(html)) throw new Error(`Gin Rummy Guide source not found for locale ${locale}`);
  html = html.replace(guidePattern, guide);
  html = setMetaContent(html, `\\bname=["']description["']`, copy.summary);
  html = setMetaContent(html, `\\bproperty=["']og:description["']`, copy.summary);
  html = setMetaContent(html, `\\bname=["']twitter:description["']`, copy.summary);
  let schemaCount = 0;
  html = html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/giu, (whole, open, body, close) => {
    try {
      const data = JSON.parse(body);
      if (data["@type"] !== "VideoGame" || data.name !== copy.name) return whole;
      data.description = copy.summary;
      data.keywords = copy.tags;
      data.genre = copy.genre;
      const links = [...html.matchAll(/<a\b[^>]*class=["'][^"']*game-info-related-card[^"']*["'][^>]*href=["']([^"']+)["']/giu)].map((match) => match[1]);
      if (links.length >= 2) data.relatedLink = links;
      schemaCount += 1;
      return `${open}${JSON.stringify(data, null, 2)}${close}`;
    } catch { return whole; }
  });
  if (schemaCount !== 1) throw new Error(`Expected one Gin Rummy VideoGame schema, found ${schemaCount} for ${locale}`);
  return html;
}

export const GIN_RUMMY_TEXT_140_LOCALES = Object.freeze(Object.keys(COPY));
export const GIN_RUMMY_TEXT_140_COPY = COPY;
