/* Explicit stage data and bounded, deterministic construction for early trails. */
(() => {
  'use strict';
  const data = {
  "lexiconStatus": "design review draft; requires native-speaker review, not production-approved",
  "lexiconNotes": [
    "SEAL means the animal; ROCK means stone; SHELL means seashell. Natural visible spaces are preserved.",
    "This draft is manually authored from game context and selected animal-name references; it has not been checked by native speakers or a specialist dictionary.",
    "Needs native review: Hindi बर्फ़ is common for both snow and ice; जमा हुआ पानी describes ice as frozen water to distinguish it for young readers. Hindi उकाब for eagle may be unfamiliar; सील for the animal relies on ocean context.",
    "Needs native review: Brazilian Portuguese caniço and Spanish carrizo denote reeds but are region-dependent; Italian canna palustre is descriptive.",
    "KELP is rendered as the broader seaweed term in es, pt-BR, it, hi and ar and brown alga in fr; precise taxonomy and regional vocabulary need review.",
    "Arabic عقاب denotes eagle; usage varies and common نسر can also denote vulture. Arabic كف الحيوان is a descriptive animal paw.",
    "French manchot means a penguin, while pingouin usually refers to auks; species-independent wording and any imagery should be checked.",
    "Display phrases and word-matching tokens must remain separate. This draft does not replace existing authored en or zh-Hant boards."
  ],
  "locales": [
    "en",
    "zh-Hant",
    "zh-Hans",
    "ja",
    "ko",
    "es",
    "pt-BR",
    "fr",
    "de",
    "it",
    "ru",
    "hi",
    "ar"
  ],
  "lexicon": {
    "en": {
      "LION": "lion",
      "BEAR": "bear",
      "FOX": "fox",
      "FROG": "frog",
      "TREE": "tree",
      "LEAF": "leaf",
      "NEST": "nest",
      "TRAIL": "trail",
      "POND": "pond",
      "REED": "reed",
      "FISH": "fish",
      "WATER": "water",
      "GIRAFFE": "giraffe",
      "ZEBRA": "zebra",
      "GRASS": "grass",
      "HERD": "herd",
      "PAW": "paw",
      "ROCK": "rock",
      "SUN": "sun",
      "WHALE": "whale",
      "TURTLE": "turtle",
      "CORAL": "coral",
      "WAVE": "wave",
      "DOLPHIN": "dolphin",
      "SHELL": "shell",
      "TIDE": "tide",
      "KELP": "kelp",
      "PENGUIN": "penguin",
      "SNOW": "snow",
      "ICE": "ice",
      "SEAL": "seal",
      "OWL": "owl",
      "EAGLE": "eagle",
      "CAVE": "cave",
      "WIND": "wind",
      "FOREST": "forest",
      "SAFARI": "safari",
      "OCEAN": "ocean",
      "ARCTIC": "Arctic"
    },
    "zh-Hant": {
      "LION": "獅子",
      "BEAR": "熊",
      "FOX": "狐狸",
      "FROG": "青蛙",
      "TREE": "樹",
      "LEAF": "葉子",
      "NEST": "鳥巢",
      "TRAIL": "小徑",
      "POND": "池塘",
      "REED": "蘆葦",
      "FISH": "魚",
      "WATER": "水",
      "GIRAFFE": "長頸鹿",
      "ZEBRA": "斑馬",
      "GRASS": "草",
      "HERD": "獸群",
      "PAW": "爪子",
      "ROCK": "岩石",
      "SUN": "太陽",
      "WHALE": "鯨魚",
      "TURTLE": "海龜",
      "CORAL": "珊瑚",
      "WAVE": "海浪",
      "DOLPHIN": "海豚",
      "SHELL": "貝殼",
      "TIDE": "潮汐",
      "KELP": "海帶",
      "PENGUIN": "企鵝",
      "SNOW": "雪",
      "ICE": "冰",
      "SEAL": "海豹",
      "OWL": "貓頭鷹",
      "EAGLE": "老鷹",
      "CAVE": "山洞",
      "WIND": "風",
      "FOREST": "森林",
      "SAFARI": "草原探險",
      "OCEAN": "海洋",
      "ARCTIC": "北極"
    },
    "zh-Hans": {
      "LION": "狮子",
      "BEAR": "熊",
      "FOX": "狐狸",
      "FROG": "青蛙",
      "TREE": "树",
      "LEAF": "叶子",
      "NEST": "鸟巢",
      "TRAIL": "小径",
      "POND": "池塘",
      "REED": "芦苇",
      "FISH": "鱼",
      "WATER": "水",
      "GIRAFFE": "长颈鹿",
      "ZEBRA": "斑马",
      "GRASS": "草",
      "HERD": "兽群",
      "PAW": "爪子",
      "ROCK": "岩石",
      "SUN": "太阳",
      "WHALE": "鲸鱼",
      "TURTLE": "海龟",
      "CORAL": "珊瑚",
      "WAVE": "海浪",
      "DOLPHIN": "海豚",
      "SHELL": "贝壳",
      "TIDE": "潮汐",
      "KELP": "海带",
      "PENGUIN": "企鹅",
      "SNOW": "雪",
      "ICE": "冰",
      "SEAL": "海豹",
      "OWL": "猫头鹰",
      "EAGLE": "老鹰",
      "CAVE": "山洞",
      "WIND": "风",
      "FOREST": "森林",
      "SAFARI": "草原探险",
      "OCEAN": "海洋",
      "ARCTIC": "北极"
    },
    "ja": {
      "LION": "ライオン",
      "BEAR": "クマ",
      "FOX": "キツネ",
      "FROG": "カエル",
      "TREE": "木",
      "LEAF": "葉",
      "NEST": "巣",
      "TRAIL": "小道",
      "POND": "池",
      "REED": "アシ",
      "FISH": "魚",
      "WATER": "水",
      "GIRAFFE": "キリン",
      "ZEBRA": "シマウマ",
      "GRASS": "草",
      "HERD": "群れ",
      "PAW": "動物の足",
      "ROCK": "岩",
      "SUN": "太陽",
      "WHALE": "クジラ",
      "TURTLE": "ウミガメ",
      "CORAL": "サンゴ",
      "WAVE": "波",
      "DOLPHIN": "イルカ",
      "SHELL": "貝殻",
      "TIDE": "潮",
      "KELP": "コンブ",
      "PENGUIN": "ペンギン",
      "SNOW": "雪",
      "ICE": "氷",
      "SEAL": "アザラシ",
      "OWL": "フクロウ",
      "EAGLE": "ワシ",
      "CAVE": "洞窟",
      "WIND": "風",
      "FOREST": "森",
      "SAFARI": "サファリ",
      "OCEAN": "海",
      "ARCTIC": "北極"
    },
    "ko": {
      "LION": "사자",
      "BEAR": "곰",
      "FOX": "여우",
      "FROG": "개구리",
      "TREE": "나무",
      "LEAF": "잎",
      "NEST": "둥지",
      "TRAIL": "오솔길",
      "POND": "연못",
      "REED": "갈대",
      "FISH": "물고기",
      "WATER": "물",
      "GIRAFFE": "기린",
      "ZEBRA": "얼룩말",
      "GRASS": "풀",
      "HERD": "무리",
      "PAW": "발",
      "ROCK": "바위",
      "SUN": "해",
      "WHALE": "고래",
      "TURTLE": "바다거북",
      "CORAL": "산호",
      "WAVE": "파도",
      "DOLPHIN": "돌고래",
      "SHELL": "조개껍데기",
      "TIDE": "밀물과 썰물",
      "KELP": "다시마",
      "PENGUIN": "펭귄",
      "SNOW": "눈",
      "ICE": "얼음",
      "SEAL": "물범",
      "OWL": "부엉이",
      "EAGLE": "독수리",
      "CAVE": "동굴",
      "WIND": "바람",
      "FOREST": "숲",
      "SAFARI": "사파리",
      "OCEAN": "바다",
      "ARCTIC": "북극"
    },
    "es": {
      "LION": "león",
      "BEAR": "oso",
      "FOX": "zorro",
      "FROG": "rana",
      "TREE": "árbol",
      "LEAF": "hoja",
      "NEST": "nido",
      "TRAIL": "sendero",
      "POND": "estanque",
      "REED": "carrizo",
      "FISH": "pez",
      "WATER": "agua",
      "GIRAFFE": "jirafa",
      "ZEBRA": "cebra",
      "GRASS": "hierba",
      "HERD": "manada",
      "PAW": "pata",
      "ROCK": "roca",
      "SUN": "sol",
      "WHALE": "ballena",
      "TURTLE": "tortuga marina",
      "CORAL": "coral",
      "WAVE": "ola",
      "DOLPHIN": "delfín",
      "SHELL": "concha",
      "TIDE": "marea",
      "KELP": "alga marina",
      "PENGUIN": "pingüino",
      "SNOW": "nieve",
      "ICE": "hielo",
      "SEAL": "foca",
      "OWL": "búho",
      "EAGLE": "águila",
      "CAVE": "cueva",
      "WIND": "viento",
      "FOREST": "bosque",
      "SAFARI": "safari",
      "OCEAN": "océano",
      "ARCTIC": "Ártico"
    },
    "pt-BR": {
      "LION": "leão",
      "BEAR": "urso",
      "FOX": "raposa",
      "FROG": "rã",
      "TREE": "árvore",
      "LEAF": "folha",
      "NEST": "ninho",
      "TRAIL": "trilha",
      "POND": "lagoa",
      "REED": "caniço",
      "FISH": "peixe",
      "WATER": "água",
      "GIRAFFE": "girafa",
      "ZEBRA": "zebra",
      "GRASS": "grama",
      "HERD": "manada",
      "PAW": "pata",
      "ROCK": "rocha",
      "SUN": "sol",
      "WHALE": "baleia",
      "TURTLE": "tartaruga marinha",
      "CORAL": "coral",
      "WAVE": "onda",
      "DOLPHIN": "golfinho",
      "SHELL": "concha",
      "TIDE": "maré",
      "KELP": "alga marinha",
      "PENGUIN": "pinguim",
      "SNOW": "neve",
      "ICE": "gelo",
      "SEAL": "foca",
      "OWL": "coruja",
      "EAGLE": "águia",
      "CAVE": "caverna",
      "WIND": "vento",
      "FOREST": "floresta",
      "SAFARI": "safári",
      "OCEAN": "oceano",
      "ARCTIC": "Ártico"
    },
    "fr": {
      "LION": "lion",
      "BEAR": "ours",
      "FOX": "renard",
      "FROG": "grenouille",
      "TREE": "arbre",
      "LEAF": "feuille",
      "NEST": "nid",
      "TRAIL": "sentier",
      "POND": "étang",
      "REED": "roseau",
      "FISH": "poisson",
      "WATER": "eau",
      "GIRAFFE": "girafe",
      "ZEBRA": "zèbre",
      "GRASS": "herbe",
      "HERD": "troupeau",
      "PAW": "patte",
      "ROCK": "rocher",
      "SUN": "soleil",
      "WHALE": "baleine",
      "TURTLE": "tortue de mer",
      "CORAL": "corail",
      "WAVE": "vague",
      "DOLPHIN": "dauphin",
      "SHELL": "coquillage",
      "TIDE": "marée",
      "KELP": "algue brune",
      "PENGUIN": "manchot",
      "SNOW": "neige",
      "ICE": "glace",
      "SEAL": "phoque",
      "OWL": "hibou",
      "EAGLE": "aigle",
      "CAVE": "grotte",
      "WIND": "vent",
      "FOREST": "forêt",
      "SAFARI": "safari",
      "OCEAN": "océan",
      "ARCTIC": "Arctique"
    },
    "de": {
      "LION": "Löwe",
      "BEAR": "Bär",
      "FOX": "Fuchs",
      "FROG": "Frosch",
      "TREE": "Baum",
      "LEAF": "Blatt",
      "NEST": "Nest",
      "TRAIL": "Pfad",
      "POND": "Teich",
      "REED": "Schilf",
      "FISH": "Fisch",
      "WATER": "Wasser",
      "GIRAFFE": "Giraffe",
      "ZEBRA": "Zebra",
      "GRASS": "Gras",
      "HERD": "Herde",
      "PAW": "Pfote",
      "ROCK": "Fels",
      "SUN": "Sonne",
      "WHALE": "Wal",
      "TURTLE": "Meeresschildkröte",
      "CORAL": "Koralle",
      "WAVE": "Welle",
      "DOLPHIN": "Delfin",
      "SHELL": "Muschel",
      "TIDE": "Gezeiten",
      "KELP": "Seetang",
      "PENGUIN": "Pinguin",
      "SNOW": "Schnee",
      "ICE": "Eis",
      "SEAL": "Robbe",
      "OWL": "Eule",
      "EAGLE": "Adler",
      "CAVE": "Höhle",
      "WIND": "Wind",
      "FOREST": "Wald",
      "SAFARI": "Safari",
      "OCEAN": "Ozean",
      "ARCTIC": "Arktis"
    },
    "it": {
      "LION": "leone",
      "BEAR": "orso",
      "FOX": "volpe",
      "FROG": "rana",
      "TREE": "albero",
      "LEAF": "foglia",
      "NEST": "nido",
      "TRAIL": "sentiero",
      "POND": "stagno",
      "REED": "canna palustre",
      "FISH": "pesce",
      "WATER": "acqua",
      "GIRAFFE": "giraffa",
      "ZEBRA": "zebra",
      "GRASS": "erba",
      "HERD": "mandria",
      "PAW": "zampa",
      "ROCK": "roccia",
      "SUN": "sole",
      "WHALE": "balena",
      "TURTLE": "tartaruga marina",
      "CORAL": "corallo",
      "WAVE": "onda",
      "DOLPHIN": "delfino",
      "SHELL": "conchiglia",
      "TIDE": "marea",
      "KELP": "alga marina",
      "PENGUIN": "pinguino",
      "SNOW": "neve",
      "ICE": "ghiaccio",
      "SEAL": "foca",
      "OWL": "gufo",
      "EAGLE": "aquila",
      "CAVE": "grotta",
      "WIND": "vento",
      "FOREST": "foresta",
      "SAFARI": "safari",
      "OCEAN": "oceano",
      "ARCTIC": "Artico"
    },
    "ru": {
      "LION": "лев",
      "BEAR": "медведь",
      "FOX": "лиса",
      "FROG": "лягушка",
      "TREE": "дерево",
      "LEAF": "лист",
      "NEST": "гнездо",
      "TRAIL": "тропинка",
      "POND": "пруд",
      "REED": "тростник",
      "FISH": "рыба",
      "WATER": "вода",
      "GIRAFFE": "жираф",
      "ZEBRA": "зебра",
      "GRASS": "трава",
      "HERD": "стадо",
      "PAW": "лапа",
      "ROCK": "камень",
      "SUN": "солнце",
      "WHALE": "кит",
      "TURTLE": "морская черепаха",
      "CORAL": "коралл",
      "WAVE": "волна",
      "DOLPHIN": "дельфин",
      "SHELL": "ракушка",
      "TIDE": "прилив",
      "KELP": "ламинария",
      "PENGUIN": "пингвин",
      "SNOW": "снег",
      "ICE": "лёд",
      "SEAL": "тюлень",
      "OWL": "сова",
      "EAGLE": "орёл",
      "CAVE": "пещера",
      "WIND": "ветер",
      "FOREST": "лес",
      "SAFARI": "сафари",
      "OCEAN": "океан",
      "ARCTIC": "Арктика"
    },
    "hi": {
      "LION": "शेर",
      "BEAR": "भालू",
      "FOX": "लोमड़ी",
      "FROG": "मेंढक",
      "TREE": "पेड़",
      "LEAF": "पत्ता",
      "NEST": "घोंसला",
      "TRAIL": "पगडंडी",
      "POND": "तालाब",
      "REED": "सरकंडा",
      "FISH": "मछली",
      "WATER": "पानी",
      "GIRAFFE": "जिराफ़",
      "ZEBRA": "ज़ेब्रा",
      "GRASS": "घास",
      "HERD": "झुंड",
      "PAW": "पंजा",
      "ROCK": "चट्टान",
      "SUN": "सूरज",
      "WHALE": "व्हेल",
      "TURTLE": "समुद्री कछुआ",
      "CORAL": "मूँगा",
      "WAVE": "लहर",
      "DOLPHIN": "डॉल्फ़िन",
      "SHELL": "सीप",
      "TIDE": "ज्वार",
      "KELP": "समुद्री शैवाल",
      "PENGUIN": "पेंगुइन",
      "SNOW": "बर्फ़",
      "ICE": "जमा हुआ पानी",
      "SEAL": "सील",
      "OWL": "उल्लू",
      "EAGLE": "उकाब",
      "CAVE": "गुफा",
      "WIND": "हवा",
      "FOREST": "जंगल",
      "SAFARI": "सफ़ारी",
      "OCEAN": "महासागर",
      "ARCTIC": "आर्कटिक"
    },
    "ar": {
      "LION": "أسد",
      "BEAR": "دب",
      "FOX": "ثعلب",
      "FROG": "ضفدع",
      "TREE": "شجرة",
      "LEAF": "ورقة",
      "NEST": "عش",
      "TRAIL": "درب",
      "POND": "بركة",
      "REED": "قصب",
      "FISH": "سمكة",
      "WATER": "ماء",
      "GIRAFFE": "زرافة",
      "ZEBRA": "حمار وحشي",
      "GRASS": "عشب",
      "HERD": "قطيع",
      "PAW": "كف الحيوان",
      "ROCK": "صخرة",
      "SUN": "شمس",
      "WHALE": "حوت",
      "TURTLE": "سلحفاة بحرية",
      "CORAL": "مرجان",
      "WAVE": "موجة",
      "DOLPHIN": "دلفين",
      "SHELL": "صدفة",
      "TIDE": "مد وجزر",
      "KELP": "عشب البحر",
      "PENGUIN": "بطريق",
      "SNOW": "ثلج",
      "ICE": "جليد",
      "SEAL": "فقمة",
      "OWL": "بومة",
      "EAGLE": "عقاب",
      "CAVE": "كهف",
      "WIND": "رياح",
      "FOREST": "غابة",
      "SAFARI": "رحلة سفاري",
      "OCEAN": "محيط",
      "ARCTIC": "القطب الشمالي"
    }
  },
  "stages": [
    {
      "id": 11,
      "title": "Forest first bridge",
      "wordIds": [
        "FOX",
        "OWL",
        "TREE",
        "FOREST"
      ],
      "zhHantTargets": null,
      "rule": "Intro: find all four words with one bridge; learn the gap action after the original album trail.",
      "difficulty": null
    },
    {
      "id": 12,
      "title": "Pond crossing",
      "wordIds": [
        "FROG",
        "FISH",
        "POND",
        "WATER"
      ],
      "zhHantTargets": null,
      "rule": "Intro: one bridge and a branch; distinguish a bridge route from a route around it.",
      "difficulty": null
    },
    {
      "id": 13,
      "title": "Woodland fork",
      "wordIds": [
        "BEAR",
        "FOX",
        "ROCK",
        "LEAF"
      ],
      "zhHantTargets": null,
      "rule": "Practice: one bridge and a blocked root; choose a safe approach.",
      "difficulty": null
    },
    {
      "id": 14,
      "title": "Bird paths",
      "wordIds": [
        "OWL",
        "EAGLE",
        "NEST",
        "TREE"
      ],
      "zhHantTargets": null,
      "rule": "Practice: one bridge and intersecting word routes; plan distinct paths through the crossing.",
      "difficulty": null
    },
    {
      "id": 15,
      "title": "Bridge album checkpoint",
      "wordIds": [
        "BEAR",
        "FOX",
        "FOREST",
        "LEAF"
      ],
      "zhHantTargets": null,
      "rule": "Practice checkpoint: bridge plus root, then a bridge memento and trail 16.",
      "difficulty": null
    },
    {
      "id": 16,
      "title": "Two bridge sites",
      "wordIds": [
        "LION",
        "ZEBRA",
        "GIRAFFE",
        "GRASS"
      ],
      "zhHantTargets": null,
      "rule": "Intro: choose one of two bridge positions; compare paths before moving it.",
      "difficulty": null
    },
    {
      "id": 17,
      "title": "Shore crossing",
      "wordIds": [
        "SEAL",
        "WHALE",
        "OCEAN",
        "SHELL"
      ],
      "zhHantTargets": null,
      "rule": "Practice: each bridge position is necessary for at least one target; change sites.",
      "difficulty": null
    },
    {
      "id": 18,
      "title": "Direction fork",
      "wordIds": [
        "EAGLE",
        "OWL",
        "WIND",
        "NEST"
      ],
      "zhHantTargets": null,
      "rule": "Combine: two sites and one directional entry; choose bridge and valid approach.",
      "difficulty": null
    },
    {
      "id": 19,
      "title": "Forest detour",
      "wordIds": [
        "FROG",
        "FISH",
        "FOREST",
        "POND"
      ],
      "zhHantTargets": null,
      "rule": "Combine: two sites and a root; use a detour rather than the previous one-way cue.",
      "difficulty": null
    },
    {
      "id": 20,
      "title": "Two bridges checkpoint",
      "wordIds": [
        "LION",
        "ZEBRA",
        "SUN",
        "ROCK"
      ],
      "zhHantTargets": null,
      "rule": "Combine checkpoint: two sites, root and directional entry; receive the bridge memento and unlock 21.",
      "difficulty": null
    },
    {
      "id": 21,
      "title": "Garden crossing",
      "wordIds": [
        "TURTLE",
        "FROG",
        "LEAF",
        "GRASS"
      ],
      "zhHantTargets": null,
      "rule": "Combine: two sites and intersecting word routes; do not reuse a cell within a word.",
      "difficulty": null
    },
    {
      "id": 22,
      "title": "Night fork",
      "wordIds": [
        "OWL",
        "FOX",
        "CAVE",
        "WIND"
      ],
      "zhHantTargets": null,
      "rule": "Combine: two bridge sites and two roots create separate safe approaches.",
      "difficulty": null
    },
    {
      "id": 23,
      "title": "Rocky shore",
      "wordIds": [
        "PENGUIN",
        "SEAL",
        "SNOW",
        "ICE"
      ],
      "zhHantTargets": null,
      "rule": "Combine: two sites and two directional entries; read each arrow before entering.",
      "difficulty": null
    },
    {
      "id": 24,
      "title": "Grassland meeting",
      "wordIds": [
        "LION",
        "ZEBRA",
        "ROCK",
        "WIND"
      ],
      "zhHantTargets": null,
      "rule": "Combine: intersecting word routes and root constrain which bridge to choose.",
      "difficulty": null
    },
    {
      "id": 25,
      "title": "Navigation checkpoint",
      "wordIds": [
        "BEAR",
        "FOX",
        "OWL",
        "FOREST"
      ],
      "zhHantTargets": null,
      "rule": "Mastery checkpoint: bridge switching, intersecting routes, root and direction; earn the navigation memento and unlock 26.",
      "difficulty": null
    },
    {
      "id": 26,
      "title": "River visitors",
      "wordIds": [
        "TURTLE",
        "POND",
        "FISH",
        "WATER"
      ],
      "zhHantTargets": null,
      "rule": "Combine: two sites and distinct entrances; practice the other entry after switching.",
      "difficulty": null
    },
    {
      "id": 27,
      "title": "Cave visitors",
      "wordIds": [
        "BEAR",
        "FOX",
        "CAVE",
        "ROCK"
      ],
      "zhHantTargets": null,
      "rule": "Combine: two sites and two separated roots require separate detours.",
      "difficulty": null
    },
    {
      "id": 28,
      "title": "Tree visitors",
      "wordIds": [
        "EAGLE",
        "OWL",
        "WIND",
        "NEST"
      ],
      "zhHantTargets": null,
      "rule": "Mastery: intersecting routes plus directional entry and two bridge positions.",
      "difficulty": null
    },
    {
      "id": 29,
      "title": "Habitat meeting",
      "wordIds": [
        "BEAR",
        "FOX",
        "POND",
        "FOREST"
      ],
      "zhHantTargets": null,
      "rule": "Mastery: two sites, two roots and a direction combine the route vocabulary.",
      "difficulty": null
    },
    {
      "id": 30,
      "title": "Bridge festival finale",
      "wordIds": [
        "LION",
        "SEAL",
        "FOREST",
        "OCEAN"
      ],
      "zhHantTargets": null,
      "rule": "Mastery checkpoint: both sites, intersecting routes, root and direction; earn the chapter memento and unlock 31.",
      "difficulty": null
    },
    {
      "id": 31,
      "title": "Forest clues",
      "wordIds": [
        "FOX",
        "OWL",
        "FOREST",
        "POND"
      ],
      "zhHantTargets": [
        "狐狸",
        "貓頭鷹",
        "森林",
        "池塘"
      ],
      "rule": "A→N, W0. Select either animal first, then find the two nature words.",
      "difficulty": "Intro: category gating without a new tile."
    },
    {
      "id": 32,
      "title": "Woodland homes",
      "wordIds": [
        "BEAR",
        "LION",
        "CAVE",
        "FOREST"
      ],
      "zhHantTargets": [
        "棕熊",
        "獅子",
        "山洞",
        "森林"
      ],
      "rule": "A→N, W0. Choose the first animal; at least one available target uses a diagonal step.",
      "difficulty": "Intro: combine category selection and diagonal routing, including languages with two-character words."
    },
    {
      "id": 33,
      "title": "Pond life",
      "wordIds": [
        "FROG",
        "FISH",
        "WATER",
        "POND"
      ],
      "zhHantTargets": [
        "青蛙",
        "魚兒",
        "溪水",
        "池塘"
      ],
      "rule": "A→N, W1. One target has both ordinary and Wild Leaf solutions; the leaf is optional.",
      "difficulty": "Intro: visible tool and reversible practice."
    },
    {
      "id": 34,
      "title": "Forest leaves",
      "wordIds": [
        "FOX",
        "FROG",
        "TREE",
        "LEAF"
      ],
      "zhHantTargets": [
        "狐狸",
        "青蛙",
        "樹木",
        "樹葉"
      ],
      "rule": "A→N, W1. TREE／樹木 requires the leaf after the animal category is complete.",
      "difficulty": "Practice: select a target before a mandatory leaf."
    },
    {
      "id": 35,
      "title": "Woodland review",
      "wordIds": [
        "OWL",
        "EAGLE",
        "NEST",
        "TREE"
      ],
      "zhHantTargets": [
        "貓頭鷹",
        "老鷹",
        "鳥巢",
        "樹木"
      ],
      "rule": "A→N, W1, B1. NEST／鳥巢 requires the leaf; route around the marked central obstacle.",
      "difficulty": "Checkpoint: category order, one required leaf and blocked-cell recognition."
    },
    {
      "id": 36,
      "title": "Coast friends",
      "wordIds": [
        "DOLPHIN",
        "SEAL",
        "OCEAN",
        "SHELL"
      ],
      "zhHantTargets": [
        "海豚",
        "海豹",
        "海洋",
        "貝殼"
      ],
      "rule": "A→N, W1. DOLPHIN／海豚 and SEAL／海豹 each require the same reusable leaf in separate paths.",
      "difficulty": "Practice: verify refresh between words."
    },
    {
      "id": 37,
      "title": "Ocean neighbors",
      "wordIds": [
        "WHALE",
        "DOLPHIN",
        "CORAL",
        "OCEAN"
      ],
      "zhHantTargets": [
        "鯨魚",
        "海豚",
        "珊瑚",
        "海洋"
      ],
      "rule": "A→N, W1. Both animal targets require the leaf; choose which animal first.",
      "difficulty": "Practice: same resource, alternate first decision."
    },
    {
      "id": 38,
      "title": "Shore footprints",
      "wordIds": [
        "TURTLE",
        "FISH",
        "ROCK",
        "SHELL"
      ],
      "zhHantTargets": [
        "海龜",
        "魚兒",
        "岩石",
        "貝殼"
      ],
      "rule": "A→N, W1, B1. TURTLE／海龜 needs the leaf; the blocked tile forces a different approach.",
      "difficulty": "Combine: leaf plus safe detour."
    },
    {
      "id": 39,
      "title": "Forest neighbors",
      "wordIds": [
        "FOX",
        "FROG",
        "ROCK",
        "FOREST"
      ],
      "zhHantTargets": [
        "狐狸",
        "青蛙",
        "岩石",
        "森林"
      ],
      "rule": "A→N, W1. Similar initial letters make selected-target matching essential; FROG／青蛙 requires the leaf.",
      "difficulty": "Practice: the same `?` cannot silently choose another word."
    },
    {
      "id": 40,
      "title": "Mountain skies",
      "wordIds": [
        "EAGLE",
        "OWL",
        "WIND",
        "ROCK"
      ],
      "zhHantTargets": [
        "老鷹",
        "貓頭鷹",
        "山風",
        "岩石"
      ],
      "rule": "A→N, W1. EAGLE／老鷹 and ROCK／岩石 each require the reusable leaf; at least one target requires a diagonal.",
      "difficulty": "Checkpoint: reuse in both categories plus diagonal routing."
    },
    {
      "id": 41,
      "title": "Sunny pond",
      "wordIds": [
        "WIND",
        "SUN",
        "FROG",
        "FISH"
      ],
      "zhHantTargets": [
        "山風",
        "太陽",
        "青蛙",
        "魚兒"
      ],
      "rule": "N→A, W1. The leaf is optional; read the reversed category cue.",
      "difficulty": "Intro: nature words first."
    },
    {
      "id": 42,
      "title": "Forest cover",
      "wordIds": [
        "TREE",
        "LEAF",
        "BEAR",
        "GIRAFFE"
      ],
      "zhHantTargets": [
        "樹木",
        "樹葉",
        "棕熊",
        "長頸鹿"
      ],
      "rule": "N→A, W1. LEAF／樹葉 requires the leaf; select either nature target first.",
      "difficulty": "Practice: reversed category plus required tool."
    },
    {
      "id": 43,
      "title": "Grassland friends",
      "wordIds": [
        "GRASS",
        "LEAF",
        "EAGLE",
        "ZEBRA"
      ],
      "zhHantTargets": [
        "青草",
        "樹葉",
        "老鷹",
        "斑馬"
      ],
      "rule": "Choice, W1. Either category may be chosen before its first successful word; ZEBRA／斑馬 requires the leaf.",
      "difficulty": "Intro: child selects the first category."
    },
    {
      "id": 44,
      "title": "Grassland pairs",
      "wordIds": [
        "GRASS",
        "LEAF",
        "ZEBRA",
        "GIRAFFE"
      ],
      "zhHantTargets": [
        "青草",
        "樹葉",
        "斑馬",
        "長頸鹿"
      ],
      "rule": "Choice, W1. LEAF／樹葉 requires the leaf, while ZEBRA／斑馬 has an ordinary path.",
      "difficulty": "Practice: compare the two category orders."
    },
    {
      "id": 45,
      "title": "Winter paths",
      "wordIds": [
        "ICE",
        "SNOW",
        "SEAL",
        "FOX"
      ],
      "zhHantTargets": [
        "冰塊",
        "雪花",
        "海豹",
        "狐狸"
      ],
      "rule": "Choice, W1. SEAL／海豹 requires the leaf and a target path has a turn.",
      "difficulty": "Checkpoint: first-category choice plus precise target matching."
    },
    {
      "id": 46,
      "title": "Night homes",
      "wordIds": [
        "OWL",
        "FOX",
        "CAVE",
        "ROCK"
      ],
      "zhHantTargets": [
        "貓頭鷹",
        "狐狸",
        "山洞",
        "岩石"
      ],
      "rule": "A→N, W2. CAVE／山洞 requires one of the two leaves; the other is an alternate approach.",
      "difficulty": "Intro: choose a leaf location, never two in one word."
    },
    {
      "id": 47,
      "title": "Forest canopy",
      "wordIds": [
        "FOX",
        "EAGLE",
        "LEAF",
        "TREE"
      ],
      "zhHantTargets": [
        "狐狸",
        "老鷹",
        "樹葉",
        "樹木"
      ],
      "rule": "A→N, W2. EAGLE／老鷹 and LEAF／樹葉 use leaves positioned near their respective routes.",
      "difficulty": "Practice: plan a different leaf for each category."
    },
    {
      "id": 48,
      "title": "Pond friends",
      "wordIds": [
        "FROG",
        "FISH",
        "POND",
        "WATER"
      ],
      "zhHantTargets": [
        "青蛙",
        "魚兒",
        "池塘",
        "溪水"
      ],
      "rule": "A→N, W2, B1. FROG／青蛙 and WATER／溪水 require different leaves around a blocked cell.",
      "difficulty": "Combine: two routes and an obstacle."
    },
    {
      "id": 49,
      "title": "Pond neighbors",
      "wordIds": [
        "FROG",
        "FISH",
        "POND",
        "GRASS"
      ],
      "zhHantTargets": [
        "青蛙",
        "魚兒",
        "池塘",
        "青草"
      ],
      "rule": "Choice, W2. FISH／魚兒 requires a leaf; choose a category and an accessible entry.",
      "difficulty": "Practice: category choice with alternate approaches."
    },
    {
      "id": 50,
      "title": "Shore review",
      "wordIds": [
        "TURTLE",
        "WHALE",
        "OCEAN",
        "SHELL"
      ],
      "zhHantTargets": [
        "海龜",
        "鯨魚",
        "海洋",
        "貝殼"
      ],
      "rule": "A→N, W2. TURTLE／海龜 and OCEAN／海洋 must each require a different designated leaf.",
      "difficulty": "Checkpoint: both leaf locations matter across two words."
    },
    {
      "id": 51,
      "title": "Pond bank",
      "wordIds": [
        "BEAR",
        "FOX",
        "LEAF",
        "POND"
      ],
      "zhHantTargets": [
        "棕熊",
        "狐狸",
        "樹葉",
        "池塘"
      ],
      "rule": "A→N, W1, B1. FOX／狐狸 needs the leaf; work around the blocked tile.",
      "difficulty": "Combine: fixed order, leaf and obstacle."
    },
    {
      "id": 52,
      "title": "Forest path",
      "wordIds": [
        "GIRAFFE",
        "ZEBRA",
        "GRASS",
        "FOREST"
      ],
      "zhHantTargets": [
        "長頸鹿",
        "斑馬",
        "青草",
        "森林"
      ],
      "rule": "N→A, W1, O1. FOREST／森林 requires the one-way entry; ZEBRA／斑馬 requires the leaf.",
      "difficulty": "Combine: reversed order and a readable directional rule."
    },
    {
      "id": 53,
      "title": "Ocean currents",
      "wordIds": [
        "DOLPHIN",
        "FISH",
        "OCEAN",
        "WATER"
      ],
      "zhHantTargets": [
        "海豚",
        "魚兒",
        "海洋",
        "溪水"
      ],
      "rule": "A→N, W2, O1. DOLPHIN／海豚 requires a leaf and OCEAN／海洋 uses the one-way entry.",
      "difficulty": "Combine: choose target and approach before entering the directional tile."
    },
    {
      "id": 54,
      "title": "Forest homes",
      "wordIds": [
        "OWL",
        "EAGLE",
        "NEST",
        "TREE"
      ],
      "zhHantTargets": [
        "貓頭鷹",
        "老鷹",
        "鳥巢",
        "樹木"
      ],
      "rule": "Choice, W1, B1. NEST／鳥巢 requires the leaf; each category has a distinct approach around the obstacle.",
      "difficulty": "Combine: chosen order and two route decisions."
    },
    {
      "id": 55,
      "title": "Snowy neighbors",
      "wordIds": [
        "PENGUIN",
        "SEAL",
        "ICE",
        "SNOW"
      ],
      "zhHantTargets": [
        "企鵝",
        "海豹",
        "冰塊",
        "雪花"
      ],
      "rule": "Choice, W2, B1. PENGUIN／企鵝 and SNOW／雪花 each require a different designated leaf.",
      "difficulty": "Checkpoint: category choice, both leaves and a blocked cell."
    },
    {
      "id": 56,
      "title": "Tree homes",
      "wordIds": [
        "NEST",
        "TREE",
        "OWL",
        "EAGLE"
      ],
      "zhHantTargets": [
        "鳥巢",
        "樹木",
        "貓頭鷹",
        "老鷹"
      ],
      "rule": "N→A, W2, O1. NEST／鳥巢 needs a leaf; OWL／貓頭鷹 uses the directional entry.",
      "difficulty": "Mastery: nature first and two different constraints."
    },
    {
      "id": 57,
      "title": "Ocean reef",
      "wordIds": [
        "CORAL",
        "OCEAN",
        "WHALE",
        "TURTLE"
      ],
      "zhHantTargets": [
        "珊瑚",
        "海洋",
        "鯨魚",
        "海龜"
      ],
      "rule": "Choice, W2. OCEAN／海洋 and TURTLE／海龜 reuse the same required leaf on separate turns; the second leaf is an optional route tool.",
      "difficulty": "Mastery: choose category order and reuse a leaf deliberately."
    },
    {
      "id": 58,
      "title": "Cave visitors",
      "wordIds": [
        "ROCK",
        "CAVE",
        "FOX",
        "BEAR"
      ],
      "zhHantTargets": [
        "岩石",
        "山洞",
        "狐狸",
        "棕熊"
      ],
      "rule": "N→A, W2, B1, O1. CAVE／山洞 needs a leaf and BEAR／棕熊 uses the one-way entry.",
      "difficulty": "Mastery: obstacle and direction require separate route planning."
    },
    {
      "id": 59,
      "title": "Forest harvest",
      "wordIds": [
        "TREE",
        "LEAF",
        "FROG",
        "FISH"
      ],
      "zhHantTargets": [
        "樹木",
        "樹葉",
        "青蛙",
        "魚兒"
      ],
      "rule": "Choice, W2. LEAF／樹葉 and FISH／魚兒 require different designated leaves.",
      "difficulty": "Mastery: select a category and preserve both intended routes."
    },
    {
      "id": 60,
      "title": "Keeper’s gathering",
      "wordIds": [
        "FOREST",
        "POND",
        "OWL",
        "FROG"
      ],
      "zhHantTargets": [
        "森林",
        "池塘",
        "貓頭鷹",
        "青蛙"
      ],
      "rule": "Choice, W2, B1, O1. FOREST／森林 and FROG／青蛙 require different designated leaves; OWL／貓頭鷹 uses the one-way entry.",
      "difficulty": "Final checkpoint: combine category choice, both leaves, blocked and directional rules; no trail 61."
    }
  ]
};
  const animalIds = new Set(['LION','BEAR','FOX','FROG','FISH','GIRAFFE','ZEBRA','WHALE',
    'TURTLE','DOLPHIN','PENGUIN','SEAL','OWL','EAGLE']);
  const requiredWild = {
    34:['TREE'],35:['NEST'],36:['DOLPHIN','SEAL'],37:['WHALE','DOLPHIN'],38:['TURTLE'],
    39:['FROG'],40:['EAGLE','ROCK'],42:['LEAF'],43:['ZEBRA'],44:['LEAF'],45:['SEAL'],
    46:['CAVE'],48:['FROG','WATER'],49:['FISH'],50:['TURTLE','OCEAN'],51:['FOX'],
    52:['ZEBRA'],53:['DOLPHIN'],54:['NEST'],55:['PENGUIN','SNOW'],56:['NEST'],
    57:['OCEAN','TURTLE'],58:['CAVE'],59:['LEAF','FISH'],60:['FOREST','FROG'],
  };
  const arrowTargets = {52:'FOREST',53:'OCEAN',56:'OWL',58:'BEAR',60:'OWL'};
  const oneRoot = new Set([13,15,19,20,24,25,30]);
  const twoRoots = new Set([22,27,29]);
  const junctions = new Set([14,21,24,25,28,30]);
  const directions = new Set([18,20,25,28,29,30]);
  // Stage-local child-readable forms: earlier hand-authored stages stay intact.
  // Some are specific habitat examples (stream water, snowflakes, brown bear),
  // consistent with the Chinese stage design; they remain pending locale review.
  const chapterTwoForms = {
    ja: { OCEAN:'うみ', FOREST:'もり', WATER:'みず', FISH:'さかな', SNOW:'ゆき', LEAF:'はっぱ' },
    'zh-Hans': { WATER:'溪水', FISH:'鱼儿', SNOW:'雪花', BEAR:'棕熊' },
    ko: { OCEAN:'대양', FOREST:'나무숲', WATER:'냇물', SNOW:'눈송이', LEAF:'나뭇잎', BEAR:'불곰' },
  };
  for (const stage of data.stages) {
    const id=stage.id;
    stage.bridgeCount = id <= 30 ? (id < 16 ? 1 : 2) : 0;
    stage.wildcardCount = id <= 32 ? 0 : id <= 45 ? 1 : [51,52,54].includes(id) ? 1 : 2;
    stage.blockedCount = id <= 30 ? (twoRoots.has(id) ? 2 : Number(oneRoot.has(id))) : Number(/\bB1\b/.test(stage.rule));
    stage.oneWayCount = id <= 30 ? (id === 23 ? 2 : Number(directions.has(id))) : Number(/\bO1\b/.test(stage.rule));
    stage.hasJunction = junctions.has(id);
    stage.categoryOrder = id <= 30 ? null : /\bChoice\b/.test(stage.rule) ? 'Choice' : stage.rule.includes('N→A') ? 'N→A' : 'A→N';
    stage.requiredWild = requiredWild[id] || [];
    stage.designatedLeaves = [48,50,55,59,60].includes(id) ? 'different' : id === 57 ? 'same' : null;
    stage.oneWayTarget = arrowTargets[id] || null;
    stage.checkpoint = id % 5 === 0;
  }
  function graphemes(locale, value) {
    if (!data.locales.includes(locale)) throw new RangeError('Unsupported locale: ' + locale);
    return [...new Intl.Segmenter(locale,{granularity:'grapheme'}).segment(value.normalize('NFC'))].map(x=>x.segment);
  }
  function targets(locale, stageNumber) {
    const stage=data.stages.find(x=>x.id===stageNumber);
    if(!stage) throw new RangeError('Unsupported stage: '+stageNumber);
    if(!data.locales.includes(locale)) throw new RangeError('Unsupported locale: '+locale);
    return stage.wordIds.map((id,index)=>{
      const display=locale==='zh-Hant' && stage.zhHantTargets ? stage.zhHantTargets[index] :
        (stageNumber>=31&&chapterTwoForms[locale]?.[id])||data.lexicon[locale][id];
      return { id, display, category:animalIds.has(id)?'animal':'nature', tokens:graphemes(locale,display).filter(x=>!/\s/u.test(x)) };
    });
  }
  const SIZE = 6;
  function neighbors(index) {
    const x=index%SIZE, y=Math.floor(index/SIZE), out=[];
    for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) {
      if(!dx&&!dy)continue;
      if(x+dx>=0&&x+dx<SIZE&&y+dy>=0&&y+dy<SIZE)out.push((y+dy)*SIZE+x+dx);
    }
    return out;
  }
  const adjacency=Array.from({length:SIZE*SIZE},(_,i)=>neighbors(i));
  function crossing(paths) {
    const entries=[...paths];
    for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++) {
      const [leftId,left]=entries[i], [rightId,right]=entries[j];
      const shared=left.find(cell=>right.includes(cell));
      if(shared!==undefined)return {type:'cell',cell:shared,targets:[leftId,rightId]};
      for(let a=1;a<left.length;a++)for(let b=1;b<right.length;b++) {
        const p=left[a-1],q=left[a],r=right[b-1],s=right[b];
        const px=p%SIZE,py=Math.floor(p/SIZE),qx=q%SIZE,qy=Math.floor(q/SIZE);
        const rx=r%SIZE,ry=Math.floor(r/SIZE),sx=s%SIZE,sy=Math.floor(s/SIZE);
        if(Math.abs(px-qx)===1&&Math.abs(py-qy)===1&&Math.abs(rx-sx)===1&&Math.abs(ry-sy)===1&&
          px+qx===rx+sx&&py+qy===ry+sy)return {type:'crossing',edges:[[p,q],[r,s]],targets:[leftId,rightId]};
      }
    }
    return null;
  }
  function diagonal(path) {
    return path.some((cell,index)=>index>0&&Math.abs(cell%SIZE-path[index-1]%SIZE)===1&&
      Math.abs(Math.floor(cell/SIZE)-Math.floor(path[index-1]/SIZE))===1);
  }
  function rngFor(locale,stage,attempt) {
    let state=2166136261;
    for(const ch of `${locale}:${stage}:${attempt}`)state=Math.imul(state^ch.codePointAt(0),16777619)>>>0;
    return () => { state=(Math.imul(state,1664525)+1013904223)>>>0; return state/4294967296; };
  }
  function shuffle(list,random) {
    const result=list.slice();
    for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }
  function fillerFor(locale,used) {
    const chars = locale==='ja'?'あいうえおかきくけこさしすせそたちつてとなにぬねの':
      locale==='zh-Hans'?'天地花田光竹石鸟草山云雨月春秋冬':
      locale==='zh-Hant'?'天地花田光竹石鳥草山雲雨月春秋冬':
      locale==='ko'?'가나다라마바사아자차카타파하':
      locale==='hi'?'अआइईउऊऋएऐओऔकखगघङचछजझञ':
      locale==='ar'?'ابتثجحخدذرزسشصضطظعغفقكلمنهوي':
      locale==='ru'?'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯ':'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const options=graphemes(locale,chars).filter(char=>!used.has(char));
    return options.length?options:['◇'];
  }
  // Independent from placement: derive a legal route from the finished board.
  function findPath(board,tokens,{bridge=null,bridges=[],leaves=[],blocked=[],oneWays=[],requiredLeaf=null,requiredArrow=null,requiredCell=null,allowLeaves=leaves}={}) {
    const denied=new Set(blocked), bridgeSet=new Set(bridges), leafSet=new Set(leaves), allowed=new Set(allowLeaves);
    const arrows=new Map(oneWays.map(item=>[item.index,item.from]));
    const walk=(cell,pos,path,usedLeaf)=>{
      if(denied.has(cell)||path.includes(cell)||(bridgeSet.has(cell)&&cell!==bridge))return null;
      if(pos===0&&arrows.has(cell))return null;
      const leaf=leafSet.has(cell);
      if(leaf ? (!allowed.has(cell)||usedLeaf!==null) : board[cell]!==tokens[pos])return null;
      const nextPath=[...path,cell], nextLeaf=leaf?cell:usedLeaf;
      if(pos===tokens.length-1)return (requiredLeaf===null||nextLeaf===requiredLeaf)&&
        (requiredArrow===null||nextPath.slice(1).includes(requiredArrow))&&
        (requiredCell===null||nextPath.includes(requiredCell))?nextPath:null;
      for(const next of adjacency[cell]) {
        if(arrows.has(next)&&arrows.get(next)!==cell)continue;
        const found=walk(next,pos+1,nextPath,nextLeaf);if(found)return found;
      }
      return null;
    };
    for(let index=0;index<board.length;index++){const found=walk(index,0,[],null);if(found)return found;}
    return null;
  }
  function makeCandidate(locale,stage,items,random) {
    const board=Array(SIZE*SIZE).fill(null), paths=new Map();
    const later=stage.id>=36;
    const requested=later?(stage.id===47?['EAGLE','LEAF']:stage.requiredWild):[];
    const fixedLeaves=[], assignedLeaf=new Map();
    if(requested.length) {
      const requiredCount=stage.designatedLeaves==='different'||stage.id===47?2:1;
      fixedLeaves.push(...shuffle(Array.from({length:SIZE*SIZE},(_,i)=>i),random).slice(0,requiredCount));
      requested.forEach((id,index)=>assignedLeaf.set(id,fixedLeaves[requiredCount===1?0:index]));
      fixedLeaves.forEach(cell=>{board[cell]='?';});
    }
    // Long entries first; shared graphemes can reuse already occupied cells.
    const order=items.slice().sort((a,b)=>b.tokens.length-a.tokens.length||(a.id<b.id?-1:a.id>b.id?1:0));
    for(const item of order) {
      const anchor=assignedLeaf.get(item.id);
      if(anchor!==undefined) {
        const position=Math.floor(random()*item.tokens.length), trial=Array(item.tokens.length).fill(null);
        trial[position]=anchor;
        let complete=true;
        for(const [start,end,step] of [[position-1,-1,-1],[position+1,item.tokens.length,1]]) {
          for(let pos=start;pos!==end;pos+=step) {
            const near=trial[pos-step];
            const choices=adjacency[near].filter(cell=>!trial.includes(cell)&&
              (board[cell]===null||board[cell]===item.tokens[pos]));
            if(!choices.length){complete=false;break;}
            trial[pos]=choices[Math.floor(random()*choices.length)];
          }
          if(!complete)break;
        }
        if(!complete)return null;
        trial.forEach((cell,index)=>{if(cell!==anchor)board[cell]=item.tokens[index];});
        paths.set(item.id,trial);continue;
      }
      const starts=shuffle(Array.from({length:SIZE*SIZE},(_,i)=>i),random);
      let path=null;
      // Each path attempt is bounded; search resumes at the next complete candidate.
      for(const start of starts) {
        if(board[start]!==null&&board[start]!==item.tokens[0])continue;
        const trial=[start];let current=start;
        for(let pos=1;pos<item.tokens.length;pos++) {
          const options=adjacency[current].filter(i=>!trial.includes(i)&&(board[i]===null||board[i]===item.tokens[pos]));
          if(!options.length)break;
          current=options[Math.floor(random()*options.length)];trial.push(current);
        }
        if(trial.length===item.tokens.length){path=trial;break;}
      }
      if(!path)return null;
      path.forEach((cell,i)=>{board[cell]=item.tokens[i];});paths.set(item.id,path);
    }
    if(stage.hasJunction&&!crossing(paths))return null;
    if(stage.id===32&&!items.some(item=>diagonal(paths.get(item.id))))return null;
    const allUsed=new Set([...paths.values()].flat());
    const empty=shuffle(Array.from({length:SIZE*SIZE},(_,i)=>i).filter(i=>!allUsed.has(i)),random);
    const blocked=[];
    if(stage.blockedCount) {
      const eligible=stage.id===35?empty.filter(i=>[14,15,20,21].includes(i)):empty;
      if(eligible.length<stage.blockedCount)return null;
      blocked.push(...eligible.slice(0,stage.blockedCount));
    }
    const leaves=fixedLeaves.slice();
    const requiredLeafByTarget={};
    if(later&&requested.length) {
      if(stage.wildcardCount>leaves.length) {
        let possible=empty.filter(i=>!blocked.includes(i));
        if(stage.id===46) {
          const p=paths.get('CAVE'), firstLeaf=assignedLeaf.get('CAVE'), at=p.indexOf(firstLeaf);
          possible=possible.filter(cell=>(at===0||adjacency[p[at-1]].includes(cell))&&
            (at===p.length-1||adjacency[p[at+1]].includes(cell)));
        }
        if(!possible.length)return null;
        board[possible[0]]='?';leaves.push(possible[0]);
      }
      for(const word of requested)if(stage.wildcardCount===1||stage.designatedLeaves==='different'||stage.designatedLeaves==='same')
        requiredLeafByTarget[word]=assignedLeaf.get(word);
    } else if(stage.requiredWild.length) {
      const word=stage.requiredWild[0], path=paths.get(word);
      const exclusive=shuffle(path.filter(cell=>[...paths].every(([id,p])=>id===word||!p.includes(cell))),random);
      if(!exclusive.length)return null;
      const leaf=exclusive[0];board[leaf]='?';leaves.push(leaf);requiredLeafByTarget[word]=leaf;
    } else if(stage.wildcardCount) {
      // The optional leaf on 33 replaces an endpoint of a path, while the
      // original path remains available with no leaf.
      let placed=false;
      for(const item of shuffle(items,random)) {
        const p=paths.get(item.id);
        const possible=p.length===1?empty:adjacency[p[1]].filter(i=>empty.includes(i));
        const cell=possible.find(i=>!blocked.includes(i));
        if(cell!==undefined){board[cell]='?';leaves.push(cell);placed=true;break;}
      }
      if(!placed)return null;
    }
    const usedChars=new Set(items.flatMap(item=>item.tokens));
    const filler=fillerFor(locale,usedChars);
    board.forEach((value,i)=>{if(value===null)board[i]=filler[(i*7+stage.id)%filler.length];});
    const oneWays=[], arrowWords=new Map();
    if(stage.oneWayCount) {
      const source=stage.oneWayTarget?items.filter(item=>item.id===stage.oneWayTarget):items;
      const candidates=shuffle(source.flatMap(item=>paths.get(item.id).slice(1).map((cell,index)=>
        ({index:cell,from:paths.get(item.id)[index],word:item.id}))),random);
      for(const arrow of candidates) {
        if(oneWays.some(entry=>entry.index===arrow.index)||blocked.includes(arrow.index)||leaves.includes(arrow.index))continue;
        oneWays.push({index:arrow.index,from:arrow.from});arrowWords.set(arrow.index,arrow.word);
        if(oneWays.length===stage.oneWayCount)break;
      }
      if(oneWays.length!==stage.oneWayCount)return null;
    }
    const bridges=[];
    if(stage.bridgeCount===1) {
      const candidates=shuffle([...new Set([...paths.values()].flat())],random);
      for(const cell of candidates) {
        if(blocked.includes(cell)||leaves.includes(cell))continue;
        const necessary=items.some(item=>findPath(board,item.tokens,{bridges:[cell],bridge:cell,blocked,leaves,oneWays})&&
          !findPath(board,item.tokens,{bridges:[cell],bridge:null,blocked,leaves,oneWays}));
        if(necessary){bridges.push(cell);break;}
      }
      if(bridges.length!==stage.bridgeCount)return null;
    } else if(stage.bridgeCount===2) {
      // Both sites must be independently necessary, and every target must
      // remain reachable with at most one site open.
      const candidates=shuffle([...new Set([...paths.values()].flat())],random)
        .filter(cell=>!blocked.includes(cell)&&!leaves.includes(cell));
      let pair=null;
      for(let a=0;a<candidates.length&&!pair;a++)for(let b=a+1;b<candidates.length&&!pair;b++) {
        const sites=[candidates[a],candidates[b]], needed=[false,false];let all=true;
        for(const item of items) {
          const open=sites.map(bridge=>Boolean(findPath(board,item.tokens,{bridges:sites,bridge,blocked,leaves,oneWays})));
          if(!open.some(Boolean)){all=false;break;}
          if(open[0]&&!open[1])needed[0]=true;
          if(open[1]&&!open[0])needed[1]=true;
        }
        if(all&&needed.every(Boolean))pair=sites;
      }
      if(!pair)return null;bridges.push(...pair);
    }
    const resultTargets=[];
    for(const item of items) {
      const choices=bridges.length===2?bridges:[bridges.find(cell=>paths.get(item.id).includes(cell))??null];
      let path=null,bridge=null;
      const arrow=[...arrowWords].find(([,word])=>word===item.id)?.[0]??null;
      for(const selected of choices) {
        const candidate=findPath(board,item.tokens,{bridges,bridge:selected,leaves,blocked,oneWays,requiredArrow:arrow});
        if(candidate){path=candidate;bridge=selected;break;}
      }
      if(!path)return null;
      // Keep the authored candidate route when it remains legal, preserving
      // its actual geometric intersections and educational diagonal step.
      const authored=paths.get(item.id);
      const authoredLegal=authored.every((cell,index)=>!blocked.includes(cell)&&
        (!bridges.includes(cell)||cell===bridge)&&
        (index===0?!oneWays.some(arrow=>arrow.index===cell):!oneWays.some(arrow=>arrow.index===cell&&arrow.from!==authored[index-1]))&&
        (leaves.includes(cell)||board[cell]===item.tokens[index]));
      if(authoredLegal&&(!arrow||authored.slice(1).includes(arrow)))path=authored.slice();
      const options={bridges,bridge,leaves,blocked,oneWays};
      if(stage.requiredWild.includes(item.id)) {
        const leaf=assignedLeaf.get(item.id)??requiredLeafByTarget[item.id];
        if(findPath(board,item.tokens,{...options,allowLeaves:[]})||!findPath(board,item.tokens,{...options,requiredLeaf:leaf}))return null;
        if(requiredLeafByTarget[item.id]!==undefined && leaves.length>1 &&
          findPath(board,item.tokens,{...options,allowLeaves:leaves.filter(cell=>cell!==leaf)}))return null;
      }
      resultTargets.push({...item,path,bridge,leaf:path.find(cell=>leaves.includes(cell))??null});
    }
    if(stage.id===33&&!items.some(item=>findPath(board,item.tokens,{blocked,leaves,allowLeaves:[]})&&
      findPath(board,item.tokens,{blocked,leaves,requiredLeaf:leaves[0]})))return null;
    if(stage.id===46&&!leaves.every(leaf=>findPath(board,items.find(item=>item.id==='CAVE').tokens,{blocked,leaves,requiredLeaf:leaf,allowLeaves:[leaf]})))return null;
    if(stage.id===52&&findPath(board,items.find(item=>item.id==='FOREST').tokens,{blocked:[...blocked,...oneWays.map(x=>x.index)],leaves,oneWays}))return null;
    if(stage.id===40&&!resultTargets.some(({path})=>diagonal(path)))return null;
    // Each root blocks a real alternate route, rather than an unused filler.
    // Temporarily opening it must reveal a target path that crosses that cell.
    for(const root of blocked) {
      let witness=null;
      for(const target of shuffle(resultTargets,random)) {
        for(const glyph of shuffle([...new Set(target.tokens)],random)) {
          board[root]=glyph;
          const options={bridges,bridge:target.bridge,leaves,blocked:blocked.filter(cell=>cell!==root),oneWays,requiredCell:root};
          const path=findPath(board,target.tokens,options);
          if(path){witness={target:target.id,path};break;}
        }
        if(witness)break;
      }
      if(!witness)return null;
    }
    // A newly revealed root letter must not create an alternative bypass.
    for(const item of resultTargets) {
      const options={bridges,bridge:item.bridge,leaves,blocked,oneWays};
      if(stage.requiredWild.includes(item.id)) {
        const leaf=assignedLeaf.get(item.id)??requiredLeafByTarget[item.id];
        if(findPath(board,item.tokens,{...options,allowLeaves:[]})||!findPath(board,item.tokens,{...options,requiredLeaf:leaf}))return null;
        if(requiredLeafByTarget[item.id]!==undefined&&leaves.length>1&&
          findPath(board,item.tokens,{...options,allowLeaves:leaves.filter(cell=>cell!==leaf)}))return null;
      }
    }
    if(bridges.length)for(const bridge of bridges) {
      const necessary=resultTargets.some(item=>findPath(board,item.tokens,{bridges,bridge,blocked,leaves,oneWays})&&
        !findPath(board,item.tokens,{bridges,bridge:null,blocked,leaves,oneWays})&&
        (bridges.length===1||!findPath(board,item.tokens,{bridges,bridge:bridges.find(other=>other!==bridge),blocked,leaves,oneWays})));
      if(!necessary)return null;
    }
    // Check the actual returned paths, not merely the initial placement paths.
    const junction=stage.hasJunction?crossing(resultTargets.map(item=>[item.id,item.path])):null;
    if(stage.hasJunction&&!junction)return null;
    if(stage.id===32&&!resultTargets.some(({path})=>diagonal(path)))return null;
    if(oneWays.some(({index})=>!resultTargets.some(target=>target.path.slice(1).includes(index))))return null;
    return {id:stage.id,title:stage.title,size:SIZE,board,targets:resultTargets,bridges,wildcards:leaves,blocked,
      oneWays,categoryOrder:stage.categoryOrder,requiredLeafByTarget,junction};
  }
  function searchStage(locale, stageNumber, options={}) {
    const items=targets(locale,stageNumber), stage=data.stages.find(x=>x.id===stageNumber);
    if(stage.designatedLeaves==='different'&&stage.requiredWild.some(id=>items.find(item=>item.id===id).tokens.length===1)) {
      const error=new Error(`SINGLE_GRAPHEME_DESIGNATED_LEAF: stage ${stageNumber}/${locale} has a one-grapheme target and two interchangeable leaves`);
      error.code='SINGLE_GRAPHEME_DESIGNATED_LEAF';throw error;
    }
    if(stage.oneWayTarget&&items.find(item=>item.id===stage.oneWayTarget).tokens.length<2) {
      const error=new Error(`SINGLE_GRAPHEME_DIRECTION: stage ${stageNumber}/${locale} has no predecessor for its one-way target`);
      error.code='SINGLE_GRAPHEME_DIRECTION';throw error;
    }
    const first=options.checkpoint?.nextAttempt??0, count=options.maxAttempts??300;
    if(options.checkpoint&&(options.checkpoint.stage!==stageNumber||options.checkpoint.locale!==locale))throw new RangeError('Checkpoint belongs to another stage or locale');
    if(!Number.isSafeInteger(first)||first<0||!Number.isSafeInteger(count)||count<1||count>10000)throw new RangeError('Invalid search budget or checkpoint');
    for(let attempt=first;attempt<first+count;attempt++) {
      const found=makeCandidate(locale,stage,items,rngFor(locale,stageNumber,attempt));
      if(found)return {...found,search:{attempt,locale,stage:stageNumber}};
    }
    const error=new Error(`SEARCH_EXHAUSTED: stage ${stageNumber}/${locale}; resume at attempt ${first+count}`);
    error.code='SEARCH_EXHAUSTED';error.checkpoint={nextAttempt:first+count,locale,stage:stageNumber};throw error;
  }
  // Generated offline by searchStage; the player-facing builder only reads it.
  const fixtures = {"11/en":[["L","e","Z","G","N","s","B","I","e","W","t","e","R","t","r","M","r","o","H","O","o","w","x","f","X","E","L","S","l","G","N","U","B","I","P","W"],[[[23,17,22],22,null],[[20,21,28],null,null],[[13,14,8,1],null,null],[[23,17,16,11,5,10],null,null]],[22],[],[],[],{},null],"11/zh-Hant":[["狐","狸","山","天","鳥","貓","竹","月","田","雲","地","頭","冬","樹","春","光","鷹","森","山","天","鳥","秋","竹","林","田","雲","地","草","冬","石","春","光","雨","花","山","天"],[[[0,1],null,null],[[5,11,16],16,null],[[13],null,null],[[17,23],null,null]],[16],[],[],[],{},null],"11/zh-Hans":[["雨","花","山","天","鸟","秋","竹","月","田","云","地","树","冬","石","春","光","雨","花","鹰","天","鸟","林","森","月","头","云","地","草","冬","石","猫","光","雨","狐","狸","天"],[[[33,34],33,null],[[30,24,18],null,null],[[11],null,null],[[22,21],null,null]],[33],[],[],[],{},null],"11/ja":[["し","て","ネ","キ","そ","に","え","さ","つ","ツ","き","せ","な","う","こ","ち","ね","か","す","と","い","け","ウ","ぬ","お","し","森","あ","フ","ロ","木","え","さ","つ","の","ク"],[[[3,9,2],null,null],[[28,35,29,22],22,null],[[30],null,null],[[26],null,null]],[22],[],[],[],{},null],"11/ko":[["파","사","하","아","가","자","다","차","라","나","마","타","바","여","우","하","무","가","부","다","차","라","카","마","타","엉","파","사","하","아","가","숲","이","차","라","카"],[[[13,14],null,null],[[18,25,32],32,null],[[9,16],null,null],[[31],null,null]],[32],[],[],[],{},null],"11/es":[["r","o","Z","b","N","U","r","o","ú","W","D","K","z","h","F","á","r","A","H","s","V","b","J","Q","o","E","q","o","l","G","b","U","e","u","P","W"],[[[12,7,0,6,1],null,null],[[3,8,13,7],null,null],[[15,16,21,27,28],null,null],[[30,24,19,26,33,32],30,null]],[30],[],[],[],{},null],"11/pt-BR":[["L","S","Z","G","o","á","B","I","P","r","r","v","a","t","F","e","s","a","s","e","V","a","o","p","r","f","c","o","a","u","o","l","B","I","r","j"],[[[10,17,23,22,16,21],null,null],[[26,27,34,29,35,28],null,null],[[5,10,11,4,9,15],5,null],[[25,31,30,24,19,18,13,12],null,null]],[5],[],[],[],{},null],"11/fr":[["L","S","a","t","N","U","e","n","r","W","ê","f","r","Y","F","d","o","r","H","o","V","b","a","Q","u","b","e","r","r","G","N","U","i","h","P","W"],[[[12,6,7,2,8,15],null,null],[[33,32,25,19,24],19,null],[[22,28,21,27,26],null,null],[[11,16,17,10,3],null,null]],[19],[],[],[],{},null],"11/de":[["O","d","G","N","U","D","M","W","l","L","s","A","K","a","Z","J","h","Y","I","e","X","m","u","c","G","l","U","u","F","T","C","u","E","A","a","B"],[[[28,22,23,16,10],null,null],[[32,31,25,19],null,null],[[35,34,27,21],35,null],[[7,13,8,1],null,null]],[35],[],[],[],{},null],"11/it":[["L","S","f","G","N","U","r","o","o","r","D","K","b","e","e","t","a","A","l","O","s","l","J","Q","f","a","L","p","o","G","o","u","g","v","e","W"],[[[33,28,21,27,34],null,null],[[32,31,24,30],null,null],[[25,18,12,13,6,7],null,null],[[2,8,9,14,20,15,16],15,null]],[15],[],[],[],{},null],"11/ru":[["л","и","Щ","Г","К","С","д","с","Й","Р","с","Б","р","е","а","А","е","О","е","в","Ж","л","Ф","Ю","Е","М","о","Э","Д","а","Т","Щ","с","о","в","Ш"],[[[0,1,7,14],0,null],[[32,33,34,29],null,null],[[6,13,12,18,19,26],null,null],[[21,16,10],null,null]],[0],[],[],[],{},null],"11/hi":[["ख","ञ","ए","ङ","आ","ओ","छ","ई","क","जं","ग","घ","अ","ऐ","च","लो","म","ल","ऊ","ख","ड़","पे","ङ","ड़ी","ओ","छ","ई","क","उ","ऋ","घ","अ","ऐ","च","इ","ल्लू"],[[[15,16,23],null,null],[[28,35],null,null],[[21,20],null,null],[[9,10,17],9,null]],[9],[],[],[],{},null],"11/ar":[["ف","ح","غ","م","و","ب","خ","ط","ش","ا","ة","د","ظ","ج","ص","ب","ذ","ع","ر","ض","ه","ز","ث","ل","ط","ة","س","ك","د","ب","ت","ص","ن","ذ","ف","ح"],[[[22,17,23,29],17,null],[[5,4,3,10],null,null],[[8,13,18,25],null,null],[[2,9,15,10],null,null]],[17],[],[],[],{},null],"12/en":[["M","T","f","H","f","r","C","i","Q","X","o","w","S","h","s","g","a","B","p","P","W","D","e","t","o","n","d","T","A","r","O","V","C","J","Q","X"],[[[4,5,10,15],null,null],[[2,7,14,13],null,null],[[18,24,25,26],25,null],[[11,16,23,22,29],null,null]],[25],[],[],[],{},null],"12/zh-Hant":[["月","田","雲","地","草","魚","石","春","光","雨","蛙","山","天","鳥","秋","塘","月","青","雲","地","草","冬","池","春","光","雨","花","山","天","水","秋","竹","月","田","雲","地"],[[[17,10],null,null],[[5],null,null],[[22,15],22,null],[[29],null,null]],[22],[],[],[],{},null],"12/zh-Hans":[["月","田","云","地","草","青","石","春","光","雨","花","蛙","天","水","秋","池","塘","田","云","地","草","冬","石","春","光","雨","花","山","天","鸟","秋","鱼","月","田","云","地"],[[[5,11],null,null],[[31],31,null],[[15,16],null,null],[[13],null,null]],[31],[],[],[],{},null],"12/ja":[["す","魚","い","け","た","ぬ","お","し","て","あ","く","そ","に","水","さ","つ","の","き","せ","な","う","池","ち","ね","か","す","と","い","カ","エ","ぬ","お","し","て","ル","く"],[[[28,29,34],28,null],[[1],null,null],[[21],null,null],[[13],null,null]],[28],[],[],[],{},null],"12/ko":[["파","바","파","바","파","바","파","바","파","바","파","바","파","바","못","바","파","바","파","연","파","리","구","바","물","바","파","고","파","개","파","바","기","물","파","바"],[[[29,22,21],null,null],[[33,27,32],null,null],[[19,14],14,null],[[24],null,null]],[14],[],[],[],{},null],"12/es":[["M","e","A","e","O","V","C","s","Q","p","z","L","S","t","a","N","U","B","I","n","q","D","K","R","Y","n","u","T","g","u","a","r","a","e","a","a"],[[[31,32,25,30],null,null],[[9,3,10],null,null],[[1,7,13,14,19,20,26,33],14,null],[[34,28,29,35],null,null]],[14],[],[],[],{},null],"12/pt-BR":[["M","T","a","H","O","V","C","l","Q","g","E","L","S","p","o","e","U","B","I","e","x","a","K","R","á","i","a","T","ã","r","g","u","C","J","Q","X"],[[[29,28],28,null],[[13,19,25,20,15],null,null],[[7,2,9,14,21],null,null],[[24,30,31,26],null,null]],[28],[],[],[],{},null],"12/fr":[["u","o","n","o","a","e","C","i","e","u","s","L","S","r","l","o","p","s","é","g","l","e","i","R","n","t","M","T","A","H","a","V","C","J","Q","X"],[[[19,13,8,2,1,0,7,14,20,21],13,null],[[16,15,22,17,10,3,2],null,null],[[18,25,30,24,19],null,null],[[5,4,9],null,null]],[13],[],[],[],{},null],"12/de":[["T","V","D","L","S","h","J","e","Z","H","r","c","h","i","U","e","s","i","A","c","s","Y","a","F","V","D","L","s","c","W","Q","F","r","o","X","h"],[[[31,32,33,27,28,35],35,null],[[23,17,16,11,5],null,null],[[0,7,13,19,12],null,null],[[29,22,27,20,15,10],null,null]],[35],[],[],[],{},null],"12/it":[["M","T","o","p","r","n","C","n","Q","e","a","a","S","g","t","s","s","B","a","a","W","D","c","e","u","c","M","T","A","H","a","q","C","J","Q","X"],[[[4,11,5,10],null,null],[[3,9,16,22,23],23,null],[[15,14,19,13,7,2],null,null],[[30,25,31,24,18],null,null]],[23],[],[],[],{},null],"12/ru":[["М","р","ы","а","Л","в","у","г","я","б","Ш","о","ш","Р","Ч","л","И","д","к","А","З","О","Х","а","Ж","а","Ф","д","р","п","У","Э","Д","Л","у","Щ"],[[[15,8,7,6,12,18,25],null,null],[[1,2,9,3],null,null],[[29,28,34,27],null,null],[[5,11,17,23],17,null]],[17],[],[],[],{},null],"12/hi":[["ला","ता","ए","ङ","इ","ओ","ली","ब","ख","ञ","नी","घ","आ","छ","ढ","क","औ","पा","ऊ","म","में","ए","ङ","इ","ओ","ज","उ","ख","ञ","ऋ","घ","आ","ऐ","च","ई","औ"],[[[20,14,15],15,null],[[19,13,6],null,null],[[1,0,7],null,null],[[17,10],null,null]],[15],[],[],[],{},null],"12/ar":[["ق","ث","ص","ه","خ","غ","ت","ش","ن","ح","ظ","ي","ء","ع","ج","س","و","ذ","ق","ا","د","م","خ","غ","ت","ف","م","ة","ك","ب","ض","ل","ة","ك","ر","ذ"],[[[30,25,20,13],null,null],[[15,21,28,27],null,null],[[29,34,33,32],34,null],[[26,19,12],null,null]],[34],[],[],[],{},null],"13/en":[["N","f","B","I","P","f","D","a","e","Y","o","M","f","l","H","O","V","x","J","Q","X","c","L","S","a","r","N","k","o","r","e","b","D","K","R","Y"],[[[31,30,24,25],null,null],[[5,10,17],17,null],[[29,28,21,27],null,null],[[13,8,7,1],null,null]],[17],[],[12],[],{},null],"13/zh-Hant":[["秋","竹","春","光","月","田","雨","熊","雲","地","山","天","草","冬","鳥","秋","竹","春","光","月","子","雨","花","雲","地","山","天","葉","狸","石","秋","竹","春","熊","狐","岩"],[[[33],null,null],[[34,28],null,null],[[35,29],null,null],[[27,20],20,null]],[20],[],[7],[],{},null],"13/zh-Hans":[["秋","竹","春","光","月","熊","雨","花","熊","地","山","天","草","冬","岩","秋","子","春","光","石","田","雨","花","叶","地","山","天","草","冬","狸","秋","竹","春","光","狐","田"],[[[8],null,null],[[34,29],34,null],[[14,19],null,null],[[23,16],null,null]],[34],[],[5],[],{},null],"13/ja":[["せ","な","う","岩","ち","ね","か","す","と","岩","け","た","ぬ","お","し","て","キ","く","そ","に","え","ツ","つ","の","き","葉","ネ","ク","こ","ち","ね","か","す","と","マ","け"],[[[27,34],null,null],[[16,21,26],null,null],[[9],9,null],[[25],null,null]],[9],[],[3],[],{},null],"13/ko":[["곰","자","나","차","다","카","라","타","마","파","잎","하","아","여","우","나","위","다","우","라","타","마","파","바","하","아","가","자","나","차","다","카","라","타","마","파"],[[[0],0,null],[[13,14],null,null],[[23,16],null,null],[[10],null,null]],[0],[],[18],[],{},null],"13/es":[["N","a","a","o","r","W","D","j","a","Y","r","M","o","c","H","O","z","o","h","o","X","E","L","S","r","G","N","U","B","I","P","W","D","o","s","o"],[[[35,34,33],null,null],[[16,17,10,4,3],16,null],[[24,19,13,8],null,null],[[18,12,7,2],null,null]],[16],[],[1],[],{},null],"13/pt-BR":[["N","o","B","a","P","W","s","h","a","Y","s","M","l","r","H","o","V","C","u","o","p","E","L","S","f","a","N","U","o","r","P","r","r","a","h","c"],[[[18,13,6,1],null,null],[[31,25,20,15,10,3],null,null],[[29,28,35,34,33],28,null],[[24,19,12,7,8],null,null]],[28],[],[32],[],{},null],"13/fr":[["N","e","B","I","P","e","l","K","R","r","n","r","s","l","i","e","f","a","o","r","X","u","h","r","u","u","N","c","d","r","P","W","D","K","o","Y"],[[[18,24,19,12],18,null],[[11,5,10,17,23,28],null,null],[[29,34,27,22,15,9],null,null],[[16,15,21,14,13,6,1],null,null]],[18],[],[25],[],{},null],"13/de":[["P","W","E","h","s","A","s","l","F","c","u","F","C","B","e","t","u","O","V","l","L","t","Z","I","P","W","a","M","T","A","J","Q","X","r","ä","B"],[[[35,34,33],null,null],[[11,10,9,3,4],null,null],[[8,14,7,6],null,null],[[13,19,26,21,15],19,null]],[19],[],[16],[],{},null],"13/it":[["c","c","i","a","f","W","o","i","l","g","o","M","r","a","v","O","V","f","J","Q","o","E","L","S","Z","G","r","l","p","I","o","s","D","K","e","Y"],[[[20,26,31,30],30,null],[[14,20,27,28,34],null,null],[[12,6,1,0,7,13],null,null],[[4,10,9,8,2,3],null,null]],[30],[],[17],[],{},null],"13/ru":[["Н","и","Ю","в","д","е","л","с","к","е","с","м","К","а","а","и","д","т","Ч","Б","м","ь","л","А","З","О","н","е","Ж","Н","Ф","ь","Е","М","У","Э"],[[[11,5,4,3,9,16,21],null,null],[[6,1,7,14],null,null],[[8,14,20,27,26,31],27,null],[[22,15,10,17],null,null]],[27],[],[13],[],{},null],"13/hi":[["प","अ","ए","घ","आ","ऐ","त्ता","इ","ओ","छ","ई","औ","ज","न","क","झ","ऊ","ख","च","ट्टा","लू","भा","ए","घ","आ","लो","ङ","भा","ओ","छ","ड़ी","म","ज","उ","क","झ"],[[[21,20],null,null],[[25,31,30],null,null],[[18,19,13],null,null],[[0,6],0,null]],[0],[],[27],[],{},null],"13/ar":[["ك","ج","ط","ه","ب","ف","ت","ض","ن","ل","غ","ا","ة","خ","ص","و","ع","ث","ر","ة","ر","ه","ز","ف","ت","ق","ن","ذ","ب","ا","ش","ة","ح","ظ","د","س"],[[[34,28],null,null],[[17,16,9,4],9,null],[[14,13,18,12],null,null],[[15,20,25,19],null,null]],[9],[],[31],[],{},null],"14/en":[["t","r","C","J","Q","X","e","L","S","Z","G","N","e","B","I","P","W","D","e","R","s","n","M","T","l","t","O","e","l","w","Q","g","a","L","S","o"],[[[35,29,28],null,null],[[27,32,31,24,18],null,null],[[21,27,20,25],null,null],[[0,1,6,12],1,null]],[1],[],[],[],{},{"type":"cell","cell":27,"targets":["EAGLE","NEST"]}],"14/zh-Hant":[["冬","石","秋","竹","春","光","月","田","雨","花","雲","地","山","天","鷹","冬","石","秋","鳥","老","頭","貓","田","雨","花","巢","地","山","天","樹","冬","石","秋","竹","春","光"],[[[21,20,14],null,null],[[19,14],null,null],[[18,25],18,null],[[29],null,null]],[18],[],[],[],{},{"type":"cell","cell":14,"targets":["OWL","EAGLE"]}],"14/zh-Hans":[["冬","石","秋","竹","春","光","月","田","雨","花","云","地","山","天","树","冬","石","秋","竹","春","光","鹰","老","雨","花","云","头","山","巢","草","冬","石","秋","猫","鸟","光"],[[[33,26,21],null,null],[[22,21],null,null],[[34,28],28,null],[[14],null,null]],[28],[],[],[],{},{"type":"cell","cell":21,"targets":["OWL","EAGLE"]}],"14/ja":[["そ","に","え","フ","ク","ワ","き","せ","な","う","シ","ロ","ね","か","す","と","い","ウ","た","ぬ","お","木","て","あ","巣","そ","に","え","さ","つ","の","き","せ","な","う","こ"],[[[3,4,11,17],null,null],[[5,10],10,null],[[24],null,null],[[21],null,null]],[10],[],[],[],{},{"type":"crossing","edges":[[4,11],[5,10]],"targets":["OWL","EAGLE"]}],"14/ko":[["다","이","부","나","독","타","바","파","엉","수","무","가","자","다","리","둥","카","마","타","바","파","지","하","아","가","자","다","차","라","카","마","타","바","파","사","하"],[[[2,8,1],null,null],[[4,9,14],14,null],[[15,21],null,null],[[3,10],null,null]],[14],[],[],[],{},{"type":"crossing","edges":[[4,9],[3,10]],"targets":["EAGLE","TREE"]}],"14/es":[["O","V","C","J","Q","X","E","L","S","Z","G","N","b","o","b","i","u","á","ú","l","l","r","á","g","h","o","O","a","C","J","Q","X","d","i","n","Z"],[[[12,18,24,25],null,null],[[17,23,16,15,20,27],15,null],[[34,33,32,25],null,null],[[22,21,14,13,19],null,null]],[15],[],[],[],{},{"type":"cell","cell":25,"targets":["OWL","NEST"]}],"14/pt-BR":[["n","V","n","J","Q","X","E","i","h","Z","i","N","U","B","I","o","u","a","j","r","Y","e","r","g","a","u","o","V","á","o","Q","X","E","c","v","r"],[[[33,26,19,25,18,24],null,null],[[28,23,16,10,17],null,null],[[0,7,2,8,15],0,null],[[28,35,34,29,22,21],null,null]],[0],[],[],[],{},{"type":"cell","cell":28,"targets":["EAGLE","TREE"]}],"14/fr":[["O","V","C","J","e","X","E","L","S","Z","l","N","U","B","I","g","i","D","K","R","Y","u","e","a","a","H","o","r","n","i","Q","r","b","i","h","d"],[[[34,33,32,26,21],null,null],[[23,16,15,10,4],null,null],[[28,29,35],28,null],[[24,31,32,27,22],null,null]],[28],[],[],[],{},{"type":"cell","cell":32,"targets":["OWL","TREE"]}],"14/de":[["l","e","J","R","Y","I","E","u","H","P","A","G","O","V","F","d","l","D","L","N","m","K","e","B","J","e","s","u","a","r","H","P","t","G","O","V"],[[[6,7,0,1],7,null],[[10,15,16,22,29],null,null],[[19,25,26,32],null,null],[[23,28,27,20],null,null]],[7],[],[],[],{},{"type":"crossing","edges":[[22,29],[23,28]],"targets":["EAGLE","TREE"]}],"14/it":[["g","u","C","n","i","X","E","L","f","o","d","N","U","B","a","o","W","D","a","l","Y","F","M","T","a","l","i","e","r","J","q","u","b","o","S","Z"],[[[0,1,8,15],null,null],[[24,30,31,26,19,14],26,null],[[3,4,10,9],null,null],[[18,25,32,27,28,33],null,null]],[26],[],[],[],{},{"type":"crossing","edges":[[31,26],[25,32]],"targets":["EAGLE","TREE"]}],"14/ru":[["с","Х","Я","Ж","Н","Ф","Ю","о","М","о","д","л","в","Т","Щ","з","н","ё","а","В","Й","е","р","г","И","П","Ц","е","е","о","Х","Я","Ж","р","д","в"],[[[0,7,12,18],null,null],[[29,22,17,11],null,null],[[23,16,21,15,10,9],10,null],[[34,27,33,28,35,29],null,null]],[10],[],[],[],{},{"type":"crossing","edges":[[22,17],[23,16]],"targets":["EAGLE","NEST"]}],"14/hi":[["ङ","आ","घों","ड़","ला","औ","छ","ई","पे","स","ऊ","ख","झ","ऋ","ग","ञ","ए","उ","अ","ऐ","ङ","आ","का","च","इ","उ","छ","ई","ब","ज","ऊ","ख","ल्लू","ऋ","ग","ञ"],[[[25,32],null,null],[[17,22,28],null,null],[[2,9,4],2,null],[[8,3],null,null]],[2],[],[],[],{},{"type":"crossing","edges":[[2,9],[8,3]],"targets":["NEST","TREE"]}],"14/ar":[["ك","ح","ب","ب","ر","ش","ي","ز","و","ة","ا","ج","خ","ط","ه","م","ق","ت","س","ك","ح","ة","ع","د","ظ","ي","ز","ف","ث","ع","ل","خ","ط","ه","ش","غ"],[[[2,8,15,21],null,null],[[22,16,10,3],null,null],[[29,34],34,null],[[5,11,4,9],null,null]],[34],[],[],[],{},{"type":"crossing","edges":[[10,3],[4,9]],"targets":["EAGLE","TREE"]}],"15/en":[["a","e","D","K","R","Y","s","r","b","A","H","O","e","t","x","o","f","E","o","r","l","e","N","U","f","I","f","a","f","K","R","Y","F","M","T","A"],[[[8,1,0,7],8,null],[[16,15,14],null,null],[[24,18,19,12,6,13],null,null],[[20,21,27,28],null,null]],[8],[],[26],[],{},null],"15/zh-Hant":[["冬","石","春","光","雨","花","子","森","鳥","秋","竹","熊","林","葉","地","草","冬","石","春","光","雨","熊","山","天","鳥","秋","竹","狸","田","雲","地","草","冬","石","狐","光"],[[[21],null,null],[[34,27],27,null],[[7,12],null,null],[[13,6],null,null]],[27],[],[11],[],{},null],"15/zh-Hans":[["冬","石","春","光","雨","花","山","天","鸟","子","竹","月","田","云","叶","草","冬","石","春","熊","熊","花","山","森","鸟","秋","竹","月","田","林","狐","狸","冬","石","春","光"],[[[19],19,null],[[30,31],null,null],[[23,29],null,null],[[14,9],null,null]],[19],[],[20],[],{},null],"15/ja":[["た","ぬ","お","し","て","あ","く","そ","に","え","さ","つ","の","き","ネ","森","う","こ","ち","ツ","か","す","と","葉","け","た","キ","葉","し","て","あ","く","そ","に","ク","マ"],[[[34,35],null,null],[[26,19,14],19,null],[[15],null,null],[[27],null,null]],[19],[],[23],[],{},null],"15/ko":[["여","우","나","곰","나","자","나","자","나","자","나","자","나","자","잎","잎","나","자","나","자","나","숲","나","자","나","자","나","자","나","자","나","자","나","자","나","자"],[[[3],null,null],[[0,1],null,null],[[21],21,null],[[15],null,null]],[21],[],[14],[],{},null],"15/es":[["o","s","o","a","o","Y","e","u","o","h","j","O","b","o","q","r","r","o","b","S","s","G","z","U","B","I","P","W","D","K","R","Y","F","M","T","A"],[[[0,1,2],null,null],[[22,17,16,15,8],null,null],[[18,13,20,14,7,6],null,null],[[9,4,10,3],10,null]],[10],[],[12],[],{},null],"15/pt-BR":[["P","o","l","a","s","o","F","M","f","h","r","u","V","C","J","r","f","E","o","p","a","G","l","U","s","p","P","o","r","s","a","Y","F","a","t","e"],[[[11,10,4,5],null,null],[[15,20,25,18,24,30],null,null],[[16,22,27,28,35,29,34,33],null,null],[[8,1,2,9,3],1,null]],[1],[],[19],[],{},null],"15/fr":[["P","a","n","K","o","u","F","r","e","ê","s","r","d","f","r","Q","t","E","L","o","e","f","e","U","B","I","i","u","D","K","e","l","l","M","T","A"],[[[4,5,11,10],10,null],[[14,8,2,1,7,12],null,null],[[13,19,14,9,16],null,null],[[21,20,27,26,32,31,30],null,null]],[10],[],[22],[],{},null],"15/de":[["t","t","W","P","X","G","s","a","l","d","S","A","ä","h","l","H","O","V","r","B","c","B","K","R","Z","I","u","X","G","N","U","D","F","F","A","J"],[[[19,12,18],null,null],[[33,26,20,13,6],26,null],[[2,7,8,9],null,null],[[21,14,7,0,1],null,null]],[26],[],[32],[],{},null],"15/it":[["P","W","D","K","f","o","F","s","o","A","e","r","V","o","r","s","a","s","L","o","Z","G","l","t","B","l","v","g","D","i","R","p","e","f","o","a"],[[[13,14,7,8],null,null],[[26,19,25,31,32],26,null],[[4,5,11,10,17,23,16],null,null],[[33,34,27,22,29,35],null,null]],[26],[],[15],[],{},null],"15/ru":[["П","с","л","а","с","и","Я","Ж","е","Ф","Ю","л","д","У","е","Д","Л","Т","е","в","К","д","Ш","а","Й","м","ь","Б","с","П","Ц","А","З","т","и","л"],[[[25,18,12,19,14,21,26],null,null],[[11,5,4,3],11,null],[[2,8,1],null,null],[[35,34,28,33],null,null]],[11],[],[23],[],{},null],"15/hi":[["च","इ","ओ","छ","ई","ल","लू","उ","क","झ","ऊ","ग","भा","ऋ","घ","अ","जं","ङ","आ","त्ता","च","म","लो","छ","प","औ","ज","उ","ड़ी","म","ऊ","ख","ञ","ऋ","घ","अ"],[[[12,6],null,null],[[22,21,28],28,null],[[16,11,5],null,null],[[24,19],null,null]],[28],[],[29],[],{},null],"15/ar":[["ن","ذ","و","ت","ش","م","خ","ط","ي","ر","ك","ح","ث","ل","ق","ف","ج","غ","ب","ع","ة","ت","ا","م","خ","ط","د","س","ب","ح","ض","ه","ب","ب","ج","ة"],[[[26,32],null,null],[[12,19,13,18],null,null],[[17,22,28,35],null,null],[[2,9,14,20],9,null]],[9],[],[33],[],{},null],"16/en":[["Q","X","E","L","S","n","G","N","U","B","I","o","e","f","K","R","g","i","M","f","A","s","l","r","a","i","b","z","s","a","r","g","e","r","a","B"],[[[22,17,11,5],22,null],[[27,32,26,33,34],26,null],[[31,25,30,24,19,13,12],26,null],[[16,23,29,28,21],26,null]],[26,22],[],[],[],{},null],"16/zh-Hant":[["地","山","天","斑","馬","石","子","獅","春","光","月","田","雨","花","雲","地","山","天","鳥","鹿","石","秋","竹","春","頸","月","田","雨","花","雲","地","長","天","鳥","草","石"],[[[7,6],34,null],[[3,4],34,null],[[31,24,19],24,null],[[34],34,null]],[34,24],[],[],[],{},null],"16/zh-Hans":[["地","山","天","鸟","冬","石","秋","竹","春","光","月","田","雨","花","云","马","山","天","鸟","冬","石","秋","斑","长","光","草","田","雨","颈","鹿","地","山","子","狮","冬","石"],[[[33,32],22,null],[[22,15],22,null],[[23,28,29],28,null],[[25],22,null]],[22,28],[],[],[],{},null],"16/ja":[["マ","ウ","か","す","と","い","け","マ","ぬ","お","し","て","あ","シ","ン","に","え","ラ","つ","キ","リ","せ","な","イ","こ","ち","草","か","オ","と","い","け","た","ン","お","し"],[[[17,23,28,33],19,null],[[13,7,1,0],13,null],[[19,20,14],19,null],[[26],19,null]],[19,13],[],[],[],{},null],"16/ko":[["마","자","아","나","카","라","사","룩","가","차","다","타","말","얼","아","나","카","라","파","바","가","차","다","타","마","하","린","풀","카","라","파","바","기","차","다","타"],[[[6,1],1,null],[[13,7,12],26,null],[[32,26],26,null],[[27],26,null]],[26,1],[],[],[],{},null],"16/es":[["Q","n","E","L","j","Z","l","ó","e","i","I","f","e","i","r","r","a","a","M","b","h","H","O","c","a","J","Q","X","e","a","S","Z","G","N","b","r"],[[[6,12,7,1],11,null],[[23,28,34,35,29],11,null],[[4,9,15,16,11,17],11,null],[[20,13,8,14,19,24],13,null]],[11,13],[],[],[],{},null],"16/pt-BR":[["Q","X","b","r","g","f","G","N","e","i","a","a","W","D","z","r","Y","F","M","T","A","l","m","a","C","J","o","e","a","L","S","Z","G","ã","g","r"],[[[21,27,33,26],10,null],[[14,8,2,3,10],10,null],[[4,9,15,10,5,11],10,null],[[34,35,28,22,23],23,null]],[10,23],[],[],[],{},null],"16/fr":[["l","i","E","L","S","Z","o","e","U","B","I","P","n","b","K","R","Y","F","r","z","r","e","O","V","e","è","b","X","r","L","h","e","f","a","i","g"],[[[0,1,6,12],31,null],[[19,25,26,20,21],25,null],[[35,34,28,33,32,31],31,null],[[30,24,18,13,7],31,null]],[31,25],[],[],[],{},null],"16/de":[["S","A","I","Q","X","F","a","s","D","M","T","B","r","G","e","ö","L","W","E","a","w","i","K","S","r","e","G","r","a","f","b","Z","M","T","f","e"],[[[16,15,20,14],21,null],[[31,25,30,24,19],21,null],[[26,21,27,28,34,29,35],21,null],[[13,12,6,7],13,null]],[21,13],[],[],[],{},null],"16/it":[["Q","z","E","L","S","Z","e","i","g","B","I","P","r","b","K","e","l","F","a","f","a","b","o","V","C","J","f","r","E","n","S","Z","a","N","e","B"],[[[16,15,22,29,34],16,null],[[1,6,13,12,18],6,null],[[8,7,12,18,19,26,32],16,null],[[34,27,21,20],16,null]],[16,6],[],[],[],{},null],"16/ru":[["Р","Ч","Б","И","П","Ц","А","ж","и","р","а","Ж","Н","Ф","б","ф","М","в","Э","е","Л","р","Щ","а","з","С","в","В","а","р","л","е","И","П","Ц","т"],[[[30,31,26],30,null],[[24,19,14,21,28],30,null],[[7,8,9,10,15],10,null],[[35,29,23,17,10],10,null]],[30,10],[],[],[],{},null],"16/hi":[["च","इ","ओ","च","इ","ओ","च","इ","ओ","च","इ","ओ","च","इ","ओ","च","इ","ओ","च","स","र","फ़","इ","ओ","च","घा","ब्रा","शे","रा","ओ","च","ज़े","ओ","च","इ","जि"],[[[27,20],27,null],[[31,26],21,null],[[35,28,21],21,null],[[25,19],21,null]],[21,27],[],[],[],{},null],"16/ar":[["ث","ظ","ت","ط","د","ض","ز","ر","ل","س","ش","ي","ق","ا","أ","ث","ح","ت","ش","ه","ف","ن","ص","و","ع","ب","ة","ق","ح","ر","ث","ظ","ت","ط","م","ا"],[[[14,9,4],28,null],[[28,34,35,29,23,16,10,11],28,null],[[6,7,13,20,26],20,null],[[24,18,25],28,null]],[28,20],[],[],[],{},null],"17/en":[["R","e","F","M","T","A","s","O","a","C","J","Q","X","E","L","l","Z","G","N","s","B","o","c","e","h","K","l","e","l","a","e","l","H","w","h","n"],[[[6,1,8,15],15,null],[[33,34,29,28,27],29,null],[[21,22,23,29,35],29,null],[[19,24,30,31,26],29,null]],[29,15],[],[],[],{},null],"17/zh-Hant":[["地","草","冬","石","春","光","雨","花","山","魚","鯨","秋","竹","月","田","貝","地","草","豹","海","春","殼","雨","花","山","天","鳥","秋","洋","月","田","雲","地","草","海","石"],[[[19,18],34,null],[[10,9],10,null],[[34,28],34,null],[[15,21],34,null]],[34,10],[],[],[],{},null],"17/zh-Hans":[["地","豹","海","石","春","光","雨","花","贝","壳","鸟","秋","竹","海","洋","鲸","鱼","草","冬","石","春","光","雨","花","山","天","鸟","秋","竹","月","田","云","地","草","冬","石"],[[[2,1],1,null],[[15,16],1,null],[[13,14],1,null],[[8,9],8,null]],[1,8],[],[],[],{},null],"17/ja":[["つ","ア","ザ","ラ","な","う","こ","ち","ね","か","シ","と","い","け","貝","ラ","お","し","て","あ","ジ","殻","海","え","さ","ク","の","き","せ","な","う","こ","ち","ね","か","す"],[[[1,2,3,10],21,null],[[25,20,15],21,null],[[22],22,null],[[14,21],21,null]],[21,22],[],[],[],{},null],"17/ko":[["조","가","차","라","타","사","개","자","나","카","마","파","껍","데","래","라","타","사","하","자","기","고","마","바","아","가","차","라","다","사","하","범","물","카","마","파"],[[[32,31],12,null],[[21,14],21,null],[[23,28],12,null],[[0,6,12,13,20],12,null]],[12,21],[],[],[],{},null],"17/es":[["a","b","e","a","T","A","l","l","V","n","a","Q","h","a","L","S","f","c","c","U","B","I","o","o","n","o","é","a","n","M","T","c","o","c","V","C"],[[[16,23,17,10],13,null],[[1,0,6,7,2,9,3],0,null],[[32,33,26,27,28,22],13,null],[[31,25,24,18,12,13],13,null]],[13,0],[],[],[],{},null],"17/pt-BR":[["R","Y","a","M","T","A","o","f","a","i","a","h","c","b","l","e","c","n","a","U","a","n","c","o","D","e","c","Y","o","M","T","o","H","O","V","C"],[[[7,6,12,18],7,null],[[13,8,14,15,9,2],7,null],[[31,26,25,20,21,28],7,null],[[22,23,17,16,11,10],16,null]],[7,16],[],[],[],{},null],"17/fr":[["i","e","l","M","é","c","H","n","a","C","o","a","e","q","u","b","Z","n","g","o","l","e","c","o","h","a","l","Y","q","M","T","p","H","i","u","C"],[[[31,24,19,13,14,21],31,null],[[15,8,2,1,0,7,12],10,null],[[10,5,4,11,17],10,null],[[22,23,28,34,33,26,20,25,18,12],10,null]],[10,31],[],[],[],{},null],"17/de":[["U","C","J","T","B","I","l","A","H","n","Z","O","e","a","W","N","a","z","h","c","D","K","R","e","J","T","s","I","o","b","H","M","u","G","e","b"],[[[22,28,35,29,34],22,null],[[14,13,6],22,null],[[11,17,23,16,9],16,null],[[31,32,26,19,18,12,6],22,null]],[22,16],[],[],[],{},null],"17/it":[["n","e","a","b","T","A","c","a","l","o","J","e","X","o","l","n","a","c","n","g","i","f","o","o","i","c","a","Y","F","M","h","A","H","O","V","C"],[[[21,22,17,16],15,null],[[3,2,8,1,0,7],2,null],[[23,17,11,16,15,9],15,null],[[6,13,18,25,30,24,19,14,20,26],15,null]],[15,2],[],[],[],{},null],"17/ru":[["С","Ш","В","Й","к","р","Б","И","а","к","а","у","О","Х","т","о","ш","и","Ю","ю","л","к","т","к","Л","Т","е","Г","е","С","Ш","В","н","ь","н","а"],[[[14,19,20,26,32,33],14,null],[[23,17,22],14,null],[[15,21,28,35,34],34,null],[[5,10,4,11,16,9,8],14,null]],[14,34],[],[],[],{},null],"17/hi":[["ज","उ","ल","झ","ऊ","ख","ल","ऋ","घ","सी","ए","ङ","व्हे","ऐ","च","प","सी","छ","म","औ","ज","उ","क","झ","ऊ","हा","ञ","ऋ","घ","अ","सा","ग","र","ऐ","च","इ"],[[[9,2],12,null],[[12,6],12,null],[[18,25,30,31,32],32,null],[[16,15],12,null]],[12,32],[],[],[],{},null],"17/ar":[["ه","ح","ة","ف","ش","ن","و","ع","م","د","ل","خ","ت","ح","ز","ص","ج","ض","ة","ط","ي","ث","ش","ن","ق","م","ب","س","ل","خ","ف","ا","ز","ك","ج","ض"],[[[30,24,25,18],2,null],[[1,6,12],2,null],[[8,13,20,19],19,null],[[15,9,3,2],2,null]],[2,19],[],[],[],{},null],"18/en":[["S","Z","G","w","U","B","g","a","e","i","K","R","l","o","M","l","n","d","e","s","w","J","Q","X","e","L","t","Z","G","N","n","B","I","P","W","D"],[[[8,7,6,12,18],17,null],[[13,20,15],13,null],[[3,9,16,17],17,null],[[30,24,19,26],17,null]],[17,13],[],[],[{"index":16,"from":9}],{},null],"18/zh-Hant":[["風","鷹","花","鷹","地","貓","老","草","冬","石","頭","竹","春","鳥","月","田","雨","花","巢","地","山","天","草","冬","石","秋","竹","春","光","月","田","雨","花","雲","地","山"],[[[6,1],6,null],[[5,10,3],6,null],[[0],6,null],[[13,18],13,null]],[6,13],[],[],[{"index":3,"from":10}],{},null],"18/zh-Hans":[["田","雨","花","云","地","山","天","鹰","冬","石","风","竹","老","光","月","田","雨","花","云","地","山","天","草","冬","石","秋","鸟","巢","猫","鹰","田","雨","花","云","地","头"],[[[12,7],12,null],[[28,35,29],12,null],[[10],12,null],[[26,27],26,null]],[12,26],[],[],[{"index":29,"from":35}],{},null],"18/ja":[["風","ク","く","巣","に","え","ロ","つ","フ","き","せ","な","う","ウ","ち","ね","か","す","と","い","け","シ","ぬ","お","し","て","ワ","く","そ","に","え","さ","つ","の","き","せ"],[[[26,21],3,null],[[8,1,6,13],3,null],[[0],0,null],[[3],3,null]],[3,0],[],[],[{"index":1,"from":8}],{},null],"18/ko":[["사","리","수","독","자","나","이","바","카","라","타","마","파","엉","람","아","가","자","나","지","부","카","라","타","둥","파","사","하","아","가","자","나","차","다","카","라"],[[[3,2,1],1,null],[[20,13,6],14,null],[[7,14],14,null],[[24,19],14,null]],[14,1],[],[],[{"index":2,"from":3}],{},null],"18/es":[["u","g","a","b","ú","o","i","l","á","D","K","h","Y","v","M","T","A","H","i","o","C","J","Q","X","e","i","t","o","G","N","n","n","d","P","W","D"],[[[8,1,0,6,7,2],11,null],[[3,4,11,5],11,null],[[13,18,24,31,26,19],13,null],[[30,25,32,27],11,null]],[11,13],[],[],[{"index":25,"from":30}],{},null],"18/pt-BR":[["S","r","o","n","h","o","I","u","c","n","i","R","j","F","t","o","A","H","O","a","C","n","e","X","a","u","S","á","v","N","U","i","g","P","W","D"],[[[27,32,25,31,24],24,null],[[8,2,1,7,12,19],12,null],[[28,22,21,14,15],24,null],[[9,10,3,4,5],24,null]],[24,12],[],[],[{"index":2,"from":8}],{},null],"18/fr":[["S","Z","G","N","U","B","t","g","e","a","h","R","l","n","i","v","i","H","n","e","C","J","b","X","i","d","S","u","o","N","U","B","I","P","W","D"],[[[9,14,7,12,19],16,null],[[10,16,22,28,27],16,null],[[15,8,13,6],8,null],[[18,24,25],16,null]],[16,8],[],[],[{"index":7,"from":14}],{},null],"18/de":[["V","F","e","N","e","t","T","C","K","l","B","s","n","i","E","u","Y","H","d","W","l","O","A","F","M","r","e","d","T","C","K","S","B","J","R","Z"],[[[22,27,20,26,25],20,null],[[14,15,9,2],20,null],[[19,13,12,18],20,null],[[3,4,11,5],4,null]],[20,4],[],[],[{"index":4,"from":3}],{},null],"18/it":[["S","Z","G","N","U","a","o","P","W","D","K","l","Y","t","e","T","q","i","O","n","u","v","u","a","n","o","g","f","o","N","d","i","I","P","W","D"],[[[23,16,22,17,11,5],30,null],[[26,20,27,28],26,null],[[21,14,19,13,6],30,null],[[24,31,30,25],30,null]],[30,26],[],[],[{"index":11,"from":17}],{},null],"18/ru":[["с","в","а","о","ё","Ш","о","Й","о","Ч","р","л","П","Ц","д","в","т","Х","Я","Ж","Н","з","е","е","М","У","е","Д","Л","р","Щ","г","н","С","Ш","В"],[[[3,10,4,11],10,null],[[0,6,1,2],6,null],[[15,22,16,23,29],10,null],[[31,32,26,21,14,8],10,null]],[10,6],[],[],[{"index":14,"from":21}],{},null],"18/hi":[["झ","ऋ","ग","ञ","ए","का","अ","ऐ","ङ","आ","उ","ब","इ","औ","छ","ल्लू","क","ज","ऊ","ख","झ","ऋ","ग","ञ","ए","घ","अ","ऐ","स","वा","ओ","च","इ","ला","ह","घों"],[[[10,5,11],11,null],[[10,15],11,null],[[34,29],34,null],[[35,28,33],11,null]],[11,34],[],[],[{"index":15,"from":10}],{},null],"18/ar":[["ي","ا","ح","ب","ط","ه","ر","ق","ا","ش","ن","ذ","ب","م","ع","ع","د","ظ","و","س","ة","خ","ط","ه","ز","ف","ج","ض","ن","ذ","غ","ث","ص","ل","د","ظ"],[[[14,7,8,3],8,null],[[12,18,13,20],20,null],[[6,0,1,2],20,null],[[15,9],20,null]],[20,8],[],[],[{"index":2,"from":1}],{},null],"19/en":[["d","A","H","O","V","r","J","n","X","g","o","f","Z","o","p","U","g","I","f","s","h","K","t","Y","F","i","T","A","e","s","V","C","J","f","o","r"],[[[11,5,10,16],5,null],[[18,25,19,20],5,null],[[33,34,35,28,29,22],34,null],[[14,13,7,0],5,null]],[5,34],[],[9],[],{},null],"19/zh-Hant":[["田","雲","地","草","冬","魚","春","光","雨","花","山","天","魚","秋","竹","月","田","雲","森","林","冬","石","春","光","池","花","山","天","鳥","秋","塘","月","田","雲","青","蛙"],[[[34,35],18,null],[[5],5,null],[[18,19],18,null],[[24,30],18,null]],[18,5],[],[12],[],{},null],"19/zh-Hans":[["田","云","地","草","冬","石","春","光","雨","花","山","天","鸟","秋","竹","蛙","青","云","林","塘","冬","青","春","光","森","池","山","天","鸟","秋","竹","月","田","鱼","地","草"],[[[16,15],15,null],[[33],15,null],[[24,18],15,null],[[25,19],25,null]],[15,25],[],[21],[],{},null],"19/ja":[["と","い","け","カ","ぬ","お","魚","て","ル","エ","そ","に","え","さ","つ","の","き","魚","な","う","こ","ち","ね","か","池","と","い","け","た","ぬ","お","し","て","あ","く","森"],[[[3,9,8],3,null],[[17],17,null],[[35],3,null],[[24],3,null]],[3,17],[],[6],[],{},null],"19/ko":[["숲","파","바","파","연","못","바","파","바","파","바","파","바","개","구","파","바","파","바","파","리","파","바","파","바","고","바","파","바","파","바","기","물","숲","바","파"],[[[13,14,20],14,null],[[32,25,31],25,null],[[0],14,null],[[4,5],14,null]],[14,25],[],[33],[],{},null],"19/es":[["T","A","a","n","V","C","J","t","X","e","q","e","s","e","z","U","u","I","a","n","a","e","R","Y","b","r","p","q","H","O","V","o","s","e","u","E"],[[[25,20,19,18],7,null],[[26,21,14],7,null],[[24,31,32,27,34,33],32,null],[[13,12,7,2,3,10,16,9],7,null]],[7,32],[],[11],[],{},null],"19/pt-BR":[["T","a","o","l","a","C","J","a","a","g","p","e","Z","t","N","U","i","ã","s","e","l","K","x","r","r","o","T","f","e","O","V","C","J","Q","X","E"],[[[23,17],20,null],[[10,11,16,22,28],28,null],[[27,20,25,24,19,18,13,8],20,null],[[3,4,9,2,1],20,null]],[20,28],[],[7],[],{},null],"19/fr":[["o","A","H","g","é","C","n","u","i","g","n","t","Z","e","N","l","l","a","r","W","D","n","o","e","f","g","o","t","p","i","o","r","ê","s","s","E"],[[[25,18,13,6,0,7,8,15,16,23],23,null],[[28,22,29,34,33,26,21],31,null],[[24,30,31,32,27],31,null],[[4,11,17,10,9],31,null]],[31,23],[],[3],[],{},null],"19/de":[["V","F","L","S","d","l","r","s","H","O","X","a","M","o","c","K","W","A","T","e","Y","h","N","V","i","c","h","h","i","Q","Z","H","c","s","F","F"],[[[1,6,13,7,14,21],7,null],[[34,28,33,32,27],32,null],[[16,11,5,4],32,null],[[18,19,24,25,26],32,null]],[32,7],[],[35],[],{},null],"19/it":[["T","t","g","n","a","r","s","n","a","r","o","f","p","o","N","a","e","s","e","s","D","e","t","Y","F","M","c","A","a","O","V","C","J","Q","X","E"],[[[5,4,3,8],4,null],[[12,18,19,26,21],4,null],[[11,10,9,16,17,22,15],15,null],[[6,1,8,2,7,13],4,null]],[4,15],[],[28],[],{},null],"19/ru":[["У","Э","Д","у","г","Щ","Г","К","л","я","ш","к","Р","Ч","п","л","П","а","А","З","р","с","Я","ы","Н","у","д","е","р","б","Э","Д","л","Т","Щ","а"],[[[15,9,4,3,10,11,17],4,null],[[28,23,29,35],4,null],[[32,27,21],4,null],[[14,20,25,26],26,null]],[4,26],[],[8],[],{},null],"19/hi":[["में","ऐ","ज","छ","ली","अ","ढ","च","म","ता","ञ","ऋ","क","इ","ला","ब","ऊ","घ","आ","ल","ग","जं","ख","अ","ए","ल","ई","औ","ञ","ऋ","ङ","इ","ओ","झ","ऊ","घ"],[[[0,6,12],8,null],[[8,3,4],8,null],[[21,20,19],8,null],[[9,14,15],15,null]],[8,15],[],[25],[],{},null],"19/ar":[["ج","ط","ي","ز","ن","غ","م","ك","ش","ه","خ","ا","س","ة","ة","ذ","ب","ج","ط","ب","ز","ة","ح","ظ","ت","ش","ر","ك","ض","ع","ص","و","ذ","ل","ف","د"],[[[28,34,35,29],26,null],[[12,6,7,13],13,null],[[5,11,16,21],26,null],[[19,26,27,21],26,null]],[26,13],[],[14],[],{},null],"20/en":[["s","B","I","a","r","D","K","u","Y","b","M","T","o","n","O","e","C","J","c","r","z","L","z","Z","k","n","l","B","I","P","W","i","o","R","Y","F"],[[[26,31,32,25],25,null],[[20,15,9,4,3],7,null],[[0,7,13],7,null],[[19,12,18,24],7,null]],[7,25],[],[22],[{"index":24,"from":18}],{},null],"20/zh-Hant":[["獅","子","光","月","田","雨","花","太","地","斑","馬","草","陽","岩","秋","岩","春","光","月","田","石","花","雲","地","山","天","草","冬","鳥","秋","竹","春","光","月","田","雨"],[[[0,1],12,null],[[9,10],12,null],[[7,12],12,null],[[15,20],20,null]],[12,20],[],[13],[{"index":12,"from":7}],{},null],"20/zh-Hans":[["竹","春","光","月","田","雨","岩","石","地","山","天","草","石","鸟","秋","竹","春","光","月","子","雨","花","云","地","马","天","狮","冬","鸟","秋","斑","阳","太","月","田","雨"],[[[26,19],26,null],[[30,24],6,null],[[32,31],6,null],[[6,7],6,null]],[6,26],[],[12],[{"index":19,"from":26}],{},null],"20/ja":[["な","う","こ","岩","ね","か","す","と","い","け","た","ぬ","お","岩","て","あ","ウ","マ","ラ","イ","さ","つ","シ","マ","オ","ン","う","こ","ち","陽","か","す","と","い","太","た"],[[[18,19,24,25],19,null],[[22,23,16,17],19,null],[[34,29],34,null],[[13],19,null]],[19,34],[],[3],[{"index":24,"from":19}],{},null],"20/ko":[["말","아","나","타","위","가","카","룩","하","차","다","바","아","얼","타","마","가","카","라","하","차","해","파","아","나","해","마","가","사","라","하","차","다","파","자","나"],[[[28,34],34,null],[[13,7,0],0,null],[[21],0,null],[[11,4],0,null]],[0,34],[],[25],[{"index":0,"from":7}],{},null],"20/es":[["r","B","I","P","l","o","o","o","a","F","M","s","a","c","O","V","C","J","b","r","c","L","S","Z","l","e","n","B","I","P","e","ó","K","R","Y","F"],[[[24,30,31,26],7,null],[[20,25,18,19,12],25,null],[[11,5,4],7,null],[[0,7,13,8],7,null]],[7,25],[],[6],[{"index":5,"from":11}],{},null],"20/pt-BR":[["U","B","I","P","W","D","K","R","Y","a","h","T","A","o","ã","V","o","c","Q","a","e","e","r","r","r","b","U","z","l","P","s","o","l","R","Y","F"],[[[28,21,14,13],16,null],[[27,20,25,24,19],27,null],[[30,31,32],16,null],[[22,16,17,10,9],16,null]],[16,27],[],[23],[{"index":17,"from":16}],{},null],"20/fr":[["U","è","I","i","W","D","b","z","e","l","l","T","A","r","O","l","i","n","Q","e","E","L","o","s","G","r","U","B","I","r","W","r","e","h","c","o"],[[[10,16,22,17],22,null],[[7,1,6,13,19],6,null],[[23,22,15,8,3,9],22,null],[[29,35,34,33,32,25],22,null]],[22,6],[],[31],[{"index":25,"from":32}],{},null],"20/de":[["X","F","F","W","E","N","V","e","M","r","b","Z","l","B","a","R","e","L","s","Y","n","n","w","ö","O","W","E","e","o","D","M","U","C","K","S","B"],[[[17,23,22,27],17,null],[[11,16,10,9,14],17,null],[[34,28,21,20,27],17,null],[[2,7,12,18],12,null]],[17,12],[],[1],[{"index":28,"from":34}],{},null],"20/it":[["U","a","I","P","l","D","r","o","i","F","o","e","c","c","O","a","n","J","Q","X","l","L","a","e","G","N","o","e","b","r","W","s","K","z","e","F"],[[[4,11,10,16,23],10,null],[[33,34,28,29,22],10,null],[[31,26,20,27],10,null],[[6,7,12,13,8,15],15,null]],[10,15],[],[1],[{"index":7,"from":6}],{},null],"20/ru":[["Ф","Ю","Е","з","а","к","Д","з","е","м","л","К","С","б","р","а","е","в","Б","И","е","Ц","А","н","О","Х","с","ц","ь","Ф","Ю","Е","о","л","н","Д"],[[[10,16,17],26,null],[[7,8,13,14,15],7,null],[[26,32,33,34,27,20],26,null],[[5,4,9,16,23,28],26,null]],[26,7],[],[3],[{"index":17,"from":16}],{},null],"20/hi":[["आ","ऐ","ङ","ज","र","झ","ऊ","ख","अ","शे","सू","इ","ओ","छ","ज़े","ब्रा","र","ऋ","ग","आ","ऐ","ङ","ई","औ","झ","ऊ","ख","न","ए","घ","इ","ओ","च","ट्टा","न","ञ"],[[[9,16],16,null],[[14,15],4,null],[[10,4,3],4,null],[[32,33,27],4,null]],[4,16],[],[34],[{"index":4,"from":10}],{},null],"20/ar":[["ج","غ","م","ط","م","ش","ر","ا","ح","س","ز","ق","و","ص","ه","ض","ك","ج","ح","ي","خ","ل","ذ","ف","ش","ظ","س","ر","ق","ث","ع","د","ة","أ","ة","غ"],[[[33,26,31],31,null],[[8,2,7,6,12,18,24,19],6,null],[[5,4,9],6,null],[[13,20,27,32],6,null]],[6,31],[],[34],[{"index":19,"from":24}],{},null],"21/en":[["V","C","J","g","r","a","L","S","Z","s","s","t","B","I","P","l","r","u","R","Y","F","t","e","a","H","O","g","f","l","f","X","E","o","r","e","G"],[[[11,17,16,21,28,34],3,null],[[27,33,32,26],3,null],[[15,22,23,29],22,null],[[3,4,5,10,9],3,null]],[3,22],[],[],[],{},{"type":"crossing","edges":[[16,21],[15,22]],"targets":["TURTLE","LEAF"]}],"21/zh-Hant":[["石","秋","竹","春","光","月","田","草","葉","雲","地","山","天","子","冬","石","秋","竹","春","光","月","田","雨","花","雲","地","山","天","蛙","龜","石","秋","竹","春","海","青"],[[[34,29],29,null],[[35,28],35,null],[[8,13],35,null],[[7],35,null]],[35,29],[],[],[],{},{"type":"crossing","edges":[[34,29],[35,28]],"targets":["TURTLE","FROG"]}],"21/zh-Hans":[["石","秋","竹","春","光","月","田","雨","花","云","地","山","天","鸟","草","石","秋","竹","春","光","青","田","雨","花","云","叶","海","蛙","鸟","冬","石","龟","子","春","光","月"],[[[26,31],26,null],[[20,27],25,null],[[25,32],25,null],[[14],25,null]],[25,26],[],[],[],{},{"type":"crossing","edges":[[26,31],[25,32]],"targets":["TURTLE","LEAF"]}],"21/ja":[["に","草","さ","つ","の","き","せ","な","葉","こ","ち","ね","か","す","と","い","け","た","ぬ","お","し","ミ","ル","く","そ","に","ガ","エ","ウ","の","き","メ","カ","う","こ","ち"],[[[28,21,26,31],28,null],[[32,27,22],27,null],[[8],27,null],[[1],27,null]],[27,28],[],[],[],{},{"type":"crossing","edges":[[28,21],[27,22]],"targets":["TURTLE","FROG"]}],"21/ko":[["타","사","하","자","바","개","마","파","아","가","구","다","타","사","하","북","거","리","마","파","아","가","차","풀","타","사","하","자","나","카","마","파","아","가","잎","라"],[[[4,11,16,15],4,null],[[5,10,17],10,null],[[34],10,null],[[23],10,null]],[10,4],[],[],[],{},{"type":"crossing","edges":[[4,11],[5,10]],"targets":["TURTLE","FROG"]}],"21/es":[["V","h","J","h","n","a","o","j","Z","i","a","r","a","I","P","W","e","b","R","Y","o","t","r","A","a","O","r","t","m","a","n","i","r","a","u","g"],[[[21,20,26,27,34,35,29,28,33,32,31,30,24],27,null],[[11,10,4,5],1,null],[[1,6,7,12],1,null],[[3,9,16,22,17,10],1,null]],[1,27],[],[],[],{},{"type":"cell","cell":10,"targets":["FROG","GRASS"]}],"21/pt-BR":[["V","m","t","Q","l","E","L","a","a","o","f","h","r","I","ã","r","g","a","R","t","a","M","T","A","g","r","m","r","n","a","u","a","L","a","i","h"],[[[2,7,12,19,20,25,30,24,31,26,33,27,34,28,35,29],33,null],[[15,14],33,null],[[10,9,4,11,17],10,null],[[16,15,8,1,7],33,null]],[33,10],[],[],[],{},{"type":"cell","cell":7,"targets":["TURTLE","GRASS"]}],"21/fr":[["e","g","J","Q","X","E","n","r","Z","e","b","U","i","o","P","r","h","f","u","l","l","m","e","u","r","o","u","e","l","i","t","t","e","d","e","l"],[[[30,25,24,31,26,32,33,27,21,22,15],9,null],[[1,7,0,6,13,18,12,19,20,27],9,null],[[17,22,23,29,28,35,34],29,null],[[16,22,15,10,9],9,null]],[9,29],[],[],[],{},{"type":"cell","cell":27,"targets":["TURTLE","FROG"]}],"21/de":[["k","r","R","t","t","a","ö","d","B","a","r","s","t","l","N","l","h","G","e","i","c","c","M","J","R","h","s","s","r","e","F","r","o","e","e","D"],[[[22,29,34,28,33,26,27,20,25,19,13,7,0,1,6,12,18],34,null],[[30,31,32,27,21,16],3,null],[[8,15,9,3,4],3,null],[[17,10,5,11],3,null]],[3,34],[],[],[],{},{"type":"cell","cell":27,"targets":["TURTLE","FROG"]}],"21/it":[["V","l","i","a","X","E","g","o","a","G","r","u","f","n","P","a","g","a","t","a","i","t","a","m","H","O","r","r","n","r","X","e","b","a","a","G"],[[[18,19,26,21,15,10,11,16,17,23,22,27,20,13,8],18,null],[[29,22,28,34],18,null],[[12,7,6,1,2,3],18,null],[[31,26,32,33],31,null]],[18,31],[],[],[],{},{"type":"cell","cell":22,"targets":["TURTLE","FROG"]}],"21/ru":[["а","а","Ж","Н","Ф","Ю","в","р","с","а","к","ш","о","м","т","и","у","я","р","к","а","л","л","г","с","я","е","е","а","х","Я","ч","р","п","а","Е"],[[[13,12,18,24,19,20,25,31,26,32,27,33,28,29,34],20,null],[[22,17,23,16,11,10,9],11,null],[[21,15,8,14],20,null],[[14,7,0,6,1],20,null]],[20,11],[],[],[],{},{"type":"cell","cell":14,"targets":["LEAF","GRASS"]}],"21/hi":[["ई","औ","ज","क","मु","स","ए","ङ","छु","द्री","छ","उ","ख","झ","ढ","आ","अ","ऐ","च","ई","क","में","ऊ","ग","ञ","स","त्ता","इ","ओ","छ","उ","प","घा","ऋ","घ","अ"],[[[5,4,9,3,8,15],5,null],[[21,14,20],5,null],[[31,26],31,null],[[32,25],5,null]],[5,31],[],[],[],{},{"type":"crossing","edges":[[31,26],[32,25]],"targets":["LEAF","GRASS"]}],"21/ar":[["ف","د","ط","ت","ط","ت","ض","ع","ط","ت","ط","ت","ط","ت","ق","ت","ط","ت","ب","ر","س","ة","ف","ا","و","ش","ل","ح","ة","ت","ع","ة","ي","ر","ح","ب"],[[[20,26,27,22,23,28,35,34,33,32,31],31,null],[[6,0,1,7],31,null],[[24,19,14,21],19,null],[[30,25,18],31,null]],[31,19],[],[],[],{},{"type":"crossing","edges":[[24,19],[25,18]],"targets":["LEAF","GRASS"]}],"22/en":[["c","D","K","R","o","l","v","a","c","H","O","w","e","J","Q","X","E","L","S","f","G","N","U","d","I","o","W","D","n","d","Y","x","M","w","i","H"],[[[4,11,5],11,null],[[19,25,31],12,null],[[0,7,6,12],12,null],[[33,34,28,29],12,null]],[12,11],[],[23,8],[],{},null],"22/zh-Hant":[["鳥","冬","石","秋","貓","春","光","月","田","雨","頭","雲","風","草","天","鳥","冬","鷹","秋","竹","春","光","月","田","雨","狸","狐","地","草","風","鳥","冬","狸","洞","山","春"],[[[4,10,17],17,null],[[26,32],17,null],[[34,33],34,null],[[29],17,null]],[17,34],[],[12,25],[],{},null],"22/zh-Hans":[["头","猫","石","秋","竹","春","光","鹰","山","雨","花","云","地","山","洞","鸟","冬","石","秋","竹","春","风","月","田","雨","花","云","地","草","天","风","冬","石","狐","狸","春"],[[[1,0,7],0,null],[[33,34],33,null],[[8,14],0,null],[[21],0,null]],[0,33],[],[30,13],[],{},null],"22/ja":[["風","お","し","て","あ","く","そ","風","え","さ","つ","の","キ","せ","洞","う","こ","ち","ツ","ウ","す","窟","い","け","ネ","ロ","ク","風","て","あ","く","そ","に","フ","さ","つ"],[[[33,26,25,19],33,null],[[12,18,24],18,null],[[14,21],33,null],[[27],33,null]],[33,18],[],[0,7],[],{},null],"22/ko":[["우","이","이","마","파","사","여","아","엉","자","나","차","다","카","라","부","마","파","사","하","동","가","바","나","차","다","카","굴","바","람","파","사","하","아","가","자"],[[[15,8,1],1,null],[[6,0],1,null],[[20,27],20,null],[[28,29],1,null]],[1,20],[],[2,22],[],{},null],"22/es":[["t","o","K","R","o","o","n","i","A","o","r","V","C","e","v","r","E","L","S","z","o","N","u","c","o","h","b","e","K","R","Y","F","ú","a","v","H"],[[[26,32,25,24],4,null],[[19,20,15,10,4],4,null],[[23,22,27,34,33],4,null],[[14,7,13,6,0,1],13,null]],[4,13],[],[9,5],[],{},null],"22/pt-BR":[["v","D","n","R","a","j","v","e","t","o","u","r","r","J","Q","X","o","c","e","n","a","N","U","a","v","a","c","r","a","s","c","F","M","p","o","H"],[[[17,16,11,10,5,4],27,null],[[27,28,33,34,29,23],27,null],[[26,25,24,18,12,19,20],18,null],[[0,7,2,8,9],27,null]],[27,18],[],[30,6],[],{},null],"22/fr":[["W","e","r","R","Y","h","n","d","e","t","i","b","r","a","t","r","o","b","S","Z","g","N","u","o","I","P","W","D","t","R","Y","F","M","v","e","n"],[[[5,10,17,16,22],17,null],[[2,1,6,13,12,7],14,null],[[20,15,16,9,14,8],14,null],[[33,34,35,28],14,null]],[14,17],[],[11,23],[],{},null],"22/de":[["A","K","R","Z","l","u","Y","c","u","X","e","E","s","h","F","U","l","H","T","B","L","S","h","ö","R","Z","d","Q","d","n","P","X","G","n","i","W"],[[[11,5,4,10],34,null],[[14,8,7,13,12],8,null],[[17,23,22,16,10],34,null],[[35,34,33,28],34,null]],[34,8],[],[29,26],[],{},null],"22/it":[["W","f","o","f","Y","F","M","g","u","H","O","V","C","J","g","X","v","e","S","e","G","g","r","n","I","o","p","o","t","R","v","l","M","t","A","a"],[[[7,8,1,2],33,null],[[30,25,31,26,19],26,null],[[21,22,27,33,28,35],33,null],[[16,17,23,28,27],33,null]],[33,26],[],[3,14],[],{},null],"22/ru":[["Ц","л","и","с","Х","Я","Ж","Н","щ","л","а","М","в","п","е","е","р","Щ","т","е","С","а","В","Й","е","Ч","Б","И","а","с","р","р","О","Х","о","в"],[[[29,34,35,28],9,null],[[9,2,3,10],9,null],[[13,14,8,15,16,21],16,null],[[12,19,18,24,31],9,null]],[9,16],[],[1,30],[],{},null],"22/hi":[["इ","औ","छ","ई","क","उ","लो","म","ड़ी","ऋ","ग","ल्लू","ए","घ","अ","ऐ","ङ","उ","ओ","गु","फा","औ","छ","ई","क","गु","ऊ","वा","झ","ऋ","ग","ञ","ए","ह","अ","ऐ"],[[[5,11],5,null],[[6,7,8],27,null],[[19,20],27,null],[[33,27],27,null]],[27,5],[],[17,25],[],{},null],"22/ar":[["ش","ه","ك","ق","ز","غ","ذ","ف","د","ب","خ","ث","ج","ص","ح","ح","ل","ع","ق","ز","غ","ا","ر","د","ط","خ","و","ج","ي","ت","ة","م","ب","ق","ز","ر"],[[[32,26,31,30],30,null],[[11,17,16,9],30,null],[[2,1,7],30,null],[[22,28,21,15],15,null]],[30,15],[],[35,14],[],{},null],"23/en":[["X","E","s","S","Z","G","N","U","n","I","P","W","w","o","R","Y","F","a","T","c","e","O","e","l","g","n","i","p","L","s","u","i","n","U","B","I"],[[[27,20,25,24,30,31,32],13,null],[[29,22,17,23],13,null],[[2,8,13,12],13,null],[[26,19,20],19,null]],[13,19],[],[],[{"index":12,"from":13},{"index":8,"from":2}],{},null],"23/zh-Hant":[["鳥","秋","冰","月","田","雲","地","草","企","鵝","春","光","雨","花","山","天","鳥","秋","竹","月","田","雲","地","豹","冬","石","雪","光","海","花","山","天","鳥","秋","竹","月"],[[[8,9],9,null],[[28,23],28,null],[[26],9,null],[[2],9,null]],[9,28],[],[],[{"index":9,"from":8},{"index":23,"from":28}],{},null],"23/zh-Hans":[["鸟","秋","竹","月","田","云","地","草","冬","雪","春","光","雨","花","山","天","鸟","秋","竹","月","鹅","云","地","冰","冬","企","春","光","豹","花","山","天","鸟","秋","竹","海"],[[[25,20],20,null],[[35,28],28,null],[[9],20,null],[[23],20,null]],[20,28],[],[],[{"index":20,"from":25},{"index":28,"from":35}],{},null],"23/ja":[["ね","か","す","と","雪","け","ン","ぬ","ン","し","て","あ","ザ","ギ","シ","ペ","さ","つ","ア","ラ","氷","な","う","こ","ち","ね","か","す","と","い","け","た","ぬ","お","し","て"],[[[15,8,13,6],15,null],[[18,12,19,14],19,null],[[4],19,null],[[20],19,null]],[19,15],[],[],[{"index":8,"from":15},{"index":13,"from":8}],{},null],"23/ko":[["차","다","차","다","차","눈","차","다","차","다","차","다","차","다","차","다","차","다","귄","다","차","다","차","다","차","펭","음","범","차","다","차","다","얼","물","차","다"],[[[25,18],32,null],[[33,27],27,null],[[5],32,null],[[32,26],32,null]],[32,27],[],[],[{"index":18,"from":25},{"index":27,"from":33}],{},null],"23/es":[["X","E","L","e","Z","G","i","U","l","I","i","W","p","n","o","Y","h","o","n","i","g","O","f","c","e","ü","i","E","L","a","v","e","N","n","o","I"],[[[12,6,13,20,25,26,33,34],24,null],[[22,17,23,29],24,null],[[18,19,24,30,31],24,null],[[16,10,3,8,14],8,null]],[24,8],[],[],[{"index":26,"from":25},{"index":34,"from":33}],{},null],"23/pt-BR":[["X","E","L","o","l","e","N","U","B","I","P","g","D","K","R","Y","v","M","T","A","f","e","m","e","a","o","X","p","n","i","Z","c","i","n","g","u"],[[[27,32,33,34,35,29,22],29,null],[[20,25,31,24],21,null],[[28,23,16,21],21,null],[[11,5,4,3],21,null]],[21,29],[],[],[{"index":5,"from":11},{"index":4,"from":5}],{},null],"23/fr":[["X","E","L","S","Z","o","N","U","l","I","t","h","D","a","R","g","c","n","c","e","H","e","a","e","J","e","g","m","h","u","Z","i","n","p","o","q"],[[[27,22,17,16,11,5,10],5,null],[[33,28,34,35,29,23],5,null],[[32,25,31,26,21],25,null],[[15,8,13,18,19],5,null]],[5,25],[],[],[{"index":25,"from":32},{"index":26,"from":31}],{},null],"23/de":[["B","J","T","g","i","P","Z","R","O","n","u","n","o","e","e","W","D","i","b","C","K","n","B","J","b","e","I","h","Z","H","O","S","c","E","i","s"],[[[5,4,9,3,10,17,11],9,null],[[7,12,18,24,25],9,null],[[31,32,27,21,14,13],9,null],[[33,34,35],34,null]],[9,34],[],[],[{"index":14,"from":21},{"index":3,"from":9}],{},null],"23/it":[["X","p","L","S","n","G","i","U","e","e","P","W","D","n","v","i","n","M","T","g","u","c","a","o","J","h","f","c","i","S","g","i","a","o","B","o"],[[[1,6,13,19,20,15,16,23],15,null],[[26,33,27,22],15,null],[[4,9,14,8],15,null],[[30,25,31,32,27,21,28,35],32,null]],[15,32],[],[],[{"index":33,"from":26},{"index":20,"from":19}],{},null],"23/ru":[["Ч","Б","И","П","г","А","З","О","Х","Я","н","е","Ф","Ю","т","М","с","Э","Д","п","ю","л","е","л","н","и","н","н","ё","Ч","и","в","г","ь","д","З"],[[[19,25,26,32,31,30,24],4,null],[[14,20,21,22,27,33],27,null],[[16,10,11,4],4,null],[[23,28,34],4,null]],[4,27],[],[],[{"index":31,"from":32},{"index":32,"from":26}],{},null],"23/hi":[["ए","घ","र्फ़","ब","छ","ऋ","ग","अ","ल","च","ऊ","ख","ञ","सी","ङ","उ","नी","ज","ए","घ","ई","पा","मा","ऋ","ग","इ","न","आ","हु","ख","ञ","ऐ","गु","पें","क","झ"],[[[33,32,25,26],25,null],[[13,8],25,null],[[3,2],2,null],[[17,22,28,27,21,16],25,null]],[25,2],[],[],[{"index":25,"from":32},{"index":32,"from":33}],{},null],"23/ar":[["س","ك","خ","ظ","ث","ل","م","ق","د","ت","ص","ج","ة","غ","ف","ي","و","س","ك","خ","ظ","ا","ل","ن","ق","ط","ب","ص","ج","ز","ي","ر","ض","و","س","ك"],[[[26,25,31,30,24],28,null],[[14,7,6,12],7,null],[[4,5,11],28,null],[[28,22,15,8],28,null]],[28,7],[],[],[{"index":5,"from":4},{"index":15,"from":22}],{},null],"24/en":[["Y","F","M","T","A","H","k","V","C","n","Q","X","E","c","S","Z","o","l","w","o","w","a","i","D","r","i","Y","r","e","z","d","n","O","b","C","J"],[[[17,22,16,9],30,null],[[29,28,33,27,21],29,null],[[24,19,13,6],30,null],[[18,25,31,30],30,null]],[30,29],[],[20],[],{},{"type":"crossing","edges":[[24,19],[18,25]],"targets":["ROCK","WIND"]}],"24/zh-Hant":[["斑","石","風","天","風","冬","岩","馬","竹","春","光","月","田","雨","花","雲","地","山","天","草","冬","鳥","秋","竹","春","光","月","田","獅","花","雲","地","山","天","草","子"],[[[28,35],6,null],[[0,7],6,null],[[6,1],6,null],[[4],4,null]],[6,4],[],[2],[],{},{"type":"crossing","edges":[[0,7],[6,1]],"targets":["ZEBRA","ROCK"]}],"24/zh-Hans":[["云","地","山","天","草","冬","鸟","秋","竹","春","光","月","田","雨","花","云","马","子","风","草","风","鸟","狮","斑","春","光","月","田","石","花","云","地","山","天","岩","冬"],[[[22,17],17,null],[[23,16],16,null],[[34,28],17,null],[[20],17,null]],[17,16],[],[18],[],{},{"type":"crossing","edges":[[22,17],[23,16]],"targets":["LION","ZEBRA"]}],"24/ja":[["の","き","せ","ウ","マ","ラ","ち","ね","か","マ","イ","シ","け","た","風","オ","ン","て","あ","く","そ","に","え","さ","つ","の","岩","せ","な","う","風","ち","ね","か","す","と"],[[[5,10,15,16],26,null],[[11,4,3,9],4,null],[[26],26,null],[[14],26,null]],[26,4],[],[30],[],{},{"type":"crossing","edges":[[5,10],[11,4]],"targets":["LION","ZEBRA"]}],"24/ko":[["다","파","아","나","타","마","자","사","라","하","차","다","파","아","나","타","마","위","카","말","하","람","바","파","아","말","룩","얼","가","카","라","하","차","다","파","아"],[[[7,6],6,null],[[27,26,19],6,null],[[22,17],6,null],[[22,21],21,null]],[6,21],[],[25],[],{},{"type":"cell","cell":22,"targets":["ROCK","WIND"]}],"24/es":[["Y","a","M","T","A","H","O","o","c","c","Q","X","t","L","e","o","G","N","n","b","e","l","r","D","e","r","Y","ó","M","T","i","v","a","n","n","J"],[[[21,20,27,34],31,null],[[9,14,19,25,32],31,null],[[22,15,8,1],15,null],[[31,30,24,18,12,7],31,null]],[31,15],[],[33],[],{},{"type":"crossing","edges":[[9,14],[15,8]],"targets":["ZEBRA","ROCK"]}],"24/pt-BR":[["Y","F","r","e","v","H","O","t","n","o","h","a","E","a","o","c","G","N","r","l","e","o","W","D","z","b","Y","ã","o","T","A","e","O","V","C","J"],[[[19,20,27,21],20,null],[[24,31,25,18,13],18,null],[[2,9,15,10,11],20,null],[[4,3,8,7,14],20,null]],[20,18],[],[28],[],{},{"type":"crossing","edges":[[2,9],[3,8]],"targets":["ROCK","WIND"]}],"24/fr":[["Y","F","M","T","A","H","O","V","C","v","è","X","E","L","n","e","b","z","i","t","I","P","e","r","l","o","Y","r","c","o","A","n","O","h","e","h"],[[[24,18,25,31],15,null],[[17,10,16,23,22],10,null],[[23,29,28,35,34,27],15,null],[[9,15,14,19],15,null]],[15,10],[],[33],[],{},{"type":"cell","cell":23,"targets":["ZEBRA","ROCK"]}],"24/de":[["C","e","L","Z","J","R","w","ö","Q","W","e","P","X","W","i","F","b","a","U","l","e","n","C","r","S","B","s","d","A","I","Q","Y","H","P","X","G"],[[[2,7,6,1],7,null],[[3,10,16,23,17],7,null],[[15,20,19,26],15,null],[[13,14,21,27],7,null]],[7,15],[],[9],[],{},{"type":"crossing","edges":[[15,20],[14,21]],"targets":["ROCK","WIND"]}],"24/it":[["l","r","a","T","o","r","b","e","C","r","c","i","e","L","o","Z","a","c","U","z","n","P","W","D","o","t","n","e","M","T","v","e","O","V","C","J"],[[[0,7,14,20,27],20,null],[[19,12,6,1,2],4,null],[[5,4,10,17,11,16],4,null],[[30,31,26,25,24],4,null]],[4,20],[],[9],[],{},{"type":"crossing","edges":[[0,7],[6,1]],"targets":["LION","ZEBRA"]}],"24/ru":[["е","е","Й","Р","а","м","з","б","Ц","ь","к","е","р","е","т","Н","н","Ю","а","М","в","е","Д","Л","Т","е","Г","р","С","Ш","л","Й","Р","Ч","Б","И"],[[[30,25,20],30,null],[[6,1,7,12,18],11,null],[[10,4,5,11,16,9],11,null],[[20,13,14,21,27],11,null]],[11,30],[],[0],[],{},{"type":"cell","cell":20,"targets":["LION","WIND"]}],"24/hi":[["उ","क","झ","वा","ख","ञ","ऋ","ग","अ","वा","ह","आ","ऐ","ङ","इ","ओ","छ","ई","औ","ट्टा","उ","क","झ","ऊ","न","ञ","च","ग","र","ज़े","घ","आ","ऐ","ङ","ब्रा","शे"],[[[35,28],28,null],[[29,34],29,null],[[26,19,24],29,null],[[10,3],29,null]],[29,28],[],[9],[],{},{"type":"crossing","edges":[[35,28],[29,34]],"targets":["LION","ZEBRA"]}],"24/ar":[["ط","ل","ذ","أ","ت","ظ","ن","ي","ق","و","س","ه","ا","ر","ح","د","ر","أ","ح","ذ","ف","ش","ص","ا","ز","ة","ر","خ","ي","م","ك","ج","غ","ب","ط","ح"],[[[17,10,15],13,null],[[35,29,23,16,9,14,21,28],23,null],[[22,27,26,25],13,null],[[13,7,12,18],13,null]],[13,23],[],[3],[],{},{"type":"crossing","edges":[[10,15],[16,9]],"targets":["LION","ZEBRA"]}],"25/en":[["s","t","e","a","B","I","e","b","f","r","o","l","r","o","T","A","w","O","f","f","x","Q","X","E","L","S","Z","G","N","U","B","I","P","W","D","K"],[[[7,2,3,9],3,null],[[8,13,20],3,null],[[10,16,11],16,null],[[18,13,12,6,0,1],3,null]],[3,16],[],[19],[{"index":11,"from":16}],{},{"type":"cell","cell":13,"targets":["FOX","FOREST"]}],"25/zh-Hant":[["山","頭","森","秋","竹","月","貓","林","鷹","草","冬","熊","狐","光","雨","花","山","天","鳥","狸","竹","月","田","雲","地","草","冬","石","熊","光","雨","花","山","天","鳥","秋"],[[[11],19,null],[[12,19],19,null],[[6,1,8],19,null],[[2,7],2,null]],[19,2],[],[28],[{"index":19,"from":12}],{},{"type":"crossing","edges":[[1,8],[2,7]],"targets":["OWL","FOREST"]}],"25/zh-Hans":[["山","狸","狐","秋","竹","月","田","云","地","草","冬","石","春","光","雨","熊","山","天","鸟","熊","竹","月","田","云","林","头","猫","石","春","光","鹰","森","山","天","鸟","秋"],[[[19],19,null],[[2,1],19,null],[[26,25,30],19,null],[[31,24],24,null]],[19,24],[],[15],[{"index":30,"from":25}],{},{"type":"crossing","edges":[[25,30],[31,24]],"targets":["OWL","FOREST"]}],"25/ja":[["フ","く","そ","に","え","さ","つ","ク","ネ","せ","な","う","ロ","ツ","ね","ク","す","と","キ","ウ","森","マ","お","し","て","あ","ク","そ","に","え","さ","つ","の","き","せ","な"],[[[15,21],0,null],[[18,13,8],13,null],[[0,7,12,19],0,null],[[20],0,null]],[0,13],[],[26],[{"index":13,"from":18}],{},{"type":"crossing","edges":[[18,13],[12,19]],"targets":["FOX","OWL"]}],"25/ko":[["타","여","이","마","곰","마","부","엉","우","마","타","마","타","마","숲","마","타","마","숲","마","타","마","타","마","타","마","타","마","타","마","타","마","타","마","타","마"],[[[4],4,null],[[1,8],4,null],[[6,7,2],6,null],[[14],4,null]],[4,6],[],[18],[{"index":8,"from":1}],{},{"type":"crossing","edges":[[1,8],[7,2]],"targets":["FOX","OWL"]}],"25/es":[["Z","G","o","U","q","I","P","b","D","s","u","Y","b","ú","h","e","H","O","o","r","r","o","X","o","L","r","z","G","N","s","B","I","P","W","o","K"],[[[23,29,34],34,null],[[26,21,20,25,18],7,null],[[12,13,14,21],7,null],[[7,2,9,4,10,15],7,null]],[7,34],[],[19],[{"index":14,"from":13}],{},{"type":"cell","cell":21,"targets":["FOX","OWL"]}],"25/pt-BR":[["r","s","t","a","r","I","e","o","s","a","s","Y","F","a","l","o","p","O","u","f","c","o","X","E","r","o","Z","r","a","U","s","I","P","u","j","K"],[[[18,24,30,25],24,null],[[4,9,16,15,8,13],4,null],[[20,21,27,33,34,28],24,null],[[19,14,7,0,6,1,2,3],24,null]],[24,4],[],[10],[{"index":30,"from":24}],{},{"type":"crossing","edges":[[8,13],[14,7]],"targets":["FOX","FOREST"]}],"25/fr":[["Z","h","i","U","B","I","P","u","o","b","R","Y","F","d","r","a","H","O","o","u","s","Q","n","f","o","S","Z","e","ê","o","B","I","P","r","t","r"],[[[24,19,14,20],14,null],[[33,27,22,15,14,13],14,null],[[1,2,9,8,7],14,null],[[23,29,35,28,34],34,null]],[14,34],[],[18],[{"index":35,"from":29}],{},{"type":"cell","cell":14,"targets":["BEAR","FOX"]}],"25/de":[["G","N","U","D","M","T","C","L","u","l","u","R","Z","J","Q","E","e","P","r","H","l","V","G","N","ä","F","a","d","C","s","B","W","u","c","h","J"],[[[30,24,18],24,null],[[25,32,33,34,29],24,null],[[15,10,9,16],9,null],[[31,26,20,27],24,null]],[24,9],[],[8],[{"index":34,"from":33}],{},{"type":"crossing","edges":[[25,32],[31,26]],"targets":["FOX","FOREST"]}],"25/it":[["g","u","N","o","r","s","f","o","f","K","R","o","F","M","t","a","H","v","V","C","s","p","o","E","L","S","e","f","l","U","B","I","o","r","D","K"],[[[3,4,5,11],4,null],[[17,22,28,21,26],4,null],[[0,1,6,7],6,null],[[27,32,33,26,20,14,15],4,null]],[4,6],[],[8],[{"index":1,"from":0}],{},{"type":"cell","cell":26,"targets":["FOX","FOREST"]}],"25/ru":[["Щ","л","с","С","Ш","В","м","е","о","Б","а","П","Ц","д","е","в","Х","Я","Ж","в","Ф","д","л","М","У","а","с","и","ь","Щ","Г","с","е","л","В","Й"],[[[6,7,13,19,14,21,28],15,null],[[22,27,26,25],26,null],[[2,8,15,10],15,null],[[33,32,31],15,null]],[15,26],[],[1],[{"index":25,"from":26}],{},{"type":"crossing","edges":[[21,28],[22,27]],"targets":["BEAR","FOX"]}],"25/hi":[["ए","ङ","ल","म","ड़ी","ई","ल्लू","झ","लो","ग","अ","ऐ","च","उ","जं","ज","ऊ","ख","ञ","ए","ल्लू","आ","लू","छ","ई","क","झ","भा","घ","अ","ऐ","च","इ","औ","ज","ऊ"],[[[27,22],8,null],[[8,3,4],8,null],[[13,20],8,null],[[14,9,2],2,null]],[8,2],[],[6],[{"index":3,"from":8}],{},{"type":"crossing","edges":[[8,3],[9,2]],"targets":["FOX","FOREST"]}],"25/ar":[["ز","غ","ج","ب","ك","خ","ض","ة","ا","ة","د","س","ق","ح","ب","م","ذ","ط","ي","ل","و","ة","ش","ك","خ","ع","ب","ر","ظ","ت","س","ث","ح","ص","ن","ذ"],[[[10,3],3,null],[[31,25,19,14],15,null],[[26,20,15,21],15,null],[[1,8,14,7],15,null]],[15,3],[],[9],[{"index":8,"from":1}],{},{"type":"cell","cell":14,"targets":["FOX","FOREST"]}],"26/en":[["A","H","O","p","C","J","r","X","E","n","o","t","e","N","U","d","u","r","t","i","w","e","t","F","f","a","s","l","O","V","C","J","h","X","E","L"],[[[11,16,17,22,27,21],22,null],[[3,10,9,15],15,null],[[24,19,26,32],15,null],[[20,25,18,12,6],15,null]],[15,22],[],[],[],{},null],"26/zh-Hant":[["雲","海","龜","冬","石","春","光","魚","花","山","天","鳥","秋","竹","月","田","雲","地","草","冬","石","春","池","雨","花","山","天","鳥","塘","竹","月","田","雲","地","草","水"],[[[1,2],35,null],[[22,28],28,null],[[7],35,null],[[35],35,null]],[35,28],[],[],[],{},null],"26/zh-Hans":[["云","地","草","塘","池","春","鱼","雨","花","山","天","鸟","秋","竹","月","田","云","地","草","冬","石","春","光","雨","水","海","天","鸟","秋","竹","月","龟","云","地","草","冬"],[[[25,31],31,null],[[4,3],4,null],[[6],4,null],[[24],4,null]],[4,31],[],[],[],{},null],"26/ja":[["い","け","た","ぬ","ウ","メ","て","あ","く","そ","ガ","ミ","さ","つ","の","き","せ","な","魚","こ","ち","ね","か","す","と","い","け","た","ぬ","お","し","水","あ","く","池","に"],[[[4,11,10,5],4,null],[[34],4,null],[[18],18,null],[[31],4,null]],[4,18],[],[],[],{},null],"26/ko":[["연","못","사","하","자","물","카","북","파","아","가","차","라","타","거","하","자","나","카","다","바","아","가","차","라","타","고","기","자","나","카","물","파","아","가","차"],[[[20,19,14,7],7,null],[[0,1],26,null],[[31,26,27],26,null],[[5],26,null]],[26,7],[],[],[],{},null],"26/es":[["A","u","O","i","r","J","Q","q","e","n","m","a","n","e","a","a","g","P","a","s","K","g","Y","u","t","z","A","o","u","a","p","e","t","X","r","t"],[[[32,27,34,35,28,21,15,10,11,4,3,9,14],4,null],[[13,19,24,18,12,7,1,8],31,null],[[30,31,25],31,null],[[11,16,23,29],31,null]],[31,4],[],[],[],{},null],"26/pt-BR":[["A","e","x","V","C","J","p","i","a","r","S","Z","a","e","t","n","t","P","g","l","h","a","i","r","o","a","r","u","g","a","C","a","g","á","m","a"],[[[14,8,9,16,21,26,27,28,35,34,29,23,22,15,20,25],20,null],[[19,12,18,24,31],1,null],[[6,13,7,2,1],1,null],[[33,32,27,21],1,null]],[1,20],[],[],[],{},null],"26/fr":[["r","e","d","V","t","J","m","e","e","u","o","r","G","é","t","t","n","g","s","D","n","a","u","F","s","o","e","H","O","V","i","o","p","X","E","L"],[[[15,10,11,4,9,8,2,7,6,1,0],2,null],[[13,14,21,16,17],17,null],[[32,31,30,24,18,25,20],2,null],[[26,21,22],2,null]],[2,17],[],[],[],{},null],"26/de":[["h","i","V","d","t","r","c","s","l","e","k","ö","a","W","s","c","r","c","Y","G","s","e","h","i","V","e","r","i","C","e","M","e","J","R","F","T"],[[[30,31,25,26,21,14,7,6,0,1,8,3,10,5,11,4,9],25,null],[[35,29,23,17,22],22,null],[[34,27,20,15,22],22,null],[[13,12,7,14,9,16],25,null]],[25,22],[],[],[],{},null],"26/it":[["a","q","u","i","n","J","c","a","r","a","e","Z","r","a","t","c","s","t","m","t","K","g","a","e","a","g","a","n","p","V","u","r","Q","X","o","L"],[[[14,7,12,19,26,31,30,25,24,18,13,8,3,4,9],3,null],[[16,17,22,21,27,34],3,null],[[28,23,16,15,10],10,null],[[0,6,1,2,9],3,null]],[3,10],[],[],[],{},null],"26/ru":[["о","в","м","Т","р","Г","К","д","Ш","о","с","а","а","Б","а","п","я","к","ы","а","х","е","р","ч","р","б","а","у","п","е","Д","Л","д","р","Г","К"],[[[2,9,4,10,17,11,16,23,29,22,21,15,14,20,26],11,null],[[28,33,27,32],11,null],[[24,18,25,19],11,null],[[1,0,7,12],1,null]],[11,1],[],[],[],{},null],"26/hi":[["छु","आ","ऊ","पा","अ","ऐ","च","क","ख","ञ","नी","ङ","द्री","मु","स","ऋ","म","ली","ओ","ज","ऊ","ग","छ","ऐ","च","उ","ख","ञ","ए","ता","ई","औ","झ","ऋ","ला","ब"],[[[14,13,12,7,0,1],14,null],[[29,34,35],3,null],[[16,22,17],3,null],[[3,10],3,null]],[3,14],[],[],[],{},null],"26/ar":[["ص","ن","س","ب","ة","ش","ق","خ","ح","ل","ح","ا","ة","ي","ر","ء","ا","ف","ص","ن","د","ظ","ك","م","ق","ك","ة","و","ة","س","ج","ض","ر","ب","ع","ث"],[[[2,9,10,17,11,4,3,8,14,13,12],4,null],[[33,32,25,26],4,null],[[29,23,22,28],29,null],[[23,16,15],4,null]],[4,29],[],[],[],{},null],"27/en":[["B","I","P","r","o","k","R","Y","F","r","T","c","x","f","V","C","r","Q","f","o","e","e","a","G","N","U","v","I","b","W","D","K","c","a","F","M"],[[[28,21,22,16],5,null],[[13,19,12],5,null],[[32,33,26,20],26,null],[[3,4,11,5],5,null]],[5,26],[],[18,9],[],{},null],"27/zh-Hant":[["冬","鳥","冬","鳥","冬","鳥","冬","鳥","冬","鳥","冬","鳥","冬","狸","冬","鳥","冬","鳥","狐","熊","山","洞","冬","鳥","冬","洞","冬","鳥","冬","熊","冬","鳥","岩","石","冬","鳥"],[[[19],25,null],[[18,13],18,null],[[20,25],25,null],[[32,33],25,null]],[25,18],[],[29,21],[],{},null],"27/zh-Hans":[["冬","鸟","洞","鸟","冬","熊","熊","山","冬","鸟","冬","鸟","冬","鸟","冬","鸟","冬","鸟","冬","鸟","冬","狐","狸","鸟","冬","鸟","冬","石","冬","鸟","冬","鸟","冬","鸟","岩","石"],[[[6],6,null],[[21,22],35,null],[[7,2],35,null],[[34,35],35,null]],[35,6],[],[27,5],[],{},null],"27/ja":[["う","こ","ち","キ","か","す","と","い","ツ","た","洞","岩","し","て","ネ","く","そ","窟","え","さ","岩","の","洞","せ","な","う","こ","ち","ク","マ","す","と","い","け","た","ぬ"],[[[28,29],29,null],[[3,8,14],3,null],[[10,17],3,null],[[20],3,null]],[3,29],[],[11,22],[],{},null],"27/ko":[["굴","차","다","카","라","곰","동","곰","사","하","아","가","자","곰","차","다","카","라","타","마","파","사","하","아","가","자","위","차","여","카","라","타","바","파","사","우"],[[[5],5,null],[[28,35],35,null],[[6,0],35,null],[[32,26],35,null]],[35,5],[],[7,13],[],{},null],"27/es":[["B","I","P","a","c","K","R","Y","o","v","u","A","H","s","o","e","e","Q","X","E","L","z","a","z","N","U","o","I","o","c","D","K","R","r","r","o"],[[[8,13,14],34,null],[[21,28,34,33,26],34,null],[[4,10,15,9,3],15,null],[[34,35,29,22],34,null]],[34,15],[],[23,16],[],{},null],"27/pt-BR":[["B","h","c","W","o","K","R","a","o","s","r","a","H","O","r","u","s","a","n","E","L","o","a","G","r","a","B","p","a","W","e","v","a","c","r","M"],[[[15,10,9,4],28,null],[[34,28,27,21,16,22],28,null],[[33,32,31,30,24,18,25],32,null],[[14,8,2,1,7],28,null]],[28,32],[],[17,11],[],{},null],"27/fr":[["B","a","e","r","D","K","r","Y","n","r","h","c","g","d","t","r","o","e","s","r","o","t","Z","r","N","r","u","e","P","W","u","o","R","Y","F","M"],[[[31,26,25,18],6,null],[[3,2,8,1,6,13],6,null],[[12,19,20,14,21,27],6,null],[[15,16,11,10,17,23],15,null]],[6,15],[],[30,9],[],{},null],"27/de":[["G","O","V","D","M","T","ö","h","l","Y","I","P","H","e","N","U","l","s","u","F","u","Q","e","G","O","c","D","M","F","A","s","h","s","r","ä","B"],[[[35,34,33],35,null],[[19,18,25,31,30],35,null],[[12,6,7,8,13],7,null],[[28,22,16,17],35,null]],[35,7],[],[20,32],[],{},null],"27/it":[["B","I","P","W","D","o","r","o","F","M","T","r","i","c","c","o","s","a","X","a","L","o","Z","t","N","U","l","v","g","t","e","p","o","v","o","r"],[[[5,11,16,15],7,null],[[33,32,26,31,30],30,null],[[28,35,34,29,23,17],7,null],[[6,7,14,13,12,19],7,null]],[7,30],[],[27,21],[],{},null],"27/ru":[["Ю","Е","а","р","е","щ","Л","ь","а","п","е","С","ь","н","ь","Р","Ч","Б","е","м","д","А","З","О","а","к","е","в","Ф","м","л","и","с","а","д","е"],[[[29,35,34,27,26,20,14],20,null],[[30,31,32,33],30,null],[[9,10,5,4,3,8],20,null],[[25,24,19,18,13,12],20,null]],[20,30],[],[2,7],[],{},null],"27/hi":[["ए","फा","आ","न","भा","लू","गु","लो","ई","लू","ट्टा","उ","म","झ","ऊ","च","च","ऋ","ग","ड़ी","ए","घ","आ","ऐ","ङ","इ","ओ","छ","ई","औ","ज","उ","क","झ","ऊ","ख"],[[[4,5],5,null],[[7,12,19],5,null],[[6,1],5,null],[[15,10,3],15,null]],[5,15],[],[16,9],[],{},null],"27/ar":[["ظ","ا","ش","ن","ذ","غ","ت","ة","خ","ص","ق","ج","ط","ر","س","م","ب","د","ا","ش","ن","د","ث","ت","ك","ه","ف","ق","ب","ع","ي","س","ف","ح","ل","ا"],[[[17,16],8,null],[[22,29,34,28],34,null],[[24,25,32],8,null],[[9,8,13,7],8,null]],[8,34],[],[26,21],[],{},null],"28/en":[["C","J","Q","l","E","L","n","Z","G","w","o","B","I","e","W","D","K","e","t","s","M","T","A","l","O","V","e","d","g","w","E","L","S","a","n","i"],[[[26,33,28,23,17],23,null],[[10,9,3],35,null],[[29,35,34,27],35,null],[[6,13,19,18],35,null]],[35,23],[],[],[{"index":18,"from":19}],{},{"type":"crossing","edges":[[33,28],[34,27]],"targets":["EAGLE","WIND"]}],"28/zh-Hant":[["秋","竹","春","光","鷹","田","雨","花","雲","地","貓","頭","鳥","鷹","石","秋","竹","春","老","巢","田","雨","花","雲","地","山","天","草","冬","石","秋","竹","風","光","月","田"],[[[18,13],13,null],[[10,11,4],19,null],[[32],19,null],[[12,19],19,null]],[19,13],[],[],[{"index":13,"from":18}],{},{"type":"crossing","edges":[[18,13],[12,19]],"targets":["EAGLE","NEST"]}],"28/zh-Hans":[["秋","竹","春","头","鹰","老","雨","花","猫","地","山","天","草","冬","石","秋","竹","鸟","光","月","风","雨","巢","云","地","山","天","草","冬","石","秋","竹","春","光","月","田"],[[[5,4],5,null],[[8,3,4],5,null],[[20],5,null],[[17,22],22,null]],[5,22],[],[],[{"index":3,"from":8}],{},{"type":"cell","cell":4,"targets":["EAGLE","OWL"]}],"28/ja":[["フ","ワ","ロ","ウ","き","せ","シ","ク","こ","ち","ね","か","す","と","い","け","た","ぬ","お","し","て","あ","風","そ","に","え","さ","つ","の","き","巣","な","う","こ","ち","ね"],[[[1,6],1,null],[[0,7,2,3],3,null],[[22],3,null],[[30],3,null]],[3,1],[],[],[{"index":2,"from":7}],{},{"type":"crossing","edges":[[1,6],[0,7]],"targets":["EAGLE","OWL"]}],"28/ko":[["독","수","둥","타","람","파","사","지","리","가","바","나","차","다","카","라","타","마","파","사","하","아","가","자","나","차","다","이","라","부","마","파","사","하","엉","가"],[[[0,1,8],1,null],[[29,34,27],4,null],[[10,4],4,null],[[2,7],4,null]],[4,1],[],[],[{"index":27,"from":34}],{},{"type":"crossing","edges":[[1,8],[2,7]],"targets":["EAGLE","NEST"]}],"28/es":[["C","b","ú","n","t","L","S","Z","e","h","o","B","n","P","i","a","á","R","i","d","v","g","l","i","o","V","C","J","u","X","E","L","S","Z","G","N"],[[[16,21,28,23,22,15],16,null],[[1,2,9,10],16,null],[[20,14,8,3,4,10],20,null],[[12,18,19,24],16,null]],[16,20],[],[],[{"index":8,"from":14}],{},{"type":"cell","cell":10,"targets":["OWL","WIND"]}],"28/pt-BR":[["u","J","Q","X","n","L","i","g","o","h","a","i","a","P","á","j","n","R","Y","F","M","u","A","o","O","c","r","e","Q","t","E","o","v","Z","n","N"],[[[14,7,0,6,12],26,null],[[25,31,26,21,15,10],26,null],[[32,27,34,29,23],26,null],[[4,11,16,9,8],4,null]],[26,4],[],[],[{"index":0,"from":7}],{},{"type":"crossing","edges":[[15,10],[16,9]],"targets":["OWL","NEST"]}],"28/fr":[["l","g","i","X","E","L","e","n","d","a","U","B","e","v","t","D","u","R","Y","F","M","T","o","H","O","V","C","b","Q","X","E","L","S","i","h","N"],[[[9,2,1,0,6],9,null],[[34,33,27,22,16],27,null],[[13,12,7,14],9,null],[[7,2,8],9,null]],[9,27],[],[],[{"index":16,"from":22}],{},{"type":"cell","cell":2,"targets":["EAGLE","NEST"]}],"28/de":[["I","Q","d","e","P","X","G","O","N","n","s","t","D","W","i","C","K","S","B","e","l","Z","I","d","Y","E","u","X","l","A","V","F","M","U","r","e"],[[[29,23,28,35,34],34,null],[[25,26,20,19],19,null],[[13,14,9,2],19,null],[[8,3,10,11],19,null]],[19,34],[],[],[{"index":34,"from":35}],{},{"type":"crossing","edges":[[9,2],[8,3]],"targets":["WIND","NEST"]}],"28/it":[["C","f","u","X","a","q","o","t","o","g","u","B","v","P","n","n","d","i","Y","e","M","i","l","o","O","V","C","a","Q","X","E","L","S","Z","G","N"],[[[4,5,10,17,22,27],17,null],[[9,2,1,6],17,null],[[12,19,14,7,8],17,null],[[15,21,16,23],16,null]],[17,16],[],[],[{"index":19,"from":12}],{},{"type":"crossing","edges":[[17,22],[16,23]],"targets":["EAGLE","NEST"]}],"28/ru":[["Я","Ж","Н","Ф","с","о","М","л","Э","р","в","а","Щ","Г","ё","р","е","т","Й","Р","Ч","Б","о","е","Ц","А","З","д","Х","в","Ж","Н","з","е","н","г"],[[[22,15,14,7],7,null],[[4,5,10,11],17,null],[[29,23,17,16,9],17,null],[[35,34,33,32,27,22],17,null]],[17,7],[],[],[{"index":17,"from":23}],{},{"type":"cell","cell":22,"targets":["EAGLE","NEST"]}],"28/hi":[["ओ","च","इ","औ","छ","ई","क","ज","ऊ","ख","झ","ऋ","ग","ञ","ए","घ","अ","ऐ","ङ","आ","स","ला","इ","औ","ब","का","घों","ज","ऊ","वा","झ","उ","ल्लू","ञ","ए","ह"],[[[31,25,24],24,null],[[31,32],24,null],[[35,29],35,null],[[26,20,21],24,null]],[24,35],[],[],[{"index":21,"from":20}],{},{"type":"cell","cell":31,"targets":["EAGLE","OWL"]}],"28/ar":[["ط","ه","ز","ف","ج","ض","ن","ا","ب","ث","ر","ل","د","ح","ق","ي","ك","خ","ط","ه","ا","ع","ج","ض","ن","ذ","ة","م","ص","ب","ع","ش","ت","س","و","خ"],[[[21,14,7,8],29,null],[[29,34,27,26],29,null],[[10,15,20,13],13,null],[[30,31],29,null]],[29,13],[],[],[{"index":15,"from":10}],{},{"type":"crossing","edges":[[21,14],[15,20]],"targets":["EAGLE","WIND"]}],"29/en":[["e","K","r","d","F","p","b","a","r","O","n","o","J","Q","X","E","f","o","Z","G","N","U","r","x","P","t","s","e","R","o","F","M","t","A","H","f"],[[[6,0,7,8],26,null],[[35,29,23],26,null],[[5,11,10,3],10,null],[[16,17,22,27,26,25],26,null]],[26,10],[],[32,2],[{"index":7,"from":0}],{},null],"29/zh-Hant":[["熊","狐","雨","花","山","天","狸","秋","林","月","田","雲","地","草","冬","森","春","光","雨","花","池","塘","鳥","秋","熊","月","田","雲","地","草","熊","石","春","光","雨","花"],[[[30],1,null],[[1,6],1,null],[[20,21],1,null],[[15,8],15,null]],[1,15],[],[0,24],[{"index":21,"from":20}],{},null],"29/zh-Hans":[["春","光","雨","狐","山","天","鸟","秋","竹","狐","狸","云","地","草","冬","熊","池","塘","雨","花","山","天","鸟","秋","竹","熊","田","森","林","草","冬","石","春","光","雨","花"],[[[25],17,null],[[3,10],17,null],[[16,17],17,null],[[27,28],28,null]],[17,28],[],[15,9],[{"index":17,"from":16}],{},null],"29/ja":[["森","ク","池","あ","く","そ","森","マ","さ","つ","池","き","せ","な","う","こ","ち","ね","か","す","と","い","け","た","ぬ","お","し","ネ","あ","く","そ","に","え","さ","ツ","キ"],[[[1,7],7,null],[[35,34,27],34,null],[[10],7,null],[[6],7,null]],[7,34],[],[0,2],[{"index":27,"from":34}],{},null],"29/ko":[["나","여","나","자","나","곰","우","못","나","자","나","자","나","연","숲","자","나","자","나","자","나","숲","나","자","나","자","나","자","나","자","나","자","숲","자","나","자"],[[[5],5,null],[[1,6],6,null],[[13,7],6,null],[[21],6,null]],[6,5],[],[14,32],[{"index":6,"from":1}],{},null],"29/es":[["e","e","o","o","o","z","u","q","s","t","r","C","J","e","s","n","a","r","b","o","N","q","e","o","P","W","D","u","R","Y","F","M","e","A","H","O"],[[[2,8,3],23,null],[[5,4,10,17,23],23,null],[[13,8,9,16,15,21,27,22],21,null],[[18,19,14,7,6,1],23,null]],[23,21],[],[32,0],[{"index":14,"from":19}],{},null],"29/pt-BR":[["a","o","s","a","t","s","l","g","o","r","a","e","J","a","X","p","r","S","Z","G","u","U","l","o","P","r","o","K","f","Y","u","s","u","A","H","O"],[[[30,25,31,26],30,null],[[9,10,15,8,2,3],8,null],[[6,13,7,1,0],30,null],[[28,22,23,16,11,5,4,3],30,null]],[30,8],[],[32,20],[{"index":0,"from":1}],{},null],"29/fr":[["n","K","t","t","t","M","g","a","H","é","ê","r","J","d","X","E","o","f","Z","G","r","u","B","I","P","d","r","a","r","Y","F","s","T","A","n","e"],[[[16,21,26,31],16,null],[[28,35,34,27,20,25],35,null],[[9,2,7,0,6],35,null],[[17,16,11,10,3],16,null]],[35,16],[],[13,4],[{"index":11,"from":16}],{},null],"29/de":[["J","d","r","a","W","Y","H","ä","l","G","N","V","E","B","h","e","T","S","C","s","R","c","i","h","Z","I","s","u","c","O","X","G","N","h","F","M"],[[[13,7,2],22,null],[[34,27,28,33,26],22,null],[[16,15,22,21,14],22,null],[[4,3,8,1],4,null]],[22,4],[],[19,23],[{"index":1,"from":8}],{},null],"29/it":[["D","s","f","o","o","M","o","o","r","v","l","C","g","a","t","e","e","p","n","o","N","s","s","I","P","o","D","K","a","t","F","M","T","A","a","O"],[[[3,8,1,6],1,null],[[9,4,10,17,16],1,null],[[21,14,13,12,18,19],13,null],[[2,7,8,15,22,29,28],1,null]],[1,13],[],[25,34],[{"index":22,"from":15}],{},null],"29/ru":[["А","З","с","Х","Я","Ж","Н","д","с","е","М","У","в","Д","у","д","л","Г","е","д","п","р","Й","Р","д","е","м","а","Ц","А","ь","л","и","с","Ж","Н"],[[[26,25,19,12,18,24,30],24,null],[[31,32,33,27],21,null],[[20,21,14,15],21,null],[[16,9,8],21,null]],[21,24],[],[2,7],[{"index":14,"from":21}],{},null],"29/hi":[["ओ","छ","ई","ब","ज","उ","क","झ","ऊ","ख","ला","ता","घ","लो","म","ड़ी","आ","ऐ","लू","ड़ी","जं","छ","ई","औ","ज","भा","ग","झ","ऊ","ख","ञ","ल","ल","अ","ए","ङ"],[[[25,18],11,null],[[13,14,15],14,null],[[11,10,3],11,null],[[20,26,31],11,null]],[11,14],[],[32,19],[{"index":31,"from":26}],{},null],"29/ar":[["ط","ب","ز","ف","ت","غ","م","ح","ر","ه","ب","ا","ي","ة","ك","ج","ص","ة","خ","ط","و","ة","ف","ث","د","م","ح","ض","ه","ع","ب","ي","س","ب","ل","ث"],[[[24,30],33,null],[[35,29,34,33],33,null],[[1,8,14,13],13,null],[[5,11,10,17],33,null]],[33,13],[],[23,21],[{"index":13,"from":14}],{},null],"30/en":[["E","e","a","l","G","N","U","c","e","n","W","l","K","s","o","l","i","T","A","H","n","o","C","J","Q","X","E","t","o","f","G","N","U","s","e","r"],[[[15,16,21,20],15,null],[[13,8,2,3],2,null],[[29,28,35,34,33,27],2,null],[[14,7,1,2,9],2,null]],[2,15],[],[11],[{"index":27,"from":33}],{},{"type":"cell","cell":2,"targets":["SEAL","OCEAN"]}],"30/zh-Hant":[["秋","子","月","田","雲","地","獅","冬","石","春","光","雨","花","山","天","林","森","竹","月","田","雲","地","森","冬","豹","洋","光","雨","花","山","海","海","秋","竹","月","田"],[[[6,1],1,null],[[31,24],24,null],[[16,15],1,null],[[30,25],1,null]],[1,24],[],[22],[{"index":1,"from":6}],{},{"type":"crossing","edges":[[31,24],[30,25]],"targets":["SEAL","OCEAN"]}],"30/zh-Hans":[["秋","竹","月","田","云","地","豹","冬","石","春","光","雨","花","海","洋","鸟","秋","竹","月","田","豹","地","草","冬","石","春","光","森","花","山","天","鸟","秋","林","子","狮"],[[[35,34],27,null],[[13,6],13,null],[[27,33],27,null],[[13,14],13,null]],[27,13],[],[20],[{"index":14,"from":13}],{},{"type":"cell","cell":13,"targets":["SEAL","OCEAN"]}],"30/ja":[["か","す","森","い","海","た","ぬ","お","し","て","あ","く","そ","に","シ","さ","ザ","の","き","オ","イ","ラ","こ","ア","ね","ン","す","と","い","け","た","ぬ","お","森","て","あ"],[[[21,20,19,25],19,null],[[23,16,21,14],23,null],[[2],23,null],[[4],23,null]],[23,19],[],[33],[{"index":19,"from":20}],{},{"type":"cell","cell":21,"targets":["LION","SEAL"]}],"30/ko":[["가","타","아","나","파","차","라","하","숲","마","가","타","아","자","파","차","라","하","사","마","가","타","아","나","숲","차","라","하","바","범","가","타","아","나","물","다"],[[[18,13],13,null],[[34,29],8,null],[[8],8,null],[[28,35],8,null]],[8,13],[],[24],[{"index":35,"from":28}],{},{"type":"crossing","edges":[[34,29],[28,35]],"targets":["SEAL","OCEAN"]}],"30/es":[["E","q","e","o","b","N","U","u","s","c","W","D","K","R","é","a","M","T","A","l","n","o","n","J","o","e","ó","n","S","Z","f","c","a","B","I","P"],[[[19,25,26,20],26,null],[[30,24,31,32],3,null],[[4,3,8,1,7,2],3,null],[[3,9,14,15,22,21],3,null]],[3,26],[],[27],[{"index":1,"from":8}],{},{"type":"cell","cell":3,"targets":["FOREST","OCEAN"]}],"30/pt-BR":[["E","l","f","s","G","a","a","o","r","e","t","D","K","c","a","n","M","T","l","H","e","V","o","J","Q","e","E","c","S","Z","G","ã","o","B","I","P"],[[[18,25,31,32],22,null],[[2,7,13,6],2,null],[[2,1,7,8,9,3,10,5],2,null],[[7,13,20,14,15,22],22,null]],[22,2],[],[27],[{"index":5,"from":10}],{},{"type":"cell","cell":2,"targets":["SEAL","FOREST"]}],"30/fr":[["E","L","S","Z","G","N","n","o","q","P","e","o","o","i","h","u","c","o","f","p","l","V","C","é","o","X","t","L","S","a","r","ê","U","B","I","n"],[[[20,13,12,6],6,null],[[19,14,7,8,15,10],15,null],[[18,24,30,31,26],6,null],[[11,16,23,29,35],6,null]],[6,15],[],[17],[{"index":35,"from":29}],{},{"type":"crossing","edges":[[20,13],[19,14]],"targets":["LION","SEAL"]}],"30/de":[["I","l","A","H","Q","Z","a","W","d","F","N","X","ö","L","z","R","e","b","w","e","O","R","o","b","a","e","Q","Z","G","P","n","F","N","X","E","M"],[[[13,12,18,25],21,null],[[21,22,23,17,16],21,null],[[7,6,1,8],21,null],[[20,14,19,24,30],14,null]],[21,14],[],[15],[{"index":25,"from":18}],{},{"type":"crossing","edges":[[18,25],[19,24]],"targets":["LION","OCEAN"]}],"30/it":[["l","o","n","Z","e","f","e","e","e","s","o","r","o","a","t","F","M","T","c","a","O","V","C","J","e","o","E","L","S","Z","n","a","f","B","I","P"],[[[0,6,1,2,8],1,null],[[32,25,18,13],9,null],[[5,10,11,4,9,14,19],9,null],[[12,18,24,31,30,25],9,null]],[9,1],[],[7],[{"index":14,"from":9}],{},{"type":"cell","cell":25,"targets":["SEAL","OCEAN"]}],"30/ru":[["л","И","с","Ц","А","З","О","е","с","Ж","Н","Ф","ь","е","в","н","л","Д","н","л","а","е","К","С","Ш","е","ю","т","Ч","Б","о","к","Ц","А","З","О"],[[[16,21,14],18,null],[[27,26,19,13,18,12],18,null],[[0,7,2],18,null],[[30,31,25,20,15],15,null]],[18,15],[],[8],[{"index":25,"from":31}],{},{"type":"crossing","edges":[[21,14],[20,15]],"targets":["LION","OCEAN"]}],"30/hi":[["औ","म","जं","क","र","ऊ","सी","ग","हा","म","शे","ए","ङ","ल","ऐ","सा","इ","ओ","छ","ई","औ","ज","ग","र","झ","ऊ","ख","ञ","ऋ","घ","अ","ए","ङ","आ","ऐ","च"],[[[10,4],4,null],[[6,13],4,null],[[2,7,13],2,null],[[1,8,15,22,23],4,null]],[4,2],[],[9],[{"index":4,"from":10}],{},{"type":"cell","cell":13,"targets":["SEAL","FOREST"]}],"30/ar":[["ل","خ","ظ","ت","ش","ن","ذ","ة","م","ص","ي","ر","م","ا","ب","ح","ط","ل","ف","ق","غ","ش","ي","ذ","ع","ث","أ","ه","ر","ك","ج","س","د","ز","ل","خ"],[[[26,31,32],32,null],[[18,19,12,7],13,null],[[20,13,14,7],13,null],[[8,15,10,16],13,null]],[13,32],[],[22],[{"index":15,"from":8}],{},{"type":"cell","cell":7,"targets":["SEAL","FOREST"]}],"31/en":[["F","o","f","r","o","O","x","p","e","s","f","E","L","S","o","o","t","U","B","I","n","W","w","K","R","d","F","M","l","A","H","O","V","C","J","Q"],[[[2,1,6],null,null],[[15,22,28],null,null],[[10,4,3,8,9,16],null,null],[[7,14,20,25],null,null]],[],[],[],[],{},null],"31/zh-Hant":[["森","林","春","光","雨","花","山","天","鳥","狸","狐","月","鷹","雲","地","草","冬","石","貓","頭","雨","花","池","天","鳥","秋","竹","月","田","塘","地","草","冬","石","春","光"],[[[10,9],null,null],[[18,19,12],null,null],[[0,1],null,null],[[22,29],null,null]],[],[],[],[],{},null],"31/zh-Hans":[["冬","石","春","鹰","雨","花","山","天","鸟","头","竹","月","狸","云","地","草","猫","石","春","狐","雨","花","山","池","鸟","秋","竹","林","塘","云","地","草","冬","石","森","光"],[[[19,12],null,null],[[16,9,3],null,null],[[34,27],null,null],[[23,28],null,null]],[],[],[],[],{},null],"31/ja":[["き","せ","な","う","こ","ち","ね","り","す","と","い","け","た","ぬ","も","し","て","あ","く","池","ネ","え","さ","つ","ウ","ロ","フ","ツ","う","こ","ち","ク","か","キ","と","い"],[[[33,27,20],null,null],[[26,31,25,24],null,null],[[14,7],null,null],[[19],null,null]],[],[],[],[],{},null],"31/ko":[["사","하","아","가","부","이","차","라","카","마","엉","바","파","사","하","여","우","자","다","차","라","카","마","타","바","숲","무","못","아","가","자","다","나","연","카","마"],[[[15,16],null,null],[[4,10,5],null,null],[[32,26,25],null,null],[[33,27],null,null]],[],[],[],[],{},null],"31/es":[["u","M","T","o","H","O","e","q","s","Q","b","o","e","S","Z","G","ú","h","s","t","a","e","D","K","R","Y","u","n","o","o","H","O","q","r","r","z"],[[[35,29,34,33,28],null,null],[[10,16,17,11],null,null],[[10,3,8,7,0,6],null,null],[[12,18,19,20,27,32,26,21],null,null]],[],[],[],[],{},null],"31/pt-BR":[["r","s","T","A","H","O","t","a","e","r","X","E","p","o","c","G","o","U","B","o","r","f","l","a","R","s","u","M","l","o","a","j","V","C","a","g"],[[[0,7,12,19,25,30],null,null],[[14,13,20,26,31,30],null,null],[[21,22,16,9,8,1,6,7],null,null],[[28,34,35,29,23],null,null]],[],[],[],[],{},null],"31/fr":[["F","o","T","A","n","e","V","u","b","a","X","r","L","h","i","G","r","d","B","I","ê","t","D","K","f","r","F","n","g","é","H","o","V","a","t","Q"],[[[11,5,4,9,16,17],null,null],[[13,14,8,1,7],null,null],[[24,31,25,20,21],null,null],[[29,34,33,27,28],null,null]],[],[],[],[],{},null],"31/de":[["d","S","B","K","u","A","a","l","Z","l","e","E","H","W","X","F","s","V","h","M","U","C","u","h","i","c","R","A","c","Q","e","T","P","Y","H","O"],[[[15,22,28,23,16],null,null],[[11,4,9,10],null,null],[[13,6,7,0],null,null],[[31,30,24,25,18],null,null]],[],[],[],[],{},null],"31/it":[["F","M","T","t","s","O","V","C","a","Q","X","E","L","g","o","g","N","U","u","o","v","n","r","e","f","l","F","a","o","s","o","e","p","C","t","f"],[[[20,19,25,32,31],null,null],[[13,18,24,30],null,null],[[35,28,22,23,29,34,27],null,null],[[4,3,8,15,21,14],null,null]],[],[],[],[],{},null],"31/ru":[["В","Й","Р","Ч","Б","И","П","Ц","А","З","О","Х","Я","Ж","Н","е","Ю","Е","а","У","Э","с","л","Т","в","с","у","С","а","л","о","р","п","д","и","с"],[[[29,34,35,28],null,null],[[25,30,24,18],null,null],[[22,15,21],null,null],[[32,31,26,33],null,null]],[],[],[],[],{},null],"31/hi":[["घ","अ","ऐ","च","इ","औ","ज","ऊ","ख","उ","ल्लू","ङ","आ","ला","छ","ई","क","झ","ता","घ","ब","ऐ","च","इ","ड़ी","म","लो","ख","ञ","जं","ङ","आ","ओ","ल","ग","क"],[[[26,25,24],null,null],[[9,10],null,null],[[29,34,33],null,null],[[18,13,20],null,null]],[],[],[],[],{},null],"31/ar":[["ف","غ","ص","ب","ة","ظ","ب","ش","ا","د","ط","ت","ر","ك","ة","ض","ي","ز","ف","ح","ص","ه","ة","ظ","ج","ش","ل","ع","ث","م","س","ب","خ","ض","و","ب"],[[[28,27,26,31],null,null],[[35,34,29,22],null,null],[[1,8,3,4],null,null],[[6,12,13,14],null,null]],[],[],[],[],{},null],"32/en":[["G","e","U","B","I","P","f","r","s","R","r","F","o","l","A","t","a","e","C","i","Q","c","E","b","S","n","o","N","a","v","I","P","W","D","K","e"],[[[23,17,16,10],null,null],[[13,19,26,25],null,null],[[21,28,29,35],null,null],[[6,12,7,1,8,15],null,null]],[],[],[],[],{},null],"32/zh-Hant":[["花","雲","地","洞","天","鳥","熊","石","山","竹","春","光","月","棕","雨","花","雲","地","草","天","鳥","冬","石","秋","竹","子","獅","月","森","雨","花","雲","地","草","林","鳥"],[[[13,6],null,null],[[26,25],null,null],[[8,3],null,null],[[28,34],null,null]],[],[],[],[],{},null],"32/zh-Hans":[["花","洞","山","草","天","鸟","冬","石","秋","竹","春","光","月","田","雨","花","林","地","草","天","鸟","森","石","秋","熊","春","光","月","田","雨","花","棕","狮","子","天","鸟"],[[[31,24],null,null],[[32,33],null,null],[[2,1],null,null],[[21,16],null,null]],[],[],[],[],{},null],"32/ja":[["く","そ","に","え","り","つ","の","き","ク","な","も","こ","ち","窟","洞","マ","と","い","け","オ","イ","お","し","て","ン","ラ","そ","に","え","さ","つ","の","き","せ","な","う"],[[[8,15],null,null],[[25,20,19,24],null,null],[[14,13],null,null],[[10,4],null,null]],[],[],[],[],{},null],"32/ko":[["동","굴","라","파","아","다","타","바","가","곰","불","하","차","숲","파","아","다","타","무","가","카","마","하","차","나","파","아","다","사","자","가","카","마","하","차","라"],[[[10,9],null,null],[[28,29],null,null],[[0,1],null,null],[[24,18,13],null,null]],[],[],[],[],{},null],"32/es":[["G","e","v","B","I","P","u","D","a","s","Y","F","c","T","q","o","O","V","C","u","e","X","b","e","S","Z","G","o","l","ó","I","o","s","D","K","n"],[[[27,32,31],null,null],[[28,23,29,35],null,null],[[12,6,1,2,8],null,null],[[22,15,9,14,19,20],null,null]],[],[],[],[],{},null],"32/pt-BR":[["G","N","U","B","I","P","W","D","o","R","Y","F","l","o","l","s","e","V","e","f","r","u","v","r","ã","e","t","N","a","n","o","s","a","D","c","a"],[[[21,20,15,8],null,null],[[12,18,24,30],null,null],[[34,28,22,16,23,29,35],null,null],[[19,14,13,20,25,31,26,32],null,null]],[],[],[],[],{},null],"32/fr":[["G","N","U","B","n","o","W","D","K","R","Y","i","M","T","A","H","l","r","t","ê","s","X","g","o","r","o","r","e","U","t","f","P","u","o","t","R"],[[[33,32,26,20],null,null],[[16,11,5,4],null,null],[[22,17,23,29,34,27],null,null],[[30,25,24,19,18],null,null]],[],[],[],[],{},null],"32/de":[["e","w","D","M","T","C","K","S","ö","L","R","Z","I","Q","Y","a","ö","H","F","O","l","W","N","h","D","M","d","C","K","l","A","r","ä","B","e","Q"],[[[33,32,31],null,null],[[9,8,1,0],null,null],[[17,16,23,29,34],null,null],[[21,15,20,26],null,null]],[],[],[],[],{},null],"32/it":[["o","r","l","e","r","P","s","D","e","n","o","g","M","o","A","o","t","t","C","a","r","X","f","a","t","e","G","N","U","B","s","P","W","D","K","R"],[[[0,1,6,13],null,null],[[2,3,10,9,8],null,null],[[11,4,10,16,17,23],null,null],[[22,15,20,25,30,24,19],null,null]],[],[],[],[],{},null],"32/ru":[["щ","е","С","Ш","В","Й","е","п","р","И","П","Ц","А","а","О","Х","е","Ж","Н","Ф","Ю","л","М","в","ь","Д","в","д","е","Г","д","е","Ш","м","е","с"],[[[33,34,27,26,31,30,24],null,null],[[21,16,23],null,null],[[7,6,0,1,8,13],null,null],[[21,28,35],null,null]],[],[],[],[],{},null],"32/hi":[["ख","भा","ऋ","घ","अ","गु","ङ","आ","लू","च","इ","फा","छ","ई","औ","ज","र","क","झ","ऊ","ख","ञ","ऋ","शे","अ","ए","ङ","ग","जं","च","इ","ओ","छ","ई","ल","ज"],[[[1,8],null,null],[[23,16],null,null],[[5,11],null,null],[[28,27,34],null,null]],[],[],[],[],{},null],"32/ar":[["ظ","ي","ر","ك","ف","ز","ق","ث","ش","ل","ه","ص","م","ب","ض","ن","خ","ط","ا","غ","ة","ي","ر","ع","د","ز","ق","ث","ش","ل","ب","ص","د","س","أ","ن"],[[[24,30],null,null],[[34,33,32],null,null],[[3,10,4],null,null],[[19,18,13,20],null,null]],[],[],[],[],{},null],"33/en":[["f","i","h","d","o","?","X","w","s","p","n","G","N","a","B","I","P","W","r","e","t","f","F","M","T","A","r","o","V","C","J","Q","X","g","L","S"],[[[21,26,27,33],null,null],[[0,1,8,2],null,null],[[7,13,20,19,18],null,null],[[9,4,10,3],null,null]],[],[5],[],[],{},null],"33/zh-Hant":[["地","草","冬","石","春","光","雨","花","青","天","鳥","秋","竹","月","蛙","雲","地","草","溪","石","?","光","雨","花","水","天","塘","兒","竹","月","田","池","地","魚","冬","石"],[[[8,14],null,null],[[33,27],null,null],[[18,24],null,null],[[31,26],null,null]],[],[20],[],[],{},null],"33/zh-Hans":[["地","草","冬","石","春","光","溪","塘","山","天","鸟","秋","池","水","田","云","地","草","冬","石","春","光","雨","花","山","天","?","青","竹","月","鱼","儿","地","蛙","冬","石"],[[[27,33],null,null],[[30,31],null,null],[[6,13],null,null],[[12,7],null,null]],[],[26],[],[],{},null],"33/ja":[["せ","に","え","す","池","う","し","て","い","こ","つ","あ","み","ち","の","く","?","ね","ず","エ","ぬ","お","せ","に","カ","ル","な","う","し","て","い","さ","か","あ","け","ち"],[[[24,19,25],null,null],[[31,32,26],null,null],[[12,18],null,null],[[4],null,null]],[],[16],[],[],{},null],"33/ko":[["바","파","?","못","바","파","냇","파","연","파","바","파","물","파","개","파","물","파","바","파","구","고","바","파","바","리","기","파","바","파","바","파","바","파","바","파"],[[[14,20,25],null,null],[[16,21,26],null,null],[[6,12],null,null],[[8,3],null,null]],[],[2],[],[],{},null],"33/es":[["H","O","V","C","J","a","X","E","z","S","Z","g","u","e","e","I","a","u","a","q","?","p","n","M","n","t","s","a","r","C","J","Q","e","E","L","S"],[[[28,27,22,16],null,null],[[21,14,8],null,null],[[5,11,17,16],null,null],[[32,26,25,18,24,19,12,13],null,null]],[],[20],[],[],{},null],"33/pt-BR":[["o","g","V","C","J","Q","X","a","a","S","Z","G","N","l","B","I","P","W","D","K","R","Y","a","M","r","?","x","i","g","u","J","ã","e","e","p","á"],[[[24,31],null,null],[[34,33,27,26,32],null,null],[[35,28,29,22],null,null],[[13,8,1,0,7],null,null]],[],[25],[],[],{},null],"33/fr":[["H","O","V","l","J","Q","X","u","i","e","l","e","o","n","e","a","?","W","D","g","r","n","u","M","T","n","a","g","p","i","é","t","o","s","s","o"],[[[19,20,14,13,12,7,8,3,10,11],null,null],[[28,35,29,34,33,32,25],null,null],[[9,15,22],null,null],[[30,31,26,21,27],null,null]],[],[16],[],[],{},null],"33/de":[["L","r","h","?","F","Z","F","o","c","r","i","s","C","K","s","e","c","P","Y","a","W","s","h","e","S","B","J","h","T","i","O","X","E","M","c","C"],[[[6,1,7,14,8,2],null,null],[[4,10,11,16,22],null,null],[[20,19,14,21,15,9],null,null],[[28,23,29,34,27],null,null]],[],[3],[],[],{},null],"33/it":[["H","O","V","e","p","Q","X","E","s","e","c","G","N","U","a","t","s","W","D","K","g","n","?","M","a","A","u","o","r","C","c","q","a","a","n","a"],[[[28,33,34,35],null,null],[[4,9,16,10,3],null,null],[[24,30,31,26,32],null,null],[[8,15,14,20,21,27],null,null]],[],[22],[],[],{},null],"33/ru":[["Д","Л","Т","?","Г","К","С","Ш","В","Й","о","Ч","л","г","а","д","А","в","О","я","у","ш","Н","Ф","а","ы","р","к","Э","Д","Л","б","п","а","К","С"],[[[12,19,13,20,21,27,33],null,null],[[26,25,31,24],null,null],[[17,10,15,14],null,null],[[32,26,20,15],null,null]],[],[3],[],[],{},null],"33/hi":[["?","इ","ओ","ज","उ","ख","छ","म","घ","आ","ऐ","च","ई","ली","झ","ऊ","नी","अ","ए","ङ","इ","ला","ज","पा","क","में","ब","घ","ता","ऐ","च","ढ","औ","झ","ऊ","ग"],[[[25,31,24],null,null],[[7,6,13],null,null],[[23,16],null,null],[[28,21,26],null,null]],[],[0],[],[],{},null],"33/ar":[["ك","ة","غ","ت","ش","ن","س","م","ي","ز","ل","ج","ط","و","ذ","ق","ض","ص","ه","ع","د","ف","ش","ن","ح","ا","ب","?","ل","ة","م","ء","ذ","ر","ك","ص"],[[[16,21,20,19],null,null],[[6,7,0,1],null,null],[[30,25,31],null,null],[[26,33,34,29],null,null]],[],[27],[],[],{},null],"34/en":[["o","f","W","D","K","R","r","g","M","T","A","H","O","V","C","J","Q","X","E","L","S","Z","?","e","e","l","f","o","t","e","K","a","x","f","M","T"],[[[33,27,32],null,null],[[1,6,0,7],null,null],[[28,22,29,23],null,22],[[25,24,31,26],null,null]],[],[22],[],[],{"TREE":22},null],"34/zh-Hant":[["花","山","?","鳥","秋","竹","月","田","青","木","草","冬","石","春","光","蛙","葉","山","天","鳥","秋","竹","狸","樹","雲","地","草","狐","石","春","光","雨","花","山","天","鳥"],[[[27,22],null,null],[[8,15],null,null],[[2,9],null,2],[[23,16],null,null]],[],[2],[],[],{"TREE":2},null],"34/zh-Hans":[["花","叶","天","鸟","秋","竹","月","田","子","地","草","冬","石","春","光","雨","花","山","天","蛙","狐","竹","月","田","云","狸","青","冬","石","春","光","雨","?","山","天","鸟"],[[[20,25],null,null],[[26,19],null,null],[[32],null,32],[[1,8],null,null]],[],[32],[],[],{"TREE":32},null],"34/ja":[["こ","ち","ね","か","す","と","い","け","た","ぬ","お","し","て","あ","っ","そ","?","え","さ","ぱ","カ","は","せ","な","キ","こ","ち","エ","か","す","ツ","ネ","け","た","ル","お"],[[[24,30,31],null,null],[[20,27,34],null,null],[[16],null,16],[[21,14,19],null,null]],[],[16],[],[],{"TREE":16},null],"34/ko":[["차","라","카","우","타","바","파","사","여","아","가","자","다","차","라","나","?","타","나","뭇","사","하","아","가","잎","다","차","라","카","리","타","바","파","사","구","개"],[[[8,3],null,null],[[35,34,29],null,null],[[15,16],null,16],[[18,19,24],null,null]],[],[16],[],[],{"TREE":16},null],"34/es":[["I","P","o","z","K","R","Y","r","r","o","?","H","O","V","b","r","l","X","E","a","j","o","a","N","U","B","I","n","h","D","K","R","r","a","M","T"],[[[3,9,8,7,2],null,null],[[32,33,27,22],null,null],[[10,15,14,9,16],null,10],[[28,21,20,19],null,null]],[],[10],[],[],{"TREE":10},null],"34/pt-BR":[["r","P","a","s","a","R","ã","v","o","p","r","H","o","á","r","J","Q","X","r","L","S","Z","G","N","U","?","I","o","W","a","K","R","Y","f","l","h"],[[[10,4,9,8,3,2],null,null],[[0,6],null,null],[[13,14,7,12,18,25],null,25],[[33,27,34,35,29],null,null]],[],[25],[],[],{"TREE":25},null],"34/fr":[["a","r","o","i","l","l","b","n","M","u","e","r","e","?","e","a","e","X","r","L","r","d","n","N","g","f","i","l","W","D","e","u","e","l","M","T"],[[[11,16,22,15,20,21],null,null],[[24,18,12,7,2,9,3,4,5,10],null,null],[[0,1,6,13,14],null,13],[[25,30,31,26,33,27,32],null,null]],[],[13],[],[],{"TREE":13},null],"34/de":[["M","T","s","c","F","m","G","N","U","h","u","?","Y","H","O","V","D","B","S","Z","r","P","W","t","h","o","F","J","l","t","c","s","U","C","a","B"],[[[4,10,3,9,2],null,null],[[26,20,25,31,30,24],null,null],[[17,11,10,5],null,11],[[35,28,34,29,23],null,null]],[],[11],[],[],{"TREE":11},null],"34/it":[["I","P","W","D","r","a","Y","F","M","T","n","H","o","f","C","o","a","X","g","L","S","e","?","e","l","B","v","b","l","p","K","i","a","o","l","a"],[[[26,33,28,29,23],null,null],[[4,5,10,16],null,null],[[35,34,27,21,22,15],null,22],[[13,12,18,24,31,32],null,null]],[],[22],[],[],{"TREE":22},null],"34/ru":[["Е","т","л","л","и","а","Т","е","с","и","С","с","д","р","г","у","к","И","?","Ц","я","З","ш","а","в","л","Н","Ф","Ю","Е","о","У","Э","Д","Л","Т"],[[[3,4,11,5],null,null],[[25,20,14,15,22,16,23],null,null],[[12,7,13,18,24,30],null,18],[[2,9,8,1],null,null]],[],[18],[],[],{"TREE":18},null],"34/hi":[["ड़ी","आ","ऐ","च","इ","ओ","म","ई","औ","प","ढ","क","?","लो","त्ता","ञ","में","घ","अ","पे","ङ","आ","ऐ","च","इ","ओ","छ","ई","औ","ज","उ","ख","झ","ऊ","ग","ञ"],[[[13,6,0],null,null],[[16,10,11],null,null],[[19,12],null,12],[[9,14],null,null]],[],[12],[],[],{"TREE":12},null],"34/ar":[["ح","ة","ا","ف","ض","ز","م","ر","غ","ت","د","ي","?","ن","ل","ك","ح","ع","ش","ب","ع","ز","و","خ","غ","ت","ط","ث","ر","ق","ذ","ك","ح","ظ","ة","ص"],[[[27,20,14,19],null,null],[[4,3,10,17],null,null],[[18,12,7,1],null,12],[[22,28,29,34],null,null]],[],[12],[],[],{"TREE":12},null],"35/en":[["J","Q","X","E","e","S","Z","G","N","U","n","s","P","W","o","K","?","Y","a","g","l","w","e","t","e","l","J","e","l","r","e","S","Z","G","N","U"],[[[14,21,28],null,null],[[24,18,19,25,30],null,null],[[10,4,11,16],null,16],[[23,29,22,27],null,null]],[],[16],[20],[],{"NEST":16},null],"35/zh-Hant":[["竹","春","光","月","田","雨","木","雲","老","山","天","草","冬","樹","木","鷹","春","光","月","巢","雨","花","雲","地","?","天","草","冬","鷹","秋","竹","春","光","月","貓","頭"],[[[34,35,28],null,null],[[8,15],null,null],[[24,19],null,24],[[13,6],null,null]],[],[24],[14],[],{"NEST":24},null],"35/zh-Hans":[["猫","鹰","光","月","田","雨","头","云","地","山","天","草","冬","石","秋","树","春","老","月","田","雨","花","云","鹰","鸟","天","草","冬","石","秋","竹","?","光","树","田","雨"],[[[0,6,1],null,null],[[17,23],null,null],[[24,31],null,31],[[33],null,null]],[],[31],[15],[],{"NEST":31},null],"35/ja":[["さ","つ","の","?","ロ","ウ","う","こ","ち","ね","ク","フ","と","い","け","木","ぬ","お","し","て","木","く","そ","に","え","さ","つ","の","き","せ","な","う","シ","ワ","ね","か"],[[[11,10,4,5],null,null],[[33,32],null,null],[[3],null,3],[[15],null,null]],[],[3],[20],[],{"NEST":3},null],"35/ko":[["카","마","타","바","?","둥","하","부","엉","자","리","수","라","이","마","타","바","독","사","하","아","나","자","다","차","라","무","마","타","바","파","사","나","아","가","자"],[[[7,8,13],null,null],[[17,11,10],null,null],[[5,4],null,4],[[32,26],null,null]],[],[4],[21],[],{"NEST":4},null],"35/es":[["b","r","X","E","L","S","o","á","N","U","a","á","P","l","D","u","g","l","F","M","T","n","i","o","o","h","b","Q","X","d","L","S","ú","G","?","i"],[[[26,32,25,24],null,null],[[11,16,15,22,17,10],null,null],[[34,35,29,23],null,34],[[7,1,0,6,13],null,null]],[],[34],[21],[],{"NEST":34},null],"35/pt-BR":[["h","?","X","E","L","S","i","n","N","U","e","I","c","n","D","r","R","Y","r","o","o","r","r","á","u","a","a","v","á","g","L","j","Z","i","u","U"],[[[12,19,18,24,31,25],null,null],[[23,29,34,33,26],null,null],[[13,6,7,0,1],null,1],[[28,22,27,20,15,10],null,null]],[],[1],[21],[],{"NEST":1},null],"35/fr":[["J","Q","X","E","e","S","i","G","N","U","B","l","h","b","D","a","g","Y","o","M","a","a","i","O","?","u","J","r","b","E","i","n","Z","r","e","U"],[[[12,6,13,18,25],null,null],[[15,22,16,11,4],null,null],[[31,30,24],null,24],[[21,27,28,33,34],null,null]],[],[24],[20],[],{"NEST":24},null],"35/de":[["R","e","I","B","X","H","l","W","G","a","u","m","u","E","D","B","T","C","K","S","r","J","R","Y","N","s","e","H","P","W","e","?","V","l","d","A"],[[[13,12,6,1],null,null],[[35,34,33,26,20],null,null],[[24,30,25,31],null,31],[[3,9,10,11],null,null]],[],[31],[15],[],{"NEST":31},null],"35/it":[["l","i","u","E","f","u","a","a","q","o","B","g","a","l","b","r","o","Y","F","M","e","A","H","d","V","C","J","r","o","?","L","S","Z","G","n","U"],[[[11,5,4,9],null,null],[[7,8,2,1,0,6],null,null],[[34,29,23,16],null,29],[[12,13,14,20,27,28],null,null]],[],[29],[15],[],{"NEST":29},null],"35/ru":[["Ж","ё","о","р","Е","М","л","р","е","е","Т","о","Г","К","д","о","в","д","Р","Ч","а","д","з","н","А","с","О","в","е","?","Н","Ф","о","Е","М","У"],[[[25,32,27,20],null,null],[[2,7,1,6],null,null],[[29,23,28,22,17,11],null,29],[[14,8,3,9,16,15],null,null]],[],[29],[21],[],{"NEST":29},null],"35/hi":[["च","इ","पे","छ","ला","?","ज","ऊ","ड़","झ","ऋ","स","ञ","ए","घ","पे","ऐ","ङ","आ","ओ","च","इ","औ","छ","ई","क","ब","ल्लू","ख","झ","उ","का","ञ","ए","उ","अ"],[[[34,27],null,null],[[30,31,26],null,null],[[5,11,4],null,5],[[2,8],null,null]],[],[5],[15],[],{"NEST":5},null],"35/ar":[["م","و","ب","ي","ز","ف","ث","ة","ل","خ","ط","?","ذ","غ","ت","س","ش","ح","ع","ن","ا","ب","ي","ز","ف","ق","ب","ل","خ","ش","ه","ذ","غ","ة","ر","ج"],[[[2,1,0,7],null,null],[[18,25,20,26],null,null],[[11,16],null,11],[[29,35,34,33],null,null]],[],[11],[21],[],{"NEST":11},null],"36/en":[["c","e","Y","F","M","T","a","o","O","V","C","J","Q","n","s","e","l","Z","G","N","h","h","l","P","s","D","i","p","d","F","M","e","a","?","l","o"],[[[28,35,34,27,21,26,33],null,33],[[24,31,32,33],null,33],[[7,0,1,6,13],null,null],[[14,20,15,22,16],null,null]],[],[33],[],[],{"DOLPHIN":33,"SEAL":33},null],"36/zh-Hant":[["光","雨","花","山","天","鳥","秋","竹","月","田","雲","海","草","貝","殼","?","洋","雨","花","山","天","海","海","竹","月","田","雲","地","草","冬","石","春","光","雨","花","山"],[[[21,15],null,15],[[22,15],null,15],[[11,16],null,null],[[13,14],null,null]],[],[15],[],[],{"DOLPHIN":15,"SEAL":15},null],"36/zh-Hans":[["光","雨","花","豚","天","鸟","秋","竹","?","田","云","地","草","冬","石","海","光","雨","花","山","天","鸟","秋","竹","月","田","云","地","草","壳","石","洋","海","雨","贝","山"],[[[8,3],null,8],[[15,8],null,8],[[32,31],null,null],[[34,29],null,null]],[],[8],[],[],{"DOLPHIN":8,"SEAL":8},null],"36/ja":[["せ","な","え","さ","み","の","く","そ","に","殻","貝","う","あ","け","た","ぬ","か","す","と","イ","こ","ラ","シ","き","せ","ア","?","カ","つ","の","く","そ","に","お","し","て"],[[[19,26,27],null,26],[[25,26,21,22],null,26],[[11,4],null,null],[[10,9],null,null]],[],[26],[],[],{"DOLPHIN":26,"SEAL":26},null],"36/ko":[["자","나","자","나","고","?","자","나","자","돌","자","물","자","나","조","나","기","나","자","나","개","데","자","나","자","나","껍","나","자","양","자","나","자","나","대","나"],[[[9,4,5],null,5],[[11,5],null,5],[[34,29],null,null],[[14,20,26,21,16],null,null]],[],[5],[],[],{"DOLPHIN":5,"SEAL":5},null],"36/es":[["K","a","Y","F","M","T","e","l","h","V","C","o","?","f","í","c","c","o","c","n","f","é","n","c","W","o","a","n","Y","F","M","T","A","o","O","V"],[[[12,6,7,13,14,19],null,12],[[20,25,18,12],null,12],[[11,16,21,26,27,33],null,null],[[23,17,22,15,8,1],null,null]],[],[12],[],[],{"DOLPHIN":12,"SEAL":12},null],"36/pt-BR":[["K","R","Y","o","c","T","g","H","O","e","n","c","o","X","c","L","a","h","l","N","o","n","a","P","f","n","?","o","Y","a","i","T","A","o","c","V"],[[[6,12,18,24,30,25,26,27],null,26],[[26,33,34,29],null,26],[[20,14,9,16,21,27],null,null],[[4,3,10,11,17,22],null,null]],[],[26],[],[],{"DOLPHIN":26,"SEAL":26},null],"36/fr":[["a","n","Y","a","l","T","é","H","g","i","l","J","c","e","E","u","u","q","o","p","a","p","o","c","h","q","?","R","h","F","M","T","e","i","n","V"],[[[26,20,15,21,28,33,34],null,26],[[19,24,18,25,26,32],null,26],[[18,12,6,0,1],null,null],[[23,22,17,16,9,10,4,3,8,13],null,null]],[],[26],[],[],{"DOLPHIN":26,"SEAL":26},null],"36/de":[["S","Z","H","Q","Y","G","P","X","i","N","R","E","L","f","l","?","D","n","c","s","b","e","a","e","h","u","b","G","z","X","M","e","l","E","L","O"],[[[16,21,14,13,8,15],null,15],[[10,15,20,26,31],null,15],[[35,28,23,22,17],null,null],[[30,25,19,18,24,31,32],null,null]],[],[15],[],[],{"DOLPHIN":15,"SEAL":15},null],"36/it":[["K","n","i","?","a","T","A","o","f","e","o","c","n","X","l","a","o","Z","c","o","c","i","a","c","h","g","l","R","n","e","M","i","A","o","O","V"],[[[3,9,14,8,2,1,7],null,3],[[3,10,11,4],null,3],[[16,23,29,22,28,33],null,null],[[20,19,12,18,24,31,25,26,21,15],null,null]],[],[3],[],[],{"DOLPHIN":3,"SEAL":3},null],"36/ru":[["З","О","а","к","ш","Н","Ф","Ю","р","а","ь","у","о","Л","Т","Щ","к","н","С","к","н","Й","л","?","е","а","П","т","ю","е","О","н","и","ф","ь","л"],[[[23,29,35,34,33,32,31],null,23],[[27,28,22,23,17,10],null,23],[[12,19,24,25,20],null,null],[[8,9,16,11,4,3,2],null,null]],[],[23],[],[],{"DOLPHIN":23,"SEAL":23},null],"36/hi":[["छ","ल्फ़ि","डॉ","ज","हा","म","?","प","ख","ञ","ग","सा","ल","ए","सी","र","ऐ","च","इ","ओ","छ","ई","औ","ज","उ","क","झ","ऊ","ख","ञ","ऋ","घ","अ","ए","ङ","आ"],[[[2,1,6],null,6],[[6,12],null,6],[[5,4,11,10,15],null,null],[[14,7],null,null]],[],[6],[],[],{"DOLPHIN":6,"SEAL":6},null],"36/ar":[["?","ي","غ","ث","ش","و","ق","م","ف","د","ه","خ","ة","ة","ز","ل","ج","ض","ف","ر","غ","ث","ش","و","د","ع","ت","ط","م","خ","ظ","ص","ز","ي","ح","ض"],[[[9,15,8,1,0],null,0],[[0,6,7,12],null,0],[[28,34,33,27],null,null],[[31,24,18,13],null,null]],[],[0],[],[],{"DOLPHIN":0,"SEAL":0},null],"37/en":[["o","i","o","G","N","U","?","c","n","r","D","K","l","p","e","l","a","A","a","o","a","C","J","Q","h","d","L","n","Z","G","w","U","B","I","P","W"],[[[30,24,18,12,6],null,6],[[25,19,12,13,6,1,8],null,6],[[7,2,9,16,15],null,null],[[0,7,14,20,27],null,null]],[],[6],[],[],{"WHALE":6,"DOLPHIN":6},null],"37/zh-Hant":[["海","月","田","雲","?","草","珊","洋","春","光","魚","海","山","瑚","鳥","秋","竹","月","田","雲","地","草","冬","石","春","光","雨","花","山","天","鳥","秋","竹","月","田","雲"],[[[4,10],null,4],[[11,4],null,4],[[6,13],null,null],[[0,7],null,null]],[],[4],[],[],{"WHALE":4,"DOLPHIN":4},null],"37/zh-Hans":[["竹","月","田","云","地","草","冬","石","春","光","雨","花","珊","天","鸟","鲸","竹","月","瑚","云","?","草","冬","石","春","海","洋","海","山","天","鸟","秋","竹","月","田","云"],[[[15,20],null,20],[[27,20],null,20],[[12,18],null,null],[[25,26],null,null]],[],[20],[],[],{"WHALE":20,"DOLPHIN":20},null],"37/ja":[["ル","に","お","う","み","あ","?","カ","ぬ","か","す","と","ジ","ラ","ち","ね","き","せ","な","え","さ","つ","の","く","そ","ゴ","ン","サ","て","あ","け","た","ぬ","か","す","と"],[[[6,12,13],null,6],[[6,0,7],null,6],[[27,26,25],null,null],[[3,4],null,null]],[],[6],[],[],{"WHALE":6,"DOLPHIN":6},null],"37/ko":[["차","다","호","산","차","다","차","다","차","다","차","다","차","다","차","다","차","다","차","다","고","?","래","다","차","다","돌","다","차","대","차","다","차","다","차","양"],[[[20,21],null,21],[[26,21,22],null,21],[[3,2],null,null],[[29,35],null,null]],[],[21],[],[],{"WHALE":21,"DOLPHIN":21},null],"37/es":[["L","S","Z","G","N","U","B","l","P","W","o","K","a","d","c","M","c","A","e","r","o","é","J","a","l","n","b","a","n","n","N","f","?","l","e","o"],[[[26,27,32,33,34,29,23],null,32],[[13,18,24,31,32,25],null,32],[[14,20,19,12,7],null,null],[[10,16,21,27,28,35],null,null]],[],[32],[],[],{"WHALE":32,"DOLPHIN":32},null],"37/pt-BR":[["L","S","Z","G","n","U","B","o","e","a","e","o","R","c","a","i","b","l","o","c","o","g","f","?","a","r","L","l","n","o","l","U","B","I","h","W"],[[[16,23,17,10,15,14],null,23],[[21,20,27,22,23,28,34,29],null,23],[[19,18,25,24,30],null,null],[[7,13,8,9,4,11],null,null]],[],[23],[],[],{"WHALE":23,"DOLPHIN":23},null],"37/fr":[["r","S","Z","é","c","U","a","o","n","a","o","K","c","i","a","i","n","A","l","d","h","u","J","e","X","a","l","?","n","G","N","b","B","e","P","W"],[[[31,25,26,33,27,28,23],null,27],[[19,14,21,27,20,15,8],null,27],[[12,7,0,6,13,18],null,null],[[10,4,3,9,16],null,null]],[],[27],[],[],{"WHALE":27,"DOLPHIN":27},null],"37/de":[["S","A","I","R","Z","H","i","Y","D","P","z","e","n","f","?","e","O","a","K","l","B","a","l","n","o","l","e","H","Q","Y","a","r","X","F","N","V"],[[[14,21,22],null,14],[[8,15,14,13,6,12],null,14],[[18,24,31,30,25,19,26],null,null],[[16,10,11,17,23],null,null]],[],[14],[],[],{"WHALE":14,"DOLPHIN":14},null],"37/it":[["?","i","Z","G","N","U","o","a","f","o","o","K","l","e","l","c","n","A","n","a","e","e","a","Q","X","d","l","a","o","G","c","o","r","l","P","W"],[[[0,7,12,13,18,19],null,0],[[25,20,14,8,1,0,6],null,0],[[30,31,32,27,26,33,28],null,null],[[9,15,21,22,16,10],null,null]],[],[0],[],[],{"WHALE":0,"DOLPHIN":0},null],"37/ru":[["?","ь","т","л","З","О","л","и","Ж","л","Ф","Ю","е","М","н","а","Д","Л","д","н","а","р","к","Ш","В","Й","Р","е","о","о","П","Ц","А","З","к","Х"],[[[0,7,2],null,0],[[18,12,6,1,0,7,14],null,0],[[22,28,21,15,9,3],null,null],[[29,34,27,20,19],null,null]],[],[0],[],[],{"WHALE":0,"DOLPHIN":0},null],"37/hi":[["ज","उ","क","झ","हा","ख","ञ","डॉ","ल","सा","म","ङ","ल्फ़ि","?","च","र","ग","छ","ई","औ","ज","उ","क","झ","ऊ","मूँ","ञ","ऋ","घ","अ","ए","गा","आ","ऐ","च","इ"],[[[13,8],null,13],[[7,12,13],null,13],[[25,31],null,null],[[10,4,9,16,15],null,null]],[],[13],[],[],{"WHALE":13,"DOLPHIN":13},null],"37/ar":[["ص","ه","ش","ك","س","ق","ز","غ","ذ","ع","خ","ظ","ل","د","ا","ن","ه","ش","ف","?","ق","ج","غ","ط","و","ي","ر","ث","م","ي","ت","ه","م","ك","س","ح"],[[[19,24,30],null,19],[[13,12,18,25,19],null,19],[[32,26,21,14,15],null,null],[[28,35,29,23],null,null]],[],[19],[],[],{"WHALE":19,"DOLPHIN":19},null],"38/en":[["M","T","A","H","O","V","C","o","r","X","h","s","S","c","G","N","l","i","I","P","k","D","f","l","e","l","t","r","e","s","e","V","?","u","Q","h"],[[[26,33,27,32,25,24],null,32],[[22,17,11,10],null,null],[[8,7,13,20],null,null],[[29,35,28,23,16],null,null]],[],[32],[30],[],{"TURTLE":32},null],"38/zh-Hant":[["山","天","殼","冬","鳥","秋","竹","春","光","貝","田","雨","魚","雲","魚","山","天","草","冬","兒","秋","海","春","光","月","田","岩","?","雲","地","山","天","石","冬","鳥","秋"],[[[21,27],null,27],[[14,19],null,null],[[26,32],null,null],[[9,2],null,null]],[],[27],[12],[],{"TURTLE":27},null],"38/zh-Hans":[["山","天","草","冬","鸟","秋","竹","春","光","月","岩","雨","花","鱼","地","山","天","石","儿","鸟","秋","竹","岩","光","月","田","?","壳","云","地","山","龟","贝","冬","鸟","秋"],[[[26,31],null,26],[[13,18],null,null],[[10,17],null,null],[[32,27],null,null]],[],[26],[22],[],{"TURTLE":26},null],"38/ja":[["て","殻","こ","つ","あ","け","ち","の","貝","た","岩","き","そ","ぬ","お","せ","に","え","す","岩","な","し","?","い","こ","つ","か","ガ","ち","ウ","く","さ","ね","き","ミ","ぬ"],[[[29,34,27,22],null,22],[[31,26,20],null,null],[[19],null,null],[[8,1],null,null]],[],[22],[10],[],{"TURTLE":22},null],"38/ko":[["라","타","사","하","고","물","카","마","파","바","가","기","라","데","위","하","자","북","기","껍","기","아","가","거","라","개","사","하","다","?","카","조","파","아","가","차"],[[[29,28,23,17],null,29],[[5,4,11],null,null],[[9,14],null,null],[[31,25,19,13,20],null,null]],[],[29],[18],[],{"TURTLE":29},null],"38/es":[["M","m","A","p","e","t","a","J","a","z","E","o","S","r","G","g","u","r","i","P","o","c","c","?","h","n","o","a","A","o","c","a","C","J","Q","r"],[[[5,11,17,23,16,15,8,1,6,13,18,25,31],null,23],[[3,4,9],null,null],[[35,29,22,27],null,null],[[21,26,25,30,24,31],null,null]],[],[23],[20],[],{"TURTLE":23},null],"38/pt-BR":[["i","e","p","a","h","r","x","e","g","r","c","o","m","a","u","t","a","r","a","r","a","D","?","o","Y","r","h","a","c","n","O","V","i","n","h","c"],[[[22,16,9,15,20,19,14,8,13,12,18,25,32,33,26,27],null,22],[[2,7,0,6,1],null,null],[[17,11,10,4,3],null,null],[[28,23,29,35,34,27],null,null]],[],[22],[5],[],{"TURTLE":22},null],"38/fr":[["e","m","u","t","o","r","e","?","e","c","r","t","r","n","p","h","e","o","n","o","s","o","c","o","Y","a","e","s","i","q","O","g","l","l","u","X"],[[[11,17,10,3,2,8,7,0,1,6,12],null,7],[[14,21,28,27,20,19,13],null,null],[[5,4,9,15,16,10],null,null],[[22,23,29,34,28,33,32,25,31,26],null,null]],[],[7],[18],[],{"TURTLE":7},null],"38/de":[["M","u","F","c","e","F","e","k","s","i","h","l","r","t","d","l","h","s","ö","i","r","e","c","I","F","h","s","e","s","s","J","c","e","?","O","V"],[[[33,32,27,20,21,28,29,22,16,9,15,14,7,12,18,13,6],null,33],[[24,19,26,31,25],null,null],[[5,4,11,17],null,null],[[0,1,8,3,10,4,11],null,null]],[],[33],[2],[],{"TURTLE":33},null],"38/it":[["r","o","e","H","t","a","s","c","i","a","r","t","p","e","c","a","a","B","a","i","r","a","m","r","l","n","h","a","o","?","g","i","c","n","g","c"],[[[4,5,10,11,16,23,29,34,27,22,21,20,19,25,18],null,29],[[12,13,6,7,2],null,null],[[0,1,7,14,8,9],null,null],[[35,28,33,32,26,31,30,24,19,18],null,null]],[],[29],[15],[],{"TURTLE":29},null],"38/ru":[["Й","р","а","б","р","е","а","а","к","ы","п","р","к","а","к","а","а","е","у","ш","е","м","х","ч","Г","н","о","а","я","а","ь","Ч","р","?","к","Ц"],[[[21,26,32,33,34,29,28,23,17,11,5,10,16,22,27],null,33],[[4,9,3,2],null,null],[[8,15,21,20,25,30],null,null],[[1,6,12,18,19,14,13],null,null]],[],[33],[7],[],{"TURTLE":33},null],"38/hi":[["ऊ","स","इ","ओ","च","न","घ","?","औ","ञ","ए","ट्टा","उ","ख","द्री","ऐ","ज","ऊ","सी","इ","छु","क","म","ली","प","आ","आ","ए","छ","उ","ख","अ","ऐ","ज","ऊ","ग"],[[[1,7,14,21,20,26],null,7],[[22,28,23],null,null],[[4,11,5],null,null],[[18,24],null,null]],[],[7],[25],[],{"TURTLE":7},null],"38/ar":[["د","ة","ط","و","ض","ه","ف","ص","ف","ق","ذ","غ","س","ة","?","ا","ب","ط","ص","ل","ر","ة","ح","ز","ك","خ","س","ر","ع","ر","ة","م","ط","ة","ي","ه"],[[[12,19,14,8,15,21,16,22,29,34,33],null,14],[[26,31,24,30],null,null],[[18,25,20,13],null,null],[[7,0,6,1],null,null]],[],[14],[27],[],{"TURTLE":14},null],"39/en":[["N","r","B","I","P","f","D","o","R","Y","o","M","T","c","o","g","r","e","J","Q","k","r","s","S","o","x","N","?","t","I","f","W","D","K","R","Y"],[[[30,24,25],null,null],[[27,21,14,15],null,27],[[1,7,13,20],null,null],[[5,10,16,17,22,28],null,null]],[],[27],[],[],{"FROG":27},null],"39/zh-Hant":[["雲","地","岩","天","草","冬","鳥","狸","石","春","光","月","田","雨","狐","雲","地","山","天","草","冬","?","青","竹","春","光","月","田","雨","花","雲","地","山","天","林","森"],[[[14,7],null,null],[[22,21],null,21],[[2,8],null,null],[[35,34],null,null]],[],[21],[],[],{"FROG":21},null],"39/zh-Hans":[["云","地","山","天","草","冬","鸟","?","竹","春","岩","月","田","雨","蛙","云","地","石","天","狐","冬","鸟","秋","竹","狸","森","月","田","雨","花","云","林","山","天","草","冬"],[[[19,24],null,null],[[7,14],null,7],[[10,17],null,null],[[25,31],null,null]],[],[7],[],[],{"FROG":7},null],"39/ja":[["そ","に","え","さ","?","カ","き","キ","な","ネ","こ","エ","ね","岩","ツ","と","い","け","た","ぬ","お","し","て","あ","く","り","に","え","さ","つ","も","き","せ","な","う","こ"],[[[7,14,9],null,null],[[5,11,4],null,4],[[13],null,null],[[30,25],null,null]],[],[4],[],[],{"FROG":4},null],"39/ko":[["마","바","아","가","차","라","타","사","위","나","다","카","마","파","무","구","?","라","타","숲","하","자","개","카","마","파","아","여","차","라","타","사","우","자","다","카"],[[[27,32],null,null],[[22,15,16],null,16],[[1,8],null,null],[[9,14,19],null,null]],[],[16],[],[],{"FROG":16},null],"39/es":[["N","U","B","I","P","W","e","K","o","Y","a","M","s","u","r","O","r","n","q","o","r","E","L","?","Z","o","b","r","B","I","z","W","o","c","a","Y"],[[[30,25,20,14,8],null,null],[[16,10,17,23],null,23],[[27,32,33,34],null,null],[[26,19,12,18,13,6],null,null]],[],[23],[],[],{"FROG":23},null],"39/pt-BR":[["N","f","l","a","h","W","D","o","r","Y","c","o","T","t","e","O","V","r","a","s","a","?","o","p","Z","G","r","s","a","I","P","W","D","K","R","r"],[[[35,28,23,22,27,20],null,null],[[26,21],null,21],[[17,11,10,4,3],null,null],[[1,2,7,8,14,19,13,18],null,null]],[],[21],[],[],{"FROG":21},null],"39/fr":[["r","o","f","r","e","W","ê","l","l","Y","F","n","e","t","i","O","a","r","J","Q","e","u","o","d","Z","r","h","?","n","I","r","o","c","e","g","Y"],[[[3,4,11,16,17,23],null,null],[[34,27,33,28,22,21,14,8,7,12],null,27],[[30,31,32,26,20,25],null,null],[[2,1,0,6,13],null,null]],[],[27],[],[],{"FROG":27},null],"39/de":[["F","Y","G","N","d","C","e","R","Z","W","O","l","s","l","S","o","a","P","X","E","s","s","r","J","h","?","G","h","F","C","F","u","c","H","O","V"],[[[30,31,32,27,21],null,null],[[28,22,15,20,25,24],null,25],[[0,6,13,12],null,null],[[9,16,11,4],null,null]],[],[25],[],[],{"FROG":25},null],"39/it":[["N","U","B","a","i","W","D","r","R","c","c","M","o","e","a","O","a","o","f","t","s","E","r","?","v","p","l","U","a","r","e","o","D","K","R","Y"],[[[24,31,26,25,30],null,null],[[29,28,23,16],null,23],[[22,17,10,9,4,3],null,null],[[18,12,7,13,20,19,14],null,null]],[],[23],[],[],{"FROG":23},null],"39/ru":[["г","?","к","а","Й","Р","я","у","И","л","с","А","л","О","Х","е","с","а","Ф","Ю","Е","к","и","л","ь","н","Т","а","Г","К","С","е","м","Й","Р","Ч"],[[[23,22,16,17],null,null],[[12,6,0,7,1,2,3],null,1],[[21,27,32,31,25,24],null,null],[[9,15,10],null,null]],[],[1],[],[],{"FROG":1},null],"39/hi":[["ई","औ","ञ","ऋ","न","ट्टा","ओ","झ","ऊ","घ","आ","च","ज","ड़ी","ख","अ","ए","छ","ई","म","ग","जं","ङ","इ","ओ","लो","ल","घ","में","ऐ","ज","उ","?","ढ","ए","छ"],[[[25,19,13],null,null],[[28,33,32],null,32],[[11,5,4],null,null],[[21,20,26],null,null]],[],[32],[],[],{"FROG":32},null],"39/ar":[["ط","ع","د","ن","ة","ك","?","ف","ي","ش","ب","ز","م","ح","ص","ب","غ","ا","س","ن","ذ","خ","ل","ظ","ي","ش","ه","ر","ة","ع","ق","ت","ط","و","س","ث"],[[[35,29,22,15],null,null],[[6,7,2,1],null,6],[[14,21,27,28],null,null],[[16,17,10,4],null,null]],[],[6],[],[],{"FROG":6},null],"40/en":[["O","V","C","J","Q","X","a","e","S","Z","r","N","g","?","I","o","W","D","K","e","c","w","n","T","A","H","o","d","i","J","Q","X","E","w","l","Z"],[[[7,6,12,13,19],null,13],[[26,33,34],null,null],[[21,28,22,27],null,null],[[10,15,20,13],null,13]],[],[13],[],[],{"EAGLE":13,"ROCK":13},null],"40/zh-Hant":[["秋","竹","秋","竹","秋","竹","秋","石","秋","竹","頭","鷹","秋","竹","?","貓","秋","風","秋","老","秋","竹","山","竹","秋","竹","秋","竹","秋","竹","秋","竹","秋","竹","秋","竹"],[[[19,14],null,14],[[15,10,11],null,null],[[22,17],null,null],[[14,7],null,14]],[],[14],[],[],{"EAGLE":14,"ROCK":14},null],"40/zh-Hans":[["老","?","云","地","山","天","草","冬","石","秋","竹","春","光","月","田","风","花","云","地","山","天","草","猫","鸟","秋","竹","春","光","头","田","雨","花","云","鹰","山","天"],[[[0,1],null,1],[[22,28,33],null,null],[[15],null,null],[[1,8],null,1]],[],[1],[],[],{"EAGLE":1,"ROCK":1},null],"40/ja":[["た","ぬ","お","し","て","あ","く","ウ","ロ","フ","さ","つ","の","き","せ","ク","う","こ","ち","ね","か","?","と","風","け","た","ワ","お","し","て","あ","く","そ","に","え","さ"],[[[26,21],null,21],[[9,15,8,7],null,null],[[23],null,null],[[21],null,21]],[],[21],[],[],{"EAGLE":21,"ROCK":21},null],"40/ko":[["나","차","수","카","라","타","마","파","?","독","아","가","자","나","바","다","카","라","타","마","파","사","하","아","이","부","나","차","다","카","라","엉","마","람","바","하"],[[[9,2,8],null,8],[[25,31,24],null,null],[[34,33],null,null],[[14,8],null,8]],[],[8],[],[],{"EAGLE":8,"ROCK":8},null],"40/es":[["O","l","C","n","a","c","a","i","e","Z","t","o","U","i","u","g","?","o","K","v","Y","F","M","T","A","H","b","V","C","J","Q","o","h","ú","S","Z"],[[[16,15,14,7,1,6],null,16],[[26,33,32,31],null,null],[[19,13,8,3,10,17],null,null],[[16,11,5,4],null,16]],[],[16],[],[],{"EAGLE":16,"ROCK":16},null],"40/pt-BR":[["O","V","C","j","u","X","E","L","S","a","c","r","U","B","a","P","o","n","K","R","h","o","t","e","i","a","c","V","C","v","r","?","g","á","S","Z"],[[[33,32,31,24,25],null,31],[[10,16,11,4,3,9],null,null],[[29,23,17,22,21],null,null],[[30,31,26,20,14],null,31]],[],[31],[],[],{"EAGLE":31,"ROCK":31},null],"40/fr":[["O","v","e","J","u","X","E","L","n","o","g","e","U","t","I","b","i","l","K","R","i","F","r","?","A","H","O","h","o","h","Q","X","E","L","r","e"],[[[23,16,10,17,11],null,23],[[27,20,15,9,4],null,null],[[1,2,8,13],null,null],[[22,28,23,29,35,34],null,23]],[],[23],[],[],{"EAGLE":23,"ROCK":23},null],"40/de":[["V","G","N","E","D","M","T","C","l","e","u","K","R","d","J","Q","r","l","?","W","H","O","e","G","e","s","i","M","T","C","F","S","n","d","R","Z"],[[[18,13,8,9,16],null,18],[[3,10,17,22],null,null],[[19,26,32,33],null,null],[[30,24,18,25],null,18]],[],[18],[],[],{"EAGLE":18,"ROCK":18},null],"40/it":[["O","V","c","J","g","X","E","l","?","i","a","u","U","B","i","o","W","f","K","R","u","r","o","v","A","q","O","n","e","J","Q","X","a","t","o","Z"],[[[32,25,20,14,7,8],null,8],[[4,11,17,22],null,null],[[23,28,27,33,34],null,null],[[21,15,8,2,9,10],null,8]],[],[8],[],[],{"EAGLE":8,"ROCK":8},null],"40/ru":[["Л","Т","Щ","в","К","С","Ш","В","т","е","Ч","Б","И","П","Ц","е","З","О","Х","Я","р","Н","а","к","в","а","У","ё","н","?","с","о","л","ь","р","е"],[[[29,34,27,32],null,29],[[30,31,24,25],null,null],[[3,9,8,15,20],null,null],[[23,22,29,35,28,33],null,29]],[],[29],[],[],{"EAGLE":29,"ROCK":29},null],"40/hi":[["इ","ब","?","ऊ","ख","ञ","ए","उ","च","न","छ","ई","क","ल्लू","ऋ","ग","अ","ऐ","वा","इ","उ","ज","ऊ","ख","ह","ए","घ","आ","ओ","छ","ई","क","झ","ऋ","ग","अ"],[[[7,2,1],null,2],[[20,13],null,null],[[24,18],null,null],[[8,2,9],null,2]],[],[2],[],[],{"EAGLE":2,"ROCK":2},null],"40/ar":[["س","ك","د","ظ","ت","ش","ل","ذ","ة","م","ض","ن","ز","ف","ج","و","ر","ي","ك","د","ظ","ب","ش","ا","ذ","ة","ص","ب","ع","ح","ف","ج","ر","?","ا","ك"],[[[28,33,34,27],null,33],[[21,15,9,8],null,null],[[16,17,23,29],null,null],[[26,33,32,25],null,33]],[],[33],[],[],{"EAGLE":33,"ROCK":33},null],"41/en":[["n","d","?","s","R","Y","i","n","u","o","H","f","V","w","g","Q","r","E","L","S","Z","G","N","U","B","I","P","W","h","f","R","Y","F","M","s","i"],[[[13,6,0,1],null,null],[[3,8,7],null,null],[[11,16,9,14],null,null],[[29,35,34,28],null,null]],[],[2],[],[],{},null],"41/zh-Hant":[["?","陽","太","花","雲","地","兒","天","鳥","冬","風","秋","魚","春","光","月","山","雨","花","雲","地","青","蛙","鳥","冬","石","秋","竹","春","光","月","田","雨","花","雲","地"],[[[16,10],null,null],[[2,1],null,null],[[21,22],null,null],[[12,6],null,null]],[],[0],[],[],{},null],"41/zh-Hans":[["山","天","鸟","青","?","鱼","田","云","蛙","草","儿","石","风","光","雨","花","山","天","鸟","秋","竹","月","田","云","太","草","冬","石","春","光","雨","阳","山","天","鸟","秋"],[[[12],null,null],[[24,31],null,null],[[3,8],null,null],[[5,10],null,null]],[],[4],[],[],{},null],"41/ja":[["ぬ","お","せ","に","さ","す","と","う","し","カ","な","か","つ","風","エ","ち","の","く","た","ル","き","そ","ぬ","お","せ","?","え","す","と","う","し","て","陽","太","つ","あ"],[[[13],null,null],[[33,32],null,null],[[9,14,19],null,null],[[4,11,10],null,null]],[],[25],[],[],{},null],"41/ko":[["람","?","라","개","구","파","사","바","아","리","자","나","차","다","카","라","타","마","파","사","하","아","가","자","해","고","물","카","라","타","마","기","사","하","아","가"],[[[7,0],null,null],[[24],null,null],[[3,4,9],null,null],[[26,25,31],null,null]],[],[1],[],[],{},null],"41/es":[["P","r","D","?","o","p","F","M","a","l","e","s","t","o","n","Q","X","z","e","n","a","G","N","U","v","i","P","W","D","K","R","Y","F","M","T","A"],[[[24,25,18,19,12,13],null,null],[[11,4,9],null,null],[[1,8,14,20],null,null],[[5,10,17],null,null]],[],[3],[],[],{},null],"41/pt-BR":[["P","W","o","e","n","Y","F","M","v","t","?","O","V","C","J","r","s","E","L","S","ã","G","o","U","B","p","e","l","D","K","e","i","x","M","T","A"],[[[8,3,4,9,2],null,null],[[16,22,27],null,null],[[15,20],null,null],[[25,30,31,32,26],null,null]],[],[10],[],[],{},null],"41/fr":[["P","W","v","?","p","Y","t","e","s","o","g","O","n","s","i","Q","r","e","o","o","Z","e","N","n","n","l","P","l","u","o","e","i","l","M","l","i"],[[[2,7,12,6],null,null],[[13,18,25,30,31,32],null,null],[[10,16,17,23,29,28,35,34,27,21],null,null],[[4,9,14,8,13,19,24],null,null]],[],[3],[],[],{},null],"41/de":[["U","i","c","h","?","I","F","s","e","N","d","i","S","o","n","J","n","W","s","h","n","E","M","U","c","o","R","A","I","P","r","F","N","V","D","L"],[[[17,11,16,10],null,null],[[12,13,20,14,8],null,null],[[31,30,25,18,24,19],null,null],[[6,1,7,2,3],null,null]],[],[4],[],[],{},null],"41/it":[["P","o","t","K","e","p","F","M","T","n","c","s","V","C","J","Q","e","a","L","S","Z","G","n","v","B","s","r","a","D","K","R","?","o","l","e","A"],[[[23,16,9,2,1],null,null],[[25,32,33,34],null,null],[[26,27,22,17],null,null],[[5,4,11,10,16],null,null]],[],[31],[],[],{},null],"41/ru":[["М","л","у","г","Л","Т","н","ц","я","ш","Ш","В","е","л","с","а","к","П","р","ы","о","т","Х","Я","б","а","?","е","е","М","У","Э","в","р","Т","Щ"],[[[32,27,21,28,33],null,null],[[14,20,13,6,7,12],null,null],[[1,8,3,2,9,16,15],null,null],[[18,19,24,25],null,null]],[],[26],[],[],{},null],"41/hi":[["ऊ","ग","आ","ऐ","?","ढ","ख","अ","ए","ङ","में","क","ञ","ऋ","घ","इ","ओ","झ","सू","म","छ","ऐ","च","उ","ख","र","ली","ङ","ह","वा","ञ","ज","घ","इ","ओ","झ"],[[[28,29],null,null],[[18,25,31],null,null],[[10,5,11],null,null],[[19,20,26],null,null]],[],[4],[],[],{},null],"41/ar":[["ظ","د","ص","ه","ذ","ل","ع","غ","ف","ض","و","ز","ن","خ","ق","ث","ظ","ب","?","ه","ا","ح","م","غ","ت","ي","ة","ز","س","ش","ق","ر","ك","م","س","ه"],[[[31,25,20,21],null,null],[[29,22,28],null,null],[[9,8,1,6],null,null],[[34,33,32,26],null,null]],[],[18],[],[],{},null],"42/en":[["a","f","f","e","S","Z","i","r","t","B","I","P","g","r","b","e","Y","F","e","T","a","H","O","V","C","e","Q","r","?","e","S","Z","G","N","a","f"],[[[8,13,18,25],null,null],[[28,29,34,35],null,28],[[14,15,20,27],null,null],[[12,6,7,0,1,2,3],null,null]],[],[28],[],[],{"LEAF":28},null],"42/zh-Hant":[["雲","地","草","冬","石","春","光","雨","花","山","木","樹","秋","棕","熊","田","雲","長","草","冬","?","春","鹿","頸","花","山","葉","鳥","秋","竹","月","田","雲","地","草","冬"],[[[11,10],null,null],[[20,26],null,20],[[13,14],null,null],[[17,23,22],null,null]],[],[20],[],[],{"LEAF":20},null],"42/zh-Hans":[["鹿","熊","长","冬","石","春","棕","颈","花","山","天","鸟","秋","竹","月","田","云","地","草","冬","石","树","光","?","花","山","天","鸟","叶","竹","月","田","云","地","草","冬"],[[[21],null,null],[[28,23],null,23],[[6,1],null,null],[[2,7,0],null,null]],[],[23],[],[],{"LEAF":23},null],"42/ja":[["つ","の","木","せ","な","う","こ","ち","ね","か","す","と","い","け","た","?","ぱ","し","ク","マ","は","そ","ン","キ","さ","つ","の","き","リ","な","う","こ","ち","ね","か","す"],[[[2],null,null],[[20,15,16],null,15],[[18,19],null,null],[[23,28,22],null,null]],[],[15],[],[],{"LEAF":15},null],"42/ko":[["마","나","무","파","사","하","아","가","자","기","불","라","카","마","린","곰","파","사","하","아","가","자","다","차","잎","카","마","타","바","파","?","뭇","아","가","자","다"],[[[1,2],null,null],[[30,31,24],null,30],[[10,15],null,null],[[9,14],null,null]],[],[30],[],[],{"LEAF":30},null],"42/es":[["Q","X","E","L","?","á","G","N","o","l","r","j","W","D","K","b","o","F","M","a","A","j","O","h","C","f","i","r","E","s","S","Z","a","N","o","o"],[[[5,10,15,8,9],null,null],[[23,16,11,4],null,4],[[35,29,34],null,null],[[21,26,27,32,25,19],null,null]],[],[4],[],[],{"LEAF":4},null],"42/pt-BR":[["Q","f","E","L","S","Z","u","o","h","B","I","P","r","?","l","R","Y","F","s","r","e","f","O","V","o","á","a","a","i","g","v","r","G","r","U","B"],[[[25,31,30,24,19,20],null,null],[[1,7,14,8,13],null,13],[[6,12,18,24],null,null],[[29,28,33,27,21,26],null,null]],[],[13],[],[],{"LEAF":13},null],"42/fr":[["Q","u","l","L","S","o","e","i","l","e","u","P","W","?","r","s","r","i","M","a","b","e","r","g","C","e","r","f","a","L","S","Z","G","N","U","B"],[[[19,14,20,26,25],null,null],[[13,6,1,7,2,8,9],null,13],[[5,10,16,15],null,null],[[23,17,22,28,27,21],null,null]],[],[13],[],[],{"LEAF":13},null],"42/de":[["U","e","K","R","Y","H","O","f","D","L","S","Z","f","a","r","a","M","T","t","i","u","X","B","N","t","G","B","m","Y","H","?","l","B","ä","r","Z"],[[[22,15,20,27],null,null],[[26,31,30,24,18],null,30],[[32,33,34],null,null],[[25,19,14,13,12,7,1],null,null]],[],[30],[],[],{"LEAF":30},null],"42/it":[["l","i","r","L","S","Z","?","i","a","a","I","a","g","o","s","o","f","f","f","b","o","r","O","V","e","o","l","X","E","L","r","Z","a","N","U","B"],[[[32,26,19,24,30,25],null,null],[[18,13,6,0,1,8],null,6],[[20,21,14,15],null,null],[[12,7,2,9,16,17,11],null,null]],[],[6],[],[],{"LEAF":6},null],"42/ru":[["Н","а","Ю","и","ж","ь","Э","ф","р","е","д","Г","К","С","в","е","Й","Р","Ч","д","И","р","д","л","о","е","е","с","и","Н","Ф","в","м","?","У","Э"],[[[22,15,21,26,31,24],null,null],[[23,28,27,33],null,33],[[32,25,19,14,9,10,5],null,null],[[4,3,8,1,7],null,null]],[],[33],[],[],{"LEAF":33},null],"42/hi":[["अ","ए","घ","अ","लू","घ","अ","ए","घ","भा","ए","घ","अ","ए","घ","अ","?","घ","अ","ए","घ","त्ता","रा","जि","अ","ए","घ","अ","फ़","ड़","अ","ए","घ","अ","पे","घ"],[[[34,29],null,null],[[16,21],null,16],[[9,4],null,null],[[23,22,28],null,null]],[],[16],[],[],{"LEAF":16},null],"42/ar":[["ص","ل","ح","ظ","ب","ة","ك","ث","ط","د","ا","ف","ت","ض","م","خ","ر","ي","ص","ل","ح","ظ","ز","س","ق","ث","و","ش","ذ","غ","?","ر","ة","ر","ج","ي"],[[[27,34,33,32],null,null],[[26,31,24,30],null,30],[[9,4],null,null],[[22,16,10,11,5],null,null]],[],[30],[],[],{"LEAF":30},null],"43/en":[["g","r","l","e","T","A","H","a","s","C","a","f","X","s","L","S","Z","G","N","U","B","I","z","W","a","l","e","a","F","?","e","g","H","O","r","b"],[[[0,1,7,13,8],null,null],[[2,3,10,11],null,null],[[30,24,31,25,26],null,null],[[22,29,35,34,27],null,29]],[],[29],[],[],{"ZEBRA":29},null],"43/zh-Hant":[["秋","竹","春","青","草","田","老","花","?","斑","山","天","鷹","冬","石","秋","竹","春","光","月","田","雨","花","雲","地","樹","天","鳥","冬","石","秋","竹","葉","光","月","田"],[[[3,4],null,null],[[25,32],null,null],[[6,12],null,null],[[9,8],null,8]],[],[8],[],[],{"ZEBRA":8},null],"43/zh-Hans":[["秋","竹","春","光","草","田","子","花","云","地","山","天","叶","冬","石","秋","老","春","光","月","田","鹰","花","云","地","山","天","鸟","?","斑","秋","竹","春","光","月","田"],[[[4],null,null],[[12,6],null,null],[[16,21],null,null],[[29,28],null,28]],[],[28],[],[],{"ZEBRA":28},null],"43/ja":[["て","あ","く","そ","に","え","草","マ","?","マ","せ","な","う","こ","ウ","ね","ワ","シ","と","い","け","た","ぬ","お","し","て","あ","ぱ","っ","に","え","さ","つ","は","き","せ"],[[[6],null,null],[[33,28,27],null,null],[[16,17],null,null],[[8,9,14,7],null,8]],[],[8],[],[],{"ZEBRA":8},null],"43/ko":[["바","파","사","독","아","리","자","다","차","라","수","마","타","바","파","사","하","아","가","나","잎","차","얼","카","풀","뭇","바","룩","사","하","아","가","?","다","차","라"],[[[24],null,null],[[19,25,20],null,null],[[3,10,5],null,null],[[22,27,32],null,32]],[],[32],[],[],{"ZEBRA":32},null],"43/es":[["R","Y","F","M","T","a","H","O","a","C","r","Q","u","á","l","b","e","?","g","i","r","a","P","W","j","a","R","e","i","M","h","o","H","O","V","h"],[[[35,28,27,20,15,8],null,null],[[30,31,24,25],null,null],[[13,18,12,19,14,21],null,null],[[17,16,15,10,5],null,17]],[],[17],[],[],{"ZEBRA":17},null],"43/pt-BR":[["R","Y","m","a","r","g","H","O","V","a","J","Q","X","á","i","l","f","G","g","u","a","h","o","W","D","K","a","?","b","z","T","A","H","O","e","C"],[[[5,4,3,2,9],null,null],[[16,22,15,21,20],null,null],[[13,18,19,14,20],null,null],[[29,34,28,27,26],null,27]],[],[27],[],[],{"ZEBRA":27},null],"43/fr":[["r","e","e","b","h","A","a","b","g","r","e","Q","X","i","è","l","Z","G","e","e","?","I","e","W","l","f","u","Y","F","M","l","i","H","O","V","C"],[[[4,10,9,3,2],null,null],[[25,19,26,31,30,24,18],null,null],[[6,13,8,15,22],null,null],[[20,14,7,0,1],null,20]],[],[20],[],[],{"ZEBRA":20},null],"43/de":[["Y","J","B","b","a","P","W","H","l","?","r","N","t","a","M","T","Z","A","t","C","K","R","Y","d","Q","r","a","P","W","l","G","V","F","s","r","e"],[[[30,25,26,33],null,null],[[2,8,13,12,18],null,null],[[17,23,29,35,34],null,null],[[16,9,3,10,4],null,9]],[],[9],[],[],{"ZEBRA":9},null],"43/it":[["R","Y","f","M","T","A","H","?","o","a","J","Q","e","g","q","S","Z","a","b","l","i","u","i","l","r","a","R","Y","a","b","T","A","H","O","r","e"],[[[35,34,29,28],null,null],[[2,8,13,19,20,25],null,null],[[9,14,21,22,23,17],null,null],[[7,12,18,24,25],null,7]],[],[7],[],[],{"ZEBRA":7},null],"43/ru":[["О","р","Я","в","Н","Ф","т","л","а","о","а","Д","Л","Т","ё","р","К","р","Ш","В","Й","Р","а","б","И","П","л","и","?","О","Х","Я","Ж","т","с","з"],[[[6,1,8,3,10],null,null],[[26,27,34,33],null,null],[[9,15,14,7],null,null],[[35,28,23,17,22],null,28]],[],[28],[],[],{"ZEBRA":28},null],"43/hi":[["ई","क","ज","ऊ","ख","उ","ऋ","ग","स","ए","का","अ","?","प","घा","ब","च","इ","ज़े","त्ता","ई","क","ज","ऊ","ख","झ","ऋ","ग","ञ","ए","घ","अ","ऐ","ङ","आ","ओ"],[[[14,8],null,null],[[13,19],null,null],[[5,10,15],null,null],[[18,12],null,12]],[],[12],[],[],{"ZEBRA":12},null],"43/ar":[["س","و","و","ط","ه","ز","ر","ح","ر","ن","ق","ا","ا","ق","ش","د","ب","ع","م","ي","ة","ط","ه","ز","?","ج","ض","ن","ذ","غ","ث","ص","ع","ش","ب","ت"],[[[32,33,34],null,null],[[2,8,13,20],null,null],[[17,10,11,16],null,null],[[24,18,12,6,1,7,14,19],null,24]],[],[24],[],[],{"ZEBRA":24},null],"44/en":[["S","Z","s","s","U","B","I","a","W","D","K","R","Y","r","g","T","A","H","O","a","C","f","f","f","b","r","a","a","g","e","e","z","e","?","r","i"],[[[14,13,7,2,3],null,null],[[33,32,26,21],null,33],[[31,30,24,25,19],null,null],[[28,35,34,27,22,23,29],null,null]],[],[33],[],[],{"LEAF":33},null],"44/zh-Hant":[["冬","草","秋","竹","春","光","青","斑","?","花","雲","地","馬","葉","鳥","冬","石","秋","竹","春","光","月","田","雨","花","雲","地","山","頸","鳥","冬","石","秋","長","春","鹿"],[[[6,1],null,null],[[8,13],null,8],[[7,12],null,null],[[33,28,35],null,null]],[],[8],[],[],{"LEAF":8},null],"44/zh-Hans":[["草","石","秋","竹","长","光","月","田","雨","花","鹿","颈","山","天","鸟","?","斑","秋","竹","春","光","月","叶","马","花","云","地","山","天","鸟","冬","石","秋","竹","春","光"],[[[0],null,null],[[22,15],null,15],[[16,23],null,null],[[4,11,10],null,null]],[],[15],[],[],{"LEAF":15},null],"44/ja":[["と","い","け","た","ぬ","お","し","て","ぱ","く","そ","に","キ","?","は","の","き","せ","リ","う","こ","ち","マ","マ","す","ン","い","け","ウ","シ","お","し","草","あ","く","そ"],[[[32],null,null],[[14,13,8],null,13],[[29,23,28,22],null,null],[[12,18,25],null,null]],[],[13],[],[],{"LEAF":13},null],"44/ko":[["사","하","아","가","자","다","차","라","카","마","타","바","파","사","린","아","가","나","다","기","라","카","뭇","풀","룩","얼","사","하","?","가","자","말","차","라","카","마"],[[[23],null,null],[[17,22,28],null,28],[[25,24,31],null,null],[[19,14],null,null]],[],[28],[],[],{"LEAF":28},null],"44/es":[["j","r","a","r","b","B","I","i","a","f","e","R","b","F","a","T","A","c","a","r","C","J","h","o","e","L","S","Z","G","?","U","i","h","P","a","D"],[[[32,31,24,19,12,18],null,null],[[22,23,29,34],null,29],[[17,10,4,3,8],null,null],[[0,7,1,2,9,14],null,null]],[],[29],[],[],{"LEAF":29},null],"44/pt-BR":[["S","a","f","a","U","B","I","P","a","m","r","i","Y","F","M","T","a","g","O","V","C","J","f","r","a","b","S","Z","o","h","r","z","e","P","?","l"],[[[17,23,16,9,8],null,null],[[22,28,35,29,34],null,34],[[31,32,25,30,24],null,null],[[17,11,10,3,2,1],null,null]],[],[34],[],[],{"LEAF":34},null],"44/fr":[["è","b","G","e","U","B","z","e","r","b","K","R","l","h","r","e","A","H","l","e","?","f","Q","X","f","i","e","Z","G","N","g","a","r","P","W","D"],[[[13,19,14,9,15],null,null],[[21,26,20,25,18,12,7],null,20],[[6,0,1,8,3],null,null],[[30,25,32,31,24,19],null,null]],[],[20],[],[],{"LEAF":20},null],"44/de":[["X","G","i","r","E","M","T","a","t","a","f","e","r","t","s","N","U","f","G","B","?","J","Q","X","H","l","Z","r","a","T","C","K","b","e","I","P"],[[[18,12,7,14],null,null],[[19,25,20,13,8],null,20],[[26,33,32,27,28],null,null],[[1,2,3,9,10,17,11],null,null]],[],[20],[],[],{"LEAF":20},null],"44/it":[["S","o","g","l","i","z","?","P","W","a","b","e","Y","F","M","T","b","r","O","V","f","J","r","e","a","f","S","a","g","a","U","B","I","i","r","D"],[[[23,17,10,9],null,null],[[6,1,2,3,4,9],null,6],[[5,11,16,22,29],null,null],[[28,33,34,27,20,25,24],null,null]],[],[6],[],[],{"LEAF":6},null],"44/ru":[["т","л","А","З","О","Х","?","и","Н","Ф","Ю","Е","т","р","в","Д","Л","Т","и","ж","а","а","е","з","Й","р","ф","Б","И","б","Ц","а","З","О","а","р"],[[[12,13,20,14,21],null,null],[[1,7,6,0],null,6],[[23,22,29,35,34],null,null],[[19,18,25,31,26],null,null]],[],[6],[],[],{"LEAF":6},null],"44/hi":[["इ","ओ","च","इ","त्ता","?","इ","ओ","च","इ","ओ","च","इ","ओ","च","इ","ओ","च","इ","ओ","च","इ","घा","स","इ","ओ","ब्रा","इ","जि","च","इ","ज़े","च","रा","फ़","च"],[[[22,23],null,null],[[5,4],null,5],[[31,26],null,null],[[28,33,34],null,null]],[],[5],[],[],{"LEAF":5},null],"44/ar":[["ب","ش","ش","ث","ض","ه","ع","و","ح","ي","ج","ط","ر","ا","ز","ر","ق","ة","م","ح","?","ا","ة","ل","د","غ","ج","ف","ت","ص","ن","ذ","ك","خ","ظ","ث"],[[[6,1,0],null,null],[[20,15,16,17],null,20],[[19,18,13,12,7,8,2,9],null,null],[[14,15,21,27,22],null,null]],[],[20],[],[],{"LEAF":20},null],"45/en":[["T","o","w","O","V","C","n","s","X","E","s","S","Z","e","N","x","e","?","i","c","D","f","o","a","F","M","T","A","H","O","V","C","J","Q","X","E"],[[[18,19,13],null,null],[[7,6,1,2],null,null],[[10,16,23,17],null,17],[[21,22,15],null,null]],[],[17],[],[],{"SEAL":17},null],"45/zh-Hant":[["天","?","冬","鳥","冰","石","花","豹","月","光","塊","田","雲","雪","山","天","草","冬","狸","秋","石","春","竹","月","狐","雨","田","雲","地","山","天","草","冬","鳥","秋","石"],[[[4,10],null,null],[[13,6],null,null],[[1,7],null,1],[[24,18],null,null]],[],[1],[],[],{"SEAL":1},null],"45/zh-Hans":[["天","草","花","雪","秋","石","春","竹","海","狸","狐","田","云","地","?","天","草","冬","鸟","秋","石","春","竹","月","光","雨","田","云","地","山","天","草","冬","鸟","冰","石"],[[[34],null,null],[[3,2],null,null],[[8,14],null,14],[[10,9],null,null]],[],[14],[],[],{"SEAL":14},null],"45/ja":[["ぬ","お","す","と","い","こ","ち","ね","か","き","な","う","さ","氷","の","く","ゆ","に","え","し","て","あ","シ","ザ","ネ","お","す","と","?","ラ","ツ","キ","か","せ","な","う"],[[[13],null,null],[[16,9],null,null],[[28,23,29,22],null,28],[[31,30,24],null,null]],[],[28],[],[],{"SEAL":28},null],"45/ko":[["라","카","라","카","라","카","라","카","라","음","라","카","라","이","송","얼","라","카","라","눈","라","카","라","카","라","카","라","카","라","여","라","카","범","?","우","카"],[[[15,9],null,null],[[19,14,13],null,null],[[33,32],null,33],[[29,34],null,null]],[],[33],[],[],{"SEAL":33},null],"45/es":[["T","A","e","i","o","C","J","Q","o","l","h","r","Z","G","e","e","r","I","P","W","v","i","o","z","o","f","T","A","n","O","?","a","J","Q","X","E"],[[[10,3,2,9,8],null,null],[[28,21,15,20,14],null,null],[[25,24,30,31],null,30],[[23,22,16,11,4],null,null]],[],[30],[],[],{"SEAL":30},null],"45/pt-BR":[["T","n","e","O","?","a","J","Q","v","f","L","c","Z","G","e","a","s","o","P","W","o","l","r","p","F","M","e","g","H","a","V","C","J","Q","X","E"],[[[27,26,21,20],null,null],[[1,2,8,14],null,null],[[9,4,11,5],null,4],[[22,29,23,17,16,15],null,null]],[],[4],[],[],{"SEAL":4},null],"45/fr":[["T","A","?","o","V","C","J","p","c","u","q","S","Z","d","e","a","e","I","P","r","l","n","R","g","F","g","a","r","e","i","V","C","J","n","e","E"],[[[25,20,15,8,14],null,null],[[33,34,29,23,16],null,null],[[7,2,3,10,9,14],null,2],[[27,28,21,26,19,13],null,null]],[],[2],[],[],{"SEAL":2},null],"45/de":[["B","K","T","A","J","Q","Z","I","P","Y","R","o","X","E","N","s","b","b","V","C","i","n","S","?","T","A","e","c","h","s","P","Y","e","F","u","c"],[[[13,20,15],null,null],[[22,27,28,21,26,32],null,null],[[10,11,17,16,23],null,23],[[33,34,35,28,29],null,null]],[],[23],[],[],{"SEAL":23},null],"45/it":[["T","A","e","O","V","C","J","p","X","E","L","S","l","v","N","g","h","I","P","o","e","v","i","f","F","c","c","a","e","o","V","i","o","n","?","c"],[[[15,16,22,27,26,25,31,32],null,null],[[33,28,21,20],null,null],[[23,29,35,34],null,34],[[13,19,12,7,2],null,null]],[],[34],[],[],{"SEAL":34},null],"45/ru":[["Р","Ч","Б","а","П","и","А","е","н","Х","с","л","л","ю","?","Е","М","У","Э","т","с","Т","Щ","Г","ё","д","н","е","Й","Р","Ч","л","И","г","Ц","А"],[[[31,24,25],null,null],[[20,26,27,33],null,null],[[19,13,12,7,8,14],null,14],[[11,5,10,3],null,null]],[],[14],[],[],{"SEAL":14},null],"45/hi":[["लो","ङ","ई","औ","?","ऊ","म","ड़ी","ए","घ","ल","ओ","च","उ","क","झ","ऋ","ब","अ","आ","हु","ई","र्फ़","छ","ऊ","मा","पा","ए","घ","इ","ओ","नी","ज","क","झ","ऋ"],[[[32,25,20,19,26,31],null,null],[[17,22],null,null],[[4,10],null,4],[[0,6,7],null,null]],[],[4],[],[],{"SEAL":4},null],"45/ar":[["ص","ه","ر","?","ث","ع","ن","ي","د","م","ل","ك","خ","ل","ق","ز","غ","ب","ج","ه","ف","ظ","ت","ش","ج","ث","ط","ا","س","ك","ل","ض","و","ز","غ","ح"],[[[18,13,7,8],null,null],[[25,30,24],null,null],[[20,14,9,3],null,3],[[4,5,10,17],null,null]],[],[3],[],[],{"SEAL":3},null],"46/en":[["U","B","I","P","W","D","r","R","?","?","M","f","o","c","c","v","o","J","Q","k","E","e","x","Z","G","N","o","w","l","P","W","D","K","R","Y","F"],[[[26,27,28],null,null],[[11,16,22],null,null],[[14,9,15,21],null,9],[[6,12,13,19],null,null]],[],[9,8],[],[],{},null],"46/zh-Hant":[["光","春","光","春","光","春","光","鷹","頭","春","光","春","光","春","貓","狸","光","春","光","春","狐","?","山","?","光","春","光","春","光","岩","光","春","光","春","石","春"],[[[14,8,7],null,null],[[20,15],null,null],[[22,23],null,23],[[29,34],null,null]],[],[23,21],[],[],{},null],"46/zh-Hans":[["头","猫","光","春","光","春","鹰","春","光","春","光","春","光","春","光","春","光","春","光","春","光","春","?","春","狸","狐","光","山","光","岩","光","春","光","春","?","石"],[[[1,0,6],null,null],[[25,24],null,null],[[27,34],null,34],[[29,35],null,null]],[],[34,22],[],[],{},null],"46/ja":[["に","キ","ツ","ネ","?","洞","せ","ク","う","ウ","?","ね","フ","す","ロ","い","け","た","ぬ","お","し","て","あ","く","そ","に","え","さ","岩","の","き","せ","な","う","こ","ち"],[[[12,7,14,9],null,null],[[1,2,3],null,null],[[5,4],null,4],[[28],null,null]],[],[4,10],[],[],{},null],"46/ko":[["자","나","이","엉","?","라","타","마","파","동","부","아","가","자","?","차","다","바","라","타","마","파","우","위","아","가","자","나","여","다","카","라","타","마","파","사"],[[[10,3,2],null,null],[[28,22],null,null],[[9,4],null,4],[[17,23],null,null]],[],[4,14],[],[],{},null],"46/es":[["c","?","e","?","W","D","K","u","a","F","M","T","A","a","o","r","C","J","r","r","c","o","S","Z","G","o","o","h","I","P","W","z","K","b","ú","F"],[[[33,34,27,21],null,null],[[31,25,18,19,26],null,null],[[0,7,2,1,8],null,1],[[15,14,20,13],null,null]],[],[1,3],[],[],{},null],"46/pt-BR":[["r","o","I","v","W","?","j","u","c","e","a","?","A","a","o","r","h","J","Q","s","r","c","n","a","G","a","o","r","a","P","W","D","p","a","Y","F"],[[[8,1,0,7,6,13],null,null],[[27,33,32,26,19,25],null,null],[[11,10,3,9,15,22,28],null,11],[[20,14,21,16,23],null,null]],[],[11,5],[],[],{},null],"46/fr":[["U","B","I","d","W","D","K","a","r","u","o","T","A","n","O","h","e","b","Q","r","e","c","i","r","G","?","t","o","g","h","W","?","o","r","r","F"],[[[29,22,17,10,9],null,null],[[19,20,13,7,8,3],null,null],[[28,33,32,25,26,20],null,25],[[34,27,21,15,16,23],null,null]],[],[25,31],[],[],{},null],"46/de":[["A","F","e","Y","I","P","l","D","N","l","B","L","u","e","F","u","s","G","E","h","c","H","ö","A","s","e","?","h","P","W","D","N","?","B","L","S"],[[[18,12,6,13],null,null],[[14,15,20,19,24],null,null],[[21,22,27,32,25],null,32],[[1,2,9,16],null,null]],[],[32,26],[],[],{},null],"46/it":[["U","B","o","p","W","D","K","r","v","l","e","o","c","o","O","V","C","f","c","a","E","g","u","Z","i","N","g","?","t","t","W","D","K","r","?","a"],[[[21,22,17,11],null,null],[[8,2,9,3,10],null,null],[[26,33,34,28,29,35],null,34],[[7,13,12,18,24,19],null,null]],[],[34,27],[],[],{},null],"46/ru":[["С","а","л","и","Р","к","Б","И","с","е","н","а","О","а","Я","ь","м","Ф","р","е","щ","У","Э","Д","с","?","а","?","К","С","о","в","п","Р","Ч","Б"],[[[24,30,31,26],null,null],[[2,3,8,1],null,null],[[32,25,20,19,18,13],null,25],[[5,11,16,9,10,15],null,null]],[],[25,27],[],[],{},null],"46/hi":[["ओ","छ","ई","क","झ","ऋ","ग","लो","ऐ","ङ","इ","औ","म","ऊ","ख","ञ","ए","घ","आ","ड़ी","छ","ई","ल्लू","झ","ट्टा","ग","अ","?","उ","इ","च","न","ऊ","?","गु","ए"],[[[28,22],null,null],[[7,12,19],null,null],[[34,33],null,33],[[30,24,31],null,null]],[],[33,27],[],[],{},null],"46/ar":[["ن","ذ","ة","م","ر","خ","ش","ي","ز","ة","و","ص","ج","ض","ا","س","ب","ذ","غ","ح","ط","ت","ش","ي","ث","?","ب","ف","ج","ض","ع","ل","ه","?","غ","ح"],[[[16,10,3,2],null,null],[[24,30,31,26],null,null],[[33,32,27],null,33],[[11,5,4,9],null,null]],[],[33,25],[],[],{},null],"47/en":[["V","e","e","f","X","E","?","r","Z","G","o","U","t","e","P","e","x","K","a","f","l","M","T","A","H","g","V","C","J","Q","e","?","L","S","Z","G"],[[[3,10,16],null,null],[[30,31,25,20,15],null,31],[[6,13,18,19],null,6],[[12,7,1,2],null,null]],[],[31,6],[],[],{},null],"47/zh-Hant":[["冬","石","樹","光","雨","花","山","天","鳥","?","竹","樹","田","雲","地","草","木","石","春","光","老","花","山","天","鳥","?","竹","月","狸","雲","地","草","冬","石","春","狐"],[[[35,28],null,null],[[20,25],null,25],[[2,9],null,9],[[11,16],null,null]],[],[25,9],[],[],{},null],"47/zh-Hans":[["子","?","老","光","树","花","山","?","鸟","秋","竹","月","田","云","地","草","冬","石","春","光","雨","花","狸","天","鸟","秋","竹","月","田","狐","地","草","冬","石","春","光"],[[[29,22],null,null],[[2,1],null,1],[[7,0],null,7],[[4],null,null]],[],[1,7],[],[],{},null],"47/ja":[["ぬ","お","し","?","っ","?","そ","に","え","さ","シ","は","き","せ","キ","う","こ","ち","ね","ネ","ツ","と","い","け","た","ぬ","木","し","て","あ","く","そ","に","え","さ","つ"],[[[14,20,19],null,null],[[5,10],null,5],[[11,4,3],null,3],[[26],null,null]],[],[5,3],[],[],{},null],"47/ko":[["차","라","?","뭇","타","독","파","사","나","무","?","수","다","차","나","카","마","타","바","파","사","하","아","가","우","다","차","라","카","마","타","여","파","사","하","아"],[[[31,24],null,null],[[5,11,10],null,10],[[8,3,2],null,2],[[14,9],null,null]],[],[10,2],[],[],{},null],"47/es":[["r","b","?","j","a","g","á","o","h","G","á","u","o","l","P","a","D","?","R","r","r","M","l","A","H","O","o","C","J","Q","X","E","L","z","Z","G"],[[[33,26,20,19,12],null,null],[[10,5,11,17,22,15],null,17],[[8,2,3,4],null,2],[[6,0,1,7,13],null,null]],[],[17,2],[],[],{},null],"47/pt-BR":[["V","C","a","Q","X","E","L","r","p","s","á","r","?","o","o","W","a","v","h","Y","f","M","o","?","H","a","V","r","g","i","X","E","L","e","a","á"],[[[7,2,8,14,9,16],null,null],[[35,28,23,29,34],null,23],[[20,13,12,18,25],null,12],[[10,11,17,22,27,33],null,null]],[],[23,12],[],[],{},null],"47/fr":[["V","e","r","a","X","E","e","b","r","G","N","U","l","e","?","W","D","K","R","l","i","g","d","a","f","?","a","r","i","Q","e","n","e","r","Z","G"],[[[33,32,31,26,27,22],null,null],[[23,28,21,14,13],null,14],[[24,30,25,20,19,12,6],null,25],[[3,8,7,2,1],null,null]],[],[14,25],[],[],{},null],"47/de":[["h","e","r","?","J","Q","s","c","l","d","m","M","u","F","K","R","Y","u","P","W","G","N","B","a","L","S","Z","?","l","B","H","O","V","E","t","a"],[[[13,12,7,0,6],null,null],[[3,9,8,1,2],null,3],[[22,28,35,34,27],null,27],[[29,23,17,10],null,null]],[],[3,27],[],[],{},null],"47/it":[["o","r","e","o","v","E","a","b","Z","G","l","f","l","a","P","e","p","?","l","Y","F","M","l","g","?","q","a","C","J","i","u","E","L","S","a","G"],[[[4,3,10,16,15],null,null],[[26,25,30,24,18,13],null,24],[[11,17,23,22,29,34],null,17],[[6,12,7,2,1,0],null,null]],[],[24,17],[],[],{},null],"47/ru":[["р","?","Г","К","С","Ш","л","ё","Р","Ч","Б","И","П","в","А","З","л","?","о","а","е","д","Ю","с","М","с","е","р","т","Т","Щ","и","л","С","Ш","В"],[[[32,31,25,19],null,null],[[1,0,7,6],null,1],[[16,17,23,28],null,17],[[21,26,27,20,13,18],null,null]],[],[1,17],[],[],{},null],"47/hi":[["पे","ङ","आ","ओ","च","इ","औ","ड़","ई","?","ड़ी","ऊ","ख","उ","का","ग","ञ","म","घ","अ","ऐ","?","आ","लो","च","इ","औ","प","ई","क","ज","ऊ","ख","झ","ऋ","ग"],[[[23,17,10],null,null],[[13,14,9],null,9],[[27,21],null,21],[[0,7],null,null]],[],[9,21],[],[],{},null],"47/ar":[["غ","ت","ع","ع","د","ظ","ي","ق","ل","ث","ط","ه","ا","ف","ح","ب","ج","ش","و","?","ة","ر","د","ظ","ق","?","ك","خ","ط","ه","ة","ف","ح","ض","ن","ذ"],[[[9,3,8,15],null,null],[[2,7,12,19],null,19],[[18,25,24,30],null,25],[[17,16,21,20],null,null]],[],[19,25],[],[],{},null],"48/en":[["d","n","?","?","Y","F","p","o","a","t","e","V","C","r","w","X","E","L","f","Z","G","N","U","h","I","P","W","D","s","f","Y","F","M","h","A","i"],[[[18,13,7,2],null,2],[[29,35,28,23],null,null],[[6,7,1,0],null,null],[[14,8,9,10,3],null,3]],[],[2,3],[33],[],{"FROG":2,"WATER":3},null],"48/zh-Hant":[["天","鳥","塘","竹","月","田","雲","地","池","冬","石","春","光","雨","?","魚","兒","鳥","秋","竹","月","水","溪","地","草","冬","石","春","光","雨","花","山","天","?","青","竹"],[[[34,33],null,33],[[15,16],null,null],[[8,2],null,null],[[14,21],null,14]],[],[33,14],[22],[],{"FROG":33,"WATER":14},null],"48/zh-Hans":[["天","塘","秋","竹","月","田","池","地","草","冬","石","春","蛙","塘","花","山","天","鸟","?","竹","月","田","云","地","草","冬","石","春","光","雨","花","山","?","水","鱼","儿"],[[[18,12],null,18],[[34,35],null,null],[[6,13],null,null],[[32,33],null,32]],[],[18,32],[1],[],{"FROG":18,"WATER":32},null],"48/ja":[["み","?","に","え","エ","?","う","し","て","い","こ","ル","あ","け","ち","の","さ","池","ね","き","そ","ぬ","な","か","に","え","す","と","う","池","て","い","こ","つ","あ","け"],[[[5,4,11],null,5],[[16,23,22],null,null],[[29],null,null],[[0,1],null,1]],[],[5,1],[17],[],{"FROG":5,"WATER":1},null],"48/ko":[["개","?","사","하","사","하","구","못","사","하","사","하","사","연","?","하","물","하","사","하","냇","물","고","하","사","하","사","기","사","하","사","하","사","하","사","하"],[[[0,6,1],null,1],[[16,22,27],null,null],[[13,7],null,null],[[20,14],null,14]],[],[1,14],[21],[],{"FROG":1,"WATER":14},null],"48/es":[["a","n","q","u","Y","F","t","e","e","e","O","V","z","s","p","X","E","a","r","u","?","N","U","n","I","a","a","D","r","?","Y","F","M","T","A","H"],[[[28,29,23,17],null,29],[[14,7,12],null,null],[[8,13,6,0,1,2,3,9],null,null],[[26,20,19,25],null,20]],[],[29,20],[18],[],{"FROG":29,"WATER":20},null],"48/pt-BR":[["a","?","a","R","Y","p","g","l","g","H","ã","e","C","o","á","X","?","i","a","Z","a","N","e","x","I","P","W","D","K","R","Y","F","M","T","A","H"],[[[16,10],null,16],[[5,11,17,23,22],null,null],[[7,0,6,13,18],null,null],[[14,8,1,2],null,1]],[],[16,1],[20],[],{"FROG":16,"WATER":1},null],"48/fr":[["W","D","?","n","e","F","M","i","A","o","g","r","n","l","l","g","n","e","o","e","G","N","t","a","s","o","W","é","K","?","s","i","p","u","a","H"],[[[10,11,4,3,9,2,7,14,13,19],null,2],[[32,25,31,30,24,18,12],null,null],[[27,22,23,16,15],null,null],[[29,34,33],null,29]],[],[2,29],[17],[],{"FROG":2,"WATER":29},null],"48/de":[["s","?","T","i","I","P","s","a","r","e","c","h","a","W","J","h","Z","c","O","c","i","r","U","s","h","s","A","F","?","Y","G","N","V","D","L","S"],[[[27,21,28,23,17,11],null,28],[[27,20,25,19,24],null,null],[[2,9,3,10,15],null,null],[[13,7,0,6,1,8],null,1]],[],[28,1],[12],[],{"FROG":28,"WATER":1},null],"48/it":[["r","?","t","a","o","F","a","n","s","H","g","n","C","c","Q","X","E","L","q","Z","a","N","U","B","?","a","W","p","e","R","Y","F","M","e","s","c"],[[[0,1,7,6],null,1],[[27,33,34,35,28],null,null],[[8,2,3,10,11,4],null,null],[[6,13,18,24,25],null,24]],[],[1,24],[20],[],{"FROG":1,"WATER":24},null],"48/ru":[["л","Э","Д","Л","ы","Щ","я","п","С","р","В","б","Р","г","р","у","а","Ц","ш","?","?","д","Я","Ж","к","о","в","а","М","У","а","а","Л","Т","Щ","Г"],[[[0,6,13,19,18,24,31],null,19],[[9,4,11,16],null,null],[[7,14,15,21],null,null],[[26,25,20,27],null,20]],[],[19,20],[30],[],{"FROG":19,"WATER":20},null],"48/hi":[["औ","झ","ऊ","ग","?","पा","ङ","इ","ओ","ज","उ","ख","ञ","ऋ","घ","आ","ऐ","च","ई","औ","झ","ता","ब","?","छ","म","ता","ला","ढ","उ","ख","ली","ऋ","में","आ","ऐ"],[[[33,28,23],null,23],[[25,24,31],null,null],[[26,27,22],null,null],[[5,4],null,4]],[],[23,4],[21],[],{"FROG":23,"WATER":4},null],"48/ar":[["ق","ث","ص","ه","خ","غ","ة","ك","ن","ح","ف","?","ك","م","ج","د","و","ذ","س","ك","ص","ع","خ","غ","ر","ب","ة","ا","ء","ي","ز","ل","ج","ط","?","ذ"],[[[11,10,15,21],null,11],[[18,13,7,6],null,null],[[25,24,19,26],null,null],[[34,27,28],null,34]],[],[11,34],[12],[],{"FROG":11,"WATER":34},null],"49/en":[["X","E","s","S","Z","G","d","s","a","I","P","W","n","K","g","r","o","f","T","o","H","g","V","r","h","i","p","E","L","S","s","?","N","?","B","I"],[[[17,23,16,21],null,null],[[31,25,30,24],null,31],[[26,19,12,6],null,null],[[14,15,8,2,7],null,null]],[],[31,33],[],[],{},null],"49/zh-Hant":[["光","兒","田","雨","蛙","青","地","山","?","鳥","冬","石","青","草","春","光","月","田","雨","塘","?","地","山","天","鳥","冬","池","秋","竹","春","光","月","田","雨","花","雲"],[[[5,4],null,null],[[8,1],null,8],[[26,19],null,null],[[12,13],null,null]],[],[8,20],[],[],{},null],"49/zh-Hans":[["光","月","田","草","蛙","云","地","山","塘","青","冬","石","秋","竹","池","光","月","田","雨","花","云","地","山","天","鸟","冬","石","鱼","竹","春","?","月","?","雨","花","云"],[[[9,4],null,null],[[27,32],null,32],[[14,8],null,null],[[3],null,null]],[],[32,30],[],[],{},null],"49/ja":[["エ","ル","ぬ","お","な","?","え","カ","と","う","?","か","い","こ","つ","あ","け","池","の","く","た","ね","き","そ","ぬ","お","せ","に","え","す","と","う","し","て","い","草"],[[[7,0,1],null,null],[[5,11,4],null,5],[[17],null,null],[[35],null,null]],[],[5,10],[],[],{},null],"49/ko":[["아","가","아","가","아","가","아","?","아","가","아","가","아","가","리","풀","아","가","아","구","개","가","아","가","아","가","기","가","?","가","아","못","연","고","아","가"],[[[20,19,14],null,null],[[28,33,26],null,28],[[32,31],null,null],[[15],null,null]],[],[28,7],[],[],{},null],"49/es":[["X","r","a","S","Z","?","N","U","n","a","n","W","D","a","t","u","q","M","T","s","H","e","h","e","J","?","e","a","i","r","Z","G","e","z","b","I"],[[[1,2,8,13],null,null],[[25,32,33],null,25],[[26,19,14,9,10,16,15,21],null,null],[[22,28,23,29,34,27],null,null]],[],[25,5],[],[],{},null],"49/pt-BR":[["X","E","L","S","g","r","N","U","B","a","a","W","l","K","r","Y","m","M","a","ã","H","O","V","C","a","g","p","?","L","S","o","?","e","i","x","I"],[[[14,19],null,null],[[26,32,33,34,27],null,27],[[12,18,25,30,24],null,null],[[4,5,10,16,9],null,null]],[],[27,31],[],[],{},null],"49/fr":[["X","e","L","S","o","?","b","e","B","?","s","i","r","h","l","e","o","s","t","é","u","l","V","n","a","o","g","i","L","S","Z","n","e","r","B","I"],[[[26,33,32,31,25,20,27,21,14,15],null,null],[[5,4,11,17,10,16,23],null,5],[[19,18,24,31,26],null,null],[[13,7,12,6,1],null,null]],[],[5,9],[],[],{},null],"49/de":[["s","M","U","r","h","c","a","I","F","o","s","N","r","G","L","?","A","J","T","F","i","c","W","D","i","e","s","?","R","Z","c","h","X","E","N","V"],[[[8,3,9,10,5,4],null,null],[[19,20,26,21,27],null,27],[[18,25,24,30,31],null,null],[[13,12,6,0],null,null]],[],[27,15],[],[],{},null],"49/it":[["X","a","t","e","p","r","o","g","B","s","b","e","D","n","?","e","a","M","T","A","H","O","n","a","J","Q","X","E","L","r","?","G","N","U","B","I"],[[[29,23,22,16],null,null],[[4,3,9,14,15],null,14],[[9,2,1,7,13,6],null,null],[[11,5,10,16],null,null]],[],[14,30],[],[],{},null],"49/ru":[["Ф","Ю","к","ш","У","Э","Д","Л","а","у","т","К","?","Ш","г","р","л","Ч","Б","И","а","я","а","д","О","в","?","б","у","Ф","Ю","а","М","р","р","п"],[[[16,21,14,9,3,2,8],null,null],[[33,26,27,22],null,26],[[35,34,28,23],null,null],[[10,15,20,25,31],null,null]],[],[26,12],[],[],{},null],"49/hi":[["ख","स","ऋ","घ","आ","?","च","घा","औ","झ","ऊ","छ","ब","ए","ता","इ","ओ","म","उ","ला","ञ","ऋ","घ","आ","क","?","ई","औ","झ","ऊ","ग","ढ","में","ङ","इ","ओ"],[[[32,31,24],null,null],[[17,11,5],null,5],[[14,19,12],null,null],[[7,1],null,null]],[],[5,25],[],[],{},null],"49/ar":[["ل","ث","ف","ض","ع","ب","م","س","د","ح","غ","ش","ز","ك","?","ع","ي","ذ","ل","ب","ط","و","خ","ق","ر","ص","ه","ح","غ","ا","ك","ة","ج","ظ","?","ذ"],[[[3,2,8,15],null,null],[[7,6,13,14],null,14],[[19,24,30,31],null,null],[[4,11,5],null,null]],[],[14,34],[],[],{},null],"50/en":[["Y","h","M","T","A","H","w","a","l","J","Q","X","?","l","e","Z","G","N","e","c","n","P","t","D","h","e","a","l","M","u","s","H","O","?","t","r"],[[[22,29,35,34,27,33],null,33],[[6,1,7,13,14],null,null],[[12,19,25,26,20],null,12],[[30,24,18,13,8],null,null]],[],[33,12],[],[],{"TURTLE":33,"OCEAN":12},null],"50/zh-Hant":[["?","山","天","鳥","秋","?","月","龜","雲","殼","洋","冬","石","春","光","雨","貝","山","天","鳥","秋","竹","月","田","雲","地","魚","冬","石","春","光","鯨","花","山","天","鳥"],[[[0,7],null,0],[[31,26],null,null],[[5,10],null,5],[[16,9],null,null]],[],[0,5],[],[],{"TURTLE":0,"OCEAN":5},null],"50/zh-Hans":[["花","山","天","鸟","秋","竹","龟","田","云","洋","草","冬","鲸","?","光","?","花","山","天","鱼","秋","竹","月","田","云","地","贝","冬","石","春","光","雨","壳","山","天","鸟"],[[[13,6],null,13],[[12,19],null,null],[[15,9],null,15],[[26,32],null,null]],[],[13,15],[],[],{"TURTLE":13,"OCEAN":15},null],"50/ja":[["え","さ","つ","み","殻","そ","に","お","?","て","あ","貝","た","ぬ","か","す","と","い","こ","ち","メ","き","せ","な","え","ウ","つ","ガ","ジ","そ","に","お","?","ク","ラ","け"],[[[25,32,27,20],null,32],[[33,28,34],null,null],[[8,3],null,8],[[11,4],null,null]],[],[32,8],[],[],{"TURTLE":32,"OCEAN":8},null],"50/ko":[["라","타","사","하","자","나","래","마","파","?","데","기","고","양","?","껍","거","다","카","마","파","조","개","바","라","타","사","하","자","나","카","마","파","아","가","차"],[[[23,17,16,9],null,9],[[12,6],null,null],[[14,13],null,14],[[21,22,15,10,11],null,null]],[],[9,14],[],[],{"TURTLE":9,"OCEAN":14},null],"50/es":[["g","t","r","n","c","h","u","a","t","o","c","a","i","?","m","l","G","a","n","a","l","P","e","n","K","a","n","a","é","?","A","o","b","a","C","c"],[[[8,9,2,1,6,0,7,14,19,13,12,18,25],null,13],[[32,27,20,15,22,23,17],null,null],[[29,35,28,33,26,31],null,29],[[10,9,3,4,5,11],null,null]],[],[13,29],[],[],{"TURTLE":13,"OCEAN":29},null],"50/pt-BR":[["b","?","l","e","a","H","m","a","c","i","Q","n","E","a","g","r","a","o","?","i","u","r","t","t","n","R","h","a","n","T","h","a","O","c","c","o"],[[[23,16,15,22,27,21,20,14,7,6,13,18,19,24,30,31],null,18],[[0,7,2,3,9,16],null,null],[[1,8,3,4,11,17],null,1],[[34,35,28,33,26,27],null,null]],[],[18,1],[],[],{"TURTLE":18,"OCEAN":1},null],"50/fr":[["u","m","e","n","b","a","t","e","e","?","i","l","r","o","d","u","G","e","?","B","t","q","i","l","a","R","o","e","g","l","é","c","O","c","a","J"],[[[20,13,12,6,0,7,14,8,1,2,9],null,9],[[4,5,11,17,10,3,8],null,null],[[26,31,30,24,18],null,18],[[33,26,21,15,22,23,29,34,28,27],null,null]],[],[9,18],[],[],{"TURTLE":9,"OCEAN":18},null],"50/de":[["E","W","a","C","J","ö","A","l","O","e","t","r","?","a","z","M","B","k","r","e","e","s","l","d","u","e","s","h","c","?","M","s","c","e","l","h"],[[[15,20,19,18,25,26,21,28,35,29,22,23,17,11,5,10,9],null,29],[[1,2,7],null,null],[[8,14,20,13,12],null,12],[[30,24,31,32,27,33,34],null,null]],[],[29,12],[],[],{"TURTLE":29,"OCEAN":12},null],"50/it":[["i","l","r","i","n","?","g","a","m","r","a","b","i","c","u","a","t","a","h","n","?","g","l","r","c","o","c","e","M","a","A","H","o","V","n","t"],[[[35,29,23,16,10,9,14,21,15,8,7,2,3,4,5],null,5],[[11,17,22,27,34,29],null,null],[[32,26,27,20,19,25],null,20],[[24,25,19,13,18,12,6,1,0,7],null,null]],[],[5,20],[],[],{"TURTLE":5,"OCEAN":20},null],"50/ru":[["Х","н","а","е","Ф","Ю","ш","к","а","?","р","е","у","к","о","ч","е","п","В","а","я","х","а","?","р","т","а","а","р","о","и","к","Н","Ф","к","с"],[[[23,29,28,35,34,27,20,15,16,10,11,17,22,21,26],null,23],[[31,30,25],null,null],[[14,9,3,8,1],null,9],[[24,19,13,12,6,7,2],null,null]],[],[23,9],[],[],{"TURTLE":23,"OCEAN":9},null],"50/hi":[["छ","उ","व्हे","ल","ए","च","ई","औ","झ","ऋ","ङ","सी","ओ","ज","ऊ","घ","अ","प","ग","र","छु","आ","ए","च","म","सा","द्री","क","ङ","इ","?","ज","मु","?","अ","ऐ"],[[[33,32,26,27,20,21],null,33],[[2,3],null,null],[[24,30,25,18,19],null,30],[[11,17],null,null]],[],[33,30],[],[],{"TURTLE":33,"OCEAN":30},null],"50/ar":[["ة","ف","ع","ح","ت","ط","ص","د","ع","ج","و","ي","ع","ج","ع","ج","س","ح","ع","ج","ف","ح","ل","?","ع","ج","ا","?","ب","ي","ع","ج","ع","ح","ر","ة"],[[[16,22,21,20,26,27,28,33,34,29,35],null,27],[[3,10,4],null,null],[[23,17,11,5],null,23],[[6,7,1,0],null,null]],[],[27,23],[],[],{"TURTLE":27,"OCEAN":23},null],"51/en":[["b","e","N","U","B","I","b","a","D","K","R","Y","F","M","r","f","x","O","V","C","J","?","d","l","L","S","Z","n","a","e","B","I","P","f","o","p"],[[[0,1,7,14],null,null],[[15,21,16],null,21],[[23,29,28,33],null,null],[[35,34,27,22],null,null]],[],[21],[6],[],{"FOX":21},null],"51/zh-Hant":[["狸","?","地","草","池","石","春","光","雨","花","塘","天","鳥","秋","竹","月","田","棕","葉","草","冬","石","熊","光","雨","樹","葉","天","鳥","秋","竹","月","田","雲","地","草"],[[[17,22],null,null],[[1,0],null,1],[[25,26],null,null],[[4,10],null,null]],[],[1],[18],[],{"FOX":1},null],"51/zh-Hans":[["田","塘","?","草","冬","石","春","光","狐","花","山","天","鸟","秋","叶","月","田","云","地","草","子","棕","春","光","塘","花","熊","天","鸟","秋","竹","池","田","云","地","草"],[[[21,26],null,null],[[8,2],null,2],[[14,20],null,null],[[31,24],null,null]],[],[2],[1],[],{"FOX":2},null],"51/ja":[["い","け","た","ぬ","お","し","て","あ","く","そ","に","え","さ","つ","ネ","ツ","せ","な","池","こ","ち","?","か","池","と","ぱ","け","マ","ク","お","し","は","っ","く","そ","に"],[[[28,27],null,null],[[21,15,14],null,21],[[31,32,25],null,null],[[18],null,null]],[],[21],[23],[],{"FOX":21},null],"51/ko":[["?","아","가","자","다","차","라","우","마","타","바","파","사","하","아","가","자","다","차","라","카","마","잎","잎","곰","사","하","아","나","뭇","다","불","연","못","마","타"],[[[31,24],null,null],[[0,7],null,0],[[28,29,22],null,null],[[32,33],null,null]],[],[0],[23],[],{"FOX":0},null],"51/es":[["e","G","t","a","o","e","P","s","n","q","u","s","F","M","T","z","o","O","V","C","J","o","r","E","L","h","j","a","r","U","B","I","o","W","?","o"],[[[4,11,16],null,null],[[34,35,28,22,21],null,34],[[25,32,26,27],null,null],[[0,7,2,3,8,9,10,5],null,null]],[],[34],[15],[],{"FOX":34},null],"51/pt-BR":[["Z","l","o","a","s","I","P","s","a","o","R","o","r","u","g","a","H","?","f","C","J","h","X","a","L","o","l","G","r","r","B","I","P","W","D","K"],[[[13,12,7,2],null,null],[[28,23,17,11,4,3],null,17],[[18,25,26,21,15],null,null],[[1,8,14,9,15],null,null]],[],[17],[29],[],{"FOX":17},null],"51/fr":[["Z","G","l","l","B","I","P","W","e","l","i","e","F","g","T","A","u","f","é","n","J","Q","n","e","t","a","r","?","r","o","B","I","d","W","u","s"],[[[29,34,28,35],null,null],[[28,23,22,27,26,32],null,27],[[17,11,16,10,9,3,8],null,null],[[18,24,25,19,13],null,null]],[],[27],[2],[],{"FOX":27},null],"51/de":[["B","l","t","t","M","U","B","K","a","Z","I","e","X","G","N","V","T","i","S","A","J","F","r","c","O","W","s","ä","u","h","K","R","B","?","c","X"],[[[32,27,22],null,null],[[21,28,34,33,26],null,33],[[6,1,8,3,2],null,null],[[16,11,17,23,29],null,null]],[],[33],[0],[],{"FOX":33},null],"51/it":[["l","g","o","r","s","I","i","f","D","o","p","l","a","M","T","e","H","?","V","C","J","Q","X","v","L","S","t","s","N","o","B","I","a","g","n","o"],[[[2,3,4,9],null,null],[[23,17,11,10,15],null,17],[[7,2,1,0,6,12],null,null],[[27,26,32,33,34,29],null,null]],[],[17],[35],[],{"FOX":17},null],"51/ru":[["Ц","А","З","с","Х","Я","Ж","Н","т","Ю","и","л","У","м","м","Л","п","р","л","К","е","Ш","д","у","и","с","?","д","в","ь","А","З","О","Х","е","д"],[[[13,20,27,28,34,35,29],null,null],[[18,24,25,26],null,26],[[11,10,3,8],null,null],[[16,17,23,22],null,null]],[],[26],[14],[],{"FOX":26},null],"51/hi":[["ओ","च","इ","ओ","च","इ","ओ","च","इ","ओ","च","इ","ओ","च","म","लो","च","इ","ओ","च","?","भा","ला","ता","ओ","त्ता","लू","ब","च","इ","प","च","भा","ओ","च","इ"],[[[21,26],null,null],[[15,14,20],null,20],[[30,25],null,null],[[23,22,27],null,null]],[],[20],[32],[],{"FOX":20},null],"51/ar":[["?","ع","ب","م","ة","ر","ل","ث","ر","ا","ق","و","ج","ك","ة","ة","ط","د","ز","غ","ت","ش","م","ب","ض","ه","ذ","ظ","ا","س","ف","ج","ص","ن","خ","ط"],[[[17,23],null,null],[[7,1,6,0],null,0],[[11,5,10,15],null,null],[[2,8,13,14],null,null]],[],[0],[4],[],{"FOX":0},null],"52/en":[["s","H","O","V","t","J","?","s","E","f","S","s","a","e","a","f","o","e","b","r","K","e","f","r","M","T","g","H","g","a","C","J","Q","X","i","r"],[[[28,34,35,29,22,15,21],null,null],[[6,13,18,19,14],null,6],[[26,19,12,7,0],null,null],[[9,16,23,17,11,4],null,null]],[],[6],[],[{"index":11,"from":17}],{"ZEBRA":6},null],"52/zh-Hant":[["鳥","冬","石","秋","竹","春","光","頸","鹿","雨","花","雲","地","馬","長","鳥","冬","石","?","林","森","光","青","田","雨","花","雲","地","山","草","鳥","冬","石","秋","竹","春"],[[[14,7,8],null,null],[[18,13],null,18],[[22,29],null,null],[[20,19],null,null]],[],[18],[],[{"index":19,"from":20}],{"ZEBRA":18},null],"52/zh-Hans":[["鸟","冬","石","秋","竹","春","光","?","田","雨","长","云","地","马","天","鸟","颈","石","秋","竹","春","鹿","月","田","雨","花","森","林","山","草","鸟","冬","石","秋","竹","春"],[[[10,16,21],null,null],[[7,13],null,7],[[29],null,null],[[26,27],null,null]],[],[7],[],[{"index":27,"from":26}],{"ZEBRA":7},null],"52/ja":[["う","シ","ち","ね","か","す","?","マ","け","た","ぬ","お","ウ","て","あ","く","そ","草","え","さ","つ","の","き","せ","な","う","リ","ン","り","も","す","と","キ","け","た","ぬ"],[[[32,26,27],null,null],[[1,6,12,7],null,6],[[17],null,null],[[29,28],null,null]],[],[6],[],[{"index":28,"from":29}],{"ZEBRA":6},null],"52/ko":[["가","자","다","차","라","카","마","린","바","파","숲","하","아","풀","기","다","나","무","카","마","타","바","파","사","하","아","가","얼","말","차","라","카","마","타","?","파"],[[[14,7],null,null],[[27,34,28],null,34],[[13],null,null],[[16,17,10],null,null]],[],[34],[],[{"index":17,"from":16}],{"ZEBRA":34},null],"52/es":[["h","i","e","b","C","J","r","a","r","L","a","Z","b","e","s","B","I","P","?","o","e","q","Y","a","j","b","r","u","f","V","C","i","Q","a","E","L"],[[[24,31,26,33,28,23],null,null],[[18,13,12,6,7],null,18],[[0,1,2,8,3,10],null,null],[[25,19,14,21,27,20],null,null]],[],[18],[],[{"index":20,"from":27}],{"ZEBRA":18},null],"52/pt-BR":[["A","r","O","V","C","J","g","a","z","a","S","Z","G","g","m","?","l","o","W","i","r","b","r","f","M","a","f","a","a","e","C","J","Q","a","s","t"],[[[13,19,20,27,26,33],null,null],[[8,15,21,20,25],null,15],[[6,1,7,14,9],null,null],[[23,16,17,22,29,34,35,28],null,null]],[],[15],[],[{"index":34,"from":29}],{"ZEBRA":15},null],"52/fr":[["A","e","O","V","C","b","r","h","E","L","è","r","b","i","U","z","I","?","e","r","g","t","Y","F","f","a","ê","H","o","f","e","J","Q","r","E","L"],[[[20,13,19,25,24,30],null,null],[[15,10,5,11,17],null,17],[[7,1,6,12,18],null,null],[[29,28,33,26,21],null,null]],[],[17],[],[{"index":26,"from":33}],{"ZEBRA":17},null],"52/de":[["r","a","s","E","M","T","G","f","R","A","I","P","f","i","a","U","D","W","e","r","J","Q","a","H","Z","?","E","l","T","C","K","b","r","a","d","X"],[[[6,13,19,14,7,12,18],null,null],[[24,25,31,32,33],null,25],[[6,0,1,2],null,null],[[17,22,27,34],null,null]],[],[25],[],[{"index":22,"from":17}],{"ZEBRA":25},null],"52/it":[["A","b","O","V","C","J","Q","r","a","L","S","Z","G","r","e","B","t","s","?","a","b","a","r","e","g","e","r","f","a","o","C","i","a","f","E","f"],[[[24,31,26,32,27,33,28],null,null],[[18,25,20,13,19],null,18],[[14,7,1,8],null,null],[[35,29,22,23,17,16,21],null,null]],[],[18],[],[{"index":21,"from":16}],{"ZEBRA":18},null],"52/ru":[["Ч","Б","И","П","Ц","А","л","е","Х","Я","Ж","Н","с","Ю","Е","М","а","в","Д","б","е","з","а","ж","С","?","В","ф","р","и","Б","И","а","т","а","р"],[[[23,29,35,34,27],null,null],[[21,20,19,25,32],null,25],[[33,28,22,17,16],null,null],[[6,7,12],null,null]],[],[25],[],[{"index":12,"from":7}],{"ZEBRA":25},null],"52/hi":[["ख","जि","ऋ","घ","अ","ए","ङ","आ","रा","फ़","इ","ओ","छ","ई","औ","?","घा","क","झ","ऊ","ब्रा","स","ऋ","घ","अ","ए","ल","आ","ऐ","च","जं","ग","छ","ई","औ","ज"],[[[1,8,9],null,null],[[15,20],null,15],[[16,21],null,null],[[30,31,26],null,null]],[],[15],[],[{"index":26,"from":31}],{"ZEBRA":15},null],"52/ar":[["د","ق","ر","ا","ة","ص","ن","ي","ك","ز","ف","غ","ح","ش","س","ل","ا","ة","و","ط","ت","ص","ن","ب","ر","ا","ظ","ث","ش","ه","?","ح","د","ع","ج","ب"],[[[9,2,3,10,4],null,null],[[31,30,25,24,18,12,13,7],null,30],[[33,28,35],null,null],[[11,16,23,17],null,null]],[],[30],[],[{"index":16,"from":11}],{"ZEBRA":30},null],"53/en":[["c","e","a","W","a","t","o","n","F","M","w","e","H","h","V","C","n","r","f","i","s","i","h","G","N","?","B","p","d","W","D","K","R","Y","l","?"],[[[28,35,34,27,22,21,16],null,35],[[18,19,20,13],null,null],[[6,0,1,2,7],null,null],[[10,4,5,11,17],null,null]],[],[35,25],[],[{"index":7,"from":2}],{},null],"53/zh-Hant":[["竹","月","水","雲","地","草","洋","石","溪","?","雨","花","海","天","鳥","秋","竹","月","田","?","地","草","冬","石","豚","光","雨","花","山","天","兒","魚","竹","月","田","雲"],[[[19,24],null,19],[[31,30],null,null],[[12,6],null,null],[[8,2],null,null]],[],[19,9],[],[{"index":6,"from":12}],{},null],"53/zh-Hans":[["竹","月","田","云","地","草","冬","石","春","光","雨","鱼","山","溪","鸟","?","儿","月","田","水","地","草","冬","石","春","光","海","花","山","天","鸟","?","竹","月","洋","海"],[[[26,31],null,31],[[11,16],null,null],[[35,34],null,null],[[13,19],null,null]],[],[31,15],[],[{"index":34,"from":35}],{},null],"53/ja":[["そ","ぬ","き","そ","ぬ","き","み","ぬ","き","そ","ぬ","き","う","ず","き","そ","ぬ","き","?","ぬ","き","そ","ぬ","き","そ","ぬ","な","そ","?","き","さ","か","き","そ","イ","ル"],[[[34,35,28],null,28],[[30,31,26],null,null],[[12,6],null,null],[[18,13],null,18]],[],[28,18],[],[{"index":6,"from":12}],{},null],"53/ko":[["?","마","타","마","타","마","타","마","타","마","물","고","냇","마","타","마","타","기","타","물","타","마","타","마","타","마","타","래","양","돌","타","마","타","대","?","마"],[[[29,34,27],null,34],[[10,11,17],null,null],[[33,28],null,null],[[12,19],null,null]],[],[34,0],[],[{"index":28,"from":33}],{},null],"53/es":[["B","I","P","W","D","í","R","Y","e","d","?","n","H","z","p","l","J","Q","X","E","a","n","o","g","N","U","B","é","a","u","D","?","c","o","a","M"],[[[9,8,15,10,5,11],null,10],[[14,8,13],null,null],[[33,32,27,20,21,22],null,null],[[28,23,29,34],null,null]],[],[10,31],[],[{"index":22,"from":21}],{},null],"53/pt-BR":[["o","n","a","e","c","o","R","h","n","i","f","A","H","O","V","C","g","l","?","E","x","S","?","á","N","e","i","e","P","g","D","p","R","Y","u","a"],[[[16,22,17,10,9,8,7,0],null,22],[[31,25,26,20,27],null,null],[[5,4,3,2,1,0],null,null],[[23,29,34,35],null,null]],[],[22,18],[],[{"index":1,"from":2}],{},null],"53/fr":[["o","n","P","?","D","K","s","o","n","a","T","A","p","s","i","é","o","u","X","E","L","c","p","a","N","U","a","u","h","d","D","K","R","e","n","?"],[[[29,23,17,22,28,35,34],null,35],[[12,7,14,13,6,0,1],null,null],[[16,21,15,9,8],null,null],[[33,26,27],null,null]],[],[35,3],[],[{"index":8,"from":9}],{},null],"53/de":[["L","T","B","D","S","A","J","R","e","i","Q","Y","n","P","n","?","f","V","a","e","U","e","r","c","B","z","W","s","s","h","O","a","s","i","F","?"],[[[3,8,15,16,9,14],null,15],[[34,33,28,23,29],null,null],[[30,25,19,18,12],null,null],[[26,31,32,27,21,22],null,null]],[],[15,35],[],[{"index":12,"from":18}],{},null],"53/it":[["?","p","P","W","D","K","R","e","s","e","T","A","a","O","c","d","J","o","u","E","l","e","Z","n","c","q","B","f","c","a","a","o","?","i","o","e"],[[[15,21,20,27,33,32,31],null,32],[[1,7,8,14,9],null,null],[[34,28,35,29,23,17],null,null],[[30,24,25,18,12],null,null]],[],[32,0],[],[{"index":17,"from":23}],{},null],"53/ru":[["Ш","В","Й","Р","Ч","Б","в","П","Ц","а","?","О","о","а","н","Н","б","Ю","д","е","а","ь","Д","ы","к","Щ","?","ф","С","р","о","д","е","Ч","и","н"],[[[31,32,26,21,27,34,35],null,26],[[29,23,16,9],null,null],[[30,24,19,20,14],null,null],[[6,12,18,13],null,null]],[],[26,10],[],[{"index":14,"from":20}],{},null],"53/hi":[["?","ल्फ़ि","न","झ","ऊ","ख","अ","ए","ङ","इ","ओ","ज","उ","हा","ञ","ऋ","घ","आ","ऐ","म","सा","औ","पा","नी","म","छ","ग","र","इ","ओ","ज","ली","क","ञ","ऋ","?"],[[[0,1,2],null,0],[[24,25,31],null,null],[[19,13,20,26,27],null,null],[[22,23],null,null]],[],[0,35],[],[{"index":26,"from":20}],{},null],"53/ar":[["ث","ص","و","ر","?","ج","ك","ة","ز","ق","خ","ظ","س","م","ه","ذ","ع","ث","د","ل","ط","غ","ا","م","ف","ي","ق","ي","ظ","ء","?","ه","م","ح","ث","ص"],[[[18,19,24,25,30],null,30],[[12,13,6,7],null,null],[[32,33,27,20],null,null],[[23,22,29],null,null]],[],[30,4],[],[{"index":33,"from":32}],{},null],"54/en":[["C","J","Q","o","E","L","S","Z","G","w","U","t","I","P","W","D","l","s","Y","e","M","T","A","?","e","l","g","a","n","t","E","L","S","e","e","r"],[[[3,9,16],null,null],[[33,27,26,25,19],null,null],[[28,23,17,11],null,23],[[29,35,34,33],null,null]],[],[23],[24],[],{"NEST":23},null],"54/zh-Hant":[["木","地","山","天","草","巢","樹","秋","竹","春","光","?","田","貓","老","雲","地","山","頭","鷹","鷹","石","秋","竹","春","光","月","老","雨","花","雲","地","山","天","草","冬"],[[[13,18,19],null,null],[[14,20],null,null],[[11,5],null,11],[[6,0],null,null]],[],[11],[27],[],{"NEST":11},null],"54/zh-Hans":[["?","地","山","天","草","冬","石","鸟","竹","春","光","月","树","雨","花","云","地","山","天","老","鹰","石","秋","竹","春","鹰","树","田","雨","花","云","猫","头","天","草","冬"],[[[31,32,25],null,null],[[19,20],null,null],[[7,0],null,0],[[26],null,null]],[],[0],[12],[],{"NEST":0},null],"54/ja":[["お","し","ロ","あ","く","そ","に","ウ","さ","ク","の","き","せ","な","う","こ","フ","ね","か","す","と","い","?","た","木","お","し","て","あ","く","そ","シ","ワ","巣","つ","の"],[[[16,9,2,7],null,null],[[32,31],null,null],[[22],null,22],[[24],null,null]],[],[22],[33],[],{"NEST":22},null],"54/ko":[["라","카","마","나","바","파","사","하","아","무","자","다","이","?","둥","독","타","리","엉","부","하","리","수","자","다","차","라","카","마","타","바","파","사","하","아","가"],[[[19,18,12],null,null],[[15,22,17],null,null],[[14,13],null,13],[[3,9],null,null]],[],[13],[21],[],{"NEST":13},null],"54/es":[["C","á","á","u","E","L","S","Z","g","l","i","B","n","o","b","r","a","R","l","?","á","T","A","H","b","h","d","J","Q","X","ú","o","o","Z","G","N"],[[[24,30,25,32],null,null],[[2,8,3,10,9,16],null,null],[[12,19,26,31],null,19],[[20,15,14,13,18],null,null]],[],[19],[1],[],{"NEST":19},null],"54/pt-BR":[["C","a","g","á","a","j","i","u","i","r","u","n","I","e","W","c","o","?","Y","F","r","h","n","H","O","V","o","v","r","X","E","L","S","Z","á","N"],[[[15,16,9,10,5,4],null,null],[[3,2,7,8,1],null,null],[[11,17,22,21,16],null,17],[[34,28,27,26,20,13],null,null]],[],[17],[6],[],{"NEST":17},null],"54/fr":[["C","a","r","X","h","b","S","b","G","N","o","i","r","P","W","u","K","b","e","F","M","T","?","H","O","a","g","J","e","i","E","i","S","l","G","n"],[[[4,11,5,10,15],null,null],[[25,31,26,33,28],null,null],[[35,29,22],null,22],[[1,2,7,12,18],null,null]],[],[22],[17],[],{"NEST":22},null],"54/de":[["e","V","e","M","U","D","L","l","B","E","S","Z","J","R","u","a","m","X","e","?","W","u","O","V","s","r","d","l","L","T","t","K","e","A","J","R"],[[[9,14,7,2],null,null],[[33,26,27,32,25],null,null],[[19,18,24,30],null,19],[[8,15,21,16],null,null]],[],[19],[0],[],{"NEST":19},null],"54/it":[["g","J","g","q","E","L","f","u","u","a","U","B","I","o","o","i","K","R","Y","r","M","T","l","a","e","b","C","o","Q","i","a","l","S","Z","d","?"],[[[2,7,6,13],null,null],[[9,3,8,15,22,23],null,null],[[35,29,34,27],null,35],[[30,31,25,24,19,14],null,null]],[],[35],[0],[],{"NEST":35},null],"54/ru":[["Щ","ё","л","С","Ш","В","Й","Р","р","Б","И","П","Ц","о","а","о","Х","Я","в","с","в","Ю","г","М","е","?","д","Л","г","н","р","е","д","з","е","Й"],[[[19,13,20,14],null,null],[[15,8,1,2],null,null],[[28,29,34,33,32,25],null,25],[[26,31,30,24,18,13],null,null]],[],[25],[22],[],{"NEST":25},null],"54/hi":[["ङ","आ","ओ","च","इ","उ","छ","ई","क","ज","ल्लू","ख","झ","ऋ","स","ञ","ए","घ","ड़","पे","?","ला","ओ","च","उ","का","ब","ई","क","ज","ऊ","ल्लू","झ","ऋ","ग","ञ"],[[[5,10],null,null],[[24,25,26],null,null],[[20,14,21],null,20],[[19,18],null,null]],[],[20],[31],[],{"NEST":20},null],"54/ar":[["ن","د","ة","ب","ز","?","ث","ص","و","م","ع","ه","ب","غ","ع","س","ك","ح","ا","ق","ر","ة","ش","ز","ف","ث","ع","ج","خ","ط","ه","ذ","غ","ت","س","ك"],[[[3,8,9,2],null,null],[[14,19,18,12],null,null],[[10,5],null,5],[[22,27,20,21],null,null]],[],[5],[26],[],{"NEST":5},null],"55/en":[["?","g","u","n","F","M","e","p","i","O","V","C","J","Q","?","E","L","S","w","o","N","s","B","s","P","w","D","e","e","l","F","M","i","c","a","O"],[[[7,6,0,1,2,8,3],null,0],[[23,28,34,29],null,null],[[32,33,27],null,null],[[21,14,19,25],null,14]],[],[0,14],[18],[],{"PENGUIN":0,"SNOW":14},null],"55/zh-Hant":[["雨","田","雲","地","山","?","草","冬","海","豹","豹","雪","竹","月","光","雨","田","企","地","山","天","草","冬","?","塊","冰","春","竹","月","光","雨","田","雲","地","山","天"],[[[17,23],null,23],[[8,9],null,null],[[25,24],null,null],[[11,5],null,5]],[],[23,5],[10],[],{"PENGUIN":23,"SNOW":5},null],"55/zh-Hans":[["雨","田","冰","地","山","花","草","冬","鸟","秋","石","?","竹","月","光","雨","豹","海","地","山","天","草","冬","鸟","秋","石","春","冰","月","光","?","鹅","云","地","山","天"],[[[30,31],null,30],[[17,16],null,null],[[27],null,null],[[11,5],null,11]],[],[30,11],[2],[],{"PENGUIN":30,"SNOW":11},null],"55/ja":[["け","た","?","お","氷","と","い","こ","ゆ","ね","か","せ","な","う","さ","ペ","の","く","そ","に","え","し","?","あ","け","た","ザ","お","す","ギ","シ","ラ","ア","ね","氷","ン"],[[[15,22,29,35],null,22],[[32,26,31,30],null,null],[[34],null,null],[[8,2],null,2]],[],[22,2],[4],[],{"PENGUIN":22,"SNOW":2},null],"55/ko":[["하","?","귄","사","하","사","하","음","하","사","하","사","하","사","하","사","하","사","하","사","하","사","하","사","이","눈","하","사","범","물","?","음","얼","사","하","사"],[[[1,2],null,1],[[29,28],null,null],[[32,31],null,null],[[25,30,24],null,30]],[],[1,30],[7],[],{"PENGUIN":1,"SNOW":30},null],"55/es":[["D","K","R","?","i","i","c","f","o","ü","n","p","a","o","n","g","L","S","Z","e","i","U","B","I","o","e","?","i","R","Y","F","l","e","e","h","O"],[[[11,5,10,15,9,4,3,8],null,3],[[7,13,6,12],null,null],[[34,27,32,31,24],null,null],[[14,20,19,26,33],null,26]],[],[3,26],[25],[],{"PENGUIN":3,"SNOW":26},null],"55/pt-BR":[["D","K","R","Y","f","f","g","A","H","O","V","o","J","e","?","e","n","c","l","G","N","e","i","a","P","o","D","K","n","p","m","i","?","g","H","O"],[[[29,22,28,33,32,31,30],null,32],[[4,11,17,23],null,null],[[6,13,18,25],null,null],[[16,21,14,15],null,14]],[],[32,14],[5],[],{"PENGUIN":32,"SNOW":14},null],"55/fr":[["D","K","e","i","g","M","T","t","?","m","e","e","o","Q","a","E","L","S","h","n","c","a","e","I","?","e","l","o","h","u","F","M","g","p","q","O"],[[[9,14,19,24,18,12,7],null,24],[[33,28,27,34,29,22],null,null],[[32,26,21,20,25],null,null],[[8,2,3,4,11],null,8]],[],[24,8],[10],[],{"PENGUIN":24,"SNOW":8},null],"55/de":[["e","e","?","L","V","C","e","U","h","S","T","A","s","E","c","H","b","Y","G","i","o","b","M","e","D","R","i","C","g","i","B","J","?","n","u","n"],[[[32,26,33,28,34,29,35],null,32],[[25,20,21,16,23],null,null],[[13,19,12],null,null],[[9,14,8,2,1,0],null,2]],[],[32,2],[6],[],{"PENGUIN":32,"SNOW":2},null],"55/it":[["D","K","?","n","F","o","h","i","i","u","g","n","g","c","a","E","i","S","o","i","c","U","f","p","?","e","D","o","c","Y","v","n","T","a","H","O"],[[[2,8,3,10,9,16,11,5],null,2],[[22,27,28,33],null,null],[[12,6,7,14,20,13,19,18],null,null],[[31,24,30,25],null,24]],[],[2,24],[23],[],{"PENGUIN":2,"SNOW":24},null],"55/ru":[["Э","Д","г","?","Щ","Г","К","С","н","В","Й","Р","Ч","с","И","П","ь","ь","З","и","п","Я","н","Н","н","?","и","л","ю","е","г","д","ё","н","л","т"],[[[20,19,24,30,25,26,33],null,25],[[35,28,34,29,22,17],null,null],[[27,32,31],null,null],[[13,8,3,2],null,3]],[],[25,3],[16],[],{"PENGUIN":25,"SNOW":3},null],"55/hi":[["ई","गु","पें","ल","ग","अ","ओ","इ","सी","ख","ञ","ऐ","ङ","?","क","झ","ल","ब","ज","औ","छ","ऋ","ग","?","मा","आ","ऊ","नी","ञ","ऐ","हु","उ","पा","झ","ए","घ"],[[[2,1,7,13],null,13],[[8,3],null,null],[[18,24,30,25,32,27],null,null],[[17,23],null,23]],[],[13,23],[16],[],{"PENGUIN":13,"SNOW":23},null],"55/ar":[["ذ","ع","ج","ث","ه","ز","ي","ل","?","و","س","ك","د","ظ","ج","ي","ن","ذ","ة","ف","ق","?","ط","غ","ح","م","م","ب","ك","خ","ظ","ا","ش","ن","ذ","ع"],[[[27,22,21,15,20],null,21],[[19,20,25,18],null,null],[[2,7,6,12],null,null],[[3,8,14],null,8]],[],[21,8],[26],[],{"PENGUIN":21,"SNOW":8},null],"56/en":[["E","t","S","Z","?","N","?","e","I","P","W","D","n","e","Y","r","t","T","A","g","l","e","C","J","Q","a","o","e","S","Z","l","w","e","B","I","P"],[[[12,7,6,1],null,6],[[16,15,21,27],null,null],[[26,31,30],null,null],[[32,25,19,20,13],null,null]],[],[6,4],[],[{"index":31,"from":26}],{},null],"56/zh-Hant":[["月","貓","雨","花","雲","地","山","天","頭","冬","石","秋","竹","春","鷹","月","鷹","雨","花","雲","?","老","天","草","冬","石","木","竹","春","光","?","巢","樹","花","雲","地"],[[[30,31],null,30],[[32,26],null,null],[[1,8,14],null,null],[[21,16],null,null]],[],[30,20],[],[{"index":14,"from":8}],{},null],"56/zh-Hans":[["月","田","雨","花","云","地","山","天","?","冬","石","秋","竹","树","光","鸟","田","雨","花","老","地","山","猫","头","鹰","石","秋","竹","鹰","光","月","田","雨","?","云","地"],[[[15,8],null,8],[[13],null,null],[[22,23,28],null,null],[[19,24],null,null]],[],[8,33],[],[{"index":23,"from":22}],{},null],"56/ja":[["き","せ","な","フ","こ","ち","ね","か","す","ク","い","?","た","ぬ","お","ロ","ウ","シ","く","そ","?","え","木","ワ","の","き","せ","な","う","こ","ち","ね","か","す","と","い"],[[[11],null,11],[[22],null,null],[[3,9,15,16],null,null],[[23,17],null,null]],[],[11,20],[],[{"index":9,"from":3}],{},null],"56/ko":[["바","파","사","하","아","가","자","다","?","라","카","마","타","무","지","사","하","?","가","자","나","독","라","카","마","타","리","수","이","하","아","가","부","엉","차","라"],[[[8,14],null,8],[[20,13],null,null],[[32,33,28],null,null],[[21,27,26],null,null]],[],[8,17],[],[{"index":28,"from":33}],{},null],"56/es":[["E","L","S","Z","G","N","l","B","I","P","W","D","o","g","á","F","M","T","u","b","l","b","o","?","r","i","o","a","ú","d","G","á","U","h","?","n"],[[[35,34,29,22],null,34],[[31,24,19,12,6],null,null],[[21,28,33,26],null,null],[[14,13,18,25,20,27],null,null]],[],[34,23],[],[{"index":28,"from":21}],{},null],"56/pt-BR":[["E","L","a","j","G","N","?","c","a","r","u","D","h","n","o","i","u","T","?","i","e","V","g","J","Q","n","r","á","r","Z","G","N","o","v","á","P"],[[[25,19,13,12,6],null,6],[[34,28,33,32,26,20],null,null],[[7,14,9,10,3,2],null,null],[[27,22,16,15,8],null,null]],[],[6,18],[],[{"index":10,"from":9}],{},null],"56/fr":[["?","i","?","a","a","r","U","d","e","i","b","r","K","R","g","l","M","e","A","H","u","V","C","J","Q","X","E","o","S","Z","G","N","U","b","i","h"],[[[2,1,7],null,2],[[4,5,10,11,17],null,null],[[35,34,33,27,20],null,null],[[3,9,14,15,8],null,null]],[],[2,0],[],[{"index":34,"from":35}],{},null],"56/de":[["Q","X","H","P","E","l","O","B","a","u","e","u","L","A","d","K","m","Z","J","R","?","l","Q","X","H","t","s","?","e","r","F","M","N","D","L","T"],[[[32,27,26,25],null,27],[[7,8,9,16],null,null],[[4,11,5,10],null,null],[[13,14,21,28,29],null,null]],[],[27,20],[],[{"index":10,"from":5}],{},null],"56/it":[["E","e","a","Z","G","N","b","l","r","o","W","D","q","R","g","F","M","T","a","u","i","u","C","J","Q","l","a","f","o","n","?","N","o","B","i","?"],[[[29,34,35,28],null,35],[[2,7,6,1,8,9],null,null],[[14,21,27,32],null,null],[[18,12,19,20,25,26],null,null]],[],[35,30],[],[{"index":27,"from":21}],{},null],"56/ru":[["?","ё","л","У","Э","Д","р","о","Щ","Г","К","С","о","г","?","в","Ч","с","н","з","а","А","о","О","е","о","р","е","Ф","Ю","в","е","д","Э","Д","Л"],[[[13,18,24,19,14,7],null,14],[[32,27,26,31,30,25],null,null],[[17,22,15,20],null,null],[[12,6,1,2],null,null]],[],[14,0],[],[{"index":15,"from":22}],{},null],"56/hi":[["छ","ई","ल्लू","उ","ऊ","ख","झ","ऋ","ग","ञ","का","घ","?","ऐ","ङ","ब","ला","उ","इ","औ","छ","ई","स","ज","ऊ","ड़","झ","?","ग","ञ","ए","घ","पे","ऐ","ङ","आ"],[[[27,22,16],null,27],[[32,25],null,null],[[3,2],null,null],[[17,10,15],null,null]],[],[27,12],[],[{"index":2,"from":3}],{},null],"56/ar":[["ي","ز","ف","ث","ص","ل","ب","ش","ق","ذ","غ","ت","س","ا","ج","ع","ن","د","ظ","ي","ز","ر","?","ص","?","ع","م","و","ة","غ","ت","ة","ك","ب","ض","ن"],[[[25,24],null,24],[[7,14,21,28],null,null],[[33,27,26,31],null,null],[[15,8,13,6],null,null]],[],[24,22],[],[{"index":26,"from":27}],{},null],"57/en":[["l","M","T","A","e","l","V","a","r","o","a","w","L","t","t","G","c","h","u","r","?","c","D","?","R","Y","F","e","T","A","H","O","V","a","n","Q"],[[[16,9,8,7,0],null,null],[[20,21,27,33,34],null,20],[[11,17,10,5,4],null,null],[[13,18,19,14,20,27],null,20]],[],[20,23],[],[],{"OCEAN":20,"TURTLE":20},null],"57/zh-Hant":[["山","珊","鳥","秋","竹","月","田","雲","瑚","草","冬","石","春","光","雨","花","山","天","鳥","秋","?","月","田","雲","地","草","冬","石","鯨","魚","龜","?","洋","天","鳥","秋"],[[[1,8],null,null],[[31,32],null,31],[[28,29],null,null],[[31,30],null,31]],[],[31,20],[],[],{"OCEAN":31,"TURTLE":31},null],"57/zh-Hans":[["山","天","鸟","秋","竹","月","田","云","地","草","?","石","春","光","?","珊","山","天","鸟","龟","竹","洋","瑚","云","地","草","冬","石","鱼","鲸","雨","花","山","天","鸟","秋"],[[[15,22],null,null],[[14,21],null,14],[[29,28],null,null],[[14,19],null,14]],[],[14,10],[],[],{"OCEAN":14,"TURTLE":14},null],"57/ja":[["さ","つ","の","?","そ","に","お","し","み","あ","ガ","た","ぬ","か","ゴ","と","ミ","こ","ち","ン","き","ウ","な","?","さ","サ","の","く","そ","に","お","し","て","ラ","ジ","ク"],[[[25,19,14],null,null],[[3,8],null,3],[[35,34,33],null,null],[[21,16,10,3],null,3]],[],[3,23],[],[],{"OCEAN":3,"TURTLE":3},null],"57/ko":[["타","바","하","?","산","카","마","다","거","호","양","라","타","사","하","자","나","카","?","파","아","가","차","라","타","사","하","자","나","카","마","파","아","고","래","라"],[[[4,9],null,null],[[3,10],null,3],[[33,34],null,null],[[1,7,8,3],null,3]],[],[3,18],[],[],{"OCEAN":3,"TURTLE":3},null],"57/es":[["?","o","t","A","H","O","r","t","é","o","X","E","u","?","n","c","b","a","g","o","m","a","r","l","a","o","F","M","i","l","r","l","c","a","n","e"],[[[32,25,30,24,31],null,null],[[9,15,8,13,14,19],null,13],[[16,17,23,29,35,34,33],null,null],[[2,1,6,7,12,18,13,20,21,22,28,34,33],null,13]],[],[13,0],[],[],{"OCEAN":13,"TURTLE":13},null],"57/pt-BR":[["F","?","t","e","o","a","V","a","a","c","r","l","t","r","n","h","c","o","a","u","?","a","b","l","g","r","i","r","e","a","a","m","a","C","a","i"],[[[16,17,10,5,11],null,null],[[4,9,3,8,14,20],null,20],[[22,29,23,28,35,34],null,null],[[2,7,13,12,18,25,19,24,30,31,32,27,26,20,15,21],null,20]],[],[20,1],[],[],{"OCEAN":20,"TURTLE":20},null],"57/fr":[["m","e","T","A","a","l","d","?","o","r","e","i","c","e","r","c","n","i","é","n","u","W","e","K","a","t","o","t","T","l","H","?","r","C","b","a"],[[[15,8,9,4,11,5],null,null],[[7,12,18,24,19],null,7],[[34,35,29,22,17,16,10],null,null],[[25,26,32,27,20,13,6,1,0,7,14],null,7]],[],[7,31],[],[],{"OCEAN":7,"TURTLE":7},null],"57/de":[["e","Y","h","i","l","O","r","?","a","c","z","d","e","a","s","e","k","r","e","l","r","o","t","ö","F","M","l","K","l","e","D","e","W","a","J","?"],[[[27,21,20,13,19,26,31],null,null],[[5,10,15,8,7],null,7],[[32,33,28],null,null],[[25,18,12,6,0,7,14,9,2,3,4,11,16,17,23,22,29],null,7]],[],[7,35],[],[],{"OCEAN":7,"TURTLE":7},null],"57/it":[["F","M","r","a","r","c","a","i","a","l","l","o","n","m","o","b","l","o","a","n","a","a","e","n","?","e","t","a","a","t","c","u","r","r","a","?"],[[[5,11,4,3,9,10,17],null,null],[[24,30,25,20,19,14],null,24],[[15,21,16,22,23,28],null,null],[[29,34,33,26,27,32,31,24,18,13,8,2,7,12,6],null,24]],[],[24,35],[],[],{"OCEAN":24,"TURTLE":24},null],"57/ru":[["с","а","ч","к","и","?","к","р","я","е","т","Т","о","?","К","р","о","к","н","а","к","е","п","р","Ц","о","З","а","Х","а","Ж","Н","х","а","л","л"],[[[17,16,23,29,34,35],null,null],[[25,20,13,19,18],null,13],[[3,4,10],null,null],[[13,12,7,0,6,1,8,2,9,15,21,22,27,32,33],null,13]],[],[13,5],[],[],{"OCEAN":13,"TURTLE":13},null],"57/hi":[["उ","ख","व्हे","ए","छु","ई","औ","झ","ऋ","ल","आ","क","ज","ऊ","मूँ","अ","ऐ","द्री","?","ख","गा","ए","मु","?","औ","झ","म","ङ","इ","ग","ज","ऊ","घ","हा","सा","छ"],[[[14,20],null,null],[[26,33,34,29,23],null,23],[[2,9],null,null],[[23,22,17,11,4,10],null,23]],[],[23,18],[],[],{"OCEAN":23,"TURTLE":23},null],"57/ar":[["ح","ل","س","ي","?","ي","ف","ة","ب","ح","ة","ظ","ا","ظ","م","ظ","خ","ظ","خ","ظ","?","ظ","خ","ظ","و","ظ","خ","م","ر","ج","ت","ح","خ","ن","ا","ظ"],[[[27,28,29,34,33],null,null],[[14,9,3,4],null,4],[[31,24,30],null,null],[[2,1,0,6,12,7,8,9,4,5,10],null,4]],[],[4,20],[],[],{"OCEAN":4,"TURTLE":4},null],"58/en":[["G","N","U","B","I","P","W","?","K","R","Y","F","o","f","v","x","O","r","r","c","o","a","E","a","S","k","c","x","e","B","I","P","W","?","K","b"],[[[18,12,19,25],null,null],[[26,21,14,7],null,7],[[13,20,27],null,null],[[35,28,23,17],null,null]],[],[7,33],[15],[{"index":23,"from":28}],{},null],"58/zh-Hant":[["花","?","花","雨","石","雨","花","雨","花","雨","花","岩","花","雨","花","雨","花","狸","花","熊","花","狸","狐","雨","棕","洞","花","雨","花","雨","花","?","花","雨","花","雨"],[[[11,4],null,null],[[31,25],null,31],[[22,17],null,null],[[24,19],null,null]],[],[31,1],[21],[{"index":19,"from":24}],{},null],"58/zh-Hans":[["花","雨","花","狐","花","雨","花","雨","花","雨","狸","雨","花","雨","花","石","花","?","花","雨","花","岩","山","雨","熊","雨","花","?","花","雨","棕","雨","花","雨","岩","雨"],[[[21,15],null,null],[[22,17],null,17],[[3,10],null,null],[[30,24],null,null]],[],[17,27],[34],[{"index":24,"from":30}],{},null],"58/ja":[["岩","た","ぬ","お","?","て","あ","く","そ","に","え","ネ","つ","の","き","せ","キ","ツ","こ","ち","ね","か","マ","岩","い","洞","?","ク","お","し","て","あ","く","そ","に","え"],[[[23],null,null],[[25,26],null,26],[[16,17,11],null,null],[[27,22],null,null]],[],[26,4],[0],[{"index":22,"from":27}],{},null],"58/ko":[["아","가","불","바","위","다","카","곰","타","마","파","바","?","굴","가","자","나","차","다","카","라","여","마","파","사","하","우","가","자","나","차","다","카","라","타","?"],[[[3,4],null,null],[[12,13],null,12],[[21,26],null,null],[[2,7],null,null]],[],[12,35],[11],[{"index":7,"from":2}],{},null],"58/es":[["u","N","?","B","I","P","e","c","K","o","Y","F","?","a","r","c","s","V","C","J","Q","a","o","o","S","Z","G","N","r","B","I","P","o","r","o","z"],[[[28,22,15,21],null,null],[[7,0,6,12,13],null,12],[[35,34,28,33,32],null,null],[[23,16,9],null,null]],[],[12,2],[14],[{"index":16,"from":23}],{},null],"58/pt-BR":[["G","N","U","a","h","c","W","D","K","a","o","r","n","e","v","H","a","s","a","?","Q","a","p","o","u","o","c","N","a","r","r","s","W","D","?","R"],[[[11,10,5,4,3],null,null],[[26,21,14,13,19,12,18],null,19],[[29,28,22,23,17,16],null,null],[[24,30,31,25],null,null]],[],[19,34],[9],[{"index":25,"from":31}],{},null],"58/fr":[["r","a","U","d","r","c","n","e","r","t","h","o","M","r","?","t","r","e","g","J","Q","r","e","L","S","s","G","u","s","B","I","P","?","o","K","R"],[[[4,11,5,10,17,16],null,null],[[18,13,14,9,15,22],null,14],[[0,7,6,1,8,3],null,null],[[33,27,21,28],null,null]],[],[14,32],[25],[{"index":27,"from":33}],{},null],"58/de":[["B","ä","e","s","ö","F","r","S","l","h","?","u","G","O","e","?","c","T","A","K","R","F","h","P","W","E","N","s","s","L","S","Z","J","Q","X","G"],[[[21,14,8,3],null,null],[[10,4,9,8,2],null,10],[[5,11,16,22,27],null,null],[[0,1,6],null,null]],[],[10,15],[28],[{"index":6,"from":1}],{},null],"58/it":[["o","?","t","a","o","P","W","t","g","o","s","r","M","o","A","H","O","o","c","c","r","X","o","l","S","i","G","v","U","p","I","a","?","D","e","R"],[[[20,13,19,18,25,31],null,null],[[8,1,0,7,2,3],null,1],[[27,22,23,29,34],null,null],[[17,11,10,4],null,null]],[],[1,32],[9],[{"index":11,"from":17}],{},null],"58/ru":[["?","п","?","а","Я","Ж","е","е","с","и","л","У","Э","р","н","ь","м","к","К","а","Ш","е","ь","а","м","е","д","П","е","д","З","м","Х","в","Ж","Н"],[[[17,23,16,21,14,15],null,null],[[1,6,0,7,13,19],null,0],[[10,9,8,3],null,null],[[24,25,26,33,28,29,22],null,null]],[],[0,2],[31],[{"index":22,"from":29}],{},null],"58/hi":[["झ","ऊ","ख","ञ","लू","लो","अ","ए","घ","भा","ड़ी","म","?","ओ","लू","ई","औ","ज","उ","क","झ","ऊ","ख","ञ","च","ट्टा","अ","ए","घ","आ","न","ङ","?","फा","छ","ई"],[[[24,25,30],null,null],[[32,33],null,32],[[5,11,10],null,null],[[9,14],null,null]],[],[32,12],[4],[{"index":14,"from":9}],{},null],"58/ar":[["ش","د","ص","غ","ت","ض","ب","خ","ق","ج","ط","ي","ر","?","ح","ظ","ا","ش","ة","ث","ك","ت","ض","و","ع","ه","ج","ط","ي","س","ب","ل","?","ث","ش","ن"],[[[2,7,12,18],null,null],[[20,25,32],null,32],[[19,24,31,30],null,null],[[1,6],null,null]],[],[32,13],[33],[{"index":6,"from":1}],{},null],"59/en":[["H","O","?","C","h","Q","X","f","L","s","e","e","N","U","B","r","P","W","D","K","R","t","f","?","T","A","r","g","l","a","J","Q","f","o","L","S"],[[[21,15,10,11],null,null],[[28,23,29,22],null,23],[[32,26,33,27],null,null],[[7,2,9,4],null,2]],[],[23,2],[],[],{"LEAF":23,"FISH":2},null],"59/zh-Hant":[["樹","花","山","天","鳥","兒","?","樹","田","雲","?","草","冬","木","春","光","雨","花","山","天","鳥","秋","竹","月","田","雲","地","草","青","石","春","光","雨","花","蛙","天"],[[[7,13],null,null],[[0,6],null,6],[[28,34],null,null],[[10,5],null,10]],[],[6,10],[],[],{"LEAF":6,"FISH":10},null],"59/zh-Hans":[["雨","花","山","天","青","秋","竹","月","田","蛙","树","?","冬","石","春","光","儿","花","?","天","鸟","秋","竹","月","田","叶","地","草","冬","石","春","光","雨","花","山","天"],[[[10],null,null],[[25,18],null,18],[[4,9],null,null],[[11,16],null,11]],[],[18,11],[],[],{"LEAF":18,"FISH":11},null],"59/ja":[["つ","あ","け","ち","の","く","木","ね","き","さ","な","お","せ","に","え","?","と","う","し","て","い","こ","?","は","け","ち","ル","く","カ","っ","き","そ","ぬ","エ","せ","に"],[[[6],null,null],[[23,29,22],null,22],[[28,33,26],null,null],[[9,15,10],null,15]],[],[22,15],[],[],{"LEAF":22,"FISH":15},null],"59/ko":[["물","?","차","라","카","마","고","바","구","리","하","아","가","개","다","차","라","카","마","타","바","파","사","하","아","가","자","잎","차","라","카","마","나","무","?","나"],[[[32,33],null,null],[[35,34,27],null,34],[[13,8,9],null,null],[[0,6,1],null,1]],[],[34,1],[],[],{"LEAF":34,"FISH":1},null],"59/es":[["a","n","a","?","J","Q","X","j","o","r","Z","G","?","l","a","I","P","W","e","K","o","Y","F","M","T","z","r","b","V","C","J","Q","X","á","L","S"],[[[33,26,27,20,13],null,null],[[3,8,7,14],null,3],[[9,2,1,0],null,null],[[12,18,25],null,12]],[],[3,12],[],[],{"LEAF":3,"FISH":12},null],"59/pt-BR":[["e","O","o","v","J","Q","X","r","á","r","e","G","N","U","?","x","P","W","D","K","e","p","F","M","r","h","l","O","V","C","ã","a","?","f","L","S"],[[[8,9,3,2,7,0],null,null],[[33,32,26,25,31],null,32],[[24,30],null,null],[[21,20,14,15,10],null,14]],[],[32,14],[],[],{"LEAF":32,"FISH":14},null],"59/fr":[["H","n","s","s","i","?","a","o","L","S","o","G","b","r","n","e","P","W","r","o","R","r","f","e","e","l","u","g","e","l","l","Q","i","?","i","l"],[[[6,13,12,18,24],null,null],[[22,28,33,34,35,29,23],null,33],[[27,21,15,14,19,26,32,25,30,24],null,null],[[5,10,4,3,2,7,1],null,5]],[],[33,5],[],[],{"LEAF":33,"FISH":5},null],"59/de":[["t","?","C","o","R","Y","a","l","B","r","s","S","Z","I","F","c","E","M","m","u","h","Q","h","G","a","U","i","c","R","Y","B","F","?","D","L","S"],[[[30,24,19,18],null,null],[[8,7,6,1,0],null,1],[[14,9,3,10,15,22],null,null],[[31,26,32,27,20],null,32]],[],[1,32],[],[],{"LEAF":1,"FISH":32},null],"59/it":[["H","O","V","C","J","Q","e","o","p","r","a","n","r","c","?","e","a","W","e","b","l","a","F","M","?","i","o","f","V","C","J","Q","l","g","L","S"],[[[21,20,19,18,12,7],null,null],[[27,26,33,32,25,24],null,24],[[9,16,11,10],null,null],[[8,15,14,13,6],null,14]],[],[24,14],[],[],{"LEAF":24,"FISH":14},null],"59/ru":[["а","ш","П","Ц","А","З","к","о","у","Ж","я","л","Ю","е","в","г","а","Д","р","Т","Щ","Г","К","?","е","В","Й","р","ы","Б","д","л","и","с","?","О"],[[[30,24,18,13,14,7],null,null],[[31,32,33,34],null,34],[[11,10,15,8,1,6,0],null,null],[[27,28,23,16],null,23]],[],[34,23],[],[],{"LEAF":34,"FISH":23},null],"59/hi":[["पे","ओ","ज","ढ","क","ञ","ड़","घ","में","ऐ","म","ई","औ","झ","ऊ","ग","अ","छ","ङ","इ","ओ","ज","उ","?","ञ","ऋ","घ","आ","?","च","ई","औ","झ","ऊ","ग","त्ता"],[[[0,6],null,null],[[28,35],null,28],[[8,3,4],null,null],[[10,17,23],null,23]],[],[28,23],[],[],{"LEAF":28,"FISH":23},null],"59/ar":[["غ","ت","ط","ا","ة","ه","خ","ل","ث","ظ","ك","ص","?","ة","ن","?","م","ش","ط","ر","ز","ه","ج","ر","ف","ع","و","ص","ي","ة","د","ض","غ","ت","ط","ا"],[[[17,22,23,29],null,null],[[26,19,12,13],null,12],[[31,24,30,25],null,null],[[15,16,10,4],null,15]],[],[12,15],[],[],{"LEAF":12,"FISH":15},null],"60/en":[["I","P","f","D","K","R","Y","F","?","T","A","H","O","f","C","r","e","X","?","n","d","Z","s","t","o","r","I","P","w","D","p","f","Y","l","o","T"],[[[13,8,15,16,22,23],null,8],[[30,24,19,20],null,null],[[34,28,33],null,null],[[31,25,24,18],null,18]],[],[8,18],[2],[{"index":33,"from":28}],{"FOREST":8,"FROG":18},null],"60/zh-Hant":[["月","田","雲","地","草","塘","石","春","光","雨","花","?","天","鳥","秋","貓","月","森","雲","鷹","頭","冬","石","春","?","蛙","花","山","天","鳥","秋","竹","塘","池","雲","地"],[[[17,11],null,11],[[33,32],null,null],[[15,20,19],null,null],[[24,25],null,24]],[],[11,24],[5],[{"index":19,"from":20}],{"FOREST":11,"FROG":24},null],"60/zh-Hans":[["月","田","蛙","地","草","?","鹰","?","光","雨","池","森","天","头","秋","竹","月","塘","鹰","地","猫","冬","石","春","光","雨","花","山","天","鸟","秋","竹","月","田","云","地"],[[[11,5],null,5],[[10,17],null,null],[[20,13,6],null,null],[[7,2],null,7]],[],[5,7],[18],[{"index":13,"from":20}],{"FOREST":5,"FROG":7},null],"60/ja":[["フ","?","り","き","せ","な","ク","こ","ち","ね","か","す","ロ","い","け","た","ぬ","お","し","ウ","あ","く","そ","池","カ","さ","ル","の","き","せ","な","?","エ","ち","ね","か"],[[[1,2],null,1],[[23],null,null],[[0,6,12,19],null,null],[[24,31,26],null,31]],[],[1,31],[32],[{"index":12,"from":6}],{"FOREST":1,"FROG":31},null],"60/ko":[["차","라","카","마","타","바","파","사","하","아","가","자","다","차","?","무","마","연","리","구","숲","하","못","가","자","구","차","라","이","마","?","바","파","부","엉","아"],[[[14,15,20],null,14],[[17,22],null,null],[[33,34,28],null,null],[[30,25,18],null,30]],[],[14,30],[19],[{"index":34,"from":33}],{"FOREST":14,"FROG":30},null],"60/es":[["I","b","ú","b","u","e","a","n","h","?","e","q","O","o","a","s","n","?","E","L","S","a","t","q","U","B","I","P","s","o","K","R","Y","F","b","T"],[[[34,29,28,23,17,10],null,17],[[10,15,22,21,16,11,4,5],null,null],[[3,2,8,13],null,null],[[9,14,7,6],null,9]],[],[17,9],[1],[{"index":13,"from":8}],{"FOREST":17,"FROG":9},null],"60/pt-BR":[["I","o","c","D","f","?","r","F","a","r","o","H","u","o","C","a","e","r","j","?","g","a","l","s","ã","a","I","P","t","D","K","R","Y","F","M","T"],[[[4,5,10,9,16,23,28,21],null,5],[[22,15,20,13,8],null,null],[[2,1,6,12,18,25],null,null],[[19,24],null,19]],[],[5,19],[17],[{"index":12,"from":6}],{"FOREST":5,"FROG":19},null],"60/fr":[["I","t","a","n","g","R","é","o","u","i","t","r","n","e","l","J","?","ê","E","?","l","Z","r","f","U","g","e","o","W","i","K","R","u","F","b","h"],[[[23,16,22,17,10],null,16],[[6,1,2,3,4],null,null],[[35,29,34,27,32],null,null],[[25,19,13,12,7,8,9,14,20,26],null,19]],[],[16,19],[11],[{"index":29,"from":35}],{"FOREST":16,"FROG":19},null],"60/de":[["S","B","K","R","A","?","e","e","I","P","W","l","l","u","G","N","d","D","s","h","E","L","S","B","o","c","A","J","c","T","?","F","Y","h","e","i"],[[[10,5,11,16],null,5],[[29,34,35,28,33],null,null],[[20,13,12,6],null,null],[[31,30,24,18,25,19],null,30]],[],[5,30],[7],[{"index":6,"from":12}],{"FOREST":5,"FROG":30},null],"60/it":[["I","a","u","f","K","R","Y","F","?","g","o","H","O","V","a","n","Q","n","E","r","?","r","o","g","e","t","o","f","a","D","s","R","Y","t","s","T"],[[[27,26,19,24,30,25,20],null,20],[[34,33,28,23,17,22],null,null],[[9,2,3,10],null,null],[[21,14,8,1],null,8]],[],[20,8],[15],[{"index":3,"from":2}],{"FOREST":20,"FROG":8},null],"60/ru":[["е","с","?","в","а","И","П","л","с","о","О","Х","Я","Ж","Н","д","Ю","Е","а","У","Э","Д","у","р","к","ш","у","г","Ш","п","Й","?","я","Б","И","П"],[[[7,2,1],null,2],[[29,23,22,15],null,null],[[8,9,3,4],null,null],[[31,32,27,26,25,24,18],null,31]],[],[2,31],[0],[{"index":4,"from":3}],{"FOREST":2,"FROG":31},null],"60/hi":[["ला","च","इ","औ","झ","?","ता","ब","ओ","ज","ढ","क","अ","ऐ","छ","ई","ख","क","ए","च","इ","औ","झ","ऋ","ङ","आ","ग","जं","ऊ","घ","अ","?","उ","ल्लू","ख","ञ"],[[[27,26,31],null,31],[[6,0,7],null,null],[[32,33],null,null],[[5,10,11],null,5]],[],[31,5],[17],[{"index":33,"from":32}],{"FOREST":31,"FROG":5},null],"60/ar":[["ص","ي","ز","ل","ح","ط","ت","س","?","خ","ظ","ة","ش","ب","ع","ف","ا","ب","ة","ز","ر","ض","?","ت","س","ك","و","ظ","ث","ش","ة","ب","ة","م","ص","ي"],[[[22,16,17,11],null,22],[[13,20,25,18],null,null],[[31,26,33,32],null,null],[[21,15,8,14],null,8]],[],[22,8],[30],[{"index":32,"from":33}],{"FOREST":22,"FROG":8},null]};
  function freezeTree(value) {
    if(value&&typeof value==='object'&&!Object.isFrozen(value)) {
      Object.values(value).forEach(freezeTree);Object.freeze(value);
    }
    return value;
  }
  const verifiedBoards=freezeTree(Object.fromEntries(data.locales.map(locale=>[locale,
    Object.fromEntries(data.stages.filter(stage=>fixtures[`${stage.id}/${locale}`])
      .map(stage=>[stage.id,fixtures[`${stage.id}/${locale}`]]))])));
  function buildStage(locale,stageNumber) {
    targets(locale,stageNumber);
    const fixture=verifiedBoards[locale]?.[stageNumber];
    if(!fixture) {
      const error=new Error(`FIXTURE_NOT_GENERATED: stage ${stageNumber}/${locale}`);
      error.code='FIXTURE_NOT_GENERATED';throw error;
    }
    const [board,paths,bridges,wildcards,blocked,oneWays,requiredLeafByTarget,junction]=fixture;
    const stage=data.stages.find(item=>item.id===stageNumber);
    const targetData=targets(locale,stageNumber).map((item,index)=>({
      ...item,path:paths[index][0].slice(),bridge:paths[index][1],leaf:paths[index][2],
    }));
    return {id:stageNumber,title:stage.title,size:SIZE,board:board.slice(),targets:targetData,
      bridges:bridges.slice(),wildcards:wildcards.slice(),blocked:blocked.slice(),
      oneWays:oneWays.map(arrow=>({...arrow})),categoryOrder:stage.categoryOrder,
      requiredLeafByTarget:{...requiredLeafByTarget},junction:junction?JSON.parse(JSON.stringify(junction)):null};
  }
  globalThis.WordTrailsStage60=Object.freeze({...data,graphemes,targets,verifiedBoards,buildStage,searchStage});
})();
