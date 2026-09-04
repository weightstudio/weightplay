(() => {
  const keys = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const english = {
    title: "Constellation Keeper", kicker: "A calm relationship-deduction puzzle", intro: "Read two sky rules, choose the only animal constellation that obeys them, and restore the night maps.", back: "Back", settings: "Settings", language: "Language", sound: "Sound", on: "On", off: "Off", loading: "Preparing the night sky…", start: "Start the first map", choose: "Choose a map", best: "Best checks", noBest: "Not yet", guideTitle: "How to play", guideOne: "Read the two relationship rules.", guideTwo: "Tap the one constellation board that fits both.", guideThree: "A wrong choice stays visible so you can calmly try again.", maps: "Night maps", map: "Night maps", rules: "Sky rules", chooseConstellation: "Choose a constellation", check: "Check constellation", clear: "Clear choice", waiting: "Choose one constellation board, then check it.", selected: "Constellation selected. Check it when ready.", wrong: "That map breaks {hint}. Read both rules and try another board.", correct: "The relationships fit. The night map is restored.", round: "Map {n} of {total}", open: "Open", complete: "Restored", resultTitle: "The sky is whole", resultPartial: "Map restored", resultText: "You restored {count} of {total} night maps with {checks} checks.", next: "Next map", replay: "Replay", home: "Back to menu", mapOption: "Constellation {label}", guideSummary: "Read visible relationships between animal stars, then choose the one map that obeys both rules.", gameplayFact: "Gameplay", gameplayValue: "Relationship deduction", genreFact: "Genre", genreValue: "Puzzle · Logic · Family · Animal", resultGuideTitle: "Results and saves", resultGuide: "Four night maps form one short session. The best total checks is stored only in this browser when storage is available.", tipsTitle: "Practical tips", tips: "Read each relation literally: above, below, left, or right. The boards stay visible, so every choice can be checked fairly.", map1: "Moon Pine", map2: "Quiet Ridge", map3: "Dawn Hollow", map1Intro: "Orla's first sky chart is missing one safe pattern.", map2Intro: "A ridge beacon needs its neighbours in the right places.", map3Intro: "The last hollow opens when the three stars keep their vertical promise.", clue1a: "The Owl is directly above the Fox.", clue1b: "The Rabbit is directly right of the Fox.", clue2a: "The Deer is directly left of the Otter.", clue2b: "The Hare is directly right of the Otter.", clue3a: "The Owl is directly above the Bear.", clue3b: "The Mole is directly below the Bear.", map1A: "Fox centre", map1B: "Rabbit centre", map1C: "Owl centre", map2A: "Otter centre", map2B: "Deer centre", map2C: "Hare centre", map3A: "Bear centre", map3B: "Owl centre", map3C: "Mole centre", fox: "Fox", owl: "Owl", rabbit: "Rabbit", deer: "Deer", otter: "Otter", hare: "Hare", bear: "Bear", mole: "Mole", allMaps: "All four maps are open."
  };
  const variants = {
    "zh-Hant": { title: "動物星圖守護員", kicker: "平靜的關係推理益智", intro: "閱讀兩條星空規則，選出唯一符合的動物星圖，修復夜空地圖。", back: "返回", settings: "設定", language: "語言", sound: "音效", on: "開", off: "關", loading: "準備夜空中⋯", start: "開始第一幅地圖", choose: "選擇地圖", best: "最佳檢查次數", noBest: "尚未完成", guideTitle: "玩法", guideOne: "閱讀兩條關係規則。", guideTwo: "點選同時符合兩條規則的星圖。", guideThree: "選錯時畫面會保留，讓你平靜重試。", maps: "夜空地圖", rules: "星空規則", chooseConstellation: "選擇星圖", check: "檢查星圖", clear: "清除選擇", waiting: "先選一張星圖，再進行檢查。", selected: "已選擇星圖，準備好就檢查吧。", wrong: "這張地圖違反了「{hint}」。讀完兩條規則，再試另一張。", correct: "關係正確，夜空地圖已修復。", round: "第 {n} 幅／共 {total} 幅", open: "開放", complete: "已修復", resultTitle: "夜空完整了", resultPartial: "地圖已修復", resultText: "你用 {checks} 次檢查修復了 {count}／{total} 幅夜空地圖。", next: "下一幅地圖", replay: "重玩", home: "返回選單", map: "夜空地圖", guideSummary: "閱讀動物星星之間的可見關係，選出同時遵守兩條規則的地圖。", gameplayValue: "關係推理", genreValue: "益智・邏輯・家庭・動物", resultGuideTitle: "結果與保存", resultGuide: "四幅夜空地圖組成一段短流程。最佳檢查次數只會在可用時保存在本機瀏覽器。", tipsTitle: "小提示", tips: "仔細閱讀上、下、左、右的關係。星圖會一直可見，每個選擇都能公平核對。", map1: "月松林", map2: "靜謐山脊", map3: "黎明谷", map1Intro: "奧拉的第一張星圖少了一個安全圖樣。", map2Intro: "山脊信標需要正確的鄰居位置。", map3Intro: "三顆星守住垂直關係，最後的山谷就會開啟。", map1A: "狐狸在中央", map1B: "兔子在中央", map1C: "貓頭鷹在中央", map2A: "水獺在中央", map2B: "鹿在中央", map2C: "野兔在中央", map3A: "熊在中央", map3B: "貓頭鷹在中央", map3C: "鼴鼠在中央", fox: "狐狸", owl: "貓頭鷹", rabbit: "兔子", deer: "鹿", otter: "水獺", hare: "野兔", bear: "熊", mole: "鼴鼠", allMaps: "四幅地圖都已開放。" },
    "zh-Hans": { title: "动物星图守护员", back: "返回", settings: "设置", language: "语言", sound: "音效", on: "开", off: "关", start: "开始第一幅地图", choose: "选择地图", best: "最佳检查次数", guideTitle: "玩法", maps: "夜空地图", rules: "星空规则", chooseConstellation: "选择星图", check: "检查星图", clear: "清除选择", next: "下一幅地图", replay: "重玩", home: "返回菜单", correct: "关系正确，夜空地图已修复。", wrong: "这张地图违反了“{hint}”。读完两条规则，再试另一张。", open: "开放", complete: "已修复", fox: "狐狸", owl: "猫头鹰", rabbit: "兔子", deer: "鹿", otter: "水獭", hare: "野兔", bear: "熊", mole: "鼹鼠" },
    ja: { title: "どうぶつ星座守り", back: "戻る", settings: "設定", language: "言語", sound: "音", on: "オン", off: "オフ", start: "最初のマップへ", choose: "マップを選ぶ", maps: "夜空マップ", rules: "星空のルール", chooseConstellation: "星座を選ぶ", check: "星座を確認", clear: "選択を消す", next: "次のマップ", replay: "もう一度", home: "メニューへ戻る", correct: "関係が合いました。夜空マップを修復しました。", wrong: "そのマップは「{hint}」に合いません。別の星座を試しましょう。", fox: "キツネ", owl: "フクロウ", rabbit: "ウサギ", deer: "シカ", otter: "カワウソ", hare: "ノウサギ", bear: "クマ", mole: "モグラ" },
    ko: { title: "동물 별자리 지킴이", back: "뒤로", settings: "설정", language: "언어", sound: "소리", on: "켜짐", off: "꺼짐", start: "첫 지도 시작", choose: "지도 선택", maps: "밤하늘 지도", rules: "별자리 규칙", chooseConstellation: "별자리 선택", check: "별자리 확인", clear: "선택 지우기", next: "다음 지도", replay: "다시 하기", home: "메뉴로", correct: "관계가 맞아요. 밤하늘 지도를 복원했어요.", wrong: "이 지도는 ‘{hint}’에 맞지 않아요. 다른 별자리를 골라 보세요.", fox: "여우", owl: "부엉이", rabbit: "토끼", deer: "사슴", otter: "수달", hare: "산토끼", bear: "곰", mole: "두더지" },
    es: { title: "Guardián de Constelaciones", back: "Volver", settings: "Ajustes", language: "Idioma", sound: "Sonido", on: "Sí", off: "No", start: "Empezar el primer mapa", choose: "Elegir un mapa", maps: "Mapas nocturnos", rules: "Reglas del cielo", chooseConstellation: "Elige una constelación", check: "Comprobar", clear: "Borrar elección", next: "Siguiente mapa", replay: "Repetir", home: "Volver al menú", correct: "Las relaciones encajan. El mapa nocturno está restaurado.", wrong: "Ese mapa rompe «{hint}». Lee las dos reglas y prueba otro.", fox: "Zorro", owl: "Búho", rabbit: "Conejo", deer: "Ciervo", otter: "Nutria", hare: "Liebre", bear: "Oso", mole: "Topo" },
    "pt-BR": { title: "Guardião das Constelações", back: "Voltar", settings: "Configurações", language: "Idioma", sound: "Som", on: "Ligado", off: "Desligado", start: "Começar o primeiro mapa", choose: "Escolher um mapa", maps: "Mapas noturnos", rules: "Regras do céu", chooseConstellation: "Escolha uma constelação", check: "Conferir", clear: "Limpar escolha", next: "Próximo mapa", replay: "Jogar novamente", home: "Voltar ao menu", correct: "As relações combinam. O mapa noturno foi restaurado.", wrong: "Esse mapa quebra “{hint}”. Leia as duas regras e tente outro.", fox: "Raposa", owl: "Coruja", rabbit: "Coelho", deer: "Cervo", otter: "Lontra", hare: "Lebre", bear: "Urso", mole: "Toupeira" },
    fr: { title: "Gardien des constellations", back: "Retour", settings: "Réglages", language: "Langue", sound: "Son", on: "Activé", off: "Désactivé", start: "Commencer la première carte", choose: "Choisir une carte", maps: "Cartes nocturnes", rules: "Règles du ciel", chooseConstellation: "Choisir une constellation", check: "Vérifier", clear: "Effacer le choix", next: "Carte suivante", replay: "Rejouer", home: "Retour au menu", correct: "Les relations conviennent. La carte est restaurée.", wrong: "Cette carte ne respecte pas «{hint}». Lis les deux règles et réessaie.", fox: "Renard", owl: "Hibou", rabbit: "Lapin", deer: "Cerf", otter: "Loutre", hare: "Lièvre", bear: "Ours", mole: "Taupe" },
    de: { title: "Sternbild-Hüter", back: "Zurück", settings: "Einstellungen", language: "Sprache", sound: "Ton", on: "An", off: "Aus", start: "Erste Karte starten", choose: "Karte wählen", maps: "Nachtkarten", rules: "Himmelsregeln", chooseConstellation: "Sternbild wählen", check: "Prüfen", clear: "Auswahl löschen", next: "Nächste Karte", replay: "Nochmal spielen", home: "Zum Menü", correct: "Die Beziehungen stimmen. Die Nachtkarte ist wiederhergestellt.", wrong: "Diese Karte verletzt „{hint}“. Lies beide Regeln und versuche es erneut.", fox: "Fuchs", owl: "Eule", rabbit: "Hase", deer: "Hirsch", otter: "Otter", hare: "Feldhase", bear: "Bär", mole: "Maulwurf" },
    it: { title: "Custode delle costellazioni", back: "Indietro", settings: "Impostazioni", language: "Lingua", sound: "Suono", on: "Attivo", off: "Disattivo", start: "Inizia la prima mappa", choose: "Scegli una mappa", maps: "Mappe notturne", rules: "Regole del cielo", chooseConstellation: "Scegli una costellazione", check: "Controlla", clear: "Cancella scelta", next: "Mappa successiva", replay: "Gioca di nuovo", home: "Torna al menu", correct: "Le relazioni coincidono. La mappa notturna è ripristinata.", wrong: "Questa mappa non rispetta «{hint}». Leggi le regole e prova ancora.", fox: "Volpe", owl: "Gufo", rabbit: "Coniglio", deer: "Cervo", otter: "Lontra", hare: "Lepre", bear: "Orso", mole: "Talpa" },
    ru: { title: "Хранитель созвездий", back: "Назад", settings: "Настройки", language: "Язык", sound: "Звук", on: "Вкл.", off: "Выкл.", start: "Начать первую карту", choose: "Выбрать карту", maps: "Ночные карты", rules: "Правила неба", chooseConstellation: "Выберите созвездие", check: "Проверить", clear: "Очистить выбор", next: "Следующая карта", replay: "Сыграть снова", home: "В меню", correct: "Связи совпали. Ночная карта восстановлена.", wrong: "Эта карта нарушает «{hint}». Прочитайте оба правила и попробуйте снова.", fox: "Лиса", owl: "Сова", rabbit: "Кролик", deer: "Олень", otter: "Выдра", hare: "Заяц", bear: "Медведь", mole: "Крот" },
    hi: { title: "नक्षत्र रक्षक", back: "वापस", settings: "सेटिंग", language: "भाषा", sound: "ध्वनि", on: "चालू", off: "बंद", start: "पहला मानचित्र शुरू करें", choose: "मानचित्र चुनें", maps: "रात के मानचित्र", rules: "आकाश के नियम", chooseConstellation: "नक्षत्र चुनें", check: "जाँचें", clear: "चयन हटाएँ", next: "अगला मानचित्र", replay: "फिर खेलें", home: "मेनू पर", correct: "संबंध सही हैं। रात का मानचित्र बहाल हो गया।", wrong: "यह मानचित्र “{hint}” तोड़ता है। दोनों नियम पढ़कर फिर प्रयास करें।", fox: "लोमड़ी", owl: "उल्लू", rabbit: "खरगोश", deer: "हिरन", otter: "ऊदबिलाव", hare: "खरहा", bear: "भालू", mole: "छछूंदर" },
    ar: { title: "حارس الكوكبات", back: "رجوع", settings: "الإعدادات", language: "اللغة", sound: "الصوت", on: "تشغيل", off: "إيقاف", start: "ابدأ الخريطة الأولى", choose: "اختر خريطة", maps: "خرائط ليلية", rules: "قواعد السماء", chooseConstellation: "اختر كوكبة", check: "تحقق", clear: "امسح الاختيار", next: "الخريطة التالية", replay: "أعد اللعب", home: "العودة للقائمة", correct: "العلاقات صحيحة. أُصلحت الخريطة الليلية.", wrong: "تخالف هذه الخريطة «{hint}». اقرأ القاعدتين وحاول خريطة أخرى.", fox: "ثعلب", owl: "بومة", rabbit: "أرنب", deer: "أيل", otter: "قندس", hare: "أرنب بري", bear: "دب", mole: "خلد" }
  };
  const map4Translations = {
    en: { map4: "Starfall Crossing", map4Intro: "The starfall crossing opens when two neighbours share one corner.", clue4a: "The Rabbit is directly left of the Owl.", clue4b: "The Bear is directly below the Rabbit.", map4A: "Rabbit west", map4B: "Owl west", map4C: "Bear west", resultGuide: "Four night maps form one short session. The best total checks is stored only in this browser when storage is available.", allMaps: "All four maps are open." },
    "zh-Hant": { map4: "星墜交界", map4Intro: "當兩位鄰居共享一個角落，星墜交界就會開啟。", clue4a: "兔子就在貓頭鷹的左邊。", clue4b: "熊就在兔子的下方。", map4A: "兔子在西側", map4B: "貓頭鷹在西側", map4C: "熊在西側", resultGuide: "四幅夜空地圖組成一段短流程。最佳檢查次數只會在可用時保存在本機瀏覽器。", allMaps: "四幅地圖都已開放。" },
    "zh-Hans": { map4: "星落交界", map4Intro: "当两位邻居共享一个角落，星落交界就会开启。", clue4a: "兔子就在猫头鹰的左边。", clue4b: "熊就在兔子的下方。", map4A: "兔子在西侧", map4B: "猫头鹰在西侧", map4C: "熊在西侧" },
    ja: { map4: "星降りの交差点", map4Intro: "二つの隣り合う星が一つの角を共有すると、星降りの交差点が開きます。", clue4a: "ウサギはフクロウの真左にいます。", clue4b: "クマはウサギの真下にいます。", map4A: "ウサギが西", map4B: "フクロウが西", map4C: "クマが西" },
    ko: { map4: "별빛 교차로", map4Intro: "두 이웃 별이 한 모서리를 함께 쓰면 별빛 교차로가 열립니다.", clue4a: "토끼는 부엉이 바로 왼쪽에 있어요.", clue4b: "곰은 토끼 바로 아래에 있어요.", map4A: "토끼가 서쪽", map4B: "부엉이가 서쪽", map4C: "곰이 서쪽" },
    es: { map4: "Cruce de estrellas", map4Intro: "El cruce se abre cuando dos vecinos comparten una esquina.", clue4a: "El conejo está justo a la izquierda del búho.", clue4b: "El oso está justo debajo del conejo.", map4A: "Conejo al oeste", map4B: "Búho al oeste", map4C: "Oso al oeste" },
    "pt-BR": { map4: "Encontro das estrelas", map4Intro: "O encontro se abre quando dois vizinhos compartilham um canto.", clue4a: "O coelho está diretamente à esquerda da coruja.", clue4b: "O urso está diretamente abaixo do coelho.", map4A: "Coelho a oeste", map4B: "Coruja a oeste", map4C: "Urso a oeste" },
    fr: { map4: "Carrefour des étoiles", map4Intro: "Le carrefour s'ouvre quand deux voisines partagent un coin.", clue4a: "Le lapin est juste à gauche du hibou.", clue4b: "L'ours est juste sous le lapin.", map4A: "Lapin à l'ouest", map4B: "Hibou à l'ouest", map4C: "Ours à l'ouest" },
    de: { map4: "Sternfall-Kreuzung", map4Intro: "Die Kreuzung öffnet sich, wenn zwei Nachbarn eine Ecke teilen.", clue4a: "Der Hase ist direkt links von der Eule.", clue4b: "Der Bär ist direkt unter dem Hasen.", map4A: "Hase im Westen", map4B: "Eule im Westen", map4C: "Bär im Westen" },
    it: { map4: "Incrocio di stelle", map4Intro: "L'incrocio si apre quando due vicini condividono un angolo.", clue4a: "Il coniglio è direttamente a sinistra del gufo.", clue4b: "L'orso è direttamente sotto il coniglio.", map4A: "Coniglio a ovest", map4B: "Gufo a ovest", map4C: "Orso a ovest" },
    ru: { map4: "Звёздный перекрёсток", map4Intro: "Перекрёсток открывается, когда два соседа делят один угол.", clue4a: "Кролик находится прямо слева от совы.", clue4b: "Медведь находится прямо под кроликом.", map4A: "Кролик слева", map4B: "Сова слева", map4C: "Медведь слева" },
    hi: { map4: "तारों का चौराहा", map4Intro: "जब दो पड़ोसी एक कोना साझा करते हैं, तारों का चौराहा खुलता है।", clue4a: "खरगोश उल्लू के ठीक बाईं ओर है।", clue4b: "भालू खरगोश के ठीक नीचे है।", map4A: "खरगोश पश्चिम में", map4B: "उल्लू पश्चिम में", map4C: "भालू पश्चिम में" },
    ar: { map4: "تقاطع النجوم", map4Intro: "يفتح التقاطع عندما يتشارك جاران زاوية واحدة.", clue4a: "الأرنب يقع مباشرة إلى يسار البومة.", clue4b: "الدب يقع مباشرة أسفل الأرنب.", map4A: "الأرنب غرباً", map4B: "البومة غرباً", map4C: "الدب غرباً" }
  };
  window.ANIMAL_CONSTELLATION_KEEPER_LOCALES = Object.fromEntries(keys.map((key) => [key, { ...english, ...(variants[key] || {}), ...(map4Translations[key] || {}) }]));
})();

