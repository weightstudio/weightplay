/* Game-owned 13-locale runtime for the 2026-08-19 market-reference five. */
(() => {
  const localeOrder = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const segments = { en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const fromSegment = Object.fromEntries(Object.entries(segments).map(([locale, segment]) => [segment, locale]));
  const common = {
    en: ["Language", "Start Game", "Stages", "Back to Main", "Back to Stages", "Retry", "Next Stage", "How to Play", "Best", "Stage", "Goal reached", "Try again", "Choose a stage", "Sound", "Shoot", "Reveal clue", "Up", "Left", "Down", "Right", "Lock blend", "Reset reserve", "Game controls"],
    "zh-Hant": ["語言", "開始遊戲", "關卡", "返回主頁", "返回關卡", "重試", "下一關", "玩法說明", "最佳", "關卡", "達成目標", "再試一次", "選擇關卡", "音效", "投籃", "揭開線索", "向上", "向左", "向下", "向右", "鎖定偽裝", "重設保護區", "遊戲控制"],
    "zh-Hans": ["语言", "开始游戏", "关卡", "返回主页", "返回关卡", "重试", "下一关", "玩法说明", "最佳", "关卡", "达成目标", "再试一次", "选择关卡", "音效", "投篮", "揭开线索", "向上", "向左", "向下", "向右", "锁定伪装", "重设保护区", "游戏控制"],
    ja: ["言語", "ゲーム開始", "ステージ", "メインへ戻る", "ステージへ戻る", "リトライ", "次のステージ", "遊び方", "ベスト", "ステージ", "目標達成", "もう一度", "ステージを選択", "サウンド", "シュート", "手がかりを開く", "上", "左", "下", "右", "擬態を確定", "保護区をリセット", "ゲーム操作"],
    ko: ["언어", "게임 시작", "스테이지", "메인으로 돌아가기", "스테이지로 돌아가기", "다시 하기", "다음 스테이지", "게임 방법", "최고", "스테이지", "목표 달성", "다시 도전", "스테이지 선택", "소리", "슛", "단서 보기", "위", "왼쪽", "아래", "오른쪽", "위장 확정", "보호구역 초기화", "게임 조작"],
    es: ["Idioma", "Empezar juego", "Fases", "Volver al inicio", "Volver a las fases", "Reintentar", "Siguiente fase", "Cómo jugar", "Mejor", "Fase", "Objetivo logrado", "Inténtalo de nuevo", "Elige una fase", "Sonido", "Tiro", "Revelar pista", "Arriba", "Izquierda", "Abajo", "Derecha", "Fijar camuflaje", "Reiniciar reserva", "Controles del juego"],
    "pt-BR": ["Idioma", "Iniciar jogo", "Fases", "Voltar ao início", "Voltar às fases", "Tentar de novo", "Próxima fase", "Como jogar", "Melhor", "Fase", "Objetivo alcançado", "Tente novamente", "Escolha uma fase", "Som", "Arremessar", "Revelar pista", "Cima", "Esquerda", "Baixo", "Direita", "Fixar camuflagem", "Reiniciar reserva", "Controles do jogo"],
    fr: ["Langue", "Commencer", "Niveaux", "Retour à l’accueil", "Retour aux niveaux", "Réessayer", "Niveau suivant", "Comment jouer", "Meilleur", "Niveau", "Objectif atteint", "Réessaie", "Choisis un niveau", "Son", "Tirer", "Révéler un indice", "Haut", "Gauche", "Bas", "Droite", "Valider le camouflage", "Réinitialiser la réserve", "Commandes du jeu"],
    de: ["Sprache", "Spiel starten", "Stufen", "Zurück zum Start", "Zurück zu den Stufen", "Erneut", "Nächste Stufe", "Spielanleitung", "Bestwert", "Stufe", "Ziel erreicht", "Noch einmal", "Stufe wählen", "Ton", "Werfen", "Hinweis zeigen", "Oben", "Links", "Unten", "Rechts", "Tarnung bestätigen", "Reservat zurücksetzen", "Spielsteuerung"],
    it: ["Lingua", "Inizia gioco", "Livelli", "Torna all’inizio", "Torna ai livelli", "Riprova", "Livello successivo", "Come si gioca", "Migliore", "Livello", "Obiettivo raggiunto", "Riprova", "Scegli un livello", "Audio", "Tiro", "Rivela indizio", "Su", "Sinistra", "Giù", "Destra", "Blocca mimetismo", "Azzera riserva", "Controlli di gioco"],
    ru: ["Язык", "Начать игру", "Уровни", "На главную", "К уровням", "Повторить", "Следующий уровень", "Как играть", "Лучший", "Уровень", "Цель достигнута", "Попробуйте снова", "Выберите уровень", "Звук", "Бросок", "Открыть подсказку", "Вверх", "Влево", "Вниз", "Вправо", "Закрепить маскировку", "Сбросить заповедник", "Управление игрой"],
    hi: ["भाषा", "खेल शुरू करें", "स्तर", "मुख्य पृष्ठ पर लौटें", "स्तरों पर लौटें", "फिर कोशिश", "अगला स्तर", "कैसे खेलें", "सर्वश्रेष्ठ", "स्तर", "लक्ष्य पूरा", "फिर प्रयास करें", "एक स्तर चुनें", "ध्वनि", "शूट", "संकेत खोलें", "ऊपर", "बाएँ", "नीचे", "दाएँ", "छद्मावरण लॉक करें", "अभयारण्य रीसेट करें", "गेम नियंत्रण"],
    ar: ["اللغة", "ابدأ اللعبة", "المراحل", "العودة إلى الرئيسية", "العودة إلى المراحل", "إعادة المحاولة", "المرحلة التالية", "طريقة اللعب", "الأفضل", "المرحلة", "تحقق الهدف", "حاول مجدداً", "اختر مرحلة", "الصوت", "تسديد", "اكشف الدليل", "أعلى", "يسار", "أسفل", "يمين", "ثبّت التمويه", "أعد ضبط المحمية", "عناصر التحكم باللعبة"],
  };
  const blendStageNamesEn = [
    "First Blend", "Twin Tones", "Quiet Pattern", "Memory Garden", "Lantern Checkpoint",
    "Moving Hues", "Breezy Match", "Reverse Petals", "Long Recall", "Windkeeper Checkpoint",
    "Shadow Blend", "Soft Decoy", "Twilight Memory", "Mixed Signals", "Twilight Checkpoint",
    "Weaving Colors", "Branch Sequence", "Narrow Match", "Fast Recall", "Bough Guardian Checkpoint",
    "Signal Garden", "Pulse Pattern", "Hazard Rhythm", "Last Light Relay", "Signal Checkpoint",
    "Mastery Blend", "Full Palette", "Storm Recall", "Final Relay", "Grand Blend Finale",
  ];
  const blendStageNamesAr = [
    "المزج الأول", "نغمتان", "النمط الهادئ", "حديقة الذاكرة", "نقطة ضوء الفانوس",
    "ألوان متحركة", "مطابقة النسيم", "بتلات معكوسة", "تذكّر طويل", "نقطة حارس الريح",
    "مزج الظلال", "خدعة ناعمة", "ذاكرة الشفق", "إشارات مختلطة", "نقطة الشفق",
    "ألوان متشابكة", "تسلسل الأغصان", "مطابقة ضيقة", "تذكّر سريع", "نقطة حارس الغصن",
    "حديقة الإشارة", "نمط النبض", "إيقاع الخطر", "تتابع الضوء الأخير", "نقطة الإشارة",
    "مزج الإتقان", "الطيف الكامل", "تذكّر العاصفة", "التتابع الأخير", "نهائي المزج الكبير",
  ];
  const blendArcNamesEn = ["First Light", "Windy Boughs", "Twilight Garden", "Moving Canopy", "Signal Orchard", "Mastery Grove"];
  const blendArcNamesAr = ["الضوء الأول", "أغصان عاصفة", "حديقة الشفق", "مظلة متحركة", "بستان الإشارة", "بستان الإتقان"];
  const blendLocalizedSeries = (english, arabic) => english.map((name, index) => localeOrder.map((locale) => locale === "ar" ? arabic[index] : name));
  const blendStageNames = blendLocalizedSeries(blendStageNamesEn, blendStageNamesAr);
  const blendArcNames = blendLocalizedSeries(blendArcNamesEn, blendArcNamesAr);
  const gameText = {
    "animal-hoop-league": {
      title: ["Animal Hoop League", "動物灌籃聯盟", "动物灌篮联盟", "アニマル・フープリーグ", "애니멀 후프 리그", "Liga Animal de Aros", "Liga Animal de Cestas", "Ligue Animale du Panier", "Tierische Korbliga", "Lega Animale del Canestro", "Звериная лига колец", "एनिमल हूप लीग", "دوري سلال الحيوانات"],
      lede: ["Read the arc, set the power, and finish ahead of the rival after the final shot.", "看準弧線、控制力道，在最後一球後領先對手。", "看准弧线、控制力度，在最后一球后领先对手。", "軌道を読み、強さを決め、最終ショット後に相手を上回ろう。", "궤적을 읽고 힘을 맞춰 마지막 슛 뒤에 상대보다 앞서세요.", "Lee el arco, ajusta la fuerza y termina por delante tras el último tiro.", "Leia o arco, ajuste a força e termine à frente após o último arremesso.", "Lis la trajectoire, règle la puissance et termine devant après le dernier tir.", "Lies den Bogen, dosiere die Kraft und liege nach dem letzten Wurf vorn.", "Leggi l’arco, regola la forza e chiudi in vantaggio dopo l’ultimo tiro.", "Оцените дугу, выберите силу и останьтесь впереди после последнего броска.", "चाप पढ़ें, ताकत तय करें और आखिरी शॉट के बाद प्रतिद्वंद्वी से आगे रहें।", "اقرأ القوس واضبط القوة وأنهِ المباراة متقدماً بعد التسديدة الأخيرة."],
      guide: ["Move the aim, hold SHOOT to build power, then release inside the gold window. Clean timing earns two points.", "移動瞄準，按住「投籃」蓄力，在金色區間放開；精準出手可得兩分。", "移动瞄准，按住“投篮”蓄力，在金色区间松开；精准出手可得两分。", "狙いを動かし、シュートを長押しして、金色の範囲で離します。", "조준을 옮기고 슛을 길게 누른 뒤 금색 구간에서 놓으세요.", "Mueve la mira, mantén TIRO y suelta dentro de la zona dorada.", "Mova a mira, segure ARREMESSO e solte na faixa dourada.", "Déplace la visée, maintiens TIR et relâche dans la zone dorée.", "Bewege das Ziel, halte WURF und lasse im goldenen Feld los.", "Sposta la mira, tieni premuto TIRO e rilascia nella zona dorata.", "Двигайте прицел, удерживайте БРОСОК и отпустите в золотой зоне.", "निशाना बदलें, शूट दबाए रखें और सुनहरे क्षेत्र में छोड़ें।", "حرّك التصويب واضغط مطولاً على التسديد ثم أفلت داخل النطاق الذهبي."],
      courts: [
        ["Steady Arc", "穩定弧線", "稳定弧线", "安定アーク", "안정 아크", "Arco estable", "Arco estável", "Arc stable", "Ruhiger Bogen", "Arco stabile", "Стабильная дуга", "स्थिर चाप", "القوس الثابت"],
        ["Crosswind", "交錯風向", "交错风向", "クロスウインド", "교차풍", "Viento cruzado", "Vento cruzado", "Vent croisé", "Seitenwind", "Vento incrociato", "Боковой ветер", "आड़ी हवा", "الرياح المتقاطعة"],
        ["Bank Shot", "籃板出手", "篮板出手", "バンクショット", "뱅크 슛", "Tiro a tabla", "Tiro de tabela", "Tir avec planche", "Brettwurf", "Tiro di tabella", "Бросок от щита", "बैंक शॉट", "رمية اللوحة"],
        ["Pulse Window", "脈衝窗口", "脉冲窗口", "パルス窓", "펄스 창", "Ventana de pulso", "Janela de pulso", "Fenêtre pulsée", "Pulsfenster", "Finestra impulso", "Импульсное окно", "पल्स विंडो", "نافذة النبض"],
        ["Rival Rush", "對手衝刺", "对手冲刺", "ライバルラッシュ", "라이벌 러시", "Asalto rival", "Pressão rival", "Ruée rivale", "Rivalendruck", "Assalto rivale", "Натиск соперника", "प्रतिद्वंद्वी दबाव", "اندفاع المنافس"],
        ["Crown Final", "冠軍決賽", "冠军决赛", "クラウン決勝", "크라운 결승", "Final de corona", "Final da coroa", "Finale de la couronne", "Kronenfinale", "Finale della corona", "Финал короны", "क्राउन फाइनल", "نهائي التاج"],
      ],
      hoop: {
        firstShot: ["First shot: hold until the power marker enters the gold window, then release.", "第一球：按住直到力道標記進入金色區間，再放開。", "第一球：按住直到力度标记进入金色区间，再松开。", "最初の一投：パワーのマーカーが金色の範囲に入ったら離します。", "첫 슛: 힘 표시가 금색 구간에 들어오면 놓으세요.", "Primer tiro: mantén hasta que el marcador de fuerza entre en la zona dorada y suelta.", "Primeiro tiro: segure até o marcador de força entrar na faixa dourada e solte.", "Premier tir : maintiens jusqu’à ce que le marqueur de puissance entre dans la zone dorée, puis relâche.", "Erster Wurf: Halte, bis der Kraftmarker im goldenen Feld steht, und lasse dann los.", "Primo tiro: tieni premuto finché il indicatore di potenza entra nella zona dorata, poi rilascia.", "Первый бросок: удерживайте, пока маркер силы не войдёт в золотую зону, затем отпустите.", "पहला शॉट: ताकत संकेतक सुनहरे क्षेत्र में आने तक दबाएँ, फिर छोड़ें।", "التسديدة الأولى: اضغط حتى يدخل مؤشر القوة في النطاق الذهبي ثم أفلت."],
        perfect: ["Perfect release", "完美出手", "完美出手", "パーフェクトリリース", "완벽한 릴리스", "Suelta perfecta", "Soltura perfeita", "Lâcher parfait", "Perfekter Abwurf", "Rilascio perfetto", "Идеальный выпуск", "सटीक रिलीज़", "إفلات مثالي"],
        made: ["Shot made", "投籃命中", "投篮命中", "シュート成功", "슛 성공", "Canasta", "Cesta", "Panier marqué", "Treffer", "Canestro", "Попадание", "शॉट सफल", "سلة ناجحة"],
        missed: ["Missed", "未命中", "未命中", "ミス", "실패", "Fallado", "Errou", "Raté", "Verfehlt", "Mancato", "Промах", "चूक", "أخطأت"],
        aimLeft: ["aim left", "向左修正", "向左修正", "左へ狙う", "왼쪽으로 조준", "apunta a la izquierda", "mire à esquerda", "vise à gauche", "weiter links zielen", "mira a sinistra", "цельтесь левее", "बाएँ निशाना", "صوّب يساراً"],
        aimRight: ["aim right", "向右修正", "向右修正", "右へ狙う", "오른쪽으로 조준", "apunta a la derecha", "mire à direita", "vise à droite", "weiter rechts zielen", "mira a destra", "цельтесь правее", "दाएँ निशाना", "صوّب يميناً"],
        aimSet: ["aim set", "瞄準正確", "瞄准正确", "狙いは正確", "조준 정확", "puntería correcta", "mira certa", "visée correcte", "Ziel stimmt", "mira corretta", "прицел верный", "निशाना सही", "التصويب صحيح"],
        holdLonger: ["hold longer", "再按久一點", "再按久一点", "もう少し長押し", "더 오래 누르기", "mantén más", "segure mais", "maintiens plus", "länger halten", "tieni più a lungo", "держите дольше", "और देर दबाएँ", "اضغط مدة أطول"],
        releaseEarlier: ["release earlier", "提早放開", "提早松开", "早めに離す", "더 일찍 놓기", "suelta antes", "solte antes", "relâche plus tôt", "früher loslassen", "rilascia prima", "отпустите раньше", "पहले छोड़ें", "أفلت أبكر"],
        powerSet: ["power set", "力道正確", "力度正确", "強さは正確", "힘 정확", "fuerza correcta", "força certa", "puissance correcte", "Kraft stimmt", "forza corretta", "сила верна", "ताकत सही", "القوة صحيحة"],
        madeCount: ["{made}/{shots} made", "命中 {made}/{shots}", "命中 {made}/{shots}", "{made}/{shots} 成功", "{made}/{shots} 성공", "{made}/{shots} encestados", "{made}/{shots} cestas", "{made}/{shots} paniers", "{made}/{shots} Treffer", "{made}/{shots} canestri", "Попаданий: {made}/{shots}", "{made}/{shots} सफल", "{made}/{shots} ناجحة"],
        perfectCount: ["{perfect} perfect", "{perfect} 次完美出手", "{perfect} 次完美出手", "パーフェクト {perfect}", "완벽 {perfect}", "{perfect} perfectos", "{perfect} perfeitos", "{perfect} parfaits", "{perfect} perfekt", "{perfect} perfetti", "Идеальных: {perfect}", "{perfect} सटीक", "{perfect} مثالية"],
        nextShot: ["Next shot", "下一球", "下一球", "次の一投", "다음 슛", "Próximo tiro", "Próximo arremesso", "Prochain tir", "Nächster Wurf", "Prossimo tiro", "Следующий бросок", "अगला शॉट", "التسديدة التالية"],
      },
    },
    "animal-habitat-atlas": {
      title: ["Habitat Atlas", "棲地圖鑑", "栖地图鉴", "ハビタット・アトラス", "서식지 아틀라스", "Atlas de Hábitats", "Atlas de Habitats", "Atlas des Habitats", "Lebensraum-Atlas", "Atlante degli Habitat", "Атлас сред обитания", "हैबिटैट एटलस", "أطلس المواطن"],
      lede: ["Combine climate, terrain, and wildlife clues to pinpoint the matching habitat.", "結合氣候、地形與動物線索，找出正確棲地。", "结合气候、地形与动物线索，找出正确栖地。", "気候・地形・動物の手がかりを組み合わせ、生息地を特定しよう。", "기후, 지형, 야생동물 단서를 조합해 알맞은 서식지를 찾으세요.", "Combina pistas de clima, terreno y fauna para localizar el hábitat.", "Combine pistas de clima, terreno e fauna para localizar o habitat.", "Combine climat, terrain et faune pour trouver le bon habitat.", "Verbinde Klima-, Gelände- und Tierhinweise zum passenden Lebensraum.", "Combina clima, terreno e fauna per trovare l’habitat corretto.", "Объедините подсказки о климате, рельефе и животных и найдите среду.", "जलवायु, भूभाग और वन्यजीव संकेतों से सही आवास खोजें।", "ادمج دلائل المناخ والتضاريس والحياة البرية وحدد الموطن الصحيح."],
      guide: ["Match wet or dry, cool or warm, and open or sheltered traits. Two clues identify one habitat; a third confirms its wildlife.", "比對潮濕或乾燥、涼冷或溫暖、開闊或遮蔽特徵；兩條線索可鎖定棲地，第三條會確認動物。", "比对潮湿或干燥、凉冷或温暖、开阔或遮蔽特征；两条线索可锁定栖地，第三条会确认动物。", "湿潤／乾燥、寒冷／温暖、開放／保護の特徴を照合。2つで生息地が決まり、3つ目で動物を確認できます。", "습함/건조, 서늘함/따뜻함, 개방/보호 특성을 맞추세요. 두 단서로 서식지를 찾고 세 번째로 동물을 확인합니다.", "Combina húmedo o seco, fresco o cálido y abierto o protegido. Dos pistas identifican el hábitat; la tercera confirma su fauna.", "Combine úmido ou seco, frio ou quente e aberto ou protegido. Duas pistas identificam o habitat; a terceira confirma a fauna.", "Associe humide ou sec, frais ou chaud, ouvert ou abrité. Deux indices trouvent l’habitat ; le troisième confirme sa faune.", "Ordne feucht oder trocken, kühl oder warm und offen oder geschützt zu. Zwei Hinweise bestimmen den Lebensraum, der dritte bestätigt das Tier.", "Abbina umido o secco, fresco o caldo e aperto o riparato. Due indizi trovano l’habitat; il terzo conferma la fauna.", "Сопоставьте влажность, температуру и открытость. Две подсказки определяют среду, третья подтверждает животное.", "गीला/सूखा, ठंडा/गर्म और खुला/आश्रित गुण मिलाएँ। दो संकेत आवास बताते हैं; तीसरा जीव की पुष्टि करता है।", "طابق الرطب أو الجاف والبارد أو الدافئ والمفتوح أو المحمي. دليلان يحددان الموطن والثالث يؤكد حيوانه."],
      regions: [
        ["Ocean", "海洋", "海洋", "海", "바다", "Océano", "Oceano", "Océan", "Ozean", "Oceano", "Океан", "महासागर", "المحيط"],
        ["Arctic", "極地", "极地", "極地", "극지", "Ártico", "Ártico", "Arctique", "Arktis", "Artico", "Арктика", "आर्कटिक", "القطب"],
        ["Desert", "沙漠", "沙漠", "砂漠", "사막", "Desierto", "Deserto", "Désert", "Wüste", "Deserto", "Пустыня", "रेगिस्तान", "الصحراء"],
        ["Forest", "森林", "森林", "森", "숲", "Bosque", "Floresta", "Forêt", "Wald", "Foresta", "Лес", "जंगल", "الغابة"],
      ],
      canvas: ["Habitat Atlas play area", "棲地圖鑑遊戲區", "栖地图鉴游戏区", "ハビタット・アトラスのプレイエリア", "서식지 아틀라스 플레이 영역", "Área de juego de Atlas de Hábitats", "Área de jogo do Atlas de Habitats", "Zone de jeu de l’Atlas des Habitats", "Spielfläche des Lebensraum-Atlas", "Area di gioco dell’Atlante degli Habitat", "Игровое поле «Атласа сред обитания»", "हैबिटैट एटलस का खेल क्षेत्र", "منطقة لعب أطلس المواطن"],
      incorrect: ["Not this habitat — keep comparing the clues.", "不是這個棲地——繼續比對線索。", "不是这个栖地——继续比对线索。", "この生息地ではありません。手がかりを比べ続けましょう。", "이 서식지가 아닙니다. 단서를 계속 비교하세요.", "No es este hábitat; sigue comparando las pistas.", "Não é este habitat; continue comparando as pistas.", "Ce n’est pas cet habitat ; continuez à comparer les indices.", "Dieser Lebensraum ist es nicht – vergleiche die Hinweise weiter.", "Non è questo habitat: continua a confrontare gli indizi.", "Это не та среда — продолжайте сравнивать подсказки.", "यह आवास सही नहीं है — संकेतों की तुलना करते रहें।", "هذا ليس الموطن الصحيح — واصل مقارنة الأدلة."],
      correct: ["Correct habitat — clues align.", "正確棲地——線索吻合。", "正确栖地——线索吻合。", "正しい生息地です。手がかりが一致しました。", "올바른 서식지입니다. 단서가 일치합니다.", "Hábitat correcto: las pistas coinciden.", "Habitat correto: as pistas coincidem.", "Habitat correct : les indices correspondent.", "Richtiger Lebensraum – die Hinweise passen.", "Habitat corretto: gli indizi coincidono.", "Верная среда — подсказки совпали.", "सही आवास — संकेत मेल खाते हैं।", "الموطن الصحيح — تتطابق الأدلة."],
    },
    "animal-moonlight-workshop": {
      title: ["Moonlight Workshop Escape", "月光工坊逃脫", "月光工坊逃脱", "月明かり工房の脱出", "달빛 공방 탈출", "Escape del Taller Lunar", "Fuga da Oficina Lunar", "Évasion de l’Atelier Lunaire", "Flucht aus der Mondwerkstatt", "Fuga dall’Officina Lunare", "Побег из лунной мастерской", "मूनलाइट वर्कशॉप एस्केप", "الهروب من ورشة ضوء القمر"],
      lede: ["Route Rux across switches, collect the key, and open the workshop door.", "規劃 Rux 的路線，踩亮開關、取得鑰匙並開啟工坊大門。", "规划 Rux 的路线，踩亮开关、取得钥匙并开启工坊大门。", "ルクスを導き、スイッチを踏み、鍵を取って工房の扉を開けよう。", "룩스의 길을 계획해 스위치를 켜고 열쇠를 얻어 공방 문을 여세요.", "Guía a Rux por los interruptores, recoge la llave y abre la puerta.", "Guie Rux pelos interruptores, pegue a chave e abra a porta.", "Guide Rux sur les interrupteurs, prends la clé et ouvre la porte.", "Führe Rux über Schalter, hole den Schlüssel und öffne das Tor.", "Guida Rux sugli interruttori, prendi la chiave e apri la porta.", "Проведите Рукса по переключателям, возьмите ключ и откройте дверь.", "रक्स को स्विचों तक ले जाएँ, चाबी लें और कार्यशाला का दरवाज़ा खोलें।", "وجّه روكس عبر المفاتيح واجمع المفتاح وافتح باب الورشة."],
      guide: ["Use arrows, WASD, or the pad. Read walls, numbered gates, ice, portals, and switch order; light every switch, take the key, then exit within the move budget.", "使用方向鍵、WASD 或畫面方向盤；看懂牆、數字門、冰軌、傳送門與開關順序，在步數內點亮全部開關、拿鑰匙並離開。", "使用方向键、WASD 或画面方向盘；看懂墙、数字门、冰轨、传送门与开关顺序，在步数内点亮全部开关、拿钥匙并离开。", "矢印、WASD、画面パッドで移動。壁、数字ゲート、氷、ポータル、スイッチ順を読み、手数内に全点灯・鍵・出口を達成します。", "화살표, WASD 또는 패드로 이동하세요. 벽, 숫자 문, 얼음, 포털, 스위치 순서를 읽고 제한 안에 모두 켜서 열쇠를 얻고 탈출하세요.", "Usa flechas, WASD o el control. Lee muros, puertas numeradas, hielo, portales y orden; enciende todo, toma la llave y sal dentro del límite.", "Use setas, WASD ou o controle. Leia paredes, portões numerados, gelo, portais e ordem; acenda tudo, pegue a chave e saia no limite.", "Utilise flèches, WASD ou le pavé. Lis murs, portes numérotées, glace, portails et ordre ; allume tout, prends la clé et sors à temps.", "Nutze Pfeile, WASD oder das Steuerkreuz. Beachte Wände, Zahlentore, Eis, Portale und Reihenfolge; aktiviere alles, hole den Schlüssel und entkomme im Limit.", "Usa frecce, WASD o il comando. Leggi muri, cancelli numerati, ghiaccio, portali e ordine; accendi tutto, prendi la chiave ed esci nel limite.", "Используйте стрелки, WASD или панель. Учитывайте стены, ворота, лёд, порталы и порядок; зажгите всё, возьмите ключ и выйдите за лимит.", "तीर, WASD या पैड से चलें। दीवार, अंकित द्वार, बर्फ, पोर्टल और क्रम समझें; सीमा में सभी स्विच जलाकर चाबी लें और निकलें।", "استخدم الأسهم أو WASD أو اللوحة. راقب الجدران والبوابات المرقمة والجليد والبوابات وترتيب المفاتيح؛ أضئها وخذ المفتاح واخرج ضمن الحد."],
    },
    "animal-chameleon-blend": {
      title: ["Chameleon Blend Trials", "變色龍融景試煉", "变色龙融景试炼", "カメレオン・ブレンド試練", "카멜레온 블렌드 시험", "Pruebas de Camuflaje", "Provas de Camuflagem", "Épreuves de Camouflage", "Chamäleon-Tarnproben", "Prove di Mimetismo", "Испытания хамелеона", "कैमेलियन ब्लेंड ट्रायल्स", "تجارب تمويه الحرباء"],
      lede: ["Study the safe texture, match color and pattern, then hide before the spotlight scans.", "記住安全紋理，配對顏色與圖樣，並在探照燈掃過前完成偽裝。", "记住安全纹理，配对颜色与图样，并在探照灯扫过前完成伪装。", "安全な模様を覚え、色と柄を合わせ、スポットライトの前に隠れよう。", "안전한 질감을 기억하고 색과 무늬를 맞춘 뒤 탐조등이 오기 전에 숨으세요.", "Estudia la textura segura, combina color y patrón y escóndete antes del foco.", "Estude a textura segura, combine cor e padrão e esconda-se antes do foco.", "Observe la texture sûre, associe couleur et motif puis cache-toi avant le faisceau.", "Merke dir die sichere Textur, kombiniere Farbe und Muster und tarne dich vor dem Licht.", "Studia la trama sicura, abbina colore e motivo e nasconditi prima del fascio.", "Запомните безопасную текстуру, подберите цвет и узор и спрячьтесь до луча.", "सुरक्षित बनावट याद करें, रंग और पैटर्न मिलाएँ और रोशनी आने से पहले छिपें।", "ادرس النسيج الآمن وطابق اللون والنمط ثم اختبئ قبل مسح الضوء."],
      guide: ["Memorize each colored shape and habitat pattern. Later gardens shuffle positions or ask for two in forward/reverse order and three in sequence; enter every pair before the scan.", "記住每個彩色形狀與棲地圖樣；後續花園會洗牌位置，或要求正序／逆序輸入兩組及依序輸入三組，在掃描前完成全部配對。", "记住每个彩色形状与栖地图样；后续花园会洗牌位置，或要求正序／逆序输入两组及依序输入三组，在扫描前完成全部配对。", "色付き形と生息地模様を記憶。後半は位置が入れ替わり、2組の順／逆順や3組の連続入力になります。スキャン前に全組を再現します。", "색 도형과 서식지 무늬를 기억하세요. 뒤 정원은 위치가 섞이고 두 쌍의 정/역순 또는 세 쌍 순서를 요구합니다. 스캔 전에 모두 입력하세요.", "Memoriza cada forma de color y patrón. Más adelante se barajan posiciones o debes repetir dos pares en orden/inverso y tres en secuencia antes del escaneo.", "Memorize cada forma colorida e padrão. Depois as posições mudam ou você repete dois pares na ordem/inversa e três em sequência antes da varredura.", "Mémorise chaque forme colorée et motif. Ensuite, les positions changent ou il faut refaire deux paires à l’endroit/envers et trois en séquence avant le scan.", "Merke dir Farbform und Muster. Später wechseln Positionen oder zwei Paare vorwärts/rückwärts und drei nacheinander müssen vor dem Scan eingegeben werden.", "Memorizza forma colorata e motivo. Poi le posizioni cambiano o devi ripetere due coppie in ordine/inverso e tre in sequenza prima della scansione.", "Запоминайте цветную фигуру и узор. Далее позиции меняются, а две пары вводятся прямо/обратно и три — по порядку до сканирования.", "हर रंगीन आकार और आवास पैटर्न याद करें। आगे स्थान बदलते हैं या स्कैन से पहले दो जोड़ियाँ सीधे/उलटे और तीन क्रम में दोहरानी होती हैं।", "احفظ كل شكل ملوّن ونمط موطن. لاحقاً تتبدل المواقع أو تعيد زوجين بالترتيب أو العكس وثلاثة بالتسلسل قبل المسح."],
      colors: [
        ["Leaf green", "葉綠", "叶绿", "葉の緑", "잎 초록", "Verde hoja", "Verde folha", "Vert feuille", "Blattgrün", "Verde foglia", "Листовой зелёный", "पत्ती हरा", "أخضر ورقي"],
        ["Coral diamond", "珊瑚菱形", "珊瑚菱形", "コーラルのひし形", "산호 마름모", "Rombo coral", "Losango coral", "Losange corail", "Korallraute", "Rombo corallo", "Коралловый ромб", "मूंगा हीरा", "معيّن مرجاني"],
        ["Sky triangle", "天空三角", "天空三角", "空色の三角", "하늘 삼각형", "Triángulo celeste", "Triângulo celeste", "Triangle ciel", "Himmelsdreieck", "Triangolo cielo", "Небесный треугольник", "आसमानी त्रिकोण", "مثلث سماوي"],
      ],
      patterns: [
        ["Leaf pattern", "葉片圖樣", "叶片图样", "葉の模様", "잎 무늬", "Patrón de hojas", "Padrão de folhas", "Motif feuille", "Blattmuster", "Motivo foglia", "Узор листьев", "पत्ती पैटर्न", "نمط الأوراق"],
        ["Blossom pattern", "花朵圖樣", "花朵图样", "花の模様", "꽃 무늬", "Patrón floral", "Padrão floral", "Motif floral", "Blütenmuster", "Motivo floreale", "Цветочный узор", "फूल पैटर्न", "نمط الأزهار"],
        ["Water pattern", "水波圖樣", "水波图样", "水の模様", "물결 무늬", "Patrón de agua", "Padrão de água", "Motif aquatique", "Wassermuster", "Motivo acqua", "Узор воды", "पानी पैटर्न", "نمط الماء"],
      ],
      comparisonHeading: ["Similar gameplay reference:", "相似玩法參考：", "相似玩法参考：", "似た遊び方の参考：", "비슷한 플레이 참고:", "Referencia de jugabilidad similar:", "Referência de jogabilidade semelhante:", "Référence de gameplay similaire :", "Ähnliche Gameplay-Referenz:", "Riferimento di gameplay simile:", "Похожий игровой ориентир:", "मिलती-जुलती गेमप्ले संदर्भ:", "مرجع لعب مشابه:"],
      comparisonTagsLabel: ["Gameplay tags:", "玩法標籤：", "玩法标签：", "ゲームプレイタグ：", "게임플레이 태그:", "Etiquetas de jugabilidad:", "Tags de jogabilidade:", "Tags de gameplay :", "Gameplay-Tags:", "Tag di gameplay:", "Теги геймплея:", "गेमप्ले टैग:", "وسوم أسلوب اللعب:"],
      comparisonTags: [
        ["color-pattern memory", "色彩圖樣記憶", "色彩图样记忆", "色と模様の記憶", "색상·무늬 기억", "memoria de color y patrón", "memória de cores e padrões", "mémoire couleurs-motifs", "Farb- und Mustergedächtnis", "memoria di colori e motivi", "память на цвет и узор", "रंग-पैटर्न स्मृति", "ذاكرة اللون والنمط"],
        ["texture matching", "紋理配對", "纹理配对", "テクスチャ照合", "질감 맞추기", "emparejado de texturas", "combinação de texturas", "association de textures", "Texturzuordnung", "abbinamento texture", "сопоставление текстур", "टेक्सचर मिलान", "مطابقة الخامة"],
        ["sequence recall", "序列回想", "序列记忆", "順序記憶", "순서 기억", "recuerdo de secuencias", "memória de sequência", "mémoire de séquence", "Sequenzgedächtnis", "memoria di sequenza", "запоминание последовательностей", "क्रम याद करना", "تذكّر التسلسل"],
        ["timed puzzle", "限時益智", "限时益智", "時間制パズル", "시간제 퍼즐", "puzle contrarreloj", "quebra-cabeça cronometrado", "puzzle chronométré", "Zeitpuzzle", "rompicapo a tempo", "головоломка на время", "समयबद्ध पहेली", "لغز موقّت"]
      ],
      comparisonSummary: [
        "Hasbro describes Simon Game as watching random light sequences and repeating them on colored pads in order as sequences grow longer. {title} also tests observe–remember–repeat decisions, but pairs colors with habitat textures and uses a 30-stage campaign with shuffled positions, reverse recall, three-group sequences, and shorter scan windows.",
        "Hasbro 介紹 Simon Game：觀看隨機燈光序列，再依順序按彩色按鍵重現，序列會逐步加長。{title} 同樣考驗觀察、記憶與重現，但要把顏色和棲地紋理配成一組，並在 30 關戰役中面對位置洗牌、逆序回想、三組序列與更短掃描時間。",
        "Hasbro 介绍 Simon Game：观看随机灯光序列，再按顺序按彩色按键重现，序列会逐步变长。{title} 同样考验观察、记忆与重现，但要把颜色和栖地纹理配成一组，并在 30 关战役中面对位置洗牌、逆序记忆、三组序列与更短扫描时间。",
        "Hasbro は Simon Game を、ランダムな光の並びを見て色付きパッドで順番どおり再現し、徐々に長くなるゲームと説明しています。{title} も観察・記憶・再現を使いますが、色と生息地テクスチャを組で覚え、30ステージで位置変更、逆順、3組シーケンス、短い走査時間へ進みます。",
        "Hasbro는 Simon Game을 무작위 불빛 순서를 보고 색상 패드로 같은 순서대로 재현하며 점점 길어지는 게임으로 설명합니다. {title}도 관찰·기억·재현을 쓰지만 색상과 서식지 질감을 짝으로 기억하고 30개 스테이지에서 위치 섞기, 역순, 3그룹 순서, 짧은 스캔 시간을 다룹니다.",
        "Hasbro describe Simon Game como observar secuencias aleatorias de luces y repetirlas en los botones de color mientras se alargan. {title} también usa observar, recordar y repetir, pero empareja color con textura de hábitat y desarrolla 30 fases con posiciones mezcladas, orden inverso, secuencias de tres grupos y menos tiempo de escaneo.",
        "A Hasbro descreve Simon Game como observar sequências aleatórias de luzes e repeti-las nos botões coloridos enquanto ficam mais longas. {title} também usa observar, lembrar e repetir, mas combina cor com textura de habitat e avança por 30 fases com posições embaralhadas, ordem inversa, sequências de três grupos e menos tempo de varredura.",
        "Hasbro décrit Simon Game comme l’observation de séquences lumineuses aléatoires à reproduire sur des touches colorées alors qu’elles s’allongent. {title} repose aussi sur observer, mémoriser et reproduire, mais associe couleur et texture d’habitat dans 30 niveaux avec positions mélangées, ordre inversé, séquences de trois groupes et scans plus courts.",
        "Hasbro beschreibt Simon Game als zufällige Lichtfolgen, die auf farbigen Feldern in derselben Reihenfolge wiederholt werden und immer länger werden. {title} nutzt ebenfalls Beobachten, Merken und Wiederholen, kombiniert aber Farbe und Habitat-Textur in 30 Stufen mit gemischten Positionen, Rückwärtsfolgen, Dreiersequenzen und kürzeren Scans.",
        "Hasbro descrive Simon Game come sequenze casuali di luci da ripetere sui tasti colorati mentre diventano più lunghe. {title} usa anch’esso osservazione, memoria e ripetizione, ma abbina colore e texture dell’habitat in 30 livelli con posizioni mescolate, ordine inverso, sequenze di tre gruppi e scansioni più brevi.",
        "Hasbro описывает Simon Game как случайные световые последовательности, которые нужно повторять на цветных панелях в правильном порядке по мере их удлинения. {title} тоже использует наблюдение, память и повторение, но связывает цвет с текстурой среды в 30 этапах с перемешиванием позиций, обратным порядком, сериями из трёх групп и более коротким сканированием.",
        "Hasbro Simon Game को यादृच्छिक रोशनी के क्रम को देखकर रंगीन पैड पर सही क्रम में दोहराने वाला खेल बताता है, जिसमें क्रम लंबा होता जाता है। {title} भी देखो-याद रखो-दोहराओ पर आधारित है, लेकिन रंग को आवास की टेक्सचर से जोड़ता है और 30 चरणों में स्थान बदलना, उल्टा क्रम, तीन-समूह क्रम और कम स्कैन समय जोड़ता है।",
        "تصف Hasbro لعبة Simon Game بأنها تسلسلات ضوئية عشوائية تُعاد بالترتيب على الأزرار الملوّنة وتطول تدريجياً. تستخدم {title} أيضاً الملاحظة والتذكّر وإعادة التسلسل، لكنها تربط اللون بخامة الموطن عبر 30 مرحلة تضيف تبديل المواقع والترتيب العكسي وتسلسلات من ثلاث مجموعات ووقت مسح أقصر."
      ],
      comparisonIndependence: [
        "{title} is an independent WeightPlay game with no official affiliation, endorsement, or license from Simon Game or Hasbro.",
        "{title} 是 WeightPlay 的獨立遊戲，與 Simon Game 或 Hasbro 沒有官方隸屬、授權或推薦關係。",
        "{title} 是 WeightPlay 的独立游戏，与 Simon Game 或 Hasbro 没有官方隶属、授权或推荐关系。",
        "{title} は WeightPlay の独立作品で、Simon Game または Hasbro との公式な提携・推奨・ライセンス関係はありません。",
        "{title}은 WeightPlay의 독립 게임이며 Simon Game 또는 Hasbro와 공식 제휴·추천·라이선스 관계가 없습니다.",
        "{title} es un juego independiente de WeightPlay, sin afiliación, respaldo ni licencia oficial con Simon Game o Hasbro.",
        "{title} é um jogo independente da WeightPlay, sem afiliação, endosso ou licença oficial com Simon Game ou Hasbro.",
        "{title} est un jeu WeightPlay indépendant, sans affiliation, approbation ni licence officielle avec Simon Game ou Hasbro.",
        "{title} ist ein unabhängiges WeightPlay-Spiel ohne offizielle Verbindung, Empfehlung oder Lizenz von Simon Game oder Hasbro.",
        "{title} è un gioco indipendente di WeightPlay, senza affiliazione, approvazione o licenza ufficiale con Simon Game o Hasbro.",
        "{title} — независимая игра WeightPlay без официальной связи, одобрения или лицензии от Simon Game или Hasbro.",
        "{title} WeightPlay का स्वतंत्र खेल है और Simon Game या Hasbro से इसका कोई आधिकारिक संबंध, समर्थन या लाइसेंस नहीं है।",
        "{title} لعبة مستقلة من WeightPlay ولا تربطها علاقة رسمية أو اعتماد أو ترخيص مع Simon Game أو Hasbro."
      ],
      comparisonSource: ["Official Simon Game page", "Simon Game 官方頁面", "Simon Game 官方页面", "Simon Game 公式ページ", "Simon Game 공식 페이지", "Página oficial de Simon Game", "Página oficial de Simon Game", "Page officielle de Simon Game", "Offizielle Simon-Game-Seite", "Pagina ufficiale di Simon Game", "Официальная страница Simon Game", "Simon Game का आधिकारिक पेज", "الصفحة الرسمية لـ Simon Game"],
      stageNames: blendStageNames,
      arcNames: blendArcNames,
      checkpoint: ["Checkpoint", "檢查點", "检查点", "チェックポイント", "체크포인트", "Punto de control", "Ponto de controle", "Point de contrôle", "Kontrollpunkt", "Punto di controllo", "Контрольная точка", "चेकपॉइंट", "نقطة تفتيش"],
      finale: ["Finale", "終章", "终章", "フィナーレ", "피날레", "Final", "Finale", "Finale", "Finale", "Finale", "Финал", "अंतिम चरण", "النهائي"],
    },
    "animal-habitat-builder": {
      title: ["Habitat Builder", "棲地建造師", "栖地建造师", "ハビタット・ビルダー", "서식지 빌더", "Constructor de Hábitats", "Construtor de Habitats", "Bâtisseur d’Habitats", "Lebensraum-Baumeister", "Costruttore di Habitat", "Строитель среды", "हैबिटैट बिल्डर", "باني المواطن"],
      lede: ["Place water, shelter, meadow, and forest tiles so every visiting animal has what it needs.", "配置水源、庇護所、草地與森林，讓每隻造訪的動物都獲得所需環境。", "配置水源、庇护所、草地与森林，让每只造访的动物都获得所需环境。", "水・隠れ家・草地・森を配置し、訪れる動物の必要条件を満たそう。", "물, 쉼터, 초원, 숲 타일을 놓아 모든 동물의 필요를 채우세요.", "Coloca agua, refugio, pradera y bosque para cubrir las necesidades de cada animal.", "Coloque água, abrigo, campo e floresta para atender cada animal.", "Place eau, abri, prairie et forêt pour répondre aux besoins de chaque animal.", "Platziere Wasser, Schutz, Wiese und Wald für alle Tiere.", "Posiziona acqua, rifugio, prato e foresta per soddisfare ogni animale.", "Размещайте воду, укрытия, луга и лес, чтобы помочь всем животным.", "पानी, आश्रय, घास और जंगल टाइलें लगाएँ ताकि हर जानवर की जरूरत पूरी हो।", "ضع الماء والمأوى والمرج والغابة لتلبية احتياجات كل حيوان."],
      guide: ["Meet the quantities and visible ecology rules: connect water or forest chains, span water between edges, place edge forest, shelter beside forest, and meadow beside water. Crossed cells cannot be built on.", "滿足數量與可見生態規則：連接水域或森林、讓水域跨越兩側、在邊緣種森林、庇護所鄰接森林、草地鄰接水域；叉號格不可建造。", "满足数量与可见生态规则：连接水域或森林、让水域跨越两侧、在边缘种森林、庇护所邻接森林、草地邻接水域；叉号格不可建造。", "数量と生態ルールを満たします。水／森を連結、水を左右へ接続、端に森、森の隣に隠れ家、水の隣に草地。×マスは建設不可です。", "수량과 생태 규칙을 채우세요. 물/숲 연결, 양쪽 물길, 가장자리 숲, 숲 옆 쉼터, 물 옆 초원이 필요하며 X 칸에는 지을 수 없습니다.", "Cumple cantidades y reglas: conecta agua o bosque, lleva agua entre bordes, pon bosque en el borde, refugio junto al bosque y pradera junto al agua. No construyas en X.", "Cumpra quantidades e regras: conecte água ou floresta, atravesse água entre bordas, ponha floresta na borda, abrigo junto à floresta e campo junto à água. Não construa no X.", "Respecte quantités et règles : relie eau ou forêt, traverse d’un bord à l’autre, mets la forêt en bordure, l’abri près de la forêt et la prairie près de l’eau. Les cases X sont bloquées.", "Erfülle Mengen und Regeln: Wasser/Wald verbinden, Wasser zwischen Rändern spannen, Wald am Rand, Schutz neben Wald und Wiese neben Wasser. X-Felder sind gesperrt.", "Rispetta quantità e regole: collega acqua o foresta, unisci i bordi con l’acqua, metti foresta sul bordo, rifugio vicino alla foresta e prato vicino all’acqua. Le caselle X sono bloccate.", "Выполните нормы и правила: соединяйте воду/лес, ведите воду между краями, лес ставьте у края, укрытие — у леса, луг — у воды. Клетки X закрыты.", "मात्रा और नियम पूरे करें: पानी/जंगल जोड़ें, पानी से दोनों किनारे मिलाएँ, किनारे पर जंगल, जंगल के पास आश्रय और पानी के पास घास रखें। X खानों पर निर्माण नहीं होता।", "حقق الكميات والقواعد: صِل الماء أو الغابة، ومد الماء بين الحافتين، وضع الغابة عند الحافة والمأوى قرب الغابة والمرج قرب الماء. خانات X محظورة."],
      tiles: [
        ["Water", "水域", "水域", "水", "물", "Agua", "Água", "Eau", "Wasser", "Acqua", "Вода", "पानी", "ماء"],
        ["Meadow", "草地", "草地", "草地", "초원", "Pradera", "Campo", "Prairie", "Wiese", "Prato", "Луг", "घास", "مرج"],
        ["Forest", "森林", "森林", "森", "숲", "Bosque", "Floresta", "Forêt", "Wald", "Foresta", "Лес", "जंगल", "غابة"],
        ["Shelter", "庇護所", "庇护所", "隠れ家", "쉼터", "Refugio", "Abrigo", "Abri", "Schutz", "Rifugio", "Укрытие", "आश्रय", "مأوى"],
      ],
    },
  };
  const gameId = document.body?.dataset.wpMarketGame || "";
  const game = gameText[gameId] || gameText["animal-hoop-league"];
  const routeLocale = fromSegment[location.pathname.split("/").filter(Boolean)[0]];
  const saved = localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale") || "en";
  let locale = localeOrder.includes(routeLocale) ? routeLocale : (localeOrder.includes(saved) ? saved : "en");
  const at = (list) => list[localeOrder.indexOf(locale)] || list[0];
  const c = () => common[locale] || common.en;
  function apply() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    const title = window.WEIGHTPLAY_GAME_TITLES?.[gameId]?.[locale] || at(game.title);
    document.title = `${title} | WeightPlay`;
    document.querySelectorAll("[data-m5-title]").forEach((node) => { node.textContent = title; node.setAttribute("data-runtime-localize", "off"); });
    document.querySelectorAll("[data-m5-lede]").forEach((node) => { node.textContent = at(game.lede); });
    document.querySelectorAll("[data-m5-guide]").forEach((node) => { node.textContent = at(game.guide); });
    const map = { start: 1, stages: 2, backMain: 3, backStages: 4, retry: 5, next: 6, howTo: 7, choose: 12 };
    Object.entries(map).forEach(([key, index]) => document.querySelectorAll(`[data-m5-copy="${key}"]`).forEach((node) => { node.textContent = c()[index]; }));
    document.querySelectorAll("[data-m5-aria='backMain']").forEach((node) => node.setAttribute("aria-label", c()[3]));
    document.querySelectorAll("[data-m5-aria='backStages']").forEach((node) => node.setAttribute("aria-label", c()[4]));
    document.querySelectorAll("[data-m5-aria='battleUtility']").forEach((node) => node.setAttribute("aria-label", c()[22]));
    const select = document.getElementById("localeSelect"); if (select) select.value = locale;
    if (game.comparisonSummary) {
      const own = (value) => String(value || "").replaceAll("{title}", title);
      document.querySelectorAll("[data-wp-comparison-heading]").forEach((node) => { node.textContent = at(game.comparisonHeading); });
      document.querySelectorAll("[data-wp-tags-label]").forEach((node) => { node.textContent = at(game.comparisonTagsLabel); });
      const tags = game.comparisonTags.map(at);
      document.querySelectorAll("[data-wp-tag]").forEach((node) => { node.textContent = tags[Number(node.dataset.wpTag)] || ""; });
      document.querySelectorAll("[data-wp-comparison-summary]").forEach((node) => { node.textContent = own(at(game.comparisonSummary)); });
      document.querySelectorAll("[data-wp-comparison-independence]").forEach((node) => { node.textContent = own(at(game.comparisonIndependence)); });
      document.querySelectorAll("[data-wp-comparison-source]").forEach((node) => { node.textContent = at(game.comparisonSource); });
    }
    window.dispatchEvent(new CustomEvent("weightplay:market-locale-change", { detail: { locale } }));
  }
  function setLocale(next) {
    if (!localeOrder.includes(next)) return;
    locale = next; localStorage.setItem("weightPlayLocale", locale); localStorage.setItem("weightplayLocale", locale); apply();
  }
  window.WeightPlayMarketFiveLocale = Object.freeze({ locales: localeOrder, get locale() { return locale; }, setLocale, common: c, game: () => ({ title: at(game.title), lede: at(game.lede), guide: at(game.guide), canvas: at(game.canvas || game.title), incorrect: at(game.incorrect || game.guide), correct: at(game.correct || game.guide), checkpoint: at(game.checkpoint || ["Checkpoint"]), finale: at(game.finale || ["Finale"]), courts: game.courts?.map(at) || [], hoop: Object.fromEntries(Object.entries(game.hoop || {}).map(([key, value]) => [key, at(value)])), regions: game.regions?.map(at) || [], colors: game.colors?.map(at) || [], patterns: game.patterns?.map(at) || [], stageNames: game.stageNames?.map(at) || [], arcNames: game.arcNames?.map(at) || [], tiles: game.tiles?.map(at) || [] }) });
  window.WeightPlayFiveGameLocale = window.WeightPlayMarketFiveLocale;
  window.wpMarketCommon = (index) => c()[index];
  const begin = () => { const select = document.getElementById("localeSelect"); select?.addEventListener("change", (event) => setLocale(event.target.value)); apply(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", begin, { once: true }); else begin();
})();
