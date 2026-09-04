(function () {
  "use strict";

  const C = window.PEACH_OATH_CONFIG;
  const sprites = window.PEACH_OATH_SPRITES;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const today = () => new Date().toISOString().slice(0, 10);
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const fmt = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : String(Math.floor(n));
  const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const localeSegments = { en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const localeLabels = { en: "English", "zh-Hant": "繁體中文", "zh-Hans": "简体中文", ja: "日本語", ko: "한국어", es: "Español", "pt-BR": "Português (Brasil)", fr: "Français", de: "Deutsch", it: "Italiano", ru: "Русский", hi: "हिन्दी", ar: "العربية" };
  const localeOrder = Object.keys(localeSegments);
  const routeLocale = () => {
    const segment = location.pathname.split("/").filter(Boolean)[0];
    return localeOrder.find((locale) => localeSegments[locale] === segment)
      || document.documentElement.lang
      || localStorage.getItem("weightPlayLocale")
      || "en";
  };
  const localeCopy = {
    "zh-Hant": {
      back: "返回 WeightPlay 大廳", settings: "設定", title: "桃園結義", eyebrow: "三國動物放置 RPG",
      intro: "率領義軍自動迎戰，培養武將、整備兵裝，在桃園盟誓後一路挑戰群雄。", progress: "目前進度", start: "開始遊戲",
      guideAria: "遊戲說明", guideTitle: "如何遊玩", guideText: "戰鬥會自動進行；在戰場上領取掉落，再用底部功能培養武將、調整隊伍與提升軍法。",
      battleAria: "桃園結義戰場", backMain: "返回主畫面", power: "戰力", auto: "自動", quick: "快捷功能", missions: "任務", achievements: "成就", events: "活動", codex: "圖鑑", shop: "商店",
      arena: "即時戰鬥區", wave: "Wave", enemies: "敵軍", loot: "戰利品", resources: "資源", mainFunctions: "主要功能", battle: "征戰", heroes: "武將", tavern: "酒館", law: "軍法", campaign: "戰役", close: "關閉",
      bossIncoming: "Boss 來襲！", enemyIncoming: "敵軍來襲", waveVictory: "Wave {wave} 勝利 · 戰利品已掉落", autoOn: "自動戰鬥已開啟", autoOff: "自動戰鬥已暫停", critical: "暴擊 ",
      skillCrane: "{name}施放「{skill}」", skillLeo: "桃園盟誓：全隊回復", skillBear: "鐵壁守陣：獲得護盾", skillCobra: "白蛇妖士施放虛弱咒", debuff: "Debuff 虛弱", shield: "Buff 鐵壁", buff: "Buff 仁心",
      longGoal: "長線目標：{text}", milestone: "戰役里程碑", recovery: "整軍目標", nextChapter: "第 {chapter} 章里程碑：完成第 {end} 關，進入「{next}」。", finalChapter: "最終戰役里程碑：完成第 {end} 關，完成全部 {count} 章征戰。",
      victoryKicker: "{chapter} · {stage}", defeatKicker: "整軍再戰", victoryTitle: "大捷！", defeatTitle: "戰敗", victoryCopy: "義軍擊破關卡 Boss。獎勵已入帳，下一關的敵軍將更強。", defeatCopy: "進度保留在目前關卡；強化武將、裝備與軍法後再次挑戰。", rewardXp: "主公經驗", rewardMaterials: "Boss 材料", collectLoot: "領取戰利品", strengthen: "強化隊伍", next: "下一關", retry: "再次挑戰",
      managementHeroes: "武將與隊伍", managementTavern: "酒館招募", managementLaw: "軍法研習", managementCampaign: "資源戰役", managementBattle: "征戰", teamFormation: "隊伍陣型", maxTeam: "最多 3 名上陣", heroGrowth: "武將養成", heroGrowthMeta: "等級、星級、技能、兵種", equipmentBag: "裝備與背包", upgrade: "升級", break: "突破", remove: "下陣", deploy: "上陣", equip: "穿戴", enhance: "強化", salvage: "分解", noEquipment: "背包目前沒有裝備；Boss 與裝備戰役會掉落新裝備。", front: "前排", back: "後排", fragments: "碎片", level: "Lv.", stars: "星", rank: "突破", attack: "攻", health: "血",
      coachTitle1: "戰鬥會自動進行", coachCopy1: "武將會尋敵、攻擊並施放技能；點擊戰利品可立即收入背包。", coachTitle2: "所有成長都回到戰場", coachCopy2: "使用底部的武將、酒館、軍法與戰役，讓隊伍變強後繼續推關。", coachTitle3: "失敗不會倒退", coachCopy3: "戰敗會停留在目前關卡。調整陣容後點擊再次挑戰即可。", beginCampaign: "開始征戰", nextStep: "下一步",
      resourceCoins: "銅錢", resourceIngots: "元寶", resourceFood: "軍糧", resourceMaterials: "材料", language: "語言", sound: "音樂與音效", quality: "戰鬥畫質", high: "精緻", low: "省電", damage: "顯示傷害數字", save: "存檔", autoSave: "LocalStorage 自動保存", resetProgress: "重置所有進度", reset: "重置存檔", confirmReset: "再次點擊確認", inventory: "件"
    },
    en: {
      back: "Back to WeightPlay lobby", settings: "Settings", title: "Peach Garden Oath", eyebrow: "Animal Three Kingdoms idle RPG",
      intro: "Lead an oath-bound animal squad through auto battles, hero growth, equipment, troop counters, and boss stages.", progress: "Current progress", start: "Start game",
      guideAria: "Game information", guideTitle: "How to play", guideText: "Battles run automatically. Collect drops in the arena, then use the bottom controls to grow heroes, tune your squad, and improve your war laws.",
      battleAria: "Peach Garden Oath battlefield", backMain: "Back to main", power: "Power", auto: "Auto", quick: "Quick actions", missions: "Missions", achievements: "Achievements", events: "Events", codex: "Codex", shop: "Shop",
      arena: "Live battle area", wave: "Wave", enemies: "Enemies", loot: "Loot", resources: "Resources", mainFunctions: "Main functions", battle: "Battle", heroes: "Heroes", tavern: "Tavern", law: "War laws", campaign: "Campaign", close: "Close",
      bossIncoming: "Boss incoming!", enemyIncoming: "Enemies incoming", waveVictory: "Wave {wave} victory · Loot dropped", autoOn: "Auto battle on", autoOff: "Auto battle paused", critical: "Critical ",
      skillCrane: "{name} casts {skill}", skillLeo: "Peach oath: the squad recovers", skillBear: "Iron wall: shield gained", skillCobra: "White Serpent casts Weaken", debuff: "Debuff Weaken", shield: "Buff Iron Wall", buff: "Buff Benevolence",
      longGoal: "Long-term goal: {text}", milestone: "Campaign milestone", recovery: "Recovery goal", nextChapter: "Chapter {chapter} milestone: clear stage {end} to enter {next}.", finalChapter: "Final campaign milestone: clear stage {end} to complete all {count} chapters.",
      victoryKicker: "{chapter} · {stage}", defeatKicker: "Regroup and retry", victoryTitle: "Victory!", defeatTitle: "Defeat", victoryCopy: "The oath-bound squad defeated the stage Boss. Rewards are banked; the next stage is stronger.", defeatCopy: "Progress stays at this stage. Strengthen heroes, equipment, and war laws before trying again.", rewardXp: "Lord XP", rewardMaterials: "Boss materials", collectLoot: "Collect loot", strengthen: "Strengthen team", next: "Next stage", retry: "Retry",
      managementHeroes: "Heroes and squad", managementTavern: "Recruit at tavern", managementLaw: "War laws", managementCampaign: "Resource campaign", managementBattle: "Battle", teamFormation: "Squad formation", maxTeam: "Up to 3 deployed", heroGrowth: "Hero growth", heroGrowthMeta: "Levels, stars, skills, troops", equipmentBag: "Equipment and bag", upgrade: "Upgrade", break: "Breakthrough", remove: "Remove", deploy: "Deploy", equip: "Equip", enhance: "Enhance", salvage: "Salvage", noEquipment: "Your bag is empty; Bosses and equipment campaigns drop new gear.", front: "Front", back: "Back", fragments: "fragments", level: "Lv.", stars: "stars", rank: "Breakthrough", attack: "ATK", health: "HP",
      coachTitle1: "Battles run automatically", coachCopy1: "Heroes find targets, attack, and cast skills. Tap the loot to send it to your bag.", coachTitle2: "Growth returns to the battlefield", coachCopy2: "Use Heroes, Tavern, War Laws, and Campaign below to grow stronger and keep pushing.", coachTitle3: "A defeat never rolls you back", coachCopy3: "A defeat keeps the current stage. Adjust your squad, then choose Retry.", beginCampaign: "Start campaign", nextStep: "Next",
      resourceCoins: "Coins", resourceIngots: "Ingots", resourceFood: "Rations", resourceMaterials: "Materials", language: "Language", sound: "Music and sound", quality: "Battle quality", high: "Detailed", low: "Power saver", damage: "Show damage numbers", save: "Save", autoSave: "Saved automatically in LocalStorage", resetProgress: "Reset all progress", reset: "Reset save", confirmReset: "Click again to confirm", inventory: "items"
    },
    ar: {
      back: "العودة إلى ردهة WeightPlay", settings: "الإعدادات", title: "قسم بستان الخوخ", eyebrow: "لعبة RPG حيوانات خاملة من الممالك الثلاث",
      intro: "قد فريقًا من الحيوانات المتعاهدين عبر القتال التلقائي وتطوير الأبطال والتجهيزات وتفوق الأنواع ومراحل الزعماء.", progress: "التقدم الحالي", start: "ابدأ اللعبة",
      guideAria: "معلومات اللعبة", guideTitle: "طريقة اللعب", guideText: "تجري المعارك تلقائيًا. اجمع الغنائم في الساحة، ثم استخدم أدوات الأسفل لتطوير الأبطال وضبط الفريق وتحسين قوانين الحرب.",
      battleAria: "ساحة معركة قسم بستان الخوخ", backMain: "العودة إلى الرئيسية", power: "القوة", auto: "تلقائي", quick: "إجراءات سريعة", missions: "المهمات", achievements: "الإنجازات", events: "الأحداث", codex: "الموسوعة", shop: "المتجر",
      arena: "منطقة المعركة المباشرة", wave: "الموجة", enemies: "الأعداء", loot: "الغنائم", resources: "الموارد", mainFunctions: "الوظائف الرئيسية", battle: "المعركة", heroes: "الأبطال", tavern: "الحانة", law: "قوانين الحرب", campaign: "الحملة", close: "إغلاق",
      bossIncoming: "الزعيم قادم!", enemyIncoming: "الأعداء قادمون", waveVictory: "انتصار الموجة {wave} · سقطت الغنائم", autoOn: "القتال التلقائي مفعّل", autoOff: "أُوقف القتال التلقائي", critical: "ضربة حرجة ",
      skillCrane: "{name} يستخدم {skill}", skillLeo: "عهد الخوخ: يتعافى الفريق", skillBear: "الجدار الحديدي: اكتسبت درعًا", skillCobra: "الثعبان الأبيض يلقي الإضعاف", debuff: "إضعاف", shield: "درع الجدار الحديدي", buff: "تعزيز الرحمة",
      longGoal: "الهدف الطويل: {text}", milestone: "محطة الحملة", recovery: "هدف الاستعداد", nextChapter: "محطة الفصل {chapter}: أكمل المرحلة {end} لدخول {next}.", finalChapter: "محطة الحملة الأخيرة: أكمل المرحلة {end} لإتمام الفصول {count} كلها.",
      victoryKicker: "{chapter} · {stage}", defeatKicker: "أعد التنظيم وحاول", victoryTitle: "انتصار!", defeatTitle: "هزيمة", victoryCopy: "هزم الفريق المتعاهد زعيم المرحلة. أضيفت المكافآت، وستكون المرحلة التالية أقوى.", defeatCopy: "يبقى تقدمك في هذه المرحلة. طوّر الأبطال والتجهيزات وقوانين الحرب ثم حاول مجددًا.", rewardXp: "خبرة القائد", rewardMaterials: "مواد الزعيم", collectLoot: "اجمع الغنائم", strengthen: "طوّر الفريق", next: "المرحلة التالية", retry: "حاول مجددًا",
      managementHeroes: "الأبطال والفريق", managementTavern: "التجنيد من الحانة", managementLaw: "قوانين الحرب", managementCampaign: "حملة الموارد", managementBattle: "المعركة", teamFormation: "تشكيلة الفريق", maxTeam: "حتى 3 أبطال", heroGrowth: "تطوير الأبطال", heroGrowthMeta: "المستويات والنجوم والمهارات والأنواع", equipmentBag: "التجهيزات والحقيبة", upgrade: "تطوير", break: "اختراق", remove: "إزالة", deploy: "نشر", equip: "تجهيز", enhance: "تعزيز", salvage: "تفكيك", noEquipment: "الحقيبة فارغة؛ تسقط الزعماء وحملات التجهيزات معدات جديدة.", front: "أمامي", back: "خلفي", fragments: "شظايا", level: "مستوى", stars: "نجوم", rank: "اختراق", attack: "هجوم", health: "صحة",
      coachTitle1: "تجري المعارك تلقائيًا", coachCopy1: "يبحث الأبطال عن الأهداف ويهاجمون ويستخدمون المهارات. اضغط على الغنائم لإضافتها إلى حقيبتك.", coachTitle2: "يعود التطوير إلى ساحة المعركة", coachCopy2: "استخدم الأبطال والحانة وقوانين الحرب والحملة أدناه لتقوية الفريق ومواصلة التقدم.", coachTitle3: "الهزيمة لا تعيدك إلى الخلف", coachCopy3: "تبقي الهزيمة المرحلة الحالية. عدّل فريقك ثم اختر المحاولة مجددًا.", beginCampaign: "ابدأ الحملة", nextStep: "التالي",
      resourceCoins: "عملات", resourceIngots: "سبائك", resourceFood: "مؤن", resourceMaterials: "مواد", language: "اللغة", sound: "الموسيقى والمؤثرات", quality: "جودة المعركة", high: "تفصيلية", low: "توفير الطاقة", damage: "إظهار أرقام الضرر", save: "الحفظ", autoSave: "حفظ تلقائي في LocalStorage", resetProgress: "إعادة ضبط كل التقدم", reset: "إعادة ضبط الحفظ", confirmReset: "اضغط مرة أخرى للتأكيد", inventory: "عناصر"
    }
  };
  const localeNames = {
    en: { "桃園起兵": "Peach Garden Muster", "黃巾風雲": "Yellow Turban Rising", "虎牢雄關": "Hulao Pass", "徐州月夜": "Moonlit Xuzhou", "荊州長歌": "Jingzhou Longsong", "赤壁東風": "Red Cliffs East Wind", "漢中爭鋒": "Hanzhong Contest", "五丈星落": "Wuzhang Stars", "玄德獅": "Lion Xuande", "雲長虎": "Tiger Yunchang", "翼德熊": "Bear Yide", "孔明鶴": "Crane Kongming", "子龍狐": "Fox Zilong", "灰狼刀兵": "Gray Wolf Blade", "野豬騎尉": "Boar Rider", "鬣狗弩手": "Hyena Crossbow", "白蛇妖士": "White Serpent", "黑角魔將": "Blackhorn Demon General", "步兵": "Infantry", "騎兵": "Cavalry", "槍兵": "Spearmen", "弓兵": "Archers", "謀士": "Strategist", "傳說": "Legendary", "史詩": "Epic", "稀有": "Rare", "精良": "Fine", "前排均衡": "Balanced front line", "突進爆發": "Burst charge", "前排守護": "Front-line guardian", "群體法術": "Area magic", "遠程連射": "Ranged volley", "仁德劍主": "Lord of Benevolent Blades", "赤膽騎將": "Crimson Cavalier", "鐵壁槍衛": "Ironwall Guard", "羽扇軍師": "Featherfan Strategist", "常勝弓將": "Unbeaten Archer" },
    ar: { "桃園起兵": "تعبئة بستان الخوخ", "黃巾風雲": "صعود العمائم الصفراء", "虎牢雄關": "بوابة هولاو", "徐州月夜": "ليل شوتشو", "荊州長歌": "أنشودة جينغتشو", "赤壁東風": "رياح المنحدرات الحمراء", "漢中爭鋒": "صراع هانتشونغ", "五丈星落": "سقوط نجوم ووتشانغ", "玄德獅": "أسد شوانده", "雲長虎": "نمر يونتشانغ", "翼德熊": "دب ييده", "孔明鶴": "كركي كونغمينغ", "子龍狐": "ثعلب زيلونغ", "灰狼刀兵": "ذئب رمادي", "野豬騎尉": "فارس الخنزير البري", "鬣狗弩手": "رامي الضبع", "白蛇妖士": "ساحر الثعبان الأبيض", "黑角魔將": "جنرال القرن الأسود", "步兵": "مشاة", "騎兵": "فرسان", "槍兵": "رماة الرمح", "弓兵": "رماة", "謀士": "استراتيجي", "傳說": "أسطوري", "史詩": "ملحمي", "稀有": "نادر", "精良": "جيد", "前排均衡": "خط أمامي متوازن", "突進爆發": "اندفاع قوي", "前排守護": "حارس الخط الأمامي", "群體法術": "سحر جماعي", "遠程連射": "وابل بعيد", "仁德劍主": "سيد السيوف الرحيم", "赤膽騎將": "فارس القلب الأحمر", "鐵壁槍衛": "حارس الجدار الحديدي", "羽扇軍師": "مستشار المروحة", "常勝弓將": "رامي لا يُهزم" }
  };
  const localeExtraNames = {
    en: { "桃園劍陣": "Peach Garden Blade Formation", "青月斬": "Azure Moon Slash", "長坂怒吼": "Changban Roar", "東風星火": "East Wind Starfire", "七進箭雨": "Sevenfold Arrow Rain", "百鍊青銅劍": "Hundred-Forged Bronze Sword", "桃紋明光甲": "Peach-patterned Bright Armor", "踏雲戰靴": "Cloudstep War Boots", "盟誓兵符": "Oathbound War Seal", "武器": "Weapon", "鎧甲": "Armor", "戰靴": "Boots", "寶物": "Relic" },
    ar: { "桃園劍陣": "تشكيلة سيوف بستان الخوخ", "青月斬": "ضربة القمر الأزرق", "長坂怒吼": "زئير تشانغبان", "東風星火": "شرر ريح الشرق", "七進箭雨": "وابل السهام السباعي", "百鍊青銅劍": "سيف البرونز المصقول", "桃紋明光甲": "درع الضوء بنقش الخوخ", "踏雲戰靴": "حذاء حرب عابر للسحاب", "盟誓兵符": "ختم عهد الحرب", "武器": "سلاح", "鎧甲": "درع", "戰靴": "حذاء", "寶物": "أثر" }
  };
  const activeLocale = () => localeOrder.includes(routeLocale()) ? routeLocale() : "en";
  const copy = (key, values = {}) => {
    const table = localeCopy[activeLocale()] || localeCopy.en;
    const fallback = localeCopy["zh-Hant"];
    const value = table[key] ?? fallback[key] ?? key;
    return String(value).replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
  };
  const localizedValue = (value) => (localeNames[activeLocale()] || {})[value] || (localeExtraNames[activeLocale()] || {})[value] || value;
  function applyLocale() {
    const locale = activeLocale();
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.dir = locale === "ar" ? "rtl" : "ltr";
    const text = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };
    const attr = (selector, name, value) => { const node = $(selector); if (node) node.setAttribute(name, value); };
    text("#mainTitle", copy("title")); text(".main-copy .eyebrow", copy("eyebrow")); text(".main-copy p", copy("intro"));
    text(".main-progress span", copy("progress")); text("#startBtn", copy("start")); text(".guide h2", copy("guideTitle")); text(".guide p", copy("guideText"));
    attr(".main-return", "aria-label", copy("back")); attr(".shared-header .utility", "aria-label", copy("settings")); attr(".battle-settings", "aria-label", copy("settings"));
    attr("#battleScene", "aria-label", copy("battleAria")); attr("#battleBack", "aria-label", copy("backMain")); attr(".quick-rail", "aria-label", copy("quick")); attr(".arena-wrap", "aria-label", copy("arena"));
    ["missions", "achievements", "events", "codex", "shop", "settings"].forEach((key, index) => { const button = $(".quick-rail button:nth-child(" + (index + 1) + ")"); if (button) { const label = key === "settings" ? copy("settings") : copy(key); text(`.quick-rail button:nth-child(${index + 1}) span`, label); button.setAttribute("aria-label", label); } });
    text("#autoBtn", copy("auto")); attr("#lootPile", "aria-label", copy("collectLoot")); attr(".resource-bar", "aria-label", copy("resources")); attr(".bottom-nav", "aria-label", copy("mainFunctions"));
    ["battle", "heroes", "tavern", "law", "campaign"].forEach((key, index) => text(`.bottom-nav button:nth-child(${index + 1}) b`, copy(key)));
    attr("#closeManagement", "aria-label", copy("close")); attr("#modalClose", "aria-label", copy("close"));
    ["resourceCoins", "resourceIngots", "resourceFood", "resourceMaterials"].forEach((key, index) => { const node = $( `.resource-bar span:nth-child(${index + 1})`); if (node?.firstChild) node.firstChild.nodeValue = `${copy(key)} `; });
    text("#resultKicker", copy("battleResult")); text("#resultTitle", copy("victoryTitle")); text("#resultManage", copy("strengthen")); text("#resultNext", copy("next")); text("#resultRetry", copy("retry"));
    text("#coachTitle", copy("coachTitle1")); text("#coachNext", copy("nextStep"));
    updateHud();
  }

  function defaultState() {
    const heroState = {};
    C.heroes.forEach((hero, index) => {
      heroState[hero.id] = { owned: index < 3, level: 1, star: 1, rank: 0, fragments: index < 3 ? 0 : 6 };
    });
    return {
      version: 1,
      firstSeen: today(),
      lastSave: Date.now(),
      player: { level: 1, xp: 0 },
      stage: 1,
      wave: 1,
      resources: { coins: 2600, ingots: 220, food: 30, materials: 18 },
      heroes: heroState,
      team: ["leo", "tiger", "bear"],
      inventory: [{ uid: uid(), itemId: "bronze-sword", level: 1 }],
      equipped: {},
      law: { valor: 0, bulwark: 0, tactics: 0 },
      stats: { kills: 0, upgrades: 0, summons: 0, bossKills: 0, stagesCleared: 0 },
      claimed: {},
      daily: { date: today(), loginClaimed: false, freeSummon: true, quick: true, campaign: {} },
      settings: { sound: true, quality: "high", damage: true },
      tutorialDone: false
    };
  }

  function mergeState(raw) {
    const base = defaultState();
    if (!raw || typeof raw !== "object") return base;
    return {
      ...base,
      ...raw,
      player: { ...base.player, ...(raw.player || {}) },
      resources: { ...base.resources, ...(raw.resources || {}) },
      heroes: { ...base.heroes, ...(raw.heroes || {}) },
      law: { ...base.law, ...(raw.law || {}) },
      stats: { ...base.stats, ...(raw.stats || {}) },
      claimed: { ...base.claimed, ...(raw.claimed || {}) },
      daily: { ...base.daily, ...(raw.daily || {}), campaign: { ...(raw.daily?.campaign || {}) } },
      settings: { ...base.settings, ...(raw.settings || {}) }
    };
  }

  let state;
  try { state = mergeState(JSON.parse(localStorage.getItem(C.saveKey))); }
  catch { state = defaultState(); }

  if (state.daily.date !== today()) {
    state.daily = { date: today(), loginClaimed: false, freeSummon: true, quick: true, campaign: {} };
  }

  const battle = {
    running: false,
    auto: true,
    speed: 1,
    heroes: [],
    enemies: [],
    pendingLoot: { coins: 0, materials: 0, gear: [] },
    tickHandle: 0,
    resultOpen: false,
    manageFromResult: false
  };

  function save() {
    state.lastSave = Date.now();
    try { localStorage.setItem(C.saveKey, JSON.stringify(state)); }
    catch { /* Storage can be disabled; play remains available for this session. */ }
  }

  function heroData(id) { return C.heroes.find((hero) => hero.id === id); }
  function equipmentData(id) { return C.equipment.find((item) => item.id === id); }
  function levelGoal(level) { return 80 + level * 45; }

  function heroStats(id) {
    const base = heroData(id);
    const progress = state.heroes[id];
    const growth = 1 + (progress.level - 1) * .13 + (progress.star - 1) * .18 + (progress.rank || 0) * .25;
    let atk = base.atk * growth * (1 + state.law.valor * .045);
    let hp = base.hp * growth * (1 + state.law.bulwark * .055);
    let speed = base.speed * (1 + state.law.tactics * .022);
    const equipped = state.equipped[id];
    if (equipped) {
      const item = state.inventory.find((entry) => entry.uid === equipped);
      const def = item && equipmentData(item.itemId);
      if (def?.stat === "atk") atk += def.value * item.level;
      if (def?.stat === "hp") hp += def.value * item.level;
      if (def?.stat === "speed") speed += def.value * item.level;
    }
    return { atk: Math.round(atk), hp: Math.round(hp), speed };
  }

  function totalPower() {
    return state.team.reduce((sum, id) => {
      const stats = heroStats(id);
      return sum + Math.round(stats.atk * 3.4 + stats.hp * .58 + stats.speed * 45);
    }, 0);
  }

  function chapterIndex() { return clamp(Math.floor((state.stage - 1) / C.chapterSize), 0, C.chapters.length - 1); }
  function stageCode() { return `${chapterIndex() + 1}-${((state.stage - 1) % C.chapterSize) + 1}`; }

  function campaignMilestoneText() {
    const chapter = chapterIndex();
    const chapterEnd = Math.min((chapter + 1) * C.chapterSize, C.chapters.length * C.chapterSize);
    const nextChapter = C.chapters[chapter + 1];
    return nextChapter
      ? copy("nextChapter", { chapter: chapter + 1, end: chapterEnd, next: localizedValue(nextChapter) })
      : copy("finalChapter", { end: chapterEnd, count: C.chapters.length });
  }

  function renderCampaignMilestone(resultWin = false) {
    const text = campaignMilestoneText();
    const battleGoal = $("#campaignGoal");
    const resultGoal = $("#resultMilestone");
    if (battleGoal) battleGoal.textContent = copy("longGoal", { text });
    if (resultGoal) resultGoal.textContent = `${resultWin ? copy("milestone") : copy("recovery")}：${text}`;
  }

  function grant(reward) {
    Object.entries(reward).forEach(([key, value]) => {
      if (key === "xp") gainPlayerXp(value);
      else if (key in state.resources) state.resources[key] += value;
    });
    updateHud();
    save();
  }

  function gainPlayerXp(amount) {
    state.player.xp += amount;
    while (state.player.xp >= levelGoal(state.player.level)) {
      state.player.xp -= levelGoal(state.player.level);
      state.player.level += 1;
      toast(`${copy("level")} ${state.player.level}`);
      tone(620, .08);
    }
  }

  function updateHud() {
    $("#playerLevel").textContent = `Lv.${state.player.level}`;
    $("#playerPower").textContent = `${copy("power")} ${fmt(totalPower())}`;
    $("#chapterName").textContent = localizedValue(C.chapters[chapterIndex()]);
    $("#stageLabel").textContent = stageCode();
    $("#mainProgress").textContent = `${state.stage} · ${localizedValue(C.chapters[chapterIndex()])}`;
    $("#coinValue").textContent = fmt(state.resources.coins);
    $("#ingotValue").textContent = fmt(state.resources.ingots);
    $("#foodValue").textContent = fmt(state.resources.food);
    $("#materialValue").textContent = fmt(state.resources.materials);
    $("#waveText").textContent = `${copy("wave")} ${state.wave} / 5`;
    if (!$("#management").classList.contains("is-hidden")) $("#managementMeta").textContent = `${copy("power")} ${fmt(totalPower())}`;
    updateDots();
    updateUnlocks();
  }

  function updateUnlocks() {
    const campaign = $('.bottom-nav [data-tab="campaign"]');
    const locked = state.stage < 2;
    campaign?.classList.toggle("is-locked", locked);
    if (campaign) campaign.setAttribute("aria-label", locked ? `${copy("campaign")} · ${state.stage < 2 ? "2" : state.stage} ${copy("next")}` : copy("campaign"));
  }

  function progressFor(entry) {
    if (entry.field === "stage") return state.stage;
    if (entry.field === "power") return totalPower();
    if (entry.field === "collection") return C.heroes.filter((hero) => state.heroes[hero.id].owned).length;
    return state.stats[entry.field] || 0;
  }

  function updateDots() {
    const missionReady = C.missions.some((m) => progressFor(m) >= m.target && !state.claimed[m.id]);
    const achievementReady = C.achievements.some((a) => progressFor(a) >= a.target && !state.claimed[a.id]);
    const flags = {
      missions: missionReady,
      achievements: achievementReady,
      events: !state.daily.loginClaimed,
      shop: state.daily.quick,
      heroes: state.resources.coins >= heroUpgradeCost(state.team[0]),
      tavern: state.daily.freeSummon,
      campaign: state.stage >= 2 && Object.values(state.daily.campaign).reduce((a, b) => a + b, 0) < 9
    };
    Object.entries(flags).forEach(([key, visible]) => {
      $$(`[data-dot="${key}"]`).forEach((dot) => dot.classList.toggle("is-hidden", !visible));
    });
  }

  function showScene(name) {
    const main = name === "main";
    $("#mainScene").classList.toggle("is-hidden", !main);
    $(".guide")?.classList.toggle("is-hidden", !main);
    $("#battleScene").classList.toggle("is-hidden", main);
    $("#app").dataset.scene = name;
    document.documentElement.classList.toggle("battle-active", !main);
    document.body.classList.toggle("battle-active", !main);
    if (!main) {
      updateHud();
      if (!battle.running && !battle.resultOpen) startWave();
      if (!state.tutorialDone) showCoach();
    } else {
      closeManagement();
      closeModal();
    }
  }

  function makeUnit(data, side, index) {
    const factor = side === "hero" ? 1 : 1 + (state.stage - 1) * .12 + (state.wave - 1) * .06;
    const stats = side === "hero" ? heroStats(data.id) : {
      atk: Math.round(data.atk * factor), hp: Math.round(data.hp * factor), speed: data.speed
    };
    if (data.boss) { stats.hp = Math.round(stats.hp * (1 + state.stage * .09)); stats.atk = Math.round(stats.atk * 1.18); }
    return { key: `${side}-${data.id}-${index}`, id: data.id, data, side, maxHp: stats.hp, hp: stats.hp, atk: stats.atk, speed: stats.speed, cooldown: Math.random() * .45, attacks: 0, status: {} };
  }

  function enemyPack() {
    const boss = state.wave === 5;
    if (boss) return [makeUnit(C.enemies[4], "enemy", 0)];
    const count = clamp(2 + Math.floor((state.stage + state.wave) / 4), 2, 5);
    const available = C.enemies.slice(0, clamp(1 + Math.floor(state.stage / 2), 1, 4));
    return Array.from({ length: count }, (_, index) => makeUnit(available[(state.stage + state.wave + index) % available.length], "enemy", index));
  }

  function startWave() {
    clearInterval(battle.tickHandle);
    battle.resultOpen = false;
    battle.running = true;
    battle.heroes = state.team.filter((id) => state.heroes[id]?.owned).map((id, i) => makeUnit(heroData(id), "hero", i));
    battle.enemies = enemyPack();
    $("#resultPanel").classList.add("is-hidden");
    $("#battleStatus").textContent = state.wave === 5 ? copy("bossIncoming") : copy("enemyIncoming");
    renderCampaignMilestone();
    renderUnits();
    updateHud();
    battle.tickHandle = window.setInterval(battleTick, 260);
  }

  function renderUnits() {
    $("#heroLane").innerHTML = battle.heroes.map(unitMarkup).join("");
    $("#enemyLane").innerHTML = battle.enemies.map(unitMarkup).join("");
    $("#enemyCount").textContent = `${copy("enemies")} ${battle.enemies.filter((u) => u.hp > 0).length}`;
    const boss = battle.enemies.find((unit) => unit.data.boss);
    $("#bossBar").classList.toggle("is-hidden", !boss);
    if (boss) {
      $("#bossName").textContent = localizedValue(boss.data.name);
      $("#bossHpFill").style.width = `${clamp(boss.hp / boss.maxHp * 100, 0, 100)}%`;
    }
  }

  function unitMarkup(unit) {
    const hp = clamp(unit.hp / unit.maxHp * 100, 0, 100);
    return `<div class="unit" data-unit="${unit.key}">
      <i class="hp"><b style="width:${hp}%"></b></i>${sprites.markup(unit.side, unit.data.id, `battle-${unit.key}`)}
      <span class="unit-name">${localizedValue(unit.data.name)}</span><span class="status-badge is-hidden"></span>${unit.side === "hero" && unit.attacks >= 4 ? '<i class="skill-ready"></i>' : ''}
    </div>`;
  }

  function battleTick() {
    if (!battle.running || !battle.auto || battle.resultOpen || !$("#management").classList.contains("is-hidden") || !$("#modalLayer").classList.contains("is-hidden")) return;
    const dt = .26 * battle.speed;
    battle.heroes.filter((unit) => unit.hp > 0).forEach((unit) => runUnitAttack(unit, battle.enemies, dt));
    battle.enemies.filter((unit) => unit.hp > 0).forEach((unit) => runUnitAttack(unit, battle.heroes, dt));
    renderUnitHealth();
    if (!battle.enemies.some((unit) => unit.hp > 0)) waveVictory();
    else if (!battle.heroes.some((unit) => unit.hp > 0)) battleDefeat();
  }

  function runUnitAttack(unit, targets, dt) {
    unit.cooldown -= dt;
    if (unit.cooldown > 0) return;
    const alive = targets.filter((target) => target.hp > 0);
    if (!alive.length) return;
    unit.cooldown = clamp(1.32 / unit.speed, .46, 1.65);
    unit.attacks += 1;
    const skill = (unit.side === "hero" && unit.attacks % 5 === 0) || (unit.id === "cobra" && unit.attacks % 4 === 0);
    const target = alive[Math.floor(Math.random() * alive.length)];
    const crit = Math.random() < (unit.id === "tiger" ? .22 : .1);
    const counter = C.troopCounters[unit.data.troop] === target.data.troop ? 1.22 : 1;
    const variation = .86 + Math.random() * .28;
    let damage = Math.max(1, Math.round(unit.atk * variation * counter * (crit ? 1.7 : 1) * (skill ? (unit.side === "hero" ? 1.85 : 1.25) : 1)));
    if ((unit.status.weakenUntil || 0) > Date.now()) damage = Math.round(damage * .78);
    if ((target.status.shieldUntil || 0) > Date.now()) damage = Math.round(damage * .76);
    if (target.id === "bear" && target.side === "hero") damage = Math.round(damage * .92);
    target.hp = Math.max(0, target.hp - damage);
    animateAttack(unit, target, damage, crit, skill);
    if (skill) applySkill(unit, targets);
  }

  function applySkill(unit, targets) {
    if (unit.id === "crane") {
      targets.filter((target) => target.hp > 0).forEach((target) => { target.hp = Math.max(0, target.hp - Math.round(unit.atk * .62)); });
      $("#battleStatus").textContent = copy("skillCrane", { name: localizedValue(unit.data.name), skill: localizedValue(unit.data.skill) });
    } else if (unit.id === "leo") {
      battle.heroes.filter((hero) => hero.hp > 0).forEach((hero) => { hero.hp = Math.min(hero.maxHp, hero.hp + Math.round(hero.maxHp * .08)); hero.status.buffUntil = Date.now() + 2800; });
      $("#battleStatus").textContent = copy("skillLeo");
    } else if (unit.id === "bear") {
      unit.hp = Math.min(unit.maxHp, unit.hp + Math.round(unit.maxHp * .14));
      unit.status.shieldUntil = Date.now() + 3200;
      $("#battleStatus").textContent = copy("skillBear");
    } else if (unit.id === "cobra") {
      const target = battle.heroes.filter((hero) => hero.hp > 0).sort((a, b) => b.atk - a.atk)[0];
      if (target) target.status.weakenUntil = Date.now() + 3200;
      $("#battleStatus").textContent = copy("skillCobra");
    } else {
      $("#battleStatus").textContent = copy("skillCrane", { name: localizedValue(unit.data.name), skill: localizedValue(unit.data.skill) });
    }
    tone(520, .05);
  }

  function animateAttack(unit, target, damage, crit, skill) {
    const attacker = $(`[data-unit="${unit.key}"]`);
    const victim = $(`[data-unit="${target.key}"]`);
    attacker?.classList.add("is-attacking");
    victim?.classList.add("is-hit");
    setTimeout(() => attacker?.classList.remove("is-attacking"), 170);
    setTimeout(() => victim?.classList.remove("is-hit"), 170);
    if (state.settings.damage) {
      const hit = document.createElement("span");
      hit.className = `damage${crit ? " crit" : ""}${skill ? " skill" : ""}`;
      hit.textContent = `${crit ? copy("critical") : ""}-${damage}`;
      hit.style.setProperty("--x", `${22 + Math.random() * 56}%`);
      hit.style.setProperty("--y", `${target.side === "enemy" ? 16 + Math.random() * 18 : 55 + Math.random() * 15}%`);
      $("#combatFeed").append(hit);
      setTimeout(() => hit.remove(), 900);
    }
  }

  function renderUnitHealth() {
    [...battle.heroes, ...battle.enemies].forEach((unit) => {
      const el = $(`[data-unit="${unit.key}"]`);
      if (!el) return;
      const fill = $(".hp b", el);
      if (fill) fill.style.width = `${clamp(unit.hp / unit.maxHp * 100, 0, 100)}%`;
      el.style.opacity = unit.hp <= 0 ? ".18" : "1";
      const badge = $(".status-badge", el);
      if (badge) {
        const weakened = (unit.status.weakenUntil || 0) > Date.now();
        const shielded = (unit.status.shieldUntil || 0) > Date.now();
        const buffed = (unit.status.buffUntil || 0) > Date.now();
        badge.textContent = weakened ? copy("debuff") : shielded ? copy("shield") : buffed ? copy("buff") : "";
        badge.classList.toggle("is-debuff", weakened);
        badge.classList.toggle("is-hidden", !weakened && !shielded && !buffed);
      }
    });
    const boss = battle.enemies.find((unit) => unit.data.boss);
    if (boss) $("#bossHpFill").style.width = `${clamp(boss.hp / boss.maxHp * 100, 0, 100)}%`;
    $("#enemyCount").textContent = `${copy("enemies")} ${battle.enemies.filter((u) => u.hp > 0).length}`;
  }

  function waveVictory() {
    if (!battle.running) return;
    battle.running = false;
    state.stats.kills += battle.enemies.length;
    const reward = { coins: 70 + state.stage * 18 + state.wave * 12, materials: state.wave === 5 ? 3 : 1 };
    battle.pendingLoot.coins += reward.coins;
    battle.pendingLoot.materials += reward.materials;
    if (Math.random() < .18 || state.wave === 5) battle.pendingLoot.gear.push(C.equipment[Math.floor(Math.random() * C.equipment.length)].id);
    $("#lootPile").classList.remove("is-hidden");
    $("#battleStatus").textContent = copy("waveVictory", { wave: state.wave });
    if (state.wave < 5) {
      state.wave += 1;
      save();
      setTimeout(() => { if (!battle.resultOpen) startWave(); }, 900 / battle.speed);
    } else {
      state.stats.bossKills += 1;
      state.stats.stagesCleared += 1;
      gainPlayerXp(35 + state.stage * 6);
      openResult(true, reward);
    }
  }

  function battleDefeat() {
    if (!battle.running) return;
    battle.running = false;
    openResult(false, {});
  }

  function openResult(win, reward) {
    battle.resultOpen = true;
    clearInterval(battle.tickHandle);
    $("#resultPanel").classList.remove("is-hidden");
    $("#resultKicker").textContent = win ? copy("victoryKicker", { chapter: localizedValue(C.chapters[chapterIndex()]), stage: stageCode() }) : copy("defeatKicker");
    $("#resultTitle").textContent = win ? copy("victoryTitle") : copy("defeatTitle");
    $("#resultCopy").textContent = win ? copy("victoryCopy") : copy("defeatCopy");
    $("#resultRewards").innerHTML = win ? `<span>${copy("rewardXp")} +${35 + state.stage * 6}</span><span>${copy("rewardMaterials")} +${reward.materials || 3}</span>` : "";
    renderCampaignMilestone(win);
    $("#resultNext").classList.toggle("is-hidden", !win);
    $("#resultRetry").classList.toggle("is-hidden", win);
    if (win) collectLoot(true);
    updateHud();
    save();
    tone(win ? 720 : 180, .12);
  }

  function collectLoot(silent) {
    const loot = battle.pendingLoot;
    if (!loot.coins && !loot.materials && !loot.gear.length) return;
    state.resources.coins += loot.coins;
    state.resources.materials += loot.materials;
    loot.gear.forEach((itemId) => state.inventory.push({ uid: uid(), itemId, level: 1 }));
    if (!silent) toast(`${copy("resourceCoins")} ${loot.coins} · ${copy("resourceMaterials")} ${loot.materials}${loot.gear.length ? ` · ${copy("equipmentBag")} ${loot.gear.length}` : ""}`);
    battle.pendingLoot = { coins: 0, materials: 0, gear: [] };
    $("#lootPile").classList.add("is-hidden");
    updateHud();
    save();
  }

  function heroUpgradeCost(id) {
    const lv = state.heroes[id]?.level || 1;
    return Math.round(180 * Math.pow(lv, 1.28));
  }

  function openManagement(tab) {
    closeModal();
    $("#management").classList.remove("is-hidden");
    $$(".bottom-nav button").forEach((button) => button.classList.toggle("is-active", button.dataset.tab === tab));
    const titles = { heroes: copy("managementHeroes"), tavern: copy("managementTavern"), law: copy("managementLaw"), campaign: copy("managementCampaign") };
    $("#managementTitle").textContent = titles[tab] || copy("managementBattle");
    $("#managementMeta").textContent = `${copy("power")} ${fmt(totalPower())}`;
    if (tab === "heroes") renderHeroes();
    if (tab === "tavern") renderTavern();
    if (tab === "law") renderLaw();
    if (tab === "campaign") renderCampaign();
  }

  function closeManagement() {
    $("#management").classList.add("is-hidden");
    $$(".bottom-nav button").forEach((button) => button.classList.toggle("is-active", button.dataset.tab === "battle"));
    if (battle.manageFromResult) {
      battle.manageFromResult = false;
      battle.resultOpen = true;
      $("#resultPanel").classList.remove("is-hidden");
    }
  }

  function renderHeroes() {
    const formation = state.team.map((id, index) => `<div class="formation-slot"><span>${index < 2 ? copy("front") : copy("back")}</span><strong>${localizedValue(heroData(id).name)}</strong></div>`).join("");
    const cards = C.heroes.map((hero) => {
      const p = state.heroes[hero.id];
      const stats = p.owned ? heroStats(hero.id) : null;
      const cost = heroUpgradeCost(hero.id);
      const breakCost = 8 + (p.rank || 0) * 6;
      const canBreak = p.level >= ((p.rank || 0) + 1) * 5 && state.resources.materials >= breakCost;
      return `<article class="hero-card" data-hero="${hero.id}">
        <div class="hero-portrait">${sprites.markup("hero", hero.id, `roster-${hero.id}`)}</div>
        <div class="hero-card-copy"><span class="quality">${localizedValue(hero.quality)} · ${localizedValue(hero.troop)}</span><h3>${localizedValue(hero.name)}</h3>
        <p>${p.owned ? `${localizedValue(hero.role)} · ${localizedValue(hero.skill)}` : `${copy("fragments")} ${p.fragments}/10`}</p>
        ${p.owned ? `<div class="mini-stats"><span>${copy("level")}${p.level}</span><span>${p.star} ${copy("stars")}</span><span>${copy("rank")} +${p.rank || 0}</span><span>${copy("attack")} ${stats.atk}</span><span>${copy("health")} ${stats.hp}</span></div>
        <div class="card-actions"><button data-action="upgrade-hero" data-id="${hero.id}" ${state.resources.coins < cost ? "disabled" : ""}>${copy("upgrade")} ${cost}</button><button data-action="break-hero" data-id="${hero.id}" ${canBreak ? "" : "disabled"}>${copy("break")} ${breakCost}</button><button class="alt" data-action="toggle-team" data-id="${hero.id}">${state.team.includes(hero.id) ? copy("remove") : copy("deploy")}</button></div>` : ""}
        </div></article>`;
    }).join("");
    const equipment = state.inventory.length ? state.inventory.map((entry) => {
      const def = equipmentData(entry.itemId);
      const holder = Object.keys(state.equipped).find((id) => state.equipped[id] === entry.uid);
      const enhanceCost = 3 + entry.level * 2;
      return `<div class="equipment-row"><div><strong>${localizedValue(def.name)} +${entry.level}</strong><small>${localizedValue(def.slot)} · ${localizedValue(def.quality)} · ${def.stat.toUpperCase()} +${fmt(def.value * entry.level)}${holder ? ` · ${localizedValue(heroData(holder).name)}` : ""}</small></div><div class="card-actions"><button data-action="equip" data-uid="${entry.uid}">${copy("equip")}</button><button data-action="upgrade-equipment" data-uid="${entry.uid}" ${state.resources.materials < enhanceCost ? "disabled" : ""}>${copy("enhance")} ${enhanceCost}</button><button class="alt" data-action="salvage" data-uid="${entry.uid}">${copy("salvage")}</button></div></div>`;
    }).join("") : `<p>${copy("noEquipment")}</p>`;
    $("#managementBody").innerHTML = `<div class="section-title"><h3>${copy("teamFormation")}</h3><span>${copy("maxTeam")}</span></div><div class="formation">${formation}</div>
      <div class="section-title"><h3>${copy("heroGrowth")}</h3><span>${copy("heroGrowthMeta")}</span></div><div class="hero-grid">${cards}</div>
      <div class="section-title"><h3>${copy("equipmentBag")}</h3><span>${state.inventory.length} ${copy("inventory")}</span></div><div>${equipment}</div>`;
  }

  function renderTavern() {
    const owned = C.heroes.filter((hero) => state.heroes[hero.id].owned).length;
    $("#managementBody").innerHTML = `<section class="summon-stage"><span class="eyebrow">桃園酒肆</span><h3>煮酒招英傑</h3><p>招募可獲得武將碎片；集滿 10 片即可解鎖，已擁有武將的碎片會累積升星。</p><div class="summon-buttons"><button data-action="summon" data-count="1">${state.daily.freeSummon ? "免費招募" : "招募一次 · 60 元寶"}</button><button data-action="summon" data-count="5">招募五次 · 260 元寶</button></div></section>
      <div class="section-title"><h3>武將名冊</h3><span>${owned} / ${C.heroes.length}</span></div><div class="card-grid">${C.heroes.map((hero) => { const p = state.heroes[hero.id]; return `<article class="panel-card"><span class="quality">${hero.quality} · ${hero.troop}</span><h3>${hero.name}</h3><p>${hero.title}</p><div class="progress"><b style="width:${p.owned ? 100 : p.fragments * 10}%"></b></div><small>${p.owned ? `已獲得 · ${p.fragments} 碎片` : `${p.fragments} / 10 碎片`}</small></article>`; }).join("")}</div>`;
  }

  function renderLaw() {
    const laws = [
      { id: "valor", seal: "武", title: "勇武軍令", copy: "全隊攻擊提升 4.5%" },
      { id: "bulwark", seal: "守", title: "堅陣軍令", copy: "全隊生命提升 5.5%" },
      { id: "tactics", seal: "策", title: "疾行軍令", copy: "全隊攻速提升 2.2%" }
    ];
    $("#managementBody").innerHTML = `<div class="section-title"><h3>全隊永久強化</h3><span>材料 ${state.resources.materials}</span></div><div class="law-tree">${laws.map((law) => { const level = state.law[law.id]; const cost = 6 + level * 5; return `<article class="law-node"><span class="seal">${law.seal}</span><div><h3>${law.title} · ${level} 級</h3><p>${law.copy} · 下一級需 ${cost} 材料</p></div><button data-action="law" data-id="${law.id}" ${state.resources.materials < cost ? "disabled" : ""}>研習</button></article>`; }).join("")}</div>`;
  }

  function renderCampaign() {
    const campaigns = [
      { id: "coins", title: "銅雀金庫", copy: "迎戰守庫軍，取得大量銅錢。", reward: { coins: 2200 + state.stage * 80 } },
      { id: "xp", title: "群英試煉", copy: "與名將切磋，取得主公經驗。", reward: { xp: 90 + state.stage * 4 } },
      { id: "gear", title: "兵甲秘庫", copy: "打開古代軍械庫，必得一件裝備。", reward: { gear: 1 } },
      { id: "materials", title: "軍法演武", copy: "完成兵種操演，取得軍法材料。", reward: { materials: 14 + Math.floor(state.stage / 2) } },
      { id: "daily-boss", title: "每日 Boss · 黑角試煉", copy: "每日挑戰強敵一次，取得元寶與必得裝備。", reward: { ingots: 25, gear: 1 }, limit: 1 }
    ];
    $("#managementBody").innerHTML = `<div class="section-title"><h3>每日戰役</h3><span>資源副本與特殊 Boss</span></div><div class="campaign-grid">${campaigns.map((c) => { const used = state.daily.campaign[c.id] || 0; const limit = c.limit || 2; return `<article class="campaign-card"><span class="quality">剩餘 ${limit - used} / ${limit}</span><h3>${c.title}</h3><p>${c.copy}</p><button data-action="campaign" data-id="${c.id}" ${used >= limit ? "disabled" : ""}>立即挑戰</button></article>`; }).join("")}</div>`;
  }

  function managementAction(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const { action, id, uid: itemUid } = button.dataset;
    if (action === "upgrade-hero") {
      const cost = heroUpgradeCost(id);
      if (state.resources.coins < cost) return;
      state.resources.coins -= cost;
      state.heroes[id].level = Math.min(C.heroLevelCap, state.heroes[id].level + 1);
      state.stats.upgrades += 1;
      toast(`${localizedValue(heroData(id).name)} · ${copy("upgrade")} ${state.heroes[id].level}`);
      renderHeroes();
    }
    if (action === "break-hero") {
      const p = state.heroes[id];
      const cost = 8 + (p.rank || 0) * 6;
      if (p.level < ((p.rank || 0) + 1) * 5 || state.resources.materials < cost) return;
      state.resources.materials -= cost;
      p.rank = (p.rank || 0) + 1;
      toast(`${localizedValue(heroData(id).name)} · ${copy("break")} complete`);
      renderHeroes();
    }
    if (action === "toggle-team") {
      const at = state.team.indexOf(id);
      if (at >= 0) {
        if (state.team.length === 1) return toast(`${copy("heroes")} · 1`);
        state.team.splice(at, 1);
      } else if (state.team.length < 3) state.team.push(id);
      else return toast(copy("maxTeam"));
      renderHeroes();
    }
    if (action === "equip") {
      const target = state.team[0];
      Object.keys(state.equipped).forEach((heroId) => { if (state.equipped[heroId] === itemUid) delete state.equipped[heroId]; });
      state.equipped[target] = itemUid;
      toast(`${localizedValue(equipmentData(state.inventory.find((entry) => entry.uid === itemUid).itemId).name)} · ${copy("equip")} · ${localizedValue(heroData(target).name)}`);
      renderHeroes();
    }
    if (action === "salvage") {
      const index = state.inventory.findIndex((entry) => entry.uid === itemUid);
      if (index < 0) return;
      Object.keys(state.equipped).forEach((heroId) => { if (state.equipped[heroId] === itemUid) delete state.equipped[heroId]; });
      state.inventory.splice(index, 1);
      state.resources.materials += 5;
      toast(`${copy("salvage")} · ${copy("resourceMaterials")} 5`);
      renderHeroes();
    }
    if (action === "upgrade-equipment") {
      const item = state.inventory.find((entry) => entry.uid === itemUid);
      if (!item) return;
      const cost = 3 + item.level * 2;
      if (state.resources.materials < cost) return;
      state.resources.materials -= cost;
      item.level += 1;
      toast(`${localizedValue(equipmentData(item.itemId).name)} · ${copy("enhance")} +${item.level}`);
      renderHeroes();
    }
    if (action === "summon") summon(Number(button.dataset.count || 1));
    if (action === "law") {
      const cost = 6 + state.law[id] * 5;
      if (state.resources.materials < cost) return;
      state.resources.materials -= cost;
      state.law[id] += 1;
      toast(`${copy("managementLaw")} · ${copy("upgrade")}`);
      renderLaw();
    }
    if (action === "campaign") runCampaign(id);
    updateHud(); save();
  }

  function summon(count) {
    const cost = count === 5 ? 260 : state.daily.freeSummon ? 0 : 60;
    if (state.resources.ingots < cost) return toast("元寶不足");
    state.resources.ingots -= cost;
    if (count === 1) state.daily.freeSummon = false;
    const results = [];
    for (let i = 0; i < count; i += 1) {
      const hero = C.heroes[Math.floor(Math.random() * C.heroes.length)];
      const amount = Math.random() < .16 ? 5 : 2;
      const p = state.heroes[hero.id];
      p.fragments += amount;
      if (!p.owned && p.fragments >= 10) { p.owned = true; p.fragments -= 10; results.push(`${hero.name}加入`); }
      else if (p.owned && p.fragments >= 20 && p.star < 5) { p.fragments -= 20; p.star += 1; results.push(`${hero.name}升至 ${p.star} 星`); }
      else results.push(`${hero.name}碎片 ×${amount}`);
    }
    state.stats.summons += count;
    openModal("招募結果", `<div class="list">${results.map((r) => `<div class="list-item"><p>${r}</p></div>`).join("")}</div>`);
    renderTavern(); tone(660, .1);
  }

  function runCampaign(id) {
    const used = state.daily.campaign[id] || 0;
    const limit = id === "daily-boss" ? 1 : 2;
    if (used >= limit) return;
    state.daily.campaign[id] = used + 1;
    if (id === "coins") grant({ coins: 2200 + state.stage * 80 });
    if (id === "xp") grant({ xp: 90 + state.stage * 4 });
    if (id === "materials") grant({ materials: 14 + Math.floor(state.stage / 2) });
    if (id === "daily-boss") { grant({ ingots: 25 }); state.stats.bossKills += 1; }
    if (id === "gear" || id === "daily-boss") {
      const def = C.equipment[Math.floor(Math.random() * C.equipment.length)];
      state.inventory.push({ uid: uid(), itemId: def.id, level: 1 });
      toast(`取得裝備：${def.name}`);
    } else toast("戰役速戰完成，獎勵已領取");
    renderCampaign();
  }

  function openModal(title, html) {
    closeManagement();
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = html;
    $("#modalLayer").classList.remove("is-hidden");
    $("#modalClose").focus();
  }

  function closeModal() { $("#modalLayer").classList.add("is-hidden"); }

  function objectiveModal(entries, kind) {
    openModal(kind === "mission" ? "任務" : "成就", `<div class="list">${entries.map((entry) => {
      const value = progressFor(entry);
      const ready = value >= entry.target;
      const claimed = state.claimed[entry.id];
      const reward = Object.entries(entry.reward).map(([key, amount]) => `${resourceName(key)} ${amount}`).join("、");
      return `<div class="list-item"><div><p>${entry.label}</p><small>${Math.min(value, entry.target)} / ${entry.target} · ${reward}</small><div class="progress"><b style="width:${clamp(value / entry.target * 100,0,100)}%"></b></div></div><button data-claim="${entry.id}" data-kind="${kind}" ${!ready || claimed ? "disabled" : ""}>${claimed ? "已領取" : "領取"}</button></div>`;
    }).join("")}</div>`);
  }

  function resourceName(key) { return ({ coins: "銅錢", ingots: "元寶", food: "軍糧", materials: "材料", xp: "經驗" })[key] || key; }

  function quickOpen(name) {
    if (name === "missions") objectiveModal(C.missions, "mission");
    if (name === "achievements") objectiveModal(C.achievements, "achievement");
    if (name === "events") renderEvents();
    if (name === "codex") renderCodex();
    if (name === "shop") renderShop();
    if (name === "settings") renderSettings();
  }

  function renderEvents() {
    const day = Math.min(7, Math.max(1, Math.floor((new Date(today()) - new Date(state.firstSeen)) / 86400000) + 1));
    openModal("登入與七日活動", `<div class="list"><div class="list-item"><div><p>第 ${day} 日登入獎勵</p><small>元寶 ${20 + day * 10} · 軍糧 ${5 + day}</small></div><button data-event="login" ${state.daily.loginClaimed ? "disabled" : ""}>${state.daily.loginClaimed ? "已領取" : "領取"}</button></div>
      <div class="list-item"><div><p>新手成長：通過第 5 關</p><small>完成後獲得稀有裝備箱</small><div class="progress"><b style="width:${clamp(state.stage / 5 * 100,0,100)}%"></b></div></div><button disabled>${state.stage >= 5 ? "待開放" : `${state.stage}/5`}</button></div>
      <div class="list-item"><div><p>限時活動：桃花軍備</p><small>完成 3 次武將升級可獲得 30 元寶</small><div class="progress"><b style="width:${clamp(state.stats.upgrades / 3 * 100,0,100)}%"></b></div></div><button data-event="upgrade" ${state.stats.upgrades < 3 || state.claimed["event-upgrades"] ? "disabled" : ""}>${state.claimed["event-upgrades"] ? "已領取" : "領取"}</button></div></div>`);
  }

  function renderCodex() {
    const owned = C.heroes.filter((hero) => state.heroes[hero.id].owned).length;
    const seenEnemies = clamp(1 + Math.floor(state.stage / 2), 1, C.enemies.length);
    openModal("圖鑑", `<div class="card-grid"><article class="panel-card"><span class="quality">武將圖鑑</span><h3>${owned} / ${C.heroes.length}</h3><p>收集武將，查看品質、兵種與技能。</p></article><article class="panel-card"><span class="quality">敵軍圖鑑</span><h3>${seenEnemies} / ${C.enemies.length}</h3><p>推進關卡會揭露新兵種與 Boss。</p></article><article class="panel-card"><span class="quality">裝備圖鑑</span><h3>${new Set(state.inventory.map((item) => item.itemId)).size} / ${C.equipment.length}</h3><p>Boss、戰役與商店會掉落不同品質裝備。</p></article></div>`);
  }

  function renderShop() {
    openModal("商店", `<div class="list"><div class="list-item"><div><p>快速收益 · 10 分鐘</p><small>依目前關卡獲得掛機銅錢與材料</small></div><button data-shop="quick" ${!state.daily.quick ? "disabled" : ""}>${state.daily.quick ? "免費" : "已領取"}</button></div>
      <div class="list-item"><div><p>軍糧補給</p><small>軍糧 50</small></div><button data-shop="food">20 元寶</button></div>
      <div class="list-item"><div><p>材料木箱</p><small>軍法材料 20</small></div><button data-shop="material">35 元寶</button></div>
      <div class="list-item"><div><p>精良裝備箱</p><small>隨機獲得一件裝備</small></div><button data-shop="gear">80 元寶</button></div></div>`);
  }

  function renderSettings() {
    const locale = localeOrder.includes(routeLocale()) ? routeLocale() : "en";
    const options = localeOrder.map((code) => `<option value="${code}" ${code === locale ? "selected" : ""}>${localeLabels[code]}</option>`).join("");
    openModal(copy("settings"), `<div class="settings-list"><div class="setting-row"><span>${copy("language")}</span><select id="localeSelect" data-setting="locale" data-wp-language aria-label="${copy("language")}">${options}</select></div>
      <div class="setting-row"><span>${copy("sound")}</span><button class="toggle ${state.settings.sound ? "is-on" : ""}" data-setting="sound" data-sound-toggle aria-pressed="${state.settings.sound}"></button></div>
      <div class="setting-row"><span>${copy("quality")}</span><select data-setting="quality"><option value="high" ${state.settings.quality === "high" ? "selected" : ""}>${copy("high")}</option><option value="low" ${state.settings.quality === "low" ? "selected" : ""}>${copy("low")}</option></select></div>
      <div class="setting-row"><span>${copy("damage")}</span><button class="toggle ${state.settings.damage ? "is-on" : ""}" data-setting="damage" aria-pressed="${state.settings.damage}"></button></div>
      <div class="setting-row"><span>${copy("save")}</span><strong>${copy("autoSave")}</strong></div>
      <div class="setting-row"><span>${copy("resetProgress")}</span><button data-reset="arm">${copy("reset")}</button></div></div>`);
  }

  function modalAction(event) {
    const claim = event.target.closest("[data-claim]");
    if (claim) {
      const pool = claim.dataset.kind === "mission" ? C.missions : C.achievements;
      const entry = pool.find((item) => item.id === claim.dataset.claim);
      if (entry && progressFor(entry) >= entry.target && !state.claimed[entry.id]) {
        state.claimed[entry.id] = true; grant(entry.reward); objectiveModal(pool, claim.dataset.kind);
      }
    }
    const eventButton = event.target.closest("[data-event]");
    if (eventButton?.dataset.event === "login" && !state.daily.loginClaimed) {
      const day = Math.min(7, Math.max(1, Math.floor((new Date(today()) - new Date(state.firstSeen)) / 86400000) + 1));
      state.daily.loginClaimed = true; grant({ ingots: 20 + day * 10, food: 5 + day }); renderEvents();
    }
    if (eventButton?.dataset.event === "upgrade" && state.stats.upgrades >= 3 && !state.claimed["event-upgrades"]) {
      state.claimed["event-upgrades"] = true; grant({ ingots: 30 }); renderEvents();
    }
    const shop = event.target.closest("[data-shop]");
    if (shop) shopPurchase(shop.dataset.shop);
    const setting = event.target.closest("[data-setting]");
    if (setting && setting.tagName === "BUTTON") {
      const key = setting.dataset.setting; state.settings[key] = !state.settings[key]; renderSettings(); save();
    }
    const reset = event.target.closest("[data-reset]");
    if (reset) {
      if (reset.dataset.reset === "arm") { reset.dataset.reset = "confirm"; reset.textContent = copy("confirmReset"); }
      else { localStorage.removeItem(C.saveKey); location.reload(); }
    }
  }

  function shopPurchase(id) {
    const costs = { food: 20, material: 35, gear: 80 };
    if (id === "quick" && state.daily.quick) {
      state.daily.quick = false; grant({ coins: Math.round((16 + state.stage * 4) * 600), materials: 6 + Math.floor(state.stage / 3) }); renderShop(); return;
    }
    const cost = costs[id];
    if (!cost || state.resources.ingots < cost) return toast("元寶不足");
    state.resources.ingots -= cost;
    if (id === "food") state.resources.food += 50;
    if (id === "material") state.resources.materials += 20;
    if (id === "gear") state.inventory.push({ uid: uid(), itemId: C.equipment[Math.floor(Math.random() * C.equipment.length)].id, level: 1 });
    toast("購買成功"); updateHud(); renderShop(); save();
  }

  function calculateOffline() {
    const elapsed = clamp(Math.floor((Date.now() - Number(state.lastSave || Date.now())) / 1000), 0, C.maxOfflineSeconds);
    if (elapsed < 60) return;
    const coins = Math.floor(elapsed * (1.5 + state.stage * .24));
    const materials = Math.floor(elapsed / 900);
    grant({ coins, materials });
    openModal("離線收益", `<p>義軍在你離開的 ${Math.floor(elapsed / 60)} 分鐘持續巡守，收益最多累積 8 小時。</p><div class="reward-row"><span>銅錢 +${fmt(coins)}</span><span>材料 +${materials}</span></div>`);
  }

  function showCoach() {
    const steps = [
      [copy("coachTitle1"), copy("coachCopy1")],
      [copy("coachTitle2"), copy("coachCopy2")],
      [copy("coachTitle3"), copy("coachCopy3")]
    ];
    let index = 0;
    const coach = $("#coach");
    coach.classList.remove("is-hidden");
    const render = () => {
      $("#coachStep").textContent = `${index + 1} / ${steps.length}`;
      $("#coachTitle").textContent = steps[index][0];
      $("#coachCopy").textContent = steps[index][1];
      $("#coachNext").textContent = index === steps.length - 1 ? copy("beginCampaign") : copy("nextStep");
    };
    $("#coachNext").onclick = () => {
      index += 1;
      if (index >= steps.length) { coach.classList.add("is-hidden"); state.tutorialDone = true; save(); }
      else render();
    };
    render();
  }

  function toast(message) {
    const existing = $(".toast");
    existing?.remove();
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    $("#battleScene").append(node);
    setTimeout(() => node.remove(), 2250);
  }

  let audioContext;
  function tone(frequency, duration) {
    if (!state.settings.sound) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.035, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
    } catch { /* Sound is optional. */ }
  }

  function bind() {
    $("#startBtn").addEventListener("click", () => showScene("battle"));
    $("#battleBack").addEventListener("click", () => showScene("main"));
    $("#autoBtn").addEventListener("click", () => {
      battle.auto = !battle.auto;
      $("#autoBtn").classList.toggle("is-on", battle.auto);
      $("#autoBtn").setAttribute("aria-pressed", String(battle.auto));
      $("#battleStatus").textContent = battle.auto ? copy("autoOn") : copy("autoOff");
    });
    $("#speedBtn").addEventListener("click", () => { battle.speed = battle.speed === 1 ? 2 : 1; $("#speedBtn").textContent = `×${battle.speed}`; });
    $("#lootPile").addEventListener("click", () => collectLoot(false));
    $$("[data-open]").forEach((button) => button.addEventListener("click", () => quickOpen(button.dataset.open)));
    $$(".bottom-nav button").forEach((button) => button.addEventListener("click", () => {
      if (button.dataset.tab === "campaign" && state.stage < 2) return toast(`${copy("campaign")} · ${copy("next")} 2`);
      return button.dataset.tab === "battle" ? closeManagement() : openManagement(button.dataset.tab);
    }));
    $("#closeManagement").addEventListener("click", closeManagement);
    $("#managementBody").addEventListener("click", managementAction);
    $("#modalClose").addEventListener("click", closeModal);
    $("#modalLayer").addEventListener("click", (event) => { if (event.target === $("#modalLayer")) closeModal(); });
    $("#modalBody").addEventListener("click", modalAction);
    $("#modalBody").addEventListener("change", (event) => {
      if (event.target.dataset.setting === "locale") {
        const next = localeOrder.includes(event.target.value) ? event.target.value : "en";
        localStorage.setItem("weightPlayLocale", next);
        localStorage.setItem("weightplayLocale", next);
        const target = `/${localeSegments[next]}/games/animal-peach-oath/${location.search}${location.hash}`;
        if (/^https?:$/.test(location.protocol) && location.pathname !== target) { location.assign(target); return; }
        document.documentElement.lang = next;
        document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
        document.body.dir = next === "ar" ? "rtl" : "ltr";
        applyLocale();
        renderSettings();
      }
      if (event.target.dataset.setting === "quality") { state.settings.quality = event.target.value; document.body.dataset.quality = event.target.value; save(); }
    });
    $("#resultManage").addEventListener("click", () => { $("#resultPanel").classList.add("is-hidden"); battle.manageFromResult = true; openManagement("heroes"); });
    $("#resultNext").addEventListener("click", () => { state.stage += 1; state.wave = 1; $("#resultPanel").classList.add("is-hidden"); startWave(); save(); });
    $("#resultRetry").addEventListener("click", () => { $("#resultPanel").classList.add("is-hidden"); state.wave = 1; startWave(); });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!$("#modalLayer").classList.contains("is-hidden")) closeModal();
      else if (!$("#management").classList.contains("is-hidden")) closeManagement();
    });
    window.addEventListener("beforeunload", save);
    document.addEventListener("visibilitychange", () => { if (document.hidden) save(); });
    setInterval(save, 5000);
  }

  applyLocale();
  bind();
  updateHud();
  document.body.dataset.quality = state.settings.quality;
  calculateOffline();
})();
