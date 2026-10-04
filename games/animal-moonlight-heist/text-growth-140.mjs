// Text Growth 1.4.0 source for Moonlight Heist's owned public route copy.
// Long-form factual Guide content and FAQ copy are authored in the route pages
// and localized by the runtime catalogs. This module owns locale-specific
// summary, search metadata, genre identity, gameplay tags, and two additional
// factual Japanese FAQs applied idempotently to the existing Japanese route.

export const MOONLIGHT_HEIST_TEXT_140 = Object.freeze({
  en: {
    summary: "Plan a route past moving patrols, recover the mission object, then reach extraction in this 30-mission stealth adventure. Optional treasure adds risk and rewards.",
    description: "Plan routes past moving patrols, recover each mission object, and reach extraction across 30 stealth missions. Optional treasure adds risk and rewards.",
    tagLabel: "Gameplay tags:", tags: ["stealth route planning", "patrol avoidance", "risk-based collection", "extraction adventure"],
    genre: ["Stealth", "Strategy", "Adventure"], alt: "Moonlight Heist game artwork",
    gameplay: "Stealth Extraction Adventure", factGenre: "Stealth · Strategy · Adventure", difficulty: "Medium to Hard", playTime: "3-8 minutes per mission",
    gadgetCopy: "The three gadgets support different approaches. Lightning Dash shortens committed movement time for patrol crossings. Star Decoy pauses patrols for a level-based duration. Smoke Leaf resets Alert and grants a short cover window. Gadget strengths are rolled from Level 1 to Level 3 before a mission. A confirmed three-Diamond reroll changes those strengths, while confirmed five-Diamond insurance preserves optional treasure through one capture. Neither purchase unlocks a mission or replaces free Retry.",
    treasureCopy: "Treasure is a deliberate detour that supplies the third medal and extra Moon Coins.",
  },
  "zh-Hant": {
    summary: "在這款 30 個任務的潛行冒險中，先規劃路線避開巡邏，再取得任務物件並抵達撤離點。額外寶藏能增加獎勵，也會提高風險。",
    description: "規劃路線避開移動巡邏，取得任務物件並抵達撤離點，完成 30 個潛行任務。額外寶藏帶來獎勵，也增加風險。",
    tagLabel: "玩法標籤：", tags: ["潛行路線規劃", "巡邏迴避", "風險取捨收集", "撤離冒險"],
    genre: ["潛行", "策略", "冒險"], alt: "月影潛行隊遊戲圖片",
    gameplay: "潛行撤離冒險", factGenre: "潛行 · 策略 · 冒險", difficulty: "中等至困難", playTime: "每個任務約 3 至 8 分鐘",
    gadgetCopy: "三種裝置各有不同用途。閃電衝刺會縮短移動時間，適合穿越巡邏線；星光誘餌會依等級暫停巡邏；煙霧葉會清空警報並提供短暫掩護。任務前會擲定 1 至 3 級強度。確認後花費 3 顆鑽石可重抽強度，花費 5 顆鑽石可投保額外寶藏，讓它承受一次被捕。兩種選擇都不會解鎖任務，也不會取代免費重試。",
    treasureCopy: "寶藏是刻意安排的繞路，可取得第三枚獎章與額外月光幣。",
  },
  "zh-Hans": {
    summary: "在这款包含 30 个任务的潜行冒险中，规划路线避开巡逻，取得任务物件后抵达撤离点。额外宝藏能增加奖励，也会提高风险。",
    description: "规划路线避开移动巡逻，取得任务物件并抵达撤离点，完成 30 个潜行任务。额外宝藏带来奖励，也增加风险。",
    tagLabel: "玩法标签：", tags: ["潜行路线规划", "巡逻规避", "风险取舍收集", "撤离冒险"],
    genre: ["潜行", "策略", "冒险"], alt: "月影潜行队游戏图片",
    gameplay: "潜行撤离冒险", factGenre: "潜行 · 策略 · 冒险", difficulty: "中等至困难", playTime: "每个任务约 3 至 8 分钟",
    gadgetCopy: "三种装置各有不同用途。闪电冲刺会缩短移动时间，适合穿越巡逻线；星光诱饵会按等级暂停巡逻；烟雾叶会清空警报并提供短暂掩护。任务前会掷定 1 至 3 级强度。确认后花费 3 颗钻石可重掷强度，花费 5 颗钻石可投保额外宝藏，让它承受一次被捕。两种选择都不会解锁任务，也不会取代免费重试。",
    treasureCopy: "宝藏是刻意安排的绕路，可获得第三枚奖章和额外月光币。",
  },
  ja: {
    summary: "全30ミッションのステルスアドベンチャーです。巡回を避けるルートを計画し、任務の品を回収して脱出地点へ向かいます。任意の宝物は報酬を増やしますが、危険も高まります。",
    description: "巡回を避けてルートを計画し、任務の品を回収して脱出する全30ミッションのステルスゲーム。任意の宝物は報酬と危険を増やします。",
    tagLabel: "ゲームプレイタグ：", tags: ["ステルスルート計画", "巡回回避", "リスクを伴う収集", "脱出アドベンチャー"],
    genre: ["ステルス", "戦略", "アドベンチャー"], alt: "月夜の潜入 ゲーム画像",
    gameplay: "ステルス脱出アドベンチャー", factGenre: "ステルス · 戦略 · アドベンチャー", difficulty: "中程度〜難しい", playTime: "1ミッション約3〜8分",
    gadgetCopy: "3つの装置は、それぞれ異なる場面で役立ちます。Lightning Dashは移動時間を短縮し、巡回の横断に便利です。Star Decoyはレベルに応じた時間だけ巡回を止めます。Smoke LeafはAlertをリセットし、短い隠れ時間を作ります。装置の強さはミッション前にレベル1〜3で決まります。確認後のDiamond 3個で強さを振り直せ、Diamond 5個の保険は一度の捕獲時に任意の宝を保ちます。どちらもミッションの解放には不要で、無料のRetryに代わるものではありません。",
    treasureCopy: "宝は意図的な寄り道です。3つ目のメダルと追加のMoon Coinsを得られます。",
    faqAppend: [
      ["宝物は必ず回収する必要がありますか？", "いいえ。通常は任意で、回収すると3つ目のメダルと追加のMoon Coinsを得られます。ただし、一部ミッションでは宝物が先に開ける封印として指定されます。"],
      ["巡回に見つかるとどうなりますか？", "Alertが満タンになると捕まってミッションが終了します。Retryは無料で、同じミッションから再挑戦できます。"],
    ],
  },
  ko: {
    summary: "30개 임무로 구성된 잠입 어드벤처입니다. 순찰을 피해 경로를 계획하고 임무 물건을 회수한 뒤 탈출 지점에 도달하세요. 선택 보물은 보상을 늘리지만 위험도 높입니다.",
    description: "순찰을 피해 경로를 짜고 임무 물건을 회수해 탈출하는 30개 잠입 임무. 선택 보물은 보상과 위험을 함께 늘립니다.",
    tagLabel: "플레이 태그:", tags: ["잠입 경로 계획", "순찰 회피", "위험 감수 수집", "탈출 어드벤처"],
    genre: ["잠입", "전략", "어드벤처"], alt: "Animal Moonlight Heist 게임 이미지",
    gameplay: "잠입 탈출 어드벤처", factGenre: "잠입 · 전략 · 모험", difficulty: "중간~어려움", playTime: "임무당 3~8분",
    gadgetCopy: "세 장비는 서로 다른 상황에서 쓰입니다. Lightning Dash는 이동 시간을 줄여 순찰선을 빠르게 건너게 합니다. Star Decoy는 레벨에 따른 시간 동안 순찰을 멈춥니다. Smoke Leaf는 경보를 초기화하고 잠시 몸을 숨겨 줍니다. 임무 전에 장비 강도가 1~3레벨로 정해집니다. 확인 후 다이아몬드 3개를 쓰면 강도를 다시 정할 수 있고, 다이아몬드 5개 보험은 한 번 잡혀도 선택 보물을 보존합니다. 둘 다 임무 해금에 필요하지 않으며 무료 재시도를 대신하지 않습니다.",
    treasureCopy: "보물은 일부러 돌아가는 선택지로, 세 번째 메달과 추가 문 코인을 줍니다.",
  },
  es: {
    summary: "En esta aventura de sigilo con 30 misiones, planea rutas para esquivar patrullas, recupera el objeto de cada misión y llega a la extracción. El tesoro opcional da más recompensa, pero añade riesgo.",
    description: "Planea rutas para esquivar patrullas, recupera cada objeto y llega a la extracción en 30 misiones de sigilo. El tesoro opcional añade riesgo y recompensa.",
    tagLabel: "Etiquetas de juego:", tags: ["planificación de rutas sigilosas", "evasión de patrullas", "colección con riesgo", "aventura de extracción"],
    genre: ["Sigilo", "Estrategia", "Aventura"], alt: "Imagen del juego Golpe a la Luz de la Luna",
    gameplay: "Aventura de sigilo y extracción", factGenre: "Sigilo · Estrategia · Aventura", difficulty: "Media a difícil", playTime: "3-8 min por misión",
    gadgetCopy: "Los tres dispositivos sirven para situaciones distintas. Lightning Dash acorta el tiempo de movimiento al cruzar una patrulla. Star Decoy detiene las patrullas durante un tiempo que depende del nivel. Smoke Leaf reinicia la Alerta y ofrece una breve cobertura. Antes de cada misión se determinan sus niveles de 1 a 3. Tras confirmar, gastar tres Diamantes permite repetir esa selección; el seguro de cinco Diamantes conserva el tesoro opcional tras una captura. Ninguna compra desbloquea misiones ni sustituye el reintento gratuito.",
    treasureCopy: "El tesoro es un desvío deliberado que aporta la tercera medalla y más Moon Coins.",
  },
  "pt-BR": {
    summary: "Nesta aventura furtiva de 30 missões, planeje rotas para evitar patrulhas, recupere o objeto da missão e alcance a extração. O tesouro opcional aumenta a recompensa e o risco.",
    description: "Planeje rotas para evitar patrulhas, recupere cada objeto e alcance a extração em 30 missões furtivas. O tesouro opcional traz risco e recompensa.",
    tagLabel: "Tags de jogabilidade:", tags: ["planejamento de rotas furtivas", "evasão de patrulhas", "coleta com risco", "aventura de extração"],
    genre: ["Furtividade", "Estratégia", "Aventura"], alt: "Imagem do jogo Moonlight Heist",
    gameplay: "Aventura furtiva de extração", factGenre: "Furtividade · Estratégia · Aventura", difficulty: "Média a difícil", playTime: "3-8 minutos por missão",
    gadgetCopy: "Os três dispositivos ajudam em situações diferentes. Lightning Dash reduz o tempo de movimento para atravessar uma linha de patrulha. Star Decoy pausa as patrulhas por um período definido pelo nível. Smoke Leaf reinicia o Alerta e oferece cobertura por pouco tempo. A força dos dispositivos é definida entre os níveis 1 e 3 antes da missão. Após confirmar, três Diamantes permitem sortear a força novamente; o seguro de cinco Diamantes preserva o tesouro opcional após uma captura. Nenhuma compra desbloqueia missões ou substitui a tentativa gratuita.",
    treasureCopy: "O tesouro é um desvio deliberado que rende a terceira medalha e mais Moon Coins.",
  },
  fr: {
    summary: "Dans cette aventure d’infiltration en 30 missions, planifiez des itinéraires pour éviter les patrouilles, récupérez l’objet de mission et rejoignez l’extraction. Le trésor facultatif augmente à la fois la récompense et le risque.",
    description: "Évitez les patrouilles, récupérez chaque objet et rejoignez l’extraction au fil de 30 missions d’infiltration. Le trésor facultatif ajoute risque et récompense.",
    tagLabel: "Tags de gameplay :", tags: ["planification d’itinéraires furtifs", "évitement des patrouilles", "collecte à risque", "aventure d’extraction"],
    genre: ["Infiltration", "Stratégie", "Aventure"], alt: "Image du jeu Moonlight Heist",
    gameplay: "Aventure d’infiltration et d’extraction", factGenre: "Infiltration · Stratégie · Aventure", difficulty: "Moyenne à difficile", playTime: "3 à 8 min par mission",
    gadgetCopy: "Les trois gadgets répondent à des situations différentes. Lightning Dash raccourcit le déplacement pour franchir une ligne de patrouille. Star Decoy immobilise les patrouilles pendant une durée liée à son niveau. Smoke Leaf remet l’alerte à zéro et offre un bref abri. Leur puissance est fixée entre les niveaux 1 et 3 avant la mission. Après confirmation, trois Diamants permettent de relancer ce tirage ; l’assurance à cinq Diamants préserve le trésor facultatif après une capture. Aucun achat ne débloque de mission ni ne remplace la reprise gratuite.",
    treasureCopy: "Le trésor est un détour volontaire qui rapporte la troisième médaille et des Moon Coins supplémentaires.",
  },
  de: {
    summary: "Plane in diesem Schleichabenteuer mit 30 Missionen Routen an Patrouillen vorbei, sichere den Missionsgegenstand und erreiche den Fluchtpunkt. Optionaler Schatz bringt mehr Belohnung, aber auch mehr Risiko.",
    description: "Plane Wege an Patrouillen vorbei, sichere Missionsgegenstände und erreiche in 30 Schleichmissionen den Fluchtpunkt. Optionaler Schatz bringt Risiko und Belohnung.",
    tagLabel: "Gameplay-Tags:", tags: ["Schleichrouten planen", "Patrouillen ausweichen", "Sammeln mit Risiko", "Fluchtabenteuer"],
    genre: ["Schleichen", "Strategie", "Abenteuer"], alt: "Animal Moonlight Heist Spielgrafik",
    gameplay: "Schleich- und Extraktionsabenteuer", factGenre: "Schleichen · Strategie · Abenteuer", difficulty: "Mittel bis schwer", playTime: "3–8 Minuten pro Mission",
    gadgetCopy: "Die drei Geräte helfen in unterschiedlichen Situationen. Lightning Dash verkürzt die Bewegungszeit und eignet sich zum Überqueren einer Patrouillenlinie. Star Decoy hält Patrouillen abhängig von seiner Stufe an. Smoke Leaf setzt den Alarm zurück und gewährt kurzzeitig Deckung. Die Gerätestärke wird vor jeder Mission auf Stufe 1 bis 3 festgelegt. Nach Bestätigung können drei Diamanten die Stärke neu auslosen; eine Versicherung für fünf Diamanten bewahrt optionalen Schatz nach einer Festnahme. Keine der Käufe schaltet Missionen frei oder ersetzt den kostenlosen Neustart.",
    treasureCopy: "Der Schatz ist ein geplanter Umweg und bringt die dritte Medaille sowie zusätzliche Moon Coins.",
  },
  it: {
    summary: "In questa avventura stealth di 30 missioni, pianifica percorsi per evitare le pattuglie, recupera l’oggetto della missione e raggiungi l’estrazione. Il tesoro facoltativo aumenta ricompensa e rischio.",
    description: "Evita le pattuglie, recupera ogni oggetto e raggiungi l’estrazione in 30 missioni stealth. Il tesoro facoltativo aggiunge rischio e ricompensa.",
    tagLabel: "Tag di gioco:", tags: ["pianificazione di percorsi furtivi", "evasione delle pattuglie", "raccolta rischiosa", "avventura di estrazione"],
    genre: ["Stealth", "Strategia", "Avventura"], alt: "Immagine del gioco Animal Moonlight Heist",
    gameplay: "Avventura stealth di estrazione", factGenre: "Stealth · Strategia · Avventura", difficulty: "Medio-difficile", playTime: "3-8 minuti per missione",
    gadgetCopy: "I tre gadget servono in situazioni diverse. Lightning Dash riduce il tempo di movimento ed è utile per attraversare una linea di pattuglia. Star Decoy ferma le pattuglie per una durata legata al livello. Smoke Leaf azzera l’Allerta e offre un breve riparo. Prima di ogni missione, la potenza dei gadget viene determinata tra i livelli 1 e 3. Dopo la conferma, tre Diamanti consentono di estrarla di nuovo; l’assicurazione da cinque Diamanti conserva il tesoro facoltativo dopo una cattura. Nessun acquisto sblocca missioni o sostituisce il tentativo gratuito.",
    treasureCopy: "Il tesoro è una deviazione voluta che offre la terza medaglia e altre Moon Coins.",
  },
  ru: {
    summary: "В этом приключении о скрытном проникновении на 30 заданий прокладывайте путь мимо патрулей, забирайте цель и добирайтесь до выхода. Необязательное сокровище увеличивает и награду, и риск.",
    description: "Обходите патрули, забирайте цель задания и добирайтесь до выхода в 30 миссиях о скрытном проникновении. Сокровище приносит награду и риск.",
    tagLabel: "Метки игрового процесса:", tags: ["планирование скрытных маршрутов", "уклонение от патрулей", "сбор с риском", "приключение с эвакуацией"],
    genre: ["Скрытность", "Стратегия", "Приключение"], alt: "Иллюстрация игры Animal Moonlight Heist",
    gameplay: "Стелс-приключение с эвакуацией", factGenre: "Скрытность · Стратегия · Приключение", difficulty: "Средняя — высокая", playTime: "3–8 минут на миссию",
    gadgetCopy: "Три устройства помогают в разных ситуациях. Lightning Dash сокращает время движения и помогает пересечь линию патруля. Star Decoy останавливает патрули на время, зависящее от уровня. Smoke Leaf сбрасывает тревогу и ненадолго укрывает Фию. Перед миссией устройствам случайно назначается уровень от 1 до 3. После подтверждения за три алмаза можно повторить выбор уровня; страховка за пять алмазов сохраняет дополнительное сокровище после одного захвата. Покупки не открывают миссии и не заменяют бесплатную попытку.",
    treasureCopy: "Сокровище — это запланированный обходной путь ради третьей медали и дополнительных Moon Coins.",
  },
  hi: {
    summary: "30 मिशनों वाले इस गुप्त-रास्ता साहसिक खेल में गश्त से बचने का रास्ता बनाएँ, मिशन की वस्तु पाएँ और निकास तक पहुँचें। वैकल्पिक खज़ाना इनाम बढ़ाता है, पर जोखिम भी।",
    description: "गश्त से बचें, मिशन की वस्तु पाएँ और 30 गुप्त मिशनों में निकास तक पहुँचें। वैकल्पिक खज़ाना इनाम और जोखिम दोनों बढ़ाता है।",
    tagLabel: "गेमप्ले टैग:", tags: ["गुप्त रास्ते की योजना", "गश्त से बचाव", "जोखिम के साथ संग्रह", "निकास साहसिक खेल"],
    genre: ["गुप्त अभियान", "रणनीति", "साहसिक खेल"], alt: "Animal Moonlight Heist गेम चित्र",
    gameplay: "गुप्त निकासी रोमांच", factGenre: "गुप्त अभियान · रणनीति · रोमांच", difficulty: "मध्यम से कठिन", playTime: "हर मिशन 3–8 मिनट",
    gadgetCopy: "तीनों उपकरण अलग-अलग परिस्थितियों में काम आते हैं। Lightning Dash चलने का समय घटाकर गश्ती रास्ता पार करने में मदद करता है। Star Decoy स्तर के अनुसार कुछ समय तक गश्त रोकता है। Smoke Leaf चेतावनी स्तर रीसेट करके थोड़ी देर की ओट देता है। मिशन से पहले उपकरणों की ताकत स्तर 1 से 3 के बीच तय होती है। पुष्टि के बाद तीन डायमंड खर्च करके ताकत फिर तय की जा सकती है; पाँच डायमंड का बीमा पकड़े जाने पर वैकल्पिक खज़ाना बचाता है। इनमें से कोई खरीद मिशन नहीं खोलती और न ही मुफ्त रीट्राई की जगह लेती है।",
    treasureCopy: "खज़ाना तीसरा पदक और अतिरिक्त Moon Coins पाने के लिए चुना गया अतिरिक्त रास्ता है।",
  },
  ar: {
    summary: "في مغامرة التسلل هذه المكوّنة من 30 مهمة، خطط لمسار يتجنب الدوريات، واستعد غرض المهمة، ثم وصل إلى نقطة الاستخراج. الكنز الاختياري يزيد المكافأة والمخاطرة معًا.",
    description: "خطط لمسارات تتجنب الدوريات، واستعد غرض كل مهمة، ثم وصل إلى الاستخراج عبر 30 مهمة تسلل. الكنز الاختياري يزيد المكافأة والمخاطرة.",
    tagLabel: "وسوم أسلوب اللعب:", tags: ["تخطيط مسارات التسلل", "تفادي الدوريات", "جمع مع مخاطرة", "مغامرة استخراج"],
    genre: ["تسلل", "استراتيجية", "مغامرة"], alt: "صورة لعبة Animal Moonlight Heist",
    gameplay: "مغامرة تسلل واستخراج", factGenre: "تسلل · استراتيجية · مغامرة", difficulty: "متوسط إلى صعب", playTime: "3–8 دقائق للمهمة",
    gadgetCopy: "تخدم الأدوات الثلاث مواقف مختلفة. تقلل Lightning Dash زمن الحركة لعبور خط دورية، بينما توقف Star Decoy الدوريات مدة تحددها مستواه. تعيد Smoke Leaf مستوى الإنذار وتوفر سترًا قصيرًا. تُحدد قوة الأدوات عشوائيًا بين المستوى 1 و3 قبل المهمة. بعد التأكيد، يمكن إنفاق ثلاثة ألماسات لإعادة الاختيار؛ ويحفظ تأمين الخمسة ألماسات الكنز الاختياري بعد الوقوع مرة واحدة. لا تفتح أي عملية شراء مهمة ولا تحل محل إعادة المحاولة المجانية.",
    treasureCopy: "الكنز التفافي اختياري يمنح الميدالية الثالثة ومزيدًا من Moon Coins.",
  },
});

