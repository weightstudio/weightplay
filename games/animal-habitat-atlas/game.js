/* Habitat Atlas: deterministic deduction and an accessible field notebook. */
(() => {
  "use strict";
  const locales = [
    "en",
    "zh-tw",
    "zh-cn",
    "ja",
    "ko",
    "es",
    "pt-br",
    "fr",
    "de",
    "it",
    "ru",
    "hi",
    "ar",
  ];
  const rows = {
    goal: [
      "Read both clues. Choose the matching habitat.",
      "讀兩條線索，選出同時符合的棲地。",
      "读两条线索，选出同时符合的栖地。",
      "2つの手がかりに合う生息地を選ぼう。",
      "두 단서에 모두 맞는 서식지를 고르세요.",
      "Lee ambas pistas y elige el hábitat correcto.",
      "Leia as duas pistas e escolha o habitat certo.",
      "Lis les deux indices et choisis le bon habitat.",
      "Lies beide Hinweise und wähle den Lebensraum.",
      "Leggi i due indizi e scegli l’habitat adatto.",
      "Прочтите обе подсказки и выберите среду.",
      "दोनों संकेत पढ़ें और सही आवास चुनें।",
      "اقرأ الدليلين واختر الموطن المطابق.",
    ],
    next: [
      "Next discovery →",
      "下一個發現 →",
      "下一个发现 →",
      "次の発見 →",
      "다음 발견 →",
      "Siguiente hallazgo →",
      "Próxima descoberta →",
      "Découverte suivante →",
      "Nächste Entdeckung →",
      "Prossima scoperta →",
      "Следующая находка →",
      "अगली खोज →",
      "الاكتشاف التالي ←",
    ],
    evidence: [
      "FIELD NOTES",
      "野外線索",
      "野外线索",
      "調査メモ",
      "현장 기록",
      "NOTAS DE CAMPO",
      "NOTAS DE CAMPO",
      "NOTES DE TERRAIN",
      "FELDNOTIZEN",
      "NOTE SUL CAMPO",
      "ПОЛЕВЫЕ ЗАМЕТКИ",
      "मैदानी नोट्स",
      "ملاحظات ميدانية",
    ],
    choose: [
      "Choose a habitat below",
      "點選下方一張棲地卡",
      "点选下方一张栖地卡",
      "下の生息地を選ぼう",
      "아래 서식지 카드를 고르세요",
      "Elige una tarjeta de hábitat",
      "Escolha um cartão de habitat",
      "Choisis une carte d’habitat",
      "Wähle eine Lebensraumkarte",
      "Scegli una carta habitat",
      "Выберите карточку среды",
      "नीचे आवास का कार्ड चुनें",
      "اختر بطاقة موطن أدناه",
    ],
    hint: [
      "Wildlife hint · −1 ★",
      "動物提示 · −1 ★",
      "动物提示 · −1 ★",
      "動物ヒント · −1 ★",
      "동물 힌트 · −1 ★",
      "Pista de fauna · −1 ★",
      "Dica de fauna · −1 ★",
      "Indice animal · −1 ★",
      "Tierhinweis · −1 ★",
      "Indizio animale · −1 ★",
      "Животное · −1 ★",
      "जीव संकेत · −1 ★",
      "دليل حيواني · −1 ★",
    ],
    correct: [
      "Habitat discovered!",
      "發現正確棲地！",
      "发现正确栖地！",
      "生息地を発見！",
      "서식지를 발견했어요!",
      "¡Hábitat descubierto!",
      "Habitat descoberto!",
      "Habitat découvert !",
      "Lebensraum entdeckt!",
      "Habitat scoperto!",
      "Среда найдена!",
      "आवास मिल गया!",
      "تم اكتشاف الموطن!",
    ],
    wrong: [
      "Compare again · −1 ★",
      "再比對一次 · −1 ★",
      "再比对一次 · −1 ★",
      "もう一度比べよう · −1 ★",
      "다시 비교하세요 · −1 ★",
      "Compara de nuevo · −1 ★",
      "Compare novamente · −1 ★",
      "Compare encore · −1 ★",
      "Vergleiche erneut · −1 ★",
      "Confronta ancora · −1 ★",
      "Сравните ещё раз · −1 ★",
      "फिर तुलना करें · −1 ★",
      "قارن مجدداً · −1 ★",
    ],
    match: [
      "Both clues match",
      "兩條線索都吻合",
      "两条线索都吻合",
      "両方の手がかりが一致",
      "두 단서 모두 일치",
      "Ambas pistas coinciden",
      "As duas pistas combinam",
      "Les deux indices correspondent",
      "Beide Hinweise passen",
      "Entrambi gli indizi coincidono",
      "Обе подсказки совпадают",
      "दोनों संकेत मेल खाते हैं",
      "كلا الدليلين متطابقان",
    ],
    retryCue: [
      "Compare notes with cards. A mistake stays on this case.",
      "線索和卡片文字比一比。答錯可再試，不會跳題。",
      "线索和卡片文字比一比。答错可再试，不会跳题。",
      "メモとカードを比較。間違えても同じ問題を続けられます。",
      "단서와 카드를 비교하세요. 틀려도 다시 시도해요.",
      "Compara notas y tarjetas. Un error no cambia el caso.",
      "Compare notas e cartões. Um erro não muda o caso.",
      "Compare notes et cartes. Une erreur ne change pas le cas.",
      "Vergleiche Notizen und Karten. Ein Fehler überspringt keinen Fall.",
      "Confronta note e carte. Un errore non cambia il caso.",
      "Сравните заметки и карточки. Ошибка не переключает задачу.",
      "नोट्स और कार्ड मिलाएँ। गलती पर यही सवाल रहता है।",
      "قارن الملاحظات بالبطاقات. الخطأ لا ينقل إلى حالة أخرى.",
    ],
    summary: [
      "Match two field clues to a habitat. Collect stars and unlock six expeditions.",
      "讀線索、選棲地，替動物找到家。收集星星，解鎖六場遠征。",
      "读线索、选栖地，替动物找到家。收集星星，解锁六场远征。",
      "2つの手がかりから生息地を発見。星を集めて6つの遠征へ。",
      "두 단서로 서식지를 찾으세요. 별을 모아 여섯 탐험을 여세요.",
      "Encuentra hábitats con dos pistas. Reúne estrellas y abre seis expediciones.",
      "Encontre habitats com duas pistas. Junte estrelas e abra seis expedições.",
      "Trouve les habitats avec deux indices. Gagne des étoiles pour six expéditions.",
      "Finde Lebensräume mit zwei Hinweisen. Sammle Sterne für sechs Expeditionen.",
      "Trova habitat con due indizi. Raccogli stelle per sei spedizioni.",
      "Найдите среду по двум подсказкам. Собирайте звёзды для шести экспедиций.",
      "दो संकेतों से आवास खोजें। तारे पाकर छह यात्राएँ खोलें।",
      "اكتشف المواطن بدليلين واجمع النجوم لفتح ست رحلات.",
    ],
    target: [
      "Goal",
      "過關目標",
      "过关目标",
      "目標",
      "목표",
      "Objetivo",
      "Meta",
      "Objectif",
      "Ziel",
      "Obiettivo",
      "Цель",
      "लक्ष्य",
      "الهدف",
    ],
    case: [
      "Case",
      "案例",
      "案例",
      "調査",
      "사례",
      "Caso",
      "Caso",
      "Cas",
      "Fall",
      "Caso",
      "Задача",
      "सवाल",
      "الحالة",
    ],
    saved: [
      "Saved on this device",
      "進度已保存在此裝置",
      "进度已保存在此设备",
      "この端末に保存済み",
      "이 기기에 저장됨",
      "Guardado en este dispositivo",
      "Salvo neste dispositivo",
      "Enregistré sur cet appareil",
      "Auf diesem Gerät gespeichert",
      "Salvato su questo dispositivo",
      "Сохранено на этом устройстве",
      "इस डिवाइस पर सुरक्षित",
      "محفوظ على هذا الجهاز",
    ],
    unsaved: [
      "This browser cannot save progress",
      "此瀏覽器目前無法儲存進度",
      "此浏览器当前无法保存进度",
      "このブラウザーでは保存できません",
      "이 브라우저에서는 저장할 수 없어요",
      "Este navegador no puede guardar",
      "Este navegador não pode salvar",
      "Ce navigateur ne peut pas enregistrer",
      "Dieser Browser kann nicht speichern",
      "Questo browser non può salvare",
      "Браузер не может сохранить прогресс",
      "यह ब्राउज़र सुरक्षित नहीं कर सकता",
      "لا يمكن لهذا المتصفح حفظ التقدم",
    ],
    finish: [
      "View expedition results",
      "查看遠征成果",
      "查看远征成果",
      "遠征の結果へ",
      "탐험 결과 보기",
      "Ver resultados",
      "Ver resultados",
      "Voir les résultats",
      "Ergebnis ansehen",
      "Vedi i risultati",
      "Итоги экспедиции",
      "यात्रा के नतीजे",
      "عرض نتائج الرحلة",
    ],
  };
  rows.rules = [
    "Two clues are free. A correct choice earns 3 stars; a wildlife hint or each different wrong choice costs 1 star, down to 1. Wrong choices stay on the same case. Continue when you are ready; there is no timer.",
    "每題免費顯示兩條線索，答對可得 3 星。使用動物提示或每選錯一種棲地，少得 1 星，最低 1 星。答錯留在原題；答對看完解釋後再繼續，沒有倒數限制。",
    "每题免费显示两条线索，答对可得 3 星。使用动物提示或每选错一种栖地，少得 1 星，最低 1 星。答错留在原题；看完解释再继续，没有倒计时。",
    "2つの手がかりは無料。正解は3つ星。動物ヒントや異なる誤答ごとに1つ減り、最低1つ。間違えても同じ問題です。制限時間はなく、自分で次へ進めます。",
    "두 단서는 무료입니다. 정답은 별 3개이며 동물 힌트나 서로 다른 오답마다 1개씩 줄어 최소 1개입니다. 틀려도 같은 문제를 계속합니다. 시간제한은 없습니다.",
    "Dos pistas son gratis. Aciertas: 3 estrellas. Una pista de fauna o cada error distinto resta 1, con mínimo de 1. El error no cambia el caso. Continúa cuando quieras, sin reloj.",
    "Duas pistas são grátis. Acerto: 3 estrelas. Dica de fauna ou cada erro diferente tira 1, até o mínimo de 1. O erro mantém o caso. Continue quando quiser, sem cronômetro.",
    "Deux indices sont gratuits. Une bonne réponse vaut 3 étoiles. Un indice animal ou chaque erreur différente retire 1 étoile, minimum 1. Le cas reste le même. Continue à ton rythme, sans chrono.",
    "Zwei Hinweise sind kostenlos. Richtig: 3 Sterne. Tierhinweis oder jede andere falsche Wahl kostet 1, mindestens bleibt 1. Fehler überspringen keinen Fall. Ohne Zeitdruck weitergehen.",
    "Due indizi sono gratuiti. Risposta giusta: 3 stelle. Un indizio animale o ogni errore diverso costa 1, fino a un minimo di 1. Il caso resta lo stesso. Continua senza timer.",
    "Две подсказки бесплатны. Верный ответ даёт 3 звезды. Подсказка о животном или каждый новый неверный выбор отнимает 1, минимум остаётся 1. Ошибка не меняет задачу. Таймера нет.",
    "दो संकेत मुफ्त हैं। सही उत्तर पर 3 तारे। जीव संकेत या हर अलग गलत चुनाव पर 1 तारा कम, न्यूनतम 1। गलती पर सवाल नहीं बदलता। कोई समय सीमा नहीं।",
    "دليلان مجانيان. الإجابة الصحيحة تمنح 3 نجوم. الدليل الحيواني أو كل اختيار خاطئ مختلف ينقص نجمة، بحد أدنى نجمة واحدة. تبقى الحالة نفسها بعد الخطأ. لا يوجد مؤقت.",
  ];
  rows.progress = [
    "Six expeditions contain 5–8 cases. Reach the displayed star goal to unlock the next. Best completed expedition and best star scores are saved only in this browser. Clearing browser data removes this progress.",
    "六場遠征各有 5–8 個案例。累積星星達到畫面目標就能解鎖下一場；最佳關卡與星數只保存在此瀏覽器，清除網站資料會移除進度。",
    "六场远征各有 5–8 个案例。星星达到画面目标就能解锁下一场；最佳关卡与星数仅保存在此浏览器，清除网站数据会移除进度。",
    "6つの遠征は各5〜8問。表示された星の目標で次を解放。クリアした遠征と最高星数はこのブラウザーだけに保存され、サイトデータ削除で消えます。",
    "여섯 탐험은 각각 5~8문제입니다. 표시된 별 목표를 달성하면 다음 탐험이 열립니다. 최고 기록은 이 브라우저에만 저장되며 사이트 데이터 삭제 시 사라집니다.",
    "Seis expediciones de 5–8 casos. Alcanza la meta de estrellas para abrir la siguiente. Récords guardados solo en este navegador; borrar datos del sitio los elimina.",
    "Seis expedições de 5–8 casos. Atinja a meta de estrelas para abrir a próxima. Recordes apenas neste navegador; limpar os dados do site os remove.",
    "Six expéditions de 5 à 8 cas. Atteins l’objectif d’étoiles pour ouvrir la suivante. Records enregistrés seulement ici ; effacer les données du site les supprime.",
    "Sechs Expeditionen mit je 5–8 Fällen. Erreiche das Sternziel für die nächste. Bestwerte nur in diesem Browser; das Löschen der Websitedaten entfernt sie.",
    "Sei spedizioni con 5–8 casi. Raggiungi l’obiettivo di stelle per aprire la prossima. Record solo in questo browser; cancellare i dati del sito li elimina.",
    "Шесть экспедиций по 5–8 задач. Наберите указанное число звёзд для следующей. Рекорды только в этом браузере; очистка данных сайта удалит их.",
    "छह यात्राओं में 5–8 सवाल हैं। दिखाया तारा लक्ष्य पाकर अगली यात्रा खोलें। रिकॉर्ड केवल इस ब्राउज़र में हैं; साइट डेटा हटाने पर मिटते हैं।",
    "ست رحلات تضم 5–8 حالات. حقق هدف النجوم لفتح التالية. تُحفظ الأرقام في هذا المتصفح فقط وتحذف عند مسح بيانات الموقع.",
  ];
  const traitRows = [
    [
      "Salt water",
      "鹹水海域",
      "咸水海域",
      "塩水",
      "바닷물",
      "Agua salada",
      "Água salgada",
      "Eau salée",
      "Salzwasser",
      "Acqua salata",
      "Солёная вода",
      "खारा पानी",
      "مياه مالحة",
    ],
    [
      "Waves & currents",
      "海浪與洋流",
      "海浪与洋流",
      "波と海流",
      "파도와 해류",
      "Olas y corrientes",
      "Ondas e correntes",
      "Vagues et courants",
      "Wellen und Strömungen",
      "Onde e correnti",
      "Волны и течения",
      "लहरें और धाराएँ",
      "أمواج وتيارات",
    ],
    [
      "Sea ice",
      "海冰覆蓋",
      "海冰覆盖",
      "海氷",
      "해빙",
      "Hielo marino",
      "Gelo marinho",
      "Banquise",
      "Meereis",
      "Ghiaccio marino",
      "Морской лёд",
      "समुद्री बर्फ",
      "جليد بحري",
    ],
    [
      "Freezing winds",
      "冰冷強風",
      "冰冷强风",
      "凍てつく風",
      "차가운 바람",
      "Vientos helados",
      "Ventos gelados",
      "Vents glacés",
      "Eisige Winde",
      "Venti gelidi",
      "Ледяные ветры",
      "बर्फीली हवाएँ",
      "رياح متجمدة",
    ],
    [
      "Very little rain",
      "雨量稀少",
      "雨量稀少",
      "雨が少ない",
      "매우 적은 비",
      "Muy poca lluvia",
      "Pouca chuva",
      "Très peu de pluie",
      "Sehr wenig Regen",
      "Poca pioggia",
      "Мало дождей",
      "बहुत कम वर्षा",
      "أمطار نادرة",
    ],
    [
      "Sand & rock",
      "沙地與岩石",
      "沙地与岩石",
      "砂と岩",
      "모래와 바위",
      "Arena y roca",
      "Areia e rocha",
      "Sable et roche",
      "Sand und Fels",
      "Sabbia e roccia",
      "Песок и камни",
      "रेत और चट्टानें",
      "رمال وصخور",
    ],
    [
      "Dense tree canopy",
      "茂密樹冠",
      "茂密树冠",
      "密集した樹冠",
      "빽빽한 나무 덮개",
      "Copa de árboles densa",
      "Copas densas",
      "Canopée dense",
      "Dichtes Blätterdach",
      "Chioma fitta",
      "Густые кроны",
      "घने पेड़ों की छत",
      "مظلة شجرية كثيفة",
    ],
    [
      "Shaded undergrowth",
      "陰涼林下",
      "阴凉林下",
      "日陰の下草",
      "그늘진 덤불",
      "Sotobosque sombreado",
      "Vegetação sombreada",
      "Sous-bois ombragé",
      "Schattiges Unterholz",
      "Sottobosco ombroso",
      "Тенистый подлесок",
      "छायादार झाड़ियाँ",
      "شجيرات مظللة",
    ],
  ];
  const inferenceRows = [
    [
      "Water tastes salty",
      "水帶有鹹味",
      "水带有咸味",
      "水が塩辛い",
      "짠맛이 나는 물",
      "El agua es salada",
      "A água é salgada",
      "L’eau est salée",
      "Das Wasser ist salzig",
      "L’acqua è salata",
      "Вода солёная",
      "पानी खारा है",
      "الماء مالح",
    ],
    [
      "Fish ride the currents",
      "魚群隨洋流移動",
      "鱼群随洋流移动",
      "魚が海流に乗る",
      "해류를 타는 물고기",
      "Peces en las corrientes",
      "Peixes nas correntes",
      "Poissons dans les courants",
      "Fische in der Strömung",
      "Pesci nelle correnti",
      "Рыбы плывут по течению",
      "धाराओं में मछलियाँ",
      "أسماك مع التيارات",
    ],
    [
      "Ice floats on the sea",
      "海面漂浮著冰塊",
      "海面漂浮着冰块",
      "海に氷が浮く",
      "바다에 떠 있는 얼음",
      "Hielo flotando en el mar",
      "Gelo flutuando no mar",
      "Glace flottant sur la mer",
      "Eis treibt auf dem Meer",
      "Ghiaccio sul mare",
      "Лёд плавает в море",
      "समुद्र में तैरती बर्फ",
      "جليد يطفو في البحر",
    ],
    [
      "A polar bear hunts seals",
      "北極熊在尋找海豹",
      "北极熊在寻找海豹",
      "ホッキョクグマがアザラシを探す",
      "물범을 찾는 북극곰",
      "Un oso polar busca focas",
      "Urso polar procura focas",
      "Un ours polaire cherche des phoques",
      "Ein Eisbär jagt Robben",
      "Un orso polare cerca foche",
      "Белый медведь ищет тюленей",
      "सील खोजता ध्रुवीय भालू",
      "دب قطبي يصطاد الفقمة",
    ],
    [
      "Rain may not come for months",
      "數個月可能都不下雨",
      "数个月可能都不下雨",
      "何か月も雨が降らない",
      "몇 달 동안 비가 안 와요",
      "Meses sin lluvia",
      "Meses sem chuva",
      "Des mois sans pluie",
      "Monatelang kein Regen",
      "Mesi senza pioggia",
      "Месяцы без дождя",
      "महीनों तक बारिश नहीं",
      "أشهر دون مطر",
    ],
    [
      "Dunes stretch to the horizon",
      "沙丘一路延伸到天邊",
      "沙丘一路延伸到天边",
      "砂丘が地平線まで続く",
      "지평선까지 이어진 모래 언덕",
      "Dunas hasta el horizonte",
      "Dunas até o horizonte",
      "Dunes jusqu’à l’horizon",
      "Dünen bis zum Horizont",
      "Dune fino all’orizzonte",
      "Дюны до горизонта",
      "क्षितिज तक रेत के टीले",
      "كثبان حتى الأفق",
    ],
    [
      "Branches block the sunlight",
      "樹枝擋住大部分陽光",
      "树枝挡住大部分阳光",
      "枝が日光を遮る",
      "햇빛을 가리는 나뭇가지",
      "Las ramas tapan el sol",
      "Galhos bloqueiam o sol",
      "Les branches cachent le soleil",
      "Äste verdecken die Sonne",
      "I rami coprono il sole",
      "Ветви закрывают солнце",
      "धूप रोकती शाखाएँ",
      "أغصان تحجب الشمس",
    ],
    [
      "Ferns grow beneath the trees",
      "蕨類生長在大樹底下",
      "蕨类生长在大树底下",
      "木の下にシダが育つ",
      "나무 아래 자라는 양치식물",
      "Helechos bajo los árboles",
      "Samambaias sob as árvores",
      "Fougères sous les arbres",
      "Farne unter den Bäumen",
      "Felci sotto gli alberi",
      "Папоротники под деревьями",
      "पेड़ों के नीचे फर्न",
      "سرخس تحت الأشجار",
    ],
  ];
  const faunaRows = [
    [
      "Dolphin",
      "海豚",
      "海豚",
      "イルカ",
      "돌고래",
      "Delfín",
      "Golfinho",
      "Dauphin",
      "Delfin",
      "Delfino",
      "Дельфин",
      "डॉल्फ़िन",
      "دلفين",
    ],
    [
      "Polar bear",
      "北極熊",
      "北极熊",
      "ホッキョクグマ",
      "북극곰",
      "Oso polar",
      "Urso polar",
      "Ours polaire",
      "Eisbär",
      "Orso polare",
      "Белый медведь",
      "ध्रुवीय भालू",
      "دب قطبي",
    ],
    [
      "Camel",
      "駱駝",
      "骆驼",
      "ラクダ",
      "낙타",
      "Camello",
      "Camelo",
      "Chameau",
      "Kamel",
      "Cammello",
      "Верблюд",
      "ऊँट",
      "جمل",
    ],
    [
      "Toucan",
      "巨嘴鳥",
      "巨嘴鸟",
      "オオハシ",
      "큰부리새",
      "Tucán",
      "Tucano",
      "Toucan",
      "Tukan",
      "Tucano",
      "Тукан",
      "टूकन",
      "طوقان",
    ],
  ];
  const chapterRows = [
    [
      "First field notes",
      "初次野外調查",
      "初次野外调查",
      "初めての調査",
      "첫 현장 조사",
      "Primeras notas",
      "Primeiras notas",
      "Premières notes",
      "Erste Feldnotizen",
      "Prime note",
      "Первые заметки",
      "पहले नोट्स",
      "الملاحظات الأولى",
    ],
    [
      "Read the landscape",
      "讀懂地景",
      "读懂地景",
      "地形を読む",
      "지형 읽기",
      "Lee el paisaje",
      "Leia a paisagem",
      "Lire le paysage",
      "Landschaft lesen",
      "Leggi il paesaggio",
      "Читайте ландшафт",
      "भूदृश्य पढ़ें",
      "اقرأ المشهد",
    ],
    [
      "Follow the tracks",
      "追尋足跡",
      "追寻足迹",
      "足跡をたどる",
      "흔적 따라가기",
      "Sigue las huellas",
      "Siga os rastros",
      "Suivre les traces",
      "Spuren folgen",
      "Segui le tracce",
      "По следам",
      "पगचिह्न खोजें",
      "اتبع الآثار",
    ],
    [
      "Changing perspectives",
      "換個角度觀察",
      "换个角度观察",
      "視点を変えて",
      "다른 관점",
      "Otra perspectiva",
      "Outra perspectiva",
      "Autre perspective",
      "Neue Blickwinkel",
      "Nuove prospettive",
      "Новый взгляд",
      "नया नज़रिया",
      "زوايا جديدة",
    ],
    [
      "Wildlife survey",
      "動物棲地調查",
      "动物栖地调查",
      "野生動物調査",
      "야생동물 조사",
      "Estudio de fauna",
      "Pesquisa da fauna",
      "Inventaire animal",
      "Wildtiererhebung",
      "Indagine faunistica",
      "Исследование фауны",
      "जीव सर्वेक्षण",
      "مسح الحياة البرية",
    ],
    [
      "Master naturalist",
      "自然觀察家",
      "自然观察家",
      "自然観察の達人",
      "자연 관찰 전문가",
      "Naturalista experto",
      "Naturalista mestre",
      "Naturaliste expert",
      "Naturforscher",
      "Maestro naturalista",
      "Мастер-натуралист",
      "माहिर प्रकृतिविद्",
      "عالم الطبيعة",
    ],
  ];
  const copy = Object.fromEntries(
    locales.map((locale, i) => [
      locale,
      Object.fromEntries(
        Object.entries(rows).map(([key, values]) => [key, values[i]]),
      ),
    ]),
  );
  const habitats = ["ocean", "arctic", "desert", "forest"].map((id, i) =>
    Object.freeze({ id, index: i, traits: Object.freeze([i * 2, i * 2 + 1]) }),
  );
  const targets = [
    [0, 1, 2, 3, 0],
    [1, 3, 0, 2, 1],
    [2, 0, 3, 1, 2, 0],
    [3, 2, 1, 0, 2, 3],
    [0, 2, 3, 1, 3, 0, 2],
    [1, 0, 3, 2, 0, 2, 1, 3],
  ];
  const expeditions = targets.map((list, stage) =>
    Object.freeze({
      id: stage + 1,
      pass: [8, 9, 10, 11, 12, 14][stage],
      cases: Object.freeze(
        list.map((answer, i) =>
          Object.freeze({
            answer: habitats[answer].id,
            clues: Object.freeze(
              stage === 0
                ? [answer * 2, answer * 2 + 1]
                : stage === 1
                  ? [answer * 2 + 8, answer * 2 + 1]
                  : stage === 2
                    ? [answer * 2 + 8, answer * 2 + 9]
                    : stage === 3
                      ? [answer * 2 + 9, answer * 2]
                      : stage === 4
                        ? [16 + answer, answer * 2 + 8]
                        : [answer * 2 + 9, answer * 2 + 8],
            ),
            wildlife: answer,
            id: `${stage + 1}-${i + 1}`,
          }),
        ),
      ),
    }),
  );
  globalThis.HabitatAtlasRules = Object.freeze({
    habitats: Object.freeze(habitats),
    expeditions: Object.freeze(expeditions),
    copy,
    judge: (entry, pick) =>
      Boolean(
        entry && habitats.some((h) => h.id === pick) && entry.answer === pick,
      ),
  });
  // Original rescue strategy: six existing expedition IDs; no chapter expansion.
  const rescuePlans = [
    {
      animals: [1, 5, 7],
      caches: [6, 11],
      rough: [],
      wet: [2, 6],
      turns: 13,
      goal: 4,
      storm: 0,
    },
    {
      animals: [0, 4, 7],
      caches: [6, 3],
      rough: [0, 4],
      wet: [1, 5, 9],
      turns: 15,
      goal: 5,
      storm: 5,
    },
    {
      animals: [1, 3, 8],
      caches: [6, 2],
      rough: [1, 3, 8],
      wet: [4, 9],
      turns: 16,
      goal: 5,
      storm: 4,
    },
    {
      animals: [0, 3, 5, 8],
      caches: [6, 2],
      rough: [3, 7],
      wet: [1, 5, 9],
      turns: 18,
      goal: 6,
      storm: 5,
    },
    {
      animals: [0, 2, 4, 7],
      caches: [11, 1],
      rough: [2, 4, 6],
      wet: [3, 7, 11],
      turns: 18,
      goal: 6,
      storm: 5,
    },
    {
      animals: [0, 3, 4, 7],
      caches: [9, 2],
      rough: [0, 3, 4, 6],
      wet: [1, 5, 9],
      turns: 19,
      goal: 7,
      storm: 6,
    },
  ];
  function rescueCreate(stage) {
    if (!Number.isInteger(stage) || stage < 1 || stage > 6)
      throw new RangeError("expedition");
    const p = rescuePlans[stage - 1];
    return {
      stage,
      turn: 0,
      kits: 3,
      saved: 0,
      welfare: 0,
      ended: false,
      cells: Array.from({ length: 12 }, (_, id) => ({
        id,
        restored: id === 10,
        animal: p.animals.includes(id),
        rescued: false,
        shelter: false,
        health: 2,
        cache: p.caches.includes(id),
        rough: p.rough.includes(id),
        wet: p.wet.includes(id),
      })),
    };
  }
  const neighbours = (id) =>
    [
      id - 4,
      id + 4,
      ...(id % 4 ? [id - 1] : []),
      ...(id % 4 < 3 ? [id + 1] : []),
    ].filter((i) => i >= 0 && i < 12);
  const accessible = (s, id) =>
    !!s.cells[id] &&
    (id === 10 ||
      s.cells[id].restored ||
      neighbours(id).some((i) => s.cells[i].restored));
  const eco = (s) => s.cells.filter((c) => c.id !== 10 && c.restored).length;
  const rescueCost = (s, id) =>
    s.cells[id]?.rough &&
    !neighbours(id).some((i) => s.cells[i].restored && s.cells[i].wet)
      ? 2
      : 1;
  function rescueAction(s, action, id) {
    if (s.ended) return { state: s, error: "done" };
    const c = s.cells[id],
      p = rescuePlans[s.stage - 1];
    let cost = 0,
      error = null;
    if (action === "supply") {
      if (s.kits >= 9) error = "full";
    } else if (!c || !accessible(s, id)) error = "needRoute";
    else if (action === "restore") {
      cost = rescueCost(s, id);
      if (c.restored) error = "done";
    } else if (action === "rescue") {
      cost = c.restored ? 1 : 2;
      if (!c.animal || c.rescued) error = "done";
    } else if (action === "shelter") {
      cost = 1;
      if (!c.animal || c.rescued || c.shelter || c.restored) error = "done";
    } else error = "invalid";
    if (!error && s.kits < cost) error = "noKits";
    if (error) return { state: s, error };
    const n = JSON.parse(JSON.stringify(s)),
      tile = n.cells[id];
    n.kits -= cost;
    n.turn++;
    if (action === "supply") n.kits = Math.min(9, n.kits + 3);
    if (action === "restore") {
      tile.restored = true;
      if (tile.cache) {
        n.kits = Math.min(9, n.kits + 3);
        tile.cache = false;
      }
    }
    if (action === "rescue") {
      tile.rescued = true;
      n.saved++;
      n.welfare += Number(tile.restored && tile.health > 0);
    }
    if (action === "shelter") tile.shelter = true;
    const storm = Boolean(p.storm && n.turn % p.storm === 0);
    if (storm)
      n.cells.forEach((c) => {
        if (c.animal && !c.rescued && !c.restored && !c.shelter)
          c.health = Math.max(0, c.health - 1);
      });
    const win = n.saved === p.animals.length && eco(n) >= p.goal;
    n.ended = win || n.turn >= p.turns;
    return { state: n, error: null, storm, win, action };
  }
  const rescueStars = (s) =>
    s.saved === rescuePlans[s.stage - 1].animals.length &&
    eco(s) >= rescuePlans[s.stage - 1].goal
      ? 2 +
        Number(
          s.welfare === s.saved && rescuePlans[s.stage - 1].turns - s.turn >= 2,
        )
      : 0;
  globalThis.HabitatRescueRules = Object.freeze({
    plans: rescuePlans,
    create: rescueCreate,
    act: rescueAction,
    accessible,
    cost: rescueCost,
    eco,
    stars: rescueStars,
  });
  if (typeof document === "undefined") return;
  const assetBase = new URL(".", document.currentScript.src);
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL(
    "interface-9-game.css?v=20261021-habitat-v12-i9",
    assetBase,
  ).href;
  document.head.append(stylesheet);
  const compat = document.createElement("script");
  compat.src = new URL(
    "interface-9-compat.js?v=20261021-habitat-v12-i9",
    assetBase,
  ).href;
  compat.onload = boot;
  compat.onerror = () => {
    document.getElementById("loadingPanel").textContent =
      "Unable to load. Please reload.";
  };
  document.head.append(compat);
  function boot() {
    const $ = (id) => document.getElementById(id),
      R = globalThis.HabitatRescueRules;
    const lang = () =>
      ({ "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", "pt-BR": "pt-br" })[
        window.WeightPlayMarketFiveLocale?.locale ||
          document.documentElement.lang
      ] ||
      window.WeightPlayMarketFiveLocale?.locale ||
      document.documentElement.lang ||
      "en";
    const labels = {
      en: "Restore|Rescue|Shelter|Supplies|Undo|Evacuate|Actions|Saved|Restored|Storm in|Base|Exposed|Protected|Connect a restored neighbour first.|Not enough supplies.|Completed|Otter,Fox,Turtle,Owl|Restore C2 to collect supplies and open rescue routes.|Habitat restored. New route open.|Wildlife is safe.|Supplies +3.|Shelter built.|Storm: exposed wildlife loses 1 health.|Rescue incomplete|The valley lives again|Choose a tile, then an action.|Calm weather",
      "zh-tw":
        "復育|救援|庇護所|補給|撤銷|撤離結算|剩餘行動|已救援|已復育|風暴倒數|營地|暴露中|已保護|先復育相鄰地塊，連通救援路線。|補給不足，先按補給。|已完成|水獺,狐狸,陸龜,貓頭鷹|先復育 C2 補給箱，取得補給並打開救援路線。|棲地恢復了，新的救援路線已連通。|動物平安回家了。|補給送達：+3。|庇護所完成，動物受到保護。|風暴來襲：未保護動物失去 1 體力。|救援尚未完成|這片土地，再次有了生命|點選地塊，再選擇行動。|天氣穩定",
      "zh-cn":
        "复育|救援|庇护所|补给|撤销|撤离结算|剩余行动|已救援|已复育|风暴倒数|营地|暴露中|已保护|先复育相邻地块，连通救援路线。|补给不足，先按补给。|已完成|水獭,狐狸,陆龟,猫头鹰|先复育 C2 补给箱，取得补给并打开救援路线。|栖地恢复，新路线已连通。|动物平安回家。|补给送达：+3。|庇护所完成。|风暴：未保护动物失去 1 体力。|救援尚未完成|这片土地，再次有了生命|点选地块，再选择行动。|天气稳定",
      ja: "再生|救助|避難所|物資|戻す|撤収|残り行動|救助|再生|嵐まで|基地|危険|保護|隣のマスを再生して道をつなごう。|物資不足。補給しよう。|完了|カワウソ,キツネ,カメ,フクロウ|まず C2 の補給箱を再生しよう。|生息地と道が復活！|動物を救助！|物資 +3。|避難所が完成。|嵐：保護されていない動物の体力−1。|救助未完了|谷に命が戻った|マスを選び、行動を選ぼう。|穏やかな天気",
      ko: "복원|구조|보호소|보급품|되돌리기|철수|남은 행동|구조|복원|폭풍까지|기지|노출|보호|인접 타일을 먼저 복원하세요.|보급품 부족. 보급하세요.|완료|수달,여우,거북,부엉이|먼저 C2 보급 상자를 복원하세요.|서식지와 길 복원!|구조 성공!|보급품 +3.|보호소 완성.|폭풍: 노출 동물 체력−1.|구조 미완료|계곡에 돌아온 생명|타일을 고르고 행동하세요.|맑음",
      es: "Restaurar|Rescatar|Refugio|Suministros|Deshacer|Evacuar|Acciones|Rescatados|Restauradas|Tormenta en|Base|Expuesto|Protegido|Restaura una casilla vecina primero.|Faltan suministros.|Completado|Nutria,Zorro,Tortuga,Búho|Restaura la caja C2 para abrir rutas.|Hábitat y ruta restaurados.|Animal a salvo.|Suministros +3.|Refugio listo.|Tormenta: fauna expuesta pierde 1 salud.|Rescate incompleto|El valle vuelve a vivir|Elige casilla y acción.|Tiempo tranquilo",
      "pt-br":
        "Restaurar|Resgatar|Abrigo|Suprimentos|Desfazer|Evacuar|Ações|Resgatados|Restaurados|Tempestade em|Base|Exposto|Protegido|Restaure um terreno vizinho primeiro.|Faltam suprimentos.|Concluído|Lontra,Raposa,Tartaruga,Coruja|Restaure a caixa C2 para abrir rotas.|Habitat e rota restaurados.|Animal a salvo.|Suprimentos +3.|Abrigo pronto.|Tempestade: animais expostos perdem 1 saúde.|Resgate incompleto|O vale vive de novo|Escolha terreno e ação.|Tempo calmo",
      fr: "Restaurer|Sauver|Abri|Provisions|Annuler|Évacuer|Actions|Sauvés|Restaurées|Orage dans|Camp|Exposé|Protégé|Restaure d’abord une case voisine.|Provisions insuffisantes.|Terminé|Loutre,Renard,Tortue,Hibou|Restaure la caisse C2 pour ouvrir les routes.|Habitat et route restaurés.|Animal en sécurité.|Provisions +3.|Abri construit.|Orage : les animaux exposés perdent 1 santé.|Sauvetage incomplet|La vallée revit|Choisis une case et une action.|Temps calme",
      de: "Renaturieren|Retten|Schutz|Vorräte|Zurück|Evakuieren|Aktionen|Gerettet|Erneuert|Sturm in|Basis|Ungeschützt|Geschützt|Erneuere zuerst ein Nachbarfeld.|Zu wenig Vorräte.|Erledigt|Otter,Fuchs,Schildkröte,Eule|Erneuere Kiste C2 für neue Wege.|Lebensraum und Weg erneuert.|Tier in Sicherheit.|Vorräte +3.|Schutz errichtet.|Sturm: ungeschützte Tiere verlieren 1 Gesundheit.|Rettung unvollständig|Das Tal lebt wieder|Feld und Aktion wählen.|Ruhiges Wetter",
      it: "Ripristina|Salva|Riparo|Scorte|Annulla|Evacua|Azioni|Salvati|Ripristinate|Tempesta tra|Campo|Esposto|Protetto|Ripristina prima una casella vicina.|Scorte insufficienti.|Completato|Lontra,Volpe,Tartaruga,Gufo|Ripristina la cassa C2 per aprire sentieri.|Habitat e sentiero ripristinati.|Animale al sicuro.|Scorte +3.|Riparo costruito.|Tempesta: animali esposti perdono 1 salute.|Salvataggio incompleto|La valle torna a vivere|Scegli casella e azione.|Tempo calmo",
      ru: "Восстановить|Спасти|Укрытие|Припасы|Отменить|Эвакуация|Ходы|Спасено|Восстановлено|Буря через|Лагерь|Без защиты|Защищено|Сначала восстанови соседнюю клетку.|Мало припасов.|Готово|Выдра,Лиса,Черепаха,Сова|Начни с ящика C2, чтобы открыть пути.|Среда и путь восстановлены.|Животное в безопасности.|Припасы +3.|Укрытие готово.|Буря: незащищённые животные теряют 1 здоровье.|Спасение не завершено|Долина снова жива|Выбери клетку и действие.|Тихая погода",
      hi: "बहाली|बचाव|आश्रय|सामग्री|वापस|निकासी|शेष चाल|बचाए|बहाल|तूफान|शिविर|असुरक्षित|सुरक्षित|पहले पास का खाना बहाल करें।|सामग्री कम है।|पूरा|ऊदबिलाव,लोमड़ी,कछुआ,उल्लू|पहले C2 की पेटी बहाल करें।|आवास और रास्ता बहाल।|जीव सुरक्षित।|सामग्री +3।|आश्रय तैयार।|तूफान: असुरक्षित जीवों का स्वास्थ्य−1।|बचाव अधूरा|घाटी में जीवन लौटा|खाना और कार्य चुनें।|शांत मौसम",
      ar: "ترميم|إنقاذ|مأوى|المؤن|تراجع|إخلاء|الإجراءات|تم إنقاذ|تم ترميم|العاصفة بعد|المخيم|مكشوف|محمي|رمم مربعاً مجاوراً أولاً.|المؤن غير كافية.|مكتمل|قضاعة,ثعلب,سلحفاة,بومة|ابدأ بترميم صندوق C2 لفتح المسارات.|تم ترميم الموطن وفتح المسار.|الحيوان بأمان.|المؤن +3.|المأوى جاهز.|عاصفة: يفقد الحيوان المكشوف صحة واحدة.|الإنقاذ غير مكتمل|عادت الحياة للوادي|اختر مربعاً ثم إجراء.|طقس هادئ",
    };
    const tx = (i) => (labels[lang()] || labels.en).split("|")[i];
    const guide = {
      en: "Restore neighbouring tiles to open routes. Rescue costs 1 supply on restored land, 2 otherwise. Shelters protect animals from storms. Refill: +3 supplies for 1 action. Rescue all animals and meet the restoration goal. Three stars: all safe rescues and at least 2 actions left.",
      "zh-tw":
        "復育相鄰地塊可開路。復育地救援花 1 補給，緊急救援花 2。庇護所可擋風暴。補給花 1 行動獲得 3 補給。救回全部動物並完成復育目標即過關。全數安全救援、剩至少 2 行動可獲三星。粗糙地塊花 2 補給，先復育相鄰水源可減為 1。",
      "zh-cn":
        "复育相邻地块可开路。复育地救援花 1 补给，紧急救援花 2。庇护所可挡风暴。补给花 1 行动获得 3 补给。救回全部动物并完成复育目标即过关。全数安全救援、剩至少 2 行动可获三星。粗糙地块花 2 补给，相邻复育水源可减为 1。",
    };
    Object.assign(guide, {
      ja: "隣接マスを再生して道を開く。再生済みの救助は物資1、緊急救助は2。避難所は嵐を防ぐ。補給は1行動で物資3。全員救助と再生目標でクリア。安全な全員救助と残り2行動で星3。水源の隣では再生費用が減る。",
      ko: "인접 타일을 복원해 길을 만드세요. 복원된 곳 구조는 보급품1, 긴급 구조는2. 보호소는 폭풍을 막습니다. 보급은 행동1로 보급품3. 모든 동물과 복원 목표를 달성하세요. 안전 구조와 남은 행동2로 별3. 복원된 물 옆은 복원 비용이 줄어듭니다.",
      es: "Restaura casillas vecinas para abrir rutas. Rescatar cuesta 1 en terreno restaurado, 2 en emergencia. Refugios protegen de tormentas. Abastecer: 1 acción por 3 suministros. Rescata a todos y cumple la restauración. Tres estrellas: rescate seguro y 2 acciones restantes. El agua restaurada reduce el coste vecino.",
      "pt-br":
        "Restaure terrenos vizinhos para abrir rotas. Resgate custa 1 em terreno restaurado, 2 na emergência. Abrigos protegem da tempestade. Abastecer: 1 ação por 3 suprimentos. Resgate todos e restaure a meta. Três estrelas: todos seguros e 2 ações restantes. Água restaurada reduz o custo vizinho.",
      fr: "Restaure les cases voisines pour ouvrir des routes. Sauver coûte 1 sur terrain restauré, 2 en urgence. Un abri protège de l’orage. Ravitailler : 1 action pour 3 provisions. Sauve tous les animaux et atteins l’objectif. Trois étoiles : sauvetages sûrs et 2 actions restantes. L’eau restaurée réduit le coût voisin.",
      de: "Erneuere Nachbarfelder für neue Wege. Rettung kostet 1 auf erneuertem Boden, im Notfall 2 Vorräte. Schutz hält Stürme ab. Nachschub: 1 Aktion für 3 Vorräte. Rette alle Tiere und erfülle das Bodenziel. Drei Sterne: sichere Rettungen und 2 Aktionen übrig. Erneuertes Wasser senkt benachbarte Kosten.",
      it: "Ripristina caselle vicine per aprire sentieri. Salvare costa 1 su terreno ripristinato, 2 in emergenza. I ripari proteggono dalla tempesta. Rifornire: 1 azione per 3 scorte. Salva tutti e raggiungi l’obiettivo. Tre stelle: salvataggi sicuri e 2 azioni rimaste. L’acqua ripristinata riduce il costo vicino.",
      ru: "Восстанавливай соседние клетки для новых путей. Спасение стоит 1 на восстановленной земле, 2 в экстренном случае. Укрытия защищают от бури. Припасы: 1 ход за 3 единицы. Спаси всех и выполни цель. Три звезды: безопасное спасение и 2 хода в запасе. Вода снижает цену соседней клетки.",
      hi: "पास के खाने बहाल कर रास्ते खोलें। बहाल जगह बचाव की लागत1, आपात बचाव2। आश्रय तूफान से बचाता है। आपूर्ति में 1 चाल से 3 सामग्री मिलती है। सभी जीव और बहाली लक्ष्य पूरा करें। तीन तारे: सुरक्षित बचाव और 2 चाल शेष। बहाल जल के पास लागत घटती है।",
      ar: "رمم المربعات المجاورة لفتح المسارات. الإنقاذ يكلف مؤنة على أرض مرممة واثنتين للطوارئ. المأوى يحمي من العاصفة. التموين يكلف إجراء ويمنح3 مؤن. أنقذ الجميع وحقق هدف الترميم. ثلاث نجوم: إنقاذ آمن وإجراءان متبقيان. المياه المرممة تقلل تكلفة المربع المجاور.",
    });
    const chapter = (i) => chapterRows[i][Math.max(0, locales.indexOf(lang()))];
    const common = (i) =>
      window.wpMarketCommon?.(i) ||
      [
        "Language",
        "Start Game",
        "Stages",
        "Back",
        "Back",
        "Retry",
        "Next Stage",
        "",
        "Best",
        "Stage",
      ][i];
    const store = "weightplay-habitat-atlas-best-stage",
      journalKey = "weightplay-habitat-atlas-rescue-v1";
    let storageOK = true,
      best = 0,
      journal = {};
    try {
      best = Math.max(0, Math.min(6, Number(localStorage.getItem(store)) || 0));
      journal = JSON.parse(localStorage.getItem(journalKey) || "{}") || {};
    } catch {
      storageOK = false;
    }
    if (typeof journal !== "object" || Array.isArray(journal)) journal = {};
    let screen = "main",
      game = null,
      selected = 6,
      stageSelected = 0,
      stageSelector = null,
      sharedFrame = null,
      history = [],
      message = "",
      resultWin = false;
    const measurement = {
      screen: "main",
      roundKey: null,
      started: false,
      ended: false,
      outcome: "complete",
      restart: false,
    };
    function observe() {
      try {
        window.WonderAnalytics?.game?.observeState(() => ({
          ...measurement,
          node: document.body,
          activityMode: "input",
          idleSeconds: 300,
          keyboardKeys: [],
          paused:
            document.hidden || $("habitatAtlasLeaveDialog")?.hidden === false,
        }));
      } catch {}
    }
    window.addEventListener("weightplay:analytics-ready", observe);
    const board = document.createElement("section");
    board.id = "atlas-fieldwork";
    board.className = "rescue-field";
    board.innerHTML =
      '<div class="rescue-mission"><div id="rescue-meters"></div><div id="rescue-weather"></div></div><div id="rescue-map" role="group"></div><div class="rescue-inspector"><div><strong id="rescue-tile-title"></strong><p id="rescue-tile-copy"></p></div><div id="rescue-actions"></div></div><p id="rescue-feed" class="first-steps" role="status" aria-live="polite"></p>';
    const canvas = $("arena");
    canvas.hidden = true;
    canvas.setAttribute("aria-hidden", "true");
    canvas.before(board);
    const result = $("result-screen");
    result.classList.remove("screen");
    result.removeAttribute("data-screen");
    $("battle-screen").append(result);
    const vignette = document.createElement("div");
    vignette.className = "rescue-vignette";
    vignette.setAttribute("aria-hidden", "true");
    result.prepend(vignette);
    $("battle-controls").innerHTML =
      '<button type="button" id="rescue-supply"></button><button type="button" id="rescue-undo"></button><button type="button" id="rescue-exit"></button>';
    document.querySelector(".m5-hint").hidden = true;
    const lede = $("main-screen").querySelector(".m5-lede");
    lede.removeAttribute("data-m5-lede");
    function mainCopy() {
      lede.textContent = (guide[lang()] || guide.en)
        .split(/(?<=[。.!])\s*/)
        .slice(0, 2)
        .join(" ");
      $("main-progress").textContent = `${common(8)}: ${best} / 6`;
      document
        .querySelectorAll("[data-wp-habitat-extra]")
        .forEach((n) => (n.textContent = guide[lang()] || guide.en));
      document.querySelectorAll("[data-wp-habitat-faq]").forEach((n) => {
        n.textContent = n.dataset.wpHabitatFaq.endsWith(":a")
          ? guide[lang()] || guide.en
          : tx([0, 3, 9, 7][Number(n.dataset.wpHabitatFaq.split(":")[0])] || 0);
      });
      document
        .querySelectorAll("[data-wp-habitat-tag]")
        .forEach((n, i) => (n.textContent = tx([7, 8, 12][i % 3])));
    }
    function show(next) {
      board.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      board.querySelectorAll(".rescue-transfer").forEach((n) => n.remove());
      screen = next;
      document.body.dataset.screen = next;
      for (const id of ["main", "stage", "battle"]) {
        const n = $(id + "-screen");
        n.hidden = id !== next;
        n.classList.toggle("active", id === next);
      }
      sharedFrame?.activate(next);
      result.hidden = true;
      board.inert = false;
      $("battle-controls").inert = false;
      document.body.dataset.atlasResult = "false";
      measurement.screen = next;
      observe();
      window.dispatchEvent(
        new CustomEvent(
          next === "battle"
            ? "weightplay:battle-open"
            : "weightplay:shell-sync",
        ),
      );
    }
    const stagePoster = new URL("assets/animal-habitat-atlas-cover.webp", assetBase).href;
    const stageBackground = new URL(
      "assets/animal-habitat-atlas-background.png",
      assetBase,
    ).href;
    function stageRecord(index) {
      const plan = rescuePlans[index];
      const stars = Number(journal[index + 1] || 0);
      const unlocked = index <= best;
      const objective = `${tx(7)} ${plan.animals.length} · ${tx(8)} ${plan.goal} · ${tx(6)} ${plan.turns}`;
      return {
        id: index + 1,
        kicker: `${common(9)} ${index + 1}`,
        title: chapter(index),
        subtitle: `${tx(7)} ${plan.animals.length} · ${tx(8)} ${plan.goal}`,
        status: stars ? `★ ${stars}` : unlocked ? "" : "🔒",
        summary: objective,
        details: [guide[lang()] || guide.en],
        poster: stagePoster,
        locked: !unlocked,
        cleared: stars > 0,
      };
    }
    function stages() {
      stageSelected = Math.min(rescuePlans.length - 1, best);
      $("stage-progress").textContent = `${common(8)}: ${best} / ${rescuePlans.length}`;
      stageSelector?.refresh(stageSelected);
    }
    function mountSharedFrame() {
      sharedFrame = window.WeightPlayScreenFrame.mount({
        root: $("app"),
        localeSelect: $("localeSelect"),
        playUI: true,
        scenes: {
          main: {
            root: $("main-screen"),
            header: $("main-header"),
            content: $("main-content"),
          },
          stage: {
            root: $("stage-screen"),
            header: $("stage-header"),
            content: $("stage-content"),
            headerInfo: $("stage-header-info"),
          },
          battle: {
            root: $("battle-screen"),
            header: $("battle-header"),
            content: $("battle-content"),
            headerInfo: $("battle-header-info"),
          },
        },
      });
      stageSelector = window.WeightPlayPlayUI.mountStage({
        page: $("stage-page"),
        rail: $("stage-list"),
        selected: stageSelected,
        config: {
          count: rescuePlans.length,
          poster: stagePoster,
          background: stageBackground,
          stage: stageRecord,
        },
        isActive: () => document.body.dataset.screen === "stage",
        onSelect: (index) => {
          stageSelected = index;
          $("stage-progress").textContent = `${common(9)} ${index + 1} / ${rescuePlans.length} · ${common(8)} ${best}`;
        },
        onStart: (index) => start(index + 1),
      });
    }
    function start(stage, restart = false) {
      if (stage < 1 || stage > Math.min(6, best + 1)) return;
      game = R.create(stage);
      selected = 6;
      history = [];
      message = stage === 1 ? tx(17) : tx(25);
      resultWin = false;
      Object.assign(measurement, {
        roundKey: {},
        started: true,
        ended: false,
        outcome: "complete",
        restart,
      });
      show("battle");
      render();
      window.WeightPlayAudio?.play("game.start");
    }
    const coord = (id) => "ABCD"[id % 4] + (Math.floor(id / 4) + 1);
    const animalName = (c) =>
      tx(16).split(",")[
        Math.max(0, rescuePlans[game.stage - 1].animals.indexOf(c.id))
      ];
    function sprite(name, className) {
      const url = new URL("assets/rescue-v11/" + name + ".png", assetBase).href;
      return (
        '<img class="' +
        className +
        '" src="' +
        url +
        '" alt="" aria-hidden="true" draggable="false">'
      );
    }
    function art(c) {
      const species = Math.max(
        0,
        rescuePlans[game.stage - 1].animals.indexOf(c.id),
      );
      return sprite(
        ["otter", "fox", "tortoise", "owl"][species],
        "rescue-animal",
      );
    }
    function terrain(c) {
      const biome = c.wet
        ? "wetland"
        : ["forest", "arctic", "desert", "forest", "wetland", "forest"][
            game.stage - 1
          ];
      return sprite(
        biome + (c.restored ? "-restored" : "-damaged"),
        "rescue-land",
      );
    }
    function blocked() {
      return (
        screen !== "battle" ||
        !result.hidden ||
        $("habitatAtlasLeaveDialog")?.hidden === false
      );
    }
    function render() {
      if (!game) return;
      const p = rescuePlans[game.stage - 1],
        c = game.cells[selected];
      $("stage-label").textContent = `${common(9)} ${game.stage}/6`;
      $("score-label").textContent = `${tx(6)} ${p.turns - game.turn}`;
      $("battle-status").textContent =
        `${(copy[lang()] || copy.en).target}: ${tx(7)} ${p.animals.length} · ${tx(8)} ${p.goal}`;
      $("rescue-meters").innerHTML =
        `<span>${tx(3)} <b>${game.kits}</b></span><span>${tx(7)} <b>${game.saved}/${p.animals.length}</b></span><span>${tx(8)} <b>${R.eco(game)}/${p.goal}</b></span>`;
      $("rescue-weather").textContent = p.storm
        ? `${tx(9)} ${p.storm - (game.turn % p.storm)} · ${tx(11)} ${game.cells.filter((c) => c.animal && !c.rescued && !c.restored && !c.shelter).length}`
        : tx(26);
      $("rescue-map").setAttribute("aria-label", tx(25));
      game.cells.forEach((tile) => {
        const b = $("rescue-map").children[tile.id],
          safe = tile.restored || tile.shelter,
          has = tile.animal && !tile.rescued;
        b.className = `rescue-tile ${tile.restored ? "is-restored" : ""} ${R.accessible(game, tile.id) ? "is-reachable" : ""} ${selected === tile.id ? "is-selected" : ""}`;
        b.setAttribute("aria-pressed", String(selected === tile.id));
        b.setAttribute(
          "aria-label",
          `${coord(tile.id)} · ${tile.id === 10 ? tx(10) : has ? animalName(tile) : tile.cache ? tx(3) : tx(0)} · ${safe ? tx(12) : tx(11)}`,
        );
        b.innerHTML = `${terrain(tile)}<small class="rescue-coordinate">${coord(tile.id)}</small>${tile.id === 10 ? sprite("camp", "rescue-prop") : has ? art(tile) : tile.cache ? sprite("crate", "rescue-prop") : tile.rescued ? '<span class="rescue-saved-mark">✓</span>' : ""}<span class="rescue-tile-label">${tile.id === 10 ? tx(10) : has ? animalName(tile) : tile.cache ? `${tx(3)} +3` : tile.restored ? tx(15) : tile.rough ? "◆ 2" : "◆ 1"}</span>${has ? `<span class="rescue-health">${safe ? "⌂" : ""}${"♥".repeat(tile.health)}${"♡".repeat(2 - tile.health)}</span>` : ""}`;
      });
      $("rescue-tile-title").textContent =
        `${coord(selected)} · ${c.id === 10 ? tx(10) : c.animal ? (c.rescued ? tx(7) : animalName(c)) : c.cache ? `${tx(3)} +3` : tx(8)}`;
      $("rescue-tile-copy").textContent = !R.accessible(game, selected)
        ? tx(13)
        : c.animal && !c.rescued
          ? `${c.restored || c.shelter ? tx(12) : tx(11)} · ${tx(1)} ◆${c.restored ? 1 : 2}`
          : tx(25);
      for (const [action, index] of [
        ["restore", 0],
        ["rescue", 1],
        ["shelter", 2],
      ]) {
        const b = $("rescue-" + action),
          check = R.act(game, action, selected);
        b.textContent = `${tx(index)} ◆${action === "restore" ? R.cost(game, selected) : action === "rescue" ? (c.restored ? 1 : 2) : 1}`;
        b.innerHTML =
          sprite(
            { restore: "water", rescue: "crate", shelter: "shelter" }[action],
            "rescue-tool",
          ) +
          "<span>" +
          b.textContent +
          "</span>";
        b.disabled = !!check.error;
        b.title = check.error
          ? tx({ needRoute: 13, noKits: 14, done: 15 }[check.error] || 15)
          : tx(index);
      }
      $("rescue-feed").classList.toggle(
        "first-steps",
        game.stage === 1 && game.turn === 0,
      );
      $("rescue-feed").textContent = message;
      $("rescue-supply").textContent = `${tx(3)} +3`;
      $("rescue-supply").disabled = game.kits >= 9;
      $("rescue-undo").textContent = tx(4);
      $("rescue-undo").disabled = !history.length;
      $("rescue-exit").textContent = tx(5);
      mainCopy();
    }
    for (let id = 0; id < 12; id++) {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.tile = id;
      b.addEventListener("click", () => {
        if (blocked()) return;
        selected = id;
        render();
      });
      $("rescue-map").append(b);
    }
    for (const [action, index] of [
      ["restore", 0],
      ["rescue", 1],
      ["shelter", 2],
    ]) {
      const b = document.createElement("button");
      b.id = "rescue-" + action;
      b.type = "button";
      b.addEventListener("click", () => act(action));
      $("rescue-actions").append(b);
    }
    function act(action) {
      if (blocked()) return;
      const out = R.act(game, action, selected);
      if (out.error) {
        message = tx(out.error === "noKits" ? 14 : 13);
        render();
        window.WeightPlayAudio?.play("feedback.error");
        return;
      }
      history.push(game);
      if (history.length > 30) history.shift();
      game = out.state;
      message =
        tx({ restore: 18, rescue: 19, supply: 20, shelter: 21 }[action]) +
        (out.storm ? " " + tx(22) : "");
      render();
      transfer(action);
      if (
        action !== "supply" &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        $("rescue-map").children[selected].animate(
          [{ filter: "brightness(1.6)" }, { filter: "brightness(1)" }],
          { duration: 420, easing: "ease-out" },
        );
      window.WeightPlayAudio?.play(
        action === "rescue"
          ? "feedback.success"
          : action === "supply"
            ? "reward.collect"
            : "board.move",
      );
      if (game.ended) finish();
    }
    function transfer(action) {
      const source =
        $("rescue-map").children[action === "supply" ? 10 : selected];
      const destination =
        $("rescue-meters").querySelectorAll("b")[
          action === "rescue" ? 1 : action === "restore" ? 2 : 0
        ];
      if (action === "shelter" || !source || !destination) return;
      const origin = board.getBoundingClientRect(),
        a = source.getBoundingClientRect(),
        b = destination.getBoundingClientRect(),
        scale = origin.width / board.offsetWidth;
      board.querySelectorAll(".rescue-transfer").forEach((n) => n.remove());
      const node = document.createElement("span");
      node.className = "rescue-transfer";
      node.textContent = action === "supply" ? "+3" : "+1";
      node.setAttribute("aria-hidden", "true");
      node.style.left = (a.x + a.width / 2 - origin.x) / scale + "px";
      node.style.top = (a.y + a.height / 2 - origin.y) / scale + "px";
      board.append(node);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const animation = node.animate(
        reduced
          ? [{ opacity: 1 }, { opacity: 0 }]
          : [
              { transform: "translate(0,0)", opacity: 1 },
              {
                transform: `translate(${(b.x + b.width / 2 - a.x - a.width / 2) / scale}px,${(b.y + b.height / 2 - a.y - a.height / 2) / scale}px)`,
                opacity: 0,
              },
            ],
        { duration: reduced ? 100 : 420, easing: "ease-out" },
      );
      animation.finished.then(
        () => node.remove(),
        () => node.remove(),
      );
    }
    function persist() {
      try {
        best = Math.max(
          best,
          Math.min(6, Number(localStorage.getItem(store)) || 0),
        );
        localStorage.setItem(store, String(best));
        let other = JSON.parse(localStorage.getItem(journalKey) || "{}");
        if (!other || typeof other !== "object" || Array.isArray(other))
          other = {};
        Object.keys(journal).forEach(
          (k) =>
            (other[k] = Math.max(
              Number(other[k]) || 0,
              Number(journal[k]) || 0,
            )),
        );
        journal = other;
        localStorage.setItem(journalKey, JSON.stringify(journal));
      } catch {
        storageOK = false;
      }
    }
    function finish() {
      if (!result.hidden) return;
      vignette.innerHTML = game.cells
        .map(
          (c) =>
            `<div class="${c.restored ? "alive" : ""}">${terrain(c)}${c.animal ? art(c) : ""}${c.rescued ? '<span class="rescue-saved-mark">✓</span>' : ""}</div>`,
        )
        .join("");
      const stars = R.stars(game);
      resultWin = stars > 0;
      game.ended = true;
      if (resultWin) {
        best = Math.max(best, game.stage);
        journal[game.stage] = Math.max(Number(journal[game.stage]) || 0, stars);
        persist();
      }
      measurement.ended = true;
      measurement.outcome = resultWin ? "win" : "lose";
      measurement.screen = null;
      observe();
      $("result-title").textContent = tx(resultWin ? 24 : 23);
      $("result-copy").textContent =
        `${stars ? "★".repeat(stars) : "☆☆☆"} · ${tx(7)} ${game.saved}/${rescuePlans[game.stage - 1].animals.length} · ${tx(8)} ${R.eco(game)}/${rescuePlans[game.stage - 1].goal}${!storageOK ? " · " + (copy[lang()] || copy.en).unsaved : ""}`;
      $("next").disabled = !resultWin || game.stage === 6;
      $("next").setAttribute("aria-disabled", String($("next").disabled));
      result.hidden = false;
      board.inert = true;
      $("battle-controls").inert = true;
      document.body.dataset.atlasResult = "true";
      $("retry").focus({ preventScroll: true });
      window.WeightPlayAudio?.play(resultWin ? "result.win" : "result.lose");
      mainCopy();
    }
    $("rescue-supply").addEventListener("click", () => act("supply"));
    $("rescue-undo").addEventListener("click", () => {
      if (blocked() || !history.length) return;
      game = history.pop();
      message = tx(4);
      render();
      window.WeightPlayAudio?.play("board.undo");
    });
    $("rescue-exit").addEventListener("click", () => {
      if (!blocked()) finish();
    });
    function toStages() {
      if (measurement.started && !measurement.ended) {
        measurement.ended = true;
        measurement.outcome = "abandon";
      }
      stages();
      show("stage");
    }
    $("start-game").addEventListener("click", toStages);
    $("stage-back").addEventListener("click", () => {
      mainCopy();
      show("main");
    });
    $("to-stages").addEventListener("click", toStages);
    $("battle-back").addEventListener("click", toStages);
    $("retry").addEventListener("click", () => start(game.stage, true));
    $("next").addEventListener("click", () => {
      if (resultWin && game.stage < 6) start(game.stage + 1);
    });
    $("battle-utility")?.addEventListener("click", () =>
      $("rescue-supply").focus({ preventScroll: true }),
    );
    window.addEventListener("weightplay:market-locale-change", () => {
      mainCopy();
      stages();
      if (screen === "battle" && result.hidden) render();
    });
    window.addEventListener("storage", (e) => {
      if (e.key === store) {
        best = Math.max(best, Math.min(6, Number(e.newValue) || 0));
        mainCopy();
        if (screen === "stage") stages();
      }
    });
    mountSharedFrame();
    stages();
    mainCopy();
    show("main");
    $("loadingPanel")?.classList.add("hidden");
    $("loadingPanel")?.setAttribute("hidden", "");
  }
})();