(() => {
  const tables = window.ANIMAL_CONSTELLATION_KEEPER_LOCALES || {};
  const keys = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const namesEn = [
    "Moon Pine Gate", "Owl's Meridian", "Quiet Ridge Pair", "Dawn Fox Lookout", "Lantern Grove Checkpoint",
    "Crosswind Meadow", "Twin Comet Turn", "Deerline Pass", "Otter's Axis", "Horizon Keeper Checkpoint",
    "Diagonal Dawn", "Rabbit's Slant", "Bearglass Trail", "Mothwing Mirror", "Starfold Checkpoint",
    "Cornerstone Clearing", "Fernbound Corner", "Mossy Angle", "Foxglove Turn", "Four-Corner Checkpoint",
    "Zigzag Brook", "Hare's Echo", "Split-Pine Path", "Owlstep Bend", "Chainlight Checkpoint",
    "Northstar Fork", "Silver Diagonal", "Mooncap Corner", "Last Alignment", "Constellation Crown"
  ];
  const introsEn = [
    "Learn the left-and-right sky rule with a clear three-star line.", "Read the vertical neighbours and keep the middle star anchored.", "Pair two horizontal relations without swapping the centre.", "Use the above-and-below rule to settle a quiet lookout.", "Checkpoint: two neighbours guard the lantern grove; read both directions before choosing.",
    "Crosswind introduces a vertical relation after the first arc.", "Turn from a horizontal clue to its opposite without losing the anchor.", "The pass mixes a top clue with a lower counter-pattern.", "Follow the axis through the middle star and ignore the mirrored decoy.", "Checkpoint: the horizon keeper changes the axis; choose the board that preserves both vertical clues.",
    "Diagonal Dawn introduces corner-to-corner relationships.", "The rabbit's slant is a diagonal clue, not a row clue.", "A reflected diagonal tests whether you read both positions.", "The mirror board reverses the diagonal order; compare endpoints.", "Checkpoint: the starfold folds both diagonal directions into one readable proof.",
    "Cornerstone moves the proof to an edge and a shared corner.", "The fern corner keeps the left neighbour at the boundary.", "Use the lower corner as a second anchor instead of the centre.", "Foxglove turns the corner order while the same animals remain visible.", "Checkpoint: four corners compete; follow the two named neighbours, not the brightest star.",
    "Zigzag Brook introduces a stepped vertical chain.", "The hare's echo keeps the middle anchor while the endpoints shift.", "A split pine hides the chain in a gentle zigzag.", "Owlstep bends the chain and tests the upper clue first.", "Checkpoint: chainlight combines the full zigzag vocabulary into one final proof.",
    "Northstar Fork begins the mastery arc with a split horizontal proof.", "Silver Diagonal combines the diagonal endpoint rule with late-campaign decoys.", "Mooncap Corner asks you to hold an edge anchor and a vertical clue together.", "Last Alignment mixes the vertical family with a final reflected option.", "Checkpoint: the constellation crown is the distinct finale; read every relation before restoring the sky."
  ];
  const namesZh = [
    "月松林關口", "貓頭鷹子午線", "靜謐山脊雙星", "黎明狐影台", "燈籠林檢查點",
    "穿風草甸", "雙彗星轉彎", "鹿線通道", "水獺星軸", "地平線守護檢查點",
    "斜線黎明", "兔子的斜徑", "熊玻璃小徑", "蛾翼映像", "星折檢查點",
    "基石空地", "蕨葉角落", "苔蘚角度", "狐花轉彎", "四角檢查點",
    "之字溪流", "野兔回聲", "分岔松徑", "貓頭鷹踏步彎", "鏈光檢查點",
    "北極星分岔", "銀色斜線", "月帽角落", "最後校準", "星圖皇冠"
  ];
  const introsZh = [
    "先用清楚的三顆星直線學會左右關係。", "閱讀垂直鄰居，讓中央星保持錨定。", "配對兩條水平關係，不要交換中央位置。", "用上下關係安定黎明瞭望台。", "檢查點：兩位鄰居守護燈籠林，選擇前要讀完兩個方向。",
    "穿風弧線在第一弧後加入垂直關係。", "從水平線索轉向相反方向，同時保留中央錨點。", "通道把上方線索和下方反模式放在一起。", "沿中央星讀完整星軸，忽略鏡像干擾。", "檢查點：地平線守護員改變星軸，選出同時保留兩條垂直關係的星圖。",
    "斜線黎明加入從角落到角落的關係。", "兔子的斜徑是對角線索，不是同一排。", "反射斜線考驗你是否讀到兩端位置。", "映像星圖反轉斜線順序，請比較兩個端點。", "檢查點：星折把兩個斜向收進一個清楚的推理。",
    "基石把推理移到邊緣與共享角落。", "蕨葉角落讓左側鄰居停在邊界。", "用下方角落作第二個錨點，而不是依賴中央。", "狐花轉彎改變角落順序，但動物仍然可見。", "檢查點：四個角落互相競爭，跟著兩位指定鄰居，不要只看最亮的星。",
    "之字溪流加入階梯式垂直鏈。", "野兔回聲保留中央錨點，同時移動兩端。", "分岔松徑把關係藏在溫和的之字形裡。", "貓頭鷹踏步彎先考驗你對上方線索的閱讀。", "檢查點：鏈光把完整之字詞彙合成最後一個推理。",
    "北極星分岔以分開的水平推理開始熟練弧。", "銀色斜線把斜向端點與後段干擾放在一起。", "月帽角落要求你同時握住邊緣錨點與垂直線索。", "最後校準混合垂直家族與最後的反射選項。", "檢查點：星圖皇冠是獨特終章，讀完每條關係再修復夜空。"
  ];
  const namesAr = [
    "بوابة صنوبر القمر", "خط البومة الأوسط", "ثنائي التلال الهادئة", "مرصد ثعلب الفجر", "نقطة تفتيش بستان الفوانيس",
    "مرج الريح المتقاطعة", "منعطف المذنبين", "ممر خط الأيل", "محور القندس", "نقطة تفتيش حارس الأفق",
    "فجر قطري", "ميل الأرنب", "درب زجاج الدب", "مرآة جناح العثة", "نقطة تفتيش طي النجوم",
    "فسحة حجر الزاوية", "زاوية السرخس", "زاوية الطحلب", "منعطف زهرة الثعلب", "نقطة تفتيش الزوايا الأربع",
    "جدول متعرج", "صدى الأرنب البري", "درب الصنوبر المنقسم", "منعطف خطوة البومة", "نقطة تفتيش ضوء السلسلة",
    "تفرع النجم القطبي", "القطر الفضي", "زاوية قبعة القمر", "المحاذاة الأخيرة", "تاج الكوكبة"
  ];
  const introsAr = [
    "تعلّم قاعدة اليمين واليسار بخط واضح من ثلاث نجوم.", "اقرأ الجيران رأسيًا وحافظ على النجم الأوسط ثابتًا.", "طابق علاقتين أفقيتين دون تبديل المركز.", "استخدم قاعدة فوق وتحت لتهدئة المرصد.", "نقطة تفتيش: يحرس جاران البستان؛ اقرأ الاتجاهين قبل الاختيار.",
    "يضيف المرج علاقة رأسية بعد القوس الأول.", "انتقل من الدليل الأفقي إلى عكسه مع حفظ المرساة.", "يمزج الممر دليلًا علويًا مع نمط مضاد سفلي.", "اتبع المحور عبر النجم الأوسط وتجاهل الخدعة المعكوسة.", "نقطة تفتيش: يغير الحارس المحور؛ اختر الخريطة التي تحفظ العلاقتين الرأسيّتين.",
    "يضيف الفجر القطري علاقات من زاوية إلى زاوية.", "ميل الأرنب دليل قطري وليس صفًا مستقيمًا.", "يختبر القطر المنعكس قراءتك للموقعين.", "تعكس المرآة ترتيب القطر؛ قارن الطرفين.", "نقطة تفتيش: يضم طي النجوم الاتجاهين القطريين في برهان واحد.",
    "تنقل فسحة حجر الزاوية البرهان إلى حافة وزاوية مشتركة.", "تحافظ زاوية السرخس على الجار الأيسر عند الحد.", "استخدم الزاوية السفلية كمرساة ثانية بدل المركز.", "يغير المنعطف ترتيب الزاوية مع بقاء الحيوانات ظاهرة.", "نقطة تفتيش: تتنافس أربع زوايا؛ اتبع الجارين المحددين لا ألمع نجمة.",
    "يضيف الجدول المتعرج سلسلة رأسية متدرجة.", "يحافظ الصدى على المرساة الوسطى مع تحريك الطرفين.", "يخفي الدرب العلاقة في تعرج هادئ.", "يفحص المنعطف قراءة الدليل العلوي أولًا.", "نقطة تفتيش: يجمع ضوء السلسلة مفردات التعرج كلها في البرهان الأخير.",
    "يبدأ قوس الإتقان ببرهان أفقي منقسم.", "يجمع القطر الفضي قاعدة الطرف القطري مع خدع النهاية.", "تطلب زاوية قبعة القمر تثبيت الحافة والدليل الرأسي معًا.", "تمزج المحاذاة الأخيرة العائلة الرأسية مع خيار منعكس.", "نقطة تفتيش: تاج الكوكبة خاتمة مميزة؛ اقرأ كل علاقة قبل إصلاح السماء."
  ];
  const defaults = {
    arc1Name: "Arc 1 · Direct Neighbours", arc2Name: "Arc 2 · Crossed Axes", arc3Name: "Arc 3 · Diagonal Clues", arc4Name: "Arc 4 · Corner Guardians", arc5Name: "Arc 5 · Chain Signals", arc6Name: "Arc 6 · Mastery Sky",
    mechanicDirect: "Direct neighbour rules", mechanicCross: "Crossed horizontal and vertical axes", mechanicDiagonal: "Diagonal endpoint clues", mechanicCorner: "Edge and shared-corner anchors", mechanicChain: "Stepped relation chains", mechanicMastery: "Combined relation families",
    checkpoint: "Checkpoint", checkpoint5: "Lantern Grove Guardian", checkpoint10: "Horizon Keeper", checkpoint15: "Starfold Guardian", checkpoint20: "Four-Corner Guardian", checkpoint25: "Chainlight Guardian", checkpoint30: "Constellation Crown Finale",
    relationLeft: "{subject} is directly left of {object}.", relationRight: "{subject} is directly right of {object}.", relationAbove: "{subject} is directly above {object}.", relationBelow: "{subject} is directly below {object}.", relationUpperLeft: "{subject} is upper-left of {object}.", relationLowerRight: "{subject} is lower-right of {object}.",
    boardOption: "Board {slot}", locked: "Locked", faqTitle: "FAQ", faqProgress: "Is progress saved? Yes, cleared maps unlock the next map and remain replayable in this browser.",
    guideSummary: "Read visible relationships between animal stars, then choose the one constellation that obeys both rules across six five-map arcs.", resultGuideTitle: "Results and saves", resultGuide: "Six five-map arcs form a 30-map campaign. Progress and the best total checks are stored only in this browser when storage is available.", tipsTitle: "Practical tips", tips: "Read each relation literally: above, below, left, right, or diagonal. Each map introduces a visible rule, and the boards stay visible so every choice can be checked fairly."
  };
  keys.forEach((key) => Object.assign(tables[key] ||= {}, defaults));
  const accessibilityAliases = {
    en: { returnMain: "Back to WeightPlay", stageSections: "Stage sections", constellationChoices: "Constellation choices", guideAria: "Constellation Keeper game information" },
    "zh-Hant": { returnMain: "返回 WeightPlay", stageSections: "階段區段", constellationChoices: "星圖選擇", guideAria: "動物星圖守護員遊戲資訊" },
    "zh-Hans": { returnMain: "返回 WeightPlay", stageSections: "阶段部分", constellationChoices: "星图选项", guideAria: "动物星图守护员游戏信息" },
    ja: { returnMain: "WeightPlayに戻る", stageSections: "ステージセクション", constellationChoices: "星座の選択肢", guideAria: "どうぶつ星座守りゲーム情報" },
    ko: { returnMain: "WeightPlay로 돌아가기", stageSections: "스테이지 섹션", constellationChoices: "별자리 선택지", guideAria: "동물 별자리 지킴이 게임 정보" },
    es: { returnMain: "Volver a WeightPlay", stageSections: "Secciones de fase", constellationChoices: "Opciones de constelación", guideAria: "Información del juego Guardián de Constelaciones" },
    "pt-BR": { returnMain: "Voltar ao WeightPlay", stageSections: "Seções da fase", constellationChoices: "Opções de constelação", guideAria: "Informações do jogo Guardião das Constelações" },
    fr: { returnMain: "Retour à WeightPlay", stageSections: "Sections de la phase", constellationChoices: "Choix de constellations", guideAria: "Informations sur le jeu Gardien des constellations" },
    de: { returnMain: "Zurück zu WeightPlay", stageSections: "Abschnitte der Phase", constellationChoices: "Sternbild-Auswahl", guideAria: "Spielinformationen zum Sternbild-Hüter" },
    it: { returnMain: "Torna a WeightPlay", stageSections: "Sezioni della fase", constellationChoices: "Scelte della costellazione", guideAria: "Informazioni sul gioco Custode delle costellazioni" },
    ru: { returnMain: "Вернуться в WeightPlay", stageSections: "Разделы этапа", constellationChoices: "Варианты созвездия", guideAria: "Информация об игре «Хранитель созвездий»" },
    hi: { returnMain: "WeightPlay पर वापस जाएँ", stageSections: "चरण अनुभाग", constellationChoices: "नक्षत्र विकल्प", guideAria: "नक्षत्र रक्षक खेल जानकारी" },
    ar: { returnMain: "العودة إلى WeightPlay", stageSections: "أقسام المرحلة", constellationChoices: "اختيارات الكوكبة", guideAria: "معلومات لعبة حارس الكوكبات" },
  };
  keys.forEach((key) => Object.assign(tables[key], accessibilityAliases[key] || {}));
  const addStageCopy = (locale, names, intros) => {
    const table = tables[locale] ||= {};
    names.forEach((name, index) => { table[`stage${index + 1}Name`] = name; table[`stage${index + 1}Intro`] = intros[index]; });
  };
  addStageCopy("en", namesEn, introsEn);
  addStageCopy("zh-Hant", namesZh, introsZh);
  addStageCopy("ar", namesAr, introsAr);
  Object.assign(tables["zh-Hant"], {
    arc1Name: "第一弧・直接鄰居", arc2Name: "第二弧・交叉星軸", arc3Name: "第三弧・斜向線索", arc4Name: "第四弧・角落守護", arc5Name: "第五弧・鏈式訊號", arc6Name: "第六弧・熟練星空",
    mechanicDirect: "直接鄰居規則", mechanicCross: "水平與垂直交叉星軸", mechanicDiagonal: "斜向端點線索", mechanicCorner: "邊緣與共享角落錨點", mechanicChain: "階梯式關係鏈", mechanicMastery: "綜合關係家族",
    checkpoint: "檢查點", checkpoint5: "燈籠林守護者", checkpoint10: "地平線守護員", checkpoint15: "星折守護者", checkpoint20: "四角守護者", checkpoint25: "鏈光守護者", checkpoint30: "星圖皇冠終章",
    relationLeft: "{subject} 就在 {object} 的正左方。", relationRight: "{subject} 就在 {object} 的正右方。", relationAbove: "{subject} 就在 {object} 的正上方。", relationBelow: "{subject} 就在 {object} 的正下方。", relationUpperLeft: "{subject} 在 {object} 的左上方。", relationLowerRight: "{subject} 在 {object} 的右下方。",
    boardOption: "星圖 {slot}", locked: "尚未開放", faqTitle: "常見問題", faqProgress: "進度會保存嗎？會，修復的地圖會在這個瀏覽器開放下一幅，也能重新遊玩。",
    guideSummary: "閱讀動物星星之間的可見關係，從六個五關卡弧線中選出同時遵守兩條規則的唯一星圖。", resultGuide: "六個五關卡弧線組成 30 幅地圖的流程。進度與最佳檢查次數只會在可用時保存在本機瀏覽器。", tips: "仔細閱讀上、下、左、右與斜向關係。每幅地圖都會加入可見規則，星圖會保持顯示，讓你公平核對每個選擇。"
  });
  Object.assign(tables.ar, {
    arc1Name: "القوس 1 · الجيران المباشرون", arc2Name: "القوس 2 · المحاور المتقاطعة", arc3Name: "القوس 3 · الأدلة القطرية", arc4Name: "القوس 4 · حراس الزوايا", arc5Name: "القوس 5 · إشارات السلسلة", arc6Name: "القوس 6 · إتقان السماء",
    mechanicDirect: "قواعد الجار المباشر", mechanicCross: "محاور أفقية ورأسية متقاطعة", mechanicDiagonal: "أدلة الأطراف القطرية", mechanicCorner: "مراسي الحافة والزاوية المشتركة", mechanicChain: "سلاسل علاقات متدرجة", mechanicMastery: "عائلات علاقات مجمعة",
    checkpoint: "نقطة تفتيش", checkpoint5: "حارس بستان الفوانيس", checkpoint10: "حارس الأفق", checkpoint15: "حارس طي النجوم", checkpoint20: "حارس الزوايا الأربع", checkpoint25: "حارس ضوء السلسلة", checkpoint30: "النهاية: تاج الكوكبة",
    relationLeft: "{subject} يقع مباشرة إلى يسار {object}.", relationRight: "{subject} يقع مباشرة إلى يمين {object}.", relationAbove: "{subject} يقع مباشرة فوق {object}.", relationBelow: "{subject} يقع مباشرة أسفل {object}.", relationUpperLeft: "{subject} يقع أعلى يسار {object}.", relationLowerRight: "{subject} يقع أسفل يمين {object}.",
    boardOption: "الخريطة {slot}", locked: "مغلقة", faqTitle: "الأسئلة الشائعة", faqProgress: "هل يُحفظ التقدم؟ نعم، تفتح الخرائط المُصلحة الخريطة التالية وتبقى قابلة لإعادة اللعب في هذا المتصفح.",
    guideSummary: "اقرأ العلاقات الظاهرة بين نجوم الحيوانات، ثم اختر الكوكبة الوحيدة التي تلتزم بالقاعدتين عبر ستة أقواس من خمس خرائط.", resultGuide: "تتكون الحملة من ستة أقواس، كل منها خمس خرائط، بإجمالي 30 خريطة. يُحفظ التقدم وأفضل عدد من الفحوصات في هذا المتصفح فقط عند توفر التخزين.", tips: "اقرأ كل علاقة حرفيًا: فوق أو تحت أو يسار أو يمين أو قطريًا. تضيف كل خريطة قاعدة ظاهرة، وتبقى الخرائط معروضة لتتحقق من كل اختيار بعدل."
  });
})();

