/*
 * Locale shell for the five Mode 2 prototype games.  It is deliberately
 * game-owned: these prototypes are not yet registered in the public title
 * catalog, but they still use the project's complete locale selector and
 * route-aware locale persistence before formal QA begins.
 */
(() => {
  const locales = [
    ["en", "English"], ["zh-Hant", "繁體中文"], ["zh-Hans", "简体中文"],
    ["ja", "日本語"], ["ko", "한국어"], ["es", "Español"], ["pt-BR", "Português"],
    ["fr", "Français"], ["de", "Deutsch"], ["it", "Italiano"], ["ru", "Русский"],
    ["hi", "हिन्दी"], ["ar", "العربية"],
  ];
  const segments = Object.freeze({ en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" });
  const fromSegment = Object.fromEntries(Object.entries(segments).map(([locale, segment]) => [segment, locale]));
  const common = {
    en: { language: "Language", start: "Start Game", main: "Main", stages: "Stages", chapters: "Chapters", arenas: "Arenas", retry: "Retry", next: "Next", howTo: "How to Play", back: "Back" },
    "zh-Hant": { language: "語言", start: "開始遊戲", main: "主頁", stages: "關卡", chapters: "章節", arenas: "鬥場", retry: "重試", next: "下一個", howTo: "玩法說明", back: "返回" },
    "zh-Hans": { language: "语言", start: "开始游戏", main: "主页", stages: "关卡", chapters: "章节", arenas: "斗场", retry: "重试", next: "下一个", howTo: "玩法说明", back: "返回" },
    ja: { language: "言語", start: "ゲーム開始", main: "メイン", stages: "ステージ", chapters: "チャプター", arenas: "アリーナ", retry: "リトライ", next: "次へ", howTo: "遊び方", back: "戻る" },
    ko: { language: "언어", start: "게임 시작", main: "메인", stages: "스테이지", chapters: "챕터", arenas: "아레나", retry: "다시 하기", next: "다음", howTo: "게임 방법", back: "뒤로" },
    es: { language: "Idioma", start: "Empezar juego", main: "Inicio", stages: "Fases", chapters: "Capítulos", arenas: "Arenas", retry: "Reintentar", next: "Siguiente", howTo: "Cómo jugar", back: "Atrás" },
    "pt-BR": { language: "Idioma", start: "Iniciar jogo", main: "Início", stages: "Fases", chapters: "Capítulos", arenas: "Arenas", retry: "Tentar de novo", next: "Próximo", howTo: "Como jogar", back: "Voltar" },
    fr: { language: "Langue", start: "Commencer", main: "Accueil", stages: "Niveaux", chapters: "Chapitres", arenas: "Arènes", retry: "Réessayer", next: "Suivant", howTo: "Comment jouer", back: "Retour" },
    de: { language: "Sprache", start: "Spiel starten", main: "Start", stages: "Stufen", chapters: "Kapitel", arenas: "Arenen", retry: "Erneut", next: "Weiter", howTo: "Spielanleitung", back: "Zurück" },
    it: { language: "Lingua", start: "Inizia gioco", main: "Home", stages: "Livelli", chapters: "Capitoli", arenas: "Arene", retry: "Riprova", next: "Avanti", howTo: "Come si gioca", back: "Indietro" },
    ru: { language: "Язык", start: "Начать игру", main: "Главная", stages: "Уровни", chapters: "Главы", arenas: "Арены", retry: "Повторить", next: "Далее", howTo: "Как играть", back: "Назад" },
    hi: { language: "भाषा", start: "खेल शुरू करें", main: "मुख्य", stages: "स्तर", chapters: "अध्याय", arenas: "अखाड़े", retry: "फिर कोशिश", next: "अगला", howTo: "कैसे खेलें", back: "वापस" },
    ar: { language: "اللغة", start: "ابدأ اللعبة", main: "الرئيسية", stages: "المراحل", chapters: "الفصول", arenas: "الساحات", retry: "إعادة المحاولة", next: "التالي", howTo: "طريقة اللعب", back: "رجوع" },
  };
  const dynamicLabels = {
    en: { bestScore: "Best score", bestStreak: "Best streak", bestWins: "Best wins", bestRooms: "Best rooms", bestRoom: "Best room", deaths: "Deaths", berries: "Berries", chapter: "Chapter", room: "Room", wave: "Wave", arena: "Arena", surface: "Surface", platform: "Platform", you: "You", rival: "Rival", score: "Score", chain: "Chain", streak: "Streak" },
    "zh-Hant": { bestScore: "最佳成績", bestStreak: "最佳連勝", bestWins: "最佳勝場", bestRooms: "最佳房間", bestRoom: "最佳房間", deaths: "死亡次數", berries: "莓果", chapter: "第", room: "房間", wave: "波次", arena: "鬥場", surface: "表面", platform: "平台", you: "你", rival: "對手", score: "分數", chain: "連擊", streak: "連勝" },
    "zh-Hans": { bestScore: "最佳成绩", bestStreak: "最佳连胜", bestWins: "最佳胜场", bestRooms: "最佳房间", bestRoom: "最佳房间", deaths: "死亡次数", berries: "莓果", chapter: "第", room: "房间", wave: "波次", arena: "斗场", surface: "表面", platform: "平台", you: "你", rival: "对手", score: "分数", chain: "连击", streak: "连胜" },
    ja: { bestScore: "ベストスコア", bestStreak: "ベスト連勝", bestWins: "ベスト勝利数", bestRooms: "ベスト部屋数", bestRoom: "ベスト部屋", deaths: "死亡数", berries: "ベリー", chapter: "チャプター", room: "ルーム", wave: "ウェーブ", arena: "アリーナ", surface: "足場", platform: "プラットフォーム", you: "自分", rival: "相手", score: "スコア", chain: "チェーン", streak: "連勝" },
    ko: { bestScore: "최고 점수", bestStreak: "최고 연속", bestWins: "최고 승리", bestRooms: "최고 방 수", bestRoom: "최고 방", deaths: "사망", berries: "베리", chapter: "챕터", room: "방", wave: "웨이브", arena: "경기장", surface: "발판", platform: "플랫폼", you: "나", rival: "상대", score: "점수", chain: "연쇄", streak: "연속" },
    es: { bestScore: "Mejor puntuación", bestStreak: "Mejor racha", bestWins: "Mejores victorias", bestRooms: "Mejores salas", bestRoom: "Mejor sala", deaths: "Muertes", berries: "Bayas", chapter: "Capítulo", room: "Sala", wave: "Oleada", arena: "Arena", surface: "Superficie", platform: "Plataforma", you: "Tú", rival: "Rival", score: "Puntuación", chain: "Cadena", streak: "Racha" },
    "pt-BR": { bestScore: "Melhor pontuação", bestStreak: "Melhor sequência", bestWins: "Melhores vitórias", bestRooms: "Melhores salas", bestRoom: "Melhor sala", deaths: "Mortes", berries: "Frutas", chapter: "Capítulo", room: "Sala", wave: "Onda", arena: "Arena", surface: "Superfície", platform: "Plataforma", you: "Você", rival: "Rival", score: "Pontuação", chain: "Cadeia", streak: "Sequência" },
    fr: { bestScore: "Meilleur score", bestStreak: "Meilleure série", bestWins: "Meilleures victoires", bestRooms: "Meilleures salles", bestRoom: "Meilleure salle", deaths: "Morts", berries: "Baies", chapter: "Chapitre", room: "Salle", wave: "Vague", arena: "Arène", surface: "Surface", platform: "Plateforme", you: "Toi", rival: "Rival", score: "Score", chain: "Chaîne", streak: "Série" },
    de: { bestScore: "Bester Score", bestStreak: "Beste Serie", bestWins: "Beste Siege", bestRooms: "Beste Räume", bestRoom: "Bester Raum", deaths: "Tode", berries: "Beeren", chapter: "Kapitel", room: "Raum", wave: "Welle", arena: "Arena", surface: "Fläche", platform: "Plattform", you: "Du", rival: "Gegner", score: "Punkte", chain: "Kette", streak: "Serie" },
    it: { bestScore: "Miglior punteggio", bestStreak: "Migliore serie", bestWins: "Migliori vittorie", bestRooms: "Migliori stanze", bestRoom: "Miglior stanza", deaths: "Morti", berries: "Bacche", chapter: "Capitolo", room: "Stanza", wave: "Ondata", arena: "Arena", surface: "Superficie", platform: "Piattaforma", you: "Tu", rival: "Rivale", score: "Punteggio", chain: "Catena", streak: "Serie" },
    ru: { bestScore: "Лучший счёт", bestStreak: "Лучшая серия", bestWins: "Лучшие победы", bestRooms: "Лучшие комнаты", bestRoom: "Лучшая комната", deaths: "Падения", berries: "Ягоды", chapter: "Глава", room: "Комната", wave: "Волна", arena: "Арена", surface: "Поверхность", platform: "Платформа", you: "Вы", rival: "Соперник", score: "Счёт", chain: "Цепь", streak: "Серия" },
    hi: { bestScore: "सर्वश्रेष्ठ स्कोर", bestStreak: "सर्वश्रेष्ठ सिलसिला", bestWins: "सर्वश्रेष्ठ जीत", bestRooms: "सर्वश्रेष्ठ कमरे", bestRoom: "सर्वश्रेष्ठ कमरा", deaths: "मृत्यु", berries: "बेरियाँ", chapter: "अध्याय", room: "कमरा", wave: "लहर", arena: "अखाड़ा", surface: "सतह", platform: "प्लेटफ़ॉर्म", you: "आप", rival: "प्रतिद्वंद्वी", score: "स्कोर", chain: "श्रृंखला", streak: "सिलसिला" },
    ar: { bestScore: "أفضل نتيجة", bestStreak: "أفضل سلسلة", bestWins: "أفضل انتصارات", bestRooms: "أفضل غرف", bestRoom: "أفضل غرفة", deaths: "الوفيات", berries: "التوت", chapter: "الفصل", room: "الغرفة", wave: "الموجة", arena: "الساحة", surface: "السطح", platform: "المنصة", you: "أنت", rival: "الخصم", score: "النتيجة", chain: "السلسلة", streak: "التتابع" },
  };
  const fixedText = {
    en: {
      "Pulse": "Pulse", "BUILD ICE": "BUILD ICE", "BUMP": "BUMP", "Foam tools": "Foam tools", "Ready…": "Ready…",
      "Perfect landing — next platform ready.": "Perfect landing — next platform ready.", "Replay Canopy": "Replay Canopy", "Replay Foundry": "Replay Foundry",
      "Arrows move. SPACE breaks ice; F builds a short wall.": "Arrows move. SPACE breaks ice; F builds a short wall.",
      "Arrow keys move · Space jumps.": "Arrow keys move · Space jumps.",
      "Arrow keys move · Space jumps · E reveals a brief clue.": "Arrow keys move · Space jumps · E reveals a brief clue.",
      "Find the lantern. Traps reset only the current room.": "Find the lantern. Traps reset only the current room.",
      "Trap Chapters": "Trap Chapters", "Harvest Chapters": "Harvest Chapters", "Foam Arenas": "Foam Arenas", "Ice Chapters": "Ice Chapters", "Foundry Chapters": "Foundry Chapters",
      "← Main": "← Main", "← Chapters": "← Chapters", "← Stages": "← Stages", "← Arenas": "← Arenas", "Touch controls": "Touch controls",
      "JUMP": "JUMP", "BOUNCE": "BOUNCE", "SPRING": "SPRING", "PAD": "PAD", "BREAK ICE": "BREAK ICE",
      "Swipe safe fruit.": "Swipe safe fruit.", "Move with arrows. Press SPACE to bounce-strike.": "Move with arrows. Press SPACE to bounce-strike.",
      "Arrows move. Press SPACE to break the ice ahead.": "Arrows move. Press SPACE to break the ice ahead.", "Swipe upward from the canister.": "Swipe upward from the canister.",
      "Drag across targets. A dark seed pod ends the chain.": "Drag across targets. A dark seed pod ends the chain.",
      "Keep moving, strike when close, and use the arena walls to create space.": "Keep moving, strike when close, and use the arena walls to create space.",
      "The blue blocks are breakable. Collect all berries before the drifter reaches you.": "The blue blocks are breakable. Collect all berries before the drifter reaches you.",
      "Swipe up. Shorter swipes stay low; longer swipes climb farther.": "Swipe up. Shorter swipes stay low; longer swipes climb farther.",
      "Moonlit Trap Trail play area": "Moonlit Trap Trail play area", "Canopy Cut play area": "Canopy Cut play area", "Bounce Brawl play area": "Bounce Brawl play area", "Frostline Rescue play area": "Frostline Rescue play area", "Flip Foundry play area": "Flip Foundry play area",
      "Trail clear": "Trail clear", "Chapter clear": "Chapter clear", "Room clear": "Room clear", "Wave complete": "Wave complete", "Wave clear": "Wave clear", "Wave ended": "Wave ended", "Arena clear": "Arena clear", "Bounced out": "Bounced out", "Route blocked": "Route blocked", "Landing failed": "Landing failed", "Foundry route clear": "Foundry route clear",
      "Retry Room": "Retry Room", "Next Chapter": "Next Chapter", "Next Room": "Next Room", "Replay Chapter": "Replay Chapter", "Retry Arena": "Retry Arena", "Next Arena": "Next Arena", "Replay Arena": "Replay Arena", "Next Wave": "Next Wave", "Replay Canopy": "Replay Canopy", "Retry Platform": "Retry Platform", "Next Surface": "Next Surface", "Retry": "Retry",
      "learn the tells": "learn the tells", "watch the delay": "watch the delay", "read the reversal": "read the reversal", "mixed rule finale": "mixed rule finale", "5 waves · learn the path": "5 waves · learn the path", "faster arcs": "faster arcs", "warm-up": "warm-up", "spring lanes": "spring lanes", "moving pads": "moving pads", "tight corners": "tight corners", "fast rival": "fast rival", "final rhythm": "final rhythm", "first thaw": "first thaw", "split routes": "split routes", "drifter pressure": "drifter pressure", "final melt": "final melt", "4 platforms · wide starts": "4 platforms · wide starts", "precision finish": "precision finish", "new spacing": "new spacing",
      "READ THE PATH": "READ THE PATH", "FOAM ZONE": "FOAM ZONE", "A toy physics test arena": "A toy physics test arena", "BREAK THE ICE": "BREAK THE ICE"
    },
    "zh-Hant": { "Pulse": "脈衝", "BUILD ICE": "建造冰牆", "BUMP": "撞擊", "Foam tools": "泡棉工具", "Ready…": "準備好了……", "Preparing the foam arena…": "正在準備泡棉鬥場……", "Perfect landing — next platform ready.": "完美落地——下一個平台已準備好。", "Replay Canopy": "重玩樹冠快採", "Replay Foundry": "重玩翻轉工坊", "Arrows move. SPACE breaks ice; F builds a short wall.": "方向鍵移動。SPACE 破壞冰塊；F 建造短冰牆。" },
    "zh-Hans": { "Pulse": "脉冲", "BUILD ICE": "建造冰墙", "BUMP": "撞击", "Foam tools": "泡棉工具", "Ready…": "准备好了……", "Preparing the foam arena…": "正在准备泡棉斗场……", "Perfect landing — next platform ready.": "完美落地——下一个平台已准备好。", "Replay Canopy": "重玩树冠快切", "Replay Foundry": "重玩翻转工坊", "Arrows move. SPACE breaks ice; F builds a short wall.": "方向键移动。SPACE 破坏冰块；F 建造短冰墙。" },
    ja: { "Pulse": "パルス", "BUILD ICE": "氷壁を作る", "BUMP": "バンプ", "Foam tools": "フォームツール", "Ready…": "準備中…", "Perfect landing — next platform ready.": "完璧に着地しました。次の足場の準備完了です。", "Replay Canopy": "キャノピーカットを再プレイ", "Replay Foundry": "フリップ工房を再プレイ", "Arrows move. SPACE breaks ice; F builds a short wall.": "矢印キーで移動、SPACEで氷を壊し、Fで短い氷壁を作ります。" },
    ko: { "Pulse": "펄스", "BUILD ICE": "얼음벽 만들기", "BUMP": "범프", "Foam tools": "폼 도구", "Ready…": "준비…", "Perfect landing — next platform ready.": "완벽하게 착지했습니다. 다음 발판이 준비되었습니다.", "Replay Canopy": "캐노피 컷 다시 하기", "Replay Foundry": "플립 공방 다시 하기", "Arrows move. SPACE breaks ice; F builds a short wall.": "화살표로 이동하고 SPACE로 얼음을 부수며 F로 짧은 얼음벽을 만듭니다." },
    es: { "Pulse": "PULSO", "BUILD ICE": "CONSTRUIR HIELO", "BUMP": "EMPUJÓN", "Foam tools": "Herramientas de espuma", "Ready…": "Listo…", "Perfect landing — next platform ready.": "Aterrizaje perfecto: la siguiente plataforma está lista.", "Replay Canopy": "Repetir Corte del dosel", "Replay Foundry": "Repetir Taller de giros", "Arrows move. SPACE breaks ice; F builds a short wall.": "Muévete con las flechas; SPACE rompe el hielo y F construye un muro corto." },
    "pt-BR": { "Pulse": "PULSO", "BUILD ICE": "CONSTRUIR GELO", "BUMP": "IMPACTO", "Foam tools": "Ferramentas de espuma", "Ready…": "Pronto…", "Perfect landing — next platform ready.": "Pouso perfeito — a próxima plataforma está pronta.", "Replay Canopy": "Repetir Corte na Copa", "Replay Foundry": "Repetir Oficina do Giro", "Arrows move. SPACE breaks ice; F builds a short wall.": "Mova-se com as setas; SPACE quebra o gelo e F constrói uma parede curta." },
    fr: { "Pulse": "IMPULSION", "BUILD ICE": "CONSTRUIRE LA GLACE", "BUMP": "BOUSCULADE", "Foam tools": "Outils en mousse", "Ready…": "Prêt…", "Perfect landing — next platform ready.": "Atterrissage parfait : la prochaine plateforme est prête.", "Replay Canopy": "Rejouer Coupe de la canopée", "Replay Foundry": "Rejouer Atelier du flip", "Arrows move. SPACE breaks ice; F builds a short wall.": "Déplace-toi avec les flèches ; ESPACE brise la glace et F construit un petit mur." },
    de: { "Pulse": "IMPULS", "BUILD ICE": "EIS BAUEN", "BUMP": "STOSS", "Foam tools": "Schaumstoffwerkzeuge", "Ready…": "Bereit…", "Perfect landing — next platform ready.": "Perfekte Landung — die nächste Plattform ist bereit.", "Replay Canopy": "Kronen-Schnitt erneut spielen", "Replay Foundry": "Flip-Werkstatt erneut spielen", "Arrows move. SPACE breaks ice; F builds a short wall.": "Bewege dich mit den Pfeilen; LEERTASTE bricht Eis und F baut eine kurze Wand." },
    it: { "Pulse": "IMPULSO", "BUILD ICE": "COSTRUISCI GHIACCIO", "BUMP": "URTO", "Foam tools": "Strumenti di gommapiuma", "Ready…": "Pronto…", "Perfect landing — next platform ready.": "Atterraggio perfetto: la piattaforma successiva è pronta.", "Replay Canopy": "Rigioca Taglio nella chioma", "Replay Foundry": "Rigioca Officina del flip", "Arrows move. SPACE breaks ice; F builds a short wall.": "Muoviti con le frecce; SPAZIO rompe il ghiaccio e F costruisce un breve muro." },
    ru: { "Pulse": "ИМПУЛЬС", "BUILD ICE": "ПОСТРОИТЬ ЛЁД", "BUMP": "УДАР", "Foam tools": "Пенные инструменты", "Ready…": "Готово…", "Perfect landing — next platform ready.": "Идеальная посадка — следующая платформа готова.", "Replay Canopy": "Повторить срез в кронах", "Replay Foundry": "Повторить мастерскую переворотов", "Arrows move. SPACE breaks ice; F builds a short wall.": "Двигайтесь стрелками; ПРОБЕЛ ломает лёд, а F строит короткую ледяную стену." },
    hi: { "Pulse": "पल्स", "BUILD ICE": "बर्फ बनाएँ", "BUMP": "टक्कर", "Foam tools": "फोम उपकरण", "Ready…": "तैयार…", "Perfect landing — next platform ready.": "सटीक लैंडिंग — अगला प्लेटफ़ॉर्म तैयार है।", "Replay Canopy": "पेड़ की छत कट फिर खेलें", "Replay Foundry": "फ्लिप कार्यशाला फिर खेलें", "Arrows move. SPACE breaks ice; F builds a short wall.": "तीर कुंजियों से चलें; SPACE से बर्फ तोड़ें और F से छोटी दीवार बनाएँ।" },
    ar: { "Pulse": "نبضة", "BUILD ICE": "بناء جليد", "BUMP": "دفع", "Foam tools": "أدوات إسفنجية", "Ready…": "جاهز…", "Perfect landing — next platform ready.": "هبوط مثالي — المنصة التالية جاهزة.", "Replay Canopy": "إعادة قطع مظلة الأشجار", "Replay Foundry": "إعادة ورشة القلب", "Arrows move. SPACE breaks ice; F builds a short wall.": "تحرك بالأسهم؛ تكسر SPACE الجليد ويبني F جداراً قصيراً." },
  };
  const gameCopy = {
    "animal-trap-trail": {
      en: ["Moonlit Trap Trail", "Read the quiet path, test the next step, and reach the lantern without trusting every floor tile.", "A short trap-learning platform trail."],
      "zh-Hant": ["月影陷阱小徑", "讀懂寂靜的小徑，試探下一步，在不相信每塊地板的情況下抵達燈籠。", "短小的陷阱學習平台冒險。"],
      "zh-Hans": ["月影陷阱小径", "读懂安静的小径，试探下一步，不盲信每块地板并抵达灯笼。", "短小的陷阱学习平台冒险。"],
      ja: ["月影トラップトレイル", "静かな道を読み、次の一歩を試し、すべての床を信じずランタンへ進もう。", "短い罠学習プラットフォーム冒険。"],
      ko: ["달빛 함정 길", "조용한 길을 읽고 다음 발판을 시험하며 모든 바닥을 믿지 말고 랜턴에 도착하세요.", "짧게 배우는 함정 플랫폼 모험입니다."],
      es: ["Sendero de trampas lunares", "Lee el camino, prueba el siguiente paso y llega al farol sin confiar en cada baldosa.", "Una breve aventura de plataformas y trampas."],
      "pt-BR": ["Trilha das Armadilhas Lunares", "Leia o caminho, teste o próximo passo e chegue à lanterna sem confiar em cada piso.", "Uma curta aventura de plataformas e armadilhas."],
      fr: ["Sentier des pièges lunaires", "Lis le chemin, teste le prochain pas et rejoins la lanterne sans faire confiance à chaque dalle.", "Une courte aventure de plateformes et de pièges."],
      de: ["Mondlicht-Fallenpfad", "Lies den Weg, prüfe den nächsten Schritt und erreiche die Laterne, ohne jedem Boden zu vertrauen.", "Ein kurzes Plattform-Abenteuer mit Fallen."],
      it: ["Sentiero delle trappole lunari", "Leggi il percorso, prova il prossimo passo e raggiungi la lanterna senza fidarti di ogni piastrella.", "Una breve avventura tra piattaforme e trappole."],
      ru: ["Лунная тропа ловушек", "Изучи путь, проверь следующий шаг и доберись до фонаря, не доверяя каждой плите.", "Короткое платформенное приключение с ловушками."],
      hi: ["चांदनी जाल पथ", "रास्ता पढ़ें, अगला कदम आज़माएँ और हर फर्श पर भरोसा किए बिना लालटेन तक पहुँचें।", "जाल सीखने वाला छोटा प्लेटफ़ॉर्म रोमांच।"],
      ar: ["درب فخاخ ضوء القمر", "اقرأ الطريق واختبر خطوتك التالية واصل إلى المصباح دون الثقة بكل بلاطة.", "مغامرة منصات قصيرة لتعلّم الفخاخ."],
    },
    "animal-canopy-cut": {
      en: ["Canopy Cut", "Swipe through safe canopy fruit, build a chain, and avoid dark seed pods.", "A quick fruit-swipe reaction challenge."],
      "zh-Hant": ["樹冠快採", "劃過安全的樹冠果實建立連擊，避開深色種莢。", "快速的水果滑動反應挑戰。"],
      "zh-Hans": ["树冠快切", "划过安全的树冠果实建立连击，避开深色种荚。", "快速的水果滑动反应挑战。"],
      ja: ["キャノピーカット", "安全な木の実をスワイプして連鎖を作り、黒い種さやを避けよう。", "素早いフルーツスワイプ反応チャレンジ。"],
      ko: ["캐노피 컷", "안전한 열매를 스와이프해 연쇄를 만들고 어두운 씨앗 꼬투리를 피하세요.", "빠른 과일 스와이프 반응 도전입니다."],
      es: ["Corte del dosel", "Desliza frutas seguras, crea una cadena y evita las vainas oscuras.", "Un reto rápido de reacción con frutas."],
      "pt-BR": ["Corte na Copa", "Deslize pelas frutas seguras, crie uma sequência e evite as vagens escuras.", "Um desafio rápido de reação com frutas."],
      fr: ["Coupe de la canopée", "Glisse sur les fruits sûrs, crée une chaîne et évite les gousses sombres.", "Un défi rapide de réaction fruitée."],
      de: ["Kronen-Schnitt", "Wische durch sichere Früchte, bilde eine Kette und meide dunkle Samenhülsen.", "Eine schnelle Frucht-Reaktionsherausforderung."],
      it: ["Taglio nella chioma", "Scorri sulla frutta sicura, crea una catena ed evita i baccelli scuri.", "Una sfida rapida di reazione con la frutta."],
      ru: ["Срез в кронах", "Проводите по безопасным плодам, создавайте цепь и избегайте тёмных стручков.", "Быстрое испытание реакции с фруктами."],
      hi: ["पेड़ की छत कट", "सुरक्षित फलों पर स्वाइप करें, श्रृंखला बनाएँ और गहरे बीज-फलियों से बचें।", "तेज़ फल-स्वाइप प्रतिक्रिया चुनौती।"],
      ar: ["قطع مظلة الأشجار", "مرر على الثمار الآمنة وابنِ سلسلة وتجنب قرون البذور الداكنة.", "تحدٍّ سريع لرد الفعل مع الفاكهة."],
    },
    "animal-bounce-brawl": {
      en: ["Bounce Brawl", "A toy arena about timing, ricochets, and sending a foam challenger off balance.", "A soft physics arena with friendly knockback.", "Time your bounces, choose foam tools, and knock the rival off balance in a playful physics arena."],
      "zh-Hant": ["彈跳鬥場", "在玩具鬥場掌握時機與反彈，把泡棉對手撞到失去平衡。", "帶有友善擊退效果的柔軟物理鬥場。", "計算你的彈跳時間，選擇泡沫工具，並在有趣的物理競技場中讓對手失去平衡。"],
      "zh-Hans": ["弹跳斗场", "在玩具斗场掌握时机与反弹，把泡棉对手撞得失去平衡。", "带有友善击退效果的柔软物理斗场。", "计算你的弹跳时间，选择泡沫工具，并在有趣的物理竞技场中让对手失去平衡。"],
      ja: ["バウンス乱闘", "タイミングと反射を使い、フォームの相手をバランス崩しに追い込む玩具アリーナ。", "やさしいノックバックの物理アリーナ。", "遊び心のある物理アリーナで、バウンスのタイミングを計り、フォームツールを選択し、ライバルのバランスを崩します。"],
      ko: ["바운스 난투", "타이밍과 튕김을 활용해 폼 상대를 균형 잃게 만드는 장난감 경기장입니다.", "친근한 밀치기가 있는 부드러운 물리 경기장입니다.", "재미있는 물리 경기장에서 바운스 시간을 맞추고, 폼 도구를 선택하고, 라이벌의 균형을 무너뜨리세요."],
      es: ["Duelo de rebotes", "Un campo de juguete de tiempos y rebotes para desequilibrar a un rival de espuma.", "Una arena de física amable con empujones.", "Calcula tus rebotes, elige herramientas de espuma y desequilibra al rival en un divertido campo de física."],
      "pt-BR": ["Briga de Rebotes", "Uma arena de brinquedo de tempo e ricochetes para desequilibrar um rival de espuma.", "Uma arena de física leve com empurrões amigáveis.", "Cronometre seus saltos, escolha ferramentas de espuma e desequilibre o rival em uma divertida arena de física."],
      fr: ["Baston rebondissant", "Une arène jouet de timing et de rebonds pour déséquilibrer un rival en mousse.", "Une arène physique douce avec recul amusant.", "Chronométrez vos rebonds, choisissez des outils en mousse et déséquilibrez votre rival dans une arène physique ludique."],
      de: ["Hüpfduell", "Eine Spielzeugarena für Timing und Abpraller, um einen Schaumgegner aus dem Gleichgewicht zu bringen.", "Eine sanfte Physikarena mit freundlichem Rückstoß.", "Planen Sie Ihre Sprünge, wählen Sie Schaumstoffwerkzeuge und bringen Sie den Rivalen in einer spielerischen Physik-Arena aus dem Gleichgewicht."],
      it: ["Rissa rimbalzante", "Un'arena giocattolo di tempismo e rimbalzi per sbilanciare un rivale di gommapiuma.", "Un'arena fisica morbida con spinte amichevoli.", "Cronometra i rimbalzi, scegli gli strumenti di schiuma e fai perdere l'equilibrio al rivale in una giocosa arena di fisica."],
      ru: ["Прыгучая схватка", "Игрушечная арена с таймингом и рикошетами, где нужно сбить пенного соперника.", "Мягкая физическая арена с дружеским отбрасыванием.", "Рассчитывайте свои отскоки, выбирайте пенопластовые инструменты и выбивайте соперника из равновесия на игровой арене, основанной на физике."],
      hi: ["उछलती भिड़ंत", "समय और टकराव से फोम प्रतिद्वंद्वी का संतुलन बिगाड़ने वाला खिलौना अखाड़ा।", "मज़ेदार नॉकबैक वाला नरम भौतिकी अखाड़ा।", "अपनी उछाल का समय निर्धारित करें, फोम टूल चुनें, और एक चंचल भौतिकी क्षेत्र में प्रतिद्वंद्वी को संतुलन से बाहर कर दें।"],
      ar: ["نزال الارتداد", "ساحة ألعاب تعتمد على التوقيت والارتداد لإخلال توازن خصم إسفنجي.", "ساحة فيزياء لطيفة مع دفع مرح.", "حدد توقيت ارتداداتك، واختر الأدوات الرغوية، وأخل بتوازن المنافس في ساحة الفيزياء المرحة."],
    },
    "animal-frost-maze": {
      en: ["Frostline Rescue", "Open the frozen route, collect every berry, and keep one step ahead of the snow drifter.", "A route-changing ice maze rescue."],
      "zh-Hant": ["冰線救援", "打開冰封路線，收集所有莓果，並永遠比雪地漂行者快一步。", "能改變路線的冰迷宮救援。"],
      "zh-Hans": ["冰线救援", "打开冰封路线，收集所有莓果，始终领先雪地漂行者一步。", "可以改变路线的冰迷宫救援。"],
      ja: ["フロストライン救助", "凍った道を開き、すべてのベリーを集め、雪の漂流者より一歩先へ進もう。", "道を変えられる氷迷路レスキュー。"],
      ko: ["프로스트라인 구조", "얼어붙은 길을 열고 모든 베리를 모으며 눈의 방랑자보다 한발 앞서세요.", "경로를 바꾸는 얼음 미로 구조 게임입니다."],
      es: ["Rescate en la línea helada", "Abre la ruta congelada, recoge todas las bayas y adelántate al errante de nieve.", "Un rescate en un laberinto de hielo cambiante."],
      "pt-BR": ["Resgate na Linha de Gelo", "Abra a rota congelada, pegue todas as frutas e fique um passo à frente do andarilho da neve.", "Um resgate em labirinto de gelo mutável."],
      fr: ["Sauvetage de la ligne gelée", "Ouvre la route glacée, ramasse toutes les baies et garde une longueur d'avance sur le rôdeur des neiges.", "Un sauvetage dans un labyrinthe de glace modulable."],
      de: ["Rettung an der Frostlinie", "Öffne den gefrorenen Weg, sammle alle Beeren und bleibe dem Schneewanderer voraus.", "Eine Rettung im wandelbaren Eislabyrinth."],
      it: ["Soccorso sulla linea gelata", "Apri il percorso ghiacciato, raccogli tutte le bacche e resta un passo avanti al vagabondo della neve.", "Un soccorso in un labirinto di ghiaccio modificabile."],
      ru: ["Спасение на ледяной линии", "Откройте замёрзший путь, соберите все ягоды и опередите снежного странника.", "Спасение в меняющемся ледяном лабиринте."],
      hi: ["फ्रॉस्टलाइन बचाव", "जमी हुई राह खोलें, सभी बेरियाँ इकट्ठी करें और बर्फीले भटकने वाले से एक कदम आगे रहें।", "रास्ता बदलने वाला बर्फीला भूलभुलैया बचाव।"],
      ar: ["إنقاذ خط الصقيع", "افتح الطريق المتجمد واجمع كل التوت وابق متقدماً على المتجول الثلجي بخطوة.", "إنقاذ في متاهة جليدية قابلة للتغيير."],
    },
    "animal-flip-foundry": {
      en: ["Flip Foundry", "Swipe a crystal canister, rotate it in the air, and land upright on the next workshop surface.", "A precision swipe-and-land workshop challenge."],
      "zh-Hant": ["翻轉工坊", "滑動晶體罐讓它在空中旋轉，並直立落在下一個工坊表面。", "精準滑動與落地的工坊挑戰。"],
      "zh-Hans": ["翻转工坊", "滑动晶体罐让它在空中旋转，并直立落在下一个工坊表面。", "精准滑动与落地的工坊挑战。"],
      ja: ["フリップ工房", "クリスタル容器をスワイプし、空中で回転させ、次の工房面に立てて着地させよう。", "精密なスワイプ着地の工房チャレンジ。"],
      ko: ["플립 공방", "크리스털 용기를 스와이프해 공중에서 회전시키고 다음 작업대에 똑바로 착지하세요.", "정밀한 스와이프 착지 공방 도전입니다."],
      es: ["Taller de giros", "Desliza el recipiente de cristal, hazlo girar y aterrízalo de pie en la siguiente superficie.", "Un reto de precisión con deslizamiento y aterrizaje."],
      "pt-BR": ["Oficina do Giro", "Deslize o recipiente de cristal, gire-o no ar e pouse em pé na próxima superfície.", "Um desafio de precisão com deslize e pouso."],
      fr: ["Atelier du flip", "Fais glisser le réservoir de cristal, fais-le tourner et pose-le debout sur la prochaine surface.", "Un défi d'atelier de précision et d'atterrissage."],
      de: ["Flip-Werkstatt", "Wische den Kristallbehälter, drehe ihn in der Luft und lande aufrecht auf der nächsten Werkfläche.", "Eine Präzisionsherausforderung mit Wischen und Landen."],
      it: ["Officina del flip", "Scorri il contenitore di cristallo, fallo ruotare in aria e fallo atterrare in piedi sulla superficie successiva.", "Una sfida di precisione tra scorrimento e atterraggio."],
      ru: ["Мастерская переворотов", "Проведите по кристальному контейнеру, вращайте его в воздухе и посадите вертикально на следующую поверхность.", "Точное испытание свайпа и посадки."],
      hi: ["फ्लिप कार्यशाला", "क्रिस्टल कनस्तर पर स्वाइप करें, उसे हवा में घुमाएँ और अगली सतह पर सीधा उतारें।", "सटीक स्वाइप और लैंडिंग कार्यशाला चुनौती।"],
      ar: ["ورشة القلب", "مرر على الحاوية البلورية ودورها في الهواء وأنزلها واقفة على سطح الورشة التالي.", "تحدٍّ دقيق للتمرير والهبوط."],
    },
  };

  function pathLocale() {
    const segment = String(location.pathname).split("/").filter(Boolean)[0] || "";
    return fromSegment[segment] || "";
  }
  function readLocale() {
    let saved = "";
    try { saved = localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale") || localStorage.getItem("wp-locale") || ""; } catch {}
    const candidate = pathLocale() || saved || "en";
    return segments[candidate] ? candidate : "en";
  }
  const gameId = document.body?.dataset.wpFiveGame || document.querySelector("[data-wp-five-game]")?.dataset.wpFiveGame || "";
  let locale = readLocale();
  const sourceToTranslation = new Map();
  function currentCopy() { return gameCopy[gameId]?.[locale] || gameCopy[gameId]?.en || [gameId, "", ""]; }
  function rebuildMap() {
    sourceToTranslation.clear();
    const values = common[locale] || common.en;
    sourceToTranslation.set("Language", values.language); sourceToTranslation.set("Start Game", values.start);
    sourceToTranslation.set("Main", values.main); sourceToTranslation.set("Stages", values.stages);
    sourceToTranslation.set("Chapters", values.chapters); sourceToTranslation.set("Arenas", values.arenas);
    sourceToTranslation.set("Retry", values.retry); sourceToTranslation.set("Next", values.next);
    sourceToTranslation.set("How to Play", values.howTo); sourceToTranslation.set("Back", values.back);
    Object.entries(fixedText[locale] || fixedText.en).forEach(([source, translated]) => sourceToTranslation.set(source, translated));
    const [title, lede, guide, guideSummary] = currentCopy(); sourceToTranslation.set("WEIGHTPLAY · INTERNAL PROTOTYPE", locale === "en" ? "WEIGHTPLAY · INTERNAL PROTOTYPE" : "WEIGHTPLAY · " + (locale === "zh-Hant" ? "內部原型" : locale === "zh-Hans" ? "内部原型" : "INTERNAL PROTOTYPE"));
    sourceToTranslation.set(gameCopy[gameId]?.en?.[0] || title, title);
    sourceToTranslation.set(gameCopy[gameId]?.en?.[1] || lede, lede);
    sourceToTranslation.set(gameCopy[gameId]?.en?.[2] || guide, guide);
    if (gameCopy[gameId]?.en?.[3] && guideSummary) sourceToTranslation.set(gameCopy[gameId].en[3], guideSummary);
  }
  function dynamicTranslate(value) {
    const d = dynamicLabels[locale] || dynamicLabels.en;
    const s = value.trim(); let m;
    const progress = (label, number) => `${label}: ${number}`;
    if ((m = s.match(/^(?:Best|最佳|最好的?)\s*(?:score|成績|成绩|puntuación|pontuação|score|Score|результат|स्कोर|نتيجة)\s*[:：]\s*(\d+)$/i))) return progress(d.bestScore, m[1]);
    if ((m = s.match(/^(?:Best|最佳)\s*(?:streak|連勝|连胜|racha|sequência|série|serie|серия|सिलसिला|سلسلة)\s*[:：]\s*(\d+)$/i))) return progress(d.bestStreak, m[1]);
    if ((m = s.match(/^(?:Best|最佳)\s*(?:wins|勝場|胜场|victorias|vitórias|victoires|Siege|vittorie|победы|जीत|انتصارات)\s*[:：]\s*(\d+)$/i))) return progress(d.bestWins, m[1]);
    if ((m = s.match(/^(?:Best|最佳)\s*(?:rooms|房間|房间|salas|salles|Räume|stanze|комнаты|कमरे|غرف)\s*[:：]\s*(\d+)$/i))) return progress(d.bestRooms, m[1]);
    if ((m = s.match(/^(?:Best|最佳)\s*(?:room|房間|房间|sala|salle|Raum|stanza|комната|कमरा|غرفة)\s*[:：]\s*(\d+)\s*[·•]\s*(?:Deaths|死亡次數|死亡次数|Muertes|Mortes|Morts|Tode|Morti|Падения|मृत्यु|الوفيات)\s*[:：]\s*(\d+)$/i))) return `${d.bestRoom}: ${m[1]} · ${d.deaths}: ${m[2]}`;
    if ((m = s.match(/^(?:Deaths|死亡次數|死亡次数|Muertes|Mortes|Morts|Tode|Morti|Падения|मृत्यु|الوفيات)\s+(\d+)$/i))) return `${d.deaths} ${m[1]}`;
    if ((m = s.match(/^(?:Berries|莓果|เบอร์รี่|ベリー|베리|Bayas|Frutas|Baies|Beeren|Bacche|Ягоды|बेरियाँ|التوت)\s+(\d+)$/i))) return `${d.berries} ${m[1]}`;
    if ((m = s.match(/^(?:Chapter|第)\s*(\d+)\s*[·•]\s*(?:Room|房間|房间|ルーム|방|Sala|Salle|Raum|Stanza|Комната|कमरा|الغرفة)\s*(\d+)\s*\/\s*4$/i))) return `${d.chapter} ${m[1]} · ${d.room} ${m[2]} / 4`;
    if ((m = s.match(/^(?:Chapter|第)\s*(\d+)\s*[·•]\s*(?:Wave|波次|ウェーブ|웨이브|Oleada|Onda|Vague|Welle|Ondata|Волна|लहर|الموجة)\s*(\d+)\s*\/\s*5$/i))) return `${d.chapter} ${m[1]} · ${d.wave} ${m[2]} / 5`;
    if ((m = s.match(/^(?:Arena|鬥場|斗场|アリーナ|경기장|Arena|Arène|арена|अखाड़ा|الساحة)\s*(\d+)\s*\/\s*6$/i))) return `${d.arena} ${m[1]} / 6`;
    if ((m = s.match(/^(?:Surface|表面|足場|발판|Superficie|Surface|Fläche|Поверхность|सतह|السطح)\s*(\d+)\s*\/\s*5$/i))) return `${d.surface} ${m[1]} / 5`;
    if ((m = s.match(/^(?:Chapter|第)\s*(\d+)\s*[·•]\s*(?:Platform|平台|プラットフォーム|플랫폼|Plataforma|Plateforme|Plattform|Piattaforma|Платформа|प्लेटफ़ॉर्म|المنصة)\s*(\d+)\s*\/\s*4$/i))) return `${d.chapter} ${m[1]} · ${d.platform} ${m[2]} / 4`;
    if ((m = s.match(/^(?:Chapter|第)\s*(\d+)\s*[·•]\s*(?:Platform|平台|プラットフォーム|플랫폼|Plataforma|Plateforme|Plattform|Piattaforma|Платформа|प्लेटफ़ॉर्म|المنصة)\s*(\d+)\s*[·•]\s*(?:Streak|連勝|连胜|연속|Racha|Sequência|Série|Serie|Серия|सिलसिला|التتابع)\s*(\d+)\s*[·•]\s*(?:Best|最佳|Mejor|Melhor|Meilleur|Bester|Migliore|Лучшее|सर्वश्रेष्ठ|الأفضل)\s*(\d+)$/i))) return `${d.chapter} ${m[1]} · ${d.platform} ${m[2]} · ${d.streak} ${m[3]} · ${d.bestStreak} ${m[4]}`;
    if ((m = s.match(/^(?:You|你|你|自分|나|Tú|Você|Toi|Du|Tu|Вы|आप|أنت)\s+(\d+)\s*[·•]\s*(?:Rival|對手|对手|相手|상대|Rival|Gegner|Rivale|Соперник|प्रतिद्वंद्वी|الخصم)\s+(\d+)$/i))) return `${d.you} ${m[1]} · ${d.rival} ${m[2]}`;
    if ((m = s.match(/^(?:CHAIN|連擊|连击|チェーン|연쇄|CADENA|CADEIA|CHAÎNE|KETTE|CATENA|ЦЕПЬ|श्रृंखला|السلسلة)\s+(\d+)$/i))) return `${d.chain} ${m[1]}`;
    if ((m = s.match(/^(?:SCORE|分數|分数|スコア|점수|PUNTUACIÓN|PONTUAÇÃO|SCORE|PUNKTE|PUNTEGGIO|СЧЁТ|स्कोर|النتيجة)\s+(\d+)$/i))) return `${d.score} ${m[1]}`;
    if ((m = s.match(/^(?:STREAK|連勝|连胜|連続|연속|RACHA|SÉRIE|SERIE|СЕРИЯ|सिलसिला|التتابع)\s+(\d+)$/i))) return `${d.streak} ${m[1]}`;
    if ((m = s.match(/^(?:BEST|最佳|MEJOR|MELHOR|MEILLEUR|BESTER|MIGLIORE|ЛУЧШИЙ|सर्वश्रेष्ठ|الأفضل)\s+(\d+)$/i))) return `${d.bestScore} ${m[1]}`;
    if ((m = s.match(/^Chain x(\d+)!$/i))) return `${d.chain} x${m[1]}!`;
    return value;
  }
  function translate(value) {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    const exact = sourceToTranslation.get(trimmed);
    if (exact !== undefined) return value.replace(trimmed, exact);
    const dynamic = dynamicTranslate(value);
    return dynamic === value ? value : value.replace(trimmed, dynamic);
  }
  function apply(root = document) {
    rebuildMap();
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    const [title] = currentCopy();
    document.title = `${title} | WeightPlay`;
    root.querySelectorAll?.("[data-five-copy]").forEach((element) => {
      const key = element.dataset.fiveCopy;
      const values = common[locale] || common.en;
      const copy = currentCopy();
      const map = { title: copy[0], lede: copy[1], guideBody: copy[2], guideSummary: copy[3], start: values.start, howTo: values.howTo, language: values.language };
      if (map[key] !== undefined) element.textContent = map[key];
    });
    root.querySelectorAll?.("[data-five-aria]").forEach((element) => {
      const values = common[locale] || common.en;
      if (element.dataset.fiveAria === "language") element.setAttribute("aria-label", values.language);
      else {
        const source = element.getAttribute("aria-label") || "";
        const translated = translate(source);
        if (translated !== source) element.setAttribute("aria-label", translated);
      }
    });
    root.querySelectorAll?.("[aria-label]:not([data-five-aria])").forEach((element) => {
      const source = element.getAttribute("aria-label") || "";
      const translated = translate(source);
      if (translated !== source) element.setAttribute("aria-label", translated);
    });
    root.querySelectorAll?.("#localeSelect").forEach((select) => { select.value = locale; });
    if (root.querySelectorAll) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => { if (node.parentElement?.closest("script,style,select")) return; const next = translate(node.data); if (next !== node.data) node.data = next; });
    }
  }
  function setLocale(next) {
    if (!segments[next]) return;
    locale = next;
    try { localStorage.setItem("weightPlayLocale", locale); } catch {}
    apply(document);
  }
  function start() {
    rebuildMap();
    apply(document);
    document.querySelectorAll("#localeSelect").forEach((select) => select.addEventListener("change", () => setLocale(select.value)));
    const observer = new MutationObserver((records) => records.forEach((record) => {
      if (record.type === "characterData") {
        const next = translate(record.target.data);
        if (next !== record.target.data) record.target.data = next;
        return;
      }
      record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) apply(node);
        else if (node.nodeType === Node.TEXT_NODE) {
          const next = translate(node.data);
          if (next !== node.data) node.data = next;
        }
      });
    }));
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
  }
  window.WeightPlayFiveGameLocale = Object.freeze({ locales, get locale() { return locale; }, setLocale, translate, apply });
  window.wpFiveText = translate;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true }); else start();
})();
