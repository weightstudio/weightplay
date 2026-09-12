(function () {
  "use strict";

  const C = window.PEACH_OATH_CONFIG;
  const sprites = window.PEACH_OATH_SPRITES;
  let sharedFrame;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const today = () => new Date().toISOString().slice(0, 10);
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const fmt = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : String(Math.floor(n));
  const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const itemArt = key => `<img class="item-art" src="/games/animal-peach-oath/assets/item-${key}.svg" alt="" aria-hidden="true">`;
  const resourceCopyKey = { coins: 'resourceCoins', ingots: 'resourceIngots', food: 'resourceFood', materials: 'resourceMaterials', xp: 'rewardXp', gear: 'equipmentBag' };
  const resourceChip = (key, amount) => `<span class="resource-chip">${itemArt(key)}<span>${copy(resourceCopyKey[key])} <b>${amount}</b></span></span>`;
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
      intro: "培養武將、調整隊伍，率領義軍自動迎戰並擊敗首領。", progress: "目前進度", start: "開始遊戲",
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
      intro: "Train heroes and choose your squad to win automatic battles and defeat bosses.", progress: "Current progress", start: "Start game",
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
  const heroIdentityCopy = {
    'zh-Hant':['玄德獅','雲長虎','翼德熊','孔明鶴','子龍狐','碎片','元寶'],
    'zh-Hans':['玄德狮','云长虎','翼德熊','孔明鹤','子龙狐','碎片','元宝'],
    en:['Lion Xuande','Tiger Yunchang','Bear Yide','Crane Kongming','Fox Zilong','fragments','Ingots'],
    ja:['玄徳ライオン','雲長トラ','翼徳クマ','孔明ツル','子龍キツネ','欠片','元宝'],
    ko:['현덕 사자','운장 호랑이','익덕 곰','공명 학','자룡 여우','조각','원보'],
    es:['León Xuande','Tigre Yunchang','Oso Yide','Grulla Kongming','Zorro Zilong','fragmentos','Lingotes'],
    'pt-BR':['Leão Xuande','Tigre Yunchang','Urso Yide','Grou Kongming','Raposa Zilong','fragmentos','Lingotes'],
    fr:['Lion Xuande','Tigre Yunchang','Ours Yide','Grue Kongming','Renard Zilong','fragments','Lingots'],
    de:['Löwe Xuande','Tiger Yunchang','Bär Yide','Kranich Kongming','Fuchs Zilong','Fragmente','Barren'],
    it:['Leone Xuande','Tigre Yunchang','Orso Yide','Gru Kongming','Volpe Zilong','frammenti','Lingotti'],
    ru:['Лев Сюаньдэ','Тигр Юньчан','Медведь Идэ','Журавль Кунмин','Лис Цзылун','фрагменты','Слитки'],
    hi:['सिंह शुआनदे','बाघ युनचांग','भालू यीदे','सारस कोंगमिंग','लोमड़ी ज़िलोंग','टुकड़े','सिल्लियाँ'],
    ar:['أسد شوانده','نمر يونتشانغ','دب ييده','كركي كونغمينغ','ثعلب زيلونغ','شظايا','سبائك']
  };
  const heroTraitKeys = ['傳說','史詩','稀有','步兵','騎兵','槍兵','謀士','弓兵','前排均衡','突進爆發','前排守護','群體法術','遠程連射'];
  const heroTraitCopy = {
    'zh-Hans':['传说','史诗','稀有','步兵','骑兵','枪兵','谋士','弓兵','前排均衡','突进爆发','前排守护','群体法术','远程连射'],
    ja:['伝説','エピック','レア','歩兵','騎兵','槍兵','軍師','弓兵','前衛万能型','突撃型','前衛守護型','範囲魔法','遠距離連射'],
    ko:['전설','영웅','희귀','보병','기병','창병','책사','궁병','균형 잡힌 전열','돌진 공격','전열 수호','광역 마법','원거리 연사'],
    es:['Legendario','Épico','Raro','Infantería','Caballería','Lanceros','Estratega','Arqueros','Primera línea equilibrada','Carga explosiva','Guardián de vanguardia','Magia de área','Ráfaga a distancia'],
    'pt-BR':['Lendário','Épico','Raro','Infantaria','Cavalaria','Lanceiros','Estrategista','Arqueiros','Frente equilibrada','Investida explosiva','Guardião da linha de frente','Magia de área','Rajada à distância'],
    fr:['Légendaire','Épique','Rare','Infanterie','Cavalerie','Lanciers','Stratège','Archers','Avant-garde équilibrée','Charge puissante','Gardien de première ligne','Magie de zone','Salve à distance'],
    de:['Legendär','Episch','Selten','Infanterie','Kavallerie','Speerkämpfer','Stratege','Bogenschützen','Ausgewogene Frontlinie','Sturmangriff','Frontwächter','Flächenmagie','Fernkampfsalve'],
    it:['Leggendario','Epico','Raro','Fanteria','Cavalleria','Lancieri','Stratega','Arcieri','Prima linea equilibrata','Carica esplosiva','Guardiano della prima linea','Magia ad area','Raffica a distanza'],
    ru:['Легендарный','Эпический','Редкий','Пехота','Кавалерия','Копейщики','Стратег','Лучники','Сбалансированный авангард','Мощный рывок','Защитник авангарда','Магия по площади','Дальний залп'],
    hi:['पौराणिक','महाकाव्य','दुर्लभ','पैदल सेना','घुड़सवार सेना','भालाधारी','रणनीतिकार','धनुर्धर','संतुलित अग्रिम पंक्ति','तेज़ धावा','अग्रिम पंक्ति का रक्षक','क्षेत्रीय जादू','दूर से लगातार वार']
  };
  for (const [locale, values] of Object.entries(heroTraitCopy)) localeNames[locale] = {...localeNames[locale], ...Object.fromEntries(heroTraitKeys.map((key,index)=>[key,values[index]]))};
  for (const [locale, values] of Object.entries(heroIdentityCopy)) {
    localeNames[locale] = {...localeNames[locale], ...Object.fromEntries(['玄德獅','雲長虎','翼德熊','孔明鶴','子龍狐'].map((name,index)=>[name,values[index]]))};
    localeCopy[locale] = {...(localeCopy[locale] || localeCopy.en), fragments:values[5], resourceIngots:values[6]};
  }
  const activeLocale = () => localeOrder.includes(routeLocale()) ? routeLocale() : "en";
  const copy = (key, values = {}) => {
    const table = localeCopy[activeLocale()] || localeCopy.en;
    const fallback = localeCopy["zh-Hant"];
    const value = table[key] ?? fallback[key] ?? key;
    return String(value).replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
  };
  const localizedValue = (value) => (localeNames[activeLocale()] || {})[value] || (localeExtraNames[activeLocale()] || {})[value] || value;
  // Game-specific consequences; the shared frame still owns chrome and skin.
  const interactionCopy = {
    'zh-Hant': ['暫停征戰？','目前戰役 {stage}、第 {wave} 波。返回主畫面會暫停本次戰鬥；重新整理頁面會從本波重開。已儲存的養成與資源會保留。','繼續遊玩','返回主畫面','攻速'],
    'zh-Hans': ['暂停征战？','当前战役 {stage}、第 {wave} 波。返回主画面会暂停本次战斗；刷新页面会从本波重开。已保存的养成与资源会保留。','继续游玩','返回主画面','攻速'],
    en: ['Pause this battle?','Campaign {stage}, wave {wave}. Returning to Main pauses this encounter; reloading starts this wave again. Saved upgrades and resources are kept.','Continue playing','Return to Main','Attack speed'],
    ja: ['戦闘を一時停止しますか？','戦役 {stage}、第 {wave} 波。メインに戻ると戦闘は一時停止します。ページを再読み込みするとこの波から再開します。保存済みの育成と資源は残ります。','プレイを続ける','メインに戻る','攻撃速度'],
    ko: ['전투를 일시 정지할까요?','전역 {stage}, {wave}번째 공세입니다. 메인으로 돌아가면 전투가 멈추며, 새로고침하면 이 공세를 다시 시작합니다. 저장된 성장과 자원은 유지됩니다.','계속 플레이','메인으로 돌아가기','공격 속도'],
    es: ['¿Pausar la batalla?','Campaña {stage}, oleada {wave}. Volver al inicio pausa el combate; recargar reinicia esta oleada. Las mejoras y los recursos guardados se conservan.','Seguir jugando','Volver al inicio','Velocidad de ataque'],
    'pt-BR': ['Pausar a batalha?','Campanha {stage}, onda {wave}. Voltar ao início pausa o combate; recarregar reinicia esta onda. Melhorias e recursos salvos são mantidos.','Continuar jogando','Voltar ao início','Velocidade de ataque'],
    fr: ['Mettre le combat en pause ?','Campagne {stage}, vague {wave}. Revenir à l’accueil met le combat en pause ; recharger recommence cette vague. Les améliorations et ressources sauvegardées sont conservées.','Continuer à jouer','Retour à l’accueil','Vitesse d’attaque'],
    de: ['Kampf pausieren?','Feldzug {stage}, Welle {wave}. Die Rückkehr zum Hauptmenü pausiert den Kampf; Neuladen startet diese Welle erneut. Gespeicherte Verbesserungen und Ressourcen bleiben erhalten.','Weiterspielen','Zum Hauptmenü','Angriffstempo'],
    it: ['Mettere in pausa la battaglia?','Campagna {stage}, ondata {wave}. Tornare al menu mette in pausa lo scontro; ricaricare riavvia questa ondata. Migliorie e risorse salvate restano.','Continua a giocare','Torna al menu','Velocità di attacco'],
    ru: ['Приостановить бой?','Кампания {stage}, волна {wave}. Возврат в меню приостановит бой; перезагрузка начнёт эту волну заново. Сохранённые улучшения и ресурсы останутся.','Продолжить игру','Вернуться в меню','Скорость атаки'],
    hi: ['युद्ध रोकें?','अभियान {stage}, लहर {wave}। मुख्य पृष्ठ पर लौटने से युद्ध रुकेगा; पृष्ठ फिर लोड करने पर यह लहर दोबारा शुरू होगी। सहेजे गए सुधार और संसाधन बने रहेंगे।','खेल जारी रखें','मुख्य पृष्ठ पर लौटें','हमले की गति'],
    ar: ['إيقاف المعركة مؤقتًا؟','الحملة {stage}، الموجة {wave}. العودة للرئيسية توقف القتال مؤقتًا؛ إعادة تحميل الصفحة تبدأ هذه الموجة من جديد. تبقى الترقيات والموارد المحفوظة.','متابعة اللعب','العودة للرئيسية','سرعة الهجوم']
  };
  const interactionText = index => (interactionCopy[activeLocale()] || interactionCopy.en)[index];
  function equipmentStat(def, level) {
    const value = def.value * level;
    const label = def.stat === 'speed' ? interactionText(4) : copy(def.stat === 'hp' ? 'health' : 'attack');
    // Speed is an additive stat, not an integer count or a percentage.
    const number = new Intl.NumberFormat(activeLocale(), {maximumFractionDigits: 2}).format(value);
    return `${label} +${number}`;
  }
  function applyLocale() {
    const locale = activeLocale();
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.dir = locale === "ar" ? "rtl" : "ltr";
    const text = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };
    const attr = (selector, name, value) => { const node = $(selector); if (node) node.setAttribute(name, value); };
    // The generated route already contains the catalog's localized game name.
    // Keep that identity instead of restoring an older title from runtime copy.
    text(".main-copy .eyebrow", copy("eyebrow")); text(".main-copy p", copy("intro"));
    text(".main-progress span", copy("progress")); text("#startBtn", copy("start")); text(".guide h2", $("#mainTitle").textContent); text(".guide p", copy("guideText"));
    // "back" is also the formation's back-row label; preserve the route's
    // already localized lobby-return label instead of replacing it with that.
    attr(".shared-header .utility", "aria-label", copy("settings")); attr(".battle-settings", "aria-label", copy("settings"));
    attr("#battleScene", "aria-label", copy("battleAria")); attr("#battleBack", "aria-label", copy("backMain")); attr(".quick-rail", "aria-label", copy("quick")); attr(".arena-wrap", "aria-label", copy("arena"));
    ["missions", "achievements", "events", "codex", "shop", "settings"].forEach((key, index) => { const button = $(".quick-rail button:nth-child(" + (index + 1) + ")"); if (button) { const label = key === "settings" ? copy("settings") : copy(key); text(`.quick-rail button:nth-child(${index + 1}) span`, label); button.setAttribute("aria-label", label); } });
    text("#autoBtn", copy("auto")); attr("#lootPile", "aria-label", copy("collectLoot")); attr(".resource-bar", "aria-label", copy("resources")); attr(".bottom-nav", "aria-label", copy("mainFunctions"));
    ["battle", "heroes", "tavern", "law", "campaign"].forEach((key, index) => text(`.bottom-nav button:nth-child(${index + 1}) b`, copy(key)));
    attr("#closeManagement", "aria-label", copy("close")); attr("#modalClose", "aria-label", copy("close"));
    ['coins', 'ingots', 'food', 'materials'].forEach((key, index) => {
      const node = $('.resource-bar').children[index];
      const value = node.querySelector('strong');
      node.innerHTML = `${itemArt(key)}<span class="resource-label">${copy(resourceCopyKey[key])}</span>`;
      node.append(value);
    });
    // Campaign planning belongs to Missions, never over the live arena.
    $('#campaignGoal')?.remove();
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

  // Preserve old single-item saves while giving every hero one slot per type.
  const usedEquipment = new Set();
  state.equipped = Object.fromEntries(C.heroes.map(hero => {
    const previous = state.equipped?.[hero.id];
    const slots = {};
    for (const itemUid of typeof previous === 'string' ? [previous] : Object.values(previous || {})) {
      const entry = state.inventory.find(item => item.uid === itemUid);
      const def = entry && equipmentData(entry.itemId);
      if (def && state.heroes[hero.id].owned && !usedEquipment.has(itemUid) && !slots[def.id]) {
        slots[def.id] = itemUid;
        usedEquipment.add(itemUid);
      }
    }
    return [hero.id, slots];
  }));
  let selectedHero = state.team[0] || C.heroes[0].id;
  let selectedSlot = C.equipment[0].id;
  const equipmentHolder = itemUid => C.heroes.find(hero => Object.values(state.equipped[hero.id] || {}).includes(itemUid))?.id;
  function removeEquipment(itemUid) {
    Object.values(state.equipped).forEach(slots => {
      Object.keys(slots).forEach(slot => { if (slots[slot] === itemUid) delete slots[slot]; });
    });
  }

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
    nextWaveHandle: 0,
    nextWaveDue: 0,
    pausedAt: 0,
    pendingWaveMs: null,
    resultOpen: false,
    manageFromResult: false
  };

  let resettingProgress = false;
  function save() {
    if (resettingProgress) return;
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
    for (const equipped of Object.values(state.equipped[id] || {})) {
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
    // Localized routes emit the shared static guide instead of the source stub.
    document.querySelectorAll(".game-page-info").forEach(guide => {
      guide.classList.toggle("is-hidden", !main);
      guide.hidden = !main;
    });
    $("#battleScene").classList.toggle("is-hidden", main);
    $("#app").dataset.scene = name;
    sharedFrame?.activate(name);
    document.documentElement.classList.toggle("battle-active", !main);
    document.body.classList.toggle("battle-active", !main);
    if (!main) {
      updateHud();
      resumeCombat();
      if (!battle.running && !battle.resultOpen && !battle.nextWaveHandle) startWave();
      else if (battle.running && !battle.resultOpen && !battle.tickHandle) battle.tickHandle = window.setInterval(battleTick, 260);
      if (!state.tutorialDone) showCoach();
    } else {
      suspendCombat();
      closeManagement();
      closeModal();
    }
    syncFrameCoverage();
  }

  function suspendCombat() {
    if (battle.pausedAt) return;
    battle.pausedAt = Date.now();
    battle.pendingWaveMs = battle.nextWaveHandle ? Math.max(0, battle.nextWaveDue - performance.now()) : null;
    clearInterval(battle.tickHandle); battle.tickHandle = 0;
    clearTimeout(battle.nextWaveHandle); battle.nextWaveHandle = 0;
  }

  function resumeCombat() {
    if (!battle.pausedAt) return;
    const pausedAt = battle.pausedAt, elapsed = Date.now() - pausedAt;
    for (const unit of [...battle.heroes, ...battle.enemies]) {
      for (const field of ['weakenUntil', 'shieldUntil', 'buffUntil']) {
        if (unit.status[field] > pausedAt) unit.status[field] += elapsed;
      }
    }
    battle.pausedAt = 0;
    if (battle.pendingWaveMs !== null) {
      const remaining = battle.pendingWaveMs; battle.pendingWaveMs = null;
      scheduleNextWave(remaining);
    } else if (battle.running && !battle.resultOpen && !battle.tickHandle) {
      battle.tickHandle = window.setInterval(battleTick, 260);
    }
  }

  function scheduleNextWave(delay) {
    clearTimeout(battle.nextWaveHandle);
    battle.nextWaveDue = performance.now() + delay;
    battle.nextWaveHandle = setTimeout(() => {
      battle.nextWaveHandle = 0;
      if (!battle.resultOpen && !battle.pausedAt && $('#app').dataset.scene === 'battle') startWave();
    }, delay);
  }

  function requestBattleReturn() {
    if (!battle.running && !battle.nextWaveHandle && battle.pendingWaveMs === null) return showScene('main');
    suspendCombat();
    $('#leaveTitle').textContent = interactionText(0);
    $('#leaveCopy').textContent = interactionText(1).replace('{stage}', stageCode()).replace('{wave}', state.wave);
    $('#leaveContinue').textContent = interactionText(2);
    $('#leaveMain').textContent = interactionText(3);
    $('#leaveConfirm').classList.remove('is-hidden');
    syncFrameCoverage();
    $('#leaveContinue').focus({preventScroll: true});
  }

  function closeBattleReturn(leave = false) {
    $('#leaveConfirm').classList.add('is-hidden');
    if (leave) { save(); showScene('main'); $('#startBtn').focus({preventScroll: true}); }
    else { syncFrameCoverage(); resumeCombat(); $('#battleBack').focus({preventScroll: true}); }
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
    clearTimeout(battle.nextWaveHandle);
    battle.nextWaveHandle = 0;
    battle.nextWaveDue = 0;
    battle.pendingWaveMs = null;
    clearInterval(battle.tickHandle);
    battle.resultOpen = false;
    battle.running = true;
    battle.heroes = state.team.filter((id) => state.heroes[id]?.owned).map((id, i) => makeUnit(heroData(id), "hero", i));
    battle.enemies = enemyPack();
    $("#resultPanel").classList.add("is-hidden");
    syncFrameCoverage();
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
    if ($("#app").dataset.scene !== "battle" || document.hidden || battle.pausedAt || !battle.running || !battle.auto || battle.resultOpen || !$("#management").classList.contains("is-hidden") || !$("#modalLayer").classList.contains("is-hidden")) return;
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
      scheduleNextWave(900 / battle.speed);
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
    syncFrameCoverage();
    $("#resultKicker").textContent = win ? copy("victoryKicker", { chapter: localizedValue(C.chapters[chapterIndex()]), stage: stageCode() }) : copy("defeatKicker");
    $("#resultTitle").textContent = win ? copy("victoryTitle") : copy("defeatTitle");
    $("#resultCopy").textContent = win ? copy("victoryCopy") : copy("defeatCopy");
    $("#resultRewards").innerHTML = win ? resourceChip('xp', `+${35 + state.stage * 6}`) + resourceChip('materials', `+${reward.materials || 3}`) : "";
    renderCampaignMilestone(win);
    // Outcomes change availability, never the three permanent action tracks.
    $("#resultNext").disabled = !win;
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
    syncFrameCoverage();
    $$(".bottom-nav button").forEach((button) => button.classList.toggle("is-active", button.dataset.tab === tab));
    const titles = { heroes: copy("managementHeroes"), tavern: recruitText(2), law: copy("managementLaw"), campaign: copy("managementCampaign") };
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
    syncFrameCoverage();
  }

  const loadoutCopy = {
    'zh-Hant': ['空欄位','使用中','背包內','卸下','轉交','先選武將，再選裝備欄。同一件裝備只能由一人持有；換下的裝備會留在背包。','選擇武將','尚未解鎖', 'Boss 與裝備戰役會掉落這類裝備。'],
    'zh-Hans': ['空栏位','使用中','背包内','卸下','转交','先选武将，再选装备栏。同一件装备只能由一人持有；换下的装备会留在背包。','选择武将','尚未解锁', 'Boss 与装备战役会掉落这类装备。'],
    en: ['Empty slot','Equipped','In bag','Unequip','Transfer','Choose a hero, then a slot. Each item has one owner; replaced gear stays in your bag.','Choose a hero','Locked', 'Bosses and equipment campaigns drop this type of gear.'],
    ja: ['空きスロット','装備中','バッグ内','外す','渡す','武将と装備枠を選択。一つの装備は一人が使用します。外した装備はバッグに残ります。','武将を選択','未解放', 'ボスや装備戦役からこの種類の装備を入手できます。'],
    ko: ['빈 슬롯','장착 중','가방 안','해제','이전','무장과 장비 칸을 선택하세요. 장비 하나는 한 명만 사용하며 교체한 장비는 가방에 남습니다.','무장 선택','미해금', '보스와 장비 전역에서 이 종류의 장비를 얻을 수 있습니다.'],
    es: ['Espacio vacío','Equipado','En la bolsa','Quitar','Transferir','Elige un héroe y una ranura. Cada objeto tiene un dueño; el equipo reemplazado queda en la bolsa.','Elegir héroe','Bloqueado', 'Los jefes y las campañas de equipo dan este tipo de objeto.'],
    'pt-BR': ['Espaço vazio','Equipado','Na bolsa','Remover','Transferir','Escolha um herói e um espaço. Cada item tem um dono; o equipamento trocado fica na bolsa.','Escolher herói','Bloqueado', 'Chefes e campanhas de equipamento concedem itens deste tipo.'],
    fr: ['Emplacement vide','Équipé','Dans le sac','Retirer','Transférer','Choisissez un héros puis un emplacement. Chaque objet a un porteur ; les objets remplacés restent dans le sac.','Choisir un héros','Verrouillé', 'Les boss et les campagnes d’équipement donnent ce type d’objet.'],
    de: ['Leerer Platz','Ausgerüstet','Im Beutel','Ablegen','Übertragen','Wähle Held und Platz. Jeder Gegenstand hat einen Träger; ersetzte Ausrüstung bleibt im Beutel.','Held wählen','Gesperrt', 'Bosse und Ausrüstungsfeldzüge liefern Gegenstände dieses Typs.'],
    it: ['Spazio vuoto','Equipaggiato','Nella borsa','Rimuovi','Trasferisci','Scegli un eroe e uno spazio. Ogni oggetto ha un solo portatore; gli oggetti sostituiti restano nella borsa.','Scegli un eroe','Bloccato', 'Boss e campagne di equipaggiamento forniscono oggetti di questo tipo.'],
    ru: ['Пустая ячейка','Надето','В сумке','Снять','Передать','Выберите героя и ячейку. У предмета один владелец; заменённое снаряжение остаётся в сумке.','Выбрать героя','Закрыто', 'Боссы и походы за снаряжением дают предметы этого типа.'],
    hi: ['खाली स्थान','सुसज्जित','बैग में','उतारें','सौंपें','नायक और स्थान चुनें। हर वस्तु का एक धारक है; बदले गए उपकरण बैग में रहते हैं।','नायक चुनें','लॉक है', 'बॉस और उपकरण अभियानों से इस प्रकार के उपकरण मिलते हैं।'],
    ar: ['خانة فارغة','مجهز','في الحقيبة','نزع','نقل','اختر بطلاً ثم خانة. لكل قطعة حامل واحد؛ تبقى المعدات المستبدلة في الحقيبة.','اختر بطلاً','مقفل', 'يسقط الزعماء وحملات المعدات تجهيزات من هذا النوع.']
  };
  const loadoutText = index => (loadoutCopy[activeLocale()] || loadoutCopy.en)[index];
  const gearArt = def => `<span class="equipment-art" data-equipment-art="${def.id}" aria-hidden="true"></span>`;
  function renderHeroes() {
    const focused = document.activeElement?.closest('#managementBody button')?.dataset;
    const hero = heroData(selectedHero), p = state.heroes[selectedHero];
    const stats = heroStats(selectedHero), cost = heroUpgradeCost(selectedHero);
    const breakCost = 8 + (p.rank || 0) * 6;
    const canBreak = p.level >= ((p.rank || 0) + 1) * 5 && state.resources.materials >= breakCost;
    const roster = C.heroes.map(h => {
      const progress = state.heroes[h.id];
      return `<button class="roster-choice" data-action="select-hero" data-id="${h.id}" aria-pressed="${h.id === selectedHero}"><span class="roster-portrait">${sprites.markup('hero', h.id, `roster-${h.id}`)}</span><strong>${localizedValue(h.name)}</strong><small>${progress.owned ? `${copy('level')}${progress.level} · ${state.team.includes(h.id) ? `${copy('deploy')} · ${copy(state.team.indexOf(h.id) < 2 ? 'front' : 'back')}` : copy('remove')}` : loadoutText(7)}</small></button>`;
    }).join('');
    const slots = C.equipment.map(def => {
      const entry = state.inventory.find(item => item.uid === state.equipped[selectedHero]?.[def.id]);
      return `<button class="loadout-slot" data-action="select-slot" data-id="${def.id}" aria-pressed="${selectedSlot === def.id}">${gearArt(def)}<strong>${localizedValue(def.slot)}</strong><small>${entry ? `${localizedValue(def.name)} +${entry.level}` : loadoutText(0)}</small></button>`;
    }).join('');
    const entries = state.inventory.filter(entry => entry.itemId === selectedSlot);
    const equipment = entries.map(entry => {
      const def = equipmentData(entry.itemId), holder = equipmentHolder(entry.uid);
      const enhanceCost = 3 + entry.level * 2;
      return `<article class="equipment-row"><div class="equipment-description">${gearArt(def)}<div><strong>${localizedValue(def.name)} +${entry.level}</strong><small>${localizedValue(def.quality)} · ${equipmentStat(def, entry.level)}</small><span class="holder-label">${holder ? `${loadoutText(1)} · ${localizedValue(heroData(holder).name)}` : loadoutText(2)}</span></div></div><div class="card-actions"><button data-wp-frame-action="secondary" data-action="${holder === selectedHero ? 'unequip' : 'equip'}" data-id="${selectedHero}" data-uid="${entry.uid}" ${p.owned ? '' : 'disabled'}>${holder === selectedHero ? loadoutText(3) : `${holder ? loadoutText(4) : copy('equip')} → ${localizedValue(hero.name)}`}</button><button data-wp-frame-action="secondary" data-action="upgrade-equipment" data-uid="${entry.uid}" ${state.resources.materials < enhanceCost ? 'disabled' : ''}>${copy('enhance')} ${resourceChip('materials', enhanceCost)}</button><button data-wp-frame-action="secondary" class="alt" data-action="salvage" data-uid="${entry.uid}" ${holder ? 'disabled' : ''}>${copy('salvage')} ${resourceChip('materials', '+5')}</button></div></article>`;
    }).join('');
    $('#managementBody').innerHTML = `<section class="hero-workspace"><div class="section-title"><h3>${loadoutText(6)}</h3><span>${state.team.length}/3 · ${copy('deploy')}</span></div><div class="hero-roster">${roster}</div><div class="hero-workspace-columns"><section><article class="hero-card hero-detail" data-hero="${hero.id}"><div class="hero-portrait">${sprites.markup('hero', hero.id, `detail-${hero.id}`)}</div><div class="hero-card-copy"><span class="quality">${localizedValue(hero.quality)} · ${localizedValue(hero.troop)}</span><h3>${localizedValue(hero.name)}</h3><p>${localizedValue(hero.role)} · ${localizedValue(hero.skill)}</p><div class="mini-stats"><span>${copy('level')}${p.level}</span><span>${p.star} ${copy('stars')}</span><span>${copy('rank')} +${p.rank || 0}</span><span>${copy('attack')} ${stats.atk}</span><span>${copy('health')} ${stats.hp}</span><span>${interactionText(4)} ${stats.speed.toFixed(2)}</span></div></div></article>
    ${p.owned ? `<div class="hero-growth-actions card-actions"><button data-wp-frame-action="secondary" data-action="upgrade-hero" data-id="${hero.id}" ${state.resources.coins < cost || p.level >= C.heroLevelCap ? 'disabled' : ''}>${copy('upgrade')} ${resourceChip('coins', cost)}</button><button data-wp-frame-action="secondary" data-action="break-hero" data-id="${hero.id}" ${canBreak ? '' : 'disabled'}>${copy('break')} ${resourceChip('materials', breakCost)}</button><button data-wp-frame-action="secondary" data-action="toggle-team" data-id="${hero.id}">${state.team.includes(hero.id) ? copy('remove') : copy('deploy')}</button></div>` : `<p>${loadoutText(7)} · ${itemArt('fragments')}${copy('fragments')} ${p.fragments}/10</p>`}
    <div class="section-title"><h3>${copy('equip')} · ${localizedValue(hero.name)}</h3></div><div class="loadout-slots">${slots}</div></section><section class="hero-backpack"><div class="section-title"><h3>${copy('equipmentBag')} · ${localizedValue(equipmentData(selectedSlot).slot)}</h3><span>${entries.length} ${copy('inventory')}</span></div><p class="loadout-help">${loadoutText(5)}</p><div class="wallet">${Object.entries(state.resources).map(([key, amount]) => resourceChip(key, fmt(amount))).join('')}</div>${equipment || `<div class="empty-equipment">${gearArt(equipmentData(selectedSlot))}<p>${loadoutText(0)}</p><p>${loadoutText(8)}</p></div>`}</section></div></section>`;
    if (focused) {
      const buttons = $$('#managementBody button[data-action]');
      const same = buttons.find(button => button.dataset.action === focused.action && button.dataset.id === focused.id && button.dataset.uid === focused.uid);
      const replacement = same || buttons.find(button => focused.uid && button.dataset.uid === focused.uid);
      replacement?.focus({preventScroll: true});
    }
  }

  const recruitCopy = {
    'zh-Hant':['收集 10 片解鎖武將；已擁有武將每 20 片升一星，最高五星。','免費招募','招募','武將名冊','已獲得','招募結果','{hero} 加入隊伍','{hero} 升至 {stars} 星'],
    'zh-Hans':['收集 10 片解锁武将；已有武将每 20 片升一星，最高五星。','免费招募','招募','武将名册','已获得','招募结果','{hero} 加入队伍','{hero} 升至 {stars} 星'],
    en:['Collect 10 fragments to unlock a hero. Owned heroes gain a star per 20 fragments, up to five stars.','Free recruit','Recruit','Hero roster','Owned','Recruitment results','{hero} joined the team','{hero} reached {stars} stars'],
    ja:['欠片10個で武将を解放。解放済みの武将は20個ごとに星が1つ増え、最大5つになります。','無料募集','募集','武将一覧','解放済み','募集結果','{hero}が仲間になりました','{hero}が星{stars}になりました'],
    ko:['조각 10개로 장수를 해제합니다. 보유 장수는 조각 20개마다 별이 하나 오르며 최대 5성입니다.','무료 모집','모집','장수 명단','보유','모집 결과','{hero} 합류','{hero}: {stars}성 달성'],
    es:['Reúne 10 fragmentos para desbloquear un héroe. Después, cada 20 fragmentos añaden una estrella, hasta cinco.','Reclutamiento gratis','Reclutar','Lista de héroes','Obtenido','Resultados','{hero} se ha unido','{hero} alcanzó {stars} estrellas'],
    'pt-BR':['Junte 10 fragmentos para desbloquear um herói. Depois, cada 20 fragmentos dão uma estrela, até cinco.','Recrutamento grátis','Recrutar','Lista de heróis','Obtido','Resultados','{hero} entrou na equipe','{hero} chegou a {stars} estrelas'],
    fr:['Réunissez 10 fragments pour débloquer un héros. Ensuite, 20 fragments ajoutent une étoile, jusqu’à cinq.','Recrutement gratuit','Recruter','Liste des héros','Obtenu','Résultats','{hero} rejoint l’équipe','{hero} atteint {stars} étoiles'],
    de:['10 Fragmente schalten einen Helden frei. Danach geben je 20 Fragmente einen Stern, bis zu fünf Sterne.','Kostenlos rekrutieren','Rekrutieren','Heldenliste','Freigeschaltet','Ergebnisse','{hero} ist dem Team beigetreten','{hero} erreicht {stars} Sterne'],
    it:['Raccogli 10 frammenti per sbloccare un eroe. Poi ogni 20 frammenti aggiungono una stella, fino a cinque.','Reclutamento gratis','Recluta','Elenco eroi','Ottenuto','Risultati','{hero} si è unito alla squadra','{hero} ha raggiunto {stars} stelle'],
    ru:['10 фрагментов открывают героя. Затем каждые 20 фрагментов дают звезду, максимум пять.','Бесплатный призыв','Призвать','Список героев','Получен','Результаты призыва','{hero} присоединился к отряду','{hero}: достигнуто {stars} звёзд'],
    hi:['10 टुकड़ों से नायक अनलॉक करें। फिर हर 20 टुकड़ों पर एक सितारा मिलता है, अधिकतम पाँच।','मुफ़्त भर्ती','भर्ती','नायकों की सूची','प्राप्त','भर्ती के परिणाम','{hero} दल में शामिल हुआ','{hero} ने {stars} सितारे पाए'],
    ar:['اجمع 10 شظايا لفتح بطل. بعد ذلك تمنح كل 20 شظية نجمة إضافية، حتى خمس نجوم.','تجنيد مجاني','تجنيد','قائمة الأبطال','تم الحصول عليه','نتائج التجنيد','انضم {hero} إلى الفريق','وصل {hero} إلى {stars} نجوم']
  };
  const recruitText = (index, values={}) => (recruitCopy[activeLocale()]||recruitCopy.en)[index].replace(/\{(\w+)\}/g,(match,key)=>values[key]??match);
  function renderTavern() {
    const owned = C.heroes.filter((hero) => state.heroes[hero.id].owned).length;
    $('#managementBody').innerHTML = `<section class="summon-stage" data-runtime-localize="off"><p>${recruitText(0)}</p><div class="summon-buttons"><button data-wp-frame-action="secondary" data-action="summon" data-count="1">${state.daily.freeSummon ? recruitText(1) : `${recruitText(2)} ×1 · ${resourceChip('ingots', 60)}`}</button><button data-wp-frame-action="secondary" data-action="summon" data-count="5">${recruitText(2)} ×5 · 2${resourceChip('ingots', 60)}</button></div></section>
      <div class="section-title"><h3>${recruitText(3)}</h3><span>${owned} / ${C.heroes.length}</span></div><div class="card-grid">${C.heroes.map((hero) => {
        const p = state.heroes[hero.id], progress = p.owned ? 10 : Math.min(10, p.fragments);
        return `<article class="panel-card tavern-hero-card" data-tavern-hero="${hero.id}"><div class="tavern-portrait">${sprites.markup('hero', hero.id, `tavern-${hero.id}`)}</div><div class="tavern-hero-copy"><span class="quality">${localizedValue(hero.quality)} · ${localizedValue(hero.troop)}</span><h3>${localizedValue(hero.name)}</h3><p>${localizedValue(hero.role)}</p><div class="progress" role="progressbar" aria-label="${localizedValue(hero.name)} · ${copy('fragments')}" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${progress}"><b style="width:${progress * 10}%"></b></div><small>${itemArt('fragments')}${p.owned ? `${recruitText(4)} · ${p.fragments} ${copy('fragments')}` : `${p.fragments} / 10 ${copy('fragments')}`}</small></div></article>`;
      }).join("")}</div>`;
  }

  function renderLaw() {
    const laws = [
      { id: "valor", seal: "武", title: "勇武軍令", copy: "全隊攻擊提升 4.5%" },
      { id: "bulwark", seal: "守", title: "堅陣軍令", copy: "全隊生命提升 5.5%" },
      { id: "tactics", seal: "策", title: "疾行軍令", copy: "全隊攻速提升 2.2%" }
    ];
    $("#managementBody").innerHTML = `<div class="section-title"><h3>全隊永久強化</h3><span>${resourceChip('materials', state.resources.materials)}</span></div><div class="law-tree">${laws.map((law) => { const level = state.law[law.id]; const cost = 6 + level * 5; return `<article class="law-node"><span class="seal">${law.seal}</span><div><h3>${law.title} · ${level} 級</h3><p>${law.copy} · ${resourceChip('materials', cost)}</p></div><button data-wp-frame-action="secondary" data-action="law" data-id="${law.id}" ${state.resources.materials < cost ? "disabled" : ""}>研習</button></article>`; }).join("")}</div>`;
  }

  function renderCampaign() {
    const campaigns = [
      { id: "coins", title: "銅雀金庫", copy: "迎戰守庫軍，取得大量銅錢。", reward: { coins: 2200 + state.stage * 80 } },
      { id: "xp", title: "群英試煉", copy: "與名將切磋，取得主公經驗。", reward: { xp: 90 + state.stage * 4 } },
      { id: "gear", title: "兵甲秘庫", copy: "打開古代軍械庫，必得一件裝備。", reward: { gear: 1 } },
      { id: "materials", title: "軍法演武", copy: "完成兵種操演，取得軍法材料。", reward: { materials: 14 + Math.floor(state.stage / 2) } },
      { id: "daily-boss", title: "每日 Boss · 黑角試煉", copy: "每日挑戰強敵一次，取得元寶與必得裝備。", reward: { ingots: 25, gear: 1 }, limit: 1 }
    ];
    $("#managementBody").innerHTML = `<div class="section-title"><h3>每日戰役</h3><span>資源副本與特殊 Boss</span></div><div class="campaign-grid">${campaigns.map((c) => { const used = state.daily.campaign[c.id] || 0; const limit = c.limit || 2; return `<article class="campaign-card"><span class="quality">剩餘 ${limit - used} / ${limit}</span><h3>${c.title}</h3><p>${c.copy}</p><div class="wallet">${Object.entries(c.reward).map(([key, amount]) => resourceChip(key, amount)).join('')}</div><button data-wp-frame-action="secondary" data-action="campaign" data-id="${c.id}" ${used >= limit ? "disabled" : ""}>立即挑戰</button></article>`; }).join("")}</div>`;
  }

  function managementAction(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const { action, id, uid: itemUid } = button.dataset;
    if (action === 'select-hero') {
      selectedHero = id;
      renderHeroes();
      return;
    }
    if (action === 'select-slot') {
      selectedSlot = id;
      renderHeroes();
      return;
    }
    if (action === 'unequip') {
      if (equipmentHolder(itemUid) !== id) return;
      removeEquipment(itemUid);
      renderHeroes();
    }
    if (action === "upgrade-hero") {
      if (!state.heroes[id]?.owned || state.heroes[id].level >= C.heroLevelCap) return;
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
      const target = id;
      const item = state.inventory.find(entry => entry.uid === itemUid);
      if (!item || !state.heroes[target]?.owned) return;
      removeEquipment(itemUid);
      state.equipped[target][item.itemId] = itemUid;
      toast(`${localizedValue(equipmentData(item.itemId).name)} · ${copy("equip")} · ${localizedValue(heroData(target).name)}`);
      renderHeroes();
    }
    if (action === "salvage") {
      const index = state.inventory.findIndex((entry) => entry.uid === itemUid);
      if (index < 0 || equipmentHolder(itemUid)) return;
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
    if (state.resources.ingots < cost) return toast(shopText(8));
    state.resources.ingots -= cost;
    if (count === 1) state.daily.freeSummon = false;
    const results = [];
    for (let i = 0; i < count; i += 1) {
      const hero = C.heroes[Math.floor(Math.random() * C.heroes.length)];
      const amount = Math.random() < .16 ? 5 : 2;
      const p = state.heroes[hero.id];
      p.fragments += amount;
      if (!p.owned && p.fragments >= 10) { p.owned = true; p.fragments -= 10; results.push(recruitText(6,{hero:localizedValue(hero.name)})); }
      else if (p.owned && p.fragments >= 20 && p.star < 5) { p.fragments -= 20; p.star += 1; results.push(recruitText(7,{hero:localizedValue(hero.name),stars:p.star})); }
      else results.push(`${localizedValue(hero.name)} · ${copy('fragments')} ×${amount}`);
    }
    state.stats.summons += count;
    openModal(recruitText(5), `<div class="list" data-runtime-localize="off">${results.map((r) => `<div class="list-item"><p>${r}</p></div>`).join("")}</div>`, () => {
      openManagement('tavern');
      $('#managementBody [data-action="summon"]').focus({preventScroll:true});
    });
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

  let modalReturnFocus = null;
  let modalOwnsPause = false;
  let modalOnClose = null;
  function openModal(title, html, onClose = null) {
    const layer = $('#modalLayer');
    const fresh = layer.classList.contains('is-hidden');
    if (fresh) modalReturnFocus = document.activeElement;
    if (fresh || onClose) modalOnClose = onClose;
    closeManagement();
    const inBattle = $('#app').dataset.scene === 'battle';
    (inBattle ? $('#battleScene') : $('#app')).append(layer);
    if (inBattle && !battle.pausedAt) { suspendCombat(); modalOwnsPause = true; }
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = html;
    layer.classList.remove('is-hidden');
    syncFrameCoverage();
    $('#modalClose').focus({preventScroll: true});
  }

  function closeModal() {
    if ($('#modalLayer').classList.contains('is-hidden')) return;
    $('#modalLayer').classList.add('is-hidden');
    syncFrameCoverage();
    if (modalOwnsPause && $('#app').dataset.scene === 'battle' && !battle.resultOpen && $('#leaveConfirm').classList.contains('is-hidden')) resumeCombat();
    modalOwnsPause = false;
    if (modalReturnFocus?.isConnected && !modalReturnFocus.closest('[inert],.is-hidden')) modalReturnFocus.focus({preventScroll: true});
    modalReturnFocus = null;
    const afterClose = modalOnClose; modalOnClose = null;
    if (afterClose && $('#app').dataset.scene === 'battle') afterClose();
  }

  function objectiveModal(entries, kind) {
    openModal(kind === "mission" ? "任務" : "成就", `<p class="mission-goal">${copy("longGoal", {text: campaignMilestoneText()})}</p><div class="list">${entries.map((entry) => {
      const value = progressFor(entry);
      const ready = value >= entry.target;
      const claimed = state.claimed[entry.id];
      const reward = Object.entries(entry.reward).map(([key, amount]) => resourceChip(key, amount)).join("、");
      return `<div class="list-item"><div><p>${entry.label}</p><small>${Math.min(value, entry.target)} / ${entry.target} · ${reward}</small><div class="progress"><b style="width:${clamp(value / entry.target * 100,0,100)}%"></b></div></div><button data-wp-frame-action="secondary" data-claim="${entry.id}" data-kind="${kind}" ${!ready || claimed ? "disabled" : ""}>${claimed ? "已領取" : "領取"}</button></div>`;
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
    openModal("登入與七日活動", `<div class="list"><div class="list-item"><div><p>第 ${day} 日登入獎勵</p><small>${resourceChip('ingots', 20 + day * 10)} ${resourceChip('food', 5 + day)}</small></div><button data-event="login" ${state.daily.loginClaimed ? "disabled" : ""}>${state.daily.loginClaimed ? "已領取" : "領取"}</button></div>
      <div class="list-item"><div><p>新手成長：通過第 5 關</p><small>完成後獲得稀有裝備箱</small><div class="progress"><b style="width:${clamp(state.stage / 5 * 100,0,100)}%"></b></div></div><button disabled>${state.stage >= 5 ? "待開放" : `${state.stage}/5`}</button></div>
      <div class="list-item"><div><p>限時活動：桃花軍備</p><small>完成 3 次武將升級 ${resourceChip('ingots', 30)}</small><div class="progress"><b style="width:${clamp(state.stats.upgrades / 3 * 100,0,100)}%"></b></div></div><button data-event="upgrade" ${state.stats.upgrades < 3 || state.claimed["event-upgrades"] ? "disabled" : ""}>${state.claimed["event-upgrades"] ? "已領取" : "領取"}</button></div></div>`);
  }

  function renderCodex() {
    const owned = C.heroes.filter((hero) => state.heroes[hero.id].owned).length;
    const seenEnemies = clamp(1 + Math.floor(state.stage / 2), 1, C.enemies.length);
    openModal("圖鑑", `<div class="card-grid"><article class="panel-card"><span class="quality">武將圖鑑</span><h3>${owned} / ${C.heroes.length}</h3><p>收集武將，查看品質、兵種與技能。</p></article><article class="panel-card"><span class="quality">敵軍圖鑑</span><h3>${seenEnemies} / ${C.enemies.length}</h3><p>推進關卡會揭露新兵種與 Boss。</p></article><article class="panel-card"><span class="quality">裝備圖鑑</span><h3>${new Set(state.inventory.map((item) => item.itemId)).size} / ${C.equipment.length}</h3><p>Boss、戰役與商店會掉落不同品質裝備。</p></article></div>`);
  }

  // Authored shop copy, including result feedback; never rely on a runtime
  // translator to guess text added after opening or purchasing an item.
  const shopCopy = {
    'zh-Hant': ['快速收益 · 10 分鐘','依目前關卡取得銅錢與材料','免費','已領取','軍糧補給','材料木箱','精良裝備箱','隨機取得一件裝備','元寶不足','購買成功'],
    'zh-Hans': ['快速收益 · 10 分钟','按当前关卡获得铜钱与材料','免费','已领取','军粮补给','材料木箱','精良装备箱','随机获得一件装备','元宝不足','购买成功'],
    en: ['Quick rewards · 10 minutes','Coins and materials based on your current stage','Free','Claimed','Ration supplies','Material crate','Equipment chest','Receive one random piece of equipment','Not enough ingots','Purchase complete'],
    ja: ['即時報酬・10分','現在のステージに応じた銅銭と素材','無料','受取済み','兵糧補給','素材箱','装備箱','ランダムな装備を1個獲得','元宝が足りません','購入しました'],
    ko: ['즉시 보상 · 10분','현재 스테이지에 따른 동전과 재료','무료','수령 완료','군량 보급','재료 상자','장비 상자','무작위 장비 1개 획득','원보가 부족합니다','구매 완료'],
    es: ['Recompensas rápidas · 10 minutos','Monedas y materiales según la etapa actual','Gratis','Recogido','Suministros de víveres','Caja de materiales','Cofre de equipo','Recibe una pieza de equipo aleatoria','No hay suficientes lingotes','Compra completada'],
    'pt-BR': ['Recompensas rápidas · 10 minutos','Moedas e materiais conforme a fase atual','Grátis','Resgatado','Suprimentos de provisões','Caixa de materiais','Baú de equipamento','Receba um equipamento aleatório','Lingotes insuficientes','Compra concluída'],
    fr: ['Récompenses rapides · 10 minutes','Pièces et matériaux selon le niveau actuel','Gratuit','Récupéré','Réserve de vivres','Caisse de matériaux','Coffre d’équipement','Recevez une pièce d’équipement aléatoire','Lingots insuffisants','Achat effectué'],
    de: ['Schnelle Belohnung · 10 Minuten','Münzen und Materialien passend zum aktuellen Abschnitt','Kostenlos','Abgeholt','Proviantnachschub','Materialkiste','Ausrüstungstruhe','Erhalte ein zufälliges Ausrüstungsteil','Nicht genügend Barren','Kauf abgeschlossen'],
    it: ['Ricompense rapide · 10 minuti','Monete e materiali in base al livello attuale','Gratis','Riscosso','Rifornimenti di viveri','Cassa di materiali','Forziere di equipaggiamento','Ricevi un pezzo di equipaggiamento casuale','Lingotti insufficienti','Acquisto completato'],
    ru: ['Быстрая награда · 10 минут','Монеты и материалы за текущий этап','Бесплатно','Получено','Запас провизии','Ящик материалов','Сундук снаряжения','Получите один случайный предмет снаряжения','Недостаточно слитков','Покупка завершена'],
    hi: ['तुरंत पुरस्कार · 10 मिनट','मौजूदा चरण के अनुसार सिक्के और सामग्री','मुफ़्त','प्राप्त','राशन की आपूर्ति','सामग्री का बक्सा','उपकरण की पेटी','एक यादृच्छिक उपकरण प्राप्त करें','पर्याप्त सिल्लियाँ नहीं हैं','खरीद पूरी हुई'],
    ar: ['مكافآت سريعة · 10 دقائق','عملات ومواد حسب المرحلة الحالية','مجانًا','تم الاستلام','إمدادات المؤن','صندوق مواد','صندوق معدات','احصل على قطعة معدات عشوائية','لا توجد سبائك كافية','اكتمل الشراء']
  };
  const shopText = index => (shopCopy[activeLocale()] || shopCopy.en)[index];
  function renderShop() {
    const quantity = (value, key) => resourceChip(Object.keys(resourceCopyKey).find(name => resourceCopyKey[name] === key), new Intl.NumberFormat(activeLocale()).format(value));
    openModal(copy('shop'), `<div class="list" data-runtime-localize="off"><div class="list-item"><div><p>${shopText(0)}</p><small>${shopText(1)}</small></div><button data-wp-frame-action="secondary" data-shop="quick" ${!state.daily.quick ? "disabled" : ""}>${shopText(state.daily.quick ? 2 : 3)}</button></div>
      <div class="list-item"><div><p>${shopText(4)}</p><small>${quantity(50,'resourceFood')}</small></div><button data-wp-frame-action="secondary" data-shop="food">${quantity(20,'resourceIngots')}</button></div>
      <div class="list-item"><div><p>${shopText(5)}</p><small>${quantity(20,'resourceMaterials')}</small></div><button data-wp-frame-action="secondary" data-shop="material">${quantity(35,'resourceIngots')}</button></div>
      <div class="list-item"><div><p>${itemArt('gear')}${shopText(6)}</p><small>${shopText(7)}</small></div><button data-wp-frame-action="secondary" data-shop="gear">${quantity(80,'resourceIngots')}</button></div></div>`);
  }

  function renderSettings() {
    openModal(battleOptionsLabel(), `<div class="settings-list">
      <div class="setting-row"><span>${copy("quality")}</span><select data-setting="quality"><option value="high" ${state.settings.quality === "high" ? "selected" : ""}>${copy("high")}</option><option value="low" ${state.settings.quality === "low" ? "selected" : ""}>${copy("low")}</option></select></div>
      <div class="setting-row"><span>${copy("damage")}</span><button data-wp-frame-action="tab" data-setting="damage" aria-label="${copy("damage")}" aria-pressed="${state.settings.damage}">${state.settings.damage ? "✓" : "—"}</button></div>
      <div class="setting-row"><span>${copy("save")}</span><strong>${copy("autoSave")}</strong></div>
      <div class="setting-row"><span>${copy("resetProgress")}</span><button data-wp-frame-action="secondary" data-reset="arm">${copy("reset")}</button></div></div>`);
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
      else {
        // beforeunload/visibility/autosave must not recreate the deleted save.
        localStorage.removeItem(C.saveKey);
        resettingProgress = true;
        clearInterval(battle.tickHandle);
        clearTimeout(battle.nextWaveHandle);
        location.reload();
      }
    }
  }

  function shopPurchase(id) {
    const costs = { food: 20, material: 35, gear: 80 };
    if (id === "quick" && state.daily.quick) {
      state.daily.quick = false; grant({ coins: Math.round((16 + state.stage * 4) * 600), materials: 6 + Math.floor(state.stage / 3) }); renderShop(); return;
    }
    const cost = costs[id];
    if (!cost || state.resources.ingots < cost) return toast(shopText(8));
    state.resources.ingots -= cost;
    if (id === "food") state.resources.food += 50;
    if (id === "material") state.resources.materials += 20;
    if (id === "gear") state.inventory.push({ uid: uid(), itemId: C.equipment[Math.floor(Math.random() * C.equipment.length)].id, level: 1 });
    toast(shopText(9)); updateHud(); renderShop(); save();
  }

  function calculateOffline() {
    const elapsed = clamp(Math.floor((Date.now() - Number(state.lastSave || Date.now())) / 1000), 0, C.maxOfflineSeconds);
    if (elapsed < 60) return;
    const coins = Math.floor(elapsed * (1.5 + state.stage * .24));
    const materials = Math.floor(elapsed / 900);
    grant({ coins, materials });
    openModal("離線收益", `<p>義軍在你離開的 ${Math.floor(elapsed / 60)} 分鐘持續巡守，收益最多累積 8 小時。</p><div class="reward-row">${resourceChip('coins', `+${fmt(coins)}`)}${resourceChip('materials', `+${materials}`)}</div>`);
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
    if (window.WonderSound?.isMuted?.()) return;
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
    $("#battleBack").addEventListener("click", requestBattleReturn);
    $('#leaveContinue').addEventListener('click', () => closeBattleReturn());
    $('#leaveMain').addEventListener('click', () => closeBattleReturn(true));
    $('#leaveConfirm').addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeBattleReturn(); }
      else if (event.key === 'Tab') {
        event.preventDefault();
        (document.activeElement === $('#leaveContinue') ? $('#leaveMain') : $('#leaveContinue')).focus();
      }
    });
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
    $('#modalLayer').addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeModal(); return; }
      if (event.key !== 'Tab') return;
      const items = [...$('#modal').querySelectorAll('button:not(:disabled),select:not(:disabled),input:not(:disabled),a[href],[tabindex="0"]')].filter(n => n.getClientRects().length && !n.closest('[inert]'));
      if (!items.length) return;
      const index = items.indexOf(document.activeElement);
      event.preventDefault();
      items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length].focus();
    });
    $("#modalLayer").addEventListener("click", (event) => { if (event.target === $("#modalLayer")) closeModal(); });
    $("#modalBody").addEventListener("click", modalAction);
    $("#modalBody").addEventListener("change", (event) => {
      if (event.target.dataset.setting === "quality") { state.settings.quality = event.target.value; document.body.dataset.quality = event.target.value; save(); }
    });
    $("#resultManage").addEventListener("click", () => { $("#resultPanel").classList.add("is-hidden"); battle.manageFromResult = true; openManagement("heroes"); });
    $("#resultNext").addEventListener("click", () => { if ($("#resultNext").disabled) return; state.stage += 1; state.wave = 1; $("#resultPanel").classList.add("is-hidden"); startWave(); save(); });
    $("#resultRetry").addEventListener("click", () => { $("#resultPanel").classList.add("is-hidden"); state.wave = 1; startWave(); });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (!$("#modalLayer").classList.contains("is-hidden")) closeModal();
      else if (!$("#management").classList.contains("is-hidden")) closeManagement();
    });
    window.addEventListener("beforeunload", save);
    document.addEventListener("visibilitychange", () => { if (document.hidden) save(); });
    setInterval(save, 5000);
  }

  function battleOptionsLabel() {
    return ({"zh-Hant":"戰鬥選項","zh-Hans":"战斗选项",en:"Battle options",ja:"戦闘オプション",ko:"전투 옵션",es:"Opciones de combate","pt-BR":"Opções de batalha",fr:"Options de combat",de:"Kampfoptionen",it:"Opzioni di battaglia",ru:"Настройки боя",hi:"युद्ध विकल्प",ar:"خيارات المعركة"})[activeLocale()] || "Battle options";
  }

  function syncFrameCoverage() {
    const scene = $("#app").dataset.scene;
    const modalOpen = !$('#modalLayer').classList.contains('is-hidden');
    const covered = modalOpen || (scene === "battle" && (!$("#resultPanel").classList.contains("is-hidden") || !$('#leaveConfirm').classList.contains('is-hidden')));
    sharedFrame?.activate(scene, {covered});
    $("#battleContent").inert = covered;
    $('#mainScene').inert = scene !== 'main' || modalOpen;
    document.querySelectorAll('.game-page-info').forEach(n => { n.inert = scene !== 'main' || modalOpen; });
  }

  function mountSharedFrame() {
    $('#coachNext').setAttribute('data-wp-frame-action', 'primary');
    const leaveDialog = document.createElement('section');
    leaveDialog.id = 'leaveConfirm';
    leaveDialog.className = 'leave-confirm is-hidden';
    leaveDialog.setAttribute('role', 'dialog');
    leaveDialog.setAttribute('aria-modal', 'true');
    leaveDialog.setAttribute('aria-labelledby', 'leaveTitle');
    leaveDialog.setAttribute('aria-describedby', 'leaveCopy');
    leaveDialog.innerHTML = '<div class="leave-card"><h2 id="leaveTitle"></h2><p id="leaveCopy"></p><div class="leave-actions"><button id="leaveContinue" type="button" data-wp-frame-action="primary"></button><button id="leaveMain" type="button" data-wp-frame-action="secondary"></button></div></div>';
    $('#battleScene').append(leaveDialog);
    // The hidden select is a locale data/action adapter, never a second panel.
    const localeSelect = document.createElement("select");
    localeSelect.id = "localeSelect";
    localeSelect.hidden = true;
    for (const code of localeOrder) localeSelect.add(new Option(localeLabels[code], code));
    localeSelect.value = activeLocale();
    localeSelect.addEventListener("change", () => {
      const next = localeSelect.value;
      if (!localeSegments[next]) return;
      localStorage.setItem("weightPlayLocale", next);
      localStorage.setItem("weightplayLocale", next);
      location.assign(`/${localeSegments[next]}/games/animal-peach-oath/${location.search}${location.hash}`);
    });
    $("#app").append(localeSelect);
    sharedFrame = window.WeightPlayScreenFrame.mount({root: $("#app"), localeSelect, scenes: {
      main: {root: $("#mainScene"), header: $("#mainScene > header"), content: $("#mainContent")},
      battle: {root: $("#battleScene"), header: $("#battleScene > header"), content: $("#battleContent"), headerInfo: $("#battleInfo")}
    }});
    sharedFrame.activate("main");
    const options = $('.quick-rail [data-open="settings"]');
    options.querySelector("span").textContent = battleOptionsLabel();
    options.setAttribute("aria-label", battleOptionsLabel());
  }

  applyLocale();
  mountSharedFrame();
  bind();
  updateHud();
  document.body.dataset.quality = state.settings.quality;
  calculateOffline();
})();
