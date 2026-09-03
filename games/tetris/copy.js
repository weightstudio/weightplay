((root) => {
  "use strict";
  // Own runtime copy; the old four-line tutorial text is not a game rule.
  const data = {
    en: ["Lines", "Level", "Next", "Pause", "Continue playing", "Classic falling blocks", "Fill entire horizontal rows. Blocks fall automatically; the run ends when the top is blocked.", "← → move · ↑ rotate · ↓ soft drop · Space hard drop. Outline shows landing. Clear 10 lines to level up.", "Run paused", "Leaving loses this run. Your best score stays saved in this browser.", "The stack reached the top. Keep the surface low and avoid covered holes on your next run.", "Restart this run?", "Soft drop", "Hard drop", "Best score only; the current board is not saved."],
    "zh-Hant": ["消行", "等級", "下一塊", "暫停", "繼續遊戲", "經典方塊堆疊", "填滿整條橫列才會消行。方塊自動下落，堆到頂端無法出塊就結束。", "← → 移動・↑ 旋轉・↓ 慢降・空白鍵直落。空心框是落點；每消除 10 行提升一級。", "遊戲已暫停", "離開會失去本局進度；最高分仍保存在此瀏覽器。", "方塊堆到頂了。下次試著保持低平，避免留下被蓋住的空洞。", "重新開始本局？", "慢降", "直落", "只保存最高分，不保存本局棋盤。"],
    "zh-Hans": ["消行", "等级", "下一块", "暂停", "继续游戏", "经典方块堆叠", "填满整条横行才会消行。方块自动下落，堆到顶端无法出块就结束。", "← → 移动・↑ 旋转・↓ 慢降・空格键直落。空心框是落点；每消除 10 行提升一级。", "游戏已暂停", "离开会失去本局进度；最高分仍保存在此浏览器。", "方块堆到顶了。下次试着保持低平，避免留下被盖住的空洞。", "重新开始本局？", "慢降", "直落", "只保存最高分，不保存本局棋盘。"],
    ja: ["ライン", "レベル", "次", "一時停止", "続ける", "落ちものブロック", "横一列を埋めて消します。自動で落下し、上端が詰まると終了です。", "← → 移動・↑ 回転・↓ ソフトドロップ・Space 即落下。枠は着地点。10ラインでレベルアップ。", "一時停止中", "戻ると今の盤面を失います。最高点はこのブラウザーに残ります。", "上端が詰まりました。低く積み、塞がれた穴を作らないようにしましょう。", "最初からやり直す？", "ゆっくり落下", "即落下", "最高点だけ保存します。盤面は保存しません。"],
    ko: ["줄", "레벨", "다음", "일시정지", "계속하기", "떨어지는 블록", "가로줄을 가득 채우세요. 블록은 자동으로 내려오며 위가 막히면 끝납니다.", "← → 이동 · ↑ 회전 · ↓ 천천히 · Space 즉시 낙하. 윤곽선은 착지 위치입니다. 10줄마다 레벨이 올라갑니다.", "일시정지됨", "나가면 현재 판을 잃습니다. 최고 점수는 이 브라우저에 남습니다.", "블록이 꼭대기에 닿았습니다. 낮게 쌓고 막힌 구멍을 피하세요.", "처음부터 다시 할까요?", "천천히", "즉시 낙하", "최고 점수만 저장하며 현재 판은 저장하지 않습니다."],
    es: ["Líneas", "Nivel", "Siguiente", "Pausa", "Continuar", "Bloques en caída", "Completa filas horizontales. Los bloques caen solos; la partida acaba al bloquearse la parte superior.", "← → mover · ↑ girar · ↓ caída suave · Espacio caída rápida. El contorno marca destino. Cada 10 líneas sube nivel.", "En pausa", "Salir pierde esta partida. Tu récord queda en este navegador.", "La pila llegó arriba. Mantén una superficie baja y evita huecos tapados.", "¿Reiniciar la partida?", "Caída suave", "Caída rápida", "Solo se guarda el récord, no el tablero actual."],
    "pt-BR": ["Linhas", "Nível", "Próxima", "Pausa", "Continuar", "Blocos em queda", "Complete linhas horizontais. Os blocos caem sozinhos; a partida termina quando o topo fica bloqueado.", "← → mover · ↑ girar · ↓ queda suave · Espaço queda rápida. Contorno indica destino. A cada 10 linhas, sobe nível.", "Em pausa", "Sair perde esta partida. O recorde fica neste navegador.", "A pilha chegou ao topo. Mantenha-a baixa e evite buracos cobertos.", "Reiniciar a partida?", "Queda suave", "Queda rápida", "Só o recorde é salvo, não o tabuleiro atual."],
    fr: ["Lignes", "Niveau", "Suivante", "Pause", "Continuer", "Blocs en chute", "Remplissez des lignes horizontales. Les blocs tombent seuls ; la partie finit si le sommet est bloqué.", "← → déplacer · ↑ tourner · ↓ chute douce · Espace chute rapide. Contour indique destination. Un niveau tous les 10 lignes.", "En pause", "Quitter abandonne cette partie. Le record reste dans ce navigateur.", "La pile atteint le sommet. Gardez-la basse et évitez les trous couverts.", "Recommencer la partie ?", "Chute douce", "Chute rapide", "Seul le record est enregistré, pas le plateau actuel."],
    de: ["Reihen", "Stufe", "Nächster", "Pause", "Weiterspielen", "Fallende Blöcke", "Fülle waagerechte Reihen. Blöcke fallen automatisch; ist der obere Rand blockiert, endet die Runde.", "← → bewegen · ↑ drehen · ↓ langsam · Leertaste sofort fallen. Der Umriss zeigt das Ziel. Alle 10 Reihen steigt die Stufe.", "Pausiert", "Verlassen verwirft diese Runde. Der Bestwert bleibt in diesem Browser.", "Der Stapel erreicht den oberen Rand. Halte ihn niedrig und vermeide verdeckte Löcher.", "Runde neu starten?", "Langsam", "Sofort fallen", "Nur der Bestwert wird gespeichert, nicht das aktuelle Feld."],
    it: ["Righe", "Livello", "Prossimo", "Pausa", "Continua", "Blocchi in caduta", "Completa le righe orizzontali. I blocchi scendono da soli; la partita termina se la cima è bloccata.", "← → muovi · ↑ ruota · ↓ discesa lenta · Spazio discesa rapida. Il contorno mostra l'arrivo. Ogni 10 righe sali di livello.", "In pausa", "Uscire abbandona la partita. Il record resta in questo browser.", "La pila ha raggiunto la cima. Mantienila bassa ed evita buchi coperti.", "Ricominciare la partita?", "Discesa lenta", "Discesa rapida", "Si salva solo il record, non il tabellone attuale."],
    ru: ["Линии", "Уровень", "Далее", "Пауза", "Продолжить", "Падающие блоки", "Заполняйте горизонтальные ряды. Блоки падают сами; игра заканчивается, когда верх занят.", "← → движение · ↑ поворот · ↓ медленно · Пробел сброс. Контур показывает приземление. Каждые 10 линий повышают уровень.", "Пауза", "Выход сбросит эту партию. Рекорд останется в браузере.", "Стопка достигла верха. Старайтесь держать её низкой и не закрывать пустоты.", "Начать заново?", "Медленно", "Сброс", "Сохраняется только рекорд, а не текущее поле."],
    hi: ["पंक्तियाँ", "स्तर", "अगला", "विराम", "खेल जारी रखें", "गिरते ब्लॉक", "पूरी क्षैतिज पंक्ति भरें। ब्लॉक अपने आप गिरते हैं; ऊपर जगह न बचने पर खेल समाप्त होता है।", "← → चलाएँ · ↑ घुमाएँ · ↓ धीरे गिराएँ · Space तुरंत गिराएँ। रूपरेखा गिरने की जगह। हर 10 पंक्तियों पर स्तर बढ़े।", "खेल रुका है", "बाहर जाने पर यह खेल मिटेगा। सर्वश्रेष्ठ स्कोर इसी ब्राउज़र में रहेगा।", "ढेर ऊपर तक पहुँच गया। अगली बार ढेर कम ऊँचा रखें और ढके हुए छेद न छोड़ें।", "फिर से शुरू करें?", "धीरे गिराएँ", "तुरंत गिराएँ", "केवल सर्वश्रेष्ठ स्कोर बचता है, वर्तमान बोर्ड नहीं।"],
    ar: ["الصفوف", "المستوى", "التالي", "إيقاف", "متابعة اللعب", "كتل متساقطة", "املأ صفوفاً أفقية كاملة. تسقط الكتل تلقائياً وتنتهي الجولة عندما تُغلق القمة.", "← → تحريك · ↑ تدوير · ↓ سقوط بطيء · مسافة إسقاط سريع. الإطار يبيّن موضع الهبوط. كل 10 صفوف يرتفع المستوى.", "اللعبة متوقفة", "المغادرة تفقد الجولة الحالية. يبقى أفضل مجموع في هذا المتصفح.", "وصلت الكتل إلى القمة. أبقِ الكومة منخفضة وتجنب الفراغات المغطاة.", "إعادة بدء الجولة؟", "سقوط بطيء", "إسقاط سريع", "يُحفظ أفضل مجموع فقط، وليس اللوح الحالي."],
  };
  const keys = ["lines","level","next","pause","resume","tagline","objective","instructions","paused","leave","failure","restart","soft","hard","saved"];
  const labels = {
    en: ["How to play", "What is saved?", "Settings"], "zh-Hant": ["遊玩方式", "會保存哪些進度？", "設定"], "zh-Hans": ["游玩方式", "会保存哪些进度？", "设置"],
    ja: ["遊び方", "何が保存されますか？", "設定"], ko: ["게임 방법", "무엇이 저장되나요?", "설정"], es: ["Cómo jugar", "¿Qué se guarda?", "Ajustes"],
    "pt-BR": ["Como jogar", "O que é salvo?", "Configurações"], fr: ["Comment jouer", "Qu'est-ce qui est enregistré ?", "Réglages"], de: ["Spielanleitung", "Was wird gespeichert?", "Einstellungen"],
    it: ["Come giocare", "Che cosa viene salvato?", "Impostazioni"], ru: ["Как играть", "Что сохраняется?", "Настройки"], hi: ["कैसे खेलें", "क्या सहेजा जाता है?", "सेटिंग"], ar: ["طريقة اللعب", "ما الذي يُحفظ؟", "الإعدادات"],
  };
  const artAlt = {
    en: "Tetris game artwork",
    "zh-Hant": "《俄羅斯方塊》遊戲圖片",
    "zh-Hans": "《俄罗斯方块》游戏图片",
    ja: "テトリスのゲーム画像",
    ko: "테트리스 게임 이미지",
    es: "Imagen del juego Tetris",
    "pt-BR": "Imagem do jogo Tetris",
    fr: "Illustration du jeu Tetris",
    de: "Spielgrafik zu Tetris",
    it: "Immagine del gioco Tetris",
    ru: "Изображение игры «Тетрис»",
    hi: "टेट्रिस गेम चित्र",
    ar: "صورة لعبة تتريس",
  };
  const guide = {
    en: { aria: "Tetris game information", kicker: "WeightPlay Original Game Guide", intro: "A complete falling-block game currently finishing its release checks.", gameplay: "Gameplay", gameplayValue: "Classic Game", genre: "Genre", genreValue: "Classic · Puzzle · Arcade", how: "How to play", faq: "FAQ", roundEndQuestion: "How does the round end?", roundEndAnswer: "The run ends naturally when the stack blocks the top and no legal landing remains." },
    "zh-Hant": { aria: "俄羅斯方塊遊戲資訊", kicker: "WeightPlay 原創遊戲指南", intro: "完整的落下方塊遊戲，目前正在完成發佈檢查。", gameplay: "玩法", gameplayValue: "經典遊戲", genre: "類型", genreValue: "經典・益智・街機", how: "遊玩方式", faq: "常見問題", roundEndQuestion: "這局如何結束？", roundEndAnswer: "當方塊堆住頂端且沒有合法落點時，遊戲會自然結束。" },
    "zh-Hans": { aria: "俄罗斯方块游戏信息", kicker: "WeightPlay 原创游戏指南", intro: "完整的下落方块游戏，目前正在完成发布检查。", gameplay: "玩法", gameplayValue: "经典游戏", genre: "类型", genreValue: "经典・益智・街机", how: "游玩方式", faq: "常见问题", roundEndQuestion: "这一局如何结束？", roundEndAnswer: "当方块堆住顶端且没有合法落点时，游戏会自然结束。" },
    ja: { aria: "テトリスのゲーム情報", kicker: "WeightPlay オリジナルゲームガイド", intro: "落ちものブロックを最後まで遊べるゲームです。現在リリース確認中です。", gameplay: "ゲームプレイ", gameplayValue: "クラシックゲーム", genre: "ジャンル", genreValue: "クラシック・パズル・アーケード", how: "遊び方", faq: "よくある質問", roundEndQuestion: "ラウンドはどう終わりますか？", roundEndAnswer: "積み上がって上端がふさがり、合法的な着地点がなくなると自然に終了します。" },
    ko: { aria: "테트리스 게임 정보", kicker: "WeightPlay 오리지널 게임 가이드", intro: "끝까지 즐기는 낙하 블록 게임입니다. 현재 출시 점검을 진행 중입니다.", gameplay: "게임플레이", gameplayValue: "클래식 게임", genre: "장르", genreValue: "클래식 · 퍼즐 · 아케이드", how: "게임 방법", faq: "자주 묻는 질문", roundEndQuestion: "라운드는 어떻게 끝나나요?", roundEndAnswer: "블록 더미가 꼭대기를 막고 합법적인 착지 공간이 없어지면 자연스럽게 끝납니다." },
    es: { aria: "Información del juego Tetris", kicker: "Guía del juego original de WeightPlay", intro: "Un juego completo de bloques que caen, actualmente en comprobaciones de lanzamiento.", gameplay: "Jugabilidad", gameplayValue: "Juego clásico", genre: "Género", genreValue: "Clásico · Puzle · Arcade", how: "Cómo jugar", faq: "Preguntas frecuentes", roundEndQuestion: "¿Cómo termina la partida?", roundEndAnswer: "La partida termina de forma natural cuando la pila bloquea la parte superior y no queda un aterrizaje legal." },
    "pt-BR": { aria: "Informações do jogo Tetris", kicker: "Guia de jogo original do WeightPlay", intro: "Um jogo completo de blocos em queda, atualmente concluindo as verificações de lançamento.", gameplay: "Jogabilidade", gameplayValue: "Jogo clássico", genre: "Gênero", genreValue: "Clássico · Puzzle · Arcade", how: "Como jogar", faq: "Perguntas frequentes", roundEndQuestion: "Como a rodada termina?", roundEndAnswer: "A partida termina naturalmente quando a pilha bloqueia o topo e não resta um pouso válido." },
    fr: { aria: "Informations sur le jeu Tetris", kicker: "Guide du jeu original WeightPlay", intro: "Un jeu complet de blocs qui tombent, actuellement en vérification avant publication.", gameplay: "Jeu", gameplayValue: "Jeu classique", genre: "Genre", genreValue: "Classique · Puzzle · Arcade", how: "Comment jouer", faq: "Questions fréquentes", roundEndQuestion: "Comment la partie se termine-t-elle ?", roundEndAnswer: "La partie se termine naturellement lorsque la pile bloque le sommet et qu'il ne reste plus de pose légale." },
    de: { aria: "Tetris-Spielinformationen", kicker: "WeightPlay Original-Spielanleitung", intro: "Ein vollständiges Spiel mit fallenden Blöcken, derzeit in der Abschlussprüfung für die Veröffentlichung.", gameplay: "Spielweise", gameplayValue: "Klassisches Spiel", genre: "Genre", genreValue: "Klassisch · Puzzle · Arcade", how: "Spielanleitung", faq: "Häufige Fragen", roundEndQuestion: "Wie endet die Runde?", roundEndAnswer: "Die Runde endet natürlich, wenn der Stapel den oberen Rand blockiert und keine legale Landung mehr möglich ist." },
    it: { aria: "Informazioni sul gioco Tetris", kicker: "Guida al gioco originale WeightPlay", intro: "Un gioco completo di blocchi in caduta, attualmente in fase di verifica per il rilascio.", gameplay: "Gameplay", gameplayValue: "Gioco classico", genre: "Genere", genreValue: "Classico · Puzzle · Arcade", how: "Come giocare", faq: "Domande frequenti", roundEndQuestion: "Come termina la partita?", roundEndAnswer: "La partita termina naturalmente quando la pila blocca la cima e non resta alcun atterraggio legale." },
    ru: { aria: "Информация об игре Тетрис", kicker: "Оригинальное руководство WeightPlay", intro: "Полная игра с падающими блоками, сейчас проходит финальную проверку перед выпуском.", gameplay: "Игровой процесс", gameplayValue: "Классическая игра", genre: "Жанр", genreValue: "Классика · Пазл · Аркада", how: "Как играть", faq: "Частые вопросы", roundEndQuestion: "Как заканчивается раунд?", roundEndAnswer: "Раунд естественно заканчивается, когда стопка закрывает верх и не остаётся допустимого места для приземления." },
    hi: { aria: "टेट्रिस गेम की जानकारी", kicker: "WeightPlay मूल गेम गाइड", intro: "गिरते ब्लॉकों का पूरा गेम, जिसकी रिलीज़ जाँच अभी पूरी हो रही है।", gameplay: "गेमप्ले", gameplayValue: "क्लासिक गेम", genre: "शैली", genreValue: "क्लासिक · पज़ल · आर्केड", how: "कैसे खेलें", faq: "अक्सर पूछे जाने वाले प्रश्न", roundEndQuestion: "राउंड कैसे समाप्त होता है?", roundEndAnswer: "जब ब्लॉकों का ढेर ऊपर का रास्ता रोक देता है और उतरने की कोई वैध जगह नहीं रहती, तब खेल स्वाभाविक रूप से समाप्त होता है।" },
    ar: { aria: "معلومات لعبة تتريس", kicker: "دليل ألعاب WeightPlay الأصلية", intro: "لعبة كتل متساقطة كاملة، وتستكمل حالياً فحوصات الإصدار.", gameplay: "أسلوب اللعب", gameplayValue: "لعبة كلاسيكية", genre: "النوع", genreValue: "كلاسيكية · ألغاز · أركيد", how: "طريقة اللعب", faq: "الأسئلة الشائعة", roundEndQuestion: "كيف تنتهي الجولة؟", roundEndAnswer: "تنتهي الجولة طبيعياً عندما تحجب الكومة القمة ولا يبقى موضع هبوط قانوني." },
  };
  const settings = {
    en: { language: "Language", sound: "Sound", soundOn: "On", soundOff: "Off" },
    "zh-Hant": { language: "語言", sound: "音效", soundOn: "開啟", soundOff: "關閉" },
    "zh-Hans": { language: "语言", sound: "音效", soundOn: "开启", soundOff: "关闭" },
    ja: { language: "言語", sound: "サウンド", soundOn: "オン", soundOff: "オフ" },
    ko: { language: "언어", sound: "소리", soundOn: "켜기", soundOff: "끄기" },
    es: { language: "Idioma", sound: "Sonido", soundOn: "Activado", soundOff: "Desactivado" },
    "pt-BR": { language: "Idioma", sound: "Som", soundOn: "Ativado", soundOff: "Desativado" },
    fr: { language: "Langue", sound: "Son", soundOn: "Activé", soundOff: "Désactivé" },
    de: { language: "Sprache", sound: "Ton", soundOn: "An", soundOff: "Aus" },
    it: { language: "Lingua", sound: "Audio", soundOn: "Attivo", soundOff: "Disattivato" },
    ru: { language: "Язык", sound: "Звук", soundOn: "Вкл.", soundOff: "Выкл." },
    hi: { language: "भाषा", sound: "ध्वनि", soundOn: "चालू", soundOff: "बंद" },
    ar: { language: "اللغة", sound: "الصوت", soundOn: "مفعّل", soundOff: "متوقف" },
  };
  root.WPTetrisCopy = (locale) => ({
    ...Object.fromEntries(keys.map((key,i) => [key, (data[locale] || data.en)[i]])),
    ...Object.fromEntries(["how","saveQuestion","settings"].map((key,i)=>[key,(labels[locale]||labels.en)[i]])),
    ...(guide[locale] || guide.en),
    ...(settings[locale] || settings.en),
    artAlt: artAlt[locale] || artAlt.en,
  });
})(globalThis);