(() => {
  const tables = window.ANIMAL_CONSTELLATION_KEEPER_LOCALES || {};
  if (tables.en) Object.assign(tables.en, {
    gameInfoKicker: "WeightPlay Original Game Guide",
    guideAria: "Constellation Keeper game information"
  });
  if (tables.ar) Object.assign(tables.ar, {
    gameInfoKicker: "دليل لعبة أصلي من WeightPlay",
    guideAria: "معلومات لعبة حارس الكوكبات",
    guideTitle: "طريقة اللعب",
    guideOne: "اقرأ قاعدتي العلاقة بين النجوم.",
    guideTwo: "اضغط على خريطة الكوكبة التي توافق القاعدتين.",
    guideThree: "يبقى الاختيار الخاطئ ظاهرًا لتتمكن من المحاولة بهدوء.",
    guideSummary: "اقرأ العلاقات الظاهرة بين نجوم الحيوانات، ثم اختر الخريطة الوحيدة التي تلتزم بالقاعدتين عبر ستة أقواس من خمس خرائط.",
    gameplayFact: "أسلوب اللعب",
    gameplayValue: "استنتاج العلاقات",
    genreFact: "النوع",
    genreValue: "ألغاز · منطق · عائلي · حيوانات",
    resultGuideTitle: "النتائج والحفظ",
    resultGuide: "تتكون الحملة من ستة أقواس، كل منها خمس خرائط، بإجمالي 30 خريطة. يُحفظ التقدم وأفضل عدد من الفحوصات في هذا المتصفح فقط عند توفر التخزين.",
    tipsTitle: "نصائح عملية",
    tips: "اقرأ كل علاقة حرفيًا: فوق أو تحت أو يسار أو يمين أو قطريًا. تضيف كل خريطة قاعدة ظاهرة، وتبقى الخرائط معروضة لتتحقق من كل اختيار بعدل."
  });
})();

