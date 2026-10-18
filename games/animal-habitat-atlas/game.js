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
  if (typeof document === "undefined") return;
  const assetBase = new URL(".", document.currentScript.src);
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL(
    "interface-7-cleanup.css?v=20261018-field-notebook",
    assetBase,
  ).href;
  document.head.append(stylesheet);
  const compat = document.createElement("script");
  compat.src = new URL(
    "interface-7-compat.js?v=20261018-field-notebook",
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
      rules = globalThis.HabitatAtlasRules;
    // Use the shared scaler's authored wide envelope, as Battle already does.
    // This keeps Stage controls usable on short landscape screens.
    $("stage-screen").dataset.wpStageLandscapeWidth = "760";
    $("stage-screen").dataset.wpStageLandscapeHeight = "334";
    const storageKey = "weightplay-habitat-atlas-best-stage",
      journalKey = "weightplay-habitat-atlas-field-notebook-v1";
    let storageAvailable = true;
    function read(key, fallback) {
      try {
        return localStorage.getItem(key) ?? fallback;
      } catch {
        storageAvailable = false;
        return fallback;
      }
    }
    let best = Math.max(0, Math.min(6, Number(read(storageKey, "0")) || 0)),
      journal = {};
    try {
      journal = JSON.parse(read(journalKey, "{}"));
      if (!journal || Array.isArray(journal) || typeof journal !== "object")
        journal = {};
    } catch {
      journal = {};
    }
    const state = {
      screen: "main",
      stage: 1,
      question: 0,
      stars: 0,
      penalty: 0,
      hint: false,
      solved: false,
      wrong: new Set(),
      lastWrong: null,
      lastPenaltyApplied: false,
      resultWin: null,
    };
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
            !!document.hidden || $("habitatAtlasLeaveDialog")?.hidden === false,
        }));
      } catch {
        /* Optional shared telemetry. */
      }
    }
    window.addEventListener("weightplay:analytics-ready", observe);
    function lang() {
      const raw =
        window.WeightPlayMarketFiveLocale?.locale ||
        document.documentElement.lang;
      return (
        { "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", "pt-BR": "pt-br" }[raw] ||
        (locales.includes(raw) ? raw : "en")
      );
    }
    const li = () => locales.indexOf(lang()),
      t = (key) => copy[lang()][key],
      common = (i) =>
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
          "Goal reached",
          "Try again",
        ][i];
    const region = (i) => window.WeightPlayMarketFiveLocale.game().regions[i],
      trait = (i) =>
        i >= 16
          ? faunaRows[i - 16][li()]
          : i >= 8
            ? inferenceRows[i - 8][li()]
            : traitRows[i][li()],
      wildlife = (i) => faunaRows[i][li()],
      chapter = (i) => chapterRows[i][li()],
      currentCase = () => expeditions[state.stage - 1].cases[state.question];
    const board = document.createElement("section");
    board.id = "atlas-fieldwork";
    board.setAttribute(
      "aria-label",
      window.WeightPlayMarketFiveLocale.game().canvas,
    );
    board.innerHTML =
      '<div class="atlas-notes first-steps"><span class="atlas-eyebrow" id="atlas-notes-label"></span><div id="atlas-clues"></div><p id="atlas-wildlife"></p></div><div id="atlas-habitats" class="atlas-habitats"></div><div id="atlas-feedback" class="atlas-feedback" role="status" aria-live="polite" aria-atomic="true"><strong id="atlas-feedback-title"></strong><p id="atlas-feedback-copy"></p></div>';
    const canvas = $("arena");
    canvas.hidden = true;
    canvas.setAttribute("aria-hidden", "true");
    canvas.tabIndex = -1;
    canvas.before(board);
    const result = $("result-screen");
    result.classList.remove("screen");
    result.removeAttribute("data-screen");
    // Settlement owns the entire Battle workspace, including the landscape
    // action column. Mount it once, before the first interactive paint.
    $("battle-screen").append(result);
    $("battle-controls").innerHTML =
      '<button type="button" id="atlas-hint" data-action="clue"></button><button type="button" id="atlas-next" class="m5-primary" disabled></button>';
    document.querySelector(".m5-hint").hidden = true;
    const lede = $("main-screen").querySelector(".m5-lede");
    lede.removeAttribute("data-m5-lede");
    function mainCopy() {
      lede.textContent = t("summary");
      $("main-progress").textContent = `${common(8)}: ${best} / 6`;
    }
    function show(screen) {
      state.screen = screen;
      document.body.dataset.screen = screen;
      for (const id of ["main", "stage", "battle"]) {
        const node = $(id + "-screen");
        node.hidden = id !== screen;
        node.classList.toggle("active", id === screen);
      }
      result.hidden = true;
      board.inert = false;
      $("battle-controls").inert = false;
      document.body.dataset.atlasResult = "false";
      measurement.screen = screen;
      observe();
      window.dispatchEvent(
        new CustomEvent(
          screen === "battle"
            ? "weightplay:battle-open"
            : "weightplay:shell-sync",
        ),
      );
    }
    function stages() {
      const rail = $("stage-list");
      rail.replaceChildren();
      expeditions.forEach((e, i) => {
        const available = i <= best,
          b = document.createElement("button");
        b.type = "button";
        b.className = `m5-stage-card stage-card${i === Math.min(5, best) ? " recommended" : ""}`;
        b.dataset.stage = String(i + 1);
        b.disabled = !available;
        b.setAttribute("aria-disabled", String(!available));
        if (available) b.setAttribute("data-wp-enter-battle", "");
        const n = document.createElement("span"),
          title = document.createElement("strong"),
          detail = document.createElement("small");
        n.textContent = `${best > i ? "✓" : "◈"} ${common(9)} ${i + 1} / 6`;
        title.textContent = chapter(i);
        detail.textContent = available
          ? `${e.cases.length} ${t("case")} · ${t("target")} ${e.pass} ★${journal[i + 1] ? ` · ${common(8)} ${journal[i + 1]} ★` : ""}`
          : "🔒";
        b.append(n, title, detail);
        b.addEventListener("click", () => start(i + 1));
        rail.append(b);
      });
    }
    function start(stage, restart = false) {
      if (
        !Number.isInteger(stage) ||
        stage < 1 ||
        stage > Math.min(6, best + 1)
      )
        return;
      Object.assign(state, { stage, question: 0, stars: 0, resultWin: null });
      Object.assign(measurement, {
        roundKey: {},
        started: true,
        ended: false,
        outcome: "complete",
        restart,
      });
      resetCase();
      show("battle");
      render();
      window.WeightPlayAudio?.play("game.start");
    }
    function resetCase() {
      Object.assign(state, {
        penalty: 0,
        hint: false,
        solved: false,
        lastWrong: null,
        lastPenaltyApplied: false,
        wrong: new Set(),
      });
    }
    function makeCards() {
      const host = $("atlas-habitats");
      host.replaceChildren();
      habitats.forEach((h) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "atlas-habitat";
        b.dataset.action = `region-${h.index}`;
        b.dataset.habitat = h.id;
        b.innerHTML =
          '<span class="atlas-card-art" aria-hidden="true"></span><span class="atlas-card-name"></span><span class="atlas-card-traits"></span><span class="atlas-card-mark" aria-hidden="true"></span>';
        b.querySelector(".atlas-card-art").style.setProperty(
          "--atlas-sprite",
          String(h.index),
        );
        b.addEventListener("click", () => choose(h));
        host.append(b);
      });
    }
    function render() {
      const entry = currentCase(),
        profile = expeditions[state.stage - 1];
      board.querySelector(".atlas-notes").classList.toggle("first-steps", state.stage === 1 && state.question === 0 && !state.solved);
      $("stage-label").textContent = `${common(9)} ${state.stage} / 6`;
      $("score-label").textContent =
        `${state.question + 1}/${profile.cases.length} · ${state.stars}/${profile.pass} ★`;
      $("battle-status").textContent = t("goal");
      $("atlas-notes-label").textContent = t("evidence");
      $("atlas-clues").replaceChildren(
        ...entry.clues.map((id, i) => {
          const node = document.createElement("div");
          node.className = "atlas-clue";
          const n = document.createElement("span");
          n.textContent = String(i + 1).padStart(2, "0");
          const text = document.createElement("strong");
          text.textContent = trait(id);
          node.append(n, text);
          return node;
        }),
      );
      $("atlas-wildlife").textContent = state.hint
        ? `◈ ${wildlife(entry.wildlife)}`
        : `${t("target")} ${profile.pass} ★ · ${Math.max(1, 3 - state.penalty)} ★`;
      for (const h of habitats) {
        const card = $("atlas-habitats").querySelector(
            `[data-habitat="${h.id}"]`,
          ),
          solved = state.solved && entry.answer === h.id,
          rejected = state.wrong.has(h.id);
        card.disabled = state.solved || rejected;
        card.classList.toggle("is-discovered", solved);
        card.classList.toggle("is-rejected", rejected);
        card.querySelector(".atlas-card-name").textContent = region(h.index);
        card.querySelector(".atlas-card-traits").textContent = h.traits
          .map(trait)
          .join(" · ");
        card.querySelector(".atlas-card-mark").textContent = solved
          ? "✓"
          : rejected
            ? "×"
            : "";
        card.setAttribute(
          "aria-label",
          `${region(h.index)}: ${h.traits.map(trait).join(", ")}`,
        );
      }
      $("atlas-feedback").dataset.state = state.solved
        ? "correct"
        : state.lastWrong
          ? "wrong"
          : "ready";
      $("atlas-feedback-title").textContent = state.solved
        ? `${t("correct")} +${Math.max(1, 3 - state.penalty)} ★`
        : state.lastWrong
          ? t("wrong").replace(
              " · −1 ★",
              state.lastPenaltyApplied ? " · −1 ★" : "",
            )
          : `${state.stage === 1 && state.question === 0 ? "03 · " : ""}${t("choose")}`;
      $("atlas-feedback-copy").textContent = state.solved
        ? `${t("match")}: ${entry.clues.map(trait).join(" + ")} → ${wildlife(entry.wildlife)}`
        : state.lastWrong
          ? `${region(state.lastWrong.index)}: ${state.lastWrong.traits.map(trait).join(" · ")}`
          : t("retryCue");
      $("atlas-hint").textContent = t("hint").replace(
        " · −1 ★",
        state.penalty < 2 ? " · −1 ★" : "",
      );
      $("atlas-hint").disabled = state.hint || state.solved;
      $("atlas-next").textContent =
        state.question === profile.cases.length - 1 ? t("finish") : t("next");
      $("atlas-next").disabled = !state.solved;
      $("atlas-next").setAttribute("aria-disabled", String(!state.solved));
      mainCopy();
    }
    function choose(h) {
      if (
        state.screen !== "battle" ||
        state.solved ||
        state.wrong.has(h.id) ||
        !result.hidden ||
        $("habitatAtlasLeaveDialog")?.hidden === false
      )
        return;
      if (rules.judge(currentCase(), h.id)) {
        state.solved = true;
        state.stars += Math.max(1, 3 - state.penalty);
        state.lastWrong = null;
        window.WeightPlayAudio?.play("feedback.success");
        render();
        $("atlas-next").focus({ preventScroll: true });
      } else {
        state.wrong.add(h.id);
        state.lastPenaltyApplied = state.penalty < 2;
        state.penalty = Math.min(2, state.penalty + 1);
        state.lastWrong = h;
        window.WeightPlayAudio?.play("feedback.error");
        render();
        $("atlas-habitats")
          .querySelector("button:not(:disabled)")
          ?.focus({ preventScroll: true });
      }
    }
    function persist() {
      try {
        best = Math.max(
          best,
          Math.min(6, Number(localStorage.getItem(storageKey)) || 0),
        );
        localStorage.setItem(storageKey, String(best));
        let other = {};
        try {
          other = JSON.parse(localStorage.getItem(journalKey) || "{}") || {};
        } catch {}
        if (Array.isArray(other) || typeof other !== "object") other = {};
        for (const [key, value] of Object.entries(journal))
          other[key] = Math.max(Number(other[key]) || 0, value);
        journal = other;
        localStorage.setItem(journalKey, JSON.stringify(journal));
      } catch {
        storageAvailable = false;
      }
    }
    function finish() {
      const profile = expeditions[state.stage - 1],
        win = state.stars >= profile.pass;
      state.resultWin = win;
      if (win) {
        best = Math.max(best, state.stage);
        journal[state.stage] = Math.max(
          Number(journal[state.stage]) || 0,
          state.stars,
        );
        persist();
      }
      measurement.ended = true;
      measurement.outcome = win ? "win" : "lose";
      measurement.screen = null;
      observe();
      $("result-title").textContent = common(win ? 10 : 11);
      $("result-copy").textContent =
        `${state.stars} / ${profile.cases.length * 3} ★ · ${t("target")} ${profile.pass} ★. ${win ? t(storageAvailable ? "saved" : "unsaved") : t("retryCue")}`;
      $("next").disabled = !win || state.stage === 6;
      $("next").setAttribute("aria-disabled", String($("next").disabled));
      result.hidden = false;
      board.inert = true;
      document.body.dataset.atlasResult = "true";
      $("retry").focus({ preventScroll: true });
      mainCopy();
      window.WeightPlayAudio?.play(win ? "result.win" : "result.lose");
    }
    $("atlas-hint").addEventListener("click", () => {
      if (state.solved || state.hint || state.screen !== "battle") return;
      state.hint = true;
      state.penalty = Math.min(2, state.penalty + 1);
      window.WeightPlayAudio?.play("feedback.hint");
      render();
    });
    $("atlas-next").addEventListener("click", () => {
      if (!state.solved || state.screen !== "battle" || !result.hidden) return;
      if (state.question === expeditions[state.stage - 1].cases.length - 1) {
        finish();
        return;
      }
      state.question++;
      resetCase();
      render();
      $("atlas-habitats")
        .querySelector("button")
        ?.focus({ preventScroll: true });
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
    $("retry").addEventListener("click", () => start(state.stage, true));
    $("next").addEventListener("click", () => {
      if (state.resultWin && state.stage < 6) start(state.stage + 1);
    });
    $("battle-back").addEventListener("click", toStages);
    $("battle-utility").addEventListener("click", () => {
      $("atlas-habitats")
        .querySelector("button:not(:disabled)")
        ?.focus({ preventScroll: true });
    });
    window.addEventListener("weightplay:market-locale-change", () => {
      mainCopy();
      stages();
      if (state.screen === "battle" && result.hidden) render();
    });
    window.addEventListener("storage", (event) => {
      if (event.key === storageKey) {
        best = Math.max(best, Math.min(6, Number(event.newValue) || 0));
        mainCopy();
        if (state.screen === "stage") stages();
      }
    });
    makeCards();
    mainCopy();
    stages();
    show("main");
    function ready() {
      $("loadingPanel")?.classList.add("hidden");
      $("loadingPanel")?.setAttribute("hidden", "");
    }
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
  }
})();