const escapeHtml = value => String(value)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export function applyMoonlightHeistTextGrowth140(html, locale) {
  const copy = MOONLIGHT_HEIST_TEXT_140[locale.key];
  const factLabels = {
    en: ["Gameplay", "Genre", "Difficulty", "Estimated Play Time"],
    "zh-Hant": ["玩法", "類型", "難度", "預估遊玩時間"],
    "zh-Hans": ["玩法", "类型", "难度", "预计游玩时间"],
    ja: ["ゲーム内容", "ジャンル", "難易度", "プレイ時間の目安"],
    ko: ["게임 방식", "장르", "난이도", "예상 플레이 시간"],
    es: ["Jugabilidad", "Género", "Dificultad", "Tiempo estimado"],
    "pt-BR": ["Jogabilidade", "Gênero", "Dificuldade", "Tempo estimado"],
    fr: ["Gameplay", "Genre", "Difficulté", "Durée estimée"],
    de: ["Spielweise", "Genre", "Schwierigkeit", "Geschätzte Spielzeit"],
    it: ["Gameplay", "Genere", "Difficoltà", "Tempo stimato"],
    ru: ["Игровой процесс", "Жанр", "Сложность", "Время на миссию"],
    hi: ["खेल शैली", "शैली", "कठिनाई", "अनुमानित समय"],
    ar: ["أسلوب اللعب", "النوع", "الصعوبة", "الوقت المتوقع"],
  }[locale.key] || ["Gameplay", "Genre", "Difficulty", "Estimated Play Time"];
  if (!copy || copy.tags.length < 2 || copy.tags.length > 4) {
    throw new Error(`Missing Moonlight Heist Text Growth 1.4.0 copy: ${locale.key}`);
  }
  let out = String(html);
  const description = escapeHtml(copy.description);
  out = out.replace(/(<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["'])[^"']*(["'][^>]*>)/i, `$1${description}$2`);
  out = out.replace(/(<meta\b[^>]*\bproperty=["']og:description["'][^>]*\bcontent=["'])[^"']*(["'][^>]*>)/i, `$1${description}$2`);
  out = out.replace(/(<meta\b[^>]*\bname=["']twitter:description["'][^>]*\bcontent=["'])[^"']*(["'][^>]*>)/i, `$1${description}$2`);
  out = out.replace(/<body\b[^>]*>/i, opening => /\bdata-wp-game-owned-guide=/.test(opening)
    ? opening
    : opening.replace(/>$/, ' data-wp-game-owned-guide="true">'));
  out = out.replace(/(<section\b[^>]*class=["'][^"']*\bgame-page-info-static\b[^"']*["'][^>]*)(>)/i, (whole, opening, close) =>
    /\bdata-runtime-localize=/.test(opening) ? whole : `${opening} data-runtime-localize="off"${close}`);
  const intro = escapeHtml(copy.summary);
  const introPattern = /(<div\s+class=["']game-info-title["'][^>]*>[\s\S]*?<h2\b[^>]*>[\s\S]*?<\/h2>\s*)(<p\b[^>]*>)[\s\S]*?(<\/p>)/i;
  if (!introPattern.test(out)) throw new Error(`Missing Moonlight Heist Guide intro: ${locale.key}`);
  out = out.replace(introPattern, (_whole, before, paragraphTag, close) => {
    const ownedParagraphTag = /\bdata-runtime-localize=/.test(paragraphTag)
      ? paragraphTag
      : paragraphTag.replace(/>$/, ' data-runtime-localize="off">');
    return `${before}${ownedParagraphTag}${intro}${close}`;
  });
  const tags = `<!-- wp-moonlight-heist-tags:start --><article class="game-info-section game-info-gameplay-tags" data-wp-gameplay-tags-section="1.4.0" data-gameplay-tags-locale="${escapeHtml(locale.key)}" data-runtime-localize="off"><h3 data-wp-gameplay-tags-label>${escapeHtml(copy.tagLabel)}</h3><div class="game-info-tags" data-wp-gameplay-tags="1.4.0" data-runtime-localize="off">${copy.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div></article><!-- wp-moonlight-heist-tags:end -->`;
  const ownedTagPattern = /<!-- wp-moonlight-heist-tags:start -->[\s\S]*?<!-- wp-moonlight-heist-tags:end -->/i;
  const legacyTagPattern = /<div\s+class=["']game-info-tags["'][^>]*data-wp-gameplay-tags=["'][^"']+["'][^>]*>[\s\S]*?<\/div>/i;
  if (ownedTagPattern.test(out)) out = out.replace(ownedTagPattern, tags);
  else if (legacyTagPattern.test(out)) out = out.replace(legacyTagPattern, tags);
  else {
    const guideSections = /(<div\s+class=["']game-info-sections["'][^>]*>)/i;
    if (!guideSections.test(out)) throw new Error(`Missing Moonlight Heist gameplay-tag insertion point: ${locale.key}`);
    out = out.replace(guideSections, `$1${tags}`);
  }
  const factsPattern = /(<div\s+class=["']game-info-facts["'][^>]*>)[\s\S]*?(<\/div>\s*<\/div>)/i;
  if (factsPattern.test(out)) {
    const facts = `<div class="game-info-facts"><div class="game-info-fact"><span>${escapeHtml(factLabels[0])}</span><strong>${escapeHtml(copy.gameplay)}</strong></div><div class="game-info-fact"><span>${escapeHtml(factLabels[1])}</span><strong>${escapeHtml(copy.factGenre)}</strong></div><div class="game-info-fact"><span>${escapeHtml(factLabels[2])}</span><strong>${escapeHtml(copy.difficulty)}</strong></div><div class="game-info-fact"><span>${escapeHtml(factLabels[3])}</span><strong>${escapeHtml(copy.playTime)}</strong></div></div>`;
    out = out.replace(factsPattern, facts);
  }
  const gadgetPattern = /<p>The three gadgets support different approaches\.[\s\S]*?free Retry\.<\/p>/i;
  if (gadgetPattern.test(out)) out = out.replace(gadgetPattern, `<p>${escapeHtml(copy.gadgetCopy)}</p>`);
  const treasurePattern = /<p>(?:Cada ruta contiene|Each route contains)([\s\S]*?)<\/p>/i;
  if (treasurePattern.test(out)) {
    out = out.replace(treasurePattern, (paragraph) => paragraph.replace(/Treasure is a deliberate detour that supplies the third medal and extra Moon Coins\./, escapeHtml(copy.treasureCopy)));
  }
  if (copy.faqAppend) {
    const faqPattern = /(<div\s+class=["']game-info-section["']><h3>よくある質問<\/h3><dl>)([\s\S]*?)(<\/dl><\/div>)/;
    if (!faqPattern.test(out)) throw new Error(`Missing Japanese Moonlight Heist FAQ insertion point: ${locale.key}`);
    const faqBlock = `<!-- wp-moonlight-heist-faq-ja:start -->${copy.faqAppend.map(([question, answer]) => `<div><dt>${escapeHtml(question)}</dt><dd>${escapeHtml(answer)}</dd></div>`).join("")}<!-- wp-moonlight-heist-faq-ja:end -->`;
    out = out.replace(faqPattern, (whole, open, body, close) => {
      const ownedFaq = /<!-- wp-moonlight-heist-faq-ja:start -->[\s\S]*?<!-- wp-moonlight-heist-faq-ja:end -->/;
      const updatedBody = ownedFaq.test(body) ? body.replace(ownedFaq, faqBlock) : `${body}${faqBlock}`;
      return `${open}${updatedBody}${close}`;
    });
  }
  out = out.replace(/(<img\s+class=["']main-poster["'][^>]*\balt=["'])[^"']*(["'])/i, `$1${escapeHtml(copy.alt)}$2`);
  out = out.replace(/(<script\s+type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (whole, open, raw, close) => {
    let data;
    try { data = JSON.parse(raw); } catch { throw new Error(`Invalid Moonlight Heist JSON-LD: ${locale.key}`); }
    const patchVideoGame = value => {
      if (!value || typeof value !== "object") return;
      if (value["@type"] === "VideoGame") {
        value.description = copy.description;
        value.genre = [...copy.genre];
      }
      Object.values(value).forEach(patchVideoGame);
    };
    patchVideoGame(data);
    return `${open}${JSON.stringify(data)}${close}`;
  });
  const finalDescriptionTag = out.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0] || "";
  if (/content=["'][^"']*\.\.\./i.test(finalDescriptionTag)) {
    throw new Error(`Truncated Moonlight Heist metadata remains: ${locale.key}: ${finalDescriptionTag}`);
  }
  return out;
}