(() => {
  const tables = window.ANIMAL_CONSTELLATION_KEEPER_LOCALES || {};
  if (!tables.ar) return;
  Object.assign(tables.ar, {
    kicker: "لغز هادئ لاستنتاج العلاقات",
    intro: "اقرأ قاعدتي السماء، واختر كوكبة الحيوانات الوحيدة التي تلتزم بهما، ثم أصلح الخرائط الليلية.",
    noBest: "لم تُكملها بعد",
    best: "أفضل عدد من الفحوصات",
    map: "الخرائط الليلية",
    loading: "جارٍ تجهيز السماء الليلية…",
    round: "الخريطة {n} من {total}",
    open: "مفتوحة",
    complete: "مُصلحة",
    resultTitle: "اكتملت السماء",
    resultPartial: "أُصلحت الخريطة",
    resultText: "أصلحت {count} من أصل {total} خرائط ليلية باستخدام {checks} فحوصات.",
    mapOption: "كوكبة {label}",
    waiting: "اختر خريطة كوكبة واحدة، ثم اضغط على التحقق.",
    selected: "تم اختيار الكوكبة. تحقق منها عندما تكون مستعدًا.",
    wrong: "تخالف هذه الخريطة «{hint}». اقرأ القاعدتين وحاول خريطة أخرى.",
    correct: "العلاقات متوافقة. أُصلحت الخريطة الليلية.",
    guideAria: "معلومات لعبة حارس الكوكبات",
    returnMain: "العودة إلى WeightPlay",
    stageSections: "أقسام المرحلة",
    constellationChoices: "اختيارات الكوكبة",
    map1: "صنوبر القمر",
    map2: "التلال الهادئة",
    map3: "وادي الفجر",
    map1Intro: "تفتقد خريطة السماء الأولى لأورلا نمطًا آمنًا واحدًا.",
    map2Intro: "يحتاج منار التلال إلى جيرانه في المواضع الصحيحة.",
    map3Intro: "يفتح الوادي الأخير عندما تحافظ النجوم الثلاث على وعدها الرأسي.",
    clue1a: "البومة فوق الثعلب مباشرة.",
    clue1b: "الأرنب إلى يمين الثعلب مباشرة.",
    clue2a: "الأيل إلى يسار القندس مباشرة.",
    clue2b: "الأرنب البري إلى يمين القندس مباشرة.",
    clue3a: "البومة فوق الدب مباشرة.",
    clue3b: "الخلد تحت الدب مباشرة.",
    map1A: "الثعلب في الوسط",
    map1B: "الأرنب في الوسط",
    map1C: "البومة في الوسط",
    map2A: "القندس في الوسط",
    map2B: "الأيل في الوسط",
    map2C: "الأرنب البري في الوسط",
    map3A: "الدب في الوسط",
    map3B: "البومة في الوسط",
    map3C: "الخلد في الوسط",
    map4: "تقاطع النجوم",
    map4Intro: "يفتح التقاطع عندما يتشارك جاران زاوية واحدة.",
    clue4a: "الأرنب يقع مباشرة إلى يسار البومة.",
    clue4b: "الدب يقع مباشرة أسفل الأرنب.",
    map4A: "الأرنب غربًا",
    map4B: "البومة غربًا",
    map4C: "الدب غربًا",
    fox: "ثعلب",
    owl: "بومة",
    rabbit: "أرنب",
    deer: "أيل",
    otter: "قندس",
    hare: "أرنب بري",
    bear: "دب",
    mole: "خلد",
    allMaps: "الخرائط الليلية الأربع مفتوحة.",
    resultGuideTitle: "النتائج والحفظ",
    resultGuide: "تتكون الحملة من ستة أقواس، كل منها خمس خرائط، بإجمالي 30 خريطة. يُحفظ التقدم وأفضل عدد من الفحوصات في هذا المتصفح فقط عند توفر التخزين.",
    tipsTitle: "نصائح عملية",
    tips: "اقرأ كل علاقة حرفيًا: فوق أو تحت أو يسار أو يمين أو قطريًا. تضيف كل خريطة قاعدة ظاهرة، وتبقى الخرائط معروضة لتتحقق من كل اختيار بعدل."
  });
})();
